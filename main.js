import sharp from "sharp";
import readline from "readline";
import  screenCapture from "./helpers/screenCapture.js";
import path from "path";


import { sleep } from "./helpers/sleep.js";
import { waitForTemplate } from "./helpers/waitForTemplate.js";
import { tapName, keyDownName, keyUpName } from "./helpers/keys.js";

console.log(`\n[MAIN]\n`);
// ====================================================

// ================= CONFIG =================
const RUN_MINUTES = 5;
const END_TIME = Date.now() + RUN_MINUTES * 60 * 1000;
// ==========================================

// ---- LOAD TEMPLATE ONCE ----
const templatePath = "./template.png";

const templateBuffer = await sharp(templatePath).ensureAlpha().raw().toBuffer();

const templateMeta = await sharp(templatePath).metadata();

function logAction(msg) {
  console.log(`[ACTION ${new Date().toLocaleTimeString()}] ${msg}`);
}

let iteration = 0;

// ================= MAIN LOOP =================
while (Date.now() < END_TIME) {
  iteration++;
  console.log(`\n===== ITERATION ${iteration} START =====`);
  
  logAction("Initial delay");
  await sleep(5000);

  logAction("CROSS (keyUpName)");
  await keyUpName("CROSS");

  logAction("DPAD_LEFT (tap)");
  await tapName("DPAD_LEFT", 100);

  logAction("DPAD_UP (tap)");
  await tapName("DPAD_UP", 100);

  logAction("CROSS (tap)");
  await tapName("CROSS", 100, 1000);

  logAction("DPAD_UP (tap)");
  await tapName("DPAD_UP", 100);

  logAction("CROSS (tap)");
  await tapName("CROSS", 100, 1000);

  logAction("CROSS (tap)");
  await tapName("CROSS", 100, 1000);

  logAction("(no await) CROSS (key down)");
  keyDownName("CROSS");


/*
const displays = await (await import("screenshot-desktop")).default.listDisplays();

const out = path.join(
  process.cwd(),
  "debug",
  `screencap-display-1-${Date.now()}.png`
);

await screenCapture({
  outputPath: out,
  screen: displays[1].id
});*/

  logAction("Waiting for template...");
  await waitForTemplate({
    templateBuffer,
    templateMeta,
    displayIndex: 1,
    matchThresholdPct: 85,
    pollIntervalMs: 1000,
    debug: true,
  });

  
  logAction("CROSS (key up)");
  await keyUpName("CROSS");

  await sleep(8000);

  logAction("TRIANGLE (tap)");
  await tapName("TRIANGLE", 100, 1000);

  logAction("Post-action delay");
  await sleep(4000);

  logAction("DPAD_DOWN (tap)");
  await tapName("DPAD_DOWN", 100);

  logAction("DPAD_DOWN (tap)");
  await tapName("DPAD_DOWN", 100);

  logAction("CROSS (tap)");
  await tapName("CROSS", 100, 1000);

  await sleep(10000);

  logAction("Sequence complete");
  console.log(`===== ITERATION ${iteration} END =====`);
}

// ================= CLEAN EXIT =================
console.log("\n⏱️  Time limit reached. Stopping loop.");
await keyUpName("CROSS");
