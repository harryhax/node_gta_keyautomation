# node_chiaki_gta_repeatkeys

Automated screen-driven input bot for GTA V using Chiaki / Remote Play.

## Overview

This project is a **Node.js automation tool** that simulates PlayStation controller input on a PC while **watching the game screen for visual cues**. It is designed to work with **Chiaki / PS Remote Play**, allowing scripted controller actions to be synchronized with **on-screen state changes** in GTA V.
 
The core use case is automating repetitive in-game actions (menus, confirmations, exploits, grinding loops, etc.) while ensuring actions only proceed **after a specific visual condition appears on screen**.

In short:

- 🎮 Simulates PS controller inputs via keyboard events  
- 🖥️ Captures live screen frames from a specific display  
- 🧠 Compares frames against a reference image (template matching)  
- ⏳ Waits until the game reaches the expected state before continuing  
- 🔁 Repeats the sequence in a timed loop  

---

## How It Works

### High-Level Flow

1. Load a template image (`template.png`) representing a known in-game UI state  
2. Run a scripted input sequence (DPAD, CROSS, TRIANGLE, etc.)  
3. Capture the screen repeatedly  
4. Compare each capture to the template  
5. Pause execution until the template is detected  
6. Resume inputs once the state is confirmed  
7. Repeat until the configured time limit is reached  

This avoids blind delays and makes the automation resilient to lag, loading time, or animation variance.

---

## Key Features

### Controller Input Simulation
- Uses `robotjs` to simulate keyboard input  
- Maps PlayStation buttons to keyboard keys  
- Supports taps, holds, modifiers, and repeated actions  

### Screen Capture
- Cross-platform desktop capture via `screenshot-desktop`  
- Target a specific display index  
- Optional debug frame saving  

### Template Matching
- Uses `sharp` + `pixelmatch`  
- Full-frame or bounding-box comparison  
- Configurable match threshold  

### Deterministic Automation
- No hard-coded “wait X seconds and hope” logic  
- Progression only happens when the correct UI state is detected  

---

## Project Structure

```
.
├── main.js
├── template.png
├── helpers/
│   ├── keys.js
│   ├── sleep.js
│   ├── screenCapture.js
│   └── waitForTemplate.js
├── screenDetection/
│   └── compareImages.js
├── debug/
├── package.json
└── README.md
```

---

## Configuration

### Runtime Duration

In `main.js`:

```js
const RUN_MINUTES = 5;
```

Controls how long the automation loop runs before stopping cleanly.

### Template Matching

```js
await waitForTemplate({
  templateBuffer,
  templateMeta,
  displayIndex: 1,
  matchThresholdPct: 85,
  pollIntervalMs: 1000,
  debug: true,
});
```

---

## Usage

### Install Dependencies

```bash
npm install
```

### Run

```bash
npm start
```

Make sure:
- Chiaki / Remote Play is running  
- GTA V is visible on the target display  
- The game window is focused  

---

## Debug Output

When debug mode is enabled:
- Captured frames are temporarily saved  
- Matching regions are overlaid  
- Files are written to the `debug/` directory  

---

## Warnings & Notes

- `robotjs` requires accessibility permissions on macOS  
- Resolution, scaling, and UI changes affect template matching  
- This tool does not hook into GTA — it only sees pixels and presses keys  

---

## Author

Harry Scanlan  
info@harryhax.com  

---

## License

ISC
