import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const notaryFeeCalculator: CalculatorDefinition = {
  slug: "notary-fee-calculator",
  title: "Notary Fee Calculator",
  description: "Free notary fee calculator. Estimate notary public fees for document notarization, including mobile notary and remote online notarization (RON) costs by state.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["notary fee calculator", "notary cost", "notary public fees", "mobile notary cost", "notarization fee calculator"],
  variants: [
    {
      id: "notary-fee",
      name: "Notary Fee Estimator",
      description: "Estimate notary fees based on document type, number of signatures, and service type",
      fields: [
        { name: "serviceType", label: "Notary Service Type", type: "select", options: [
          { label: "In-office notary", value: "office" },
          { label: "Mobile notary (comes to you)", value: "mobile" },
          { label: "Remote Online Notarization (RON)", value: "remote" },
        ], defaultValue: "office" },
        { name: "documentType", label: "Document Type", type: "select", options: [
          { label: "General notarization", value: "general" },
          { label: "Real estate closing", value: "real-estate" },
          { label: "Power of attorney", value: "poa" },
          { label: "Affidavit / Sworn statement", value: "affidavit" },
          { label: "Loan signing", value: "loan" },
          { label: "Will / Trust", value: "will" },
        ], defaultValue: "general" },
        { name: "signatures", label: "Number of Notarizations / Signatures", type: "number", placeholder: "e.g. 3", min: 1, defaultValue: 1 },
        { name: "state", label: "State Fee Level", type: "select", options: [
          { label: "Low fee state (e.g., IA, NE, SD - $2-$5)", value: "low" },
          { label: "Average fee state (e.g., TX, OH, NC - $5-$10)", value: "average" },
          { label: "High fee state (e.g., CA, NY, FL - $10-$15)", value: "high" },
          { label: "Very high fee state (e.g., CO - $25+)", value: "very-high" },
        ], defaultValue: "average" },
      ],
      calculate: (inputs) => {
        const serviceType = inputs.serviceType as string;
        const documentType = inputs.documentType as string;
        const signatures = (inputs.signatures as number) || 1;
        const state = inputs.state as string;

        // Base per-signature fee by state level
        const stateFees: Record<string, number> = {
          low: 3, average: 8, high: 12, "very-high": 25,
        };
        const perSignatureFee = stateFees[state] || 8;

        // Service type surcharges
        const serviceCharges: Record<string, number> = {
          office: 0,
          mobile: 75, // Mobile notary travel fee
          remote: 25, // RON platform fee
        };
        const serviceFee = serviceCharges[serviceType] || 0;

        // Document complexity add-ons
        const documentAddOns: Record<string, number> = {
          general: 0,
          "real-estate": 150, // Loan signing agent fee
          poa: 10,
          affidavit: 5,
          loan: 125,
          will: 15,
        };
        const documentFee = documentAddOns[documentType] || 0;

        const notarizationFees = perSignatureFee * signatures;
        const totalFee = notarizationFees + serviceFee + documentFee;

        return {
          primary: { label: "Estimated Total Notary Cost", value: `$${formatNumber(totalFee)}` },
          details: [
            { label: "Per-signature fee", value: `$${formatNumber(perSignatureFee)} × ${signatures} = $${formatNumber(notarizationFees)}` },
            { label: "Service fee", value: serviceType === "office" ? "None (in-office)" : `$${formatNumber(serviceFee)} (${serviceType === "mobile" ? "travel/mobile" : "RON platform"})` },
            { label: "Document/complexity fee", value: documentFee > 0 ? `$${formatNumber(documentFee)}` : "None" },
            { label: "Service type", value: serviceType === "office" ? "In-office" : serviceType === "mobile" ? "Mobile notary" : "Remote online (RON)" },
            { label: "Document type", value: documentType.replace("-", " ") },
          ],
          note: "Notary fees are regulated by state law with maximum fee schedules. Mobile notary and loan signing agents typically charge additional travel and service fees beyond the statutory notarization fee. Actual costs may vary.",
        };
      },
    },
  ],
  relatedSlugs: ["court-fee-calculator", "patent-cost-calculator", "trademark-cost-calculator"],
  faq: [
    { question: "How much does a notary cost?", answer: "Standard notarization fees range from $2-$25 per signature depending on the state. Mobile notaries typically charge an additional $50-$150 for travel. Loan signing agents charge $75-$200+ per appointment. Remote online notarization (RON) typically costs $25 per session plus per-signature fees." },
    { question: "Can I get free notarization?", answer: "Yes. Many banks and credit unions offer free notary services to account holders. Some UPS stores, AAA offices, and libraries also offer free or low-cost notarization. Your employer may also have a notary on staff." },
    { question: "What documents need to be notarized?", answer: "Common documents requiring notarization include: real estate deeds and closings, powers of attorney, wills and trusts, affidavits, some business contracts, car title transfers, and immigration documents. Requirements vary by state and situation." },
  ],
  formula: "Total Fee = (Per-Signature Fee × Number of Signatures) + Service Fee (mobile/RON) + Document Complexity Fee. State-regulated per-signature fees range from $2 to $25+.",
};
