import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bbqPartyCalculator: CalculatorDefinition = {
  slug: "bbq-party-calculator",
  title: "BBQ Party Meat & Sides Planner",
  description:
    "Free BBQ party calculator. Plan the right amount of meat, sides, and drinks for your barbecue based on guest count and menu selections.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "bbq party calculator",
    "barbecue planner",
    "bbq meat per person",
    "cookout calculator",
    "grilling party planner",
    "bbq sides calculator",
  ],
  variants: [
    {
      id: "meat",
      name: "Meat Planner",
      description:
        "Calculate how much meat to buy for your BBQ based on the main protein",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 20",
          min: 1,
          step: 1,
        },
        {
          name: "protein",
          label: "Main Protein",
          type: "select",
          options: [
            { label: "Burgers", value: "burgers" },
            { label: "Hot Dogs", value: "hotdogs" },
            { label: "Chicken (bone-in)", value: "chicken_bone" },
            { label: "Chicken Breast (boneless)", value: "chicken_boneless" },
            { label: "Ribs (baby back)", value: "ribs_baby" },
            { label: "Ribs (spare)", value: "ribs_spare" },
            { label: "Pulled Pork (pork butt)", value: "pulled_pork" },
            { label: "Brisket", value: "brisket" },
            { label: "Steaks", value: "steaks" },
            { label: "Sausages/Brats", value: "sausage" },
          ],
          defaultValue: "burgers",
        },
        {
          name: "appetite",
          label: "Appetite Level",
          type: "select",
          options: [
            { label: "Light (with many sides)", value: "light" },
            { label: "Average", value: "average" },
            { label: "Hearty", value: "hearty" },
          ],
          defaultValue: "average",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const protein = inputs.protein as string;
        const appetite = inputs.appetite as string;
        if (!guests || guests <= 0) return null;

        let appetiteMult = 1.0;
        if (appetite === "light") appetiteMult = 0.8;
        if (appetite === "hearty") appetiteMult = 1.3;

        // Raw amount per person
        const meatData: Record<string, { rawPerPerson: number; unit: string; yield: number; note: string }> = {
          burgers: { rawPerPerson: 0.33, unit: "lbs ground beef", yield: 0.75, note: "~2 patties per person (1/3 lb each)" },
          hotdogs: { rawPerPerson: 2, unit: "hot dogs", yield: 1, note: "~2 hot dogs per person" },
          chicken_bone: { rawPerPerson: 0.75, unit: "lbs bone-in chicken", yield: 0.55, note: "2-3 pieces per person" },
          chicken_boneless: { rawPerPerson: 0.5, unit: "lbs boneless chicken", yield: 0.85, note: "1-2 breasts per person" },
          ribs_baby: { rawPerPerson: 1.0, unit: "lbs baby back ribs", yield: 0.5, note: "~1 lb raw / half rack per person" },
          ribs_spare: { rawPerPerson: 1.25, unit: "lbs spare ribs", yield: 0.45, note: "Spare ribs shrink ~55% when cooked" },
          pulled_pork: { rawPerPerson: 0.67, unit: "lbs raw pork butt", yield: 0.45, note: "Pork butt yields ~45% after cooking" },
          brisket: { rawPerPerson: 0.75, unit: "lbs raw brisket", yield: 0.5, note: "Brisket loses ~50% weight when smoked" },
          steaks: { rawPerPerson: 0.625, unit: "lbs steak", yield: 0.85, note: "~10 oz raw steak per person" },
          sausage: { rawPerPerson: 2, unit: "sausage links", yield: 0.85, note: "~2 links per person" },
        };

        const data = meatData[protein] || meatData.burgers;
        const totalRaw = guests * data.rawPerPerson * appetiteMult;
        const totalCooked = totalRaw * data.yield;

        return {
          primary: {
            label: `BBQ for ${formatNumber(guests)} guests`,
            value: `${formatNumber(totalRaw, 1)} ${data.unit}`,
          },
          details: [
            { label: "Total Raw Amount", value: `${formatNumber(totalRaw, 1)} ${data.unit}` },
            { label: "Estimated Cooked Yield", value: `${formatNumber(totalCooked, 1)} lbs` },
            { label: "Per Person (raw)", value: `${formatNumber(data.rawPerPerson * appetiteMult, 2)} ${data.unit}` },
          ],
          note: data.note,
        };
      },
    },
    {
      id: "sides",
      name: "Sides & Drinks",
      description: "Calculate side dishes and beverages for your BBQ",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 20",
          min: 1,
          step: 1,
        },
        {
          name: "numSides",
          label: "Number of Side Dishes",
          type: "select",
          options: [
            { label: "2 sides", value: "2" },
            { label: "3 sides", value: "3" },
            { label: "4 sides", value: "4" },
            { label: "5+ sides", value: "5" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const numSides = parseFloat(inputs.numSides as string);
        if (!guests || guests <= 0) return null;

        // Per person, per side: ~1/2 cup or 4 oz
        const ozPerPersonPerSide = 4;
        const totalSideOzPerPerson = ozPerPersonPerSide * numSides;
        const totalSideLbs = (guests * totalSideOzPerPerson) / 16;

        // Buns
        const buns = Math.ceil(guests * 2.5);
        // Drinks: 2-3 per person for a 3-4 hour party
        const drinks = Math.ceil(guests * 2.5);
        // Condiments
        const ketchupOz = Math.ceil(guests * 1);
        const mustardOz = Math.ceil(guests * 0.5);
        // Chips: ~1 oz per person
        const chipBags = Math.ceil((guests * 1) / 10); // 10 oz bags
        // Ice: 1 lb per person
        const iceLbs = guests;

        return {
          primary: {
            label: `Sides & drinks for ${formatNumber(guests)} guests`,
            value: `${formatNumber(totalSideLbs, 1)} lbs total sides`,
          },
          details: [
            { label: "Total Side Dishes", value: `${formatNumber(totalSideLbs, 1)} lbs (across ${formatNumber(numSides)} sides)` },
            { label: "Per Side Dish", value: `${formatNumber(totalSideLbs / numSides, 1)} lbs each` },
            { label: "Buns/Rolls", value: formatNumber(buns) },
            { label: "Beverages", value: `${formatNumber(drinks)} cans/bottles` },
            { label: "Chip Bags (10 oz)", value: formatNumber(chipBags) },
            { label: "Ice", value: `${formatNumber(iceLbs)} lbs` },
          ],
          note: "Popular BBQ sides: coleslaw, baked beans, corn on the cob, potato salad, mac and cheese, cornbread.",
        };
      },
    },
    {
      id: "full-party",
      name: "Full Party Planner",
      description: "Complete BBQ party shopping list by guest count",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 20",
          min: 1,
          step: 1,
        },
        {
          name: "duration",
          label: "Party Duration",
          type: "select",
          options: [
            { label: "2 hours", value: "2" },
            { label: "3 hours", value: "3" },
            { label: "4 hours", value: "4" },
            { label: "5+ hours", value: "5" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const duration = parseFloat(inputs.duration as string);
        if (!guests || guests <= 0) return null;

        const meatLbs = guests * 0.5;
        const sideLbs = guests * 0.75;
        const drinksPerPerson = duration <= 2 ? 2 : duration <= 3 ? 3 : 4;
        const totalDrinks = guests * drinksPerPerson;
        const iceLbs = guests * 1.5;
        const dessertServings = guests;

        return {
          primary: {
            label: `Full BBQ for ${formatNumber(guests)} guests (${formatNumber(duration)} hrs)`,
            value: `${formatNumber(meatLbs, 1)} lbs meat total`,
          },
          details: [
            { label: "Meat (total)", value: `${formatNumber(meatLbs, 1)} lbs` },
            { label: "Side Dishes (total)", value: `${formatNumber(sideLbs, 1)} lbs` },
            { label: "Beverages", value: `${formatNumber(totalDrinks)} drinks` },
            { label: "Ice", value: `${formatNumber(iceLbs)} lbs` },
            { label: "Dessert Servings", value: formatNumber(dessertServings) },
            { label: "Plates/Napkins", value: `${formatNumber(Math.ceil(guests * 1.5))} each` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "potluck-planner-calculator",
    "ham-per-person-calculator",
    "turkey-size-calculator",
  ],
  faq: [
    {
      question: "How much BBQ meat per person?",
      answer:
        "Plan for 1/3 to 1/2 pound of cooked meat per person. Since meat shrinks during cooking (up to 50% for brisket and pulled pork), buy more raw weight. For pulled pork, buy 2/3 lb raw per person; for burgers, 1/3 lb per patty with 2 patties each.",
    },
    {
      question: "How many drinks per person for a BBQ?",
      answer:
        "Plan for 2-3 drinks per person for a 2-3 hour party and 3-4 drinks for longer events. Have a mix of beer, soda, and water. Buy 1-1.5 lbs of ice per person to keep beverages cold.",
    },
  ],
  formula:
    "Meat (lbs raw) = Guests x Raw Per Person x Appetite Mult | Sides: ~4 oz per person per side dish",
};
