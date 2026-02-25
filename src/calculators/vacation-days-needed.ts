import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vacationDaysNeeded: CalculatorDefinition = {
  slug: "vacation-days-needed",
  title: "Vacation Days Needed Calculator",
  description:
    "Free online vacation days calculator. Calculate how many vacation/PTO days you need for a trip including travel days and optimal scheduling around weekends.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "vacation days",
    "PTO calculator",
    "days off",
    "time off",
    "vacation planning",
  ],
  variants: [
    {
      id: "days-needed",
      name: "Calculate PTO Days Needed",
      fields: [
        {
          name: "tripDays",
          label: "Total Trip Days (including weekends)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "travelDays",
          label: "Travel Days (flying/driving each way)",
          type: "select",
          options: [
            { label: "0 - No travel days (local trip)", value: "0" },
            { label: "1 day each way", value: "1" },
            { label: "2 days each way (long-haul)", value: "2" },
          ],
        },
        {
          name: "includesWeekends",
          label: "Number of Weekends During Trip",
          type: "select",
          options: [
            { label: "0 weekends", value: "0" },
            { label: "1 weekend (2 days)", value: "1" },
            { label: "2 weekends (4 days)", value: "2" },
            { label: "3 weekends (6 days)", value: "3" },
          ],
        },
        {
          name: "holidays",
          label: "Public Holidays During Trip",
          type: "number",
          placeholder: "e.g. 1",
        },
      ],
      calculate: (inputs) => {
        const tripDays = parseFloat(inputs.tripDays as string) || 0;
        const travelDaysEachWay = parseFloat(inputs.travelDays as string) || 0;
        const weekends = parseFloat(inputs.includesWeekends as string) || 0;
        const holidays = parseFloat(inputs.holidays as string) || 0;

        const totalTravelDays = travelDaysEachWay * 2;
        const weekendDays = weekends * 2;
        const totalDaysAway = tripDays + totalTravelDays;
        const ptoDaysNeeded = Math.max(0, totalDaysAway - weekendDays - holidays);

        // Calculate efficiency (trip days per PTO day)
        const efficiency = ptoDaysNeeded > 0 ? tripDays / ptoDaysNeeded : tripDays;

        // Suggest optimal scheduling
        let suggestion = "";
        if (ptoDaysNeeded <= 5 && tripDays >= 9) {
          suggestion = "Great efficiency! You are maximizing weekends.";
        } else if (efficiency >= 1.5) {
          suggestion = "Good schedule with solid weekend overlap.";
        } else {
          suggestion = "Consider shifting dates to include more weekends for better PTO efficiency.";
        }

        return {
          primary: { label: "PTO Days Needed", value: formatNumber(ptoDaysNeeded) },
          details: [
            { label: "Trip Duration", value: formatNumber(tripDays) + " days" },
            { label: "Travel Days", value: formatNumber(totalTravelDays) + " days" },
            { label: "Total Days Away", value: formatNumber(totalDaysAway) + " days" },
            { label: "Weekend Days (free)", value: formatNumber(weekendDays) + " days" },
            { label: "Public Holidays (free)", value: formatNumber(holidays) + " days" },
            { label: "Trip-to-PTO Ratio", value: formatNumber(efficiency, 1) + "x" },
            { label: "Scheduling Tip", value: suggestion },
          ],
        };
      },
    },
    {
      id: "pto-budget",
      name: "Annual PTO Budget Planner",
      fields: [
        {
          name: "annualPto",
          label: "Total Annual PTO Days",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "tripsPlanned",
          label: "Number of Trips Planned",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "avgPtoPerTrip",
          label: "Average PTO Days per Trip",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "sickDayBuffer",
          label: "Sick Day Buffer",
          type: "select",
          options: [
            { label: "None (separate sick leave)", value: "0" },
            { label: "2 days", value: "2" },
            { label: "3 days", value: "3" },
            { label: "5 days", value: "5" },
          ],
        },
      ],
      calculate: (inputs) => {
        const annualPto = parseFloat(inputs.annualPto as string) || 0;
        const tripsPlanned = parseFloat(inputs.tripsPlanned as string) || 0;
        const avgPtoPerTrip = parseFloat(inputs.avgPtoPerTrip as string) || 0;
        const sickDayBuffer = parseFloat(inputs.sickDayBuffer as string) || 0;

        const totalPtoForTrips = tripsPlanned * avgPtoPerTrip;
        const availableAfterBuffer = annualPto - sickDayBuffer;
        const remaining = availableAfterBuffer - totalPtoForTrips;
        const maxTrips = Math.floor(availableAfterBuffer / Math.max(avgPtoPerTrip, 1));

        return {
          primary: {
            label: "Remaining PTO After Trips",
            value: formatNumber(remaining) + " days",
          },
          details: [
            { label: "Total Annual PTO", value: formatNumber(annualPto) + " days" },
            { label: "Sick Day Buffer", value: formatNumber(sickDayBuffer) + " days" },
            { label: "Available for Travel", value: formatNumber(availableAfterBuffer) + " days" },
            { label: "PTO Needed for Trips", value: formatNumber(totalPtoForTrips) + " days" },
            { label: "Remaining PTO", value: formatNumber(remaining) + " days" },
            { label: "Max Trips Possible", value: formatNumber(maxTrips) + " trips" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["travel-budget-daily", "beach-vacation-cost", "disney-trip-cost"],
  faq: [
    {
      question: "How can I maximize my vacation with limited PTO?",
      answer:
        "Book trips around weekends and public holidays. A Friday-to-Sunday trip uses only 1 PTO day. Taking Monday-Friday off with surrounding weekends gives you 9 days for only 5 PTO days.",
    },
    {
      question: "Should I include travel days in my PTO?",
      answer:
        "If you are flying internationally with significant jet lag, count at least one travel day on each end. For long-haul flights, two travel days each way is more realistic for recovery.",
    },
    {
      question: "How many vacation days do most Americans get?",
      answer:
        "The average American worker gets 10-15 PTO days per year. After 5+ years at a company, this typically increases to 15-20 days. The US has no legal minimum for paid vacation.",
    },
  ],
  formula:
    "PTO Days Needed = Total Days Away - Weekend Days - Public Holidays\nTotal Days Away = Trip Days + Travel Days (each way x 2)",
};
