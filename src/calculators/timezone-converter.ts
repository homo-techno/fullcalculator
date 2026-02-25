import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timezoneConverter: CalculatorDefinition = {
  slug: "timezone-converter",
  title: "Time Zone Converter",
  description:
    "Free online time zone converter. Convert times between world time zones and calculate time differences for travel planning.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "timezone converter",
    "time zone",
    "world clock",
    "time difference",
    "convert time",
  ],
  variants: [
    {
      id: "convert-time",
      name: "Convert Time Between Zones",
      fields: [
        {
          name: "hour",
          label: "Hour (0-23)",
          type: "number",
          placeholder: "e.g. 14",
          min: 0,
          max: 23,
        },
        {
          name: "minute",
          label: "Minute (0-59)",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
          max: 59,
        },
        {
          name: "fromZone",
          label: "From Time Zone",
          type: "select",
          options: [
            { label: "EST (UTC-5) - New York", value: "-5" },
            { label: "CST (UTC-6) - Chicago", value: "-6" },
            { label: "MST (UTC-7) - Denver", value: "-7" },
            { label: "PST (UTC-8) - Los Angeles", value: "-8" },
            { label: "HST (UTC-10) - Hawaii", value: "-10" },
            { label: "GMT (UTC+0) - London", value: "0" },
            { label: "CET (UTC+1) - Paris/Berlin", value: "1" },
            { label: "EET (UTC+2) - Athens/Cairo", value: "2" },
            { label: "MSK (UTC+3) - Moscow", value: "3" },
            { label: "GST (UTC+4) - Dubai", value: "4" },
            { label: "IST (UTC+5:30) - India", value: "5.5" },
            { label: "ICT (UTC+7) - Bangkok", value: "7" },
            { label: "CST (UTC+8) - Beijing/Singapore", value: "8" },
            { label: "JST (UTC+9) - Tokyo", value: "9" },
            { label: "AEST (UTC+10) - Sydney", value: "10" },
            { label: "NZST (UTC+12) - Auckland", value: "12" },
          ],
        },
        {
          name: "toZone",
          label: "To Time Zone",
          type: "select",
          options: [
            { label: "EST (UTC-5) - New York", value: "-5" },
            { label: "CST (UTC-6) - Chicago", value: "-6" },
            { label: "MST (UTC-7) - Denver", value: "-7" },
            { label: "PST (UTC-8) - Los Angeles", value: "-8" },
            { label: "HST (UTC-10) - Hawaii", value: "-10" },
            { label: "GMT (UTC+0) - London", value: "0" },
            { label: "CET (UTC+1) - Paris/Berlin", value: "1" },
            { label: "EET (UTC+2) - Athens/Cairo", value: "2" },
            { label: "MSK (UTC+3) - Moscow", value: "3" },
            { label: "GST (UTC+4) - Dubai", value: "4" },
            { label: "IST (UTC+5:30) - India", value: "5.5" },
            { label: "ICT (UTC+7) - Bangkok", value: "7" },
            { label: "CST (UTC+8) - Beijing/Singapore", value: "8" },
            { label: "JST (UTC+9) - Tokyo", value: "9" },
            { label: "AEST (UTC+10) - Sydney", value: "10" },
            { label: "NZST (UTC+12) - Auckland", value: "12" },
          ],
        },
      ],
      calculate: (inputs) => {
        const hour = parseFloat(inputs.hour as string) || 0;
        const minute = parseFloat(inputs.minute as string) || 0;
        const fromZone = parseFloat(inputs.fromZone as string) || 0;
        const toZone = parseFloat(inputs.toZone as string) || 0;

        const diff = toZone - fromZone;
        let convertedHour = hour + diff;
        let dayShift = 0;

        if (convertedHour >= 24) {
          convertedHour -= 24;
          dayShift = 1;
        } else if (convertedHour < 0) {
          convertedHour += 24;
          dayShift = -1;
        }

        const convertedMinute = minute;
        const displayHour = Math.floor(convertedHour);
        const extraMinutes = Math.round((convertedHour - displayHour) * 60);
        const totalMinute = convertedMinute + extraMinutes;
        const finalMinute = totalMinute % 60;
        const finalHour = (displayHour + Math.floor(totalMinute / 60)) % 24;

        const pad = (n: number) => n.toString().padStart(2, "0");
        const fromTime = pad(hour) + ":" + pad(minute);
        const toTime = pad(finalHour) + ":" + pad(finalMinute);

        const ampmFrom = hour >= 12 ? "PM" : "AM";
        const ampmTo = finalHour >= 12 ? "PM" : "AM";
        const h12From = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const h12To = finalHour === 0 ? 12 : finalHour > 12 ? finalHour - 12 : finalHour;

        const dayText = dayShift === 1 ? " (next day)" : dayShift === -1 ? " (previous day)" : "";

        return {
          primary: {
            label: "Converted Time",
            value: toTime + dayText,
          },
          details: [
            { label: "From (24h)", value: fromTime },
            { label: "From (12h)", value: h12From + ":" + pad(minute) + " " + ampmFrom },
            { label: "To (24h)", value: toTime + dayText },
            { label: "To (12h)", value: h12To + ":" + pad(finalMinute) + " " + ampmTo + dayText },
            { label: "Time Difference", value: (diff >= 0 ? "+" : "") + formatNumber(diff, 1) + " hours" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["distance-between-cities", "vacation-days-needed", "travel-budget-daily"],
  faq: [
    {
      question: "How do time zones work?",
      answer:
        "The world is divided into 24 time zones, each roughly 15 degrees of longitude wide. Time zones are measured as offsets from UTC (Coordinated Universal Time). Moving east adds hours; moving west subtracts them.",
    },
    {
      question: "What about daylight saving time?",
      answer:
        "This calculator uses standard time offsets. During daylight saving time (spring/summer), clocks move forward 1 hour in participating regions. Not all countries observe DST.",
    },
    {
      question: "What is the International Date Line?",
      answer:
        "The International Date Line runs roughly along the 180th meridian in the Pacific Ocean. Crossing it westward adds a day; crossing eastward subtracts a day.",
    },
  ],
  formula:
    "Converted Time = Original Time + (Destination UTC Offset - Origin UTC Offset)\nIf result >= 24, subtract 24 and add 1 day",
};
