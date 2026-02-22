import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const numberNeededTreatCalculator: CalculatorDefinition = {
  slug: "number-needed-treat-calculator",
  title: "Number Needed to Treat Calculator",
  description: "Free NNT calculator. Calculate the number needed to treat or number needed to harm from event rates.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["number needed to treat", "nnt calculator", "nnh", "absolute risk reduction"],
  variants: [
    {
      id: "from-rates", name: "From Event Rates",
      fields: [
        { name: "cer", label: "Control Event Rate (%)", type: "number", placeholder: "e.g. 20", min: 0, max: 100 },
        { name: "eer", label: "Experimental Event Rate (%)", type: "number", placeholder: "e.g. 10", min: 0, max: 100 },
      ],
      calculate: (inputs) => {
        const cer = (inputs.cer as number) / 100;
        const eer = (inputs.eer as number) / 100;
        if ([cer, eer].some((v) => isNaN(v))) return null;
        const arr = cer - eer;
        const nnt = arr === 0 ? Infinity : 1 / Math.abs(arr);
        const rrr = cer === 0 ? 0 : arr / cer;
        return {
          primary: { label: arr >= 0 ? "NNT" : "NNH", value: formatNumber(Math.ceil(nnt)) },
          details: [
            { label: "ARR", value: formatNumber(arr * 100, 2) + "%" },
            { label: "RRR", value: formatNumber(rrr * 100, 2) + "%" },
            { label: "Relative Risk", value: formatNumber(cer === 0 ? 0 : eer / cer, 4) },
            { label: "CER", value: formatNumber(cer * 100, 2) + "%" },
            { label: "EER", value: formatNumber(eer * 100, 2) + "%" },
          ],
        };
      },
    },
    {
      id: "from-counts", name: "From Counts",
      fields: [
        { name: "et", label: "Events in Treatment", type: "number", placeholder: "e.g. 15", min: 0 },
        { name: "nt", label: "Total in Treatment", type: "number", placeholder: "e.g. 100", min: 1 },
        { name: "ec", label: "Events in Control", type: "number", placeholder: "e.g. 25", min: 0 },
        { name: "nc", label: "Total in Control", type: "number", placeholder: "e.g. 100", min: 1 },
      ],
      calculate: (inputs) => {
        const et = inputs.et as number, nt = inputs.nt as number, ec = inputs.ec as number, nc = inputs.nc as number;
        if ([et, nt, ec, nc].some((v) => v === undefined || isNaN(v))) return null;
        const eer = et / nt, cer = ec / nc;
        const arr = cer - eer;
        const nnt = arr === 0 ? Infinity : 1 / Math.abs(arr);
        return {
          primary: { label: arr >= 0 ? "NNT" : "NNH", value: formatNumber(Math.ceil(nnt)) },
          details: [
            { label: "EER", value: formatNumber(eer * 100, 2) + "%" },
            { label: "CER", value: formatNumber(cer * 100, 2) + "%" },
            { label: "ARR", value: formatNumber(arr * 100, 2) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["relative-risk-calculator", "odds-ratio-calculator", "survival-rate-calculator"],
  faq: [{ question: "What is NNT?", answer: "Number Needed to Treat is the number of patients who must receive treatment for one additional patient to benefit. Lower NNT = more effective." }],
  formula: "NNT = 1 / |CER - EER| = 1 / ARR",
};
