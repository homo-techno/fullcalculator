import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deepFryOilCalculator: CalculatorDefinition = {
  slug: "deep-fry-oil-calculator",
  title: "Deep Fryer Oil Volume Calculator",
  description:
    "Free deep fryer oil calculator. Calculate how much oil you need for deep frying based on pot or fryer size, and find the right frying temperature for different foods.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "deep fryer oil calculator",
    "how much oil for deep frying",
    "frying oil amount",
    "deep fry temperature",
    "oil for turkey fryer",
    "frying oil volume",
  ],
  variants: [
    {
      id: "oil-volume",
      name: "Oil Volume Calculator",
      description: "Calculate oil needed for your pot or fryer",
      fields: [
        {
          name: "fryer",
          label: "Fryer / Pot Type",
          type: "select",
          options: [
            { label: "Small Countertop Fryer (1-2 qt)", value: "small" },
            { label: "Medium Countertop Fryer (3-4 qt)", value: "medium" },
            { label: "Large Countertop Fryer (4-6 qt)", value: "large" },
            { label: "Dutch Oven / Stockpot (5-6 qt)", value: "dutch_oven" },
            { label: "Large Stockpot (8-12 qt)", value: "stockpot" },
            { label: "Turkey Fryer (26-30 qt)", value: "turkey_fryer" },
          ],
        },
        {
          name: "food",
          label: "What Are You Frying?",
          type: "select",
          options: [
            { label: "French Fries / Chips", value: "fries" },
            { label: "Chicken (pieces)", value: "chicken" },
            { label: "Whole Turkey", value: "turkey" },
            { label: "Fish / Seafood", value: "fish" },
            { label: "Donuts / Dough", value: "donuts" },
            { label: "Vegetables (tempura)", value: "vegetables" },
            { label: "Spring Rolls / Egg Rolls", value: "spring_rolls" },
          ],
        },
      ],
      calculate: (inputs) => {
        const fryer = inputs.fryer as string;
        const food = inputs.food as string;
        if (!fryer || !food) return null;

        // Oil volumes in quarts (fill to 2/3 capacity for safety)
        const fryerCapacity: Record<string, { quarts: number; fillQuarts: number }> = {
          small: { quarts: 1.5, fillQuarts: 1 },
          medium: { quarts: 3.5, fillQuarts: 2.3 },
          large: { quarts: 5, fillQuarts: 3.3 },
          dutch_oven: { quarts: 5.5, fillQuarts: 3.5 },
          stockpot: { quarts: 10, fillQuarts: 6.5 },
          turkey_fryer: { quarts: 28, fillQuarts: 18 },
        };

        // Frying temperatures in F
        const fryTemps: Record<string, { temp: number; time: string }> = {
          fries: { temp: 375, time: "3-5 min per batch" },
          chicken: { temp: 350, time: "12-15 min (pieces)" },
          turkey: { temp: 350, time: "3-4 min per pound" },
          fish: { temp: 375, time: "3-5 min" },
          donuts: { temp: 365, time: "1-2 min per side" },
          vegetables: { temp: 375, time: "2-3 min" },
          spring_rolls: { temp: 350, time: "3-5 min" },
        };

        const cap = fryerCapacity[fryer];
        const temp = fryTemps[food];
        if (!cap || !temp) return null;

        const oilQuarts = food === "turkey" && fryer === "turkey_fryer" ? 18 : cap.fillQuarts;
        const oilLiters = oilQuarts * 0.946353;
        const oilGallons = oilQuarts / 4;
        const oilCups = oilQuarts * 4;
        const tempC = (temp.temp - 32) * 5 / 9;

        // Cost estimate: vegetable oil ~$0.12/oz, 1 qt = 32 oz
        const costEstimate = oilQuarts * 32 * 0.06;

        return {
          primary: {
            label: "Oil Needed",
            value: formatNumber(oilQuarts, 1) + " quarts",
          },
          details: [
            { label: "Oil (gallons)", value: formatNumber(oilGallons, 2) + " gal" },
            { label: "Oil (liters)", value: formatNumber(oilLiters, 1) + " L" },
            { label: "Oil (cups)", value: formatNumber(oilCups, 0) + " cups" },
            { label: "Frying Temperature", value: temp.temp + "\u00B0F (" + formatNumber(tempC, 0) + "\u00B0C)" },
            { label: "Cooking Time", value: temp.time },
            { label: "Fill Level", value: "No more than 2/3 full (safety)" },
            { label: "Approx. Oil Cost", value: "$" + formatNumber(costEstimate, 2) },
          ],
          note: "Never fill a fryer more than 2/3 full with oil. Oil expands when heated and food displaces oil when added. Overfilling causes dangerous oil overflow.",
        };
      },
    },
    {
      id: "temp-guide",
      name: "Frying Temperature Guide",
      description: "Look up the right frying temperature for any food",
      fields: [
        {
          name: "food",
          label: "Food Item",
          type: "select",
          options: [
            { label: "French Fries (first fry)", value: "fries_1" },
            { label: "French Fries (second fry / crispy)", value: "fries_2" },
            { label: "Fried Chicken", value: "fried_chicken" },
            { label: "Chicken Wings", value: "wings" },
            { label: "Chicken Tenders / Nuggets", value: "tenders" },
            { label: "Fish & Chips", value: "fish_chips" },
            { label: "Shrimp / Calamari", value: "shrimp" },
            { label: "Onion Rings", value: "onion_rings" },
            { label: "Donuts", value: "donuts_temp" },
            { label: "Hush Puppies / Fritters", value: "fritters" },
            { label: "Egg Rolls / Spring Rolls", value: "egg_rolls" },
            { label: "Falafel", value: "falafel" },
            { label: "Churros", value: "churros" },
            { label: "Whole Turkey", value: "whole_turkey" },
          ],
        },
      ],
      calculate: (inputs) => {
        const food = inputs.food as string;
        if (!food) return null;

        const guide: Record<string, { temp: number; time: string; tips: string }> = {
          fries_1: { temp: 325, time: "5-6 min until soft", tips: "First fry cooks through. Cool completely before second fry." },
          fries_2: { temp: 375, time: "2-3 min until golden", tips: "Second fry at higher temp creates the crispy exterior." },
          fried_chicken: { temp: 350, time: "12-15 min", tips: "Don't crowd the fryer. Internal temp must reach 165\u00B0F." },
          wings: { temp: 375, time: "10-12 min", tips: "Fry until golden and internal temp reaches 165\u00B0F." },
          tenders: { temp: 350, time: "5-7 min", tips: "Smaller pieces cook faster. Don't overcook." },
          fish_chips: { temp: 375, time: "4-6 min", tips: "Pat fish dry. Batter immediately before frying." },
          shrimp: { temp: 375, time: "2-3 min", tips: "Shrimp cook quickly. Remove as soon as golden." },
          onion_rings: { temp: 375, time: "2-3 min", tips: "Separate rings and coat individually for best results." },
          donuts_temp: { temp: 365, time: "1-2 min per side", tips: "If oil is too hot, outside browns before inside cooks." },
          fritters: { temp: 365, time: "3-4 min", tips: "Use a spoon or scoop for even size portions." },
          egg_rolls: { temp: 350, time: "3-5 min", tips: "Seal edges well to prevent filling from leaking." },
          falafel: { temp: 350, time: "3-5 min", tips: "Form firmly. If they fall apart, add more binding." },
          churros: { temp: 375, time: "2-4 min", tips: "Pipe directly into oil. Roll in cinnamon sugar while warm." },
          whole_turkey: { temp: 350, time: "3-4 min per pound", tips: "Turkey must be COMPLETELY thawed and dry. Use 4-5 gal peanut oil." },
        };

        const data = guide[food];
        if (!data) return null;

        const tempC = (data.temp - 32) * 5 / 9;

        return {
          primary: {
            label: "Frying Temperature",
            value: data.temp + "\u00B0F (" + formatNumber(tempC, 0) + "\u00B0C)",
          },
          details: [
            { label: "Temperature", value: data.temp + "\u00B0F / " + formatNumber(tempC, 0) + "\u00B0C" },
            { label: "Cooking Time", value: data.time },
            { label: "Tips", value: data.tips },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grill-temperature-calculator", "meat-cooking-time-calculator"],
  faq: [
    {
      question: "How much oil do I need for deep frying?",
      answer:
        "Fill your pot or fryer no more than 2/3 full with oil. For a Dutch oven, that's about 3-4 quarts. For a turkey fryer, about 4-5 gallons. You need enough oil to fully submerge the food while leaving room for displacement and bubbling.",
    },
    {
      question: "What is the best oil for deep frying?",
      answer:
        "Peanut oil and vegetable oil are the most popular choices due to high smoke points (450\u00B0F and 400-450\u00B0F). Canola oil is another good option. Avoid olive oil and butter for deep frying as they have lower smoke points.",
    },
    {
      question: "How many times can I reuse frying oil?",
      answer:
        "Oil can typically be reused 3-4 times for breaded foods, and up to 8 times for cleaner frying (like French fries). Strain through cheesecloth after each use, store in a cool dark place, and discard when it darkens significantly or smells off.",
    },
  ],
  formula:
    "Oil Volume = Fryer Capacity x 2/3 (safety margin). Common frying temps: 325-375\u00B0F for most foods. Turkey frying: 350\u00B0F at 3-4 min/lb. Double-fry method for fries: 325\u00B0F first fry, 375\u00B0F second fry.",
};
