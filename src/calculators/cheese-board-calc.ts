import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cheeseBoardCalculator: CalculatorDefinition = {
  slug: "cheese-board-calculator",
  title: "Cheese Board Planner",
  description:
    "Free cheese board planner. Calculate the right amount of cheese, crackers, and accompaniments for your cheese board based on the number of guests and occasion.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cheese board calculator",
    "cheese platter planner",
    "cheese per person",
    "cheese board for party",
    "cheese tray calculator",
    "how much cheese",
  ],
  variants: [
    {
      id: "standard",
      name: "Cheese Board Planner",
      description:
        "Calculate cheese and accompaniment quantities for your gathering",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          step: 1,
        },
        {
          name: "occasion",
          label: "Occasion",
          type: "select",
          options: [
            { label: "Appetizer before dinner", value: "appetizer" },
            { label: "Main event / wine & cheese party", value: "main" },
            { label: "Cocktail party (many appetizers)", value: "cocktail" },
          ],
          defaultValue: "appetizer",
        },
        {
          name: "varieties",
          label: "Number of Cheese Varieties",
          type: "select",
          options: [
            { label: "3 varieties", value: "3" },
            { label: "4 varieties", value: "4" },
            { label: "5 varieties", value: "5" },
            { label: "6+ varieties", value: "6" },
          ],
          defaultValue: "4",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const occasion = inputs.occasion as string;
        const varieties = parseFloat(inputs.varieties as string);
        if (!guests || guests <= 0) return null;

        // Oz of cheese per person based on occasion
        let cheeseOzPerPerson = 3; // appetizer
        if (occasion === "main") cheeseOzPerPerson = 5;
        if (occasion === "cocktail") cheeseOzPerPerson = 2;

        const totalCheeseOz = guests * cheeseOzPerPerson;
        const totalCheeseLbs = totalCheeseOz / 16;
        const perVarietyOz = totalCheeseOz / varieties;

        // Accompaniments per person
        const crackerOz = guests * 1.5;
        const fruitOz = guests * 2;
        const nutsOz = guests * 1;
        const olivePickleOz = guests * 1;
        const honeyJamOz = Math.ceil(guests / 4); // ~1 small jar per 4 guests

        return {
          primary: {
            label: `Cheese board for ${formatNumber(guests)} guests`,
            value: `${formatNumber(totalCheeseOz)} oz cheese`,
          },
          details: [
            { label: "Total Cheese", value: `${formatNumber(totalCheeseOz)} oz (${formatNumber(totalCheeseLbs, 1)} lbs)` },
            { label: "Per Cheese Variety", value: `~${formatNumber(perVarietyOz, 1)} oz each (${formatNumber(varieties)} types)` },
            { label: "Crackers/Bread", value: `${formatNumber(crackerOz)} oz (~${formatNumber(Math.ceil(crackerOz / 7))} boxes)` },
            { label: "Fresh Fruit", value: `${formatNumber(fruitOz)} oz (${formatNumber(fruitOz / 16, 1)} lbs)` },
            { label: "Nuts", value: `${formatNumber(nutsOz)} oz` },
            { label: "Olives/Pickles", value: `${formatNumber(olivePickleOz)} oz` },
            { label: "Honey/Jam", value: `${formatNumber(honeyJamOz)} small jar(s)` },
          ],
          note: "Choose a variety of textures and milk types: 1 soft (brie), 1 semi-soft (gouda), 1 hard (cheddar/parmesan), 1 blue or specialty cheese.",
        };
      },
    },
    {
      id: "by-budget",
      name: "By Budget",
      description: "Plan your cheese board based on a specific budget",
      fields: [
        {
          name: "budget",
          label: "Total Budget ($)",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          min: 10,
          step: 5,
        },
        {
          name: "cheeseQuality",
          label: "Cheese Quality",
          type: "select",
          options: [
            { label: "Budget-friendly (~$8/lb)", value: "budget" },
            { label: "Mid-range (~$14/lb)", value: "mid" },
            { label: "Artisan/Premium (~$22/lb)", value: "premium" },
          ],
          defaultValue: "mid",
        },
      ],
      calculate: (inputs) => {
        const budget = parseFloat(inputs.budget as string);
        const quality = inputs.cheeseQuality as string;
        if (!budget || budget <= 0) return null;

        const pricePerLb = quality === "budget" ? 8 : quality === "mid" ? 14 : 22;

        // Allocate: 50% cheese, 20% crackers/bread, 15% fruit, 10% meat, 5% extras
        const cheeseBudget = budget * 0.5;
        const crackerBudget = budget * 0.2;
        const fruitBudget = budget * 0.15;
        const meatBudget = budget * 0.1;

        const cheeseLbs = cheeseBudget / pricePerLb;
        const cheeseOz = cheeseLbs * 16;
        const servingsAt3oz = cheeseOz / 3;

        return {
          primary: {
            label: `$${formatNumber(budget, 2)} cheese board`,
            value: `Serves ~${formatNumber(servingsAt3oz, 0)} guests`,
          },
          details: [
            { label: "Cheese Budget", value: `$${formatNumber(cheeseBudget, 2)} (${formatNumber(cheeseOz, 0)} oz)` },
            { label: "Crackers/Bread Budget", value: `$${formatNumber(crackerBudget, 2)}` },
            { label: "Fruit Budget", value: `$${formatNumber(fruitBudget, 2)}` },
            { label: "Meat Budget", value: `$${formatNumber(meatBudget, 2)}` },
            { label: "Guests Served (appetizer)", value: formatNumber(servingsAt3oz, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "charcuterie-board-calculator",
    "cocktail-recipe-calculator",
    "potluck-planner-calculator",
  ],
  faq: [
    {
      question: "How much cheese per person for a cheese board?",
      answer:
        "For an appetizer before dinner, plan 2-3 oz of cheese per person. For a wine and cheese party where the board is the main event, plan 4-6 oz per person. For a cocktail party with other appetizers, 1-2 oz per person is sufficient.",
    },
    {
      question: "How many varieties of cheese should I include?",
      answer:
        "A good cheese board has 3-5 varieties. Include a mix of textures (soft, semi-soft, hard) and milk types (cow, goat, sheep). A classic lineup: brie or camembert, aged cheddar, gouda, blue cheese, and a fresh goat cheese.",
    },
    {
      question: "How far in advance can I prepare a cheese board?",
      answer:
        "Assemble your cheese board up to 2 hours before serving. Remove cheese from the refrigerator 30-60 minutes before serving so it reaches room temperature for the best flavor and texture. Add crackers just before serving so they stay crisp.",
    },
  ],
  formula:
    "Total Cheese (oz) = Guests x Oz per Person | Appetizer: 2-3 oz/person | Main: 4-6 oz/person",
};
