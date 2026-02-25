import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seedGerminationCalculator: CalculatorDefinition = {
  slug: "seed-germination-calculator",
  title: "Seed Germination Rate Calculator",
  description: "Free seed germination rate calculator. Calculate germination percentage, determine how many seeds to plant, and estimate seedling success rates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["seed germination calculator", "germination rate", "how many seeds to plant", "seed viability", "germination percentage"],
  variants: [
    {
      id: "germination-rate",
      name: "Germination Rate Test",
      description: "Calculate germination percentage from a test batch",
      fields: [
        { name: "seedsTested", label: "Seeds Tested", type: "number", placeholder: "e.g. 20" },
        { name: "seedsSprouted", label: "Seeds Sprouted", type: "number", placeholder: "e.g. 16" },
      ],
      calculate: (inputs) => {
        const tested = inputs.seedsTested as number;
        const sprouted = inputs.seedsSprouted as number;
        if (!tested || sprouted === undefined) return null;
        if (sprouted > tested) return null;

        const rate = (sprouted / tested) * 100;
        let quality = "Excellent";
        if (rate < 50) quality = "Poor - consider new seeds";
        else if (rate < 70) quality = "Fair";
        else if (rate < 85) quality = "Good";

        return {
          primary: { label: "Germination Rate", value: `${formatNumber(rate, 1)}%` },
          details: [
            { label: "Seeds sprouted", value: `${sprouted} of ${tested}` },
            { label: "Seed quality", value: quality },
            { label: "Seeds to plant per spot", value: rate >= 80 ? "1-2 seeds" : rate >= 50 ? "2-3 seeds" : "3-4 seeds" },
          ],
          note: "Test at least 10-20 seeds for an accurate rate. Place seeds between damp paper towels in a warm spot for 7-14 days.",
        };
      },
    },
    {
      id: "seeds-needed",
      name: "Seeds Needed to Plant",
      description: "Calculate how many seeds to sow based on germination rate",
      fields: [
        { name: "plantsWanted", label: "Plants Desired", type: "number", placeholder: "e.g. 30" },
        { name: "germRate", label: "Germination Rate (%)", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
        { name: "survivalRate", label: "Seedling Survival Rate (%)", type: "number", placeholder: "e.g. 90", defaultValue: 90 },
      ],
      calculate: (inputs) => {
        const plantsWanted = inputs.plantsWanted as number;
        const germRate = (inputs.germRate as number) || 80;
        const survivalRate = (inputs.survivalRate as number) || 90;
        if (!plantsWanted) return null;

        const effectiveRate = (germRate / 100) * (survivalRate / 100);
        const seedsNeeded = Math.ceil(plantsWanted / effectiveRate);
        const expectedSprouts = Math.floor(seedsNeeded * (germRate / 100));
        const expectedSurvivors = Math.floor(expectedSprouts * (survivalRate / 100));
        const extraSeeds = seedsNeeded - plantsWanted;

        return {
          primary: { label: "Seeds to Plant", value: `${seedsNeeded}` },
          details: [
            { label: "Plants desired", value: `${plantsWanted}` },
            { label: "Expected to sprout", value: `${expectedSprouts}` },
            { label: "Expected to survive", value: `${expectedSurvivors}` },
            { label: "Extra seeds (buffer)", value: `${extraSeeds}` },
            { label: "Effective success rate", value: `${formatNumber(effectiveRate * 100, 1)}%` },
          ],
          note: "Thin extra seedlings after they establish. Transplant extras rather than discarding when possible.",
        };
      },
    },
  ],
  relatedSlugs: ["vegetable-garden-size-calculator", "garden-row-spacing-calculator", "frost-date-calculator"],
  faq: [
    { question: "What is a good germination rate?", answer: "80-95% is excellent for fresh seeds. 70-80% is good. Below 70%, consider planting extra seeds or purchasing new stock. Germination rates decline as seeds age." },
    { question: "How do I test seed germination at home?", answer: "Place 10-20 seeds on a damp paper towel, fold it, put it in a sealed plastic bag, and keep it warm (70-80\u00B0F). Check daily for 7-14 days and count sprouted seeds." },
  ],
  formula: "Germination Rate = (Sprouted / Tested) \u00D7 100 | Seeds Needed = Plants Desired / (Germ Rate \u00D7 Survival Rate)",
};
