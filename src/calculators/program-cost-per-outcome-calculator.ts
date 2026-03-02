import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const programCostPerOutcomeCalculator: CalculatorDefinition = {
  slug: "program-cost-per-outcome-calculator",
  title: "Program Cost Per Outcome Calculator",
  description: "Calculate the cost per outcome for a nonprofit program.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["program","cost","outcome","nonprofit"],
  variants: [{
    id: "standard",
    name: "Program Cost Per Outcome",
    description: "Calculate the cost per outcome for a nonprofit program.",
    fields: [
      { name: "programBudget", label: "Program Budget ($)", type: "number", min: 100, max: 10000000, defaultValue: 100000 },
      { name: "outcomes", label: "Number of Outcomes Achieved", type: "number", min: 1, max: 100000, defaultValue: 200 },
      { name: "participants", label: "Total Participants", type: "number", min: 1, max: 100000, defaultValue: 300 },
    ],
    calculate: (inputs) => {
    const programBudget = inputs.programBudget as number;
    const outcomes = inputs.outcomes as number;
    const participants = inputs.participants as number;
    const costPerOutcome = programBudget / outcomes;
    const costPerParticipant = programBudget / participants;
    const successRate = (outcomes / participants) * 100;
    const effectiveCost = costPerParticipant / (successRate / 100);
    return { primary: { label: "Cost Per Outcome", value: "$" + formatNumber(costPerOutcome) }, details: [{ label: "Cost Per Participant", value: "$" + formatNumber(costPerParticipant) }, { label: "Success Rate", value: formatNumber(successRate) + "%" }, { label: "Effective Cost Per Success", value: "$" + formatNumber(effectiveCost) }] };
  },
  }],
  relatedSlugs: ["nonprofit-overhead-rate-calculator","volunteer-value-calculator","fundraising-roi-calculator"],
  faq: [
    { question: "What is cost per outcome?", answer: "It is the total program cost divided by the number of achieved outcomes." },
    { question: "Why is cost per outcome important?", answer: "It helps funders compare program efficiency across organizations." },
    { question: "How do you define an outcome?", answer: "Outcomes are measurable changes such as jobs placed or grades improved." },
  ],
  formula: "CostPerOutcome = ProgramBudget / Outcomes; SuccessRate = Outcomes / Participants * 100",
};
