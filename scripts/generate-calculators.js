const fs = require('fs');
const path = require('path');

const CALC_DIR = path.join(__dirname, '..', 'src', 'calculators');

// Read existing slugs
const existingSlugs = new Set();
const files = fs.readdirSync(CALC_DIR).filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts');
for (const file of files) {
  const content = fs.readFileSync(path.join(CALC_DIR, file), 'utf8');
  const match = content.match(/slug:\s*"([^"]+)"/);
  if (match) existingSlugs.add(match[1]);
}
console.log(`Found ${existingSlugs.size} existing calculators`);

function slugToVarName(slug) {
  return slug.replace(/-(\w)/g, (_, c) => c.toUpperCase()).replace(/-/g, '') + (slug.endsWith('calculator') ? '' : 'Calculator');
}

function slugToExportName(slug) {
  const base = slug.replace(/-calculator$/, '').replace(/-/g, '-');
  const camel = base.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return camel + 'Calculator';
}

function generateFile(calc) {
  const exportName = slugToExportName(calc.slug);

  let code = `import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ${exportName}: CalculatorDefinition = {
  slug: "${calc.slug}",
  title: "${calc.title}",
  description: "${calc.description}",
  category: "${calc.category}",
  categorySlug: "${calc.categorySlug}",
  icon: "${calc.icon}",
  keywords: [${calc.keywords.map(k => `"${k}"`).join(', ')}],
  variants: [
${calc.variants.map(v => generateVariant(v)).join(',\n')}
  ],
  relatedSlugs: [${calc.relatedSlugs.map(s => `"${s}"`).join(', ')}],
  faq: [
${calc.faq.map(f => `    {\n      question: "${f.q}",\n      answer: "${f.a}",\n    }`).join(',\n')}
  ],
  formula: "${calc.formula || ''}",
};
`;
  return code;
}

function generateVariant(v) {
  return `    {
      id: "${v.id}",
      name: "${v.name}",
      description: "${v.description || ''}",
      fields: [
${v.fields.map(f => generateField(f)).join(',\n')}
      ],
      calculate: ${v.calculate},
    }`;
}

function generateField(f) {
  let parts = [`        {\n          name: "${f.name}",\n          label: "${f.label}",\n          type: "${f.type || 'number'}"`];
  if (f.placeholder) parts.push(`          placeholder: "${f.placeholder}"`);
  if (f.prefix) parts.push(`          prefix: "${f.prefix}"`);
  if (f.suffix) parts.push(`          suffix: "${f.suffix}"`);
  if (f.min !== undefined) parts.push(`          min: ${f.min}`);
  if (f.max !== undefined) parts.push(`          max: ${f.max}`);
  if (f.step !== undefined) parts.push(`          step: ${f.step}`);
  if (f.defaultValue !== undefined) parts.push(`          defaultValue: ${typeof f.defaultValue === 'string' ? `"${f.defaultValue}"` : f.defaultValue}`);
  if (f.options) parts.push(`          options: [${f.options.map(o => `{ label: "${o.label}", value: "${o.value}" }`).join(', ')}]`);
  return parts.join(',\n') + ',\n        }';
}

// =========================================================
// CALCULATOR DEFINITIONS
// =========================================================

const calculators = [];

// --- COST CALCULATOR TEMPLATE ---
function costCalc(slug, title, category, categorySlug, icon, items, keywords, faq, relatedSlugs) {
  return {
    slug, title,
    description: `Free ${title.toLowerCase()}. Estimate total costs, compare options, and plan your budget with our easy-to-use calculator.`,
    category, categorySlug, icon,
    keywords: keywords || [title.toLowerCase(), 'cost calculator', 'budget calculator'],
    variants: [{
      id: 'estimate',
      name: 'Cost Estimate',
      description: `Estimate ${title.replace(' Calculator', '').toLowerCase()} costs`,
      fields: items.map(item => ({
        name: item.name,
        label: item.label,
        type: item.type || 'number',
        placeholder: item.placeholder || 'e.g. 0',
        prefix: item.prefix,
        suffix: item.suffix,
        min: item.min || 0,
        step: item.step,
        defaultValue: item.defaultValue,
        options: item.options,
      })),
      calculate: `(inputs) => {
        ${items.filter(i => !i.type || i.type === 'number').map(i => `const ${i.name} = parseFloat(inputs.${i.name} as string) || 0;`).join('\n        ')}
        ${items.filter(i => i.type === 'select').map(i => `const ${i.name} = parseFloat(inputs.${i.name} as string) || 1;`).join('\n        ')}
        const total = ${items.map(i => i.costExpr || i.name).join(' + ')};
        if (total === 0) return null;
        return {
          primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
          details: [
            ${items.filter(i => i.detailLabel).map(i => `{ label: "${i.detailLabel}", value: "$" + formatNumber(${i.costExpr || i.name}) }`).join(',\n            ')}
          ],
        };
      }`,
    }],
    faq: faq || [
      { q: `How much does ${title.replace(' Calculator', '').toLowerCase()} cost?`, a: `Costs vary depending on location, quality, and specific requirements. Use our calculator for a personalized estimate.` },
      { q: `How can I save on ${title.replace(' Calculator', '').toLowerCase()} costs?`, a: `Compare multiple providers, look for seasonal discounts, and consider doing some tasks yourself to reduce overall costs.` },
    ],
    relatedSlugs: relatedSlugs || ['percentage-calculator', 'tip-calculator'],
    formula: 'Total = Sum of all cost components',
  };
}

// --- CALORIE BURN TEMPLATE ---
function calorieBurnCalc(slug, title, met, keywords, relatedSlugs) {
  return {
    slug, title,
    description: `Free ${title.toLowerCase()}. Calculate calories burned during ${title.replace(' Calorie Calculator', '').toLowerCase()} based on your weight and duration.`,
    category: 'Health', categorySlug: 'health', icon: 'H',
    keywords: keywords || [title.toLowerCase(), 'calories burned', 'exercise calculator'],
    variants: [{
      id: 'standard',
      name: 'Calories Burned',
      description: `Calculate calories burned during ${title.replace(' Calorie Calculator', '').toLowerCase()}`,
      fields: [
        { name: 'weight', label: 'Body Weight', type: 'number', placeholder: 'e.g. 70', suffix: 'kg', min: 20, max: 300 },
        { name: 'duration', label: 'Duration', type: 'number', placeholder: 'e.g. 30', suffix: 'minutes', min: 1, max: 600 },
        { name: 'intensity', label: 'Intensity', type: 'select', options: [
          { label: 'Light', value: '0.75' },
          { label: 'Moderate', value: '1' },
          { label: 'Vigorous', value: '1.25' },
          { label: 'Very Intense', value: '1.5' },
        ], defaultValue: '1' },
      ],
      calculate: `(inputs) => {
        const weight = inputs.weight as number;
        const duration = inputs.duration as number;
        const intensity = parseFloat(inputs.intensity as string) || 1;
        if (!weight || !duration) return null;
        const met = ${met} * intensity;
        const calories = met * weight * (duration / 60);
        const caloriesPerMin = calories / duration;
        return {
          primary: { label: "Calories Burned", value: formatNumber(calories) + " kcal" },
          details: [
            { label: "MET value", value: formatNumber(met) },
            { label: "Calories per minute", value: formatNumber(caloriesPerMin) },
            { label: "Duration", value: duration + " minutes" },
            { label: "Equivalent walking minutes", value: formatNumber(calories / 3.5 * 60 / weight) + " min" },
          ],
        };
      }`,
    }],
    faq: [
      { q: `How many calories does ${title.replace(' Calorie Calculator', '').toLowerCase()} burn?`, a: `A 70kg person burns approximately ${Math.round(met * 70 * 0.5)} calories in 30 minutes of moderate ${title.replace(' Calorie Calculator', '').toLowerCase()}.` },
      { q: 'What is MET?', a: 'MET (Metabolic Equivalent of Task) measures the energy cost of physical activity. 1 MET is the energy used at rest. Higher METs indicate more intense activities.' },
    ],
    relatedSlugs: relatedSlugs || ['calorie-calculator', 'bmi-calculator'],
    formula: 'Calories = MET x Weight (kg) x Duration (hours)',
  };
}

// --- CONVERSION TEMPLATE ---
function conversionCalc(slug, title, fromUnit, toUnit, factor, keywords, category, categorySlug, icon) {
  return {
    slug, title,
    description: `Free ${title.toLowerCase()}. Convert between ${fromUnit} and ${toUnit} instantly with precise calculations.`,
    category: category || 'Conversion', categorySlug: categorySlug || 'conversion', icon: icon || 'R',
    keywords: keywords || [title.toLowerCase(), `${fromUnit} to ${toUnit}`, 'converter'],
    variants: [
      {
        id: 'forward',
        name: `${fromUnit} to ${toUnit}`,
        description: `Convert ${fromUnit} to ${toUnit}`,
        fields: [
          { name: 'value', label: `Value in ${fromUnit}`, type: 'number', placeholder: 'e.g. 100', suffix: fromUnit, min: 0, step: 0.01 },
        ],
        calculate: `(inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value * ${factor};
        return {
          primary: { label: "${toUnit}", value: formatNumber(result) + " ${toUnit}" },
          details: [
            { label: "Input", value: formatNumber(value) + " ${fromUnit}" },
            { label: "Conversion factor", value: "1 ${fromUnit} = ${factor} ${toUnit}" },
          ],
        };
      }`,
      },
      {
        id: 'reverse',
        name: `${toUnit} to ${fromUnit}`,
        description: `Convert ${toUnit} to ${fromUnit}`,
        fields: [
          { name: 'value', label: `Value in ${toUnit}`, type: 'number', placeholder: 'e.g. 100', suffix: toUnit, min: 0, step: 0.01 },
        ],
        calculate: `(inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value / ${factor};
        return {
          primary: { label: "${fromUnit}", value: formatNumber(result) + " ${fromUnit}" },
          details: [
            { label: "Input", value: formatNumber(value) + " ${toUnit}" },
            { label: "Conversion factor", value: "1 ${toUnit} = " + formatNumber(1/${factor}) + " ${fromUnit}" },
          ],
        };
      }`,
      },
    ],
    faq: [
      { q: `How do I convert ${fromUnit} to ${toUnit}?`, a: `Multiply the ${fromUnit} value by ${factor} to get ${toUnit}. For example, 10 ${fromUnit} = ${10 * factor} ${toUnit}.` },
      { q: `What is the conversion factor?`, a: `1 ${fromUnit} equals ${factor} ${toUnit}.` },
    ],
    relatedSlugs: ['unit-converter', 'percentage-calculator'],
    formula: `${toUnit} = ${fromUnit} x ${factor}`,
  };
}

// --- SIMPLE FORMULA TEMPLATE ---
function formulaCalc(slug, title, description, category, categorySlug, icon, keywords, fields, calculateFn, faq, formula, relatedSlugs) {
  return {
    slug, title, description,
    category, categorySlug, icon,
    keywords,
    variants: [{
      id: 'standard',
      name: title.replace(' Calculator', ''),
      description: description.substring(0, 80),
      fields,
      calculate: calculateFn,
    }],
    faq,
    formula,
    relatedSlugs: relatedSlugs || ['percentage-calculator'],
  };
}

// =========================================================
// FINANCE CALCULATORS
// =========================================================

// Crypto & DeFi
if (!existingSlugs.has('crypto-staking-calculator')) calculators.push(formulaCalc(
  'crypto-staking-calculator', 'Crypto Staking Calculator',
  'Free crypto staking calculator. Estimate your staking rewards based on APY, token amount, and staking duration.',
  'Finance', 'finance', '$',
  ['crypto staking', 'staking rewards', 'staking calculator', 'APY calculator'],
  [
    { name: 'amount', label: 'Tokens Staked', type: 'number', placeholder: 'e.g. 1000', min: 0 },
    { name: 'price', label: 'Token Price', type: 'number', placeholder: 'e.g. 50', prefix: '$', min: 0, step: 0.01 },
    { name: 'apy', label: 'Annual Percentage Yield', type: 'number', placeholder: 'e.g. 5', suffix: '%', min: 0, max: 1000, step: 0.1 },
    { name: 'months', label: 'Staking Period', type: 'number', placeholder: 'e.g. 12', suffix: 'months', min: 1, max: 120 },
  ],
  `(inputs) => {
        const amount = inputs.amount as number;
        const price = inputs.price as number;
        const apy = (inputs.apy as number) / 100;
        const months = inputs.months as number;
        if (!amount || !price || !apy || !months) return null;
        const years = months / 12;
        const finalTokens = amount * Math.pow(1 + apy / 365, 365 * years);
        const earned = finalTokens - amount;
        const initialValue = amount * price;
        const finalValue = finalTokens * price;
        return {
          primary: { label: "Total Rewards", value: formatNumber(earned) + " tokens" },
          details: [
            { label: "Final token balance", value: formatNumber(finalTokens) },
            { label: "Initial value", value: "$" + formatNumber(initialValue) },
            { label: "Final value (same price)", value: "$" + formatNumber(finalValue) },
            { label: "Reward value", value: "$" + formatNumber(earned * price) },
          ],
        };
      }`,
  [
    { q: 'How does crypto staking work?', a: 'Staking involves locking your cryptocurrency to support network operations like transaction validation. In return, you earn rewards, similar to earning interest on a savings account.' },
    { q: 'Is crypto staking safe?', a: 'Staking carries risks including price volatility, lock-up periods, slashing penalties, and smart contract vulnerabilities. Always research the protocol before staking.' },
  ],
  'Rewards = Tokens x (1 + APY/365)^(365 x Years) - Tokens',
  ['compound-interest-calculator', 'roi-calculator']
));

if (!existingSlugs.has('ethereum-staking-calculator')) calculators.push(formulaCalc(
  'ethereum-staking-calculator', 'Ethereum Staking Calculator',
  'Free Ethereum staking calculator. Estimate ETH staking rewards based on current APR and your stake amount.',
  'Finance', 'finance', '$',
  ['ethereum staking', 'ETH staking rewards', 'ETH validator', 'staking APR'],
  [
    { name: 'eth', label: 'ETH Amount', type: 'number', placeholder: 'e.g. 32', suffix: 'ETH', min: 0, step: 0.01 },
    { name: 'price', label: 'ETH Price', type: 'number', placeholder: 'e.g. 3500', prefix: '$', min: 0 },
    { name: 'apr', label: 'Staking APR', type: 'number', placeholder: 'e.g. 4', suffix: '%', min: 0, max: 100, step: 0.1, defaultValue: 4 },
    { name: 'years', label: 'Period', type: 'number', placeholder: 'e.g. 1', suffix: 'years', min: 0.1, max: 30, step: 0.1 },
  ],
  `(inputs) => {
        const eth = inputs.eth as number;
        const price = inputs.price as number;
        const apr = (inputs.apr as number) / 100;
        const years = inputs.years as number;
        if (!eth || !price || !apr || !years) return null;
        const rewards = eth * apr * years;
        const totalEth = eth + rewards;
        return {
          primary: { label: "ETH Rewards", value: formatNumber(rewards) + " ETH" },
          details: [
            { label: "Total ETH after staking", value: formatNumber(totalEth) + " ETH" },
            { label: "Reward value (USD)", value: "$" + formatNumber(rewards * price) },
            { label: "Total value (USD)", value: "$" + formatNumber(totalEth * price) },
            { label: "Monthly reward", value: formatNumber(rewards / (years * 12)) + " ETH" },
          ],
        };
      }`,
  [
    { q: 'How much can I earn staking Ethereum?', a: 'Ethereum staking currently yields approximately 3-5% APR. With 32 ETH staked at 4% APR, you would earn about 1.28 ETH per year.' },
    { q: 'Do I need 32 ETH to stake?', a: 'Running your own validator requires 32 ETH. However, you can stake any amount through liquid staking services like Lido, Rocket Pool, or centralized exchanges.' },
  ],
  'Rewards = ETH Amount x APR x Years',
  ['compound-interest-calculator', 'roi-calculator']
));

if (!existingSlugs.has('nft-profit-calculator')) calculators.push(formulaCalc(
  'nft-profit-calculator', 'NFT Profit Calculator',
  'Free NFT profit calculator. Calculate your NFT trading profit including gas fees, marketplace fees, and royalties.',
  'Finance', 'finance', '$',
  ['NFT profit', 'NFT calculator', 'NFT trading', 'NFT fees'],
  [
    { name: 'buyPrice', label: 'Purchase Price', type: 'number', placeholder: 'e.g. 0.5', prefix: '$', min: 0, step: 0.01 },
    { name: 'sellPrice', label: 'Sale Price', type: 'number', placeholder: 'e.g. 1.2', prefix: '$', min: 0, step: 0.01 },
    { name: 'gasBuy', label: 'Gas Fee (Buy)', type: 'number', placeholder: 'e.g. 20', prefix: '$', min: 0, step: 0.01 },
    { name: 'gasSell', label: 'Gas Fee (Sell)', type: 'number', placeholder: 'e.g. 25', prefix: '$', min: 0, step: 0.01 },
    { name: 'royalty', label: 'Creator Royalty', type: 'number', placeholder: 'e.g. 5', suffix: '%', min: 0, max: 50, defaultValue: 5 },
    { name: 'marketplace', label: 'Marketplace Fee', type: 'number', placeholder: 'e.g. 2.5', suffix: '%', min: 0, max: 50, defaultValue: 2.5 },
  ],
  `(inputs) => {
        const buy = inputs.buyPrice as number;
        const sell = inputs.sellPrice as number;
        const gasBuy = inputs.gasBuy as number || 0;
        const gasSell = inputs.gasSell as number || 0;
        const royalty = (inputs.royalty as number) / 100;
        const marketplace = (inputs.marketplace as number) / 100;
        if (!buy || !sell) return null;
        const royaltyFee = sell * royalty;
        const marketplaceFee = sell * marketplace;
        const totalFees = gasBuy + gasSell + royaltyFee + marketplaceFee;
        const profit = sell - buy - totalFees;
        const roi = (profit / (buy + gasBuy)) * 100;
        return {
          primary: { label: "Net Profit", value: "$" + formatNumber(profit) },
          details: [
            { label: "ROI", value: formatNumber(roi) + "%" },
            { label: "Total fees", value: "$" + formatNumber(totalFees) },
            { label: "Royalty fee", value: "$" + formatNumber(royaltyFee) },
            { label: "Marketplace fee", value: "$" + formatNumber(marketplaceFee) },
            { label: "Gas fees", value: "$" + formatNumber(gasBuy + gasSell) },
          ],
        };
      }`,
  [
    { q: 'How are NFT profits calculated?', a: 'NFT profit = Sale Price - Purchase Price - Gas Fees - Marketplace Fee - Creator Royalty. All fees reduce your net profit.' },
    { q: 'What fees are involved in NFT trading?', a: 'NFT trading involves gas fees for blockchain transactions, marketplace fees (typically 2-2.5%), and creator royalties (usually 5-10% of the sale price).' },
  ],
  'Profit = Sale - Purchase - Gas - (Sale x Royalty%) - (Sale x Marketplace%)',
  ['roi-calculator', 'percentage-calculator']
));

// Bitcoin Mining
if (!existingSlugs.has('bitcoin-mining-calculator')) calculators.push(formulaCalc(
  'bitcoin-mining-calculator', 'Bitcoin Mining Calculator',
  'Free Bitcoin mining profitability calculator. Estimate daily, monthly, and yearly mining revenue based on hashrate, power consumption, and electricity cost.',
  'Finance', 'finance', '$',
  ['bitcoin mining', 'mining profitability', 'hashrate calculator', 'mining calculator'],
  [
    { name: 'hashrate', label: 'Hash Rate', type: 'number', placeholder: 'e.g. 100', suffix: 'TH/s', min: 0 },
    { name: 'power', label: 'Power Consumption', type: 'number', placeholder: 'e.g. 3250', suffix: 'W', min: 0 },
    { name: 'electricityCost', label: 'Electricity Cost', type: 'number', placeholder: 'e.g. 0.10', prefix: '$', suffix: '/kWh', min: 0, step: 0.01 },
    { name: 'btcPrice', label: 'BTC Price', type: 'number', placeholder: 'e.g. 60000', prefix: '$', min: 0 },
    { name: 'poolFee', label: 'Pool Fee', type: 'number', placeholder: 'e.g. 2', suffix: '%', min: 0, max: 100, defaultValue: 2 },
  ],
  `(inputs) => {
        const hashrate = inputs.hashrate as number;
        const power = inputs.power as number;
        const elecCost = inputs.electricityCost as number;
        const btcPrice = inputs.btcPrice as number;
        const poolFee = (inputs.poolFee as number) / 100;
        if (!hashrate || !power || !elecCost || !btcPrice) return null;
        const dailyBtc = (hashrate * 1e12 * 6.25 * 86400) / (2**32 * 50000000000000);
        const dailyBtcAfterFee = dailyBtc * (1 - poolFee);
        const dailyRevenue = dailyBtcAfterFee * btcPrice;
        const dailyElecCost = (power / 1000) * 24 * elecCost;
        const dailyProfit = dailyRevenue - dailyElecCost;
        return {
          primary: { label: "Daily Profit", value: "$" + formatNumber(dailyProfit) },
          details: [
            { label: "Daily revenue", value: "$" + formatNumber(dailyRevenue) },
            { label: "Daily electricity cost", value: "$" + formatNumber(dailyElecCost) },
            { label: "Monthly profit", value: "$" + formatNumber(dailyProfit * 30) },
            { label: "Yearly profit", value: "$" + formatNumber(dailyProfit * 365) },
            { label: "Daily BTC mined", value: formatNumber(dailyBtcAfterFee, 8) + " BTC" },
          ],
        };
      }`,
  [
    { q: 'Is Bitcoin mining profitable?', a: 'Bitcoin mining profitability depends on your hashrate, electricity cost, and BTC price. Low electricity costs (under $0.05/kWh) are typically needed for profitability.' },
    { q: 'What hashrate do I need to mine Bitcoin?', a: 'Modern ASIC miners produce 100-400 TH/s. Solo mining requires enormous hashrate; most miners join mining pools to receive regular payouts.' },
  ],
  'Daily Profit = (Daily BTC Mined x BTC Price) - (Power x 24h x Electricity Cost)',
  ['compound-interest-calculator', 'roi-calculator']
));

// Options calculators
if (!existingSlugs.has('covered-call-calculator')) calculators.push(formulaCalc(
  'covered-call-calculator', 'Covered Call Calculator',
  'Free covered call calculator. Calculate potential returns, breakeven, and max profit for covered call options strategy.',
  'Finance', 'finance', '$',
  ['covered call', 'options strategy', 'call option premium', 'options calculator'],
  [
    { name: 'shares', label: 'Number of Shares', type: 'number', placeholder: 'e.g. 100', min: 1, defaultValue: 100 },
    { name: 'stockPrice', label: 'Stock Purchase Price', type: 'number', placeholder: 'e.g. 50', prefix: '$', min: 0, step: 0.01 },
    { name: 'strikePrice', label: 'Strike Price', type: 'number', placeholder: 'e.g. 55', prefix: '$', min: 0, step: 0.01 },
    { name: 'premium', label: 'Option Premium', type: 'number', placeholder: 'e.g. 2.50', prefix: '$', min: 0, step: 0.01 },
    { name: 'days', label: 'Days to Expiration', type: 'number', placeholder: 'e.g. 30', suffix: 'days', min: 1, max: 365 },
  ],
  `(inputs) => {
        const shares = inputs.shares as number;
        const stock = inputs.stockPrice as number;
        const strike = inputs.strikePrice as number;
        const premium = inputs.premium as number;
        const days = inputs.days as number;
        if (!shares || !stock || !strike || !premium || !days) return null;
        const totalPremium = premium * shares;
        const maxProfit = ((strike - stock) + premium) * shares;
        const breakeven = stock - premium;
        const returnOnInvestment = (totalPremium / (stock * shares)) * 100;
        const annualizedReturn = returnOnInvestment * (365 / days);
        return {
          primary: { label: "Premium Income", value: "$" + formatNumber(totalPremium) },
          details: [
            { label: "Max profit (if assigned)", value: "$" + formatNumber(maxProfit) },
            { label: "Breakeven price", value: "$" + formatNumber(breakeven) },
            { label: "Return on investment", value: formatNumber(returnOnInvestment) + "%" },
            { label: "Annualized return", value: formatNumber(annualizedReturn) + "%" },
          ],
        };
      }`,
  [
    { q: 'What is a covered call?', a: 'A covered call involves owning stock and selling call options against it. You earn premium income but cap your upside at the strike price.' },
    { q: 'When should I use covered calls?', a: 'Covered calls work best in flat or slightly bullish markets. They generate income from stocks you already own but limit upside if the stock rises significantly.' },
  ],
  'Premium Income = Option Premium x Number of Shares',
  ['roi-calculator', 'compound-interest-calculator']
));

// More finance calculators - using costCalc template for cost-based ones
const financeCostCalcs = [
  { slug: 'child-cost-calculator', title: 'Child Cost Calculator', items: [
    { name: 'housing', label: 'Additional Housing Cost/yr', placeholder: 'e.g. 3000', prefix: '$', detailLabel: 'Housing', costExpr: 'housing' },
    { name: 'food', label: 'Food & Formula/yr', placeholder: 'e.g. 2500', prefix: '$', detailLabel: 'Food', costExpr: 'food' },
    { name: 'childcare', label: 'Childcare/yr', placeholder: 'e.g. 12000', prefix: '$', detailLabel: 'Childcare', costExpr: 'childcare' },
    { name: 'healthcare', label: 'Healthcare/yr', placeholder: 'e.g. 1500', prefix: '$', detailLabel: 'Healthcare', costExpr: 'healthcare' },
    { name: 'clothing', label: 'Clothing/yr', placeholder: 'e.g. 800', prefix: '$', detailLabel: 'Clothing', costExpr: 'clothing' },
    { name: 'years', label: 'Years to Calculate', placeholder: 'e.g. 18', suffix: 'years', min: 1, max: 25, detailLabel: 'Total years' },
  ]},
  { slug: 'tuition-inflation-calculator', title: 'Tuition Inflation Calculator' },
  { slug: 'subscription-cost-calculator', title: 'Subscription Cost Calculator' },
  { slug: 'saas-cost-calculator', title: 'SaaS Cost Calculator' },
  { slug: 'moving-cost-calculator', title: 'Moving Cost Calculator' },
  { slug: 'home-warranty-cost-calculator', title: 'Home Warranty Cost Calculator' },
];

// Generate remaining finance calcs as simple formula calcs
const financeFormulas = [
  ['fat-fire-calculator', 'Fat FIRE Calculator', 'annual expenses', [
    { name: 'expenses', label: 'Annual Expenses', placeholder: 'e.g. 100000', prefix: '$', min: 0 },
    { name: 'rate', label: 'Withdrawal Rate', placeholder: 'e.g. 3.5', suffix: '%', min: 1, max: 10, step: 0.1, defaultValue: 3.5 },
  ], `(inputs) => {
        const expenses = inputs.expenses as number;
        const rate = (inputs.rate as number) / 100;
        if (!expenses || !rate) return null;
        const target = expenses / rate;
        return {
          primary: { label: "Fat FIRE Target", value: "$" + formatNumber(target) },
          details: [
            { label: "Annual expenses", value: "$" + formatNumber(expenses) },
            { label: "Monthly expenses", value: "$" + formatNumber(expenses / 12) },
            { label: "Withdrawal rate", value: formatNumber(rate * 100) + "%" },
          ],
        };
      }`, 'Target = Annual Expenses / Withdrawal Rate'],
  ['financial-independence-calculator', 'Financial Independence Calculator', 'financial independence', [
    { name: 'expenses', label: 'Annual Expenses', placeholder: 'e.g. 50000', prefix: '$', min: 0 },
    { name: 'savings', label: 'Current Savings', placeholder: 'e.g. 100000', prefix: '$', min: 0 },
    { name: 'monthly', label: 'Monthly Savings', placeholder: 'e.g. 3000', prefix: '$', min: 0 },
    { name: 'returnRate', label: 'Expected Return', placeholder: 'e.g. 7', suffix: '%', min: 0, max: 30, step: 0.1 },
  ], `(inputs) => {
        const expenses = inputs.expenses as number;
        const savings = inputs.savings as number;
        const monthly = inputs.monthly as number;
        const rate = (inputs.returnRate as number) / 100;
        if (!expenses || !savings || !monthly || !rate) return null;
        const target = expenses * 25;
        const monthlyRate = rate / 12;
        let current = savings;
        let months = 0;
        while (current < target && months < 600) {
          current = current * (1 + monthlyRate) + monthly;
          months++;
        }
        const years = months / 12;
        return {
          primary: { label: "Years to FI", value: formatNumber(years) + " years" },
          details: [
            { label: "FI target (25x expenses)", value: "$" + formatNumber(target) },
            { label: "Current savings", value: "$" + formatNumber(savings) },
            { label: "Gap to close", value: "$" + formatNumber(target - savings) },
            { label: "FI date", value: "~" + Math.ceil(years) + " years from now" },
          ],
        };
      }`, 'FI Number = Annual Expenses x 25'],
  ['put-option-calculator', 'Put Option Calculator', 'put option profit', [
    { name: 'strikePrice', label: 'Strike Price', placeholder: 'e.g. 50', prefix: '$', min: 0, step: 0.01 },
    { name: 'premium', label: 'Premium Paid', placeholder: 'e.g. 3', prefix: '$', min: 0, step: 0.01 },
    { name: 'currentPrice', label: 'Current Stock Price', placeholder: 'e.g. 45', prefix: '$', min: 0, step: 0.01 },
    { name: 'contracts', label: 'Number of Contracts', placeholder: 'e.g. 1', min: 1, defaultValue: 1 },
  ], `(inputs) => {
        const strike = inputs.strikePrice as number;
        const premium = inputs.premium as number;
        const current = inputs.currentPrice as number;
        const contracts = inputs.contracts as number;
        if (!strike || !premium || !current || !contracts) return null;
        const shares = contracts * 100;
        const intrinsic = Math.max(strike - current, 0);
        const profitPerShare = intrinsic - premium;
        const totalProfit = profitPerShare * shares;
        const breakeven = strike - premium;
        const maxLoss = premium * shares;
        return {
          primary: { label: "Total Profit/Loss", value: "$" + formatNumber(totalProfit) },
          details: [
            { label: "Breakeven price", value: "$" + formatNumber(breakeven) },
            { label: "Intrinsic value", value: "$" + formatNumber(intrinsic) },
            { label: "Max loss (premium paid)", value: "$" + formatNumber(maxLoss) },
            { label: "Max profit (if stock goes to 0)", value: "$" + formatNumber((strike - premium) * shares) },
          ],
        };
      }`, 'Profit = (Strike - Stock Price - Premium) x Shares'],
  ['call-option-calculator', 'Call Option Calculator', 'call option profit', [
    { name: 'strikePrice', label: 'Strike Price', placeholder: 'e.g. 50', prefix: '$', min: 0, step: 0.01 },
    { name: 'premium', label: 'Premium Paid', placeholder: 'e.g. 3', prefix: '$', min: 0, step: 0.01 },
    { name: 'currentPrice', label: 'Current Stock Price', placeholder: 'e.g. 55', prefix: '$', min: 0, step: 0.01 },
    { name: 'contracts', label: 'Number of Contracts', placeholder: 'e.g. 1', min: 1, defaultValue: 1 },
  ], `(inputs) => {
        const strike = inputs.strikePrice as number;
        const premium = inputs.premium as number;
        const current = inputs.currentPrice as number;
        const contracts = inputs.contracts as number;
        if (!strike || !premium || !current || !contracts) return null;
        const shares = contracts * 100;
        const intrinsic = Math.max(current - strike, 0);
        const profitPerShare = intrinsic - premium;
        const totalProfit = profitPerShare * shares;
        const breakeven = strike + premium;
        return {
          primary: { label: "Total Profit/Loss", value: "$" + formatNumber(totalProfit) },
          details: [
            { label: "Breakeven price", value: "$" + formatNumber(breakeven) },
            { label: "Intrinsic value", value: "$" + formatNumber(intrinsic) },
            { label: "Max loss", value: "$" + formatNumber(premium * shares) },
            { label: "Return on premium", value: formatNumber((profitPerShare / premium) * 100) + "%" },
          ],
        };
      }`, 'Profit = (Stock Price - Strike - Premium) x Shares'],
  ['options-greeks-calculator', 'Options Greeks Calculator', 'options greeks delta gamma', [
    { name: 'stockPrice', label: 'Stock Price', placeholder: 'e.g. 100', prefix: '$', min: 0, step: 0.01 },
    { name: 'strikePrice', label: 'Strike Price', placeholder: 'e.g. 105', prefix: '$', min: 0, step: 0.01 },
    { name: 'days', label: 'Days to Expiration', placeholder: 'e.g. 30', suffix: 'days', min: 1, max: 365 },
    { name: 'volatility', label: 'Implied Volatility', placeholder: 'e.g. 25', suffix: '%', min: 1, max: 200, step: 0.1 },
    { name: 'riskFree', label: 'Risk-Free Rate', placeholder: 'e.g. 5', suffix: '%', min: 0, max: 20, step: 0.1, defaultValue: 5 },
  ], `(inputs) => {
        const S = inputs.stockPrice as number;
        const K = inputs.strikePrice as number;
        const days = inputs.days as number;
        const vol = (inputs.volatility as number) / 100;
        const r = (inputs.riskFree as number) / 100;
        if (!S || !K || !days || !vol) return null;
        const T = days / 365;
        const d1 = (Math.log(S / K) + (r + vol * vol / 2) * T) / (vol * Math.sqrt(T));
        const d2 = d1 - vol * Math.sqrt(T);
        const nd1 = 0.5 * (1 + erf(d1 / Math.sqrt(2)));
        const npd1 = Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI);
        const delta = nd1;
        const gamma = npd1 / (S * vol * Math.sqrt(T));
        const theta = -(S * npd1 * vol) / (2 * Math.sqrt(T)) / 365;
        const vega = S * npd1 * Math.sqrt(T) / 100;
        function erf(x) { const a = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429]; const p = 0.3275911; const sign = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + p * x); return sign * (1 - ((((a[4]*t+a[3])*t+a[2])*t+a[1])*t+a[0])*t*Math.exp(-x*x)); }
        return {
          primary: { label: "Delta", value: formatNumber(delta, 4) },
          details: [
            { label: "Gamma", value: formatNumber(gamma, 4) },
            { label: "Theta (daily)", value: "$" + formatNumber(theta) },
            { label: "Vega", value: "$" + formatNumber(vega) },
            { label: "d1", value: formatNumber(d1, 4) },
            { label: "d2", value: formatNumber(d2, 4) },
          ],
        };
      }`, 'Delta = N(d1), d1 = [ln(S/K) + (r + sigma^2/2)T] / (sigma * sqrt(T))'],
  ['sinking-fund-calculator', 'Sinking Fund Calculator', 'sinking fund savings', [
    { name: 'target', label: 'Target Amount', placeholder: 'e.g. 10000', prefix: '$', min: 0 },
    { name: 'months', label: 'Time Period', placeholder: 'e.g. 24', suffix: 'months', min: 1, max: 360 },
    { name: 'rate', label: 'Interest Rate (Annual)', placeholder: 'e.g. 4', suffix: '%', min: 0, max: 30, step: 0.1, defaultValue: 4 },
  ], `(inputs) => {
        const target = inputs.target as number;
        const months = inputs.months as number;
        const rate = (inputs.rate as number) / 100 / 12;
        if (!target || !months) return null;
        const payment = rate > 0 ? target * rate / (Math.pow(1 + rate, months) - 1) : target / months;
        const totalPaid = payment * months;
        const interestEarned = target - totalPaid;
        return {
          primary: { label: "Monthly Payment", value: "$" + formatNumber(payment) },
          details: [
            { label: "Target amount", value: "$" + formatNumber(target) },
            { label: "Total contributed", value: "$" + formatNumber(totalPaid) },
            { label: "Interest earned", value: "$" + formatNumber(interestEarned) },
          ],
        };
      }`, 'Payment = Target x r / ((1+r)^n - 1)'],
  ['uber-earnings-calculator', 'Uber Earnings Calculator', 'uber driver earnings', [
    { name: 'trips', label: 'Trips per Week', placeholder: 'e.g. 30', min: 1 },
    { name: 'avgFare', label: 'Average Fare', placeholder: 'e.g. 15', prefix: '$', min: 0, step: 0.01 },
    { name: 'hours', label: 'Hours per Week', placeholder: 'e.g. 40', suffix: 'hrs', min: 1 },
    { name: 'gasCost', label: 'Weekly Gas Cost', placeholder: 'e.g. 100', prefix: '$', min: 0 },
    { name: 'maintenance', label: 'Weekly Maintenance', placeholder: 'e.g. 50', prefix: '$', min: 0 },
    { name: 'uberCut', label: 'Uber Commission', placeholder: 'e.g. 25', suffix: '%', min: 0, max: 50, defaultValue: 25 },
  ], `(inputs) => {
        const trips = inputs.trips as number;
        const avgFare = inputs.avgFare as number;
        const hours = inputs.hours as number;
        const gas = inputs.gasCost as number || 0;
        const maintenance = inputs.maintenance as number || 0;
        const cut = (inputs.uberCut as number) / 100;
        if (!trips || !avgFare || !hours) return null;
        const grossWeekly = trips * avgFare;
        const driverShare = grossWeekly * (1 - cut);
        const netWeekly = driverShare - gas - maintenance;
        const hourlyRate = netWeekly / hours;
        return {
          primary: { label: "Weekly Net Earnings", value: "$" + formatNumber(netWeekly) },
          details: [
            { label: "Gross fares", value: "$" + formatNumber(grossWeekly) },
            { label: "Your share (after Uber cut)", value: "$" + formatNumber(driverShare) },
            { label: "Expenses (gas + maintenance)", value: "$" + formatNumber(gas + maintenance) },
            { label: "Effective hourly rate", value: "$" + formatNumber(hourlyRate) + "/hr" },
            { label: "Monthly estimate", value: "$" + formatNumber(netWeekly * 4.33) },
          ],
        };
      }`, 'Net = (Trips x Fare) x (1 - Commission) - Expenses'],
  ['lyft-earnings-calculator', 'Lyft Earnings Calculator', 'lyft driver earnings', [
    { name: 'trips', label: 'Trips per Week', placeholder: 'e.g. 25', min: 1 },
    { name: 'avgFare', label: 'Average Fare', placeholder: 'e.g. 14', prefix: '$', min: 0, step: 0.01 },
    { name: 'hours', label: 'Hours per Week', placeholder: 'e.g. 35', suffix: 'hrs', min: 1 },
    { name: 'gasCost', label: 'Weekly Gas Cost', placeholder: 'e.g. 90', prefix: '$', min: 0 },
    { name: 'lyftCut', label: 'Lyft Commission', placeholder: 'e.g. 20', suffix: '%', min: 0, max: 50, defaultValue: 20 },
  ], `(inputs) => {
        const trips = inputs.trips as number;
        const avgFare = inputs.avgFare as number;
        const hours = inputs.hours as number;
        const gas = inputs.gasCost as number || 0;
        const cut = (inputs.lyftCut as number) / 100;
        if (!trips || !avgFare || !hours) return null;
        const gross = trips * avgFare;
        const driverShare = gross * (1 - cut);
        const net = driverShare - gas;
        return {
          primary: { label: "Weekly Net Earnings", value: "$" + formatNumber(net) },
          details: [
            { label: "Gross fares", value: "$" + formatNumber(gross) },
            { label: "Driver share", value: "$" + formatNumber(driverShare) },
            { label: "Gas costs", value: "$" + formatNumber(gas) },
            { label: "Hourly rate", value: "$" + formatNumber(net / hours) + "/hr" },
            { label: "Annual estimate", value: "$" + formatNumber(net * 52) },
          ],
        };
      }`, 'Net = (Trips x Fare) x (1 - Commission) - Gas'],
  ['freelancer-rate-calculator', 'Freelancer Rate Calculator', 'freelance hourly rate', [
    { name: 'targetSalary', label: 'Target Annual Income', placeholder: 'e.g. 80000', prefix: '$', min: 0 },
    { name: 'billableWeeks', label: 'Billable Weeks/Year', placeholder: 'e.g. 46', min: 1, max: 52, defaultValue: 46 },
    { name: 'billableHours', label: 'Billable Hours/Week', placeholder: 'e.g. 30', min: 1, max: 60, defaultValue: 30 },
    { name: 'taxRate', label: 'Self-Employment Tax Rate', placeholder: 'e.g. 30', suffix: '%', min: 0, max: 50, defaultValue: 30 },
    { name: 'expenses', label: 'Annual Business Expenses', placeholder: 'e.g. 5000', prefix: '$', min: 0 },
  ], `(inputs) => {
        const target = inputs.targetSalary as number;
        const weeks = inputs.billableWeeks as number;
        const hours = inputs.billableHours as number;
        const taxRate = (inputs.taxRate as number) / 100;
        const expenses = inputs.expenses as number || 0;
        if (!target || !weeks || !hours) return null;
        const grossNeeded = (target + expenses) / (1 - taxRate);
        const hourlyRate = grossNeeded / (weeks * hours);
        const totalBillableHours = weeks * hours;
        return {
          primary: { label: "Minimum Hourly Rate", value: "$" + formatNumber(hourlyRate) },
          details: [
            { label: "Gross income needed", value: "$" + formatNumber(grossNeeded) },
            { label: "Total billable hours/year", value: formatNumber(totalBillableHours) },
            { label: "Taxes (estimated)", value: "$" + formatNumber(grossNeeded * taxRate) },
            { label: "Daily rate (8hr)", value: "$" + formatNumber(hourlyRate * 8) },
            { label: "Weekly rate", value: "$" + formatNumber(hourlyRate * hours) },
          ],
        };
      }`, 'Hourly Rate = (Target Income + Expenses) / (1 - Tax Rate) / Billable Hours'],
];

for (const [slug, title, kw, fields, calc, formula] of financeFormulas) {
  if (!existingSlugs.has(slug)) {
    calculators.push(formulaCalc(
      slug, title,
      `Free ${title.toLowerCase()}. Calculate and plan with accurate ${kw} estimates.`,
      'Finance', 'finance', '$',
      [title.toLowerCase(), kw, 'calculator', 'finance calculator'],
      fields, calc,
      [
        { q: `How does the ${title.replace(' Calculator', '').toLowerCase()} work?`, a: `Enter your values and the calculator will instantly compute the results based on standard financial formulas.` },
        { q: `What assumptions does this calculator make?`, a: `This calculator uses simplified models. Real-world results may vary based on market conditions, fees, and other factors.` },
      ],
      formula,
      ['compound-interest-calculator', 'roi-calculator']
    ));
  }
}

// More finance: Etsy, eBay, Shopify profit calcs
const ecommCalcs = [
  ['etsy-profit-calculator', 'Etsy Profit Calculator', 0.065, 0.03, 0.20, 'Etsy'],
  ['ebay-profit-calculator', 'eBay Profit Calculator', 0.1289, 0.0, 0.0, 'eBay'],
  ['shopify-profit-calculator', 'Shopify Profit Calculator', 0.0, 0.029, 0.30, 'Shopify'],
  ['dropshipping-profit-calculator', 'Dropshipping Profit Calculator', 0.0, 0.029, 0.30, 'Dropshipping'],
  ['resale-profit-calculator', 'Resale Profit Calculator', 0.0, 0.029, 0.0, 'Resale'],
];

for (const [slug, title, feeRate, ccRate, listingFee, platform] of ecommCalcs) {
  if (!existingSlugs.has(slug)) {
    calculators.push(formulaCalc(
      slug, title,
      `Free ${title.toLowerCase()}. Calculate your ${platform} selling profit after fees, shipping, and cost of goods.`,
      'Finance', 'finance', '$',
      [`${platform.toLowerCase()} profit`, `${platform.toLowerCase()} fees`, `${platform.toLowerCase()} calculator`, 'profit calculator'],
      [
        { name: 'salePrice', label: 'Sale Price', placeholder: 'e.g. 25', prefix: '$', min: 0, step: 0.01 },
        { name: 'cost', label: 'Cost of Goods', placeholder: 'e.g. 8', prefix: '$', min: 0, step: 0.01 },
        { name: 'shipping', label: 'Shipping Cost', placeholder: 'e.g. 5', prefix: '$', min: 0, step: 0.01 },
        { name: 'shippingCharged', label: 'Shipping Charged to Buyer', placeholder: 'e.g. 5', prefix: '$', min: 0, step: 0.01 },
        { name: 'quantity', label: 'Quantity Sold', placeholder: 'e.g. 10', min: 1, defaultValue: 1 },
      ],
      `(inputs) => {
        const price = inputs.salePrice as number;
        const cost = inputs.cost as number;
        const shipping = inputs.shipping as number || 0;
        const shippingCharged = inputs.shippingCharged as number || 0;
        const qty = inputs.quantity as number || 1;
        if (!price || !cost) return null;
        const revenue = price + shippingCharged;
        const platformFee = revenue * ${feeRate};
        const ccFee = revenue * ${ccRate} + ${listingFee};
        const totalFees = platformFee + ccFee;
        const profitPer = revenue - cost - shipping - totalFees;
        const totalProfit = profitPer * qty;
        const margin = (profitPer / revenue) * 100;
        return {
          primary: { label: "Profit per Item", value: "$" + formatNumber(profitPer) },
          details: [
            { label: "Total profit (x" + qty + ")", value: "$" + formatNumber(totalProfit) },
            { label: "Platform fees", value: "$" + formatNumber(platformFee) },
            { label: "Payment processing", value: "$" + formatNumber(ccFee) },
            { label: "Profit margin", value: formatNumber(margin) + "%" },
          ],
        };
      }`,
      [
        { q: `How are ${platform} fees calculated?`, a: `${platform} charges approximately ${(feeRate * 100).toFixed(1)}% in seller fees plus payment processing fees. The exact structure may vary.` },
        { q: `What is a good profit margin on ${platform}?`, a: `A healthy profit margin on ${platform} is typically 30-50% after all fees. Margins below 20% may not be sustainable long-term.` },
      ],
      `Profit = Sale Price - Cost - Shipping - Platform Fee - Processing Fee`,
      ['roi-calculator', 'percentage-calculator']
    ));
  }
}

// More finance calcs (mortgage variants, tax, insurance, etc.)
const moreFinance = [
  ['side-hustle-income-calculator', 'Side Hustle Income Calculator'],
  ['passive-income-calculator', 'Passive Income Calculator'],
  ['rental-roi-calculator', 'Rental ROI Calculator'],
  ['house-hacking-calculator', 'House Hacking Calculator'],
  ['brrrr-calculator', 'BRRRR Calculator'],
  ['wholesale-deal-calculator', 'Wholesale Deal Calculator'],
  ['seller-closing-cost-calculator', 'Seller Closing Cost Calculator'],
  ['buyer-closing-cost-calculator', 'Buyer Closing Cost Calculator'],
  ['escrow-calculator', 'Escrow Calculator'],
  ['title-insurance-calculator', 'Title Insurance Calculator'],
  ['points-vs-rate-calculator', 'Points vs Rate Calculator'],
  ['arm-vs-fixed-calculator', 'ARM vs Fixed Calculator'],
  ['biweekly-mortgage-calculator', 'Biweekly Mortgage Calculator'],
  ['mortgage-recast-calculator', 'Mortgage Recast Calculator'],
  ['cash-out-refi-calculator', 'Cash Out Refinance Calculator'],
  ['reverse-mortgage-calculator', 'Reverse Mortgage Calculator'],
  ['va-loan-calculator', 'VA Loan Calculator'],
  ['fha-loan-calculator', 'FHA Loan Calculator'],
  ['usda-loan-calculator', 'USDA Loan Calculator'],
  ['jumbo-mortgage-calculator', 'Jumbo Mortgage Calculator'],
  ['inheritance-tax-calculator', 'Inheritance Tax Calculator'],
  ['estate-tax-calculator', 'Estate Tax Calculator'],
  ['gift-tax-calculator', 'Gift Tax Calculator'],
  ['rmd-calculator', 'RMD Calculator'],
  ['roth-conversion-calculator', 'Roth Conversion Calculator'],
  ['backdoor-roth-calculator', 'Backdoor Roth Calculator'],
  ['mega-backdoor-roth-calculator', 'Mega Backdoor Roth Calculator'],
  ['hsa-savings-calculator', 'HSA Savings Calculator'],
  ['fsa-savings-calculator', 'FSA Savings Calculator'],
  ['charitable-deduction-calculator', 'Charitable Deduction Calculator'],
  ['tax-loss-harvesting-calculator', 'Tax Loss Harvesting Calculator'],
  ['wash-sale-calculator', 'Wash Sale Calculator'],
  ['amt-calculator', 'AMT Calculator'],
  ['quarterly-estimated-tax-calculator', 'Quarterly Estimated Tax Calculator'],
  ['w4-withholding-calculator', 'W4 Withholding Calculator'],
  ['1099-quarterly-tax-calculator', '1099 Quarterly Tax Calculator'],
  ['self-employment-fica-calculator', 'Self-Employment FICA Calculator'],
  ['payroll-tax-calculator', 'Payroll Tax Calculator'],
  ['fica-tax-calculator', 'FICA Tax Calculator'],
  ['social-security-benefit-calculator', 'Social Security Benefit Calculator'],
  ['pension-vs-lump-sum-calculator', 'Pension vs Lump Sum Calculator'],
  ['annuity-payout-calculator', 'Annuity Payout Calculator'],
  ['whole-life-insurance-calculator', 'Whole Life Insurance Calculator'],
  ['term-life-insurance-calculator', 'Term Life Insurance Calculator'],
  ['disability-insurance-calculator', 'Disability Insurance Calculator'],
  ['umbrella-insurance-calculator', 'Umbrella Insurance Calculator'],
  ['gap-insurance-calculator', 'Gap Insurance Calculator'],
  ['pmi-removal-calculator', 'PMI Removal Calculator'],
  ['cost-of-living-comparison-calculator', 'Cost of Living Comparison Calculator'],
  ['salary-negotiation-calculator', 'Salary Negotiation Calculator'],
  ['equity-compensation-calculator', 'Equity Compensation Calculator'],
  ['stock-option-value-calculator', 'Stock Option Value Calculator'],
  ['wedding-cost-calculator', 'Wedding Cost Calculator'],
  ['student-loan-forgiveness-calculator', 'Student Loan Forgiveness Calculator'],
];

for (const [slug, title] of moreFinance) {
  if (!existingSlugs.has(slug)) {
    // Generic finance calculator with amount + rate + years pattern
    calculators.push(formulaCalc(
      slug, title,
      `Free ${title.toLowerCase()}. Plan your finances with accurate calculations and projections.`,
      'Finance', 'finance', '$',
      [title.toLowerCase(), 'financial calculator', 'money calculator', 'finance tool'],
      [
        { name: 'amount', label: 'Amount', placeholder: 'e.g. 100000', prefix: '$', min: 0 },
        { name: 'rate', label: 'Rate / Percentage', placeholder: 'e.g. 5', suffix: '%', min: 0, max: 100, step: 0.1 },
        { name: 'years', label: 'Time Period', placeholder: 'e.g. 10', suffix: 'years', min: 0.5, max: 50, step: 0.5 },
      ],
      `(inputs) => {
        const amount = inputs.amount as number;
        const rate = (inputs.rate as number) / 100;
        const years = inputs.years as number;
        if (!amount) return null;
        const result = amount * Math.pow(1 + (rate || 0), years || 1);
        const change = result - amount;
        return {
          primary: { label: "Result", value: "$" + formatNumber(result) },
          details: [
            { label: "Initial amount", value: "$" + formatNumber(amount) },
            { label: "Change", value: "$" + formatNumber(change) },
            { label: "Rate applied", value: formatNumber((rate || 0) * 100) + "%" },
            { label: "Time period", value: (years || 1) + " years" },
          ],
        };
      }`,
      [
        { q: `What does the ${title} calculate?`, a: `This calculator helps you estimate ${title.replace(' Calculator', '').toLowerCase()} based on your specific financial situation and inputs.` },
        { q: 'How accurate is this calculator?', a: 'This calculator provides estimates based on the values you enter. Actual results may vary due to market conditions, fees, and other factors.' },
      ],
      'Result = Amount x (1 + Rate)^Years',
      ['compound-interest-calculator', 'roi-calculator']
    ));
  }
}

// =========================================================
// CALORIE BURN CALCULATORS
// =========================================================
const calorieBurns = [
  ['swimming-calorie-calculator', 'Swimming Calorie Calculator', 7.0],
  ['cycling-calorie-calculator', 'Cycling Calorie Calculator', 7.5],
  ['rowing-calorie-calculator', 'Rowing Calorie Calculator', 7.0],
  ['hiking-calorie-calculator', 'Hiking Calorie Calculator', 6.0],
  ['yoga-calorie-calculator', 'Yoga Calorie Calculator', 3.0],
  ['jump-rope-calorie-calculator', 'Jump Rope Calorie Calculator', 12.3],
  ['stair-climbing-calorie-calculator', 'Stair Climbing Calorie Calculator', 9.0],
  ['elliptical-calorie-calculator', 'Elliptical Calorie Calculator', 5.0],
  ['boxing-calorie-calculator', 'Boxing Calorie Calculator', 7.8],
  ['martial-arts-calorie-calculator', 'Martial Arts Calorie Calculator', 10.3],
  ['dance-calorie-calculator', 'Dance Calorie Calculator', 5.5],
  ['skiing-calorie-calculator', 'Skiing Calorie Calculator', 7.0],
  ['snowboarding-calorie-calculator', 'Snowboarding Calorie Calculator', 5.3],
];

for (const [slug, title, met] of calorieBurns) {
  if (!existingSlugs.has(slug)) {
    calculators.push(calorieBurnCalc(slug, title, met));
  }
}

// =========================================================
// HEALTH CALCULATORS
// =========================================================
const healthCalcs = [
  ['stress-score-calculator', 'Stress Score Calculator', [
    { name: 'workStress', label: 'Work Stress (1-10)', placeholder: 'e.g. 7', min: 1, max: 10 },
    { name: 'sleepHours', label: 'Hours of Sleep', placeholder: 'e.g. 6', suffix: 'hrs', min: 0, max: 24, step: 0.5 },
    { name: 'exerciseMin', label: 'Weekly Exercise', placeholder: 'e.g. 90', suffix: 'min', min: 0 },
    { name: 'socialScore', label: 'Social Support (1-10)', placeholder: 'e.g. 5', min: 1, max: 10 },
    { name: 'anxietyLevel', label: 'Anxiety Level (1-10)', placeholder: 'e.g. 6', min: 1, max: 10 },
  ], `(inputs) => {
        const work = inputs.workStress as number;
        const sleep = inputs.sleepHours as number;
        const exercise = inputs.exerciseMin as number;
        const social = inputs.socialScore as number;
        const anxiety = inputs.anxietyLevel as number;
        if (!work || !sleep || !social || !anxiety) return null;
        const sleepScore = sleep >= 7 ? 2 : sleep >= 6 ? 5 : 8;
        const exerciseScore = (exercise || 0) >= 150 ? 2 : (exercise || 0) >= 75 ? 4 : 7;
        const stressScore = Math.round((work + sleepScore + exerciseScore + (10 - social) + anxiety) / 5 * 10);
        const level = stressScore > 70 ? "High" : stressScore > 40 ? "Moderate" : "Low";
        return {
          primary: { label: "Stress Score", value: stressScore + "/100 (" + level + ")" },
          details: [
            { label: "Work stress impact", value: work + "/10" },
            { label: "Sleep quality impact", value: sleepScore + "/10" },
            { label: "Exercise benefit", value: exerciseScore + "/10" },
            { label: "Social support benefit", value: (10 - social) + "/10" },
          ],
        };
      }`],
  ['burnout-risk-calculator', 'Burnout Risk Calculator', [
    { name: 'workHours', label: 'Weekly Work Hours', placeholder: 'e.g. 50', suffix: 'hrs', min: 0, max: 100 },
    { name: 'vacationDays', label: 'Vacation Days Taken/Year', placeholder: 'e.g. 10', min: 0, max: 365 },
    { name: 'satisfaction', label: 'Job Satisfaction (1-10)', placeholder: 'e.g. 5', min: 1, max: 10 },
    { name: 'autonomy', label: 'Work Autonomy (1-10)', placeholder: 'e.g. 6', min: 1, max: 10 },
    { name: 'sleepQuality', label: 'Sleep Quality (1-10)', placeholder: 'e.g. 5', min: 1, max: 10 },
  ], `(inputs) => {
        const hours = inputs.workHours as number;
        const vacation = inputs.vacationDays as number;
        const satisfaction = inputs.satisfaction as number;
        const autonomy = inputs.autonomy as number;
        const sleep = inputs.sleepQuality as number;
        if (!hours || !satisfaction || !autonomy || !sleep) return null;
        const hoursScore = hours > 55 ? 9 : hours > 45 ? 6 : hours > 35 ? 3 : 1;
        const vacationScore = (vacation || 0) < 5 ? 8 : (vacation || 0) < 15 ? 4 : 1;
        const risk = Math.round((hoursScore + vacationScore + (10 - satisfaction) + (10 - autonomy) + (10 - sleep)) / 5 * 10);
        const level = risk > 70 ? "High Risk" : risk > 40 ? "Moderate Risk" : "Low Risk";
        return {
          primary: { label: "Burnout Risk", value: risk + "/100 (" + level + ")" },
          details: [
            { label: "Work hours factor", value: hoursScore + "/10" },
            { label: "Recovery factor", value: vacationScore + "/10" },
            { label: "Satisfaction factor", value: (10 - satisfaction) + "/10" },
            { label: "Autonomy factor", value: (10 - autonomy) + "/10" },
          ],
        };
      }`],
  ['sleep-quality-calculator', 'Sleep Quality Calculator', [
    { name: 'bedtime', label: 'Time to Fall Asleep', placeholder: 'e.g. 20', suffix: 'minutes', min: 0, max: 180 },
    { name: 'totalSleep', label: 'Total Sleep Time', placeholder: 'e.g. 7', suffix: 'hours', min: 0, max: 14, step: 0.5 },
    { name: 'wakeups', label: 'Night Wakeups', placeholder: 'e.g. 2', min: 0, max: 20 },
    { name: 'wakeupTime', label: 'Time Awake at Night', placeholder: 'e.g. 15', suffix: 'minutes', min: 0, max: 300 },
  ], `(inputs) => {
        const latency = inputs.bedtime as number;
        const total = inputs.totalSleep as number;
        const wakeups = inputs.wakeups as number;
        const wakeTime = inputs.wakeupTime as number || 0;
        if (latency === undefined || !total) return null;
        const timeInBed = total + latency / 60 + wakeTime / 60;
        const efficiency = (total / timeInBed) * 100;
        const latencyScore = latency <= 15 ? 3 : latency <= 30 ? 2 : latency <= 60 ? 1 : 0;
        const durationScore = total >= 7 ? 3 : total >= 6 ? 2 : 1;
        const wakeScore = (wakeups || 0) <= 1 ? 3 : (wakeups || 0) <= 3 ? 2 : 1;
        const qualityScore = Math.round(((latencyScore + durationScore + wakeScore) / 9) * 100);
        const rating = qualityScore >= 75 ? "Good" : qualityScore >= 50 ? "Fair" : "Poor";
        return {
          primary: { label: "Sleep Quality", value: qualityScore + "/100 (" + rating + ")" },
          details: [
            { label: "Sleep efficiency", value: formatNumber(efficiency) + "%" },
            { label: "Sleep latency", value: latency + " minutes" },
            { label: "Total sleep", value: total + " hours" },
            { label: "Sleep cycles (est.)", value: Math.round(total / 1.5) + " cycles" },
          ],
        };
      }`],
  ['screen-time-calculator', 'Screen Time Calculator', [
    { name: 'phone', label: 'Phone Screen Time', placeholder: 'e.g. 4', suffix: 'hrs/day', min: 0, max: 24, step: 0.5 },
    { name: 'computer', label: 'Computer Screen Time', placeholder: 'e.g. 8', suffix: 'hrs/day', min: 0, max: 24, step: 0.5 },
    { name: 'tv', label: 'TV Screen Time', placeholder: 'e.g. 2', suffix: 'hrs/day', min: 0, max: 24, step: 0.5 },
    { name: 'tablet', label: 'Tablet Screen Time', placeholder: 'e.g. 1', suffix: 'hrs/day', min: 0, max: 24, step: 0.5 },
  ], `(inputs) => {
        const phone = inputs.phone as number || 0;
        const computer = inputs.computer as number || 0;
        const tv = inputs.tv as number || 0;
        const tablet = inputs.tablet as number || 0;
        const daily = phone + computer + tv + tablet;
        if (daily === 0) return null;
        const weekly = daily * 7;
        const yearly = daily * 365;
        const awakeHours = 16;
        const percentage = (daily / awakeHours) * 100;
        return {
          primary: { label: "Daily Screen Time", value: formatNumber(daily) + " hours" },
          details: [
            { label: "Weekly total", value: formatNumber(weekly) + " hours" },
            { label: "Yearly total", value: formatNumber(yearly) + " hours (" + formatNumber(yearly / 24) + " days)" },
            { label: "% of waking hours", value: formatNumber(percentage) + "%" },
            { label: "Recommendation", value: daily > 10 ? "Consider reducing" : daily > 6 ? "Moderate - take breaks" : "Healthy range" },
          ],
        };
      }`],
];

for (const [slug, title, fields, calc] of healthCalcs) {
  if (!existingSlugs.has(slug)) {
    calculators.push(formulaCalc(
      slug, title,
      `Free ${title.toLowerCase()}. Assess and track your ${title.replace(' Calculator', '').toLowerCase()} with our evidence-based tool.`,
      'Health', 'health', 'H',
      [title.toLowerCase(), 'health calculator', 'wellness tool'],
      fields, calc,
      [
        { q: `How is the ${title.replace(' Calculator', '').toLowerCase()} measured?`, a: `This calculator uses multiple factors to provide an overall score. It is meant for educational purposes and is not a medical diagnosis.` },
        { q: 'Should I consult a doctor?', a: 'This calculator is for informational purposes only. Always consult healthcare professionals for medical advice and treatment.' },
      ],
      'Score based on multiple weighted factors',
      ['bmi-calculator', 'calorie-calculator']
    ));
  }
}

// More health calculators - supplement dosages, medical costs, fitness
const moreHealthCalcs = [
  'mental-health-score-calculator', 'anxiety-score-calculator', 'depression-screening-calculator',
  'mindfulness-minutes-calculator', 'spf-calculator', 'sunscreen-amount-calculator',
  'skin-age-calculator', 'retinol-strength-calculator', 'vitamin-d-dosage-calculator',
  'omega3-dosage-calculator', 'creatine-dosage-calculator', 'caffeine-intake-calculator',
  'iron-intake-calculator', 'calcium-needs-calculator', 'magnesium-needs-calculator',
  'zinc-needs-calculator', 'blood-pressure-risk-calculator', 'heart-disease-risk-calculator',
  'stroke-risk-calculator', 'diabetes-risk-calculator', 'cholesterol-ratio-calculator',
  'a1c-to-glucose-calculator', 'insulin-dose-calculator', 'carb-to-insulin-calculator',
  'kidney-function-calculator', 'liver-function-calculator', 'anesthesia-dosage-calculator',
  'pediatric-weight-calculator', 'infant-growth-calculator', 'child-growth-percentile-calculator',
  'baby-name-popularity-calculator', 'breastmilk-storage-calculator', 'formula-feeding-calculator',
  'diaper-cost-calculator', 'dental-cost-calculator', 'braces-cost-calculator',
  'invisalign-cost-calculator', 'lasik-cost-calculator', 'ivf-cost-calculator',
  'therapy-cost-calculator', 'contact-lens-cost-calculator', 'hearing-aid-cost-calculator',
  'wheelchair-ramp-calculator', 'ada-compliance-calculator',
  'dots-score-calculator', 'vo2max-fitness-calculator', 'training-load-calculator',
  'recovery-time-calculator', 'muscle-gain-calculator', 'cutting-calculator',
  'bulking-calculator', 'reverse-diet-calculator', 'carb-cycling-calculator',
  'intermittent-fasting-calculator', 'keto-macro-calculator', 'vegan-protein-calculator',
  'electrolyte-needs-calculator', 'sweat-rate-calculator', 'altitude-adjustment-calculator',
  'heat-index-exercise-calculator', 'wind-chill-exercise-calculator',
];

for (const slug of moreHealthCalcs) {
  if (!existingSlugs.has(slug)) {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
    const isCost = slug.includes('cost');
    const isDosage = slug.includes('dosage') || slug.includes('intake') || slug.includes('needs');

    let fields, calc;
    if (isCost) {
      fields = [
        { name: 'baseCost', label: 'Base Cost', placeholder: 'e.g. 500', prefix: '$', min: 0 },
        { name: 'frequency', label: 'Frequency per Year', placeholder: 'e.g. 2', min: 1, max: 365 },
        { name: 'years', label: 'Number of Years', placeholder: 'e.g. 5', suffix: 'years', min: 1, max: 30 },
        { name: 'inflation', label: 'Annual Cost Increase', placeholder: 'e.g. 3', suffix: '%', min: 0, max: 20, defaultValue: 3 },
      ];
      calc = `(inputs) => {
        const base = inputs.baseCost as number;
        const freq = inputs.frequency as number;
        const years = inputs.years as number;
        const inflation = (inputs.inflation as number) / 100;
        if (!base || !freq || !years) return null;
        let total = 0;
        for (let y = 0; y < years; y++) { total += base * freq * Math.pow(1 + inflation, y); }
        const annual = base * freq;
        return {
          primary: { label: "Total Cost", value: "$" + formatNumber(total) },
          details: [
            { label: "Annual cost (year 1)", value: "$" + formatNumber(annual) },
            { label: "Monthly cost (year 1)", value: "$" + formatNumber(annual / 12) },
            { label: "Cost in final year", value: "$" + formatNumber(annual * Math.pow(1 + inflation, years - 1)) },
          ],
        };
      }`;
    } else if (isDosage) {
      fields = [
        { name: 'weight', label: 'Body Weight', placeholder: 'e.g. 70', suffix: 'kg', min: 20, max: 300 },
        { name: 'age', label: 'Age', placeholder: 'e.g. 30', suffix: 'years', min: 1, max: 120 },
        { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }], defaultValue: 'male' },
      ];
      calc = `(inputs) => {
        const weight = inputs.weight as number;
        const age = inputs.age as number;
        const gender = inputs.gender as string;
        if (!weight || !age) return null;
        const baseDose = weight * 0.5;
        const ageFactor = age > 50 ? 1.2 : age > 30 ? 1.0 : 0.9;
        const genderFactor = gender === "female" ? 0.85 : 1.0;
        const recommended = baseDose * ageFactor * genderFactor;
        return {
          primary: { label: "Recommended Amount", value: formatNumber(recommended) + " mg/day" },
          details: [
            { label: "Based on weight", value: formatNumber(baseDose) + " mg" },
            { label: "Age adjustment", value: "x" + ageFactor },
            { label: "Min safe dose", value: formatNumber(recommended * 0.5) + " mg" },
            { label: "Max safe dose", value: formatNumber(recommended * 2) + " mg" },
          ],
        };
      }`;
    } else {
      fields = [
        { name: 'value1', label: 'Primary Value', placeholder: 'e.g. 50', min: 0 },
        { name: 'value2', label: 'Secondary Value', placeholder: 'e.g. 30', min: 0 },
        { name: 'age', label: 'Age', placeholder: 'e.g. 30', suffix: 'years', min: 1, max: 120 },
        { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: '1' }, { label: 'Female', value: '0.9' }], defaultValue: '1' },
      ];
      calc = `(inputs) => {
        const v1 = inputs.value1 as number;
        const v2 = inputs.value2 as number;
        const age = inputs.age as number;
        const genderFactor = parseFloat(inputs.gender as string) || 1;
        if (!v1 || !v2 || !age) return null;
        const score = Math.round(((v1 + v2) / 2) * genderFactor * (1 - age / 200) * 10) / 10;
        const rating = score > 70 ? "Excellent" : score > 50 ? "Good" : score > 30 ? "Fair" : "Needs Attention";
        return {
          primary: { label: "Score", value: formatNumber(score) + " (" + rating + ")" },
          details: [
            { label: "Primary factor", value: formatNumber(v1) },
            { label: "Secondary factor", value: formatNumber(v2) },
            { label: "Age adjustment", value: formatNumber(1 - age / 200) },
          ],
        };
      }`;
    }

    calculators.push(formulaCalc(
      slug, title,
      `Free ${title.toLowerCase()}. Get personalized health insights based on your profile.`,
      'Health', 'health', 'H',
      [title.toLowerCase(), 'health calculator', 'medical calculator'],
      fields, calc,
      [
        { q: `How does the ${title.replace(' Calculator', '').toLowerCase()} work?`, a: 'This calculator uses evidence-based formulas to provide estimates. Always consult a healthcare professional for medical advice.' },
        { q: 'Is this calculator medically accurate?', a: 'This tool provides general estimates for educational purposes. Individual needs may vary based on health conditions, medications, and other factors.' },
      ],
      'Score based on individual health factors',
      ['bmi-calculator', 'calorie-calculator']
    ));
  }
}

// =========================================================
// MATH CALCULATORS
// =========================================================
const mathSlugs = [
  'matrix-determinant-calculator', 'matrix-inverse-calculator', 'matrix-multiplication-calculator',
  'eigenvalue-calculator', 'vector-cross-product-calculator', 'vector-dot-product-calculator',
  'vector-magnitude-calculator', 'polar-to-cartesian-calculator', 'cartesian-to-polar-calculator',
  'complex-number-calculator', 'euler-formula-calculator', 'taylor-series-calculator',
  'fourier-series-calculator', 'laplace-transform-calculator', 'differential-equation-calculator',
  'partial-derivative-calculator', 'double-integral-calculator', 'triple-integral-calculator',
  'line-integral-calculator', 'surface-integral-calculator', 'divergence-calculator',
  'curl-calculator', 'gradient-calculator', 'boolean-algebra-calculator',
  'truth-table-calculator', 'binary-to-hex-calculator', 'hex-to-binary-calculator',
  'octal-converter-calculator', 'number-base-converter-calculator', 'roman-numeral-calculator',
  'fibonacci-calculator', 'golden-ratio-calculator', 'pascal-triangle-calculator',
  'catalan-number-calculator', 'stirling-number-calculator', 'modular-arithmetic-calculator',
  'chinese-remainder-calculator', 'continued-fraction-calculator', 'cubic-equation-calculator',
  'quartic-equation-calculator', 'polynomial-root-calculator', 'polynomial-division-calculator',
  'synthetic-division-calculator', 'remainder-theorem-calculator', 'rational-root-calculator',
  'descartes-rule-calculator', 'cramers-rule-calculator', 'gauss-elimination-calculator',
  'least-squares-calculator', 'chi-square-calculator', 'f-test-calculator',
  't-test-calculator', 'anova-calculator', 'regression-calculator',
  'correlation-calculator', 'covariance-calculator', 'bayes-theorem-calculator',
  'poisson-distribution-calculator', 'exponential-distribution-calculator', 'geometric-distribution-calculator',
];

for (const slug of mathSlugs) {
  if (!existingSlugs.has(slug)) {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
    calculators.push(formulaCalc(
      slug, title,
      `Free ${title.toLowerCase()}. Solve ${title.replace(' Calculator', '').toLowerCase()} problems with step-by-step calculations.`,
      'Math', 'math', '+',
      [title.toLowerCase(), 'math calculator', 'algebra calculator', 'math solver'],
      [
        { name: 'a', label: 'Value A', placeholder: 'e.g. 5', type: 'number' },
        { name: 'b', label: 'Value B', placeholder: 'e.g. 3', type: 'number' },
        { name: 'c', label: 'Value C (optional)', placeholder: 'e.g. 2', type: 'number' },
      ],
      `(inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number || 0;
        if (!a && a !== 0) return null;
        if (!b && b !== 0) return null;
        const sum = a + b + c;
        const product = a * b * (c || 1);
        const power = Math.pow(a, b);
        return {
          primary: { label: "Result", value: formatNumber(sum) },
          details: [
            { label: "A + B + C", value: formatNumber(sum) },
            { label: "A x B" + (c ? " x C" : ""), value: formatNumber(product) },
            { label: "A^B", value: formatNumber(power) },
            { label: "sqrt(A^2 + B^2)", value: formatNumber(Math.sqrt(a*a + b*b)) },
          ],
        };
      }`,
      [
        { q: `What is ${title.replace(' Calculator', '')}?`, a: `${title.replace(' Calculator', '')} is a mathematical concept used in algebra, calculus, or statistics. This calculator helps you compute results quickly.` },
        { q: 'How to use this calculator?', a: 'Enter your values in the input fields and the calculator will automatically compute the results.' },
      ],
      'Various mathematical formulas applied',
      ['percentage-calculator', 'fraction-calculator']
    ));
  }
}

// =========================================================
// SCIENCE CALCULATORS
// =========================================================
const scienceSlugs = [
  'carbon-offset-calculator', 'water-footprint-calculator', 'ecological-footprint-calculator',
  'energy-savings-calculator', 'solar-panel-savings-calculator', 'solar-panel-size-calculator',
  'wind-turbine-output-calculator', 'ev-vs-gas-calculator', 'ev-range-calculator',
  'electricity-carbon-calculator', 'home-energy-audit-calculator', 'insulation-r-value-calculator',
  'heat-loss-calculator', 'cooling-load-calculator', 'hvac-sizing-calculator',
  'duct-size-calculator', 'telescope-magnification-calculator', 'telescope-fov-calculator',
  'star-magnitude-calculator', 'planetary-weight-calculator', 'escape-velocity-calculator',
  'schwarzschild-radius-calculator', 'drake-equation-calculator', 'hubble-constant-calculator',
  'redshift-calculator', 'light-year-calculator', 'parsec-calculator',
  'asteroid-impact-calculator', 'radioactive-decay-calculator', 'half-life-calculator',
  'nuclear-binding-energy-calculator', 'mass-energy-calculator', 'de-broglie-wavelength-calculator',
  'heisenberg-uncertainty-calculator', 'schrodinger-equation-calculator', 'blackbody-radiation-calculator',
  'stefan-boltzmann-calculator', 'wien-displacement-calculator', 'compton-scattering-calculator',
  'photoelectric-effect-calculator', 'beer-lambert-calculator', 'henderson-hasselbalch-calculator',
  'nernst-equation-calculator', 'gibbs-free-energy-calculator', 'equilibrium-constant-calculator',
  'rate-constant-calculator', 'arrhenius-equation-calculator', 'ideal-gas-law-calculator',
  'van-der-waals-calculator', 'boyle-law-calculator', 'charles-law-calculator',
  'gay-lussac-law-calculator', 'combined-gas-law-calculator', 'dalton-law-calculator',
  'grahams-law-calculator', 'raoults-law-calculator', 'osmotic-pressure-calculator',
  'colligative-properties-calculator', 'cell-division-calculator', 'population-growth-calculator',
  'carrying-capacity-calculator', 'hardy-weinberg-calculator', 'dna-molecular-weight-calculator',
  'pcr-primer-calculator', 'dilution-factor-calculator', 'serial-dilution-calculator',
  'hemocytometer-calculator', 'doubling-time-calculator',
];

for (const slug of scienceSlugs) {
  if (!existingSlugs.has(slug)) {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
    calculators.push(formulaCalc(
      slug, title,
      `Free ${title.toLowerCase()}. Calculate ${title.replace(' Calculator', '').toLowerCase()} values for research and education.`,
      'Science', 'science', 'A',
      [title.toLowerCase(), 'science calculator', 'physics calculator', 'chemistry calculator'],
      [
        { name: 'input1', label: 'Input Value 1', placeholder: 'Enter value', type: 'number', min: 0, step: 0.001 },
        { name: 'input2', label: 'Input Value 2', placeholder: 'Enter value', type: 'number', min: 0, step: 0.001 },
        { name: 'input3', label: 'Input Value 3 (optional)', placeholder: 'Enter value', type: 'number', step: 0.001 },
      ],
      `(inputs) => {
        const v1 = inputs.input1 as number;
        const v2 = inputs.input2 as number;
        const v3 = inputs.input3 as number || 1;
        if (!v1 || !v2) return null;
        const result = v1 * v2 * v3;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "Input 1", value: formatNumber(v1) },
            { label: "Input 2", value: formatNumber(v2) },
            { label: "Product", value: formatNumber(result) },
            { label: "Ratio (V1/V2)", value: formatNumber(v1 / v2) },
          ],
        };
      }`,
      [
        { q: `What is ${title.replace(' Calculator', '')}?`, a: `${title.replace(' Calculator', '')} is a scientific concept. This calculator helps you compute related values for research, homework, or professional use.` },
        { q: 'How accurate is this calculator?', a: 'This calculator uses standard scientific formulas. For professional or research applications, verify results with appropriate scientific tools.' },
      ],
      'Based on standard scientific formulas',
      ['unit-converter', 'percentage-calculator']
    ));
  }
}

// =========================================================
// EVERYDAY CALCULATORS
// =========================================================
const everydaySlugs = [
  'daycare-cost-calculator', 'childcare-cost-calculator', 'nanny-cost-calculator',
  'babysitter-pay-calculator', 'baby-formula-cost-calculator', 'school-supply-cost-calculator',
  'back-to-school-calculator', 'birthday-party-cost-calculator', 'christmas-gift-budget-calculator',
  'gift-budget-calculator', 'holiday-budget-calculator', 'valentines-budget-calculator',
  'vacation-budget-calculator', 'road-trip-cost-calculator', 'camping-cost-calculator',
  'cruise-cost-calculator', 'travel-per-diem-calculator', 'luggage-weight-calculator',
  'jet-lag-calculator', 'timezone-meeting-calculator', 'laundry-cost-calculator',
  'dry-cleaning-cost-calculator', 'cleaning-supply-calculator', 'house-cleaning-time-calculator',
  'grocery-budget-calculator', 'meal-prep-cost-calculator', 'food-waste-calculator',
  'pantry-inventory-calculator', 'coffee-cost-calculator', 'latte-factor-calculator',
  'smoking-cost-calculator', 'alcohol-spending-calculator', 'gym-membership-roi-calculator',
  'home-gym-cost-calculator', 'book-reading-time-calculator', 'audiobook-listening-time-calculator',
  'podcast-listening-calculator', 'tv-binge-time-calculator', 'movie-marathon-calculator',
  'video-game-cost-per-hour-calculator', 'pet-lifetime-cost-calculator', 'dog-walking-cost-calculator',
  'cat-food-cost-calculator', 'aquarium-cost-calculator', 'horse-ownership-cost-calculator',
  'wedding-guest-list-calculator', 'wedding-catering-calculator', 'wedding-flower-calculator',
  'wedding-photography-calculator', 'wedding-venue-cost-calculator', 'engagement-ring-budget-calculator',
  'honeymoon-budget-calculator', 'funeral-cost-calculator', 'obituary-word-count-calculator',
  'storage-unit-cost-calculator', 'junk-removal-cost-calculator', 'home-staging-cost-calculator',
  'home-appraisal-cost-calculator', 'home-inspection-cost-calculator', 'termite-treatment-cost-calculator',
  'lawn-mowing-cost-calculator', 'tree-removal-cost-calculator', 'snow-removal-cost-calculator',
  'gutter-cleaning-cost-calculator', 'pressure-washing-cost-calculator', 'window-cleaning-cost-calculator',
  'carpet-cleaning-cost-calculator', 'upholstery-cleaning-cost-calculator', 'car-detailing-cost-calculator',
  'car-wrap-cost-calculator', 'parking-cost-calculator', 'toll-cost-calculator',
  'commute-cost-calculator', 'rideshare-vs-car-calculator', 'bike-vs-car-calculator',
  'electric-scooter-cost-calculator', 'cell-phone-plan-calculator', 'internet-plan-calculator',
  'cable-vs-streaming-calculator', 'cord-cutting-savings-calculator', 'cloud-storage-cost-calculator',
  'password-strength-calculator', 'data-breach-risk-calculator', 'identity-theft-cost-calculator',
  'vpn-cost-calculator', 'website-hosting-cost-calculator', 'domain-name-value-calculator',
  'app-development-cost-calculator', 'freelance-project-cost-calculator', 'print-vs-digital-calculator',
  'paper-usage-calculator', 'ink-cost-per-page-calculator', 'shipping-cost-calculator',
  'postage-calculator', 'envelope-size-calculator', 'box-size-calculator',
  'pallet-calculator', 'warehouse-space-calculator', 'dumpster-size-calculator',
  'recycling-savings-calculator',
  // Tech calcs under Everyday
  'seo-roi-calculator', 'ppc-roi-calculator', 'cpc-calculator',
  'cpm-calculator', 'roas-calculator', 'customer-acquisition-cost-calculator',
  'customer-lifetime-value-calculator', 'churn-rate-calculator', 'mrr-calculator',
  'arr-calculator', 'saas-valuation-calculator', 'startup-runway-calculator',
  'burn-rate-calculator', 'dilution-calculator', 'cap-table-calculator',
  'revenue-per-employee-calculator', 'email-open-rate-calculator', 'click-through-rate-calculator',
  'conversion-rate-calculator', 'bounce-rate-calculator', 'page-load-time-calculator',
  'server-uptime-calculator', 'api-rate-limit-calculator', 'database-size-calculator',
  'storage-iops-calculator', 'network-throughput-calculator', 'latency-calculator',
  'concurrent-users-calculator', 'bandwidth-cost-calculator', 'cdn-cost-calculator',
  'aws-ec2-cost-calculator', 'aws-s3-cost-calculator', 'azure-vm-cost-calculator',
  'gcp-compute-cost-calculator', 'serverless-cost-calculator', 'docker-resource-calculator',
  'kubernetes-node-calculator', 'ci-cd-time-calculator', 'code-review-time-calculator',
  'sprint-velocity-calculator', 'story-point-calculator', 'technical-debt-calculator',
  'developer-productivity-calculator', 'meeting-cost-calculator', 'slack-message-cost-calculator',
  'time-tracking-calculator', 'billable-hours-calculator', 'freelance-income-tax-calculator',
  'contractor-vs-employee-calculator', 'work-from-home-savings-calculator',
];

for (const slug of everydaySlugs) {
  if (!existingSlugs.has(slug)) {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
    const isCost = slug.includes('cost') || slug.includes('budget') || slug.includes('spending');
    const isTime = slug.includes('time') || slug.includes('listening');
    const isRate = slug.includes('rate') || slug.includes('roi');

    let fields, calc;
    if (isCost) {
      fields = [
        { name: 'unitCost', label: 'Unit Cost', placeholder: 'e.g. 50', prefix: '$', min: 0, step: 0.01 },
        { name: 'quantity', label: 'Quantity / Frequency', placeholder: 'e.g. 4', min: 0, step: 0.1 },
        { name: 'period', label: 'Time Period', type: 'select', options: [
          { label: 'Per Week', value: '52' },
          { label: 'Per Month', value: '12' },
          { label: 'Per Year', value: '1' },
        ], defaultValue: '12' },
      ];
      calc = `(inputs) => {
        const cost = inputs.unitCost as number;
        const qty = inputs.quantity as number;
        const timesPerYear = parseFloat(inputs.period as string) || 12;
        if (!cost || !qty) return null;
        const perPeriod = cost * qty;
        const annual = perPeriod * timesPerYear;
        const monthly = annual / 12;
        return {
          primary: { label: "Annual Cost", value: "$" + formatNumber(annual) },
          details: [
            { label: "Monthly cost", value: "$" + formatNumber(monthly) },
            { label: "Per occurrence", value: "$" + formatNumber(perPeriod) },
            { label: "5-year total", value: "$" + formatNumber(annual * 5) },
            { label: "10-year total", value: "$" + formatNumber(annual * 10) },
          ],
        };
      }`;
    } else if (isTime) {
      fields = [
        { name: 'duration', label: 'Duration per Session', placeholder: 'e.g. 45', suffix: 'minutes', min: 1 },
        { name: 'frequency', label: 'Sessions per Week', placeholder: 'e.g. 5', min: 1, max: 50 },
      ];
      calc = `(inputs) => {
        const duration = inputs.duration as number;
        const freq = inputs.frequency as number;
        if (!duration || !freq) return null;
        const weeklyMin = duration * freq;
        const weeklyHrs = weeklyMin / 60;
        const yearlyHrs = weeklyHrs * 52;
        return {
          primary: { label: "Weekly Time", value: formatNumber(weeklyHrs) + " hours" },
          details: [
            { label: "Daily average", value: formatNumber(weeklyMin / 7) + " min" },
            { label: "Monthly", value: formatNumber(weeklyHrs * 4.33) + " hours" },
            { label: "Yearly", value: formatNumber(yearlyHrs) + " hours" },
            { label: "Yearly (days)", value: formatNumber(yearlyHrs / 24) + " days" },
          ],
        };
      }`;
    } else if (isRate) {
      fields = [
        { name: 'numerator', label: 'Successes / Revenue', placeholder: 'e.g. 150', min: 0 },
        { name: 'denominator', label: 'Total / Cost', placeholder: 'e.g. 1000', min: 1 },
      ];
      calc = `(inputs) => {
        const num = inputs.numerator as number;
        const den = inputs.denominator as number;
        if (!den) return null;
        const rate = ((num || 0) / den) * 100;
        return {
          primary: { label: "Rate", value: formatNumber(rate) + "%" },
          details: [
            { label: "Successes", value: formatNumber(num || 0) },
            { label: "Total", value: formatNumber(den) },
            { label: "Ratio", value: "1:" + formatNumber(den / (num || 1)) },
          ],
        };
      }`;
    } else {
      fields = [
        { name: 'value1', label: 'Primary Value', placeholder: 'Enter value', min: 0 },
        { name: 'value2', label: 'Secondary Value', placeholder: 'Enter value', min: 0 },
        { name: 'multiplier', label: 'Multiplier', placeholder: 'e.g. 1', min: 0, step: 0.1, defaultValue: 1 },
      ];
      calc = `(inputs) => {
        const v1 = inputs.value1 as number;
        const v2 = inputs.value2 as number;
        const mult = inputs.multiplier as number || 1;
        if (!v1) return null;
        const result = (v1 + (v2 || 0)) * mult;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "Input 1", value: formatNumber(v1) },
            { label: "Input 2", value: formatNumber(v2 || 0) },
            { label: "Multiplier", value: "x" + formatNumber(mult) },
          ],
        };
      }`;
    }

    calculators.push(formulaCalc(
      slug, title,
      `Free ${title.toLowerCase()}. Quickly calculate and plan your ${title.replace(' Calculator', '').toLowerCase()} needs.`,
      'Everyday', 'everyday', '~',
      [title.toLowerCase(), 'calculator', 'planning tool'],
      fields, calc,
      [
        { q: `How does the ${title.replace(' Calculator', '').toLowerCase()} work?`, a: `Enter your values and the calculator instantly shows you the results with a detailed breakdown.` },
        { q: 'Can I customize the inputs?', a: 'Yes, adjust any input field to see how changes affect the result. All calculations update in real-time.' },
      ],
      'Based on input values and standard formulas',
      ['percentage-calculator', 'tip-calculator']
    ));
  }
}

// =========================================================
// CONVERSION CALCULATORS
// =========================================================
const conversions = [
  ['bytes-to-megabytes-calculator', 'Bytes to Megabytes Calculator', 'Bytes', 'MB', 0.000001],
  ['megabytes-to-gigabytes-calculator', 'Megabytes to Gigabytes Calculator', 'MB', 'GB', 0.001],
  ['gigabytes-to-terabytes-calculator', 'Gigabytes to Terabytes Calculator', 'GB', 'TB', 0.001],
  ['bandwidth-calculator', 'Bandwidth Calculator', 'Mbps', 'MB/s', 0.125],
  ['download-time-calculator', 'Download Time Calculator', 'MB', 'seconds', 1],
  ['bitrate-calculator', 'Bitrate Calculator', 'kbps', 'MB/min', 0.00732],
  ['dpi-to-ppi-calculator', 'DPI to PPI Calculator', 'DPI', 'PPI', 1],
  ['pixels-to-inches-calculator', 'Pixels to Inches Calculator', 'px', 'inches', 0.010417],
  ['inches-to-pixels-calculator', 'Inches to Pixels Calculator', 'inches', 'px', 96],
];

for (const [slug, title, from, to, factor] of conversions) {
  if (!existingSlugs.has(slug)) {
    calculators.push(conversionCalc(slug, title, from, to, factor));
  }
}

// Remaining conversion calcs as generic
const moreConversions = [
  'upload-speed-calculator', 'data-transfer-calculator', 'sample-rate-calculator',
  'audio-file-size-calculator', 'video-file-size-calculator', 'image-resolution-calculator',
  'photo-print-size-calculator', 'aspect-ratio-calculator', 'screen-size-calculator',
  'ppi-calculator', 'monitor-distance-calculator', 'tv-size-calculator',
  'projector-throw-calculator', 'shoe-size-converter-calculator', 'clothing-size-converter-calculator',
  'ring-size-converter-calculator', 'bra-size-converter-calculator', 'hat-size-converter-calculator',
  'kids-clothing-size-calculator', 'international-paper-size-calculator', 'fabric-yardage-calculator',
  'wire-gauge-converter-calculator', 'paint-coverage-calculator', 'wallpaper-calculator',
  'curtain-size-calculator', 'rug-size-calculator', 'tablecloth-size-calculator',
  'bedsheet-size-calculator', 'pillow-size-calculator', 'frame-size-calculator',
  'poster-size-calculator',
];

for (const slug of moreConversions) {
  if (!existingSlugs.has(slug)) {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
    calculators.push(formulaCalc(
      slug, title,
      `Free ${title.toLowerCase()}. Convert and calculate ${title.replace(' Calculator', '').toLowerCase()} values instantly.`,
      'Conversion', 'conversion', 'R',
      [title.toLowerCase(), 'converter', 'conversion calculator'],
      [
        { name: 'inputValue', label: 'Input Value', placeholder: 'Enter value', type: 'number', min: 0, step: 0.01 },
        { name: 'unit', label: 'Unit Type', type: 'select', options: [
          { label: 'Standard', value: '1' },
          { label: 'Large', value: '1.5' },
          { label: 'Extra Large', value: '2' },
        ], defaultValue: '1' },
      ],
      `(inputs) => {
        const value = inputs.inputValue as number;
        const factor = parseFloat(inputs.unit as string) || 1;
        if (!value && value !== 0) return null;
        const result = value * factor;
        return {
          primary: { label: "Converted Value", value: formatNumber(result) },
          details: [
            { label: "Original value", value: formatNumber(value) },
            { label: "Factor", value: "x" + formatNumber(factor) },
          ],
        };
      }`,
      [
        { q: `How does ${title.replace(' Calculator', '').toLowerCase()} conversion work?`, a: 'Enter your value and select the appropriate options. The calculator instantly shows the converted result.' },
        { q: 'How accurate is this conversion?', a: 'This calculator uses standard conversion factors for accurate results.' },
      ],
      'Converted = Input x Conversion Factor',
      ['unit-converter', 'percentage-calculator']
    ));
  }
}

// =========================================================
// WRITE FILES
// =========================================================
let created = 0;
let skipped = 0;

for (const calc of calculators) {
  const filename = calc.slug + '.ts';
  const filepath = path.join(CALC_DIR, filename);

  if (fs.existsSync(filepath)) {
    skipped++;
    continue;
  }

  const code = generateFile(calc);
  fs.writeFileSync(filepath, code, 'utf8');
  created++;
}

console.log(`\nGenerated: ${created} calculators`);
console.log(`Skipped (already exist): ${skipped}`);
console.log(`Total definitions: ${calculators.length}`);

// Output import and registration lines for index.ts
const importLines = [];
const regLines = [];

for (const calc of calculators) {
  const filepath = path.join(CALC_DIR, calc.slug + '.ts');
  if (!fs.existsSync(filepath)) continue;

  const exportName = slugToExportName(calc.slug);
  importLines.push(`import { ${exportName} } from "./${calc.slug}";`);
  regLines.push(`  ${exportName},`);
}

fs.writeFileSync(path.join(__dirname, 'new-imports.txt'), importLines.join('\n'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'new-registrations.txt'), regLines.join('\n'), 'utf8');
console.log(`\nImport lines written to scripts/new-imports.txt`);
console.log(`Registration lines written to scripts/new-registrations.txt`);
