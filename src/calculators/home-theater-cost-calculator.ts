import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeTheaterCostCalculator: CalculatorDefinition = {
  slug: "home-theater-cost-calculator",
  title: "Home Theater Cost Calculator",
  description: "Estimate the cost of building a dedicated home theater room including equipment, seating, and acoustic treatment.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["home theater cost", "home cinema cost", "theater room cost"],
  variants: [{
    id: "standard",
    name: "Home Theater Cost",
    description: "Estimate the cost of building a dedicated home theater room including equipment, seating, and acoustic treatment",
    fields: [
      { name: "roomSize", label: "Room Size", type: "select", options: [{value:"small",label:"Small (under 150 sq ft)"},{value:"medium",label:"Medium (150-300 sq ft)"},{value:"large",label:"Large (300+ sq ft)"}], defaultValue: "medium" },
      { name: "tier", label: "Equipment Tier", type: "select", options: [{value:"budget",label:"Budget"},{value:"mid",label:"Mid-Range"},{value:"premium",label:"Premium"}], defaultValue: "mid" },
      { name: "seats", label: "Number of Seats", type: "number", suffix: "seats", min: 2, max: 20, defaultValue: 6 },
      { name: "acoustic", label: "Acoustic Treatment", type: "select", options: [{value:"none",label:"None"},{value:"basic",label:"Basic Panels"},{value:"full",label:"Full Treatment"}], defaultValue: "basic" },
    ],
    calculate: (inputs) => {
      const roomSize = inputs.roomSize as string;
      const tier = inputs.tier as string;
      const seats = inputs.seats as number;
      const acoustic = inputs.acoustic as string;
      if (!seats || seats <= 0) return null;
      const projectorCost: Record<string, number> = { budget: 800, mid: 2500, premium: 6000 };
      const audioCost: Record<string, number> = { budget: 1200, mid: 3500, premium: 8000 };
      const screenCost: Record<string, number> = { small: 300, medium: 500, large: 900 };
      const seatCost: Record<string, number> = { budget: 300, mid: 600, premium: 1200 };
      const acousticCost: Record<string, number> = { none: 0, basic: 800, full: 3000 };
      const roomPrepCost: Record<string, number> = { small: 1500, medium: 2500, large: 4000 };
      const projector = projectorCost[tier] || 2500;
      const audio = audioCost[tier] || 3500;
      const screen = screenCost[roomSize] || 500;
      const seating = seats * (seatCost[tier] || 600);
      const acoustics = acousticCost[acoustic] || 800;
      const roomPrep = roomPrepCost[roomSize] || 2500;
      const wiring = 500;
      const total = projector + audio + screen + seating + acoustics + roomPrep + wiring;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Projector/Display", value: "$" + formatNumber(projector) },
          { label: "Audio System", value: "$" + formatNumber(audio) },
          { label: "Screen", value: "$" + formatNumber(screen) },
          { label: "Seating", value: "$" + formatNumber(seating) },
          { label: "Acoustic Treatment", value: "$" + formatNumber(acoustics) },
          { label: "Room Prep and Wiring", value: "$" + formatNumber(roomPrep + wiring) },
        ],
      };
    },
  }],
  relatedSlugs: ["soundproofing-cost-calculator", "basement-finishing-calculator"],
  faq: [
    { question: "How much does a home theater cost?", answer: "A budget home theater can cost $5,000 to $10,000, while a mid-range setup runs $10,000 to $25,000. Premium builds can exceed $50,000." },
    { question: "Is a home theater a good investment?", answer: "A well-designed home theater can add value to your home and provide years of entertainment. It is a worthwhile investment for movie and sports enthusiasts." },
  ],
  formula: "Total = Projector + Audio + Screen + (Seats x Seat Cost) + Acoustics + Room Prep + Wiring",
};
