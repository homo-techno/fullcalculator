import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roastBeefTimeCalculator: CalculatorDefinition = {
  slug: "roast-beef-time-calculator",
  title: "Roast Beef Cooking Time",
  description:
    "Free roast beef cooking time calculator. Get accurate roasting times for any cut and doneness level based on weight.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "roast beef time",
    "beef roasting time",
    "prime rib time",
    "roast cooking time",
    "beef temperature",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "weight",
          label: "Roast Weight (lbs)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "cut",
          label: "Beef Cut",
          type: "select",
          options: [
            { label: "Prime Rib / Standing Rib", value: "prime_rib" },
            { label: "Tenderloin", value: "tenderloin" },
            { label: "Top Round", value: "top_round" },
            { label: "Chuck Roast", value: "chuck" },
            { label: "Eye of Round", value: "eye_round" },
            { label: "Sirloin Tip", value: "sirloin_tip" },
          ],
        },
        {
          name: "doneness",
          label: "Desired Doneness",
          type: "select",
          options: [
            { label: "Rare (120-125°F)", value: "rare" },
            { label: "Medium Rare (130-135°F)", value: "medium_rare" },
            { label: "Medium (140-145°F)", value: "medium" },
            { label: "Medium Well (150-155°F)", value: "medium_well" },
            { label: "Well Done (160°F+)", value: "well_done" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const cut = inputs.cut as string;
        const doneness = inputs.doneness as string;
        if (!weight || weight <= 0) return null;

        const minsPerLb: Record<string, Record<string, number>> = {
          prime_rib: { rare: 12, medium_rare: 14, medium: 16, medium_well: 18, well_done: 22 },
          tenderloin: { rare: 10, medium_rare: 12, medium: 14, medium_well: 16, well_done: 18 },
          top_round: { rare: 14, medium_rare: 16, medium: 18, medium_well: 20, well_done: 24 },
          chuck: { rare: 20, medium_rare: 22, medium: 25, medium_well: 28, well_done: 33 },
          eye_round: { rare: 14, medium_rare: 16, medium: 18, medium_well: 20, well_done: 24 },
          sirloin_tip: { rare: 14, medium_rare: 16, medium: 18, medium_well: 20, well_done: 24 },
        };

        const targetTemps: Record<string, number> = {
          rare: 120,
          medium_rare: 130,
          medium: 140,
          medium_well: 150,
          well_done: 160,
        };

        const rate = (minsPerLb[cut] && minsPerLb[cut][doneness]) || 16;
        const totalMinutes = Math.round(rate * weight);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const targetTemp = targetTemps[doneness] || 135;
        const removeTemp = targetTemp - 5;
        const restTime = weight >= 5 ? 20 : 10;
        const ovenTemp = cut === "prime_rib" || cut === "tenderloin" ? 450 : 325;
        const servings = Math.round(weight * 2.5);

        const ovenNote =
          cut === "prime_rib" || cut === "tenderloin"
            ? "Sear at " + ovenTemp + "°F for 15 min, then reduce to 325°F"
            : "Roast at " + ovenTemp + "°F throughout";

        return {
          primary: {
            label: "Total Cook Time",
            value: hours > 0 ? hours + "h " + mins + "m" : mins + " min",
          },
          details: [
            { label: "Target Internal Temp", value: targetTemp + " °F" },
            { label: "Remove from Oven At", value: removeTemp + " °F" },
            { label: "Oven Method", value: ovenNote },
            { label: "Rest Time", value: restTime + " min (tented with foil)" },
            { label: "Estimated Servings", value: String(servings) },
            { label: "Weight", value: formatNumber(weight, 1) + " lbs" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["meat-cooking-time-calculator", "bbq-cooking-time-calculator"],
  faq: [
    {
      question: "How long do you cook roast beef per pound?",
      answer:
        "At 325°F, plan for approximately 14-16 minutes per pound for medium-rare. Prime rib and tenderloin cook faster at 12-14 minutes per pound. Always use a meat thermometer.",
    },
    {
      question: "What is carryover cooking?",
      answer:
        "Carryover cooking means the internal temperature continues to rise 5-10°F after removing the roast from the oven. Remove the roast 5°F below your target temperature and let it rest.",
    },
  ],
  formula:
    "Cook Time = Weight × Minutes per pound. Remove at target temp minus 5°F for carryover cooking. Rest 10-20 min. Servings = Weight × 2.5 people per pound.",
};
