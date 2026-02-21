import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyFormulaCalculator: CalculatorDefinition = {
  slug: "baby-formula-calculator",
  title: "Baby Formula Calculator",
  description:
    "Free baby formula calculator. Calculate how much formula your baby needs per day based on age and weight. See bottle count, feeding schedule, and scoop amounts.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby formula calculator",
    "infant formula calculator",
    "how much formula",
    "baby bottle calculator",
    "formula feeding calculator",
    "newborn formula amount",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Formula Needs",
      description: "How much formula does your baby need?",
      fields: [
        { name: "ageMonths", label: "Baby Age", type: "number", placeholder: "e.g. 3", suffix: "months", min: 0, max: 12 },
        { name: "weight", label: "Baby Weight", type: "number", placeholder: "e.g. 12", suffix: "lbs" },
      ],
      calculate: (inputs) => {
        const ageMonths = inputs.ageMonths as number;
        const weight = inputs.weight as number;
        if (ageMonths === undefined || ageMonths === null || !weight) return null;

        let ozPerLbPerDay: number;
        let bottleSize: number;
        let feedingsPerDay: number;

        if (ageMonths <= 1) {
          ozPerLbPerDay = 2.5;
          bottleSize = 2;
          feedingsPerDay = 8;
        } else if (ageMonths <= 3) {
          ozPerLbPerDay = 2.5;
          bottleSize = 4;
          feedingsPerDay = 6;
        } else if (ageMonths <= 6) {
          ozPerLbPerDay = 2.5;
          bottleSize = 6;
          feedingsPerDay = 5;
        } else {
          ozPerLbPerDay = 2.0;
          bottleSize = 7;
          feedingsPerDay = 4;
        }

        const dailyOz = Math.min(weight * ozPerLbPerDay, 32);
        const bottlesPerDay = Math.ceil(dailyOz / bottleSize);
        const ozPerBottle = dailyOz / bottlesPerDay;
        const scoopsPerBottle = Math.ceil(ozPerBottle / 2);
        const totalScoops = scoopsPerBottle * bottlesPerDay;
        const waterPerBottle = ozPerBottle;

        return {
          primary: { label: "Daily Formula Needed", value: `${formatNumber(dailyOz, 0)} oz` },
          details: [
            { label: "Bottles Per Day", value: `${bottlesPerDay}` },
            { label: "Ounces Per Bottle", value: `${formatNumber(ozPerBottle, 1)} oz` },
            { label: "Scoops Per Bottle", value: `${scoopsPerBottle} scoops` },
            { label: "Total Scoops/Day", value: `${totalScoops} scoops` },
            { label: "Water Per Bottle", value: `${formatNumber(waterPerBottle, 1)} oz` },
            { label: "Feedings Per Day", value: `${feedingsPerDay}` },
          ],
          note: "General guideline: 2.5 oz per pound of body weight per day for 0-6 months, decreasing as solids are introduced. Maximum ~32 oz/day. 1 scoop of formula per 2 oz of water (most brands). Always consult your pediatrician.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "pregnancy-calculator", "due-date-calculator"],
  faq: [
    {
      question: "How much formula does a newborn need?",
      answer:
        "Newborns typically need 2-3 oz of formula every 2-3 hours (about 8 feedings per day). In the first few days, they may only take 1-2 oz per feeding. By 1 month, most babies take 3-4 oz per feeding.",
    },
    {
      question: "How do I know if my baby is getting enough formula?",
      answer:
        "Signs your baby is getting enough: steady weight gain, 6+ wet diapers per day, content between feedings, and meeting growth milestones. Signs of hunger: rooting, sucking motions, fussiness, and crying (a late hunger cue).",
    },
    {
      question: "Can you overfeed a formula-fed baby?",
      answer:
        "Yes, it is possible to overfeed a formula-fed baby. Watch for cues that your baby is full: turning away from the bottle, closing mouth, slowing or stopping sucking. Never force a baby to finish a bottle. The 2.5 oz per pound guideline is a maximum, not a target.",
    },
  ],
  formula:
    "Daily Formula (oz) = Weight (lbs) × 2.5 (for 0-6 months) | Max 32 oz/day | Scoops = Oz of formula / 2 (most brands use 1 scoop per 2 oz water)",
};
