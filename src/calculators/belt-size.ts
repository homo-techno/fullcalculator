import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beltSizeCalculator: CalculatorDefinition = {
  slug: "belt-size-calculator",
  title: "Belt Size Calculator",
  description: "Free belt size calculator. Find your correct belt size from waist or pant size for men and women.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["belt size calculator", "belt size chart", "belt size from waist", "belt size from pant size", "how to measure belt size"],
  variants: [
    {
      id: "from-pants",
      name: "From Pant/Trouser Size",
      description: "Calculate belt size from your pants size",
      fields: [
        { name: "pantSize", label: "Pant/Trouser Waist Size", type: "number", placeholder: "e.g. 34", suffix: "in", step: 1 },
        { name: "gender", label: "Category", type: "select", options: [
          { label: "Men's belt", value: "mens" },
          { label: "Women's belt", value: "womens" },
        ], defaultValue: "mens" },
      ],
      calculate: (inputs) => {
        const pantSize = inputs.pantSize as number;
        const gender = inputs.gender as string;
        if (!pantSize) return null;

        // Belt size = pant size + 2 inches (standard rule)
        const beltSize = pantSize + 2;
        const beltSizeCm = beltSize * 2.54;

        // EU belt size (in cm)
        const euBeltSize = Math.round(beltSizeCm / 5) * 5; // round to nearest 5cm

        // Letter size
        let letterSize: string;
        if (gender === "mens") {
          if (beltSize <= 30) letterSize = "XS";
          else if (beltSize <= 32) letterSize = "S";
          else if (beltSize <= 34) letterSize = "M";
          else if (beltSize <= 38) letterSize = "L";
          else if (beltSize <= 42) letterSize = "XL";
          else if (beltSize <= 46) letterSize = "XXL";
          else letterSize = "3XL";
        } else {
          if (beltSize <= 28) letterSize = "XS";
          else if (beltSize <= 30) letterSize = "S";
          else if (beltSize <= 32) letterSize = "M";
          else if (beltSize <= 34) letterSize = "L";
          else if (beltSize <= 36) letterSize = "XL";
          else if (beltSize <= 40) letterSize = "XXL";
          else letterSize = "3XL";
        }

        return {
          primary: { label: "Belt Size", value: `${beltSize}` },
          details: [
            { label: "Letter Size", value: letterSize },
            { label: "EU Belt Size", value: `~${euBeltSize} cm` },
            { label: "Pant Size", value: `${pantSize}` },
            { label: "Belt Length", value: `${beltSize} inches (${formatNumber(beltSizeCm, 0)} cm)` },
          ],
          note: "Belt size = pant size + 2 inches. This measures to the middle hole. A properly sized belt should fasten at the center hole.",
        };
      },
    },
    {
      id: "from-measurement",
      name: "From Body Measurement",
      description: "Calculate belt size from measuring your body",
      fields: [
        { name: "measurement", label: "Body Measurement (where belt sits)", type: "number", placeholder: "e.g. 36", step: 0.5 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
        { name: "beltType", label: "Belt Type", type: "select", options: [
          { label: "Dress belt (at waist)", value: "dress" },
          { label: "Casual belt (at hips)", value: "casual" },
        ], defaultValue: "casual" },
      ],
      calculate: (inputs) => {
        let measurement = inputs.measurement as number;
        const unit = inputs.unit as string;
        const beltType = inputs.beltType as string;
        if (!measurement) return null;

        if (unit === "cm") measurement = measurement / 2.54;

        // For body measurement, belt size = measurement + 2 to 3 inches
        const beltSizeMin = Math.round(measurement + 2);
        const beltSizeRec = Math.round(measurement + 2);

        const tipNote = beltType === "dress"
          ? "Measure around your natural waist where you wear dress pants."
          : "Measure around your hips where you wear jeans/casual pants.";

        return {
          primary: { label: "Recommended Belt Size", value: `${beltSizeRec}` },
          details: [
            { label: "Body Measurement", value: `${formatNumber(measurement, 1)} in (${formatNumber(measurement * 2.54, 0)} cm)` },
            { label: "Belt Size Range", value: `${beltSizeMin} - ${beltSizeMin + 2}` },
            { label: "EU Size", value: `~${Math.round((beltSizeRec * 2.54) / 5) * 5} cm` },
            { label: "Measurement Tip", value: tipNote },
          ],
          note: "Measure where you actually wear the belt, not your bare waist. Wear the pants you'll most use with the belt when measuring.",
        };
      },
    },
  ],
  relatedSlugs: ["mens-suit-size-calculator", "dress-size-calculator", "body-measurement-calculator"],
  faq: [
    { question: "How do I determine my belt size?", answer: "The easiest method: your belt size is your pant waist size plus 2 inches. A size 34 pant takes a size 36 belt. Alternatively, measure around your body where you wear the belt and add 2 inches." },
    { question: "What does belt size actually measure?", answer: "Belt size is the distance from the buckle end to the middle hole (typically the third of five holes). This is why you add 2 inches to your waist/pant size — it accounts for the extra length to the center hole." },
    { question: "How should a belt fit?", answer: "A properly fitting belt should fasten at the center hole, leaving the tail to pass through the first belt loop. If you are using the first or last hole, the belt is the wrong size." },
    { question: "Are men's and women's belt sizes different?", answer: "The sizing principle is the same (pant size + 2), but women's belts tend to be narrower (0.75-1 inch vs 1.25-1.5 inches for men) and may sit at the natural waist rather than the hips." },
  ],
  formula: "Belt size = Pant size + 2 inches | Measures to the center (3rd) hole | EU belt size = Belt size × 2.54 cm",
};
