import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const collagenIntakeCalculator: CalculatorDefinition = {
  slug: "collagen-intake-calculator",
  title: "Collagen Peptide Dosage Calculator",
  description:
    "Calculate your optimal daily collagen peptide intake based on goals, age, and body weight. Covers skin health, joint support, bone density, and athletic recovery.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "collagen dosage calculator",
    "collagen peptide dose",
    "how much collagen",
    "collagen supplement dosage",
    "collagen for skin",
    "collagen for joints",
  ],
  variants: [
    {
      id: "byGoal",
      name: "Dosage by Goal",
      description: "Calculate collagen dose based on your primary health goal",
      fields: [
        {
          name: "goal",
          label: "Primary Goal",
          type: "select",
          options: [
            { label: "Skin health & anti-aging", value: "skin" },
            { label: "Joint support & pain relief", value: "joints" },
            { label: "Bone density support", value: "bones" },
            { label: "Gut health", value: "gut" },
            { label: "Athletic recovery / tendons", value: "athletic" },
            { label: "Hair & nail growth", value: "hair" },
          ],
          defaultValue: "skin",
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "years",
          min: 18,
          max: 100,
        },
        {
          name: "bodyWeight",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 150",
          suffix: "lbs",
          min: 80,
          max: 400,
        },
        {
          name: "collagenType",
          label: "Collagen Type",
          type: "select",
          options: [
            { label: "Type I & III (skin, bones)", value: "type1_3" },
            { label: "Type II (joints, cartilage)", value: "type2" },
            { label: "Multi-type blend", value: "multi" },
          ],
          defaultValue: "type1_3",
        },
      ],
      calculate: (inputs) => {
        const goal = inputs.goal as string;
        const age = parseFloat(inputs.age as string);
        const weight = parseFloat(inputs.bodyWeight as string);
        const collagenType = inputs.collagenType as string;
        if (!age || !weight) return null;

        // Evidence-based dosages by goal (grams/day)
        const baseDoses: Record<string, number> = {
          skin: 10, joints: 10, bones: 12, gut: 10, athletic: 15, hair: 8,
        };

        const recommendedTypes: Record<string, string> = {
          skin: "Type I & III",
          joints: "Type II (or UC-II 40mg)",
          bones: "Type I & III",
          gut: "Type I & III",
          athletic: "Type I & III",
          hair: "Type I & III",
        };

        let dose = baseDoses[goal] || 10;

        // Age adjustment: after 40, collagen production drops ~1%/year
        if (age > 40) {
          dose += Math.min(5, (age - 40) * 0.1);
        }

        // Weight adjustment for larger individuals
        const weightKg = weight * 0.4536;
        if (weightKg > 80) {
          dose += (weightKg - 80) * 0.05;
        }

        dose = Math.round(dose * 10) / 10;

        // Vitamin C enhances absorption
        const vitaminC = 100; // mg, recommended co-factor

        // Timeline for expected results
        const timelines: Record<string, string> = {
          skin: "4-12 weeks", joints: "3-6 months", bones: "6-12 months",
          gut: "4-8 weeks", athletic: "3-6 months", hair: "3-6 months",
        };

        return {
          primary: { label: "Daily Collagen Dose", value: `${formatNumber(dose, 1)} g` },
          details: [
            { label: "Recommended Type", value: recommendedTypes[goal] || "Type I & III" },
            { label: "Typical Scoops (~10g each)", value: formatNumber(dose / 10, 1) },
            { label: "Vitamin C (co-factor)", value: `${formatNumber(vitaminC, 0)} mg/day` },
            { label: "Expected Results Timeline", value: timelines[goal] || "4-12 weeks" },
            { label: "Best Time to Take", value: "Morning on empty stomach or with vitamin C" },
          ],
          note: "Collagen peptides (hydrolyzed) are better absorbed than gelatin. Take with vitamin C to support collagen synthesis. Results require consistent daily use. Collagen from bovine, marine, or chicken sources all have evidence of benefit.",
        };
      },
    },
  ],
  relatedSlugs: ["protein-calculator", "creatine-dosage-calculator", "supplement-timing-calculator"],
  faq: [
    {
      question: "How much collagen should I take daily?",
      answer:
        "Research supports 5-15g of hydrolyzed collagen peptides daily. For skin health, 5-10g is effective. For joint support, 10g or UC-II (undenatured Type II) at 40mg. For bone support, 10-15g. Larger individuals and those over 40 may benefit from higher doses.",
    },
    {
      question: "When is the best time to take collagen?",
      answer:
        "Collagen can be taken any time, but many experts suggest on an empty stomach (morning) or 30-60 minutes before exercise for tendon/joint benefits. Taking it with vitamin C (50-100mg) enhances collagen synthesis. Avoid taking with high-protein meals that may compete for absorption.",
    },
    {
      question: "How long does it take for collagen to work?",
      answer:
        "Skin improvements (hydration, elasticity) typically appear within 4-12 weeks. Joint pain relief may take 3-6 months. Nail and hair improvements take 3-6 months. Bone density benefits require 6-12+ months of consistent use. Consistency is key.",
    },
  ],
  formula:
    "Daily Dose = Base Dose (by goal) + Age Adjustment + Weight Adjustment | Age Adj = max(0, (Age - 40) x 0.1g)",
};
