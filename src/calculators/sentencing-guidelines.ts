import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sentencingGuidelinesCalculator: CalculatorDefinition = {
  slug: "sentencing-guidelines",
  title: "Federal Sentencing Guidelines Calculator",
  description: "Free online federal sentencing guidelines calculator. Estimate sentencing ranges based on offense level and criminal history category.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sentencing guidelines", "federal sentencing", "criminal sentence", "offense level", "criminal history", "prison sentence", "sentencing table"],
  variants: [
    {
      id: "sentencing-range",
      name: "Calculate Sentencing Range",
      fields: [
        {
          name: "baseOffenseLevel",
          label: "Base Offense Level (1-43)",
          type: "number",
          placeholder: "e.g. 20",
          min: 1,
          max: 43,
        },
        {
          name: "adjustments",
          label: "Specific Offense Adjustments (+/-)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "acceptance",
          label: "Acceptance of Responsibility",
          type: "select",
          options: [
            { label: "No Reduction", value: "0" },
            { label: "2-Level Reduction (guilty plea)", value: "2" },
            { label: "3-Level Reduction (early guilty plea)", value: "3" },
          ],
        },
        {
          name: "criminalHistoryCategory",
          label: "Criminal History Category",
          type: "select",
          options: [
            { label: "Category I (0-1 points)", value: "1" },
            { label: "Category II (2-3 points)", value: "2" },
            { label: "Category III (4-6 points)", value: "3" },
            { label: "Category IV (7-9 points)", value: "4" },
            { label: "Category V (10-12 points)", value: "5" },
            { label: "Category VI (13+ points)", value: "6" },
          ],
        },
      ],
      calculate: (inputs) => {
        const baseLevel = parseFloat(inputs.baseOffenseLevel as string) || 1;
        const adjustments = parseFloat(inputs.adjustments as string) || 0;
        const acceptance = parseFloat(inputs.acceptance as string) || 0;
        const historyCategory = parseFloat(inputs.criminalHistoryCategory as string) || 1;

        const finalLevel = Math.max(1, Math.min(43, baseLevel + adjustments - acceptance));

        const sentencingTable: Record<number, Record<number, [number, number]>> = {
          1: { 1: [0, 6], 2: [0, 6], 3: [0, 6], 4: [0, 6], 5: [0, 6], 6: [0, 6] },
          5: { 1: [0, 6], 2: [0, 6], 3: [0, 6], 4: [2, 8], 5: [4, 10], 6: [6, 12] },
          10: { 1: [6, 12], 2: [8, 14], 3: [10, 16], 4: [15, 21], 5: [18, 24], 6: [21, 27] },
          15: { 1: [18, 24], 2: [21, 27], 3: [24, 30], 4: [30, 37], 5: [33, 41], 6: [37, 46] },
          20: { 1: [33, 41], 2: [37, 46], 3: [41, 51], 4: [51, 63], 5: [57, 71], 6: [63, 78] },
          25: { 1: [57, 71], 2: [63, 78], 3: [70, 87], 4: [84, 105], 5: [100, 125], 6: [110, 137] },
          30: { 1: [97, 121], 2: [108, 135], 3: [121, 151], 4: [135, 168], 5: [151, 188], 6: [168, 210] },
          35: { 1: [168, 210], 2: [188, 235], 3: [210, 262], 4: [235, 293], 5: [262, 327], 6: [292, 365] },
          40: { 1: [292, 365], 2: [324, 405], 3: [360, 999], 4: [360, 999], 5: [360, 999], 6: [360, 999] },
          43: { 1: [999, 999], 2: [999, 999], 3: [999, 999], 4: [999, 999], 5: [999, 999], 6: [999, 999] },
        };

        const levels = Object.keys(sentencingTable).map(Number).sort((a, b) => a - b);
        let closestLevel = levels[0];
        for (const l of levels) {
          if (l <= finalLevel) closestLevel = l;
        }

        const range = sentencingTable[closestLevel]?.[historyCategory] || [0, 6];
        const minMonths = range[0];
        const maxMonths = range[1];

        const formatSentence = (months: number): string => {
          if (months >= 999) return "Life";
          if (months >= 12) {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            return remainingMonths > 0
              ? years + " yr " + remainingMonths + " mo"
              : years + " yr";
          }
          return months + " mo";
        };

        return {
          primary: { label: "Sentencing Range", value: formatSentence(minMonths) + " - " + formatSentence(maxMonths) },
          details: [
            { label: "Base Offense Level", value: formatNumber(baseLevel, 0) },
            { label: "Adjustments", value: (adjustments >= 0 ? "+" : "") + formatNumber(adjustments, 0) },
            { label: "Acceptance Reduction", value: "-" + formatNumber(acceptance, 0) },
            { label: "Final Offense Level", value: formatNumber(finalLevel, 0) },
            { label: "Criminal History Category", value: "Category " + formatNumber(historyCategory, 0) },
            { label: "Minimum (months)", value: minMonths >= 999 ? "Life" : formatNumber(minMonths, 0) },
            { label: "Maximum (months)", value: maxMonths >= 999 ? "Life" : formatNumber(maxMonths, 0) },
          ],
          note: "This uses a simplified sentencing table. Actual sentences depend on mandatory minimums, departures, variances, and judicial discretion. Consult a criminal defense attorney.",
        };
      },
    },
  ],
  relatedSlugs: ["bail-calculator", "statute-limitations", "legal-fee-calc"],
  faq: [
    {
      question: "What are the federal sentencing guidelines?",
      answer: "The federal sentencing guidelines are a set of rules created by the U.S. Sentencing Commission that provide recommended sentence ranges based on the offense level and the defendant's criminal history. While advisory since 2005 (United States v. Booker), judges still consult them.",
    },
    {
      question: "What is the offense level?",
      answer: "The offense level is a number (1-43) that reflects the seriousness of the crime. It starts with a base level for the type of offense and is adjusted for specific characteristics (e.g., amount of loss, use of a weapon, role in the offense).",
    },
    {
      question: "What is acceptance of responsibility?",
      answer: "A defendant who clearly accepts responsibility for their offense (typically by pleading guilty) may receive a 2 or 3 level reduction in their offense level. An early guilty plea before significant resources are spent usually qualifies for the full 3-level reduction.",
    },
  ],
  formula: "Final Offense Level = Base Level + Adjustments - Acceptance Reduction\nSentence = Sentencing Table[Final Level][Criminal History Category]",
};
