import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const franceAutoEntrepreneurCalculator: CalculatorDefinition = {
  slug: "france-auto-entrepreneur-calculator",
  title: "France Auto-Entrepreneur Calculator",
  description: "Free French auto-entrepreneur (micro-enterprise) calculator. Calculate social charges, income tax, and net revenue.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["france auto entrepreneur calculator", "micro entreprise calculator", "auto entrepreneur charges sociales"],
  variants: [{
    id: "standard",
    name: "France Auto-Entrepreneur",
    description: "Free French auto-entrepreneur (micro-enterprise) calculator",
    fields: [
      { name: "revenue", label: "Quarterly Revenue", type: "number", prefix: "€", min: 0 },
      { name: "activity", label: "Activity Type", type: "select", options: [{ label: "Services (BNC) - 21.1%", value: "bnc" }, { label: "Commercial (BIC vente) - 12.3%", value: "bic_vente" }, { label: "Craft/Commercial services (BIC) - 21.2%", value: "bic_service" }], defaultValue: "bnc" },
      { name: "versement", label: "Versement libératoire", type: "select", options: [{ label: "No", value: "no" }, { label: "Yes", value: "yes" }], defaultValue: "no" },
    ],
    calculate: (inputs) => {
      const rev = inputs.revenue as number;
      const act = inputs.activity as string;
      const vl = inputs.versement as string;
      if (!rev || rev <= 0) return null;
      const rates: Record<string, number> = { bnc: 0.211, bic_vente: 0.123, bic_service: 0.212 };
      const vlRates: Record<string, number> = { bnc: 0.022, bic_vente: 0.01, bic_service: 0.017 };
      const socialRate = rates[act] || 0.211;
      const social = rev * socialRate;
      const vlTax = vl === "yes" ? rev * (vlRates[act] || 0.022) : 0;
      const net = rev - social - vlTax;
      return {
        primary: { label: "Net Revenue", value: "€" + formatNumber(net) },
        details: [
          { label: "Gross revenue", value: "€" + formatNumber(rev) },
          { label: "Social charges (" + (socialRate * 100).toFixed(1) + "%)", value: "€" + formatNumber(social) },
          { label: "Versement libératoire", value: vl === "yes" ? "€" + formatNumber(vlTax) : "N/A" },
          { label: "Annual net (×4)", value: "€" + formatNumber(net * 4) },
          { label: "Monthly net", value: "€" + formatNumber(net * 4 / 12) },
        ],
        note: "2025 rates. Revenue ceilings: €188,700 (commercial), €77,700 (services). CFE (business tax) applies from 2nd year.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What are auto-entrepreneur social charges?", answer: "BNC services: 21.1%, Commercial sales (BIC): 12.3%, Craft/services (BIC): 21.2%. Paid quarterly or monthly on actual revenue." },
    { question: "What is versement libératoire?", answer: "Optional flat income tax payment of 1-2.2% on revenue instead of standard income tax. Available if prior-year income is below ~€28K (single)." },
  ],
  formula: "Net = Revenue - Social Charges (12.3-21.2%) - Optional Versement Libératoire (1-2.2%)",
};
