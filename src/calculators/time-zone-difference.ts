import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const TZ_OPTIONS = [
  { label: "UTC-12 (Baker Island)", value: "-12" },
  { label: "UTC-11 (Samoa)", value: "-11" },
  { label: "UTC-10 (Hawaii)", value: "-10" },
  { label: "UTC-9 (Alaska)", value: "-9" },
  { label: "UTC-8 (Pacific / LA)", value: "-8" },
  { label: "UTC-7 (Mountain / Denver)", value: "-7" },
  { label: "UTC-6 (Central / Chicago)", value: "-6" },
  { label: "UTC-5 (Eastern / NY)", value: "-5" },
  { label: "UTC-4 (Atlantic)", value: "-4" },
  { label: "UTC-3 (Buenos Aires)", value: "-3" },
  { label: "UTC-2 (Mid-Atlantic)", value: "-2" },
  { label: "UTC-1 (Azores)", value: "-1" },
  { label: "UTC+0 (London / GMT)", value: "0" },
  { label: "UTC+1 (Berlin / Paris)", value: "1" },
  { label: "UTC+2 (Cairo / Helsinki)", value: "2" },
  { label: "UTC+3 (Moscow / Istanbul)", value: "3" },
  { label: "UTC+3:30 (Tehran)", value: "3.5" },
  { label: "UTC+4 (Dubai)", value: "4" },
  { label: "UTC+4:30 (Kabul)", value: "4.5" },
  { label: "UTC+5 (Karachi)", value: "5" },
  { label: "UTC+5:30 (India)", value: "5.5" },
  { label: "UTC+5:45 (Nepal)", value: "5.75" },
  { label: "UTC+6 (Dhaka)", value: "6" },
  { label: "UTC+7 (Bangkok)", value: "7" },
  { label: "UTC+8 (Singapore / Beijing)", value: "8" },
  { label: "UTC+9 (Tokyo / Seoul)", value: "9" },
  { label: "UTC+9:30 (Adelaide)", value: "9.5" },
  { label: "UTC+10 (Sydney)", value: "10" },
  { label: "UTC+11 (Solomon Islands)", value: "11" },
  { label: "UTC+12 (Auckland)", value: "12" },
  { label: "UTC+13 (Tonga)", value: "13" },
];

export const timeZoneDifferenceCalculator: CalculatorDefinition = {
  slug: "time-zone-difference-calculator",
  title: "Time Zone Difference Calculator",
  description:
    "Free time zone difference calculator. Find the exact hour difference between any two time zones worldwide.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "time zone difference",
    "time difference between cities",
    "hours difference time zones",
    "time zone offset calculator",
    "time zone comparison",
  ],
  variants: [
    {
      id: "tz-diff",
      name: "Time Zone Difference",
      description: "Calculate the hour difference between two time zones",
      fields: [
        { name: "zone1", label: "First Time Zone", type: "select", options: TZ_OPTIONS, defaultValue: "-5" },
        { name: "zone2", label: "Second Time Zone", type: "select", options: TZ_OPTIONS, defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const z1 = parseFloat(inputs.zone1 as string);
        const z2 = parseFloat(inputs.zone2 as string);

        const diff = z2 - z1;
        const absDiff = Math.abs(diff);
        const diffHours = Math.floor(absDiff);
        const diffMinutes = Math.round((absDiff - diffHours) * 60);

        const z1Label = TZ_OPTIONS.find((z) => z.value === String(z1))?.label || `UTC${z1 >= 0 ? "+" : ""}${z1}`;
        const z2Label = TZ_OPTIONS.find((z) => z.value === String(z2))?.label || `UTC${z2 >= 0 ? "+" : ""}${z2}`;

        const direction = diff > 0 ? "ahead" : diff < 0 ? "behind" : "same as";
        const diffStr = diffMinutes > 0 ? `${diffHours}h ${diffMinutes}m` : `${diffHours}h`;

        // Current times in each zone
        const now = new Date();
        const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
        const time1 = new Date(utcMs + z1 * 3600000);
        const time2 = new Date(utcMs + z2 * 3600000);
        const fmt = (d: Date) => `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;

        return {
          primary: {
            label: "Time Difference",
            value: diff === 0 ? "Same time zone" : `${diffStr} ${direction}`,
          },
          details: [
            { label: "Zone 1", value: z1Label },
            { label: "Zone 2", value: z2Label },
            { label: "Offset difference", value: `${diff >= 0 ? "+" : ""}${diff} hours` },
            { label: "Current time in Zone 1", value: fmt(time1) },
            { label: "Current time in Zone 2", value: fmt(time2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "time-zone-converter",
    "meeting-time-calculator",
    "hours-calculator",
  ],
  faq: [
    {
      question: "How do I calculate the time difference between two cities?",
      answer:
        "Find each city's UTC offset and subtract them. For example, New York (UTC-5) and London (UTC+0) differ by 5 hours. London is 5 hours ahead of New York.",
    },
    {
      question: "Do time zone differences change with daylight saving time?",
      answer:
        "Yes. When one region observes DST and the other does not, the effective difference changes by 1 hour. For example, the UK-US Eastern difference is normally 5 hours but can be 4 or 6 during DST transition periods.",
    },
    {
      question: "What are half-hour and quarter-hour time zones?",
      answer:
        "Some regions use offsets that are not whole hours. India is UTC+5:30, Nepal is UTC+5:45, Iran is UTC+3:30, and parts of Australia use UTC+9:30.",
    },
  ],
  formula: "Difference = Zone 2 UTC Offset - Zone 1 UTC Offset",
};
