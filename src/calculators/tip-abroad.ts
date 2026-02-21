import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tipAbroadCalculator: CalculatorDefinition = {
  slug: "tip-abroad-calculator",
  title: "Tipping Guide by Country Calculator",
  description:
    "Free international tipping calculator. Calculate the right tip amount based on country customs, service type, and local tipping etiquette.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "tipping abroad",
    "international tip",
    "tipping etiquette",
    "tip by country",
    "how much to tip",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Tip by Country",
      description: "Get the right tip amount based on country customs",
      fields: [
        {
          name: "billAmount",
          label: "Bill Amount (local currency)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "country",
          label: "Country/Region",
          type: "select",
          options: [
            { label: "USA / Canada (15-20%)", value: "us" },
            { label: "UK / Ireland (10-15%)", value: "uk" },
            { label: "France / Italy / Spain (5-10%)", value: "europe_south" },
            { label: "Germany / Netherlands (5-10%)", value: "europe_north" },
            { label: "Japan (no tip expected)", value: "japan" },
            { label: "China (no tip expected)", value: "china" },
            { label: "Australia / NZ (not expected, 10% optional)", value: "australia" },
            { label: "Mexico (10-15%)", value: "mexico" },
            { label: "Brazil (10% included)", value: "brazil" },
            { label: "Thailand (round up, 5-10%)", value: "thailand" },
            { label: "India (10%)", value: "india" },
            { label: "UAE / Dubai (10-15%)", value: "uae" },
            { label: "Egypt / Morocco (10-15%)", value: "africa_north" },
          ],
          defaultValue: "us",
        },
        {
          name: "serviceType",
          label: "Service Type",
          type: "select",
          options: [
            { label: "Sit-down restaurant", value: "restaurant" },
            { label: "Bar / cafe", value: "bar" },
            { label: "Taxi / rideshare", value: "taxi" },
            { label: "Hotel (bellhop/housekeeping)", value: "hotel" },
            { label: "Tour guide", value: "tour" },
            { label: "Spa / salon", value: "spa" },
          ],
          defaultValue: "restaurant",
        },
        {
          name: "serviceQuality",
          label: "Service Quality",
          type: "select",
          options: [
            { label: "Excellent", value: "excellent" },
            { label: "Good", value: "good" },
            { label: "Average", value: "average" },
            { label: "Poor", value: "poor" },
          ],
          defaultValue: "good",
        },
      ],
      calculate: (inputs) => {
        const billAmount = inputs.billAmount as number;
        const country = inputs.country as string;
        const serviceType = inputs.serviceType as string;
        const serviceQuality = inputs.serviceQuality as string;
        if (!billAmount || billAmount <= 0) return null;

        const tipRanges: Record<string, Record<string, [number, number]>> = {
          us: { restaurant: [18, 22], bar: [15, 20], taxi: [15, 20], hotel: [15, 20], tour: [15, 20], spa: [18, 22] },
          uk: { restaurant: [10, 15], bar: [0, 5], taxi: [10, 15], hotel: [5, 10], tour: [10, 15], spa: [10, 15] },
          europe_south: { restaurant: [5, 10], bar: [0, 5], taxi: [5, 10], hotel: [5, 10], tour: [10, 15], spa: [5, 10] },
          europe_north: { restaurant: [5, 10], bar: [0, 5], taxi: [5, 10], hotel: [5, 10], tour: [10, 15], spa: [5, 10] },
          japan: { restaurant: [0, 0], bar: [0, 0], taxi: [0, 0], hotel: [0, 0], tour: [0, 5], spa: [0, 0] },
          china: { restaurant: [0, 0], bar: [0, 0], taxi: [0, 0], hotel: [0, 5], tour: [5, 10], spa: [0, 0] },
          australia: { restaurant: [0, 10], bar: [0, 5], taxi: [0, 10], hotel: [0, 5], tour: [5, 10], spa: [0, 10] },
          mexico: { restaurant: [10, 15], bar: [10, 15], taxi: [10, 15], hotel: [10, 15], tour: [10, 20], spa: [10, 15] },
          brazil: { restaurant: [0, 5], bar: [0, 5], taxi: [0, 10], hotel: [5, 10], tour: [10, 15], spa: [5, 10] },
          thailand: { restaurant: [5, 10], bar: [0, 5], taxi: [0, 5], hotel: [5, 10], tour: [10, 15], spa: [10, 15] },
          india: { restaurant: [7, 10], bar: [5, 10], taxi: [5, 10], hotel: [5, 10], tour: [10, 15], spa: [10, 15] },
          uae: { restaurant: [10, 15], bar: [10, 15], taxi: [10, 15], hotel: [10, 15], tour: [10, 20], spa: [10, 15] },
          africa_north: { restaurant: [10, 15], bar: [5, 10], taxi: [10, 15], hotel: [10, 15], tour: [10, 20], spa: [10, 15] },
        };

        const qualityModifiers: Record<string, number> = {
          excellent: 1.2,
          good: 1.0,
          average: 0.8,
          poor: 0.5,
        };

        const range = tipRanges[country]?.[serviceType] || [10, 15];
        const midTip = (range[0] + range[1]) / 2;
        const modifier = qualityModifiers[serviceQuality] || 1.0;
        const adjustedPercent = midTip * modifier;
        const tipAmount = billAmount * (adjustedPercent / 100);
        const totalBill = billAmount + tipAmount;

        const noTipCountries = ["japan", "china"];
        const isNoTip = noTipCountries.includes(country) && range[1] === 0;

        return {
          primary: {
            label: "Suggested Tip",
            value: isNoTip ? "No tip expected" : `${formatNumber(tipAmount, 2)}`,
          },
          details: [
            { label: "Bill amount", value: `${formatNumber(billAmount, 2)}` },
            { label: "Country tip range", value: `${range[0]}-${range[1]}%` },
            { label: "Adjusted for service", value: `${formatNumber(adjustedPercent, 1)}%` },
            { label: "Tip amount", value: `${formatNumber(tipAmount, 2)}` },
            { label: "Total with tip", value: `${formatNumber(totalBill, 2)}` },
          ],
          note: isNoTip
            ? "Tipping is not customary and may even be considered rude in this country. Service charges are typically included in the price."
            : `For ${serviceQuality} ${serviceType} service in this region, ${formatNumber(adjustedPercent, 1)}% is appropriate.`,
        };
      },
    },
  ],
  relatedSlugs: ["currency-exchange-calculator", "travel-budget-calculator"],
  faq: [
    {
      question: "In which countries should I NOT tip?",
      answer:
        "Tipping is not expected and can be considered rude in Japan, China, South Korea, and Singapore. In these countries, excellent service is considered a standard part of the job. In Japan, tipping may even cause confusion or embarrassment.",
    },
    {
      question: "Is the tip included in European restaurants?",
      answer:
        "In many European countries, a service charge is included in the bill (especially France, Italy, and Spain). Look for 'service compris' or 'servizio incluso' on the bill. Even so, leaving small change (5-10%) for excellent service is appreciated.",
    },
    {
      question: "How much should I tip hotel housekeeping?",
      answer:
        "In the US and Canada, $2-$5 per night is standard for hotel housekeeping. In Europe, 1-2 euros per night is appreciated. Leave the tip daily rather than at the end of your stay, as different staff may clean your room each day.",
    },
  ],
  formula:
    "Tip = Bill Amount x (Country Base % x Service Quality Modifier); ranges vary by country and service type.",
};
