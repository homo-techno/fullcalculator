import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const audioCableLengthCalculator: CalculatorDefinition = {
  slug: "audio-cable-length-calculator",
  title: "Audio Cable Length Calculator",
  description: "Calculate the optimal audio cable length for your setup including signal loss considerations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["audio cable length", "cable run length", "signal loss cable"],
  variants: [{
    id: "standard",
    name: "Audio Cable Length",
    description: "Calculate the optimal audio cable length for your setup including signal loss considerations",
    fields: [
      { name: "distance", label: "Straight-Line Distance", type: "number", suffix: "feet", min: 1, max: 1000, defaultValue: 25 },
      { name: "cableType", label: "Cable Type", type: "select", options: [{value:"xlr",label:"XLR (Balanced)"},{value:"ts",label:"TS/TRS (Unbalanced)"},{value:"speaker",label:"Speaker Cable"},{value:"rca",label:"RCA"}], defaultValue: "xlr" },
      { name: "routing", label: "Routing Complexity", type: "select", options: [{value:"direct",label:"Direct Run"},{value:"moderate",label:"Some Turns"},{value:"complex",label:"Many Turns/Walls"}], defaultValue: "moderate" },
    ],
    calculate: (inputs) => {
      const distance = inputs.distance as number;
      const cableType = inputs.cableType as string;
      const routing = inputs.routing as string;
      if (!distance || distance <= 0) return null;
      const routingMult: Record<string, number> = { direct: 1.1, moderate: 1.3, complex: 1.6 };
      const actualLength = Math.ceil(distance * (routingMult[routing] || 1.3));
      const maxLength: Record<string, number> = { xlr: 200, ts: 25, speaker: 50, rca: 20 };
      const maxRun = maxLength[cableType] || 50;
      const signalLoss = cableType === "xlr" ? "Minimal" : actualLength > maxRun ? "Significant" : "Acceptable";
      const recommendation = actualLength > maxRun ? "Consider using balanced (XLR) cables for this distance" : "Cable length is within recommended range";
      return {
        primary: { label: "Recommended Length", value: formatNumber(actualLength) + " ft" },
        details: [
          { label: "Max Recommended Run", value: maxRun + " ft" },
          { label: "Signal Quality", value: signalLoss },
          { label: "Recommendation", value: recommendation },
        ],
      };
    },
  }],
  relatedSlugs: ["vinyl-record-speed-calculator", "subwoofer-box-calculator"],
  faq: [
    { question: "How long can an audio cable be?", answer: "Balanced XLR cables can run up to 200 feet with minimal signal loss. Unbalanced cables like TS and RCA should be kept under 20-25 feet." },
    { question: "Does cable length affect sound quality?", answer: "Yes, longer unbalanced cables pick up more noise and lose high frequencies. Balanced cables resist interference and can run much longer distances." },
  ],
  formula: "Recommended Length = Straight-Line Distance x Routing Multiplier",
};
