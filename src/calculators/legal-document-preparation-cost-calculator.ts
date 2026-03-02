import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const legalDocumentPreparationCostCalculator: CalculatorDefinition = {
  slug: "legal-document-preparation-cost-calculator",
  title: "Legal Document Preparation Cost Calculator",
  description: "Estimate costs for preparing common legal documents with or without attorney assistance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["legal document cost","document preparation","legal forms","legal document fee"],
  variants: [{
    id: "standard",
    name: "Legal Document Preparation Cost",
    description: "Estimate costs for preparing common legal documents with or without attorney assistance.",
    fields: [
      { name: "docType", label: "Document Type", type: "select", options: [{ value: "1", label: "Simple Will" }, { value: "2", label: "Living Trust" }, { value: "3", label: "Power of Attorney" }, { value: "4", label: "LLC Operating Agreement" }, { value: "5", label: "Prenuptial Agreement" }, { value: "6", label: "Lease Agreement" }], defaultValue: "1" },
      { name: "prepMethod", label: "Preparation Method", type: "select", options: [{ value: "1", label: "DIY Online Service" }, { value: "2", label: "Legal Document Preparer" }, { value: "3", label: "Attorney Drafted" }], defaultValue: "2" },
      { name: "documents", label: "Number of Documents", type: "number", min: 1, max: 20, defaultValue: 1 },
      { name: "revisions", label: "Expected Revisions", type: "number", min: 0, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const docType = parseInt(inputs.docType as string);
    const prepMethod = parseInt(inputs.prepMethod as string);
    const documents = inputs.documents as number;
    const revisions = inputs.revisions as number;
    const docNames = ["", "Simple Will", "Living Trust", "Power of Attorney", "LLC Operating Agreement", "Prenuptial Agreement", "Lease Agreement"];
    const diyCosts = [0, 50, 150, 35, 100, 200, 40];
    const preparerCosts = [0, 200, 600, 100, 400, 800, 150];
    const attorneyCosts = [0, 800, 2500, 400, 1500, 3500, 600];
    const costs = [[], diyCosts, preparerCosts, attorneyCosts];
    const baseCost = (costs[prepMethod] || preparerCosts)[docType] || 200;
    const revisionCost = prepMethod === 3 ? revisions * baseCost * 0.15 : revisions * baseCost * 0.05;
    const perDoc = baseCost + revisionCost;
    const totalCost = perDoc * documents;
    const methodNames = ["", "DIY Online", "Document Preparer", "Attorney Drafted"];
    return {
      primary: { label: "Total Document Preparation Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Document Type", value: docNames[docType] || "General" },
        { label: "Preparation Method", value: methodNames[prepMethod] || "Preparer" },
        { label: "Base Cost Per Document", value: "$" + formatNumber(baseCost) },
        { label: "Revision Costs", value: "$" + formatNumber(revisionCost * documents) },
        { label: "Cost Per Document", value: "$" + formatNumber(perDoc) }
      ]
    };
  },
  }],
  relatedSlugs: ["notary-fee-calculator","legal-fee-estimator-calculator","probate-cost-estimator-calculator"],
  faq: [
    { question: "How much does it cost to prepare a will?", answer: "A simple will costs $50 to $100 with online services, $200 to $400 with a document preparer, or $500 to $1,500 with an attorney." },
    { question: "Is it worth hiring an attorney for legal documents?", answer: "For complex situations like trusts, prenups, or business agreements, attorney review can prevent costly mistakes. Simple documents may be fine with online services." },
    { question: "What is a legal document preparer?", answer: "A legal document preparer is a non-attorney professional who helps complete legal forms and documents at a lower cost than an attorney. They cannot provide legal advice." },
  ],
  formula: "Total Cost = (Base Cost + Revision Cost) x Number of Documents",
};
