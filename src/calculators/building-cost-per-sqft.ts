import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const buildingCostPerSqftCalculator: CalculatorDefinition = {
  slug: "building-cost-per-sqft-calculator",
  title: "Building Cost Per Sq Ft Calculator",
  description:
    "Free building cost per square foot calculator. Estimate new construction costs, renovation budgets, and addition costs by square footage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "building cost per sqft",
    "construction cost calculator",
    "cost to build per sq ft",
    "new construction cost",
    "home building cost",
  ],
  variants: [
    {
      id: "new-construction",
      name: "New Construction",
      description: "Estimate total cost to build a new home",
      fields: [
        {
          name: "squareFootage",
          label: "Planned Square Footage",
          type: "number",
          placeholder: "e.g. 2500",
          suffix: "sq ft",
          min: 0,
        },
        {
          name: "buildQuality",
          label: "Build Quality",
          type: "select",
          options: [
            { label: "Budget ($100-130/sq ft)", value: "budget" },
            { label: "Standard ($130-175/sq ft)", value: "standard" },
            { label: "Premium ($175-250/sq ft)", value: "premium" },
            { label: "Luxury ($250-400/sq ft)", value: "luxury" },
            { label: "Ultra-Luxury ($400+/sq ft)", value: "ultra" },
          ],
          defaultValue: "standard",
        },
        {
          name: "stories",
          label: "Number of Stories",
          type: "select",
          options: [
            { label: "1 story", value: "1" },
            { label: "2 stories", value: "2" },
            { label: "3 stories", value: "3" },
          ],
          defaultValue: "1",
        },
        {
          name: "garage",
          label: "Garage",
          type: "select",
          options: [
            { label: "No garage", value: "0" },
            { label: "1-car garage", value: "15000" },
            { label: "2-car garage", value: "25000" },
            { label: "3-car garage", value: "35000" },
          ],
          defaultValue: "25000",
        },
        {
          name: "basement",
          label: "Basement",
          type: "select",
          options: [
            { label: "No basement", value: "0" },
            { label: "Unfinished ($20/sq ft)", value: "20" },
            { label: "Finished ($40/sq ft)", value: "40" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const sqft = inputs.squareFootage as number;
        const quality = inputs.buildQuality as string;
        const stories = parseInt(inputs.stories as string) || 1;
        const garageCost = parseInt(inputs.garage as string) || 0;
        const basementPerSqFt = parseInt(inputs.basement as string) || 0;
        if (!sqft) return null;

        let costPerSqFt = 0;
        if (quality === "budget") costPerSqFt = 115;
        else if (quality === "standard") costPerSqFt = 152;
        else if (quality === "premium") costPerSqFt = 212;
        else if (quality === "luxury") costPerSqFt = 325;
        else costPerSqFt = 450;

        const storyMultiplier = stories === 1 ? 1 : stories === 2 ? 0.95 : 0.92;
        const adjustedCostPerSqFt = costPerSqFt * storyMultiplier;
        const buildingCost = adjustedCostPerSqFt * sqft;
        const basementArea = stories === 1 ? sqft : sqft / stories;
        const basementCost = basementPerSqFt > 0 ? basementArea * basementPerSqFt : 0;
        const totalCost = buildingCost + garageCost + basementCost;
        const effectiveCostPerSqFt = totalCost / sqft;

        return {
          primary: {
            label: "Estimated Total Build Cost",
            value: `$${formatNumber(totalCost)}`,
          },
          details: [
            { label: "Building cost", value: `$${formatNumber(buildingCost)}` },
            { label: "Garage cost", value: `$${formatNumber(garageCost)}` },
            { label: "Basement cost", value: `$${formatNumber(basementCost)}` },
            { label: "Effective cost per sq ft", value: `$${formatNumber(effectiveCostPerSqFt)}` },
            { label: "Base cost per sq ft", value: `$${formatNumber(adjustedCostPerSqFt)}` },
          ],
        };
      },
    },
    {
      id: "addition",
      name: "Home Addition",
      description: "Estimate cost of a home addition",
      fields: [
        {
          name: "additionSqFt",
          label: "Addition Square Footage",
          type: "number",
          placeholder: "e.g. 500",
          suffix: "sq ft",
          min: 0,
        },
        {
          name: "additionType",
          label: "Addition Type",
          type: "select",
          options: [
            { label: "Basic room ($100-150/sqft)", value: "basic" },
            { label: "Bedroom + Bath ($150-200/sqft)", value: "bedroom" },
            { label: "Kitchen extension ($200-300/sqft)", value: "kitchen" },
            { label: "Second story ($200-350/sqft)", value: "second" },
            { label: "Sunroom ($150-250/sqft)", value: "sunroom" },
          ],
          defaultValue: "bedroom",
        },
      ],
      calculate: (inputs) => {
        const sqft = inputs.additionSqFt as number;
        const type = inputs.additionType as string;
        if (!sqft) return null;

        let costPerSqFt = 0;
        if (type === "basic") costPerSqFt = 125;
        else if (type === "bedroom") costPerSqFt = 175;
        else if (type === "kitchen") costPerSqFt = 250;
        else if (type === "second") costPerSqFt = 275;
        else costPerSqFt = 200;

        const buildCost = sqft * costPerSqFt;
        const permitFees = buildCost * 0.03;
        const architectFees = buildCost * 0.08;
        const totalCost = buildCost + permitFees + architectFees;

        return {
          primary: {
            label: "Estimated Addition Cost",
            value: `$${formatNumber(totalCost)}`,
          },
          details: [
            { label: "Construction cost", value: `$${formatNumber(buildCost)}` },
            { label: "Permit fees (est. 3%)", value: `$${formatNumber(permitFees)}` },
            { label: "Architect fees (est. 8%)", value: `$${formatNumber(architectFees)}` },
            { label: "Cost per sq ft", value: `$${formatNumber(costPerSqFt)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cost-per-square-foot-calculator", "lot-size-calculator", "home-appreciation-rate-calculator"],
  faq: [
    {
      question: "How much does it cost to build a house per square foot?",
      answer:
        "New home construction costs range from $100-$400+ per square foot depending on quality, location, and materials. The national average is about $150/sq ft. Budget builds run $100-130/sq ft, while luxury homes can exceed $400/sq ft.",
    },
    {
      question: "What is not included in building cost per square foot?",
      answer:
        "Building cost per sq ft typically excludes land purchase, site preparation, permits, architectural fees, landscaping, driveway, and utility connections. These can add 20-40% to the total project cost.",
    },
    {
      question: "Is it cheaper to build up or out?",
      answer:
        "Building up (adding a second story) is generally 10-20% cheaper per square foot than building out, because you avoid foundation and roofing costs for the additional space. However, second-story additions require structural reinforcement of the existing first floor.",
    },
  ],
  formula: "Total Cost = Square Footage x Cost Per Sq Ft + Garage + Basement",
};
