import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const allergySeverityCalculator: CalculatorDefinition = {
  slug: "allergy-severity-calculator",
  title: "Allergy Severity Calculator",
  description: "Score your allergy symptoms to assess severity and guide treatment decisions.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["allergy severity", "allergy score", "allergy symptom calculator"],
  variants: [{
    id: "standard",
    name: "Allergy Severity",
    description: "Score your allergy symptoms to assess severity and guide treatment decisions",
    fields: [
      { name: "sneezing", label: "Sneezing Frequency (per day)", type: "number", suffix: "times", min: 0, max: 100, defaultValue: 5 },
      { name: "congestion", label: "Nasal Congestion Severity", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"Mild"},{value:"2",label:"Moderate"},{value:"3",label:"Severe"}], defaultValue: "1" },
      { name: "eyeItch", label: "Eye Itching or Watering", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"Mild"},{value:"2",label:"Moderate"},{value:"3",label:"Severe"}], defaultValue: "1" },
      { name: "impact", label: "Impact on Daily Activities", type: "select", options: [{value:"0",label:"No Impact"},{value:"1",label:"Slight"},{value:"2",label:"Moderate"},{value:"3",label:"Cannot Function Normally"}], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const sneezing = inputs.sneezing as number;
      const congestion = parseInt(inputs.congestion as string) || 0;
      const eyeItch = parseInt(inputs.eyeItch as string) || 0;
      const impact = parseInt(inputs.impact as string) || 0;
      const sneezingScore = sneezing <= 3 ? 1 : sneezing <= 10 ? 2 : 3;
      const total = sneezingScore + congestion + eyeItch + impact;
      const maxScore = 12;
      const pct = Math.round((total / maxScore) * 100);
      const severity = total <= 3 ? "Mild" : total <= 6 ? "Moderate" : total <= 9 ? "Severe" : "Very Severe";
      const treatment = total <= 3 ? "Over-the-counter antihistamines" : total <= 6 ? "Daily antihistamines and nasal spray" : "Consult an allergist for prescription options";
      return {
        primary: { label: "Allergy Severity", value: severity + " (" + formatNumber(total) + " / " + maxScore + ")" },
        details: [
          { label: "Severity Percentage", value: formatNumber(pct) + "%" },
          { label: "Suggested Treatment", value: treatment },
          { label: "Daily Impact Level", value: impact === 0 ? "None" : impact === 1 ? "Slight" : impact === 2 ? "Moderate" : "Significant" },
        ],
      };
    },
  }],
  relatedSlugs: ["biological-age-calculator", "hydration-calculator"],
  faq: [
    { question: "How do you measure allergy severity?", answer: "Allergy severity is measured by combining symptom scores for sneezing, congestion, eye irritation, and impact on daily activities into a composite score." },
    { question: "When should I see an allergist?", answer: "If your allergy symptoms score moderate or higher, especially if over-the-counter medications do not provide adequate relief, you should consult a specialist." },
  ],
  formula: "Severity Score = Sneezing Score + Congestion Score + Eye Score + Impact Score (0 to 12)",
};
