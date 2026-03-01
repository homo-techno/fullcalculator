import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const massageTherapistRateCalculator: CalculatorDefinition = {
  slug: "massage-therapist-rate-calculator",
  title: "Massage Therapist Rate Calculator",
  description: "Calculate massage therapy pricing based on session type, duration, and add-on services.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["massage therapist rate", "massage pricing", "massage therapy cost"],
  variants: [{
    id: "standard",
    name: "Massage Therapist Rate",
    description: "Calculate massage therapy pricing based on session type, duration, and add-on services",
    fields: [
      { name: "sessionLength", label: "Session Length", type: "select", options: [{value:"30",label:"30 Minutes"},{value:"60",label:"60 Minutes"},{value:"90",label:"90 Minutes"},{value:"120",label:"120 Minutes"}], defaultValue: "60" },
      { name: "massageType", label: "Massage Type", type: "select", options: [{value:"swedish",label:"Swedish (Relaxation)"},{value:"deep",label:"Deep Tissue"},{value:"sports",label:"Sports Massage"},{value:"hot",label:"Hot Stone"}], defaultValue: "swedish" },
      { name: "sessions", label: "Number of Sessions", type: "number", suffix: "sessions", min: 1, max: 52, defaultValue: 4 },
      { name: "tipPercent", label: "Tip Percentage", type: "number", suffix: "%", min: 0, max: 30, defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const length = inputs.sessionLength as string;
      const mType = inputs.massageType as string;
      const sessions = inputs.sessions as number;
      const tipPct = inputs.tipPercent as number;
      if (!sessions || sessions <= 0) return null;
      const basePrices: Record<string, Record<string, number>> = {
        "30": { swedish: 45, deep: 55, sports: 55, hot: 60 },
        "60": { swedish: 80, deep: 95, sports: 95, hot: 110 },
        "90": { swedish: 120, deep: 140, sports: 140, hot: 160 },
        "120": { swedish: 150, deep: 175, sports: 175, hot: 200 }
      };
      const pricePerSession = (basePrices[length] && basePrices[length][mType]) || 80;
      const tipPerSession = pricePerSession * (tipPct / 100);
      const totalPerSession = pricePerSession + tipPerSession;
      const grandTotal = totalPerSession * sessions;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(Math.round(grandTotal * 100) / 100) },
        details: [
          { label: "Per Session (before tip)", value: "$" + formatNumber(pricePerSession) },
          { label: "Tip per Session", value: "$" + formatNumber(Math.round(tipPerSession * 100) / 100) },
          { label: "Per Session (with tip)", value: "$" + formatNumber(Math.round(totalPerSession * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["personal-trainer-rate-calculator", "tutoring-rate-calculator"],
  faq: [
    { question: "How much does a massage cost?", answer: "A 60-minute massage typically costs $60 to $120 depending on the type and location. Deep tissue and specialty massages cost more than standard Swedish massage." },
    { question: "How much should I tip a massage therapist?", answer: "A tip of 15 to 20 percent is customary for massage therapy. If the therapist is the business owner, tipping is appreciated but not always expected." },
  ],
  formula: "Total = (Base Price + Tip) x Number of Sessions",
};
