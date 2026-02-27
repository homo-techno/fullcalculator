import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const moldRemediationCostCalculator: CalculatorDefinition = {
  slug: "mold-remediation-cost",
  title: "Mold Remediation Cost Calculator",
  description:
    "Estimate mold remediation costs based on affected area, mold type, and location. Includes inspection, removal, and reconstruction estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "mold",
    "remediation",
    "removal",
    "cost",
    "black mold",
    "mildew",
    "water damage",
    "indoor air quality",
    "health",
    "restoration",
  ],
  variants: [
    {
      slug: "area-estimate",
      title: "Cost by Affected Area",
      fields: [
        {
          name: "area",
          label: "Affected Area (sq ft)",
          type: "number",
        },
        {
          name: "location",
          label: "Mold Location",
          type: "select",
          options: [
            { label: "Surface only (walls, ceiling)", value: "surface" },
            { label: "Behind walls/drywall", value: "walls" },
            { label: "Crawlspace/Basement", value: "crawl" },
            { label: "HVAC/Ductwork", value: "hvac" },
            { label: "Attic", value: "attic" },
          ],
        },
        {
          name: "severity",
          label: "Severity Level",
          type: "select",
          options: [
            { label: "Minor (<10 sq ft visible)", value: "minor" },
            { label: "Moderate (10-100 sq ft)", value: "moderate" },
            { label: "Severe (>100 sq ft or toxic mold)", value: "severe" },
          ],
        },
      ],
      calculate(inputs) {
        const area = parseFloat(inputs.area as string);
        const location = inputs.location as string;
        const severity = inputs.severity as string;
        if (isNaN(area)) return { error: "Please enter a valid affected area." };

        const locationMultiplier: Record<string, number> = {
          surface: 1.0,
          walls: 1.8,
          crawl: 1.5,
          hvac: 2.0,
          attic: 1.3,
        };

        const severityMultiplier: Record<string, number> = {
          minor: 1.0,
          moderate: 1.4,
          severe: 2.0,
        };

        const baseRate = 15;
        const inspectionCost = 500;
        const containmentCost = area > 10 ? 800 : 200;
        const airTestingCost = 600;

        const remediationCost = area * baseRate * locationMultiplier[location] * severityMultiplier[severity];
        const reconstructionCost = location === "walls" ? area * 8 : location === "crawl" ? area * 5 : 0;
        const totalCost = remediationCost + inspectionCost + containmentCost + airTestingCost + reconstructionCost;
        const lowEstimate = totalCost * 0.75;
        const highEstimate = totalCost * 1.35;

        return {
          results: [
            { label: "Remediation Cost", value: `$${formatNumber(remediationCost)}` },
            { label: "Inspection/Testing", value: `$${formatNumber(inspectionCost)}` },
            { label: "Containment", value: `$${formatNumber(containmentCost)}` },
            { label: "Air Quality Testing", value: `$${formatNumber(airTestingCost)}` },
            { label: "Reconstruction", value: `$${formatNumber(reconstructionCost)}` },
            { label: "Total (low estimate)", value: `$${formatNumber(lowEstimate)}` },
            { label: "Total (mid estimate)", value: `$${formatNumber(totalCost)}` },
            { label: "Total (high estimate)", value: `$${formatNumber(highEstimate)}` },
          ],
        };
      },
    },
    {
      slug: "diy-vs-pro",
      title: "DIY vs. Professional Comparison",
      fields: [
        {
          name: "area",
          label: "Affected Area (sq ft)",
          type: "number",
        },
        {
          name: "moldType",
          label: "Suspected Mold Type",
          type: "select",
          options: [
            { label: "Common mold/mildew (Cladosporium, Penicillium)", value: "common" },
            { label: "Black mold (Stachybotrys)", value: "black" },
            { label: "Unknown - not yet tested", value: "unknown" },
          ],
        },
      ],
      calculate(inputs) {
        const area = parseFloat(inputs.area as string);
        const moldType = inputs.moldType as string;
        if (isNaN(area)) return { error: "Please enter a valid area." };

        const diyCost = area * 2 + 100;
        const proCost = area * 18 + 1500;
        const savings = proCost - diyCost;

        const diyViable = area <= 10 && moldType === "common";
        const recommendation = diyViable
          ? "DIY may be appropriate for small areas of common mold"
          : moldType === "black"
          ? "Professional remediation strongly recommended for toxic mold"
          : area > 10
          ? "Professional remediation recommended for areas >10 sq ft (EPA guideline)"
          : "Professional testing recommended before proceeding";

        return {
          results: [
            { label: "DIY Cost Estimate", value: `$${formatNumber(diyCost)}` },
            { label: "Professional Cost Estimate", value: `$${formatNumber(proCost)}` },
            { label: "Potential Savings (DIY)", value: `$${formatNumber(savings)}` },
            { label: "DIY Appropriate?", value: diyViable ? "Yes - with precautions" : "No" },
            { label: "Recommendation", value: recommendation },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["radon-mitigation-cost", "asbestos-removal-cost", "home-appraisal-value"],
  faq: [
    {
      question: "How much does mold remediation cost?",
      answer:
        "Mold remediation typically costs $1,500-$9,000 for a standard home. Small areas (<10 sqft) may cost $500-$1,500, while large-scale remediation of entire basements or crawlspaces can cost $10,000-$30,000. Costs depend on location, area, severity, and whether reconstruction is needed.",
    },
    {
      question: "Does homeowners insurance cover mold remediation?",
      answer:
        "Standard homeowners insurance typically covers mold remediation only if it results from a 'covered peril' like a burst pipe. Mold from gradual leaks, poor maintenance, or flooding (without flood insurance) is usually not covered. Some policies have specific mold coverage limits of $5,000-$10,000.",
    },
    {
      question: "When should I hire a professional for mold removal?",
      answer:
        "The EPA recommends professional remediation when the moldy area exceeds 10 square feet, when mold is in HVAC systems, when there is suspected toxic black mold (Stachybotrys), or when occupants have health concerns. Always get professional help for mold caused by sewage or contaminated water.",
    },
  ],
  formula:
    "Cost = Area x Base Rate x Location Multiplier x Severity Multiplier + Inspection + Containment + Air Testing + Reconstruction",
};
