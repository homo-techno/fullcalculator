import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drawdownCalculator: CalculatorDefinition = {
  slug: "drawdown-calculator",
  title: "Maximum Drawdown Calculator",
  description:
    "Free maximum drawdown calculator. Calculate the maximum drawdown percentage from peak equity, trough equity, and determine recovery requirements.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["drawdown", "maximum drawdown", "MDD", "trading", "risk", "peak", "trough", "recovery"],
  variants: [
    {
      id: "maxDrawdown",
      name: "Maximum Drawdown",
      fields: [
        { name: "peakEquity", label: "Peak Equity ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "troughEquity", label: "Trough Equity ($)", type: "number", placeholder: "e.g. 35000" },
      ],
      calculate: (inputs) => {
        const peak = inputs.peakEquity as number;
        const trough = inputs.troughEquity as number;

        if (!peak || !trough) return null;

        const drawdownDollar = peak - trough;
        const drawdownPercent = (drawdownDollar / peak) * 100;
        const recoveryNeeded = ((peak - trough) / trough) * 100;

        return {
          primary: { label: "Maximum Drawdown", value: `${formatNumber(drawdownPercent, 2)}%` },
          details: [
            { label: "Drawdown ($)", value: `$${formatNumber(drawdownDollar, 2)}` },
            { label: "Peak Equity", value: `$${formatNumber(peak, 2)}` },
            { label: "Trough Equity", value: `$${formatNumber(trough, 2)}` },
            { label: "Recovery Needed", value: `${formatNumber(recoveryNeeded, 2)}%` },
            { label: "Recovery Factor", value: formatNumber(peak / trough, 4) },
          ],
        };
      },
    },
    {
      id: "recoveryFromDrawdown",
      name: "Recovery from Drawdown",
      fields: [
        { name: "drawdownPercent", label: "Drawdown (%)", type: "number", placeholder: "e.g. 30" },
        { name: "accountBalance", label: "Current Account Balance ($)", type: "number", placeholder: "e.g. 7000" },
      ],
      calculate: (inputs) => {
        const ddPct = inputs.drawdownPercent as number;
        const current = inputs.accountBalance as number;

        if (!ddPct || !current) return null;

        const originalPeak = current / (1 - ddPct / 100);
        const lossAmount = originalPeak - current;
        const recoveryNeeded = (lossAmount / current) * 100;

        const scenarios = [
          { dd: 10, recovery: (10 / 90) * 100 },
          { dd: 20, recovery: (20 / 80) * 100 },
          { dd: 30, recovery: (30 / 70) * 100 },
          { dd: 50, recovery: (50 / 50) * 100 },
          { dd: 75, recovery: (75 / 25) * 100 },
        ];

        return {
          primary: { label: "Recovery Gain Needed", value: `${formatNumber(recoveryNeeded, 2)}%` },
          details: [
            { label: "Original Peak", value: `$${formatNumber(originalPeak, 2)}` },
            { label: "Amount Lost", value: `$${formatNumber(lossAmount, 2)}` },
            { label: "Current Balance", value: `$${formatNumber(current, 2)}` },
            { label: "10% DD needs", value: `${formatNumber(scenarios[0].recovery, 1)}% recovery` },
            { label: "30% DD needs", value: `${formatNumber(scenarios[2].recovery, 1)}% recovery` },
            { label: "50% DD needs", value: `${formatNumber(scenarios[3].recovery, 1)}% recovery` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["profit-factor-calculator", "win-rate-calculator", "compound-trading-calculator"],
  faq: [
    { question: "What is maximum drawdown?", answer: "Maximum drawdown (MDD) is the largest percentage decline from a peak to a trough in the value of a portfolio or trading account before a new peak is achieved. It measures the worst-case loss scenario." },
    { question: "Why is drawdown recovery not symmetrical?", answer: "A 50% loss requires a 100% gain to recover. This is because you are recovering from a smaller base. A 20% loss needs 25% recovery, 30% needs 42.9%, and 50% needs 100%." },
    { question: "What is an acceptable maximum drawdown?", answer: "For most trading systems, a max drawdown of 20-30% is considered acceptable. Professional fund managers typically aim to keep MDD under 15-20%. Anything over 50% is extremely difficult to recover from." },
  ],
  formula: "Drawdown% = (Peak - Trough) / Peak x 100; Recovery% = (Peak - Trough) / Trough x 100",
};
