eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-add ~/.ssh/id_ed25519_harryhax


https://socialclub.rockstargames.com/job/gtav/WADxFZkC_U-fu3APp5_c0A


https://www.reddit.com/r/gtaglitches/comments/1pxxe7m/improved_insane_rp_exploit_3750_rp_every_1020/



Automated screen-driven input bot for GTA V using Chiaki / Remote Play.

Overview

This project is a Node.js automation tool that simulates PlayStation controller input on a PC while watching the game screen for visual cues. It is designed to work with Chiaki / PS Remote Play, allowing scripted controller actions to be synchronized with on-screen state changes in GTA V.

The core use case is automating repetitive in-game actions (menus, confirmations, exploits, grinding loops, etc.) while ensuring actions only proceed after a specific visual condition appears on screen.

In short:

🎮 Simulates PS controller inputs via keyboard events

🖥️ Captures live screen frames from a specific display

🧠 Compares frames against a reference image (template matching)

⏳ Waits until the game reaches the expected state before continuing

🔁 Repeats the sequence in a timed loop

How It Works
High-Level Flow

Load a template image (template.png) representing a known in-game UI state

Run a scripted input sequence (DPAD, CROSS, TRIANGLE, etc.)

Capture the screen repeatedly

Compare each capture to the template

Pause execution until the template is detected

Resume inputs once the state is confirmed

Repeat until the configured time limit is reached

This avoids blind delays and makes the automation resilient to lag, loading time, or animation variance.

Key Features
Controller Input Simulation

Uses robotjs to simulate keyboard input

Maps PlayStation buttons to keyboard keys

Supports:

Taps

Holds

Modifier + DPAD combos

Repeated actions

Screen Capture

Cross-platform desktop capture via screenshot-desktop

Target a specific display index (ideal for multi-monitor setups)

Optional debug frame saving

Template Matching

Uses sharp + pixelmatch

Compares live frames against a preloaded RGBA template

Supports:

Full-frame matching

Bounding box matching (for UI elements only)

Match percentage threshold configurable

Deterministic Automation

No hard-coded “wait X seconds and hope”

Progression only happens when the correct UI state is detected

Ideal for GTA Online menus, post-mission screens, RP screens, etc.

Project Structure
.
├── main.js                  # Main automation loop
├── template.png             # Reference UI image to wait for
├── helpers/
│   ├── keys.js              # Controller → keyboard mapping
│   ├── sleep.js             # Async timing utility
│   ├── screenCapture.js     # Desktop screenshot helper
│   └── waitForTemplate.js   # Visual state synchronization
├── screenDetection/
│   └── compareImages.js     # Pixel comparison logic
├── debug/                   # Optional debug output (auto-created)
├── package.json
└── README.md

Configuration
Runtime Duration

In main.js:

const RUN_MINUTES = 5;


Controls how long the automation loop runs before stopping cleanly.

Template Matching
await waitForTemplate({
  templateBuffer,
  templateMeta,
  displayIndex: 1,
  matchThresholdPct: 85,
  pollIntervalMs: 1000,
  debug: true,
});


displayIndex: Which monitor Chiaki is running on

matchThresholdPct: How close the frame must match (0–100)

pollIntervalMs: How often screenshots are taken

debug: Saves overlay images showing matched regions

Controller Mapping

Defined in helpers/keys.js:

const PS_MAP = {
  CROSS: "enter",
  CIRCLE: "backspace",
  DPAD_UP: "up",
  DPAD_DOWN: "down",
  TRIANGLE: "c",
  // ...
};


Adjust these mappings to match your Chiaki / Remote Play key bindings.

Usage
Install Dependencies
npm install

Run
npm start


Make sure:

Chiaki / Remote Play is running

GTA V is visible on the target display

The game window is focused (robotjs requires focus)

Debug Output

When debug mode is enabled:

Captured frames are temporarily saved

Matching regions are overlaid in red

Files are written to the debug/ directory

This is useful for tuning thresholds or bounding boxes.

Use Cases

GTA Online RP grinding

Menu-driven exploits

AFK loops that require confirmations

Testing UI-driven automation workflows

Any screen-synchronized input automation

Warnings & Notes

robotjs requires accessibility permissions on macOS

Resolution, scaling, and UI changes will affect template matching

This tool does not interact with GTA directly — it only sees pixels and presses keys

Author

Harry Scanlan
info@harryhax.com

License

ISC