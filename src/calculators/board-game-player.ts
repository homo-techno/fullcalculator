import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boardGamePlayerCalculator: CalculatorDefinition = {
  slug: "board-game-player-calculator",
  title: "Board Game Player Count & Time Estimator",
  description: "Free online board game time and player count estimator. Calculate game session duration, number of games possible, and optimal player count planning.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["board game calculator", "game night calculator", "board game time estimator", "player count calculator", "game session planner"],
  variants: [
    {
      id: "session-planner",
      name: "Game Night Session Planner",
      description: "Plan how many games you can fit in a game night",
      fields: [
        { name: "totalTime", label: "Total Available Time (hours)", type: "number", placeholder: "e.g. 4" },
        { name: "avgGameTime", label: "Average Game Duration (minutes)", type: "number", placeholder: "e.g. 60" },
        { name: "setupTime", label: "Setup/Teardown Time per Game (minutes)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "breakTime", label: "Break Time Between Games (minutes)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
        { name: "numPlayers", label: "Number of Players", type: "number", placeholder: "e.g. 4" },
        { name: "addTimePerPlayer", label: "Extra Time per Player (minutes)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const totalHours = parseFloat(inputs.totalTime as string) || 0;
        const avgGameMin = parseFloat(inputs.avgGameTime as string) || 0;
        const setupMin = parseFloat(inputs.setupTime as string) || 10;
        const breakMin = parseFloat(inputs.breakTime as string) || 5;
        const numPlayers = parseFloat(inputs.numPlayers as string) || 4;
        const addPerPlayer = parseFloat(inputs.addTimePerPlayer as string) || 5;
        if (!totalHours || !avgGameMin) return null;

        const totalMinutes = totalHours * 60;
        const adjustedGameTime = avgGameMin + (numPlayers - 2) * addPerPlayer;
        const timePerSession = adjustedGameTime + setupMin + breakMin;
        const numGames = Math.floor(totalMinutes / timePerSession);
        const totalUsedTime = numGames * timePerSession;
        const remainingTime = totalMinutes - totalUsedTime;

        return {
          primary: { label: "Games You Can Play", value: formatNumber(numGames, 0) },
          details: [
            { label: "Adjusted game duration", value: `${formatNumber(adjustedGameTime, 0)} min (${numPlayers} players)` },
            { label: "Time per game (with setup)", value: `${formatNumber(timePerSession, 0)} min` },
            { label: "Total time used", value: `${formatNumber(totalUsedTime, 0)} min` },
            { label: "Leftover time", value: `${formatNumber(remainingTime, 0)} min` },
            { label: "Total available", value: `${formatNumber(totalMinutes, 0)} min (${totalHours} hrs)` },
          ],
          note: "Longer/more complex games may add 10-15 minutes per additional player. First-time players may need extra time to learn rules.",
        };
      },
    },
    {
      id: "tournament",
      name: "Tournament Round Calculator",
      description: "Calculate rounds and matchups for a board game tournament",
      fields: [
        { name: "totalPlayers", label: "Total Players", type: "number", placeholder: "e.g. 16" },
        { name: "playersPerGame", label: "Players per Game", type: "select", options: [
          { label: "2 players", value: "2" },
          { label: "3 players", value: "3" },
          { label: "4 players", value: "4" },
          { label: "5 players", value: "5" },
          { label: "6 players", value: "6" },
        ], defaultValue: "4" },
        { name: "gameTime", label: "Minutes per Game", type: "number", placeholder: "e.g. 45" },
        { name: "rounds", label: "Number of Rounds (Swiss)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const totalPlayers = parseFloat(inputs.totalPlayers as string) || 0;
        const playersPerGame = parseFloat(inputs.playersPerGame as string) || 4;
        const gameTime = parseFloat(inputs.gameTime as string) || 45;
        const rounds = parseFloat(inputs.rounds as string) || 4;
        if (!totalPlayers) return null;

        const tablesPerRound = Math.ceil(totalPlayers / playersPerGame);
        const byePlayers = (tablesPerRound * playersPerGame) - totalPlayers;
        const totalGames = tablesPerRound * rounds;
        const totalTimeMin = rounds * (gameTime + 15);
        const totalTimeHours = totalTimeMin / 60;

        return {
          primary: { label: "Total Tournament Time", value: `${formatNumber(totalTimeHours, 1)} hours` },
          details: [
            { label: "Tables per round", value: formatNumber(tablesPerRound, 0) },
            { label: "Total games played", value: formatNumber(totalGames, 0) },
            { label: "Rounds", value: formatNumber(rounds, 0) },
            { label: "Bye players per round", value: formatNumber(byePlayers, 0) },
            { label: "Time per round (with buffer)", value: `${formatNumber(gameTime + 15, 0)} min` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["probability-calculator", "random-number-generator"],
  faq: [
    { question: "How does player count affect game time?", answer: "Most board games add 5-15 minutes per additional player. A 4-player game rated at 60 minutes may take 75-90 minutes with 6 players due to longer turns, more decisions, and more interactions." },
    { question: "How many games can we play in an evening?", answer: "For a 4-hour game night with medium-weight games (45-60 min), expect 3-4 games including setup time. For party games (15-30 min), you might fit 6-8 games." },
    { question: "What is the best number of players for most games?", answer: "Most modern board games play best at 3-4 players. This balances downtime between turns, strategic depth, and game length. Check the game's recommended player count (often listed on the box)." },
  ],
  formula: "Games Possible = Total Time / (Game Duration + Setup + Break)",
};
