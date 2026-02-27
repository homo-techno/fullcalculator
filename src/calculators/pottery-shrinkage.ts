import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const potteryShrinkageCalculator: CalculatorDefinition = {
  slug: "pottery-shrinkage-calculator",
  title: "Pottery Clay Shrinkage Calculator",
  description:
    "Free pottery clay shrinkage calculator. Calculate how much larger to make your pottery piece to account for clay shrinkage during drying and firing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pottery shrinkage calculator",
    "clay shrinkage rate",
    "ceramic shrinkage",
    "pottery sizing",
    "firing shrinkage calculator",
  ],
  variants: [
    {
      id: "target-size",
      name: "Target Finished Size",
      description: "Calculate wet size needed for desired finished size",
      fields: [
        {
          name: "finishedSize",
          label: "Desired Finished Dimension",
          type: "number",
          placeholder: "e.g. 8",
          min: 0.25,
          step: 0.25,
        },
        {
          name: "unit",
          label: "Unit",
          type: "select",
          options: [
            { label: "Inches", value: "inches" },
            { label: "Centimeters", value: "cm" },
          ],
          defaultValue: "inches",
        },
        {
          name: "clayType",
          label: "Clay Body",
          type: "select",
          options: [
            { label: "Earthenware (cone 06-02)", value: "earthenware" },
            { label: "Stoneware (cone 6)", value: "stoneware-mid" },
            { label: "Stoneware (cone 10)", value: "stoneware-high" },
            { label: "Porcelain (cone 6)", value: "porcelain-mid" },
            { label: "Porcelain (cone 10)", value: "porcelain-high" },
            { label: "Custom (enter %)", value: "custom" },
          ],
          defaultValue: "stoneware-mid",
        },
        {
          name: "customShrinkage",
          label: "Custom Total Shrinkage (%) - if custom",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
          max: 25,
        },
      ],
      calculate: (inputs) => {
        const finished = parseFloat(inputs.finishedSize as string);
        const unit = inputs.unit as string;
        const clayType = inputs.clayType as string;
        const customPct = parseFloat(inputs.customShrinkage as string);
        if (!finished) return null;

        // Total shrinkage percentages (drying + firing)
        const shrinkageMap: Record<string, { drying: number; firing: number }> = {
          earthenware: { drying: 4, firing: 2 },
          "stoneware-mid": { drying: 5, firing: 7 },
          "stoneware-high": { drying: 5, firing: 8 },
          "porcelain-mid": { drying: 5, firing: 9 },
          "porcelain-high": { drying: 6, firing: 10 },
          custom: { drying: 0, firing: 0 },
        };

        let totalShrinkage: number;
        let dryingShrinkage: number;
        let firingShrinkage: number;

        if (clayType === "custom" && customPct) {
          totalShrinkage = customPct;
          dryingShrinkage = customPct * 0.4;
          firingShrinkage = customPct * 0.6;
        } else {
          const data = shrinkageMap[clayType] || shrinkageMap["stoneware-mid"];
          dryingShrinkage = data.drying;
          firingShrinkage = data.firing;
          totalShrinkage = dryingShrinkage + firingShrinkage;
        }

        // Wet size = finished size / (1 - shrinkage/100)
        const wetSize = finished / (1 - totalShrinkage / 100);
        const drySize = finished / (1 - firingShrinkage / 100);
        const difference = wetSize - finished;

        const unitLabel = unit === "inches" ? '"' : " cm";

        return {
          primary: {
            label: "Make It This Size (wet)",
            value: formatNumber(wetSize, 2) + unitLabel,
          },
          details: [
            { label: "Desired Finished Size", value: formatNumber(finished, 2) + unitLabel },
            { label: "Bone Dry (bisque) Size", value: formatNumber(drySize, 2) + unitLabel },
            { label: "Size Difference", value: formatNumber(difference, 2) + unitLabel },
            { label: "Total Shrinkage", value: formatNumber(totalShrinkage, 1) + "%" },
            { label: "Drying Shrinkage", value: formatNumber(dryingShrinkage, 1) + "%" },
            { label: "Firing Shrinkage", value: formatNumber(firingShrinkage, 1) + "%" },
          ],
          note: "Shrinkage rates vary by clay body and firing temperature. Test your specific clay by measuring a test tile before and after firing to determine actual shrinkage.",
        };
      },
    },
    {
      id: "measure-shrinkage",
      name: "Measure Shrinkage Rate",
      description: "Calculate your clay's shrinkage from test tile measurements",
      fields: [
        {
          name: "wetSize",
          label: "Wet Size (any unit)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0.5,
          step: 0.1,
        },
        {
          name: "drySize",
          label: "Bone Dry Size (same unit)",
          type: "number",
          placeholder: "e.g. 9.5",
          min: 0.5,
          step: 0.1,
        },
        {
          name: "firedSize",
          label: "Fired Size (same unit)",
          type: "number",
          placeholder: "e.g. 8.8",
          min: 0.5,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const wet = parseFloat(inputs.wetSize as string);
        const dry = parseFloat(inputs.drySize as string);
        const fired = parseFloat(inputs.firedSize as string);
        if (!wet || !dry || !fired) return null;

        const dryingShrinkage = ((wet - dry) / wet) * 100;
        const firingShrinkage = ((dry - fired) / dry) * 100;
        const totalShrinkage = ((wet - fired) / wet) * 100;

        // Absorption test estimate
        const estimatedAbsorption = Math.max(0, 12 - totalShrinkage * 0.7);

        return {
          primary: {
            label: "Total Shrinkage",
            value: formatNumber(totalShrinkage, 1) + "%",
          },
          details: [
            { label: "Drying Shrinkage (wet to dry)", value: formatNumber(dryingShrinkage, 1) + "%" },
            { label: "Firing Shrinkage (dry to fired)", value: formatNumber(firingShrinkage, 1) + "%" },
            { label: "Shrinkage Factor", value: formatNumber(1 / (1 - totalShrinkage / 100), 4) },
            { label: "Wet Measurement", value: formatNumber(wet, 2) },
            { label: "Dry Measurement", value: formatNumber(dry, 2) },
            { label: "Fired Measurement", value: formatNumber(fired, 2) },
          ],
          note: "Use the shrinkage factor to calculate wet sizes: Wet Size = Desired Finished Size × Shrinkage Factor. Make test tiles with each new batch of clay.",
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "unit-converter", "area-converter"],
  faq: [
    {
      question: "How much does clay shrink when fired?",
      answer:
        "Total shrinkage (wet to fired) varies by clay body: earthenware shrinks 5-7%, mid-fire stoneware 10-13%, high-fire stoneware 12-15%, and porcelain 12-17%. Shrinkage occurs in two phases: drying (4-6%) and firing (3-12% depending on temperature).",
    },
    {
      question: "How do I test my clay's shrinkage rate?",
      answer:
        "Roll out a clay slab and cut a test bar exactly 10cm or 4 inches long. Mark the length clearly. Measure again when bone dry, and again after firing. Calculate: shrinkage % = (original - final) / original x 100. Make multiple test tiles for accuracy.",
    },
  ],
  formula:
    "Wet Size = Finished Size / (1 - Shrinkage% / 100) | Shrinkage % = (Wet Size - Fired Size) / Wet Size × 100",
};
