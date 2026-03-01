import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const escapeRoomCostCalculator: CalculatorDefinition = {
  slug: "escape-room-cost-calculator",
  title: "Escape Room Cost Calculator",
  description: "Calculate the per person and total cost for an escape room outing with your group.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["escape room cost", "escape room pricing", "escape room group cost"],
  variants: [{
    id: "standard",
    name: "Escape Room Cost",
    description: "Calculate the per person and total cost for an escape room outing with your group",
    fields: [
      { name: "groupSize", label: "Group Size", type: "number", suffix: "people", min: 2, max: 12, defaultValue: 6 },
      { name: "pricePerPerson", label: "Price per Person", type: "number", prefix: "$", min: 15, max: 60, defaultValue: 30 },
      { name: "rooms", label: "Number of Rooms", type: "number", suffix: "rooms", min: 1, max: 4, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const group = inputs.groupSize as number;
      const price = inputs.pricePerPerson as number;
      const rooms = inputs.rooms as number;
      if (!group || !price || !rooms) return null;
      const baseCost = group * price * rooms;
      const tipAmount = baseCost * 0.15;
      const totalWithTip = baseCost + tipAmount;
      const perPersonTotal = totalWithTip / group;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(Math.round(totalWithTip * 100) / 100) },
        details: [
          { label: "Base Cost", value: "$" + formatNumber(Math.round(baseCost * 100) / 100) },
          { label: "Suggested Tip (15%)", value: "$" + formatNumber(Math.round(tipAmount * 100) / 100) },
          { label: "Per Person (with Tip)", value: "$" + formatNumber(Math.round(perPersonTotal * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["bowling-cost-calculator", "karaoke-cost-calculator"],
  faq: [
    { question: "How much does an escape room cost?", answer: "Escape rooms typically cost $25 to $40 per person per room. Group rates may be available for larger parties, and private bookings can cost more." },
    { question: "How many people should be in an escape room group?", answer: "Most escape rooms are designed for 4 to 8 players. A group of 4 to 6 is ideal for good communication and ensuring everyone stays engaged." },
  ],
  formula: "Total Cost = Group Size x Price per Person x Rooms + Tip",
};
