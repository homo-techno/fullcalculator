import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const snowboardSizeCalculator: CalculatorDefinition = {
  slug: "snowboard-size-calculator",
  title: "Snowboard Size Calculator",
  description: "Free snowboard size calculator. Find the right snowboard length based on your height, weight, and riding style.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["snowboard size calculator", "snowboard length calculator", "what size snowboard do I need", "snowboard size chart", "snowboard sizing"],
  variants: [
    {
      id: "calc",
      name: "Calculate Snowboard Size",
      fields: [
        { name: "height", label: "Your Height", type: "number", placeholder: "e.g. 70", suffix: "in" },
        { name: "weight", label: "Your Weight", type: "number", placeholder: "e.g. 170", suffix: "lbs" },
        { name: "style", label: "Riding Style", type: "select", options: [
          { label: "Freestyle (park/tricks)", value: "freestyle" },
          { label: "All-Mountain", value: "all-mountain" },
          { label: "Freeride (powder/backcountry)", value: "freeride" },
        ], defaultValue: "all-mountain" },
      ],
      calculate: (inputs) => {
        const height = inputs.height as number;
        const weight = inputs.weight as number;
        const style = inputs.style as string;
        if (!height || !weight) return null;

        const heightCm = height * 2.54;
        const weightKg = weight * 0.4536;

        // Base board length from weight
        let baseLengthCm: number;
        if (weightKg < 50) baseLengthCm = 135;
        else if (weightKg < 55) baseLengthCm = 140;
        else if (weightKg < 60) baseLengthCm = 145;
        else if (weightKg < 68) baseLengthCm = 150;
        else if (weightKg < 75) baseLengthCm = 153;
        else if (weightKg < 82) baseLengthCm = 156;
        else if (weightKg < 91) baseLengthCm = 159;
        else if (weightKg < 100) baseLengthCm = 162;
        else baseLengthCm = 165;

        // Style adjustment
        let styleAdj = 0;
        let styleDesc: string;
        if (style === "freestyle") {
          styleAdj = -3;
          styleDesc = "Freestyle — shorter board for tricks and maneuverability (chin height)";
        } else if (style === "freeride") {
          styleAdj = 3;
          styleDesc = "Freeride — longer board for speed, float, and stability (nose height)";
        } else {
          styleAdj = 0;
          styleDesc = "All-Mountain — versatile length for mixed terrain";
        }

        const recommended = baseLengthCm + styleAdj;
        const rangeMin = recommended - 3;
        const rangeMax = recommended + 3;

        // Waist width recommendation based on boot size approximation from height
        const estBootSize = height < 66 ? "Narrow" : height > 72 ? "Wide" : "Regular";

        return {
          primary: { label: "Recommended Board Length", value: `${recommended} cm` },
          details: [
            { label: "Size Range", value: `${rangeMin}–${rangeMax} cm` },
            { label: "Riding Style", value: styleDesc },
            { label: "Board Width", value: `${estBootSize} (based on height)` },
            { label: "Your Height", value: `${height}" (${formatNumber(heightCm, 0)} cm)` },
            { label: "Your Weight", value: `${weight} lbs (${formatNumber(weightKg, 0)} kg)` },
            { label: "Style Adjustment", value: `${styleAdj >= 0 ? "+" : ""}${styleAdj} cm` },
          ],
          note: "Weight is the primary factor in snowboard sizing. Between sizes, go shorter for tricks or longer for speed. Ensure board width matches your boot size.",
        };
      },
    },
  ],
  relatedSlugs: ["ski-size-calculator", "bike-size-calculator", "helmet-size-calculator"],
  faq: [
    { question: "How do I choose snowboard length?", answer: "Weight is the most important factor. As a quick rule, the board should stand between your chin and nose. Freestyle riders go shorter (chin), all-mountain riders go mid-range, and freeride/powder riders go longer (nose or taller)." },
    { question: "Does riding style affect board size?", answer: "Yes. Freestyle boards are typically 2–4 cm shorter for easier spins and maneuverability. Freeride boards are 2–4 cm longer for better float in powder and high-speed stability." },
    { question: "What about board width?", answer: "If your boot size is US 11+ (men's), you likely need a wide board to prevent toe/heel drag. Check that your boots don't extend more than ~1cm past the board edges." },
  ],
  formula: "Base length from weight table ± style adjustment (freestyle −3cm, freeride +3cm)",
};
