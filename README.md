# Polar

**Watch how opinions form, spread, and divide.**

Polar is an interactive simulator that shows how people's opinions change when they talk to each other, consume media, and encounter views they disagree with. Each dot on screen represents a person. Watch them cluster, split apart, radicalize, or find common ground — depending on the kind of society you create.

It's built on real models from social science, but you don't need any background to use it. Pick a society type, press Play, and an AI narrator explains what's happening as it unfolds.

## How It Works

Every person in the simulation holds opinions on three issues, each on a scale from -1 to +1:

- **Conservative vs. Progressive** (x-axis, left to right)
- **Personal Freedom vs. Collective Safety** (y-axis, bottom to top)
- **Share Equally vs. Earn Your Own** (shown as dot color: blue to orange)

Each step of the simulation, people interact. When someone hears an opinion:

- **If it's close enough to their own**, they move a little toward it — they're persuaded.
- **If it's too far from what they believe**, they push *away* from it — they reject it and become more extreme.

That's the core dynamic. How far is "too far" depends on how open-minded someone is. How fast they move depends on how persuadable they are. These two simple rules — attraction to nearby views and rejection of distant ones — produce surprisingly rich behavior: consensus, polarization, fragmentation, echo chambers, and radicalization can all emerge from the same basic mechanism with different settings.

### What Makes People Different

Not everyone in the simulation is the same. Each person has a **stubbornness** level that determines how open-minded they are. Stubborn people (shown as bigger, brighter dots) have narrow tolerance — they reject most views that differ from theirs. Flexible people are open to a wider range and more easily persuaded.

### Where Opinions Come From

People hear opinions from three sources:

1. **Each other** — random conversations between pairs of people
2. **The news environment** — background messages that can be mixed, extreme, or moderate
3. **Media channels** — fixed broadcasters (like TV networks) that push a specific viewpoint to a portion of the population each step

The balance between peer conversations and media influence is adjustable.

### Confirmation Bias

When turned up, people absorb agreeable opinions faster and discount opposing ones more. This doesn't change *what* they hear — it changes how strongly they respond. High confirmation bias makes existing beliefs self-reinforcing, which leads to groups sealing themselves off from outside influence.

## Features

### Society Presets

Six research-backed scenarios that pre-configure all settings to demonstrate different dynamics:

| Preset | What happens | Key mechanism |
|---|---|---|
| **Open Society** | People gradually find common ground | High tolerance, almost no rejection |
| **Echo Chambers** | Self-sorted bubbles that stop communicating | Strong confirmation bias, peer-dominated |
| **Culture War** | Two camps with a disappearing center | Opposing media + high rejection |
| **Radicalization Spiral** | Extremists capture the moderate majority | Flexible moderates + stubborn extremists |
| **Tribal Factions** | Society shatters into many rigid fragments | Very low tolerance, everyone rejects everyone |
| **Melting Pot** | Diverse population slowly mixes | Low correlation, high tolerance, no bias |

Each preset is calibrated against the engine's actual tolerance mechanics (effective tolerance = open-mindedness x flexibility) to produce its described dynamics reliably.

### AI Commentary

A real-time AI narrator (powered by OpenAI gpt-4.1-mini) watches the simulation and explains what's happening in plain language — like a documentary commentator. It tracks how the population has evolved since the beginning, detects patterns like polarization cascades or moderate collapse, and connects what's happening to real-world phenomena.

The AI receives pre-computed statistics and trends (it never does its own math) and knows which preset you're running, so it can compare actual dynamics to what the model predicts.

### Fine-Tuning

All settings are adjustable. After selecting a preset, expand any section to tweak:

- **Population** — number of people, stubbornness variety, how correlated starting beliefs are
- **How People React** — open-mindedness, persuadability, pushback strength, confirmation bias
- **Information Sources** — the balance between peer conversations and news
- **News Climate** — whether background information is mixed, extreme, or moderate
- **Media Channels** — toggle and configure fixed broadcasters with different positions and audience reach

### Live Statistics

Real-time metrics track: number of distinct groups, a polarization index (0 = everyone agrees, 1 = maximum disagreement), average opinion on each axis, how spread out opinions are, and population counts for moderates, leaners, and extremists.

## The Science Behind It

Polar is based on the **bounded-confidence model** introduced by Deffuant, Neau, Amblard, and Weisbuch (2000). The core idea: people only update their opinions when exposed to views within their "latitude of acceptance" — everything else gets rejected, potentially causing a backfire effect.

### Key research this builds on

**Social Judgment Theory** (Sherif & Hovland, 1961) established that people have zones of acceptance and rejection around their current beliefs. Messages within the acceptance zone are persuasive; messages outside it can backfire and push people further away. This is the foundation of the bounded-confidence approach.

**The Deffuant Model** (Deffuant et al., 2000) introduced a mathematical model built on a similar intuition. Agents interact in random pairs, and each only updates their opinion when the other's view falls within their tolerance threshold. They discovered that a single parameter — how open-minded people are — determines whether a population converges to agreement, splits into a few camps, or fragments into many small groups. There's a critical threshold: below it, consensus is impossible.

**Single Extreme Convergence** (Deffuant et al., 2002) found a surprising result: when some people are more stubborn than others, moderates' openness becomes a vulnerability. Moderates listen to everyone, including extremists. Extremists only listen to people close to them. Over time, the extremists pull moderates toward them while remaining unmoved themselves.

**The 25% Tipping Point** (Centola et al., 2018) showed that a committed minority of roughly 25% can trigger a cascade that shifts an entire population's views — even when the majority initially disagrees.

**Filter Bubbles and Echo Chambers** (Pariser, 2011; Sunstein, 2001, 2017) describe how selective exposure to like-minded views creates self-reinforcing information environments. When combined with bounded confidence, confirmation bias accelerates within-group agreement while preventing cross-group communication.

**Affective Polarization** (Iyengar & Westwood, 2015) distinguishes between disagreeing on issues and actively disliking the other side. The rejection mechanism in Polar captures this: it's not just that people disagree, they actively push away from opposing views, which can create a self-reinforcing cycle.

**The Spiral of Silence** (Noelle-Neumann, 1974) describes how people self-censor when they perceive their views are in the minority. In Polar, this emerges naturally: when a dominant media source floods the environment, dissenting views become rare, and agents drift toward the dominant position without any explicit censorship.

**Contact Hypothesis** (Allport, 1954) suggests that cross-group interaction under the right conditions reduces prejudice. The Melting Pot preset demonstrates this: diverse populations with low confirmation bias and frequent cross-cutting interactions gradually moderate without homogenizing.

### How Polar extends the classic model

The original Deffuant model is one-dimensional (one opinion axis) with identical agents. Polar adds:

- **Three opinion axes** with optional correlation between them (political "packages")
- **Variable stubbornness** across the population (not everyone is equally set in their ways)
- **Confirmation bias** that modulates persuasion strength based on agreement
- **Media sources** as fixed-position broadcasters alongside peer interactions
- **Environmental messages** with configurable climate (mixed, extreme, moderate)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
git clone <repo-url>
cd polar
pnpm install
```

For AI commentary, create a `.env.local` file:

```
OPENAI_API_KEY=sk-your-key-here
```

The simulation works without an API key — you just won't get AI commentary.

### Run

```bash
pnpm dev
```

Open [localhost:3000](http://localhost:3000), pick a society, and press Play.

### Build

```bash
pnpm build
pnpm start
```

## Tech Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, HTML Canvas. The simulation engine and all analysis run client-side with zero additional runtime dependencies. AI commentary uses the OpenAI API via a server-side route.

## References

- Allport, G. W. (1954). *The Nature of Prejudice*. Addison-Wesley.
- Centola, D., Becker, J., Brackbill, D., & Baronchelli, A. (2018). Experimental evidence for tipping points in social convention. *Science*, 360(6393), 1116-1119.
- Deffuant, G., Neau, D., Amblard, F., & Weisbuch, G. (2000). Mixing beliefs among interacting agents. *Advances in Complex Systems*, 3(01n04), 87-98.
- Deffuant, G., Amblard, F., Weisbuch, G., & Faure, T. (2002). How can extremism prevail? A study based on the relative agreement interaction model. *Journal of Artificial Societies and Social Simulation*, 5(4).
- Hegselmann, R., & Krause, U. (2002). Opinion dynamics and bounded confidence: models, analysis and simulation. *Journal of Artificial Societies and Social Simulation*, 5(3).
- Iyengar, S., & Westwood, S. J. (2015). Fear and loathing across party lines. *American Journal of Political Science*, 59(3), 690-707.
- Noelle-Neumann, E. (1974). The spiral of silence: a theory of public opinion. *Journal of Communication*, 24(2), 43-51.
- Pariser, E. (2011). *The Filter Bubble: What the Internet Is Hiding from You*. Penguin Press.
- Sherif, M., & Hovland, C. I. (1961). *Social Judgment: Assimilation and Contrast Effects in Communication and Attitude Change*. Yale University Press.
- Sunstein, C. R. (2001). *Republic.com*. Princeton University Press.
- Sunstein, C. R. (2017). *#Republic: Divided Democracy in the Age of Social Media*. Princeton University Press.
