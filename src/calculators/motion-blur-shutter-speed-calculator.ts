import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const motionBlurShutterSpeedCalculator: CalculatorDefinition = {
  slug: "motion-blur-shutter-speed-calculator",
  title: "Motion Blur Shutter Speed Calculator",
  description: "Calculate the ideal shutter speed for creative motion blur or sharp action freeze based on subject speed and distance.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["motion blur","shutter speed","action freeze","camera motion blur","panning speed"],
  variants: [{
    id: "standard",
    name: "Motion Blur Shutter Speed",
    description: "Calculate the ideal shutter speed for creative motion blur or sharp action freeze based on subject speed and distance.",
    fields: [
      { name: "subjectSpeed", label: "Subject Speed", type: "number", min: 1, max: 1000, defaultValue: 30 },
      { name: "speedUnit", label: "Speed Unit", type: "select", options: [{ value: "1", label: "mph" }, { value: "2", label: "km/h" }, { value: "3", label: "ft/s" }], defaultValue: "1" },
      { name: "distance", label: "Subject Distance (ft)", type: "number", min: 1, max: 5000, defaultValue: 50 },
      { name: "focalLength", label: "Focal Length (mm)", type: "number", min: 10, max: 600, defaultValue: 100 },
      { name: "intent", label: "Creative Intent", type: "select", options: [{ value: "1", label: "Freeze Action (sharp)" }, { value: "2", label: "Slight Motion Blur" }, { value: "3", label: "Creative Motion Blur" }, { value: "4", label: "Panning (background blur)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const speed = inputs.subjectSpeed as number;
    const unit = parseInt(inputs.speedUnit as string);
    const dist = inputs.distance as number;
    const fl = inputs.focalLength as number;
    const intent = parseInt(inputs.intent as string);
    const speedFtPerSec = unit === 1 ? speed * 1.467 : unit === 2 ? speed * 0.911 : speed;
    const angularSpeed = (speedFtPerSec / dist) * (180 / Math.PI);
    const blurPx = angularSpeed * fl / 50;
    const freezeShutter = Math.ceil(blurPx * 50);
    const intentMultiplier = [0, 1.0, 0.3, 0.1, 0.15][intent];
    const targetShutter = Math.max(1, Math.round(freezeShutter * intentMultiplier));
    const shutterStr = "1/" + targetShutter;
    const actualBlurPx = Math.round(blurPx / targetShutter * 50 * 10) / 10;
    return {
      primary: { label: "Recommended Shutter Speed", value: shutterStr + " sec" },
      details: [
        { label: "Subject Angular Speed", value: formatNumber(Math.round(angularSpeed * 100) / 100) + " deg/s" },
        { label: "Estimated Blur", value: formatNumber(actualBlurPx) + " pixels" },
        { label: "Subject Speed", value: formatNumber(Math.round(speedFtPerSec * 10) / 10) + " ft/s" },
        { label: "Freeze Shutter", value: "1/" + formatNumber(freezeShutter) + " sec" }
      ]
    };
  },
  }],
  relatedSlugs: ["exposure-triangle-calculator","hyperfocal-distance-calculator"],
  faq: [
    { question: "What shutter speed freezes action?", answer: "To freeze fast action like sports, use 1/500 or faster. For birds in flight use 1/1000 to 1/2000. Cars and motorcycles may need 1/2000 or faster." },
    { question: "How do I create intentional motion blur?", answer: "Use a slower shutter speed relative to the subject motion. For waterfalls, try 1/4 to 2 seconds. For light trails, use 5-30 seconds." },
    { question: "What is panning?", answer: "Panning means moving the camera to follow a moving subject while using a slower shutter speed. This keeps the subject relatively sharp while blurring the background to convey speed." },
  ],
  formula: "Angular Speed = (Speed / Distance) x (180 / PI)
Freeze Shutter = Angular Speed x Focal Length / 50 x 50
Target Shutter = Freeze Shutter x Intent Multiplier",
};
