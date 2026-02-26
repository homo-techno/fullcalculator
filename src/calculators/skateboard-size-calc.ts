import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skateboardSizeCalculator: CalculatorDefinition = {
  slug: "skateboard-size-calculator",
  title: "Skateboard Size Calculator",
  description: "Free skateboard size calculator. Find the right deck width and length based on your height, shoe size, and riding style for the perfect fit.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["skateboard size calculator", "deck width calculator", "skateboard fit", "skateboard deck size", "board size guide"],
  variants: [
    {
      id: "by-measurements",
      name: "By Height & Shoe Size",
      description: "Get deck recommendations based on your body measurements",
      fields: [
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 68", min: 36, max: 84 },
        { name: "shoeSize", label: "Shoe Size (US)", type: "number", placeholder: "e.g. 10", min: 3, max: 16, step: 0.5 },
        { name: "ridingStyle", label: "Riding Style", type: "select", options: [
          { label: "Street / Technical", value: "street" },
          { label: "Park / Transition", value: "park" },
          { label: "Vert / Bowl", value: "vert" },
          { label: "Cruising / Commuting", value: "cruise" },
        ] },
        { name: "age", label: "Age Group", type: "select", options: [
          { label: "Under 8", value: "child" },
          { label: "8-12", value: "youth" },
          { label: "13+", value: "adult" },
        ], defaultValue: "adult" },
      ],
      calculate: (inputs) => {
        const height = parseFloat(inputs.height as string);
        const shoe = parseFloat(inputs.shoeSize as string);
        const style = inputs.ridingStyle as string;
        const age = inputs.age as string;
        if (isNaN(height) || isNaN(shoe)) return null;

        let baseWidth = 7.5;
        if (shoe >= 11) baseWidth = 8.25;
        else if (shoe >= 9.5) baseWidth = 8.0;
        else if (shoe >= 8) baseWidth = 7.75;
        else if (shoe >= 6.5) baseWidth = 7.5;
        else baseWidth = 7.25;

        const styleAdj: Record<string, number> = { street: -0.125, park: 0, vert: 0.25, cruise: 0.375 };
        baseWidth += styleAdj[style] || 0;

        if (age === "child") baseWidth = Math.min(baseWidth, 7.0);
        else if (age === "youth") baseWidth = Math.min(baseWidth, 7.5);

        let deckLength = 31;
        if (height < 46) deckLength = 28;
        else if (height < 56) deckLength = 29;
        else if (height < 63) deckLength = 30.5;
        else if (height < 70) deckLength = 31.5;
        else deckLength = 32;

        const wheelbase = deckLength * 0.44;
        const truckSize = baseWidth >= 8.25 ? "149mm / 159mm" : baseWidth >= 7.75 ? "139mm / 149mm" : "129mm / 139mm";
        const wheelSize = style === "street" ? "50-53mm" : style === "park" ? "53-56mm" : style === "vert" ? "56-60mm" : "56-65mm";

        return {
          primary: { label: "Recommended Deck Width", value: `${formatNumber(baseWidth, 2)}"` },
          details: [
            { label: "Deck Length", value: `${formatNumber(deckLength, 1)}"` },
            { label: "Wheelbase (approx)", value: `${formatNumber(wheelbase, 1)}"` },
            { label: "Truck Size", value: truckSize },
            { label: "Wheel Size", value: wheelSize },
            { label: "Style", value: style.charAt(0).toUpperCase() + style.slice(1) },
            { label: "Width Range", value: `${formatNumber(baseWidth - 0.125, 2)}" - ${formatNumber(baseWidth + 0.125, 2)}"` },
          ],
        };
      },
    },
    {
      id: "truck-match",
      name: "Truck Size Matcher",
      description: "Find the right truck size for your deck width",
      fields: [
        { name: "deckWidth", label: "Deck Width (inches)", type: "number", placeholder: "e.g. 8.0", min: 7.0, max: 10.0, step: 0.125 },
      ],
      calculate: (inputs) => {
        const width = parseFloat(inputs.deckWidth as string);
        if (isNaN(width)) return null;

        let indie = ""; let thunder = ""; let venture = "";
        if (width <= 7.6) { indie = "129"; thunder = "143"; venture = "5.0"; }
        else if (width <= 7.875) { indie = "139"; thunder = "145"; venture = "5.2"; }
        else if (width <= 8.125) { indie = "144"; thunder = "147"; venture = "5.25"; }
        else if (width <= 8.375) { indie = "149"; thunder = "148"; venture = "5.6"; }
        else if (width <= 8.625) { indie = "159"; thunder = "149"; venture = "5.8"; }
        else { indie = "169"; thunder = "151"; venture = "6.1"; }

        return {
          primary: { label: "Independent Size", value: `${indie}mm` },
          details: [
            { label: "Thunder Size", value: `${thunder}mm` },
            { label: "Venture Size", value: `${venture}"` },
            { label: "Deck Width", value: `${formatNumber(width, 3)}"` },
            { label: "Axle Width Should Be", value: `Within 1/4" of deck width` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["shoe-size-converter", "bmi-calculator", "surfboard-size-calculator"],
  faq: [
    { question: "How do I choose the right skateboard deck width?", answer: "Deck width depends mainly on shoe size and riding style. Street skaters prefer narrower boards (7.5-8.0\") for flip tricks, while bowl/vert riders prefer wider boards (8.25-8.5+\") for stability. Your shoe should fit comfortably on the board." },
    { question: "Does height matter for skateboard size?", answer: "Height mainly affects deck length. Taller riders benefit from longer decks (32\"+) with a longer wheelbase for stability. Shorter riders and children should use shorter decks for better control." },
    { question: "What size trucks should I get?", answer: "Truck axle width should match your deck width within 1/4 inch. Too-wide trucks make the board feel sluggish; too-narrow trucks reduce stability." },
  ],
  formula: "Base Width = f(Shoe Size) + Style Adjustment | Deck Length = f(Height) | Trucks should match deck width within 0.25\"",
};
