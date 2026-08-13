"use client";

import { Icon } from "@/components/ui/Icon";
import type { FieldRule } from "@/lib/api/rules";
import { adminCopy } from "@/lib/mock/admin";

type ValidationSelectionCardProps = {
  predefinedCount: number;
  aiRules: Array<{ id: string; title: string; subtitle: string; fieldName: string }>;
  onSuggestAi?: () => void;
  suggesting?: boolean;
  message?: string | null;
};

export function ValidationSelectionCard({
  predefinedCount,
  aiRules,
  onSuggestAi,
  suggesting = false,
  message = null,
}: ValidationSelectionCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-surface/60 backdrop-blur-[20px]">
      <div className="flex flex-col gap-3 border-b border-white/5 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {adminCopy.validationTitle}
          </h3>
          <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant opacity-80">
            {adminCopy.validationSubtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onSuggestAi}
          disabled={suggesting}
          className="flex items-center gap-2 rounded-lg border border-tertiary/30 bg-tertiary-container px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-tertiary-container transition-all hover:bg-tertiary-container/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="smart_toy" className="text-[18px]" />
          {suggesting ? "Generating with AI…" : adminCopy.suggestViaAiLabel}
        </button>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { id: "trim", label: "Trim Empty Spaces" },
            { id: "null", label: "Check Null Keys" },
            { id: "dup", label: "Remove Duplicate Records" },
          ].map((toggle) => (
            <div
              key={toggle.id}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4"
            >
              <div className="flex items-center gap-2">
                <Icon name="fact_check" className="text-sm text-secondary" />
                <span className="font-body-md text-body-md font-semibold text-on-surface">
                  {toggle.label}
                </span>
              </div>
              <span className="font-label-caps text-label-caps text-primary">
                ON
              </span>
            </div>
          ))}
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Predefined rules applied across fields: {predefinedCount}
        </p>

        <div className="border-t border-white/10 pt-4">
          <h4 className="mb-4 flex items-center gap-2 font-label-caps text-label-caps text-primary">
            <Icon name="smart_toy" className="text-sm" />
            {adminCopy.aiRulesTitle}
          </h4>
          {aiRules.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Generate rules to review AI suggestions here.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {aiRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3"
                >
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md font-semibold text-on-surface">
                      {rule.title}
                    </span>
                    <span className="text-[10px] opacity-70">
                      {rule.fieldName} · {rule.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {message ? (
          <p className="font-body-sm text-body-sm text-status-online" role="status">
            {message}
          </p>
        ) : null}
      </div>

      <div className="flex justify-center border-t border-white/5 bg-surface-container-lowest/50 p-3">
        <span className="font-body-sm text-body-sm text-on-surface-variant italic opacity-70">
          {aiRules.length
            ? `${aiRules.length} AI rule(s) ready to save`
            : adminCopy.pendingReviewLabel}
        </span>
      </div>
    </div>
  );
}

export function collectAiRuleCards(
  fields: Array<{ fieldName: string; rules: FieldRule[] }>,
) {
  return fields.flatMap((field) =>
    (field.rules || [])
      .filter((rule) => String(rule.source).toUpperCase() === "AI")
      .map((rule, index) => ({
        id: `${field.fieldName}-${rule.ruleId || rule.ruleName}-${index}`,
        title: rule.ruleName,
        subtitle: rule.description || rule.constraint || "AI validation",
        fieldName: field.fieldName,
      })),
  );
}
