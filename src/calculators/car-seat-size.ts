import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carSeatSizeCalculator: CalculatorDefinition = {
  slug: "car-seat-size-calculator",
  title: "Car Seat Size Calculator",
  description:
    "Free car seat size calculator. Find the right car seat type for your child based on age, weight, and height using AAP safety guidelines.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "car seat size",
    "car seat calculator",
    "car seat by age",
    "car seat by weight",
    "when to change car seat",
  ],
  variants: [
    {
      id: "car-seat",
      name: "Find the Right Car Seat",
      description: "Determine which car seat type your child needs",
      fields: [
        {
          name: "ageMonths",
          label: "Child's Age (months)",
          type: "number",
          placeholder: "e.g. 18",
          min: 0,
          max: 144,
        },
        {
          name: "weight",
          label: "Child's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 25",
          min: 4,
          max: 120,
        },
        {
          name: "height",
          label: "Child's Height (inches)",
          type: "number",
          placeholder: "e.g. 32",
          min: 17,
          max: 65,
        },
      ],
      calculate: (inputs) => {
        const ageMonths = inputs.ageMonths as number;
        const weightLbs = inputs.weight as number;
        const heightIn = inputs.height as number;
        if (!ageMonths && ageMonths !== 0) return null;
        if (!weightLbs || !heightIn) return null;

        let seatType: string;
        let facing: string;
        let details: string;
        let nextTransition: string;
        let safetyTip: string;

        if (weightLbs < 4 || ageMonths === 0) {
          seatType = "Infant Car Seat (Rear-Facing)";
          facing = "Rear-Facing";
          details = "Use a rear-facing only seat or the rear-facing mode of a convertible seat. Harness straps at or below shoulders.";
          nextTransition = "Continue rear-facing until at least age 2 or until reaching the seat's weight/height limit.";
          safetyTip = "The safest position is the center of the back seat.";
        } else if (ageMonths < 24 || weightLbs < 30) {
          seatType = "Rear-Facing Car Seat";
          facing = "Rear-Facing";
          details = "Keep rear-facing as long as possible. Most convertible seats allow rear-facing up to 40-50 lbs.";
          nextTransition = `At age 2+ AND when exceeding the rear-facing weight/height limit of your seat, switch to forward-facing.`;
          safetyTip = "Rear-facing is 5x safer for toddlers. Keep rear-facing until the seat's limits are reached.";
        } else if (ageMonths < 60 || weightLbs < 40) {
          seatType = "Forward-Facing Car Seat with Harness";
          facing = "Forward-Facing with 5-Point Harness";
          details = "Use a forward-facing seat with a 5-point harness. Top tether should always be attached. Harness straps at or above shoulders.";
          nextTransition = "When child exceeds the harness weight/height limit (typically 65 lbs), transition to a booster seat.";
          safetyTip = "Keep in the harness as long as possible before moving to a booster.";
        } else if (ageMonths < 96 || weightLbs < 80 || heightIn < 57) {
          seatType = "Booster Seat";
          facing = "Forward-Facing Booster";
          details = "Use a high-back or backless booster with the vehicle's lap-and-shoulder belt. Belt should lie flat across upper thighs and chest.";
          nextTransition = "When the child passes the 5-step seat belt fit test (typically 4'9\" tall, 8-12 years old).";
          safetyTip = "The shoulder belt should cross the center of the chest and shoulder, never the neck or face.";
        } else {
          seatType = "Seat Belt (No Booster Needed)";
          facing = "Forward-Facing with Seat Belt";
          details = "Child can safely use the vehicle seat belt. The lap belt should lie flat across upper thighs, shoulder belt across chest and shoulder.";
          nextTransition = "Children under 13 should ride in the back seat.";
          safetyTip = "Even without a booster, all children under 13 are safest in the back seat.";
        }

        return {
          primary: {
            label: "Recommended Seat",
            value: seatType,
          },
          details: [
            { label: "Facing Direction", value: facing },
            { label: "Details", value: details },
            { label: "Next Transition", value: nextTransition },
            { label: "Child's Age", value: ageMonths < 12 ? `${ageMonths} months` : `${formatNumber(ageMonths / 12, 1)} years` },
            { label: "Child's Weight", value: `${formatNumber(weightLbs, 0)} lbs` },
            { label: "Child's Height", value: `${formatNumber(heightIn, 0)} inches (${formatNumber(heightIn * 2.54, 0)} cm)` },
            { label: "Safety Tip", value: safetyTip },
          ],
          note: "Car seat laws vary by state. These recommendations follow AAP guidelines. Always check your specific car seat's weight and height limits, as they vary by manufacturer. Register your car seat with the manufacturer for recall notices.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-weight-percentile-calculator", "baby-height-percentile-calculator", "stroller-age-calculator"],
  faq: [
    {
      question: "When can my child face forward in the car?",
      answer:
        "The AAP recommends keeping children rear-facing until at least age 2, or until they reach the maximum weight or height limit of their rear-facing car seat. Many convertible seats allow rear-facing up to 40-50 lbs. Rear-facing is significantly safer in crashes.",
    },
    {
      question: "When can my child stop using a booster seat?",
      answer:
        "Children can stop using a booster when they pass the 5-step seat belt fit test: 1) back against seat back, 2) knees bend at seat edge, 3) lap belt across upper thighs, 4) shoulder belt across chest/shoulder, 5) child can maintain position for entire trip. This typically happens around 4'9\" tall and 8-12 years old.",
    },
    {
      question: "How do I know if my car seat is installed correctly?",
      answer:
        "A correctly installed car seat should not move more than 1 inch side-to-side or front-to-back at the belt path. The harness should be snug (can't pinch excess webbing at the shoulder). Many fire stations and hospitals offer free car seat inspections.",
    },
  ],
  formula:
    "Car seat type determined by AAP guidelines based on age, weight, and height: Rear-facing (birth to 2+ years), Forward-facing with harness (2-5 years, 30-65 lbs), Booster (5-8 years, 40-80 lbs), Seat belt (8+ years, 4'9\"+).",
};
