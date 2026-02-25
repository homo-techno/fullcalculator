import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const internationalCallCost: CalculatorDefinition = {
  slug: "international-call-cost",
  title: "International Call Cost Calculator",
  description:
    "Free online international call cost calculator. Calculate the cost of international phone calls and compare roaming vs local SIM options.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "international call",
    "roaming charges",
    "phone call cost",
    "international roaming",
    "calling abroad",
  ],
  variants: [
    {
      id: "call-cost",
      name: "Calculate Call Cost",
      fields: [
        {
          name: "minutes",
          label: "Call Duration (minutes)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "callingMethod",
          label: "Calling Method",
          type: "select",
          options: [
            { label: "US Carrier Roaming", value: "roaming" },
            { label: "Local SIM Card", value: "localSim" },
            { label: "International Calling Card", value: "callingCard" },
            { label: "WiFi Calling (VoIP)", value: "wifi" },
            { label: "Satellite Phone", value: "satellite" },
          ],
        },
        {
          name: "destination",
          label: "Calling To/From Region",
          type: "select",
          options: [
            { label: "Western Europe", value: "weurope" },
            { label: "Eastern Europe", value: "eeurope" },
            { label: "Asia (Developed)", value: "asiadev" },
            { label: "Southeast Asia", value: "seasia" },
            { label: "Latin America", value: "latam" },
            { label: "Africa", value: "africa" },
            { label: "Middle East", value: "mideast" },
            { label: "Australia / NZ", value: "aunz" },
          ],
        },
      ],
      calculate: (inputs) => {
        const minutes = parseFloat(inputs.minutes as string) || 0;
        const callingMethod = inputs.callingMethod as string;
        const destination = inputs.destination as string;

        // Cost per minute in USD by method and region
        const rates: Record<string, Record<string, number>> = {
          roaming: {
            weurope: 3.0, eeurope: 3.5, asiadev: 3.5, seasia: 4.0,
            latam: 3.5, africa: 5.0, mideast: 4.0, aunz: 3.0,
          },
          localSim: {
            weurope: 0.10, eeurope: 0.05, asiadev: 0.08, seasia: 0.03,
            latam: 0.08, africa: 0.10, mideast: 0.12, aunz: 0.12,
          },
          callingCard: {
            weurope: 0.05, eeurope: 0.08, asiadev: 0.06, seasia: 0.04,
            latam: 0.10, africa: 0.15, mideast: 0.10, aunz: 0.06,
          },
          wifi: {
            weurope: 0.0, eeurope: 0.0, asiadev: 0.0, seasia: 0.0,
            latam: 0.0, africa: 0.0, mideast: 0.0, aunz: 0.0,
          },
          satellite: {
            weurope: 1.50, eeurope: 1.50, asiadev: 1.50, seasia: 1.50,
            latam: 1.50, africa: 1.50, mideast: 1.50, aunz: 1.50,
          },
        };

        const ratePerMinute = (rates[callingMethod] || rates.roaming)[destination] || 3.0;
        const totalCost = ratePerMinute * minutes;

        // Compare with cheapest option
        const wifiCost = 0;
        const callingCardRate = (rates.callingCard)[destination] || 0.08;
        const callingCardCost = callingCardRate * minutes;
        const savings = totalCost - callingCardCost;

        return {
          primary: { label: "Total Call Cost", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Rate per Minute", value: "$" + formatNumber(ratePerMinute, 2) },
            { label: "Duration", value: formatNumber(minutes) + " minutes" },
            { label: "WiFi/VoIP Cost", value: "$" + formatNumber(wifiCost, 2) + " (free)" },
            { label: "Calling Card Cost", value: "$" + formatNumber(callingCardCost, 2) },
            { label: "Potential Savings", value: "$" + formatNumber(Math.max(0, savings), 2) + " vs calling card" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["travel-adapter", "travel-budget-daily", "currency-converter-trip"],
  faq: [
    {
      question: "What is the cheapest way to make international calls?",
      answer:
        "WiFi calling through apps like WhatsApp, FaceTime, or Skype is free and the cheapest option. International calling cards and local SIM cards are the next most affordable options.",
    },
    {
      question: "How much does phone roaming cost?",
      answer:
        "US carrier roaming rates can be $2-5 per minute for calls. Most carriers offer international day passes ($5-12/day) that provide more reasonable rates. Check with your carrier before traveling.",
    },
    {
      question: "Should I get a local SIM card when traveling?",
      answer:
        "A local SIM card is one of the most cost-effective options for travelers staying more than a few days. They typically cost $5-20 and include data and local calling. Your phone must be unlocked.",
    },
  ],
  formula: "Total Cost = Rate per Minute x Call Duration in Minutes",
};
