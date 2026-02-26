import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hamsterWheelCalculator: CalculatorDefinition = {
  slug: "hamster-wheel-calculator",
  title: "Hamster Exercise Wheel Size Calculator",
  description:
    "Free hamster wheel size calculator. Determine the correct exercise wheel diameter for your hamster or small pet based on species and body length.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "hamster wheel size",
    "hamster exercise wheel",
    "hamster wheel calculator",
    "small pet wheel size",
    "gerbil wheel size",
  ],
  variants: [
    {
      id: "by-species",
      name: "By Species",
      description: "Get recommended wheel size by pet species",
      fields: [
        {
          name: "species",
          label: "Pet Species",
          type: "select",
          options: [
            { label: "Dwarf Hamster (Roborovski)", value: "dwarf_robo" },
            { label: "Dwarf Hamster (Campbell/Winter White)", value: "dwarf_campbell" },
            { label: "Syrian Hamster", value: "syrian" },
            { label: "Chinese Hamster", value: "chinese" },
            { label: "Gerbil", value: "gerbil" },
            { label: "Mouse", value: "mouse" },
            { label: "Rat", value: "rat" },
          ],
          defaultValue: "syrian",
        },
      ],
      calculate: (inputs) => {
        const species = inputs.species as string;
        if (!species) return null;

        const wheelData: Record<string, { minDiameter: number; idealDiameter: number; bodyLength: string; note: string }> = {
          dwarf_robo: { minDiameter: 6.5, idealDiameter: 8, bodyLength: "2-2.5 inches", note: "Roborovskis are the smallest hamsters but still need adequate wheel space." },
          dwarf_campbell: { minDiameter: 8, idealDiameter: 10, bodyLength: "3-4 inches", note: "Campbell and Winter White hamsters need slightly larger wheels than Roborovskis." },
          syrian: { minDiameter: 10, idealDiameter: 12, bodyLength: "5-7 inches", note: "Syrian hamsters are the largest common hamster species. A 12-inch wheel is ideal." },
          chinese: { minDiameter: 8, idealDiameter: 10, bodyLength: "3-5 inches", note: "Chinese hamsters have long tails and benefit from a smooth-surface wheel." },
          gerbil: { minDiameter: 8, idealDiameter: 10, bodyLength: "4-5 inches", note: "Gerbils run fast and benefit from a sturdy, solid-surface wheel." },
          mouse: { minDiameter: 6.5, idealDiameter: 8, bodyLength: "3-4 inches", note: "Mice are very active and will use a wheel extensively." },
          rat: { minDiameter: 12, idealDiameter: 14, bodyLength: "8-11 inches", note: "Rats need large wheels. Anything under 12 inches can cause back problems." },
        };

        const data = wheelData[species];
        if (!data) return null;

        const speciesNames: Record<string, string> = {
          dwarf_robo: "Roborovski Dwarf Hamster",
          dwarf_campbell: "Campbell/Winter White Dwarf",
          syrian: "Syrian Hamster",
          chinese: "Chinese Hamster",
          gerbil: "Gerbil",
          mouse: "Mouse",
          rat: "Rat",
        };

        return {
          primary: { label: "Ideal Wheel Diameter", value: `${formatNumber(data.idealDiameter, 0)} inches` },
          details: [
            { label: "Minimum Diameter", value: `${formatNumber(data.minDiameter, 0)} inches` },
            { label: "Species", value: speciesNames[species] || species },
            { label: "Typical Body Length", value: data.bodyLength },
          ],
          note: data.note + " Always choose a solid-surface wheel (not wire mesh) to prevent foot injuries.",
        };
      },
    },
    {
      id: "by-body-length",
      name: "By Body Length",
      description: "Calculate wheel size from measured body length",
      fields: [
        {
          name: "bodyLength",
          label: "Body Length (nose to tail base)",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "inches",
          min: 1,
          max: 15,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const bodyLength = parseFloat(inputs.bodyLength as string);
        if (!bodyLength || bodyLength < 1) return null;

        // The wheel should be large enough that the hamster's back doesn't arch
        // Minimum diameter = body length x 2 (approx)
        const minDiameter = Math.ceil(bodyLength * 2);
        const idealDiameter = Math.ceil(bodyLength * 2.5);

        // Round to nearest common wheel size
        const commonSizes = [6.5, 8, 10, 12, 14, 16];
        const nearestIdeal = commonSizes.find(s => s >= idealDiameter) || commonSizes[commonSizes.length - 1];
        const nearestMin = commonSizes.find(s => s >= minDiameter) || commonSizes[commonSizes.length - 1];

        return {
          primary: { label: "Ideal Wheel Diameter", value: `${formatNumber(nearestIdeal, 1)} inches` },
          details: [
            { label: "Minimum Diameter", value: `${formatNumber(nearestMin, 1)} inches` },
            { label: "Body Length", value: `${formatNumber(bodyLength, 1)} inches` },
            { label: "Calculated Min", value: `${formatNumber(minDiameter, 0)} inches (2x body)` },
            { label: "Calculated Ideal", value: `${formatNumber(idealDiameter, 0)} inches (2.5x body)` },
          ],
          note: "If your pet's back arches while running, the wheel is too small. Upgrade to a larger size immediately to prevent spinal injuries.",
        };
      },
    },
  ],
  relatedSlugs: ["guinea-pig-food-calculator", "pet-age-comparison-calculator"],
  faq: [
    {
      question: "What happens if a hamster wheel is too small?",
      answer:
        "A wheel that is too small forces the hamster to arch its back unnaturally while running, which can cause permanent spinal damage, pain, and reluctance to exercise. Always err on the side of a larger wheel.",
    },
    {
      question: "Should I get a wire mesh or solid wheel?",
      answer:
        "Always choose a solid-surface wheel. Wire mesh or rungs can trap tiny feet and toes, causing injuries known as 'bumblefoot.' Solid plastic or metal wheels with a flat running surface are safest.",
    },
  ],
  formula:
    "Minimum Wheel Diameter ≈ Body Length x 2 | Ideal Wheel Diameter ≈ Body Length x 2.5",
};
