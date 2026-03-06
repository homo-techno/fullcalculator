import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const youtubeGamingCpmCalculator: CalculatorDefinition = {
  slug: "youtube-gaming-cpm-calculator",
  title: "YouTube Gaming CPM Calculator",
  description: "Calculate estimated YouTube gaming channel revenue based on views, CPM rates, and content type to project monthly and annual earnings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["YouTube CPM calculator","YouTube gaming revenue","YouTube earnings estimator","gaming channel income"],
  variants: [{
    id: "standard",
    name: "YouTube Gaming CPM",
    description: "Calculate estimated YouTube gaming channel revenue based on views, CPM rates, and content type to project monthly and annual earnings.",
    fields: [
      { name: "monthlyViews", label: "Monthly Views", type: "number", min: 100, max: 100000000, defaultValue: 100000 },
      { name: "contentType", label: "Content Type", type: "select", options: [{ value: "1", label: "Let-s Plays ($2-4 CPM)" }, { value: "2", label: "Reviews/Guides ($4-8 CPM)" }, { value: "3", label: "Esports/Competitive ($3-6 CPM)" }, { value: "4", label: "Tech/Hardware ($6-12 CPM)" }], defaultValue: "2" },
      { name: "avgVideoLength", label: "Average Video Length (min)", type: "number", min: 1, max: 240, defaultValue: 15 },
      { name: "sponsorRate", label: "Monthly Sponsorship ($)", type: "number", min: 0, max: 100000, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const views = inputs.monthlyViews as number;
    const content = parseInt(inputs.contentType as string);
    const videoLength = inputs.avgVideoLength as number;
    const sponsorship = inputs.sponsorRate as number;
    const cpmRanges = { 1: 3, 2: 6, 3: 4.5, 4: 9 };
    const baseCpm = cpmRanges[content] || 4;
    const lengthMultiplier = videoLength >= 8 ? 1.0 + (Math.min(videoLength, 20) - 8) * 0.02 : 0.7;
    const effectiveCpm = baseCpm * lengthMultiplier;
    const adRevenue = (views / 1000) * effectiveCpm;
    const membershipRevenue = views * 0.0002;
    const totalRevenue = adRevenue + membershipRevenue + sponsorship;
    const annualRevenue = totalRevenue * 12;
    return {
      primary: { label: "Estimated Monthly Revenue", value: "$" + formatNumber(Math.round(totalRevenue)) },
      details: [
        { label: "Ad Revenue", value: "$" + formatNumber(Math.round(adRevenue)) },
        { label: "Effective CPM", value: "$" + formatNumber(Math.round(effectiveCpm * 100) / 100) },
        { label: "Memberships Estimate", value: "$" + formatNumber(Math.round(membershipRevenue)) },
        { label: "Projected Annual Revenue", value: "$" + formatNumber(Math.round(annualRevenue)) }
      ]
    };
  },
  }],
  relatedSlugs: ["twitch-streamer-revenue-calculator","esports-prize-pool-split-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Effective CPM = Base CPM x Length Multiplier; Ad Revenue = (Monthly Views / 1000) x Effective CPM; Total = Ad Revenue + Memberships + Sponsorships",
};
