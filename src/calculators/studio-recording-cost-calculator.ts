import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studioRecordingCostCalculator: CalculatorDefinition = {
  slug: "studio-recording-cost-calculator",
  title: "Studio Recording Cost Calculator",
  description: "Estimate the total cost of recording a song or album at a professional studio.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["studio","recording","cost","music production","session"],
  variants: [{
    id: "standard",
    name: "Studio Recording Cost",
    description: "Estimate the total cost of recording a song or album at a professional studio.",
    fields: [
      { name: "studioRate", label: "Studio Hourly Rate ($)", type: "number", min: 20, max: 500, defaultValue: 75 },
      { name: "hoursPerSong", label: "Hours Per Song", type: "number", min: 1, max: 40, defaultValue: 6 },
      { name: "numSongs", label: "Number of Songs", type: "number", min: 1, max: 30, defaultValue: 10 },
      { name: "mixingRate", label: "Mixing Cost Per Song ($)", type: "number", min: 50, max: 2000, defaultValue: 200 },
      { name: "masteringRate", label: "Mastering Cost Per Song ($)", type: "number", min: 30, max: 500, defaultValue: 100 },
    ],
    calculate: (inputs) => {
    const studioRate = inputs.studioRate as number;
    const hoursPerSong = inputs.hoursPerSong as number;
    const numSongs = inputs.numSongs as number;
    const mixingRate = inputs.mixingRate as number;
    const masteringRate = inputs.masteringRate as number;
    const trackingCost = studioRate * hoursPerSong * numSongs;
    const mixingCost = mixingRate * numSongs;
    const masteringCost = masteringRate * numSongs;
    const totalCost = trackingCost + mixingCost + masteringCost;
    const costPerSong = totalCost / numSongs;
    const totalHours = hoursPerSong * numSongs;
    return {
      primary: { label: "Total Production Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Tracking Cost", value: "$" + formatNumber(trackingCost) },
        { label: "Mixing Cost", value: "$" + formatNumber(mixingCost) },
        { label: "Mastering Cost", value: "$" + formatNumber(masteringCost) },
        { label: "Cost Per Song", value: "$" + formatNumber(costPerSong) },
        { label: "Total Studio Hours", value: formatNumber(totalHours) }
      ]
    };
  },
  }],
  relatedSlugs: ["album-production-budget-calculator","music-streaming-revenue-calculator","podcast-production-cost-calculator"],
  faq: [
    { question: "How much does it cost to record a song?", answer: "Recording a professional song typically costs $300 to $2,000 including tracking, mixing, and mastering." },
    { question: "What is the difference between mixing and mastering?", answer: "Mixing balances individual tracks into a stereo mix. Mastering polishes the final mix for consistent playback across all systems." },
    { question: "How long does it take to record a song?", answer: "A well-rehearsed song can be tracked in 4-8 hours. Complex productions may require 20+ hours." },
  ],
  formula: "Total = (Studio Rate x Hours x Songs) + (Mixing x Songs) + (Mastering x Songs)",
};
