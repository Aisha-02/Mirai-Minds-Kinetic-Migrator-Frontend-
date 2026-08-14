import { parseAiReport } from "@/lib/format/aiReport";

type AiComparisonReportProps = {
  text: string;
};

export function AiComparisonReport({ text }: AiComparisonReportProps) {
  const sections = parseAiReport(text);

  return (
    <div className="mb-container-margin rounded-xl border border-outline-variant bg-surface-container p-6">
      <h3 className="mb-6 font-headline-sm text-headline-sm text-on-surface">
        AI Comparison Summary
      </h3>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <section
            key={`${section.title}-${index}`}
            className="rounded-lg border border-ink/10 bg-surface-container-low p-5"
          >
            {section.title ? (
              <h4 className="mb-3 font-headline-sm text-headline-sm font-semibold text-primary">
                {section.title}
              </h4>
            ) : null}

            {section.paragraphs.map((paragraph, pIndex) => (
              <p
                key={`p-${index}-${pIndex}`}
                className="mb-3 font-body-md text-body-md leading-relaxed text-on-surface last:mb-0"
              >
                {paragraph}
              </p>
            ))}

            {section.bullets.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {section.bullets.map((bullet, bIndex) => (
                  <li
                    key={`b-${index}-${bIndex}`}
                    className="flex gap-3 font-body-md text-body-md leading-relaxed text-on-surface"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
