import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carAccidentSettlementCalculator: CalculatorDefinition = {
  slug: "car-accident-settlement-calculator",
  title: "Car Accident Settlement Calculator",
  description: "Free car accident settlement estimator. Calculate potential compensation for vehicle damage, medical bills, and lost wages.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car accident settlement calculator", "car accident compensation calculator", "auto accident claim estimator"],
  variants: [{
    id: "standard",
    name: "Car Accident Settlement",
    description: "Free car accident settlement estimator",
    fields: [
      { name: "vehicleDamage", label: "Vehicle Damage", type: "number", prefix: "$", min: 0, defaultValue: 0 },
      { name: "medicalBills", label: "Medical Bills", type: "number", prefix: "$", min: 0 },
      { name: "lostWages", label: "Lost Wages", type: "number", prefix: "$", min: 0, defaultValue: 0 },
      { name: "severity", label: "Injury Severity", type: "select", options: [{ label: "Minor (1.5x multiplier)", value: "1.5" }, { label: "Moderate (3x multiplier)", value: "3" }, { label: "Severe (5x multiplier)", value: "5" }], defaultValue: "3" },
      { name: "fault", label: "Your Fault Percentage", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const vehicle = (inputs.vehicleDamage as number) || 0;
      const medical = inputs.medicalBills as number;
      const wages = (inputs.lostWages as number) || 0;
      const mult = parseFloat(inputs.severity as string);
      const fault = (inputs.fault as number) || 0;
      if (!medical || medical <= 0) return null;
      const specialDamages = vehicle + medical + wages;
      const painSuffering = medical * mult;
      const totalBefore = specialDamages + painSuffering;
      const reduction = totalBefore * (fault / 100);
      const estimated = totalBefore - reduction;
      return {
        primary: { label: "Estimated Settlement", value: "$" + formatNumber(estimated) },
        details: [
          { label: "Special damages", value: "$" + formatNumber(specialDamages) },
          { label: "Pain & suffering (" + mult + "x medical)", value: "$" + formatNumber(painSuffering) },
          { label: "Total before fault reduction", value: "$" + formatNumber(totalBefore) },
          { label: "Comparative fault reduction (" + fault + "%)", value: "-$" + formatNumber(reduction) },
        ],
        note: "This is a rough estimate only. Actual settlements vary widely. Consult a personal injury attorney for accurate case evaluation.",
      };
    },
  }],
  relatedSlugs: ["personal-injury-calculator", "workers-comp-calculator"],
  faq: [
    { question: "How are car accident settlements calculated?", answer: "Typically: economic damages (medical, wages, property) + pain/suffering multiplier (1.5-5x medical bills), reduced by your percentage of fault." },
    { question: "What is the pain and suffering multiplier?", answer: "Insurance adjusters multiply medical bills by 1.5 (minor) to 5 (severe/permanent) to estimate non-economic damages." },
  ],
  formula: "Settlement = (Medical + Wages + Property + Medical × Severity Multiplier) × (1 - Fault%)",
};
