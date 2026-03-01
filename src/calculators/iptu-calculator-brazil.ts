import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iptuCalculatorBrazilCalculator: CalculatorDefinition = {
  slug: "iptu-calculator-brazil",
  title: "IPTU Calculator Brazil",
  description: "Estimate the annual IPTU (Imposto Predial e Territorial Urbano) property tax for Brazilian properties.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["iptu calculator", "property tax brazil", "imposto predial calculator"],
  variants: [{
    id: "standard",
    name: "IPTU Brazil",
    description: "Estimate the annual IPTU (Imposto Predial e Territorial Urbano) property tax for Brazilian properties",
    fields: [
      { name: "venalValue", label: "Venal Value of Property", type: "number", prefix: "R$", min: 10000, max: 50000000, step: 10000, defaultValue: 500000 },
      { name: "propertyType", label: "Property Type", type: "select", options: [{value:"residential",label:"Residential"},{value:"commercial",label:"Commercial"},{value:"land",label:"Vacant Land"}], defaultValue: "residential" },
      { name: "city", label: "City", type: "select", options: [{value:"saopaulo",label:"Sao Paulo"},{value:"rio",label:"Rio de Janeiro"},{value:"other",label:"Other City"}], defaultValue: "saopaulo" },
    ],
    calculate: (inputs) => {
      const venal = inputs.venalValue as number;
      const type = inputs.propertyType as string;
      const city = inputs.city as string;
      if (!venal || venal <= 0) return null;
      const rates: Record<string, Record<string, number>> = {
        saopaulo: { residential: 1.0, commercial: 1.5, land: 1.5 },
        rio: { residential: 1.2, commercial: 2.0, land: 3.5 },
        other: { residential: 0.8, commercial: 1.2, land: 2.0 },
      };
      const cityRates = rates[city] || rates["other"];
      const rate = cityRates[type] || 1.0;
      const annualIPTU = venal * (rate / 100);
      const monthlyEquivalent = annualIPTU / 12;
      const discountCash = annualIPTU * 0.03;
      const cashPayment = annualIPTU - discountCash;
      return {
        primary: { label: "Annual IPTU", value: "R$ " + formatNumber(Math.round(annualIPTU)) },
        details: [
          { label: "Monthly Equivalent", value: "R$ " + formatNumber(Math.round(monthlyEquivalent)) },
          { label: "Cash Payment (3% discount)", value: "R$ " + formatNumber(Math.round(cashPayment)) },
          { label: "Effective Rate", value: formatNumber(rate) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["financiamento-imobiliario-calculator", "irpf-calculator-brazil"],
  faq: [
    { question: "How is IPTU calculated in Brazil?", answer: "IPTU is calculated by multiplying the venal value (valor venal) of the property by the municipal tax rate. Rates vary by city and property type, typically ranging from 0.5 percent to 3.5 percent." },
    { question: "Can IPTU be paid in installments?", answer: "Yes. Most municipalities offer the option to pay IPTU in monthly installments (usually 10 to 12) or in a single payment with a discount, typically around 3 to 5 percent for paying in full." },
  ],
  formula: "Annual IPTU = Venal Value x Tax Rate (varies by city and property type)",
};
