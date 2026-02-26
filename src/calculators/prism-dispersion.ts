import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const prismDispersionCalculator: CalculatorDefinition = {
  slug: "prism-dispersion-calculator",
  title: "Prism Dispersion Calculator",
  description: "Free prism dispersion and refraction calculator. Compute deviation angles, minimum deviation, and angular dispersion using Snell's law and Cauchy's equation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["prism dispersion", "snell's law", "refraction", "deviation angle", "refractive index", "angular dispersion"],
  variants: [
    {
      id: "deviation",
      name: "Prism Deviation Angle",
      description: "Calculate the angle of deviation for light passing through a prism",
      fields: [
        { name: "prismAngle", label: "Prism Apex Angle (°)", type: "number", placeholder: "e.g. 60", min: 1, max: 179 },
        { name: "incidentAngle", label: "Angle of Incidence (°)", type: "number", placeholder: "e.g. 45", min: 0.1, max: 89.9 },
        { name: "refractiveIndex", label: "Refractive Index (n)", type: "number", placeholder: "e.g. 1.52", min: 1.0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const A = parseFloat(inputs.prismAngle as string);
        const i1Deg = parseFloat(inputs.incidentAngle as string);
        const n = parseFloat(inputs.refractiveIndex as string);
        if (isNaN(A) || isNaN(i1Deg) || isNaN(n)) return null;
        if (A <= 0 || A >= 180 || i1Deg <= 0 || i1Deg >= 90 || n < 1) return null;

        const degToRad = Math.PI / 180;
        const radToDeg = 180 / Math.PI;

        const i1 = i1Deg * degToRad;
        const Arad = A * degToRad;

        // Snell's law at first surface: sin(i1) = n * sin(r1)
        const sinR1 = Math.sin(i1) / n;
        if (Math.abs(sinR1) > 1) return null;
        const r1 = Math.asin(sinR1);

        // r1 + r2 = A
        const r2 = Arad - r1;
        if (r2 < 0) return null;

        // Snell's law at second surface: n * sin(r2) = sin(i2)
        const sinI2 = n * Math.sin(r2);
        if (Math.abs(sinI2) > 1) {
          return {
            primary: { label: "Result", value: "Total internal reflection" },
            details: [
              { label: "Light cannot exit the prism at this angle", value: "TIR occurs at second surface" },
            ],
          };
        }
        const i2 = Math.asin(sinI2);

        // Deviation: δ = i1 + i2 - A
        const delta = i1 + i2 - Arad;

        // Minimum deviation for this prism and n
        const sinMinDev = n * Math.sin(Arad / 2);
        const minDevAngle = sinMinDev <= 1 ? 2 * Math.asin(sinMinDev) - Arad : NaN;

        return {
          primary: { label: "Deviation Angle (δ)", value: `${formatNumber(delta * radToDeg, 4)}°` },
          details: [
            { label: "Angle of Incidence (i₁)", value: `${formatNumber(i1Deg, 4)}°` },
            { label: "Refraction Angle at Entry (r₁)", value: `${formatNumber(r1 * radToDeg, 4)}°` },
            { label: "Refraction Angle at Exit (r₂)", value: `${formatNumber(r2 * radToDeg, 4)}°` },
            { label: "Angle of Emergence (i₂)", value: `${formatNumber(i2 * radToDeg, 4)}°` },
            { label: "Deviation (δ)", value: `${formatNumber(delta * radToDeg, 4)}°` },
            { label: "Min Deviation (δ_min)", value: !isNaN(minDevAngle) ? `${formatNumber(minDevAngle * radToDeg, 4)}°` : "N/A" },
            { label: "Refractive Index", value: formatNumber(n, 4) },
          ],
        };
      },
    },
    {
      id: "dispersion",
      name: "Dispersion (Two Wavelengths)",
      description: "Calculate angular spread between two wavelengths using different refractive indices",
      fields: [
        { name: "prismAngle", label: "Prism Apex Angle (°)", type: "number", placeholder: "e.g. 60", min: 1, max: 179 },
        { name: "nRed", label: "n (Red, ~656nm)", type: "number", placeholder: "e.g. 1.513", min: 1.0, step: 0.001 },
        { name: "nViolet", label: "n (Violet, ~486nm)", type: "number", placeholder: "e.g. 1.532", min: 1.0, step: 0.001 },
      ],
      calculate: (inputs) => {
        const A = parseFloat(inputs.prismAngle as string);
        const nR = parseFloat(inputs.nRed as string);
        const nV = parseFloat(inputs.nViolet as string);
        if (isNaN(A) || isNaN(nR) || isNaN(nV)) return null;

        const degToRad = Math.PI / 180;
        const radToDeg = 180 / Math.PI;
        const Arad = A * degToRad;

        // Minimum deviation: δ_min = 2·arcsin(n·sin(A/2)) - A
        const sinR = nR * Math.sin(Arad / 2);
        const sinV = nV * Math.sin(Arad / 2);
        if (Math.abs(sinR) > 1 || Math.abs(sinV) > 1) return null;

        const deltaR = 2 * Math.asin(sinR) - Arad;
        const deltaV = 2 * Math.asin(sinV) - Arad;
        const angularDispersion = Math.abs(deltaV - deltaR);
        const dispersivePower = (nV - nR) / ((nR + nV) / 2 - 1);
        const meanN = (nR + nV) / 2;

        return {
          primary: { label: "Angular Dispersion", value: `${formatNumber(angularDispersion * radToDeg, 4)}°` },
          details: [
            { label: "n (Red)", value: formatNumber(nR, 4) },
            { label: "n (Violet)", value: formatNumber(nV, 4) },
            { label: "Mean n", value: formatNumber(meanN, 4) },
            { label: "δ_min (Red)", value: `${formatNumber(deltaR * radToDeg, 4)}°` },
            { label: "δ_min (Violet)", value: `${formatNumber(deltaV * radToDeg, 4)}°` },
            { label: "Angular Dispersion", value: `${formatNumber(angularDispersion * radToDeg, 4)}°` },
            { label: "Dispersive Power (ω)", value: formatNumber(dispersivePower, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["diffraction-grating-calculator", "wavelength-calculator", "electromagnetic-wave-calculator"],
  faq: [
    { question: "What is prism dispersion?", answer: "Dispersion is the separation of white light into its component colors by a prism. It occurs because the refractive index of glass depends on wavelength — shorter wavelengths (violet) are refracted more than longer wavelengths (red), creating a spectrum." },
    { question: "What is the minimum deviation angle?", answer: "The minimum deviation occurs when light passes symmetrically through the prism (i₁ = i₂). At minimum deviation: n = sin((A + δ_min)/2) / sin(A/2). This relationship is used to accurately measure refractive indices." },
    { question: "What is dispersive power?", answer: "Dispersive power ω = (n_V - n_R)/(n_mean - 1) measures a material's ability to separate colors. Crown glass has low dispersion (ω ≈ 0.02), while flint glass has high dispersion (ω ≈ 0.04). Achromatic lenses combine both to minimize chromatic aberration." },
  ],
  formula: "Snell: sin i = n sin r | δ = i₁ + i₂ - A | δ_min = 2 arcsin(n sin(A/2)) - A | ω = (n_V - n_R)/(n_D - 1)",
};
