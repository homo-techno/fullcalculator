import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coolantFlushScheduleCalculator: CalculatorDefinition = {
  slug: "coolant-flush-schedule-calculator",
  title: "Coolant Flush Schedule Calculator",
  description: "Calculate when your next coolant flush is due based on mileage, time interval, and coolant type to keep your engine cooling system healthy.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["coolant flush","antifreeze change","radiator flush schedule","cooling system maintenance"],
  variants: [{
    id: "standard",
    name: "Coolant Flush Schedule",
    description: "Calculate when your next coolant flush is due based on mileage, time interval, and coolant type to keep your engine cooling system healthy.",
    fields: [
      { name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 500000, defaultValue: 60000 },
      { name: "lastFlushMileage", label: "Last Flush Mileage", type: "number", min: 0, max: 500000, defaultValue: 30000 },
      { name: "coolantType", label: "Coolant Type", type: "select", options: [{ value: "1", label: "Conventional (30,000 mi)" }, { value: "2", label: "Extended Life (50,000 mi)" }, { value: "3", label: "Long Life (100,000 mi)" }], defaultValue: "2" },
      { name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1000 },
      { name: "flushCost", label: "Flush Service Cost ($)", type: "number", min: 50, max: 300, defaultValue: 120 },
    ],
    calculate: (inputs) => {
    const current = inputs.currentMileage as number;
    const lastFlush = inputs.lastFlushMileage as number;
    const coolantType = parseInt(inputs.coolantType as string);
    const monthly = inputs.monthlyMiles as number;
    const cost = inputs.flushCost as number;
    const intervals = { 1: 30000, 2: 50000, 3: 100000 };
    const interval = intervals[coolantType] || 50000;
    const milesSinceFlush = current - lastFlush;
    const milesUntilDue = interval - milesSinceFlush;
    const nextFlushMileage = lastFlush + interval;
    const monthsUntilDue = milesUntilDue > 0 ? Math.round(milesUntilDue / monthly * 10) / 10 : 0;
    const annualCost = Math.round(cost / (interval / (monthly * 12)) * 100) / 100;
    return {
      primary: { label: "Next Flush Due At", value: formatNumber(nextFlushMileage) + " mi" },
      details: [
        { label: "Miles Since Last Flush", value: formatNumber(milesSinceFlush) },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilDue, 0)) },
        { label: "Months Until Due", value: formatNumber(monthsUntilDue) },
        { label: "Annualized Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        { label: "Status", value: milesUntilDue <= 0 ? "Overdue" : milesUntilDue < 5000 ? "Due Soon" : "On Schedule" }
      ]
    };
  },
  }],
  relatedSlugs: ["oil-change-interval-calculator","transmission-fluid-change-calculator"],
  faq: [
    { question: "How often should coolant be flushed?", answer: "Conventional coolant should be changed every 30,000 miles or 2 years. Extended life coolant lasts about 50,000 miles, and long life formulas can go up to 100,000 miles." },
    { question: "What happens if I skip a coolant flush?", answer: "Old coolant loses its anti-corrosion additives and can cause rust buildup, clogged passages, overheating, and potentially catastrophic engine damage from a blown head gasket." },
    { question: "Can I mix different coolant types?", answer: "Mixing different coolant types can cause chemical reactions that form gel or sludge. Always use the type specified in your owner manual and flush completely when switching." },
  ],
  formula: "Next Flush Mileage = Last Flush Mileage + Interval (by coolant type)
Miles Until Due = Interval - (Current Mileage - Last Flush Mileage)
Annualized Cost = Flush Cost / (Interval / Annual Miles)",
};
