import sharp from "sharp";
import pixelmatch from "pixelmatch";
import path from "path";
import fs from "fs/promises";

/**
 * Compare a frame (file path or buffer) against a preloaded template buffer.
 *
 * @param {string|Buffer} frameInput - Image file path or PNG buffer.
 * @param {Buffer} templateBuffer - Raw RGBA buffer of the template image.
 * @param {object} config - Comparison configuration.
 * @returns {Promise<{ matchPct: number }>} Match percentage result.
 */
export default async function compareImages(
  frameInput,
  templateBuffer,
  config
) {
  const {
    templateMeta,
    pixelmatchThreshold = 0.1,
    boundingBoxes = [],
    debug = false,
    minMatchScore = null,
    outDir = "./debug",
  } = config;

  // Detect whether input is a file path or a raw buffer
  const isBuffer = Buffer.isBuffer(frameInput);
  const frameLabel = isBuffer ? "frame" : path.basename(frameInput);
  const frameSource = isBuffer ? frameInput : await fs.readFile(frameInput);

  const imgMeta = await sharp(frameSource).metadata();

  let totalDiff = 0;
  let totalPixels = 0;

  // --- Bounding Box Comparison ---
  if (boundingBoxes.length) {
    for (const { x, y, width, height } of boundingBoxes) {
      try {
        const tplBuf = await sharp(templateBuffer, {
          raw: {
            width: templateMeta.width,
            height: templateMeta.height,
            channels: 4,
          },
        })
          .extract({ left: x, top: y, width, height })
          .raw()
          .toBuffer();

        const imgBuf = await sharp(frameSource)
          .extract({ left: x, top: y, width, height })
          .ensureAlpha()
          .raw()
          .toBuffer();

        totalDiff += pixelmatch(tplBuf, imgBuf, null, width, height, {
          threshold: pixelmatchThreshold,
        });
        totalPixels += width * height;
      } catch (err) {
        console.warn(
          `Skipping invalid region (${x},${y},${width},${height}) in ${frameLabel}: ${err.message}`
        );
      }
    }
  } else {
    // --- Full Image Comparison ---
    const tplBuf = templateBuffer;
    const tplMeta = templateMeta;

    const imgBuf = await sharp(frameSource).ensureAlpha().raw().toBuffer();


        console.log(
          "TEMPLATE:",
          templateMeta.width,
          templateMeta.height,
          templateBuffer.length
        );

        console.log("FRAME:", imgMeta.width, imgMeta.height, imgBuf.length);

        
    totalPixels = Math.min(
      tplMeta.width * tplMeta.height,
      imgMeta.width * imgMeta.height
    );
    totalDiff = pixelmatch(
      tplBuf,
      imgBuf,
      null,
      Math.min(tplMeta.width, imgMeta.width),
      Math.min(tplMeta.height, imgMeta.height),
      { threshold: pixelmatchThreshold }
    );
  }

  const matchPct =
    totalPixels > 0 ? ((totalPixels - totalDiff) / totalPixels) * 100 : 0;
  const roundedPct = Math.round(matchPct);

  // --- Optional Debug Output ---
  if (debug && (minMatchScore === null || matchPct >= minMatchScore)) {
    await fs.mkdir(outDir, { recursive: true });
    const base = isBuffer
      ? `${frameLabel}_${Date.now()}`
      : path.basename(frameInput, path.extname(frameInput));

    const svgRects = boundingBoxes
      .map(
        (b) =>
          `<rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" fill="none" stroke="red" stroke-width="4"/>`
      )
      .join("");
    const svgImage = `<svg width="${imgMeta.width}" height="${imgMeta.height}" xmlns="http://www.w3.org/2000/svg">${svgRects}</svg>`;

    const outputFile = path.join(outDir, `${base}_matched_${roundedPct}.png`);

    await sharp(frameSource)
      .composite([{ input: Buffer.from(svgImage), top: 0, left: 0 }])
      .png()
      .toFile(outputFile);

    console.log(`Saved debug overlay: ${outputFile}`);
  }

  return { matchPct };
}
