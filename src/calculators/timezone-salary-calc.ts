import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timezoneSalaryCalculator: CalculatorDefinition = {
  slug: "timezone-salary-calc",
  title: "Timezone Meeting Scheduler Calculator",
  description:
    "Free timezone-adjusted meeting scheduler. Find overlapping work hours across time zones and calculate meeting cost by attendee salary.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "timezone meeting scheduler",
    "time zone overlap",
    "meeting time calculator",
    "global team meeting",
    "work hours overlap",
    "meeting cost calculator",
    "international meeting planner",
  ],
  variants: [
    {
      id: "overlap-hours",
      name: "Work Hours Overlap",
      description: "Find overlapping work hours between two time zones",
      fields: [
        {
          name: "tz1",
          label: "Your UTC Offset (hours)",
          type: "select",
          options: [
            { label: "UTC-12 (Baker Island)", value: "-12" },
            { label: "UTC-10 (Hawaii)", value: "-10" },
            { label: "UTC-9 (Alaska)", value: "-9" },
            { label: "UTC-8 (Pacific US)", value: "-8" },
            { label: "UTC-7 (Mountain US)", value: "-7" },
            { label: "UTC-6 (Central US)", value: "-6" },
            { label: "UTC-5 (Eastern US)", value: "-5" },
            { label: "UTC-4 (Atlantic)", value: "-4" },
            { label: "UTC-3 (Brazil)", value: "-3" },
            { label: "UTC+0 (UK/GMT)", value: "0" },
            { label: "UTC+1 (Central Europe)", value: "1" },
            { label: "UTC+2 (Eastern Europe)", value: "2" },
            { label: "UTC+3 (Moscow)", value: "3" },
            { label: "UTC+4 (Dubai)", value: "4" },
            { label: "UTC+5 (Pakistan)", value: "5" },
            { label: "UTC+5:30 (India)", value: "5.5" },
            { label: "UTC+7 (Thailand)", value: "7" },
            { label: "UTC+8 (China/Singapore)", value: "8" },
            { label: "UTC+9 (Japan/Korea)", value: "9" },
            { label: "UTC+10 (Australia East)", value: "10" },
            { label: "UTC+12 (New Zealand)", value: "12" },
          ],
          defaultValue: "-5",
        },
        {
          name: "tz2",
          label: "Their UTC Offset (hours)",
          type: "select",
          options: [
            { label: "UTC-12 (Baker Island)", value: "-12" },
            { label: "UTC-10 (Hawaii)", value: "-10" },
            { label: "UTC-9 (Alaska)", value: "-9" },
            { label: "UTC-8 (Pacific US)", value: "-8" },
            { label: "UTC-7 (Mountain US)", value: "-7" },
            { label: "UTC-6 (Central US)", value: "-6" },
            { label: "UTC-5 (Eastern US)", value: "-5" },
            { label: "UTC-4 (Atlantic)", value: "-4" },
            { label: "UTC-3 (Brazil)", value: "-3" },
            { label: "UTC+0 (UK/GMT)", value: "0" },
            { label: "UTC+1 (Central Europe)", value: "1" },
            { label: "UTC+2 (Eastern Europe)", value: "2" },
            { label: "UTC+3 (Moscow)", value: "3" },
            { label: "UTC+4 (Dubai)", value: "4" },
            { label: "UTC+5 (Pakistan)", value: "5" },
            { label: "UTC+5:30 (India)", value: "5.5" },
            { label: "UTC+7 (Thailand)", value: "7" },
            { label: "UTC+8 (China/Singapore)", value: "8" },
            { label: "UTC+9 (Japan/Korea)", value: "9" },
            { label: "UTC+10 (Australia East)", value: "10" },
            { label: "UTC+12 (New Zealand)", value: "12" },
          ],
          defaultValue: "5.5",
        },
        {
          name: "workStart",
          label: "Work Day Start Hour (local, 24h)",
          type: "number",
          placeholder: "e.g. 9",
          defaultValue: 9,
          min: 0,
          max: 23,
        },
        {
          name: "workEnd",
          label: "Work Day End Hour (local, 24h)",
          type: "number",
          placeholder: "e.g. 17",
          defaultValue: 17,
          min: 1,
          max: 24,
        },
      ],
      calculate: (inputs) => {
        const tz1 = parseFloat(inputs.tz1 as string);
        const tz2 = parseFloat(inputs.tz2 as string);
        const workStart = parseFloat(inputs.workStart as string);
        const workEnd = parseFloat(inputs.workEnd as string);
        if ([tz1, tz2, workStart, workEnd].some((v) => isNaN(v))) return null;
        if (workEnd <= workStart) return null;

        const diff = tz2 - tz1;

        // Convert work hours to UTC
        const tz1StartUTC = (workStart - tz1 + 24) % 24;
        const tz1EndUTC = (workEnd - tz1 + 24) % 24;
        const tz2StartUTC = (workStart - tz2 + 24) % 24;
        const tz2EndUTC = (workEnd - tz2 + 24) % 24;

        // Find overlap in UTC
        const overlapStart = Math.max(tz1StartUTC, tz2StartUTC);
        const overlapEnd = Math.min(tz1EndUTC, tz2EndUTC);
        const overlapHours = Math.max(0, overlapEnd - overlapStart);

        // Convert best meeting time back to local times
        const bestYourTime = (overlapStart + tz1 + 24) % 24;
        const bestTheirTime = (overlapStart + tz2 + 24) % 24;

        const formatTime = (h: number) => {
          const hour = Math.floor(h);
          const min = Math.round((h - hour) * 60);
          const ampm = hour >= 12 ? "PM" : "AM";
          const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return `${h12}:${min.toString().padStart(2, "0")} ${ampm}`;
        };

        return {
          primary: {
            label: "Overlapping Work Hours",
            value: formatNumber(overlapHours, 1),
            suffix: "hours",
          },
          details: [
            { label: "Time Difference", value: formatNumber(Math.abs(diff), 1) + " hours" },
            { label: "Best Meeting (Your Time)", value: overlapHours > 0 ? formatTime(bestYourTime) : "No overlap" },
            { label: "Best Meeting (Their Time)", value: overlapHours > 0 ? formatTime(bestTheirTime) : "No overlap" },
            { label: "Your Work Hours (UTC)", value: formatTime(tz1StartUTC) + " - " + formatTime(tz1EndUTC) },
            { label: "Their Work Hours (UTC)", value: formatTime(tz2StartUTC) + " - " + formatTime(tz2EndUTC) },
          ],
          note: overlapHours === 0 ? "No overlapping work hours. Consider async communication or adjusted schedules." : undefined,
        };
      },
    },
    {
      id: "meeting-cost",
      name: "Meeting Cost Calculator",
      description: "Calculate the cost of a meeting based on attendee salaries",
      fields: [
        {
          name: "attendees",
          label: "Number of Attendees",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "avgSalary",
          label: "Average Annual Salary ($)",
          type: "number",
          placeholder: "e.g. 75000",
        },
        {
          name: "durationMin",
          label: "Meeting Duration (minutes)",
          type: "number",
          placeholder: "e.g. 60",
          defaultValue: 60,
        },
        {
          name: "frequency",
          label: "Meeting Frequency",
          type: "select",
          options: [
            { label: "One-time", value: "1" },
            { label: "Weekly", value: "52" },
            { label: "Bi-weekly", value: "26" },
            { label: "Monthly", value: "12" },
            { label: "Daily", value: "260" },
          ],
          defaultValue: "52",
        },
      ],
      calculate: (inputs) => {
        const attendees = parseFloat(inputs.attendees as string);
        const avgSalary = parseFloat(inputs.avgSalary as string);
        const durationMin = parseFloat(inputs.durationMin as string);
        const frequency = parseFloat(inputs.frequency as string);
        if (isNaN(attendees) || isNaN(avgSalary) || isNaN(durationMin) || isNaN(frequency)) return null;
        if (attendees <= 0 || avgSalary <= 0 || durationMin <= 0) return null;

        const hourlyRate = avgSalary / 2080; // 40hrs x 52 weeks
        const meetingCost = attendees * hourlyRate * (durationMin / 60);
        const annualCost = meetingCost * frequency;
        const totalHoursPerYear = attendees * (durationMin / 60) * frequency;

        return {
          primary: {
            label: "Cost Per Meeting",
            value: formatNumber(meetingCost, 2),
            suffix: "$",
          },
          details: [
            { label: "Annual Meeting Cost", value: "$" + formatNumber(annualCost, 2) },
            { label: "Avg Hourly Rate", value: "$" + formatNumber(hourlyRate, 2) + "/hr" },
            { label: "Person-Hours/Year", value: formatNumber(totalHoursPerYear, 1) + " hours" },
            { label: "Attendees", value: formatNumber(attendees) },
            { label: "Meetings/Year", value: formatNumber(frequency) },
          ],
          note: annualCost > 50000 ? "This meeting costs over $50K/year. Consider if all attendees are necessary." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["time-zone-calculator", "salary-calculator", "time-card-calculator"],
  faq: [
    {
      question: "How do I find overlapping work hours across time zones?",
      answer:
        "Convert each location's work hours to UTC, then find the intersection. For example, New York (UTC-5) working 9-5 is 14:00-22:00 UTC. London (UTC+0) working 9-5 is 9:00-17:00 UTC. The overlap is 14:00-17:00 UTC (9 AM-12 PM in New York, 2 PM-5 PM in London).",
    },
    {
      question: "How much does the average meeting cost?",
      answer:
        "A 1-hour meeting with 6 people earning $75,000/year costs about $216. If held weekly, that is over $11,000/year. Recurring meetings with many attendees can be surprisingly expensive when calculated by salary cost.",
    },
  ],
  formula:
    "Overlap = max(0, min(end1, end2) - max(start1, start2)) | Meeting Cost = Attendees x (Salary / 2080) x (Duration / 60)",
};
