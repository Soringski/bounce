# Bounce

> *While your feet are stompin' and the jam is pumpin'* - Technotronic

An app that triggers Euclidean rhythms and audio patterns based on an *exciter* bouncing around inside a geometric *resonator*.
A fun experiment built with Electron, p5.js, JavaScript, HTML and CSS.

<!-- ![Bounce in action](docs/demo.gif) -->

## Features

Choose a shape for the resonator, set the exciter speed and with a click + drag of the mouse you set its path and watch it go!

## Getting started

```bash
git clone https://github.com/soringski/bounce.git
cd bounce
npm install
npm start
```

## How it works

<!-- Kort: hoe detecteer je botsingen, hoe worden die omgezet in triggers,
     hoe genereer je de euclidische ritmes? Dit is jouw eigen werk: laat het zien. -->

## Why?

As a Eurorack modular synth enthusiast, I love exploring unconventional ways of creating rhythm and sound.

The exciter/resonator concept comes from Intellijel's Plonk, a physical modelling percussion module in which an exciter (a mallet or a noise burst) strikes a virtual object. My take on Euclidean rhythms was influenced by modules like Qu-Bit's Pulsar.

This approach to generating triggers also draws heavily on the Ornament & Crime (o_C) module: Hemisphere Suite applets like LowerRenz, and its many fun clock generators.

## Credits

Everything in this repo is my own work, except for the parts listed below:

| Part | Source | Notes |
|---|---|---|
| Slider styling (CSS) | [CSSPortal](https://www.cssportal.com/) | Generated with CSSPortal's CSS generator for a minimal look |
| CSS RESET | [Erik Meyer](http://meyerweb.com/eric/tools/css/reset/) |  |
| Electron starter code | [Electron docs](https://www.electronjs.org/docs/latest/) | App lifecycle handling on Windows, Linux and macOS |
| `edgeIntersect()` in [`scripts/sketch.js`](scripts/sketch.js) | AI-assisted | Generated, then tested and documented by me |