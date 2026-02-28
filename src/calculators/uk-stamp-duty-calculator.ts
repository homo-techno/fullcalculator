import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ukStampDutyCalculator: CalculatorDefinition = {
  slug: "uk-stamp-duty-calculator",
  title: "UK Stamp Duty (SDLT) Calculator",
  description: "Free UK Stamp Duty Land Tax calculator 2025. Calculate SDLT on residential property purchases in England and Northern Ireland.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["uk stamp duty calculator", "sdlt calculator", "stamp duty calculator 2025"],
  variants: [{
    id: "standard",
    name: "UK Stamp Duty (SDLT)",
    description: "Free UK Stamp Duty Land Tax calculator 2025",
    fields: [
      { name: "price", label: "Property Price", type: "number", prefix: "£", min: 0 },
      { name: "ftb", label: "Buyer Type", type: "select", options: [{ label: "Standard purchase", value: "standard" }, { label: "First-time buyer", value: "ftb" }, { label: "Additional property", value: "additional" }], defaultValue: "standard" },
    ],
    calculate: (inputs) => {
      const price = inputs.price as number;
      const type = inputs.ftb as string;
      if (!price || price <= 0) return null;
      let bands;
      if (type === "ftb" && price <= 625000) {
        bands = [{l:425000,r:0},{l:625000,r:0.05}];
      } else if (type === "additional") {
        bands = [{l:250000,r:0.05},{l:925000,r:0.10},{l:1500000,r:0.15},{l:Infinity,r:0.17}];
      } else {
        bands = [{l:250000,r:0},{l:925000,r:0.05},{l:1500000,r:0.10},{l:Infinity,r:0.12}];
      }
      let tax = 0, rem = price, prev = 0;
      for (const s of bands) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Stamp Duty", value: "£" + formatNumber(tax) },
        details: [
          { label: "Property price", value: "£" + formatNumber(price) },
          { label: "Effective rate", value: formatNumber((tax / price) * 100) + "%" },
          { label: "Total cost", value: "£" + formatNumber(price + tax) },
        ],
        note: type === "ftb" ? "First-time buyer relief: 0% up to £425K, 5% on £425-625K. Not available above £625K." : type === "additional" ? "Additional property surcharge: +5% on all bands (from April 2025)." : "Standard residential SDLT rates from April 2025.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What are the SDLT rates for 2025?", answer: "Standard: 0% up to £250K, 5% (£250-925K), 10% (£925K-1.5M), 12% above £1.5M. First-time buyers: 0% up to £425K, 5% up to £625K." },
    { question: "Do first-time buyers pay stamp duty?", answer: "First-time buyers pay no SDLT on properties up to £425,000, and 5% on the portion between £425K-£625K. Relief is not available above £625K." },
  ],
  formula: "SDLT = Sum of (portion in each band × rate)",
};
