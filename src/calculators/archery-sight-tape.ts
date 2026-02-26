import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const archerySightTapeCalculator: CalculatorDefinition = {
  slug: "archery-sight-tape-calculator",
  title: "Archery Sight Tape & Pin Calculator",
  description: "Free online archery sight tape calculator. Calculate sight pin settings and tape marks for compound and recurve bows at various distances.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["archery sight tape calculator", "bow sight calculator", "archery pin calculator", "sight mark calculator", "archery distance calculator"],
  variants: [
    {
      id: "pin-gap",
      name: "Pin Gap Calculator",
      description: "Calculate the gap between sight pins based on two known distances",
      fields: [
        { name: "nearDist", label: "Near Pin Distance (yards)", type: "number", placeholder: "e.g. 20" },
        { name: "nearSight", label: "Near Pin Sight Mark (mm from top)", type: "number", placeholder: "e.g. 30" },
        { name: "farDist", label: "Far Pin Distance (yards)", type: "number", placeholder: "e.g. 40" },
        { name: "farSight", label: "Far Pin Sight Mark (mm from top)", type: "number", placeholder: "e.g. 50" },
        { name: "targetDist", label: "Target Distance (yards)", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const nearDist = parseFloat(inputs.nearDist as string) || 0;
        const nearSight = parseFloat(inputs.nearSight as string) || 0;
        const farDist = parseFloat(inputs.farDist as string) || 0;
        const farSight = parseFloat(inputs.farSight as string) || 0;
        const targetDist = parseFloat(inputs.targetDist as string) || 0;
        if (!nearDist || !farDist || !targetDist || nearDist === farDist) return null;

        const mmPerYard = (farSight - nearSight) / (farDist - nearDist);
        const targetMark = nearSight + mmPerYard * (targetDist - nearDist);
        const pinGap = farSight - nearSight;

        return {
          primary: { label: "Sight Mark at Target Distance", value: `${formatNumber(targetMark, 1)} mm` },
          details: [
            { label: "Movement per yard", value: `${formatNumber(mmPerYard, 2)} mm/yard` },
            { label: "Total pin gap (near to far)", value: `${formatNumber(pinGap, 1)} mm` },
            { label: "Near pin", value: `${formatNumber(nearSight, 1)} mm @ ${nearDist} yds` },
            { label: "Far pin", value: `${formatNumber(farSight, 1)} mm @ ${farDist} yds` },
            { label: "Target distance", value: `${formatNumber(targetDist)} yards` },
          ],
          note: "This uses linear interpolation. Arrow trajectory is parabolic, so accuracy decreases at extreme distances. Verify with practice shots.",
        };
      },
    },
    {
      id: "arrow-drop",
      name: "Arrow Drop Estimator",
      description: "Estimate arrow drop at various distances based on arrow speed",
      fields: [
        { name: "arrowSpeed", label: "Arrow Speed (fps)", type: "number", placeholder: "e.g. 280" },
        { name: "targetDist", label: "Target Distance (yards)", type: "number", placeholder: "e.g. 40" },
        { name: "sightHeight", label: "Sight Height Above Arrow (inches)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const speed = parseFloat(inputs.arrowSpeed as string) || 0;
        const distYards = parseFloat(inputs.targetDist as string) || 0;
        const sightHeight = parseFloat(inputs.sightHeight as string) || 3;
        if (!speed || !distYards) return null;

        const distFeet = distYards * 3;
        const distInches = distFeet * 12;
        const flightTime = distFeet / speed;
        const gravDrop = 0.5 * 386.4 * flightTime * flightTime;
        const totalDrop = gravDrop;

        const distances = [10, 20, 30, 40, 50, 60];
        const drops = distances.map((d) => {
          const ft = d * 3;
          const t = ft / speed;
          const drop = 0.5 * 386.4 * t * t;
          return { dist: d, drop };
        });

        return {
          primary: { label: `Arrow Drop at ${distYards} yds`, value: `${formatNumber(totalDrop, 1)} inches` },
          details: [
            { label: "Flight time", value: `${formatNumber(flightTime, 3)} seconds` },
            { label: "Arrow speed", value: `${formatNumber(speed)} fps` },
            ...drops.map((d) => ({
              label: `Drop at ${d.dist} yds`,
              value: `${formatNumber(d.drop, 1)} inches`,
            })),
          ],
          note: "Actual arrow drop is affected by drag, fletching, arrow weight, and wind. This is a gravity-only estimate.",
        };
      },
    },
  ],
  relatedSlugs: ["speed-calculator", "acceleration-calculator"],
  faq: [
    { question: "How do sight tapes work?", answer: "Sight tapes are calibrated strips attached to your bow sight that allow you to set precise aim points for various distances. They're created by shooting known distances and mapping sight positions." },
    { question: "How do I set up multi-pin sights?", answer: "Start by setting your top pin at your closest distance (usually 20 yards). Then set each subsequent pin at 10-yard increments (30, 40, 50 yards). Fine-tune by shooting groups at each distance." },
    { question: "What affects arrow drop?", answer: "Arrow speed (draw weight and arrow weight), distance, wind, arrow fletching, and gravity all affect drop. Faster arrows (higher draw weight, lighter arrows) have less drop at the same distance." },
  ],
  formula: "Arrow Drop (in) = 0.5 × 386.4 × (Distance ft / Speed fps)²",
};
