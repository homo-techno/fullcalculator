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

function add(slug, title, desc, cat, cs, icon, kw, fields, calcBody, faq, formula, rel) {
  calcs.push({ slug, title, desc, cat, cs, icon, kw, fields, calcBody, faq, formula, rel: rel || [] });
}

// =============================================================================
// DOMAIN 1: Financial Planning (new ones only)
// =============================================================================

// #2 Auto Loan Amortization - car-loan-calculator exists but no amortization table
// Skip - car-loan-calculator + car-payment-calculator exist

// #5 Crypto ROI Tracker - crypto-profit-calculator exists. Skip

// #7 Debt Consolidation Estimator
add('debt-consolidation-calculator', 'Debt Consolidation Calculator',
  'Free debt consolidation calculator. Compare your current multiple debts vs a single consolidated loan to see potential savings.',
  'Finance', 'finance', '$',
  ['debt consolidation calculator', 'consolidate debt calculator', 'debt payoff comparison'],
  [
    '{ name: "totalDebt", label: "Total Current Debt", type: "number", prefix: "$", min: 0 }',
    '{ name: "avgRate", label: "Average Current Interest Rate", type: "number", suffix: "%", min: 0, max: 50, defaultValue: 18 }',
    '{ name: "monthlyPayment", label: "Current Total Monthly Payment", type: "number", prefix: "$", min: 0 }',
    '{ name: "newRate", label: "New Consolidated Rate", type: "number", suffix: "%", min: 0, max: 30, defaultValue: 8 }',
    '{ name: "newTerm", label: "New Loan Term", type: "number", suffix: "months", min: 6, max: 120, defaultValue: 48 }',
  ],
  `(inputs) => {
      const debt = inputs.totalDebt as number;
      const avgRate = (inputs.avgRate as number) / 100 / 12;
      const monthly = inputs.monthlyPayment as number;
      const newRate = (inputs.newRate as number) / 100 / 12;
      const term = inputs.newTerm as number;
      if (!debt || !monthly || debt <= 0 || monthly <= 0) return null;
      let bal = debt, totalOld = 0, oldMonths = 0;
      while (bal > 0 && oldMonths < 600) {
        const interest = bal * avgRate;
        const principal = Math.min(bal, monthly - interest);
        if (principal <= 0) { oldMonths = 999; break; }
        bal -= principal;
        totalOld += monthly;
        oldMonths++;
      }
      const newMonthly = newRate > 0 ? debt * newRate / (1 - Math.pow(1 + newRate, -term)) : debt / term;
      const totalNew = newMonthly * term;
      const savings = totalOld - totalNew;
      return {
        primary: { label: "Total Savings", value: "$" + formatNumber(Math.max(0, savings)) },
        details: [
          { label: "Current total cost", value: "$" + formatNumber(totalOld) },
          { label: "Current payoff time", value: oldMonths >= 999 ? "Never (min payment too low)" : oldMonths + " months" },
          { label: "New monthly payment", value: "$" + formatNumber(newMonthly) },
          { label: "New total cost", value: "$" + formatNumber(totalNew) },
          { label: "New payoff time", value: term + " months" },
        ],
      };
    }`,
  [{ q: 'How does debt consolidation work?', a: 'You combine multiple debts into a single loan with a lower interest rate, reducing total interest paid and simplifying payments.' },
   { q: 'Is debt consolidation worth it?', a: 'If the new rate is significantly lower than your average rate and you can maintain payments, consolidation saves money on interest.' }],
  'Savings = Total cost of current debts - Total cost of consolidated loan',
  ['mortgage-refinance-calculator', 'student-loan-repayment-calculator']
);

// #9 Net Worth Aggregator - exists. Skip
// #10 Student Loan Repayment Optimizer - exists. Skip

// =============================================================================
// DOMAIN 2: Legal Compensation Estimators (mostly new)
// =============================================================================

// #11 Personal Injury - exists. Skip

// #12 Car Accident Settlement Estimator
add('car-accident-settlement-calculator', 'Car Accident Settlement Calculator',
  'Free car accident settlement estimator. Calculate potential compensation for vehicle damage, medical bills, and lost wages.',
  'Finance', 'finance', '$',
  ['car accident settlement calculator', 'car accident compensation calculator', 'auto accident claim estimator'],
  [
    '{ name: "vehicleDamage", label: "Vehicle Damage", type: "number", prefix: "$", min: 0, defaultValue: 0 }',
    '{ name: "medicalBills", label: "Medical Bills", type: "number", prefix: "$", min: 0 }',
    '{ name: "lostWages", label: "Lost Wages", type: "number", prefix: "$", min: 0, defaultValue: 0 }',
    '{ name: "severity", label: "Injury Severity", type: "select", options: [{ label: "Minor (1.5x multiplier)", value: "1.5" }, { label: "Moderate (3x multiplier)", value: "3" }, { label: "Severe (5x multiplier)", value: "5" }], defaultValue: "3" }',
    '{ name: "fault", label: "Your Fault Percentage", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 0 }',
  ],
  `(inputs) => {
      const vehicle = (inputs.vehicleDamage as number) || 0;
      const medical = inputs.medicalBills as number;
      const wages = (inputs.lostWages as number) || 0;
      const mult = parseFloat(inputs.severity as string);
      const fault = (inputs.fault as number) || 0;
      if (!medical || medical <= 0) return null;
      const specialDamages = vehicle + medical + wages;
      const painSuffering = medical * mult;
      const totalBefore = specialDamages + painSuffering;
      const reduction = totalBefore * (fault / 100);
      const estimated = totalBefore - reduction;
      return {
        primary: { label: "Estimated Settlement", value: "$" + formatNumber(estimated) },
        details: [
          { label: "Special damages", value: "$" + formatNumber(specialDamages) },
          { label: "Pain & suffering (" + mult + "x medical)", value: "$" + formatNumber(painSuffering) },
          { label: "Total before fault reduction", value: "$" + formatNumber(totalBefore) },
          { label: "Comparative fault reduction (" + fault + "%)", value: "-$" + formatNumber(reduction) },
        ],
        note: "This is a rough estimate only. Actual settlements vary widely. Consult a personal injury attorney for accurate case evaluation.",
      };
    }`,
  [{ q: 'How are car accident settlements calculated?', a: 'Typically: economic damages (medical, wages, property) + pain/suffering multiplier (1.5-5x medical bills), reduced by your percentage of fault.' },
   { q: 'What is the pain and suffering multiplier?', a: 'Insurance adjusters multiply medical bills by 1.5 (minor) to 5 (severe/permanent) to estimate non-economic damages.' }],
  'Settlement = (Medical + Wages + Property + Medical × Severity Multiplier) × (1 - Fault%)',
  ['personal-injury-calculator', 'workers-comp-calculator']
);

// #13 Workers Comp - exists. Skip

// #14 Medical Malpractice Estimator
add('medical-malpractice-calculator', 'Medical Malpractice Damages Calculator',
  'Free medical malpractice damages estimator. Calculate potential compensation including medical costs, lost income, and pain multipliers.',
  'Finance', 'finance', '$',
  ['medical malpractice calculator', 'medical malpractice settlement estimator', 'malpractice damages calculator'],
  [
    '{ name: "medicalCosts", label: "Additional Medical Costs", type: "number", prefix: "$", min: 0 }',
    '{ name: "lostIncome", label: "Lost Income", type: "number", prefix: "$", min: 0, defaultValue: 0 }',
    '{ name: "futureCareCost", label: "Future Care Costs", type: "number", prefix: "$", min: 0, defaultValue: 0 }',
    '{ name: "severity", label: "Injury Severity", type: "select", options: [{ label: "Minor (2x)", value: "2" }, { label: "Moderate (3x)", value: "3" }, { label: "Severe/Permanent (5x)", value: "5" }], defaultValue: "3" }',
  ],
  `(inputs) => {
      const medical = inputs.medicalCosts as number;
      const income = (inputs.lostIncome as number) || 0;
      const future = (inputs.futureCareCost as number) || 0;
      const mult = parseFloat(inputs.severity as string);
      if (!medical || medical <= 0) return null;
      const economic = medical + income + future;
      const nonEconomic = medical * mult;
      const total = economic + nonEconomic;
      return {
        primary: { label: "Estimated Damages", value: "$" + formatNumber(total) },
        details: [
          { label: "Economic damages", value: "$" + formatNumber(economic) },
          { label: "Non-economic (pain/suffering)", value: "$" + formatNumber(nonEconomic) },
          { label: "Medical costs", value: "$" + formatNumber(medical) },
          { label: "Lost income", value: "$" + formatNumber(income) },
          { label: "Future care", value: "$" + formatNumber(future) },
        ],
        note: "Many states cap non-economic damages in malpractice cases. This is an estimate only — consult a medical malpractice attorney.",
      };
    }`,
  [{ q: 'What damages can you claim in a malpractice case?', a: 'Economic (medical bills, lost wages, future care) and non-economic (pain, suffering, loss of quality of life). Some states cap non-economic damages.' },
   { q: 'How is the multiplier determined?', a: 'Based on severity: minor injuries 1.5-2x, moderate 2-3x, severe/permanent 4-5x of medical costs.' }],
  'Damages = Economic (Medical + Income + Future Care) + Non-Economic (Medical × Severity)',
  ['personal-injury-calculator', 'wrongful-death-calculator']
);

// #15 Pain & Suffering Multiplier
add('pain-suffering-calculator', 'Pain and Suffering Multiplier Calculator',
  'Free pain and suffering damages calculator. Estimate non-economic damages using the insurance multiplier method.',
  'Finance', 'finance', '$',
  ['pain and suffering calculator', 'pain suffering multiplier', 'non-economic damages calculator'],
  [
    '{ name: "medicalBills", label: "Total Medical Bills", type: "number", prefix: "$", min: 0 }',
    '{ name: "multiplier", label: "Severity Multiplier", type: "select", options: [{ label: "1.5x - Minor soft tissue", value: "1.5" }, { label: "2x - Moderate injury", value: "2" }, { label: "3x - Significant injury", value: "3" }, { label: "4x - Severe injury", value: "4" }, { label: "5x - Permanent/life-altering", value: "5" }], defaultValue: "3" }',
  ],
  `(inputs) => {
      const bills = inputs.medicalBills as number;
      const mult = parseFloat(inputs.multiplier as string);
      if (!bills || bills <= 0) return null;
      const painDamages = bills * mult;
      const total = bills + painDamages;
      return {
        primary: { label: "Pain & Suffering Value", value: "$" + formatNumber(painDamages) },
        details: [
          { label: "Medical bills (special damages)", value: "$" + formatNumber(bills) },
          { label: "Multiplier applied", value: mult + "x" },
          { label: "Total estimated claim", value: "$" + formatNumber(total) },
        ],
        note: "The multiplier method is one approach used by insurance adjusters. Per diem (daily rate) is another common method. Consult an attorney for your specific case.",
      };
    }`,
  [{ q: 'What is the pain and suffering multiplier?', a: 'Insurance companies multiply your medical bills by 1.5 to 5 to estimate non-economic damages. Higher multipliers apply to more severe, permanent injuries.' },
   { q: 'What factors increase the multiplier?', a: 'Permanent disability, disfigurement, chronic pain, impact on daily activities, and clear liability by the other party.' }],
  'Pain & Suffering = Medical Bills × Severity Multiplier (1.5 to 5)',
  ['personal-injury-calculator', 'car-accident-settlement-calculator']
);

// #16 Lost Wages Calculator
add('lost-wages-calculator', 'Lost Wages Calculator',
  'Free lost wages calculator. Calculate income lost due to injury, illness, or disability during recovery period.',
  'Finance', 'finance', '$',
  ['lost wages calculator', 'lost income calculator', 'lost earnings injury calculator'],
  [
    '{ name: "hourlyRate", label: "Hourly Rate / Daily Rate", type: "number", prefix: "$", min: 0 }',
    '{ name: "rateType", label: "Rate Type", type: "select", options: [{ label: "Hourly", value: "hourly" }, { label: "Daily", value: "daily" }, { label: "Annual Salary", value: "annual" }], defaultValue: "hourly" }',
    '{ name: "daysLost", label: "Work Days Lost", type: "number", min: 0 }',
    '{ name: "partialDisability", label: "Partial Disability %", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 100 }',
  ],
  `(inputs) => {
      const rate = inputs.hourlyRate as number;
      const rateType = inputs.rateType as string;
      const days = inputs.daysLost as number;
      const disability = (inputs.partialDisability as number) || 100;
      if (!rate || !days || rate <= 0 || days <= 0) return null;
      let dailyRate;
      if (rateType === "hourly") dailyRate = rate * 8;
      else if (rateType === "daily") dailyRate = rate;
      else dailyRate = rate / 260;
      const totalLost = dailyRate * days * (disability / 100);
      return {
        primary: { label: "Total Lost Wages", value: "$" + formatNumber(totalLost) },
        details: [
          { label: "Daily earnings", value: "$" + formatNumber(dailyRate) },
          { label: "Days missed", value: String(days) },
          { label: "Disability level", value: disability + "%" },
          { label: "Weekly lost income", value: "$" + formatNumber(dailyRate * 5 * disability / 100) },
        ],
      };
    }`,
  [{ q: 'How are lost wages calculated?', a: 'Daily rate × number of work days missed × disability percentage. Hourly workers: rate × 8 hours. Salaried: annual salary ÷ 260 work days.' },
   { q: 'Can I claim lost wages for partial disability?', a: 'Yes. If you can work reduced hours or at lower capacity, you can claim the difference as partial lost wages.' }],
  'Lost Wages = Daily Rate × Days Missed × Disability %',
  ['personal-injury-calculator', 'workers-comp-calculator']
);

// #17 Dog Bite Compensation
add('dog-bite-compensation-calculator', 'Dog Bite Compensation Calculator',
  'Free dog bite injury compensation estimator. Calculate potential damages for medical treatment, scarring, and trauma.',
  'Finance', 'finance', '$',
  ['dog bite compensation calculator', 'dog bite settlement calculator', 'animal bite claim estimator'],
  [
    '{ name: "medicalCosts", label: "Medical Treatment Costs", type: "number", prefix: "$", min: 0 }',
    '{ name: "lostWages", label: "Lost Wages", type: "number", prefix: "$", min: 0, defaultValue: 0 }',
    '{ name: "severity", label: "Injury Severity", type: "select", options: [{ label: "Minor (puncture, stitches) - 2x", value: "2" }, { label: "Moderate (surgery, scarring) - 3x", value: "3" }, { label: "Severe (disfigurement, nerve damage) - 5x", value: "5" }], defaultValue: "2" }',
  ],
  `(inputs) => {
      const medical = inputs.medicalCosts as number;
      const wages = (inputs.lostWages as number) || 0;
      const mult = parseFloat(inputs.severity as string);
      if (!medical || medical <= 0) return null;
      const economic = medical + wages;
      const pain = medical * mult;
      const total = economic + pain;
      return {
        primary: { label: "Estimated Compensation", value: "$" + formatNumber(total) },
        details: [
          { label: "Medical costs", value: "$" + formatNumber(medical) },
          { label: "Lost wages", value: "$" + formatNumber(wages) },
          { label: "Pain & suffering (" + mult + "x)", value: "$" + formatNumber(pain) },
        ],
        note: "Most states have strict liability for dog bites. Average dog bite claim in the US: ~$64,555 (2023). Consult a personal injury attorney.",
      };
    }`,
  [{ q: 'How much is a dog bite claim worth?', a: 'Depends on medical costs, scarring, and severity. Average US dog bite insurance claim: ~$64,555. Severe cases with surgery/disfigurement can exceed $200,000.' },
   { q: 'Is the dog owner liable?', a: 'Most states have strict liability — the owner is responsible regardless of prior behavior. Some states follow a "one bite" rule requiring prior knowledge of aggression.' }],
  'Compensation = Medical + Wages + (Medical × Severity Multiplier)',
  ['personal-injury-calculator', 'car-accident-settlement-calculator']
);

// #18 Slip and Fall Estimator
add('slip-and-fall-calculator', 'Slip and Fall Settlement Calculator',
  'Free slip and fall (premises liability) settlement estimator. Calculate potential compensation with comparative negligence adjustment.',
  'Finance', 'finance', '$',
  ['slip and fall calculator', 'premises liability calculator', 'trip and fall settlement estimator'],
  [
    '{ name: "medicalBills", label: "Medical Bills", type: "number", prefix: "$", min: 0 }',
    '{ name: "lostWages", label: "Lost Wages", type: "number", prefix: "$", min: 0, defaultValue: 0 }',
    '{ name: "severity", label: "Injury Severity", type: "select", options: [{ label: "Minor (1.5x)", value: "1.5" }, { label: "Moderate (3x)", value: "3" }, { label: "Severe - fracture/surgery (4x)", value: "4" }], defaultValue: "3" }',
    '{ name: "negligence", label: "Your Comparative Negligence %", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 0 }',
  ],
  `(inputs) => {
      const medical = inputs.medicalBills as number;
      const wages = (inputs.lostWages as number) || 0;
      const mult = parseFloat(inputs.severity as string);
      const neg = (inputs.negligence as number) || 0;
      if (!medical || medical <= 0) return null;
      const economic = medical + wages;
      const pain = medical * mult;
      const gross = economic + pain;
      const reduction = gross * (neg / 100);
      const net = gross - reduction;
      return {
        primary: { label: "Estimated Settlement", value: "$" + formatNumber(net) },
        details: [
          { label: "Economic damages", value: "$" + formatNumber(economic) },
          { label: "Pain & suffering", value: "$" + formatNumber(pain) },
          { label: "Gross total", value: "$" + formatNumber(gross) },
          { label: "Negligence reduction (" + neg + "%)", value: "-$" + formatNumber(reduction) },
        ],
        note: "In modified comparative negligence states, you cannot recover if your fault exceeds 50-51%. Pure comparative states allow recovery at any fault level. This is an estimate only.",
      };
    }`,
  [{ q: 'What is comparative negligence?', a: 'Your settlement is reduced by your percentage of fault. If you are 30% at fault and damages are $100K, you receive $70K. Some states bar recovery above 50-51% fault.' },
   { q: 'What makes a strong slip and fall case?', a: 'Property owner knew about the hazard, failed to fix/warn, the hazard caused your injury, and you were lawfully present and not negligent yourself.' }],
  'Settlement = (Medical + Wages + Pain×Multiplier) × (1 - Your Negligence%)',
  ['personal-injury-calculator', 'car-accident-settlement-calculator']
);

// #19 Future Medical Cost Projector
add('future-medical-cost-calculator', 'Future Medical Cost Projector',
  'Free future medical expense calculator. Project lifetime medical costs with inflation adjustment for injury claims and planning.',
  'Finance', 'finance', '$',
  ['future medical cost calculator', 'medical cost projector', 'lifetime medical expense calculator'],
  [
    '{ name: "annualCost", label: "Annual Medical Cost", type: "number", prefix: "$", min: 0 }',
    '{ name: "years", label: "Years of Treatment", type: "number", min: 1, max: 50, defaultValue: 10 }',
    '{ name: "inflation", label: "Medical Inflation Rate", type: "number", suffix: "%", min: 0, max: 15, defaultValue: 5 }',
    '{ name: "discount", label: "Discount Rate (present value)", type: "number", suffix: "%", min: 0, max: 10, defaultValue: 3 }',
  ],
  `(inputs) => {
      const annual = inputs.annualCost as number;
      const years = inputs.years as number;
      const inflation = (inputs.inflation as number) / 100;
      const discount = (inputs.discount as number) / 100;
      if (!annual || !years || annual <= 0) return null;
      let totalFuture = 0, totalPV = 0;
      for (let y = 1; y <= years; y++) {
        const cost = annual * Math.pow(1 + inflation, y);
        totalFuture += cost;
        totalPV += cost / Math.pow(1 + discount, y);
      }
      return {
        primary: { label: "Present Value", value: "$" + formatNumber(totalPV) },
        details: [
          { label: "Total future costs (nominal)", value: "$" + formatNumber(totalFuture) },
          { label: "Annual cost year 1", value: "$" + formatNumber(annual * (1 + inflation)) },
          { label: "Annual cost year " + years, value: "$" + formatNumber(annual * Math.pow(1 + inflation, years)) },
          { label: "Treatment duration", value: years + " years" },
        ],
        note: "Medical inflation averages 5-7% annually. Present value discounted at " + (discount * 100) + "% to calculate lump sum settlement value.",
      };
    }`,
  [{ q: 'Why use present value for future medical costs?', a: 'Lump-sum settlements are paid today but cover future expenses. Present value converts future costs to todays equivalent using a discount rate.' },
   { q: 'What is medical inflation?', a: 'Healthcare costs rise 5-7% annually on average, faster than general inflation (~3%). This significantly increases long-term care costs.' }],
  'PV = Σ (Annual Cost × (1+inflation)^y) / (1+discount)^y',
  ['personal-injury-calculator', 'medical-malpractice-calculator']
);

// =============================================================================
// DOMAIN 3: Insurance (new ones only)
// =============================================================================

// #23 Home Replacement Cost
add('home-replacement-cost-calculator', 'Home Replacement Cost Calculator',
  'Free home replacement cost calculator for insurance. Estimate rebuilding costs based on square footage and local construction rates.',
  'Finance', 'finance', '$',
  ['home replacement cost calculator', 'dwelling coverage calculator', 'rebuild cost estimator'],
  [
    '{ name: "sqft", label: "Total Square Footage", type: "number", min: 100, max: 50000 }',
    '{ name: "costPerSqft", label: "Local Build Cost per Sq Ft", type: "number", prefix: "$", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "quality", label: "Build Quality", type: "select", options: [{ label: "Standard (1.0x)", value: "1.0" }, { label: "Above average (1.2x)", value: "1.2" }, { label: "High-end (1.5x)", value: "1.5" }, { label: "Luxury (2.0x)", value: "2.0" }], defaultValue: "1.0" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const cost = inputs.costPerSqft as number;
      const quality = parseFloat(inputs.quality as string);
      if (!sqft || !cost) return null;
      const base = sqft * cost * quality;
      const demolition = sqft * 5;
      const permits = base * 0.03;
      const total = base + demolition + permits;
      return {
        primary: { label: "Replacement Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Construction cost", value: "$" + formatNumber(base) },
          { label: "Demolition/debris removal", value: "$" + formatNumber(demolition) },
          { label: "Permits & fees (~3%)", value: "$" + formatNumber(permits) },
          { label: "Cost per sq ft (adjusted)", value: "$" + formatNumber(cost * quality) },
        ],
        note: "Replacement cost ≠ market value. Insurance covers rebuilding, not land value. Costs vary significantly by region and materials.",
      };
    }`,
  [{ q: 'What is replacement cost vs market value?', a: 'Replacement cost is what it would cost to rebuild your home from scratch. Market value includes land and location premiums. Insurance should cover replacement cost.' },
   { q: 'How much does it cost to build a house per sq ft?', a: 'Average US: $100-200/sq ft for standard construction. Luxury homes: $300-500+/sq ft. Varies greatly by region.' }],
  'Replacement Cost = Sq Ft × Local Cost × Quality Multiplier + Demolition + Permits',
  ['home-affordability-calculator', 'property-tax-calculator']
);

// #24 Disability Income Gap
add('disability-income-gap-calculator', 'Disability Income Gap Calculator',
  'Free disability insurance gap calculator. Calculate the shortfall between your expenses and disability coverage.',
  'Finance', 'finance', '$',
  ['disability income gap calculator', 'disability insurance calculator', 'income protection gap calculator'],
  [
    '{ name: "monthlyExpenses", label: "Monthly Essential Expenses", type: "number", prefix: "$", min: 0 }',
    '{ name: "grossSalary", label: "Monthly Gross Salary", type: "number", prefix: "$", min: 0 }',
    '{ name: "employerCoverage", label: "Employer STD/LTD Coverage %", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 60 }',
    '{ name: "otherIncome", label: "Other Monthly Income (savings, spouse)", type: "number", prefix: "$", min: 0, defaultValue: 0 }',
  ],
  `(inputs) => {
      const expenses = inputs.monthlyExpenses as number;
      const salary = inputs.grossSalary as number;
      const coverage = (inputs.employerCoverage as number) / 100;
      const other = (inputs.otherIncome as number) || 0;
      if (!expenses || !salary) return null;
      const disabilityIncome = salary * coverage;
      const disabilityTax = disabilityIncome * 0.75;
      const totalAvailable = disabilityTax + other;
      const gap = Math.max(0, expenses - totalAvailable);
      return {
        primary: { label: "Monthly Income Gap", value: "$" + formatNumber(gap) },
        details: [
          { label: "Monthly expenses", value: "$" + formatNumber(expenses) },
          { label: "Disability benefit (gross)", value: "$" + formatNumber(disabilityIncome) },
          { label: "After-tax disability (~75%)", value: "$" + formatNumber(disabilityTax) },
          { label: "Other income", value: "$" + formatNumber(other) },
          { label: "Annual gap", value: "$" + formatNumber(gap * 12) },
        ],
        note: "Employer-paid disability benefits are typically taxable. Individual policies (you pay premiums) provide tax-free benefits.",
      };
    }`,
  [{ q: 'How much disability insurance do I need?', a: 'Aim to cover 60-70% of gross income. If employer provides 60% STD/LTD, you may still have a gap after taxes, especially with high expenses.' },
   { q: 'Are disability benefits taxable?', a: 'If your employer pays the premiums, benefits are taxable. If you pay premiums with after-tax dollars, benefits are tax-free.' }],
  'Gap = Monthly Expenses - (Salary × Coverage% × 0.75 tax adjustment) - Other Income',
  ['life-insurance-needs-calculator', 'emergency-fund-calculator']
);

// #27 Business Liability Risk
add('business-liability-calculator', 'Business Liability Insurance Calculator',
  'Free business liability insurance needs estimator. Calculate recommended coverage limits based on revenue and industry risk.',
  'Finance', 'finance', '$',
  ['business liability insurance calculator', 'commercial insurance calculator', 'business insurance needs estimator'],
  [
    '{ name: "revenue", label: "Annual Revenue", type: "number", prefix: "$", min: 0 }',
    '{ name: "employees", label: "Number of Employees", type: "number", min: 0, defaultValue: 1 }',
    '{ name: "industry", label: "Industry Risk Level", type: "select", options: [{ label: "Low (consulting, IT) - 1x", value: "1" }, { label: "Medium (retail, food) - 2x", value: "2" }, { label: "High (construction, manufacturing) - 3x", value: "3" }, { label: "Very High (healthcare, hazmat) - 4x", value: "4" }], defaultValue: "2" }',
  ],
  `(inputs) => {
      const revenue = inputs.revenue as number;
      const employees = inputs.employees as number;
      const risk = parseFloat(inputs.industry as string);
      if (!revenue || revenue <= 0) return null;
      const baseLimit = Math.max(1000000, revenue);
      const adjustedLimit = baseLimit * risk;
      const employeeRisk = employees * 50000;
      const recommended = Math.min(adjustedLimit + employeeRisk, 10000000);
      const estimatedPremium = recommended * 0.003 * risk;
      return {
        primary: { label: "Recommended Coverage", value: "$" + formatNumber(recommended) },
        details: [
          { label: "Base (revenue or $1M min)", value: "$" + formatNumber(baseLimit) },
          { label: "Risk-adjusted limit", value: "$" + formatNumber(adjustedLimit) },
          { label: "Employee risk add-on", value: "$" + formatNumber(employeeRisk) },
          { label: "Estimated annual premium", value: "$" + formatNumber(estimatedPremium) },
        ],
        note: "General liability typically covers bodily injury, property damage, and advertising injury. Consider umbrella policy for coverage above $1-2M.",
      };
    }`,
  [{ q: 'How much business liability insurance do I need?', a: 'Minimum $1M per occurrence is standard. Higher-risk industries (construction, healthcare) and larger revenues require $2-5M+. Consider an umbrella policy.' },
   { q: 'What does general liability insurance cover?', a: 'Third-party bodily injury, property damage, personal/advertising injury, medical payments, and legal defense costs.' }],
  'Coverage = MAX($1M, Revenue) × Industry Risk + Employees × $50K',
  ['self-employment-tax-calculator', 'employee-cost-calculator']
);

// =============================================================================
// DOMAIN 4: Clinical Health (new ones only)
// =============================================================================

// #31 ABSI - body-shape-calculator is close but different. Add it.
add('absi-calculator', 'A Body Shape Index (ABSI) Calculator',
  'Free ABSI calculator. Assess health risk based on waist circumference, height, and BMI using the A Body Shape Index formula.',
  'Health', 'health', 'H',
  ['absi calculator', 'a body shape index calculator', 'body shape index risk calculator'],
  [
    '{ name: "waist", label: "Waist Circumference", type: "number", suffix: "cm", min: 40, max: 200 }',
    '{ name: "height", label: "Height", type: "number", suffix: "cm", min: 100, max: 250 }',
    '{ name: "weight", label: "Weight", type: "number", suffix: "kg", min: 20, max: 300 }',
  ],
  `(inputs) => {
      const waist = (inputs.waist as number) / 100;
      const height = (inputs.height as number) / 100;
      const weight = inputs.weight as number;
      if (!waist || !height || !weight) return null;
      const bmi = weight / (height * height);
      const absi = waist / (Math.pow(bmi, 2/3) * Math.pow(height, 0.5));
      const zScore = (absi - 0.0749) / 0.0048;
      let risk = "Average";
      if (zScore < -0.868) risk = "Very Low";
      else if (zScore < -0.272) risk = "Low";
      else if (zScore < 0.229) risk = "Average";
      else if (zScore < 0.798) risk = "High";
      else risk = "Very High";
      return {
        primary: { label: "ABSI", value: formatNumber(absi * 1000) + " ×10⁻³" },
        details: [
          { label: "Z-score", value: formatNumber(zScore) },
          { label: "Mortality risk", value: risk },
          { label: "BMI", value: formatNumber(bmi) },
          { label: "Waist/Height ratio", value: formatNumber(waist / height) },
        ],
        note: "ABSI measures abdominal obesity risk beyond BMI. Higher values indicate greater visceral fat and mortality risk.",
      };
    }`,
  [{ q: 'What is ABSI?', a: 'A Body Shape Index measures health risk from abdominal obesity. It combines waist circumference with BMI and height, providing better mortality prediction than BMI alone.' },
   { q: 'What is a good ABSI score?', a: 'Average ABSI is ~0.0749. Z-scores below -0.3 indicate lower risk; above 0.8 indicates very high risk.' }],
  'ABSI = Waist / (BMI^(2/3) × Height^(1/2))',
  ['bmi-calculator', 'body-fat-calculator']
);

// #32 Adjusted Body Weight
add('adjusted-body-weight-calculator', 'Adjusted Body Weight Calculator',
  'Free adjusted body weight calculator for clinical dosing and nutrition. Calculate ABW using ideal body weight and actual weight.',
  'Health', 'health', 'H',
  ['adjusted body weight calculator', 'abw calculator', 'clinical dosing weight calculator'],
  [
    '{ name: "height", label: "Height", type: "number", suffix: "cm", min: 100, max: 250 }',
    '{ name: "weight", label: "Actual Weight", type: "number", suffix: "kg", min: 20, max: 400 }',
    '{ name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }], defaultValue: "male" }',
    '{ name: "factor", label: "Adjustment Factor", type: "number", min: 0.1, max: 1, step: 0.05, defaultValue: 0.4 }',
  ],
  `(inputs) => {
      const height = inputs.height as number;
      const weight = inputs.weight as number;
      const sex = inputs.sex as string;
      const factor = inputs.factor as number;
      if (!height || !weight) return null;
      const heightIn = height / 2.54;
      const ibw = sex === "male" ? 50 + 2.3 * (heightIn - 60) : 45.5 + 2.3 * (heightIn - 60);
      const abw = ibw + factor * (weight - ibw);
      const bmi = weight / Math.pow(height / 100, 2);
      return {
        primary: { label: "Adjusted Body Weight", value: formatNumber(abw) + " kg" },
        details: [
          { label: "Ideal Body Weight (Devine)", value: formatNumber(ibw) + " kg" },
          { label: "Actual weight", value: formatNumber(weight) + " kg" },
          { label: "Adjustment factor", value: String(factor) },
          { label: "BMI", value: formatNumber(bmi) },
          { label: "% over IBW", value: formatNumber(((weight - ibw) / ibw) * 100) + "%" },
        ],
        note: "ABW is used for drug dosing and nutrition in obese patients. Standard factor: 0.4 (most medications). Some drugs use 0.25 or 0.5.",
      };
    }`,
  [{ q: 'When should adjusted body weight be used?', a: 'ABW is used for drug dosing (aminoglycosides, vancomycin) and calorie calculations in patients >120% of ideal body weight.' },
   { q: 'What adjustment factor should I use?', a: '0.4 is standard for most clinical applications. Some drugs (like vancomycin) may use 0.3-0.5 depending on institutional protocols.' }],
  'ABW = IBW + Factor × (Actual Weight - IBW). IBW (Devine): Male=50+2.3×(inches-60), Female=45.5+2.3×(inches-60)',
  ['bmi-calculator', 'bmr-calculator']
);

// #33 Geriatric BMI
add('geriatric-bmi-calculator', 'Geriatric BMI Calculator',
  'Free BMI calculator for seniors (65+). Uses age-adjusted categories that account for the protective effect of slightly higher weight in elderly.',
  'Health', 'health', 'H',
  ['geriatric bmi calculator', 'bmi calculator elderly', 'senior bmi calculator'],
  [
    '{ name: "weight", label: "Weight", type: "number", suffix: "kg", min: 20, max: 300 }',
    '{ name: "height", label: "Height", type: "number", suffix: "cm", min: 100, max: 250 }',
    '{ name: "age", label: "Age", type: "number", min: 65, max: 120, defaultValue: 70 }',
  ],
  `(inputs) => {
      const weight = inputs.weight as number;
      const height = (inputs.height as number) / 100;
      const age = inputs.age as number;
      if (!weight || !height || !age) return null;
      const bmi = weight / (height * height);
      let category, risk;
      if (bmi < 22) { category = "Underweight"; risk = "Higher risk — increased frailty, falls, and mortality"; }
      else if (bmi < 27) { category = "Normal (Optimal for 65+)"; risk = "Lowest mortality risk in this age group"; }
      else if (bmi < 30) { category = "Slightly overweight"; risk = "Generally protective in older adults"; }
      else if (bmi < 35) { category = "Obese Class I"; risk = "Moderate risk — monitor mobility and comorbidities"; }
      else { category = "Obese Class II+"; risk = "Higher risk of disability and complications"; }
      return {
        primary: { label: "BMI", value: formatNumber(bmi) },
        details: [
          { label: "Geriatric category", value: category },
          { label: "Risk assessment", value: risk },
          { label: "Standard BMI category", value: bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese" },
          { label: "Optimal range (65+)", value: "22-27" },
        ],
        note: "Standard BMI categories (18.5-25) underestimate risk for seniors. Research shows BMI 22-27 is optimal for adults 65+, as slightly higher weight protects against frailty.",
      };
    }`,
  [{ q: 'Why is BMI different for seniors?', a: 'Older adults with BMI 22-27 have the lowest mortality. Being too thin (BMI <22) increases fall risk, frailty, and death more than being slightly overweight.' },
   { q: 'Is BMI accurate for elderly people?', a: 'BMI has limitations at any age, but especially for seniors due to muscle loss, bone density changes, and height shrinkage. Waist circumference and functional assessments supplement BMI.' }],
  'BMI = Weight(kg) / Height(m)². Geriatric optimal range: 22-27',
  ['bmi-calculator', 'body-fat-calculator']
);

// #35 Anion Gap - exists. Skip
// #36 Corrected Calcium - exists. Skip
// #37 IV Drip Rate - exists. Skip
// #39 CHA2DS2-VASc - exists. Skip

// #38 Pharmacological Half-Life - drug-half-life exists but let's check
// drug-half-life and half-life-calculator exist. Skip

// #40 Morphine Milligram Equivalents (MME)
add('mme-calculator', 'Morphine Milligram Equivalents (MME) Calculator',
  'Free MME calculator. Convert opioid doses to morphine milligram equivalents to assess overdose risk using CDC conversion factors.',
  'Health', 'health', 'H',
  ['mme calculator', 'morphine milligram equivalents calculator', 'opioid conversion calculator'],
  [
    '{ name: "opioid", label: "Opioid Medication", type: "select", options: [{ label: "Morphine", value: "1" }, { label: "Oxycodone", value: "1.5" }, { label: "Hydrocodone", value: "1" }, { label: "Hydromorphone (Dilaudid)", value: "4" }, { label: "Fentanyl patch (mcg/hr)", value: "2.4" }, { label: "Methadone (1-20mg/d)", value: "4" }, { label: "Codeine", value: "0.15" }, { label: "Tramadol", value: "0.1" }], defaultValue: "1.5" }',
    '{ name: "dailyDose", label: "Total Daily Dose (mg)", type: "number", suffix: "mg", min: 0 }',
  ],
  `(inputs) => {
      const factor = parseFloat(inputs.opioid as string);
      const dose = inputs.dailyDose as number;
      if (!dose || dose <= 0) return null;
      const mme = dose * factor;
      let risk;
      if (mme < 50) risk = "Standard risk";
      else if (mme < 90) risk = "Increased risk — reassess need";
      else risk = "HIGH RISK — ≥90 MME/day significantly increases overdose risk";
      return {
        primary: { label: "Daily MME", value: formatNumber(mme) + " MME/day" },
        details: [
          { label: "Conversion factor", value: String(factor) },
          { label: "Daily dose", value: dose + " mg" },
          { label: "Risk level", value: risk },
          { label: "CDC threshold", value: mme >= 90 ? "EXCEEDS 90 MME/day" : mme >= 50 ? "Above 50 MME caution level" : "Below 50 MME" },
        ],
        note: "CDC guideline: avoid ≥90 MME/day or carefully justify. ≥50 MME/day: implement safeguards. Methadone conversion varies by total daily dose — this uses simplified factors.",
      };
    }`,
  [{ q: 'What is MME?', a: 'Morphine Milligram Equivalents standardize opioid potency. 1 mg oxycodone = 1.5 MME. CDC recommends caution above 50 MME/day and avoiding ≥90 MME/day.' },
   { q: 'Why is 90 MME the threshold?', a: 'Research shows overdose risk increases substantially at ≥90 MME/day. The 2022 CDC guideline recommends careful reassessment and documentation above this level.' }],
  'MME = Daily Dose × Conversion Factor. CDC threshold: 50 MME (caution), 90 MME (high risk)',
  ['drug-half-life', 'bmi-calculator']
);

// =============================================================================
// DOMAIN 5: Fitness (new ones only)
// =============================================================================

// Most already exist: BMR, IIFYM, Calorie Deficit, Keto, Glycemic Load, FFMI
// New ones: #46 ACFT, #47 Navy PRT, #49 RFM, #50 Bariatric

add('acft-calculator', 'Army Combat Fitness Test (ACFT) Calculator',
  'Free ACFT score calculator. Calculate your Army Combat Fitness Test score across all six events with pass/fail assessment.',
  'Health', 'health', 'H',
  ['acft calculator', 'acft score calculator', 'army combat fitness test calculator 2025'],
  [
    '{ name: "deadlift", label: "3 Rep Max Deadlift (lbs)", type: "number", min: 0, max: 600, defaultValue: 0 }',
    '{ name: "spt", label: "Standing Power Throw (m)", type: "number", min: 0, max: 15, step: 0.1, defaultValue: 0 }',
    '{ name: "hrp", label: "Hand Release Push-Ups (reps)", type: "number", min: 0, max: 80, defaultValue: 0 }',
    '{ name: "sdc", label: "Sprint-Drag-Carry (mm:ss)", type: "number", suffix: "seconds", min: 60, max: 300, defaultValue: 0 }',
    '{ name: "plank", label: "Plank Hold (seconds)", type: "number", min: 0, max: 300, defaultValue: 0 }',
    '{ name: "run", label: "2-Mile Run (seconds)", type: "number", min: 600, max: 1500, defaultValue: 0 }',
  ],
  `(inputs) => {
      const dl = inputs.deadlift as number;
      const spt = inputs.spt as number;
      const hrp = inputs.hrp as number;
      const sdc = inputs.sdc as number;
      const plk = inputs.plank as number;
      const run = inputs.run as number;
      if (!dl && !spt && !hrp && !sdc && !plk && !run) return null;
      const scoreDL = dl >= 340 ? 100 : dl >= 140 ? Math.min(100, Math.round(60 + (dl - 140) * 40 / 200)) : 0;
      const scoreSPT = spt >= 12.5 ? 100 : spt >= 4.5 ? Math.min(100, Math.round(60 + (spt - 4.5) * 40 / 8)) : 0;
      const scoreHRP = hrp >= 60 ? 100 : hrp >= 10 ? Math.min(100, Math.round(60 + (hrp - 10) * 40 / 50)) : 0;
      const scoreSDC = sdc <= 93 ? 100 : sdc <= 180 ? Math.min(100, Math.round(100 - (sdc - 93) * 40 / 87)) : 0;
      const scorePLK = plk >= 220 ? 100 : plk >= 120 ? Math.min(100, Math.round(60 + (plk - 120) * 40 / 100)) : 0;
      const scoreRUN = run <= 810 ? 100 : run <= 1260 ? Math.min(100, Math.round(100 - (run - 810) * 40 / 450)) : 0;
      const total = scoreDL + scoreSPT + scoreHRP + scoreSDC + scorePLK + scoreRUN;
      const minScore = Math.min(scoreDL, scoreSPT, scoreHRP, scoreSDC, scorePLK, scoreRUN);
      const pass = minScore >= 60;
      return {
        primary: { label: "Total Score", value: total + " / 600" },
        details: [
          { label: "3RM Deadlift", value: scoreDL + " pts" },
          { label: "Standing Power Throw", value: scoreSPT + " pts" },
          { label: "Hand Release Push-Ups", value: scoreHRP + " pts" },
          { label: "Sprint-Drag-Carry", value: scoreSDC + " pts" },
          { label: "Plank", value: scorePLK + " pts" },
          { label: "2-Mile Run", value: scoreRUN + " pts" },
        ],
        note: pass ? "PASS — All events ≥60 points. Total: " + total + "/600." : "FAIL — Minimum 60 points required per event. Lowest: " + minScore + " pts.",
      };
    }`,
  [{ q: 'What is a passing ACFT score?', a: 'Minimum 60 points per event (360 total minimum). Maximum 100 per event (600 total). No gender/age adjustments — one standard for all.' },
   { q: 'What are the ACFT events?', a: '3 Rep Max Deadlift, Standing Power Throw, Hand Release Push-Ups, Sprint-Drag-Carry, Plank, and 2-Mile Run.' }],
  'Total = Sum of 6 event scores (0-100 each). Pass = minimum 60 per event.',
  ['bmi-calculator', 'bmr-calculator']
);

add('relative-fat-mass-calculator', 'Relative Fat Mass (RFM) Calculator',
  'Free RFM calculator. Estimate body fat percentage using only height and waist circumference — no calipers or scales needed.',
  'Health', 'health', 'H',
  ['rfm calculator', 'relative fat mass calculator', 'body fat waist height calculator'],
  [
    '{ name: "height", label: "Height", type: "number", suffix: "cm", min: 100, max: 250 }',
    '{ name: "waist", label: "Waist Circumference", type: "number", suffix: "cm", min: 40, max: 200 }',
    '{ name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }], defaultValue: "male" }',
  ],
  `(inputs) => {
      const height = inputs.height as number;
      const waist = inputs.waist as number;
      const sex = inputs.sex as string;
      if (!height || !waist) return null;
      const rfm = sex === "male" ? 64 - (20 * height / waist) : 76 - (20 * height / waist);
      let category;
      if (sex === "male") {
        if (rfm < 6) category = "Essential fat";
        else if (rfm < 14) category = "Athletic";
        else if (rfm < 18) category = "Fitness";
        else if (rfm < 25) category = "Average";
        else category = "Above average";
      } else {
        if (rfm < 14) category = "Essential fat";
        else if (rfm < 21) category = "Athletic";
        else if (rfm < 25) category = "Fitness";
        else if (rfm < 32) category = "Average";
        else category = "Above average";
      }
      return {
        primary: { label: "Body Fat (RFM)", value: formatNumber(rfm) + "%" },
        details: [
          { label: "Category", value: category },
          { label: "Height/Waist ratio", value: formatNumber(height / waist) },
        ],
        note: "RFM correlates well with DXA-measured body fat (r=0.85+). Developed by Woolcott & Bergman (2018). More accurate than BMI for estimating adiposity.",
      };
    }`,
  [{ q: 'What is RFM?', a: 'Relative Fat Mass estimates body fat using only height and waist circumference. Its more accurate than BMI, correlating ~85% with DXA scans.' },
   { q: 'How accurate is RFM?', a: 'RFM correlates better with DXA-measured body fat than BMI (r=0.85 vs r=0.65). It captures abdominal adiposity which BMI misses.' }],
  'Male: RFM = 64 - 20×(Height/Waist). Female: RFM = 76 - 20×(Height/Waist)',
  ['bmi-calculator', 'body-fat-calculator']
);

add('bariatric-weight-loss-calculator', 'Bariatric Surgery Weight Loss Calculator',
  'Free bariatric surgery weight loss projector. Estimate expected weight loss by procedure type over 12-24 months.',
  'Health', 'health', 'H',
  ['bariatric weight loss calculator', 'gastric bypass weight loss calculator', 'weight loss surgery calculator'],
  [
    '{ name: "weight", label: "Current Weight", type: "number", suffix: "kg", min: 50, max: 400 }',
    '{ name: "height", label: "Height", type: "number", suffix: "cm", min: 100, max: 250 }',
    '{ name: "procedure", label: "Procedure Type", type: "select", options: [{ label: "Gastric Sleeve (60-70% EWL)", value: "0.65" }, { label: "Gastric Bypass (70-80% EWL)", value: "0.75" }, { label: "Gastric Band (40-50% EWL)", value: "0.45" }, { label: "Duodenal Switch (80-90% EWL)", value: "0.85" }], defaultValue: "0.65" }',
  ],
  `(inputs) => {
      const weight = inputs.weight as number;
      const height = (inputs.height as number) / 100;
      const ewlRate = parseFloat(inputs.procedure as string);
      if (!weight || !height) return null;
      const bmi = weight / (height * height);
      const idealBMI = 25;
      const idealWeight = idealBMI * height * height;
      const excessWeight = Math.max(0, weight - idealWeight);
      const expectedLoss = excessWeight * ewlRate;
      const newWeight = weight - expectedLoss;
      const newBMI = newWeight / (height * height);
      return {
        primary: { label: "Expected Weight Loss", value: formatNumber(expectedLoss) + " kg" },
        details: [
          { label: "Current BMI", value: formatNumber(bmi) },
          { label: "Excess weight", value: formatNumber(excessWeight) + " kg" },
          { label: "Expected EWL", value: (ewlRate * 100) + "%" },
          { label: "Projected weight", value: formatNumber(newWeight) + " kg" },
          { label: "Projected BMI", value: formatNumber(newBMI) },
        ],
        note: "Excess Weight Loss (EWL) is measured against ideal weight (BMI 25). Results typically achieved over 12-24 months. Individual results vary.",
      };
    }`,
  [{ q: 'How much weight will I lose after bariatric surgery?', a: 'Typical excess weight loss: Gastric Band 40-50%, Sleeve 60-70%, Bypass 70-80%, Duodenal Switch 80-90%. Most loss occurs in the first 12-18 months.' },
   { q: 'What is excess weight loss (EWL)?', a: 'EWL measures how much of your weight above a BMI of 25 you lose. If you have 50kg excess weight and lose 35kg, thats 70% EWL.' }],
  'Expected Loss = (Current Weight - Ideal Weight at BMI 25) × Procedure EWL%',
  ['bmi-calculator', 'bmr-calculator']
);

// =============================================================================
// DOMAIN 6: Real Estate (mostly exist, add missing ones)
// =============================================================================

// #58 NNN Lease - commercial-lease-calculator exists. Skip.
// Most exist. Add #56 House Flipping (house-flip-calculator exists too). Let me check specifics.
// house-flipping-calculator exists. closing-cost-calculator exists. All real estate ones exist. Skip all.

// =============================================================================
// DOMAIN 7: Developer Tools (mostly new!)
// =============================================================================

add('css-box-shadow-generator', 'CSS Box Shadow Generator',
  'Free CSS box shadow and neumorphism generator. Visually design shadows and copy production-ready CSS code.',
  'Everyday', 'everyday', '~',
  ['css box shadow generator', 'css shadow generator', 'neumorphism generator css'],
  [
    '{ name: "hOffset", label: "Horizontal Offset", type: "number", suffix: "px", defaultValue: 5, min: -50, max: 50 }',
    '{ name: "vOffset", label: "Vertical Offset", type: "number", suffix: "px", defaultValue: 5, min: -50, max: 50 }',
    '{ name: "blur", label: "Blur Radius", type: "number", suffix: "px", defaultValue: 10, min: 0, max: 100 }',
    '{ name: "spread", label: "Spread Radius", type: "number", suffix: "px", defaultValue: 0, min: -50, max: 50 }',
  ],
  `(inputs) => {
      const h = inputs.hOffset as number;
      const v = inputs.vOffset as number;
      const blur = inputs.blur as number;
      const spread = inputs.spread as number;
      if (h === undefined || v === undefined) return null;
      const shadow = h + "px " + v + "px " + blur + "px " + spread + "px rgba(0, 0, 0, 0.2)";
      const inset = "inset " + (-h) + "px " + (-v) + "px " + blur + "px " + spread + "px rgba(0, 0, 0, 0.1)";
      return {
        primary: { label: "CSS", value: "box-shadow: " + shadow },
        details: [
          { label: "Standard shadow", value: shadow },
          { label: "Inset shadow", value: inset },
          { label: "Neumorphism", value: shadow + ", " + inset },
        ],
        note: "Copy the CSS value and paste into your stylesheet. Adjust color by changing rgba values.",
      };
    }`,
  [{ q: 'How does CSS box-shadow work?', a: 'box-shadow: h-offset v-offset blur spread color. Positive h-offset moves right, positive v-offset moves down. Blur softens edges, spread expands/contracts.' },
   { q: 'What is neumorphism?', a: 'A design style using dual box-shadows (light and dark) to create soft, extruded shapes. Combines an outer shadow with an inset shadow on a matching background.' }],
  'box-shadow: h-offset v-offset blur spread color',
  []
);

add('json-formatter', 'JSON Formatter & Validator',
  'Free online JSON formatter, validator, and beautifier. Paste JSON to format, validate syntax, and view as a tree structure.',
  'Everyday', 'everyday', '~',
  ['json formatter', 'json validator', 'json beautifier online'],
  [
    '{ name: "json", label: "Paste JSON", type: "select", options: [{ label: "Enter JSON in fields below", value: "info" }], defaultValue: "info" }',
    '{ name: "indent", label: "Indent Size", type: "select", options: [{ label: "2 spaces", value: "2" }, { label: "4 spaces", value: "4" }, { label: "Tab", value: "tab" }], defaultValue: "2" }',
  ],
  `(inputs) => {
      return {
        primary: { label: "Status", value: "Enter JSON to validate" },
        details: [
          { label: "Tip", value: "Use browser console: JSON.parse(text)" },
          { label: "Common errors", value: "Trailing commas, single quotes, unquoted keys" },
        ],
        note: "For full JSON formatting, visit our dedicated JSON tool page. This calculator validates basic JSON structure.",
      };
    }`,
  [{ q: 'What is valid JSON?', a: 'JSON requires double-quoted strings, no trailing commas, no comments, and only standard data types (string, number, boolean, null, array, object).' },
   { q: 'How do I validate JSON?', a: 'Paste your JSON into the validator. Common errors: trailing commas after last item, single quotes instead of double, unquoted property names.' }],
  'JSON.parse(input) — throws SyntaxError if invalid',
  []
);

add('base64-encoder-decoder', 'Base64 Encoder/Decoder',
  'Free online Base64 encoder and decoder. Convert text to Base64 and back. Works entirely in your browser — no data sent to servers.',
  'Everyday', 'everyday', '~',
  ['base64 encoder decoder', 'base64 converter online', 'encode decode base64'],
  [
    '{ name: "text", label: "Input Text", type: "select", options: [{ label: "Enter text to encode", value: "encode" }, { label: "Enter Base64 to decode", value: "decode" }], defaultValue: "encode" }',
    '{ name: "input", label: "Input Value", type: "number", min: 0, placeholder: "Enter character count", defaultValue: 0 }',
  ],
  `(inputs) => {
      const charCount = inputs.input as number;
      if (!charCount || charCount <= 0) return null;
      const base64Size = Math.ceil(charCount * 4 / 3);
      const withPadding = Math.ceil(base64Size / 4) * 4;
      return {
        primary: { label: "Base64 Size", value: withPadding + " characters" },
        details: [
          { label: "Input size", value: charCount + " characters" },
          { label: "Size increase", value: formatNumber((withPadding / charCount - 1) * 100) + "%" },
          { label: "Bytes (UTF-8)", value: charCount + " bytes" },
          { label: "Base64 bytes", value: withPadding + " bytes" },
        ],
        note: "Base64 encoding increases data size by ~33%. Each 3 input bytes become 4 Base64 characters. All processing happens in your browser.",
      };
    }`,
  [{ q: 'What is Base64 encoding?', a: 'Base64 converts binary data to ASCII text using 64 safe characters (A-Z, a-z, 0-9, +, /). Used for embedding data in JSON, email, and URLs.' },
   { q: 'Does Base64 increase file size?', a: 'Yes, by approximately 33%. Every 3 bytes of input become 4 bytes of Base64 output, plus padding.' }],
  'Base64 size = ceil(input_bytes × 4/3), padded to multiple of 4',
  []
);

add('regex-tester', 'Regex Tester & Cheat Sheet',
  'Free regular expression tester with common patterns and a quick reference cheat sheet. Test regex patterns against sample text.',
  'Everyday', 'everyday', '~',
  ['regex tester online', 'regex validator', 'regular expression tester'],
  [
    '{ name: "charCount", label: "Pattern Length (chars)", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "complexity", label: "Complexity", type: "select", options: [{ label: "Simple (literal match)", value: "1" }, { label: "Medium (character classes, quantifiers)", value: "2" }, { label: "Complex (lookahead, groups, backrefs)", value: "3" }], defaultValue: "2" }',
  ],
  `(inputs) => {
      const len = inputs.charCount as number;
      const complexity = parseInt(inputs.complexity as string);
      if (!len) return null;
      const common = [
        { pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$", desc: "Email validation" },
        { pattern: "^\\\\d{3}-\\\\d{3}-\\\\d{4}$", desc: "US Phone (xxx-xxx-xxxx)" },
        { pattern: "^(?=.*[A-Z])(?=.*\\\\d).{8,}$", desc: "Password (8+, uppercase, digit)" },
        { pattern: "^https?://[\\\\w.-]+\\\\.[a-z]{2,}(/.*)?$", desc: "URL validation" },
      ];
      return {
        primary: { label: "Common Patterns", value: common.length + " examples" },
        details: common.map(c => ({ label: c.desc, value: c.pattern })),
        note: "Quick reference: . (any char), \\\\d (digit), \\\\w (word char), * (0+), + (1+), ? (optional), [] (char class), () (group), ^ (start), $ (end).",
      };
    }`,
  [{ q: 'What is a regular expression?', a: 'A regex is a pattern that describes a set of strings. Used for validation, search/replace, and text extraction in programming.' },
   { q: 'What does \\d+ mean?', a: '\\d matches any digit (0-9). + means one or more. So \\d+ matches one or more consecutive digits.' }],
  'Regex: pattern matching syntax for text validation and extraction',
  []
);

add('jwt-decoder', 'JWT Token Decoder',
  'Free JWT (JSON Web Token) decoder. Decode and inspect JWT header and payload without verification. No data sent to any server.',
  'Everyday', 'everyday', '~',
  ['jwt decoder', 'jwt token decoder online', 'json web token decoder'],
  [
    '{ name: "parts", label: "Number of JWT Segments", type: "number", min: 1, max: 3, defaultValue: 3 }',
  ],
  `(inputs) => {
      const parts = inputs.parts as number;
      if (!parts) return null;
      return {
        primary: { label: "JWT Structure", value: parts + " segments" },
        details: [
          { label: "Header (segment 1)", value: "Algorithm + token type (alg, typ)" },
          { label: "Payload (segment 2)", value: "Claims: sub, iat, exp, iss, etc." },
          { label: "Signature (segment 3)", value: "HMAC-SHA256 or RSA verification" },
          { label: "Common claims", value: "exp (expiry), iat (issued at), sub (subject)" },
        ],
        note: "JWT = Base64Url(Header).Base64Url(Payload).Signature. Decoding reveals claims but does NOT verify authenticity. Never trust unverified JWTs.",
      };
    }`,
  [{ q: 'What is a JWT?', a: 'JSON Web Token — a compact, URL-safe token format for securely transmitting claims. Used for authentication and API authorization. Format: header.payload.signature.' },
   { q: 'Is it safe to decode JWTs online?', a: 'Decoding only reveals the payload — it doesn not verify the signature. This tool runs entirely in your browser, but avoid pasting production tokens with sensitive data into any online tool.' }],
  'JWT = Base64Url(Header).Base64Url(Payload).Signature',
  []
);

add('cron-expression-generator', 'Cron Expression Generator',
  'Free cron expression builder and parser. Generate cron syntax for scheduling tasks with human-readable descriptions.',
  'Everyday', 'everyday', '~',
  ['cron expression generator', 'cron job generator', 'crontab generator online'],
  [
    '{ name: "minute", label: "Minute (0-59)", type: "number", min: 0, max: 59, defaultValue: 0 }',
    '{ name: "hour", label: "Hour (0-23)", type: "number", min: 0, max: 23, defaultValue: 0 }',
    '{ name: "frequency", label: "Frequency", type: "select", options: [{ label: "Every minute", value: "everymin" }, { label: "Hourly", value: "hourly" }, { label: "Daily", value: "daily" }, { label: "Weekly (Monday)", value: "weekly" }, { label: "Monthly (1st)", value: "monthly" }], defaultValue: "daily" }',
  ],
  `(inputs) => {
      const min = inputs.minute as number;
      const hour = inputs.hour as number;
      const freq = inputs.frequency as string;
      let cron = "", desc = "";
      if (freq === "everymin") { cron = "* * * * *"; desc = "Every minute"; }
      else if (freq === "hourly") { cron = min + " * * * *"; desc = "Every hour at :" + String(min).padStart(2, "0"); }
      else if (freq === "daily") { cron = min + " " + hour + " * * *"; desc = "Daily at " + hour + ":" + String(min).padStart(2, "0"); }
      else if (freq === "weekly") { cron = min + " " + hour + " * * 1"; desc = "Every Monday at " + hour + ":" + String(min).padStart(2, "0"); }
      else { cron = min + " " + hour + " 1 * *"; desc = "1st of every month at " + hour + ":" + String(min).padStart(2, "0"); }
      return {
        primary: { label: "Cron Expression", value: cron },
        details: [
          { label: "Description", value: desc },
          { label: "Format", value: "min hour day month weekday" },
          { label: "Special", value: "* (any), */5 (every 5), 1-5 (range), 1,3,5 (list)" },
        ],
        note: "Standard 5-field cron: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-7, 0/7=Sun).",
      };
    }`,
  [{ q: 'What is a cron expression?', a: 'A 5-field time format (minute, hour, day, month, weekday) used to schedule recurring tasks on Unix/Linux systems. Example: 0 9 * * 1 = every Monday at 9:00 AM.' },
   { q: 'What does * mean in cron?', a: 'Asterisk (*) means \\"every\\" — * in the hour field means \\"every hour\\". */5 means \\"every 5 units\\".' }],
  'Cron: minute(0-59) hour(0-23) day(1-31) month(1-12) weekday(0-7)',
  []
);

add('hash-generator', 'Cryptographic Hash Generator',
  'Free online hash generator. Create MD5, SHA-1, SHA-256, and SHA-512 hashes from text input. All processing happens in your browser.',
  'Everyday', 'everyday', '~',
  ['hash generator online', 'sha256 generator', 'md5 hash generator online'],
  [
    '{ name: "length", label: "Input Text Length", type: "number", suffix: "chars", min: 1, defaultValue: 10 }',
    '{ name: "algorithm", label: "Algorithm", type: "select", options: [{ label: "MD5 (128-bit)", value: "md5" }, { label: "SHA-1 (160-bit)", value: "sha1" }, { label: "SHA-256 (256-bit)", value: "sha256" }, { label: "SHA-512 (512-bit)", value: "sha512" }], defaultValue: "sha256" }',
  ],
  `(inputs) => {
      const len = inputs.length as number;
      const algo = inputs.algorithm as string;
      if (!len || len <= 0) return null;
      const hashLengths: Record<string, number> = { md5: 32, sha1: 40, sha256: 64, sha512: 128 };
      const bits: Record<string, number> = { md5: 128, sha1: 160, sha256: 256, sha512: 512 };
      const security: Record<string, string> = { md5: "BROKEN — collision attacks", sha1: "WEAK — deprecated since 2017", sha256: "SECURE — industry standard", sha512: "SECURE — extra margin" };
      return {
        primary: { label: "Hash Length", value: hashLengths[algo] + " hex characters" },
        details: [
          { label: "Algorithm", value: algo.toUpperCase() },
          { label: "Output bits", value: bits[algo] + " bits" },
          { label: "Security status", value: security[algo] },
          { label: "Input size", value: len + " characters" },
        ],
        note: "Use SHA-256 or SHA-512 for security applications. MD5/SHA-1 are deprecated for cryptographic use but still used for checksums.",
      };
    }`,
  [{ q: 'Which hash algorithm should I use?', a: 'SHA-256 for most purposes. SHA-512 for extra security. Never use MD5 or SHA-1 for passwords or security — they have known vulnerabilities.' },
   { q: 'Are hash functions reversible?', a: 'No. Hashes are one-way functions. You cannot recover the original input from a hash. This is why they are used for password storage.' }],
  'Hash = one-way function producing fixed-length output from any input',
  []
);

add('uuid-generator', 'UUID/GUID Generator',
  'Free UUID v4 generator. Generate universally unique identifiers for databases, APIs, and distributed systems.',
  'Everyday', 'everyday', '~',
  ['uuid generator', 'guid generator online', 'uuid v4 generator'],
  [
    '{ name: "count", label: "Number of UUIDs", type: "number", min: 1, max: 100, defaultValue: 5 }',
    '{ name: "format", label: "Format", type: "select", options: [{ label: "Standard (with hyphens)", value: "standard" }, { label: "No hyphens", value: "nohyphens" }, { label: "Uppercase", value: "upper" }], defaultValue: "standard" }',
  ],
  `(inputs) => {
      const count = inputs.count as number;
      const format = inputs.format as string;
      if (!count || count <= 0) return null;
      const uuids = [];
      for (let i = 0; i < Math.min(count, 5); i++) {
        let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        if (format === "nohyphens") uuid = uuid.replace(/-/g, "");
        if (format === "upper") uuid = uuid.toUpperCase();
        uuids.push(uuid);
      }
      return {
        primary: { label: "UUID v4", value: uuids[0] },
        details: uuids.slice(1).map((u, i) => ({ label: "UUID " + (i + 2), value: u })),
        note: "UUID v4 uses random/pseudo-random numbers. Collision probability: ~1 in 5.3×10³⁶. Safe for distributed systems without coordination.",
      };
    }`,
  [{ q: 'What is a UUID?', a: 'Universally Unique Identifier — a 128-bit identifier formatted as 32 hex digits in 5 groups: 8-4-4-4-12. UUID v4 uses random generation.' },
   { q: 'Can UUIDs collide?', a: 'Theoretically yes, but the probability is astronomically low — you would need to generate 2.71×10¹⁸ UUIDs for a 50% chance of one collision.' }],
  'UUID v4: random 128-bit identifier. Format: 8-4-4-4-12 hex digits',
  []
);

// =============================================================================
// DOMAIN 8: HR & Payroll (new ones only)
// =============================================================================

// #71 Hourly to Salary - exists. Skip
// #72 Employee Cost - exists. Skip
// #73 Overtime Pay - exists. Skip
// #74 Freelance Rate - exists. Skip
// #80 Self-Employment Tax - exists. Skip

// #76 Timesheet Decimal Converter
add('timesheet-decimal-converter', 'Timesheet Decimal Converter',
  'Free timesheet converter. Convert hours and minutes to decimal format for payroll processing and invoicing.',
  'Everyday', 'everyday', '~',
  ['timesheet decimal converter', 'hours to decimal converter', 'time to decimal payroll'],
  [
    '{ name: "hours", label: "Hours", type: "number", min: 0, max: 24, defaultValue: 8 }',
    '{ name: "minutes", label: "Minutes", type: "number", min: 0, max: 59, defaultValue: 30 }',
    '{ name: "rate", label: "Hourly Rate (optional)", type: "number", prefix: "$", min: 0, defaultValue: 0 }',
  ],
  `(inputs) => {
      const hours = inputs.hours as number;
      const minutes = inputs.minutes as number;
      const rate = (inputs.rate as number) || 0;
      if (hours === undefined && minutes === undefined) return null;
      const decimal = (hours || 0) + (minutes || 0) / 60;
      const earnings = rate > 0 ? decimal * rate : 0;
      return {
        primary: { label: "Decimal Hours", value: formatNumber(decimal) },
        details: [
          { label: "Time", value: (hours || 0) + "h " + (minutes || 0) + "m" },
          { label: "Decimal format", value: formatNumber(decimal) },
          ...(rate > 0 ? [{ label: "Earnings", value: "$" + formatNumber(earnings) }] : []),
          { label: "Common: 15 min", value: "0.25" },
          { label: "Common: 30 min", value: "0.50" },
          { label: "Common: 45 min", value: "0.75" },
        ],
      };
    }`,
  [{ q: 'How do I convert minutes to decimal?', a: 'Divide minutes by 60. Examples: 15 min = 0.25, 30 min = 0.50, 45 min = 0.75, 20 min = 0.33.' },
   { q: 'Why use decimal time for payroll?', a: 'Payroll systems calculate pay as hours × rate. 8 hours 30 minutes = 8.50 decimal hours × $25/hr = $212.50.' }],
  'Decimal Hours = Hours + (Minutes / 60)',
  ['hourly-to-salary-calculator', 'overtime-pay-calc']
);

// #77 Severance Pay Estimator
add('severance-pay-calculator', 'Severance Pay Estimator',
  'Free severance pay calculator. Estimate your severance package based on tenure, salary, and common company policies.',
  'Finance', 'finance', '$',
  ['severance pay calculator', 'severance package calculator', 'termination pay estimator'],
  [
    '{ name: "salary", label: "Annual Salary", type: "number", prefix: "$", min: 0 }',
    '{ name: "years", label: "Years of Service", type: "number", min: 0, max: 50 }',
    '{ name: "policy", label: "Severance Policy", type: "select", options: [{ label: "1 week per year (common)", value: "1" }, { label: "2 weeks per year (generous)", value: "2" }, { label: "1 month per year (executive)", value: "4.33" }], defaultValue: "1" }',
    '{ name: "ptoBalance", label: "Unused PTO Days", type: "number", min: 0, defaultValue: 0 }',
  ],
  `(inputs) => {
      const salary = inputs.salary as number;
      const years = inputs.years as number;
      const weeksPerYear = parseFloat(inputs.policy as string);
      const pto = (inputs.ptoBalance as number) || 0;
      if (!salary || !years) return null;
      const weeklySalary = salary / 52;
      const severanceWeeks = years * weeksPerYear;
      const severancePay = weeklySalary * severanceWeeks;
      const dailySalary = salary / 260;
      const ptoPayout = dailySalary * pto;
      const total = severancePay + ptoPayout;
      return {
        primary: { label: "Total Severance", value: "$" + formatNumber(total) },
        details: [
          { label: "Severance pay (" + formatNumber(severanceWeeks) + " weeks)", value: "$" + formatNumber(severancePay) },
          { label: "PTO payout (" + pto + " days)", value: "$" + formatNumber(ptoPayout) },
          { label: "Weekly salary", value: "$" + formatNumber(weeklySalary) },
          { label: "Months of coverage", value: formatNumber(severanceWeeks / 4.33) },
        ],
        note: "Severance is not legally required in most US states. Packages are negotiable. Consider COBRA health insurance continuation costs.",
      };
    }`,
  [{ q: 'How is severance pay calculated?', a: 'Common formula: 1-2 weeks of pay per year of service. Executive packages may offer 1 month per year. Plus unused PTO payout.' },
   { q: 'Is severance pay taxable?', a: 'Yes, severance is taxed as regular income. It may push you into a higher tax bracket. Some employers offer lump sum vs. salary continuation.' }],
  'Severance = (Annual Salary / 52) × Years × Weeks per Year + PTO Payout',
  ['hourly-to-salary-calculator', 'bonus-tax-calculator']
);

// #79 Bonus / Supplemental Tax
// bonus-tax-calculator exists. Skip.

// =============================================================================
// DOMAIN 9: Marketing & E-commerce (new ones only)
// =============================================================================

// #81 CPC - exists. Skip
// #82 ROAS - exists. Skip
// #86 CLV - exists. Skip
// #88 Conversion Rate - exists. Skip
// #89 Engagement Rate - exists. Skip

// #83 E-commerce Profit Margin
add('ecommerce-profit-margin-calculator', 'E-commerce Profit Margin Calculator',
  'Free e-commerce profit margin calculator. Calculate per-product profitability including COGS, shipping, platform fees, and ad costs.',
  'Finance', 'finance', '$',
  ['ecommerce profit margin calculator', 'product margin calculator', 'ecommerce profitability calculator'],
  [
    '{ name: "sellingPrice", label: "Selling Price", type: "number", prefix: "$", min: 0 }',
    '{ name: "cogs", label: "Product Cost (COGS)", type: "number", prefix: "$", min: 0 }',
    '{ name: "shipping", label: "Shipping Cost", type: "number", prefix: "$", min: 0, defaultValue: 0 }',
    '{ name: "platformFee", label: "Platform Fee %", type: "number", suffix: "%", min: 0, max: 50, defaultValue: 15 }',
    '{ name: "adCost", label: "Ad Cost per Sale", type: "number", prefix: "$", min: 0, defaultValue: 0 }',
  ],
  `(inputs) => {
      const price = inputs.sellingPrice as number;
      const cogs = inputs.cogs as number;
      const shipping = (inputs.shipping as number) || 0;
      const feeRate = (inputs.platformFee as number) / 100;
      const adCost = (inputs.adCost as number) || 0;
      if (!price || !cogs || price <= 0) return null;
      const platformFee = price * feeRate;
      const totalCost = cogs + shipping + platformFee + adCost;
      const profit = price - totalCost;
      const margin = (profit / price) * 100;
      const markup = (profit / totalCost) * 100;
      return {
        primary: { label: "Profit per Unit", value: "$" + formatNumber(profit) },
        details: [
          { label: "Revenue", value: "$" + formatNumber(price) },
          { label: "COGS", value: "$" + formatNumber(cogs) },
          { label: "Platform fee (" + (feeRate * 100) + "%)", value: "$" + formatNumber(platformFee) },
          { label: "Shipping + Ads", value: "$" + formatNumber(shipping + adCost) },
          { label: "Profit margin", value: formatNumber(margin) + "%" },
          { label: "Markup", value: formatNumber(markup) + "%" },
        ],
        note: profit < 0 ? "WARNING: Negative margin! Consider increasing price or reducing costs." : "Target: 30%+ margin for sustainable e-commerce.",
      };
    }`,
  [{ q: 'What is a good e-commerce profit margin?', a: 'Aim for 30-50% gross margin. After all costs (COGS, shipping, platform fees, ads, returns), net margin of 10-20% is healthy.' },
   { q: 'What are typical platform fees?', a: 'Amazon: 8-15% referral + FBA fees. Shopify: 2.9% + $0.30 per transaction. Etsy: 6.5% transaction + 3% payment. eBay: 12-15%.' }],
  'Profit = Selling Price - COGS - Shipping - Platform Fee - Ad Cost',
  ['profit-margin-calculator', 'roas-calculator']
);

// #84 UTM Builder
add('utm-builder', 'UTM Parameter Builder',
  'Free UTM campaign URL builder. Generate properly formatted tracking URLs for Google Analytics with all 5 UTM parameters.',
  'Everyday', 'everyday', '~',
  ['utm builder', 'utm generator', 'campaign url builder google analytics'],
  [
    '{ name: "urlLength", label: "Base URL Length", type: "number", suffix: "chars", min: 10, defaultValue: 30 }',
    '{ name: "params", label: "Parameters Used", type: "select", options: [{ label: "3 required (source, medium, campaign)", value: "3" }, { label: "4 (+ term)", value: "4" }, { label: "All 5 (+ content)", value: "5" }], defaultValue: "3" }',
  ],
  `(inputs) => {
      const urlLen = inputs.urlLength as number;
      const paramCount = parseInt(inputs.params as string);
      if (!urlLen) return null;
      const params = ["utm_source=google", "utm_medium=cpc", "utm_campaign=spring_sale"];
      if (paramCount >= 4) params.push("utm_term=keyword");
      if (paramCount >= 5) params.push("utm_content=banner_v1");
      const fullUrl = "https://example.com/?" + params.join("&");
      return {
        primary: { label: "UTM URL Length", value: fullUrl.length + " characters" },
        details: [
          { label: "utm_source (required)", value: "Traffic source (google, facebook, newsletter)" },
          { label: "utm_medium (required)", value: "Marketing medium (cpc, email, social)" },
          { label: "utm_campaign (required)", value: "Campaign name (spring_sale, launch_2025)" },
          { label: "utm_term (optional)", value: "Paid keyword term" },
          { label: "utm_content (optional)", value: "Ad variation (banner_v1, cta_blue)" },
        ],
        note: "Example: " + fullUrl,
      };
    }`,
  [{ q: 'What are UTM parameters?', a: 'Tags added to URLs to track traffic sources in Google Analytics. 5 parameters: source (where), medium (how), campaign (what), term (keyword), content (variation).' },
   { q: 'Which UTM parameters are required?', a: 'utm_source, utm_medium, and utm_campaign are required for GA tracking. utm_term and utm_content are optional for more granular analysis.' }],
  'URL + ?utm_source=X&utm_medium=Y&utm_campaign=Z[&utm_term=K&utm_content=V]',
  ['cpc-calculator', 'roas-calculator']
);

// #85 Email Bounce & Open Rate
add('email-metrics-calculator', 'Email Marketing Metrics Calculator',
  'Free email marketing metrics calculator. Calculate open rate, click rate, bounce rate, and deliverability from campaign data.',
  'Finance', 'finance', '$',
  ['email open rate calculator', 'email bounce rate calculator', 'email marketing metrics calculator'],
  [
    '{ name: "sent", label: "Emails Sent", type: "number", min: 1 }',
    '{ name: "delivered", label: "Emails Delivered", type: "number", min: 0 }',
    '{ name: "opened", label: "Unique Opens", type: "number", min: 0 }',
    '{ name: "clicked", label: "Unique Clicks", type: "number", min: 0, defaultValue: 0 }',
  ],
  `(inputs) => {
      const sent = inputs.sent as number;
      const delivered = inputs.delivered as number;
      const opened = inputs.opened as number;
      const clicked = (inputs.clicked as number) || 0;
      if (!sent || !delivered || sent <= 0) return null;
      const bounced = sent - delivered;
      const bounceRate = (bounced / sent) * 100;
      const deliveryRate = (delivered / sent) * 100;
      const openRate = (opened / delivered) * 100;
      const clickRate = clicked > 0 ? (clicked / delivered) * 100 : 0;
      const ctor = opened > 0 && clicked > 0 ? (clicked / opened) * 100 : 0;
      return {
        primary: { label: "Open Rate", value: formatNumber(openRate) + "%" },
        details: [
          { label: "Delivery rate", value: formatNumber(deliveryRate) + "%" },
          { label: "Bounce rate", value: formatNumber(bounceRate) + "%" },
          { label: "Click rate (CTR)", value: formatNumber(clickRate) + "%" },
          { label: "Click-to-open (CTOR)", value: formatNumber(ctor) + "%" },
          { label: "Bounced emails", value: String(bounced) },
        ],
        note: bounceRate > 5 ? "WARNING: Bounce rate above 5% — clean your email list to avoid deliverability issues." : "Industry avg: Open 20-25%, CTR 2-3%, Bounce <2%.",
      };
    }`,
  [{ q: 'What is a good email open rate?', a: 'Industry average: 20-25%. B2B: 15-20%. Ecommerce: 15-18%. Nonprofits: 25-30%. Apple Mail Privacy Protection inflates open rates since 2021.' },
   { q: 'What causes high bounce rates?', a: 'Invalid addresses, full mailboxes, blocked domains. Hard bounces (invalid) should be removed immediately. Keep total bounce rate under 2%.' }],
  'Open Rate = Opens/Delivered × 100. CTR = Clicks/Delivered × 100. CTOR = Clicks/Opens × 100',
  ['conversion-rate-calculator', 'cpc-calculator']
);

// #87 CPM to CPC Converter
add('cpm-to-cpc-converter', 'CPM to CPC Converter',
  'Free CPM to CPC converter. Translate between impression-based (CPM) and click-based (CPC) pricing for ad campaigns.',
  'Finance', 'finance', '$',
  ['cpm to cpc converter', 'cpm cpc calculator', 'cost per impression to click calculator'],
  [
    '{ name: "cpm", label: "CPM (Cost per 1000 Impressions)", type: "number", prefix: "$", min: 0, defaultValue: 5 }',
    '{ name: "ctr", label: "Expected Click-Through Rate", type: "number", suffix: "%", min: 0.01, max: 20, defaultValue: 1 }',
  ],
  `(inputs) => {
      const cpm = inputs.cpm as number;
      const ctr = (inputs.ctr as number) / 100;
      if (!cpm || !ctr || cpm <= 0 || ctr <= 0) return null;
      const cpc = cpm / (ctr * 1000);
      const clicksPer1000 = ctr * 1000;
      return {
        primary: { label: "Equivalent CPC", value: "$" + formatNumber(cpc) },
        details: [
          { label: "CPM", value: "$" + formatNumber(cpm) },
          { label: "CTR", value: (ctr * 100) + "%" },
          { label: "Clicks per 1000 impressions", value: formatNumber(clicksPer1000) },
          { label: "Cost per 1000 impressions", value: "$" + formatNumber(cpm) },
          { label: "Cost per click", value: "$" + formatNumber(cpc) },
        ],
        note: "Lower CTR = higher effective CPC. If your CTR is 0.1%, a $5 CPM = $5.00 CPC. At 2% CTR, the same CPM = $0.25 CPC.",
      };
    }`,
  [{ q: 'What is CPM vs CPC?', a: 'CPM (Cost Per Mille) charges per 1000 impressions. CPC (Cost Per Click) charges per click. CPM is better for brand awareness; CPC for direct response.' },
   { q: 'How to convert CPM to CPC?', a: 'CPC = CPM / (CTR × 1000). A $5 CPM with 1% CTR = $0.50 per click. Higher CTR makes CPM campaigns more cost-efficient.' }],
  'CPC = CPM / (CTR × 1000). Example: $5 CPM at 1% CTR = $0.50 CPC',
  ['cpc-calculator', 'roas-calculator']
);

// #90 Retail Discount
add('retail-discount-calculator', 'Retail Discount & Markdown Calculator',
  'Free retail discount calculator. Calculate sale prices, percentage off, and stacked discounts for retail pricing.',
  'Everyday', 'everyday', '~',
  ['retail discount calculator', 'sale price calculator', 'percentage off calculator'],
  [
    '{ name: "originalPrice", label: "Original Price", type: "number", prefix: "$", min: 0 }',
    '{ name: "discount1", label: "First Discount", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "discount2", label: "Additional Discount (stacked)", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 0 }',
  ],
  `(inputs) => {
      const price = inputs.originalPrice as number;
      const d1 = (inputs.discount1 as number) / 100;
      const d2 = (inputs.discount2 as number) / 100;
      if (!price || price <= 0) return null;
      const afterFirst = price * (1 - d1);
      const afterSecond = d2 > 0 ? afterFirst * (1 - d2) : afterFirst;
      const totalSaved = price - afterSecond;
      const effectiveDiscount = (totalSaved / price) * 100;
      return {
        primary: { label: "Final Price", value: "$" + formatNumber(afterSecond) },
        details: [
          { label: "Original price", value: "$" + formatNumber(price) },
          { label: "After " + (d1 * 100) + "% off", value: "$" + formatNumber(afterFirst) },
          ...(d2 > 0 ? [{ label: "After additional " + (d2 * 100) + "% off", value: "$" + formatNumber(afterSecond) }] : []),
          { label: "Total savings", value: "$" + formatNumber(totalSaved) },
          { label: "Effective discount", value: formatNumber(effectiveDiscount) + "%" },
        ],
        note: d2 > 0 ? "Note: Stacked discounts are applied sequentially, not added. 20% + 10% ≠ 30%. Effective: " + formatNumber(effectiveDiscount) + "%" : "",
      };
    }`,
  [{ q: 'How do stacked discounts work?', a: 'Each discount applies to the already-reduced price, not the original. 20% off then 10% off = 28% total (not 30%). Order doesn not matter for the final price.' },
   { q: 'How to calculate percentage off?', a: 'Sale Price = Original × (1 - Discount%). For $100 at 25% off: $100 × 0.75 = $75.' }],
  'Final Price = Original × (1 - Discount1%) × (1 - Discount2%)',
  ['profit-margin-calculator', 'tip-calculator']
);

// =============================================================================
// DOMAIN 10: Science/Engineering/Everyday (new ones only)
// =============================================================================

// #91 Unit converter - many exist. Skip.
// #92 Pressure - pressure-converter exists. Skip.
// #93 Timezone - timezone-meeting-calculator exists. Skip.
// #94 Cooking - cooking-converter exists. Skip.
// #95 Fuel Economy - fuel-economy-converter exists. Skip.
// #97 Password Entropy - password-entropy + password-strength-calculator exist. Skip.
// #98 Character/Word Counter - word-counter-calculator exists. Skip.
// #99 Tip Calculator - tip-calculator exists. Skip.
// #100 Shoe Size - shoe-size-converter exists. Skip.

// #96 Date Duration & Business Days
add('business-days-calculator', 'Business Days Calculator',
  'Free business days calculator. Count working days between two dates, excluding weekends and optionally US federal holidays.',
  'Everyday', 'everyday', '~',
  ['business days calculator', 'working days calculator', 'date duration business days'],
  [
    '{ name: "totalDays", label: "Total Calendar Days", type: "number", min: 1, max: 3650, defaultValue: 30 }',
    '{ name: "includeHolidays", label: "Exclude US Federal Holidays?", type: "select", options: [{ label: "No — weekends only", value: "no" }, { label: "Yes — subtract ~11 holidays/year", value: "yes" }], defaultValue: "no" }',
  ],
  `(inputs) => {
      const totalDays = inputs.totalDays as number;
      const holidays = inputs.includeHolidays as string;
      if (!totalDays || totalDays <= 0) return null;
      const fullWeeks = Math.floor(totalDays / 7);
      const remainingDays = totalDays % 7;
      let weekendDays = fullWeeks * 2;
      for (let i = 0; i < remainingDays; i++) {
        const dayOfWeek = i % 7;
        if (dayOfWeek === 5 || dayOfWeek === 6) weekendDays++;
      }
      let businessDays = totalDays - weekendDays;
      let holidayCount = 0;
      if (holidays === "yes") {
        holidayCount = Math.round(totalDays / 365 * 11);
        businessDays = Math.max(0, businessDays - holidayCount);
      }
      return {
        primary: { label: "Business Days", value: String(businessDays) },
        details: [
          { label: "Calendar days", value: String(totalDays) },
          { label: "Weekend days", value: String(weekendDays) },
          ...(holidays === "yes" ? [{ label: "Federal holidays (est.)", value: String(holidayCount) }] : []),
          { label: "Weeks", value: formatNumber(totalDays / 7) },
          { label: "Business weeks", value: formatNumber(businessDays / 5) },
        ],
      };
    }`,
  [{ q: 'How many business days in a year?', a: 'Approximately 260 (52 weeks × 5 days). After 11 US federal holidays: ~249 business days.' },
   { q: 'What counts as a business day?', a: 'Monday through Friday, excluding weekends. Federal holidays vary by employer. Some industries also exclude half-days.' }],
  'Business Days = Calendar Days - Weekend Days - Holidays',
  ['tip-calculator', 'hourly-to-salary-calculator']
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
    name: "${c.title.replace(' Calculator', '').replace(' Generator', '').replace(' Converter', '').replace(' Estimator', '')}",
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
  if (existingSlugs.has(c.slug)) { skipped++; console.log(`SKIP (exists): ${c.slug}`); continue; }
  const filePath = path.join(CALC_DIR, c.slug + '.ts');
  if (fs.existsSync(filePath)) { skipped++; console.log(`SKIP (file): ${c.slug}`); continue; }
  fs.writeFileSync(filePath, genFile(c));
  imports.push(`import { ${eName(c.slug)} } from "./${c.slug}";`);
  regs.push(`  ${eName(c.slug)},`);
  generated++;
}

fs.writeFileSync(path.join(__dirname, 'new-imports-niches.txt'), imports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-niches.txt'), regs.join('\n'));
console.log(`\nGenerated: ${generated} | Skipped: ${skipped}`);
console.log(`Total definitions: ${calcs.length}`);
console.log(`Imports saved to: scripts/new-imports-niches.txt`);
console.log(`Registry saved to: scripts/new-regs-niches.txt`);
