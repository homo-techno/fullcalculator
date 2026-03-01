import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const audioRoomTreatmentCalculator: CalculatorDefinition = {
  slug: "audio-room-treatment-calculator",
  title: "Audio Room Treatment Calculator",
  description: "Calculate the acoustic panel coverage needed to treat a room for recording or mixing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["acoustic treatment", "room treatment", "acoustic panel coverage"],
  variants: [{
    id: "standard",
    name: "Audio Room Treatment",
    description: "Calculate the acoustic panel coverage needed to treat a room for recording or mixing",
    fields: [
      { name: "length", label: "Room Length", type: "number", suffix: "feet", min: 5, max: 100, defaultValue: 15 },
      { name: "width", label: "Room Width", type: "number", suffix: "feet", min: 5, max: 100, defaultValue: 12 },
      { name: "height", label: "Room Height", type: "number", suffix: "feet", min: 6, max: 30, defaultValue: 9 },
      { name: "purpose", label: "Room Purpose", type: "select", options: [{value:"recording",label:"Recording Studio"},{value:"mixing",label:"Mixing Room"},{value:"home",label:"Home Studio"},{value:"podcast",label:"Podcast Room"}], defaultValue: "home" },
    ],
    calculate: (inputs) => {
      const len = inputs.length as number;
      const wid = inputs.width as number;
      const ht = inputs.height as number;
      const purpose = inputs.purpose as string;
      if (!len || !wid || !ht) return null;
      const wallArea = 2 * (len * ht + wid * ht);
      const ceilingArea = len * wid;
      const totalSurface = wallArea + ceilingArea;
      const coveragePercent: Record<string, number> = { recording: 0.60, mixing: 0.50, home: 0.40, podcast: 0.70 };
      const coverage = coveragePercent[purpose] || 0.40;
      const panelsNeeded = Math.ceil((totalSurface * coverage) / 8);
      const treatmentArea = Math.round(totalSurface * coverage);
      const cost = panelsNeeded * 45;
      return {
        primary: { label: "Panels Needed (2x4 ft)", value: String(panelsNeeded) },
        details: [
          { label: "Treatment Area", value: formatNumber(treatmentArea) + " sq ft" },
          { label: "Total Surface Area", value: formatNumber(Math.round(totalSurface)) + " sq ft" },
          { label: "Estimated Cost", value: "$" + formatNumber(cost) },
        ],
      };
    },
  }],
  relatedSlugs: ["subwoofer-box-calculator", "pa-system-size-calculator"],
  faq: [
    { question: "How much acoustic treatment do I need?", answer: "Most home studios need 40-50% wall coverage with acoustic panels. Professional recording studios may need 50-70% coverage." },
    { question: "What size acoustic panels should I use?", answer: "Standard panels are 2x4 feet and 2-4 inches thick. Thicker panels absorb lower frequencies more effectively." },
  ],
  formula: "Panels = (Total Surface Area x Coverage Percentage) / Panel Size",
};
