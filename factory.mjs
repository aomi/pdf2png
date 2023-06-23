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

import assert from "assert/strict";
import { createCanvas } from "canvas";

export class NodeCanvasFactory {
  /**
   * Creates a new canvas instance.
   * @param {number} width
   * @param {number} height
   * @returns {Object} The canvas instance.
   */
  create(width, height) {
    assert(width > 0 && height > 0, "Invalid canvas size");
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return { canvas, context };
  }

  /**
   * Resets the canvas to original size.
   * @param {*} canvasAndContext
   * @param {number} width
   * @param {number} height
   */
  reset(canvasAndContext, width, height) {
    assert(canvasAndContext.canvas, "Canvas is not specified");
    assert(width > 0 && height > 0, "Invalid canvas size");
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  /**
   * Destroys the canvas instance.
   * @param {*} canvasAndContext
   */
  destroy(canvasAndContext) {
    assert(canvasAndContext.canvas, "Canvas is not specified");
    // Zeroing the width and height causes Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}
