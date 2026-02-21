import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const timeUnits: Record<string, number> = {
  s: 1, ms: 0.001, min: 60, hr: 3600, day: 86400,
  week: 604800, month: 2592000, year: 31536000,
};
const unitLabels: Record<string, string> = {
  s: "Seconds", ms: "Milliseconds", min: "Minutes", hr: "Hours",
  day: "Days", week: "Weeks", month: "Months (30d)", year: "Years (365d)",
};

export const timeConverter: CalculatorDefinition = {
  slug: "time-converter",
  title: "Time Converter",
  description: "Free time converter. Convert between seconds, minutes, hours, days, weeks, months, and years.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["time converter", "hours to minutes", "days to hours", "minutes to seconds", "time conversion"],
  variants: [
    {
      id: "convert",
      name: "Convert Time",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 24" },
        {
          name: "from", label: "From", type: "select",
          options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })),
        },
        {
          name: "to", label: "To", type: "select",
          options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })),
        },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "hr";
        const to = (inputs.to as string) || "min";
        if (!val) return null;
        const seconds = val * (timeUnits[from] || 1);
        const result = seconds / (timeUnits[to] || 1);
        return {
          primary: { label: `${val} ${unitLabels[from] || from}`, value: `${formatNumber(result, 6)} ${unitLabels[to] || to}` },
          details: [
            { label: "Seconds", value: formatNumber(seconds, 4) },
            { label: "Minutes", value: formatNumber(seconds / 60, 4) },
            { label: "Hours", value: formatNumber(seconds / 3600, 4) },
            { label: "Days", value: formatNumber(seconds / 86400, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["time-duration-calculator", "time-zone-converter", "date-calculator"],
  faq: [{ question: "How many seconds in a day?", answer: "1 day = 24 hours = 1,440 minutes = 86,400 seconds. 1 week = 168 hours = 604,800 seconds. 1 year = 365 days = 8,760 hours = 525,600 minutes = 31,536,000 seconds." }],
  formula: "1 day = 24 hr = 1,440 min = 86,400 sec",
};
