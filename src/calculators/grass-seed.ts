import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grassSeedCalculator: CalculatorDefinition = {
  slug: "grass-seed-calculator",
  title: "Grass Seed Calculator",
  description: "Free grass seed calculator. Calculate how many pounds of grass seed you need for new lawns, overseeding, or patching bare spots.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["grass seed calculator", "how much grass seed", "lawn seed calculator", "overseeding calculator", "grass seed per square foot"],
  variants: [
    {
      id: "calc",
      name: "Calculate Grass Seed",
      description: "Calculate pounds of grass seed for your lawn",
      fields: [
        { name: "area", label: "Lawn Area (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "type", label: "Application Type", type: "select", options: [
          { label: "New Lawn", value: "new" },
          { label: "Overseeding", value: "overseed" },
          { label: "Patching Bare Spots", value: "patch" },
        ] },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const type = inputs.type as string;
        if (!area || !type) return null;

        let rateMin: number, rateMax: number, label: string;
        switch (type) {
          case "new":
            rateMin = 6;
            rateMax = 8;
            label = "New Lawn";
            break;
          case "overseed":
            rateMin = 3;
            rateMax = 4;
            label = "Overseeding";
            break;
          case "patch":
            rateMin = 6;
            rateMax = 8;
            label = "Patching Bare Spots";
            break;
          default:
            rateMin = 6;
            rateMax = 8;
            label = "New Lawn";
        }

        const lbsMin = (area / 1000) * rateMin;
        const lbsMax = (area / 1000) * rateMax;
        const lbsAvg = (lbsMin + lbsMax) / 2;
        const bags5lb = Math.ceil(lbsMax / 5);
        const bags10lb = Math.ceil(lbsMax / 10);
        const bags25lb = Math.ceil(lbsMax / 25);

        return {
          primary: { label: "Grass Seed Needed", value: `${formatNumber(lbsMin, 1)} - ${formatNumber(lbsMax, 1)} lbs` },
          details: [
            { label: "Application type", value: label },
            { label: "Seeding rate", value: `${rateMin}-${rateMax} lbs per 1,000 sq ft` },
            { label: "Lawn area", value: `${formatNumber(area)} sq ft` },
            { label: "Recommended amount", value: `${formatNumber(lbsAvg, 1)} lbs` },
            { label: "5-lb bags needed", value: `${bags5lb}` },
            { label: "10-lb bags needed", value: `${bags10lb}` },
            { label: "25-lb bags needed", value: `${bags25lb}` },
          ],
          note: "New lawns and patches need 6-8 lbs per 1,000 sq ft. Overseeding requires 3-4 lbs per 1,000 sq ft. Use the higher rate for thick, lush coverage.",
        };
      },
    },
  ],
  relatedSlugs: ["sod-calculator", "topsoil-calculator", "fertilizer-calculator"],
  faq: [
    { question: "How much grass seed do I need per 1,000 sq ft?", answer: "For a new lawn, use 6-8 lbs per 1,000 sq ft. For overseeding an existing lawn, use 3-4 lbs per 1,000 sq ft. Rates vary slightly by grass type." },
    { question: "What is overseeding?", answer: "Overseeding is spreading grass seed over an existing lawn to fill in thin areas, improve color, and introduce newer grass varieties. It requires less seed than starting a new lawn." },
    { question: "When should I plant grass seed?", answer: "Cool-season grasses (fescue, bluegrass) are best planted in early fall or spring. Warm-season grasses (Bermuda, zoysia) should be planted in late spring or early summer." },
  ],
  formula: "Seed (lbs) = (Area / 1,000) x Rate per 1,000 sq ft",
};
