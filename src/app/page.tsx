"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import {
  preparedEvents,
  reviewCriteriaByCategory,
  type PreparedEvent,
} from "@/lib/preparedEvents";
import { extractTextFromFile } from "@/lib/documentText";
import { playUiClick } from "@/lib/uiSound";

const starterDraft = `Northstar Study Co. helps high-school students plan focused study sessions with short, local library workshops and a simple scheduling tool.

Our first-year goal is 240 paid memberships. We will measure workshop attendance, trial-to-member conversion, and the percentage of members who return each month.`;

function scoreFor(text: string, index: number): number {
  const lengthBonus = Math.min(10, Math.floor(text.trim().length / 120));
  return Math.min(96, [76, 68, 72, 62][index] + lengthBonus);
}

function eventResources(event: PreparedEvent) {
  const penaltyPointChecklistPdf =
    "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c6ee3d2b16972cb29b095_HS_PenaltyPointChecklist.pdf";
  const statementOfAssurancesPdf =
    "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c6a10f1b290dde7b30b67_HS_Fillable-PreparedStatement.pdf";
  const competitionAdviceUrl = "https://www.decadirect.org/subcategories/prepared-events";

  return [
    { label: "Official event page", type: "WEB", url: event.eventPage },
    { label: "2026-2027 DECA Guide", type: "PDF", url: "/resources/DECA-26-HS-Guide.pdf" },
    { label: "Guidelines", type: "PDF", url: event.resources.guidelinesPdf },
    {
      label: "Statement of assurances & integrity",
      type: "PDF",
      url: statementOfAssurancesPdf,
    },
    ...(event.category === "Professional Selling and Consulting"
      ? []
      : [
          { label: "Penalty point checklist", type: "PDF", url: penaltyPointChecklistPdf },
          { label: "Competition advice", type: "WEB", url: competitionAdviceUrl },
        ]),
    ...(event.resources.evaluationFormPdf
      ? [{ label: "Evaluation form", type: "PDF", url: event.resources.evaluationFormPdf }]
      : []),
    ...(event.resources.performanceIndicatorsPdf
      ? [{ label: "Performance indicators", type: "PDF", url: event.resources.performanceIndicatorsPdf }]
      : []),
  ];
}

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedCode, setSelectedCode] = useState(preparedEvents[0].code);
  const [draft, setDraft] = useState("");
  const [hasReview, setHasReview] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isResourceMenuOpen, setIsResourceMenuOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const selectedEvent =
    preparedEvents.find((event) => event.code === selectedCode) ?? preparedEvents[0];
  const criteria =
    reviewCriteriaByCategory[selectedEvent.category] ??
    reviewCriteriaByCategory.Entrepreneurship;
  const wordCount = useMemo(
    () => (draft.trim() ? draft.trim().split(/\s+/).length : 0),
    [draft],
  );
  const averageScore = Math.round(
    criteria.map((_, index) => scoreFor(draft, index)).reduce((a, b) => a + b, 0) /
      criteria.length,
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(() => setShowIntro(false), 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }
    const timer = window.setTimeout(() => setShowIntro(false), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  function runReview() {
    if (draft.trim().length < 40) return;
    setHasReview(true);
  }

  async function loadFile(file: File) {
    setIsReadingFile(true);
    setUploadError("");
    try {
      setDraft(await extractTextFromFile(file));
      setUploadedFileName(file.name);
      setHasReview(false);
      playUiClick();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Could not read that file.");
    } finally {
      setIsReadingFile(false);
    }
  }

  return (
    <>
      {showIntro ? (
        <div className={styles.intro} aria-label="DECA Draftroom loading">
          <div className={styles.introMark}>D</div>
          <p>DECA Draftroom</p>
          <span>Prepared writing, made clearer.</span>
        </div>
      ) : null}
      <main className={styles.shell} data-ready={!showIntro}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.mark}>D</span>
          <span>
            DECA <b>Draftroom</b>
          </span>
        </div>
        <div className={styles.topMeta}>
          <div className={styles.projectMenu}>
            <button
              className={styles.avatar}
              aria-label="Open project menu"
              aria-expanded={isProjectMenuOpen}
              onClick={() => setIsProjectMenuOpen((open) => !open)}
            >
              AS
            </button>
            {isProjectMenuOpen ? (
              <div className={styles.projectPopover} role="menu">
                <span className={styles.popoverLabel}>PROJECT MENU</span>
                <b>Draftroom workspace</b>
                <button role="menuitem" onClick={() => setIsProjectMenuOpen(false)}>
                  Close menu
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.workspace}>
          <div className={styles.workspaceHead}>
            <div>
              <h2>Make the next revision count.</h2>
              <p className={styles.workspaceIntro}>Choose an event, bring in your written, and work through feedback grounded in the official rubric.</p>
            </div>
          </div>

          <div className={styles.eventBar}>
            <div className={styles.eventPicker}>
              <label htmlFor="event">Prepared event</label>
              <select
                id="event"
                value={selectedCode}
                onChange={(event) => {
                  setSelectedCode(event.target.value);
                  setHasReview(false);
                  setIsResourceMenuOpen(false);
                }}
              >
                {preparedEvents.map((event) => (
                  <option key={event.code} value={event.code}>
                    {event.code} · {event.name}
                  </option>
                ))}
              </select>
              <p>
                Category: <b>{selectedEvent.category}</b>
              </p>
            </div>
            <div className={styles.eventTools}>
              <span className={styles.toolsLabel}>RUBRIC TOOLS</span>
              <div className={styles.resourceMenu}>
                <button
                  className={styles.resourceTrigger}
                  aria-expanded={isResourceMenuOpen}
                  aria-controls="event-resources"
                  onClick={() => setIsResourceMenuOpen((open) => !open)}
                >
                  <span>Event documents</span>
                  <small>{eventResources(selectedEvent).length} sources</small>
                  <i aria-hidden="true">⌄</i>
                </button>
                <div
                  id="event-resources"
                  className={styles.resourceList}
                  data-open={isResourceMenuOpen}
                  aria-hidden={!isResourceMenuOpen}
                >
                  <div className={styles.resourceListHead}>SOURCE LIBRARY</div>
                  {eventResources(selectedEvent).map((resource) => (
                    <a href={resource.url} target="_blank" rel="noreferrer" key={`${resource.label}-${resource.url}`}>
                      <span className={styles.resourceType}>{resource.type}</span>
                      <span className={styles.resourceName}>{resource.label}</span>
                      <b aria-hidden="true">↗</b>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.reviewGrid}>
            <div className={styles.editorPanel}>
              <div className={styles.panelTop}>
                <span className={styles.panelLabel}>01 / Draft input</span>
                <span className={styles.wordCount}>{wordCount} words</span>
              </div>
              <textarea
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setHasReview(false);
                }}
                placeholder="Paste your executive summary, written entry, or section draft..."
                aria-label="Written project draft"
              />
              <div className={styles.editorFoot}>
                <span>
                  {uploadedFileName
                    ? `Loaded ${uploadedFileName}`
                    : "Use your own work and sources. This tool supports revision planning."}
                </span>
                <div className={styles.editorActions}>
                  <label className={styles.uploadButton}>
                    <input
                      className={styles.fileInput}
                      type="file"
                      accept=".txt,.pdf,text/plain,application/pdf"
                       onChange={async (event) => {
                         const file = event.target.files?.[0];
                         event.target.value = "";
                         if (!file) return;
                         await loadFile(file);
                       }}
                     />
                     {isReadingFile ? "Reading…" : "Choose a PDF"}
                  </label>
                  <button
                    className={styles.clearButton}
                    type="button"
                    onClick={() => {
                      setDraft("");
                      setUploadedFileName("");
                      setUploadError("");
                      setHasReview(false);
                    }}
                    disabled={!draft && !uploadedFileName && !uploadError}
                  >
                    Clear
                  </button>
                  <button className={styles.textButton} onClick={() => {
                    setDraft(starterDraft);
                    setUploadedFileName("");
                    setUploadError("");
                  }}>
                    Use starter draft ↗
                  </button>
               </div>
              </div>
              <label
                className={styles.dropzone}
                data-dragging={isDraggingFile}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={async (event) => {
                  event.preventDefault();
                  setIsDraggingFile(false);
                  const file = event.dataTransfer.files[0];
                  if (file) await loadFile(file);
                }}
              >
                <input
                  className={styles.fileInput}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) await loadFile(file);
                  }}
                />
                <span className={styles.dropzoneIcon}>↑</span>
                <span>
                  <b>Drop your written here</b>
                  <small>PDFs up to 20 MB, selectable text works best</small>
                </span>
              </label>
              {uploadError ? <p className={styles.uploadError} role="alert">{uploadError}</p> : null}
              <button
                className={styles.primaryButton}
                onClick={() => {
                  playUiClick();
                  runReview();
                }}
                disabled={wordCount < 8}
              >
                Analyze this draft <span>→</span>
              </button>
            </div>

            <div className={styles.feedbackPanel}>
              <div className={styles.panelTop}>
                <span className={styles.panelLabel}>02 / Rubric-aligned feedback</span>
                <span className={styles.aiTag}>Architecture pass</span>
              </div>
              {!hasReview ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>✎</div>
                  <h3>Draft feedback appears after analysis.</h3>
                  <p>
                    This version is focused on reliable rubric wiring by event. Deeper prompt
                    engineering comes next.
                  </p>
                </div>
              ) : (
                <div className={styles.results}>
                  <div className={styles.scoreLine}>
                    <div>
                      <span className={styles.resultLabel}>Draft signal</span>
                      <strong>
                        {averageScore}
                        <small>/100</small>
                      </strong>
                    </div>
                    <span className={styles.scoreBadge}>Event-aware pass</span>
                  </div>
                  <div className={styles.rubricList}>
                    {criteria.map((item, index) => (
                      <div className={styles.rubric} key={item}>
                        <div>
                          <span>{item}</span>
                          <b>{scoreFor(draft, index)}</b>
                        </div>
                        <div className={styles.track}>
                          <i style={{ width: `${scoreFor(draft, index)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.callout}>
                    <span>01</span>
                    <p>
                      <b>Anchor each claim to evidence.</b> Connect your goal, customer insight,
                      and recommendation to a cited source or observation.
                    </p>
                  </div>
                  <div className={styles.callout}>
                    <span>02</span>
                    <p>
                      <b>Use the official documents while revising.</b> Open the event guideline
                      and evaluation links above as your primary rubric reference.
                    </p>
                  </div>
                  <button
                    className={styles.secondaryButton}
                    onClick={() =>
                      setDraft(
                        (previousDraft) =>
                          `${previousDraft}\n\nRevision note: align claims to event rubric wording.`,
                      )
                    }
                  >
                    Add rubric revision note <span>+</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <footer className={styles.footer}>
        <span>DECA Draftroom · prepared-event architecture build</span>
        <span>Rubric links are sourced from deca.org event pages.</span>
      </footer>
    </main>
    </>
  );
}
