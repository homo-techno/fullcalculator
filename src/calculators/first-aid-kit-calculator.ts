import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const firstAidKitCalculator: CalculatorDefinition = {
  slug: "first-aid-kit-calculator",
  title: "First Aid Kit Calculator",
  description: "Determine first aid supplies needed for your group size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["first aid kit","first aid supplies calculator"],
  variants: [{
    id: "standard",
    name: "First Aid Kit",
    description: "Determine first aid supplies needed for your group size.",
    fields: [
      { name: "people", label: "Number of People", type: "number", min: 1, max: 200, defaultValue: 10 },
      { name: "kitType", label: "Kit Type", type: "select", options: [{ value: "1", label: "Basic Home" }, { value: "2", label: "Workplace" }, { value: "3", label: "Wilderness/Travel" }], defaultValue: "1" },
      { name: "duration", label: "Duration (days)", type: "number", min: 1, max: 365, defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const people = inputs.people as number;
      const kt = Number(inputs.kitType as number);
      const dur = inputs.duration as number;
      if (!people || !kt || !dur) return null;
      const multiplier = kt === 3 ? 2 : kt === 2 ? 1.5 : 1;
      const bandages = Math.ceil(people * 2 * multiplier);
      const gauze = Math.ceil(people * 1 * multiplier);
      const antiseptic = Math.ceil(people * 0.5 * multiplier);
      const gloves = Math.ceil(people * 2 * multiplier);
      return {
        primary: { label: "Bandages Needed", value: formatNumber(bandages) },
        details: [
          { label: "Gauze Pads", value: formatNumber(gauze) },
          { label: "Antiseptic Wipes", value: formatNumber(antiseptic) },
          { label: "Pairs of Gloves", value: formatNumber(gloves) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What should be in a basic first aid kit?", answer: "Include bandages, gauze, antiseptic, tape, scissors, and pain relievers at minimum." },
    { question: "How often should I replace first aid supplies?", answer: "Check expiration dates every 6 months and replace used or expired items." },
  ],
  formula: "Supplies = People x Base Quantity x Kit Multiplier",
};
