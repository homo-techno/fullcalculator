import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const STATE_OPTIONS = [
  { label: "Federal (FLSA)", value: "federal" },
  { label: "California", value: "california" },
  { label: "New York", value: "newyork" },
  { label: "Washington", value: "washington" },
  { label: "Oregon", value: "oregon" },
  { label: "Colorado", value: "colorado" },
  { label: "Massachusetts", value: "massachusetts" },
  { label: "Other (Federal rules)", value: "federal" },
];

export const breakTimeCalculator: CalculatorDefinition = {
  slug: "break-time-calculator",
  title: "Break Time Calculator",
  description:
    "Free break time calculator. Calculate required meal and rest breaks based on shift length and labor laws in your state.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "break time calculator",
    "meal break calculator",
    "labor law breaks",
    "rest break calculator",
    "required work breaks",
  ],
  variants: [
    {
      id: "required-breaks",
      name: "Required Breaks by Shift Length",
      description: "Calculate legally required breaks based on your shift length and state",
      fields: [
        { name: "shiftHours", label: "Shift Length (hours)", type: "number", placeholder: "e.g. 8", min: 1, max: 24 },
        { name: "state", label: "State / Jurisdiction", type: "select", options: STATE_OPTIONS, defaultValue: "federal" },
      ],
      calculate: (inputs) => {
        const shiftHours = inputs.shiftHours as number;
        const state = inputs.state as string;
        if (!shiftHours) return null;

        let mealBreaks = 0;
        let mealMinutes = 0;
        let restBreaks = 0;
        let restMinutes = 0;
        let notes = "";

        switch (state) {
          case "california":
            // CA: 30-min meal for 5+ hours, second meal for 10+ hours; 10-min rest per 4 hours
            mealBreaks = shiftHours >= 10 ? 2 : shiftHours >= 5 ? 1 : 0;
            mealMinutes = mealBreaks * 30;
            restBreaks = Math.floor(shiftHours / 4);
            restMinutes = restBreaks * 10;
            notes = "CA law: 30-min meal after 5h, second after 10h. 10-min paid rest per 4h worked.";
            break;
          case "newyork":
            mealBreaks = shiftHours >= 6 ? 1 : 0;
            mealMinutes = mealBreaks * 30;
            if (shiftHours > 6) {
              // NY factory workers get additional break; we use general rule
              restBreaks = 0;
            }
            notes = "NY law: 30-min meal break for shifts over 6 hours. Additional rules for factory workers.";
            break;
          case "washington":
            mealBreaks = shiftHours >= 5 ? 1 : 0;
            mealMinutes = mealBreaks * 30;
            restBreaks = Math.floor(shiftHours / 4);
            restMinutes = restBreaks * 10;
            notes = "WA law: 30-min meal for 5+ hours. 10-min paid rest per 4 hours worked.";
            break;
          case "oregon":
            mealBreaks = shiftHours >= 6 ? 1 : 0;
            if (shiftHours >= 14) mealBreaks = 3;
            else if (shiftHours >= 7) mealBreaks = shiftHours >= 11 ? 2 : 1;
            mealMinutes = mealBreaks * 30;
            restBreaks = Math.floor(shiftHours / 4);
            restMinutes = restBreaks * 10;
            notes = "OR law: 30-min meal for 6+ hours. 10-min rest per 4h. Additional meals for long shifts.";
            break;
          case "colorado":
            mealBreaks = shiftHours >= 5 ? 1 : 0;
            mealMinutes = mealBreaks * 30;
            restBreaks = Math.floor(shiftHours / 4);
            restMinutes = restBreaks * 10;
            notes = "CO law: 30-min meal for 5+ hours. 10-min paid rest per 4 hours worked.";
            break;
          case "massachusetts":
            mealBreaks = shiftHours >= 6 ? 1 : 0;
            mealMinutes = mealBreaks * 30;
            notes = "MA law: 30-min meal break for shifts of 6+ hours. No required rest breaks.";
            break;
          default: // Federal
            mealBreaks = shiftHours >= 6 ? 1 : 0;
            mealMinutes = mealBreaks * 30;
            notes = "Federal FLSA does not require breaks, but short breaks (5-20 min) are paid if offered. Many states have stricter requirements.";
        }

        const totalBreakMin = mealMinutes + restMinutes;
        const netWorkMin = shiftHours * 60 - totalBreakMin;
        const netWorkHours = netWorkMin / 60;

        return {
          primary: {
            label: "Total Break Time",
            value: `${totalBreakMin} minutes`,
          },
          details: [
            { label: "Meal breaks", value: `${mealBreaks} x 30 min = ${mealMinutes} min` },
            { label: "Rest breaks", value: `${restBreaks} x 10 min = ${restMinutes} min` },
            { label: "Total break time", value: `${totalBreakMin} min (${formatNumber(totalBreakMin / 60, 2)} hours)` },
            { label: "Shift length", value: `${shiftHours} hours` },
            { label: "Net work time", value: `${formatNumber(netWorkHours, 2)} hours` },
          ],
          note: notes,
        };
      },
    },
    {
      id: "break-schedule",
      name: "Break Schedule Planner",
      description: "Plan when to take your breaks during a shift",
      fields: [
        { name: "startHour", label: "Shift Start Hour (0-23)", type: "number", placeholder: "e.g. 9", min: 0, max: 23 },
        { name: "startMin", label: "Shift Start Minutes", type: "number", placeholder: "e.g. 0", min: 0, max: 59, defaultValue: 0 },
        { name: "shiftHours", label: "Shift Length (hours)", type: "number", placeholder: "e.g. 8", min: 1, max: 16 },
        { name: "mealBreakMin", label: "Meal Break Length (min)", type: "number", placeholder: "e.g. 30", defaultValue: 30, min: 0 },
        { name: "restBreakMin", label: "Rest Break Length (min)", type: "number", placeholder: "e.g. 10", defaultValue: 10, min: 0 },
      ],
      calculate: (inputs) => {
        const sh = inputs.startHour as number;
        const sm = (inputs.startMin as number) || 0;
        const shiftHours = inputs.shiftHours as number;
        const mealLen = (inputs.mealBreakMin as number) || 30;
        const restLen = (inputs.restBreakMin as number) || 10;
        if (sh === undefined || !shiftHours) return null;

        const fmtTime = (totalMin: number) => {
          let h = Math.floor(totalMin / 60) % 24;
          const m = totalMin % 60;
          return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
        };

        const startMin = sh * 60 + sm;
        const endMin = startMin + shiftHours * 60;

        // First rest break: ~2 hours in
        const rest1 = startMin + 120;
        // Meal break: mid-shift
        const meal = startMin + Math.floor(shiftHours * 60 / 2);
        // Second rest break: ~2 hours before end
        const rest2 = endMin - 120;

        const details = [
          { label: "Shift start", value: fmtTime(startMin) },
        ];

        if (shiftHours >= 4) {
          details.push({ label: "Rest break 1", value: `${fmtTime(rest1)} - ${fmtTime(rest1 + restLen)} (${restLen} min)` });
        }
        if (shiftHours >= 5) {
          details.push({ label: "Meal break", value: `${fmtTime(meal)} - ${fmtTime(meal + mealLen)} (${mealLen} min)` });
        }
        if (shiftHours >= 8) {
          details.push({ label: "Rest break 2", value: `${fmtTime(rest2)} - ${fmtTime(rest2 + restLen)} (${restLen} min)` });
        }
        details.push({ label: "Shift end", value: fmtTime(endMin) });

        const totalBreak = (shiftHours >= 5 ? mealLen : 0) + (shiftHours >= 4 ? restLen : 0) + (shiftHours >= 8 ? restLen : 0);
        details.push({ label: "Total break time", value: `${totalBreak} min` });
        details.push({ label: "Net work time", value: `${formatNumber((shiftHours * 60 - totalBreak) / 60, 2)} hours` });

        return {
          primary: { label: "Break Schedule", value: `${totalBreak} min of breaks` },
          details,
        };
      },
    },
  ],
  relatedSlugs: [
    "work-schedule-calculator",
    "time-card-calculator",
    "work-hours-calculator",
  ],
  faq: [
    {
      question: "Am I entitled to breaks at work?",
      answer:
        "It depends on your state. Federal law (FLSA) does not require meal or rest breaks. However, many states like California, Washington, Colorado, and Oregon require paid rest breaks and unpaid meal breaks based on shift length.",
    },
    {
      question: "Are breaks paid or unpaid?",
      answer:
        "Generally, short rest breaks (5-20 minutes) are paid. Meal breaks (30+ minutes) are typically unpaid if the employee is fully relieved of duties. State laws vary.",
    },
    {
      question: "What happens if my employer does not provide required breaks?",
      answer:
        "In states with break laws (like California), employees may be entitled to one additional hour of pay at their regular rate for each missed break. Consult your state's labor board for specific remedies.",
    },
  ],
  formula: "Total Break = Meal Breaks + Rest Breaks (based on shift length and jurisdiction)",
};
