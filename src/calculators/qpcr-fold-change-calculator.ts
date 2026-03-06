import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const qpcrFoldChangeCalculator: CalculatorDefinition = {
  slug: "qpcr-fold-change-calculator",
  title: "qPCR Fold Change Calculator (Delta-Delta Ct)",
  description: "Calculate relative gene expression fold change from qPCR data using the delta-delta Ct method comparing target and reference genes across treatment and control samples.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["qpcr fold change","delta delta ct","gene expression","relative quantification","real-time pcr analysis"],
  variants: [{
    id: "standard",
    name: "qPCR Fold Change (Delta-Delta Ct)",
    description: "Calculate relative gene expression fold change from qPCR data using the delta-delta Ct method comparing target and reference genes across treatment and control samples.",
    fields: [
      { name: "ctTarget", label: "Ct Target Gene (Treatment)", type: "number", min: 5, max: 45, defaultValue: 22 },
      { name: "ctRef", label: "Ct Reference Gene (Treatment)", type: "number", min: 5, max: 45, defaultValue: 18 },
      { name: "ctTargetCtrl", label: "Ct Target Gene (Control)", type: "number", min: 5, max: 45, defaultValue: 25 },
      { name: "ctRefCtrl", label: "Ct Reference Gene (Control)", type: "number", min: 5, max: 45, defaultValue: 18 },
    ],
    calculate: (inputs) => {
    const ctTarget = inputs.ctTarget as number;
    const ctRef = inputs.ctRef as number;
    const ctTargetCtrl = inputs.ctTargetCtrl as number;
    const ctRefCtrl = inputs.ctRefCtrl as number;
    const deltaCt = ctTarget - ctRef;
    const deltaCtCtrl = ctTargetCtrl - ctRefCtrl;
    const deltaDeltaCt = deltaCt - deltaCtCtrl;
    const foldChange = Math.pow(2, -deltaDeltaCt);
    var regulation = "No change";
    if (foldChange > 1.5) { regulation = "Upregulated"; }
    if (foldChange < 0.67) { regulation = "Downregulated"; }
    return {
      primary: { label: "Fold Change", value: formatNumber(Math.round(foldChange * 1000) / 1000) + "x" },
      details: [
        { label: "Delta Ct (Treatment)", value: formatNumber(Math.round(deltaCt * 100) / 100) },
        { label: "Delta Ct (Control)", value: formatNumber(Math.round(deltaCtCtrl * 100) / 100) },
        { label: "Delta-Delta Ct", value: formatNumber(Math.round(deltaDeltaCt * 100) / 100) },
        { label: "Regulation Status", value: regulation }
      ]
    };
  },
  }],
  relatedSlugs: ["pcr-cycle-number-calculator","dna-concentration-calculator","pcr-primer-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Delta Ct = Ct(target) - Ct(reference); Delta-Delta Ct = Delta Ct(treatment) - Delta Ct(control); Fold Change = 2^(-Delta-Delta Ct)",
};
