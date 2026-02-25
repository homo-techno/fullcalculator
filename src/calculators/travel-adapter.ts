import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelAdapter: CalculatorDefinition = {
  slug: "travel-adapter",
  title: "Travel Adapter Calculator",
  description:
    "Free online travel adapter calculator. Determine which power adapter and voltage converter you need for your destination country.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "travel adapter",
    "power plug",
    "voltage converter",
    "outlet type",
    "travel plug",
  ],
  variants: [
    {
      id: "adapter-lookup",
      name: "Find Your Travel Adapter",
      fields: [
        {
          name: "homeCountry",
          label: "Your Home Country/Region",
          type: "select",
          options: [
            { label: "United States / Canada", value: "us" },
            { label: "United Kingdom", value: "uk" },
            { label: "European Union (continental)", value: "eu" },
            { label: "Australia / New Zealand", value: "au" },
            { label: "Japan", value: "jp" },
            { label: "China", value: "cn" },
            { label: "India", value: "in" },
            { label: "Brazil", value: "br" },
          ],
        },
        {
          name: "destination",
          label: "Destination Country/Region",
          type: "select",
          options: [
            { label: "United States / Canada", value: "us" },
            { label: "United Kingdom", value: "uk" },
            { label: "European Union (continental)", value: "eu" },
            { label: "Australia / New Zealand", value: "au" },
            { label: "Japan", value: "jp" },
            { label: "China", value: "cn" },
            { label: "India", value: "in" },
            { label: "Brazil", value: "br" },
            { label: "Thailand", value: "th" },
            { label: "South Africa", value: "za" },
            { label: "Israel", value: "il" },
          ],
        },
      ],
      calculate: (inputs) => {
        const homeCountry = inputs.homeCountry as string;
        const destination = inputs.destination as string;

        // Plug types and voltage by country
        const countryInfo: Record<string, { plugType: string; voltage: number; frequency: number }> = {
          us: { plugType: "A, B", voltage: 120, frequency: 60 },
          uk: { plugType: "G", voltage: 230, frequency: 50 },
          eu: { plugType: "C, F", voltage: 230, frequency: 50 },
          au: { plugType: "I", voltage: 230, frequency: 50 },
          jp: { plugType: "A, B", voltage: 100, frequency: 50 },
          cn: { plugType: "A, C, I", voltage: 220, frequency: 50 },
          in: { plugType: "C, D, M", voltage: 230, frequency: 50 },
          br: { plugType: "C, N", voltage: 127, frequency: 60 },
          th: { plugType: "A, B, C", voltage: 220, frequency: 50 },
          za: { plugType: "C, D, M, N", voltage: 230, frequency: 50 },
          il: { plugType: "C, H", voltage: 230, frequency: 50 },
        };

        const home = countryInfo[homeCountry] || countryInfo.us;
        const dest = countryInfo[destination] || countryInfo.us;

        const samePlugs = home.plugType === dest.plugType;
        const sameVoltage = Math.abs(home.voltage - dest.voltage) <= 10;
        const needsAdapter = !samePlugs;
        const needsConverter = !sameVoltage;

        let adapterType = "None needed";
        if (needsAdapter) {
          adapterType = home.plugType.split(",")[0].trim() + " to " + dest.plugType.split(",")[0].trim() + " adapter";
        }

        const recommendation = needsAdapter && needsConverter
          ? "Need adapter AND voltage converter"
          : needsAdapter
            ? "Need plug adapter only (voltage compatible)"
            : needsConverter
              ? "Plugs fit, but need voltage converter"
              : "No adapter or converter needed";

        return {
          primary: { label: "Recommendation", value: recommendation },
          details: [
            { label: "Destination Plug Type", value: dest.plugType },
            { label: "Destination Voltage", value: formatNumber(dest.voltage) + "V / " + formatNumber(dest.frequency) + "Hz" },
            { label: "Home Plug Type", value: home.plugType },
            { label: "Home Voltage", value: formatNumber(home.voltage) + "V / " + formatNumber(home.frequency) + "Hz" },
            { label: "Adapter Needed", value: needsAdapter ? "Yes - " + adapterType : "No" },
            { label: "Voltage Converter", value: needsConverter ? "Yes - " + formatNumber(home.voltage) + "V to " + formatNumber(dest.voltage) + "V" : "No" },
          ],
          note: "Most modern laptops and phone chargers are dual-voltage (100-240V) and only need a plug adapter, not a converter.",
        };
      },
    },
  ],
  relatedSlugs: ["international-call-cost", "travel-budget-daily", "currency-converter-trip"],
  faq: [
    {
      question: "Do I need a voltage converter for my phone charger?",
      answer:
        "Most modern phone chargers, laptop chargers, and camera chargers are dual-voltage (labeled 100-240V). These only need a plug adapter, not a voltage converter. Check the label on your charger to confirm.",
    },
    {
      question: "What is a universal travel adapter?",
      answer:
        "A universal travel adapter has multiple plug configurations that work in most countries. It is recommended for frequent travelers. Note that most universal adapters do NOT convert voltage.",
    },
    {
      question: "What happens if I use the wrong voltage?",
      answer:
        "Using a 120V appliance in a 230V outlet without a converter can damage or destroy the device and potentially cause a fire. Always check your device's voltage rating before plugging in.",
    },
  ],
  formula:
    "Adapter needed if home plug type differs from destination plug type\nConverter needed if voltage difference > 10V",
};
