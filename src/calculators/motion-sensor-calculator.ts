import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const motionSensorCalculator: CalculatorDefinition = {
  slug: "motion-sensor-calculator",
  title: "Motion Sensor Calculator",
  description: "Determine how many motion sensors are needed for an area.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["motion sensor","motion detector calculator"],
  variants: [{
    id: "standard",
    name: "Motion Sensor",
    description: "Determine how many motion sensors are needed for an area.",
    fields: [
      { name: "roomLength", label: "Room Length (ft)", type: "number", min: 5, max: 200, defaultValue: 20 },
      { name: "roomWidth", label: "Room Width (ft)", type: "number", min: 5, max: 200, defaultValue: 15 },
      { name: "sensorRange", label: "Sensor Range (ft)", type: "number", min: 5, max: 60, defaultValue: 30 },
      { name: "rooms", label: "Number of Rooms", type: "number", min: 1, max: 50, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const l = inputs.roomLength as number;
      const w = inputs.roomWidth as number;
      const r = inputs.sensorRange as number;
      const rooms = inputs.rooms as number;
      if (!l || !w || !r || !rooms) return null;
      const roomArea = l * w;
      const sensorCoverage = Math.PI * r * r;
      const sensorsPerRoom = Math.ceil(roomArea / sensorCoverage);
      const total = sensorsPerRoom * rooms;
      return {
        primary: { label: "Total Sensors Needed", value: formatNumber(total) },
        details: [
          { label: "Sensors Per Room", value: formatNumber(sensorsPerRoom) },
          { label: "Room Area", value: formatNumber(roomArea) + " sq ft" },
          { label: "Sensor Coverage", value: formatNumber(Math.round(sensorCoverage)) + " sq ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Where should I place motion sensors?", answer: "Place sensors in hallways, stairways, and main living areas at 6 to 8 feet high." },
    { question: "Do motion sensors work with pets?", answer: "Pet-immune sensors ignore animals under 40 to 80 pounds depending on the model." },
  ],
  formula: "Sensors = ceil(Room Area / Sensor Coverage) x Rooms",
};
