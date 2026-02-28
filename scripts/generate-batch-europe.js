const fs = require('fs');
const path = require('path');
const CALC_DIR = path.join(__dirname, '..', 'src', 'calculators');

const existingSlugs = new Set();
for (const file of fs.readdirSync(CALC_DIR).filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts')) {
  const m = fs.readFileSync(path.join(CALC_DIR, file), 'utf8').match(/slug:\s*"([^"]+)"/);
  if (m) existingSlugs.add(m[1]);
}
console.log(`Existing: ${existingSlugs.size}`);

function eName(slug) {
  const c = slug.replace(/^(\d)/, 'n$1').replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return c.endsWith('Calculator') ? c : c + 'Calculator';
}

const calcs = [];

function addCalc(slug, title, desc, kw, fields, calcBody, faq, formula, rel) {
  calcs.push({ slug, title, desc, cat: 'Finance', cs: 'finance', icon: '$', kw, fields, calcBody, faq, formula, rel: rel || ['tax-calculator','salary-calculator'] });
}

function addTaxCalc(country, countryCode, currency, currencySymbol, brackets, sdInfo, vatRate, socialRates, extraFaq, extraFormula) {
  addCalc(`${countryCode}-income-tax-calculator`, `${country} Income Tax Calculator`,
    `Free ${country} income tax calculator. Calculate your tax liability with current progressive brackets and deductions.`,
    [`${country.toLowerCase()} income tax calculator`, `${country.toLowerCase()} tax calculator`, `${countryCode} tax calculator`],
    [
      `{ name: "income", label: "Annual Taxable Income", type: "number", prefix: "${currencySymbol}", min: 0 }`,
    ],
    `(inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [${brackets.map(b => `{l:${b.l},r:${b.r}}`).join(',')}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "${currencySymbol}" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "${currencySymbol}" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "${currencySymbol}" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "${currencySymbol}" + formatNumber((income - tax) / 12) },
        ],
        ${sdInfo ? `note: "${sdInfo}",` : ''}
      };
    }`,
    extraFaq || [
      { q: `How is income tax calculated in ${country}?`, a: `${country} uses a progressive tax system where higher income portions are taxed at higher rates.` },
      { q: `What is the top tax rate in ${country}?`, a: `The highest marginal rate is ${(brackets[brackets.length-1].r * 100)}%.` },
    ],
    extraFormula || `Tax = Sum of (income in bracket × rate)`
  );

  if (vatRate) {
    addCalc(`${countryCode}-vat-calculator`, `${country} VAT Calculator`,
      `Free ${country} VAT calculator at ${vatRate}%. Calculate VAT amount and total price including tax.`,
      [`${country.toLowerCase()} vat calculator`, `${countryCode} vat calculator`, `${country.toLowerCase()} tax calculator`],
      [
        `{ name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "${currencySymbol}", min: 0 }`,
        `{ name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" }`,
      ],
      `(inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = ${vatRate} / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "${currencySymbol}" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (${vatRate}%)", value: "${currencySymbol}" + formatNumber(vat) },
              { label: "Base amount", value: "${currencySymbol}" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "${currencySymbol}" + formatNumber(base) },
            details: [
              { label: "VAT amount (${vatRate}%)", value: "${currencySymbol}" + formatNumber(vat) },
              { label: "Total amount", value: "${currencySymbol}" + formatNumber(amount) },
            ],
          };
        }
      }`,
      [{ q: `What is the VAT rate in ${country}?`, a: `The standard VAT rate in ${country} is ${vatRate}%.` },
       { q: `How to calculate VAT?`, a: `To add VAT: multiply amount by ${vatRate/100}. To remove VAT from total: divide by ${1 + vatRate/100}.` }],
      `VAT = Amount × ${vatRate}%`
    );
  }

  if (socialRates) {
    addCalc(`${countryCode}-salary-calculator`, `${country} Salary Calculator`,
      `Free ${country} gross to net salary calculator. Calculate take-home pay after tax and social contributions.`,
      [`${country.toLowerCase()} salary calculator`, `${countryCode} gross to net calculator`, `${country.toLowerCase()} take home pay`],
      [
        `{ name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "${currencySymbol}", min: 0 }`,
      ],
      `(inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = ${socialRates.employee};
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [${brackets.map(b => `{l:${b.l},r:${b.r}}`).join(',')}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "${currencySymbol}" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "${currencySymbol}" + formatNumber(gross) },
            { label: "Social contributions (${(socialRates.employee * 100).toFixed(1)}%)", value: "${currencySymbol}" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "${currencySymbol}" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "${currencySymbol}" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "${currencySymbol}" + formatNumber(net * 12) },
          ],
        };
      }`,
      [{ q: `How much tax do I pay on my salary in ${country}?`, a: `Your total deductions include social contributions (${(socialRates.employee * 100).toFixed(1)}% employee share) plus progressive income tax.` },
       { q: `What is the take-home pay in ${country}?`, a: `Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate.` }],
      `Net = Gross - Social (${(socialRates.employee * 100).toFixed(1)}%) - Income Tax (progressive)`
    );
  }
}

// =============================================================================
// UNITED KINGDOM
// =============================================================================
addTaxCalc('United Kingdom', 'uk', 'GBP', '£',
  [{l:12570,r:0},{l:50270,r:0.20},{l:125140,r:0.40},{l:Infinity,r:0.45}],
  'Personal Allowance: £12,570 (tapers £1 for every £2 above £100K). Scottish rates differ.',
  20, { employee: 0.08 }
);

addCalc('uk-stamp-duty-calculator', 'UK Stamp Duty (SDLT) Calculator',
  'Free UK Stamp Duty Land Tax calculator 2025. Calculate SDLT on residential property purchases in England and Northern Ireland.',
  ['uk stamp duty calculator', 'sdlt calculator', 'stamp duty calculator 2025'],
  [
    '{ name: "price", label: "Property Price", type: "number", prefix: "£", min: 0 }',
    '{ name: "ftb", label: "Buyer Type", type: "select", options: [{ label: "Standard purchase", value: "standard" }, { label: "First-time buyer", value: "ftb" }, { label: "Additional property", value: "additional" }], defaultValue: "standard" }',
  ],
  `(inputs) => {
      const price = inputs.price as number;
      const type = inputs.ftb as string;
      if (!price || price <= 0) return null;
      let bands;
      if (type === "ftb" && price <= 625000) {
        bands = [{l:425000,r:0},{l:625000,r:0.05}];
      } else if (type === "additional") {
        bands = [{l:250000,r:0.05},{l:925000,r:0.10},{l:1500000,r:0.15},{l:Infinity,r:0.17}];
      } else {
        bands = [{l:250000,r:0},{l:925000,r:0.05},{l:1500000,r:0.10},{l:Infinity,r:0.12}];
      }
      let tax = 0, rem = price, prev = 0;
      for (const s of bands) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Stamp Duty", value: "£" + formatNumber(tax) },
        details: [
          { label: "Property price", value: "£" + formatNumber(price) },
          { label: "Effective rate", value: formatNumber((tax / price) * 100) + "%" },
          { label: "Total cost", value: "£" + formatNumber(price + tax) },
        ],
        note: type === "ftb" ? "First-time buyer relief: 0% up to £425K, 5% on £425-625K. Not available above £625K." : type === "additional" ? "Additional property surcharge: +5% on all bands (from April 2025)." : "Standard residential SDLT rates from April 2025.",
      };
    }`,
  [{ q: 'What are the SDLT rates for 2025?', a: 'Standard: 0% up to £250K, 5% (£250-925K), 10% (£925K-1.5M), 12% above £1.5M. First-time buyers: 0% up to £425K, 5% up to £625K.' },
   { q: 'Do first-time buyers pay stamp duty?', a: 'First-time buyers pay no SDLT on properties up to £425,000, and 5% on the portion between £425K-£625K. Relief is not available above £625K.' }],
  'SDLT = Sum of (portion in each band × rate)'
);

addCalc('uk-student-loan-calculator', 'UK Student Loan Repayment Calculator',
  'Free UK student loan repayment calculator. Calculate monthly and annual repayments for Plan 1, 2, 4, 5 and postgraduate loans.',
  ['uk student loan calculator', 'student loan repayment calculator', 'plan 2 student loan calculator'],
  [
    '{ name: "salary", label: "Annual Gross Salary", type: "number", prefix: "£", min: 0 }',
    '{ name: "plan", label: "Loan Plan", type: "select", options: [{ label: "Plan 2 (England/Wales, after 2012)", value: "plan2" }, { label: "Plan 1 (pre-2012 / NI / Scotland pre-2023)", value: "plan1" }, { label: "Plan 4 (Scotland, from 2023)", value: "plan4" }, { label: "Plan 5 (England/Wales, from 2023)", value: "plan5" }, { label: "Postgraduate Loan", value: "pg" }], defaultValue: "plan2" }',
  ],
  `(inputs) => {
      const salary = inputs.salary as number;
      const plan = inputs.plan as string;
      if (!salary || salary <= 0) return null;
      const thresholds: Record<string, number> = { plan1: 24990, plan2: 27295, plan4: 31395, plan5: 25000, pg: 21000 };
      const rates: Record<string, number> = { plan1: 0.09, plan2: 0.09, plan4: 0.09, plan5: 0.09, pg: 0.06 };
      const threshold = thresholds[plan] || 27295;
      const rate = rates[plan] || 0.09;
      const annual = Math.max(0, salary - threshold) * rate;
      return {
        primary: { label: "Annual Repayment", value: "£" + formatNumber(annual) },
        details: [
          { label: "Monthly repayment", value: "£" + formatNumber(annual / 12) },
          { label: "Repayment threshold", value: "£" + formatNumber(threshold) },
          { label: "Rate", value: (rate * 100) + "%" },
          { label: "Income above threshold", value: "£" + formatNumber(Math.max(0, salary - threshold)) },
        ],
        note: "Repayments are " + (rate * 100) + "% of income above £" + formatNumber(threshold) + ". Deducted automatically via PAYE.",
      };
    }`,
  [{ q: 'When do I start repaying my student loan?', a: 'You repay 9% (6% for postgrad) of income above the threshold. Plan 2: £27,295/year. Deducted via PAYE from your salary.' },
   { q: 'What is the difference between Plan 1 and Plan 2?', a: 'Plan 1 (pre-2012): threshold £24,990, written off after 25 years. Plan 2 (post-2012): threshold £27,295, written off after 30 years.' }],
  'Repayment = (Salary - Threshold) × 9% (or 6% for postgrad)'
);

addCalc('uk-dividend-tax-calculator', 'UK Dividend Tax Calculator',
  'Free UK dividend tax calculator 2025. Calculate tax on dividends with the £500 tax-free allowance and current rates.',
  ['uk dividend tax calculator', 'dividend tax calculator 2025', 'uk dividend allowance'],
  [
    '{ name: "dividends", label: "Annual Dividends", type: "number", prefix: "£", min: 0 }',
    '{ name: "otherIncome", label: "Other Taxable Income", type: "number", prefix: "£", min: 0, defaultValue: 0 }',
  ],
  `(inputs) => {
      const divs = inputs.dividends as number;
      const other = (inputs.otherIncome as number) || 0;
      if (!divs || divs <= 0) return null;
      const allowance = 500;
      const taxable = Math.max(0, divs - allowance);
      const totalIncome = other + divs;
      let tax = 0;
      const basicLimit = 50270;
      const higherLimit = 125140;
      const usedByOther = other;
      let remaining = taxable;
      const basicLeft = Math.max(0, basicLimit - usedByOther);
      const higherLeft = Math.max(0, higherLimit - usedByOther - basicLeft);
      const inBasic = Math.min(remaining, basicLeft);
      remaining -= inBasic;
      const inHigher = Math.min(remaining, higherLeft > 0 ? higherLimit - basicLimit : 0);
      remaining -= inHigher;
      tax = inBasic * 0.0875 + inHigher * 0.3375 + remaining * 0.3935;
      return {
        primary: { label: "Dividend Tax", value: "£" + formatNumber(tax) },
        details: [
          { label: "Total dividends", value: "£" + formatNumber(divs) },
          { label: "Tax-free allowance", value: "£" + formatNumber(allowance) },
          { label: "Taxable dividends", value: "£" + formatNumber(taxable) },
          { label: "Effective rate", value: formatNumber(divs > 0 ? (tax / divs) * 100 : 0) + "%" },
        ],
        note: "Rates: 8.75% (basic), 33.75% (higher), 39.35% (additional). £500 tax-free allowance.",
      };
    }`,
  [{ q: 'What is the dividend tax-free allowance?', a: 'The dividend allowance is £500 per year (2024/25). Dividends within this allowance are tax-free regardless of your tax band.' },
   { q: 'What are UK dividend tax rates?', a: 'Basic rate: 8.75%, Higher rate: 33.75%, Additional rate: 39.35%. These apply after the £500 allowance.' }],
  'Dividend Tax = (Dividends - £500 allowance) × rate based on income band'
);

// =============================================================================
// FRANCE
// =============================================================================
addTaxCalc('France', 'france', 'EUR', '€',
  [{l:11294,r:0},{l:28797,r:0.11},{l:82341,r:0.30},{l:177106,r:0.41},{l:Infinity,r:0.45}],
  'Per-share brackets (quotient familial). Single=1 share, couple=2, +0.5 per child. Brackets shown for 1 share.',
  20, { employee: 0.22 }
);

addCalc('france-auto-entrepreneur-calculator', 'France Auto-Entrepreneur Calculator',
  'Free French auto-entrepreneur (micro-enterprise) calculator. Calculate social charges, income tax, and net revenue.',
  ['france auto entrepreneur calculator', 'micro entreprise calculator', 'auto entrepreneur charges sociales'],
  [
    '{ name: "revenue", label: "Quarterly Revenue", type: "number", prefix: "€", min: 0 }',
    '{ name: "activity", label: "Activity Type", type: "select", options: [{ label: "Services (BNC) - 21.1%", value: "bnc" }, { label: "Commercial (BIC vente) - 12.3%", value: "bic_vente" }, { label: "Craft/Commercial services (BIC) - 21.2%", value: "bic_service" }], defaultValue: "bnc" }',
    '{ name: "versement", label: "Versement libératoire", type: "select", options: [{ label: "No", value: "no" }, { label: "Yes", value: "yes" }], defaultValue: "no" }',
  ],
  `(inputs) => {
      const rev = inputs.revenue as number;
      const act = inputs.activity as string;
      const vl = inputs.versement as string;
      if (!rev || rev <= 0) return null;
      const rates: Record<string, number> = { bnc: 0.211, bic_vente: 0.123, bic_service: 0.212 };
      const vlRates: Record<string, number> = { bnc: 0.022, bic_vente: 0.01, bic_service: 0.017 };
      const socialRate = rates[act] || 0.211;
      const social = rev * socialRate;
      const vlTax = vl === "yes" ? rev * (vlRates[act] || 0.022) : 0;
      const net = rev - social - vlTax;
      return {
        primary: { label: "Net Revenue", value: "€" + formatNumber(net) },
        details: [
          { label: "Gross revenue", value: "€" + formatNumber(rev) },
          { label: "Social charges (" + (socialRate * 100).toFixed(1) + "%)", value: "€" + formatNumber(social) },
          { label: "Versement libératoire", value: vl === "yes" ? "€" + formatNumber(vlTax) : "N/A" },
          { label: "Annual net (×4)", value: "€" + formatNumber(net * 4) },
          { label: "Monthly net", value: "€" + formatNumber(net * 4 / 12) },
        ],
        note: "2025 rates. Revenue ceilings: €188,700 (commercial), €77,700 (services). CFE (business tax) applies from 2nd year.",
      };
    }`,
  [{ q: 'What are auto-entrepreneur social charges?', a: 'BNC services: 21.1%, Commercial sales (BIC): 12.3%, Craft/services (BIC): 21.2%. Paid quarterly or monthly on actual revenue.' },
   { q: 'What is versement libératoire?', a: 'Optional flat income tax payment of 1-2.2% on revenue instead of standard income tax. Available if prior-year income is below ~€28K (single).' }],
  'Net = Revenue - Social Charges (12.3-21.2%) - Optional Versement Libératoire (1-2.2%)'
);

// =============================================================================
// ITALY
// =============================================================================
addTaxCalc('Italy', 'italy', 'EUR', '€',
  [{l:15000,r:0.23},{l:28000,r:0.25},{l:50000,r:0.35},{l:Infinity,r:0.43}],
  '2025 IRPEF brackets. Regional surcharge (0.9-3.33%) and municipal surcharge (0-0.9%) apply additionally.',
  22, { employee: 0.0919 }
);

addCalc('italy-regime-forfettario-calculator', 'Italy Regime Forfettario Calculator',
  'Free Italy flat-rate regime (regime forfettario) calculator. Calculate taxes for freelancers and sole proprietors under the simplified regime.',
  ['italy regime forfettario calculator', 'partita iva forfettario calculator', 'flat tax italy freelancer'],
  [
    '{ name: "revenue", label: "Annual Revenue", type: "number", prefix: "€", min: 0 }',
    '{ name: "activity", label: "Activity Coefficient", type: "select", options: [{ label: "Professional services - 78%", value: "78" }, { label: "Commerce - 40%", value: "40" }, { label: "Food/Hospitality - 40%", value: "40" }, { label: "Construction - 86%", value: "86" }, { label: "Intermediaries - 62%", value: "62" }, { label: "IT/Consulting - 67%", value: "67" }], defaultValue: "78" }',
    '{ name: "startup", label: "Startup (first 5 years)?", type: "select", options: [{ label: "No - 15% rate", value: "no" }, { label: "Yes - 5% rate", value: "yes" }], defaultValue: "no" }',
  ],
  `(inputs) => {
      const revenue = inputs.revenue as number;
      const coeff = parseFloat(inputs.activity as string) / 100;
      const startup = inputs.startup as string;
      if (!revenue || revenue <= 0) return null;
      const taxable = revenue * coeff;
      const taxRate = startup === "yes" ? 0.05 : 0.15;
      const inps = taxable * 0.2607;
      const taxableAfterInps = taxable - inps;
      const tax = taxableAfterInps * taxRate;
      const net = revenue - inps - tax;
      return {
        primary: { label: "Net Income", value: "€" + formatNumber(net) },
        details: [
          { label: "Revenue", value: "€" + formatNumber(revenue) },
          { label: "Taxable base (coeff " + (coeff * 100) + "%)", value: "€" + formatNumber(taxable) },
          { label: "INPS contributions (26.07%)", value: "€" + formatNumber(inps) },
          { label: "Flat tax (" + (taxRate * 100) + "%)", value: "€" + formatNumber(tax) },
          { label: "Effective rate", value: formatNumber(((inps + tax) / revenue) * 100) + "%" },
        ],
        note: "Revenue ceiling: €85,000. Startup 5% rate for first 5 years if eligible. INPS Gestione Separata: 26.07%.",
      };
    }`,
  [{ q: 'What is regime forfettario?', a: 'A simplified flat-rate tax regime for freelancers/sole proprietors with revenue under €85K. Tax: 15% (or 5% for startups). No VAT charged, simplified accounting.' },
   { q: 'What is the profitability coefficient?', a: 'A fixed percentage applied to revenue to determine taxable income. Varies by activity type: 78% for professionals, 40% for commerce, 67% for IT consultants, etc.' }],
  'Tax = Revenue × Profitability Coefficient × 15% (or 5% startup). INPS = Taxable × 26.07%'
);

// =============================================================================
// SPAIN
// =============================================================================
addTaxCalc('Spain', 'spain', 'EUR', '€',
  [{l:12450,r:0.19},{l:20200,r:0.24},{l:35200,r:0.30},{l:60000,r:0.37},{l:300000,r:0.45},{l:Infinity,r:0.47}],
  '2025 combined state + general regional IRPF brackets. Actual rates vary by autonomous community.',
  21, { employee: 0.0635 }
);

addCalc('spain-autonomo-calculator', 'Spain Autónomo Calculator',
  'Free Spain self-employed (autónomo) calculator. Calculate social security contributions under the new income-based system.',
  ['spain autonomo calculator', 'cuota autonomo 2025 calculator', 'spain self employed calculator'],
  [
    '{ name: "netIncome", label: "Monthly Net Income", type: "number", prefix: "€", min: 0 }',
  ],
  `(inputs) => {
      const income = inputs.netIncome as number;
      if (!income && income !== 0) return null;
      const brackets = [
        {max:670,quota:230},{max:900,quota:260},{max:1166.70,quota:275},{max:1300,quota:291},
        {max:1500,quota:294},{max:1700,quota:294},{max:1850,quota:310},{max:2030,quota:315},
        {max:2330,quota:320},{max:2760,quota:330},{max:3190,quota:350},{max:3620,quota:370},
        {max:4050,quota:390},{max:6000,quota:420},{max:Infinity,quota:530}
      ];
      const bracket = brackets.find(b => income <= b.max) || brackets[brackets.length - 1];
      const annual = bracket.quota * 12;
      return {
        primary: { label: "Monthly Cuota", value: "€" + formatNumber(bracket.quota) },
        details: [
          { label: "Net income bracket", value: "up to €" + (bracket.max === Infinity ? "6,000+" : formatNumber(bracket.max)) },
          { label: "Annual contributions", value: "€" + formatNumber(annual) },
          { label: "Income after cuota", value: "€" + formatNumber(Math.max(0, income - bracket.quota)) },
        ],
        note: "2025 income-based contribution system. Transitional period: actual brackets may be adjusted. Tarifa plana: €80/month for first 12 months for new autónomos.",
      };
    }`,
  [{ q: 'How much does an autónomo pay in Spain?', a: 'From 2025, contributions are based on net income: from €230/month (income ≤€670) to €530/month (income >€6,000). The old flat-rate system has been replaced.' },
   { q: 'What is the tarifa plana?', a: 'New autónomos pay a reduced flat rate of €80/month for the first 12 months, extendable to 24 months if income stays below minimum wage.' }],
  'Monthly Cuota = Income-based bracket (€230-€530/month in 2025)'
);

// =============================================================================
// POLAND
// =============================================================================
addTaxCalc('Poland', 'poland', 'PLN', 'zł',
  [{l:120000,r:0.12},{l:Infinity,r:0.32}],
  '2025 PIT brackets. Tax-free amount: 30,000 zł. Middle-class relief abolished from 2025.',
  23, { employee: 0.1371 }
);

// =============================================================================
// BELGIUM
// =============================================================================
addTaxCalc('Belgium', 'belgium', 'EUR', '€',
  [{l:15820,r:0.25},{l:27920,r:0.40},{l:48320,r:0.45},{l:Infinity,r:0.50}],
  'Federal IPP/PB brackets. Tax-free amount: €10,570. Municipal surcharge (0-9%) applies on top.',
  21, { employee: 0.1307 }
);

// =============================================================================
// AUSTRIA
// =============================================================================
addTaxCalc('Austria', 'austria', 'EUR', '€',
  [{l:12816,r:0},{l:21818,r:0.20},{l:35218,r:0.30},{l:69218,r:0.40},{l:103718,r:0.48},{l:1000000,r:0.50},{l:Infinity,r:0.55}],
  '2025 brackets. Tax-free amount (Freibetrag): €12,816. Includes Zuschlag (55%) for income above €1M.',
  20, { employee: 0.18 }
);

// =============================================================================
// IRELAND
// =============================================================================
addTaxCalc('Ireland', 'ireland', 'EUR', '€',
  [{l:44000,r:0.20},{l:Infinity,r:0.40}],
  'Standard rate band: €44,000 (single). Married (one earner): €53,000. USC and PRSI apply additionally.',
  23, { employee: 0.04 }
);

// =============================================================================
// PORTUGAL
// =============================================================================
addTaxCalc('Portugal', 'portugal', 'EUR', '€',
  [{l:7703,r:0.1325},{l:11623,r:0.18},{l:16472,r:0.23},{l:21321,r:0.26},{l:27146,r:0.3275},{l:39791,r:0.37},{l:51997,r:0.435},{l:81199,r:0.45},{l:Infinity,r:0.48}],
  '2025 IRS brackets. Non-habitual resident (NHR) regime: flat 20% on Portuguese-source employment income (closed to new applicants from 2024).',
  23, { employee: 0.11 }
);

// =============================================================================
// CZECH REPUBLIC
// =============================================================================
addTaxCalc('Czech Republic', 'czech-republic', 'CZK', 'Kč',
  [{l:1935552,r:0.15},{l:Infinity,r:0.23}],
  '2025 brackets. 23% rate applies above 36× average wage (~CZK 1,935,552). Employee social/health: 11%.',
  21, { employee: 0.11 }
);

// =============================================================================
// GREECE
// =============================================================================
addTaxCalc('Greece', 'greece', 'EUR', '€',
  [{l:10000,r:0.09},{l:20000,r:0.22},{l:30000,r:0.28},{l:40000,r:0.36},{l:Infinity,r:0.44}],
  '2025 income tax scale. Solidarity contribution suspended. Freelancers may use flat 9% for first 3 years.',
  24, { employee: 0.1387 }
);

// =============================================================================
// HUNGARY
// =============================================================================
addTaxCalc('Hungary', 'hungary', 'HUF', 'Ft',
  [{l:Infinity,r:0.15}],
  'Flat 15% personal income tax (SZJA). Social contribution: 13% employer, 18.5% employee (pension 10% + health 8.5%).',
  27, { employee: 0.185 }
);

// =============================================================================
// ROMANIA
// =============================================================================
addTaxCalc('Romania', 'romania', 'RON', 'lei',
  [{l:Infinity,r:0.10}],
  'Flat 10% income tax. Employee contributions: CAS (pension) 25% + CASS (health) 10% = 35% total.',
  19, { employee: 0.35 }
);

// =============================================================================
// NETHERLANDS
// =============================================================================
addTaxCalc('Netherlands', 'netherlands', 'EUR', '€',
  [{l:75518,r:0.3697},{l:Infinity,r:0.4950}],
  'Box 1 rates (2025). Social premiums included in 36.97%. General tax credit ~€3,362 (phases out). Box 2 (shares): 24.5%/33%. Box 3 (savings): deemed return taxed at 36%.',
  21, null
);

addCalc('netherlands-30-ruling-calculator', 'Netherlands 30% Ruling Calculator',
  'Free Netherlands 30% ruling calculator. Calculate tax savings for qualifying expats with the 30% tax-free allowance.',
  ['netherlands 30 ruling calculator', '30 percent ruling calculator', 'dutch expat tax calculator'],
  [
    '{ name: "gross", label: "Annual Gross Salary", type: "number", prefix: "€", min: 0 }',
  ],
  `(inputs) => {
      const gross = inputs.gross as number;
      if (!gross || gross <= 0) return null;
      const ruling = gross * 0.30;
      const taxable = gross - ruling;
      const brackets = [{l:75518,r:0.3697},{l:Infinity,r:0.4950}];
      let taxWith = 0, rem1 = taxable, prev1 = 0;
      for (const s of brackets) { const t = Math.min(rem1, s.l - prev1); if (t <= 0) break; taxWith += t * s.r; rem1 -= t; prev1 = s.l; }
      let taxWithout = 0, rem2 = gross, prev2 = 0;
      for (const s of brackets) { const t = Math.min(rem2, s.l - prev2); if (t <= 0) break; taxWithout += t * s.r; rem2 -= t; prev2 = s.l; }
      const saving = taxWithout - taxWith;
      return {
        primary: { label: "Annual Tax Saving", value: "€" + formatNumber(saving) },
        details: [
          { label: "Tax-free allowance (30%)", value: "€" + formatNumber(ruling) },
          { label: "Taxable salary", value: "€" + formatNumber(taxable) },
          { label: "Tax with 30% ruling", value: "€" + formatNumber(taxWith) },
          { label: "Tax without ruling", value: "€" + formatNumber(taxWithout) },
          { label: "Monthly net (with ruling)", value: "€" + formatNumber((gross - taxWith) / 12) },
        ],
        note: "30% ruling lasts max 5 years. Minimum salary requirement: €46,107 (2025), or €35,048 for under-30 with MSc. Capped at €233,000 from 2024.",
      };
    }`,
  [{ q: 'What is the 30% ruling?', a: 'A Dutch tax benefit for expat workers: 30% of gross salary is tax-free for up to 5 years. Requires minimum salary of €46,107 and specific expertise not readily available in NL.' },
   { q: 'Is the 30% ruling capped?', a: 'From 2024, the ruling is capped at the Balkenende norm (~€233,000). The first 20 months: 30%, next 20 months: 20%, final 20 months: 10%.' }],
  'Tax saving = Tax on full salary - Tax on (salary × 70%)'
);

// =============================================================================
// SWEDEN
// =============================================================================
addTaxCalc('Sweden', 'sweden', 'SEK', 'kr',
  [{l:22200,r:0},{l:598500,r:0.32},{l:Infinity,r:0.52}],
  'Municipal tax ~32% (average, varies 29-35%). State marginal tax 20% above SEK 598,500. Basic deduction ~SEK 22,200.',
  25, { employee: 0.07 }
);

// =============================================================================
// DENMARK
// =============================================================================
addTaxCalc('Denmark', 'denmark', 'DKK', 'kr',
  [{l:49700,r:0},{l:588900,r:0.37},{l:Infinity,r:0.52}],
  'Approximate total: AM-bidrag 8% (deducted first) + bundskat 12.09% + municipal ~25%. Top tax 15% above DKK 588,900. Personal deduction ~DKK 49,700.',
  25, { employee: 0.08 }
);

// =============================================================================
// NORWAY
// =============================================================================
addTaxCalc('Norway', 'norway', 'NOK', 'kr',
  [{l:88250,r:0},{l:208050,r:0.22},{l:292850,r:0.237},{l:670000,r:0.26},{l:937900,r:0.356},{l:1350000,r:0.386},{l:Infinity,r:0.396}],
  'Combined ordinary tax (22%) + trinnskatt (bracket surtax). Standard deduction ~NOK 88,250. Trinnskatt: 1.7-17.6% in steps.',
  25, { employee: 0.078 }
);

// =============================================================================
// FINLAND
// =============================================================================
addTaxCalc('Finland', 'finland', 'EUR', '€',
  [{l:19900,r:0},{l:29700,r:0.26},{l:49000,r:0.37},{l:85800,r:0.41},{l:Infinity,r:0.51}],
  'Approximate total = state progressive tax + municipal tax (~20%). Basic deduction ~€19,900. Church tax (1-2%) not included.',
  25.5, { employee: 0.0715 }
);

// =============================================================================
// SWITZERLAND
// =============================================================================
addTaxCalc('Switzerland', 'switzerland', 'CHF', 'CHF',
  [{l:17800,r:0},{l:31600,r:0.01},{l:55200,r:0.02},{l:103600,r:0.05},{l:176000,r:0.09},{l:Infinity,r:0.115}],
  'Federal tax only! Cantonal/communal tax adds 10-35% depending on location (Zurich ~24%, Geneva ~33%, Zug ~10%). Total effective rate much higher.',
  8.1, { employee: 0.0625 }
);

// =============================================================================
// PAN-EUROPEAN
// =============================================================================
addCalc('eu-vat-rates-calculator', 'EU VAT Rates Comparison Calculator',
  'Free EU VAT rate comparison tool. Calculate VAT amounts across all EU member states and compare effective costs.',
  ['eu vat rates comparison', 'european vat calculator', 'vat rates europe 2025'],
  [
    '{ name: "amount", label: "Base Amount", type: "number", prefix: "€", min: 0 }',
    '{ name: "country", label: "Country", type: "select", options: [{ label: "Hungary - 27%", value: "27" }, { label: "Denmark - 25%", value: "25" }, { label: "Sweden - 25%", value: "25" }, { label: "Finland - 25.5%", value: "25.5" }, { label: "Greece - 24%", value: "24" }, { label: "Ireland - 23%", value: "23" }, { label: "Poland - 23%", value: "23" }, { label: "Portugal - 23%", value: "23" }, { label: "Italy - 22%", value: "22" }, { label: "Belgium - 21%", value: "21" }, { label: "Netherlands - 21%", value: "21" }, { label: "Spain - 21%", value: "21" }, { label: "Czech Republic - 21%", value: "21" }, { label: "Austria - 20%", value: "20" }, { label: "France - 20%", value: "20" }, { label: "UK - 20%", value: "20" }, { label: "Germany - 19%", value: "19" }, { label: "Romania - 19%", value: "19" }, { label: "Switzerland - 8.1%", value: "8.1" }], defaultValue: "21" }',
  ],
  `(inputs) => {
      const amount = inputs.amount as number;
      const rate = parseFloat(inputs.country as string);
      if (!amount || amount <= 0) return null;
      const vat = amount * rate / 100;
      const allRates = [27,25.5,25,24,23,22,21,20,19,8.1];
      const comparison = allRates.map(r => ({ label: r + "% VAT", value: "€" + formatNumber(amount * r / 100) }));
      return {
        primary: { label: "VAT Amount", value: "€" + formatNumber(vat) },
        details: [
          { label: "Total incl. VAT", value: "€" + formatNumber(amount + vat) },
          { label: "Selected rate", value: rate + "%" },
          { label: "Lowest EU VAT (Luxembourg 17%)", value: "€" + formatNumber(amount * 0.17) },
          { label: "Highest EU VAT (Hungary 27%)", value: "€" + formatNumber(amount * 0.27) },
          { label: "Difference (high-low)", value: "€" + formatNumber(amount * 0.10) },
        ],
        note: "Standard VAT rates as of 2025. Reduced rates exist for specific goods/services in each country.",
      };
    }`,
  [{ q: 'Which EU country has the highest VAT?', a: 'Hungary at 27%, followed by Denmark, Sweden, and Croatia at 25%.' },
   { q: 'Which EU country has the lowest VAT?', a: 'Luxembourg at 17%, followed by Malta at 18%, and Germany and Romania at 19%.' }],
  'VAT = Base Amount × Country VAT Rate'
);

// =============================================================================
// FILE GENERATOR
// =============================================================================
function genFile(c) {
  return `import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ${eName(c.slug)}: CalculatorDefinition = {
  slug: "${c.slug}",
  title: "${c.title}",
  description: "${c.desc.replace(/"/g, '\\"')}",
  category: "${c.cat}",
  categorySlug: "${c.cs}",
  icon: "${c.icon}",
  keywords: [${c.kw.map(k => `"${k}"`).join(', ')}],
  variants: [{
    id: "standard",
    name: "${c.title.replace(' Calculator', '')}",
    description: "${c.desc.split('.')[0].replace(/"/g, '\\"')}",
    fields: [
${c.fields.map(f => '      ' + f + ',').join('\n')}
    ],
    calculate: ${c.calcBody},
  }],
  relatedSlugs: [${c.rel.map(r => `"${r}"`).join(', ')}],
  faq: [
    { question: "${c.faq[0].q.replace(/"/g, '\\"')}", answer: "${c.faq[0].a.replace(/"/g, '\\"')}" },
    { question: "${c.faq[1].q.replace(/"/g, '\\"')}", answer: "${c.faq[1].a.replace(/"/g, '\\"')}" },
  ],
  formula: "${c.formula.replace(/"/g, '\\"')}",
};
`;
}

let generated = 0, skipped = 0;
const imports = [], regs = [];

for (const c of calcs) {
  if (existingSlugs.has(c.slug)) { skipped++; continue; }
  const filePath = path.join(CALC_DIR, c.slug + '.ts');
  if (fs.existsSync(filePath)) { skipped++; continue; }
  fs.writeFileSync(filePath, genFile(c));
  imports.push(`import { ${eName(c.slug)} } from "./${c.slug}";`);
  regs.push(`  ${eName(c.slug)},`);
  generated++;
}

fs.writeFileSync(path.join(__dirname, 'new-imports-europe.txt'), imports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-europe.txt'), regs.join('\n'));
console.log(`\nGenerated: ${generated} | Skipped: ${skipped}`);
console.log(`Total definitions: ${calcs.length}`);
console.log(`Imports saved to: scripts/new-imports-europe.txt`);
console.log(`Registry saved to: scripts/new-regs-europe.txt`);
