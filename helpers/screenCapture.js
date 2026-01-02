// helpers/screenCapture.js
import screenshot from "screenshot-desktop";
import fs from "fs/promises";
import path from "path";

/**
 * Capture the desktop (cross-platform).
 * @param {Object} opts
 * @param {string} [opts.outputPath] full file path to save (optional)
 * @param {"png"|"jpg"} [opts.format="png"]
 * @param {number|string} [opts.screen] display id (optional)
 * @returns {Promise<Buffer|string>} Buffer if no outputPath, else outputPath
 */
export default async function screenCapture(opts = {}) {
  const {
    outputPath,
    format = "png",
    screen
  } = opts;

  const shotOpts = { format };
  if (screen !== undefined) shotOpts.screen = screen;

  if (outputPath) {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await screenshot({ ...shotOpts, filename: outputPath });
    return outputPath;
  }

  return screenshot(shotOpts);
}
