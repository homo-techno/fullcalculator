import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquariumCalculator: CalculatorDefinition = {
  slug: "aquarium-calculator",
  title: "Aquarium Calculator",
  description:
    "Free aquarium calculator. Calculate tank volume, water weight, and recommended fish capacity from tank dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "aquarium volume",
    "fish tank",
    "gallons calculator",
    "tank size",
    "fish capacity",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Tank Length (inches)",
          type: "number",
          placeholder: "e.g. 36",
        },
        {
          name: "width",
          label: "Tank Width (inches)",
          type: "number",
          placeholder: "e.g. 18",
        },
        {
          name: "height",
          label: "Tank Height (inches)",
          type: "number",
          placeholder: "e.g. 16",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        if (!length || !width || !height) return null;

        const cubicInches = length * width * height;
        const gallons = cubicInches / 231;
        const liters = gallons * 3.78541;
        const waterWeightLbs = gallons * 8.34;
        const fishInches = Math.floor(gallons);
        const heaterWatts = Math.ceil(gallons * 3);
        const filterGph = Math.ceil(gallons * 4);

        return {
          primary: {
            label: "Tank Volume",
            value: formatNumber(gallons, 1) + " gallons",
          },
          details: [
            { label: "Volume (liters)", value: formatNumber(liters, 1) + " L" },
            {
              label: "Water Weight",
              value: formatNumber(waterWeightLbs, 1) + " lbs",
            },
            {
              label: "Max Fish (1\" per gallon rule)",
              value: formatNumber(fishInches, 0) + " inches of fish",
            },
            {
              label: "Heater Size (est.)",
              value: formatNumber(heaterWatts, 0) + " watts",
            },
            {
              label: "Filter Flow Rate (min.)",
              value: formatNumber(filterGph, 0) + " GPH",
            },
            {
              label: "Substrate (1\" depth)",
              value: formatNumber((length * width) / 10, 1) + " lbs",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["terrarium-calculator", "pet-food-calculator"],
  faq: [
    {
      question: "How do I calculate aquarium volume in gallons?",
      answer:
        "Multiply length x width x height in inches, then divide by 231 to get gallons. For example, a 36\" x 18\" x 16\" tank is 10,368 cubic inches / 231 = approximately 44.9 gallons.",
    },
    {
      question: "What is the 1 inch per gallon rule?",
      answer:
        "The general rule of thumb is 1 inch of adult fish per gallon of water. However, this is a simplified guideline. Larger, messier fish need more space, and tall/thin fish need different calculations.",
    },
  ],
  formula:
    "Volume (gallons) = (Length x Width x Height in inches) / 231. Water weight = gallons x 8.34 lbs. Volume (liters) = gallons x 3.785. Heater: ~3 watts per gallon. Filter: 4x tank volume GPH.",
};
