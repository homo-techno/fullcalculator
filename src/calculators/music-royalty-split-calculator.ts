import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const musicRoyaltySplitCalculator: CalculatorDefinition = {
  slug: "music-royalty-split-calculator",
  title: "Music Royalty Split Calculator",
  description: "Calculate fair royalty splits between songwriters, producers, and performers.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["royalty","split","songwriting","publishing","music income"],
  variants: [{
    id: "standard",
    name: "Music Royalty Split",
    description: "Calculate fair royalty splits between songwriters, producers, and performers.",
    fields: [
      { name: "totalRevenue", label: "Total Revenue ($)", type: "number", min: 100, max: 10000000, defaultValue: 10000 },
      { name: "numWriters", label: "Number of Songwriters", type: "number", min: 1, max: 10, defaultValue: 2 },
      { name: "producerPct", label: "Producer Share (%)", type: "number", min: 0, max: 50, defaultValue: 20 },
      { name: "labelPct", label: "Label/Distributor Share (%)", type: "number", min: 0, max: 80, defaultValue: 15 },
      { name: "managerPct", label: "Manager Commission (%)", type: "number", min: 0, max: 25, defaultValue: 15 },
    ],
    calculate: (inputs) => {
    const totalRevenue = inputs.totalRevenue as number;
    const numWriters = inputs.numWriters as number;
    const producerPct = inputs.producerPct as number;
    const labelPct = inputs.labelPct as number;
    const managerPct = inputs.managerPct as number;
    const labelCut = totalRevenue * (labelPct / 100);
    const afterLabel = totalRevenue - labelCut;
    const producerCut = afterLabel * (producerPct / 100);
    const afterProducer = afterLabel - producerCut;
    const managerCut = afterProducer * (managerPct / 100);
    const afterManager = afterProducer - managerCut;
    const perWriter = afterManager / numWriters;
    const writerPctOfTotal = (perWriter / totalRevenue) * 100;
    return {
      primary: { label: "Per Songwriter Share", value: "$" + formatNumber(perWriter) },
      details: [
        { label: "Label/Distributor Take", value: "$" + formatNumber(labelCut) },
        { label: "Producer Take", value: "$" + formatNumber(producerCut) },
        { label: "Manager Take", value: "$" + formatNumber(managerCut) },
        { label: "Writer % of Total", value: formatNumber(writerPctOfTotal) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["music-streaming-revenue-calculator","album-production-budget-calculator","podcast-production-cost-calculator"],
  faq: [
    { question: "How are music royalties typically split?", answer: "A common split is 50% songwriter share and 50% publisher share. Producer points typically come from the artist's share." },
    { question: "What percentage does a music producer get?", answer: "Producers typically receive 15-25% of recording royalties, sometimes as 3-5 'points' on the album." },
    { question: "What does a music manager take?", answer: "Music managers typically take 15-20% of the artist's gross income from all music-related revenue." },
  ],
  formula: "Per Writer = (Revenue - Label Cut - Producer Cut - Manager Cut) / Writers",
};
