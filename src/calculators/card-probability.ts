import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function combination(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  if (r === 0 || r === n) return 1;
  let result = 1;
  for (let i = 0; i < Math.min(r, n - r); i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

export const cardProbabilityCalculator: CalculatorDefinition = {
  slug: "card-probability-calculator",
  title: "Card Probability Calculator",
  description:
    "Free card game probability calculator. Calculate odds of drawing specific cards, hands, or combinations from a standard deck.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "card probability",
    "card game calculator",
    "deck probability",
    "drawing cards",
    "card odds",
    "card game math",
    "MTG probability",
  ],
  variants: [
    {
      id: "draw-probability",
      name: "Drawing Specific Cards",
      description: "Probability of drawing at least one target card from a deck",
      fields: [
        {
          name: "deckSize",
          label: "Total Cards in Deck",
          type: "number",
          placeholder: "e.g. 52",
          defaultValue: 52,
          min: 1,
          max: 500,
        },
        {
          name: "targetCards",
          label: "Target Cards in Deck",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 100,
        },
        {
          name: "drawCount",
          label: "Cards Drawn",
          type: "number",
          placeholder: "e.g. 7",
          min: 1,
          max: 100,
        },
        {
          name: "wantAtLeast",
          label: "Want at Least",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const deck = inputs.deckSize as number;
        const targets = inputs.targetCards as number;
        const drawn = inputs.drawCount as number;
        const wantAtLeast = (inputs.wantAtLeast as number) || 1;

        if (!deck || !targets || !drawn) return null;
        if (targets > deck || drawn > deck || wantAtLeast > targets || wantAtLeast > drawn) return null;

        // Hypergeometric distribution: P(X >= k) = 1 - sum(P(X = i) for i = 0 to k-1)
        // P(X = i) = C(K,i) * C(N-K, n-i) / C(N, n)
        const totalCombinations = combination(deck, drawn);
        let probLessThan = 0;

        for (let i = 0; i < wantAtLeast; i++) {
          const ways = combination(targets, i) * combination(deck - targets, drawn - i);
          probLessThan += ways / totalCombinations;
        }

        const probAtLeast = 1 - probLessThan;
        const probExactly = combination(targets, wantAtLeast) * combination(deck - targets, drawn - wantAtLeast) / totalCombinations;
        const probNone = combination(deck - targets, drawn) / totalCombinations;

        const expectedValue = (drawn * targets) / deck;

        return {
          primary: { label: `P(at least ${wantAtLeast})`, value: formatNumber(probAtLeast * 100, 2) + "%" },
          details: [
            { label: "Deck Size", value: `${deck} cards` },
            { label: "Target Cards", value: `${targets} in deck` },
            { label: "Cards Drawn", value: `${drawn}` },
            { label: `P(exactly ${wantAtLeast})`, value: formatNumber(probExactly * 100, 2) + "%" },
            { label: "P(none drawn)", value: formatNumber(probNone * 100, 2) + "%" },
            { label: "Expected # of Targets Drawn", value: formatNumber(expectedValue, 2) },
            { label: "Total Possible Hands", value: formatNumber(totalCombinations, 0) },
          ],
        };
      },
    },
    {
      id: "poker-hand",
      name: "Poker Hand Odds",
      description: "Reference odds for standard 5-card poker hands",
      fields: [
        {
          name: "handType",
          label: "Poker Hand",
          type: "select",
          options: [
            { label: "Royal Flush", value: "royal_flush" },
            { label: "Straight Flush", value: "straight_flush" },
            { label: "Four of a Kind", value: "four_kind" },
            { label: "Full House", value: "full_house" },
            { label: "Flush", value: "flush" },
            { label: "Straight", value: "straight" },
            { label: "Three of a Kind", value: "three_kind" },
            { label: "Two Pair", value: "two_pair" },
            { label: "One Pair", value: "one_pair" },
            { label: "High Card", value: "high_card" },
          ],
          defaultValue: "full_house",
        },
      ],
      calculate: (inputs) => {
        const handType = inputs.handType as string;

        const pokerHands: Record<string, { combinations: number; name: string }> = {
          royal_flush: { combinations: 4, name: "Royal Flush" },
          straight_flush: { combinations: 36, name: "Straight Flush (excl. Royal)" },
          four_kind: { combinations: 624, name: "Four of a Kind" },
          full_house: { combinations: 3744, name: "Full House" },
          flush: { combinations: 5108, name: "Flush (excl. Straight/Royal)" },
          straight: { combinations: 10200, name: "Straight (excl. Flush)" },
          three_kind: { combinations: 54912, name: "Three of a Kind" },
          two_pair: { combinations: 123552, name: "Two Pair" },
          one_pair: { combinations: 1098240, name: "One Pair" },
          high_card: { combinations: 1302540, name: "High Card" },
        };

        const totalHands = 2598960; // C(52,5)
        const hand = pokerHands[handType];
        if (!hand) return null;

        const prob = hand.combinations / totalHands;
        const odds = Math.round(1 / prob);

        // Cumulative (this hand or better)
        const rankings = ["royal_flush", "straight_flush", "four_kind", "full_house", "flush", "straight", "three_kind", "two_pair", "one_pair", "high_card"];
        let cumulativeCombos = 0;
        for (const rank of rankings) {
          cumulativeCombos += pokerHands[rank].combinations;
          if (rank === handType) break;
        }
        const cumulativeProb = cumulativeCombos / totalHands;

        return {
          primary: { label: hand.name, value: `1 in ${formatNumber(odds, 0)}` },
          details: [
            { label: "Exact Probability", value: formatNumber(prob * 100, 4) + "%" },
            { label: "Possible Combinations", value: formatNumber(hand.combinations, 0) },
            { label: "Total 5-Card Hands", value: formatNumber(totalHands, 0) },
            { label: "This Hand or Better", value: formatNumber(cumulativeProb * 100, 3) + "%" },
            { label: "Odds Against", value: `${formatNumber(odds - 1, 0)}:1` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["d-and-d-dice-calculator", "probability-calculator", "poker-odds-calculator"],
  faq: [
    {
      question: "How is card draw probability calculated?",
      answer:
        "Card draw probability uses the hypergeometric distribution. P(X = k) = C(K,k) x C(N-K, n-k) / C(N, n), where N is deck size, K is target cards, n is cards drawn, and k is successes wanted. It accounts for drawing without replacement.",
    },
    {
      question: "What are the odds of drawing an ace from a standard deck?",
      answer:
        "Drawing at least one ace when drawing 1 card from a 52-card deck: 4/52 = 7.69%. Drawing at least one ace in a 5-card hand: about 34.1%. Drawing at least one ace in a 7-card hand: about 45.3%.",
    },
    {
      question: "How does this apply to trading card games?",
      answer:
        "This calculator works for any card game. For MTG (60-card deck, 7-card opening hand) or Yu-Gi-Oh (40-card deck, 5-card hand), just set the deck size, target card count, and draw count accordingly.",
    },
  ],
  formula:
    "P(X = k) = C(K,k) x C(N-K, n-k) / C(N,n) | P(at least k) = 1 - P(X < k) | Expected value = n x K / N",
};
