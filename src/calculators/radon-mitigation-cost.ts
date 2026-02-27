import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const radonMitigationCostCalculator: CalculatorDefinition = {
  slug: "radon-mitigation-cost",
  title: "Radon Mitigation Cost Estimator",
  description:
    "Estimate the cost of radon mitigation for your home based on foundation type, home size, and radon levels. Includes system type recommendations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "radon",
    "mitigation",
    "cost",
    "radon system",
    "home safety",
    "indoor air quality",
    "radon fan",
    "sub-slab depressurization",
    "health",
  ],
  variants: [
    {
      slug: "basic-estimate",
      title: "Basic Cost Estimate",
      fields: [
        {
          name: "foundationType",
          label: "Foundation Type",
          type: "select",
          options: [
            { label: "Slab-on-Grade", value: "slab" },
            { label: "Full Basement", value: "basement" },
            { label: "Crawlspace", value: "crawl" },
            { label: "Combination (Basement + Crawl)", value: "combo" },
          ],
        },
        {
          name: "homeSize",
          label: "Home Size (sq ft)",
          type: "number",
        },
        {
          name: "radonLevel",
          label: "Current Radon Level (pCi/L)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const foundation = inputs.foundationType as string;
        const sqft = parseFloat(inputs.homeSize as string);
        const radon = parseFloat(inputs.radonLevel as string);
        if (isNaN(sqft) || isNaN(radon))
          return { error: "Please enter valid home size and radon level." };

        let baseCost: number;
        let systemType: string;
        if (foundation === "slab") {
          baseCost = 1200;
          systemType = "Sub-slab depressurization (SSD)";
        } else if (foundation === "basement") {
          baseCost = 1000;
          systemType = "Sub-slab depressurization (SSD)";
        } else if (foundation === "crawl") {
          baseCost = 1500;
          systemType = "Sub-membrane depressurization (SMD)";
        } else {
          baseCost = 1800;
          systemType = "Combined SSD + SMD system";
        }

        const sizeFactor = sqft > 2000 ? 1 + (sqft - 2000) * 0.0001 : 1;
        const radonFactor = radon > 10 ? 1.15 : radon > 20 ? 1.3 : 1;
        const estimatedCost = baseCost * sizeFactor * radonFactor;
        const lowEstimate = estimatedCost * 0.8;
        const highEstimate = estimatedCost * 1.3;
        const annualEnergy = 100;
        const actionNeeded = radon >= 4 ? "Yes - EPA recommends action at 4+ pCi/L" : radon >= 2 ? "Consider - EPA suggests fixing at 2-4 pCi/L" : "No - below EPA action level";

        return {
          results: [
            { label: "Estimated Cost (low)", value: `$${formatNumber(lowEstimate)}` },
            { label: "Estimated Cost (mid)", value: `$${formatNumber(estimatedCost)}` },
            { label: "Estimated Cost (high)", value: `$${formatNumber(highEstimate)}` },
            { label: "Recommended System", value: systemType },
            { label: "Action Needed", value: actionNeeded },
            { label: "Annual Energy Cost", value: `$${formatNumber(annualEnergy)}` },
          ],
        };
      },
    },
    {
      slug: "detailed-breakdown",
      title: "Detailed Cost Breakdown",
      fields: [
        {
          name: "foundationType",
          label: "Foundation Type",
          type: "select",
          options: [
            { label: "Slab-on-Grade", value: "slab" },
            { label: "Full Basement", value: "basement" },
            { label: "Crawlspace", value: "crawl" },
          ],
        },
        {
          name: "suctionPoints",
          label: "Number of Suction Points",
          type: "select",
          options: [
            { label: "1 (standard, <2000 sqft)", value: "1" },
            { label: "2 (larger home or complex layout)", value: "2" },
            { label: "3+ (very large or multi-wing)", value: "3" },
          ],
        },
        {
          name: "exterior",
          label: "Pipe Routing",
          type: "select",
          options: [
            { label: "Interior (through attic)", value: "interior" },
            { label: "Exterior (along outside wall)", value: "exterior" },
          ],
        },
      ],
      calculate(inputs) {
        const foundation = inputs.foundationType as string;
        const points = parseFloat(inputs.suctionPoints as string);
        const routing = inputs.exterior as string;
        if (isNaN(points)) return { error: "Please select all options." };

        const fanCost = 250;
        const perPointCost = foundation === "crawl" ? 500 : 350;
        const pipingCost = routing === "exterior" ? 400 : 300;
        const electricalCost = 200;
        const sealingCost = foundation === "crawl" ? 600 : 200;
        const laborCost = 500 + (points - 1) * 200;
        const monitorCost = 150;

        const totalMaterials = fanCost + perPointCost * points + pipingCost + electricalCost + sealingCost + monitorCost;
        const totalCost = totalMaterials + laborCost;

        return {
          results: [
            { label: "Radon Fan", value: `$${formatNumber(fanCost)}` },
            { label: `Suction Points (x${points})`, value: `$${formatNumber(perPointCost * points)}` },
            { label: "PVC Piping & Routing", value: `$${formatNumber(pipingCost)}` },
            { label: "Electrical Work", value: `$${formatNumber(electricalCost)}` },
            { label: "Sealing & Prep", value: `$${formatNumber(sealingCost)}` },
            { label: "Radon Monitor", value: `$${formatNumber(monitorCost)}` },
            { label: "Labor", value: `$${formatNumber(laborCost)}` },
            { label: "Total Estimated Cost", value: `$${formatNumber(totalCost)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["asbestos-removal-cost", "mold-remediation-cost", "home-appraisal-value"],
  faq: [
    {
      question: "What radon level requires mitigation?",
      answer:
        "The EPA recommends taking action when radon levels are at or above 4 pCi/L and suggests considering mitigation for levels between 2-4 pCi/L. There is no known safe level of radon exposure. Radon is the second leading cause of lung cancer after smoking.",
    },
    {
      question: "How much does radon mitigation typically cost?",
      answer:
        "Most residential radon mitigation systems cost between $800 and $2,500, with the average being around $1,200. Factors that affect cost include foundation type, home size, number of suction points needed, and pipe routing options.",
    },
    {
      question: "How long does a radon mitigation system last?",
      answer:
        "The PVC piping and structural components last indefinitely. The radon fan typically lasts 5-10 years before needing replacement ($200-$400). Annual operating cost for the fan is typically $50-$150 in electricity. Systems should be retested every 2 years.",
    },
  ],
  formula:
    "Total Cost = Fan + Suction Points + Piping + Electrical + Sealing + Labor | Size factor applied for homes > 2,000 sqft | EPA action level = 4 pCi/L",
};
