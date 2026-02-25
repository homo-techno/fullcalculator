import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const currencyConverterTrip: CalculatorDefinition = {
  slug: "currency-converter-trip",
  title: "Travel Currency Converter",
  description:
    "Free online travel currency converter. Convert currency with estimated travel exchange rates and compare ATM, airport, and hotel exchange options.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "currency converter",
    "exchange rate",
    "travel money",
    "foreign exchange",
    "currency exchange",
  ],
  variants: [
    {
      id: "convert",
      name: "Convert Currency",
      fields: [
        {
          name: "amount",
          label: "Amount to Convert",
          type: "number",
          placeholder: "e.g. 1000",
        },
        {
          name: "fromCurrency",
          label: "From Currency",
          type: "select",
          options: [
            { label: "US Dollar (USD)", value: "usd" },
            { label: "Euro (EUR)", value: "eur" },
            { label: "British Pound (GBP)", value: "gbp" },
            { label: "Japanese Yen (JPY)", value: "jpy" },
            { label: "Canadian Dollar (CAD)", value: "cad" },
            { label: "Australian Dollar (AUD)", value: "aud" },
            { label: "Swiss Franc (CHF)", value: "chf" },
            { label: "Mexican Peso (MXN)", value: "mxn" },
            { label: "Thai Baht (THB)", value: "thb" },
            { label: "Indian Rupee (INR)", value: "inr" },
          ],
        },
        {
          name: "toCurrency",
          label: "To Currency",
          type: "select",
          options: [
            { label: "US Dollar (USD)", value: "usd" },
            { label: "Euro (EUR)", value: "eur" },
            { label: "British Pound (GBP)", value: "gbp" },
            { label: "Japanese Yen (JPY)", value: "jpy" },
            { label: "Canadian Dollar (CAD)", value: "cad" },
            { label: "Australian Dollar (AUD)", value: "aud" },
            { label: "Swiss Franc (CHF)", value: "chf" },
            { label: "Mexican Peso (MXN)", value: "mxn" },
            { label: "Thai Baht (THB)", value: "thb" },
            { label: "Indian Rupee (INR)", value: "inr" },
          ],
        },
        {
          name: "exchangeMethod",
          label: "Exchange Method",
          type: "select",
          options: [
            { label: "ATM Withdrawal (best rate)", value: "atm" },
            { label: "Bank Exchange", value: "bank" },
            { label: "Airport Kiosk", value: "airport" },
            { label: "Hotel Front Desk", value: "hotel" },
            { label: "Credit Card (no foreign fee)", value: "creditcard" },
          ],
        },
      ],
      calculate: (inputs) => {
        const amount = parseFloat(inputs.amount as string) || 0;
        const fromCurrency = inputs.fromCurrency as string;
        const toCurrency = inputs.toCurrency as string;
        const exchangeMethod = inputs.exchangeMethod as string;

        // Approximate rates vs USD (mid-market)
        const toUsd: Record<string, number> = {
          usd: 1.0,
          eur: 1.08,
          gbp: 1.27,
          jpy: 0.0067,
          cad: 0.74,
          aud: 0.65,
          chf: 1.12,
          mxn: 0.058,
          thb: 0.028,
          inr: 0.012,
        };

        // Markup percentages by exchange method
        const markups: Record<string, number> = {
          atm: 0.015,
          bank: 0.025,
          airport: 0.08,
          hotel: 0.10,
          creditcard: 0.0,
        };

        const fromRate = toUsd[fromCurrency] || 1.0;
        const toRate = toUsd[toCurrency] || 1.0;

        if (fromCurrency === toCurrency) {
          return {
            primary: { label: "Converted Amount", value: formatNumber(amount, 2) },
            details: [{ label: "Note", value: "Same currency selected" }],
          };
        }

        const midMarketRate = fromRate / toRate;
        const markup = markups[exchangeMethod] || 0.03;
        const effectiveRate = midMarketRate * (1 - markup);
        const converted = amount * effectiveRate;
        const midMarketConverted = amount * midMarketRate;
        const costOfExchange = midMarketConverted - converted;

        return {
          primary: { label: "You Receive (est.)", value: formatNumber(converted, 2) },
          details: [
            { label: "Mid-Market Rate", value: "1 = " + formatNumber(midMarketRate, 4) },
            { label: "Effective Rate", value: "1 = " + formatNumber(effectiveRate, 4) },
            { label: "Exchange Markup", value: formatNumber(markup * 100, 1) + "%" },
            { label: "Cost of Exchange", value: formatNumber(costOfExchange, 2) + " (in target currency)" },
            { label: "At Mid-Market", value: formatNumber(midMarketConverted, 2) },
          ],
          note: "Rates are approximate. Check current rates before traveling.",
        };
      },
    },
  ],
  relatedSlugs: ["customs-duty", "travel-budget-daily", "duty-free-savings"],
  faq: [
    {
      question: "Where should I exchange currency for travel?",
      answer:
        "ATMs and credit cards with no foreign transaction fees typically offer the best exchange rates. Avoid airport kiosks and hotel exchanges, which charge 5-12% markups.",
    },
    {
      question: "Should I exchange currency before traveling?",
      answer:
        "It is wise to have a small amount of local currency for arrival (taxi, tips). Exchange a small amount at your bank before departure, then use ATMs at your destination for the best rates.",
    },
    {
      question: "What is the foreign transaction fee?",
      answer:
        "Most credit cards charge a 3% foreign transaction fee on purchases abroad. Some travel credit cards waive this fee entirely, making them the most cost-effective payment method overseas.",
    },
  ],
  formula:
    "Converted Amount = Original Amount x (Mid-Market Rate x (1 - Markup %))\nCost = Mid-Market Amount - Actual Amount Received",
};
