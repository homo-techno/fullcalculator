import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const closingCostCalculator: CalculatorDefinition = {
  slug: "closing-cost-calculator",
  title: "Closing Cost Calculator",
  description:
    "Free closing cost calculator. Estimate your home closing costs including appraisal, title insurance, attorney fees, recording fees, and more. Typically 2-5% of the home price.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "closing cost calculator",
    "home closing costs",
    "closing costs estimator",
    "buyer closing costs",
    "real estate closing costs",
  ],
  variants: [
    {
      id: "estimate",
      name: "Estimate Closing Costs",
      description: "Get a detailed breakdown of estimated closing costs",
      fields: [
        {
          name: "homePrice",
          label: "Home Price",
          type: "number",
          placeholder: "e.g. 350000",
          prefix: "$",
          min: 0,
        },
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 280000",
          prefix: "$",
          min: 0,
        },
        {
          name: "costLevel",
          label: "Cost Estimate Level",
          type: "select",
          options: [
            { label: "Low (2%)", value: "low" },
            { label: "Average (3.5%)", value: "avg" },
            { label: "High (5%)", value: "high" },
          ],
          defaultValue: "avg",
        },
      ],
      calculate: (inputs) => {
        const homePrice = inputs.homePrice as number;
        const loanAmount = (inputs.loanAmount as number) || homePrice * 0.8;
        const level = inputs.costLevel as string;
        if (!homePrice) return null;

        // Individual cost estimates based on level
        const multiplier = level === "low" ? 0 : level === "high" ? 1 : 0.5;

        // Appraisal fee: $300-$500
        const appraisal = 300 + multiplier * 200;

        // Home inspection: $300-$500
        const inspection = 300 + multiplier * 200;

        // Title insurance: 0.5-1% of home price
        const titleInsurance = homePrice * (0.005 + multiplier * 0.005);

        // Title search: $200-$400
        const titleSearch = 200 + multiplier * 200;

        // Attorney fees: $500-$1500
        const attorney = 500 + multiplier * 1000;

        // Recording fees: $100-$250
        const recording = 100 + multiplier * 150;

        // Loan origination fee: 0.5-1% of loan
        const origination = loanAmount * (0.005 + multiplier * 0.005);

        // Credit report: $25-$50
        const creditReport = 25 + multiplier * 25;

        // Survey: $300-$500
        const survey = 300 + multiplier * 200;

        // Flood certification: $15-$25
        const floodCert = 15 + multiplier * 10;

        // Prepaid items (taxes, insurance escrow) - approx 2-4 months
        const estimatedMonthlyTax = homePrice * 0.012 / 12;
        const prepaidTaxes = estimatedMonthlyTax * (2 + multiplier * 2);
        const prepaidInsurance = (homePrice * 0.004 / 12) * (2 + multiplier * 10);

        const totalClosing = appraisal + inspection + titleInsurance + titleSearch + attorney +
          recording + origination + creditReport + survey + floodCert;
        const totalPrepaid = prepaidTaxes + prepaidInsurance;
        const grandTotal = totalClosing + totalPrepaid;
        const percentOfPrice = (grandTotal / homePrice) * 100;

        return {
          primary: {
            label: "Estimated Total Closing Costs",
            value: `$${formatNumber(grandTotal)}`,
          },
          details: [
            { label: "Loan origination fee", value: `$${formatNumber(origination)}` },
            { label: "Title insurance", value: `$${formatNumber(titleInsurance)}` },
            { label: "Attorney fees", value: `$${formatNumber(attorney)}` },
            { label: "Appraisal fee", value: `$${formatNumber(appraisal)}` },
            { label: "Home inspection", value: `$${formatNumber(inspection)}` },
            { label: "Title search", value: `$${formatNumber(titleSearch)}` },
            { label: "Recording fees", value: `$${formatNumber(recording)}` },
            { label: "Survey", value: `$${formatNumber(survey)}` },
            { label: "Credit report", value: `$${formatNumber(creditReport)}` },
            { label: "Flood certification", value: `$${formatNumber(floodCert)}` },
            { label: "Prepaid taxes & insurance", value: `$${formatNumber(totalPrepaid)}` },
            { label: "% of home price", value: `${formatNumber(percentOfPrice, 1)}%` },
          ],
          note: "Closing costs vary by location and lender. This is an estimate. Ask your lender for a Loan Estimate form for exact figures.",
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "home-affordability-calculator", "down-payment-calculator"],
  faq: [
    {
      question: "How much are closing costs typically?",
      answer:
        "Closing costs typically range from 2% to 5% of the home purchase price. On a $350,000 home, expect $7,000 to $17,500 in closing costs. The exact amount depends on your location, lender, loan type, and negotiations with the seller.",
    },
    {
      question: "What are the biggest closing costs?",
      answer:
        "The largest closing costs are usually loan origination fees (0.5-1% of the loan), title insurance (0.5-1% of the price), and prepaid items (property taxes and homeowners insurance escrow). Attorney fees and appraisal fees are also significant.",
    },
    {
      question: "Can the seller pay closing costs?",
      answer:
        "Yes, sellers can contribute to buyer closing costs (seller concessions). Conventional loans allow up to 3-9% depending on down payment. FHA allows up to 6%. VA allows up to 4%. This is often negotiated in the purchase agreement.",
    },
  ],
  formula:
    "Total Closing Costs = Origination + Title Insurance + Attorney + Appraisal + Inspection + Recording + Prepaid Items. Typically 2-5% of home price.",
};
