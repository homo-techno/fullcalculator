import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const netToGrossPayCalculator: CalculatorDefinition = {
  slug: "net-to-gross-pay-calculator",
  title: "Net to Gross Pay Calculator",
  description:
    "Free net-to-gross pay calculator. Reverse-calculate the gross salary needed to achieve a desired take-home pay after taxes and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "net to gross calculator",
    "reverse tax calculator",
    "gross pay from net",
    "salary reverse calculator",
    "take home to gross",
  ],
  variants: [
    {
      id: "standard",
      name: "Net to Gross Pay",
      description:
        "Calculate gross pay needed to achieve a target net pay",
      fields: [
        {
          name: "desiredNet",
          label: "Desired Net (Take-Home) Pay",
          type: "number",
          placeholder: "e.g. 4000",
          prefix: "$",
        },
        {
          name: "payFrequency",
          label: "Pay Frequency",
          type: "select",
          options: [
            { label: "Monthly", value: "12" },
            { label: "Bi-Weekly", value: "26" },
            { label: "Weekly", value: "52" },
            { label: "Annual", value: "1" },
          ],
          defaultValue: "12",
        },
        {
          name: "federalRate",
          label: "Effective Federal Tax Rate",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "%",
        },
        {
          name: "stateRate",
          label: "State Tax Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 0,
        },
        {
          name: "ficaRate",
          label: "FICA Rate (default 7.65%)",
          type: "number",
          placeholder: "e.g. 7.65",
          suffix: "%",
          defaultValue: 7.65,
        },
        {
          name: "otherDeductions",
          label: "Other Deductions Per Pay Period",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const desiredNet = parseFloat(inputs.desiredNet as string);
        const frequency = parseInt(inputs.payFrequency as string, 10);
        const fedRate = parseFloat(inputs.federalRate as string);
        const stateRate = parseFloat(inputs.stateRate as string) || 0;
        const ficaRate = parseFloat(inputs.ficaRate as string) || 7.65;
        const otherDeductions = parseFloat(inputs.otherDeductions as string) || 0;

        if (!desiredNet || desiredNet <= 0 || !fedRate) return null;

        const totalTaxRate = (fedRate + stateRate + ficaRate) / 100;
        if (totalTaxRate >= 1) return null;

        const grossPerPeriod = (desiredNet + otherDeductions) / (1 - totalTaxRate);
        const annualGross = grossPerPeriod * frequency;
        const annualNet = desiredNet * frequency;

        const totalTaxPerPeriod = grossPerPeriod * totalTaxRate;
        const federalTax = grossPerPeriod * (fedRate / 100);
        const stateTax = grossPerPeriod * (stateRate / 100);
        const ficaTax = grossPerPeriod * (ficaRate / 100);

        return {
          primary: { label: "Required Gross Pay", value: `$${formatNumber(grossPerPeriod)}` },
          details: [
            { label: "Desired net pay", value: `$${formatNumber(desiredNet)}` },
            { label: "Federal tax per period", value: `$${formatNumber(federalTax)}` },
            { label: "State tax per period", value: `$${formatNumber(stateTax)}` },
            { label: "FICA per period", value: `$${formatNumber(ficaTax)}` },
            { label: "Other deductions", value: `$${formatNumber(otherDeductions)}` },
            { label: "Annual gross salary", value: `$${formatNumber(annualGross)}` },
            { label: "Annual net income", value: `$${formatNumber(annualNet)}` },
          ],
          note: "This uses effective (average) tax rates for estimation. Actual withholding varies based on W-4 elections, pre-tax deductions, and marginal tax brackets.",
        };
      },
    },
  ],
  relatedSlugs: ["paycheck-calculator", "salary-calculator", "tax-calculator"],
  faq: [
    {
      question: "How do I calculate gross pay from net pay?",
      answer:
        "Gross Pay = (Net Pay + Other Deductions) / (1 - Total Tax Rate). The total tax rate includes federal, state, and FICA taxes. This gives you the pre-tax amount needed to achieve your desired take-home pay.",
    },
    {
      question: "Why is this calculation only an estimate?",
      answer:
        "Federal income tax uses progressive brackets, so the effective rate changes with income. This calculator uses a flat effective rate for simplicity. Pre-tax deductions (401k, HSA) also reduce taxable income, affecting the actual calculation.",
    },
    {
      question: "What is included in the FICA rate?",
      answer:
        "FICA is 7.65% for most employees: 6.2% for Social Security (up to the wage base) and 1.45% for Medicare. An additional 0.9% Medicare tax applies above $200,000. Self-employed individuals pay 15.3% (both halves).",
    },
  ],
  formula:
    "Gross Pay = (Desired Net Pay + Other Deductions) / (1 - Federal Rate - State Rate - FICA Rate)",
};
