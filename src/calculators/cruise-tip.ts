import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cruiseTip: CalculatorDefinition = {
  slug: "cruise-tip",
  title: "Cruise Tip Calculator",
  description:
    "Free online cruise tip calculator. Calculate cruise ship tipping and gratuity amounts by cruise line and service type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cruise tip",
    "cruise gratuity",
    "cruise tipping",
    "ship gratuity",
    "cruise service charge",
  ],
  variants: [
    {
      id: "auto-gratuity",
      name: "Auto-Gratuity Estimate",
      fields: [
        {
          name: "cruiseLine",
          label: "Cruise Line",
          type: "select",
          options: [
            { label: "Carnival Cruise Line", value: "carnival" },
            { label: "Royal Caribbean", value: "royal" },
            { label: "Norwegian Cruise Line", value: "norwegian" },
            { label: "MSC Cruises", value: "msc" },
            { label: "Princess Cruises", value: "princess" },
            { label: "Celebrity Cruises", value: "celebrity" },
            { label: "Holland America", value: "holland" },
            { label: "Disney Cruise Line", value: "disney" },
          ],
        },
        {
          name: "nights",
          label: "Number of Cruise Nights",
          type: "number",
          placeholder: "e.g. 7",
        },
        {
          name: "passengers",
          label: "Number of Passengers",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "cabinType",
          label: "Cabin Type",
          type: "select",
          options: [
            { label: "Interior", value: "interior" },
            { label: "Ocean View", value: "ocean" },
            { label: "Balcony", value: "balcony" },
            { label: "Suite", value: "suite" },
          ],
        },
      ],
      calculate: (inputs) => {
        const nights = parseFloat(inputs.nights as string) || 0;
        const passengers = parseFloat(inputs.passengers as string) || 1;
        const cruiseLine = inputs.cruiseLine as string;
        const cabinType = inputs.cabinType as string;

        // Daily auto-gratuity per person (standard cabin)
        const dailyGratuities: Record<string, number> = {
          carnival: 16.0,
          royal: 16.0,
          norwegian: 16.0,
          msc: 14.0,
          princess: 16.0,
          celebrity: 18.0,
          holland: 16.0,
          disney: 14.5,
        };

        const suiteUpcharge: Record<string, number> = {
          interior: 0,
          ocean: 0,
          balcony: 0,
          suite: 2.0,
        };

        const dailyRate = (dailyGratuities[cruiseLine] || 16.0) + (suiteUpcharge[cabinType] || 0);
        const totalAutoGratuity = dailyRate * nights * passengers;
        const barTipEstimate = 15 * nights * passengers * 0.18;
        const spaEstimate = 50 * passengers * 0.18;
        const excursionTipEstimate = 10 * passengers;
        const totalEstimate = totalAutoGratuity + barTipEstimate + spaEstimate + excursionTipEstimate;

        return {
          primary: { label: "Total Gratuity Estimate", value: "$" + formatNumber(totalEstimate, 2) },
          details: [
            { label: "Auto-Gratuity (included)", value: "$" + formatNumber(totalAutoGratuity, 2) },
            { label: "Daily Rate/Person", value: "$" + formatNumber(dailyRate, 2) },
            { label: "Bar/Beverage Tips (est.)", value: "$" + formatNumber(barTipEstimate, 2) },
            { label: "Spa Tips (est.)", value: "$" + formatNumber(spaEstimate, 2) },
            { label: "Excursion Tips (est.)", value: "$" + formatNumber(excursionTipEstimate, 2) },
            { label: "Per Person Total", value: "$" + formatNumber(totalEstimate / passengers, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["travel-tip-guide", "beach-vacation-cost", "travel-budget-daily"],
  faq: [
    {
      question: "Are gratuities included on cruise ships?",
      answer:
        "Most major cruise lines automatically add daily gratuities of $14-18 per person per day to your onboard account. These cover your cabin steward, dining team, and other service staff.",
    },
    {
      question: "Can I remove auto-gratuities?",
      answer:
        "While most cruise lines allow you to adjust or remove auto-gratuities at Guest Services, it is generally discouraged as crew members rely on these tips as a significant part of their income.",
    },
    {
      question: "Should I tip extra on a cruise?",
      answer:
        "Extra tips are appreciated for exceptional service. Common extra tips include cash for your cabin steward ($20-50 for the voyage), bartenders (18% is often auto-added to bar tabs), and spa staff (15-20% of service cost).",
    },
  ],
  formula:
    "Total Gratuity = (Daily Rate x Nights x Passengers) + Bar Tips + Spa Tips + Excursion Tips",
};
