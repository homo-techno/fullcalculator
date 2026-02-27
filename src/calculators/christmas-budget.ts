import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const christmasBudgetCalculator: CalculatorDefinition = {
  slug: "christmas-budget-calculator",
  title: "Christmas Budget Calculator",
  description:
    "Plan your Christmas gift budget. Calculate total holiday spending across gifts, decorations, food, and travel to stay on track financially.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "christmas budget",
    "holiday spending",
    "gift budget",
    "christmas planner",
    "holiday budget",
  ],
  variants: [
    {
      id: "giftBudget",
      name: "Gift Budget Planner",
      description: "Plan your gift spending by number of recipients and average gift cost",
      fields: [
        { name: "numAdults", label: "Number of Adults", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "avgAdultGift", label: "Avg Gift per Adult ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "numChildren", label: "Number of Children", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
        { name: "avgChildGift", label: "Avg Gift per Child ($)", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "numCoworkers", label: "Number of Coworkers / Friends", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "avgCoworkerGift", label: "Avg Gift per Coworker ($)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "wrappingSupplies", label: "Wrapping & Cards ($)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const numAdults = parseFloat(inputs.numAdults as string);
        const avgAdultGift = parseFloat(inputs.avgAdultGift as string);
        const numChildren = parseFloat(inputs.numChildren as string);
        const avgChildGift = parseFloat(inputs.avgChildGift as string);
        const numCoworkers = parseFloat(inputs.numCoworkers as string);
        const avgCoworkerGift = parseFloat(inputs.avgCoworkerGift as string);
        const wrappingSupplies = parseFloat(inputs.wrappingSupplies as string);

        if (isNaN(numAdults) || isNaN(avgAdultGift)) return null;

        const adultTotal = numAdults * avgAdultGift;
        const childTotal = (numChildren || 0) * (avgChildGift || 0);
        const coworkerTotal = (numCoworkers || 0) * (avgCoworkerGift || 0);
        const wrapping = wrappingSupplies || 0;
        const totalGifts = adultTotal + childTotal + coworkerTotal + wrapping;
        const totalRecipients = (numAdults || 0) + (numChildren || 0) + (numCoworkers || 0);

        return {
          primary: { label: "Total Gift Budget", value: `$${formatNumber(totalGifts, 2)}` },
          details: [
            { label: "Adult Gifts Total", value: `$${formatNumber(adultTotal, 2)}` },
            { label: "Children Gifts Total", value: `$${formatNumber(childTotal, 2)}` },
            { label: "Coworker/Friend Gifts", value: `$${formatNumber(coworkerTotal, 2)}` },
            { label: "Wrapping & Cards", value: `$${formatNumber(wrapping, 2)}` },
            { label: "Total Recipients", value: formatNumber(totalRecipients, 0) },
            { label: "Average per Recipient", value: `$${formatNumber(totalRecipients > 0 ? (totalGifts - wrapping) / totalRecipients : 0, 2)}` },
          ],
        };
      },
    },
    {
      id: "totalHoliday",
      name: "Total Holiday Budget",
      description: "Estimate your complete Christmas spending including gifts, food, decorations, and travel",
      fields: [
        { name: "giftBudget", label: "Gift Budget ($)", type: "number", placeholder: "e.g. 500", defaultValue: 500 },
        { name: "foodDrink", label: "Food & Drink ($)", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "decorations", label: "Decorations ($)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "travel", label: "Travel Expenses ($)", type: "number", placeholder: "e.g. 300", defaultValue: 300 },
        { name: "entertainment", label: "Entertainment ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "monthlyIncome", label: "Monthly Income ($)", type: "number", placeholder: "e.g. 4000" },
      ],
      calculate: (inputs) => {
        const giftBudget = parseFloat(inputs.giftBudget as string);
        const foodDrink = parseFloat(inputs.foodDrink as string);
        const decorations = parseFloat(inputs.decorations as string);
        const travel = parseFloat(inputs.travel as string);
        const entertainment = parseFloat(inputs.entertainment as string);
        const monthlyIncome = parseFloat(inputs.monthlyIncome as string);

        if (isNaN(giftBudget)) return null;

        const total = (giftBudget || 0) + (foodDrink || 0) + (decorations || 0) + (travel || 0) + (entertainment || 0);
        const incomePercent = monthlyIncome > 0 ? (total / monthlyIncome) * 100 : 0;
        const monthlySavings = total / 12;

        return {
          primary: { label: "Total Holiday Budget", value: `$${formatNumber(total, 2)}` },
          details: [
            { label: "Gifts", value: `$${formatNumber(giftBudget || 0, 2)}` },
            { label: "Food & Drink", value: `$${formatNumber(foodDrink || 0, 2)}` },
            { label: "Decorations", value: `$${formatNumber(decorations || 0, 2)}` },
            { label: "Travel", value: `$${formatNumber(travel || 0, 2)}` },
            { label: "Entertainment", value: `$${formatNumber(entertainment || 0, 2)}` },
            { label: "% of Monthly Income", value: monthlyIncome > 0 ? `${formatNumber(incomePercent, 1)}%` : "N/A" },
            { label: "Save per Month (12-mo plan)", value: `$${formatNumber(monthlySavings, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["christmas-light-cost-calculator", "new-years-party-calculator", "budget-calculator"],
  faq: [
    {
      question: "How much does the average American spend on Christmas?",
      answer:
        "According to the National Retail Federation, the average American spends around $850-$1,000 on holiday gifts and related expenses. This includes gifts, food, decorations, and greeting cards.",
    },
    {
      question: "How can I reduce my Christmas spending?",
      answer:
        "Consider setting a firm budget, drawing names for gift exchanges, making DIY gifts, shopping sales and using coupons, and starting a holiday savings fund in January so you save a little each month.",
    },
    {
      question: "When should I start saving for Christmas?",
      answer:
        "Financial experts recommend starting in January. If you plan to spend $1,200 at Christmas, saving $100 per month makes it painless compared to a last-minute spending spree.",
    },
  ],
  formula:
    "Total Gift Budget = (Adults × Avg Adult Gift) + (Children × Avg Child Gift) + (Coworkers × Avg Coworker Gift) + Wrapping Supplies",
};
