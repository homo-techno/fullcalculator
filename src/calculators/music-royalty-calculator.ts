import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const musicRoyaltyCalculator: CalculatorDefinition = {
  slug: "music-royalty-calculator",
  title: "Music Royalty Calculator",
  description: "Estimate streaming royalty earnings by platform.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["streaming royalties","spotify royalty calculator"],
  variants: [{
    id: "standard",
    name: "Music Royalty",
    description: "Estimate streaming royalty earnings by platform.",
    fields: [
      { name: "streams", label: "Number of Streams", type: "number", min: 1, max: 100000000, defaultValue: 10000 },
      { name: "platform", label: "Platform", type: "select", options: [{ value: "1", label: "Spotify" }, { value: "2", label: "Apple Music" }, { value: "3", label: "YouTube Music" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const streams = inputs.streams as number;
      const platform = inputs.platform as number;
      if (!streams) return null;
      const ratePerStream = platform === 1 ? 0.004 : platform === 2 ? 0.008 : 0.002;
      const gross = streams * ratePerStream;
      const distributorCut = gross * 0.15;
      const net = gross - distributorCut;
      const platformName = platform === 1 ? "Spotify" : platform === 2 ? "Apple Music" : "YouTube Music";
      return {
        primary: { label: "Estimated Earnings", value: "$" + formatNumber(Math.round(net * 100) / 100) },
        details: [
          { label: "Platform", value: platformName },
          { label: "Rate Per Stream", value: "$" + formatNumber(ratePerStream) },
          { label: "Gross Revenue", value: "$" + formatNumber(Math.round(gross * 100) / 100) },
          { label: "Distributor Fee (15%)", value: "$" + formatNumber(Math.round(distributorCut * 100) / 100) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much does Spotify pay per stream?", answer: "Spotify pays roughly $0.003 to $0.005 per stream on average." },
    { question: "Which platform pays the most per stream?", answer: "Apple Music generally pays the highest per-stream rate." },
  ],
  formula: "Earnings = Streams x Rate Per Stream x (1 - Distributor Fee)",
};
