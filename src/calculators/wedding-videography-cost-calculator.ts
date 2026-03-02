import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingVideographyCostCalculator: CalculatorDefinition = {
  slug: "wedding-videography-cost-calculator",
  title: "Wedding Videography Cost Calculator",
  description: "Estimate wedding videography pricing based on coverage hours, crew size, deliverables, and add-on services.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wedding videography cost","wedding video pricing","videographer rates","wedding film cost"],
  variants: [{
    id: "standard",
    name: "Wedding Videography Cost",
    description: "Estimate wedding videography pricing based on coverage hours, crew size, deliverables, and add-on services.",
    fields: [
      { name: "hours", label: "Coverage Hours", type: "number", min: 1, max: 16, defaultValue: 8 },
      { name: "videographers", label: "Number of Videographers", type: "number", min: 1, max: 4, defaultValue: 2 },
      { name: "deliverables", label: "Deliverables", type: "select", options: [{ value: "1", label: "Highlight Film Only" }, { value: "2", label: "Highlight + Ceremony" }, { value: "3", label: "Full Coverage Edit" }, { value: "4", label: "Full + Same-Day Edit" }], defaultValue: "2" },
      { name: "region", label: "Market Region", type: "select", options: [{ value: "1", label: "Budget Market" }, { value: "2", label: "Average Market" }, { value: "3", label: "Premium Market" }, { value: "4", label: "Luxury Market" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const hours = inputs.hours as number;
    const videographers = inputs.videographers as number;
    const deliverables = parseInt(inputs.deliverables as string);
    const region = parseInt(inputs.region as string);
    const regionMultiplier = [0, 0.6, 1.0, 1.8, 3.0][region];
    const deliverableBase = [0, 1200, 1800, 2800, 4000][deliverables];
    const hourlyRate = 150 * regionMultiplier;
    const coverageCost = Math.round(hours * hourlyRate * videographers);
    const deliverableCost = Math.round(deliverableBase * regionMultiplier);
    const editingHours = deliverables === 1 ? 15 : deliverables === 2 ? 25 : deliverables === 3 ? 40 : 55;
    const total = coverageCost + deliverableCost;
    return {
      primary: { label: "Estimated Package Price", value: "$" + formatNumber(total) },
      details: [
        { label: "Coverage Cost", value: "$" + formatNumber(coverageCost) },
        { label: "Deliverable Cost", value: "$" + formatNumber(deliverableCost) },
        { label: "Estimated Editing Hours", value: formatNumber(editingHours) + " hours" },
        { label: "Effective Hourly Rate", value: "$" + formatNumber(Math.round(total / (hours + editingHours))) + "/hr" }
      ]
    };
  },
  }],
  relatedSlugs: ["film-budget-estimator","photo-print-cost-calculator"],
  faq: [
    { question: "How much does wedding videography cost?", answer: "Average wedding videography costs range from $1,500 to $3,500 in average markets. Luxury markets and premium deliverables can run $5,000 to $15,000 or more." },
    { question: "Do I need two videographers?", answer: "A second videographer captures additional angles during the ceremony and reception. They are highly recommended for coverage of events with 100+ guests." },
    { question: "How long does editing take?", answer: "A highlight film typically takes 15-25 hours to edit. Full ceremony and reception coverage can take 40-60 hours of post-production work." },
  ],
  formula: "Package Price = Coverage Cost + Deliverable Cost
Coverage Cost = Hours x Hourly Rate x Videographers
Hourly Rate = $150 x Region Multiplier",
};
