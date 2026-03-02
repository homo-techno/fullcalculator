import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const internationalCallingCostCalculator: CalculatorDefinition = {
  slug: "international-calling-cost-calculator",
  title: "International Calling Cost Calculator",
  description: "Compare the cost of international calls using different methods including carrier, VoIP, and calling cards.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["international calling cost","overseas call rates","calling abroad","roaming charges"],
  variants: [{
    id: "standard",
    name: "International Calling Cost",
    description: "Compare the cost of international calls using different methods including carrier, VoIP, and calling cards.",
    fields: [
      { name: "minutesPerDay", label: "Minutes Per Day", type: "number", min: 1, max: 300, defaultValue: 15 },
      { name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 180, defaultValue: 14 },
      { name: "carrierRate", label: "Carrier Rate ($/min)", type: "number", min: 0.01, max: 10, defaultValue: 1.5 },
      { name: "voipRate", label: "VoIP/WiFi Rate ($/min)", type: "number", min: 0, max: 2, defaultValue: 0.02 },
      { name: "internationalPlan", label: "Carrier International Plan ($/day)", type: "number", min: 0, max: 20, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const minutesPerDay = inputs.minutesPerDay as number;
    const tripDays = inputs.tripDays as number;
    const carrierRate = inputs.carrierRate as number;
    const voipRate = inputs.voipRate as number;
    const internationalPlan = inputs.internationalPlan as number;
    const totalMinutes = minutesPerDay * tripDays;
    const carrierCost = totalMinutes * carrierRate;
    const voipCost = totalMinutes * voipRate;
    const planCost = internationalPlan * tripDays;
    const cheapest = Math.min(carrierCost, voipCost, planCost);
    const bestOption = cheapest === voipCost ? "VoIP/WiFi Calling" : cheapest === planCost ? "International Plan" : "Pay-Per-Minute";
    return {
      primary: { label: "Best Option Cost", value: "$" + formatNumber(Math.round(cheapest * 100) / 100) },
      details: [
        { label: "Best Option", value: bestOption },
        { label: "Carrier Pay-Per-Minute", value: "$" + formatNumber(Math.round(carrierCost * 100) / 100) },
        { label: "VoIP/WiFi Calling", value: "$" + formatNumber(Math.round(voipCost * 100) / 100) },
        { label: "International Plan", value: "$" + formatNumber(Math.round(planCost * 100) / 100) },
        { label: "Total Minutes", value: formatNumber(totalMinutes) }
      ]
    };
  },
  }],
  relatedSlugs: ["travel-budget-calculator","travel-daily-budget-calculator","currency-exchange-calculator"],
  faq: [
    { question: "What is the cheapest way to call internationally?", answer: "VoIP apps like WhatsApp, Skype, and FaceTime over WiFi are virtually free. For calls to landlines, services like Google Voice or Skype credit cost 1 to 5 cents per minute." },
    { question: "How much do international roaming charges cost?", answer: "Without a plan, carrier roaming charges can be $1 to $5 per minute. Most carriers offer international day passes for $5 to $12 per day." },
    { question: "Should I get a local SIM card when traveling?", answer: "A local SIM card is often the cheapest option for extended trips, providing local rates and data. Many countries offer tourist SIM cards for $10 to $30." },
  ],
  formula: "Carrier Cost = Minutes/Day x Trip Days x Carrier Rate
VoIP Cost = Total Minutes x VoIP Rate
Plan Cost = Daily Plan Fee x Trip Days",
};
