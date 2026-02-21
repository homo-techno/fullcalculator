import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vitaminDCalculator: CalculatorDefinition = {
  slug: "vitamin-d-calculator",
  title: "Vitamin D Calculator",
  description:
    "Free vitamin D intake calculator. Get personalized daily vitamin D recommendations based on your age, current levels, and sun exposure. Know your IU target.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "vitamin d calculator",
    "vitamin d intake calculator",
    "how much vitamin d",
    "vitamin d dosage calculator",
    "vitamin d recommendation",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Vitamin D Needs",
      description: "Get your recommended daily vitamin D intake",
      fields: [
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 35" },
        {
          name: "level",
          label: "Current Vitamin D Status",
          type: "select",
          options: [
            { label: "Deficient (< 20 ng/mL)", value: "deficient" },
            { label: "Insufficient (20-29 ng/mL)", value: "insufficient" },
            { label: "Sufficient (30-50 ng/mL)", value: "sufficient" },
            { label: "Unknown / Not tested", value: "unknown" },
          ],
          defaultValue: "unknown",
        },
        {
          name: "sun",
          label: "Sun Exposure",
          type: "select",
          options: [
            { label: "Minimal (indoors most of the day)", value: "minimal" },
            { label: "Low (< 15 min/day outdoors)", value: "low" },
            { label: "Moderate (15-30 min/day outdoors)", value: "moderate" },
            { label: "High (30+ min/day outdoors)", value: "high" },
          ],
          defaultValue: "low",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const level = inputs.level as string;
        const sun = inputs.sun as string;
        if (!age) return null;

        let baseIU: number;
        if (age < 1) baseIU = 400;
        else if (age <= 18) baseIU = 600;
        else if (age <= 70) baseIU = 600;
        else baseIU = 800;

        let adjustedIU = baseIU;

        if (level === "deficient") {
          adjustedIU = Math.max(adjustedIU, 2000);
          if (age > 18) adjustedIU = Math.min(4000, Math.max(adjustedIU, 4000));
        } else if (level === "insufficient") {
          adjustedIU = Math.max(adjustedIU, 1000);
          if (age > 18) adjustedIU = Math.min(4000, Math.max(adjustedIU, 2000));
        }

        if (sun === "minimal") adjustedIU = Math.max(adjustedIU, adjustedIU * 1.25);
        else if (sun === "low") adjustedIU = Math.max(adjustedIU, adjustedIU * 1.1);
        else if (sun === "high") adjustedIU = Math.max(baseIU, adjustedIU * 0.9);

        adjustedIU = Math.round(adjustedIU / 100) * 100;

        const upperLimit = age <= 18 ? 4000 : 4000;

        let statusNote: string;
        if (level === "deficient") statusNote = "Your level is deficient. Higher supplementation is recommended. Retest in 8-12 weeks.";
        else if (level === "insufficient") statusNote = "Your level is low. Moderate supplementation can help bring it to optimal range.";
        else if (level === "sufficient") statusNote = "Your level is in the healthy range. Maintain with standard supplementation.";
        else statusNote = "Consider getting a blood test (25-hydroxyvitamin D) to know your actual level.";

        return {
          primary: { label: "Recommended Daily Intake", value: `${formatNumber(adjustedIU, 0)} IU` },
          details: [
            { label: "RDA (standard)", value: `${baseIU} IU` },
            { label: "Your Recommendation", value: `${formatNumber(adjustedIU, 0)} IU` },
            { label: "Tolerable Upper Limit", value: `${upperLimit} IU` },
            { label: "Status", value: statusNote },
            { label: "Optimal Blood Level", value: "30-50 ng/mL (75-125 nmol/L)" },
          ],
          note: "These are general guidelines. Consult your healthcare provider for personalized advice, especially if deficient. Vitamin D3 (cholecalciferol) is preferred over D2.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "iron-intake-calculator", "fiber-intake-calculator"],
  faq: [
    {
      question: "How much vitamin D do I need daily?",
      answer:
        "The RDA is 600 IU (15 mcg) for ages 1-70 and 800 IU (20 mcg) for adults over 70. Many experts recommend 1,000-2,000 IU daily, especially for those with limited sun exposure. The safe upper limit is 4,000 IU for adults.",
    },
    {
      question: "What are the signs of vitamin D deficiency?",
      answer:
        "Common symptoms include fatigue, bone pain, muscle weakness, mood changes (depression), frequent infections, slow wound healing, and hair loss. Many people are deficient without obvious symptoms. A blood test is the only way to know for sure.",
    },
    {
      question: "Can I get enough vitamin D from the sun?",
      answer:
        "10-30 minutes of midday sun exposure on arms and legs can produce 10,000-20,000 IU of vitamin D. However, this varies by latitude, season, skin tone, sunscreen use, and cloud cover. People above 37 degrees latitude cannot produce vitamin D from sun in winter months.",
    },
  ],
  formula:
    "RDA: 400 IU (infants), 600 IU (age 1-70), 800 IU (age 70+) | Deficient: up to 4,000 IU | Upper limit: 4,000 IU/day for adults",
};
