import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const propellerPitchCalculator: CalculatorDefinition = {
  slug: "propeller-pitch-calculator",
  title: "Propeller Pitch Calculator",
  description: "Find the optimal propeller pitch for your boat engine based on current RPM, desired RPM, and existing propeller specifications for best performance.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["propeller pitch","boat prop calculator","prop pitch change","marine propeller sizing"],
  variants: [{
    id: "standard",
    name: "Propeller Pitch",
    description: "Find the optimal propeller pitch for your boat engine based on current RPM, desired RPM, and existing propeller specifications for best performance.",
    fields: [
      { name: "currentPitch", label: "Current Prop Pitch (inches)", type: "number", min: 5, max: 40, defaultValue: 19 },
      { name: "currentRPM", label: "Current WOT RPM", type: "number", min: 1000, max: 8000, defaultValue: 5200 },
      { name: "targetRPM", label: "Target WOT RPM", type: "number", min: 1000, max: 8000, defaultValue: 5800 },
      { name: "propDiameter", label: "Propeller Diameter (inches)", type: "number", min: 6, max: 30, defaultValue: 14 },
      { name: "boatSpeed", label: "Current Top Speed (mph)", type: "number", min: 5, max: 80, defaultValue: 38 },
    ],
    calculate: (inputs) => {
    const currentPitch = inputs.currentPitch as number;
    const currentRPM = inputs.currentRPM as number;
    const targetRPM = inputs.targetRPM as number;
    const diameter = inputs.propDiameter as number;
    const speed = inputs.boatSpeed as number;
    const rpmDiff = targetRPM - currentRPM;
    const pitchChange = Math.round(rpmDiff / 200);
    const newPitch = currentPitch - pitchChange;
    const theoreticalSpeed = (currentRPM * currentPitch) / 1056;
    const slipPercent = theoreticalSpeed > 0 ? ((theoreticalSpeed - speed) / theoreticalSpeed) * 100 : 0;
    const newTheoreticalSpeed = (targetRPM * newPitch) / 1056;
    const estimatedSpeed = newTheoreticalSpeed * (1 - slipPercent / 100);
    return {
      primary: { label: "Recommended Pitch", value: formatNumber(Math.round(newPitch)) + " inches" },
      details: [
        { label: "Pitch Change", value: (pitchChange > 0 ? "-" : "+") + formatNumber(Math.abs(pitchChange)) + " inches" },
        { label: "Current Prop Slip", value: formatNumber(Math.round(slipPercent)) + "%" },
        { label: "Estimated New Top Speed", value: formatNumber(Math.round(estimatedSpeed * 10) / 10) + " mph" },
        { label: "Propeller Size", value: diameter + " x " + Math.round(newPitch) },
        { label: "RPM Change per inch of pitch", value: "~200 RPM" }
      ]
    };
  },
  }],
  relatedSlugs: ["hull-speed-calculator","boat-fuel-consumption-calculator"],
  faq: [
    { question: "How does propeller pitch affect performance?", answer: "Lower pitch increases acceleration and RPM but reduces top speed. Higher pitch increases top speed and fuel efficiency at cruise but reduces hole shot and acceleration. Each inch of pitch changes RPM by approximately 150 to 200." },
    { question: "What is propeller slip?", answer: "Prop slip is the difference between theoretical speed based on pitch and RPM versus actual speed. Normal slip is 10 to 20 percent. High slip may indicate a worn or incorrectly sized propeller." },
    { question: "How do I know if my prop pitch is correct?", answer: "Your engine should reach the manufacturer recommended wide-open-throttle RPM range with your normal load. If WOT RPM is below the range, reduce pitch. If above, increase pitch." },
  ],
  formula: "RPM Change Per Inch of Pitch = ~200 RPM; New Pitch = Current Pitch - (RPM Difference / 200); Theoretical Speed = (RPM x Pitch) / 1056; Prop Slip = (Theoretical Speed - Actual Speed) / Theoretical Speed x 100",
};
