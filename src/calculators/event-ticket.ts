import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eventTicketCalculator: CalculatorDefinition = {
  slug: "event-ticket-calculator",
  title: "Event Ticket Price Calculator",
  description:
    "Free event ticket price calculator. Calculate total ticket costs including fees, taxes, and compare prices across platforms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ticket price calculator",
    "event ticket cost",
    "concert ticket fees",
    "ticket fee calculator",
    "Ticketmaster fees",
    "ticket total cost",
    "event budget",
  ],
  variants: [
    {
      id: "ticket-total",
      name: "Total Ticket Cost",
      description: "Calculate the true total cost of event tickets including all fees",
      fields: [
        {
          name: "faceValue",
          label: "Face Value / Listed Price ($)",
          type: "number",
          placeholder: "e.g. 75",
          prefix: "$",
          min: 1,
        },
        {
          name: "numTickets",
          label: "Number of Tickets",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          defaultValue: 2,
        },
        {
          name: "serviceFeePercent",
          label: "Service Fee (%)",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "%",
          min: 0,
          max: 50,
          defaultValue: 20,
        },
        {
          name: "facilityFee",
          label: "Facility / Venue Fee ($ per ticket)",
          type: "number",
          placeholder: "e.g. 5",
          prefix: "$",
          min: 0,
          defaultValue: 5,
        },
        {
          name: "orderProcessing",
          label: "Order Processing Fee ($, flat)",
          type: "number",
          placeholder: "e.g. 5",
          prefix: "$",
          min: 0,
          defaultValue: 5,
        },
        {
          name: "taxRate",
          label: "Tax Rate (%)",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.25,
          defaultValue: 0,
        },
        {
          name: "deliveryFee",
          label: "Delivery / Transfer Fee ($)",
          type: "number",
          placeholder: "e.g. 3",
          prefix: "$",
          min: 0,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const faceValue = inputs.faceValue as number;
        const numTickets = (inputs.numTickets as number) || 1;
        const servicePct = ((inputs.serviceFeePercent as number) || 0) / 100;
        const facilityFee = (inputs.facilityFee as number) || 0;
        const orderFee = (inputs.orderProcessing as number) || 0;
        const taxRate = ((inputs.taxRate as number) || 0) / 100;
        const deliveryFee = (inputs.deliveryFee as number) || 0;

        if (!faceValue || faceValue <= 0) return null;

        const subtotal = faceValue * numTickets;
        const serviceFee = subtotal * servicePct;
        const totalFacility = facilityFee * numTickets;
        const preTaxTotal = subtotal + serviceFee + totalFacility + orderFee;
        const tax = preTaxTotal * taxRate;
        const grandTotal = preTaxTotal + tax + deliveryFee;

        const totalFeesPerTicket = (grandTotal - subtotal) / numTickets;
        const costPerTicket = grandTotal / numTickets;
        const feePercent = ((grandTotal - subtotal) / subtotal) * 100;

        return {
          primary: { label: "Total Cost", value: "$" + formatNumber(grandTotal, 2) },
          details: [
            { label: "Face Value Subtotal", value: "$" + formatNumber(subtotal, 2) + ` (${numTickets} x $${formatNumber(faceValue, 2)})` },
            { label: "Service Fee", value: "$" + formatNumber(serviceFee, 2) + ` (${formatNumber(servicePct * 100, 0)}%)` },
            { label: "Facility Fee", value: "$" + formatNumber(totalFacility, 2) + ` ($${formatNumber(facilityFee, 2)} x ${numTickets})` },
            { label: "Order Processing", value: "$" + formatNumber(orderFee, 2) },
            { label: "Tax", value: "$" + formatNumber(tax, 2) },
            { label: "Delivery Fee", value: "$" + formatNumber(deliveryFee, 2) },
            { label: "Total Fees Added", value: "$" + formatNumber(grandTotal - subtotal, 2) + ` (${formatNumber(feePercent, 1)}% markup)` },
            { label: "True Cost per Ticket", value: "$" + formatNumber(costPerTicket, 2) },
            { label: "Fees per Ticket", value: "$" + formatNumber(totalFeesPerTicket, 2) },
          ],
        };
      },
    },
    {
      id: "event-budget",
      name: "Total Event Budget",
      description: "Calculate total cost of attending an event including tickets, travel, food, etc.",
      fields: [
        {
          name: "ticketTotal",
          label: "Total Ticket Cost ($)",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
          min: 0,
        },
        {
          name: "travelCost",
          label: "Travel / Gas / Parking ($)",
          type: "number",
          placeholder: "e.g. 40",
          prefix: "$",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "foodDrinks",
          label: "Food & Drinks ($)",
          type: "number",
          placeholder: "e.g. 60",
          prefix: "$",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "merchandise",
          label: "Merchandise ($)",
          type: "number",
          placeholder: "e.g. 40",
          prefix: "$",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "hotelCost",
          label: "Hotel / Accommodation ($)",
          type: "number",
          placeholder: "e.g. 150",
          prefix: "$",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "otherCosts",
          label: "Other Costs ($)",
          type: "number",
          placeholder: "e.g. 20",
          prefix: "$",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "numPeople",
          label: "Number of People",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const tickets = (inputs.ticketTotal as number) || 0;
        const travel = (inputs.travelCost as number) || 0;
        const food = (inputs.foodDrinks as number) || 0;
        const merch = (inputs.merchandise as number) || 0;
        const hotel = (inputs.hotelCost as number) || 0;
        const other = (inputs.otherCosts as number) || 0;
        const people = (inputs.numPeople as number) || 1;

        const total = tickets + travel + food + merch + hotel + other;
        const perPerson = total / people;

        if (total <= 0) return null;

        return {
          primary: { label: "Total Event Budget", value: "$" + formatNumber(total, 2) },
          details: [
            { label: "Tickets", value: "$" + formatNumber(tickets, 2) + ` (${formatNumber((tickets / total) * 100, 1)}%)` },
            { label: "Travel / Parking", value: "$" + formatNumber(travel, 2) },
            { label: "Food & Drinks", value: "$" + formatNumber(food, 2) },
            { label: "Merchandise", value: "$" + formatNumber(merch, 2) },
            { label: "Hotel / Accommodation", value: "$" + formatNumber(hotel, 2) },
            { label: "Other", value: "$" + formatNumber(other, 2) },
            { label: "Cost per Person", value: "$" + formatNumber(perPerson, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hobby-cost-calculator", "tip-calculator", "discount-calculator"],
  faq: [
    {
      question: "How much do ticket fees usually add?",
      answer:
        "Ticket service fees typically add 20-30% to the face value. A $100 ticket often costs $125-135 after service fees, facility fees, and order processing. This varies by platform and event.",
    },
    {
      question: "Why are ticket fees so high?",
      answer:
        "Ticket fees include the platform's service charge (their revenue), facility/venue fees, payment processing, and sometimes insurance. Some fees go to the venue, some to the ticketing company. The total can be 15-40% of face value.",
    },
    {
      question: "How can I reduce ticket costs?",
      answer:
        "Buy directly from the venue box office (often lower fees), use presale codes, avoid resale markups, buy in groups to split order processing fees, and choose mobile/digital delivery to avoid shipping fees. Some credit cards offer event perks.",
    },
  ],
  formula:
    "Total = (Face Value x Qty) + Service Fee + Facility Fees + Processing + Tax + Delivery | Fee % = Total Fees / Face Subtotal x 100 | Cost/Ticket = Grand Total / Qty",
};
