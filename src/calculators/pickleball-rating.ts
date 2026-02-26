import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pickleballRatingCalculator: CalculatorDefinition = {
  slug: "pickleball-rating-calculator",
  title: "Pickleball Skill Rating Calculator",
  description: "Free pickleball skill rating calculator. Assess your DUPR/USAPA skill rating based on your playing abilities, match results, and technical skills.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pickleball rating calculator", "dupr rating", "usapa rating", "pickleball skill level", "pickleball calculator"],
  variants: [
    {
      id: "skill-assessment",
      name: "Skill Level Assessment",
      description: "Estimate your pickleball rating from playing abilities",
      fields: [
        { name: "serveConsistency", label: "Serve Consistency (1-5)", type: "select", options: [
          { label: "1 - Many faults, inconsistent", value: "1" },
          { label: "2 - Gets most in, no placement", value: "2" },
          { label: "3 - Consistent with some depth", value: "3" },
          { label: "4 - Accurate placement, spin", value: "4" },
          { label: "5 - Powerful, precise, varied", value: "5" },
        ] },
        { name: "dinkAbility", label: "Dink / Soft Game (1-5)", type: "select", options: [
          { label: "1 - Cannot dink consistently", value: "1" },
          { label: "2 - Basic dinks, pops up often", value: "2" },
          { label: "3 - Consistent dinks, some placement", value: "3" },
          { label: "4 - Good control, cross-court dinks", value: "4" },
          { label: "5 - Exceptional touch, drops, resets", value: "5" },
        ] },
        { name: "thirdShot", label: "Third Shot Drop (1-5)", type: "select", options: [
          { label: "1 - Cannot execute", value: "1" },
          { label: "2 - Attempts but inconsistent", value: "2" },
          { label: "3 - Moderate consistency", value: "3" },
          { label: "4 - Good drops from most positions", value: "4" },
          { label: "5 - Exceptional, uses as weapon", value: "5" },
        ] },
        { name: "volleyAbility", label: "Volley Skills (1-5)", type: "select", options: [
          { label: "1 - Avoids net play", value: "1" },
          { label: "2 - Basic blocks, limited control", value: "2" },
          { label: "3 - Decent volleys, some put-aways", value: "3" },
          { label: "4 - Confident net player, counters well", value: "4" },
          { label: "5 - Dominant at net, speed-ups, counters", value: "5" },
        ] },
        { name: "strategy", label: "Strategy & Court Awareness (1-5)", type: "select", options: [
          { label: "1 - Little understanding of positioning", value: "1" },
          { label: "2 - Knows basics, inconsistent execution", value: "2" },
          { label: "3 - Good positioning, reads some plays", value: "3" },
          { label: "4 - Strong court awareness, adapts", value: "4" },
          { label: "5 - Elite strategy, controls pace of play", value: "5" },
        ] },
        { name: "movement", label: "Footwork & Athleticism (1-5)", type: "select", options: [
          { label: "1 - Limited mobility", value: "1" },
          { label: "2 - Gets to most balls, slow transitions", value: "2" },
          { label: "3 - Good movement, covers court well", value: "3" },
          { label: "4 - Quick, balanced, efficient movement", value: "4" },
          { label: "5 - Exceptional speed and agility", value: "5" },
        ] },
      ],
      calculate: (inputs) => {
        const serve = parseFloat(inputs.serveConsistency as string);
        const dink = parseFloat(inputs.dinkAbility as string);
        const third = parseFloat(inputs.thirdShot as string);
        const volley = parseFloat(inputs.volleyAbility as string);
        const strategy = parseFloat(inputs.strategy as string);
        const movement = parseFloat(inputs.movement as string);
        if (isNaN(serve) || isNaN(dink) || isNaN(third) || isNaN(volley) || isNaN(strategy) || isNaN(movement)) return null;

        const totalScore = serve + dink + third + volley + strategy + movement;
        const avgScore = totalScore / 6;

        let rating = 2.0;
        if (avgScore >= 4.8) rating = 5.0;
        else if (avgScore >= 4.3) rating = 4.5;
        else if (avgScore >= 3.8) rating = 4.0;
        else if (avgScore >= 3.3) rating = 3.75;
        else if (avgScore >= 2.8) rating = 3.5;
        else if (avgScore >= 2.3) rating = 3.0;
        else if (avgScore >= 1.8) rating = 2.5;
        else rating = 2.0;

        let description = "";
        if (rating >= 4.5) description = "Tournament/competitive player";
        else if (rating >= 4.0) description = "Advanced recreational / low-level tournament";
        else if (rating >= 3.5) description = "Intermediate - consistent and strategic";
        else if (rating >= 3.0) description = "Intermediate-beginner - developing skills";
        else description = "Beginner - learning fundamentals";

        const weakest = Math.min(serve, dink, third, volley, strategy, movement);
        let focusArea = "";
        if (weakest === third) focusArea = "Third shot drop - practice kitchen line approaches";
        else if (weakest === dink) focusArea = "Soft game - practice cross-court dink rallies";
        else if (weakest === volley) focusArea = "Volleys - work on net play and hand speed";
        else if (weakest === serve) focusArea = "Serve consistency - aim for deep placement";
        else if (weakest === strategy) focusArea = "Strategy - study positioning and shot selection";
        else focusArea = "Footwork - practice split steps and lateral movement";

        return {
          primary: { label: "Estimated Rating", value: formatNumber(rating, 1) },
          details: [
            { label: "Level Description", value: description },
            { label: "Average Skill Score", value: `${formatNumber(avgScore, 1)} / 5.0` },
            { label: "Total Score", value: `${formatNumber(totalScore, 0)} / 30` },
            { label: "Serve", value: `${formatNumber(serve, 0)} / 5` },
            { label: "Dink / Soft Game", value: `${formatNumber(dink, 0)} / 5` },
            { label: "Third Shot Drop", value: `${formatNumber(third, 0)} / 5` },
            { label: "Volleys", value: `${formatNumber(volley, 0)} / 5` },
            { label: "Strategy", value: `${formatNumber(strategy, 0)} / 5` },
            { label: "Movement", value: `${formatNumber(movement, 0)} / 5` },
            { label: "Focus Area", value: focusArea },
          ],
        };
      },
    },
    {
      id: "match-rating",
      name: "Match-Based Rating",
      description: "Estimate rating from your win/loss record",
      fields: [
        { name: "wins", label: "Total Wins", type: "number", placeholder: "e.g. 15", min: 0 },
        { name: "losses", label: "Total Losses", type: "number", placeholder: "e.g. 10", min: 0 },
        { name: "avgOpponentRating", label: "Avg Opponent Rating", type: "number", placeholder: "e.g. 3.5", min: 2.0, max: 5.5, step: 0.25 },
        { name: "monthsPlaying", label: "Months Playing", type: "number", placeholder: "e.g. 12", min: 1, max: 120 },
      ],
      calculate: (inputs) => {
        const wins = parseFloat(inputs.wins as string);
        const losses = parseFloat(inputs.losses as string);
        const oppRating = parseFloat(inputs.avgOpponentRating as string);
        const months = parseFloat(inputs.monthsPlaying as string);
        if (isNaN(wins) || isNaN(losses) || isNaN(oppRating) || isNaN(months)) return null;

        const totalGames = wins + losses;
        if (totalGames === 0) return null;

        const winRate = wins / totalGames;
        const ratingAdj = (winRate - 0.5) * 1.0;
        const estimatedRating = oppRating + ratingAdj;
        const clampedRating = Math.max(2.0, Math.min(5.5, estimatedRating));

        const gamesPerMonth = totalGames / months;
        let improvement = "Slow progression";
        if (gamesPerMonth > 20) improvement = "Rapid improvement expected";
        else if (gamesPerMonth > 10) improvement = "Good progression rate";
        else if (gamesPerMonth > 5) improvement = "Moderate progression";

        return {
          primary: { label: "Estimated Rating", value: formatNumber(clampedRating, 2) },
          details: [
            { label: "Win Rate", value: `${formatNumber(winRate * 100, 1)}%` },
            { label: "Record", value: `${formatNumber(wins, 0)}W - ${formatNumber(losses, 0)}L` },
            { label: "Total Games", value: formatNumber(totalGames, 0) },
            { label: "Games/Month", value: formatNumber(gamesPerMonth, 1) },
            { label: "Avg Opponent Rating", value: formatNumber(oppRating, 2) },
            { label: "Improvement Trajectory", value: improvement },
          ],
          note: "This is an estimate. Official DUPR ratings require verified match results entered into the system.",
        };
      },
    },
  ],
  relatedSlugs: ["dart-score-calculator", "bowling-handicap-calculator", "fantasy-trade-calculator"],
  faq: [
    { question: "What do pickleball ratings mean?", answer: "Pickleball ratings typically range from 2.0 (beginner) to 5.5+ (professional). 2.5-3.0 is beginner, 3.0-3.5 is intermediate, 3.5-4.0 is advanced intermediate, 4.0-4.5 is advanced, and 4.5+ is competitive/tournament level." },
    { question: "What is DUPR rating?", answer: "DUPR (Dynamic Universal Pickleball Rating) is the most widely used rating system. It uses match results (wins, losses, point differentials) against rated opponents to calculate a dynamic rating. It updates after every recorded match." },
    { question: "How can I improve my pickleball rating?", answer: "Focus on your weakest skill area (usually the third shot drop or soft game). Play with better players, take lessons, drill specific shots, and play in organized events. Most players improve 0.5-1.0 rating points in their first year of focused play." },
  ],
  formula: "Estimated Rating = Avg Opponent Rating + (Win Rate - 0.5) x 1.0 | Skill Assessment: Rating mapped from average of 6 skill areas (1-5 scale)",
};
