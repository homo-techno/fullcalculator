import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cheeseMakingCalculator: CalculatorDefinition = {
  slug: "cheese-making-calculator",
  title: "Cheese Making Calculator",
  description:
    "Free cheese making ingredient calculator. Calculate the amount of milk, rennet, culture, and salt needed to make different types of cheese.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cheese making calculator",
    "cheese recipe calculator",
    "rennet calculator",
    "homemade cheese",
    "cheese yield calculator",
  ],
  variants: [
    {
      id: "by-milk",
      name: "By Milk Volume",
      description: "Calculate ingredients based on milk quantity",
      fields: [
        {
          name: "milkGallons",
          label: "Milk (gallons)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0.5,
          max: 50,
          step: 0.5,
        },
        {
          name: "milkType",
          label: "Milk Type",
          type: "select",
          options: [
            { label: "Whole Cow's Milk", value: "cow-whole" },
            { label: "Skim Cow's Milk", value: "cow-skim" },
            { label: "Goat's Milk", value: "goat" },
            { label: "Sheep's Milk", value: "sheep" },
          ],
          defaultValue: "cow-whole",
        },
        {
          name: "cheeseType",
          label: "Cheese Type",
          type: "select",
          options: [
            { label: "Mozzarella (fresh)", value: "mozzarella" },
            { label: "Cheddar", value: "cheddar" },
            { label: "Gouda", value: "gouda" },
            { label: "Ricotta", value: "ricotta" },
            { label: "Feta", value: "feta" },
            { label: "Brie / Camembert", value: "brie" },
          ],
          defaultValue: "cheddar",
        },
      ],
      calculate: (inputs) => {
        const gallons = parseFloat(inputs.milkGallons as string);
        const milkType = inputs.milkType as string;
        const cheeseType = inputs.cheeseType as string;
        if (!gallons) return null;

        const liters = gallons * 3.785;

        // Yield per gallon (lbs) varies by cheese type and milk
        const yieldMap: Record<string, number> = {
          mozzarella: 0.9,
          cheddar: 1.0,
          gouda: 1.1,
          ricotta: 0.5,
          feta: 0.8,
          brie: 0.7,
        };

        // Milk fat bonus
        const fatMultiplier: Record<string, number> = {
          "cow-whole": 1.0,
          "cow-skim": 0.7,
          goat: 0.95,
          sheep: 1.3,
        };

        const baseYield = yieldMap[cheeseType] || 1.0;
        const fatMult = fatMultiplier[milkType] || 1.0;
        const cheeseYieldLbs = gallons * baseYield * fatMult;
        const cheeseYieldKg = cheeseYieldLbs * 0.4536;

        // Ingredient calculations
        const rennetTsp = cheeseType === "ricotta" ? 0 : gallons * 0.25; // 1/4 tsp per gallon
        const cultureTsp = cheeseType === "ricotta" ? 0 : gallons * 0.25;
        const saltTbsp = cheeseYieldLbs * 0.5; // about 1/2 tbsp per lb
        const calciumChlorideTsp = milkType === "cow-whole" ? 0 : gallons * 0.25;
        const acidTbsp = cheeseType === "ricotta" ? gallons * 0.5 : 0; // vinegar/citric acid for ricotta

        const details = [
          { label: "Estimated Cheese Yield", value: formatNumber(cheeseYieldLbs, 1) + " lbs (" + formatNumber(cheeseYieldKg, 2) + " kg)" },
          { label: "Milk Volume", value: formatNumber(gallons, 1) + " gal (" + formatNumber(liters, 1) + " L)" },
        ];

        if (rennetTsp > 0) {
          details.push({ label: "Rennet", value: formatNumber(rennetTsp, 2) + " tsp liquid rennet" });
        }
        if (cultureTsp > 0) {
          details.push({ label: "Mesophilic/Thermophilic Culture", value: formatNumber(cultureTsp, 2) + " tsp" });
        }
        if (acidTbsp > 0) {
          details.push({ label: "Vinegar or Citric Acid", value: formatNumber(acidTbsp, 1) + " tbsp" });
        }
        details.push({ label: "Cheese Salt", value: formatNumber(saltTbsp, 1) + " tbsp" });
        if (calciumChlorideTsp > 0) {
          details.push({ label: "Calcium Chloride", value: formatNumber(calciumChlorideTsp, 2) + " tsp" });
        }

        return {
          primary: {
            label: "Cheese Yield",
            value: formatNumber(cheeseYieldLbs, 1) + " lbs",
          },
          details,
          note: "Yields are approximate. Actual yield depends on milk quality, fat content, technique, and aging. Store-bought pasteurized milk may yield less than farm-fresh.",
        };
      },
    },
    {
      id: "by-cheese",
      name: "By Desired Cheese Weight",
      description: "Calculate how much milk you need for a target weight",
      fields: [
        {
          name: "targetLbs",
          label: "Desired Cheese Weight (lbs)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0.25,
          max: 50,
          step: 0.25,
        },
        {
          name: "cheeseType",
          label: "Cheese Type",
          type: "select",
          options: [
            { label: "Mozzarella (fresh)", value: "mozzarella" },
            { label: "Cheddar", value: "cheddar" },
            { label: "Gouda", value: "gouda" },
            { label: "Ricotta", value: "ricotta" },
            { label: "Feta", value: "feta" },
            { label: "Brie / Camembert", value: "brie" },
          ],
          defaultValue: "cheddar",
        },
      ],
      calculate: (inputs) => {
        const targetLbs = parseFloat(inputs.targetLbs as string);
        const cheeseType = inputs.cheeseType as string;
        if (!targetLbs) return null;

        const yieldPerGallon: Record<string, number> = {
          mozzarella: 0.9,
          cheddar: 1.0,
          gouda: 1.1,
          ricotta: 0.5,
          feta: 0.8,
          brie: 0.7,
        };

        const yieldRate = yieldPerGallon[cheeseType] || 1.0;
        const gallonsNeeded = targetLbs / yieldRate;
        const litersNeeded = gallonsNeeded * 3.785;
        const targetKg = targetLbs * 0.4536;

        return {
          primary: {
            label: "Milk Needed",
            value: formatNumber(gallonsNeeded, 1) + " gallons",
          },
          details: [
            { label: "Milk (liters)", value: formatNumber(litersNeeded, 1) },
            { label: "Target Cheese", value: formatNumber(targetLbs, 1) + " lbs (" + formatNumber(targetKg, 2) + " kg)" },
            { label: "Yield Rate", value: formatNumber(yieldRate, 1) + " lbs/gallon" },
            { label: "Rennet", value: formatNumber(gallonsNeeded * 0.25, 2) + " tsp" },
            { label: "Salt", value: formatNumber(targetLbs * 0.5, 1) + " tbsp" },
          ],
          note: "Use whole milk for best yield. Farm-fresh, non-ultra-pasteurized milk produces the best results.",
        };
      },
    },
  ],
  relatedSlugs: ["cooking-converter", "unit-converter"],
  faq: [
    {
      question: "How much cheese does 1 gallon of milk make?",
      answer:
        "One gallon of whole cow's milk yields approximately 1 pound of hard cheese (cheddar, gouda) or about 0.9 pounds of fresh mozzarella. Ricotta yields less at about 0.5 pounds per gallon. Sheep's milk yields about 30% more due to higher fat and protein content.",
    },
    {
      question: "What type of milk is best for making cheese?",
      answer:
        "Fresh, whole, non-ultra-pasteurized milk is best for cheese making. Avoid UHT (ultra-high temperature) pasteurized milk as it won't form proper curds. Raw milk produces the best flavor and yield. Goat and sheep milk make excellent cheese with distinctive flavors.",
    },
    {
      question: "How long does it take to make cheese?",
      answer:
        "Fresh cheeses like ricotta and mozzarella take 1-3 hours. Semi-hard cheeses like cheddar and gouda take a full day of active work plus weeks to months of aging. Brie and camembert require 4-8 weeks of aging, while aged cheddar can take 6-24 months.",
    },
  ],
  formula:
    "Cheese Yield (lbs) = Milk (gallons) × Yield Rate × Milk Fat Multiplier | Rennet = 0.25 tsp per gallon",
};
