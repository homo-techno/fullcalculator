import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeEnergyScoreCalculator: CalculatorDefinition = {
  slug: "home-energy-score-calculator",
  title: "Home Energy Efficiency Score Calculator",
  description:
    "Estimate your home's energy efficiency score based on insulation, HVAC, windows, and appliances. Get personalized recommendations to improve efficiency and lower bills.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "home energy score",
    "energy efficiency",
    "home energy audit",
    "energy rating",
    "home efficiency score",
    "energy assessment",
  ],
  variants: [
    {
      id: "comprehensive",
      name: "Comprehensive Score",
      description: "Full home energy efficiency assessment",
      fields: [
        { name: "homeSize", label: "Home Size (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "yearBuilt", label: "Year Built", type: "number", placeholder: "e.g. 1990" },
        { name: "annualEnergyBill", label: "Annual Energy Bill ($)", type: "number", placeholder: "e.g. 2400" },
        {
          name: "insulation",
          label: "Insulation Quality",
          type: "select",
          options: [
            { label: "Excellent (R-49+ attic, R-21 walls)", value: "95" },
            { label: "Good (R-38 attic, R-13 walls)", value: "75" },
            { label: "Average (R-19 attic, R-11 walls)", value: "55" },
            { label: "Poor (minimal/no insulation)", value: "25" },
          ],
          defaultValue: "55",
        },
        {
          name: "windows",
          label: "Window Type",
          type: "select",
          options: [
            { label: "Triple-pane, Low-E", value: "95" },
            { label: "Double-pane, Low-E", value: "80" },
            { label: "Double-pane, standard", value: "60" },
            { label: "Single-pane", value: "25" },
          ],
          defaultValue: "60",
        },
        {
          name: "hvac",
          label: "HVAC System",
          type: "select",
          options: [
            { label: "Heat pump (SEER 18+)", value: "95" },
            { label: "High-efficiency (SEER 16+)", value: "80" },
            { label: "Standard efficiency (SEER 13-15)", value: "60" },
            { label: "Old system (SEER <13)", value: "30" },
          ],
          defaultValue: "60",
        },
        {
          name: "waterHeater",
          label: "Water Heater",
          type: "select",
          options: [
            { label: "Heat pump water heater", value: "95" },
            { label: "Tankless gas", value: "80" },
            { label: "Standard tank (gas)", value: "55" },
            { label: "Standard tank (electric)", value: "40" },
          ],
          defaultValue: "55",
        },
        {
          name: "airSealing",
          label: "Air Sealing",
          type: "select",
          options: [
            { label: "Tight (< 3 ACH50)", value: "95" },
            { label: "Average (3-7 ACH50)", value: "60" },
            { label: "Leaky (> 7 ACH50)", value: "25" },
          ],
          defaultValue: "60",
        },
        {
          name: "lighting",
          label: "Lighting",
          type: "select",
          options: [
            { label: "100% LED", value: "95" },
            { label: "Mostly LED", value: "80" },
            { label: "Mixed LED/CFL", value: "60" },
            { label: "Mostly incandescent", value: "20" },
          ],
          defaultValue: "60",
        },
      ],
      calculate: (inputs) => {
        const homeSize = parseFloat(inputs.homeSize as string);
        const yearBuilt = parseFloat(inputs.yearBuilt as string);
        const annualEnergyBill = parseFloat(inputs.annualEnergyBill as string);
        const insulation = parseFloat(inputs.insulation as string);
        const windows = parseFloat(inputs.windows as string);
        const hvac = parseFloat(inputs.hvac as string);
        const waterHeater = parseFloat(inputs.waterHeater as string);
        const airSealing = parseFloat(inputs.airSealing as string);
        const lighting = parseFloat(inputs.lighting as string);

        if (!homeSize || !yearBuilt || !annualEnergyBill) return null;

        const weights = { insulation: 0.25, hvac: 0.25, windows: 0.15, airSealing: 0.15, waterHeater: 0.10, lighting: 0.10 };
        const weightedScore =
          insulation * weights.insulation +
          hvac * weights.hvac +
          windows * weights.windows +
          airSealing * weights.airSealing +
          waterHeater * weights.waterHeater +
          lighting * weights.lighting;

        const ageBonus = yearBuilt >= 2015 ? 5 : yearBuilt >= 2000 ? 2 : yearBuilt >= 1980 ? 0 : -5;
        const finalScore = Math.min(100, Math.max(1, Math.round(weightedScore + ageBonus)));
        const rating = finalScore >= 80 ? "A" : finalScore >= 65 ? "B" : finalScore >= 50 ? "C" : finalScore >= 35 ? "D" : "F";

        const costPerSqft = annualEnergyBill / homeSize;
        const efficientCost = homeSize * 0.80;
        const potentialSavings = Math.max(0, annualEnergyBill - efficientCost);
        const improvementPercent = (potentialSavings / annualEnergyBill) * 100;

        const lowestCategory = Object.entries({ insulation, windows, hvac, waterHeater, airSealing, lighting })
          .sort(([, a], [, b]) => a - b)[0][0];

        return {
          primary: {
            label: "Home Energy Score",
            value: `${formatNumber(finalScore, 0)} / 100 (${rating})`,
          },
          details: [
            { label: "Insulation Score", value: `${formatNumber(insulation, 0)}/100` },
            { label: "HVAC Score", value: `${formatNumber(hvac, 0)}/100` },
            { label: "Windows Score", value: `${formatNumber(windows, 0)}/100` },
            { label: "Air Sealing Score", value: `${formatNumber(airSealing, 0)}/100` },
            { label: "Water Heater Score", value: `${formatNumber(waterHeater, 0)}/100` },
            { label: "Lighting Score", value: `${formatNumber(lighting, 0)}/100` },
            { label: "Energy Cost per Sq Ft", value: `$${formatNumber(costPerSqft, 2)}` },
            { label: "Potential Annual Savings", value: `$${formatNumber(potentialSavings, 2)}` },
            { label: "Improvement Potential", value: `${formatNumber(improvementPercent, 1)}%` },
          ],
          note: `Biggest opportunity: Upgrade your ${lowestCategory}. An efficient home of this size typically costs ~$${formatNumber(efficientCost, 0)}/year to operate.`,
        };
      },
    },
    {
      id: "quick",
      name: "Quick Assessment",
      fields: [
        { name: "monthlyBill", label: "Monthly Energy Bill ($)", type: "number", placeholder: "e.g. 200" },
        { name: "homeSize", label: "Home Size (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "yearBuilt", label: "Year Built", type: "number", placeholder: "e.g. 1990" },
      ],
      calculate: (inputs) => {
        const monthlyBill = parseFloat(inputs.monthlyBill as string);
        const homeSize = parseFloat(inputs.homeSize as string);
        const yearBuilt = parseFloat(inputs.yearBuilt as string);

        if (!monthlyBill || !homeSize || !yearBuilt) return null;

        const annualCostPerSqft = (monthlyBill * 12) / homeSize;
        const benchmarkCost = 0.80;
        const efficiencyRatio = benchmarkCost / annualCostPerSqft;
        const ageAdj = yearBuilt >= 2010 ? 10 : yearBuilt >= 1990 ? 0 : -10;
        const score = Math.min(100, Math.max(1, Math.round(efficiencyRatio * 70 + ageAdj)));
        const rating = score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : score >= 35 ? "D" : "F";

        return {
          primary: { label: "Estimated Energy Score", value: `${formatNumber(score, 0)} / 100 (${rating})` },
          details: [
            { label: "Annual Cost per Sq Ft", value: `$${formatNumber(annualCostPerSqft, 2)}` },
            { label: "Efficient Benchmark", value: `$${formatNumber(benchmarkCost, 2)}/sq ft` },
            { label: "Annual Energy Cost", value: `$${formatNumber(monthlyBill * 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["weatherization-roi-calculator", "smart-thermostat-savings-calculator", "heat-pump-savings-calculator"],
  faq: [
    {
      question: "What is a good home energy score?",
      answer:
        "A score of 80+ (A rating) indicates an efficient home. The DOE Home Energy Score uses a 1-10 scale, but our 1-100 scale provides more granularity. Scores below 50 suggest significant efficiency improvements are possible. The average US home scores around 50-60.",
    },
    {
      question: "How can I improve my home energy score?",
      answer:
        "The biggest impacts come from: (1) Adding insulation, especially in the attic (R-49+), (2) Air sealing gaps and cracks, (3) Upgrading to a heat pump HVAC system, (4) Installing double or triple-pane windows, and (5) Switching to LED lighting. Start with insulation and air sealing for the best ROI.",
    },
  ],
  formula:
    "Score = Σ(Component Score × Weight) + Age Adjustment; Weights: Insulation 25%, HVAC 25%, Windows 15%, Air Sealing 15%, Water Heater 10%, Lighting 10%",
};
