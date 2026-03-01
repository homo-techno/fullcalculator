import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const websiteCostCalculator: CalculatorDefinition = {
  slug: "website-cost-calculator",
  title: "Website Cost Calculator",
  description: "Estimate the total cost of building a website based on type, features, and development approach.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["website cost", "website development cost", "web design cost estimate"],
  variants: [{
    id: "standard",
    name: "Website Cost",
    description: "Estimate the total cost of building a website based on type, features, and development approach",
    fields: [
      { name: "siteType", label: "Website Type", type: "select", options: [{value:"landing",label:"Landing Page"},{value:"business",label:"Business Website (5-10 pages)"},{value:"ecommerce",label:"E-Commerce Store"},{value:"webapp",label:"Web Application"}], defaultValue: "business" },
      { name: "approach", label: "Development Approach", type: "select", options: [{value:"template",label:"Template/Theme"},{value:"custom",label:"Custom Design"},{value:"agency",label:"Full Agency Build"}], defaultValue: "custom" },
      { name: "pages", label: "Number of Pages", type: "number", suffix: "pages", min: 1, max: 200, defaultValue: 10 },
      { name: "features", label: "Feature Complexity", type: "select", options: [{value:"basic",label:"Basic (forms, galleries)"},{value:"moderate",label:"Moderate (CMS, search)"},{value:"advanced",label:"Advanced (integrations, API)"}], defaultValue: "moderate" },
    ],
    calculate: (inputs) => {
      const siteType = inputs.siteType as string;
      const approach = inputs.approach as string;
      const pages = inputs.pages as number;
      const features = inputs.features as string;
      if (!pages || pages <= 0) return null;
      const baseCost: Record<string, number> = { landing: 1000, business: 3000, ecommerce: 8000, webapp: 15000 };
      const approachMod: Record<string, number> = { template: 0.4, custom: 1.0, agency: 2.0 };
      const featureMod: Record<string, number> = { basic: 0.8, moderate: 1.0, advanced: 1.5 };
      const perPageCost = approach === "agency" ? 200 : approach === "custom" ? 100 : 30;
      const buildCost = (baseCost[siteType] || 3000) * (approachMod[approach] || 1.0) * (featureMod[features] || 1.0);
      const pageCost = pages * perPageCost;
      const totalCost = buildCost + pageCost;
      const annualMaintenance = totalCost * 0.15;
      return {
        primary: { label: "Estimated Website Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Design and Development", value: "$" + formatNumber(Math.round(buildCost)) },
          { label: "Content and Pages", value: "$" + formatNumber(Math.round(pageCost)) },
          { label: "Annual Maintenance Estimate", value: "$" + formatNumber(Math.round(annualMaintenance)) },
        ],
      };
    },
  }],
  relatedSlugs: ["app-development-cost-calculator", "cloud-cost-calculator"],
  faq: [
    { question: "How much does a website cost to build?", answer: "Website costs range from $500 for a simple template-based landing page to $50,000 or more for a custom-designed web application built by an agency." },
    { question: "What are the ongoing costs of a website?", answer: "Ongoing costs typically include hosting ($5 to $100 per month), domain name ($10 to $15 per year), SSL certificate, maintenance, and content updates, totaling $500 to $5,000 annually." },
  ],
  formula: "Website Cost = Base Cost x Approach Modifier x Feature Modifier + Pages x Per Page Cost",
};
