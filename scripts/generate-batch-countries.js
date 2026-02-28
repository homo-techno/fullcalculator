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

// Each calc: { slug, title, desc, cat, cs, icon, kw, fields, calcBody, faq, formula, rel }
const calcs = [];

function addCalc(slug, title, desc, kw, fields, calcBody, faq, formula, rel) {
  calcs.push({ slug, title, desc, cat: 'Finance', cs: 'finance', icon: '$', kw, fields, calcBody, faq, formula, rel: rel || ['tax-calculator','salary-calculator'] });
}

// =============================================================================
// INDIA (16 calculators)
// =============================================================================

addCalc('india-income-tax-calculator', 'India Income Tax Calculator',
  'Free India income tax calculator for FY 2024-25. Calculate tax under new and old regime with slabs, cess, and rebate u/s 87A.',
  ['india income tax calculator', 'india tax calculator', 'income tax india', 'new regime tax calculator'],
  [
    '{ name: "income", label: "Annual Gross Income", type: "number", placeholder: "e.g. 1200000", prefix: "₹", min: 0 }',
    '{ name: "regime", label: "Tax Regime", type: "select", options: [{ label: "New Regime (2024-25)", value: "new" }, { label: "Old Regime", value: "old" }], defaultValue: "new" }',
  ],
  `(inputs) => {
      const income = inputs.income as number;
      const regime = inputs.regime as string;
      if (!income || income <= 0) return null;
      const stdDed = regime === "new" ? 75000 : 50000;
      const taxableIncome = Math.max(0, income - stdDed);
      let tax = 0;
      if (regime === "new") {
        const b = [{l:400000,r:0},{l:800000,r:0.05},{l:1200000,r:0.10},{l:1600000,r:0.15},{l:2000000,r:0.20},{l:2400000,r:0.25},{l:Infinity,r:0.30}];
        let rem = taxableIncome, prev = 0;
        for (const s of b) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        if (taxableIncome <= 700000) tax = 0;
      } else {
        const b = [{l:250000,r:0},{l:500000,r:0.05},{l:1000000,r:0.20},{l:Infinity,r:0.30}];
        let rem = taxableIncome, prev = 0;
        for (const s of b) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        if (taxableIncome <= 500000) tax = Math.max(0, tax - 12500);
      }
      const cess = tax * 0.04;
      const totalTax = tax + cess;
      return {
        primary: { label: "Total Tax", value: "₹" + formatNumber(totalTax) },
        details: [
          { label: "Taxable income", value: "₹" + formatNumber(taxableIncome) },
          { label: "Tax before cess", value: "₹" + formatNumber(tax) },
          { label: "Health & Education Cess (4%)", value: "₹" + formatNumber(cess) },
          { label: "Effective rate", value: formatNumber((totalTax / income) * 100) + "%" },
          { label: "Monthly tax", value: "₹" + formatNumber(totalTax / 12) },
        ],
        note: "Surcharge not included. Applies for income above ₹50 lakh.",
      };
    }`,
  [{ q: 'What are the income tax slabs for FY 2024-25 new regime?', a: 'Under the new regime: 0% up to ₹4L, 5% (₹4-8L), 10% (₹8-12L), 15% (₹12-16L), 20% (₹16-20L), 25% (₹20-24L), 30% above ₹24L. Standard deduction is ₹75,000.' },
   { q: 'Which regime is better - old or new?', a: 'The new regime is better for most taxpayers unless you have significant deductions (HRA, 80C, 80D etc.) exceeding ₹3-4 lakh under the old regime.' }],
  'Tax = Progressive slab rates × Taxable income + 4% Cess'
);

addCalc('india-gst-calculator', 'India GST Calculator',
  'Free GST calculator for India. Calculate GST amount, CGST, SGST, and total price with 5%, 12%, 18%, or 28% GST rates.',
  ['gst calculator india', 'gst calculator', 'cgst sgst calculator'],
  [
    '{ name: "amount", label: "Amount (excl. GST)", type: "number", placeholder: "e.g. 10000", prefix: "₹", min: 0 }',
    '{ name: "rate", label: "GST Rate", type: "select", options: [{ label: "5%", value: "5" }, { label: "12%", value: "12" }, { label: "18%", value: "18" }, { label: "28%", value: "28" }], defaultValue: "18" }',
  ],
  `(inputs) => {
      const amount = inputs.amount as number;
      const rate = parseFloat(inputs.rate as string);
      if (!amount || amount <= 0) return null;
      const gst = amount * rate / 100;
      const half = gst / 2;
      return {
        primary: { label: "Total (incl. GST)", value: "₹" + formatNumber(amount + gst) },
        details: [
          { label: "GST Amount", value: "₹" + formatNumber(gst) },
          { label: "CGST (" + (rate/2) + "%)", value: "₹" + formatNumber(half) },
          { label: "SGST (" + (rate/2) + "%)", value: "₹" + formatNumber(half) },
          { label: "Base Amount", value: "₹" + formatNumber(amount) },
        ],
      };
    }`,
  [{ q: 'What are the GST rates in India?', a: 'India has 4 main GST slabs: 5% (essential goods), 12% (standard goods), 18% (most services), and 28% (luxury/sin goods).' },
   { q: 'What is CGST and SGST?', a: 'CGST (Central GST) and SGST (State GST) are equal halves of the total GST rate for intra-state transactions. For inter-state, IGST applies at the full rate.' }],
  'GST = Amount × Rate%. Total = Amount + GST. CGST = SGST = GST / 2'
);

addCalc('india-hra-calculator', 'India HRA Exemption Calculator',
  'Free HRA exemption calculator for India. Calculate your House Rent Allowance tax exemption under the old regime.',
  ['hra calculator', 'hra exemption calculator india', 'house rent allowance calculator'],
  [
    '{ name: "basic", label: "Basic Salary (monthly)", type: "number", prefix: "₹", min: 0 }',
    '{ name: "da", label: "Dearness Allowance (monthly)", type: "number", prefix: "₹", min: 0, defaultValue: 0 }',
    '{ name: "hra", label: "HRA Received (monthly)", type: "number", prefix: "₹", min: 0 }',
    '{ name: "rent", label: "Rent Paid (monthly)", type: "number", prefix: "₹", min: 0 }',
    '{ name: "metro", label: "City", type: "select", options: [{ label: "Metro (Delhi/Mumbai/Kolkata/Chennai)", value: "50" }, { label: "Non-Metro", value: "40" }], defaultValue: "50" }',
  ],
  `(inputs) => {
      const basic = inputs.basic as number;
      const da = inputs.da as number || 0;
      const hra = inputs.hra as number;
      const rent = inputs.rent as number;
      const metroRate = parseFloat(inputs.metro as string) / 100;
      if (!basic || !hra || !rent) return null;
      const salary = basic + da;
      const a = hra;
      const b = salary * metroRate;
      const c = Math.max(0, rent - salary * 0.10);
      const exempt = Math.min(a, b, c);
      const taxable = hra - exempt;
      return {
        primary: { label: "HRA Exemption", value: "₹" + formatNumber(exempt) + "/month" },
        details: [
          { label: "Actual HRA received", value: "₹" + formatNumber(a) },
          { label: metroRate === 0.5 ? "50% of salary" : "40% of salary", value: "₹" + formatNumber(b) },
          { label: "Rent - 10% of salary", value: "₹" + formatNumber(c) },
          { label: "Taxable HRA", value: "₹" + formatNumber(taxable) },
          { label: "Annual exemption", value: "₹" + formatNumber(exempt * 12) },
        ],
        note: "HRA exemption is available only under the old tax regime.",
      };
    }`,
  [{ q: 'How is HRA exemption calculated?', a: 'HRA exemption is the minimum of: (1) Actual HRA received, (2) 50% of salary for metro cities or 40% for non-metro, (3) Rent paid minus 10% of salary.' },
   { q: 'Is HRA available under the new tax regime?', a: 'No, HRA exemption is only available under the old tax regime. Under the new regime, you get a standard deduction of ₹75,000 instead.' }],
  'HRA Exemption = MIN(Actual HRA, 50%/40% of Salary, Rent - 10% of Salary)'
);

addCalc('india-epf-calculator', 'India EPF Calculator',
  'Free EPF (Employee Provident Fund) calculator. Calculate your EPF balance at retirement with employer contribution and 8.25% interest.',
  ['epf calculator', 'pf calculator india', 'provident fund calculator'],
  [
    '{ name: "basic", label: "Monthly Basic + DA", type: "number", prefix: "₹", min: 0 }',
    '{ name: "age", label: "Current Age", type: "number", min: 18, max: 58 }',
    '{ name: "existing", label: "Existing EPF Balance", type: "number", prefix: "₹", defaultValue: 0, min: 0 }',
  ],
  `(inputs) => {
      const basic = inputs.basic as number;
      const age = inputs.age as number;
      const existing = (inputs.existing as number) || 0;
      if (!basic || !age) return null;
      const years = Math.max(0, 58 - age);
      const empContrib = basic * 0.12;
      const epsContrib = Math.min(basic, 15000) * 0.0833;
      const employerEpf = empContrib - epsContrib;
      const monthlyTotal = empContrib + employerEpf;
      const r = 0.0825 / 12;
      let balance = existing;
      for (let i = 0; i < years * 12; i++) {
        balance = (balance + monthlyTotal) * (1 + r);
      }
      return {
        primary: { label: "EPF at Retirement", value: "₹" + formatNumber(balance) },
        details: [
          { label: "Your monthly contribution (12%)", value: "₹" + formatNumber(empContrib) },
          { label: "Employer EPF contribution", value: "₹" + formatNumber(employerEpf) },
          { label: "Employer EPS contribution", value: "₹" + formatNumber(epsContrib) },
          { label: "Years to retirement (58)", value: String(years) },
          { label: "Total invested", value: "₹" + formatNumber(monthlyTotal * years * 12 + existing) },
        ],
        note: "Interest rate: 8.25% p.a. (FY 2024-25). EPS capped at ₹15,000 basic.",
      };
    }`,
  [{ q: 'What is the EPF interest rate?', a: 'The EPF interest rate for FY 2024-25 is 8.25% per annum, compounded monthly.' },
   { q: 'How much does employer contribute to EPF?', a: 'Employer contributes 12% of Basic+DA, of which 8.33% (max on ₹15,000) goes to EPS and the rest to EPF.' }],
  'EPF = Compound Interest on (Employee 12% + Employer ~3.67%) at 8.25% p.a.'
);

addCalc('india-sip-calculator', 'India SIP Calculator',
  'Free SIP calculator. Calculate returns on Systematic Investment Plan for mutual funds with expected annual return rate.',
  ['sip calculator', 'mutual fund sip calculator', 'sip return calculator india'],
  [
    '{ name: "monthly", label: "Monthly SIP Amount", type: "number", prefix: "₹", min: 100 }',
    '{ name: "rate", label: "Expected Annual Return", type: "number", suffix: "%", defaultValue: 12, min: 1, max: 30 }',
    '{ name: "years", label: "Investment Period", type: "number", suffix: "years", min: 1, max: 40 }',
  ],
  `(inputs) => {
      const monthly = inputs.monthly as number;
      const rate = inputs.rate as number;
      const years = inputs.years as number;
      if (!monthly || !rate || !years) return null;
      const r = rate / 100 / 12;
      const n = years * 12;
      const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const invested = monthly * n;
      const gains = fv - invested;
      return {
        primary: { label: "Maturity Value", value: "₹" + formatNumber(fv) },
        details: [
          { label: "Total invested", value: "₹" + formatNumber(invested) },
          { label: "Estimated returns", value: "₹" + formatNumber(gains) },
          { label: "Return multiple", value: formatNumber(fv / invested, 1) + "x" },
          { label: "CAGR", value: formatNumber(rate) + "%" },
        ],
      };
    }`,
  [{ q: 'What is SIP?', a: 'SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly in mutual funds, benefiting from rupee cost averaging and compounding.' },
   { q: 'What is a good SIP return rate?', a: 'Historically, equity mutual funds in India have returned 12-15% annually over 10+ years. Debt funds typically return 7-9%.' }],
  'FV = P × [(1+r)^n - 1] / r × (1+r), where P=monthly, r=monthly rate, n=months'
);

addCalc('india-home-loan-emi-calculator', 'India Home Loan EMI Calculator',
  'Free home loan EMI calculator for India. Calculate monthly EMI, total interest, and amortization for housing loans.',
  ['emi calculator', 'home loan emi calculator', 'housing loan calculator india'],
  [
    '{ name: "principal", label: "Loan Amount", type: "number", prefix: "₹", min: 100000 }',
    '{ name: "rate", label: "Annual Interest Rate", type: "number", suffix: "%", defaultValue: 8.5, min: 1, max: 20, step: 0.1 }',
    '{ name: "tenure", label: "Loan Tenure", type: "number", suffix: "years", defaultValue: 20, min: 1, max: 30 }',
  ],
  `(inputs) => {
      const p = inputs.principal as number;
      const annualRate = inputs.rate as number;
      const years = inputs.tenure as number;
      if (!p || !annualRate || !years) return null;
      const r = annualRate / 100 / 12;
      const n = years * 12;
      const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - p;
      return {
        primary: { label: "Monthly EMI", value: "₹" + formatNumber(emi) },
        details: [
          { label: "Total payment", value: "₹" + formatNumber(totalPayment) },
          { label: "Total interest", value: "₹" + formatNumber(totalInterest) },
          { label: "Interest to principal ratio", value: formatNumber((totalInterest / p) * 100) + "%" },
          { label: "Loan amount", value: "₹" + formatNumber(p) },
        ],
      };
    }`,
  [{ q: 'How is EMI calculated?', a: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the loan amount, r is the monthly interest rate, and n is the total number of months.' },
   { q: 'What is a good home loan interest rate in India?', a: 'As of 2024-25, home loan rates in India range from 8.25% to 9.5% depending on the lender, loan amount, and your credit score.' }],
  'EMI = P × r × (1+r)^n / ((1+r)^n - 1)'
);

addCalc('india-gratuity-calculator', 'India Gratuity Calculator',
  'Free gratuity calculator for India. Calculate gratuity amount based on years of service and last drawn salary.',
  ['gratuity calculator india', 'gratuity calculation', 'gratuity amount calculator'],
  [
    '{ name: "salary", label: "Last Drawn Salary (Basic + DA)", type: "number", prefix: "₹", min: 0 }',
    '{ name: "years", label: "Years of Service", type: "number", min: 5, max: 50 }',
  ],
  `(inputs) => {
      const salary = inputs.salary as number;
      const years = inputs.years as number;
      if (!salary || !years || years < 5) return null;
      const gratuity = Math.min(years * salary * 15 / 26, 2000000);
      const taxFree = Math.min(gratuity, 2000000);
      return {
        primary: { label: "Gratuity Amount", value: "₹" + formatNumber(gratuity) },
        details: [
          { label: "Tax-free limit", value: "₹20,00,000" },
          { label: "Tax-free amount", value: "₹" + formatNumber(taxFree) },
          { label: "Years of service", value: String(years) },
          { label: "Last drawn salary", value: "₹" + formatNumber(salary) },
        ],
        note: "Minimum 5 years of continuous service required. Gratuity = n × salary × 15/26.",
      };
    }`,
  [{ q: 'How is gratuity calculated in India?', a: 'Gratuity = (Years of service × Last drawn salary × 15) / 26. Minimum 5 years of service required. Tax exemption up to ₹20 lakh.' },
   { q: 'Is gratuity taxable?', a: 'Gratuity is tax-free up to ₹20,00,000. Any amount above this limit is taxable as per your income tax slab.' }],
  'Gratuity = Years × Last Salary × 15 / 26 (max ₹20,00,000 tax-free)'
);

addCalc('india-fd-calculator', 'India FD Calculator',
  'Free Fixed Deposit calculator for India. Calculate FD maturity amount with compound interest for all major banks.',
  ['fd calculator', 'fixed deposit calculator india', 'fd interest calculator'],
  [
    '{ name: "principal", label: "Deposit Amount", type: "number", prefix: "₹", min: 1000 }',
    '{ name: "rate", label: "Annual Interest Rate", type: "number", suffix: "%", defaultValue: 7, min: 1, max: 15, step: 0.1 }',
    '{ name: "years", label: "Tenure", type: "number", suffix: "years", min: 1, max: 10 }',
    '{ name: "compound", label: "Compounding", type: "select", options: [{ label: "Quarterly", value: "4" }, { label: "Monthly", value: "12" }, { label: "Half-yearly", value: "2" }, { label: "Yearly", value: "1" }], defaultValue: "4" }',
  ],
  `(inputs) => {
      const p = inputs.principal as number;
      const rate = inputs.rate as number;
      const years = inputs.years as number;
      const n = parseFloat(inputs.compound as string);
      if (!p || !rate || !years) return null;
      const maturity = p * Math.pow(1 + rate / 100 / n, n * years);
      const interest = maturity - p;
      return {
        primary: { label: "Maturity Amount", value: "₹" + formatNumber(maturity) },
        details: [
          { label: "Principal", value: "₹" + formatNumber(p) },
          { label: "Total interest earned", value: "₹" + formatNumber(interest) },
          { label: "Effective annual rate", value: formatNumber((Math.pow(1 + rate/100/n, n) - 1) * 100, 2) + "%" },
        ],
      };
    }`,
  [{ q: 'How is FD interest calculated?', a: 'FD interest is calculated using compound interest: A = P × (1 + r/n)^(n×t), where P is principal, r is annual rate, n is compounding frequency, t is years.' },
   { q: 'Is FD interest taxable in India?', a: 'Yes, FD interest is taxable. TDS of 10% is deducted if interest exceeds ₹40,000/year (₹50,000 for senior citizens).' }],
  'Maturity = P × (1 + r/n)^(n×t)'
);

addCalc('india-ppf-calculator', 'India PPF Calculator',
  'Free PPF calculator. Calculate Public Provident Fund maturity with 7.1% interest over 15 years.',
  ['ppf calculator', 'ppf calculator india', 'public provident fund calculator'],
  [
    '{ name: "yearly", label: "Annual Investment", type: "number", prefix: "₹", min: 500, max: 150000, defaultValue: 150000 }',
    '{ name: "years", label: "Period", type: "number", suffix: "years", defaultValue: 15, min: 15, max: 50 }',
  ],
  `(inputs) => {
      const yearly = inputs.yearly as number;
      const years = inputs.years as number;
      if (!yearly || !years) return null;
      const rate = 0.071;
      let balance = 0;
      for (let i = 0; i < years; i++) {
        balance = (balance + yearly) * (1 + rate);
      }
      const invested = yearly * years;
      const interest = balance - invested;
      return {
        primary: { label: "Maturity Value", value: "₹" + formatNumber(balance) },
        details: [
          { label: "Total invested", value: "₹" + formatNumber(invested) },
          { label: "Total interest earned", value: "₹" + formatNumber(interest) },
          { label: "Interest rate", value: "7.1% p.a." },
          { label: "Tax status", value: "EEE (fully exempt)" },
        ],
        note: "PPF has a 15-year lock-in. Interest rate is 7.1% p.a. (subject to quarterly review). Max ₹1.5L/year.",
      };
    }`,
  [{ q: 'What is PPF interest rate?', a: 'The current PPF interest rate is 7.1% per annum, compounded annually. It is reviewed quarterly by the government.' },
   { q: 'Is PPF tax-free?', a: 'Yes, PPF enjoys EEE (Exempt-Exempt-Exempt) status: investment up to ₹1.5L is deductible u/s 80C, interest is tax-free, and maturity amount is tax-free.' }],
  'PPF Maturity = Sum of (Annual Investment × (1+7.1%)^remaining years)'
);

// =============================================================================
// CHINA (8 calculators)
// =============================================================================

addCalc('china-income-tax-calculator', 'China Individual Income Tax Calculator',
  'Free China IIT calculator. Calculate personal income tax with 7 progressive brackets, standard deduction, and special deductions.',
  ['china income tax calculator', 'china iit calculator', 'china tax calculator', 'chinese income tax'],
  [
    '{ name: "monthly", label: "Monthly Gross Salary", type: "number", prefix: "¥", min: 0 }',
    '{ name: "insurance", label: "Monthly Social Insurance (employee)", type: "number", prefix: "¥", defaultValue: 0, min: 0 }',
    '{ name: "special", label: "Monthly Special Deductions", type: "number", prefix: "¥", defaultValue: 0, min: 0 }',
  ],
  `(inputs) => {
      const monthly = inputs.monthly as number;
      const insurance = (inputs.insurance as number) || 0;
      const special = (inputs.special as number) || 0;
      if (!monthly) return null;
      const annualIncome = monthly * 12;
      const annualDeductions = (5000 + insurance + special) * 12;
      const taxable = Math.max(0, annualIncome - annualDeductions);
      const brackets = [{l:36000,r:0.03,d:0},{l:144000,r:0.10,d:2520},{l:300000,r:0.20,d:16920},{l:420000,r:0.25,d:31920},{l:660000,r:0.30,d:52920},{l:960000,r:0.35,d:85920},{l:Infinity,r:0.45,d:181920}];
      let tax = 0;
      for (const b of brackets) {
        if (taxable <= b.l) { tax = taxable * b.r - b.d; break; }
      }
      tax = Math.max(0, tax);
      const monthlyTax = tax / 12;
      const netMonthly = monthly - insurance - monthlyTax;
      return {
        primary: { label: "Annual Tax", value: "¥" + formatNumber(tax) },
        details: [
          { label: "Monthly tax", value: "¥" + formatNumber(monthlyTax) },
          { label: "Monthly net salary", value: "¥" + formatNumber(netMonthly) },
          { label: "Annual taxable income", value: "¥" + formatNumber(taxable) },
          { label: "Effective rate", value: formatNumber(annualIncome > 0 ? (tax / annualIncome) * 100 : 0) + "%" },
        ],
        note: "Standard deduction: ¥5,000/month (¥60,000/year). Special deductions include children education, housing, elderly care, etc.",
      };
    }`,
  [{ q: 'What are China IIT brackets?', a: 'China uses 7 brackets: 3% (up to ¥36K), 10% (¥36-144K), 20% (¥144-300K), 25% (¥300-420K), 30% (¥420-660K), 35% (¥660-960K), 45% (above ¥960K). Applied to annual taxable income.' },
   { q: 'What is the standard deduction in China?', a: 'The standard deduction is ¥5,000 per month (¥60,000 per year). Additional special deductions are available for education, housing, medical expenses, and elderly care.' }],
  'Tax = Annual Taxable Income × Rate - Quick Deduction'
);

addCalc('china-social-insurance-calculator', 'China Social Insurance Calculator',
  'Free China social insurance (五险一金) calculator. Calculate employee and employer contributions for pension, medical, unemployment, and housing fund.',
  ['china social insurance calculator', 'wuxian yijin calculator', 'china five insurances one fund'],
  [
    '{ name: "salary", label: "Monthly Salary", type: "number", prefix: "¥", min: 0 }',
    '{ name: "housingRate", label: "Housing Fund Rate", type: "number", suffix: "%", defaultValue: 12, min: 5, max: 12 }',
  ],
  `(inputs) => {
      const salary = inputs.salary as number;
      const housingRate = (inputs.housingRate as number) / 100;
      if (!salary) return null;
      const empPension = salary * 0.08;
      const empMedical = salary * 0.02 + 3;
      const empUnemploy = salary * 0.005;
      const empHousing = salary * housingRate;
      const totalEmp = empPension + empMedical + empUnemploy + empHousing;
      const erPension = salary * 0.16;
      const erMedical = salary * 0.098;
      const erUnemploy = salary * 0.005;
      const erInjury = salary * 0.004;
      const erMaternity = salary * 0.008;
      const erHousing = salary * housingRate;
      const totalEr = erPension + erMedical + erUnemploy + erInjury + erMaternity + erHousing;
      return {
        primary: { label: "Your Monthly Deductions", value: "¥" + formatNumber(totalEmp) },
        details: [
          { label: "Pension (8%)", value: "¥" + formatNumber(empPension) },
          { label: "Medical (2%+¥3)", value: "¥" + formatNumber(empMedical) },
          { label: "Unemployment (0.5%)", value: "¥" + formatNumber(empUnemploy) },
          { label: "Housing fund (" + (housingRate*100) + "%)", value: "¥" + formatNumber(empHousing) },
          { label: "Employer total cost", value: "¥" + formatNumber(totalEr) },
          { label: "Net before tax", value: "¥" + formatNumber(salary - totalEmp) },
        ],
        note: "Rates shown are typical for Beijing/Shanghai. Actual rates vary by city.",
      };
    }`,
  [{ q: 'What is five insurances one fund in China?', a: 'Five insurances (五险): pension (16%+8%), medical (~10%+2%), unemployment (0.5%+0.5%), work injury (~0.4%), maternity (~0.8%). One fund (一金): housing fund (5-12% each side).' },
   { q: 'How much do employees pay for social insurance?', a: 'Employees typically pay about 10.5% (pension 8%, medical 2%+¥3, unemployment 0.5%) plus 5-12% for housing fund.' }],
  'Employee deductions = Pension 8% + Medical 2% + Unemployment 0.5% + Housing Fund 5-12%'
);

addCalc('china-vat-calculator', 'China VAT Calculator',
  'Free China VAT (增值税) calculator. Calculate VAT at 13%, 9%, 6%, or 1% rates for goods and services.',
  ['china vat calculator', 'china zengzhishui calculator', 'china tax on goods'],
  [
    '{ name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "¥", min: 0 }',
    '{ name: "rate", label: "VAT Rate", type: "select", options: [{ label: "13% (Manufacturing, goods)", value: "13" }, { label: "9% (Transport, construction)", value: "9" }, { label: "6% (Services)", value: "6" }, { label: "1% (Small-scale)", value: "1" }], defaultValue: "13" }',
  ],
  `(inputs) => {
      const amount = inputs.amount as number;
      const rate = parseFloat(inputs.rate as string);
      if (!amount || amount <= 0) return null;
      const vat = amount * rate / 100;
      return {
        primary: { label: "Total (incl. VAT)", value: "¥" + formatNumber(amount + vat) },
        details: [
          { label: "VAT amount", value: "¥" + formatNumber(vat) },
          { label: "VAT rate", value: rate + "%" },
          { label: "Base amount", value: "¥" + formatNumber(amount) },
        ],
      };
    }`,
  [{ q: 'What are the VAT rates in China?', a: 'China has 4 VAT rates: 13% (manufacturing, goods), 9% (transport, construction, real estate), 6% (financial and modern services), 1% (small-scale taxpayers, reduced from 3%).' },
   { q: 'Who needs to pay VAT in China?', a: 'All businesses selling goods or providing services in China must pay VAT. Small-scale taxpayers (annual sales under ¥5M) pay a reduced 1% rate.' }],
  'VAT = Amount × Rate%. Total = Amount + VAT'
);

// =============================================================================
// USA (10 calculators)
// =============================================================================

addCalc('usa-federal-income-tax-2025-calculator', 'USA Federal Income Tax 2025 Calculator',
  'Free US federal income tax calculator for 2025. Calculate tax with updated brackets, standard deduction, and all filing statuses.',
  ['us federal income tax calculator 2025', 'usa tax calculator', 'federal tax calculator 2025', 'irs tax calculator'],
  [
    '{ name: "income", label: "Annual Gross Income", type: "number", prefix: "$", min: 0 }',
    '{ name: "status", label: "Filing Status", type: "select", options: [{ label: "Single", value: "single" }, { label: "Married Filing Jointly", value: "married" }, { label: "Head of Household", value: "hoh" }], defaultValue: "single" }',
  ],
  `(inputs) => {
      const income = inputs.income as number;
      const status = inputs.status as string;
      if (!income || income <= 0) return null;
      const sd = status === "married" ? 30000 : status === "hoh" ? 22500 : 15000;
      const taxable = Math.max(0, income - sd);
      const brackets: Record<string, {l:number;r:number}[]> = {
        single: [{l:11925,r:0.10},{l:48475,r:0.12},{l:103350,r:0.22},{l:197300,r:0.24},{l:250525,r:0.32},{l:626350,r:0.35},{l:Infinity,r:0.37}],
        married: [{l:23850,r:0.10},{l:96950,r:0.12},{l:206700,r:0.22},{l:394600,r:0.24},{l:501050,r:0.32},{l:751600,r:0.35},{l:Infinity,r:0.37}],
        hoh: [{l:17000,r:0.10},{l:64850,r:0.12},{l:103350,r:0.22},{l:197300,r:0.24},{l:250500,r:0.32},{l:626350,r:0.35},{l:Infinity,r:0.37}],
      };
      const b = brackets[status] || brackets.single;
      let tax = 0, rem = taxable, prev = 0, marginal = 0;
      for (const s of b) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Federal Tax", value: "$" + formatNumber(tax) },
        details: [
          { label: "Standard deduction", value: "$" + formatNumber(sd) },
          { label: "Taxable income", value: "$" + formatNumber(taxable) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal bracket", value: (marginal * 100) + "%" },
          { label: "After-tax income", value: "$" + formatNumber(income - tax) },
        ],
        note: "2025 tax year brackets. Does not include state taxes, FICA, or credits.",
      };
    }`,
  [{ q: 'What are the 2025 federal tax brackets?', a: 'For single filers: 10% up to $11,925, 12% to $48,475, 22% to $103,350, 24% to $197,300, 32% to $250,525, 35% to $626,350, 37% above. Standard deduction: $15,000.' },
   { q: 'What is the standard deduction for 2025?', a: 'Standard deduction for 2025: $15,000 (Single), $30,000 (Married Filing Jointly), $22,500 (Head of Household).' }],
  'Tax = Sum of (income in each bracket × rate). Standard deduction subtracted first.'
);

addCalc('usa-fica-calculator', 'USA FICA & Social Security Calculator',
  'Free FICA calculator. Calculate Social Security (6.2%), Medicare (1.45%), and Additional Medicare Tax for US employees.',
  ['fica calculator', 'social security tax calculator', 'medicare tax calculator', 'payroll tax calculator'],
  [
    '{ name: "income", label: "Annual Gross Wages", type: "number", prefix: "$", min: 0 }',
    '{ name: "status", label: "Filing Status", type: "select", options: [{ label: "Single", value: "200000" }, { label: "Married Filing Jointly", value: "250000" }], defaultValue: "200000" }',
  ],
  `(inputs) => {
      const income = inputs.income as number;
      const threshold = parseFloat(inputs.status as string);
      if (!income || income <= 0) return null;
      const ssWageBase = 176100;
      const ssTax = Math.min(income, ssWageBase) * 0.062;
      const medicare = income * 0.0145;
      const additionalMedicare = Math.max(0, income - threshold) * 0.009;
      const total = ssTax + medicare + additionalMedicare;
      return {
        primary: { label: "Total FICA Tax", value: "$" + formatNumber(total) },
        details: [
          { label: "Social Security (6.2%)", value: "$" + formatNumber(ssTax) },
          { label: "Medicare (1.45%)", value: "$" + formatNumber(medicare) },
          { label: "Additional Medicare (0.9%)", value: "$" + formatNumber(additionalMedicare) },
          { label: "SS wage base (2025)", value: "$176,100" },
          { label: "Effective FICA rate", value: formatNumber((total / income) * 100) + "%" },
        ],
        note: "Employee share only. Employer pays matching 6.2% SS + 1.45% Medicare.",
      };
    }`,
  [{ q: 'What is FICA tax?', a: 'FICA includes Social Security tax (6.2% up to $176,100 in 2025) and Medicare tax (1.45% on all wages). An additional 0.9% Medicare applies above $200K (single) or $250K (married).' },
   { q: 'Is there a cap on Social Security tax?', a: 'Yes, Social Security tax only applies to the first $176,100 of wages in 2025. Medicare has no wage cap.' }],
  'FICA = SS (6.2% × min(wage, $176,100)) + Medicare (1.45%) + Additional Medicare (0.9% above threshold)'
);

addCalc('usa-401k-calculator', 'USA 401(k) Calculator',
  'Free 401(k) calculator. Project your retirement savings with employer match, contribution limits, and compound growth.',
  ['401k calculator', '401k retirement calculator', '401k growth calculator'],
  [
    '{ name: "salary", label: "Annual Salary", type: "number", prefix: "$", min: 0 }',
    '{ name: "contribution", label: "Your Contribution", type: "number", suffix: "%", defaultValue: 10, min: 0, max: 100 }',
    '{ name: "match", label: "Employer Match", type: "number", suffix: "%", defaultValue: 50, min: 0, max: 100 }',
    '{ name: "matchLimit", label: "Match up to (% of salary)", type: "number", suffix: "%", defaultValue: 6, min: 0, max: 100 }',
    '{ name: "years", label: "Years to Retirement", type: "number", min: 1, max: 50 }',
    '{ name: "returnRate", label: "Expected Annual Return", type: "number", suffix: "%", defaultValue: 7, min: 0, max: 20 }',
  ],
  `(inputs) => {
      const salary = inputs.salary as number;
      const contribPct = (inputs.contribution as number) / 100;
      const matchPct = (inputs.match as number) / 100;
      const matchLimit = (inputs.matchLimit as number) / 100;
      const years = inputs.years as number;
      const ret = (inputs.returnRate as number) / 100;
      if (!salary || !years) return null;
      const annualContrib = Math.min(salary * contribPct, 23500);
      const matchable = Math.min(salary * contribPct, salary * matchLimit);
      const annualMatch = matchable * matchPct;
      const totalAnnual = annualContrib + annualMatch;
      const r = ret / 12;
      const n = years * 12;
      const monthlyContrib = totalAnnual / 12;
      const fv = monthlyContrib * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      return {
        primary: { label: "Projected 401(k) Balance", value: "$" + formatNumber(fv) },
        details: [
          { label: "Your annual contribution", value: "$" + formatNumber(annualContrib) },
          { label: "Employer annual match", value: "$" + formatNumber(annualMatch) },
          { label: "Total invested over " + years + " years", value: "$" + formatNumber(totalAnnual * years) },
          { label: "Investment growth", value: "$" + formatNumber(fv - totalAnnual * years) },
        ],
        note: "2025 contribution limit: $23,500 (under 50), $31,000 (50+), $34,750 (60-63).",
      };
    }`,
  [{ q: 'What is the 401(k) contribution limit for 2025?', a: 'The 2025 401(k) employee contribution limit is $23,500. Catch-up for age 50+: $7,500 extra. New super catch-up for ages 60-63: $11,250 extra. Total employer+employee limit: $70,000.' },
   { q: 'How does employer 401(k) match work?', a: 'Common matches are 50% or 100% of your contribution up to a percentage of salary (often 3-6%). For example, 50% match up to 6% means if you contribute 6% ($6K on $100K), employer adds $3K.' }],
  'FV = Monthly contributions × [(1+r)^n - 1] / r × (1+r)'
);

addCalc('usa-capital-gains-tax-calculator', 'USA Capital Gains Tax Calculator',
  'Free capital gains tax calculator. Calculate short-term and long-term capital gains tax with 2025 brackets and NIIT.',
  ['capital gains tax calculator', 'stock tax calculator', 'investment tax calculator usa'],
  [
    '{ name: "gain", label: "Capital Gain", type: "number", prefix: "$", min: 0 }',
    '{ name: "holdingPeriod", label: "Holding Period", type: "select", options: [{ label: "Long-term (>1 year)", value: "long" }, { label: "Short-term (≤1 year)", value: "short" }], defaultValue: "long" }',
    '{ name: "income", label: "Other Taxable Income", type: "number", prefix: "$", defaultValue: 0, min: 0 }',
    '{ name: "status", label: "Filing Status", type: "select", options: [{ label: "Single", value: "single" }, { label: "Married Filing Jointly", value: "married" }], defaultValue: "single" }',
  ],
  `(inputs) => {
      const gain = inputs.gain as number;
      const period = inputs.status as string;
      const otherIncome = (inputs.income as number) || 0;
      const status = inputs.status as string;
      const isLong = inputs.holdingPeriod === "long";
      if (!gain || gain <= 0) return null;
      let tax = 0;
      if (!isLong) {
        const brackets = status === "married" ?
          [{l:23850,r:0.10},{l:96950,r:0.12},{l:206700,r:0.22},{l:394600,r:0.24},{l:501050,r:0.32},{l:751600,r:0.35},{l:Infinity,r:0.37}] :
          [{l:11925,r:0.10},{l:48475,r:0.12},{l:103350,r:0.22},{l:197300,r:0.24},{l:250525,r:0.32},{l:626350,r:0.35},{l:Infinity,r:0.37}];
        let rem = gain + otherIncome, prev = 0, totalTaxAll = 0, totalTaxIncome = 0;
        for (const b of brackets) { const t = Math.min(rem, b.l - prev); if (t <= 0) break; totalTaxAll += t * b.r; rem -= t; prev = b.l; }
        rem = otherIncome; prev = 0;
        for (const b of brackets) { const t = Math.min(rem, b.l - prev); if (t <= 0) break; totalTaxIncome += t * b.r; rem -= t; prev = b.l; }
        tax = totalTaxAll - totalTaxIncome;
      } else {
        const thresholds = status === "married" ? [96700, 600050] : [48350, 533400];
        const totalIncome = gain + otherIncome;
        if (totalIncome <= thresholds[0]) { tax = 0; }
        else if (totalIncome <= thresholds[1]) { tax = Math.max(0, totalIncome - thresholds[0]) * 0.15; tax = Math.min(tax, gain * 0.15); }
        else { const at20 = Math.max(0, totalIncome - thresholds[1]); const at15 = gain - at20; tax = Math.min(at20, gain) * 0.20 + Math.max(0, at15) * 0.15; }
      }
      const niitThreshold = status === "married" ? 250000 : 200000;
      const niit = Math.max(0, (gain + otherIncome) - niitThreshold) * 0.038;
      const niitOnGain = Math.min(niit, gain * 0.038);
      return {
        primary: { label: "Capital Gains Tax", value: "$" + formatNumber(tax + niitOnGain) },
        details: [
          { label: "Base tax", value: "$" + formatNumber(tax) },
          { label: "NIIT (3.8%)", value: "$" + formatNumber(niitOnGain) },
          { label: "Effective rate on gain", value: formatNumber(((tax + niitOnGain) / gain) * 100) + "%" },
          { label: "After-tax proceeds", value: "$" + formatNumber(gain - tax - niitOnGain) },
        ],
        note: isLong ? "Long-term rates: 0%, 15%, or 20%. NIIT: 3.8% above $200K/$250K AGI." : "Short-term gains taxed at ordinary income rates.",
      };
    }`,
  [{ q: 'What are long-term capital gains rates for 2025?', a: '0% for income up to $48,350 (single) / $96,700 (MFJ). 15% up to $533,400 / $600,050. 20% above that. Plus potential 3.8% NIIT.' },
   { q: 'What is NIIT?', a: 'Net Investment Income Tax is an additional 3.8% tax on investment income (including capital gains) for AGI above $200,000 (single) or $250,000 (married filing jointly).' }],
  'Long-term: 0% / 15% / 20% based on total income. Short-term: ordinary income rates. NIIT: 3.8% above threshold.'
);

addCalc('usa-self-employment-tax-calculator', 'USA Self-Employment Tax Calculator',
  'Free self-employment tax calculator for 1099 workers. Calculate SE tax, income tax, and quarterly estimated payments.',
  ['self employment tax calculator', '1099 tax calculator', 'freelancer tax calculator usa', 'se tax calculator'],
  [
    '{ name: "income", label: "Net Self-Employment Income", type: "number", prefix: "$", min: 0 }',
    '{ name: "status", label: "Filing Status", type: "select", options: [{ label: "Single", value: "single" }, { label: "Married Filing Jointly", value: "married" }], defaultValue: "single" }',
  ],
  `(inputs) => {
      const income = inputs.income as number;
      const status = inputs.status as string;
      if (!income || income <= 0) return null;
      const seBase = income * 0.9235;
      const ssTax = Math.min(seBase, 176100) * 0.124;
      const medicareTax = seBase * 0.029;
      const addMedicare = Math.max(0, seBase - (status === "married" ? 250000 : 200000)) * 0.009;
      const seTax = ssTax + medicareTax + addMedicare;
      const seDeduction = seTax / 2;
      const sd = status === "married" ? 30000 : 15000;
      const taxableIncome = Math.max(0, income - seDeduction - sd);
      const brackets = status === "married" ?
        [{l:23850,r:0.10},{l:96950,r:0.12},{l:206700,r:0.22},{l:394600,r:0.24},{l:501050,r:0.32},{l:751600,r:0.35},{l:Infinity,r:0.37}] :
        [{l:11925,r:0.10},{l:48475,r:0.12},{l:103350,r:0.22},{l:197300,r:0.24},{l:250525,r:0.32},{l:626350,r:0.35},{l:Infinity,r:0.37}];
      let incomeTax = 0, rem = taxableIncome, prev = 0;
      for (const b of brackets) { const t = Math.min(rem, b.l - prev); if (t <= 0) break; incomeTax += t * b.r; rem -= t; prev = b.l; }
      const totalTax = seTax + incomeTax;
      const quarterly = totalTax / 4;
      return {
        primary: { label: "Total Tax", value: "$" + formatNumber(totalTax) },
        details: [
          { label: "Self-employment tax", value: "$" + formatNumber(seTax) },
          { label: "Federal income tax", value: "$" + formatNumber(incomeTax) },
          { label: "SE tax deduction (50%)", value: "$" + formatNumber(seDeduction) },
          { label: "Quarterly estimated payment", value: "$" + formatNumber(quarterly) },
          { label: "Effective total rate", value: formatNumber((totalTax / income) * 100) + "%" },
        ],
        note: "SE tax: 15.3% (12.4% SS + 2.9% Medicare) on 92.35% of net income. Half deductible.",
      };
    }`,
  [{ q: 'How is self-employment tax calculated?', a: 'SE tax is 15.3% (12.4% SS + 2.9% Medicare) on 92.35% of net self-employment income. SS applies up to $176,100 (2025). Half of SE tax is deductible from income.' },
   { q: 'When are quarterly estimated tax payments due?', a: 'Due dates: April 15, June 15, September 15, and January 15 of the next year. Pay if you expect to owe $1,000+ in tax.' }],
  'SE Tax = 15.3% × (Net Income × 92.35%). Income Tax = Progressive brackets on (income - SE deduction - standard deduction).'
);

addCalc('usa-roth-ira-calculator', 'USA Roth IRA Calculator',
  'Free Roth IRA calculator. Project tax-free retirement savings with contribution limits and compound growth.',
  ['roth ira calculator', 'ira calculator', 'roth ira growth calculator', 'retirement savings calculator'],
  [
    '{ name: "annual", label: "Annual Contribution", type: "number", prefix: "$", defaultValue: 7000, min: 0, max: 8000 }',
    '{ name: "existing", label: "Current Roth IRA Balance", type: "number", prefix: "$", defaultValue: 0, min: 0 }',
    '{ name: "years", label: "Years Until Retirement", type: "number", min: 1, max: 50 }',
    '{ name: "returnRate", label: "Expected Annual Return", type: "number", suffix: "%", defaultValue: 7, min: 0, max: 20 }',
  ],
  `(inputs) => {
      const annual = inputs.annual as number;
      const existing = (inputs.existing as number) || 0;
      const years = inputs.years as number;
      const ret = (inputs.returnRate as number) / 100;
      if (!years) return null;
      const monthly = annual / 12;
      const r = ret / 12;
      const n = years * 12;
      const fvContrib = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const fvExisting = existing * Math.pow(1 + r, n);
      const total = fvContrib + fvExisting;
      const invested = annual * years + existing;
      return {
        primary: { label: "Projected Balance", value: "$" + formatNumber(total) },
        details: [
          { label: "Total contributions", value: "$" + formatNumber(invested) },
          { label: "Investment growth", value: "$" + formatNumber(total - invested) },
          { label: "Tax savings at withdrawal", value: "$0 (tax-free!)" },
          { label: "Growth multiple", value: formatNumber(total / Math.max(invested, 1), 1) + "x" },
        ],
        note: "2025 limit: $7,000 ($8,000 if 50+). Income phase-out: $150K-$165K (single), $236K-$246K (MFJ). All withdrawals in retirement are tax-free.",
      };
    }`,
  [{ q: 'What is the 2025 Roth IRA contribution limit?', a: '$7,000 per year ($8,000 if age 50 or older). Income phase-out: $150,000-$165,000 for single filers, $236,000-$246,000 for married filing jointly.' },
   { q: 'What is the advantage of a Roth IRA?', a: 'Contributions are made with after-tax dollars, but all growth and qualified withdrawals in retirement are completely tax-free. Great for people who expect higher tax rates in retirement.' }],
  'FV = Monthly × [(1+r)^n - 1] / r × (1+r) + Existing × (1+r)^n'
);

// =============================================================================
// Helper to generate remaining countries with progressive tax + VAT + salary
// =============================================================================

function addTaxCalc(country, countryCode, currency, currencySymbol, brackets, sdInfo, vatRate, socialRates, extraFaq, extraFormula) {
  // Income tax calculator
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

  // VAT calculator
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

  // Salary calculator
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

// INDONESIA
addTaxCalc('Indonesia', 'indonesia', 'IDR', 'Rp',
  [{l:60000000,r:0.05},{l:250000000,r:0.15},{l:500000000,r:0.25},{l:5000000000,r:0.30},{l:Infinity,r:0.35}],
  'PTKP (non-taxable threshold) not subtracted. Single: Rp54M, Married: Rp58.5M, per dependent: +Rp4.5M.',
  12, { employee: 0.04 }
);

// PAKISTAN
addTaxCalc('Pakistan', 'pakistan', 'PKR', 'Rs',
  [{l:600000,r:0},{l:1200000,r:0.01},{l:2200000,r:0.11},{l:3200000,r:0.23},{l:4100000,r:0.30},{l:Infinity,r:0.35}],
  'Tax year 2025 salaried brackets. Non-salaried have different rates.',
  18, { employee: 0.08 }
);

// NIGERIA
addTaxCalc('Nigeria', 'nigeria', 'NGN', '₦',
  [{l:300000,r:0.07},{l:600000,r:0.11},{l:1100000,r:0.15},{l:1600000,r:0.19},{l:3200000,r:0.21},{l:Infinity,r:0.24}],
  'Consolidated Relief Allowance (CRA) of 20% of gross income + max(₦200K, 1% of gross) is deducted before applying brackets.',
  7.5, { employee: 0.08 }
);

// BRAZIL
addTaxCalc('Brazil', 'brazil', 'BRL', 'R$',
  [{l:27108,r:0},{l:33919.8,r:0.075},{l:45012.6,r:0.15},{l:55976.16,r:0.225},{l:Infinity,r:0.275}],
  'Monthly brackets annualized. Simplified monthly deduction of R$564.80 applies. Per-dependent deduction: R$189.59/month.',
  null, { employee: 0.14 }
);

addCalc('brazil-inss-calculator', 'Brazil INSS Calculator',
  'Free INSS (social security) contribution calculator for Brazil. Calculate progressive employee contributions for 2025.',
  ['inss calculator', 'brazil social security calculator', 'inss 2025 calculator'],
  [
    '{ name: "salary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 0 }',
  ],
  `(inputs) => {
      const salary = inputs.salary as number;
      if (!salary || salary <= 0) return null;
      const brackets = [{l:1518,r:0.075},{l:2793.88,r:0.09},{l:4190.83,r:0.12},{l:8157.41,r:0.14}];
      let contrib = 0, rem = Math.min(salary, 8157.41), prev = 0;
      for (const b of brackets) { const t = Math.min(rem, b.l - prev); if (t <= 0) break; contrib += t * b.r; rem -= t; prev = b.l; }
      return {
        primary: { label: "INSS Contribution", value: "R$" + formatNumber(contrib) },
        details: [
          { label: "Gross salary", value: "R$" + formatNumber(salary) },
          { label: "After INSS", value: "R$" + formatNumber(salary - contrib) },
          { label: "Effective rate", value: formatNumber((contrib / salary) * 100) + "%" },
          { label: "INSS ceiling", value: "R$8,157.41" },
        ],
        note: "INSS 2025 progressive rates: 7.5% (up to R$1,518), 9% (R$1,518-2,793.88), 12% (R$2,793.88-4,190.83), 14% (R$4,190.83-8,157.41).",
      };
    }`,
  [{ q: 'How is INSS calculated in Brazil?', a: 'INSS uses progressive rates: 7.5% up to R$1,518, 9% (R$1,518-2,793.88), 12% (R$2,793.88-4,190.83), 14% (R$4,190.83-8,157.41). Max contribution: ~R$951.63.' },
   { q: 'What is the INSS ceiling for 2025?', a: 'The INSS salary ceiling for 2025 is R$8,157.41/month, with a maximum monthly contribution of approximately R$951.63.' }],
  'INSS = Progressive rates: 7.5% / 9% / 12% / 14% on salary brackets up to R$8,157.41'
);

addCalc('brazil-13th-salary-calculator', 'Brazil 13th Salary Calculator',
  'Free 13th salary (décimo terceiro) calculator for Brazil. Calculate your Christmas bonus based on months worked.',
  ['13th salary calculator brazil', 'decimo terceiro calculator', 'brazil christmas bonus'],
  [
    '{ name: "salary", label: "Monthly Salary", type: "number", prefix: "R$", min: 0 }',
    '{ name: "months", label: "Months Worked This Year", type: "number", min: 1, max: 12, defaultValue: 12 }',
  ],
  `(inputs) => {
      const salary = inputs.salary as number;
      const months = inputs.months as number;
      if (!salary || !months) return null;
      const gross13 = salary * months / 12;
      return {
        primary: { label: "13th Salary (Gross)", value: "R$" + formatNumber(gross13) },
        details: [
          { label: "Monthly salary", value: "R$" + formatNumber(salary) },
          { label: "Months worked", value: String(months) + " / 12" },
          { label: "1st installment (by Nov 30)", value: "R$" + formatNumber(gross13 / 2) },
          { label: "2nd installment (by Dec 20)", value: "R$" + formatNumber(gross13 / 2) },
        ],
        note: "INSS and IRPF are deducted from the 2nd installment. FGTS 8% is paid on each installment.",
      };
    }`,
  [{ q: 'How is 13th salary calculated in Brazil?', a: '13th salary = (monthly salary / 12) × months worked. Paid in 2 installments: 1st by November 30, 2nd by December 20.' },
   { q: 'Is 13th salary taxable in Brazil?', a: 'Yes, INSS and income tax (IRPF) are deducted from the 2nd installment. FGTS of 8% is also calculated on the 13th salary.' }],
  '13th Salary = Monthly Salary × Months Worked / 12'
);

// BANGLADESH
addTaxCalc('Bangladesh', 'bangladesh', 'BDT', '৳',
  [{l:375000,r:0},{l:675000,r:0.10},{l:1075000,r:0.15},{l:1575000,r:0.20},{l:3575000,r:0.25},{l:Infinity,r:0.30}],
  'FY 2025-26 brackets. Women and seniors (65+) exempt up to ৳400,000. Minimum tax: ৳3,000-5,000.',
  15, { employee: 0.075 }
);

// RUSSIA
addTaxCalc('Russia', 'russia', 'RUB', '₽',
  [{l:2400000,r:0.13},{l:5000000,r:0.15},{l:20000000,r:0.18},{l:50000000,r:0.20},{l:Infinity,r:0.22}],
  '2025 progressive NDFL brackets. Previously flat 13%/15%.',
  20, { employee: 0 }
);

addCalc('russia-self-employed-tax-calculator', 'Russia Self-Employed Tax (NPD) Calculator',
  'Free Russia self-employed tax calculator. Calculate NPD (professional income tax) at 4% from individuals and 6% from businesses.',
  ['russia self employed tax', 'russia npd calculator', 'samozanyatiy calculator'],
  [
    '{ name: "fromIndividuals", label: "Monthly Income from Individuals", type: "number", prefix: "₽", defaultValue: 0, min: 0 }',
    '{ name: "fromBusiness", label: "Monthly Income from Businesses", type: "number", prefix: "₽", defaultValue: 0, min: 0 }',
  ],
  `(inputs) => {
      const fromInd = (inputs.fromIndividuals as number) || 0;
      const fromBiz = (inputs.fromBusiness as number) || 0;
      if (!fromInd && !fromBiz) return null;
      const total = fromInd + fromBiz;
      const taxInd = fromInd * 0.04;
      const taxBiz = fromBiz * 0.06;
      const totalTax = taxInd + taxBiz;
      const annual = total * 12;
      return {
        primary: { label: "Monthly Tax", value: "₽" + formatNumber(totalTax) },
        details: [
          { label: "Tax on individual income (4%)", value: "₽" + formatNumber(taxInd) },
          { label: "Tax on business income (6%)", value: "₽" + formatNumber(taxBiz) },
          { label: "Effective rate", value: formatNumber((totalTax / total) * 100) + "%" },
          { label: "Annual income", value: "₽" + formatNumber(annual) },
          { label: "Annual tax", value: "₽" + formatNumber(totalTax * 12) },
        ],
        note: "NPD annual revenue cap: ₽2,400,000. Initial bonus deduction of ₽10,000 reduces rates to 3%/4% until exhausted.",
      };
    }`,
  [{ q: 'What is NPD in Russia?', a: 'NPD (tax on professional income) is a simplified tax for self-employed: 4% on income from individuals, 6% from businesses. Annual cap: ₽2.4M. No social contributions required.' },
   { q: 'Who can register as self-employed in Russia?', a: 'Any individual with annual income under ₽2.4M who provides services or sells goods they produced. No employees allowed.' }],
  'NPD = Income from individuals × 4% + Income from businesses × 6%'
);

// ETHIOPIA
addTaxCalc('Ethiopia', 'ethiopia', 'ETB', 'ETB',
  [{l:7200,r:0},{l:19800,r:0.10},{l:38400,r:0.15},{l:63000,r:0.20},{l:93600,r:0.25},{l:130800,r:0.30},{l:Infinity,r:0.35}],
  'Monthly brackets annualized (×12). Original monthly: 0% up to 600, 10% to 1,650, 15% to 3,200, 20% to 5,250, 25% to 7,800, 30% to 10,900, 35% above.',
  15, { employee: 0.07 }
);

// MEXICO
addTaxCalc('Mexico', 'mexico', 'MXN', 'MX$',
  [{l:8952.48,r:0.0192},{l:75984.60,r:0.064},{l:133536.12,r:0.1088},{l:155229.84,r:0.16},{l:185852.52,r:0.1792},{l:374837.88,r:0.2136},{l:590796,r:0.2352},{l:1127926.80,r:0.30},{l:1503902.40,r:0.32},{l:4511707.32,r:0.34},{l:Infinity,r:0.35}],
  'ISR annual brackets for 2025. Progressive with cuota fija + rate on excess.',
  16, { employee: 0.025 }
);

addCalc('mexico-aguinaldo-calculator', 'Mexico Aguinaldo Calculator',
  'Free aguinaldo (Christmas bonus) calculator for Mexico. Calculate your legal minimum Christmas bonus and tax-exempt portion.',
  ['aguinaldo calculator', 'mexico christmas bonus calculator', 'aguinaldo mexico 2025'],
  [
    '{ name: "dailySalary", label: "Daily Salary", type: "number", prefix: "MX$", min: 0 }',
    '{ name: "daysWorked", label: "Days Worked This Year", type: "number", defaultValue: 365, min: 1, max: 365 }',
  ],
  `(inputs) => {
      const daily = inputs.dailySalary as number;
      const days = inputs.daysWorked as number;
      if (!daily || !days) return null;
      const fullAguinaldo = daily * 15;
      const proportional = fullAguinaldo * days / 365;
      const umaDaily = 113.14;
      const exempt = umaDaily * 30;
      const taxable = Math.max(0, proportional - exempt);
      return {
        primary: { label: "Aguinaldo", value: "MX$" + formatNumber(proportional) },
        details: [
          { label: "Full year (15 days)", value: "MX$" + formatNumber(fullAguinaldo) },
          { label: "Days worked", value: String(days) + " / 365" },
          { label: "Tax-exempt (30 UMA days)", value: "MX$" + formatNumber(exempt) },
          { label: "Taxable portion", value: "MX$" + formatNumber(taxable) },
        ],
        note: "Legal minimum: 15 days of salary. Tax-exempt up to 30 days of UMA (MX$113.14/day × 30). Due by Dec 20.",
      };
    }`,
  [{ q: 'How is aguinaldo calculated in Mexico?', a: 'Aguinaldo = daily salary × 15 days (minimum by law). If you worked less than a full year, it is prorated: (daily salary × 15) × days worked / 365.' },
   { q: 'Is aguinaldo taxable in Mexico?', a: 'Aguinaldo is tax-exempt up to 30 days of UMA (approximately MX$3,394 in 2025). Any excess is subject to ISR.' }],
  'Aguinaldo = Daily Salary × 15 × Days Worked / 365'
);

// JAPAN
addTaxCalc('Japan', 'japan', 'JPY', '¥',
  [{l:1950000,r:0.05},{l:3300000,r:0.10},{l:6950000,r:0.20},{l:9000000,r:0.23},{l:18000000,r:0.33},{l:40000000,r:0.40},{l:Infinity,r:0.45}],
  'National income tax + 2.1% reconstruction surtax. Resident tax (10%) not included.',
  10, { employee: 0.15 }
);

// PHILIPPINES
addCalc('philippines-income-tax-calculator', 'Philippines Income Tax Calculator',
  'Free Philippines income tax calculator with 2025 TRAIN law brackets. Calculate BIR tax on your annual taxable compensation.',
  ['philippines income tax calculator', 'bir tax calculator', 'train law tax calculator 2025'],
  [
    '{ name: "income", label: "Annual Taxable Income", type: "number", prefix: "₱", min: 0 }',
  ],
  `(inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      let tax = 0;
      if (income <= 250000) tax = 0;
      else if (income <= 400000) tax = (income - 250000) * 0.15;
      else if (income <= 800000) tax = 22500 + (income - 400000) * 0.20;
      else if (income <= 2000000) tax = 102500 + (income - 800000) * 0.25;
      else if (income <= 8000000) tax = 402500 + (income - 2000000) * 0.30;
      else tax = 2202500 + (income - 8000000) * 0.35;
      return {
        primary: { label: "Annual Income Tax", value: "₱" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "₱" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Monthly tax", value: "₱" + formatNumber(tax / 12) },
          { label: "Annual after-tax", value: "₱" + formatNumber(income - tax) },
        ],
        note: "2025 TRAIN law brackets. First ₱250,000 is tax-exempt.",
      };
    }`,
  [{ q: 'What are the 2025 Philippines tax brackets?', a: '0% up to ₱250K, 15% (₱250-400K), 20% (₱400-800K), 25% (₱800K-2M), 30% (₱2-8M), 35% (above ₱8M). Under TRAIN law effective 2025.' },
   { q: 'Is the first ₱250,000 tax-free?', a: 'Yes, under the TRAIN law, the first ₱250,000 of annual taxable income is completely exempt from income tax.' }],
  'Tax = Fixed amount per bracket + Rate × excess over bracket floor'
);

addCalc('philippines-sss-calculator', 'Philippines SSS Contribution Calculator',
  'Free SSS contribution calculator for Philippines 2025. Calculate employee and employer Social Security System contributions.',
  ['sss contribution calculator', 'sss contribution table 2025', 'philippines sss calculator'],
  [
    '{ name: "salary", label: "Monthly Salary", type: "number", prefix: "₱", min: 0 }',
  ],
  `(inputs) => {
      const salary = inputs.salary as number;
      if (!salary || salary <= 0) return null;
      const msc = Math.max(5000, Math.min(35000, Math.ceil(salary / 500) * 500));
      const employeeShare = msc * 0.05;
      const employerShare = msc * 0.10;
      const ec = msc <= 15000 ? 10 : 30;
      return {
        primary: { label: "Employee SSS", value: "₱" + formatNumber(employeeShare) },
        details: [
          { label: "Monthly Salary Credit", value: "₱" + formatNumber(msc) },
          { label: "Employer share (10%)", value: "₱" + formatNumber(employerShare) },
          { label: "EC (employer)", value: "₱" + formatNumber(ec) },
          { label: "Total contribution", value: "₱" + formatNumber(employeeShare + employerShare + ec) },
        ],
        note: "SSS rate: 15% total (5% employee, 10% employer). MSC range: ₱5,000-₱35,000.",
      };
    }`,
  [{ q: 'How much is SSS contribution in 2025?', a: 'Total rate is 15% of Monthly Salary Credit (MSC): 5% employee, 10% employer. MSC ranges from ₱5,000 to ₱35,000.' },
   { q: 'What is Monthly Salary Credit?', a: 'MSC is the salary bracket used to compute SSS contributions. It ranges from ₱5,000 (for salaries ≤₱5,249.99) to ₱35,000 (for salaries ≥₱34,750).' }],
  'Employee SSS = Monthly Salary Credit × 5%. Employer = MSC × 10%.'
);

// EGYPT
addTaxCalc('Egypt', 'egypt', 'EGP', 'EGP',
  [{l:40000,r:0},{l:55000,r:0.10},{l:70000,r:0.15},{l:200000,r:0.20},{l:400000,r:0.225},{l:1200000,r:0.25},{l:Infinity,r:0.275}],
  'Personal exemption of EGP 20,000/year deducted before applying brackets (not included here).',
  14, { employee: 0.11 }
);

// DR CONGO
addTaxCalc('DR Congo', 'dr-congo', 'CDF', 'CDF',
  [{l:1944000,r:0.03},{l:21600000,r:0.15},{l:43200000,r:0.30},{l:Infinity,r:0.40}],
  'IPR brackets. Tax cannot exceed 30% of total taxable salary. Dependent rebate: 2% per dependent (max 9).',
  16, null
);

// VIETNAM
addTaxCalc('Vietnam', 'vietnam', 'VND', '₫',
  [{l:60000000,r:0.05},{l:120000000,r:0.10},{l:216000000,r:0.15},{l:384000000,r:0.20},{l:624000000,r:0.25},{l:960000000,r:0.30},{l:Infinity,r:0.35}],
  'Annual brackets. Personal deduction: ₫11M/month (₫132M/year). Dependent deduction: ₫4.4M/month per dependent.',
  10, { employee: 0.105 }
);

// IRAN
addTaxCalc('Iran', 'iran', 'IRR', 'IRR',
  [{l:2880000000000,r:0},{l:4320000000000,r:0.10},{l:7200000000000,r:0.15},{l:10080000000000,r:0.20},{l:14400000000000,r:0.25},{l:20160000000000,r:0.30},{l:Infinity,r:0.35}],
  'FY 1404 brackets (March 2025-2026). Annual exemption: IRR 2.88 trillion.',
  10, { employee: 0.07 }
);

// TURKEY
addCalc('turkey-income-tax-calculator', 'Turkey Income Tax Calculator',
  'Free Turkey income tax (Gelir Vergisi) calculator for 2025. Calculate progressive tax on salary income with current brackets.',
  ['turkey income tax calculator', 'turkey gelir vergisi calculator', 'turkey tax calculator 2025'],
  [
    '{ name: "income", label: "Annual Salary Income", type: "number", prefix: "₺", min: 0 }',
  ],
  `(inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:158000,r:0.15},{l:330000,r:0.20},{l:1200000,r:0.27},{l:4300000,r:0.35},{l:Infinity,r:0.40}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "₺" + formatNumber(tax) },
        details: [
          { label: "Annual income", value: "₺" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100) + "%" },
          { label: "After-tax", value: "₺" + formatNumber(income - tax) },
        ],
        note: "2025 salary income brackets. Non-salary income has different thresholds for the 27% bracket (₺800K).",
      };
    }`,
  [{ q: 'What are Turkey income tax brackets for 2025?', a: 'Salary brackets: 15% up to ₺158K, 20% (₺158-330K), 27% (₺330K-1.2M), 35% (₺1.2-4.3M), 40% above ₺4.3M.' },
   { q: 'Is there stamp tax on salary in Turkey?', a: 'Yes, 0.759% stamp tax is applied to gross salary before all other deductions.' }],
  'Tax = Progressive rates: 15% / 20% / 27% / 35% / 40% on salary brackets'
);

addCalc('turkey-sgk-calculator', 'Turkey SGK Calculator',
  'Free Turkey SGK (social security) calculator for 2025. Calculate employee and employer SSI premiums and total payroll cost.',
  ['turkey sgk calculator', 'sgk primi hesaplama', 'turkey social security calculator 2025'],
  [
    '{ name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "₺", min: 0 }',
  ],
  `(inputs) => {
      const gross = inputs.gross as number;
      if (!gross || gross <= 0) return null;
      const floor = 26005.50;
      const ceiling = 195041.40;
      const base = Math.max(floor, Math.min(gross, ceiling));
      const empSSI = base * 0.14;
      const empUnemploy = base * 0.01;
      const stampTax = gross * 0.00759;
      const totalEmp = empSSI + empUnemploy + stampTax;
      const erSSI = base * 0.1675;
      const erUnemploy = base * 0.02;
      const totalEr = erSSI + erUnemploy;
      return {
        primary: { label: "Employee Deductions", value: "₺" + formatNumber(totalEmp) },
        details: [
          { label: "SSI premium (14%)", value: "₺" + formatNumber(empSSI) },
          { label: "Unemployment (1%)", value: "₺" + formatNumber(empUnemploy) },
          { label: "Stamp tax (0.759%)", value: "₺" + formatNumber(stampTax) },
          { label: "Employer SSI (16.75%)", value: "₺" + formatNumber(erSSI) },
          { label: "Employer unemployment (2%)", value: "₺" + formatNumber(erUnemploy) },
          { label: "Total employer cost", value: "₺" + formatNumber(gross + totalEr) },
        ],
        note: "2025 SGK floor: ₺26,005.50. Ceiling: ₺195,041.40. Employer gets 4-point discount reducing 20.75% to 16.75%.",
      };
    }`,
  [{ q: 'What are SGK rates for 2025?', a: 'Employee: 14% SSI + 1% unemployment = 15%. Employer: 16.75% SSI (with discount) + 2% unemployment = 18.75%. Plus 0.759% stamp tax on gross salary.' },
   { q: 'What is the SGK salary ceiling?', a: 'The 2025 SGK ceiling is ₺195,041.40/month. Contributions are not calculated on salary above this amount.' }],
  'Employee = SSI 14% + Unemployment 1% + Stamp Tax 0.759%. Employer = SSI 16.75% + Unemployment 2%.'
);

// GERMANY
addCalc('germany-income-tax-calculator', 'Germany Income Tax Calculator',
  'Free Germany income tax (Einkommensteuer) calculator for 2025. Includes Solidaritätszuschlag and church tax.',
  ['germany income tax calculator', 'germany einkommensteuer rechner', 'germany tax calculator 2025'],
  [
    '{ name: "income", label: "Annual Taxable Income", type: "number", prefix: "€", min: 0 }',
    '{ name: "churchTax", label: "Church Tax", type: "select", options: [{ label: "No church tax", value: "0" }, { label: "8% (Bavaria/Baden-Württemberg)", value: "8" }, { label: "9% (other states)", value: "9" }], defaultValue: "0" }',
  ],
  `(inputs) => {
      const income = inputs.income as number;
      const churchRate = parseFloat(inputs.churchTax as string) / 100;
      if (!income || income <= 0) return null;
      let tax = 0;
      if (income <= 12096) { tax = 0; }
      else if (income <= 17443) { const y = (income - 12096) / 10000; tax = (922.98 * y + 1400) * y; }
      else if (income <= 68480) { const z = (income - 17443) / 10000; tax = (181.19 * z + 2397) * z + 1025.38; }
      else if (income <= 277825) { tax = income * 0.42 - 10637.88; }
      else { tax = income * 0.45 - 18971.63; }
      tax = Math.max(0, Math.round(tax));
      const soli = tax > 19450 ? tax * 0.055 : 0;
      const church = tax * churchRate;
      const total = tax + soli + church;
      return {
        primary: { label: "Total Tax", value: "€" + formatNumber(total) },
        details: [
          { label: "Income tax", value: "€" + formatNumber(tax) },
          { label: "Solidarity surcharge (5.5%)", value: "€" + formatNumber(soli) },
          { label: "Church tax", value: "€" + formatNumber(church) },
          { label: "Effective rate", value: formatNumber((total / income) * 100) + "%" },
          { label: "Monthly after-tax", value: "€" + formatNumber((income - total) / 12) },
        ],
        note: "2025 brackets. Grundfreibetrag: €12,096. Soli exemption threshold: €19,450 tax liability. Formula-based progressive zones (not simple brackets).",
      };
    }`,
  [{ q: 'How does German income tax work?', a: 'Germany uses formula-based progressive zones: 0% up to €12,096, then smoothly rising from 14% to 42% (at €68,480), with a top rate of 45% above €277,825. Plus optional Solidarity surcharge (5.5%) and church tax (8-9%).' },
   { q: 'What is Solidaritätszuschlag?', a: 'A 5.5% surcharge on income tax, but ~90% of taxpayers are fully exempt (threshold: €19,450 tax liability for singles). Above the threshold, a gliding zone applies.' }],
  'German tax uses formula-based progressive zones, not flat brackets. Includes Soli (5.5%) and optional church tax (8/9%).'
);

addCalc('germany-gross-net-calculator', 'Germany Brutto-Netto Calculator',
  'Free Germany gross to net salary calculator (Brutto-Netto-Rechner). Calculate take-home pay with all social contributions and taxes.',
  ['germany brutto netto rechner', 'germany salary calculator', 'germany gross net calculator'],
  [
    '{ name: "gross", label: "Monthly Gross Salary (Brutto)", type: "number", prefix: "€", min: 0 }',
    '{ name: "taxClass", label: "Tax Class (Steuerklasse)", type: "select", options: [{ label: "Class 1 (Single)", value: "1" }, { label: "Class 3 (Married, higher earner)", value: "3" }, { label: "Class 5 (Married, lower earner)", value: "5" }], defaultValue: "1" }',
    '{ name: "churchTax", label: "Church Tax", type: "select", options: [{ label: "None", value: "0" }, { label: "8%", value: "8" }, { label: "9%", value: "9" }], defaultValue: "0" }',
  ],
  `(inputs) => {
      const gross = inputs.gross as number;
      const churchRate = parseFloat(inputs.churchTax as string) / 100;
      if (!gross || gross <= 0) return null;
      const pension = Math.min(gross, 8050) * 0.093;
      const health = Math.min(gross, 5512.50) * 0.0825;
      const care = Math.min(gross, 5512.50) * 0.023;
      const unemploy = Math.min(gross, 8050) * 0.013;
      const totalSocial = pension + health + care + unemploy;
      const annual = (gross - totalSocial) * 12;
      let tax = 0;
      if (annual <= 12096) tax = 0;
      else if (annual <= 17443) { const y = (annual - 12096) / 10000; tax = (922.98 * y + 1400) * y; }
      else if (annual <= 68480) { const z = (annual - 17443) / 10000; tax = (181.19 * z + 2397) * z + 1025.38; }
      else if (annual <= 277825) tax = annual * 0.42 - 10637.88;
      else tax = annual * 0.45 - 18971.63;
      tax = Math.max(0, Math.round(tax));
      const monthlyTax = tax / 12;
      const soli = tax > 19450 ? monthlyTax * 0.055 : 0;
      const church = monthlyTax * churchRate;
      const net = gross - totalSocial - monthlyTax - soli - church;
      return {
        primary: { label: "Monthly Net (Netto)", value: "€" + formatNumber(net) },
        details: [
          { label: "Pension insurance (9.3%)", value: "€" + formatNumber(pension) },
          { label: "Health insurance (~8.25%)", value: "€" + formatNumber(health) },
          { label: "Long-term care (2.3%)", value: "€" + formatNumber(care) },
          { label: "Unemployment (1.3%)", value: "€" + formatNumber(unemploy) },
          { label: "Income tax", value: "€" + formatNumber(monthlyTax) },
          { label: "Solidarity surcharge", value: "€" + formatNumber(soli) },
          { label: "Total deductions", value: "€" + formatNumber(gross - net) },
        ],
        note: "Approximation for Tax Class 1 (single). Actual amounts depend on exact health insurance rate and personal circumstances.",
      };
    }`,
  [{ q: 'How much is taken from my salary in Germany?', a: 'Approximately 40% for a typical single employee: ~20% social contributions (pension 9.3%, health ~8.25%, care 2.3%, unemployment 1.3%) plus ~20% income tax.' },
   { q: 'What are the social contribution ceilings in Germany?', a: 'In 2025: €8,050/month for pension and unemployment, €5,512.50/month for health and long-term care insurance.' }],
  'Net = Gross - Social (~20%) - Income Tax (formula-based progressive) - Soli - Church Tax'
);

addCalc('germany-minijob-calculator', 'Germany Minijob Calculator',
  'Free Germany Minijob calculator for 2025. Calculate earnings, hours, and employer costs for Minijob employment.',
  ['germany minijob calculator', 'minijob rechner 2025', 'minijob 556 euro'],
  [
    '{ name: "hours", label: "Hours per Month", type: "number", min: 1, max: 100 }',
    '{ name: "rate", label: "Hourly Wage", type: "number", prefix: "€", defaultValue: 12.82, min: 12.82, step: 0.01 }',
  ],
  `(inputs) => {
      const hours = inputs.hours as number;
      const rate = inputs.rate as number;
      if (!hours || !rate) return null;
      const earnings = hours * rate;
      const isMinijob = earnings <= 556;
      const employerCosts = earnings * 0.28;
      const flatTax = earnings * 0.02;
      return {
        primary: { label: "Monthly Earnings", value: "€" + formatNumber(earnings) },
        details: [
          { label: "Status", value: isMinijob ? "Minijob (€556 limit)" : "Exceeds Minijob limit!" },
          { label: "Employee pays", value: "€0 (tax-free)" },
          { label: "Employer social costs (~28%)", value: "€" + formatNumber(employerCosts) },
          { label: "Flat-rate tax (2%)", value: "€" + formatNumber(flatTax) },
          { label: "Annual earnings", value: "€" + formatNumber(earnings * 12) },
          { label: "Max hours at minimum wage", value: String(Math.floor(556 / 12.82)) + " hrs/month" },
        ],
        note: isMinijob ? "Minijob: employee pays no tax or social contributions. Employer pays ~28% plus 2% flat tax." : "Warning: exceeds €556 Minijob limit. Regular employment rules apply.",
      };
    }`,
  [{ q: 'What is a Minijob in Germany?', a: 'A Minijob is employment earning up to €556/month (2025). Employees pay no income tax or social contributions. Employer pays ~28% in flat-rate social costs plus 2% tax.' },
   { q: 'What is the minimum wage for Minijobs?', a: 'The 2025 minimum wage is €12.82/hour, which allows a maximum of ~43 hours per month for a Minijob.' }],
  'Minijob limit: €556/month. Employee: €0 deductions. Employer: ~28% social + 2% flat tax.'
);

// THAILAND
addTaxCalc('Thailand', 'thailand', 'THB', '฿',
  [{l:150000,r:0},{l:300000,r:0.05},{l:500000,r:0.10},{l:750000,r:0.15},{l:1000000,r:0.20},{l:2000000,r:0.25},{l:5000000,r:0.30},{l:Infinity,r:0.35}],
  'Net annual income after deductions. Employment deduction: 50% of income (max ฿100,000). Personal allowance: ฿60,000.',
  7, { employee: 0.05 }
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

fs.writeFileSync(path.join(__dirname, 'new-imports-countries.txt'), imports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-countries.txt'), regs.join('\n'));
console.log(`\nGenerated: ${generated} | Skipped: ${skipped}`);
console.log(`Total definitions: ${calcs.length}`);
console.log(`Imports saved to: scripts/new-imports-countries.txt`);
console.log(`Registry saved to: scripts/new-regs-countries.txt`);
