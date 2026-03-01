import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const laundromatStartupCalculator: CalculatorDefinition = {
  slug: "laundromat-startup-calculator",
  title: "Laundromat Startup Cost Calculator",
  description: "Estimate the cost to open a laundromat including machines, build-out, and operating capital.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["laundromat startup cost", "laundromat investment", "coin laundry cost"],
  variants: [{
    id: "standard",
    name: "Laundromat Startup Cost",
    description: "Estimate the cost to open a laundromat including machines, build-out, and operating capital",
    fields: [
      { name: "washers", label: "Number of Washers", type: "number", suffix: "units", min: 5, max: 100, defaultValue: 20 },
      { name: "dryers", label: "Number of Dryers", type: "number", suffix: "units", min: 5, max: 100, defaultValue: 20 },
      { name: "sqft", label: "Lease Space", type: "number", suffix: "sq ft", min: 500, max: 5000, defaultValue: 2000 },
      { name: "buildout", label: "Build-Out Level", type: "select", options: [{value:"basic",label:"Basic Renovation"},{value:"mid",label:"Mid-Range"},{value:"premium",label:"Premium"}], defaultValue: "mid" },
    ],
    calculate: (inputs) => {
      const washers = inputs.washers as number;
      const dryers = inputs.dryers as number;
      const sqft = inputs.sqft as number;
      const buildout = inputs.buildout as string;
      if (!washers || !dryers || !sqft) return null;
      const washerCost = washers * 1500;
      const dryerCost = dryers * 1200;
      const buildRates: Record<string, number> = { basic: 30, mid: 60, premium: 100 };
      const buildCost = sqft * (buildRates[buildout] || 60);
      const plumbing = washers * 800;
      const electrical = (washers + dryers) * 400;
      const permits = 3000;
      const workingCapital = 15000;
      const total = washerCost + dryerCost + buildCost + plumbing + electrical + permits + workingCapital;
      return {
        primary: { label: "Estimated Startup Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Washers (" + washers + ")", value: "$" + formatNumber(washerCost) },
          { label: "Dryers (" + dryers + ")", value: "$" + formatNumber(dryerCost) },
          { label: "Build-Out", value: "$" + formatNumber(buildCost) },
          { label: "Plumbing", value: "$" + formatNumber(plumbing) },
          { label: "Electrical", value: "$" + formatNumber(electrical) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Working Capital", value: "$" + formatNumber(workingCapital) },
        ],
      };
    },
  }],
  relatedSlugs: ["vending-machine-roi-calculator", "car-wash-startup-calculator"],
  faq: [
    { question: "How much does it cost to open a laundromat?", answer: "A coin laundromat typically costs $100,000 to $500,000 to open depending on size, equipment quality, and location build-out requirements." },
    { question: "How many washers and dryers does a laundromat need?", answer: "A small laundromat may start with 15 to 20 of each, while a large facility can have 50 or more. The ratio of washers to dryers is usually close to 1:1." },
  ],
  formula: "Total = Washer Cost + Dryer Cost + Build-Out + Plumbing + Electrical + Permits + Working Capital",
};
