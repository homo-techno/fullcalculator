import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const collegeComparisonCalculator: CalculatorDefinition = {
  slug: "college-comparison-calculator",
  title: "College Comparison Calculator",
  description: "Compare total costs of two colleges including tuition, room and board, and financial aid.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["college cost comparison", "university cost calculator", "college affordability"],
  variants: [{
    id: "standard",
    name: "College Comparison",
    description: "Compare total costs of two colleges including tuition, room and board, and financial aid",
    fields: [
      { name: "tuition1", label: "College A Annual Tuition", type: "number", prefix: "$", min: 1000, max: 100000, defaultValue: 35000 },
      { name: "tuition2", label: "College B Annual Tuition", type: "number", prefix: "$", min: 1000, max: 100000, defaultValue: 15000 },
      { name: "aid1", label: "College A Annual Aid", type: "number", prefix: "$", min: 0, max: 80000, defaultValue: 10000 },
      { name: "aid2", label: "College B Annual Aid", type: "number", prefix: "$", min: 0, max: 80000, defaultValue: 3000 },
    ],
    calculate: (inputs) => {
      const t1 = inputs.tuition1 as number;
      const t2 = inputs.tuition2 as number;
      const a1 = inputs.aid1 as number;
      const a2 = inputs.aid2 as number;
      if (!t1 || !t2) return null;
      const net1 = (t1 - a1) * 4;
      const net2 = (t2 - a2) * 4;
      const diff = Math.abs(net1 - net2);
      const cheaper = net1 < net2 ? "College A" : "College B";
      return {
        primary: { label: "4-Year Savings (" + cheaper + ")", value: "$" + formatNumber(Math.round(diff)) },
        details: [
          { label: "College A (4-Year Net)", value: "$" + formatNumber(Math.round(net1)) },
          { label: "College B (4-Year Net)", value: "$" + formatNumber(Math.round(net2)) },
          { label: "College A Annual Net", value: "$" + formatNumber(Math.round(t1 - a1)) },
          { label: "College B Annual Net", value: "$" + formatNumber(Math.round(t2 - a2)) },
        ],
      };
    },
  }],
  relatedSlugs: ["private-school-cost-calculator", "student-housing-calculator"],
  faq: [
    { question: "How do I compare college costs?", answer: "Compare net costs after financial aid, not sticker prices. Include tuition, fees, room, board, and personal expenses." },
    { question: "Is a more expensive college worth it?", answer: "Not always. Research shows outcomes depend more on the student than the school. Compare net costs and career outcomes." },
  ],
  formula: "4-Year Net Cost = (Annual Tuition - Annual Aid) x 4",
};
