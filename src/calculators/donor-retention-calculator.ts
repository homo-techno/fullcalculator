import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const donorRetentionCalculator: CalculatorDefinition = {
  slug: "donor-retention-calculator",
  title: "Donor Retention Calculator",
  description: "Calculate your donor retention rate over a given period.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["donor","retention","nonprofit","fundraising"],
  variants: [{
    id: "standard",
    name: "Donor Retention",
    description: "Calculate your donor retention rate over a given period.",
    fields: [
      { name: "donorsLastYear", label: "Donors Last Year", type: "number", min: 1, max: 100000, defaultValue: 500 },
      { name: "repeatDonors", label: "Repeat Donors This Year", type: "number", min: 0, max: 100000, defaultValue: 225 },
      { name: "avgDonation", label: "Average Donation ($)", type: "number", min: 1, max: 100000, defaultValue: 150 },
    ],
    calculate: (inputs) => {
    const donorsLastYear = inputs.donorsLastYear as number;
    const repeatDonors = inputs.repeatDonors as number;
    const avgDonation = inputs.avgDonation as number;
    const retentionRate = (repeatDonors / donorsLastYear) * 100;
    const lapsedDonors = donorsLastYear - repeatDonors;
    const lostRevenue = lapsedDonors * avgDonation;
    const retainedRevenue = repeatDonors * avgDonation;
    return { primary: { label: "Donor Retention Rate", value: formatNumber(retentionRate) + "%" }, details: [{ label: "Repeat Donors", value: formatNumber(repeatDonors) }, { label: "Lapsed Donors", value: formatNumber(lapsedDonors) }, { label: "Retained Revenue", value: "$" + formatNumber(retainedRevenue) }, { label: "Lost Revenue", value: "$" + formatNumber(lostRevenue) }] };
  },
  }],
  relatedSlugs: ["fundraising-roi-calculator","nonprofit-overhead-rate-calculator","volunteer-value-calculator"],
  faq: [
    { question: "What is a good donor retention rate?", answer: "The national average is about 45%; above 60% is considered strong." },
    { question: "Why does donor retention matter?", answer: "Retaining donors is 5 to 10 times cheaper than acquiring new ones." },
    { question: "How can nonprofits improve retention?", answer: "Personalized thank-you messages, impact reports, and regular updates help." },
  ],
  formula: "RetentionRate = (RepeatDonors / DonorsLastYear) * 100",
};
