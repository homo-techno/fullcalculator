import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rockClimbingRopeLengthCalculator: CalculatorDefinition = {
  slug: "rock-climbing-rope-length-calculator",
  title: "Climbing Rope Length Calculator",
  description: "Calculate the rope length needed for rock climbing based on route height and belay setup.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["climbing rope length", "rock climbing rope", "rope sizing"],
  variants: [{
    id: "standard",
    name: "Climbing Rope Length",
    description: "Calculate the rope length needed for rock climbing based on route height and belay setup",
    fields: [
      { name: "routeHeight", label: "Route Height", type: "number", suffix: "feet", min: 10, max: 500, defaultValue: 80 },
      { name: "climbType", label: "Climbing Type", type: "select", options: [{value:"toprope",label:"Top Rope"},{value:"lead",label:"Lead Climbing"},{value:"multipitch",label:"Multi-Pitch"}], defaultValue: "toprope" },
      { name: "anchorSetback", label: "Anchor Setback", type: "number", suffix: "feet", min: 0, max: 50, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const height = inputs.routeHeight as number;
      const type = inputs.climbType as string;
      const setback = inputs.anchorSetback as number;
      if (!height || height <= 0) return null;
      let needed = height * 2 + (setback || 0) + 10;
      if (type === "lead") needed += 15;
      if (type === "multipitch") needed = height + 20;
      const ropeMeters = Math.ceil(needed * 0.3048);
      const recommended = ropeMeters <= 40 ? 40 : ropeMeters <= 50 ? 50 : ropeMeters <= 60 ? 60 : 70;
      return {
        primary: { label: "Minimum Rope Needed", value: formatNumber(Math.ceil(needed)) + " ft" },
        details: [
          { label: "In Meters", value: ropeMeters + " m" },
          { label: "Recommended Rope", value: recommended + " m standard" },
          { label: "Route Height", value: formatNumber(height) + " ft" },
        ],
      };
    },
  }],
  relatedSlugs: ["paddle-board-size-calculator", "skateboard-size-calculator"],
  faq: [
    { question: "How long of a climbing rope do I need?", answer: "For top rope climbing you need at least twice the route height plus extra for anchors and knots. A 60-meter rope covers most single pitch routes." },
    { question: "What is the standard climbing rope length?", answer: "The most common climbing rope lengths are 60 meters and 70 meters. A 60m rope is sufficient for most sport climbing routes." },
  ],
  formula: "Minimum Rope = (Route Height x 2) + Anchor Setback + Safety Buffer",
};
