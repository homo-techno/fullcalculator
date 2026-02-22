import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const brandAwarenessCalculator: CalculatorDefinition = {
  slug: "brand-awareness",
  title: "Brand Awareness Lift Calculator",
  description: "Free brand awareness lift calculator. Measure the increase in brand recognition and recall from your marketing campaigns.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["brand awareness", "brand lift", "brand recall", "brand recognition", "awareness campaign"],
  variants: [
    {
      id: "basic",
      name: "Brand Lift Measurement",
      fields: [
        { name: "preAwareness", label: "Pre-Campaign Awareness (%)", type: "number", placeholder: "e.g. 25" },
        { name: "postAwareness", label: "Post-Campaign Awareness (%)", type: "number", placeholder: "e.g. 38" },
        { name: "campaignCost", label: "Campaign Cost ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "targetMarketSize", label: "Target Market Size", type: "number", placeholder: "e.g. 1000000" },
      ],
      calculate: (inputs) => {
        const preAwareness = inputs.preAwareness as number;
        const postAwareness = inputs.postAwareness as number;
        const campaignCost = inputs.campaignCost as number;
        const marketSize = inputs.targetMarketSize as number;
        if (!preAwareness && preAwareness !== 0) return null;
        if (!postAwareness || !campaignCost || !marketSize) return null;
        const absoluteLift = postAwareness - preAwareness;
        const relativeLift = ((postAwareness - preAwareness) / preAwareness) * 100;
        const newAwarePeople = marketSize * (absoluteLift / 100);
        const costPerAwarePerson = campaignCost / newAwarePeople;
        return {
          primary: { label: "Brand Awareness Lift", value: `${formatNumber(absoluteLift, 1)} pp` },
          details: [
            { label: "Pre-Campaign Awareness", value: `${formatNumber(preAwareness, 1)}%` },
            { label: "Post-Campaign Awareness", value: `${formatNumber(postAwareness, 1)}%` },
            { label: "Relative Lift", value: `${formatNumber(relativeLift, 1)}%` },
            { label: "New Aware People", value: formatNumber(newAwarePeople, 0) },
            { label: "Cost per Aware Person", value: `$${formatNumber(costPerAwarePerson, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ad-frequency", "cpm-calculator", "social-media-roi"],
  faq: [
    { question: "What is brand lift?", answer: "Brand lift measures the increase in key brand metrics (awareness, recall, favorability) attributable to an advertising campaign. It is typically measured via surveys comparing an exposed group to a control group." },
    { question: "How do you measure brand awareness?", answer: "Brand awareness is measured through surveys asking about brand recognition (aided awareness) and recall (unaided awareness). Digital platforms like Google and Facebook also offer brand lift studies." },
  ],
  formula: "Brand Lift = Post-Campaign Awareness - Pre-Campaign Awareness",
};
