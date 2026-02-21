import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roadTripPlannerCalculator: CalculatorDefinition = {
  slug: "road-trip-planner-calculator",
  title: "Road Trip Planner Calculator",
  description:
    "Free road trip planner calculator. Calculate optimal rest stops, driving shifts, and break times for safe long-distance road trips.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "road trip planner",
    "road trip stops",
    "driving breaks",
    "rest stop calculator",
    "long drive planner",
  ],
  variants: [
    {
      id: "stops",
      name: "Plan Rest Stops",
      description: "Calculate recommended rest stops and break times",
      fields: [
        {
          name: "totalDistance",
          label: "Total Trip Distance (miles)",
          type: "number",
          placeholder: "e.g. 800",
        },
        {
          name: "avgSpeed",
          label: "Average Speed (mph)",
          type: "number",
          placeholder: "e.g. 65",
        },
        {
          name: "maxDriveHours",
          label: "Max Driving Before Break",
          type: "select",
          options: [
            { label: "1.5 hours", value: "1.5" },
            { label: "2 hours (recommended)", value: "2" },
            { label: "2.5 hours", value: "2.5" },
            { label: "3 hours", value: "3" },
            { label: "4 hours (max recommended)", value: "4" },
          ],
          defaultValue: "2",
        },
        {
          name: "breakLength",
          label: "Break Length",
          type: "select",
          options: [
            { label: "10 minutes", value: "10" },
            { label: "15 minutes", value: "15" },
            { label: "20 minutes", value: "20" },
            { label: "30 minutes (meal stop)", value: "30" },
            { label: "45 minutes", value: "45" },
            { label: "60 minutes", value: "60" },
          ],
          defaultValue: "15",
        },
        {
          name: "startHour",
          label: "Departure Time",
          type: "select",
          options: [
            { label: "5:00 AM", value: "5" },
            { label: "6:00 AM", value: "6" },
            { label: "7:00 AM", value: "7" },
            { label: "8:00 AM", value: "8" },
            { label: "9:00 AM", value: "9" },
            { label: "10:00 AM", value: "10" },
            { label: "12:00 PM", value: "12" },
          ],
          defaultValue: "8",
        },
      ],
      calculate: (inputs) => {
        const totalDistance = inputs.totalDistance as number;
        const avgSpeed = inputs.avgSpeed as number;
        const maxDriveHours = parseFloat(inputs.maxDriveHours as string);
        const breakLength = parseInt(inputs.breakLength as string);
        const startHour = parseInt(inputs.startHour as string);
        if (!totalDistance || !avgSpeed || totalDistance <= 0 || avgSpeed <= 0) return null;

        const totalDriveHours = totalDistance / avgSpeed;
        const numberOfStops = Math.max(0, Math.ceil(totalDriveHours / maxDriveHours) - 1);
        const totalBreakMinutes = numberOfStops * breakLength;
        const totalBreakHours = totalBreakMinutes / 60;
        const totalTripHours = totalDriveHours + totalBreakHours;
        const distanceBetweenStops = totalDistance / (numberOfStops + 1);

        const arrivalHour = startHour + totalTripHours;
        const arrivalHourMod = arrivalHour % 24;
        const arrivalHourFormatted = Math.floor(arrivalHourMod);
        const arrivalMinutes = Math.round((arrivalHourMod - arrivalHourFormatted) * 60);
        const isPM = arrivalHourFormatted >= 12;
        const displayHour = arrivalHourFormatted > 12 ? arrivalHourFormatted - 12 : arrivalHourFormatted === 0 ? 12 : arrivalHourFormatted;

        const drivingHours = Math.floor(totalDriveHours);
        const drivingMinutes = Math.round((totalDriveHours - drivingHours) * 60);

        const totalH = Math.floor(totalTripHours);
        const totalM = Math.round((totalTripHours - totalH) * 60);

        return {
          primary: {
            label: "Number of Stops",
            value: `${numberOfStops} stops`,
          },
          details: [
            { label: "Total distance", value: `${formatNumber(totalDistance, 0)} miles` },
            { label: "Pure driving time", value: `${drivingHours}h ${drivingMinutes}m` },
            { label: "Number of rest stops", value: `${numberOfStops}` },
            { label: "Total break time", value: `${totalBreakMinutes} minutes` },
            { label: "Total trip time", value: `${totalH}h ${totalM}m` },
            { label: "Distance between stops", value: `${formatNumber(distanceBetweenStops, 0)} miles` },
            { label: "Stop every", value: `${maxDriveHours} hours` },
            { label: "Estimated arrival", value: `${displayHour}:${arrivalMinutes.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}` },
          ],
          note: `Plan to stop every ${formatNumber(distanceBetweenStops, 0)} miles (about every ${maxDriveHours} hours). Total trip time including breaks: ${totalH}h ${totalM}m.`,
        };
      },
    },
    {
      id: "multiday",
      name: "Multi-Day Trip Planner",
      description: "Plan a multi-day road trip with daily driving limits",
      fields: [
        {
          name: "totalDistance",
          label: "Total Trip Distance (miles)",
          type: "number",
          placeholder: "e.g. 2400",
        },
        {
          name: "avgSpeed",
          label: "Average Speed (mph)",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "maxDailyHours",
          label: "Max Daily Driving Hours",
          type: "select",
          options: [
            { label: "4 hours (relaxed)", value: "4" },
            { label: "6 hours (moderate)", value: "6" },
            { label: "8 hours (standard)", value: "8" },
            { label: "10 hours (intensive)", value: "10" },
            { label: "12 hours (maximum)", value: "12" },
          ],
          defaultValue: "8",
        },
        {
          name: "drivers",
          label: "Number of Drivers",
          type: "select",
          options: [
            { label: "1 driver", value: "1" },
            { label: "2 drivers", value: "2" },
            { label: "3 drivers", value: "3" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const totalDistance = inputs.totalDistance as number;
        const avgSpeed = inputs.avgSpeed as number;
        const maxDailyHours = parseInt(inputs.maxDailyHours as string);
        const drivers = parseInt(inputs.drivers as string) || 1;
        if (!totalDistance || !avgSpeed || totalDistance <= 0 || avgSpeed <= 0) return null;

        const totalDriveHours = totalDistance / avgSpeed;
        const effectiveDailyHours = maxDailyHours * Math.min(drivers, 2);
        const dailyDistance = avgSpeed * effectiveDailyHours;
        const drivingDays = Math.ceil(totalDistance / dailyDistance);
        const hoursPerDriverPerDay = effectiveDailyHours / drivers;

        return {
          primary: {
            label: "Trip Duration",
            value: `${drivingDays} driving days`,
          },
          details: [
            { label: "Total distance", value: `${formatNumber(totalDistance, 0)} miles` },
            { label: "Total driving hours", value: `${formatNumber(totalDriveHours, 1)} hours` },
            { label: "Daily driving distance", value: `${formatNumber(dailyDistance, 0)} miles/day` },
            { label: "Daily driving hours", value: `${effectiveDailyHours} hours/day` },
            { label: "Hours per driver/day", value: `${formatNumber(hoursPerDriverPerDay, 1)} hours` },
            { label: "Driving days needed", value: `${drivingDays} days` },
            { label: "Recommended trip days", value: `${drivingDays + Math.max(1, Math.floor(drivingDays / 3))} days (with rest days)` },
          ],
          note: `With ${drivers} driver(s) driving ${maxDailyHours} hours/day each, you need ${drivingDays} driving days. Add rest days every 2-3 days for safety and enjoyment.`,
        };
      },
    },
  ],
  relatedSlugs: ["driving-time-calculator", "fuel-stop-calculator", "gas-cost-trip-calculator"],
  faq: [
    {
      question: "How often should I stop on a road trip?",
      answer:
        "Safety experts recommend stopping every 2 hours or 100 miles, whichever comes first. Take a 15-20 minute break to stretch, use the restroom, and rest your eyes. Longer breaks of 30-60 minutes for meals help prevent fatigue.",
    },
    {
      question: "How many hours should I drive per day?",
      answer:
        "Most driving safety organizations recommend a maximum of 8-10 hours of driving per day for a solo driver. With two drivers alternating, you can safely extend this. Never drive more than 2 hours without a break, and avoid driving when drowsy.",
    },
    {
      question: "What is the best time to start a road trip?",
      answer:
        "Starting early (6-8 AM) is ideal because roads are less congested, you avoid afternoon heat and fatigue, and you arrive at your destination or overnight stop with daylight. Avoid starting late at night when drowsiness is highest.",
    },
  ],
  formula:
    "Stops = ceil(Total Drive Time / Max Drive Between Stops) - 1; Total Trip Time = Drive Time + (Stops x Break Length).",
};
