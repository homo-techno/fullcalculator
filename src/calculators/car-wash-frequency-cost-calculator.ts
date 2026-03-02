import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carWashFrequencyCostCalculator: CalculatorDefinition = {
  slug: "car-wash-frequency-cost-calculator",
  title: "Car Wash Frequency Cost Calculator",
  description: "Calculate your annual car wash spending based on wash type, frequency, and optional membership versus pay-per-wash comparison.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car wash cost","car wash frequency","car wash membership","auto wash budget"],
  variants: [{
    id: "standard",
    name: "Car Wash Frequency Cost",
    description: "Calculate your annual car wash spending based on wash type, frequency, and optional membership versus pay-per-wash comparison.",
    fields: [
      { name: "washType", label: "Wash Type", type: "select", options: [{ value: "1", label: "Basic ($8)" }, { value: "2", label: "Standard ($15)" }, { value: "3", label: "Premium ($25)" }, { value: "4", label: "Full Detail ($75)" }], defaultValue: "2" },
      { name: "washesPerMonth", label: "Washes Per Month", type: "number", min: 1, max: 12, defaultValue: 2 },
      { name: "membershipCost", label: "Monthly Membership Cost ($)", type: "number", min: 0, max: 200, defaultValue: 30 },
      { name: "tipPercent", label: "Tip Percentage (%)", type: "number", min: 0, max: 30, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const washType = parseInt(inputs.washType as string);
    const washesPerMonth = inputs.washesPerMonth as number;
    const membership = inputs.membershipCost as number;
    const tipPct = inputs.tipPercent as number / 100;
    const washPrices = { 1: 8, 2: 15, 3: 25, 4: 75 };
    const pricePerWash = washPrices[washType] || 15;
    const monthlyPayPerWash = washesPerMonth * pricePerWash * (1 + tipPct);
    const annualPayPerWash = monthlyPayPerWash * 12;
    const annualMembership = membership * 12;
    const savings = annualPayPerWash - annualMembership;
    return {
      primary: { label: "Annual Pay-Per-Wash Cost", value: "$" + formatNumber(Math.round(annualPayPerWash)) },
      details: [
        { label: "Monthly Pay-Per-Wash", value: "$" + formatNumber(Math.round(monthlyPayPerWash * 100) / 100) },
        { label: "Annual Membership Cost", value: "$" + formatNumber(annualMembership) },
        { label: "Annual Savings with Membership", value: savings > 0 ? "$" + formatNumber(Math.round(savings)) : "-$" + formatNumber(Math.round(Math.abs(savings))) },
        { label: "Recommendation", value: savings > 0 ? "Membership saves money" : "Pay-per-wash is cheaper" }
      ]
    };
  },
  }],
  relatedSlugs: ["car-detailing-cost-calculator","car-wax-application-calculator"],
  faq: [
    { question: "How often should I wash my car?", answer: "Most experts recommend washing your car every two weeks. If you drive in harsh conditions such as salt roads, dirt roads, or areas with heavy pollen, consider washing weekly." },
    { question: "Is a car wash membership worth it?", answer: "If you wash your car two or more times per month, an unlimited wash membership often saves 30 to 50 percent compared to paying per wash." },
    { question: "Does frequent washing damage paint?", answer: "Touchless and hand washes are safest. Automatic brush washes can create micro scratches over time. Using a quality wax or sealant provides additional protection." },
  ],
  formula: "Annual Pay-Per-Wash = Washes/Month x Price x (1 + Tip%) x 12
Annual Membership = Monthly Membership x 12
Savings = Annual Pay-Per-Wash - Annual Membership",
};
