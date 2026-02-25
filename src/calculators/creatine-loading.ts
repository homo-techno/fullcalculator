import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const creatineLoadingCalculator: CalculatorDefinition = {
  slug: "creatine-loading-calculator",
  title: "Creatine Loading Calculator",
  description: "Free creatine loading and maintenance dosage calculator. Calculate your optimal creatine monohydrate dose based on body weight and phase.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["creatine loading", "creatine dosage", "creatine calculator", "creatine monohydrate", "creatine maintenance", "supplement dosage"],
  variants: [
    {
      id: "loading-phase",
      name: "Loading + Maintenance Protocol",
      description: "Standard creatine loading phase followed by maintenance dosing",
      fields: [
        { name: "weight", label: "Body Weight", type: "number", placeholder: "e.g. 80" },
        { name: "unit", label: "Weight Unit", type: "select", options: [
          { label: "kg", value: "kg" }, { label: "lbs", value: "lbs" },
        ], defaultValue: "kg" },
        { name: "protocol", label: "Protocol", type: "select", options: [
          { label: "Standard Loading (5-7 days)", value: "standard" },
          { label: "Gradual Loading (no loading phase)", value: "gradual" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        let weight = inputs.weight as number;
        const unit = inputs.unit as string;
        const protocol = inputs.protocol as string;
        if (!weight) return null;
        const weightKg = unit === "lbs" ? weight * 0.4536 : weight;
        if (protocol === "standard") {
          const loadingDose = weightKg * 0.3;
          const loadingPerServing = loadingDose / 4;
          const maintenanceDose = weightKg * 0.03;
          const maintenanceClamped = Math.max(3, Math.min(5, maintenanceDose));
          return {
            primary: { label: "Loading Dose", value: `${formatNumber(loadingDose, 1)} g/day` },
            details: [
              { label: "Loading Phase Duration", value: "5-7 days" },
              { label: "Loading Per Serving (4x/day)", value: `${formatNumber(loadingPerServing, 1)} g` },
              { label: "Maintenance Dose", value: `${formatNumber(maintenanceClamped, 1)} g/day` },
              { label: "Maintenance Phase", value: "Ongoing (after loading)" },
              { label: "Total Loading Phase Creatine", value: `${formatNumber(loadingDose * 7, 0)} g (7 days)` },
              { label: "Monthly Maintenance Cost", value: `${formatNumber(maintenanceClamped * 30, 0)} g/month` },
            ],
            note: "Take loading doses split into 4 servings throughout the day with water. Drink at least 3-4 liters of water daily during loading.",
          };
        } else {
          const dailyDose = Math.max(3, Math.min(5, weightKg * 0.03));
          const saturationDays = Math.round(28);
          return {
            primary: { label: "Daily Dose", value: `${formatNumber(dailyDose, 1)} g/day` },
            details: [
              { label: "Protocol", value: "No loading phase" },
              { label: "Time to Saturation", value: `~${saturationDays} days` },
              { label: "Monthly Creatine", value: `${formatNumber(dailyDose * 30, 0)} g/month` },
            ],
            note: "The gradual approach avoids the loading phase bloating but takes 3-4 weeks to fully saturate muscle creatine stores.",
          };
        }
      },
    },
    {
      id: "cycling",
      name: "Creatine Cycling Schedule",
      description: "Calculate creatine cycling with on and off periods",
      fields: [
        { name: "weight", label: "Body Weight", type: "number", placeholder: "e.g. 80" },
        { name: "unit", label: "Weight Unit", type: "select", options: [
          { label: "kg", value: "kg" }, { label: "lbs", value: "lbs" },
        ], defaultValue: "kg" },
        { name: "cycleWeeks", label: "On-Cycle Duration", type: "select", options: [
          { label: "8 weeks", value: "8" },
          { label: "10 weeks", value: "10" },
          { label: "12 weeks", value: "12" },
        ], defaultValue: "8" },
      ],
      calculate: (inputs) => {
        let weight = inputs.weight as number;
        const unit = inputs.unit as string;
        const cycleWeeks = parseInt(inputs.cycleWeeks as string);
        if (!weight) return null;
        const weightKg = unit === "lbs" ? weight * 0.4536 : weight;
        const loadingDose = weightKg * 0.3;
        const maintenanceDose = Math.max(3, Math.min(5, weightKg * 0.03));
        const loadingTotal = loadingDose * 7;
        const maintenanceTotal = maintenanceDose * (cycleWeeks * 7 - 7);
        const totalCycle = loadingTotal + maintenanceTotal;
        return {
          primary: { label: "Total Per Cycle", value: `${formatNumber(totalCycle, 0)} g` },
          details: [
            { label: "On-Cycle", value: `${cycleWeeks} weeks` },
            { label: "Off-Cycle", value: "4 weeks recommended" },
            { label: "Loading Phase (week 1)", value: `${formatNumber(loadingDose, 1)} g/day` },
            { label: "Maintenance Phase", value: `${formatNumber(maintenanceDose, 1)} g/day` },
            { label: "Total Loading Creatine", value: `${formatNumber(loadingTotal, 0)} g` },
            { label: "Total Maintenance Creatine", value: `${formatNumber(maintenanceTotal, 0)} g` },
          ],
          note: "Cycling is optional. Current research suggests continuous use of creatine at maintenance doses is safe long-term. Cycling is a personal preference.",
        };
      },
    },
  ],
  relatedSlugs: ["protein-intake-calculator", "water-intake-fitness-calculator", "calorie-calculator"],
  faq: [
    { question: "Do you need a creatine loading phase?", answer: "No, but it speeds up saturation. Loading (20-25g/day for 5-7 days) saturates muscles in about a week. Without loading (3-5g/day), it takes about 28 days. Both achieve the same endpoint." },
    { question: "How much creatine should I take?", answer: "Loading: 0.3g/kg/day (typically 20-25g) split into 4 doses for 5-7 days. Maintenance: 3-5g/day (0.03g/kg). Creatine monohydrate is the most researched and effective form." },
  ],
  formula: "Loading: 0.3g per kg bodyweight per day for 5-7 days | Maintenance: 0.03g per kg bodyweight per day (3-5g)",
};
