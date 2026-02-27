import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const businessInsuranceCostCalculator: CalculatorDefinition = {
  slug: "business-insurance-cost",
  title: "Business Insurance Premium Estimator",
  description:
    "Estimate your business insurance costs including general liability, professional liability, workers comp, and commercial property insurance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "business insurance",
    "general liability",
    "professional liability",
    "workers comp",
    "commercial insurance",
    "premium",
  ],
  variants: [
    {
      slug: "business-insurance-cost",
      title: "Business Insurance Cost Estimator",
      description:
        "Estimate total annual business insurance costs based on your business profile.",
      fields: [
        {
          name: "annualRevenue",
          label: "Annual Revenue ($)",
          type: "number",
          defaultValue: "500000",
        },
        {
          name: "numberOfEmployees",
          label: "Number of Employees",
          type: "number",
          defaultValue: "5",
        },
        {
          name: "industryRisk",
          label: "Industry Risk Level",
          type: "select",
          defaultValue: "medium",
          options: [
            { label: "Low (Office/Tech)", value: "low" },
            { label: "Medium (Retail/Services)", value: "medium" },
            { label: "High (Construction/Manufacturing)", value: "high" },
          ],
        },
        {
          name: "propertyValue",
          label: "Business Property/Equipment Value ($)",
          type: "number",
          defaultValue: "100000",
        },
        {
          name: "annualPayroll",
          label: "Annual Payroll ($)",
          type: "number",
          defaultValue: "200000",
        },
        {
          name: "needsProfessionalLiability",
          label: "Professional Liability Needed?",
          type: "select",
          defaultValue: "yes",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
      ],
      calculate(inputs) {
        const revenue = parseFloat(inputs.annualRevenue as string);
        const employees = parseFloat(inputs.numberOfEmployees as string);
        const risk = inputs.industryRisk as string;
        const propertyValue = parseFloat(inputs.propertyValue as string);
        const payroll = parseFloat(inputs.annualPayroll as string);
        const needsPL = inputs.needsProfessionalLiability as string;

        const riskMultiplier =
          risk === "low" ? 0.003 : risk === "medium" ? 0.005 : 0.009;

        const generalLiability = revenue * riskMultiplier;
        const glMin = 500;
        const glActual = Math.max(generalLiability, glMin);

        const wcRate = risk === "low" ? 0.01 : risk === "medium" ? 0.025 : 0.06;
        const workersComp = payroll * wcRate;

        const propertyInsurance = propertyValue * 0.015;

        const professionalLiability =
          needsPL === "yes" ? Math.max(revenue * 0.002, 500) : 0;

        const bopDiscount = 0.9;
        const bundledCost =
          (glActual + propertyInsurance) * bopDiscount + workersComp + professionalLiability;
        const unbundledCost =
          glActual + propertyInsurance + workersComp + professionalLiability;

        const monthlyCost = bundledCost / 12;
        const costPerEmployee = bundledCost / employees;
        const costAsPercentRevenue = (bundledCost / revenue) * 100;

        return {
          "General Liability": `$${formatNumber(glActual)}/yr`,
          "Workers Compensation": `$${formatNumber(workersComp)}/yr`,
          "Commercial Property": `$${formatNumber(propertyInsurance)}/yr`,
          "Professional Liability": `$${formatNumber(professionalLiability)}/yr`,
          "Unbundled Total": `$${formatNumber(unbundledCost)}/yr`,
          "BOP Bundle (10% savings)": `$${formatNumber(bundledCost)}/yr`,
          "Monthly Premium": `$${formatNumber(monthlyCost)}`,
          "Cost Per Employee": `$${formatNumber(costPerEmployee)}`,
          "% of Revenue": `${formatNumber(costAsPercentRevenue)}%`,
        };
      },
    },
  ],
  relatedSlugs: [
    "small-business-tax",
    "llc-vs-scorp",
    "food-truck-cost",
  ],
  faq: [
    {
      question: "What insurance does a small business need?",
      answer:
        "Most small businesses need general liability insurance at minimum. Depending on your industry, you may also need professional liability (E&O), workers compensation (required if you have employees), commercial property, commercial auto, and cyber liability insurance.",
    },
    {
      question: "What is a Business Owner's Policy (BOP)?",
      answer:
        "A BOP bundles general liability and commercial property insurance at a discount (typically 10-15% savings). Most insurers offer BOPs for small businesses with fewer than 100 employees and under $5 million in revenue.",
    },
  ],
  formula:
    "General Liability = Revenue x Risk Rate. Workers Comp = Payroll x WC Rate. Property Insurance = Property Value x 1.5%. BOP Bundle = (GL + Property) x 0.9 + Workers Comp + Professional Liability.",
};
