"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import styles from "@/app/page.module.css";
import type { EventResource } from "@/lib/eventResources";

function PdfPreview({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1.15);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const resetTimer = window.setTimeout(() => {
      setPdf(null);
      setPageNumber(1);
      setError("");
    }, 0);

    import("pdfjs-dist/legacy/build/pdf.mjs").then(async (pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      try {
        const loadedPdf = await pdfjs.getDocument(url).promise;
        if (cancelled) {
          await loadedPdf.destroy();
          return;
        }
        setPdf(loadedPdf);
      } catch {
        if (!cancelled) setError("This PDF could not be previewed in the browser.");
      }
    }).catch(() => setError("The PDF viewer could not be loaded."));

    return () => {
      cancelled = true;
      window.clearTimeout(resetTimer);
    };
  }, [url]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    let cancelled = false;
    pdf.getPage(pageNumber).then(async (page) => {
      if (cancelled || !canvasRef.current) return;
      const viewport = page.getViewport({ scale: zoom });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvas, canvasContext: context, viewport }).promise;
    }).catch(() => setError("This PDF page could not be rendered."));

    return () => { cancelled = true; };
  }, [pdf, pageNumber, zoom]);

  if (error) return <div className={styles.previewError}>{error}<a href={url} target="_blank" rel="noreferrer">Open PDF externally ↗</a></div>;
  if (!pdf) return <div className={styles.previewLoading}>Preparing PDF preview...</div>;

  return (
    <div className={styles.pdfViewer}>
      <div className={styles.pdfControls}>
        <button type="button" disabled={pageNumber <= 1} onClick={() => setPageNumber((page) => page - 1)}>Previous</button>
        <span>Page {pageNumber} of {pdf.numPages}</span>
        <button type="button" disabled={pageNumber >= pdf.numPages} onClick={() => setPageNumber((page) => page + 1)}>Next</button>
        <button type="button" onClick={() => setZoom((value) => Math.max(.75, value - .15))}>−</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => setZoom((value) => Math.min(2.5, value + .15))}>+</button>
      </div>
      <div className={styles.pdfCanvasWrap}><canvas ref={canvasRef} /></div>
    </div>
  );
}

export function ResourcePreview({ resource }: { resource: EventResource }) {
  return resource.type === "PDF" ? (
    <PdfPreview url={resource.url} />
  ) : (
    <div className={styles.webPreview}>
      <iframe src={resource.url} title={resource.label} loading="lazy" />
      <p>Some sites block embedded previews. If the page does not load, <a href={resource.url} target="_blank" rel="noreferrer">open it externally ↗</a>.</p>
    </div>
  );
}
