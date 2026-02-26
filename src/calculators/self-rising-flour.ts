import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const selfRisingFlourCalculator: CalculatorDefinition = {
  slug: "self-rising-flour",
  title: "Self-Rising Flour Substitute Calculator",
  description: "Free online self-rising flour substitute calculator. Make your own self-rising flour with all-purpose flour, baking powder, and salt.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["self-rising flour", "self-raising flour", "flour substitute", "baking powder", "flour conversion", "baking substitute"],
  variants: [
    {
      id: "make-self-rising",
      name: "Make Self-Rising Flour",
      fields: [
        { name: "cups", label: "Self-Rising Flour Needed (cups)", type: "number", placeholder: "e.g. 2", step: 0.25 },
      ],
      calculate: (inputs) => {
        const cups = parseFloat(inputs.cups as string) || 0;

        // Per 1 cup of self-rising flour:
        // 1 cup all-purpose flour + 1.5 tsp baking powder + 0.25 tsp salt
        const flourCups = cups;
        const bakingPowderTsp = cups * 1.5;
        const saltTsp = cups * 0.25;

        const flourGrams = flourCups * 125;
        const bakingPowderGrams = bakingPowderTsp * 4.6;
        const saltGrams = saltTsp * 6;

        return {
          primary: { label: "All-Purpose Flour", value: `${formatNumber(flourCups)} cups (${formatNumber(flourGrams)} g)` },
          details: [
            { label: "Baking Powder", value: `${formatNumber(bakingPowderTsp)} tsp (${formatNumber(bakingPowderGrams)} g)` },
            { label: "Salt", value: `${formatNumber(saltTsp)} tsp (${formatNumber(saltGrams)} g)` },
            { label: "Self-Rising Flour Replaced", value: `${formatNumber(cups)} cups` },
          ],
          note: "Whisk dry ingredients together thoroughly before using.",
        };
      },
    },
    {
      id: "replace-ap-flour",
      name: "Use Self-Rising Instead of AP Flour",
      fields: [
        { name: "apCups", label: "All-Purpose Flour in Recipe (cups)", type: "number", placeholder: "e.g. 2", step: 0.25 },
        { name: "bpTsp", label: "Baking Powder in Recipe (tsp)", type: "number", placeholder: "e.g. 2", step: 0.25 },
        { name: "saltTsp", label: "Salt in Recipe (tsp)", type: "number", placeholder: "e.g. 0.5", step: 0.25 },
      ],
      calculate: (inputs) => {
        const apCups = parseFloat(inputs.apCups as string) || 0;
        const bpTsp = parseFloat(inputs.bpTsp as string) || 0;
        const saltTsp = parseFloat(inputs.saltTsp as string) || 0;

        // Self-rising flour has 1.5 tsp BP and 0.25 tsp salt per cup
        const srFlourCups = apCups;
        const existingBP = apCups * 1.5;
        const existingSalt = apCups * 0.25;

        const extraBP = Math.max(0, bpTsp - existingBP);
        const extraSalt = Math.max(0, saltTsp - existingSalt);
        const reduceBP = Math.max(0, existingBP - bpTsp);
        const reduceSalt = Math.max(0, existingSalt - saltTsp);

        return {
          primary: { label: "Self-Rising Flour", value: `${formatNumber(srFlourCups)} cups` },
          details: [
            { label: "Extra Baking Powder Needed", value: `${formatNumber(extraBP)} tsp` },
            { label: "Extra Salt Needed", value: `${formatNumber(extraSalt)} tsp` },
            { label: "BP Already in SR Flour", value: `${formatNumber(existingBP)} tsp` },
            { label: "Salt Already in SR Flour", value: `${formatNumber(existingSalt)} tsp` },
          ],
          note: reduceBP > 0 || reduceSalt > 0
            ? `Note: Self-rising flour adds more leavening/salt than recipe calls for. This may affect the result.`
            : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["grams-to-cups", "cups-to-grams", "sourdough-calc"],
  faq: [
    {
      question: "What is in self-rising flour?",
      answer: "Self-rising flour is all-purpose flour with baking powder and salt already mixed in. The standard ratio is 1 cup all-purpose flour + 1.5 teaspoons baking powder + 0.25 teaspoon salt.",
    },
    {
      question: "Can I use self-rising flour instead of all-purpose?",
      answer: "Yes, but you need to reduce or eliminate the baking powder and salt in your recipe since they are already in self-rising flour. Do not use self-rising flour for yeast breads.",
    },
    {
      question: "How do I make self-rising flour at home?",
      answer: "For each cup of self-rising flour needed, whisk together 1 cup of all-purpose flour, 1.5 teaspoons of baking powder, and 0.25 teaspoon of salt. Sift or whisk well to distribute evenly.",
    },
  ],
  formula: "1 cup self-rising = 1 cup AP flour + 1.5 tsp baking powder + 0.25 tsp salt",
};
