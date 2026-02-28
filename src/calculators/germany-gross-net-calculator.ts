import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const germanyGrossNetCalculator: CalculatorDefinition = {
  slug: "germany-gross-net-calculator",
  title: "Germany Brutto-Netto Calculator",
  description: "Free Germany gross to net salary calculator (Brutto-Netto-Rechner). Calculate take-home pay with all social contributions and taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["germany brutto netto rechner", "germany salary calculator", "germany gross net calculator"],
  variants: [{
    id: "standard",
    name: "Germany Brutto-Netto",
    description: "Free Germany gross to net salary calculator (Brutto-Netto-Rechner)",
    fields: [
      { name: "gross", label: "Monthly Gross Salary (Brutto)", type: "number", prefix: "€", min: 0 },
      { name: "taxClass", label: "Tax Class (Steuerklasse)", type: "select", options: [{ label: "Class 1 (Single)", value: "1" }, { label: "Class 3 (Married, higher earner)", value: "3" }, { label: "Class 5 (Married, lower earner)", value: "5" }], defaultValue: "1" },
      { name: "churchTax", label: "Church Tax", type: "select", options: [{ label: "None", value: "0" }, { label: "8%", value: "8" }, { label: "9%", value: "9" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
      const gross = inputs.gross as number;
      const churchRate = parseFloat(inputs.churchTax as string) / 100;
      if (!gross || gross <= 0) return null;
      const pension = Math.min(gross, 8050) * 0.093;
      const health = Math.min(gross, 5512.50) * 0.0825;
      const care = Math.min(gross, 5512.50) * 0.023;
      const unemploy = Math.min(gross, 8050) * 0.013;
      const totalSocial = pension + health + care + unemploy;
      const annual = (gross - totalSocial) * 12;
      let tax = 0;
      if (annual <= 12096) tax = 0;
      else if (annual <= 17443) { const y = (annual - 12096) / 10000; tax = (922.98 * y + 1400) * y; }
      else if (annual <= 68480) { const z = (annual - 17443) / 10000; tax = (181.19 * z + 2397) * z + 1025.38; }
      else if (annual <= 277825) tax = annual * 0.42 - 10637.88;
      else tax = annual * 0.45 - 18971.63;
      tax = Math.max(0, Math.round(tax));
      const monthlyTax = tax / 12;
      const soli = tax > 19450 ? monthlyTax * 0.055 : 0;
      const church = monthlyTax * churchRate;
      const net = gross - totalSocial - monthlyTax - soli - church;
      return {
        primary: { label: "Monthly Net (Netto)", value: "€" + formatNumber(net) },
        details: [
          { label: "Pension insurance (9.3%)", value: "€" + formatNumber(pension) },
          { label: "Health insurance (~8.25%)", value: "€" + formatNumber(health) },
          { label: "Long-term care (2.3%)", value: "€" + formatNumber(care) },
          { label: "Unemployment (1.3%)", value: "€" + formatNumber(unemploy) },
          { label: "Income tax", value: "€" + formatNumber(monthlyTax) },
          { label: "Solidarity surcharge", value: "€" + formatNumber(soli) },
          { label: "Total deductions", value: "€" + formatNumber(gross - net) },
        ],
        note: "Approximation for Tax Class 1 (single). Actual amounts depend on exact health insurance rate and personal circumstances.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much is taken from my salary in Germany?", answer: "Approximately 40% for a typical single employee: ~20% social contributions (pension 9.3%, health ~8.25%, care 2.3%, unemployment 1.3%) plus ~20% income tax." },
    { question: "What are the social contribution ceilings in Germany?", answer: "In 2025: €8,050/month for pension and unemployment, €5,512.50/month for health and long-term care insurance." },
  ],
  formula: "Net = Gross - Social (~20%) - Income Tax (formula-based progressive) - Soli - Church Tax",
};
