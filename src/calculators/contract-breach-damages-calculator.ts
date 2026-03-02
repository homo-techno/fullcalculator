import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const contractBreachDamagesCalculator: CalculatorDefinition = {
  slug: "contract-breach-damages-calculator",
  title: "Contract Breach Damages Calculator",
  description: "Calculate potential damages for breach of contract claims.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["breach of contract","contract damages","breach damages","contract litigation"],
  variants: [{
    id: "standard",
    name: "Contract Breach Damages",
    description: "Calculate potential damages for breach of contract claims.",
    fields: [
      { name: "contractValue", label: "Total Contract Value ($)", type: "number", min: 0, max: 100000000, defaultValue: 250000 },
      { name: "performedValue", label: "Value of Performance Completed ($)", type: "number", min: 0, max: 100000000, defaultValue: 100000 },
      { name: "mitigatedAmount", label: "Amount Mitigated (Replacement Costs Saved) ($)", type: "number", min: 0, max: 100000000, defaultValue: 20000 },
      { name: "consequentialDamages", label: "Consequential/Incidental Damages ($)", type: "number", min: 0, max: 50000000, defaultValue: 15000 },
      { name: "damageType", label: "Damage Measure", type: "select", options: [{ value: "1", label: "Expectation Damages" }, { value: "2", label: "Reliance Damages" }, { value: "3", label: "Restitution Damages" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const contractValue = inputs.contractValue as number;
    const performedValue = inputs.performedValue as number;
    const mitigatedAmount = inputs.mitigatedAmount as number;
    const consequentialDamages = inputs.consequentialDamages as number;
    const damageType = inputs.damageType as string;
    const typeNames: Record<string, string> = { "1": "Expectation Damages", "2": "Reliance Damages", "3": "Restitution Damages" };
    let directDamages = 0;
    if (damageType === "1") {
      directDamages = contractValue - performedValue;
    } else if (damageType === "2") {
      directDamages = performedValue;
    } else {
      directDamages = performedValue * 0.8;
    }
    const totalBeforeMitigation = directDamages + consequentialDamages;
    const totalDamages = Math.max(totalBeforeMitigation - mitigatedAmount, 0);
    return {
      primary: { label: "Estimated Total Damages", value: "$" + formatNumber(totalDamages) },
      details: [
        { label: "Damage Measure", value: typeNames[damageType] || "Expectation" },
        { label: "Direct Damages", value: "$" + formatNumber(directDamages) },
        { label: "Consequential Damages", value: "$" + formatNumber(consequentialDamages) },
        { label: "Mitigation Credit", value: "$" + formatNumber(mitigatedAmount) }
      ]
    };
  },
  }],
  relatedSlugs: ["settlement-value-estimator-calculator","legal-malpractice-damages-calculator","legal-fee-estimator-calculator"],
  faq: [
    { question: "What are expectation damages?", answer: "Expectation damages put the non-breaching party in the position they would have been in had the contract been fully performed, covering the benefit of the bargain." },
    { question: "What is the duty to mitigate?", answer: "The injured party must take reasonable steps to minimize their damages. Failure to mitigate can reduce the recoverable amount." },
    { question: "Are punitive damages available for breach of contract?", answer: "Generally no. Punitive damages are rarely awarded for breach of contract unless the breach also involves fraud or other tortious conduct." },
  ],
  formula: "Damages = (Contract Value - Performed Value) + Consequential - Mitigated Amount",
};
