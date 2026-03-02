import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const laserHairRemovalCalculator: CalculatorDefinition = {
  slug: "laser-hair-removal-calculator",
  title: "Laser Hair Removal Calculator",
  description: "Estimate laser hair removal sessions and total cost.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["laser hair removal cost","laser hair removal sessions","permanent hair removal cost"],
  variants: [{
    id: "standard",
    name: "Laser Hair Removal",
    description: "Estimate laser hair removal sessions and total cost.",
    fields: [
      { name: "bodyArea", label: "Body Area", type: "select", options: [{ value: "75", label: "Upper Lip" }, { value: "100", label: "Underarms" }, { value: "150", label: "Bikini" }, { value: "250", label: "Half Legs" }, { value: "400", label: "Full Legs" }, { value: "300", label: "Full Back" }] },
      { name: "sessions", label: "Sessions Needed", type: "number", min: 4, max: 12, defaultValue: 6 },
      { name: "packageDiscount", label: "Package Discount (%)", type: "number", min: 0, max: 30, defaultValue: 15 },
      { name: "maintenanceSessions", label: "Annual Maintenance Sessions", type: "number", min: 0, max: 4, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const bodyArea = parseInt(inputs.bodyArea as string);
    const sessions = inputs.sessions as number;
    const packageDiscount = inputs.packageDiscount as number;
    const maintenanceSessions = inputs.maintenanceSessions as number;
    const fullPrice = bodyArea * sessions;
    const discount = fullPrice * (packageDiscount / 100);
    const packagePrice = fullPrice - discount;
    const maintenanceCost = bodyArea * maintenanceSessions;
    const firstYearTotal = packagePrice + maintenanceCost;
    return {
      primary: { label: "Treatment Package Cost", value: "$" + formatNumber(packagePrice) },
      details: [
        { label: "Per Session (Full Price)", value: "$" + formatNumber(bodyArea) },
        { label: "Package Savings", value: "$" + formatNumber(discount) },
        { label: "Annual Maintenance", value: "$" + formatNumber(maintenanceCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["waxing-cost-calculator","chemical-peel-cost-calculator"],
  faq: [
    { question: "How many laser hair removal sessions are needed?", answer: "Most areas need 6 to 8 sessions spaced 4 to 8 weeks apart." },
    { question: "Is laser hair removal permanent?", answer: "It provides permanent reduction. Some maintenance sessions may be needed." },
    { question: "Does skin tone affect laser hair removal?", answer: "Modern lasers work on most skin tones but results vary by hair color." },
  ],
  formula: "Package Cost = (Area Price x Sessions) x (1 - Discount%)",
};
