import robot from "robotjs";
import { sleep } from "./sleep.js";

// ---------------- Mappings & helpers ----------------
const PS_MAP = {
  CROSS: "enter",
  CIRCLE: "backspace",
  SQUARE: "s",
  TRIANGLE: "c",
  DPAD_UP: "up",
  DPAD_DOWN: "down",
  DPAD_LEFT: "left",
  DPAD_RIGHT: "right",
  L1: "q",
  L2: "w",
  R1: "e",
  R2: "4",
  L3: "6",
  RS_DOWN: "d",
  RS_UP: "u",
};

export async function repeat(name, times, sleepAfterTap = 100) {
  var holdMs = 80;
  for (let i = 0; i < times; i++) {
    await tapName(name, holdMs);
    //console.log("Sleep: " + sleepAfterTap);
    await sleep(sleepAfterTap);
  }
}

export function keyDownName(name) {
  //  console.log(name);
  const key = PS_MAP[name.toUpperCase()];
  robot.keyToggle(key, "down");
}
export function keyUpName(name) {
  const key = PS_MAP[name.toUpperCase()];
  robot.keyToggle(key, "up");
}

export function keyDown(key) {
  robot.keyToggle(key, "down");
}

export function keyUp(key) {
  robot.keyToggle(key, "up");
}

// Always releases key even if aborted during hold
export async function tap(key, holdMs = 225) {
  //  console.log("tap " + key + " " + holdMs);
  keyDown(key);
  try {
    await sleep(holdMs);
  } finally {
    keyUp(key);
  }
}
export async function tapName(name, holdMs = 225, settleMs = 100) {
  
//  console.log(name);

  //console.log("tapName " + name + " " + holdMs);
  const key = PS_MAP[name.toUpperCase()];
  if (!key) throw new Error(`Unknown button: ${name}`);
  await tap(key, holdMs);
  if (settleMs > 0) await sleep(settleMs);
}


/**
 * Tap a DPAD button while holding a modifier (TRIANGLE, SQUARE, or null).
 * @param {string} dpadName - e.g. "DPAD_LEFT" or "DPAD_RIGHT"
 * @param {string|null} modifier - "TRIANGLE", "SQUARE", or null
 * @param {number} holdMs - how long to hold DPAD press
 * @param {number} settleMs - pause after release
 */
export async function tapWithModifier(dpadName, modifier, holdMs = 225, settleMs = 100) {
  if (modifier) await keyDownName(modifier);

  await tapName(dpadName, holdMs, settleMs); // let tapName handle DPAD press

  if (modifier) await keyUpName(modifier);

  if (settleMs > 0) await sleep(settleMs);
}