import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const experienceOptions = [
  { label: "Skydiving", value: "skydiving" },
  { label: "Scuba Diving Certification", value: "scuba" },
  { label: "See the Northern Lights", value: "aurora" },
  { label: "Visit Machu Picchu", value: "machupicchu" },
  { label: "Safari in Africa", value: "safari" },
  { label: "Learn to Surf", value: "surf" },
  { label: "Hot Air Balloon Ride", value: "balloon" },
  { label: "Run a Marathon", value: "marathon" },
  { label: "Visit the Great Wall", value: "greatwall" },
  { label: "Bungee Jump", value: "bungee" },
  { label: "Road Trip Across the US", value: "roadtrip" },
  { label: "Visit All 7 Continents", value: "continents" },
];

const experienceCosts: Record<string, { cost: number; prep: string; duration: string }> = {
  skydiving: { cost: 300, prep: "Minimal - book and go", duration: "Half day" },
  scuba: { cost: 500, prep: "3-4 day certification course", duration: "4 days" },
  aurora: { cost: 3000, prep: "Book trip to Iceland/Norway/Finland", duration: "5-7 days" },
  machupicchu: { cost: 2500, prep: "Book flights, permits, train", duration: "5-7 days" },
  safari: { cost: 5000, prep: "Book safari lodge, vaccinations", duration: "7-10 days" },
  surf: { cost: 400, prep: "Book surf lessons", duration: "1 week of lessons" },
  balloon: { cost: 250, prep: "Book a flight", duration: "2-3 hours" },
  marathon: { cost: 200, prep: "3-6 months training", duration: "1 day (race)" },
  greatwall: { cost: 2000, prep: "Book flights to Beijing", duration: "5-7 days" },
  bungee: { cost: 150, prep: "Minimal - book and go", duration: "Half day" },
  roadtrip: { cost: 3500, prep: "Plan route, book lodging", duration: "2-4 weeks" },
  continents: { cost: 30000, prep: "Major planning over years", duration: "Multiple trips" },
};

export const bucketListCalculator: CalculatorDefinition = {
  slug: "bucket-list-calculator",
  title: "Bucket List Cost Calculator",
  description:
    "Free bucket list cost calculator. Estimate the cost of popular bucket list experiences like skydiving, safaris, and world travel to plan and save for your adventures.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "bucket list",
    "bucket list cost",
    "adventure cost",
    "travel bucket list",
    "experience cost",
    "life goals",
  ],
  variants: [
    {
      id: "single-experience",
      name: "Experience Cost",
      description: "Estimate the cost of a bucket list experience",
      fields: [
        {
          name: "experience",
          label: "Bucket List Experience",
          type: "select",
          options: experienceOptions,
        },
        {
          name: "travelers",
          label: "Number of People",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 20,
          defaultValue: 1,
        },
        {
          name: "savingsPerMonth",
          label: "Monthly Savings for This Goal ($)",
          type: "number",
          placeholder: "e.g. 200",
          min: 0,
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const expKey = (inputs.experience as string) || "skydiving";
        const travelers = (inputs.travelers as number) || 1;
        const savings = (inputs.savingsPerMonth as number) || 0;

        const exp = experienceCosts[expKey];
        if (!exp) return null;

        const totalCost = exp.cost * travelers;
        const monthsToSave = savings > 0 ? Math.ceil(totalCost / savings) : 0;
        const weeksToSave = monthsToSave * 4.345;
        const costPerPerson = exp.cost;

        const expLabel =
          experienceOptions.find((o) => o.value === expKey)?.label ?? expKey;

        const details = [
          { label: "Experience", value: expLabel },
          { label: "Cost per person", value: `$${formatNumber(costPerPerson)}` },
          { label: "Number of people", value: formatNumber(travelers) },
          { label: "Total estimated cost", value: `$${formatNumber(totalCost)}` },
          { label: "Preparation", value: exp.prep },
          { label: "Duration", value: exp.duration },
        ];

        if (savings > 0) {
          details.push({
            label: "Months to save",
            value: formatNumber(monthsToSave),
          });
          details.push({
            label: "Target date",
            value: `~${formatNumber(monthsToSave)} months from now`,
          });
        }

        return {
          primary: {
            label: "Estimated Total Cost",
            value: `$${formatNumber(totalCost)}`,
          },
          details,
        };
      },
    },
    {
      id: "bucket-list-total",
      name: "Full Bucket List Budget",
      description: "Estimate the total cost of multiple bucket list items",
      fields: [
        {
          name: "item1",
          label: "Item 1 Cost ($)",
          type: "number",
          placeholder: "e.g. 300",
          min: 0,
          prefix: "$",
        },
        {
          name: "item2",
          label: "Item 2 Cost ($)",
          type: "number",
          placeholder: "e.g. 2500",
          min: 0,
          prefix: "$",
        },
        {
          name: "item3",
          label: "Item 3 Cost ($)",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
          prefix: "$",
        },
        {
          name: "item4",
          label: "Item 4 Cost ($)",
          type: "number",
          placeholder: "e.g. 3000",
          min: 0,
          prefix: "$",
        },
        {
          name: "item5",
          label: "Item 5 Cost ($)",
          type: "number",
          placeholder: "e.g. 150",
          min: 0,
          prefix: "$",
        },
        {
          name: "yearsToComplete",
          label: "Years to Complete All",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          max: 50,
          defaultValue: 10,
        },
      ],
      calculate: (inputs) => {
        const items = [
          (inputs.item1 as number) || 0,
          (inputs.item2 as number) || 0,
          (inputs.item3 as number) || 0,
          (inputs.item4 as number) || 0,
          (inputs.item5 as number) || 0,
        ];
        const years = (inputs.yearsToComplete as number) || 10;

        const activeItems = items.filter((i) => i > 0);
        const total = activeItems.reduce((s, i) => s + i, 0);

        if (total <= 0) return null;

        const monthlyNeeded = total / (years * 12);
        const weeklyNeeded = total / (years * 52);
        const avgPerItem = total / activeItems.length;

        return {
          primary: {
            label: "Total Bucket List Budget",
            value: `$${formatNumber(total)}`,
          },
          details: [
            { label: "Number of items", value: formatNumber(activeItems.length) },
            { label: "Timeframe", value: `${years} years` },
            { label: "Monthly savings needed", value: `$${formatNumber(monthlyNeeded, 2)}` },
            { label: "Weekly savings needed", value: `$${formatNumber(weeklyNeeded, 2)}` },
            { label: "Average cost per item", value: `$${formatNumber(avgPerItem)}` },
            { label: "Most expensive item", value: `$${formatNumber(Math.max(...activeItems))}` },
            { label: "Least expensive item", value: `$${formatNumber(Math.min(...activeItems))}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "travel-budget-calculator",
    "savings-goal-calculator",
    "vacation-cost-calculator",
  ],
  faq: [
    {
      question: "How much does a typical bucket list cost?",
      answer:
        "A bucket list of 10-15 popular experiences (skydiving, travel, safaris) typically totals $15,000-$50,000 depending on the activities and number of travelers. Many items are surprisingly affordable individually.",
    },
    {
      question: "What are the most affordable bucket list experiences?",
      answer:
        "Bungee jumping ($100-200), skydiving ($200-350), hot air balloon rides ($200-300), and running a marathon ($100-200 entry fee) are among the most affordable bucket list items.",
    },
  ],
  formula:
    "Total Cost = Sum of all experience costs x Number of Travelers. Monthly Savings = Total / (Years x 12).",
};
