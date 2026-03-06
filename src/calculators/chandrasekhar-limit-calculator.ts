import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chandrasekharLimitCalculator: CalculatorDefinition = {
  slug: "chandrasekhar-limit-calculator",
  title: "Chandrasekhar Limit Calculator",
  description: "Calculate the maximum mass of a stable white dwarf star based on composition, and determine whether a remnant will become a white dwarf, neutron star, or black hole.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["chandrasekhar limit","white dwarf mass","stellar remnant","electron degeneracy"],
  variants: [{
    id: "standard",
    name: "Chandrasekhar Limit",
    description: "Calculate the maximum mass of a stable white dwarf star based on composition, and determine whether a remnant will become a white dwarf, neutron star, or black hole.",
    fields: [
      { name: "remnantMass", label: "Stellar Remnant Mass (solar masses)", type: "number", min: 0.1, max: 100, defaultValue: 1.2 },
      { name: "electronFraction", label: "Electron Fraction (Ye)", type: "number", min: 0.3, max: 0.6, defaultValue: 0.5 },
    ],
    calculate: (inputs) => {
    const mass = inputs.remnantMass as number;
    const Ye = inputs.electronFraction as number;
    const chandraLimit = 1.44 * Math.pow(Ye / 0.5, 2);
    const tolmanLimit = 2.16;
    var remnantType = "";
    if (mass < chandraLimit) { remnantType = "White Dwarf"; }
    else if (mass < tolmanLimit) { remnantType = "Neutron Star"; }
    else { remnantType = "Black Hole"; }
    const radius = mass < chandraLimit ? 0.01 * Math.pow(chandraLimit / mass, 1 / 3) : (mass < tolmanLimit ? 10 / 696340 : 0);
    const radiusKm = radius * 696340;
    return {
      primary: { label: "Remnant Type", value: remnantType },
      details: [
        { label: "Chandrasekhar Limit", value: formatNumber(Math.round(chandraLimit * 1000) / 1000) + " solar masses" },
        { label: "Remnant Mass", value: formatNumber(mass) + " solar masses" },
        { label: "Estimated Radius", value: formatNumber(Math.round(radiusKm)) + " km" }
      ]
    };
  },
  }],
  relatedSlugs: ["schwarzschild-radius-advanced-calculator","binary-star-mass-calculator"],
  faq: [
    { question: "What is the Chandrasekhar limit?", answer: "The Chandrasekhar limit is approximately 1.44 solar masses, the maximum mass a white dwarf can have before electron degeneracy pressure can no longer support it against gravitational collapse." },
    { question: "What happens above the Chandrasekhar limit?", answer: "A remnant above the Chandrasekhar limit but below about 2-3 solar masses becomes a neutron star, supported by neutron degeneracy pressure. Above that, it collapses into a black hole." },
    { question: "Why is the electron fraction important?", answer: "The electron fraction Ye determines the number of electrons per baryon. The Chandrasekhar limit scales as Ye squared, so composition affects the exact mass threshold." },
  ],
  formula: "Chandrasekhar Limit = 1.44 x (Ye / 0.5)^2 solar masses; White Dwarf: M < Chandrasekhar Limit; Neutron Star: Chandrasekhar Limit < M < ~2.16 solar masses; Black Hole: M > ~2.16 solar masses",
};
