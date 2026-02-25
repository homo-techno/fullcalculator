import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const escrowCalculator: CalculatorDefinition = {
  slug: "escrow-calculator",
  title: "Escrow Payment Calculator",
  description:
    "Free escrow payment calculator. Calculate monthly escrow payments for property taxes, homeowner's insurance, and PMI included in your mortgage payment.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "escrow calculator",
    "escrow payment",
    "mortgage escrow",
    "escrow account calculator",
    "property tax escrow",
  ],
  variants: [
    {
      id: "monthly-escrow",
      name: "Monthly Escrow Payment",
      description: "Calculate your total monthly escrow payment",
      fields: [
        {
          name: "annualPropertyTax",
          label: "Annual Property Tax",
          type: "number",
          placeholder: "e.g. 4800",
          prefix: "$",
          min: 0,
        },
        {
          name: "annualInsurance",
          label: "Annual Homeowner's Insurance",
          type: "number",
          placeholder: "e.g. 1800",
          prefix: "$",
          min: 0,
        },
        {
          name: "annualPMI",
          label: "Annual PMI (if applicable)",
          type: "number",
          placeholder: "e.g. 1200",
          prefix: "$",
          min: 0,
        },
        {
          name: "annualHOA",
          label: "Annual HOA Dues (if escrowed)",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          min: 0,
        },
        {
          name: "cushionMonths",
          label: "Escrow Cushion",
          type: "select",
          options: [
            { label: "No cushion", value: "0" },
            { label: "1 month cushion", value: "1" },
            { label: "2 months cushion", value: "2" },
          ],
          defaultValue: "2",
        },
      ],
      calculate: (inputs) => {
        const tax = (inputs.annualPropertyTax as number) || 0;
        const insurance = (inputs.annualInsurance as number) || 0;
        const pmi = (inputs.annualPMI as number) || 0;
        const hoa = (inputs.annualHOA as number) || 0;
        const cushionMonths = parseInt(inputs.cushionMonths as string) || 0;
        if (!tax && !insurance && !pmi && !hoa) return null;

        const totalAnnual = tax + insurance + pmi + hoa;
        const monthlyEscrow = totalAnnual / 12;
        const monthlyCushion = (totalAnnual / 12) * (cushionMonths / 12);
        const totalMonthly = monthlyEscrow + monthlyCushion;
        const initialDeposit = monthlyEscrow * (cushionMonths + 1);

        return {
          primary: {
            label: "Monthly Escrow Payment",
            value: `$${formatNumber(totalMonthly)}`,
          },
          details: [
            { label: "Monthly property tax", value: `$${formatNumber(tax / 12)}` },
            { label: "Monthly insurance", value: `$${formatNumber(insurance / 12)}` },
            { label: "Monthly PMI", value: `$${formatNumber(pmi / 12)}` },
            { label: "Monthly HOA", value: `$${formatNumber(hoa / 12)}` },
            { label: "Annual total escrowed", value: `$${formatNumber(totalAnnual)}` },
            { label: "Est. initial deposit at closing", value: `$${formatNumber(initialDeposit)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "title-insurance-calculator", "transfer-tax-calculator"],
  faq: [
    {
      question: "What is an escrow account?",
      answer:
        "An escrow account is a separate account held by your mortgage servicer to pay property taxes and insurance on your behalf. A portion of each monthly mortgage payment goes into the escrow account, and the servicer pays bills when they come due.",
    },
    {
      question: "What is an escrow cushion?",
      answer:
        "An escrow cushion is an extra amount (typically 1-2 months of payments) held in the escrow account as a buffer against unexpected increases in taxes or insurance. Federal law allows lenders to maintain a cushion of up to two months.",
    },
    {
      question: "Can I avoid escrow?",
      answer:
        "Some lenders allow you to waive escrow if you have at least 20% equity and a good credit score. You would then pay property taxes and insurance directly. Some lenders charge a small fee or higher interest rate for waiving escrow.",
    },
  ],
  formula: "Monthly Escrow = (Annual Taxes + Insurance + PMI + HOA) / 12 + Cushion",
};
