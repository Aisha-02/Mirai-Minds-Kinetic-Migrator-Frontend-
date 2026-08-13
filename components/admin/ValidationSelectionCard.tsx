"use client";

import { useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import type { FieldRule, RulesDraft } from "@/lib/api/rules";
import { isAiRule, isCustomRule } from "@/lib/api/rules";
import { adminCopy } from "@/lib/mock/admin";

export type DisplayedRuleCard = {
  id: string;
  title: string;
  subtitle: string;
  fieldName: string;
  source: "AI" | "CUSTOM";
  rule: FieldRule;
};

type ValidationSelectionCardProps = {
  predefinedCount: number;
  displayedRules: DisplayedRuleCard[];
  rulesDraft?: RulesDraft | null;
  onSuggestAi?: () => void;
  onAddCustom?: () => void;
  onEditCustom?: (card: DisplayedRuleCard) => void;
  onDeleteCustom?: (card: DisplayedRuleCard) => void;
  suggesting?: boolean;
  addingCustom?: boolean;
  message?: string | null;
};

const PREDEFINED_TOGGLES = [
  { id: "trim", label: "Trim Empty Spaces", keywords: ["trim", "space"] },
  { id: "null", label: "Check Null Keys", keywords: ["null", "key"] },
  { id: "dup", label: "Remove Duplicate Records", keywords: ["duplicate", "dup"] },
] as const;

function hasPredefinedRule(
  fields: RulesDraft["fields"],
  keywords: readonly string[],
) {
  return fields.some((field) =>
    (field.rules || []).some((rule) => {
      if (String(rule.source).toUpperCase() !== "PREDEFINED") return false;
      const haystack = `${rule.ruleName} ${rule.description ?? ""} ${rule.constraint ?? ""}`.toLowerCase();
      return keywords.some((keyword) => haystack.includes(keyword));
    }),
  );
}

function SourceBadge({ source }: { source: "AI" | "CUSTOM" }) {
  const isCustom = source === "CUSTOM";
  return (
    <span
      className={`rounded-full px-2 py-0.5 font-label-caps text-[10px] tracking-wide ${
        isCustom
          ? "bg-primary-container text-on-primary-container"
          : "bg-tertiary-container text-on-tertiary-container"
      }`}
    >
      {isCustom ? "Custom" : "AI"}
    </span>
  );
}

export function ValidationSelectionCard({
  predefinedCount,
  displayedRules,
  rulesDraft = null,
  onSuggestAi,
  onAddCustom,
  onEditCustom,
  onDeleteCustom,
  suggesting = false,
  addingCustom = false,
  message = null,
}: ValidationSelectionCardProps) {
  const fields = rulesDraft?.fields ?? [];

  const toggleStates = useMemo(
    () =>
      PREDEFINED_TOGGLES.map((toggle) => ({
        ...toggle,
        active: hasPredefinedRule(fields, toggle.keywords),
      })),
    [fields],
  );

  const aiCount = displayedRules.filter((rule) => rule.source === "AI").length;
  const customCount = displayedRules.filter((rule) => rule.source === "CUSTOM").length;

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
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAddCustom}
            disabled={addingCustom}
            className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary-container px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-primary-container transition-all hover:bg-primary-container/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="add" className="text-[18px]" />
            {adminCopy.addCustomRuleLabel}
          </button>
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
      </div>

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {toggleStates.map((toggle) => (
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
              <span
                className={`font-label-caps text-label-caps ${
                  toggle.active ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {toggle.active ? "ON" : "OFF"}
              </span>
            </div>
          ))}
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Predefined rules applied across fields: {predefinedCount}
        </p>

        <div className="border-t border-white/10 pt-4">
          <h4 className="mb-4 flex items-center gap-2 font-label-caps text-label-caps text-primary">
            <Icon name="rule" className="text-sm" />
            {adminCopy.allRulesTitle}
          </h4>
          {displayedRules.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Generate AI rules or add a custom rule to see them here.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {displayedRules.map((card) => (
                <div
                  key={card.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-white/5 bg-white/5 p-3"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-body-md text-body-md font-semibold text-on-surface">
                        {card.title}
                      </span>
                      <SourceBadge source={card.source} />
                    </div>
                    <span className="text-[10px] opacity-70">
                      {card.fieldName} · {card.subtitle}
                    </span>
                  </div>
                  {card.source === "CUSTOM" ? (
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditCustom?.(card)}
                        className="rounded-md p-1 text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
                        aria-label="Edit custom rule"
                      >
                        <Icon name="edit" className="text-[16px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCustom?.(card)}
                        className="rounded-md p-1 text-on-surface-variant transition-colors hover:bg-white/10 hover:text-error"
                        aria-label="Delete custom rule"
                      >
                        <Icon name="delete" className="text-[16px]" />
                      </button>
                    </div>
                  ) : null}
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
          {displayedRules.length > 0
            ? `${aiCount} AI · ${customCount} custom rule(s)`
            : "No AI or custom rules yet"}
        </span>
      </div>
    </div>
  );
}

export function collectDisplayedRuleCards(
  fields: Array<{ fieldName: string; rules: FieldRule[] }>,
): DisplayedRuleCard[] {
  const cards = fields.flatMap((field) =>
    (field.rules || [])
      .filter((rule) => isAiRule(rule) || isCustomRule(rule))
      .map((rule, index) => {
        const source: "AI" | "CUSTOM" = isCustomRule(rule) ? "CUSTOM" : "AI";
        return {
          id: `${field.fieldName}-${rule.ruleId || rule.ruleName}-${index}`,
          title: rule.ruleName,
          subtitle: rule.description || rule.constraint || "Validation rule",
          fieldName: field.fieldName,
          source,
          rule,
        };
      }),
  );
  return cards.sort((left, right) => {
    if (left.source === right.source) return 0;
    return left.source === "CUSTOM" ? -1 : 1;
  });
}

/** @deprecated use collectDisplayedRuleCards */
export function collectAiRuleCards(
  fields: Array<{ fieldName: string; rules: FieldRule[] }>,
) {
  return collectDisplayedRuleCards(fields).filter((card) => card.source === "AI");
}
