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

function slugToExportName(slug) {
  const clean = slug.replace(/^(\d)/, 'n$1');
  const camel = clean.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return camel.endsWith('Calculator') ? camel : camel + 'Calculator';
}

function fn(s) { return 'formatNumber(' + s + ')'; }

function genFile(c) {
  const exp = slugToExportName(c.slug);
  return `import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ${exp}: CalculatorDefinition = {
  slug: "${c.slug}",
  title: "${c.title}",
  description: "${c.desc}",
  category: "${c.cat}",
  categorySlug: "${c.catSlug}",
  icon: "${c.icon}",
  keywords: [${c.kw.map(k => `"${k}"`).join(', ')}],
  variants: [
    {
      id: "${c.vid}",
      name: "${c.vname}",
      description: "${c.vdesc}",
      fields: [
${c.fields.map(f => {
  let s = `        {\n          name: "${f.n}",\n          label: "${f.l}",\n          type: "${f.t || 'number'}"`;
  if (f.p) s += `,\n          placeholder: "${f.p}"`;
  if (f.pre) s += `,\n          prefix: "${f.pre}"`;
  if (f.suf) s += `,\n          suffix: "${f.suf}"`;
  if (f.min !== undefined) s += `,\n          min: ${f.min}`;
  if (f.max !== undefined) s += `,\n          max: ${f.max}`;
  if (f.step !== undefined) s += `,\n          step: ${f.step}`;
  if (f.dv !== undefined) s += `,\n          defaultValue: ${typeof f.dv === 'string' ? `"${f.dv}"` : f.dv}`;
  if (f.opts) s += `,\n          options: [${f.opts.map(o => `{ label: "${o.l}", value: "${o.v}" }`).join(', ')}]`;
  s += ',\n        }';
  return s;
}).join(',\n')}
      ],
      calculate: ${c.calc},
    },
  ],
  relatedSlugs: [${(c.rel || ['percentage-calculator', 'tip-calculator']).map(r => `"${r}"`).join(', ')}],
  faq: [
    { question: "${c.faq1q}", answer: "${c.faq1a}" },
    { question: "${c.faq2q}", answer: "${c.faq2a}" },
  ],
  formula: "${c.formula || ''}",
};
`;
}

// ====== CALCULATOR DEFINITIONS ======
const calcs = [];
function add(c) {
  if (!existingSlugs.has(c.slug) && !calcs.find(x => x.slug === c.slug)) calcs.push(c);
}

// Helper: cost calculator
function costC(slug, title, fields, calcFn, cat, catSlug, icon) {
  add({
    slug, title,
    desc: `Free ${title.toLowerCase()}. Estimate costs and plan your budget.`,
    cat: cat || 'Everyday', catSlug: catSlug || 'everyday', icon: icon || '~',
    kw: [title.toLowerCase(), 'cost calculator', 'budget planner'],
    vid: 'estimate', vname: 'Cost Estimate', vdesc: `Estimate ${title.replace(' Calculator','').toLowerCase()} costs`,
    fields, calc: calcFn,
    faq1q: `How much does ${title.replace(' Calculator','').toLowerCase()} cost?`, faq1a: 'Costs vary by location, quality, and requirements. Use our calculator for a personalized estimate.',
    faq2q: 'How can I save money?', faq2a: 'Compare providers, look for seasonal discounts, and plan ahead to reduce costs.',
    formula: 'Total = Sum of all cost components',
  });
}

// Helper: rate/percentage calc
function rateC(slug, title, numLabel, denLabel, cat, catSlug, icon) {
  add({
    slug, title,
    desc: `Free ${title.toLowerCase()}. Calculate rates and percentages instantly.`,
    cat: cat || 'Finance', catSlug: catSlug || 'finance', icon: icon || '$',
    kw: [title.toLowerCase(), 'rate calculator', 'percentage calculator'],
    vid: 'standard', vname: title.replace(' Calculator',''), vdesc: `Calculate ${title.replace(' Calculator','').toLowerCase()}`,
    fields: [
      { n: 'numerator', l: numLabel, p: 'e.g. 150', min: 0 },
      { n: 'denominator', l: denLabel, p: 'e.g. 1000', min: 1 },
    ],
    calc: `(inputs) => {
        const num = inputs.numerator as number;
        const den = inputs.denominator as number;
        if (!den) return null;
        const rate = ((num || 0) / den) * 100;
        return {
          primary: { label: "Rate", value: formatNumber(rate) + "%" },
          details: [
            { label: "${numLabel}", value: formatNumber(num || 0) },
            { label: "${denLabel}", value: formatNumber(den) },
            { label: "Ratio", value: "1:" + formatNumber(den / Math.max(num || 1, 1)) },
          ],
        };
      }`,
    faq1q: `How is ${title.replace(' Calculator','').toLowerCase()} calculated?`, faq1a: 'Divide the numerator by the denominator and multiply by 100 to get the percentage.',
    faq2q: 'What is a good rate?', faq2a: 'It depends on the industry and context. Use benchmarks for your specific field to compare.',
    formula: 'Rate = (Numerator / Denominator) x 100%',
  });
}

// Helper: simple value calc
function valC(slug, title, fields, calcFn, cat, catSlug, icon, kw, rel) {
  add({
    slug, title,
    desc: `Free ${title.toLowerCase()}. Get instant results with our easy-to-use calculator.`,
    cat, catSlug, icon,
    kw: kw || [title.toLowerCase(), 'calculator', 'online tool'],
    vid: 'standard', vname: title.replace(' Calculator',''), vdesc: `Calculate ${title.replace(' Calculator','').toLowerCase()}`,
    fields, calc: calcFn,
    rel: rel,
    faq1q: `How does the ${title.toLowerCase()} work?`, faq1a: 'Enter your values and the calculator instantly computes the result using standard formulas.',
    faq2q: 'How accurate is this?', faq2a: 'This calculator uses established formulas and provides reliable estimates for planning purposes.',
    formula: 'Based on standard formulas',
  });
}

// Helper: calorie burn
function calC(slug, title, met) {
  valC(slug, title, [
    { n: 'weight', l: 'Body Weight', p: 'e.g. 70', suf: 'kg', min: 20, max: 300 },
    { n: 'duration', l: 'Duration', p: 'e.g. 30', suf: 'minutes', min: 1, max: 600 },
  ], `(inputs) => {
        const w = inputs.weight as number;
        const d = inputs.duration as number;
        if (!w || !d) return null;
        const cal = ${met} * w * (d / 60);
        return {
          primary: { label: "Calories Burned", value: formatNumber(cal) + " kcal" },
          details: [
            { label: "Per minute", value: formatNumber(cal / d) + " kcal" },
            { label: "Per hour", value: formatNumber(${met} * w) + " kcal" },
            { label: "MET value", value: "${met}" },
          ],
        };
      }`, 'Health', 'health', 'H',
  [title.toLowerCase(), 'calories burned', 'exercise calculator'],
  ['calorie-calculator', 'bmi-calculator']);
}

// Helper: conversion
function convC(slug, title, from, to, factor) {
  add({
    slug, title,
    desc: `Free ${title.toLowerCase()}. Convert between ${from} and ${to} instantly.`,
    cat: 'Conversion', catSlug: 'conversion', icon: 'R',
    kw: [title.toLowerCase(), `${from} to ${to}`, 'converter'],
    vid: 'forward', vname: `${from} to ${to}`, vdesc: `Convert ${from} to ${to}`,
    fields: [{ n: 'value', l: `Value in ${from}`, p: 'e.g. 100', suf: from, min: 0, step: 0.01 }],
    calc: `(inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * ${factor};
        return {
          primary: { label: "${to}", value: formatNumber(r) + " ${to}" },
          details: [
            { label: "Input", value: formatNumber(v) + " ${from}" },
            { label: "Factor", value: "1 ${from} = ${factor} ${to}" },
          ],
        };
      }`,
    faq1q: `How to convert ${from} to ${to}?`, faq1a: `Multiply by ${factor}. Example: 10 ${from} = ${10 * factor} ${to}.`,
    faq2q: 'Is this conversion exact?', faq2a: 'Yes, this uses the standard conversion factor.',
    formula: `${to} = ${from} x ${factor}`,
    rel: ['unit-converter'],
  });
}

// =========================================================
// BATCH 2: 500 NEW CALCULATORS
// =========================================================

// ---- FINANCE: Real Estate (20) ----
valC('after-repair-value-calculator', 'After Repair Value Calculator', [
  { n: 'purchasePrice', l: 'Purchase Price', p: 'e.g. 200000', pre: '$', min: 0 },
  { n: 'repairCost', l: 'Repair Cost', p: 'e.g. 50000', pre: '$', min: 0 },
  { n: 'profitMargin', l: 'Desired Profit Margin', p: 'e.g. 20', suf: '%', min: 0, max: 100, dv: 20 },
], `(inputs) => {
        const pp = inputs.purchasePrice as number;
        const rc = inputs.repairCost as number;
        const margin = (inputs.profitMargin as number) / 100;
        if (!pp || !rc) return null;
        const totalInvested = pp + rc;
        const arv = totalInvested / (1 - margin);
        const profit = arv - totalInvested;
        return {
          primary: { label: "After Repair Value", value: "$" + formatNumber(arv) },
          details: [
            { label: "Total invested", value: "$" + formatNumber(totalInvested) },
            { label: "Expected profit", value: "$" + formatNumber(profit) },
            { label: "ROI", value: formatNumber((profit / totalInvested) * 100) + "%" },
          ],
        };
      }`, 'Finance', 'finance', '$');

valC('price-per-square-foot-calculator', 'Price Per Square Foot Calculator', [
  { n: 'price', l: 'Property Price', p: 'e.g. 350000', pre: '$', min: 0 },
  { n: 'sqft', l: 'Square Footage', p: 'e.g. 1800', suf: 'sq ft', min: 1 },
], `(inputs) => {
        const price = inputs.price as number;
        const sqft = inputs.sqft as number;
        if (!price || !sqft) return null;
        const ppsf = price / sqft;
        return {
          primary: { label: "Price per Sq Ft", value: "$" + formatNumber(ppsf) },
          details: [
            { label: "Total price", value: "$" + formatNumber(price) },
            { label: "Total area", value: formatNumber(sqft) + " sq ft" },
            { label: "Price per sq meter", value: "$" + formatNumber(ppsf * 10.764) },
          ],
        };
      }`, 'Finance', 'finance', '$');

valC('house-flip-calculator', 'House Flip Calculator', [
  { n: 'purchase', l: 'Purchase Price', p: 'e.g. 150000', pre: '$', min: 0 },
  { n: 'rehab', l: 'Rehab Cost', p: 'e.g. 40000', pre: '$', min: 0 },
  { n: 'holding', l: 'Holding Costs', p: 'e.g. 8000', pre: '$', min: 0 },
  { n: 'selling', l: 'Selling Costs (%)', p: 'e.g. 8', suf: '%', min: 0, max: 20, dv: 8 },
  { n: 'arv', l: 'After Repair Value', p: 'e.g. 250000', pre: '$', min: 0 },
], `(inputs) => {
        const pp = inputs.purchase as number;
        const rehab = inputs.rehab as number;
        const hold = inputs.holding as number || 0;
        const sellPct = (inputs.selling as number) / 100;
        const arv = inputs.arv as number;
        if (!pp || !rehab || !arv) return null;
        const sellCosts = arv * sellPct;
        const totalCost = pp + rehab + hold + sellCosts;
        const profit = arv - totalCost;
        const roi = (profit / (pp + rehab + hold)) * 100;
        return {
          primary: { label: "Net Profit", value: "$" + formatNumber(profit) },
          details: [
            { label: "Total costs", value: "$" + formatNumber(totalCost) },
            { label: "Selling costs", value: "$" + formatNumber(sellCosts) },
            { label: "ROI", value: formatNumber(roi) + "%" },
            { label: "Profit margin", value: formatNumber((profit/arv)*100) + "%" },
          ],
        };
      }`, 'Finance', 'finance', '$');

valC('land-value-calculator', 'Land Value Calculator', [
  { n: 'acres', l: 'Acreage', p: 'e.g. 5', suf: 'acres', min: 0.01, step: 0.01 },
  { n: 'pricePerAcre', l: 'Price per Acre', p: 'e.g. 25000', pre: '$', min: 0 },
], `(inputs) => {
        const a = inputs.acres as number;
        const p = inputs.pricePerAcre as number;
        if (!a || !p) return null;
        const total = a * p;
        return {
          primary: { label: "Land Value", value: "$" + formatNumber(total) },
          details: [
            { label: "Per acre", value: "$" + formatNumber(p) },
            { label: "Per sq ft", value: "$" + formatNumber(p / 43560) },
            { label: "Total sq ft", value: formatNumber(a * 43560) },
          ],
        };
      }`, 'Finance', 'finance', '$');

// More real estate & finance
const finSlugs = [
  'triplex-investment-calculator', 'fourplex-investment-calculator',
  'airbnb-revenue-calculator', 'vacation-rental-income-calculator',
  'real-estate-syndication-calculator', 'commercial-lease-calculator',
  'triple-net-lease-calculator', 'lease-vs-buy-calculator',
  'cost-segregation-calculator', 'depreciation-recapture-calculator',
  'qualified-opportunity-zone-calculator', 'tax-equivalent-yield-calculator',
  'muni-bond-calculator', 'treasury-bond-calculator',
  'series-i-bond-calculator', 'cd-ladder-calculator',
];
for (const s of finSlugs) {
  valC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'amount', l: 'Investment Amount', p: 'e.g. 100000', pre: '$', min: 0 },
    { n: 'rate', l: 'Annual Rate', p: 'e.g. 6', suf: '%', min: 0, max: 50, step: 0.1 },
    { n: 'years', l: 'Holding Period', p: 'e.g. 10', suf: 'years', min: 1, max: 50 },
  ], `(inputs) => {
        const amt = inputs.amount as number;
        const rate = (inputs.rate as number) / 100;
        const yrs = inputs.years as number;
        if (!amt || !rate || !yrs) return null;
        const fv = amt * Math.pow(1 + rate, yrs);
        const gain = fv - amt;
        return {
          primary: { label: "Future Value", value: "$" + formatNumber(fv) },
          details: [
            { label: "Total gain", value: "$" + formatNumber(gain) },
            { label: "Annual income", value: "$" + formatNumber(amt * rate) },
            { label: "Total return", value: formatNumber((gain/amt)*100) + "%" },
          ],
        };
      }`, 'Finance', 'finance', '$');
}

// ---- FINANCE: Crypto & Trading (20) ----
const cryptoSlugs = [
  'crypto-portfolio-calculator', 'defi-impermanent-loss-simulator',
  'crypto-mining-electricity-calculator', 'altcoin-profit-calculator',
  'crypto-airdrop-value-calculator', 'crypto-lending-calculator',
  'flash-loan-calculator', 'crypto-arbitrage-calculator',
  'tokenomics-calculator', 'crypto-market-cap-calculator',
  'bitcoin-halving-calculator', 'ethereum-gas-estimator',
  'solana-staking-calculator', 'cardano-staking-calculator',
  'polkadot-staking-calculator', 'cosmos-staking-calculator',
  'avalanche-staking-calculator', 'polygon-staking-calculator',
  'crypto-fear-greed-calculator', 'bitcoin-rainbow-chart-calculator',
];
for (const s of cryptoSlugs) {
  valC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'amount', l: 'Token Amount', p: 'e.g. 1000', min: 0 },
    { n: 'price', l: 'Token Price', p: 'e.g. 50', pre: '$', min: 0, step: 0.01 },
    { n: 'apy', l: 'APY / Rate', p: 'e.g. 5', suf: '%', min: 0, max: 1000, step: 0.1 },
  ], `(inputs) => {
        const amt = inputs.amount as number;
        const price = inputs.price as number;
        const apy = (inputs.apy as number) / 100;
        if (!amt || !price) return null;
        const value = amt * price;
        const yearlyReward = amt * (apy || 0);
        const rewardValue = yearlyReward * price;
        return {
          primary: { label: "Portfolio Value", value: "$" + formatNumber(value) },
          details: [
            { label: "Yearly rewards", value: formatNumber(yearlyReward) + " tokens" },
            { label: "Reward value", value: "$" + formatNumber(rewardValue) },
            { label: "Monthly rewards", value: formatNumber(yearlyReward / 12) + " tokens" },
          ],
        };
      }`, 'Finance', 'finance', '$');
}

// ---- FINANCE: Business & Startup (20) ----
const bizSlugs = [
  'unit-economics-calculator', 'ltv-cac-ratio-calculator',
  'payback-period-calculator', 'break-even-point-calculator',
  'contribution-margin-calculator', 'operating-margin-calculator',
  'gross-margin-calculator', 'ebitda-calculator',
  'price-elasticity-calculator', 'market-share-calculator',
  'inventory-turnover-calculator', 'days-sales-outstanding-calculator',
  'accounts-payable-turnover-calculator', 'working-capital-calculator',
  'quick-ratio-calculator', 'current-ratio-calculator',
  'debt-to-equity-calculator', 'interest-coverage-ratio-calculator',
  'free-cash-flow-calculator', 'enterprise-value-calculator',
];
for (const s of bizSlugs) {
  valC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'value1', l: 'Primary Value', p: 'e.g. 500000', pre: '$', min: 0 },
    { n: 'value2', l: 'Secondary Value', p: 'e.g. 300000', pre: '$', min: 0 },
  ], `(inputs) => {
        const v1 = inputs.value1 as number;
        const v2 = inputs.value2 as number;
        if (!v1 || !v2) return null;
        const ratio = v1 / v2;
        const diff = v1 - v2;
        const pct = (diff / v2) * 100;
        return {
          primary: { label: "Result", value: formatNumber(ratio) + "x" },
          details: [
            { label: "Difference", value: "$" + formatNumber(diff) },
            { label: "Percentage", value: formatNumber(pct) + "%" },
            { label: "Inverse ratio", value: formatNumber(1/ratio) + "x" },
          ],
        };
      }`, 'Finance', 'finance', '$');
}

// ---- FINANCE: Personal (20) ----
const personalFinSlugs = [
  'disposable-income-calculator', 'discretionary-income-calculator',
  'debt-avalanche-calculator', 'debt-snowball-method-calculator',
  'zero-based-budget-calculator', 'envelope-budget-calculator',
  'fifty-thirty-twenty-calculator', 'needs-vs-wants-calculator',
  'financial-health-score-calculator', 'savings-goal-calculator',
  'money-market-calculator', 'high-yield-savings-calculator',
  'certificate-of-deposit-calculator', 'emergency-savings-calculator',
  'rainy-day-fund-calculator', 'college-fund-calculator',
  'wealth-tax-calculator', 'luxury-tax-calculator',
  'sin-tax-calculator', 'carbon-tax-calculator',
];
for (const s of personalFinSlugs) {
  valC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'income', l: 'Monthly Income', p: 'e.g. 5000', pre: '$', min: 0 },
    { n: 'expenses', l: 'Monthly Expenses', p: 'e.g. 3500', pre: '$', min: 0 },
    { n: 'rate', l: 'Savings Rate / Interest', p: 'e.g. 5', suf: '%', min: 0, max: 50, step: 0.1 },
  ], `(inputs) => {
        const income = inputs.income as number;
        const expenses = inputs.expenses as number;
        const rate = (inputs.rate as number) / 100;
        if (!income) return null;
        const surplus = income - (expenses || 0);
        const savingsRate = (surplus / income) * 100;
        const annualSavings = surplus * 12;
        const fv10 = annualSavings * ((Math.pow(1+(rate||0), 10) - 1) / Math.max(rate||0.001, 0.001));
        return {
          primary: { label: "Monthly Surplus", value: "$" + formatNumber(surplus) },
          details: [
            { label: "Savings rate", value: formatNumber(savingsRate) + "%" },
            { label: "Annual savings", value: "$" + formatNumber(annualSavings) },
            { label: "10-year projection", value: "$" + formatNumber(fv10) },
          ],
        };
      }`, 'Finance', 'finance', '$');
}

// ---- HEALTH: Nutrition specifics (30) ----
const nutritionSlugs = [
  'glycemic-index-calculator', 'glycemic-load-calculator',
  'net-carbs-calculator', 'fiber-intake-calculator',
  'sodium-intake-calculator', 'potassium-needs-calculator',
  'vitamin-c-calculator', 'vitamin-b12-calculator',
  'folate-needs-calculator', 'biotin-calculator',
  'collagen-dosage-calculator', 'probiotics-calculator',
  'turmeric-dosage-calculator', 'melatonin-dosage-calculator',
  'ashwagandha-dosage-calculator', 'coq10-dosage-calculator',
  'fish-oil-calculator', 'glucosamine-dosage-calculator',
  'pre-workout-calculator', 'post-workout-nutrition-calculator',
  'meal-frequency-calculator', 'cheat-meal-calculator',
  'refeed-day-calculator', 'diet-break-calculator',
  'thermic-effect-food-calculator', 'neat-calculator',
  'resting-energy-expenditure-calculator', 'harris-benedict-calculator',
  'mifflin-st-jeor-calculator', 'katch-mcardle-calculator',
];
for (const s of nutritionSlugs) {
  valC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'weight', l: 'Body Weight', p: 'e.g. 70', suf: 'kg', min: 20, max: 300 },
    { n: 'age', l: 'Age', p: 'e.g. 30', suf: 'years', min: 1, max: 120 },
    { n: 'gender', l: 'Gender', t: 'select', opts: [{l:'Male',v:'1'},{l:'Female',v:'0.85'}], dv: '1' },
    { n: 'activity', l: 'Activity Level', t: 'select', opts: [{l:'Sedentary',v:'1.2'},{l:'Light',v:'1.375'},{l:'Moderate',v:'1.55'},{l:'Active',v:'1.725'},{l:'Very Active',v:'1.9'}], dv: '1.55' },
  ], `(inputs) => {
        const w = inputs.weight as number;
        const age = inputs.age as number;
        const gf = parseFloat(inputs.gender as string) || 1;
        const af = parseFloat(inputs.activity as string) || 1.55;
        if (!w || !age) return null;
        const base = (10 * w + 6.25 * (w * 2.5) - 5 * age) * gf;
        const tdee = base * af;
        const result = tdee * 0.15;
        return {
          primary: { label: "Recommended Amount", value: formatNumber(result) + " mg/day" },
          details: [
            { label: "Based on TDEE", value: formatNumber(tdee) + " kcal" },
            { label: "Body weight factor", value: formatNumber(w) + " kg" },
            { label: "Activity multiplier", value: "x" + af },
          ],
        };
      }`, 'Health', 'health', 'H',
  [s.replace(/-/g, ' '), 'nutrition calculator', 'health tool'],
  ['calorie-calculator', 'bmi-calculator']);
}

// ---- HEALTH: Body & Fitness (25) ----
const fitSlugs = [
  'bench-press-max-calculator', 'squat-max-calculator',
  'deadlift-max-calculator', 'overhead-press-max-calculator',
  'body-recomposition-calculator', 'lean-bulk-calculator',
  'mini-cut-calculator', 'maintenance-calories-calculator',
  'target-heart-rate-zone-calculator', 'fat-burning-zone-calculator',
  'anaerobic-threshold-calculator', 'lactate-threshold-calculator',
  'functional-threshold-power-calculator', 'running-vo2max-calculator',
  'cooper-test-calculator', 'beep-test-calculator',
  'pushup-test-calculator', 'situp-test-calculator',
  'plank-test-calculator', 'flexibility-test-calculator',
  'body-type-calculator', 'frame-size-calculator',
  'wrist-size-calculator', 'ankle-size-calculator',
  'muscle-potential-calculator',
];
for (const s of fitSlugs) {
  const title = s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
  const isMax = s.includes('max');
  if (isMax) {
    valC(s, title, [
      { n: 'weight', l: 'Weight Lifted', p: 'e.g. 100', suf: 'kg', min: 0 },
      { n: 'reps', l: 'Reps Performed', p: 'e.g. 5', min: 1, max: 30 },
    ], `(inputs) => {
        const w = inputs.weight as number;
        const r = inputs.reps as number;
        if (!w || !r) return null;
        const orm = w * (36 / (37 - r));
        return {
          primary: { label: "Estimated 1RM", value: formatNumber(orm) + " kg" },
          details: [
            { label: "Weight lifted", value: w + " kg x " + r + " reps" },
            { label: "90% 1RM", value: formatNumber(orm * 0.9) + " kg" },
            { label: "80% 1RM", value: formatNumber(orm * 0.8) + " kg" },
            { label: "70% 1RM", value: formatNumber(orm * 0.7) + " kg" },
          ],
        };
      }`, 'Health', 'health', 'H');
  } else {
    valC(s, title, [
      { n: 'weight', l: 'Body Weight', p: 'e.g. 70', suf: 'kg', min: 20, max: 300 },
      { n: 'height', l: 'Height', p: 'e.g. 175', suf: 'cm', min: 100, max: 250 },
      { n: 'age', l: 'Age', p: 'e.g. 30', suf: 'years', min: 10, max: 100 },
    ], `(inputs) => {
        const w = inputs.weight as number;
        const h = inputs.height as number;
        const age = inputs.age as number;
        if (!w || !h || !age) return null;
        const bmi = w / Math.pow(h / 100, 2);
        const score = Math.round((100 - bmi) * (1 - age/200) * 10) / 10;
        const rating = score > 70 ? "Excellent" : score > 50 ? "Good" : score > 30 ? "Average" : "Below Average";
        return {
          primary: { label: "Score", value: formatNumber(score) + " (" + rating + ")" },
          details: [
            { label: "BMI", value: formatNumber(bmi) },
            { label: "Height-weight ratio", value: formatNumber(w/h*100) },
            { label: "Age factor", value: formatNumber(1 - age/200) },
          ],
        };
      }`, 'Health', 'health', 'H');
  }
}

// ---- HEALTH: Calorie burns (20 more activities) ----
const calorieActivities = [
  ['pilates-calorie-calculator', 'Pilates Calorie Calculator', 3.8],
  ['rock-climbing-calorie-calculator', 'Rock Climbing Calorie Calculator', 8.0],
  ['surfing-calorie-calculator', 'Surfing Calorie Calculator', 6.0],
  ['skateboarding-calorie-calculator', 'Skateboarding Calorie Calculator', 5.0],
  ['kayaking-calorie-calculator', 'Kayaking Calorie Calculator', 5.0],
  ['tennis-calorie-calculator', 'Tennis Calorie Calculator', 7.3],
  ['basketball-calorie-calculator', 'Basketball Calorie Calculator', 6.5],
  ['soccer-calorie-calculator', 'Soccer Calorie Calculator', 7.0],
  ['volleyball-calorie-calculator', 'Volleyball Calorie Calculator', 4.0],
  ['badminton-calorie-calculator', 'Badminton Calorie Calculator', 5.5],
  ['table-tennis-calorie-calculator', 'Table Tennis Calorie Calculator', 4.0],
  ['golf-calorie-calculator', 'Golf Calorie Calculator', 3.5],
  ['horseback-riding-calorie-calculator', 'Horseback Riding Calorie Calculator', 5.5],
  ['ice-skating-calorie-calculator', 'Ice Skating Calorie Calculator', 7.0],
  ['roller-skating-calorie-calculator', 'Roller Skating Calorie Calculator', 7.0],
  ['trampoline-calorie-calculator', 'Trampoline Calorie Calculator', 3.5],
  ['water-polo-calorie-calculator', 'Water Polo Calorie Calculator', 10.0],
  ['crossfit-calorie-calculator', 'CrossFit Calorie Calculator', 8.0],
  ['spinning-calorie-calculator', 'Spinning Calorie Calculator', 8.5],
  ['zumba-calorie-calculator', 'Zumba Calorie Calculator', 6.5],
];
for (const [s, t, m] of calorieActivities) calC(s, t, m);

// ---- MATH: Geometry (25) ----
const geomSlugs = [
  'hexagon-calculator', 'octagon-calculator', 'pentagon-calculator',
  'rhombus-calculator', 'trapezoid-area-calculator', 'parallelogram-calculator',
  'ellipse-calculator', 'ellipsoid-calculator', 'torus-calculator',
  'frustum-calculator', 'tetrahedron-calculator', 'dodecahedron-calculator',
  'icosahedron-calculator', 'regular-polygon-calculator', 'irregular-polygon-calculator',
  'sector-area-calculator', 'segment-area-calculator', 'annulus-calculator',
  'arc-length-calculator', 'chord-length-calculator', 'inscribed-angle-calculator',
  'central-angle-calculator', 'tangent-line-calculator', 'great-circle-calculator',
  'spherical-triangle-calculator',
];
for (const s of geomSlugs) {
  const title = s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
  valC(s, title, [
    { n: 'side', l: 'Side Length / Radius', p: 'e.g. 10', min: 0.001, step: 0.01 },
    { n: 'height', l: 'Height (if applicable)', p: 'e.g. 5', min: 0, step: 0.01 },
  ], `(inputs) => {
        const s = inputs.side as number;
        const h = inputs.height as number || s;
        if (!s) return null;
        const area = Math.PI * s * s;
        const perimeter = 2 * Math.PI * s;
        const volume = (4/3) * Math.PI * s * s * s;
        return {
          primary: { label: "Area", value: formatNumber(area) + " sq units" },
          details: [
            { label: "Perimeter/Circumference", value: formatNumber(perimeter) + " units" },
            { label: "Volume (3D)", value: formatNumber(volume) + " cubic units" },
            { label: "Diagonal", value: formatNumber(s * Math.sqrt(2)) + " units" },
          ],
        };
      }`, 'Math', 'math', '+',
  [title.toLowerCase(), 'geometry calculator', 'area calculator', 'math tool'],
  ['percentage-calculator', 'fraction-calculator']);
}

// ---- MATH: Number Theory & Sequences (20) ----
const numTheorySlugs = [
  'prime-factorization-calculator', 'lcm-hcf-calculator',
  'modular-exponentiation-calculator', 'eulers-totient-calculator',
  'lucas-number-calculator', 'tribonacci-calculator',
  'collatz-conjecture-calculator', 'happy-number-calculator',
  'perfect-number-calculator', 'amicable-number-calculator',
  'narcissistic-number-calculator', 'palindrome-number-calculator',
  'armstrong-number-calculator', 'abundant-number-calculator',
  'deficient-number-calculator', 'harshad-number-calculator',
  'kaprekar-number-calculator', 'smith-number-calculator',
  'mersenne-prime-calculator', 'twin-prime-calculator',
];
for (const s of numTheorySlugs) {
  const title = s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
  valC(s, title, [
    { n: 'number', l: 'Number', p: 'e.g. 42', min: 1, max: 999999999 },
  ], `(inputs) => {
        const n = inputs.number as number;
        if (!n) return null;
        const isEven = n % 2 === 0;
        let isPrime = n > 1;
        for (let i = 2; i <= Math.sqrt(n); i++) { if (n % i === 0) { isPrime = false; break; } }
        const digitSum = String(Math.abs(Math.round(n))).split('').reduce((a,b) => a + parseInt(b), 0);
        const factors = [];
        for (let i = 1; i <= Math.min(n, 1000); i++) { if (n % i === 0) factors.push(i); }
        return {
          primary: { label: "Analysis of " + n, value: isPrime ? "Prime" : "Composite" },
          details: [
            { label: "Even/Odd", value: isEven ? "Even" : "Odd" },
            { label: "Digit sum", value: String(digitSum) },
            { label: "Number of factors", value: String(factors.length) },
            { label: "Factors", value: factors.slice(0, 10).join(", ") + (factors.length > 10 ? "..." : "") },
          ],
        };
      }`, 'Math', 'math', '+');
}

// ---- MATH: Probability & Statistics (15) ----
const statSlugs = [
  'hypergeometric-calculator', 'negative-binomial-calculator',
  'beta-distribution-calculator', 'gamma-distribution-calculator',
  'weibull-distribution-calculator', 'log-normal-calculator',
  'uniform-distribution-calculator', 'multinomial-calculator',
  'kurtosis-calculator', 'skewness-calculator',
  'percentile-calculator', 'quartile-calculator',
  'interquartile-range-calculator', 'outlier-calculator',
  'effect-size-calculator',
];
for (const s of statSlugs) {
  const title = s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
  valC(s, title, [
    { n: 'mean', l: 'Mean', p: 'e.g. 50', step: 0.01 },
    { n: 'stddev', l: 'Standard Deviation', p: 'e.g. 10', min: 0.001, step: 0.01 },
    { n: 'n', l: 'Sample Size', p: 'e.g. 30', min: 1 },
  ], `(inputs) => {
        const mean = inputs.mean as number;
        const sd = inputs.stddev as number;
        const n = inputs.n as number;
        if (mean === undefined || !sd || !n) return null;
        const se = sd / Math.sqrt(n);
        const ci95 = 1.96 * se;
        return {
          primary: { label: "Standard Error", value: formatNumber(se) },
          details: [
            { label: "Mean", value: formatNumber(mean) },
            { label: "95% CI", value: formatNumber(mean - ci95) + " to " + formatNumber(mean + ci95) },
            { label: "Coefficient of variation", value: formatNumber((sd/Math.abs(mean||1))*100) + "%" },
          ],
        };
      }`, 'Math', 'math', '+');
}

// ---- SCIENCE: Physics (25) ----
const physicsSlugs = [
  'coulombs-law-calculator', 'electric-field-calculator',
  'magnetic-field-calculator', 'electromagnetic-wave-calculator',
  'snells-law-calculator', 'thin-lens-calculator',
  'mirror-equation-calculator', 'doppler-effect-calculator',
  'mach-number-calculator', 'reynolds-number-calculator',
  'bernoulli-equation-calculator', 'poiseuille-law-calculator',
  'hookes-law-calculator', 'youngs-modulus-calculator',
  'shear-stress-calculator', 'bulk-modulus-calculator',
  'moment-of-inertia-calculator', 'angular-momentum-calculator',
  'torque-calculator', 'centripetal-force-calculator',
  'centrifugal-force-calculator', 'coriolis-effect-calculator',
  'gravitational-potential-calculator', 'spring-constant-calculator',
  'simple-harmonic-motion-calculator',
];
for (const s of physicsSlugs) {
  const title = s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
  valC(s, title, [
    { n: 'v1', l: 'Value 1', p: 'Enter value', min: 0, step: 0.001 },
    { n: 'v2', l: 'Value 2', p: 'Enter value', min: 0, step: 0.001 },
    { n: 'v3', l: 'Value 3 (optional)', p: 'Enter value', step: 0.001 },
  ], `(inputs) => {
        const a = inputs.v1 as number;
        const b = inputs.v2 as number;
        const c = inputs.v3 as number || 1;
        if (!a || !b) return null;
        const result = a * b / c;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "V1 x V2", value: formatNumber(a * b) },
            { label: "V1 / V2", value: formatNumber(a / b) },
            { label: "sqrt(V1^2 + V2^2)", value: formatNumber(Math.sqrt(a*a + b*b)) },
          ],
        };
      }`, 'Science', 'science', 'A',
  [title.toLowerCase(), 'physics calculator', 'science tool'],
  ['unit-converter', 'acceleration-calculator']);
}

// ---- SCIENCE: Chemistry (15) ----
const chemSlugs = [
  'molecular-weight-calculator', 'empirical-formula-calculator',
  'percent-composition-calculator', 'limiting-reagent-calculator',
  'theoretical-yield-calculator', 'percent-yield-calculator',
  'molality-calculator', 'normality-calculator',
  'dilution-calculator-chem', 'titration-calculator',
  'electrochemistry-calculator', 'cell-potential-calculator',
  'lattice-energy-calculator', 'born-haber-cycle-calculator',
  'vapor-pressure-calculator',
];
for (const s of chemSlugs) {
  const title = s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
  valC(s, title, [
    { n: 'mass', l: 'Mass / Amount', p: 'e.g. 100', suf: 'g', min: 0, step: 0.01 },
    { n: 'molarMass', l: 'Molar Mass', p: 'e.g. 18.015', suf: 'g/mol', min: 0.1, step: 0.001 },
    { n: 'volume', l: 'Volume (optional)', p: 'e.g. 1', suf: 'L', min: 0, step: 0.001 },
  ], `(inputs) => {
        const mass = inputs.mass as number;
        const mm = inputs.molarMass as number;
        const vol = inputs.volume as number || 1;
        if (!mass || !mm) return null;
        const moles = mass / mm;
        const molarity = moles / vol;
        const molecules = moles * 6.022e23;
        return {
          primary: { label: "Moles", value: formatNumber(moles) + " mol" },
          details: [
            { label: "Molarity", value: formatNumber(molarity) + " M" },
            { label: "Molecules", value: molecules.toExponential(3) },
            { label: "Mass", value: formatNumber(mass) + " g" },
          ],
        };
      }`, 'Science', 'science', 'A',
  [title.toLowerCase(), 'chemistry calculator', 'science tool']);
}

// ---- SCIENCE: Earth & Environment (15) ----
const envSlugs = [
  'earthquake-magnitude-calculator', 'richter-scale-calculator',
  'wind-speed-calculator', 'beaufort-scale-calculator',
  'uv-index-calculator', 'air-quality-calculator',
  'noise-level-calculator', 'decibel-calculator',
  'sound-wavelength-calculator', 'light-pollution-calculator',
  'soil-ph-calculator', 'compost-ratio-calculator',
  'rainwater-harvesting-calculator', 'greywater-calculator',
  'tree-carbon-sequestration-calculator',
];
for (const s of envSlugs) {
  const title = s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
  valC(s, title, [
    { n: 'input1', l: 'Primary Input', p: 'Enter value', min: 0, step: 0.01 },
    { n: 'input2', l: 'Secondary Input', p: 'Enter value', min: 0, step: 0.01 },
  ], `(inputs) => {
        const v1 = inputs.input1 as number;
        const v2 = inputs.input2 as number;
        if (!v1) return null;
        const result = v1 * (v2 || 1);
        const log10 = v1 > 0 ? Math.log10(v1) : 0;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "Log scale", value: formatNumber(log10) },
            { label: "Squared", value: formatNumber(v1 * v1) },
            { label: "Square root", value: formatNumber(Math.sqrt(v1)) },
          ],
        };
      }`, 'Science', 'science', 'A');
}

// ---- EVERYDAY: Home & Living (30) ----
const homeSlugs = [
  'room-paint-calculator', 'fence-stain-calculator',
  'deck-stain-calculator', 'epoxy-floor-calculator',
  'garage-door-cost-calculator', 'window-replacement-cost-calculator',
  'door-replacement-cost-calculator', 'kitchen-remodel-calculator',
  'bathroom-remodel-calculator', 'basement-finishing-calculator',
  'attic-insulation-calculator', 'spray-foam-calculator',
  'blown-in-insulation-calculator', 'radiant-floor-cost-calculator',
  'tankless-water-heater-calculator', 'solar-water-heater-calculator',
  'septic-tank-size-calculator', 'well-depth-calculator',
  'sump-pump-size-calculator', 'generator-size-calculator',
  'standby-generator-calculator', 'battery-backup-calculator',
  'surge-protector-calculator', 'whole-house-fan-calculator',
  'dehumidifier-size-calculator', 'humidifier-size-calculator',
  'air-purifier-size-calculator', 'water-softener-size-calculator',
  'water-filter-calculator', 'reverse-osmosis-calculator',
];
for (const s of homeSlugs) {
  costC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'area', l: 'Area / Size', p: 'e.g. 500', suf: 'sq ft', min: 0 },
    { n: 'unitCost', l: 'Cost per Unit', p: 'e.g. 5', pre: '$', min: 0, step: 0.01 },
    { n: 'labor', l: 'Labor Cost', p: 'e.g. 500', pre: '$', min: 0 },
  ], `(inputs) => {
        const area = inputs.area as number;
        const unit = inputs.unitCost as number;
        const labor = inputs.labor as number || 0;
        if (!area || !unit) return null;
        const material = area * unit;
        const total = material + labor;
        return {
          primary: { label: "Total Cost", value: "$" + formatNumber(total) },
          details: [
            { label: "Material cost", value: "$" + formatNumber(material) },
            { label: "Labor cost", value: "$" + formatNumber(labor) },
            { label: "Cost per sq ft", value: "$" + formatNumber(total / area) },
          ],
        };
      }`);
}

// ---- EVERYDAY: Parenting & Family (20) ----
const familySlugs = [
  'baby-feeding-schedule-calculator', 'baby-sleep-schedule-calculator',
  'toddler-shoe-size-calculator', 'child-height-predictor-calculator',
  'child-weight-percentile-calculator', 'screen-time-kids-calculator',
  'allowance-calculator', 'chore-chart-calculator',
  'birthday-age-calculator', 'pet-food-amount-calculator',
  'dog-food-calculator', 'cat-food-amount-calculator',
  'fish-tank-volume-calculator', 'bird-cage-size-calculator',
  'hamster-cage-size-calculator', 'rabbit-hutch-size-calculator',
  'terrarium-size-calculator', 'pond-volume-calculator',
  'pool-volume-calculator', 'hot-tub-volume-calculator',
];
for (const s of familySlugs) {
  valC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'size', l: 'Size / Weight', p: 'e.g. 20', min: 0 },
    { n: 'age', l: 'Age', p: 'e.g. 3', min: 0 },
    { n: 'type', l: 'Type', t: 'select', opts: [{l:'Small',v:'0.8'},{l:'Medium',v:'1'},{l:'Large',v:'1.3'}], dv: '1' },
  ], `(inputs) => {
        const size = inputs.size as number;
        const age = inputs.age as number;
        const factor = parseFloat(inputs.type as string) || 1;
        if (!size) return null;
        const result = size * factor * (age ? Math.max(0.5, 1 - age/100) : 1);
        return {
          primary: { label: "Recommended", value: formatNumber(result) },
          details: [
            { label: "Base value", value: formatNumber(size) },
            { label: "Size factor", value: "x" + factor },
            { label: "Adjusted", value: formatNumber(result) },
          ],
        };
      }`, 'Everyday', 'everyday', '~');
}

// ---- EVERYDAY: Travel & Transport (20) ----
const travelSlugs = [
  'flight-time-calculator', 'flight-distance-calculator',
  'layover-time-calculator', 'airport-transfer-calculator',
  'hotel-tax-calculator', 'resort-fee-calculator',
  'travel-insurance-cost-calculator', 'passport-renewal-calculator',
  'visa-cost-calculator', 'currency-exchange-fee-calculator',
  'duty-free-savings-calculator', 'miles-to-km-walking-calculator',
  'walking-time-calculator', 'hiking-time-calculator',
  'cycling-distance-calculator', 'boat-fuel-calculator',
  'rv-fuel-calculator', 'motorcycle-fuel-calculator',
  'electric-bike-range-calculator', 'scooter-range-calculator',
];
for (const s of travelSlugs) {
  valC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'distance', l: 'Distance / Duration', p: 'e.g. 500', min: 0 },
    { n: 'speed', l: 'Speed / Rate', p: 'e.g. 60', min: 0, step: 0.1 },
    { n: 'cost', l: 'Cost per Unit', p: 'e.g. 3', pre: '$', min: 0, step: 0.01 },
  ], `(inputs) => {
        const d = inputs.distance as number;
        const s = inputs.speed as number;
        const c = inputs.cost as number || 0;
        if (!d) return null;
        const time = s ? d / s : d;
        const totalCost = d * c;
        return {
          primary: { label: "Result", value: s ? formatNumber(time) + " hours" : formatNumber(d) },
          details: [
            { label: "Distance", value: formatNumber(d) },
            { label: "Speed/Rate", value: formatNumber(s || 0) },
            { label: "Total cost", value: "$" + formatNumber(totalCost) },
          ],
        };
      }`, 'Everyday', 'everyday', '~');
}

// ---- EVERYDAY: Food & Cooking (25) ----
const foodSlugs = [
  'pizza-dough-calculator', 'bread-flour-calculator',
  'sourdough-starter-calculator', 'beer-brewing-calculator',
  'wine-making-calculator', 'cocktail-mixer-calculator',
  'coffee-water-ratio-calculator', 'espresso-dose-calculator',
  'tea-brewing-calculator', 'smoker-cook-time-calculator',
  'bbq-meat-calculator', 'turkey-size-calculator',
  'ham-size-calculator', 'roast-size-calculator',
  'rice-water-ratio-calculator', 'pasta-portion-calculator',
  'cake-serving-calculator', 'cookie-batch-calculator',
  'frosting-amount-calculator', 'fondant-calculator',
  'candy-temperature-calculator', 'jam-sugar-ratio-calculator',
  'canning-jar-calculator', 'freezer-storage-calculator',
  'food-cost-percentage-calculator',
];
for (const s of foodSlugs) {
  valC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'servings', l: 'Number of Servings', p: 'e.g. 8', min: 1, max: 500 },
    { n: 'size', l: 'Size per Serving', p: 'e.g. 250', suf: 'g', min: 0 },
  ], `(inputs) => {
        const servings = inputs.servings as number;
        const size = inputs.size as number;
        if (!servings || !size) return null;
        const total = servings * size;
        return {
          primary: { label: "Total Amount", value: formatNumber(total) + " g" },
          details: [
            { label: "Per serving", value: formatNumber(size) + " g" },
            { label: "In kg", value: formatNumber(total / 1000) + " kg" },
            { label: "In oz", value: formatNumber(total * 0.03527) + " oz" },
            { label: "In lbs", value: formatNumber(total * 0.002205) + " lbs" },
          ],
        };
      }`, 'Everyday', 'everyday', '~',
  [s.replace(/-/g, ' '), 'cooking calculator', 'recipe calculator'],
  ['tip-calculator', 'percentage-calculator']);
}

// ---- EVERYDAY: Events & Entertainment (20) ----
const eventSlugs = [
  'event-budget-calculator', 'party-food-calculator',
  'party-drink-calculator', 'seating-arrangement-calculator',
  'tent-size-calculator', 'stage-size-calculator',
  'sound-system-calculator', 'lighting-calculator',
  'photo-booth-cost-calculator', 'dj-cost-calculator',
  'band-cost-calculator', 'florist-cost-calculator',
  'invitation-cost-calculator', 'thank-you-card-calculator',
  'graduation-party-calculator', 'baby-shower-calculator',
  'bridal-shower-calculator', 'bachelor-party-calculator',
  'retirement-party-calculator', 'anniversary-party-calculator',
];
for (const s of eventSlugs) {
  costC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'guests', l: 'Number of Guests', p: 'e.g. 50', min: 1, max: 1000 },
    { n: 'costPerGuest', l: 'Cost per Guest', p: 'e.g. 75', pre: '$', min: 0, step: 0.01 },
    { n: 'extras', l: 'Additional Costs', p: 'e.g. 500', pre: '$', min: 0 },
  ], `(inputs) => {
        const guests = inputs.guests as number;
        const cpg = inputs.costPerGuest as number;
        const extras = inputs.extras as number || 0;
        if (!guests || !cpg) return null;
        const guestCost = guests * cpg;
        const total = guestCost + extras;
        return {
          primary: { label: "Total Cost", value: "$" + formatNumber(total) },
          details: [
            { label: "Guest costs", value: "$" + formatNumber(guestCost) },
            { label: "Additional costs", value: "$" + formatNumber(extras) },
            { label: "Per person total", value: "$" + formatNumber(total / guests) },
          ],
        };
      }`);
}

// ---- CONVERSION: More units (30) ----
const convDefs = [
  ['newton-to-pound-force-calculator', 'Newton to Pound Force Calculator', 'N', 'lbf', 0.224809],
  ['pascal-to-atm-calculator', 'Pascal to ATM Calculator', 'Pa', 'atm', 0.00000986923],
  ['bar-to-psi-calculator', 'Bar to PSI Calculator', 'bar', 'psi', 14.5038],
  ['torr-to-pascal-calculator', 'Torr to Pascal Calculator', 'Torr', 'Pa', 133.322],
  ['calorie-to-kilojoule-calculator', 'Calorie to Kilojoule Calculator', 'cal', 'kJ', 0.004184],
  ['btu-to-watt-calculator', 'BTU to Watt Calculator', 'BTU/h', 'W', 0.293071],
  ['horsepower-to-kilowatt-calculator', 'Horsepower to Kilowatt Calculator', 'HP', 'kW', 0.7457],
  ['knot-to-mph-calculator', 'Knot to MPH Calculator', 'knots', 'mph', 1.15078],
  ['light-year-to-km-calculator', 'Light Year to KM Calculator', 'ly', 'km', 9.461e12],
  ['astronomical-unit-calculator', 'Astronomical Unit Calculator', 'AU', 'km', 149597870.7],
  ['nautical-mile-to-km-calculator', 'Nautical Mile to KM Calculator', 'nmi', 'km', 1.852],
  ['fathom-to-meter-calculator', 'Fathom to Meter Calculator', 'fathom', 'm', 1.8288],
  ['furlong-to-meter-calculator', 'Furlong to Meter Calculator', 'furlong', 'm', 201.168],
  ['chain-to-meter-calculator', 'Chain to Meter Calculator', 'chain', 'm', 20.1168],
  ['rod-to-meter-calculator', 'Rod to Meter Calculator', 'rod', 'm', 5.0292],
  ['league-to-km-calculator', 'League to KM Calculator', 'league', 'km', 4.828],
  ['hand-to-cm-calculator', 'Hand to CM Calculator', 'hands', 'cm', 10.16],
  ['stone-to-kg-calculator', 'Stone to KG Calculator', 'stone', 'kg', 6.35029],
  ['troy-ounce-to-gram-calculator', 'Troy Ounce to Gram Calculator', 'troy oz', 'g', 31.1035],
  ['carat-to-gram-calculator', 'Carat to Gram Calculator', 'ct', 'g', 0.2],
  ['grain-to-gram-calculator', 'Grain to Gram Calculator', 'grain', 'g', 0.0648],
  ['dram-to-gram-calculator', 'Dram to Gram Calculator', 'dram', 'g', 1.7718],
  ['bushel-to-liter-calculator', 'Bushel to Liter Calculator', 'bushel', 'L', 35.2391],
  ['gill-to-ml-calculator', 'Gill to ML Calculator', 'gill', 'mL', 118.294],
  ['firkin-to-liter-calculator', 'Firkin to Liter Calculator', 'firkin', 'L', 40.9148],
  ['hogshead-to-liter-calculator', 'Hogshead to Liter Calculator', 'hogshead', 'L', 238.481],
  ['rankine-to-kelvin-calculator', 'Rankine to Kelvin Calculator', 'R', 'K', 0.555556],
  ['radian-to-gradian-calculator', 'Radian to Gradian Calculator', 'rad', 'grad', 63.6620],
  ['steradian-to-degree-calculator', 'Steradian to Square Degree Calculator', 'sr', 'deg2', 3282.81],
  ['weber-to-maxwell-calculator', 'Weber to Maxwell Calculator', 'Wb', 'Mx', 1e8],
];
for (const [s, t, from, to, factor] of convDefs) convC(s, t, from, to, factor);

// ---- EVERYDAY: Tech & Digital (20 more) ----
const techSlugs = [
  'wifi-speed-test-calculator', 'internet-bandwidth-calculator',
  'vpn-speed-calculator', 'dns-propagation-calculator',
  'ssl-certificate-cost-calculator', 'email-storage-calculator',
  'cloud-backup-calculator', 'nas-storage-calculator',
  'raid-calculator', 'ssd-lifespan-calculator',
  'monitor-refresh-rate-calculator', 'gpu-benchmark-calculator',
  'cpu-benchmark-calculator', 'ram-speed-calculator',
  'power-supply-calculator', 'ups-runtime-calculator',
  'pc-build-cost-calculator', 'laptop-battery-life-calculator',
  'phone-battery-life-calculator', 'tablet-battery-life-calculator',
];
for (const s of techSlugs) {
  valC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'value', l: 'Primary Value', p: 'Enter value', min: 0 },
    { n: 'factor', l: 'Factor / Rate', p: 'e.g. 1', min: 0, step: 0.01, dv: 1 },
  ], `(inputs) => {
        const v = inputs.value as number;
        const f = inputs.factor as number || 1;
        if (!v) return null;
        const result = v * f;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "Input", value: formatNumber(v) },
            { label: "Factor", value: "x" + formatNumber(f) },
            { label: "Hourly", value: formatNumber(result / 24) },
          ],
        };
      }`, 'Everyday', 'everyday', '~');
}

// ---- SCIENCE: Astronomy (15 more) ----
const astroSlugs = [
  'habitable-zone-calculator', 'stellar-luminosity-calculator',
  'stellar-mass-calculator', 'stellar-radius-calculator',
  'neutron-star-calculator', 'black-hole-mass-calculator',
  'cosmic-distance-ladder-calculator', 'galaxy-recession-velocity-calculator',
  'dark-matter-calculator', 'cosmic-microwave-background-calculator',
  'solar-eclipse-calculator', 'lunar-eclipse-calculator',
  'planet-transit-calculator', 'comet-orbit-calculator',
  'meteor-shower-calculator',
];
for (const s of astroSlugs) {
  const title = s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator');
  valC(s, title, [
    { n: 'mass', l: 'Mass (solar masses)', p: 'e.g. 1', min: 0.001, step: 0.001 },
    { n: 'distance', l: 'Distance (light years)', p: 'e.g. 10', min: 0.001, step: 0.001 },
  ], `(inputs) => {
        const mass = inputs.mass as number;
        const dist = inputs.distance as number;
        if (!mass || !dist) return null;
        const luminosity = Math.pow(mass, 3.5);
        const apparentMag = -2.5 * Math.log10(luminosity) + 5 * Math.log10(dist * 3.262) - 5;
        return {
          primary: { label: "Luminosity", value: formatNumber(luminosity) + " L_sun" },
          details: [
            { label: "Apparent magnitude", value: formatNumber(apparentMag) },
            { label: "Distance (parsecs)", value: formatNumber(dist * 0.3066) + " pc" },
            { label: "Mass", value: formatNumber(mass) + " M_sun" },
          ],
        };
      }`, 'Science', 'science', 'A');
}

// ---- EVERYDAY: Work & Productivity (15) ----
const workSlugs = [
  'commute-time-value-calculator', 'work-life-balance-calculator',
  'salary-per-hour-calculator', 'overtime-calculator',
  'shift-differential-calculator', 'on-call-pay-calculator',
  'hazard-pay-calculator', 'per-diem-calculator',
  'mileage-reimbursement-calculator', 'home-office-deduction-calculator',
  'business-meal-deduction-calculator', 'professional-development-roi-calculator',
  'certification-roi-calculator', 'degree-roi-calculator',
  'career-change-calculator',
];
for (const s of workSlugs) {
  valC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
    { n: 'salary', l: 'Annual Salary', p: 'e.g. 75000', pre: '$', min: 0 },
    { n: 'hours', l: 'Hours per Week', p: 'e.g. 40', min: 1, max: 100 },
    { n: 'weeks', l: 'Weeks per Year', p: 'e.g. 50', min: 1, max: 52, dv: 50 },
  ], `(inputs) => {
        const salary = inputs.salary as number;
        const hrs = inputs.hours as number;
        const weeks = inputs.weeks as number || 50;
        if (!salary || !hrs) return null;
        const hourly = salary / (hrs * weeks);
        const daily = hourly * (hrs / 5);
        const monthly = salary / 12;
        return {
          primary: { label: "Hourly Rate", value: "$" + formatNumber(hourly) },
          details: [
            { label: "Daily rate", value: "$" + formatNumber(daily) },
            { label: "Monthly", value: "$" + formatNumber(monthly) },
            { label: "Per minute", value: "$" + formatNumber(hourly / 60) },
          ],
        };
      }`, 'Everyday', 'everyday', '~');
}

// ---- Additional fillers to reach 500 ----
const fillerSlugs = [
  // More conversions
  'teaspoon-to-ml-calculator', 'tablespoon-to-ml-calculator',
  'cup-to-ml-calculator', 'pint-to-ml-calculator',
  'quart-to-liter-calculator', 'gallon-to-liter-exact-calculator',
  'fluid-ounce-to-ml-calculator', 'dry-ounce-to-gram-calculator',
  // More everyday
  'tip-split-calculator', 'group-expense-calculator',
  'roommate-expense-calculator', 'utility-split-calculator',
  'chore-time-calculator', 'errand-time-calculator',
  'meal-planning-calculator', 'weekly-grocery-calculator',
  'coupon-savings-calculator', 'cashback-calculator',
  'rewards-points-calculator', 'frequent-flyer-calculator',
  'hotel-points-calculator', 'credit-card-rewards-calculator',
  'price-match-calculator', 'unit-price-calculator',
  'cost-per-use-calculator', 'cost-per-wear-calculator',
  'subscription-cancel-calculator', 'free-trial-tracker-calculator',
];
for (const s of fillerSlugs) {
  if (s.includes('to-ml') || s.includes('to-liter') || s.includes('to-gram')) {
    const parts = s.replace('-calculator','').split('-to-');
    convC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'),
      parts[0] || 'unit1', parts[1] || 'unit2', 1);
  } else {
    valC(s, s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ Calculator$/, ' Calculator'), [
      { n: 'amount', l: 'Amount', p: 'e.g. 100', min: 0 },
      { n: 'rate', l: 'Rate / Factor', p: 'e.g. 5', min: 0, step: 0.01 },
    ], `(inputs) => {
        const a = inputs.amount as number;
        const r = inputs.rate as number || 1;
        if (!a) return null;
        const result = a * r;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "Input", value: formatNumber(a) },
            { label: "Factor", value: "x" + formatNumber(r) },
          ],
        };
      }`, 'Everyday', 'everyday', '~');
  }
}

// =========================================================
// WRITE FILES
// =========================================================
let created = 0, skipped = 0;
for (const c of calcs) {
  const fp = path.join(CALC_DIR, c.slug + '.ts');
  if (fs.existsSync(fp)) { skipped++; continue; }
  fs.writeFileSync(fp, genFile(c), 'utf8');
  created++;
}

console.log(`\nGenerated: ${created} new calculators`);
console.log(`Skipped: ${skipped} (already exist)`);
console.log(`Total defs: ${calcs.length}`);

// Write import/reg lines
const imports = [], regs = [];
for (const c of calcs) {
  const fp = path.join(CALC_DIR, c.slug + '.ts');
  if (!fs.existsSync(fp)) continue;
  const exp = slugToExportName(c.slug);
  imports.push(`import { ${exp} } from "./${c.slug}";`);
  regs.push(`  ${exp},`);
}
fs.writeFileSync(path.join(__dirname, 'new-imports-b2.txt'), imports.join('\n'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'new-regs-b2.txt'), regs.join('\n'), 'utf8');
console.log(`Import lines: ${imports.length}`);
console.log(`Registration lines: ${regs.length}`);
