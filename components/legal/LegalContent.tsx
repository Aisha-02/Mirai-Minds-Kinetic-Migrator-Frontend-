import { legalCopy, legalSections } from "@/lib/mock/legal";

export function LegalContent() {
  return (
    <main className="mx-auto max-w-5xl px-4 pt-24 pb-32 md:pr-container-margin md:pl-[292px]">
      <div className="surface-glass relative overflow-hidden rounded-xl p-8 shadow-2xl md:p-12">
        <div className="pointer-events-none absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />
        <div className="legal-content">
          <h1 className="font-display-lg text-display-lg mb-8 border-b border-outline-variant/20 pb-4">
            {legalCopy.pageTitle}
          </h1>
          {legalSections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={
                index === 0
                  ? "mb-12 scroll-mt-24"
                  : index === legalSections.length - 1
                    ? "mb-4 scroll-mt-24 border-t border-outline-variant/20 pt-8"
                    : "mb-12 scroll-mt-24 border-t border-outline-variant/20 pt-8"
              }
            >
              <h2>{section.title}</h2>
              {section.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.subsections.map((subsection) => (
                <div key={subsection.heading}>
                  <h3>{subsection.heading}</h3>
                  <p>{subsection.body}</p>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
