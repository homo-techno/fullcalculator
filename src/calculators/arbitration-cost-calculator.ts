import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const arbitrationCostCalculator: CalculatorDefinition = {
  slug: "arbitration-cost-calculator",
  title: "Arbitration Cost Calculator",
  description: "Estimate arbitration costs including filing fees, arbitrator fees, and administrative costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["arbitration cost","arbitration fees","ADR cost","dispute resolution cost"],
  variants: [{
    id: "standard",
    name: "Arbitration Cost",
    description: "Estimate arbitration costs including filing fees, arbitrator fees, and administrative costs.",
    fields: [
      { name: "claimAmount", label: "Claim Amount ($)", type: "number", min: 0, max: 100000000, defaultValue: 200000 },
      { name: "arbitrators", label: "Number of Arbitrators", type: "select", options: [{ value: "1", label: "1 Arbitrator" }, { value: "3", label: "3 Arbitrators (Panel)" }], defaultValue: "1" },
      { name: "hearingDays", label: "Estimated Hearing Days", type: "number", min: 1, max: 60, defaultValue: 3 },
      { name: "provider", label: "Arbitration Provider", type: "select", options: [{ value: "1", label: "AAA" }, { value: "2", label: "JAMS" }, { value: "3", label: "Private" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const claimAmount = inputs.claimAmount as number;
    const arbitrators = parseInt(inputs.arbitrators as string);
    const hearingDays = inputs.hearingDays as number;
    const provider = parseInt(inputs.provider as string);
    const providerNames = ["", "AAA", "JAMS", "Private"];
    let filingFee = 0;
    if (claimAmount <= 75000) filingFee = 925;
    else if (claimAmount <= 150000) filingFee = 1850;
    else if (claimAmount <= 300000) filingFee = 2800;
    else if (claimAmount <= 500000) filingFee = 4350;
    else filingFee = 6200;
    const providerMult = [0, 1, 1.2, 0.8][provider] || 1;
    filingFee = filingFee * providerMult;
    const dailyArbitratorRate = 3000;
    const arbitratorFees = dailyArbitratorRate * hearingDays * arbitrators;
    const adminFee = claimAmount * 0.005;
    const totalCost = filingFee + arbitratorFees + adminFee;
    const perPartyCost = totalCost / 2;
    return {
      primary: { label: "Estimated Total Arbitration Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Provider", value: providerNames[provider] || "AAA" },
        { label: "Filing Fee", value: "$" + formatNumber(filingFee) },
        { label: "Arbitrator Fees", value: "$" + formatNumber(arbitratorFees) },
        { label: "Administrative Fee", value: "$" + formatNumber(adminFee) },
        { label: "Per-Party Share (50/50)", value: "$" + formatNumber(perPartyCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["mediation-cost-calculator","legal-fee-estimator-calculator","court-filing-fee-calculator"],
  faq: [
    { question: "Is arbitration cheaper than litigation?", answer: "Often yes for smaller disputes, but large complex cases can have comparable or higher costs due to arbitrator fees that would not exist in court." },
    { question: "How long does arbitration take?", answer: "Most commercial arbitrations conclude within 6 to 12 months, significantly faster than typical court litigation." },
    { question: "Is an arbitration decision final?", answer: "Generally yes. Arbitration awards have very limited grounds for appeal, which provides certainty but also limits recourse if the outcome is unfavorable." },
  ],
  formula: "Total Cost = Filing Fee + (Daily Rate x Days x Arbitrators) + Admin Fee",
};
