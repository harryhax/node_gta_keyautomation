import fs from "fs/promises";
import path from "path";
import compareImages from "../screenDetection/compareImages.js";
import { sleep } from "./sleep.js";
import screenCapture from "./screenCapture.js";

export async function waitForTemplate({
  templateBuffer,
  templateMeta,
  displayIndex,
  matchThresholdPct = 95,
  pollIntervalMs = 2000,
  boundingBoxes = [],
  debug = false,
}) {
  let attempt = 0;

  console.log(`[WAIT] Waiting for template (display ${displayIndex})...`);

  while (true) {
    attempt++;

    const framePath = path.join(
      process.cwd(),
      "debug",
      `wait-frame-${displayIndex}-${Date.now()}.png`
    );

    await screenCapture({
      outputPath: framePath,
      screen: displayIndex
    });

    try {
      const { matchPct } = await compareImages(
        framePath,
        templateBuffer,
        {
          templateMeta,
          boundingBoxes,
          minMatchScore: matchThresholdPct,
          debug,
          outDir: "./debug",
        }
      );

      console.log(
        `[WAIT] Attempt ${attempt} → Match ${matchPct.toFixed(2)}%`
      );

      if (matchPct >= matchThresholdPct) {
        console.log(`[WAIT] ✅ Template detected`);
        return;
      }
    } finally {
      await fs.unlink(framePath).catch(() => {});
    }

    await sleep(pollIntervalMs);
  }
}
