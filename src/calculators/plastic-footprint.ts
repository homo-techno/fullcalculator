import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plasticFootprintCalculator: CalculatorDefinition = {
  slug: "plastic-footprint-calculator",
  title: "Plastic Footprint Calculator",
  description:
    "Free plastic footprint calculator. Estimate your annual plastic waste from bottles, bags, packaging, and takeout containers.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "plastic footprint",
    "plastic waste",
    "single-use plastic",
    "plastic pollution",
    "plastic consumption",
    "ocean plastic",
  ],
  variants: [
    {
      id: "weekly",
      name: "Weekly Plastic Usage",
      fields: [
        {
          name: "bottles",
          label: "Plastic Bottles per Week",
          type: "number",
          placeholder: "e.g. 7",
        },
        {
          name: "bags",
          label: "Plastic Bags per Week",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "takeout",
          label: "Takeout Containers per Week",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "packaging",
          label: "Packaging Items per Week",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "recycleRate",
          label: "Recycling Rate",
          type: "select",
          options: [
            { label: "None (0%)", value: "0" },
            { label: "Some (25%)", value: "0.25" },
            { label: "Half (50%)", value: "0.5" },
            { label: "Most (75%)", value: "0.75" },
            { label: "All (100%)", value: "1" },
          ],
        },
      ],
      calculate: (inputs) => {
        const bottles = (inputs.bottles as number) || 0;
        const bags = (inputs.bags as number) || 0;
        const takeout = (inputs.takeout as number) || 0;
        const packaging = (inputs.packaging as number) || 0;
        const recycleRate = parseFloat((inputs.recycleRate as string) || "0");
        if (!bottles && !bags && !takeout && !packaging) return null;

        const bottleWeightG = 12.7;
        const bagWeightG = 5.5;
        const takeoutWeightG = 25;
        const packagingWeightG = 15;

        const weeklyG =
          bottles * bottleWeightG +
          bags * bagWeightG +
          takeout * takeoutWeightG +
          packaging * packagingWeightG;
        const annualG = weeklyG * 52;
        const annualKg = annualG / 1000;
        const wasteKg = annualKg * (1 - recycleRate);
        const recycledKg = annualKg * recycleRate;

        return {
          primary: {
            label: "Annual Plastic Consumption",
            value: formatNumber(annualKg, 2) + " kg",
          },
          details: [
            { label: "Weekly Plastic", value: formatNumber(weeklyG, 1) + " g" },
            { label: "Annual Waste (landfill/ocean)", value: formatNumber(wasteKg, 2) + " kg" },
            { label: "Annual Recycled", value: formatNumber(recycledKg, 2) + " kg" },
            { label: "Bottles per Year", value: formatNumber(bottles * 52, 0) },
            { label: "Bags per Year", value: formatNumber(bags * 52, 0) },
          ],
          note: "The average person generates about 35 kg of plastic waste per year. Reducing single-use plastics can significantly lower your footprint.",
        };
      },
    },
  ],
  relatedSlugs: ["carbon-footprint-calculator", "recycling-savings-calculator"],
  faq: [
    {
      question: "How much plastic does the average person use?",
      answer:
        "The average person uses about 100 kg of plastic per year globally. In the US, this figure is closer to 130 kg. Only about 9% of all plastic ever produced has been recycled.",
    },
    {
      question: "How long does plastic take to decompose?",
      answer:
        "Plastic bottles take about 450 years to decompose, plastic bags take 10-20 years, and some plastics can take up to 1000 years. During decomposition, they break into microplastics.",
    },
  ],
  formula:
    "Annual Plastic = (Bottles x 12.7g + Bags x 5.5g + Takeout x 25g + Packaging x 15g) x 52 weeks. Waste = Total x (1 - Recycle Rate).",
};
