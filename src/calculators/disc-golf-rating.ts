import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const discGolfRatingCalculator: CalculatorDefinition = {
  slug: "disc-golf-rating-calculator",
  title: "Disc Golf Player Rating Calculator",
  description: "Free online disc golf player rating calculator. Estimate your PDGA-style player rating based on round scores and course SSA.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["disc golf rating calculator", "PDGA rating calculator", "disc golf score calculator", "disc golf handicap", "player rating estimator"],
  variants: [
    {
      id: "single-round",
      name: "Single Round Rating",
      description: "Estimate the rating for a single round based on course SSA",
      fields: [
        { name: "score", label: "Your Round Score", type: "number", placeholder: "e.g. 58" },
        { name: "ssa", label: "Course SSA (Scratch Scoring Average)", type: "number", placeholder: "e.g. 54" },
        { name: "ssaRating", label: "SSA Rating Equivalent", type: "number", placeholder: "e.g. 1000", defaultValue: 1000 },
        { name: "strokeValue", label: "Points per Stroke", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const score = parseFloat(inputs.score as string) || 0;
        const ssa = parseFloat(inputs.ssa as string) || 0;
        const ssaRating = parseFloat(inputs.ssaRating as string) || 1000;
        const strokeValue = parseFloat(inputs.strokeValue as string) || 10;
        if (!score || !ssa) return null;

        const strokeDifference = score - ssa;
        const roundRating = ssaRating - (strokeDifference * strokeValue);
        const overUnder = score - ssa;

        return {
          primary: { label: "Estimated Round Rating", value: formatNumber(roundRating, 0) },
          details: [
            { label: "Your score", value: formatNumber(score, 0) },
            { label: "Course SSA", value: formatNumber(ssa, 0) },
            { label: "Strokes vs. SSA", value: `${overUnder > 0 ? "+" : ""}${formatNumber(overUnder, 0)}` },
            { label: "Points per stroke", value: formatNumber(strokeValue, 0) },
          ],
          note: "PDGA ratings use a more complex algorithm considering multiple rounds and course difficulty. This is a simplified estimate.",
        };
      },
    },
    {
      id: "multi-round",
      name: "Average Rating (Multi-Round)",
      description: "Calculate average rating from multiple rounds",
      fields: [
        { name: "round1", label: "Round 1 Rating", type: "number", placeholder: "e.g. 950" },
        { name: "round2", label: "Round 2 Rating", type: "number", placeholder: "e.g. 970" },
        { name: "round3", label: "Round 3 Rating", type: "number", placeholder: "e.g. 940" },
        { name: "round4", label: "Round 4 Rating (optional)", type: "number", placeholder: "e.g. 960" },
        { name: "round5", label: "Round 5 Rating (optional)", type: "number", placeholder: "e.g. 955" },
        { name: "dropLowest", label: "Drop Lowest Round?", type: "select", options: [
          { label: "No", value: "no" },
          { label: "Yes (if 4+ rounds)", value: "yes" },
        ], defaultValue: "no" },
      ],
      calculate: (inputs) => {
        const rounds: number[] = [];
        if (parseFloat(inputs.round1 as string)) rounds.push(parseFloat(inputs.round1 as string));
        if (parseFloat(inputs.round2 as string)) rounds.push(parseFloat(inputs.round2 as string));
        if (parseFloat(inputs.round3 as string)) rounds.push(parseFloat(inputs.round3 as string));
        if (parseFloat(inputs.round4 as string)) rounds.push(parseFloat(inputs.round4 as string));
        if (parseFloat(inputs.round5 as string)) rounds.push(parseFloat(inputs.round5 as string));
        const dropLowest = inputs.dropLowest as string;
        if (rounds.length < 2) return null;

        const sorted = [...rounds].sort((a, b) => a - b);
        const scoringRounds = (dropLowest === "yes" && rounds.length >= 4)
          ? sorted.slice(1)
          : sorted;
        const avgRating = scoringRounds.reduce((a, b) => a + b, 0) / scoringRounds.length;
        const highest = sorted[sorted.length - 1];
        const lowest = sorted[0];

        return {
          primary: { label: "Average Player Rating", value: formatNumber(avgRating, 0) },
          details: [
            { label: "Rounds counted", value: `${scoringRounds.length} of ${rounds.length}` },
            { label: "Highest round", value: formatNumber(highest, 0) },
            { label: "Lowest round", value: formatNumber(lowest, 0) },
            { label: "Range", value: formatNumber(highest - lowest, 0) },
            ...scoringRounds.map((r, i) => ({ label: `Counted round ${i + 1}`, value: formatNumber(r, 0) })),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["average-calculator", "standard-deviation-calculator"],
  faq: [
    { question: "What is SSA in disc golf?", answer: "SSA (Scratch Scoring Average) is the expected score for a 1000-rated player on a specific course layout. If the SSA is 54 and you shoot 54, your round rating is approximately 1000." },
    { question: "How is a PDGA rating calculated?", answer: "PDGA uses a propagating algorithm that compares your scores against other rated players in the same events. The simplified version is: Rating = 1000 - (Your Score - SSA) × ~10 points per stroke." },
    { question: "What is a good disc golf rating?", answer: "Recreational players are often 800-900. Competitive amateurs range 900-970. Advanced players are 970-1010. Professional level starts around 1000+, with elite pros rated 1040+." },
  ],
  formula: "Round Rating ≈ 1000 - (Score - SSA) × Points per Stroke",
};
