import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelTipGuide: CalculatorDefinition = {
  slug: "travel-tip-guide",
  title: "Travel Tip Guide Calculator",
  description:
    "Free online travel tipping guide calculator. Calculate appropriate tip amounts by country and service type for international travel.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "travel tip",
    "tipping guide",
    "tip calculator",
    "gratuity abroad",
    "international tipping",
  ],
  variants: [
    {
      id: "tip-calc",
      name: "Calculate Tip by Country",
      fields: [
        {
          name: "billAmount",
          label: "Bill Amount (in local currency)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "country",
          label: "Country/Region",
          type: "select",
          options: [
            { label: "United States", value: "us" },
            { label: "Canada", value: "ca" },
            { label: "United Kingdom", value: "uk" },
            { label: "France", value: "fr" },
            { label: "Germany", value: "de" },
            { label: "Italy", value: "it" },
            { label: "Spain", value: "es" },
            { label: "Japan", value: "jp" },
            { label: "China", value: "cn" },
            { label: "Australia", value: "au" },
            { label: "Mexico", value: "mx" },
            { label: "Thailand", value: "th" },
            { label: "India", value: "in" },
            { label: "Brazil", value: "br" },
            { label: "Egypt", value: "eg" },
            { label: "UAE / Dubai", value: "ae" },
          ],
        },
        {
          name: "serviceType",
          label: "Service Type",
          type: "select",
          options: [
            { label: "Restaurant / Dining", value: "restaurant" },
            { label: "Taxi / Rideshare", value: "taxi" },
            { label: "Hotel Bellhop", value: "bellhop" },
            { label: "Hotel Housekeeping", value: "housekeeping" },
            { label: "Tour Guide", value: "tourguide" },
            { label: "Spa / Massage", value: "spa" },
            { label: "Hairdresser / Barber", value: "hair" },
          ],
        },
      ],
      calculate: (inputs) => {
        const billAmount = parseFloat(inputs.billAmount as string) || 0;
        const country = inputs.country as string;
        const serviceType = inputs.serviceType as string;

        // Tipping percentages by country and service
        const tipRates: Record<string, Record<string, number>> = {
          us: { restaurant: 0.20, taxi: 0.15, bellhop: 0, tourguide: 0.20, spa: 0.20, hair: 0.20, housekeeping: 0 },
          ca: { restaurant: 0.18, taxi: 0.15, bellhop: 0, tourguide: 0.15, spa: 0.15, hair: 0.15, housekeeping: 0 },
          uk: { restaurant: 0.10, taxi: 0.10, bellhop: 0, tourguide: 0.10, spa: 0.10, hair: 0.10, housekeeping: 0 },
          fr: { restaurant: 0.05, taxi: 0.05, bellhop: 0, tourguide: 0.10, spa: 0.10, hair: 0.10, housekeeping: 0 },
          de: { restaurant: 0.10, taxi: 0.10, bellhop: 0, tourguide: 0.10, spa: 0.10, hair: 0.10, housekeeping: 0 },
          it: { restaurant: 0.05, taxi: 0.05, bellhop: 0, tourguide: 0.10, spa: 0.10, hair: 0.05, housekeeping: 0 },
          es: { restaurant: 0.05, taxi: 0.05, bellhop: 0, tourguide: 0.10, spa: 0.10, hair: 0.05, housekeeping: 0 },
          jp: { restaurant: 0, taxi: 0, bellhop: 0, tourguide: 0, spa: 0, hair: 0, housekeeping: 0 },
          cn: { restaurant: 0, taxi: 0, bellhop: 0, tourguide: 0.05, spa: 0, hair: 0, housekeeping: 0 },
          au: { restaurant: 0.10, taxi: 0.10, bellhop: 0, tourguide: 0.10, spa: 0.10, hair: 0.10, housekeeping: 0 },
          mx: { restaurant: 0.15, taxi: 0.10, bellhop: 0, tourguide: 0.15, spa: 0.15, hair: 0.10, housekeeping: 0 },
          th: { restaurant: 0.10, taxi: 0.05, bellhop: 0, tourguide: 0.10, spa: 0.10, hair: 0.10, housekeeping: 0 },
          in: { restaurant: 0.10, taxi: 0.10, bellhop: 0, tourguide: 0.10, spa: 0.10, hair: 0.10, housekeeping: 0 },
          br: { restaurant: 0.10, taxi: 0.10, bellhop: 0, tourguide: 0.10, spa: 0.10, hair: 0.10, housekeeping: 0 },
          eg: { restaurant: 0.15, taxi: 0.10, bellhop: 0, tourguide: 0.15, spa: 0.10, hair: 0.10, housekeeping: 0 },
          ae: { restaurant: 0.10, taxi: 0.10, bellhop: 0, tourguide: 0.10, spa: 0.15, hair: 0.10, housekeeping: 0 },
        };

        // Flat-rate tips (bellhop, housekeeping) in USD equivalent
        const flatTips: Record<string, Record<string, number>> = {
          us: { bellhop: 2, housekeeping: 5 },
          ca: { bellhop: 2, housekeeping: 5 },
          uk: { bellhop: 1, housekeeping: 2 },
          fr: { bellhop: 1, housekeeping: 2 },
          de: { bellhop: 1, housekeeping: 2 },
          it: { bellhop: 1, housekeeping: 1 },
          es: { bellhop: 1, housekeeping: 1 },
          jp: { bellhop: 0, housekeeping: 0 },
          cn: { bellhop: 0, housekeeping: 0 },
          au: { bellhop: 2, housekeeping: 2 },
          mx: { bellhop: 1, housekeeping: 2 },
          th: { bellhop: 1, housekeeping: 1 },
          in: { bellhop: 1, housekeeping: 1 },
          br: { bellhop: 1, housekeeping: 1 },
          eg: { bellhop: 1, housekeeping: 2 },
          ae: { bellhop: 2, housekeeping: 3 },
        };

        const countryRates = tipRates[country] || tipRates.us;
        const countryFlats = flatTips[country] || flatTips.us;

        const isFlat = serviceType === "bellhop" || serviceType === "housekeeping";
        const tipRate = countryRates[serviceType] || 0;
        const flatTip = countryFlats[serviceType] || 0;

        let tipAmount: number;
        let total: number;

        if (isFlat) {
          tipAmount = flatTip;
          total = billAmount + tipAmount;
        } else if (tipRate === 0) {
          tipAmount = 0;
          total = billAmount;
        } else {
          tipAmount = billAmount * tipRate;
          total = billAmount + tipAmount;
        }

        const noTipCountries = ["jp", "cn"];
        const isNoTip = noTipCountries.includes(country) && tipRate === 0;

        return {
          primary: { label: "Suggested Tip", value: formatNumber(tipAmount, 2) },
          details: [
            { label: "Bill Amount", value: formatNumber(billAmount, 2) },
            { label: "Tip Rate", value: isFlat ? "Flat amount" : formatNumber(tipRate * 100, 0) + "%" },
            { label: "Tip Amount", value: formatNumber(tipAmount, 2) },
            { label: "Total with Tip", value: formatNumber(total, 2) },
            { label: "Cultural Note", value: isNoTip ? "Tipping is NOT expected and may be considered rude" : tipRate <= 0.05 ? "Small tips or rounding up is sufficient" : "Tipping is customary" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cruise-tip", "travel-budget-daily", "currency-converter-trip"],
  faq: [
    {
      question: "In which countries should I NOT tip?",
      answer:
        "Japan and China are the most notable countries where tipping is not customary and can even be considered rude. In Japan, exceptional service is the standard and tipping may cause confusion.",
    },
    {
      question: "How much should I tip at restaurants abroad?",
      answer:
        "The US standard is 18-20%. Canada is 15-18%. UK and Australia are 10%. Most of Europe includes service in the bill, so 5-10% extra is generous. In Japan, do not tip at all.",
    },
    {
      question: "Should I tip in cash or on a credit card?",
      answer:
        "Cash tips are preferred in most countries as they go directly to the service provider. In some countries, credit card tips may not reach the individual worker. Carry small bills in local currency for tips.",
    },
  ],
  formula:
    "Tip Amount = Bill Amount x Tip Rate (percentage)\nOr Flat Amount for bellhop/housekeeping\nTotal = Bill Amount + Tip Amount",
};
