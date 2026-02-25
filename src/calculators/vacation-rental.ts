import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vacationRentalCalculator: CalculatorDefinition = {
  slug: "vacation-rental-calculator",
  title: "Vacation Rental ROI Calculator",
  description:
    "Free vacation rental ROI calculator. Analyze vacation rental property returns including seasonal income, expenses, and personal use impact on profitability.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "vacation rental roi",
    "vacation rental calculator",
    "vacation home income",
    "rental property return",
    "vacation rental profit",
  ],
  variants: [
    {
      id: "roi",
      name: "Vacation Rental ROI",
      description: "Calculate vacation rental return on investment",
      fields: [
        {
          name: "purchasePrice",
          label: "Purchase Price",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
          min: 0,
        },
        {
          name: "peakNightlyRate",
          label: "Peak Season Nightly Rate",
          type: "number",
          placeholder: "e.g. 250",
          prefix: "$",
          min: 0,
        },
        {
          name: "offPeakNightlyRate",
          label: "Off-Peak Season Nightly Rate",
          type: "number",
          placeholder: "e.g. 120",
          prefix: "$",
          min: 0,
        },
        {
          name: "peakOccupancy",
          label: "Peak Season Occupancy",
          type: "number",
          placeholder: "e.g. 80",
          suffix: "%",
          min: 0,
          max: 100,
          step: 1,
        },
        {
          name: "offPeakOccupancy",
          label: "Off-Peak Season Occupancy",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "%",
          min: 0,
          max: 100,
          step: 1,
        },
        {
          name: "peakMonths",
          label: "Peak Season Months",
          type: "select",
          options: [
            { label: "3 months", value: "3" },
            { label: "4 months", value: "4" },
            { label: "5 months", value: "5" },
            { label: "6 months", value: "6" },
          ],
          defaultValue: "4",
        },
        {
          name: "annualExpenses",
          label: "Total Annual Expenses",
          type: "number",
          placeholder: "e.g. 15000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const price = inputs.purchasePrice as number;
        const down = (inputs.downPayment as number) || 0;
        const peakRate = inputs.peakNightlyRate as number;
        const offPeakRate = inputs.offPeakNightlyRate as number;
        const peakOcc = (inputs.peakOccupancy as number) || 0;
        const offPeakOcc = (inputs.offPeakOccupancy as number) || 0;
        const peakMonths = parseInt(inputs.peakMonths as string) || 4;
        const expenses = (inputs.annualExpenses as number) || 0;
        if (!price || !peakRate || !offPeakRate) return null;

        const offPeakMonths = 12 - peakMonths;
        const peakIncome = peakRate * 30 * (peakOcc / 100) * peakMonths;
        const offPeakIncome = offPeakRate * 30 * (offPeakOcc / 100) * offPeakMonths;
        const grossIncome = peakIncome + offPeakIncome;
        const netIncome = grossIncome - expenses;
        const roi = down > 0 ? (netIncome / down) * 100 : (netIncome / price) * 100;

        return {
          primary: {
            label: "Annual ROI",
            value: `${formatNumber(roi)}%`,
          },
          details: [
            { label: "Annual gross income", value: `$${formatNumber(grossIncome)}` },
            { label: "Annual net income", value: `$${formatNumber(netIncome)}` },
            { label: "Peak season income", value: `$${formatNumber(peakIncome)}` },
            { label: "Off-peak season income", value: `$${formatNumber(offPeakIncome)}` },
            { label: "Monthly net (average)", value: `$${formatNumber(netIncome / 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["airbnb-income-calculator", "rental-cash-flow-calculator", "investment-property-calculator"],
  faq: [
    {
      question: "How do I calculate vacation rental ROI?",
      answer:
        "Vacation rental ROI = (Annual Net Income / Total Cash Invested) x 100. Include seasonal rate differences, varying occupancy rates, and all expenses (mortgage, management, cleaning, maintenance, insurance, taxes).",
    },
    {
      question: "What is a good vacation rental ROI?",
      answer:
        "A good vacation rental ROI is typically 8-15% cash-on-cash return. This is higher than long-term rentals due to the extra management effort required. Returns vary significantly by location and seasonality.",
    },
    {
      question: "How does personal use affect vacation rental ROI?",
      answer:
        "Personal use reduces rental income directly (fewer nights available) and can affect tax deductions. If personal use exceeds 14 days or 10% of rental days, the IRS may limit deductible expenses, reducing your effective return.",
    },
  ],
  formula: "ROI = (Annual Net Income / Cash Invested) x 100",
};
