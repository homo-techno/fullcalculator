import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grillTemperatureCalculator: CalculatorDefinition = {
  slug: "grill-temperature-calculator",
  title: "Grill Temperature Guide Calculator",
  description:
    "Free grill temperature calculator. Get recommended grilling temperatures, times, and internal temperatures for steaks, chicken, burgers, fish, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "grill temperature",
    "grilling time",
    "grill temp chart",
    "steak grill temperature",
    "chicken grill temp",
    "burger grill time",
    "grilling guide",
  ],
  variants: [
    {
      id: "calc",
      name: "Grill Temperature Guide",
      fields: [
        {
          name: "food",
          label: "Food Item",
          type: "select",
          options: [
            { label: "Steak (1 inch thick)", value: "steak_1" },
            { label: "Steak (1.5 inch thick)", value: "steak_15" },
            { label: "Chicken Breast (boneless)", value: "chicken_breast" },
            { label: "Chicken Thighs", value: "chicken_thigh" },
            { label: "Whole Chicken", value: "whole_chicken" },
            { label: "Burgers (1/2 lb patty)", value: "burger" },
            { label: "Hot Dogs / Sausages", value: "hotdog" },
            { label: "Pork Chops (1 inch)", value: "pork_chop" },
            { label: "Baby Back Ribs", value: "ribs" },
            { label: "Salmon Fillet", value: "salmon" },
            { label: "Shrimp", value: "shrimp" },
            { label: "Vegetables", value: "vegetables" },
          ],
        },
        {
          name: "doneness",
          label: "Doneness (for steaks/burgers)",
          type: "select",
          options: [
            { label: "Rare", value: "rare" },
            { label: "Medium Rare", value: "medium_rare" },
            { label: "Medium", value: "medium" },
            { label: "Medium Well", value: "medium_well" },
            { label: "Well Done", value: "well_done" },
          ],
        },
      ],
      calculate: (inputs) => {
        const food = inputs.food as string;
        const doneness = inputs.doneness as string;
        if (!food) return null;

        interface GrillData {
          grillTemp: string;
          internalTemp: string;
          time: string;
          method: string;
          tips: string;
        }

        const steakTemps: Record<string, number> = {
          rare: 125,
          medium_rare: 135,
          medium: 145,
          medium_well: 150,
          well_done: 160,
        };

        const steakTimes1: Record<string, string> = {
          rare: "4-5 min total",
          medium_rare: "5-6 min total",
          medium: "6-7 min total",
          medium_well: "7-8 min total",
          well_done: "8-10 min total",
        };

        const steakTimes15: Record<string, string> = {
          rare: "6-7 min total",
          medium_rare: "7-8 min total",
          medium: "8-10 min total",
          medium_well: "10-12 min total",
          well_done: "12-14 min total",
        };

        const burgerTemps: Record<string, number> = {
          rare: 125,
          medium_rare: 135,
          medium: 145,
          medium_well: 150,
          well_done: 160,
        };

        let data: GrillData;

        if (food === "steak_1") {
          const temp = steakTemps[doneness] || 145;
          data = {
            grillTemp: "450-500\u00B0F (High)",
            internalTemp: temp + "\u00B0F",
            time: steakTimes1[doneness] || "6-7 min",
            method: "Direct heat",
            tips: "Flip once halfway through. Rest 5 min.",
          };
        } else if (food === "steak_15") {
          const temp = steakTemps[doneness] || 145;
          data = {
            grillTemp: "450-500\u00B0F (High)",
            internalTemp: temp + "\u00B0F",
            time: steakTimes15[doneness] || "8-10 min",
            method: "Sear on direct heat, finish on indirect",
            tips: "Sear 2 min per side, then move to indirect heat. Rest 5-10 min.",
          };
        } else if (food === "chicken_breast") {
          data = {
            grillTemp: "375-450\u00B0F (Medium-High)",
            internalTemp: "165\u00B0F",
            time: "12-16 min total",
            method: "Direct heat",
            tips: "Pound to even thickness. Flip once. Rest 5 min.",
          };
        } else if (food === "chicken_thigh") {
          data = {
            grillTemp: "375-450\u00B0F (Medium-High)",
            internalTemp: "175\u00B0F",
            time: "14-18 min total",
            method: "Direct heat",
            tips: "Skin side down first for 7-8 min, then flip.",
          };
        } else if (food === "whole_chicken") {
          data = {
            grillTemp: "350-375\u00B0F (Medium)",
            internalTemp: "165\u00B0F (thigh)",
            time: "1-1.5 hours",
            method: "Indirect heat",
            tips: "Use indirect heat with lid closed. Beer can or spatchcock for even cooking.",
          };
        } else if (food === "burger") {
          const temp = burgerTemps[doneness] || 160;
          data = {
            grillTemp: "375-400\u00B0F (Medium-High)",
            internalTemp: temp + "\u00B0F",
            time: "8-10 min total",
            method: "Direct heat",
            tips: "Flip once. Don't press patties. USDA recommends 160\u00B0F for ground beef.",
          };
        } else if (food === "hotdog") {
          data = {
            grillTemp: "375-400\u00B0F (Medium-High)",
            internalTemp: "160\u00B0F",
            time: "5-7 min total",
            method: "Direct heat, rolling",
            tips: "Roll every 1-2 minutes for even charring.",
          };
        } else if (food === "pork_chop") {
          data = {
            grillTemp: "400-450\u00B0F (Medium-High)",
            internalTemp: "145\u00B0F",
            time: "8-12 min total",
            method: "Direct heat",
            tips: "Flip once. Rest 3-5 min. Brine for extra juiciness.",
          };
        } else if (food === "ribs") {
          data = {
            grillTemp: "225-275\u00B0F (Low)",
            internalTemp: "195-203\u00B0F",
            time: "3-5 hours",
            method: "Indirect heat, low and slow",
            tips: "Use 3-2-1 method: 3 hrs smoke, 2 hrs wrapped, 1 hr sauced.",
          };
        } else if (food === "salmon") {
          data = {
            grillTemp: "375-400\u00B0F (Medium)",
            internalTemp: "145\u00B0F",
            time: "8-12 min total",
            method: "Direct heat, skin side down",
            tips: "Oil the grill grates well. Cook skin-side down most of the time.",
          };
        } else if (food === "shrimp") {
          data = {
            grillTemp: "400-450\u00B0F (Medium-High)",
            internalTemp: "120\u00B0F",
            time: "4-6 min total",
            method: "Direct heat, skewers",
            tips: "Use skewers to prevent falling through grates. Pink and opaque = done.",
          };
        } else if (food === "vegetables") {
          data = {
            grillTemp: "375-450\u00B0F (Medium-High)",
            internalTemp: "N/A",
            time: "5-15 min depending on vegetable",
            method: "Direct heat or grill basket",
            tips: "Toss in oil and season. Dense veggies (potatoes) need longer than tender ones (zucchini).",
          };
        } else {
          return null;
        }

        return {
          primary: {
            label: "Grill Temperature",
            value: data.grillTemp,
          },
          details: [
            { label: "Internal Temperature", value: data.internalTemp },
            { label: "Cooking Time", value: data.time },
            { label: "Method", value: data.method },
            { label: "Tips", value: data.tips },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["meat-cooking-time-calculator", "smoke-meat-time-calculator"],
  faq: [
    {
      question: "What grill temperature for steaks?",
      answer:
        "Grill steaks at 450-500\u00B0F (high heat) for direct searing. For thick steaks over 1.5 inches, sear on high heat for 2 minutes per side, then move to indirect heat to finish cooking to your desired internal temperature.",
    },
    {
      question: "How do I know when chicken is done on the grill?",
      answer:
        "Chicken must reach an internal temperature of 165\u00B0F for food safety. Use an instant-read thermometer inserted into the thickest part. Chicken breast takes about 12-16 minutes on medium-high heat.",
    },
    {
      question: "Should I use direct or indirect heat?",
      answer:
        "Use direct heat (right over the flame) for thin, quick-cooking items like steaks, burgers, and shrimp. Use indirect heat (to the side of the flame) for thick items and slow-cooking items like whole chickens and ribs.",
    },
  ],
  formula:
    "Grill temperatures: High = 450-500\u00B0F, Medium-High = 375-450\u00B0F, Medium = 325-375\u00B0F, Low = 225-275\u00B0F. USDA safe internal temperatures: Chicken = 165\u00B0F, Ground Beef = 160\u00B0F, Pork = 145\u00B0F, Fish = 145\u00B0F.",
};
