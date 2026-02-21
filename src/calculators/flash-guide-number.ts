import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flashGuideNumberCalculator: CalculatorDefinition = {
  slug: "flash-guide-number-calculator",
  title: "Flash Guide Number Calculator",
  description: "Free flash guide number calculator. Calculate flash power, maximum distance, and required aperture for proper flash exposure in photography.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["flash guide number calculator", "GN calculator", "flash distance calculator", "flash power calculator", "strobe calculator"],
  variants: [
    {
      id: "distance",
      name: "Flash Distance from GN",
      description: "Calculate maximum flash distance",
      fields: [
        { name: "guideNumber", label: "Guide Number (meters, ISO 100)", type: "number", placeholder: "e.g. 58" },
        { name: "aperture", label: "Aperture (f-stop)", type: "select", options: [
          { label: "f/1.4", value: "1.4" },
          { label: "f/2", value: "2" },
          { label: "f/2.8", value: "2.8" },
          { label: "f/4", value: "4" },
          { label: "f/5.6", value: "5.6" },
          { label: "f/8", value: "8" },
          { label: "f/11", value: "11" },
          { label: "f/16", value: "16" },
        ], defaultValue: "5.6" },
        { name: "iso", label: "ISO", type: "select", options: [
          { label: "ISO 100", value: "100" },
          { label: "ISO 200", value: "200" },
          { label: "ISO 400", value: "400" },
          { label: "ISO 800", value: "800" },
          { label: "ISO 1600", value: "1600" },
          { label: "ISO 3200", value: "3200" },
        ], defaultValue: "100" },
      ],
      calculate: (inputs) => {
        const gn = inputs.guideNumber as number;
        const aperture = parseFloat(inputs.aperture as string) || 5.6;
        const iso = parseInt(inputs.iso as string) || 100;
        if (!gn) return null;

        const isoMultiplier = Math.sqrt(iso / 100);
        const effectiveGN = gn * isoMultiplier;
        const distance = effectiveGN / aperture;

        return {
          primary: { label: "Maximum Flash Distance", value: `${formatNumber(distance, 1)} m (${formatNumber(distance * 3.281, 1)} ft)` },
          details: [
            { label: "Guide number (ISO 100)", value: `${gn}` },
            { label: "Effective GN (ISO ${iso})", value: formatNumber(effectiveGN, 1) },
            { label: "Aperture", value: `f/${aperture}` },
            { label: "ISO", value: `${iso}` },
            { label: "ISO multiplier", value: `${formatNumber(isoMultiplier, 2)}x` },
          ],
          note: "Guide number is specified at ISO 100. Higher ISO increases effective range. Distance follows inverse square law.",
        };
      },
    },
    {
      id: "aperture",
      name: "Required Aperture",
      description: "Calculate aperture for a given flash distance",
      fields: [
        { name: "guideNumber", label: "Guide Number (meters, ISO 100)", type: "number", placeholder: "e.g. 58" },
        { name: "distance", label: "Subject Distance (meters)", type: "number", placeholder: "e.g. 4", step: 0.1 },
        { name: "iso", label: "ISO", type: "select", options: [
          { label: "ISO 100", value: "100" },
          { label: "ISO 200", value: "200" },
          { label: "ISO 400", value: "400" },
          { label: "ISO 800", value: "800" },
          { label: "ISO 1600", value: "1600" },
        ], defaultValue: "100" },
      ],
      calculate: (inputs) => {
        const gn = inputs.guideNumber as number;
        const dist = inputs.distance as number;
        const iso = parseInt(inputs.iso as string) || 100;
        if (!gn || !dist) return null;

        const isoMultiplier = Math.sqrt(iso / 100);
        const effectiveGN = gn * isoMultiplier;
        const aperture = effectiveGN / dist;
        const nearestStop = [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32].reduce((prev, curr) =>
          Math.abs(curr - aperture) < Math.abs(prev - aperture) ? curr : prev
        );

        return {
          primary: { label: "Required Aperture", value: `f/${formatNumber(aperture, 1)}` },
          details: [
            { label: "Exact f-stop", value: `f/${formatNumber(aperture, 2)}` },
            { label: "Nearest standard stop", value: `f/${nearestStop}` },
            { label: "Distance", value: `${dist} m` },
            { label: "Effective GN", value: formatNumber(effectiveGN, 1) },
          ],
        };
      },
    },
    {
      id: "power",
      name: "Flash Power Setting",
      description: "Calculate the guide number at reduced power",
      fields: [
        { name: "guideNumber", label: "Full Power Guide Number", type: "number", placeholder: "e.g. 58" },
        { name: "power", label: "Power Level", type: "select", options: [
          { label: "1/1 (Full)", value: "1" },
          { label: "1/2", value: "0.5" },
          { label: "1/4", value: "0.25" },
          { label: "1/8", value: "0.125" },
          { label: "1/16", value: "0.0625" },
          { label: "1/32", value: "0.03125" },
          { label: "1/64", value: "0.015625" },
          { label: "1/128", value: "0.0078125" },
        ], defaultValue: "0.25" },
        { name: "aperture", label: "Aperture (f-stop)", type: "select", options: [
          { label: "f/2.8", value: "2.8" },
          { label: "f/4", value: "4" },
          { label: "f/5.6", value: "5.6" },
          { label: "f/8", value: "8" },
          { label: "f/11", value: "11" },
        ], defaultValue: "5.6" },
      ],
      calculate: (inputs) => {
        const gn = inputs.guideNumber as number;
        const power = parseFloat(inputs.power as string) || 0.25;
        const aperture = parseFloat(inputs.aperture as string) || 5.6;
        if (!gn) return null;

        const reducedGN = gn * Math.sqrt(power);
        const distance = reducedGN / aperture;
        const stopReduction = -Math.log2(power);

        return {
          primary: { label: "Effective GN", value: formatNumber(reducedGN, 1) },
          details: [
            { label: "Full power GN", value: `${gn}` },
            { label: "Power level", value: `1/${Math.round(1 / power)}` },
            { label: "Stops reduced", value: formatNumber(stopReduction, 1) },
            { label: "Max distance at f/${aperture}", value: `${formatNumber(distance, 1)} m` },
            { label: "Recycle time", value: power <= 0.125 ? "Fast" : power <= 0.5 ? "Medium" : "Slow" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["depth-of-field-calculator", "crop-factor-calculator", "photo-print-size-calculator"],
  faq: [
    { question: "What is a flash guide number?", answer: "A guide number (GN) indicates flash power. It equals the maximum distance times the f-stop at ISO 100. GN = Distance × Aperture. A GN of 58 means the flash can illuminate a subject 10.4m away at f/5.6." },
    { question: "How does ISO affect flash range?", answer: "Doubling the ISO increases effective flash range by 1.4x (square root of 2). Going from ISO 100 to 400 doubles the effective guide number, doubling the range." },
    { question: "What does reducing flash power do?", answer: "Each halving of flash power reduces the guide number by 0.7x (1 stop). This reduces range but speeds up recycle time and helps balance flash with ambient light." },
  ],
  formula: "GN = Distance × f-stop | Distance = GN / f-stop | Effective GN = GN × √(ISO/100) | Reduced GN = GN × √(power fraction)",
};
