import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const motorcycleLeanAngleCalculator: CalculatorDefinition = {
  slug: "motorcycle-lean-angle-calculator",
  title: "Motorcycle Lean Angle Calculator",
  description: "Free motorcycle lean angle calculator. Calculate the required lean angle for cornering based on speed, turn radius, and road conditions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["motorcycle lean angle", "cornering lean angle", "motorcycle turn calculator", "lean angle speed", "motorcycle physics"],
  variants: [
    {
      id: "lean",
      name: "Calculate Lean Angle",
      description: "Find the lean angle needed for a turn at a given speed",
      fields: [
        { name: "speed", label: "Speed", type: "number", placeholder: "e.g. 45", suffix: "mph" },
        { name: "radius", label: "Turn Radius (feet)", type: "number", placeholder: "e.g. 200" },
        { name: "banking", label: "Road Banking (degrees)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const speedMph = inputs.speed as number;
        const radiusFt = inputs.radius as number;
        const banking = (inputs.banking as number) || 0;
        if (!speedMph || !radiusFt) return null;

        // Convert speed to ft/s
        const speedFps = speedMph * 1.467;

        // Lean angle = arctan(v^2 / (r * g)) - road banking
        const g = 32.174; // ft/s^2
        const leanRad = Math.atan((speedFps * speedFps) / (radiusFt * g));
        const leanDeg = (leanRad * 180) / Math.PI - banking;

        // Centripetal acceleration
        const centripetalG = (speedFps * speedFps) / (radiusFt * g);

        // Max speed for given radius and max lean angle (~50 degrees for sport bikes)
        const maxLeanRad = (50 * Math.PI) / 180;
        const maxSpeedFps = Math.sqrt(Math.tan(maxLeanRad) * radiusFt * g);
        const maxSpeedMph = maxSpeedFps / 1.467;

        let safetyLevel = "Safe";
        if (leanDeg > 50) safetyLevel = "DANGER - exceeds tire limit";
        else if (leanDeg > 45) safetyLevel = "Expert only - near limit";
        else if (leanDeg > 35) safetyLevel = "Aggressive lean";

        return {
          primary: { label: "Required Lean Angle", value: `${formatNumber(leanDeg, 1)}°` },
          details: [
            { label: "Centripetal force", value: `${formatNumber(centripetalG, 2)} G` },
            { label: "Max speed at this radius (50° lean)", value: `${formatNumber(maxSpeedMph, 0)} mph` },
            { label: "Road banking", value: `${banking}°` },
            { label: "Safety level", value: safetyLevel },
          ],
          note: "Most sport bike tires allow up to ~50-55 degrees of lean. Touring tires and cruisers are typically limited to ~35-40 degrees. Wet roads significantly reduce available grip.",
        };
      },
    },
    {
      id: "maxspeed",
      name: "Max Cornering Speed",
      description: "Calculate maximum safe cornering speed",
      fields: [
        { name: "radius", label: "Turn Radius (feet)", type: "number", placeholder: "e.g. 200" },
        { name: "maxLean", label: "Max Lean Angle", type: "select", options: [
          { label: "30° (conservative/cruiser)", value: "30" },
          { label: "35° (moderate)", value: "35" },
          { label: "40° (aggressive/sport touring)", value: "40" },
          { label: "45° (sport riding)", value: "45" },
          { label: "50° (race pace)", value: "50" },
        ], defaultValue: "40" },
        { name: "roadCondition", label: "Road Condition", type: "select", options: [
          { label: "Dry, clean asphalt", value: "1.0" },
          { label: "Dry, some debris", value: "0.85" },
          { label: "Damp / wet", value: "0.6" },
          { label: "Wet with painted lines", value: "0.4" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const radiusFt = inputs.radius as number;
        const maxLean = parseInt(inputs.maxLean as string) || 40;
        const gripFactor = parseFloat(inputs.roadCondition as string) || 1.0;
        if (!radiusFt) return null;

        const g = 32.174;
        const effectiveLean = maxLean * gripFactor;
        const leanRad = (effectiveLean * Math.PI) / 180;
        const maxSpeedFps = Math.sqrt(Math.tan(leanRad) * radiusFt * g);
        const maxSpeedMph = maxSpeedFps / 1.467;
        const maxSpeedKmh = maxSpeedMph * 1.60934;

        const safeSpeed = maxSpeedMph * 0.85; // 15% safety margin

        return {
          primary: { label: "Max Cornering Speed", value: `${formatNumber(maxSpeedMph, 0)} mph` },
          details: [
            { label: "With 15% safety margin", value: `${formatNumber(safeSpeed, 0)} mph` },
            { label: "Max speed (km/h)", value: `${formatNumber(maxSpeedKmh, 0)} km/h` },
            { label: "Effective lean angle", value: `${formatNumber(effectiveLean, 1)}°` },
            { label: "Turn radius", value: `${radiusFt} feet` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["motorcycle-gear-ratio-calculator", "braking-distance-calculator", "acceleration-time-calculator"],
  faq: [
    { question: "How is lean angle calculated?", answer: "Lean angle for a turn is calculated as arctan(v^2 / (r x g)), where v is speed, r is turn radius, and g is gravitational acceleration. A faster speed or tighter radius requires more lean. Road banking reduces the required lean angle." },
    { question: "What is the maximum lean angle for a motorcycle?", answer: "Most sport bikes with modern tires can achieve 50-55 degrees of lean before hard parts (pegs, fairings) touch down. MotoGP bikes reach 63+ degrees. Cruisers are typically limited to 30-35 degrees due to lower ground clearance. The tire's grip and road surface are the ultimate limiting factors." },
    { question: "How does speed affect lean angle?", answer: "Lean angle increases with the square of speed. Going twice as fast through the same turn requires roughly four times the centripetal force, which means significantly more lean. This is why even small speed increases in corners dramatically increase the required lean angle." },
  ],
  formula: "Lean Angle = arctan(v^2 / (r x g)); Max Speed = sqrt(tan(max_lean) x radius x g)",
};
