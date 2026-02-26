import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const alcoholUnitsCalculator: CalculatorDefinition = {
  slug: "alcohol-units",
  title: "Alcohol Units Calculator",
  description:
    "Free online alcohol units calculator to track standard drinks and estimate blood alcohol content.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "alcohol",
    "units",
    "standard drinks",
    "BAC",
    "blood alcohol",
    "beer",
    "wine",
    "spirits",
    "drinking",
  ],
  variants: [
    {
      id: "alcohol-units",
      name: "Calculate Alcohol Units / Standard Drinks",
      description:
        "Convert any alcoholic beverage to standard drinks/units.",
      fields: [
        {
          name: "beverageType",
          label: "Beverage Type",
          type: "select",
          options: [
            { label: "Beer/Cider (5% ABV)", value: "5" },
            { label: "Strong Beer (7% ABV)", value: "7" },
            { label: "Wine (12% ABV)", value: "12" },
            { label: "Fortified Wine/Port (20% ABV)", value: "20" },
            { label: "Spirits/Liquor (40% ABV)", value: "40" },
            { label: "Custom ABV", value: "custom" },
          ],
        },
        {
          name: "customAbv",
          label: "Custom ABV % (if selected above)",
          type: "number",
          placeholder: "e.g. 13.5",
          suffix: "%",
        },
        {
          name: "volumeMl",
          label: "Volume",
          type: "number",
          placeholder: "e.g. 355",
          suffix: "mL",
        },
        {
          name: "numberOfDrinks",
          label: "Number of Drinks",
          type: "number",
          placeholder: "e.g. 3",
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        let abv = parseFloat(inputs.beverageType as string) || 0;
        if (inputs.beverageType === "custom") {
          abv = parseFloat(inputs.customAbv as string) || 0;
        }
        const volumeMl = parseFloat(inputs.volumeMl as string) || 0;
        const count = parseFloat(inputs.numberOfDrinks as string) || 1;

        if (abv <= 0 || volumeMl <= 0) return null;

        // UK units: volume (mL) × ABV% / 1000
        const ukUnitsPerDrink = (volumeMl * abv) / 1000;
        const totalUkUnits = ukUnitsPerDrink * count;

        // US standard drinks: 14g pure alcohol per drink
        // Pure alcohol (g) = volume (mL) × ABV/100 × 0.789 (density)
        const pureAlcoholGrams = volumeMl * (abv / 100) * 0.789;
        const usStandardDrinks = pureAlcoholGrams / 14;
        const totalUsStandard = usStandardDrinks * count;

        const totalAlcoholGrams = pureAlcoholGrams * count;
        const totalCalories = totalAlcoholGrams * 7; // 7 cal per gram of alcohol

        // Weekly limit assessment (UK: 14 units/week, US: 14 standard drinks/week for men, 7 for women)
        const weeklyUkIfDaily = totalUkUnits * 7;

        let assessment: string;
        if (totalUsStandard <= 1) assessment = "Low risk (within one standard drink)";
        else if (totalUsStandard <= 2) assessment = "Moderate (within daily recommended limit for men)";
        else if (totalUsStandard <= 4) assessment = "Above recommended daily limit";
        else assessment = "Heavy drinking / binge drinking territory";

        return {
          primary: {
            label: "US Standard Drinks",
            value: formatNumber(totalUsStandard),
          },
          details: [
            { label: "UK Alcohol Units", value: formatNumber(totalUkUnits) },
            { label: "Pure Alcohol", value: formatNumber(totalAlcoholGrams) + " g" },
            { label: "Calories (from alcohol)", value: formatNumber(totalCalories) + " kcal" },
            { label: "Per Drink: Standard Drinks", value: formatNumber(usStandardDrinks) },
            { label: "Per Drink: UK Units", value: formatNumber(ukUnitsPerDrink) },
            { label: "Risk Assessment", value: assessment },
            { label: "If Daily: Weekly UK Units", value: formatNumber(weeklyUkIfDaily) + " (limit: 14)" },
          ],
          note: "One US standard drink = 14g pure alcohol. One UK unit = 10 mL (8g) pure alcohol. Recommended limits: US - up to 2 drinks/day (men), 1/day (women); UK - max 14 units/week.",
        };
      },
    },
    {
      id: "bac-estimate",
      name: "BAC Estimate (Widmark)",
      description:
        "Estimate blood alcohol concentration using the Widmark formula.",
      fields: [
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "weightKg",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 80",
          suffix: "kg",
        },
        {
          name: "standardDrinks",
          label: "Number of Standard Drinks",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "hoursdrinking",
          label: "Hours Since First Drink",
          type: "number",
          placeholder: "e.g. 2",
          suffix: "hours",
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        const weight = parseFloat(inputs.weightKg as string) || 0;
        const drinks = parseFloat(inputs.standardDrinks as string) || 0;
        const hours = parseFloat(inputs.hoursdrinking as string) || 0;

        if (weight <= 0 || drinks <= 0) return null;

        // Widmark formula: BAC = (alcohol_grams / (body_weight_g × r)) - (elimination_rate × hours)
        const alcoholGrams = drinks * 14; // 14g per standard drink
        const r = sex === "male" ? 0.68 : 0.55; // Widmark factor
        const eliminationRate = 0.015; // BAC/hour average

        const bac = Math.max(0, (alcoholGrams / (weight * 1000 * r)) * 100 - eliminationRate * hours);

        let impairment: string;
        if (bac < 0.02) impairment = "Minimal or no impairment";
        else if (bac < 0.05) impairment = "Mild impairment (reduced inhibition, relaxation)";
        else if (bac < 0.08) impairment = "Moderate impairment (reduced coordination, judgment)";
        else if (bac < 0.15) impairment = "Significant impairment (legally intoxicated in most jurisdictions)";
        else if (bac < 0.30) impairment = "Severe impairment (confusion, vomiting, blackouts)";
        else impairment = "Life-threatening (risk of coma and death)";

        const legalLimit = bac >= 0.08;
        const hoursToSober = bac / eliminationRate;

        return {
          primary: {
            label: "Estimated BAC",
            value: formatNumber(bac),
            suffix: "%",
          },
          details: [
            { label: "Impairment Level", value: impairment },
            { label: "Over Legal Limit (0.08%)?", value: legalLimit ? "Yes" : "No" },
            { label: "Estimated Hours to Sober", value: formatNumber(hoursToSober) + " hours" },
            { label: "Total Alcohol Consumed", value: formatNumber(alcoholGrams) + " g" },
            { label: "Widmark Factor (r)", value: formatNumber(r) },
          ],
          note: "This is a rough estimate only. Actual BAC depends on many factors including food intake, medications, liver function, and genetics. Never drink and drive.",
        };
      },
    },
  ],
  relatedSlugs: ["life-expectancy-calc", "drug-half-life", "caffeine-calc"],
  faq: [
    {
      question: "What is a standard drink?",
      answer:
        "In the US, one standard drink contains 14 grams of pure alcohol. This equals about 12 oz of regular beer (5% ABV), 5 oz of wine (12% ABV), or 1.5 oz of distilled spirits (40% ABV). In the UK, one unit equals 10 mL (8g) of pure alcohol.",
    },
    {
      question: "How long does it take to sober up?",
      answer:
        "The liver metabolizes alcohol at an average rate of about 0.015% BAC per hour (roughly one standard drink per hour). Nothing speeds this up - not coffee, cold showers, or exercise. Time is the only way to become sober.",
    },
    {
      question: "What are safe drinking limits?",
      answer:
        "The US Dietary Guidelines recommend up to 2 standard drinks per day for men and 1 for women. The UK NHS recommends no more than 14 units per week spread over 3+ days. Any amount of alcohol carries some health risk, and the safest level of drinking is none.",
    },
  ],
  formula:
    "UK Units = Volume_mL × ABV% / 1000. US Standard Drinks = (Volume_mL × ABV/100 × 0.789) / 14. BAC (Widmark) = (Alcohol_g / (Weight_g × r)) × 100 - 0.015 × Hours. r = 0.68 (male), 0.55 (female).",
};
