export type FormattedReportSection = {
  title: string;
  paragraphs: string[];
  bullets: string[];
};

function cleanInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[-*•]\s+/, "")
    .trim();
}

function isLikelyHeading(line: string): boolean {
  if (/^#{1,6}\s+/.test(line)) return true;
  if (/^\d+\.\s+[A-Z]/.test(line) && line.length < 100) return true;
  if (/^[A-Z][A-Za-z\s/&-]{2,50}:$/.test(line)) return true;
  return false;
}

function extractHeading(line: string): string {
  const hash = line.match(/^#{1,6}\s+(.+)$/);
  if (hash) return cleanInlineMarkdown(hash[1]);

  const numbered = line.match(/^\d+\.\s+(.+)$/);
  if (numbered) return cleanInlineMarkdown(numbered[1]);

  const colon = line.match(/^(.+):$/);
  if (colon) return cleanInlineMarkdown(colon[1]);

  return cleanInlineMarkdown(line);
}

/**
 * Parse AI markdown-ish report text into display-friendly sections.
 */
export function parseAiReport(text: string): FormattedReportSection[] {
  const lines = String(text ?? "").split(/\r?\n/);
  const sections: FormattedReportSection[] = [];
  let current: FormattedReportSection | null = null;

  function ensureSection(title = "Summary") {
    if (!current) {
      current = { title, paragraphs: [], bullets: [] };
    }
    return current;
  }

  function flush() {
    if (!current) return;
    if (
      current.title ||
      current.paragraphs.length > 0 ||
      current.bullets.length > 0
    ) {
      sections.push(current);
    }
    current = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^[-*_]{3,}$/.test(line)) continue;

    if (isLikelyHeading(line)) {
      flush();
      current = {
        title: extractHeading(line),
        paragraphs: [],
        bullets: [],
      };
      continue;
    }

    const bullet = line.match(/^[-*•]\s+(.+)$/);
    if (bullet) {
      ensureSection().bullets.push(cleanInlineMarkdown(bullet[1]));
      continue;
    }

    ensureSection().paragraphs.push(cleanInlineMarkdown(line));
  }

  flush();

  if (sections.length === 0 && text.trim()) {
    return [
      {
        title: "Comparison Summary",
        paragraphs: [cleanInlineMarkdown(text.trim())],
        bullets: [],
      },
    ];
  }

  return sections;
}
