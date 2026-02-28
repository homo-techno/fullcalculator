import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const italyRegimeForfettarioCalculator: CalculatorDefinition = {
  slug: "italy-regime-forfettario-calculator",
  title: "Italy Regime Forfettario Calculator",
  description: "Free Italy flat-rate regime (regime forfettario) calculator. Calculate taxes for freelancers and sole proprietors under the simplified regime.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["italy regime forfettario calculator", "partita iva forfettario calculator", "flat tax italy freelancer"],
  variants: [{
    id: "standard",
    name: "Italy Regime Forfettario",
    description: "Free Italy flat-rate regime (regime forfettario) calculator",
    fields: [
      { name: "revenue", label: "Annual Revenue", type: "number", prefix: "€", min: 0 },
      { name: "activity", label: "Activity Coefficient", type: "select", options: [{ label: "Professional services - 78%", value: "78" }, { label: "Commerce - 40%", value: "40" }, { label: "Food/Hospitality - 40%", value: "40" }, { label: "Construction - 86%", value: "86" }, { label: "Intermediaries - 62%", value: "62" }, { label: "IT/Consulting - 67%", value: "67" }], defaultValue: "78" },
      { name: "startup", label: "Startup (first 5 years)?", type: "select", options: [{ label: "No - 15% rate", value: "no" }, { label: "Yes - 5% rate", value: "yes" }], defaultValue: "no" },
    ],
    calculate: (inputs) => {
      const revenue = inputs.revenue as number;
      const coeff = parseFloat(inputs.activity as string) / 100;
      const startup = inputs.startup as string;
      if (!revenue || revenue <= 0) return null;
      const taxable = revenue * coeff;
      const taxRate = startup === "yes" ? 0.05 : 0.15;
      const inps = taxable * 0.2607;
      const taxableAfterInps = taxable - inps;
      const tax = taxableAfterInps * taxRate;
      const net = revenue - inps - tax;
      return {
        primary: { label: "Net Income", value: "€" + formatNumber(net) },
        details: [
          { label: "Revenue", value: "€" + formatNumber(revenue) },
          { label: "Taxable base (coeff " + (coeff * 100) + "%)", value: "€" + formatNumber(taxable) },
          { label: "INPS contributions (26.07%)", value: "€" + formatNumber(inps) },
          { label: "Flat tax (" + (taxRate * 100) + "%)", value: "€" + formatNumber(tax) },
          { label: "Effective rate", value: formatNumber(((inps + tax) / revenue) * 100) + "%" },
        ],
        note: "Revenue ceiling: €85,000. Startup 5% rate for first 5 years if eligible. INPS Gestione Separata: 26.07%.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is regime forfettario?", answer: "A simplified flat-rate tax regime for freelancers/sole proprietors with revenue under €85K. Tax: 15% (or 5% for startups). No VAT charged, simplified accounting." },
    { question: "What is the profitability coefficient?", answer: "A fixed percentage applied to revenue to determine taxable income. Varies by activity type: 78% for professionals, 40% for commerce, 67% for IT consultants, etc." },
  ],
  formula: "Tax = Revenue × Profitability Coefficient × 15% (or 5% startup). INPS = Taxable × 26.07%",
};
