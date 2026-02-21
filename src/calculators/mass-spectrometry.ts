import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const massSpectrometryCalculator: CalculatorDefinition = {
  slug: "mass-spectrometry-calculator",
  title: "Mass Spectrometry m/z Calculator",
  description: "Free mass spectrometry calculator. Calculate mass-to-charge ratio (m/z), molecular ion peaks, isotope patterns, and fragment masses for MS analysis.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["mass spectrometry", "m/z ratio", "molecular ion", "mass spec", "fragmentation", "ESI", "MALDI"],
  variants: [
    {
      id: "mzRatio",
      name: "Calculate m/z Ratio",
      description: "m/z = (M ± n×H) / z for ESI",
      fields: [
        { name: "molecularWeight", label: "Molecular Weight (Da)", type: "number", placeholder: "e.g. 1000" },
        { name: "charge", label: "Charge State (z)", type: "number", placeholder: "e.g. 1", min: 1, step: 1, defaultValue: 1 },
        { name: "ionMode", label: "Ionization Mode", type: "select", options: [
          { label: "Positive [M+nH]ⁿ⁺", value: "positive" },
          { label: "Negative [M-nH]ⁿ⁻", value: "negative" },
          { label: "Sodium Adduct [M+Na]⁺", value: "sodium" },
          { label: "Potassium Adduct [M+K]⁺", value: "potassium" },
          { label: "Ammonium Adduct [M+NH4]⁺", value: "ammonium" },
        ] },
      ],
      calculate: (inputs) => {
        const mw = inputs.molecularWeight as number, z = inputs.charge as number || 1;
        const mode = inputs.ionMode as string;
        if (!mw || mw <= 0 || z < 1) return null;
        const H = 1.00728; // proton mass
        const Na = 22.9892;
        const K = 38.9632;
        const NH4 = 18.0338;
        let mz = 0;
        let ionLabel = "";
        switch (mode) {
          case "positive":
            mz = (mw + z * H) / z;
            ionLabel = `[M+${z}H]${z}+`;
            break;
          case "negative":
            mz = (mw - z * H) / z;
            ionLabel = `[M-${z}H]${z}-`;
            break;
          case "sodium":
            mz = (mw + Na) / z;
            ionLabel = `[M+Na]+`;
            break;
          case "potassium":
            mz = (mw + K) / z;
            ionLabel = `[M+K]+`;
            break;
          case "ammonium":
            mz = (mw + NH4) / z;
            ionLabel = `[M+NH4]+`;
            break;
          default:
            mz = (mw + z * H) / z;
            ionLabel = `[M+${z}H]${z}+`;
        }
        return {
          primary: { label: "m/z", value: formatNumber(mz, 4) },
          details: [
            { label: "Ion", value: ionLabel },
            { label: "Molecular Weight", value: `${formatNumber(mw, 4)} Da` },
            { label: "Charge State", value: `${z}` },
            { label: "Proton Mass", value: `${H} Da` },
          ],
        };
      },
    },
    {
      id: "mwFromMz",
      name: "Molecular Weight from m/z",
      description: "Calculate MW from observed m/z peak",
      fields: [
        { name: "mz", label: "Observed m/z", type: "number", placeholder: "e.g. 501.007" },
        { name: "charge", label: "Charge State (z)", type: "number", placeholder: "e.g. 2", min: 1, step: 1, defaultValue: 1 },
        { name: "ionMode", label: "Ionization Mode", type: "select", options: [
          { label: "Positive [M+nH]ⁿ⁺", value: "positive" },
          { label: "Negative [M-nH]ⁿ⁻", value: "negative" },
          { label: "Sodium Adduct [M+Na]⁺", value: "sodium" },
          { label: "Potassium Adduct [M+K]⁺", value: "potassium" },
        ] },
      ],
      calculate: (inputs) => {
        const mz = inputs.mz as number, z = inputs.charge as number || 1;
        const mode = inputs.ionMode as string;
        if (!mz || mz <= 0 || z < 1) return null;
        const H = 1.00728;
        const Na = 22.9892;
        const K = 38.9632;
        let mw = 0;
        switch (mode) {
          case "positive": mw = mz * z - z * H; break;
          case "negative": mw = mz * z + z * H; break;
          case "sodium": mw = mz * z - Na; break;
          case "potassium": mw = mz * z - K; break;
          default: mw = mz * z - z * H;
        }
        return {
          primary: { label: "Molecular Weight", value: `${formatNumber(mw, 4)} Da` },
          details: [
            { label: "Observed m/z", value: formatNumber(mz, 4) },
            { label: "Charge State", value: `${z}` },
            { label: "Mode", value: mode || "positive" },
          ],
        };
      },
    },
    {
      id: "chargeStateEnvelope",
      name: "Charge State Envelope",
      description: "Calculate m/z for multiple charge states",
      fields: [
        { name: "molecularWeight", label: "Molecular Weight (Da)", type: "number", placeholder: "e.g. 15000" },
        { name: "maxCharge", label: "Maximum Charge State", type: "number", placeholder: "e.g. 10", min: 1, max: 50, step: 1, defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const mw = inputs.molecularWeight as number, maxZ = inputs.maxCharge as number || 5;
        if (!mw || mw <= 0 || maxZ < 1) return null;
        const H = 1.00728;
        const details: { label: string; value: string }[] = [];
        for (let z = 1; z <= Math.min(maxZ, 10); z++) {
          const mz = (mw + z * H) / z;
          details.push({ label: `z = +${z}`, value: `m/z = ${formatNumber(mz, 4)}` });
        }
        const mzAt1 = (mw + H);
        return {
          primary: { label: "Molecular Weight", value: `${formatNumber(mw, 4)} Da` },
          details,
          note: `For proteins and large molecules, ESI typically produces multiply-charged ions. Adjacent peaks differ by ~M/z². The m/z at z=1 is ${formatNumber(mzAt1, 4)}.`,
        };
      },
    },
    {
      id: "massAccuracy",
      name: "Mass Accuracy (ppm)",
      description: "Calculate mass accuracy in ppm",
      fields: [
        { name: "theoretical", label: "Theoretical m/z", type: "number", placeholder: "e.g. 500.2654" },
        { name: "observed", label: "Observed m/z", type: "number", placeholder: "e.g. 500.2660" },
      ],
      calculate: (inputs) => {
        const theo = inputs.theoretical as number, obs = inputs.observed as number;
        if (!theo || !obs || theo <= 0) return null;
        const errorDa = obs - theo;
        const errorPPM = (errorDa / theo) * 1e6;
        const absPPM = Math.abs(errorPPM);
        return {
          primary: { label: "Mass Accuracy", value: `${formatNumber(errorPPM, 2)} ppm` },
          details: [
            { label: "Absolute Error", value: `${formatNumber(Math.abs(errorDa), 6)} Da` },
            { label: "Error (Da)", value: `${formatNumber(errorDa, 6)} Da` },
            { label: "Error (mDa)", value: `${formatNumber(errorDa * 1000, 4)} mDa` },
            { label: "Accuracy Rating", value: absPPM < 1 ? "Excellent (<1 ppm)" : absPPM < 5 ? "Good (<5 ppm)" : absPPM < 10 ? "Acceptable (<10 ppm)" : "Poor (>10 ppm)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["molar-mass-calculator", "percent-composition-calculator", "avogadro-calculator"],
  faq: [
    { question: "What is m/z in mass spectrometry?", answer: "m/z (mass-to-charge ratio) is the fundamental measurement in mass spectrometry. It represents the mass of an ion divided by its charge number. For singly charged ions (z=1), m/z equals the molecular mass plus or minus a proton." },
    { question: "How do I calculate molecular weight from ESI mass spectra?", answer: "For positive ESI: MW = (m/z × z) - z × 1.00728 (proton mass). For multiply-charged ions, use two adjacent peaks: MW = z₂(m/z₂ - 1.008) where z₂ = (m/z₁ - 1.008)/(m/z₁ - m/z₂)." },
    { question: "What is mass accuracy in ppm?", answer: "Mass accuracy (ppm) = ((observed - theoretical) / theoretical) × 10⁶. High-resolution instruments (Orbitrap, FTICR) achieve <5 ppm, while TOF instruments typically achieve 5-20 ppm." },
  ],
  formula: "m/z = (M + zH)/z (positive ESI) | MW = m/z × z - z × 1.00728 | ppm = ((obs - theo)/theo) × 10⁶",
};
