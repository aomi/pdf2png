# pdf2png

A simple web service to convert PDF files to PNG images. It uses [pdf.js](https://mozilla.github.io/pdf.js/) to render the PDF files on a canvas and then converts the canvas to a PNG image.

Based on the example from [pdf.js](https://github.com/mozilla/pdf.js/blob/master/examples/node/pdf2png/pdf2png.js) with some modifications.

**This is work-in-progress and primarily intended for my own use. It is not production ready.**

## Background

Just a quick hack after realizing it is possible to have PDF to PNG conversion without Ghostscript, ImageMagick or other external tools ✨.

Might deploy this or might not. Just want it written down somewhere.
