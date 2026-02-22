import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tokenVestingCalculator: CalculatorDefinition = {
  slug: "token-vesting-calculator",
  title: "Token Vesting Schedule Calculator",
  description:
    "Free token vesting schedule calculator. Calculate vested and unvested token amounts based on cliff period, vesting duration, and total allocation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["token vesting", "vesting schedule", "cliff", "crypto", "token unlock", "allocation"],
  variants: [
    {
      id: "linearVesting",
      name: "Linear Vesting with Cliff",
      fields: [
        { name: "totalTokens", label: "Total Token Allocation", type: "number", placeholder: "e.g. 100000" },
        { name: "tokenPrice", label: "Token Price ($)", type: "number", placeholder: "e.g. 1.50", step: 0.01 },
        { name: "cliffMonths", label: "Cliff Period (months)", type: "number", placeholder: "e.g. 12" },
        { name: "vestingMonths", label: "Total Vesting Duration (months)", type: "number", placeholder: "e.g. 48" },
        { name: "elapsedMonths", label: "Months Elapsed", type: "number", placeholder: "e.g. 18" },
        { name: "tgeUnlock", label: "TGE Unlock (%)", type: "number", placeholder: "e.g. 10", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const totalTokens = inputs.totalTokens as number;
        const tokenPrice = inputs.tokenPrice as number;
        const cliffMonths = inputs.cliffMonths as number;
        const vestingMonths = inputs.vestingMonths as number;
        const elapsedMonths = inputs.elapsedMonths as number;
        const tgeUnlock = (inputs.tgeUnlock as number) || 0;

        if (!totalTokens || !vestingMonths || elapsedMonths === undefined) return null;

        const tgeTokens = totalTokens * (tgeUnlock / 100);
        const vestingTokens = totalTokens - tgeTokens;
        let vestedTokens = tgeTokens;

        if (elapsedMonths >= cliffMonths) {
          const vestingAfterCliff = vestingMonths - cliffMonths;
          const monthsVesting = Math.min(elapsedMonths - cliffMonths, vestingAfterCliff);
          vestedTokens += vestingAfterCliff > 0 ? vestingTokens * (monthsVesting / vestingAfterCliff) : 0;
        }

        vestedTokens = Math.min(vestedTokens, totalTokens);
        const unvestedTokens = totalTokens - vestedTokens;
        const vestedValue = vestedTokens * (tokenPrice || 0);
        const vestedPercent = (vestedTokens / totalTokens) * 100;

        return {
          primary: { label: "Vested Tokens", value: formatNumber(vestedTokens, 2) },
          details: [
            { label: "Vested Percentage", value: `${formatNumber(vestedPercent, 2)}%` },
            { label: "Unvested Tokens", value: formatNumber(unvestedTokens, 2) },
            { label: "Vested Value", value: `$${formatNumber(vestedValue, 2)}` },
            { label: "TGE Unlock", value: `${formatNumber(tgeTokens, 2)} tokens` },
            { label: "Total Allocation", value: formatNumber(totalTokens, 0) },
            { label: "Months Remaining", value: formatNumber(Math.max(0, vestingMonths - elapsedMonths), 0) },
          ],
        };
      },
    },
    {
      id: "monthlyUnlock",
      name: "Monthly Unlock Amount",
      fields: [
        { name: "totalTokens", label: "Total Token Allocation", type: "number", placeholder: "e.g. 100000" },
        { name: "tokenPrice", label: "Token Price ($)", type: "number", placeholder: "e.g. 1.50", step: 0.01 },
        { name: "cliffMonths", label: "Cliff Period (months)", type: "number", placeholder: "e.g. 6" },
        { name: "vestingMonths", label: "Total Vesting Duration (months)", type: "number", placeholder: "e.g. 36" },
        { name: "tgePercent", label: "TGE Unlock (%)", type: "number", placeholder: "e.g. 5", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const totalTokens = inputs.totalTokens as number;
        const tokenPrice = inputs.tokenPrice as number;
        const cliffMonths = (inputs.cliffMonths as number) || 0;
        const vestingMonths = inputs.vestingMonths as number;
        const tgePercent = (inputs.tgePercent as number) || 0;

        if (!totalTokens || !vestingMonths) return null;

        const tgeTokens = totalTokens * (tgePercent / 100);
        const vestingTokens = totalTokens - tgeTokens;
        const vestingPeriod = vestingMonths - cliffMonths;
        const monthlyUnlock = vestingPeriod > 0 ? vestingTokens / vestingPeriod : 0;
        const monthlyValue = monthlyUnlock * (tokenPrice || 0);

        return {
          primary: { label: "Monthly Unlock", value: `${formatNumber(monthlyUnlock, 2)} tokens` },
          details: [
            { label: "Monthly Value", value: `$${formatNumber(monthlyValue, 2)}` },
            { label: "TGE Unlock", value: `${formatNumber(tgeTokens, 2)} tokens` },
            { label: "Tokens in Vesting", value: formatNumber(vestingTokens, 2) },
            { label: "Vesting Period (after cliff)", value: `${formatNumber(vestingPeriod, 0)} months` },
            { label: "Total Value at Current Price", value: `$${formatNumber(totalTokens * (tokenPrice || 0), 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["crypto-profit-calculator", "staking-rewards-calculator", "compound-interest-calculator"],
  faq: [
    { question: "What is token vesting?", answer: "Token vesting is a mechanism that gradually releases tokens to holders over a set period, preventing immediate selling and aligning long-term incentives for team members, investors, and advisors." },
    { question: "What is a cliff period?", answer: "A cliff is an initial waiting period during which no tokens vest. After the cliff passes, tokens begin vesting (usually linearly). A common cliff is 6-12 months." },
    { question: "What is TGE unlock?", answer: "TGE (Token Generation Event) unlock is the percentage of tokens immediately available when the token first launches, before the regular vesting schedule begins." },
  ],
  formula: "Vested = TGE_Tokens + (Vesting_Tokens x Months_After_Cliff / Vesting_Period); Monthly Unlock = Vesting_Tokens / (Total_Months - Cliff_Months)",
};
