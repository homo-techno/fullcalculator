import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cosmeticSurgeryCostCalculator: CalculatorDefinition = {
  slug: "cosmetic-surgery-cost-calculator",
  title: "Cosmetic Surgery Cost Calculator",
  description:
    "Estimate the cost of popular cosmetic procedures including rhinoplasty, breast augmentation, liposuction, tummy tuck, and facelift. Includes surgeon fees, anesthesia, and facility costs.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "cosmetic surgery cost",
    "plastic surgery cost",
    "rhinoplasty cost",
    "breast augmentation cost",
    "liposuction cost",
    "tummy tuck cost",
    "facelift cost",
  ],
  variants: [
    {
      id: "procedure",
      name: "Procedure Cost Estimate",
      description: "Estimate total cost for a specific cosmetic procedure",
      fields: [
        {
          name: "procedure",
          label: "Procedure",
          type: "select",
          options: [
            { label: "Rhinoplasty (nose job)", value: "rhinoplasty" },
            { label: "Breast augmentation", value: "breast_aug" },
            { label: "Breast reduction", value: "breast_red" },
            { label: "Liposuction", value: "liposuction" },
            { label: "Tummy tuck (abdominoplasty)", value: "tummy_tuck" },
            { label: "Facelift", value: "facelift" },
            { label: "Eyelid surgery (blepharoplasty)", value: "eyelid" },
            { label: "Brazilian butt lift (BBL)", value: "bbl" },
          ],
          defaultValue: "rhinoplasty",
        },
        {
          name: "surgeonExperience",
          label: "Surgeon Experience Level",
          type: "select",
          options: [
            { label: "Board-certified (standard)", value: "standard" },
            { label: "Highly experienced specialist", value: "specialist" },
            { label: "Renowned/celebrity surgeon", value: "renowned" },
          ],
          defaultValue: "standard",
        },
        {
          name: "region",
          label: "Region",
          type: "select",
          options: [
            { label: "Major metro (NYC, LA, Miami)", value: "metro" },
            { label: "Mid-size city", value: "mid" },
            { label: "Smaller city", value: "small" },
          ],
          defaultValue: "mid",
        },
      ],
      calculate: (inputs) => {
        const procedure = inputs.procedure as string;
        const experience = inputs.surgeonExperience as string;
        const region = inputs.region as string;

        const surgeonFees: Record<string, number> = {
          rhinoplasty: 6500, breast_aug: 5200, breast_red: 6500,
          liposuction: 4500, tummy_tuck: 7200, facelift: 9500,
          eyelid: 3800, bbl: 8000,
        };
        const anesthesiaFees: Record<string, number> = {
          rhinoplasty: 1200, breast_aug: 1000, breast_red: 1200,
          liposuction: 800, tummy_tuck: 1200, facelift: 1500,
          eyelid: 700, bbl: 1300,
        };
        const facilityFees: Record<string, number> = {
          rhinoplasty: 1500, breast_aug: 1200, breast_red: 1500,
          liposuction: 1000, tummy_tuck: 1500, facelift: 1800,
          eyelid: 800, bbl: 1600,
        };

        const expMultipliers: Record<string, number> = { standard: 1.0, specialist: 1.35, renowned: 2.0 };
        const regionMultipliers: Record<string, number> = { metro: 1.30, mid: 1.0, small: 0.80 };

        const surgeon = (surgeonFees[procedure] || 5000) * (expMultipliers[experience] || 1.0);
        const anesthesia = anesthesiaFees[procedure] || 1000;
        const facility = facilityFees[procedure] || 1200;
        const regionMult = regionMultipliers[region] || 1.0;

        const totalCost = (surgeon + anesthesia + facility) * regionMult;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Surgeon Fee", value: `$${formatNumber(surgeon * regionMult, 0)}` },
            { label: "Anesthesia", value: `$${formatNumber(anesthesia * regionMult, 0)}` },
            { label: "Facility Fee", value: `$${formatNumber(facility * regionMult, 0)}` },
            { label: "Typical Range", value: `$${formatNumber(totalCost * 0.80, 0)} - $${formatNumber(totalCost * 1.20, 0)}` },
            { label: "Financing (24 mo)", value: `$${formatNumber(totalCost / 24, 0)}/mo` },
          ],
          note: "Costs do not include pre-op tests, compression garments, prescriptions, or revision surgery. Always choose a board-certified plastic surgeon. Costs vary significantly by individual case complexity.",
        };
      },
    },
  ],
  relatedSlugs: ["botox-cost-calculator", "lasik-cost-calculator", "dental-implant-cost-calculator"],
  faq: [
    {
      question: "What is the most expensive cosmetic surgery?",
      answer:
        "Facelifts are typically the most expensive single procedure at $12,000-$20,000+. Brazilian butt lifts (BBL) and body contouring combinations can also exceed $15,000. Costs increase with combined procedures and more experienced surgeons.",
    },
    {
      question: "Does insurance cover any cosmetic surgery?",
      answer:
        "Insurance generally does not cover elective cosmetic procedures. However, some procedures may be partially covered if medically necessary -- for example, rhinoplasty for breathing issues, breast reduction for back pain, or eyelid surgery for obstructed vision. Pre-authorization and documentation are required.",
    },
    {
      question: "How can I finance cosmetic surgery?",
      answer:
        "Options include medical credit cards (CareCredit, Alphaeon), personal loans, surgeon payment plans (often interest-free for 6-12 months), HSA/FSA for medically necessary components, and home equity loans. Compare interest rates and terms carefully.",
    },
  ],
  formula:
    "Total Cost = (Surgeon Fee x Experience Multiplier + Anesthesia + Facility) x Region Multiplier",
};
