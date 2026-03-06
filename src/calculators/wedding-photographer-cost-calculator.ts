import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingPhotographerCostCalculator: CalculatorDefinition = {
  slug: "wedding-photographer-cost-calculator",
  title: "Wedding Photographer Cost Calculator",
  description: "Estimate wedding photography costs including coverage hours, second shooter, engagement session, prints, and album options.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wedding photographer cost","wedding photography pricing","photographer rates","wedding photo package"],
  variants: [{
    id: "standard",
    name: "Wedding Photographer Cost",
    description: "Estimate wedding photography costs including coverage hours, second shooter, engagement session, prints, and album options.",
    fields: [
      { name: "coverageHours", label: "Coverage Hours", type: "number", min: 2, max: 14, defaultValue: 8 },
      { name: "hourlyRate", label: "Photographer Hourly Rate ($)", type: "number", min: 50, max: 600, defaultValue: 200 },
      { name: "secondShooter", label: "Second Shooter", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" },
      { name: "engagementSession", label: "Engagement Session", type: "select", options: [{ value: "0", label: "No" }, { value: "500", label: "Standard ($500)" }, { value: "1000", label: "Premium ($1000)" }], defaultValue: "500" },
      { name: "albumCost", label: "Photo Album Cost ($)", type: "number", min: 0, max: 3000, defaultValue: 800 },
    ],
    calculate: (inputs) => {
    const hours = inputs.coverageHours as number;
    const rate = inputs.hourlyRate as number;
    const secondShooter = parseFloat(inputs.secondShooter as unknown as string);
    const engagement = parseFloat(inputs.engagementSession as unknown as string);
    const album = inputs.albumCost as number;
    const primaryCost = hours * rate;
    const secondCost = secondShooter === 1 ? hours * rate * 0.5 : 0;
    const total = primaryCost + secondCost + engagement + album;
    return {
      primary: { label: "Total Photography Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Primary Photographer", value: "$" + formatNumber(Math.round(primaryCost)) },
        { label: "Second Shooter", value: "$" + formatNumber(Math.round(secondCost)) },
        { label: "Engagement Session", value: "$" + formatNumber(engagement) },
        { label: "Album", value: "$" + formatNumber(album) },
        { label: "Effective Hourly Rate", value: "$" + formatNumber(Math.round(total / hours)) + "/hr" }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","wedding-videography-cost-calculator","reception-venue-cost-calculator"],
  faq: [
    { question: "How much does a wedding photographer cost?", answer: "Wedding photographers typically charge $2,000 to $5,000 for full-day coverage. Luxury photographers can charge $8,000 to $15,000 or more." },
    { question: "Do you need a second photographer at a wedding?", answer: "A second shooter captures additional angles, candid moments, and the other partner getting ready simultaneously. It is recommended for weddings with 100+ guests." },
    { question: "How many photos do wedding photographers deliver?", answer: "Most photographers deliver 50 to 100 edited photos per hour of coverage, so an 8-hour wedding typically yields 400 to 800 final images." },
  ],
  formula: "Total = (Hours x Rate) + SecondShooterCost + EngagementSession + AlbumCost; Second Shooter = Hours x Rate x 0.5 (if selected)",
};
