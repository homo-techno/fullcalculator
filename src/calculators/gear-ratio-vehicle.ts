import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gearRatioVehicleCalculator: CalculatorDefinition = {
  slug: "gear-ratio-vehicle-calculator",
  title: "Vehicle Gear Ratio Calculator",
  description: "Free vehicle gear ratio calculator. Calculate final drive ratio, tire RPM, vehicle speed at a given RPM, and optimal gear ratios for your drivetrain.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["gear ratio calculator", "final drive ratio", "vehicle RPM calculator", "tire speed calculator", "differential ratio"],
  variants: [
    {
      id: "speed",
      name: "Speed from RPM",
      description: "Calculate vehicle speed from engine RPM and gearing",
      fields: [
        { name: "rpm", label: "Engine RPM", type: "number", placeholder: "e.g. 3000" },
        { name: "gearRatio", label: "Transmission Gear Ratio", type: "number", placeholder: "e.g. 1.0 (for top gear)", step: 0.01 },
        { name: "finalDrive", label: "Final Drive (Axle) Ratio", type: "number", placeholder: "e.g. 3.73", step: 0.01 },
        { name: "tireDiameter", label: "Tire Diameter (inches)", type: "number", placeholder: "e.g. 26.5" },
      ],
      calculate: (inputs) => {
        const rpm = inputs.rpm as number;
        const gearRatio = inputs.gearRatio as number;
        const finalDrive = inputs.finalDrive as number;
        const tireDia = inputs.tireDiameter as number;
        if (!rpm || !gearRatio || !finalDrive || !tireDia) return null;

        // Speed = (RPM x Tire Circumference) / (Gear Ratio x Final Drive x 336)
        // 336 is the conversion constant for inches to mph with RPM
        const speed = (rpm * tireDia) / (gearRatio * finalDrive * 336);

        const tireRpm = rpm / (gearRatio * finalDrive);
        const overallRatio = gearRatio * finalDrive;
        const tireCircumference = Math.PI * tireDia;
        const tireCircFeet = tireCircumference / 12;

        return {
          primary: { label: "Vehicle Speed", value: `${formatNumber(speed, 1)} mph` },
          details: [
            { label: "Overall drive ratio", value: `${formatNumber(overallRatio, 2)}:1` },
            { label: "Tire RPM", value: formatNumber(tireRpm, 0) },
            { label: "Tire circumference", value: `${formatNumber(tireCircumference, 1)} inches` },
            { label: "Speed in km/h", value: `${formatNumber(speed * 1.60934, 1)} km/h` },
          ],
        };
      },
    },
    {
      id: "rpm",
      name: "RPM from Speed",
      description: "Calculate engine RPM from vehicle speed and gearing",
      fields: [
        { name: "speed", label: "Vehicle Speed (mph)", type: "number", placeholder: "e.g. 70" },
        { name: "gearRatio", label: "Transmission Gear Ratio", type: "number", placeholder: "e.g. 0.75 (overdrive)", step: 0.01 },
        { name: "finalDrive", label: "Final Drive (Axle) Ratio", type: "number", placeholder: "e.g. 3.73", step: 0.01 },
        { name: "tireDiameter", label: "Tire Diameter (inches)", type: "number", placeholder: "e.g. 26.5" },
      ],
      calculate: (inputs) => {
        const speed = inputs.speed as number;
        const gearRatio = inputs.gearRatio as number;
        const finalDrive = inputs.finalDrive as number;
        const tireDia = inputs.tireDiameter as number;
        if (!speed || !gearRatio || !finalDrive || !tireDia) return null;

        const rpm = (speed * gearRatio * finalDrive * 336) / tireDia;
        const overallRatio = gearRatio * finalDrive;

        let rpmZone = "Cruising";
        if (rpm > 6000) rpmZone = "Redline danger";
        else if (rpm > 4500) rpmZone = "High RPM";
        else if (rpm > 2500) rpmZone = "Power band";
        else if (rpm < 1200) rpmZone = "Lugging (too low)";

        return {
          primary: { label: "Engine RPM", value: formatNumber(rpm, 0) },
          details: [
            { label: "Overall drive ratio", value: `${formatNumber(overallRatio, 2)}:1` },
            { label: "RPM zone", value: rpmZone },
            { label: "Speed", value: `${speed} mph` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["acceleration-time-calculator", "wheel-offset-calculator", "motorcycle-gear-ratio-calculator"],
  faq: [
    { question: "What is a final drive ratio?", answer: "The final drive ratio (also called axle ratio or differential ratio) is the last gear reduction between the transmission and the wheels. A higher number (e.g., 4.10) provides more acceleration but lower top speed and higher RPM at highway speeds. A lower number (e.g., 3.08) provides better highway fuel economy but slower acceleration." },
    { question: "How do I find my tire diameter?", answer: "Tire diameter can be calculated from the tire size. For example, 265/70R17: width is 265mm, aspect ratio is 70%, rim is 17 inches. Sidewall height = 265 x 0.70 = 185.5mm = 7.3 inches. Diameter = (7.3 x 2) + 17 = 31.6 inches. Many online tools can calculate this from your tire size." },
    { question: "What gear ratio is best for towing?", answer: "Higher numerical ratios like 3.73 or 4.10 are better for towing because they provide more torque multiplication. This makes pulling heavy loads easier, especially from a stop and on hills. The trade-off is lower highway fuel economy." },
  ],
  formula: "Speed (mph) = (RPM x Tire Diameter) / (Gear Ratio x Final Drive x 336); RPM = (Speed x Gear x Final x 336) / Tire Diameter",
};
