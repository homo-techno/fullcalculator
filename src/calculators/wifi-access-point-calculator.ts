import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wifiAccessPointCalculator: CalculatorDefinition = {
  slug: "wifi-access-point-calculator",
  title: "WiFi Access Point Calculator",
  description: "Estimate the number of access points for wireless coverage.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["wifi access point","wireless coverage calculator"],
  variants: [{
    id: "standard",
    name: "WiFi Access Point",
    description: "Estimate the number of access points for wireless coverage.",
    fields: [
      { name: "areaSqFt", label: "Total Area (sq ft)", type: "number", min: 100, max: 500000, defaultValue: 5000 },
      { name: "coveragePerAp", label: "Coverage Per AP (sq ft)", type: "number", min: 200, max: 5000, defaultValue: 1500 },
      { name: "users", label: "Expected Users", type: "number", min: 1, max: 1000, defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const area = inputs.areaSqFt as number;
      const covPerAp = inputs.coveragePerAp as number;
      const users = inputs.users as number;
      if (!area || !covPerAp || !users) return null;
      const apByCoverage = Math.ceil(area / covPerAp);
      const apByUsers = Math.ceil(users / 25);
      const recommended = Math.max(apByCoverage, apByUsers);
      const usersPerAp = Math.round(users / recommended);
      return {
        primary: { label: "Access Points Needed", value: String(recommended) },
        details: [
          { label: "APs by Coverage", value: String(apByCoverage) },
          { label: "APs by User Density", value: String(apByUsers) },
          { label: "Users Per AP", value: String(usersPerAp) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How many devices can one access point handle?", answer: "A typical enterprise AP supports 25 to 50 concurrent devices." },
    { question: "Do walls reduce WiFi coverage?", answer: "Yes. Concrete and brick walls can reduce range by 30% to 50%." },
  ],
  formula: "APs Needed = max(Area / Coverage Per AP, Users / 25)",
};
