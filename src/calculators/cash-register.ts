import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cashRegisterCalculator: CalculatorDefinition = {
  slug: "cash-register",
  title: "Cash Register / POS Calculator",
  description:
    "Simple point-of-sale calculator with sales tax, discount, and change due for cash transactions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "cash register",
    "POS",
    "sales tax",
    "change",
    "point of sale",
    "checkout",
    "transaction",
  ],
  variants: [
    {
      slug: "cash-register",
      title: "Sales Tax & Change Calculator",
      description:
        "Calculate total with tax, apply discounts, and determine change due.",
      fields: [
        {
          name: "subtotal",
          label: "Subtotal / Item Total ($)",
          type: "number",
          defaultValue: "47.50",
        },
        {
          name: "salesTaxRate",
          label: "Sales Tax Rate (%)",
          type: "number",
          defaultValue: "8.25",
        },
        {
          name: "discountType",
          label: "Discount Type",
          type: "select",
          defaultValue: "percent",
          options: [
            { label: "Percentage Off", value: "percent" },
            { label: "Dollar Amount Off", value: "dollar" },
            { label: "No Discount", value: "none" },
          ],
        },
        {
          name: "discountValue",
          label: "Discount Value",
          type: "number",
          defaultValue: "10",
        },
        {
          name: "amountTendered",
          label: "Amount Tendered ($)",
          type: "number",
          defaultValue: "60",
        },
      ],
      calculate(inputs) {
        const subtotal = parseFloat(inputs.subtotal as string);
        const taxRate = parseFloat(inputs.salesTaxRate as string) / 100;
        const discountType = inputs.discountType as string;
        const discountValue = parseFloat(inputs.discountValue as string);
        const tendered = parseFloat(inputs.amountTendered as string);

        let discount = 0;
        if (discountType === "percent") {
          discount = subtotal * (discountValue / 100);
        } else if (discountType === "dollar") {
          discount = discountValue;
        }

        const afterDiscount = subtotal - discount;
        const taxAmount = afterDiscount * taxRate;
        const total = afterDiscount + taxAmount;
        const changeDue = tendered - total;

        // Break down change
        const changeInCents = Math.round(Math.max(0, changeDue) * 100);
        const twenties = Math.floor(changeInCents / 2000);
        let remaining = changeInCents % 2000;
        const tens = Math.floor(remaining / 1000);
        remaining = remaining % 1000;
        const fives = Math.floor(remaining / 500);
        remaining = remaining % 500;
        const ones = Math.floor(remaining / 100);
        remaining = remaining % 100;
        const quarters = Math.floor(remaining / 25);
        remaining = remaining % 25;
        const dimes = Math.floor(remaining / 10);
        remaining = remaining % 10;
        const nickels = Math.floor(remaining / 5);
        const pennies = remaining % 5;

        return {
          "Subtotal": `$${formatNumber(subtotal)}`,
          "Discount": `$${formatNumber(discount)}`,
          "After Discount": `$${formatNumber(afterDiscount)}`,
          "Sales Tax": `$${formatNumber(taxAmount)}`,
          "Total Due": `$${formatNumber(total)}`,
          "Amount Tendered": `$${formatNumber(tendered)}`,
          "Change Due": `$${formatNumber(changeDue)}`,
          "Change Breakdown": `$20x${formatNumber(twenties)} $10x${formatNumber(tens)} $5x${formatNumber(fives)} $1x${formatNumber(ones)} 25cx${formatNumber(quarters)} 10cx${formatNumber(dimes)} 5cx${formatNumber(nickels)} 1cx${formatNumber(pennies)}`,
        };
      },
    },
    {
      slug: "cash-register-daily",
      title: "Daily Cash Drawer Reconciliation",
      description: "Reconcile your cash drawer at end of day.",
      fields: [
        {
          name: "startingCash",
          label: "Starting Cash in Drawer ($)",
          type: "number",
          defaultValue: "200",
        },
        {
          name: "cashSales",
          label: "Total Cash Sales ($)",
          type: "number",
          defaultValue: "850",
        },
        {
          name: "cashRefunds",
          label: "Cash Refunds Given ($)",
          type: "number",
          defaultValue: "25",
        },
        {
          name: "paidOuts",
          label: "Paid Outs / Petty Cash ($)",
          type: "number",
          defaultValue: "15",
        },
        {
          name: "actualCashInDrawer",
          label: "Actual Cash Counted ($)",
          type: "number",
          defaultValue: "1005",
        },
      ],
      calculate(inputs) {
        const starting = parseFloat(inputs.startingCash as string);
        const sales = parseFloat(inputs.cashSales as string);
        const refunds = parseFloat(inputs.cashRefunds as string);
        const paidOuts = parseFloat(inputs.paidOuts as string);
        const actual = parseFloat(inputs.actualCashInDrawer as string);

        const expectedCash = starting + sales - refunds - paidOuts;
        const overShort = actual - expectedCash;
        const netCashSales = sales - refunds;
        const deposit = actual - starting;

        return {
          "Starting Cash": `$${formatNumber(starting)}`,
          "Net Cash Sales": `$${formatNumber(netCashSales)}`,
          "Paid Outs": `$${formatNumber(paidOuts)}`,
          "Expected Cash in Drawer": `$${formatNumber(expectedCash)}`,
          "Actual Cash Counted": `$${formatNumber(actual)}`,
          "Over/(Short)": `$${formatNumber(overShort)}`,
          "Bank Deposit Amount": `$${formatNumber(deposit)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "restaurant-food-cost",
    "product-pricing",
    "tip-credit-calculator",
  ],
  faq: [
    {
      question: "How do I calculate sales tax?",
      answer:
        "Sales tax = Subtotal (after discounts) x Tax Rate. For example, a $50 item with 8.25% tax: $50 x 0.0825 = $4.13 tax, for a total of $54.13. Apply percentage discounts before calculating tax.",
    },
    {
      question: "What is a normal over/short tolerance for a cash drawer?",
      answer:
        "Most businesses consider +/- $1-2 acceptable for daily cash drawer variances. Consistent shortages over $5 may indicate a training issue or theft. Keep a log of all over/short amounts for accountability.",
    },
  ],
  formula:
    "Total = (Subtotal - Discount) x (1 + Tax Rate). Change = Amount Tendered - Total. Expected Cash = Starting Cash + Cash Sales - Refunds - Paid Outs. Over/Short = Actual - Expected.",
};
