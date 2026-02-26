import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

// Physical constants
const h = 6.62607015e-34; // Planck's constant (J·s)
const c = 2.99792458e8; // Speed of light (m/s)
const me = 9.1093837015e-31; // Electron mass (kg)
const eV = 1.602176634e-19; // eV to Joules

// Compton wavelength of electron
const lambdaC = h / (me * c); // ≈ 2.426e-12 m

export const comptonScatteringCalculator: CalculatorDefinition = {
  slug: "compton-scattering-calculator",
  title: "Compton Scattering Calculator",
  description: "Free Compton scattering calculator. Compute the wavelength shift, scattered photon energy, and recoil electron energy from Compton scattering.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["compton scattering", "compton effect", "wavelength shift", "photon scattering", "quantum physics", "x-ray scattering"],
  variants: [
    {
      id: "wavelength-shift",
      name: "Compton Wavelength Shift",
      description: "Calculate the wavelength shift from the scattering angle",
      fields: [
        { name: "wavelength", label: "Incident Wavelength (pm)", type: "number", placeholder: "e.g. 71.1", min: 0.001, step: 0.1 },
        { name: "angle", label: "Scattering Angle θ (°)", type: "number", placeholder: "e.g. 90", min: 0, max: 180 },
      ],
      calculate: (inputs) => {
        const lambdaIncPm = parseFloat(inputs.wavelength as string);
        const angleDeg = parseFloat(inputs.angle as string);
        if (isNaN(lambdaIncPm) || isNaN(angleDeg)) return null;
        if (lambdaIncPm <= 0 || angleDeg < 0 || angleDeg > 180) return null;

        const lambdaInc = lambdaIncPm * 1e-12; // pm to m
        const thetaRad = angleDeg * (Math.PI / 180);

        // Compton formula: Δλ = (h/mc)(1 - cos θ)
        const deltaLambda = lambdaC * (1 - Math.cos(thetaRad));
        const lambdaScattered = lambdaInc + deltaLambda;

        // Energies
        const eIncident = (h * c) / lambdaInc; // Joules
        const eScattered = (h * c) / lambdaScattered;
        const eRecoil = eIncident - eScattered;

        const eIncidentKeV = eIncident / (eV * 1000);
        const eScatteredKeV = eScattered / (eV * 1000);
        const eRecoilKeV = eRecoil / (eV * 1000);

        return {
          primary: { label: "Wavelength Shift (Δλ)", value: `${formatNumber(deltaLambda * 1e12, 4)} pm` },
          details: [
            { label: "Compton Wavelength (λ_C)", value: `${formatNumber(lambdaC * 1e12, 4)} pm` },
            { label: "Incident Wavelength", value: `${formatNumber(lambdaIncPm, 4)} pm` },
            { label: "Scattered Wavelength", value: `${formatNumber(lambdaScattered * 1e12, 4)} pm` },
            { label: "Scattering Angle", value: `${formatNumber(angleDeg, 2)}°` },
            { label: "Incident Photon Energy", value: `${formatNumber(eIncidentKeV, 4)} keV` },
            { label: "Scattered Photon Energy", value: `${formatNumber(eScatteredKeV, 4)} keV` },
            { label: "Recoil Electron Energy", value: `${formatNumber(eRecoilKeV, 4)} keV` },
            { label: "Energy Transfer", value: `${formatNumber((eRecoil / eIncident) * 100, 2)}%` },
          ],
        };
      },
    },
    {
      id: "energy-input",
      name: "From Photon Energy",
      description: "Calculate Compton scattering from incident photon energy in keV",
      fields: [
        { name: "energy", label: "Incident Photon Energy (keV)", type: "number", placeholder: "e.g. 100", min: 0.1 },
        { name: "angle", label: "Scattering Angle θ (°)", type: "number", placeholder: "e.g. 90", min: 0, max: 180 },
      ],
      calculate: (inputs) => {
        const eKeV = parseFloat(inputs.energy as string);
        const angleDeg = parseFloat(inputs.angle as string);
        if (isNaN(eKeV) || isNaN(angleDeg)) return null;
        if (eKeV <= 0 || angleDeg < 0 || angleDeg > 180) return null;

        const eIncident = eKeV * 1000 * eV; // keV to Joules
        const lambdaInc = (h * c) / eIncident;
        const thetaRad = angleDeg * (Math.PI / 180);

        const deltaLambda = lambdaC * (1 - Math.cos(thetaRad));
        const lambdaScattered = lambdaInc + deltaLambda;
        const eScattered = (h * c) / lambdaScattered;
        const eRecoil = eIncident - eScattered;

        // Klein-Nishina: differential cross section ratio (simplified)
        const ratio = lambdaInc / lambdaScattered;
        const eScatteredKeV = eScattered / (eV * 1000);
        const eRecoilKeV = eRecoil / (eV * 1000);

        // Maximum energy transfer (backscatter at 180°)
        const deltaLambdaMax = 2 * lambdaC;
        const lambdaBack = lambdaInc + deltaLambdaMax;
        const eBack = (h * c) / lambdaBack;
        const maxTransferKeV = (eIncident - eBack) / (eV * 1000);

        return {
          primary: { label: "Scattered Photon Energy", value: `${formatNumber(eScatteredKeV, 4)} keV` },
          details: [
            { label: "Incident Energy", value: `${formatNumber(eKeV, 4)} keV` },
            { label: "Scattered Energy", value: `${formatNumber(eScatteredKeV, 4)} keV` },
            { label: "Recoil Electron Energy", value: `${formatNumber(eRecoilKeV, 4)} keV` },
            { label: "Wavelength Shift", value: `${formatNumber(deltaLambda * 1e12, 4)} pm` },
            { label: "Energy Ratio (E'/E)", value: formatNumber(ratio, 6) },
            { label: "Max Transfer (at 180°)", value: `${formatNumber(maxTransferKeV, 4)} keV` },
            { label: "Incident Wavelength", value: `${formatNumber(lambdaInc * 1e12, 4)} pm` },
            { label: "Scattered Wavelength", value: `${formatNumber(lambdaScattered * 1e12, 4)} pm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["photoelectric-effect-calculator", "wavelength-calculator", "electromagnetic-wave-calculator"],
  faq: [
    { question: "What is Compton scattering?", answer: "Compton scattering is the inelastic scattering of a photon by a charged particle (usually an electron). The photon loses energy (increases wavelength) and the electron recoils. The wavelength shift depends only on the scattering angle: Δλ = (h/mc)(1 - cos θ)." },
    { question: "What is the Compton wavelength?", answer: "The Compton wavelength of the electron is λ_C = h/(m_e·c) ≈ 2.426 pm. It represents the wavelength shift when a photon scatters at 90°. At 180° (backscatter), the shift is exactly 2λ_C ≈ 4.85 pm." },
    { question: "When is Compton scattering important?", answer: "Compton scattering dominates at photon energies from about 100 keV to several MeV, typical of gamma rays and hard X-rays. At lower energies, photoelectric absorption dominates; at higher energies, pair production becomes important." },
  ],
  formula: "Δλ = (h/m_e·c)(1 - cos θ) | λ_C = h/(m_e·c) ≈ 2.426 pm | E' = E / (1 + (E/m_e·c²)(1 - cos θ))",
};
