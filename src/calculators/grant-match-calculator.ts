import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grantMatchCalculator: CalculatorDefinition = {
  slug: "grant-match-calculator",
  title: "Grant Match Calculator",
  description: "Calculate matching funds required or provided for a grant.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["grant","match","nonprofit","funding"],
  variants: [{
    id: "standard",
    name: "Grant Match",
    description: "Calculate matching funds required or provided for a grant.",
    fields: [
      { name: "grantAmount", label: "Grant Amount ($)", type: "number", min: 100, max: 10000000, defaultValue: 50000 },
      { name: "matchRatio", label: "Match Ratio", type: "select", options: [{ value: "0.5", label: "1:2 (50%)" }, { value: "1", label: "1:1 (100%)" }, { value: "2", label: "2:1 (200%)" }] },
      { name: "inKindPct", label: "In-Kind Match Allowed (%)", type: "number", min: 0, max: 100, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const grantAmount = inputs.grantAmount as number;
    const matchRatio = inputs.matchRatio as number;
    const inKindPct = inputs.inKindPct as number;
    const matchRequired = grantAmount * matchRatio;
    const inKindAllowed = matchRequired * (inKindPct / 100);
    const cashRequired = matchRequired - inKindAllowed;
    const totalProjectBudget = grantAmount + matchRequired;
    return { primary: { label: "Match Required", value: "$" + formatNumber(matchRequired) }, details: [{ label: "Cash Match Needed", value: "$" + formatNumber(cashRequired) }, { label: "In-Kind Allowed", value: "$" + formatNumber(inKindAllowed) }, { label: "Total Project Budget", value: "$" + formatNumber(totalProjectBudget) }] };
  },
  }],
  relatedSlugs: ["fundraising-roi-calculator","nonprofit-overhead-rate-calculator","volunteer-value-calculator"],
  faq: [
    { question: "What is a grant match requirement?", answer: "It requires the recipient to provide funds proportional to the grant." },
    { question: "What counts as in-kind match?", answer: "Donated goods, services, volunteer time, and use of facilities." },
    { question: "What is a 1:1 match?", answer: "You must raise one dollar for every grant dollar, equaling 100% match." },
  ],
  formula: "MatchRequired = GrantAmount * MatchRatio; CashMatch = MatchRequired * (1 - InKind%/100)",
};
