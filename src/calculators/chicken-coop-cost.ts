import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chickenCoopCostCalculator: CalculatorDefinition = {
  slug: "chicken-coop-cost-calculator",
  title: "Chicken Coop Cost Calculator",
  description:
    "Free chicken coop building cost calculator. Estimate the total cost to build a chicken coop including materials, run area, and accessories based on flock size.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "chicken coop cost",
    "build chicken coop cost",
    "chicken coop calculator",
    "backyard chickens cost",
    "coop building budget",
  ],
  variants: [
    {
      id: "coop-build",
      name: "Coop Building Cost",
      description: "Calculate cost to build a chicken coop from scratch",
      fields: [
        {
          name: "numChickens",
          label: "Number of Chickens",
          type: "number",
          placeholder: "e.g. 6",
          min: 2,
          max: 100,
        },
        {
          name: "coopStyle",
          label: "Coop Style",
          type: "select",
          options: [
            { label: "Basic (functional, no frills)", value: "basic" },
            { label: "Standard (good quality, some features)", value: "standard" },
            { label: "Premium (insulated, automatic door)", value: "premium" },
          ],
          defaultValue: "standard",
        },
        {
          name: "runIncluded",
          label: "Outdoor Run",
          type: "select",
          options: [
            { label: "No run (free range only)", value: "none" },
            { label: "Small run (10 sq ft/bird)", value: "small" },
            { label: "Large run (25 sq ft/bird)", value: "large" },
            { label: "Full enclosed run with hardware cloth", value: "full" },
          ],
          defaultValue: "small",
        },
        {
          name: "buildMethod",
          label: "Building Method",
          type: "select",
          options: [
            { label: "DIY (materials only)", value: "diy" },
            { label: "Kit (pre-cut)", value: "kit" },
            { label: "Contractor Built", value: "contractor" },
          ],
          defaultValue: "diy",
        },
      ],
      calculate: (inputs) => {
        const chickens = parseFloat(inputs.numChickens as string);
        const style = inputs.coopStyle as string;
        const run = inputs.runIncluded as string;
        const method = inputs.buildMethod as string;
        if (!chickens) return null;

        // Coop sizing: 4 sq ft per bird inside, min 16 sq ft
        const coopSqFt = Math.max(16, chickens * 4);

        // Base cost per sq ft by style
        const costPerSqFt: Record<string, number> = {
          basic: 15,
          standard: 25,
          premium: 45,
        };
        let coopCost = coopSqFt * (costPerSqFt[style] || 25);

        // Build method multiplier
        const methodMult: Record<string, number> = {
          diy: 1.0,
          kit: 1.4,
          contractor: 2.5,
        };
        coopCost *= methodMult[method] || 1.0;

        // Run costs
        const runSqFtPerBird: Record<string, number> = { none: 0, small: 10, large: 25, full: 25 };
        const runSqFt = chickens * (runSqFtPerBird[run] || 10);
        const runCostPerSqFt = run === "full" ? 8 : run === "none" ? 0 : 4;
        const runCost = runSqFt * runCostPerSqFt;

        // Accessories
        const nestBoxes = Math.ceil(chickens / 4); // 1 per 4 hens
        const nestBoxCost = nestBoxes * 15;
        const feederWaterer = chickens <= 12 ? 50 : 100;
        const beddingInitial = coopSqFt * 0.5;
        const lighting = style === "premium" ? 40 : 0;
        const autoDoor = style === "premium" ? 200 : 0;

        const accessoryCost = nestBoxCost + feederWaterer + beddingInitial + lighting + autoDoor;

        const totalCost = coopCost + runCost + accessoryCost;

        // Annual operating costs
        const feedPerChicken = 90; // $90/bird/year
        const beddingAnnual = coopSqFt * 2;
        const annualCost = feedPerChicken * chickens + beddingAnnual + 50; // + misc

        // Egg production estimate
        const eggsPerYear = chickens * 250; // average 250 eggs/year per hen
        const eggDozens = eggsPerYear / 12;
        const eggValue = eggDozens * 5; // $5/dozen for farm eggs

        return {
          primary: {
            label: "Total Build Cost",
            value: "$" + formatNumber(totalCost, 0),
          },
          details: [
            { label: "Coop Structure", value: "$" + formatNumber(coopCost, 0) + " (" + formatNumber(coopSqFt, 0) + " sq ft)" },
            { label: "Run/Fencing", value: "$" + formatNumber(runCost, 0) + " (" + formatNumber(runSqFt, 0) + " sq ft)" },
            { label: "Accessories", value: "$" + formatNumber(accessoryCost, 0) },
            { label: "Nest Boxes", value: formatNumber(nestBoxes, 0) },
            { label: "Cost Per Bird (build)", value: "$" + formatNumber(totalCost / chickens, 0) },
            { label: "Est. Annual Operating", value: "$" + formatNumber(annualCost, 0) + "/year" },
            { label: "Annual Egg Production", value: formatNumber(eggsPerYear, 0) + " eggs (" + formatNumber(eggDozens, 0) + " dozen)" },
            { label: "Annual Egg Value", value: "$" + formatNumber(eggValue, 0) + " at $5/dozen" },
          ],
          note: "Costs vary significantly by region and material prices. Reclaimed materials can reduce DIY costs by 30-50%. Don't forget predator-proofing hardware cloth on all openings.",
        };
      },
    },
    {
      id: "flock-economics",
      name: "Flock Economics",
      description: "Calculate the cost per egg and break-even timeline",
      fields: [
        {
          name: "numChickens",
          label: "Number of Laying Hens",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 100,
        },
        {
          name: "coopInvestment",
          label: "Total Coop Investment ($)",
          type: "number",
          placeholder: "e.g. 800",
          min: 100,
        },
        {
          name: "chickenCost",
          label: "Cost Per Chicken ($)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 50,
        },
        {
          name: "monthlyFeedCost",
          label: "Monthly Feed Cost ($)",
          type: "number",
          placeholder: "e.g. 30",
          min: 5,
        },
        {
          name: "eggPrice",
          label: "Local Egg Price ($/dozen)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 15,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const chickens = parseFloat(inputs.numChickens as string);
        const coopCost = parseFloat(inputs.coopInvestment as string);
        const chickenCost = parseFloat(inputs.chickenCost as string);
        const monthlyFeed = parseFloat(inputs.monthlyFeedCost as string);
        const eggPrice = parseFloat(inputs.eggPrice as string);
        if (!chickens || !coopCost || !chickenCost || !monthlyFeed || !eggPrice) return null;

        const totalChickenCost = chickens * chickenCost;
        const totalInvestment = coopCost + totalChickenCost;
        const annualFeed = monthlyFeed * 12;
        const annualMisc = 100; // bedding, supplements, etc.
        const annualOperating = annualFeed + annualMisc;

        // Egg production
        const eggsPerYear = chickens * 250;
        const dozensPerYear = eggsPerYear / 12;
        const eggValuePerYear = dozensPerYear * eggPrice;

        // Cost per egg (including amortized coop over 5 years)
        const amortizedCoop = totalInvestment / 5; // 5-year coop life
        const totalAnnualCost = annualOperating + amortizedCoop;
        const costPerEgg = totalAnnualCost / eggsPerYear;
        const costPerDozen = costPerEgg * 12;

        // Break-even (months)
        const monthlySavings = (eggValuePerYear - annualOperating) / 12;
        const breakEvenMonths = monthlySavings > 0 ? totalInvestment / monthlySavings : Infinity;

        const savingsPerYear = eggValuePerYear - totalAnnualCost;

        return {
          primary: {
            label: "Cost Per Dozen Eggs",
            value: "$" + formatNumber(costPerDozen, 2),
          },
          details: [
            { label: "Cost Per Egg", value: "$" + formatNumber(costPerEgg, 2) },
            { label: "Total Investment", value: "$" + formatNumber(totalInvestment, 0) },
            { label: "Annual Operating Cost", value: "$" + formatNumber(annualOperating, 0) },
            { label: "Annual Egg Value", value: "$" + formatNumber(eggValuePerYear, 0) },
            { label: "Annual Savings/Loss", value: (savingsPerYear >= 0 ? "$" : "-$") + formatNumber(Math.abs(savingsPerYear), 0) },
            { label: "Break-Even", value: breakEvenMonths < 120 ? formatNumber(breakEvenMonths, 0) + " months" : "N/A (not profitable)" },
            { label: "Eggs Per Year", value: formatNumber(eggsPerYear, 0) },
          ],
          note: "Backyard eggs have benefits beyond cost: fresher, better nutrition, knowing how hens are treated. Many people keep chickens for enjoyment as much as economics.",
        };
      },
    },
  ],
  relatedSlugs: ["beekeeping-cost-calculator", "break-even-calculator", "homestead-garden-size-calculator"],
  faq: [
    {
      question: "How much does it cost to build a chicken coop?",
      answer:
        "A DIY chicken coop for 4-6 birds costs $200-$600 in materials. Pre-built coops range from $400-$2,000+. The main costs are lumber, hardware cloth (not chicken wire for predator proofing), roofing, and hardware. Budget $50-100 per bird for the coop structure.",
    },
    {
      question: "How much space do chickens need?",
      answer:
        "Inside the coop, plan 4 square feet per standard-size chicken and 3 square feet for bantams. For the outdoor run, 10-25 square feet per bird is recommended. Free-range chickens need less run space but still need a secure coop for nighttime.",
    },
    {
      question: "Is raising chickens cheaper than buying eggs?",
      answer:
        "Usually not in the first 1-2 years due to startup costs. After that, if you compare to organic/farm eggs ($5-7/dozen), backyard eggs can cost $3-5/dozen including feed. The real savings come with larger flocks (10+) and when you factor in the value of pest control and compost.",
    },
  ],
  formula:
    "Coop Cost = Sq Ft × Cost/Sq Ft × Build Method Multiplier | Cost Per Egg = (Annual Operating + Amortized Coop) / Annual Eggs | Break-Even = Investment / Monthly Savings",
};
