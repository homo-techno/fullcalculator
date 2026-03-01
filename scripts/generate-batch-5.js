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

// === BATCH 5 PART 1: 50 CALCULATORS ===


// --- GROUP A: EDUCATION & STUDENT (1-5) ---

add(
  "student-loan-forgiveness-calculator",
  "Student Loan Forgiveness Calculator",
  "Estimate PSLF forgiveness timeline and total savings from qualifying payments",
  "Finance", "finance", "$",
  ["student loan forgiveness", "PSLF", "loan forgiveness estimator"],
  [
    '{ id: "loanBalance", label: "Current Loan Balance ($)", type: "number", defaultValue: 50000, min: 0, step: 1000 }',
    '{ id: "monthlyPayment", label: "Monthly Payment ($)", type: "number", defaultValue: 400, min: 0, step: 50 }',
    '{ id: "paymentsMade", label: "Qualifying Payments Made", type: "number", defaultValue: 24, min: 0, step: 1 }',
    '{ id: "interestRate", label: "Interest Rate (%)", type: "number", defaultValue: 5.5, min: 0, max: 15, step: 0.1 }'
  ],
  `(inputs: Record<string, number>) => {
      const balance = inputs.loanBalance || 50000;
      const payment = inputs.monthlyPayment || 400;
      const made = inputs.paymentsMade || 24;
      const rate = (inputs.interestRate || 5.5) / 100 / 12;
      const totalRequired = 120;
      const remaining = Math.max(0, totalRequired - made);
      let bal = balance;
      let totalPaid = 0;
      for (let i = 0; i < remaining; i++) {
        const interest = bal * rate;
        bal = bal + interest - payment;
        totalPaid += payment;
        if (bal <= 0) { bal = 0; break; }
      }
      const forgiven = Math.max(0, bal);
      return {
        primary: { label: "Estimated Forgiveness", value: "$" + formatNumber(Math.round(forgiven)) },
        details: [
          { label: "Payments Remaining", value: String(remaining) },
          { label: "Total You Will Pay", value: "$" + formatNumber(Math.round(totalPaid)) },
          { label: "Months Until Forgiveness", value: String(remaining) },
          { label: "Balance at Forgiveness", value: "$" + formatNumber(Math.round(forgiven)) }
        ]
      };
    }`,
  [
    { q: "How many payments are needed for PSLF?", a: "You need 120 qualifying monthly payments while working full-time for a qualifying employer." },
    { q: "What loans qualify for PSLF?", a: "Only Direct Loans qualify. FFEL and Perkins loans must be consolidated into a Direct Consolidation Loan." }
  ],
  "Forgiveness Amount = Remaining Balance after 120 qualifying payments",
  ["student-loan-refinance-calculator"]
);

add(
  "college-savings-gap-calculator",
  "College Savings Gap Calculator",
  "Find the gap between current savings and projected college costs",
  "Finance", "finance", "$",
  ["college savings gap", "education savings", "tuition planning"],
  [
    '{ id: "currentSavings", label: "Current Savings ($)", type: "number", defaultValue: 10000, min: 0, step: 1000 }',
    '{ id: "yearsUntilCollege", label: "Years Until College", type: "number", defaultValue: 10, min: 1, max: 25, step: 1 }',
    '{ id: "annualTuition", label: "Annual Tuition ($)", type: "number", defaultValue: 25000, min: 0, step: 1000 }',
    '{ id: "yearsInCollege", label: "Years in College", type: "number", defaultValue: 4, min: 1, max: 8, step: 1 }',
    '{ id: "returnRate", label: "Annual Return (%)", type: "number", defaultValue: 6, min: 0, max: 15, step: 0.5 }'
  ],
  `(inputs: Record<string, number>) => {
      const savings = inputs.currentSavings || 10000;
      const years = inputs.yearsUntilCollege || 10;
      const tuition = inputs.annualTuition || 25000;
      const collegeYears = inputs.yearsInCollege || 4;
      const rate = (inputs.returnRate || 6) / 100;
      const inflationRate = 0.05;
      const futureTuition = tuition * Math.pow(1 + inflationRate, years);
      const totalCost = futureTuition * collegeYears;
      const futureValue = savings * Math.pow(1 + rate, years);
      const gap = Math.max(0, totalCost - futureValue);
      const monthlyNeeded = gap > 0 ? (gap * (rate / 12)) / (Math.pow(1 + rate / 12, years * 12) - 1) : 0;
      return {
        primary: { label: "Savings Gap", value: "$" + formatNumber(Math.round(gap)) },
        details: [
          { label: "Projected Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Savings Future Value", value: "$" + formatNumber(Math.round(futureValue)) },
          { label: "Monthly Savings Needed", value: "$" + formatNumber(Math.round(monthlyNeeded)) },
          { label: "Projected Annual Tuition", value: "$" + formatNumber(Math.round(futureTuition)) }
        ]
      };
    }`,
  [
    { q: "What inflation rate is used for tuition?", a: "This calculator uses a 5% annual tuition inflation rate based on historical averages." },
    { q: "How is the savings gap calculated?", a: "The gap is the difference between projected total college cost and the future value of current savings." }
  ],
  "Gap = (Annual Tuition x (1 + 0.05)^Years x College Years) - (Savings x (1 + Return)^Years)",
  ["529-contribution-calculator"]
);

add(
  "scholarship-roi-calculator",
  "Scholarship ROI Calculator",
  "Compare scholarship value against out-of-pocket college costs",
  "Finance", "finance", "$",
  ["scholarship ROI", "scholarship value", "college cost comparison"],
  [
    '{ id: "annualTuition", label: "Annual Tuition ($)", type: "number", defaultValue: 30000, min: 0, step: 1000 }',
    '{ id: "scholarshipAmount", label: "Annual Scholarship ($)", type: "number", defaultValue: 10000, min: 0, step: 500 }',
    '{ id: "yearsOfStudy", label: "Years of Study", type: "number", defaultValue: 4, min: 1, max: 8, step: 1 }',
    '{ id: "livingExpenses", label: "Annual Living Expenses ($)", type: "number", defaultValue: 12000, min: 0, step: 500 }'
  ],
  `(inputs: Record<string, number>) => {
      const tuition = inputs.annualTuition || 30000;
      const scholarship = inputs.scholarshipAmount || 10000;
      const years = inputs.yearsOfStudy || 4;
      const living = inputs.livingExpenses || 12000;
      const totalCost = (tuition + living) * years;
      const totalScholarship = scholarship * years;
      const outOfPocket = totalCost - totalScholarship;
      const coveragePercent = (totalScholarship / totalCost) * 100;
      return {
        primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(Math.round(outOfPocket)) },
        details: [
          { label: "Total Education Cost", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Total Scholarship Value", value: "$" + formatNumber(Math.round(totalScholarship)) },
          { label: "Scholarship Coverage", value: formatNumber(Math.round(coveragePercent * 10) / 10) + "%" },
          { label: "Annual Out-of-Pocket", value: "$" + formatNumber(Math.round(outOfPocket / years)) }
        ]
      };
    }`,
  [
    { q: "What costs does this include?", a: "This includes tuition and living expenses. It does not include books, fees, or transportation." },
    { q: "How is scholarship coverage calculated?", a: "Coverage is the total scholarship divided by total education cost expressed as a percentage." }
  ],
  "Out-of-Pocket = (Tuition + Living) x Years - (Scholarship x Years)",
  ["college-savings-gap-calculator"]
);


add(
  "grad-school-roi-calculator",
  "Grad School ROI Calculator",
  "Calculate the return on investment for pursuing a graduate degree",
  "Finance", "finance", "$",
  ["grad school ROI", "masters degree value", "graduate education return"],
  [
    '{ id: "totalTuition", label: "Total Program Tuition ($)", type: "number", defaultValue: 60000, min: 0, step: 5000 }',
    '{ id: "currentSalary", label: "Current Salary ($)", type: "number", defaultValue: 50000, min: 0, step: 5000 }',
    '{ id: "expectedSalary", label: "Expected Post-Grad Salary ($)", type: "number", defaultValue: 75000, min: 0, step: 5000 }',
    '{ id: "programYears", label: "Program Length (years)", type: "number", defaultValue: 2, min: 1, max: 6, step: 1 }',
    '{ id: "opportunityCostRate", label: "Work During School (%)", type: "number", defaultValue: 50, min: 0, max: 100, step: 10 }'
  ],
  `(inputs: Record<string, number>) => {
      const tuition = inputs.totalTuition || 60000;
      const current = inputs.currentSalary || 50000;
      const expected = inputs.expectedSalary || 75000;
      const years = inputs.programYears || 2;
      const workPct = (inputs.opportunityCostRate || 50) / 100;
      const lostIncome = current * years * (1 - workPct);
      const totalInvestment = tuition + lostIncome;
      const annualGain = expected - current;
      const paybackYears = annualGain > 0 ? totalInvestment / annualGain : 0;
      const tenYearReturn = annualGain * 10 - totalInvestment;
      const roi = totalInvestment > 0 ? (tenYearReturn / totalInvestment) * 100 : 0;
      return {
        primary: { label: "Payback Period", value: formatNumber(Math.round(paybackYears * 10) / 10) + " years" },
        details: [
          { label: "Total Investment", value: "$" + formatNumber(Math.round(totalInvestment)) },
          { label: "Annual Salary Increase", value: "$" + formatNumber(Math.round(annualGain)) },
          { label: "10-Year Net Return", value: "$" + formatNumber(Math.round(tenYearReturn)) },
          { label: "10-Year ROI", value: formatNumber(Math.round(roi)) + "%" }
        ]
      };
    }`,
  [
    { q: "What is included in the total investment?", a: "Total investment includes tuition costs plus lost income during the program based on work percentage." },
    { q: "How is payback period calculated?", a: "Payback period is total investment divided by the annual salary increase after graduation." }
  ],
  "Payback = (Tuition + Lost Income) / (Post-Grad Salary - Current Salary)",
  ["scholarship-roi-calculator"]
);

add(
  "student-loan-refinance-calculator",
  "Student Loan Refinance Calculator",
  "Compare current vs refinanced student loan terms and total savings",
  "Finance", "finance", "$",
  ["student loan refinance", "loan refinancing", "student debt"],
  [
    '{ id: "loanBalance", label: "Loan Balance ($)", type: "number", defaultValue: 40000, min: 0, step: 1000 }',
    '{ id: "currentRate", label: "Current Interest Rate (%)", type: "number", defaultValue: 6.5, min: 0, max: 15, step: 0.1 }',
    '{ id: "currentTerm", label: "Current Remaining Term (months)", type: "number", defaultValue: 120, min: 1, step: 1 }',
    '{ id: "newRate", label: "New Interest Rate (%)", type: "number", defaultValue: 4.5, min: 0, max: 15, step: 0.1 }',
    '{ id: "newTerm", label: "New Loan Term (months)", type: "number", defaultValue: 120, min: 1, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const balance = inputs.loanBalance || 40000;
      const curRate = (inputs.currentRate || 6.5) / 100 / 12;
      const curTerm = inputs.currentTerm || 120;
      const newRate = (inputs.newRate || 4.5) / 100 / 12;
      const newTerm = inputs.newTerm || 120;
      const curPayment = curRate > 0 ? balance * curRate / (1 - Math.pow(1 + curRate, -curTerm)) : balance / curTerm;
      const newPayment = newRate > 0 ? balance * newRate / (1 - Math.pow(1 + newRate, -newTerm)) : balance / newTerm;
      const curTotal = curPayment * curTerm;
      const newTotal = newPayment * newTerm;
      const savings = curTotal - newTotal;
      return {
        primary: { label: "Total Savings", value: "$" + formatNumber(Math.round(savings)) },
        details: [
          { label: "Current Monthly Payment", value: "$" + formatNumber(Math.round(curPayment)) },
          { label: "New Monthly Payment", value: "$" + formatNumber(Math.round(newPayment)) },
          { label: "Current Total Cost", value: "$" + formatNumber(Math.round(curTotal)) },
          { label: "New Total Cost", value: "$" + formatNumber(Math.round(newTotal)) }
        ]
      };
    }`,
  [
    { q: "When does refinancing make sense?", a: "Refinancing makes sense when you can get a lower interest rate and do not need federal loan protections." },
    { q: "What are the risks of refinancing?", a: "You lose access to federal benefits like income-driven repayment and Public Service Loan Forgiveness." }
  ],
  "Savings = (Current Payment x Current Term) - (New Payment x New Term)",
  ["student-loan-forgiveness-calculator"]
);


add(
  "529-contribution-calculator",
  "529 Contribution Calculator",
  "Calculate how much to save monthly to reach your target college fund",
  "Finance", "finance", "$",
  ["529 plan", "college fund", "education savings plan"],
  [
    '{ id: "targetAmount", label: "Target College Fund ($)", type: "number", defaultValue: 100000, min: 0, step: 5000 }',
    '{ id: "currentBalance", label: "Current Balance ($)", type: "number", defaultValue: 5000, min: 0, step: 1000 }',
    '{ id: "yearsToSave", label: "Years to Save", type: "number", defaultValue: 15, min: 1, max: 25, step: 1 }',
    '{ id: "annualReturn", label: "Expected Annual Return (%)", type: "number", defaultValue: 7, min: 0, max: 15, step: 0.5 }'
  ],
  `(inputs: Record<string, number>) => {
      const target = inputs.targetAmount || 100000;
      const current = inputs.currentBalance || 5000;
      const years = inputs.yearsToSave || 15;
      const rate = (inputs.annualReturn || 7) / 100;
      const monthlyRate = rate / 12;
      const months = years * 12;
      const futureOfCurrent = current * Math.pow(1 + monthlyRate, months);
      const remaining = Math.max(0, target - futureOfCurrent);
      const monthlyContrib = monthlyRate > 0 ? remaining * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1) : remaining / months;
      const totalContributions = monthlyContrib * months + current;
      const totalGrowth = target - totalContributions;
      return {
        primary: { label: "Monthly Contribution Needed", value: "$" + formatNumber(Math.round(monthlyContrib)) },
        details: [
          { label: "Target Amount", value: "$" + formatNumber(Math.round(target)) },
          { label: "Current Balance Growth", value: "$" + formatNumber(Math.round(futureOfCurrent)) },
          { label: "Total Contributions", value: "$" + formatNumber(Math.round(totalContributions)) },
          { label: "Total Investment Growth", value: "$" + formatNumber(Math.round(totalGrowth)) }
        ]
      };
    }`,
  [
    { q: "What is a 529 plan?", a: "A 529 plan is a tax-advantaged savings plan designed to help pay for education expenses." },
    { q: "Are 529 contributions tax deductible?", a: "Many states offer tax deductions or credits for 529 contributions. Federal benefits apply to withdrawals." }
  ],
  "Monthly = (Target - Current x (1+r)^n) x r / ((1+r)^n - 1)",
  ["college-savings-gap-calculator"]
);

add(
  "financial-aid-efc-calculator",
  "Financial Aid EFC Calculator",
  "Estimate your Expected Family Contribution for FAFSA financial aid",
  "Finance", "finance", "$",
  ["EFC calculator", "FAFSA", "financial aid estimate"],
  [
    '{ id: "parentIncome", label: "Parent Annual Income ($)", type: "number", defaultValue: 75000, min: 0, step: 5000 }',
    '{ id: "parentAssets", label: "Parent Assets ($)", type: "number", defaultValue: 50000, min: 0, step: 5000 }',
    '{ id: "studentIncome", label: "Student Annual Income ($)", type: "number", defaultValue: 5000, min: 0, step: 1000 }',
    '{ id: "familySize", label: "Family Size", type: "number", defaultValue: 4, min: 1, max: 12, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const parentInc = inputs.parentIncome || 75000;
      const parentAst = inputs.parentAssets || 50000;
      const studentInc = inputs.studentIncome || 5000;
      const famSize = inputs.familySize || 4;
      const incomeProtection = famSize * 6500;
      const availableIncome = Math.max(0, parentInc - incomeProtection);
      const parentContrib = availableIncome * 0.22 + parentAst * 0.05;
      const studentContrib = Math.max(0, studentInc - 7040) * 0.50;
      const efc = Math.round(parentContrib + studentContrib);
      const avgCost = 25000;
      const estimatedNeed = Math.max(0, avgCost - efc);
      return {
        primary: { label: "Estimated EFC", value: "$" + formatNumber(efc) },
        details: [
          { label: "Parent Contribution", value: "$" + formatNumber(Math.round(parentContrib)) },
          { label: "Student Contribution", value: "$" + formatNumber(Math.round(studentContrib)) },
          { label: "Income Protection Allowance", value: "$" + formatNumber(incomeProtection) },
          { label: "Estimated Financial Need", value: "$" + formatNumber(estimatedNeed) }
        ]
      };
    }`,
  [
    { q: "What is the Expected Family Contribution?", a: "EFC is a number used by schools to determine how much financial aid you are eligible to receive." },
    { q: "Is this the exact FAFSA EFC?", a: "This is a simplified estimate. The actual FAFSA calculation considers many additional factors." }
  ],
  "EFC = (Income - Protection) x 0.22 + Assets x 0.05 + Student Contribution",
  ["scholarship-roi-calculator"]
);

add(
  "tuition-inflation-calculator",
  "Tuition Inflation Calculator",
  "Project future tuition costs based on historical inflation rates",
  "Finance", "finance", "$",
  ["tuition inflation", "future college cost", "education inflation"],
  [
    '{ id: "currentTuition", label: "Current Annual Tuition ($)", type: "number", defaultValue: 20000, min: 0, step: 1000 }',
    '{ id: "yearsUntilEnrollment", label: "Years Until Enrollment", type: "number", defaultValue: 10, min: 1, max: 25, step: 1 }',
    '{ id: "inflationRate", label: "Tuition Inflation Rate (%)", type: "number", defaultValue: 5, min: 0, max: 15, step: 0.5 }',
    '{ id: "yearsInSchool", label: "Years in School", type: "number", defaultValue: 4, min: 1, max: 8, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const current = inputs.currentTuition || 20000;
      const yearsUntil = inputs.yearsUntilEnrollment || 10;
      const inflation = (inputs.inflationRate || 5) / 100;
      const schoolYears = inputs.yearsInSchool || 4;
      const firstYearTuition = current * Math.pow(1 + inflation, yearsUntil);
      let totalCost = 0;
      for (let i = 0; i < schoolYears; i++) {
        totalCost += current * Math.pow(1 + inflation, yearsUntil + i);
      }
      const totalIncrease = totalCost - (current * schoolYears);
      const increasePercent = (firstYearTuition / current - 1) * 100;
      return {
        primary: { label: "Projected Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "First Year Tuition", value: "$" + formatNumber(Math.round(firstYearTuition)) },
          { label: "Current Total (4yr)", value: "$" + formatNumber(Math.round(current * schoolYears)) },
          { label: "Additional Due to Inflation", value: "$" + formatNumber(Math.round(totalIncrease)) },
          { label: "Tuition Increase", value: formatNumber(Math.round(increasePercent)) + "%" }
        ]
      };
    }`,
  [
    { q: "What is the average tuition inflation rate?", a: "Historically, college tuition has increased about 5-8% per year, outpacing general inflation." },
    { q: "Does this include room and board?", a: "No, this calculator only projects tuition costs. Room and board should be budgeted separately." }
  ],
  "Future Tuition = Current x (1 + Inflation Rate)^Years",
  ["college-savings-gap-calculator"]
);

add(
  "student-budget-calculator",
  "Student Budget Calculator",
  "Monthly budget planner designed for college students",
  "Finance", "finance", "$",
  ["student budget", "college budget", "student expenses"],
  [
    '{ id: "monthlyIncome", label: "Monthly Income ($)", type: "number", defaultValue: 1500, min: 0, step: 100 }',
    '{ id: "rent", label: "Monthly Rent ($)", type: "number", defaultValue: 600, min: 0, step: 50 }',
    '{ id: "food", label: "Monthly Food ($)", type: "number", defaultValue: 300, min: 0, step: 25 }',
    '{ id: "transportation", label: "Monthly Transportation ($)", type: "number", defaultValue: 100, min: 0, step: 25 }',
    '{ id: "tuitionMonthly", label: "Monthly Tuition/Fees ($)", type: "number", defaultValue: 200, min: 0, step: 50 }'
  ],
  `(inputs: Record<string, number>) => {
      const income = inputs.monthlyIncome || 1500;
      const rent = inputs.rent || 600;
      const food = inputs.food || 300;
      const transport = inputs.transportation || 100;
      const tuition = inputs.tuitionMonthly || 200;
      const totalExpenses = rent + food + transport + tuition;
      const remaining = income - totalExpenses;
      const savingsRate = income > 0 ? (remaining / income) * 100 : 0;
      const essentialRate = income > 0 ? (totalExpenses / income) * 100 : 0;
      return {
        primary: { label: "Monthly Remaining", value: "$" + formatNumber(Math.round(remaining)) },
        details: [
          { label: "Total Expenses", value: "$" + formatNumber(Math.round(totalExpenses)) },
          { label: "Savings Rate", value: formatNumber(Math.round(savingsRate * 10) / 10) + "%" },
          { label: "Expenses as % of Income", value: formatNumber(Math.round(essentialRate * 10) / 10) + "%" },
          { label: "Annual Surplus", value: "$" + formatNumber(Math.round(remaining * 12)) }
        ]
      };
    }`,
  [
    { q: "What is a healthy savings rate for students?", a: "Even saving 5-10% of income is a good start for students. Focus on building an emergency fund first." },
    { q: "What expenses are not included here?", a: "This covers main categories. Add personal care, entertainment, and insurance costs separately." }
  ],
  "Remaining = Monthly Income - (Rent + Food + Transportation + Tuition)",
  []
);

add(
  "textbook-cost-calculator",
  "Textbook Cost Calculator",
  "Compare buy vs rent vs digital textbook costs per semester",
  "Finance", "finance", "$",
  ["textbook cost", "buy vs rent textbooks", "textbook savings"],
  [
    '{ id: "numTextbooks", label: "Number of Textbooks", type: "number", defaultValue: 5, min: 1, max: 20, step: 1 }',
    '{ id: "avgBuyPrice", label: "Average Buy Price ($)", type: "number", defaultValue: 120, min: 0, step: 10 }',
    '{ id: "avgRentPrice", label: "Average Rent Price ($)", type: "number", defaultValue: 50, min: 0, step: 5 }',
    '{ id: "avgDigitalPrice", label: "Average Digital Price ($)", type: "number", defaultValue: 35, min: 0, step: 5 }',
    '{ id: "resalePercent", label: "Buy-back Value (%)", type: "number", defaultValue: 30, min: 0, max: 100, step: 5 }'
  ],
  `(inputs: Record<string, number>) => {
      const num = inputs.numTextbooks || 5;
      const buy = inputs.avgBuyPrice || 120;
      const rent = inputs.avgRentPrice || 50;
      const digital = inputs.avgDigitalPrice || 35;
      const resale = (inputs.resalePercent || 30) / 100;
      const totalBuy = num * buy;
      const totalRent = num * rent;
      const totalDigital = num * digital;
      const netBuy = totalBuy - (totalBuy * resale);
      const bestOption = Math.min(netBuy, totalRent, totalDigital);
      const bestLabel = bestOption === totalDigital ? "Digital" : bestOption === totalRent ? "Rental" : "Buy (with resale)";
      const maxSavings = Math.max(netBuy, totalRent, totalDigital) - bestOption;
      return {
        primary: { label: "Best Option", value: bestLabel + " - $" + formatNumber(Math.round(bestOption)) },
        details: [
          { label: "Buy Cost (net of resale)", value: "$" + formatNumber(Math.round(netBuy)) },
          { label: "Rental Cost", value: "$" + formatNumber(Math.round(totalRent)) },
          { label: "Digital Cost", value: "$" + formatNumber(Math.round(totalDigital)) },
          { label: "Maximum Savings", value: "$" + formatNumber(Math.round(maxSavings)) }
        ]
      };
    }`,
  [
    { q: "Is renting always cheaper than buying?", a: "Usually yes, but if you resell textbooks for a good price, buying may be comparable to renting." },
    { q: "Are digital textbooks worth it?", a: "Digital versions are often cheapest but cannot be resold. They work well for screen reading." }
  ],
  "Net Buy Cost = Books x Buy Price x (1 - Resale%). Compare with Rent and Digital totals.",
  []
);

// --- GROUP B: AUTOMOTIVE & VEHICLE (11-20) ---


add(
  "car-depreciation-calculator",
  "Car Depreciation Calculator",
  "Estimate vehicle value depreciation over time by year",
  "Finance", "finance", "$",
  ["car depreciation", "vehicle value loss", "auto depreciation"],
  [
    '{ id: "purchasePrice", label: "Purchase Price ($)", type: "number", defaultValue: 35000, min: 0, step: 1000 }',
    '{ id: "vehicleAge", label: "Current Age (years)", type: "number", defaultValue: 0, min: 0, max: 30, step: 1 }',
    '{ id: "yearsToProject", label: "Years to Project", type: "number", defaultValue: 5, min: 1, max: 20, step: 1 }',
    '{ id: "annualMiles", label: "Annual Miles Driven", type: "number", defaultValue: 12000, min: 0, step: 1000 }'
  ],
  `(inputs: Record<string, number>) => {
      const price = inputs.purchasePrice || 35000;
      const age = inputs.vehicleAge || 0;
      const years = inputs.yearsToProject || 5;
      const miles = inputs.annualMiles || 12000;
      const depRates = [0.20, 0.15, 0.13, 0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06];
      let currentValue = price;
      for (let i = 0; i < age; i++) {
        const r = i < depRates.length ? depRates[i] : 0.05;
        currentValue *= (1 - r);
      }
      let futureValue = currentValue;
      for (let i = age; i < age + years; i++) {
        const r = i < depRates.length ? depRates[i] : 0.05;
        futureValue *= (1 - r);
      }
      const mileageAdjust = miles > 15000 ? 0.98 : miles < 10000 ? 1.02 : 1.0;
      futureValue *= Math.pow(mileageAdjust, years);
      const totalDepreciation = currentValue - futureValue;
      const annualAvg = totalDepreciation / years;
      return {
        primary: { label: "Value After " + years + " Years", value: "$" + formatNumber(Math.round(futureValue)) },
        details: [
          { label: "Current Value", value: "$" + formatNumber(Math.round(currentValue)) },
          { label: "Total Depreciation", value: "$" + formatNumber(Math.round(totalDepreciation)) },
          { label: "Average Annual Loss", value: "$" + formatNumber(Math.round(annualAvg)) },
          { label: "Value Retained", value: formatNumber(Math.round(futureValue / price * 1000) / 10) + "%" }
        ]
      };
    }`,
  [
    { q: "How fast do cars depreciate?", a: "New cars lose about 20% in the first year and roughly 10-15% per year after that." },
    { q: "Does mileage affect depreciation?", a: "Yes, higher mileage increases depreciation. This calculator adjusts for above or below average driving." }
  ],
  "Future Value = Purchase Price x Product of (1 - Annual Depreciation Rate) for each year",
  ["car-lease-vs-buy-calculator"]
);

add(
  "car-lease-vs-buy-calculator",
  "Car Lease vs Buy Calculator",
  "Compare the total cost of leasing versus buying a vehicle",
  "Finance", "finance", "$",
  ["lease vs buy", "car lease comparison", "auto purchase comparison"],
  [
    '{ id: "vehiclePrice", label: "Vehicle Price ($)", type: "number", defaultValue: 35000, min: 0, step: 1000 }',
    '{ id: "downPayment", label: "Down Payment ($)", type: "number", defaultValue: 3000, min: 0, step: 500 }',
    '{ id: "loanRate", label: "Loan Interest Rate (%)", type: "number", defaultValue: 5.5, min: 0, max: 15, step: 0.1 }',
    '{ id: "leasePmt", label: "Monthly Lease Payment ($)", type: "number", defaultValue: 350, min: 0, step: 25 }',
    '{ id: "termMonths", label: "Term (months)", type: "number", defaultValue: 36, min: 12, max: 84, step: 12 }'
  ],
  `(inputs: Record<string, number>) => {
      const price = inputs.vehiclePrice || 35000;
      const down = inputs.downPayment || 3000;
      const rate = (inputs.loanRate || 5.5) / 100 / 12;
      const lease = inputs.leasePmt || 350;
      const term = inputs.termMonths || 36;
      const loanAmt = price - down;
      const buyPmt = rate > 0 ? loanAmt * rate / (1 - Math.pow(1 + rate, -term)) : loanAmt / term;
      const totalBuy = buyPmt * term + down;
      const residual = price * 0.55;
      const netBuy = totalBuy - residual;
      const totalLease = lease * term + down;
      const savings = totalLease - netBuy;
      const betterOption = savings > 0 ? "Buying" : "Leasing";
      return {
        primary: { label: "Better Option", value: betterOption + " saves $" + formatNumber(Math.round(Math.abs(savings))) },
        details: [
          { label: "Total Buy Cost (net)", value: "$" + formatNumber(Math.round(netBuy)) },
          { label: "Total Lease Cost", value: "$" + formatNumber(Math.round(totalLease)) },
          { label: "Buy Monthly Payment", value: "$" + formatNumber(Math.round(buyPmt)) },
          { label: "Residual Value (3yr)", value: "$" + formatNumber(Math.round(residual)) }
        ]
      };
    }`,
  [
    { q: "Is leasing or buying cheaper?", a: "Buying is usually cheaper long-term since you build equity. Leasing can have lower monthly payments." },
    { q: "What is residual value?", a: "Residual value is the estimated worth of the vehicle at the end of the lease or loan term." }
  ],
  "Net Buy = (Monthly Payment x Term + Down) - Residual Value. Compare with Lease Total.",
  ["car-depreciation-calculator"]
);

add(
  "ev-charging-cost-calculator",
  "EV Charging Cost Calculator",
  "Calculate home and public EV charging costs per month",
  "Everyday", "everyday", "~",
  ["EV charging cost", "electric car charging", "home charging cost"],
  [
    '{ id: "dailyMiles", label: "Daily Miles Driven", type: "number", defaultValue: 30, min: 0, step: 5 }',
    '{ id: "efficiency", label: "EV Efficiency (miles/kWh)", type: "number", defaultValue: 3.5, min: 1, max: 6, step: 0.1 }',
    '{ id: "homeRate", label: "Home Electricity Rate ($/kWh)", type: "number", defaultValue: 0.13, min: 0, max: 1, step: 0.01 }',
    '{ id: "publicRate", label: "Public Charging Rate ($/kWh)", type: "number", defaultValue: 0.35, min: 0, max: 1, step: 0.01 }',
    '{ id: "homeChargePct", label: "Home Charging (%)", type: "number", defaultValue: 80, min: 0, max: 100, step: 5 }'
  ],
  `(inputs: Record<string, number>) => {
      const daily = inputs.dailyMiles || 30;
      const eff = inputs.efficiency || 3.5;
      const homeRate = inputs.homeRate || 0.13;
      const publicRate = inputs.publicRate || 0.35;
      const homePct = (inputs.homeChargePct || 80) / 100;
      const monthlyMiles = daily * 30;
      const monthlykWh = monthlyMiles / eff;
      const homekWh = monthlykWh * homePct;
      const publickWh = monthlykWh * (1 - homePct);
      const homeCost = homekWh * homeRate;
      const publicCost = publickWh * publicRate;
      const totalCost = homeCost + publicCost;
      const gasEquiv = monthlyMiles / 30 * 3.50;
      return {
        primary: { label: "Monthly Charging Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        details: [
          { label: "Home Charging Cost", value: "$" + formatNumber(Math.round(homeCost * 100) / 100) },
          { label: "Public Charging Cost", value: "$" + formatNumber(Math.round(publicCost * 100) / 100) },
          { label: "Monthly kWh Used", value: formatNumber(Math.round(monthlykWh)) + " kWh" },
          { label: "Equivalent Gas Cost", value: "$" + formatNumber(Math.round(gasEquiv * 100) / 100) }
        ]
      };
    }`,
  [
    { q: "How much does it cost to charge an EV at home?", a: "Home charging typically costs $30-60 per month depending on your electricity rate and driving habits." },
    { q: "Is public charging more expensive?", a: "Yes, public chargers typically cost 2-3 times more per kWh than home electricity rates." }
  ],
  "Monthly Cost = (Miles/Efficiency) x (Home% x HomeRate + Public% x PublicRate)",
  ["gas-vs-electric-car-calculator"]
);

add(
  "ev-range-calculator",
  "EV Range Calculator",
  "Estimate electric vehicle range based on driving conditions",
  "Everyday", "everyday", "~",
  ["EV range", "electric car range", "battery range estimate"],
  [
    '{ id: "batteryCapacity", label: "Battery Capacity (kWh)", type: "number", defaultValue: 75, min: 10, max: 200, step: 5 }',
    '{ id: "ratedEfficiency", label: "Rated Efficiency (miles/kWh)", type: "number", defaultValue: 4.0, min: 1, max: 7, step: 0.1 }',
    '{ id: "temperature", label: "Outside Temperature (F)", type: "number", defaultValue: 70, min: -20, max: 120, step: 5 }',
    '{ id: "speedMph", label: "Average Speed (mph)", type: "number", defaultValue: 60, min: 20, max: 90, step: 5 }',
    '{ id: "hvacOn", label: "HVAC On (0=No, 1=Yes)", type: "number", defaultValue: 1, min: 0, max: 1, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const battery = inputs.batteryCapacity || 75;
      const rated = inputs.ratedEfficiency || 4.0;
      const temp = inputs.temperature || 70;
      const speed = inputs.speedMph || 60;
      const hvac = inputs.hvacOn || 1;
      let tempFactor = 1.0;
      if (temp < 32) tempFactor = 0.70;
      else if (temp < 50) tempFactor = 0.85;
      else if (temp > 95) tempFactor = 0.90;
      let speedFactor = 1.0;
      if (speed > 70) speedFactor = 1 - (speed - 70) * 0.015;
      else if (speed < 40) speedFactor = 1.10;
      const hvacDrain = hvac ? 0.95 : 1.0;
      const adjustedEff = rated * tempFactor * speedFactor * hvacDrain;
      const estimatedRange = battery * adjustedEff;
      const ratedRange = battery * rated;
      const rangeLoss = ratedRange - estimatedRange;
      return {
        primary: { label: "Estimated Range", value: formatNumber(Math.round(estimatedRange)) + " miles" },
        details: [
          { label: "Rated Range", value: formatNumber(Math.round(ratedRange)) + " miles" },
          { label: "Range Reduction", value: formatNumber(Math.round(rangeLoss)) + " miles" },
          { label: "Adjusted Efficiency", value: formatNumber(Math.round(adjustedEff * 10) / 10) + " mi/kWh" },
          { label: "Condition Factor", value: formatNumber(Math.round(tempFactor * speedFactor * hvacDrain * 100)) + "%" }
        ]
      };
    }`,
  [
    { q: "What affects EV range the most?", a: "Temperature and speed have the biggest impact. Cold weather can reduce range by up to 30%." },
    { q: "Does highway driving reduce range?", a: "Yes, higher speeds increase air resistance which reduces efficiency and overall range." }
  ],
  "Range = Battery x Rated Efficiency x Temp Factor x Speed Factor x HVAC Factor",
  ["ev-charging-cost-calculator"]
);

add(
  "car-insurance-comparison-calculator",
  "Car Insurance Comparison Calculator",
  "Compare insurance quotes by coverage level and deductible",
  "Finance", "finance", "$",
  ["car insurance comparison", "auto insurance quotes", "insurance cost"],
  [
    '{ id: "premium1", label: "Quote 1 Annual Premium ($)", type: "number", defaultValue: 1200, min: 0, step: 50 }',
    '{ id: "deductible1", label: "Quote 1 Deductible ($)", type: "number", defaultValue: 500, min: 0, step: 100 }',
    '{ id: "premium2", label: "Quote 2 Annual Premium ($)", type: "number", defaultValue: 900, min: 0, step: 50 }',
    '{ id: "deductible2", label: "Quote 2 Deductible ($)", type: "number", defaultValue: 1000, min: 0, step: 100 }',
    '{ id: "claimsPerYear", label: "Expected Claims Per Year", type: "number", defaultValue: 0.2, min: 0, max: 3, step: 0.1 }'
  ],
  `(inputs: Record<string, number>) => {
      const p1 = inputs.premium1 || 1200;
      const d1 = inputs.deductible1 || 500;
      const p2 = inputs.premium2 || 900;
      const d2 = inputs.deductible2 || 1000;
      const claims = inputs.claimsPerYear || 0.2;
      const totalCost1 = p1 + (d1 * claims);
      const totalCost2 = p2 + (d2 * claims);
      const savings = Math.abs(totalCost1 - totalCost2);
      const better = totalCost1 < totalCost2 ? "Quote 1" : "Quote 2";
      const fiveYear1 = totalCost1 * 5;
      const fiveYear2 = totalCost2 * 5;
      return {
        primary: { label: "Better Value", value: better + " saves $" + formatNumber(Math.round(savings)) + "/yr" },
        details: [
          { label: "Quote 1 Effective Cost", value: "$" + formatNumber(Math.round(totalCost1)) + "/yr" },
          { label: "Quote 2 Effective Cost", value: "$" + formatNumber(Math.round(totalCost2)) + "/yr" },
          { label: "5-Year Cost (Quote 1)", value: "$" + formatNumber(Math.round(fiveYear1)) },
          { label: "5-Year Cost (Quote 2)", value: "$" + formatNumber(Math.round(fiveYear2)) }
        ]
      };
    }`,
  [
    { q: "How is effective cost calculated?", a: "Effective cost is the annual premium plus expected out-of-pocket deductible costs based on claim frequency." },
    { q: "Should I choose the lowest premium?", a: "Not always. A lower premium with a high deductible can cost more if you file claims frequently." }
  ],
  "Effective Cost = Annual Premium + (Deductible x Expected Claims Per Year)",
  []
);

add(
  "tire-wear-calculator",
  "Tire Wear Calculator",
  "Estimate tire replacement timing based on mileage and conditions",
  "Everyday", "everyday", "~",
  ["tire wear", "tire replacement", "tire lifespan"],
  [
    '{ id: "tireLifeRating", label: "Tire Life Rating (miles)", type: "number", defaultValue: 50000, min: 10000, max: 100000, step: 5000 }',
    '{ id: "currentMileage", label: "Miles on Current Tires", type: "number", defaultValue: 15000, min: 0, step: 1000 }',
    '{ id: "annualMiles", label: "Annual Miles Driven", type: "number", defaultValue: 12000, min: 0, step: 1000 }',
    '{ id: "tireCost", label: "Cost Per Tire ($)", type: "number", defaultValue: 150, min: 0, step: 10 }'
  ],
  `(inputs: Record<string, number>) => {
      const lifeRating = inputs.tireLifeRating || 50000;
      const current = inputs.currentMileage || 15000;
      const annual = inputs.annualMiles || 12000;
      const costPer = inputs.tireCost || 150;
      const remainingMiles = Math.max(0, lifeRating - current);
      const monthsRemaining = annual > 0 ? Math.round(remainingMiles / annual * 12) : 0;
      const wearPercent = Math.min(100, (current / lifeRating) * 100);
      const totalReplaceCost = costPer * 4;
      const costPerMile = lifeRating > 0 ? (totalReplaceCost / lifeRating) : 0;
      return {
        primary: { label: "Months Until Replacement", value: String(monthsRemaining) + " months" },
        details: [
          { label: "Miles Remaining", value: formatNumber(Math.round(remainingMiles)) },
          { label: "Current Wear", value: formatNumber(Math.round(wearPercent)) + "%" },
          { label: "Replacement Cost (4 tires)", value: "$" + formatNumber(Math.round(totalReplaceCost)) },
          { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 1000) / 1000) }
        ]
      };
    }`,
  [
    { q: "How long do tires typically last?", a: "Most tires last 40000 to 60000 miles depending on the tire type and driving conditions." },
    { q: "What factors shorten tire life?", a: "Hard braking, fast cornering, underinflation, and poor alignment all reduce tire lifespan." }
  ],
  "Months Remaining = (Tire Life Rating - Current Mileage) / Annual Miles x 12",
  []
);

add(
  "car-loan-payoff-calculator",
  "Car Loan Payoff Calculator",
  "See how extra payments reduce your car loan payoff time",
  "Finance", "finance", "$",
  ["car loan payoff", "auto loan extra payment", "car loan early payoff"],
  [
    '{ id: "loanBalance", label: "Remaining Loan Balance ($)", type: "number", defaultValue: 20000, min: 0, step: 1000 }',
    '{ id: "interestRate", label: "Interest Rate (%)", type: "number", defaultValue: 5.0, min: 0, max: 20, step: 0.1 }',
    '{ id: "monthlyPayment", label: "Current Monthly Payment ($)", type: "number", defaultValue: 400, min: 0, step: 25 }',
    '{ id: "extraPayment", label: "Extra Monthly Payment ($)", type: "number", defaultValue: 100, min: 0, step: 25 }'
  ],
  `(inputs: Record<string, number>) => {
      const balance = inputs.loanBalance || 20000;
      const rate = (inputs.interestRate || 5) / 100 / 12;
      const payment = inputs.monthlyPayment || 400;
      const extra = inputs.extraPayment || 100;
      let bal1 = balance, months1 = 0, interest1 = 0;
      while (bal1 > 0 && months1 < 360) {
        const int1 = bal1 * rate;
        interest1 += int1;
        bal1 = bal1 + int1 - payment;
        months1++;
        if (bal1 <= 0) break;
      }
      let bal2 = balance, months2 = 0, interest2 = 0;
      while (bal2 > 0 && months2 < 360) {
        const int2 = bal2 * rate;
        interest2 += int2;
        bal2 = bal2 + int2 - payment - extra;
        months2++;
        if (bal2 <= 0) break;
      }
      const monthsSaved = months1 - months2;
      const interestSaved = interest1 - interest2;
      return {
        primary: { label: "Time Saved", value: monthsSaved + " months" },
        details: [
          { label: "Original Payoff", value: months1 + " months" },
          { label: "New Payoff", value: months2 + " months" },
          { label: "Interest Saved", value: "$" + formatNumber(Math.round(interestSaved)) },
          { label: "Total Interest (original)", value: "$" + formatNumber(Math.round(interest1)) }
        ]
      };
    }`,
  [
    { q: "How much can extra payments save?", a: "Even $50-100 extra per month can save hundreds in interest and pay off your loan months earlier." },
    { q: "Are there penalties for early payoff?", a: "Most auto loans do not have prepayment penalties, but check your loan agreement to be sure." }
  ],
  "Compare payoff schedules with and without extra monthly payments",
  ["car-lease-vs-buy-calculator"]
);

add(
  "gas-vs-electric-car-calculator",
  "Gas vs Electric Car Calculator",
  "Total cost comparison between gas and electric vehicles over time",
  "Everyday", "everyday", "~",
  ["gas vs electric", "EV vs gas cost", "electric car savings"],
  [
    '{ id: "annualMiles", label: "Annual Miles Driven", type: "number", defaultValue: 12000, min: 0, step: 1000 }',
    '{ id: "gasMpg", label: "Gas Car MPG", type: "number", defaultValue: 28, min: 5, max: 60, step: 1 }',
    '{ id: "gasPrice", label: "Gas Price ($/gallon)", type: "number", defaultValue: 3.50, min: 0, max: 10, step: 0.10 }',
    '{ id: "evEfficiency", label: "EV Efficiency (miles/kWh)", type: "number", defaultValue: 3.5, min: 1, max: 6, step: 0.1 }',
    '{ id: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", defaultValue: 0.13, min: 0, max: 1, step: 0.01 }'
  ],
  `(inputs: Record<string, number>) => {
      const miles = inputs.annualMiles || 12000;
      const mpg = inputs.gasMpg || 28;
      const gasPrice = inputs.gasPrice || 3.50;
      const evEff = inputs.evEfficiency || 3.5;
      const elecRate = inputs.electricRate || 0.13;
      const annualGasCost = (miles / mpg) * gasPrice;
      const annualEvCost = (miles / evEff) * elecRate;
      const annualSavings = annualGasCost - annualEvCost;
      const fiveYearSavings = annualSavings * 5;
      const gasCostPerMile = gasPrice / mpg;
      const evCostPerMile = elecRate / evEff;
      return {
        primary: { label: "Annual Fuel Savings (EV)", value: "$" + formatNumber(Math.round(annualSavings)) },
        details: [
          { label: "Annual Gas Cost", value: "$" + formatNumber(Math.round(annualGasCost)) },
          { label: "Annual EV Cost", value: "$" + formatNumber(Math.round(annualEvCost)) },
          { label: "5-Year Savings", value: "$" + formatNumber(Math.round(fiveYearSavings)) },
          { label: "Gas Cost Per Mile", value: "$" + formatNumber(Math.round(gasCostPerMile * 100) / 100) }
        ]
      };
    }`,
  [
    { q: "Are electric cars cheaper to fuel?", a: "Yes, electricity is typically 3-5 times cheaper per mile than gasoline for most drivers." },
    { q: "What other EV savings exist?", a: "EVs also save on maintenance since they have fewer moving parts, no oil changes, and less brake wear." }
  ],
  "Annual Savings = (Miles/MPG x Gas Price) - (Miles/Efficiency x Electric Rate)",
  ["ev-charging-cost-calculator"]
);

add(
  "car-maintenance-schedule-calculator",
  "Car Maintenance Schedule Calculator",
  "Estimate annual maintenance costs by vehicle mileage",
  "Everyday", "everyday", "~",
  ["car maintenance cost", "vehicle maintenance schedule", "auto service cost"],
  [
    '{ id: "currentMileage", label: "Current Mileage", type: "number", defaultValue: 50000, min: 0, step: 5000 }',
    '{ id: "annualMiles", label: "Annual Miles Driven", type: "number", defaultValue: 12000, min: 0, step: 1000 }',
    '{ id: "vehicleAge", label: "Vehicle Age (years)", type: "number", defaultValue: 5, min: 0, max: 30, step: 1 }',
    '{ id: "oilChangeCost", label: "Oil Change Cost ($)", type: "number", defaultValue: 50, min: 0, step: 10 }'
  ],
  `(inputs: Record<string, number>) => {
      const mileage = inputs.currentMileage || 50000;
      const annual = inputs.annualMiles || 12000;
      const age = inputs.vehicleAge || 5;
      const oilCost = inputs.oilChangeCost || 50;
      const oilChanges = Math.ceil(annual / 5000);
      const oilTotal = oilChanges * oilCost;
      const tireRotations = Math.ceil(annual / 7500);
      const tireRotCost = tireRotations * 30;
      const brakeService = age > 3 ? 200 : 0;
      const miscMaint = age * 50 + (mileage > 75000 ? 300 : 0);
      const totalAnnual = oilTotal + tireRotCost + brakeService + miscMaint;
      const monthlyCost = totalAnnual / 12;
      return {
        primary: { label: "Est. Annual Maintenance", value: "$" + formatNumber(Math.round(totalAnnual)) },
        details: [
          { label: "Oil Changes Per Year", value: String(oilChanges) + " ($" + formatNumber(oilTotal) + ")" },
          { label: "Tire Rotations", value: String(tireRotations) + " ($" + formatNumber(tireRotCost) + ")" },
          { label: "Brake Service", value: "$" + formatNumber(brakeService) },
          { label: "Monthly Budget", value: "$" + formatNumber(Math.round(monthlyCost)) }
        ]
      };
    }`,
  [
    { q: "How much should I budget for car maintenance?", a: "Budget about $100-150 per month for a vehicle over 5 years old or with more than 60000 miles." },
    { q: "What maintenance is most important?", a: "Regular oil changes, tire rotations, and brake inspections are the most critical services." }
  ],
  "Annual Cost = Oil Changes + Tire Rotations + Brake Service + Age-based Maintenance",
  ["car-depreciation-calculator"]
);

add(
  "used-car-value-calculator",
  "Used Car Value Calculator",
  "Estimate the fair market value of a used vehicle",
  "Finance", "finance", "$",
  ["used car value", "car trade-in value", "vehicle market value"],
  [
    '{ id: "originalPrice", label: "Original MSRP ($)", type: "number", defaultValue: 30000, min: 0, step: 1000 }',
    '{ id: "age", label: "Vehicle Age (years)", type: "number", defaultValue: 5, min: 0, max: 25, step: 1 }',
    '{ id: "mileage", label: "Current Mileage", type: "number", defaultValue: 60000, min: 0, step: 5000 }',
    '{ id: "condition", label: "Condition (1=Poor, 5=Excellent)", type: "number", defaultValue: 3, min: 1, max: 5, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const msrp = inputs.originalPrice || 30000;
      const age = inputs.age || 5;
      const miles = inputs.mileage || 60000;
      const condition = inputs.condition || 3;
      const depRates = [0.20, 0.15, 0.13, 0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06];
      let value = msrp;
      for (let i = 0; i < age; i++) {
        const r = i < depRates.length ? depRates[i] : 0.05;
        value *= (1 - r);
      }
      const avgMiles = age * 12000;
      const mileageDiff = miles - avgMiles;
      const mileageAdj = mileageDiff * -0.05;
      value += mileageAdj;
      const conditionMultiplier = 0.80 + (condition - 1) * 0.075;
      value *= conditionMultiplier;
      value = Math.max(0, Math.round(value));
      const tradeIn = Math.round(value * 0.85);
      const privateSale = Math.round(value * 1.10);
      return {
        primary: { label: "Estimated Market Value", value: "$" + formatNumber(value) },
        details: [
          { label: "Trade-In Value", value: "$" + formatNumber(tradeIn) },
          { label: "Private Sale Value", value: "$" + formatNumber(privateSale) },
          { label: "Value Retained", value: formatNumber(Math.round(value / msrp * 100)) + "%" },
          { label: "Depreciation Total", value: "$" + formatNumber(Math.round(msrp - value)) }
        ]
      };
    }`,
  [
    { q: "How is used car value determined?", a: "Value is based on original price, age, mileage compared to average, and vehicle condition." },
    { q: "What is the difference between trade-in and private sale?", a: "Trade-in values are typically 10-15% lower than private sale because dealers need profit margin." }
  ],
  "Value = MSRP x Depreciation Factors x Mileage Adjustment x Condition Multiplier",
  ["car-depreciation-calculator"]
);

// --- GROUP C: FOOD & NUTRITION (21-30) ---


add(
  "recipe-scaler-calculator",
  "Recipe Scaler Calculator",
  "Scale recipe ingredients up or down by serving size",
  "Everyday", "everyday", "~",
  ["recipe scaler", "ingredient calculator", "serving size converter"],
  [
    '{ id: "originalServings", label: "Original Recipe Servings", type: "number", defaultValue: 4, min: 1, max: 100, step: 1 }',
    '{ id: "desiredServings", label: "Desired Servings", type: "number", defaultValue: 8, min: 1, max: 200, step: 1 }',
    '{ id: "ingredient1Amt", label: "Ingredient 1 Amount", type: "number", defaultValue: 2, min: 0, step: 0.25 }',
    '{ id: "ingredient2Amt", label: "Ingredient 2 Amount", type: "number", defaultValue: 1.5, min: 0, step: 0.25 }',
    '{ id: "ingredient3Amt", label: "Ingredient 3 Amount", type: "number", defaultValue: 3, min: 0, step: 0.25 }'
  ],
  `(inputs: Record<string, number>) => {
      const original = inputs.originalServings || 4;
      const desired = inputs.desiredServings || 8;
      const i1 = inputs.ingredient1Amt || 2;
      const i2 = inputs.ingredient2Amt || 1.5;
      const i3 = inputs.ingredient3Amt || 3;
      const factor = desired / original;
      const new1 = Math.round(i1 * factor * 100) / 100;
      const new2 = Math.round(i2 * factor * 100) / 100;
      const new3 = Math.round(i3 * factor * 100) / 100;
      return {
        primary: { label: "Scale Factor", value: formatNumber(Math.round(factor * 100) / 100) + "x" },
        details: [
          { label: "Ingredient 1 (scaled)", value: formatNumber(new1) },
          { label: "Ingredient 2 (scaled)", value: formatNumber(new2) },
          { label: "Ingredient 3 (scaled)", value: formatNumber(new3) },
          { label: "Servings Change", value: original + " to " + desired }
        ]
      };
    }`,
  [
    { q: "How do I scale a recipe?", a: "Divide desired servings by original servings to get the scale factor, then multiply each ingredient." },
    { q: "Do all ingredients scale equally?", a: "Most do, but spices and leavening agents may need less scaling. Increase them by 75% of the factor." }
  ],
  "Scale Factor = Desired Servings / Original Servings. New Amount = Original x Scale Factor.",
  []
);

add(
  "calorie-deficit-calculator",
  "Calorie Deficit Calculator",
  "Calculate the daily calorie deficit needed for your weight loss goal",
  "Health", "health", "H",
  ["calorie deficit", "weight loss calories", "calorie calculator"],
  [
    '{ id: "currentWeight", label: "Current Weight (lbs)", type: "number", defaultValue: 180, min: 50, max: 500, step: 1 }',
    '{ id: "goalWeight", label: "Goal Weight (lbs)", type: "number", defaultValue: 160, min: 50, max: 500, step: 1 }',
    '{ id: "weeks", label: "Target Weeks", type: "number", defaultValue: 20, min: 1, max: 104, step: 1 }',
    '{ id: "tdee", label: "Daily Calories Burned (TDEE)", type: "number", defaultValue: 2200, min: 1000, max: 5000, step: 50 }'
  ],
  `(inputs: Record<string, number>) => {
      const current = inputs.currentWeight || 180;
      const goal = inputs.goalWeight || 160;
      const weeks = inputs.weeks || 20;
      const tdee = inputs.tdee || 2200;
      const lbsToLose = Math.max(0, current - goal);
      const totalCalDeficit = lbsToLose * 3500;
      const dailyDeficit = totalCalDeficit / (weeks * 7);
      const dailyIntake = tdee - dailyDeficit;
      const weeklyLoss = lbsToLose / weeks;
      const safe = dailyIntake >= 1200;
      return {
        primary: { label: "Daily Calorie Target", value: formatNumber(Math.round(dailyIntake)) + " cal" },
        details: [
          { label: "Daily Deficit Needed", value: formatNumber(Math.round(dailyDeficit)) + " cal" },
          { label: "Weekly Weight Loss", value: formatNumber(Math.round(weeklyLoss * 10) / 10) + " lbs" },
          { label: "Total Pounds to Lose", value: formatNumber(lbsToLose) + " lbs" },
          { label: "Safe Rate", value: safe ? "Yes" : "Below 1200 cal - consult doctor" }
        ]
      };
    }`,
  [
    { q: "What is a safe calorie deficit?", a: "A deficit of 500-1000 calories per day is generally safe, resulting in 1-2 lbs of weight loss per week." },
    { q: "What is TDEE?", a: "Total Daily Energy Expenditure is the total calories you burn per day including exercise and activity." }
  ],
  "Daily Deficit = (Lbs to Lose x 3500) / (Weeks x 7). Target = TDEE - Deficit.",
  ["protein-intake-calculator"]
);

add(
  "meal-prep-cost-calculator",
  "Meal Prep Cost Calculator",
  "Calculate cost per meal when batch cooking at home",
  "Everyday", "everyday", "~",
  ["meal prep cost", "batch cooking cost", "cost per meal"],
  [
    '{ id: "totalIngredientCost", label: "Total Ingredient Cost ($)", type: "number", defaultValue: 50, min: 0, step: 5 }',
    '{ id: "servingsProduced", label: "Total Servings Produced", type: "number", defaultValue: 12, min: 1, max: 50, step: 1 }',
    '{ id: "prepTimeMinutes", label: "Prep Time (minutes)", type: "number", defaultValue: 60, min: 0, step: 10 }',
    '{ id: "eatingOutCost", label: "Average Restaurant Meal ($)", type: "number", defaultValue: 15, min: 0, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const cost = inputs.totalIngredientCost || 50;
      const servings = inputs.servingsProduced || 12;
      const prepTime = inputs.prepTimeMinutes || 60;
      const eatOut = inputs.eatingOutCost || 15;
      const costPerServing = cost / servings;
      const savingsPerMeal = eatOut - costPerServing;
      const totalSavings = savingsPerMeal * servings;
      const timePerServing = prepTime / servings;
      const weeklySavings = savingsPerMeal * 7;
      return {
        primary: { label: "Cost Per Meal", value: "$" + formatNumber(Math.round(costPerServing * 100) / 100) },
        details: [
          { label: "Savings Per Meal", value: "$" + formatNumber(Math.round(savingsPerMeal * 100) / 100) },
          { label: "Total Batch Savings", value: "$" + formatNumber(Math.round(totalSavings)) },
          { label: "Prep Time Per Serving", value: formatNumber(Math.round(timePerServing)) + " min" },
          { label: "Weekly Savings (daily)", value: "$" + formatNumber(Math.round(weeklySavings)) }
        ]
      };
    }`,
  [
    { q: "How much can meal prepping save?", a: "Most people save $100-200 per month by meal prepping compared to eating out or ordering delivery." },
    { q: "How many servings should I prep?", a: "Prepare 8-12 servings per batch for a good balance of efficiency and food freshness." }
  ],
  "Cost Per Meal = Total Ingredient Cost / Servings Produced",
  ["food-cost-per-serving-calculator"]
);

add(
  "protein-intake-calculator",
  "Protein Intake Calculator",
  "Calculate your daily protein needs based on weight and goals",
  "Health", "health", "H",
  ["protein intake", "daily protein needs", "protein calculator"],
  [
    '{ id: "bodyWeight", label: "Body Weight (lbs)", type: "number", defaultValue: 170, min: 50, max: 400, step: 1 }',
    '{ id: "activityLevel", label: "Activity Level (1=Sedentary, 5=Athlete)", type: "number", defaultValue: 3, min: 1, max: 5, step: 1 }',
    '{ id: "goalType", label: "Goal (1=Maintain, 2=Lose Fat, 3=Build Muscle)", type: "number", defaultValue: 1, min: 1, max: 3, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const weight = inputs.bodyWeight || 170;
      const activity = inputs.activityLevel || 3;
      const goal = inputs.goalType || 1;
      const weightKg = weight * 0.453592;
      const baseMultiplier = [0.8, 0.8, 1.0, 1.2, 1.4];
      let multiplier = baseMultiplier[Math.min(4, Math.max(0, activity - 1))];
      if (goal === 2) multiplier += 0.3;
      if (goal === 3) multiplier += 0.5;
      const dailyProtein = Math.round(weightKg * multiplier);
      const perMeal3 = Math.round(dailyProtein / 3);
      const perMeal4 = Math.round(dailyProtein / 4);
      const calories = dailyProtein * 4;
      return {
        primary: { label: "Daily Protein Goal", value: dailyProtein + "g" },
        details: [
          { label: "Per Meal (3 meals)", value: perMeal3 + "g" },
          { label: "Per Meal (4 meals)", value: perMeal4 + "g" },
          { label: "Calories from Protein", value: formatNumber(calories) + " cal" },
          { label: "Grams per lb Body Weight", value: formatNumber(Math.round(dailyProtein / weight * 100) / 100) }
        ]
      };
    }`,
  [
    { q: "How much protein do I need daily?", a: "Most adults need 0.8-1.2g per kg of body weight. Athletes and those building muscle need 1.4-2.0g per kg." },
    { q: "Can you eat too much protein?", a: "For healthy adults, up to 2g per kg is safe. Those with kidney issues should consult their doctor." }
  ],
  "Daily Protein (g) = Body Weight (kg) x Activity Multiplier x Goal Adjustment",
  ["macronutrient-ratio-calculator"]
);

add(
  "hydration-calculator",
  "Hydration Calculator",
  "Calculate your recommended daily water intake based on activity and weight",
  "Health", "health", "H",
  ["hydration calculator", "water intake", "daily water needs"],
  [
    '{ id: "bodyWeight", label: "Body Weight (lbs)", type: "number", defaultValue: 160, min: 50, max: 400, step: 1 }',
    '{ id: "exerciseMinutes", label: "Daily Exercise (minutes)", type: "number", defaultValue: 30, min: 0, max: 300, step: 10 }',
    '{ id: "climate", label: "Climate (1=Cool, 2=Moderate, 3=Hot)", type: "number", defaultValue: 2, min: 1, max: 3, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const weight = inputs.bodyWeight || 160;
      const exercise = inputs.exerciseMinutes || 30;
      const climate = inputs.climate || 2;
      const baseOz = weight * 0.5;
      const exerciseOz = (exercise / 30) * 12;
      const climateMultiplier = climate === 3 ? 1.2 : climate === 1 ? 0.9 : 1.0;
      const totalOz = (baseOz + exerciseOz) * climateMultiplier;
      const liters = totalOz * 0.0296;
      const cups = totalOz / 8;
      const bottles = totalOz / 16.9;
      return {
        primary: { label: "Daily Water Intake", value: formatNumber(Math.round(totalOz)) + " oz" },
        details: [
          { label: "In Liters", value: formatNumber(Math.round(liters * 10) / 10) + " L" },
          { label: "In Cups (8oz)", value: formatNumber(Math.round(cups * 10) / 10) + " cups" },
          { label: "Water Bottles (16.9oz)", value: formatNumber(Math.round(bottles * 10) / 10) + " bottles" },
          { label: "Exercise Addition", value: formatNumber(Math.round(exerciseOz)) + " oz" }
        ]
      };
    }`,
  [
    { q: "How much water should I drink daily?", a: "A general rule is half your body weight in ounces, plus extra for exercise and hot weather." },
    { q: "Does coffee count toward water intake?", a: "Yes, moderate coffee and tea consumption counts. However, water is the best hydration source." }
  ],
  "Daily Oz = (Weight x 0.5 + Exercise Bonus) x Climate Factor",
  ["calorie-deficit-calculator"]
);

add(
  "caffeine-intake-calculator",
  "Caffeine Intake Calculator",
  "Track daily caffeine consumption from various beverage sources",
  "Health", "health", "H",
  ["caffeine tracker", "caffeine intake", "coffee caffeine"],
  [
    '{ id: "coffees", label: "Cups of Coffee (8oz)", type: "number", defaultValue: 2, min: 0, max: 10, step: 1 }',
    '{ id: "espressos", label: "Espresso Shots", type: "number", defaultValue: 0, min: 0, max: 10, step: 1 }',
    '{ id: "teas", label: "Cups of Tea (8oz)", type: "number", defaultValue: 1, min: 0, max: 10, step: 1 }',
    '{ id: "sodas", label: "Cans of Soda (12oz)", type: "number", defaultValue: 0, min: 0, max: 10, step: 1 }',
    '{ id: "energyDrinks", label: "Energy Drinks (8oz)", type: "number", defaultValue: 0, min: 0, max: 5, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const coffee = (inputs.coffees || 0) * 95;
      const espresso = (inputs.espressos || 0) * 63;
      const tea = (inputs.teas || 0) * 47;
      const soda = (inputs.sodas || 0) * 34;
      const energy = (inputs.energyDrinks || 0) * 80;
      const total = coffee + espresso + tea + soda + energy;
      const safeLimit = 400;
      const remaining = Math.max(0, safeLimit - total);
      const percentOfLimit = (total / safeLimit) * 100;
      const halfLifeHours = 5;
      const hoursToProcess = total > 0 ? Math.round(Math.log(total / 10) / Math.log(2) * halfLifeHours * 10) / 10 : 0;
      return {
        primary: { label: "Daily Caffeine", value: total + "mg" },
        details: [
          { label: "Safe Limit", value: safeLimit + "mg" },
          { label: "Remaining Allowance", value: remaining + "mg" },
          { label: "Percent of Limit", value: formatNumber(Math.round(percentOfLimit)) + "%" },
          { label: "Hours to Process", value: formatNumber(hoursToProcess) + " hrs" }
        ]
      };
    }`,
  [
    { q: "How much caffeine is safe per day?", a: "The FDA recommends no more than 400mg of caffeine per day for healthy adults." },
    { q: "How long does caffeine stay in your system?", a: "Caffeine has a half-life of about 5 hours. It can take 10+ hours to fully process a large dose." }
  ],
  "Total Caffeine = Coffee(95mg) + Espresso(63mg) + Tea(47mg) + Soda(34mg) + Energy(80mg)",
  []
);

add(
  "alcohol-calorie-calculator",
  "Alcohol Calorie Calculator",
  "Calculate calories consumed from alcoholic beverages",
  "Health", "health", "H",
  ["alcohol calories", "drink calories", "beer wine calories"],
  [
    '{ id: "beers", label: "Beers (12oz, 5%)", type: "number", defaultValue: 0, min: 0, max: 20, step: 1 }',
    '{ id: "wineGlasses", label: "Wine Glasses (5oz)", type: "number", defaultValue: 0, min: 0, max: 20, step: 1 }',
    '{ id: "spirits", label: "Spirit Shots (1.5oz)", type: "number", defaultValue: 0, min: 0, max: 20, step: 1 }',
    '{ id: "cocktails", label: "Mixed Cocktails", type: "number", defaultValue: 0, min: 0, max: 20, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const beerCal = (inputs.beers || 0) * 153;
      const wineCal = (inputs.wineGlasses || 0) * 125;
      const spiritCal = (inputs.spirits || 0) * 97;
      const cocktailCal = (inputs.cocktails || 0) * 220;
      const totalCal = beerCal + wineCal + spiritCal + cocktailCal;
      const totalDrinks = (inputs.beers || 0) + (inputs.wineGlasses || 0) + (inputs.spirits || 0) + (inputs.cocktails || 0);
      const weeklyCal = totalCal * 7;
      const monthlyLbs = (weeklyCal * 4) / 3500;
      return {
        primary: { label: "Total Calories", value: formatNumber(totalCal) + " cal" },
        details: [
          { label: "Total Drinks", value: String(totalDrinks) },
          { label: "Weekly Calories", value: formatNumber(Math.round(weeklyCal)) + " cal" },
          { label: "Monthly Weight Impact", value: formatNumber(Math.round(monthlyLbs * 10) / 10) + " lbs" },
          { label: "Avg Calories Per Drink", value: totalDrinks > 0 ? formatNumber(Math.round(totalCal / totalDrinks)) + " cal" : "0 cal" }
        ]
      };
    }`,
  [
    { q: "How many calories are in alcoholic drinks?", a: "Beer has about 150 cal, wine 125 cal, a spirit shot 97 cal, and cocktails 200-300 cal each." },
    { q: "Can alcohol cause weight gain?", a: "Yes, alcohol calories add up quickly and are metabolized before other nutrients, promoting fat storage." }
  ],
  "Total = Beer(153) + Wine(125) + Spirits(97) + Cocktails(220) per serving",
  ["calorie-deficit-calculator"]
);

add(
  "intermittent-fasting-calculator",
  "Intermittent Fasting Calculator",
  "Calculate fasting and eating window schedules with calorie targets",
  "Health", "health", "H",
  ["intermittent fasting", "fasting schedule", "IF calculator"],
  [
    '{ id: "fastingHours", label: "Fasting Window (hours)", type: "number", defaultValue: 16, min: 8, max: 23, step: 1 }',
    '{ id: "firstMealHour", label: "First Meal Time (hour, 24h)", type: "number", defaultValue: 12, min: 0, max: 23, step: 1 }',
    '{ id: "dailyCalories", label: "Daily Calorie Target", type: "number", defaultValue: 2000, min: 800, max: 5000, step: 100 }',
    '{ id: "mealsPerDay", label: "Meals in Eating Window", type: "number", defaultValue: 3, min: 1, max: 6, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const fastHrs = inputs.fastingHours || 16;
      const firstMeal = inputs.firstMealHour || 12;
      const calories = inputs.dailyCalories || 2000;
      const meals = inputs.mealsPerDay || 3;
      const eatingWindow = 24 - fastHrs;
      const lastMealHour = (firstMeal + eatingWindow) % 24;
      const calPerMeal = Math.round(calories / meals);
      const formatHr = (h: number) => {
        const hr = h % 24;
        const ampm = hr >= 12 ? "PM" : "AM";
        const displayHr = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
        return displayHr + ":00 " + ampm;
      };
      return {
        primary: { label: "Eating Window", value: eatingWindow + " hours" },
        details: [
          { label: "First Meal", value: formatHr(firstMeal) },
          { label: "Last Meal By", value: formatHr(lastMealHour) },
          { label: "Calories Per Meal", value: formatNumber(calPerMeal) + " cal" },
          { label: "Fasting Ratio", value: fastHrs + ":" + eatingWindow }
        ]
      };
    }`,
  [
    { q: "What is the most common IF schedule?", a: "The 16:8 method is most popular, with 16 hours of fasting and an 8-hour eating window daily." },
    { q: "Can I drink water during fasting?", a: "Yes, water, black coffee, and unsweetened tea are allowed during the fasting window." }
  ],
  "Eating Window = 24 - Fasting Hours. Last Meal = First Meal + Eating Window.",
  ["calorie-deficit-calculator"]
);

add(
  "food-cost-per-serving-calculator",
  "Food Cost Per Serving Calculator",
  "Compare cost per serving across different food items",
  "Everyday", "everyday", "~",
  ["food cost per serving", "grocery comparison", "cost per portion"],
  [
    '{ id: "itemPrice", label: "Item Price ($)", type: "number", defaultValue: 8.99, min: 0, step: 0.50 }',
    '{ id: "totalWeight", label: "Total Weight (oz)", type: "number", defaultValue: 32, min: 0.1, step: 1 }',
    '{ id: "servingSize", label: "Serving Size (oz)", type: "number", defaultValue: 4, min: 0.1, step: 0.5 }',
    '{ id: "caloriesPerServing", label: "Calories Per Serving", type: "number", defaultValue: 250, min: 0, step: 10 }'
  ],
  `(inputs: Record<string, number>) => {
      const price = inputs.itemPrice || 8.99;
      const totalWt = inputs.totalWeight || 32;
      const servSize = inputs.servingSize || 4;
      const calPerServ = inputs.caloriesPerServing || 250;
      const servingsPerPkg = totalWt / servSize;
      const costPerServing = price / servingsPerPkg;
      const costPerOz = price / totalWt;
      const costPerCalorie = calPerServ > 0 ? costPerServing / calPerServ : 0;
      const costPer100Cal = costPerCalorie * 100;
      return {
        primary: { label: "Cost Per Serving", value: "$" + formatNumber(Math.round(costPerServing * 100) / 100) },
        details: [
          { label: "Servings Per Package", value: formatNumber(Math.round(servingsPerPkg * 10) / 10) },
          { label: "Cost Per Ounce", value: "$" + formatNumber(Math.round(costPerOz * 100) / 100) },
          { label: "Cost Per 100 Calories", value: "$" + formatNumber(Math.round(costPer100Cal * 100) / 100) },
          { label: "Total Calories", value: formatNumber(Math.round(calPerServ * servingsPerPkg)) }
        ]
      };
    }`,
  [
    { q: "How is cost per serving calculated?", a: "Divide the total item price by the number of servings, which is total weight divided by serving size." },
    { q: "What is a good cost per serving?", a: "Under $2 per serving is economical for most grocery items. Compare similar products for best value." }
  ],
  "Cost Per Serving = Item Price / (Total Weight / Serving Size)",
  ["meal-prep-cost-calculator"]
);

add(
  "macronutrient-ratio-calculator",
  "Macronutrient Ratio Calculator",
  "Calculate your daily macro split for specific diet goals",
  "Health", "health", "H",
  ["macronutrient ratio", "macro calculator", "diet macros"],
  [
    '{ id: "dailyCalories", label: "Daily Calorie Target", type: "number", defaultValue: 2000, min: 800, max: 5000, step: 100 }',
    '{ id: "proteinPct", label: "Protein (%)", type: "number", defaultValue: 30, min: 5, max: 60, step: 5 }',
    '{ id: "carbPct", label: "Carbs (%)", type: "number", defaultValue: 40, min: 5, max: 70, step: 5 }',
    '{ id: "fatPct", label: "Fat (%)", type: "number", defaultValue: 30, min: 5, max: 60, step: 5 }'
  ],
  `(inputs: Record<string, number>) => {
      const cals = inputs.dailyCalories || 2000;
      const pPct = (inputs.proteinPct || 30) / 100;
      const cPct = (inputs.carbPct || 40) / 100;
      const fPct = (inputs.fatPct || 30) / 100;
      const totalPct = pPct + cPct + fPct;
      const adjP = pPct / totalPct;
      const adjC = cPct / totalPct;
      const adjF = fPct / totalPct;
      const proteinG = Math.round((cals * adjP) / 4);
      const carbG = Math.round((cals * adjC) / 4);
      const fatG = Math.round((cals * adjF) / 9);
      const actualCals = proteinG * 4 + carbG * 4 + fatG * 9;
      return {
        primary: { label: "Daily Macros", value: proteinG + "P / " + carbG + "C / " + fatG + "F (grams)" },
        details: [
          { label: "Protein", value: proteinG + "g (" + Math.round(adjP * 100) + "%)" },
          { label: "Carbs", value: carbG + "g (" + Math.round(adjC * 100) + "%)" },
          { label: "Fat", value: fatG + "g (" + Math.round(adjF * 100) + "%)" },
          { label: "Actual Calories", value: formatNumber(actualCals) + " cal" }
        ]
      };
    }`,
  [
    { q: "What is a good macro ratio?", a: "Common splits are 30/40/30 (balanced), 40/30/30 (high protein), or 20/50/30 (endurance athletes)." },
    { q: "How are grams calculated from percentages?", a: "Protein and carbs have 4 calories per gram, and fat has 9 calories per gram." }
  ],
  "Protein(g) = Calories x P% / 4. Carbs(g) = Calories x C% / 4. Fat(g) = Calories x F% / 9.",
  ["protein-intake-calculator"]
);

// --- GROUP D: REAL ESTATE INVESTING (31-40) ---


add(
  "rental-yield-calculator",
  "Rental Yield Calculator",
  "Calculate gross and net rental yield on investment property",
  "Finance", "finance", "$",
  ["rental yield", "property yield", "investment property return"],
  [
    '{ id: "propertyValue", label: "Property Value ($)", type: "number", defaultValue: 300000, min: 0, step: 10000 }',
    '{ id: "monthlyRent", label: "Monthly Rent ($)", type: "number", defaultValue: 2000, min: 0, step: 100 }',
    '{ id: "annualExpenses", label: "Annual Expenses ($)", type: "number", defaultValue: 6000, min: 0, step: 500 }',
    '{ id: "vacancyRate", label: "Vacancy Rate (%)", type: "number", defaultValue: 5, min: 0, max: 50, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const value = inputs.propertyValue || 300000;
      const rent = inputs.monthlyRent || 2000;
      const expenses = inputs.annualExpenses || 6000;
      const vacancy = (inputs.vacancyRate || 5) / 100;
      const annualRent = rent * 12;
      const effectiveRent = annualRent * (1 - vacancy);
      const grossYield = (annualRent / value) * 100;
      const netIncome = effectiveRent - expenses;
      const netYield = (netIncome / value) * 100;
      return {
        primary: { label: "Net Rental Yield", value: formatNumber(Math.round(netYield * 100) / 100) + "%" },
        details: [
          { label: "Gross Yield", value: formatNumber(Math.round(grossYield * 100) / 100) + "%" },
          { label: "Annual Gross Rent", value: "$" + formatNumber(Math.round(annualRent)) },
          { label: "Net Operating Income", value: "$" + formatNumber(Math.round(netIncome)) },
          { label: "Vacancy Loss", value: "$" + formatNumber(Math.round(annualRent * vacancy)) }
        ]
      };
    }`,
  [
    { q: "What is a good rental yield?", a: "A net yield of 5-8% is generally considered good for residential investment properties." },
    { q: "What is the difference between gross and net yield?", a: "Gross yield uses total rent, while net yield subtracts expenses and vacancy losses." }
  ],
  "Net Yield = (Annual Rent x (1 - Vacancy) - Expenses) / Property Value x 100",
  ["cap-rate-calculator"]
);

add(
  "cap-rate-calculator",
  "Cap Rate Calculator",
  "Calculate the capitalization rate for an investment property",
  "Finance", "finance", "$",
  ["cap rate", "capitalization rate", "property cap rate"],
  [
    '{ id: "propertyPrice", label: "Property Price ($)", type: "number", defaultValue: 400000, min: 0, step: 10000 }',
    '{ id: "grossIncome", label: "Annual Gross Income ($)", type: "number", defaultValue: 36000, min: 0, step: 1000 }',
    '{ id: "operatingExpenses", label: "Annual Operating Expenses ($)", type: "number", defaultValue: 10000, min: 0, step: 500 }',
    '{ id: "vacancyLoss", label: "Annual Vacancy Loss ($)", type: "number", defaultValue: 1800, min: 0, step: 100 }'
  ],
  `(inputs: Record<string, number>) => {
      const price = inputs.propertyPrice || 400000;
      const gross = inputs.grossIncome || 36000;
      const opex = inputs.operatingExpenses || 10000;
      const vacancy = inputs.vacancyLoss || 1800;
      const effectiveGross = gross - vacancy;
      const noi = effectiveGross - opex;
      const capRate = (noi / price) * 100;
      const grm = gross > 0 ? price / gross : 0;
      return {
        primary: { label: "Cap Rate", value: formatNumber(Math.round(capRate * 100) / 100) + "%" },
        details: [
          { label: "Net Operating Income", value: "$" + formatNumber(Math.round(noi)) },
          { label: "Effective Gross Income", value: "$" + formatNumber(Math.round(effectiveGross)) },
          { label: "Operating Expense Ratio", value: formatNumber(Math.round(opex / effectiveGross * 100)) + "%" },
          { label: "Gross Rent Multiplier", value: formatNumber(Math.round(grm * 10) / 10) }
        ]
      };
    }`,
  [
    { q: "What is a good cap rate?", a: "Cap rates of 5-10% are common. Higher rates indicate more potential return but also more risk." },
    { q: "How is cap rate different from ROI?", a: "Cap rate does not account for financing. ROI includes mortgage costs and equity buildup." }
  ],
  "Cap Rate = (Gross Income - Vacancy - Operating Expenses) / Property Price x 100",
  ["rental-yield-calculator"]
);

add(
  "rent-vs-buy-break-even-calculator",
  "Rent vs Buy Break Even Calculator",
  "Calculate how long it takes for buying to break even versus renting",
  "Finance", "finance", "$",
  ["rent vs buy", "break even buying", "rent or buy decision"],
  [
    '{ id: "homePrice", label: "Home Price ($)", type: "number", defaultValue: 350000, min: 0, step: 10000 }',
    '{ id: "downPaymentPct", label: "Down Payment (%)", type: "number", defaultValue: 20, min: 0, max: 100, step: 5 }',
    '{ id: "mortgageRate", label: "Mortgage Rate (%)", type: "number", defaultValue: 6.5, min: 0, max: 15, step: 0.1 }',
    '{ id: "monthlyRent", label: "Current Monthly Rent ($)", type: "number", defaultValue: 1800, min: 0, step: 100 }',
    '{ id: "homeAppreciation", label: "Annual Appreciation (%)", type: "number", defaultValue: 3, min: 0, max: 15, step: 0.5 }'
  ],
  `(inputs: Record<string, number>) => {
      const price = inputs.homePrice || 350000;
      const downPct = (inputs.downPaymentPct || 20) / 100;
      const rate = (inputs.mortgageRate || 6.5) / 100 / 12;
      const rent = inputs.monthlyRent || 1800;
      const appreciation = (inputs.homeAppreciation || 3) / 100;
      const down = price * downPct;
      const loan = price - down;
      const mortgagePmt = rate > 0 ? loan * rate / (1 - Math.pow(1 + rate, -360)) : loan / 360;
      const monthlyOwn = mortgagePmt + (price * 0.012 / 12) + (price * 0.005 / 12);
      let buyCost = down;
      let rentCost = 0;
      let breakEvenYear = 0;
      for (let yr = 1; yr <= 30; yr++) {
        buyCost += monthlyOwn * 12;
        rentCost += rent * 12 * Math.pow(1.03, yr - 1);
        const equity = price * Math.pow(1 + appreciation, yr) - loan * 0.95;
        if (rentCost > buyCost - equity && breakEvenYear === 0) {
          breakEvenYear = yr;
        }
      }
      const fiveYearEquity = price * Math.pow(1 + appreciation, 5) - price;
      return {
        primary: { label: "Break Even Point", value: breakEvenYear > 0 ? breakEvenYear + " years" : "30+ years" },
        details: [
          { label: "Monthly Mortgage Payment", value: "$" + formatNumber(Math.round(mortgagePmt)) },
          { label: "Monthly Ownership Cost", value: "$" + formatNumber(Math.round(monthlyOwn)) },
          { label: "Down Payment", value: "$" + formatNumber(Math.round(down)) },
          { label: "5-Year Appreciation", value: "$" + formatNumber(Math.round(fiveYearEquity)) }
        ]
      };
    }`,
  [
    { q: "How long until buying is cheaper than renting?", a: "Typically 5-7 years, depending on home prices, mortgage rates, and local rent increases." },
    { q: "What costs are included in ownership?", a: "This includes mortgage payment, property taxes (1.2%), and insurance/maintenance (0.5%)." }
  ],
  "Break Even = Year when cumulative rent exceeds cumulative ownership costs minus equity",
  ["rental-yield-calculator"]
);

add(
  "property-flip-profit-calculator",
  "Property Flip Profit Calculator",
  "Estimate profit from buying, renovating, and selling a property",
  "Finance", "finance", "$",
  ["house flip", "property flip profit", "real estate flip"],
  [
    '{ id: "purchasePrice", label: "Purchase Price ($)", type: "number", defaultValue: 200000, min: 0, step: 10000 }',
    '{ id: "rehabCost", label: "Renovation Cost ($)", type: "number", defaultValue: 40000, min: 0, step: 5000 }',
    '{ id: "afterRepairValue", label: "After Repair Value ($)", type: "number", defaultValue: 300000, min: 0, step: 10000 }',
    '{ id: "holdingMonths", label: "Holding Period (months)", type: "number", defaultValue: 4, min: 1, max: 24, step: 1 }',
    '{ id: "closingCostPct", label: "Closing Costs (%)", type: "number", defaultValue: 8, min: 0, max: 15, step: 0.5 }'
  ],
  `(inputs: Record<string, number>) => {
      const purchase = inputs.purchasePrice || 200000;
      const rehab = inputs.rehabCost || 40000;
      const arv = inputs.afterRepairValue || 300000;
      const months = inputs.holdingMonths || 4;
      const closingPct = (inputs.closingCostPct || 8) / 100;
      const closingCosts = arv * closingPct;
      const holdingCosts = (purchase * 0.08 / 12) * months;
      const totalInvestment = purchase + rehab + closingCosts + holdingCosts;
      const profit = arv - totalInvestment;
      const roi = (profit / totalInvestment) * 100;
      const annualizedRoi = roi * (12 / months);
      return {
        primary: { label: "Estimated Profit", value: "$" + formatNumber(Math.round(profit)) },
        details: [
          { label: "Total Investment", value: "$" + formatNumber(Math.round(totalInvestment)) },
          { label: "Closing Costs", value: "$" + formatNumber(Math.round(closingCosts)) },
          { label: "Holding Costs", value: "$" + formatNumber(Math.round(holdingCosts)) },
          { label: "ROI", value: formatNumber(Math.round(roi * 10) / 10) + "%" }
        ]
      };
    }`,
  [
    { q: "What is the 70% rule in house flipping?", a: "Do not pay more than 70% of the after repair value minus renovation costs to ensure profitability." },
    { q: "What are holding costs?", a: "Holding costs include mortgage payments, insurance, taxes, and utilities during the renovation period." }
  ],
  "Profit = After Repair Value - Purchase - Rehab - Closing Costs - Holding Costs",
  ["rental-yield-calculator"]
);

add(
  "rental-cash-flow-calculator",
  "Rental Cash Flow Calculator",
  "Calculate monthly cash flow from rental property investment",
  "Finance", "finance", "$",
  ["rental cash flow", "investment property cash flow", "rental income"],
  [
    '{ id: "monthlyRent", label: "Monthly Rent ($)", type: "number", defaultValue: 2200, min: 0, step: 100 }',
    '{ id: "mortgagePayment", label: "Monthly Mortgage ($)", type: "number", defaultValue: 1400, min: 0, step: 50 }',
    '{ id: "propertyTax", label: "Monthly Property Tax ($)", type: "number", defaultValue: 250, min: 0, step: 25 }',
    '{ id: "insurance", label: "Monthly Insurance ($)", type: "number", defaultValue: 120, min: 0, step: 10 }',
    '{ id: "maintenance", label: "Monthly Maintenance ($)", type: "number", defaultValue: 150, min: 0, step: 25 }'
  ],
  `(inputs: Record<string, number>) => {
      const rent = inputs.monthlyRent || 2200;
      const mortgage = inputs.mortgagePayment || 1400;
      const tax = inputs.propertyTax || 250;
      const insurance = inputs.insurance || 120;
      const maint = inputs.maintenance || 150;
      const totalExpenses = mortgage + tax + insurance + maint;
      const cashFlow = rent - totalExpenses;
      const annualCashFlow = cashFlow * 12;
      const expenseRatio = rent > 0 ? (totalExpenses / rent) * 100 : 0;
      const vacancyReserve = rent * 0.08;
      const adjustedCashFlow = cashFlow - vacancyReserve;
      return {
        primary: { label: "Monthly Cash Flow", value: "$" + formatNumber(Math.round(cashFlow)) },
        details: [
          { label: "Total Monthly Expenses", value: "$" + formatNumber(Math.round(totalExpenses)) },
          { label: "Annual Cash Flow", value: "$" + formatNumber(Math.round(annualCashFlow)) },
          { label: "Expense Ratio", value: formatNumber(Math.round(expenseRatio)) + "%" },
          { label: "After Vacancy Reserve", value: "$" + formatNumber(Math.round(adjustedCashFlow)) + "/mo" }
        ]
      };
    }`,
  [
    { q: "What is good cash flow for a rental?", a: "Positive cash flow of at least $100-200 per month per unit is considered a baseline for viability." },
    { q: "Should I set aside vacancy reserves?", a: "Yes, budget 5-10% of rent for vacancy and another 5-10% for repairs and maintenance reserves." }
  ],
  "Cash Flow = Monthly Rent - (Mortgage + Tax + Insurance + Maintenance)",
  ["rental-yield-calculator"]
);

add(
  "vacancy-rate-impact-calculator",
  "Vacancy Rate Impact Calculator",
  "See how vacancy rates affect your rental property returns",
  "Finance", "finance", "$",
  ["vacancy rate", "rental vacancy", "vacancy impact"],
  [
    '{ id: "monthlyRent", label: "Monthly Rent ($)", type: "number", defaultValue: 2000, min: 0, step: 100 }',
    '{ id: "vacancyRate", label: "Vacancy Rate (%)", type: "number", defaultValue: 8, min: 0, max: 50, step: 1 }',
    '{ id: "monthlyExpenses", label: "Monthly Fixed Expenses ($)", type: "number", defaultValue: 1200, min: 0, step: 100 }',
    '{ id: "propertyValue", label: "Property Value ($)", type: "number", defaultValue: 250000, min: 0, step: 10000 }'
  ],
  `(inputs: Record<string, number>) => {
      const rent = inputs.monthlyRent || 2000;
      const vacancy = (inputs.vacancyRate || 8) / 100;
      const expenses = inputs.monthlyExpenses || 1200;
      const value = inputs.propertyValue || 250000;
      const annualGross = rent * 12;
      const vacancyLoss = annualGross * vacancy;
      const effectiveIncome = annualGross - vacancyLoss;
      const annualExpenses = expenses * 12;
      const netIncome = effectiveIncome - annualExpenses;
      const netWithNoVacancy = annualGross - annualExpenses;
      const incomeLost = netWithNoVacancy - netIncome;
      const capRate = (netIncome / value) * 100;
      return {
        primary: { label: "Annual Vacancy Loss", value: "$" + formatNumber(Math.round(vacancyLoss)) },
        details: [
          { label: "Effective Annual Income", value: "$" + formatNumber(Math.round(effectiveIncome)) },
          { label: "Net Income (with vacancy)", value: "$" + formatNumber(Math.round(netIncome)) },
          { label: "Net Income (no vacancy)", value: "$" + formatNumber(Math.round(netWithNoVacancy)) },
          { label: "Cap Rate", value: formatNumber(Math.round(capRate * 100) / 100) + "%" }
        ]
      };
    }`,
  [
    { q: "What is a normal vacancy rate?", a: "Residential vacancy rates typically range from 5-10%. Urban areas may be lower, rural areas higher." },
    { q: "How does vacancy affect returns?", a: "Each percent of vacancy directly reduces gross income. An 8% vacancy on $2000/mo rent loses $1920/yr." }
  ],
  "Vacancy Loss = Annual Rent x Vacancy Rate. Net = Effective Income - Expenses.",
  ["rental-cash-flow-calculator"]
);

add(
  "real-estate-commission-calculator",
  "Real Estate Commission Calculator",
  "Calculate agent commission and net proceeds from property sale",
  "Finance", "finance", "$",
  ["real estate commission", "agent commission", "seller proceeds"],
  [
    '{ id: "salePrice", label: "Sale Price ($)", type: "number", defaultValue: 400000, min: 0, step: 10000 }',
    '{ id: "commissionRate", label: "Total Commission Rate (%)", type: "number", defaultValue: 5, min: 0, max: 10, step: 0.25 }',
    '{ id: "mortgageBalance", label: "Remaining Mortgage ($)", type: "number", defaultValue: 250000, min: 0, step: 5000 }',
    '{ id: "otherClosingCosts", label: "Other Closing Costs ($)", type: "number", defaultValue: 5000, min: 0, step: 500 }'
  ],
  `(inputs: Record<string, number>) => {
      const sale = inputs.salePrice || 400000;
      const commRate = (inputs.commissionRate || 5) / 100;
      const mortgage = inputs.mortgageBalance || 250000;
      const otherCosts = inputs.otherClosingCosts || 5000;
      const commission = sale * commRate;
      const listingAgent = commission / 2;
      const buyerAgent = commission / 2;
      const totalCosts = commission + otherCosts;
      const netProceeds = sale - mortgage - totalCosts;
      return {
        primary: { label: "Net Proceeds", value: "$" + formatNumber(Math.round(netProceeds)) },
        details: [
          { label: "Total Commission", value: "$" + formatNumber(Math.round(commission)) },
          { label: "Listing Agent Share", value: "$" + formatNumber(Math.round(listingAgent)) },
          { label: "Buyer Agent Share", value: "$" + formatNumber(Math.round(buyerAgent)) },
          { label: "Total Closing Costs", value: "$" + formatNumber(Math.round(totalCosts)) }
        ]
      };
    }`,
  [
    { q: "What is the typical real estate commission?", a: "Total commission is typically 5-6% of the sale price, split between listing and buyer agents." },
    { q: "Who pays the real estate commission?", a: "Traditionally the seller pays, but recent changes allow for more negotiation on commission structure." }
  ],
  "Net Proceeds = Sale Price - Mortgage Balance - Commission - Closing Costs",
  ["closing-cost-estimator-calculator"]
);

add(
  "closing-cost-estimator-calculator",
  "Closing Cost Estimator Calculator",
  "Estimate total buyer and seller closing costs for a property transaction",
  "Finance", "finance", "$",
  ["closing costs", "buyer closing costs", "seller closing costs"],
  [
    '{ id: "homePrice", label: "Home Price ($)", type: "number", defaultValue: 350000, min: 0, step: 10000 }',
    '{ id: "loanAmount", label: "Loan Amount ($)", type: "number", defaultValue: 280000, min: 0, step: 10000 }',
    '{ id: "isBuyer", label: "Buyer(1) or Seller(0)", type: "number", defaultValue: 1, min: 0, max: 1, step: 1 }',
    '{ id: "state", label: "State Transfer Tax Rate (%)", type: "number", defaultValue: 0.5, min: 0, max: 3, step: 0.1 }'
  ],
  `(inputs: Record<string, number>) => {
      const price = inputs.homePrice || 350000;
      const loan = inputs.loanAmount || 280000;
      const isBuyer = inputs.isBuyer === 1;
      const transferRate = (inputs.state || 0.5) / 100;
      let costs: Record<string, number> = {};
      if (isBuyer) {
        costs = {
          origination: loan * 0.01,
          appraisal: 500,
          inspection: 400,
          titleInsurance: price * 0.005,
          escrow: 1500,
          recording: 200,
          prepaidTax: (price * 0.012 / 12) * 3,
          prepaidInsurance: 1200,
        };
      } else {
        costs = {
          transferTax: price * transferRate,
          titleInsurance: price * 0.003,
          escrow: 1500,
          recording: 150,
          homeWarranty: 500,
        };
      }
      const total = Object.values(costs).reduce((a, b) => a + b, 0);
      const pctOfPrice = (total / price) * 100;
      return {
        primary: { label: (isBuyer ? "Buyer" : "Seller") + " Closing Costs", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "As % of Home Price", value: formatNumber(Math.round(pctOfPrice * 10) / 10) + "%" },
          { label: isBuyer ? "Loan Origination" : "Transfer Tax", value: "$" + formatNumber(Math.round(isBuyer ? costs.origination : costs.transferTax)) },
          { label: "Title Insurance", value: "$" + formatNumber(Math.round(costs.titleInsurance)) },
          { label: "Escrow Fees", value: "$" + formatNumber(Math.round(costs.escrow)) }
        ]
      };
    }`,
  [
    { q: "How much are typical closing costs?", a: "Buyers typically pay 2-5% of the home price. Sellers usually pay 1-3% plus agent commission." },
    { q: "Can closing costs be negotiated?", a: "Yes, many fees are negotiable. Sellers can also offer closing cost credits to buyers." }
  ],
  "Total = Sum of applicable fees (origination, title, escrow, taxes, insurance, recording)",
  ["real-estate-commission-calculator"]
);

add(
  "home-equity-calculator",
  "Home Equity Calculator",
  "Calculate your current home equity based on value and mortgage balance",
  "Finance", "finance", "$",
  ["home equity", "equity calculator", "house equity"],
  [
    '{ id: "homeValue", label: "Current Home Value ($)", type: "number", defaultValue: 400000, min: 0, step: 10000 }',
    '{ id: "mortgageBalance", label: "Mortgage Balance ($)", type: "number", defaultValue: 280000, min: 0, step: 5000 }',
    '{ id: "otherLiens", label: "Other Liens/Loans ($)", type: "number", defaultValue: 0, min: 0, step: 1000 }',
    '{ id: "originalPrice", label: "Original Purchase Price ($)", type: "number", defaultValue: 350000, min: 0, step: 10000 }'
  ],
  `(inputs: Record<string, number>) => {
      const value = inputs.homeValue || 400000;
      const mortgage = inputs.mortgageBalance || 280000;
      const liens = inputs.otherLiens || 0;
      const original = inputs.originalPrice || 350000;
      const equity = value - mortgage - liens;
      const equityPercent = (equity / value) * 100;
      const ltv = ((mortgage + liens) / value) * 100;
      const appreciation = value - original;
      const borrowableEquity = Math.max(0, value * 0.80 - mortgage - liens);
      return {
        primary: { label: "Home Equity", value: "$" + formatNumber(Math.round(equity)) },
        details: [
          { label: "Equity Percentage", value: formatNumber(Math.round(equityPercent * 10) / 10) + "%" },
          { label: "Loan-to-Value (LTV)", value: formatNumber(Math.round(ltv * 10) / 10) + "%" },
          { label: "Total Appreciation", value: "$" + formatNumber(Math.round(appreciation)) },
          { label: "Borrowable Equity (80% LTV)", value: "$" + formatNumber(Math.round(borrowableEquity)) }
        ]
      };
    }`,
  [
    { q: "What is home equity?", a: "Home equity is the difference between your home market value and the total amount you owe on it." },
    { q: "How much equity can I borrow against?", a: "Most lenders allow borrowing up to 80% of your home value minus existing mortgage balance." }
  ],
  "Equity = Home Value - Mortgage Balance - Other Liens",
  ["heloc-payment-calculator"]
);

add(
  "heloc-payment-calculator",
  "HELOC Payment Calculator",
  "Estimate home equity line of credit payments and interest costs",
  "Finance", "finance", "$",
  ["HELOC payment", "home equity line of credit", "HELOC calculator"],
  [
    '{ id: "creditLine", label: "HELOC Credit Line ($)", type: "number", defaultValue: 50000, min: 0, step: 5000 }',
    '{ id: "amountDrawn", label: "Amount Drawn ($)", type: "number", defaultValue: 30000, min: 0, step: 1000 }',
    '{ id: "interestRate", label: "Interest Rate (%)", type: "number", defaultValue: 8.5, min: 0, max: 20, step: 0.1 }',
    '{ id: "repaymentYears", label: "Repayment Period (years)", type: "number", defaultValue: 10, min: 1, max: 30, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const line = inputs.creditLine || 50000;
      const drawn = Math.min(inputs.amountDrawn || 30000, line);
      const rate = (inputs.interestRate || 8.5) / 100 / 12;
      const years = inputs.repaymentYears || 10;
      const months = years * 12;
      const interestOnly = drawn * rate;
      const fullPayment = rate > 0 ? drawn * rate / (1 - Math.pow(1 + rate, -months)) : drawn / months;
      const totalInterest = fullPayment * months - drawn;
      const totalCost = drawn + totalInterest;
      const availableCredit = line - drawn;
      return {
        primary: { label: "Monthly Payment (P&I)", value: "$" + formatNumber(Math.round(fullPayment)) },
        details: [
          { label: "Interest-Only Payment", value: "$" + formatNumber(Math.round(interestOnly)) },
          { label: "Total Interest Cost", value: "$" + formatNumber(Math.round(totalInterest)) },
          { label: "Total Repayment", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Available Credit", value: "$" + formatNumber(Math.round(availableCredit)) }
        ]
      };
    }`,
  [
    { q: "How does a HELOC work?", a: "A HELOC is a revolving credit line secured by your home. You only pay interest on the amount drawn." },
    { q: "What is the difference between HELOC and home equity loan?", a: "A HELOC is revolving credit with variable rates. A home equity loan is a lump sum with fixed rates." }
  ],
  "Payment = Drawn Amount x Rate / (1 - (1 + Rate)^-Months)",
  ["home-equity-calculator"]
);

// --- GROUP E: PERSONAL WELLNESS & FITNESS (41-50) ---


add(
  "vo2-max-calculator",
  "VO2 Max Calculator",
  "Estimate your VO2 max from running performance data",
  "Health", "health", "H",
  ["VO2 max", "aerobic fitness", "cardio fitness level"],
  [
    '{ id: "age", label: "Age", type: "number", defaultValue: 30, min: 15, max: 80, step: 1 }',
    '{ id: "restingHR", label: "Resting Heart Rate (bpm)", type: "number", defaultValue: 65, min: 30, max: 120, step: 1 }',
    '{ id: "maxHR", label: "Max Heart Rate (bpm)", type: "number", defaultValue: 190, min: 120, max: 220, step: 1 }',
    '{ id: "runTimeMins", label: "1.5 Mile Run Time (minutes)", type: "number", defaultValue: 12, min: 6, max: 30, step: 0.5 }'
  ],
  `(inputs: Record<string, number>) => {
      const age = inputs.age || 30;
      const rhr = inputs.restingHR || 65;
      const mhr = inputs.maxHR || 190;
      const runTime = inputs.runTimeMins || 12;
      const vo2Formula = 3.5 + 483 / runTime;
      const vo2Uth = 15.3 * (mhr / rhr);
      const vo2Avg = (vo2Formula + vo2Uth) / 2;
      let fitnessLevel = "Poor";
      if (vo2Avg > 50) fitnessLevel = "Excellent";
      else if (vo2Avg > 42) fitnessLevel = "Good";
      else if (vo2Avg > 35) fitnessLevel = "Average";
      else if (vo2Avg > 28) fitnessLevel = "Below Average";
      const fitnessAge = Math.round(age - (vo2Avg - 35) * 0.5);
      return {
        primary: { label: "Estimated VO2 Max", value: formatNumber(Math.round(vo2Avg * 10) / 10) + " ml/kg/min" },
        details: [
          { label: "Fitness Level", value: fitnessLevel },
          { label: "Run-Based Estimate", value: formatNumber(Math.round(vo2Formula * 10) / 10) + " ml/kg/min" },
          { label: "Heart Rate Estimate", value: formatNumber(Math.round(vo2Uth * 10) / 10) + " ml/kg/min" },
          { label: "Fitness Age", value: String(fitnessAge) }
        ]
      };
    }`,
  [
    { q: "What is VO2 max?", a: "VO2 max is the maximum rate of oxygen consumption during exercise, measuring aerobic fitness." },
    { q: "What is a good VO2 max score?", a: "For adults 30-39, above 42 is good for men and above 35 is good for women." }
  ],
  "VO2 Max = Average of (3.5 + 483/RunTime) and (15.3 x MaxHR/RestHR)",
  ["heart-rate-zone-calculator"]
);

add(
  "heart-rate-zone-calculator",
  "Heart Rate Zone Calculator",
  "Calculate training heart rate zones based on your max heart rate",
  "Health", "health", "H",
  ["heart rate zones", "training zones", "heart rate training"],
  [
    '{ id: "age", label: "Age", type: "number", defaultValue: 30, min: 15, max: 80, step: 1 }',
    '{ id: "restingHR", label: "Resting Heart Rate (bpm)", type: "number", defaultValue: 65, min: 30, max: 120, step: 1 }',
    '{ id: "maxHR", label: "Max Heart Rate (bpm, 0=estimate)", type: "number", defaultValue: 0, min: 0, max: 220, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const age = inputs.age || 30;
      const rhr = inputs.restingHR || 65;
      let mhr = inputs.maxHR || 0;
      if (mhr === 0) mhr = 220 - age;
      const hrr = mhr - rhr;
      const zone1Low = Math.round(rhr + hrr * 0.50);
      const zone1High = Math.round(rhr + hrr * 0.60);
      const zone2Low = Math.round(rhr + hrr * 0.60);
      const zone2High = Math.round(rhr + hrr * 0.70);
      const zone3Low = Math.round(rhr + hrr * 0.70);
      const zone3High = Math.round(rhr + hrr * 0.80);
      const zone4Low = Math.round(rhr + hrr * 0.80);
      const zone4High = Math.round(rhr + hrr * 0.90);
      const zone5Low = Math.round(rhr + hrr * 0.90);
      return {
        primary: { label: "Max Heart Rate", value: mhr + " bpm" },
        details: [
          { label: "Zone 1 (Warm-up)", value: zone1Low + "-" + zone1High + " bpm" },
          { label: "Zone 2 (Fat Burn)", value: zone2Low + "-" + zone2High + " bpm" },
          { label: "Zone 3 (Cardio)", value: zone3Low + "-" + zone3High + " bpm" },
          { label: "Zone 4 (Threshold)", value: zone4Low + "-" + zone4High + " bpm" }
        ]
      };
    }`,
  [
    { q: "How are heart rate zones calculated?", a: "Zones use the Karvonen method based on heart rate reserve (max HR minus resting HR)." },
    { q: "Which zone is best for fat burning?", a: "Zone 2 (60-70% intensity) is optimal for fat burning during longer duration exercise." }
  ],
  "Zone HR = Resting HR + (Max HR - Resting HR) x Zone Percentage",
  ["vo2-max-calculator"]
);

add(
  "body-fat-percentage-calculator",
  "Body Fat Percentage Calculator",
  "Estimate body fat percentage from body measurements",
  "Health", "health", "H",
  ["body fat percentage", "body fat calculator", "body composition"],
  [
    '{ id: "waist", label: "Waist Circumference (inches)", type: "number", defaultValue: 34, min: 20, max: 60, step: 0.5 }',
    '{ id: "neck", label: "Neck Circumference (inches)", type: "number", defaultValue: 15, min: 10, max: 25, step: 0.5 }',
    '{ id: "height", label: "Height (inches)", type: "number", defaultValue: 70, min: 48, max: 84, step: 1 }',
    '{ id: "weight", label: "Weight (lbs)", type: "number", defaultValue: 180, min: 80, max: 400, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const waist = inputs.waist || 34;
      const neck = inputs.neck || 15;
      const height = inputs.height || 70;
      const weight = inputs.weight || 180;
      const bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
      const clampedBF = Math.max(3, Math.min(50, bodyFat));
      const fatMass = weight * (clampedBF / 100);
      const leanMass = weight - fatMass;
      let category = "Obese";
      if (clampedBF < 6) category = "Essential Fat";
      else if (clampedBF < 14) category = "Athletic";
      else if (clampedBF < 18) category = "Fit";
      else if (clampedBF < 25) category = "Average";
      return {
        primary: { label: "Body Fat Percentage", value: formatNumber(Math.round(clampedBF * 10) / 10) + "%" },
        details: [
          { label: "Category", value: category },
          { label: "Fat Mass", value: formatNumber(Math.round(fatMass * 10) / 10) + " lbs" },
          { label: "Lean Mass", value: formatNumber(Math.round(leanMass * 10) / 10) + " lbs" },
          { label: "Fat-to-Lean Ratio", value: formatNumber(Math.round(fatMass / leanMass * 100) / 100) }
        ]
      };
    }`,
  [
    { q: "How accurate is this body fat estimate?", a: "The US Navy method is accurate within 3-4%. For precise measurements, use DEXA or hydrostatic weighing." },
    { q: "What is a healthy body fat percentage?", a: "For men, 10-20% is healthy. For women, 18-28% is considered a healthy range." }
  ],
  "BF% = 86.01 x log10(Waist - Neck) - 70.041 x log10(Height) + 36.76 (US Navy method)",
  ["lean-body-mass-calculator"]
);

add(
  "lean-body-mass-calculator",
  "Lean Body Mass Calculator",
  "Calculate your lean body mass excluding fat tissue",
  "Health", "health", "H",
  ["lean body mass", "LBM calculator", "fat free mass"],
  [
    '{ id: "weight", label: "Body Weight (lbs)", type: "number", defaultValue: 180, min: 50, max: 500, step: 1 }',
    '{ id: "bodyFatPct", label: "Body Fat (%)", type: "number", defaultValue: 20, min: 3, max: 50, step: 0.5 }',
    '{ id: "height", label: "Height (inches)", type: "number", defaultValue: 70, min: 48, max: 84, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const weight = inputs.weight || 180;
      const bf = (inputs.bodyFatPct || 20) / 100;
      const height = inputs.height || 70;
      const lbm = weight * (1 - bf);
      const fatMass = weight * bf;
      const weightKg = weight * 0.453592;
      const heightM = height * 0.0254;
      const ffmi = (lbm * 0.453592) / (heightM * heightM);
      const bmi = weightKg / (heightM * heightM);
      return {
        primary: { label: "Lean Body Mass", value: formatNumber(Math.round(lbm * 10) / 10) + " lbs" },
        details: [
          { label: "Fat Mass", value: formatNumber(Math.round(fatMass * 10) / 10) + " lbs" },
          { label: "Fat-Free Mass Index", value: formatNumber(Math.round(ffmi * 10) / 10) },
          { label: "BMI", value: formatNumber(Math.round(bmi * 10) / 10) },
          { label: "Lean Mass Percentage", value: formatNumber(Math.round((1 - bf) * 1000) / 10) + "%" }
        ]
      };
    }`,
  [
    { q: "What is lean body mass?", a: "Lean body mass is your total weight minus fat tissue. It includes muscle, bone, organs, and water." },
    { q: "What is FFMI?", a: "Fat-Free Mass Index measures lean mass relative to height. A score above 25 is exceptional for natural athletes." }
  ],
  "LBM = Weight x (1 - Body Fat %). FFMI = LBM(kg) / Height(m)^2.",
  ["body-fat-percentage-calculator"]
);

add(
  "daily-step-goal-calculator",
  "Daily Step Goal Calculator",
  "Calculate calories burned from daily steps walked",
  "Health", "health", "H",
  ["daily steps", "step counter calories", "walking calories"],
  [
    '{ id: "steps", label: "Daily Steps", type: "number", defaultValue: 10000, min: 0, max: 50000, step: 500 }',
    '{ id: "weight", label: "Body Weight (lbs)", type: "number", defaultValue: 170, min: 50, max: 400, step: 1 }',
    '{ id: "strideLength", label: "Stride Length (inches)", type: "number", defaultValue: 30, min: 20, max: 40, step: 1 }',
    '{ id: "calorieGoal", label: "Daily Calorie Burn Goal", type: "number", defaultValue: 400, min: 100, max: 2000, step: 50 }'
  ],
  `(inputs: Record<string, number>) => {
      const steps = inputs.steps || 10000;
      const weight = inputs.weight || 170;
      const stride = inputs.strideLength || 30;
      const calGoal = inputs.calorieGoal || 400;
      const distanceMiles = (steps * stride) / 63360;
      const caloriesBurned = Math.round(distanceMiles * weight * 0.57);
      const stepsNeeded = calGoal > 0 ? Math.round((calGoal / (weight * 0.57)) * 63360 / stride) : 0;
      const minutesWalking = Math.round(steps / 100);
      return {
        primary: { label: "Calories Burned", value: formatNumber(caloriesBurned) + " cal" },
        details: [
          { label: "Distance Walked", value: formatNumber(Math.round(distanceMiles * 100) / 100) + " miles" },
          { label: "Walking Time", value: minutesWalking + " minutes" },
          { label: "Steps for Calorie Goal", value: formatNumber(stepsNeeded) },
          { label: "Calories Per 1000 Steps", value: formatNumber(Math.round(caloriesBurned / steps * 1000)) }
        ]
      };
    }`,
  [
    { q: "How many steps should I walk daily?", a: "10000 steps per day is a popular goal. Studies show health benefits start at around 7000 steps." },
    { q: "How many calories does walking burn?", a: "Walking burns roughly 0.04-0.06 calories per step depending on body weight and walking speed." }
  ],
  "Calories = Distance(miles) x Weight(lbs) x 0.57. Distance = Steps x Stride / 63360.",
  ["calorie-deficit-calculator"]
);

add(
  "recovery-time-calculator",
  "Recovery Time Calculator",
  "Estimate workout recovery time based on exercise intensity",
  "Health", "health", "H",
  ["recovery time", "workout recovery", "exercise recovery"],
  [
    '{ id: "exerciseDuration", label: "Exercise Duration (minutes)", type: "number", defaultValue: 60, min: 10, max: 300, step: 10 }',
    '{ id: "intensity", label: "Intensity (1=Light, 5=Max)", type: "number", defaultValue: 3, min: 1, max: 5, step: 1 }',
    '{ id: "age", label: "Age", type: "number", defaultValue: 30, min: 15, max: 80, step: 1 }',
    '{ id: "fitnessLevel", label: "Fitness Level (1=Beginner, 5=Elite)", type: "number", defaultValue: 3, min: 1, max: 5, step: 1 }',
    '{ id: "sleepHours", label: "Sleep Hours Per Night", type: "number", defaultValue: 7, min: 3, max: 12, step: 0.5 }'
  ],
  `(inputs: Record<string, number>) => {
      const duration = inputs.exerciseDuration || 60;
      const intensity = inputs.intensity || 3;
      const age = inputs.age || 30;
      const fitness = inputs.fitnessLevel || 3;
      const sleep = inputs.sleepHours || 7;
      const baseHours = duration / 60 * intensity * 8;
      const ageFactor = age > 40 ? 1 + (age - 40) * 0.02 : 1.0;
      const fitnessFactor = 1.3 - (fitness - 1) * 0.1;
      const sleepFactor = sleep >= 7 ? 1.0 : 1 + (7 - sleep) * 0.1;
      const recoveryHours = baseHours * ageFactor * fitnessFactor * sleepFactor;
      const recoveryDays = Math.round(recoveryHours / 24 * 10) / 10;
      const nextWorkoutHours = Math.round(recoveryHours * 0.75);
      return {
        primary: { label: "Full Recovery Time", value: formatNumber(Math.round(recoveryHours)) + " hours" },
        details: [
          { label: "Recovery Days", value: formatNumber(recoveryDays) + " days" },
          { label: "Light Activity After", value: nextWorkoutHours + " hours" },
          { label: "Age Factor", value: formatNumber(Math.round(ageFactor * 100) / 100) + "x" },
          { label: "Sleep Impact", value: sleep >= 7 ? "Optimal" : "Suboptimal - recovery slowed" }
        ]
      };
    }`,
  [
    { q: "How long should I rest between workouts?", a: "Light workouts need 24 hours recovery. Intense sessions may need 48-72 hours for the same muscle group." },
    { q: "Does sleep affect recovery?", a: "Yes, adequate sleep of 7-9 hours significantly speeds muscle recovery and reduces injury risk." }
  ],
  "Recovery = (Duration/60 x Intensity x 8) x Age Factor x Fitness Factor x Sleep Factor",
  ["heart-rate-zone-calculator"]
);

add(
  "sleep-cycle-calculator",
  "Sleep Cycle Calculator",
  "Calculate optimal bedtime and wake time based on sleep cycles",
  "Health", "health", "H",
  ["sleep cycle", "bedtime calculator", "optimal sleep time"],
  [
    '{ id: "wakeUpHour", label: "Wake Up Time (hour, 24h)", type: "number", defaultValue: 7, min: 0, max: 23, step: 1 }',
    '{ id: "wakeUpMinute", label: "Wake Up Minutes", type: "number", defaultValue: 0, min: 0, max: 59, step: 15 }',
    '{ id: "sleepCycles", label: "Desired Sleep Cycles", type: "number", defaultValue: 5, min: 3, max: 7, step: 1 }',
    '{ id: "fallAsleepMins", label: "Time to Fall Asleep (min)", type: "number", defaultValue: 15, min: 5, max: 60, step: 5 }'
  ],
  `(inputs: Record<string, number>) => {
      const wakeH = inputs.wakeUpHour || 7;
      const wakeM = inputs.wakeUpMinute || 0;
      const cycles = inputs.sleepCycles || 5;
      const fallAsleep = inputs.fallAsleepMins || 15;
      const cycleMinutes = 90;
      const sleepMinutes = cycles * cycleMinutes;
      const totalMinutes = sleepMinutes + fallAsleep;
      const wakeTotal = wakeH * 60 + wakeM;
      let bedTotal = wakeTotal - totalMinutes;
      if (bedTotal < 0) bedTotal += 1440;
      const bedH = Math.floor(bedTotal / 60);
      const bedM = bedTotal % 60;
      const sleepHours = sleepMinutes / 60;
      const formatTime = (h: number, m: number) => {
        const ampm = h >= 12 ? "PM" : "AM";
        const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
        const dm = m < 10 ? "0" + m : String(m);
        return dh + ":" + dm + " " + ampm;
      };
      return {
        primary: { label: "Ideal Bedtime", value: formatTime(bedH, bedM) },
        details: [
          { label: "Total Sleep Time", value: sleepHours + " hours" },
          { label: "Sleep Cycles", value: String(cycles) + " cycles" },
          { label: "Wake Up Time", value: formatTime(wakeH, wakeM) },
          { label: "Time in Bed", value: formatNumber(Math.round(totalMinutes)) + " minutes" }
        ]
      };
    }`,
  [
    { q: "How long is one sleep cycle?", a: "One complete sleep cycle lasts about 90 minutes, cycling through light, deep, and REM sleep stages." },
    { q: "How many sleep cycles do I need?", a: "Most adults need 4-6 cycles (6-9 hours). Waking between cycles helps you feel more refreshed." }
  ],
  "Bedtime = Wake Time - (Cycles x 90 min) - Time to Fall Asleep",
  []
);

add(
  "stress-level-calculator",
  "Stress Level Calculator",
  "Quantify your stress level based on lifestyle factors",
  "Health", "health", "H",
  ["stress level", "stress score", "stress assessment"],
  [
    '{ id: "workHours", label: "Work Hours Per Week", type: "number", defaultValue: 40, min: 0, max: 80, step: 5 }',
    '{ id: "sleepHours", label: "Sleep Hours Per Night", type: "number", defaultValue: 7, min: 3, max: 12, step: 0.5 }',
    '{ id: "exerciseDays", label: "Exercise Days Per Week", type: "number", defaultValue: 3, min: 0, max: 7, step: 1 }',
    '{ id: "socialScore", label: "Social Support (1-10)", type: "number", defaultValue: 6, min: 1, max: 10, step: 1 }',
    '{ id: "lifeEvents", label: "Major Life Events (past year)", type: "number", defaultValue: 1, min: 0, max: 10, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const work = inputs.workHours || 40;
      const sleep = inputs.sleepHours || 7;
      const exercise = inputs.exerciseDays || 3;
      const social = inputs.socialScore || 6;
      const events = inputs.lifeEvents || 1;
      const workStress = Math.min(30, Math.max(0, (work - 35) * 1.5));
      const sleepStress = Math.min(20, Math.max(0, (7 - sleep) * 8));
      const exerciseRelief = Math.min(15, exercise * 3);
      const socialRelief = Math.min(15, social * 1.5);
      const eventStress = Math.min(30, events * 8);
      const rawScore = workStress + sleepStress + eventStress - exerciseRelief - socialRelief;
      const stressScore = Math.max(0, Math.min(100, Math.round(rawScore + 30)));
      let level = "Low";
      if (stressScore > 70) level = "High";
      else if (stressScore > 50) level = "Moderate-High";
      else if (stressScore > 30) level = "Moderate";
      return {
        primary: { label: "Stress Score", value: stressScore + "/100 (" + level + ")" },
        details: [
          { label: "Work Stress Factor", value: formatNumber(Math.round(workStress)) + "/30" },
          { label: "Sleep Deficit Factor", value: formatNumber(Math.round(sleepStress)) + "/20" },
          { label: "Exercise Relief", value: "-" + formatNumber(Math.round(exerciseRelief)) },
          { label: "Life Events Impact", value: formatNumber(Math.round(eventStress)) + "/30" }
        ]
      };
    }`,
  [
    { q: "How is the stress score calculated?", a: "It combines work hours, sleep quality, exercise, social support, and life events into a 0-100 score." },
    { q: "How can I reduce my stress score?", a: "Regular exercise, 7+ hours of sleep, and strong social connections are the most effective stress reducers." }
  ],
  "Score = Work Stress + Sleep Stress + Event Stress - Exercise Relief - Social Relief",
  []
);

add(
  "flexibility-age-calculator",
  "Flexibility Age Calculator",
  "Estimate your fitness age based on flexibility and mobility metrics",
  "Health", "health", "H",
  ["flexibility age", "fitness age", "mobility assessment"],
  [
    '{ id: "actualAge", label: "Actual Age", type: "number", defaultValue: 35, min: 15, max: 80, step: 1 }',
    '{ id: "sitAndReach", label: "Sit and Reach (inches past toes)", type: "number", defaultValue: 2, min: -10, max: 15, step: 0.5 }',
    '{ id: "shoulderFlexion", label: "Shoulder Flexion (degrees)", type: "number", defaultValue: 160, min: 90, max: 190, step: 5 }',
    '{ id: "squatDepth", label: "Squat Depth (1=Partial, 5=Full ATG)", type: "number", defaultValue: 3, min: 1, max: 5, step: 1 }',
    '{ id: "exerciseFreq", label: "Stretch/Yoga Days Per Week", type: "number", defaultValue: 2, min: 0, max: 7, step: 1 }'
  ],
  `(inputs: Record<string, number>) => {
      const age = inputs.actualAge || 35;
      const sitReach = inputs.sitAndReach || 2;
      const shoulder = inputs.shoulderFlexion || 160;
      const squat = inputs.squatDepth || 3;
      const freq = inputs.exerciseFreq || 2;
      const sitReachScore = Math.min(25, (sitReach + 5) * 2);
      const shoulderScore = Math.min(25, (shoulder - 90) * 0.25);
      const squatScore = squat * 5;
      const freqScore = Math.min(25, freq * 5);
      const totalScore = sitReachScore + shoulderScore + squatScore + freqScore;
      const flexAge = Math.round(age - (totalScore - 40) * 0.5);
      const difference = age - flexAge;
      let rating = "Average";
      if (difference > 10) rating = "Excellent";
      else if (difference > 5) rating = "Good";
      else if (difference < -5) rating = "Below Average";
      else if (difference < -10) rating = "Poor";
      return {
        primary: { label: "Flexibility Age", value: flexAge + " years" },
        details: [
          { label: "Age Difference", value: (difference > 0 ? difference + " years younger" : Math.abs(difference) + " years older") },
          { label: "Flexibility Rating", value: rating },
          { label: "Total Score", value: formatNumber(Math.round(totalScore)) + "/100" },
          { label: "Sit and Reach Score", value: formatNumber(Math.round(sitReachScore)) + "/25" }
        ]
      };
    }`,
  [
    { q: "What is flexibility age?", a: "Flexibility age estimates how old your body acts based on mobility. Lower than actual age is better." },
    { q: "How can I improve my flexibility age?", a: "Regular stretching, yoga, and mobility work 3-5 times per week can significantly improve flexibility." }
  ],
  "Flex Age = Actual Age - (Total Flexibility Score - 40) x 0.5",
  ["vo2-max-calculator"]
);

add(
  "running-pace-conversion-calculator",
  "Running Pace Conversion Calculator",
  "Convert running pace between min/km and min/mile formats",
  "Health", "health", "H",
  ["running pace", "pace converter", "min per mile to min per km"],
  [
    '{ id: "paceMinutes", label: "Pace Minutes", type: "number", defaultValue: 8, min: 3, max: 20, step: 1 }',
    '{ id: "paceSeconds", label: "Pace Seconds", type: "number", defaultValue: 30, min: 0, max: 59, step: 1 }',
    '{ id: "inputUnit", label: "Input Unit (1=min/mile, 2=min/km)", type: "number", defaultValue: 1, min: 1, max: 2, step: 1 }',
    '{ id: "raceDistance", label: "Race Distance (miles)", type: "number", defaultValue: 13.1, min: 0.1, max: 100, step: 0.1 }'
  ],
  `(inputs: Record<string, number>) => {
      const mins = inputs.paceMinutes || 8;
      const secs = inputs.paceSeconds || 30;
      const unit = inputs.inputUnit || 1;
      const distance = inputs.raceDistance || 13.1;
      const totalSecs = mins * 60 + secs;
      let perMileSecs: number, perKmSecs: number;
      if (unit === 1) {
        perMileSecs = totalSecs;
        perKmSecs = Math.round(totalSecs / 1.60934);
      } else {
        perKmSecs = totalSecs;
        perMileSecs = Math.round(totalSecs * 1.60934);
      }
      const mileMin = Math.floor(perMileSecs / 60);
      const mileSec = perMileSecs % 60;
      const kmMin = Math.floor(perKmSecs / 60);
      const kmSec = perKmSecs % 60;
      const totalTimeSecs = perMileSecs * distance;
      const raceHrs = Math.floor(totalTimeSecs / 3600);
      const raceMins = Math.floor((totalTimeSecs % 3600) / 60);
      const raceSecs = Math.round(totalTimeSecs % 60);
      const speedMph = 3600 / perMileSecs;
      const padSec = (s: number) => s < 10 ? "0" + s : String(s);
      return {
        primary: { label: "Pace (min/mile)", value: mileMin + ":" + padSec(mileSec) },
        details: [
          { label: "Pace (min/km)", value: kmMin + ":" + padSec(kmSec) },
          { label: "Speed", value: formatNumber(Math.round(speedMph * 100) / 100) + " mph" },
          { label: "Race Time (" + distance + " mi)", value: raceHrs + ":" + padSec(raceMins) + ":" + padSec(raceSecs) },
          { label: "Distance in km", value: formatNumber(Math.round(distance * 1.60934 * 10) / 10) + " km" }
        ]
      };
    }`,
  [
    { q: "How do I convert min/mile to min/km?", a: "Divide your min/mile pace by 1.60934 to get min/km. For example, 8:00/mile is about 4:58/km." },
    { q: "What is a good running pace?", a: "For recreational runners, 9-12 min/mile is common. Competitive runners aim for 6-8 min/mile." }
  ],
  "min/km = min/mile / 1.60934. Race Time = Pace x Distance.",
  ["vo2-max-calculator"]
);


// GROUP F - SMALL BUSINESS & FREELANCE

// #1 Freelance Rate Calculator
add('freelance-rate-calculator', 'Freelance Rate Calculator',
  'Calculate the hourly rate needed to cover expenses, taxes, and desired profit as a freelancer or independent contractor.',
  'Finance', 'finance', '$',
  ['freelance hourly rate', 'freelance pricing', 'consulting rate calculator'],
  [
    '{ name: "annualExpenses", label: "Annual Business Expenses", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 15000 }',
    '{ name: "desiredSalary", label: "Desired Annual Salary", type: "number", prefix: "$", min: 0, max: 1000000, defaultValue: 75000 }',
    '{ name: "taxRate", label: "Estimated Tax Rate", type: "number", suffix: "%", min: 0, max: 60, defaultValue: 30 }',
    '{ name: "billableHours", label: "Billable Hours Per Week", type: "number", min: 1, max: 60, defaultValue: 30 }',
    '{ name: "weeksOff", label: "Weeks Off Per Year", type: "number", min: 0, max: 20, defaultValue: 3 }',
  ],
  `(inputs) => {
      const expenses = inputs.annualExpenses as number;
      const salary = inputs.desiredSalary as number;
      const taxRate = (inputs.taxRate as number) / 100;
      const hoursPerWeek = inputs.billableHours as number;
      const weeksOff = inputs.weeksOff as number;
      if (!salary || !hoursPerWeek) return null;
      const workingWeeks = 52 - weeksOff;
      const totalBillableHours = hoursPerWeek * workingWeeks;
      const grossNeeded = (salary + expenses) / (1 - taxRate);
      const hourlyRate = grossNeeded / totalBillableHours;
      const monthlyRevenue = grossNeeded / 12;
      return {
        primary: { label: "Required Hourly Rate", value: "$" + formatNumber(Math.round(hourlyRate * 100) / 100) },
        details: [
          { label: "Annual Gross Revenue Needed", value: "$" + formatNumber(Math.round(grossNeeded)) },
          { label: "Monthly Revenue Target", value: "$" + formatNumber(Math.round(monthlyRevenue)) },
          { label: "Total Billable Hours/Year", value: formatNumber(totalBillableHours) },
          { label: "Tax Set-Aside", value: "$" + formatNumber(Math.round(grossNeeded * taxRate)) },
        ],
      };
    }`,
  [{ q: 'How do I determine my billable hours per week?', a: 'Most freelancers can bill about 60-70% of their total working hours. The rest goes to administration, marketing, and business development. If you work 40 hours, plan for about 25-30 billable hours.' },
   { q: 'Should I charge the same rate for all clients?', a: 'Many freelancers use value-based pricing, adjusting rates based on the project scope, client budget, and urgency. Your calculated rate serves as a minimum floor to ensure profitability.' }],
  'Hourly Rate = (Desired Salary + Expenses) / (1 - Tax Rate) / (Billable Hours Per Week x Working Weeks)',
  ['break-even-analysis-calculator', 'markup-vs-margin-calculator']
);

// #2 Break-Even Analysis Calculator
add('break-even-analysis-calculator', 'Break-Even Analysis Calculator',
  'Determine the number of units or revenue needed to cover all fixed and variable costs and reach the break-even point.',
  'Finance', 'finance', '$',
  ['break even point', 'break even analysis', 'breakeven calculator'],
  [
    '{ name: "fixedCosts", label: "Total Fixed Costs", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 50000 }',
    '{ name: "pricePerUnit", label: "Price Per Unit", type: "number", prefix: "$", min: 0.01, max: 100000, defaultValue: 50 }',
    '{ name: "variableCostPerUnit", label: "Variable Cost Per Unit", type: "number", prefix: "$", min: 0, max: 100000, defaultValue: 20 }',
  ],
  `(inputs) => {
      const fixed = inputs.fixedCosts as number;
      const price = inputs.pricePerUnit as number;
      const variable = inputs.variableCostPerUnit as number;
      if (!fixed || !price || price <= variable) return null;
      const contributionMargin = price - variable;
      const breakEvenUnits = Math.ceil(fixed / contributionMargin);
      const breakEvenRevenue = breakEvenUnits * price;
      const marginPercent = (contributionMargin / price) * 100;
      return {
        primary: { label: "Break-Even Units", value: formatNumber(breakEvenUnits) },
        details: [
          { label: "Break-Even Revenue", value: "$" + formatNumber(Math.round(breakEvenRevenue)) },
          { label: "Contribution Margin Per Unit", value: "$" + formatNumber(Math.round(contributionMargin * 100) / 100) },
          { label: "Contribution Margin %", value: formatNumber(Math.round(marginPercent * 10) / 10) + "%" },
        ],
      };
    }`,
  [{ q: 'What is the contribution margin?', a: 'The contribution margin is the selling price minus the variable cost per unit. It represents the portion of each sale that contributes toward covering fixed costs and generating profit.' },
   { q: 'Why is break-even analysis important for a new business?', a: 'Break-even analysis helps determine how many sales are needed before a business becomes profitable. It is essential for pricing decisions, financial planning, and evaluating business viability.' }],
  'Break-Even Units = Fixed Costs / (Price Per Unit - Variable Cost Per Unit)',
  ['freelance-rate-calculator', 'markup-vs-margin-calculator']
);

// #3 Markup vs Margin Calculator
add('markup-vs-margin-calculator', 'Markup vs Margin Calculator',
  'Convert between markup percentage and profit margin to understand the true profitability of products or services.',
  'Finance', 'finance', '$',
  ['markup to margin', 'margin vs markup', 'markup calculator'],
  [
    '{ name: "cost", label: "Cost Price", type: "number", prefix: "$", min: 0.01, max: 1000000, defaultValue: 60 }',
    '{ name: "sellingPrice", label: "Selling Price", type: "number", prefix: "$", min: 0.01, max: 10000000, defaultValue: 100 }',
  ],
  `(inputs) => {
      const cost = inputs.cost as number;
      const selling = inputs.sellingPrice as number;
      if (!cost || !selling || cost <= 0 || selling <= 0) return null;
      const profit = selling - cost;
      const markupPercent = (profit / cost) * 100;
      const marginPercent = (profit / selling) * 100;
      return {
        primary: { label: "Profit Margin", value: formatNumber(Math.round(marginPercent * 100) / 100) + "%" },
        details: [
          { label: "Markup Percentage", value: formatNumber(Math.round(markupPercent * 100) / 100) + "%" },
          { label: "Profit Per Unit", value: "$" + formatNumber(Math.round(profit * 100) / 100) },
          { label: "Cost Price", value: "$" + formatNumber(Math.round(cost * 100) / 100) },
          { label: "Selling Price", value: "$" + formatNumber(Math.round(selling * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'What is the difference between markup and margin?', a: 'Markup is the percentage added to cost to get the selling price (based on cost). Margin is the percentage of the selling price that is profit (based on revenue). A 100% markup equals a 50% margin.' },
   { q: 'Which should I use for pricing decisions?', a: 'Margin is more commonly used in financial analysis because it shows what portion of revenue is profit. Markup is more intuitive when setting prices from a known cost basis.' }],
  'Markup = (Selling Price - Cost) / Cost x 100; Margin = (Selling Price - Cost) / Selling Price x 100',
  ['break-even-analysis-calculator', 'freelance-rate-calculator']
);

// #4 Invoice Late Fee Calculator
add('invoice-late-fee-calculator', 'Invoice Late Fee Calculator',
  'Calculate late payment penalties and interest charges on overdue invoices based on terms and days past due.',
  'Finance', 'finance', '$',
  ['late fee calculator', 'invoice penalty', 'overdue invoice interest'],
  [
    '{ name: "invoiceAmount", label: "Invoice Amount", type: "number", prefix: "$", min: 1, max: 10000000, defaultValue: 5000 }',
    '{ name: "annualRate", label: "Annual Interest Rate", type: "number", suffix: "%", min: 0, max: 36, defaultValue: 18 }',
    '{ name: "daysOverdue", label: "Days Overdue", type: "number", min: 1, max: 365, defaultValue: 30 }',
    '{ name: "flatFee", label: "Flat Late Fee", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 0 }',
  ],
  `(inputs) => {
      const amount = inputs.invoiceAmount as number;
      const rate = (inputs.annualRate as number) / 100;
      const days = inputs.daysOverdue as number;
      const flat = inputs.flatFee as number;
      if (!amount || !days) return null;
      const dailyRate = rate / 365;
      const interestCharge = amount * dailyRate * days;
      const totalPenalty = interestCharge + flat;
      const totalDue = amount + totalPenalty;
      return {
        primary: { label: "Total Amount Due", value: "$" + formatNumber(Math.round(totalDue * 100) / 100) },
        details: [
          { label: "Interest Charge", value: "$" + formatNumber(Math.round(interestCharge * 100) / 100) },
          { label: "Flat Late Fee", value: "$" + formatNumber(Math.round(flat * 100) / 100) },
          { label: "Total Penalty", value: "$" + formatNumber(Math.round(totalPenalty * 100) / 100) },
          { label: "Daily Interest Rate", value: formatNumber(Math.round(dailyRate * 100000) / 1000) + "%" },
        ],
      };
    }`,
  [{ q: 'What is a typical late fee for invoices?', a: 'Common late fees range from 1% to 2% per month (12-24% annually). Some businesses also charge a flat fee of $25 to $50 in addition to interest. Always check local regulations for maximum allowed rates.' },
   { q: 'When should late fees begin?', a: 'Late fees typically begin after the payment terms expire, such as Net 30 or Net 60. Clearly stating late fee terms on the original invoice is essential for enforceability.' }],
  'Interest Charge = Invoice Amount x (Annual Rate / 365) x Days Overdue; Total Due = Invoice Amount + Interest Charge + Flat Fee',
  ['freelance-rate-calculator', 'break-even-analysis-calculator']
);

// #5 Business Valuation Calculator
add('business-valuation-calculator', 'Business Valuation Calculator',
  'Estimate the value of a business using earnings multiples and asset-based valuation methods.',
  'Finance', 'finance', '$',
  ['business valuation', 'company valuation', 'business worth calculator'],
  [
    '{ name: "annualRevenue", label: "Annual Revenue", type: "number", prefix: "$", min: 0, max: 100000000, defaultValue: 500000 }',
    '{ name: "annualProfit", label: "Annual Net Profit (EBITDA)", type: "number", prefix: "$", min: 0, max: 50000000, defaultValue: 100000 }',
    '{ name: "totalAssets", label: "Total Assets", type: "number", prefix: "$", min: 0, max: 100000000, defaultValue: 200000 }',
    '{ name: "totalLiabilities", label: "Total Liabilities", type: "number", prefix: "$", min: 0, max: 100000000, defaultValue: 50000 }',
    '{ name: "industryMultiple", label: "Industry Earnings Multiple", type: "number", min: 1, max: 30, defaultValue: 4 }',
  ],
  `(inputs) => {
      const revenue = inputs.annualRevenue as number;
      const profit = inputs.annualProfit as number;
      const assets = inputs.totalAssets as number;
      const liabilities = inputs.totalLiabilities as number;
      const multiple = inputs.industryMultiple as number;
      if (!revenue || !profit || !multiple) return null;
      const earningsValue = profit * multiple;
      const assetValue = assets - liabilities;
      const revenueValue = revenue * (multiple * 0.4);
      const avgValue = (earningsValue + assetValue + revenueValue) / 3;
      return {
        primary: { label: "Earnings-Based Valuation", value: "$" + formatNumber(Math.round(earningsValue)) },
        details: [
          { label: "Asset-Based Valuation", value: "$" + formatNumber(Math.round(assetValue)) },
          { label: "Revenue-Based Valuation", value: "$" + formatNumber(Math.round(revenueValue)) },
          { label: "Average of All Methods", value: "$" + formatNumber(Math.round(avgValue)) },
          { label: "Earnings Multiple Used", value: formatNumber(multiple) + "x" },
        ],
      };
    }`,
  [{ q: 'What is a typical earnings multiple?', a: 'Earnings multiples vary by industry. Small businesses often sell for 2-4x earnings, while tech companies may command 8-15x or higher. The multiple depends on growth rate, industry, and market conditions.' },
   { q: 'Which valuation method is most reliable?', a: 'No single method is definitive. Earnings-based valuations are most common for profitable businesses, while asset-based methods suit capital-intensive firms. Most appraisers use a blend of approaches.' }],
  'Earnings Valuation = Annual Profit x Industry Multiple; Asset Valuation = Total Assets - Total Liabilities',
  ['break-even-analysis-calculator', 'customer-lifetime-value-calculator']
);

// #6 Inventory Turnover Calculator
add('inventory-turnover-calculator', 'Inventory Turnover Calculator',
  'Calculate how quickly inventory is sold and replaced over a period to evaluate operational efficiency.',
  'Finance', 'finance', '$',
  ['inventory turnover ratio', 'stock turnover', 'inventory efficiency'],
  [
    '{ name: "cogs", label: "Cost of Goods Sold", type: "number", prefix: "$", min: 0, max: 100000000, defaultValue: 500000 }',
    '{ name: "beginningInventory", label: "Beginning Inventory", type: "number", prefix: "$", min: 0, max: 50000000, defaultValue: 80000 }',
    '{ name: "endingInventory", label: "Ending Inventory", type: "number", prefix: "$", min: 0, max: 50000000, defaultValue: 120000 }',
  ],
  `(inputs) => {
      const cogs = inputs.cogs as number;
      const begin = inputs.beginningInventory as number;
      const end = inputs.endingInventory as number;
      if (!cogs || (begin + end) <= 0) return null;
      const avgInventory = (begin + end) / 2;
      const turnoverRatio = cogs / avgInventory;
      const daysToSell = 365 / turnoverRatio;
      return {
        primary: { label: "Inventory Turnover Ratio", value: formatNumber(Math.round(turnoverRatio * 100) / 100) + "x" },
        details: [
          { label: "Days to Sell Inventory", value: formatNumber(Math.round(daysToSell)) + " days" },
          { label: "Average Inventory", value: "$" + formatNumber(Math.round(avgInventory)) },
          { label: "Cost of Goods Sold", value: "$" + formatNumber(Math.round(cogs)) },
        ],
      };
    }`,
  [{ q: 'What is a good inventory turnover ratio?', a: 'A good ratio depends on the industry. Grocery stores may have 14-20 turns per year, while furniture stores may have 4-6. Higher turnover generally indicates efficient inventory management and strong sales.' },
   { q: 'How can I improve inventory turnover?', a: 'Strategies include better demand forecasting, reducing slow-moving stock, negotiating shorter lead times with suppliers, and implementing just-in-time inventory practices.' }],
  'Inventory Turnover = Cost of Goods Sold / Average Inventory; Average Inventory = (Beginning + Ending Inventory) / 2',
  ['accounts-receivable-turnover-calculator', 'break-even-analysis-calculator']
);

// #7 Accounts Receivable Turnover Calculator
add('accounts-receivable-turnover-calculator', 'Accounts Receivable Turnover Calculator',
  'Measure how efficiently a business collects payments from customers by calculating the AR turnover ratio.',
  'Finance', 'finance', '$',
  ['accounts receivable turnover', 'AR collection', 'receivables ratio'],
  [
    '{ name: "netCreditSales", label: "Net Credit Sales", type: "number", prefix: "$", min: 0, max: 100000000, defaultValue: 1000000 }',
    '{ name: "beginningAR", label: "Beginning Accounts Receivable", type: "number", prefix: "$", min: 0, max: 50000000, defaultValue: 100000 }',
    '{ name: "endingAR", label: "Ending Accounts Receivable", type: "number", prefix: "$", min: 0, max: 50000000, defaultValue: 150000 }',
  ],
  `(inputs) => {
      const sales = inputs.netCreditSales as number;
      const beginAR = inputs.beginningAR as number;
      const endAR = inputs.endingAR as number;
      if (!sales || (beginAR + endAR) <= 0) return null;
      const avgAR = (beginAR + endAR) / 2;
      const turnoverRatio = sales / avgAR;
      const daysToCollect = 365 / turnoverRatio;
      return {
        primary: { label: "AR Turnover Ratio", value: formatNumber(Math.round(turnoverRatio * 100) / 100) + "x" },
        details: [
          { label: "Days Sales Outstanding", value: formatNumber(Math.round(daysToCollect)) + " days" },
          { label: "Average Accounts Receivable", value: "$" + formatNumber(Math.round(avgAR)) },
          { label: "Net Credit Sales", value: "$" + formatNumber(Math.round(sales)) },
        ],
      };
    }`,
  [{ q: 'What is a good accounts receivable turnover ratio?', a: 'A higher ratio indicates faster collection. Most businesses aim for a ratio between 7 and 12, meaning they collect receivables every 30 to 50 days. The ideal ratio depends on industry payment norms.' },
   { q: 'What does a low AR turnover ratio indicate?', a: 'A low ratio suggests that a business is taking too long to collect payments. This can lead to cash flow problems and may indicate weak credit policies or issues with customer payment behavior.' }],
  'AR Turnover = Net Credit Sales / Average Accounts Receivable; DSO = 365 / AR Turnover',
  ['inventory-turnover-calculator', 'churn-rate-calculator']
);

// #8 Customer Acquisition Cost Calculator
add('customer-acquisition-cost-calculator', 'Customer Acquisition Cost Calculator',
  'Calculate the total cost to acquire a new customer including marketing, sales, and overhead expenses.',
  'Finance', 'finance', '$',
  ['customer acquisition cost', 'CAC calculator', 'cost per acquisition'],
  [
    '{ name: "marketingSpend", label: "Total Marketing Spend", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 50000 }',
    '{ name: "salesSpend", label: "Total Sales Spend", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 30000 }',
    '{ name: "newCustomers", label: "New Customers Acquired", type: "number", min: 1, max: 1000000, defaultValue: 200 }',
  ],
  `(inputs) => {
      const marketing = inputs.marketingSpend as number;
      const sales = inputs.salesSpend as number;
      const customers = inputs.newCustomers as number;
      if (!customers || customers <= 0) return null;
      const totalSpend = marketing + sales;
      const cac = totalSpend / customers;
      const marketingPerCustomer = marketing / customers;
      const salesPerCustomer = sales / customers;
      return {
        primary: { label: "Customer Acquisition Cost", value: "$" + formatNumber(Math.round(cac * 100) / 100) },
        details: [
          { label: "Total Acquisition Spend", value: "$" + formatNumber(Math.round(totalSpend)) },
          { label: "Marketing Cost Per Customer", value: "$" + formatNumber(Math.round(marketingPerCustomer * 100) / 100) },
          { label: "Sales Cost Per Customer", value: "$" + formatNumber(Math.round(salesPerCustomer * 100) / 100) },
          { label: "New Customers", value: formatNumber(customers) },
        ],
      };
    }`,
  [{ q: 'What is a good customer acquisition cost?', a: 'A good CAC depends on the customer lifetime value (CLV). A common benchmark is a CLV to CAC ratio of 3:1, meaning each customer should generate at least three times the cost of acquisition.' },
   { q: 'How can I reduce customer acquisition cost?', a: 'Focus on organic marketing channels, improve conversion rates, leverage referral programs, optimize ad targeting, and retain existing customers to reduce dependence on new acquisitions.' }],
  'Customer Acquisition Cost = (Marketing Spend + Sales Spend) / Number of New Customers',
  ['customer-lifetime-value-calculator', 'churn-rate-calculator']
);

// #9 Customer Lifetime Value Calculator
add('customer-lifetime-value-calculator', 'Customer Lifetime Value Calculator',
  'Estimate the total revenue a business can expect from an average customer over the entire relationship.',
  'Finance', 'finance', '$',
  ['customer lifetime value', 'CLV calculator', 'LTV calculator'],
  [
    '{ name: "avgPurchaseValue", label: "Average Purchase Value", type: "number", prefix: "$", min: 1, max: 1000000, defaultValue: 50 }',
    '{ name: "purchaseFrequency", label: "Purchases Per Year", type: "number", min: 0.1, max: 365, defaultValue: 12 }',
    '{ name: "avgLifespan", label: "Customer Lifespan (Years)", type: "number", min: 0.1, max: 50, defaultValue: 3 }',
    '{ name: "profitMargin", label: "Profit Margin", type: "number", suffix: "%", min: 1, max: 100, defaultValue: 30 }',
  ],
  `(inputs) => {
      const purchaseValue = inputs.avgPurchaseValue as number;
      const frequency = inputs.purchaseFrequency as number;
      const lifespan = inputs.avgLifespan as number;
      const margin = (inputs.profitMargin as number) / 100;
      if (!purchaseValue || !frequency || !lifespan) return null;
      const annualRevenue = purchaseValue * frequency;
      const totalRevenue = annualRevenue * lifespan;
      const clv = totalRevenue * margin;
      return {
        primary: { label: "Customer Lifetime Value", value: "$" + formatNumber(Math.round(clv)) },
        details: [
          { label: "Total Lifetime Revenue", value: "$" + formatNumber(Math.round(totalRevenue)) },
          { label: "Annual Revenue Per Customer", value: "$" + formatNumber(Math.round(annualRevenue)) },
          { label: "Profit Margin", value: formatNumber(Math.round(margin * 100)) + "%" },
          { label: "Customer Lifespan", value: formatNumber(lifespan) + " years" },
        ],
      };
    }`,
  [{ q: 'Why is customer lifetime value important?', a: 'CLV helps determine how much to spend on acquiring and retaining customers. It guides marketing budgets, customer service investments, and overall business strategy by quantifying each customer relationship.' },
   { q: 'How do I increase customer lifetime value?', a: 'Improve product quality, enhance customer service, implement loyalty programs, cross-sell and upsell effectively, and focus on customer retention to extend the average customer lifespan.' }],
  'CLV = Average Purchase Value x Purchase Frequency x Customer Lifespan x Profit Margin',
  ['customer-acquisition-cost-calculator', 'churn-rate-calculator']
);

// #10 Churn Rate Calculator
add('churn-rate-calculator', 'Churn Rate Calculator',
  'Calculate the customer or revenue churn rate to measure how quickly a business is losing customers or revenue.',
  'Finance', 'finance', '$',
  ['churn rate', 'customer churn', 'attrition rate calculator'],
  [
    '{ name: "startCustomers", label: "Customers at Start of Period", type: "number", min: 1, max: 10000000, defaultValue: 1000 }',
    '{ name: "lostCustomers", label: "Customers Lost During Period", type: "number", min: 0, max: 10000000, defaultValue: 50 }',
    '{ name: "periodMonths", label: "Period Length (Months)", type: "number", min: 1, max: 12, defaultValue: 1 }',
  ],
  `(inputs) => {
      const start = inputs.startCustomers as number;
      const lost = inputs.lostCustomers as number;
      const months = inputs.periodMonths as number;
      if (!start || start <= 0 || !months) return null;
      const churnRate = (lost / start) * 100;
      const monthlyChurn = churnRate / months;
      const annualChurn = (1 - Math.pow(1 - monthlyChurn / 100, 12)) * 100;
      const retentionRate = 100 - churnRate;
      return {
        primary: { label: "Churn Rate", value: formatNumber(Math.round(churnRate * 100) / 100) + "%" },
        details: [
          { label: "Monthly Churn Rate", value: formatNumber(Math.round(monthlyChurn * 100) / 100) + "%" },
          { label: "Annualized Churn Rate", value: formatNumber(Math.round(annualChurn * 100) / 100) + "%" },
          { label: "Retention Rate", value: formatNumber(Math.round(retentionRate * 100) / 100) + "%" },
          { label: "Customers Lost", value: formatNumber(lost) },
        ],
      };
    }`,
  [{ q: 'What is an acceptable churn rate?', a: 'Acceptable churn varies by industry. SaaS companies typically aim for less than 5% annual churn, while consumer services may see 5-7% monthly churn. Lower churn always indicates better customer retention.' },
   { q: 'How is churn rate different from attrition rate?', a: 'Churn rate and attrition rate are often used interchangeably. Both measure the percentage of customers who stop using a product or service during a given period relative to the starting count.' }],
  'Churn Rate = (Customers Lost / Customers at Start) x 100; Annual Churn = 1 - (1 - Monthly Churn)^12',
  ['customer-lifetime-value-calculator', 'customer-acquisition-cost-calculator']
);

// GROUP G - ENVIRONMENTAL & SUSTAINABILITY

// #11 Carbon Footprint Calculator
add('carbon-footprint-calculator', 'Carbon Footprint Calculator',
  'Estimate your annual carbon dioxide emissions from driving, electricity usage, and natural gas consumption.',
  'Everyday', 'everyday', '~',
  ['carbon footprint', 'CO2 emissions calculator', 'carbon calculator'],
  [
    '{ name: "milesDriven", label: "Miles Driven Per Year", type: "number", min: 0, max: 100000, defaultValue: 12000 }',
    '{ name: "mpg", label: "Vehicle Fuel Economy (MPG)", type: "number", min: 5, max: 100, defaultValue: 25 }',
    '{ name: "electricityKwh", label: "Monthly Electricity (kWh)", type: "number", min: 0, max: 10000, defaultValue: 900 }',
    '{ name: "naturalGasTherms", label: "Monthly Natural Gas (therms)", type: "number", min: 0, max: 1000, defaultValue: 50 }',
  ],
  `(inputs) => {
      const miles = inputs.milesDriven as number;
      const mpg = inputs.mpg as number;
      const kwh = inputs.electricityKwh as number;
      const therms = inputs.naturalGasTherms as number;
      if (mpg <= 0) return null;
      const gallonsUsed = miles / mpg;
      const drivingCO2 = gallonsUsed * 19.6;
      const electricityCO2 = kwh * 12 * 0.92;
      const gasCO2 = therms * 12 * 11.7;
      const totalLbs = drivingCO2 + electricityCO2 + gasCO2;
      const totalTons = totalLbs / 2204.62;
      return {
        primary: { label: "Annual CO2 Emissions", value: formatNumber(Math.round(totalTons * 10) / 10) + " metric tons" },
        details: [
          { label: "Driving Emissions", value: formatNumber(Math.round(drivingCO2)) + " lbs CO2" },
          { label: "Electricity Emissions", value: formatNumber(Math.round(electricityCO2)) + " lbs CO2" },
          { label: "Natural Gas Emissions", value: formatNumber(Math.round(gasCO2)) + " lbs CO2" },
          { label: "Total Annual lbs CO2", value: formatNumber(Math.round(totalLbs)) + " lbs" },
        ],
      };
    }`,
  [{ q: 'What is the average carbon footprint in the United States?', a: 'The average American produces about 16 metric tons of CO2 per year, which is one of the highest per capita rates globally. The world average is approximately 4 metric tons per person.' },
   { q: 'What are the biggest sources of personal carbon emissions?', a: 'Transportation and home energy use are the largest contributors for most individuals. Driving, air travel, heating, cooling, and electricity generation account for the majority of personal emissions.' }],
  'Driving CO2 = (Miles / MPG) x 19.6 lbs per gallon; Electricity CO2 = kWh x 12 x 0.92 lbs per kWh; Gas CO2 = Therms x 12 x 11.7 lbs per therm',
  ['tree-planting-offset-calculator', 'solar-panel-savings-calculator']
);

// #12 Solar Panel Savings Calculator
add('solar-panel-savings-calculator', 'Solar Panel Savings Calculator',
  'Estimate the financial savings and payback period from installing solar panels on your home.',
  'Finance', 'finance', '$',
  ['solar panel savings', 'solar ROI', 'solar panel cost calculator'],
  [
    '{ name: "systemCost", label: "System Cost Before Incentives", type: "number", prefix: "$", min: 1000, max: 100000, defaultValue: 20000 }',
    '{ name: "monthlyBill", label: "Current Monthly Electric Bill", type: "number", prefix: "$", min: 10, max: 2000, defaultValue: 150 }',
    '{ name: "solarOffset", label: "Solar Offset Percentage", type: "number", suffix: "%", min: 10, max: 100, defaultValue: 80 }',
    '{ name: "taxCredit", label: "Federal Tax Credit", type: "number", suffix: "%", min: 0, max: 50, defaultValue: 30 }',
  ],
  `(inputs) => {
      const cost = inputs.systemCost as number;
      const bill = inputs.monthlyBill as number;
      const offset = (inputs.solarOffset as number) / 100;
      const credit = (inputs.taxCredit as number) / 100;
      if (!cost || !bill) return null;
      const netCost = cost * (1 - credit);
      const annualSavings = bill * 12 * offset;
      const paybackYears = netCost / annualSavings;
      const savings25yr = annualSavings * 25 - netCost;
      return {
        primary: { label: "Payback Period", value: formatNumber(Math.round(paybackYears * 10) / 10) + " years" },
        details: [
          { label: "Net System Cost", value: "$" + formatNumber(Math.round(netCost)) },
          { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
          { label: "25-Year Net Savings", value: "$" + formatNumber(Math.round(savings25yr)) },
          { label: "Tax Credit Savings", value: "$" + formatNumber(Math.round(cost * credit)) },
        ],
      };
    }`,
  [{ q: 'How long do solar panels last?', a: 'Most solar panels are warranted for 25 years and can produce electricity for 30 years or more. Panel efficiency degrades slowly, typically losing about 0.5% efficiency per year.' },
   { q: 'Is the federal solar tax credit still available?', a: 'The federal Investment Tax Credit (ITC) allows homeowners to deduct a percentage of solar installation costs from federal taxes. The credit percentage and availability vary by year, so check current rates.' }],
  'Net Cost = System Cost x (1 - Tax Credit); Payback Period = Net Cost / Annual Savings; 25-Year Savings = Annual Savings x 25 - Net Cost',
  ['electricity-cost-calculator', 'carbon-footprint-calculator']
);

// #13 Electricity Cost Calculator
add('electricity-cost-calculator', 'Electricity Cost Calculator',
  'Estimate your monthly electricity cost based on appliance usage, wattage, and local utility rates.',
  'Everyday', 'everyday', '~',
  ['electricity cost', 'electric bill calculator', 'energy cost calculator'],
  [
    '{ name: "watts", label: "Appliance Wattage", type: "number", suffix: "W", min: 1, max: 50000, defaultValue: 1500 }',
    '{ name: "hoursPerDay", label: "Hours Used Per Day", type: "number", min: 0.1, max: 24, defaultValue: 8 }',
    '{ name: "days", label: "Days Per Month", type: "number", min: 1, max: 31, defaultValue: 30 }',
    '{ name: "ratePerKwh", label: "Electricity Rate (per kWh)", type: "number", prefix: "$", min: 0.01, max: 1, defaultValue: 0.13 }',
  ],
  `(inputs) => {
      const watts = inputs.watts as number;
      const hours = inputs.hoursPerDay as number;
      const days = inputs.days as number;
      const rate = inputs.ratePerKwh as number;
      if (!watts || !hours || !days || !rate) return null;
      const dailyKwh = (watts * hours) / 1000;
      const monthlyKwh = dailyKwh * days;
      const monthlyCost = monthlyKwh * rate;
      const annualCost = monthlyCost * 12;
      return {
        primary: { label: "Monthly Electricity Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        details: [
          { label: "Daily Energy Usage", value: formatNumber(Math.round(dailyKwh * 100) / 100) + " kWh" },
          { label: "Monthly Energy Usage", value: formatNumber(Math.round(monthlyKwh * 10) / 10) + " kWh" },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'What is the average electricity rate in the United States?', a: 'The average residential electricity rate in the US is approximately $0.13 to $0.16 per kWh, though rates vary significantly by state. Hawaii has the highest rates while states like Louisiana have lower rates.' },
   { q: 'Which appliances use the most electricity?', a: 'Central air conditioners, electric water heaters, clothes dryers, and space heaters are among the highest energy consumers. Refrigerators and freezers also use significant energy because they run continuously.' }],
  'Monthly Cost = (Watts x Hours Per Day x Days) / 1000 x Rate Per kWh',
  ['solar-panel-savings-calculator', 'led-vs-incandescent-calculator']
);

// #14 Water Usage Calculator
add('water-usage-calculator', 'Water Usage Calculator',
  'Estimate household water consumption and monthly cost based on daily usage patterns.',
  'Everyday', 'everyday', '~',
  ['water usage calculator', 'water bill estimator', 'household water consumption'],
  [
    '{ name: "showerMinutes", label: "Shower Minutes Per Day", type: "number", min: 0, max: 120, defaultValue: 15 }',
    '{ name: "toiletFlushes", label: "Toilet Flushes Per Day", type: "number", min: 0, max: 50, defaultValue: 10 }',
    '{ name: "laundryLoads", label: "Laundry Loads Per Week", type: "number", min: 0, max: 30, defaultValue: 5 }',
    '{ name: "waterRate", label: "Water Rate (per 1000 gallons)", type: "number", prefix: "$", min: 1, max: 50, defaultValue: 6 }',
  ],
  `(inputs) => {
      const shower = inputs.showerMinutes as number;
      const flushes = inputs.toiletFlushes as number;
      const laundry = inputs.laundryLoads as number;
      const rate = inputs.waterRate as number;
      const showerGallons = shower * 2.5 * 30;
      const toiletGallons = flushes * 1.6 * 30;
      const laundryGallons = laundry * 30 * 4.3;
      const otherGallons = 50 * 30;
      const totalGallons = showerGallons + toiletGallons + laundryGallons + otherGallons;
      const monthlyCost = (totalGallons / 1000) * rate;
      return {
        primary: { label: "Monthly Water Usage", value: formatNumber(Math.round(totalGallons)) + " gallons" },
        details: [
          { label: "Monthly Water Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
          { label: "Shower Usage", value: formatNumber(Math.round(showerGallons)) + " gal/month" },
          { label: "Toilet Usage", value: formatNumber(Math.round(toiletGallons)) + " gal/month" },
          { label: "Laundry Usage", value: formatNumber(Math.round(laundryGallons)) + " gal/month" },
        ],
      };
    }`,
  [{ q: 'How much water does the average American household use?', a: 'The average American household uses about 300 gallons of water per day, or roughly 9,000 gallons per month. Indoor use accounts for about 70% of total consumption.' },
   { q: 'What are the best ways to reduce water usage?', a: 'Install low-flow showerheads and faucets, fix leaks promptly, use efficient appliances, take shorter showers, and water lawns during cooler parts of the day to reduce evaporation.' }],
  'Monthly Usage = (Shower GPM x Minutes x 30) + (Flushes x GPF x 30) + (Laundry Loads x Gallons x 4.3) + Other; Cost = Total Gallons / 1000 x Rate',
  ['rainwater-harvesting-calculator', 'electricity-cost-calculator']
);

// #15 Composting Savings Calculator
add('composting-savings-calculator', 'Composting Savings Calculator',
  'Estimate the money saved and waste diverted by composting food scraps and yard waste at home.',
  'Everyday', 'everyday', '~',
  ['composting savings', 'compost calculator', 'waste reduction savings'],
  [
    '{ name: "householdSize", label: "Household Size", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "trashBagCost", label: "Cost Per Trash Bag", type: "number", prefix: "$", min: 0.1, max: 5, defaultValue: 0.75 }',
    '{ name: "compostUseBags", label: "Compost Bags Saved Per Week", type: "number", min: 0.5, max: 10, defaultValue: 1 }',
    '{ name: "fertilizerCostPerYear", label: "Annual Fertilizer Cost Avoided", type: "number", prefix: "$", min: 0, max: 1000, defaultValue: 100 }',
  ],
  `(inputs) => {
      const household = inputs.householdSize as number;
      const bagCost = inputs.trashBagCost as number;
      const bagsSaved = inputs.compostUseBags as number;
      const fertilizerSaved = inputs.fertilizerCostPerYear as number;
      if (!household) return null;
      const weeklyFoodWasteLbs = household * 3.5;
      const annualWasteDiverted = weeklyFoodWasteLbs * 52;
      const annualBagSavings = bagsSaved * 52 * bagCost;
      const totalAnnualSavings = annualBagSavings + fertilizerSaved;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(totalAnnualSavings)) },
        details: [
          { label: "Waste Diverted Per Year", value: formatNumber(Math.round(annualWasteDiverted)) + " lbs" },
          { label: "Trash Bag Savings", value: "$" + formatNumber(Math.round(annualBagSavings * 100) / 100) },
          { label: "Fertilizer Savings", value: "$" + formatNumber(Math.round(fertilizerSaved)) },
          { label: "Weekly Food Waste", value: formatNumber(Math.round(weeklyFoodWasteLbs * 10) / 10) + " lbs" },
        ],
      };
    }`,
  [{ q: 'How much food waste does the average person produce?', a: 'The average American generates about 3 to 4 pounds of food waste per week. Composting can divert 30% or more of household waste from landfills.' },
   { q: 'What can be composted at home?', a: 'Fruit and vegetable scraps, coffee grounds, eggshells, yard trimmings, leaves, and paper products can all be composted. Avoid meat, dairy, and oily foods in basic home compost systems.' }],
  'Annual Savings = (Bags Saved Per Week x 52 x Bag Cost) + Fertilizer Cost Avoided; Waste Diverted = Household Size x 3.5 lbs/week x 52',
  ['carbon-footprint-calculator', 'tree-planting-offset-calculator']
);

// #16 Tree Planting Offset Calculator
add('tree-planting-offset-calculator', 'Tree Planting Offset Calculator',
  'Calculate the number of trees needed to offset your annual carbon dioxide emissions.',
  'Everyday', 'everyday', '~',
  ['tree carbon offset', 'trees to offset CO2', 'tree planting calculator'],
  [
    '{ name: "annualCO2Tons", label: "Annual CO2 Emissions (metric tons)", type: "number", min: 0.1, max: 500, defaultValue: 16 }',
    '{ name: "yearsToOffset", label: "Years to Achieve Offset", type: "number", min: 1, max: 50, defaultValue: 10 }',
    '{ name: "costPerTree", label: "Cost Per Tree Planted", type: "number", prefix: "$", min: 0.5, max: 100, defaultValue: 5 }',
  ],
  `(inputs) => {
      const co2 = inputs.annualCO2Tons as number;
      const years = inputs.yearsToOffset as number;
      const costPerTree = inputs.costPerTree as number;
      if (!co2 || !years) return null;
      const co2Lbs = co2 * 2204.62;
      const lbsPerTreePerYear = 48;
      const totalCO2ToOffset = co2Lbs * years;
      const treesNeeded = Math.ceil(totalCO2ToOffset / (lbsPerTreePerYear * years));
      const totalCost = treesNeeded * costPerTree;
      return {
        primary: { label: "Trees Needed", value: formatNumber(treesNeeded) },
        details: [
          { label: "Total CO2 to Offset", value: formatNumber(Math.round(co2 * years)) + " metric tons" },
          { label: "CO2 Absorbed Per Tree/Year", value: "48 lbs" },
          { label: "Total Planting Cost", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Cost Per Ton Offset", value: "$" + formatNumber(Math.round(totalCost / (co2 * years))) },
        ],
      };
    }`,
  [{ q: 'How much CO2 does one tree absorb per year?', a: 'A mature tree absorbs approximately 48 pounds (22 kg) of CO2 per year. Younger trees absorb less, while large mature trees in tropical regions can absorb significantly more.' },
   { q: 'Is tree planting enough to offset carbon emissions?', a: 'Tree planting is a valuable part of carbon offset strategies but should be combined with emission reductions. Trees take years to reach full absorption capacity, and planting alone cannot offset all human emissions.' }],
  'Trees Needed = (Annual CO2 in lbs) / (48 lbs absorbed per tree per year); Total Cost = Trees Needed x Cost Per Tree',
  ['carbon-footprint-calculator', 'composting-savings-calculator']
);

// #17 Insulation Savings Calculator
add('insulation-savings-calculator', 'Insulation Savings Calculator',
  'Estimate the energy savings and payback period from upgrading home insulation in walls, attic, or floors.',
  'Finance', 'finance', '$',
  ['insulation savings', 'home insulation ROI', 'insulation cost calculator'],
  [
    '{ name: "annualHeatingCooling", label: "Annual Heating and Cooling Cost", type: "number", prefix: "$", min: 100, max: 20000, defaultValue: 2000 }',
    '{ name: "currentRValue", label: "Current R-Value", type: "number", min: 1, max: 60, defaultValue: 11 }',
    '{ name: "newRValue", label: "New R-Value After Upgrade", type: "number", min: 1, max: 60, defaultValue: 38 }',
    '{ name: "upgradeCost", label: "Insulation Upgrade Cost", type: "number", prefix: "$", min: 100, max: 50000, defaultValue: 2500 }',
  ],
  `(inputs) => {
      const annualCost = inputs.annualHeatingCooling as number;
      const currentR = inputs.currentRValue as number;
      const newR = inputs.newRValue as number;
      const upgradeCost = inputs.upgradeCost as number;
      if (!annualCost || !currentR || !newR || currentR <= 0 || newR <= 0) return null;
      const savingsPercent = Math.max(0, (1 - currentR / newR)) * 100;
      const annualSavings = annualCost * (savingsPercent / 100);
      const paybackYears = annualSavings > 0 ? upgradeCost / annualSavings : 0;
      const tenYearSavings = annualSavings * 10 - upgradeCost;
      return {
        primary: { label: "Annual Energy Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        details: [
          { label: "Energy Reduction", value: formatNumber(Math.round(savingsPercent)) + "%" },
          { label: "Payback Period", value: formatNumber(Math.round(paybackYears * 10) / 10) + " years" },
          { label: "10-Year Net Savings", value: "$" + formatNumber(Math.round(tenYearSavings)) },
          { label: "R-Value Improvement", value: "R-" + formatNumber(currentR) + " to R-" + formatNumber(newR) },
        ],
      };
    }`,
  [{ q: 'What R-value should my attic insulation have?', a: 'The recommended attic R-value depends on climate zone. In cold climates, R-49 to R-60 is recommended. In moderate climates, R-38 to R-49 is standard. Warmer climates may need R-30 to R-38.' },
   { q: 'How much can insulation really save on energy bills?', a: 'Properly insulating an under-insulated home can reduce heating and cooling costs by 15% to 45%. The actual savings depend on the starting insulation level, climate, and home construction.' }],
  'Savings Percent = (1 - Current R-Value / New R-Value) x 100; Annual Savings = Annual Cost x Savings Percent; Payback = Upgrade Cost / Annual Savings',
  ['solar-panel-savings-calculator', 'led-vs-incandescent-calculator']
);

// #18 LED vs Incandescent Calculator
add('led-vs-incandescent-calculator', 'LED vs Incandescent Calculator',
  'Compare the cost savings and energy reduction from switching incandescent light bulbs to LED bulbs.',
  'Everyday', 'everyday', '~',
  ['LED savings calculator', 'LED vs incandescent', 'light bulb savings'],
  [
    '{ name: "numBulbs", label: "Number of Bulbs", type: "number", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "hoursPerDay", label: "Hours Used Per Day", type: "number", min: 0.5, max: 24, defaultValue: 5 }',
    '{ name: "incandescentWatts", label: "Incandescent Wattage", type: "number", suffix: "W", min: 25, max: 150, defaultValue: 60 }',
    '{ name: "ledWatts", label: "LED Equivalent Wattage", type: "number", suffix: "W", min: 2, max: 30, defaultValue: 9 }',
    '{ name: "electricityRate", label: "Electricity Rate (per kWh)", type: "number", prefix: "$", min: 0.01, max: 1, defaultValue: 0.13 }',
  ],
  `(inputs) => {
      const bulbs = inputs.numBulbs as number;
      const hours = inputs.hoursPerDay as number;
      const oldWatts = inputs.incandescentWatts as number;
      const newWatts = inputs.ledWatts as number;
      const rate = inputs.electricityRate as number;
      if (!bulbs || !hours || !oldWatts || !newWatts || !rate) return null;
      const oldAnnualKwh = bulbs * oldWatts * hours * 365 / 1000;
      const newAnnualKwh = bulbs * newWatts * hours * 365 / 1000;
      const savedKwh = oldAnnualKwh - newAnnualKwh;
      const annualSavings = savedKwh * rate;
      const energyReduction = (savedKwh / oldAnnualKwh) * 100;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings * 100) / 100) },
        details: [
          { label: "Energy Saved Per Year", value: formatNumber(Math.round(savedKwh)) + " kWh" },
          { label: "Energy Reduction", value: formatNumber(Math.round(energyReduction)) + "%" },
          { label: "Old Annual Usage", value: formatNumber(Math.round(oldAnnualKwh)) + " kWh" },
          { label: "New Annual Usage", value: formatNumber(Math.round(newAnnualKwh)) + " kWh" },
        ],
      };
    }`,
  [{ q: 'How much longer do LED bulbs last compared to incandescent?', a: 'LED bulbs typically last 25,000 to 50,000 hours, while incandescent bulbs last about 1,000 hours. This means one LED bulb can outlast 25 or more incandescent bulbs.' },
   { q: 'Are LED bulbs worth the higher upfront cost?', a: 'Yes, LED bulbs pay for themselves within months through energy savings. Over the lifetime of an LED bulb, you can save $50 to $100 per bulb compared to using incandescent replacements.' }],
  'Annual Savings = (Bulbs x (Old Watts - LED Watts) x Hours/Day x 365 / 1000) x Rate Per kWh',
  ['electricity-cost-calculator', 'insulation-savings-calculator']
);

// #19 Rainwater Harvesting Calculator
add('rainwater-harvesting-calculator', 'Rainwater Harvesting Calculator',
  'Estimate how much rainwater you can collect from your roof and the potential water bill savings.',
  'Everyday', 'everyday', '~',
  ['rainwater harvesting', 'rain collection calculator', 'rainwater savings'],
  [
    '{ name: "roofArea", label: "Roof Collection Area (sq ft)", type: "number", min: 100, max: 50000, defaultValue: 1500 }',
    '{ name: "annualRainfall", label: "Annual Rainfall (inches)", type: "number", min: 1, max: 100, defaultValue: 40 }',
    '{ name: "collectionEfficiency", label: "Collection Efficiency", type: "number", suffix: "%", min: 50, max: 95, defaultValue: 80 }',
    '{ name: "waterRate", label: "Water Rate (per 1000 gallons)", type: "number", prefix: "$", min: 1, max: 50, defaultValue: 6 }',
  ],
  `(inputs) => {
      const area = inputs.roofArea as number;
      const rainfall = inputs.annualRainfall as number;
      const efficiency = (inputs.collectionEfficiency as number) / 100;
      const rate = inputs.waterRate as number;
      if (!area || !rainfall) return null;
      const gallonsPerInchPerSqFt = 0.623;
      const annualGallons = area * rainfall * gallonsPerInchPerSqFt * efficiency;
      const monthlyGallons = annualGallons / 12;
      const annualSavings = (annualGallons / 1000) * rate;
      return {
        primary: { label: "Annual Rainwater Collected", value: formatNumber(Math.round(annualGallons)) + " gallons" },
        details: [
          { label: "Monthly Average Collection", value: formatNumber(Math.round(monthlyGallons)) + " gallons" },
          { label: "Annual Water Bill Savings", value: "$" + formatNumber(Math.round(annualSavings * 100) / 100) },
          { label: "Collection Efficiency", value: formatNumber(Math.round(efficiency * 100)) + "%" },
        ],
      };
    }`,
  [{ q: 'How is rainwater collection volume calculated?', a: 'One inch of rain on one square foot of roof produces about 0.623 gallons of water. Multiply roof area by annual rainfall and by collection efficiency to get total harvestable water.' },
   { q: 'Is rainwater harvesting legal everywhere?', a: 'Rainwater harvesting laws vary by state and country. Most US states allow it, but some have restrictions on volume or require permits. Check local regulations before installing a collection system.' }],
  'Annual Gallons = Roof Area x Annual Rainfall x 0.623 x Collection Efficiency; Savings = (Gallons / 1000) x Water Rate',
  ['water-usage-calculator', 'solar-panel-savings-calculator']
);

// #20 Electric Bill Split Calculator
add('electric-bill-split-calculator', 'Electric Bill Split Calculator',
  'Split the electricity bill fairly among roommates based on room size, occupancy, or equal share.',
  'Everyday', 'everyday', '~',
  ['split electric bill', 'roommate bill split', 'electricity bill divider'],
  [
    '{ name: "totalBill", label: "Total Electric Bill", type: "number", prefix: "$", min: 1, max: 10000, defaultValue: 200 }',
    '{ name: "numRoommates", label: "Number of Roommates", type: "number", min: 2, max: 20, defaultValue: 3 }',
    '{ name: "yourRoomSqFt", label: "Your Room Size (sq ft)", type: "number", min: 50, max: 5000, defaultValue: 150 }',
    '{ name: "totalSqFt", label: "Total Living Space (sq ft)", type: "number", min: 100, max: 20000, defaultValue: 900 }',
  ],
  `(inputs) => {
      const bill = inputs.totalBill as number;
      const roommates = inputs.numRoommates as number;
      const yourRoom = inputs.yourRoomSqFt as number;
      const totalSpace = inputs.totalSqFt as number;
      if (!bill || !roommates || roommates <= 0) return null;
      const equalShare = bill / roommates;
      const commonArea = totalSpace - (yourRoom * roommates > totalSpace ? totalSpace : yourRoom * roommates);
      const commonShare = (commonArea > 0 ? (commonArea / roommates) : 0);
      const yourPortion = (yourRoom + commonShare) / totalSpace;
      const sqFtShare = bill * yourPortion;
      return {
        primary: { label: "Equal Split Share", value: "$" + formatNumber(Math.round(equalShare * 100) / 100) },
        details: [
          { label: "Room-Size Based Share", value: "$" + formatNumber(Math.round(sqFtShare * 100) / 100) },
          { label: "Your Room Percentage", value: formatNumber(Math.round(yourPortion * 10000) / 100) + "%" },
          { label: "Total Bill", value: "$" + formatNumber(Math.round(bill * 100) / 100) },
          { label: "Number of Roommates", value: formatNumber(roommates) },
        ],
      };
    }`,
  [{ q: 'What is the fairest way to split an electric bill?', a: 'The fairest method depends on circumstances. Equal splits are simplest, while room-size splits account for space differences. Some roommates also consider personal appliance usage for a more precise division.' },
   { q: 'Should common areas be split equally?', a: 'Yes, shared spaces like kitchens, living rooms, and bathrooms are typically divided equally among all roommates regardless of individual room sizes. Only private room space is divided proportionally.' }],
  'Equal Share = Total Bill / Number of Roommates; Room-Size Share = Bill x (Your Room + Common Share) / Total Space',
  ['electricity-cost-calculator', 'water-usage-calculator']
);

// GROUP H - TRAVEL & TRANSPORTATION

// #21 Road Trip Cost Calculator
add('road-trip-cost-calculator', 'Road Trip Cost Calculator',
  'Calculate the total fuel cost and expenses for a road trip based on distance, fuel economy, and gas prices.',
  'Everyday', 'everyday', '~',
  ['road trip cost', 'trip fuel cost', 'driving cost calculator'],
  [
    '{ name: "totalMiles", label: "Total Trip Distance (miles)", type: "number", min: 1, max: 50000, defaultValue: 500 }',
    '{ name: "mpg", label: "Vehicle MPG", type: "number", min: 5, max: 100, defaultValue: 28 }',
    '{ name: "gasPrice", label: "Gas Price Per Gallon", type: "number", prefix: "$", min: 1, max: 10, defaultValue: 3.50 }',
    '{ name: "tolls", label: "Estimated Tolls", type: "number", prefix: "$", min: 0, max: 1000, defaultValue: 20 }',
    '{ name: "numPassengers", label: "Number of Passengers Splitting Cost", type: "number", min: 1, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const miles = inputs.totalMiles as number;
      const mpg = inputs.mpg as number;
      const price = inputs.gasPrice as number;
      const tolls = inputs.tolls as number;
      const passengers = inputs.numPassengers as number;
      if (!miles || !mpg || mpg <= 0 || !passengers) return null;
      const gallonsNeeded = miles / mpg;
      const fuelCost = gallonsNeeded * price;
      const totalCost = fuelCost + tolls;
      const costPerPerson = totalCost / passengers;
      const costPerMile = totalCost / miles;
      return {
        primary: { label: "Total Trip Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        details: [
          { label: "Fuel Cost", value: "$" + formatNumber(Math.round(fuelCost * 100) / 100) },
          { label: "Gallons Needed", value: formatNumber(Math.round(gallonsNeeded * 10) / 10) },
          { label: "Cost Per Person", value: "$" + formatNumber(Math.round(costPerPerson * 100) / 100) },
          { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How do I estimate my vehicle fuel economy?', a: 'Check your vehicle owner manual or look up the EPA fuel economy rating at fueleconomy.gov. Real-world mileage may vary based on driving conditions, speed, and maintenance.' },
   { q: 'What other costs should I consider for a road trip?', a: 'Beyond fuel and tolls, consider meals, lodging, parking fees, vehicle wear and tear, and potential emergency expenses. Budget an extra 10-20% for unexpected costs.' }],
  'Fuel Cost = (Total Miles / MPG) x Gas Price; Total Cost = Fuel Cost + Tolls; Cost Per Person = Total Cost / Passengers',
  ['commute-cost-calculator', 'flight-cost-per-mile-calculator']
);

// #22 Flight Cost Per Mile Calculator
add('flight-cost-per-mile-calculator', 'Flight Cost Per Mile Calculator',
  'Calculate the cost per mile of a flight to compare value across different routes and airlines.',
  'Everyday', 'everyday', '~',
  ['flight cost per mile', 'airfare value', 'flight cost calculator'],
  [
    '{ name: "ticketPrice", label: "Ticket Price", type: "number", prefix: "$", min: 1, max: 50000, defaultValue: 350 }',
    '{ name: "flightDistance", label: "Flight Distance (miles)", type: "number", min: 50, max: 15000, defaultValue: 1500 }',
    '{ name: "baggageFees", label: "Baggage Fees", type: "number", prefix: "$", min: 0, max: 500, defaultValue: 35 }',
    '{ name: "seatUpgrade", label: "Seat Upgrade Fees", type: "number", prefix: "$", min: 0, max: 5000, defaultValue: 0 }',
  ],
  `(inputs) => {
      const price = inputs.ticketPrice as number;
      const distance = inputs.flightDistance as number;
      const baggage = inputs.baggageFees as number;
      const upgrade = inputs.seatUpgrade as number;
      if (!price || !distance || distance <= 0) return null;
      const totalCost = price + baggage + upgrade;
      const costPerMile = totalCost / distance;
      const centsPerMile = costPerMile * 100;
      return {
        primary: { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 1000) / 1000) },
        details: [
          { label: "Cents Per Mile", value: formatNumber(Math.round(centsPerMile * 10) / 10) + " cents" },
          { label: "Total Flight Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
          { label: "Base Ticket Price", value: "$" + formatNumber(Math.round(price * 100) / 100) },
          { label: "Total Fees", value: "$" + formatNumber(Math.round((baggage + upgrade) * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'What is a good cost per mile for a flight?', a: 'Domestic flights in the US typically range from 10 to 25 cents per mile. International long-haul flights can be as low as 5 to 10 cents per mile. Lower cost per mile generally indicates better value.' },
   { q: 'How do I find the distance of a flight?', a: 'Use an online flight distance calculator or check the airline booking page. Most booking sites show flight distance, or you can estimate using the great circle distance between airports.' }],
  'Cost Per Mile = (Ticket Price + Baggage Fees + Upgrade Fees) / Flight Distance',
  ['road-trip-cost-calculator', 'travel-budget-calculator']
);

// #23 Travel Budget Calculator
add('travel-budget-calculator', 'Travel Budget Calculator',
  'Estimate a daily and total travel budget based on destination cost level and trip duration.',
  'Finance', 'finance', '$',
  ['travel budget', 'trip cost estimator', 'vacation budget calculator'],
  [
    '{ name: "tripDays", label: "Trip Duration (days)", type: "number", min: 1, max: 365, defaultValue: 7 }',
    '{ name: "dailyHotel", label: "Daily Accommodation Cost", type: "number", prefix: "$", min: 0, max: 5000, defaultValue: 120 }',
    '{ name: "dailyFood", label: "Daily Food Budget", type: "number", prefix: "$", min: 10, max: 1000, defaultValue: 60 }',
    '{ name: "dailyTransport", label: "Daily Local Transport", type: "number", prefix: "$", min: 0, max: 500, defaultValue: 25 }',
    '{ name: "dailyActivities", label: "Daily Activities Budget", type: "number", prefix: "$", min: 0, max: 1000, defaultValue: 40 }',
  ],
  `(inputs) => {
      const days = inputs.tripDays as number;
      const hotel = inputs.dailyHotel as number;
      const food = inputs.dailyFood as number;
      const transport = inputs.dailyTransport as number;
      const activities = inputs.dailyActivities as number;
      if (!days) return null;
      const dailyTotal = hotel + food + transport + activities;
      const tripTotal = dailyTotal * days;
      const emergencyFund = tripTotal * 0.1;
      return {
        primary: { label: "Total Trip Budget", value: "$" + formatNumber(Math.round(tripTotal)) },
        details: [
          { label: "Daily Budget", value: "$" + formatNumber(Math.round(dailyTotal)) },
          { label: "Accommodation Total", value: "$" + formatNumber(Math.round(hotel * days)) },
          { label: "Food Total", value: "$" + formatNumber(Math.round(food * days)) },
          { label: "Recommended Emergency Fund (10%)", value: "$" + formatNumber(Math.round(emergencyFund)) },
        ],
      };
    }`,
  [{ q: 'How much should I budget per day for travel?', a: 'Daily budgets vary widely by destination. Budget travelers might spend $30-50/day in Southeast Asia, $50-100 in Eastern Europe, and $150-300 in Western Europe or major US cities.' },
   { q: 'Should I include an emergency fund in my travel budget?', a: 'Yes, it is wise to set aside 10-15% of your total budget for unexpected expenses like medical emergencies, flight changes, or lost items. Having a buffer reduces financial stress while traveling.' }],
  'Total Budget = (Daily Accommodation + Food + Transport + Activities) x Trip Days; Emergency Fund = Total x 10%',
  ['currency-exchange-calculator', 'hotel-vs-airbnb-calculator']
);

// #24 Currency Exchange Calculator
add('currency-exchange-calculator', 'Currency Exchange Calculator',
  'Convert between currencies and account for exchange fees to determine the true cost of currency conversion.',
  'Finance', 'finance', '$',
  ['currency exchange', 'currency converter', 'forex calculator'],
  [
    '{ name: "amount", label: "Amount to Convert", type: "number", min: 0.01, max: 10000000, defaultValue: 1000 }',
    '{ name: "exchangeRate", label: "Exchange Rate", type: "number", min: 0.0001, max: 100000, defaultValue: 0.85 }',
    '{ name: "feePercent", label: "Exchange Fee", type: "number", suffix: "%", min: 0, max: 20, defaultValue: 3 }',
  ],
  `(inputs) => {
      const amount = inputs.amount as number;
      const rate = inputs.exchangeRate as number;
      const fee = (inputs.feePercent as number) / 100;
      if (!amount || !rate) return null;
      const convertedAmount = amount * rate;
      const feeAmount = amount * fee;
      const netAmount = (amount - feeAmount) * rate;
      const effectiveRate = netAmount / amount;
      return {
        primary: { label: "Converted Amount", value: formatNumber(Math.round(convertedAmount * 100) / 100) },
        details: [
          { label: "After Fees", value: formatNumber(Math.round(netAmount * 100) / 100) },
          { label: "Fee Charged", value: formatNumber(Math.round(feeAmount * 100) / 100) },
          { label: "Effective Exchange Rate", value: formatNumber(Math.round(effectiveRate * 10000) / 10000) },
          { label: "Fee Lost in Conversion", value: formatNumber(Math.round((convertedAmount - netAmount) * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'Where can I get the best exchange rate?', a: 'Banks and credit unions generally offer better rates than airport kiosks or hotels. Using a credit card with no foreign transaction fees often provides the best exchange rate available.' },
   { q: 'What is a typical currency exchange fee?', a: 'Exchange fees typically range from 1% to 5%. Banks may charge 1-3%, airport kiosks 5-10%, and credit cards with foreign transaction fees add 2-3%. Some online services offer fees below 1%.' }],
  'Converted Amount = Amount x Exchange Rate; After Fees = (Amount - Amount x Fee%) x Exchange Rate',
  ['travel-budget-calculator', 'points-value-calculator']
);

// #25 Hotel vs Airbnb Calculator
add('hotel-vs-airbnb-calculator', 'Hotel vs Airbnb Calculator',
  'Compare the total cost of staying in a hotel versus an Airbnb including fees, taxes, and amenities.',
  'Everyday', 'everyday', '~',
  ['hotel vs airbnb', 'accommodation comparison', 'hotel airbnb cost'],
  [
    '{ name: "nights", label: "Number of Nights", type: "number", min: 1, max: 365, defaultValue: 5 }',
    '{ name: "hotelNightly", label: "Hotel Nightly Rate", type: "number", prefix: "$", min: 1, max: 5000, defaultValue: 150 }',
    '{ name: "hotelTaxPercent", label: "Hotel Tax Rate", type: "number", suffix: "%", min: 0, max: 30, defaultValue: 14 }',
    '{ name: "airbnbNightly", label: "Airbnb Nightly Rate", type: "number", prefix: "$", min: 1, max: 5000, defaultValue: 120 }',
    '{ name: "airbnbCleaningFee", label: "Airbnb Cleaning Fee", type: "number", prefix: "$", min: 0, max: 500, defaultValue: 75 }',
  ],
  `(inputs) => {
      const nights = inputs.nights as number;
      const hotelRate = inputs.hotelNightly as number;
      const hotelTax = (inputs.hotelTaxPercent as number) / 100;
      const airbnbRate = inputs.airbnbNightly as number;
      const cleaningFee = inputs.airbnbCleaningFee as number;
      if (!nights) return null;
      const hotelSubtotal = hotelRate * nights;
      const hotelTotal = hotelSubtotal * (1 + hotelTax);
      const airbnbServiceFee = airbnbRate * nights * 0.14;
      const airbnbTotal = (airbnbRate * nights) + cleaningFee + airbnbServiceFee;
      const savings = hotelTotal - airbnbTotal;
      const cheaper = savings > 0 ? "Airbnb" : "Hotel";
      return {
        primary: { label: "Savings with " + cheaper, value: "$" + formatNumber(Math.round(Math.abs(savings) * 100) / 100) },
        details: [
          { label: "Hotel Total", value: "$" + formatNumber(Math.round(hotelTotal * 100) / 100) },
          { label: "Airbnb Total", value: "$" + formatNumber(Math.round(airbnbTotal * 100) / 100) },
          { label: "Hotel Per Night (with tax)", value: "$" + formatNumber(Math.round(hotelTotal / nights * 100) / 100) },
          { label: "Airbnb Per Night (all-in)", value: "$" + formatNumber(Math.round(airbnbTotal / nights * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'When is a hotel better value than an Airbnb?', a: 'Hotels tend to be better value for single-night stays, business travel, and when amenities like breakfast, gym, and daily cleaning are included. Airbnb cleaning fees can make short stays more expensive.' },
   { q: 'What hidden fees should I watch for?', a: 'Hotels may add resort fees, parking charges, and Wi-Fi fees. Airbnbs may have cleaning fees, service fees (typically 14%), and security deposits. Always compare the all-in total cost.' }],
  'Hotel Total = Nightly Rate x Nights x (1 + Tax Rate); Airbnb Total = (Nightly Rate x Nights) + Cleaning Fee + Service Fee',
  ['travel-budget-calculator', 'road-trip-cost-calculator']
);

// #26 Luggage Weight Calculator
add('luggage-weight-calculator', 'Luggage Weight Calculator',
  'Check if your luggage is within airline weight limits and calculate potential overweight baggage fees.',
  'Everyday', 'everyday', '~',
  ['luggage weight', 'baggage weight calculator', 'overweight luggage fee'],
  [
    '{ name: "bagWeight", label: "Bag Weight", type: "number", suffix: "lbs", min: 0.1, max: 200, defaultValue: 45 }',
    '{ name: "weightLimit", label: "Airline Weight Limit", type: "number", suffix: "lbs", min: 20, max: 100, defaultValue: 50 }',
    '{ name: "overweightFee", label: "Overweight Fee", type: "number", prefix: "$", min: 0, max: 500, defaultValue: 100 }',
    '{ name: "numBags", label: "Number of Bags", type: "number", min: 1, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const weight = inputs.bagWeight as number;
      const limit = inputs.weightLimit as number;
      const fee = inputs.overweightFee as number;
      const bags = inputs.numBags as number;
      if (!weight || !limit || !bags) return null;
      const overweight = Math.max(0, weight - limit);
      const totalWeight = weight * bags;
      const totalOverweight = overweight * bags;
      const totalFees = overweight > 0 ? fee * bags : 0;
      const withinLimit = overweight <= 0;
      return {
        primary: { label: "Status", value: withinLimit ? "Within Limit" : formatNumber(Math.round(overweight * 10) / 10) + " lbs over" },
        details: [
          { label: "Total Weight (all bags)", value: formatNumber(Math.round(totalWeight * 10) / 10) + " lbs" },
          { label: "Weight Limit Per Bag", value: formatNumber(limit) + " lbs" },
          { label: "Total Overweight Fees", value: "$" + formatNumber(totalFees) },
          { label: "Remaining Allowance Per Bag", value: withinLimit ? formatNumber(Math.round((limit - weight) * 10) / 10) + " lbs" : "0 lbs" },
        ],
      };
    }`,
  [{ q: 'What is the standard checked bag weight limit?', a: 'Most airlines allow 50 pounds (23 kg) for economy class checked bags. Business and first class passengers often get a 70-pound (32 kg) allowance. Carry-on limits are typically around 15-22 pounds.' },
   { q: 'How much do overweight baggage fees cost?', a: 'Overweight fees typically range from $50 to $200 per bag depending on the airline and how much the bag exceeds the limit. Bags over 70 pounds may not be accepted at all by some carriers.' }],
  'Overweight = Bag Weight - Weight Limit; Total Fees = Overweight Fee x Number of Bags (if overweight)',
  ['flight-cost-per-mile-calculator', 'travel-budget-calculator']
);

// #27 Jet Lag Calculator
add('jet-lag-calculator', 'Jet Lag Calculator',
  'Estimate jet lag recovery time based on the number of time zones crossed and travel direction.',
  'Everyday', 'everyday', '~',
  ['jet lag calculator', 'jet lag recovery', 'time zone adjustment'],
  [
    '{ name: "timeZonesCrossed", label: "Time Zones Crossed", type: "number", min: 1, max: 12, defaultValue: 6 }',
    '{ name: "direction", label: "Travel Direction (1=East, 2=West)", type: "number", min: 1, max: 2, defaultValue: 1 }',
    '{ name: "age", label: "Your Age", type: "number", min: 10, max: 100, defaultValue: 35 }',
  ],
  `(inputs) => {
      const zones = inputs.timeZonesCrossed as number;
      const direction = inputs.direction as number;
      const age = inputs.age as number;
      if (!zones) return null;
      const baseRecoveryDays = direction === 1 ? zones * 1.5 : zones * 1.0;
      const ageFactor = age > 50 ? 1.3 : age > 35 ? 1.1 : 1.0;
      const recoveryDays = Math.ceil(baseRecoveryDays * ageFactor);
      const peakJetLagDay = Math.min(Math.ceil(zones / 3), 3);
      const directionLabel = direction === 1 ? "Eastward" : "Westward";
      return {
        primary: { label: "Estimated Recovery Time", value: formatNumber(recoveryDays) + " days" },
        details: [
          { label: "Travel Direction", value: directionLabel },
          { label: "Time Zones Crossed", value: formatNumber(zones) },
          { label: "Peak Jet Lag Day", value: "Day " + formatNumber(peakJetLagDay) },
          { label: "Age Adjustment Factor", value: formatNumber(Math.round(ageFactor * 100) / 100) + "x" },
        ],
      };
    }`,
  [{ q: 'Is jet lag worse when flying east or west?', a: 'Flying east is generally harder because your body must advance its internal clock, which is more difficult than delaying it. Eastward travel typically requires about 50% more recovery time than westward travel.' },
   { q: 'How can I reduce jet lag symptoms?', a: 'Start adjusting your sleep schedule before travel, stay hydrated, avoid alcohol and caffeine, get sunlight at your destination, and consider melatonin supplements. Gradual adjustment reduces severity.' }],
  'Recovery Days = Time Zones x Direction Factor (1.5 for east, 1.0 for west) x Age Factor',
  ['travel-budget-calculator', 'flight-cost-per-mile-calculator']
);

// #28 Travel Insurance Value Calculator
add('travel-insurance-value-calculator', 'Travel Insurance Value Calculator',
  'Determine whether travel insurance is worth purchasing based on trip cost and potential risk factors.',
  'Finance', 'finance', '$',
  ['travel insurance value', 'travel insurance calculator', 'trip insurance worth it'],
  [
    '{ name: "tripCost", label: "Total Trip Cost", type: "number", prefix: "$", min: 100, max: 500000, defaultValue: 5000 }',
    '{ name: "insuranceCost", label: "Insurance Premium", type: "number", prefix: "$", min: 10, max: 10000, defaultValue: 350 }',
    '{ name: "cancellationRisk", label: "Cancellation Risk (%)", type: "number", suffix: "%", min: 1, max: 50, defaultValue: 10 }',
    '{ name: "medicalCoverage", label: "Medical Coverage Amount", type: "number", prefix: "$", min: 0, max: 1000000, defaultValue: 100000 }',
  ],
  `(inputs) => {
      const tripCost = inputs.tripCost as number;
      const premium = inputs.insuranceCost as number;
      const risk = (inputs.cancellationRisk as number) / 100;
      const medical = inputs.medicalCoverage as number;
      if (!tripCost || !premium) return null;
      const expectedLoss = tripCost * risk;
      const netValue = expectedLoss - premium;
      const breakEvenRisk = (premium / tripCost) * 100;
      const premiumPercent = (premium / tripCost) * 100;
      const worthIt = netValue > 0;
      return {
        primary: { label: "Insurance Value Assessment", value: worthIt ? "Recommended" : "Optional" },
        details: [
          { label: "Expected Loss Without Insurance", value: "$" + formatNumber(Math.round(expectedLoss)) },
          { label: "Net Expected Value", value: "$" + formatNumber(Math.round(netValue)) },
          { label: "Premium as % of Trip Cost", value: formatNumber(Math.round(premiumPercent * 10) / 10) + "%" },
          { label: "Break-Even Cancellation Risk", value: formatNumber(Math.round(breakEvenRisk * 10) / 10) + "%" },
        ],
      };
    }`,
  [{ q: 'How much does travel insurance typically cost?', a: 'Travel insurance typically costs 5% to 10% of the total trip cost. Comprehensive plans covering medical, cancellation, and baggage may cost more, while basic cancellation-only plans cost less.' },
   { q: 'When is travel insurance most worth it?', a: 'Travel insurance provides the most value for expensive trips, international travel, trips with non-refundable bookings, travelers with health concerns, and trips during hurricane or weather-risk seasons.' }],
  'Expected Loss = Trip Cost x Cancellation Risk; Net Value = Expected Loss - Premium; Break-Even Risk = Premium / Trip Cost',
  ['travel-budget-calculator', 'flight-cost-per-mile-calculator']
);

// #29 Points Value Calculator
add('points-value-calculator', 'Points Value Calculator',
  'Calculate the monetary value of credit card or airline reward points and determine the best redemption option.',
  'Finance', 'finance', '$',
  ['points value calculator', 'reward points value', 'airline miles value'],
  [
    '{ name: "totalPoints", label: "Total Points or Miles", type: "number", min: 100, max: 10000000, defaultValue: 50000 }',
    '{ name: "cashValue", label: "Cash Redemption Value", type: "number", prefix: "$", min: 1, max: 100000, defaultValue: 500 }',
    '{ name: "travelValue", label: "Travel Redemption Value", type: "number", prefix: "$", min: 1, max: 100000, defaultValue: 750 }',
  ],
  `(inputs) => {
      const points = inputs.totalPoints as number;
      const cashVal = inputs.cashValue as number;
      const travelVal = inputs.travelValue as number;
      if (!points || points <= 0) return null;
      const centsPerPointCash = (cashVal / points) * 100;
      const centsPerPointTravel = (travelVal / points) * 100;
      const betterOption = travelVal > cashVal ? "Travel" : "Cash";
      const bonusValue = Math.abs(travelVal - cashVal);
      return {
        primary: { label: "Best Redemption", value: betterOption + " ($" + formatNumber(Math.round(Math.max(cashVal, travelVal))) + ")" },
        details: [
          { label: "Cash Value Per Point", value: formatNumber(Math.round(centsPerPointCash * 100) / 100) + " cents" },
          { label: "Travel Value Per Point", value: formatNumber(Math.round(centsPerPointTravel * 100) / 100) + " cents" },
          { label: "Bonus for " + betterOption + " Redemption", value: "$" + formatNumber(Math.round(bonusValue)) },
          { label: "Total Points", value: formatNumber(points) },
        ],
      };
    }`,
  [{ q: 'What is a good value per point for credit card rewards?', a: 'Most credit card points are worth 1 to 2 cents each for cash back. Through travel portals or transfer partners, you can often get 1.5 to 3 cents or more per point, making travel redemptions more valuable.' },
   { q: 'Should I save points or spend them regularly?', a: 'Points can be devalued over time through program changes. It is generally better to use them when you have a specific high-value redemption rather than hoarding indefinitely. Set a target and save toward it.' }],
  'Cash Value Per Point = Cash Redemption / Total Points; Travel Value Per Point = Travel Redemption / Total Points',
  ['currency-exchange-calculator', 'travel-budget-calculator']
);

// #30 Commute Cost Calculator
add('commute-cost-calculator', 'Commute Cost Calculator',
  'Calculate and compare the annual cost of commuting by car versus public transit.',
  'Everyday', 'everyday', '~',
  ['commute cost', 'commuting calculator', 'commute expense calculator'],
  [
    '{ name: "milesOneWay", label: "One-Way Commute (miles)", type: "number", min: 0.5, max: 200, defaultValue: 20 }',
    '{ name: "workDaysPerYear", label: "Work Days Per Year", type: "number", min: 50, max: 365, defaultValue: 250 }',
    '{ name: "mpg", label: "Vehicle MPG", type: "number", min: 5, max: 100, defaultValue: 28 }',
    '{ name: "gasPrice", label: "Gas Price Per Gallon", type: "number", prefix: "$", min: 1, max: 10, defaultValue: 3.50 }',
    '{ name: "monthlyTransitPass", label: "Monthly Transit Pass Cost", type: "number", prefix: "$", min: 0, max: 500, defaultValue: 100 }',
  ],
  `(inputs) => {
      const miles = inputs.milesOneWay as number;
      const workDays = inputs.workDaysPerYear as number;
      const mpg = inputs.mpg as number;
      const gasPrice = inputs.gasPrice as number;
      const transitPass = inputs.monthlyTransitPass as number;
      if (!miles || !workDays || !mpg || mpg <= 0) return null;
      const annualMiles = miles * 2 * workDays;
      const annualFuelCost = (annualMiles / mpg) * gasPrice;
      const annualMaintenance = annualMiles * 0.10;
      const annualCarCost = annualFuelCost + annualMaintenance;
      const annualTransitCost = transitPass * 12;
      const savings = annualCarCost - annualTransitCost;
      return {
        primary: { label: "Annual Car Commute Cost", value: "$" + formatNumber(Math.round(annualCarCost)) },
        details: [
          { label: "Annual Fuel Cost", value: "$" + formatNumber(Math.round(annualFuelCost)) },
          { label: "Annual Maintenance Estimate", value: "$" + formatNumber(Math.round(annualMaintenance)) },
          { label: "Annual Transit Cost", value: "$" + formatNumber(Math.round(annualTransitCost)) },
          { label: "Annual Savings with Transit", value: "$" + formatNumber(Math.round(savings)) },
        ],
      };
    }`,
  [{ q: 'What is the true cost per mile of driving?', a: 'The IRS standard mileage rate is approximately $0.67 per mile, which includes fuel, insurance, depreciation, and maintenance. Actual costs vary based on vehicle type, age, and driving conditions.' },
   { q: 'How much can I save by switching to public transit?', a: 'Savings depend on commute distance and local transit costs. The average American can save $2,000 to $10,000 per year by switching from driving to public transit, according to the American Public Transportation Association.' }],
  'Annual Car Cost = (Miles x 2 x Work Days / MPG x Gas Price) + (Annual Miles x $0.10 maintenance); Transit Cost = Monthly Pass x 12',
  ['road-trip-cost-calculator', 'flight-cost-per-mile-calculator']
);

// GROUP I - RETIREMENT & ESTATE

// #31 Retirement Income Calculator
add('retirement-income-calculator', 'Retirement Income Calculator',
  'Estimate the monthly income you can draw from your retirement savings based on your nest egg and withdrawal rate.',
  'Finance', 'finance', '$',
  ['retirement income', 'retirement withdrawal', 'retirement spending calculator'],
  [
    '{ name: "totalSavings", label: "Total Retirement Savings", type: "number", prefix: "$", min: 1000, max: 50000000, defaultValue: 500000 }',
    '{ name: "withdrawalRate", label: "Annual Withdrawal Rate", type: "number", suffix: "%", min: 1, max: 15, defaultValue: 4 }',
    '{ name: "socialSecurity", label: "Monthly Social Security", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 1800 }',
    '{ name: "otherIncome", label: "Other Monthly Income", type: "number", prefix: "$", min: 0, max: 50000, defaultValue: 0 }',
  ],
  `(inputs) => {
      const savings = inputs.totalSavings as number;
      const rate = (inputs.withdrawalRate as number) / 100;
      const ss = inputs.socialSecurity as number;
      const other = inputs.otherIncome as number;
      if (!savings) return null;
      const annualWithdrawal = savings * rate;
      const monthlyWithdrawal = annualWithdrawal / 12;
      const totalMonthly = monthlyWithdrawal + ss + other;
      const yearsLasting = rate > 0 ? Math.round(1 / rate) : 0;
      return {
        primary: { label: "Total Monthly Income", value: "$" + formatNumber(Math.round(totalMonthly)) },
        details: [
          { label: "Monthly from Savings", value: "$" + formatNumber(Math.round(monthlyWithdrawal)) },
          { label: "Monthly Social Security", value: "$" + formatNumber(Math.round(ss)) },
          { label: "Annual Withdrawal", value: "$" + formatNumber(Math.round(annualWithdrawal)) },
          { label: "Estimated Years Savings Last", value: formatNumber(yearsLasting) + " years (simplified)" },
        ],
      };
    }`,
  [{ q: 'What is the 4% withdrawal rule?', a: 'The 4% rule suggests withdrawing 4% of your retirement savings in the first year, then adjusting for inflation each year. Historical data shows this approach has a high probability of lasting 30 years.' },
   { q: 'How much do I need saved to retire comfortably?', a: 'A common guideline is to save 25 times your desired annual spending. For example, if you need $50,000 per year, aim for $1,250,000 in savings. Actual needs vary based on lifestyle and other income sources.' }],
  'Monthly Income = (Total Savings x Withdrawal Rate / 12) + Social Security + Other Income',
  ['social-security-break-even-calculator', 'required-minimum-distribution-calculator']
);

// #32 Social Security Break-Even Calculator
add('social-security-break-even-calculator', 'Social Security Break-Even Calculator',
  'Determine the best age to claim Social Security benefits by comparing total payouts at different claiming ages.',
  'Finance', 'finance', '$',
  ['social security break even', 'when to claim social security', 'SS claiming age'],
  [
    '{ name: "benefit62", label: "Monthly Benefit at Age 62", type: "number", prefix: "$", min: 100, max: 10000, defaultValue: 1400 }',
    '{ name: "benefitFRA", label: "Monthly Benefit at Full Retirement Age", type: "number", prefix: "$", min: 100, max: 10000, defaultValue: 2000 }',
    '{ name: "benefit70", label: "Monthly Benefit at Age 70", type: "number", prefix: "$", min: 100, max: 10000, defaultValue: 2480 }',
    '{ name: "fra", label: "Full Retirement Age", type: "number", min: 65, max: 67, defaultValue: 67 }',
  ],
  `(inputs) => {
      const b62 = inputs.benefit62 as number;
      const bFRA = inputs.benefitFRA as number;
      const b70 = inputs.benefit70 as number;
      const fra = inputs.fra as number;
      if (!b62 || !bFRA || !b70) return null;
      const annual62 = b62 * 12;
      const annualFRA = bFRA * 12;
      const annual70 = b70 * 12;
      const headStart62 = annual62 * (fra - 62);
      let breakEvenAge62vsFRA = fra;
      let cumul62 = headStart62;
      let cumulFRA = 0;
      while (cumul62 > cumulFRA && breakEvenAge62vsFRA < 100) {
        breakEvenAge62vsFRA++;
        cumul62 += annual62;
        cumulFRA += annualFRA;
      }
      let breakEvenAgeFRAvs70 = 70;
      let cumulFRA2 = annualFRA * (70 - fra);
      let cumul70 = 0;
      while (cumulFRA2 > cumul70 && breakEvenAgeFRAvs70 < 100) {
        breakEvenAgeFRAvs70++;
        cumulFRA2 += annualFRA;
        cumul70 += annual70;
      }
      return {
        primary: { label: "Break-Even Age (62 vs FRA)", value: "Age " + formatNumber(breakEvenAge62vsFRA) },
        details: [
          { label: "Break-Even Age (FRA vs 70)", value: "Age " + formatNumber(breakEvenAgeFRAvs70) },
          { label: "Annual Benefit at 62", value: "$" + formatNumber(annual62) },
          { label: "Annual Benefit at FRA", value: "$" + formatNumber(annualFRA) },
          { label: "Annual Benefit at 70", value: "$" + formatNumber(annual70) },
        ],
      };
    }`,
  [{ q: 'What is the full retirement age for Social Security?', a: 'Full retirement age (FRA) is 66 for those born between 1943 and 1954, gradually increasing to 67 for those born in 1960 or later. Claiming before FRA permanently reduces monthly benefits.' },
   { q: 'How much more do I get by waiting until 70?', a: 'Benefits increase by about 8% per year for each year you delay past your full retirement age, up to age 70. Waiting from age 62 to 70 can increase monthly benefits by approximately 76%.' }],
  'Break-Even Age = Age where cumulative benefits from later claiming exceed cumulative benefits from earlier claiming',
  ['retirement-income-calculator', 'pension-vs-lump-sum-calculator']
);

// #33 Pension vs Lump Sum Calculator
add('pension-vs-lump-sum-calculator', 'Pension vs Lump Sum Calculator',
  'Compare the value of a monthly pension annuity versus taking a lump sum distribution from a retirement plan.',
  'Finance', 'finance', '$',
  ['pension vs lump sum', 'annuity vs lump sum', 'pension buyout calculator'],
  [
    '{ name: "monthlyPension", label: "Monthly Pension Amount", type: "number", prefix: "$", min: 100, max: 50000, defaultValue: 2500 }',
    '{ name: "lumpSum", label: "Lump Sum Offer", type: "number", prefix: "$", min: 10000, max: 10000000, defaultValue: 400000 }',
    '{ name: "yearsInRetirement", label: "Expected Years in Retirement", type: "number", min: 5, max: 50, defaultValue: 25 }',
    '{ name: "investmentReturn", label: "Expected Investment Return", type: "number", suffix: "%", min: 0, max: 15, defaultValue: 5 }',
  ],
  `(inputs) => {
      const pension = inputs.monthlyPension as number;
      const lump = inputs.lumpSum as number;
      const years = inputs.yearsInRetirement as number;
      const returnRate = (inputs.investmentReturn as number) / 100;
      if (!pension || !lump || !years) return null;
      const totalPension = pension * 12 * years;
      const monthlyReturn = returnRate / 12;
      let lumpBalance = lump;
      const monthlyFromLump = monthlyReturn > 0 ? (lump * monthlyReturn) / (1 - Math.pow(1 + monthlyReturn, -(years * 12))) : lump / (years * 12);
      const totalFromLump = monthlyFromLump * years * 12;
      const betterOption = totalPension > totalFromLump ? "Pension" : "Lump Sum";
      return {
        primary: { label: "Better Option", value: betterOption },
        details: [
          { label: "Total Pension Payout", value: "$" + formatNumber(Math.round(totalPension)) },
          { label: "Monthly Pension", value: "$" + formatNumber(Math.round(pension)) },
          { label: "Monthly from Lump Sum", value: "$" + formatNumber(Math.round(monthlyFromLump)) },
          { label: "Total from Lump Sum", value: "$" + formatNumber(Math.round(totalFromLump)) },
        ],
      };
    }`,
  [{ q: 'When is the lump sum a better choice?', a: 'A lump sum may be better if you can earn a higher return than the pension implicit rate, have a shorter life expectancy, want to leave money to heirs, or need flexibility with your funds.' },
   { q: 'What are the risks of each option?', a: 'Pensions provide guaranteed income but end at death (unless survivor benefits apply) and may not keep up with inflation. Lump sums offer flexibility but carry investment risk and the danger of outliving your money.' }],
  'Total Pension = Monthly x 12 x Years; Monthly from Lump = Lump x (r/12) / (1 - (1 + r/12)^(-Years x 12)) where r = annual return',
  ['retirement-income-calculator', 'social-security-break-even-calculator']
);

// #34 Required Minimum Distribution Calculator
add('required-minimum-distribution-calculator', 'Required Minimum Distribution Calculator',
  'Calculate the required minimum distribution (RMD) from traditional IRA or 401(k) accounts based on age and balance.',
  'Finance', 'finance', '$',
  ['RMD calculator', 'required minimum distribution', 'IRA RMD calculator'],
  [
    '{ name: "accountBalance", label: "Account Balance (Dec 31)", type: "number", prefix: "$", min: 1000, max: 50000000, defaultValue: 500000 }',
    '{ name: "age", label: "Your Age This Year", type: "number", min: 72, max: 120, defaultValue: 73 }',
  ],
  `(inputs) => {
      const balance = inputs.accountBalance as number;
      const age = inputs.age as number;
      if (!balance || !age) return null;
      const lifeExpectancy: Record<number, number> = {
        72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
        79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0,
        86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8,
        93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4
      };
      const factor = lifeExpectancy[Math.min(Math.max(age, 72), 100)] || 6.4;
      const rmd = balance / factor;
      const monthlyRmd = rmd / 12;
      const percentOfBalance = (rmd / balance) * 100;
      return {
        primary: { label: "Required Minimum Distribution", value: "$" + formatNumber(Math.round(rmd)) },
        details: [
          { label: "Monthly RMD", value: "$" + formatNumber(Math.round(monthlyRmd)) },
          { label: "Distribution Factor", value: formatNumber(factor) },
          { label: "Percentage of Balance", value: formatNumber(Math.round(percentOfBalance * 10) / 10) + "%" },
          { label: "Account Balance", value: "$" + formatNumber(Math.round(balance)) },
        ],
      };
    }`,
  [{ q: 'When must I start taking RMDs?', a: 'Under current law, RMDs must begin by April 1 of the year after you turn 73 (as of 2023). Roth IRAs do not require RMDs during the owner lifetime, but inherited Roth IRAs may have distribution requirements.' },
   { q: 'What happens if I do not take my RMD?', a: 'The penalty for missing an RMD is 25% of the amount not withdrawn (reduced from the previous 50% penalty). If corrected in a timely manner, the penalty may be reduced to 10%.' }],
  'RMD = Account Balance / IRS Life Expectancy Factor',
  ['retirement-income-calculator', 'retirement-tax-calculator']
);

// #35 Retirement Tax Calculator
add('retirement-tax-calculator', 'Retirement Tax Calculator',
  'Estimate your total tax burden in retirement from Social Security, pensions, and retirement account withdrawals.',
  'Finance', 'finance', '$',
  ['retirement tax', 'tax in retirement', 'retirement tax estimator'],
  [
    '{ name: "socialSecurity", label: "Annual Social Security", type: "number", prefix: "$", min: 0, max: 100000, defaultValue: 24000 }',
    '{ name: "pensionIncome", label: "Annual Pension Income", type: "number", prefix: "$", min: 0, max: 200000, defaultValue: 0 }',
    '{ name: "iraWithdrawals", label: "Annual IRA/401k Withdrawals", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 30000 }',
    '{ name: "otherIncome", label: "Other Taxable Income", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 5000 }',
    '{ name: "standardDeduction", label: "Standard Deduction", type: "number", prefix: "$", min: 0, max: 50000, defaultValue: 15700 }',
  ],
  `(inputs) => {
      const ss = inputs.socialSecurity as number;
      const pension = inputs.pensionIncome as number;
      const ira = inputs.iraWithdrawals as number;
      const other = inputs.otherIncome as number;
      const deduction = inputs.standardDeduction as number;
      const provisionalIncome = (ss * 0.5) + pension + ira + other;
      const taxableSS = provisionalIncome > 44000 ? ss * 0.85 : provisionalIncome > 32000 ? ss * 0.5 : 0;
      const totalIncome = taxableSS + pension + ira + other;
      const taxableIncome = Math.max(0, totalIncome - deduction);
      let tax = 0;
      if (taxableIncome <= 11600) tax = taxableIncome * 0.10;
      else if (taxableIncome <= 47150) tax = 1160 + (taxableIncome - 11600) * 0.12;
      else if (taxableIncome <= 100525) tax = 5426 + (taxableIncome - 47150) * 0.22;
      else tax = 17168.50 + (taxableIncome - 100525) * 0.24;
      const effectiveRate = totalIncome > 0 ? (tax / totalIncome) * 100 : 0;
      return {
        primary: { label: "Estimated Federal Tax", value: "$" + formatNumber(Math.round(tax)) },
        details: [
          { label: "Total Gross Income", value: "$" + formatNumber(Math.round(totalIncome)) },
          { label: "Taxable Income", value: "$" + formatNumber(Math.round(taxableIncome)) },
          { label: "Taxable Social Security", value: "$" + formatNumber(Math.round(taxableSS)) },
          { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 10) / 10) + "%" },
        ],
      };
    }`,
  [{ q: 'Is Social Security income taxed?', a: 'Up to 85% of Social Security benefits can be taxed depending on your combined income. Single filers with combined income above $34,000 and joint filers above $44,000 may owe tax on up to 85% of benefits.' },
   { q: 'How can I reduce taxes in retirement?', a: 'Strategies include Roth conversions before retirement, managing withdrawal sources, keeping income below Social Security taxation thresholds, and using the higher standard deduction available to those 65 and older.' }],
  'Taxable Income = (Taxable SS + Pension + IRA Withdrawals + Other) - Standard Deduction; Tax calculated using federal brackets',
  ['retirement-income-calculator', 'required-minimum-distribution-calculator']
);

// #36 Estate Tax Calculator
add('estate-tax-calculator', 'Estate Tax Calculator',
  'Estimate the federal estate tax liability based on the total value of an estate and applicable exemptions.',
  'Finance', 'finance', '$',
  ['estate tax calculator', 'federal estate tax', 'estate tax estimator'],
  [
    '{ name: "grossEstate", label: "Gross Estate Value", type: "number", prefix: "$", min: 0, max: 1000000000, defaultValue: 15000000 }',
    '{ name: "debtsAndExpenses", label: "Debts and Expenses", type: "number", prefix: "$", min: 0, max: 500000000, defaultValue: 500000 }',
    '{ name: "charitableBequests", label: "Charitable Bequests", type: "number", prefix: "$", min: 0, max: 500000000, defaultValue: 0 }',
    '{ name: "exemption", label: "Federal Exemption Amount", type: "number", prefix: "$", min: 0, max: 50000000, defaultValue: 13610000 }',
  ],
  `(inputs) => {
      const gross = inputs.grossEstate as number;
      const debts = inputs.debtsAndExpenses as number;
      const charity = inputs.charitableBequests as number;
      const exemption = inputs.exemption as number;
      const netEstate = gross - debts - charity;
      const taxableEstate = Math.max(0, netEstate - exemption);
      const estateTax = taxableEstate * 0.40;
      const effectiveRate = netEstate > 0 ? (estateTax / netEstate) * 100 : 0;
      return {
        primary: { label: "Estimated Estate Tax", value: "$" + formatNumber(Math.round(estateTax)) },
        details: [
          { label: "Net Estate Value", value: "$" + formatNumber(Math.round(netEstate)) },
          { label: "Taxable Estate", value: "$" + formatNumber(Math.round(taxableEstate)) },
          { label: "Federal Exemption Used", value: "$" + formatNumber(Math.round(exemption)) },
          { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 10) / 10) + "%" },
        ],
      };
    }`,
  [{ q: 'What is the federal estate tax exemption?', a: 'The federal estate tax exemption is $13.61 million per person as of 2024. Married couples can effectively shield up to $27.22 million. The exemption amount is adjusted annually for inflation.' },
   { q: 'What is the federal estate tax rate?', a: 'The top federal estate tax rate is 40%. The tax applies only to the portion of the estate exceeding the exemption amount. Most estates fall below the exemption and owe no federal estate tax.' }],
  'Taxable Estate = Gross Estate - Debts - Charitable Bequests - Exemption; Estate Tax = Taxable Estate x 40%',
  ['inheritance-tax-calculator', 'trust-distribution-calculator']
);

// #37 Inheritance Tax Calculator
add('inheritance-tax-calculator', 'Inheritance Tax Calculator',
  'Estimate state inheritance tax liability based on the inheritance amount and relationship to the deceased.',
  'Finance', 'finance', '$',
  ['inheritance tax', 'state inheritance tax', 'inheritance tax calculator'],
  [
    '{ name: "inheritanceAmount", label: "Inheritance Amount", type: "number", prefix: "$", min: 0, max: 100000000, defaultValue: 500000 }',
    '{ name: "exemptionAmount", label: "State Exemption Amount", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 25000 }',
    '{ name: "taxRate", label: "State Inheritance Tax Rate", type: "number", suffix: "%", min: 0, max: 30, defaultValue: 10 }',
  ],
  `(inputs) => {
      const amount = inputs.inheritanceAmount as number;
      const exemption = inputs.exemptionAmount as number;
      const rate = (inputs.taxRate as number) / 100;
      if (!amount) return null;
      const taxableAmount = Math.max(0, amount - exemption);
      const tax = taxableAmount * rate;
      const netInheritance = amount - tax;
      const effectiveRate = amount > 0 ? (tax / amount) * 100 : 0;
      return {
        primary: { label: "Inheritance Tax Owed", value: "$" + formatNumber(Math.round(tax)) },
        details: [
          { label: "Net Inheritance", value: "$" + formatNumber(Math.round(netInheritance)) },
          { label: "Taxable Amount", value: "$" + formatNumber(Math.round(taxableAmount)) },
          { label: "Exemption Applied", value: "$" + formatNumber(Math.round(exemption)) },
          { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 10) / 10) + "%" },
        ],
      };
    }`,
  [{ q: 'Which states have an inheritance tax?', a: 'As of 2024, six states impose an inheritance tax: Iowa, Kentucky, Maryland, Nebraska, New Jersey, and Pennsylvania. Maryland is unique in having both an estate tax and an inheritance tax.' },
   { q: 'Are spouses exempt from inheritance tax?', a: 'Yes, surviving spouses are exempt from inheritance tax in all states that impose one. Direct descendants (children and grandchildren) often receive reduced rates or full exemptions depending on the state.' }],
  'Taxable Amount = Inheritance - Exemption; Tax = Taxable Amount x Rate; Net Inheritance = Inheritance - Tax',
  ['estate-tax-calculator', 'trust-distribution-calculator']
);

// #38 Trust Distribution Calculator
add('trust-distribution-calculator', 'Trust Distribution Calculator',
  'Calculate the periodic distribution amounts from a trust based on the trust balance and distribution schedule.',
  'Finance', 'finance', '$',
  ['trust distribution', 'trust payout calculator', 'trust income calculator'],
  [
    '{ name: "trustBalance", label: "Trust Balance", type: "number", prefix: "$", min: 1000, max: 100000000, defaultValue: 1000000 }',
    '{ name: "distributionRate", label: "Annual Distribution Rate", type: "number", suffix: "%", min: 1, max: 100, defaultValue: 5 }',
    '{ name: "growthRate", label: "Annual Growth Rate", type: "number", suffix: "%", min: 0, max: 15, defaultValue: 4 }',
    '{ name: "yearsRemaining", label: "Years of Distributions", type: "number", min: 1, max: 50, defaultValue: 20 }',
  ],
  `(inputs) => {
      const balance = inputs.trustBalance as number;
      const distRate = (inputs.distributionRate as number) / 100;
      const growth = (inputs.growthRate as number) / 100;
      const years = inputs.yearsRemaining as number;
      if (!balance || !years) return null;
      const annualDist = balance * distRate;
      const monthlyDist = annualDist / 12;
      let totalDistributed = 0;
      let currentBalance = balance;
      for (let y = 0; y < years; y++) {
        const yearDist = currentBalance * distRate;
        totalDistributed += yearDist;
        currentBalance = (currentBalance - yearDist) * (1 + growth);
      }
      return {
        primary: { label: "Current Annual Distribution", value: "$" + formatNumber(Math.round(annualDist)) },
        details: [
          { label: "Current Monthly Distribution", value: "$" + formatNumber(Math.round(monthlyDist)) },
          { label: "Total Distributed Over " + years + " Years", value: "$" + formatNumber(Math.round(totalDistributed)) },
          { label: "Projected Balance After " + years + " Years", value: "$" + formatNumber(Math.round(currentBalance)) },
        ],
      };
    }`,
  [{ q: 'What is a typical trust distribution rate?', a: 'Many trusts distribute 3% to 5% of the trust balance annually. The Uniform Prudent Investor Act suggests that a total return approach balancing growth and income is appropriate for most trusts.' },
   { q: 'Can a trust last indefinitely?', a: 'Trust duration depends on state law. Some states allow perpetual trusts, while others follow the Rule Against Perpetuities, which typically limits trusts to about 90 years or a life in being plus 21 years.' }],
  'Annual Distribution = Trust Balance x Distribution Rate; Projected Balance = (Balance - Distribution) x (1 + Growth Rate) over each year',
  ['estate-tax-calculator', 'retirement-income-calculator']
);

// #39 Life Insurance Needs Calculator
add('life-insurance-needs-calculator', 'Life Insurance Needs Calculator',
  'Determine how much life insurance coverage is needed to protect your family based on income and obligations.',
  'Finance', 'finance', '$',
  ['life insurance needs', 'how much life insurance', 'life insurance calculator'],
  [
    '{ name: "annualIncome", label: "Annual Income to Replace", type: "number", prefix: "$", min: 0, max: 2000000, defaultValue: 75000 }',
    '{ name: "yearsOfSupport", label: "Years of Income Replacement", type: "number", min: 1, max: 50, defaultValue: 20 }',
    '{ name: "totalDebt", label: "Total Outstanding Debt", type: "number", prefix: "$", min: 0, max: 5000000, defaultValue: 200000 }',
    '{ name: "educationFund", label: "Education Fund Needed", type: "number", prefix: "$", min: 0, max: 2000000, defaultValue: 100000 }',
    '{ name: "existingCoverage", label: "Existing Life Insurance", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 100000 }',
  ],
  `(inputs) => {
      const income = inputs.annualIncome as number;
      const years = inputs.yearsOfSupport as number;
      const debt = inputs.totalDebt as number;
      const education = inputs.educationFund as number;
      const existing = inputs.existingCoverage as number;
      if (!income || !years) return null;
      const incomeReplacement = income * years;
      const totalNeeds = incomeReplacement + debt + education;
      const additionalNeeded = Math.max(0, totalNeeds - existing);
      return {
        primary: { label: "Additional Coverage Needed", value: "$" + formatNumber(Math.round(additionalNeeded)) },
        details: [
          { label: "Total Coverage Needed", value: "$" + formatNumber(Math.round(totalNeeds)) },
          { label: "Income Replacement", value: "$" + formatNumber(Math.round(incomeReplacement)) },
          { label: "Debt Coverage", value: "$" + formatNumber(Math.round(debt)) },
          { label: "Existing Coverage", value: "$" + formatNumber(Math.round(existing)) },
        ],
      };
    }`,
  [{ q: 'How much life insurance do most people need?', a: 'A common rule of thumb is 10 to 15 times your annual income. However, the actual amount depends on your debts, dependents, lifestyle, and other financial obligations. A detailed needs analysis is more accurate.' },
   { q: 'What type of life insurance should I get?', a: 'Term life insurance is the most affordable option for most families, providing coverage for a specific period. Permanent life insurance (whole or universal) costs more but builds cash value and covers your entire lifetime.' }],
  'Total Needs = (Annual Income x Years) + Total Debt + Education Fund; Additional Needed = Total Needs - Existing Coverage',
  ['estate-tax-calculator', 'funeral-cost-calculator']
);

// #40 Funeral Cost Calculator
add('funeral-cost-calculator', 'Funeral Cost Calculator',
  'Estimate the total cost of funeral services, burial or cremation, and related expenses.',
  'Finance', 'finance', '$',
  ['funeral cost', 'burial cost calculator', 'funeral expense estimator'],
  [
    '{ name: "serviceType", label: "Service Type (1=Burial, 2=Cremation)", type: "number", min: 1, max: 2, defaultValue: 1 }',
    '{ name: "casketCost", label: "Casket or Urn Cost", type: "number", prefix: "$", min: 0, max: 50000, defaultValue: 2500 }',
    '{ name: "plotCost", label: "Burial Plot or Niche Cost", type: "number", prefix: "$", min: 0, max: 50000, defaultValue: 2000 }',
    '{ name: "serviceFees", label: "Funeral Home Service Fees", type: "number", prefix: "$", min: 0, max: 50000, defaultValue: 3500 }',
    '{ name: "additionalCosts", label: "Flowers, Obituary, Other", type: "number", prefix: "$", min: 0, max: 20000, defaultValue: 1500 }',
  ],
  `(inputs) => {
      const serviceType = inputs.serviceType as number;
      const casket = inputs.casketCost as number;
      const plot = inputs.plotCost as number;
      const services = inputs.serviceFees as number;
      const additional = inputs.additionalCosts as number;
      const cremationDiscount = serviceType === 2 ? 0.4 : 1.0;
      const adjustedServices = services * cremationDiscount;
      const adjustedPlot = serviceType === 2 ? Math.min(plot, 1000) : plot;
      const totalCost = casket + adjustedPlot + adjustedServices + additional;
      const typeLabel = serviceType === 2 ? "Cremation" : "Traditional Burial";
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Service Type", value: typeLabel },
          { label: "Casket/Urn", value: "$" + formatNumber(Math.round(casket)) },
          { label: "Plot/Niche", value: "$" + formatNumber(Math.round(adjustedPlot)) },
          { label: "Service Fees", value: "$" + formatNumber(Math.round(adjustedServices)) },
        ],
      };
    }`,
  [{ q: 'What is the average cost of a funeral?', a: 'The average traditional funeral with burial costs approximately $7,800 to $9,000 in the United States. Cremation with a memorial service averages $4,000 to $6,000. Costs vary significantly by region.' },
   { q: 'How can funeral costs be reduced?', a: 'Consider direct cremation or burial, compare prices from multiple providers, provide your own casket, choose a simple memorial service, and plan ahead to lock in prices. Federal law requires funeral homes to provide itemized pricing.' }],
  'Total Cost = Casket/Urn + Plot/Niche + Service Fees + Additional Costs (adjusted for burial vs cremation)',
  ['life-insurance-needs-calculator', 'estate-tax-calculator']
);

// GROUP J - ENGINEERING & TECHNICAL

// #41 Ohms Law Calculator
add('ohms-law-calculator', 'Ohms Law Calculator',
  'Calculate voltage, current, or resistance using Ohm Law given any two of the three values.',
  'Science', 'science', 'A',
  ['ohms law', 'voltage current resistance', 'ohm calculator'],
  [
    '{ name: "voltage", label: "Voltage (V)", type: "number", suffix: "V", min: 0, max: 1000000, defaultValue: 12 }',
    '{ name: "current", label: "Current (A)", type: "number", suffix: "A", min: 0, max: 10000, defaultValue: 2 }',
    '{ name: "resistance", label: "Resistance (ohms)", type: "number", suffix: "ohms", min: 0, max: 1000000, defaultValue: 0 }',
  ],
  `(inputs) => {
      const v = inputs.voltage as number;
      const i = inputs.current as number;
      const r = inputs.resistance as number;
      let calcV = v, calcI = i, calcR = r;
      let solved = "";
      if (v > 0 && i > 0 && r === 0) {
        calcR = v / i;
        solved = "Resistance";
      } else if (v > 0 && r > 0 && i === 0) {
        calcI = v / r;
        solved = "Current";
      } else if (i > 0 && r > 0 && v === 0) {
        calcV = i * r;
        solved = "Voltage";
      } else if (v > 0 && i > 0) {
        calcR = v / i;
        solved = "Resistance";
      } else {
        return null;
      }
      const power = calcV * calcI;
      return {
        primary: { label: solved + " Calculated", value: solved === "Voltage" ? formatNumber(Math.round(calcV * 1000) / 1000) + " V" : solved === "Current" ? formatNumber(Math.round(calcI * 1000) / 1000) + " A" : formatNumber(Math.round(calcR * 1000) / 1000) + " ohms" },
        details: [
          { label: "Voltage", value: formatNumber(Math.round(calcV * 1000) / 1000) + " V" },
          { label: "Current", value: formatNumber(Math.round(calcI * 1000) / 1000) + " A" },
          { label: "Resistance", value: formatNumber(Math.round(calcR * 1000) / 1000) + " ohms" },
          { label: "Power", value: formatNumber(Math.round(power * 100) / 100) + " W" },
        ],
      };
    }`,
  [{ q: 'What is Ohm Law?', a: 'Ohm Law states that voltage equals current multiplied by resistance (V = I x R). It is the fundamental relationship in electrical circuits, applicable to DC circuits and AC circuits at steady state.' },
   { q: 'When does Ohm Law not apply?', a: 'Ohm Law does not apply to non-linear devices like diodes, transistors, and varistors. It also does not directly apply to AC circuits with reactive components (capacitors and inductors) without impedance calculations.' }],
  'V = I x R; I = V / R; R = V / I; Power = V x I',
  ['power-consumption-calculator', 'wire-gauge-calculator']
);

// #42 Power Consumption Calculator
add('power-consumption-calculator', 'Power Consumption Calculator',
  'Calculate electrical power consumption from voltage and current, or determine missing values from known quantities.',
  'Science', 'science', 'A',
  ['power consumption', 'watts calculator', 'electrical power calculator'],
  [
    '{ name: "voltage", label: "Voltage", type: "number", suffix: "V", min: 0.1, max: 1000000, defaultValue: 120 }',
    '{ name: "current", label: "Current", type: "number", suffix: "A", min: 0.01, max: 10000, defaultValue: 10 }',
    '{ name: "hoursPerDay", label: "Hours Used Per Day", type: "number", min: 0.1, max: 24, defaultValue: 8 }',
    '{ name: "costPerKwh", label: "Electricity Cost Per kWh", type: "number", prefix: "$", min: 0.01, max: 1, defaultValue: 0.13 }',
  ],
  `(inputs) => {
      const voltage = inputs.voltage as number;
      const current = inputs.current as number;
      const hours = inputs.hoursPerDay as number;
      const rate = inputs.costPerKwh as number;
      if (!voltage || !current) return null;
      const watts = voltage * current;
      const kw = watts / 1000;
      const dailyKwh = kw * hours;
      const monthlyKwh = dailyKwh * 30;
      const monthlyCost = monthlyKwh * rate;
      return {
        primary: { label: "Power Consumption", value: formatNumber(Math.round(watts * 100) / 100) + " W" },
        details: [
          { label: "Kilowatts", value: formatNumber(Math.round(kw * 1000) / 1000) + " kW" },
          { label: "Daily Energy", value: formatNumber(Math.round(dailyKwh * 100) / 100) + " kWh" },
          { label: "Monthly Energy", value: formatNumber(Math.round(monthlyKwh * 10) / 10) + " kWh" },
          { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How do I calculate watts from volts and amps?', a: 'Watts equal volts multiplied by amps (W = V x A). For example, a device drawing 10 amps from a 120-volt outlet uses 1,200 watts of power.' },
   { q: 'What is the difference between watts and kilowatt-hours?', a: 'Watts measure instantaneous power (rate of energy use), while kilowatt-hours measure total energy consumed over time. A 1,000-watt device running for 1 hour uses 1 kWh of energy.' }],
  'Power (W) = Voltage (V) x Current (A); Monthly kWh = (Watts / 1000) x Hours/Day x 30; Cost = kWh x Rate',
  ['ohms-law-calculator', 'wire-gauge-calculator']
);

// #43 Wire Gauge Calculator
add('wire-gauge-calculator', 'Wire Gauge Calculator',
  'Determine the proper wire gauge (AWG) for an electrical circuit based on current load and wire run length.',
  'Science', 'science', 'A',
  ['wire gauge calculator', 'AWG calculator', 'wire size calculator'],
  [
    '{ name: "amps", label: "Current Load (Amps)", type: "number", suffix: "A", min: 0.5, max: 400, defaultValue: 20 }',
    '{ name: "distance", label: "One-Way Wire Run (feet)", type: "number", suffix: "ft", min: 1, max: 5000, defaultValue: 50 }',
    '{ name: "voltage", label: "System Voltage", type: "number", suffix: "V", min: 12, max: 480, defaultValue: 120 }',
    '{ name: "maxVoltageDrop", label: "Max Voltage Drop", type: "number", suffix: "%", min: 1, max: 10, defaultValue: 3 }',
  ],
  `(inputs) => {
      const amps = inputs.amps as number;
      const distance = inputs.distance as number;
      const voltage = inputs.voltage as number;
      const maxDrop = (inputs.maxVoltageDrop as number) / 100;
      if (!amps || !distance || !voltage) return null;
      const maxDropVolts = voltage * maxDrop;
      const requiredCMA = (2 * distance * amps * 12.9) / maxDropVolts;
      const awgData = [
        { gauge: 14, cma: 4110, maxAmps: 15 },
        { gauge: 12, cma: 6530, maxAmps: 20 },
        { gauge: 10, cma: 10380, maxAmps: 30 },
        { gauge: 8, cma: 16510, maxAmps: 40 },
        { gauge: 6, cma: 26240, maxAmps: 55 },
        { gauge: 4, cma: 41740, maxAmps: 70 },
        { gauge: 2, cma: 66360, maxAmps: 95 },
        { gauge: 1, cma: 83690, maxAmps: 110 },
      ];
      let recommended = awgData[awgData.length - 1];
      for (const wire of awgData) {
        if (wire.cma >= requiredCMA && wire.maxAmps >= amps) {
          recommended = wire;
          break;
        }
      }
      const actualDrop = (2 * distance * amps * 12.9) / recommended.cma;
      const dropPercent = (actualDrop / voltage) * 100;
      return {
        primary: { label: "Recommended Wire Gauge", value: formatNumber(recommended.gauge) + " AWG" },
        details: [
          { label: "Max Ampacity", value: formatNumber(recommended.maxAmps) + " A" },
          { label: "Actual Voltage Drop", value: formatNumber(Math.round(actualDrop * 100) / 100) + " V" },
          { label: "Voltage Drop Percentage", value: formatNumber(Math.round(dropPercent * 100) / 100) + "%" },
          { label: "Wire Circular Mil Area", value: formatNumber(recommended.cma) + " CMA" },
        ],
      };
    }`,
  [{ q: 'Why does wire gauge matter?', a: 'Using wire that is too small for the current load causes excessive heat, voltage drop, and potential fire hazards. Proper wire sizing ensures safety, efficiency, and code compliance in electrical installations.' },
   { q: 'What is acceptable voltage drop?', a: 'The National Electrical Code recommends no more than 3% voltage drop for branch circuits and 5% total for feeder plus branch circuits. Excessive voltage drop wastes energy and can cause equipment malfunction.' }],
  'Required CMA = (2 x Distance x Amps x 12.9) / Max Voltage Drop; Select AWG with CMA >= Required CMA',
  ['ohms-law-calculator', 'power-consumption-calculator']
);

// #44 Heat Transfer Calculator
add('heat-transfer-calculator', 'Heat Transfer Calculator',
  'Calculate the rate of heat transfer through a material using conduction or estimate convective heat transfer.',
  'Science', 'science', 'A',
  ['heat transfer', 'thermal conduction calculator', 'heat flow calculator'],
  [
    '{ name: "conductivity", label: "Thermal Conductivity (W/m K)", type: "number", min: 0.01, max: 500, defaultValue: 0.6 }',
    '{ name: "area", label: "Cross-Sectional Area (sq m)", type: "number", min: 0.001, max: 1000, defaultValue: 1 }',
    '{ name: "tempDiff", label: "Temperature Difference (K)", type: "number", min: 0.1, max: 5000, defaultValue: 20 }',
    '{ name: "thickness", label: "Material Thickness (m)", type: "number", min: 0.001, max: 100, defaultValue: 0.1 }',
  ],
  `(inputs) => {
      const k = inputs.conductivity as number;
      const a = inputs.area as number;
      const dt = inputs.tempDiff as number;
      const dx = inputs.thickness as number;
      if (!k || !a || !dt || !dx) return null;
      const heatRate = (k * a * dt) / dx;
      const heatFlux = heatRate / a;
      const thermalResistance = dx / (k * a);
      return {
        primary: { label: "Heat Transfer Rate", value: formatNumber(Math.round(heatRate * 100) / 100) + " W" },
        details: [
          { label: "Heat Flux", value: formatNumber(Math.round(heatFlux * 100) / 100) + " W/sq m" },
          { label: "Thermal Resistance", value: formatNumber(Math.round(thermalResistance * 10000) / 10000) + " K/W" },
          { label: "Temperature Difference", value: formatNumber(dt) + " K" },
        ],
      };
    }`,
  [{ q: 'What is thermal conductivity?', a: 'Thermal conductivity (k) measures how well a material conducts heat. Metals like copper (385 W/mK) have high conductivity, while insulators like fiberglass (0.04 W/mK) have low conductivity.' },
   { q: 'What is the difference between conduction and convection?', a: 'Conduction transfers heat through direct molecular contact within a material. Convection transfers heat through fluid (liquid or gas) movement. Radiation transfers heat through electromagnetic waves without a medium.' }],
  'Q = k x A x (T1 - T2) / thickness; Heat Flux = Q / A; Thermal Resistance = thickness / (k x A)',
  ['thermal-expansion-calculator', 'pressure-drop-calculator']
);

// #45 Pressure Drop Calculator
add('pressure-drop-calculator', 'Pressure Drop Calculator',
  'Calculate the pressure drop in a pipe due to friction using the Darcy-Weisbach equation for fluid flow.',
  'Science', 'science', 'A',
  ['pressure drop', 'pipe friction loss', 'Darcy Weisbach calculator'],
  [
    '{ name: "pipeLength", label: "Pipe Length (m)", type: "number", min: 0.1, max: 100000, defaultValue: 100 }',
    '{ name: "pipeDiameter", label: "Pipe Inner Diameter (m)", type: "number", min: 0.005, max: 10, defaultValue: 0.05 }',
    '{ name: "flowVelocity", label: "Flow Velocity (m/s)", type: "number", min: 0.01, max: 50, defaultValue: 2 }',
    '{ name: "frictionFactor", label: "Darcy Friction Factor", type: "number", min: 0.001, max: 0.1, defaultValue: 0.02 }',
    '{ name: "density", label: "Fluid Density (kg/cu m)", type: "number", min: 1, max: 20000, defaultValue: 998 }',
  ],
  `(inputs) => {
      const L = inputs.pipeLength as number;
      const D = inputs.pipeDiameter as number;
      const v = inputs.flowVelocity as number;
      const f = inputs.frictionFactor as number;
      const rho = inputs.density as number;
      if (!L || !D || !v || !f || !rho) return null;
      const pressureDrop = f * (L / D) * (rho * v * v / 2);
      const pressureDropKPa = pressureDrop / 1000;
      const pressureDropPSI = pressureDrop * 0.000145038;
      const headLoss = pressureDrop / (rho * 9.81);
      return {
        primary: { label: "Pressure Drop", value: formatNumber(Math.round(pressureDropKPa * 100) / 100) + " kPa" },
        details: [
          { label: "Pressure Drop (Pa)", value: formatNumber(Math.round(pressureDrop * 100) / 100) + " Pa" },
          { label: "Pressure Drop (PSI)", value: formatNumber(Math.round(pressureDropPSI * 1000) / 1000) + " psi" },
          { label: "Head Loss", value: formatNumber(Math.round(headLoss * 100) / 100) + " m" },
        ],
      };
    }`,
  [{ q: 'What is the Darcy-Weisbach equation?', a: 'The Darcy-Weisbach equation calculates pressure loss due to friction in a pipe: dP = f x (L/D) x (rho x v^2 / 2). It applies to both laminar and turbulent flow with the appropriate friction factor.' },
   { q: 'What affects the friction factor?', a: 'The friction factor depends on the Reynolds number (flow regime) and pipe roughness. For laminar flow (Re < 2300), f = 64/Re. For turbulent flow, use the Moody chart or Colebrook equation.' }],
  'Pressure Drop = f x (L / D) x (rho x v^2 / 2); Head Loss = Pressure Drop / (rho x g)',
  ['heat-transfer-calculator', 'hydraulic-cylinder-calculator']
);

// #46 Beam Deflection Calculator
add('beam-deflection-calculator', 'Beam Deflection Calculator',
  'Calculate the maximum deflection of a simply supported beam under a uniformly distributed load.',
  'Science', 'science', 'A',
  ['beam deflection', 'beam calculator', 'structural beam deflection'],
  [
    '{ name: "load", label: "Total Distributed Load (N/m)", type: "number", min: 1, max: 1000000, defaultValue: 5000 }',
    '{ name: "length", label: "Beam Length (m)", type: "number", min: 0.1, max: 100, defaultValue: 3 }',
    '{ name: "elasticity", label: "Modulus of Elasticity (GPa)", type: "number", min: 1, max: 500, defaultValue: 200 }',
    '{ name: "momentOfInertia", label: "Moment of Inertia (cm^4)", type: "number", min: 1, max: 1000000, defaultValue: 500 }',
  ],
  `(inputs) => {
      const w = inputs.load as number;
      const L = inputs.length as number;
      const E = (inputs.elasticity as number) * 1e9;
      const Icm4 = inputs.momentOfInertia as number;
      const I = Icm4 * 1e-8;
      if (!w || !L || !E || !I) return null;
      const maxDeflection = (5 * w * Math.pow(L, 4)) / (384 * E * I);
      const maxMoment = (w * L * L) / 8;
      const maxShear = (w * L) / 2;
      const deflectionMM = maxDeflection * 1000;
      const spanRatio = L / maxDeflection;
      return {
        primary: { label: "Maximum Deflection", value: formatNumber(Math.round(deflectionMM * 100) / 100) + " mm" },
        details: [
          { label: "Deflection (m)", value: formatNumber(Math.round(maxDeflection * 100000) / 100000) + " m" },
          { label: "Span/Deflection Ratio", value: "L/" + formatNumber(Math.round(spanRatio)) },
          { label: "Maximum Bending Moment", value: formatNumber(Math.round(maxMoment)) + " N*m" },
          { label: "Maximum Shear Force", value: formatNumber(Math.round(maxShear)) + " N" },
        ],
      };
    }`,
  [{ q: 'What is an acceptable beam deflection?', a: 'Common deflection limits are L/360 for floors supporting plaster ceilings, L/240 for general floors, and L/180 for roofs. The appropriate limit depends on the application and building code requirements.' },
   { q: 'What factors affect beam deflection?', a: 'Deflection depends on the load magnitude and distribution, beam span length (to the fourth power), material stiffness (modulus of elasticity), and cross-section geometry (moment of inertia).' }],
  'Max Deflection = (5 x w x L^4) / (384 x E x I) for simply supported beam with uniform load',
  ['torque-calculator', 'gear-ratio-calculator']
);

// #47 Gear Ratio Calculator
add('gear-ratio-calculator', 'Gear Ratio Calculator',
  'Calculate gear ratios, output speed, and torque multiplication for meshing gear pairs.',
  'Science', 'science', 'A',
  ['gear ratio', 'gear calculator', 'gear speed calculator'],
  [
    '{ name: "drivingTeeth", label: "Driving Gear Teeth", type: "number", min: 5, max: 1000, defaultValue: 20 }',
    '{ name: "drivenTeeth", label: "Driven Gear Teeth", type: "number", min: 5, max: 1000, defaultValue: 60 }',
    '{ name: "inputRPM", label: "Input Speed (RPM)", type: "number", min: 1, max: 100000, defaultValue: 1800 }',
    '{ name: "inputTorque", label: "Input Torque (N*m)", type: "number", min: 0.1, max: 100000, defaultValue: 10 }',
  ],
  `(inputs) => {
      const driving = inputs.drivingTeeth as number;
      const driven = inputs.drivenTeeth as number;
      const rpm = inputs.inputRPM as number;
      const torque = inputs.inputTorque as number;
      if (!driving || !driven) return null;
      const gearRatio = driven / driving;
      const outputRPM = rpm / gearRatio;
      const outputTorque = torque * gearRatio * 0.95;
      const speedReduction = ((rpm - outputRPM) / rpm) * 100;
      return {
        primary: { label: "Gear Ratio", value: formatNumber(Math.round(gearRatio * 1000) / 1000) + ":1" },
        details: [
          { label: "Output Speed", value: formatNumber(Math.round(outputRPM * 10) / 10) + " RPM" },
          { label: "Output Torque (95% eff.)", value: formatNumber(Math.round(outputTorque * 100) / 100) + " N*m" },
          { label: "Speed Reduction", value: formatNumber(Math.round(speedReduction * 10) / 10) + "%" },
          { label: "Torque Multiplication", value: formatNumber(Math.round(gearRatio * 100) / 100) + "x" },
        ],
      };
    }`,
  [{ q: 'What does gear ratio mean?', a: 'Gear ratio is the ratio of driven gear teeth to driving gear teeth. A ratio of 3:1 means the output shaft turns 3 times slower but with 3 times the torque (minus efficiency losses) compared to the input.' },
   { q: 'Why is efficiency important in gear calculations?', a: 'Real gears lose energy to friction, typically 2-5% per gear stage for spur gears. Worm gears can lose 20-50%. Accounting for efficiency gives accurate output torque and prevents undersizing the drive system.' }],
  'Gear Ratio = Driven Teeth / Driving Teeth; Output RPM = Input RPM / Gear Ratio; Output Torque = Input Torque x Gear Ratio x Efficiency',
  ['torque-calculator', 'beam-deflection-calculator']
);

// #48 Torque Calculator
add('torque-calculator', 'Torque Calculator',
  'Calculate torque from force and lever arm distance, or determine the force needed for a given torque.',
  'Science', 'science', 'A',
  ['torque calculator', 'torque from force', 'moment of force calculator'],
  [
    '{ name: "force", label: "Applied Force (N)", type: "number", suffix: "N", min: 0.1, max: 1000000, defaultValue: 100 }',
    '{ name: "distance", label: "Lever Arm Distance (m)", type: "number", suffix: "m", min: 0.001, max: 1000, defaultValue: 0.5 }',
    '{ name: "angle", label: "Force Angle (degrees)", type: "number", suffix: "deg", min: 0, max: 180, defaultValue: 90 }',
  ],
  `(inputs) => {
      const force = inputs.force as number;
      const dist = inputs.distance as number;
      const angle = inputs.angle as number;
      if (!force || !dist) return null;
      const angleRad = (angle * Math.PI) / 180;
      const torque = force * dist * Math.sin(angleRad);
      const torqueFtLbs = torque * 0.7376;
      const torqueInLbs = torque * 8.851;
      return {
        primary: { label: "Torque", value: formatNumber(Math.round(torque * 100) / 100) + " N*m" },
        details: [
          { label: "Torque (ft-lbs)", value: formatNumber(Math.round(torqueFtLbs * 100) / 100) + " ft-lbs" },
          { label: "Torque (in-lbs)", value: formatNumber(Math.round(torqueInLbs * 100) / 100) + " in-lbs" },
          { label: "Effective Force Component", value: formatNumber(Math.round(force * Math.sin(angleRad) * 100) / 100) + " N" },
        ],
      };
    }`,
  [{ q: 'What is torque?', a: 'Torque is the rotational equivalent of linear force. It measures the tendency of a force to cause rotation about an axis. Torque equals force multiplied by the perpendicular distance from the axis of rotation.' },
   { q: 'Why does the angle of applied force matter?', a: 'Only the component of force perpendicular to the lever arm produces torque. At 90 degrees, all force contributes to torque. At other angles, torque is reduced by the sine of the angle between force and lever arm.' }],
  'Torque = Force x Distance x sin(Angle); at 90 degrees, Torque = Force x Distance',
  ['gear-ratio-calculator', 'hydraulic-cylinder-calculator']
);

// #49 Hydraulic Cylinder Calculator
add('hydraulic-cylinder-calculator', 'Hydraulic Cylinder Calculator',
  'Calculate the force output and flow requirements of a hydraulic cylinder based on bore size and pressure.',
  'Science', 'science', 'A',
  ['hydraulic cylinder', 'hydraulic force calculator', 'cylinder force calculator'],
  [
    '{ name: "boreDiameter", label: "Bore Diameter (inches)", type: "number", suffix: "in", min: 0.5, max: 50, defaultValue: 3 }',
    '{ name: "rodDiameter", label: "Rod Diameter (inches)", type: "number", suffix: "in", min: 0.25, max: 30, defaultValue: 1.5 }',
    '{ name: "pressure", label: "System Pressure (PSI)", type: "number", suffix: "PSI", min: 50, max: 10000, defaultValue: 3000 }',
    '{ name: "strokeLength", label: "Stroke Length (inches)", type: "number", suffix: "in", min: 0.5, max: 200, defaultValue: 12 }',
  ],
  `(inputs) => {
      const bore = inputs.boreDiameter as number;
      const rod = inputs.rodDiameter as number;
      const pressure = inputs.pressure as number;
      const stroke = inputs.strokeLength as number;
      if (!bore || !pressure) return null;
      const boreArea = Math.PI * Math.pow(bore / 2, 2);
      const rodArea = Math.PI * Math.pow(rod / 2, 2);
      const annularArea = boreArea - rodArea;
      const pushForce = boreArea * pressure;
      const pullForce = annularArea * pressure;
      const extendVolume = boreArea * stroke / 231;
      const retractVolume = annularArea * stroke / 231;
      return {
        primary: { label: "Push Force (extend)", value: formatNumber(Math.round(pushForce)) + " lbs" },
        details: [
          { label: "Pull Force (retract)", value: formatNumber(Math.round(pullForce)) + " lbs" },
          { label: "Bore Area", value: formatNumber(Math.round(boreArea * 1000) / 1000) + " sq in" },
          { label: "Extend Volume", value: formatNumber(Math.round(extendVolume * 1000) / 1000) + " gal" },
          { label: "Retract Volume", value: formatNumber(Math.round(retractVolume * 1000) / 1000) + " gal" },
        ],
      };
    }`,
  [{ q: 'How is hydraulic cylinder force calculated?', a: 'Force equals pressure multiplied by piston area. For push (extend) force, use the full bore area. For pull (retract) force, subtract the rod area from the bore area to get the annular area.' },
   { q: 'Why is the retract force less than the extend force?', a: 'During retraction, hydraulic fluid acts on the annular area (bore area minus rod area), which is smaller than the full bore area used during extension. This results in less force but faster retraction speed.' }],
  'Push Force = Bore Area x Pressure; Pull Force = (Bore Area - Rod Area) x Pressure; Volume = Area x Stroke / 231',
  ['torque-calculator', 'pressure-drop-calculator']
);

// #50 Thermal Expansion Calculator
add('thermal-expansion-calculator', 'Thermal Expansion Calculator',
  'Calculate how much a material expands or contracts when its temperature changes using the coefficient of thermal expansion.',
  'Science', 'science', 'A',
  ['thermal expansion', 'material expansion', 'temperature expansion calculator'],
  [
    '{ name: "originalLength", label: "Original Length (m)", type: "number", suffix: "m", min: 0.001, max: 10000, defaultValue: 1 }',
    '{ name: "tempChange", label: "Temperature Change (C)", type: "number", suffix: "C", min: -500, max: 2000, defaultValue: 50 }',
    '{ name: "coefficient", label: "Coefficient of Expansion (x10^-6 /C)", type: "number", min: 0.1, max: 200, defaultValue: 12 }',
  ],
  `(inputs) => {
      const L = inputs.originalLength as number;
      const dT = inputs.tempChange as number;
      const alpha = (inputs.coefficient as number) * 1e-6;
      if (!L || !alpha) return null;
      const deltaL = L * alpha * dT;
      const deltaLmm = deltaL * 1000;
      const newLength = L + deltaL;
      const percentChange = (deltaL / L) * 100;
      return {
        primary: { label: "Length Change", value: formatNumber(Math.round(deltaLmm * 1000) / 1000) + " mm" },
        details: [
          { label: "Length Change (m)", value: formatNumber(Math.round(deltaL * 1000000) / 1000000) + " m" },
          { label: "New Total Length", value: formatNumber(Math.round(newLength * 100000) / 100000) + " m" },
          { label: "Percentage Change", value: formatNumber(Math.round(percentChange * 10000) / 10000) + "%" },
        ],
      };
    }`,
  [{ q: 'What is the coefficient of thermal expansion?', a: 'It measures how much a material expands per degree of temperature change per unit length. Steel has a coefficient of about 12 x 10^-6 per degree Celsius, while aluminum is about 23 x 10^-6 per degree Celsius.' },
   { q: 'Why is thermal expansion important in engineering?', a: 'Thermal expansion must be accounted for in bridges, pipelines, railway tracks, and building construction. Expansion joints and gaps prevent structural damage from temperature-induced dimensional changes.' }],
  'Change in Length = Original Length x Coefficient x Temperature Change; New Length = Original Length + Change',
  ['heat-transfer-calculator', 'beam-deflection-calculator']
);

// === FOOTER: Generate files ===

function genFile(c) {
  return `import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ${eName(c.slug)}: CalculatorDefinition = {
  slug: "${c.slug}",
  title: "${c.title}",
  description: "${c.desc}",
  category: "${c.cat}",
  categorySlug: "${c.cs}",
  icon: "${c.icon}",
  keywords: ${JSON.stringify(c.kw)},
  variants: [{
    id: "standard",
    name: "${c.title.replace(' Calculator', '')}",
    description: "${c.desc}",
    fields: [
      ${c.fields.join(',\n      ')},
    ],
    calculate: ${c.calcBody},
  }],
  relatedSlugs: ${JSON.stringify(c.rel)},
  faq: [
${c.faq.map(f => `    { question: "${f.q}", answer: "${f.a}" },`).join('\n')}
  ],
  formula: "${c.formula}",
};
`;
}

let generated = 0, skipped = 0;
for (const c of calcs) {
  if (existingSlugs.has(c.slug)) { skipped++; console.log(`SKIP (exists): ${c.slug}`); continue; }
  const filePath = path.join(CALC_DIR, c.slug + '.ts');
  fs.writeFileSync(filePath, genFile(c));
  generated++;
}

console.log(`\nGenerated: ${generated} | Skipped: ${skipped}`);
console.log(`Total definitions: ${calcs.length}`);

// Write import and registration lines for insert script
const newImports = calcs.filter(c => !existingSlugs.has(c.slug)).map(c => `import { ${eName(c.slug)} } from "./${c.slug}";`);
const newRegs = calcs.filter(c => !existingSlugs.has(c.slug)).map(c => `  ${eName(c.slug)},`);
fs.writeFileSync(path.join(__dirname, 'new-imports-batch5.txt'), newImports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch5.txt'), newRegs.join('\n'));
console.log(`Imports saved to: scripts/new-imports-batch5.txt`);
console.log(`Registry saved to: scripts/new-regs-batch5.txt`);
