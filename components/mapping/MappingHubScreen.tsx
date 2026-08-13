"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminSideNav } from "@/components/admin/AdminSideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { AnalysisSourceSummaryCard } from "@/components/mapping/AnalysisSourceSummaryCard";
import { FieldMappingTable } from "@/components/mapping/FieldMappingTable";
import { MappingAiAssistantPanel } from "@/components/mapping/MappingAiAssistantPanel";
import { MappingConfidenceCard } from "@/components/mapping/MappingConfidenceCard";
import { MigrationProgressCard } from "@/components/mapping/MigrationProgressCard";
import { Icon } from "@/components/ui/Icon";
import { useAdminWorkspace } from "@/context/AdminWorkspaceContext";
import { mappingCopy } from "@/lib/mock/mapping";

export function MappingHubScreen() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  const {
    sourceFile,
    fileMeta,
    selectedBusinessObject,
    businessObjectOptions,
    schemaMappings,
    mappingStatus,
    mappingError,
    generatingMappings,
    hydrating,
  } = useAdminWorkspace();

  const averageConfidence = useMemo(() => {
    if (schemaMappings.length === 0) return null;
    const sum = schemaMappings.reduce((acc, row) => acc + row.confidenceScore, 0);
    return (sum / schemaMappings.length) * 100;
  }, [schemaMappings]);

  const displayFileName = sourceFile?.name ?? fileMeta?.name ?? null;
  const hasSource = Boolean(sourceFile || fileMeta);

  const businessObjectLabel =
    businessObjectOptions.find((option) => option.id === selectedBusinessObject)
      ?.label ?? selectedBusinessObject;

  const mappedCount = useMemo(
    () => schemaMappings.filter((row) => row.sapField).length,
    [schemaMappings],
  );

  const lowestConfidenceMapping = useMemo(() => {
    if (schemaMappings.length === 0) return null;
    return schemaMappings.reduce((lowest, row) =>
      row.confidenceScore < lowest.confidenceScore ? row : lowest,
    );
  }, [schemaMappings]);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-body-md text-on-background antialiased">
      <AdminSideNav activeKey="analysis" />
      <TopAppBar
        variant="analysis"
        pageTitle={mappingCopy.pageTitle}
        assistantOpen={assistantOpen}
      />
      <MappingAiAssistantPanel
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        schemaMappings={schemaMappings}
        highlightMapping={lowestConfidenceMapping}
      />

      <main
        className={`mt-16 ml-0 flex-1 overflow-y-auto p-section-padding transition-[margin] duration-300 md:ml-sidebar-width ${
          assistantOpen ? "xl:mr-assistant-panel-width" : "mr-0"
        }`}
      >
        <div className="flex h-full flex-col gap-grid-gutter">
          {hydrating ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Loading workspace…
            </p>
          ) : null}

          {mappingError ? (
            <p className="font-body-sm text-body-sm text-error" role="alert">
              {mappingError}
            </p>
          ) : null}

          {!hydrating && !hasSource ? (
            <div className="mapping-glass flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl p-8 text-center">
              <Icon
                name="upload_file"
                className="text-4xl text-on-surface-variant"
              />
              <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
                No file uploaded yet — upload one from Admin.
              </p>
              <Link
                href="/admin"
                className="rounded-lg bg-primary px-4 py-2 font-body-sm text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary/90"
              >
                Go to Admin
              </Link>
            </div>
          ) : null}

          {!hydrating && hasSource ? (
            <>
              <div className="grid grid-cols-12 gap-grid-gutter">
                <AnalysisSourceSummaryCard
                  fileName={displayFileName}
                  businessObjectLabel={businessObjectLabel}
                  mappingCount={schemaMappings.length}
                  statusMessage={mappingStatus}
                />
              </div>

              <div className="grid grid-cols-12 gap-grid-gutter">
                <MappingConfidenceCard averageConfidence={averageConfidence} />
                <MigrationProgressCard
                  mappedCount={mappedCount}
                  totalFields={schemaMappings.length}
                  businessObject={businessObjectLabel}
                  fileName={displayFileName}
                  statusMessage={mappingStatus}
                />
              </div>

              <FieldMappingTable
                mappings={schemaMappings}
                generating={generatingMappings}
                readOnly
                emptyMessage="No mappings yet — generate mapping from Admin."
              />
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
