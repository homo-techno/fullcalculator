import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const simplesNacionalCalculator: CalculatorDefinition = {
  slug: "simples-nacional-calculator",
  title: "Simples Nacional Calculator",
  description: "Calculate taxes under the Simples Nacional simplified tax regime for small businesses in Brazil.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["simples nacional", "simples tax calculator", "small business tax brazil"],
  variants: [{
    id: "standard",
    name: "Simples Nacional",
    description: "Calculate taxes under the Simples Nacional simplified tax regime for small businesses in Brazil",
    fields: [
      { name: "monthlyRevenue", label: "Monthly Revenue", type: "number", prefix: "R$", min: 1000, max: 500000, step: 1000, defaultValue: 30000 },
      { name: "annualRevenue", label: "Annual Revenue (last 12 months)", type: "number", prefix: "R$", min: 10000, max: 4800000, step: 10000, defaultValue: 360000 },
      { name: "activity", label: "Business Activity", type: "select", options: [{value:"commerce",label:"Commerce (Anexo I)"},{value:"industry",label:"Industry (Anexo II)"},{value:"services",label:"Services (Anexo III)"},{value:"services2",label:"Services (Anexo V)"}], defaultValue: "services" },
    ],
    calculate: (inputs) => {
      const monthly = inputs.monthlyRevenue as number;
      const annual = inputs.annualRevenue as number;
      const activity = inputs.activity as string;
      if (!monthly || !annual || monthly <= 0) return null;
      const rates: Record<string, {rate: number, deduction: number}[]> = {
        commerce: [{rate:4.0,deduction:0},{rate:7.3,deduction:5940},{rate:9.5,deduction:13860},{rate:10.7,deduction:22500}],
        industry: [{rate:4.5,deduction:0},{rate:7.8,deduction:5940},{rate:10.0,deduction:13860},{rate:11.2,deduction:22500}],
        services: [{rate:6.0,deduction:0},{rate:11.2,deduction:9360},{rate:13.5,deduction:17640},{rate:16.0,deduction:35640}],
        services2: [{rate:15.5,deduction:0},{rate:18.0,deduction:4500},{rate:19.5,deduction:9900},{rate:20.5,deduction:17100}],
      };
      const brackets = rates[activity] || rates["services"];
      let bracket;
      if (annual <= 180000) bracket = brackets[0];
      else if (annual <= 360000) bracket = brackets[1];
      else if (annual <= 720000) bracket = brackets[2];
      else bracket = brackets[3];
      const effectiveRate = (annual * bracket.rate / 100 - bracket.deduction) / annual * 100;
      const monthlyTax = monthly * (effectiveRate / 100);
      const annualTax = monthlyTax * 12;
      return {
        primary: { label: "Monthly Tax (Simples)", value: "R$ " + formatNumber(Math.round(monthlyTax)) },
        details: [
          { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 100) / 100) + "%" },
          { label: "Nominal Rate", value: formatNumber(bracket.rate) + "%" },
          { label: "Estimated Annual Tax", value: "R$ " + formatNumber(Math.round(annualTax)) },
        ],
      };
    },
  }],
  relatedSlugs: ["irpf-calculator-brazil", "clt-vs-pj-calculator-brazil"],
  faq: [
    { question: "What is Simples Nacional?", answer: "Simples Nacional is a simplified tax regime for small businesses in Brazil with annual revenue up to R$ 4.8 million. It consolidates multiple federal, state, and municipal taxes into a single monthly payment." },
    { question: "What are the Simples Nacional annexes?", answer: "Simples Nacional has five annexes (I through V) that define tax rates based on business activity. Commerce falls under Anexo I, industry under Anexo II, and services under Anexos III, IV, or V depending on the type of service." },
  ],
  formula: "Effective Rate = (Annual Revenue x Nominal Rate - Deduction) / Annual Revenue; Monthly Tax = Monthly Revenue x Effective Rate",
};
