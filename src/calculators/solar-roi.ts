import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarRoiCalculator: CalculatorDefinition = {
  slug: "solar-roi-calculator",
  title: "Solar Panel ROI Calculator",
  description:
    "Free solar panel ROI calculator. Estimate your return on investment, payback period, and lifetime savings from a residential solar installation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "solar roi",
    "solar return on investment",
    "solar payback",
    "solar panel cost",
    "solar investment",
    "solar savings return",
  ],
  variants: [
    {
      id: "roi",
      name: "Solar ROI Analysis",
      fields: [
        {
          name: "systemCost",
          label: "Total System Cost ($)",
          type: "number",
          placeholder: "e.g. 25000",
        },
        {
          name: "federalCredit",
          label: "Federal Tax Credit (%)",
          type: "number",
          placeholder: "e.g. 30",
          defaultValue: 30,
        },
        {
          name: "monthlyBill",
          label: "Current Monthly Electric Bill ($)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "solarOffset",
          label: "Solar Offset Percentage",
          type: "select",
          options: [
            { label: "50%", value: "0.5" },
            { label: "75%", value: "0.75" },
            { label: "90%", value: "0.9" },
            { label: "100%", value: "1.0" },
          ],
        },
        {
          name: "systemLife",
          label: "System Lifespan (years)",
          type: "number",
          placeholder: "e.g. 25",
          defaultValue: 25,
        },
        {
          name: "annualIncrease",
          label: "Annual Electricity Rate Increase (%)",
          type: "number",
          placeholder: "e.g. 3",
          defaultValue: 3,
        },
      ],
      calculate: (inputs) => {
        const systemCost = inputs.systemCost as number;
        const federalCredit = (inputs.federalCredit as number) || 30;
        const monthlyBill = inputs.monthlyBill as number;
        const solarOffset = parseFloat((inputs.solarOffset as string) || "0.9");
        const systemLife = (inputs.systemLife as number) || 25;
        const annualIncrease = (inputs.annualIncrease as number) || 3;
        if (!systemCost || !monthlyBill) return null;

        const netCost = systemCost * (1 - federalCredit / 100);
        const annualSavingsYear1 = monthlyBill * 12 * solarOffset;

        let totalSavings = 0;
        let paybackYear = 0;
        let cumulativeSavings = 0;
        for (let y = 1; y <= systemLife; y++) {
          const yearSavings = annualSavingsYear1 * Math.pow(1 + annualIncrease / 100, y - 1);
          totalSavings += yearSavings;
          if (cumulativeSavings < netCost && cumulativeSavings + yearSavings >= netCost) {
            paybackYear = y;
          }
          cumulativeSavings += yearSavings;
        }

        const netProfit = totalSavings - netCost;
        const roi = (netProfit / netCost) * 100;

        return {
          primary: {
            label: "Net System Cost",
            value: "$" + formatNumber(netCost, 0),
          },
          details: [
            { label: "Federal Tax Credit Savings", value: "$" + formatNumber(systemCost - netCost, 0) },
            { label: "Year 1 Savings", value: "$" + formatNumber(annualSavingsYear1, 0) },
            { label: "Payback Period", value: paybackYear > 0 ? paybackYear + " years" : systemLife + "+ years" },
            { label: "Lifetime Savings (" + systemLife + " yr)", value: "$" + formatNumber(totalSavings, 0) },
            { label: "Net Profit", value: "$" + formatNumber(netProfit, 0) },
            { label: "ROI", value: formatNumber(roi, 1) + "%" },
          ],
          note: "This estimate does not include state/local incentives, net metering credits, increased home value, or panel degradation (~0.5%/year). Actual ROI may vary.",
        };
      },
    },
  ],
  relatedSlugs: ["solar-panel-calculator", "solar-savings-calculator"],
  faq: [
    {
      question: "What is the average payback period for solar panels?",
      answer:
        "The average payback period for residential solar in the US is 7-12 years, depending on location, electricity rates, system size, and available incentives. After payback, all savings are pure profit.",
    },
    {
      question: "Do solar panels increase home value?",
      answer:
        "Studies show solar panels increase home value by approximately $15,000-$20,000 on average. Homes with solar sell faster and for about 4.1% more than comparable homes without solar.",
    },
  ],
  formula:
    "Net Cost = System Cost x (1 - Tax Credit %). Annual Savings = Monthly Bill x 12 x Offset %. Lifetime Savings = Sum of annual savings with rate increases. ROI = (Profit / Net Cost) x 100.",
};
