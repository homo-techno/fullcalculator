import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const podcastProductionCostCalculator: CalculatorDefinition = {
  slug: "podcast-production-cost-calculator",
  title: "Podcast Production Cost Calculator",
  description: "Estimate the costs of starting and running a podcast including equipment, hosting, and editing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["podcast","production","cost","audio","hosting","editing"],
  variants: [{
    id: "standard",
    name: "Podcast Production Cost",
    description: "Estimate the costs of starting and running a podcast including equipment, hosting, and editing.",
    fields: [
      { name: "equipmentCost", label: "Equipment Cost ($)", type: "number", min: 50, max: 10000, defaultValue: 500 },
      { name: "editingRate", label: "Editing Cost Per Episode ($)", type: "number", min: 0, max: 500, defaultValue: 75 },
      { name: "hostingMonthly", label: "Monthly Hosting Fee ($)", type: "number", min: 0, max: 100, defaultValue: 20 },
      { name: "episodesPerMonth", label: "Episodes Per Month", type: "number", min: 1, max: 30, defaultValue: 4 },
      { name: "months", label: "Duration (months)", type: "number", min: 1, max: 60, defaultValue: 12 },
    ],
    calculate: (inputs) => {
    const equipmentCost = inputs.equipmentCost as number;
    const editingRate = inputs.editingRate as number;
    const hostingMonthly = inputs.hostingMonthly as number;
    const episodesPerMonth = inputs.episodesPerMonth as number;
    const months = inputs.months as number;
    const totalEpisodes = episodesPerMonth * months;
    const totalEditing = editingRate * totalEpisodes;
    const totalHosting = hostingMonthly * months;
    const totalCost = equipmentCost + totalEditing + totalHosting;
    const costPerEpisode = totalCost / totalEpisodes;
    const monthlyCost = (totalEditing + totalHosting) / months;
    return {
      primary: { label: "Total Cost (" + months + " months)", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Equipment (One-Time)", value: "$" + formatNumber(equipmentCost) },
        { label: "Total Editing Cost", value: "$" + formatNumber(totalEditing) },
        { label: "Total Hosting", value: "$" + formatNumber(totalHosting) },
        { label: "Cost Per Episode", value: "$" + formatNumber(costPerEpisode) },
        { label: "Monthly Recurring", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["studio-recording-cost-calculator","music-streaming-revenue-calculator","soundproofing-cost-calculator"],
  faq: [
    { question: "How much does it cost to start a podcast?", answer: "A basic podcast setup can start at $100-200 for equipment. A professional setup with editing services runs $500-2000 to launch." },
    { question: "Should I pay for podcast editing?", answer: "Professional editing costs $50-150 per episode but significantly improves audio quality and listener retention." },
    { question: "What equipment do I need for a podcast?", answer: "At minimum you need a USB microphone ($50-100), headphones ($30-50), and recording software (free options available)." },
  ],
  formula: "Total Cost = Equipment + (Editing x Episodes) + (Hosting x Months)",
};
