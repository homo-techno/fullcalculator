import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const readingGlassesStrengthCalculator: CalculatorDefinition = {
  slug: "reading-glasses-strength-calculator",
  title: "Reading Glasses Strength Calculator",
  description: "Estimate reading lens power based on age and reading distance.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["reading glasses power","magnification strength by age","presbyopia lens calculator"],
  variants: [{
    id: "standard",
    name: "Reading Glasses Strength",
    description: "Estimate reading lens power based on age and reading distance.",
    fields: [
      { name: "age", label: "Age (years)", type: "number", min: 35, max: 80, defaultValue: 50 },
      { name: "readingDistance", label: "Preferred Reading Distance (inches)", type: "number", min: 8, max: 24, defaultValue: 14 },
      { name: "currentRx", label: "Current Distance Rx (diopters)", type: "number", min: -10, max: 10, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const age = inputs.age as number;
    const readingDistance = inputs.readingDistance as number;
    const currentRx = inputs.currentRx as number;
    let addPower = 0;
    if (age < 40) addPower = 0.75;
    else if (age < 45) addPower = 1.0;
    else if (age < 50) addPower = 1.5;
    else if (age < 55) addPower = 2.0;
    else if (age < 60) addPower = 2.25;
    else addPower = 2.5;
    const distanceMeters = readingDistance * 0.0254;
    const diopterForDistance = 1 / distanceMeters;
    const adjustedAdd = Math.round((addPower + (diopterForDistance - 2.5) * 0.25) * 4) / 4;
    const finalAdd = Math.max(0.75, Math.min(3.5, adjustedAdd));
    return {
      primary: { label: "Suggested Add Power", value: "+" + finalAdd.toFixed(2) + " D" },
      details: [
        { label: "Age-Based Power", value: "+" + addPower.toFixed(2) + " D" },
        { label: "Reading Distance", value: readingDistance + " inches" },
        { label: "Current Distance Rx", value: currentRx.toFixed(2) + " D" }
      ]
    };
  },
  }],
  relatedSlugs: ["eyeglass-prescription-calculator","pupillary-distance-calculator","blue-light-exposure-calculator"],
  faq: [
    { question: "At what age do you need reading glasses?", answer: "Most people begin needing reading glasses between ages 40 and 45 due to presbyopia." },
    { question: "How do I choose reading glasses strength?", answer: "Start with lower power and increase until text is clear at your preferred distance." },
    { question: "Can reading glasses damage your eyes?", answer: "No, wearing reading glasses does not damage your eyes or worsen your vision." },
  ],
  formula: "Add Power = Age-based baseline adjusted for preferred reading distance",
};
