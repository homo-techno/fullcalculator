add(
  "baby-formula-cost-calculator",
  "Baby Formula Cost Calculator",
  "Estimate the total cost of baby formula feeding based on formula type, daily consumption, and feeding duration to budget for your infant.",
  "Finance",
  "finance",
  "$",
  ["baby formula cost", "infant formula budget", "formula feeding cost", "baby feeding expense", "formula price"],
  [
    '{ name: "formulaType", label: "Formula Type", type: "select", options: [{ value: "25", label: "Generic Powder ($25/can)" }, { value: "35", label: "Name Brand Powder ($35/can)" }, { value: "45", label: "Organic Powder ($45/can)" }, { value: "8", label: "Ready-to-Feed ($8/bottle)" }], defaultValue: "35" }',
    '{ name: "ouncesPerDay", label: "Ounces Per Day", type: "number", min: 8, max: 40, defaultValue: 24 }',
    '{ name: "months", label: "Months of Formula Feeding", type: "number", min: 1, max: 18, defaultValue: 12 }',
    '{ name: "canOunces", label: "Powder Ounces Per Can", type: "number", min: 8, max: 40, defaultValue: 12 }'
  ],
  `(inputs) => {
    const costPerCan = inputs.formulaType as number;
    const ouncesPerDay = inputs.ouncesPerDay as number;
    const months = inputs.months as number;
    const canOunces = inputs.canOunces as number;
    const scoopsPerDay = ouncesPerDay / 2;
    const ouncePowderPerDay = scoopsPerDay * 0.32;
    const daysPerCan = canOunces / ouncePowderPerDay;
    const totalDays = months * 30.44;
    const totalCans = Math.ceil(totalDays / daysPerCan);
    const totalCost = totalCans * costPerCan;
    const monthlyCost = totalCost / months;
    const weeklyCost = monthlyCost / 4.33;
    return {
      primary: { label: "Total Formula Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
        { label: "Weekly Cost", value: "$" + formatNumber(Math.round(weeklyCost)) },
        { label: "Cans Needed", value: formatNumber(totalCans) },
        { label: "Days Per Can", value: formatNumber(Math.round(daysPerCan * 10) / 10) }
      ]
    };
  }`,
  [
    "Q: How much does baby formula cost per month?||A: Baby formula typically costs between $100 and $300 per month depending on the brand and type. Generic powders are cheapest while ready-to-feed and specialty formulas cost significantly more.",
    "Q: How long do most babies use formula?||A: Most babies use formula until about 12 months of age, when they can transition to whole cow milk. Some specialty formulas may be used longer under pediatric guidance.",
    "Q: Is generic formula as good as name brand?||A: Yes. All infant formula sold in the US must meet strict FDA nutritional standards, so generic formulas are nutritionally equivalent to name-brand options."
  ],
  `Total Cans = Ceiling(Months x 30.44 / Days Per Can)\nDays Per Can = Can Ounces / (Scoops Per Day x 0.32)\nTotal Cost = Total Cans x Cost Per Can`,
  ["diaper-cost-calculator", "baby-food-stage-calculator", "nursery-setup-cost-calculator"]
);

add(
  "diaper-cost-calculator",
  "Diaper Cost Per Month Calculator",
  "Calculate the monthly and annual cost of disposable diapers based on diaper changes per day, brand tier, and your child age stage.",
  "Finance",
  "finance",
  "$",
  ["diaper cost", "diaper budget", "monthly diaper expense", "disposable diaper cost", "diaper spending"],
  [
    '{ name: "changesPerDay", label: "Diaper Changes Per Day", type: "number", min: 4, max: 16, defaultValue: 8 }',
    '{ name: "costPerDiaper", label: "Cost Per Diaper ($)", type: "number", min: 0.10, max: 0.80, defaultValue: 0.28 }',
    '{ name: "months", label: "Months to Calculate", type: "number", min: 1, max: 36, defaultValue: 12 }',
    '{ name: "wipes", label: "Wipes Cost Per Month ($)", type: "number", min: 5, max: 50, defaultValue: 15 }'
  ],
  `(inputs) => {
    const changesPerDay = inputs.changesPerDay as number;
    const costPerDiaper = inputs.costPerDiaper as number;
    const months = inputs.months as number;
    const wipes = inputs.wipes as number;
    const diapersPerMonth = changesPerDay * 30.44;
    const diaperCostPerMonth = diapersPerMonth * costPerDiaper;
    const totalMonthly = diaperCostPerMonth + wipes;
    const totalCost = totalMonthly * months;
    const totalDiapers = Math.round(diapersPerMonth * months);
    const annualized = totalMonthly * 12;
    return {
      primary: { label: "Monthly Diaper Cost", value: "$" + formatNumber(Math.round(totalMonthly)) },
      details: [
        { label: "Total Cost Over Period", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Diapers Per Month", value: formatNumber(Math.round(diapersPerMonth)) },
        { label: "Total Diapers Used", value: formatNumber(totalDiapers) },
        { label: "Annualized Cost", value: "$" + formatNumber(Math.round(annualized)) }
      ]
    };
  }`,
  [
    "Q: How many diapers does a newborn use per day?||A: Newborns typically use 10-12 diapers per day. This decreases to about 6-8 per day as the baby grows older and their bladder capacity increases.",
    "Q: How much do diapers cost in the first year?||A: Most families spend between $700 and $1,200 on disposable diapers in the first year, depending on brand choice and diaper changes per day.",
    "Q: When do most children stop using diapers?||A: Most children are potty trained between ages 2 and 3, meaning roughly 2 to 2.5 years of diaper expenses."
  ],
  `Monthly Diaper Cost = Changes/Day x 30.44 x Cost/Diaper + Wipes\nTotal Cost = Monthly Cost x Months`,
  ["baby-formula-cost-calculator", "cloth-diaper-savings-calculator", "baby-food-stage-calculator"]
);

add(
  "baby-food-stage-calculator",
  "Baby Food Stage Calculator",
  "Determine the appropriate baby food stage and estimate monthly feeding costs based on your child age and feeding preferences.",
  "Health",
  "health",
  "H",
  ["baby food stage", "infant feeding", "baby food cost", "solid food introduction", "baby puree"],
  [
    '{ name: "ageMonths", label: "Baby Age (Months)", type: "number", min: 4, max: 24, defaultValue: 8 }',
    '{ name: "jarsPerDay", label: "Jars or Pouches Per Day", type: "number", min: 1, max: 8, defaultValue: 3 }',
    '{ name: "costPerJar", label: "Cost Per Jar/Pouch ($)", type: "number", min: 0.50, max: 3.00, defaultValue: 1.25 }',
    '{ name: "homemadePercent", label: "Homemade Food Percentage (%)", type: "number", min: 0, max: 100, defaultValue: 30 }'
  ],
  `(inputs) => {
    const ageMonths = inputs.ageMonths as number;
    const jarsPerDay = inputs.jarsPerDay as number;
    const costPerJar = inputs.costPerJar as number;
    const homemadePercent = inputs.homemadePercent as number;
    var stage = 1;
    var stageLabel = "Stage 1 - Single Ingredient Purees";
    if (ageMonths >= 8) { stage = 2; stageLabel = "Stage 2 - Combo Purees and Textures"; }
    if (ageMonths >= 10) { stage = 3; stageLabel = "Stage 3 - Chunky Blends and Soft Solids"; }
    if (ageMonths >= 12) { stage = 4; stageLabel = "Table Food Transition"; }
    const storeBoughtRatio = (100 - homemadePercent) / 100;
    const monthlyJars = jarsPerDay * 30.44 * storeBoughtRatio;
    const monthlyCost = monthlyJars * costPerJar;
    const homemadeSavings = jarsPerDay * 30.44 * (homemadePercent / 100) * costPerJar * 0.6;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Feeding Stage", value: stageLabel },
      details: [
        { label: "Monthly Store-Bought Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
        { label: "Monthly Homemade Savings", value: "$" + formatNumber(Math.round(homemadeSavings)) },
        { label: "Store Jars/Pouches Per Month", value: formatNumber(Math.round(monthlyJars)) },
        { label: "Annual Estimated Cost", value: "$" + formatNumber(Math.round(annualCost)) }
      ]
    };
  }`,
  [
    "Q: When should I start introducing solid foods?||A: The American Academy of Pediatrics recommends introducing solid foods around 6 months of age when the baby shows signs of readiness like sitting up and showing interest in food.",
    "Q: What are the baby food stages?||A: Stage 1 (4-6 months) is single-ingredient purees, Stage 2 (6-8 months) has combo purees, Stage 3 (8-10 months) introduces chunky textures, and toddler foods follow.",
    "Q: Is homemade baby food cheaper?||A: Yes, homemade baby food typically costs 40-60% less than store-bought, and you have full control over ingredients and freshness."
  ],
  `Stage = Based on age (4-6: Stage 1, 6-8: Stage 2, 8-10: Stage 3, 12+: Table Food)\nMonthly Cost = Jars/Day x 30.44 x Store-Bought Ratio x Cost/Jar`,
  ["baby-formula-cost-calculator", "diaper-cost-calculator", "nursery-setup-cost-calculator"]
);

add(
  "nursery-setup-cost-calculator",
  "Nursery Setup Cost Calculator",
  "Estimate the total cost of setting up a baby nursery including furniture, bedding, decor, and essential gear.",
  "Finance",
  "finance",
  "$",
  ["nursery cost", "baby room setup", "nursery budget", "baby furniture cost", "nursery essentials"],
  [
    '{ name: "crib", label: "Crib Cost ($)", type: "number", min: 100, max: 2000, defaultValue: 350 }',
    '{ name: "dresser", label: "Dresser/Changing Table ($)", type: "number", min: 100, max: 1500, defaultValue: 300 }',
    '{ name: "chair", label: "Glider/Rocker Chair ($)", type: "number", min: 100, max: 2000, defaultValue: 400 }',
    '{ name: "bedding", label: "Bedding and Linens ($)", type: "number", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "decor", label: "Decor and Paint ($)", type: "number", min: 50, max: 1000, defaultValue: 200 }',
    '{ name: "extras", label: "Monitor, Lamp, Storage ($)", type: "number", min: 50, max: 1000, defaultValue: 250 }'
  ],
  `(inputs) => {
    const crib = inputs.crib as number;
    const dresser = inputs.dresser as number;
    const chair = inputs.chair as number;
    const bedding = inputs.bedding as number;
    const decor = inputs.decor as number;
    const extras = inputs.extras as number;
    const furniture = crib + dresser + chair;
    const softGoods = bedding + decor;
    const totalCost = furniture + softGoods + extras;
    const perItem = totalCost / 6;
    return {
      primary: { label: "Total Nursery Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Furniture Subtotal", value: "$" + formatNumber(Math.round(furniture)) },
        { label: "Bedding and Decor", value: "$" + formatNumber(Math.round(softGoods)) },
        { label: "Electronics and Storage", value: "$" + formatNumber(Math.round(extras)) },
        { label: "Average Per Item", value: "$" + formatNumber(Math.round(perItem)) }
      ]
    };
  }`,
  [
    "Q: How much does it cost to set up a nursery?||A: A basic nursery setup costs between $1,000 and $3,000 on average. Budget-friendly options using secondhand furniture can reduce costs to under $800.",
    "Q: What are the essential nursery items?||A: The essentials include a crib with a firm mattress, fitted sheets, a dresser or changing table, a baby monitor, and adequate lighting. A glider is popular but optional.",
    "Q: Can I save money on nursery furniture?||A: Yes, buying secondhand, using convertible furniture that grows with the child, and skipping non-essential decor items can save hundreds of dollars."
  ],
  `Total Cost = Crib + Dresser + Chair + Bedding + Decor + Extras\nFurniture = Crib + Dresser + Chair`,
  ["baby-formula-cost-calculator", "childproofing-cost-calculator", "baby-clothes-size-predictor"]
);

add(
  "maternity-leave-pay-calculator",
  "Maternity Leave Pay Calculator",
  "Calculate your expected income during maternity leave based on employer benefits, state disability insurance, and savings to plan ahead financially.",
  "Finance",
  "finance",
  "$",
  ["maternity leave pay", "maternity benefits", "parental leave income", "pregnancy leave calculator", "paid family leave"],
  [
    '{ name: "weeklySalary", label: "Weekly Gross Salary ($)", type: "number", min: 200, max: 10000, defaultValue: 1200 }',
    '{ name: "paidWeeks", label: "Employer Paid Leave (Weeks)", type: "number", min: 0, max: 26, defaultValue: 6 }',
    '{ name: "paidPercent", label: "Employer Pay Rate (%)", type: "number", min: 0, max: 100, defaultValue: 100 }',
    '{ name: "stateWeeks", label: "State Disability Weeks", type: "number", min: 0, max: 26, defaultValue: 6 }',
    '{ name: "statePercent", label: "State Disability Rate (%)", type: "number", min: 0, max: 80, defaultValue: 60 }',
    '{ name: "unpaidWeeks", label: "Unpaid Leave Weeks", type: "number", min: 0, max: 26, defaultValue: 4 }'
  ],
  `(inputs) => {
    const weeklySalary = inputs.weeklySalary as number;
    const paidWeeks = inputs.paidWeeks as number;
    const paidPercent = inputs.paidPercent as number;
    const stateWeeks = inputs.stateWeeks as number;
    const statePercent = inputs.statePercent as number;
    const unpaidWeeks = inputs.unpaidWeeks as number;
    const employerPay = weeklySalary * (paidPercent / 100) * paidWeeks;
    const statePay = weeklySalary * (statePercent / 100) * stateWeeks;
    const totalLeaveWeeks = paidWeeks + stateWeeks + unpaidWeeks;
    const totalIncome = employerPay + statePay;
    const normalIncome = weeklySalary * totalLeaveWeeks;
    const incomeGap = normalIncome - totalIncome;
    const avgWeeklyDuringLeave = totalLeaveWeeks > 0 ? totalIncome / totalLeaveWeeks : 0;
    return {
      primary: { label: "Total Leave Income", value: "$" + formatNumber(Math.round(totalIncome)) },
      details: [
        { label: "Employer Paid Portion", value: "$" + formatNumber(Math.round(employerPay)) },
        { label: "State Disability Portion", value: "$" + formatNumber(Math.round(statePay)) },
        { label: "Total Leave Duration", value: formatNumber(totalLeaveWeeks) + " weeks" },
        { label: "Income Gap vs Normal Pay", value: "$" + formatNumber(Math.round(incomeGap)) },
        { label: "Average Weekly During Leave", value: "$" + formatNumber(Math.round(avgWeeklyDuringLeave)) }
      ]
    };
  }`,
  [
    "Q: How long is typical maternity leave in the US?||A: The FMLA provides 12 weeks of unpaid job-protected leave. Many employers offer 6-8 weeks of paid leave, and some states provide additional paid family leave benefits.",
    "Q: Does FMLA guarantee paid leave?||A: No. FMLA only guarantees unpaid leave with job protection. Paid leave depends on your employer benefits and state programs like disability insurance or paid family leave.",
    "Q: How can I prepare financially for maternity leave?||A: Start saving early, understand your employer benefits, research state programs, consider short-term disability insurance, and budget for the income gap during unpaid weeks."
  ],
  `Employer Pay = Weekly Salary x Paid% x Paid Weeks\nState Pay = Weekly Salary x State% x State Weeks\nIncome Gap = (Weekly Salary x Total Weeks) - Total Income`,
  ["baby-formula-cost-calculator", "nursery-setup-cost-calculator", "family-emergency-fund-calculator"]
);

add(
  "adoption-cost-estimator",
  "Adoption Cost Estimator",
  "Estimate the total cost of domestic, international, or foster care adoption including legal fees, agency costs, and travel expenses.",
  "Finance",
  "finance",
  "$",
  ["adoption cost", "adoption fees", "adoption budget", "child adoption expense", "adoption process cost"],
  [
    '{ name: "adoptionType", label: "Adoption Type", type: "select", options: [{ value: "1", label: "Domestic Private" }, { value: "2", label: "International" }, { value: "3", label: "Foster Care" }], defaultValue: "1" }',
    '{ name: "agencyFee", label: "Agency/Facilitator Fee ($)", type: "number", min: 0, max: 50000, defaultValue: 15000 }',
    '{ name: "legalFee", label: "Legal Fees ($)", type: "number", min: 500, max: 20000, defaultValue: 5000 }',
    '{ name: "homeStudy", label: "Home Study Fee ($)", type: "number", min: 500, max: 5000, defaultValue: 2000 }',
    '{ name: "travel", label: "Travel Expenses ($)", type: "number", min: 0, max: 30000, defaultValue: 3000 }'
  ],
  `(inputs) => {
    const adoptionType = inputs.adoptionType as number;
    const agencyFee = inputs.agencyFee as number;
    const legalFee = inputs.legalFee as number;
    const homeStudy = inputs.homeStudy as number;
    const travel = inputs.travel as number;
    const typeLabels = ["", "Domestic Private", "International", "Foster Care"];
    const totalCost = agencyFee + legalFee + homeStudy + travel;
    const taxCredit = Math.min(totalCost, 16810);
    const netCost = totalCost - taxCredit;
    return {
      primary: { label: "Total Adoption Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Adoption Type", value: typeLabels[adoptionType] },
        { label: "Agency/Facilitator Fee", value: "$" + formatNumber(Math.round(agencyFee)) },
        { label: "Legal and Home Study", value: "$" + formatNumber(Math.round(legalFee + homeStudy)) },
        { label: "Federal Tax Credit (Estimated)", value: "$" + formatNumber(Math.round(taxCredit)) },
        { label: "Net Cost After Tax Credit", value: "$" + formatNumber(Math.round(netCost)) }
      ]
    };
  }`,
  [
    "Q: How much does adoption cost on average?||A: Domestic private adoption typically costs $20,000-$50,000, international adoption $25,000-$55,000, and foster care adoption is often free or costs under $3,000.",
    "Q: Is there a tax credit for adoption?||A: Yes, the federal adoption tax credit allows qualifying families to claim up to $16,810 per child for adoption-related expenses.",
    "Q: How long does the adoption process take?||A: Domestic private adoption takes 1-3 years, international adoption 2-5 years, and foster care adoption 1-2 years depending on the circumstances."
  ],
  `Total Cost = Agency Fee + Legal Fees + Home Study + Travel\nNet Cost = Total Cost - Federal Tax Credit (up to $16,810)`,
  ["surrogacy-cost-calculator", "fertility-treatment-cost-calculator", "maternity-leave-pay-calculator"]
);

add(
  "surrogacy-cost-calculator",
  "Surrogacy Cost Calculator",
  "Estimate the total cost of gestational surrogacy including surrogate compensation, agency fees, legal costs, and medical expenses.",
  "Finance",
  "finance",
  "$",
  ["surrogacy cost", "gestational surrogacy", "surrogate mother cost", "surrogacy budget", "surrogacy expenses"],
  [
    '{ name: "surrogateComp", label: "Surrogate Compensation ($)", type: "number", min: 20000, max: 100000, defaultValue: 40000 }',
    '{ name: "agencyFee", label: "Agency Fee ($)", type: "number", min: 5000, max: 40000, defaultValue: 20000 }',
    '{ name: "legalFees", label: "Legal Fees ($)", type: "number", min: 5000, max: 20000, defaultValue: 10000 }',
    '{ name: "medicalIVF", label: "IVF and Medical Costs ($)", type: "number", min: 10000, max: 50000, defaultValue: 25000 }',
    '{ name: "insurance", label: "Surrogate Insurance ($)", type: "number", min: 5000, max: 40000, defaultValue: 15000 }'
  ],
  `(inputs) => {
    const surrogateComp = inputs.surrogateComp as number;
    const agencyFee = inputs.agencyFee as number;
    const legalFees = inputs.legalFees as number;
    const medicalIVF = inputs.medicalIVF as number;
    const insurance = inputs.insurance as number;
    const miscExpenses = surrogateComp * 0.15;
    const totalCost = surrogateComp + agencyFee + legalFees + medicalIVF + insurance + miscExpenses;
    const monthlyIfFinanced = totalCost / 60;
    return {
      primary: { label: "Total Surrogacy Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Surrogate Compensation", value: "$" + formatNumber(Math.round(surrogateComp)) },
        { label: "Agency and Legal", value: "$" + formatNumber(Math.round(agencyFee + legalFees)) },
        { label: "Medical and IVF", value: "$" + formatNumber(Math.round(medicalIVF)) },
        { label: "Insurance", value: "$" + formatNumber(Math.round(insurance)) },
        { label: "Misc Expenses (Est.)", value: "$" + formatNumber(Math.round(miscExpenses)) },
        { label: "If Financed Over 5 Years", value: "$" + formatNumber(Math.round(monthlyIfFinanced)) + "/mo" }
      ]
    };
  }`,
  [
    "Q: How much does surrogacy cost in the US?||A: Gestational surrogacy in the US typically costs between $100,000 and $200,000 including all agency, legal, medical, and compensation expenses.",
    "Q: What is the difference between gestational and traditional surrogacy?||A: In gestational surrogacy the surrogate has no genetic link to the baby as the embryo is created via IVF. Traditional surrogacy uses the surrogate egg, which is now rarely practiced.",
    "Q: Does insurance cover surrogacy costs?||A: Most standard insurance plans do not cover surrogacy. A separate policy or rider for the surrogate is typically needed, costing $15,000-$30,000."
  ],
  `Total Cost = Surrogate Compensation + Agency + Legal + Medical/IVF + Insurance + Misc\nMisc = Surrogate Compensation x 15%`,
  ["adoption-cost-estimator", "fertility-treatment-cost-calculator", "maternity-leave-pay-calculator"]
);

add(
  "fertility-treatment-cost-calculator",
  "Fertility Treatment Cost Calculator",
  "Estimate the cost of fertility treatments including IVF cycles, IUI, medication, and monitoring to plan your family building budget.",
  "Finance",
  "finance",
  "$",
  ["fertility treatment cost", "IVF cost", "IUI cost", "fertility medication", "reproductive treatment"],
  [
    '{ name: "treatmentType", label: "Treatment Type", type: "select", options: [{ value: "1", label: "IUI (Intrauterine Insemination)" }, { value: "2", label: "IVF (In Vitro Fertilization)" }, { value: "3", label: "IVF with Donor Eggs" }, { value: "4", label: "Frozen Embryo Transfer" }], defaultValue: "2" }',
    '{ name: "cycles", label: "Estimated Number of Cycles", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "medicationCost", label: "Medication Cost Per Cycle ($)", type: "number", min: 500, max: 10000, defaultValue: 4000 }',
    '{ name: "insuranceCoverage", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 0 }'
  ],
  `(inputs) => {
    const treatmentType = inputs.treatmentType as number;
    const cycles = inputs.cycles as number;
    const medicationCost = inputs.medicationCost as number;
    const insuranceCoverage = inputs.insuranceCoverage as number;
    const baseCosts = [0, 1500, 15000, 25000, 5000];
    const baseCostPerCycle = baseCosts[treatmentType];
    const totalPerCycle = baseCostPerCycle + medicationCost;
    const grossTotal = totalPerCycle * cycles;
    const insuranceSavings = grossTotal * (insuranceCoverage / 100);
    const netCost = grossTotal - insuranceSavings;
    const treatmentLabels = ["", "IUI", "IVF", "IVF with Donor Eggs", "Frozen Embryo Transfer"];
    return {
      primary: { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(netCost)) },
      details: [
        { label: "Treatment Type", value: treatmentLabels[treatmentType] },
        { label: "Cost Per Cycle (Before Insurance)", value: "$" + formatNumber(Math.round(totalPerCycle)) },
        { label: "Gross Total for All Cycles", value: "$" + formatNumber(Math.round(grossTotal)) },
        { label: "Insurance Savings", value: "$" + formatNumber(Math.round(insuranceSavings)) },
        { label: "Number of Cycles", value: formatNumber(cycles) }
      ]
    };
  }`,
  [
    "Q: How much does one IVF cycle cost?||A: A single IVF cycle typically costs $12,000-$20,000 including medications, monitoring, retrieval, and transfer. Costs vary significantly by clinic and location.",
    "Q: How many IVF cycles are usually needed?||A: The average number of IVF cycles to achieve a live birth is 2-3, though success rates depend on age and individual factors. Success per cycle ranges from 20-50%.",
    "Q: Does insurance cover fertility treatments?||A: Coverage varies widely. About 20 US states have fertility insurance mandates, but coverage details differ. Check your specific plan for IVF and IUI benefits."
  ],
  `Cost Per Cycle = Base Procedure Cost + Medication Cost\nNet Cost = (Cost Per Cycle x Cycles) x (1 - Insurance Coverage%)`,
  ["surrogacy-cost-calculator", "adoption-cost-estimator", "maternity-leave-pay-calculator"]
);

add(
  "baby-shower-budget-calculator",
  "Baby Shower Budget Calculator",
  "Plan and budget your baby shower by estimating costs for venue, food, decorations, games, and favors based on guest count.",
  "Finance",
  "finance",
  "$",
  ["baby shower budget", "baby shower cost", "baby shower planning", "shower party budget", "baby celebration cost"],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", min: 5, max: 100, defaultValue: 25 }',
    '{ name: "foodPerPerson", label: "Food/Drink Per Person ($)", type: "number", min: 5, max: 50, defaultValue: 15 }',
    '{ name: "venue", label: "Venue Cost ($)", type: "number", min: 0, max: 2000, defaultValue: 200 }',
    '{ name: "decorations", label: "Decorations ($)", type: "number", min: 20, max: 500, defaultValue: 75 }',
    '{ name: "favors", label: "Favor Cost Per Guest ($)", type: "number", min: 1, max: 15, defaultValue: 4 }'
  ],
  `(inputs) => {
    const guests = inputs.guests as number;
    const foodPerPerson = inputs.foodPerPerson as number;
    const venue = inputs.venue as number;
    const decorations = inputs.decorations as number;
    const favors = inputs.favors as number;
    const foodTotal = guests * foodPerPerson;
    const favorsTotal = guests * favors;
    const cakeCost = Math.max(40, guests * 3);
    const totalCost = foodTotal + venue + decorations + favorsTotal + cakeCost;
    const perGuest = totalCost / guests;
    return {
      primary: { label: "Total Budget", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Food and Drinks", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Venue", value: "$" + formatNumber(Math.round(venue)) },
        { label: "Cake/Dessert", value: "$" + formatNumber(Math.round(cakeCost)) },
        { label: "Decorations", value: "$" + formatNumber(Math.round(decorations)) },
        { label: "Party Favors", value: "$" + formatNumber(Math.round(favorsTotal)) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  }`,
  [
    "Q: How much does a baby shower typically cost?||A: The average baby shower costs between $400 and $1,500 depending on guest count, venue, and catering choices. At-home showers can be done for under $300.",
    "Q: Who traditionally pays for a baby shower?||A: The host, typically a close friend or family member, traditionally pays for the shower. Some groups split costs among multiple hosts or co-organizers.",
    "Q: How many guests should I invite to a baby shower?||A: Most baby showers have 15-40 guests, though the right number depends on budget, venue capacity, and personal preference."
  ],
  `Total = (Food/Person x Guests) + Venue + Decorations + (Favor x Guests) + Cake\nCost Per Guest = Total / Guests`,
  ["nursery-setup-cost-calculator", "baby-formula-cost-calculator", "birthday-party-per-child-calculator"]
);

add(
  "baby-name-popularity-calculator",
  "Baby Name Popularity Rank Calculator",
  "Estimate the relative popularity and uniqueness of a baby name based on historical ranking trends and frequency data.",
  "Everyday",
  "everyday",
  "~",
  ["baby name popularity", "name ranking", "name frequency", "baby name trends", "unique baby name"],
  [
    '{ name: "currentRank", label: "Current Name Rank (1-1000)", type: "number", min: 1, max: 1000, defaultValue: 150 }',
    '{ name: "birthsPerYear", label: "Annual Births in Country", type: "number", min: 100000, max: 5000000, defaultValue: 3600000 }',
    '{ name: "genderSplit", label: "Gender Share of Births (%)", type: "number", min: 45, max: 55, defaultValue: 51 }',
    '{ name: "trendDirection", label: "Trend Direction", type: "select", options: [{ value: "1.05", label: "Rising" }, { value: "1.0", label: "Stable" }, { value: "0.95", label: "Declining" }], defaultValue: "1.0" }'
  ],
  `(inputs) => {
    const currentRank = inputs.currentRank as number;
    const birthsPerYear = inputs.birthsPerYear as number;
    const genderSplit = inputs.genderSplit as number;
    const trendDirection = inputs.trendDirection as number;
    const genderBirths = birthsPerYear * (genderSplit / 100);
    const estimatedFreq = genderBirths * Math.pow(0.94, Math.log(currentRank) / Math.log(1.5)) / 100;
    const babiesWithName = Math.round(estimatedFreq);
    const percentOfBirths = (estimatedFreq / genderBirths) * 100;
    const inClassOf30 = percentOfBirths * 30 / 100;
    const projectedRank5yr = Math.round(currentRank / Math.pow(trendDirection, 5));
    return {
      primary: { label: "Estimated Babies With This Name/Year", value: formatNumber(babiesWithName) },
      details: [
        { label: "Current Rank", value: "#" + formatNumber(currentRank) },
        { label: "Percentage of Births", value: formatNumber(Math.round(percentOfBirths * 1000) / 1000) + "%" },
        { label: "Chance of Same Name in Class of 30", value: formatNumber(Math.round(inClassOf30 * 100) / 100) + "%" },
        { label: "Projected Rank in 5 Years", value: "#" + formatNumber(projectedRank5yr) }
      ]
    };
  }`,
  [
    "Q: How are baby name rankings determined?||A: Name rankings are based on birth certificate data compiled by the Social Security Administration. Rank 1 is the most popular name given to babies that year.",
    "Q: What is considered a unique baby name?||A: Names ranked below 500 are considered uncommon, and names outside the top 1,000 are considered unique. The top 10 names each account for about 1% of births.",
    "Q: Do baby name trends change quickly?||A: Yes. A name can jump hundreds of ranks in a single year due to pop culture influence. However, classic names tend to remain in the top 200 for decades."
  ],
  `Estimated Frequency = Gender Births x 0.94^(ln(Rank)/ln(1.5)) / 100\nPercentage = Frequency / Gender Births x 100`,
  ["baby-food-stage-calculator", "nursery-setup-cost-calculator", "baby-clothes-size-predictor"]
);

add(
  "car-seat-expiration-calculator",
  "Car Seat Expiration Calculator",
  "Determine when your child car seat expires based on manufacture date and type, plus find the right seat for your child weight and age.",
  "Everyday",
  "everyday",
  "~",
  ["car seat expiration", "car seat lifespan", "child safety seat", "car seat age limit", "car seat replacement"],
  [
    '{ name: "seatType", label: "Car Seat Type", type: "select", options: [{ value: "6", label: "Infant Carrier (6 yr)" }, { value: "8", label: "Convertible Seat (8 yr)" }, { value: "10", label: "Booster Seat (10 yr)" }, { value: "7", label: "All-in-One (7 yr)" }], defaultValue: "8" }',
    '{ name: "mfgYear", label: "Manufacture Year", type: "number", min: 2015, max: 2026, defaultValue: 2022 }',
    '{ name: "childWeight", label: "Child Weight (lbs)", type: "number", min: 4, max: 120, defaultValue: 25 }',
    '{ name: "childAge", label: "Child Age (Months)", type: "number", min: 0, max: 144, defaultValue: 18 }'
  ],
  `(inputs) => {
    const lifespan = inputs.seatType as number;
    const mfgYear = inputs.mfgYear as number;
    const childWeight = inputs.childWeight as number;
    const childAge = inputs.childAge as number;
    const expirationYear = mfgYear + lifespan;
    const currentYear = 2026;
    const yearsRemaining = expirationYear - currentYear;
    const isExpired = yearsRemaining <= 0;
    var recommendedSeat = "Rear-Facing Infant Seat";
    if (childAge >= 12 && childWeight >= 20) { recommendedSeat = "Rear-Facing Convertible (recommended to age 2+)"; }
    if (childAge >= 24 && childWeight >= 30) { recommendedSeat = "Forward-Facing with Harness"; }
    if (childAge >= 48 && childWeight >= 40) { recommendedSeat = "Booster Seat"; }
    if (childAge >= 96 && childWeight >= 65) { recommendedSeat = "Seat Belt (if 4ft 9in+)"; }
    return {
      primary: { label: "Expiration Year", value: isExpired ? "EXPIRED" : formatNumber(expirationYear) },
      details: [
        { label: "Years Remaining", value: isExpired ? "Expired - Replace Immediately" : formatNumber(yearsRemaining) + " years" },
        { label: "Seat Lifespan", value: formatNumber(lifespan) + " years" },
        { label: "Recommended Seat Type", value: recommendedSeat },
        { label: "Child Age", value: formatNumber(Math.floor(childAge / 12)) + " yr " + formatNumber(childAge % 12) + " mo" }
      ]
    };
  }`,
  [
    "Q: Why do car seats expire?||A: Car seats expire because plastic degrades over time from temperature fluctuations and UV exposure, weakening structural integrity. Regulations and safety standards also evolve.",
    "Q: How long do car seats last?||A: Most car seats last 6-10 years from the manufacture date. Check the label on the bottom or back of the seat for the specific expiration date.",
    "Q: When should my child switch from rear-facing to forward-facing?||A: The AAP recommends keeping children rear-facing as long as possible, ideally until age 2 or until they exceed the seat height and weight limits."
  ],
  `Expiration Year = Manufacture Year + Seat Lifespan\nSeat recommendation based on child age and weight milestones`,
  ["baby-clothes-size-predictor", "childproofing-cost-calculator", "stroller-value-comparison-calculator"]
);

add(
  "stroller-value-comparison-calculator",
  "Stroller Value Comparison Calculator",
  "Compare the long-term value of strollers by calculating cost per use based on price, expected usage frequency, and years of use.",
  "Finance",
  "finance",
  "$",
  ["stroller comparison", "stroller value", "stroller cost per use", "stroller budget", "baby stroller calculator"],
  [
    '{ name: "price", label: "Stroller Price ($)", type: "number", min: 50, max: 3000, defaultValue: 400 }',
    '{ name: "usesPerWeek", label: "Uses Per Week", type: "number", min: 1, max: 14, defaultValue: 5 }',
    '{ name: "yearsOfUse", label: "Years of Use", type: "number", min: 1, max: 6, defaultValue: 3 }',
    '{ name: "accessories", label: "Accessories Cost ($)", type: "number", min: 0, max: 500, defaultValue: 75 }',
    '{ name: "resalePercent", label: "Expected Resale Value (%)", type: "number", min: 0, max: 60, defaultValue: 30 }'
  ],
  `(inputs) => {
    const price = inputs.price as number;
    const usesPerWeek = inputs.usesPerWeek as number;
    const yearsOfUse = inputs.yearsOfUse as number;
    const accessories = inputs.accessories as number;
    const resalePercent = inputs.resalePercent as number;
    const totalCost = price + accessories;
    const resaleValue = price * (resalePercent / 100);
    const netCost = totalCost - resaleValue;
    const totalUses = usesPerWeek * 52 * yearsOfUse;
    const costPerUse = netCost / totalUses;
    const monthlyCost = netCost / (yearsOfUse * 12);
    return {
      primary: { label: "Cost Per Use", value: "$" + formatNumber(Math.round(costPerUse * 100) / 100) },
      details: [
        { label: "Total Cost With Accessories", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Estimated Resale Value", value: "$" + formatNumber(Math.round(resaleValue)) },
        { label: "Net Cost", value: "$" + formatNumber(Math.round(netCost)) },
        { label: "Total Estimated Uses", value: formatNumber(totalUses) },
        { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: Is an expensive stroller worth it?||A: An expensive stroller used daily for 3+ years can have a lower cost per use than a cheap one used less. Durability and resale value make premium strollers cost-effective for active families.",
    "Q: How long can you use a stroller?||A: Most children use strollers until age 3-4. Many strollers accommodate children up to 50 lbs. Jogging strollers may be used even longer.",
    "Q: Do strollers have good resale value?||A: Premium brand strollers like UPPAbaby and Bugaboo retain 30-50% of their value. Budget strollers typically have minimal resale value."
  ],
  `Net Cost = Price + Accessories - (Price x Resale%)\nCost Per Use = Net Cost / (Uses/Week x 52 x Years)`,
  ["car-seat-expiration-calculator", "nursery-setup-cost-calculator", "baby-clothes-size-predictor"]
);

add(
  "baby-clothes-size-predictor",
  "Baby Clothes Size Predictor",
  "Predict the baby clothing size needed based on age, current weight, and growth rate to help with shopping and gift planning.",
  "Everyday",
  "everyday",
  "~",
  ["baby clothes size", "infant clothing size", "baby growth chart", "baby size predictor", "newborn clothing"],
  [
    '{ name: "ageMonths", label: "Current Age (Months)", type: "number", min: 0, max: 36, defaultValue: 6 }',
    '{ name: "currentWeight", label: "Current Weight (lbs)", type: "number", min: 5, max: 40, defaultValue: 16 }',
    '{ name: "currentLength", label: "Current Length (inches)", type: "number", min: 18, max: 40, defaultValue: 26 }',
    '{ name: "monthsAhead", label: "Months Ahead to Predict", type: "number", min: 1, max: 12, defaultValue: 3 }'
  ],
  `(inputs) => {
    const ageMonths = inputs.ageMonths as number;
    const currentWeight = inputs.currentWeight as number;
    const currentLength = inputs.currentLength as number;
    const monthsAhead = inputs.monthsAhead as number;
    const futureAge = ageMonths + monthsAhead;
    const monthlyWeightGain = ageMonths < 6 ? 1.5 : (ageMonths < 12 ? 1.0 : 0.5);
    const monthlyLengthGain = ageMonths < 6 ? 1.0 : (ageMonths < 12 ? 0.6 : 0.4);
    const futureWeight = currentWeight + (monthlyWeightGain * monthsAhead);
    const futureLength = currentLength + (monthlyLengthGain * monthsAhead);
    var size = "Newborn";
    if (futureWeight >= 8 || futureLength >= 21) { size = "0-3 Months"; }
    if (futureWeight >= 12 || futureLength >= 24) { size = "3-6 Months"; }
    if (futureWeight >= 16 || futureLength >= 27) { size = "6-9 Months"; }
    if (futureWeight >= 20 || futureLength >= 29) { size = "9-12 Months"; }
    if (futureWeight >= 24 || futureLength >= 31) { size = "12-18 Months"; }
    if (futureWeight >= 28 || futureLength >= 34) { size = "18-24 Months"; }
    if (futureWeight >= 32 || futureLength >= 36) { size = "2T"; }
    if (futureWeight >= 36 || futureLength >= 39) { size = "3T"; }
    return {
      primary: { label: "Predicted Size", value: size },
      details: [
        { label: "Predicted Weight", value: formatNumber(Math.round(futureWeight * 10) / 10) + " lbs" },
        { label: "Predicted Length", value: formatNumber(Math.round(futureLength * 10) / 10) + " in" },
        { label: "Future Age", value: formatNumber(futureAge) + " months" },
        { label: "Monthly Weight Gain Rate", value: formatNumber(monthlyWeightGain) + " lbs/mo" }
      ]
    };
  }`,
  [
    "Q: How do baby clothing sizes work?||A: Baby sizes are based on age ranges (0-3M, 3-6M, etc.) but fit depends more on weight and length. Always check the weight range on the label rather than the age.",
    "Q: Should I buy clothes ahead of size?||A: Yes, especially for gifts. Babies grow fast and often skip sizes. Buying 1-2 sizes up ensures longer wearability.",
    "Q: Do all brands size the same?||A: No. Baby clothing sizes vary significantly between brands. Carter tends to run true to size while European brands often run smaller."
  ],
  `Future Weight = Current Weight + (Monthly Gain x Months Ahead)\nSize based on predicted weight and length thresholds`,
  ["car-seat-expiration-calculator", "baby-food-stage-calculator", "baby-name-popularity-calculator"]
);

add(
  "childproofing-cost-calculator",
  "Childproofing Cost Calculator",
  "Estimate the total cost of childproofing your home including safety gates, outlet covers, cabinet locks, and furniture anchors.",
  "Finance",
  "finance",
  "$",
  ["childproofing cost", "baby proofing", "home safety baby", "child safety products", "baby gate cost"],
  [
    '{ name: "rooms", label: "Number of Rooms to Childproof", type: "number", min: 1, max: 15, defaultValue: 6 }',
    '{ name: "gates", label: "Safety Gates Needed", type: "number", min: 0, max: 10, defaultValue: 3 }',
    '{ name: "gateCost", label: "Average Gate Cost ($)", type: "number", min: 20, max: 150, defaultValue: 45 }',
    '{ name: "outlets", label: "Outlet Covers Needed", type: "number", min: 5, max: 50, defaultValue: 20 }',
    '{ name: "cabinetLocks", label: "Cabinet/Drawer Locks", type: "number", min: 5, max: 30, defaultValue: 12 }'
  ],
  `(inputs) => {
    const rooms = inputs.rooms as number;
    const gates = inputs.gates as number;
    const gateCost = inputs.gateCost as number;
    const outlets = inputs.outlets as number;
    const cabinetLocks = inputs.cabinetLocks as number;
    const gateTotal = gates * gateCost;
    const outletTotal = outlets * 2.5;
    const lockTotal = cabinetLocks * 5;
    const cornerGuards = rooms * 4 * 1.5;
    const furnitureAnchors = rooms * 2 * 8;
    const miscSafety = rooms * 10;
    const totalCost = gateTotal + outletTotal + lockTotal + cornerGuards + furnitureAnchors + miscSafety;
    const perRoom = totalCost / rooms;
    return {
      primary: { label: "Total Childproofing Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Safety Gates", value: "$" + formatNumber(Math.round(gateTotal)) },
        { label: "Outlet Covers", value: "$" + formatNumber(Math.round(outletTotal)) },
        { label: "Cabinet/Drawer Locks", value: "$" + formatNumber(Math.round(lockTotal)) },
        { label: "Corner Guards", value: "$" + formatNumber(Math.round(cornerGuards)) },
        { label: "Furniture Anchors", value: "$" + formatNumber(Math.round(furnitureAnchors)) },
        { label: "Cost Per Room", value: "$" + formatNumber(Math.round(perRoom)) }
      ]
    };
  }`,
  [
    "Q: How much does it cost to childproof a house?||A: Basic DIY childproofing costs $200-$500 for a typical home. Professional childproofing services charge $300-$1,000+ depending on home size.",
    "Q: When should I start childproofing?||A: Start childproofing by the time your baby is 6 months old, before they begin crawling. Key areas include stairs, kitchens, bathrooms, and any rooms with hazards.",
    "Q: What are the most important childproofing items?||A: The highest priority items are stair gates, outlet covers, cabinet locks for chemicals and medications, furniture anchors for tip-over prevention, and toilet locks."
  ],
  `Total = Gate Cost + Outlet Covers + Locks + Corner Guards + Furniture Anchors + Misc\nPer Room = Total / Number of Rooms`,
  ["nursery-setup-cost-calculator", "car-seat-expiration-calculator", "nanny-share-cost-calculator"]
);

add(
  "nanny-share-cost-calculator",
  "Nanny Share Cost Calculator",
  "Calculate the cost savings of a nanny share arrangement where two or more families split a nanny salary and related expenses.",
  "Finance",
  "finance",
  "$",
  ["nanny share", "shared nanny cost", "nanny split cost", "childcare sharing", "nanny share savings"],
  [
    '{ name: "nannyHourlyRate", label: "Nanny Hourly Rate ($)", type: "number", min: 15, max: 40, defaultValue: 22 }',
    '{ name: "hoursPerWeek", label: "Hours Per Week", type: "number", min: 20, max: 50, defaultValue: 40 }',
    '{ name: "families", label: "Number of Families Sharing", type: "number", min: 2, max: 4, defaultValue: 2 }',
    '{ name: "shareBonus", label: "Nanny Share Rate Increase (%)", type: "number", min: 0, max: 50, defaultValue: 20 }',
    '{ name: "payrollTax", label: "Payroll Tax and Benefits (%)", type: "number", min: 5, max: 20, defaultValue: 10 }'
  ],
  `(inputs) => {
    const nannyHourlyRate = inputs.nannyHourlyRate as number;
    const hoursPerWeek = inputs.hoursPerWeek as number;
    const families = inputs.families as number;
    const shareBonus = inputs.shareBonus as number;
    const payrollTax = inputs.payrollTax as number;
    const adjustedRate = nannyHourlyRate * (1 + shareBonus / 100);
    const weeklyTotal = adjustedRate * hoursPerWeek;
    const weeklyWithTax = weeklyTotal * (1 + payrollTax / 100);
    const yourWeekly = weeklyWithTax / families;
    const yourMonthly = yourWeekly * 4.33;
    const soloMonthly = nannyHourlyRate * hoursPerWeek * (1 + payrollTax / 100) * 4.33;
    const monthlySavings = soloMonthly - yourMonthly;
    const annualSavings = monthlySavings * 12;
    return {
      primary: { label: "Your Monthly Cost", value: "$" + formatNumber(Math.round(yourMonthly)) },
      details: [
        { label: "Solo Nanny Monthly Cost", value: "$" + formatNumber(Math.round(soloMonthly)) },
        { label: "Monthly Savings vs Solo", value: "$" + formatNumber(Math.round(monthlySavings)) },
        { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        { label: "Your Weekly Cost", value: "$" + formatNumber(Math.round(yourWeekly)) },
        { label: "Nanny Total Weekly Pay", value: "$" + formatNumber(Math.round(weeklyWithTax)) }
      ]
    };
  }`,
  [
    "Q: What is a nanny share?||A: A nanny share is when two or more families hire one nanny to care for their children together, typically at one family home. Costs are split, making quality care more affordable.",
    "Q: How much does a nanny share save?||A: Families typically save 25-40% compared to hiring a solo nanny, even with the nanny receiving a higher overall rate for caring for more children.",
    "Q: How does nanny share pay work?||A: The nanny usually receives a 15-25% rate increase for additional children, and families split the total cost evenly. Each family pays less than they would for a solo nanny."
  ],
  `Adjusted Rate = Hourly Rate x (1 + Share Bonus%)\nYour Cost = (Adjusted Rate x Hours x (1 + Tax%)) / Families\nSavings = Solo Monthly - Share Monthly`,
  ["babysitting-rate-calculator", "au-pair-cost-calculator", "daycare-waitlist-estimator"]
);

add(
  "daycare-waitlist-estimator",
  "Daycare Waitlist Time Estimator",
  "Estimate how long you may wait for a daycare spot based on facility size, turnover rate, and your position on the waitlist.",
  "Everyday",
  "everyday",
  "~",
  ["daycare waitlist", "daycare wait time", "childcare availability", "daycare enrollment", "preschool waitlist"],
  [
    '{ name: "capacity", label: "Facility Total Capacity", type: "number", min: 10, max: 200, defaultValue: 60 }',
    '{ name: "annualTurnover", label: "Annual Turnover Rate (%)", type: "number", min: 10, max: 60, defaultValue: 30 }',
    '{ name: "waitlistPosition", label: "Your Position on Waitlist", type: "number", min: 1, max: 100, defaultValue: 8 }',
    '{ name: "ageGroup", label: "Age Group", type: "select", options: [{ value: "0.15", label: "Infant (0-12 mo) - 15% of spots" }, { value: "0.25", label: "Toddler (1-2 yr) - 25% of spots" }, { value: "0.35", label: "Preschool (3-4 yr) - 35% of spots" }, { value: "0.25", label: "Pre-K (4-5 yr) - 25% of spots" }], defaultValue: "0.25" }'
  ],
  `(inputs) => {
    const capacity = inputs.capacity as number;
    const annualTurnover = inputs.annualTurnover as number;
    const waitlistPosition = inputs.waitlistPosition as number;
    const ageGroupShare = inputs.ageGroup as number;
    const ageGroupCapacity = Math.round(capacity * ageGroupShare);
    const annualOpenings = ageGroupCapacity * (annualTurnover / 100);
    const monthlyOpenings = annualOpenings / 12;
    const estimatedMonths = monthlyOpenings > 0 ? waitlistPosition / monthlyOpenings : 99;
    const estimatedWeeks = Math.round(estimatedMonths * 4.33);
    return {
      primary: { label: "Estimated Wait Time", value: formatNumber(Math.round(estimatedMonths)) + " months" },
      details: [
        { label: "Estimated Weeks", value: formatNumber(estimatedWeeks) + " weeks" },
        { label: "Age Group Spots", value: formatNumber(ageGroupCapacity) },
        { label: "Estimated Openings Per Year", value: formatNumber(Math.round(annualOpenings)) },
        { label: "Openings Per Month", value: formatNumber(Math.round(monthlyOpenings * 10) / 10) },
        { label: "Your Waitlist Position", value: "#" + formatNumber(waitlistPosition) }
      ]
    };
  }`,
  [
    "Q: How long is the average daycare waitlist?||A: Daycare waitlists average 3-12 months for toddlers and can exceed 12 months for infant spots. Urban areas and popular facilities tend to have longer waits.",
    "Q: When should I get on a daycare waitlist?||A: Many parents sign up for waitlists during pregnancy or shortly after birth. For infant care, signing up 6-12 months before your desired start date is recommended.",
    "Q: Can I be on multiple daycare waitlists?||A: Yes. Being on multiple waitlists increases your chances of getting a spot sooner. Most facilities charge a small waitlist fee ($50-$200)."
  ],
  `Age Group Spots = Capacity x Age Group Share\nMonthly Openings = (Age Group Spots x Turnover%) / 12\nWait Time = Waitlist Position / Monthly Openings`,
  ["nanny-share-cost-calculator", "babysitting-rate-calculator", "au-pair-cost-calculator"]
);

add(
  "family-grocery-budget-calculator",
  "Family Grocery Budget Calculator",
  "Calculate a realistic monthly grocery budget for your family based on household size, dietary preferences, and cost-saving strategies.",
  "Finance",
  "finance",
  "$",
  ["family grocery budget", "food budget calculator", "grocery spending", "family food cost", "meal planning budget"],
  [
    '{ name: "adults", label: "Number of Adults", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "children", label: "Number of Children", type: "number", min: 0, max: 8, defaultValue: 2 }',
    '{ name: "dietType", label: "Diet Type", type: "select", options: [{ value: "1.0", label: "Standard" }, { value: "1.15", label: "Mostly Organic" }, { value: "1.3", label: "Fully Organic" }, { value: "0.9", label: "Budget-Focused" }], defaultValue: "1.0" }',
    '{ name: "mealPlanPercent", label: "Meals Cooked at Home (%)", type: "number", min: 30, max: 100, defaultValue: 75 }',
    '{ name: "region", label: "Cost of Living Region", type: "select", options: [{ value: "0.85", label: "Low Cost Area" }, { value: "1.0", label: "Average Cost Area" }, { value: "1.2", label: "High Cost Area" }, { value: "1.4", label: "Very High Cost Area" }], defaultValue: "1.0" }'
  ],
  `(inputs) => {
    const adults = inputs.adults as number;
    const children = inputs.children as number;
    const dietType = inputs.dietType as number;
    const mealPlanPercent = inputs.mealPlanPercent as number;
    const region = inputs.region as number;
    const adultMonthly = 325;
    const childMonthly = 200;
    const baseMonthly = (adults * adultMonthly + children * childMonthly) * dietType * region;
    const cookedRatio = mealPlanPercent / 100;
    const adjustedMonthly = baseMonthly * (0.5 + 0.5 * cookedRatio);
    const weekly = adjustedMonthly / 4.33;
    const annual = adjustedMonthly * 12;
    const perPerson = adjustedMonthly / (adults + children);
    const dailyPerPerson = perPerson / 30.44;
    return {
      primary: { label: "Monthly Grocery Budget", value: "$" + formatNumber(Math.round(adjustedMonthly)) },
      details: [
        { label: "Weekly Budget", value: "$" + formatNumber(Math.round(weekly)) },
        { label: "Annual Budget", value: "$" + formatNumber(Math.round(annual)) },
        { label: "Per Person Monthly", value: "$" + formatNumber(Math.round(perPerson)) },
        { label: "Daily Per Person", value: "$" + formatNumber(Math.round(dailyPerPerson * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How much should a family of 4 spend on groceries?||A: The USDA estimates a moderate-cost food plan for a family of 4 costs $900-$1,200 per month. Actual spending depends on diet, location, and shopping habits.",
    "Q: How can families save on groceries?||A: Meal planning, buying store brands, shopping sales, using coupons, buying in bulk, and reducing food waste can save 20-40% on monthly grocery bills.",
    "Q: Does cooking at home really save money?||A: Yes. Cooking at home costs roughly 3-5 times less than restaurant meals and 2-3 times less than takeout for equivalent portions."
  ],
  `Base Monthly = (Adults x $325 + Children x $200) x Diet Multiplier x Region\nAdjusted = Base x (0.5 + 0.5 x Home Cooking Ratio)`,
  ["family-vacation-budget-calculator", "birthday-party-per-child-calculator", "family-phone-plan-cost-calculator"]
);

add(
  "family-phone-plan-cost-calculator",
  "Family Phone Plan Cost Calculator",
  "Compare and estimate the monthly cost of family phone plans based on number of lines, data needs, and device payment options.",
  "Finance",
  "finance",
  "$",
  ["family phone plan", "cell phone family cost", "mobile plan comparison", "family wireless plan", "phone plan budget"],
  [
    '{ name: "lines", label: "Number of Lines", type: "number", min: 2, max: 8, defaultValue: 4 }',
    '{ name: "dataPerLine", label: "Data Tier", type: "select", options: [{ value: "30", label: "Basic 5GB ($30/line)" }, { value: "45", label: "Standard 15GB ($45/line)" }, { value: "55", label: "Unlimited ($55/line)" }, { value: "70", label: "Premium Unlimited ($70/line)" }], defaultValue: "55" }',
    '{ name: "devicePayments", label: "Device Payments Per Month ($)", type: "number", min: 0, max: 200, defaultValue: 50 }',
    '{ name: "insurance", label: "Device Insurance Per Line ($)", type: "number", min: 0, max: 20, defaultValue: 8 }'
  ],
  `(inputs) => {
    const lines = inputs.lines as number;
    const dataPerLine = inputs.dataPerLine as number;
    const devicePayments = inputs.devicePayments as number;
    const insurance = inputs.insurance as number;
    const planCost = lines * dataPerLine;
    const multiLineDiscount = lines >= 3 ? planCost * 0.1 : 0;
    const insuranceTotal = lines * insurance;
    const fees = lines * 3.5;
    const monthly = planCost - multiLineDiscount + devicePayments + insuranceTotal + fees;
    const annual = monthly * 12;
    const perLine = monthly / lines;
    return {
      primary: { label: "Monthly Family Plan Cost", value: "$" + formatNumber(Math.round(monthly)) },
      details: [
        { label: "Plan Base Cost", value: "$" + formatNumber(Math.round(planCost)) },
        { label: "Multi-Line Discount", value: "-$" + formatNumber(Math.round(multiLineDiscount)) },
        { label: "Device Payments", value: "$" + formatNumber(Math.round(devicePayments)) },
        { label: "Insurance and Fees", value: "$" + formatNumber(Math.round(insuranceTotal + fees)) },
        { label: "Cost Per Line", value: "$" + formatNumber(Math.round(perLine)) },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annual)) }
      ]
    };
  }`,
  [
    "Q: How much does a family phone plan cost?||A: A family plan for 4 lines typically costs $120-$300 per month depending on the carrier, data plan, and device payments.",
    "Q: Is a family plan cheaper than individual plans?||A: Yes. Family plans offer per-line discounts, typically saving 20-40% compared to separate individual plans for the same number of lines.",
    "Q: Should I include device insurance?||A: Device insurance adds $8-17 per line monthly. It is worth considering for expensive phones but may not be cost-effective for budget devices."
  ],
  `Monthly = (Lines x Rate - Multi-Line Discount) + Device Payments + (Insurance x Lines) + Fees\nMulti-Line Discount = 10% if 3+ lines`,
  ["family-grocery-budget-calculator", "family-vacation-budget-calculator", "college-529-projector-calculator"]
);

add(
  "college-529-projector-calculator",
  "College 529 Plan Projector Calculator",
  "Project the future value of 529 college savings plan contributions with tax-free growth to estimate college funding readiness.",
  "Finance",
  "finance",
  "$",
  ["529 plan projector", "college savings growth", "529 calculator", "education fund projector", "college investment"],
  [
    '{ name: "currentBalance", label: "Current 529 Balance ($)", type: "number", min: 0, max: 500000, defaultValue: 5000 }',
    '{ name: "monthlyContribution", label: "Monthly Contribution ($)", type: "number", min: 0, max: 5000, defaultValue: 300 }',
    '{ name: "yearsToCollege", label: "Years Until College", type: "number", min: 1, max: 18, defaultValue: 12 }',
    '{ name: "annualReturn", label: "Expected Annual Return (%)", type: "number", min: 2, max: 12, defaultValue: 7 }',
    '{ name: "annualCollegeCost", label: "Projected Annual College Cost ($)", type: "number", min: 10000, max: 100000, defaultValue: 35000 }'
  ],
  `(inputs) => {
    const currentBalance = inputs.currentBalance as number;
    const monthlyContribution = inputs.monthlyContribution as number;
    const yearsToCollege = inputs.yearsToCollege as number;
    const annualReturn = inputs.annualReturn as number;
    const annualCollegeCost = inputs.annualCollegeCost as number;
    const r = annualReturn / 100 / 12;
    const n = yearsToCollege * 12;
    const futureValueLump = currentBalance * Math.pow(1 + r, n);
    const futureValueContrib = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    const totalFutureValue = futureValueLump + futureValueContrib;
    const totalContributed = currentBalance + (monthlyContribution * n);
    const growthEarnings = totalFutureValue - totalContributed;
    const fourYearCost = annualCollegeCost * 4 * Math.pow(1.04, yearsToCollege);
    const coveragePercent = (totalFutureValue / fourYearCost) * 100;
    const gap = fourYearCost - totalFutureValue;
    return {
      primary: { label: "Projected 529 Balance", value: "$" + formatNumber(Math.round(totalFutureValue)) },
      details: [
        { label: "Total Contributions", value: "$" + formatNumber(Math.round(totalContributed)) },
        { label: "Tax-Free Growth", value: "$" + formatNumber(Math.round(growthEarnings)) },
        { label: "Projected 4-Year Cost", value: "$" + formatNumber(Math.round(fourYearCost)) },
        { label: "Coverage Percentage", value: formatNumber(Math.round(coveragePercent)) + "%" },
        { label: "Funding Gap (if any)", value: gap > 0 ? "$" + formatNumber(Math.round(gap)) : "Fully Funded" }
      ]
    };
  }`,
  [
    "Q: What is a 529 plan?||A: A 529 plan is a tax-advantaged investment account designed for education savings. Earnings grow tax-free and withdrawals for qualified education expenses are not taxed.",
    "Q: How much should I save in a 529 plan?||A: Financial advisors suggest saving enough to cover at least 50-75% of projected college costs. Even smaller amounts benefit from years of tax-free compound growth.",
    "Q: What happens to unused 529 funds?||A: Unused 529 funds can be transferred to another family member for their education, used for K-12 tuition (up to $10,000/year), or rolled into a Roth IRA under recent legislation."
  ],
  `Future Value = Current x (1 + r)^n + Monthly x ((1 + r)^n - 1) / r\nProjected College Cost = Annual Cost x 4 x 1.04^Years\nCoverage = Future Value / College Cost x 100`,
  ["family-emergency-fund-calculator", "maternity-leave-pay-calculator", "family-grocery-budget-calculator"]
);

add(
  "family-vacation-budget-calculator",
  "Family Vacation Budget Calculator",
  "Plan and budget a family vacation by estimating costs for travel, accommodation, food, activities, and incidentals based on destination and family size.",
  "Finance",
  "finance",
  "$",
  ["family vacation budget", "family trip cost", "vacation planner", "travel budget family", "holiday cost calculator"],
  [
    '{ name: "familySize", label: "Family Size", type: "number", min: 2, max: 10, defaultValue: 4 }',
    '{ name: "nights", label: "Number of Nights", type: "number", min: 1, max: 21, defaultValue: 7 }',
    '{ name: "hotelPerNight", label: "Accommodation Per Night ($)", type: "number", min: 50, max: 1000, defaultValue: 175 }',
    '{ name: "travelCostTotal", label: "Round Trip Travel Total ($)", type: "number", min: 100, max: 10000, defaultValue: 1600 }',
    '{ name: "foodPerPersonDay", label: "Food Per Person Per Day ($)", type: "number", min: 20, max: 150, defaultValue: 50 }',
    '{ name: "activitiesPerDay", label: "Activities Per Day ($)", type: "number", min: 0, max: 500, defaultValue: 80 }'
  ],
  `(inputs) => {
    const familySize = inputs.familySize as number;
    const nights = inputs.nights as number;
    const hotelPerNight = inputs.hotelPerNight as number;
    const travelCostTotal = inputs.travelCostTotal as number;
    const foodPerPersonDay = inputs.foodPerPersonDay as number;
    const activitiesPerDay = inputs.activitiesPerDay as number;
    const days = nights + 1;
    const hotelTotal = hotelPerNight * nights;
    const foodTotal = foodPerPersonDay * familySize * days;
    const activitiesTotal = activitiesPerDay * days;
    const miscellaneous = (hotelTotal + foodTotal + activitiesTotal) * 0.1;
    const totalCost = travelCostTotal + hotelTotal + foodTotal + activitiesTotal + miscellaneous;
    const perPerson = totalCost / familySize;
    const perDay = totalCost / days;
    return {
      primary: { label: "Total Vacation Budget", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Travel", value: "$" + formatNumber(Math.round(travelCostTotal)) },
        { label: "Accommodation", value: "$" + formatNumber(Math.round(hotelTotal)) },
        { label: "Food", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Activities", value: "$" + formatNumber(Math.round(activitiesTotal)) },
        { label: "Miscellaneous (10%)", value: "$" + formatNumber(Math.round(miscellaneous)) },
        { label: "Cost Per Person", value: "$" + formatNumber(Math.round(perPerson)) }
      ]
    };
  }`,
  [
    "Q: How much does a family vacation cost?||A: The average American family of 4 spends $2,000-$5,000 on a week-long domestic vacation. International trips typically cost $5,000-$10,000+.",
    "Q: How can families save on vacation costs?||A: Traveling during off-peak seasons, booking early, using rewards points, choosing vacation rentals over hotels, and packing snacks can significantly reduce costs.",
    "Q: How much should I budget for food on vacation?||A: Budget $30-$60 per person per day for meals. Families can save by eating breakfast at the hotel, packing lunches, and reserving restaurants for dinner."
  ],
  `Total = Travel + (Hotel x Nights) + (Food x Family x Days) + (Activities x Days) + 10% Misc\nCost Per Person = Total / Family Size`,
  ["family-grocery-budget-calculator", "birthday-party-per-child-calculator", "family-phone-plan-cost-calculator"]
);

add(
  "birthday-party-per-child-calculator",
  "Birthday Party Cost Per Child Calculator",
  "Calculate the total cost of hosting a children birthday party and determine the per-child expense for venue, food, cake, and party bags.",
  "Finance",
  "finance",
  "$",
  ["birthday party cost", "kids party budget", "children party planner", "party cost per child", "birthday celebration budget"],
  [
    '{ name: "children", label: "Number of Children", type: "number", min: 5, max: 50, defaultValue: 15 }',
    '{ name: "venue", label: "Venue/Entertainment Cost ($)", type: "number", min: 0, max: 2000, defaultValue: 300 }',
    '{ name: "foodPerChild", label: "Food Per Child ($)", type: "number", min: 3, max: 30, defaultValue: 10 }',
    '{ name: "cake", label: "Cake Cost ($)", type: "number", min: 20, max: 300, defaultValue: 60 }',
    '{ name: "partyBagPerChild", label: "Party Bag Per Child ($)", type: "number", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "decorations", label: "Decorations ($)", type: "number", min: 10, max: 300, defaultValue: 40 }'
  ],
  `(inputs) => {
    const children = inputs.children as number;
    const venue = inputs.venue as number;
    const foodPerChild = inputs.foodPerChild as number;
    const cake = inputs.cake as number;
    const partyBagPerChild = inputs.partyBagPerChild as number;
    const decorations = inputs.decorations as number;
    const foodTotal = foodPerChild * children;
    const partyBagsTotal = partyBagPerChild * children;
    const totalCost = venue + foodTotal + cake + partyBagsTotal + decorations;
    const perChild = totalCost / children;
    return {
      primary: { label: "Total Party Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Cost Per Child", value: "$" + formatNumber(Math.round(perChild)) },
        { label: "Venue/Entertainment", value: "$" + formatNumber(Math.round(venue)) },
        { label: "Food Total", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Cake", value: "$" + formatNumber(Math.round(cake)) },
        { label: "Party Bags Total", value: "$" + formatNumber(Math.round(partyBagsTotal)) },
        { label: "Decorations", value: "$" + formatNumber(Math.round(decorations)) }
      ]
    };
  }`,
  [
    "Q: How much does a kids birthday party cost?||A: The average children birthday party costs $300-$500 for an at-home party and $400-$800+ for a venue party, depending on guest count and activities.",
    "Q: How many kids should I invite to a birthday party?||A: A common guideline is to invite the same number of children as the birthday child age (a 5-year-old gets 5 guests), though personal preference varies.",
    "Q: What are budget-friendly party ideas?||A: Park parties, backyard cookouts, movie nights, and themed craft parties are affordable options that keep costs under $200 for 10-15 children."
  ],
  `Total = Venue + (Food/Child x Children) + Cake + (Bag/Child x Children) + Decorations\nCost Per Child = Total / Number of Children`,
  ["family-vacation-budget-calculator", "baby-shower-budget-calculator", "family-grocery-budget-calculator"]
);

add(
  "family-emergency-fund-calculator",
  "Family Emergency Fund Calculator",
  "Calculate the recommended emergency fund size for your family based on monthly expenses, income sources, dependents, and risk factors.",
  "Finance",
  "finance",
  "$",
  ["emergency fund", "family savings goal", "rainy day fund", "emergency savings", "financial safety net"],
  [
    '{ name: "monthlyExpenses", label: "Monthly Essential Expenses ($)", type: "number", min: 1000, max: 20000, defaultValue: 4500 }',
    '{ name: "monthsRecommended", label: "Months of Coverage", type: "number", min: 3, max: 12, defaultValue: 6 }',
    '{ name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "incomeStability", label: "Income Stability", type: "select", options: [{ value: "0.8", label: "Very Stable (Government/Tenured)" }, { value: "1.0", label: "Stable (Salaried)" }, { value: "1.3", label: "Variable (Commission/Freelance)" }, { value: "1.5", label: "Unstable (Seasonal/Gig)" }], defaultValue: "1.0" }',
    '{ name: "currentSavings", label: "Current Emergency Savings ($)", type: "number", min: 0, max: 200000, defaultValue: 5000 }'
  ],
  `(inputs) => {
    const monthlyExpenses = inputs.monthlyExpenses as number;
    const monthsRecommended = inputs.monthsRecommended as number;
    const dependents = inputs.dependents as number;
    const incomeStability = inputs.incomeStability as number;
    const currentSavings = inputs.currentSavings as number;
    const dependentAdj = 1 + (dependents * 0.05);
    const targetFund = monthlyExpenses * monthsRecommended * incomeStability * dependentAdj;
    const gap = Math.max(0, targetFund - currentSavings);
    const monthsToGoal12 = gap / (monthlyExpenses * 0.15);
    const percentComplete = Math.min(100, (currentSavings / targetFund) * 100);
    return {
      primary: { label: "Recommended Emergency Fund", value: "$" + formatNumber(Math.round(targetFund)) },
      details: [
        { label: "Current Savings", value: "$" + formatNumber(Math.round(currentSavings)) },
        { label: "Remaining Gap", value: "$" + formatNumber(Math.round(gap)) },
        { label: "Progress", value: formatNumber(Math.round(percentComplete)) + "%" },
        { label: "Months to Goal (Saving 15%)", value: gap > 0 ? formatNumber(Math.round(monthsToGoal12)) + " months" : "Goal Reached" },
        { label: "Months of Coverage Funded", value: formatNumber(Math.round((currentSavings / monthlyExpenses) * 10) / 10) }
      ]
    };
  }`,
  [
    "Q: How much should a family have in an emergency fund?||A: Financial experts recommend 3-6 months of essential expenses for dual-income families and 6-12 months for single-income households or variable income earners.",
    "Q: Where should I keep my emergency fund?||A: Keep emergency funds in a high-yield savings account that is easily accessible but separate from your daily checking account to avoid temptation to spend it.",
    "Q: What counts as a financial emergency?||A: True emergencies include job loss, medical emergencies, urgent home or car repairs, and unexpected family needs. Planned expenses and discretionary purchases are not emergencies."
  ],
  `Target = Monthly Expenses x Months x Income Stability Factor x (1 + Dependents x 5%)\nGap = Target - Current Savings`,
  ["maternity-leave-pay-calculator", "college-529-projector-calculator", "estate-planning-cost-calculator"]
);

add(
  "estate-planning-cost-calculator",
  "Estate Planning Cost Calculator",
  "Estimate the cost of essential estate planning documents including wills, trusts, power of attorney, and guardianship designations for families.",
  "Finance",
  "finance",
  "$",
  ["estate planning cost", "will cost", "trust cost", "estate attorney fees", "family estate plan"],
  [
    '{ name: "planType", label: "Estate Plan Type", type: "select", options: [{ value: "1", label: "Basic Will Package" }, { value: "2", label: "Will + Trust" }, { value: "3", label: "Comprehensive Estate Plan" }], defaultValue: "2" }',
    '{ name: "estateSize", label: "Estimated Estate Value ($)", type: "number", min: 50000, max: 10000000, defaultValue: 500000 }',
    '{ name: "region", label: "Cost Region", type: "select", options: [{ value: "0.8", label: "Low Cost Area" }, { value: "1.0", label: "Average" }, { value: "1.3", label: "High Cost Area" }, { value: "1.6", label: "Major Metro" }], defaultValue: "1.0" }',
    '{ name: "children", label: "Number of Minor Children", type: "number", min: 0, max: 10, defaultValue: 2 }'
  ],
  `(inputs) => {
    const planType = inputs.planType as number;
    const estateSize = inputs.estateSize as number;
    const region = inputs.region as number;
    const children = inputs.children as number;
    const baseCosts = [0, 500, 2500, 5000];
    const baseCost = baseCosts[planType];
    const guardianshipCost = children > 0 ? 200 + (children * 50) : 0;
    const complexityAdj = estateSize > 1000000 ? 1.3 : (estateSize > 500000 ? 1.15 : 1.0);
    const totalCost = (baseCost + guardianshipCost) * region * complexityAdj;
    const planLabels = ["", "Basic Will Package", "Will + Trust", "Comprehensive Estate Plan"];
    const annualMaintenance = planType >= 2 ? totalCost * 0.05 : 0;
    return {
      primary: { label: "Estimated Estate Planning Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Plan Type", value: planLabels[planType] },
        { label: "Base Legal Fees", value: "$" + formatNumber(Math.round(baseCost * region)) },
        { label: "Guardianship Documents", value: "$" + formatNumber(Math.round(guardianshipCost * region)) },
        { label: "Complexity Adjustment", value: formatNumber(Math.round((complexityAdj - 1) * 100)) + "% premium" },
        { label: "Annual Maintenance/Updates", value: "$" + formatNumber(Math.round(annualMaintenance)) }
      ]
    };
  }`,
  [
    "Q: How much does a basic will cost?||A: A simple will costs $300-$1,000 when prepared by an attorney. Online will services cost $50-$200 but may not address complex family situations.",
    "Q: Do families with children need a trust?||A: A trust is not required but is recommended for families with minor children, as it provides more control over how assets are managed and distributed for children.",
    "Q: How often should estate plans be updated?||A: Review your estate plan every 3-5 years or after major life events like births, deaths, marriages, divorces, or significant changes in assets."
  ],
  `Total = (Base Cost + Guardianship) x Region Multiplier x Complexity Adjustment\nGuardianship = $200 + $50 per child`,
  ["family-emergency-fund-calculator", "family-life-insurance-calculator", "college-529-projector-calculator"]
);

add(
  "family-life-insurance-calculator",
  "Family Life Insurance Needs Calculator",
  "Calculate how much life insurance coverage your family needs based on income replacement, debts, education funding, and final expenses.",
  "Finance",
  "finance",
  "$",
  ["life insurance needs", "family insurance", "insurance coverage calculator", "income replacement", "death benefit"],
  [
    '{ name: "annualIncome", label: "Annual Income to Replace ($)", type: "number", min: 20000, max: 500000, defaultValue: 75000 }',
    '{ name: "yearsToReplace", label: "Years of Income Needed", type: "number", min: 5, max: 30, defaultValue: 15 }',
    '{ name: "totalDebts", label: "Total Outstanding Debts ($)", type: "number", min: 0, max: 1000000, defaultValue: 250000 }',
    '{ name: "childEducation", label: "Education Fund Per Child ($)", type: "number", min: 0, max: 200000, defaultValue: 80000 }',
    '{ name: "numChildren", label: "Number of Children", type: "number", min: 0, max: 8, defaultValue: 2 }',
    '{ name: "existingCoverage", label: "Existing Life Insurance ($)", type: "number", min: 0, max: 2000000, defaultValue: 100000 }'
  ],
  `(inputs) => {
    const annualIncome = inputs.annualIncome as number;
    const yearsToReplace = inputs.yearsToReplace as number;
    const totalDebts = inputs.totalDebts as number;
    const childEducation = inputs.childEducation as number;
    const numChildren = inputs.numChildren as number;
    const existingCoverage = inputs.existingCoverage as number;
    const incomeNeeds = annualIncome * yearsToReplace;
    const educationNeeds = childEducation * numChildren;
    const finalExpenses = 15000;
    const totalNeeds = incomeNeeds + totalDebts + educationNeeds + finalExpenses;
    const additionalNeeded = Math.max(0, totalNeeds - existingCoverage);
    const estMonthlyPremium20yr = (additionalNeeded / 1000) * 0.55;
    return {
      primary: { label: "Total Insurance Needed", value: "$" + formatNumber(Math.round(totalNeeds)) },
      details: [
        { label: "Income Replacement", value: "$" + formatNumber(Math.round(incomeNeeds)) },
        { label: "Debt Payoff", value: "$" + formatNumber(Math.round(totalDebts)) },
        { label: "Education Funding", value: "$" + formatNumber(Math.round(educationNeeds)) },
        { label: "Final Expenses", value: "$" + formatNumber(finalExpenses) },
        { label: "Additional Coverage Needed", value: "$" + formatNumber(Math.round(additionalNeeded)) },
        { label: "Est. Monthly Premium (20-yr term)", value: "$" + formatNumber(Math.round(estMonthlyPremium20yr)) }
      ]
    };
  }`,
  [
    "Q: How much life insurance does a family need?||A: A common rule of thumb is 10-12 times your annual income, but a thorough needs analysis considering debts, education, and income replacement gives a more accurate figure.",
    "Q: What type of life insurance is best for families?||A: Term life insurance offers the most affordable coverage for families. A 20 or 30-year term policy provides protection during the years your family depends on your income.",
    "Q: Is employer-provided life insurance enough?||A: Employer coverage (typically 1-2x salary) is rarely sufficient for families. It also ends when you leave the job, so supplemental personal coverage is recommended."
  ],
  `Total Needs = (Annual Income x Years) + Debts + (Education x Children) + Final Expenses\nAdditional Needed = Total Needs - Existing Coverage`,
  ["estate-planning-cost-calculator", "family-emergency-fund-calculator", "maternity-leave-pay-calculator"]
);

add(
  "family-health-insurance-cost-calculator",
  "Family Health Insurance Cost Calculator",
  "Compare family health insurance plan costs by estimating premiums, deductibles, copays, and out-of-pocket maximums for different plan types.",
  "Finance",
  "finance",
  "$",
  ["health insurance cost", "family health plan", "insurance comparison", "health coverage cost", "medical insurance"],
  [
    '{ name: "planType", label: "Plan Type", type: "select", options: [{ value: "1", label: "HMO" }, { value: "2", label: "PPO" }, { value: "3", label: "HDHP with HSA" }, { value: "4", label: "EPO" }], defaultValue: "2" }',
    '{ name: "monthlyPremium", label: "Monthly Premium ($)", type: "number", min: 200, max: 3000, defaultValue: 800 }',
    '{ name: "deductible", label: "Annual Deductible ($)", type: "number", min: 0, max: 15000, defaultValue: 3000 }',
    '{ name: "expectedVisits", label: "Expected Doctor Visits/Year", type: "number", min: 0, max: 50, defaultValue: 12 }',
    '{ name: "copay", label: "Average Copay Per Visit ($)", type: "number", min: 0, max: 100, defaultValue: 30 }',
    '{ name: "oopMax", label: "Out-of-Pocket Maximum ($)", type: "number", min: 1000, max: 20000, defaultValue: 8000 }'
  ],
  `(inputs) => {
    const planType = inputs.planType as number;
    const monthlyPremium = inputs.monthlyPremium as number;
    const deductible = inputs.deductible as number;
    const expectedVisits = inputs.expectedVisits as number;
    const copay = inputs.copay as number;
    const oopMax = inputs.oopMax as number;
    const annualPremium = monthlyPremium * 12;
    const copayTotal = expectedVisits * copay;
    const estimatedOOP = Math.min(copayTotal + deductible, oopMax);
    const totalAnnualCost = annualPremium + estimatedOOP;
    const worstCase = annualPremium + oopMax;
    const planLabels = ["", "HMO", "PPO", "HDHP with HSA", "EPO"];
    const monthlyTotal = totalAnnualCost / 12;
    return {
      primary: { label: "Estimated Annual Cost", value: "$" + formatNumber(Math.round(totalAnnualCost)) },
      details: [
        { label: "Plan Type", value: planLabels[planType] },
        { label: "Annual Premiums", value: "$" + formatNumber(Math.round(annualPremium)) },
        { label: "Estimated Out-of-Pocket", value: "$" + formatNumber(Math.round(estimatedOOP)) },
        { label: "Monthly Total (Estimated)", value: "$" + formatNumber(Math.round(monthlyTotal)) },
        { label: "Worst Case (Max OOP)", value: "$" + formatNumber(Math.round(worstCase)) }
      ]
    };
  }`,
  [
    "Q: How much does family health insurance cost?||A: The average family health insurance premium is about $1,500-$2,000 per month for employer-sponsored plans, with the employer covering roughly 70% of the cost.",
    "Q: What is the difference between HMO and PPO?||A: HMO plans cost less but require referrals and in-network care. PPO plans offer more flexibility to see specialists and out-of-network providers at a higher cost.",
    "Q: What is an HDHP with HSA?||A: A High Deductible Health Plan paired with a Health Savings Account has lower premiums and higher deductibles. HSA contributions are tax-deductible and grow tax-free."
  ],
  `Annual Cost = (Monthly Premium x 12) + min(Copays + Deductible, OOP Max)\nWorst Case = Annual Premium + Out-of-Pocket Maximum`,
  ["family-life-insurance-calculator", "family-emergency-fund-calculator", "family-grocery-budget-calculator"]
);
