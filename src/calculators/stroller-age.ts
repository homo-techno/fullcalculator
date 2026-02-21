import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const strollerAgeCalculator: CalculatorDefinition = {
  slug: "stroller-age-calculator",
  title: "Stroller Age & Weight Guide Calculator",
  description:
    "Free stroller guide calculator. Find the right stroller type for your child's age, weight, and developmental stage.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "stroller age guide",
    "stroller weight limit",
    "when to stop stroller",
    "stroller size guide",
    "best stroller by age",
  ],
  variants: [
    {
      id: "stroller-guide",
      name: "Stroller Recommendation by Age",
      description: "Find the right stroller type for your child",
      fields: [
        {
          name: "ageMonths",
          label: "Child's Age (months)",
          type: "number",
          placeholder: "e.g. 12",
          min: 0,
          max: 60,
        },
        {
          name: "weight",
          label: "Child's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 22",
          min: 5,
          max: 60,
        },
        {
          name: "usage",
          label: "Primary Usage",
          type: "select",
          options: [
            { label: "Everyday errands", value: "everyday" },
            { label: "Travel/airplane", value: "travel" },
            { label: "Jogging/running", value: "jogging" },
            { label: "Rough terrain/hiking", value: "terrain" },
          ],
          defaultValue: "everyday",
        },
      ],
      calculate: (inputs) => {
        const ageMonths = inputs.ageMonths as number;
        const weightLbs = inputs.weight as number;
        const usage = inputs.usage as string;
        if (ageMonths === undefined || ageMonths === null) return null;
        if (!weightLbs) return null;

        let strollerType: string;
        let features: string;
        let weightLimit: string;
        let developmental: string;

        if (ageMonths < 6) {
          strollerType = "Full-Size Stroller with Bassinet or Infant Car Seat";
          features = "Must fully recline or accept infant car seat. Look for: flat recline, 5-point harness, canopy, storage basket.";
          weightLimit = "Most accommodate up to 50 lbs";
          developmental = "Baby cannot sit up yet. Needs full recline support. Head/neck control developing.";
        } else if (ageMonths < 12) {
          strollerType = "Full-Size or Mid-Size Stroller";
          features = "Adjustable recline, 5-point harness, good suspension. Baby can now sit with support.";
          weightLimit = "Most accommodate up to 50 lbs";
          developmental = "Baby is sitting independently. May be pulling to stand. Enjoys facing forward to explore.";
        } else if (ageMonths < 36) {
          strollerType = "Standard Stroller or Lightweight Stroller";
          features = "Upright seating, adjustable footrest, canopy, cup holder, one-hand fold preferred.";
          weightLimit = "Standard: up to 50 lbs, Lightweight: up to 40 lbs";
          developmental = "Walking independently. May resist stroller but still needs it for longer outings and naps on-the-go.";
        } else {
          strollerType = "Lightweight/Umbrella Stroller or Phase Out";
          features = "Compact fold, lightweight (under 15 lbs), easy to carry. Consider transitioning out of stroller.";
          weightLimit = "Umbrella: up to 40 lbs, Lightweight: up to 50 lbs";
          developmental = "Walking well, building endurance. Use stroller for long days, travel, or when child is tired.";
        }

        // Usage-specific recommendation
        let usageNote: string;
        switch (usage) {
          case "travel":
            usageNote = "Travel: Look for compact fold, under 15 lbs, airline-compatible. Consider travel stroller systems that work with your car seat.";
            break;
          case "jogging":
            usageNote = ageMonths < 6
              ? "Jogging: NOT recommended before 6 months (baby's neck is not strong enough). Wait until 6-8 months minimum."
              : "Jogging: Choose a 3-wheel stroller with fixed front wheel, hand brake, and 5-point harness. Air-filled tires recommended.";
            break;
          case "terrain":
            usageNote = "All-terrain: Look for large air-filled tires, good suspension, sturdy frame. Heavier but handles rough surfaces well.";
            break;
          default:
            usageNote = "Everyday: Balance between weight, features, and fold size. A mid-weight stroller (15-25 lbs) with one-hand fold is ideal.";
        }

        return {
          primary: {
            label: "Recommended Stroller Type",
            value: strollerType,
          },
          details: [
            { label: "Key Features", value: features },
            { label: "Weight Limit", value: weightLimit },
            { label: "Developmental Stage", value: developmental },
            { label: "Usage Recommendation", value: usageNote },
            { label: "Child's Age", value: ageMonths < 12 ? `${ageMonths} months` : `${formatNumber(ageMonths / 12, 1)} years` },
            { label: "Child's Weight", value: `${formatNumber(weightLbs, 0)} lbs` },
          ],
          note: "Most children outgrow the need for a stroller between ages 3-4, but it varies. Strollers remain useful for travel, theme parks, and long outings even for older toddlers. Always check the specific stroller's weight and age limits.",
        };
      },
    },
  ],
  relatedSlugs: ["car-seat-size-calculator", "baby-clothing-size-calculator", "baby-milestone-calculator"],
  faq: [
    {
      question: "When can a baby sit in a stroller without a car seat?",
      answer:
        "Most babies can sit in a stroller without an infant car seat attachment once they have good head and neck control and can sit with minimal support, typically around 6 months. Before that, use a stroller that fully reclines or accepts an infant car seat.",
    },
    {
      question: "When should a child stop using a stroller?",
      answer:
        "Most children stop needing a stroller between ages 3-4, but there is no set rule. If your child can walk long distances without fatigue and you are comfortable without it, you can phase it out. Many families keep a lightweight stroller for travel and special outings until age 4-5.",
    },
    {
      question: "Can I use a jogging stroller as an everyday stroller?",
      answer:
        "Yes, but jogging strollers are heavier and bulkier than standard strollers. They have excellent suspension and handling but may be harder to maneuver in tight spaces like stores. Many families use a jogging stroller for walks/runs and a compact stroller for errands.",
    },
  ],
  formula:
    "Stroller type based on child's age, weight, and developmental milestones. Under 6mo: must recline flat. 6-12mo: sit-up stroller OK. 12-36mo: standard or lightweight. 36mo+: umbrella stroller or phase out.",
};
