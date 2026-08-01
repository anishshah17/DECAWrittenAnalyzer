"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";
import {
  preparedEvents,
  reviewCriteriaByCategory,
  type PreparedEvent,
} from "@/lib/preparedEvents";

const starterDraft = `Northstar Study Co. helps high-school students plan focused study sessions with short, local library workshops and a simple scheduling tool.

Our first-year goal is 240 paid memberships. We will measure workshop attendance, trial-to-member conversion, and the percentage of members who return each month.`;

function scoreFor(text: string, index: number): number {
  const lengthBonus = Math.min(10, Math.floor(text.trim().length / 120));
  return Math.min(96, [76, 68, 72, 62][index] + lengthBonus);
}

function eventResources(event: PreparedEvent) {
  return [
    { label: "Official event page", url: event.eventPage },
    { label: "Guidelines PDF", url: event.resources.guidelinesPdf },
    ...(event.resources.evaluationFormPdf
      ? [{ label: "Evaluation form PDF", url: event.resources.evaluationFormPdf }]
      : []),
    ...(event.resources.performanceIndicatorsPdf
      ? [{ label: "Performance indicators PDF", url: event.resources.performanceIndicatorsPdf }]
      : []),
  ];
}

export default function Home() {
  const [selectedCode, setSelectedCode] = useState(preparedEvents[0].code);
  const [draft, setDraft] = useState("");
  const [hasReview, setHasReview] = useState(false);
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

  function runReview() {
    if (draft.trim().length < 40) return;
    setHasReview(true);
  }

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.mark}>D</span>
          <span>
            DECA <b>Draftroom</b>
          </span>
        </div>
        <div className={styles.topMeta}>
          <span className={styles.statusDot} />
          Prepared-event rubric workspace
          <button className={styles.avatar}>AS</button>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.kicker}>Architecture focus</div>
          <h1>
            Rubrics first, <em>feedback second.</em>
          </h1>
          <p className={styles.sideIntro}>
            Each prepared event is mapped to source links from deca.org so the app can stay
            traceable and maintainable.
          </p>
          <div className={styles.sidebarNote}>
            <span>✦</span>
            <p>
              Current catalog: {preparedEvents.length} prepared events with event pages and
              guideline links.
            </p>
          </div>
        </aside>

        <section className={styles.workspace}>
          <div className={styles.workspaceHead}>
            <div>
              <div className={styles.eyebrow}>Workspace / Prepared events</div>
              <h2>Analyze your draft against the selected event rubric</h2>
            </div>
            <span className={styles.sourceTag}>Source: deca.org competitive events pages</span>
          </div>

          <div className={styles.eventBar}>
            <label htmlFor="event">Prepared event</label>
            <select
              id="event"
              value={selectedCode}
              onChange={(event) => {
                setSelectedCode(event.target.value);
                setHasReview(false);
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
            <div className={styles.rubricList}>
              {eventResources(selectedEvent).map((resource) => (
                <div className={styles.rubric} key={resource.url}>
                  <div>
                    <span>{resource.label}</span>
                    <a href={resource.url} target="_blank" rel="noreferrer">
                      Open ↗
                    </a>
                  </div>
                </div>
              ))}
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
                <span>Use your own work and sources. This tool supports revision planning.</span>
                <button className={styles.textButton} onClick={() => setDraft(starterDraft)}>
                  Use starter draft ↗
                </button>
              </div>
              <button
                className={styles.primaryButton}
                onClick={runReview}
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
  );
}
