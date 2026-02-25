import type { CalculatorDefinition } from "./types";

export const babyBathTempCalculator: CalculatorDefinition = {
  slug: "baby-bath-temp-calculator",
  title: "Baby Bath Temperature Guide",
  description:
    "Free baby bath temperature guide calculator. Determine safe bath water temperature for your baby based on age and get safety recommendations.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby bath temperature",
    "safe bath temp baby",
    "infant bath water",
    "baby bath guide",
    "newborn bath temp",
  ],
  variants: [
    {
      id: "guide",
      name: "Bath Temperature Guide",
      description: "Get safe bath temperature recommendations for your baby",
      fields: [
        {
          name: "ageMonths",
          label: "Baby Age (months)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 36,
        },
        {
          name: "waterTempF",
          label: "Current Water Temperature (°F)",
          type: "number",
          placeholder: "e.g. 100",
          min: 80,
          max: 120,
        },
        {
          name: "roomTempF",
          label: "Room Temperature (°F)",
          type: "number",
          placeholder: "e.g. 72",
          min: 60,
          max: 90,
        },
      ],
      calculate: (inputs) => {
        const age = inputs.ageMonths as number;
        const waterTemp = inputs.waterTempF as number;
        const roomTemp = inputs.roomTempF as number;
        if (age === undefined || !waterTemp || !roomTemp) return null;

        const idealMinF = 98;
        const idealMaxF = 100;
        const waterTempC = ((waterTemp - 32) * 5) / 9;
        const idealMinC = ((idealMinF - 32) * 5) / 9;
        const idealMaxC = ((idealMaxF - 32) * 5) / 9;

        let safety = "Safe";
        let safetyNote = "Water temperature is within the ideal range.";

        if (waterTemp < 95) {
          safety = "Too Cold";
          safetyNote = "Water is too cold. Baby may get chilled quickly. Warm it up to 98-100°F.";
        } else if (waterTemp < 98) {
          safety = "Slightly Cool";
          safetyNote = "Slightly cool but acceptable for a quick bath. Ideal is 98-100°F.";
        } else if (waterTemp > 104) {
          safety = "DANGEROUS - Too Hot!";
          safetyNote = "This water can scald baby's sensitive skin! Cool it down immediately to 98-100°F.";
        } else if (waterTemp > 100) {
          safety = "Slightly Warm";
          safetyNote = "A bit warm. Let it cool slightly. Risk increases above 104°F.";
        }

        let bathDuration = "5-10 minutes";
        if (age <= 1) bathDuration = "5 minutes (sponge bath recommended)";
        else if (age <= 6) bathDuration = "5-10 minutes";
        else if (age <= 12) bathDuration = "10-15 minutes";
        else bathDuration = "15-20 minutes";

        let frequency = "2-3 times per week";
        if (age <= 1) frequency = "2-3 times per week (sponge baths until cord falls off)";
        else if (age <= 6) frequency = "2-3 times per week";
        else frequency = "3-4 times per week or as needed";

        const roomOk = roomTemp >= 68 && roomTemp <= 75;
        const roomStatus = roomOk
          ? "Good (68-75°F is ideal)"
          : roomTemp < 68
          ? "Too cool - warm the room first"
          : "Warm - ensure good ventilation";

        return {
          primary: { label: "Safety Assessment", value: safety },
          details: [
            { label: "Assessment", value: safetyNote },
            {
              label: "Ideal water temp",
              value: `${idealMinF}-${idealMaxF}°F (${idealMinC.toFixed(1)}-${idealMaxC.toFixed(1)}°C)`,
            },
            {
              label: "Your water temp",
              value: `${waterTemp}°F (${waterTempC.toFixed(1)}°C)`,
            },
            { label: "Room temperature", value: roomStatus },
            { label: "Recommended bath duration", value: bathDuration },
            { label: "Recommended frequency", value: frequency },
          ],
          note: "Always test water with your elbow or a bath thermometer. Never leave baby unattended in water, even for a moment.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-growth-calculator", "baby-sleep-schedule-calculator"],
  faq: [
    {
      question: "What is the ideal bath temperature for a baby?",
      answer:
        "The ideal bath water temperature for babies is 98-100°F (37-38°C), which is close to body temperature. Always test the water with your elbow or a bath thermometer before placing baby in.",
    },
    {
      question: "How often should I bathe my baby?",
      answer:
        "Newborns only need sponge baths 2-3 times a week until the umbilical cord stump falls off. After that, tub baths 2-3 times a week are sufficient. Daily baths can dry out baby's skin.",
    },
  ],
  formula:
    "Safe bath temp: 98-100°F (37-38°C). Below 95°F = too cold, above 104°F = scald risk. Room temp should be 68-75°F.",
};
