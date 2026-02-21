import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeDurationCalculator: CalculatorDefinition = {
  slug: "time-duration-calculator",
  title: "Time Duration Calculator",
  description: "Free time duration calculator. Calculate the time between two events. Add or subtract hours, minutes, and seconds.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["time duration calculator", "hours between times", "time difference calculator", "elapsed time calculator", "how many hours between"],
  variants: [
    {
      id: "between",
      name: "Time Between",
      description: "Calculate duration between start and end times",
      fields: [
        { name: "startH", label: "Start Hour (0-23)", type: "number", placeholder: "e.g. 9", min: 0, max: 23 },
        { name: "startM", label: "Start Minutes", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
        { name: "endH", label: "End Hour (0-23)", type: "number", placeholder: "e.g. 17", min: 0, max: 23 },
        { name: "endM", label: "End Minutes", type: "number", placeholder: "e.g. 45", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const sh = inputs.startH as number;
        const sm = (inputs.startM as number) || 0;
        const eh = inputs.endH as number;
        const em = (inputs.endM as number) || 0;
        if (sh === undefined || eh === undefined) return null;
        let totalMin = (eh * 60 + em) - (sh * 60 + sm);
        if (totalMin < 0) totalMin += 24 * 60;
        const hours = Math.floor(totalMin / 60);
        const mins = totalMin % 60;
        return {
          primary: { label: "Duration", value: `${hours}h ${mins}m` },
          details: [
            { label: "Total minutes", value: `${totalMin}` },
            { label: "Decimal hours", value: formatNumber(totalMin / 60, 2) },
            { label: "Total seconds", value: `${totalMin * 60}` },
            { label: "Start", value: `${sh.toString().padStart(2, "0")}:${sm.toString().padStart(2, "0")}` },
            { label: "End", value: `${eh.toString().padStart(2, "0")}:${em.toString().padStart(2, "0")}` },
          ],
        };
      },
    },
    {
      id: "add",
      name: "Add/Subtract Time",
      description: "Add hours and minutes to a starting time",
      fields: [
        { name: "startH", label: "Start Hour (0-23)", type: "number", placeholder: "e.g. 14", min: 0, max: 23 },
        { name: "startM", label: "Start Minutes", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
        { name: "addH", label: "Add Hours", type: "number", placeholder: "e.g. 3" },
        { name: "addM", label: "Add Minutes", type: "number", placeholder: "e.g. 45" },
      ],
      calculate: (inputs) => {
        const sh = inputs.startH as number;
        const sm = (inputs.startM as number) || 0;
        const ah = (inputs.addH as number) || 0;
        const am = (inputs.addM as number) || 0;
        if (sh === undefined) return null;
        let totalMin = sh * 60 + sm + ah * 60 + am;
        const days = Math.floor(totalMin / (24 * 60));
        totalMin = ((totalMin % (24 * 60)) + 24 * 60) % (24 * 60);
        const h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        const dayNote = days > 0 ? ` (+${days} day${days > 1 ? "s" : ""})` : days < 0 ? ` (${days} day${days < -1 ? "s" : ""})` : "";
        return {
          primary: { label: "Result", value: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}${dayNote}` },
          details: [
            { label: "Start", value: `${sh.toString().padStart(2, "0")}:${sm.toString().padStart(2, "0")}` },
            { label: "Added", value: `${ah}h ${am}m` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["date-calculator", "time-zone-converter", "time-card-calculator"],
  faq: [
    { question: "How do I calculate time between two times?", answer: "Convert both times to minutes from midnight, subtract, and convert back. 9:30 to 17:45: (17×60+45) - (9×60+30) = 1065 - 570 = 495 minutes = 8h 15m." },
  ],
  formula: "Duration = End - Start (in minutes) | Add: Result = Start + Added time",
};
