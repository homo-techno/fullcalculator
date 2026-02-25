import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const generationCalculator: CalculatorDefinition = {
  slug: "generation-calculator",
  title: "What Generation Am I Calculator",
  description: "Find out which generation you belong to based on your birth year. Covers Gen Alpha through the Greatest Generation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["generation calculator", "what generation am i", "millennial", "gen z", "boomer", "gen x", "gen alpha"],
  variants: [
    {
      id: "calc",
      name: "Find Your Generation",
      fields: [
        { name: "birthYear", label: "Birth Year", type: "number", placeholder: "e.g. 1995", min: 1900, max: 2026 },
      ],
      calculate: (inputs) => {
        const year = Number(inputs.birthYear);
        if (!year || year < 1900 || year > 2026) return null;

        const gens = [
          { name: "Gen Alpha", start: 2013, end: 2025, traits: "Digital natives, AI-influenced, diverse" },
          { name: "Gen Z", start: 1997, end: 2012, traits: "Tech-savvy, socially conscious, entrepreneurial" },
          { name: "Millennials (Gen Y)", start: 1981, end: 1996, traits: "Tech-adapted, value experiences, collaborative" },
          { name: "Gen X", start: 1965, end: 1980, traits: "Independent, resourceful, work-life balance" },
          { name: "Baby Boomers", start: 1946, end: 1964, traits: "Hardworking, competitive, idealistic" },
          { name: "Silent Generation", start: 1928, end: 1945, traits: "Disciplined, loyal, respectful of authority" },
          { name: "Greatest Generation", start: 1901, end: 1927, traits: "Resilient, civic-minded, frugal" },
        ];

        const gen = gens.find((g) => year >= g.start && year <= g.end);
        if (!gen) return null;

        const now = new Date();
        const age = now.getFullYear() - year;
        const genSize = gen.end - gen.start + 1;
        const positionInGen = year - gen.start + 1;
        const earlyMidLate = positionInGen <= genSize / 3 ? "Early" : positionInGen <= (genSize * 2) / 3 ? "Core" : "Late";

        return {
          primary: { label: "Your Generation", value: gen.name },
          details: [
            { label: "Birth Year", value: String(year) },
            { label: "Current Age", value: formatNumber(age) },
            { label: "Generation Span", value: gen.start + " - " + gen.end },
            { label: "Position", value: earlyMidLate + " " + gen.name },
            { label: "Key Traits", value: gen.traits },
          ],
          note: "Generation boundaries vary by source. These follow Pew Research Center definitions.",
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "how-old-am-i-calculator", "zodiac-sign-calculator"],
  faq: [
    { question: "What are the generation year ranges?", answer: "Gen Alpha: 2013-2025, Gen Z: 1997-2012, Millennials: 1981-1996, Gen X: 1965-1980, Boomers: 1946-1964, Silent: 1928-1945, Greatest: 1901-1927." },
    { question: "Who defines these generations?", answer: "Various researchers and organizations define generations differently. We use Pew Research Center boundaries, which are among the most widely cited." },
  ],
  formula: "Generation = lookup(birthYear) from established generational boundary tables",
};
