import type { CalculatorDefinition } from "./types";

export const babyFoodIntroCalculator: CalculatorDefinition = {
  slug: "baby-food-intro-calculator",
  title: "Baby Food Introduction Timeline",
  description:
    "Free baby food introduction timeline calculator. Determine when to start solids and which foods to introduce at each stage based on your baby's age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby food introduction",
    "when to start solids",
    "baby first foods",
    "solid food timeline",
    "baby feeding stages",
  ],
  variants: [
    {
      id: "timeline",
      name: "Food Introduction Timeline",
      description: "See what foods are appropriate for your baby's age",
      fields: [
        {
          name: "ageMonths",
          label: "Baby Age (months)",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
          max: 24,
        },
        {
          name: "readiness",
          label: "Readiness Signs",
          type: "select",
          options: [
            { label: "Can hold head up well", value: "head" },
            { label: "Sits with support + shows interest", value: "sitting" },
            { label: "Sits independently + reaches for food", value: "ready" },
            { label: "Not sure", value: "unsure" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.ageMonths as number;
        const readiness = inputs.readiness as string;
        if (age === undefined || !readiness) return null;

        let stage = "";
        let recommendedFoods = "";
        let texture = "";
        let frequency = "";
        let allergens = "";

        if (age < 4) {
          stage = "Breast Milk/Formula Only";
          recommendedFoods = "No solids yet - breast milk or formula exclusively";
          texture = "Liquid only";
          frequency = "On demand, 8-12 times daily";
          allergens = "N/A";
        } else if (age < 6) {
          stage = "Pre-Solids (wait for readiness signs)";
          recommendedFoods = "Most pediatricians recommend waiting until 6 months. Some start at 4-5 months with doctor approval.";
          texture = "If starting: very thin purees only";
          frequency = "1 meal/day, 1-2 tsp to start";
          allergens = "Consult pediatrician before starting early";
        } else if (age < 8) {
          stage = "Stage 1 - First Foods (6-7 months)";
          recommendedFoods = "Single-ingredient purees: sweet potato, avocado, banana, rice cereal, oat cereal, peas, green beans, squash";
          texture = "Smooth, thin purees";
          frequency = "1-2 meals/day, 2-4 tbsp per meal";
          allergens = "Can introduce top allergens one at a time (peanut butter thinned, egg, dairy)";
        } else if (age < 10) {
          stage = "Stage 2 - Expanding Foods (8-9 months)";
          recommendedFoods = "Combo purees, soft fruits (peach, pear, mango), proteins (chicken, turkey, fish, beans, lentils), yogurt, cheese";
          texture = "Thicker purees, mashed, soft finger foods";
          frequency = "2-3 meals/day, 4-6 tbsp per meal";
          allergens = "Continue introducing allergens. Offer previously introduced ones regularly.";
        } else if (age < 12) {
          stage = "Stage 3 - Advancing Textures (10-11 months)";
          recommendedFoods = "Most table foods in small pieces: pasta, soft cooked veggies, soft fruits, ground meats, eggs, toast strips";
          texture = "Chopped, diced, soft finger foods";
          frequency = "3 meals + 1-2 snacks, breast milk/formula still primary";
          allergens = "Most allergens should be introduced by now";
        } else {
          stage = "Toddler Foods (12+ months)";
          recommendedFoods = "Most family foods: whole milk (can switch from formula), meats, fruits, veggies, grains, cheese, eggs. Avoid honey before 12 months.";
          texture = "Table food, chopped small";
          frequency = "3 meals + 2 snacks daily";
          allergens = "Whole cow's milk now OK. Honey now safe. Continue offering variety.";
        }

        const readinessStatus =
          readiness === "ready"
            ? "Shows strong readiness signs"
            : readiness === "sitting"
            ? "Shows good readiness signs"
            : readiness === "head"
            ? "Developing - may need more time"
            : "Observe for readiness signs";

        return {
          primary: { label: "Current Stage", value: stage },
          details: [
            { label: "Recommended foods", value: recommendedFoods },
            { label: "Texture", value: texture },
            { label: "Frequency", value: frequency },
            { label: "Allergen guidance", value: allergens },
            { label: "Readiness assessment", value: readinessStatus },
          ],
          note: "Always introduce one new food at a time and wait 3-5 days before the next to watch for allergies. Never give honey before 12 months. Consult your pediatrician.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-bottle-amount-calculator", "baby-growth-calculator"],
  faq: [
    {
      question: "When should I start giving my baby solid foods?",
      answer:
        "Most pediatricians recommend starting solids around 6 months, when baby can sit with support, has good head control, and shows interest in food. Some may recommend starting between 4-6 months.",
    },
    {
      question: "What foods should I avoid giving my baby?",
      answer:
        "Avoid honey before 12 months (botulism risk), whole nuts and large chunks (choking hazard), cow's milk as a drink before 12 months, added salt and sugar, and unpasteurized foods. Always cut foods into small pieces.",
    },
  ],
  formula:
    "Stage 1 (6-7 mo): thin purees, 1-2 meals/day. Stage 2 (8-9 mo): thicker purees + soft foods, 2-3 meals/day. Stage 3 (10-11 mo): finger foods, 3 meals. 12+ mo: table foods, 3 meals + 2 snacks.",
};
