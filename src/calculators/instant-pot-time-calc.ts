import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const instantPotTimeCalculator: CalculatorDefinition = {
  slug: "instant-pot-time-calculator",
  title: "Instant Pot Pressure Cooking Time Guide",
  description:
    "Free Instant Pot pressure cooking time calculator. Get recommended cook times for meats, grains, beans, and vegetables based on food type and desired doneness.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "instant pot time",
    "pressure cooker time",
    "instant pot cooking guide",
    "pressure cooking time chart",
    "instant pot minutes",
    "pressure cooker calculator",
  ],
  variants: [
    {
      id: "meat",
      name: "Meat & Poultry",
      description:
        "Pressure cooking times for various meats",
      fields: [
        {
          name: "meat",
          label: "Meat Type",
          type: "select",
          options: [
            { label: "Chicken Breast (boneless)", value: "chicken_breast" },
            { label: "Chicken Thighs (bone-in)", value: "chicken_thigh" },
            { label: "Whole Chicken (3-4 lbs)", value: "whole_chicken" },
            { label: "Beef Stew Meat (cubed)", value: "beef_stew" },
            { label: "Beef Roast (chuck, 3-4 lbs)", value: "beef_roast" },
            { label: "Pork Chops (1 inch)", value: "pork_chops" },
            { label: "Pork Shoulder/Butt (3-4 lbs)", value: "pork_shoulder" },
            { label: "Baby Back Ribs", value: "ribs" },
            { label: "Ground Beef/Turkey", value: "ground" },
            { label: "Lamb Shanks", value: "lamb_shanks" },
          ],
          defaultValue: "chicken_breast",
        },
        {
          name: "state",
          label: "Fresh or Frozen?",
          type: "select",
          options: [
            { label: "Fresh / Thawed", value: "fresh" },
            { label: "Frozen", value: "frozen" },
          ],
          defaultValue: "fresh",
        },
      ],
      calculate: (inputs) => {
        const meat = inputs.meat as string;
        const state = inputs.state as string;

        const meatTimes: Record<string, { fresh: number; frozen: number; release: string; note: string }> = {
          chicken_breast: { fresh: 8, frozen: 12, release: "Quick Release", note: "Internal temp: 165\u00b0F. Let rest 5 min." },
          chicken_thigh: { fresh: 10, frozen: 15, release: "Quick Release", note: "Bone-in adds flavor. Internal temp: 165\u00b0F." },
          whole_chicken: { fresh: 25, frozen: 35, release: "Natural Release 10 min", note: "Use trivet. 6 min per pound." },
          beef_stew: { fresh: 20, frozen: 25, release: "Natural Release 10 min", note: "Cut into 1-inch cubes for even cooking." },
          beef_roast: { fresh: 60, frozen: 75, release: "Natural Release 15 min", note: "~20 min per pound. Falls apart when done." },
          pork_chops: { fresh: 8, frozen: 12, release: "Quick Release", note: "Bone-in: add 2 min. Do not overcook." },
          pork_shoulder: { fresh: 60, frozen: 80, release: "Natural Release 15 min", note: "~15-20 min per pound for shreddable pork." },
          ribs: { fresh: 25, frozen: 35, release: "Natural Release 10 min", note: "Finish under broiler for 3-5 min for crispy exterior." },
          ground: { fresh: 5, frozen: 10, release: "Quick Release", note: "Use saute mode to brown first for better flavor." },
          lamb_shanks: { fresh: 35, frozen: 45, release: "Natural Release 10 min", note: "Should be fork-tender when done." },
        };

        const data = meatTimes[meat] || meatTimes.chicken_breast;
        const cookTime = state === "frozen" ? data.frozen : data.fresh;

        // Total time estimate: ~10 min to pressurize + cook + release
        const pressurizeMin = 10;
        const releaseMin = data.release.includes("Natural") ? 15 : 3;
        const totalMin = pressurizeMin + cookTime + releaseMin;

        return {
          primary: {
            label: `${state === "frozen" ? "Frozen" : "Fresh"} meat`,
            value: `${formatNumber(cookTime)} min at High Pressure`,
          },
          details: [
            { label: "Cook Time", value: `${formatNumber(cookTime)} minutes` },
            { label: "Pressure", value: "High" },
            { label: "Release Method", value: data.release },
            { label: "Time to Pressurize", value: `~${formatNumber(pressurizeMin)} min` },
            { label: "Total Time (approx)", value: `~${formatNumber(totalMin)} min` },
          ],
          note: data.note,
        };
      },
    },
    {
      id: "grains-beans",
      name: "Grains & Beans",
      description: "Pressure cooking times for grains and legumes",
      fields: [
        {
          name: "food",
          label: "Grain/Bean",
          type: "select",
          options: [
            { label: "White Rice", value: "white_rice" },
            { label: "Brown Rice", value: "brown_rice" },
            { label: "Quinoa", value: "quinoa" },
            { label: "Steel Cut Oats", value: "steel_oats" },
            { label: "Black Beans (dried)", value: "black_beans" },
            { label: "Pinto Beans (dried)", value: "pinto_beans" },
            { label: "Chickpeas (dried)", value: "chickpeas" },
            { label: "Lentils (green/brown)", value: "lentils" },
            { label: "Red Lentils", value: "red_lentils" },
            { label: "Wild Rice", value: "wild_rice" },
          ],
          defaultValue: "white_rice",
        },
        {
          name: "soaked",
          label: "Pre-soaked? (beans only)",
          type: "select",
          options: [
            { label: "Not soaked / N/A", value: "no" },
            { label: "Soaked overnight", value: "yes" },
          ],
          defaultValue: "no",
        },
      ],
      calculate: (inputs) => {
        const food = inputs.food as string;
        const soaked = inputs.soaked as string;

        const data: Record<string, { time: number; soakedTime: number; waterRatio: string; release: string }> = {
          white_rice: { time: 4, soakedTime: 4, waterRatio: "1:1", release: "Natural Release 10 min" },
          brown_rice: { time: 22, soakedTime: 22, waterRatio: "1:1.25", release: "Natural Release 10 min" },
          quinoa: { time: 1, soakedTime: 1, waterRatio: "1:1.25", release: "Natural Release 10 min" },
          steel_oats: { time: 10, soakedTime: 10, waterRatio: "1:3", release: "Natural Release 10 min" },
          black_beans: { time: 30, soakedTime: 8, waterRatio: "1:3", release: "Natural Release 15 min" },
          pinto_beans: { time: 25, soakedTime: 8, waterRatio: "1:3", release: "Natural Release 15 min" },
          chickpeas: { time: 35, soakedTime: 12, waterRatio: "1:3", release: "Natural Release 15 min" },
          lentils: { time: 12, soakedTime: 12, waterRatio: "1:2.5", release: "Natural Release 5 min" },
          red_lentils: { time: 5, soakedTime: 5, waterRatio: "1:2", release: "Natural Release 5 min" },
          wild_rice: { time: 25, soakedTime: 25, waterRatio: "1:1.5", release: "Natural Release 10 min" },
        };

        const d = data[food] || data.white_rice;
        const cookTime = soaked === "yes" ? d.soakedTime : d.time;

        return {
          primary: {
            label: food.replace(/_/g, " "),
            value: `${formatNumber(cookTime)} min at High Pressure`,
          },
          details: [
            { label: "Cook Time", value: `${formatNumber(cookTime)} minutes` },
            { label: "Water Ratio", value: d.waterRatio },
            { label: "Release Method", value: d.release },
            { label: "Pressure", value: "High" },
          ],
        };
      },
    },
    {
      id: "vegetables",
      name: "Vegetables",
      description: "Pressure cooking times for fresh and frozen vegetables",
      fields: [
        {
          name: "vegetable",
          label: "Vegetable",
          type: "select",
          options: [
            { label: "Potatoes (whole, medium)", value: "potato_whole" },
            { label: "Potatoes (cubed)", value: "potato_cubed" },
            { label: "Sweet Potatoes (whole)", value: "sweet_potato" },
            { label: "Corn on the Cob", value: "corn" },
            { label: "Broccoli (florets)", value: "broccoli" },
            { label: "Carrots (sliced)", value: "carrots" },
            { label: "Green Beans", value: "green_beans" },
            { label: "Butternut Squash (cubed)", value: "squash" },
            { label: "Beets (whole, medium)", value: "beets" },
            { label: "Artichokes (whole)", value: "artichoke" },
          ],
          defaultValue: "potato_whole",
        },
      ],
      calculate: (inputs) => {
        const vegetable = inputs.vegetable as string;

        const vegTimes: Record<string, { time: number; release: string; note: string }> = {
          potato_whole: { time: 12, release: "Quick Release", note: "Pierce with fork. Size matters: large potatoes need 15 min." },
          potato_cubed: { time: 4, release: "Quick Release", note: "Cut into 1-inch cubes for even cooking." },
          sweet_potato: { time: 15, release: "Quick Release", note: "Pierce skin. Large sweet potatoes need 18-20 min." },
          corn: { time: 2, release: "Quick Release", note: "Fresh or frozen. Do not overcook." },
          broccoli: { time: 1, release: "Quick Release", note: "Steamer basket recommended. Very easy to overcook." },
          carrots: { time: 3, release: "Quick Release", note: "Thicker slices need 4-5 min." },
          green_beans: { time: 2, release: "Quick Release", note: "Fresh: 1-2 min. Frozen: 2-3 min." },
          squash: { time: 7, release: "Quick Release", note: "1-inch cubes. Use steamer basket." },
          beets: { time: 20, release: "Natural Release 5 min", note: "Skin slips off easily after cooking." },
          artichoke: { time: 10, release: "Quick Release", note: "Trim tops and stems first." },
        };

        const d = vegTimes[vegetable] || vegTimes.potato_whole;

        return {
          primary: {
            label: vegetable.replace(/_/g, " "),
            value: `${formatNumber(d.time)} min at High Pressure`,
          },
          details: [
            { label: "Cook Time", value: `${formatNumber(d.time)} minutes` },
            { label: "Pressure", value: "High" },
            { label: "Release Method", value: d.release },
          ],
          note: d.note,
        };
      },
    },
  ],
  relatedSlugs: [
    "cooking-converter",
    "canning-time-calculator",
    "dehydrator-time-calculator",
  ],
  faq: [
    {
      question: "Why does total Instant Pot time seem longer than the displayed cook time?",
      answer:
        "The displayed cook time only counts the time at pressure. The Instant Pot also needs 5-15 minutes to come to pressure before cooking starts, and additional time for pressure release (2-3 min for quick release, 10-20 min for natural release). Total time is typically cook time + 15-25 minutes.",
    },
    {
      question: "When should I use Quick Release vs Natural Release?",
      answer:
        "Quick Release is best for delicate foods that overcook easily (vegetables, seafood, eggs). Natural Release is better for meats (keeps them tender), grains (prevents sputtering), and beans (prevents split skins). Some recipes use a partial natural release.",
    },
  ],
  formula:
    "Total Time = Time to Pressurize (~10 min) + Cook Time + Release Time | Frozen: add ~50% more cook time",
};
