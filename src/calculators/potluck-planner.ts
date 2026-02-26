import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const potluckPlannerCalculator: CalculatorDefinition = {
  slug: "potluck-planner-calculator",
  title: "Potluck Party Food Planner",
  description:
    "Free potluck party planner. Calculate how many dishes, serving sizes, and food quantities you need for a potluck based on guest count and meal type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "potluck planner",
    "potluck calculator",
    "party food planner",
    "how much food potluck",
    "potluck serving sizes",
    "group meal planner",
  ],
  variants: [
    {
      id: "by-guests",
      name: "By Guest Count",
      description:
        "Plan a potluck by number of guests and dish types",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 20",
          min: 4,
          step: 1,
        },
        {
          name: "mealType",
          label: "Meal Type",
          type: "select",
          options: [
            { label: "Dinner (full meal)", value: "dinner" },
            { label: "Lunch (lighter)", value: "lunch" },
            { label: "Appetizers / Snacks only", value: "appetizers" },
            { label: "Dessert potluck", value: "dessert" },
          ],
          defaultValue: "dinner",
        },
        {
          name: "contributors",
          label: "Number of Contributors",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const mealType = inputs.mealType as string;
        const contributors = parseFloat(inputs.contributors as string);
        if (!guests || guests <= 0 || !contributors || contributors <= 0) return null;

        // Servings per contributor dish
        const servingsPerDish = Math.ceil(guests / contributors) + 2; // a few extra

        let mainDishes = 0;
        let sideDishes = 0;
        let saladDishes = 0;
        let breadRolls = 0;
        let dessertDishes = 0;
        let drinkServings = 0;

        if (mealType === "dinner") {
          mainDishes = Math.ceil(contributors * 0.3);
          sideDishes = Math.ceil(contributors * 0.3);
          saladDishes = Math.ceil(contributors * 0.15);
          breadRolls = guests;
          dessertDishes = Math.ceil(contributors * 0.15);
          drinkServings = guests * 2;
        } else if (mealType === "lunch") {
          mainDishes = Math.ceil(contributors * 0.35);
          sideDishes = Math.ceil(contributors * 0.25);
          saladDishes = Math.ceil(contributors * 0.2);
          dessertDishes = Math.ceil(contributors * 0.15);
          drinkServings = guests * 2;
        } else if (mealType === "appetizers") {
          mainDishes = 0;
          sideDishes = Math.ceil(contributors * 0.5);
          saladDishes = Math.ceil(contributors * 0.2);
          dessertDishes = Math.ceil(contributors * 0.3);
          drinkServings = guests * 3;
        } else {
          dessertDishes = contributors;
          drinkServings = guests * 1;
        }

        // Total food weight estimate
        const mainLbs = mainDishes > 0 ? guests * 0.375 : 0; // 6 oz per person
        const sideLbs = sideDishes > 0 ? guests * 0.25 : 0; // 4 oz per person per side
        const totalFoodLbs = mainLbs + sideLbs * 2;

        return {
          primary: {
            label: `Potluck for ${formatNumber(guests)} guests`,
            value: `${formatNumber(contributors)} contributors needed`,
          },
          details: [
            { label: "Servings per Dish", value: `${formatNumber(servingsPerDish)} servings each` },
            ...(mainDishes > 0 ? [{ label: "Main Dishes (entrees)", value: formatNumber(mainDishes) }] : []),
            ...(sideDishes > 0 ? [{ label: "Side Dishes", value: formatNumber(sideDishes) }] : []),
            ...(saladDishes > 0 ? [{ label: "Salads/Bread", value: formatNumber(saladDishes) }] : []),
            { label: "Desserts", value: formatNumber(dessertDishes) },
            { label: "Beverages (servings)", value: formatNumber(drinkServings) },
            { label: "Plates/Utensils", value: `${formatNumber(Math.ceil(guests * 1.25))} sets` },
          ],
          note: "Ask each contributor to bring enough to serve the calculated servings per dish. Coordinate to avoid duplicate dishes. The host typically provides drinks, plates, and utensils.",
        };
      },
    },
    {
      id: "per-dish",
      name: "Per-Dish Calculator",
      description: "Calculate how much food to bring for your potluck contribution",
      fields: [
        {
          name: "totalGuests",
          label: "Total Guests at Potluck",
          type: "number",
          placeholder: "e.g. 20",
          min: 2,
          step: 1,
        },
        {
          name: "dishType",
          label: "Dish Type You Are Bringing",
          type: "select",
          options: [
            { label: "Main Dish / Entree", value: "main" },
            { label: "Side Dish", value: "side" },
            { label: "Salad", value: "salad" },
            { label: "Dessert", value: "dessert" },
            { label: "Appetizer / Dip", value: "appetizer" },
          ],
          defaultValue: "main",
        },
        {
          name: "totalDishes",
          label: "Total Dishes Being Brought (all contributors)",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const totalGuests = parseFloat(inputs.totalGuests as string);
        const dishType = inputs.dishType as string;
        const totalDishes = parseFloat(inputs.totalDishes as string);
        if (!totalGuests || !totalDishes) return null;

        // How many servings of YOUR dish
        const servingsNeeded = Math.ceil(totalGuests * 0.7) + 2; // Not everyone tries everything

        // Ounces per serving by dish type
        let ozPerServing = 6;
        if (dishType === "side") ozPerServing = 4;
        if (dishType === "salad") ozPerServing = 3;
        if (dishType === "dessert") ozPerServing = 4;
        if (dishType === "appetizer") ozPerServing = 3;

        const totalOz = servingsNeeded * ozPerServing;
        const totalLbs = totalOz / 16;
        const totalCups = totalOz / 8;

        return {
          primary: {
            label: `Your ${dishType} for ${formatNumber(totalGuests)} guests`,
            value: `${formatNumber(servingsNeeded)} servings`,
          },
          details: [
            { label: "Servings to Bring", value: formatNumber(servingsNeeded) },
            { label: "Total Amount", value: `${formatNumber(totalOz)} oz (${formatNumber(totalLbs, 1)} lbs)` },
            { label: "Volume (approx)", value: `${formatNumber(totalCups, 1)} cups` },
          ],
          note: "When in doubt, bring a little more. It is better to have leftover food than not enough. Bring serving utensils with your dish.",
        };
      },
    },
  ],
  relatedSlugs: [
    "bbq-party-calculator",
    "cheese-board-calculator",
    "brunch-planner-calculator",
  ],
  faq: [
    {
      question: "How many dishes per person at a potluck?",
      answer:
        "A good rule of thumb is 1 dish per 3-4 guests. For 20 guests, 5-7 dishes is ideal. Each dish should serve enough for all guests to have a small portion (about 70% of guests will try each dish).",
    },
    {
      question: "How do I coordinate a potluck to avoid duplicates?",
      answer:
        "Use a sign-up sheet or group chat to assign categories: have 30% of contributors bring main dishes, 30% sides, 15% salads, 15% desserts, and 10% drinks/bread. This ensures variety and balanced meal coverage.",
    },
  ],
  formula:
    "Servings per Dish = ceil(Guests / Contributors) + 2 | Main: 6 oz/person | Side: 4 oz/person | Dessert: 4 oz/person",
};
