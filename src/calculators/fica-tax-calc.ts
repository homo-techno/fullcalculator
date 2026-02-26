import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ficaTaxCalculator: CalculatorDefinition = {
  slug: "fica-tax-calculator",
  title: "FICA Tax Calculator",
  description:
    "Free FICA tax calculator. Estimate your Social Security tax (6.2%), Medicare tax (1.45%), and additional Medicare tax (0.9%) for the current year.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "fica tax calculator",
    "social security tax",
    "medicare tax",
    "payroll tax calculator",
    "self-employment tax",
    "additional medicare tax",
  ],
  variants: [
    {
      id: "employee",
      name: "Employee FICA Tax",
      description:
        "Calculate employee-side FICA taxes (Social Security + Medicare)",
      fields: [
        {
          name: "grossWages",
          label: "Gross Wages",
          type: "number",
          placeholder: "e.g. 85000",
          prefix: "$",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Married Filing Separately", value: "separate" },
          ],
          defaultValue: "single",
        },
      ],
      calculate: (inputs) => {
        const wages = parseFloat(inputs.grossWages as string);
        const status = inputs.filingStatus as string;
        if (!wages || wages <= 0) return null;

        const ssWageBase = 168600;
        const ssRate = 0.062;
        const medicareRate = 0.0145;
        const additionalMedicareRate = 0.009;

        const additionalMedicareThreshold =
          status === "married" ? 250000 : status === "separate" ? 125000 : 200000;

        const ssTaxableWages = Math.min(wages, ssWageBase);
        const ssTax = ssTaxableWages * ssRate;

        const medicareTax = wages * medicareRate;

        const additionalMedicareWages = Math.max(
          0,
          wages - additionalMedicareThreshold
        );
        const additionalMedicareTax =
          additionalMedicareWages * additionalMedicareRate;

        const totalFica = ssTax + medicareTax + additionalMedicareTax;

        return {
          primary: { label: "Total FICA Tax", value: `$${formatNumber(totalFica)}` },
          details: [
            {
              label: "Social Security tax (6.2%)",
              value: `$${formatNumber(ssTax)}`,
            },
            {
              label: "Medicare tax (1.45%)",
              value: `$${formatNumber(medicareTax)}`,
            },
            {
              label: "Additional Medicare tax (0.9%)",
              value: `$${formatNumber(additionalMedicareTax)}`,
            },
            {
              label: "SS taxable wages",
              value: `$${formatNumber(ssTaxableWages)}`,
            },
            {
              label: "Effective FICA rate",
              value: `${formatNumber((totalFica / wages) * 100)}%`,
            },
          ],
          note: "Social Security tax applies up to the wage base of $168,600 (2024). Additional Medicare tax of 0.9% applies above the threshold for your filing status.",
        };
      },
    },
    {
      id: "self-employed",
      name: "Self-Employment FICA Tax",
      description:
        "Calculate self-employment tax (both employer and employee portions)",
      fields: [
        {
          name: "netEarnings",
          label: "Net Self-Employment Earnings",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Married Filing Separately", value: "separate" },
          ],
          defaultValue: "single",
        },
      ],
      calculate: (inputs) => {
        const net = parseFloat(inputs.netEarnings as string);
        const status = inputs.filingStatus as string;
        if (!net || net <= 0) return null;

        const taxableBase = net * 0.9235;
        const ssWageBase = 168600;
        const ssRate = 0.124;
        const medicareRate = 0.029;
        const additionalMedicareRate = 0.009;

        const additionalMedicareThreshold =
          status === "married" ? 250000 : status === "separate" ? 125000 : 200000;

        const ssTaxable = Math.min(taxableBase, ssWageBase);
        const ssTax = ssTaxable * ssRate;

        const medicareTax = taxableBase * medicareRate;

        const additionalMedicareWages = Math.max(
          0,
          taxableBase - additionalMedicareThreshold
        );
        const additionalMedicareTax =
          additionalMedicareWages * additionalMedicareRate;

        const totalSETax = ssTax + medicareTax + additionalMedicareTax;
        const deductibleHalf = totalSETax / 2;

        return {
          primary: {
            label: "Total Self-Employment Tax",
            value: `$${formatNumber(totalSETax)}`,
          },
          details: [
            {
              label: "Taxable base (92.35%)",
              value: `$${formatNumber(taxableBase)}`,
            },
            {
              label: "Social Security tax (12.4%)",
              value: `$${formatNumber(ssTax)}`,
            },
            {
              label: "Medicare tax (2.9%)",
              value: `$${formatNumber(medicareTax)}`,
            },
            {
              label: "Additional Medicare tax (0.9%)",
              value: `$${formatNumber(additionalMedicareTax)}`,
            },
            {
              label: "Deductible half of SE tax",
              value: `$${formatNumber(deductibleHalf)}`,
            },
          ],
          note: "Self-employed individuals pay both the employer and employee shares. 92.35% of net earnings is the taxable base. Half of SE tax is deductible.",
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "paycheck-calculator", "agi-calculator"],
  faq: [
    {
      question: "What is FICA tax and who pays it?",
      answer:
        "FICA stands for Federal Insurance Contributions Act. It funds Social Security and Medicare. Employees pay 7.65% (6.2% SS + 1.45% Medicare) and employers match it. Self-employed individuals pay both halves (15.3%).",
    },
    {
      question: "What is the additional Medicare tax?",
      answer:
        "An extra 0.9% Medicare tax applies to wages exceeding $200,000 (single), $250,000 (married filing jointly), or $125,000 (married filing separately). Only employees pay this—employers do not match it.",
    },
    {
      question: "What is the Social Security wage base for 2024?",
      answer:
        "The Social Security wage base for 2024 is $168,600. Only earnings up to this amount are subject to the 6.2% Social Security tax. All earnings are subject to Medicare tax with no cap.",
    },
  ],
  formula:
    "Employee FICA = (min(wages, $168,600) x 6.2%) + (wages x 1.45%) + (max(0, wages - threshold) x 0.9%)",
};
