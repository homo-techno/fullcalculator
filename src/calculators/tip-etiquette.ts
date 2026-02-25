import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const countryOptions = [
  { label: "United States (15-20%)", value: "us" },
  { label: "Canada (15-20%)", value: "canada" },
  { label: "United Kingdom (10-15%)", value: "uk" },
  { label: "France (5-10%, service included)", value: "france" },
  { label: "Germany (5-10%)", value: "germany" },
  { label: "Italy (5-10%)", value: "italy" },
  { label: "Spain (5-10%)", value: "spain" },
  { label: "Australia (0-10%)", value: "australia" },
  { label: "Japan (0%, not expected)", value: "japan" },
  { label: "China (0%, not expected)", value: "china" },
  { label: "South Korea (0%, not expected)", value: "korea" },
  { label: "Mexico (10-15%)", value: "mexico" },
  { label: "Brazil (10%, often included)", value: "brazil" },
  { label: "India (10%)", value: "india" },
  { label: "Thailand (0-10%)", value: "thailand" },
  { label: "UAE / Dubai (10-15%)", value: "uae" },
];

const tipRanges: Record<string, { low: number; mid: number; high: number; note: string }> = {
  us: { low: 15, mid: 18, high: 20, note: "Tipping is expected and customary" },
  canada: { low: 15, mid: 18, high: 20, note: "Similar to US tipping culture" },
  uk: { low: 10, mid: 12.5, high: 15, note: "Service charge sometimes included" },
  france: { low: 5, mid: 7, high: 10, note: "Service compris (included) is standard" },
  germany: { low: 5, mid: 7, high: 10, note: "Round up or add 5-10%" },
  italy: { low: 5, mid: 7, high: 10, note: "Coperto (cover charge) is common" },
  spain: { low: 5, mid: 7, high: 10, note: "Small tips for good service" },
  australia: { low: 0, mid: 5, high: 10, note: "Not expected, appreciated for great service" },
  japan: { low: 0, mid: 0, high: 0, note: "Tipping is not practiced and can be offensive" },
  china: { low: 0, mid: 0, high: 0, note: "Tipping is not customary" },
  korea: { low: 0, mid: 0, high: 0, note: "Tipping is not customary" },
  mexico: { low: 10, mid: 12, high: 15, note: "Propina is expected in restaurants" },
  brazil: { low: 10, mid: 10, high: 10, note: "10% service charge usually included" },
  india: { low: 7, mid: 10, high: 12, note: "Tip 10% in restaurants if no service charge" },
  thailand: { low: 0, mid: 5, high: 10, note: "Small tips appreciated but not required" },
  uae: { low: 10, mid: 12, high: 15, note: "Service charge sometimes added, tip on top is appreciated" },
};

export const tipEtiquetteCalculator: CalculatorDefinition = {
  slug: "tip-etiquette-calculator",
  title: "Tip Etiquette Calculator (by Country)",
  description:
    "Free tip etiquette calculator. Find out how much to tip in different countries, calculate the appropriate tip amount, and learn local tipping customs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "tip etiquette",
    "tipping by country",
    "international tipping",
    "tip calculator abroad",
    "how much to tip",
    "tipping customs",
  ],
  variants: [
    {
      id: "tip-by-country",
      name: "Tip by Country",
      description: "Calculate the appropriate tip based on country customs",
      fields: [
        {
          name: "country",
          label: "Country",
          type: "select",
          options: countryOptions,
        },
        {
          name: "billAmount",
          label: "Bill Amount",
          type: "number",
          placeholder: "e.g. 75",
          min: 0.01,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "serviceQuality",
          label: "Service Quality",
          type: "select",
          options: [
            { label: "Below average", value: "low" },
            { label: "Average", value: "mid" },
            { label: "Excellent", value: "high" },
          ],
        },
        {
          name: "partySize",
          label: "Party Size",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 50,
          defaultValue: 2,
        },
      ],
      calculate: (inputs) => {
        const country = (inputs.country as string) || "us";
        const bill = inputs.billAmount as number;
        const quality = (inputs.serviceQuality as string) || "mid";
        const partySize = (inputs.partySize as number) || 2;

        if (!bill) return null;

        const range = tipRanges[country];
        if (!range) return null;

        let tipPercent = range.mid;
        if (quality === "low") tipPercent = range.low;
        else if (quality === "high") tipPercent = range.high;

        // Large party auto-gratuity consideration
        const largePartyNote =
          partySize >= 6 && (country === "us" || country === "canada")
            ? "Tip of 18-20% is often auto-added for 6+ guests"
            : "";

        const tipAmount = bill * (tipPercent / 100);
        const totalWithTip = bill + tipAmount;
        const perPerson = totalWithTip / partySize;

        const countryLabel =
          countryOptions.find((o) => o.value === country)?.label ?? country;

        const details = [
          { label: "Country", value: countryLabel },
          { label: "Tip percentage", value: `${formatNumber(tipPercent, 1)}%` },
          { label: "Tip amount", value: `$${formatNumber(tipAmount, 2)}` },
          { label: "Total with tip", value: `$${formatNumber(totalWithTip, 2)}` },
          { label: "Per person", value: `$${formatNumber(perPerson, 2)}` },
          { label: "Local custom", value: range.note },
          { label: "Tip range", value: `${range.low}% - ${range.high}%` },
        ];

        if (largePartyNote) {
          details.push({ label: "Large party note", value: largePartyNote });
        }

        return {
          primary: {
            label: "Suggested Tip",
            value: `$${formatNumber(tipAmount, 2)}`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: [
    "tip-calculator",
    "tip-split-calculator",
    "currency-tip-calculator",
  ],
  faq: [
    {
      question: "Do I need to tip in Japan?",
      answer:
        "No. In Japan, tipping is not practiced and can actually be considered rude. Excellent service is the standard and is included in the price. Simply pay the bill amount.",
    },
    {
      question: "How much should I tip in the United States?",
      answer:
        "In US restaurants, 15-20% of the pre-tax bill is standard. 15% for average service, 18% for good service, and 20%+ for excellent service. Many people tip 20% as a default.",
    },
  ],
  formula:
    "Tip Amount = Bill x (Tip Percentage / 100). Total = Bill + Tip. Per Person = Total / Party Size.",
};
