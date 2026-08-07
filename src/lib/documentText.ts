const MAX_FILE_SIZE = 20 * 1024 * 1024;

function isTextItem(item: unknown): item is { str: string } {
  return typeof item === "object" && item !== null && "str" in item && typeof item.str === "string";
}

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("That file is larger than 20 MB. Please upload a smaller document.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (file.type === "text/plain" || extension === "txt") {
    return file.text();
  }

  if (file.type !== "application/pdf" && extension !== "pdf") {
    throw new Error("Upload a .txt or PDF file.");
  }

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  const document = await pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .map((item) => (isTextItem(item) ? item.str : ""))
        .join(" "),
    );
  }

  const text = pages.join("\n\n").trim();
  if (!text) {
    throw new Error("No selectable text was found in this PDF. Scanned PDFs need OCR first.");
  }
  return text;
}
