import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rideshareEarningsComparisonCalculator: CalculatorDefinition = {
  slug: "rideshare-earnings-comparison-calculator",
  title: "Uber vs Lyft Earnings Comparison Calculator",
  description:
    "Compare Uber vs Lyft driver earnings side by side. Estimate which platform pays more in your city based on hours, miles, and vehicle type.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Uber vs Lyft earnings comparison",
    "which pays more Uber or Lyft",
    "rideshare earnings comparison calculator",
    "Uber vs Lyft driver income",
    "best rideshare app for drivers",
  ],
  variants: [
    {
      id: "compare",
      name: "Uber vs Lyft Comparison",
      description: "Side-by-side earnings comparison",
      fields: [
        {
          name: "hoursPerWeek",
          label: "Hours Driving per Week",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "hours",
        },
        {
          name: "city",
          label: "City Tier",
          type: "select",
          options: [
            { label: "Top market (NYC, SF, LA, Chicago)", value: "top" },
            { label: "Mid-size market (Dallas, Denver, Seattle)", value: "mid" },
            { label: "Small market", value: "small" },
          ],
          defaultValue: "mid",
        },
        {
          name: "carType",
          label: "Vehicle Type",
          type: "select",
          options: [
            { label: "Standard (UberX / Lyft)", value: "standard" },
            { label: "XL / SUV (UberXL / Lyft XL)", value: "xl" },
            { label: "Comfort / Lux (higher tier)", value: "lux" },
          ],
          defaultValue: "standard",
        },
      ],
      calculate: (inputs) => {
        const hours = parseFloat(inputs.hoursPerWeek as string) || 0;
        const city = inputs.city as string;
        const carType = inputs.carType as string;

        // Estimated gross hourly rates by city and car type
        const uberGrossHourly: Record<string, Record<string, number>> = {
          top: { standard: 28, xl: 38, lux: 50 },
          mid: { standard: 22, xl: 30, lux: 40 },
          small: { standard: 16, xl: 22, lux: 28 },
        };
        const lyftGrossHourly: Record<string, Record<string, number>> = {
          top: { standard: 27, xl: 36, lux: 48 },
          mid: { standard: 21, xl: 29, lux: 38 },
          small: { standard: 15, xl: 21, lux: 26 },
        };

        const uberHourly = uberGrossHourly[city]?.[carType] || 22;
        const lyftHourly = lyftGrossHourly[city]?.[carType] || 21;
        const costPerHour = 8; // ~$0.20/mi × 40mi/hr avg

        const uberNetWeekly = (uberHourly - costPerHour) * hours * 0.70;
        const lyftNetWeekly = (lyftHourly - costPerHour) * hours * 0.70;

        return {
          primary: {
            label: uberNetWeekly >= lyftNetWeekly ? "Uber Pays More" : "Lyft Pays More",
            value: `$${formatNumber(Math.max(uberNetWeekly, lyftNetWeekly), 2)}/week net`,
          },
          details: [
            { label: "Uber gross hourly", value: `$${uberHourly}/hr` },
            { label: "Lyft gross hourly", value: `$${lyftHourly}/hr` },
            { label: "Vehicle cost per hour", value: `-$${costPerHour}/hr` },
            { label: "Uber weekly net (after tax)", value: `$${formatNumber(uberNetWeekly, 2)}` },
            { label: "Lyft weekly net (after tax)", value: `$${formatNumber(lyftNetWeekly, 2)}` },
            { label: "Monthly difference (Uber advantage)", value: `$${formatNumber(Math.abs(uberNetWeekly - lyftNetWeekly) * 4.33, 2)}` },
          ],
          note: "Earnings vary greatly by day/time. Drive both apps simultaneously using a mount for both phones to maximize trips and fill dead time.",
        };
      },
    },
  ],
  relatedSlugs: ["uber-driver-net-earnings-calculator", "lyft-driver-net-income-calculator", "gig-worker-hourly-rate-calculator"],
  faq: [
    {
      question: "Can I drive for both Uber and Lyft at the same time?",
      answer:
        "Yes, most drivers use both apps simultaneously. Accept whichever trip comes first. This significantly increases utilization and earnings since dead time between rides drops from 30–40% to 15–20%. Use a phone mount that holds two phones.",
    },
    {
      question: "Are Uber/Lyft bonuses worth it?",
      answer:
        "Surge bonuses and Quest bonuses (e.g., complete X trips for bonus $) can add 20–40% to hourly income during peak times. Friday/Saturday nights and special events are the best surge opportunities. Track your bonus opportunities in the driver app.",
    },
    {
      question: "What time is best to drive for Uber or Lyft?",
      answer:
        "Highest demand: Friday/Saturday nights (8pm–2am), weekday morning rush (7–9am), and afternoon rush (4–6pm). Airport runs offer consistent trips. Avoid driving Saturday/Sunday mornings (10am–2pm) — very low demand.",
    },
  ],
  formula: "Net Weekly = (Gross Hourly − Cost per Hour) × Hours × (1 − 30% tax)",
};
