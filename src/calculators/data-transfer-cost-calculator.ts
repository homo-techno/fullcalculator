import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dataTransferCostCalculator: CalculatorDefinition = {
  slug: "data-transfer-cost-calculator",
  title: "Data Transfer Cost Calculator",
  description: "Estimate cloud data egress costs for transferring data out of major cloud platforms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["data transfer cost", "cloud egress cost", "data egress calculator"],
  variants: [{
    id: "standard",
    name: "Data Transfer Cost",
    description: "Estimate cloud data egress costs for transferring data out of major cloud platforms",
    fields: [
      { name: "dataGB", label: "Monthly Data Transfer Out", type: "number", suffix: "GB", min: 1, max: 1000000, step: 10, defaultValue: 500 },
      { name: "provider", label: "Cloud Provider", type: "select", options: [{value:"aws",label:"AWS"},{value:"azure",label:"Microsoft Azure"},{value:"gcp",label:"Google Cloud"},{value:"generic",label:"Generic/Average"}], defaultValue: "aws" },
      { name: "region", label: "Transfer Destination", type: "select", options: [{value:"sameRegion",label:"Same Region"},{value:"crossRegion",label:"Cross Region"},{value:"internet",label:"To Internet"},{value:"crossCloud",label:"Cross Cloud Provider"}], defaultValue: "internet" },
    ],
    calculate: (inputs) => {
      const dataGB = inputs.dataGB as number;
      const provider = inputs.provider as string;
      const region = inputs.region as string;
      if (!dataGB || dataGB <= 0) return null;
      const rateMap: Record<string, Record<string, number>> = {
        aws: { sameRegion: 0.01, crossRegion: 0.02, internet: 0.09, crossCloud: 0.09 },
        azure: { sameRegion: 0.01, crossRegion: 0.02, internet: 0.087, crossCloud: 0.087 },
        gcp: { sameRegion: 0.01, crossRegion: 0.01, internet: 0.085, crossCloud: 0.085 },
        generic: { sameRegion: 0.01, crossRegion: 0.02, internet: 0.09, crossCloud: 0.09 },
      };
      const rates = rateMap[provider] || rateMap.generic;
      const rate = rates[region] || 0.09;
      const freeGB = region === "internet" ? 100 : 0;
      const billableGB = Math.max(0, dataGB - freeGB);
      const monthlyCost = billableGB * rate;
      const annualCost = monthlyCost * 12;
      return {
        primary: { label: "Monthly Data Transfer Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        details: [
          { label: "Cost per GB", value: "$" + formatNumber(rate) },
          { label: "Billable Data", value: formatNumber(billableGB) + " GB" },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        ],
      };
    },
  }],
  relatedSlugs: ["cloud-cost-calculator", "download-time-calculator"],
  faq: [
    { question: "What is cloud data egress?", answer: "Data egress refers to data transferred out of a cloud provider to the internet or to another cloud region. Most cloud providers charge for outbound data transfer while inbound transfer is typically free." },
    { question: "How can I reduce cloud egress costs?", answer: "You can reduce egress costs by using a CDN to cache content closer to users, compressing data before transfer, keeping data within the same region, and using committed use discounts." },
  ],
  formula: "Monthly Cost = (Data Out GB - Free Tier GB) x Per GB Rate",
};
