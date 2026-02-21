import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pokerOddsCalculator: CalculatorDefinition = {
  slug: "poker-odds-calculator",
  title: "Poker Odds Calculator",
  description:
    "Free poker odds calculator. View the probability of common poker hands from a standard 5-card deal, including royal flush, straight flush, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "poker odds",
    "poker probability",
    "poker hands",
    "card probability",
    "poker calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "View Poker Hand Odds",
      fields: [
        {
          name: "handType",
          label: "Poker Hand",
          type: "select",
          options: [
            { label: "Royal Flush", value: "Royal Flush" },
            { label: "Straight Flush", value: "Straight Flush" },
            { label: "Four of a Kind", value: "Four of a Kind" },
            { label: "Full House", value: "Full House" },
            { label: "Flush", value: "Flush" },
            { label: "Straight", value: "Straight" },
            { label: "Three of a Kind", value: "Three of a Kind" },
            { label: "Two Pair", value: "Two Pair" },
            { label: "One Pair", value: "One Pair" },
            { label: "High Card", value: "High Card" },
          ],
        },
      ],
      calculate: (inputs) => {
        const handType = inputs.handType as string;
        if (!handType) return null;

        const totalHands = 2598960; // C(52, 5)

        const hands: Record<
          string,
          { ways: number; description: string }
        > = {
          "Royal Flush": {
            ways: 4,
            description:
              "A, K, Q, J, 10 all of the same suit",
          },
          "Straight Flush": {
            ways: 36,
            description:
              "Five consecutive cards of the same suit (excluding royal flush)",
          },
          "Four of a Kind": {
            ways: 624,
            description: "Four cards of the same rank plus one other card",
          },
          "Full House": {
            ways: 3744,
            description: "Three of a kind plus a pair",
          },
          "Flush": {
            ways: 5108,
            description:
              "Five cards of the same suit (excluding straight/royal flush)",
          },
          "Straight": {
            ways: 10200,
            description:
              "Five consecutive cards of mixed suits (excluding straight flush)",
          },
          "Three of a Kind": {
            ways: 54912,
            description:
              "Three cards of the same rank with two unrelated cards",
          },
          "Two Pair": {
            ways: 123552,
            description: "Two different pairs plus one other card",
          },
          "One Pair": {
            ways: 1098240,
            description: "One pair with three unrelated cards",
          },
          "High Card": {
            ways: 1302540,
            description: "No matching cards, not a straight or flush",
          },
        };

        const hand = hands[handType];
        if (!hand) return null;

        const probability = hand.ways / totalHands;
        const oddsAgainst =
          hand.ways > 0 ? (totalHands - hand.ways) / hand.ways : Infinity;

        return {
          primary: {
            label: `${handType} Probability`,
            value: `${formatNumber(probability * 100, 6)}%`,
          },
          details: [
            { label: "Hand", value: handType },
            { label: "Description", value: hand.description },
            {
              label: "Number of Ways",
              value: formatNumber(hand.ways, 0),
            },
            {
              label: "Total 5-Card Hands",
              value: formatNumber(totalHands, 0),
            },
            {
              label: "Odds Against",
              value: `${formatNumber(oddsAgainst, 1)} to 1`,
            },
            {
              label: "Fraction",
              value: `${formatNumber(hand.ways, 0)} / ${formatNumber(totalHands, 0)}`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lottery-odds-calculator", "dice-roller-calculator"],
  faq: [
    {
      question: "How many possible 5-card poker hands are there?",
      answer:
        "There are 2,598,960 possible 5-card hands from a standard 52-card deck. This is C(52, 5) = 52! / (5! x 47!).",
    },
    {
      question: "What is the rarest poker hand?",
      answer:
        "The Royal Flush is the rarest hand, with only 4 possible combinations out of 2,598,960 total hands, making the odds approximately 1 in 649,740.",
    },
  ],
  formula:
    "Total 5-card hands = C(52, 5) = 2,598,960. Probability = Number of ways to make hand / Total hands. Royal Flush: 4 ways, Straight Flush: 36 ways, Four of a Kind: 624 ways, etc.",
};
