import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyFeedingScheduleCalculator: CalculatorDefinition = {
  slug: "baby-feeding-schedule-calculator",
  title: "Baby Feeding Schedule Calculator",
  description:
    "Free baby feeding schedule calculator. Get age-appropriate feeding schedules including milk, solids, and snack recommendations by age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby feeding schedule",
    "infant feeding chart",
    "when to start solids",
    "baby eating schedule",
    "feeding guide by age",
  ],
  variants: [
    {
      id: "feeding-schedule",
      name: "Feeding Schedule by Age",
      description: "Get personalized feeding recommendations",
      fields: [
        {
          name: "ageMonths",
          label: "Baby's Age (months)",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
          max: 24,
        },
        {
          name: "feedingType",
          label: "Primary Feeding",
          type: "select",
          options: [
            { label: "Breastfed", value: "breast" },
            { label: "Formula-fed", value: "formula" },
            { label: "Combination", value: "combo" },
          ],
          defaultValue: "breast",
        },
        {
          name: "weight",
          label: "Baby's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 16",
          min: 5,
          max: 35,
        },
      ],
      calculate: (inputs) => {
        const ageMonths = inputs.ageMonths as number;
        const feedingType = inputs.feedingType as string;
        const weightLbs = inputs.weight as number;
        if (ageMonths === undefined || ageMonths === null) return null;
        if (!weightLbs) return null;

        let milkFeedings: number;
        let milkPerFeeding: string;
        let solidMeals: number;
        let solidDetails: string;
        let snacks: number;
        let totalMilkOz: number;

        if (ageMonths < 4) {
          milkFeedings = ageMonths < 1 ? 8 : 7;
          totalMilkOz = feedingType === "breast" ? 25 : Math.min(weightLbs * 2.5, 32);
          milkPerFeeding = `${formatNumber(totalMilkOz / milkFeedings, 1)} oz`;
          solidMeals = 0;
          solidDetails = "Milk only - no solids until 4-6 months";
          snacks = 0;
        } else if (ageMonths < 6) {
          milkFeedings = 6;
          totalMilkOz = feedingType === "breast" ? 25 : Math.min(weightLbs * 2.5, 32);
          milkPerFeeding = `${formatNumber(totalMilkOz / milkFeedings, 1)} oz`;
          solidMeals = 1;
          solidDetails = "1-2 tbsp single-grain cereal or pureed vegetable/fruit";
          snacks = 0;
        } else if (ageMonths < 9) {
          milkFeedings = 5;
          totalMilkOz = feedingType === "breast" ? 24 : 28;
          milkPerFeeding = `${formatNumber(totalMilkOz / milkFeedings, 1)} oz`;
          solidMeals = 2;
          solidDetails = "2-4 tbsp each of cereal, fruit, vegetable, protein per meal";
          snacks = 0;
        } else if (ageMonths < 12) {
          milkFeedings = 4;
          totalMilkOz = feedingType === "breast" ? 20 : 24;
          milkPerFeeding = `${formatNumber(totalMilkOz / milkFeedings, 1)} oz`;
          solidMeals = 3;
          solidDetails = "Soft finger foods, mashed or chopped table foods, 3-4 tbsp per food group";
          snacks = 1;
        } else {
          milkFeedings = 3;
          totalMilkOz = 16;
          milkPerFeeding = `${formatNumber(totalMilkOz / milkFeedings, 1)} oz (whole milk after 12mo)`;
          solidMeals = 3;
          solidDetails = "Table foods cut into small pieces, variety from all food groups";
          snacks = 2;
        }

        const feedingLabel = feedingType === "breast" ? "Breast milk" : feedingType === "formula" ? "Formula" : "Breast milk/Formula";

        return {
          primary: {
            label: "Daily Milk Intake",
            value: `${formatNumber(totalMilkOz, 0)} oz/day`,
          },
          details: [
            { label: `${feedingLabel} Feedings`, value: `${milkFeedings} per day (${milkPerFeeding} each)` },
            { label: "Solid Meals", value: `${solidMeals} per day` },
            { label: "Solid Food Details", value: solidDetails },
            { label: "Snacks", value: snacks > 0 ? `${snacks} per day` : "Not yet needed" },
            { label: "Hours Between Milk Feeds", value: `~${formatNumber(24 / milkFeedings, 1)} hours` },
            { label: "Total Daily Milk", value: `${formatNumber(totalMilkOz, 0)} oz (${formatNumber(totalMilkOz * 29.574, 0)} ml)` },
          ],
          note: "Solid foods should be introduced around 4-6 months when baby shows readiness signs: good head control, sitting with support, showing interest in food, and loss of tongue-thrust reflex. Always introduce new foods one at a time, 3-5 days apart.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-formula-calculator", "breast-milk-intake-calculator", "baby-sleep-schedule-calculator"],
  faq: [
    {
      question: "When should I start solid foods?",
      answer:
        "The AAP recommends introducing solid foods around 6 months, though some babies may be ready between 4-6 months. Readiness signs include: sitting with minimal support, good head and neck control, showing interest in food, reaching for food, and opening mouth when food is offered.",
    },
    {
      question: "What foods should baby eat first?",
      answer:
        "Traditional first foods include iron-fortified single-grain cereal (rice or oat), pureed sweet potato, banana, avocado, or peas. Recent research shows no specific order is required, and introducing allergenic foods (peanut, egg, milk) early (around 6 months) may actually reduce allergy risk.",
    },
    {
      question: "How do I know if my baby is eating enough?",
      answer:
        "Signs of adequate intake include: steady weight gain along their growth curve, 6+ wet diapers per day, satisfied between feedings, meeting developmental milestones, and active/alert behavior. Your pediatrician monitors growth at well-child visits.",
    },
  ],
  formula:
    "Milk: 0-6mo ≈ 25 oz/day (breast) or weight × 2.5 oz (formula, max 32 oz) | 6-12mo: gradually decreases as solids increase | 12mo+: 16 oz whole milk/day. Solids: 0 meals (0-4mo), 1 meal (4-6mo), 2 meals (6-9mo), 3 meals + snacks (9mo+).",
};
