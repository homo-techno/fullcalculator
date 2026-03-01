import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const applianceLifespanCalculator: CalculatorDefinition = {
  slug: "appliance-lifespan-calculator",
  title: "Appliance Lifespan Calculator",
  description: "Estimate the remaining useful life of a household appliance based on type, age, and usage level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["appliance lifespan", "how long do appliances last", "appliance life expectancy"],
  variants: [{
    id: "standard",
    name: "Appliance Lifespan",
    description: "Estimate the remaining useful life of a household appliance based on type, age, and usage level",
    fields: [
      { name: "applianceType", label: "Appliance Type", type: "select", options: [{value:"washer",label:"Washing Machine"},{value:"dryer",label:"Dryer"},{value:"fridge",label:"Refrigerator"},{value:"dishwasher",label:"Dishwasher"},{value:"oven",label:"Oven / Range"},{value:"hvac",label:"HVAC System"}], defaultValue: "washer" },
      { name: "ageYears", label: "Current Age", type: "number", suffix: "years", min: 0, max: 30, defaultValue: 5 },
      { name: "usageLevel", label: "Usage Level", type: "select", options: [{value:"light",label:"Light (below average)"},{value:"normal",label:"Normal"},{value:"heavy",label:"Heavy (above average)"}], defaultValue: "normal" },
    ],
    calculate: (inputs) => {
      const type = inputs.applianceType as string;
      const age = inputs.ageYears as number;
      const usage = inputs.usageLevel as string;
      if (age === undefined || age === null) return null;
      const lifespans: Record<string, number> = { washer: 11, dryer: 13, fridge: 15, dishwasher: 10, oven: 15, hvac: 15 };
      const baseLife = lifespans[type] || 12;
      const usageMod: Record<string, number> = { light: 1.2, normal: 1.0, heavy: 0.75 };
      const adjustedLife = baseLife * (usageMod[usage] || 1.0);
      const remaining = Math.max(0, adjustedLife - age);
      const percentUsed = Math.min(100, (age / adjustedLife) * 100);
      const status = remaining <= 1 ? "Near end of life - plan for replacement" : remaining <= 3 ? "Consider budgeting for replacement soon" : "Good remaining life";
      return {
        primary: { label: "Estimated Remaining Life", value: formatNumber(Math.round(remaining * 10) / 10) + " years" },
        details: [
          { label: "Expected Total Lifespan", value: formatNumber(Math.round(adjustedLife * 10) / 10) + " years" },
          { label: "Life Used", value: formatNumber(Math.round(percentUsed)) + "%" },
          { label: "Status", value: status },
        ],
      };
    },
  }],
  relatedSlugs: ["repair-vs-replace-calculator", "home-maintenance-budget-calculator"],
  faq: [
    { question: "What is the average lifespan of major household appliances?", answer: "Refrigerators and ovens typically last 13 to 15 years, washing machines about 10 to 12 years, dryers 12 to 14 years, and dishwashers 9 to 11 years. Actual lifespan depends on usage, maintenance, and build quality." },
    { question: "How can I extend the life of my appliances?", answer: "Regular maintenance such as cleaning filters, checking seals, descaling, and avoiding overloading can significantly extend appliance life. Following manufacturer maintenance schedules is the most effective approach." },
  ],
  formula: "Remaining Life = (Base Lifespan x Usage Modifier) - Current Age",
};
