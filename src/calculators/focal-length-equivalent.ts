import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const focalLengthEquivalentCalculator: CalculatorDefinition = {
  slug: "focal-length-equivalent-calculator",
  title: "Focal Length Equivalent Calculator",
  description: "Free focal length equivalent calculator. Convert focal lengths between different sensor sizes and find the 35mm full-frame equivalent.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["focal length equivalent calculator", "35mm equivalent", "full frame equivalent", "lens equivalent calculator", "sensor focal length"],
  variants: [
    {
      id: "to-fullframe",
      name: "Convert to Full Frame Equivalent",
      description: "Find the 35mm equivalent focal length",
      fields: [
        { name: "focalLength", label: "Actual Focal Length (mm)", type: "number", placeholder: "e.g. 35" },
        { name: "fromSensor", label: "Your Camera Sensor", type: "select", options: [
          { label: "Full Frame (1.0x)", value: "1.0" },
          { label: "APS-H Canon (1.3x)", value: "1.3" },
          { label: "APS-C Canon (1.6x)", value: "1.6" },
          { label: "APS-C Nikon/Sony/Fuji (1.5x)", value: "1.5" },
          { label: "Micro Four Thirds (2.0x)", value: "2.0" },
          { label: "1-inch (2.7x)", value: "2.7" },
          { label: "Medium Format Fuji (0.79x)", value: "0.79" },
          { label: "Medium Format Hasselblad (0.79x)", value: "0.79" },
        ], defaultValue: "1.5" },
      ],
      calculate: (inputs) => {
        const fl = inputs.focalLength as number;
        const crop = parseFloat(inputs.fromSensor as string) || 1.5;
        if (!fl) return null;

        const equiv = fl * crop;
        const fov = 2 * Math.atan(36 / (2 * equiv)) * (180 / Math.PI);
        const category = equiv < 24 ? "Ultra-wide" : equiv < 35 ? "Wide angle" : equiv < 60 ? "Standard/Normal" : equiv < 100 ? "Short telephoto" : equiv < 200 ? "Telephoto" : "Super telephoto";

        return {
          primary: { label: "35mm Equivalent", value: `${formatNumber(equiv, 1)} mm` },
          details: [
            { label: "Actual focal length", value: `${fl} mm` },
            { label: "Crop factor", value: `${crop}x` },
            { label: "Horizontal FOV", value: `${formatNumber(fov, 1)}°` },
            { label: "Lens category", value: category },
          ],
        };
      },
    },
    {
      id: "between-sensors",
      name: "Convert Between Sensors",
      description: "Find the equivalent focal length on a different sensor",
      fields: [
        { name: "focalLength", label: "Focal Length (mm)", type: "number", placeholder: "e.g. 50" },
        { name: "fromSensor", label: "From Sensor", type: "select", options: [
          { label: "Full Frame (1.0x)", value: "1.0" },
          { label: "APS-C Canon (1.6x)", value: "1.6" },
          { label: "APS-C Nikon/Sony (1.5x)", value: "1.5" },
          { label: "Micro Four Thirds (2.0x)", value: "2.0" },
          { label: "1-inch (2.7x)", value: "2.7" },
          { label: "Medium Format (0.79x)", value: "0.79" },
        ], defaultValue: "1.0" },
        { name: "toSensor", label: "To Sensor", type: "select", options: [
          { label: "Full Frame (1.0x)", value: "1.0" },
          { label: "APS-C Canon (1.6x)", value: "1.6" },
          { label: "APS-C Nikon/Sony (1.5x)", value: "1.5" },
          { label: "Micro Four Thirds (2.0x)", value: "2.0" },
          { label: "1-inch (2.7x)", value: "2.7" },
          { label: "Medium Format (0.79x)", value: "0.79" },
        ], defaultValue: "1.5" },
      ],
      calculate: (inputs) => {
        const fl = inputs.focalLength as number;
        const fromCrop = parseFloat(inputs.fromSensor as string) || 1.0;
        const toCrop = parseFloat(inputs.toSensor as string) || 1.5;
        if (!fl) return null;

        const ffEquiv = fl * fromCrop;
        const targetFL = ffEquiv / toCrop;

        return {
          primary: { label: "Equivalent Focal Length", value: `${formatNumber(targetFL, 1)} mm` },
          details: [
            { label: "Original", value: `${fl} mm (${fromCrop}x crop)` },
            { label: "35mm equivalent", value: `${formatNumber(ffEquiv, 1)} mm` },
            { label: "Target equivalent", value: `${formatNumber(targetFL, 1)} mm (${toCrop}x crop)` },
            { label: "Conversion ratio", value: `${formatNumber(fromCrop / toCrop, 3)}x` },
          ],
          note: "To get the same field of view on the target sensor, use the equivalent focal length shown above.",
        };
      },
    },
  ],
  relatedSlugs: ["crop-factor-calculator", "depth-of-field-calculator", "hyperfocal-distance-calculator"],
  faq: [
    { question: "What is 35mm equivalent focal length?", answer: "The 35mm equivalent is the focal length that would give the same field of view on a full-frame (35mm) camera. It standardizes focal lengths across different sensor sizes for comparison." },
    { question: "Why does sensor size matter for focal length?", answer: "A smaller sensor captures a smaller portion of the image circle, effectively cropping the image. This makes the field of view narrower, similar to using a longer lens on a larger sensor." },
    { question: "What focal length equals the human eye?", answer: "The human eye's field of view is roughly equivalent to a 43mm lens on full frame, though 50mm is traditionally called the 'normal' lens. On APS-C, a 35mm lens is approximately equivalent." },
  ],
  formula: "35mm Equivalent = Focal Length × Crop Factor | Target FL = (Source FL × Source Crop) / Target Crop",
};
