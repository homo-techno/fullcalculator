import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cyclingPowerCalculator: CalculatorDefinition = {
  slug: "cycling-power-calculator",
  title: "Cycling Power Calculator",
  description:
    "Free cycling power and FTP calculator. Estimate your Functional Threshold Power from a 20-minute test and view training zones.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["cycling power", "FTP", "functional threshold power", "training zones"],
  variants: [
    {
      id: "ftpEstimate",
      name: "FTP from 20-Min Test",
      fields: [
        {
          name: "avgPower20",
          label: "20-Min Average Power (watts)",
          type: "number",
          placeholder: "e.g. 250",
        },
        {
          name: "weight",
          label: "Body Weight (kg)",
          type: "number",
          placeholder: "e.g. 75",
        },
      ],
      calculate: (inputs) => {
        const avgPower20 = inputs.avgPower20 as number;
        const weight = inputs.weight as number;
        if (!avgPower20) return null;

        const ftp = avgPower20 * 0.95;
        const wpkg = weight ? ftp / weight : 0;

        const zones = [
          { zone: "Zone 1 \u2013 Active Recovery", min: 0, max: 0.55 },
          { zone: "Zone 2 \u2013 Endurance", min: 0.56, max: 0.75 },
          { zone: "Zone 3 \u2013 Tempo", min: 0.76, max: 0.9 },
          { zone: "Zone 4 \u2013 Lactate Threshold", min: 0.91, max: 1.05 },
          { zone: "Zone 5 \u2013 VO2 Max", min: 1.06, max: 1.2 },
          { zone: "Zone 6 \u2013 Anaerobic Capacity", min: 1.21, max: 1.5 },
          { zone: "Zone 7 \u2013 Neuromuscular Power", min: 1.51, max: 2.0 },
        ];

        const details = zones.map((z) => ({
          label: z.zone,
          value: `${formatNumber(ftp * z.min, 0)}\u2013${formatNumber(ftp * z.max, 0)} W`,
        }));

        return {
          primary: {
            label: "Estimated FTP",
            value: `${formatNumber(ftp, 0)} W`,
          },
          details: [
            { label: "20-Min Average", value: `${formatNumber(avgPower20, 0)} W` },
            ...(weight
              ? [{ label: "Power-to-Weight", value: `${formatNumber(wpkg, 2)} W/kg` }]
              : []),
            ...details,
          ],
        };
      },
    },
  ],
  relatedSlugs: ["exercise-calorie-calculator", "training-zone-calculator"],
  faq: [
    {
      question: "What is FTP in cycling?",
      answer:
        "FTP (Functional Threshold Power) is the highest average power you can sustain for approximately one hour. It is commonly estimated from a 20-minute all-out test by multiplying the average power by 0.95.",
    },
    {
      question: "What are cycling training zones?",
      answer:
        "Cycling training zones (1\u20137) are power ranges expressed as percentages of FTP that target different physiological adaptations, from active recovery to neuromuscular sprinting.",
    },
  ],
  formula:
    "FTP = 20-min average power \u00D7 0.95. Zones are percentages of FTP: Z1 <55%, Z2 56\u201375%, Z3 76\u201390%, Z4 91\u2013105%, Z5 106\u2013120%, Z6 121\u2013150%, Z7 >150%.",
};
