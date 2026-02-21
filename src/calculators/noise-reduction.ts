import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const noiseReductionCalculator: CalculatorDefinition = {
  slug: "noise-reduction-calculator",
  title: "Noise Reduction Calculator",
  description: "Free noise reduction calculator. Calculate sound level reduction in decibels (dB) for walls, barriers, distance, and hearing protection.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["noise reduction calculator", "decibel calculator", "sound level calculator", "noise barrier calculator", "dB reduction calculator"],
  variants: [
    {
      id: "distance",
      name: "Distance Attenuation",
      description: "Calculate noise reduction from distance",
      fields: [
        { name: "sourceDb", label: "Source Noise Level (dB)", type: "number", placeholder: "e.g. 90" },
        { name: "refDistance", label: "Reference Distance (feet)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "targetDistance", label: "Target Distance (feet)", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const sourceDb = inputs.sourceDb as number;
        const refDist = inputs.refDistance as number;
        const targetDist = inputs.targetDistance as number;
        if (!sourceDb || !refDist || !targetDist) return null;
        // Inverse square law: dB drops 6 dB per doubling of distance (point source)
        const reduction = 20 * Math.log10(targetDist / refDist);
        const resultDb = sourceDb - reduction;
        let perception = "Barely audible";
        if (resultDb > 120) perception = "Pain threshold - immediate hearing damage";
        else if (resultDb > 100) perception = "Extremely loud - hearing damage in minutes";
        else if (resultDb > 85) perception = "Very loud - hearing damage with prolonged exposure";
        else if (resultDb > 70) perception = "Loud - annoying, may interfere with conversation";
        else if (resultDb > 50) perception = "Moderate - normal conversation level";
        else if (resultDb > 30) perception = "Quiet - library level";
        return {
          primary: { label: "Noise at Distance", value: `${formatNumber(resultDb, 1)} dB` },
          details: [
            { label: "Source level", value: `${sourceDb} dB at ${refDist} ft` },
            { label: "Reduction", value: `${formatNumber(reduction, 1)} dB` },
            { label: "Perceived loudness change", value: reduction >= 10 ? `${formatNumber(Math.pow(2, reduction / 10), 1)}× quieter` : `${formatNumber(reduction / 3, 1)} noticeable steps quieter` },
            { label: "Perception", value: perception },
          ],
          note: "Sound drops 6 dB per doubling of distance outdoors (point source). Every 10 dB reduction is perceived as roughly half as loud.",
        };
      },
    },
    {
      id: "barrier",
      name: "Sound Barrier/Wall",
      description: "Calculate noise reduction from a barrier or wall",
      fields: [
        { name: "sourceDb", label: "Source Noise Level (dB)", type: "number", placeholder: "e.g. 80" },
        { name: "barrierType", label: "Barrier Type", type: "select", options: [
          { label: "Single-pane window (STC 26)", value: "26" },
          { label: "Double-pane window (STC 33)", value: "33" },
          { label: "Standard interior wall (STC 35)", value: "35" },
          { label: "Insulated interior wall (STC 45)", value: "45" },
          { label: "Standard exterior wall (STC 45)", value: "45" },
          { label: "Double stud wall (STC 55)", value: "55" },
          { label: "Concrete block wall (STC 50)", value: "50" },
          { label: "Outdoor fence/barrier (10-15 dB)", value: "12" },
          { label: "Dense hedge/trees (3-5 dB)", value: "4" },
        ], defaultValue: "35" },
      ],
      calculate: (inputs) => {
        const sourceDb = inputs.sourceDb as number;
        const stc = parseFloat(inputs.barrierType as string);
        if (!sourceDb || !stc) return null;
        const resultDb = sourceDb - stc;
        return {
          primary: { label: "Noise After Barrier", value: `${formatNumber(Math.max(0, resultDb), 1)} dB` },
          details: [
            { label: "Source level", value: `${sourceDb} dB` },
            { label: "Barrier reduction (STC)", value: `${stc} dB` },
            { label: "Perceived change", value: stc >= 10 ? `${formatNumber(Math.pow(2, stc / 10), 1)}× quieter` : "Noticeable reduction" },
          ],
          note: "STC (Sound Transmission Class) rates how well a wall or barrier blocks airborne sound. Higher STC = better sound isolation. Gaps and flanking paths reduce actual performance.",
        };
      },
    },
    {
      id: "combine",
      name: "Combine Sound Sources",
      description: "Calculate total dB from multiple noise sources",
      fields: [
        { name: "db1", label: "Source 1 (dB)", type: "number", placeholder: "e.g. 80" },
        { name: "db2", label: "Source 2 (dB)", type: "number", placeholder: "e.g. 75" },
        { name: "db3", label: "Source 3 (dB, optional)", type: "number", placeholder: "e.g. 70" },
      ],
      calculate: (inputs) => {
        const db1 = inputs.db1 as number;
        const db2 = inputs.db2 as number;
        const db3 = inputs.db3 as number;
        if (!db1 || !db2) return null;
        const sources = [db1, db2];
        if (db3) sources.push(db3);
        const totalLinear = sources.reduce((sum, db) => sum + Math.pow(10, db / 10), 0);
        const totalDb = 10 * Math.log10(totalLinear);
        const loudest = Math.max(...sources);
        const increase = totalDb - loudest;
        return {
          primary: { label: "Combined Sound Level", value: `${formatNumber(totalDb, 1)} dB` },
          details: [
            { label: "Loudest source", value: `${loudest} dB` },
            { label: "Increase over loudest", value: `+${formatNumber(increase, 1)} dB` },
            { label: "Number of sources", value: `${sources.length}` },
          ],
          note: "Two equal sources add 3 dB. Adding a source 10+ dB quieter than the loudest has almost no effect on the total.",
        };
      },
    },
  ],
  relatedSlugs: ["air-quality-index-calculator", "visibility-distance-calculator", "unit-converter"],
  faq: [
    { question: "How does distance affect sound level?", answer: "Sound level drops by 6 dB each time you double the distance from the source (outdoors, point source). So an 80 dB noise at 10 feet becomes 74 dB at 20 feet, 68 dB at 40 feet, and 62 dB at 80 feet." },
    { question: "How much noise reduction do I need?", answer: "Every 10 dB reduction sounds roughly half as loud. A 20 dB reduction makes noise seem about 1/4 as loud. For comfortable indoor living, aim for 40-50 dB from exterior noise sources (STC 45+). For home theaters, STC 55+ is recommended." },
    { question: "What are common noise levels?", answer: "Whisper: 30 dB, Normal conversation: 60 dB, Vacuum cleaner: 70 dB, Lawn mower: 85-90 dB, Concert: 100-115 dB, Jet engine at 100 ft: 130 dB. Prolonged exposure above 85 dB can cause hearing damage." },
  ],
  formula: "Distance: dB₂ = dB₁ - 20×log₁₀(d₂/d₁) | Combine: dBtotal = 10×log₁₀(10^(dB₁/10) + 10^(dB₂/10))",
};
