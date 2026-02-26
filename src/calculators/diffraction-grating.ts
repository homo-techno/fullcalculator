import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const diffractionGratingCalculator: CalculatorDefinition = {
  slug: "diffraction-grating-calculator",
  title: "Diffraction Grating Calculator",
  description: "Free diffraction grating calculator. Compute diffraction angles, wavelength, and grating spacing using the grating equation d·sin(θ) = mλ.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["diffraction grating", "grating equation", "diffraction angle", "wavelength", "spectroscopy", "optics calculator"],
  variants: [
    {
      id: "angle",
      name: "Find Diffraction Angle",
      description: "Calculate the diffraction angle for a given wavelength, grating spacing, and order",
      fields: [
        { name: "wavelength", label: "Wavelength (nm)", type: "number", placeholder: "e.g. 550", min: 1 },
        { name: "slitsPerMm", label: "Grating Lines per mm", type: "number", placeholder: "e.g. 600", min: 1 },
        { name: "order", label: "Diffraction Order (m)", type: "number", placeholder: "e.g. 1", min: 1, max: 10, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const lambdaNm = parseFloat(inputs.wavelength as string);
        const slitsPerMm = parseFloat(inputs.slitsPerMm as string);
        const m = parseFloat(inputs.order as string);
        if (isNaN(lambdaNm) || isNaN(slitsPerMm) || isNaN(m)) return null;
        if (lambdaNm <= 0 || slitsPerMm <= 0 || m < 1) return null;

        const lambda = lambdaNm * 1e-9; // convert nm to m
        const d = 1e-3 / slitsPerMm; // grating spacing in m
        const sinTheta = (m * lambda) / d;
        if (Math.abs(sinTheta) > 1) {
          return {
            primary: { label: "Result", value: "No solution — order too high" },
            details: [
              { label: "sin(θ)", value: formatNumber(sinTheta, 6) },
              { label: "Required |sin(θ)| ≤ 1", value: "Not satisfied" },
            ],
            note: "The requested diffraction order cannot exist for this wavelength and grating. Try a lower order.",
          };
        }

        const thetaRad = Math.asin(sinTheta);
        const thetaDeg = thetaRad * (180 / Math.PI);

        // Maximum order possible
        const maxOrder = Math.floor(d / lambda);

        // Angular dispersion: dθ/dλ = m / (d·cos(θ))
        const angularDispersion = m / (d * Math.cos(thetaRad)); // rad/m
        const angularDispersionDeg = angularDispersion * (180 / Math.PI) * 1e-9; // deg/nm

        // Resolving power: R = m·N (total lines)
        const resolvingPower1000 = m * slitsPerMm * 1000; // for 1 mm grating

        return {
          primary: { label: "Diffraction Angle", value: `${formatNumber(thetaDeg, 4)}°` },
          details: [
            { label: "Angle θ", value: `${formatNumber(thetaDeg, 4)}°` },
            { label: "sin(θ)", value: formatNumber(sinTheta, 6) },
            { label: "Grating Spacing (d)", value: `${formatNumber(d * 1e6, 4)} μm` },
            { label: "Wavelength", value: `${formatNumber(lambdaNm, 2)} nm` },
            { label: "Order (m)", value: formatNumber(m, 0) },
            { label: "Max Possible Order", value: formatNumber(maxOrder, 0) },
            { label: "Angular Dispersion", value: `${formatNumber(angularDispersionDeg, 4)} °/nm` },
          ],
        };
      },
    },
    {
      id: "wavelength",
      name: "Find Wavelength",
      description: "Calculate the wavelength from the diffraction angle and grating spacing",
      fields: [
        { name: "angle", label: "Diffraction Angle (°)", type: "number", placeholder: "e.g. 30", min: 0.01, max: 89.99 },
        { name: "slitsPerMm", label: "Grating Lines per mm", type: "number", placeholder: "e.g. 600", min: 1 },
        { name: "order", label: "Diffraction Order (m)", type: "number", placeholder: "e.g. 1", min: 1, max: 10, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const angleDeg = parseFloat(inputs.angle as string);
        const slitsPerMm = parseFloat(inputs.slitsPerMm as string);
        const m = parseFloat(inputs.order as string);
        if (isNaN(angleDeg) || isNaN(slitsPerMm) || isNaN(m)) return null;

        const thetaRad = angleDeg * (Math.PI / 180);
        const d = 1e-3 / slitsPerMm;
        const lambda = (d * Math.sin(thetaRad)) / m;
        const lambdaNm = lambda * 1e9;

        let color = "Unknown";
        if (lambdaNm >= 380 && lambdaNm < 450) color = "Violet";
        else if (lambdaNm >= 450 && lambdaNm < 495) color = "Blue";
        else if (lambdaNm >= 495 && lambdaNm < 570) color = "Green";
        else if (lambdaNm >= 570 && lambdaNm < 590) color = "Yellow";
        else if (lambdaNm >= 590 && lambdaNm < 620) color = "Orange";
        else if (lambdaNm >= 620 && lambdaNm <= 780) color = "Red";
        else if (lambdaNm < 380) color = "UV";
        else color = "IR";

        const frequency = 3e8 / lambda;

        return {
          primary: { label: "Wavelength", value: `${formatNumber(lambdaNm, 2)} nm` },
          details: [
            { label: "Wavelength", value: `${formatNumber(lambdaNm, 2)} nm` },
            { label: "Frequency", value: `${formatNumber(frequency / 1e12, 4)} THz` },
            { label: "Visible Color", value: color },
            { label: "Grating Spacing", value: `${formatNumber(d * 1e6, 4)} μm` },
            { label: "Angle", value: `${formatNumber(angleDeg, 4)}°` },
            { label: "Order", value: formatNumber(m, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wavelength-calculator", "electromagnetic-wave-calculator", "prism-dispersion-calculator"],
  faq: [
    { question: "What is the diffraction grating equation?", answer: "The grating equation is d·sin(θ) = mλ, where d is the grating spacing (distance between slits), θ is the diffraction angle, m is the order (integer), and λ is the wavelength. It predicts the angles at which constructive interference occurs." },
    { question: "What determines the maximum diffraction order?", answer: "Since sin(θ) cannot exceed 1, the maximum order is m_max = floor(d/λ). Higher orders require larger grating spacing relative to the wavelength. For visible light (~550 nm) with 600 lines/mm (d ≈ 1.67 μm), the max order is about 3." },
    { question: "What is angular dispersion?", answer: "Angular dispersion (dθ/dλ) describes how much the diffraction angle changes per unit wavelength. It equals m/(d·cos θ). Higher orders and finer gratings give greater dispersion, allowing better separation of closely spaced wavelengths." },
  ],
  formula: "d·sin(θ) = mλ | d = 1/N (N = lines per unit length) | Angular dispersion = m/(d·cos θ)",
};
