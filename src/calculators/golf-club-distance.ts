import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const golfClubDistanceCalculator: CalculatorDefinition = {
  slug: "golf-club-distance-calculator",
  title: "Golf Club Distance Calculator",
  description: "Free golf club distance calculator. Estimate carry and total distance by club type, swing speed, and conditions for better course management.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["golf club distance", "golf yardage calculator", "club selection", "swing speed distance", "golf range calculator"],
  variants: [
    {
      id: "by-club",
      name: "Distance by Club",
      description: "Estimate distance based on club type and swing speed",
      fields: [
        { name: "club", label: "Club Type", type: "select", options: [
          { label: "Driver", value: "driver" },
          { label: "3 Wood", value: "3wood" },
          { label: "5 Wood", value: "5wood" },
          { label: "4 Iron / Hybrid", value: "4iron" },
          { label: "5 Iron", value: "5iron" },
          { label: "6 Iron", value: "6iron" },
          { label: "7 Iron", value: "7iron" },
          { label: "8 Iron", value: "8iron" },
          { label: "9 Iron", value: "9iron" },
          { label: "PW", value: "pw" },
          { label: "SW", value: "sw" },
          { label: "LW", value: "lw" },
        ] },
        { name: "swingSpeed", label: "Swing Speed (mph)", type: "number", placeholder: "e.g. 95", min: 50, max: 140 },
        { name: "skillLevel", label: "Skill Level", type: "select", options: [
          { label: "Beginner", value: "beginner" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Advanced", value: "advanced" },
        ], defaultValue: "intermediate" },
      ],
      calculate: (inputs) => {
        const club = inputs.club as string;
        const speed = parseFloat(inputs.swingSpeed as string);
        const skill = inputs.skillLevel as string;
        if (isNaN(speed)) return null;

        const smashFactors: Record<string, number> = {
          driver: 1.48, "3wood": 1.44, "5wood": 1.41, "4iron": 1.36, "5iron": 1.33,
          "6iron": 1.30, "7iron": 1.27, "8iron": 1.24, "9iron": 1.21, pw: 1.18, sw: 1.13, lw: 1.10,
        };
        const loftAngles: Record<string, number> = {
          driver: 10.5, "3wood": 15, "5wood": 18, "4iron": 22, "5iron": 25,
          "6iron": 28, "7iron": 31, "8iron": 35, "9iron": 39, pw: 44, sw: 54, lw: 58,
        };
        const skillMultiplier: Record<string, number> = { beginner: 0.82, intermediate: 0.92, advanced: 1.0 };

        const smash = smashFactors[club] || 1.3;
        const ballSpeed = speed * smash;
        const carryBase = ballSpeed * 2.0;
        const carry = carryBase * (skillMultiplier[skill] || 0.92);
        const rollout = club === "driver" ? carry * 0.12 : club === "3wood" || club === "5wood" ? carry * 0.08 : carry * 0.05;
        const totalDist = carry + rollout;

        return {
          primary: { label: "Total Distance", value: `${formatNumber(totalDist, 0)} yds` },
          details: [
            { label: "Carry Distance", value: `${formatNumber(carry, 0)} yds` },
            { label: "Roll Out", value: `${formatNumber(rollout, 0)} yds` },
            { label: "Ball Speed", value: `${formatNumber(ballSpeed, 0)} mph` },
            { label: "Smash Factor", value: formatNumber(smash, 2) },
            { label: "Loft Angle", value: `${formatNumber(loftAngles[club] || 30, 1)}°` },
            { label: "Skill Modifier", value: `${formatNumber((skillMultiplier[skill] || 0.92) * 100, 0)}%` },
          ],
        };
      },
    },
    {
      id: "club-selection",
      name: "Club Selection Helper",
      description: "Find the right club for a target distance",
      fields: [
        { name: "targetDistance", label: "Target Distance (yards)", type: "number", placeholder: "e.g. 150" },
        { name: "swingSpeed", label: "Driver Swing Speed (mph)", type: "number", placeholder: "e.g. 95" },
        { name: "elevation", label: "Elevation Change", type: "select", options: [
          { label: "Uphill (10+ ft)", value: "uphill" },
          { label: "Level", value: "level" },
          { label: "Downhill (10+ ft)", value: "downhill" },
        ], defaultValue: "level" },
        { name: "wind", label: "Wind Condition", type: "select", options: [
          { label: "Into Wind", value: "headwind" },
          { label: "No Wind", value: "none" },
          { label: "Downwind", value: "tailwind" },
        ], defaultValue: "none" },
      ],
      calculate: (inputs) => {
        const target = parseFloat(inputs.targetDistance as string);
        const driverSpeed = parseFloat(inputs.swingSpeed as string);
        const elevation = inputs.elevation as string;
        const wind = inputs.wind as string;
        if (isNaN(target) || isNaN(driverSpeed)) return null;

        const clubs = [
          { name: "Driver", speedRatio: 1.0, smash: 1.48 },
          { name: "3 Wood", speedRatio: 0.92, smash: 1.44 },
          { name: "5 Wood", speedRatio: 0.89, smash: 1.41 },
          { name: "4 Iron", speedRatio: 0.85, smash: 1.36 },
          { name: "5 Iron", speedRatio: 0.83, smash: 1.33 },
          { name: "6 Iron", speedRatio: 0.80, smash: 1.30 },
          { name: "7 Iron", speedRatio: 0.77, smash: 1.27 },
          { name: "8 Iron", speedRatio: 0.74, smash: 1.24 },
          { name: "9 Iron", speedRatio: 0.71, smash: 1.21 },
          { name: "PW", speedRatio: 0.68, smash: 1.18 },
          { name: "SW", speedRatio: 0.62, smash: 1.13 },
        ];

        let adjTarget = target;
        if (elevation === "uphill") adjTarget *= 1.1;
        else if (elevation === "downhill") adjTarget *= 0.9;
        if (wind === "headwind") adjTarget *= 1.12;
        else if (wind === "tailwind") adjTarget *= 0.92;

        const clubDistances = clubs.map(c => ({
          name: c.name,
          distance: driverSpeed * c.speedRatio * c.smash * 2.0 * 0.92,
        }));

        const best = clubDistances.reduce((prev, curr) =>
          Math.abs(curr.distance - adjTarget) < Math.abs(prev.distance - adjTarget) ? curr : prev
        );

        return {
          primary: { label: "Recommended Club", value: best.name },
          details: [
            { label: "Target Distance", value: `${formatNumber(target, 0)} yds` },
            { label: "Adjusted Distance (conditions)", value: `${formatNumber(adjTarget, 0)} yds` },
            { label: `${best.name} Carry`, value: `${formatNumber(best.distance, 0)} yds` },
            ...clubDistances.slice(0, 6).map(c => ({ label: c.name, value: `${formatNumber(c.distance, 0)} yds` })),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pace-calculator", "calorie-calculator", "pickleball-rating-calculator"],
  faq: [
    { question: "How does swing speed affect distance?", answer: "Ball speed = swing speed x smash factor. A higher swing speed directly increases ball speed and distance. Every 1 mph increase in swing speed typically adds 2-3 yards to driver distance." },
    { question: "What is smash factor?", answer: "Smash factor is the ratio of ball speed to clubhead speed. A perfectly struck driver has a smash factor around 1.48-1.50. Irons have lower smash factors due to their higher loft." },
  ],
  formula: "Ball Speed = Swing Speed x Smash Factor | Carry = Ball Speed x 2.0 x Skill Multiplier | Total = Carry + Rollout",
};
