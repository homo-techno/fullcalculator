import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cameraSensorCropFactorCalculator: CalculatorDefinition = {
  slug: "camera-sensor-crop-factor-calculator",
  title: "Camera Sensor Crop Factor Calculator",
  description: "Calculate equivalent focal length and field of view based on your camera sensor size and crop factor.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["crop factor","sensor crop","equivalent focal length","camera sensor size","APS-C crop factor"],
  variants: [{
    id: "standard",
    name: "Camera Sensor Crop Factor",
    description: "Calculate equivalent focal length and field of view based on your camera sensor size and crop factor.",
    fields: [
      { name: "focalLength", label: "Lens Focal Length (mm)", type: "number", min: 1, max: 2000, defaultValue: 50 },
      { name: "sensorType", label: "Sensor Type", type: "select", options: [{ value: "1", label: "Full Frame (1.0x)" }, { value: "2", label: "APS-C Canon (1.6x)" }, { value: "3", label: "APS-C Nikon/Sony (1.5x)" }, { value: "4", label: "Micro Four Thirds (2.0x)" }, { value: "5", label: "1-inch (2.7x)" }], defaultValue: "3" },
      { name: "aperture", label: "Lens Aperture (f-stop)", type: "number", min: 0.7, max: 64, defaultValue: 1.8 },
    ],
    calculate: (inputs) => {
    const fl = inputs.focalLength as number;
    const sensorType = parseInt(inputs.sensorType as string);
    const aperture = inputs.aperture as number;
    const cropFactors = [0, 1.0, 1.6, 1.5, 2.0, 2.7];
    const crop = cropFactors[sensorType];
    const eqFocal = Math.round(fl * crop * 10) / 10;
    const eqAperture = Math.round(aperture * crop * 10) / 10;
    const fovFull = 2 * Math.atan(36 / (2 * fl)) * (180 / Math.PI);
    const fovCropped = 2 * Math.atan(36 / (2 * eqFocal)) * (180 / Math.PI);
    return {
      primary: { label: "Equivalent Focal Length", value: formatNumber(eqFocal) + " mm" },
      details: [
        { label: "Crop Factor", value: formatNumber(crop) + "x" },
        { label: "Equivalent Aperture (DOF)", value: "f/" + formatNumber(eqAperture) },
        { label: "Field of View (Full Frame)", value: formatNumber(Math.round(fovFull * 10) / 10) + "°" },
        { label: "Field of View (Cropped)", value: formatNumber(Math.round(fovCropped * 10) / 10) + "°" }
      ]
    };
  },
  }],
  relatedSlugs: ["depth-of-field-calculator","lens-focal-length-calculator"],
  faq: [
    { question: "What is crop factor?", answer: "Crop factor is the ratio of a full frame sensor diagonal to your camera sensor diagonal. It multiplies the effective focal length of any lens mounted on that camera." },
    { question: "Does crop factor affect aperture?", answer: "Crop factor does not change the actual light-gathering ability of a lens, but it does affect the equivalent depth of field. A 50mm f/1.8 on APS-C gives DOF similar to a 75mm f/2.7 on full frame." },
    { question: "Is a higher crop factor better or worse?", answer: "Neither. A higher crop factor gives more reach (useful for wildlife and sports) but a narrower field of view (disadvantage for landscapes and architecture)." },
  ],
  formula: "Equivalent Focal Length = Actual Focal Length x Crop Factor
Equivalent Aperture (DOF) = Actual Aperture x Crop Factor
Field of View = 2 x atan(sensor_width / (2 x focal_length))",
};
