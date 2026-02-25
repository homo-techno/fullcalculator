import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deepFryerOilCalculator: CalculatorDefinition = {
  slug: "deep-fryer-oil-calculator",
  title: "Deep Fryer Oil Amount Calculator",
  description:
    "Free deep fryer oil calculator. Calculate how much oil you need for your deep fryer or pot based on size and food being fried.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "deep fryer oil",
    "frying oil amount",
    "how much oil",
    "deep fry calculator",
    "oil for frying",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "fryerType",
          label: "Fryer Type",
          type: "select",
          options: [
            { label: "Small Deep Fryer (1-2 qt)", value: "small" },
            { label: "Medium Deep Fryer (3-4 qt)", value: "medium" },
            { label: "Large Deep Fryer (5-6 qt)", value: "large" },
            { label: "Turkey Fryer (30+ qt)", value: "turkey" },
            { label: "Dutch Oven / Pot (custom)", value: "pot" },
          ],
        },
        {
          name: "potDiameter",
          label: "Pot Diameter (inches, for custom pot)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "oilType",
          label: "Oil Type",
          type: "select",
          options: [
            { label: "Peanut Oil", value: "peanut" },
            { label: "Vegetable Oil", value: "vegetable" },
            { label: "Canola Oil", value: "canola" },
            { label: "Sunflower Oil", value: "sunflower" },
            { label: "Avocado Oil", value: "avocado" },
          ],
        },
      ],
      calculate: (inputs) => {
        const fryerType = inputs.fryerType as string;
        const potDiameter = (inputs.potDiameter as number) || 0;
        const oilType = inputs.oilType as string;

        const fryerQuarts: Record<string, number> = {
          small: 1.5,
          medium: 3.5,
          large: 5.5,
          turkey: 35,
          pot: 0,
        };

        let quartsNeeded = fryerQuarts[fryerType] || 3.5;

        if (fryerType === "pot" && potDiameter > 0) {
          const radiusInches = potDiameter / 2;
          const depthInches = 4;
          const cubicInches = Math.PI * radiusInches * radiusInches * depthInches;
          quartsNeeded = cubicInches / 57.75;
        } else if (fryerType === "pot" && potDiameter <= 0) {
          return null;
        }

        const liters = quartsNeeded * 0.946;
        const gallons = quartsNeeded / 4;
        const cups = quartsNeeded * 4;
        const costPerGallon: Record<string, number> = {
          peanut: 12,
          vegetable: 5,
          canola: 6,
          sunflower: 8,
          avocado: 22,
        };
        const smokePoint: Record<string, number> = {
          peanut: 450,
          vegetable: 400,
          canola: 400,
          sunflower: 440,
          avocado: 520,
        };

        const cost = gallons * (costPerGallon[oilType] || 6);
        const smoke = smokePoint[oilType] || 400;
        const maxFryTemp = smoke - 50;

        return {
          primary: {
            label: "Oil Needed",
            value: formatNumber(quartsNeeded, 1) + " quarts",
          },
          details: [
            { label: "Liters", value: formatNumber(liters, 1) + " L" },
            { label: "Gallons", value: formatNumber(gallons, 1) + " gal" },
            { label: "Cups", value: formatNumber(cups, 0) + " cups" },
            { label: "Smoke Point", value: smoke + " °F" },
            { label: "Max Safe Fry Temp", value: maxFryTemp + " °F" },
            { label: "Estimated Oil Cost", value: "$" + formatNumber(cost, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cooking-temp-calculator", "cooking-calculator"],
  faq: [
    {
      question: "How much oil do I need for deep frying?",
      answer:
        "Fill your deep fryer or pot about two-thirds full with oil. A standard home deep fryer needs 3-4 quarts. Never fill more than two-thirds to allow room for food and prevent overflow.",
    },
    {
      question: "What is the best oil for deep frying?",
      answer:
        "Peanut oil (smoke point 450°F) is considered the best for deep frying due to its high smoke point and neutral flavor. Canola and vegetable oils are good budget alternatives.",
    },
  ],
  formula:
    "Oil volume for pot = π × r² × depth (4 inches) / 57.75 cubic inches per quart. Fill to two-thirds capacity. Standard fryer sizes: Small 1.5qt, Medium 3.5qt, Large 5.5qt, Turkey 35qt.",
};
