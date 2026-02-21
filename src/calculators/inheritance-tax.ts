import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inheritanceTaxCalculator: CalculatorDefinition = {
  slug: "inheritance-tax-calculator",
  title: "Inheritance Tax Calculator",
  description:
    "Free inheritance tax calculator. Estimate state inheritance tax based on inheritance amount and state. Understand the difference between federal estate tax and state inheritance tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "inheritance tax calculator",
    "estate tax calculator",
    "inheritance tax by state",
    "death tax calculator",
    "estate planning calculator",
  ],
  variants: [
    {
      id: "inheritance",
      name: "Inheritance Tax Estimate",
      description: "Estimate inheritance tax based on amount and state",
      fields: [
        {
          name: "inheritanceAmount",
          label: "Inheritance Amount",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "$",
          min: 0,
        },
        {
          name: "state",
          label: "State",
          type: "select",
          options: [
            { label: "Iowa", value: "iowa" },
            { label: "Kentucky", value: "kentucky" },
            { label: "Maryland", value: "maryland" },
            { label: "Nebraska", value: "nebraska" },
            { label: "New Jersey", value: "new_jersey" },
            { label: "Pennsylvania", value: "pennsylvania" },
            { label: "Other state (no inheritance tax)", value: "none" },
          ],
          defaultValue: "none",
        },
        {
          name: "relationship",
          label: "Relationship to Deceased",
          type: "select",
          options: [
            { label: "Spouse", value: "spouse" },
            { label: "Child / Grandchild", value: "lineal" },
            { label: "Sibling", value: "sibling" },
            { label: "Other relative / Non-relative", value: "other" },
          ],
          defaultValue: "lineal",
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.inheritanceAmount as number;
        const state = inputs.state as string;
        const relationship = inputs.relationship as string;
        if (!amount) return null;

        // Spouses are exempt in all inheritance tax states
        if (relationship === "spouse") {
          return {
            primary: { label: "State Inheritance Tax", value: "$0" },
            details: [
              { label: "Inheritance amount", value: `$${formatNumber(amount)}` },
              { label: "Exemption", value: "Spousal (100%)" },
              { label: "Net inheritance", value: `$${formatNumber(amount)}` },
            ],
            note: "Spouses are exempt from inheritance tax in all states. Additionally, the unlimited marital deduction exempts spousal transfers from federal estate tax.",
          };
        }

        // State inheritance tax rates (simplified)
        interface StateRules {
          exemption: Record<string, number>;
          rate: Record<string, number>;
        }

        const stateRules: Record<string, StateRules> = {
          iowa: {
            exemption: { lineal: Infinity, sibling: 25000, other: 25000 },
            rate: { lineal: 0, sibling: 0.06, other: 0.06 },
          },
          kentucky: {
            exemption: { lineal: Infinity, sibling: 1000, other: 500 },
            rate: { lineal: 0, sibling: 0.08, other: 0.12 },
          },
          maryland: {
            exemption: { lineal: Infinity, sibling: 1000, other: 1000 },
            rate: { lineal: 0, sibling: 0.10, other: 0.10 },
          },
          nebraska: {
            exemption: { lineal: 100000, sibling: 40000, other: 25000 },
            rate: { lineal: 0.01, sibling: 0.11, other: 0.15 },
          },
          new_jersey: {
            exemption: { lineal: Infinity, sibling: 25000, other: 0 },
            rate: { lineal: 0, sibling: 0.11, other: 0.15 },
          },
          pennsylvania: {
            exemption: { lineal: 0, sibling: 0, other: 0 },
            rate: { lineal: 0.045, sibling: 0.12, other: 0.15 },
          },
          none: {
            exemption: { lineal: Infinity, sibling: Infinity, other: Infinity },
            rate: { lineal: 0, sibling: 0, other: 0 },
          },
        };

        const rules = stateRules[state] || stateRules.none;
        const exemption = rules.exemption[relationship] || 0;
        const rate = rules.rate[relationship] || 0;

        const taxableAmount = Math.max(0, amount - exemption);
        const stateTax = taxableAmount * rate;
        const netInheritance = amount - stateTax;

        // Federal estate tax context (for estates over $13.61M in 2024)
        const federalExemption = 13610000;
        const federalApplies = amount > federalExemption;

        return {
          primary: {
            label: "State Inheritance Tax",
            value: `$${formatNumber(stateTax)}`,
          },
          details: [
            { label: "Inheritance amount", value: `$${formatNumber(amount)}` },
            { label: "State exemption", value: exemption === Infinity ? "Fully exempt" : `$${formatNumber(exemption)}` },
            { label: "Taxable amount", value: `$${formatNumber(taxableAmount)}` },
            { label: "State tax rate", value: `${formatNumber(rate * 100, 1)}%` },
            { label: "Net inheritance", value: `$${formatNumber(netInheritance)}` },
            { label: "Effective tax rate", value: `${formatNumber(amount > 0 ? (stateTax / amount) * 100 : 0, 2)}%` },
            { label: "Federal estate tax", value: federalApplies ? "May apply (estate > $13.61M)" : "Does not apply" },
          ],
          note: "Only 6 states have inheritance tax: Iowa, Kentucky, Maryland, Nebraska, New Jersey, and Pennsylvania. Inheritance tax is paid by the recipient. Federal estate tax (separate) is paid by the estate and applies to estates over $13.61M (2024).",
        };
      },
    },
  ],
  relatedSlugs: ["estate-tax-calculator", "tax-calculator", "net-worth-calculator"],
  faq: [
    {
      question: "What is the difference between inheritance tax and estate tax?",
      answer:
        "Estate tax is paid by the deceased person's estate before assets are distributed (federal exemption: $13.61M in 2024). Inheritance tax is paid by the person receiving the inheritance. Only 6 states levy inheritance tax. Maryland is the only state with both.",
    },
    {
      question: "Which states have an inheritance tax?",
      answer:
        "Six states have inheritance tax: Iowa, Kentucky, Maryland, Nebraska, New Jersey, and Pennsylvania. Rates and exemptions vary by state and your relationship to the deceased. Spouses are exempt in all states. Children are exempt in most states except Pennsylvania and Nebraska.",
    },
    {
      question: "Do I have to pay taxes on inherited money?",
      answer:
        "In most states, no. Only 6 states have inheritance tax. If you live in one of those states, the amount depends on your relationship to the deceased and the amount inherited. Inherited assets receive a stepped-up cost basis for capital gains purposes.",
    },
  ],
  formula:
    "Inheritance Tax = (Inheritance Amount - Exemption) × State Rate. Exemptions and rates vary by state and relationship to the deceased. Spouses are always exempt.",
};
