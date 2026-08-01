"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type Criterion = { name: string; weight: number; guidance: string };
type Event = { code: string; name: string; description: string; examples: string[]; rubric: Criterion[]; source: string };

const preparedRubric = (items: [string, number, string][]): Criterion[] => items.map(([name, weight, guidance]) => ({ name, weight, guidance }));

const events: Event[] = [
  { code: "EIP", name: "Entrepreneurship Innovation Plan", description: "Develop an innovative solution and a plan to bring it to market.", examples: ["Campus meal-prep pickup", "Adaptive study lamp service"], rubric: preparedRubric([["Innovation & problem", 25, "Define a meaningful problem and why the solution is meaningfully different."], ["Market understanding", 25, "Support the target customer and need with specific research or observations."], ["Implementation plan", 25, "Show milestones, resources, roles, and a realistic path to launch."], ["Financial logic", 25, "Connect pricing, costs, and success measures to the plan."]]), source: "https://www.deca.org/compete" },
  { code: "BOR", name: "Business Operations Research", description: "Analyze an existing business challenge and recommend an evidence-backed solution.", examples: ["Inventory accuracy at a local retailer", "Reducing wait times at a clinic"], rubric: preparedRubric([["Business problem", 25, "Frame the operational issue, its scope, and its effect on the organization."], ["Research quality", 25, "Use relevant primary and secondary evidence to diagnose the cause."], ["Recommendation", 25, "Propose a specific solution that fits the organization and its constraints."], ["Evaluation plan", 25, "Define implementation steps, measures, risks, and expected results."]]), source: "https://www.deca.org/compete" },
  { code: "IMCP", name: "Integrated Marketing Campaign — Product", description: "Build a coordinated campaign for a product with a clear audience and measurement plan.", examples: ["Refillable bottle launch", "Neighborhood bookstore membership"], rubric: preparedRubric([["Target market", 25, "Identify a focused audience and insight that informs the campaign."], ["Message & objectives", 25, "Make the value proposition and measurable campaign objective clear."], ["Integrated tactics", 25, "Coordinate channels, timing, creative, and a consistent call to action."], ["Measurement", 25, "Explain how reach, engagement, conversion, and learning will be tracked."]]), source: "https://www.deca.org/compete" },
  { code: "HTOR", name: "Hospitality Services Operations Research", description: "Research a hospitality operation and propose improvements to the guest experience.", examples: ["Hotel mobile check-in", "Restaurant table-turn analysis"], rubric: preparedRubric([["Guest experience", 25, "Describe the guest need and the moments that shape the experience."], ["Operational diagnosis", 25, "Connect observations and evidence to a specific service challenge."], ["Service recommendation", 25, "Design a feasible improvement for staff, guests, and the operation."], ["Results & controls", 25, "Set service standards, measures, ownership, and follow-up steps."]]), source: "https://www.deca.org/compete" },
  { code: "PMCA", name: "Principles of Marketing — Community Awareness", description: "Create a community-focused awareness campaign with a defined audience and outcomes.", examples: ["Bike-safety awareness week", "Library digital-literacy campaign"], rubric: preparedRubric([["Community need", 25, "Show why the issue matters locally and who is most affected."], ["Audience & message", 25, "Use an accessible message tailored to the audience and behavior change."], ["Promotion plan", 25, "Give a realistic plan for partners, channels, timing, and participation."], ["Impact", 25, "Define the behavior, participation, or awareness outcome to measure."]]), source: "https://www.deca.org/compete" },
  { code: "ESB", name: "Entrepreneurship Start-Up Business Plan", description: "Present a viable start-up concept, its market, operations, and financial outlook.", examples: ["Student-focused repair marketplace", "Low-waste event rentals"], rubric: preparedRubric([["Venture concept", 25, "Explain the customer problem, value proposition, and competitive difference."], ["Market & marketing", 25, "Demonstrate customer knowledge, positioning, acquisition, and retention."], ["Operations", 25, "Show how the business will deliver reliably with people and resources."], ["Financial plan", 25, "Make revenue assumptions, costs, funding, and break-even logic understandable."]]), source: "https://www.deca.org/compete" },
];

const starterDraft = `Northstar Study Co. helps high-school students plan focused study sessions with short, local library workshops and a simple scheduling tool. We will start with three partner libraries and reach students through counselors, family newsletters, and student ambassadors.

Our first-year goal is 240 paid memberships. We will measure workshop attendance, trial-to-member conversion, and the percentage of members who return each month. The pilot will run for eight weeks before we expand.`;

function scoreFor(text: string, index: number, rubric: Criterion[]) {
  const lengthBonus = Math.min(10, Math.floor(text.trim().length / 120));
  return Math.min(96, [78, 64, 72, 58][index] + lengthBonus + Math.round((rubric[index]?.weight ?? 25) / 10));
}

export default function Home() {
  const [selectedCode, setSelectedCode] = useState("EIP");
  const [draft, setDraft] = useState("");
  const [hasReview, setHasReview] = useState(false);
  const [activeView, setActiveView] = useState<"review" | "library">("review");
  const selectedEvent = events.find((event) => event.code === selectedCode) ?? events[0];
  const wordCount = useMemo(() => draft.trim() ? draft.trim().split(/\s+/).length : 0, [draft]);

  function runReview() {
    if (draft.trim().length < 40) return;
    setHasReview(true);
  }

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}><span className={styles.mark}>D</span><span>DECA <b>Draftroom</b></span></div>
        <div className={styles.topMeta}><span className={styles.statusDot} /> Practice workspace <button className={styles.avatar}>AS</button></div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.kicker}>Prepared events</div>
          <h1>Make the draft <em>competition-ready.</em></h1>
          <p className={styles.sideIntro}>A focused review loop for stronger evidence, sharper strategy, and confident revisions.</p>
          <nav className={styles.nav} aria-label="Workspace views">
            <button className={activeView === "review" ? styles.navActive : ""} onClick={() => setActiveView("review")}><span>01</span> Review a draft</button>
            <button className={activeView === "library" ? styles.navActive : ""} onClick={() => setActiveView("library")}><span>02</span> Example library</button>
          </nav>
          <div className={styles.sidebarNote}><span>✦</span><p>Feedback is a coach, not a ghostwriter. Your strategy stays yours.</p></div>
        </aside>

        <section className={styles.workspace}>
          <div className={styles.workspaceHead}>
            <div><div className={styles.eyebrow}>Workspace / {activeView === "review" ? "Draft review" : "Examples"}</div><h2>{activeView === "review" ? "Review your written project" : "Study the shape of strong work"}</h2></div>
            <span className={styles.sourceTag}>Built around official event prompts</span>
          </div>

          {activeView === "review" ? <>
            <div className={styles.eventBar}>
              <label htmlFor="event">Your event</label>
              <select id="event" value={selectedCode} onChange={(event) => setSelectedCode(event.target.value)}>{events.map((event) => <option key={event.code} value={event.code}>{event.code} · {event.name}</option>)}</select>
              <p>{selectedEvent.description}</p><a href={selectedEvent.source} target="_blank" rel="noreferrer">Rubric source ↗</a>
            </div>
            <div className={styles.reviewGrid}>
              <div className={styles.editorPanel}>
                <div className={styles.panelTop}><span className={styles.panelLabel}>01 / Paste your project</span><span className={styles.wordCount}>{wordCount} words</span></div>
                <textarea value={draft} onChange={(event) => { setDraft(event.target.value); setHasReview(false); }} placeholder="Paste your executive summary, written entry, or a section you want to strengthen..." aria-label="Written project draft" />
                <div className={styles.editorFoot}><span>Tip: include your objective, evidence, and intended outcome.</span><button className={styles.textButton} onClick={() => setDraft(starterDraft)}>Use a starter draft ↗</button></div>
                <button className={styles.primaryButton} onClick={runReview} disabled={wordCount < 8}>Analyze this draft <span>→</span></button>
              </div>
              <div className={styles.feedbackPanel}>
                <div className={styles.panelTop}><span className={styles.panelLabel}>02 / Coach&apos;s read</span><span className={styles.aiTag}>AI-assisted</span></div>
                {!hasReview ? <div className={styles.emptyState}><div className={styles.emptyIcon}>✎</div><h3>Your feedback will land here.</h3><p>Paste at least a few sentences. Draftroom will look for evidence, event fit, and places where your recommendation can become more specific.</p></div> : <div className={styles.results}>
                  <div className={styles.scoreLine}><div><span className={styles.resultLabel}>Draft signal</span><strong>{Math.round(selectedEvent.rubric.map((_, i) => scoreFor(draft, i, selectedEvent.rubric)).reduce((a, b) => a + b, 0) / selectedEvent.rubric.length)}<small>/100</small></strong></div><span className={styles.scoreBadge}>Promising start</span></div>
                  <div className={styles.rubricList}>{selectedEvent.rubric.map((item, index) => <div className={styles.rubric} key={item.name}><div><span>{item.name} <small>{item.weight}%</small></span><b>{scoreFor(draft, index, selectedEvent.rubric)}</b></div><p>{item.guidance}</p><div className={styles.track}><i style={{ width: `${scoreFor(draft, index, selectedEvent.rubric)}%` }} /></div></div>)}</div>
                  <div className={styles.callout}><span>01</span><p><b>Make the goal measurable.</b> You name a first-year target, but the reader needs a baseline and a reason this number is realistic.</p></div>
                  <div className={styles.callout}><span>02</span><p><b>Show the audience insight.</b> Add one observed behavior or source that explains why your audience needs this now.</p></div>
                  <button className={styles.secondaryButton} onClick={() => setDraft(`${draft}\n\nEvidence to add: `)}>Add a revision note <span>+</span></button>
                </div>}
              </div>
            </div>
          </> : <div className={styles.library}><div className={styles.libraryIntro}><p>Examples are intentionally short, original practice briefs, not copied competition submissions. Use them to study structure, then cite your own sources.</p><a href="https://www.deca.org/compete" target="_blank" rel="noreferrer">Verify current event guidelines ↗</a></div><div className={styles.exampleGrid}>{events.map((event) => <article className={styles.exampleItem} key={event.code}><div className={styles.exampleCode}>{event.code}</div><h3>{event.name}</h3><p>{event.description}</p><ol>{event.examples.map((example) => <li key={example}>{example} <span>↗</span></li>)}</ol></article>)}</div></div>}
        </section>
      </div>
      <footer className={styles.footer}><span>DECA Draftroom · early practice build</span><span>Examples are original and illustrative. No DECA+ login used.</span></footer>
    </main>
  );
}
