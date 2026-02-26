import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const brunchPlannerCalculator: CalculatorDefinition = {
  slug: "brunch-planner-calculator",
  title: "Brunch Party Planner",
  description:
    "Free brunch party planner. Calculate food quantities for eggs, bacon, pastries, fruit, and beverages for a brunch gathering of any size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "brunch planner",
    "brunch party calculator",
    "brunch food quantities",
    "brunch for crowd",
    "how much food for brunch",
    "brunch hosting calculator",
  ],
  variants: [
    {
      id: "full-brunch",
      name: "Full Brunch Planner",
      description:
        "Plan all food categories for a complete brunch spread",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
          step: 1,
        },
        {
          name: "style",
          label: "Brunch Style",
          type: "select",
          options: [
            { label: "Light brunch (pastries + fruit)", value: "light" },
            { label: "Standard brunch (full spread)", value: "standard" },
            { label: "Hearty brunch (big appetites)", value: "hearty" },
          ],
          defaultValue: "standard",
        },
        {
          name: "beverages",
          label: "Beverage Service",
          type: "select",
          options: [
            { label: "Coffee & juice only", value: "basic" },
            { label: "Coffee, juice + mimosas", value: "mimosa" },
            { label: "Full bar (Bloody Marys, mimosas, coffee)", value: "full" },
          ],
          defaultValue: "mimosa",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const style = inputs.style as string;
        const beverages = inputs.beverages as string;
        if (!guests || guests <= 0) return null;

        let mult = 1.0;
        if (style === "light") mult = 0.6;
        if (style === "hearty") mult = 1.4;

        // Per person quantities (standard brunch)
        const eggs = Math.ceil(2.5 * guests * mult);
        const baconSlices = Math.ceil(3 * guests * mult);
        const baconLbs = (baconSlices * 0.5) / 16; // ~0.5 oz per raw slice
        const sausageLinks = Math.ceil(2 * guests * mult);
        const pastryCroissants = Math.ceil(1.5 * guests * mult);
        const fruitLbs = (guests * 3 * mult) / 16; // 3 oz per person
        const breadSlices = Math.ceil(1.5 * guests * mult);

        // Beverages
        const coffeeOz = guests * 12; // 12 oz per person
        const coffeeGrams = (coffeeOz / 6) * 10; // 10g per 6 oz cup
        const juiceOz = guests * 8;
        const juiceContainers = Math.ceil(juiceOz / 64);

        let champagneBottles = 0;
        let vodkaBottles = 0;
        if (beverages === "mimosa" || beverages === "full") {
          champagneBottles = Math.ceil((guests * 2) / 5); // 5 mimosas per bottle
        }
        if (beverages === "full") {
          vodkaBottles = Math.ceil(guests / 10); // for Bloody Marys
        }

        const details = [
          { label: "Eggs", value: formatNumber(eggs) },
          { label: "Bacon", value: `${formatNumber(baconSlices)} slices (${formatNumber(baconLbs, 1)} lbs)` },
        ];

        if (style !== "light") {
          details.push({ label: "Sausage Links", value: formatNumber(sausageLinks) });
        }

        details.push(
          { label: "Pastries/Croissants", value: formatNumber(pastryCroissants) },
          { label: "Fresh Fruit", value: `${formatNumber(fruitLbs, 1)} lbs` },
          { label: "Toast/Bread", value: `${formatNumber(breadSlices)} slices` },
          { label: "Coffee", value: `${formatNumber(coffeeOz)} oz (${formatNumber(coffeeGrams)} g grounds)` },
          { label: "Orange Juice", value: `${formatNumber(juiceOz)} oz (~${formatNumber(juiceContainers)} half-gallon)` },
        );

        if (champagneBottles > 0) {
          details.push({ label: "Champagne/Prosecco", value: `${formatNumber(champagneBottles)} bottles` });
        }
        if (vodkaBottles > 0) {
          details.push({ label: "Vodka (Bloody Marys)", value: `${formatNumber(vodkaBottles)} bottle(s)` });
        }

        return {
          primary: {
            label: `Brunch for ${formatNumber(guests)} guests`,
            value: `${style.charAt(0).toUpperCase() + style.slice(1)} spread`,
          },
          details,
          note: "Prep eggs as scrambled, fried, or make a frittata/quiche ahead of time. A quiche serves 6-8 people and can be made the night before and reheated.",
        };
      },
    },
    {
      id: "egg-dish",
      name: "Egg Dish Planner",
      description: "Calculate quantities for specific egg dishes",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
          step: 1,
        },
        {
          name: "eggDish",
          label: "Egg Dish",
          type: "select",
          options: [
            { label: "Scrambled Eggs", value: "scrambled" },
            { label: "Quiche (9-inch)", value: "quiche" },
            { label: "Egg Casserole / Strata", value: "casserole" },
            { label: "Deviled Eggs (appetizer)", value: "deviled" },
            { label: "Eggs Benedict", value: "benedict" },
          ],
          defaultValue: "scrambled",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const dish = inputs.eggDish as string;
        if (!guests || guests <= 0) return null;

        if (dish === "scrambled") {
          const eggs = Math.ceil(guests * 2.5);
          const milkTbsp = Math.ceil(eggs * 1);
          const butterTbsp = Math.ceil(eggs / 4);

          return {
            primary: {
              label: `Scrambled eggs for ${formatNumber(guests)}`,
              value: `${formatNumber(eggs)} eggs`,
            },
            details: [
              { label: "Eggs", value: formatNumber(eggs) },
              { label: "Milk/Cream", value: `${formatNumber(milkTbsp)} tbsp` },
              { label: "Butter", value: `${formatNumber(butterTbsp)} tbsp` },
              { label: "Dozen Eggs to Buy", value: formatNumber(Math.ceil(eggs / 12)) },
            ],
          };
        }

        if (dish === "quiche") {
          // Each 9-inch quiche serves 6-8
          const quiches = Math.ceil(guests / 7);
          const eggsPerQuiche = 4;

          return {
            primary: {
              label: `Quiche for ${formatNumber(guests)}`,
              value: `${formatNumber(quiches)} quiche(s)`,
            },
            details: [
              { label: "9-inch Quiches", value: formatNumber(quiches) },
              { label: "Total Eggs", value: formatNumber(quiches * eggsPerQuiche) },
              { label: "Heavy Cream", value: `${formatNumber(quiches)} cup(s)` },
              { label: "Pie Crusts", value: formatNumber(quiches) },
              { label: "Cheese", value: `${formatNumber(quiches * 4)} oz` },
            ],
            note: "Quiche can be assembled the night before and refrigerated. Bake at 375\u00b0F for 35-45 minutes until center is set.",
          };
        }

        if (dish === "casserole") {
          const casseroles = Math.ceil(guests / 10); // 9x13 serves ~10
          const eggsPerCasserole = 8;
          const breadCupsPerCasserole = 6;

          return {
            primary: {
              label: `Egg casserole for ${formatNumber(guests)}`,
              value: `${formatNumber(casseroles)} casserole(s)`,
            },
            details: [
              { label: "9x13 Casseroles", value: formatNumber(casseroles) },
              { label: "Total Eggs", value: formatNumber(casseroles * eggsPerCasserole) },
              { label: "Bread Cubes", value: `${formatNumber(casseroles * breadCupsPerCasserole)} cups` },
              { label: "Milk", value: `${formatNumber(casseroles * 2)} cups` },
              { label: "Cheese", value: `${formatNumber(casseroles * 8)} oz` },
            ],
            note: "Assemble the night before and refrigerate overnight. This lets the bread absorb the egg mixture. Bake at 350\u00b0F for 45-55 minutes.",
          };
        }

        if (dish === "deviled") {
          const eggsNeeded = Math.ceil(guests * 3); // 3 halves per person = 1.5 eggs
          const wholeEggs = Math.ceil(eggsNeeded / 2) + 2; // extra for failures

          return {
            primary: {
              label: `Deviled eggs for ${formatNumber(guests)}`,
              value: `${formatNumber(wholeEggs)} eggs`,
            },
            details: [
              { label: "Whole Eggs to Boil", value: formatNumber(wholeEggs) },
              { label: "Deviled Egg Halves", value: formatNumber(wholeEggs * 2) },
              { label: "Mayonnaise", value: `${formatNumber(Math.ceil(wholeEggs / 6))} tbsp` },
              { label: "Mustard", value: `${formatNumber(Math.ceil(wholeEggs / 6))} tsp` },
            ],
          };
        }

        // benedict
        const eggs = guests * 2;
        const muffins = guests;
        const hamSlices = guests * 2;

        return {
          primary: {
            label: `Eggs Benedict for ${formatNumber(guests)}`,
            value: `${formatNumber(eggs)} eggs`,
          },
          details: [
            { label: "Eggs (poached)", value: formatNumber(eggs) },
            { label: "English Muffins", value: `${formatNumber(muffins)} (halved)` },
            { label: "Ham/Canadian Bacon Slices", value: formatNumber(hamSlices) },
            { label: "Hollandaise (egg yolks)", value: formatNumber(Math.ceil(guests / 3)) },
            { label: "Butter for Hollandaise", value: `${formatNumber(Math.ceil(guests / 3) * 4)} tbsp` },
          ],
          note: "Poach eggs ahead of time and hold in ice water. Reheat in warm (not boiling) water for 30 seconds before serving.",
        };
      },
    },
  ],
  relatedSlugs: [
    "waffle-batch-calculator",
    "potluck-planner-calculator",
    "cocktail-recipe-calculator",
  ],
  faq: [
    {
      question: "How many eggs per person for brunch?",
      answer:
        "Plan for 2-3 eggs per person for a standard brunch. If eggs are the main protein (scrambled, fried, or omelet), plan closer to 3. If you are also serving meat (bacon, sausage) and pastries, 2 eggs per person is sufficient.",
    },
    {
      question: "How do I time brunch so everything is ready at once?",
      answer:
        "Make egg casseroles and quiches the night before and reheat. Cook bacon in the oven (400\u00b0F, 15-20 min) while making eggs on the stovetop. Set up a coffee station and fruit platter 30 minutes before guests arrive. Keep warm items in a 200\u00b0F oven.",
    },
    {
      question: "How many mimosas does one bottle of champagne make?",
      answer:
        "One standard 750 mL bottle of champagne or prosecco makes about 5-6 mimosas (equal parts champagne and orange juice in a champagne flute). For 12 guests, plan 3-4 bottles if mimosas are the main drink.",
    },
  ],
  formula:
    "Eggs: 2-3 per person | Bacon: 3 slices/person | Fruit: 3 oz/person | Coffee: 12 oz/person | Mimosas: 5 per champagne bottle",
};
