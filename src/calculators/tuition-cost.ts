import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tuitionCostCalculator: CalculatorDefinition = {
  slug: "tuition-cost-calculator",
  title: "Tuition Cost Calculator",
  description:
    "Free tuition cost calculator. Estimate your total college cost including tuition, room and board, fees, and inflation over 4 years.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "tuition cost calculator",
    "college cost calculator",
    "total cost of college",
    "university cost estimator",
    "tuition calculator",
  ],
  variants: [
    {
      id: "totalCost",
      name: "Total College Cost",
      description: "Estimate the total cost of attending college for the full degree",
      fields: [
        { name: "annualTuition", label: "Annual Tuition & Fees ($)", type: "number", placeholder: "e.g. 25000" },
        { name: "roomBoard", label: "Annual Room & Board ($)", type: "number", placeholder: "e.g. 12000" },
        { name: "booksSupplies", label: "Annual Books & Supplies ($)", type: "number", placeholder: "e.g. 1200" },
        { name: "personalExpenses", label: "Annual Personal / Transportation ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "years", label: "Years to Graduate", type: "number", placeholder: "e.g. 4", min: 1, max: 8 },
        { name: "inflationRate", label: "Annual Tuition Inflation Rate (%)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const tuition = inputs.annualTuition as number;
        const roomBoard = (inputs.roomBoard as number) || 0;
        const books = (inputs.booksSupplies as number) || 0;
        const personal = (inputs.personalExpenses as number) || 0;
        const years = inputs.years as number;
        const inflation = (inputs.inflationRate as number) || 0;
        if (!tuition || !years) return null;

        let totalCost = 0;
        let totalTuition = 0;
        let totalRoom = 0;
        const annualCostYear1 = tuition + roomBoard + books + personal;

        for (let y = 0; y < years; y++) {
          const factor = Math.pow(1 + inflation / 100, y);
          const yearTuition = tuition * factor;
          const yearRoom = roomBoard * factor;
          const yearBooks = books * factor;
          const yearPersonal = personal * factor;
          totalTuition += yearTuition;
          totalRoom += yearRoom;
          totalCost += yearTuition + yearRoom + yearBooks + yearPersonal;
        }

        const costNoInflation = annualCostYear1 * years;
        const inflationImpact = totalCost - costNoInflation;

        return {
          primary: { label: "Total College Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Year 1 cost", value: `$${formatNumber(annualCostYear1, 0)}` },
            { label: "Final year cost", value: `$${formatNumber(annualCostYear1 * Math.pow(1 + inflation / 100, years - 1), 0)}` },
            { label: "Total tuition & fees", value: `$${formatNumber(totalTuition, 0)}` },
            { label: "Total room & board", value: `$${formatNumber(totalRoom, 0)}` },
            { label: "Inflation impact", value: `+$${formatNumber(inflationImpact, 0)}` },
            { label: "Average annual cost", value: `$${formatNumber(totalCost / years, 0)}` },
          ],
        };
      },
    },
    {
      id: "comparison",
      name: "College Type Comparison",
      description: "Compare costs between public in-state, public out-of-state, and private colleges",
      fields: [
        { name: "years", label: "Years to Graduate", type: "number", placeholder: "e.g. 4", min: 1, max: 8 },
        { name: "inflation", label: "Annual Inflation Rate (%)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const years = inputs.years as number;
        const inflation = (inputs.inflation as number) || 3;
        if (!years) return null;

        // Average costs (2024 figures)
        const types = [
          { name: "Public In-State", annual: 27000 },
          { name: "Public Out-of-State", annual: 45000 },
          { name: "Private", annual: 58000 },
        ];

        const results = types.map((t) => {
          let total = 0;
          for (let y = 0; y < years; y++) {
            total += t.annual * Math.pow(1 + inflation / 100, y);
          }
          return { name: t.name, total };
        });

        return {
          primary: { label: "Public In-State (total)", value: `$${formatNumber(results[0].total, 0)}` },
          details: [
            { label: "Public Out-of-State (total)", value: `$${formatNumber(results[1].total, 0)}` },
            { label: "Private (total)", value: `$${formatNumber(results[2].total, 0)}` },
            { label: "Out-of-state premium", value: `+$${formatNumber(results[1].total - results[0].total, 0)}` },
            { label: "Private premium", value: `+$${formatNumber(results[2].total - results[0].total, 0)}` },
            { label: "Inflation rate used", value: `${inflation}%` },
          ],
          note: "Costs are based on average national figures including tuition, fees, room, and board. Actual costs vary significantly by institution.",
        };
      },
    },
  ],
  relatedSlugs: ["college-savings-calculator", "scholarship-calculator", "student-loan-calculator"],
  faq: [
    {
      question: "How much does college cost on average?",
      answer:
        "For 2024-2025, average annual costs (tuition + room & board) are approximately: public in-state $27,000, public out-of-state $45,000, and private $58,000. Over 4 years with inflation, these totals can be significantly higher.",
    },
    {
      question: "Why does tuition increase every year?",
      answer:
        "Tuition has historically increased 2-5% per year due to rising operational costs, decreased state funding, facility upgrades, and increased demand for services. The average annual increase is about 3%.",
    },
    {
      question: "What costs should I include beyond tuition?",
      answer:
        "Total cost of attendance includes tuition, fees, room and board, books and supplies, personal expenses, and transportation. Hidden costs include health insurance, parking, lab fees, and technology fees.",
    },
  ],
  formula: "Total Cost = Sum over years of (Annual Cost x (1 + Inflation Rate)^year)",
};
