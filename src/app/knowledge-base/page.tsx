"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { preparedEvents } from "@/lib/preparedEvents";
import { getEventResources, type EventResource } from "@/lib/eventResources";
import { ResourcePreview } from "@/components/ResourcePreview";

type ResourceFilter = "ALL" | EventResource["type"];

export default function KnowledgeBasePage() {
  const router = useRouter();
  const [selectedCode, setSelectedCode] = useState(preparedEvents[0].code);
  const [filter, setFilter] = useState<ResourceFilter>("ALL");
  const [activeResource, setActiveResource] = useState<EventResource | null>(null);
  const selectedEvent = preparedEvents.find((event) => event.code === selectedCode) ?? preparedEvents[0];
  const resources = useMemo(
    () => getEventResources(selectedEvent).filter((resource) => filter === "ALL" || resource.type === filter),
    [filter, selectedEvent],
  );

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("event");
    if (code && preparedEvents.some((event) => event.code === code)) {
      const timer = window.setTimeout(() => setSelectedCode(code), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function changeEvent(code: string) {
    setSelectedCode(code);
    setActiveResource(null);
    router.replace(`/knowledge-base?event=${code}`);
  }

  return (
    <main className={styles.knowledgePage}>
      <header className={styles.knowledgePageHeader}>
        <Link className={styles.backLink} href="/">← Back to Draftroom</Link>
        <span className={styles.panelLabel}>DECA DRAFTROOM / KNOWLEDGE BASE</span>
      </header>
      <section className={styles.knowledgeHero}>
        <div>
          <span className={styles.eyebrow}>Official references</span>
          <h1>Build from the source.</h1>
          <p>Browse the documents behind your event analysis. Open a reference when you need it, then return to your draft with the rubric in view.</p>
        </div>
        <div className={styles.knowledgeEventPicker}>
          <label htmlFor="knowledge-event">Event</label>
          <select id="knowledge-event" value={selectedCode} onChange={(event) => changeEvent(event.target.value)}>
            {preparedEvents.map((event) => <option key={event.code} value={event.code}>{event.code} · {event.name}</option>)}
          </select>
          <span>{selectedEvent.category}</span>
        </div>
      </section>
      <div className={styles.knowledgeToolbar}>
        <span>{resources.length} references for {selectedEvent.code}</span>
        <div className={styles.knowledgeFilters}>
          {(["ALL", "PDF", "WEB"] as ResourceFilter[]).map((option) => (
            <button key={option} type="button" data-active={filter === option} onClick={() => setFilter(option)}>
              {option === "ALL" ? "All" : option === "PDF" ? "PDFs" : "Web pages"}
            </button>
          ))}
        </div>
      </div>
      <section className={styles.resourceCards} aria-label="Event resources">
        {resources.map((resource, index) => (
          <button className={styles.resourceCard} type="button" onClick={() => setActiveResource(resource)} key={`${resource.label}-${resource.url}`} data-active={activeResource?.url === resource.url}>
            <div className={styles.resourceCardTop}>
              <span className={styles.resourceType}>{resource.type}</span>
              <span className={styles.resourceIndex}>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2>{resource.label}</h2>
            <p>{resource.description}</p>
            <strong>Preview resource →</strong>
          </button>
        ))}
      </section>
      {activeResource ? (
        <section className={styles.resourcePreviewPanel} aria-label={`${activeResource.label} preview`}>
          <div className={styles.previewHeader}>
            <div>
              <span className={styles.resourceType}>{activeResource.type} PREVIEW</span>
              <h2>{activeResource.label}</h2>
            </div>
            <div className={styles.previewActions}>
              <a href={activeResource.url} target="_blank" rel="noreferrer">Open externally ↗</a>
              <button type="button" onClick={() => setActiveResource(null)}>Close</button>
            </div>
          </div>
          <ResourcePreview resource={activeResource} />
        </section>
      ) : null}
    </main>
  );
}
