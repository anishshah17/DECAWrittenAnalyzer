"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import {
  preparedEvents,
} from "@/lib/preparedEvents";
import { extractTextFromFile } from "@/lib/documentText";
import { playUiClick } from "@/lib/uiSound";
import { getRubricAreas, getRubricSubsections } from "@/lib/rubricSections";
import { getEventResources } from "@/lib/eventResources";
import { getEqualPointAllocation } from "@/lib/scoring";

const starterDraft = `Northstar Study Co. helps high-school students plan focused study sessions with short, local library workshops and a simple scheduling tool.

Our first-year goal is 240 paid memberships. We will measure workshop attendance, trial-to-member conversion, and the percentage of members who return each month.`;

type AnalysisScore = { label: string; score: number; maxScore: number; evidence?: string; missing?: string[]; nextStep?: string };
type DetectedEvent = { code: string; name: string; category: string; confidence: number; reason: string };

function scoreFor(text: string, index: number): number {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const targetWords = 7500;
  const completeness = Math.min(1, wordCount / targetWords);
  const baseScore = [76, 68, 72, 62][index];
  const score = baseScore * (0.35 + completeness * 0.65);
  return Math.max(18, Math.min(96, Math.round(score)));
}

export default function Home() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [selectedCode, setSelectedCode] = useState(preparedEvents[0].code);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>(
    getRubricSubsections(preparedEvents[0].category),
  );
  const [draft, setDraft] = useState("");
  const [hasReview, setHasReview] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const [analysisScores, setAnalysisScores] = useState<AnalysisScore[]>([]);
  const [analysisOverallScore, setAnalysisOverallScore] = useState<number | null>(null);
  const [analysisError, setAnalysisError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDetectingEvent, setIsDetectingEvent] = useState(false);
  const [detectedEvent, setDetectedEvent] = useState<DetectedEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [eventConfirmed, setEventConfirmed] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const selectedEvent =
    preparedEvents.find((event) => event.code === selectedCode) ?? preparedEvents[0];
  const rubricAreas = getRubricAreas(selectedEvent.category);
  const criteria = getRubricSubsections(selectedEvent.category);
  const wordCount = useMemo(
    () => (draft.trim() ? draft.trim().split(/\s+/).length : 0),
    [draft],
  );
  const averageScore = Math.round(
    selectedCriteria.map((_, index) => scoreFor(draft, index)).reduce((a, b) => a + b, 0) /
      Math.max(1, selectedCriteria.length),
  );
  const fallbackMaxScores = getEqualPointAllocation(selectedCriteria.length);
  const fallbackScores: AnalysisScore[] = selectedCriteria.map((label, index) => ({
    label,
    score: Math.round((scoreFor(draft, index) / 100) * fallbackMaxScores[index] * 100) / 100,
    maxScore: fallbackMaxScores[index],
  }));
  const rubricScores = analysisScores.length === selectedCriteria.length ? analysisScores : fallbackScores;
  const displayedScore = analysisOverallScore ?? averageScore;
  const needsEventConfirmation = Boolean(uploadedFileName);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(() => setShowIntro(false), 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }
    const timer = window.setTimeout(() => setShowIntro(false), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  async function runReview() {
    if (draft.trim().length < 40 || !selectedCriteria.length) return;
    setIsAnalyzing(true);
    setAnalysisError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft,
          eventName: selectedEvent.name,
          category: selectedEvent.category,
          criteria: selectedCriteria,
          eventPage: selectedEvent.eventPage,
          eventCode: selectedEvent.code,
        }),
      });
      const result = (await response.json()) as {
        feedbackMarkdown?: string;
        overallScore?: number;
        rubricScores?: AnalysisScore[];
        error?: string;
      };
      if (!response.ok || !result.feedbackMarkdown || !result.rubricScores) {
        throw new Error(result.error ?? "Analysis failed.");
      }
      setAnalysisText(result.feedbackMarkdown);
      setAnalysisScores(result.rubricScores);
      setAnalysisOverallScore(result.overallScore ?? null);
      setHasReview(true);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "Analysis failed.");
      setHasReview(false);
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function loadFile(file: File) {
    setIsReadingFile(true);
    setUploadError("");
    try {
      const extractedText = await extractTextFromFile(file);
      setDraft(extractedText);
      setUploadedFileName(file.name);
      setHasReview(false);
      setAnalysisText("");
                   setAnalysisScores([]);
                   setAnalysisOverallScore(null);
       setSelectedCriteria(getRubricSubsections(selectedEvent.category));
                   if (uploadedFileName) setEventConfirmed(false);
      setEventConfirmed(false);
      setDetectedEvent(null);
      setIsDetectingEvent(true);
      setShowEventDialog(true);
      const response = await fetch("/api/detect-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: extractedText }),
      });
      const result = (await response.json()) as DetectedEvent & { error?: string };
      if (!response.ok || !result.code) throw new Error(result.error ?? "Could not identify the event.");
      setSelectedCode(result.code);
      setSelectedCriteria(getRubricSubsections(result.category));
      setDetectedEvent(result);
      setShowEventDialog(true);
      playUiClick();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Could not read that file.");
      setShowEventDialog(true);
    } finally {
      setIsDetectingEvent(false);
      setIsReadingFile(false);
    }
  }

  function confirmEvent() {
    setEventConfirmed(true);
    setShowEventDialog(false);
    setUploadError("");
  }

  function cancelEventConfirmation() {
    setShowEventDialog(false);
    setEventConfirmed(false);
  }

  function clearDraft() {
    setDraft("");
    setUploadedFileName("");
    setUploadError("");
    setHasReview(false);
    setAnalysisText("");
    setAnalysisScores([]);
    setAnalysisOverallScore(null);
    setDetectedEvent(null);
    setShowEventDialog(false);
    setEventConfirmed(false);
  }

  function changeAnalysisScope(nextCriteria: string[]) {
    setSelectedCriteria(nextCriteria);
    setHasReview(false);
    setAnalysisText("");
    setAnalysisScores([]);
    setAnalysisOverallScore(null);
    setAnalysisError("");
  }

  function openDetailedFeedback() {
    window.localStorage.setItem(
      "deca-draftroom-feedback-v2",
      JSON.stringify({
        eventName: selectedEvent.name,
        category: selectedEvent.category,
        score: displayedScore,
        wordCount,
        text: analysisText,
        rubricScores,
      }),
    );
    router.push("/feedback");
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
      {showEventDialog ? (
        <div className={styles.dialogBackdrop} role="presentation">
          <section className={styles.eventDialog} role="dialog" aria-modal="true" aria-labelledby="event-dialog-title">
            <span className={styles.panelLabel}>CHECK THE MATCH</span>
            <h2 id="event-dialog-title">Is this the correct event?</h2>
            {isDetectingEvent ? (
              <p className={styles.dialogCopy}>Reading your written and comparing it with the event catalog...</p>
            ) : (
              <>
                {detectedEvent ? (
                  <div className={styles.detectedMatch}>
                    <span>Suggested match · {detectedEvent.confidence}% confidence</span>
                    <strong>{detectedEvent.code} · {detectedEvent.name}</strong>
                    <p>{detectedEvent.reason}</p>
                  </div>
                ) : <p className={styles.dialogCopy}>{uploadError || "The event could not be detected. Choose the correct event manually before continuing."}</p>}
                <label className={styles.dialogLabel} htmlFor="confirm-event">Use this event or choose another</label>
                <select
                  id="confirm-event"
                  value={selectedCode}
                onChange={(event) => {
                   const nextEvent = preparedEvents.find((item) => item.code === event.target.value) ?? preparedEvents[0];
                   const nextCriteria = getRubricSubsections(nextEvent.category);
                   setSelectedCode(nextEvent.code);
                   changeAnalysisScope(nextCriteria);
                    setEventConfirmed(false);
                  }}
                >
                  {preparedEvents.map((event) => <option key={event.code} value={event.code}>{event.code} · {event.name}</option>)}
                </select>
              </>
            )}
            <div className={styles.dialogActions}>
              <button className={styles.textButton} type="button" onClick={cancelEventConfirmation}>Cancel</button>
              <button className={styles.primarySmallButton} type="button" onClick={confirmEvent} disabled={isDetectingEvent}>
                Confirm event <span>→</span>
              </button>
            </div>
          </section>
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
                  const nextEvent = preparedEvents.find((item) => item.code === event.target.value) ?? preparedEvents[0];
                  const nextCriteria = getRubricSubsections(nextEvent.category);
                  setSelectedCode(nextEvent.code);
                  setSelectedCriteria(nextCriteria);
                  setHasReview(false);
                  setAnalysisText("");
                  setAnalysisError("");
                  setAnalysisScores([]);
                  setAnalysisOverallScore(null);
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
              <div className={styles.knowledgeHeader}>
                <span className={styles.toolsLabel}>KNOWLEDGE BASE</span>
                <small>{getEventResources(selectedEvent).length} references</small>
              </div>
              <Link className={styles.knowledgeLink} href={`/knowledge-base?event=${selectedCode}`}>
                <span>Open {selectedCode} resource gallery</span>
                <b aria-hidden="true">→</b>
              </Link>
              <p className={styles.knowledgeDescription}>Browse official documents, examples, checklists, and advisor material in one place.</p>
            </div>
          </div>

          <div className={styles.analysisLayout}>
          <section className={styles.focusPanel} aria-labelledby="focus-heading">
            <div className={styles.focusHeader}>
              <div>
                <span className={styles.toolsLabel}>ANALYSIS SCOPE</span>
                <h3 id="focus-heading">Choose written-entry sections</h3>
              </div>
              <div className={styles.focusActions}>
                <button type="button" onClick={() => changeAnalysisScope(criteria)}>All sections</button>
                <button type="button" onClick={() => changeAnalysisScope([])}>Clear all</button>
              </div>
            </div>
            <div className={styles.focusGroups}>
              {rubricAreas.map((area, areaIndex) => (
                <details className={styles.focusGroup} open key={area.title}>
                  <summary><em>{String(areaIndex + 1).padStart(2, "0")}</em><span>{area.title}</span><i aria-hidden="true">⌄</i></summary>
                  <div className={styles.focusSubsections}>
                    {area.subsections.map((section) => {
                      const isSelected = selectedCriteria.includes(section);
                      return (
                        <label className={styles.focusOption} data-selected={isSelected} key={section}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => changeAnalysisScope(isSelected
                              ? selectedCriteria.filter((item) => item !== section)
                              : [...selectedCriteria, section])}
                          />
                          <span>{section}</span>
                        </label>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
            <p className={styles.focusHint}>
              {selectedCriteria.length
                ? `Gemini will focus on ${selectedCriteria.length} selected section${selectedCriteria.length === 1 ? "" : "s"}.`
                : "Select at least one section before analyzing."}
            </p>
          </section>

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
                       clearDraft();
                       setAnalysisError("");
                    }}
                    disabled={!draft && !uploadedFileName && !uploadError}
                  >
                    Clear
                  </button>
                  <button className={styles.textButton} onClick={() => {
                   setDraft(starterDraft);
                   setUploadedFileName("");
                   setUploadError("");
                   setEventConfirmed(false);
                   setDetectedEvent(null);
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
                disabled={wordCount < 8 || !selectedCriteria.length || isAnalyzing || (needsEventConfirmation && !eventConfirmed)}
              >
                {isAnalyzing ? "Analyzing..." : needsEventConfirmation && !eventConfirmed ? "Confirm event to analyze" : "Analyze this draft"} <span>→</span>
              </button>
              {analysisError ? <p className={styles.uploadError} role="alert">{analysisError}</p> : null}
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
                      <span className={styles.resultLabel}>Draft score</span>
                      <strong>
                        {displayedScore.toFixed(1)}
                        <small>/100</small>
                      </strong>
                    </div>
                    <span className={styles.scoreBadge}>Event-aware pass</span>
                  </div>
                    <div className={styles.rubricList}>
                      {rubricScores.map((item) => (
                        <div className={styles.rubric} key={item.label}>
                          <div>
                            <span>{item.label}</span>
                            <b>{item.score.toFixed(2)}<small>/{item.maxScore}</small></b>
                          </div>
                          <div className={styles.track}>
                            <i style={{ width: `${item.maxScore ? (item.score / item.maxScore) * 100 : 0}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className={styles.detailButton} onClick={openDetailedFeedback} type="button">
                      View detailed feedback for every subsection <span>↗</span>
                    </button>
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
