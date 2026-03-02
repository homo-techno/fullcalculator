add(
  "legal-fee-estimator-calculator",
  "Legal Fee Estimator Calculator",
  "Estimate total legal fees based on case type, complexity, and attorney rate.",
  "Finance",
  "finance",
  "$",
  ["legal fee estimator", "lawyer cost", "attorney fees", "legal costs"],
  [
    '{ name: "caseType", label: "Case Type", type: "select", options: [{ value: "1", label: "Family Law" }, { value: "2", label: "Criminal Defense" }, { value: "3", label: "Personal Injury" }, { value: "4", label: "Business Litigation" }, { value: "5", label: "Estate Planning" }], defaultValue: "1" }',
    '{ name: "complexity", label: "Case Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" }',
    '{ name: "hourlyRate", label: "Attorney Hourly Rate ($)", type: "number", min: 50, max: 1500, defaultValue: 300 }',
    '{ name: "region", label: "Region Cost Factor", type: "select", options: [{ value: "1", label: "Rural" }, { value: "2", label: "Suburban" }, { value: "3", label: "Urban/Metro" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const caseType = inputs.caseType as string;
    const complexity = parseInt(inputs.complexity as string);
    const hourlyRate = inputs.hourlyRate as number;
    const region = parseInt(inputs.region as string);
    const baseHours: Record<string, number> = { "1": 25, "2": 40, "3": 30, "4": 60, "5": 15 };
    const caseNames: Record<string, string> = { "1": "Family Law", "2": "Criminal Defense", "3": "Personal Injury", "4": "Business Litigation", "5": "Estate Planning" };
    const complexityMult = [1, 1.5, 2.5][complexity - 1] || 1.5;
    const regionMult = [0.8, 1, 1.3][region - 1] || 1;
    const estHours = (baseHours[caseType] || 25) * complexityMult;
    const totalFee = estHours * hourlyRate * regionMult;
    const courtCosts = totalFee * 0.08;
    const grandTotal = totalFee + courtCosts;
    return {
      primary: { label: "Estimated Total Legal Fees", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Case Type", value: caseNames[caseType] || "General" },
        { label: "Estimated Hours", value: formatNumber(estHours) },
        { label: "Attorney Fees", value: "$" + formatNumber(totalFee) },
        { label: "Estimated Court Costs", value: "$" + formatNumber(courtCosts) }
      ]
    };
  }`,
  [
    { q: "How much do lawyers charge per hour?", a: "Attorney rates typically range from $150 to $500+ per hour depending on experience, specialization, and location." },
    { q: "What factors affect legal fees?", a: "Case complexity, attorney experience, geographic region, case type, and whether the case goes to trial all affect total fees." },
    { q: "Are legal fees tax deductible?", a: "Some legal fees are deductible, such as those related to business operations, tax advice, or employment discrimination. Personal legal fees are generally not deductible." }
  ],
  "Total Fees = (Base Hours x Complexity Multiplier) x Hourly Rate x Region Factor + Court Costs",
  ["billable-hours-calculator", "legal-retainer-calculator", "attorney-hourly-rate-comparison-calculator"]
);

add(
  "billable-hours-calculator",
  "Billable Hours Calculator",
  "Calculate total billable amount based on hours worked, billing increment, and hourly rate.",
  "Finance",
  "finance",
  "$",
  ["billable hours", "attorney billing", "law firm billing", "time tracking"],
  [
    '{ name: "hoursWorked", label: "Hours Worked", type: "number", min: 0.1, max: 500, defaultValue: 8 }',
    '{ name: "billingIncrement", label: "Billing Increment (minutes)", type: "select", options: [{ value: "6", label: "6 min (1/10 hr)" }, { value: "10", label: "10 min (1/6 hr)" }, { value: "15", label: "15 min (1/4 hr)" }], defaultValue: "6" }',
    '{ name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 50, max: 2000, defaultValue: 350 }',
    '{ name: "discountPct", label: "Client Discount (%)", type: "number", min: 0, max: 50, defaultValue: 0 }'
  ],
  `(inputs) => {
    const hoursWorked = inputs.hoursWorked as number;
    const billingIncrement = parseInt(inputs.billingIncrement as string);
    const hourlyRate = inputs.hourlyRate as number;
    const discountPct = inputs.discountPct as number;
    const incrementHour = billingIncrement / 60;
    const billedHours = Math.ceil(hoursWorked / incrementHour) * incrementHour;
    const grossAmount = billedHours * hourlyRate;
    const discount = grossAmount * (discountPct / 100);
    const netAmount = grossAmount - discount;
    return {
      primary: { label: "Net Billable Amount", value: "$" + formatNumber(netAmount) },
      details: [
        { label: "Actual Hours", value: formatNumber(hoursWorked) },
        { label: "Billed Hours (rounded up)", value: formatNumber(billedHours) },
        { label: "Gross Amount", value: "$" + formatNumber(grossAmount) },
        { label: "Discount", value: "$" + formatNumber(discount) }
      ]
    };
  }`,
  [
    { q: "What is the most common billing increment for lawyers?", a: "Most law firms use 6-minute increments (one-tenth of an hour), which is the industry standard." },
    { q: "What are billable hours?", a: "Billable hours are the time an attorney spends working directly on a client matter that can be charged to the client." },
    { q: "How many billable hours do lawyers work per year?", a: "Most law firms expect 1,800 to 2,200 billable hours per year, though this varies by firm size and practice area." }
  ],
  "Net Amount = (Rounded Billed Hours x Hourly Rate) x (1 - Discount%/100)",
  ["legal-fee-estimator-calculator", "legal-retainer-calculator", "attorney-hourly-rate-comparison-calculator"]
);

add(
  "court-filing-fee-calculator",
  "Court Filing Fee Calculator",
  "Estimate court filing fees based on case type, court level, and jurisdiction.",
  "Finance",
  "finance",
  "$",
  ["court filing fee", "court costs", "filing fees", "lawsuit cost"],
  [
    '{ name: "caseType", label: "Case Type", type: "select", options: [{ value: "1", label: "Small Claims" }, { value: "2", label: "Civil (under $25k)" }, { value: "3", label: "Civil ($25k-$100k)" }, { value: "4", label: "Civil (over $100k)" }, { value: "5", label: "Family/Divorce" }, { value: "6", label: "Criminal" }], defaultValue: "2" }',
    '{ name: "courtLevel", label: "Court Level", type: "select", options: [{ value: "1", label: "Municipal/Local" }, { value: "2", label: "State/Superior" }, { value: "3", label: "Federal District" }, { value: "4", label: "Appellate" }], defaultValue: "2" }',
    '{ name: "additionalMotions", label: "Additional Motions", type: "number", min: 0, max: 20, defaultValue: 0 }',
    '{ name: "eFilingDiscount", label: "E-Filing", type: "select", options: [{ value: "0", label: "Paper Filing" }, { value: "1", label: "E-Filing" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const caseType = parseInt(inputs.caseType as string);
    const courtLevel = parseInt(inputs.courtLevel as string);
    const additionalMotions = inputs.additionalMotions as number;
    const eFiling = parseInt(inputs.eFilingDiscount as string);
    const baseFees = [75, 200, 350, 500, 300, 150];
    const courtMultipliers = [0.8, 1, 1.5, 2];
    const baseFee = (baseFees[caseType - 1] || 200) * (courtMultipliers[courtLevel - 1] || 1);
    const motionFee = additionalMotions * 60;
    const subtotal = baseFee + motionFee;
    const eDiscount = eFiling === 1 ? subtotal * 0.1 : 0;
    const total = subtotal - eDiscount;
    return {
      primary: { label: "Estimated Filing Fees", value: "$" + formatNumber(total) },
      details: [
        { label: "Base Filing Fee", value: "$" + formatNumber(baseFee) },
        { label: "Motion Fees", value: "$" + formatNumber(motionFee) },
        { label: "E-Filing Savings", value: "$" + formatNumber(eDiscount) },
        { label: "Subtotal Before Discount", value: "$" + formatNumber(subtotal) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to file a lawsuit?", a: "Filing fees vary widely from $30 for small claims to $400+ for federal civil cases depending on jurisdiction and case type." },
    { q: "Can court filing fees be waived?", a: "Yes, courts offer fee waivers (in forma pauperis) for individuals who cannot afford the fees, typically requiring proof of income." },
    { q: "Are filing fees refundable?", a: "Generally, court filing fees are non-refundable once the case has been filed, even if the case is dismissed or settled." }
  ],
  "Total Fees = (Base Fee x Court Multiplier) + (Motion Count x Motion Fee) - E-Filing Discount",
  ["legal-fee-estimator-calculator", "settlement-value-estimator-calculator", "case-timeline-estimator-calculator"]
);

add(
  "settlement-value-estimator-calculator",
  "Settlement Value Estimator Calculator",
  "Estimate potential settlement value for personal injury and civil cases.",
  "Finance",
  "finance",
  "$",
  ["settlement value", "case settlement", "personal injury settlement", "claim value"],
  [
    '{ name: "medicalExpenses", label: "Total Medical Expenses ($)", type: "number", min: 0, max: 5000000, defaultValue: 25000 }',
    '{ name: "lostWages", label: "Lost Wages ($)", type: "number", min: 0, max: 1000000, defaultValue: 10000 }',
    '{ name: "painMultiplier", label: "Injury Severity", type: "select", options: [{ value: "1.5", label: "Minor Injury" }, { value: "3", label: "Moderate Injury" }, { value: "5", label: "Severe Injury" }, { value: "7", label: "Life-Altering Injury" }], defaultValue: "3" }',
    '{ name: "liability", label: "Defendant Liability Strength", type: "select", options: [{ value: "0.5", label: "Weak (50%)" }, { value: "0.75", label: "Moderate (75%)" }, { value: "1", label: "Strong (100%)" }], defaultValue: "0.75" }'
  ],
  `(inputs) => {
    const medicalExpenses = inputs.medicalExpenses as number;
    const lostWages = inputs.lostWages as number;
    const painMultiplier = parseFloat(inputs.painMultiplier as string);
    const liability = parseFloat(inputs.liability as string);
    const painAndSuffering = medicalExpenses * painMultiplier;
    const totalDamages = medicalExpenses + lostWages + painAndSuffering;
    const adjustedValue = totalDamages * liability;
    const lowEstimate = adjustedValue * 0.75;
    const highEstimate = adjustedValue * 1.25;
    return {
      primary: { label: "Estimated Settlement Value", value: "$" + formatNumber(adjustedValue) },
      details: [
        { label: "Medical Expenses", value: "$" + formatNumber(medicalExpenses) },
        { label: "Lost Wages", value: "$" + formatNumber(lostWages) },
        { label: "Pain & Suffering", value: "$" + formatNumber(painAndSuffering) },
        { label: "Settlement Range", value: "$" + formatNumber(lowEstimate) + " - $" + formatNumber(highEstimate) }
      ]
    };
  }`,
  [
    { q: "How is settlement value calculated?", a: "Settlements typically consider medical expenses, lost wages, pain and suffering (often a multiplier of medical costs), and the strength of liability evidence." },
    { q: "What is the pain and suffering multiplier?", a: "The multiplier method multiplies medical expenses by 1.5 to 5 or more depending on injury severity to estimate non-economic damages." },
    { q: "How long does it take to settle a case?", a: "Most personal injury cases settle within 1 to 3 years, though complex cases can take longer." }
  ],
  "Settlement = (Medical + Lost Wages + Medical x Pain Multiplier) x Liability Factor",
  ["legal-fee-estimator-calculator", "contract-breach-damages-calculator", "legal-malpractice-damages-calculator"]
);

add(
  "child-support-guideline-calculator",
  "Child Support Guideline Calculator",
  "Estimate child support payments using income shares model guidelines.",
  "Finance",
  "finance",
  "$",
  ["child support", "child support calculator", "custody support", "parental support"],
  [
    '{ name: "payorIncome", label: "Payor Monthly Gross Income ($)", type: "number", min: 0, max: 100000, defaultValue: 6000 }',
    '{ name: "recipientIncome", label: "Recipient Monthly Gross Income ($)", type: "number", min: 0, max: 100000, defaultValue: 3000 }',
    '{ name: "children", label: "Number of Children", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "overnights", label: "Payor Overnights per Year", type: "number", min: 0, max: 365, defaultValue: 90 }',
    '{ name: "healthInsurance", label: "Monthly Health Insurance for Children ($)", type: "number", min: 0, max: 5000, defaultValue: 300 }'
  ],
  `(inputs) => {
    const payorIncome = inputs.payorIncome as number;
    const recipientIncome = inputs.recipientIncome as number;
    const children = inputs.children as number;
    const overnights = inputs.overnights as number;
    const healthInsurance = inputs.healthInsurance as number;
    const combinedIncome = payorIncome + recipientIncome;
    const childPctTable = [0.2, 0.3, 0.35, 0.38, 0.4];
    const childPct = childPctTable[Math.min(children, 5) - 1] || 0.2;
    const totalObligation = combinedIncome * childPct;
    const payorShare = combinedIncome > 0 ? payorIncome / combinedIncome : 0.5;
    const baseSupport = totalObligation * payorShare;
    const overnightCredit = overnights > 109 ? baseSupport * ((overnights - 109) / 365) * 0.5 : 0;
    const insuranceCredit = healthInsurance * payorShare;
    const monthlySupport = Math.max(baseSupport - overnightCredit - insuranceCredit, 0);
    return {
      primary: { label: "Estimated Monthly Child Support", value: "$" + formatNumber(monthlySupport) },
      details: [
        { label: "Combined Monthly Income", value: "$" + formatNumber(combinedIncome) },
        { label: "Total Child Obligation", value: "$" + formatNumber(totalObligation) },
        { label: "Payor Income Share", value: formatNumber(payorShare * 100) + "%" },
        { label: "Overnight Credit", value: "$" + formatNumber(overnightCredit) },
        { label: "Annual Support", value: "$" + formatNumber(monthlySupport * 12) }
      ]
    };
  }`,
  [
    { q: "How is child support calculated?", a: "Most states use the income shares model, which combines both parents incomes and determines each parent's proportional share of child-rearing costs." },
    { q: "Can child support be modified?", a: "Yes, child support can be modified when there is a material change in circumstances such as job loss, income change, or change in custody." },
    { q: "Does overnight custody affect child support?", a: "Yes, in many states the number of overnights the payor has reduces the support obligation, typically after exceeding a threshold like 110 nights." }
  ],
  "Monthly Support = (Combined Income x Child%) x Payor Share - Overnight Credit - Insurance Credit",
  ["alimony-estimator-calculator", "legal-fee-estimator-calculator", "settlement-value-estimator-calculator"]
);

add(
  "alimony-estimator-calculator",
  "Alimony Estimator Calculator",
  "Estimate spousal support payments based on income, marriage duration, and state guidelines.",
  "Finance",
  "finance",
  "$",
  ["alimony calculator", "spousal support", "maintenance calculator", "divorce alimony"],
  [
    '{ name: "payorIncome", label: "Payor Annual Gross Income ($)", type: "number", min: 0, max: 2000000, defaultValue: 120000 }',
    '{ name: "recipientIncome", label: "Recipient Annual Gross Income ($)", type: "number", min: 0, max: 2000000, defaultValue: 40000 }',
    '{ name: "marriageYears", label: "Years of Marriage", type: "number", min: 0, max: 60, defaultValue: 12 }',
    '{ name: "method", label: "Calculation Method", type: "select", options: [{ value: "1", label: "One-Third Rule" }, { value: "2", label: "40% Difference" }, { value: "3", label: "AAML Formula" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const payorIncome = inputs.payorIncome as number;
    const recipientIncome = inputs.recipientIncome as number;
    const marriageYears = inputs.marriageYears as number;
    const method = inputs.method as string;
    const methodNames: Record<string, string> = { "1": "One-Third Rule", "2": "40% Difference", "3": "AAML Formula" };
    let annualAlimony = 0;
    if (method === "1") {
      annualAlimony = (payorIncome - recipientIncome) / 3;
    } else if (method === "2") {
      annualAlimony = (payorIncome - recipientIncome) * 0.4;
    } else {
      annualAlimony = (payorIncome * 0.3) - (recipientIncome * 0.2);
    }
    annualAlimony = Math.max(annualAlimony, 0);
    const monthlyAlimony = annualAlimony / 12;
    const durationYears = Math.min(Math.round(marriageYears * 0.4), marriageYears);
    const totalAlimony = annualAlimony * durationYears;
    return {
      primary: { label: "Estimated Monthly Alimony", value: "$" + formatNumber(monthlyAlimony) },
      details: [
        { label: "Calculation Method", value: methodNames[method] || "One-Third Rule" },
        { label: "Annual Alimony", value: "$" + formatNumber(annualAlimony) },
        { label: "Estimated Duration", value: formatNumber(durationYears) + " years" },
        { label: "Total Over Duration", value: "$" + formatNumber(totalAlimony) }
      ]
    };
  }`,
  [
    { q: "How long does alimony last?", a: "Alimony duration varies by state and marriage length. A common guideline is 30 to 50 percent of the marriage duration for marriages over 10 years." },
    { q: "What is the difference between alimony and child support?", a: "Alimony supports the lower-earning spouse, while child support specifically covers the needs of children. They are calculated separately." },
    { q: "Can alimony be modified after divorce?", a: "Yes, alimony can often be modified if there is a substantial change in circumstances such as job loss or remarriage of the recipient." }
  ],
  "Monthly Alimony = (Payor Income - Recipient Income) x Method Factor / 12",
  ["child-support-guideline-calculator", "legal-fee-estimator-calculator", "settlement-value-estimator-calculator"]
);

add(
  "bail-bond-cost-calculator",
  "Bail Bond Cost Calculator",
  "Calculate bail bond premiums and total costs including fees.",
  "Finance",
  "finance",
  "$",
  ["bail bond cost", "bail amount", "bond premium", "bail calculator"],
  [
    '{ name: "bailAmount", label: "Bail Amount Set by Court ($)", type: "number", min: 100, max: 10000000, defaultValue: 50000 }',
    '{ name: "bondType", label: "Bond Type", type: "select", options: [{ value: "1", label: "Surety Bond (Bail Bondsman)" }, { value: "2", label: "Cash Bond (Full Amount)" }, { value: "3", label: "Property Bond" }], defaultValue: "1" }',
    '{ name: "premiumRate", label: "Bond Premium Rate (%)", type: "number", min: 5, max: 15, defaultValue: 10 }',
    '{ name: "collateral", label: "Collateral Value ($)", type: "number", min: 0, max: 10000000, defaultValue: 0 }'
  ],
  `(inputs) => {
    const bailAmount = inputs.bailAmount as number;
    const bondType = parseInt(inputs.bondType as string);
    const premiumRate = inputs.premiumRate as number;
    const collateral = inputs.collateral as number;
    const bondNames = ["", "Surety Bond", "Cash Bond", "Property Bond"];
    let outOfPocket = 0;
    let premium = 0;
    let additionalFees = 0;
    if (bondType === 1) {
      premium = bailAmount * (premiumRate / 100);
      additionalFees = 75;
      outOfPocket = premium + additionalFees;
    } else if (bondType === 2) {
      outOfPocket = bailAmount;
      premium = 0;
    } else {
      premium = 0;
      additionalFees = bailAmount * 0.02;
      outOfPocket = additionalFees;
    }
    const refundable = bondType === 2 ? bailAmount : collateral;
    return {
      primary: { label: "Total Out-of-Pocket Cost", value: "$" + formatNumber(outOfPocket) },
      details: [
        { label: "Bond Type", value: bondNames[bondType] || "Surety Bond" },
        { label: "Bail Amount", value: "$" + formatNumber(bailAmount) },
        { label: "Premium (Non-Refundable)", value: "$" + formatNumber(premium) },
        { label: "Additional Fees", value: "$" + formatNumber(additionalFees) },
        { label: "Refundable Upon Compliance", value: "$" + formatNumber(refundable) }
      ]
    };
  }`,
  [
    { q: "How much does a bail bond cost?", a: "A bail bond through a bondsman typically costs 10 percent of the bail amount as a non-refundable premium, though rates vary by state from 5 to 15 percent." },
    { q: "Do you get bail bond money back?", a: "The premium paid to a bail bondsman is non-refundable. However, cash bonds posted directly with the court are returned when the case concludes if the defendant appears at all hearings." },
    { q: "What is collateral for a bail bond?", a: "Collateral is property or assets pledged to secure a bail bond, such as real estate, vehicles, or jewelry. It is returned when the case is resolved." }
  ],
  "Surety Bond Cost = Bail Amount x Premium Rate + Administrative Fees",
  ["legal-fee-estimator-calculator", "court-filing-fee-calculator", "legal-retainer-calculator"]
);

add(
  "legal-retainer-calculator",
  "Legal Retainer Calculator",
  "Estimate how long a legal retainer will last based on expected hours and billing rate.",
  "Finance",
  "finance",
  "$",
  ["legal retainer", "retainer fee", "attorney retainer", "retainer estimate"],
  [
    '{ name: "retainerAmount", label: "Retainer Amount ($)", type: "number", min: 500, max: 500000, defaultValue: 5000 }',
    '{ name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 50, max: 2000, defaultValue: 300 }',
    '{ name: "monthlyHours", label: "Estimated Monthly Hours Needed", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "paraRate", label: "Paralegal Hourly Rate ($)", type: "number", min: 0, max: 500, defaultValue: 100 }',
    '{ name: "paraHours", label: "Paralegal Monthly Hours", type: "number", min: 0, max: 100, defaultValue: 5 }'
  ],
  `(inputs) => {
    const retainerAmount = inputs.retainerAmount as number;
    const hourlyRate = inputs.hourlyRate as number;
    const monthlyHours = inputs.monthlyHours as number;
    const paraRate = inputs.paraRate as number;
    const paraHours = inputs.paraHours as number;
    const monthlyAttorneyCost = monthlyHours * hourlyRate;
    const monthlyParaCost = paraHours * paraRate;
    const monthlyCost = monthlyAttorneyCost + monthlyParaCost;
    const monthsLasting = monthlyCost > 0 ? retainerAmount / monthlyCost : 0;
    const totalHoursAvailable = hourlyRate > 0 ? retainerAmount / hourlyRate : 0;
    return {
      primary: { label: "Retainer Lasts Approximately", value: formatNumber(monthsLasting) + " months" },
      details: [
        { label: "Monthly Attorney Cost", value: "$" + formatNumber(monthlyAttorneyCost) },
        { label: "Monthly Paralegal Cost", value: "$" + formatNumber(monthlyParaCost) },
        { label: "Total Monthly Burn Rate", value: "$" + formatNumber(monthlyCost) },
        { label: "Attorney Hours Available", value: formatNumber(totalHoursAvailable) + " hrs" }
      ]
    };
  }`,
  [
    { q: "What is a legal retainer?", a: "A retainer is an upfront fee paid to an attorney to secure their services. The attorney bills against the retainer as work is performed." },
    { q: "Is a retainer fee refundable?", a: "If the retainer is not fully used, most states require attorneys to refund the unused portion. Earned retainers are non-refundable." },
    { q: "How much is a typical retainer?", a: "Retainers vary widely from $2,000 to $25,000 or more depending on case type, complexity, and the attorney's experience." }
  ],
  "Months Lasting = Retainer Amount / (Attorney Hours x Rate + Paralegal Hours x Rate)",
  ["billable-hours-calculator", "legal-fee-estimator-calculator", "attorney-hourly-rate-comparison-calculator"]
);

add(
  "probate-cost-estimator-calculator",
  "Probate Cost Estimator Calculator",
  "Estimate total probate costs including court fees, attorney fees, and executor compensation.",
  "Finance",
  "finance",
  "$",
  ["probate cost", "estate probate", "probate fees", "estate administration cost"],
  [
    '{ name: "estateValue", label: "Gross Estate Value ($)", type: "number", min: 0, max: 100000000, defaultValue: 500000 }',
    '{ name: "state", label: "Fee Structure", type: "select", options: [{ value: "1", label: "Statutory (% of Estate)" }, { value: "2", label: "Reasonable Fee" }, { value: "3", label: "Flat Fee" }], defaultValue: "1" }',
    '{ name: "isContested", label: "Contested Estate?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
    '{ name: "realProperty", label: "Number of Real Properties", type: "number", min: 0, max: 20, defaultValue: 1 }'
  ],
  `(inputs) => {
    const estateValue = inputs.estateValue as number;
    const state = inputs.state as string;
    const isContested = parseInt(inputs.isContested as string);
    const realProperty = inputs.realProperty as number;
    let attorneyFee = 0;
    if (state === "1") {
      if (estateValue <= 100000) attorneyFee = estateValue * 0.04;
      else if (estateValue <= 1000000) attorneyFee = 4000 + (estateValue - 100000) * 0.03;
      else attorneyFee = 31000 + (estateValue - 1000000) * 0.02;
    } else if (state === "2") {
      attorneyFee = estateValue * 0.025;
    } else {
      attorneyFee = Math.max(estateValue * 0.015, 3000);
    }
    const executorFee = attorneyFee * 0.8;
    const courtFees = 500 + (realProperty * 200);
    const contestedExtra = isContested === 1 ? attorneyFee * 0.5 : 0;
    const totalCost = attorneyFee + executorFee + courtFees + contestedExtra;
    return {
      primary: { label: "Estimated Total Probate Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Attorney Fees", value: "$" + formatNumber(attorneyFee) },
        { label: "Executor Compensation", value: "$" + formatNumber(executorFee) },
        { label: "Court Filing Fees", value: "$" + formatNumber(courtFees) },
        { label: "Contested Litigation Extra", value: "$" + formatNumber(contestedExtra) },
        { label: "Probate Cost as % of Estate", value: formatNumber(estateValue > 0 ? (totalCost / estateValue) * 100 : 0) + "%" }
      ]
    };
  }`,
  [
    { q: "How much does probate cost?", a: "Probate typically costs 3 to 7 percent of the estate value, including attorney fees, executor compensation, court fees, and other administrative costs." },
    { q: "How long does probate take?", a: "Simple probate cases take 6 to 12 months. Complex or contested estates can take 2 to 5 years or more." },
    { q: "Can you avoid probate?", a: "Yes, through living trusts, joint ownership, beneficiary designations, and transfer-on-death accounts. Estate planning can significantly reduce or eliminate probate." }
  ],
  "Total Probate Cost = Attorney Fee + Executor Fee + Court Fees + Contested Extra",
  ["legal-fee-estimator-calculator", "settlement-value-estimator-calculator", "legal-retainer-calculator"]
);

add(
  "attorney-hourly-rate-comparison-calculator",
  "Attorney Hourly Rate Comparison Calculator",
  "Compare attorney costs by experience level, practice area, and geographic region.",
  "Finance",
  "finance",
  "$",
  ["attorney rates", "lawyer hourly rate", "attorney cost comparison", "legal rate comparison"],
  [
    '{ name: "practiceArea", label: "Practice Area", type: "select", options: [{ value: "1", label: "General Practice" }, { value: "2", label: "Family Law" }, { value: "3", label: "Criminal Defense" }, { value: "4", label: "Corporate/Business" }, { value: "5", label: "Intellectual Property" }, { value: "6", label: "Real Estate" }], defaultValue: "1" }',
    '{ name: "experience", label: "Experience Level", type: "select", options: [{ value: "1", label: "Junior (1-3 years)" }, { value: "2", label: "Mid-Level (4-9 years)" }, { value: "3", label: "Senior (10-19 years)" }, { value: "4", label: "Partner (20+ years)" }], defaultValue: "2" }',
    '{ name: "region", label: "Region", type: "select", options: [{ value: "1", label: "Rural" }, { value: "2", label: "Suburban" }, { value: "3", label: "Mid-Size City" }, { value: "4", label: "Major Metro" }], defaultValue: "3" }',
    '{ name: "hoursNeeded", label: "Estimated Hours Needed", type: "number", min: 1, max: 1000, defaultValue: 20 }'
  ],
  `(inputs) => {
    const practiceArea = parseInt(inputs.practiceArea as string);
    const experience = parseInt(inputs.experience as string);
    const region = parseInt(inputs.region as string);
    const hoursNeeded = inputs.hoursNeeded as number;
    const areaNames = ["", "General Practice", "Family Law", "Criminal Defense", "Corporate/Business", "Intellectual Property", "Real Estate"];
    const baseRates = [0, 200, 250, 275, 350, 400, 225];
    const expMultipliers = [0, 0.7, 1, 1.4, 1.9];
    const regionMultipliers = [0, 0.75, 0.9, 1.1, 1.45];
    const rate = (baseRates[practiceArea] || 200) * (expMultipliers[experience] || 1) * (regionMultipliers[region] || 1);
    const totalCost = rate * hoursNeeded;
    const paraRate = rate * 0.35;
    const paraTotalCost = paraRate * hoursNeeded;
    return {
      primary: { label: "Estimated Hourly Rate", value: "$" + formatNumber(rate) },
      details: [
        { label: "Practice Area", value: areaNames[practiceArea] || "General" },
        { label: "Total Cost for " + hoursNeeded + " Hours", value: "$" + formatNumber(totalCost) },
        { label: "Comparable Paralegal Rate", value: "$" + formatNumber(paraRate) },
        { label: "Paralegal Cost for Same Hours", value: "$" + formatNumber(paraTotalCost) }
      ]
    };
  }`,
  [
    { q: "What is the average hourly rate for a lawyer?", a: "The national average is approximately $250 to $350 per hour, but rates range from $150 in rural areas to $1,000+ for top partners in major cities." },
    { q: "Why do IP lawyers charge more?", a: "Intellectual property attorneys often have specialized technical degrees in addition to law degrees, and the subject matter requires highly specialized knowledge." },
    { q: "Should I hire a cheaper lawyer to save money?", a: "Not necessarily. An experienced attorney may resolve your case faster and more effectively, potentially costing less overall than a cheaper but less efficient attorney." }
  ],
  "Hourly Rate = Base Rate x Experience Multiplier x Region Multiplier",
  ["legal-fee-estimator-calculator", "billable-hours-calculator", "legal-retainer-calculator"]
);

add(
  "case-timeline-estimator-calculator",
  "Case Timeline Estimator Calculator",
  "Estimate how long a legal case will take from filing to resolution.",
  "Everyday",
  "everyday",
  "~",
  ["case timeline", "lawsuit duration", "case length", "legal case timeline"],
  [
    '{ name: "caseType", label: "Case Type", type: "select", options: [{ value: "1", label: "Small Claims" }, { value: "2", label: "Personal Injury" }, { value: "3", label: "Divorce/Family" }, { value: "4", label: "Contract Dispute" }, { value: "5", label: "Criminal" }, { value: "6", label: "Medical Malpractice" }], defaultValue: "2" }',
    '{ name: "complexity", label: "Case Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" }',
    '{ name: "goToTrial", label: "Likely Outcome", type: "select", options: [{ value: "1", label: "Settlement" }, { value: "2", label: "Mediation" }, { value: "3", label: "Trial" }], defaultValue: "1" }',
    '{ name: "courtBacklog", label: "Court Backlog", type: "select", options: [{ value: "1", label: "Light" }, { value: "2", label: "Moderate" }, { value: "3", label: "Heavy" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const caseType = parseInt(inputs.caseType as string);
    const complexity = parseInt(inputs.complexity as string);
    const goToTrial = parseInt(inputs.goToTrial as string);
    const courtBacklog = parseInt(inputs.courtBacklog as string);
    const caseNames = ["", "Small Claims", "Personal Injury", "Divorce/Family", "Contract Dispute", "Criminal", "Medical Malpractice"];
    const baseMonths = [0, 3, 12, 8, 10, 6, 18];
    const complexMultiplier = [1, 1.5, 2.5][complexity - 1] || 1.5;
    const trialMultiplier = [0.6, 0.8, 1.5][goToTrial - 1] || 1;
    const backlogMultiplier = [0.8, 1, 1.4][courtBacklog - 1] || 1;
    const totalMonths = Math.round((baseMonths[caseType] || 10) * complexMultiplier * trialMultiplier * backlogMultiplier);
    const discoveryPhase = Math.round(totalMonths * 0.4);
    const pretrial = Math.round(totalMonths * 0.25);
    const resolution = totalMonths - discoveryPhase - pretrial;
    return {
      primary: { label: "Estimated Case Duration", value: formatNumber(totalMonths) + " months" },
      details: [
        { label: "Case Type", value: caseNames[caseType] || "General" },
        { label: "Discovery Phase", value: formatNumber(discoveryPhase) + " months" },
        { label: "Pre-Trial Phase", value: formatNumber(pretrial) + " months" },
        { label: "Resolution Phase", value: formatNumber(resolution) + " months" }
      ]
    };
  }`,
  [
    { q: "How long does a typical lawsuit take?", a: "Most civil lawsuits take 12 to 24 months. Simple cases may resolve in 3 to 6 months, while complex litigation can take 3 to 5 years." },
    { q: "What is the discovery phase?", a: "Discovery is the pre-trial phase where both sides exchange evidence, take depositions, and gather information. It typically takes the longest portion of a case." },
    { q: "Does settling save time?", a: "Yes, settlements typically resolve cases 40 to 60 percent faster than going to trial, and avoid the uncertainty of a jury verdict." }
  ],
  "Duration = Base Months x Complexity x Trial Factor x Court Backlog Factor",
  ["court-filing-fee-calculator", "legal-fee-estimator-calculator", "settlement-value-estimator-calculator"]
);

add(
  "legal-malpractice-damages-calculator",
  "Legal Malpractice Damages Calculator",
  "Estimate potential damages in a legal malpractice claim.",
  "Finance",
  "finance",
  "$",
  ["legal malpractice", "attorney malpractice", "malpractice damages", "legal negligence"],
  [
    '{ name: "originalCaseValue", label: "Original Case Value Lost ($)", type: "number", min: 0, max: 50000000, defaultValue: 100000 }',
    '{ name: "legalFeesLost", label: "Legal Fees Paid to Negligent Attorney ($)", type: "number", min: 0, max: 1000000, defaultValue: 15000 }',
    '{ name: "additionalCosts", label: "Additional Costs Incurred ($)", type: "number", min: 0, max: 1000000, defaultValue: 5000 }',
    '{ name: "provability", label: "Case Provability", type: "select", options: [{ value: "0.3", label: "Difficult (30%)" }, { value: "0.5", label: "Moderate (50%)" }, { value: "0.7", label: "Strong (70%)" }, { value: "0.9", label: "Very Strong (90%)" }], defaultValue: "0.5" }'
  ],
  `(inputs) => {
    const originalCaseValue = inputs.originalCaseValue as number;
    const legalFeesLost = inputs.legalFeesLost as number;
    const additionalCosts = inputs.additionalCosts as number;
    const provability = parseFloat(inputs.provability as string);
    const totalDamages = originalCaseValue + legalFeesLost + additionalCosts;
    const adjustedDamages = totalDamages * provability;
    const lowRange = adjustedDamages * 0.7;
    const highRange = adjustedDamages * 1.3;
    const malpracticeLegalFees = adjustedDamages * 0.33;
    const netRecovery = adjustedDamages - malpracticeLegalFees;
    return {
      primary: { label: "Estimated Adjusted Damages", value: "$" + formatNumber(adjustedDamages) },
      details: [
        { label: "Total Raw Damages", value: "$" + formatNumber(totalDamages) },
        { label: "Provability Adjustment", value: formatNumber(provability * 100) + "%" },
        { label: "Estimated Range", value: "$" + formatNumber(lowRange) + " - $" + formatNumber(highRange) },
        { label: "Contingency Fee (33%)", value: "$" + formatNumber(malpracticeLegalFees) },
        { label: "Estimated Net Recovery", value: "$" + formatNumber(netRecovery) }
      ]
    };
  }`,
  [
    { q: "What is legal malpractice?", a: "Legal malpractice occurs when an attorney fails to meet the standard of care, causing measurable harm to the client, such as missing deadlines, conflicts of interest, or negligent case handling." },
    { q: "How hard is it to prove legal malpractice?", a: "You must prove the case within a case: that the attorney was negligent AND that you would have won the underlying case but for their negligence." },
    { q: "What is the statute of limitations for legal malpractice?", a: "It varies by state, typically 1 to 6 years from when the malpractice was discovered or should have been discovered." }
  ],
  "Adjusted Damages = (Case Value Lost + Fees Lost + Additional Costs) x Provability Factor",
  ["settlement-value-estimator-calculator", "contract-breach-damages-calculator", "legal-fee-estimator-calculator"]
);

add(
  "contract-breach-damages-calculator",
  "Contract Breach Damages Calculator",
  "Calculate potential damages for breach of contract claims.",
  "Finance",
  "finance",
  "$",
  ["breach of contract", "contract damages", "breach damages", "contract litigation"],
  [
    '{ name: "contractValue", label: "Total Contract Value ($)", type: "number", min: 0, max: 100000000, defaultValue: 250000 }',
    '{ name: "performedValue", label: "Value of Performance Completed ($)", type: "number", min: 0, max: 100000000, defaultValue: 100000 }',
    '{ name: "mitigatedAmount", label: "Amount Mitigated (Replacement Costs Saved) ($)", type: "number", min: 0, max: 100000000, defaultValue: 20000 }',
    '{ name: "consequentialDamages", label: "Consequential/Incidental Damages ($)", type: "number", min: 0, max: 50000000, defaultValue: 15000 }',
    '{ name: "damageType", label: "Damage Measure", type: "select", options: [{ value: "1", label: "Expectation Damages" }, { value: "2", label: "Reliance Damages" }, { value: "3", label: "Restitution Damages" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const contractValue = inputs.contractValue as number;
    const performedValue = inputs.performedValue as number;
    const mitigatedAmount = inputs.mitigatedAmount as number;
    const consequentialDamages = inputs.consequentialDamages as number;
    const damageType = inputs.damageType as string;
    const typeNames: Record<string, string> = { "1": "Expectation Damages", "2": "Reliance Damages", "3": "Restitution Damages" };
    let directDamages = 0;
    if (damageType === "1") {
      directDamages = contractValue - performedValue;
    } else if (damageType === "2") {
      directDamages = performedValue;
    } else {
      directDamages = performedValue * 0.8;
    }
    const totalBeforeMitigation = directDamages + consequentialDamages;
    const totalDamages = Math.max(totalBeforeMitigation - mitigatedAmount, 0);
    return {
      primary: { label: "Estimated Total Damages", value: "$" + formatNumber(totalDamages) },
      details: [
        { label: "Damage Measure", value: typeNames[damageType] || "Expectation" },
        { label: "Direct Damages", value: "$" + formatNumber(directDamages) },
        { label: "Consequential Damages", value: "$" + formatNumber(consequentialDamages) },
        { label: "Mitigation Credit", value: "$" + formatNumber(mitigatedAmount) }
      ]
    };
  }`,
  [
    { q: "What are expectation damages?", a: "Expectation damages put the non-breaching party in the position they would have been in had the contract been fully performed, covering the benefit of the bargain." },
    { q: "What is the duty to mitigate?", a: "The injured party must take reasonable steps to minimize their damages. Failure to mitigate can reduce the recoverable amount." },
    { q: "Are punitive damages available for breach of contract?", a: "Generally no. Punitive damages are rarely awarded for breach of contract unless the breach also involves fraud or other tortious conduct." }
  ],
  "Damages = (Contract Value - Performed Value) + Consequential - Mitigated Amount",
  ["settlement-value-estimator-calculator", "legal-malpractice-damages-calculator", "legal-fee-estimator-calculator"]
);

add(
  "intellectual-property-value-calculator",
  "Intellectual Property Value Calculator",
  "Estimate the value of intellectual property including patents, trademarks, and copyrights.",
  "Finance",
  "finance",
  "$",
  ["IP valuation", "intellectual property value", "patent value", "trademark value"],
  [
    '{ name: "ipType", label: "IP Type", type: "select", options: [{ value: "1", label: "Patent" }, { value: "2", label: "Trademark" }, { value: "3", label: "Copyright" }, { value: "4", label: "Trade Secret" }], defaultValue: "1" }',
    '{ name: "annualRevenue", label: "Annual Revenue from IP ($)", type: "number", min: 0, max: 100000000, defaultValue: 500000 }',
    '{ name: "remainingLife", label: "Remaining Useful Life (years)", type: "number", min: 1, max: 70, defaultValue: 10 }',
    '{ name: "growthRate", label: "Annual Growth Rate (%)", type: "number", min: -20, max: 50, defaultValue: 5 }',
    '{ name: "discountRate", label: "Discount Rate (%)", type: "number", min: 1, max: 30, defaultValue: 12 }'
  ],
  `(inputs) => {
    const ipType = inputs.ipType as string;
    const annualRevenue = inputs.annualRevenue as number;
    const remainingLife = inputs.remainingLife as number;
    const growthRate = inputs.growthRate as number;
    const discountRate = inputs.discountRate as number;
    const ipNames: Record<string, string> = { "1": "Patent", "2": "Trademark", "3": "Copyright", "4": "Trade Secret" };
    let totalValue = 0;
    for (let i = 1; i <= remainingLife; i++) {
      const futureRevenue = annualRevenue * Math.pow(1 + growthRate / 100, i);
      totalValue += futureRevenue / Math.pow(1 + discountRate / 100, i);
    }
    const royaltyRates: Record<string, number> = { "1": 0.05, "2": 0.03, "3": 0.04, "4": 0.06 };
    const royaltyValue = totalValue * (royaltyRates[ipType] || 0.05) * 10;
    return {
      primary: { label: "Estimated IP Value (Income Method)", value: "$" + formatNumber(totalValue) },
      details: [
        { label: "IP Type", value: ipNames[ipType] || "Patent" },
        { label: "First Year Revenue", value: "$" + formatNumber(annualRevenue) },
        { label: "Remaining Life", value: formatNumber(remainingLife) + " years" },
        { label: "Relief from Royalty Value", value: "$" + formatNumber(royaltyValue) }
      ]
    };
  }`,
  [
    { q: "How is intellectual property valued?", a: "IP is commonly valued using three approaches: the income method (discounted future cash flows), the market method (comparable transactions), and the cost method (cost to recreate)." },
    { q: "How long does a patent last?", a: "Utility patents last 20 years from the filing date. Design patents last 15 years from the grant date. Maintenance fees are required to keep utility patents in force." },
    { q: "What affects IP value?", a: "Key factors include remaining life, revenue generated, market exclusivity, enforceability, breadth of protection, and competitive landscape." }
  ],
  "IP Value = Sum of [Annual Revenue x (1 + Growth)^n / (1 + Discount)^n] for each year",
  ["trademark-registration-cost-calculator", "patent-filing-cost-calculator", "copyright-registration-cost-calculator"]
);

add(
  "trademark-registration-cost-calculator",
  "Trademark Registration Cost Calculator",
  "Estimate total costs for trademark registration including filing and attorney fees.",
  "Finance",
  "finance",
  "$",
  ["trademark registration", "trademark filing", "trademark cost", "brand registration"],
  [
    '{ name: "classes", label: "Number of Classes", type: "number", min: 1, max: 45, defaultValue: 1 }',
    '{ name: "filingBasis", label: "Filing Basis", type: "select", options: [{ value: "1", label: "TEAS Plus ($250/class)" }, { value: "2", label: "TEAS Standard ($350/class)" }], defaultValue: "1" }',
    '{ name: "useAttorney", label: "Attorney Assistance", type: "select", options: [{ value: "0", label: "Self-Filing" }, { value: "1", label: "Attorney ($1,000-$2,000)" }], defaultValue: "1" }',
    '{ name: "searchType", label: "Trademark Search", type: "select", options: [{ value: "0", label: "No Search" }, { value: "1", label: "Basic Search ($100)" }, { value: "2", label: "Comprehensive Search ($500)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const classes = inputs.classes as number;
    const filingBasis = parseInt(inputs.filingBasis as string);
    const useAttorney = parseInt(inputs.useAttorney as string);
    const searchType = parseInt(inputs.searchType as string);
    const filingFee = filingBasis === 1 ? 250 * classes : 350 * classes;
    const attorneyFee = useAttorney === 1 ? 1500 : 0;
    const searchFees = [0, 100, 500][searchType] || 0;
    const maintenanceFee = 225 * classes;
    const totalInitial = filingFee + attorneyFee + searchFees;
    return {
      primary: { label: "Total Initial Registration Cost", value: "$" + formatNumber(totalInitial) },
      details: [
        { label: "USPTO Filing Fee", value: "$" + formatNumber(filingFee) },
        { label: "Attorney Fee", value: "$" + formatNumber(attorneyFee) },
        { label: "Search Fee", value: "$" + formatNumber(searchFees) },
        { label: "Maintenance (Year 5-6)", value: "$" + formatNumber(maintenanceFee) + " per class" }
      ]
    };
  }`,
  [
    { q: "How much does it cost to register a trademark?", a: "Federal trademark registration costs $250 to $350 per class for filing fees, plus optional attorney fees of $1,000 to $2,000 or more." },
    { q: "How long does trademark registration take?", a: "The USPTO process typically takes 8 to 12 months if there are no issues, and longer if an office action or opposition is filed." },
    { q: "Do I need a lawyer to file a trademark?", a: "While not required for US applicants, an attorney can help avoid costly mistakes, respond to office actions, and ensure comprehensive protection." }
  ],
  "Total Cost = (Filing Fee x Classes) + Attorney Fee + Search Fee",
  ["patent-filing-cost-calculator", "copyright-registration-cost-calculator", "intellectual-property-value-calculator"]
);

add(
  "patent-filing-cost-calculator",
  "Patent Filing Cost Calculator",
  "Estimate patent filing costs including USPTO fees, attorney fees, and maintenance.",
  "Finance",
  "finance",
  "$",
  ["patent filing cost", "patent application", "USPTO fees", "patent attorney cost"],
  [
    '{ name: "patentType", label: "Patent Type", type: "select", options: [{ value: "1", label: "Utility Patent" }, { value: "2", label: "Design Patent" }, { value: "3", label: "Provisional Application" }], defaultValue: "1" }',
    '{ name: "entitySize", label: "Entity Size", type: "select", options: [{ value: "1", label: "Micro Entity" }, { value: "2", label: "Small Entity" }, { value: "3", label: "Large Entity" }], defaultValue: "2" }',
    '{ name: "complexity", label: "Invention Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" }',
    '{ name: "claims", label: "Number of Claims", type: "number", min: 1, max: 100, defaultValue: 20 }'
  ],
  `(inputs) => {
    const patentType = parseInt(inputs.patentType as string);
    const entitySize = parseInt(inputs.entitySize as string);
    const complexity = parseInt(inputs.complexity as string);
    const claims = inputs.claims as number;
    const typeNames = ["", "Utility Patent", "Design Patent", "Provisional Application"];
    const baseFiling = [0, 1600, 1000, 320][patentType] || 1600;
    const entityDiscount = [0, 0.25, 0.5, 1][entitySize] || 0.5;
    const filingFee = baseFiling * entityDiscount;
    const excessClaims = Math.max(claims - 20, 0);
    const claimFee = excessClaims * 80 * entityDiscount;
    const attorneyBase = [0, 8000, 3000, 2000][patentType] || 8000;
    const complexityMult = [1, 1.5, 2.5][complexity - 1] || 1.5;
    const attorneyFee = attorneyBase * complexityMult;
    const drawingFee = patentType === 2 ? 800 : 500;
    const searchFee = [0, 700, 500, 0][patentType] * entityDiscount;
    const totalCost = filingFee + claimFee + attorneyFee + drawingFee + searchFee;
    return {
      primary: { label: "Estimated Total Patent Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Patent Type", value: typeNames[patentType] || "Utility" },
        { label: "USPTO Filing Fee", value: "$" + formatNumber(filingFee) },
        { label: "Excess Claims Fee", value: "$" + formatNumber(claimFee) },
        { label: "Attorney Fee", value: "$" + formatNumber(attorneyFee) },
        { label: "Drawings & Search", value: "$" + formatNumber(drawingFee + searchFee) }
      ]
    };
  }`,
  [
    { q: "How much does a patent cost?", a: "A utility patent typically costs $8,000 to $25,000+ including USPTO fees and attorney costs. Provisional patents are much cheaper at $2,000 to $5,000." },
    { q: "What is the difference between a provisional and nonprovisional patent?", a: "A provisional patent provides a 12-month placeholder filing date at lower cost but does not itself become a patent. A nonprovisional is the full application examined by the USPTO." },
    { q: "How long does it take to get a patent?", a: "The average time from filing to grant is 2 to 3 years for utility patents. Design patents typically take 12 to 18 months." }
  ],
  "Total Cost = Filing Fee + Claims Fee + Attorney Fee + Drawings + Search",
  ["trademark-registration-cost-calculator", "copyright-registration-cost-calculator", "intellectual-property-value-calculator"]
);

add(
  "copyright-registration-cost-calculator",
  "Copyright Registration Cost Calculator",
  "Calculate copyright registration costs with the US Copyright Office.",
  "Finance",
  "finance",
  "$",
  ["copyright registration", "copyright filing", "copyright cost", "USCO fee"],
  [
    '{ name: "workType", label: "Type of Work", type: "select", options: [{ value: "1", label: "Single Work - Single Author" }, { value: "2", label: "Single Work - Multiple Authors" }, { value: "3", label: "Collection/Group" }, { value: "4", label: "Sound Recording" }], defaultValue: "1" }',
    '{ name: "filingMethod", label: "Filing Method", type: "select", options: [{ value: "1", label: "Online (Standard)" }, { value: "2", label: "Paper Filing" }], defaultValue: "1" }',
    '{ name: "works", label: "Number of Registrations", type: "number", min: 1, max: 50, defaultValue: 1 }',
    '{ name: "expedited", label: "Expedited Processing", type: "select", options: [{ value: "0", label: "Standard (3-6 months)" }, { value: "1", label: "Expedited ($800 extra)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const workType = parseInt(inputs.workType as string);
    const filingMethod = parseInt(inputs.filingMethod as string);
    const works = inputs.works as number;
    const expedited = parseInt(inputs.expedited as string);
    const typeNames = ["", "Single Work - Single Author", "Single Work - Multiple Authors", "Collection/Group", "Sound Recording"];
    const baseFees = [0, 45, 65, 65, 65];
    const paperSurcharge = filingMethod === 2 ? 40 : 0;
    const perRegistration = (baseFees[workType] || 65) + paperSurcharge;
    const totalFiling = perRegistration * works;
    const expeditedFee = expedited === 1 ? 800 * works : 0;
    const totalCost = totalFiling + expeditedFee;
    return {
      primary: { label: "Total Copyright Registration Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Work Type", value: typeNames[workType] || "Standard" },
        { label: "Fee Per Registration", value: "$" + formatNumber(perRegistration) },
        { label: "Number of Registrations", value: formatNumber(works) },
        { label: "Expedited Fee", value: "$" + formatNumber(expeditedFee) }
      ]
    };
  }`,
  [
    { q: "How much does copyright registration cost?", a: "Online registration with the US Copyright Office costs $45 for a single work by one author and $65 for other works. Paper filing adds approximately $40." },
    { q: "Is copyright registration required?", a: "No, copyright exists automatically upon creation. However, registration is required to sue for infringement and enables statutory damages and attorney fee recovery." },
    { q: "How long does copyright registration take?", a: "Standard processing takes 3 to 6 months for online filings. Expedited processing (Special Handling) costs $800 and takes 5 to 10 business days." }
  ],
  "Total Cost = (Base Fee + Paper Surcharge) x Registrations + Expedited Fees",
  ["trademark-registration-cost-calculator", "patent-filing-cost-calculator", "intellectual-property-value-calculator"]
);

add(
  "arbitration-cost-calculator",
  "Arbitration Cost Calculator",
  "Estimate arbitration costs including filing fees, arbitrator fees, and administrative costs.",
  "Finance",
  "finance",
  "$",
  ["arbitration cost", "arbitration fees", "ADR cost", "dispute resolution cost"],
  [
    '{ name: "claimAmount", label: "Claim Amount ($)", type: "number", min: 0, max: 100000000, defaultValue: 200000 }',
    '{ name: "arbitrators", label: "Number of Arbitrators", type: "select", options: [{ value: "1", label: "1 Arbitrator" }, { value: "3", label: "3 Arbitrators (Panel)" }], defaultValue: "1" }',
    '{ name: "hearingDays", label: "Estimated Hearing Days", type: "number", min: 1, max: 60, defaultValue: 3 }',
    '{ name: "provider", label: "Arbitration Provider", type: "select", options: [{ value: "1", label: "AAA" }, { value: "2", label: "JAMS" }, { value: "3", label: "Private" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const claimAmount = inputs.claimAmount as number;
    const arbitrators = parseInt(inputs.arbitrators as string);
    const hearingDays = inputs.hearingDays as number;
    const provider = parseInt(inputs.provider as string);
    const providerNames = ["", "AAA", "JAMS", "Private"];
    let filingFee = 0;
    if (claimAmount <= 75000) filingFee = 925;
    else if (claimAmount <= 150000) filingFee = 1850;
    else if (claimAmount <= 300000) filingFee = 2800;
    else if (claimAmount <= 500000) filingFee = 4350;
    else filingFee = 6200;
    const providerMult = [0, 1, 1.2, 0.8][provider] || 1;
    filingFee = filingFee * providerMult;
    const dailyArbitratorRate = 3000;
    const arbitratorFees = dailyArbitratorRate * hearingDays * arbitrators;
    const adminFee = claimAmount * 0.005;
    const totalCost = filingFee + arbitratorFees + adminFee;
    const perPartyCost = totalCost / 2;
    return {
      primary: { label: "Estimated Total Arbitration Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Provider", value: providerNames[provider] || "AAA" },
        { label: "Filing Fee", value: "$" + formatNumber(filingFee) },
        { label: "Arbitrator Fees", value: "$" + formatNumber(arbitratorFees) },
        { label: "Administrative Fee", value: "$" + formatNumber(adminFee) },
        { label: "Per-Party Share (50/50)", value: "$" + formatNumber(perPartyCost) }
      ]
    };
  }`,
  [
    { q: "Is arbitration cheaper than litigation?", a: "Often yes for smaller disputes, but large complex cases can have comparable or higher costs due to arbitrator fees that would not exist in court." },
    { q: "How long does arbitration take?", a: "Most commercial arbitrations conclude within 6 to 12 months, significantly faster than typical court litigation." },
    { q: "Is an arbitration decision final?", a: "Generally yes. Arbitration awards have very limited grounds for appeal, which provides certainty but also limits recourse if the outcome is unfavorable." }
  ],
  "Total Cost = Filing Fee + (Daily Rate x Days x Arbitrators) + Admin Fee",
  ["mediation-cost-calculator", "legal-fee-estimator-calculator", "court-filing-fee-calculator"]
);

add(
  "mediation-cost-calculator",
  "Mediation Cost Calculator",
  "Calculate estimated mediation costs for dispute resolution.",
  "Finance",
  "finance",
  "$",
  ["mediation cost", "mediator fees", "dispute mediation", "ADR mediation"],
  [
    '{ name: "mediatorRate", label: "Mediator Hourly Rate ($)", type: "number", min: 100, max: 2000, defaultValue: 400 }',
    '{ name: "sessions", label: "Number of Sessions", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "hoursPerSession", label: "Hours Per Session", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "parties", label: "Number of Parties", type: "number", min: 2, max: 10, defaultValue: 2 }',
    '{ name: "venueRental", label: "Venue Rental Per Session ($)", type: "number", min: 0, max: 2000, defaultValue: 200 }'
  ],
  `(inputs) => {
    const mediatorRate = inputs.mediatorRate as number;
    const sessions = inputs.sessions as number;
    const hoursPerSession = inputs.hoursPerSession as number;
    const parties = inputs.parties as number;
    const venueRental = inputs.venueRental as number;
    const totalHours = sessions * hoursPerSession;
    const mediatorCost = totalHours * mediatorRate;
    const venueCost = sessions * venueRental;
    const adminFee = 250;
    const totalCost = mediatorCost + venueCost + adminFee;
    const perPartyCost = totalCost / parties;
    return {
      primary: { label: "Total Mediation Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Total Hours", value: formatNumber(totalHours) },
        { label: "Mediator Fees", value: "$" + formatNumber(mediatorCost) },
        { label: "Venue Costs", value: "$" + formatNumber(venueCost) },
        { label: "Admin Fee", value: "$" + formatNumber(adminFee) },
        { label: "Cost Per Party", value: "$" + formatNumber(perPartyCost) }
      ]
    };
  }`,
  [
    { q: "How much does mediation cost?", a: "Mediation typically costs $200 to $500 per hour for the mediator, with total costs often ranging from $2,000 to $10,000 depending on complexity." },
    { q: "How is mediation different from arbitration?", a: "A mediator facilitates negotiation but cannot impose a decision. An arbitrator acts like a judge and issues a binding decision." },
    { q: "What is the success rate of mediation?", a: "Mediation resolves approximately 70 to 85 percent of cases that go through the process, making it a highly effective dispute resolution method." }
  ],
  "Total Cost = (Sessions x Hours x Rate) + Venue Costs + Admin Fee",
  ["arbitration-cost-calculator", "legal-fee-estimator-calculator", "settlement-value-estimator-calculator"]
);

add(
  "notary-fee-calculator",
  "Notary Fee Calculator",
  "Calculate notary public fees based on document type and service type.",
  "Finance",
  "finance",
  "$",
  ["notary fee", "notarization cost", "notary public", "mobile notary"],
  [
    '{ name: "serviceType", label: "Service Type", type: "select", options: [{ value: "1", label: "In-Office Notarization" }, { value: "2", label: "Mobile Notary" }, { value: "3", label: "Remote Online Notarization" }], defaultValue: "1" }',
    '{ name: "documents", label: "Number of Documents", type: "number", min: 1, max: 50, defaultValue: 2 }',
    '{ name: "signatures", label: "Signatures Per Document", type: "number", min: 1, max: 20, defaultValue: 2 }',
    '{ name: "travelMiles", label: "Travel Distance (miles, mobile only)", type: "number", min: 0, max: 100, defaultValue: 10 }'
  ],
  `(inputs) => {
    const serviceType = parseInt(inputs.serviceType as string);
    const documents = inputs.documents as number;
    const signatures = inputs.signatures as number;
    const travelMiles = inputs.travelMiles as number;
    const serviceNames = ["", "In-Office", "Mobile Notary", "Remote Online"];
    const basePerSignature = [0, 10, 15, 25][serviceType] || 10;
    const totalSignatures = documents * signatures;
    const notaryFee = totalSignatures * basePerSignature;
    const travelFee = serviceType === 2 ? travelMiles * 1.5 : 0;
    const serviceFee = serviceType === 2 ? 75 : (serviceType === 3 ? 50 : 0);
    const totalCost = notaryFee + travelFee + serviceFee;
    return {
      primary: { label: "Total Notary Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Service Type", value: serviceNames[serviceType] || "In-Office" },
        { label: "Total Signatures", value: formatNumber(totalSignatures) },
        { label: "Notarization Fees", value: "$" + formatNumber(notaryFee) },
        { label: "Travel Fee", value: "$" + formatNumber(travelFee) },
        { label: "Service Fee", value: "$" + formatNumber(serviceFee) }
      ]
    };
  }`,
  [
    { q: "How much does a notary charge?", a: "Standard notary fees range from $2 to $15 per signature depending on the state. Mobile notaries and remote online notarizations typically charge more." },
    { q: "What does a notary do?", a: "A notary public verifies the identity of document signers, witnesses signatures, and administers oaths to help prevent fraud." },
    { q: "Can any document be notarized?", a: "Most documents can be notarized, but the notary cannot notarize their own signature, a document they have a financial interest in, or incomplete documents." }
  ],
  "Total Cost = (Documents x Signatures x Per-Signature Fee) + Travel Fee + Service Fee",
  ["legal-document-preparation-cost-calculator", "legal-fee-estimator-calculator", "court-filing-fee-calculator"]
);

add(
  "deposition-cost-calculator",
  "Deposition Cost Calculator",
  "Estimate total deposition costs including court reporter, videographer, and transcript fees.",
  "Finance",
  "finance",
  "$",
  ["deposition cost", "court reporter fees", "deposition transcript", "legal deposition"],
  [
    '{ name: "hours", label: "Estimated Deposition Hours", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "depositions", label: "Number of Depositions", type: "number", min: 1, max: 30, defaultValue: 3 }',
    '{ name: "videoRecord", label: "Video Recording", type: "select", options: [{ value: "0", label: "No Video" }, { value: "1", label: "Yes (Videographer)" }], defaultValue: "0" }',
    '{ name: "expeditedTranscript", label: "Transcript Delivery", type: "select", options: [{ value: "1", label: "Standard (14 days)" }, { value: "2", label: "Expedited (7 days)" }, { value: "3", label: "Rush (3 days)" }, { value: "4", label: "Same Day" }], defaultValue: "1" }',
    '{ name: "locationFee", label: "Conference Room Rental ($)", type: "number", min: 0, max: 2000, defaultValue: 0 }'
  ],
  `(inputs) => {
    const hours = inputs.hours as number;
    const depositions = inputs.depositions as number;
    const videoRecord = parseInt(inputs.videoRecord as string);
    const expeditedTranscript = parseInt(inputs.expeditedTranscript as string);
    const locationFee = inputs.locationFee as number;
    const pagesPerHour = 40;
    const totalPages = hours * pagesPerHour;
    const basePerPage = 4;
    const expeditedMultiplier = [0, 1, 1.5, 2, 3][expeditedTranscript] || 1;
    const transcriptCost = totalPages * basePerPage * expeditedMultiplier;
    const reporterAppearance = 350;
    const videoCost = videoRecord === 1 ? hours * 200 + 500 : 0;
    const perDeposition = transcriptCost + reporterAppearance + videoCost + locationFee;
    const totalCost = perDeposition * depositions;
    return {
      primary: { label: "Total Deposition Costs", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Cost Per Deposition", value: "$" + formatNumber(perDeposition) },
        { label: "Transcript Cost Each", value: "$" + formatNumber(transcriptCost) },
        { label: "Reporter Appearance Each", value: "$" + formatNumber(reporterAppearance) },
        { label: "Video Cost Each", value: "$" + formatNumber(videoCost) },
        { label: "Estimated Pages Per Depo", value: formatNumber(totalPages) }
      ]
    };
  }`,
  [
    { q: "How much does a deposition cost?", a: "A typical half-day deposition costs $1,000 to $3,000 including court reporter fees and transcript. Video depositions and expedited transcripts add significant cost." },
    { q: "Who pays for deposition costs?", a: "The party requesting the deposition typically pays for the court reporter and transcript. Each side pays for their own copies." },
    { q: "How long does a deposition last?", a: "Most depositions last 2 to 7 hours. Federal rules limit depositions to one day of 7 hours unless the court orders otherwise." }
  ],
  "Total Cost = (Transcript + Reporter Fee + Video + Venue) x Number of Depositions",
  ["expert-witness-fee-calculator", "legal-fee-estimator-calculator", "case-timeline-estimator-calculator"]
);

add(
  "expert-witness-fee-calculator",
  "Expert Witness Fee Calculator",
  "Estimate expert witness costs including review, report, deposition, and trial testimony.",
  "Finance",
  "finance",
  "$",
  ["expert witness fee", "expert witness cost", "expert testimony", "litigation expert"],
  [
    '{ name: "specialty", label: "Expert Specialty", type: "select", options: [{ value: "1", label: "Medical" }, { value: "2", label: "Engineering" }, { value: "3", label: "Financial/Accounting" }, { value: "4", label: "Vocational/Economic" }, { value: "5", label: "Technology/Computer" }], defaultValue: "1" }',
    '{ name: "reviewHours", label: "Document Review Hours", type: "number", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "depositionHours", label: "Deposition Hours", type: "number", min: 0, max: 20, defaultValue: 4 }',
    '{ name: "trialDays", label: "Trial Testimony Days", type: "number", min: 0, max: 10, defaultValue: 1 }',
    '{ name: "reportNeeded", label: "Written Report Needed", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const specialty = parseInt(inputs.specialty as string);
    const reviewHours = inputs.reviewHours as number;
    const depositionHours = inputs.depositionHours as number;
    const trialDays = inputs.trialDays as number;
    const reportNeeded = parseInt(inputs.reportNeeded as string);
    const specialtyNames = ["", "Medical", "Engineering", "Financial/Accounting", "Vocational/Economic", "Technology/Computer"];
    const hourlyRates = [0, 500, 350, 400, 300, 450];
    const rate = hourlyRates[specialty] || 400;
    const reviewCost = reviewHours * rate;
    const depositionCost = depositionHours * rate * 1.25;
    const trialCost = trialDays * 8 * rate * 1.5;
    const reportCost = reportNeeded === 1 ? 3500 : 0;
    const travelExpenses = trialDays > 0 ? trialDays * 600 : 0;
    const totalCost = reviewCost + depositionCost + trialCost + reportCost + travelExpenses;
    return {
      primary: { label: "Estimated Expert Witness Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Specialty", value: specialtyNames[specialty] || "General" },
        { label: "Hourly Rate", value: "$" + formatNumber(rate) },
        { label: "Review Cost", value: "$" + formatNumber(reviewCost) },
        { label: "Deposition Cost", value: "$" + formatNumber(depositionCost) },
        { label: "Trial Testimony Cost", value: "$" + formatNumber(trialCost) },
        { label: "Report & Travel", value: "$" + formatNumber(reportCost + travelExpenses) }
      ]
    };
  }`,
  [
    { q: "How much does an expert witness charge?", a: "Expert witness fees typically range from $200 to $1,000+ per hour depending on specialty. Medical experts and PhDs tend to charge the highest rates." },
    { q: "Who pays for expert witness fees?", a: "Each party pays for their own expert witnesses. In some cases, the losing party may be ordered to pay the winner's expert costs." },
    { q: "Can expert witness fees be recovered?", a: "Federal courts allow recovery of limited expert witness fees (currently $40/day) as costs. Some state courts and fee-shifting statutes allow full recovery." }
  ],
  "Total = Review Hours x Rate + Deposition x 1.25 Rate + Trial Days x 8 x 1.5 Rate + Report + Travel",
  ["deposition-cost-calculator", "legal-fee-estimator-calculator", "settlement-value-estimator-calculator"]
);

add(
  "jury-duty-pay-calculator",
  "Jury Duty Pay Calculator",
  "Calculate jury duty compensation and estimate lost wages.",
  "Finance",
  "finance",
  "$",
  ["jury duty pay", "juror compensation", "jury service pay", "jury duty wages"],
  [
    '{ name: "days", label: "Days of Jury Service", type: "number", min: 1, max: 180, defaultValue: 5 }',
    '{ name: "courtType", label: "Court Type", type: "select", options: [{ value: "1", label: "Federal Court ($50/day)" }, { value: "2", label: "State Court ($15-40/day)" }], defaultValue: "1" }',
    '{ name: "dailyWage", label: "Your Daily Wage ($)", type: "number", min: 0, max: 5000, defaultValue: 250 }',
    '{ name: "employerPays", label: "Employer Pays During Service?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes, Full Pay" }, { value: "2", label: "Yes, Partial (50%)" }], defaultValue: "0" }',
    '{ name: "mileage", label: "Round-Trip Miles to Court", type: "number", min: 0, max: 200, defaultValue: 20 }'
  ],
  `(inputs) => {
    const days = inputs.days as number;
    const courtType = parseInt(inputs.courtType as string);
    const dailyWage = inputs.dailyWage as number;
    const employerPays = parseInt(inputs.employerPays as string);
    const mileage = inputs.mileage as number;
    const juryPay = courtType === 1 ? 50 : 25;
    const totalJuryPay = juryPay * days;
    const mileageReimbursement = mileage * 0.655 * days;
    const employerPay = employerPays === 1 ? dailyWage * days : (employerPays === 2 ? dailyWage * 0.5 * days : 0);
    const normalEarnings = dailyWage * days;
    const totalCompensation = totalJuryPay + mileageReimbursement + employerPay;
    const lostWages = Math.max(normalEarnings - totalCompensation, 0);
    return {
      primary: { label: "Total Compensation", value: "$" + formatNumber(totalCompensation) },
      details: [
        { label: "Jury Pay", value: "$" + formatNumber(totalJuryPay) + " ($" + formatNumber(juryPay) + "/day)" },
        { label: "Mileage Reimbursement", value: "$" + formatNumber(mileageReimbursement) },
        { label: "Employer Pay", value: "$" + formatNumber(employerPay) },
        { label: "Normal Earnings", value: "$" + formatNumber(normalEarnings) },
        { label: "Estimated Lost Wages", value: "$" + formatNumber(lostWages) }
      ]
    };
  }`,
  [
    { q: "How much does jury duty pay?", a: "Federal courts pay $50 per day ($60 after 10 days). State courts vary widely from $5 to $50 per day, with some paying nothing for the first few days." },
    { q: "Can my employer fire me for jury duty?", a: "Federal law and most state laws prohibit employers from firing, threatening, or penalizing employees for serving on a jury." },
    { q: "How long does jury duty last?", a: "Most jury service lasts 1 to 2 weeks for trial juries. Grand jury duty can last several months. Many people are dismissed after one day of selection." }
  ],
  "Total Compensation = (Jury Pay x Days) + Mileage + Employer Pay",
  ["legal-fee-estimator-calculator", "court-filing-fee-calculator", "case-timeline-estimator-calculator"]
);

add(
  "immigration-filing-fee-calculator",
  "Immigration Filing Fee Calculator",
  "Calculate USCIS filing fees for common immigration applications.",
  "Finance",
  "finance",
  "$",
  ["immigration filing fee", "USCIS fees", "visa cost", "green card cost", "immigration cost"],
  [
    '{ name: "formType", label: "Application Type", type: "select", options: [{ value: "1", label: "I-130 Family Petition ($535)" }, { value: "2", label: "I-485 Adjustment of Status ($1,225)" }, { value: "3", label: "N-400 Naturalization ($710)" }, { value: "4", label: "I-765 Work Permit ($410)" }, { value: "5", label: "I-140 Employer Petition ($700)" }, { value: "6", label: "I-751 Remove Conditions ($750)" }], defaultValue: "1" }',
    '{ name: "biometrics", label: "Biometrics Required", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes ($85)" }], defaultValue: "1" }',
    '{ name: "premiumProcessing", label: "Premium Processing", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes ($2,805)" }], defaultValue: "0" }',
    '{ name: "applicants", label: "Number of Applicants", type: "number", min: 1, max: 10, defaultValue: 1 }',
    '{ name: "attorneyFee", label: "Attorney Fee ($)", type: "number", min: 0, max: 50000, defaultValue: 3000 }'
  ],
  `(inputs) => {
    const formType = parseInt(inputs.formType as string);
    const biometrics = parseInt(inputs.biometrics as string);
    const premiumProcessing = parseInt(inputs.premiumProcessing as string);
    const applicants = inputs.applicants as number;
    const attorneyFee = inputs.attorneyFee as number;
    const formNames = ["", "I-130 Family Petition", "I-485 Adjustment", "N-400 Naturalization", "I-765 Work Permit", "I-140 Employer Petition", "I-751 Remove Conditions"];
    const baseFees = [0, 535, 1225, 710, 410, 700, 750];
    const filingFee = baseFees[formType] || 535;
    const biometricsFee = biometrics === 1 ? 85 : 0;
    const premiumFee = premiumProcessing === 1 ? 2805 : 0;
    const perApplicant = filingFee + biometricsFee + premiumFee;
    const totalFiling = perApplicant * applicants;
    const grandTotal = totalFiling + attorneyFee;
    return {
      primary: { label: "Total Immigration Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Application", value: formNames[formType] || "I-130" },
        { label: "USCIS Filing Fee", value: "$" + formatNumber(filingFee) + " per applicant" },
        { label: "Biometrics Fee", value: "$" + formatNumber(biometricsFee * applicants) },
        { label: "Premium Processing", value: "$" + formatNumber(premiumFee * applicants) },
        { label: "Attorney Fee", value: "$" + formatNumber(attorneyFee) }
      ]
    };
  }`,
  [
    { q: "How much does a green card cost?", a: "The total cost for a family-based green card including I-130 and I-485 filings is approximately $1,760 in government fees, plus attorney fees of $2,000 to $8,000." },
    { q: "Can USCIS fees be waived?", a: "Fee waivers are available for certain forms (I-485, N-400, I-765) if you demonstrate financial hardship, receive means-tested benefits, or have income below 150% of poverty guidelines." },
    { q: "What is premium processing?", a: "Premium processing guarantees USCIS will process certain petitions within 15 business days for an additional fee of $2,805. It is available for I-140 and some I-129 petitions." }
  ],
  "Total Cost = (Filing Fee + Biometrics + Premium) x Applicants + Attorney Fee",
  ["legal-fee-estimator-calculator", "court-filing-fee-calculator", "legal-document-preparation-cost-calculator"]
);

add(
  "legal-document-preparation-cost-calculator",
  "Legal Document Preparation Cost Calculator",
  "Estimate costs for preparing common legal documents with or without attorney assistance.",
  "Finance",
  "finance",
  "$",
  ["legal document cost", "document preparation", "legal forms", "legal document fee"],
  [
    '{ name: "docType", label: "Document Type", type: "select", options: [{ value: "1", label: "Simple Will" }, { value: "2", label: "Living Trust" }, { value: "3", label: "Power of Attorney" }, { value: "4", label: "LLC Operating Agreement" }, { value: "5", label: "Prenuptial Agreement" }, { value: "6", label: "Lease Agreement" }], defaultValue: "1" }',
    '{ name: "prepMethod", label: "Preparation Method", type: "select", options: [{ value: "1", label: "DIY Online Service" }, { value: "2", label: "Legal Document Preparer" }, { value: "3", label: "Attorney Drafted" }], defaultValue: "2" }',
    '{ name: "documents", label: "Number of Documents", type: "number", min: 1, max: 20, defaultValue: 1 }',
    '{ name: "revisions", label: "Expected Revisions", type: "number", min: 0, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const docType = parseInt(inputs.docType as string);
    const prepMethod = parseInt(inputs.prepMethod as string);
    const documents = inputs.documents as number;
    const revisions = inputs.revisions as number;
    const docNames = ["", "Simple Will", "Living Trust", "Power of Attorney", "LLC Operating Agreement", "Prenuptial Agreement", "Lease Agreement"];
    const diyCosts = [0, 50, 150, 35, 100, 200, 40];
    const preparerCosts = [0, 200, 600, 100, 400, 800, 150];
    const attorneyCosts = [0, 800, 2500, 400, 1500, 3500, 600];
    const costs = [[], diyCosts, preparerCosts, attorneyCosts];
    const baseCost = (costs[prepMethod] || preparerCosts)[docType] || 200;
    const revisionCost = prepMethod === 3 ? revisions * baseCost * 0.15 : revisions * baseCost * 0.05;
    const perDoc = baseCost + revisionCost;
    const totalCost = perDoc * documents;
    const methodNames = ["", "DIY Online", "Document Preparer", "Attorney Drafted"];
    return {
      primary: { label: "Total Document Preparation Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Document Type", value: docNames[docType] || "General" },
        { label: "Preparation Method", value: methodNames[prepMethod] || "Preparer" },
        { label: "Base Cost Per Document", value: "$" + formatNumber(baseCost) },
        { label: "Revision Costs", value: "$" + formatNumber(revisionCost * documents) },
        { label: "Cost Per Document", value: "$" + formatNumber(perDoc) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to prepare a will?", a: "A simple will costs $50 to $100 with online services, $200 to $400 with a document preparer, or $500 to $1,500 with an attorney." },
    { q: "Is it worth hiring an attorney for legal documents?", a: "For complex situations like trusts, prenups, or business agreements, attorney review can prevent costly mistakes. Simple documents may be fine with online services." },
    { q: "What is a legal document preparer?", a: "A legal document preparer is a non-attorney professional who helps complete legal forms and documents at a lower cost than an attorney. They cannot provide legal advice." }
  ],
  "Total Cost = (Base Cost + Revision Cost) x Number of Documents",
  ["notary-fee-calculator", "legal-fee-estimator-calculator", "probate-cost-estimator-calculator"]
);
