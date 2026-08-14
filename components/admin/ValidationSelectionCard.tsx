"use client";

import { useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import type { FieldRule, PredefinedChecks, RulesDraft } from "@/lib/api/rules";
import {
  isAiRule,
  isCustomRule,
  isRulePending,
  isRuleRejected,
  isRuleSelected,
  normalizePredefinedChecks,
} from "@/lib/api/rules";
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
  onTogglePredefined?: (key: keyof PredefinedChecks, enabled: boolean) => void;
  onSelectRule?: (card: DisplayedRuleCard, selected: boolean) => void;
  suggesting?: boolean;
  addingCustom?: boolean;
  message?: string | null;
};

const PREDEFINED_TOGGLES: {
  id: keyof PredefinedChecks;
  label: string;
  icon: string;
}[] = [
  { id: "duplicates", label: "Remove Duplicate Records", icon: "library_add_check" },
  { id: "nullCheck", label: "Check Null Keys", icon: "key" },
  { id: "trim", label: "Trim Empty Spaces", icon: "space_bar" },
];

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

function SelectionButtons({
  card,
  onSelectRule,
}: {
  card: DisplayedRuleCard;
  onSelectRule?: (card: DisplayedRuleCard, selected: boolean) => void;
}) {
  const selected = isRuleSelected(card.rule);
  const rejected = isRuleRejected(card.rule);
  const pending = isRulePending(card.rule);

  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => onSelectRule?.(card, true)}
        disabled={!onSelectRule}
        className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
          selected && !pending
            ? "border-primary bg-primary text-on-primary"
            : "border-ink/15 bg-surface text-on-surface-variant hover:border-primary/40 hover:text-primary"
        }`}
        aria-label={`Select ${card.title}`}
        aria-pressed={selected && !pending}
      >
        <Icon name="check" className="text-[18px]" />
      </button>
      <button
        type="button"
        onClick={() => onSelectRule?.(card, false)}
        disabled={!onSelectRule}
        className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
          rejected
            ? "border-error/40 bg-error/15 text-error"
            : "border-ink/15 bg-surface text-on-surface-variant hover:border-error/40 hover:text-error"
        }`}
        aria-label={`Reject ${card.title}`}
        aria-pressed={rejected}
      >
        <Icon name="close" className="text-[18px]" />
      </button>
    </div>
  );
}

function RuleCard({
  card,
  onSelectRule,
  onEditCustom,
  onDeleteCustom,
}: {
  card: DisplayedRuleCard;
  onSelectRule?: (card: DisplayedRuleCard, selected: boolean) => void;
  onEditCustom?: (card: DisplayedRuleCard) => void;
  onDeleteCustom?: (card: DisplayedRuleCard) => void;
}) {
  const selected = isRuleSelected(card.rule) && !isRulePending(card.rule);

  return (
    <div
      className={`flex items-start justify-between gap-2 rounded-lg border p-3 ${
        selected
          ? "border-primary/30 bg-primary/5"
          : isRuleRejected(card.rule)
            ? "border-ink/10 bg-surface-container-low opacity-70"
            : "border-ink/10 bg-surface-container-low"
      }`}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-body-md text-body-md font-semibold text-on-surface">
            {card.title}
          </span>
          <SourceBadge source={card.source} />
        </div>
        <span className="text-[10px] text-on-surface-variant opacity-70">
          {card.fieldName} · {card.subtitle}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <SelectionButtons card={card} onSelectRule={onSelectRule} />
        {card.source === "CUSTOM" ? (
          <>
            <button
              type="button"
              onClick={() => onEditCustom?.(card)}
              className="rounded-md p-1 text-on-surface-variant transition-colors hover:bg-ink/10 hover:text-on-surface"
              aria-label="Edit custom rule"
            >
              <Icon name="edit" className="text-[16px]" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteCustom?.(card)}
              className="rounded-md p-1 text-on-surface-variant transition-colors hover:bg-ink/10 hover:text-error"
              aria-label="Delete custom rule"
            >
              <Icon name="delete" className="text-[16px]" />
            </button>
          </>
        ) : null}
      </div>
    </div>
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
  onTogglePredefined,
  onSelectRule,
  suggesting = false,
  addingCustom = false,
  message = null,
}: ValidationSelectionCardProps) {
  const checks = normalizePredefinedChecks(rulesDraft?.predefinedChecks);
  const canToggle = Boolean(rulesDraft && onTogglePredefined);

  const aiRules = displayedRules.filter((rule) => rule.source === "AI");
  const customRules = displayedRules.filter((rule) => rule.source === "CUSTOM");
  const pendingCount = aiRules.filter((card) => isRulePending(card.rule)).length;

  const footerText = useMemo(() => {
    if (pendingCount > 0) {
      return `${pendingCount} suggestion${pendingCount === 1 ? "" : "s"} pending review`;
    }
    if (displayedRules.length > 0) {
      return `${aiRules.length} AI · ${customRules.length} custom rule(s)`;
    }
    return "No AI or custom rules yet";
  }, [pendingCount, displayedRules.length, aiRules.length, customRules.length]);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-card">
      <div className="flex flex-col gap-3 border-b border-ink/10 bg-surface-container-low p-5 sm:flex-row sm:items-center sm:justify-between">
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
            className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary-container px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-primary-container shadow-primary transition-all hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="add" className="text-[18px]" />
            {adminCopy.addCustomRuleLabel}
          </button>
          <button
            type="button"
            onClick={onSuggestAi}
            disabled={suggesting}
            className="flex items-center gap-2 rounded-lg border border-tertiary/30 bg-tertiary-container px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-tertiary-container shadow-tertiary transition-all hover:bg-tertiary-fixed disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="smart_toy" className="text-[18px]" />
            {suggesting ? "Generating with AI…" : adminCopy.suggestViaAiLabel}
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PREDEFINED_TOGGLES.map((toggle) => (
            <div
              key={toggle.id}
              className="flex flex-col gap-3 rounded-lg border border-ink/10 bg-surface-container-low p-4"
            >
              <div className="flex items-center gap-2">
                <Icon name={toggle.icon} className="text-secondary" />
                <span className="font-body-md text-body-md font-semibold text-on-surface">
                  {toggle.label}
                </span>
              </div>
              <ToggleSwitch
                checked={checks[toggle.id]}
                onChange={(next) => onTogglePredefined?.(toggle.id, next)}
                label={toggle.label}
                disabled={!canToggle}
              />
            </div>
          ))}
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Predefined rules applied across fields: {predefinedCount}
        </p>

        <div className="border-t border-ink/15 pt-4">
          <h4 className="mb-4 flex items-center gap-2 font-label-caps text-label-caps text-primary">
            <Icon name="smart_toy" className="text-sm" />
            {adminCopy.aiRulesTitle}
          </h4>
          {aiRules.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Generate AI rules to review suggestions here.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {aiRules.map((card) => (
                <RuleCard
                  key={card.id}
                  card={card}
                  onSelectRule={onSelectRule}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-ink/15 pt-4">
          <h4 className="mb-4 flex items-center gap-2 font-label-caps text-label-caps text-primary">
            <Icon name="rule" className="text-sm" />
            {adminCopy.customRulesTitle}
          </h4>
          {customRules.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Add a custom rule to see it here.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {customRules.map((card) => (
                <RuleCard
                  key={card.id}
                  card={card}
                  onSelectRule={onSelectRule}
                  onEditCustom={onEditCustom}
                  onDeleteCustom={onDeleteCustom}
                />
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

      <div className="flex justify-center border-t border-ink/10 bg-surface-container-low p-3">
        <span className="font-body-sm text-body-sm text-on-surface-variant italic opacity-70">
          {footerText}
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
