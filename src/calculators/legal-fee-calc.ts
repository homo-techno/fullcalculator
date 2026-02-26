import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const legalFeeCalc: CalculatorDefinition = {
  slug: "legal-fee-calc",
  title: "Legal Fee Calculator",
  description: "Free online legal fee calculator. Compare hourly, flat fee, and contingency fee structures for legal representation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["legal fees", "attorney fees", "lawyer cost", "hourly rate", "contingency fee", "flat fee", "legal cost"],
  variants: [
    {
      id: "hourly",
      name: "Hourly Rate",
      fields: [
        {
          name: "hourlyRate",
          label: "Attorney Hourly Rate ($)",
          type: "number",
          placeholder: "e.g. 350",
          min: 0,
        },
        {
          name: "estimatedHours",
          label: "Estimated Hours",
          type: "number",
          placeholder: "e.g. 40",
          min: 0,
        },
        {
          name: "paralegalRate",
          label: "Paralegal Hourly Rate ($)",
          type: "number",
          placeholder: "e.g. 150",
          min: 0,
        },
        {
          name: "paralegalHours",
          label: "Paralegal Estimated Hours",
          type: "number",
          placeholder: "e.g. 20",
          min: 0,
        },
        {
          name: "retainerFee",
          label: "Retainer Fee ($)",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const hourlyRate = parseFloat(inputs.hourlyRate as string) || 0;
        const estimatedHours = parseFloat(inputs.estimatedHours as string) || 0;
        const paralegalRate = parseFloat(inputs.paralegalRate as string) || 0;
        const paralegalHours = parseFloat(inputs.paralegalHours as string) || 0;
        const retainerFee = parseFloat(inputs.retainerFee as string) || 0;

        const attorneyCost = hourlyRate * estimatedHours;
        const paralegalCost = paralegalRate * paralegalHours;
        const totalCost = attorneyCost + paralegalCost;
        const remainingAfterRetainer = totalCost - retainerFee;

        return {
          primary: { label: "Estimated Total Legal Fees", value: "$" + formatNumber(totalCost) },
          details: [
            { label: "Attorney Fees", value: "$" + formatNumber(attorneyCost) },
            { label: "Paralegal Fees", value: "$" + formatNumber(paralegalCost) },
            { label: "Retainer Applied", value: "-$" + formatNumber(retainerFee) },
            { label: "Remaining Balance", value: "$" + formatNumber(Math.max(0, remainingAfterRetainer)) },
          ],
        };
      },
    },
    {
      id: "contingency",
      name: "Contingency Fee",
      fields: [
        {
          name: "expectedSettlement",
          label: "Expected Settlement Amount ($)",
          type: "number",
          placeholder: "e.g. 100000",
          min: 0,
        },
        {
          name: "contingencyPercent",
          label: "Contingency Fee Percentage",
          type: "select",
          options: [
            { label: "25%", value: "25" },
            { label: "33% (Standard)", value: "33" },
            { label: "40% (If trial)", value: "40" },
            { label: "45%", value: "45" },
          ],
        },
        {
          name: "caseExpenses",
          label: "Estimated Case Expenses ($)",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const expectedSettlement = parseFloat(inputs.expectedSettlement as string) || 0;
        const contingencyPercent = parseFloat(inputs.contingencyPercent as string) || 33;
        const caseExpenses = parseFloat(inputs.caseExpenses as string) || 0;

        const attorneyFee = expectedSettlement * (contingencyPercent / 100);
        const yourShare = expectedSettlement - attorneyFee - caseExpenses;

        return {
          primary: { label: "Your Take-Home Amount", value: "$" + formatNumber(Math.max(0, yourShare)) },
          details: [
            { label: "Expected Settlement", value: "$" + formatNumber(expectedSettlement) },
            { label: "Attorney Fee (" + contingencyPercent + "%)", value: "-$" + formatNumber(attorneyFee) },
            { label: "Case Expenses", value: "-$" + formatNumber(caseExpenses) },
            { label: "Net to You", value: "$" + formatNumber(Math.max(0, yourShare)) },
          ],
        };
      },
    },
    {
      id: "flat-fee",
      name: "Flat Fee Comparison",
      fields: [
        {
          name: "flatFee",
          label: "Quoted Flat Fee ($)",
          type: "number",
          placeholder: "e.g. 3000",
          min: 0,
        },
        {
          name: "hourlyRate",
          label: "Alternative Hourly Rate ($)",
          type: "number",
          placeholder: "e.g. 300",
          min: 0,
        },
        {
          name: "estimatedHours",
          label: "Estimated Hours for Case",
          type: "number",
          placeholder: "e.g. 15",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const flatFee = parseFloat(inputs.flatFee as string) || 0;
        const hourlyRate = parseFloat(inputs.hourlyRate as string) || 0;
        const estimatedHours = parseFloat(inputs.estimatedHours as string) || 0;

        const hourlyCost = hourlyRate * estimatedHours;
        const savings = hourlyCost - flatFee;
        const breakEvenHours = hourlyRate > 0 ? flatFee / hourlyRate : 0;

        return {
          primary: { label: "Flat Fee Savings", value: "$" + formatNumber(savings) },
          details: [
            { label: "Flat Fee Cost", value: "$" + formatNumber(flatFee) },
            { label: "Hourly Cost Estimate", value: "$" + formatNumber(hourlyCost) },
            { label: "Break-Even Hours", value: formatNumber(breakEvenHours, 1) + " hrs" },
            { label: "Better Option", value: savings > 0 ? "Flat Fee" : "Hourly Rate" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bail-calculator", "personal-injury-settlement", "consulting-rate-calc"],
  faq: [
    {
      question: "What are the different legal fee structures?",
      answer: "The three main fee structures are: Hourly (pay per hour worked), Flat Fee (one price for the entire case), and Contingency (attorney takes a percentage of winnings, common in personal injury cases).",
    },
    {
      question: "What is a typical contingency fee?",
      answer: "A standard contingency fee is 33% (one-third) of the settlement. If the case goes to trial, it typically increases to 40%. Some attorneys charge 25% for cases that settle quickly.",
    },
    {
      question: "What is a retainer fee?",
      answer: "A retainer fee is an upfront payment that the attorney draws from as they work on your case. It is applied against hourly charges. If unused, the remainder is typically refunded.",
    },
  ],
  formula: "Hourly: Total = (Attorney Rate x Hours) + (Paralegal Rate x Hours)\nContingency: Your Take = Settlement - (Settlement x Fee%) - Expenses",
};
