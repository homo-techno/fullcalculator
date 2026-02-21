import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const motorcycleGearRatioCalculator: CalculatorDefinition = {
  slug: "motorcycle-gear-ratio-calculator",
  title: "Motorcycle Gear Ratio Calculator",
  description: "Free motorcycle gear ratio calculator. Calculate sprocket ratios, top speed, and RPM for different front and rear sprocket combinations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["motorcycle gear ratio", "sprocket calculator", "motorcycle sprocket ratio", "chain drive calculator", "motorcycle top speed"],
  variants: [
    {
      id: "sprocket",
      name: "Sprocket Ratio Calculator",
      description: "Calculate the effect of changing sprockets",
      fields: [
        { name: "stockFront", label: "Stock Front Sprocket (teeth)", type: "number", placeholder: "e.g. 15" },
        { name: "stockRear", label: "Stock Rear Sprocket (teeth)", type: "number", placeholder: "e.g. 45" },
        { name: "newFront", label: "New Front Sprocket (teeth)", type: "number", placeholder: "e.g. 14" },
        { name: "newRear", label: "New Rear Sprocket (teeth)", type: "number", placeholder: "e.g. 48" },
        { name: "tireCirc", label: "Rear Tire Circumference (inches)", type: "number", placeholder: "e.g. 78.5" },
        { name: "redline", label: "Engine Redline (RPM)", type: "number", placeholder: "e.g. 12000" },
        { name: "topGearRatio", label: "Top Gear Internal Ratio", type: "number", placeholder: "e.g. 0.96", step: 0.01 },
      ],
      calculate: (inputs) => {
        const stockFront = inputs.stockFront as number;
        const stockRear = inputs.stockRear as number;
        const newFront = inputs.newFront as number;
        const newRear = inputs.newRear as number;
        const tireCirc = (inputs.tireCirc as number) || 78.5;
        const redline = (inputs.redline as number) || 12000;
        const topGear = (inputs.topGearRatio as number) || 1.0;
        if (!stockFront || !stockRear || !newFront || !newRear) return null;

        const stockRatio = stockRear / stockFront;
        const newRatio = newRear / newFront;
        const percentChange = ((newRatio - stockRatio) / stockRatio) * 100;

        // Higher ratio = more acceleration, less top speed
        // Top speed = (RPM x Tire Circumference) / (Overall Ratio x 1056)
        const stockOverall = stockRatio * topGear;
        const newOverall = newRatio * topGear;

        const stockTopSpeed = (redline * tireCirc) / (stockOverall * 1056);
        const newTopSpeed = (redline * tireCirc) / (newOverall * 1056);
        const speedChange = newTopSpeed - stockTopSpeed;

        const accelerationChange = percentChange > 0 ? "More acceleration" : "Less acceleration";

        return {
          primary: { label: "New Final Drive Ratio", value: `${formatNumber(newRatio, 3)}:1` },
          details: [
            { label: "Stock ratio", value: `${formatNumber(stockRatio, 3)}:1` },
            { label: "Ratio change", value: `${percentChange > 0 ? "+" : ""}${formatNumber(percentChange, 1)}%` },
            { label: "Stock theoretical top speed", value: `${formatNumber(stockTopSpeed, 0)} mph` },
            { label: "New theoretical top speed", value: `${formatNumber(newTopSpeed, 0)} mph` },
            { label: "Speed change", value: `${speedChange > 0 ? "+" : ""}${formatNumber(speedChange, 0)} mph` },
            { label: "Effect", value: accelerationChange },
          ],
          note: "A 1-tooth change on the front sprocket has roughly the same effect as a 3-tooth change on the rear. Smaller front or larger rear = more acceleration, lower top speed.",
        };
      },
    },
    {
      id: "speed",
      name: "Speed at RPM",
      description: "Calculate speed in each gear at a given RPM",
      fields: [
        { name: "rpm", label: "Engine RPM", type: "number", placeholder: "e.g. 8000" },
        { name: "frontTeeth", label: "Front Sprocket (teeth)", type: "number", placeholder: "e.g. 15" },
        { name: "rearTeeth", label: "Rear Sprocket (teeth)", type: "number", placeholder: "e.g. 45" },
        { name: "topGearRatio", label: "Top Gear Internal Ratio", type: "number", placeholder: "e.g. 0.96", step: 0.01 },
        { name: "tireCirc", label: "Rear Tire Circumference (inches)", type: "number", placeholder: "e.g. 78.5" },
        { name: "primaryRatio", label: "Primary Drive Ratio", type: "number", placeholder: "e.g. 1.717", step: 0.001 },
      ],
      calculate: (inputs) => {
        const rpm = inputs.rpm as number;
        const front = inputs.frontTeeth as number;
        const rear = inputs.rearTeeth as number;
        const topGear = (inputs.topGearRatio as number) || 1.0;
        const tireCirc = (inputs.tireCirc as number) || 78.5;
        const primary = (inputs.primaryRatio as number) || 1.0;
        if (!rpm || !front || !rear) return null;

        const sprocketRatio = rear / front;
        const overallRatio = primary * topGear * sprocketRatio;

        // Speed = (RPM x Tire Circ in inches) / (Overall Ratio x 1056)
        const speed = (rpm * tireCirc) / (overallRatio * 1056);
        const wheelRpm = rpm / overallRatio;

        return {
          primary: { label: "Vehicle Speed", value: `${formatNumber(speed, 1)} mph` },
          details: [
            { label: "Sprocket ratio", value: `${formatNumber(sprocketRatio, 3)}:1` },
            { label: "Overall drive ratio", value: `${formatNumber(overallRatio, 3)}:1` },
            { label: "Wheel RPM", value: formatNumber(wheelRpm, 0) },
            { label: "Speed (km/h)", value: `${formatNumber(speed * 1.60934, 1)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gear-ratio-vehicle-calculator", "motorcycle-lean-angle-calculator", "acceleration-time-calculator"],
  faq: [
    { question: "What does changing sprocket size do?", answer: "Going down 1 tooth on the front sprocket (or up ~3 teeth on the rear) increases acceleration by about 6-7% but reduces top speed. Conversely, going up on the front or down on the rear increases top speed but reduces acceleration. Front sprocket changes are more impactful per tooth." },
    { question: "Do I need to change my chain when changing sprockets?", answer: "If you change the overall number of teeth significantly (more than +/- 2 teeth combined), you may need a longer or shorter chain. Adding teeth to the rear requires a longer chain. It is recommended to replace the chain and both sprockets together for even wear." },
    { question: "How do I find my tire circumference?", answer: "Measure the distance your motorcycle travels in one wheel revolution, or calculate from the tire size. For example, a 180/55-17 rear tire has a circumference of about 78.5 inches. You can also use: Circumference = pi x (rim diameter + 2 x sidewall height in inches)." },
  ],
  formula: "Final Drive Ratio = Rear Teeth / Front Teeth; Speed = (RPM x Tire Circumference) / (Overall Ratio x 1056)",
};
