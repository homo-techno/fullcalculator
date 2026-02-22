import type { CalculatorDefinition } from "./types";

export const randomNameCalculator: CalculatorDefinition = {
  slug: "random-name-generator-calculator",
  title: "Random Name Generator Calculator",
  description:
    "Free random name generator. Generate random first names, last names, and full names for characters, stories, games, or baby name inspiration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "random name generator",
    "name generator",
    "character name",
    "baby name",
    "fake name",
    "random name",
  ],
  variants: [
    {
      id: "calc",
      name: "Generate Random Names",
      fields: [
        {
          name: "gender",
          label: "Gender Preference",
          type: "select",
          options: [
            { label: "Any", value: "any" },
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
          defaultValue: "any",
        },
        {
          name: "style",
          label: "Name Style",
          type: "select",
          options: [
            { label: "Classic", value: "classic" },
            { label: "Modern", value: "modern" },
            { label: "Fantasy", value: "fantasy" },
            { label: "International", value: "international" },
          ],
          defaultValue: "classic",
        },
        {
          name: "seed",
          label: "Lucky Number (changes results)",
          type: "number",
          placeholder: "Enter any number",
          defaultValue: 42,
        },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const style = inputs.style as string;
        const seed = (inputs.seed as number) || 1;

        const maleClassic = ["James", "William", "Alexander", "Benjamin", "Theodore", "Henry", "Samuel", "Edward", "Charles", "Arthur", "George", "Frederick", "Thomas", "Richard", "Daniel", "Joseph", "Robert", "Michael", "David", "Andrew"];
        const femaleClassic = ["Elizabeth", "Charlotte", "Catherine", "Margaret", "Eleanor", "Victoria", "Isabella", "Josephine", "Caroline", "Adelaide", "Beatrice", "Florence", "Genevieve", "Henrietta", "Rosalind", "Arabella", "Cordelia", "Evangeline", "Penelope", "Vivienne"];
        const maleModern = ["Liam", "Noah", "Ethan", "Mason", "Kai", "Milo", "Jasper", "Felix", "Atlas", "Ezra", "Silas", "Asher", "Rowan", "Finn", "Leo", "Axel", "Jude", "Hugo", "Theo", "Zane"];
        const femaleModern = ["Luna", "Willow", "Ivy", "Aurora", "Sage", "Nova", "Aria", "Iris", "Stella", "Hazel", "Maya", "Chloe", "Zara", "Quinn", "Eden", "Ember", "Wren", "Lyra", "Freya", "Neve"];
        const maleFantasy = ["Alaric", "Theron", "Caspian", "Dorian", "Orion", "Galen", "Aldric", "Lucian", "Kael", "Eldric", "Ronan", "Fenris", "Corvin", "Zephyr", "Darian", "Oberon", "Valerian", "Lysander", "Sorin", "Draven"];
        const femaleFantasy = ["Seraphina", "Elowen", "Celestia", "Lyanna", "Rowena", "Morgana", "Aurelia", "Calista", "Isolde", "Thessaly", "Syrena", "Emberlynn", "Ravenna", "Fiora", "Nyx", "Asteria", "Vespera", "Selene", "Ondine", "Faye"];
        const maleInternational = ["Mateo", "Akira", "Nikolai", "Rafael", "Soren", "Dante", "Ravi", "Kenji", "Alejandro", "Dmitri", "Luca", "Hiro", "Emilio", "Idris", "Aarav", "Kai", "Tariq", "Yuki", "Hans", "Bjorn"];
        const femaleInternational = ["Sakura", "Annika", "Valentina", "Yara", "Ingrid", "Mei", "Priya", "Amara", "Chiara", "Esme", "Saoirse", "Nadia", "Kamila", "Aisha", "Liora", "Maren", "Catalina", "Zuri", "Niamh", "Adele"];

        const lastNames = ["Blackwood", "Sterling", "Hawthorne", "Ashford", "Mercer", "Sinclair", "Caldwell", "Whitmore", "Pemberton", "Thatcher", "Montgomery", "Kingsley", "Fairchild", "Hartwell", "Prescott", "Langley", "Everett", "Beaumont", "Voss", "Castellano"];

        let maleNames: string[];
        let femaleNames: string[];

        switch (style) {
          case "modern": maleNames = maleModern; femaleNames = femaleModern; break;
          case "fantasy": maleNames = maleFantasy; femaleNames = femaleFantasy; break;
          case "international": maleNames = maleInternational; femaleNames = femaleInternational; break;
          default: maleNames = maleClassic; femaleNames = femaleClassic;
        }

        // Simple seeded pseudo-random
        const seededRandom = (s: number, idx: number): number => {
          let x = Math.sin(s * 9301 + idx * 49297 + 233280) * 49297;
          return x - Math.floor(x);
        };

        const details: { label: string; value: string }[] = [];

        for (let i = 0; i < 5; i++) {
          const r = seededRandom(seed, i);
          const useGender = gender === "any" ? (r > 0.5 ? "male" : "female") : gender;
          const pool = useGender === "male" ? maleNames : femaleNames;

          const firstIdx = Math.floor(seededRandom(seed, i * 3 + 1) * pool.length);
          const lastIdx = Math.floor(seededRandom(seed, i * 3 + 2) * lastNames.length);

          const fullName = `${pool[firstIdx]} ${lastNames[lastIdx]}`;
          details.push({
            label: `Name ${i + 1} (${useGender === "male" ? "M" : "F"})`,
            value: fullName,
          });
        }

        details.push({ label: "Style", value: style.charAt(0).toUpperCase() + style.slice(1) });
        details.push({ label: "Tip", value: "Change the lucky number to generate different names!" });

        return {
          primary: {
            label: "Generated Names",
            value: "5 random names below",
          },
          details,
          note: "Change the lucky number to shuffle results. These names are randomly combined and any resemblance to real persons is coincidental.",
        };
      },
    },
  ],
  relatedSlugs: ["name-numerology-calculator", "password-generator-calculator", "baby-name-popularity-calculator"],
  faq: [
    {
      question: "What can I use random names for?",
      answer:
        "Random name generators are popular for fiction writing, D&D characters, game avatars, placeholder data in software development, brainstorming baby names, social media aliases, and creative projects. They help overcome naming block and provide inspiration you might not have considered.",
    },
    {
      question: "Are these names safe to use?",
      answer:
        "These names are common first names paired with surnames and are intended for creative or entertainment use. Any resemblance to actual persons is coincidental. For legal purposes (like business names), always do a proper trademark search.",
    },
    {
      question: "How do I pick a good character name?",
      answer:
        "A good character name should be easy to pronounce, memorable, and fit the setting. Avoid names too similar to other characters in your story. Consider the character's culture, time period, and personality. Fantasy names can be more exotic, while contemporary fiction should use realistic names.",
    },
  ],
  formula:
    "Names are generated using a seeded pseudo-random number generator from curated name lists. The seed ensures consistent results for the same input.",
};
