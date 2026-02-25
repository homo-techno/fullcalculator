import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentVsBuyDetailedCalculator: CalculatorDefinition = {
  slug: "rent-vs-buy-detailed-calculator",
  title: "Rent vs Buy Detailed Calculator",
  description:
    "Free detailed rent vs buy calculator. Compare the true cost of renting versus buying a home over time, factoring in appreciation, tax benefits, maintenance, and opportunity cost.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rent vs buy calculator",
    "rent or buy",
    "renting vs buying",
    "should I buy a house",
    "cost of renting vs buying",
    "home buying decision",
  ],
  variants: [
    {
      id: "rent-vs-buy",
      name: "Rent vs Buy Comparison",
      description: "Compare the total cost of renting versus buying over time",
      fields: [
        {
          name: "homePrice",
          label: "Home Purchase Price",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPaymentPct",
          label: "Down Payment",
          type: "select",
          options: [
            { label: "5%", value: "5" },
            { label: "10%", value: "10" },
            { label: "15%", value: "15" },
            { label: "20%", value: "20" },
            { label: "25%", value: "25" },
          ],
          defaultValue: "20",
        },
        {
          name: "mortgageRate",
          label: "Mortgage Interest Rate",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "monthlyRent",
          label: "Monthly Rent",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          min: 0,
        },
        {
          name: "annualRentIncrease",
          label: "Annual Rent Increase",
          type: "select",
          options: [
            { label: "2%", value: "2" },
            { label: "3%", value: "3" },
            { label: "4%", value: "4" },
            { label: "5%", value: "5" },
          ],
          defaultValue: "3",
        },
        {
          name: "stayYears",
          label: "Years You Plan to Stay",
          type: "select",
          options: [
            { label: "3 years", value: "3" },
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "7",
        },
        {
          name: "homeAppreciation",
          label: "Annual Home Appreciation",
          type: "select",
          options: [
            { label: "2%", value: "2" },
            { label: "3%", value: "3" },
            { label: "4%", value: "4" },
            { label: "5%", value: "5" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const homePrice = inputs.homePrice as number;
        const downPct = parseFloat(inputs.downPaymentPct as string) || 20;
        const mortRate = inputs.mortgageRate as number;
        const monthlyRent = inputs.monthlyRent as number;
        const rentIncrease = parseFloat(inputs.annualRentIncrease as string) || 3;
        const years = parseInt(inputs.stayYears as string) || 7;
        const appreciation = parseFloat(inputs.homeAppreciation as string) || 3;
        if (!homePrice || !mortRate || !monthlyRent) return null;

        const downPayment = homePrice * (downPct / 100);
        const loanAmount = homePrice - downPayment;
        const mr = mortRate / 100 / 12;
        const n = 30 * 12;
        const monthlyMortgage =
          (loanAmount * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);

        const annualTax = homePrice * 0.012;
        const annualInsurance = homePrice * 0.005;
        const annualMaintenance = homePrice * 0.01;
        const monthlyOwnerCost =
          monthlyMortgage + annualTax / 12 + annualInsurance / 12 + annualMaintenance / 12;

        let totalRentCost = 0;
        let currentRent = monthlyRent;
        for (let y = 0; y < years; y++) {
          totalRentCost += currentRent * 12;
          currentRent *= 1 + rentIncrease / 100;
        }

        const totalBuyCost = monthlyOwnerCost * years * 12;
        const futureHomeValue = homePrice * Math.pow(1 + appreciation / 100, years);
        const equityGain = futureHomeValue - homePrice;
        const netBuyCost = totalBuyCost + downPayment - equityGain;
        const savings = totalRentCost - netBuyCost;
        const betterOption = savings > 0 ? "Buying" : "Renting";

        return {
          primary: {
            label: "Better Option",
            value: betterOption,
          },
          details: [
            { label: "Monthly mortgage (P&I)", value: `$${formatNumber(monthlyMortgage)}` },
            { label: "Total monthly owner cost", value: `$${formatNumber(monthlyOwnerCost)}` },
            { label: `Total rent over ${years} years`, value: `$${formatNumber(totalRentCost)}` },
            { label: `Net buying cost over ${years} years`, value: `$${formatNumber(netBuyCost)}` },
            { label: "Estimated home value at end", value: `$${formatNumber(futureHomeValue)}` },
            { label: "Equity gain from appreciation", value: `$${formatNumber(equityGain)}` },
            { label: "Net savings with better option", value: `$${formatNumber(Math.abs(savings))}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "piti-calculator"],
  faq: [
    {
      question: "When does buying make more sense than renting?",
      answer:
        "Buying typically makes more sense when you plan to stay at least 5-7 years, home prices are appreciating, and mortgage payments are comparable to rent. The longer you stay, the more buying tends to favor you.",
    },
    {
      question: "What hidden costs of homeownership are included?",
      answer:
        "This calculator includes property taxes (est. 1.2%), homeowner's insurance (est. 0.5%), and maintenance (est. 1% of home value annually) in addition to the mortgage payment.",
    },
    {
      question: "Does this account for the tax benefits of buying?",
      answer:
        "This simplified comparison focuses on direct costs and appreciation. Actual tax benefits from mortgage interest deductions may further favor buying, but depend on your tax bracket and whether you itemize.",
    },
  ],
  formula:
    "Total Rent = sum of monthly rent with annual increases. Net Buy Cost = Total owner costs + Down payment - Equity gain from appreciation.",
};
