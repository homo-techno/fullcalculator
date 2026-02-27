import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const globalEntryRoiCalculator: CalculatorDefinition = {
  slug: "global-entry-roi",
  title: "Global Entry / TSA PreCheck ROI Calculator",
  description:
    "Calculate the return on investment for Global Entry or TSA PreCheck based on your travel frequency. Compare time savings and convenience value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Global Entry",
    "TSA PreCheck",
    "trusted traveler",
    "airport security",
    "travel",
    "ROI",
    "time savings",
    "CBP",
    "customs",
    "expedited",
  ],
  variants: [
    {
      slug: "roi-calculator",
      title: "Trusted Traveler ROI",
      fields: [
        {
          name: "program",
          label: "Program",
          type: "select",
          options: [
            { label: "TSA PreCheck ($78 / 5 years)", value: "precheck" },
            { label: "Global Entry ($120 / 5 years)", value: "global" },
            { label: "NEXUS ($50 / 5 years, US-Canada)", value: "nexus" },
          ],
        },
        {
          name: "domesticTrips",
          label: "Domestic Round Trips per Year",
          type: "number",
        },
        {
          name: "internationalTrips",
          label: "International Round Trips per Year",
          type: "number",
        },
        {
          name: "hourlyValue",
          label: "Value of Your Time ($/hour)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const program = inputs.program as string;
        const domestic = parseFloat(inputs.domesticTrips as string);
        const international = parseFloat(inputs.internationalTrips as string);
        const hourlyValue = parseFloat(inputs.hourlyValue as string);
        if (isNaN(domestic) || isNaN(international) || isNaN(hourlyValue))
          return { error: "Please enter all values." };

        const costs: Record<string, { fee: number; years: number }> = {
          precheck: { fee: 78, years: 5 },
          global: { fee: 120, years: 5 },
          nexus: { fee: 50, years: 5 },
        };

        const info = costs[program];
        const costPerYear = info.fee / info.years;
        const totalSecurityScreenings = domestic * 2 + international * 2;

        const precheckTimeSavedMin = 20;
        const customsTimeSavedMin = 30;

        const securityTimeSaved = totalSecurityScreenings * precheckTimeSavedMin;
        const customsTimeSaved = program !== "precheck" ? international * 2 * customsTimeSavedMin : 0;
        const totalTimeSavedMin = securityTimeSaved + customsTimeSaved;
        const totalTimeSavedHrs = totalTimeSavedMin / 60;
        const annualTimeSavedHrs = totalTimeSavedHrs;
        const fiveYearTimeSavedHrs = annualTimeSavedHrs * 5;

        const annualValueSaved = annualTimeSavedHrs * hourlyValue;
        const fiveYearValueSaved = annualValueSaved * 5;
        const roi = ((fiveYearValueSaved - info.fee) / info.fee) * 100;
        const costPerTrip = info.fee / ((domestic + international) * 5);

        return {
          results: [
            { label: "Program Cost", value: `$${formatNumber(info.fee)} / ${info.years} years` },
            { label: "Cost per Year", value: `$${formatNumber(costPerYear)}` },
            { label: "Cost per Trip", value: `$${formatNumber(costPerTrip)}` },
            { label: "Annual Time Saved", value: `${formatNumber(annualTimeSavedHrs)} hours` },
            { label: "5-Year Time Saved", value: `${formatNumber(fiveYearTimeSavedHrs)} hours` },
            { label: "Annual Value of Time Saved", value: `$${formatNumber(annualValueSaved)}` },
            { label: "5-Year Value of Time Saved", value: `$${formatNumber(fiveYearValueSaved)}` },
            { label: "5-Year ROI", value: `${formatNumber(roi)}%` },
          ],
        };
      },
    },
    {
      slug: "breakeven-trips",
      title: "Break-Even Trip Calculator",
      fields: [
        {
          name: "program",
          label: "Program",
          type: "select",
          options: [
            { label: "TSA PreCheck ($78)", value: "78" },
            { label: "Global Entry ($120)", value: "120" },
            { label: "NEXUS ($50)", value: "50" },
          ],
        },
        {
          name: "hourlyValue",
          label: "Value of Your Time ($/hour)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const fee = parseFloat(inputs.program as string);
        const hourlyValue = parseFloat(inputs.hourlyValue as string);
        if (isNaN(fee) || isNaN(hourlyValue))
          return { error: "Please enter all values." };

        const timeSavedPerTrip = 20 / 60;
        const valueSavedPerTrip = timeSavedPerTrip * hourlyValue;
        const tripsToBreakEven = valueSavedPerTrip > 0 ? fee / valueSavedPerTrip : 0;
        const tripsPerYear = tripsToBreakEven / 5;
        const stressSavings = fee * 0.5;

        return {
          results: [
            { label: "Program Fee", value: `$${formatNumber(fee)}` },
            { label: "Time Saved per Trip", value: `${formatNumber(timeSavedPerTrip * 60)} minutes` },
            { label: "Value Saved per Trip", value: `$${formatNumber(valueSavedPerTrip)}` },
            { label: "Trips to Break Even", value: formatNumber(tripsToBreakEven) },
            { label: "Trips per Year Needed", value: formatNumber(tripsPerYear) },
            { label: "Convenience Value (subjective)", value: "Significant - skip lines, keep shoes/belt on" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["passport-renewal-time", "moving-timeline", "turo-profit"],
  faq: [
    {
      question: "What is the difference between TSA PreCheck and Global Entry?",
      answer:
        "TSA PreCheck ($78/5 years) provides expedited security screening at US airports. Global Entry ($120/5 years) includes TSA PreCheck benefits plus expedited customs and immigration clearance when entering the US from international travel. Global Entry is the better value for international travelers.",
    },
    {
      question: "How long does Global Entry approval take?",
      answer:
        "The application takes about 15 minutes to complete online. Conditional approval can take 2 weeks to 6 months. After conditional approval, you must complete an in-person interview at a Global Entry Enrollment Center, which may have wait times of 1-3 months depending on location.",
    },
    {
      question: "Can my credit card reimburse the Global Entry fee?",
      answer:
        "Many premium travel credit cards reimburse the Global Entry or TSA PreCheck fee as a cardholder perk, including the Chase Sapphire Reserve, AmEx Platinum, Capital One Venture X, and others. Check your card benefits - this effectively makes the program free.",
    },
  ],
  formula:
    "ROI = ((5-Year Value Saved - Fee) / Fee) x 100 | Value Saved = Time Saved (hrs) x Hourly Rate | Time Saved = Trips x ~20 min (security) + International x ~30 min (customs) | Break-Even = Fee / Value per Trip",
};
