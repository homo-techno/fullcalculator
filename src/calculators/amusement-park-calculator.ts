import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const amusementParkCalculator: CalculatorDefinition = {
  slug: "amusement-park-calculator",
  title: "Amusement Park Calculator",
  description: "Estimate ride capacity and average wait times at an amusement park based on crowd level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["amusement park rides", "ride wait time", "park capacity calculator"],
  variants: [{
    id: "standard",
    name: "Amusement Park",
    description: "Estimate ride capacity and average wait times at an amusement park based on crowd level",
    fields: [
      { name: "parkHours", label: "Park Hours Available", type: "number", suffix: "hours", min: 1, max: 16, defaultValue: 8 },
      { name: "crowdLevel", label: "Crowd Level", type: "select", options: [{value:"low",label:"Low (Weekday)"},{value:"medium",label:"Medium (Weekend)"},{value:"high",label:"High (Holiday)"}], defaultValue: "medium" },
      { name: "ridePreference", label: "Ride Preference", type: "select", options: [{value:"thrill",label:"Thrill Rides"},{value:"family",label:"Family Rides"},{value:"mixed",label:"Mixed"}], defaultValue: "mixed" },
    ],
    calculate: (inputs) => {
      const hours = inputs.parkHours as number;
      const crowd = inputs.crowdLevel as string;
      const pref = inputs.ridePreference as string;
      if (!hours || hours <= 0) return null;
      const avgWait: Record<string, number> = { low: 10, medium: 30, high: 60 };
      const rideDuration: Record<string, number> = { thrill: 3, family: 5, mixed: 4 };
      const waitTime = avgWait[crowd] || 30;
      const duration = rideDuration[pref] || 4;
      const totalMinutes = hours * 60;
      const timePerRide = waitTime + duration;
      const ridesPerDay = Math.floor(totalMinutes / timePerRide);
      const actualRideTime = ridesPerDay * duration;
      const waitingTime = ridesPerDay * waitTime;
      return {
        primary: { label: "Rides You Can Enjoy", value: formatNumber(ridesPerDay) + " rides" },
        details: [
          { label: "Average Wait per Ride", value: formatNumber(waitTime) + " minutes" },
          { label: "Total Time on Rides", value: formatNumber(actualRideTime) + " minutes" },
          { label: "Total Time Waiting", value: formatNumber(waitingTime) + " minutes" },
        ],
      };
    },
  }],
  relatedSlugs: ["theme-park-budget-calculator", "zoo-visit-cost-calculator"],
  faq: [
    { question: "How many rides can you go on in a day?", answer: "On an average day you can expect to ride 8 to 15 rides. On low crowd days you may get 20 or more, while high crowd days may limit you to 5 to 8 rides." },
    { question: "How can I minimize wait times at an amusement park?", answer: "Arrive early, visit on weekdays, use single rider lines, and consider purchasing skip-the-line passes to maximize your ride count." },
  ],
  formula: "Rides per Day = Park Hours x 60 / (Average Wait + Ride Duration)",
};
