import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingInvitationCalculator: CalculatorDefinition = {
  slug: "wedding-invitation",
  title: "Wedding Invitation Quantity Calculator",
  description: "Free wedding invitation quantity calculator. Determine how many invitations, save-the-dates, and RSVP cards to order for your wedding.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding invitations", "invitation quantity", "save the date", "RSVP cards", "wedding stationery"],
  variants: [
    {
      id: "standard",
      name: "Standard Calculation",
      fields: [
        { name: "households", label: "Number of Households", type: "number", placeholder: "e.g. 100" },
        { name: "extraInvites", label: "Extra Invitations (buffer %)", type: "number", placeholder: "e.g. 15" },
        { name: "saveTheDates", label: "Include Save-the-Dates?", type: "select", options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ] },
        { name: "costPerSuite", label: "Cost Per Invitation Suite ($)", type: "number", placeholder: "e.g. 5" },
        { name: "postageCost", label: "Postage Per Invite ($)", type: "number", placeholder: "e.g. 0.73" },
      ],
      calculate: (inputs) => {
        const households = (inputs.households as number) || 0;
        const extraInvites = (inputs.extraInvites as number) || 15;
        const saveTheDates = (inputs.saveTheDates as string) || "yes";
        const costPerSuite = (inputs.costPerSuite as number) || 5;
        const postageCost = (inputs.postageCost as number) || 0.73;
        if (households <= 0) return null;
        const totalInvitations = Math.ceil(households * (1 + extraInvites / 100));
        const saveTheDateCount = saveTheDates === "yes" ? totalInvitations : 0;
        const rsvpCards = totalInvitations;
        const invitationCost = totalInvitations * costPerSuite;
        const postageCostTotal = totalInvitations * postageCost * 2;
        const saveTheDateCost = saveTheDateCount * (costPerSuite * 0.5);
        const totalCost = invitationCost + postageCostTotal + saveTheDateCost;
        return {
          primary: { label: "Total Invitations to Order", value: formatNumber(totalInvitations) },
          details: [
            { label: "Households Invited", value: formatNumber(households) },
            { label: "Buffer Invitations", value: formatNumber(totalInvitations - households) },
            { label: "RSVP Cards", value: formatNumber(rsvpCards) },
            { label: "Save-the-Dates", value: saveTheDateCount > 0 ? formatNumber(saveTheDateCount) : "N/A" },
            { label: "Invitation Cost", value: "$" + formatNumber(invitationCost, 2) },
            { label: "Postage Cost (round trip)", value: "$" + formatNumber(postageCostTotal, 2) },
            { label: "Total Stationery Cost", value: "$" + formatNumber(totalCost, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-guest-list", "wedding-seating", "wedding-favor"],
  faq: [
    { question: "How many extra invitations should I order?", answer: "Order 15-20% more invitations than your household count to account for mistakes, keepsakes, and last-minute additions." },
    { question: "When should I send wedding invitations?", answer: "Send invitations 6-8 weeks before the wedding, or 8-12 weeks for destination weddings. Save-the-dates should go out 6-8 months in advance." },
  ],
  formula: "Total Invitations = Households x (1 + Buffer % / 100)",
};
