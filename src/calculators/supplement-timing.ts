import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const supplementTimingCalculator: CalculatorDefinition = {
  slug: "supplement-timing-calculator",
  title: "Supplement Timing Optimizer",
  description:
    "Optimize when to take your supplements for maximum absorption. Get a personalized schedule based on your supplement stack with interaction warnings.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "supplement timing",
    "when to take supplements",
    "supplement schedule",
    "vitamin timing",
    "supplement absorption",
    "supplement interactions",
  ],
  variants: [
    {
      id: "schedule",
      name: "Supplement Schedule Builder",
      description: "Build an optimal supplement timing schedule",
      fields: [
        {
          name: "supplement1",
          label: "Primary Supplement",
          type: "select",
          options: [
            { label: "Multivitamin", value: "multivitamin" },
            { label: "Vitamin D", value: "vitamin_d" },
            { label: "Iron", value: "iron" },
            { label: "Calcium", value: "calcium" },
            { label: "Magnesium", value: "magnesium" },
            { label: "Omega-3 / Fish Oil", value: "omega3" },
            { label: "Probiotics", value: "probiotics" },
            { label: "B-Complex / B12", value: "b_complex" },
            { label: "Vitamin C", value: "vitamin_c" },
            { label: "Zinc", value: "zinc" },
            { label: "Collagen", value: "collagen" },
            { label: "Creatine", value: "creatine" },
          ],
          defaultValue: "vitamin_d",
        },
        {
          name: "supplement2",
          label: "Second Supplement (optional)",
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Vitamin D", value: "vitamin_d" },
            { label: "Iron", value: "iron" },
            { label: "Calcium", value: "calcium" },
            { label: "Magnesium", value: "magnesium" },
            { label: "Omega-3 / Fish Oil", value: "omega3" },
            { label: "Probiotics", value: "probiotics" },
            { label: "B-Complex / B12", value: "b_complex" },
            { label: "Vitamin C", value: "vitamin_c" },
            { label: "Zinc", value: "zinc" },
            { label: "Collagen", value: "collagen" },
            { label: "Creatine", value: "creatine" },
          ],
          defaultValue: "none",
        },
        {
          name: "supplement3",
          label: "Third Supplement (optional)",
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Vitamin D", value: "vitamin_d" },
            { label: "Iron", value: "iron" },
            { label: "Calcium", value: "calcium" },
            { label: "Magnesium", value: "magnesium" },
            { label: "Omega-3 / Fish Oil", value: "omega3" },
            { label: "Probiotics", value: "probiotics" },
            { label: "B-Complex / B12", value: "b_complex" },
            { label: "Vitamin C", value: "vitamin_c" },
            { label: "Zinc", value: "zinc" },
            { label: "Collagen", value: "collagen" },
            { label: "Creatine", value: "creatine" },
          ],
          defaultValue: "none",
        },
        {
          name: "mealtimes",
          label: "Meal Schedule",
          type: "select",
          options: [
            { label: "3 meals (breakfast, lunch, dinner)", value: "3meals" },
            { label: "2 meals (IF / lunch + dinner)", value: "2meals" },
            { label: "Flexible / grazing", value: "flexible" },
          ],
          defaultValue: "3meals",
        },
      ],
      calculate: (inputs) => {
        const sup1 = inputs.supplement1 as string;
        const sup2 = inputs.supplement2 as string;
        const sup3 = inputs.supplement3 as string;

        const supplements = [sup1, sup2, sup3].filter((s) => s !== "none");

        const timingGuide: Record<string, { timing: string; withFood: boolean; notes: string }> = {
          multivitamin: { timing: "Morning", withFood: true, notes: "Take with breakfast containing some fat" },
          vitamin_d: { timing: "Morning/Lunch", withFood: true, notes: "Fat-soluble -- take with a meal containing fat" },
          iron: { timing: "Morning (empty stomach)", withFood: false, notes: "Take on empty stomach with vitamin C. Avoid dairy/calcium 2 hrs before/after" },
          calcium: { timing: "Evening", withFood: true, notes: "Take with dinner. Do not combine with iron or zinc. Split doses >500mg" },
          magnesium: { timing: "Evening/Bedtime", withFood: true, notes: "May promote relaxation and sleep. Glycinate/threonate best for sleep" },
          omega3: { timing: "With any meal", withFood: true, notes: "Take with a fat-containing meal to reduce fishy burps" },
          probiotics: { timing: "Morning (before food)", withFood: false, notes: "Take 30 min before breakfast on empty stomach for best survival" },
          b_complex: { timing: "Morning", withFood: true, notes: "Take with breakfast. May cause insomnia if taken late in day" },
          vitamin_c: { timing: "Morning", withFood: false, notes: "Can take with or without food. Enhances iron absorption when taken together" },
          zinc: { timing: "Evening", withFood: true, notes: "Take with dinner. May cause nausea on empty stomach. Separate from iron/calcium" },
          collagen: { timing: "Morning (empty stomach)", withFood: false, notes: "Best absorbed on empty stomach, ideally with vitamin C" },
          creatine: { timing: "Post-workout or any time", withFood: true, notes: "Timing is less critical -- consistency matters most" },
        };

        // Check for interactions
        const interactions: string[] = [];
        const supsSet = new Set(supplements);
        if (supsSet.has("iron") && supsSet.has("calcium")) {
          interactions.push("Iron + Calcium: Take at least 2 hours apart (calcium blocks iron absorption)");
        }
        if (supsSet.has("iron") && supsSet.has("zinc")) {
          interactions.push("Iron + Zinc: Compete for absorption -- take at different meals");
        }
        if (supsSet.has("calcium") && supsSet.has("zinc")) {
          interactions.push("Calcium + Zinc: May interfere -- take at different times");
        }

        const scheduleDetails = supplements.map((sup) => {
          const guide = timingGuide[sup];
          const name = sup.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          return {
            label: name,
            value: `${guide?.timing || "Any time"} ${guide?.withFood ? "(with food)" : "(empty stomach)"}`,
          };
        });

        const interactionDetails = interactions.map((int, i) => ({
          label: `Warning ${i + 1}`,
          value: int,
        }));

        const totalSupplements = supplements.length;

        return {
          primary: { label: "Supplements to Schedule", value: formatNumber(totalSupplements, 0) },
          details: [
            ...scheduleDetails,
            ...interactionDetails,
            { label: "Total Daily Doses", value: formatNumber(totalSupplements, 0) },
          ],
          note: "Optimal timing can improve absorption by 20-50% for some supplements. Fat-soluble vitamins (A, D, E, K) need dietary fat. Iron is best absorbed on an empty stomach. Calcium and iron should never be taken together. Consult a healthcare provider about your supplement regimen.",
        };
      },
    },
  ],
  relatedSlugs: ["prenatal-vitamin-calculator", "creatine-dosage-calculator", "collagen-intake-calculator"],
  faq: [
    {
      question: "Does it matter when you take supplements?",
      answer:
        "Yes, timing can significantly affect absorption. Fat-soluble vitamins (A, D, E, K) absorb best with dietary fat. Iron absorbs best on an empty stomach. B vitamins can disrupt sleep if taken at night. Magnesium may promote sleep if taken in the evening. Consistency matters more than perfect timing.",
    },
    {
      question: "Which supplements should not be taken together?",
      answer:
        "Key combinations to avoid: calcium + iron (calcium blocks iron absorption), calcium + zinc (compete for absorption), iron + zinc (high doses compete), and calcium + thyroid medication (wait 4 hours). Vitamin C enhances iron absorption, so they work well together.",
    },
    {
      question: "Should supplements be taken with food?",
      answer:
        "Fat-soluble vitamins (A, D, E, K), omega-3s, and multivitamins should be taken with food containing fat. Zinc and calcium absorb better with food. Iron, collagen, and probiotics are better absorbed on an empty stomach. B vitamins can be taken either way but are best with breakfast.",
    },
  ],
  formula:
    "Optimal Schedule = Categorize by (fat-soluble vs water-soluble) + (with food vs empty stomach) + (interaction avoidance timing)",
};
