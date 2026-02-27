import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const creatineDosageCalculator: CalculatorDefinition = {
  slug: "creatine-dosage-calculator",
  title: "Creatine Dosage Calculator",
  description:
    "Calculate your optimal creatine loading and maintenance doses based on body weight. Covers both loading phase and standard dosing protocols.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "creatine dosage calculator",
    "creatine loading phase",
    "creatine dose",
    "how much creatine",
    "creatine calculator",
    "creatine monohydrate dosage",
  ],
  variants: [
    {
      id: "loading",
      name: "Loading Phase Protocol",
      description: "Calculate creatine loading and maintenance doses",
      fields: [
        {
          name: "bodyWeight",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 180",
          suffix: "lbs",
          min: 60,
          max: 400,
        },
        {
          name: "unit",
          label: "Weight Unit",
          type: "select",
          options: [
            { label: "Pounds (lbs)", value: "lbs" },
            { label: "Kilograms (kg)", value: "kg" },
          ],
          defaultValue: "lbs",
        },
        {
          name: "protocol",
          label: "Protocol",
          type: "select",
          options: [
            { label: "Loading + maintenance (fastest)", value: "loading" },
            { label: "Standard dose (no loading)", value: "standard" },
          ],
          defaultValue: "loading",
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.bodyWeight as string);
        const unit = inputs.unit as string;
        const protocol = inputs.protocol as string;
        if (!weight) return null;

        const weightKg = unit === "kg" ? weight : weight * 0.4536;

        // Loading: 0.3g/kg/day for 5-7 days, split into 4 doses
        // Maintenance: 0.03g/kg/day (minimum 3g, typically 3-5g)
        const loadingDose = weightKg * 0.3;
        const loadingPerDose = loadingDose / 4;
        const maintenanceDose = Math.max(3, weightKg * 0.03);

        const loadingDays = 7;
        const totalLoadingGrams = loadingDose * loadingDays;

        // Time to saturation
        const saturationDays = protocol === "loading" ? loadingDays : 28;

        return {
          primary: {
            label: protocol === "loading" ? "Loading Dose" : "Daily Dose",
            value: protocol === "loading" ? `${formatNumber(loadingDose, 1)} g/day` : `${formatNumber(maintenanceDose, 1)} g/day`,
          },
          details: [
            ...(protocol === "loading"
              ? [
                  { label: "Loading Phase", value: `${formatNumber(loadingDose, 1)} g/day for ${loadingDays} days` },
                  { label: "Per Dose (4x daily)", value: `${formatNumber(loadingPerDose, 1)} g` },
                  { label: "Total Loading Creatine", value: `${formatNumber(totalLoadingGrams, 0)} g` },
                ]
              : []),
            { label: "Maintenance Dose", value: `${formatNumber(maintenanceDose, 1)} g/day` },
            { label: "Body Weight", value: `${formatNumber(weightKg, 1)} kg` },
            { label: "Time to Full Saturation", value: `~${formatNumber(saturationDays, 0)} days` },
            { label: "Scoops (~5g each)", value: formatNumber(maintenanceDose / 5, 1) },
          ],
          note: "Creatine monohydrate is the most studied and cost-effective form. Take with water (at least 8 oz). Loading phase is optional -- standard dosing reaches the same saturation in ~4 weeks. No cycling is necessary.",
        };
      },
    },
    {
      id: "supply",
      name: "Supply Calculator",
      description: "Calculate how long your creatine supply will last",
      fields: [
        {
          name: "containerSize",
          label: "Container Size",
          type: "number",
          placeholder: "e.g. 500",
          suffix: "grams",
          min: 50,
          max: 5000,
        },
        {
          name: "dailyDose",
          label: "Daily Dose",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "grams",
          min: 1,
          max: 30,
          defaultValue: 5,
        },
        {
          name: "costPerContainer",
          label: "Cost Per Container",
          type: "number",
          placeholder: "e.g. 30",
          prefix: "$",
          min: 1,
          max: 200,
        },
      ],
      calculate: (inputs) => {
        const containerSize = parseFloat(inputs.containerSize as string);
        const dailyDose = parseFloat(inputs.dailyDose as string);
        const cost = parseFloat(inputs.costPerContainer as string);
        if (!containerSize || !dailyDose) return null;

        const daysSupply = containerSize / dailyDose;
        const monthsSupply = daysSupply / 30;
        const costPerDay = cost ? cost / daysSupply : 0;
        const costPerMonth = costPerDay * 30;
        const costPerServing = cost ? cost / (containerSize / dailyDose) : 0;

        return {
          primary: { label: "Days of Supply", value: formatNumber(daysSupply, 0) },
          details: [
            { label: "Months of Supply", value: formatNumber(monthsSupply, 1) },
            { label: "Servings", value: formatNumber(containerSize / dailyDose, 0) },
            { label: "Cost Per Day", value: cost ? `$${formatNumber(costPerDay, 2)}` : "N/A" },
            { label: "Cost Per Month", value: cost ? `$${formatNumber(costPerMonth, 2)}` : "N/A" },
            { label: "Cost Per Serving", value: cost ? `$${formatNumber(costPerServing, 2)}` : "N/A" },
          ],
          note: "Creatine monohydrate is one of the most affordable and effective supplements. Store in a cool, dry place. Micronized forms dissolve more easily in water.",
        };
      },
    },
  ],
  relatedSlugs: ["protein-calculator", "calorie-calculator", "macro-calculator"],
  faq: [
    {
      question: "Do I need a creatine loading phase?",
      answer:
        "No, loading is optional. A loading phase (20g/day for 5-7 days) saturates muscles faster, but taking 3-5g daily reaches the same saturation level in about 3-4 weeks. Loading may cause temporary water retention and digestive discomfort.",
    },
    {
      question: "How much creatine should I take daily?",
      answer:
        "The standard maintenance dose is 3-5g per day (or about 0.03g per kg of body weight). Research shows no additional benefit from higher doses once muscles are saturated. Larger individuals (over 200 lbs) may benefit from 5g daily.",
    },
    {
      question: "When should I take creatine?",
      answer:
        "Timing is less important than consistency. Some research suggests a slight advantage to taking creatine post-workout with a protein/carb meal for better absorption. The most important factor is taking it daily. Creatine can be taken at any time of day.",
    },
  ],
  formula:
    "Loading Dose = Body Weight (kg) x 0.3 g/day (split into 4 doses) | Maintenance = Body Weight (kg) x 0.03 g/day (min 3g)",
};
