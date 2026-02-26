import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const c = 2.99792458e8; // speed of light m/s
const h = 6.62607015e-34; // Planck's constant J·s
const eVtoJ = 1.602176634e-19;

function classifyEM(freqHz: number): string {
  if (freqHz < 3e9) return "Radio";
  if (freqHz < 3e11) return "Microwave";
  if (freqHz < 4.3e14) return "Infrared";
  if (freqHz < 7.5e14) return "Visible Light";
  if (freqHz < 3e16) return "Ultraviolet";
  if (freqHz < 3e19) return "X-ray";
  return "Gamma Ray";
}

function visibleColor(lambdaNm: number): string {
  if (lambdaNm >= 380 && lambdaNm < 450) return "Violet";
  if (lambdaNm >= 450 && lambdaNm < 495) return "Blue";
  if (lambdaNm >= 495 && lambdaNm < 570) return "Green";
  if (lambdaNm >= 570 && lambdaNm < 590) return "Yellow";
  if (lambdaNm >= 590 && lambdaNm < 620) return "Orange";
  if (lambdaNm >= 620 && lambdaNm <= 780) return "Red";
  return "N/A";
}

export const electromagneticWaveCalculator: CalculatorDefinition = {
  slug: "electromagnetic-wave-calculator",
  title: "Electromagnetic Wave Calculator",
  description: "Free electromagnetic wave calculator. Convert between wavelength, frequency, and photon energy across the entire EM spectrum.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["electromagnetic wave", "wavelength frequency", "photon energy", "EM spectrum", "light wavelength", "radio frequency"],
  variants: [
    {
      id: "from-wavelength",
      name: "From Wavelength",
      description: "Calculate frequency and photon energy from wavelength",
      fields: [
        { name: "wavelength", label: "Wavelength", type: "number", placeholder: "e.g. 550", min: 0.0001 },
        {
          name: "unit",
          label: "Wavelength Unit",
          type: "select",
          options: [
            { label: "nm (nanometers)", value: "nm" },
            { label: "μm (micrometers)", value: "um" },
            { label: "mm (millimeters)", value: "mm" },
            { label: "m (meters)", value: "m" },
            { label: "cm (centimeters)", value: "cm" },
            { label: "pm (picometers)", value: "pm" },
          ],
          defaultValue: "nm",
        },
      ],
      calculate: (inputs) => {
        const val = parseFloat(inputs.wavelength as string);
        const unit = (inputs.unit as string) || "nm";
        if (isNaN(val) || val <= 0) return null;

        let lambdaM: number;
        switch (unit) {
          case "pm": lambdaM = val * 1e-12; break;
          case "nm": lambdaM = val * 1e-9; break;
          case "um": lambdaM = val * 1e-6; break;
          case "mm": lambdaM = val * 1e-3; break;
          case "cm": lambdaM = val * 1e-2; break;
          default: lambdaM = val;
        }

        const freq = c / lambdaM;
        const energy = h * freq;
        const energyEV = energy / eVtoJ;
        const lambdaNm = lambdaM * 1e9;
        const band = classifyEM(freq);
        const color = visibleColor(lambdaNm);
        const waveNumber = 1 / (lambdaM * 100); // cm^-1

        return {
          primary: { label: "Frequency", value: freq >= 1e12 ? `${formatNumber(freq / 1e12, 4)} THz` : freq >= 1e9 ? `${formatNumber(freq / 1e9, 4)} GHz` : `${formatNumber(freq / 1e6, 4)} MHz` },
          details: [
            { label: "Wavelength", value: `${formatNumber(val, 6)} ${unit}` },
            { label: "Wavelength (m)", value: `${formatNumber(lambdaM, 6)} m` },
            { label: "Frequency", value: `${formatNumber(freq, 6)} Hz` },
            { label: "Photon Energy", value: `${formatNumber(energyEV, 6)} eV` },
            { label: "Photon Energy (J)", value: `${formatNumber(energy, 6)} J` },
            { label: "Wave Number", value: `${formatNumber(waveNumber, 2)} cm⁻¹` },
            { label: "EM Band", value: band },
            ...(color !== "N/A" ? [{ label: "Visible Color", value: color }] : []),
          ],
        };
      },
    },
    {
      id: "from-frequency",
      name: "From Frequency",
      description: "Calculate wavelength and photon energy from frequency",
      fields: [
        { name: "frequency", label: "Frequency", type: "number", placeholder: "e.g. 5.45e14", min: 0.0001 },
        {
          name: "unit",
          label: "Frequency Unit",
          type: "select",
          options: [
            { label: "Hz", value: "Hz" },
            { label: "kHz", value: "kHz" },
            { label: "MHz", value: "MHz" },
            { label: "GHz", value: "GHz" },
            { label: "THz", value: "THz" },
          ],
          defaultValue: "Hz",
        },
      ],
      calculate: (inputs) => {
        const val = parseFloat(inputs.frequency as string);
        const unit = (inputs.unit as string) || "Hz";
        if (isNaN(val) || val <= 0) return null;

        let freqHz: number;
        switch (unit) {
          case "kHz": freqHz = val * 1e3; break;
          case "MHz": freqHz = val * 1e6; break;
          case "GHz": freqHz = val * 1e9; break;
          case "THz": freqHz = val * 1e12; break;
          default: freqHz = val;
        }

        const lambdaM = c / freqHz;
        const energy = h * freqHz;
        const energyEV = energy / eVtoJ;
        const lambdaNm = lambdaM * 1e9;
        const band = classifyEM(freqHz);
        const color = visibleColor(lambdaNm);

        let lambdaDisplay: string;
        if (lambdaM >= 1) lambdaDisplay = `${formatNumber(lambdaM, 4)} m`;
        else if (lambdaM >= 1e-3) lambdaDisplay = `${formatNumber(lambdaM * 1e3, 4)} mm`;
        else if (lambdaM >= 1e-6) lambdaDisplay = `${formatNumber(lambdaM * 1e6, 4)} μm`;
        else lambdaDisplay = `${formatNumber(lambdaM * 1e9, 4)} nm`;

        return {
          primary: { label: "Wavelength", value: lambdaDisplay },
          details: [
            { label: "Frequency", value: `${formatNumber(val, 6)} ${unit}` },
            { label: "Wavelength", value: lambdaDisplay },
            { label: "Wavelength (m)", value: `${formatNumber(lambdaM, 6)} m` },
            { label: "Photon Energy", value: `${formatNumber(energyEV, 6)} eV` },
            { label: "EM Band", value: band },
            ...(color !== "N/A" ? [{ label: "Visible Color", value: color }] : []),
          ],
        };
      },
    },
    {
      id: "from-energy",
      name: "From Photon Energy",
      description: "Calculate wavelength and frequency from photon energy",
      fields: [
        { name: "energy", label: "Photon Energy", type: "number", placeholder: "e.g. 2.25", min: 0.0001 },
        {
          name: "unit",
          label: "Energy Unit",
          type: "select",
          options: [
            { label: "eV", value: "eV" },
            { label: "keV", value: "keV" },
            { label: "MeV", value: "MeV" },
            { label: "J", value: "J" },
          ],
          defaultValue: "eV",
        },
      ],
      calculate: (inputs) => {
        const val = parseFloat(inputs.energy as string);
        const unit = (inputs.unit as string) || "eV";
        if (isNaN(val) || val <= 0) return null;

        let energyJ: number;
        switch (unit) {
          case "eV": energyJ = val * eVtoJ; break;
          case "keV": energyJ = val * 1e3 * eVtoJ; break;
          case "MeV": energyJ = val * 1e6 * eVtoJ; break;
          default: energyJ = val;
        }

        const freq = energyJ / h;
        const lambdaM = c / freq;
        const lambdaNm = lambdaM * 1e9;
        const band = classifyEM(freq);
        const color = visibleColor(lambdaNm);

        let lambdaDisplay: string;
        if (lambdaM >= 1) lambdaDisplay = `${formatNumber(lambdaM, 4)} m`;
        else if (lambdaM >= 1e-3) lambdaDisplay = `${formatNumber(lambdaM * 1e3, 4)} mm`;
        else if (lambdaM >= 1e-6) lambdaDisplay = `${formatNumber(lambdaM * 1e6, 4)} μm`;
        else if (lambdaM >= 1e-9) lambdaDisplay = `${formatNumber(lambdaNm, 4)} nm`;
        else lambdaDisplay = `${formatNumber(lambdaM * 1e12, 4)} pm`;

        return {
          primary: { label: "Wavelength", value: lambdaDisplay },
          details: [
            { label: "Energy", value: `${formatNumber(val, 6)} ${unit}` },
            { label: "Wavelength", value: lambdaDisplay },
            { label: "Frequency", value: freq >= 1e12 ? `${formatNumber(freq / 1e12, 4)} THz` : `${formatNumber(freq / 1e9, 4)} GHz` },
            { label: "EM Band", value: band },
            ...(color !== "N/A" ? [{ label: "Visible Color", value: color }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wavelength-calculator", "diffraction-grating-calculator", "photoelectric-effect-calculator"],
  faq: [
    { question: "How are wavelength, frequency, and energy related?", answer: "c = λf (speed of light = wavelength × frequency) and E = hf (energy = Planck's constant × frequency). Shorter wavelength means higher frequency and more energy. These relationships apply to all electromagnetic waves." },
    { question: "What are the regions of the electromagnetic spectrum?", answer: "From low to high frequency: Radio (< 3 GHz), Microwave (3 GHz - 300 GHz), Infrared (300 GHz - 430 THz), Visible (430-750 THz), Ultraviolet (750 THz - 30 PHz), X-ray (30 PHz - 30 EHz), Gamma Ray (> 30 EHz)." },
  ],
  formula: "c = λf | E = hf = hc/λ | c = 2.998×10⁸ m/s | h = 6.626×10⁻³⁴ J·s",
};
