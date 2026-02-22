import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stellarClassificationCalculator: CalculatorDefinition = {
  slug: "stellar-classification-calculator",
  title: "Stellar Classification Calculator",
  description: "Free stellar classification calculator. Determine a star spectral class from its surface temperature.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["stellar classification", "spectral class", "star type", "hertzsprung russell", "star temperature"],
  variants: [
    {
      id: "from-temp",
      name: "Classification from Temperature",
      description: "Determine spectral class from surface temperature",
      fields: [
        { name: "temp", label: "Surface Temperature (K)", type: "number", placeholder: "e.g. 5778" },
      ],
      calculate: (inputs) => {
        const T = inputs.temp as number;
        if (!T || T <= 0) return null;
        const classes = [
          { cls: "O", min: 30000, max: 100000, color: "Blue", desc: "Hot massive stars" },
          { cls: "B", min: 10000, max: 30000, color: "Blue-White", desc: "Bright blue-white stars" },
          { cls: "A", min: 7500, max: 10000, color: "White", desc: "White stars like Sirius" },
          { cls: "F", min: 6000, max: 7500, color: "Yellow-White", desc: "Yellow-white stars" },
          { cls: "G", min: 5200, max: 6000, color: "Yellow", desc: "Sun-like stars" },
          { cls: "K", min: 3700, max: 5200, color: "Orange", desc: "Orange stars" },
          { cls: "M", min: 2400, max: 3700, color: "Red", desc: "Red dwarfs, most common" },
        ];
        let matched = classes.find(c => T >= c.min && T < c.max) || (T >= 100000 ? classes[0] : classes[classes.length - 1]);
        const subclass = matched ? Math.min(9, Math.max(0, Math.round(9 * (matched.max - T) / (matched.max - matched.min)))) : 0;
        const luminosity = Math.pow(T / 5778, 4);
        return {
          primary: { label: "Spectral Class", value: `${matched.cls}${subclass}` },
          details: [
            { label: "Color", value: matched.color },
            { label: "Description", value: matched.desc },
            { label: "Temperature", value: `${formatNumber(T)} K` },
            { label: "Luminosity (1 solar radius)", value: `${formatNumber(luminosity, 4)} L☉` },
            { label: "Peak Wavelength (Wien)", value: `${formatNumber(2898000 / T, 0)} nm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["star-luminosity-calculator", "habitable-zone-calculator", "magnitude-distance-calculator"],
  faq: [
    { question: "What is spectral classification?", answer: "Stars are classified O B A F G K M from hottest to coolest. The Sun is a G2 star at 5778 K." },
    { question: "What does the number after the letter mean?", answer: "It is a subclass from 0 (hotter) to 9 (cooler) within each spectral type." },
  ],
  formula: "OBAFGKM classification based on surface temperature",
};
