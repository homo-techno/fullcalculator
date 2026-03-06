import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const twitchStreamerRevenueCalculator: CalculatorDefinition = {
  slug: "twitch-streamer-revenue-calculator",
  title: "Twitch Streamer Revenue Calculator",
  description: "Estimate monthly Twitch streaming revenue from subscriptions, bits, ads, and donations based on average viewers and stream hours.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Twitch revenue calculator","streaming income","Twitch earnings estimator","streamer money calculator"],
  variants: [{
    id: "standard",
    name: "Twitch Streamer Revenue",
    description: "Estimate monthly Twitch streaming revenue from subscriptions, bits, ads, and donations based on average viewers and stream hours.",
    fields: [
      { name: "avgViewers", label: "Average Concurrent Viewers", type: "number", min: 1, max: 100000, defaultValue: 50 },
      { name: "streamHoursPerWeek", label: "Stream Hours Per Week", type: "number", min: 1, max: 80, defaultValue: 20 },
      { name: "subRate", label: "Subscriber Rate (%)", type: "number", min: 0, max: 20, defaultValue: 5 },
      { name: "subTier", label: "Average Sub Tier", type: "select", options: [{ value: "1", label: "Tier 1 ($2.50/sub)" }, { value: "2", label: "Tier 2 ($5.00/sub)" }, { value: "3", label: "Tier 3 ($12.50/sub)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const viewers = inputs.avgViewers as number;
    const hours = inputs.streamHoursPerWeek as number;
    const subRate = inputs.subRate as number / 100;
    const subTier = parseInt(inputs.subTier as string);
    const subPayouts = { 1: 2.50, 2: 5.00, 3: 12.50 };
    const payout = subPayouts[subTier] || 2.50;
    const monthlyHours = hours * 4.33;
    const subscribers = Math.round(viewers * subRate);
    const subRevenue = subscribers * payout;
    const adRevenue = viewers * monthlyHours * 0.003;
    const bitsRevenue = viewers * 0.15 * 4.33;
    const donationRevenue = viewers * 0.10 * 4.33;
    const totalRevenue = subRevenue + adRevenue + bitsRevenue + donationRevenue;
    return {
      primary: { label: "Estimated Monthly Revenue", value: "$" + formatNumber(Math.round(totalRevenue)) },
      details: [
        { label: "Subscription Revenue", value: "$" + formatNumber(Math.round(subRevenue)) },
        { label: "Ad Revenue", value: "$" + formatNumber(Math.round(adRevenue)) },
        { label: "Bits Revenue", value: "$" + formatNumber(Math.round(bitsRevenue)) },
        { label: "Donations Estimate", value: "$" + formatNumber(Math.round(donationRevenue)) }
      ]
    };
  },
  }],
  relatedSlugs: ["youtube-gaming-cpm-calculator","esports-prize-pool-split-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Subscribers = Avg Viewers x Sub Rate; Sub Revenue = Subscribers x Payout Per Sub; Ad Revenue = Viewers x Monthly Hours x $0.003; Total = Sub Revenue + Ad Revenue + Bits + Donations",
};
