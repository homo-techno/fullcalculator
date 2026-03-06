import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const discordServerCostCalculator: CalculatorDefinition = {
  slug: "discord-server-cost-calculator",
  title: "Discord Server Cost Calculator",
  description: "Estimate the monthly cost of running a Discord community including Nitro boosts, bot subscriptions, moderation tools, and premium features.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Discord server cost","Discord Nitro boost cost","Discord bot pricing","community server budget"],
  variants: [{
    id: "standard",
    name: "Discord Server Cost",
    description: "Estimate the monthly cost of running a Discord community including Nitro boosts, bot subscriptions, moderation tools, and premium features.",
    fields: [
      { name: "memberCount", label: "Server Member Count", type: "number", min: 10, max: 1000000, defaultValue: 500 },
      { name: "boostLevel", label: "Desired Boost Level", type: "select", options: [{ value: "0", label: "No Boosts" }, { value: "1", label: "Level 1 (2 boosts)" }, { value: "2", label: "Level 2 (7 boosts)" }, { value: "3", label: "Level 3 (14 boosts)" }], defaultValue: "2" },
      { name: "premiumBots", label: "Premium Bot Subscriptions", type: "number", min: 0, max: 20, defaultValue: 3 },
      { name: "modTools", label: "Moderation Tool Budget ($)", type: "number", min: 0, max: 200, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const members = inputs.memberCount as number;
    const boostLevel = parseInt(inputs.boostLevel as string);
    const premiumBots = inputs.premiumBots as number;
    const modTools = inputs.modTools as number;
    const boostCosts = { 0: 0, 1: 9.98, 2: 34.93, 3: 69.86 };
    const boostCost = boostCosts[boostLevel] || 0;
    const avgBotCost = 5;
    const botTotal = premiumBots * avgBotCost;
    const monthlyCost = boostCost + botTotal + modTools;
    const annualCost = monthlyCost * 12;
    const costPerMember = members > 0 ? monthlyCost / members : 0;
    return {
      primary: { label: "Monthly Server Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
      details: [
        { label: "Boost Cost", value: "$" + formatNumber(Math.round(boostCost * 100) / 100) },
        { label: "Bot Subscriptions", value: "$" + formatNumber(botTotal) },
        { label: "Moderation Tools", value: "$" + formatNumber(modTools) },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) }
      ]
    };
  },
  }],
  relatedSlugs: ["game-server-hosting-cost-calculator","twitch-streamer-revenue-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Boost Cost = Number of Boosts Required x $4.99; Bot Total = Premium Bots x Average Bot Cost; Monthly Cost = Boost Cost + Bot Total + Moderation Tools",
};
