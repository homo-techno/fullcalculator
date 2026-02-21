import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compostRatioCalculator: CalculatorDefinition = {
  slug: "compost-ratio-calculator",
  title: "Compost Ratio Calculator",
  description: "Free compost ratio calculator. Calculate the ideal green to brown ratio (carbon to nitrogen) for your compost pile to ensure fast, odor-free decomposition.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["compost ratio calculator", "carbon nitrogen ratio compost", "green brown ratio compost", "compost bin calculator", "CN ratio calculator"],
  variants: [
    {
      id: "green-brown",
      name: "Green/Brown Ratio",
      description: "Calculate the right mix of greens and browns for composting",
      fields: [
        { name: "greenType", label: "Green Material (Nitrogen)", type: "select", options: [
          { label: "Grass Clippings (C:N 20:1)", value: "grass" },
          { label: "Kitchen Scraps (C:N 15:1)", value: "kitchen" },
          { label: "Coffee Grounds (C:N 20:1)", value: "coffee" },
          { label: "Fresh Manure (C:N 15:1)", value: "manure" },
          { label: "Green Garden Waste (C:N 25:1)", value: "greenwaste" },
          { label: "Alfalfa/Clover (C:N 12:1)", value: "alfalfa" },
        ], defaultValue: "kitchen" },
        { name: "greenAmount", label: "Green Material Amount (gallons)", type: "number", placeholder: "e.g. 5" },
        { name: "brownType", label: "Brown Material (Carbon)", type: "select", options: [
          { label: "Dry Leaves (C:N 60:1)", value: "leaves" },
          { label: "Straw/Hay (C:N 80:1)", value: "straw" },
          { label: "Cardboard (C:N 350:1)", value: "cardboard" },
          { label: "Newspaper (C:N 175:1)", value: "newspaper" },
          { label: "Wood Chips (C:N 400:1)", value: "woodchips" },
          { label: "Sawdust (C:N 325:1)", value: "sawdust" },
          { label: "Pine Needles (C:N 80:1)", value: "pine" },
          { label: "Corn Stalks (C:N 75:1)", value: "cornstalk" },
        ], defaultValue: "leaves" },
        { name: "brownAmount", label: "Brown Material Amount (gallons)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const greenType = inputs.greenType as string;
        const greenAmt = inputs.greenAmount as number;
        const brownType = inputs.brownType as string;
        const brownAmt = inputs.brownAmount as number;
        if (!greenAmt || !brownAmt) return null;

        const greenCN: Record<string, number> = {
          grass: 20, kitchen: 15, coffee: 20, manure: 15, greenwaste: 25, alfalfa: 12,
        };
        const brownCN: Record<string, number> = {
          leaves: 60, straw: 80, cardboard: 350, newspaper: 175, woodchips: 400, sawdust: 325, pine: 80, cornstalk: 75,
        };

        const gCN = greenCN[greenType] || 20;
        const bCN = brownCN[brownType] || 60;
        const weightedCN = (greenAmt * gCN + brownAmt * bCN) / (greenAmt + brownAmt);
        const idealCN = 30;
        const ratio = brownAmt / greenAmt;

        const isGood = weightedCN >= 25 && weightedCN <= 35;
        const tooMuchCarbon = weightedCN > 35;
        const tooMuchNitrogen = weightedCN < 25;

        let recommendation = "Your mix is well balanced!";
        let idealBrown = greenAmt * (idealCN - gCN) / (bCN - idealCN);
        if (idealBrown < 0) idealBrown = greenAmt;

        if (tooMuchCarbon) recommendation = "Add more green material or use a lower-carbon brown";
        if (tooMuchNitrogen) recommendation = "Add more brown material to absorb excess nitrogen";

        return {
          primary: { label: "C:N Ratio", value: `${formatNumber(weightedCN, 0)}:1 (${isGood ? "Ideal" : tooMuchCarbon ? "Too High" : "Too Low"})` },
          details: [
            { label: "Current ratio", value: `${formatNumber(weightedCN, 1)}:1` },
            { label: "Ideal range", value: "25:1 to 35:1" },
            { label: "Brown:Green volume ratio", value: `${formatNumber(ratio, 1)}:1` },
            { label: "Status", value: isGood ? "Well balanced" : "Needs adjustment" },
            { label: "Ideal brown amount for this green", value: `${formatNumber(idealBrown, 1)} gallons` },
            { label: "Recommendation", value: recommendation },
          ],
          note: "The ideal C:N ratio for composting is 25-35:1. Too much carbon (browns) slows decomposition. Too much nitrogen (greens) causes odor and attracts pests.",
        };
      },
    },
    {
      id: "pile-size",
      name: "Compost Pile Size",
      description: "Calculate if your compost pile is big enough for hot composting",
      fields: [
        { name: "length", label: "Pile Length (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "width", label: "Pile Width (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "height", label: "Pile Height (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "method", label: "Composting Method", type: "select", options: [
          { label: "Hot Composting (Active)", value: "hot" },
          { label: "Cold Composting (Passive)", value: "cold" },
          { label: "Tumbler", value: "tumbler" },
        ], defaultValue: "hot" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        const method = inputs.method as string;
        if (!length || !width || !height) return null;

        const volume = length * width * height;
        const cubicYards = volume / 27;
        const minHotCompost = 27;
        const canHotCompost = volume >= minHotCompost;
        const daysToFinish = method === "hot" ? (canHotCompost ? "30-90" : "90-180") : method === "cold" ? "180-365" : "60-120";
        const finishedCompost = volume * 0.5;

        return {
          primary: { label: "Pile Volume", value: `${formatNumber(volume, 1)} cu ft (${formatNumber(cubicYards, 2)} cu yd)` },
          details: [
            { label: "Hot composting viable?", value: canHotCompost ? "Yes (minimum 3×3×3 ft met)" : "No (pile too small, needs 27+ cu ft)" },
            { label: "Estimated time to finish", value: `${daysToFinish} days` },
            { label: "Finished compost yield", value: `~${formatNumber(finishedCompost, 1)} cu ft (50% of original)` },
            { label: "Method", value: method === "hot" ? "Hot (turn every 3-5 days)" : method === "cold" ? "Cold (turn monthly)" : "Tumbler (spin 3x/week)" },
            { label: "Internal temp goal", value: method === "hot" ? "130-160°F" : "Ambient" },
          ],
          note: "Hot composting requires a minimum pile size of 3×3×3 feet (27 cu ft) to generate enough heat. Keep moisture like a wrung-out sponge.",
        };
      },
    },
  ],
  relatedSlugs: ["compost-calculator", "worm-composting-calculator", "soil-amendment-calculator"],
  faq: [
    { question: "What is the ideal carbon to nitrogen ratio for compost?", answer: "The ideal C:N ratio is 25:1 to 35:1, with 30:1 being optimal. This is roughly achieved by mixing 3 parts brown materials (carbon) to 1 part green materials (nitrogen) by volume. The correct ratio ensures fast decomposition without odors." },
    { question: "What are examples of green and brown compost materials?", answer: "Greens (nitrogen): grass clippings, kitchen scraps, coffee grounds, fresh manure, green plant trimmings. Browns (carbon): dry leaves, straw, cardboard, newspaper, wood chips, sawdust. Avoid meat, dairy, and pet waste." },
    { question: "Why does my compost smell bad?", answer: "Bad odor usually means too much nitrogen (greens) or too much moisture. Add brown materials like dry leaves or shredded cardboard, and turn the pile to add oxygen. A well-balanced compost pile should smell earthy, not rotten." },
  ],
  formula: "Weighted C:N = (Green Volume × Green C:N + Brown Volume × Brown C:N) / (Green + Brown Volume) | Ideal: 25-35:1",
};
