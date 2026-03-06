import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingInvitationQuantityCalculator: CalculatorDefinition = {
  slug: "wedding-invitation-quantity-calculator",
  title: "Wedding Invitation Quantity Calculator",
  description: "Calculate exactly how many wedding invitations to order based on guest list, household groupings, vendor copies, and keepsake extras.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["invitation quantity","how many invitations","wedding stationery count","save the date quantity"],
  variants: [{
    id: "standard",
    name: "Wedding Invitation Quantity",
    description: "Calculate exactly how many wedding invitations to order based on guest list, household groupings, vendor copies, and keepsake extras.",
    fields: [
      { name: "totalGuests", label: "Total Guest Count", type: "number", min: 10, max: 500, defaultValue: 150 },
      { name: "households", label: "Number of Households", type: "number", min: 5, max: 400, defaultValue: 95 },
      { name: "vendorCopies", label: "Vendor Copies Needed", type: "number", min: 0, max: 20, defaultValue: 3 },
      { name: "keepsakeExtras", label: "Keepsake/Extra Copies", type: "number", min: 0, max: 20, defaultValue: 5 },
      { name: "errorBuffer", label: "Error Buffer (%)", type: "number", min: 0, max: 25, defaultValue: 10 },
      { name: "costPerInvite", label: "Cost Per Invitation Suite ($)", type: "number", min: 1, max: 30, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const guests = inputs.totalGuests as number;
    const households = inputs.households as number;
    const vendorCopies = inputs.vendorCopies as number;
    const keepsakes = inputs.keepsakeExtras as number;
    const buffer = inputs.errorBuffer as number;
    const costEach = inputs.costPerInvite as number;
    const baseInvitations = households;
    const bufferQty = Math.ceil(households * (buffer / 100));
    const totalInvitations = baseInvitations + vendorCopies + keepsakes + bufferQty;
    const totalCost = totalInvitations * costEach;
    const postageCost = totalInvitations * 0.68;
    return {
      primary: { label: "Total Invitations to Order", value: formatNumber(totalInvitations) },
      details: [
        { label: "Household Invitations", value: formatNumber(baseInvitations) },
        { label: "Buffer Copies", value: formatNumber(bufferQty) },
        { label: "Vendor + Keepsake", value: formatNumber(vendorCopies + keepsakes) },
        { label: "Printing Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Estimated Postage", value: "$" + formatNumber(Math.round(postageCost * 100) / 100) },
        { label: "Total Stationery Cost", value: "$" + formatNumber(Math.round(totalCost + postageCost)) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-invitation-calculator","wedding-guest-calculator","wedding-budget-calculator"],
  faq: [
    { question: "How do you determine the number of wedding invitations?", answer: "Count households, not individual guests. A couple living together gets one invitation. Add 10% extra for mistakes, plus a few for keepsakes and vendors." },
    { question: "When should wedding invitations be sent?", answer: "Mail invitations 6-8 weeks before the wedding. Destination weddings should send 8-12 weeks in advance. Save-the-dates go out 6-8 months early." },
    { question: "What should be included in a wedding invitation suite?", answer: "A full suite includes the invitation, RSVP card with envelope, details/reception card, and outer and inner envelopes. Some add maps, accommodation cards, or meal choice cards." },
  ],
  formula: "Total Invitations = Households + ceil(Households x Buffer%) + VendorCopies + Keepsakes; Printing Cost = TotalInvitations x CostPerInvite; Postage = TotalInvitations x $0.68",
};
