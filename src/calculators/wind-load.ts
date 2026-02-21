import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windLoadCalculator: CalculatorDefinition = {
  slug: "wind-load-calculator",
  title: "Wind Load Calculator",
  description: "Free wind load calculator. Calculate wind pressure on buildings and structures using wind speed, exposure, and surface area.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["wind load calculator", "wind pressure calculator", "wind force on building", "wind load on structure", "wind pressure psf"],
  variants: [
    {
      id: "basic",
      name: "Basic Wind Pressure",
      description: "Calculate wind pressure from wind speed",
      fields: [
        { name: "windSpeed", label: "Wind Speed (mph)", type: "number", placeholder: "e.g. 90" },
        { name: "surfaceArea", label: "Surface Area (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "dragCoeff", label: "Shape/Drag Coefficient", type: "select", options: [
          { label: "Flat Surface (Cd=2.0)", value: "2.0" },
          { label: "Building Wall (Cd=1.3)", value: "1.3" },
          { label: "Cylinder/Pole (Cd=1.2)", value: "1.2" },
          { label: "Sphere (Cd=0.5)", value: "0.5" },
          { label: "Angled Roof (Cd=1.0)", value: "1.0" },
        ], defaultValue: "1.3" },
      ],
      calculate: (inputs) => {
        const v = inputs.windSpeed as number;
        const area = inputs.surfaceArea as number;
        const Cd = parseFloat(inputs.dragCoeff as string) || 1.3;
        if (!v || !area) return null;
        // q = 0.00256 × V² (velocity pressure in psf, standard air density)
        const q = 0.00256 * v * v;
        const pressure = q * Cd;
        const totalForce = pressure * area;
        let category = "Minimal";
        if (v >= 157) category = "EF5 Tornado / Cat 5 Hurricane";
        else if (v >= 130) category = "Cat 4 Hurricane";
        else if (v >= 111) category = "Cat 3 Hurricane";
        else if (v >= 96) category = "Cat 2 Hurricane";
        else if (v >= 74) category = "Cat 1 Hurricane";
        else if (v >= 58) category = "Severe Thunderstorm";
        else if (v >= 40) category = "Strong Wind";
        return {
          primary: { label: "Wind Pressure", value: `${formatNumber(pressure, 1)} psf` },
          details: [
            { label: "Velocity pressure (q)", value: `${formatNumber(q, 2)} psf` },
            { label: "Total force on surface", value: `${formatNumber(totalForce, 0)} lbs (${formatNumber(totalForce / 2000, 2)} tons)` },
            { label: "Wind speed", value: `${v} mph` },
            { label: "Drag coefficient", value: `${Cd}` },
            { label: "Wind classification", value: category },
          ],
          note: "Based on simplified ASCE 7 formula. For actual structural engineering, consult a licensed professional.",
        };
      },
    },
    {
      id: "asce7",
      name: "ASCE 7 Method",
      description: "Full ASCE 7 wind pressure calculation with exposure and height factors",
      fields: [
        { name: "windSpeed", label: "Basic Wind Speed V (mph)", type: "number", placeholder: "e.g. 115" },
        { name: "height", label: "Building Height (ft)", type: "number", placeholder: "e.g. 30" },
        { name: "exposure", label: "Exposure Category", type: "select", options: [
          { label: "B - Urban/Suburban", value: "B" },
          { label: "C - Open Terrain", value: "C" },
          { label: "D - Coastal/Flat", value: "D" },
        ], defaultValue: "C" },
        { name: "surfaceArea", label: "Tributary Area (sq ft)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const v = inputs.windSpeed as number;
        const h = inputs.height as number;
        const exposure = inputs.exposure as string;
        const area = inputs.surfaceArea as number;
        if (!v || !h || !area) return null;
        // Kz approximation based on exposure and height
        const alphaMap: Record<string, number> = { B: 7.0, C: 9.5, D: 11.5 };
        const zgMap: Record<string, number> = { B: 1200, C: 900, D: 700 };
        const alpha = alphaMap[exposure] || 9.5;
        const zg = zgMap[exposure] || 900;
        const z = Math.max(h, 15);
        const Kz = 2.01 * Math.pow(z / zg, 2 / alpha);
        const Kd = 0.85;
        const Kzt = 1.0;
        const qz = 0.00256 * Kz * Kzt * Kd * v * v;
        const G = 0.85;
        const Cp = 0.8;
        const designPressure = qz * G * Cp;
        const totalForce = designPressure * area;
        return {
          primary: { label: "Design Wind Pressure", value: `${formatNumber(designPressure, 1)} psf` },
          details: [
            { label: "Velocity pressure (qz)", value: `${formatNumber(qz, 2)} psf` },
            { label: "Exposure velocity coefficient (Kz)", value: formatNumber(Kz, 3) },
            { label: "Gust factor (G)", value: "0.85" },
            { label: "Pressure coefficient (Cp)", value: "0.8 (windward wall)" },
            { label: "Total force", value: `${formatNumber(totalForce, 0)} lbs` },
          ],
          note: "Simplified ASCE 7-22 calculation. Kd=0.85 (buildings), Kzt=1.0 (flat terrain). For suction on leeward walls, use negative Cp values.",
        };
      },
    },
  ],
  relatedSlugs: ["snow-load-calculator", "wind-chill-calculator", "beaufort-scale-calculator"],
  faq: [
    { question: "How much wind pressure can a building withstand?", answer: "Most residential buildings are designed for 90-130 mph basic wind speeds, producing 20-45 psf design pressures. In hurricane-prone coastal areas, design wind speeds may exceed 170 mph. Building codes specify minimum requirements based on location and occupancy." },
    { question: "What wind speed causes structural damage?", answer: "Minor damage (shingles, siding) starts around 50-60 mph. Significant structural damage begins at 75-90 mph. Major destruction occurs above 110 mph. Tornado-strength winds above 150 mph can level frame buildings." },
    { question: "How does building height affect wind load?", answer: "Wind speed and pressure increase with height above ground due to less surface friction. At 30 feet, wind pressure can be 20-40% higher than at ground level, depending on the terrain exposure category." },
  ],
  formula: "q = 0.00256 × V² (psf) | ASCE 7: qz = 0.00256 × Kz × Kzt × Kd × V²; p = qz × G × Cp",
};
