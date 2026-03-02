import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const conferenceRoomCalculator: CalculatorDefinition = {
  slug: "conference-room-calculator",
  title: "Conference Room Calculator",
  description: "Determine meeting room capacity based on layout and size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["conference","meeting room","capacity","office"],
  variants: [{
    id: "standard",
    name: "Conference Room",
    description: "Determine meeting room capacity based on layout and size.",
    fields: [
      { name: "roomLength", label: "Room Length (ft)", type: "number", min: 8, max: 100, defaultValue: 20 },
      { name: "roomWidth", label: "Room Width (ft)", type: "number", min: 8, max: 80, defaultValue: 15 },
      { name: "layout", label: "Seating Layout", type: "select", options: [{ value: "25", label: "Theater (25 sqft/person)" }, { value: "30", label: "Classroom (30 sqft/person)" }, { value: "40", label: "Boardroom (40 sqft/person)" }, { value: "15", label: "Standing (15 sqft/person)" }] },
    ],
    calculate: (inputs) => {
    const roomLength = inputs.roomLength as number;
    const roomWidth = inputs.roomWidth as number;
    const layout = inputs.layout as number;
    const totalSqft = roomLength * roomWidth;
    const usableSqft = totalSqft * 0.85;
    const capacity = Math.floor(usableSqft / layout);
    const tablesNeeded = Math.ceil(capacity / 6);
    return { primary: { label: "Room Capacity", value: formatNumber(capacity) + " people" }, details: [{ label: "Total Area", value: formatNumber(totalSqft) + " sq ft" }, { label: "Usable Area", value: formatNumber(usableSqft) + " sq ft" }, { label: "Sq Ft Per Person", value: formatNumber(layout) + " sq ft" }, { label: "Tables Needed (6-person)", value: formatNumber(tablesNeeded) }] };
  },
  }],
  relatedSlugs: ["office-space-per-employee-calculator","cubicle-layout-calculator","church-seating-capacity-calculator"],
  faq: [
    { question: "How much space per person in a conference room?", answer: "Boardroom style needs 40 sq ft; theater style needs about 25 sq ft." },
    { question: "What is the best layout for a meeting room?", answer: "Boardroom for discussions, theater for presentations, classroom for training." },
    { question: "What size room do I need for 20 people?", answer: "About 500 sq ft for theater or 800 sq ft for boardroom style seating." },
  ],
  formula: "Capacity = (Length * Width * 0.85) / SqftPerPerson",
};
