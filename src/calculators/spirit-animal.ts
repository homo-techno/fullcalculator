import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spiritAnimalCalculator: CalculatorDefinition = {
  slug: "spirit-animal",
  title: "Spirit Animal Calculator",
  description: "Discover your spirit animal based on your birth month and personality traits. A fun personality quiz-style calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["spirit animal", "totem animal", "animal personality", "power animal", "spirit guide"],
  variants: [
    {
      id: "calc",
      name: "Find Your Spirit Animal",
      fields: [
        { name: "birthMonth", label: "Birth Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        {
          name: "element",
          label: "Preferred Element",
          type: "select",
          options: [
            { label: "Earth", value: "earth" },
            { label: "Water", value: "water" },
            { label: "Fire", value: "fire" },
            { label: "Air", value: "air" },
          ],
        },
        {
          name: "trait",
          label: "Strongest Trait",
          type: "select",
          options: [
            { label: "Courage", value: "courage" },
            { label: "Wisdom", value: "wisdom" },
            { label: "Compassion", value: "compassion" },
            { label: "Independence", value: "independence" },
          ],
        },
      ],
      calculate: (inputs) => {
        const month = Number(inputs.birthMonth);
        const element = String(inputs.element || "earth");
        const trait = String(inputs.trait || "courage");
        if (!month || month < 1 || month > 12) return null;

        const animals: Record<string, Record<string, { animal: string; meaning: string; strength: string }>> = {
          earth: {
            courage: { animal: "Bear", meaning: "Strength and grounding", strength: "Physical power and resilience" },
            wisdom: { animal: "Elephant", meaning: "Memory and patience", strength: "Deep wisdom and family bonds" },
            compassion: { animal: "Deer", meaning: "Gentleness and grace", strength: "Sensitivity and intuition" },
            independence: { animal: "Wolf", meaning: "Loyalty and instinct", strength: "Pack leadership and freedom" },
          },
          water: {
            courage: { animal: "Shark", meaning: "Fearlessness and focus", strength: "Relentless determination" },
            wisdom: { animal: "Whale", meaning: "Deep knowledge and song", strength: "Emotional depth and communication" },
            compassion: { animal: "Dolphin", meaning: "Joy and harmony", strength: "Playfulness and social intelligence" },
            independence: { animal: "Octopus", meaning: "Adaptability and mystery", strength: "Problem-solving and camouflage" },
          },
          fire: {
            courage: { animal: "Lion", meaning: "Royalty and bravery", strength: "Leadership and charisma" },
            wisdom: { animal: "Phoenix", meaning: "Rebirth and transformation", strength: "Rising from challenges" },
            compassion: { animal: "Horse", meaning: "Freedom and nobility", strength: "Endurance and spirit" },
            independence: { animal: "Dragon", meaning: "Power and magic", strength: "Fierce independence and vision" },
          },
          air: {
            courage: { animal: "Eagle", meaning: "Vision and sovereignty", strength: "Clarity and high perspective" },
            wisdom: { animal: "Owl", meaning: "Insight and mystery", strength: "Seeing through deception" },
            compassion: { animal: "Swan", meaning: "Beauty and devotion", strength: "Grace and unconditional love" },
            independence: { animal: "Hawk", meaning: "Focus and messages", strength: "Strategic thinking and awareness" },
          },
        };

        const result = animals[element]?.[trait] || animals.earth.courage;
        const seasonalBonus = month <= 3 ? "Spring energy: new beginnings" : month <= 6 ? "Summer energy: growth and vitality" : month <= 9 ? "Autumn energy: harvest and reflection" : "Winter energy: rest and introspection";

        return {
          primary: { label: "Your Spirit Animal", value: result.animal },
          details: [
            { label: "Meaning", value: result.meaning },
            { label: "Core Strength", value: result.strength },
            { label: "Element", value: element.charAt(0).toUpperCase() + element.slice(1) },
            { label: "Key Trait", value: trait.charAt(0).toUpperCase() + trait.slice(1) },
            { label: "Seasonal Influence", value: seasonalBonus },
          ],
          note: "This is a fun, entertainment-only calculator. Spirit animals hold deep cultural significance in many Indigenous traditions.",
        };
      },
    },
  ],
  relatedSlugs: ["zodiac-sign-calculator", "hogwarts-house-calculator", "chinese-zodiac-calculator"],
  faq: [
    { question: "How is the spirit animal determined?", answer: "This calculator uses a combination of your birth month, preferred element, and strongest personality trait to match you with an animal archetype." },
    { question: "Is this culturally accurate?", answer: "No, this is purely for entertainment. The concept of spirit animals holds sacred meaning in many Indigenous cultures and should be respected." },
  ],
  formula: "Spirit Animal = lookup(element, trait) with seasonal modifier based on birth month",
};
