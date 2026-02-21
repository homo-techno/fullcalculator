import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roomAcousticsCalculator: CalculatorDefinition = {
  slug: "room-acoustics-calculator",
  title: "Room Acoustics Calculator",
  description:
    "Free room acoustics calculator. Calculate room volume, surface area, RT60 reverberation time, and room modes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "room acoustics",
    "reverberation",
    "RT60",
    "room modes",
    "acoustic treatment",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Room Length (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "width",
          label: "Room Width (feet)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "height",
          label: "Room Height (feet)",
          type: "number",
          placeholder: "e.g. 9",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        if (!length || !width || !height) return null;

        const volume = length * width * height;
        const volumeM3 = volume * 0.0283168;
        const surfaceArea =
          2 * (length * width + length * height + width * height);
        const surfaceAreaM2 = surfaceArea * 0.092903;

        // Sabine equation: RT60 = 0.161 * V / A
        // Assume average absorption coefficient ~0.15 for a typical untreated room
        const avgAbsorption = 0.15;
        const totalAbsorption = surfaceAreaM2 * avgAbsorption;
        const rt60 = (0.161 * volumeM3) / totalAbsorption;

        // Room modes: f = (c/2) * sqrt((p/L)^2 + (q/W)^2 + (r/H)^2)
        // First axial modes (simplest, most problematic)
        const speedSound = 1130; // ft/s
        const modeLength = speedSound / (2 * length);
        const modeWidth = speedSound / (2 * width);
        const modeHeight = speedSound / (2 * height);

        // Room ratio analysis
        const ratioLW = length / width;
        const ratioLH = length / height;
        const idealRatio = ratioLW >= 1.2 && ratioLW <= 1.8 && ratioLH >= 1.8 && ratioLH <= 3.0;

        return {
          primary: {
            label: "RT60 Reverberation Time",
            value: formatNumber(rt60, 2) + " seconds",
          },
          details: [
            {
              label: "Room Volume",
              value:
                formatNumber(volume, 0) +
                " cu ft (" +
                formatNumber(volumeM3, 1) +
                " m\u00B3)",
            },
            {
              label: "Surface Area",
              value:
                formatNumber(surfaceArea, 0) +
                " sq ft (" +
                formatNumber(surfaceAreaM2, 1) +
                " m\u00B2)",
            },
            {
              label: "1st Mode - Length",
              value: formatNumber(modeLength, 1) + " Hz",
            },
            {
              label: "1st Mode - Width",
              value: formatNumber(modeWidth, 1) + " Hz",
            },
            {
              label: "1st Mode - Height",
              value: formatNumber(modeHeight, 1) + " Hz",
            },
            {
              label: "Room Ratio (L:W:H)",
              value:
                formatNumber(ratioLW, 2) +
                " : 1 : " +
                formatNumber(height / width, 2),
            },
            {
              label: "Room Proportions",
              value: idealRatio
                ? "Good (near ideal ratios)"
                : "May benefit from acoustic treatment",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["speaker-wire-calculator", "sound-speed-calculator"],
  faq: [
    {
      question: "What is RT60?",
      answer:
        "RT60 is the time it takes for sound to decay by 60 dB (to one millionth of its original intensity). For music studios, an RT60 of 0.3-0.5 seconds is typical. Living rooms are often 0.4-0.8 seconds.",
    },
    {
      question: "What are room modes?",
      answer:
        "Room modes are resonant frequencies determined by room dimensions. The first axial mode for each dimension equals the speed of sound divided by twice that dimension. These can cause boomy or uneven bass response.",
    },
  ],
  formula:
    "RT60 = 0.161 x Volume(m3) / Total Absorption. Room Mode = Speed of Sound / (2 x Dimension). Speed of sound ~1130 ft/s. Average absorption coefficient assumed at 0.15 for untreated room.",
};
