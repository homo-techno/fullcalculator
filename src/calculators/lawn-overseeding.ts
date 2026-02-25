import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lawnOverseedingCalculator: CalculatorDefinition = {
  slug: "lawn-overseeding-calculator",
  title: "Lawn Overseeding Calculator",
  description: "Free lawn overseeding calculator. Calculate the amount of grass seed needed to overseed your lawn based on lawn size, grass type, and condition.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lawn overseeding calculator", "grass seed calculator", "how much seed to overseed", "overseeding rate", "lawn renovation calculator"],
  variants: [
    {
      id: "overseeding",
      name: "Overseeding Calculator",
      description: "Calculate seed needed for overseeding an existing lawn",
      fields: [
        { name: "area", label: "Lawn Area (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "grassType", label: "Grass Type", type: "select", options: [
          { label: "Kentucky Bluegrass (2 lbs/1000 sq ft)", value: "2" },
          { label: "Perennial Ryegrass (4 lbs/1000 sq ft)", value: "4" },
          { label: "Tall Fescue (4 lbs/1000 sq ft)", value: "4" },
          { label: "Fine Fescue (3 lbs/1000 sq ft)", value: "3" },
          { label: "Bermuda Grass (1.5 lbs/1000 sq ft)", value: "1.5" },
          { label: "Zoysia Grass (1 lb/1000 sq ft)", value: "1" },
        ], defaultValue: "4" },
        { name: "condition", label: "Lawn Condition", type: "select", options: [
          { label: "Light overseeding (thin spots)", value: "0.5" },
          { label: "Standard overseeding", value: "1.0" },
          { label: "Heavy renovation (bare areas)", value: "1.5" },
          { label: "New lawn establishment", value: "2.0" },
        ], defaultValue: "1.0" },
        { name: "pricePerLb", label: "Seed Price per Pound (optional)", type: "number", placeholder: "e.g. 5", prefix: "$" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const baseRate = parseFloat(inputs.grassType as string) || 4;
        const conditionMod = parseFloat(inputs.condition as string) || 1.0;
        const price = inputs.pricePerLb as number;
        if (!area) return null;

        const seedRate = baseRate * conditionMod;
        const totalLbs = (area / 1000) * seedRate;
        const bags5lb = Math.ceil(totalLbs / 5);
        const bags10lb = Math.ceil(totalLbs / 10);

        const details = [
          { label: "Seeding rate", value: `${formatNumber(seedRate, 1)} lbs / 1,000 sq ft` },
          { label: "Total seed", value: `${formatNumber(totalLbs, 1)} lbs` },
          { label: "5-lb bags needed", value: `${bags5lb}` },
          { label: "10-lb bags needed", value: `${bags10lb}` },
          { label: "Lawn area", value: `${formatNumber(area)} sq ft` },
        ];
        if (price) {
          details.push({ label: "Estimated seed cost", value: `$${formatNumber(totalLbs * price)}` });
        }

        return {
          primary: { label: "Seed Needed", value: `${formatNumber(totalLbs, 1)} lbs` },
          details,
          note: "Best time to overseed cool-season grasses is early fall. For warm-season grasses, late spring. Water lightly 2-3 times daily until established.",
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "lawn-aeration-calculator", "watering-schedule-calculator"],
  faq: [
    { question: "When is the best time to overseed a lawn?", answer: "Cool-season grasses (fescue, bluegrass, ryegrass): early fall (August-September). Warm-season grasses (bermuda, zoysia): late spring to early summer. Soil temperature should be 50-65\u00B0F for cool-season and 65-70\u00B0F for warm-season." },
    { question: "Should I aerate before overseeding?", answer: "Yes, core aeration before overseeding dramatically improves seed-to-soil contact and germination rates. The aeration holes provide ideal spots for seeds to establish." },
  ],
  formula: "Seed (lbs) = (Lawn Area / 1000) \u00D7 Seeding Rate \u00D7 Condition Modifier",
};
