import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hyperfocalDistanceCalculator: CalculatorDefinition = {
  slug: "hyperfocal-distance-calculator",
  title: "Hyperfocal Distance Calculator",
  description: "Free hyperfocal distance calculator. Find the optimal focus distance to maximize depth of field for landscape and travel photography.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hyperfocal distance calculator", "landscape focus calculator", "infinity focus", "maximum depth of field", "sharp landscape"],
  variants: [
    {
      id: "hyperfocal",
      name: "Hyperfocal Distance",
      description: "Calculate the hyperfocal distance for maximum sharpness",
      fields: [
        { name: "focalLength", label: "Focal Length (mm)", type: "number", placeholder: "e.g. 24" },
        { name: "aperture", label: "Aperture (f-stop)", type: "select", options: [
          { label: "f/4", value: "4" },
          { label: "f/5.6", value: "5.6" },
          { label: "f/8", value: "8" },
          { label: "f/11", value: "11" },
          { label: "f/16", value: "16" },
          { label: "f/22", value: "22" },
        ], defaultValue: "8" },
        { name: "sensor", label: "Sensor Size", type: "select", options: [
          { label: "Full Frame (36x24mm)", value: "0.029" },
          { label: "APS-C Canon (22.3x14.9mm)", value: "0.018" },
          { label: "APS-C Nikon/Sony (23.5x15.6mm)", value: "0.019" },
          { label: "Micro Four Thirds (17.3x13mm)", value: "0.015" },
          { label: "1-inch (13.2x8.8mm)", value: "0.011" },
        ], defaultValue: "0.029" },
      ],
      calculate: (inputs) => {
        const f = inputs.focalLength as number;
        const N = parseFloat(inputs.aperture as string) || 8;
        const coc = parseFloat(inputs.sensor as string) || 0.029;
        if (!f) return null;

        const H = (f * f) / (N * coc) + f;
        const nearLimit = H / 2;

        const formatDist = (mm: number) => {
          if (mm >= 1000) return `${formatNumber(mm / 1000, 2)} m (${formatNumber(mm / 304.8, 1)} ft)`;
          return `${formatNumber(mm, 0)} mm`;
        };

        return {
          primary: { label: "Hyperfocal Distance", value: formatDist(H) },
          details: [
            { label: "Near sharp limit", value: formatDist(nearLimit) },
            { label: "Far sharp limit", value: "Infinity" },
            { label: "Focal length", value: `${f} mm` },
            { label: "Aperture", value: `f/${N}` },
            { label: "Circle of confusion", value: `${coc} mm` },
          ],
          note: "Focus at the hyperfocal distance and everything from half that distance to infinity will be acceptably sharp. Ideal for landscapes.",
        };
      },
    },
    {
      id: "comparison",
      name: "Aperture Comparison",
      description: "Compare hyperfocal distances at different apertures",
      fields: [
        { name: "focalLength", label: "Focal Length (mm)", type: "number", placeholder: "e.g. 24" },
        { name: "sensor", label: "Sensor Size", type: "select", options: [
          { label: "Full Frame (36x24mm)", value: "0.029" },
          { label: "APS-C Canon (22.3x14.9mm)", value: "0.018" },
          { label: "APS-C Nikon/Sony (23.5x15.6mm)", value: "0.019" },
          { label: "Micro Four Thirds (17.3x13mm)", value: "0.015" },
        ], defaultValue: "0.029" },
      ],
      calculate: (inputs) => {
        const f = inputs.focalLength as number;
        const coc = parseFloat(inputs.sensor as string) || 0.029;
        if (!f) return null;

        const apertures = [4, 5.6, 8, 11, 16, 22];
        const results = apertures.map(N => {
          const H = (f * f) / (N * coc) + f;
          return { aperture: N, h: H };
        });

        const best = results[results.length - 1];
        const details = results.map(r => ({
          label: `f/${r.aperture}`,
          value: r.h >= 1000 ? `${formatNumber(r.h / 1000, 2)} m` : `${formatNumber(r.h, 0)} mm`,
        }));

        return {
          primary: { label: `Shortest Hyperfocal (f/${best.aperture})`, value: `${formatNumber(best.h / 1000, 2)} m` },
          details,
          note: "Smaller apertures (higher f-number) give shorter hyperfocal distances. However, very small apertures (f/22) may cause diffraction softening.",
        };
      },
    },
  ],
  relatedSlugs: ["depth-of-field-calculator", "focal-length-equivalent-calculator", "crop-factor-calculator"],
  faq: [
    { question: "What is hyperfocal distance?", answer: "Hyperfocal distance is the closest focus distance at which everything from half that distance to infinity appears acceptably sharp. It maximizes the depth of field for a given focal length and aperture." },
    { question: "When should I use hyperfocal distance?", answer: "Use hyperfocal focusing for landscape photography, street photography, and any scene where you want maximum sharpness from foreground to background. It's especially useful with wide-angle lenses." },
    { question: "Why not just focus at infinity?", answer: "Focusing at infinity wastes depth of field. Half the DOF extends behind infinity (unusable). By focusing at the hyperfocal distance, you bring the near focus limit much closer while keeping infinity sharp." },
  ],
  formula: "H = f²/(N×c) + f | Near limit = H/2 | Far limit = Infinity | where f=focal length, N=f-number, c=circle of confusion",
};
