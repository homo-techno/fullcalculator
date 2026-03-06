import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const livestockPregnancyDueDateCalculator: CalculatorDefinition = {
  slug: "livestock-pregnancy-due-date-calculator",
  title: "Livestock Pregnancy Due Date Calculator",
  description: "Calculate expected due dates for livestock breeding programs based on species-specific gestation periods and breeding date.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["livestock due date","gestation calculator","calving date calculator","lambing date"],
  variants: [{
    id: "standard",
    name: "Livestock Pregnancy Due Date",
    description: "Calculate expected due dates for livestock breeding programs based on species-specific gestation periods and breeding date.",
    fields: [
      { name: "species", label: "Species", type: "select", options: [{ value: "1", label: "Cattle (283 days)" }, { value: "2", label: "Horse (340 days)" }, { value: "3", label: "Sheep (147 days)" }, { value: "4", label: "Goat (150 days)" }, { value: "5", label: "Swine (114 days)" }], defaultValue: "1" },
      { name: "breedMonth", label: "Breeding Month (1-12)", type: "number", min: 1, max: 12, defaultValue: 4 },
      { name: "breedDay", label: "Breeding Day", type: "number", min: 1, max: 31, defaultValue: 15 },
      { name: "numBred", label: "Number Bred", type: "number", min: 1, max: 5000, defaultValue: 30 },
      { name: "conceptionRate", label: "Conception Rate (%)", type: "number", min: 20, max: 100, defaultValue: 65 },
    ],
    calculate: (inputs) => {
      const sp = inputs.species as number;
      const bm = inputs.breedMonth as number;
      const bd = inputs.breedDay as number;
      const nb = inputs.numBred as number;
      const cr = inputs.conceptionRate as number;
      if (!bm || !bd || !nb || !cr) return null;
      var gestation = sp == 1 ? 283 : sp == 2 ? 340 : sp == 3 ? 147 : sp == 4 ? 150 : 114;
      var breedDate = new Date(2026, bm - 1, bd);
      var dueDate = new Date(breedDate.getTime() + gestation * 24 * 60 * 60 * 1000);
      var earlyDate = new Date(breedDate.getTime() + (gestation - 10) * 24 * 60 * 60 * 1000);
      var lateDate = new Date(breedDate.getTime() + (gestation + 10) * 24 * 60 * 60 * 1000);
      var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      var expectedPregnant = Math.round(nb * cr / 100);
      var dueDateStr = months[dueDate.getMonth()] + " " + dueDate.getDate() + ", " + dueDate.getFullYear();
      var earlyStr = months[earlyDate.getMonth()] + " " + earlyDate.getDate();
      var lateStr = months[lateDate.getMonth()] + " " + lateDate.getDate();
      return {
        primary: { label: "Expected Due Date", value: dueDateStr },
        details: [
          { label: "Gestation Period", value: formatNumber(gestation) + " days" },
          { label: "Due Window", value: earlyStr + " - " + lateStr },
          { label: "Expected Pregnant", value: formatNumber(expectedPregnant) },
          { label: "Breeding Date", value: months[bm - 1] + " " + bd },
        ],
      };
  },
  }],
  relatedSlugs: ["cattle-weight-gain-calculator","livestock-water-needs-calculator"],
  faq: [
    { question: "How long is a cow pregnant?", answer: "The average gestation period for cattle is 283 days or about 9.3 months. Beef breeds tend to be slightly shorter (279-283 days) and dairy breeds slightly longer (279-287 days)." },
    { question: "What is a good conception rate for cattle?", answer: "A good first-service conception rate for cattle AI breeding is 55 to 70 percent. Natural service bulls typically achieve 60 to 75 percent. Overall pregnancy rates for a breeding season should exceed 90 percent." },
  ],
  formula: "Due Date = Breeding Date + Gestation Days; Due Window = Due Date +/- 10 days; Expected Pregnant = Number Bred x Conception Rate",
};
