import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airyDiskCalculator: CalculatorDefinition = {
  slug: "airy-disk-calculator",
  title: "Airy Disk Calculator",
  description: "Calculate the angular resolution and Airy disk radius for a circular aperture, determining the diffraction limit of a telescope or camera lens.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["airy disk","diffraction limit","angular resolution","telescope resolving power"],
  variants: [{
    id: "standard",
    name: "Airy Disk",
    description: "Calculate the angular resolution and Airy disk radius for a circular aperture, determining the diffraction limit of a telescope or camera lens.",
    fields: [
      { name: "aperture", label: "Aperture Diameter (mm)", type: "number", min: 1, max: 20000, defaultValue: 200 },
      { name: "wavelength", label: "Wavelength of Light (nm)", type: "number", min: 100, max: 10000, defaultValue: 550 },
      { name: "focalLength", label: "Focal Length (mm)", type: "number", min: 10, max: 100000, defaultValue: 2000 },
    ],
    calculate: (inputs) => {
    const D = inputs.aperture as number / 1000;
    const lambda = inputs.wavelength as number * 1e-9;
    const focalLength = inputs.focalLength as number / 1000;
    const angularRes = 1.22 * lambda / D;
    const angularResArcsec = angularRes * 206265;
    const airyRadius = 1.22 * lambda * focalLength / D;
    const airyRadiusMicrons = airyRadius * 1e6;
    const dawesLimit = 116 / (inputs.aperture as number);
    return {
      primary: { label: "Angular Resolution", value: formatNumber(Math.round(angularResArcsec * 1000) / 1000) + " arcsec" },
      details: [
        { label: "Airy Disk Radius", value: formatNumber(Math.round(airyRadiusMicrons * 100) / 100) + " microns" },
        { label: "Dawes Limit", value: formatNumber(Math.round(dawesLimit * 100) / 100) + " arcsec" },
        { label: "f-ratio", value: "f/" + formatNumber(Math.round(focalLength / D * 10) / 10) }
      ]
    };
  },
  }],
  relatedSlugs: ["telescope-magnification-calculator","telescope-fov-calculator"],
  faq: [
    { question: "What is the Airy disk?", answer: "The Airy disk is the central bright spot in the diffraction pattern produced by a circular aperture. It represents the smallest point to which a perfect optical system can focus light." },
    { question: "What is the Dawes limit?", answer: "The Dawes limit is an empirical formula for the angular resolution of a telescope: 116 divided by the aperture in millimeters, giving the result in arcseconds. It is slightly more optimistic than the Rayleigh criterion." },
    { question: "How does aperture affect resolution?", answer: "Larger apertures produce smaller Airy disks and better angular resolution. Doubling the aperture diameter halves the minimum resolvable angle, allowing you to see finer details." },
  ],
  formula: "Angular Resolution = 1.22 x lambda / D (radians)
Airy Disk Radius = 1.22 x lambda x f / D
Dawes Limit = 116 / D(mm) arcseconds",
};
