import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gravitationalLensingCalculator: CalculatorDefinition = {
  slug: "gravitational-lensing-calculator",
  title: "Gravitational Lensing Calculator",
  description: "Calculate the Einstein ring radius and deflection angle for gravitational lensing caused by a massive foreground object bending light from a distant source.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["gravitational lensing","einstein ring","light bending","gravitational deflection"],
  variants: [{
    id: "standard",
    name: "Gravitational Lensing",
    description: "Calculate the Einstein ring radius and deflection angle for gravitational lensing caused by a massive foreground object bending light from a distant source.",
    fields: [
      { name: "lensMass", label: "Lens Mass (solar masses)", type: "number", min: 0.01, max: 1e15, defaultValue: 1e12 },
      { name: "lensDistance", label: "Distance to Lens (Mpc)", type: "number", min: 0.001, max: 10000, defaultValue: 500 },
      { name: "sourceDistance", label: "Distance to Source (Mpc)", type: "number", min: 0.001, max: 20000, defaultValue: 1500 },
    ],
    calculate: (inputs) => {
    const Msun = inputs.lensMass as number;
    const Dl = inputs.lensDistance as number;
    const Ds = inputs.sourceDistance as number;
    const Dls = Ds - Dl;
    if (Dls <= 0) {
      return { primary: { label: "Error", value: "Source must be farther than lens" } };
    }
    const G = 6.674e-11;
    const c = 3e8;
    const Mkg = Msun * 1.989e30;
    const DlM = Dl * 3.086e22;
    const DsM = Ds * 3.086e22;
    const DlsM = Dls * 3.086e22;
    const thetaE = Math.sqrt(4 * G * Mkg * DlsM / (c * c * DlM * DsM));
    const thetaArcsec = thetaE * 206265;
    const schwarzschild = 2 * G * Mkg / (c * c);
    const deflectionAngle = 4 * G * Mkg / (c * c * DlM * thetaE);
    const deflArcsec = deflectionAngle * 206265;
    return {
      primary: { label: "Einstein Ring Radius", value: formatNumber(Math.round(thetaArcsec * 10000) / 10000) + " arcsec" },
      details: [
        { label: "Deflection Angle", value: formatNumber(Math.round(deflArcsec * 10000) / 10000) + " arcsec" },
        { label: "Schwarzschild Radius of Lens", value: formatNumber(schwarzschild / 1000) + " km" },
        { label: "Lens-Source Separation", value: formatNumber(Dls) + " Mpc" }
      ]
    };
  },
  }],
  relatedSlugs: ["star-magnitude-calculator","roche-limit-calculator"],
  faq: [
    { question: "What is gravitational lensing?", answer: "Gravitational lensing occurs when the gravity of a massive foreground object bends and magnifies light from a more distant background source, as predicted by general relativity." },
    { question: "What is an Einstein ring?", answer: "An Einstein ring appears when the source, lens, and observer are perfectly aligned. The light from the source is bent equally in all directions around the lens, forming a complete ring." },
    { question: "What can gravitational lensing reveal?", answer: "Gravitational lensing is used to measure the mass of galaxy clusters, detect dark matter, discover distant galaxies, and even find exoplanets through microlensing events." },
  ],
  formula: "Einstein Ring Radius = sqrt(4GM x Dls / (c^2 x Dl x Ds)); Deflection Angle = 4GM / (c^2 x b)",
};
