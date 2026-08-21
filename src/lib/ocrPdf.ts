import { createWorker } from "tesseract.js";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";

/** Render scanned pages and recover their text when a PDF has no text layer. */
export async function extractTextWithOcr(pdf: PDFDocumentProxy): Promise<string> {
  const worker = await createWorker("eng");
  const pages: string[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");

      if (!context) continue;

      await page.render({ canvas, canvasContext: context, viewport }).promise;
      const result = await worker.recognize(canvas);
      pages.push(result.data.text.trim());
    }
  } finally {
    await worker.terminate();
  }

  return pages.join("\n\n").trim();
}
