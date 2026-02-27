import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lifePathNumberCalculator: CalculatorDefinition = {
  slug: "life-path-number-calculator",
  title: "Life Path Number Calculator",
  description: "Free life path number calculator. Calculate your numerology life path number",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["life path number calculator", "astrology calculator", "numerology"],
  variants: [{
    id: "standard",
    name: "Life Path Number",
    description: "Calculate your numerology life path number",
    fields: [
      { name: "birthDay", label: "Birth Day", type: "number", placeholder: "e.g. 15", min: 1, max: 31 },
      { name: "birthMonth", label: "Birth Month", type: "number", placeholder: "e.g. 7", min: 1, max: 12 },
      { name: "birthYear", label: "Birth Year", type: "number", placeholder: "e.g. 1990", min: 1900, max: 2030 },
    ],
    calculate: (inputs)=>{const d=inputs.birthDay as number;const m=inputs.birthMonth as number;const y=inputs.birthYear as number;if(!d||!m||!y)return null;let sum=String(d)+String(m)+String(y);let result=sum.split('').reduce((a,b)=>a+parseInt(b),0);while(result>9&&result!==11&&result!==22&&result!==33)result=String(result).split('').reduce((a,b)=>a+parseInt(b),0);const meanings={1:"The Leader",2:"The Peacemaker",3:"The Creative",4:"The Builder",5:"The Adventurer",6:"The Caregiver",7:"The Seeker",8:"The Powerhouse",9:"The Humanitarian",11:"Master Intuitive",22:"Master Builder",33:"Master Teacher"};return{primary:{label:"Life Path Number",value:String(result)},details:[{label:"Meaning",value:meanings[result]||"Universal"},{label:"Birth date",value:m+"/"+d+"/"+y},{label:"Master number",value:(result===11||result===22||result===33)?"Yes":"No"}]};},
  }],
  relatedSlugs: ["age-calculator"],
  faq: [
    { question: "How accurate is this?", answer: "This provides calculations based on traditional astrology/numerology systems. It is for entertainment purposes." },
    { question: "What is numerology?", answer: "Numerology is the study of numbers and their symbolic significance, often used for self-discovery and personal insight." },
  ],
  formula: "Based on traditional numerology/astrology systems",
};
