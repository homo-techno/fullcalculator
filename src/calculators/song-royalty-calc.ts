import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const songRoyaltyCalcCalculator: CalculatorDefinition = {
  slug: "song-royalty-calculator",
  title: "Song Royalty & Streaming Revenue Calculator",
  description: "Free online song royalty calculator. Estimate streaming revenue from Spotify, Apple Music, YouTube, and other platforms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["song royalty calculator", "streaming revenue calculator", "spotify royalty calculator", "music income calculator", "streaming pay calculator"],
  variants: [
    {
      id: "streaming",
      name: "Streaming Revenue",
      description: "Estimate revenue from streaming platforms",
      fields: [
        { name: "platform", label: "Platform", type: "select", options: [
          { label: "Spotify ($0.004/stream)", value: "0.004" },
          { label: "Apple Music ($0.008/stream)", value: "0.008" },
          { label: "Amazon Music ($0.004/stream)", value: "0.004" },
          { label: "YouTube Music ($0.002/stream)", value: "0.002" },
          { label: "Tidal ($0.013/stream)", value: "0.013" },
          { label: "Deezer ($0.004/stream)", value: "0.004" },
        ], defaultValue: "0.004" },
        { name: "streams", label: "Total Streams", type: "number", placeholder: "e.g. 100000" },
        { name: "ownershipPct", label: "Your Ownership (%)", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
        { name: "distributorCut", label: "Distributor/Label Cut (%)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const ratePerStream = parseFloat(inputs.platform as string) || 0.004;
        const streams = parseFloat(inputs.streams as string) || 0;
        const ownership = parseFloat(inputs.ownershipPct as string) || 100;
        const distributorCut = parseFloat(inputs.distributorCut as string) || 15;
        if (!streams) return null;

        const grossRevenue = streams * ratePerStream;
        const afterDistributor = grossRevenue * (1 - distributorCut / 100);
        const yourShare = afterDistributor * (ownership / 100);
        const perStreamNet = yourShare / streams;

        return {
          primary: { label: "Your Revenue", value: `$${formatNumber(yourShare, 2)}` },
          details: [
            { label: "Gross streaming revenue", value: `$${formatNumber(grossRevenue, 2)}` },
            { label: "After distributor cut", value: `$${formatNumber(afterDistributor, 2)}` },
            { label: "Your ownership share", value: `${ownership}%` },
            { label: "Net per stream", value: `$${formatNumber(perStreamNet, 5)}` },
            { label: "Total streams", value: formatNumber(streams, 0) },
            { label: "Streams for $1", value: formatNumber(1 / perStreamNet, 0) },
          ],
          note: "Streaming rates vary by country, subscription type, and market share. These are average estimates.",
        };
      },
    },
    {
      id: "monthly-goal",
      name: "Monthly Income Goal",
      description: "Calculate streams needed to reach a monthly income target",
      fields: [
        { name: "monthlyGoal", label: "Monthly Income Goal ($)", type: "number", placeholder: "e.g. 1000" },
        { name: "avgRate", label: "Average Rate ($/stream)", type: "number", placeholder: "e.g. 0.004", defaultValue: 0.004 },
        { name: "ownershipPct", label: "Your Ownership (%)", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
        { name: "distributorCut", label: "Distributor/Label Cut (%)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "numSongs", label: "Number of Released Songs", type: "number", placeholder: "e.g. 10", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const monthlyGoal = parseFloat(inputs.monthlyGoal as string) || 0;
        const avgRate = parseFloat(inputs.avgRate as string) || 0.004;
        const ownership = parseFloat(inputs.ownershipPct as string) || 100;
        const distributorCut = parseFloat(inputs.distributorCut as string) || 15;
        const numSongs = parseFloat(inputs.numSongs as string) || 1;
        if (!monthlyGoal) return null;

        const effectiveRate = avgRate * (1 - distributorCut / 100) * (ownership / 100);
        const totalStreamsNeeded = monthlyGoal / effectiveRate;
        const streamsPerSong = totalStreamsNeeded / numSongs;
        const dailyStreamsPerSong = streamsPerSong / 30;
        const annualRevenue = monthlyGoal * 12;

        return {
          primary: { label: "Monthly Streams Needed", value: formatNumber(totalStreamsNeeded, 0) },
          details: [
            { label: "Streams per song per month", value: formatNumber(streamsPerSong, 0) },
            { label: "Daily streams per song", value: formatNumber(dailyStreamsPerSong, 0) },
            { label: "Effective rate per stream", value: `$${formatNumber(effectiveRate, 5)}` },
            { label: "Number of songs", value: formatNumber(numSongs, 0) },
            { label: "Annual revenue", value: `$${formatNumber(annualRevenue, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roi-calculator", "salary-calculator"],
  faq: [
    { question: "How much does Spotify pay per stream?", answer: "Spotify pays approximately $0.003-0.005 per stream on average, depending on the listener's country, subscription type (free vs. premium), and the artist's total stream share. The average is around $0.004." },
    { question: "How many streams to make $1000?", answer: "On Spotify at $0.004/stream, you need about 250,000 streams for $1000 gross. After distributor cuts (typically 15%), you'd need roughly 294,000 streams. Across multiple platforms, the blended rate varies." },
    { question: "Who gets paid from streaming?", answer: "Streaming revenue is split between the platform (about 30%), rights holders (labels/distributors), publishers, songwriters, and performing artists. Independent artists using distributors like DistroKid or TuneCore keep more of their share." },
  ],
  formula: "Revenue = Streams × Rate per Stream × (1 - Distributor%) × Ownership%",
};
