"use client";

import { useMemo, useState } from "react";
import { AdminAiAssistantPanel } from "@/components/admin/AdminAiAssistantPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSideNav } from "@/components/admin/AdminSideNav";
import { BusinessObjectCard } from "@/components/admin/BusinessObjectCard";
import {
  CustomValidationRuleDialog,
  valuesFromRule,
  type CustomRuleFormValues,
} from "@/components/admin/CustomValidationRuleDialog";
import { SourceDataRulesCard } from "@/components/admin/SourceDataRulesCard";
import {
  ValidationSelectionCard,
  collectDisplayedRuleCards,
  type DisplayedRuleCard,
} from "@/components/admin/ValidationSelectionCard";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Icon } from "@/components/ui/Icon";
import { useAdminWorkspace } from "@/context/AdminWorkspaceContext";
import {
  createCustomValidationRule,
  deleteCustomValidationRule,
  removeRuleFromDraft,
  saveValidationRules,
  updateCustomValidationRule,
  upsertRuleInDraft,
} from "@/lib/api/rules";

export function AdminRuleHubScreen() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSaving, setDialogSaving] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<DisplayedRuleCard | null>(null);

  const {
    sourceFile,
    fileMeta,
    selectedBusinessObject,
    businessObjectOptions,
    loadingBusinessObjects,
    rulesDraft,
    rulesStatus,
    rulesError,
    mappingStatus,
    mappingError,
    generatingRules,
    generatingMappings,
    uploadingSchema,
    registerFile,
    setSelectedBusinessObject,
    generateRules,
    generateMappings,
    setRulesDraft,
    setRulesStatus,
    setRulesError,
  } = useAdminWorkspace();

  const fields = rulesDraft?.fields ?? [];
  const displayedRules = useMemo(
    () => collectDisplayedRuleCards(fields),
    [fields],
  );
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
  const fieldOptions = useMemo(
    () => fields.map((field) => field.fieldName).filter(Boolean),
    [fields],
  );

  const displayFileName = sourceFile?.name ?? fileMeta?.name ?? null;
  const hasSource = Boolean(sourceFile || fileMeta);
  const busy =
    generatingRules || generatingMappings || saving || uploadingSchema || dialogSaving;

  const businessObjectLabel =
    businessObjectOptions.find((option) => option.id === selectedBusinessObject)
      ?.label ?? selectedBusinessObject;

  async function handleSave() {
    if (!rulesDraft) return;
    setRulesError(null);
    setRulesStatus(null);
    setSaving(true);
    try {
      const result = await saveValidationRules({
        businessObject: rulesDraft.businessObject,
        rules: rulesDraft,
      });
      setRulesStatus(result.message || "Rules saved");
    } catch (err) {
      setRulesError(err instanceof Error ? err.message : "Failed to save rules");
    } finally {
      setSaving(false);
    }
  }

  function openCreateDialog() {
    setEditingCard(null);
    setDialogError(null);
    setDialogOpen(true);
  }

  function openEditDialog(card: DisplayedRuleCard) {
    setEditingCard(card);
    setDialogError(null);
    setDialogOpen(true);
  }

  async function handleCustomSubmit(values: CustomRuleFormValues) {
    if (!selectedBusinessObject) {
      setDialogError("Select a business object first");
      return;
    }

    setDialogSaving(true);
    setDialogError(null);
    try {
      const logic = values.logic.trim();
      const fieldName = values.fieldName.trim();
      const payload = {
        businessObject: selectedBusinessObject,
        fieldName,
        ruleName: `Custom transformation (${fieldName})`,
        constraint: logic,
        description: logic,
        type: "transformation",
        category: "transformation",
        severity: "warning",
      };

      const result = editingCard?.rule.ruleId
        ? await updateCustomValidationRule(editingCard.rule.ruleId, payload)
        : await createCustomValidationRule(payload);

      const savedRule = {
        ...result.rule,
        source: "CUSTOM" as const,
      };
      setRulesDraft(
        upsertRuleInDraft(
          rulesDraft,
          selectedBusinessObject,
          fieldName,
          savedRule,
        ),
      );
      setRulesStatus(
        editingCard
          ? "Custom rule updated. AI rules were left unchanged."
          : "Custom rule saved alongside AI-generated rules.",
      );
      setDialogOpen(false);
      setEditingCard(null);
    } catch (err) {
      setDialogError(
        err instanceof Error ? err.message : "Failed to save custom rule",
      );
    } finally {
      setDialogSaving(false);
    }
  }

  async function handleDeleteCustom(card: DisplayedRuleCard) {
    const ruleId = card.rule.ruleId;
    if (!ruleId) return;
    if (
      !window.confirm(
        `Delete custom rule "${card.title}" for ${card.fieldName}? AI rules will not be changed.`,
      )
    ) {
      return;
    }

    setRulesError(null);
    try {
      await deleteCustomValidationRule(ruleId, {
        businessObject: selectedBusinessObject,
      });
      setRulesDraft(removeRuleFromDraft(rulesDraft, ruleId));
      setRulesStatus("Custom rule deleted. AI rules were left unchanged.");
    } catch (err) {
      setRulesError(
        err instanceof Error ? err.message : "Failed to delete custom rule",
      );
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface antialiased selection:bg-primary selection:text-on-primary">
      <AdminSideNav activeKey="admin" />
      <TopAppBar variant="admin" assistantOpen={assistantOpen} />
      <AdminAiAssistantPanel
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        businessObjectLabel={businessObjectLabel}
        hasRulesDraft={Boolean(rulesDraft)}
      />
      <CustomValidationRuleDialog
        open={dialogOpen}
        fieldOptions={fieldOptions}
        initial={
          editingCard
            ? valuesFromRule(editingCard.fieldName, editingCard.rule)
            : null
        }
        saving={dialogSaving}
        error={dialogError}
        onClose={() => {
          if (!dialogSaving) {
            setDialogOpen(false);
            setEditingCard(null);
          }
        }}
        onSubmit={handleCustomSubmit}
      />

      <main
        className={`relative flex min-h-screen flex-col pt-16 transition-[padding] duration-300 md:ml-sidebar-width ${
          assistantOpen ? "xl:pr-assistant-panel-width" : "pr-0"
        }`}
      >
        <div className="mx-auto w-full max-w-[1600px] space-y-6 p-section-padding">
          <AdminPageHeader
            canSave={Boolean(rulesDraft)}
            saving={saving}
            onSave={handleSave}
          />

          {rulesError ? (
            <p className="font-body-sm text-body-sm text-error" role="alert">
              {rulesError}
            </p>
          ) : null}

          {mappingError ? (
            <p className="font-body-sm text-body-sm text-error" role="alert">
              {mappingError}
            </p>
          ) : null}

          {mappingStatus ? (
            <p className="font-body-sm text-body-sm text-primary" role="status">
              {mappingStatus}
            </p>
          ) : null}

          <div className="grid grid-cols-12 gap-grid-gutter">
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-6">
              <SourceDataRulesCard
                fields={fields}
                fileName={displayFileName}
                disabled={busy}
                onFileSelected={(file) => {
                  void registerFile(file);
                }}
              />
            </div>
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-6">
              <BusinessObjectCard
                options={businessObjectOptions}
                loading={loadingBusinessObjects}
                selectedId={selectedBusinessObject}
                onSelect={setSelectedBusinessObject}
                onConfirm={() => void generateRules()}
                confirmLabel="Generate Rules"
                confirming={generatingRules}
                disabled={busy}
              />
            </div>
            <div className="col-span-12">
              <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-surface/60 backdrop-blur-[20px]">
                <div className="border-b border-white/5 bg-white/[0.02] p-5">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Schema Mapping
                  </h3>
                  <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant opacity-80">
                    Generate AI field mappings for the uploaded source schema.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {hasSource
                      ? `Ready to map fields for ${businessObjectLabel}.`
                      : "Upload a source schema file first."}
                  </p>
                  <button
                    type="button"
                    disabled={busy || !hasSource || !selectedBusinessObject}
                    onClick={() => void generateMappings()}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-body-sm text-body-sm font-semibold text-on-primary transition-all hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Icon name="compare_arrows" className="text-[18px]" />
                    {generatingMappings ? "Generating…" : "Generate Mapping"}
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-12">
              <ValidationSelectionCard
                predefinedCount={predefinedCount}
                displayedRules={displayedRules}
                rulesDraft={rulesDraft}
                suggesting={generatingRules}
                addingCustom={dialogSaving}
                message={rulesStatus}
                onAddCustom={openCreateDialog}
                onEditCustom={openEditDialog}
                onDeleteCustom={(card) => {
                  void handleDeleteCustom(card);
                }}
                onSuggestAi={() => {
                  setAssistantOpen(true);
                  void generateRules();
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
