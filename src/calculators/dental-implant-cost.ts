import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dentalImplantCostCalculator: CalculatorDefinition = {
  slug: "dental-implant-cost-calculator",
  title: "Dental Implant Cost Calculator",
  description:
    "Estimate the total cost of dental implants by type, number, and region. Includes implant, abutment, crown, bone graft, and other procedure costs.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "dental implant cost",
    "tooth implant cost",
    "dental implant price",
    "how much do dental implants cost",
    "implant cost estimator",
    "all-on-4 cost",
  ],
  variants: [
    {
      id: "single",
      name: "Single Implant",
      description: "Cost estimate for a single dental implant with crown",
      fields: [
        {
          name: "implantType",
          label: "Implant Type",
          type: "select",
          options: [
            { label: "Titanium (standard)", value: "titanium" },
            { label: "Zirconia (ceramic)", value: "zirconia" },
            { label: "Mini implant", value: "mini" },
          ],
          defaultValue: "titanium",
        },
        {
          name: "crownType",
          label: "Crown Material",
          type: "select",
          options: [
            { label: "Porcelain-fused-to-metal", value: "pfm" },
            { label: "All-ceramic/zirconia", value: "ceramic" },
            { label: "Gold", value: "gold" },
          ],
          defaultValue: "ceramic",
        },
        {
          name: "boneGraft",
          label: "Bone Graft Needed",
          type: "select",
          options: [
            { label: "No", value: "none" },
            { label: "Minor graft", value: "minor" },
            { label: "Major graft / sinus lift", value: "major" },
          ],
          defaultValue: "none",
        },
        {
          name: "region",
          label: "Region",
          type: "select",
          options: [
            { label: "Northeast US", value: "northeast" },
            { label: "Southeast US", value: "southeast" },
            { label: "Midwest US", value: "midwest" },
            { label: "West Coast US", value: "west" },
            { label: "Southwest US", value: "southwest" },
          ],
          defaultValue: "midwest",
        },
      ],
      calculate: (inputs) => {
        const implantType = inputs.implantType as string;
        const crownType = inputs.crownType as string;
        const boneGraft = inputs.boneGraft as string;
        const region = inputs.region as string;

        const implantCosts: Record<string, number> = { titanium: 2000, zirconia: 2800, mini: 1200 };
        const crownCosts: Record<string, number> = { pfm: 1200, ceramic: 1500, gold: 1800 };
        const graftCosts: Record<string, number> = { none: 0, minor: 800, major: 2500 };
        const regionMultipliers: Record<string, number> = {
          northeast: 1.25, southeast: 0.95, midwest: 1.0, west: 1.30, southwest: 0.90,
        };

        const abutmentCost = 700;
        const consultCost = 200;
        const multiplier = regionMultipliers[region] || 1.0;

        const baseCost = implantCosts[implantType] + crownCosts[crownType] + abutmentCost + graftCosts[boneGraft] + consultCost;
        const totalCost = baseCost * multiplier;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Implant (post)", value: `$${formatNumber(implantCosts[implantType] * multiplier, 0)}` },
            { label: "Abutment", value: `$${formatNumber(abutmentCost * multiplier, 0)}` },
            { label: "Crown", value: `$${formatNumber(crownCosts[crownType] * multiplier, 0)}` },
            { label: "Bone Graft", value: `$${formatNumber(graftCosts[boneGraft] * multiplier, 0)}` },
            { label: "Consultation & Imaging", value: `$${formatNumber(consultCost * multiplier, 0)}` },
          ],
          note: "Costs are estimates and vary significantly by provider. Does not include sedation, temporary restorations, or potential complications. Get multiple quotes from board-certified oral surgeons or periodontists.",
        };
      },
    },
    {
      id: "multiple",
      name: "Multiple Implants / All-on-4",
      description: "Cost estimate for multiple implants or full-arch restoration",
      fields: [
        {
          name: "procedure",
          label: "Procedure Type",
          type: "select",
          options: [
            { label: "Multiple single implants", value: "multiple" },
            { label: "All-on-4 (one arch)", value: "allon4" },
            { label: "All-on-4 (both arches)", value: "allon4both" },
            { label: "Implant-supported bridge (3 unit)", value: "bridge" },
          ],
          defaultValue: "multiple",
        },
        {
          name: "numImplants",
          label: "Number of Implants (if multiple)",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
          max: 16,
          defaultValue: 2,
        },
        {
          name: "region",
          label: "Region",
          type: "select",
          options: [
            { label: "Northeast US", value: "northeast" },
            { label: "Southeast US", value: "southeast" },
            { label: "Midwest US", value: "midwest" },
            { label: "West Coast US", value: "west" },
            { label: "Southwest US", value: "southwest" },
          ],
          defaultValue: "midwest",
        },
      ],
      calculate: (inputs) => {
        const procedure = inputs.procedure as string;
        const numImplants = parseFloat(inputs.numImplants as string) || 2;
        const region = inputs.region as string;

        const regionMultipliers: Record<string, number> = {
          northeast: 1.25, southeast: 0.95, midwest: 1.0, west: 1.30, southwest: 0.90,
        };
        const multiplier = regionMultipliers[region] || 1.0;

        let baseCost: number;
        let description: string;

        switch (procedure) {
          case "allon4":
            baseCost = 25000;
            description = "All-on-4 (one arch)";
            break;
          case "allon4both":
            baseCost = 48000;
            description = "All-on-4 (both arches)";
            break;
          case "bridge":
            baseCost = 8500;
            description = "3-unit implant bridge";
            break;
          default:
            baseCost = 4100 * numImplants;
            description = `${numImplants} single implant(s)`;
        }

        const totalCost = baseCost * multiplier;
        const perImplant = procedure === "multiple" ? totalCost / numImplants : totalCost;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Procedure", value: description },
            { label: "Per Implant Cost", value: `$${formatNumber(perImplant, 0)}` },
            { label: "Region Adjustment", value: `${formatNumber(multiplier * 100, 0)}%` },
            { label: "Typical Range", value: `$${formatNumber(totalCost * 0.8, 0)} - $${formatNumber(totalCost * 1.2, 0)}` },
          ],
          note: "All-on-4 costs include implants, prosthesis, extractions, and temporary teeth. Additional costs may include sedation, CT scans, and follow-up adjustments. Financing options are commonly available.",
        };
      },
    },
  ],
  relatedSlugs: ["invisalign-cost-calculator", "cosmetic-surgery-cost-calculator", "lasik-cost-calculator"],
  faq: [
    {
      question: "How much does a single dental implant cost?",
      answer:
        "A single dental implant typically costs $3,000-$6,000 total, including the implant post ($1,500-$2,800), abutment ($500-$800), and crown ($1,000-$2,000). Costs vary by location, materials, and whether bone grafting is needed.",
    },
    {
      question: "Does dental insurance cover implants?",
      answer:
        "Many dental insurance plans now offer partial coverage for implants, typically 50% up to annual maximums of $1,500-$2,500. Some plans still classify implants as cosmetic. Dental discount plans and HSA/FSA funds can also reduce costs.",
    },
    {
      question: "How long do dental implants last?",
      answer:
        "Dental implants have a success rate of 95-98% and can last 25+ years or a lifetime with proper care. The crown portion may need replacement every 10-15 years due to normal wear. Regular dental check-ups are essential for implant longevity.",
    },
  ],
  formula:
    "Total Cost = (Implant + Abutment + Crown + Bone Graft + Consultation) x Regional Multiplier",
};
