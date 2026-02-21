import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const layoverTimeCalculator: CalculatorDefinition = {
  slug: "layover-time-calculator",
  title: "Layover Time Calculator",
  description:
    "Free layover time calculator. Determine if your layover is long enough for connections, check minimum connection times, and plan layover activities.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "layover time",
    "connection time",
    "transit time",
    "airport layover",
    "minimum connection",
  ],
  variants: [
    {
      id: "check",
      name: "Check Layover Sufficiency",
      description: "Check if your layover time is sufficient for your connection",
      fields: [
        {
          name: "layoverMinutes",
          label: "Layover Duration (minutes)",
          type: "number",
          placeholder: "e.g. 90",
        },
        {
          name: "flightType",
          label: "Connection Type",
          type: "select",
          options: [
            { label: "Domestic to Domestic", value: "dd" },
            { label: "Domestic to International", value: "di" },
            { label: "International to Domestic", value: "id" },
            { label: "International to International", value: "ii" },
          ],
          defaultValue: "dd",
        },
        {
          name: "airportSize",
          label: "Airport Size",
          type: "select",
          options: [
            { label: "Small regional airport", value: "small" },
            { label: "Medium airport", value: "medium" },
            { label: "Large hub (ATL, ORD, DFW)", value: "large" },
            { label: "Mega hub (JFK, LHR, CDG)", value: "mega" },
          ],
          defaultValue: "large",
        },
        {
          name: "sameTerminal",
          label: "Terminal Change",
          type: "select",
          options: [
            { label: "Same terminal", value: "same" },
            { label: "Different terminal", value: "different" },
            { label: "Different terminal (train/bus)", value: "far" },
          ],
          defaultValue: "same",
        },
        {
          name: "checkedBags",
          label: "Checked Bags",
          type: "select",
          options: [
            { label: "No checked bags", value: "no" },
            { label: "Bags auto-transferred", value: "auto" },
            { label: "Must re-check bags", value: "recheck" },
          ],
          defaultValue: "auto",
        },
      ],
      calculate: (inputs) => {
        const layoverMinutes = inputs.layoverMinutes as number;
        const flightType = inputs.flightType as string;
        const airportSize = inputs.airportSize as string;
        const sameTerminal = inputs.sameTerminal as string;
        const checkedBags = inputs.checkedBags as string;
        if (!layoverMinutes || layoverMinutes <= 0) return null;

        const baseMinimums: Record<string, number> = {
          dd: 45,
          di: 90,
          id: 120,
          ii: 90,
        };

        const airportAdders: Record<string, number> = {
          small: -10,
          medium: 0,
          large: 15,
          mega: 30,
        };

        const terminalAdders: Record<string, number> = {
          same: 0,
          different: 15,
          far: 30,
        };

        const bagAdders: Record<string, number> = {
          no: 0,
          auto: 0,
          recheck: 30,
        };

        const minimumRequired = baseMinimums[flightType] + airportAdders[airportSize] + terminalAdders[sameTerminal] + bagAdders[checkedBags];
        const comfortableTime = minimumRequired * 1.5;
        const buffer = layoverMinutes - minimumRequired;
        const isSufficient = layoverMinutes >= minimumRequired;
        const isComfortable = layoverMinutes >= comfortableTime;

        const layoverH = Math.floor(layoverMinutes / 60);
        const layoverM = layoverMinutes % 60;
        const freeTime = Math.max(0, layoverMinutes - minimumRequired - 30);

        return {
          primary: {
            label: isSufficient ? (isComfortable ? "Comfortable Layover" : "Tight but Possible") : "Too Short",
            value: `${layoverH}h ${layoverM}m layover`,
          },
          details: [
            { label: "Your layover", value: `${layoverH}h ${layoverM}m (${layoverMinutes} min)` },
            { label: "Minimum required", value: `${minimumRequired} minutes` },
            { label: "Comfortable minimum", value: `${Math.round(comfortableTime)} minutes` },
            { label: "Buffer time", value: `${buffer} minutes` },
            { label: "Free time for activities", value: freeTime > 0 ? `~${freeTime} minutes` : "None" },
            { label: "Connection type", value: flightType === "dd" ? "Domestic-Domestic" : flightType === "di" ? "Domestic-International" : flightType === "id" ? "International-Domestic" : "International-International" },
          ],
          note: !isSufficient
            ? `Your layover of ${layoverMinutes} minutes is below the recommended minimum of ${minimumRequired} minutes. Risk of missing your connection is high. Consider rebooking.`
            : isComfortable
            ? `Your layover is comfortable with ${buffer} minutes of buffer. You have about ${freeTime} minutes of free time for food, shopping, or lounging.`
            : `Your layover is tight with only ${buffer} minutes of buffer. Head directly to your gate after arrival. No time for extended stops.`,
        };
      },
    },
    {
      id: "activity",
      name: "Layover Activity Planner",
      description: "Plan what you can do during a long layover",
      fields: [
        {
          name: "layoverHours",
          label: "Layover Duration (hours)",
          type: "number",
          placeholder: "e.g. 6",
          step: 0.5,
        },
        {
          name: "connectionMinutes",
          label: "Time Needed for Connection (minutes)",
          type: "number",
          placeholder: "e.g. 90",
          defaultValue: 90,
        },
        {
          name: "hasLounge",
          label: "Lounge Access",
          type: "select",
          options: [
            { label: "No lounge access", value: "no" },
            { label: "Has lounge access", value: "yes" },
            { label: "Will buy day pass (~$50)", value: "buy" },
          ],
          defaultValue: "no",
        },
      ],
      calculate: (inputs) => {
        const layoverHours = inputs.layoverHours as number;
        const connectionMinutes = (inputs.connectionMinutes as number) || 90;
        const hasLounge = inputs.hasLounge as string;
        if (!layoverHours || layoverHours <= 0) return null;

        const totalMinutes = layoverHours * 60;
        const freeMinutes = totalMinutes - connectionMinutes;
        const freeHours = freeMinutes / 60;
        const canLeaveAirport = freeHours >= 4;
        const canEatMeal = freeMinutes >= 45;
        const canShop = freeMinutes >= 30;
        const canNap = freeMinutes >= 60;
        const canUseLounge = (hasLounge === "yes" || hasLounge === "buy") && freeMinutes >= 60;

        const activities: string[] = [];
        if (canLeaveAirport) activities.push("Explore the city (with visa if needed)");
        if (canUseLounge) activities.push("Use airport lounge");
        if (canEatMeal) activities.push("Sit-down restaurant meal");
        if (canNap) activities.push("Rest in quiet area or sleep pod");
        if (canShop) activities.push("Duty-free shopping");
        if (freeMinutes >= 15) activities.push("Walk and stretch");

        return {
          primary: {
            label: "Available Free Time",
            value: `${Math.floor(freeHours)}h ${Math.round((freeHours % 1) * 60)}m`,
          },
          details: [
            { label: "Total layover", value: `${layoverHours} hours` },
            { label: "Connection time needed", value: `${connectionMinutes} minutes` },
            { label: "Free time", value: `${formatNumber(freeHours, 1)} hours` },
            { label: "Can leave airport?", value: canLeaveAirport ? "Yes (4+ hours free)" : "Not recommended" },
            { label: "Suggested activities", value: activities.slice(0, 3).join(", ") || "Head to gate" },
          ],
          note: canLeaveAirport
            ? "You have enough time to explore outside the airport. Check if you need a transit visa and keep track of re-entry security wait times."
            : `Use your ${formatNumber(freeHours, 1)} hours at the airport. ${canUseLounge ? "A lounge would be great for this wait." : "Consider finding a quiet spot to relax."}`,
        };
      },
    },
  ],
  relatedSlugs: ["flight-time-calculator", "flight-distance-calculator"],
  faq: [
    {
      question: "What is the minimum layover time for a domestic connection?",
      answer:
        "For domestic connections in the US, 45-60 minutes is the minimum at most airports. Larger hubs like ATL, ORD, or DFW may need 60-90 minutes. Airlines typically won't sell connections shorter than their minimum connection time (MCT).",
    },
    {
      question: "What is the minimum layover time for international flights?",
      answer:
        "International connections typically require 90-180 minutes minimum. You'll need time for immigration, customs, security re-screening, and potentially re-checking bags. At large international hubs, 2-3 hours is recommended.",
    },
    {
      question: "What should I do during a long layover?",
      answer:
        "For 2-4 hour layovers: eat, shop, use a lounge, or rest. For 4-8 hours: consider an airport day-pass lounge, sleep pods, or airport tours. For 8+ hours: explore the city if you have visa-free entry. Many airports offer free city transit tours for long layovers.",
    },
  ],
  formula:
    "Minimum Connection Time = Base (45-120 min by type) + Airport Size Adder + Terminal Change Adder + Bag Re-check Adder.",
};
