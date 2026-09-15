import styles from "@/app/page.module.css";

function cleanLine(line: string) {
  return line.replace(/^[-*]\s+/, "").replace(/^\d+[.)]\s+/, "").trim();
}

export function FeedbackContent({ text, compact = false }: { text: string; compact?: boolean }) {
  const sections = text
    .split(/(?=^##\s)/m)
    .map((section) => section.trim())
    .filter(Boolean);

  return (
    <div className={styles.analysisCopy}>
      {(compact ? sections.slice(0, 1) : sections).map((section, sectionIndex) => {
        const lines = section.split("\n");
        const heading = lines[0].replace(/^##\s*/, "").trim();
        const body = lines.slice(1).map((line) => line.trim()).filter(Boolean);
        const bullets = body.filter((line) => /^[-*]\s|^\d+[.)]\s/.test(line));
        const paragraphs = body.filter((line) => !/^[-*]\s|^\d+[.)]\s/.test(line));

        return (
          <section className={styles.analysisSection} key={`${heading}-${sectionIndex}`}>
            <h4>{heading}</h4>
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {bullets.length ? (
              <ul>
                {bullets.map((bullet) => <li key={bullet}>{cleanLine(bullet)}</li>)}
              </ul>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
