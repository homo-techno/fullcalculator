import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const photographerPricingCalculator: CalculatorDefinition = {
  slug: "photographer-pricing-calculator",
  title: "Photographer Pricing Calculator",
  description: "Calculate photography session pricing including shooting time, editing, and deliverables.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["photographer pricing", "photography session cost", "photo shoot pricing"],
  variants: [{
    id: "standard",
    name: "Photographer Pricing",
    description: "Calculate photography session pricing including shooting time, editing, and deliverables",
    fields: [
      { name: "shootHours", label: "Shooting Hours", type: "number", suffix: "hours", min: 0.5, max: 12, step: 0.5, defaultValue: 2 },
      { name: "editingHours", label: "Editing Hours", type: "number", suffix: "hours", min: 1, max: 40, defaultValue: 4 },
      { name: "hourlyRate", label: "Hourly Rate", type: "number", prefix: "$", min: 50, max: 500, defaultValue: 150 },
      { name: "sessionType", label: "Session Type", type: "select", options: [{value:"portrait",label:"Portrait/Headshot"},{value:"event",label:"Event Coverage"},{value:"wedding",label:"Wedding"}], defaultValue: "portrait" },
    ],
    calculate: (inputs) => {
      const shoot = inputs.shootHours as number;
      const editing = inputs.editingHours as number;
      const rate = inputs.hourlyRate as number;
      const sType = inputs.sessionType as string;
      if (!shoot || !rate) return null;
      const totalHours = shoot + editing;
      const baseCost = totalHours * rate;
      const equipmentFee: Record<string, number> = { portrait: 50, event: 150, wedding: 300 };
      const travelFee = 50;
      const total = baseCost + (equipmentFee[sType] || 50) + travelFee;
      const perHourEffective = total / shoot;
      return {
        primary: { label: "Total Session Price", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Shooting + Editing", value: formatNumber(totalHours) + " hours at $" + formatNumber(rate) + "/hr" },
          { label: "Equipment and Travel", value: "$" + formatNumber((equipmentFee[sType] || 50) + travelFee) },
          { label: "Effective Rate per Shoot Hour", value: "$" + formatNumber(Math.round(perHourEffective)) + "/hr" },
        ],
      };
    },
  }],
  relatedSlugs: ["dj-pricing-calculator", "personal-trainer-rate-calculator"],
  faq: [
    { question: "How much does a photographer charge per hour?", answer: "Professional photographers typically charge $100 to $300 per hour. Wedding photographers often charge $2,000 to $5,000 for full-day coverage including editing." },
    { question: "What is included in a photography package?", answer: "Most packages include the shooting session, professional editing, a set number of digital images, and sometimes prints or an online gallery." },
  ],
  formula: "Total = (Shooting + Editing Hours) x Rate + Equipment Fee + Travel",
};
