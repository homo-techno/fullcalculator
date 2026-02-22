import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ledSavingsCalculator: CalculatorDefinition = {
  slug: "led-savings-calculator",
  title: "LED Bulb Savings Calculator",
  description:
    "Free LED bulb savings calculator. Compare energy costs and savings when switching from incandescent or CFL bulbs to LED lighting.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "led savings",
    "led bulb",
    "lighting savings",
    "led vs incandescent",
    "led energy savings",
    "light bulb comparison",
  ],
  variants: [
    {
      id: "compare",
      name: "LED vs Traditional Bulbs",
      fields: [
        {
          name: "numBulbs",
          label: "Number of Bulbs to Replace",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "currentType",
          label: "Current Bulb Type",
          type: "select",
          options: [
            { label: "Incandescent (60W)", value: "60" },
            { label: "Incandescent (75W)", value: "75" },
            { label: "Incandescent (100W)", value: "100" },
            { label: "CFL (13W)", value: "13" },
            { label: "CFL (23W)", value: "23" },
          ],
        },
        {
          name: "hoursPerDay",
          label: "Hours Used per Day",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "electricRate",
          label: "Electricity Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.13",
          defaultValue: 0.13,
        },
      ],
      calculate: (inputs) => {
        const numBulbs = inputs.numBulbs as number;
        const currentWatts = parseFloat((inputs.currentType as string) || "60");
        const hoursPerDay = inputs.hoursPerDay as number;
        const rate = (inputs.electricRate as number) || 0.13;
        if (!numBulbs || !hoursPerDay) return null;

        // LED equivalent wattage (approximately)
        const ledWatts = currentWatts <= 13 ? 8 : currentWatts <= 23 ? 10 : currentWatts <= 60 ? 9 : currentWatts <= 75 ? 11 : 14;

        const annualHours = hoursPerDay * 365;
        const currentKwh = (currentWatts * numBulbs * annualHours) / 1000;
        const ledKwh = (ledWatts * numBulbs * annualHours) / 1000;
        const savedKwh = currentKwh - ledKwh;
        const savedDollars = savedKwh * rate;
        const co2SavedLbs = savedKwh * 0.92;

        const ledBulbCost = numBulbs * 3; // avg $3 per LED
        const paybackMonths = ledBulbCost / (savedDollars / 12);
        const tenYearSavings = savedDollars * 10 - ledBulbCost;

        return {
          primary: {
            label: "Annual Savings",
            value: "$" + formatNumber(savedDollars, 2),
          },
          details: [
            { label: "Energy Saved/Year", value: formatNumber(savedKwh, 0) + " kWh" },
            { label: "Old Usage/Year", value: formatNumber(currentKwh, 0) + " kWh" },
            { label: "LED Usage/Year", value: formatNumber(ledKwh, 0) + " kWh" },
            { label: "CO2 Saved/Year", value: formatNumber(co2SavedLbs, 0) + " lbs" },
            { label: "LED Bulb Cost", value: "$" + formatNumber(ledBulbCost, 0) },
            { label: "Payback Period", value: formatNumber(paybackMonths, 1) + " months" },
            { label: "10-Year Net Savings", value: "$" + formatNumber(tenYearSavings, 0) },
          ],
          note: "LED bulbs also last 15,000-50,000 hours vs 1,000 hours for incandescent, reducing replacement costs significantly.",
        };
      },
    },
  ],
  relatedSlugs: ["energy-audit-calculator", "electricity-cost-calculator"],
  faq: [
    {
      question: "How much can LED bulbs really save?",
      answer:
        "LED bulbs use 75-85% less energy than incandescent bulbs. For a typical household with 30 bulbs, switching to LED can save $200-$300 per year on electricity bills.",
    },
    {
      question: "How long do LED bulbs last?",
      answer:
        "Quality LED bulbs last 15,000-50,000 hours, compared to 1,000 hours for incandescent and 8,000-10,000 hours for CFL bulbs. At 5 hours per day, an LED bulb can last 8-27 years.",
    },
  ],
  formula:
    "Annual Savings = ((Old Watts - LED Watts) x Bulbs x Hours/Day x 365 / 1000) x Rate. Payback = LED Cost / (Monthly Savings).",
};
