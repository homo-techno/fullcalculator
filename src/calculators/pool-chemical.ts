import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const poolChemicalCalculator: CalculatorDefinition = {
  slug: "pool-chemical-calculator",
  title: "Pool Chemical Calculator",
  description: "Free pool chemical calculator. Calculate the right amount of chlorine, pH adjuster, and other chemicals for your swimming pool.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pool chemical calculator", "pool chlorine calculator", "pool pH calculator", "swimming pool chemicals", "pool chemistry"],
  variants: [
    {
      id: "calc",
      name: "Calculate Pool Chemicals",
      description: "Calculate chemicals needed to balance your pool water",
      fields: [
        { name: "volume", label: "Pool Volume (gallons)", type: "number", placeholder: "e.g. 20000" },
        { name: "currentPh", label: "Current pH", type: "number", placeholder: "e.g. 7.8", step: 0.1 },
        { name: "currentChlorine", label: "Current Chlorine (ppm)", type: "number", placeholder: "e.g. 0.5", step: 0.1 },
      ],
      calculate: (inputs) => {
        const volume = inputs.volume as number;
        const currentPh = inputs.currentPh as number;
        const currentChlorine = inputs.currentChlorine as number;
        if (!volume) return null;

        const targetPhMin = 7.2;
        const targetPhMax = 7.6;
        const targetPh = 7.4;
        const targetChlorine = 2; // target 2 ppm (range 1-3)
        const details: { label: string; value: string }[] = [];

        details.push({ label: "Pool volume", value: `${formatNumber(volume)} gallons` });
        details.push({ label: "Target pH range", value: `${targetPhMin} - ${targetPhMax}` });
        details.push({ label: "Target chlorine", value: "1 - 3 ppm" });

        let phAction = "pH is in range";
        if (currentPh) {
          if (currentPh > targetPhMax) {
            // Need muriatic acid to lower pH. ~26 oz per 10,000 gallons to lower by 0.2
            const phDrop = currentPh - targetPh;
            const acidOz = (phDrop / 0.2) * 26 * (volume / 10000);
            phAction = `Add ${formatNumber(acidOz, 1)} oz muriatic acid to lower pH`;
            details.push({ label: "Current pH", value: `${currentPh} (too high)` });
            details.push({ label: "Muriatic acid needed", value: `${formatNumber(acidOz, 1)} fl oz` });
          } else if (currentPh < targetPhMin) {
            // Need soda ash to raise pH. ~6 oz per 10,000 gallons to raise by 0.2
            const phRaise = targetPh - currentPh;
            const sodaAshOz = (phRaise / 0.2) * 6 * (volume / 10000);
            phAction = `Add ${formatNumber(sodaAshOz, 1)} oz soda ash to raise pH`;
            details.push({ label: "Current pH", value: `${currentPh} (too low)` });
            details.push({ label: "Soda ash needed", value: `${formatNumber(sodaAshOz, 1)} oz` });
          } else {
            details.push({ label: "Current pH", value: `${currentPh} (in range)` });
          }
        }

        let chlorineAction = "Enter current chlorine to calculate";
        if (currentChlorine !== undefined && currentChlorine !== null) {
          const chlorineNeeded = targetChlorine - currentChlorine;
          if (chlorineNeeded > 0) {
            // Liquid chlorine (12.5%): ~10 oz per 10,000 gallons raises 1 ppm
            const liquidChlorineOz = chlorineNeeded * 10 * (volume / 10000);
            // Granular shock (calcium hypochlorite 65%): ~2 oz per 10,000 gallons raises 1 ppm
            const granularOz = chlorineNeeded * 2 * (volume / 10000);
            chlorineAction = `Add ${formatNumber(liquidChlorineOz, 1)} oz liquid chlorine`;
            details.push({ label: "Current chlorine", value: `${currentChlorine} ppm (low)` });
            details.push({ label: "Liquid chlorine (12.5%)", value: `${formatNumber(liquidChlorineOz, 1)} fl oz` });
            details.push({ label: "Granular shock (65%)", value: `${formatNumber(granularOz, 1)} oz` });
          } else {
            chlorineAction = "Chlorine level is adequate";
            details.push({ label: "Current chlorine", value: `${currentChlorine} ppm (OK)` });
          }
        }

        return {
          primary: { label: "Chemical Adjustment", value: phAction },
          details,
          note: "Always test pool water before adding chemicals. Add chemicals with the pump running. Wait 4-6 hours between chemical additions and retest.",
        };
      },
    },
  ],
  relatedSlugs: ["pool-volume-calculator", "hot-tub-calculator", "water-intake-calculator"],
  faq: [
    { question: "What should pool pH be?", answer: "Ideal pool pH is between 7.2 and 7.6, with 7.4 being optimal. Below 7.2 is too acidic and can corrode equipment. Above 7.6 reduces chlorine effectiveness and can cause cloudy water." },
    { question: "How much chlorine should be in a pool?", answer: "Free chlorine should be maintained between 1 and 3 ppm (parts per million). For regular maintenance, aim for 2 ppm. Shock treatments temporarily raise chlorine to 10+ ppm to kill bacteria and algae." },
    { question: "How often should I test pool water?", answer: "Test chlorine and pH at least 2-3 times per week during swimming season. Test alkalinity and calcium hardness monthly. More frequent testing is needed after heavy rain, high bather loads, or extreme heat." },
  ],
  formula: "Muriatic Acid (oz) = (pH Drop / 0.2) x 26 x (Volume / 10,000) | Liquid Chlorine (oz) = ppm Needed x 10 x (Volume / 10,000)",
};
