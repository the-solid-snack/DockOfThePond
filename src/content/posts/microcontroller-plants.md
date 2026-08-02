---
title: "I taught a €4 microcontroller to water my plants"
date: 2026-07-18
summary: "What started as a soil sensor and a pump turned into three weekends of arguing with myself about interrupts. The plants are alive. My assumptions about embedded Rust are not."
topics: [Tech, Half-baked, English]
kicker: "Hardware · Field notes"
---

There is a specific kind of guilt that comes from killing a plant someone gave you.
Mine was a monstera, a housewarming gift, and it died the slow way — not from
neglect exactly, but from the enthusiastic overwatering of someone who checks on
things only when they remember to.

So I did what anyone with a drawer full of dev boards does: I made it a computing
problem. The plan was three parts and one evening. It took three weekends, and the
interesting part was not the part I expected.

## A pump, a sensor, a plan

The shopping list was almost embarrassingly cheap. An ESP32-C3 for about four euros,
a capacitive soil moisture sensor, a 5V peristaltic pump, and a MOSFET module to
switch it. Total, under twenty euros, most of which was shipping from somewhere that
took eleven days to tell me anything.

Use capacitive sensors, not the resistive ones. The resistive kind pass current
directly through the soil, which slowly electrolyses the probe into a sad green
crust. Mine lasted about six weeks in a previous life. Capacitive sensors measure
the dielectric of the surrounding medium instead, and they last more or less forever.

<figure>
<div class="img-ph"><span>Photo — breadboard, pump, one nervous plant</span></div>
<figcaption>The first working version, held together by optimism and a jumper wire that fell out twice during testing.</figcaption>
</figure>

The naive firmware was exactly what you'd write on the first try: read the sensor,
if it's dry run the pump for four seconds, sleep for an hour, repeat. It worked. It
also nearly drowned the plant on day two, for reasons that took me a while to see.

## Where the interrupts went wrong

The problem was that "read the sensor" is not a single fact, it's a noisy signal.
Watering the soil doesn't change the reading immediately — water takes minutes to
spread through the pot, and the sensor sits in one specific spot. So the loop
watered, read "still dry", watered again, and kept going until the saucer overflowed.

My first fix was the wrong one: I reached for a timer interrupt to enforce a
cooldown. This is where I want to be honest about how long I spent debugging
something that was never a timing problem. The interrupt fired correctly. The flag
was set correctly. The pump still ran, because the decision to run the pump lived in
a different place than the knowledge of whether it was allowed to.

> Nearly every embedded bug I've written was a state machine I refused to admit I was building.
>
> <cite>Me, on weekend two, out loud, to nobody</cite>

## Everything is a state machine

Once I wrote the states down on paper it took twenty minutes. There are four:
`Idle`, `Watering`, `Settling`, and `Fault`. The plant is either being left alone,
being watered, waiting for the water to distribute, or something is wrong and we
refuse to do anything at all.

In Rust this maps onto an enum almost too neatly, and the compiler starts doing the
work for you — you cannot forget a transition, because the match won't compile.

```rust
// The whole controller, more or less.
enum State {
    Idle,
    Watering { started: Instant },
    Settling { until: Instant },
    Fault(Reason),
}

impl State {
    fn step(self, m: Moisture, now: Instant) -> Self {
        match self {
            State::Idle if m.is_dry() =>
                State::Watering { started: now },

            State::Watering { started }
                if now - started > MAX_POUR =>
                    State::Fault(Reason::PumpTooLong),

            State::Watering { started }
                if now - started > POUR =>
                    State::Settling { until: now + SETTLE },

            State::Settling { until } if now >= until =>
                State::Idle,

            same => same, // nothing to do this tick
        }
    }
}
```

What I like about this shape is that the pump is no longer commanded from anywhere.
It's a function of the current state — if we're `Watering`, the pin is high;
otherwise it's low. There is exactly one place where that mapping happens, and it
can't disagree with itself.

<div class="callout">
<span class="label">If you're copying this</span>
<p>Add the Fault state before you need it. A pump that fails on and empties a two-litre reservoir onto a wooden floor is a much more expensive lesson than a compile error. Mine failed safe because I got lucky, not because I planned it.</p>
</div>

## Two weeks of numbers

The board logs every reading to a text file over Wi-Fi, which is overkill, but I
wanted to see the shape of the curve. Two weeks in:

- Average time between waterings: **4.2 days**, which is roughly twice as often as I would have guessed and half as often as I was actually doing it.
- Water per event: about **90 ml**. Small, frequent doses instead of one weekly flood.
- Faults: **one**, when the reservoir ran dry and the moisture reading never rose. Correctly refused to keep pumping.

The last one is the result I'm most pleased about, because it's the only one where
the system did something I hadn't personally thought through in advance.

---

## What I'd do differently

### Two sensors, not one

A single probe tells you about one cubic centimetre of soil. Two on opposite sides
of the pot, averaged, would have made the settling problem obvious on day one.

### Deep sleep from the start

I ran it on USB power for the whole experiment and only later thought about
batteries. The ESP32-C3 can drop to microamps between readings, but you have to
design the loop around waking up, not around staying awake.

### Write the states down first

Not the code. On paper, with arrows. I'd have saved a weekend, though I'd also have
learned less, which I suppose is the trade I keep making on purpose.

The monstera's replacement is doing fine. I check on it about as often as I used to,
which is to say rarely, and it no longer seems to mind.
