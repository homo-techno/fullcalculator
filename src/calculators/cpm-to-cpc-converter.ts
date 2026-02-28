import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cpmToCpcConverterCalculator: CalculatorDefinition = {
  slug: "cpm-to-cpc-converter",
  title: "CPM to CPC Converter",
  description: "Free CPM to CPC converter. Translate between impression-based (CPM) and click-based (CPC) pricing for ad campaigns.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cpm to cpc converter", "cpm cpc calculator", "cost per impression to click calculator"],
  variants: [{
    id: "standard",
    name: "CPM to CPC",
    description: "Free CPM to CPC converter",
    fields: [
      { name: "cpm", label: "CPM (Cost per 1000 Impressions)", type: "number", prefix: "$", min: 0, defaultValue: 5 },
      { name: "ctr", label: "Expected Click-Through Rate", type: "number", suffix: "%", min: 0.01, max: 20, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const cpm = inputs.cpm as number;
      const ctr = (inputs.ctr as number) / 100;
      if (!cpm || !ctr || cpm <= 0 || ctr <= 0) return null;
      const cpc = cpm / (ctr * 1000);
      const clicksPer1000 = ctr * 1000;
      return {
        primary: { label: "Equivalent CPC", value: "$" + formatNumber(cpc) },
        details: [
          { label: "CPM", value: "$" + formatNumber(cpm) },
          { label: "CTR", value: (ctr * 100) + "%" },
          { label: "Clicks per 1000 impressions", value: formatNumber(clicksPer1000) },
          { label: "Cost per 1000 impressions", value: "$" + formatNumber(cpm) },
          { label: "Cost per click", value: "$" + formatNumber(cpc) },
        ],
        note: "Lower CTR = higher effective CPC. If your CTR is 0.1%, a $5 CPM = $5.00 CPC. At 2% CTR, the same CPM = $0.25 CPC.",
      };
    },
  }],
  relatedSlugs: ["cpc-calculator", "roas-calculator"],
  faq: [
    { question: "What is CPM vs CPC?", answer: "CPM (Cost Per Mille) charges per 1000 impressions. CPC (Cost Per Click) charges per click. CPM is better for brand awareness; CPC for direct response." },
    { question: "How to convert CPM to CPC?", answer: "CPC = CPM / (CTR × 1000). A $5 CPM with 1% CTR = $0.50 per click. Higher CTR makes CPM campaigns more cost-efficient." },
  ],
  formula: "CPC = CPM / (CTR × 1000). Example: $5 CPM at 1% CTR = $0.50 CPC",
};
