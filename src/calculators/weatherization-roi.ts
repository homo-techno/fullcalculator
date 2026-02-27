import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weatherizationRoiCalculator: CalculatorDefinition = {
  slug: "weatherization-roi-calculator",
  title: "Home Weatherization ROI Calculator",
  description:
    "Calculate the return on investment for home weatherization improvements by climate zone. Estimate savings from insulation, air sealing, and weatherstripping upgrades.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "weatherization roi",
    "insulation roi",
    "air sealing savings",
    "home weatherization",
    "weatherstripping",
    "energy efficiency upgrade",
  ],
  variants: [
    {
      id: "byProject",
      name: "Project-Based ROI",
      description: "Calculate ROI for specific weatherization projects",
      fields: [
        { name: "annualEnergyBill", label: "Annual Energy Bill ($)", type: "number", placeholder: "e.g. 2400" },
        {
          name: "climateZone",
          label: "Climate Zone",
          type: "select",
          options: [
            { label: "Zone 1-2 (Hot: FL, TX, AZ)", value: "1.0" },
            { label: "Zone 3 (Warm: GA, NC, TN)", value: "1.15" },
            { label: "Zone 4 (Mixed: VA, MO, KS)", value: "1.30" },
            { label: "Zone 5 (Cool: IL, OH, PA)", value: "1.45" },
            { label: "Zone 6 (Cold: MN, WI, MI)", value: "1.60" },
            { label: "Zone 7 (Very Cold: MT, ND)", value: "1.75" },
          ],
          defaultValue: "1.30",
        },
        { name: "atticInsulationCost", label: "Attic Insulation Cost ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "wallInsulationCost", label: "Wall Insulation Cost ($)", type: "number", placeholder: "e.g. 4000" },
        { name: "airSealingCost", label: "Air Sealing Cost ($)", type: "number", placeholder: "e.g. 1500" },
        { name: "weatherstrippingCost", label: "Weatherstripping & Caulking ($)", type: "number", placeholder: "e.g. 300" },
        { name: "crawlspaceInsulation", label: "Crawlspace/Basement Insulation ($)", type: "number", placeholder: "e.g. 2500" },
        { name: "ductSealingCost", label: "Duct Sealing & Insulation ($)", type: "number", placeholder: "e.g. 800" },
      ],
      calculate: (inputs) => {
        const annualBill = parseFloat(inputs.annualEnergyBill as string);
        const climateFactor = parseFloat(inputs.climateZone as string);
        const attic = parseFloat(inputs.atticInsulationCost as string) || 0;
        const walls = parseFloat(inputs.wallInsulationCost as string) || 0;
        const airSeal = parseFloat(inputs.airSealingCost as string) || 0;
        const weather = parseFloat(inputs.weatherstrippingCost as string) || 0;
        const crawl = parseFloat(inputs.crawlspaceInsulation as string) || 0;
        const ducts = parseFloat(inputs.ductSealingCost as string) || 0;

        if (!annualBill) return null;

        const totalCost = attic + walls + airSeal + weather + crawl + ducts;
        if (totalCost === 0) return null;

        const savingsRates = {
          attic: 0.10,
          walls: 0.08,
          airSeal: 0.12,
          weather: 0.03,
          crawl: 0.05,
          ducts: 0.08,
        };

        const atticSavings = attic > 0 ? annualBill * savingsRates.attic * climateFactor : 0;
        const wallSavings = walls > 0 ? annualBill * savingsRates.walls * climateFactor : 0;
        const airSealSavings = airSeal > 0 ? annualBill * savingsRates.airSeal * climateFactor : 0;
        const weatherSavings = weather > 0 ? annualBill * savingsRates.weather * climateFactor : 0;
        const crawlSavings = crawl > 0 ? annualBill * savingsRates.crawl * climateFactor : 0;
        const ductSavings = ducts > 0 ? annualBill * savingsRates.ducts * climateFactor : 0;

        const totalAnnualSavings = atticSavings + wallSavings + airSealSavings + weatherSavings + crawlSavings + ductSavings;
        const taxCredit = Math.min(totalCost * 0.30, 1200);
        const netCost = totalCost - taxCredit;
        const payback = totalAnnualSavings > 0 ? netCost / totalAnnualSavings : 0;
        const roi10 = ((totalAnnualSavings * 10 - netCost) / netCost) * 100;

        return {
          primary: {
            label: "Payback Period",
            value: `${formatNumber(payback, 1)} years`,
          },
          details: [
            { label: "Total Project Cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "25C Tax Credit (30%)", value: `-$${formatNumber(taxCredit, 2)}` },
            { label: "Net Cost", value: `$${formatNumber(netCost, 2)}` },
            { label: "Annual Savings", value: `$${formatNumber(totalAnnualSavings, 2)}` },
            ...(atticSavings > 0 ? [{ label: "Attic Insulation Savings", value: `$${formatNumber(atticSavings, 2)}/yr` }] : []),
            ...(airSealSavings > 0 ? [{ label: "Air Sealing Savings", value: `$${formatNumber(airSealSavings, 2)}/yr` }] : []),
            ...(wallSavings > 0 ? [{ label: "Wall Insulation Savings", value: `$${formatNumber(wallSavings, 2)}/yr` }] : []),
            ...(ductSavings > 0 ? [{ label: "Duct Sealing Savings", value: `$${formatNumber(ductSavings, 2)}/yr` }] : []),
            { label: "10-Year ROI", value: `${formatNumber(roi10, 1)}%` },
            { label: "10-Year Net Savings", value: `$${formatNumber(totalAnnualSavings * 10 - netCost, 2)}` },
          ],
          note: `Climate zone multiplier of ${climateFactor}x applied. Colder climates see proportionally higher savings from weatherization.`,
        };
      },
    },
    {
      id: "quickEstimate",
      name: "Quick Savings Estimate",
      fields: [
        { name: "annualBill", label: "Annual Energy Bill ($)", type: "number", placeholder: "e.g. 2400" },
        {
          name: "homeCondition",
          label: "Current Home Condition",
          type: "select",
          options: [
            { label: "Poorly insulated / drafty", value: "0.35" },
            { label: "Average condition", value: "0.20" },
            { label: "Somewhat efficient", value: "0.10" },
          ],
          defaultValue: "0.20",
        },
        { name: "estimatedBudget", label: "Weatherization Budget ($)", type: "number", placeholder: "e.g. 5000" },
      ],
      calculate: (inputs) => {
        const annualBill = parseFloat(inputs.annualBill as string);
        const savingsPercent = parseFloat(inputs.homeCondition as string);
        const budget = parseFloat(inputs.estimatedBudget as string);

        if (!annualBill || !budget) return null;

        const savings = annualBill * savingsPercent;
        const credit = Math.min(budget * 0.30, 1200);
        const netBudget = budget - credit;
        const payback = savings > 0 ? netBudget / savings : 0;

        return {
          primary: { label: "Estimated Annual Savings", value: `$${formatNumber(savings, 2)}` },
          details: [
            { label: "Net Cost (after tax credit)", value: `$${formatNumber(netBudget, 2)}` },
            { label: "Payback Period", value: `${formatNumber(payback, 1)} years` },
            { label: "Savings as % of Bill", value: `${formatNumber(savingsPercent * 100, 0)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-energy-score-calculator", "energy-rebate-calculator", "heat-pump-savings-calculator"],
  faq: [
    {
      question: "What weatherization improvements have the best ROI?",
      answer:
        "Air sealing is typically the best ROI, costing $1,000-$2,000 with 10-15% energy savings and payback in 2-3 years. Attic insulation is second best with 3-5 year payback. Weatherstripping doors/windows is very cheap with immediate returns. Duct sealing is also cost-effective.",
    },
    {
      question: "How much can weatherization save on energy bills?",
      answer:
        "Comprehensive weatherization typically saves 20-35% on energy bills. Poorly insulated homes in cold climates see the biggest savings. The DOE estimates that air sealing and insulation together can save $200-$600/year for the average home.",
    },
  ],
  formula:
    "Annual Savings = Σ(Energy Bill × Savings Rate × Climate Factor) for each improvement; ROI = (Annual Savings × Years − Net Cost) / Net Cost × 100; Payback = Net Cost / Annual Savings",
};
