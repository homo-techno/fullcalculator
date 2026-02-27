import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const summerCampCostCalculator: CalculatorDefinition = {
  slug: "summer-camp-cost-calculator",
  title: "Summer Camp Cost Comparison Calculator",
  description:
    "Compare summer camp costs by type. Estimate expenses for day camp, overnight camp, specialty camp, and sports camp including fees, gear, and transportation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "summer camp cost",
    "camp comparison",
    "day camp",
    "overnight camp",
    "camp budget",
  ],
  variants: [
    {
      id: "singleCamp",
      name: "Single Camp Cost",
      description: "Calculate the total cost for one camp session",
      fields: [
        { name: "campType", label: "Camp Type", type: "select", options: [
          { label: "Day camp", value: "day" },
          { label: "Overnight/Sleepaway camp", value: "overnight" },
          { label: "Specialty camp (STEM, arts)", value: "specialty" },
          { label: "Sports camp", value: "sports" },
          { label: "Church/Religious camp", value: "church" },
        ], defaultValue: "day" },
        { name: "tuition", label: "Camp Tuition/Fee ($)", type: "number", placeholder: "e.g. 300" },
        { name: "numWeeks", label: "Number of Weeks", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "numChildren", label: "Number of Children", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "gearCost", label: "Gear/Supplies Needed ($)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "transportDaily", label: "Daily Transportation ($)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const campType = inputs.campType as string;
        const numWeeks = parseFloat(inputs.numWeeks as string) || 1;
        const numChildren = parseFloat(inputs.numChildren as string) || 1;
        const gearCost = parseFloat(inputs.gearCost as string) || 0;
        const transportDaily = parseFloat(inputs.transportDaily as string) || 0;

        const defaultTuition: Record<string, number> = {
          day: 250,
          overnight: 800,
          specialty: 400,
          sports: 350,
          church: 200,
        };

        const inputTuition = parseFloat(inputs.tuition as string);
        const weeklyTuition = isNaN(inputTuition) ? (defaultTuition[campType] || 300) : inputTuition;
        const tuitionTotal = weeklyTuition * numWeeks;
        const transportTotal = transportDaily * numWeeks * 5;
        const perChildTotal = tuitionTotal + gearCost + transportTotal;
        const grandTotal = perChildTotal * numChildren;

        return {
          primary: { label: "Total Camp Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Tuition Total", value: `$${formatNumber(tuitionTotal * numChildren, 2)}` },
            { label: "Weekly Tuition", value: `$${formatNumber(weeklyTuition, 2)}` },
            { label: "Gear/Supplies", value: `$${formatNumber(gearCost * numChildren, 2)}` },
            { label: "Transportation", value: `$${formatNumber(transportTotal * numChildren, 2)}` },
            { label: "Cost per Child", value: `$${formatNumber(perChildTotal, 2)}` },
            { label: "Cost per Week per Child", value: `$${formatNumber(perChildTotal / numWeeks, 2)}` },
          ],
        };
      },
    },
    {
      id: "summerPlan",
      name: "Full Summer Plan",
      description: "Plan camp coverage for the whole summer",
      fields: [
        { name: "totalWeeksNeeded", label: "Weeks of Summer to Cover", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "dayCampWeeks", label: "Weeks of Day Camp", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "dayCampCost", label: "Day Camp Weekly Cost ($)", type: "number", placeholder: "e.g. 250", defaultValue: 250 },
        { name: "overnightWeeks", label: "Weeks of Overnight Camp", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "overnightCost", label: "Overnight Camp Weekly Cost ($)", type: "number", placeholder: "e.g. 800", defaultValue: 800 },
        { name: "specialtyWeeks", label: "Weeks of Specialty Camp", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "specialtyCost", label: "Specialty Camp Weekly Cost ($)", type: "number", placeholder: "e.g. 400", defaultValue: 400 },
        { name: "numChildren", label: "Number of Children", type: "number", placeholder: "e.g. 2", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const totalWeeksNeeded = parseFloat(inputs.totalWeeksNeeded as string) || 0;
        const dayCampWeeks = parseFloat(inputs.dayCampWeeks as string) || 0;
        const dayCampCost = parseFloat(inputs.dayCampCost as string) || 0;
        const overnightWeeks = parseFloat(inputs.overnightWeeks as string) || 0;
        const overnightCost = parseFloat(inputs.overnightCost as string) || 0;
        const specialtyWeeks = parseFloat(inputs.specialtyWeeks as string) || 0;
        const specialtyCost = parseFloat(inputs.specialtyCost as string) || 0;
        const numChildren = parseFloat(inputs.numChildren as string) || 1;

        const dayTotal = dayCampWeeks * dayCampCost;
        const overnightTotal = overnightWeeks * overnightCost;
        const specialtyTotal = specialtyWeeks * specialtyCost;
        const perChildTotal = dayTotal + overnightTotal + specialtyTotal;
        const grandTotal = perChildTotal * numChildren;
        const weeksCovered = dayCampWeeks + overnightWeeks + specialtyWeeks;
        const uncoveredWeeks = Math.max(0, totalWeeksNeeded - weeksCovered);

        return {
          primary: { label: "Total Summer Camp Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Day Camp Total", value: `$${formatNumber(dayTotal * numChildren, 2)}` },
            { label: "Overnight Camp Total", value: `$${formatNumber(overnightTotal * numChildren, 2)}` },
            { label: "Specialty Camp Total", value: `$${formatNumber(specialtyTotal * numChildren, 2)}` },
            { label: "Weeks Covered", value: formatNumber(weeksCovered, 0) },
            { label: "Uncovered Weeks", value: formatNumber(uncoveredWeeks, 0) },
            { label: "Avg Cost per Week", value: weeksCovered > 0 ? `$${formatNumber(grandTotal / weeksCovered, 2)}` : "N/A" },
          ],
          note: uncoveredWeeks > 0 ? `You still need coverage for ${uncoveredWeeks} week(s).` : "All summer weeks are covered!",
        };
      },
    },
  ],
  relatedSlugs: ["back-to-school-cost-calculator", "baby-first-year-cost-calculator", "budget-calculator"],
  faq: [
    {
      question: "How much does summer camp cost?",
      answer:
        "Day camp averages $200-$400 per week, overnight camp $600-$1,500+ per week, and specialty camps (STEM, arts, sports) $300-$600 per week. The total summer cost for one child ranges from $1,000-$5,000+.",
    },
    {
      question: "Are there financial aid options for summer camp?",
      answer:
        "Yes. Many camps offer scholarships and sliding-scale fees. The YMCA, Boys & Girls Clubs, and many churches offer affordable options. Check if your employer offers dependent care FSA, which lets you pay with pre-tax dollars.",
    },
    {
      question: "How do I choose between day camp and overnight camp?",
      answer:
        "Day camp works for younger kids (5-9), is cheaper, and maintains home routine. Overnight camp builds independence and is great for kids 8+, but costs more. Consider a short overnight session (1 week) as a trial run.",
    },
  ],
  formula:
    "Total = (Day Camp Weeks x Weekly Cost + Overnight Weeks x Weekly Cost + Specialty Weeks x Weekly Cost + Gear) x Number of Children",
};
