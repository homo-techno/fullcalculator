import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const charcuterieBoardCalculator: CalculatorDefinition = {
  slug: "charcuterie-board-calculator",
  title: "Charcuterie Board Planner",
  description:
    "Free charcuterie board planner. Calculate the right amounts of cured meats, cheese, crackers, fruit, nuts, and accompaniments for any number of guests.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "charcuterie board calculator",
    "charcuterie planner",
    "meat and cheese board",
    "charcuterie per person",
    "grazing board planner",
    "charcuterie amounts",
  ],
  variants: [
    {
      id: "standard",
      name: "Standard Board",
      description:
        "Plan a balanced charcuterie board with meats, cheeses, and accompaniments",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          step: 1,
        },
        {
          name: "occasion",
          label: "Occasion",
          type: "select",
          options: [
            { label: "Pre-dinner appetizer", value: "appetizer" },
            { label: "Main event (grazing board)", value: "main" },
            { label: "Cocktail party snack", value: "cocktail" },
          ],
          defaultValue: "appetizer",
        },
        {
          name: "meatVarieties",
          label: "Meat Varieties",
          type: "select",
          options: [
            { label: "2 types", value: "2" },
            { label: "3 types", value: "3" },
            { label: "4 types", value: "4" },
            { label: "5+ types", value: "5" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const occasion = inputs.occasion as string;
        const meatVarieties = parseFloat(inputs.meatVarieties as string);
        if (!guests || guests <= 0) return null;

        // Oz per person based on occasion
        let meatOzPerPerson = 2;
        let cheeseOzPerPerson = 2;
        if (occasion === "main") {
          meatOzPerPerson = 4;
          cheeseOzPerPerson = 4;
        }
        if (occasion === "cocktail") {
          meatOzPerPerson = 1.5;
          cheeseOzPerPerson = 1.5;
        }

        const totalMeatOz = guests * meatOzPerPerson;
        const totalCheeseOz = guests * cheeseOzPerPerson;
        const perMeatVariety = totalMeatOz / meatVarieties;

        // Accompaniments
        const crackerOz = guests * 1.5;
        const fruitOz = guests * 2;
        const nutsOz = guests * 0.75;
        const olivesOz = guests * 1;
        const spreadJars = Math.ceil(guests / 5); // 1 jar per 5 guests
        const honeySml = Math.ceil(guests / 8); // small honey jar per 8

        const totalBoardOz = totalMeatOz + totalCheeseOz + crackerOz + fruitOz + nutsOz + olivesOz;

        // Board size recommendation
        let boardSize = "12 x 18 inches";
        if (guests <= 4) boardSize = "10 x 14 inches";
        if (guests >= 8 && guests < 15) boardSize = "15 x 24 inches";
        if (guests >= 15) boardSize = "18 x 30 inches or multiple boards";

        return {
          primary: {
            label: `Charcuterie for ${formatNumber(guests)} guests`,
            value: `${formatNumber(totalMeatOz)} oz meat + ${formatNumber(totalCheeseOz)} oz cheese`,
          },
          details: [
            { label: "Cured Meats (total)", value: `${formatNumber(totalMeatOz)} oz (${formatNumber(totalMeatOz / 16, 1)} lbs)` },
            { label: "Per Meat Variety", value: `~${formatNumber(perMeatVariety, 1)} oz each (${formatNumber(meatVarieties)} types)` },
            { label: "Cheese (total)", value: `${formatNumber(totalCheeseOz)} oz (${formatNumber(totalCheeseOz / 16, 1)} lbs)` },
            { label: "Crackers/Bread", value: `${formatNumber(crackerOz)} oz` },
            { label: "Fresh Fruit", value: `${formatNumber(fruitOz)} oz (${formatNumber(fruitOz / 16, 1)} lbs)` },
            { label: "Nuts", value: `${formatNumber(nutsOz)} oz` },
            { label: "Olives/Pickled Items", value: `${formatNumber(olivesOz)} oz` },
            { label: "Spreads/Mustard (jars)", value: formatNumber(spreadJars) },
            { label: "Recommended Board Size", value: boardSize },
          ],
          note: "Popular meat choices: prosciutto, salami, sopressata, coppa, chorizo. Arrange meats in loose folds and rosettes for an attractive presentation.",
        };
      },
    },
    {
      id: "detailed",
      name: "Detailed Shopping List",
      description:
        "Get a complete shopping list with specific item quantities",
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
          label: "Board Style",
          type: "select",
          options: [
            { label: "Italian-inspired", value: "italian" },
            { label: "Spanish-inspired", value: "spanish" },
            { label: "Classic American", value: "american" },
          ],
          defaultValue: "italian",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const style = inputs.style as string;
        if (!guests || guests <= 0) return null;

        const meatOz = guests * 2.5;
        const cheeseOz = guests * 2.5;

        const styleItems: Record<string, string> = {
          italian: "Prosciutto, Salami, Sopressata | Parmigiano-Reggiano, Fresh Mozzarella, Gorgonzola",
          spanish: "Jamon Serrano, Chorizo, Lomo | Manchego, Mahon, Tetilla",
          american: "Pepperoni, Summer Sausage, Ham | Sharp Cheddar, Pepper Jack, Brie",
        };

        return {
          primary: {
            label: `${style.charAt(0).toUpperCase() + style.slice(1)} board for ${formatNumber(guests)}`,
            value: `${formatNumber((meatOz + cheeseOz) / 16, 1)} lbs total`,
          },
          details: [
            { label: "Meats", value: styleItems[style]?.split("|")[0]?.trim() || "" },
            { label: "Cheeses", value: styleItems[style]?.split("|")[1]?.trim() || "" },
            { label: "Total Meat", value: `${formatNumber(meatOz)} oz` },
            { label: "Total Cheese", value: `${formatNumber(cheeseOz)} oz` },
            { label: "Crackers/Bread", value: `${formatNumber(guests * 1.5)} oz` },
            { label: "Grapes/Berries", value: `${formatNumber(Math.ceil(guests / 4))} bunches/pints` },
            { label: "Dried Fruit", value: `${formatNumber(guests * 0.5)} oz` },
            { label: "Nuts (mixed)", value: `${formatNumber(guests * 0.75)} oz` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cheese-board-calculator",
    "cocktail-recipe-calculator",
    "potluck-planner-calculator",
  ],
  faq: [
    {
      question: "How much charcuterie meat per person?",
      answer:
        "For a pre-dinner appetizer, plan 2 oz of cured meat per person. For a grazing-style main event, plan 4 oz per person. Include 2-4 varieties of cured meats for a nice variety of flavors and textures.",
    },
    {
      question: "What is the difference between a cheese board and a charcuterie board?",
      answer:
        "A cheese board focuses primarily on cheese varieties with some accompaniments. A charcuterie board features cured meats as a star ingredient alongside cheese, crackers, fruits, nuts, and spreads. The terms are often used interchangeably for boards that include both.",
    },
    {
      question: "How far in advance can I assemble a charcuterie board?",
      answer:
        "Assemble 1-2 hours before serving. Place cheese first and let it come to room temperature for 30-60 minutes for best flavor. Add crackers at the last minute to prevent sogginess. Meats can be arranged ahead and covered with plastic wrap.",
    },
  ],
  formula:
    "Total Meat (oz) = Guests x Oz per Person | Appetizer: 2 oz/person | Main: 4 oz/person | Include 2-4 meat varieties",
};
