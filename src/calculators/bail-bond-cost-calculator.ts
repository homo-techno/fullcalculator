import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bailBondCostCalculator: CalculatorDefinition = {
  slug: "bail-bond-cost-calculator",
  title: "Bail Bond Cost Calculator",
  description: "Calculate bail bond premiums and total costs including fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bail bond cost","bail amount","bond premium","bail calculator"],
  variants: [{
    id: "standard",
    name: "Bail Bond Cost",
    description: "Calculate bail bond premiums and total costs including fees.",
    fields: [
      { name: "bailAmount", label: "Bail Amount Set by Court ($)", type: "number", min: 100, max: 10000000, defaultValue: 50000 },
      { name: "bondType", label: "Bond Type", type: "select", options: [{ value: "1", label: "Surety Bond (Bail Bondsman)" }, { value: "2", label: "Cash Bond (Full Amount)" }, { value: "3", label: "Property Bond" }], defaultValue: "1" },
      { name: "premiumRate", label: "Bond Premium Rate (%)", type: "number", min: 5, max: 15, defaultValue: 10 },
      { name: "collateral", label: "Collateral Value ($)", type: "number", min: 0, max: 10000000, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const bailAmount = inputs.bailAmount as number;
    const bondType = parseInt(inputs.bondType as string);
    const premiumRate = inputs.premiumRate as number;
    const collateral = inputs.collateral as number;
    const bondNames = ["", "Surety Bond", "Cash Bond", "Property Bond"];
    let outOfPocket = 0;
    let premium = 0;
    let additionalFees = 0;
    if (bondType === 1) {
      premium = bailAmount * (premiumRate / 100);
      additionalFees = 75;
      outOfPocket = premium + additionalFees;
    } else if (bondType === 2) {
      outOfPocket = bailAmount;
      premium = 0;
    } else {
      premium = 0;
      additionalFees = bailAmount * 0.02;
      outOfPocket = additionalFees;
    }
    const refundable = bondType === 2 ? bailAmount : collateral;
    return {
      primary: { label: "Total Out-of-Pocket Cost", value: "$" + formatNumber(outOfPocket) },
      details: [
        { label: "Bond Type", value: bondNames[bondType] || "Surety Bond" },
        { label: "Bail Amount", value: "$" + formatNumber(bailAmount) },
        { label: "Premium (Non-Refundable)", value: "$" + formatNumber(premium) },
        { label: "Additional Fees", value: "$" + formatNumber(additionalFees) },
        { label: "Refundable Upon Compliance", value: "$" + formatNumber(refundable) }
      ]
    };
  },
  }],
  relatedSlugs: ["legal-fee-estimator-calculator","court-filing-fee-calculator","legal-retainer-calculator"],
  faq: [
    { question: "How much does a bail bond cost?", answer: "A bail bond through a bondsman typically costs 10 percent of the bail amount as a non-refundable premium, though rates vary by state from 5 to 15 percent." },
    { question: "Do you get bail bond money back?", answer: "The premium paid to a bail bondsman is non-refundable. However, cash bonds posted directly with the court are returned when the case concludes if the defendant appears at all hearings." },
    { question: "What is collateral for a bail bond?", answer: "Collateral is property or assets pledged to secure a bail bond, such as real estate, vehicles, or jewelry. It is returned when the case is resolved." },
  ],
  formula: "Surety Bond Cost = Bail Amount x Premium Rate + Administrative Fees",
};
