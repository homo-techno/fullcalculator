import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const depositionCostCalculator: CalculatorDefinition = {
  slug: "deposition-cost-calculator",
  title: "Deposition Cost Calculator",
  description: "Estimate total deposition costs including court reporter, videographer, and transcript fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["deposition cost","court reporter fees","deposition transcript","legal deposition"],
  variants: [{
    id: "standard",
    name: "Deposition Cost",
    description: "Estimate total deposition costs including court reporter, videographer, and transcript fees.",
    fields: [
      { name: "hours", label: "Estimated Deposition Hours", type: "number", min: 1, max: 20, defaultValue: 4 },
      { name: "depositions", label: "Number of Depositions", type: "number", min: 1, max: 30, defaultValue: 3 },
      { name: "videoRecord", label: "Video Recording", type: "select", options: [{ value: "0", label: "No Video" }, { value: "1", label: "Yes (Videographer)" }], defaultValue: "0" },
      { name: "expeditedTranscript", label: "Transcript Delivery", type: "select", options: [{ value: "1", label: "Standard (14 days)" }, { value: "2", label: "Expedited (7 days)" }, { value: "3", label: "Rush (3 days)" }, { value: "4", label: "Same Day" }], defaultValue: "1" },
      { name: "locationFee", label: "Conference Room Rental ($)", type: "number", min: 0, max: 2000, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const hours = inputs.hours as number;
    const depositions = inputs.depositions as number;
    const videoRecord = parseInt(inputs.videoRecord as string);
    const expeditedTranscript = parseInt(inputs.expeditedTranscript as string);
    const locationFee = inputs.locationFee as number;
    const pagesPerHour = 40;
    const totalPages = hours * pagesPerHour;
    const basePerPage = 4;
    const expeditedMultiplier = [0, 1, 1.5, 2, 3][expeditedTranscript] || 1;
    const transcriptCost = totalPages * basePerPage * expeditedMultiplier;
    const reporterAppearance = 350;
    const videoCost = videoRecord === 1 ? hours * 200 + 500 : 0;
    const perDeposition = transcriptCost + reporterAppearance + videoCost + locationFee;
    const totalCost = perDeposition * depositions;
    return {
      primary: { label: "Total Deposition Costs", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Cost Per Deposition", value: "$" + formatNumber(perDeposition) },
        { label: "Transcript Cost Each", value: "$" + formatNumber(transcriptCost) },
        { label: "Reporter Appearance Each", value: "$" + formatNumber(reporterAppearance) },
        { label: "Video Cost Each", value: "$" + formatNumber(videoCost) },
        { label: "Estimated Pages Per Depo", value: formatNumber(totalPages) }
      ]
    };
  },
  }],
  relatedSlugs: ["expert-witness-fee-calculator","legal-fee-estimator-calculator","case-timeline-estimator-calculator"],
  faq: [
    { question: "How much does a deposition cost?", answer: "A typical half-day deposition costs $1,000 to $3,000 including court reporter fees and transcript. Video depositions and expedited transcripts add significant cost." },
    { question: "Who pays for deposition costs?", answer: "The party requesting the deposition typically pays for the court reporter and transcript. Each side pays for their own copies." },
    { question: "How long does a deposition last?", answer: "Most depositions last 2 to 7 hours. Federal rules limit depositions to one day of 7 hours unless the court orders otherwise." },
  ],
  formula: "Total Cost = (Transcript + Reporter Fee + Video + Venue) x Number of Depositions",
};
