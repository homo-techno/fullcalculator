import type { CalculatorDefinition } from "./types";

export const carSeatAgeCalculator: CalculatorDefinition = {
  slug: "car-seat-age-calculator",
  title: "Car Seat Age/Weight Guide",
  description:
    "Free car seat guide calculator. Determine the right car seat type for your child based on age, weight, and height following AAP safety guidelines.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "car seat age",
    "car seat weight",
    "car seat guide",
    "child car seat",
    "rear facing car seat",
  ],
  variants: [
    {
      id: "guide",
      name: "Car Seat Recommendation",
      description: "Get the right car seat type for your child",
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
          name: "weightLbs",
          label: "Child's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 25",
          min: 3,
          max: 120,
        },
        {
          name: "heightIn",
          label: "Child's Height (inches)",
          type: "number",
          placeholder: "e.g. 32",
          min: 15,
          max: 60,
        },
      ],
      calculate: (inputs) => {
        const age = inputs.ageMonths as number;
        const weight = inputs.weightLbs as number;
        const height = inputs.heightIn as number;
        if (!age || !weight || !height) return null;

        let seatType = "";
        let facing = "";
        let guidelines = "";
        let nextStage = "";

        // AAP Guidelines (2023+)
        if (age < 12 || weight < 20) {
          seatType = "Infant Car Seat (Rear-Facing Only)";
          facing = "Rear-facing";
          guidelines =
            "All infants should ride rear-facing. Keep rear-facing as long as possible.";
          nextStage = "Continue rear-facing until at least age 2 and max weight/height of the seat";
        } else if (age <= 48 && weight <= 40 && height <= 40) {
          seatType = "Convertible Car Seat (Rear-Facing)";
          facing = "Rear-facing (recommended)";
          guidelines =
            "AAP recommends rear-facing as long as possible, ideally until the child outgrows the rear-facing limits of the seat.";
          nextStage = "Switch to forward-facing with harness when exceeding rear-facing limits";
        } else if (age <= 84 && weight <= 65) {
          seatType = "Forward-Facing Car Seat with Harness";
          facing = "Forward-facing";
          guidelines =
            "Use a forward-facing car seat with a 5-point harness. Keep in harness seat until reaching the maximum weight/height.";
          nextStage = `Switch to booster seat when exceeding ${weight > 40 ? "harness weight limit" : "65 lbs or seat max"}`;
        } else if (age <= 144 && weight <= 100 && height < 57) {
          seatType = "Booster Seat (Belt-Positioning)";
          facing = "Forward-facing";
          guidelines =
            "Booster seats position the vehicle's seat belt correctly on the child. The lap belt should lie across the upper thighs, shoulder belt across the chest.";
          nextStage = "Graduate to seat belt alone when 4'9\" (57\") tall, typically ages 8-12";
        } else {
          seatType = "Vehicle Seat Belt";
          facing = "Forward-facing";
          guidelines =
            "Child may be ready for seat belt alone. The belt should fit properly: lap belt across upper thighs, shoulder belt across chest and shoulder.";
          nextStage = "Continue in back seat until age 13";
        }

        const backSeatAge = age < 156 ? "Yes - back seat until age 13" : "Front seat may be appropriate";

        return {
          primary: { label: "Recommended Seat Type", value: seatType },
          details: [
            { label: "Facing direction", value: facing },
            { label: "Guidelines", value: guidelines },
            { label: "Next stage", value: nextStage },
            { label: "Back seat required?", value: backSeatAge },
            { label: "Child stats", value: `${age} mo, ${weight} lbs, ${height}"` },
          ],
          note: "Always follow your specific car seat's weight and height limits. These are general AAP guidelines. Never use an expired or recalled car seat.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-growth-calculator", "toddler-height-predictor"],
  faq: [
    {
      question: "How long should a child be rear-facing?",
      answer:
        "The AAP recommends keeping children rear-facing as long as possible, until they reach the maximum weight or height limit of their rear-facing car seat. Many convertible seats allow rear-facing up to 40-50 lbs.",
    },
    {
      question: "When can my child switch to a booster seat?",
      answer:
        "Children can move to a booster seat when they outgrow the forward-facing harness seat (usually 40-65 lbs depending on the seat). They should stay in a booster until the vehicle seat belt fits properly, typically at 4'9\" tall.",
    },
  ],
  formula:
    "AAP Guidelines: Rear-facing as long as possible (at least age 2), forward-facing with harness to 40-65 lbs, booster to 4'9\" (57\"), seat belt after 4'9\" tall. Back seat until age 13.",
};
