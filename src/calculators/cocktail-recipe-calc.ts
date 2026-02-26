import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cocktailRecipeCalculator: CalculatorDefinition = {
  slug: "cocktail-recipe-calculator",
  title: "Cocktail Recipe Scaler & Batch Calculator",
  description:
    "Free cocktail recipe scaler. Scale up cocktail recipes for batches and parties. Calculate spirit, mixer, and ice quantities for any number of servings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cocktail recipe scaler",
    "batch cocktail calculator",
    "cocktail for party",
    "drink recipe multiplier",
    "cocktail servings",
    "batch drinks calculator",
  ],
  variants: [
    {
      id: "scale-recipe",
      name: "Scale a Recipe",
      description:
        "Multiply a single-serving cocktail recipe to any number of servings",
      fields: [
        {
          name: "spiritOz",
          label: "Spirit per Drink (oz)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          step: 0.25,
          defaultValue: 2,
        },
        {
          name: "mixerOz",
          label: "Mixer per Drink (oz)",
          type: "number",
          placeholder: "e.g. 4",
          min: 0,
          step: 0.25,
          defaultValue: 4,
        },
        {
          name: "juiceOz",
          label: "Juice/Citrus per Drink (oz)",
          type: "number",
          placeholder: "e.g. 1",
          min: 0,
          step: 0.25,
          defaultValue: 1,
        },
        {
          name: "servings",
          label: "Number of Servings",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const spiritOz = parseFloat(inputs.spiritOz as string);
        const mixerOz = parseFloat(inputs.mixerOz as string);
        const juiceOz = parseFloat(inputs.juiceOz as string);
        const servings = parseFloat(inputs.servings as string);
        if (!servings || servings <= 0) return null;

        const totalSpiritOz = (spiritOz || 0) * servings;
        const totalMixerOz = (mixerOz || 0) * servings;
        const totalJuiceOz = (juiceOz || 0) * servings;
        const totalOz = totalSpiritOz + totalMixerOz + totalJuiceOz;

        // Bottles: 750ml = 25.36 oz
        const spiritBottles = totalSpiritOz / 25.36;
        const mixerLiters = totalMixerOz / 33.814;
        const lemons = totalJuiceOz / 1.5; // ~1.5 oz juice per lemon
        const limes = totalJuiceOz / 1; // ~1 oz juice per lime
        const iceLbs = servings * 0.5;

        return {
          primary: {
            label: `Cocktail batch for ${formatNumber(servings)} servings`,
            value: `${formatNumber(totalOz, 1)} oz total`,
          },
          details: [
            { label: "Spirit Total", value: `${formatNumber(totalSpiritOz, 1)} oz (~${formatNumber(spiritBottles, 1)} bottles)` },
            { label: "Mixer Total", value: `${formatNumber(totalMixerOz, 1)} oz (~${formatNumber(mixerLiters, 1)} liters)` },
            { label: "Juice/Citrus Total", value: `${formatNumber(totalJuiceOz, 1)} oz (~${formatNumber(lemons, 0)} lemons or ${formatNumber(limes, 0)} limes)` },
            { label: "Total Volume", value: `${formatNumber(totalOz, 1)} oz (${formatNumber(totalOz / 128, 1)} gallons)` },
            { label: "Ice Needed", value: `~${formatNumber(iceLbs, 1)} lbs` },
          ],
          note: "When batching, reduce citrus juice by ~15% and add it closer to serving time for freshness. Pre-batch spirits and mixers, add ice when serving.",
        };
      },
    },
    {
      id: "party-bar",
      name: "Party Bar Planner",
      description: "Calculate how much alcohol and mixers for a party",
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
            { label: "2 hours", value: "2" },
            { label: "3 hours", value: "3" },
            { label: "4 hours", value: "4" },
            { label: "5+ hours", value: "5" },
          ],
          defaultValue: "3",
        },
        {
          name: "drinkers",
          label: "% Who Drink Alcohol",
          type: "select",
          options: [
            { label: "50% of guests", value: "0.5" },
            { label: "70% of guests", value: "0.7" },
            { label: "85% of guests", value: "0.85" },
            { label: "100% of guests", value: "1.0" },
          ],
          defaultValue: "0.7",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const duration = parseFloat(inputs.duration as string);
        const drinkerPct = parseFloat(inputs.drinkers as string);
        if (!guests || guests <= 0) return null;

        const drinkers = Math.ceil(guests * drinkerPct);
        const nonDrinkers = guests - drinkers;

        // ~1 drink first hour, 0.5-0.75 per hour after
        const drinksPerPerson = 1 + (duration - 1) * 0.75;
        const totalDrinks = drinkers * drinksPerPerson;

        // 750ml bottle serves ~16 shots (1.5 oz) or ~12 cocktails (2 oz)
        const spiritBottles = Math.ceil(totalDrinks / 12);
        const wineBottles = Math.ceil(totalDrinks * 0.3 / 5); // 30% wine drinkers, 5 glasses/bottle
        const beerCans = Math.ceil(totalDrinks * 0.3); // 30% beer
        const mixerLiters = Math.ceil(totalDrinks * 4 / 33.814);
        const iceLbs = Math.ceil(guests * 1.5);
        const sodaForNonDrinkers = nonDrinkers * drinksPerPerson;

        return {
          primary: {
            label: `Bar for ${formatNumber(guests)} guests (${formatNumber(duration)} hrs)`,
            value: `~${formatNumber(totalDrinks, 0)} total drinks`,
          },
          details: [
            { label: "Estimated Total Drinks", value: formatNumber(totalDrinks, 0) },
            { label: "Spirit Bottles (750 mL)", value: formatNumber(spiritBottles) },
            { label: "Wine Bottles", value: formatNumber(wineBottles) },
            { label: "Beer Cans/Bottles", value: formatNumber(beerCans) },
            { label: "Mixer (liters)", value: formatNumber(mixerLiters) },
            { label: "Non-Alcoholic Drinks", value: formatNumber(sodaForNonDrinkers, 0) },
            { label: "Ice", value: `${formatNumber(iceLbs)} lbs` },
          ],
          note: "Always have water and non-alcoholic options available. Budget ~1 drink per person for the first hour, then 0.75 drinks/hour after that.",
        };
      },
    },
    {
      id: "popular-cocktails",
      name: "Popular Cocktail Batches",
      description: "Get batch recipe for popular cocktails",
      fields: [
        {
          name: "cocktail",
          label: "Cocktail",
          type: "select",
          options: [
            { label: "Margarita", value: "margarita" },
            { label: "Mojito", value: "mojito" },
            { label: "Sangria", value: "sangria" },
            { label: "Whiskey Sour", value: "whiskey_sour" },
            { label: "Moscow Mule", value: "moscow_mule" },
            { label: "Paloma", value: "paloma" },
          ],
          defaultValue: "margarita",
        },
        {
          name: "servings",
          label: "Number of Servings",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const cocktail = inputs.cocktail as string;
        const servings = parseFloat(inputs.servings as string);
        if (!servings || servings <= 0) return null;

        const recipes: Record<string, { spirit: number; secondary: number; citrus: number; sweet: number; spiritName: string; secondaryName: string; citrusName: string; sweetName: string }> = {
          margarita: { spirit: 2, secondary: 1, citrus: 1, sweet: 0.75, spiritName: "Tequila", secondaryName: "Triple Sec", citrusName: "Lime Juice", sweetName: "Simple Syrup" },
          mojito: { spirit: 2, secondary: 1, citrus: 1, sweet: 0.75, spiritName: "White Rum", secondaryName: "Club Soda", citrusName: "Lime Juice", sweetName: "Simple Syrup" },
          sangria: { spirit: 1, secondary: 5, citrus: 1, sweet: 1, spiritName: "Brandy", secondaryName: "Red Wine", citrusName: "Orange Juice", sweetName: "Simple Syrup" },
          whiskey_sour: { spirit: 2, secondary: 0, citrus: 1, sweet: 0.75, spiritName: "Bourbon", secondaryName: "N/A", citrusName: "Lemon Juice", sweetName: "Simple Syrup" },
          moscow_mule: { spirit: 2, secondary: 4, citrus: 0.5, sweet: 0, spiritName: "Vodka", secondaryName: "Ginger Beer", citrusName: "Lime Juice", sweetName: "N/A" },
          paloma: { spirit: 2, secondary: 4, citrus: 0.5, sweet: 0, spiritName: "Tequila", secondaryName: "Grapefruit Soda", citrusName: "Lime Juice", sweetName: "N/A" },
        };

        const r = recipes[cocktail] || recipes.margarita;

        return {
          primary: {
            label: `${cocktail.charAt(0).toUpperCase() + cocktail.slice(1).replace("_", " ")} x ${formatNumber(servings)}`,
            value: `${formatNumber((r.spirit + r.secondary + r.citrus + r.sweet) * servings, 1)} oz total`,
          },
          details: [
            { label: r.spiritName, value: `${formatNumber(r.spirit * servings, 1)} oz` },
            ...(r.secondary > 0 ? [{ label: r.secondaryName, value: `${formatNumber(r.secondary * servings, 1)} oz` }] : []),
            ...(r.citrus > 0 ? [{ label: r.citrusName, value: `${formatNumber(r.citrus * servings, 1)} oz` }] : []),
            ...(r.sweet > 0 ? [{ label: r.sweetName, value: `${formatNumber(r.sweet * servings, 1)} oz` }] : []),
            { label: "Spirit Bottles (750 mL)", value: formatNumber(Math.ceil((r.spirit * servings) / 25.36), 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "punch-recipe-calculator",
    "cheese-board-calculator",
    "potluck-planner-calculator",
  ],
  faq: [
    {
      question: "How many drinks per person should I plan for a party?",
      answer:
        "Plan for about 2 drinks per person in the first hour and 1 drink per person per hour after that. For a 3-hour party, that is about 4 drinks per person. Adjust based on your crowd and always provide non-alcoholic alternatives.",
    },
    {
      question: "How do I scale a cocktail recipe for a batch?",
      answer:
        "Multiply each ingredient by the number of servings. Reduce citrus by about 15% in large batches (it intensifies). Pre-mix spirits and sweeteners ahead of time, but add carbonated mixers and fresh citrus just before serving.",
    },
  ],
  formula:
    "Batch Total = Single Serving x Number of Servings | 1 bottle (750 mL) = ~25.4 oz = ~12 cocktails (2 oz pours)",
};
