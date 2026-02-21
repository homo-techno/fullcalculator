import type { CalculatorDefinition } from "./types";

export const skincareRoutineCalculator: CalculatorDefinition = {
  slug: "skincare-routine-calculator",
  title: "Skincare Routine Calculator",
  description: "Free skincare routine builder. Get a personalized morning and evening skincare routine based on your skin type and concerns.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["skincare routine calculator", "skincare routine builder", "skincare order", "skincare steps", "skin care routine"],
  variants: [
    {
      id: "routine-builder",
      name: "Routine Builder",
      description: "Build a personalized skincare routine based on your skin type and goals",
      fields: [
        { name: "skinType", label: "Skin Type", type: "select", options: [
          { label: "Oily", value: "oily" },
          { label: "Dry", value: "dry" },
          { label: "Combination", value: "combination" },
          { label: "Normal", value: "normal" },
          { label: "Sensitive", value: "sensitive" },
        ], defaultValue: "normal" },
        { name: "concern", label: "Primary Concern", type: "select", options: [
          { label: "Acne / breakouts", value: "acne" },
          { label: "Anti-aging / wrinkles", value: "aging" },
          { label: "Dark spots / hyperpigmentation", value: "pigmentation" },
          { label: "Dullness / uneven texture", value: "dullness" },
          { label: "Redness / irritation", value: "redness" },
          { label: "Dehydration", value: "dehydration" },
          { label: "General maintenance", value: "maintenance" },
        ], defaultValue: "maintenance" },
        { name: "budget", label: "Budget Level", type: "select", options: [
          { label: "Minimal (3-4 products)", value: "minimal" },
          { label: "Moderate (5-6 products)", value: "moderate" },
          { label: "Comprehensive (7+ products)", value: "comprehensive" },
        ], defaultValue: "moderate" },
        { name: "timeOfDay", label: "Routine", type: "select", options: [
          { label: "Morning (AM)", value: "am" },
          { label: "Evening (PM)", value: "pm" },
          { label: "Both AM & PM", value: "both" },
        ], defaultValue: "both" },
      ],
      calculate: (inputs) => {
        const skinType = inputs.skinType as string;
        const concern = inputs.concern as string;
        const budget = inputs.budget as string;
        const timeOfDay = inputs.timeOfDay as string;

        // Build AM routine
        const amSteps: string[] = [];
        amSteps.push("1. Cleanser");
        if (budget !== "minimal") amSteps.push("2. Toner");

        // Active based on concern (AM)
        if (concern === "pigmentation" || concern === "dullness") {
          amSteps.push(`${amSteps.length + 1}. Vitamin C serum`);
        } else if (concern === "dehydration") {
          amSteps.push(`${amSteps.length + 1}. Hyaluronic acid serum`);
        } else if (concern === "acne" && budget === "comprehensive") {
          amSteps.push(`${amSteps.length + 1}. Niacinamide serum`);
        } else if (concern === "aging") {
          amSteps.push(`${amSteps.length + 1}. Antioxidant serum (Vitamin C)`);
        } else if (concern === "redness") {
          amSteps.push(`${amSteps.length + 1}. Centella / calming serum`);
        }

        if (budget === "comprehensive") {
          amSteps.push(`${amSteps.length + 1}. Eye cream`);
        }

        amSteps.push(`${amSteps.length + 1}. Moisturizer`);
        amSteps.push(`${amSteps.length + 1}. Sunscreen (SPF 30+)`);

        // Build PM routine
        const pmSteps: string[] = [];
        if (budget !== "minimal") {
          pmSteps.push("1. Oil cleanser / micellar water (first cleanse)");
          pmSteps.push("2. Water-based cleanser (second cleanse)");
        } else {
          pmSteps.push("1. Cleanser");
        }
        if (budget !== "minimal") pmSteps.push(`${pmSteps.length + 1}. Toner`);

        // PM actives based on concern
        if (concern === "acne") {
          pmSteps.push(`${pmSteps.length + 1}. Salicylic acid (BHA) treatment`);
        } else if (concern === "aging") {
          pmSteps.push(`${pmSteps.length + 1}. Retinol / retinoid`);
        } else if (concern === "pigmentation") {
          pmSteps.push(`${pmSteps.length + 1}. Alpha arbutin / niacinamide serum`);
        } else if (concern === "dullness") {
          pmSteps.push(`${pmSteps.length + 1}. AHA / glycolic acid (2-3x per week)`);
        } else if (concern === "redness") {
          pmSteps.push(`${pmSteps.length + 1}. Azelaic acid serum`);
        } else if (concern === "dehydration") {
          pmSteps.push(`${pmSteps.length + 1}. Hyaluronic acid serum`);
        }

        if (budget === "comprehensive") {
          pmSteps.push(`${pmSteps.length + 1}. Eye cream`);
        }

        // Moisturizer type based on skin type
        let moisturizerType: string;
        if (skinType === "oily") moisturizerType = "Lightweight gel moisturizer";
        else if (skinType === "dry") moisturizerType = "Rich cream moisturizer";
        else if (skinType === "sensitive") moisturizerType = "Fragrance-free barrier cream";
        else moisturizerType = "Moisturizer";

        pmSteps.push(`${pmSteps.length + 1}. ${moisturizerType}`);
        if (skinType === "dry" && budget === "comprehensive") {
          pmSteps.push(`${pmSteps.length + 1}. Facial oil (seal in moisture)`);
        }

        // Cleanser type recommendation
        let cleanserType: string;
        if (skinType === "oily") cleanserType = "Gel or foaming cleanser";
        else if (skinType === "dry") cleanserType = "Cream or milk cleanser";
        else if (skinType === "sensitive") cleanserType = "Gentle, fragrance-free cleanser";
        else cleanserType = "Gentle gel or cream cleanser";

        let routineDisplay: string;
        if (timeOfDay === "am") routineDisplay = amSteps.join(" → ");
        else if (timeOfDay === "pm") routineDisplay = pmSteps.join(" → ");
        else routineDisplay = "See AM & PM details below";

        const totalProducts = new Set([...amSteps, ...pmSteps]).size;

        return {
          primary: { label: "Recommended Routine", value: `${amSteps.length + pmSteps.length} steps total` },
          details: [
            { label: "Skin Type", value: skinType.charAt(0).toUpperCase() + skinType.slice(1) },
            { label: "Primary Concern", value: concern.charAt(0).toUpperCase() + concern.slice(1) },
            { label: "Cleanser Type", value: cleanserType },
            { label: "AM Routine", value: amSteps.join(", ") },
            { label: "PM Routine", value: pmSteps.join(", ") },
            { label: "Key Tip", value: "Apply products thinnest to thickest. Wait 1-2 minutes between actives." },
          ],
          note: "Introduce new products one at a time, waiting 2 weeks between additions. Always patch test new actives. Sunscreen is non-negotiable in the AM.",
        };
      },
    },
  ],
  relatedSlugs: ["skin-type-calculator", "sunscreen-amount-calculator"],
  faq: [
    { question: "What order should I apply skincare products?", answer: "Apply from thinnest to thickest consistency: cleanser → toner → serum/essence → eye cream → moisturizer → sunscreen (AM only). Oil-based products go last in PM." },
    { question: "How many skincare products do I actually need?", answer: "A minimal effective routine needs just 3-4 products: cleanser, moisturizer, and sunscreen (AM). You can add one targeted treatment (like retinol or vitamin C) for specific concerns." },
    { question: "Can I use retinol and vitamin C together?", answer: "It is best to use them at different times: vitamin C in the morning (antioxidant protection) and retinol at night (cell turnover). Using both at once can cause irritation." },
    { question: "How long until I see results from a new skincare routine?", answer: "Allow 4-6 weeks for most products, and 3-6 months for anti-aging ingredients like retinol. Skin cell turnover takes about 28 days, so patience is essential." },
  ],
  formula: "Routine order: Cleanser → Toner → Serum/Active → Eye Cream → Moisturizer → Sunscreen (AM) | Apply thinnest to thickest consistency",
};
