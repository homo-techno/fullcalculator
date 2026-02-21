import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cropFactorCalculator: CalculatorDefinition = {
  slug: "crop-factor-calculator",
  title: "Crop Factor Calculator",
  description: "Free crop factor calculator. Calculate sensor crop factor, equivalent focal length, and field of view for different camera sensor sizes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["crop factor calculator", "sensor size calculator", "APS-C crop factor", "field of view calculator", "sensor comparison"],
  variants: [
    {
      id: "preset",
      name: "Sensor Crop Factor",
      description: "Calculate crop factor from sensor presets",
      fields: [
        { name: "sensor", label: "Camera Sensor", type: "select", options: [
          { label: "Full Frame (36x24mm)", value: "36" },
          { label: "APS-H Canon (27.9x18.6mm)", value: "27.9" },
          { label: "APS-C Canon (22.3x14.9mm)", value: "22.3" },
          { label: "APS-C Nikon/Sony (23.5x15.6mm)", value: "23.5" },
          { label: "Micro Four Thirds (17.3x13mm)", value: "17.3" },
          { label: "1-inch (13.2x8.8mm)", value: "13.2" },
          { label: "1/1.7-inch (7.6x5.7mm)", value: "7.6" },
          { label: "1/2.3-inch (6.17x4.55mm)", value: "6.17" },
          { label: "Phone 1/2.55-inch (5.64x4.23mm)", value: "5.64" },
        ], defaultValue: "23.5" },
        { name: "focalLength", label: "Lens Focal Length (mm)", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const sensorWidth = parseFloat(inputs.sensor as string) || 23.5;
        const fl = inputs.focalLength as number;
        if (!fl) return null;

        const cropFactor = 36 / sensorWidth;
        const efl = fl * cropFactor;
        const fovFF = 2 * Math.atan(36 / (2 * fl)) * (180 / Math.PI);
        const fovCrop = 2 * Math.atan(sensorWidth / (2 * fl)) * (180 / Math.PI);

        return {
          primary: { label: "Equivalent Focal Length", value: `${formatNumber(efl, 1)} mm` },
          details: [
            { label: "Crop factor", value: `${formatNumber(cropFactor, 2)}x` },
            { label: "Actual focal length", value: `${fl} mm` },
            { label: "35mm equivalent", value: `${formatNumber(efl, 1)} mm` },
            { label: "Field of view (this sensor)", value: `${formatNumber(fovCrop, 1)}°` },
            { label: "Field of view (full frame)", value: `${formatNumber(fovFF, 1)}°` },
            { label: "Sensor width", value: `${sensorWidth} mm` },
          ],
          note: "Crop factor multiplies the effective focal length. A 50mm lens on APS-C gives the same field of view as a 75mm lens on full frame.",
        };
      },
    },
    {
      id: "custom",
      name: "Custom Sensor Size",
      description: "Enter a custom sensor width to calculate crop factor",
      fields: [
        { name: "sensorWidth", label: "Sensor Width (mm)", type: "number", placeholder: "e.g. 23.5", step: 0.1 },
        { name: "sensorHeight", label: "Sensor Height (mm)", type: "number", placeholder: "e.g. 15.6", step: 0.1 },
        { name: "focalLength", label: "Lens Focal Length (mm)", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const w = inputs.sensorWidth as number;
        const h = inputs.sensorHeight as number;
        const fl = inputs.focalLength as number;
        if (!w || !fl) return null;

        const cropFactor = 36 / w;
        const efl = fl * cropFactor;
        const diagSensor = Math.sqrt(w * w + (h ? h * h : (w * 2 / 3) * (w * 2 / 3)));
        const diagFF = Math.sqrt(36 * 36 + 24 * 24);
        const diagCrop = diagFF / diagSensor;

        return {
          primary: { label: "Crop Factor", value: `${formatNumber(cropFactor, 2)}x` },
          details: [
            { label: "Equivalent focal length", value: `${formatNumber(efl, 1)} mm` },
            { label: "Width crop factor", value: `${formatNumber(cropFactor, 3)}x` },
            { label: "Diagonal crop factor", value: `${formatNumber(diagCrop, 3)}x` },
            { label: "Sensor diagonal", value: `${formatNumber(diagSensor, 1)} mm` },
            { label: "Full frame diagonal", value: `${formatNumber(diagFF, 1)} mm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["focal-length-equivalent-calculator", "depth-of-field-calculator", "photo-print-size-calculator"],
  faq: [
    { question: "What is crop factor?", answer: "Crop factor is the ratio of a full-frame sensor (36x24mm) to a smaller sensor. APS-C has a 1.5x crop factor, meaning a 50mm lens has the same field of view as a 75mm lens on full frame." },
    { question: "Does crop factor affect aperture?", answer: "Crop factor doesn't change the actual aperture, but it affects the equivalent depth of field. A 50mm f/1.8 on APS-C gives equivalent DOF to a 75mm f/2.7 on full frame." },
    { question: "What is the crop factor for Micro Four Thirds?", answer: "Micro Four Thirds has a 2x crop factor. A 25mm lens on M4/3 gives the same field of view as a 50mm lens on full frame." },
  ],
  formula: "Crop Factor = 36mm / Sensor Width | Equivalent FL = Actual FL × Crop Factor | FOV = 2 × atan(sensor width / (2 × focal length))",
};
