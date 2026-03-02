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

// === BATCH 10: 100 CALCULATORS ===

add(
  "employee-onboarding-cost-calculator",
  "Employee Onboarding Cost Calculator",
  "Estimate the total cost of onboarding a new hire.",
  "Finance",
  "finance",
  "$",
  ["onboarding", "new hire", "cost", "HR"],
  [
    '{ name: "salary", label: "Annual Salary ($)", type: "number", min: 20000, max: 500000, defaultValue: 55000 }',
    '{ name: "trainingHours", label: "Training Hours", type: "number", min: 1, max: 200, defaultValue: 40 }',
    '{ name: "trainerRate", label: "Trainer Hourly Rate ($)", type: "number", min: 15, max: 200, defaultValue: 50 }',
    '{ name: "equipmentCost", label: "Equipment Cost ($)", type: "number", min: 0, max: 10000, defaultValue: 1500 }',
  ],
  `(inputs) => {
    const salary = inputs.salary as number;
    const trainingHours = inputs.trainingHours as number;
    const trainerRate = inputs.trainerRate as number;
    const equipmentCost = inputs.equipmentCost as number;
    const hourlyRate = salary / 2080;
    const newHireTimeCost = trainingHours * hourlyRate;
    const trainerCost = trainingHours * trainerRate;
    const adminCost = salary * 0.05;
    const totalCost = newHireTimeCost + trainerCost + equipmentCost + adminCost;
    return { primary: { label: "Total Onboarding Cost", value: "$" + formatNumber(totalCost) }, details: [{ label: "New Hire Time Cost", value: "$" + formatNumber(newHireTimeCost) }, { label: "Trainer Cost", value: "$" + formatNumber(trainerCost) }, { label: "Equipment Cost", value: "$" + formatNumber(equipmentCost) }, { label: "Admin & Processing", value: "$" + formatNumber(adminCost) }] };
  }`,
  [
    { q: "How much does it cost to onboard a new employee?", a: "Typically $3,000 to $10,000 depending on role and training needs." },
    { q: "What is included in onboarding costs?", a: "Training time, equipment, admin processing, and trainer fees." },
    { q: "How long does onboarding usually take?", a: "Most programs run 1 to 4 weeks for full productivity ramp-up." }
  ],
  "Total = NewHireTimeCost + TrainerCost + Equipment + AdminCost",
  ["training-roi-calculator", "employee-benefits-cost-calculator", "overtime-cost-calculator"]
);

add(
  "training-roi-calculator",
  "Training ROI Calculator",
  "Calculate the return on investment for a training program.",
  "Finance",
  "finance",
  "$",
  ["training", "ROI", "investment", "development"],
  [
    '{ name: "trainingCost", label: "Total Training Cost ($)", type: "number", min: 100, max: 500000, defaultValue: 5000 }',
    '{ name: "employees", label: "Employees Trained", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "productivityGain", label: "Productivity Gain (%)", type: "number", min: 1, max: 100, defaultValue: 15 }',
    '{ name: "avgSalary", label: "Average Salary ($)", type: "number", min: 20000, max: 300000, defaultValue: 50000 }',
  ],
  `(inputs) => {
    const trainingCost = inputs.trainingCost as number;
    const employees = inputs.employees as number;
    const productivityGain = inputs.productivityGain as number;
    const avgSalary = inputs.avgSalary as number;
    const annualBenefit = employees * avgSalary * (productivityGain / 100);
    const roi = ((annualBenefit - trainingCost) / trainingCost) * 100;
    const costPerEmployee = trainingCost / employees;
    const paybackMonths = (trainingCost / annualBenefit) * 12;
    return { primary: { label: "Training ROI", value: formatNumber(roi) + "%" }, details: [{ label: "Annual Benefit", value: "$" + formatNumber(annualBenefit) }, { label: "Cost Per Employee", value: "$" + formatNumber(costPerEmployee) }, { label: "Payback Period", value: formatNumber(paybackMonths) + " months" }] };
  }`,
  [
    { q: "What is a good training ROI?", a: "A positive ROI above 100% is generally considered a strong return." },
    { q: "How do you measure training effectiveness?", a: "Track productivity gains, error reduction, and employee retention." },
    { q: "When should training ROI be measured?", a: "Measure at 3, 6, and 12 months after completion for accuracy." }
  ],
  "ROI = ((AnnualBenefit - TrainingCost) / TrainingCost) * 100",
  ["employee-onboarding-cost-calculator", "absenteeism-cost-calculator", "employee-benefits-cost-calculator"]
);

add(
  "absenteeism-cost-calculator",
  "Absenteeism Cost Calculator",
  "Calculate the cost of employee absences to your organization.",
  "Finance",
  "finance",
  "$",
  ["absenteeism", "absence", "cost", "productivity"],
  [
    '{ name: "employees", label: "Number of Employees", type: "number", min: 1, max: 10000, defaultValue: 50 }',
    '{ name: "avgDailyPay", label: "Average Daily Pay ($)", type: "number", min: 50, max: 2000, defaultValue: 250 }',
    '{ name: "absentDays", label: "Absent Days Per Year (each)", type: "number", min: 1, max: 50, defaultValue: 7 }',
    '{ name: "replacementFactor", label: "Replacement Cost Factor", type: "select", options: [{ value: "1.25", label: "Low (1.25x)" }, { value: "1.5", label: "Medium (1.5x)" }, { value: "2", label: "High (2x)" }] }',
  ],
  `(inputs) => {
    const employees = inputs.employees as number;
    const avgDailyPay = inputs.avgDailyPay as number;
    const absentDays = inputs.absentDays as number;
    const replacementFactor = inputs.replacementFactor as number;
    const directCost = employees * avgDailyPay * absentDays;
    const indirectCost = directCost * (replacementFactor - 1);
    const totalCost = directCost + indirectCost;
    const costPerEmployee = totalCost / employees;
    const absenteeismRate = (absentDays / 260) * 100;
    return { primary: { label: "Total Absenteeism Cost", value: "$" + formatNumber(totalCost) }, details: [{ label: "Direct Wage Cost", value: "$" + formatNumber(directCost) }, { label: "Indirect Cost", value: "$" + formatNumber(indirectCost) }, { label: "Cost Per Employee", value: "$" + formatNumber(costPerEmployee) }, { label: "Absenteeism Rate", value: formatNumber(absenteeismRate) + "%" }] };
  }`,
  [
    { q: "What is the average absenteeism rate?", a: "The US average is about 2.8% or roughly 7 days per year." },
    { q: "What are indirect costs of absenteeism?", a: "Overtime for others, temp workers, lower morale, and lost productivity." },
    { q: "How can employers reduce absenteeism?", a: "Flexible scheduling, wellness programs, and engagement initiatives help." }
  ],
  "Total = DirectCost + IndirectCost; DirectCost = Employees * DailyPay * AbsentDays",
  ["overtime-cost-calculator", "employee-benefits-cost-calculator", "pto-accrual-calculator"]
);

add(
  "overtime-cost-calculator",
  "Overtime Cost Calculator",
  "Estimate the total cost of overtime labor for your team.",
  "Finance",
  "finance",
  "$",
  ["overtime", "labor", "cost", "wages"],
  [
    '{ name: "hourlyRate", label: "Regular Hourly Rate ($)", type: "number", min: 7, max: 200, defaultValue: 25 }',
    '{ name: "overtimeHours", label: "Overtime Hours Per Week", type: "number", min: 1, max: 40, defaultValue: 10 }',
    '{ name: "employees", label: "Number of Employees", type: "number", min: 1, max: 500, defaultValue: 5 }',
    '{ name: "overtimeRate", label: "Overtime Multiplier", type: "select", options: [{ value: "1.5", label: "Time and a Half (1.5x)" }, { value: "2", label: "Double Time (2x)" }] }',
  ],
  `(inputs) => {
    const hourlyRate = inputs.hourlyRate as number;
    const overtimeHours = inputs.overtimeHours as number;
    const employees = inputs.employees as number;
    const overtimeRate = inputs.overtimeRate as number;
    const otHourlyRate = hourlyRate * overtimeRate;
    const weeklyOTCost = otHourlyRate * overtimeHours * employees;
    const monthlyOTCost = weeklyOTCost * 4.33;
    const annualOTCost = weeklyOTCost * 52;
    const premiumCost = (otHourlyRate - hourlyRate) * overtimeHours * employees * 52;
    return { primary: { label: "Annual Overtime Cost", value: "$" + formatNumber(annualOTCost) }, details: [{ label: "OT Hourly Rate", value: "$" + formatNumber(otHourlyRate) }, { label: "Weekly OT Cost", value: "$" + formatNumber(weeklyOTCost) }, { label: "Monthly OT Cost", value: "$" + formatNumber(monthlyOTCost) }, { label: "Annual Premium Above Base", value: "$" + formatNumber(premiumCost) }] };
  }`,
  [
    { q: "What is the standard overtime rate?", a: "Federal law requires 1.5x the regular rate for hours over 40 per week." },
    { q: "Is overtime cheaper than hiring new staff?", a: "Only up to a point; excessive overtime can cost more than a new hire." },
    { q: "Do salaried employees get overtime?", a: "Non-exempt salaried employees earning below certain thresholds do qualify." }
  ],
  "AnnualOT = HourlyRate * Multiplier * OvertimeHours * Employees * 52",
  ["shift-differential-calculator", "absenteeism-cost-calculator", "workers-comp-rate-calculator"]
);

add(
  "shift-differential-calculator",
  "Shift Differential Calculator",
  "Calculate shift premium pay for evening or night shifts.",
  "Finance",
  "finance",
  "$",
  ["shift", "differential", "premium", "night pay"],
  [
    '{ name: "baseRate", label: "Base Hourly Rate ($)", type: "number", min: 7, max: 200, defaultValue: 22 }',
    '{ name: "differentialPct", label: "Differential (%)", type: "number", min: 1, max: 50, defaultValue: 10 }',
    '{ name: "shiftHours", label: "Shift Hours Per Week", type: "number", min: 1, max: 60, defaultValue: 40 }',
    '{ name: "weeks", label: "Weeks Per Year", type: "number", min: 1, max: 52, defaultValue: 52 }',
  ],
  `(inputs) => {
    const baseRate = inputs.baseRate as number;
    const differentialPct = inputs.differentialPct as number;
    const shiftHours = inputs.shiftHours as number;
    const weeks = inputs.weeks as number;
    const premiumRate = baseRate * (differentialPct / 100);
    const totalHourlyRate = baseRate + premiumRate;
    const weeklyPremium = premiumRate * shiftHours;
    const annualPremium = weeklyPremium * weeks;
    const annualTotal = totalHourlyRate * shiftHours * weeks;
    return { primary: { label: "Annual Shift Premium", value: "$" + formatNumber(annualPremium) }, details: [{ label: "Premium Per Hour", value: "$" + formatNumber(premiumRate) }, { label: "Total Hourly Rate", value: "$" + formatNumber(totalHourlyRate) }, { label: "Weekly Premium", value: "$" + formatNumber(weeklyPremium) }, { label: "Annual Total Pay", value: "$" + formatNumber(annualTotal) }] };
  }`,
  [
    { q: "What is a typical shift differential?", a: "Most employers offer 5% to 15% above base pay for off-shifts." },
    { q: "Is shift differential required by law?", a: "No federal law mandates it, but many employers offer it voluntarily." },
    { q: "Which shifts get differential pay?", a: "Evening, night, weekend, and holiday shifts commonly receive premiums." }
  ],
  "AnnualPremium = BaseRate * (Differential% / 100) * ShiftHours * Weeks",
  ["overtime-cost-calculator", "pto-accrual-calculator", "employee-benefits-cost-calculator"]
);

add(
  "pto-accrual-calculator",
  "PTO Accrual Calculator",
  "Calculate paid time off hours accrued over a period.",
  "Finance",
  "finance",
  "$",
  ["PTO", "accrual", "vacation", "time off"],
  [
    '{ name: "annualPTODays", label: "Annual PTO Days", type: "number", min: 1, max: 60, defaultValue: 15 }',
    '{ name: "monthsWorked", label: "Months Worked", type: "number", min: 1, max: 12, defaultValue: 6 }',
    '{ name: "hoursPerDay", label: "Hours Per Work Day", type: "number", min: 4, max: 12, defaultValue: 8 }',
    '{ name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 7, max: 200, defaultValue: 30 }',
  ],
  `(inputs) => {
    const annualPTODays = inputs.annualPTODays as number;
    const monthsWorked = inputs.monthsWorked as number;
    const hoursPerDay = inputs.hoursPerDay as number;
    const hourlyRate = inputs.hourlyRate as number;
    const monthlyAccrual = annualPTODays / 12;
    const daysAccrued = monthlyAccrual * monthsWorked;
    const hoursAccrued = daysAccrued * hoursPerDay;
    const ptoValue = hoursAccrued * hourlyRate;
    return { primary: { label: "PTO Hours Accrued", value: formatNumber(hoursAccrued) + " hours" }, details: [{ label: "Days Accrued", value: formatNumber(daysAccrued) + " days" }, { label: "Monthly Accrual Rate", value: formatNumber(monthlyAccrual) + " days/month" }, { label: "PTO Dollar Value", value: "$" + formatNumber(ptoValue) }] };
  }`,
  [
    { q: "How is PTO accrual typically calculated?", a: "Most companies divide annual PTO by 12 months or 26 pay periods." },
    { q: "Do unused PTO hours roll over?", a: "It depends on company policy; some cap rollovers while others pay out." },
    { q: "What is the average PTO in the United States?", a: "The average is about 10 to 15 days per year for full-time workers." }
  ],
  "HoursAccrued = (AnnualPTODays / 12) * MonthsWorked * HoursPerDay",
  ["severance-pay-calculator", "absenteeism-cost-calculator", "shift-differential-calculator"]
);

add(
  "severance-pay-calculator",
  "Severance Pay Calculator",
  "Estimate the severance package amount for a departing employee.",
  "Finance",
  "finance",
  "$",
  ["severance", "layoff", "termination", "package"],
  [
    '{ name: "weeklySalary", label: "Weekly Salary ($)", type: "number", min: 200, max: 20000, defaultValue: 1000 }',
    '{ name: "yearsOfService", label: "Years of Service", type: "number", min: 1, max: 40, defaultValue: 5 }',
    '{ name: "weeksPerYear", label: "Weeks Per Year of Service", type: "number", min: 1, max: 4, defaultValue: 2 }',
    '{ name: "benefitMonths", label: "Benefit Continuation (months)", type: "number", min: 0, max: 18, defaultValue: 3 }',
  ],
  `(inputs) => {
    const weeklySalary = inputs.weeklySalary as number;
    const yearsOfService = inputs.yearsOfService as number;
    const weeksPerYear = inputs.weeksPerYear as number;
    const benefitMonths = inputs.benefitMonths as number;
    const severanceWeeks = yearsOfService * weeksPerYear;
    const severancePay = severanceWeeks * weeklySalary;
    const benefitCost = benefitMonths * 800;
    const totalPackage = severancePay + benefitCost;
    return { primary: { label: "Total Severance Package", value: "$" + formatNumber(totalPackage) }, details: [{ label: "Severance Weeks", value: formatNumber(severanceWeeks) + " weeks" }, { label: "Severance Pay", value: "$" + formatNumber(severancePay) }, { label: "Benefit Continuation", value: "$" + formatNumber(benefitCost) }] };
  }`,
  [
    { q: "How is severance pay typically calculated?", a: "Usually 1 to 2 weeks of pay per year of service is standard." },
    { q: "Is severance pay required by law?", a: "No federal law requires it, but some states and contracts mandate it." },
    { q: "Is severance pay taxable?", a: "Yes, severance pay is subject to federal and state income taxes." }
  ],
  "Total = (YearsOfService * WeeksPerYear * WeeklySalary) + BenefitCost",
  ["pto-accrual-calculator", "employee-benefits-cost-calculator", "workers-comp-rate-calculator"]
);

add(
  "workers-comp-rate-calculator",
  "Workers Comp Rate Calculator",
  "Estimate workers compensation insurance premium costs.",
  "Finance",
  "finance",
  "$",
  ["workers comp", "insurance", "premium", "workplace"],
  [
    '{ name: "annualPayroll", label: "Annual Payroll ($)", type: "number", min: 10000, max: 50000000, defaultValue: 500000 }',
    '{ name: "classRate", label: "Class Rate (per $100)", type: "number", min: 0.1, max: 30, defaultValue: 2.5 }',
    '{ name: "experienceMod", label: "Experience Modifier", type: "number", min: 0.5, max: 2, defaultValue: 1 }',
  ],
  `(inputs) => {
    const annualPayroll = inputs.annualPayroll as number;
    const classRate = inputs.classRate as number;
    const experienceMod = inputs.experienceMod as number;
    const manualPremium = (annualPayroll / 100) * classRate;
    const modifiedPremium = manualPremium * experienceMod;
    const monthlyPremium = modifiedPremium / 12;
    const ratePerEmployee = modifiedPremium / (annualPayroll / 50000);
    return { primary: { label: "Annual Premium", value: "$" + formatNumber(modifiedPremium) }, details: [{ label: "Manual Premium", value: "$" + formatNumber(manualPremium) }, { label: "Monthly Premium", value: "$" + formatNumber(monthlyPremium) }, { label: "Cost Per $50k Payroll", value: "$" + formatNumber(ratePerEmployee) }] };
  }`,
  [
    { q: "How is workers comp premium calculated?", a: "Premium equals payroll divided by 100 times the class rate times the modifier." },
    { q: "What is an experience modifier?", a: "It adjusts premiums based on your claims history versus industry average." },
    { q: "What affects the class rate?", a: "Industry risk level, job duties, and state regulations determine the rate." }
  ],
  "Premium = (Payroll / 100) * ClassRate * ExperienceModifier",
  ["overtime-cost-calculator", "employee-benefits-cost-calculator", "absenteeism-cost-calculator"]
);

add(
  "employee-benefits-cost-calculator",
  "Employee Benefits Cost Calculator",
  "Calculate the total annual benefits cost per employee.",
  "Finance",
  "finance",
  "$",
  ["benefits", "employee", "cost", "compensation"],
  [
    '{ name: "healthInsurance", label: "Health Insurance ($/month)", type: "number", min: 0, max: 3000, defaultValue: 600 }',
    '{ name: "retirementMatch", label: "Retirement Match (%)", type: "number", min: 0, max: 10, defaultValue: 4 }',
    '{ name: "annualSalary", label: "Annual Salary ($)", type: "number", min: 20000, max: 500000, defaultValue: 55000 }',
    '{ name: "otherBenefits", label: "Other Annual Benefits ($)", type: "number", min: 0, max: 20000, defaultValue: 2000 }',
  ],
  `(inputs) => {
    const healthInsurance = inputs.healthInsurance as number;
    const retirementMatch = inputs.retirementMatch as number;
    const annualSalary = inputs.annualSalary as number;
    const otherBenefits = inputs.otherBenefits as number;
    const annualHealth = healthInsurance * 12;
    const annualRetirement = annualSalary * (retirementMatch / 100);
    const fica = annualSalary * 0.0765;
    const totalBenefits = annualHealth + annualRetirement + fica + otherBenefits;
    const benefitsPct = (totalBenefits / annualSalary) * 100;
    const totalComp = annualSalary + totalBenefits;
    return { primary: { label: "Total Annual Benefits Cost", value: "$" + formatNumber(totalBenefits) }, details: [{ label: "Health Insurance", value: "$" + formatNumber(annualHealth) }, { label: "Retirement Match", value: "$" + formatNumber(annualRetirement) }, { label: "Employer FICA", value: "$" + formatNumber(fica) }, { label: "Benefits as % of Salary", value: formatNumber(benefitsPct) + "%" }, { label: "Total Compensation", value: "$" + formatNumber(totalComp) }] };
  }`,
  [
    { q: "What percentage of salary do benefits typically cost?", a: "Benefits usually add 25% to 40% on top of base salary." },
    { q: "What is the biggest employee benefit cost?", a: "Health insurance is typically the largest single benefit expense." },
    { q: "What is employer FICA?", a: "Employers pay 7.65% of wages for Social Security and Medicare taxes." }
  ],
  "TotalBenefits = HealthInsurance*12 + Salary*RetirementMatch% + Salary*0.0765 + Other",
  ["employee-onboarding-cost-calculator", "workers-comp-rate-calculator", "severance-pay-calculator"]
);

add(
  "office-space-per-employee-calculator",
  "Office Space Per Employee Calculator",
  "Determine the square footage needed per worker in an office.",
  "Everyday",
  "everyday",
  "~",
  ["office", "space", "square feet", "employee"],
  [
    '{ name: "employees", label: "Number of Employees", type: "number", min: 1, max: 1000, defaultValue: 25 }',
    '{ name: "sqftPerPerson", label: "Sq Ft Per Person", type: "number", min: 50, max: 400, defaultValue: 150 }',
    '{ name: "commonAreaPct", label: "Common Area (%)", type: "number", min: 5, max: 50, defaultValue: 20 }',
    '{ name: "costPerSqft", label: "Cost Per Sq Ft ($/year)", type: "number", min: 5, max: 100, defaultValue: 30 }',
  ],
  `(inputs) => {
    const employees = inputs.employees as number;
    const sqftPerPerson = inputs.sqftPerPerson as number;
    const commonAreaPct = inputs.commonAreaPct as number;
    const costPerSqft = inputs.costPerSqft as number;
    const workspaceSqft = employees * sqftPerPerson;
    const commonSqft = workspaceSqft * (commonAreaPct / 100);
    const totalSqft = workspaceSqft + commonSqft;
    const annualCost = totalSqft * costPerSqft;
    const costPerEmployee = annualCost / employees;
    return { primary: { label: "Total Office Space Needed", value: formatNumber(totalSqft) + " sq ft" }, details: [{ label: "Workspace Area", value: formatNumber(workspaceSqft) + " sq ft" }, { label: "Common Area", value: formatNumber(commonSqft) + " sq ft" }, { label: "Annual Lease Cost", value: "$" + formatNumber(annualCost) }, { label: "Cost Per Employee", value: "$" + formatNumber(costPerEmployee) }] };
  }`,
  [
    { q: "How much office space does each employee need?", a: "The standard is 100 to 200 square feet per person including shared areas." },
    { q: "What is included in common area space?", a: "Break rooms, conference rooms, hallways, restrooms, and lobbies." },
    { q: "How do open offices affect space needs?", a: "Open floor plans can reduce per-person space to 60 to 80 square feet." }
  ],
  "TotalSqft = (Employees * SqftPerPerson) * (1 + CommonArea%/100)",
  ["conference-room-calculator", "cubicle-layout-calculator", "standing-desk-height-calculator"]
);

add(
  "nonprofit-overhead-rate-calculator",
  "Nonprofit Overhead Rate Calculator",
  "Calculate the overhead ratio for a nonprofit organization.",
  "Finance",
  "finance",
  "$",
  ["nonprofit", "overhead", "ratio", "admin cost"],
  [
    '{ name: "totalExpenses", label: "Total Expenses ($)", type: "number", min: 1000, max: 50000000, defaultValue: 500000 }',
    '{ name: "programExpenses", label: "Program Expenses ($)", type: "number", min: 1000, max: 50000000, defaultValue: 375000 }',
    '{ name: "fundraisingExpenses", label: "Fundraising Expenses ($)", type: "number", min: 0, max: 5000000, defaultValue: 50000 }',
  ],
  `(inputs) => {
    const totalExpenses = inputs.totalExpenses as number;
    const programExpenses = inputs.programExpenses as number;
    const fundraisingExpenses = inputs.fundraisingExpenses as number;
    const adminExpenses = totalExpenses - programExpenses - fundraisingExpenses;
    const overheadRate = ((totalExpenses - programExpenses) / totalExpenses) * 100;
    const programRatio = (programExpenses / totalExpenses) * 100;
    const fundraisingRatio = (fundraisingExpenses / totalExpenses) * 100;
    const adminRatio = (adminExpenses / totalExpenses) * 100;
    return { primary: { label: "Overhead Rate", value: formatNumber(overheadRate) + "%" }, details: [{ label: "Program Ratio", value: formatNumber(programRatio) + "%" }, { label: "Admin Ratio", value: formatNumber(adminRatio) + "%" }, { label: "Fundraising Ratio", value: formatNumber(fundraisingRatio) + "%" }, { label: "Admin Expenses", value: "$" + formatNumber(adminExpenses) }] };
  }`,
  [
    { q: "What is a good nonprofit overhead rate?", a: "Most efficient nonprofits keep overhead between 15% and 25%." },
    { q: "What counts as overhead?", a: "Administrative costs and fundraising expenses not tied to programs." },
    { q: "Does low overhead mean a better nonprofit?", a: "Not always; adequate overhead supports sustainability and growth." }
  ],
  "OverheadRate = ((TotalExpenses - ProgramExpenses) / TotalExpenses) * 100",
  ["fundraising-roi-calculator", "donor-retention-calculator", "program-cost-per-outcome-calculator"]
);

add(
  "fundraising-roi-calculator",
  "Fundraising ROI Calculator",
  "Calculate the return on investment for fundraising efforts.",
  "Finance",
  "finance",
  "$",
  ["fundraising", "ROI", "nonprofit", "donations"],
  [
    '{ name: "totalRaised", label: "Total Amount Raised ($)", type: "number", min: 100, max: 50000000, defaultValue: 100000 }',
    '{ name: "fundraisingCost", label: "Fundraising Cost ($)", type: "number", min: 100, max: 5000000, defaultValue: 20000 }',
    '{ name: "events", label: "Number of Events", type: "number", min: 1, max: 50, defaultValue: 4 }',
  ],
  `(inputs) => {
    const totalRaised = inputs.totalRaised as number;
    const fundraisingCost = inputs.fundraisingCost as number;
    const events = inputs.events as number;
    const netRaised = totalRaised - fundraisingCost;
    const roi = ((totalRaised - fundraisingCost) / fundraisingCost) * 100;
    const costPerDollar = fundraisingCost / totalRaised;
    const avgPerEvent = totalRaised / events;
    return { primary: { label: "Fundraising ROI", value: formatNumber(roi) + "%" }, details: [{ label: "Net Amount Raised", value: "$" + formatNumber(netRaised) }, { label: "Cost Per Dollar Raised", value: "$" + formatNumber(costPerDollar) }, { label: "Average Per Event", value: "$" + formatNumber(avgPerEvent) }] };
  }`,
  [
    { q: "What is a good fundraising ROI?", a: "Most nonprofits aim for at least $3 to $4 returned per $1 spent." },
    { q: "How do you calculate cost per dollar raised?", a: "Divide total fundraising expenses by total amount raised." },
    { q: "Which fundraising methods have the best ROI?", a: "Direct mail and major donor campaigns often yield the highest returns." }
  ],
  "ROI = ((TotalRaised - FundraisingCost) / FundraisingCost) * 100",
  ["nonprofit-overhead-rate-calculator", "donor-retention-calculator", "grant-match-calculator"]
);

add(
  "grant-match-calculator",
  "Grant Match Calculator",
  "Calculate matching funds required or provided for a grant.",
  "Finance",
  "finance",
  "$",
  ["grant", "match", "nonprofit", "funding"],
  [
    '{ name: "grantAmount", label: "Grant Amount ($)", type: "number", min: 100, max: 10000000, defaultValue: 50000 }',
    '{ name: "matchRatio", label: "Match Ratio", type: "select", options: [{ value: "0.5", label: "1:2 (50%)" }, { value: "1", label: "1:1 (100%)" }, { value: "2", label: "2:1 (200%)" }] }',
    '{ name: "inKindPct", label: "In-Kind Match Allowed (%)", type: "number", min: 0, max: 100, defaultValue: 25 }',
  ],
  `(inputs) => {
    const grantAmount = inputs.grantAmount as number;
    const matchRatio = inputs.matchRatio as number;
    const inKindPct = inputs.inKindPct as number;
    const matchRequired = grantAmount * matchRatio;
    const inKindAllowed = matchRequired * (inKindPct / 100);
    const cashRequired = matchRequired - inKindAllowed;
    const totalProjectBudget = grantAmount + matchRequired;
    return { primary: { label: "Match Required", value: "$" + formatNumber(matchRequired) }, details: [{ label: "Cash Match Needed", value: "$" + formatNumber(cashRequired) }, { label: "In-Kind Allowed", value: "$" + formatNumber(inKindAllowed) }, { label: "Total Project Budget", value: "$" + formatNumber(totalProjectBudget) }] };
  }`,
  [
    { q: "What is a grant match requirement?", a: "It requires the recipient to provide funds proportional to the grant." },
    { q: "What counts as in-kind match?", a: "Donated goods, services, volunteer time, and use of facilities." },
    { q: "What is a 1:1 match?", a: "You must raise one dollar for every grant dollar, equaling 100% match." }
  ],
  "MatchRequired = GrantAmount * MatchRatio; CashMatch = MatchRequired * (1 - InKind%/100)",
  ["fundraising-roi-calculator", "nonprofit-overhead-rate-calculator", "volunteer-value-calculator"]
);

add(
  "donor-retention-calculator",
  "Donor Retention Calculator",
  "Calculate your donor retention rate over a given period.",
  "Finance",
  "finance",
  "$",
  ["donor", "retention", "nonprofit", "fundraising"],
  [
    '{ name: "donorsLastYear", label: "Donors Last Year", type: "number", min: 1, max: 100000, defaultValue: 500 }',
    '{ name: "repeatDonors", label: "Repeat Donors This Year", type: "number", min: 0, max: 100000, defaultValue: 225 }',
    '{ name: "avgDonation", label: "Average Donation ($)", type: "number", min: 1, max: 100000, defaultValue: 150 }',
  ],
  `(inputs) => {
    const donorsLastYear = inputs.donorsLastYear as number;
    const repeatDonors = inputs.repeatDonors as number;
    const avgDonation = inputs.avgDonation as number;
    const retentionRate = (repeatDonors / donorsLastYear) * 100;
    const lapsedDonors = donorsLastYear - repeatDonors;
    const lostRevenue = lapsedDonors * avgDonation;
    const retainedRevenue = repeatDonors * avgDonation;
    return { primary: { label: "Donor Retention Rate", value: formatNumber(retentionRate) + "%" }, details: [{ label: "Repeat Donors", value: formatNumber(repeatDonors) }, { label: "Lapsed Donors", value: formatNumber(lapsedDonors) }, { label: "Retained Revenue", value: "$" + formatNumber(retainedRevenue) }, { label: "Lost Revenue", value: "$" + formatNumber(lostRevenue) }] };
  }`,
  [
    { q: "What is a good donor retention rate?", a: "The national average is about 45%; above 60% is considered strong." },
    { q: "Why does donor retention matter?", a: "Retaining donors is 5 to 10 times cheaper than acquiring new ones." },
    { q: "How can nonprofits improve retention?", a: "Personalized thank-you messages, impact reports, and regular updates help." }
  ],
  "RetentionRate = (RepeatDonors / DonorsLastYear) * 100",
  ["fundraising-roi-calculator", "nonprofit-overhead-rate-calculator", "volunteer-value-calculator"]
);

add(
  "volunteer-value-calculator",
  "Volunteer Value Calculator",
  "Calculate the economic value of volunteer hours contributed.",
  "Finance",
  "finance",
  "$",
  ["volunteer", "value", "nonprofit", "hours"],
  [
    '{ name: "volunteers", label: "Number of Volunteers", type: "number", min: 1, max: 5000, defaultValue: 20 }',
    '{ name: "hoursPerWeek", label: "Hours Per Week Each", type: "number", min: 1, max: 40, defaultValue: 4 }',
    '{ name: "weeks", label: "Weeks Per Year", type: "number", min: 1, max: 52, defaultValue: 48 }',
    '{ name: "hourlyValue", label: "Value Per Hour ($)", type: "number", min: 10, max: 100, defaultValue: 31 }',
  ],
  `(inputs) => {
    const volunteers = inputs.volunteers as number;
    const hoursPerWeek = inputs.hoursPerWeek as number;
    const weeks = inputs.weeks as number;
    const hourlyValue = inputs.hourlyValue as number;
    const totalHours = volunteers * hoursPerWeek * weeks;
    const totalValue = totalHours * hourlyValue;
    const valuePerVolunteer = totalValue / volunteers;
    const fteEquivalent = totalHours / 2080;
    return { primary: { label: "Total Volunteer Value", value: "$" + formatNumber(totalValue) }, details: [{ label: "Total Hours", value: formatNumber(totalHours) + " hours" }, { label: "Value Per Volunteer", value: "$" + formatNumber(valuePerVolunteer) }, { label: "FTE Equivalent", value: formatNumber(fteEquivalent) + " employees" }] };
  }`,
  [
    { q: "What is the current value of a volunteer hour?", a: "The Independent Sector estimates about $31.80 per hour nationally." },
    { q: "Why calculate volunteer value?", a: "It helps demonstrate community support for grants and annual reports." },
    { q: "Can volunteer hours count as grant match?", a: "Yes, many grants accept volunteer time as an in-kind contribution." }
  ],
  "TotalValue = Volunteers * HoursPerWeek * Weeks * HourlyValue",
  ["grant-match-calculator", "donor-retention-calculator", "nonprofit-overhead-rate-calculator"]
);

add(
  "program-cost-per-outcome-calculator",
  "Program Cost Per Outcome Calculator",
  "Calculate the cost per outcome for a nonprofit program.",
  "Finance",
  "finance",
  "$",
  ["program", "cost", "outcome", "nonprofit"],
  [
    '{ name: "programBudget", label: "Program Budget ($)", type: "number", min: 100, max: 10000000, defaultValue: 100000 }',
    '{ name: "outcomes", label: "Number of Outcomes Achieved", type: "number", min: 1, max: 100000, defaultValue: 200 }',
    '{ name: "participants", label: "Total Participants", type: "number", min: 1, max: 100000, defaultValue: 300 }',
  ],
  `(inputs) => {
    const programBudget = inputs.programBudget as number;
    const outcomes = inputs.outcomes as number;
    const participants = inputs.participants as number;
    const costPerOutcome = programBudget / outcomes;
    const costPerParticipant = programBudget / participants;
    const successRate = (outcomes / participants) * 100;
    const effectiveCost = costPerParticipant / (successRate / 100);
    return { primary: { label: "Cost Per Outcome", value: "$" + formatNumber(costPerOutcome) }, details: [{ label: "Cost Per Participant", value: "$" + formatNumber(costPerParticipant) }, { label: "Success Rate", value: formatNumber(successRate) + "%" }, { label: "Effective Cost Per Success", value: "$" + formatNumber(effectiveCost) }] };
  }`,
  [
    { q: "What is cost per outcome?", a: "It is the total program cost divided by the number of achieved outcomes." },
    { q: "Why is cost per outcome important?", a: "It helps funders compare program efficiency across organizations." },
    { q: "How do you define an outcome?", a: "Outcomes are measurable changes such as jobs placed or grades improved." }
  ],
  "CostPerOutcome = ProgramBudget / Outcomes; SuccessRate = Outcomes / Participants * 100",
  ["nonprofit-overhead-rate-calculator", "volunteer-value-calculator", "fundraising-roi-calculator"]
);

add(
  "church-tithe-calculator",
  "Church Tithe Calculator",
  "Calculate the tithe amount based on income.",
  "Finance",
  "finance",
  "$",
  ["tithe", "church", "giving", "income"],
  [
    '{ name: "grossIncome", label: "Gross Annual Income ($)", type: "number", min: 1000, max: 1000000, defaultValue: 60000 }',
    '{ name: "tithePct", label: "Tithe Percentage (%)", type: "number", min: 1, max: 30, defaultValue: 10 }',
    '{ name: "frequency", label: "Giving Frequency", type: "select", options: [{ value: "52", label: "Weekly" }, { value: "26", label: "Biweekly" }, { value: "12", label: "Monthly" }] }',
  ],
  `(inputs) => {
    const grossIncome = inputs.grossIncome as number;
    const tithePct = inputs.tithePct as number;
    const frequency = inputs.frequency as number;
    const annualTithe = grossIncome * (tithePct / 100);
    const perPeriod = annualTithe / frequency;
    const monthlyTithe = annualTithe / 12;
    const weeklyTithe = annualTithe / 52;
    return { primary: { label: "Annual Tithe", value: "$" + formatNumber(annualTithe) }, details: [{ label: "Per Giving Period", value: "$" + formatNumber(perPeriod) }, { label: "Monthly Amount", value: "$" + formatNumber(monthlyTithe) }, { label: "Weekly Amount", value: "$" + formatNumber(weeklyTithe) }] };
  }`,
  [
    { q: "What is a tithe?", a: "A tithe is traditionally 10% of income given to a church or ministry." },
    { q: "Should I tithe on gross or net income?", a: "This is a personal decision; many choose gross for a full 10% tithe." },
    { q: "Is tithing tax deductible?", a: "Yes, donations to qualified churches are deductible if you itemize." }
  ],
  "AnnualTithe = GrossIncome * (TithePct / 100); PerPeriod = AnnualTithe / Frequency",
  ["church-budget-calculator", "mission-trip-cost-calculator", "donor-retention-calculator"]
);

add(
  "church-seating-capacity-calculator",
  "Church Seating Capacity Calculator",
  "Estimate church pew seating capacity by room dimensions.",
  "Everyday",
  "everyday",
  "~",
  ["church", "seating", "pews", "capacity"],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 20, max: 500, defaultValue: 80 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 15, max: 300, defaultValue: 50 }',
    '{ name: "pewLength", label: "Pew Length (ft)", type: "number", min: 6, max: 20, defaultValue: 12 }',
    '{ name: "aisleWidth", label: "Aisle Width (ft)", type: "number", min: 3, max: 10, defaultValue: 5 }',
  ],
  `(inputs) => {
    const roomLength = inputs.roomLength as number;
    const roomWidth = inputs.roomWidth as number;
    const pewLength = inputs.pewLength as number;
    const aisleWidth = inputs.aisleWidth as number;
    const usableLength = roomLength * 0.75;
    const rowSpacing = 3;
    const rows = Math.floor(usableLength / rowSpacing);
    const pewsPerRow = Math.floor((roomWidth - aisleWidth) / pewLength);
    const totalPews = rows * pewsPerRow;
    const seatsPerPew = Math.floor(pewLength / 1.8);
    const totalSeats = totalPews * seatsPerPew;
    return { primary: { label: "Total Seating Capacity", value: formatNumber(totalSeats) + " seats" }, details: [{ label: "Number of Rows", value: formatNumber(rows) }, { label: "Pews Per Row", value: formatNumber(pewsPerRow) }, { label: "Total Pews", value: formatNumber(totalPews) }, { label: "Seats Per Pew", value: formatNumber(seatsPerPew) }] };
  }`,
  [
    { q: "How much space does each person need in a pew?", a: "About 18 to 22 inches or roughly 1.8 feet per person." },
    { q: "What is standard pew row spacing?", a: "Rows are typically 33 to 36 inches apart from back to back." },
    { q: "How wide should a church aisle be?", a: "Main aisles should be at least 4 to 5 feet for fire code compliance." }
  ],
  "TotalSeats = Rows * PewsPerRow * SeatsPerPew; Rows = UsableLength / RowSpacing",
  ["conference-room-calculator", "church-budget-calculator", "potluck-food-calculator"]
);

add(
  "church-budget-calculator",
  "Church Budget Calculator",
  "Allocate a church budget across ministry categories.",
  "Finance",
  "finance",
  "$",
  ["church", "budget", "ministry", "allocation"],
  [
    '{ name: "totalBudget", label: "Total Annual Budget ($)", type: "number", min: 10000, max: 10000000, defaultValue: 250000 }',
    '{ name: "staffPct", label: "Staff & Salaries (%)", type: "number", min: 10, max: 70, defaultValue: 45 }',
    '{ name: "facilitiesPct", label: "Facilities & Utilities (%)", type: "number", min: 5, max: 40, defaultValue: 20 }',
    '{ name: "missionsPct", label: "Missions & Outreach (%)", type: "number", min: 0, max: 30, defaultValue: 15 }',
  ],
  `(inputs) => {
    const totalBudget = inputs.totalBudget as number;
    const staffPct = inputs.staffPct as number;
    const facilitiesPct = inputs.facilitiesPct as number;
    const missionsPct = inputs.missionsPct as number;
    const otherPct = 100 - staffPct - facilitiesPct - missionsPct;
    const staffAmt = totalBudget * (staffPct / 100);
    const facilitiesAmt = totalBudget * (facilitiesPct / 100);
    const missionsAmt = totalBudget * (missionsPct / 100);
    const otherAmt = totalBudget * (otherPct / 100);
    return { primary: { label: "Staff Budget", value: "$" + formatNumber(staffAmt) }, details: [{ label: "Facilities Budget", value: "$" + formatNumber(facilitiesAmt) }, { label: "Missions Budget", value: "$" + formatNumber(missionsAmt) }, { label: "Other Ministries", value: "$" + formatNumber(otherAmt) }, { label: "Other Percentage", value: formatNumber(otherPct) + "%" }] };
  }`,
  [
    { q: "What percentage should churches spend on staff?", a: "Most churches allocate 40% to 55% of the budget to staff and salaries." },
    { q: "How much should go to missions?", a: "A common guideline is 10% to 20% of the total budget for missions." },
    { q: "What falls under facilities costs?", a: "Mortgage, utilities, maintenance, insurance, and capital improvements." }
  ],
  "StaffBudget = TotalBudget * StaffPct/100; Other = TotalBudget * RemainingPct/100",
  ["church-tithe-calculator", "mission-trip-cost-calculator", "nonprofit-overhead-rate-calculator"]
);

add(
  "mission-trip-cost-calculator",
  "Mission Trip Cost Calculator",
  "Estimate the total budget for a church mission trip.",
  "Finance",
  "finance",
  "$",
  ["mission trip", "church", "travel", "budget"],
  [
    '{ name: "travelers", label: "Number of Travelers", type: "number", min: 1, max: 100, defaultValue: 12 }',
    '{ name: "airfare", label: "Airfare Per Person ($)", type: "number", min: 0, max: 5000, defaultValue: 800 }',
    '{ name: "days", label: "Trip Duration (days)", type: "number", min: 1, max: 60, defaultValue: 10 }',
    '{ name: "dailyCost", label: "Daily Expenses Per Person ($)", type: "number", min: 10, max: 300, defaultValue: 50 }',
  ],
  `(inputs) => {
    const travelers = inputs.travelers as number;
    const airfare = inputs.airfare as number;
    const days = inputs.days as number;
    const dailyCost = inputs.dailyCost as number;
    const totalAirfare = travelers * airfare;
    const totalDaily = travelers * days * dailyCost;
    const insurance = travelers * 50;
    const supplies = travelers * 100;
    const totalCost = totalAirfare + totalDaily + insurance + supplies;
    const costPerPerson = totalCost / travelers;
    return { primary: { label: "Total Trip Cost", value: "$" + formatNumber(totalCost) }, details: [{ label: "Total Airfare", value: "$" + formatNumber(totalAirfare) }, { label: "Living Expenses", value: "$" + formatNumber(totalDaily) }, { label: "Travel Insurance", value: "$" + formatNumber(insurance) }, { label: "Supplies & Materials", value: "$" + formatNumber(supplies) }, { label: "Cost Per Person", value: "$" + formatNumber(costPerPerson) }] };
  }`,
  [
    { q: "How much does a mission trip typically cost?", a: "Domestic trips cost $500 to $2,000; international trips run $1,500 to $5,000." },
    { q: "What expenses are included in a mission trip?", a: "Airfare, lodging, meals, supplies, insurance, and local transport." },
    { q: "Can mission trip costs be tax deductible?", a: "Personal expenses on mission trips may be deductible if through a church." }
  ],
  "TotalCost = Airfare + DailyExpenses + Insurance + Supplies",
  ["church-budget-calculator", "church-tithe-calculator", "potluck-food-calculator"]
);

add(
  "vacation-bible-school-calculator",
  "Vacation Bible School Calculator",
  "Estimate supply needs and costs for VBS programs.",
  "Everyday",
  "everyday",
  "~",
  ["VBS", "vacation bible school", "supplies", "church"],
  [
    '{ name: "children", label: "Expected Children", type: "number", min: 10, max: 500, defaultValue: 75 }',
    '{ name: "days", label: "Number of Days", type: "number", min: 1, max: 10, defaultValue: 5 }',
    '{ name: "supplyPerChild", label: "Supply Cost Per Child ($)", type: "number", min: 2, max: 50, defaultValue: 12 }',
    '{ name: "snackPerChild", label: "Snack Cost Per Child/Day ($)", type: "number", min: 0.5, max: 10, defaultValue: 2 }',
  ],
  `(inputs) => {
    const children = inputs.children as number;
    const days = inputs.days as number;
    const supplyPerChild = inputs.supplyPerChild as number;
    const snackPerChild = inputs.snackPerChild as number;
    const supplyCost = children * supplyPerChild;
    const snackCost = children * days * snackPerChild;
    const decorations = days * 30;
    const totalCost = supplyCost + snackCost + decorations;
    const volunteersNeeded = Math.ceil(children / 5);
    const costPerChild = totalCost / children;
    return { primary: { label: "Total VBS Budget", value: "$" + formatNumber(totalCost) }, details: [{ label: "Supply Cost", value: "$" + formatNumber(supplyCost) }, { label: "Snack Cost", value: "$" + formatNumber(snackCost) }, { label: "Decorations", value: "$" + formatNumber(decorations) }, { label: "Volunteers Needed", value: formatNumber(volunteersNeeded) }, { label: "Cost Per Child", value: "$" + formatNumber(costPerChild) }] };
  }`,
  [
    { q: "How much does VBS cost per child?", a: "Typical VBS programs spend $10 to $25 per child on supplies and snacks." },
    { q: "How many volunteers does VBS need?", a: "Plan for about 1 volunteer for every 5 children attending." },
    { q: "What supplies are needed for VBS?", a: "Craft kits, curriculum materials, snacks, decorations, and name tags." }
  ],
  "TotalCost = SupplyCost + SnackCost + Decorations; Volunteers = Children / 5",
  ["potluck-food-calculator", "church-budget-calculator", "mission-trip-cost-calculator"]
);

add(
  "potluck-food-calculator",
  "Potluck Food Calculator",
  "Calculate food amounts needed for a potluck gathering.",
  "Everyday",
  "everyday",
  "~",
  ["potluck", "food", "party", "servings"],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", min: 5, max: 500, defaultValue: 40 }',
    '{ name: "dishes", label: "Number of Dishes", type: "number", min: 2, max: 30, defaultValue: 8 }',
    '{ name: "meatLbs", label: "Meat Per Person (lbs)", type: "number", min: 0, max: 2, defaultValue: 0.5 }',
    '{ name: "sidesPerPerson", label: "Side Servings Per Person", type: "number", min: 1, max: 5, defaultValue: 3 }',
  ],
  `(inputs) => {
    const guests = inputs.guests as number;
    const dishes = inputs.dishes as number;
    const meatLbs = inputs.meatLbs as number;
    const sidesPerPerson = inputs.sidesPerPerson as number;
    const totalMeat = guests * meatLbs;
    const totalSideServings = guests * sidesPerPerson;
    const servingsPerDish = Math.ceil(totalSideServings / dishes);
    const beverageGallons = Math.ceil(guests * 0.5);
    const dessertServings = guests;
    return { primary: { label: "Total Meat Needed", value: formatNumber(totalMeat) + " lbs" }, details: [{ label: "Total Side Servings", value: formatNumber(totalSideServings) }, { label: "Servings Per Dish", value: formatNumber(servingsPerDish) }, { label: "Beverage Needed", value: formatNumber(beverageGallons) + " gallons" }, { label: "Dessert Servings", value: formatNumber(dessertServings) }] };
  }`,
  [
    { q: "How much food per person for a potluck?", a: "Plan for about 1 pound of total food per person including all dishes." },
    { q: "How many dishes should a potluck have?", a: "Plan for 1 dish per 5 to 6 guests for good variety." },
    { q: "How do you coordinate potluck food?", a: "Assign categories like main dish, side, salad, and dessert to guests." }
  ],
  "TotalMeat = Guests * MeatLbs; ServingsPerDish = (Guests * SidesPerPerson) / Dishes",
  ["vacation-bible-school-calculator", "conference-room-calculator", "church-budget-calculator"]
);

add(
  "conference-room-calculator",
  "Conference Room Calculator",
  "Determine meeting room capacity based on layout and size.",
  "Everyday",
  "everyday",
  "~",
  ["conference", "meeting room", "capacity", "office"],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 8, max: 100, defaultValue: 20 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 8, max: 80, defaultValue: 15 }',
    '{ name: "layout", label: "Seating Layout", type: "select", options: [{ value: "25", label: "Theater (25 sqft/person)" }, { value: "30", label: "Classroom (30 sqft/person)" }, { value: "40", label: "Boardroom (40 sqft/person)" }, { value: "15", label: "Standing (15 sqft/person)" }] }',
  ],
  `(inputs) => {
    const roomLength = inputs.roomLength as number;
    const roomWidth = inputs.roomWidth as number;
    const layout = inputs.layout as number;
    const totalSqft = roomLength * roomWidth;
    const usableSqft = totalSqft * 0.85;
    const capacity = Math.floor(usableSqft / layout);
    const tablesNeeded = Math.ceil(capacity / 6);
    return { primary: { label: "Room Capacity", value: formatNumber(capacity) + " people" }, details: [{ label: "Total Area", value: formatNumber(totalSqft) + " sq ft" }, { label: "Usable Area", value: formatNumber(usableSqft) + " sq ft" }, { label: "Sq Ft Per Person", value: formatNumber(layout) + " sq ft" }, { label: "Tables Needed (6-person)", value: formatNumber(tablesNeeded) }] };
  }`,
  [
    { q: "How much space per person in a conference room?", a: "Boardroom style needs 40 sq ft; theater style needs about 25 sq ft." },
    { q: "What is the best layout for a meeting room?", a: "Boardroom for discussions, theater for presentations, classroom for training." },
    { q: "What size room do I need for 20 people?", a: "About 500 sq ft for theater or 800 sq ft for boardroom style seating." }
  ],
  "Capacity = (Length * Width * 0.85) / SqftPerPerson",
  ["office-space-per-employee-calculator", "cubicle-layout-calculator", "church-seating-capacity-calculator"]
);

add(
  "cubicle-layout-calculator",
  "Cubicle Layout Calculator",
  "Calculate the number of cubicles that fit in an office space.",
  "Everyday",
  "everyday",
  "~",
  ["cubicle", "layout", "office", "workspace"],
  [
    '{ name: "floorLength", label: "Floor Length (ft)", type: "number", min: 20, max: 500, defaultValue: 60 }',
    '{ name: "floorWidth", label: "Floor Width (ft)", type: "number", min: 20, max: 300, defaultValue: 40 }',
    '{ name: "cubicleSize", label: "Cubicle Size", type: "select", options: [{ value: "36", label: "6x6 Small (36 sqft)" }, { value: "48", label: "6x8 Medium (48 sqft)" }, { value: "64", label: "8x8 Standard (64 sqft)" }] }',
    '{ name: "aisleWidth", label: "Aisle Width (ft)", type: "number", min: 3, max: 8, defaultValue: 4 }',
  ],
  `(inputs) => {
    const floorLength = inputs.floorLength as number;
    const floorWidth = inputs.floorWidth as number;
    const cubicleSize = inputs.cubicleSize as number;
    const aisleWidth = inputs.aisleWidth as number;
    const totalSqft = floorLength * floorWidth;
    const usablePct = 0.70;
    const usableSqft = totalSqft * usablePct;
    const totalCubicles = Math.floor(usableSqft / cubicleSize);
    const cubicleWidth = Math.sqrt(cubicleSize);
    const rows = Math.floor(floorLength / (cubicleWidth + aisleWidth));
    const perRow = Math.floor(floorWidth / cubicleWidth);
    return { primary: { label: "Total Cubicles", value: formatNumber(totalCubicles) }, details: [{ label: "Total Floor Area", value: formatNumber(totalSqft) + " sq ft" }, { label: "Usable Area (70%)", value: formatNumber(usableSqft) + " sq ft" }, { label: "Estimated Rows", value: formatNumber(rows) }, { label: "Cubicles Per Row", value: formatNumber(perRow) }] };
  }`,
  [
    { q: "What is the standard cubicle size?", a: "The most common sizes are 6x8 feet and 8x8 feet per workstation." },
    { q: "How much aisle space is needed between cubicles?", a: "Main aisles should be 4 to 5 feet; secondary paths at least 3 feet." },
    { q: "What percentage of office space is usable for cubicles?", a: "About 65% to 75% after accounting for aisles, exits, and common areas." }
  ],
  "Cubicles = (FloorArea * 0.70) / CubicleSize",
  ["office-space-per-employee-calculator", "conference-room-calculator", "standing-desk-height-calculator"]
);

add(
  "standing-desk-height-calculator",
  "Standing Desk Height Calculator",
  "Determine the ergonomic desk height based on your stature.",
  "Health",
  "health",
  "H",
  ["standing desk", "ergonomic", "height", "workspace"],
  [
    '{ name: "heightInches", label: "Your Height (inches)", type: "number", min: 54, max: 84, defaultValue: 68 }',
    '{ name: "shoeHeight", label: "Shoe Height (inches)", type: "number", min: 0, max: 4, defaultValue: 1 }',
    '{ name: "monitorSize", label: "Monitor Size (inches)", type: "number", min: 13, max: 42, defaultValue: 24 }',
  ],
  `(inputs) => {
    const heightInches = inputs.heightInches as number;
    const shoeHeight = inputs.shoeHeight as number;
    const monitorSize = inputs.monitorSize as number;
    const totalHeight = heightInches + shoeHeight;
    const elbowHeight = totalHeight * 0.63;
    const deskHeight = Math.round(elbowHeight);
    const monitorTop = totalHeight * 0.85;
    const monitorCenter = monitorTop - (monitorSize * 0.5);
    const keyboardHeight = deskHeight - 1;
    return { primary: { label: "Recommended Desk Height", value: formatNumber(deskHeight) + " inches" }, details: [{ label: "Elbow Height", value: formatNumber(elbowHeight) + " inches" }, { label: "Keyboard Tray Height", value: formatNumber(keyboardHeight) + " inches" }, { label: "Monitor Center Height", value: formatNumber(monitorCenter) + " inches" }, { label: "Total Standing Height", value: formatNumber(totalHeight) + " inches" }] };
  }`,
  [
    { q: "What is the correct standing desk height?", a: "Your desk should be at elbow height, roughly 63% of your total height." },
    { q: "How high should my monitor be?", a: "The top of the screen should be at or slightly below eye level." },
    { q: "Should I stand all day at a standing desk?", a: "No, alternate between sitting and standing every 30 to 60 minutes." }
  ],
  "DeskHeight = (HeightInches + ShoeHeight) * 0.63; Rounded to nearest inch",
  ["cubicle-layout-calculator", "office-space-per-employee-calculator", "conference-room-calculator"]
);
add(
  "dental-crown-cost-calculator",
  "Dental Crown Cost Calculator",
  "Estimate dental crown cost based on material type and location factors.",
  "Finance",
  "finance",
  "$",
  ["dental crown cost", "crown material price", "dental restoration cost"],
  [
    '{ name: "material", label: "Crown Material", type: "select", options: [{ value: "1", label: "Porcelain" }, { value: "2", label: "Ceramic" }, { value: "3", label: "Gold" }, { value: "4", label: "Porcelain-Fused-Metal" }] }',
    '{ name: "crowns", label: "Number of Crowns", type: "number", min: 1, max: 20, defaultValue: 1 }',
    '{ name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 50 }'
  ],
  `(inputs) => {
    const material = inputs.material as string;
    const crowns = inputs.crowns as number;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 1200, "2": 1400, "3": 1800, "4": 1000 };
    const names: Record<string, string> = { "1": "Porcelain", "2": "Ceramic", "3": "Gold", "4": "Porcelain-Fused-Metal" };
    const unitCost = prices[material] || 1200;
    const totalBefore = unitCost * crowns;
    const covered = totalBefore * (insurance / 100);
    const outOfPocket = totalBefore - covered;
    return {
      primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(outOfPocket) },
      details: [
        { label: "Material", value: names[material] || "Porcelain" },
        { label: "Cost per Crown", value: "$" + formatNumber(unitCost) },
        { label: "Total Before Insurance", value: "$" + formatNumber(totalBefore) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  }`,
  [
    { q: "How much does a dental crown cost without insurance?", a: "A dental crown typically costs $800 to $1800 depending on the material chosen." },
    { q: "Which crown material lasts the longest?", a: "Gold crowns tend to last the longest, often 20 years or more with proper care." },
    { q: "Does insurance cover dental crowns?", a: "Most dental plans cover 50% of crown costs after the deductible is met." }
  ],
  "Out-of-Pocket = (Cost per Crown x Number of Crowns) x (1 - Insurance% / 100)",
  ["dental-bridge-cost-calculator", "dental-veneer-cost-calculator", "root-canal-cost-calculator"]
);

add(
  "dental-bridge-cost-calculator",
  "Dental Bridge Cost Calculator",
  "Calculate dental bridge cost based on the number of units and material.",
  "Finance",
  "finance",
  "$",
  ["dental bridge cost", "bridge units price", "tooth replacement cost"],
  [
    '{ name: "units", label: "Number of Bridge Units", type: "number", min: 3, max: 14, defaultValue: 3 }',
    '{ name: "material", label: "Material Type", type: "select", options: [{ value: "1", label: "Porcelain" }, { value: "2", label: "Zirconia" }, { value: "3", label: "Metal" }] }',
    '{ name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 50 }'
  ],
  `(inputs) => {
    const units = inputs.units as number;
    const material = inputs.material as string;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 900, "2": 1100, "3": 700 };
    const names: Record<string, string> = { "1": "Porcelain", "2": "Zirconia", "3": "Metal" };
    const perUnit = prices[material] || 900;
    const total = perUnit * units;
    const covered = total * (insurance / 100);
    const oop = total - covered;
    return {
      primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Material", value: names[material] || "Porcelain" },
        { label: "Cost per Unit", value: "$" + formatNumber(perUnit) },
        { label: "Total Cost", value: "$" + formatNumber(total) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  }`,
  [
    { q: "How many units are in a typical dental bridge?", a: "A standard bridge has 3 units: two crowns on anchor teeth and one pontic." },
    { q: "How long does a dental bridge last?", a: "Dental bridges typically last 5 to 15 years with good oral hygiene." },
    { q: "Is a bridge cheaper than an implant?", a: "Bridges generally cost less upfront, but implants may be more cost-effective long term." }
  ],
  "Out-of-Pocket = (Cost per Unit x Units) x (1 - Insurance% / 100)",
  ["dental-crown-cost-calculator", "dental-veneer-cost-calculator", "root-canal-cost-calculator"]
);

add(
  "dental-veneer-cost-calculator",
  "Dental Veneer Cost Calculator",
  "Estimate the cost of dental veneers per tooth by material type.",
  "Finance",
  "finance",
  "$",
  ["dental veneer cost", "porcelain veneer price", "cosmetic dentistry cost"],
  [
    '{ name: "teeth", label: "Number of Teeth", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "veneerType", label: "Veneer Type", type: "select", options: [{ value: "1", label: "Porcelain" }, { value: "2", label: "Composite" }, { value: "3", label: "Lumineers" }] }',
    '{ name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 0 }'
  ],
  `(inputs) => {
    const teeth = inputs.teeth as number;
    const veneerType = inputs.veneerType as string;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 1500, "2": 600, "3": 1200 };
    const names: Record<string, string> = { "1": "Porcelain", "2": "Composite", "3": "Lumineers" };
    const perTooth = prices[veneerType] || 1500;
    const total = perTooth * teeth;
    const covered = total * (insurance / 100);
    const oop = total - covered;
    return {
      primary: { label: "Total Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Veneer Type", value: names[veneerType] || "Porcelain" },
        { label: "Cost per Tooth", value: "$" + formatNumber(perTooth) },
        { label: "Subtotal", value: "$" + formatNumber(total) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  }`,
  [
    { q: "Are dental veneers covered by insurance?", a: "Veneers are usually considered cosmetic and not covered by dental insurance." },
    { q: "How long do porcelain veneers last?", a: "Porcelain veneers typically last 10 to 15 years with proper care." },
    { q: "What is the difference between veneers and lumineers?", a: "Lumineers are thinner and require less tooth preparation than traditional veneers." }
  ],
  "Total Cost = (Cost per Tooth x Number of Teeth) x (1 - Insurance% / 100)",
  ["dental-crown-cost-calculator", "dental-bridge-cost-calculator", "teeth-whitening-cost-calculator"]
);

add(
  "orthodontic-payment-calculator",
  "Orthodontic Payment Calculator",
  "Calculate monthly payment plans for braces or clear aligners.",
  "Finance",
  "finance",
  "$",
  ["braces monthly payment", "orthodontic cost plan", "aligner payment calculator"],
  [
    '{ name: "totalCost", label: "Total Treatment Cost ($)", type: "number", min: 1000, max: 15000, defaultValue: 5000 }',
    '{ name: "downPayment", label: "Down Payment ($)", type: "number", min: 0, max: 10000, defaultValue: 500 }',
    '{ name: "months", label: "Payment Months", type: "number", min: 6, max: 60, defaultValue: 24 }',
    '{ name: "insurance", label: "Insurance Benefit ($)", type: "number", min: 0, max: 5000, defaultValue: 1500 }'
  ],
  `(inputs) => {
    const totalCost = inputs.totalCost as number;
    const downPayment = inputs.downPayment as number;
    const months = inputs.months as number;
    const insurance = inputs.insurance as number;
    const remaining = totalCost - downPayment - insurance;
    const monthlyPayment = remaining > 0 ? remaining / months : 0;
    return {
      primary: { label: "Monthly Payment", value: "$" + formatNumber(monthlyPayment) },
      details: [
        { label: "Total Treatment Cost", value: "$" + formatNumber(totalCost) },
        { label: "Down Payment", value: "$" + formatNumber(downPayment) },
        { label: "Insurance Benefit", value: "$" + formatNumber(insurance) },
        { label: "Remaining Balance", value: "$" + formatNumber(remaining > 0 ? remaining : 0) },
        { label: "Payment Duration", value: months + " months" }
      ]
    };
  }`,
  [
    { q: "How much do braces cost on average?", a: "Traditional metal braces cost between $3000 and $7000 depending on complexity." },
    { q: "Do orthodontists offer payment plans?", a: "Most orthodontists offer in-house payment plans with little or no interest." },
    { q: "Does insurance cover braces?", a: "Many dental plans cover $1000 to $2000 for orthodontic treatment, especially for minors." }
  ],
  "Monthly Payment = (Total Cost - Down Payment - Insurance) / Months",
  ["dental-crown-cost-calculator", "dental-bridge-cost-calculator", "dental-veneer-cost-calculator"]
);

add(
  "dental-cleaning-frequency-calculator",
  "Dental Cleaning Frequency Calculator",
  "Determine the recommended dental cleaning interval based on risk factors.",
  "Health",
  "health",
  "H",
  ["dental cleaning schedule", "teeth cleaning frequency", "dental hygiene interval"],
  [
    '{ name: "gumDisease", label: "History of Gum Disease", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }',
    '{ name: "smoker", label: "Tobacco Use", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }',
    '{ name: "diabetes", label: "Diabetes", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }',
    '{ name: "brushFreq", label: "Daily Brushing Frequency", type: "number", min: 0, max: 5, defaultValue: 2 }'
  ],
  `(inputs) => {
    const gumDisease = inputs.gumDisease as string;
    const smoker = inputs.smoker as string;
    const diabetes = inputs.diabetes as string;
    const brushFreq = inputs.brushFreq as number;
    let riskScore = 0;
    if (gumDisease === "1") riskScore += 3;
    if (smoker === "1") riskScore += 2;
    if (diabetes === "1") riskScore += 2;
    if (brushFreq < 2) riskScore += 1;
    let intervalMonths = 6;
    let riskLevel = "Low";
    if (riskScore >= 5) { intervalMonths = 3; riskLevel = "High"; }
    else if (riskScore >= 3) { intervalMonths = 4; riskLevel = "Moderate"; }
    const visitsPerYear = Math.round(12 / intervalMonths);
    return {
      primary: { label: "Recommended Interval", value: intervalMonths + " months" },
      details: [
        { label: "Risk Level", value: riskLevel },
        { label: "Visits per Year", value: formatNumber(visitsPerYear) },
        { label: "Risk Score", value: formatNumber(riskScore) + " / 8" }
      ]
    };
  }`,
  [
    { q: "How often should I get my teeth cleaned?", a: "Most adults should get a dental cleaning every 6 months, or more often with risk factors." },
    { q: "Does smoking affect dental cleaning frequency?", a: "Yes, smokers are at higher risk for gum disease and may need cleanings every 3 to 4 months." },
    { q: "Why do diabetics need more frequent cleanings?", a: "Diabetes increases the risk of gum infections, making more frequent cleanings important." }
  ],
  "Interval = Base 6 months, adjusted down for gum disease, smoking, diabetes, and low brushing",
  ["dental-crown-cost-calculator", "teeth-whitening-cost-calculator", "root-canal-cost-calculator"]
);

add(
  "root-canal-cost-calculator",
  "Root Canal Cost Calculator",
  "Estimate root canal treatment cost by tooth type and insurance coverage.",
  "Finance",
  "finance",
  "$",
  ["root canal cost", "endodontic treatment price", "root canal insurance"],
  [
    '{ name: "toothType", label: "Tooth Type", type: "select", options: [{ value: "1", label: "Front Tooth" }, { value: "2", label: "Premolar" }, { value: "3", label: "Molar" }] }',
    '{ name: "crownNeeded", label: "Crown Needed After", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }',
    '{ name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 50 }'
  ],
  `(inputs) => {
    const toothType = inputs.toothType as string;
    const crownNeeded = inputs.crownNeeded as string;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 700, "2": 900, "3": 1200 };
    const names: Record<string, string> = { "1": "Front Tooth", "2": "Premolar", "3": "Molar" };
    const rcCost = prices[toothType] || 700;
    const crownCost = crownNeeded === "1" ? 1200 : 0;
    const total = rcCost + crownCost;
    const covered = total * (insurance / 100);
    const oop = total - covered;
    return {
      primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Tooth Type", value: names[toothType] || "Front Tooth" },
        { label: "Root Canal Cost", value: "$" + formatNumber(rcCost) },
        { label: "Crown Cost", value: "$" + formatNumber(crownCost) },
        { label: "Total Before Insurance", value: "$" + formatNumber(total) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  }`,
  [
    { q: "How much does a root canal cost on a molar?", a: "A molar root canal typically costs $1000 to $1500 before insurance." },
    { q: "Do you always need a crown after a root canal?", a: "Molars and premolars usually need crowns, but front teeth may not require one." },
    { q: "Does insurance cover root canals?", a: "Most dental plans cover 50% to 80% of root canal costs after the deductible." }
  ],
  "Out-of-Pocket = (Root Canal Cost + Crown Cost) x (1 - Insurance% / 100)",
  ["dental-crown-cost-calculator", "dental-bridge-cost-calculator", "dental-cleaning-frequency-calculator"]
);

add(
  "teeth-whitening-cost-calculator",
  "Teeth Whitening Cost Calculator",
  "Compare teeth whitening costs across different methods.",
  "Finance",
  "finance",
  "$",
  ["teeth whitening cost", "dental whitening price", "bleaching treatment cost"],
  [
    '{ name: "method", label: "Whitening Method", type: "select", options: [{ value: "1", label: "In-Office Professional" }, { value: "2", label: "Take-Home Trays" }, { value: "3", label: "Over-the-Counter Strips" }, { value: "4", label: "Whitening Toothpaste" }] }',
    '{ name: "sessions", label: "Number of Sessions or Boxes", type: "number", min: 1, max: 12, defaultValue: 1 }'
  ],
  `(inputs) => {
    const method = inputs.method as string;
    const sessions = inputs.sessions as number;
    const prices: Record<string, number> = { "1": 650, "2": 300, "3": 45, "4": 8 };
    const names: Record<string, string> = { "1": "In-Office Professional", "2": "Take-Home Trays", "3": "OTC Strips", "4": "Whitening Toothpaste" };
    const perSession = prices[method] || 650;
    const total = perSession * sessions;
    return {
      primary: { label: "Total Cost", value: "$" + formatNumber(total) },
      details: [
        { label: "Method", value: names[method] || "In-Office" },
        { label: "Cost per Session/Box", value: "$" + formatNumber(perSession) },
        { label: "Quantity", value: formatNumber(sessions) }
      ]
    };
  }`,
  [
    { q: "How much does professional teeth whitening cost?", a: "In-office professional whitening typically costs $500 to $1000 per session." },
    { q: "Is teeth whitening covered by insurance?", a: "Teeth whitening is cosmetic and not covered by dental insurance plans." },
    { q: "How long do whitening results last?", a: "Professional whitening results can last 6 months to 2 years depending on habits." }
  ],
  "Total Cost = Cost per Session x Number of Sessions",
  ["dental-veneer-cost-calculator", "dental-cleaning-frequency-calculator", "dental-crown-cost-calculator"]
);

add(
  "vet-visit-cost-calculator",
  "Vet Visit Cost Calculator",
  "Estimate veterinary visit costs based on visit type and pet size.",
  "Finance",
  "finance",
  "$",
  ["vet visit cost", "veterinary exam price", "animal clinic cost"],
  [
    '{ name: "visitType", label: "Visit Type", type: "select", options: [{ value: "1", label: "Routine Checkup" }, { value: "2", label: "Sick Visit" }, { value: "3", label: "Emergency" }] }',
    '{ name: "petSize", label: "Pet Size", type: "select", options: [{ value: "1", label: "Small (under 20 lbs)" }, { value: "2", label: "Medium (20-50 lbs)" }, { value: "3", label: "Large (over 50 lbs)" }] }',
    '{ name: "labWork", label: "Lab Work Needed", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }'
  ],
  `(inputs) => {
    const visitType = inputs.visitType as string;
    const petSize = inputs.petSize as string;
    const labWork = inputs.labWork as string;
    const visitCosts: Record<string, number> = { "1": 55, "2": 100, "3": 250 };
    const sizeMultiplier: Record<string, number> = { "1": 1.0, "2": 1.15, "3": 1.3 };
    const visitNames: Record<string, string> = { "1": "Routine Checkup", "2": "Sick Visit", "3": "Emergency" };
    const baseCost = visitCosts[visitType] || 55;
    const multiplier = sizeMultiplier[petSize] || 1.0;
    const examCost = Math.round(baseCost * multiplier);
    const labCost = labWork === "1" ? 150 : 0;
    const total = examCost + labCost;
    return {
      primary: { label: "Estimated Total", value: "$" + formatNumber(total) },
      details: [
        { label: "Visit Type", value: visitNames[visitType] || "Routine" },
        { label: "Exam Fee", value: "$" + formatNumber(examCost) },
        { label: "Lab Work", value: "$" + formatNumber(labCost) }
      ]
    };
  }`,
  [
    { q: "How much does a routine vet visit cost?", a: "A routine vet checkup typically costs $50 to $100 without additional tests." },
    { q: "Why do emergency vet visits cost more?", a: "Emergency visits include after-hours staffing and urgent diagnostic equipment use." },
    { q: "Does pet size affect vet costs?", a: "Larger pets may cost more for medications, anesthesia, and some procedures." }
  ],
  "Total = (Base Visit Cost x Size Multiplier) + Lab Work Cost",
  ["pet-vaccination-schedule-calculator", "pet-dental-cost-calculator", "pet-spay-neuter-cost-calculator"]
);

add(
  "pet-vaccination-schedule-calculator",
  "Pet Vaccination Schedule Calculator",
  "Determine the next vaccination due date and cost for your pet.",
  "Health",
  "health",
  "H",
  ["pet vaccination schedule", "dog vaccine timing", "cat vaccine due date"],
  [
    '{ name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] }',
    '{ name: "ageMonths", label: "Pet Age (months)", type: "number", min: 1, max: 240, defaultValue: 12 }',
    '{ name: "lastVaccine", label: "Months Since Last Vaccine", type: "number", min: 0, max: 36, defaultValue: 6 }'
  ],
  `(inputs) => {
    const petType = inputs.petType as string;
    const ageMonths = inputs.ageMonths as number;
    const lastVaccine = inputs.lastVaccine as number;
    let intervalMonths = 12;
    if (ageMonths < 4) intervalMonths = 1;
    else if (ageMonths < 16) intervalMonths = 3;
    const monthsUntilDue = Math.max(0, intervalMonths - lastVaccine);
    const costPerVisit = petType === "1" ? 85 : 70;
    const status = monthsUntilDue === 0 ? "Overdue or Due Now" : "Due in " + monthsUntilDue + " months";
    const petName = petType === "1" ? "Dog" : "Cat";
    return {
      primary: { label: "Vaccination Status", value: status },
      details: [
        { label: "Pet Type", value: petName },
        { label: "Vaccine Interval", value: intervalMonths + " months" },
        { label: "Estimated Cost per Visit", value: "$" + formatNumber(costPerVisit) },
        { label: "Pet Age", value: ageMonths + " months" }
      ]
    };
  }`,
  [
    { q: "How often do dogs need vaccinations?", a: "Puppies need vaccines every 3 to 4 weeks until 16 weeks, then annually." },
    { q: "What are core vaccines for cats?", a: "Core cat vaccines include FVRCP and rabies, required for all cats." },
    { q: "How much do pet vaccinations cost?", a: "Pet vaccinations typically cost $50 to $100 per visit depending on the vaccines." }
  ],
  "Months Until Due = Vaccine Interval - Months Since Last Vaccine",
  ["vet-visit-cost-calculator", "pet-weight-calculator", "pet-dental-cost-calculator"]
);

add(
  "pet-spay-neuter-cost-calculator",
  "Pet Spay Neuter Cost Calculator",
  "Estimate spay or neuter surgery cost based on pet type and weight.",
  "Finance",
  "finance",
  "$",
  ["spay neuter cost", "pet sterilization price", "dog neuter cost"],
  [
    '{ name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] }',
    '{ name: "gender", label: "Gender", type: "select", options: [{ value: "1", label: "Female (Spay)" }, { value: "2", label: "Male (Neuter)" }] }',
    '{ name: "weight", label: "Pet Weight (lbs)", type: "number", min: 2, max: 200, defaultValue: 30 }'
  ],
  `(inputs) => {
    const petType = inputs.petType as string;
    const gender = inputs.gender as string;
    const weight = inputs.weight as number;
    let baseCost = 200;
    if (petType === "2") baseCost = 150;
    if (gender === "1") baseCost += 100;
    let weightSurcharge = 0;
    if (weight > 50) weightSurcharge = 50;
    if (weight > 100) weightSurcharge = 100;
    const total = baseCost + weightSurcharge;
    const procedure = gender === "1" ? "Spay" : "Neuter";
    const petName = petType === "1" ? "Dog" : "Cat";
    return {
      primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
      details: [
        { label: "Pet Type", value: petName },
        { label: "Procedure", value: procedure },
        { label: "Base Cost", value: "$" + formatNumber(baseCost) },
        { label: "Weight Surcharge", value: "$" + formatNumber(weightSurcharge) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to spay a dog?", a: "Spaying a dog typically costs $200 to $500 depending on size and location." },
    { q: "Is neutering cheaper than spaying?", a: "Yes, neutering is generally less expensive because it is a simpler procedure." },
    { q: "Are there low-cost spay neuter programs?", a: "Many communities offer low-cost clinics that can reduce the cost to $50 to $150." }
  ],
  "Total = Base Cost (by pet type and gender) + Weight Surcharge",
  ["vet-visit-cost-calculator", "pet-dental-cost-calculator", "pet-weight-calculator"]
);

add(
  "pet-dental-cost-calculator",
  "Pet Dental Cost Calculator",
  "Estimate pet dental cleaning and extraction costs.",
  "Finance",
  "finance",
  "$",
  ["pet dental cleaning cost", "dog teeth cleaning price", "cat dental cost"],
  [
    '{ name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] }',
    '{ name: "extractions", label: "Teeth Extractions Needed", type: "number", min: 0, max: 20, defaultValue: 0 }',
    '{ name: "xrays", label: "Dental X-Rays Needed", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }'
  ],
  `(inputs) => {
    const petType = inputs.petType as string;
    const extractions = inputs.extractions as number;
    const xrays = inputs.xrays as string;
    const cleaningCost = petType === "1" ? 300 : 250;
    const extractionCost = extractions * 75;
    const xrayCost = xrays === "1" ? 150 : 0;
    const anesthesiaCost = 200;
    const total = cleaningCost + extractionCost + xrayCost + anesthesiaCost;
    const petName = petType === "1" ? "Dog" : "Cat";
    return {
      primary: { label: "Estimated Total", value: "$" + formatNumber(total) },
      details: [
        { label: "Pet Type", value: petName },
        { label: "Cleaning", value: "$" + formatNumber(cleaningCost) },
        { label: "Extractions (" + extractions + ")", value: "$" + formatNumber(extractionCost) },
        { label: "X-Rays", value: "$" + formatNumber(xrayCost) },
        { label: "Anesthesia", value: "$" + formatNumber(anesthesiaCost) }
      ]
    };
  }`,
  [
    { q: "How much does a dog dental cleaning cost?", a: "Dog dental cleanings typically cost $300 to $700 including anesthesia." },
    { q: "Do pets need anesthesia for dental cleaning?", a: "Yes, pets require general anesthesia for a thorough and safe dental cleaning." },
    { q: "How often should pets get dental cleanings?", a: "Most veterinarians recommend annual dental cleanings for dogs and cats." }
  ],
  "Total = Cleaning + (Extractions x $75) + X-Rays + Anesthesia",
  ["vet-visit-cost-calculator", "pet-vaccination-schedule-calculator", "pet-spay-neuter-cost-calculator"]
);

add(
  "pet-weight-calculator",
  "Pet Weight Calculator",
  "Estimate ideal pet weight based on breed size category and age.",
  "Health",
  "health",
  "H",
  ["ideal pet weight", "dog weight chart", "cat weight range"],
  [
    '{ name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] }',
    '{ name: "breedSize", label: "Breed Size", type: "select", options: [{ value: "1", label: "Small" }, { value: "2", label: "Medium" }, { value: "3", label: "Large" }, { value: "4", label: "Giant" }] }',
    '{ name: "currentWeight", label: "Current Weight (lbs)", type: "number", min: 1, max: 250, defaultValue: 30 }'
  ],
  `(inputs) => {
    const petType = inputs.petType as string;
    const breedSize = inputs.breedSize as string;
    const currentWeight = inputs.currentWeight as number;
    let idealMin = 8;
    let idealMax = 15;
    if (petType === "1") {
      const ranges: Record<string, number[]> = { "1": [5, 20], "2": [20, 50], "3": [50, 90], "4": [90, 150] };
      const range = ranges[breedSize] || [20, 50];
      idealMin = range[0];
      idealMax = range[1];
    } else {
      idealMin = 7;
      idealMax = 12;
    }
    const idealMid = (idealMin + idealMax) / 2;
    const diff = currentWeight - idealMid;
    let status = "At Ideal Weight";
    if (currentWeight < idealMin) status = "Underweight";
    else if (currentWeight > idealMax) status = "Overweight";
    return {
      primary: { label: "Weight Status", value: status },
      details: [
        { label: "Ideal Range", value: idealMin + " - " + idealMax + " lbs" },
        { label: "Current Weight", value: currentWeight + " lbs" },
        { label: "Difference from Midpoint", value: (diff >= 0 ? "+" : "") + formatNumber(diff) + " lbs" }
      ]
    };
  }`,
  [
    { q: "How do I know if my dog is overweight?", a: "You should be able to feel ribs easily and see a waist when viewed from above." },
    { q: "What is the ideal weight for a cat?", a: "Most domestic cats should weigh between 7 and 12 pounds depending on breed." },
    { q: "How can I help my pet lose weight?", a: "Reduce portion sizes, increase exercise, and consult your vet for a safe plan." }
  ],
  "Status = Current Weight compared to Ideal Range (by pet type and breed size)",
  ["pet-vaccination-schedule-calculator", "vet-visit-cost-calculator", "horse-weight-calculator"]
);

add(
  "horse-feed-calculator",
  "Horse Feed Calculator",
  "Calculate daily horse feed amounts based on weight and activity level.",
  "Everyday",
  "everyday",
  "~",
  ["horse feed amount", "equine nutrition calculator", "horse hay requirement"],
  [
    '{ name: "horseWeight", label: "Horse Weight (lbs)", type: "number", min: 500, max: 2500, defaultValue: 1100 }',
    '{ name: "activity", label: "Activity Level", type: "select", options: [{ value: "1", label: "Light" }, { value: "2", label: "Moderate" }, { value: "3", label: "Heavy" }, { value: "4", label: "Very Heavy" }] }',
    '{ name: "hayQuality", label: "Hay Quality", type: "select", options: [{ value: "1", label: "Good" }, { value: "2", label: "Average" }, { value: "3", label: "Poor" }] }'
  ],
  `(inputs) => {
    const horseWeight = inputs.horseWeight as number;
    const activity = inputs.activity as string;
    const hayQuality = inputs.hayQuality as string;
    const hayPercent = 0.02;
    const dailyHay = horseWeight * hayPercent;
    const grainMultipliers: Record<string, number> = { "1": 0.005, "2": 0.0075, "3": 0.01, "4": 0.0125 };
    const qualityAdj: Record<string, number> = { "1": 1.0, "2": 1.1, "3": 1.2 };
    const grainMult = grainMultipliers[activity] || 0.005;
    const qualMult = qualityAdj[hayQuality] || 1.0;
    const dailyGrain = horseWeight * grainMult;
    const adjustedHay = dailyHay * qualMult;
    const totalFeed = adjustedHay + dailyGrain;
    return {
      primary: { label: "Total Daily Feed", value: formatNumber(totalFeed) + " lbs" },
      details: [
        { label: "Daily Hay", value: formatNumber(adjustedHay) + " lbs" },
        { label: "Daily Grain/Concentrate", value: formatNumber(dailyGrain) + " lbs" },
        { label: "Horse Weight", value: formatNumber(horseWeight) + " lbs" }
      ]
    };
  }`,
  [
    { q: "How much hay should a horse eat daily?", a: "A horse should eat about 1.5% to 2% of its body weight in hay per day." },
    { q: "Do active horses need more grain?", a: "Yes, horses in heavy work need more grain or concentrate for energy demands." },
    { q: "Can a horse eat too much hay?", a: "Overfeeding hay is rare, but poor-quality hay can cause digestive issues." }
  ],
  "Total Daily Feed = (Weight x 2% x Quality Adj) + (Weight x Activity Grain%)",
  ["horse-weight-calculator", "pet-weight-calculator", "pet-vaccination-schedule-calculator"]
);

add(
  "horse-weight-calculator",
  "Horse Weight Calculator",
  "Estimate horse weight using heart girth and body length measurements.",
  "Health",
  "health",
  "H",
  ["horse weight estimate", "equine weight tape", "horse body condition"],
  [
    '{ name: "heartGirth", label: "Heart Girth (inches)", type: "number", min: 40, max: 100, defaultValue: 72 }',
    '{ name: "bodyLength", label: "Body Length (inches)", type: "number", min: 40, max: 100, defaultValue: 65 }'
  ],
  `(inputs) => {
    const heartGirth = inputs.heartGirth as number;
    const bodyLength = inputs.bodyLength as number;
    const weight = (heartGirth * heartGirth * bodyLength) / 330;
    const weightKg = weight * 0.4536;
    return {
      primary: { label: "Estimated Weight", value: formatNumber(Math.round(weight)) + " lbs" },
      details: [
        { label: "Weight in Kg", value: formatNumber(Math.round(weightKg)) + " kg" },
        { label: "Heart Girth", value: heartGirth + " in" },
        { label: "Body Length", value: bodyLength + " in" }
      ]
    };
  }`,
  [
    { q: "How do you measure horse heart girth?", a: "Measure around the barrel just behind the elbow and over the withers." },
    { q: "How accurate is the weight tape method?", a: "The girth and length formula is typically accurate within 50 to 100 pounds." },
    { q: "Why is knowing a horse weight important?", a: "Accurate weight is essential for proper feeding, deworming, and medication dosing." }
  ],
  "Weight (lbs) = (Heart Girth^2 x Body Length) / 330",
  ["horse-feed-calculator", "pet-weight-calculator", "vet-visit-cost-calculator"]
);

add(
  "pill-dosage-calculator",
  "Pill Dosage Calculator",
  "Calculate pill dosage based on body weight and prescribed dose rate.",
  "Health",
  "health",
  "H",
  ["pill dosage by weight", "tablet dose calculator", "medication dosage weight"],
  [
    '{ name: "bodyWeight", label: "Body Weight (kg)", type: "number", min: 1, max: 300, defaultValue: 70 }',
    '{ name: "doseRate", label: "Dose Rate (mg/kg)", type: "number", min: 0.1, max: 100, defaultValue: 10 }',
    '{ name: "pillStrength", label: "Pill Strength (mg)", type: "number", min: 1, max: 1000, defaultValue: 500 }',
    '{ name: "frequency", label: "Doses per Day", type: "number", min: 1, max: 6, defaultValue: 2 }'
  ],
  `(inputs) => {
    const bodyWeight = inputs.bodyWeight as number;
    const doseRate = inputs.doseRate as number;
    const pillStrength = inputs.pillStrength as number;
    const frequency = inputs.frequency as number;
    const totalDailyDose = bodyWeight * doseRate * frequency;
    const singleDose = bodyWeight * doseRate;
    const pillsPerDose = singleDose / pillStrength;
    const pillsPerDay = pillsPerDose * frequency;
    return {
      primary: { label: "Pills per Dose", value: formatNumber(Math.ceil(pillsPerDose * 10) / 10) },
      details: [
        { label: "Single Dose", value: formatNumber(singleDose) + " mg" },
        { label: "Total Daily Dose", value: formatNumber(totalDailyDose) + " mg" },
        { label: "Pills per Day", value: formatNumber(Math.ceil(pillsPerDay * 10) / 10) },
        { label: "Doses per Day", value: formatNumber(frequency) }
      ]
    };
  }`,
  [
    { q: "How is pill dosage calculated by weight?", a: "Multiply the dose rate (mg/kg) by body weight (kg) to get the dose in mg." },
    { q: "Should I round pill dosages up or down?", a: "Always consult your prescriber before rounding doses, especially with potent drugs." },
    { q: "What if the calculated dose is between pill sizes?", a: "A pharmacist can advise whether to round up, round down, or split tablets." }
  ],
  "Pills per Dose = (Body Weight x Dose Rate) / Pill Strength",
  ["liquid-medication-calculator", "medication-half-life-calculator", "iv-drip-rate-calculator"]
);

add(
  "liquid-medication-calculator",
  "Liquid Medication Calculator",
  "Calculate liquid medication dose by body weight and concentration.",
  "Health",
  "health",
  "H",
  ["liquid medication dose", "suspension dosage calculator", "pediatric liquid dose"],
  [
    '{ name: "bodyWeight", label: "Body Weight (kg)", type: "number", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "doseRate", label: "Dose Rate (mg/kg)", type: "number", min: 0.1, max: 100, defaultValue: 15 }',
    '{ name: "concentration", label: "Concentration (mg/mL)", type: "number", min: 1, max: 500, defaultValue: 25 }',
    '{ name: "frequency", label: "Doses per Day", type: "number", min: 1, max: 6, defaultValue: 3 }'
  ],
  `(inputs) => {
    const bodyWeight = inputs.bodyWeight as number;
    const doseRate = inputs.doseRate as number;
    const concentration = inputs.concentration as number;
    const frequency = inputs.frequency as number;
    const singleDoseMg = bodyWeight * doseRate;
    const singleDoseMl = singleDoseMg / concentration;
    const dailyMl = singleDoseMl * frequency;
    const dailyMg = singleDoseMg * frequency;
    return {
      primary: { label: "Volume per Dose", value: formatNumber(Math.round(singleDoseMl * 10) / 10) + " mL" },
      details: [
        { label: "Dose per Administration", value: formatNumber(singleDoseMg) + " mg" },
        { label: "Total Daily Volume", value: formatNumber(Math.round(dailyMl * 10) / 10) + " mL" },
        { label: "Total Daily Dose", value: formatNumber(dailyMg) + " mg" },
        { label: "Frequency", value: frequency + " times per day" }
      ]
    };
  }`,
  [
    { q: "How do you calculate liquid medication dosage?", a: "Divide the required dose (mg) by the concentration (mg/mL) to get the volume." },
    { q: "Why are liquid medications used for children?", a: "Liquids allow precise dosing for smaller body weights and are easier to swallow." },
    { q: "How should liquid medications be measured?", a: "Use an oral syringe or dosing cup for accuracy instead of household spoons." }
  ],
  "Volume (mL) = (Body Weight x Dose Rate) / Concentration",
  ["pill-dosage-calculator", "iv-drip-rate-calculator", "medication-half-life-calculator"]
);

add(
  "iv-drip-rate-calculator",
  "IV Drip Rate Calculator",
  "Calculate intravenous drip rate in drops per minute.",
  "Health",
  "health",
  "H",
  ["iv drip rate", "drops per minute calculator", "intravenous flow rate"],
  [
    '{ name: "volume", label: "Total Volume (mL)", type: "number", min: 10, max: 5000, defaultValue: 1000 }',
    '{ name: "hours", label: "Infusion Time (hours)", type: "number", min: 0.5, max: 48, defaultValue: 8 }',
    '{ name: "dropFactor", label: "Drop Factor (gtt/mL)", type: "select", options: [{ value: "10", label: "10 gtt/mL (Macro)" }, { value: "15", label: "15 gtt/mL (Macro)" }, { value: "20", label: "20 gtt/mL (Macro)" }, { value: "60", label: "60 gtt/mL (Micro)" }] }'
  ],
  `(inputs) => {
    const volume = inputs.volume as number;
    const hours = inputs.hours as number;
    const dropFactor = parseInt(inputs.dropFactor as string);
    const totalMinutes = hours * 60;
    const mlPerHour = volume / hours;
    const dropsPerMin = (volume * dropFactor) / totalMinutes;
    return {
      primary: { label: "Drip Rate", value: formatNumber(Math.round(dropsPerMin)) + " gtt/min" },
      details: [
        { label: "Flow Rate", value: formatNumber(Math.round(mlPerHour * 10) / 10) + " mL/hr" },
        { label: "Total Volume", value: formatNumber(volume) + " mL" },
        { label: "Infusion Time", value: hours + " hours" },
        { label: "Drop Factor", value: dropFactor + " gtt/mL" }
      ]
    };
  }`,
  [
    { q: "How do you calculate IV drip rate?", a: "Drip rate equals volume times drop factor divided by time in minutes." },
    { q: "What is the difference between macro and micro drip?", a: "Macro drip sets deliver 10 to 20 gtt/mL while micro drip delivers 60 gtt/mL." },
    { q: "Why is accurate IV drip rate important?", a: "Incorrect rates can cause fluid overload or under-delivery of critical medications." }
  ],
  "Drip Rate (gtt/min) = (Volume x Drop Factor) / (Hours x 60)",
  ["liquid-medication-calculator", "pill-dosage-calculator", "medication-half-life-calculator"]
);

add(
  "medication-half-life-calculator",
  "Medication Half Life Calculator",
  "Estimate drug clearance time based on half-life and doses taken.",
  "Health",
  "health",
  "H",
  ["drug half life calculator", "medication clearance time", "drug elimination rate"],
  [
    '{ name: "halfLife", label: "Half-Life (hours)", type: "number", min: 0.5, max: 200, defaultValue: 6 }',
    '{ name: "dose", label: "Last Dose (mg)", type: "number", min: 1, max: 5000, defaultValue: 500 }',
    '{ name: "targetPercent", label: "Clearance Target (%)", type: "number", min: 90, max: 99, defaultValue: 97 }'
  ],
  `(inputs) => {
    const halfLife = inputs.halfLife as number;
    const dose = inputs.dose as number;
    const targetPercent = inputs.targetPercent as number;
    const targetFraction = 1 - (targetPercent / 100);
    const halfLives = Math.log(targetFraction) / Math.log(0.5);
    const totalHours = halfLives * halfLife;
    const totalDays = totalHours / 24;
    const remainingMg = dose * targetFraction;
    return {
      primary: { label: "Time to Clear", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Half-Lives Needed", value: formatNumber(Math.round(halfLives * 10) / 10) },
        { label: "Clearance Time in Days", value: formatNumber(Math.round(totalDays * 10) / 10) + " days" },
        { label: "Remaining in Body", value: formatNumber(Math.round(remainingMg * 100) / 100) + " mg" },
        { label: "Target Clearance", value: targetPercent + "%" }
      ]
    };
  }`,
  [
    { q: "How many half-lives does it take to clear a drug?", a: "It takes about 5 half-lives to clear approximately 97% of a drug from the body." },
    { q: "What affects drug half-life?", a: "Liver function, kidney function, age, and body composition all affect half-life." },
    { q: "Does half-life determine dosing frequency?", a: "Yes, drugs with shorter half-lives generally need to be taken more frequently." }
  ],
  "Hours = (ln(1 - Target%/100) / ln(0.5)) x Half-Life",
  ["pill-dosage-calculator", "liquid-medication-calculator", "iv-drip-rate-calculator"]
);

add(
  "prescription-cost-calculator",
  "Prescription Cost Calculator",
  "Estimate out-of-pocket prescription cost with insurance and coupons.",
  "Finance",
  "finance",
  "$",
  ["prescription cost estimate", "rx cost with insurance", "medication price calculator"],
  [
    '{ name: "retailPrice", label: "Retail Price ($)", type: "number", min: 1, max: 10000, defaultValue: 200 }',
    '{ name: "insuranceType", label: "Insurance Tier", type: "select", options: [{ value: "1", label: "Tier 1 Generic" }, { value: "2", label: "Tier 2 Preferred Brand" }, { value: "3", label: "Tier 3 Non-Preferred" }, { value: "4", label: "No Insurance" }] }',
    '{ name: "coupon", label: "Coupon Discount ($)", type: "number", min: 0, max: 5000, defaultValue: 0 }',
    '{ name: "quantity", label: "Quantity (days supply)", type: "number", min: 7, max: 90, defaultValue: 30 }'
  ],
  `(inputs) => {
    const retailPrice = inputs.retailPrice as number;
    const insuranceType = inputs.insuranceType as string;
    const coupon = inputs.coupon as number;
    const quantity = inputs.quantity as number;
    const copays: Record<string, number> = { "1": 10, "2": 35, "3": 70, "4": 0 };
    const copay = copays[insuranceType] || 0;
    let cost = retailPrice;
    if (insuranceType !== "4") {
      cost = copay;
    }
    cost = Math.max(0, cost - coupon);
    const annualCost = cost * (365 / quantity);
    const tierName: Record<string, string> = { "1": "Tier 1 Generic", "2": "Tier 2 Preferred", "3": "Tier 3 Non-Preferred", "4": "No Insurance" };
    return {
      primary: { label: "Your Cost", value: "$" + formatNumber(cost) },
      details: [
        { label: "Insurance Tier", value: tierName[insuranceType] || "None" },
        { label: "Retail Price", value: "$" + formatNumber(retailPrice) },
        { label: "Copay", value: "$" + formatNumber(copay) },
        { label: "Coupon Savings", value: "$" + formatNumber(coupon) },
        { label: "Estimated Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) }
      ]
    };
  }`,
  [
    { q: "How can I reduce my prescription costs?", a: "Use generics, manufacturer coupons, or prescription discount cards to save money." },
    { q: "What are insurance drug tiers?", a: "Tiers rank drugs by cost: Tier 1 generics are cheapest, Tier 3 brands cost the most." },
    { q: "Is a 90-day supply cheaper than 30-day?", a: "Yes, 90-day supplies usually offer lower per-dose costs at mail-order pharmacies." }
  ],
  "Cost = Copay (by tier) or Retail Price (no insurance) - Coupon Discount",
  ["pill-dosage-calculator", "liquid-medication-calculator", "medication-half-life-calculator"]
);

add(
  "eyeglass-prescription-calculator",
  "Eyeglass Prescription Calculator",
  "Estimate lens thickness based on prescription strength and lens type.",
  "Health",
  "health",
  "H",
  ["eyeglass lens thickness", "prescription lens calculator", "lens index guide"],
  [
    '{ name: "sphere", label: "Sphere Power (diopters)", type: "number", min: -20, max: 20, defaultValue: -3 }',
    '{ name: "lensIndex", label: "Lens Index", type: "select", options: [{ value: "1", label: "1.50 Standard" }, { value: "2", label: "1.59 Polycarbonate" }, { value: "3", label: "1.67 High Index" }, { value: "4", label: "1.74 Ultra High Index" }] }',
    '{ name: "frameWidth", label: "Frame Lens Width (mm)", type: "number", min: 40, max: 70, defaultValue: 52 }'
  ],
  `(inputs) => {
    const sphere = inputs.sphere as number;
    const lensIndex = inputs.lensIndex as string;
    const frameWidth = inputs.frameWidth as number;
    const indexValues: Record<string, number> = { "1": 1.50, "2": 1.59, "3": 1.67, "4": 1.74 };
    const indexNames: Record<string, string> = { "1": "1.50 Standard", "2": "1.59 Polycarbonate", "3": "1.67 High Index", "4": "1.74 Ultra High Index" };
    const idx = indexValues[lensIndex] || 1.50;
    const absSphere = Math.abs(sphere);
    const radius = frameWidth / 2;
    const edgeThickness = sphere < 0 ? 1.5 + (absSphere * radius) / (2 * (idx - 1) * 10) : 1.5;
    const centerThickness = sphere > 0 ? 1.5 + (absSphere * radius) / (2 * (idx - 1) * 10) : 1.5;
    const maxThickness = Math.max(edgeThickness, centerThickness);
    return {
      primary: { label: "Max Lens Thickness", value: formatNumber(Math.round(maxThickness * 10) / 10) + " mm" },
      details: [
        { label: "Lens Index", value: indexNames[lensIndex] || "Standard" },
        { label: "Edge Thickness", value: formatNumber(Math.round(edgeThickness * 10) / 10) + " mm" },
        { label: "Center Thickness", value: formatNumber(Math.round(centerThickness * 10) / 10) + " mm" },
        { label: "Sphere Power", value: sphere + " D" }
      ]
    };
  }`,
  [
    { q: "What lens index should I choose?", a: "Prescriptions over -4 or +4 benefit from 1.67 or 1.74 high index lenses." },
    { q: "Are thinner lenses worth the extra cost?", a: "For strong prescriptions, high index lenses are lighter and more comfortable." },
    { q: "Does frame size affect lens thickness?", a: "Yes, larger frames require thicker lenses, especially for strong prescriptions." }
  ],
  "Thickness = Base + (|Sphere| x Radius) / (2 x (Index - 1) x 10)",
  ["contact-lens-cost-calculator", "pupillary-distance-calculator", "reading-glasses-strength-calculator"]
);

add(
  "contact-lens-cost-calculator",
  "Contact Lens Cost Calculator",
  "Calculate annual contact lens costs by type and replacement schedule.",
  "Finance",
  "finance",
  "$",
  ["contact lens cost", "annual contacts price", "daily vs monthly lens cost"],
  [
    '{ name: "lensType", label: "Lens Type", type: "select", options: [{ value: "1", label: "Daily Disposable" }, { value: "2", label: "Bi-Weekly" }, { value: "3", label: "Monthly" }] }',
    '{ name: "boxPrice", label: "Price per Box ($)", type: "number", min: 10, max: 200, defaultValue: 40 }',
    '{ name: "lensesPerBox", label: "Lenses per Box", type: "number", min: 3, max: 90, defaultValue: 30 }',
    '{ name: "solutionMonthly", label: "Solution Cost per Month ($)", type: "number", min: 0, max: 30, defaultValue: 8 }'
  ],
  `(inputs) => {
    const lensType = inputs.lensType as string;
    const boxPrice = inputs.boxPrice as number;
    const lensesPerBox = inputs.lensesPerBox as number;
    const solutionMonthly = inputs.solutionMonthly as number;
    const names: Record<string, string> = { "1": "Daily Disposable", "2": "Bi-Weekly", "3": "Monthly" };
    let lensesPerYear = 0;
    if (lensType === "1") lensesPerYear = 730;
    else if (lensType === "2") lensesPerYear = 52;
    else lensesPerYear = 24;
    const boxesNeeded = Math.ceil(lensesPerYear / lensesPerBox);
    const lensCost = boxesNeeded * boxPrice;
    const solutionCost = lensType === "1" ? 0 : solutionMonthly * 12;
    const totalAnnual = lensCost + solutionCost;
    return {
      primary: { label: "Annual Cost", value: "$" + formatNumber(totalAnnual) },
      details: [
        { label: "Lens Type", value: names[lensType] || "Monthly" },
        { label: "Boxes per Year", value: formatNumber(boxesNeeded) },
        { label: "Lens Cost", value: "$" + formatNumber(lensCost) },
        { label: "Solution Cost", value: "$" + formatNumber(solutionCost) }
      ]
    };
  }`,
  [
    { q: "Are daily contacts more expensive than monthlies?", a: "Daily contacts cost more per lens but eliminate solution costs and reduce infection risk." },
    { q: "How many boxes of contacts do I need per year?", a: "It depends on the type: daily users need about 24 boxes, monthly users need about 8." },
    { q: "Does insurance cover contact lenses?", a: "Vision insurance often provides an annual contact lens allowance of $100 to $200." }
  ],
  "Annual Cost = (Boxes Needed x Box Price) + (Solution Cost x 12)",
  ["eyeglass-prescription-calculator", "eye-exam-cost-calculator", "pupillary-distance-calculator"]
);

add(
  "pupillary-distance-calculator",
  "Pupillary Distance Calculator",
  "Estimate pupillary distance from frame measurements and fit.",
  "Health",
  "health",
  "H",
  ["pupillary distance measurement", "PD calculator glasses", "interpupillary distance"],
  [
    '{ name: "rightPD", label: "Right Eye PD (mm)", type: "number", min: 20, max: 45, defaultValue: 31 }',
    '{ name: "leftPD", label: "Left Eye PD (mm)", type: "number", min: 20, max: 45, defaultValue: 32 }',
    '{ name: "ageGroup", label: "Age Group", type: "select", options: [{ value: "1", label: "Child (4-12)" }, { value: "2", label: "Teen (13-17)" }, { value: "3", label: "Adult (18+)" }] }'
  ],
  `(inputs) => {
    const rightPD = inputs.rightPD as number;
    const leftPD = inputs.leftPD as number;
    const ageGroup = inputs.ageGroup as string;
    const totalPD = rightPD + leftPD;
    const ranges: Record<string, number[]> = { "1": [43, 54], "2": [54, 62], "3": [57, 72] };
    const range = ranges[ageGroup] || [57, 72];
    let status = "Within Normal Range";
    if (totalPD < range[0]) status = "Below Normal Range";
    else if (totalPD > range[1]) status = "Above Normal Range";
    const groupNames: Record<string, string> = { "1": "Child", "2": "Teen", "3": "Adult" };
    return {
      primary: { label: "Total PD", value: totalPD + " mm" },
      details: [
        { label: "Right Eye PD", value: rightPD + " mm" },
        { label: "Left Eye PD", value: leftPD + " mm" },
        { label: "Normal Range", value: range[0] + " - " + range[1] + " mm" },
        { label: "Status", value: status },
        { label: "Age Group", value: groupNames[ageGroup] || "Adult" }
      ]
    };
  }`,
  [
    { q: "What is pupillary distance used for?", a: "PD is used to align the optical center of lenses with your pupils for clear vision." },
    { q: "What is the average adult PD?", a: "The average adult PD ranges from 57 to 65 mm, with 63 mm being common." },
    { q: "Can I measure my own PD?", a: "Yes, you can use a ruler and mirror or a smartphone app to measure your PD at home." }
  ],
  "Total PD = Right Eye PD + Left Eye PD",
  ["eyeglass-prescription-calculator", "reading-glasses-strength-calculator", "contact-lens-cost-calculator"]
);

add(
  "reading-glasses-strength-calculator",
  "Reading Glasses Strength Calculator",
  "Estimate reading lens power based on age and reading distance.",
  "Health",
  "health",
  "H",
  ["reading glasses power", "magnification strength by age", "presbyopia lens calculator"],
  [
    '{ name: "age", label: "Age (years)", type: "number", min: 35, max: 80, defaultValue: 50 }',
    '{ name: "readingDistance", label: "Preferred Reading Distance (inches)", type: "number", min: 8, max: 24, defaultValue: 14 }',
    '{ name: "currentRx", label: "Current Distance Rx (diopters)", type: "number", min: -10, max: 10, defaultValue: 0 }'
  ],
  `(inputs) => {
    const age = inputs.age as number;
    const readingDistance = inputs.readingDistance as number;
    const currentRx = inputs.currentRx as number;
    let addPower = 0;
    if (age < 40) addPower = 0.75;
    else if (age < 45) addPower = 1.0;
    else if (age < 50) addPower = 1.5;
    else if (age < 55) addPower = 2.0;
    else if (age < 60) addPower = 2.25;
    else addPower = 2.5;
    const distanceMeters = readingDistance * 0.0254;
    const diopterForDistance = 1 / distanceMeters;
    const adjustedAdd = Math.round((addPower + (diopterForDistance - 2.5) * 0.25) * 4) / 4;
    const finalAdd = Math.max(0.75, Math.min(3.5, adjustedAdd));
    return {
      primary: { label: "Suggested Add Power", value: "+" + finalAdd.toFixed(2) + " D" },
      details: [
        { label: "Age-Based Power", value: "+" + addPower.toFixed(2) + " D" },
        { label: "Reading Distance", value: readingDistance + " inches" },
        { label: "Current Distance Rx", value: currentRx.toFixed(2) + " D" }
      ]
    };
  }`,
  [
    { q: "At what age do you need reading glasses?", a: "Most people begin needing reading glasses between ages 40 and 45 due to presbyopia." },
    { q: "How do I choose reading glasses strength?", a: "Start with lower power and increase until text is clear at your preferred distance." },
    { q: "Can reading glasses damage your eyes?", a: "No, wearing reading glasses does not damage your eyes or worsen your vision." }
  ],
  "Add Power = Age-based baseline adjusted for preferred reading distance",
  ["eyeglass-prescription-calculator", "pupillary-distance-calculator", "blue-light-exposure-calculator"]
);

add(
  "eye-exam-cost-calculator",
  "Eye Exam Cost Calculator",
  "Estimate eye exam costs based on exam type and insurance coverage.",
  "Finance",
  "finance",
  "$",
  ["eye exam cost", "vision exam price", "optometrist visit cost"],
  [
    '{ name: "examType", label: "Exam Type", type: "select", options: [{ value: "1", label: "Routine Vision" }, { value: "2", label: "Contact Lens Fitting" }, { value: "3", label: "Comprehensive Medical" }] }',
    '{ name: "insurance", label: "Vision Insurance", type: "select", options: [{ value: "0", label: "No Insurance" }, { value: "1", label: "Vision Plan" }, { value: "2", label: "Medical Insurance" }] }',
    '{ name: "additionalTests", label: "Additional Tests", type: "select", options: [{ value: "0", label: "None" }, { value: "1", label: "Retinal Imaging ($40)" }, { value: "2", label: "Visual Field Test ($50)" }, { value: "3", label: "Both ($90)" }] }'
  ],
  `(inputs) => {
    const examType = inputs.examType as string;
    const insurance = inputs.insurance as string;
    const additionalTests = inputs.additionalTests as string;
    const examPrices: Record<string, number> = { "1": 100, "2": 150, "3": 250 };
    const examNames: Record<string, string> = { "1": "Routine Vision", "2": "Contact Lens Fitting", "3": "Comprehensive Medical" };
    const testCosts: Record<string, number> = { "0": 0, "1": 40, "2": 50, "3": 90 };
    const baseCost = examPrices[examType] || 100;
    const testCost = testCosts[additionalTests] || 0;
    let copay = 0;
    let coverageDesc = "No Insurance";
    if (insurance === "1") { copay = baseCost - 15; coverageDesc = "Vision Plan"; }
    else if (insurance === "2") { copay = baseCost - 35; coverageDesc = "Medical Insurance"; }
    const oop = (baseCost - copay) + testCost;
    return {
      primary: { label: "Your Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Exam Type", value: examNames[examType] || "Routine" },
        { label: "Base Exam Price", value: "$" + formatNumber(baseCost) },
        { label: "Additional Tests", value: "$" + formatNumber(testCost) },
        { label: "Coverage", value: coverageDesc },
        { label: "Insurance Covers", value: "$" + formatNumber(copay) }
      ]
    };
  }`,
  [
    { q: "How much does an eye exam cost without insurance?", a: "A routine eye exam typically costs $75 to $200 without insurance coverage." },
    { q: "How often should I get an eye exam?", a: "Adults should get a comprehensive eye exam every 1 to 2 years." },
    { q: "Does vision insurance cover contact lens fittings?", a: "Many vision plans cover part of the contact lens fitting fee but may not cover it fully." }
  ],
  "Your Cost = (Base Price - Insurance Coverage) + Additional Test Costs",
  ["contact-lens-cost-calculator", "eyeglass-prescription-calculator", "pupillary-distance-calculator"]
);

add(
  "blue-light-exposure-calculator",
  "Blue Light Exposure Calculator",
  "Estimate daily blue light dose from screen time and devices.",
  "Health",
  "health",
  "H",
  ["blue light exposure", "screen time blue light", "digital eye strain calculator"],
  [
    '{ name: "phoneHours", label: "Phone Screen Time (hours/day)", type: "number", min: 0, max: 18, defaultValue: 4 }',
    '{ name: "computerHours", label: "Computer Screen Time (hours/day)", type: "number", min: 0, max: 18, defaultValue: 6 }',
    '{ name: "tvHours", label: "TV Screen Time (hours/day)", type: "number", min: 0, max: 12, defaultValue: 2 }',
    '{ name: "blueFilter", label: "Blue Light Filter", type: "select", options: [{ value: "0", label: "None" }, { value: "1", label: "Software Filter" }, { value: "2", label: "Blue Light Glasses" }] }'
  ],
  `(inputs) => {
    const phoneHours = inputs.phoneHours as number;
    const computerHours = inputs.computerHours as number;
    const tvHours = inputs.tvHours as number;
    const blueFilter = inputs.blueFilter as string;
    const phoneBlue = phoneHours * 0.9;
    const computerBlue = computerHours * 0.7;
    const tvBlue = tvHours * 0.4;
    let totalBlue = phoneBlue + computerBlue + tvBlue;
    let filterReduction = 0;
    if (blueFilter === "1") filterReduction = 0.30;
    else if (blueFilter === "2") filterReduction = 0.50;
    const filteredBlue = totalBlue * (1 - filterReduction);
    const totalScreenTime = phoneHours + computerHours + tvHours;
    let riskLevel = "Low";
    if (filteredBlue > 8) riskLevel = "High";
    else if (filteredBlue > 5) riskLevel = "Moderate";
    return {
      primary: { label: "Daily Blue Light Score", value: formatNumber(Math.round(filteredBlue * 10) / 10) },
      details: [
        { label: "Total Screen Time", value: formatNumber(totalScreenTime) + " hours" },
        { label: "Phone Contribution", value: formatNumber(Math.round(phoneBlue * 10) / 10) },
        { label: "Computer Contribution", value: formatNumber(Math.round(computerBlue * 10) / 10) },
        { label: "TV Contribution", value: formatNumber(Math.round(tvBlue * 10) / 10) },
        { label: "Filter Reduction", value: (filterReduction * 100) + "%" },
        { label: "Risk Level", value: riskLevel }
      ]
    };
  }`,
  [
    { q: "Does blue light from screens damage your eyes?", a: "Research is ongoing, but prolonged exposure may contribute to digital eye strain." },
    { q: "Do blue light glasses actually work?", a: "Blue light glasses can reduce exposure by up to 50% and may reduce eye fatigue." },
    { q: "How can I reduce blue light exposure?", a: "Use night mode settings, take screen breaks, and consider blue light filtering glasses." }
  ],
  "Blue Light Score = (Phone x 0.9 + Computer x 0.7 + TV x 0.4) x (1 - Filter%)",
  ["reading-glasses-strength-calculator", "eyeglass-prescription-calculator", "eye-exam-cost-calculator"]
);
add(
  "babysitting-rate-calculator",
  "Babysitting Rate Calculator",
  "Calculate a fair hourly babysitting rate based on number of children and experience.",
  "Finance",
  "finance",
  "$",
  ["babysitting", "rate", "childcare", "hourly", "pay"],
  [
    '{ name: "numChildren", label: "Number of Children", type: "number", min: 1, max: 10, step: 1, defaultValue: 2 }',
    '{ name: "baseRate", label: "Base Hourly Rate ($)", type: "number", min: 5, max: 50, step: 0.5, defaultValue: 15 }',
    '{ name: "hours", label: "Hours Per Session", type: "number", min: 1, max: 24, step: 0.5, defaultValue: 4 }',
    '{ name: "experience", label: "Experience Level", type: "select", options: [{ value: "1", label: "Beginner" }, { value: "1.1", label: "Intermediate" }, { value: "1.25", label: "Experienced" }] }'
  ],
  `(inputs) => {
    const numChildren = inputs.numChildren as number;
    const baseRate = inputs.baseRate as number;
    const hours = inputs.hours as number;
    const experience = inputs.experience as number;
    const extraChildRate = (numChildren - 1) * 2;
    const hourlyRate = (baseRate + extraChildRate) * experience;
    const sessionTotal = hourlyRate * hours;
    return {
      primary: { label: "Hourly Rate", value: "$" + formatNumber(hourlyRate) },
      details: [
        { label: "Extra Child Premium", value: "$" + formatNumber(extraChildRate) + "/hr" },
        { label: "Session Total", value: "$" + formatNumber(sessionTotal) },
        { label: "Monthly (4 sessions)", value: "$" + formatNumber(sessionTotal * 4) }
      ]
    };
  }`,
  [
    { q: "How much should I pay a babysitter?", a: "Typical rates range from $15 to $25 per hour depending on location and experience." },
    { q: "Should I pay more for multiple children?", a: "Yes, adding $1 to $3 per additional child is standard practice." }
  ],
  "Hourly Rate = (Base Rate + Extra Child Premium) x Experience Multiplier",
  ["au-pair-cost-calculator", "after-school-program-cost-calculator", "tutoring-cost-calculator"]
);

add(
  "au-pair-cost-calculator",
  "Au Pair Cost Calculator",
  "Estimate the annual cost of hosting an au pair including stipend and fees.",
  "Finance",
  "finance",
  "$",
  ["au pair", "childcare", "annual", "cost", "nanny"],
  [
    '{ name: "weeklyStipend", label: "Weekly Stipend ($)", type: "number", min: 100, max: 500, step: 10, defaultValue: 196 }',
    '{ name: "agencyFee", label: "Agency Fee ($)", type: "number", min: 2000, max: 15000, step: 100, defaultValue: 8000 }',
    '{ name: "educationAllowance", label: "Education Allowance ($)", type: "number", min: 0, max: 2000, step: 50, defaultValue: 500 }',
    '{ name: "roomBoardMonthly", label: "Room and Board Monthly ($)", type: "number", min: 200, max: 1500, step: 50, defaultValue: 500 }'
  ],
  `(inputs) => {
    const weeklyStipend = inputs.weeklyStipend as number;
    const agencyFee = inputs.agencyFee as number;
    const educationAllowance = inputs.educationAllowance as number;
    const roomBoardMonthly = inputs.roomBoardMonthly as number;
    const annualStipend = weeklyStipend * 52;
    const annualRoomBoard = roomBoardMonthly * 12;
    const totalAnnual = annualStipend + agencyFee + educationAllowance + annualRoomBoard;
    const monthlyCost = totalAnnual / 12;
    return {
      primary: { label: "Annual Cost", value: "$" + formatNumber(totalAnnual) },
      details: [
        { label: "Annual Stipend", value: "$" + formatNumber(annualStipend) },
        { label: "Annual Room and Board", value: "$" + formatNumber(annualRoomBoard) },
        { label: "Agency Fee", value: "$" + formatNumber(agencyFee) },
        { label: "Monthly Cost", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  }`,
  [
    { q: "How much does an au pair cost per year?", a: "The total annual cost typically ranges from $18,000 to $30,000 including all fees." },
    { q: "What is the required au pair stipend?", a: "The U.S. Department of State sets a minimum weekly stipend of $195.75." }
  ],
  "Annual Cost = (Weekly Stipend x 52) + Agency Fee + Education Allowance + (Room and Board x 12)",
  ["babysitting-rate-calculator", "after-school-program-cost-calculator", "tutoring-cost-calculator"]
);

add(
  "after-school-program-cost-calculator",
  "After School Program Cost Calculator",
  "Calculate the total cost of after school care programs per month and year.",
  "Finance",
  "finance",
  "$",
  ["after school", "childcare", "program", "cost", "care"],
  [
    '{ name: "dailyRate", label: "Daily Rate ($)", type: "number", min: 5, max: 100, step: 1, defaultValue: 25 }',
    '{ name: "daysPerWeek", label: "Days Per Week", type: "number", min: 1, max: 5, step: 1, defaultValue: 5 }',
    '{ name: "numChildren", label: "Number of Children", type: "number", min: 1, max: 6, step: 1, defaultValue: 1 }',
    '{ name: "months", label: "School Months Per Year", type: "number", min: 1, max: 12, step: 1, defaultValue: 10 }'
  ],
  `(inputs) => {
    const dailyRate = inputs.dailyRate as number;
    const daysPerWeek = inputs.daysPerWeek as number;
    const numChildren = inputs.numChildren as number;
    const months = inputs.months as number;
    const weeklyTotal = dailyRate * daysPerWeek * numChildren;
    const monthlyTotal = weeklyTotal * 4.33;
    const annualTotal = monthlyTotal * months;
    return {
      primary: { label: "Monthly Cost", value: "$" + formatNumber(monthlyTotal) },
      details: [
        { label: "Weekly Cost", value: "$" + formatNumber(weeklyTotal) },
        { label: "Annual Cost", value: "$" + formatNumber(annualTotal) },
        { label: "Cost Per Child Per Month", value: "$" + formatNumber(monthlyTotal / numChildren) }
      ]
    };
  }`,
  [
    { q: "How much does after school care cost?", a: "After school programs typically cost $200 to $600 per month per child." },
    { q: "Is after school care tax deductible?", a: "Yes, after school care may qualify for the Child and Dependent Care Tax Credit." }
  ],
  "Monthly Cost = Daily Rate x Days Per Week x Children x 4.33",
  ["babysitting-rate-calculator", "summer-camp-cost-calculator", "school-lunch-cost-calculator"]
);

add(
  "summer-camp-cost-calculator",
  "Summer Camp Cost Calculator",
  "Estimate the total cost of summer camp including tuition and extras.",
  "Finance",
  "finance",
  "$",
  ["summer camp", "camp", "cost", "children", "tuition"],
  [
    '{ name: "weeklyTuition", label: "Weekly Tuition ($)", type: "number", min: 50, max: 2000, step: 25, defaultValue: 300 }',
    '{ name: "numWeeks", label: "Number of Weeks", type: "number", min: 1, max: 12, step: 1, defaultValue: 6 }',
    '{ name: "suppliesFee", label: "Supplies and Materials ($)", type: "number", min: 0, max: 500, step: 10, defaultValue: 75 }',
    '{ name: "transportCost", label: "Transportation Cost ($)", type: "number", min: 0, max: 1000, step: 25, defaultValue: 150 }'
  ],
  `(inputs) => {
    const weeklyTuition = inputs.weeklyTuition as number;
    const numWeeks = inputs.numWeeks as number;
    const suppliesFee = inputs.suppliesFee as number;
    const transportCost = inputs.transportCost as number;
    const tuitionTotal = weeklyTuition * numWeeks;
    const grandTotal = tuitionTotal + suppliesFee + transportCost;
    const costPerDay = grandTotal / (numWeeks * 5);
    return {
      primary: { label: "Total Camp Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Tuition Total", value: "$" + formatNumber(tuitionTotal) },
        { label: "Supplies and Materials", value: "$" + formatNumber(suppliesFee) },
        { label: "Transportation", value: "$" + formatNumber(transportCost) },
        { label: "Cost Per Day", value: "$" + formatNumber(costPerDay) }
      ]
    };
  }`,
  [
    { q: "How much does summer camp cost on average?", a: "Day camps average $200 to $600 per week while overnight camps can exceed $1,000 per week." },
    { q: "Are summer camp expenses tax deductible?", a: "Day camp costs may qualify for the Child and Dependent Care Credit for working parents." }
  ],
  "Total Cost = (Weekly Tuition x Weeks) + Supplies + Transportation",
  ["after-school-program-cost-calculator", "sports-league-cost-calculator", "field-trip-cost-calculator"]
);

add(
  "sports-league-cost-calculator",
  "Sports League Cost Calculator",
  "Calculate the total cost of a youth sports season including fees and gear.",
  "Finance",
  "finance",
  "$",
  ["sports", "league", "youth", "cost", "season"],
  [
    '{ name: "registrationFee", label: "Registration Fee ($)", type: "number", min: 25, max: 1000, step: 25, defaultValue: 150 }',
    '{ name: "equipmentCost", label: "Equipment and Gear ($)", type: "number", min: 0, max: 2000, step: 25, defaultValue: 200 }',
    '{ name: "uniformCost", label: "Uniform Cost ($)", type: "number", min: 0, max: 300, step: 10, defaultValue: 75 }',
    '{ name: "travelCost", label: "Travel Per Game ($)", type: "number", min: 0, max: 100, step: 5, defaultValue: 15 }',
    '{ name: "numGames", label: "Number of Games", type: "number", min: 4, max: 40, step: 1, defaultValue: 12 }'
  ],
  `(inputs) => {
    const registrationFee = inputs.registrationFee as number;
    const equipmentCost = inputs.equipmentCost as number;
    const uniformCost = inputs.uniformCost as number;
    const travelCost = inputs.travelCost as number;
    const numGames = inputs.numGames as number;
    const totalTravel = travelCost * numGames;
    const seasonTotal = registrationFee + equipmentCost + uniformCost + totalTravel;
    const costPerGame = seasonTotal / numGames;
    return {
      primary: { label: "Season Total", value: "$" + formatNumber(seasonTotal) },
      details: [
        { label: "Registration", value: "$" + formatNumber(registrationFee) },
        { label: "Equipment and Gear", value: "$" + formatNumber(equipmentCost) },
        { label: "Uniform", value: "$" + formatNumber(uniformCost) },
        { label: "Total Travel", value: "$" + formatNumber(totalTravel) },
        { label: "Cost Per Game", value: "$" + formatNumber(costPerGame) }
      ]
    };
  }`,
  [
    { q: "How much does youth sports cost per season?", a: "A typical youth sports season costs between $200 and $800 depending on the sport." },
    { q: "What sport is cheapest for kids?", a: "Running, soccer, and basketball tend to have the lowest startup costs for youth athletes." }
  ],
  "Season Total = Registration + Equipment + Uniform + (Travel Per Game x Games)",
  ["summer-camp-cost-calculator", "music-lesson-cost-calculator", "school-supply-list-calculator"]
);

add(
  "music-lesson-cost-calculator",
  "Music Lesson Cost Calculator",
  "Calculate the annual cost of music lessons including instrument rental.",
  "Finance",
  "finance",
  "$",
  ["music", "lessons", "cost", "instrument", "annual"],
  [
    '{ name: "lessonRate", label: "Lesson Rate Per Session ($)", type: "number", min: 15, max: 200, step: 5, defaultValue: 50 }',
    '{ name: "lessonsPerMonth", label: "Lessons Per Month", type: "number", min: 1, max: 8, step: 1, defaultValue: 4 }',
    '{ name: "instrumentRental", label: "Monthly Instrument Rental ($)", type: "number", min: 0, max: 200, step: 5, defaultValue: 30 }',
    '{ name: "booksMaterials", label: "Annual Books and Materials ($)", type: "number", min: 0, max: 500, step: 10, defaultValue: 60 }'
  ],
  `(inputs) => {
    const lessonRate = inputs.lessonRate as number;
    const lessonsPerMonth = inputs.lessonsPerMonth as number;
    const instrumentRental = inputs.instrumentRental as number;
    const booksMaterials = inputs.booksMaterials as number;
    const monthlyLessons = lessonRate * lessonsPerMonth;
    const monthlyTotal = monthlyLessons + instrumentRental;
    const annualTotal = (monthlyTotal * 12) + booksMaterials;
    return {
      primary: { label: "Annual Cost", value: "$" + formatNumber(annualTotal) },
      details: [
        { label: "Monthly Lesson Cost", value: "$" + formatNumber(monthlyLessons) },
        { label: "Monthly Rental", value: "$" + formatNumber(instrumentRental) },
        { label: "Monthly Total", value: "$" + formatNumber(monthlyTotal) },
        { label: "Books and Materials", value: "$" + formatNumber(booksMaterials) }
      ]
    };
  }`,
  [
    { q: "How much do music lessons cost per month?", a: "Private music lessons typically cost $150 to $300 per month for weekly sessions." },
    { q: "Is it cheaper to buy or rent an instrument?", a: "Renting is cheaper short term but buying saves money if the student continues past one year." }
  ],
  "Annual Cost = ((Lesson Rate x Lessons Per Month) + Rental) x 12 + Materials",
  ["tutoring-cost-calculator", "sports-league-cost-calculator", "after-school-program-cost-calculator"]
);

add(
  "tutoring-cost-calculator",
  "Tutoring Cost Calculator",
  "Calculate the hourly and monthly cost of private or group tutoring.",
  "Finance",
  "finance",
  "$",
  ["tutoring", "cost", "hourly", "education", "private"],
  [
    '{ name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 10, max: 200, step: 5, defaultValue: 45 }',
    '{ name: "sessionsPerWeek", label: "Sessions Per Week", type: "number", min: 1, max: 7, step: 1, defaultValue: 2 }',
    '{ name: "hoursPerSession", label: "Hours Per Session", type: "number", min: 0.5, max: 4, step: 0.5, defaultValue: 1 }',
    '{ name: "numMonths", label: "Number of Months", type: "number", min: 1, max: 12, step: 1, defaultValue: 9 }'
  ],
  `(inputs) => {
    const hourlyRate = inputs.hourlyRate as number;
    const sessionsPerWeek = inputs.sessionsPerWeek as number;
    const hoursPerSession = inputs.hoursPerSession as number;
    const numMonths = inputs.numMonths as number;
    const weeklyHours = sessionsPerWeek * hoursPerSession;
    const weeklyCost = weeklyHours * hourlyRate;
    const monthlyCost = weeklyCost * 4.33;
    const totalCost = monthlyCost * numMonths;
    return {
      primary: { label: "Monthly Cost", value: "$" + formatNumber(monthlyCost) },
      details: [
        { label: "Weekly Hours", value: formatNumber(weeklyHours) },
        { label: "Weekly Cost", value: "$" + formatNumber(weeklyCost) },
        { label: "Total Cost (" + numMonths + " months)", value: "$" + formatNumber(totalCost) },
        { label: "Cost Per Hour", value: "$" + formatNumber(hourlyRate) }
      ]
    };
  }`,
  [
    { q: "How much does tutoring cost per hour?", a: "Private tutoring typically costs $25 to $80 per hour depending on subject and level." },
    { q: "How many tutoring sessions per week are recommended?", a: "Most students benefit from two to three sessions per week for consistent improvement." }
  ],
  "Monthly Cost = Hourly Rate x Sessions Per Week x Hours Per Session x 4.33",
  ["music-lesson-cost-calculator", "homeschool-curriculum-cost-calculator", "study-hours-calculator"]
);

add(
  "homeschool-curriculum-cost-calculator",
  "Homeschool Curriculum Cost Calculator",
  "Estimate the total cost of homeschool materials and resources per year.",
  "Finance",
  "finance",
  "$",
  ["homeschool", "curriculum", "cost", "materials", "education"],
  [
    '{ name: "textbooks", label: "Textbooks and Workbooks ($)", type: "number", min: 0, max: 2000, step: 25, defaultValue: 400 }',
    '{ name: "onlinePrograms", label: "Online Programs ($)", type: "number", min: 0, max: 1500, step: 25, defaultValue: 200 }',
    '{ name: "supplies", label: "Art and Science Supplies ($)", type: "number", min: 0, max: 500, step: 10, defaultValue: 150 }',
    '{ name: "fieldTrips", label: "Field Trips and Activities ($)", type: "number", min: 0, max: 1000, step: 25, defaultValue: 200 }',
    '{ name: "numStudents", label: "Number of Students", type: "number", min: 1, max: 8, step: 1, defaultValue: 1 }'
  ],
  `(inputs) => {
    const textbooks = inputs.textbooks as number;
    const onlinePrograms = inputs.onlinePrograms as number;
    const supplies = inputs.supplies as number;
    const fieldTrips = inputs.fieldTrips as number;
    const numStudents = inputs.numStudents as number;
    const perStudentCost = textbooks + onlinePrograms + supplies + fieldTrips;
    const totalCost = perStudentCost * numStudents;
    const monthlyCost = totalCost / 12;
    return {
      primary: { label: "Annual Total", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Per Student Cost", value: "$" + formatNumber(perStudentCost) },
        { label: "Textbooks and Workbooks", value: "$" + formatNumber(textbooks * numStudents) },
        { label: "Online Programs", value: "$" + formatNumber(onlinePrograms * numStudents) },
        { label: "Monthly Average", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  }`,
  [
    { q: "How much does homeschooling cost per year?", a: "Homeschool curriculum costs typically range from $500 to $2,500 per student per year." },
    { q: "Are homeschool expenses tax deductible?", a: "Most states do not offer tax deductions for homeschool expenses but some offer credits." }
  ],
  "Annual Total = (Textbooks + Online Programs + Supplies + Field Trips) x Students",
  ["tutoring-cost-calculator", "school-supply-list-calculator", "school-lunch-cost-calculator"]
);

add(
  "school-supply-list-calculator",
  "School Supply List Calculator",
  "Calculate the total budget for back to school supplies.",
  "Finance",
  "finance",
  "$",
  ["school supplies", "budget", "back to school", "cost", "list"],
  [
    '{ name: "notebooks", label: "Notebooks and Paper ($)", type: "number", min: 0, max: 100, step: 1, defaultValue: 25 }',
    '{ name: "writingTools", label: "Pens and Pencils ($)", type: "number", min: 0, max: 50, step: 1, defaultValue: 15 }',
    '{ name: "backpack", label: "Backpack ($)", type: "number", min: 0, max: 200, step: 5, defaultValue: 40 }',
    '{ name: "techItems", label: "Technology Items ($)", type: "number", min: 0, max: 1000, step: 25, defaultValue: 100 }',
    '{ name: "otherSupplies", label: "Other Supplies ($)", type: "number", min: 0, max: 300, step: 5, defaultValue: 30 }'
  ],
  `(inputs) => {
    const notebooks = inputs.notebooks as number;
    const writingTools = inputs.writingTools as number;
    const backpack = inputs.backpack as number;
    const techItems = inputs.techItems as number;
    const otherSupplies = inputs.otherSupplies as number;
    const totalBudget = notebooks + writingTools + backpack + techItems + otherSupplies;
    const taxEstimate = totalBudget * 0.07;
    const grandTotal = totalBudget + taxEstimate;
    return {
      primary: { label: "Total Budget", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Subtotal", value: "$" + formatNumber(totalBudget) },
        { label: "Estimated Tax (7%)", value: "$" + formatNumber(taxEstimate) },
        { label: "Notebooks and Paper", value: "$" + formatNumber(notebooks) },
        { label: "Technology Items", value: "$" + formatNumber(techItems) }
      ]
    };
  }`,
  [
    { q: "How much should I budget for school supplies?", a: "The average family spends $100 to $300 per child on back to school supplies." },
    { q: "When is the best time to buy school supplies?", a: "Late July and August offer the best sales, especially during tax-free weekends." }
  ],
  "Total Budget = (Notebooks + Pens + Backpack + Tech + Other) x 1.07",
  ["homeschool-curriculum-cost-calculator", "school-lunch-cost-calculator", "dorm-room-essentials-calculator"]
);

add(
  "field-trip-cost-calculator",
  "Field Trip Cost Calculator",
  "Calculate the per student and total cost for a school field trip.",
  "Finance",
  "finance",
  "$",
  ["field trip", "school", "cost", "student", "bus"],
  [
    '{ name: "numStudents", label: "Number of Students", type: "number", min: 5, max: 200, step: 1, defaultValue: 30 }',
    '{ name: "busCost", label: "Bus Rental Cost ($)", type: "number", min: 100, max: 3000, step: 50, defaultValue: 500 }',
    '{ name: "admissionPerStudent", label: "Admission Per Student ($)", type: "number", min: 0, max: 50, step: 1, defaultValue: 12 }',
    '{ name: "lunchPerStudent", label: "Lunch Per Student ($)", type: "number", min: 0, max: 25, step: 1, defaultValue: 8 }'
  ],
  `(inputs) => {
    const numStudents = inputs.numStudents as number;
    const busCost = inputs.busCost as number;
    const admissionPerStudent = inputs.admissionPerStudent as number;
    const lunchPerStudent = inputs.lunchPerStudent as number;
    const totalAdmission = admissionPerStudent * numStudents;
    const totalLunch = lunchPerStudent * numStudents;
    const grandTotal = busCost + totalAdmission + totalLunch;
    const costPerStudent = grandTotal / numStudents;
    return {
      primary: { label: "Cost Per Student", value: "$" + formatNumber(costPerStudent) },
      details: [
        { label: "Grand Total", value: "$" + formatNumber(grandTotal) },
        { label: "Bus Rental", value: "$" + formatNumber(busCost) },
        { label: "Total Admission", value: "$" + formatNumber(totalAdmission) },
        { label: "Total Lunch", value: "$" + formatNumber(totalLunch) }
      ]
    };
  }`,
  [
    { q: "How much does a school field trip cost per student?", a: "Field trips typically cost $10 to $40 per student depending on destination and distance." },
    { q: "Who pays for school field trips?", a: "Costs are usually split between school budgets, parent contributions, and fundraisers." }
  ],
  "Cost Per Student = (Bus Rental + Total Admission + Total Lunch) / Students",
  ["summer-camp-cost-calculator", "school-bus-route-calculator", "school-fundraiser-calculator"]
);

add(
  "school-lunch-cost-calculator",
  "School Lunch Cost Calculator",
  "Calculate the annual cost of school lunches for your children.",
  "Finance",
  "finance",
  "$",
  ["school lunch", "cost", "annual", "meal", "cafeteria"],
  [
    '{ name: "lunchPrice", label: "Lunch Price Per Day ($)", type: "number", min: 1, max: 10, step: 0.25, defaultValue: 3.5 }',
    '{ name: "daysPerWeek", label: "Days Buying Lunch", type: "number", min: 1, max: 5, step: 1, defaultValue: 5 }',
    '{ name: "schoolWeeks", label: "School Weeks Per Year", type: "number", min: 20, max: 45, step: 1, defaultValue: 36 }',
    '{ name: "numChildren", label: "Number of Children", type: "number", min: 1, max: 6, step: 1, defaultValue: 1 }'
  ],
  `(inputs) => {
    const lunchPrice = inputs.lunchPrice as number;
    const daysPerWeek = inputs.daysPerWeek as number;
    const schoolWeeks = inputs.schoolWeeks as number;
    const numChildren = inputs.numChildren as number;
    const weeklyPerChild = lunchPrice * daysPerWeek;
    const annualPerChild = weeklyPerChild * schoolWeeks;
    const annualTotal = annualPerChild * numChildren;
    const monthlyTotal = annualTotal / 9;
    return {
      primary: { label: "Annual Total", value: "$" + formatNumber(annualTotal) },
      details: [
        { label: "Weekly Per Child", value: "$" + formatNumber(weeklyPerChild) },
        { label: "Annual Per Child", value: "$" + formatNumber(annualPerChild) },
        { label: "Monthly Average", value: "$" + formatNumber(monthlyTotal) },
        { label: "Total School Days", value: formatNumber(daysPerWeek * schoolWeeks) }
      ]
    };
  }`,
  [
    { q: "How much does school lunch cost per year?", a: "At $3.50 per day for 180 days, school lunch costs about $630 per child annually." },
    { q: "Is packing lunch cheaper than buying?", a: "Packed lunches average $2 to $3 per day, saving $100 to $300 per year per child." }
  ],
  "Annual Total = Lunch Price x Days Per Week x School Weeks x Children",
  ["meal-plan-comparison-calculator", "school-supply-list-calculator", "after-school-program-cost-calculator"]
);

add(
  "school-bus-route-calculator",
  "School Bus Route Calculator",
  "Estimate the bus route time based on stops and distance to school.",
  "Everyday",
  "everyday",
  "~",
  ["school bus", "route", "time", "distance", "commute"],
  [
    '{ name: "totalDistance", label: "Total Route Distance (miles)", type: "number", min: 1, max: 50, step: 0.5, defaultValue: 8 }',
    '{ name: "numStops", label: "Number of Stops", type: "number", min: 1, max: 30, step: 1, defaultValue: 10 }',
    '{ name: "avgStopTime", label: "Average Stop Time (minutes)", type: "number", min: 0.5, max: 5, step: 0.5, defaultValue: 1.5 }',
    '{ name: "avgSpeed", label: "Average Speed (mph)", type: "number", min: 10, max: 40, step: 5, defaultValue: 25 }'
  ],
  `(inputs) => {
    const totalDistance = inputs.totalDistance as number;
    const numStops = inputs.numStops as number;
    const avgStopTime = inputs.avgStopTime as number;
    const avgSpeed = inputs.avgSpeed as number;
    const driveTime = (totalDistance / avgSpeed) * 60;
    const totalStopTime = numStops * avgStopTime;
    const totalRouteTime = driveTime + totalStopTime;
    return {
      primary: { label: "Total Route Time", value: formatNumber(totalRouteTime) + " minutes" },
      details: [
        { label: "Drive Time", value: formatNumber(driveTime) + " min" },
        { label: "Total Stop Time", value: formatNumber(totalStopTime) + " min" },
        { label: "Average Time Per Stop", value: formatNumber(avgStopTime) + " min" },
        { label: "Route Distance", value: formatNumber(totalDistance) + " miles" }
      ]
    };
  }`,
  [
    { q: "How long is the average school bus ride?", a: "The average school bus ride is 30 to 45 minutes each way in most districts." },
    { q: "How many stops does a school bus make?", a: "A typical school bus route includes 8 to 15 stops depending on the area." }
  ],
  "Total Time = (Distance / Speed x 60) + (Stops x Stop Time)",
  ["field-trip-cost-calculator", "classroom-size-calculator", "study-hours-calculator"]
);

add(
  "classroom-size-calculator",
  "Classroom Size Calculator",
  "Calculate the student to teacher ratio and ideal class capacity.",
  "Everyday",
  "everyday",
  "~",
  ["classroom", "size", "ratio", "students", "teacher"],
  [
    '{ name: "numStudents", label: "Total Number of Students", type: "number", min: 10, max: 500, step: 1, defaultValue: 120 }',
    '{ name: "numTeachers", label: "Number of Teachers", type: "number", min: 1, max: 30, step: 1, defaultValue: 5 }',
    '{ name: "numAides", label: "Number of Aides", type: "number", min: 0, max: 20, step: 1, defaultValue: 2 }',
    '{ name: "roomCapacity", label: "Room Capacity (sq ft)", type: "number", min: 200, max: 5000, step: 50, defaultValue: 900 }'
  ],
  `(inputs) => {
    const numStudents = inputs.numStudents as number;
    const numTeachers = inputs.numTeachers as number;
    const numAides = inputs.numAides as number;
    const roomCapacity = inputs.roomCapacity as number;
    const studentTeacherRatio = numStudents / numTeachers;
    const totalStaff = numTeachers + numAides;
    const studentStaffRatio = numStudents / totalStaff;
    const studentsPerClass = numStudents / numTeachers;
    const sqFtPerStudent = roomCapacity / studentsPerClass;
    return {
      primary: { label: "Student to Teacher Ratio", value: formatNumber(studentTeacherRatio) + ":1" },
      details: [
        { label: "Students Per Class", value: formatNumber(studentsPerClass) },
        { label: "Student to Staff Ratio", value: formatNumber(studentStaffRatio) + ":1" },
        { label: "Sq Ft Per Student", value: formatNumber(sqFtPerStudent) + " sq ft" },
        { label: "Total Staff", value: formatNumber(totalStaff) }
      ]
    };
  }`,
  [
    { q: "What is the ideal student to teacher ratio?", a: "Research suggests a ratio of 15:1 to 20:1 is ideal for effective learning." },
    { q: "How much space does each student need?", a: "The recommended minimum is 28 to 36 square feet per student in a classroom." }
  ],
  "Student to Teacher Ratio = Total Students / Number of Teachers",
  ["school-bus-route-calculator", "school-fundraiser-calculator", "study-hours-calculator"]
);

add(
  "school-fundraiser-calculator",
  "School Fundraiser Calculator",
  "Estimate the profit from a school fundraiser based on sales and costs.",
  "Finance",
  "finance",
  "$",
  ["fundraiser", "school", "profit", "sales", "event"],
  [
    '{ name: "numParticipants", label: "Number of Sellers", type: "number", min: 5, max: 500, step: 5, defaultValue: 50 }',
    '{ name: "avgSalesPerPerson", label: "Average Sales Per Person ($)", type: "number", min: 10, max: 500, step: 10, defaultValue: 80 }',
    '{ name: "costPercent", label: "Product Cost (%)", type: "number", min: 10, max: 80, step: 5, defaultValue: 40 }',
    '{ name: "fixedCosts", label: "Fixed Costs ($)", type: "number", min: 0, max: 2000, step: 25, defaultValue: 200 }'
  ],
  `(inputs) => {
    const numParticipants = inputs.numParticipants as number;
    const avgSalesPerPerson = inputs.avgSalesPerPerson as number;
    const costPercent = inputs.costPercent as number;
    const fixedCosts = inputs.fixedCosts as number;
    const totalSales = numParticipants * avgSalesPerPerson;
    const productCost = totalSales * (costPercent / 100);
    const grossProfit = totalSales - productCost;
    const netProfit = grossProfit - fixedCosts;
    const profitMargin = (netProfit / totalSales) * 100;
    return {
      primary: { label: "Net Profit", value: "$" + formatNumber(netProfit) },
      details: [
        { label: "Total Sales", value: "$" + formatNumber(totalSales) },
        { label: "Product Cost", value: "$" + formatNumber(productCost) },
        { label: "Gross Profit", value: "$" + formatNumber(grossProfit) },
        { label: "Profit Margin", value: formatNumber(profitMargin) + "%" }
      ]
    };
  }`,
  [
    { q: "How much can a school fundraiser earn?", a: "A well-organized school fundraiser can earn $2,000 to $10,000 depending on size." },
    { q: "What is the best type of school fundraiser?", a: "Product sales, walk-a-thons, and online campaigns tend to generate the highest returns." }
  ],
  "Net Profit = (Total Sales - Product Cost) - Fixed Costs",
  ["field-trip-cost-calculator", "yearbook-cost-calculator", "prom-budget-calculator"]
);

add(
  "yearbook-cost-calculator",
  "Yearbook Cost Calculator",
  "Calculate yearbook printing costs and revenue per unit.",
  "Finance",
  "finance",
  "$",
  ["yearbook", "printing", "cost", "school", "budget"],
  [
    '{ name: "numCopies", label: "Number of Copies", type: "number", min: 50, max: 2000, step: 10, defaultValue: 300 }',
    '{ name: "printCostPerUnit", label: "Print Cost Per Unit ($)", type: "number", min: 5, max: 50, step: 1, defaultValue: 15 }',
    '{ name: "sellingPrice", label: "Selling Price ($)", type: "number", min: 10, max: 100, step: 5, defaultValue: 40 }',
    '{ name: "designCost", label: "Design and Software Cost ($)", type: "number", min: 0, max: 3000, step: 50, defaultValue: 500 }'
  ],
  `(inputs) => {
    const numCopies = inputs.numCopies as number;
    const printCostPerUnit = inputs.printCostPerUnit as number;
    const sellingPrice = inputs.sellingPrice as number;
    const designCost = inputs.designCost as number;
    const totalPrintCost = numCopies * printCostPerUnit;
    const totalCost = totalPrintCost + designCost;
    const totalRevenue = numCopies * sellingPrice;
    const profit = totalRevenue - totalCost;
    const costPerUnit = totalCost / numCopies;
    return {
      primary: { label: "Total Profit", value: "$" + formatNumber(profit) },
      details: [
        { label: "Total Revenue", value: "$" + formatNumber(totalRevenue) },
        { label: "Total Cost", value: "$" + formatNumber(totalCost) },
        { label: "Cost Per Unit", value: "$" + formatNumber(costPerUnit) },
        { label: "Profit Per Unit", value: "$" + formatNumber(sellingPrice - costPerUnit) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to print a yearbook?", a: "Yearbook printing costs range from $8 to $25 per copy depending on size and features." },
    { q: "How many yearbooks should a school order?", a: "Schools typically order enough for 60% to 80% of their student body." }
  ],
  "Profit = (Selling Price x Copies) - (Print Cost x Copies + Design Cost)",
  ["school-fundraiser-calculator", "prom-budget-calculator", "graduation-party-calculator"]
);

add(
  "prom-budget-calculator",
  "Prom Budget Calculator",
  "Plan your prom event budget including venue, food, and decorations.",
  "Finance",
  "finance",
  "$",
  ["prom", "budget", "event", "school", "dance"],
  [
    '{ name: "venueCost", label: "Venue Rental ($)", type: "number", min: 500, max: 20000, step: 100, defaultValue: 3000 }',
    '{ name: "cateringPerPerson", label: "Catering Per Person ($)", type: "number", min: 10, max: 100, step: 5, defaultValue: 30 }',
    '{ name: "numAttendees", label: "Number of Attendees", type: "number", min: 50, max: 1000, step: 10, defaultValue: 200 }',
    '{ name: "djEntertainment", label: "DJ and Entertainment ($)", type: "number", min: 200, max: 5000, step: 100, defaultValue: 1500 }',
    '{ name: "decorations", label: "Decorations ($)", type: "number", min: 100, max: 5000, step: 50, defaultValue: 800 }'
  ],
  `(inputs) => {
    const venueCost = inputs.venueCost as number;
    const cateringPerPerson = inputs.cateringPerPerson as number;
    const numAttendees = inputs.numAttendees as number;
    const djEntertainment = inputs.djEntertainment as number;
    const decorations = inputs.decorations as number;
    const totalCatering = cateringPerPerson * numAttendees;
    const grandTotal = venueCost + totalCatering + djEntertainment + decorations;
    const ticketPrice = grandTotal / numAttendees;
    return {
      primary: { label: "Total Budget", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Venue", value: "$" + formatNumber(venueCost) },
        { label: "Total Catering", value: "$" + formatNumber(totalCatering) },
        { label: "DJ and Entertainment", value: "$" + formatNumber(djEntertainment) },
        { label: "Suggested Ticket Price", value: "$" + formatNumber(ticketPrice) }
      ]
    };
  }`,
  [
    { q: "How much does prom cost to organize?", a: "School proms typically cost $5,000 to $20,000 depending on venue and attendance." },
    { q: "How much should prom tickets cost?", a: "Prom tickets usually range from $30 to $75 per person to cover expenses." }
  ],
  "Total Budget = Venue + (Catering x Attendees) + Entertainment + Decorations",
  ["graduation-party-calculator", "school-fundraiser-calculator", "yearbook-cost-calculator"]
);

add(
  "graduation-party-calculator",
  "Graduation Party Calculator",
  "Calculate the total cost of hosting a graduation party.",
  "Finance",
  "finance",
  "$",
  ["graduation", "party", "cost", "celebration", "budget"],
  [
    '{ name: "numGuests", label: "Number of Guests", type: "number", min: 10, max: 200, step: 5, defaultValue: 40 }',
    '{ name: "foodPerPerson", label: "Food Per Person ($)", type: "number", min: 5, max: 50, step: 1, defaultValue: 15 }',
    '{ name: "venueCost", label: "Venue or Rental Cost ($)", type: "number", min: 0, max: 5000, step: 50, defaultValue: 300 }',
    '{ name: "decorations", label: "Decorations ($)", type: "number", min: 0, max: 1000, step: 25, defaultValue: 150 }',
    '{ name: "cakeAndDessert", label: "Cake and Dessert ($)", type: "number", min: 0, max: 500, step: 10, defaultValue: 80 }'
  ],
  `(inputs) => {
    const numGuests = inputs.numGuests as number;
    const foodPerPerson = inputs.foodPerPerson as number;
    const venueCost = inputs.venueCost as number;
    const decorations = inputs.decorations as number;
    const cakeAndDessert = inputs.cakeAndDessert as number;
    const totalFood = foodPerPerson * numGuests;
    const grandTotal = totalFood + venueCost + decorations + cakeAndDessert;
    const costPerGuest = grandTotal / numGuests;
    return {
      primary: { label: "Total Party Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Total Food Cost", value: "$" + formatNumber(totalFood) },
        { label: "Venue or Rental", value: "$" + formatNumber(venueCost) },
        { label: "Decorations", value: "$" + formatNumber(decorations) },
        { label: "Cost Per Guest", value: "$" + formatNumber(costPerGuest) }
      ]
    };
  }`,
  [
    { q: "How much does a graduation party cost?", a: "A graduation party typically costs $500 to $2,000 for a home event with 30 to 50 guests." },
    { q: "How much food should I plan per guest?", a: "Plan for 1 pound of food per guest for a full meal or 6 to 8 appetizer pieces per person." }
  ],
  "Total Cost = (Food x Guests) + Venue + Decorations + Cake",
  ["prom-budget-calculator", "college-application-cost-calculator", "yearbook-cost-calculator"]
);

add(
  "college-application-cost-calculator",
  "College Application Cost Calculator",
  "Calculate the total cost of applying to multiple colleges.",
  "Finance",
  "finance",
  "$",
  ["college", "application", "fees", "cost", "admissions"],
  [
    '{ name: "numApplications", label: "Number of Applications", type: "number", min: 1, max: 25, step: 1, defaultValue: 8 }',
    '{ name: "avgAppFee", label: "Average Application Fee ($)", type: "number", min: 25, max: 100, step: 5, defaultValue: 65 }',
    '{ name: "testScoreSends", label: "Test Score Sends ($)", type: "number", min: 0, max: 200, step: 5, defaultValue: 60 }',
    '{ name: "transcriptFees", label: "Transcript Fees ($)", type: "number", min: 0, max: 100, step: 5, defaultValue: 25 }',
    '{ name: "cssProfileFee", label: "CSS Profile Fees ($)", type: "number", min: 0, max: 200, step: 5, defaultValue: 50 }'
  ],
  `(inputs) => {
    const numApplications = inputs.numApplications as number;
    const avgAppFee = inputs.avgAppFee as number;
    const testScoreSends = inputs.testScoreSends as number;
    const transcriptFees = inputs.transcriptFees as number;
    const cssProfileFee = inputs.cssProfileFee as number;
    const totalAppFees = numApplications * avgAppFee;
    const grandTotal = totalAppFees + testScoreSends + transcriptFees + cssProfileFee;
    const costPerApp = grandTotal / numApplications;
    return {
      primary: { label: "Total Application Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Application Fees", value: "$" + formatNumber(totalAppFees) },
        { label: "Test Score Sends", value: "$" + formatNumber(testScoreSends) },
        { label: "Transcript Fees", value: "$" + formatNumber(transcriptFees) },
        { label: "Average Cost Per School", value: "$" + formatNumber(costPerApp) }
      ]
    };
  }`,
  [
    { q: "How much do college applications cost?", a: "College application fees range from $40 to $90 each, averaging about $65 per school." },
    { q: "Can application fees be waived?", a: "Many schools offer fee waivers for students who demonstrate financial need." }
  ],
  "Total Cost = (Applications x Avg Fee) + Score Sends + Transcripts + CSS Profile",
  ["graduation-party-calculator", "dorm-room-essentials-calculator", "sat-score-calculator"]
);

add(
  "dorm-room-essentials-calculator",
  "Dorm Room Essentials Calculator",
  "Calculate the total cost of setting up a college dorm room.",
  "Finance",
  "finance",
  "$",
  ["dorm", "college", "essentials", "setup", "cost"],
  [
    '{ name: "bedding", label: "Bedding and Linens ($)", type: "number", min: 30, max: 500, step: 10, defaultValue: 120 }',
    '{ name: "storage", label: "Storage and Organization ($)", type: "number", min: 0, max: 300, step: 10, defaultValue: 75 }',
    '{ name: "electronics", label: "Electronics ($)", type: "number", min: 0, max: 1000, step: 25, defaultValue: 200 }',
    '{ name: "decor", label: "Decor and Lighting ($)", type: "number", min: 0, max: 300, step: 10, defaultValue: 60 }',
    '{ name: "cleaning", label: "Cleaning Supplies ($)", type: "number", min: 0, max: 100, step: 5, defaultValue: 35 }'
  ],
  `(inputs) => {
    const bedding = inputs.bedding as number;
    const storage = inputs.storage as number;
    const electronics = inputs.electronics as number;
    const decor = inputs.decor as number;
    const cleaning = inputs.cleaning as number;
    const totalCost = bedding + storage + electronics + decor + cleaning;
    const taxEstimate = totalCost * 0.07;
    const grandTotal = totalCost + taxEstimate;
    return {
      primary: { label: "Total Setup Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Subtotal", value: "$" + formatNumber(totalCost) },
        { label: "Estimated Tax (7%)", value: "$" + formatNumber(taxEstimate) },
        { label: "Bedding and Linens", value: "$" + formatNumber(bedding) },
        { label: "Electronics", value: "$" + formatNumber(electronics) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to furnish a dorm room?", a: "Most students spend $500 to $1,500 on dorm room essentials for their first year." },
    { q: "What are the most important dorm essentials?", a: "Bedding, storage bins, a desk lamp, power strips, and cleaning supplies are the top priorities." }
  ],
  "Total Cost = (Bedding + Storage + Electronics + Decor + Cleaning) x 1.07",
  ["college-application-cost-calculator", "meal-plan-comparison-calculator", "school-supply-list-calculator"]
);

add(
  "meal-plan-comparison-calculator",
  "Meal Plan Comparison Calculator",
  "Compare the value of college meal plans versus cooking on your own.",
  "Finance",
  "finance",
  "$",
  ["meal plan", "college", "comparison", "food", "dining"],
  [
    '{ name: "mealPlanCost", label: "Semester Meal Plan Cost ($)", type: "number", min: 1000, max: 8000, step: 100, defaultValue: 3500 }',
    '{ name: "mealsPerWeek", label: "Meals Per Week Included", type: "number", min: 7, max: 21, step: 1, defaultValue: 14 }',
    '{ name: "semesterWeeks", label: "Semester Length (weeks)", type: "number", min: 12, max: 20, step: 1, defaultValue: 16 }',
    '{ name: "groceryCostWeekly", label: "Weekly Grocery Cost ($)", type: "number", min: 30, max: 200, step: 10, defaultValue: 70 }'
  ],
  `(inputs) => {
    const mealPlanCost = inputs.mealPlanCost as number;
    const mealsPerWeek = inputs.mealsPerWeek as number;
    const semesterWeeks = inputs.semesterWeeks as number;
    const groceryCostWeekly = inputs.groceryCostWeekly as number;
    const totalMeals = mealsPerWeek * semesterWeeks;
    const costPerMeal = mealPlanCost / totalMeals;
    const groceryTotal = groceryCostWeekly * semesterWeeks;
    const groceryCostPerMeal = groceryTotal / (21 * semesterWeeks);
    const savings = mealPlanCost - groceryTotal;
    return {
      primary: { label: "Meal Plan Cost Per Meal", value: "$" + formatNumber(costPerMeal) },
      details: [
        { label: "Total Meals Included", value: formatNumber(totalMeals) },
        { label: "Meal Plan Total", value: "$" + formatNumber(mealPlanCost) },
        { label: "Grocery Total (semester)", value: "$" + formatNumber(groceryTotal) },
        { label: "Difference", value: "$" + formatNumber(Math.abs(savings)) + (savings > 0 ? " more for plan" : " less for plan") }
      ]
    };
  }`,
  [
    { q: "Is a college meal plan worth it?", a: "Meal plans offer convenience but cooking can save $500 to $1,500 per semester." },
    { q: "How much does a college student spend on food?", a: "The average college student spends $250 to $500 per month on food and dining." }
  ],
  "Cost Per Meal = Semester Meal Plan Cost / (Meals Per Week x Semester Weeks)",
  ["school-lunch-cost-calculator", "dorm-room-essentials-calculator", "college-application-cost-calculator"]
);

add(
  "study-hours-calculator",
  "Study Hours Calculator",
  "Calculate the recommended weekly study hours based on credit load.",
  "Everyday",
  "everyday",
  "~",
  ["study", "hours", "credits", "college", "time management"],
  [
    '{ name: "creditHours", label: "Total Credit Hours", type: "number", min: 1, max: 24, step: 1, defaultValue: 15 }',
    '{ name: "studyRatio", label: "Study Hours Per Credit", type: "select", options: [{ value: "2", label: "Standard (2:1)" }, { value: "2.5", label: "Challenging (2.5:1)" }, { value: "3", label: "Intensive (3:1)" }] }',
    '{ name: "classHoursPerCredit", label: "Class Hours Per Credit", type: "number", min: 0.5, max: 2, step: 0.5, defaultValue: 1 }',
    '{ name: "studyDays", label: "Study Days Per Week", type: "number", min: 3, max: 7, step: 1, defaultValue: 6 }'
  ],
  `(inputs) => {
    const creditHours = inputs.creditHours as number;
    const studyRatio = inputs.studyRatio as number;
    const classHoursPerCredit = inputs.classHoursPerCredit as number;
    const studyDays = inputs.studyDays as number;
    const weeklyClassHours = creditHours * classHoursPerCredit;
    const weeklyStudyHours = creditHours * studyRatio;
    const totalWeeklyHours = weeklyClassHours + weeklyStudyHours;
    const studyHoursPerDay = weeklyStudyHours / studyDays;
    return {
      primary: { label: "Weekly Study Hours", value: formatNumber(weeklyStudyHours) + " hrs" },
      details: [
        { label: "Weekly Class Hours", value: formatNumber(weeklyClassHours) + " hrs" },
        { label: "Total Academic Hours", value: formatNumber(totalWeeklyHours) + " hrs" },
        { label: "Study Hours Per Day", value: formatNumber(studyHoursPerDay) + " hrs" },
        { label: "Free Hours Per Week", value: formatNumber(168 - totalWeeklyHours - 56) + " hrs" }
      ]
    };
  }`,
  [
    { q: "How many hours should I study per credit hour?", a: "The general rule is 2 to 3 hours of study for each credit hour per week." },
    { q: "How many hours per week should a college student study?", a: "A full-time student taking 15 credits should study 30 to 45 hours per week." }
  ],
  "Weekly Study Hours = Credit Hours x Study Ratio",
  ["gpa-calculator", "tutoring-cost-calculator", "classroom-size-calculator"]
);

add(
  "gpa-calculator",
  "GPA Calculator",
  "Calculate your GPA from individual course grades and credit hours.",
  "Math",
  "math",
  "+",
  ["gpa", "grade point average", "grades", "college", "academic"],
  [
    '{ name: "grade1", label: "Course 1 Grade", type: "select", options: [{ value: "4.0", label: "A (4.0)" }, { value: "3.7", label: "A- (3.7)" }, { value: "3.3", label: "B+ (3.3)" }, { value: "3.0", label: "B (3.0)" }, { value: "2.7", label: "B- (2.7)" }, { value: "2.3", label: "C+ (2.3)" }, { value: "2.0", label: "C (2.0)" }, { value: "1.0", label: "D (1.0)" }, { value: "0", label: "F (0.0)" }] }',
    '{ name: "credits1", label: "Course 1 Credits", type: "number", min: 1, max: 6, step: 1, defaultValue: 3 }',
    '{ name: "grade2", label: "Course 2 Grade", type: "select", options: [{ value: "4.0", label: "A (4.0)" }, { value: "3.7", label: "A- (3.7)" }, { value: "3.3", label: "B+ (3.3)" }, { value: "3.0", label: "B (3.0)" }, { value: "2.7", label: "B- (2.7)" }, { value: "2.3", label: "C+ (2.3)" }, { value: "2.0", label: "C (2.0)" }, { value: "1.0", label: "D (1.0)" }, { value: "0", label: "F (0.0)" }] }',
    '{ name: "credits2", label: "Course 2 Credits", type: "number", min: 1, max: 6, step: 1, defaultValue: 3 }',
    '{ name: "grade3", label: "Course 3 Grade", type: "select", options: [{ value: "4.0", label: "A (4.0)" }, { value: "3.7", label: "A- (3.7)" }, { value: "3.3", label: "B+ (3.3)" }, { value: "3.0", label: "B (3.0)" }, { value: "2.7", label: "B- (2.7)" }, { value: "2.3", label: "C+ (2.3)" }, { value: "2.0", label: "C (2.0)" }, { value: "1.0", label: "D (1.0)" }, { value: "0", label: "F (0.0)" }] }',
    '{ name: "credits3", label: "Course 3 Credits", type: "number", min: 1, max: 6, step: 1, defaultValue: 4 }',
    '{ name: "grade4", label: "Course 4 Grade", type: "select", options: [{ value: "4.0", label: "A (4.0)" }, { value: "3.7", label: "A- (3.7)" }, { value: "3.3", label: "B+ (3.3)" }, { value: "3.0", label: "B (3.0)" }, { value: "2.7", label: "B- (2.7)" }, { value: "2.3", label: "C+ (2.3)" }, { value: "2.0", label: "C (2.0)" }, { value: "1.0", label: "D (1.0)" }, { value: "0", label: "F (0.0)" }] }',
    '{ name: "credits4", label: "Course 4 Credits", type: "number", min: 1, max: 6, step: 1, defaultValue: 3 }'
  ],
  `(inputs) => {
    const grade1 = inputs.grade1 as number;
    const credits1 = inputs.credits1 as number;
    const grade2 = inputs.grade2 as number;
    const credits2 = inputs.credits2 as number;
    const grade3 = inputs.grade3 as number;
    const credits3 = inputs.credits3 as number;
    const grade4 = inputs.grade4 as number;
    const credits4 = inputs.credits4 as number;
    const totalQualityPoints = (grade1 * credits1) + (grade2 * credits2) + (grade3 * credits3) + (grade4 * credits4);
    const totalCredits = credits1 + credits2 + credits3 + credits4;
    const gpa = totalQualityPoints / totalCredits;
    return {
      primary: { label: "GPA", value: formatNumber(gpa) },
      details: [
        { label: "Total Quality Points", value: formatNumber(totalQualityPoints) },
        { label: "Total Credits", value: formatNumber(totalCredits) },
        { label: "Letter Grade Equivalent", value: gpa >= 3.7 ? "A" : gpa >= 3.3 ? "A-/B+" : gpa >= 2.7 ? "B" : gpa >= 2.0 ? "C" : "Below C" },
        { label: "Dean's List Eligible", value: gpa >= 3.5 ? "Yes" : "No" }
      ]
    };
  }`,
  [
    { q: "How is GPA calculated?", a: "GPA equals total quality points divided by total credit hours attempted." },
    { q: "What GPA do you need for the Dean's List?", a: "Most schools require a GPA of 3.5 or higher for Dean's List recognition." }
  ],
  "GPA = Sum of (Grade Points x Credits) / Total Credits",
  ["class-rank-percentile-calculator", "study-hours-calculator", "sat-score-calculator"]
);

add(
  "class-rank-percentile-calculator",
  "Class Rank Percentile Calculator",
  "Calculate your class rank percentile from rank and class size.",
  "Math",
  "math",
  "+",
  ["class rank", "percentile", "standing", "school", "ranking"],
  [
    '{ name: "classRank", label: "Your Class Rank", type: "number", min: 1, max: 2000, step: 1, defaultValue: 25 }',
    '{ name: "classSize", label: "Total Class Size", type: "number", min: 10, max: 2000, step: 1, defaultValue: 300 }',
    '{ name: "method", label: "Calculation Method", type: "select", options: [{ value: "1", label: "Standard (rank/size)" }, { value: "2", label: "Adjusted ((size-rank)/size)" }] }'
  ],
  `(inputs) => {
    const classRank = inputs.classRank as number;
    const classSize = inputs.classSize as number;
    const method = inputs.method as number;
    if (classRank > classSize) return null;
    const percentile = method === 1 ? ((classSize - classRank) / classSize) * 100 : ((classSize - classRank + 1) / classSize) * 100;
    const topPercent = (classRank / classSize) * 100;
    const quartile = topPercent <= 25 ? "1st" : topPercent <= 50 ? "2nd" : topPercent <= 75 ? "3rd" : "4th";
    return {
      primary: { label: "Percentile", value: formatNumber(percentile) + "th" },
      details: [
        { label: "Top Percentage", value: "Top " + formatNumber(topPercent) + "%" },
        { label: "Quartile", value: quartile + " Quartile" },
        { label: "Students Ranked Below", value: formatNumber(classSize - classRank) },
        { label: "Class Rank", value: classRank + " of " + classSize }
      ]
    };
  }`,
  [
    { q: "How is class rank percentile calculated?", a: "Percentile equals (class size minus rank) divided by class size, multiplied by 100." },
    { q: "What class rank is considered good?", a: "Being in the top 10% to 25% of your class is generally considered strong for college admissions." }
  ],
  "Percentile = ((Class Size - Rank) / Class Size) x 100",
  ["gpa-calculator", "sat-score-calculator", "act-to-sat-converter-calculator"]
);

add(
  "sat-score-calculator",
  "SAT Score Calculator",
  "Estimate your SAT total and section scores from raw scores.",
  "Math",
  "math",
  "+",
  ["sat", "score", "test", "college", "exam"],
  [
    '{ name: "readingRaw", label: "Reading Raw Score (0-52)", type: "number", min: 0, max: 52, step: 1, defaultValue: 40 }',
    '{ name: "writingRaw", label: "Writing Raw Score (0-44)", type: "number", min: 0, max: 44, step: 1, defaultValue: 35 }',
    '{ name: "mathNoCalc", label: "Math No Calculator Raw (0-20)", type: "number", min: 0, max: 20, step: 1, defaultValue: 15 }',
    '{ name: "mathCalc", label: "Math Calculator Raw (0-38)", type: "number", min: 0, max: 38, step: 1, defaultValue: 30 }'
  ],
  `(inputs) => {
    const readingRaw = inputs.readingRaw as number;
    const writingRaw = inputs.writingRaw as number;
    const mathNoCalc = inputs.mathNoCalc as number;
    const mathCalc = inputs.mathCalc as number;
    const readingScale = Math.round(10 + (readingRaw / 52) * 30) * 10;
    const writingScale = Math.round(10 + (writingRaw / 44) * 30) * 10;
    const evidenceBasedRW = Math.min(800, Math.max(200, readingScale + writingScale - 200));
    const mathTotal = mathNoCalc + mathCalc;
    const mathScaled = Math.min(800, Math.max(200, Math.round(200 + (mathTotal / 58) * 600)));
    const totalScore = evidenceBasedRW + mathScaled;
    return {
      primary: { label: "Estimated Total Score", value: formatNumber(totalScore) },
      details: [
        { label: "Evidence-Based Reading and Writing", value: formatNumber(evidenceBasedRW) },
        { label: "Math Score", value: formatNumber(mathScaled) },
        { label: "Math Raw Total", value: mathTotal + " / 58" },
        { label: "Score Range", value: formatNumber(totalScore - 40) + " - " + formatNumber(Math.min(1600, totalScore + 40)) }
      ]
    };
  }`,
  [
    { q: "What is a good SAT score?", a: "A score of 1200 or above is considered above average and 1400 or above is competitive." },
    { q: "How is the SAT scored?", a: "The SAT is scored on a scale of 400 to 1600 with two sections each worth 200 to 800." }
  ],
  "Total Score = Evidence-Based Reading and Writing Score + Math Score",
  ["act-to-sat-converter-calculator", "gpa-calculator", "class-rank-percentile-calculator"]
);

add(
  "act-to-sat-converter-calculator",
  "ACT to SAT Converter Calculator",
  "Convert ACT composite scores to equivalent SAT scores.",
  "Conversion",
  "conversion",
  "R",
  ["act", "sat", "conversion", "score", "college"],
  [
    '{ name: "actScore", label: "ACT Composite Score", type: "number", min: 1, max: 36, step: 1, defaultValue: 25 }',
    '{ name: "direction", label: "Conversion Direction", type: "select", options: [{ value: "1", label: "ACT to SAT" }, { value: "2", label: "SAT to ACT (enter SAT in ACT field / 44.4)" }] }'
  ],
  `(inputs) => {
    const actScore = inputs.actScore as number;
    const direction = inputs.direction as number;
    if (direction === 1) {
      const concordance = { 36: 1590, 35: 1540, 34: 1500, 33: 1460, 32: 1430, 31: 1400, 30: 1370, 29: 1340, 28: 1310, 27: 1280, 26: 1240, 25: 1210, 24: 1180, 23: 1140, 22: 1110, 21: 1080, 20: 1040, 19: 1010, 18: 970, 17: 930, 16: 890, 15: 850, 14: 800, 13: 760, 12: 710, 11: 670, 10: 630, 9: 590 };
      const rounded = Math.min(36, Math.max(9, Math.round(actScore)));
      const satScore = concordance[rounded] || 400;
      return {
        primary: { label: "Equivalent SAT Score", value: formatNumber(satScore) },
        details: [
          { label: "ACT Score", value: formatNumber(rounded) },
          { label: "SAT Range", value: formatNumber(satScore - 30) + " - " + formatNumber(satScore + 30) },
          { label: "Percentile (approx)", value: formatNumber(Math.round((rounded / 36) * 100)) + "th" },
          { label: "Competitiveness", value: satScore >= 1400 ? "Highly Competitive" : satScore >= 1200 ? "Competitive" : satScore >= 1000 ? "Average" : "Below Average" }
        ]
      };
    } else {
      const satFromAct = Math.round(actScore * 44.4);
      const estimatedAct = Math.round(satFromAct / 44.4);
      return {
        primary: { label: "Estimated Conversion", value: formatNumber(satFromAct) },
        details: [
          { label: "Input Value", value: formatNumber(actScore) },
          { label: "Estimated ACT", value: formatNumber(estimatedAct) },
          { label: "Note", value: "Use ACT to SAT mode for best results" }
        ]
      };
    }
  }`,
  [
    { q: "How do ACT and SAT scores compare?", a: "An ACT score of 30 is roughly equivalent to an SAT score of 1370." },
    { q: "Do colleges prefer SAT or ACT?", a: "Most colleges accept both tests equally and do not prefer one over the other." }
  ],
  "SAT Score = Concordance table mapping from ACT composite",
  ["sat-score-calculator", "gpa-calculator", "class-rank-percentile-calculator"]
);
add(
  "tattoo-cost-calculator",
  "Tattoo Cost Calculator",
  "Estimate tattoo price based on size, detail level, and artist rate.",
  "Finance",
  "finance",
  "$",
  ["tattoo cost", "tattoo price", "tattoo estimate", "ink cost"],
  [
    '{ name: "size", label: "Tattoo Size (sq in)", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "detail", label: "Detail Level", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "High Detail" }] }',
    '{ name: "hourlyRate", label: "Artist Hourly Rate ($)", type: "number", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "colorWork", label: "Color Work", type: "select", options: [{ value: "0", label: "Black and Grey" }, { value: "1", label: "Full Color" }] }'
  ],
  `(inputs) => {
    const size = inputs.size as number;
    const detail = parseInt(inputs.detail as string);
    const hourlyRate = inputs.hourlyRate as number;
    const colorWork = parseInt(inputs.colorWork as string);
    const hoursEstimate = (size * detail * 0.15) + (colorWork * size * 0.05);
    const totalCost = Math.max(hoursEstimate * hourlyRate, 80);
    const sessionCount = Math.ceil(hoursEstimate / 3);
    return {
      primary: { label: "Estimated Tattoo Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Estimated Hours", value: formatNumber(hoursEstimate) },
        { label: "Sessions Needed", value: formatNumber(sessionCount) },
        { label: "Cost Per Session", value: "$" + formatNumber(totalCost / Math.max(sessionCount, 1)) }
      ]
    };
  }`,
  [
    { q: "How much does a tattoo cost on average?", a: "Small tattoos start around $80 to $200. Larger pieces can cost thousands." },
    { q: "Does color cost more than black and grey?", a: "Yes, color work typically adds 20 to 40 percent more time and cost." },
    { q: "Should I tip my tattoo artist?", a: "A tip of 15 to 25 percent is customary for tattoo artists." }
  ],
  "Total Cost = max(Hours Estimate x Hourly Rate, Minimum Charge)",
  ["tattoo-tip-calculator", "tattoo-removal-cost-calculator"]
);

add(
  "tattoo-removal-cost-calculator",
  "Tattoo Removal Cost Calculator",
  "Calculate laser tattoo removal sessions and total cost.",
  "Finance",
  "finance",
  "$",
  ["tattoo removal", "laser removal", "tattoo removal cost"],
  [
    '{ name: "size", label: "Tattoo Size (sq in)", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "colors", label: "Number of Colors", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "costPerSession", label: "Cost Per Session ($)", type: "number", min: 100, max: 1000, defaultValue: 300 }',
    '{ name: "skinTone", label: "Skin Tone", type: "select", options: [{ value: "1", label: "Light" }, { value: "1.3", label: "Medium" }, { value: "1.6", label: "Dark" }] }'
  ],
  `(inputs) => {
    const size = inputs.size as number;
    const colors = inputs.colors as number;
    const costPerSession = inputs.costPerSession as number;
    const skinTone = parseFloat(inputs.skinTone as string);
    const baseSessions = Math.ceil((size * 0.3 + colors * 1.2) * skinTone);
    const sessions = Math.max(baseSessions, 3);
    const totalCost = sessions * costPerSession;
    return {
      primary: { label: "Total Removal Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Sessions Needed", value: formatNumber(sessions) },
        { label: "Cost Per Session", value: "$" + formatNumber(costPerSession) },
        { label: "Treatment Duration", value: formatNumber(sessions * 6) + " weeks minimum" }
      ]
    };
  }`,
  [
    { q: "How many sessions does tattoo removal take?", a: "Most tattoos require 6 to 12 sessions spaced 6 to 8 weeks apart." },
    { q: "Does tattoo removal hurt?", a: "It can be uncomfortable. Many clinics offer numbing cream or cooling." },
    { q: "Can all tattoo colors be removed?", a: "Black responds best. Greens and blues can be more difficult to remove." }
  ],
  "Sessions = max((Size x 0.3 + Colors x 1.2) x Skin Tone Factor, 3)",
  ["tattoo-cost-calculator", "tattoo-tip-calculator"]
);

add(
  "tattoo-tip-calculator",
  "Tattoo Tip Calculator",
  "Calculate an appropriate tip amount for your tattoo artist.",
  "Finance",
  "finance",
  "$",
  ["tattoo tip", "tip tattoo artist", "tattoo gratuity"],
  [
    '{ name: "tattooCost", label: "Tattoo Cost ($)", type: "number", min: 50, max: 10000, defaultValue: 300 }',
    '{ name: "tipPercent", label: "Tip Percentage", type: "select", options: [{ value: "15", label: "15%" }, { value: "20", label: "20%" }, { value: "25", label: "25%" }, { value: "30", label: "30%" }] }',
    '{ name: "sessions", label: "Number of Sessions", type: "number", min: 1, max: 20, defaultValue: 1 }'
  ],
  `(inputs) => {
    const tattooCost = inputs.tattooCost as number;
    const tipPercent = parseInt(inputs.tipPercent as string);
    const sessions = inputs.sessions as number;
    const tipAmount = tattooCost * (tipPercent / 100);
    const tipPerSession = tipAmount / sessions;
    const totalWithTip = tattooCost + tipAmount;
    return {
      primary: { label: "Total Tip Amount", value: "$" + formatNumber(tipAmount) },
      details: [
        { label: "Tip Per Session", value: "$" + formatNumber(tipPerSession) },
        { label: "Total With Tip", value: "$" + formatNumber(totalWithTip) },
        { label: "Tip Percentage", value: formatNumber(tipPercent) + "%" }
      ]
    };
  }`,
  [
    { q: "How much should you tip a tattoo artist?", a: "15 to 25 percent is standard. Tip more for exceptional work or long sessions." },
    { q: "Do you tip on the full tattoo price?", a: "Yes, tip on the total cost of the tattoo service before any discounts." },
    { q: "Should you tip per session or at the end?", a: "Tipping after each session is preferred by most tattoo artists." }
  ],
  "Tip Amount = Tattoo Cost x (Tip Percentage / 100)",
  ["tattoo-cost-calculator", "tattoo-removal-cost-calculator"]
);

add(
  "hair-color-cost-calculator",
  "Hair Color Cost Calculator",
  "Estimate total cost for hair coloring services at a salon.",
  "Finance",
  "finance",
  "$",
  ["hair color cost", "hair dye price", "salon color cost"],
  [
    '{ name: "serviceType", label: "Color Service", type: "select", options: [{ value: "75", label: "Single Process" }, { value: "150", label: "Highlights" }, { value: "200", label: "Balayage" }, { value: "250", label: "Full Color Correction" }] }',
    '{ name: "hairLength", label: "Hair Length", type: "select", options: [{ value: "1", label: "Short" }, { value: "1.2", label: "Medium" }, { value: "1.5", label: "Long" }] }',
    '{ name: "toner", label: "Toner Add-On ($)", type: "number", min: 0, max: 100, defaultValue: 30 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const serviceType = parseInt(inputs.serviceType as string);
    const hairLength = parseFloat(inputs.hairLength as string);
    const toner = inputs.toner as number;
    const tip = inputs.tip as number;
    const serviceTotal = serviceType * hairLength + toner;
    const tipAmount = serviceTotal * (tip / 100);
    const grandTotal = serviceTotal + tipAmount;
    return {
      primary: { label: "Total Hair Color Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Service Cost", value: "$" + formatNumber(serviceType * hairLength) },
        { label: "Toner Add-On", value: "$" + formatNumber(toner) },
        { label: "Tip Amount", value: "$" + formatNumber(tipAmount) }
      ]
    };
  }`,
  [
    { q: "How much does hair coloring cost at a salon?", a: "Prices range from $75 for single process to $300 or more for balayage." },
    { q: "Does hair length affect the price?", a: "Yes, longer hair requires more product and time, increasing the cost." },
    { q: "How often should you color your hair?", a: "Most color services need a touch-up every 4 to 8 weeks." }
  ],
  "Total = (Service Base x Length Multiplier + Toner) x (1 + Tip%)",
  ["haircut-frequency-calculator", "hair-extension-cost-calculator"]
);

add(
  "haircut-frequency-calculator",
  "Haircut Frequency Calculator",
  "Determine your haircut schedule and estimate annual cost.",
  "Finance",
  "finance",
  "$",
  ["haircut frequency", "haircut schedule", "annual haircut cost"],
  [
    '{ name: "hairGrowthRate", label: "Growth Rate", type: "select", options: [{ value: "4", label: "Slow (4 weeks)" }, { value: "6", label: "Average (6 weeks)" }, { value: "8", label: "Fast (8 weeks)" }] }',
    '{ name: "haircutCost", label: "Haircut Cost ($)", type: "number", min: 10, max: 200, defaultValue: 40 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }',
    '{ name: "products", label: "Product Purchase Per Visit ($)", type: "number", min: 0, max: 100, defaultValue: 0 }'
  ],
  `(inputs) => {
    const weeks = parseInt(inputs.hairGrowthRate as string);
    const haircutCost = inputs.haircutCost as number;
    const tip = inputs.tip as number;
    const products = inputs.products as number;
    const visitsPerYear = Math.round(52 / weeks);
    const costPerVisit = haircutCost + haircutCost * (tip / 100) + products;
    const annualCost = visitsPerYear * costPerVisit;
    return {
      primary: { label: "Annual Haircut Cost", value: "$" + formatNumber(annualCost) },
      details: [
        { label: "Visits Per Year", value: formatNumber(visitsPerYear) },
        { label: "Cost Per Visit", value: "$" + formatNumber(costPerVisit) },
        { label: "Weeks Between Cuts", value: formatNumber(weeks) }
      ]
    };
  }`,
  [
    { q: "How often should you get a haircut?", a: "Every 4 to 8 weeks depending on hair type and desired style." },
    { q: "How much does the average haircut cost?", a: "Average men haircuts cost $20 to $40. Women haircuts cost $40 to $80." },
    { q: "Does frequent cutting make hair grow faster?", a: "No, cutting does not affect growth rate. It does prevent split ends." }
  ],
  "Annual Cost = (52 / Weeks Between Cuts) x Cost Per Visit",
  ["hair-color-cost-calculator", "hair-extension-cost-calculator"]
);

add(
  "hair-extension-cost-calculator",
  "Hair Extension Cost Calculator",
  "Calculate the cost of hair extension installation and upkeep.",
  "Finance",
  "finance",
  "$",
  ["hair extension cost", "extension price", "hair extension pricing"],
  [
    '{ name: "method", label: "Extension Method", type: "select", options: [{ value: "200", label: "Clip-In" }, { value: "600", label: "Tape-In" }, { value: "1000", label: "Fusion/Bonded" }, { value: "1500", label: "Hand-Tied Weft" }] }',
    '{ name: "packs", label: "Number of Packs", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "installFee", label: "Installation Fee ($)", type: "number", min: 0, max: 500, defaultValue: 150 }',
    '{ name: "maintenanceVisits", label: "Maintenance Visits Per Year", type: "number", min: 0, max: 12, defaultValue: 4 }',
    '{ name: "maintenanceCost", label: "Maintenance Cost Per Visit ($)", type: "number", min: 0, max: 300, defaultValue: 100 }'
  ],
  `(inputs) => {
    const method = parseInt(inputs.method as string);
    const packs = inputs.packs as number;
    const installFee = inputs.installFee as number;
    const maintenanceVisits = inputs.maintenanceVisits as number;
    const maintenanceCost = inputs.maintenanceCost as number;
    const hairCost = method * packs;
    const initialTotal = hairCost + installFee;
    const annualMaintenance = maintenanceVisits * maintenanceCost;
    const firstYearTotal = initialTotal + annualMaintenance;
    return {
      primary: { label: "First Year Total Cost", value: "$" + formatNumber(firstYearTotal) },
      details: [
        { label: "Hair Cost", value: "$" + formatNumber(hairCost) },
        { label: "Installation Fee", value: "$" + formatNumber(installFee) },
        { label: "Annual Maintenance", value: "$" + formatNumber(annualMaintenance) }
      ]
    };
  }`,
  [
    { q: "How much do hair extensions cost?", a: "Clip-ins start at $200. Professional methods range from $600 to $2000." },
    { q: "How long do hair extensions last?", a: "Clip-ins last 6 to 12 months. Bonded extensions last 3 to 6 months." },
    { q: "Do extensions damage natural hair?", a: "Proper installation and maintenance minimize damage to natural hair." }
  ],
  "First Year = (Method Price x Packs) + Install Fee + (Visits x Maintenance Cost)",
  ["hair-color-cost-calculator", "haircut-frequency-calculator"]
);

add(
  "nail-salon-cost-calculator",
  "Nail Salon Cost Calculator",
  "Estimate manicure and pedicure service costs at a salon.",
  "Finance",
  "finance",
  "$",
  ["nail salon cost", "manicure cost", "pedicure cost", "nail pricing"],
  [
    '{ name: "serviceType", label: "Service Type", type: "select", options: [{ value: "25", label: "Basic Manicure" }, { value: "40", label: "Gel Manicure" }, { value: "35", label: "Basic Pedicure" }, { value: "55", label: "Gel Pedicure" }, { value: "70", label: "Mani + Pedi Combo" }] }',
    '{ name: "nailArt", label: "Nail Art Add-On ($)", type: "number", min: 0, max: 100, defaultValue: 0 }',
    '{ name: "frequency", label: "Visits Per Month", type: "number", min: 1, max: 4, defaultValue: 2 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const serviceType = parseInt(inputs.serviceType as string);
    const nailArt = inputs.nailArt as number;
    const frequency = inputs.frequency as number;
    const tip = inputs.tip as number;
    const perVisit = serviceType + nailArt;
    const tipAmount = perVisit * (tip / 100);
    const totalPerVisit = perVisit + tipAmount;
    const monthlyCost = totalPerVisit * frequency;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Monthly Nail Cost", value: "$" + formatNumber(monthlyCost) },
      details: [
        { label: "Cost Per Visit", value: "$" + formatNumber(totalPerVisit) },
        { label: "Tip Per Visit", value: "$" + formatNumber(tipAmount) },
        { label: "Annual Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  }`,
  [
    { q: "How much does a manicure cost?", a: "Basic manicures cost $20 to $30. Gel manicures cost $35 to $60." },
    { q: "How often should you get your nails done?", a: "Gel nails last 2 to 3 weeks. Regular polish lasts about 1 week." },
    { q: "Is gel or acrylic more expensive?", a: "Acrylic nails typically cost more due to additional application time." }
  ],
  "Monthly Cost = (Service + Art + Tip) x Visits Per Month",
  ["eyelash-extension-cost-calculator", "spa-day-cost-calculator"]
);

add(
  "eyelash-extension-cost-calculator",
  "Eyelash Extension Cost Calculator",
  "Calculate lash extension pricing including fills and upkeep.",
  "Finance",
  "finance",
  "$",
  ["eyelash extension cost", "lash extension price", "lash fill cost"],
  [
    '{ name: "fullSetCost", label: "Full Set Cost ($)", type: "number", min: 100, max: 500, defaultValue: 200 }',
    '{ name: "fillCost", label: "Fill Cost ($)", type: "number", min: 50, max: 200, defaultValue: 75 }',
    '{ name: "fillFrequency", label: "Fills Per Month", type: "number", min: 1, max: 4, defaultValue: 2 }',
    '{ name: "fullSetFrequency", label: "Full Sets Per Year", type: "number", min: 1, max: 6, defaultValue: 3 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const fullSetCost = inputs.fullSetCost as number;
    const fillCost = inputs.fillCost as number;
    const fillFrequency = inputs.fillFrequency as number;
    const fullSetFrequency = inputs.fullSetFrequency as number;
    const tip = inputs.tip as number;
    const annualFills = fillFrequency * 12 - fullSetFrequency;
    const subtotal = (fullSetCost * fullSetFrequency) + (fillCost * annualFills);
    const tipTotal = subtotal * (tip / 100);
    const annualTotal = subtotal + tipTotal;
    return {
      primary: { label: "Annual Lash Cost", value: "$" + formatNumber(annualTotal) },
      details: [
        { label: "Full Sets Per Year", value: formatNumber(fullSetFrequency) },
        { label: "Fill Appointments Per Year", value: formatNumber(annualFills) },
        { label: "Monthly Average", value: "$" + formatNumber(annualTotal / 12) }
      ]
    };
  }`,
  [
    { q: "How much do eyelash extensions cost?", a: "Full sets range from $150 to $400. Fills cost $50 to $150 each." },
    { q: "How often do lash extensions need fills?", a: "Fills are needed every 2 to 3 weeks to maintain fullness." },
    { q: "Do lash extensions damage natural lashes?", a: "Properly applied extensions should not damage natural lashes." }
  ],
  "Annual = (Full Set Cost x Sets) + (Fill Cost x Fills) + Tips",
  ["nail-salon-cost-calculator", "facial-treatment-cost-calculator"]
);

add(
  "facial-treatment-cost-calculator",
  "Facial Treatment Cost Calculator",
  "Estimate the cost of professional facial treatments.",
  "Finance",
  "finance",
  "$",
  ["facial cost", "facial treatment price", "skin treatment cost"],
  [
    '{ name: "facialType", label: "Facial Type", type: "select", options: [{ value: "80", label: "Basic Facial" }, { value: "150", label: "HydraFacial" }, { value: "200", label: "LED Light Therapy" }, { value: "250", label: "Microcurrent Facial" }] }',
    '{ name: "addOns", label: "Add-On Treatments ($)", type: "number", min: 0, max: 200, defaultValue: 0 }',
    '{ name: "visitsPerYear", label: "Visits Per Year", type: "number", min: 1, max: 24, defaultValue: 6 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const facialType = parseInt(inputs.facialType as string);
    const addOns = inputs.addOns as number;
    const visitsPerYear = inputs.visitsPerYear as number;
    const tip = inputs.tip as number;
    const perVisit = facialType + addOns;
    const tipAmount = perVisit * (tip / 100);
    const totalPerVisit = perVisit + tipAmount;
    const annualCost = totalPerVisit * visitsPerYear;
    return {
      primary: { label: "Annual Facial Cost", value: "$" + formatNumber(annualCost) },
      details: [
        { label: "Cost Per Visit", value: "$" + formatNumber(totalPerVisit) },
        { label: "Tip Per Visit", value: "$" + formatNumber(tipAmount) },
        { label: "Monthly Average", value: "$" + formatNumber(annualCost / 12) }
      ]
    };
  }`,
  [
    { q: "How much does a facial cost?", a: "Basic facials cost $60 to $100. Specialized facials cost $150 to $300." },
    { q: "How often should you get a facial?", a: "Every 4 to 6 weeks is recommended for most skin types." },
    { q: "Are expensive facials worth it?", a: "Advanced treatments offer deeper results but basic facials also benefit skin." }
  ],
  "Annual Cost = (Facial Price + Add-Ons) x (1 + Tip%) x Visits",
  ["spa-day-cost-calculator", "chemical-peel-cost-calculator"]
);

add(
  "spa-day-cost-calculator",
  "Spa Day Cost Calculator",
  "Calculate the total cost of a full spa day package.",
  "Finance",
  "finance",
  "$",
  ["spa day cost", "spa package price", "spa visit cost"],
  [
    '{ name: "massage", label: "Massage ($)", type: "number", min: 0, max: 500, defaultValue: 120 }',
    '{ name: "facial", label: "Facial ($)", type: "number", min: 0, max: 400, defaultValue: 100 }',
    '{ name: "bodyTreatment", label: "Body Treatment ($)", type: "number", min: 0, max: 300, defaultValue: 80 }',
    '{ name: "nailService", label: "Nail Service ($)", type: "number", min: 0, max: 200, defaultValue: 60 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }',
    '{ name: "guests", label: "Number of Guests", type: "number", min: 1, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const massage = inputs.massage as number;
    const facial = inputs.facial as number;
    const bodyTreatment = inputs.bodyTreatment as number;
    const nailService = inputs.nailService as number;
    const tip = inputs.tip as number;
    const guests = inputs.guests as number;
    const perPersonSubtotal = massage + facial + bodyTreatment + nailService;
    const tipAmount = perPersonSubtotal * (tip / 100);
    const perPersonTotal = perPersonSubtotal + tipAmount;
    const grandTotal = perPersonTotal * guests;
    return {
      primary: { label: "Total Spa Day Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Per Person Subtotal", value: "$" + formatNumber(perPersonSubtotal) },
        { label: "Tip Per Person", value: "$" + formatNumber(tipAmount) },
        { label: "Per Person Total", value: "$" + formatNumber(perPersonTotal) }
      ]
    };
  }`,
  [
    { q: "How much does a spa day cost?", a: "A full spa day typically costs $200 to $500 per person." },
    { q: "What is included in a spa day?", a: "Packages usually include a massage, facial, and access to amenities." },
    { q: "How much should you tip at a spa?", a: "15 to 20 percent per service is customary at most spas." }
  ],
  "Total = (Massage + Facial + Body + Nails) x (1 + Tip%) x Guests",
  ["massage-cost-calculator", "facial-treatment-cost-calculator"]
);

add(
  "massage-cost-calculator",
  "Massage Cost Calculator",
  "Estimate massage session cost based on type and duration.",
  "Finance",
  "finance",
  "$",
  ["massage cost", "massage price", "massage session cost"],
  [
    '{ name: "massageType", label: "Massage Type", type: "select", options: [{ value: "80", label: "Swedish" }, { value: "100", label: "Deep Tissue" }, { value: "120", label: "Hot Stone" }, { value: "140", label: "Sports Massage" }] }',
    '{ name: "duration", label: "Duration", type: "select", options: [{ value: "0.75", label: "30 Minutes" }, { value: "1", label: "60 Minutes" }, { value: "1.4", label: "90 Minutes" }, { value: "1.75", label: "120 Minutes" }] }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }',
    '{ name: "visitsPerMonth", label: "Visits Per Month", type: "number", min: 1, max: 8, defaultValue: 2 }'
  ],
  `(inputs) => {
    const massageType = parseInt(inputs.massageType as string);
    const duration = parseFloat(inputs.duration as string);
    const tip = inputs.tip as number;
    const visitsPerMonth = inputs.visitsPerMonth as number;
    const sessionCost = massageType * duration;
    const tipAmount = sessionCost * (tip / 100);
    const totalPerVisit = sessionCost + tipAmount;
    const monthlyCost = totalPerVisit * visitsPerMonth;
    return {
      primary: { label: "Monthly Massage Cost", value: "$" + formatNumber(monthlyCost) },
      details: [
        { label: "Per Session", value: "$" + formatNumber(sessionCost) },
        { label: "Tip Per Session", value: "$" + formatNumber(tipAmount) },
        { label: "Annual Cost", value: "$" + formatNumber(monthlyCost * 12) }
      ]
    };
  }`,
  [
    { q: "How much does a massage cost?", a: "A 60-minute massage typically costs $60 to $120 depending on type." },
    { q: "How often should you get a massage?", a: "Once or twice per month is beneficial for stress relief and recovery." },
    { q: "Is deep tissue more expensive?", a: "Deep tissue massages usually cost $10 to $30 more than Swedish massage." }
  ],
  "Monthly = (Type Base x Duration Multiplier) x (1 + Tip%) x Visits",
  ["spa-day-cost-calculator", "waxing-cost-calculator"]
);

add(
  "waxing-cost-calculator",
  "Waxing Cost Calculator",
  "Calculate waxing service pricing for various body areas.",
  "Finance",
  "finance",
  "$",
  ["waxing cost", "wax service price", "body waxing cost"],
  [
    '{ name: "area", label: "Body Area", type: "select", options: [{ value: "15", label: "Eyebrow" }, { value: "25", label: "Upper Lip" }, { value: "50", label: "Underarm" }, { value: "65", label: "Half Leg" }, { value: "90", label: "Full Leg" }, { value: "70", label: "Brazilian" }] }',
    '{ name: "additionalAreas", label: "Additional Areas ($)", type: "number", min: 0, max: 300, defaultValue: 0 }',
    '{ name: "frequency", label: "Visits Per Year", type: "number", min: 1, max: 24, defaultValue: 8 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const area = parseInt(inputs.area as string);
    const additionalAreas = inputs.additionalAreas as number;
    const frequency = inputs.frequency as number;
    const tip = inputs.tip as number;
    const perVisit = area + additionalAreas;
    const tipAmount = perVisit * (tip / 100);
    const totalPerVisit = perVisit + tipAmount;
    const annualCost = totalPerVisit * frequency;
    return {
      primary: { label: "Annual Waxing Cost", value: "$" + formatNumber(annualCost) },
      details: [
        { label: "Cost Per Visit", value: "$" + formatNumber(totalPerVisit) },
        { label: "Tip Per Visit", value: "$" + formatNumber(tipAmount) },
        { label: "Monthly Average", value: "$" + formatNumber(annualCost / 12) }
      ]
    };
  }`,
  [
    { q: "How much does a Brazilian wax cost?", a: "Brazilian waxing typically costs $50 to $80 per session." },
    { q: "How often should you get waxed?", a: "Every 4 to 6 weeks is recommended for most body areas." },
    { q: "Is waxing cheaper than laser hair removal?", a: "Per session waxing is cheaper, but laser saves money long term." }
  ],
  "Annual = (Area Cost + Additional Areas) x (1 + Tip%) x Frequency",
  ["laser-hair-removal-calculator", "spa-day-cost-calculator"]
);

add(
  "botox-cost-calculator",
  "Botox Cost Calculator",
  "Estimate Botox treatment cost based on units needed.",
  "Finance",
  "finance",
  "$",
  ["botox cost", "botox price", "botox units cost"],
  [
    '{ name: "area", label: "Treatment Area", type: "select", options: [{ value: "20", label: "Forehead (20 units)" }, { value: "24", label: "Crow Feet (24 units)" }, { value: "20", label: "Frown Lines (20 units)" }, { value: "40", label: "Multiple Areas (40 units)" }] }',
    '{ name: "costPerUnit", label: "Cost Per Unit ($)", type: "number", min: 8, max: 25, defaultValue: 14 }',
    '{ name: "treatmentsPerYear", label: "Treatments Per Year", type: "number", min: 1, max: 6, defaultValue: 3 }'
  ],
  `(inputs) => {
    const units = parseInt(inputs.area as string);
    const costPerUnit = inputs.costPerUnit as number;
    const treatmentsPerYear = inputs.treatmentsPerYear as number;
    const perTreatment = units * costPerUnit;
    const annualCost = perTreatment * treatmentsPerYear;
    return {
      primary: { label: "Cost Per Treatment", value: "$" + formatNumber(perTreatment) },
      details: [
        { label: "Units Per Treatment", value: formatNumber(units) },
        { label: "Cost Per Unit", value: "$" + formatNumber(costPerUnit) },
        { label: "Annual Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  }`,
  [
    { q: "How much does Botox cost?", a: "Botox costs $10 to $20 per unit, with treatments using 20 to 60 units." },
    { q: "How often do you need Botox?", a: "Results last 3 to 4 months, so most people need 3 to 4 treatments per year." },
    { q: "How many units of Botox do I need?", a: "Forehead lines need about 20 units. Full treatment may require 40 to 60." }
  ],
  "Treatment Cost = Units x Cost Per Unit",
  ["dermal-filler-cost-calculator", "cosmetic-surgery-cost-calculator"]
);

add(
  "dermal-filler-cost-calculator",
  "Dermal Filler Cost Calculator",
  "Calculate dermal filler cost based on syringes and area.",
  "Finance",
  "finance",
  "$",
  ["dermal filler cost", "filler price", "lip filler cost"],
  [
    '{ name: "area", label: "Treatment Area", type: "select", options: [{ value: "1", label: "Lips (1 syringe)" }, { value: "2", label: "Cheeks (2 syringes)" }, { value: "1", label: "Nasolabial Folds (1 syringe)" }, { value: "3", label: "Full Face (3 syringes)" }] }',
    '{ name: "costPerSyringe", label: "Cost Per Syringe ($)", type: "number", min: 400, max: 1200, defaultValue: 650 }',
    '{ name: "touchUps", label: "Touch-Ups Per Year", type: "number", min: 0, max: 4, defaultValue: 1 }',
    '{ name: "touchUpSyringes", label: "Syringes Per Touch-Up", type: "number", min: 1, max: 4, defaultValue: 1 }'
  ],
  `(inputs) => {
    const syringes = parseInt(inputs.area as string);
    const costPerSyringe = inputs.costPerSyringe as number;
    const touchUps = inputs.touchUps as number;
    const touchUpSyringes = inputs.touchUpSyringes as number;
    const initialCost = syringes * costPerSyringe;
    const touchUpCost = touchUps * touchUpSyringes * costPerSyringe;
    const annualCost = initialCost + touchUpCost;
    return {
      primary: { label: "Initial Treatment Cost", value: "$" + formatNumber(initialCost) },
      details: [
        { label: "Syringes Needed", value: formatNumber(syringes) },
        { label: "Touch-Up Cost", value: "$" + formatNumber(touchUpCost) },
        { label: "Annual Total", value: "$" + formatNumber(annualCost) }
      ]
    };
  }`,
  [
    { q: "How much do dermal fillers cost?", a: "Fillers cost $500 to $1000 per syringe depending on the brand and area." },
    { q: "How long do fillers last?", a: "Most fillers last 6 to 18 months depending on the type and location." },
    { q: "How many syringes of filler do I need?", a: "Lips need 1 syringe. Cheeks need 1 to 2 syringes per side." }
  ],
  "Annual = (Initial Syringes x Cost) + (Touch-Ups x Syringes x Cost)",
  ["botox-cost-calculator", "cosmetic-surgery-cost-calculator"]
);

add(
  "microblading-cost-calculator",
  "Microblading Cost Calculator",
  "Estimate microblading eyebrow procedure cost and touch-ups.",
  "Finance",
  "finance",
  "$",
  ["microblading cost", "eyebrow microblading price", "brow tattoo cost"],
  [
    '{ name: "initialCost", label: "Initial Procedure Cost ($)", type: "number", min: 200, max: 1000, defaultValue: 450 }',
    '{ name: "touchUpCost", label: "Touch-Up Cost ($)", type: "number", min: 100, max: 500, defaultValue: 150 }',
    '{ name: "touchUpsFirstYear", label: "Touch-Ups in First Year", type: "number", min: 0, max: 3, defaultValue: 1 }',
    '{ name: "yearsToMaintain", label: "Years to Maintain", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "annualTouchUps", label: "Annual Touch-Ups After Year 1", type: "number", min: 0, max: 2, defaultValue: 1 }'
  ],
  `(inputs) => {
    const initialCost = inputs.initialCost as number;
    const touchUpCost = inputs.touchUpCost as number;
    const touchUpsFirstYear = inputs.touchUpsFirstYear as number;
    const yearsToMaintain = inputs.yearsToMaintain as number;
    const annualTouchUps = inputs.annualTouchUps as number;
    const firstYearCost = initialCost + (touchUpsFirstYear * touchUpCost);
    const subsequentYearsCost = (yearsToMaintain - 1) * annualTouchUps * touchUpCost;
    const totalCost = firstYearCost + subsequentYearsCost;
    const costPerYear = totalCost / yearsToMaintain;
    return {
      primary: { label: "Total Microblading Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "First Year Cost", value: "$" + formatNumber(firstYearCost) },
        { label: "Subsequent Years Cost", value: "$" + formatNumber(subsequentYearsCost) },
        { label: "Average Cost Per Year", value: "$" + formatNumber(costPerYear) }
      ]
    };
  }`,
  [
    { q: "How much does microblading cost?", a: "Initial microblading costs $300 to $800 depending on the artist and location." },
    { q: "How long does microblading last?", a: "Results last 1 to 3 years with periodic touch-ups to maintain shape." },
    { q: "Does microblading need touch-ups?", a: "Yes, a touch-up 6 to 8 weeks after the initial session is recommended." }
  ],
  "Total = Initial Cost + (First Year Touch-Ups x Cost) + (Years - 1) x Annual Touch-Ups x Cost",
  ["botox-cost-calculator", "eyelash-extension-cost-calculator"]
);

add(
  "chemical-peel-cost-calculator",
  "Chemical Peel Cost Calculator",
  "Calculate chemical peel treatment cost and series pricing.",
  "Finance",
  "finance",
  "$",
  ["chemical peel cost", "skin peel price", "chemical peel pricing"],
  [
    '{ name: "peelType", label: "Peel Type", type: "select", options: [{ value: "100", label: "Light/Superficial" }, { value: "250", label: "Medium Depth" }, { value: "500", label: "Deep Peel" }] }',
    '{ name: "sessionsInSeries", label: "Sessions in Series", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "seriesDiscount", label: "Series Discount (%)", type: "number", min: 0, max: 30, defaultValue: 10 }',
    '{ name: "consultFee", label: "Consultation Fee ($)", type: "number", min: 0, max: 200, defaultValue: 50 }'
  ],
  `(inputs) => {
    const peelType = parseInt(inputs.peelType as string);
    const sessionsInSeries = inputs.sessionsInSeries as number;
    const seriesDiscount = inputs.seriesDiscount as number;
    const consultFee = inputs.consultFee as number;
    const fullPrice = peelType * sessionsInSeries;
    const discountAmount = fullPrice * (seriesDiscount / 100);
    const seriesPrice = fullPrice - discountAmount + consultFee;
    const perSession = (seriesPrice - consultFee) / sessionsInSeries;
    return {
      primary: { label: "Total Series Cost", value: "$" + formatNumber(seriesPrice) },
      details: [
        { label: "Full Price Before Discount", value: "$" + formatNumber(fullPrice) },
        { label: "Discount Savings", value: "$" + formatNumber(discountAmount) },
        { label: "Effective Cost Per Session", value: "$" + formatNumber(perSession) }
      ]
    };
  }`,
  [
    { q: "How much does a chemical peel cost?", a: "Light peels cost $100 to $200. Deep peels can cost $500 or more." },
    { q: "How many chemical peels do I need?", a: "A series of 3 to 6 light peels is common. Deep peels may need only one." },
    { q: "How often can you get a chemical peel?", a: "Light peels every 2 to 4 weeks. Deep peels only once every few years." }
  ],
  "Series Cost = (Peel Price x Sessions) x (1 - Discount%) + Consultation Fee",
  ["facial-treatment-cost-calculator", "laser-hair-removal-calculator"]
);

add(
  "laser-hair-removal-calculator",
  "Laser Hair Removal Calculator",
  "Estimate laser hair removal sessions and total cost.",
  "Finance",
  "finance",
  "$",
  ["laser hair removal cost", "laser hair removal sessions", "permanent hair removal cost"],
  [
    '{ name: "bodyArea", label: "Body Area", type: "select", options: [{ value: "75", label: "Upper Lip" }, { value: "100", label: "Underarms" }, { value: "150", label: "Bikini" }, { value: "250", label: "Half Legs" }, { value: "400", label: "Full Legs" }, { value: "300", label: "Full Back" }] }',
    '{ name: "sessions", label: "Sessions Needed", type: "number", min: 4, max: 12, defaultValue: 6 }',
    '{ name: "packageDiscount", label: "Package Discount (%)", type: "number", min: 0, max: 30, defaultValue: 15 }',
    '{ name: "maintenanceSessions", label: "Annual Maintenance Sessions", type: "number", min: 0, max: 4, defaultValue: 1 }'
  ],
  `(inputs) => {
    const bodyArea = parseInt(inputs.bodyArea as string);
    const sessions = inputs.sessions as number;
    const packageDiscount = inputs.packageDiscount as number;
    const maintenanceSessions = inputs.maintenanceSessions as number;
    const fullPrice = bodyArea * sessions;
    const discount = fullPrice * (packageDiscount / 100);
    const packagePrice = fullPrice - discount;
    const maintenanceCost = bodyArea * maintenanceSessions;
    const firstYearTotal = packagePrice + maintenanceCost;
    return {
      primary: { label: "Treatment Package Cost", value: "$" + formatNumber(packagePrice) },
      details: [
        { label: "Per Session (Full Price)", value: "$" + formatNumber(bodyArea) },
        { label: "Package Savings", value: "$" + formatNumber(discount) },
        { label: "Annual Maintenance", value: "$" + formatNumber(maintenanceCost) }
      ]
    };
  }`,
  [
    { q: "How many laser hair removal sessions are needed?", a: "Most areas need 6 to 8 sessions spaced 4 to 8 weeks apart." },
    { q: "Is laser hair removal permanent?", a: "It provides permanent reduction. Some maintenance sessions may be needed." },
    { q: "Does skin tone affect laser hair removal?", a: "Modern lasers work on most skin tones but results vary by hair color." }
  ],
  "Package Cost = (Area Price x Sessions) x (1 - Discount%)",
  ["waxing-cost-calculator", "chemical-peel-cost-calculator"]
);

add(
  "teeth-straightening-cost-calculator",
  "Teeth Straightening Cost Calculator",
  "Compare aligner and braces costs for teeth straightening.",
  "Finance",
  "finance",
  "$",
  ["teeth straightening cost", "braces cost", "aligner cost", "invisalign cost"],
  [
    '{ name: "method", label: "Treatment Method", type: "select", options: [{ value: "5000", label: "Metal Braces" }, { value: "6000", label: "Ceramic Braces" }, { value: "5500", label: "Clear Aligners" }, { value: "7000", label: "Lingual Braces" }] }',
    '{ name: "duration", label: "Treatment Duration (months)", type: "number", min: 6, max: 36, defaultValue: 18 }',
    '{ name: "insurance", label: "Insurance Coverage ($)", type: "number", min: 0, max: 3000, defaultValue: 1500 }',
    '{ name: "retainerCost", label: "Retainer Cost ($)", type: "number", min: 100, max: 1000, defaultValue: 300 }'
  ],
  `(inputs) => {
    const method = parseInt(inputs.method as string);
    const duration = inputs.duration as number;
    const insurance = inputs.insurance as number;
    const retainerCost = inputs.retainerCost as number;
    const totalTreatment = method + retainerCost;
    const outOfPocket = Math.max(totalTreatment - insurance, 0);
    const monthlyCost = outOfPocket / duration;
    return {
      primary: { label: "Out of Pocket Cost", value: "$" + formatNumber(outOfPocket) },
      details: [
        { label: "Total Treatment Cost", value: "$" + formatNumber(totalTreatment) },
        { label: "Insurance Coverage", value: "$" + formatNumber(insurance) },
        { label: "Monthly Payment", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  }`,
  [
    { q: "How much do braces cost?", a: "Metal braces cost $3000 to $7000. Clear aligners cost $3000 to $8000." },
    { q: "Are clear aligners cheaper than braces?", a: "They are similar in cost, though complex cases may cost more with aligners." },
    { q: "Does insurance cover teeth straightening?", a: "Many dental plans cover $1000 to $2000 for orthodontic treatment." }
  ],
  "Out of Pocket = (Treatment Cost + Retainer) - Insurance Coverage",
  ["cosmetic-surgery-cost-calculator", "botox-cost-calculator"]
);

add(
  "cosmetic-surgery-cost-calculator",
  "Cosmetic Surgery Cost Calculator",
  "Estimate cosmetic surgery procedure costs and fees.",
  "Finance",
  "finance",
  "$",
  ["cosmetic surgery cost", "plastic surgery cost", "procedure cost estimate"],
  [
    '{ name: "procedure", label: "Procedure", type: "select", options: [{ value: "6000", label: "Rhinoplasty" }, { value: "8000", label: "Breast Augmentation" }, { value: "7000", label: "Liposuction" }, { value: "10000", label: "Facelift" }, { value: "5000", label: "Eyelid Surgery" }] }',
    '{ name: "anesthesia", label: "Anesthesia Fee ($)", type: "number", min: 500, max: 3000, defaultValue: 1000 }',
    '{ name: "facilityFee", label: "Facility Fee ($)", type: "number", min: 500, max: 3000, defaultValue: 1500 }',
    '{ name: "aftercare", label: "Post-Op Care Cost ($)", type: "number", min: 0, max: 2000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const procedure = parseInt(inputs.procedure as string);
    const anesthesia = inputs.anesthesia as number;
    const facilityFee = inputs.facilityFee as number;
    const aftercare = inputs.aftercare as number;
    const totalCost = procedure + anesthesia + facilityFee + aftercare;
    const surgeonFeePercent = (procedure / totalCost) * 100;
    return {
      primary: { label: "Total Procedure Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Surgeon Fee", value: "$" + formatNumber(procedure) },
        { label: "Anesthesia + Facility", value: "$" + formatNumber(anesthesia + facilityFee) },
        { label: "Post-Op Care", value: "$" + formatNumber(aftercare) }
      ]
    };
  }`,
  [
    { q: "What is included in cosmetic surgery cost?", a: "Total cost includes surgeon fee, anesthesia, facility fee, and aftercare." },
    { q: "Does insurance cover cosmetic surgery?", a: "Most cosmetic procedures are not covered unless deemed medically necessary." },
    { q: "Can you finance cosmetic surgery?", a: "Many practices offer payment plans or medical financing options." }
  ],
  "Total = Surgeon Fee + Anesthesia + Facility Fee + Post-Op Care",
  ["botox-cost-calculator", "dermal-filler-cost-calculator"]
);

add(
  "skincare-routine-cost-calculator",
  "Skincare Routine Cost Calculator",
  "Calculate your monthly and annual skincare product budget.",
  "Finance",
  "finance",
  "$",
  ["skincare cost", "skincare budget", "beauty routine cost"],
  [
    '{ name: "cleanser", label: "Cleanser Cost ($)", type: "number", min: 5, max: 100, defaultValue: 15 }',
    '{ name: "moisturizer", label: "Moisturizer Cost ($)", type: "number", min: 5, max: 150, defaultValue: 25 }',
    '{ name: "serum", label: "Serum Cost ($)", type: "number", min: 0, max: 200, defaultValue: 35 }',
    '{ name: "sunscreen", label: "Sunscreen Cost ($)", type: "number", min: 5, max: 60, defaultValue: 15 }',
    '{ name: "extras", label: "Extra Products Cost ($)", type: "number", min: 0, max: 200, defaultValue: 20 }',
    '{ name: "productLifespan", label: "Product Lifespan (months)", type: "number", min: 1, max: 6, defaultValue: 2 }'
  ],
  `(inputs) => {
    const cleanser = inputs.cleanser as number;
    const moisturizer = inputs.moisturizer as number;
    const serum = inputs.serum as number;
    const sunscreen = inputs.sunscreen as number;
    const extras = inputs.extras as number;
    const productLifespan = inputs.productLifespan as number;
    const totalProductCost = cleanser + moisturizer + serum + sunscreen + extras;
    const monthlyCost = totalProductCost / productLifespan;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Monthly Skincare Cost", value: "$" + formatNumber(monthlyCost) },
      details: [
        { label: "Total Product Cost", value: "$" + formatNumber(totalProductCost) },
        { label: "Product Lifespan", value: formatNumber(productLifespan) + " months" },
        { label: "Annual Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  }`,
  [
    { q: "How much should you spend on skincare?", a: "A basic routine costs $30 to $80 per month. Premium products cost more." },
    { q: "What are the essential skincare products?", a: "Cleanser, moisturizer, and sunscreen are the three essential products." },
    { q: "How long do skincare products last?", a: "Most products last 2 to 3 months with daily use." }
  ],
  "Monthly Cost = (Cleanser + Moisturizer + Serum + Sunscreen + Extras) / Lifespan",
  ["perfume-cost-per-wear-calculator", "facial-treatment-cost-calculator"]
);

add(
  "perfume-cost-per-wear-calculator",
  "Perfume Cost Per Wear Calculator",
  "Calculate the cost per use of your fragrance collection.",
  "Finance",
  "finance",
  "$",
  ["perfume cost per wear", "fragrance cost", "perfume value"],
  [
    '{ name: "bottlePrice", label: "Bottle Price ($)", type: "number", min: 10, max: 1000, defaultValue: 120 }',
    '{ name: "bottleSize", label: "Bottle Size (ml)", type: "number", min: 10, max: 200, defaultValue: 100 }',
    '{ name: "spraysPerUse", label: "Sprays Per Use", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "usesPerWeek", label: "Uses Per Week", type: "number", min: 1, max: 7, defaultValue: 5 }'
  ],
  `(inputs) => {
    const bottlePrice = inputs.bottlePrice as number;
    const bottleSize = inputs.bottleSize as number;
    const spraysPerUse = inputs.spraysPerUse as number;
    const usesPerWeek = inputs.usesPerWeek as number;
    const mlPerSpray = 0.1;
    const totalSprays = bottleSize / mlPerSpray;
    const totalUses = totalSprays / spraysPerUse;
    const costPerWear = bottlePrice / totalUses;
    const weeksToFinish = totalUses / usesPerWeek;
    return {
      primary: { label: "Cost Per Wear", value: "$" + formatNumber(costPerWear) },
      details: [
        { label: "Total Uses", value: formatNumber(totalUses) },
        { label: "Weeks to Finish", value: formatNumber(weeksToFinish) },
        { label: "Cost Per Month", value: "$" + formatNumber(costPerWear * usesPerWeek * 4.33) }
      ]
    };
  }`,
  [
    { q: "How many sprays are in a perfume bottle?", a: "A 100ml bottle contains about 1000 sprays at 0.1ml per spray." },
    { q: "How many sprays of perfume should you use?", a: "3 to 5 sprays is typical. More may be needed for lighter scents." },
    { q: "Is expensive perfume worth it?", a: "Higher-priced perfumes often have better longevity and lower cost per wear." }
  ],
  "Cost Per Wear = Bottle Price / (Total Sprays / Sprays Per Use)",
  ["skincare-routine-cost-calculator", "makeup-expiration-calculator"]
);

add(
  "makeup-expiration-calculator",
  "Makeup Expiration Calculator",
  "Track makeup product lifespan and replacement schedule.",
  "Everyday",
  "everyday",
  "~",
  ["makeup expiration", "makeup shelf life", "cosmetic expiration"],
  [
    '{ name: "productType", label: "Product Type", type: "select", options: [{ value: "3", label: "Mascara (3 months)" }, { value: "6", label: "Liquid Foundation (6 months)" }, { value: "12", label: "Lipstick (12 months)" }, { value: "24", label: "Powder Products (24 months)" }, { value: "18", label: "Cream Blush (18 months)" }] }',
    '{ name: "openedDate", label: "Months Since Opened", type: "number", min: 0, max: 36, defaultValue: 3 }',
    '{ name: "productCost", label: "Product Cost ($)", type: "number", min: 1, max: 200, defaultValue: 25 }',
    '{ name: "totalProducts", label: "Total Products to Track", type: "number", min: 1, max: 50, defaultValue: 10 }'
  ],
  `(inputs) => {
    const shelfLife = parseInt(inputs.productType as string);
    const openedDate = inputs.openedDate as number;
    const productCost = inputs.productCost as number;
    const totalProducts = inputs.totalProducts as number;
    const remainingMonths = Math.max(shelfLife - openedDate, 0);
    const isExpired = openedDate >= shelfLife;
    const annualReplacementCost = productCost * (12 / shelfLife);
    const totalAnnualCost = annualReplacementCost * totalProducts;
    return {
      primary: { label: "Product Status", value: isExpired ? "Expired - Replace Now" : formatNumber(remainingMonths) + " months remaining" },
      details: [
        { label: "Shelf Life", value: formatNumber(shelfLife) + " months" },
        { label: "Replacement Cost Per Year", value: "$" + formatNumber(annualReplacementCost) },
        { label: "Total Annual Replacement Cost", value: "$" + formatNumber(totalAnnualCost) }
      ]
    };
  }`,
  [
    { q: "How long does mascara last?", a: "Mascara should be replaced every 3 months to prevent bacterial growth." },
    { q: "When should you throw away makeup?", a: "Follow the PAO symbol on packaging, which shows months after opening." },
    { q: "Can expired makeup cause problems?", a: "Yes, expired makeup can cause skin irritation, breakouts, and infections." }
  ],
  "Remaining Life = Shelf Life (months) - Months Since Opened",
  ["skincare-routine-cost-calculator", "perfume-cost-per-wear-calculator"]
);

add(
  "sunscreen-usage-calculator",
  "Sunscreen Usage Calculator",
  "Calculate the amount of sunscreen needed for proper protection.",
  "Health",
  "health",
  "H",
  ["sunscreen amount", "sunscreen usage", "spf coverage", "sun protection"],
  [
    '{ name: "bodyAreas", label: "Coverage Area", type: "select", options: [{ value: "1", label: "Face Only" }, { value: "3", label: "Face and Arms" }, { value: "5", label: "Upper Body" }, { value: "9", label: "Full Body" }] }',
    '{ name: "hoursOutdoors", label: "Hours Outdoors", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "bottleSize", label: "Bottle Size (oz)", type: "number", min: 1, max: 16, defaultValue: 6 }',
    '{ name: "bottleCost", label: "Bottle Cost ($)", type: "number", min: 5, max: 50, defaultValue: 12 }'
  ],
  `(inputs) => {
    const bodyAreas = parseInt(inputs.bodyAreas as string);
    const hoursOutdoors = inputs.hoursOutdoors as number;
    const bottleSize = inputs.bottleSize as number;
    const bottleCost = inputs.bottleCost as number;
    const ozPerApplication = bodyAreas * 0.11;
    const reapplications = Math.ceil(hoursOutdoors / 2);
    const dailyUsage = ozPerApplication * reapplications;
    const daysPerBottle = bottleSize / dailyUsage;
    const costPerDay = bottleCost / daysPerBottle;
    return {
      primary: { label: "Daily Sunscreen Needed", value: formatNumber(dailyUsage) + " oz" },
      details: [
        { label: "Applications Per Day", value: formatNumber(reapplications) },
        { label: "Days Per Bottle", value: formatNumber(daysPerBottle) },
        { label: "Cost Per Day", value: "$" + formatNumber(costPerDay) }
      ]
    };
  }`,
  [
    { q: "How much sunscreen should I apply?", a: "Use about 1 ounce (a shot glass full) for full body coverage." },
    { q: "How often should you reapply sunscreen?", a: "Reapply every 2 hours, or immediately after swimming or sweating." },
    { q: "Does higher SPF mean better protection?", a: "SPF 30 blocks 97 percent of UVB rays. SPF 50 blocks about 98 percent." }
  ],
  "Daily Usage = (Body Areas x 0.11 oz) x (Hours / 2 reapplications)",
  ["skin-type-hydration-calculator", "skincare-routine-cost-calculator"]
);

add(
  "hair-growth-calculator",
  "Hair Growth Calculator",
  "Estimate hair growth timeline to reach your desired length.",
  "Health",
  "health",
  "H",
  ["hair growth rate", "hair growth timeline", "hair length calculator"],
  [
    '{ name: "currentLength", label: "Current Length (inches)", type: "number", min: 0, max: 40, defaultValue: 6 }',
    '{ name: "desiredLength", label: "Desired Length (inches)", type: "number", min: 1, max: 48, defaultValue: 18 }',
    '{ name: "growthRate", label: "Growth Rate", type: "select", options: [{ value: "0.4", label: "Slow (0.4 in/month)" }, { value: "0.5", label: "Average (0.5 in/month)" }, { value: "0.7", label: "Fast (0.7 in/month)" }] }',
    '{ name: "trimFrequency", label: "Trim Frequency (months)", type: "number", min: 0, max: 12, defaultValue: 3 }',
    '{ name: "trimAmount", label: "Trim Amount (inches)", type: "number", min: 0, max: 2, defaultValue: 0.5 }'
  ],
  `(inputs) => {
    const currentLength = inputs.currentLength as number;
    const desiredLength = inputs.desiredLength as number;
    const growthRate = parseFloat(inputs.growthRate as string);
    const trimFrequency = inputs.trimFrequency as number;
    const trimAmount = inputs.trimAmount as number;
    if (desiredLength <= currentLength) return null;
    const trimPerMonth = trimFrequency > 0 ? trimAmount / trimFrequency : 0;
    const netGrowthPerMonth = growthRate - trimPerMonth;
    if (netGrowthPerMonth <= 0) return null;
    const growthNeeded = desiredLength - currentLength;
    const monthsNeeded = Math.ceil(growthNeeded / netGrowthPerMonth);
    const yearsMonths = Math.floor(monthsNeeded / 12) + " years " + (monthsNeeded % 12) + " months";
    return {
      primary: { label: "Time to Goal", value: yearsMonths },
      details: [
        { label: "Growth Needed", value: formatNumber(growthNeeded) + " inches" },
        { label: "Net Growth Per Month", value: formatNumber(netGrowthPerMonth) + " inches" },
        { label: "Total Months", value: formatNumber(monthsNeeded) }
      ]
    };
  }`,
  [
    { q: "How fast does hair grow?", a: "Hair grows about 0.5 inches per month or 6 inches per year on average." },
    { q: "Does trimming make hair grow faster?", a: "No, trimming prevents split ends but does not affect growth rate." },
    { q: "What helps hair grow faster?", a: "Good nutrition, reduced heat styling, and gentle care support healthy growth." }
  ],
  "Months = Growth Needed / (Growth Rate - Trim Loss Per Month)",
  ["haircut-frequency-calculator", "skin-type-hydration-calculator"]
);

add(
  "skin-type-hydration-calculator",
  "Skin Type Hydration Calculator",
  "Calculate daily water intake recommendation for your skin type.",
  "Health",
  "health",
  "H",
  ["skin hydration", "water for skin", "skin type water intake"],
  [
    '{ name: "skinType", label: "Skin Type", type: "select", options: [{ value: "1", label: "Oily" }, { value: "1.1", label: "Normal" }, { value: "1.2", label: "Combination" }, { value: "1.3", label: "Dry" }, { value: "1.4", label: "Very Dry" }] }',
    '{ name: "bodyWeight", label: "Body Weight (lbs)", type: "number", min: 80, max: 400, defaultValue: 150 }',
    '{ name: "climate", label: "Climate", type: "select", options: [{ value: "1", label: "Humid" }, { value: "1.1", label: "Temperate" }, { value: "1.2", label: "Dry/Arid" }] }',
    '{ name: "activityLevel", label: "Activity Level", type: "select", options: [{ value: "1", label: "Sedentary" }, { value: "1.15", label: "Moderate" }, { value: "1.3", label: "Active" }] }'
  ],
  `(inputs) => {
    const skinType = parseFloat(inputs.skinType as string);
    const bodyWeight = inputs.bodyWeight as number;
    const climate = parseFloat(inputs.climate as string);
    const activityLevel = parseFloat(inputs.activityLevel as string);
    const baseOz = bodyWeight * 0.5;
    const adjustedOz = baseOz * skinType * climate * activityLevel;
    const liters = adjustedOz * 0.0296;
    const glasses = Math.ceil(adjustedOz / 8);
    return {
      primary: { label: "Daily Water Intake", value: formatNumber(adjustedOz) + " oz (" + formatNumber(liters) + " L)" },
      details: [
        { label: "Glasses of Water (8 oz)", value: formatNumber(glasses) },
        { label: "Skin Type Adjustment", value: "x" + formatNumber(skinType) },
        { label: "Climate Adjustment", value: "x" + formatNumber(climate) }
      ]
    };
  }`,
  [
    { q: "How much water should I drink for good skin?", a: "About half your body weight in ounces daily, adjusted for skin type." },
    { q: "Does drinking water improve skin?", a: "Adequate hydration supports skin elasticity and reduces dryness." },
    { q: "Does dry skin need more water?", a: "Dry skin types benefit from increased water intake and topical hydration." }
  ],
  "Daily Oz = (Body Weight x 0.5) x Skin Type Factor x Climate Factor x Activity Factor",
  ["sunscreen-usage-calculator", "hair-growth-calculator"]
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

const newImports = calcs.filter(c => !existingSlugs.has(c.slug)).map(c => `import { ${eName(c.slug)} } from "./${c.slug}";`);
const newRegs = calcs.filter(c => !existingSlugs.has(c.slug)).map(c => `  ${eName(c.slug)},`);
fs.writeFileSync(path.join(__dirname, 'new-imports-batch10.txt'), newImports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch10.txt'), newRegs.join('\n'));
console.log(`Imports saved to: scripts/new-imports-batch10.txt`);
console.log(`Registry saved to: scripts/new-regs-batch10.txt`);
