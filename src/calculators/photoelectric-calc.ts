import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const h = 6.62607015e-34; // Planck's constant (J·s)
const c = 2.99792458e8; // Speed of light (m/s)
const eV = 1.602176634e-19; // eV to Joules
const me = 9.1093837015e-31; // Electron mass (kg)

export const photoelectricCalculator: CalculatorDefinition = {
  slug: "photoelectric-effect-calculator",
  title: "Photoelectric Effect Calculator",
  description: "Free photoelectric effect calculator. Compute the maximum kinetic energy and stopping voltage of photoelectrons using Einstein's photoelectric equation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["photoelectric effect", "work function", "threshold frequency", "stopping voltage", "kinetic energy", "photon energy"],
  variants: [
    {
      id: "from-wavelength",
      name: "From Wavelength",
      description: "Calculate photoelectron kinetic energy from incident light wavelength and work function",
      fields: [
        { name: "wavelength", label: "Incident Wavelength (nm)", type: "number", placeholder: "e.g. 300", min: 1 },
        { name: "workFunction", label: "Work Function φ (eV)", type: "number", placeholder: "e.g. 2.3", min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const lambdaNm = parseFloat(inputs.wavelength as string);
        const phi = parseFloat(inputs.workFunction as string);
        if (isNaN(lambdaNm) || isNaN(phi)) return null;
        if (lambdaNm <= 0 || phi < 0) return null;

        const lambdaM = lambdaNm * 1e-9;
        const photonEnergy = (h * c) / lambdaM;
        const photonEnergyEV = photonEnergy / eV;
        const phiJ = phi * eV;

        // Threshold wavelength
        const thresholdWavelength = phi > 0 ? (h * c) / phiJ : Infinity;
        const thresholdFrequency = phi > 0 ? phiJ / h : 0;

        if (photonEnergy < phiJ) {
          return {
            primary: { label: "Result", value: "No photoelectrons emitted" },
            details: [
              { label: "Photon Energy", value: `${formatNumber(photonEnergyEV, 4)} eV` },
              { label: "Work Function", value: `${formatNumber(phi, 4)} eV` },
              { label: "Energy Deficit", value: `${formatNumber(phi - photonEnergyEV, 4)} eV` },
              { label: "Threshold Wavelength", value: `${formatNumber(thresholdWavelength * 1e9, 1)} nm` },
            ],
            note: `The photon energy (${formatNumber(photonEnergyEV, 2)} eV) is less than the work function (${formatNumber(phi, 2)} eV). Use wavelength < ${formatNumber(thresholdWavelength * 1e9, 1)} nm.`,
          };
        }

        const keMax = photonEnergy - phiJ;
        const keMaxEV = keMax / eV;
        const stoppingVoltage = keMaxEV;
        const velocity = Math.sqrt((2 * keMax) / me);

        return {
          primary: { label: "Max Kinetic Energy", value: `${formatNumber(keMaxEV, 4)} eV` },
          details: [
            { label: "Photon Energy (E)", value: `${formatNumber(photonEnergyEV, 4)} eV` },
            { label: "Work Function (φ)", value: `${formatNumber(phi, 4)} eV` },
            { label: "Max KE (E - φ)", value: `${formatNumber(keMaxEV, 4)} eV` },
            { label: "Max KE (J)", value: `${formatNumber(keMax, 6)} J` },
            { label: "Stopping Voltage", value: `${formatNumber(stoppingVoltage, 4)} V` },
            { label: "Max Electron Speed", value: `${formatNumber(velocity, 0)} m/s` },
            { label: "Threshold Wavelength", value: `${formatNumber(thresholdWavelength * 1e9, 1)} nm` },
            { label: "Threshold Frequency", value: `${formatNumber(thresholdFrequency / 1e14, 4)} × 10¹⁴ Hz` },
          ],
        };
      },
    },
    {
      id: "from-frequency",
      name: "From Frequency",
      description: "Calculate photoelectric parameters from incident frequency",
      fields: [
        { name: "frequency", label: "Incident Frequency (×10¹⁴ Hz)", type: "number", placeholder: "e.g. 8.5", min: 0.01 },
        { name: "workFunction", label: "Work Function φ (eV)", type: "number", placeholder: "e.g. 2.3", min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const freqScale = parseFloat(inputs.frequency as string);
        const phi = parseFloat(inputs.workFunction as string);
        if (isNaN(freqScale) || isNaN(phi)) return null;
        if (freqScale <= 0 || phi < 0) return null;

        const freq = freqScale * 1e14;
        const photonEnergy = h * freq;
        const photonEnergyEV = photonEnergy / eV;
        const phiJ = phi * eV;
        const thresholdFreq = phiJ / h;
        const wavelengthNm = (c / freq) * 1e9;

        if (photonEnergy < phiJ) {
          return {
            primary: { label: "Result", value: "No photoelectrons emitted" },
            details: [
              { label: "Photon Energy", value: `${formatNumber(photonEnergyEV, 4)} eV` },
              { label: "Work Function", value: `${formatNumber(phi, 4)} eV` },
              { label: "Threshold Frequency", value: `${formatNumber(thresholdFreq / 1e14, 4)} × 10¹⁴ Hz` },
            ],
          };
        }

        const keMax = photonEnergy - phiJ;
        const keMaxEV = keMax / eV;
        const stoppingVoltage = keMaxEV;
        const velocity = Math.sqrt((2 * keMax) / me);

        return {
          primary: { label: "Max Kinetic Energy", value: `${formatNumber(keMaxEV, 4)} eV` },
          details: [
            { label: "Frequency", value: `${formatNumber(freqScale, 4)} × 10¹⁴ Hz` },
            { label: "Wavelength", value: `${formatNumber(wavelengthNm, 1)} nm` },
            { label: "Photon Energy", value: `${formatNumber(photonEnergyEV, 4)} eV` },
            { label: "Work Function", value: `${formatNumber(phi, 4)} eV` },
            { label: "Max KE", value: `${formatNumber(keMaxEV, 4)} eV` },
            { label: "Stopping Voltage", value: `${formatNumber(stoppingVoltage, 4)} V` },
            { label: "Max Speed", value: `${formatNumber(velocity, 0)} m/s` },
          ],
        };
      },
    },
    {
      id: "find-work-function",
      name: "Find Work Function",
      description: "Determine the work function from stopping voltage and wavelength",
      fields: [
        { name: "wavelength", label: "Incident Wavelength (nm)", type: "number", placeholder: "e.g. 400", min: 1 },
        { name: "stoppingVoltage", label: "Stopping Voltage (V)", type: "number", placeholder: "e.g. 0.8", min: 0 },
      ],
      calculate: (inputs) => {
        const lambdaNm = parseFloat(inputs.wavelength as string);
        const Vs = parseFloat(inputs.stoppingVoltage as string);
        if (isNaN(lambdaNm) || isNaN(Vs)) return null;
        if (lambdaNm <= 0 || Vs < 0) return null;

        const lambdaM = lambdaNm * 1e-9;
        const photonEnergy = (h * c) / lambdaM;
        const photonEnergyEV = photonEnergy / eV;
        const keMaxEV = Vs; // eV = e × V
        const phi = photonEnergyEV - keMaxEV;

        if (phi < 0) {
          return {
            primary: { label: "Error", value: "Invalid - KE exceeds photon energy" },
            details: [],
          };
        }

        const thresholdWavelength = (h * c) / (phi * eV);

        return {
          primary: { label: "Work Function (φ)", value: `${formatNumber(phi, 4)} eV` },
          details: [
            { label: "Photon Energy", value: `${formatNumber(photonEnergyEV, 4)} eV` },
            { label: "Stopping Voltage", value: `${formatNumber(Vs, 4)} V` },
            { label: "Max KE", value: `${formatNumber(keMaxEV, 4)} eV` },
            { label: "Work Function (φ)", value: `${formatNumber(phi, 4)} eV` },
            { label: "Threshold Wavelength", value: `${formatNumber(thresholdWavelength * 1e9, 1)} nm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compton-scattering-calculator", "electromagnetic-wave-calculator", "wavelength-calculator"],
  faq: [
    { question: "What is the photoelectric effect?", answer: "The photoelectric effect is the emission of electrons from a surface when light shines on it. Einstein explained it in 1905: a photon of energy E = hf ejects an electron only if E exceeds the work function φ. The maximum kinetic energy is KE_max = hf - φ." },
    { question: "What is the work function?", answer: "The work function (φ) is the minimum energy needed to remove an electron from a material's surface. Common values: Cesium 2.1 eV, Sodium 2.3 eV, Zinc 4.3 eV, Platinum 5.6 eV. Photons with energy below φ cannot eject electrons regardless of intensity." },
    { question: "What is stopping voltage?", answer: "Stopping voltage (V_s) is the potential difference needed to stop the most energetic photoelectrons. It directly gives the maximum kinetic energy: KE_max = eV_s. It is independent of light intensity — only wavelength/frequency matters." },
  ],
  formula: "KE_max = hf - φ = hc/λ - φ | V_s = KE_max / e | f₀ = φ/h | λ₀ = hc/φ",
};
