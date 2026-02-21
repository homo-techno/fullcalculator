import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const harvestDateCalculator: CalculatorDefinition = {
  slug: "harvest-date-calculator",
  title: "Harvest Date Calculator",
  description: "Free harvest date calculator. Estimate when your vegetables and fruits will be ready to harvest based on planting date and days to maturity.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["harvest date calculator", "when to harvest vegetables", "days to maturity calculator", "vegetable harvest time", "garden harvest planner"],
  variants: [
    {
      id: "by-crop",
      name: "By Crop Type",
      description: "Calculate harvest date based on crop and planting date",
      fields: [
        { name: "plantMonth", label: "Planting Month", type: "select", options: [
          { label: "January", value: "0" },
          { label: "February", value: "1" },
          { label: "March", value: "2" },
          { label: "April", value: "3" },
          { label: "May", value: "4" },
          { label: "June", value: "5" },
          { label: "July", value: "6" },
          { label: "August", value: "7" },
          { label: "September", value: "8" },
          { label: "October", value: "9" },
          { label: "November", value: "10" },
          { label: "December", value: "11" },
        ], defaultValue: "4" },
        { name: "plantDay", label: "Planting Day of Month", type: "number", placeholder: "e.g. 15", min: 1, max: 31, defaultValue: 15 },
        { name: "crop", label: "Crop", type: "select", options: [
          { label: "Tomatoes (Determinate)", value: "tomato_det" },
          { label: "Tomatoes (Indeterminate)", value: "tomato_ind" },
          { label: "Peppers (Bell)", value: "pepper_bell" },
          { label: "Peppers (Hot)", value: "pepper_hot" },
          { label: "Cucumbers", value: "cucumber" },
          { label: "Zucchini/Summer Squash", value: "zucchini" },
          { label: "Winter Squash", value: "winter_squash" },
          { label: "Green Beans (Bush)", value: "bean_bush" },
          { label: "Green Beans (Pole)", value: "bean_pole" },
          { label: "Corn (Sweet)", value: "corn" },
          { label: "Lettuce", value: "lettuce" },
          { label: "Carrots", value: "carrot" },
          { label: "Radishes", value: "radish" },
          { label: "Peas", value: "pea" },
          { label: "Broccoli", value: "broccoli" },
          { label: "Cabbage", value: "cabbage" },
          { label: "Potatoes", value: "potato" },
          { label: "Onions", value: "onion" },
          { label: "Watermelon", value: "watermelon" },
          { label: "Cantaloupe", value: "cantaloupe" },
        ], defaultValue: "tomato_det" },
      ],
      calculate: (inputs) => {
        const month = parseInt(inputs.plantMonth as string);
        const day = inputs.plantDay as number;
        const crop = inputs.crop as string;
        if (isNaN(month) || !day) return null;

        const daysToMaturity: Record<string, [number, number]> = {
          tomato_det: [65, 80], tomato_ind: [75, 95], pepper_bell: [60, 80],
          pepper_hot: [70, 90], cucumber: [50, 65], zucchini: [45, 55],
          winter_squash: [80, 110], bean_bush: [50, 60], bean_pole: [60, 70],
          corn: [65, 85], lettuce: [30, 50], carrot: [60, 80], radish: [22, 30],
          pea: [55, 70], broccoli: [55, 80], cabbage: [70, 100], potato: [70, 120],
          onion: [90, 120], watermelon: [75, 95], cantaloupe: [70, 90],
        };

        const range = daysToMaturity[crop] || [60, 90];
        const plantDate = new Date(2025, month, day);
        const earlyDate = new Date(plantDate.getTime() + range[0] * 24 * 60 * 60 * 1000);
        const lateDate = new Date(plantDate.getTime() + range[1] * 24 * 60 * 60 * 1000);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return {
          primary: { label: "Expected Harvest", value: `${monthNames[earlyDate.getMonth()]} ${earlyDate.getDate()} - ${monthNames[lateDate.getMonth()]} ${lateDate.getDate()}` },
          details: [
            { label: "Days to maturity", value: `${range[0]} - ${range[1]} days` },
            { label: "Earliest harvest", value: `${monthNames[earlyDate.getMonth()]} ${earlyDate.getDate()}` },
            { label: "Latest harvest", value: `${monthNames[lateDate.getMonth()]} ${lateDate.getDate()}` },
            { label: "Planting date", value: `${monthNames[month]} ${day}` },
            { label: "Harvest window", value: `${range[1] - range[0]} days` },
          ],
          note: "Days to maturity are counted from transplant date for transplanted crops (tomatoes, peppers) and from seed sowing for direct-sown crops (beans, corn, carrots).",
        };
      },
    },
    {
      id: "custom",
      name: "Custom Days to Maturity",
      description: "Enter custom days to maturity from seed packet",
      fields: [
        { name: "plantMonth", label: "Planting Month", type: "select", options: [
          { label: "January", value: "0" },
          { label: "February", value: "1" },
          { label: "March", value: "2" },
          { label: "April", value: "3" },
          { label: "May", value: "4" },
          { label: "June", value: "5" },
          { label: "July", value: "6" },
          { label: "August", value: "7" },
          { label: "September", value: "8" },
          { label: "October", value: "9" },
          { label: "November", value: "10" },
          { label: "December", value: "11" },
        ], defaultValue: "4" },
        { name: "plantDay", label: "Planting Day", type: "number", placeholder: "e.g. 15", min: 1, max: 31, defaultValue: 15 },
        { name: "daysToMaturity", label: "Days to Maturity", type: "number", placeholder: "e.g. 75", min: 1, max: 365 },
      ],
      calculate: (inputs) => {
        const month = parseInt(inputs.plantMonth as string);
        const day = inputs.plantDay as number;
        const dtm = inputs.daysToMaturity as number;
        if (isNaN(month) || !day || !dtm) return null;

        const plantDate = new Date(2025, month, day);
        const harvestDate = new Date(plantDate.getTime() + dtm * 24 * 60 * 60 * 1000);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weeksToHarvest = Math.ceil(dtm / 7);

        return {
          primary: { label: "Harvest Date", value: `${monthNames[harvestDate.getMonth()]} ${harvestDate.getDate()}` },
          details: [
            { label: "Days to maturity", value: `${dtm} days` },
            { label: "Weeks to harvest", value: `${weeksToHarvest} weeks` },
            { label: "Planting date", value: `${monthNames[month]} ${day}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["seed-starting-calculator", "growing-season-calculator", "vegetable-yield-calculator"],
  faq: [
    { question: "What does 'days to maturity' mean?", answer: "Days to maturity is the expected number of days from planting (or transplanting) until the first harvest. For transplanted crops like tomatoes and peppers, it counts from the transplant date. For direct-sown crops like beans and corn, it counts from the seed sowing date." },
    { question: "Why is my harvest later than expected?", answer: "Several factors can delay harvest: cool temperatures slow growth, insufficient sunlight, poor soil nutrition, water stress, or transplant shock. Days to maturity are estimates based on ideal growing conditions." },
    { question: "Can I succession plant for continuous harvest?", answer: "Yes! Plant a new batch every 2-3 weeks for continuous harvest of fast-maturing crops like lettuce (30 days), radishes (25 days), and beans (55 days). This extends your harvest window throughout the season." },
  ],
  formula: "Harvest Date = Planting Date + Days to Maturity | Harvest Window = Latest Harvest Date - Earliest Harvest Date",
};
