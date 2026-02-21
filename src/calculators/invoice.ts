import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const invoiceCalculator: CalculatorDefinition = {
  slug: "invoice-calculator",
  title: "Invoice Calculator",
  description:
    "Free invoice calculator. Calculate invoice totals from hourly rates, hours worked, item quantities, and prices. Add tax rate to get the final amount due.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "invoice calculator",
    "invoice total calculator",
    "billing calculator",
    "invoice generator",
    "invoice amount calculator",
  ],
  variants: [
    {
      id: "hourly",
      name: "Hourly Invoice",
      description: "Calculate invoice total based on hours worked",
      fields: [
        {
          name: "hourlyRate",
          label: "Hourly Rate",
          type: "number",
          placeholder: "e.g. 75",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "hoursWorked",
          label: "Hours Worked",
          type: "number",
          placeholder: "e.g. 40",
          min: 0,
          step: 0.25,
        },
        {
          name: "additionalItems",
          label: "Additional Charges (materials, etc.)",
          type: "number",
          placeholder: "e.g. 250",
          prefix: "$",
          min: 0,
        },
        {
          name: "discount",
          label: "Discount",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
        },
        {
          name: "taxRate",
          label: "Tax Rate",
          type: "number",
          placeholder: "e.g. 8.25",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const rate = inputs.hourlyRate as number;
        const hours = inputs.hoursWorked as number;
        const additional = (inputs.additionalItems as number) || 0;
        const discountPct = (inputs.discount as number) || 0;
        const taxRate = (inputs.taxRate as number) || 0;
        if (!rate || !hours) return null;

        const laborTotal = rate * hours;
        const subtotal = laborTotal + additional;
        const discountAmount = subtotal * (discountPct / 100);
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = afterDiscount * (taxRate / 100);
        const totalDue = afterDiscount + taxAmount;

        return {
          primary: {
            label: "Total Amount Due",
            value: `$${formatNumber(totalDue)}`,
          },
          details: [
            { label: "Labor (rate × hours)", value: `$${formatNumber(laborTotal)}` },
            { label: "Additional charges", value: `$${formatNumber(additional)}` },
            { label: "Subtotal", value: `$${formatNumber(subtotal)}` },
            { label: `Discount (${formatNumber(discountPct, 1)}%)`, value: `-$${formatNumber(discountAmount)}` },
            { label: "After discount", value: `$${formatNumber(afterDiscount)}` },
            { label: `Tax (${formatNumber(taxRate, 2)}%)`, value: `$${formatNumber(taxAmount)}` },
            { label: "Total due", value: `$${formatNumber(totalDue)}` },
          ],
        };
      },
    },
    {
      id: "itemized",
      name: "Itemized Invoice",
      description: "Calculate invoice with multiple line items",
      fields: [
        {
          name: "item1Price",
          label: "Item 1 Price",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
        },
        {
          name: "item1Qty",
          label: "Item 1 Quantity",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          step: 1,
          defaultValue: 1,
        },
        {
          name: "item2Price",
          label: "Item 2 Price",
          type: "number",
          placeholder: "e.g. 250",
          prefix: "$",
          min: 0,
        },
        {
          name: "item2Qty",
          label: "Item 2 Quantity",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          step: 1,
          defaultValue: 1,
        },
        {
          name: "item3Price",
          label: "Item 3 Price",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          min: 0,
        },
        {
          name: "item3Qty",
          label: "Item 3 Quantity",
          type: "number",
          placeholder: "e.g. 1",
          min: 0,
          step: 1,
          defaultValue: 1,
        },
        {
          name: "taxRate",
          label: "Tax Rate",
          type: "number",
          placeholder: "e.g. 8.25",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const items = [
          { price: (inputs.item1Price as number) || 0, qty: (inputs.item1Qty as number) || 1 },
          { price: (inputs.item2Price as number) || 0, qty: (inputs.item2Qty as number) || 1 },
          { price: (inputs.item3Price as number) || 0, qty: (inputs.item3Qty as number) || 1 },
        ];
        const taxRate = (inputs.taxRate as number) || 0;

        const lineItems = items.filter((i) => i.price > 0);
        if (lineItems.length === 0) return null;

        const details: { label: string; value: string }[] = [];
        let subtotal = 0;

        lineItems.forEach((item, idx) => {
          const lineTotal = item.price * item.qty;
          subtotal += lineTotal;
          details.push({
            label: `Item ${idx + 1}: $${formatNumber(item.price)} × ${item.qty}`,
            value: `$${formatNumber(lineTotal)}`,
          });
        });

        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;

        details.push({ label: "Subtotal", value: `$${formatNumber(subtotal)}` });
        details.push({ label: `Tax (${formatNumber(taxRate, 2)}%)`, value: `$${formatNumber(taxAmount)}` });

        return {
          primary: {
            label: "Invoice Total",
            value: `$${formatNumber(total)}`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["freelance-rate-calculator", "sales-tax-calculator", "discount-calculator"],
  faq: [
    {
      question: "How do I calculate an invoice total?",
      answer:
        "Invoice Total = (Hourly Rate × Hours + Additional Items - Discount) + Tax. List each line item, calculate the subtotal, apply any discounts, then add applicable sales tax to arrive at the total amount due.",
    },
    {
      question: "Should I charge sales tax on freelance invoices?",
      answer:
        "It depends on your state and the type of service. Most states do not charge sales tax on services, but some do (e.g., Hawaii, New Mexico, South Dakota). Physical products are generally taxable. Consult your state tax authority for specifics.",
    },
    {
      question: "What should be included on an invoice?",
      answer:
        "A professional invoice should include: your business name and contact info, client name, invoice number, date, payment terms, itemized list of services/products with quantities and prices, subtotal, taxes, total amount due, and payment instructions.",
    },
  ],
  formula:
    "Invoice Total = (Sum of Line Items - Discount) × (1 + Tax Rate). Line Item = Unit Price × Quantity.",
};
