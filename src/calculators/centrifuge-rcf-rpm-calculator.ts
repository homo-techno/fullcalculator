import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const centrifugeRcfRpmCalculator: CalculatorDefinition = {
  slug: "centrifuge-rcf-rpm-calculator",
  title: "Centrifuge RCF to RPM Calculator",
  description: "Convert between relative centrifugal force (RCF/g-force) and revolutions per minute (RPM) for any rotor radius used in laboratory centrifugation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rcf to rpm","centrifuge calculator","g-force rpm conversion","rotor radius","relative centrifugal force"],
  variants: [{
    id: "standard",
    name: "Centrifuge RCF to RPM",
    description: "Convert between relative centrifugal force (RCF/g-force) and revolutions per minute (RPM) for any rotor radius used in laboratory centrifugation.",
    fields: [
      { name: "rcf", label: "Relative Centrifugal Force (x g)", type: "number", min: 1, max: 1000000, defaultValue: 10000 },
      { name: "radius", label: "Rotor Radius (mm)", type: "number", min: 10, max: 500, defaultValue: 100 },
      { name: "mode", label: "Conversion Direction", type: "select", options: [{ value: "1", label: "RCF to RPM" }, { value: "2", label: "RPM to RCF" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const rcf = inputs.rcf as number;
    const radius = inputs.radius as number;
    const mode = inputs.mode as number;
    if (mode === 1) {
      const rpm = Math.sqrt(rcf / (1.118e-5 * radius));
      return {
        primary: { label: "RPM", value: formatNumber(Math.round(rpm)) },
        details: [
          { label: "RCF Input", value: formatNumber(rcf) + " x g" },
          { label: "Rotor Radius", value: formatNumber(radius) + " mm" },
          { label: "Angular Velocity", value: formatNumber(Math.round(rpm * 2 * 3.14159 / 60 * 10) / 10) + " rad/s" }
        ]
      };
    } else {
      const rpmVal = rcf;
      const calcRcf = 1.118e-5 * radius * rpmVal * rpmVal;
      return {
        primary: { label: "RCF (x g)", value: formatNumber(Math.round(calcRcf)) },
        details: [
          { label: "RPM Input", value: formatNumber(rpmVal) },
          { label: "Rotor Radius", value: formatNumber(radius) + " mm" },
          { label: "Angular Velocity", value: formatNumber(Math.round(rpmVal * 2 * 3.14159 / 60 * 10) / 10) + " rad/s" }
        ]
      };
    }
  },
  }],
  relatedSlugs: ["serial-dilution-calculator","molarity-calculator","spectrophotometer-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "RCF = 1.118 x 10^-5 x r x RPM^2; RPM = sqrt(RCF / (1.118 x 10^-5 x r)); where r = rotor radius in mm",
};
