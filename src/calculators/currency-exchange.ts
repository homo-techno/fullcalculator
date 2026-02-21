import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const currencyExchangeCalculator: CalculatorDefinition = {
  slug: "currency-exchange-calculator",
  title: "Currency Exchange Calculator",
  description:
    "Free currency exchange calculator. Convert between major world currencies using exchange rates and calculate fees for money conversion.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "currency exchange",
    "currency converter",
    "money conversion",
    "exchange rate",
    "forex calculator",
  ],
  variants: [
    {
      id: "convert",
      name: "Convert Currency",
      description: "Convert an amount between two currencies",
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
            { label: "USD - US Dollar", value: "USD" },
            { label: "EUR - Euro", value: "EUR" },
            { label: "GBP - British Pound", value: "GBP" },
            { label: "JPY - Japanese Yen", value: "JPY" },
            { label: "CAD - Canadian Dollar", value: "CAD" },
            { label: "AUD - Australian Dollar", value: "AUD" },
            { label: "CHF - Swiss Franc", value: "CHF" },
            { label: "CNY - Chinese Yuan", value: "CNY" },
            { label: "MXN - Mexican Peso", value: "MXN" },
            { label: "INR - Indian Rupee", value: "INR" },
            { label: "BRL - Brazilian Real", value: "BRL" },
            { label: "THB - Thai Baht", value: "THB" },
          ],
          defaultValue: "USD",
        },
        {
          name: "toCurrency",
          label: "To Currency",
          type: "select",
          options: [
            { label: "USD - US Dollar", value: "USD" },
            { label: "EUR - Euro", value: "EUR" },
            { label: "GBP - British Pound", value: "GBP" },
            { label: "JPY - Japanese Yen", value: "JPY" },
            { label: "CAD - Canadian Dollar", value: "CAD" },
            { label: "AUD - Australian Dollar", value: "AUD" },
            { label: "CHF - Swiss Franc", value: "CHF" },
            { label: "CNY - Chinese Yuan", value: "CNY" },
            { label: "MXN - Mexican Peso", value: "MXN" },
            { label: "INR - Indian Rupee", value: "INR" },
            { label: "BRL - Brazilian Real", value: "BRL" },
            { label: "THB - Thai Baht", value: "THB" },
          ],
          defaultValue: "EUR",
        },
        {
          name: "exchangeRate",
          label: "Exchange Rate (From -> To)",
          type: "number",
          placeholder: "e.g. 0.92",
          step: 0.0001,
        },
        {
          name: "feePercent",
          label: "Exchange Fee (%)",
          type: "number",
          placeholder: "e.g. 2.5",
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const fromCurrency = inputs.fromCurrency as string;
        const toCurrency = inputs.toCurrency as string;
        const exchangeRate = inputs.exchangeRate as number;
        const feePercent = (inputs.feePercent as number) || 0;
        if (!amount || !exchangeRate || amount <= 0 || exchangeRate <= 0) return null;

        const convertedAmount = amount * exchangeRate;
        const feeAmount = convertedAmount * (feePercent / 100);
        const finalAmount = convertedAmount - feeAmount;
        const effectiveRate = finalAmount / amount;
        const inverseRate = 1 / exchangeRate;

        return {
          primary: {
            label: "Converted Amount",
            value: `${formatNumber(finalAmount, 2)} ${toCurrency}`,
          },
          details: [
            { label: "Original amount", value: `${formatNumber(amount, 2)} ${fromCurrency}` },
            { label: "Exchange rate", value: `1 ${fromCurrency} = ${formatNumber(exchangeRate, 4)} ${toCurrency}` },
            { label: "Before fees", value: `${formatNumber(convertedAmount, 2)} ${toCurrency}` },
            { label: "Fee amount", value: `${formatNumber(feeAmount, 2)} ${toCurrency} (${formatNumber(feePercent, 1)}%)` },
            { label: "After fees", value: `${formatNumber(finalAmount, 2)} ${toCurrency}` },
            { label: "Effective rate", value: `1 ${fromCurrency} = ${formatNumber(effectiveRate, 4)} ${toCurrency}` },
            { label: "Inverse rate", value: `1 ${toCurrency} = ${formatNumber(inverseRate, 4)} ${fromCurrency}` },
          ],
          note: feePercent > 0
            ? `The ${formatNumber(feePercent, 1)}% exchange fee costs you ${formatNumber(feeAmount, 2)} ${toCurrency}. Banks typically charge 1-3%, airports 7-15%.`
            : "No exchange fee applied. Enter a fee percentage to see the real cost of exchanging currency.",
        };
      },
    },
    {
      id: "compare",
      name: "Compare Exchange Services",
      description: "Compare costs across different exchange methods",
      fields: [
        {
          name: "amount",
          label: "Amount to Exchange",
          type: "number",
          placeholder: "e.g. 1000",
        },
        {
          name: "midMarketRate",
          label: "Mid-Market Exchange Rate",
          type: "number",
          placeholder: "e.g. 0.92",
          step: 0.0001,
        },
        {
          name: "method",
          label: "Exchange Method",
          type: "select",
          options: [
            { label: "Bank (1.5% fee)", value: "1.5" },
            { label: "Credit Card (2-3% fee)", value: "2.5" },
            { label: "Airport Kiosk (8-12% fee)", value: "10" },
            { label: "ATM Abroad (3-5% fee)", value: "4" },
            { label: "Online Service (0.5-1% fee)", value: "0.75" },
            { label: "Hotel Exchange (5-10% fee)", value: "7.5" },
          ],
          defaultValue: "2.5",
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const rate = inputs.midMarketRate as number;
        const feeStr = inputs.method as string;
        const fee = parseFloat(feeStr) || 0;
        if (!amount || !rate || amount <= 0 || rate <= 0) return null;

        const perfect = amount * rate;
        const actual = perfect * (1 - fee / 100);
        const lost = perfect - actual;

        const methods = [
          { name: "Online Service", fee: 0.75 },
          { name: "Bank", fee: 1.5 },
          { name: "Credit Card", fee: 2.5 },
          { name: "ATM Abroad", fee: 4 },
          { name: "Hotel", fee: 7.5 },
          { name: "Airport Kiosk", fee: 10 },
        ];

        const details = methods.map((m) => ({
          label: `${m.name} (${m.fee}%)`,
          value: `${formatNumber(perfect * (1 - m.fee / 100), 2)} (lose ${formatNumber(perfect * m.fee / 100, 2)})`,
        }));

        return {
          primary: {
            label: "You Receive",
            value: `${formatNumber(actual, 2)}`,
          },
          details: [
            { label: "Mid-market value", value: `${formatNumber(perfect, 2)}` },
            { label: "Fee cost", value: `${formatNumber(lost, 2)} (${formatNumber(fee, 1)}%)` },
            ...details,
          ],
          note: `You lose ${formatNumber(lost, 2)} to fees. Using the cheapest method (online service) would save you ${formatNumber(lost - perfect * 0.0075, 2)} compared to your selected method.`,
        };
      },
    },
  ],
  relatedSlugs: ["tip-abroad-calculator", "travel-budget-calculator"],
  faq: [
    {
      question: "Where can I get the best exchange rate?",
      answer:
        "Online services like Wise (TransferWise) and Revolut typically offer rates closest to the mid-market rate with fees of 0.5-1%. Banks charge 1-3%, ATMs abroad 3-5%, and airport kiosks charge 8-15%. Avoid exchanging at airports or hotels whenever possible.",
    },
    {
      question: "What is the mid-market exchange rate?",
      answer:
        "The mid-market rate (also called interbank rate) is the midpoint between the buy and sell prices of two currencies on the global market. It's the 'real' exchange rate before any markup. You can find it on Google, XE.com, or financial news sites.",
    },
    {
      question: "Should I exchange money before or during my trip?",
      answer:
        "For most destinations, using an ATM abroad or a no-foreign-transaction-fee credit card gives the best rates. Exchange a small amount before departure for immediate expenses. Avoid exchanging large amounts at airports, which have the worst rates.",
    },
  ],
  formula:
    "Converted Amount = Original Amount x Exchange Rate x (1 - Fee%/100); Effective Rate = Final Amount / Original Amount.",
};
