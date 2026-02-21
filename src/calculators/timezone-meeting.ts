import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timezoneMeetingCalculator: CalculatorDefinition = {
  slug: "timezone-meeting-calculator",
  title: "Time Zone Meeting Planner",
  description:
    "Free time zone meeting planner. Find the best meeting time across multiple time zones and convert times for international teams.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "timezone meeting",
    "time zone converter",
    "meeting planner",
    "world clock",
    "international meeting time",
  ],
  variants: [
    {
      id: "convert",
      name: "Convert Time Between Zones",
      description: "Convert a specific time between two time zones",
      fields: [
        {
          name: "hour",
          label: "Hour (1-12)",
          type: "number",
          placeholder: "e.g. 9",
          min: 1,
          max: 12,
        },
        {
          name: "minutes",
          label: "Minutes",
          type: "select",
          options: [
            { label: "00", value: "0" },
            { label: "15", value: "15" },
            { label: "30", value: "30" },
            { label: "45", value: "45" },
          ],
          defaultValue: "0",
        },
        {
          name: "period",
          label: "AM/PM",
          type: "select",
          options: [
            { label: "AM", value: "AM" },
            { label: "PM", value: "PM" },
          ],
          defaultValue: "AM",
        },
        {
          name: "fromZone",
          label: "From Time Zone (UTC offset)",
          type: "select",
          options: [
            { label: "UTC-12 (Baker Island)", value: "-12" },
            { label: "UTC-10 (Hawaii)", value: "-10" },
            { label: "UTC-9 (Alaska)", value: "-9" },
            { label: "UTC-8 (Pacific / LA)", value: "-8" },
            { label: "UTC-7 (Mountain / Denver)", value: "-7" },
            { label: "UTC-6 (Central / Chicago)", value: "-6" },
            { label: "UTC-5 (Eastern / NYC)", value: "-5" },
            { label: "UTC-4 (Atlantic)", value: "-4" },
            { label: "UTC-3 (Buenos Aires)", value: "-3" },
            { label: "UTC+0 (London / GMT)", value: "0" },
            { label: "UTC+1 (Paris / Berlin)", value: "1" },
            { label: "UTC+2 (Cairo / Athens)", value: "2" },
            { label: "UTC+3 (Moscow / Dubai-1)", value: "3" },
            { label: "UTC+4 (Dubai)", value: "4" },
            { label: "UTC+5 (Pakistan)", value: "5" },
            { label: "UTC+5.5 (India)", value: "5.5" },
            { label: "UTC+7 (Bangkok)", value: "7" },
            { label: "UTC+8 (Singapore / Beijing)", value: "8" },
            { label: "UTC+9 (Tokyo / Seoul)", value: "9" },
            { label: "UTC+10 (Sydney)", value: "10" },
            { label: "UTC+12 (Auckland)", value: "12" },
          ],
          defaultValue: "-5",
        },
        {
          name: "toZone",
          label: "To Time Zone (UTC offset)",
          type: "select",
          options: [
            { label: "UTC-12 (Baker Island)", value: "-12" },
            { label: "UTC-10 (Hawaii)", value: "-10" },
            { label: "UTC-9 (Alaska)", value: "-9" },
            { label: "UTC-8 (Pacific / LA)", value: "-8" },
            { label: "UTC-7 (Mountain / Denver)", value: "-7" },
            { label: "UTC-6 (Central / Chicago)", value: "-6" },
            { label: "UTC-5 (Eastern / NYC)", value: "-5" },
            { label: "UTC-4 (Atlantic)", value: "-4" },
            { label: "UTC-3 (Buenos Aires)", value: "-3" },
            { label: "UTC+0 (London / GMT)", value: "0" },
            { label: "UTC+1 (Paris / Berlin)", value: "1" },
            { label: "UTC+2 (Cairo / Athens)", value: "2" },
            { label: "UTC+3 (Moscow / Dubai-1)", value: "3" },
            { label: "UTC+4 (Dubai)", value: "4" },
            { label: "UTC+5 (Pakistan)", value: "5" },
            { label: "UTC+5.5 (India)", value: "5.5" },
            { label: "UTC+7 (Bangkok)", value: "7" },
            { label: "UTC+8 (Singapore / Beijing)", value: "8" },
            { label: "UTC+9 (Tokyo / Seoul)", value: "9" },
            { label: "UTC+10 (Sydney)", value: "10" },
            { label: "UTC+12 (Auckland)", value: "12" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const hour = inputs.hour as number;
        const minutes = parseInt(inputs.minutes as string) || 0;
        const period = inputs.period as string;
        const fromZone = parseFloat(inputs.fromZone as string);
        const toZone = parseFloat(inputs.toZone as string);
        if (!hour || hour < 1 || hour > 12) return null;

        let hour24 = hour;
        if (period === "AM" && hour === 12) hour24 = 0;
        else if (period === "PM" && hour !== 12) hour24 = hour + 12;

        const diff = toZone - fromZone;
        let targetHour24 = hour24 + diff;
        let dayOffset = 0;

        if (targetHour24 >= 24) {
          dayOffset = Math.floor(targetHour24 / 24);
          targetHour24 = targetHour24 % 24;
        } else if (targetHour24 < 0) {
          dayOffset = Math.floor(targetHour24 / 24);
          targetHour24 = ((targetHour24 % 24) + 24) % 24;
        }

        const targetHour12 = targetHour24 === 0 ? 12 : targetHour24 > 12 ? targetHour24 - 12 : targetHour24;
        const targetPeriod = targetHour24 >= 12 ? "PM" : "AM";
        const minuteStr = minutes.toString().padStart(2, "0");
        const dayStr = dayOffset === 0 ? "same day" : dayOffset === 1 ? "next day" : dayOffset === -1 ? "previous day" : `${dayOffset > 0 ? "+" : ""}${dayOffset} days`;

        const isBusinessHours = targetHour24 >= 9 && targetHour24 < 17;

        return {
          primary: {
            label: "Converted Time",
            value: `${Math.floor(targetHour12)}:${minuteStr} ${targetPeriod}`,
          },
          details: [
            { label: "Original time", value: `${hour}:${minuteStr} ${period} (UTC${fromZone >= 0 ? "+" : ""}${fromZone})` },
            { label: "Converted time", value: `${Math.floor(targetHour12)}:${minuteStr} ${targetPeriod} (UTC${toZone >= 0 ? "+" : ""}${toZone})` },
            { label: "Time difference", value: `${diff >= 0 ? "+" : ""}${diff} hours` },
            { label: "Day", value: dayStr },
            { label: "Business hours?", value: isBusinessHours ? "Yes (9 AM - 5 PM)" : "No (outside 9 AM - 5 PM)" },
          ],
          note: isBusinessHours
            ? "This time falls within standard business hours (9 AM - 5 PM) in the target time zone."
            : "This time falls outside standard business hours in the target time zone. Consider choosing a different time.",
        };
      },
    },
    {
      id: "overlap",
      name: "Find Overlapping Business Hours",
      description: "Find overlapping business hours between two time zones",
      fields: [
        {
          name: "zone1",
          label: "Time Zone 1 (UTC offset)",
          type: "select",
          options: [
            { label: "UTC-8 (Pacific / LA)", value: "-8" },
            { label: "UTC-7 (Mountain / Denver)", value: "-7" },
            { label: "UTC-6 (Central / Chicago)", value: "-6" },
            { label: "UTC-5 (Eastern / NYC)", value: "-5" },
            { label: "UTC+0 (London / GMT)", value: "0" },
            { label: "UTC+1 (Paris / Berlin)", value: "1" },
            { label: "UTC+2 (Cairo / Athens)", value: "2" },
            { label: "UTC+5.5 (India)", value: "5.5" },
            { label: "UTC+8 (Singapore / Beijing)", value: "8" },
            { label: "UTC+9 (Tokyo / Seoul)", value: "9" },
            { label: "UTC+10 (Sydney)", value: "10" },
          ],
          defaultValue: "-5",
        },
        {
          name: "zone2",
          label: "Time Zone 2 (UTC offset)",
          type: "select",
          options: [
            { label: "UTC-8 (Pacific / LA)", value: "-8" },
            { label: "UTC-7 (Mountain / Denver)", value: "-7" },
            { label: "UTC-6 (Central / Chicago)", value: "-6" },
            { label: "UTC-5 (Eastern / NYC)", value: "-5" },
            { label: "UTC+0 (London / GMT)", value: "0" },
            { label: "UTC+1 (Paris / Berlin)", value: "1" },
            { label: "UTC+2 (Cairo / Athens)", value: "2" },
            { label: "UTC+5.5 (India)", value: "5.5" },
            { label: "UTC+8 (Singapore / Beijing)", value: "8" },
            { label: "UTC+9 (Tokyo / Seoul)", value: "9" },
            { label: "UTC+10 (Sydney)", value: "10" },
          ],
          defaultValue: "0",
        },
        {
          name: "workStart",
          label: "Business Hours Start",
          type: "select",
          options: [
            { label: "8:00 AM", value: "8" },
            { label: "9:00 AM", value: "9" },
            { label: "10:00 AM", value: "10" },
          ],
          defaultValue: "9",
        },
        {
          name: "workEnd",
          label: "Business Hours End",
          type: "select",
          options: [
            { label: "5:00 PM", value: "17" },
            { label: "6:00 PM", value: "18" },
            { label: "7:00 PM", value: "19" },
          ],
          defaultValue: "17",
        },
      ],
      calculate: (inputs) => {
        const zone1 = parseFloat(inputs.zone1 as string);
        const zone2 = parseFloat(inputs.zone2 as string);
        const workStart = parseInt(inputs.workStart as string);
        const workEnd = parseInt(inputs.workEnd as string);

        const z1Start = workStart - zone1;
        const z1End = workEnd - zone1;
        const z2Start = workStart - zone2;
        const z2End = workEnd - zone2;

        const overlapStart = Math.max(z1Start, z2Start);
        const overlapEnd = Math.min(z1End, z2End);
        const overlapHours = Math.max(0, overlapEnd - overlapStart);

        const to12 = (h: number, offset: number) => {
          let local = ((h + offset) % 24 + 24) % 24;
          const p = local >= 12 ? "PM" : "AM";
          local = local > 12 ? local - 12 : local === 0 ? 12 : local;
          return `${local}:00 ${p}`;
        };

        const zone1OverlapStart = to12(overlapStart, zone1);
        const zone1OverlapEnd = to12(overlapEnd, zone1);
        const zone2OverlapStart = to12(overlapStart, zone2);
        const zone2OverlapEnd = to12(overlapEnd, zone2);

        const diff = Math.abs(zone1 - zone2);

        return {
          primary: {
            label: "Overlapping Hours",
            value: overlapHours > 0 ? `${formatNumber(overlapHours, 0)} hours` : "No overlap",
          },
          details: [
            { label: "Time difference", value: `${formatNumber(diff, 1)} hours` },
            { label: "Zone 1 business hours", value: `${workStart > 12 ? workStart - 12 : workStart} AM - ${workEnd > 12 ? workEnd - 12 : workEnd} PM` },
            { label: "Zone 2 business hours", value: `${workStart > 12 ? workStart - 12 : workStart} AM - ${workEnd > 12 ? workEnd - 12 : workEnd} PM` },
            { label: "Overlap in Zone 1", value: overlapHours > 0 ? `${zone1OverlapStart} - ${zone1OverlapEnd}` : "None" },
            { label: "Overlap in Zone 2", value: overlapHours > 0 ? `${zone2OverlapStart} - ${zone2OverlapEnd}` : "None" },
            { label: "Best meeting time (Zone 1)", value: overlapHours > 0 ? zone1OverlapStart : "N/A" },
            { label: "Best meeting time (Zone 2)", value: overlapHours > 0 ? zone2OverlapStart : "N/A" },
          ],
          note: overlapHours > 0
            ? `There are ${formatNumber(overlapHours, 0)} overlapping business hours between these time zones. Schedule meetings during this window.`
            : "No overlapping business hours exist. Consider adjusting work hours or using asynchronous communication.",
        };
      },
    },
  ],
  relatedSlugs: ["flight-time-calculator", "layover-time-calculator"],
  faq: [
    {
      question: "How do I find the best meeting time across time zones?",
      answer:
        "Find the overlapping business hours by comparing when both locations are within 9 AM - 5 PM. For example, New York (UTC-5) and London (UTC+0) overlap from 9 AM - 12 PM New York time (2 PM - 5 PM London time), giving 3 hours of overlap.",
    },
    {
      question: "What does UTC mean?",
      answer:
        "UTC (Coordinated Universal Time) is the world time standard. Time zones are expressed as offsets from UTC. For example, EST (Eastern Standard Time) is UTC-5, meaning it's 5 hours behind UTC. UTC+0 is the same as GMT (Greenwich Mean Time).",
    },
    {
      question: "Do time zones change with daylight saving time?",
      answer:
        "Yes, many regions shift their clocks by 1 hour for daylight saving time (DST). The US and Europe change on different dates, which can temporarily alter the time difference between cities. Not all countries observe DST.",
    },
  ],
  formula:
    "Converted Time = Original Time + (Target UTC Offset - Source UTC Offset); Overlap = max(0, min(EndA, EndB) - max(StartA, StartB)).",
};
