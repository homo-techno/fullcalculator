import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelTipByCountryCalculator: CalculatorDefinition = {
  slug: "travel-tip-by-country-calculator",
  title: "Travel Tip by Country Calculator",
  description: "Calculate appropriate tip amounts based on country tipping customs, service type, and bill amount.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["travel tipping","tip by country","international tipping","tipping customs abroad"],
  variants: [{
    id: "standard",
    name: "Travel Tip by Country",
    description: "Calculate appropriate tip amounts based on country tipping customs, service type, and bill amount.",
    fields: [
      { name: "region", label: "Region/Country", type: "select", options: [{ value: "1", label: "USA/Canada (15-20%)" }, { value: "2", label: "UK/Ireland (10-15%)" }, { value: "3", label: "Western Europe (5-10%)" }, { value: "4", label: "Japan/Korea (0% - Not Expected)" }, { value: "5", label: "Middle East (10-15%)" }, { value: "6", label: "Latin America (10%)" }, { value: "7", label: "Australia/NZ (0-10%)" }, { value: "8", label: "Southeast Asia (5-10%)" }], defaultValue: "1" },
      { name: "serviceType", label: "Service Type", type: "select", options: [{ value: "1", label: "Restaurant" }, { value: "2", label: "Taxi/Driver" }, { value: "3", label: "Hotel Porter" }, { value: "4", label: "Tour Guide" }], defaultValue: "1" },
      { name: "billAmount", label: "Bill Amount (local currency)", type: "number", min: 1, max: 10000, defaultValue: 80 },
      { name: "serviceQuality", label: "Service Quality", type: "select", options: [{ value: "1", label: "Below Average" }, { value: "2", label: "Average" }, { value: "3", label: "Excellent" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const region = parseInt(inputs.region as string);
    const serviceType = parseInt(inputs.serviceType as string);
    const billAmount = inputs.billAmount as number;
    const serviceQuality = parseInt(inputs.serviceQuality as string);
    const tipRanges: Record<number, number[]> = {
      1: [15, 18, 22], 2: [10, 12, 15], 3: [5, 8, 10],
      4: [0, 0, 0], 5: [10, 12, 15], 6: [8, 10, 12],
      7: [0, 5, 10], 8: [5, 8, 10]
    };
    const ranges = tipRanges[region] || [10, 15, 20];
    const tipPct = ranges[serviceQuality - 1] || ranges[1];
    const tipAmount = billAmount * (tipPct / 100);
    const totalBill = billAmount + tipAmount;
    const notes: Record<number, string> = {
      1: "Tipping is expected and customary",
      2: "Check if service charge is included",
      3: "Small tips appreciated, not required",
      4: "Tipping can be considered rude",
      5: "Tipping is appreciated",
      6: "Tipping is appreciated but not mandatory",
      7: "Tipping is not expected but appreciated",
      8: "Small tips for good service"
    };
    return {
      primary: { label: "Recommended Tip", value: formatNumber(Math.round(tipAmount * 100) / 100) },
      details: [
        { label: "Tip Percentage", value: formatNumber(tipPct) + "%" },
        { label: "Total with Tip", value: formatNumber(Math.round(totalBill * 100) / 100) },
        { label: "Cultural Note", value: notes[region] || "Ask locally" }
      ]
    };
  },
  }],
  relatedSlugs: ["tipping-etiquette-calculator","travel-daily-budget-calculator","currency-exchange-calculator"],
  faq: [
    { question: "Should I tip in Japan?", answer: "Tipping is generally not practiced in Japan and can sometimes be considered rude. Excellent service is the cultural standard and does not require a monetary reward." },
    { question: "Is tipping expected in Europe?", answer: "In most of Western Europe, a 5 to 10 percent tip is appreciated but not mandatory. Many restaurants include a service charge. Check your bill before adding extra." },
    { question: "How much should I tip a tour guide?", answer: "In the US, tip tour guides $5 to $10 per person for a half-day tour and $10 to $20 for a full day. In other countries, $2 to $5 per person is common." },
  ],
  formula: "Tip Amount = Bill Amount x (Tip Percentage / 100)
Total = Bill Amount + Tip Amount",
};
