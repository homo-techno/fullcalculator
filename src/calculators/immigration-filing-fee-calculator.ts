import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const immigrationFilingFeeCalculator: CalculatorDefinition = {
  slug: "immigration-filing-fee-calculator",
  title: "Immigration Filing Fee Calculator",
  description: "Calculate USCIS filing fees for common immigration applications.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["immigration filing fee","USCIS fees","visa cost","green card cost","immigration cost"],
  variants: [{
    id: "standard",
    name: "Immigration Filing Fee",
    description: "Calculate USCIS filing fees for common immigration applications.",
    fields: [
      { name: "formType", label: "Application Type", type: "select", options: [{ value: "1", label: "I-130 Family Petition ($535)" }, { value: "2", label: "I-485 Adjustment of Status ($1,225)" }, { value: "3", label: "N-400 Naturalization ($710)" }, { value: "4", label: "I-765 Work Permit ($410)" }, { value: "5", label: "I-140 Employer Petition ($700)" }, { value: "6", label: "I-751 Remove Conditions ($750)" }], defaultValue: "1" },
      { name: "biometrics", label: "Biometrics Required", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes ($85)" }], defaultValue: "1" },
      { name: "premiumProcessing", label: "Premium Processing", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes ($2,805)" }], defaultValue: "0" },
      { name: "applicants", label: "Number of Applicants", type: "number", min: 1, max: 10, defaultValue: 1 },
      { name: "attorneyFee", label: "Attorney Fee ($)", type: "number", min: 0, max: 50000, defaultValue: 3000 },
    ],
    calculate: (inputs) => {
    const formType = parseInt(inputs.formType as string);
    const biometrics = parseInt(inputs.biometrics as string);
    const premiumProcessing = parseInt(inputs.premiumProcessing as string);
    const applicants = inputs.applicants as number;
    const attorneyFee = inputs.attorneyFee as number;
    const formNames = ["", "I-130 Family Petition", "I-485 Adjustment", "N-400 Naturalization", "I-765 Work Permit", "I-140 Employer Petition", "I-751 Remove Conditions"];
    const baseFees = [0, 535, 1225, 710, 410, 700, 750];
    const filingFee = baseFees[formType] || 535;
    const biometricsFee = biometrics === 1 ? 85 : 0;
    const premiumFee = premiumProcessing === 1 ? 2805 : 0;
    const perApplicant = filingFee + biometricsFee + premiumFee;
    const totalFiling = perApplicant * applicants;
    const grandTotal = totalFiling + attorneyFee;
    return {
      primary: { label: "Total Immigration Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Application", value: formNames[formType] || "I-130" },
        { label: "USCIS Filing Fee", value: "$" + formatNumber(filingFee) + " per applicant" },
        { label: "Biometrics Fee", value: "$" + formatNumber(biometricsFee * applicants) },
        { label: "Premium Processing", value: "$" + formatNumber(premiumFee * applicants) },
        { label: "Attorney Fee", value: "$" + formatNumber(attorneyFee) }
      ]
    };
  },
  }],
  relatedSlugs: ["legal-fee-estimator-calculator","court-filing-fee-calculator","legal-document-preparation-cost-calculator"],
  faq: [
    { question: "How much does a green card cost?", answer: "The total cost for a family-based green card including I-130 and I-485 filings is approximately $1,760 in government fees, plus attorney fees of $2,000 to $8,000." },
    { question: "Can USCIS fees be waived?", answer: "Fee waivers are available for certain forms (I-485, N-400, I-765) if you demonstrate financial hardship, receive means-tested benefits, or have income below 150% of poverty guidelines." },
    { question: "What is premium processing?", answer: "Premium processing guarantees USCIS will process certain petitions within 15 business days for an additional fee of $2,805. It is available for I-140 and some I-129 petitions." },
  ],
  formula: "Total Cost = (Filing Fee + Biometrics + Premium) x Applicants + Attorney Fee",
};
