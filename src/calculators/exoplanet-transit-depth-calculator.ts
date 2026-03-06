import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const exoplanetTransitDepthCalculator: CalculatorDefinition = {
  slug: "exoplanet-transit-depth-calculator",
  title: "Exoplanet Transit Depth Calculator",
  description: "Calculate the expected transit depth, duration, and probability for an exoplanet transiting its host star based on planetary and stellar radii and orbital distance.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["exoplanet transit","transit depth","transit method","planet detection"],
  variants: [{
    id: "standard",
    name: "Exoplanet Transit Depth",
    description: "Calculate the expected transit depth, duration, and probability for an exoplanet transiting its host star based on planetary and stellar radii and orbital distance.",
    fields: [
      { name: "planetRadius", label: "Planet Radius (Earth radii)", type: "number", min: 0.1, max: 50, defaultValue: 1 },
      { name: "starRadius", label: "Star Radius (solar radii)", type: "number", min: 0.1, max: 100, defaultValue: 1 },
      { name: "orbitalDistance", label: "Orbital Distance (AU)", type: "number", min: 0.01, max: 100, defaultValue: 1 },
      { name: "orbitalPeriod", label: "Orbital Period (days)", type: "number", min: 0.1, max: 100000, defaultValue: 365 },
    ],
    calculate: (inputs) => {
    const Rp = inputs.planetRadius as number * 6371;
    const Rs = inputs.starRadius as number * 696340;
    const a = inputs.orbitalDistance as number * 1.496e8;
    const P = inputs.orbitalPeriod as number;
    const transitDepth = Math.pow(Rp / Rs, 2) * 100;
    const transitDuration = P / Math.PI * (Rs / a) * 24;
    const transitProb = Rs / a * 100;
    return {
      primary: { label: "Transit Depth", value: formatNumber(Math.round(transitDepth * 10000) / 10000) + "%" },
      details: [
        { label: "Transit Duration", value: formatNumber(Math.round(transitDuration * 100) / 100) + " hours" },
        { label: "Transit Probability", value: formatNumber(Math.round(transitProb * 100) / 100) + "%" },
        { label: "Planet/Star Radius Ratio", value: formatNumber(Math.round(Rp / Rs * 10000) / 10000) }
      ]
    };
  },
  }],
  relatedSlugs: ["stellar-parallax-calculator","binary-star-mass-calculator"],
  faq: [
    { question: "What is transit depth?", answer: "Transit depth is the fractional decrease in observed starlight when a planet passes in front of its host star. It equals the square of the ratio of the planet radius to the star radius." },
    { question: "How much does Earth dim the Sun during transit?", answer: "Earth would cause a transit depth of about 0.0084 percent, dimming the Sun by 84 parts per million. This is detectable by space telescopes like Kepler and TESS but very challenging from the ground." },
    { question: "What determines the transit probability?", answer: "The geometric transit probability is approximately the ratio of the star radius to the orbital distance. For Earth-like planets around Sun-like stars, the probability is only about 0.47 percent." },
  ],
  formula: "Transit Depth = (Rp / Rs)^2; Transit Duration = (P / pi) x (Rs / a); Transit Probability = Rs / a",
};
