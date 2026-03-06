import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lensCompressionDistanceCalculator: CalculatorDefinition = {
  slug: "lens-compression-distance-calculator",
  title: "Lens Compression Distance Calculator",
  description: "Calculate the apparent background compression effect at different focal lengths and subject distances for portrait photography.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["lens compression","focal length compression","portrait lens distance","background compression"],
  variants: [{
    id: "standard",
    name: "Lens Compression Distance",
    description: "Calculate the apparent background compression effect at different focal lengths and subject distances for portrait photography.",
    fields: [
      { name: "focalLength", label: "Focal Length (mm)", type: "number", min: 14, max: 600, defaultValue: 85 },
      { name: "subjectDist", label: "Subject Distance (ft)", type: "number", min: 1, max: 200, defaultValue: 10 },
      { name: "bgDist", label: "Background Distance (ft)", type: "number", min: 2, max: 2000, defaultValue: 50 },
      { name: "sensorType", label: "Sensor Type", type: "select", options: [{ value: "1", label: "Full Frame" }, { value: "2", label: "APS-C (1.5x)" }, { value: "3", label: "Micro Four Thirds (2.0x)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const fl = inputs.focalLength as number;
    const subDist = inputs.subjectDist as number;
    const bgDist = inputs.bgDist as number;
    const sensor = parseInt(inputs.sensorType as string);
    const cropFactor = [0, 1.0, 1.5, 2.0][sensor];
    const eqFL = fl * cropFactor;
    const compressionRatio = Math.round(bgDist / subDist * 100) / 100;
    const bgMagnification = Math.round(fl / 50 * 100) / 100;
    const fov = 2 * Math.atan(36 / (2 * eqFL)) * (180 / Math.PI);
    const bgApparentSize = Math.round(bgMagnification * 100);
    const perspective = eqFL < 35 ? "Wide — exaggerated perspective, distant background" : eqFL < 70 ? "Normal — natural perspective" : eqFL < 135 ? "Telephoto — compressed, flattering portraits" : "Super telephoto — extreme compression";
    return {
      primary: { label: "Background Magnification", value: formatNumber(bgMagnification) + "x vs 50mm" },
      details: [
        { label: "Compression Ratio", value: formatNumber(compressionRatio) + ":1" },
        { label: "Equivalent Focal Length", value: formatNumber(Math.round(eqFL)) + " mm" },
        { label: "Field of View", value: formatNumber(Math.round(fov * 10) / 10) + "°" },
        { label: "Perspective Character", value: perspective }
      ]
    };
  },
  }],
  relatedSlugs: ["camera-sensor-crop-factor-calculator","depth-of-field-calculator"],
  faq: [
    { question: "What is lens compression?", answer: "Lens compression is the apparent flattening of depth when using longer focal lengths from farther away. The background appears larger and closer relative to the subject." },
    { question: "What focal length is best for portraits?", answer: "85mm to 135mm (full frame equivalent) is ideal for portraits. These focal lengths provide flattering perspective and pleasant background compression." },
    { question: "Does crop factor affect compression?", answer: "Crop factor changes the effective field of view but not the actual perspective. A 50mm on APS-C frames like a 75mm on full frame, but the perspective compression is determined by the subject distance, not the focal length itself." },
  ],
  formula: "Background Magnification = Focal Length / 50; Compression Ratio = Background Distance / Subject Distance; Field of View = 2 x atan(36 / (2 x Equivalent FL))",
};
