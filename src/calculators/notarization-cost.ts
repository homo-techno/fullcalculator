import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const notarizationCostCalculator: CalculatorDefinition = {
  slug: "notarization-cost",
  title: "Notarization Cost Calculator",
  description:
    "Calculate notarization costs for in-office, mobile notary, and Remote Online Notarization (RON) services including travel fees and per-signature charges.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "notarization",
    "notary",
    "mobile notary",
    "RON",
    "notary fees",
    "document signing",
    "notary public",
  ],
  variants: [
    {
      slug: "notarization-cost",
      title: "Notarization Cost Estimator",
      description:
        "Compare costs between in-office, mobile notary, and remote online notarization.",
      fields: [
        {
          name: "notaryType",
          label: "Notary Service Type",
          type: "select",
          defaultValue: "mobile",
          options: [
            { label: "In-Office Notary", value: "office" },
            { label: "Mobile Notary", value: "mobile" },
            { label: "Remote Online (RON)", value: "ron" },
          ],
        },
        {
          name: "numberOfSignatures",
          label: "Number of Notarized Signatures",
          type: "number",
          defaultValue: "3",
        },
        {
          name: "numberOfDocuments",
          label: "Number of Documents",
          type: "number",
          defaultValue: "2",
        },
        {
          name: "travelDistance",
          label: "Travel Distance (miles, mobile only)",
          type: "number",
          defaultValue: "15",
        },
        {
          name: "documentType",
          label: "Document Type",
          type: "select",
          defaultValue: "general",
          options: [
            { label: "General Document", value: "general" },
            { label: "Real Estate / Loan Signing", value: "realestate" },
            { label: "Legal / Affidavit", value: "legal" },
            { label: "Power of Attorney", value: "poa" },
          ],
        },
        {
          name: "afterHours",
          label: "After-Hours/Weekend Service",
          type: "select",
          defaultValue: "no",
          options: [
            { label: "No - Business Hours", value: "no" },
            { label: "Yes - After Hours/Weekend", value: "yes" },
          ],
        },
      ],
      calculate(inputs) {
        const notaryType = inputs.notaryType as string;
        const signatures = parseFloat(inputs.numberOfSignatures as string);
        const documents = parseFloat(inputs.numberOfDocuments as string);
        const travelMiles = parseFloat(inputs.travelDistance as string);
        const docType = inputs.documentType as string;
        const afterHours = inputs.afterHours as string;

        let perSignatureFee: number;
        if (notaryType === "office") {
          perSignatureFee = 5;
        } else if (notaryType === "mobile") {
          perSignatureFee = 10;
        } else {
          perSignatureFee = 25;
        }

        const signatureCost = signatures * perSignatureFee;

        let travelFee = 0;
        if (notaryType === "mobile") {
          if (travelMiles <= 10) {
            travelFee = 25;
          } else if (travelMiles <= 25) {
            travelFee = 25 + (travelMiles - 10) * 1.5;
          } else {
            travelFee = 47.5 + (travelMiles - 25) * 2;
          }
        }

        let serviceFee = 0;
        if (docType === "realestate") {
          serviceFee = notaryType === "mobile" ? 150 : notaryType === "ron" ? 75 : 25;
        } else if (docType === "legal") {
          serviceFee = notaryType === "mobile" ? 50 : notaryType === "ron" ? 25 : 10;
        } else if (docType === "poa") {
          serviceFee = notaryType === "mobile" ? 40 : notaryType === "ron" ? 20 : 10;
        }

        let platformFee = 0;
        if (notaryType === "ron") {
          platformFee = 15;
        }

        const afterHoursSurcharge = afterHours === "yes" ? 25 : 0;
        const additionalDocFee = Math.max(0, documents - 1) * 5;

        const subtotal =
          signatureCost + travelFee + serviceFee + platformFee + afterHoursSurcharge + additionalDocFee;
        const taxEstimate = subtotal * 0.07;
        const totalCost = subtotal + taxEstimate;

        const officeEstimate = signatures * 5 + (docType === "realestate" ? 25 : 10);
        const mobileEstimate =
          signatures * 10 + 25 + (docType === "realestate" ? 150 : 50);
        const ronEstimate =
          signatures * 25 + 15 + (docType === "realestate" ? 75 : 25);

        return {
          "Signature Fees": `$${formatNumber(signatureCost)}`,
          "Travel Fee": `$${formatNumber(travelFee)}`,
          "Service/Complexity Fee": `$${formatNumber(serviceFee)}`,
          "Platform Fee (RON)": `$${formatNumber(platformFee)}`,
          "After-Hours Surcharge": `$${formatNumber(afterHoursSurcharge)}`,
          "Additional Document Fee": `$${formatNumber(additionalDocFee)}`,
          "Subtotal": `$${formatNumber(subtotal)}`,
          "Estimated Tax": `$${formatNumber(taxEstimate)}`,
          "Total Estimated Cost": `$${formatNumber(totalCost)}`,
          "In-Office Estimate": `$${formatNumber(officeEstimate)}`,
          "Mobile Notary Estimate": `$${formatNumber(mobileEstimate)}`,
          "RON Estimate": `$${formatNumber(ronEstimate)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "small-business-tax",
    "freelance-project-bid",
    "business-insurance-cost",
  ],
  faq: [
    {
      question: "How much does a notary public charge?",
      answer:
        "In-office notary fees are typically $2-15 per signature (set by state law). Mobile notary fees are higher at $75-200 per appointment due to travel. Remote Online Notarization (RON) typically costs $25-50 per session plus per-signature fees.",
    },
    {
      question: "What is Remote Online Notarization (RON)?",
      answer:
        "RON allows documents to be notarized via video call. The signer and notary connect through a secure platform, verify identity digitally, and the notary applies an electronic seal. Most states now permit RON, though requirements vary.",
    },
    {
      question: "When do I need a mobile notary vs going to an office?",
      answer:
        "Mobile notaries are ideal for real estate closings, hospital/nursing home signings, or when multiple signers at different locations are involved. In-office is cheapest for simple documents. RON is most convenient for straightforward notarizations when all parties have internet access.",
    },
  ],
  formula:
    "Total = (Signatures x Per-Signature Fee) + Travel Fee + Service Fee + Platform Fee + After-Hours Surcharge + Additional Doc Fee + Tax. Mobile Travel = Base $25 + $1.50-$2.00/mile over 10 miles.",
};
