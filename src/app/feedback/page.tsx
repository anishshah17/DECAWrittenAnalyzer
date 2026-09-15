"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FeedbackContent } from "@/components/FeedbackContent";
import { getRubricAreas } from "@/lib/rubricSections";
import styles from "../page.module.css";

type StoredFeedback = {
  eventName: string;
  category: string;
  score: number;
  wordCount: number;
  text: string;
  rubricScores: { label: string; score: number; maxScore: number; evidence?: string; missing?: string[]; nextStep?: string }[];
};

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<StoredFeedback | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("deca-draftroom-feedback-v2");
    if (!stored) return;
    try {
      const timer = window.setTimeout(() => {
        setFeedback(JSON.parse(stored) as StoredFeedback);
      }, 0);
      return () => window.clearTimeout(timer);
    } catch {
      window.localStorage.removeItem("deca-draftroom-feedback-v2");
    }
  }, []);

  async function copyFeedback() {
    if (!feedback) return;
    await navigator.clipboard.writeText(feedback.text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (!feedback) {
    return (
      <main className={styles.feedbackPage}>
        <Link className={styles.backLink} href="/">← Back to Draftroom</Link>
        <div className={styles.feedbackEmpty}>
          <span className={styles.panelLabel}>NO SAVED ANALYSIS</span>
          <h1>Run an analysis first.</h1>
          <p>Your detailed feedback will appear here after you analyze a draft.</p>
          <Link className={styles.primaryLink} href="/">Return to Draftroom</Link>
        </div>
      </main>
    );
  }

  const scoresByLabel = new Map(feedback.rubricScores.map((item) => [item.label, item]));
  const rubricAreas = getRubricAreas(feedback.category);
  const weightedTotal = feedback.rubricScores.reduce((total, item) => total + item.score, 0);

  return (
    <main className={styles.feedbackPage}>
      <header className={styles.feedbackHeader}>
        <Link className={styles.backLink} href="/">← Back to Draftroom</Link>
        <span className={styles.panelLabel}>DECA DRAFTROOM / DETAILED FEEDBACK</span>
      </header>
      <section className={styles.feedbackTitle}>
        <div>
          <span className={styles.eyebrow}>{feedback.category}</span>
          <h1>{feedback.eventName}</h1>
          <p>{feedback.wordCount} words analyzed against the selected event rubric.</p>
        </div>
        <div className={styles.detailScore}>
          <span>Draft score</span>
          <strong>{feedback.score.toFixed(2)}<small>/100</small></strong>
        </div>
      </section>
      <div className={styles.feedbackDetailGrid}>
        <section className={styles.detailPanel}>
          <div className={styles.panelTop}>
            <span className={styles.panelLabel}>RUBRIC BREAKDOWN</span>
            <span className={styles.aiTag}>Gemini analysis</span>
          </div>
          <div className={styles.weightedTotal}>
            <span>Weighted total</span>
            <strong>{weightedTotal.toFixed(1)} <small>/ 100</small></strong>
            <p>Equal point allocation totals exactly 100 across the selected subsections.</p>
          </div>
          <div className={styles.detailRubrics}>
            {rubricAreas.map((area) => {
              const areaScores = area.subsections.map((section) => scoresByLabel.get(section)).filter(Boolean);
              if (!areaScores.length) return null;
              return (
                <section className={styles.detailRubricArea} key={area.title}>
                  <h3>{area.title}</h3>
                  {areaScores.map((item) => item ? (
                    <details className={styles.rubricDetail} key={item.label}>
                      <summary>
                        <span>{item.label}</span>
                        <b>{item.score.toFixed(2)}<small>/{item.maxScore}</small></b>
                        <i aria-hidden="true">⌄</i>
                      </summary>
                      <div className={styles.track}><i style={{ width: `${item.maxScore ? (item.score / item.maxScore) * 100 : 0}%` }} /></div>
                      <p><strong>Evidence</strong>{item.evidence || "No clear evidence was identified."}</p>
                      {item.missing?.length ? <p><strong>Missing</strong>{item.missing.join(", ")}</p> : null}
                      <p><strong>Next step</strong>{item.nextStep || "Add specific evidence tied to this criterion."}</p>
                    </details>
                  ) : null)}
                </section>
              );
            })}
          </div>
        </section>
        <section className={styles.detailPanel}>
          <div className={styles.panelTop}>
            <span className={styles.panelLabel}>WRITING COACH NOTES</span>
            <button className={styles.copyButton} type="button" onClick={copyFeedback}>{copied ? "Copied" : "Copy notes"}</button>
          </div>
          <FeedbackContent text={feedback.text} />
        </section>
      </div>
    </main>
  );
}
