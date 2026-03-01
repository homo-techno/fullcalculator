import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const museumVisitCalculator: CalculatorDefinition = {
  slug: "museum-visit-calculator",
  title: "Museum Visit Cost Calculator",
  description: "Estimate the total cost of a museum visit including admission, parking, and gift shop.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["museum visit cost", "museum trip budget", "museum admission price"],
  variants: [{
    id: "standard",
    name: "Museum Visit Cost",
    description: "Estimate the total cost of a museum visit including admission, parking, and gift shop",
    fields: [
      { name: "adults", label: "Number of Adults", type: "number", suffix: "adults", min: 0, max: 20, defaultValue: 2 },
      { name: "children", label: "Number of Children", type: "number", suffix: "children", min: 0, max: 20, defaultValue: 2 },
      { name: "admissionType", label: "Admission Type", type: "select", options: [{value:"general",label:"General Admission ($20)"},{value:"special",label:"Special Exhibit ($30)"},{value:"membership",label:"Annual Membership ($120)"}], defaultValue: "general" },
    ],
    calculate: (inputs) => {
      const adults = inputs.adults as number;
      const children = inputs.children as number;
      const admType = inputs.admissionType as string;
      const totalPeople = adults + children;
      if (totalPeople <= 0) return null;
      const adultPrices: Record<string, number> = { general: 20, special: 30, membership: 120 };
      const childPrices: Record<string, number> = { general: 12, special: 18, membership: 60 };
      const admissionCost = (adults * (adultPrices[admType] || 20)) + (children * (childPrices[admType] || 12));
      const parking = 15;
      const giftShop = totalPeople * 10;
      const total = admissionCost + parking + giftShop;
      return {
        primary: { label: "Total Museum Visit Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Admission", value: "$" + formatNumber(Math.round(admissionCost)) },
          { label: "Parking", value: "$" + formatNumber(parking) },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(total / totalPeople)) },
        ],
      };
    },
  }],
  relatedSlugs: ["zoo-visit-cost-calculator", "theme-park-budget-calculator"],
  faq: [
    { question: "How much does a museum visit cost?", answer: "Museum admission typically ranges from $15 to $30 for adults and $8 to $18 for children. Many museums offer free days or discounted hours throughout the month." },
    { question: "Are museum memberships worth it?", answer: "A membership usually pays for itself after 2 to 3 visits per year and often includes benefits like free parking, gift shop discounts, and guest passes." },
  ],
  formula: "Total = (Adult Admission + Child Admission) + Parking + Gift Shop",
};
