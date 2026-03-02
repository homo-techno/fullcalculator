import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fundraisingRoiCalculator: CalculatorDefinition = {
  slug: "fundraising-roi-calculator",
  title: "Fundraising ROI Calculator",
  description: "Calculate the return on investment for fundraising efforts.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["fundraising","ROI","nonprofit","donations"],
  variants: [{
    id: "standard",
    name: "Fundraising ROI",
    description: "Calculate the return on investment for fundraising efforts.",
    fields: [
      { name: "totalRaised", label: "Total Amount Raised ($)", type: "number", min: 100, max: 50000000, defaultValue: 100000 },
      { name: "fundraisingCost", label: "Fundraising Cost ($)", type: "number", min: 100, max: 5000000, defaultValue: 20000 },
      { name: "events", label: "Number of Events", type: "number", min: 1, max: 50, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const totalRaised = inputs.totalRaised as number;
    const fundraisingCost = inputs.fundraisingCost as number;
    const events = inputs.events as number;
    const netRaised = totalRaised - fundraisingCost;
    const roi = ((totalRaised - fundraisingCost) / fundraisingCost) * 100;
    const costPerDollar = fundraisingCost / totalRaised;
    const avgPerEvent = totalRaised / events;
    return { primary: { label: "Fundraising ROI", value: formatNumber(roi) + "%" }, details: [{ label: "Net Amount Raised", value: "$" + formatNumber(netRaised) }, { label: "Cost Per Dollar Raised", value: "$" + formatNumber(costPerDollar) }, { label: "Average Per Event", value: "$" + formatNumber(avgPerEvent) }] };
  },
  }],
  relatedSlugs: ["nonprofit-overhead-rate-calculator","donor-retention-calculator","grant-match-calculator"],
  faq: [
    { question: "What is a good fundraising ROI?", answer: "Most nonprofits aim for at least $3 to $4 returned per $1 spent." },
    { question: "How do you calculate cost per dollar raised?", answer: "Divide total fundraising expenses by total amount raised." },
    { question: "Which fundraising methods have the best ROI?", answer: "Direct mail and major donor campaigns often yield the highest returns." },
  ],
  formula: "ROI = ((TotalRaised - FundraisingCost) / FundraisingCost) * 100",
};
