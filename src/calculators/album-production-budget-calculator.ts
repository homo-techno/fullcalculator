import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const albumProductionBudgetCalculator: CalculatorDefinition = {
  slug: "album-production-budget-calculator",
  title: "Album Production Budget Calculator",
  description: "Plan your complete album budget including recording, artwork, distribution, and marketing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["album","budget","production","music release","indie"],
  variants: [{
    id: "standard",
    name: "Album Production Budget",
    description: "Plan your complete album budget including recording, artwork, distribution, and marketing.",
    fields: [
      { name: "recordingCost", label: "Total Recording Cost ($)", type: "number", min: 500, max: 100000, defaultValue: 5000 },
      { name: "artworkCost", label: "Album Artwork ($)", type: "number", min: 0, max: 5000, defaultValue: 500 },
      { name: "distributionCost", label: "Distribution Fee ($)", type: "number", min: 0, max: 1000, defaultValue: 50 },
      { name: "marketingBudget", label: "Marketing Budget ($)", type: "number", min: 0, max: 50000, defaultValue: 1000 },
      { name: "musicVideoCost", label: "Music Video Cost ($)", type: "number", min: 0, max: 50000, defaultValue: 2000 },
    ],
    calculate: (inputs) => {
    const recordingCost = inputs.recordingCost as number;
    const artworkCost = inputs.artworkCost as number;
    const distributionCost = inputs.distributionCost as number;
    const marketingBudget = inputs.marketingBudget as number;
    const musicVideoCost = inputs.musicVideoCost as number;
    const totalBudget = recordingCost + artworkCost + distributionCost + marketingBudget + musicVideoCost;
    const recordingPct = (recordingCost / totalBudget) * 100;
    const marketingPct = (marketingBudget / totalBudget) * 100;
    const streamsToRecoup = Math.ceil(totalBudget / 0.004);
    return {
      primary: { label: "Total Album Budget", value: "$" + formatNumber(totalBudget) },
      details: [
        { label: "Recording", value: "$" + formatNumber(recordingCost) + " (" + formatNumber(recordingPct) + "%)" },
        { label: "Marketing", value: "$" + formatNumber(marketingBudget) + " (" + formatNumber(marketingPct) + "%)" },
        { label: "Music Video", value: "$" + formatNumber(musicVideoCost) },
        { label: "Streams to Recoup (Spotify)", value: formatNumber(streamsToRecoup) }
      ]
    };
  },
  }],
  relatedSlugs: ["studio-recording-cost-calculator","music-streaming-revenue-calculator","music-royalty-split-calculator"],
  faq: [
    { question: "How much does it cost to produce an album?", answer: "Indie albums typically cost $5,000 to $25,000. Professional major label albums can cost $100,000 or more." },
    { question: "What percentage should go to marketing?", answer: "Industry standard suggests spending 20-30% of your total album budget on marketing and promotion." },
    { question: "Is a music video worth the investment?", answer: "Music videos significantly boost engagement and streaming numbers. Even a low-budget video can increase visibility." },
  ],
  formula: "Total Budget = Recording + Artwork + Distribution + Marketing + Music Video",
};
