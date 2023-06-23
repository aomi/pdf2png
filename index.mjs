/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Modifications Copyright (C) 2023 Aomi Jokoji (github.com/aomi)

import Fastify from "fastify";
import pdfjs from "pdfjs-dist/legacy/build/pdf.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { NodeCanvasFactory } from "./factory.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Some PDFs need external cmaps.
const CMAP_URL = path.join(__dirname, "node_modules/pdfjs-dist/cmaps/");
const CMAP_PACKED = true;
// Where the standard fonts are located.
const STANDARD_FONT_DATA_URL = path.join(
  __dirname,
  "node_modules/pdfjs-dist/standard_fonts/"
);

const app = Fastify({ logger: true });
app.register(await import("@fastify/multipart"));

app.post("/", async function (req, reply) {
  // https://github.com/fastify/fastify-multipart
  const canvasFactory = new NodeCanvasFactory();

  // loading file from file system into typed array.
  const inputPath = "sample.pdf";
  // create a Uint8Array from the buffer
  const data = new Uint8Array(await fs.readFile(inputPath));

  // // Load the PDF file.
  const loadingTask = pdfjs.getDocument({
    data,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    standardFontDataUrl: STANDARD_FONT_DATA_URL,
    canvasFactory,
  });

  try {
    const doc = await loadingTask.promise;
    // Get the first page.
    const page = await doc.getPage(1);
    // Render the page on a Node canvas with 100% scale.
    const viewport = page.getViewport({ scale: 2.0 });
    const canvasAndContext = canvasFactory.create(
      viewport.width,
      viewport.height
    );
    const renderContext = {
      canvasContext: canvasAndContext.context,
      viewport,
    };

    await page.render(renderContext).promise;
    // Convert the canvas to an image buffer.
    const image = canvasAndContext.canvas.toBuffer();
    page.cleanup();
    //   return as image
    reply.type("image/png").send(image);
  } catch (reason) {
    console.log(reason);
    reply.status(500).send(reason);
  }
});

try {
  app.listen({ port: process.env.PORT || 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
