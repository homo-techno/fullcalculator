import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pickleballCourtCostCalculator: CalculatorDefinition = {
  slug: "pickleball-court-cost-calculator",
  title: "Pickleball Court Cost Calculator",
  description:
    "Free pickleball court building cost estimator. Calculate the total cost to build a pickleball court including surface, fencing, lighting, and site preparation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "pickleball court cost",
    "build pickleball court",
    "pickleball court estimator",
    "court construction cost",
    "pickleball court budget",
  ],
  variants: [
    {
      id: "single-court",
      name: "Single Court",
      description: "Estimate cost for one standard pickleball court (20x44 ft)",
      fields: [
        {
          name: "surfaceType",
          label: "Surface Type",
          type: "select",
          options: [
            { label: "Asphalt", value: "asphalt" },
            { label: "Concrete", value: "concrete" },
            { label: "Sport Tiles (Modular)", value: "sport-tile" },
          ],
          defaultValue: "concrete",
        },
        {
          name: "fencing",
          label: "Fencing",
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Chain Link (10 ft)", value: "chainlink" },
            { label: "Vinyl Coated (10 ft)", value: "vinyl" },
          ],
          defaultValue: "chainlink",
        },
        {
          name: "lighting",
          label: "Lighting",
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Standard (4 poles)", value: "standard" },
            { label: "LED (4 poles)", value: "led" },
          ],
          defaultValue: "none",
        },
        {
          name: "netSystem",
          label: "Net System",
          type: "select",
          options: [
            { label: "Portable Net", value: "portable" },
            { label: "Permanent Posts + Net", value: "permanent" },
          ],
          defaultValue: "permanent",
        },
        {
          name: "sitePrep",
          label: "Site Preparation Needed",
          type: "select",
          options: [
            { label: "Minimal (flat, cleared)", value: "minimal" },
            { label: "Moderate (grading needed)", value: "moderate" },
            { label: "Extensive (clearing + grading)", value: "extensive" },
          ],
          defaultValue: "moderate",
        },
      ],
      calculate: (inputs) => {
        const surfaceType = inputs.surfaceType as string;
        const fencing = inputs.fencing as string;
        const lighting = inputs.lighting as string;
        const netSystem = inputs.netSystem as string;
        const sitePrep = inputs.sitePrep as string;

        // Court area with overrun: 30x60 ft = 1800 sq ft
        const courtArea = 1800;
        const perimeterFt = 180; // 2*(30+60)

        // Surface costs per sq ft
        const surfaceCosts: Record<string, number> = {
          asphalt: 6,
          concrete: 9,
          "sport-tile": 14,
        };
        const surfaceCost = courtArea * (surfaceCosts[surfaceType] || 9);

        // Line painting + color coating
        const coatingCost = 2500;

        // Fencing costs per linear foot
        const fencingCosts: Record<string, number> = {
          none: 0,
          chainlink: 35,
          vinyl: 50,
        };
        const fencingCost = perimeterFt * (fencingCosts[fencing] || 0);

        // Lighting costs
        const lightingCosts: Record<string, number> = {
          none: 0,
          standard: 8000,
          led: 14000,
        };
        const lightingCost = lightingCosts[lighting] || 0;

        // Net system
        const netCosts: Record<string, number> = {
          portable: 250,
          permanent: 800,
        };
        const netCost = netCosts[netSystem] || 800;

        // Site preparation
        const sitePrepCosts: Record<string, number> = {
          minimal: 2000,
          moderate: 5000,
          extensive: 12000,
        };
        const sitePrepCost = sitePrepCosts[sitePrep] || 5000;

        const totalCost =
          surfaceCost + coatingCost + fencingCost + lightingCost + netCost + sitePrepCost;

        return {
          primary: {
            label: "Estimated Total Cost",
            value: `$${formatNumber(totalCost, 0)}`,
          },
          details: [
            { label: "Surface", value: `$${formatNumber(surfaceCost, 0)}` },
            { label: "Color Coating & Lines", value: `$${formatNumber(coatingCost, 0)}` },
            { label: "Fencing", value: `$${formatNumber(fencingCost, 0)}` },
            { label: "Lighting", value: `$${formatNumber(lightingCost, 0)}` },
            { label: "Net System", value: `$${formatNumber(netCost, 0)}` },
            { label: "Site Preparation", value: `$${formatNumber(sitePrepCost, 0)}` },
          ],
          note: "Costs are estimates based on national averages. Actual costs vary by region and contractor.",
        };
      },
    },
    {
      id: "multi-court",
      name: "Multi-Court Complex",
      description: "Estimate cost for multiple courts",
      fields: [
        {
          name: "numCourts",
          label: "Number of Courts",
          type: "number",
          placeholder: "e.g. 4",
          min: 2,
          max: 12,
        },
        {
          name: "surfaceType",
          label: "Surface Type",
          type: "select",
          options: [
            { label: "Asphalt", value: "asphalt" },
            { label: "Concrete", value: "concrete" },
            { label: "Sport Tiles (Modular)", value: "sport-tile" },
          ],
          defaultValue: "concrete",
        },
        {
          name: "fencing",
          label: "Fencing",
          type: "select",
          options: [
            { label: "Chain Link (10 ft)", value: "chainlink" },
            { label: "Vinyl Coated (10 ft)", value: "vinyl" },
          ],
          defaultValue: "chainlink",
        },
        {
          name: "lighting",
          label: "Lighting",
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "LED", value: "led" },
          ],
          defaultValue: "led",
        },
      ],
      calculate: (inputs) => {
        const numCourts = parseFloat(inputs.numCourts as string);
        const surfaceType = inputs.surfaceType as string;
        const fencing = inputs.fencing as string;
        const lighting = inputs.lighting as string;
        if (!numCourts || numCourts < 2) return null;

        const courtArea = 1800 * numCourts;
        const surfaceCosts: Record<string, number> = {
          asphalt: 5.5,
          concrete: 8,
          "sport-tile": 12.5,
        };
        const surfaceCost = courtArea * (surfaceCosts[surfaceType] || 8);
        const coatingCost = 2200 * numCourts;

        // Shared fencing is more efficient
        const perimeterFt = 2 * (30 * numCourts + 60) + (numCourts - 1) * 60;
        const fencingRate = fencing === "vinyl" ? 50 : 35;
        const fencingCost = perimeterFt * fencingRate;

        const lightingCost =
          lighting === "led" ? 10000 * numCourts : 0;

        const netCost = 800 * numCourts;
        const sitePrepCost = 4000 + 2500 * numCourts;
        const totalCost =
          surfaceCost + coatingCost + fencingCost + lightingCost + netCost + sitePrepCost;
        const perCourt = totalCost / numCourts;

        return {
          primary: {
            label: "Total Complex Cost",
            value: `$${formatNumber(totalCost, 0)}`,
          },
          details: [
            { label: "Cost Per Court", value: `$${formatNumber(perCourt, 0)}` },
            { label: "Surface", value: `$${formatNumber(surfaceCost, 0)}` },
            { label: "Coating & Lines", value: `$${formatNumber(coatingCost, 0)}` },
            { label: "Fencing", value: `$${formatNumber(fencingCost, 0)}` },
            { label: "Lighting", value: `$${formatNumber(lightingCost, 0)}` },
            { label: "Nets & Posts", value: `$${formatNumber(netCost, 0)}` },
            { label: "Site Prep", value: `$${formatNumber(sitePrepCost, 0)}` },
          ],
          note: "Multi-court complexes benefit from shared fencing and volume pricing.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "square-footage-calculator", "break-even-calculator"],
  faq: [
    {
      question: "How much does it cost to build a pickleball court?",
      answer:
        "A single pickleball court typically costs between $15,000 and $45,000 depending on surface type, fencing, lighting, and site conditions. A basic asphalt court with no lighting runs around $15,000-$20,000, while a fully equipped concrete court with LED lighting can exceed $40,000.",
    },
    {
      question: "What are the dimensions of a pickleball court?",
      answer:
        "A regulation pickleball court is 20 feet wide and 44 feet long. However, you need a minimum playing area of 30x60 feet (1,800 sq ft) to allow adequate space around the court for safe play.",
    },
    {
      question: "Can I convert a tennis court to pickleball?",
      answer:
        "Yes! A standard tennis court (60x120 ft) can fit up to 4 pickleball courts. Conversion costs typically range from $5,000-$12,000, which is much cheaper than building from scratch since the surface already exists.",
    },
  ],
  formula:
    "Total Cost = Surface Cost + Coating + Fencing + Lighting + Net System + Site Preparation",
};
