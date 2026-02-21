import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyNamePopularityCalculator: CalculatorDefinition = {
  slug: "baby-name-popularity-calculator",
  title: "Baby Name Popularity Calculator",
  description:
    "Free baby name popularity calculator. Check how popular a baby name is, see estimated ranking, and predict how many children will share the name.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby name popularity",
    "popular baby names",
    "baby name rankings",
    "how common is my baby name",
    "baby name statistics",
  ],
  variants: [
    {
      id: "name-stats",
      name: "Name Popularity Estimator",
      description: "Estimate how common a baby name is",
      fields: [
        {
          name: "nameRank",
          label: "Name's Approximate US Rank",
          type: "number",
          placeholder: "e.g. 15 (1=most popular)",
          min: 1,
          max: 5000,
        },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Girl", value: "girl" },
            { label: "Boy", value: "boy" },
          ],
          defaultValue: "girl",
        },
        {
          name: "preference",
          label: "Your Preference",
          type: "select",
          options: [
            { label: "I want a popular name", value: "popular" },
            { label: "I want a unique name", value: "unique" },
            { label: "No preference", value: "none" },
          ],
          defaultValue: "none",
        },
      ],
      calculate: (inputs) => {
        const rank = inputs.nameRank as number;
        const gender = inputs.gender as string;
        const preference = inputs.preference as string;
        if (!rank) return null;

        // Approximate number of babies with that name rank (based on SSA data patterns)
        // Top name gets ~15,000-18,000 babies/year, drops off following Zipf's law
        const totalBirthsPerGender = gender === "boy" ? 1900000 : 1800000;
        const estimatedBabies = Math.round(17000 / Math.pow(rank, 0.75));
        const percentage = (estimatedBabies / totalBirthsPerGender) * 100;

        // How many in a school class of 25
        const classOf25 = (percentage / 100) * 25;
        // How many in a grade of 100
        const gradeOf100 = (percentage / 100) * 100;

        let popularityLevel: string;
        if (rank <= 10) popularityLevel = "Extremely popular - top 10 name in the country";
        else if (rank <= 50) popularityLevel = "Very popular - widely recognized and common";
        else if (rank <= 100) popularityLevel = "Popular - well-known but not overly common";
        else if (rank <= 250) popularityLevel = "Moderately popular - familiar but not trendy";
        else if (rank <= 500) popularityLevel = "Uncommon - recognizable but distinctive";
        else if (rank <= 1000) popularityLevel = "Rare - unique without being unrecognizable";
        else popularityLevel = "Very rare - highly unique and distinctive";

        let matchNote: string;
        if (preference === "popular" && rank <= 100) matchNote = "Great match for your preference! This is a well-known, popular name.";
        else if (preference === "popular" && rank > 100) matchNote = "This name is less popular than you might prefer. Consider names ranked in the top 50-100.";
        else if (preference === "unique" && rank > 250) matchNote = "Great match for your preference! This name is distinctive and uncommon.";
        else if (preference === "unique" && rank <= 250) matchNote = "This name may be more common than you prefer. Consider names ranked 500+.";
        else matchNote = "Name popularity is a personal choice. Both popular and unique names have their advantages.";

        return {
          primary: {
            label: "Popularity Rank",
            value: `#${rank} in the US`,
          },
          details: [
            { label: "Popularity Level", value: popularityLevel },
            { label: "Estimated Babies/Year", value: `~${formatNumber(estimatedBabies, 0)} babies given this name per year` },
            { label: "Percentage of All Babies", value: `${formatNumber(percentage, 3)}%` },
            { label: "In a Class of 25", value: classOf25 < 0.5 ? "Likely the only one" : `~${formatNumber(classOf25, 1)} children may share this name` },
            { label: "In a Grade of 100", value: gradeOf100 < 1 ? "Likely the only one" : `~${formatNumber(gradeOf100, 1)} children may share this name` },
            { label: "Your Preference Match", value: matchNote },
          ],
          note: "Rankings are approximate estimates based on SSA naming data patterns. Actual popularity varies by year, region, and community. Names ranked #1-10 are given to about 0.5-1% of all babies. Names ranked #100 are given to about 0.1%. Check the SSA Baby Names website for exact historical data.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-milestone-calculator", "baby-growth-calculator", "pregnancy-calculator"],
  faq: [
    {
      question: "How are baby name rankings determined?",
      answer:
        "In the US, the Social Security Administration (SSA) ranks baby names based on the number of babies given each name in a calendar year. The #1 ranked name is the name given to the most babies that year. Rankings are published annually, usually in May, for the previous year's births.",
    },
    {
      question: "Are popular names bad?",
      answer:
        "Not at all. Popular names are popular for good reasons: they are easy to spell, pronounce, and are well-liked. Even the #1 name is only given to about 1% of babies, much less common than decades ago when top names reached 3-5%. Your child's unique personality matters far more than name popularity.",
    },
    {
      question: "How have baby naming trends changed?",
      answer:
        "Baby names have become much more diverse. In 1950, the top 10 names accounted for 30% of all babies. Today, the top 10 account for only about 7%. Parents are choosing from a wider variety of names, so even 'popular' names are less common than they used to be.",
    },
  ],
  formula:
    "Estimated babies with name ≈ 17,000 / rank^0.75 (based on Zipf's law and SSA data patterns). Percentage = estimated babies / total births per gender. Class probability = percentage × class size.",
};
