import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const companionPlantingCalculator: CalculatorDefinition = {
  slug: "companion-planting-calculator",
  title: "Companion Planting Guide Calculator",
  description: "Free companion planting calculator. Find the best companion plants for your garden, discover which plants grow well together, and avoid harmful combinations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["companion planting calculator", "companion planting chart", "what to plant together", "companion planting guide", "garden plant combinations"],
  variants: [
    {
      id: "compatibility",
      name: "Plant Compatibility Check",
      description: "Check if two plants are good companions",
      fields: [
        { name: "plant1", label: "Primary Plant", type: "select", options: [
          { label: "Tomatoes", value: "tomato" },
          { label: "Peppers", value: "pepper" },
          { label: "Cucumbers", value: "cucumber" },
          { label: "Squash", value: "squash" },
          { label: "Beans", value: "bean" },
          { label: "Peas", value: "pea" },
          { label: "Corn", value: "corn" },
          { label: "Carrots", value: "carrot" },
          { label: "Lettuce", value: "lettuce" },
          { label: "Broccoli", value: "broccoli" },
          { label: "Cabbage", value: "cabbage" },
          { label: "Onions", value: "onion" },
          { label: "Garlic", value: "garlic" },
          { label: "Potatoes", value: "potato" },
          { label: "Basil", value: "basil" },
          { label: "Marigolds", value: "marigold" },
        ], defaultValue: "tomato" },
        { name: "plant2", label: "Companion Plant", type: "select", options: [
          { label: "Tomatoes", value: "tomato" },
          { label: "Peppers", value: "pepper" },
          { label: "Cucumbers", value: "cucumber" },
          { label: "Squash", value: "squash" },
          { label: "Beans", value: "bean" },
          { label: "Peas", value: "pea" },
          { label: "Corn", value: "corn" },
          { label: "Carrots", value: "carrot" },
          { label: "Lettuce", value: "lettuce" },
          { label: "Broccoli", value: "broccoli" },
          { label: "Cabbage", value: "cabbage" },
          { label: "Onions", value: "onion" },
          { label: "Garlic", value: "garlic" },
          { label: "Potatoes", value: "potato" },
          { label: "Basil", value: "basil" },
          { label: "Marigolds", value: "marigold" },
        ], defaultValue: "basil" },
      ],
      calculate: (inputs) => {
        const p1 = inputs.plant1 as string;
        const p2 = inputs.plant2 as string;
        if (!p1 || !p2) return null;

        const goodPairs: Record<string, string[]> = {
          tomato: ["basil", "carrot", "marigold", "onion", "garlic", "pepper", "lettuce"],
          pepper: ["tomato", "basil", "carrot", "onion", "marigold"],
          cucumber: ["bean", "pea", "corn", "lettuce", "marigold", "onion"],
          squash: ["corn", "bean", "marigold", "pea"],
          bean: ["corn", "squash", "cucumber", "carrot", "lettuce", "potato"],
          pea: ["carrot", "corn", "cucumber", "lettuce", "bean"],
          corn: ["bean", "squash", "cucumber", "pea"],
          carrot: ["tomato", "pea", "lettuce", "onion", "bean"],
          lettuce: ["carrot", "onion", "bean", "pea", "cucumber", "tomato"],
          broccoli: ["onion", "garlic", "lettuce", "potato"],
          cabbage: ["onion", "garlic", "bean", "lettuce"],
          onion: ["carrot", "lettuce", "tomato", "pepper", "broccoli", "cabbage"],
          garlic: ["tomato", "pepper", "broccoli", "cabbage", "carrot"],
          potato: ["bean", "corn", "cabbage", "broccoli", "marigold"],
          basil: ["tomato", "pepper", "marigold"],
          marigold: ["tomato", "pepper", "cucumber", "squash", "potato", "basil"],
        };

        const badPairs: Record<string, string[]> = {
          tomato: ["cabbage", "broccoli", "corn", "potato"],
          pepper: ["bean", "broccoli", "cabbage"],
          cucumber: ["potato", "garlic"],
          squash: ["potato"],
          bean: ["onion", "garlic", "pepper"],
          pea: ["onion", "garlic"],
          corn: ["tomato"],
          carrot: ["cabbage"],
          broccoli: ["tomato", "pepper", "squash"],
          cabbage: ["tomato", "pepper", "squash"],
          onion: ["bean", "pea"],
          garlic: ["bean", "pea", "cucumber"],
          potato: ["tomato", "cucumber", "squash"],
        };

        const isGood = goodPairs[p1]?.includes(p2) || goodPairs[p2]?.includes(p1);
        const isBad = badPairs[p1]?.includes(p2) || badPairs[p2]?.includes(p1);

        const benefits: Record<string, string> = {
          tomato: "Heavy feeder, benefits from nitrogen fixers nearby",
          basil: "Repels aphids and whiteflies, improves tomato flavor",
          marigold: "Repels nematodes, aphids, and many garden pests",
          bean: "Fixes nitrogen in the soil for neighboring plants",
          corn: "Provides structure for climbing beans",
          carrot: "Loosens soil, different root depth than companions",
          onion: "Deters pests with strong scent",
          garlic: "Natural fungicide and pest deterrent",
        };

        const compatibility = isBad ? "Bad Companions" : isGood ? "Great Companions" : "Neutral";
        const plantNames: Record<string, string> = {
          tomato: "Tomatoes", pepper: "Peppers", cucumber: "Cucumbers", squash: "Squash",
          bean: "Beans", pea: "Peas", corn: "Corn", carrot: "Carrots", lettuce: "Lettuce",
          broccoli: "Broccoli", cabbage: "Cabbage", onion: "Onions", garlic: "Garlic",
          potato: "Potatoes", basil: "Basil", marigold: "Marigolds",
        };

        return {
          primary: { label: "Compatibility", value: compatibility },
          details: [
            { label: "Plant 1", value: plantNames[p1] || p1 },
            { label: "Plant 2", value: plantNames[p2] || p2 },
            { label: "Plant 1 note", value: benefits[p1] || "Standard garden plant" },
            { label: "Plant 2 note", value: benefits[p2] || "Standard garden plant" },
            { label: "Recommendation", value: isBad ? "Keep these plants apart in different beds" : isGood ? "Plant these together for mutual benefits" : "These plants neither help nor harm each other" },
          ],
          note: isBad ? "These plants can stunt each other's growth, attract shared pests, or compete for the same nutrients." : isGood ? "Companion planting can improve growth, deter pests, and maximize garden space." : "These plants can be grown near each other without significant positive or negative effects.",
        };
      },
    },
    {
      id: "three-sisters",
      name: "Three Sisters Planting",
      description: "Calculate spacing for the classic corn, beans, squash trio",
      fields: [
        { name: "plotLength", label: "Plot Length (ft)", type: "number", placeholder: "e.g. 20" },
        { name: "plotWidth", label: "Plot Width (ft)", type: "number", placeholder: "e.g. 10" },
        { name: "hillSpacing", label: "Hill Spacing (ft)", type: "select", options: [
          { label: "4 feet (standard)", value: "4" },
          { label: "5 feet (spacious)", value: "5" },
          { label: "6 feet (large varieties)", value: "6" },
        ], defaultValue: "4" },
      ],
      calculate: (inputs) => {
        const length = inputs.plotLength as number;
        const width = inputs.plotWidth as number;
        const hillSpacing = parseInt(inputs.hillSpacing as string);
        if (!length || !width || !hillSpacing) return null;

        const hillsPerRow = Math.floor(length / hillSpacing);
        const numRows = Math.floor(width / hillSpacing);
        const totalHills = hillsPerRow * numRows;
        const cornPerHill = 4;
        const beansPerHill = 4;
        const squashPerHill = 1;

        return {
          primary: { label: "Total Hills", value: `${totalHills}` },
          details: [
            { label: "Corn seeds needed", value: `${totalHills * cornPerHill} (${cornPerHill} per hill)` },
            { label: "Bean seeds needed", value: `${totalHills * beansPerHill} (${beansPerHill} per hill)` },
            { label: "Squash plants", value: `${totalHills * squashPerHill} (1 per hill)` },
            { label: "Hills per row", value: `${hillsPerRow}` },
            { label: "Number of rows", value: `${numRows}` },
            { label: "Plot area", value: `${formatNumber(length * width, 0)} sq ft` },
          ],
          note: "Three Sisters: Plant 4 corn seeds per mound. When corn is 6\" tall, plant 4 bean seeds around each mound. Plant squash between mounds. Beans fix nitrogen, corn supports beans, squash shades soil.",
        };
      },
    },
  ],
  relatedSlugs: ["crop-rotation-calculator", "plant-spacing-calculator", "garden-yield-calculator"],
  faq: [
    { question: "What is companion planting?", answer: "Companion planting is the practice of growing certain plants together for mutual benefit. Benefits include pest control (marigolds repel nematodes), pollination improvement, nutrient sharing (beans fix nitrogen), and space optimization." },
    { question: "What are the best companion plants for tomatoes?", answer: "The best companions for tomatoes are basil (repels pests, improves flavor), marigolds (repel nematodes), carrots (loosen soil), garlic (natural fungicide), and lettuce (ground cover). Avoid planting tomatoes near cabbage, broccoli, or potatoes." },
    { question: "What is the Three Sisters planting method?", answer: "The Three Sisters is a Native American planting technique combining corn, beans, and squash. Corn provides a structure for beans to climb, beans fix nitrogen in the soil, and squash leaves shade the ground to retain moisture and suppress weeds." },
  ],
  formula: "Three Sisters: Hills = (Plot Length / Spacing) × (Plot Width / Spacing) | Seeds per hill: 4 corn, 4 beans, 1 squash",
};
