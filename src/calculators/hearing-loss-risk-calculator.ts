import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hearingLossRiskCalculator: CalculatorDefinition = {
  slug: "hearing-loss-risk-calculator",
  title: "Hearing Loss Risk Calculator",
  description: "Assess your risk of noise-induced hearing loss based on daily noise exposure levels.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["hearing loss risk", "noise exposure calculator", "hearing damage calculator"],
  variants: [{
    id: "standard",
    name: "Hearing Loss Risk",
    description: "Assess your risk of noise-induced hearing loss based on daily noise exposure levels",
    fields: [
      { name: "noiseLevel", label: "Average Noise Level", type: "number", suffix: "dB", min: 40, max: 140, defaultValue: 75 },
      { name: "duration", label: "Exposure Duration", type: "number", suffix: "hours/day", min: 0.5, max: 24, defaultValue: 8 },
      { name: "protection", label: "Hearing Protection", type: "select", options: [{value:"none",label:"None"},{value:"foam",label:"Foam Earplugs (-20 dB)"},{value:"muff",label:"Earmuffs (-25 dB)"},{value:"custom",label:"Custom Molded (-30 dB)"}], defaultValue: "none" },
    ],
    calculate: (inputs) => {
      const noise = inputs.noiseLevel as number;
      const duration = inputs.duration as number;
      const protection = inputs.protection as string;
      if (!noise || !duration) return null;
      const protectionDb: Record<string, number> = { none: 0, foam: 20, muff: 25, custom: 30 };
      const effectiveNoise = noise - (protectionDb[protection] || 0);
      const safeLimit = 85;
      const maxHours = effectiveNoise <= safeLimit ? 24 : 8 / Math.pow(2, (effectiveNoise - safeLimit) / 3);
      const exposureRatio = duration / maxHours;
      const risk = exposureRatio < 0.5 ? "Low" : exposureRatio < 1.0 ? "Moderate" : exposureRatio < 2.0 ? "High" : "Very High";
      return {
        primary: { label: "Hearing Risk Level", value: risk },
        details: [
          { label: "Effective Noise Level", value: formatNumber(Math.max(0, effectiveNoise)) + " dB" },
          { label: "Safe Exposure Limit", value: formatNumber(Math.round(maxHours * 100) / 100) + " hours" },
          { label: "Your Exposure Ratio", value: formatNumber(Math.round(exposureRatio * 100) / 100) + "x safe limit" },
        ],
      };
    },
  }],
  relatedSlugs: ["decibel-addition-calculator", "sound-wavelength-calculator"],
  faq: [
    { question: "At what decibel level does hearing damage occur?", answer: "Sustained exposure above 85 dB can cause hearing damage. The safe duration halves for every 3 dB increase above this threshold." },
    { question: "How effective is hearing protection?", answer: "Foam earplugs reduce noise by about 20 dB, earmuffs by 25 dB, and custom-molded plugs by up to 30 dB when properly fitted." },
  ],
  formula: "Safe Hours = 8 / 2^((Effective dB - 85) / 3); Exposure Ratio = Duration / Safe Hours",
};
