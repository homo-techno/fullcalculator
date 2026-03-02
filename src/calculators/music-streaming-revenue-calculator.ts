import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const musicStreamingRevenueCalculator: CalculatorDefinition = {
  slug: "music-streaming-revenue-calculator",
  title: "Music Streaming Revenue Calculator",
  description: "Estimate earnings from music streams across major platforms like Spotify, Apple Music, and YouTube.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["streaming","Spotify","Apple Music","revenue","music income","royalties"],
  variants: [{
    id: "standard",
    name: "Music Streaming Revenue",
    description: "Estimate earnings from music streams across major platforms like Spotify, Apple Music, and YouTube.",
    fields: [
      { name: "streams", label: "Total Monthly Streams", type: "number", min: 100, max: 100000000, defaultValue: 50000 },
      { name: "platform", label: "Primary Platform", type: "select", options: [{ value: "1", label: "Spotify ($0.004/stream)" }, { value: "2", label: "Apple Music ($0.008/stream)" }, { value: "3", label: "YouTube Music ($0.002/stream)" }, { value: "4", label: "Tidal ($0.013/stream)" }], defaultValue: "1" },
      { name: "distributorCut", label: "Distributor Cut (%)", type: "number", min: 0, max: 50, defaultValue: 15 },
      { name: "splitMembers", label: "Band Members Splitting", type: "number", min: 1, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const streams = inputs.streams as number;
    const platform = inputs.platform as number;
    const distributorCut = inputs.distributorCut as number;
    const splitMembers = inputs.splitMembers as number;
    const rates = [0, 0.004, 0.008, 0.002, 0.013];
    const rate = rates[platform];
    const grossRevenue = streams * rate;
    const afterDistributor = grossRevenue * (1 - distributorCut / 100);
    const perMember = afterDistributor / splitMembers;
    const annualRevenue = perMember * 12;
    const streamsForMinWage = Math.ceil((1257 / rate) / (1 - distributorCut / 100));
    return {
      primary: { label: "Monthly Revenue Per Member", value: "$" + formatNumber(perMember) },
      details: [
        { label: "Gross Monthly Revenue", value: "$" + formatNumber(grossRevenue) },
        { label: "After Distributor Cut", value: "$" + formatNumber(afterDistributor) },
        { label: "Estimated Annual Revenue", value: "$" + formatNumber(annualRevenue) },
        { label: "Streams Needed for Min Wage", value: formatNumber(streamsForMinWage) }
      ]
    };
  },
  }],
  relatedSlugs: ["music-royalty-split-calculator","podcast-production-cost-calculator","album-production-budget-calculator"],
  faq: [
    { question: "How much does Spotify pay per stream?", answer: "Spotify pays approximately $0.003 to $0.005 per stream depending on the listener's country and subscription type." },
    { question: "Which streaming service pays artists the most?", answer: "Tidal typically pays the most per stream at around $0.013, followed by Apple Music at approximately $0.008." },
    { question: "How many streams do you need to make a living?", answer: "On Spotify, you would need roughly 300,000-400,000 streams per month to earn US minimum wage." },
  ],
  formula: "Revenue = Streams x Rate Per Stream x (1 - Distributor %)
Per Member = Revenue / Members",
};
