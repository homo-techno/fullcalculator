import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drivingTimeCalculator: CalculatorDefinition = {
  slug: "driving-time-calculator",
  title: "Driving Time Calculator",
  description:
    "Free driving time calculator. Estimate how long it takes to drive any distance with adjustments for speed, traffic, and stops.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "driving time",
    "drive time calculator",
    "how long to drive",
    "travel time",
    "driving duration",
  ],
  variants: [
    {
      id: "basic",
      name: "Basic Driving Time",
      description: "Calculate driving time from distance and speed",
      fields: [
        {
          name: "distance",
          label: "Distance",
          type: "number",
          placeholder: "e.g. 300",
        },
        {
          name: "distanceUnit",
          label: "Distance Unit",
          type: "select",
          options: [
            { label: "Miles", value: "miles" },
            { label: "Kilometers", value: "km" },
          ],
          defaultValue: "miles",
        },
        {
          name: "avgSpeed",
          label: "Average Speed",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "trafficCondition",
          label: "Traffic Conditions",
          type: "select",
          options: [
            { label: "No traffic (open road)", value: "1.0" },
            { label: "Light traffic (+10%)", value: "1.1" },
            { label: "Moderate traffic (+25%)", value: "1.25" },
            { label: "Heavy traffic (+50%)", value: "1.5" },
            { label: "Severe congestion (+100%)", value: "2.0" },
          ],
          defaultValue: "1.1",
        },
        {
          name: "stops",
          label: "Number of Stops (15 min each)",
          type: "select",
          options: [
            { label: "No stops", value: "0" },
            { label: "1 stop", value: "1" },
            { label: "2 stops", value: "2" },
            { label: "3 stops", value: "3" },
            { label: "4 stops", value: "4" },
            { label: "5 stops", value: "5" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const distanceUnit = inputs.distanceUnit as string;
        const avgSpeed = inputs.avgSpeed as number;
        const trafficFactor = parseFloat(inputs.trafficCondition as string);
        const stops = parseInt(inputs.stops as string) || 0;
        if (!distance || !avgSpeed || distance <= 0 || avgSpeed <= 0) return null;

        const distanceMi = distanceUnit === "km" ? distance * 0.621371 : distance;
        const distanceKm = distanceUnit === "miles" ? distance * 1.60934 : distance;
        const speedMph = distanceUnit === "km" ? avgSpeed * 0.621371 : avgSpeed;

        const baseDriveHours = distance / avgSpeed;
        const adjustedDriveHours = baseDriveHours * trafficFactor;
        const stopHours = (stops * 15) / 60;
        const totalHours = adjustedDriveHours + stopHours;

        const driveH = Math.floor(adjustedDriveHours);
        const driveM = Math.round((adjustedDriveHours - driveH) * 60);
        const totalH = Math.floor(totalHours);
        const totalM = Math.round((totalHours - totalH) * 60);

        return {
          primary: {
            label: "Total Travel Time",
            value: `${totalH}h ${totalM}m`,
          },
          details: [
            { label: "Distance", value: `${formatNumber(distanceMi, 1)} mi / ${formatNumber(distanceKm, 1)} km` },
            { label: "Base driving time", value: `${Math.floor(baseDriveHours)}h ${Math.round((baseDriveHours % 1) * 60)}m` },
            { label: "With traffic", value: `${driveH}h ${driveM}m` },
            { label: "Stop time", value: `${stops * 15} minutes (${stops} stops)` },
            { label: "Total travel time", value: `${totalH}h ${totalM}m` },
            { label: "Traffic adds", value: `${Math.round((trafficFactor - 1) * baseDriveHours * 60)} minutes` },
          ],
        };
      },
    },
    {
      id: "arrival",
      name: "Arrival Time Estimator",
      description: "Calculate when you will arrive based on departure time",
      fields: [
        {
          name: "departHour",
          label: "Departure Hour (1-12)",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          max: 12,
        },
        {
          name: "departPeriod",
          label: "AM/PM",
          type: "select",
          options: [
            { label: "AM", value: "AM" },
            { label: "PM", value: "PM" },
          ],
          defaultValue: "AM",
        },
        {
          name: "distance",
          label: "Distance (miles)",
          type: "number",
          placeholder: "e.g. 450",
        },
        {
          name: "avgSpeed",
          label: "Average Speed (mph)",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "totalStopMinutes",
          label: "Total Stop Time (minutes)",
          type: "number",
          placeholder: "e.g. 30",
        },
      ],
      calculate: (inputs) => {
        const departHour = inputs.departHour as number;
        const departPeriod = inputs.departPeriod as string;
        const distance = inputs.distance as number;
        const avgSpeed = inputs.avgSpeed as number;
        const stopMinutes = (inputs.totalStopMinutes as number) || 0;
        if (!departHour || !distance || !avgSpeed) return null;

        let depart24 = departHour;
        if (departPeriod === "AM" && departHour === 12) depart24 = 0;
        else if (departPeriod === "PM" && departHour !== 12) depart24 = departHour + 12;

        const driveHours = distance / avgSpeed;
        const totalHours = driveHours + stopMinutes / 60;

        let arriveHour24 = depart24 + totalHours;
        let dayOffset = 0;
        if (arriveHour24 >= 24) {
          dayOffset = Math.floor(arriveHour24 / 24);
          arriveHour24 = arriveHour24 % 24;
        }

        const arriveH = Math.floor(arriveHour24);
        const arriveM = Math.round((arriveHour24 - arriveH) * 60);
        const arrivePeriod = arriveH >= 12 ? "PM" : "AM";
        const arriveDisplay = arriveH > 12 ? arriveH - 12 : arriveH === 0 ? 12 : arriveH;

        const dayLabel = dayOffset === 0 ? "same day" : dayOffset === 1 ? "next day" : `+${dayOffset} days`;

        return {
          primary: {
            label: "Estimated Arrival",
            value: `${arriveDisplay}:${arriveM.toString().padStart(2, "0")} ${arrivePeriod}`,
          },
          details: [
            { label: "Departure", value: `${departHour}:00 ${departPeriod}` },
            { label: "Drive time", value: `${Math.floor(driveHours)}h ${Math.round((driveHours % 1) * 60)}m` },
            { label: "Stop time", value: `${stopMinutes} minutes` },
            { label: "Total travel", value: `${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60)}m` },
            { label: "Arrival", value: `${arriveDisplay}:${arriveM.toString().padStart(2, "0")} ${arrivePeriod} (${dayLabel})` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["road-trip-planner-calculator", "gas-cost-trip-calculator", "fuel-stop-calculator"],
  faq: [
    {
      question: "How do I estimate driving time accurately?",
      answer:
        "Divide your trip distance by your average speed, then add time for stops and traffic. Highway trips typically average 55-65 mph. Add 10-25% for traffic in populated areas. Plan 15-minute stops every 2 hours. GPS navigation apps provide real-time estimates.",
    },
    {
      question: "What average speed should I use for highway driving?",
      answer:
        "For US interstate highways, use 60-65 mph average (accounting for speed limit changes, construction, and traffic). For rural highways, use 50-55 mph. For city driving, use 20-35 mph. European motorways average 70-80 mph where limits are higher.",
    },
    {
      question: "How does traffic affect driving time?",
      answer:
        "Light traffic adds about 10% to driving time. Moderate traffic adds 25%. Heavy traffic (rush hour in major cities) can add 50-100% or more. Check real-time traffic apps like Google Maps or Waze before departing and consider traveling during off-peak hours.",
    },
  ],
  formula:
    "Driving Time = Distance / Speed x Traffic Factor + Stop Time; Total in minutes then converted to hours and minutes.",
};
