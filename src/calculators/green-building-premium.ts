import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const greenBuildingPremiumCalculator: CalculatorDefinition = {
  slug: "green-building-premium-calculator",
  title: "Green Building Cost Premium & Resale Value Calculator",
  description:
    "Calculate the cost premium of green building features and their impact on resale value. Estimate ROI for LEED, Energy Star, net-zero, and passive house certifications.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "green building premium",
    "leed home cost",
    "energy star home",
    "net zero home",
    "green building resale",
    "sustainable building roi",
  ],
  variants: [
    {
      id: "premiumAnalysis",
      name: "Green Premium Analysis",
      description: "Calculate cost premium and resale value impact",
      fields: [
        { name: "homeValue", label: "Base Home Value ($)", type: "number", placeholder: "e.g. 400000" },
        { name: "constructionCost", label: "Base Construction/Renovation Cost ($)", type: "number", placeholder: "e.g. 300000" },
        {
          name: "certification",
          label: "Green Certification Target",
          type: "select",
          options: [
            { label: "Energy Star Certified (2-5% premium)", value: "energystar" },
            { label: "LEED Silver (3-5% premium)", value: "leed_silver" },
            { label: "LEED Gold (5-8% premium)", value: "leed_gold" },
            { label: "LEED Platinum (8-12% premium)", value: "leed_platinum" },
            { label: "Passive House (10-15% premium)", value: "passive" },
            { label: "Net Zero Energy (15-25% premium)", value: "netzero" },
          ],
          defaultValue: "energystar",
        },
        { name: "currentAnnualEnergy", label: "Standard Home Annual Energy Cost ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "holdingPeriod", label: "Expected Holding Period (years)", type: "number", placeholder: "e.g. 10" },
        { name: "homeAppreciation", label: "Annual Home Appreciation (%)", type: "number", placeholder: "e.g. 3", step: 0.1 },
        { name: "energyInflation", label: "Annual Energy Cost Increase (%)", type: "number", placeholder: "e.g. 4", step: 0.1 },
      ],
      calculate: (inputs) => {
        const homeValue = parseFloat(inputs.homeValue as string);
        const constructionCost = parseFloat(inputs.constructionCost as string);
        const certification = inputs.certification as string;
        const annualEnergy = parseFloat(inputs.currentAnnualEnergy as string);
        const holdingPeriod = parseFloat(inputs.holdingPeriod as string);
        const appreciation = parseFloat(inputs.homeAppreciation as string) || 3;
        const energyInflation = parseFloat(inputs.energyInflation as string) || 4;

        if (!homeValue || !constructionCost || !annualEnergy || !holdingPeriod) return null;

        const premiums: Record<string, { costPremium: number; resalePremium: number; energySavings: number }> = {
          energystar: { costPremium: 0.035, resalePremium: 0.035, energySavings: 0.30 },
          leed_silver: { costPremium: 0.04, resalePremium: 0.05, energySavings: 0.35 },
          leed_gold: { costPremium: 0.065, resalePremium: 0.08, energySavings: 0.45 },
          leed_platinum: { costPremium: 0.10, resalePremium: 0.12, energySavings: 0.55 },
          passive: { costPremium: 0.125, resalePremium: 0.10, energySavings: 0.75 },
          netzero: { costPremium: 0.20, resalePremium: 0.15, energySavings: 0.95 },
        };

        const cert = premiums[certification] || premiums.energystar;
        const greenPremiumCost = constructionCost * cert.costPremium;
        const resaleBonus = homeValue * cert.resalePremium;

        let totalEnergySavings = 0;
        for (let y = 0; y < holdingPeriod; y++) {
          const yearCost = annualEnergy * Math.pow(1 + energyInflation / 100, y);
          totalEnergySavings += yearCost * cert.energySavings;
        }

        const futureHome = homeValue * Math.pow(1 + appreciation / 100, holdingPeriod);
        const futureGreenHome = (homeValue + resaleBonus) * Math.pow(1 + appreciation / 100, holdingPeriod);
        const resaleValueGain = futureGreenHome - futureHome;

        const totalReturn = totalEnergySavings + resaleValueGain;
        const netRoi = ((totalReturn - greenPremiumCost) / greenPremiumCost) * 100;
        const annualEnergySavingsYear1 = annualEnergy * cert.energySavings;
        const monthlyEnergySavings = annualEnergySavingsYear1 / 12;

        return {
          primary: {
            label: `${holdingPeriod}-Year ROI`,
            value: `${formatNumber(netRoi, 1)}%`,
          },
          details: [
            { label: "Green Premium Cost", value: `$${formatNumber(greenPremiumCost, 2)}` },
            { label: "Construction Premium %", value: `${formatNumber(cert.costPremium * 100, 1)}%` },
            { label: "Energy Savings (Year 1)", value: `$${formatNumber(annualEnergySavingsYear1, 2)}` },
            { label: "Monthly Energy Savings", value: `$${formatNumber(monthlyEnergySavings, 2)}` },
            { label: `${holdingPeriod}-Year Energy Savings`, value: `$${formatNumber(totalEnergySavings, 2)}` },
            { label: "Resale Value Premium", value: `${formatNumber(cert.resalePremium * 100, 1)}%` },
            { label: "Future Resale Bonus", value: `$${formatNumber(resaleValueGain, 2)}` },
            { label: "Total Return on Green Premium", value: `$${formatNumber(totalReturn, 2)}` },
            { label: "Net Profit", value: `$${formatNumber(totalReturn - greenPremiumCost, 2)}` },
          ],
          note: `${certification === "netzero" ? "Net-zero homes produce as much energy as they consume, virtually eliminating energy bills." : `Green-certified homes sell for ${formatNumber(cert.resalePremium * 100, 0)}% more on average according to multiple studies.`}`,
        };
      },
    },
    {
      id: "resaleOnly",
      name: "Resale Value Impact",
      fields: [
        { name: "homeValue", label: "Current Home Value ($)", type: "number", placeholder: "e.g. 400000" },
        { name: "greenInvestment", label: "Green Upgrade Investment ($)", type: "number", placeholder: "e.g. 30000" },
        {
          name: "certLevel",
          label: "Certification Level",
          type: "select",
          options: [
            { label: "Energy Star (3.5% premium)", value: "0.035" },
            { label: "LEED Certified (5% premium)", value: "0.05" },
            { label: "High Performance (8% premium)", value: "0.08" },
            { label: "Net Zero (15% premium)", value: "0.15" },
          ],
          defaultValue: "0.05",
        },
      ],
      calculate: (inputs) => {
        const homeValue = parseFloat(inputs.homeValue as string);
        const investment = parseFloat(inputs.greenInvestment as string);
        const premium = parseFloat(inputs.certLevel as string);

        if (!homeValue || !investment) return null;

        const valueIncrease = homeValue * premium;
        const roi = ((valueIncrease - investment) / investment) * 100;

        return {
          primary: { label: "Estimated Value Increase", value: `$${formatNumber(valueIncrease, 2)}` },
          details: [
            { label: "Green Investment", value: `$${formatNumber(investment, 2)}` },
            { label: "Net Return", value: `$${formatNumber(valueIncrease - investment, 2)}` },
            { label: "ROI", value: `${formatNumber(roi, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-energy-score-calculator", "solar-payback-period-calculator", "home-electrification-calculator"],
  faq: [
    {
      question: "Do green homes really sell for more?",
      answer:
        "Yes. Multiple studies show green-certified homes sell for 3-15% more than comparable conventional homes. A National Association of Realtors study found Energy Star homes sell for 3-5% more, while LEED-certified homes can command 8-12% premiums. The exact premium varies by market and certification level.",
    },
    {
      question: "How much more does it cost to build green?",
      answer:
        "Building to green standards adds 2-15% to construction costs depending on the certification level. Energy Star adds 2-5%, LEED Silver 3-5%, LEED Platinum 8-12%, and Passive House 10-15%. Net-zero homes cost 15-25% more but have near-zero energy bills. Many costs are recovered through energy savings and higher resale value.",
    },
    {
      question: "What green features provide the best ROI?",
      answer:
        "The best ROI comes from: (1) Air sealing and insulation (lowest cost, immediate savings), (2) Energy Star windows, (3) Heat pump HVAC, (4) Solar panels, and (5) Smart home energy management. These features often pay for themselves in 3-7 years while adding to home value.",
    },
  ],
  formula:
    "Green Premium = Construction Cost × Premium%; Total Return = Σ(Annual Energy Savings × (1+Inflation)^yr) + (Home Value × Resale Premium% × (1+Appreciation)^years); ROI = (Total Return − Premium Cost) / Premium Cost × 100",
};
