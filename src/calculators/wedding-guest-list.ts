import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingGuestListCalculator: CalculatorDefinition = {
  slug: "wedding-guest-list",
  title: "Wedding Guest List Estimator",
  description:
    "Free wedding guest list estimator. Calculate your expected guest count, RSVP rates, and plan for the right number of attendees based on relationship categories.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding", "guest list", "RSVP", "wedding planning", "attendees", "invitations"],
  variants: [
    {
      id: "byCategory",
      name: "By Relationship Category",
      fields: [
        { name: "immediateFamily", label: "Immediate Family", type: "number", placeholder: "e.g. 20" },
        { name: "extendedFamily", label: "Extended Family", type: "number", placeholder: "e.g. 40" },
        { name: "closeFriends", label: "Close Friends", type: "number", placeholder: "e.g. 15" },
        { name: "acquaintances", label: "Acquaintances & Coworkers", type: "number", placeholder: "e.g. 30" },
        { name: "plusOnes", label: "Plus-Ones Allowed", type: "number", placeholder: "e.g. 20" },
        { name: "childrenInvited", label: "Children Invited", type: "number", placeholder: "e.g. 10" },
        { name: "declineRate", label: "Expected Decline Rate (%)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const immediateFamily = (inputs.immediateFamily as number) || 0;
        const extendedFamily = (inputs.extendedFamily as number) || 0;
        const closeFriends = (inputs.closeFriends as number) || 0;
        const acquaintances = (inputs.acquaintances as number) || 0;
        const plusOnes = (inputs.plusOnes as number) || 0;
        const childrenInvited = (inputs.childrenInvited as number) || 0;
        const declineRate = (inputs.declineRate as number) || 20;

        const totalInvited = immediateFamily + extendedFamily + closeFriends + acquaintances + plusOnes + childrenInvited;
        if (totalInvited <= 0) return null;

        const expectedAttendees = Math.round(totalInvited * (1 - declineRate / 100));
        const expectedDeclines = totalInvited - expectedAttendees;
        const adultGuests = expectedAttendees - Math.round(childrenInvited * (1 - declineRate / 100));
        const childGuests = Math.round(childrenInvited * (1 - declineRate / 100));

        return {
          primary: { label: "Expected Attendees", value: formatNumber(expectedAttendees) },
          details: [
            { label: "Total Invited", value: formatNumber(totalInvited) },
            { label: "Expected Declines", value: formatNumber(expectedDeclines) },
            { label: "Expected Adult Guests", value: formatNumber(adultGuests) },
            { label: "Expected Child Guests", value: formatNumber(childGuests) },
            { label: "Family Guests Invited", value: formatNumber(immediateFamily + extendedFamily) },
            { label: "Friends/Others Invited", value: formatNumber(closeFriends + acquaintances) },
          ],
        };
      },
    },
    {
      id: "bySide",
      name: "By Bride/Groom Side",
      fields: [
        { name: "brideFamily", label: "Bride's Family & Friends", type: "number", placeholder: "e.g. 60" },
        { name: "groomFamily", label: "Groom's Family & Friends", type: "number", placeholder: "e.g. 55" },
        { name: "mutualFriends", label: "Mutual Friends", type: "number", placeholder: "e.g. 20" },
        { name: "plusOnes", label: "Plus-Ones", type: "number", placeholder: "e.g. 15" },
        { name: "declineRate", label: "Expected Decline Rate (%)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const brideFamily = (inputs.brideFamily as number) || 0;
        const groomFamily = (inputs.groomFamily as number) || 0;
        const mutualFriends = (inputs.mutualFriends as number) || 0;
        const plusOnes = (inputs.plusOnes as number) || 0;
        const declineRate = (inputs.declineRate as number) || 20;

        const totalInvited = brideFamily + groomFamily + mutualFriends + plusOnes;
        if (totalInvited <= 0) return null;

        const expectedAttendees = Math.round(totalInvited * (1 - declineRate / 100));

        return {
          primary: { label: "Expected Attendees", value: formatNumber(expectedAttendees) },
          details: [
            { label: "Total Invited", value: formatNumber(totalInvited) },
            { label: "Bride's Side", value: formatNumber(brideFamily) },
            { label: "Groom's Side", value: formatNumber(groomFamily) },
            { label: "Mutual Friends", value: formatNumber(mutualFriends) },
            { label: "Expected Declines", value: formatNumber(totalInvited - expectedAttendees) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-seating", "catering-quantity", "wedding-invitation"],
  faq: [
    { question: "What is a typical RSVP decline rate?", answer: "Typically 15-25% of invited guests will decline. Local guests have a lower decline rate (10-15%) while destination wedding guests may decline at 30-40%." },
    { question: "How do I handle plus-ones?", answer: "A common approach is to give plus-ones to guests in relationships, out-of-town guests, and those who won't know many other guests. Budget for about 50-75% of plus-one invitations being used." },
  ],
  formula: "Expected Attendees = Total Invited x (1 - Decline Rate / 100)",
};
