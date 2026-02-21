import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const depthOfFieldCalculator: CalculatorDefinition = {
  slug: "depth-of-field-calculator",
  title: "Depth of Field Calculator",
  description: "Free depth of field calculator. Calculate DOF, hyperfocal distance, and circle of confusion for any camera and lens combination.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["depth of field calculator", "DOF calculator", "bokeh calculator", "aperture calculator", "blur calculator"],
  variants: [
    {
      id: "dof",
      name: "Depth of Field",
      description: "Calculate near/far focus limits and total DOF",
      fields: [
        { name: "focalLength", label: "Focal Length (mm)", type: "number", placeholder: "e.g. 50" },
        { name: "aperture", label: "Aperture (f-stop)", type: "select", options: [
          { label: "f/1.4", value: "1.4" },
          { label: "f/1.8", value: "1.8" },
          { label: "f/2.0", value: "2" },
          { label: "f/2.8", value: "2.8" },
          { label: "f/4", value: "4" },
          { label: "f/5.6", value: "5.6" },
          { label: "f/8", value: "8" },
          { label: "f/11", value: "11" },
          { label: "f/16", value: "16" },
          { label: "f/22", value: "22" },
        ], defaultValue: "2.8" },
        { name: "distance", label: "Subject Distance (meters)", type: "number", placeholder: "e.g. 3", step: 0.1 },
        { name: "sensor", label: "Sensor Size", type: "select", options: [
          { label: "Full Frame (36x24mm)", value: "0.029" },
          { label: "APS-C Canon (22.3x14.9mm)", value: "0.018" },
          { label: "APS-C Nikon/Sony (23.5x15.6mm)", value: "0.019" },
          { label: "Micro Four Thirds (17.3x13mm)", value: "0.015" },
          { label: "1-inch (13.2x8.8mm)", value: "0.011" },
          { label: "Phone (1/2.55 inch)", value: "0.007" },
        ], defaultValue: "0.029" },
      ],
      calculate: (inputs) => {
        const f = inputs.focalLength as number;
        const N = parseFloat(inputs.aperture as string) || 2.8;
        const s = inputs.distance as number;
        const coc = parseFloat(inputs.sensor as string) || 0.029;
        if (!f || !s) return null;

        const sMM = s * 1000;
        const H = (f * f) / (N * coc) + f;
        const nearDist = (sMM * (H - f)) / (H + sMM - 2 * f);
        const farDist = H - f > sMM - f ? (sMM * (H - f)) / (H - sMM) : Infinity;
        const dof = farDist === Infinity ? Infinity : farDist - nearDist;

        const formatDist = (mm: number) => {
          if (mm === Infinity) return "Infinity";
          if (mm >= 1000) return `${formatNumber(mm / 1000, 2)} m`;
          return `${formatNumber(mm, 0)} mm`;
        };

        return {
          primary: { label: "Depth of Field", value: dof === Infinity ? "Infinite" : formatDist(dof) },
          details: [
            { label: "Near focus limit", value: formatDist(nearDist) },
            { label: "Far focus limit", value: formatDist(farDist) },
            { label: "Hyperfocal distance", value: formatDist(H) },
            { label: "In front of subject", value: formatDist(sMM - nearDist) },
            { label: "Behind subject", value: farDist === Infinity ? "Infinite" : formatDist(farDist - sMM) },
            { label: "Circle of confusion", value: `${coc} mm` },
          ],
          note: "DOF is the range of distance that appears acceptably sharp. Wider apertures (lower f-number) produce shallower DOF.",
        };
      },
    },
    {
      id: "background-blur",
      name: "Background Blur Estimate",
      description: "Estimate the amount of background blur (bokeh)",
      fields: [
        { name: "focalLength", label: "Focal Length (mm)", type: "number", placeholder: "e.g. 85" },
        { name: "aperture", label: "Aperture (f-stop)", type: "select", options: [
          { label: "f/1.4", value: "1.4" },
          { label: "f/1.8", value: "1.8" },
          { label: "f/2.0", value: "2" },
          { label: "f/2.8", value: "2.8" },
          { label: "f/4", value: "4" },
          { label: "f/5.6", value: "5.6" },
          { label: "f/8", value: "8" },
        ], defaultValue: "1.8" },
        { name: "subjectDist", label: "Subject Distance (meters)", type: "number", placeholder: "e.g. 2", step: 0.1 },
        { name: "bgDist", label: "Background Distance (meters)", type: "number", placeholder: "e.g. 10", step: 0.1 },
      ],
      calculate: (inputs) => {
        const f = inputs.focalLength as number;
        const N = parseFloat(inputs.aperture as string) || 1.8;
        const sd = inputs.subjectDist as number;
        const bd = inputs.bgDist as number;
        if (!f || !sd || !bd || bd <= sd) return null;

        const sdMM = sd * 1000;
        const bdMM = bd * 1000;
        const blurDiameter = (f * f * (bdMM - sdMM)) / (N * bdMM * sdMM) * 1000;
        const blurLevel = blurDiameter > 0.1 ? "Very blurry" : blurDiameter > 0.05 ? "Noticeably blurry" : blurDiameter > 0.02 ? "Slightly blurry" : "Mostly sharp";

        return {
          primary: { label: "Blur Circle Diameter", value: `${formatNumber(blurDiameter, 3)} mm` },
          details: [
            { label: "Blur level", value: blurLevel },
            { label: "Focal length", value: `${f} mm` },
            { label: "Aperture", value: `f/${N}` },
            { label: "Subject distance", value: `${sd} m` },
            { label: "Background distance", value: `${bd} m` },
          ],
          note: "Larger blur circle = more background blur (bokeh). Use longer focal lengths, wider apertures, and greater subject-to-background distance for more blur.",
        };
      },
    },
  ],
  relatedSlugs: ["hyperfocal-distance-calculator", "crop-factor-calculator", "focal-length-equivalent-calculator"],
  faq: [
    { question: "What is depth of field?", answer: "Depth of field (DOF) is the range of distance in a photo that appears acceptably sharp. A shallow DOF means only a thin slice is in focus (blurry background), while a deep DOF means most of the scene is sharp." },
    { question: "What affects depth of field?", answer: "Three main factors: aperture (wider = shallower DOF), focal length (longer = shallower DOF), and subject distance (closer = shallower DOF). Sensor size also plays a role." },
    { question: "What is circle of confusion?", answer: "The circle of confusion (CoC) is the largest blur spot that still appears sharp to the human eye. It depends on sensor size, print size, and viewing distance. Standard CoC for full frame is 0.029mm." },
  ],
  formula: "H = f²/(N×c) + f | DOF = Far - Near | Near = s(H-f)/(H+s-2f) | Far = s(H-f)/(H-s) where f=focal length, N=f-stop, c=CoC, s=subject distance",
};
