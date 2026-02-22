import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogHeatCycleCalculator: CalculatorDefinition = {
  slug: "dog-heat-cycle-calculator",
  title: "Dog Heat Cycle Calculator",
  description:
    "Free dog heat cycle calculator. Predict your female dog's heat cycle timing, fertile windows, and stages based on breed size and cycle history.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog heat cycle calculator",
    "dog estrus cycle",
    "when will my dog go into heat",
    "dog heat schedule",
    "dog breeding cycle calculator",
  ],
  variants: [
    {
      id: "heatCycle",
      name: "Heat Cycle Prediction",
      fields: [
        {
          name: "daysSinceLastHeat",
          label: "Days Since Last Heat Started",
          type: "number",
          placeholder: "e.g. 120",
          min: 0,
          max: 730,
          step: 1,
        },
        {
          name: "sizeCategory",
          label: "Dog Size",
          type: "select",
          options: [
            { label: "Small (under 20 lbs)", value: "small" },
            { label: "Medium (20-50 lbs)", value: "medium" },
            { label: "Large (51-90 lbs)", value: "large" },
            { label: "Giant (over 90 lbs)", value: "giant" },
          ],
        },
        {
          name: "ageYears",
          label: "Dog's Age (years)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0.5,
          max: 15,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const daysSinceLastHeat = inputs.daysSinceLastHeat as number;
        const sizeCategory = (inputs.sizeCategory as string) || "medium";
        const ageYears = inputs.ageYears as number;
        if (daysSinceLastHeat === undefined || daysSinceLastHeat < 0 || !ageYears) return null;

        // Average cycle length (days between start of heats) by size
        const avgCycleDays: Record<string, number> = {
          small: 180,
          medium: 195,
          large: 210,
          giant: 240,
        };

        const cycleDays = avgCycleDays[sizeCategory];
        const daysUntilNextHeat = Math.max(0, cycleDays - daysSinceLastHeat);

        // Heat stages
        const proestrusLength = 9; // days (bleeding, swelling)
        const estrusLength = 9; // days (fertile/receptive)
        const diestrusLength = 60; // days (post-heat, pregnancy or pseudopregnancy)
        const totalHeatVisible = proestrusLength + estrusLength;

        // Current stage
        let currentStage = "";
        if (daysSinceLastHeat <= proestrusLength) {
          currentStage = "Proestrus (pre-heat, bleeding/swelling)";
        } else if (daysSinceLastHeat <= proestrusLength + estrusLength) {
          currentStage = "Estrus (FERTILE - receptive to males)";
        } else if (daysSinceLastHeat <= proestrusLength + estrusLength + diestrusLength) {
          currentStage = "Diestrus (post-heat recovery)";
        } else {
          currentStage = "Anestrus (resting phase)";
        }

        const heatsPerYear = formatNumber(365 / cycleDays, 1);

        return {
          primary: {
            label: "Next Heat In",
            value: daysUntilNextHeat > 0 ? formatNumber(daysUntilNextHeat, 0) + " days" : "May be starting now",
          },
          details: [
            { label: "Current Stage", value: currentStage },
            { label: "Average Cycle Length", value: formatNumber(cycleDays, 0) + " days" },
            { label: "Heats Per Year", value: heatsPerYear },
            { label: "Proestrus (pre-heat)", value: "~" + proestrusLength + " days (bleeding, swelling)" },
            { label: "Estrus (fertile period)", value: "~" + estrusLength + " days (receptive to males)" },
            { label: "Visible Heat Duration", value: "~" + totalHeatVisible + " days" },
            { label: "Days Since Last Heat", value: formatNumber(daysSinceLastHeat, 0) + " days" },
            {
              label: "Important",
              value: "Individual cycles vary. Track your dog's cycles for more accurate predictions. Consult your vet for breeding or spay timing.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-pregnancy-calculator", "dog-life-expectancy-calculator", "dog-age-chart-calculator"],
  faq: [
    {
      question: "How often do dogs go into heat?",
      answer:
        "Most dogs go into heat every 6-8 months (about twice a year). Small breeds may cycle every 4-6 months, while giant breeds like Great Danes may only cycle once every 8-12 months. It can take up to 2 years for a young dog to develop regular cycles.",
    },
    {
      question: "How long does a dog's heat last?",
      answer:
        "The visible heat period (proestrus + estrus) typically lasts 2-3 weeks (about 18 days). Proestrus lasts about 7-10 days with swelling and bleeding, followed by estrus (the fertile period) lasting 5-10 days when the dog is receptive to mating.",
    },
    {
      question: "At what age do dogs first go into heat?",
      answer:
        "Small breeds may have their first heat as early as 4-6 months of age, while large and giant breeds may not have their first heat until 12-24 months. Most medium-sized dogs experience their first heat between 6-12 months of age.",
    },
  ],
  formula:
    "Average cycle length: Small 180 days, Medium 195 days, Large 210 days, Giant 240 days. Days Until Next Heat = Cycle Length - Days Since Last Heat. Heat stages: Proestrus ~9 days, Estrus (fertile) ~9 days, Diestrus ~60 days, Anestrus (rest) remaining days.",
};
