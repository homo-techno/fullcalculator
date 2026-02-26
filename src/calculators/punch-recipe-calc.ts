import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const punchRecipeCalculator: CalculatorDefinition = {
  slug: "punch-recipe-calculator",
  title: "Party Punch Recipe Scaler",
  description:
    "Free party punch recipe scaler. Calculate ingredient quantities to make punch for any number of guests, with or without alcohol.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "punch recipe calculator",
    "party punch scaler",
    "punch for crowd",
    "punch bowl calculator",
    "how much punch",
    "party drink calculator",
  ],
  variants: [
    {
      id: "by-guests",
      name: "By Guest Count",
      description:
        "Calculate how much punch to make for your party",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 25",
          min: 1,
          step: 1,
        },
        {
          name: "duration",
          label: "Party Duration (hours)",
          type: "select",
          options: [
            { label: "1-2 hours", value: "1.5" },
            { label: "2-3 hours", value: "2.5" },
            { label: "3-4 hours", value: "3.5" },
            { label: "4+ hours", value: "4.5" },
          ],
          defaultValue: "2.5",
        },
        {
          name: "punchType",
          label: "Punch Type",
          type: "select",
          options: [
            { label: "Non-Alcoholic (fruit punch)", value: "non_alcoholic" },
            { label: "Alcoholic (spiked punch)", value: "alcoholic" },
            { label: "Light Alcoholic (wine-based)", value: "light" },
          ],
          defaultValue: "non_alcoholic",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const duration = parseFloat(inputs.duration as string);
        const punchType = inputs.punchType as string;
        if (!guests || guests <= 0) return null;

        // Each serving ~6 oz. Guests drink ~2 servings first hour, ~1 per hour after
        const servingsPerPerson = 2 + (duration - 1) * 1;
        const totalServings = guests * servingsPerPerson;
        const totalOz = totalServings * 6;
        const totalGallons = totalOz / 128;
        const totalLiters = totalOz / 33.814;

        // Ingredient breakdown by type
        let juiceOz = 0;
        let sodaOz = 0;
        let spiritOz = 0;
        let iceLbs = 0;

        if (punchType === "non_alcoholic") {
          juiceOz = totalOz * 0.6;
          sodaOz = totalOz * 0.4;
          spiritOz = 0;
        } else if (punchType === "alcoholic") {
          juiceOz = totalOz * 0.4;
          sodaOz = totalOz * 0.3;
          spiritOz = totalOz * 0.3;
        } else {
          juiceOz = totalOz * 0.35;
          sodaOz = totalOz * 0.25;
          spiritOz = totalOz * 0.4; // wine
        }

        iceLbs = Math.ceil(guests * 1);

        // Convert to practical units
        const juiceContainers64 = Math.ceil(juiceOz / 64);
        const soda2L = Math.ceil(sodaOz / 67.6);
        const spiritBottles = spiritOz > 0 ? Math.ceil(spiritOz / 25.36) : 0;

        return {
          primary: {
            label: `Punch for ${formatNumber(guests)} guests (${formatNumber(duration, 1)} hrs)`,
            value: `${formatNumber(totalGallons, 1)} gallons`,
          },
          details: [
            { label: "Total Volume", value: `${formatNumber(totalGallons, 1)} gallons (${formatNumber(totalLiters, 1)} liters)` },
            { label: "Total Servings", value: formatNumber(totalServings, 0) },
            { label: "Juice", value: `${formatNumber(juiceOz)} oz (~${formatNumber(juiceContainers64)} half-gallon containers)` },
            { label: "Soda/Sparkling Water", value: `${formatNumber(sodaOz)} oz (~${formatNumber(soda2L)} 2-liter bottles)` },
            ...(spiritOz > 0 ? [{ label: punchType === "light" ? "Wine" : "Spirit", value: `${formatNumber(spiritOz)} oz (~${formatNumber(spiritBottles)} bottles)` }] : []),
            { label: "Ice", value: `${formatNumber(iceLbs)} lbs` },
            { label: "Punch Bowl Size", value: totalGallons <= 2 ? "2-gallon bowl" : totalGallons <= 4 ? "4-gallon bowl" : "Multiple bowls or beverage dispensers" },
          ],
          note: "Add carbonated ingredients and ice just before serving. Pre-chill all ingredients for best results. Consider making an ice ring with fruit for a decorative and functional touch.",
        };
      },
    },
    {
      id: "scale-recipe",
      name: "Scale Existing Recipe",
      description: "Scale your punch recipe up or down",
      fields: [
        {
          name: "originalServings",
          label: "Recipe Makes (servings)",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
          step: 1,
        },
        {
          name: "desiredServings",
          label: "Desired Servings",
          type: "number",
          placeholder: "e.g. 40",
          min: 1,
          step: 1,
        },
        {
          name: "originalVolume",
          label: "Original Recipe Volume (oz)",
          type: "number",
          placeholder: "e.g. 72",
          min: 1,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const original = parseFloat(inputs.originalServings as string);
        const desired = parseFloat(inputs.desiredServings as string);
        const originalVol = parseFloat(inputs.originalVolume as string);
        if (!original || !desired || !originalVol) return null;

        const multiplier = desired / original;
        const newVolume = originalVol * multiplier;
        const gallons = newVolume / 128;

        return {
          primary: {
            label: `Scale from ${formatNumber(original)} to ${formatNumber(desired)} servings`,
            value: `${formatNumber(multiplier, 2)}x multiplier`,
          },
          details: [
            { label: "Recipe Multiplier", value: `${formatNumber(multiplier, 2)}x` },
            { label: "New Total Volume", value: `${formatNumber(newVolume, 0)} oz (${formatNumber(gallons, 1)} gallons)` },
            { label: "Per Serving", value: `${formatNumber(newVolume / desired, 1)} oz` },
          ],
          note: "Multiply every ingredient in your recipe by the multiplier. For carbonated ingredients, add 10% extra to account for fizz loss during serving.",
        };
      },
    },
  ],
  relatedSlugs: [
    "cocktail-recipe-calculator",
    "potluck-planner-calculator",
    "brunch-planner-calculator",
  ],
  faq: [
    {
      question: "How much punch per person for a party?",
      answer:
        "Plan for 1-2 cups (8-16 oz) of punch per person per hour. For a 2-3 hour party, that is about 24-32 oz per person. It is better to make a little extra than to run out.",
    },
    {
      question: "How do I keep punch cold without watering it down?",
      answer:
        "Make an ice ring by freezing juice, fruit, or even some of the punch in a bundt pan or ring mold. You can also freeze fruit (grapes, berries) and use them as ice cubes. Pre-chill all ingredients before mixing.",
    },
  ],
  formula:
    "Total Volume = Guests x Servings per Person x 6 oz | Servings/Person = 2 (first hour) + 1 per additional hour",
};
