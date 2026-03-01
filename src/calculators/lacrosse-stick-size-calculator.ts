import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lacrosseStickSizeCalculator: CalculatorDefinition = {
  slug: "lacrosse-stick-size-calculator",
  title: "Lacrosse Stick Size Calculator",
  description: "Find the correct lacrosse stick length based on player height, position, and age group.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lacrosse stick size", "lacrosse shaft length", "lacrosse equipment"],
  variants: [{
    id: "standard",
    name: "Lacrosse Stick Size",
    description: "Find the correct lacrosse stick length based on player height, position, and age group",
    fields: [
      { name: "height", label: "Player Height", type: "number", suffix: "inches", min: 36, max: 84, defaultValue: 66 },
      { name: "position", label: "Position", type: "select", options: [{value:"attack",label:"Attack"},{value:"midfield",label:"Midfield"},{value:"defense",label:"Defense"},{value:"goalie",label:"Goalie"}], defaultValue: "midfield" },
      { name: "ageGroup", label: "Age Group", type: "select", options: [{value:"youth",label:"Youth (Under 12)"},{value:"highschool",label:"High School"},{value:"college",label:"College/Adult"}], defaultValue: "highschool" },
    ],
    calculate: (inputs) => {
      const height = inputs.height as number;
      const position = inputs.position as string;
      const age = inputs.ageGroup as string;
      if (!height) return null;
      let shaftLength = 30;
      if (age === "youth") {
        shaftLength = height < 48 ? 26 : 30;
      } else if (position === "defense") {
        shaftLength = 60;
      } else if (position === "goalie") {
        shaftLength = 40;
      } else {
        shaftLength = 30;
      }
      const totalLength = shaftLength + 10;
      const headWidth = position === "goalie" ? "12 inches" : position === "defense" ? "6-10 inches" : "6-6.5 inches";
      return {
        primary: { label: "Shaft Length", value: shaftLength + " inches" },
        details: [
          { label: "Total Stick Length", value: totalLength + " inches" },
          { label: "Head Width", value: headWidth },
          { label: "Position", value: position.charAt(0).toUpperCase() + position.slice(1) },
        ],
      };
    },
  }],
  relatedSlugs: ["skateboard-size-calculator", "paddle-board-size-calculator"],
  faq: [
    { question: "How long should a lacrosse stick be?", answer: "Attack and midfield sticks are typically 40 inches total (30 inch shaft). Defense sticks are 60 inches with a longer shaft for reach." },
    { question: "Does position affect lacrosse stick size?", answer: "Yes, defensive players use longer sticks (52-72 inches) for checking range while attackers use shorter sticks (40-42 inches) for ball control." },
  ],
  formula: "Stick Length = Shaft Length + Head Length (approximately 10 inches)",
};
