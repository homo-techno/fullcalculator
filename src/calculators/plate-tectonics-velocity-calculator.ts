import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plateTectonicsVelocityCalculator: CalculatorDefinition = {
  slug: "plate-tectonics-velocity-calculator",
  title: "Plate Tectonics Velocity Calculator",
  description: "Calculate tectonic plate movement rates, displacement over time, and convergence or divergence speeds between two plates.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["plate tectonics velocity","plate movement","continental drift","plate boundary speed","tectonic rate"],
  variants: [{
    id: "standard",
    name: "Plate Tectonics Velocity",
    description: "Calculate tectonic plate movement rates, displacement over time, and convergence or divergence speeds between two plates.",
    fields: [
      { name: "plate1Velocity", label: "Plate 1 Velocity (mm/year)", type: "number", min: 0, max: 200, defaultValue: 60 },
      { name: "plate1Direction", label: "Plate 1 Direction (degrees from N)", type: "number", min: 0, max: 360, defaultValue: 315 },
      { name: "plate2Velocity", label: "Plate 2 Velocity (mm/year)", type: "number", min: 0, max: 200, defaultValue: 25 },
      { name: "plate2Direction", label: "Plate 2 Direction (degrees from N)", type: "number", min: 0, max: 360, defaultValue: 45 },
      { name: "timeYears", label: "Time Period (million years)", type: "number", min: 0.1, max: 500, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const v1 = inputs.plate1Velocity as number;
    const d1 = inputs.plate1Direction as number * Math.PI / 180;
    const v2 = inputs.plate2Velocity as number;
    const d2 = inputs.plate2Direction as number * Math.PI / 180;
    const t = inputs.timeYears as number;
    const v1x = v1 * Math.sin(d1);
    const v1y = v1 * Math.cos(d1);
    const v2x = v2 * Math.sin(d2);
    const v2y = v2 * Math.cos(d2);
    const relVx = v1x - v2x;
    const relVy = v1y - v2y;
    const relVelocity = Math.sqrt(relVx * relVx + relVy * relVy);
    const relDirection = (Math.atan2(relVx, relVy) * 180 / Math.PI + 360) % 360;
    const displacementKm = relVelocity * t * 1e6 / 1e6;
    const plate1DisplKm = v1 * t * 1e6 / 1e6;
    const cmPerYear = relVelocity / 10;
    const boundaryType = relVelocity < 5 ? "Transform/Slow" : "Active Convergent/Divergent";
    return {
      primary: { label: "Relative Velocity", value: formatNumber(parseFloat(relVelocity.toFixed(1))) + " mm/yr" },
      details: [
        { label: "Relative Speed (cm/yr)", value: formatNumber(parseFloat(cmPerYear.toFixed(2))) + " cm/yr" },
        { label: "Relative Direction", value: formatNumber(Math.round(relDirection)) + " degrees" },
        { label: "Displacement in " + t + " Myr", value: formatNumber(Math.round(displacementKm)) + " km" },
        { label: "Plate 1 Travel in " + t + " Myr", value: formatNumber(Math.round(plate1DisplKm)) + " km" },
        { label: "Boundary Activity", value: boundaryType }
      ]
    };
  },
  }],
  relatedSlugs: ["earthquake-magnitude-converter","seismic-wave-velocity-calculator","volcanic-eruption-index-calculator"],
  faq: [
    { question: "How fast do tectonic plates move?", answer: "Most plates move 1 to 10 centimeters per year. The fastest is the Pacific Plate at about 7-10 cm/yr. The slowest plates, like the Antarctic Plate, move less than 2 cm/yr." },
    { question: "What happens at plate boundaries?", answer: "At convergent boundaries, plates collide causing mountains, trenches, and subduction. At divergent boundaries, plates separate creating rift valleys and mid-ocean ridges. Transform boundaries cause lateral sliding and earthquakes." },
    { question: "How is plate velocity measured?", answer: "Modern plate velocities are measured using GPS stations, satellite laser ranging, and very long baseline interferometry. Historical velocities are determined from magnetic anomalies on the ocean floor and hotspot tracks." },
  ],
  formula: "Relative Velocity = sqrt((V1x - V2x)^2 + (V1y - V2y)^2); Vx = V x sin(Direction), Vy = V x cos(Direction); Displacement (km) = Relative Velocity (mm/yr) x Time (Myr)",
};
