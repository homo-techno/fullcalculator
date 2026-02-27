import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const biorhythmCalculator: CalculatorDefinition = {
  slug: "biorhythm-calculator",
  title: "Biorhythm Calculator",
  description: "Free biorhythm calculator. Calculate your biorhythm cycles",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["biorhythm calculator", "astrology calculator", "numerology"],
  variants: [{
    id: "standard",
    name: "Biorhythm",
    description: "Calculate your biorhythm cycles",
    fields: [
      { name: "day", label: "Birth Day", type: "number", placeholder: "e.g. 15", min: 1, max: 31 },
      { name: "month", label: "Birth Month", type: "number", placeholder: "e.g. 7", min: 1, max: 12 },
      { name: "year", label: "Birth Year", type: "number", placeholder: "e.g. 1990", min: 1900, max: 2030 },
    ],
    calculate: (inputs)=>{const d=inputs.day as number;const m=inputs.month as number;const y=inputs.year as number;if(!d||!m||!y)return null;const signs=["Capricorn","Aquarius","Pisces","Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius"];const idx=Math.floor(((m-1)*30+d)/30.4)%12;const element=["Earth","Air","Water","Fire"][idx%4];return{primary:{label:"Result",value:signs[idx]},details:[{label:"Element",value:element},{label:"Birth date",value:m+"/"+d+"/"+y}]};},
  }],
  relatedSlugs: ["age-calculator"],
  faq: [
    { question: "How accurate is this?", answer: "This provides calculations based on traditional astrology/numerology systems. It is for entertainment purposes." },
    { question: "What is numerology?", answer: "Numerology is the study of numbers and their symbolic significance, often used for self-discovery and personal insight." },
  ],
  formula: "Based on traditional numerology/astrology systems",
};
