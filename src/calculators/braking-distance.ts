import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const brakingDistanceCalculator: CalculatorDefinition = {
  slug: "braking-distance-calculator",
  title: "Braking Distance Calculator",
  description: "Free braking distance calculator. Calculate the stopping distance of a vehicle based on speed, road conditions, reaction time, and road grade.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["braking distance", "stopping distance calculator", "vehicle stopping distance", "brake distance formula", "reaction distance"],
  variants: [
    {
      id: "calc",
      name: "Calculate Stopping Distance",
      description: "Calculate total stopping distance from speed and conditions",
      fields: [
        { name: "speed", label: "Speed", type: "number", placeholder: "e.g. 60", suffix: "mph" },
        { name: "reactionTime", label: "Reaction Time", type: "select", options: [
          { label: "1.0 sec (alert driver)", value: "1.0" },
          { label: "1.5 sec (average driver)", value: "1.5" },
          { label: "2.0 sec (tired/distracted)", value: "2.0" },
          { label: "2.5 sec (impaired)", value: "2.5" },
        ], defaultValue: "1.5" },
        { name: "roadCondition", label: "Road Condition", type: "select", options: [
          { label: "Dry asphalt", value: "0.7" },
          { label: "Wet asphalt", value: "0.4" },
          { label: "Packed snow", value: "0.2" },
          { label: "Ice", value: "0.1" },
          { label: "Gravel", value: "0.35" },
        ], defaultValue: "0.7" },
        { name: "grade", label: "Road Grade (%)", type: "number", placeholder: "e.g. 0 (flat)", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const speedMph = inputs.speed as number;
        const reactionTime = parseFloat(inputs.reactionTime as string) || 1.5;
        const friction = parseFloat(inputs.roadCondition as string) || 0.7;
        const grade = (inputs.grade as number) || 0;
        if (!speedMph) return null;

        const speedFps = speedMph * 1.467; // convert mph to ft/s
        const g = 32.174; // gravity in ft/s^2
        const gradeDecimal = grade / 100;

        // Reaction distance
        const reactionDistance = speedFps * reactionTime;

        // Braking distance: v^2 / (2g(f + G))
        const brakingDistance = (speedFps * speedFps) / (2 * g * (friction + gradeDecimal));

        const totalDistance = reactionDistance + brakingDistance;
        const totalDistanceMeters = totalDistance * 0.3048;

        return {
          primary: { label: "Total Stopping Distance", value: `${formatNumber(totalDistance, 0)} feet` },
          details: [
            { label: "Reaction distance", value: `${formatNumber(reactionDistance, 0)} feet` },
            { label: "Braking distance", value: `${formatNumber(brakingDistance, 0)} feet` },
            { label: "Total (metric)", value: `${formatNumber(totalDistanceMeters, 1)} meters` },
            { label: "Car lengths (~15 ft)", value: formatNumber(totalDistance / 15, 1) },
            { label: "Deceleration rate", value: `${formatNumber(friction * g, 1)} ft/s²` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Compare Speeds",
      description: "See how speed affects stopping distance",
      fields: [
        { name: "speed1", label: "Speed 1 (mph)", type: "number", placeholder: "e.g. 30" },
        { name: "speed2", label: "Speed 2 (mph)", type: "number", placeholder: "e.g. 60" },
        { name: "roadCondition", label: "Road Condition", type: "select", options: [
          { label: "Dry asphalt", value: "0.7" },
          { label: "Wet asphalt", value: "0.4" },
          { label: "Snow", value: "0.2" },
          { label: "Ice", value: "0.1" },
        ], defaultValue: "0.7" },
      ],
      calculate: (inputs) => {
        const speed1 = inputs.speed1 as number;
        const speed2 = inputs.speed2 as number;
        const friction = parseFloat(inputs.roadCondition as string) || 0.7;
        if (!speed1 || !speed2) return null;

        const g = 32.174;
        const reactionTime = 1.5;

        const calc = (speedMph: number) => {
          const fps = speedMph * 1.467;
          const reaction = fps * reactionTime;
          const braking = (fps * fps) / (2 * g * friction);
          return reaction + braking;
        };

        const dist1 = calc(speed1);
        const dist2 = calc(speed2);
        const ratio = dist2 / dist1;

        return {
          primary: { label: "Distance Increase", value: `${formatNumber(ratio, 1)}x longer` },
          details: [
            { label: `Stopping at ${speed1} mph`, value: `${formatNumber(dist1, 0)} feet` },
            { label: `Stopping at ${speed2} mph`, value: `${formatNumber(dist2, 0)} feet` },
            { label: "Additional distance", value: `${formatNumber(dist2 - dist1, 0)} feet` },
          ],
          note: "Doubling your speed quadruples the braking distance. This is why speeding dramatically increases accident severity.",
        };
      },
    },
  ],
  relatedSlugs: ["acceleration-time-calculator", "speed-calculator", "force-calculator"],
  faq: [
    { question: "What is the formula for braking distance?", answer: "Braking distance = v² / (2gf), where v is speed in ft/s, g is gravity (32.17 ft/s²), and f is the friction coefficient. Total stopping distance adds reaction distance (speed x reaction time). On dry road at 60 mph, total stopping distance is about 240-300 feet." },
    { question: "Why does stopping distance increase so much with speed?", answer: "Braking distance is proportional to the square of speed. If you double your speed, braking distance quadruples. Going from 30 to 60 mph increases braking distance by 4x, not 2x. This is due to the physics of kinetic energy (KE = 0.5mv²)." },
    { question: "How do road conditions affect stopping distance?", answer: "Wet roads increase stopping distance by about 2x compared to dry roads. Snow increases it by 3-4x, and ice can increase it by 7-10x. This is due to reduced tire friction. ABS helps maintain steering control but does not significantly reduce stopping distance on slippery surfaces." },
  ],
  formula: "Total Stopping Distance = (Speed x Reaction Time) + v² / (2 x g x friction coefficient)",
};
