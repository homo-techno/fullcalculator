import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const holidayShippingDeadlineCalculator: CalculatorDefinition = {
  slug: "holiday-shipping-deadline-calculator",
  title: "Holiday Shipping Deadline Calculator",
  description:
    "Calculate the last day to ship packages for holiday delivery. Estimate shipping costs and compare carriers by speed and price for holiday gifts.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "holiday shipping",
    "shipping deadline",
    "christmas shipping",
    "package delivery",
    "shipping calculator",
  ],
  variants: [
    {
      id: "deadlineCalc",
      name: "Shipping Deadline",
      description: "Find the last day to ship based on delivery speed",
      fields: [
        { name: "daysUntilHoliday", label: "Days Until Holiday", type: "number", placeholder: "e.g. 14", defaultValue: 14 },
        { name: "shippingSpeed", label: "Shipping Speed", type: "select", options: [
          { label: "Ground (5-7 business days)", value: "ground" },
          { label: "Standard (3-5 business days)", value: "standard" },
          { label: "Expedited (2-3 business days)", value: "expedited" },
          { label: "Overnight (1 business day)", value: "overnight" },
        ], defaultValue: "standard" },
        { name: "bufferDays", label: "Buffer Days (safety margin)", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "numPackages", label: "Number of Packages", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const daysUntilHoliday = parseFloat(inputs.daysUntilHoliday as string) || 0;
        const shippingSpeed = inputs.shippingSpeed as string;
        const bufferDays = parseFloat(inputs.bufferDays as string) || 0;
        const numPackages = parseFloat(inputs.numPackages as string) || 1;

        const transitDays: Record<string, number> = {
          ground: 7,
          standard: 5,
          expedited: 3,
          overnight: 1,
        };

        const avgCostPerPackage: Record<string, number> = {
          ground: 8,
          standard: 12,
          expedited: 25,
          overnight: 45,
        };

        const transit = transitDays[shippingSpeed] || 5;
        const daysToShipBy = daysUntilHoliday - transit - bufferDays;
        const costPerPkg = avgCostPerPackage[shippingSpeed] || 12;
        const totalCost = costPerPkg * numPackages;

        const canMakeIt = daysToShipBy >= 0;

        return {
          primary: {
            label: canMakeIt ? "Ship Within" : "Deadline Passed!",
            value: canMakeIt ? `${formatNumber(daysToShipBy, 0)} days` : "Need faster shipping",
          },
          details: [
            { label: "Transit Time", value: `${formatNumber(transit, 0)} business days` },
            { label: "Buffer Days", value: formatNumber(bufferDays, 0) },
            { label: "Days Until Holiday", value: formatNumber(daysUntilHoliday, 0) },
            { label: "Est. Cost per Package", value: `$${formatNumber(costPerPkg, 2)}` },
            { label: "Total Shipping Cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Number of Packages", value: formatNumber(numPackages, 0) },
          ],
          note: canMakeIt
            ? `You have ${formatNumber(daysToShipBy, 0)} day(s) to get packages shipped.`
            : "Consider upgrading to a faster shipping option or buying locally.",
        };
      },
    },
    {
      id: "costComparison",
      name: "Shipping Cost Comparison",
      description: "Compare shipping costs across different speeds",
      fields: [
        { name: "packageWeight", label: "Package Weight (lbs)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "distance", label: "Shipping Distance", type: "select", options: [
          { label: "Local (same state)", value: "local" },
          { label: "Regional (neighboring states)", value: "regional" },
          { label: "Cross-country", value: "cross" },
          { label: "International", value: "international" },
        ], defaultValue: "regional" },
        { name: "numPackages", label: "Number of Packages", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
        { name: "needInsurance", label: "Need Insurance?", type: "select", options: [
          { label: "No insurance", value: "no" },
          { label: "Basic ($50 coverage)", value: "basic" },
          { label: "Enhanced ($200 coverage)", value: "enhanced" },
        ], defaultValue: "no" },
      ],
      calculate: (inputs) => {
        const packageWeight = parseFloat(inputs.packageWeight as string) || 1;
        const distance = inputs.distance as string;
        const numPackages = parseFloat(inputs.numPackages as string) || 1;
        const needInsurance = inputs.needInsurance as string;

        const distMultiplier: Record<string, number> = { local: 0.7, regional: 1.0, cross: 1.4, international: 2.5 };
        const dm = distMultiplier[distance] || 1.0;
        const weightFactor = 1 + (packageWeight - 1) * 0.3;

        const groundBase = 8 * dm * weightFactor;
        const standardBase = 12 * dm * weightFactor;
        const expeditedBase = 25 * dm * weightFactor;
        const overnightBase = 45 * dm * weightFactor;

        const insuranceCost: Record<string, number> = { no: 0, basic: 2.5, enhanced: 6 };
        const ins = insuranceCost[needInsurance] || 0;

        const ground = (groundBase + ins) * numPackages;
        const standard = (standardBase + ins) * numPackages;
        const expedited = (expeditedBase + ins) * numPackages;
        const overnight = (overnightBase + ins) * numPackages;

        return {
          primary: { label: "Ground Shipping (cheapest)", value: `$${formatNumber(ground, 2)}` },
          details: [
            { label: "Ground (5-7 days)", value: `$${formatNumber(ground, 2)}` },
            { label: "Standard (3-5 days)", value: `$${formatNumber(standard, 2)}` },
            { label: "Expedited (2-3 days)", value: `$${formatNumber(expedited, 2)}` },
            { label: "Overnight (1 day)", value: `$${formatNumber(overnight, 2)}` },
            { label: "Insurance per Package", value: `$${formatNumber(ins, 2)}` },
            { label: "Savings: Ground vs Overnight", value: `$${formatNumber(overnight - ground, 2)}` },
          ],
        };
      },
    },
    {
      id: "bulkShipping",
      name: "Bulk Shipping Budget",
      description: "Calculate total cost for shipping multiple holiday gifts",
      fields: [
        { name: "numLocal", label: "Packages - Local", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "numRegional", label: "Packages - Regional", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "numCrossCountry", label: "Packages - Cross-Country", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "shippingSpeed", label: "Shipping Speed", type: "select", options: [
          { label: "Ground", value: "ground" },
          { label: "Standard", value: "standard" },
          { label: "Expedited", value: "expedited" },
        ], defaultValue: "standard" },
        { name: "avgPackagingCost", label: "Avg Packaging Cost per Box ($)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const numLocal = parseFloat(inputs.numLocal as string) || 0;
        const numRegional = parseFloat(inputs.numRegional as string) || 0;
        const numCrossCountry = parseFloat(inputs.numCrossCountry as string) || 0;
        const shippingSpeed = inputs.shippingSpeed as string;
        const avgPackagingCost = parseFloat(inputs.avgPackagingCost as string) || 0;

        const baseCosts: Record<string, Record<string, number>> = {
          ground: { local: 6, regional: 8, cross: 12 },
          standard: { local: 9, regional: 12, cross: 17 },
          expedited: { local: 18, regional: 25, cross: 35 },
        };

        const costs = baseCosts[shippingSpeed] || baseCosts.standard;
        const localCost = numLocal * costs.local;
        const regionalCost = numRegional * costs.regional;
        const crossCost = numCrossCountry * costs.cross;
        const totalPackages = numLocal + numRegional + numCrossCountry;
        const packagingTotal = totalPackages * avgPackagingCost;
        const shippingTotal = localCost + regionalCost + crossCost;
        const grandTotal = shippingTotal + packagingTotal;

        return {
          primary: { label: "Total Shipping Budget", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Local Packages", value: `${formatNumber(numLocal, 0)} @ $${formatNumber(costs.local, 2)} = $${formatNumber(localCost, 2)}` },
            { label: "Regional Packages", value: `${formatNumber(numRegional, 0)} @ $${formatNumber(costs.regional, 2)} = $${formatNumber(regionalCost, 2)}` },
            { label: "Cross-Country Packages", value: `${formatNumber(numCrossCountry, 0)} @ $${formatNumber(costs.cross, 2)} = $${formatNumber(crossCost, 2)}` },
            { label: "Packaging Costs", value: `$${formatNumber(packagingTotal, 2)}` },
            { label: "Total Packages", value: formatNumber(totalPackages, 0) },
            { label: "Avg Cost per Package", value: totalPackages > 0 ? `$${formatNumber(grandTotal / totalPackages, 2)}` : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["christmas-budget-calculator", "budget-calculator", "shipping-calculator"],
  faq: [
    {
      question: "What are the typical holiday shipping deadlines?",
      answer:
        "For Christmas delivery: USPS Ground typically has a mid-December deadline (around Dec 14-16), Priority Mail around Dec 19-20, and Priority Express around Dec 21-22. UPS and FedEx have similar timelines. Always ship earlier than the deadline for safety.",
    },
    {
      question: "How can I save on holiday shipping?",
      answer:
        "Ship early to use cheaper ground rates, compare carrier prices, use flat-rate boxes for heavy items, take advantage of free shipping promotions from retailers, and combine orders. USPS is often cheapest for packages under 2 lbs.",
    },
  ],
  formula:
    "Ship-By Date = Holiday Date - Transit Days - Buffer Days; Total Cost = Packages x (Shipping Rate + Insurance + Packaging)",
};
