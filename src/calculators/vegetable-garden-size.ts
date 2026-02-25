import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vegetableGardenSizeCalculator: CalculatorDefinition = {
  slug: "vegetable-garden-size-calculator",
  title: "Vegetable Garden Size Planner",
  description: "Free vegetable garden size planner. Calculate the ideal garden size based on the number of people you want to feed, vegetable types, and growing season.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["vegetable garden size", "garden planner", "how big should my garden be", "garden size calculator", "vegetable plot size"],
  variants: [
    {
      id: "by-people",
      name: "Garden Size by People",
      description: "Calculate garden size based on the number of people to feed",
      fields: [
        { name: "people", label: "Number of People", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "goal", label: "Growing Goal", type: "select", options: [
          { label: "Supplement grocery shopping", value: "100" },
          { label: "Provide most summer vegetables", value: "200" },
          { label: "Full self-sufficiency (year-round)", value: "400" },
        ], defaultValue: "200" },
        { name: "experience", label: "Experience Level", type: "select", options: [
          { label: "Beginner (add 20% buffer)", value: "1.2" },
          { label: "Intermediate", value: "1.0" },
          { label: "Advanced (intensive planting)", value: "0.85" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const people = inputs.people as number;
        const sqftPerPerson = parseInt(inputs.goal as string) || 200;
        const modifier = parseFloat(inputs.experience as string) || 1.0;
        if (!people) return null;

        const baseSqft = people * sqftPerPerson;
        const adjustedSqft = baseSqft * modifier;
        const lengthFt = Math.ceil(Math.sqrt(adjustedSqft));
        const beds4x8 = Math.ceil(adjustedSqft / 32);

        return {
          primary: { label: "Recommended Garden Size", value: `${formatNumber(adjustedSqft)} sq ft` },
          details: [
            { label: "Approximate dimensions", value: `${lengthFt} × ${lengthFt} ft` },
            { label: "Base sq ft per person", value: `${sqftPerPerson} sq ft` },
            { label: "Equivalent 4×8 raised beds", value: `${beds4x8}` },
            { label: "People to feed", value: `${people}` },
          ],
          note: "These are general guidelines. Actual yield depends on climate, soil quality, and vegetable selection.",
        };
      },
    },
    {
      id: "by-vegetables",
      name: "Garden Size by Vegetable Count",
      description: "Calculate space needed for a specific number of vegetable plants",
      fields: [
        { name: "tomatoes", label: "Tomato Plants", type: "number", placeholder: "e.g. 6", defaultValue: 0 },
        { name: "peppers", label: "Pepper Plants", type: "number", placeholder: "e.g. 4", defaultValue: 0 },
        { name: "squash", label: "Squash / Zucchini Plants", type: "number", placeholder: "e.g. 3", defaultValue: 0 },
        { name: "lettuce", label: "Lettuce / Greens Plants", type: "number", placeholder: "e.g. 12", defaultValue: 0 },
        { name: "beans", label: "Bean Plants", type: "number", placeholder: "e.g. 20", defaultValue: 0 },
        { name: "cucumbers", label: "Cucumber Plants", type: "number", placeholder: "e.g. 4", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const tomatoes = (inputs.tomatoes as number) || 0;
        const peppers = (inputs.peppers as number) || 0;
        const squash = (inputs.squash as number) || 0;
        const lettuce = (inputs.lettuce as number) || 0;
        const beans = (inputs.beans as number) || 0;
        const cucumbers = (inputs.cucumbers as number) || 0;

        const tomatoArea = tomatoes * 6;
        const pepperArea = peppers * 3;
        const squashArea = squash * 12;
        const lettuceArea = lettuce * 1;
        const beanArea = beans * 0.75;
        const cucumberArea = cucumbers * 6;

        const totalArea = tomatoArea + pepperArea + squashArea + lettuceArea + beanArea + cucumberArea;
        if (totalArea === 0) return null;

        const totalWithPaths = totalArea * 1.3;

        return {
          primary: { label: "Total Garden Area Needed", value: `${formatNumber(totalWithPaths)} sq ft` },
          details: [
            { label: "Growing area only", value: `${formatNumber(totalArea)} sq ft` },
            { label: "Tomatoes", value: `${tomatoArea} sq ft (${tomatoes} plants × 6 sq ft)` },
            { label: "Peppers", value: `${pepperArea} sq ft (${peppers} plants × 3 sq ft)` },
            { label: "Squash / Zucchini", value: `${squashArea} sq ft (${squash} plants × 12 sq ft)` },
            { label: "Lettuce / Greens", value: `${lettuceArea} sq ft (${lettuce} plants × 1 sq ft)` },
            { label: "Beans", value: `${formatNumber(beanArea)} sq ft (${beans} plants × 0.75 sq ft)` },
            { label: "Cucumbers", value: `${cucumberArea} sq ft (${cucumbers} plants × 6 sq ft)` },
          ],
          note: "Total includes 30% extra for pathways and access. Space per plant is based on standard spacing guidelines.",
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "soil-volume-calculator", "garden-row-spacing-calculator"],
  faq: [
    { question: "How big should a vegetable garden be for a family of 4?", answer: "A 600-800 sq ft garden can provide most summer vegetables for a family of 4. For year-round self-sufficiency, plan for 1,600+ sq ft. Beginners should start with 100-200 sq ft." },
    { question: "What is the minimum garden size for a beginner?", answer: "Start with a 4×8 ft raised bed (32 sq ft) or a 10×10 ft plot (100 sq ft). This gives enough space for 5-8 different vegetables without being overwhelming." },
  ],
  formula: "Garden Size = People × Sq Ft per Person × Experience Modifier",
};
