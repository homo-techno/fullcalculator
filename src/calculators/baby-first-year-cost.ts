import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyFirstYearCostCalculator: CalculatorDefinition = {
  slug: "baby-first-year-cost-calculator",
  title: "Baby First Year Cost Calculator",
  description:
    "Estimate the total cost of a baby's first year. Calculate expenses for diapers, formula, gear, clothing, childcare, and medical costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "baby cost",
    "first year baby",
    "newborn expenses",
    "baby budget",
    "infant cost",
  ],
  variants: [
    {
      id: "essentials",
      name: "Essential Costs",
      description: "Estimate core first-year expenses",
      fields: [
        { name: "feedingType", label: "Feeding Method", type: "select", options: [
          { label: "Breastfeeding (pump + supplies)", value: "breast" },
          { label: "Formula feeding", value: "formula" },
          { label: "Combination", value: "combo" },
        ], defaultValue: "formula" },
        { name: "diaperType", label: "Diaper Type", type: "select", options: [
          { label: "Disposable", value: "disposable" },
          { label: "Cloth", value: "cloth" },
          { label: "Mix of both", value: "mix" },
        ], defaultValue: "disposable" },
        { name: "clothingBudget", label: "Clothing Budget ($)", type: "number", placeholder: "e.g. 600", defaultValue: 600 },
        { name: "gearBudget", label: "Gear (crib, stroller, car seat) ($)", type: "number", placeholder: "e.g. 1500", defaultValue: 1500 },
        { name: "medicalCosts", label: "Medical/Insurance Costs ($)", type: "number", placeholder: "e.g. 2000", defaultValue: 2000 },
        { name: "miscMonthly", label: "Misc Monthly (toys, toiletries) ($)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
      ],
      calculate: (inputs) => {
        const feedingType = inputs.feedingType as string;
        const diaperType = inputs.diaperType as string;
        const clothingBudget = parseFloat(inputs.clothingBudget as string) || 0;
        const gearBudget = parseFloat(inputs.gearBudget as string) || 0;
        const medicalCosts = parseFloat(inputs.medicalCosts as string) || 0;
        const miscMonthly = parseFloat(inputs.miscMonthly as string) || 0;

        const feedingCosts: Record<string, number> = { breast: 600, formula: 1800, combo: 1200 };
        const diaperCosts: Record<string, number> = { disposable: 900, cloth: 400, mix: 650 };

        const feeding = feedingCosts[feedingType] || 1800;
        const diapers = diaperCosts[diaperType] || 900;
        const misc = miscMonthly * 12;
        const totalFirstYear = feeding + diapers + clothingBudget + gearBudget + medicalCosts + misc;
        const monthlyAvg = totalFirstYear / 12;

        return {
          primary: { label: "Estimated First Year Cost", value: `$${formatNumber(totalFirstYear, 2)}` },
          details: [
            { label: "Feeding", value: `$${formatNumber(feeding, 2)}` },
            { label: "Diapers & Wipes", value: `$${formatNumber(diapers, 2)}` },
            { label: "Clothing", value: `$${formatNumber(clothingBudget, 2)}` },
            { label: "Gear & Furniture", value: `$${formatNumber(gearBudget, 2)}` },
            { label: "Medical/Insurance", value: `$${formatNumber(medicalCosts, 2)}` },
            { label: "Misc (toys, toiletries)", value: `$${formatNumber(misc, 2)}` },
            { label: "Monthly Average", value: `$${formatNumber(monthlyAvg, 2)}` },
          ],
        };
      },
    },
    {
      id: "withChildcare",
      name: "With Childcare",
      description: "Include childcare costs for working parents",
      fields: [
        { name: "childcareType", label: "Childcare Type", type: "select", options: [
          { label: "Daycare center", value: "daycare" },
          { label: "In-home daycare", value: "inhome" },
          { label: "Nanny", value: "nanny" },
          { label: "Family member (free)", value: "family" },
        ], defaultValue: "daycare" },
        { name: "monthlyChildcare", label: "Monthly Childcare ($)", type: "number", placeholder: "e.g. 1200", defaultValue: 1200 },
        { name: "childcareMonths", label: "Months of Childcare Needed", type: "number", placeholder: "e.g. 9", defaultValue: 9 },
        { name: "baseExpenses", label: "Base Baby Expenses (yearly) ($)", type: "number", placeholder: "e.g. 6000", defaultValue: 6000 },
        { name: "medicalCosts", label: "Medical/Insurance Costs ($)", type: "number", placeholder: "e.g. 2000", defaultValue: 2000 },
      ],
      calculate: (inputs) => {
        const childcareType = inputs.childcareType as string;
        const monthlyChildcare = parseFloat(inputs.monthlyChildcare as string) || 0;
        const childcareMonths = parseFloat(inputs.childcareMonths as string) || 0;
        const baseExpenses = parseFloat(inputs.baseExpenses as string) || 0;
        const medicalCosts = parseFloat(inputs.medicalCosts as string) || 0;

        const childcareTotal = childcareType === "family" ? 0 : monthlyChildcare * childcareMonths;
        const grandTotal = baseExpenses + medicalCosts + childcareTotal;
        const monthlyTotal = grandTotal / 12;

        return {
          primary: { label: "Total First Year with Childcare", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Childcare Total", value: `$${formatNumber(childcareTotal, 2)}` },
            { label: "Base Baby Expenses", value: `$${formatNumber(baseExpenses, 2)}` },
            { label: "Medical/Insurance", value: `$${formatNumber(medicalCosts, 2)}` },
            { label: "Monthly Average", value: `$${formatNumber(monthlyTotal, 2)}` },
            { label: "Childcare % of Total", value: grandTotal > 0 ? `${formatNumber((childcareTotal / grandTotal) * 100, 1)}%` : "0%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["adoption-cost-calculator", "budget-calculator", "college-move-in-cost-calculator"],
  faq: [
    {
      question: "How much does a baby cost in the first year?",
      answer:
        "The average first-year cost ranges from $12,000 to $25,000+ depending on location, childcare needs, and feeding method. Without childcare, basic expenses run $6,000-$10,000. Childcare can add $10,000-$20,000+ per year.",
    },
    {
      question: "What are the biggest baby expenses?",
      answer:
        "Childcare is by far the largest expense for working parents ($800-$2,500/month). After that, the biggest costs are medical/insurance, gear (crib, car seat, stroller), formula (if not breastfeeding), and diapers.",
    },
    {
      question: "How can I save on baby costs in the first year?",
      answer:
        "Accept hand-me-downs, buy used gear, breastfeed if possible, use cloth diapers, buy in bulk during sales, register for essentials, and skip unnecessary gadgets. Babies outgrow things fast — buy secondhand clothing.",
    },
  ],
  formula:
    "First Year Cost = Feeding + Diapers + Clothing + Gear + Medical + (Monthly Misc × 12) + (Childcare × Months)",
};
