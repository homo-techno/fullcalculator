import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const renovationCostCalculator: CalculatorDefinition = {
  slug: "renovation-cost-calculator",
  title: "Renovation Cost Calculator",
  description:
    "Free renovation cost calculator. Estimate the cost of home renovations, remodeling projects, and home improvements with ROI analysis.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "renovation cost calculator",
    "home renovation calculator",
    "remodel cost calculator",
    "home improvement cost",
    "renovation budget calculator",
  ],
  variants: [
    {
      id: "by-room",
      name: "Renovation by Room",
      description: "Estimate renovation costs for a specific room or project",
      fields: [
        {
          name: "projectType",
          label: "Project Type",
          type: "select",
          options: [
            { label: "Kitchen remodel", value: "kitchen" },
            { label: "Bathroom remodel", value: "bathroom" },
            { label: "Basement finishing", value: "basement" },
            { label: "Roof replacement", value: "roof" },
            { label: "Siding replacement", value: "siding" },
            { label: "Window replacement", value: "windows" },
            { label: "Flooring (whole house)", value: "flooring" },
            { label: "Deck / patio addition", value: "deck" },
            { label: "Room addition", value: "addition" },
            { label: "Painting (interior)", value: "paint" },
          ],
          defaultValue: "kitchen",
        },
        {
          name: "qualityLevel",
          label: "Quality Level",
          type: "select",
          options: [
            { label: "Budget / DIY", value: "budget" },
            { label: "Mid-range", value: "mid" },
            { label: "High-end", value: "high" },
            { label: "Luxury", value: "luxury" },
          ],
          defaultValue: "mid",
        },
        { name: "sqft", label: "Square Footage (of project area)", type: "number", placeholder: "e.g. 200", suffix: "sq ft", min: 0 },
      ],
      calculate: (inputs) => {
        const project = inputs.projectType as string;
        const quality = inputs.qualityLevel as string;
        const sqft = (inputs.sqft as number) || 0;
        if (!project) return null;

        // Cost per sq ft by project type and quality [budget, mid, high, luxury]
        const costMap: Record<string, number[]> = {
          kitchen: [75, 150, 250, 400],
          bathroom: [100, 200, 350, 500],
          basement: [30, 50, 80, 120],
          roof: [5, 8, 12, 20],
          siding: [4, 8, 12, 20],
          windows: [15, 30, 50, 80],
          flooring: [3, 8, 15, 25],
          deck: [15, 30, 50, 80],
          addition: [80, 150, 250, 400],
          paint: [2, 4, 6, 10],
        };

        // Default square footage if not provided
        const defaultSqft: Record<string, number> = {
          kitchen: 150, bathroom: 80, basement: 800, roof: 2000,
          siding: 2000, windows: 2000, flooring: 1500, deck: 300,
          addition: 400, paint: 2000,
        };

        // Average ROI percentages
        const roiMap: Record<string, number> = {
          kitchen: 72, bathroom: 64, basement: 70, roof: 61,
          siding: 76, windows: 72, flooring: 70, deck: 65,
          addition: 55, paint: 107,
        };

        const qualityIndex = quality === "budget" ? 0 : quality === "mid" ? 1 : quality === "high" ? 2 : 3;
        const rates = costMap[project] || [50, 100, 200, 300];
        const costPerSqft = rates[qualityIndex];
        const area = sqft || defaultSqft[project] || 200;
        const totalCost = costPerSqft * area;
        const roi = roiMap[project] || 65;
        const valueAdded = totalCost * (roi / 100);
        const contingency = totalCost * 0.15;

        return {
          primary: { label: "Estimated Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Cost per sq ft", value: `$${formatNumber(costPerSqft)}` },
            { label: "Project area", value: `${formatNumber(area)} sq ft` },
            { label: "Contingency (15%)", value: `$${formatNumber(contingency)}` },
            { label: "Total with contingency", value: `$${formatNumber(totalCost + contingency)}` },
            { label: "Avg. ROI at resale", value: `${roi}%` },
            { label: "Est. value added", value: `$${formatNumber(valueAdded)}` },
          ],
          note: "Costs vary significantly by region. Add 15-20% contingency for unexpected issues. Always get 3+ quotes from licensed contractors.",
        };
      },
    },
    {
      id: "budget",
      name: "Total Renovation Budget",
      description: "Plan your renovation budget with cost breakdown",
      fields: [
        { name: "totalBudget", label: "Total Budget", type: "number", placeholder: "e.g. 50000", prefix: "$", min: 0 },
        { name: "materialsPercent", label: "Materials (% of budget)", type: "number", placeholder: "e.g. 40", suffix: "%", min: 0, max: 100, defaultValue: 40 },
        { name: "laborPercent", label: "Labor (% of budget)", type: "number", placeholder: "e.g. 35", suffix: "%", min: 0, max: 100, defaultValue: 35 },
      ],
      calculate: (inputs) => {
        const budget = inputs.totalBudget as number;
        const matPct = (inputs.materialsPercent as number) || 40;
        const labPct = (inputs.laborPercent as number) || 35;
        if (!budget) return null;

        const materials = budget * (matPct / 100);
        const labor = budget * (labPct / 100);
        const remaining = budget - materials - labor;
        const permits = budget * 0.05;
        const contingency = budget * 0.15;
        const designFees = remaining > 0 ? remaining - permits - contingency : 0;

        return {
          primary: { label: "Total Budget", value: `$${formatNumber(budget)}` },
          details: [
            { label: "Materials", value: `$${formatNumber(materials)} (${matPct}%)` },
            { label: "Labor", value: `$${formatNumber(labor)} (${labPct}%)` },
            { label: "Permits (est. 5%)", value: `$${formatNumber(permits)}` },
            { label: "Contingency (15%)", value: `$${formatNumber(contingency)}` },
            { label: "Design / other", value: `$${formatNumber(Math.max(0, designFees))}` },
          ],
          note: matPct + labPct > 85 ? "Materials + labor exceeding 85% leaves little room for permits and contingency." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["flip-profit-calculator", "home-value-calculator", "home-equity-calculator"],
  faq: [
    {
      question: "How much does a kitchen remodel cost?",
      answer:
        "Kitchen remodels range from $10,000-$75,000+. A minor budget refresh costs $10-15K, a mid-range remodel $25-50K, and a major upscale remodel $75-150K+. Kitchen remodels typically recoup 60-80% of their cost at resale.",
    },
    {
      question: "What renovation has the best ROI?",
      answer:
        "Highest ROI renovations include: interior/exterior painting (100%+ ROI), garage door replacement (94%), manufactured stone veneer (92%), minor kitchen remodel (72%), siding replacement (76%). Luxury upgrades typically have lower ROI than mid-range improvements.",
    },
    {
      question: "How much contingency should I budget?",
      answer:
        "Budget 15-20% contingency for unexpected costs. Older homes may need 20-25% due to hidden issues (asbestos, outdated wiring, water damage). Even well-planned renovations encounter surprises during demolition.",
    },
  ],
  formula:
    "Total Cost = Cost Per Sq Ft × Project Area | Value Added = Total Cost × (ROI% / 100) | Budget = Materials + Labor + Permits + Contingency",
};
