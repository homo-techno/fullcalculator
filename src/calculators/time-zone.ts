import type { CalculatorDefinition } from "./types";

const ZONES = [
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
  { label: "UTC+4 (Dubai)", value: "4" },
  { label: "UTC+5 (Karachi)", value: "5" },
  { label: "UTC+5:30 (India)", value: "5.5" },
  { label: "UTC+6 (Dhaka)", value: "6" },
  { label: "UTC+7 (Bangkok)", value: "7" },
  { label: "UTC+8 (Singapore / Beijing)", value: "8" },
  { label: "UTC+9 (Tokyo / Seoul)", value: "9" },
  { label: "UTC+10 (Sydney)", value: "10" },
  { label: "UTC+11 (Solomon Islands)", value: "11" },
  { label: "UTC+12 (Auckland)", value: "12" },
];

export const timeZoneConverter: CalculatorDefinition = {
  slug: "time-zone-converter",
  title: "Time Zone Converter",
  description: "Free time zone converter. Convert time between any two time zones. See what time it is in other cities around the world.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["time zone converter", "time zone calculator", "time difference calculator", "world clock", "time converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Time Zone",
      description: "Convert a time from one time zone to another",
      fields: [
        { name: "hour", label: "Hour (0-23)", type: "number", placeholder: "e.g. 14", min: 0, max: 23 },
        { name: "minute", label: "Minute", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
        { name: "from", label: "From Time Zone", type: "select", options: ZONES, defaultValue: "-5" },
        { name: "to", label: "To Time Zone", type: "select", options: ZONES, defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const hour = inputs.hour as number;
        const minute = (inputs.minute as number) || 0;
        const fromOffset = parseFloat(inputs.from as string);
        const toOffset = parseFloat(inputs.to as string);
        if (hour === undefined) return null;

        const diff = toOffset - fromOffset;
        let targetHour = hour + diff;
        let dayShift = "";

        if (targetHour >= 24) {
          targetHour -= 24;
          dayShift = " (next day)";
        } else if (targetHour < 0) {
          targetHour += 24;
          dayShift = " (previous day)";
        }

        const fromLabel = ZONES.find((z) => z.value === String(fromOffset))?.label || `UTC${fromOffset >= 0 ? "+" : ""}${fromOffset}`;
        const toLabel = ZONES.find((z) => z.value === String(toOffset))?.label || `UTC${toOffset >= 0 ? "+" : ""}${toOffset}`;

        return {
          primary: {
            label: `${Math.floor(hour).toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} in ${fromLabel}`,
            value: `${Math.floor(targetHour).toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}${dayShift}`,
          },
          details: [
            { label: "Time difference", value: `${diff >= 0 ? "+" : ""}${diff} hours` },
            { label: "Target zone", value: toLabel },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["date-calculator", "age-calculator"],
  faq: [
    { question: "How do time zones work?", answer: "The world is divided into 24 time zones, each roughly 15 degrees of longitude. UTC (Coordinated Universal Time) is the reference. Eastern US is UTC-5, London is UTC+0, Tokyo is UTC+9." },
    { question: "What is UTC?", answer: "UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks. It replaced GMT as the international standard. UTC+0 is equivalent to GMT." },
  ],
  formula: "Target Time = Source Time + (Target UTC Offset - Source UTC Offset)",
};
