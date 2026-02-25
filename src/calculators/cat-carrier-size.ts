import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catCarrierSizeCalculator: CalculatorDefinition = {
  slug: "cat-carrier-size-calculator",
  title: "Cat Carrier Size Calculator",
  description:
    "Free cat carrier size calculator. Find the perfect carrier dimensions based on your cat's measurements for safe and comfortable travel.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cat carrier size",
    "cat carrier calculator",
    "pet carrier dimensions",
    "cat travel carrier",
    "airline cat carrier size",
  ],
  variants: [
    {
      id: "carrier-size",
      name: "Cat Carrier Size",
      description: "Calculate the ideal carrier size for your cat",
      fields: [
        {
          name: "catLength",
          label: "Cat Body Length (nose to tail base)",
          type: "number",
          placeholder: "e.g. 18",
          suffix: "inches",
          min: 8,
          max: 30,
        },
        {
          name: "catHeight",
          label: "Cat Height (floor to top of head standing)",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "inches",
          min: 6,
          max: 20,
        },
        {
          name: "catWeight",
          label: "Cat Weight",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "lbs",
          min: 3,
          max: 30,
        },
        {
          name: "travelType",
          label: "Travel Type",
          type: "select",
          options: [
            { label: "Car Travel", value: "car" },
            { label: "Airline (cabin)", value: "airline_cabin" },
            { label: "Airline (cargo)", value: "airline_cargo" },
            { label: "Vet Visit (short trip)", value: "vet" },
          ],
          defaultValue: "car",
        },
      ],
      calculate: (inputs) => {
        const catLength = inputs.catLength as number;
        const catHeight = inputs.catHeight as number;
        const catWeight = inputs.catWeight as number;
        const travelType = inputs.travelType as string;
        if (!catLength || !catHeight || !catWeight) return null;

        // Carrier should allow cat to stand, turn around, and lie down
        const minLength = Math.round(catLength * 1.5);
        const minWidth = Math.round(catLength * 0.7);
        const minHeight = Math.round(catHeight + 3);

        let note = "";
        let airlineCompliant = "N/A";
        if (travelType === "airline_cabin") {
          const maxL = 18;
          const maxW = 11;
          const maxH = 11;
          airlineCompliant =
            minLength <= maxL && minWidth <= maxW && minHeight <= maxH ? "Yes" : "No - cat may be too large for cabin";
          note = "Typical airline cabin max: 18 x 11 x 11 inches. Check your specific airline.";
        } else if (travelType === "airline_cargo") {
          airlineCompliant = "Check airline IATA requirements";
          note = "Cargo carriers must meet IATA Live Animals Regulations.";
        }

        const carrierType =
          catWeight > 15 ? "Hard-sided recommended" : catWeight > 10 ? "Hard or soft-sided" : "Soft or hard-sided";

        return {
          primary: {
            label: "Minimum Carrier Size",
            value: `${minLength} x ${minWidth} x ${minHeight} inches`,
          },
          details: [
            { label: "Minimum Length", value: `${minLength} inches` },
            { label: "Minimum Width", value: `${minWidth} inches` },
            { label: "Minimum Height", value: `${minHeight} inches` },
            { label: "Carrier Type", value: carrierType },
            { label: "Airline Compliant", value: airlineCompliant },
          ],
          note: note || undefined,
        };
      },
    },
  ],
  relatedSlugs: ["cat-litter-box-calculator", "cat-indoor-space-calculator"],
  faq: [
    {
      question: "How do I measure my cat for a carrier?",
      answer:
        "Measure your cat's body length from nose to the base of the tail (not including the tail). Measure height from the floor to the top of the head while standing. The carrier should be large enough for your cat to stand up, turn around, and lie down comfortably.",
    },
    {
      question: "What size carrier do I need for airline travel?",
      answer:
        "Most airlines require in-cabin carriers to fit under the seat, typically no larger than 18 x 11 x 11 inches. However, dimensions vary by airline, so always check with your specific carrier before booking.",
    },
    {
      question: "Should I get a hard or soft carrier?",
      answer:
        "Hard carriers are more durable and easier to clean, making them ideal for larger cats or frequent travel. Soft carriers are lighter and more flexible, good for smaller cats and short trips. For airline cabin travel, soft carriers that can flex to fit under the seat are often preferred.",
    },
  ],
  formula:
    "Min Length = Cat Length x 1.5 | Min Width = Cat Length x 0.7 | Min Height = Cat Standing Height + 3 inches",
};
