import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const germanyIncomeTaxCalculator: CalculatorDefinition = {
  slug: "germany-income-tax-calculator",
  title: "Germany Income Tax Calculator",
  description: "Free Germany income tax (Einkommensteuer) calculator for 2025. Includes Solidaritätszuschlag and church tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["germany income tax calculator", "germany einkommensteuer rechner", "germany tax calculator 2025"],
  variants: [{
    id: "standard",
    name: "Germany Income Tax",
    description: "Free Germany income tax (Einkommensteuer) calculator for 2025",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "€", min: 0 },
      { name: "churchTax", label: "Church Tax", type: "select", options: [{ label: "No church tax", value: "0" }, { label: "8% (Bavaria/Baden-Württemberg)", value: "8" }, { label: "9% (other states)", value: "9" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      const churchRate = parseFloat(inputs.churchTax as string) / 100;
      if (!income || income <= 0) return null;
      let tax = 0;
      if (income <= 12096) { tax = 0; }
      else if (income <= 17443) { const y = (income - 12096) / 10000; tax = (922.98 * y + 1400) * y; }
      else if (income <= 68480) { const z = (income - 17443) / 10000; tax = (181.19 * z + 2397) * z + 1025.38; }
      else if (income <= 277825) { tax = income * 0.42 - 10637.88; }
      else { tax = income * 0.45 - 18971.63; }
      tax = Math.max(0, Math.round(tax));
      const soli = tax > 19450 ? tax * 0.055 : 0;
      const church = tax * churchRate;
      const total = tax + soli + church;
      return {
        primary: { label: "Total Tax", value: "€" + formatNumber(total) },
        details: [
          { label: "Income tax", value: "€" + formatNumber(tax) },
          { label: "Solidarity surcharge (5.5%)", value: "€" + formatNumber(soli) },
          { label: "Church tax", value: "€" + formatNumber(church) },
          { label: "Effective rate", value: formatNumber((total / income) * 100) + "%" },
          { label: "Monthly after-tax", value: "€" + formatNumber((income - total) / 12) },
        ],
        note: "2025 brackets. Grundfreibetrag: €12,096. Soli exemption threshold: €19,450 tax liability. Formula-based progressive zones (not simple brackets).",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How does German income tax work?", answer: "Germany uses formula-based progressive zones: 0% up to €12,096, then smoothly rising from 14% to 42% (at €68,480), with a top rate of 45% above €277,825. Plus optional Solidarity surcharge (5.5%) and church tax (8-9%)." },
    { question: "What is Solidaritätszuschlag?", answer: "A 5.5% surcharge on income tax, but ~90% of taxpayers are fully exempt (threshold: €19,450 tax liability for singles). Above the threshold, a gliding zone applies." },
  ],
  formula: "German tax uses formula-based progressive zones, not flat brackets. Includes Soli (5.5%) and optional church tax (8/9%).",
};
