"use client";

import { useMemo, useState } from "react";
import { AdminAiAssistantPanel } from "@/components/admin/AdminAiAssistantPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSideNav } from "@/components/admin/AdminSideNav";
import { BusinessObjectCard } from "@/components/admin/BusinessObjectCard";
import { SourceDataRulesCard } from "@/components/admin/SourceDataRulesCard";
import {
  ValidationSelectionCard,
  collectAiRuleCards,
} from "@/components/admin/ValidationSelectionCard";
import { TopAppBar } from "@/components/layout/TopAppBar";
import {
  generateValidationRules,
  saveValidationRules,
  type RulesDraft,
} from "@/lib/api/rules";
import { businessObjectOptions } from "@/lib/mock/admin";

export function AdminRuleHubScreen() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [selectedBo, setSelectedBo] = useState(
    businessObjectOptions[0]?.id ?? "MM",
  );
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [draft, setDraft] = useState<RulesDraft | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const fields = draft?.fields ?? [];
  const aiRules = useMemo(() => collectAiRuleCards(fields), [fields]);
  const predefinedCount = useMemo(
    () =>
      fields.reduce(
        (count, field) =>
          count +
          (field.rules || []).filter(
            (rule) => String(rule.source).toUpperCase() === "PREDEFINED",
          ).length,
        0,
      ),
    [fields],
  );

  async function handleGenerate() {
    setError(null);
    setStatus(null);

    if (!selectedBo) {
      setError("Select a business object first");
      return;
    }
    if (!excelFile) {
      setError("Upload an Excel field metadata file first");
      return;
    }

    setGenerating(true);
    try {
      const result = await generateValidationRules(selectedBo, excelFile);
      setDraft(result.rules);
      setStatus(
        result.message ||
          "Review predefined + AI rules. Nothing is saved until you apply.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate rules");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!draft) return;
    setError(null);
    setStatus(null);
    setSaving(true);
    try {
      const result = await saveValidationRules({
        businessObject: draft.businessObject,
        rules: draft,
      });
      setStatus(result.message || "Rules saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save rules");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface antialiased selection:bg-primary selection:text-on-primary">
      <AdminSideNav activeKey="admin" />
      <TopAppBar variant="admin" assistantOpen={assistantOpen} />
      <AdminAiAssistantPanel
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />

      <main
        className={`relative flex min-h-screen flex-col pt-16 transition-[padding] duration-300 md:ml-sidebar-width ${
          assistantOpen ? "xl:pr-assistant-panel-width" : "pr-0"
        }`}
      >
        <div className="mx-auto w-full max-w-[1600px] space-y-6 p-section-padding">
          <AdminPageHeader
            canSave={Boolean(draft)}
            saving={saving}
            onSave={handleSave}
          />

          {error ? (
            <p className="font-body-sm text-body-sm text-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="grid grid-cols-12 gap-grid-gutter">
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-6">
              <SourceDataRulesCard
                fields={fields}
                fileName={excelFile?.name ?? null}
                disabled={generating || saving}
                onFileSelected={(file) => {
                  setExcelFile(file);
                  setDraft(null);
                  setStatus(null);
                  setError(null);
                }}
              />
            </div>
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-6">
              <BusinessObjectCard
                selectedId={selectedBo}
                onSelect={(id) => {
                  setSelectedBo(id);
                  setDraft(null);
                  setStatus(null);
                }}
                onConfirm={handleGenerate}
                confirmLabel="Generate Rules"
                confirming={generating}
                disabled={generating || saving}
              />
            </div>
            <div className="col-span-12">
              <ValidationSelectionCard
                predefinedCount={predefinedCount}
                aiRules={aiRules}
                suggesting={generating}
                message={status}
                onSuggestAi={() => {
                  setAssistantOpen(true);
                  void handleGenerate();
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
