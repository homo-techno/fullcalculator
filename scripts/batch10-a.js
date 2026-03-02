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
