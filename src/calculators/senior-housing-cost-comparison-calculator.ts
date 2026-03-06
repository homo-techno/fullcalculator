import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seniorHousingCostComparisonCalculator: CalculatorDefinition = {
  slug: "senior-housing-cost-comparison-calculator",
  title: "Senior Housing Cost Comparison Calculator",
  description: "Compare monthly costs across different senior housing options including independent living, continuing care retirement communities, and aging in place.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["senior housing cost","senior living comparison","continuing care retirement community","aging in place cost"],
  variants: [{
    id: "standard",
    name: "Senior Housing Cost Comparison",
    description: "Compare monthly costs across different senior housing options including independent living, continuing care retirement communities, and aging in place.",
    fields: [
      { name: "currentHomeValue", label: "Current Home Value ($)", type: "number", min: 50000, max: 5000000, defaultValue: 350000 },
      { name: "monthlyHomeExpenses", label: "Monthly Home Expenses ($)", type: "number", min: 500, max: 10000, defaultValue: 2500 },
      { name: "independentLiving", label: "Independent Living Monthly ($)", type: "number", min: 1000, max: 10000, defaultValue: 3500 },
      { name: "ccrcEntryFee", label: "CCRC Entry Fee ($)", type: "number", min: 0, max: 1000000, defaultValue: 250000 },
      { name: "ccrcMonthly", label: "CCRC Monthly Fee ($)", type: "number", min: 1000, max: 15000, defaultValue: 4000 },
      { name: "yearsToCompare", label: "Comparison Period (Years)", type: "number", min: 5, max: 30, defaultValue: 15 },
    ],
    calculate: (inputs) => {
    const homeVal = inputs.currentHomeValue as number;
    const monthlyHome = inputs.monthlyHomeExpenses as number;
    const ilMonthly = inputs.independentLiving as number;
    const ccrcEntry = inputs.ccrcEntryFee as number;
    const ccrcMonthly = inputs.ccrcMonthly as number;
    const years = inputs.yearsToCompare as number;
    const agingInPlaceTotal = monthlyHome * 12 * years;
    const ilTotal = ilMonthly * 12 * years;
    const ilWithHomeSale = ilTotal - homeVal;
    const ccrcTotal = ccrcEntry + ccrcMonthly * 12 * years;
    const ccrcWithHomeSale = ccrcTotal - homeVal;
    const cheapest = Math.min(agingInPlaceTotal, ilTotal, ccrcTotal);
    const bestOption = cheapest === agingInPlaceTotal ? "Aging in Place" : cheapest === ilTotal ? "Independent Living" : "CCRC";
    return {
      primary: { label: "Most Affordable Option", value: bestOption },
      details: [
        { label: "Aging in Place Total", value: "$" + formatNumber(Math.round(agingInPlaceTotal)) },
        { label: "Independent Living Total", value: "$" + formatNumber(Math.round(ilTotal)) },
        { label: "CCRC Total (with entry fee)", value: "$" + formatNumber(Math.round(ccrcTotal)) },
        { label: "IL Net (after home sale)", value: "$" + formatNumber(Math.round(ilWithHomeSale)) },
        { label: "CCRC Net (after home sale)", value: "$" + formatNumber(Math.round(ccrcWithHomeSale)) }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-income-gap-calculator","retirement-healthcare-cost-calculator"],
  faq: [
    { question: "What is a CCRC?", answer: "A Continuing Care Retirement Community (CCRC) offers multiple levels of care in one location, from independent living to assisted living to skilled nursing. Residents typically pay a one-time entry fee plus monthly fees and can transition between care levels as needs change." },
    { question: "What does independent living typically include?", answer: "Independent living communities typically include housing, meals, housekeeping, transportation, social activities, and building maintenance. Medical care and personal assistance are usually not included but may be available for additional fees." },
    { question: "Is aging in place always cheaper?", answer: "Not necessarily. While aging in place avoids facility fees, costs for home modifications, in-home care, transportation, meal services, and home maintenance can add up significantly, especially as care needs increase over time." },
  ],
  formula: "Aging in Place = Monthly Home Expenses x 12 x Years
Independent Living = Monthly Fee x 12 x Years
CCRC = Entry Fee + Monthly Fee x 12 x Years
Net Cost = Total - Home Sale Proceeds",
};
