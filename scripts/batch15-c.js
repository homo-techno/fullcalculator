add(
  "retirement-income-gap-calculator",
  "Retirement Income Gap Calculator",
  "Calculate the gap between your expected retirement expenses and projected income sources to determine how much additional savings you need.",
  "Finance",
  "finance",
  "$",
  ["retirement income gap", "retirement shortfall", "retirement savings gap", "income gap analysis"],
  [
    '{ name: "monthlyExpenses", label: "Expected Monthly Expenses in Retirement ($)", type: "number", min: 500, max: 50000, defaultValue: 5000 }',
    '{ name: "socialSecurity", label: "Monthly Social Security ($)", type: "number", min: 0, max: 10000, defaultValue: 2000 }',
    '{ name: "pensionIncome", label: "Monthly Pension Income ($)", type: "number", min: 0, max: 20000, defaultValue: 0 }',
    '{ name: "otherIncome", label: "Other Monthly Income ($)", type: "number", min: 0, max: 20000, defaultValue: 500 }',
    '{ name: "yearsInRetirement", label: "Expected Years in Retirement", type: "number", min: 5, max: 50, defaultValue: 25 }'
  ],
  `(inputs) => {
    const expenses = inputs.monthlyExpenses as number;
    const ss = inputs.socialSecurity as number;
    const pension = inputs.pensionIncome as number;
    const other = inputs.otherIncome as number;
    const years = inputs.yearsInRetirement as number;
    const totalMonthlyIncome = ss + pension + other;
    const monthlyGap = Math.max(0, expenses - totalMonthlyIncome);
    const annualGap = monthlyGap * 12;
    const totalGapOverRetirement = annualGap * years;
    const coveragePct = expenses > 0 ? (totalMonthlyIncome / expenses) * 100 : 0;
    return {
      primary: { label: "Monthly Income Gap", value: "$" + formatNumber(Math.round(monthlyGap)) },
      details: [
        { label: "Total Monthly Income", value: "$" + formatNumber(Math.round(totalMonthlyIncome)) },
        { label: "Monthly Expenses", value: "$" + formatNumber(Math.round(expenses)) },
        { label: "Annual Gap", value: "$" + formatNumber(Math.round(annualGap)) },
        { label: "Total Gap Over Retirement", value: "$" + formatNumber(Math.round(totalGapOverRetirement)) },
        { label: "Income Coverage", value: formatNumber(Math.round(coveragePct * 10) / 10) + "%" }
      ]
    };
  }`,
  [
    { q: "What is a retirement income gap?", a: "A retirement income gap is the difference between your expected monthly expenses and guaranteed income sources like Social Security and pensions. This gap must be filled by savings withdrawals, investments, or other means." },
    { q: "How much should I plan for retirement expenses?", a: "A common guideline is to plan for 70 to 80 percent of your pre-retirement income, but actual needs vary. Healthcare, travel, and hobbies may increase costs, while reduced commuting and work expenses may lower them." },
    { q: "How can I close my retirement income gap?", a: "Options include saving more aggressively, delaying retirement, working part-time, reducing planned expenses, investing for growth, purchasing an annuity, or downsizing your home to free up equity." }
  ],
  `Monthly Gap = Monthly Expenses - (Social Security + Pension + Other Income)
Annual Gap = Monthly Gap x 12
Total Gap = Annual Gap x Years in Retirement`,
  ["retirement-income-calculator", "retirement-tax-calculator"]
);

add(
  "pension-benefit-estimator-calculator",
  "Pension Benefit Estimator Calculator",
  "Estimate your monthly pension benefit based on years of service, final average salary, and your pension plan multiplier percentage.",
  "Finance",
  "finance",
  "$",
  ["pension benefit estimator", "pension calculation", "defined benefit pension", "pension multiplier"],
  [
    '{ name: "finalAvgSalary", label: "Final Average Salary ($)", type: "number", min: 10000, max: 500000, defaultValue: 75000 }',
    '{ name: "yearsOfService", label: "Years of Service", type: "number", min: 1, max: 50, defaultValue: 25 }',
    '{ name: "multiplier", label: "Benefit Multiplier (%)", type: "number", min: 0.5, max: 4, defaultValue: 1.5 }',
    '{ name: "earlyRetirementReduction", label: "Early Retirement Reduction (%)", type: "number", min: 0, max: 50, defaultValue: 0 }'
  ],
  `(inputs) => {
    const salary = inputs.finalAvgSalary as number;
    const years = inputs.yearsOfService as number;
    const multiplier = inputs.multiplier as number;
    const reduction = inputs.earlyRetirementReduction as number;
    const annualBenefit = salary * (multiplier / 100) * years;
    const reducedBenefit = annualBenefit * (1 - reduction / 100);
    const monthlyBenefit = reducedBenefit / 12;
    const replacementRate = salary > 0 ? (reducedBenefit / salary) * 100 : 0;
    return {
      primary: { label: "Monthly Pension Benefit", value: "$" + formatNumber(Math.round(monthlyBenefit)) },
      details: [
        { label: "Annual Pension Benefit", value: "$" + formatNumber(Math.round(reducedBenefit)) },
        { label: "Before Early Reduction", value: "$" + formatNumber(Math.round(annualBenefit)) + "/yr" },
        { label: "Income Replacement Rate", value: formatNumber(Math.round(replacementRate * 10) / 10) + "%" },
        { label: "Total Service Credit", value: formatNumber(years) + " years" }
      ]
    };
  }`,
  [
    { q: "What is a pension benefit multiplier?", a: "A pension benefit multiplier is the percentage of salary you earn for each year of service. Common multipliers range from 1 to 2.5 percent. For example, with a 1.5 percent multiplier and 30 years of service, your pension would be 45 percent of your final average salary." },
    { q: "What is final average salary?", a: "Final average salary is typically the average of your highest consecutive 3 to 5 years of earnings. Some plans use a different averaging period. This figure is a key component in calculating your defined benefit pension." },
    { q: "How does early retirement affect my pension?", a: "Retiring before your plan normal retirement age typically reduces your pension by 3 to 7 percent per year. The reduction compensates for the longer expected payout period." }
  ],
  `Annual Benefit = Final Average Salary x Multiplier % x Years of Service
Reduced Benefit = Annual Benefit x (1 - Early Retirement Reduction %)
Monthly Benefit = Reduced Benefit / 12`,
  ["pension-vs-lump-sum-calculator", "retirement-income-gap-calculator"]
);

add(
  "401k-employer-match-maximizer-calculator",
  "401k Employer Match Maximizer Calculator",
  "Determine the optimal 401k contribution rate to fully capture your employer match and calculate how much free money you may be leaving on the table.",
  "Finance",
  "finance",
  "$",
  ["401k employer match", "401k match maximizer", "employer match calculator", "maximize 401k match"],
  [
    '{ name: "annualSalary", label: "Annual Salary ($)", type: "number", min: 10000, max: 1000000, defaultValue: 75000 }',
    '{ name: "currentContribPct", label: "Your Current Contribution (%)", type: "number", min: 0, max: 100, defaultValue: 6 }',
    '{ name: "matchPct", label: "Employer Match Rate (%)", type: "number", min: 0, max: 200, defaultValue: 50 }',
    '{ name: "matchCapPct", label: "Match Cap (% of Salary)", type: "number", min: 0, max: 100, defaultValue: 6 }',
    '{ name: "annualLimit", label: "Annual 401k Limit ($)", type: "number", min: 1000, max: 100000, defaultValue: 23500 }'
  ],
  `(inputs) => {
    const salary = inputs.annualSalary as number;
    const contribPct = inputs.currentContribPct as number;
    const matchPct = inputs.matchPct as number;
    const matchCapPct = inputs.matchCapPct as number;
    const limit = inputs.annualLimit as number;
    const yourContrib = Math.min(salary * (contribPct / 100), limit);
    const eligibleForMatch = Math.min(salary * (contribPct / 100), salary * (matchCapPct / 100));
    const employerMatch = eligibleForMatch * (matchPct / 100);
    const optimalContribPct = matchCapPct;
    const optimalContrib = Math.min(salary * (optimalContribPct / 100), limit);
    const maxMatch = salary * (matchCapPct / 100) * (matchPct / 100);
    const missedMatch = Math.max(0, maxMatch - employerMatch);
    const totalAnnual = yourContrib + employerMatch;
    return {
      primary: { label: "Employer Match You Receive", value: "$" + formatNumber(Math.round(employerMatch)) },
      details: [
        { label: "Your Annual Contribution", value: "$" + formatNumber(Math.round(yourContrib)) },
        { label: "Maximum Possible Match", value: "$" + formatNumber(Math.round(maxMatch)) },
        { label: "Match Left on Table", value: "$" + formatNumber(Math.round(missedMatch)) },
        { label: "Total Annual (You + Employer)", value: "$" + formatNumber(Math.round(totalAnnual)) },
        { label: "Contribute at Least", value: formatNumber(optimalContribPct) + "% to max match" }
      ]
    };
  }`,
  [
    { q: "How does a 401k employer match work?", a: "An employer match is free money your company contributes to your 401k based on your own contributions. For example, a 50 percent match on the first 6 percent of salary means if you contribute 6 percent, your employer adds an additional 3 percent." },
    { q: "What does it mean to leave match money on the table?", a: "If you contribute less than the amount needed to get the full employer match, you are forfeiting free money. For example, if your employer matches up to 6 percent of salary but you only contribute 3 percent, you are missing half the potential match." },
    { q: "What is the 2024 401k contribution limit?", a: "For 2024, the employee contribution limit is $23,000 for those under 50 and $30,500 for those 50 and older (with the $7,500 catch-up). The combined employer plus employee limit is $69,000 or $76,500 with catch-up contributions." }
  ],
  `Employer Match = min(Your Contribution, Salary x Match Cap %) x Match Rate %
Match Left on Table = Maximum Match - Actual Match
Optimal Contribution = Match Cap % of Salary`,
  ["retirement-income-gap-calculator", "pension-benefit-estimator-calculator"]
);

add(
  "annuity-income-calculator",
  "Annuity Income Calculator",
  "Calculate the monthly income you can expect from a fixed or immediate annuity based on your lump sum investment, interest rate, and payout period.",
  "Finance",
  "finance",
  "$",
  ["annuity income", "annuity payout estimator", "immediate annuity calculator", "fixed annuity income"],
  [
    '{ name: "lumpSum", label: "Lump Sum Investment ($)", type: "number", min: 10000, max: 10000000, defaultValue: 250000 }',
    '{ name: "interestRate", label: "Annual Interest Rate (%)", type: "number", min: 0.5, max: 12, defaultValue: 5 }',
    '{ name: "payoutYears", label: "Payout Period (Years)", type: "number", min: 5, max: 50, defaultValue: 20 }',
    '{ name: "startAge", label: "Age at Annuity Start", type: "number", min: 50, max: 90, defaultValue: 65 }'
  ],
  `(inputs) => {
    const lump = inputs.lumpSum as number;
    const rate = inputs.interestRate as number / 100;
    const years = inputs.payoutYears as number;
    const startAge = inputs.startAge as number;
    const monthlyRate = rate / 12;
    const totalPayments = years * 12;
    const monthlyPayout = monthlyRate > 0 ? lump * monthlyRate / (1 - Math.pow(1 + monthlyRate, -totalPayments)) : lump / totalPayments;
    const annualPayout = monthlyPayout * 12;
    const totalPayout = monthlyPayout * totalPayments;
    const totalInterest = totalPayout - lump;
    const endAge = startAge + years;
    return {
      primary: { label: "Monthly Annuity Income", value: "$" + formatNumber(Math.round(monthlyPayout)) },
      details: [
        { label: "Annual Income", value: "$" + formatNumber(Math.round(annualPayout)) },
        { label: "Total Payouts Over Period", value: "$" + formatNumber(Math.round(totalPayout)) },
        { label: "Total Interest Earned", value: "$" + formatNumber(Math.round(totalInterest)) },
        { label: "Payments Until Age", value: formatNumber(endAge) }
      ]
    };
  }`,
  [
    { q: "What is an immediate annuity?", a: "An immediate annuity is a contract where you pay a lump sum to an insurance company and begin receiving regular income payments right away, typically within 30 days. Payments can be fixed or variable and can last for a set period or for life." },
    { q: "Are annuity payments taxable?", a: "Part of each annuity payment from a non-qualified annuity is a tax-free return of principal, while the earnings portion is taxed as ordinary income. Qualified annuity payments from IRAs or 401k plans are fully taxable as ordinary income." },
    { q: "What is the difference between fixed and variable annuities?", a: "Fixed annuities provide guaranteed periodic payments at a set interest rate. Variable annuities invest in subaccounts similar to mutual funds, and payments fluctuate based on investment performance." }
  ],
  `Monthly Payment = (Lump Sum x Monthly Rate) / (1 - (1 + Monthly Rate)^(-Total Payments))
Monthly Rate = Annual Rate / 12
Total Payments = Payout Years x 12`,
  ["pension-vs-lump-sum-calculator", "retirement-income-gap-calculator"]
);

add(
  "retirement-healthcare-cost-calculator",
  "Retirement Healthcare Cost Calculator",
  "Estimate total out-of-pocket healthcare costs throughout retirement including Medicare premiums, supplemental insurance, prescriptions, and dental and vision expenses.",
  "Finance",
  "finance",
  "$",
  ["retirement healthcare cost", "healthcare cost in retirement", "medical costs retirement", "retirement medical expenses"],
  [
    '{ name: "currentAge", label: "Current Age", type: "number", min: 50, max: 80, defaultValue: 65 }',
    '{ name: "retirementAge", label: "Retirement Age", type: "number", min: 55, max: 80, defaultValue: 65 }',
    '{ name: "lifeExpectancy", label: "Life Expectancy", type: "number", min: 70, max: 100, defaultValue: 85 }',
    '{ name: "monthlyMedicare", label: "Monthly Medicare Premium ($)", type: "number", min: 100, max: 1000, defaultValue: 175 }',
    '{ name: "monthlySupplemental", label: "Monthly Supplemental Insurance ($)", type: "number", min: 0, max: 500, defaultValue: 150 }',
    '{ name: "annualOutOfPocket", label: "Annual Out-of-Pocket Costs ($)", type: "number", min: 0, max: 50000, defaultValue: 3000 }',
    '{ name: "inflationRate", label: "Healthcare Inflation Rate (%)", type: "number", min: 0, max: 15, defaultValue: 5 }'
  ],
  `(inputs) => {
    const currentAge = inputs.currentAge as number;
    const retireAge = inputs.retirementAge as number;
    const lifeExp = inputs.lifeExpectancy as number;
    const medicare = inputs.monthlyMedicare as number;
    const supplemental = inputs.monthlySupplemental as number;
    const oop = inputs.annualOutOfPocket as number;
    const inflation = inputs.inflationRate as number / 100;
    const yearsInRetirement = Math.max(0, lifeExp - retireAge);
    const yearsUntilRetire = Math.max(0, retireAge - currentAge);
    let totalCost = 0;
    for (let y = 0; y < yearsInRetirement; y++) {
      const yearCost = ((medicare + supplemental) * 12 + oop) * Math.pow(1 + inflation, yearsUntilRetire + y);
      totalCost += yearCost;
    }
    const firstYearCost = ((medicare + supplemental) * 12 + oop) * Math.pow(1 + inflation, yearsUntilRetire);
    const avgAnnualCost = yearsInRetirement > 0 ? totalCost / yearsInRetirement : 0;
    return {
      primary: { label: "Total Healthcare Cost in Retirement", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "First Year Cost", value: "$" + formatNumber(Math.round(firstYearCost)) },
        { label: "Average Annual Cost", value: "$" + formatNumber(Math.round(avgAnnualCost)) },
        { label: "Years in Retirement", value: formatNumber(yearsInRetirement) },
        { label: "Monthly Cost at Start", value: "$" + formatNumber(Math.round(firstYearCost / 12)) }
      ]
    };
  }`,
  [
    { q: "How much should I budget for healthcare in retirement?", a: "Fidelity estimates the average 65-year-old couple retiring in 2023 will need approximately $315,000 for healthcare costs throughout retirement. Individual needs vary based on health status, location, and coverage choices." },
    { q: "Does Medicare cover all healthcare costs?", a: "No. Medicare typically covers about 60 percent of healthcare expenses. You are still responsible for premiums, deductibles, copays, coinsurance, and services not covered like most dental, vision, hearing, and long-term care." },
    { q: "Why use a 5 percent healthcare inflation rate?", a: "Healthcare costs have historically risen faster than general inflation, averaging 5 to 7 percent annually over the past two decades. Using a higher rate provides a more realistic long-term projection." }
  ],
  `Year Cost = (Monthly Premiums x 12 + Annual Out-of-Pocket) x (1 + Inflation)^Year
Total = Sum of all Year Costs over retirement period`,
  ["retirement-income-gap-calculator", "retirement-tax-calculator"]
);

add(
  "reverse-mortgage-estimator-calculator",
  "Reverse Mortgage Estimator Calculator",
  "Estimate how much you could receive from a reverse mortgage (HECM) based on your home value, age, and current interest rates.",
  "Finance",
  "finance",
  "$",
  ["reverse mortgage calculator", "HECM calculator", "reverse mortgage estimator", "home equity conversion"],
  [
    '{ name: "homeValue", label: "Home Value ($)", type: "number", min: 50000, max: 5000000, defaultValue: 350000 }',
    '{ name: "mortgageBalance", label: "Existing Mortgage Balance ($)", type: "number", min: 0, max: 5000000, defaultValue: 50000 }',
    '{ name: "borrowerAge", label: "Youngest Borrower Age", type: "number", min: 62, max: 95, defaultValue: 70 }',
    '{ name: "interestRate", label: "Expected Interest Rate (%)", type: "number", min: 2, max: 12, defaultValue: 6.5 }',
    '{ name: "hecmLimit", label: "FHA Lending Limit ($)", type: "number", min: 100000, max: 1500000, defaultValue: 1149825 }'
  ],
  `(inputs) => {
    const homeVal = inputs.homeValue as number;
    const balance = inputs.mortgageBalance as number;
    const age = inputs.borrowerAge as number;
    const rate = inputs.interestRate as number;
    const limit = inputs.hecmLimit as number;
    const maxClaimAmount = Math.min(homeVal, limit);
    const ageFactor = Math.min(0.75, Math.max(0.30, 0.30 + (age - 62) * 0.012 - rate * 0.015));
    const principalLimit = Math.round(maxClaimAmount * ageFactor);
    const closingCosts = Math.round(maxClaimAmount * 0.02 + 2500);
    const netAvailable = Math.max(0, principalLimit - balance - closingCosts);
    const monthlyPayout = Math.round(netAvailable / ((95 - age) * 12));
    return {
      primary: { label: "Estimated Net Proceeds", value: "$" + formatNumber(netAvailable) },
      details: [
        { label: "Principal Limit", value: "$" + formatNumber(principalLimit) },
        { label: "Less Existing Mortgage", value: "$" + formatNumber(Math.round(balance)) },
        { label: "Less Closing Costs", value: "$" + formatNumber(closingCosts) },
        { label: "Estimated Monthly Tenure Payment", value: "$" + formatNumber(monthlyPayout) },
        { label: "Max Claim Amount", value: "$" + formatNumber(Math.round(maxClaimAmount)) }
      ]
    };
  }`,
  [
    { q: "What is a reverse mortgage?", a: "A reverse mortgage, most commonly a Home Equity Conversion Mortgage (HECM), allows homeowners 62 and older to convert part of their home equity into cash without selling the home or making monthly mortgage payments. The loan is repaid when the borrower moves out, sells, or passes away." },
    { q: "How much can I borrow with a reverse mortgage?", a: "The amount depends on your age, home value, current interest rates, and the FHA lending limit. Generally, older borrowers with more valuable homes and lower interest rates can access a larger percentage of their equity." },
    { q: "What are the risks of a reverse mortgage?", a: "Risks include accruing interest that reduces home equity over time, potential fees and closing costs, and the requirement to maintain the home and pay property taxes and insurance. Heirs may inherit less equity or need to repay the loan." }
  ],
  `Max Claim Amount = min(Home Value, FHA Limit)
Principal Limit = Max Claim Amount x Age/Rate Factor
Net Available = Principal Limit - Existing Mortgage - Closing Costs`,
  ["retirement-income-gap-calculator", "retirement-healthcare-cost-calculator"]
);

add(
  "retirement-tax-bracket-calculator",
  "Retirement Tax Bracket Calculator",
  "Determine which federal tax bracket you will fall into during retirement based on combined income from Social Security, pensions, withdrawals, and other sources.",
  "Finance",
  "finance",
  "$",
  ["retirement tax bracket", "tax bracket in retirement", "retirement federal tax", "retired tax rate"],
  [
    '{ name: "socialSecurity", label: "Annual Social Security ($)", type: "number", min: 0, max: 100000, defaultValue: 24000 }',
    '{ name: "pensionIncome", label: "Annual Pension ($)", type: "number", min: 0, max: 200000, defaultValue: 15000 }',
    '{ name: "withdrawals", label: "Annual IRA/401k Withdrawals ($)", type: "number", min: 0, max: 500000, defaultValue: 25000 }',
    '{ name: "otherIncome", label: "Other Taxable Income ($)", type: "number", min: 0, max: 500000, defaultValue: 5000 }',
    '{ name: "filingStatus", label: "Filing Status", type: "select", options: [{ value: "1", label: "Single" }, { value: "2", label: "Married Filing Jointly" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const ss = inputs.socialSecurity as number;
    const pension = inputs.pensionIncome as number;
    const withdrawals = inputs.withdrawals as number;
    const other = inputs.otherIncome as number;
    const status = parseInt(inputs.filingStatus as string);
    const provisionalIncome = ss * 0.5 + pension + withdrawals + other;
    const ssThreshold = status === 2 ? 44000 : 34000;
    const taxableSS = provisionalIncome > ssThreshold ? ss * 0.85 : provisionalIncome > (status === 2 ? 32000 : 25000) ? ss * 0.5 : 0;
    const standardDeduction = status === 2 ? 30000 : 15000;
    const totalIncome = taxableSS + pension + withdrawals + other;
    const taxableIncome = Math.max(0, totalIncome - standardDeduction);
    const brackets = status === 2
      ? [[23200, 0.10], [94300 - 23200, 0.12], [201050 - 94300, 0.22], [383900 - 201050, 0.24], [487450 - 383900, 0.32], [731200 - 487450, 0.35], [Infinity, 0.37]]
      : [[11600, 0.10], [47150 - 11600, 0.12], [100525 - 47150, 0.22], [191950 - 100525, 0.24], [243725 - 191950, 0.32], [609350 - 243725, 0.35], [Infinity, 0.37]];
    let tax = 0;
    let remaining = taxableIncome;
    let topRate = 0;
    for (const [width, rate] of brackets) {
      if (remaining <= 0) break;
      const taxable = Math.min(remaining, width);
      tax += taxable * rate;
      remaining -= taxable;
      topRate = rate;
    }
    const effectiveRate = totalIncome > 0 ? (tax / totalIncome) * 100 : 0;
    return {
      primary: { label: "Marginal Tax Bracket", value: formatNumber(topRate * 100) + "%" },
      details: [
        { label: "Estimated Federal Tax", value: "$" + formatNumber(Math.round(tax)) },
        { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 10) / 10) + "%" },
        { label: "Taxable Income", value: "$" + formatNumber(Math.round(taxableIncome)) },
        { label: "Taxable Social Security", value: "$" + formatNumber(Math.round(taxableSS)) },
        { label: "After-Tax Income", value: "$" + formatNumber(Math.round(totalIncome - tax)) }
      ]
    };
  }`,
  [
    { q: "How is Social Security taxed in retirement?", a: "Up to 85 percent of Social Security benefits may be taxable depending on your provisional income. If provisional income exceeds $25,000 for singles or $32,000 for married couples, a portion of benefits becomes taxable." },
    { q: "What is the standard deduction for retirees?", a: "Retirees 65 and older receive an additional standard deduction of $1,950 for single filers or $1,550 per spouse for married filers, on top of the regular standard deduction." },
    { q: "Can I reduce my tax bracket in retirement?", a: "Strategies include Roth conversions in lower-income years, timing IRA withdrawals, managing capital gains, taking advantage of the higher standard deduction for those over 65, and choosing tax-efficient withdrawal sequencing." }
  ],
  `Provisional Income = 50% of SS + Pension + Withdrawals + Other
Taxable Income = Total Income - Standard Deduction
Tax = Sum of (Income in each bracket x bracket rate)`,
  ["retirement-tax-calculator", "retirement-income-gap-calculator"]
);

add(
  "roth-conversion-ladder-calculator",
  "Roth Conversion Ladder Calculator",
  "Plan a multi-year Roth conversion ladder strategy to move traditional IRA or 401k funds into a Roth IRA while minimizing total taxes paid over time.",
  "Finance",
  "finance",
  "$",
  ["Roth conversion ladder", "Roth conversion strategy", "IRA to Roth conversion plan", "multi-year Roth conversion"],
  [
    '{ name: "traditionalBalance", label: "Traditional IRA/401k Balance ($)", type: "number", min: 10000, max: 10000000, defaultValue: 500000 }',
    '{ name: "annualConversion", label: "Annual Conversion Amount ($)", type: "number", min: 1000, max: 1000000, defaultValue: 50000 }',
    '{ name: "currentTaxRate", label: "Current Marginal Tax Rate (%)", type: "number", min: 0, max: 50, defaultValue: 22 }',
    '{ name: "futureTaxRate", label: "Expected Future Tax Rate (%)", type: "number", min: 0, max: 50, defaultValue: 24 }',
    '{ name: "yearsToConvert", label: "Years to Complete Conversions", type: "number", min: 1, max: 30, defaultValue: 10 }',
    '{ name: "growthRate", label: "Expected Growth Rate (%)", type: "number", min: 0, max: 15, defaultValue: 7 }'
  ],
  `(inputs) => {
    const balance = inputs.traditionalBalance as number;
    const annualConv = inputs.annualConversion as number;
    const currentRate = inputs.currentTaxRate as number / 100;
    const futureRate = inputs.futureTaxRate as number / 100;
    const years = inputs.yearsToConvert as number;
    const growth = inputs.growthRate as number / 100;
    const totalConverted = Math.min(annualConv * years, balance);
    const taxOnConversions = totalConverted * currentRate;
    const taxIfWithdrawnLater = totalConverted * Math.pow(1 + growth, years) * futureRate;
    const taxSavings = taxIfWithdrawnLater - taxOnConversions;
    const rothValueAfter = totalConverted * Math.pow(1 + growth, years);
    const monthlyTaxCost = taxOnConversions / (years * 12);
    return {
      primary: { label: "Potential Tax Savings", value: "$" + formatNumber(Math.round(taxSavings)) },
      details: [
        { label: "Total Amount Converted", value: "$" + formatNumber(Math.round(totalConverted)) },
        { label: "Total Tax on Conversions", value: "$" + formatNumber(Math.round(taxOnConversions)) },
        { label: "Tax if Withdrawn Later (Traditional)", value: "$" + formatNumber(Math.round(taxIfWithdrawnLater)) },
        { label: "Roth Value After Growth", value: "$" + formatNumber(Math.round(rothValueAfter)) },
        { label: "Monthly Tax Cost", value: "$" + formatNumber(Math.round(monthlyTaxCost)) }
      ]
    };
  }`,
  [
    { q: "What is a Roth conversion ladder?", a: "A Roth conversion ladder is a strategy of converting a portion of traditional IRA or 401k funds to a Roth IRA each year over multiple years. This spreads the tax hit, potentially keeping you in lower tax brackets each year rather than converting everything at once." },
    { q: "When does a Roth conversion ladder make sense?", a: "It is most beneficial during years when your income is lower than usual, such as between early retirement and when Social Security or RMDs begin. Converting during low-income years means paying taxes at a lower rate than you would later." },
    { q: "How long do I have to wait to withdraw Roth conversions?", a: "Each Roth conversion has its own 5-year holding period before the converted amount can be withdrawn tax and penalty free. After age 59 and a half, earnings can also be withdrawn tax-free once the 5-year rule is met." }
  ],
  `Total Converted = Annual Conversion x Years (up to balance)
Tax on Conversions = Total Converted x Current Tax Rate
Future Tax Avoided = Total Converted x (1 + Growth)^Years x Future Rate
Savings = Future Tax Avoided - Tax on Conversions`,
  ["retirement-tax-bracket-calculator", "retirement-tax-calculator"]
);

add(
  "retirement-portfolio-withdrawal-calculator",
  "Retirement Portfolio Withdrawal Calculator",
  "Calculate sustainable withdrawal amounts from your retirement portfolio using various withdrawal rate strategies while accounting for inflation and investment returns.",
  "Finance",
  "finance",
  "$",
  ["retirement withdrawal rate", "safe withdrawal rate", "portfolio withdrawal calculator", "4 percent rule calculator"],
  [
    '{ name: "portfolioBalance", label: "Portfolio Balance ($)", type: "number", min: 10000, max: 50000000, defaultValue: 1000000 }',
    '{ name: "withdrawalRate", label: "Annual Withdrawal Rate (%)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "expectedReturn", label: "Expected Annual Return (%)", type: "number", min: 0, max: 15, defaultValue: 6 }',
    '{ name: "inflationRate", label: "Expected Inflation (%)", type: "number", min: 0, max: 10, defaultValue: 3 }',
    '{ name: "retirementYears", label: "Years in Retirement", type: "number", min: 5, max: 50, defaultValue: 30 }'
  ],
  `(inputs) => {
    const balance = inputs.portfolioBalance as number;
    const wr = inputs.withdrawalRate as number / 100;
    const returnRate = inputs.expectedReturn as number / 100;
    const inflation = inputs.inflationRate as number / 100;
    const years = inputs.retirementYears as number;
    const firstYearWithdrawal = balance * wr;
    const monthlyWithdrawal = firstYearWithdrawal / 12;
    let remaining = balance;
    let totalWithdrawn = 0;
    let yearsDepleted = years;
    for (let y = 0; y < years; y++) {
      const withdrawal = firstYearWithdrawal * Math.pow(1 + inflation, y);
      remaining = remaining * (1 + returnRate) - withdrawal;
      totalWithdrawn += withdrawal;
      if (remaining <= 0) { yearsDepleted = y + 1; break; }
    }
    const endBalance = Math.max(0, remaining);
    const realReturn = returnRate - inflation;
    return {
      primary: { label: "First Year Withdrawal", value: "$" + formatNumber(Math.round(firstYearWithdrawal)) },
      details: [
        { label: "Monthly Withdrawal", value: "$" + formatNumber(Math.round(monthlyWithdrawal)) },
        { label: "Portfolio Lasts", value: formatNumber(yearsDepleted) + " years" },
        { label: "Ending Balance", value: "$" + formatNumber(Math.round(endBalance)) },
        { label: "Total Withdrawn", value: "$" + formatNumber(Math.round(totalWithdrawn)) },
        { label: "Real Return (after inflation)", value: formatNumber(Math.round(realReturn * 1000) / 10) + "%" }
      ]
    };
  }`,
  [
    { q: "What is the 4 percent rule?", a: "The 4 percent rule suggests withdrawing 4 percent of your portfolio in the first year of retirement, then adjusting that dollar amount for inflation each year. Research by William Bengen found this approach historically sustained portfolios for at least 30 years." },
    { q: "Is the 4 percent rule still valid?", a: "Some financial planners now suggest a more conservative 3 to 3.5 percent rate due to lower expected future returns and longer retirements. Others argue that flexible spending strategies can support higher initial rates." },
    { q: "What happens if the market drops early in retirement?", a: "Poor returns early in retirement, known as sequence-of-returns risk, can significantly impact portfolio longevity. A major market decline in the first few years of retirement can deplete a portfolio much faster than the same decline later." }
  ],
  `First Year Withdrawal = Portfolio Balance x Withdrawal Rate
Each Year: Portfolio = Previous Balance x (1 + Return) - Inflation-Adjusted Withdrawal
Portfolio Lasts Until Balance Reaches Zero`,
  ["retirement-income-gap-calculator", "retirement-income-calculator"]
);

add(
  "sequence-of-returns-risk-calculator",
  "Sequence of Returns Risk Calculator",
  "Visualize how the order of investment returns impacts your retirement portfolio by comparing a good-first versus bad-first return sequence over your retirement.",
  "Finance",
  "finance",
  "$",
  ["sequence of returns risk", "retirement sequence risk", "return order risk", "early retirement risk"],
  [
    '{ name: "startingBalance", label: "Starting Balance ($)", type: "number", min: 50000, max: 20000000, defaultValue: 1000000 }',
    '{ name: "annualWithdrawal", label: "Annual Withdrawal ($)", type: "number", min: 5000, max: 500000, defaultValue: 40000 }',
    '{ name: "goodReturn", label: "Good Year Return (%)", type: "number", min: 5, max: 30, defaultValue: 15 }',
    '{ name: "badReturn", label: "Bad Year Return (%)", type: "number", min: -50, max: 0, defaultValue: -15 }',
    '{ name: "periodYears", label: "Analysis Period (Years)", type: "number", min: 5, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const start = inputs.startingBalance as number;
    const withdrawal = inputs.annualWithdrawal as number;
    const good = inputs.goodReturn as number / 100;
    const bad = inputs.badReturn as number / 100;
    const years = inputs.periodYears as number;
    const halfYears = Math.floor(years / 2);
    let goodFirst = start;
    let badFirst = start;
    for (let y = 0; y < years; y++) {
      const gfReturn = y < halfYears ? good : bad;
      const bfReturn = y < halfYears ? bad : good;
      goodFirst = Math.max(0, goodFirst * (1 + gfReturn) - withdrawal);
      badFirst = Math.max(0, badFirst * (1 + bfReturn) - withdrawal);
    }
    const avgReturn = (good + bad) / 2;
    let avgScenario = start;
    for (let y = 0; y < years; y++) {
      avgScenario = Math.max(0, avgScenario * (1 + avgReturn) - withdrawal);
    }
    const difference = goodFirst - badFirst;
    return {
      primary: { label: "Sequence Impact (Difference)", value: "$" + formatNumber(Math.round(Math.abs(difference))) },
      details: [
        { label: "Good Returns First - Ending", value: "$" + formatNumber(Math.round(goodFirst)) },
        { label: "Bad Returns First - Ending", value: "$" + formatNumber(Math.round(badFirst)) },
        { label: "Average Return Scenario", value: "$" + formatNumber(Math.round(avgScenario)) },
        { label: "Average Annual Return", value: formatNumber(Math.round(avgReturn * 1000) / 10) + "%" },
        { label: "Analysis Period", value: formatNumber(years) + " years" }
      ]
    };
  }`,
  [
    { q: "What is sequence of returns risk?", a: "Sequence of returns risk is the danger that poor investment returns early in retirement can permanently impair your portfolio, even if average returns over the full period are acceptable. Withdrawing from a declining portfolio locks in losses." },
    { q: "How can I mitigate sequence of returns risk?", a: "Strategies include maintaining a cash reserve covering 1 to 2 years of expenses, using a bucket strategy, reducing withdrawals during market downturns, having flexible spending, and keeping a moderate allocation rather than being overly aggressive." },
    { q: "Why is the order of returns so important?", a: "When you are withdrawing from a portfolio, negative returns early reduce the base that must grow to sustain future withdrawals. The same average return produces vastly different outcomes depending on when the losses occur." }
  ],
  `Good First Scenario: Apply good returns for first half, bad returns for second half
Bad First Scenario: Apply bad returns for first half, good returns for second half
Each Year: Balance = Previous x (1 + Return) - Withdrawal
Sequence Impact = Good First Ending - Bad First Ending`,
  ["retirement-portfolio-withdrawal-calculator", "retirement-income-gap-calculator"]
);

add(
  "bucket-strategy-allocator-calculator",
  "Bucket Strategy Allocator Calculator",
  "Allocate your retirement portfolio across short-term, medium-term, and long-term buckets to manage cash flow and reduce sequence-of-returns risk.",
  "Finance",
  "finance",
  "$",
  ["bucket strategy", "retirement bucket plan", "time segmentation strategy", "retirement allocation buckets"],
  [
    '{ name: "totalPortfolio", label: "Total Portfolio Value ($)", type: "number", min: 50000, max: 20000000, defaultValue: 1000000 }',
    '{ name: "annualSpending", label: "Annual Spending Need ($)", type: "number", min: 10000, max: 500000, defaultValue: 50000 }',
    '{ name: "shortTermYears", label: "Short-Term Bucket (Years)", type: "number", min: 1, max: 5, defaultValue: 2 }',
    '{ name: "medTermYears", label: "Medium-Term Bucket (Years)", type: "number", min: 2, max: 10, defaultValue: 5 }',
    '{ name: "medTermReturn", label: "Medium-Term Expected Return (%)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "longTermReturn", label: "Long-Term Expected Return (%)", type: "number", min: 3, max: 15, defaultValue: 8 }'
  ],
  `(inputs) => {
    const total = inputs.totalPortfolio as number;
    const spending = inputs.annualSpending as number;
    const shortYrs = inputs.shortTermYears as number;
    const medYrs = inputs.medTermYears as number;
    const medReturn = inputs.medTermReturn as number;
    const longReturn = inputs.longTermReturn as number;
    const shortBucket = spending * shortYrs;
    const medBucket = spending * medYrs;
    const longBucket = Math.max(0, total - shortBucket - medBucket);
    const shortPct = total > 0 ? (shortBucket / total) * 100 : 0;
    const medPct = total > 0 ? (medBucket / total) * 100 : 0;
    const longPct = total > 0 ? (longBucket / total) * 100 : 0;
    const longGrowth5yr = longBucket * Math.pow(1 + longReturn / 100, 5);
    return {
      primary: { label: "Long-Term Growth Bucket", value: "$" + formatNumber(Math.round(longBucket)) },
      details: [
        { label: "Short-Term Cash Bucket", value: "$" + formatNumber(Math.round(shortBucket)) + " (" + formatNumber(Math.round(shortPct)) + "%)" },
        { label: "Medium-Term Bond Bucket", value: "$" + formatNumber(Math.round(medBucket)) + " (" + formatNumber(Math.round(medPct)) + "%)" },
        { label: "Long-Term Growth Bucket", value: "$" + formatNumber(Math.round(longBucket)) + " (" + formatNumber(Math.round(longPct)) + "%)" },
        { label: "Growth Bucket in 5 Years", value: "$" + formatNumber(Math.round(longGrowth5yr)) },
        { label: "Total Coverage", value: formatNumber(shortYrs + medYrs) + " years before growth bucket" }
      ]
    };
  }`,
  [
    { q: "What is the bucket strategy for retirement?", a: "The bucket strategy divides your retirement portfolio into three time-based segments: a short-term bucket of cash or equivalents for 1 to 2 years of expenses, a medium-term bucket of bonds and stable investments for 3 to 7 years, and a long-term growth bucket of stocks for beyond 7 years." },
    { q: "How does the bucket strategy reduce risk?", a: "By keeping several years of spending in safe, liquid investments, you avoid selling stocks during market downturns. The growth bucket has years to recover from volatility before you need to tap it." },
    { q: "How often should I refill the buckets?", a: "Typically you refill the short-term bucket annually by selling from the medium-term bucket when bonds perform well, or from the growth bucket during strong market years. Some advisors refill on a set schedule while others use market conditions as a guide." }
  ],
  `Short-Term Bucket = Annual Spending x Short-Term Years
Medium-Term Bucket = Annual Spending x Medium-Term Years
Long-Term Bucket = Total Portfolio - Short Bucket - Medium Bucket`,
  ["sequence-of-returns-risk-calculator", "retirement-portfolio-withdrawal-calculator"]
);

add(
  "senior-housing-cost-comparison-calculator",
  "Senior Housing Cost Comparison Calculator",
  "Compare monthly costs across different senior housing options including independent living, continuing care retirement communities, and aging in place.",
  "Finance",
  "finance",
  "$",
  ["senior housing cost", "senior living comparison", "continuing care retirement community", "aging in place cost"],
  [
    '{ name: "currentHomeValue", label: "Current Home Value ($)", type: "number", min: 50000, max: 5000000, defaultValue: 350000 }',
    '{ name: "monthlyHomeExpenses", label: "Monthly Home Expenses ($)", type: "number", min: 500, max: 10000, defaultValue: 2500 }',
    '{ name: "independentLiving", label: "Independent Living Monthly ($)", type: "number", min: 1000, max: 10000, defaultValue: 3500 }',
    '{ name: "ccrcEntryFee", label: "CCRC Entry Fee ($)", type: "number", min: 0, max: 1000000, defaultValue: 250000 }',
    '{ name: "ccrcMonthly", label: "CCRC Monthly Fee ($)", type: "number", min: 1000, max: 15000, defaultValue: 4000 }',
    '{ name: "yearsToCompare", label: "Comparison Period (Years)", type: "number", min: 5, max: 30, defaultValue: 15 }'
  ],
  `(inputs) => {
    const homeVal = inputs.currentHomeValue as number;
    const monthlyHome = inputs.monthlyHomeExpenses as number;
    const ilMonthly = inputs.independentLiving as number;
    const ccrcEntry = inputs.ccrcEntryFee as number;
    const ccrcMonthly = inputs.ccrcMonthly as number;
    const years = inputs.yearsToCompare as number;
    const agingInPlaceTotal = monthlyHome * 12 * years;
    const ilTotal = ilMonthly * 12 * years;
    const ilWithHomeSale = ilTotal - homeVal;
    const ccrcTotal = ccrcEntry + ccrcMonthly * 12 * years;
    const ccrcWithHomeSale = ccrcTotal - homeVal;
    const cheapest = Math.min(agingInPlaceTotal, ilTotal, ccrcTotal);
    const bestOption = cheapest === agingInPlaceTotal ? "Aging in Place" : cheapest === ilTotal ? "Independent Living" : "CCRC";
    return {
      primary: { label: "Most Affordable Option", value: bestOption },
      details: [
        { label: "Aging in Place Total", value: "$" + formatNumber(Math.round(agingInPlaceTotal)) },
        { label: "Independent Living Total", value: "$" + formatNumber(Math.round(ilTotal)) },
        { label: "CCRC Total (with entry fee)", value: "$" + formatNumber(Math.round(ccrcTotal)) },
        { label: "IL Net (after home sale)", value: "$" + formatNumber(Math.round(ilWithHomeSale)) },
        { label: "CCRC Net (after home sale)", value: "$" + formatNumber(Math.round(ccrcWithHomeSale)) }
      ]
    };
  }`,
  [
    { q: "What is a CCRC?", a: "A Continuing Care Retirement Community (CCRC) offers multiple levels of care in one location, from independent living to assisted living to skilled nursing. Residents typically pay a one-time entry fee plus monthly fees and can transition between care levels as needs change." },
    { q: "What does independent living typically include?", a: "Independent living communities typically include housing, meals, housekeeping, transportation, social activities, and building maintenance. Medical care and personal assistance are usually not included but may be available for additional fees." },
    { q: "Is aging in place always cheaper?", a: "Not necessarily. While aging in place avoids facility fees, costs for home modifications, in-home care, transportation, meal services, and home maintenance can add up significantly, especially as care needs increase over time." }
  ],
  `Aging in Place = Monthly Home Expenses x 12 x Years
Independent Living = Monthly Fee x 12 x Years
CCRC = Entry Fee + Monthly Fee x 12 x Years
Net Cost = Total - Home Sale Proceeds`,
  ["retirement-income-gap-calculator", "retirement-healthcare-cost-calculator"]
);

add(
  "home-care-cost-estimator-calculator",
  "Home Care Cost Estimator Calculator",
  "Estimate the monthly and annual cost of in-home care services based on hours needed, care level, and geographic location factors.",
  "Finance",
  "finance",
  "$",
  ["home care cost", "in-home care cost", "home health aide cost", "personal care cost estimator"],
  [
    '{ name: "hoursPerWeek", label: "Hours of Care Per Week", type: "number", min: 1, max: 168, defaultValue: 20 }',
    '{ name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 10, max: 75, defaultValue: 30 }',
    '{ name: "careLevel", label: "Care Level", type: "select", options: [{ value: "1", label: "Companion / Homemaker" }, { value: "2", label: "Personal Care Aide" }, { value: "3", label: "Certified Nursing Assistant" }, { value: "4", label: "Licensed Practical Nurse" }], defaultValue: "2" }',
    '{ name: "locationFactor", label: "Location Cost Factor", type: "select", options: [{ value: "0.85", label: "Rural / Low Cost" }, { value: "1.0", label: "Average / Suburban" }, { value: "1.2", label: "Urban / High Cost" }, { value: "1.4", label: "Major Metro / Very High Cost" }], defaultValue: "1.0" }',
    '{ name: "weeksPerYear", label: "Weeks of Care Per Year", type: "number", min: 1, max: 52, defaultValue: 52 }'
  ],
  `(inputs) => {
    const hours = inputs.hoursPerWeek as number;
    const rate = inputs.hourlyRate as number;
    const level = parseInt(inputs.careLevel as string);
    const locFactor = parseFloat(inputs.locationFactor as string);
    const weeks = inputs.weeksPerYear as number;
    const levelMultiplier = { 1: 0.85, 2: 1.0, 3: 1.2, 4: 1.5 };
    const adjRate = rate * (levelMultiplier[level] || 1) * locFactor;
    const weeklyCost = hours * adjRate;
    const monthlyCost = weeklyCost * (weeks / 12);
    const annualCost = weeklyCost * weeks;
    const dailyEquivalent = hours > 0 ? adjRate * (hours / 7) : 0;
    return {
      primary: { label: "Monthly Home Care Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
      details: [
        { label: "Adjusted Hourly Rate", value: "$" + formatNumber(Math.round(adjRate * 100) / 100) },
        { label: "Weekly Cost", value: "$" + formatNumber(Math.round(weeklyCost)) },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        { label: "Daily Equivalent", value: "$" + formatNumber(Math.round(dailyEquivalent)) },
        { label: "Total Hours Per Year", value: formatNumber(Math.round(hours * weeks)) }
      ]
    };
  }`,
  [
    { q: "What is the average cost of home care?", a: "The national median cost for a home health aide is approximately $30 to $33 per hour. Costs vary significantly by location, ranging from $20 per hour in rural areas to over $40 per hour in major metropolitan areas." },
    { q: "Does Medicare cover home care?", a: "Medicare covers limited home health services when medically necessary and ordered by a doctor, including skilled nursing and therapy. It does not cover personal care, homemaker services, or around-the-clock care." },
    { q: "What is the difference between home care and home health care?", a: "Home care refers to non-medical assistance such as help with bathing, dressing, cooking, and housekeeping. Home health care involves medical services like wound care, medication management, and physical therapy, provided by licensed professionals." }
  ],
  `Adjusted Rate = Base Rate x Care Level Multiplier x Location Factor
Weekly Cost = Hours Per Week x Adjusted Rate
Monthly Cost = Weekly Cost x (Weeks Per Year / 12)
Annual Cost = Weekly Cost x Weeks Per Year`,
  ["retirement-healthcare-cost-calculator", "senior-housing-cost-comparison-calculator"]
);

add(
  "retirement-relocation-cost-calculator",
  "Retirement Relocation Cost Calculator",
  "Compare the financial impact of relocating in retirement by analyzing differences in housing costs, taxes, healthcare, and cost of living between two locations.",
  "Finance",
  "finance",
  "$",
  ["retirement relocation", "retirement moving cost", "retire in another state", "retirement cost of living comparison"],
  [
    '{ name: "currentMonthlyExpenses", label: "Current Monthly Expenses ($)", type: "number", min: 1000, max: 30000, defaultValue: 5000 }',
    '{ name: "costOfLivingDiff", label: "New Location Cost of Living Difference (%)", type: "number", min: -50, max: 50, defaultValue: -15 }',
    '{ name: "currentHomeValue", label: "Current Home Value ($)", type: "number", min: 50000, max: 5000000, defaultValue: 400000 }',
    '{ name: "newHomePrice", label: "New Home Price ($)", type: "number", min: 50000, max: 5000000, defaultValue: 300000 }',
    '{ name: "movingCosts", label: "Moving and Transition Costs ($)", type: "number", min: 0, max: 100000, defaultValue: 15000 }',
    '{ name: "yearsInRetirement", label: "Years in Retirement", type: "number", min: 5, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const currentExp = inputs.currentMonthlyExpenses as number;
    const colDiff = inputs.costOfLivingDiff as number / 100;
    const currentHome = inputs.currentHomeValue as number;
    const newHome = inputs.newHomePrice as number;
    const moving = inputs.movingCosts as number;
    const years = inputs.yearsInRetirement as number;
    const newMonthlyExp = currentExp * (1 + colDiff);
    const monthlySavings = currentExp - newMonthlyExp;
    const annualSavings = monthlySavings * 12;
    const homeEquityFreed = currentHome - newHome;
    const totalSavingsOverTime = annualSavings * years + homeEquityFreed - moving;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil((moving - homeEquityFreed) / monthlySavings) : 0;
    return {
      primary: { label: "Total Financial Impact", value: "$" + formatNumber(Math.round(totalSavingsOverTime)) },
      details: [
        { label: "New Monthly Expenses", value: "$" + formatNumber(Math.round(newMonthlyExp)) },
        { label: "Monthly Savings", value: "$" + formatNumber(Math.round(monthlySavings)) },
        { label: "Home Equity Freed Up", value: "$" + formatNumber(Math.round(homeEquityFreed)) },
        { label: "Moving Costs", value: "$" + formatNumber(Math.round(moving)) },
        { label: "Break-Even Period", value: breakEvenMonths > 0 ? formatNumber(breakEvenMonths) + " months" : "Immediate savings" }
      ]
    };
  }`,
  [
    { q: "What are the best states to retire in for low taxes?", a: "States with no income tax include Florida, Texas, Nevada, Wyoming, Washington, Alaska, South Dakota, Tennessee, and New Hampshire. However, consider total tax burden including property taxes, sales tax, and estate taxes when comparing." },
    { q: "What costs should I consider when relocating in retirement?", a: "Beyond the obvious moving costs, consider differences in property taxes, income taxes, sales taxes, healthcare costs, insurance rates, utility costs, and proximity to family. Also factor in potential changes to your social network and lifestyle." },
    { q: "How do I calculate cost of living differences?", a: "Use cost of living indices from the Bureau of Economic Analysis or online calculators. These compare expenses like housing, food, transportation, healthcare, and utilities. A negative percentage means the new location is less expensive." }
  ],
  `New Monthly Expenses = Current x (1 + Cost of Living Difference %)
Monthly Savings = Current - New Expenses
Total Impact = (Annual Savings x Years) + Home Equity Freed - Moving Costs`,
  ["retirement-income-gap-calculator", "senior-housing-cost-comparison-calculator"]
);

add(
  "charitable-remainder-trust-calculator",
  "Charitable Remainder Trust Calculator",
  "Calculate the income stream, tax deduction, and remainder value of a charitable remainder trust (CRT) to plan your philanthropic and tax strategy.",
  "Finance",
  "finance",
  "$",
  ["charitable remainder trust", "CRT calculator", "charitable trust income", "planned giving calculator"],
  [
    '{ name: "assetValue", label: "Asset Value Donated ($)", type: "number", min: 50000, max: 50000000, defaultValue: 500000 }',
    '{ name: "payoutRate", label: "Annual Payout Rate (%)", type: "number", min: 5, max: 50, defaultValue: 7 }',
    '{ name: "trustTerm", label: "Trust Term (Years)", type: "number", min: 5, max: 30, defaultValue: 20 }',
    '{ name: "investmentReturn", label: "Expected Investment Return (%)", type: "number", min: 2, max: 15, defaultValue: 7 }',
    '{ name: "taxRate", label: "Your Marginal Tax Rate (%)", type: "number", min: 10, max: 50, defaultValue: 32 }'
  ],
  `(inputs) => {
    const assetVal = inputs.assetValue as number;
    const payoutRate = inputs.payoutRate as number / 100;
    const term = inputs.trustTerm as number;
    const investReturn = inputs.investmentReturn as number / 100;
    const taxRate = inputs.taxRate as number / 100;
    const annualPayout = assetVal * payoutRate;
    const totalPayouts = annualPayout * term;
    let trustBalance = assetVal;
    for (let y = 0; y < term; y++) {
      trustBalance = trustBalance * (1 + investReturn) - annualPayout;
      if (trustBalance < 0) { trustBalance = 0; break; }
    }
    const remainderValue = Math.max(0, trustBalance);
    const remainderPct = assetVal > 0 ? (remainderValue / assetVal) * 100 : 0;
    const estimatedDeduction = assetVal * Math.max(0.10, 1 - payoutRate * term * 0.04);
    const taxSavings = estimatedDeduction * taxRate;
    return {
      primary: { label: "Annual Income from Trust", value: "$" + formatNumber(Math.round(annualPayout)) },
      details: [
        { label: "Monthly Income", value: "$" + formatNumber(Math.round(annualPayout / 12)) },
        { label: "Total Income Over Term", value: "$" + formatNumber(Math.round(totalPayouts)) },
        { label: "Estimated Charitable Remainder", value: "$" + formatNumber(Math.round(remainderValue)) },
        { label: "Estimated Tax Deduction", value: "$" + formatNumber(Math.round(estimatedDeduction)) },
        { label: "Estimated Tax Savings", value: "$" + formatNumber(Math.round(taxSavings)) }
      ]
    };
  }`,
  [
    { q: "What is a charitable remainder trust?", a: "A CRT is an irrevocable trust that provides income to you or other beneficiaries for a period of years or for life, after which the remaining assets go to a designated charity. You receive an income tax deduction in the year the trust is established." },
    { q: "What are the tax benefits of a CRT?", a: "You receive a partial income tax deduction for the present value of the future charitable gift. You avoid capital gains tax on appreciated assets donated to the trust. The trust itself is tax-exempt, allowing assets to grow without annual taxation." },
    { q: "What is the minimum payout rate for a CRT?", a: "The IRS requires a minimum annual payout rate of 5 percent and a maximum of 50 percent. Additionally, the present value of the remainder interest must be at least 10 percent of the initial contribution value." }
  ],
  `Annual Payout = Asset Value x Payout Rate
Trust Growth: Balance = Previous x (1 + Return) - Payout each year
Remainder = Trust balance after term expires
Tax Deduction = Present value of future charitable remainder`,
  ["retirement-tax-bracket-calculator", "retirement-income-gap-calculator"]
);

add(
  "required-savings-rate-calculator",
  "Required Savings Rate Calculator",
  "Calculate the percentage of income you need to save each year to reach your retirement savings goal based on current age, target retirement age, and expected returns.",
  "Finance",
  "finance",
  "$",
  ["required savings rate", "retirement savings rate", "how much to save for retirement", "savings rate calculator"],
  [
    '{ name: "currentAge", label: "Current Age", type: "number", min: 18, max: 70, defaultValue: 35 }',
    '{ name: "retirementAge", label: "Target Retirement Age", type: "number", min: 50, max: 80, defaultValue: 65 }',
    '{ name: "annualIncome", label: "Annual Income ($)", type: "number", min: 20000, max: 2000000, defaultValue: 80000 }',
    '{ name: "currentSavings", label: "Current Retirement Savings ($)", type: "number", min: 0, max: 20000000, defaultValue: 50000 }',
    '{ name: "retirementGoal", label: "Retirement Savings Goal ($)", type: "number", min: 100000, max: 50000000, defaultValue: 1500000 }',
    '{ name: "expectedReturn", label: "Expected Annual Return (%)", type: "number", min: 1, max: 15, defaultValue: 7 }'
  ],
  `(inputs) => {
    const age = inputs.currentAge as number;
    const retireAge = inputs.retirementAge as number;
    const income = inputs.annualIncome as number;
    const current = inputs.currentSavings as number;
    const goal = inputs.retirementGoal as number;
    const returnRate = inputs.expectedReturn as number / 100;
    const years = Math.max(1, retireAge - age);
    const futureValueOfCurrent = current * Math.pow(1 + returnRate, years);
    const gap = Math.max(0, goal - futureValueOfCurrent);
    const annuityFactor = returnRate > 0 ? (Math.pow(1 + returnRate, years) - 1) / returnRate : years;
    const annualSavingsNeeded = annuityFactor > 0 ? gap / annuityFactor : gap / years;
    const savingsRate = income > 0 ? (annualSavingsNeeded / income) * 100 : 0;
    const monthlySavings = annualSavingsNeeded / 12;
    return {
      primary: { label: "Required Savings Rate", value: formatNumber(Math.round(savingsRate * 10) / 10) + "%" },
      details: [
        { label: "Annual Savings Needed", value: "$" + formatNumber(Math.round(annualSavingsNeeded)) },
        { label: "Monthly Savings Needed", value: "$" + formatNumber(Math.round(monthlySavings)) },
        { label: "Current Savings Future Value", value: "$" + formatNumber(Math.round(futureValueOfCurrent)) },
        { label: "Remaining Gap to Fill", value: "$" + formatNumber(Math.round(gap)) },
        { label: "Years to Retirement", value: formatNumber(years) }
      ]
    };
  }`,
  [
    { q: "How much of my income should I save for retirement?", a: "A common guideline is to save 10 to 15 percent of your gross income, but the right amount depends on when you start, your retirement goals, and expected Social Security benefits. Starting later requires a higher savings rate." },
    { q: "What is the savings rate needed if I start late?", a: "Starting at 25 may require saving about 10 to 12 percent. Starting at 35 may require 15 to 20 percent. Starting at 45 may require 25 to 35 percent or more to accumulate the same retirement nest egg." },
    { q: "Does employer match count toward my savings rate?", a: "Yes, an employer match effectively increases your savings rate. If you contribute 6 percent and your employer matches 3 percent, your total savings rate is 9 percent. Always contribute at least enough to capture the full employer match." }
  ],
  `Future Value of Current Savings = Current x (1 + Return)^Years
Gap = Goal - Future Value of Current Savings
Annual Savings = Gap / ((1 + Return)^Years - 1) / Return)
Savings Rate = Annual Savings / Annual Income x 100`,
  ["retirement-income-gap-calculator", "401k-employer-match-maximizer-calculator"]
);

add(
  "retirement-spending-calculator",
  "Retirement Spending Calculator",
  "Project your total retirement spending needs by category including housing, healthcare, food, transportation, and leisure, adjusted for inflation over your retirement years.",
  "Finance",
  "finance",
  "$",
  ["retirement spending", "retirement budget", "retirement expenses calculator", "spending in retirement"],
  [
    '{ name: "monthlyHousing", label: "Monthly Housing ($)", type: "number", min: 0, max: 20000, defaultValue: 1500 }',
    '{ name: "monthlyHealthcare", label: "Monthly Healthcare ($)", type: "number", min: 0, max: 10000, defaultValue: 600 }',
    '{ name: "monthlyFood", label: "Monthly Food ($)", type: "number", min: 0, max: 5000, defaultValue: 800 }',
    '{ name: "monthlyTransport", label: "Monthly Transportation ($)", type: "number", min: 0, max: 3000, defaultValue: 400 }',
    '{ name: "monthlyLeisure", label: "Monthly Leisure and Travel ($)", type: "number", min: 0, max: 10000, defaultValue: 500 }',
    '{ name: "monthlyOther", label: "Monthly Other Expenses ($)", type: "number", min: 0, max: 10000, defaultValue: 400 }',
    '{ name: "inflationRate", label: "Inflation Rate (%)", type: "number", min: 0, max: 10, defaultValue: 3 }',
    '{ name: "retirementYears", label: "Years in Retirement", type: "number", min: 5, max: 50, defaultValue: 25 }'
  ],
  `(inputs) => {
    const housing = inputs.monthlyHousing as number;
    const health = inputs.monthlyHealthcare as number;
    const food = inputs.monthlyFood as number;
    const transport = inputs.monthlyTransport as number;
    const leisure = inputs.monthlyLeisure as number;
    const other = inputs.monthlyOther as number;
    const inflation = inputs.inflationRate as number / 100;
    const years = inputs.retirementYears as number;
    const monthlyTotal = housing + health + food + transport + leisure + other;
    const annualTotal = monthlyTotal * 12;
    let totalSpending = 0;
    for (let y = 0; y < years; y++) {
      totalSpending += annualTotal * Math.pow(1 + inflation, y);
    }
    const lastYearSpending = annualTotal * Math.pow(1 + inflation, years - 1);
    const avgAnnual = totalSpending / years;
    return {
      primary: { label: "Total Lifetime Retirement Spending", value: "$" + formatNumber(Math.round(totalSpending)) },
      details: [
        { label: "Monthly Spending (Year 1)", value: "$" + formatNumber(Math.round(monthlyTotal)) },
        { label: "Annual Spending (Year 1)", value: "$" + formatNumber(Math.round(annualTotal)) },
        { label: "Annual Spending (Final Year)", value: "$" + formatNumber(Math.round(lastYearSpending)) },
        { label: "Average Annual Spending", value: "$" + formatNumber(Math.round(avgAnnual)) },
        { label: "Inflation Impact", value: "$" + formatNumber(Math.round(totalSpending - annualTotal * years)) + " over " + formatNumber(years) + " years" }
      ]
    };
  }`,
  [
    { q: "How much will I spend in retirement?", a: "Most retirees spend 70 to 80 percent of their pre-retirement income, but this varies widely. Housing and healthcare typically represent the largest categories. Spending often follows a smile pattern: higher early on, declining in middle years, then rising again with increased healthcare needs." },
    { q: "Which expenses increase most in retirement?", a: "Healthcare costs tend to increase the most, often rising 5 to 7 percent annually. Property taxes, insurance premiums, and long-term care costs also tend to grow faster than general inflation." },
    { q: "Should I plan for the same spending throughout retirement?", a: "No. Research suggests retirees tend to spend more in the early active years on travel and hobbies, less in the middle quiet years, and more again in later years on healthcare and assistance. A dynamic spending plan is more realistic than assuming flat expenses." }
  ],
  `Monthly Total = Housing + Healthcare + Food + Transport + Leisure + Other
Annual Total = Monthly Total x 12
Year N Spending = Annual Total x (1 + Inflation)^N
Lifetime Total = Sum of all years`,
  ["retirement-income-gap-calculator", "retirement-portfolio-withdrawal-calculator"]
);

add(
  "pension-cola-impact-calculator",
  "Pension COLA Impact Calculator",
  "Calculate how a cost-of-living adjustment (COLA) affects the real purchasing power of your pension benefit over time compared to a pension without adjustments.",
  "Finance",
  "finance",
  "$",
  ["pension COLA", "cost of living adjustment pension", "pension inflation protection", "COLA impact retirement"],
  [
    '{ name: "monthlyPension", label: "Monthly Pension Benefit ($)", type: "number", min: 500, max: 20000, defaultValue: 2500 }',
    '{ name: "colaRate", label: "Annual COLA Rate (%)", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "inflationRate", label: "Expected Inflation Rate (%)", type: "number", min: 0, max: 10, defaultValue: 3 }',
    '{ name: "yearsInRetirement", label: "Years in Retirement", type: "number", min: 5, max: 40, defaultValue: 25 }'
  ],
  `(inputs) => {
    const pension = inputs.monthlyPension as number;
    const cola = inputs.colaRate as number / 100;
    const inflation = inputs.inflationRate as number / 100;
    const years = inputs.yearsInRetirement as number;
    const pensionWithCola = pension * Math.pow(1 + cola, years);
    const purchasingPowerWithCola = pensionWithCola / Math.pow(1 + inflation, years);
    const purchasingPowerNoCola = pension / Math.pow(1 + inflation, years);
    let totalWithCola = 0;
    let totalNoCola = 0;
    for (let y = 0; y < years; y++) {
      totalWithCola += pension * Math.pow(1 + cola, y) * 12;
      totalNoCola += pension * 12;
    }
    const extraFromCola = totalWithCola - totalNoCola;
    const realValueLossNoCola = pension - purchasingPowerNoCola;
    return {
      primary: { label: "Extra Lifetime Income from COLA", value: "$" + formatNumber(Math.round(extraFromCola)) },
      details: [
        { label: "Monthly Pension After " + formatNumber(years) + " Years", value: "$" + formatNumber(Math.round(pensionWithCola)) },
        { label: "Real Purchasing Power (with COLA)", value: "$" + formatNumber(Math.round(purchasingPowerWithCola)) + "/mo" },
        { label: "Real Purchasing Power (no COLA)", value: "$" + formatNumber(Math.round(purchasingPowerNoCola)) + "/mo" },
        { label: "Total Lifetime Pension (with COLA)", value: "$" + formatNumber(Math.round(totalWithCola)) },
        { label: "Total Lifetime Pension (no COLA)", value: "$" + formatNumber(Math.round(totalNoCola)) }
      ]
    };
  }`,
  [
    { q: "What is a pension COLA?", a: "A pension Cost-of-Living Adjustment (COLA) is an annual increase to your pension payment, typically based on inflation measures like the CPI. It helps maintain your purchasing power as prices rise over time." },
    { q: "Do all pensions have COLA adjustments?", a: "No. Many private pensions do not include COLA provisions. Government pensions, Social Security, and military pensions typically include some form of COLA. If your pension lacks COLA, you need to plan for inflation eroding your benefit over time." },
    { q: "How much does inflation erode a fixed pension?", a: "At 3 percent annual inflation, a fixed pension loses about 26 percent of its purchasing power in 10 years and nearly 53 percent in 25 years. A $2,500 monthly pension would feel like only about $1,180 in todays dollars after 25 years." }
  ],
  `Pension After N Years = Monthly Pension x (1 + COLA)^N
Real Value = Nominal Value / (1 + Inflation)^N
Total COLA Benefit = Sum of COLA-adjusted payments - Sum of fixed payments`,
  ["pension-benefit-estimator-calculator", "retirement-income-gap-calculator"]
);

add(
  "social-security-spousal-benefit-calculator",
  "Social Security Spousal Benefit Calculator",
  "Calculate the optimal Social Security spousal benefit strategy by comparing individual and spousal benefit amounts at different claiming ages.",
  "Finance",
  "finance",
  "$",
  ["Social Security spousal benefit", "spousal benefit calculator", "spouse Social Security", "married Social Security"],
  [
    '{ name: "workerBenefitFRA", label: "Worker Benefit at FRA ($)", type: "number", min: 500, max: 10000, defaultValue: 2500 }',
    '{ name: "spouseBenefitFRA", label: "Spouse Own Benefit at FRA ($)", type: "number", min: 0, max: 10000, defaultValue: 800 }',
    '{ name: "workerClaimAge", label: "Worker Claiming Age", type: "number", min: 62, max: 70, defaultValue: 67 }',
    '{ name: "spouseClaimAge", label: "Spouse Claiming Age", type: "number", min: 62, max: 70, defaultValue: 67 }',
    '{ name: "fra", label: "Full Retirement Age", type: "number", min: 66, max: 67, defaultValue: 67 }'
  ],
  `(inputs) => {
    const workerFRA = inputs.workerBenefitFRA as number;
    const spouseOwnFRA = inputs.spouseBenefitFRA as number;
    const workerAge = inputs.workerClaimAge as number;
    const spouseAge = inputs.spouseClaimAge as number;
    const fra = inputs.fra as number;
    const workerAdj = workerAge < fra ? workerFRA * (1 - (fra - workerAge) * 0.0667) : workerFRA * (1 + (workerAge - fra) * 0.08);
    const spouseOwnAdj = spouseAge < fra ? spouseOwnFRA * (1 - (fra - spouseAge) * 0.0667) : spouseOwnFRA * (1 + (spouseAge - fra) * 0.08);
    const maxSpousalAtFRA = workerFRA * 0.5;
    const spousalBenefit = Math.max(0, maxSpousalAtFRA - spouseOwnFRA);
    const spouseReducedSpousal = spouseAge < fra ? spousalBenefit * (1 - (fra - spouseAge) * 0.05) : spousalBenefit;
    const totalSpouseBenefit = spouseOwnAdj + Math.max(0, spouseReducedSpousal);
    const betterOption = totalSpouseBenefit > spouseOwnAdj ? "Spousal Benefit is Higher" : "Own Benefit is Higher";
    const combinedMonthly = workerAdj + totalSpouseBenefit;
    return {
      primary: { label: "Combined Monthly Benefit", value: "$" + formatNumber(Math.round(combinedMonthly)) },
      details: [
        { label: "Worker Monthly Benefit", value: "$" + formatNumber(Math.round(workerAdj)) },
        { label: "Spouse Total Monthly Benefit", value: "$" + formatNumber(Math.round(totalSpouseBenefit)) },
        { label: "Spouse Own Benefit (adjusted)", value: "$" + formatNumber(Math.round(spouseOwnAdj)) },
        { label: "Spousal Top-Up Amount", value: "$" + formatNumber(Math.round(Math.max(0, spouseReducedSpousal))) },
        { label: "Recommendation", value: betterOption }
      ]
    };
  }`,
  [
    { q: "What is the Social Security spousal benefit?", a: "The spousal benefit allows a married person to receive up to 50 percent of their higher-earning spouse benefit at full retirement age, if that amount is more than their own benefit. The higher-earning spouse must have filed for benefits for the spousal benefit to begin." },
    { q: "Can I receive both my own benefit and a spousal benefit?", a: "You cannot receive both in full. When you apply, Social Security automatically pays your own benefit first. If the spousal amount is higher, you receive a top-up to bring you to the spousal level. The combined amount equals the higher of the two." },
    { q: "Does the spousal benefit increase if I delay past FRA?", a: "No. Unlike your own benefit, the spousal benefit does not increase with delayed retirement credits past full retirement age. The maximum spousal benefit is 50 percent of the worker benefit at FRA." }
  ],
  `Worker Adjusted = FRA Benefit x (1 +/- age adjustment)
Max Spousal = 50% of Worker FRA Benefit
Spousal Top-Up = max(0, Max Spousal - Spouse Own FRA Benefit)
Combined = Worker Benefit + max(Spouse Own, Spouse Own + Top-Up)`,
  ["retirement-income-gap-calculator", "retirement-tax-bracket-calculator"]
);

add(
  "long-term-care-needs-calculator",
  "Long-Term Care Needs Calculator",
  "Estimate the potential cost of long-term care services based on your age, health risk factors, and the type and duration of care you may need.",
  "Finance",
  "finance",
  "$",
  ["long-term care cost", "LTC needs estimator", "nursing care planning", "long-term care planning"],
  [
    '{ name: "currentAge", label: "Current Age", type: "number", min: 40, max: 80, defaultValue: 60 }',
    '{ name: "careType", label: "Expected Care Type", type: "select", options: [{ value: "1", label: "Home Health Aide" }, { value: "2", label: "Assisted Living Facility" }, { value: "3", label: "Nursing Home (Semi-Private)" }, { value: "4", label: "Nursing Home (Private Room)" }], defaultValue: "2" }',
    '{ name: "expectedDuration", label: "Expected Duration of Care (Years)", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "yearsUntilNeed", label: "Estimated Years Until Care Needed", type: "number", min: 0, max: 40, defaultValue: 20 }',
    '{ name: "inflationRate", label: "LTC Cost Inflation (%)", type: "number", min: 2, max: 8, defaultValue: 4 }'
  ],
  `(inputs) => {
    const age = inputs.currentAge as number;
    const careType = parseInt(inputs.careType as string);
    const duration = inputs.expectedDuration as number;
    const yearsUntil = inputs.yearsUntilNeed as number;
    const inflation = inputs.inflationRate as number / 100;
    const currentCosts = { 1: 62000, 2: 64200, 3: 100375, 4: 116800 };
    const baseCost = currentCosts[careType] || 64200;
    const futureCost = baseCost * Math.pow(1 + inflation, yearsUntil);
    let totalCost = 0;
    for (let y = 0; y < duration; y++) {
      totalCost += futureCost * Math.pow(1 + inflation, y);
    }
    const monthlyCostAtStart = futureCost / 12;
    const needAge = age + yearsUntil;
    return {
      primary: { label: "Estimated Total LTC Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Annual Cost at Start of Care", value: "$" + formatNumber(Math.round(futureCost)) },
        { label: "Monthly Cost at Start of Care", value: "$" + formatNumber(Math.round(monthlyCostAtStart)) },
        { label: "Current Annual Cost (Today)", value: "$" + formatNumber(Math.round(baseCost)) },
        { label: "Estimated Age at Start of Care", value: formatNumber(needAge) },
        { label: "Care Duration", value: formatNumber(duration) + " years" }
      ]
    };
  }`,
  [
    { q: "What is the average length of long-term care?", a: "The average person who reaches age 65 has about a 70 percent chance of needing long-term care. Women need care for an average of 3.7 years and men for about 2.2 years, though some individuals may need care for much longer." },
    { q: "How much does long-term care cost today?", a: "National median costs in 2023 are approximately $62,000 per year for a home health aide, $64,200 for assisted living, $100,375 for a semi-private nursing home room, and $116,800 for a private nursing home room." },
    { q: "What are the options to pay for long-term care?", a: "Options include long-term care insurance, personal savings, Medicaid (for those who qualify), hybrid life insurance with LTC riders, Health Savings Accounts, Veterans benefits, and reverse mortgages. Medicare covers only limited short-term skilled care." }
  ],
  `Future Annual Cost = Current Cost x (1 + Inflation)^Years Until Need
Total Cost = Sum of Future Cost x (1 + Inflation)^y for each year of care
Monthly Cost = Annual Cost / 12`,
  ["retirement-healthcare-cost-calculator", "home-care-cost-estimator-calculator"]
);

add(
  "retirement-account-consolidation-calculator",
  "Retirement Account Consolidation Calculator",
  "Evaluate the potential fee savings and simplification benefits of consolidating multiple retirement accounts into fewer accounts.",
  "Finance",
  "finance",
  "$",
  ["retirement account consolidation", "401k rollover calculator", "IRA consolidation", "combine retirement accounts"],
  [
    '{ name: "account1Balance", label: "Account 1 Balance ($)", type: "number", min: 0, max: 10000000, defaultValue: 150000 }',
    '{ name: "account1Fee", label: "Account 1 Annual Fee (%)", type: "number", min: 0, max: 3, defaultValue: 0.85 }',
    '{ name: "account2Balance", label: "Account 2 Balance ($)", type: "number", min: 0, max: 10000000, defaultValue: 75000 }',
    '{ name: "account2Fee", label: "Account 2 Annual Fee (%)", type: "number", min: 0, max: 3, defaultValue: 1.2 }',
    '{ name: "account3Balance", label: "Account 3 Balance ($)", type: "number", min: 0, max: 10000000, defaultValue: 50000 }',
    '{ name: "account3Fee", label: "Account 3 Annual Fee (%)", type: "number", min: 0, max: 3, defaultValue: 0.95 }',
    '{ name: "consolidatedFee", label: "Consolidated Account Fee (%)", type: "number", min: 0, max: 3, defaultValue: 0.25 }',
    '{ name: "yearsToProject", label: "Years to Project", type: "number", min: 5, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const b1 = inputs.account1Balance as number;
    const f1 = inputs.account1Fee as number / 100;
    const b2 = inputs.account2Balance as number;
    const f2 = inputs.account2Fee as number / 100;
    const b3 = inputs.account3Balance as number;
    const f3 = inputs.account3Fee as number / 100;
    const cf = inputs.consolidatedFee as number / 100;
    const years = inputs.yearsToProject as number;
    const totalBalance = b1 + b2 + b3;
    const currentFees = b1 * f1 + b2 * f2 + b3 * f3;
    const consolidatedFees = totalBalance * cf;
    const annualSavings = currentFees - consolidatedFees;
    const weightedFee = totalBalance > 0 ? (currentFees / totalBalance) * 100 : 0;
    let totalSavings = 0;
    for (let y = 0; y < years; y++) {
      totalSavings += annualSavings * Math.pow(1.06, y);
    }
    return {
      primary: { label: "Annual Fee Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
      details: [
        { label: "Current Total Fees", value: "$" + formatNumber(Math.round(currentFees)) + "/yr" },
        { label: "Consolidated Fees", value: "$" + formatNumber(Math.round(consolidatedFees)) + "/yr" },
        { label: "Current Weighted Fee", value: formatNumber(Math.round(weightedFee * 100) / 100) + "%" },
        { label: "Total Balance", value: "$" + formatNumber(Math.round(totalBalance)) },
        { label: "Projected Savings Over " + formatNumber(years) + " Years", value: "$" + formatNumber(Math.round(totalSavings)) }
      ]
    };
  }`,
  [
    { q: "Should I consolidate my retirement accounts?", a: "Consolidation often makes sense when you have multiple old 401k plans with high fees. Benefits include simplified management, potentially lower fees, easier asset allocation, and streamlined required minimum distributions. However, consider any unique benefits of existing plans before rolling over." },
    { q: "What is the difference between a rollover and a transfer?", a: "A direct transfer (trustee-to-trustee) moves funds between accounts without you touching the money, avoiding withholding and penalties. A rollover gives you the funds for up to 60 days, during which you must deposit them into the new account to avoid taxes and penalties." },
    { q: "Can I roll a 401k into an IRA?", a: "Yes, you can roll a traditional 401k into a traditional IRA or a Roth 401k into a Roth IRA tax-free. Rolling a traditional 401k into a Roth IRA triggers a taxable Roth conversion on the full amount." }
  ],
  `Current Annual Fees = Sum of (Balance x Fee %) for each account
Consolidated Fees = Total Balance x New Fee %
Annual Savings = Current Fees - Consolidated Fees
Projected Savings = Sum of Annual Savings x (1.06)^year`,
  ["401k-employer-match-maximizer-calculator", "roth-conversion-ladder-calculator"]
);

add(
  "social-security-earnings-test-calculator",
  "Social Security Earnings Test Calculator",
  "Calculate how much of your Social Security benefits will be withheld if you continue working while collecting benefits before your full retirement age.",
  "Finance",
  "finance",
  "$",
  ["Social Security earnings test", "Social Security work limit", "working while collecting Social Security", "earnings limit Social Security"],
  [
    '{ name: "annualEarnings", label: "Expected Annual Earnings ($)", type: "number", min: 0, max: 500000, defaultValue: 40000 }',
    '{ name: "monthlyBenefit", label: "Monthly Social Security Benefit ($)", type: "number", min: 500, max: 10000, defaultValue: 1800 }',
    '{ name: "age", label: "Your Age", type: "number", min: 62, max: 69, defaultValue: 63 }',
    '{ name: "fra", label: "Full Retirement Age", type: "number", min: 66, max: 67, defaultValue: 67 }',
    '{ name: "earningsLimit", label: "Annual Earnings Limit ($)", type: "number", min: 10000, max: 100000, defaultValue: 22320 }'
  ],
  `(inputs) => {
    const earnings = inputs.annualEarnings as number;
    const benefit = inputs.monthlyBenefit as number;
    const age = inputs.age as number;
    const fra = inputs.fra as number;
    const limit = inputs.earningsLimit as number;
    const isYearOfFRA = age === fra - 1 || age === fra;
    const excessEarnings = Math.max(0, earnings - limit);
    const withheldRate = isYearOfFRA ? 3 : 2;
    const annualBenefit = benefit * 12;
    const amountWithheld = Math.min(annualBenefit, Math.floor(excessEarnings / withheldRate));
    const benefitReceived = annualBenefit - amountWithheld;
    const monthsWithheld = benefit > 0 ? Math.ceil(amountWithheld / benefit) : 0;
    const effectiveBenefit = benefitReceived / 12;
    return {
      primary: { label: "Annual Benefits Withheld", value: "$" + formatNumber(Math.round(amountWithheld)) },
      details: [
        { label: "Excess Earnings Above Limit", value: "$" + formatNumber(Math.round(excessEarnings)) },
        { label: "Withholding Rate", value: "$1 per $" + formatNumber(withheldRate) + " over limit" },
        { label: "Annual Benefits Received", value: "$" + formatNumber(Math.round(benefitReceived)) },
        { label: "Effective Monthly Benefit", value: "$" + formatNumber(Math.round(effectiveBenefit)) },
        { label: "Months of Benefits Withheld", value: formatNumber(monthsWithheld) }
      ]
    };
  }`,
  [
    { q: "What is the Social Security earnings test?", a: "If you collect Social Security before your full retirement age and earn more than the annual limit, benefits are temporarily reduced. In 2024, $1 is withheld for every $2 you earn above $22,320. In the year you reach FRA, $1 is withheld for every $3 above a higher limit." },
    { q: "Are withheld benefits lost forever?", a: "No. Benefits withheld due to the earnings test are not lost permanently. When you reach full retirement age, Social Security recalculates your benefit upward to credit you for the months benefits were withheld, resulting in higher monthly payments going forward." },
    { q: "Does the earnings test apply after full retirement age?", a: "No. Once you reach your full retirement age, the earnings test no longer applies. You can earn any amount without any reduction in your Social Security benefits." }
  ],
  `Excess Earnings = Annual Earnings - Earnings Limit
Before FRA Year: Withheld = Excess / 2
In FRA Year: Withheld = Excess / 3
Benefits Received = Annual Benefit - Amount Withheld`,
  ["social-security-spousal-benefit-calculator", "retirement-tax-bracket-calculator"]
);

add(
  "medicare-irmaa-surcharge-calculator",
  "Medicare IRMAA Surcharge Calculator",
  "Calculate your Medicare Income-Related Monthly Adjustment Amount (IRMAA) surcharge based on your modified adjusted gross income from two years prior.",
  "Health",
  "health",
  "H",
  ["Medicare IRMAA", "Medicare surcharge", "Medicare income surcharge", "IRMAA calculator"],
  [
    '{ name: "magi", label: "Modified Adjusted Gross Income ($)", type: "number", min: 0, max: 5000000, defaultValue: 120000 }',
    '{ name: "filingStatus", label: "Filing Status", type: "select", options: [{ value: "1", label: "Single / Head of Household" }, { value: "2", label: "Married Filing Jointly" }, { value: "3", label: "Married Filing Separately" }], defaultValue: "1" }',
    '{ name: "basePartB", label: "Standard Part B Premium ($/mo)", type: "number", min: 100, max: 500, defaultValue: 174.70 }',
    '{ name: "basePartD", label: "Base Part D Premium ($/mo)", type: "number", min: 0, max: 200, defaultValue: 55 }'
  ],
  `(inputs) => {
    const magi = inputs.magi as number;
    const status = parseInt(inputs.filingStatus as string);
    const baseB = inputs.basePartB as number;
    const baseD = inputs.basePartD as number;
    const single = [
      [103000, 0], [129000, 69.90], [161000, 174.70], [193000, 279.50], [500000, 384.30], [Infinity, 419.30]
    ];
    const joint = [
      [206000, 0], [258000, 69.90], [322000, 174.70], [386000, 279.50], [750000, 384.30], [Infinity, 419.30]
    ];
    const sep = [
      [103000, 0], [397000, 384.30], [Infinity, 419.30]
    ];
    const brackets = status === 2 ? joint : status === 3 ? sep : single;
    let partBSurcharge = 0;
    for (const [threshold, surcharge] of brackets) {
      if (magi <= threshold) { partBSurcharge = surcharge; break; }
    }
    const partDSurcharges = [0, 12.90, 33.30, 53.80, 74.20, 81.00];
    let bracketIndex = 0;
    for (let i = 0; i < brackets.length; i++) {
      if (magi <= brackets[i][0]) { bracketIndex = i; break; }
    }
    const partDSurcharge = partDSurcharges[Math.min(bracketIndex, partDSurcharges.length - 1)] || 0;
    const totalMonthlyPartB = baseB + partBSurcharge;
    const totalMonthlyPartD = baseD + partDSurcharge;
    const annualSurcharge = (partBSurcharge + partDSurcharge) * 12;
    return {
      primary: { label: "Monthly IRMAA Surcharge", value: "$" + formatNumber(Math.round((partBSurcharge + partDSurcharge) * 100) / 100) },
      details: [
        { label: "Part B Monthly (with IRMAA)", value: "$" + formatNumber(Math.round(totalMonthlyPartB * 100) / 100) },
        { label: "Part D Monthly (with IRMAA)", value: "$" + formatNumber(Math.round(totalMonthlyPartD * 100) / 100) },
        { label: "Part B Surcharge", value: "$" + formatNumber(Math.round(partBSurcharge * 100) / 100) + "/mo" },
        { label: "Part D Surcharge", value: "$" + formatNumber(Math.round(partDSurcharge * 100) / 100) + "/mo" },
        { label: "Annual IRMAA Cost", value: "$" + formatNumber(Math.round(annualSurcharge)) }
      ]
    };
  }`,
  [
    { q: "What is IRMAA?", a: "IRMAA is the Income-Related Monthly Adjustment Amount, a surcharge added to Medicare Part B and Part D premiums for higher-income beneficiaries. It is based on your modified adjusted gross income from two years prior." },
    { q: "How can I avoid or reduce IRMAA?", a: "Strategies include managing income in the two years before Medicare enrollment, timing Roth conversions carefully, using qualified charitable distributions from IRAs, and filing a life-changing event appeal (Form SSA-44) if your income has decreased due to retirement, divorce, or death of a spouse." },
    { q: "Does IRMAA apply every year?", a: "Yes, IRMAA is recalculated annually based on your most recent tax return available to Social Security (typically from two years prior). If your income drops, the surcharge may decrease or be eliminated the following year." }
  ],
  `IRMAA is determined by MAGI from 2 years prior
Part B Surcharge ranges from $0 to $419.30/month based on income brackets
Part D Surcharge ranges from $0 to $81.00/month
Total Monthly = Base Premium + IRMAA Surcharge`,
  ["retirement-tax-bracket-calculator", "retirement-healthcare-cost-calculator"]
);

add(
  "retirement-withdrawal-sequencing-calculator",
  "Retirement Withdrawal Sequencing Calculator",
  "Optimize the order of withdrawals from taxable, tax-deferred, and tax-free retirement accounts to minimize lifetime taxes paid.",
  "Finance",
  "finance",
  "$",
  ["withdrawal sequencing", "retirement withdrawal order", "tax-efficient withdrawal", "account withdrawal strategy"],
  [
    '{ name: "taxableBalance", label: "Taxable Account Balance ($)", type: "number", min: 0, max: 20000000, defaultValue: 200000 }',
    '{ name: "traditionalBalance", label: "Traditional IRA/401k Balance ($)", type: "number", min: 0, max: 20000000, defaultValue: 500000 }',
    '{ name: "rothBalance", label: "Roth IRA Balance ($)", type: "number", min: 0, max: 20000000, defaultValue: 150000 }',
    '{ name: "annualNeed", label: "Annual Withdrawal Need ($)", type: "number", min: 10000, max: 500000, defaultValue: 60000 }',
    '{ name: "taxRate", label: "Current Marginal Tax Rate (%)", type: "number", min: 10, max: 40, defaultValue: 22 }',
    '{ name: "capitalGainsRate", label: "Capital Gains Tax Rate (%)", type: "number", min: 0, max: 25, defaultValue: 15 }'
  ],
  `(inputs) => {
    const taxable = inputs.taxableBalance as number;
    const traditional = inputs.traditionalBalance as number;
    const roth = inputs.rothBalance as number;
    const need = inputs.annualNeed as number;
    const taxRate = inputs.taxRate as number / 100;
    const cgRate = inputs.capitalGainsRate as number / 100;
    const totalAssets = taxable + traditional + roth;
    const taxFromTaxable = need * cgRate * 0.5;
    const taxFromTraditional = need * taxRate;
    const taxFromRoth = 0;
    const conventionalTax = taxFromTaxable;
    const taxableFirst = Math.min(need, taxable);
    const traditionalNext = Math.min(need - taxableFirst, traditional);
    const rothLast = Math.min(need - taxableFirst - traditionalNext, roth);
    const optimizedTax = taxableFirst * cgRate * 0.5 + traditionalNext * taxRate;
    const yearsOfWithdrawals = need > 0 ? Math.floor(totalAssets / need) : 0;
    return {
      primary: { label: "Tax on Optimal Withdrawal", value: "$" + formatNumber(Math.round(optimizedTax)) },
      details: [
        { label: "From Taxable Account", value: "$" + formatNumber(Math.round(taxableFirst)) + " (tax: $" + formatNumber(Math.round(taxableFirst * cgRate * 0.5)) + ")" },
        { label: "From Traditional IRA/401k", value: "$" + formatNumber(Math.round(traditionalNext)) + " (tax: $" + formatNumber(Math.round(traditionalNext * taxRate)) + ")" },
        { label: "From Roth IRA", value: "$" + formatNumber(Math.round(rothLast)) + " (tax: $0)" },
        { label: "If All From Traditional", value: "Tax: $" + formatNumber(Math.round(taxFromTraditional)) },
        { label: "Total Assets / Years Coverage", value: "$" + formatNumber(Math.round(totalAssets)) + " / " + formatNumber(yearsOfWithdrawals) + " years" }
      ]
    };
  }`,
  [
    { q: "What is the optimal withdrawal order in retirement?", a: "The conventional approach is to withdraw from taxable accounts first, then tax-deferred accounts, and finally Roth accounts. This allows tax-free Roth assets to grow the longest. However, the optimal order depends on your specific tax situation and may vary year to year." },
    { q: "Why should I consider Roth withdrawals last?", a: "Roth withdrawals are tax-free and do not count as income for Social Security taxation or Medicare IRMAA purposes. By letting your Roth grow tax-free as long as possible, you maximize the compounding benefit and preserve a tax-free resource for higher-income years." },
    { q: "When might I deviate from the standard withdrawal order?", a: "Deviating may make sense when you have a low-income year where traditional withdrawals would be taxed at low rates, when you need to manage your tax bracket for IRMAA or Social Security purposes, or when you want to perform partial Roth conversions." }
  ],
  `Conventional Order: Taxable first, then Traditional, then Roth
Tax on Taxable = Withdrawal x Capital Gains Rate x Gain Portion
Tax on Traditional = Withdrawal x Marginal Tax Rate
Tax on Roth = $0`,
  ["roth-conversion-ladder-calculator", "retirement-tax-bracket-calculator"]
);

add(
  "early-retirement-fire-number-calculator",
  "Early Retirement FIRE Number Calculator",
  "Calculate your Financial Independence Retire Early (FIRE) number, the total investment portfolio needed to cover annual expenses indefinitely using the safe withdrawal rate.",
  "Finance",
  "finance",
  "$",
  ["FIRE number", "financial independence calculator", "early retirement number", "FIRE calculator retirement"],
  [
    '{ name: "annualExpenses", label: "Annual Living Expenses ($)", type: "number", min: 10000, max: 500000, defaultValue: 50000 }',
    '{ name: "withdrawalRate", label: "Safe Withdrawal Rate (%)", type: "number", min: 2, max: 6, defaultValue: 4 }',
    '{ name: "currentSavings", label: "Current Investment Portfolio ($)", type: "number", min: 0, max: 20000000, defaultValue: 300000 }',
    '{ name: "annualSavings", label: "Annual Savings ($)", type: "number", min: 0, max: 500000, defaultValue: 40000 }',
    '{ name: "expectedReturn", label: "Expected Annual Return (%)", type: "number", min: 2, max: 15, defaultValue: 7 }'
  ],
  `(inputs) => {
    const expenses = inputs.annualExpenses as number;
    const wr = inputs.withdrawalRate as number / 100;
    const current = inputs.currentSavings as number;
    const savings = inputs.annualSavings as number;
    const returnRate = inputs.expectedReturn as number / 100;
    const fireNumber = wr > 0 ? expenses / wr : expenses * 25;
    const gap = Math.max(0, fireNumber - current);
    let yearsToFire = 0;
    let balance = current;
    if (savings > 0) {
      while (balance < fireNumber && yearsToFire < 100) {
        balance = balance * (1 + returnRate) + savings;
        yearsToFire++;
      }
    }
    const progressPct = fireNumber > 0 ? (current / fireNumber) * 100 : 0;
    const coastFireAge = returnRate > 0 ? Math.ceil(Math.log(fireNumber / Math.max(current, 1)) / Math.log(1 + returnRate)) : 0;
    return {
      primary: { label: "Your FIRE Number", value: "$" + formatNumber(Math.round(fireNumber)) },
      details: [
        { label: "Current Progress", value: formatNumber(Math.round(progressPct * 10) / 10) + "% ($" + formatNumber(Math.round(current)) + ")" },
        { label: "Remaining Gap", value: "$" + formatNumber(Math.round(gap)) },
        { label: "Years to FIRE", value: savings > 0 && yearsToFire < 100 ? formatNumber(yearsToFire) + " years" : "N/A" },
        { label: "Coast FIRE (years, no more saving)", value: formatNumber(coastFireAge) + " years" },
        { label: "Monthly Expense Budget", value: "$" + formatNumber(Math.round(expenses / 12)) }
      ]
    };
  }`,
  [
    { q: "What is the FIRE number?", a: "Your FIRE number is the total investment portfolio needed to cover your annual expenses indefinitely using a safe withdrawal rate. With the traditional 4 percent rule, your FIRE number is 25 times your annual expenses." },
    { q: "What is Coast FIRE?", a: "Coast FIRE means you have saved enough that your portfolio will grow to your FIRE number by traditional retirement age without any additional contributions. You still need to earn enough to cover current expenses but no longer need to save." },
    { q: "Is the 4 percent rule reliable for early retirees?", a: "The 4 percent rule was originally designed for a 30-year retirement. Early retirees with 40 to 50 year horizons may want to use a lower withdrawal rate of 3 to 3.5 percent, or plan for flexible spending that adjusts based on portfolio performance." }
  ],
  `FIRE Number = Annual Expenses / Withdrawal Rate
Years to FIRE: Compound growth of (Current + Annual Savings) until reaching FIRE Number
Coast FIRE Years = ln(FIRE Number / Current Savings) / ln(1 + Return Rate)`,
  ["retirement-portfolio-withdrawal-calculator", "required-savings-rate-calculator"]
);
