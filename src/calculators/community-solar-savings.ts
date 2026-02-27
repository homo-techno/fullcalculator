import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const communitySolarSavingsCalculator: CalculatorDefinition = {
  slug: "community-solar-savings-calculator",
  title: "Community Solar Subscription Savings Calculator",
  description:
    "Calculate your savings from subscribing to a community solar program. Compare your current electric bill with discounted solar credits, no rooftop panels needed.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "community solar",
    "solar garden",
    "shared solar",
    "community solar savings",
    "solar subscription",
    "virtual net metering",
  ],
  variants: [
    {
      id: "subscription",
      name: "Subscription Savings",
      description: "Calculate savings from a community solar subscription",
      fields: [
        { name: "monthlyBill", label: "Current Monthly Electric Bill ($)", type: "number", placeholder: "e.g. 150" },
        { name: "monthlyUsage", label: "Monthly Usage (kWh)", type: "number", placeholder: "e.g. 1000" },
        { name: "solarOffset", label: "Solar Allocation (% of bill)", type: "number", placeholder: "e.g. 90" },
        { name: "discountRate", label: "Credit Discount Rate (%)", type: "number", placeholder: "e.g. 15" },
        {
          name: "contractType",
          label: "Contract Type",
          type: "select",
          options: [
            { label: "No upfront cost (pay-as-you-go)", value: "paygo" },
            { label: "Upfront payment (ownership share)", value: "upfront" },
          ],
          defaultValue: "paygo",
        },
        { name: "upfrontCost", label: "Upfront Cost (if applicable) ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "contractYears", label: "Contract Length (years)", type: "number", placeholder: "e.g. 20" },
        { name: "rateIncrease", label: "Annual Utility Rate Increase (%)", type: "number", placeholder: "e.g. 3", step: 0.1 },
      ],
      calculate: (inputs) => {
        const monthlyBill = parseFloat(inputs.monthlyBill as string);
        const solarOffset = parseFloat(inputs.solarOffset as string) || 90;
        const discountRate = parseFloat(inputs.discountRate as string);
        const contractType = inputs.contractType as string;
        const upfrontCost = parseFloat(inputs.upfrontCost as string) || 0;
        const contractYears = parseFloat(inputs.contractYears as string);
        const rateIncrease = parseFloat(inputs.rateIncrease as string) || 3;

        if (!monthlyBill || !discountRate || !contractYears) return null;

        const offsetAmount = monthlyBill * (solarOffset / 100);
        const monthlySavings = offsetAmount * (discountRate / 100);

        let totalSavings = 0;
        let totalWithoutSolar = 0;
        let totalWithSolar = 0;

        for (let year = 0; year < contractYears; year++) {
          const escalation = Math.pow(1 + rateIncrease / 100, year);
          const yearlyBill = monthlyBill * 12 * escalation;
          const yearlyOffset = offsetAmount * 12 * escalation;
          const yearlySavings = yearlyOffset * (discountRate / 100);

          totalWithoutSolar += yearlyBill;
          totalWithSolar += yearlyBill - yearlySavings;
          totalSavings += yearlySavings;
        }

        const netSavings = contractType === "upfront" ? totalSavings - upfrontCost : totalSavings;
        const firstYearSavings = monthlySavings * 12;
        const avgMonthlySavings = netSavings / (contractYears * 12);

        return {
          primary: {
            label: `${contractYears}-Year Net Savings`,
            value: `$${formatNumber(netSavings, 2)}`,
          },
          details: [
            { label: "Monthly Savings (Year 1)", value: `$${formatNumber(monthlySavings, 2)}` },
            { label: "First Year Savings", value: `$${formatNumber(firstYearSavings, 2)}` },
            { label: "Average Monthly Savings", value: `$${formatNumber(avgMonthlySavings, 2)}` },
            ...(contractType === "upfront" ? [{ label: "Upfront Cost", value: `$${formatNumber(upfrontCost, 2)}` }] : []),
            { label: `${contractYears}-Year Utility Cost (without solar)`, value: `$${formatNumber(totalWithoutSolar, 2)}` },
            { label: `${contractYears}-Year Utility Cost (with solar)`, value: `$${formatNumber(totalWithSolar, 2)}` },
            { label: "Discount Rate on Credits", value: `${formatNumber(discountRate, 0)}%` },
            { label: "Bill Offset", value: `${formatNumber(solarOffset, 0)}%` },
          ],
          note: "Community solar requires no equipment on your roof, no installation, and no maintenance. Savings come as credits on your utility bill.",
        };
      },
    },
    {
      id: "comparison",
      name: "vs Rooftop Solar",
      fields: [
        { name: "monthlyBill", label: "Monthly Electric Bill ($)", type: "number", placeholder: "e.g. 150" },
        { name: "communityDiscount", label: "Community Solar Discount (%)", type: "number", placeholder: "e.g. 15" },
        { name: "rooftopCost", label: "Rooftop Solar Net Cost ($)", type: "number", placeholder: "e.g. 18000" },
        { name: "rooftopOffset", label: "Rooftop Bill Offset (%)", type: "number", placeholder: "e.g. 95" },
      ],
      calculate: (inputs) => {
        const monthlyBill = parseFloat(inputs.monthlyBill as string);
        const discount = parseFloat(inputs.communityDiscount as string);
        const rooftopCost = parseFloat(inputs.rooftopCost as string);
        const rooftopOffset = parseFloat(inputs.rooftopOffset as string) || 95;

        if (!monthlyBill || !discount || !rooftopCost) return null;

        const communityAnnual = monthlyBill * 0.90 * (discount / 100) * 12;
        const rooftopAnnual = monthlyBill * (rooftopOffset / 100) * 12;
        const rooftopPayback = rooftopCost / rooftopAnnual;
        const community25yr = communityAnnual * 25;
        const rooftop25yr = rooftopAnnual * 25 - rooftopCost;

        return {
          primary: { label: "25-Year Community Solar Savings", value: `$${formatNumber(community25yr, 2)}` },
          details: [
            { label: "Community Annual Savings", value: `$${formatNumber(communityAnnual, 2)}` },
            { label: "Rooftop Annual Savings", value: `$${formatNumber(rooftopAnnual, 2)}` },
            { label: "Rooftop Payback", value: `${formatNumber(rooftopPayback, 1)} years` },
            { label: "Rooftop 25-Year Net", value: `$${formatNumber(rooftop25yr, 2)}` },
          ],
          note: "Rooftop solar saves more long-term but requires upfront investment and suitable roof. Community solar has zero upfront cost.",
        };
      },
    },
  ],
  relatedSlugs: ["solar-payback-period-calculator", "net-metering-savings-calculator", "electricity-time-of-use-calculator"],
  faq: [
    {
      question: "What is community solar and how does it work?",
      answer:
        "Community solar allows you to subscribe to a portion of a shared solar farm. You receive credits on your electric bill for the energy your share produces, typically at a 5-20% discount. No panels are installed on your property, and you can usually cancel with 30-90 days notice.",
    },
    {
      question: "How much can I save with community solar?",
      answer:
        "Most community solar programs offer 5-20% savings on the portion of your bill covered by solar credits. For a $150/month bill with 90% offset and 15% discount, that's about $20/month or $240/year in savings with zero upfront cost. Savings grow as utility rates increase.",
    },
  ],
  formula:
    "Monthly Savings = Bill × Offset% × Discount%; Annual Savings = Monthly Savings × 12; Total Savings = Σ(Annual Savings × (1 + Rate Increase)^year) − Upfront Cost",
};
