import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tdsCalculator: CalculatorDefinition = {
  slug: "tds-calculator",
  title: "TDS Calculator",
  description:
    "Free TDS calculator. Calculate Tax Deducted at Source on salary, interest, rent, and professional fees. Check TDS rates and deduction amounts.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "TDS calculator",
    "tax deducted at source",
    "TDS on salary",
    "TDS on rent",
    "TDS on interest",
    "TDS rate calculator",
  ],
  variants: [
    {
      id: "salary",
      name: "TDS on Salary",
      description: "Calculate TDS deducted from salary by employer",
      fields: [
        {
          name: "annualSalary",
          label: "Annual Gross Salary",
          type: "number",
          placeholder: "e.g. 1200000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "deductions",
          label: "Total Deductions (80C, 80D, HRA, etc.)",
          type: "number",
          placeholder: "e.g. 250000",
          prefix: "₹",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "regime",
          label: "Tax Regime",
          type: "select",
          options: [
            { label: "New Regime (Default from FY 2023-24)", value: "new" },
            { label: "Old Regime", value: "old" },
          ],
          defaultValue: "new",
        },
      ],
      calculate: (inputs) => {
        const annualSalary = inputs.annualSalary as number;
        const deductions = (inputs.deductions as number) || 0;
        const regime = inputs.regime as string;
        if (!annualSalary) return null;

        let standardDeduction = regime === "new" ? 75000 : 50000;
        let taxableIncome = regime === "old"
          ? Math.max(0, annualSalary - standardDeduction - deductions)
          : Math.max(0, annualSalary - standardDeduction);

        let tax = 0;
        if (regime === "new") {
          if (taxableIncome > 1500000) tax = 20000 + 30000 + 30000 + 60000 + (taxableIncome - 1500000) * 0.30;
          else if (taxableIncome > 1200000) tax = 20000 + 30000 + 30000 + (taxableIncome - 1200000) * 0.20;
          else if (taxableIncome > 1000000) tax = 20000 + 30000 + (taxableIncome - 1000000) * 0.15;
          else if (taxableIncome > 700000) tax = 20000 + (taxableIncome - 700000) * 0.10;
          else if (taxableIncome > 300000) tax = (taxableIncome - 300000) * 0.05;
          if (taxableIncome <= 700000) tax = 0; // 87A rebate
        } else {
          if (taxableIncome > 1000000) tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.30;
          else if (taxableIncome > 500000) tax = 12500 + (taxableIncome - 500000) * 0.20;
          else if (taxableIncome > 250000) tax = (taxableIncome - 250000) * 0.05;
          if (taxableIncome <= 500000) tax = 0; // 87A rebate
        }

        const cess = tax * 0.04;
        const annualTDS = tax + cess;
        const monthlyTDS = annualTDS / 12;

        return {
          primary: { label: "Monthly TDS Deduction", value: `₹${formatNumber(monthlyTDS)}` },
          details: [
            { label: "Annual TDS", value: `₹${formatNumber(annualTDS)}` },
            { label: "Taxable income", value: `₹${formatNumber(taxableIncome)}` },
            { label: "Income tax", value: `₹${formatNumber(tax)}` },
            { label: "Cess (4%)", value: `₹${formatNumber(cess)}` },
            { label: "Monthly take-home (approx.)", value: `₹${formatNumber((annualSalary - annualTDS) / 12)}` },
          ],
        };
      },
    },
    {
      id: "other",
      name: "TDS on Other Income",
      description: "Calculate TDS on interest, rent, professional fees, etc.",
      fields: [
        {
          name: "amount",
          label: "Payment Amount",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "section",
          label: "TDS Section",
          type: "select",
          options: [
            { label: "194A - Interest (non-bank) - 10%", value: "194A_10" },
            { label: "194I - Rent (Land/Building) - 10%", value: "194I_10" },
            { label: "194I - Rent (P&M/Equipment) - 2%", value: "194I_2" },
            { label: "194J - Professional Fees - 10%", value: "194J_10" },
            { label: "194J - Technical Services - 2%", value: "194J_2" },
            { label: "194C - Contractor (Individual) - 1%", value: "194C_1" },
            { label: "194C - Contractor (Company) - 2%", value: "194C_2" },
            { label: "194H - Commission/Brokerage - 5%", value: "194H_5" },
            { label: "194B - Lottery/Game Show - 30%", value: "194B_30" },
          ],
          defaultValue: "194J_10",
        },
        {
          name: "hasPAN",
          label: "PAN Provided?",
          type: "select",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No (Higher TDS @20%)", value: "no" },
          ],
          defaultValue: "yes",
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const section = inputs.section as string;
        const hasPAN = inputs.hasPAN as string;
        if (!amount) return null;

        const rateStr = section.split("_").pop() || "10";
        let tdsRate = parseFloat(rateStr);

        if (hasPAN === "no") {
          tdsRate = Math.max(tdsRate, 20);
        }

        const tdsAmount = amount * (tdsRate / 100);
        const netPayment = amount - tdsAmount;
        const sectionName = section.split("_")[0];

        return {
          primary: { label: "TDS Amount", value: `₹${formatNumber(tdsAmount)}` },
          details: [
            { label: "Payment amount", value: `₹${formatNumber(amount)}` },
            { label: "TDS rate", value: `${tdsRate}%` },
            { label: "Net payment after TDS", value: `₹${formatNumber(netPayment)}` },
            { label: "Section", value: sectionName },
          ],
          note: hasPAN === "no" ? "Higher TDS rate of 20% applied as PAN is not provided (Section 206AA)." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["income-tax-india-calculator", "in-hand-salary-calculator", "gst-calculator"],
  faq: [
    {
      question: "What is TDS?",
      answer:
        "TDS (Tax Deducted at Source) is a mechanism where the payer deducts tax at the time of making a payment (salary, interest, rent, etc.) and deposits it with the government. It ensures tax is collected at the point of income generation.",
    },
    {
      question: "When is TDS applicable?",
      answer:
        "TDS is applicable when payment exceeds certain thresholds: Salary (any amount), Interest > ₹40,000/year, Rent > ₹2,40,000/year, Professional fees > ₹30,000/year, Contractor payments > ₹30,000 (single) or ₹1,00,000 (aggregate).",
    },
    {
      question: "What happens if TDS is deducted but I have no tax liability?",
      answer:
        "If your total income is below the taxable limit or your tax liability is less than the TDS deducted, you can claim a refund by filing your income tax return. The excess TDS will be refunded to your bank account.",
    },
  ],
  formula: "TDS = Payment Amount × TDS Rate",
};
