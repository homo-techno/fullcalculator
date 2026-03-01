// #51 Prenup Cost Calculator
add('prenup-cost-calculator', 'Prenup Cost Calculator',
  'Estimate the total cost of a prenuptial agreement based on complexity, location, and attorney fees.',
  'Finance', 'finance', '$',
  ['prenup cost', 'prenuptial agreement cost', 'prenup attorney fees'],
  [
    '{ name: "complexity", label: "Agreement Complexity", type: "select", options: [{value:"simple",label:"Simple (few assets)"},{value:"moderate",label:"Moderate"},{value:"complex",label:"Complex (many assets)"}], defaultValue: "moderate" }',
    '{ name: "hourlyRate", label: "Attorney Hourly Rate", type: "number", prefix: "$", min: 100, max: 1000, step: 25, defaultValue: 300 }',
    '{ name: "needsTwoAttorneys", label: "Both Parties Need Attorneys", type: "select", options: [{value:"yes",label:"Yes"},{value:"no",label:"No"}], defaultValue: "yes" }',
  ],
  `(inputs) => {
      const complexity = inputs.complexity as string;
      const rate = inputs.hourlyRate as number;
      const both = inputs.needsTwoAttorneys as string;
      if (!rate || rate <= 0) return null;
      const hours: Record<string, number> = { simple: 5, moderate: 10, complex: 20 };
      const baseHours = hours[complexity] || 10;
      const primaryCost = baseHours * rate;
      const secondaryCost = both === "yes" ? baseHours * rate * 0.8 : 0;
      const filingFees = 150;
      const totalCost = primaryCost + secondaryCost + filingFees;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Primary Attorney Cost", value: "$" + formatNumber(Math.round(primaryCost)) },
          { label: "Second Attorney Cost", value: "$" + formatNumber(Math.round(secondaryCost)) },
          { label: "Filing and Administrative Fees", value: "$" + formatNumber(filingFees) },
        ],
      };
    }`,
  [{ q: 'How much does a prenup typically cost?', a: 'A prenuptial agreement typically costs between $1,500 and $10,000 depending on the complexity of assets and the attorneys involved.' },
   { q: 'Do both parties need separate attorneys for a prenup?', a: 'It is strongly recommended that each party has independent legal counsel to ensure the agreement is enforceable and fair.' }],
  'Total Cost = (Attorney Hours x Hourly Rate) + Second Attorney Cost + Filing Fees',
  ['estate-tax-calculator', 'trust-fund-calculator']
);

// #52 Estate Tax Calculator
add('estate-tax-calculator', 'Estate Tax Calculator',
  'Estimate the federal estate tax liability based on the total value of an estate and applicable exemptions.',
  'Finance', 'finance', '$',
  ['estate tax', 'federal estate tax', 'death tax calculator'],
  [
    '{ name: "estateValue", label: "Total Estate Value", type: "number", prefix: "$", min: 0, max: 100000000, step: 10000, defaultValue: 15000000 }',
    '{ name: "exemption", label: "Federal Exemption Amount", type: "number", prefix: "$", min: 0, max: 50000000, step: 10000, defaultValue: 12920000 }',
    '{ name: "deductions", label: "Deductions (charitable, marital)", type: "number", prefix: "$", min: 0, max: 50000000, step: 10000, defaultValue: 500000 }',
  ],
  `(inputs) => {
      const estate = inputs.estateValue as number;
      const exemption = inputs.exemption as number;
      const deductions = inputs.deductions as number;
      if (!estate || estate <= 0) return null;
      const taxableEstate = Math.max(0, estate - exemption - deductions);
      const taxRate = 0.40;
      const estimatedTax = taxableEstate * taxRate;
      const effectiveRate = estate > 0 ? (estimatedTax / estate) * 100 : 0;
      return {
        primary: { label: "Estimated Estate Tax", value: "$" + formatNumber(Math.round(estimatedTax)) },
        details: [
          { label: "Taxable Estate", value: "$" + formatNumber(Math.round(taxableEstate)) },
          { label: "Federal Tax Rate", value: "40%" },
          { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 100) / 100) + "%" },
        ],
      };
    }`,
  [{ q: 'What is the federal estate tax exemption?', a: 'The federal estate tax exemption is approximately $12.92 million per individual as of 2023. Estates valued below this threshold are not subject to federal estate tax.' },
   { q: 'What is the federal estate tax rate?', a: 'The top federal estate tax rate is 40 percent, applied to the value of the estate that exceeds the exemption amount.' }],
  'Estimated Tax = (Estate Value - Exemption - Deductions) x 40%',
  ['inheritance-tax-calculator', 'trust-fund-calculator']
);

// #53 Inheritance Tax Calculator
add('inheritance-tax-calculator', 'Inheritance Tax Calculator',
  'Estimate state inheritance tax based on the inheritance amount, relationship to the deceased, and state rates.',
  'Finance', 'finance', '$',
  ['inheritance tax', 'state inheritance tax', 'beneficiary tax calculator'],
  [
    '{ name: "inheritanceAmount", label: "Inheritance Amount", type: "number", prefix: "$", min: 0, max: 50000000, step: 5000, defaultValue: 500000 }',
    '{ name: "relationship", label: "Relationship to Deceased", type: "select", options: [{value:"spouse",label:"Spouse"},{value:"child",label:"Child or Grandchild"},{value:"sibling",label:"Sibling"},{value:"other",label:"Other Beneficiary"}], defaultValue: "child" }',
    '{ name: "stateRate", label: "State Tax Rate", type: "number", suffix: "%", min: 0, max: 20, step: 0.5, defaultValue: 10 }',
  ],
  `(inputs) => {
      const amount = inputs.inheritanceAmount as number;
      const relationship = inputs.relationship as string;
      const stateRate = inputs.stateRate as number;
      if (!amount || amount <= 0) return null;
      const exemptions: Record<string, number> = { spouse: amount, child: 50000, sibling: 25000, other: 10000 };
      const exemption = exemptions[relationship] || 10000;
      const taxableAmount = Math.max(0, amount - exemption);
      const taxOwed = taxableAmount * (stateRate / 100);
      const netInheritance = amount - taxOwed;
      return {
        primary: { label: "Estimated Inheritance Tax", value: "$" + formatNumber(Math.round(taxOwed)) },
        details: [
          { label: "Exemption Amount", value: "$" + formatNumber(exemption) },
          { label: "Taxable Amount", value: "$" + formatNumber(Math.round(taxableAmount)) },
          { label: "Net Inheritance", value: "$" + formatNumber(Math.round(netInheritance)) },
        ],
      };
    }`,
  [{ q: 'Which states have an inheritance tax?', a: 'As of 2023, six states impose an inheritance tax: Iowa, Kentucky, Maryland, Nebraska, New Jersey, and Pennsylvania. Rates and exemptions vary by state.' },
   { q: 'Are spouses exempt from inheritance tax?', a: 'In all states that impose an inheritance tax, surviving spouses are fully exempt from the tax.' }],
  'Tax Owed = (Inheritance - Exemption) x State Tax Rate',
  ['estate-tax-calculator', 'trust-fund-calculator']
);

// #54 Trust Fund Calculator
add('trust-fund-calculator', 'Trust Fund Calculator',
  'Project the growth of a trust fund over time based on the initial deposit, contributions, and rate of return.',
  'Finance', 'finance', '$',
  ['trust fund growth', 'trust fund calculator', 'trust investment projection'],
  [
    '{ name: "initialDeposit", label: "Initial Trust Deposit", type: "number", prefix: "$", min: 0, max: 50000000, step: 1000, defaultValue: 250000 }',
    '{ name: "annualContribution", label: "Annual Contribution", type: "number", prefix: "$", min: 0, max: 1000000, step: 500, defaultValue: 10000 }',
    '{ name: "years", label: "Time Horizon", type: "number", suffix: "years", min: 1, max: 50, defaultValue: 18 }',
    '{ name: "returnRate", label: "Expected Annual Return", type: "number", suffix: "%", min: 0, max: 15, step: 0.5, defaultValue: 6 }',
  ],
  `(inputs) => {
      const initial = inputs.initialDeposit as number;
      const annual = inputs.annualContribution as number;
      const years = inputs.years as number;
      const rate = (inputs.returnRate as number) / 100;
      if (!years || years <= 0) return null;
      let balance = initial || 0;
      let totalContributions = initial || 0;
      for (let i = 0; i < years; i++) {
        balance = balance * (1 + rate) + annual;
        totalContributions += annual;
      }
      const totalGrowth = balance - totalContributions;
      return {
        primary: { label: "Projected Trust Value", value: "$" + formatNumber(Math.round(balance)) },
        details: [
          { label: "Total Contributions", value: "$" + formatNumber(Math.round(totalContributions)) },
          { label: "Investment Growth", value: "$" + formatNumber(Math.round(totalGrowth)) },
          { label: "Growth Percentage", value: formatNumber(Math.round((totalGrowth / totalContributions) * 10000) / 100) + "%" },
        ],
      };
    }`,
  [{ q: 'What is a trust fund?', a: 'A trust fund is a legal entity that holds assets on behalf of a beneficiary, managed by a trustee according to the terms established by the grantor.' },
   { q: 'What rate of return should I expect from a trust fund?', a: 'Trust funds invested in a diversified portfolio typically earn between 5 and 8 percent annually over the long term, depending on the asset allocation.' }],
  'Future Value = Initial x (1 + Rate)^Years + Annual Contribution x [((1 + Rate)^Years - 1) / Rate]',
  ['estate-tax-calculator', 'inheritance-tax-calculator']
);

// #55 Power of Attorney Cost Calculator
add('power-of-attorney-cost-calculator', 'Power of Attorney Cost Calculator',
  'Estimate the legal costs for establishing a power of attorney document based on type and preparation method.',
  'Finance', 'finance', '$',
  ['power of attorney cost', 'POA cost', 'legal power of attorney fees'],
  [
    '{ name: "poaType", label: "Type of POA", type: "select", options: [{value:"financial",label:"Financial POA"},{value:"healthcare",label:"Healthcare POA"},{value:"both",label:"Both Financial and Healthcare"},{value:"durable",label:"Durable POA"}], defaultValue: "both" }',
    '{ name: "prepMethod", label: "Preparation Method", type: "select", options: [{value:"online",label:"Online Legal Service"},{value:"attorney",label:"Attorney Prepared"},{value:"selfFile",label:"Self-Prepared with Notary"}], defaultValue: "attorney" }',
    '{ name: "state", label: "Notary and Filing Complexity", type: "select", options: [{value:"low",label:"Low Cost State"},{value:"medium",label:"Medium Cost State"},{value:"high",label:"High Cost State"}], defaultValue: "medium" }',
  ],
  `(inputs) => {
      const poaType = inputs.poaType as string;
      const method = inputs.prepMethod as string;
      const costLevel = inputs.state as string;
      const typeCosts: Record<string, number> = { financial: 1, healthcare: 1, both: 1.6, durable: 1.2 };
      const methodCosts: Record<string, number> = { online: 150, attorney: 500, selfFile: 50 };
      const stateMod: Record<string, number> = { low: 0.8, medium: 1.0, high: 1.3 };
      const baseCost = (methodCosts[method] || 500) * (typeCosts[poaType] || 1) * (stateMod[costLevel] || 1);
      const notaryFee = 25;
      const totalCost = baseCost + notaryFee;
      return {
        primary: { label: "Estimated POA Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Legal Preparation Fee", value: "$" + formatNumber(Math.round(baseCost)) },
          { label: "Notary Fee", value: "$" + formatNumber(notaryFee) },
          { label: "Preparation Method", value: method === "attorney" ? "Attorney" : method === "online" ? "Online Service" : "Self-Prepared" },
        ],
      };
    }`,
  [{ q: 'How much does a power of attorney cost?', a: 'A power of attorney can cost anywhere from $50 for a self-prepared document to $500 or more when prepared by an attorney, depending on complexity.' },
   { q: 'What is the difference between a regular and durable POA?', a: 'A regular POA becomes invalid if you become incapacitated, while a durable POA remains in effect even if you lose the ability to make decisions for yourself.' }],
  'Total Cost = Base Preparation Fee x Type Multiplier x State Modifier + Notary Fee',
  ['estate-tax-calculator', 'prenup-cost-calculator']
);

// #56 LLC Cost Calculator
add('llc-cost-calculator', 'LLC Cost Calculator',
  'Calculate the total first-year and ongoing annual costs of forming and maintaining a limited liability company.',
  'Finance', 'finance', '$',
  ['LLC cost', 'LLC formation cost', 'start an LLC cost'],
  [
    '{ name: "filingFee", label: "State Filing Fee", type: "number", prefix: "$", min: 0, max: 2000, step: 10, defaultValue: 150 }',
    '{ name: "registeredAgent", label: "Registered Agent Annual Fee", type: "number", prefix: "$", min: 0, max: 500, step: 10, defaultValue: 125 }',
    '{ name: "annualReport", label: "Annual Report Fee", type: "number", prefix: "$", min: 0, max: 1000, step: 10, defaultValue: 50 }',
    '{ name: "operatingAgreement", label: "Operating Agreement Prep Cost", type: "number", prefix: "$", min: 0, max: 3000, step: 50, defaultValue: 500 }',
  ],
  `(inputs) => {
      const filing = inputs.filingFee as number;
      const agent = inputs.registeredAgent as number;
      const annual = inputs.annualReport as number;
      const opAgreement = inputs.operatingAgreement as number;
      const firstYearCost = filing + agent + opAgreement + annual;
      const annualOngoing = agent + annual;
      const fiveYearCost = firstYearCost + annualOngoing * 4;
      return {
        primary: { label: "First Year Total Cost", value: "$" + formatNumber(Math.round(firstYearCost)) },
        details: [
          { label: "Annual Ongoing Cost", value: "$" + formatNumber(Math.round(annualOngoing)) },
          { label: "5-Year Total Cost", value: "$" + formatNumber(Math.round(fiveYearCost)) },
          { label: "One-Time Formation Costs", value: "$" + formatNumber(Math.round(filing + opAgreement)) },
        ],
      };
    }`,
  [{ q: 'How much does it cost to start an LLC?', a: 'LLC formation costs vary by state, typically ranging from $50 to $500 for the filing fee alone. Total first-year costs including a registered agent and operating agreement usually run $500 to $2,000.' },
   { q: 'Do I need a registered agent for my LLC?', a: 'Yes, every state requires an LLC to have a registered agent with a physical address in that state to receive legal documents on behalf of the company.' }],
  'First Year Cost = Filing Fee + Registered Agent + Operating Agreement + Annual Report Fee',
  ['s-corp-tax-savings-calculator', 'business-valuation-calculator']
);

// #57 S-Corp Tax Savings Calculator
add('s-corp-tax-savings-calculator', 'S-Corp Tax Savings Calculator',
  'Compare the self-employment tax burden of a sole proprietorship versus an S-corporation election.',
  'Finance', 'finance', '$',
  ['S-corp tax savings', 'S-corp vs sole proprietor', 'self employment tax savings'],
  [
    '{ name: "netIncome", label: "Annual Net Business Income", type: "number", prefix: "$", min: 0, max: 5000000, step: 1000, defaultValue: 150000 }',
    '{ name: "reasonableSalary", label: "Reasonable S-Corp Salary", type: "number", prefix: "$", min: 0, max: 5000000, step: 1000, defaultValue: 80000 }',
    '{ name: "additionalCosts", label: "Additional S-Corp Annual Costs", type: "number", prefix: "$", min: 0, max: 20000, step: 100, defaultValue: 3000 }',
  ],
  `(inputs) => {
      const income = inputs.netIncome as number;
      const salary = inputs.reasonableSalary as number;
      const costs = inputs.additionalCosts as number;
      if (!income || income <= 0) return null;
      const seTaxRate = 0.153;
      const soleProprietorSETax = income * 0.9235 * seTaxRate;
      const sCorpSETax = salary * seTaxRate;
      const taxSavings = soleProprietorSETax - sCorpSETax - costs;
      const distribution = income - salary;
      return {
        primary: { label: "Estimated Annual Tax Savings", value: "$" + formatNumber(Math.round(Math.max(0, taxSavings))) },
        details: [
          { label: "Sole Proprietor SE Tax", value: "$" + formatNumber(Math.round(soleProprietorSETax)) },
          { label: "S-Corp Payroll Tax", value: "$" + formatNumber(Math.round(sCorpSETax)) },
          { label: "S-Corp Distributions (not subject to SE tax)", value: "$" + formatNumber(Math.round(distribution)) },
        ],
      };
    }`,
  [{ q: 'When does an S-corp election make sense?', a: 'An S-corp election generally becomes beneficial when your net business income exceeds $50,000 to $60,000 per year, as the self-employment tax savings begin to outweigh the additional administrative costs.' },
   { q: 'What is a reasonable salary for an S-corp?', a: 'The IRS requires S-corp owners to pay themselves a reasonable salary comparable to what other businesses pay for similar services. This is typically 50 to 70 percent of net income.' }],
  'Tax Savings = (Net Income x 0.9235 x 15.3%) - (Salary x 15.3%) - Additional S-Corp Costs',
  ['llc-cost-calculator', 'business-valuation-calculator']
);

// #58 Business Valuation Calculator
add('business-valuation-calculator', 'Business Valuation Calculator',
  'Estimate the value of a business using an earnings multiplier approach based on annual revenue and profit.',
  'Finance', 'finance', '$',
  ['business valuation', 'business worth calculator', 'company valuation'],
  [
    '{ name: "annualRevenue", label: "Annual Revenue", type: "number", prefix: "$", min: 0, max: 100000000, step: 10000, defaultValue: 1000000 }',
    '{ name: "annualProfit", label: "Annual Net Profit (SDE)", type: "number", prefix: "$", min: 0, max: 50000000, step: 5000, defaultValue: 250000 }',
    '{ name: "industryMultiplier", label: "Industry Multiplier", type: "select", options: [{value:"1.5",label:"1.5x (Service Business)"},{value:"2.5",label:"2.5x (Retail/Restaurant)"},{value:"3.5",label:"3.5x (Professional Services)"},{value:"5",label:"5x (Technology/SaaS)"}], defaultValue: "2.5" }',
  ],
  `(inputs) => {
      const revenue = inputs.annualRevenue as number;
      const profit = inputs.annualProfit as number;
      const multiplier = parseFloat(inputs.industryMultiplier as string);
      if (!revenue || !profit || revenue <= 0 || profit <= 0) return null;
      const earningsValuation = profit * multiplier;
      const revenueValuation = revenue * (multiplier * 0.4);
      const averageValuation = (earningsValuation + revenueValuation) / 2;
      const profitMargin = (profit / revenue) * 100;
      return {
        primary: { label: "Estimated Business Value", value: "$" + formatNumber(Math.round(averageValuation)) },
        details: [
          { label: "Earnings-Based Valuation", value: "$" + formatNumber(Math.round(earningsValuation)) },
          { label: "Revenue-Based Valuation", value: "$" + formatNumber(Math.round(revenueValuation)) },
          { label: "Profit Margin", value: formatNumber(Math.round(profitMargin * 10) / 10) + "%" },
        ],
      };
    }`,
  [{ q: 'How is a small business typically valued?', a: 'Small businesses are most commonly valued using a multiple of seller discretionary earnings (SDE), typically ranging from 1.5x to 5x depending on the industry, growth rate, and risk profile.' },
   { q: 'What is seller discretionary earnings?', a: 'Seller discretionary earnings (SDE) is the pre-tax net income of a business plus the owner salary, benefits, and any non-recurring or personal expenses run through the business.' }],
  'Business Value = (Profit x Industry Multiplier + Revenue x Multiplier x 0.4) / 2',
  ['franchise-cost-calculator', 's-corp-tax-savings-calculator']
);

// #59 Franchise Cost Calculator
add('franchise-cost-calculator', 'Franchise Cost Calculator',
  'Estimate the total investment needed to open a franchise including fees, buildout, and working capital.',
  'Finance', 'finance', '$',
  ['franchise cost', 'franchise investment', 'franchise startup cost'],
  [
    '{ name: "franchiseFee", label: "Initial Franchise Fee", type: "number", prefix: "$", min: 0, max: 500000, step: 1000, defaultValue: 35000 }',
    '{ name: "buildoutCost", label: "Buildout and Equipment Cost", type: "number", prefix: "$", min: 0, max: 2000000, step: 5000, defaultValue: 250000 }',
    '{ name: "workingCapital", label: "Working Capital (6 months)", type: "number", prefix: "$", min: 0, max: 500000, step: 1000, defaultValue: 75000 }',
    '{ name: "royaltyRate", label: "Ongoing Royalty Rate", type: "number", suffix: "%", min: 0, max: 15, step: 0.5, defaultValue: 6 }',
  ],
  `(inputs) => {
      const fee = inputs.franchiseFee as number;
      const buildout = inputs.buildoutCost as number;
      const working = inputs.workingCapital as number;
      const royalty = inputs.royaltyRate as number;
      const totalInitial = fee + buildout + working;
      const estimatedAnnualRevenue = totalInitial * 1.5;
      const annualRoyalty = estimatedAnnualRevenue * (royalty / 100);
      const fiveYearRoyalty = annualRoyalty * 5;
      return {
        primary: { label: "Total Initial Investment", value: "$" + formatNumber(Math.round(totalInitial)) },
        details: [
          { label: "Franchise Fee", value: "$" + formatNumber(Math.round(fee)) },
          { label: "Estimated Annual Royalty", value: "$" + formatNumber(Math.round(annualRoyalty)) },
          { label: "5-Year Royalty Obligation", value: "$" + formatNumber(Math.round(fiveYearRoyalty)) },
        ],
      };
    }`,
  [{ q: 'What are the typical costs to open a franchise?', a: 'Total franchise investment typically ranges from $100,000 for a small service franchise to over $1 million for a restaurant or hotel franchise, including the franchise fee, buildout, equipment, and working capital.' },
   { q: 'What is a franchise royalty fee?', a: 'A franchise royalty fee is an ongoing percentage of gross revenue (typically 4 to 8 percent) paid to the franchisor for the right to use the brand, systems, and ongoing support.' }],
  'Total Investment = Franchise Fee + Buildout Cost + Working Capital',
  ['business-valuation-calculator', 'llc-cost-calculator']
);

// #60 Commercial Insurance Calculator
add('commercial-insurance-calculator', 'Commercial Insurance Calculator',
  'Estimate commercial business insurance premiums based on business type, revenue, and coverage needs.',
  'Finance', 'finance', '$',
  ['commercial insurance cost', 'business insurance calculator', 'commercial insurance premium'],
  [
    '{ name: "businessType", label: "Business Type", type: "select", options: [{value:"office",label:"Office/Professional"},{value:"retail",label:"Retail Store"},{value:"restaurant",label:"Restaurant"},{value:"construction",label:"Construction"}], defaultValue: "office" }',
    '{ name: "annualRevenue", label: "Annual Revenue", type: "number", prefix: "$", min: 0, max: 50000000, step: 10000, defaultValue: 500000 }',
    '{ name: "employees", label: "Number of Employees", type: "number", suffix: "employees", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "coverageLevel", label: "Coverage Level", type: "select", options: [{value:"basic",label:"Basic"},{value:"standard",label:"Standard"},{value:"comprehensive",label:"Comprehensive"}], defaultValue: "standard" }',
  ],
  `(inputs) => {
      const bizType = inputs.businessType as string;
      const revenue = inputs.annualRevenue as number;
      const employees = inputs.employees as number;
      const coverage = inputs.coverageLevel as string;
      if (!revenue || revenue <= 0) return null;
      const baseRates: Record<string, number> = { office: 0.004, retail: 0.006, restaurant: 0.008, construction: 0.012 };
      const coverageMod: Record<string, number> = { basic: 0.7, standard: 1.0, comprehensive: 1.4 };
      const glPremium = revenue * (baseRates[bizType] || 0.006) * (coverageMod[coverage] || 1.0);
      const wcPremium = employees * 800 * (bizType === "construction" ? 2.5 : 1.0);
      const propertyPremium = revenue * 0.002;
      const totalAnnual = glPremium + wcPremium + propertyPremium;
      const monthlyPremium = totalAnnual / 12;
      return {
        primary: { label: "Estimated Annual Premium", value: "$" + formatNumber(Math.round(totalAnnual)) },
        details: [
          { label: "Monthly Premium", value: "$" + formatNumber(Math.round(monthlyPremium)) },
          { label: "General Liability", value: "$" + formatNumber(Math.round(glPremium)) },
          { label: "Workers Compensation", value: "$" + formatNumber(Math.round(wcPremium)) },
        ],
      };
    }`,
  [{ q: 'What types of commercial insurance does a business need?', a: 'Most businesses need general liability insurance, commercial property insurance, and workers compensation. Depending on the industry, you may also need professional liability, commercial auto, or cyber liability coverage.' },
   { q: 'How much does commercial insurance cost for a small business?', a: 'Small business insurance typically costs between $500 and $5,000 per year for general liability alone. Total annual premiums including all coverage types often range from $2,000 to $15,000.' }],
  'Total Premium = General Liability + Workers Comp + Property Insurance',
  ['workers-comp-calculator', 'llc-cost-calculator']
);

// #61 Land Clearing Cost Calculator
add('land-clearing-cost-calculator', 'Land Clearing Cost Calculator',
  'Estimate land clearing costs per acre based on terrain type, vegetation density, and debris removal needs.',
  'Everyday', 'everyday', '~',
  ['land clearing cost', 'lot clearing cost per acre', 'brush clearing estimate'],
  [
    '{ name: "acres", label: "Acreage to Clear", type: "number", suffix: "acres", min: 0.1, max: 500, step: 0.1, defaultValue: 2 }',
    '{ name: "terrain", label: "Terrain Type", type: "select", options: [{value:"flat",label:"Flat with Light Brush"},{value:"moderate",label:"Moderate Trees and Brush"},{value:"heavy",label:"Heavy Timber and Stumps"},{value:"rocky",label:"Rocky with Heavy Timber"}], defaultValue: "moderate" }',
    '{ name: "debrisRemoval", label: "Debris Removal Method", type: "select", options: [{value:"burn",label:"On-site Burning"},{value:"haul",label:"Haul Away"},{value:"chip",label:"Chip and Mulch"}], defaultValue: "chip" }',
  ],
  `(inputs) => {
      const acres = inputs.acres as number;
      const terrain = inputs.terrain as string;
      const debris = inputs.debrisRemoval as string;
      if (!acres || acres <= 0) return null;
      const terrainCost: Record<string, number> = { flat: 1500, moderate: 3500, heavy: 6000, rocky: 8500 };
      const debrisCost: Record<string, number> = { burn: 200, haul: 1200, chip: 800 };
      const clearingCost = acres * (terrainCost[terrain] || 3500);
      const removalCost = acres * (debrisCost[debris] || 800);
      const totalCost = clearingCost + removalCost;
      const costPerAcre = totalCost / acres;
      return {
        primary: { label: "Total Clearing Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Cost per Acre", value: "$" + formatNumber(Math.round(costPerAcre)) },
          { label: "Clearing Labor and Equipment", value: "$" + formatNumber(Math.round(clearingCost)) },
          { label: "Debris Removal Cost", value: "$" + formatNumber(Math.round(removalCost)) },
        ],
      };
    }`,
  [{ q: 'How much does land clearing cost per acre?', a: 'Land clearing costs typically range from $1,500 per acre for flat land with light brush to over $8,000 per acre for heavily wooded or rocky terrain.' },
   { q: 'What is the cheapest way to clear land?', a: 'On-site burning is usually the least expensive debris removal method, but it requires a burn permit and is not allowed in all areas. Mulching is often the best balance of cost and environmental benefit.' }],
  'Total Cost = (Acres x Terrain Cost per Acre) + (Acres x Debris Removal Cost per Acre)',
  ['well-drilling-cost-calculator', 'septic-installation-cost-calculator']
);

// #62 Well Drilling Cost Calculator
add('well-drilling-cost-calculator', 'Well Drilling Cost Calculator',
  'Estimate the total cost of drilling a residential water well based on depth, diameter, and pump requirements.',
  'Everyday', 'everyday', '~',
  ['well drilling cost', 'water well cost', 'well installation estimate'],
  [
    '{ name: "depth", label: "Estimated Well Depth", type: "number", suffix: "feet", min: 25, max: 1000, step: 25, defaultValue: 200 }',
    '{ name: "diameter", label: "Well Diameter", type: "select", options: [{value:"4",label:"4 inches (residential)"},{value:"6",label:"6 inches (standard)"},{value:"8",label:"8 inches (high capacity)"}], defaultValue: "6" }',
    '{ name: "pumpType", label: "Pump Type", type: "select", options: [{value:"submersible",label:"Submersible Pump"},{value:"jet",label:"Jet Pump"},{value:"hand",label:"Hand Pump"}], defaultValue: "submersible" }',
  ],
  `(inputs) => {
      const depth = inputs.depth as number;
      const diameter = inputs.diameter as string;
      const pumpType = inputs.pumpType as string;
      if (!depth || depth <= 0) return null;
      const costPerFoot: Record<string, number> = { "4": 25, "6": 35, "8": 50 };
      const pumpCost: Record<string, number> = { submersible: 2500, jet: 1500, hand: 500 };
      const drillingCost = depth * (costPerFoot[diameter] || 35);
      const pump = pumpCost[pumpType] || 2500;
      const casing = depth * 10;
      const permits = 500;
      const totalCost = drillingCost + pump + casing + permits;
      return {
        primary: { label: "Total Well Installation Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Drilling Cost", value: "$" + formatNumber(Math.round(drillingCost)) },
          { label: "Pump and Installation", value: "$" + formatNumber(Math.round(pump)) },
          { label: "Casing and Permits", value: "$" + formatNumber(Math.round(casing + permits)) },
        ],
      };
    }`,
  [{ q: 'How much does it cost to drill a well?', a: 'Residential well drilling typically costs between $5,000 and $15,000, with most homeowners paying around $25 to $50 per foot of depth for drilling alone.' },
   { q: 'How deep does a residential well need to be?', a: 'Residential wells typically range from 100 to 400 feet deep, depending on the local water table depth. Some areas may require depths of 500 feet or more.' }],
  'Total Cost = (Depth x Cost per Foot) + Pump Cost + (Depth x Casing Cost) + Permits',
  ['septic-installation-cost-calculator', 'land-clearing-cost-calculator']
);

// #63 Septic Installation Cost Calculator
add('septic-installation-cost-calculator', 'Septic Installation Cost Calculator',
  'Estimate the cost of installing a new septic system based on system type, tank size, and soil conditions.',
  'Everyday', 'everyday', '~',
  ['septic system cost', 'septic installation cost', 'septic tank installation estimate'],
  [
    '{ name: "systemType", label: "System Type", type: "select", options: [{value:"conventional",label:"Conventional Gravity"},{value:"chamber",label:"Chamber System"},{value:"mound",label:"Mound System"},{value:"aerobic",label:"Aerobic Treatment"}], defaultValue: "conventional" }',
    '{ name: "tankSize", label: "Tank Size", type: "select", options: [{value:"750",label:"750 gallon (1-2 bedrooms)"},{value:"1000",label:"1000 gallon (3 bedrooms)"},{value:"1250",label:"1250 gallon (4 bedrooms)"},{value:"1500",label:"1500 gallon (5+ bedrooms)"}], defaultValue: "1000" }',
    '{ name: "soilCondition", label: "Soil Condition", type: "select", options: [{value:"ideal",label:"Sandy/Loamy (ideal)"},{value:"moderate",label:"Clay Mix (moderate)"},{value:"poor",label:"Heavy Clay or Rock (poor)"}], defaultValue: "moderate" }',
  ],
  `(inputs) => {
      const sType = inputs.systemType as string;
      const tankSize = parseInt(inputs.tankSize as string);
      const soil = inputs.soilCondition as string;
      const systemCosts: Record<string, number> = { conventional: 5000, chamber: 7000, mound: 12000, aerobic: 15000 };
      const tankCosts: Record<number, number> = { 750: 800, 1000: 1100, 1250: 1400, 1500: 1800 };
      const soilMod: Record<string, number> = { ideal: 1.0, moderate: 1.3, poor: 1.8 };
      const baseCost = (systemCosts[sType] || 5000) * (soilMod[soil] || 1.3);
      const tankCost = tankCosts[tankSize] || 1100;
      const permitCost = 750;
      const totalCost = baseCost + tankCost + permitCost;
      return {
        primary: { label: "Total Septic Installation Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "System and Drain Field", value: "$" + formatNumber(Math.round(baseCost)) },
          { label: "Tank Cost", value: "$" + formatNumber(Math.round(tankCost)) },
          { label: "Permits and Inspection", value: "$" + formatNumber(permitCost) },
        ],
      };
    }`,
  [{ q: 'How much does a septic system cost to install?', a: 'A new septic system typically costs between $5,000 for a basic conventional system to over $20,000 for an aerobic treatment unit, depending on soil conditions and local requirements.' },
   { q: 'How long does a septic system last?', a: 'A well-maintained septic system can last 25 to 30 years. The tank itself may last even longer, while the drain field typically needs replacement after 20 to 25 years.' }],
  'Total Cost = (System Base Cost x Soil Modifier) + Tank Cost + Permit Fees',
  ['well-drilling-cost-calculator', 'land-clearing-cost-calculator']
);

// #64 Property Line Survey Calculator
add('property-line-survey-calculator', 'Property Line Survey Calculator',
  'Estimate the cost of a property line or boundary survey based on lot size, terrain, and survey type.',
  'Finance', 'finance', '$',
  ['property survey cost', 'land survey cost', 'boundary survey estimate'],
  [
    '{ name: "lotSize", label: "Lot Size", type: "number", suffix: "acres", min: 0.1, max: 500, step: 0.1, defaultValue: 1 }',
    '{ name: "surveyType", label: "Survey Type", type: "select", options: [{value:"boundary",label:"Boundary Survey"},{value:"topographic",label:"Topographic Survey"},{value:"alta",label:"ALTA/NSPS Survey"},{value:"subdivision",label:"Subdivision Plat"}], defaultValue: "boundary" }',
    '{ name: "terrain", label: "Terrain Difficulty", type: "select", options: [{value:"easy",label:"Flat, Clear Access"},{value:"moderate",label:"Some Slopes or Vegetation"},{value:"difficult",label:"Steep, Dense Vegetation"}], defaultValue: "moderate" }',
  ],
  `(inputs) => {
      const lotSize = inputs.lotSize as number;
      const surveyType = inputs.surveyType as string;
      const terrain = inputs.terrain as string;
      if (!lotSize || lotSize <= 0) return null;
      const baseCost: Record<string, number> = { boundary: 400, topographic: 800, alta: 2000, subdivision: 3000 };
      const perAcreCost: Record<string, number> = { boundary: 100, topographic: 200, alta: 300, subdivision: 500 };
      const terrainMod: Record<string, number> = { easy: 1.0, moderate: 1.25, difficult: 1.6 };
      const cost = ((baseCost[surveyType] || 400) + lotSize * (perAcreCost[surveyType] || 100)) * (terrainMod[terrain] || 1.25);
      const timeEstimate = surveyType === "alta" || surveyType === "subdivision" ? "2-4 weeks" : "1-2 weeks";
      return {
        primary: { label: "Estimated Survey Cost", value: "$" + formatNumber(Math.round(cost)) },
        details: [
          { label: "Survey Type", value: surveyType === "alta" ? "ALTA/NSPS" : surveyType.charAt(0).toUpperCase() + surveyType.slice(1) },
          { label: "Lot Size", value: formatNumber(lotSize) + " acres" },
          { label: "Estimated Turnaround", value: timeEstimate },
        ],
      };
    }`,
  [{ q: 'How much does a property survey cost?', a: 'A basic boundary survey for a standard residential lot typically costs $300 to $800. Larger lots, ALTA surveys, and difficult terrain can increase the cost to $2,000 or more.' },
   { q: 'When do you need a property survey?', a: 'Property surveys are commonly needed when buying or selling land, resolving boundary disputes, building a fence or structure near a property line, or subdividing land.' }],
  'Survey Cost = (Base Fee + Lot Size x Per Acre Rate) x Terrain Modifier',
  ['home-appraisal-cost-calculator', 'title-insurance-calculator']
);

// #65 Home Appraisal Cost Calculator
add('home-appraisal-cost-calculator', 'Home Appraisal Cost Calculator',
  'Estimate home appraisal fees based on property type, size, and appraisal purpose.',
  'Finance', 'finance', '$',
  ['home appraisal cost', 'appraisal fee estimate', 'property appraisal cost'],
  [
    '{ name: "propertyType", label: "Property Type", type: "select", options: [{value:"singleFamily",label:"Single Family Home"},{value:"condo",label:"Condo or Townhouse"},{value:"multiUnit",label:"Multi-Unit (2-4 units)"},{value:"luxury",label:"Luxury or Unique Property"}], defaultValue: "singleFamily" }',
    '{ name: "sqft", label: "Square Footage", type: "number", suffix: "sq ft", min: 500, max: 20000, step: 100, defaultValue: 2000 }',
    '{ name: "purpose", label: "Appraisal Purpose", type: "select", options: [{value:"purchase",label:"Home Purchase"},{value:"refinance",label:"Refinance"},{value:"heloc",label:"HELOC"},{value:"estate",label:"Estate or Legal"}], defaultValue: "purchase" }',
  ],
  `(inputs) => {
      const propType = inputs.propertyType as string;
      const sqft = inputs.sqft as number;
      const purpose = inputs.purpose as string;
      if (!sqft || sqft <= 0) return null;
      const baseFee: Record<string, number> = { singleFamily: 400, condo: 350, multiUnit: 600, luxury: 800 };
      const sizeMod = sqft > 3000 ? 1.2 : sqft > 5000 ? 1.5 : 1.0;
      const purposeMod: Record<string, number> = { purchase: 1.0, refinance: 1.0, heloc: 0.9, estate: 1.3 };
      const fee = (baseFee[propType] || 400) * sizeMod * (purposeMod[purpose] || 1.0);
      const rushFee = fee * 1.5;
      return {
        primary: { label: "Standard Appraisal Fee", value: "$" + formatNumber(Math.round(fee)) },
        details: [
          { label: "Rush Appraisal Fee", value: "$" + formatNumber(Math.round(rushFee)) },
          { label: "Property Type", value: propType === "singleFamily" ? "Single Family" : propType === "multiUnit" ? "Multi-Unit" : propType.charAt(0).toUpperCase() + propType.slice(1) },
          { label: "Typical Turnaround", value: "5-10 business days" },
        ],
      };
    }`,
  [{ q: 'How much does a home appraisal cost?', a: 'A standard home appraisal for a single family home typically costs between $300 and $500. Multi-unit properties, luxury homes, and estate appraisals can cost $600 to $1,000 or more.' },
   { q: 'Who pays for the home appraisal?', a: 'In a home purchase, the buyer typically pays for the appraisal as part of the mortgage process. For a refinance, the homeowner is responsible for the appraisal fee.' }],
  'Appraisal Fee = Base Fee x Size Modifier x Purpose Modifier',
  ['title-insurance-calculator', 'property-line-survey-calculator']
);

// #66 Title Insurance Calculator
add('title-insurance-calculator', 'Title Insurance Calculator',
  'Estimate title insurance premiums for a real estate transaction based on property value and policy type.',
  'Finance', 'finance', '$',
  ['title insurance cost', 'title insurance calculator', 'title insurance premium'],
  [
    '{ name: "propertyValue", label: "Property Purchase Price", type: "number", prefix: "$", min: 10000, max: 10000000, step: 5000, defaultValue: 350000 }',
    '{ name: "policyType", label: "Policy Type", type: "select", options: [{value:"lender",label:"Lender Policy Only"},{value:"owner",label:"Owner Policy Only"},{value:"both",label:"Both Lender and Owner"}], defaultValue: "both" }',
    '{ name: "loanAmount", label: "Loan Amount", type: "number", prefix: "$", min: 0, max: 10000000, step: 5000, defaultValue: 280000 }',
  ],
  `(inputs) => {
      const value = inputs.propertyValue as number;
      const policyType = inputs.policyType as string;
      const loan = inputs.loanAmount as number;
      if (!value || value <= 0) return null;
      const ownerRate = 0.005;
      const lenderRate = 0.0035;
      const ownerPremium = value * ownerRate;
      const lenderPremium = loan * lenderRate;
      let totalPremium = 0;
      if (policyType === "owner") totalPremium = ownerPremium;
      else if (policyType === "lender") totalPremium = lenderPremium;
      else totalPremium = ownerPremium + lenderPremium * 0.6;
      const searchFee = 250;
      const totalCost = totalPremium + searchFee;
      return {
        primary: { label: "Estimated Title Insurance Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Owner Policy Premium", value: "$" + formatNumber(Math.round(ownerPremium)) },
          { label: "Lender Policy Premium", value: "$" + formatNumber(Math.round(lenderPremium)) },
          { label: "Title Search Fee", value: "$" + formatNumber(searchFee) },
        ],
      };
    }`,
  [{ q: 'What is title insurance?', a: 'Title insurance protects property buyers and mortgage lenders against financial loss from defects in a title, such as liens, encumbrances, or ownership disputes that were not discovered during the title search.' },
   { q: 'Is title insurance a one-time cost?', a: 'Yes, title insurance is a one-time premium paid at closing. It provides coverage for as long as you or your heirs own the property.' }],
  'Title Insurance = Property Value x Owner Rate + Loan Amount x Lender Rate + Search Fee',
  ['earnest-money-calculator', 'home-appraisal-cost-calculator']
);

// #67 Earnest Money Calculator
add('earnest-money-calculator', 'Earnest Money Calculator',
  'Calculate the recommended earnest money deposit for a home purchase based on market conditions and price.',
  'Finance', 'finance', '$',
  ['earnest money deposit', 'earnest money calculator', 'good faith deposit'],
  [
    '{ name: "purchasePrice", label: "Home Purchase Price", type: "number", prefix: "$", min: 10000, max: 10000000, step: 5000, defaultValue: 350000 }',
    '{ name: "marketCondition", label: "Market Condition", type: "select", options: [{value:"buyers",label:"Buyers Market"},{value:"balanced",label:"Balanced Market"},{value:"sellers",label:"Sellers Market"},{value:"hot",label:"Very Competitive"}], defaultValue: "balanced" }',
    '{ name: "offerStrength", label: "Offer Strength", type: "select", options: [{value:"below",label:"Below Asking Price"},{value:"at",label:"At Asking Price"},{value:"above",label:"Above Asking Price"}], defaultValue: "at" }',
  ],
  `(inputs) => {
      const price = inputs.purchasePrice as number;
      const market = inputs.marketCondition as string;
      const offer = inputs.offerStrength as string;
      if (!price || price <= 0) return null;
      const marketRates: Record<string, number> = { buyers: 0.01, balanced: 0.02, sellers: 0.03, hot: 0.05 };
      const offerMod: Record<string, number> = { below: 0.8, at: 1.0, above: 1.2 };
      const rate = (marketRates[market] || 0.02) * (offerMod[offer] || 1.0);
      const earnestMoney = price * rate;
      const minRecommended = price * 0.01;
      const maxRecommended = price * 0.05;
      return {
        primary: { label: "Recommended Earnest Money", value: "$" + formatNumber(Math.round(earnestMoney)) },
        details: [
          { label: "Percentage of Purchase Price", value: formatNumber(Math.round(rate * 10000) / 100) + "%" },
          { label: "Minimum Recommended", value: "$" + formatNumber(Math.round(minRecommended)) },
          { label: "Maximum Typical", value: "$" + formatNumber(Math.round(maxRecommended)) },
        ],
      };
    }`,
  [{ q: 'How much earnest money should I put down?', a: 'Earnest money typically ranges from 1 to 5 percent of the purchase price, depending on local customs and market conditions. In competitive markets, higher deposits can strengthen your offer.' },
   { q: 'Is earnest money refundable?', a: 'Earnest money is typically refundable if the buyer backs out due to a contingency specified in the contract, such as a failed inspection or inability to secure financing.' }],
  'Earnest Money = Purchase Price x Market Rate x Offer Strength Modifier',
  ['title-insurance-calculator', 'home-appraisal-cost-calculator']
);

// #68 Home Warranty Calculator
add('home-warranty-calculator', 'Home Warranty Calculator',
  'Determine the potential value of a home warranty by comparing coverage costs to expected repair expenses.',
  'Finance', 'finance', '$',
  ['home warranty cost', 'home warranty value', 'home warranty calculator'],
  [
    '{ name: "homeAge", label: "Home Age", type: "number", suffix: "years", min: 0, max: 100, defaultValue: 15 }',
    '{ name: "planType", label: "Warranty Plan Type", type: "select", options: [{value:"basic",label:"Basic (major systems only)"},{value:"standard",label:"Standard (systems + appliances)"},{value:"premium",label:"Premium (comprehensive)"}], defaultValue: "standard" }',
    '{ name: "annualPremium", label: "Annual Warranty Premium", type: "number", prefix: "$", min: 200, max: 1500, step: 25, defaultValue: 550 }',
    '{ name: "serviceFee", label: "Service Call Fee", type: "number", prefix: "$", min: 50, max: 200, step: 25, defaultValue: 75 }',
  ],
  `(inputs) => {
      const age = inputs.homeAge as number;
      const plan = inputs.planType as string;
      const premium = inputs.annualPremium as number;
      const serviceFee = inputs.serviceFee as number;
      if (!premium || premium <= 0) return null;
      const avgRepairsByAge = age < 5 ? 300 : age < 15 ? 800 : age < 30 ? 1500 : 2500;
      const coverageMod: Record<string, number> = { basic: 0.5, standard: 0.7, premium: 0.9 };
      const coveredRepairs = avgRepairsByAge * (coverageMod[plan] || 0.7);
      const estimatedCalls = age < 5 ? 1 : age < 15 ? 2 : 3;
      const totalWarrantyCost = premium + serviceFee * estimatedCalls;
      const netValue = coveredRepairs - totalWarrantyCost;
      return {
        primary: { label: "Estimated Annual Net Value", value: (netValue >= 0 ? "$" : "-$") + formatNumber(Math.abs(Math.round(netValue))) },
        details: [
          { label: "Expected Covered Repairs", value: "$" + formatNumber(Math.round(coveredRepairs)) },
          { label: "Total Warranty Cost", value: "$" + formatNumber(Math.round(totalWarrantyCost)) },
          { label: "Estimated Service Calls", value: formatNumber(estimatedCalls) + " per year" },
        ],
      };
    }`,
  [{ q: 'Is a home warranty worth it?', a: 'A home warranty is generally more valuable for older homes with aging systems and appliances. For newer homes, the manufacturer warranties may provide sufficient coverage.' },
   { q: 'What does a home warranty cover?', a: 'A typical home warranty covers major home systems such as HVAC, plumbing, and electrical, as well as appliances like refrigerators, dishwashers, and washers. Coverage varies by plan level.' }],
  'Net Value = Expected Covered Repairs - (Annual Premium + Service Fees x Estimated Calls)',
  ['hoa-fee-impact-calculator', 'earnest-money-calculator']
);

// #69 HOA Fee Impact Calculator
add('hoa-fee-impact-calculator', 'HOA Fee Impact Calculator',
  'Calculate the long-term financial impact of homeowner association fees on your housing budget over time.',
  'Finance', 'finance', '$',
  ['HOA fee impact', 'HOA cost calculator', 'homeowner association fees'],
  [
    '{ name: "monthlyHOA", label: "Monthly HOA Fee", type: "number", prefix: "$", min: 50, max: 2000, step: 25, defaultValue: 300 }',
    '{ name: "annualIncrease", label: "Expected Annual Fee Increase", type: "number", suffix: "%", min: 0, max: 15, step: 0.5, defaultValue: 4 }',
    '{ name: "years", label: "Years of Ownership", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 10 }',
    '{ name: "investmentReturn", label: "Alternative Investment Return", type: "number", suffix: "%", min: 0, max: 15, step: 0.5, defaultValue: 7 }',
  ],
  `(inputs) => {
      const monthly = inputs.monthlyHOA as number;
      const increase = (inputs.annualIncrease as number) / 100;
      const years = inputs.years as number;
      const invReturn = (inputs.investmentReturn as number) / 100;
      if (!monthly || !years || monthly <= 0 || years <= 0) return null;
      let totalPaid = 0;
      let opportunityCost = 0;
      let currentMonthly = monthly;
      for (let y = 0; y < years; y++) {
        const annualFee = currentMonthly * 12;
        totalPaid += annualFee;
        opportunityCost = (opportunityCost + annualFee) * (1 + invReturn);
        currentMonthly *= (1 + increase);
      }
      const finalMonthly = monthly * Math.pow(1 + increase, years);
      return {
        primary: { label: "Total HOA Fees Paid", value: "$" + formatNumber(Math.round(totalPaid)) },
        details: [
          { label: "Monthly Fee in Year " + years, value: "$" + formatNumber(Math.round(finalMonthly)) },
          { label: "Opportunity Cost (if invested)", value: "$" + formatNumber(Math.round(opportunityCost)) },
          { label: "Average Monthly Cost", value: "$" + formatNumber(Math.round(totalPaid / years / 12)) },
        ],
      };
    }`,
  [{ q: 'How much do HOA fees increase each year?', a: 'HOA fees typically increase 3 to 5 percent annually, though increases can be higher if the community needs major repairs or has underfunded reserves.' },
   { q: 'What do HOA fees cover?', a: 'HOA fees typically cover common area maintenance, landscaping, pool or amenity upkeep, insurance for common areas, and contributions to a reserve fund for future repairs.' }],
  'Total HOA Fees = Sum of (Monthly Fee x 12) for Each Year with Annual Increases',
  ['home-warranty-calculator', 'property-management-fee-calculator']
);

// #70 Property Management Fee Calculator
add('property-management-fee-calculator', 'Property Management Fee Calculator',
  'Estimate property management fees and their impact on rental property profitability.',
  'Finance', 'finance', '$',
  ['property management fee', 'PM fee calculator', 'rental management cost'],
  [
    '{ name: "monthlyRent", label: "Monthly Rent", type: "number", prefix: "$", min: 500, max: 20000, step: 50, defaultValue: 1800 }',
    '{ name: "managementRate", label: "Management Fee Rate", type: "number", suffix: "%", min: 4, max: 15, step: 0.5, defaultValue: 10 }',
    '{ name: "units", label: "Number of Units", type: "number", suffix: "units", min: 1, max: 100, defaultValue: 1 }',
    '{ name: "vacancyRate", label: "Expected Vacancy Rate", type: "number", suffix: "%", min: 0, max: 30, step: 1, defaultValue: 5 }',
  ],
  `(inputs) => {
      const rent = inputs.monthlyRent as number;
      const rate = (inputs.managementRate as number) / 100;
      const units = inputs.units as number;
      const vacancy = (inputs.vacancyRate as number) / 100;
      if (!rent || rent <= 0 || !units || units <= 0) return null;
      const grossAnnualRent = rent * 12 * units;
      const effectiveRent = grossAnnualRent * (1 - vacancy);
      const annualMgmtFee = effectiveRent * rate;
      const monthlyMgmtFee = annualMgmtFee / 12;
      const leaseRenewalFee = rent * 0.5 * units;
      const totalAnnualCost = annualMgmtFee + leaseRenewalFee;
      return {
        primary: { label: "Annual Management Cost", value: "$" + formatNumber(Math.round(totalAnnualCost)) },
        details: [
          { label: "Monthly Management Fee", value: "$" + formatNumber(Math.round(monthlyMgmtFee)) },
          { label: "Annual Management Fee", value: "$" + formatNumber(Math.round(annualMgmtFee)) },
          { label: "Lease Renewal Fees", value: "$" + formatNumber(Math.round(leaseRenewalFee)) },
        ],
      };
    }`,
  [{ q: 'How much do property managers charge?', a: 'Property management companies typically charge 8 to 12 percent of monthly rent collected, plus additional fees for tenant placement, lease renewals, and maintenance coordination.' },
   { q: 'Is hiring a property manager worth it?', a: 'Hiring a property manager is often worthwhile for investors who own multiple units, live far from their rental property, or do not want to handle day-to-day tenant issues and maintenance.' }],
  'Annual Cost = (Monthly Rent x 12 x Units x (1 - Vacancy Rate) x Management Rate) + Lease Renewal Fees',
  ['hoa-fee-impact-calculator', 'home-warranty-calculator']
);

// #71 App Development Cost Calculator
add('app-development-cost-calculator', 'App Development Cost Calculator',
  'Estimate the cost of developing a mobile application based on complexity, platform, and team location.',
  'Finance', 'finance', '$',
  ['app development cost', 'mobile app cost', 'app building cost estimate'],
  [
    '{ name: "complexity", label: "App Complexity", type: "select", options: [{value:"simple",label:"Simple (5-10 screens)"},{value:"moderate",label:"Moderate (10-25 screens)"},{value:"complex",label:"Complex (25+ screens)"},{value:"enterprise",label:"Enterprise Grade"}], defaultValue: "moderate" }',
    '{ name: "platform", label: "Target Platform", type: "select", options: [{value:"ios",label:"iOS Only"},{value:"android",label:"Android Only"},{value:"both",label:"Both (native)"},{value:"cross",label:"Cross-Platform"}], defaultValue: "cross" }',
    '{ name: "teamLocation", label: "Development Team Location", type: "select", options: [{value:"us",label:"US/Canada"},{value:"europe",label:"Western Europe"},{value:"eastern",label:"Eastern Europe"},{value:"asia",label:"Asia"}], defaultValue: "us" }',
    '{ name: "designLevel", label: "Design Quality", type: "select", options: [{value:"basic",label:"Basic UI"},{value:"custom",label:"Custom Design"},{value:"premium",label:"Premium UX/UI"}], defaultValue: "custom" }',
  ],
  `(inputs) => {
      const complexity = inputs.complexity as string;
      const platform = inputs.platform as string;
      const location = inputs.teamLocation as string;
      const design = inputs.designLevel as string;
      const baseHours: Record<string, number> = { simple: 400, moderate: 800, complex: 1500, enterprise: 3000 };
      const platformMod: Record<string, number> = { ios: 1.0, android: 1.0, both: 1.8, cross: 1.3 };
      const hourlyRates: Record<string, number> = { us: 150, europe: 120, eastern: 50, asia: 35 };
      const designMod: Record<string, number> = { basic: 0.85, custom: 1.0, premium: 1.3 };
      const hours = (baseHours[complexity] || 800) * (platformMod[platform] || 1.3) * (designMod[design] || 1.0);
      const rate = hourlyRates[location] || 150;
      const totalCost = hours * rate;
      const timelineMonths = Math.ceil(hours / 160 / 2);
      return {
        primary: { label: "Estimated Development Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Estimated Hours", value: formatNumber(Math.round(hours)) + " hours" },
          { label: "Hourly Rate", value: "$" + formatNumber(rate) + "/hr" },
          { label: "Estimated Timeline", value: formatNumber(timelineMonths) + " months" },
        ],
      };
    }`,
  [{ q: 'How much does it cost to build a mobile app?', a: 'Mobile app development costs range from $30,000 for a simple app to over $300,000 for a complex enterprise application, depending on features, platform, and development team location.' },
   { q: 'Is it cheaper to build a cross-platform app?', a: 'Cross-platform development using frameworks like React Native or Flutter typically costs 20 to 30 percent less than building separate native apps for iOS and Android.' }],
  'Development Cost = Base Hours x Platform Modifier x Design Modifier x Hourly Rate',
  ['website-cost-calculator', 'saas-pricing-calculator']
);

// #72 Website Cost Calculator
add('website-cost-calculator', 'Website Cost Calculator',
  'Estimate the total cost of building a website based on type, features, and development approach.',
  'Finance', 'finance', '$',
  ['website cost', 'website development cost', 'web design cost estimate'],
  [
    '{ name: "siteType", label: "Website Type", type: "select", options: [{value:"landing",label:"Landing Page"},{value:"business",label:"Business Website (5-10 pages)"},{value:"ecommerce",label:"E-Commerce Store"},{value:"webapp",label:"Web Application"}], defaultValue: "business" }',
    '{ name: "approach", label: "Development Approach", type: "select", options: [{value:"template",label:"Template/Theme"},{value:"custom",label:"Custom Design"},{value:"agency",label:"Full Agency Build"}], defaultValue: "custom" }',
    '{ name: "pages", label: "Number of Pages", type: "number", suffix: "pages", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "features", label: "Feature Complexity", type: "select", options: [{value:"basic",label:"Basic (forms, galleries)"},{value:"moderate",label:"Moderate (CMS, search)"},{value:"advanced",label:"Advanced (integrations, API)"}], defaultValue: "moderate" }',
  ],
  `(inputs) => {
      const siteType = inputs.siteType as string;
      const approach = inputs.approach as string;
      const pages = inputs.pages as number;
      const features = inputs.features as string;
      if (!pages || pages <= 0) return null;
      const baseCost: Record<string, number> = { landing: 1000, business: 3000, ecommerce: 8000, webapp: 15000 };
      const approachMod: Record<string, number> = { template: 0.4, custom: 1.0, agency: 2.0 };
      const featureMod: Record<string, number> = { basic: 0.8, moderate: 1.0, advanced: 1.5 };
      const perPageCost = approach === "agency" ? 200 : approach === "custom" ? 100 : 30;
      const buildCost = (baseCost[siteType] || 3000) * (approachMod[approach] || 1.0) * (featureMod[features] || 1.0);
      const pageCost = pages * perPageCost;
      const totalCost = buildCost + pageCost;
      const annualMaintenance = totalCost * 0.15;
      return {
        primary: { label: "Estimated Website Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Design and Development", value: "$" + formatNumber(Math.round(buildCost)) },
          { label: "Content and Pages", value: "$" + formatNumber(Math.round(pageCost)) },
          { label: "Annual Maintenance Estimate", value: "$" + formatNumber(Math.round(annualMaintenance)) },
        ],
      };
    }`,
  [{ q: 'How much does a website cost to build?', a: 'Website costs range from $500 for a simple template-based landing page to $50,000 or more for a custom-designed web application built by an agency.' },
   { q: 'What are the ongoing costs of a website?', a: 'Ongoing costs typically include hosting ($5 to $100 per month), domain name ($10 to $15 per year), SSL certificate, maintenance, and content updates, totaling $500 to $5,000 annually.' }],
  'Website Cost = Base Cost x Approach Modifier x Feature Modifier + Pages x Per Page Cost',
  ['app-development-cost-calculator', 'cloud-cost-calculator']
);

// #73 SaaS Pricing Calculator
add('saas-pricing-calculator', 'SaaS Pricing Calculator',
  'Calculate optimal SaaS subscription pricing tiers based on cost structure, target margin, and user count.',
  'Finance', 'finance', '$',
  ['SaaS pricing', 'SaaS pricing strategy', 'subscription pricing calculator'],
  [
    '{ name: "monthlyCostPerUser", label: "Monthly Cost per User (infrastructure)", type: "number", prefix: "$", min: 0.1, max: 100, step: 0.1, defaultValue: 5 }',
    '{ name: "targetMargin", label: "Target Gross Margin", type: "number", suffix: "%", min: 50, max: 95, step: 5, defaultValue: 80 }',
    '{ name: "users", label: "Expected Users", type: "number", suffix: "users", min: 10, max: 1000000, step: 100, defaultValue: 1000 }',
    '{ name: "supportCostPerUser", label: "Monthly Support Cost per User", type: "number", prefix: "$", min: 0, max: 50, step: 0.5, defaultValue: 2 }',
  ],
  `(inputs) => {
      const costPerUser = inputs.monthlyCostPerUser as number;
      const margin = (inputs.targetMargin as number) / 100;
      const users = inputs.users as number;
      const supportCost = inputs.supportCostPerUser as number;
      if (!costPerUser || !users || users <= 0) return null;
      const totalCostPerUser = costPerUser + supportCost;
      const monthlyPrice = totalCostPerUser / (1 - margin);
      const annualPrice = monthlyPrice * 12 * 0.85;
      const monthlyRevenue = monthlyPrice * users;
      const annualRevenue = monthlyRevenue * 12;
      const monthlyProfit = monthlyRevenue - (totalCostPerUser * users);
      return {
        primary: { label: "Recommended Monthly Price", value: "$" + formatNumber(Math.round(monthlyPrice * 100) / 100) + "/user" },
        details: [
          { label: "Annual Price (15% discount)", value: "$" + formatNumber(Math.round(annualPrice * 100) / 100) + "/user/year" },
          { label: "Projected Monthly Revenue", value: "$" + formatNumber(Math.round(monthlyRevenue)) },
          { label: "Monthly Gross Profit", value: "$" + formatNumber(Math.round(monthlyProfit)) },
        ],
      };
    }`,
  [{ q: 'How do you price a SaaS product?', a: 'SaaS pricing is typically based on the cost to serve each user plus a target gross margin of 70 to 85 percent. Common models include per-user pricing, tiered plans, and usage-based billing.' },
   { q: 'Should I offer annual pricing discounts?', a: 'Annual pricing discounts of 10 to 20 percent are standard in SaaS. They improve cash flow, reduce churn, and increase customer lifetime value.' }],
  'Monthly Price = Total Cost per User / (1 - Target Margin)',
  ['app-development-cost-calculator', 'cloud-cost-calculator']
);

// #74 Cloud Cost Calculator
add('cloud-cost-calculator', 'Cloud Cost Calculator',
  'Estimate monthly cloud infrastructure costs for compute, storage, and data transfer on major cloud platforms.',
  'Finance', 'finance', '$',
  ['cloud cost', 'AWS cost calculator', 'cloud infrastructure cost'],
  [
    '{ name: "instances", label: "Number of Compute Instances", type: "number", suffix: "instances", min: 1, max: 500, defaultValue: 3 }',
    '{ name: "instanceSize", label: "Instance Size", type: "select", options: [{value:"small",label:"Small (2 vCPU, 4GB)"},{value:"medium",label:"Medium (4 vCPU, 16GB)"},{value:"large",label:"Large (8 vCPU, 32GB)"},{value:"xlarge",label:"X-Large (16 vCPU, 64GB)"}], defaultValue: "medium" }',
    '{ name: "storageGB", label: "Storage Required", type: "number", suffix: "GB", min: 10, max: 100000, step: 10, defaultValue: 500 }',
    '{ name: "dataTransferGB", label: "Monthly Data Transfer Out", type: "number", suffix: "GB", min: 0, max: 100000, step: 10, defaultValue: 200 }',
  ],
  `(inputs) => {
      const instances = inputs.instances as number;
      const size = inputs.instanceSize as string;
      const storage = inputs.storageGB as number;
      const transfer = inputs.dataTransferGB as number;
      if (!instances || instances <= 0) return null;
      const instanceCosts: Record<string, number> = { small: 35, medium: 120, large: 280, xlarge: 560 };
      const monthlyCostPerInstance = instanceCosts[size] || 120;
      const computeCost = instances * monthlyCostPerInstance;
      const storageCost = storage * 0.023;
      const transferCost = Math.max(0, transfer - 100) * 0.09;
      const totalMonthly = computeCost + storageCost + transferCost;
      const annualCost = totalMonthly * 12;
      return {
        primary: { label: "Estimated Monthly Cost", value: "$" + formatNumber(Math.round(totalMonthly)) },
        details: [
          { label: "Compute Cost", value: "$" + formatNumber(Math.round(computeCost)) },
          { label: "Storage Cost", value: "$" + formatNumber(Math.round(storageCost * 100) / 100) },
          { label: "Estimated Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        ],
      };
    }`,
  [{ q: 'How much does cloud hosting cost per month?', a: 'Cloud hosting costs vary widely, from $20 per month for a small single instance to thousands of dollars for multi-server architectures. The average small business spends $500 to $2,000 per month.' },
   { q: 'How can I reduce cloud costs?', a: 'You can reduce cloud costs by using reserved instances for predictable workloads, right-sizing instances, using auto-scaling, and deleting unused resources and snapshots.' }],
  'Monthly Cost = (Instances x Instance Cost) + (Storage x $0.023/GB) + (Transfer Out x $0.09/GB)',
  ['data-transfer-cost-calculator', 'server-sizing-calculator']
);

// #75 API Rate Limit Calculator
add('api-rate-limit-calculator', 'API Rate Limit Calculator',
  'Plan API request budgets by calculating daily and monthly request capacity from rate limit specifications.',
  'Math', 'math', '+',
  ['API rate limit', 'API request calculator', 'rate limiting calculator'],
  [
    '{ name: "requestsPerSecond", label: "Requests per Second Limit", type: "number", suffix: "req/s", min: 1, max: 100000, defaultValue: 100 }',
    '{ name: "burstLimit", label: "Burst Limit", type: "number", suffix: "requests", min: 1, max: 1000000, defaultValue: 500 }',
    '{ name: "avgResponseTime", label: "Average Response Time", type: "number", suffix: "ms", min: 1, max: 30000, defaultValue: 200 }',
    '{ name: "concurrentClients", label: "Concurrent Clients", type: "number", suffix: "clients", min: 1, max: 10000, defaultValue: 50 }',
  ],
  `(inputs) => {
      const rps = inputs.requestsPerSecond as number;
      const burst = inputs.burstLimit as number;
      const responseTime = inputs.avgResponseTime as number;
      const clients = inputs.concurrentClients as number;
      if (!rps || rps <= 0) return null;
      const maxPerMinute = rps * 60;
      const maxPerHour = maxPerMinute * 60;
      const maxPerDay = maxPerHour * 24;
      const perClientPerSecond = rps / clients;
      const effectiveRPS = Math.min(rps, 1000 / responseTime * clients);
      return {
        primary: { label: "Maximum Requests per Day", value: formatNumber(Math.round(maxPerDay)) },
        details: [
          { label: "Requests per Minute", value: formatNumber(Math.round(maxPerMinute)) },
          { label: "Per Client Rate", value: formatNumber(Math.round(perClientPerSecond * 100) / 100) + " req/s" },
          { label: "Effective Throughput", value: formatNumber(Math.round(effectiveRPS)) + " req/s" },
        ],
      };
    }`,
  [{ q: 'What is an API rate limit?', a: 'An API rate limit is a restriction on the number of requests a client can make to an API within a specific time window, designed to prevent abuse and ensure fair resource usage.' },
   { q: 'How do I handle rate limit errors?', a: 'Implement exponential backoff and retry logic, cache responses when possible, and consider queuing requests to stay within the allowed rate. Most APIs return a 429 status code when limits are exceeded.' }],
  'Max Daily Requests = Requests per Second x 60 x 60 x 24',
  ['bandwidth-calculator', 'server-sizing-calculator']
);

// #76 Database Size Calculator
add('database-size-calculator', 'Database Size Calculator',
  'Estimate database storage requirements based on record count, row size, and index overhead.',
  'Math', 'math', '+',
  ['database size', 'DB storage calculator', 'database storage estimation'],
  [
    '{ name: "rowCount", label: "Number of Rows", type: "number", suffix: "rows", min: 1000, max: 10000000000, step: 10000, defaultValue: 1000000 }',
    '{ name: "avgRowSize", label: "Average Row Size", type: "number", suffix: "bytes", min: 10, max: 10000, step: 10, defaultValue: 500 }',
    '{ name: "indexCount", label: "Number of Indexes", type: "number", suffix: "indexes", min: 0, max: 50, defaultValue: 5 }',
    '{ name: "growthRate", label: "Monthly Growth Rate", type: "number", suffix: "%", min: 0, max: 100, step: 1, defaultValue: 10 }',
  ],
  `(inputs) => {
      const rows = inputs.rowCount as number;
      const rowSize = inputs.avgRowSize as number;
      const indexes = inputs.indexCount as number;
      const growth = (inputs.growthRate as number) / 100;
      if (!rows || !rowSize || rows <= 0 || rowSize <= 0) return null;
      const rawDataBytes = rows * rowSize;
      const indexOverhead = indexes * rows * 50;
      const totalBytes = rawDataBytes + indexOverhead;
      const totalGB = totalBytes / (1024 * 1024 * 1024);
      const sixMonthGB = totalGB * Math.pow(1 + growth, 6);
      const oneYearGB = totalGB * Math.pow(1 + growth, 12);
      const unit = totalGB >= 1 ? "GB" : "MB";
      const displaySize = totalGB >= 1 ? totalGB : totalGB * 1024;
      return {
        primary: { label: "Current Database Size", value: formatNumber(Math.round(displaySize * 100) / 100) + " " + unit },
        details: [
          { label: "Raw Data Size", value: formatNumber(Math.round(rawDataBytes / (1024 * 1024) * 100) / 100) + " MB" },
          { label: "6-Month Projection", value: formatNumber(Math.round(sixMonthGB * 100) / 100) + " GB" },
          { label: "12-Month Projection", value: formatNumber(Math.round(oneYearGB * 100) / 100) + " GB" },
        ],
      };
    }`,
  [{ q: 'How do I estimate database storage needs?', a: 'Multiply the number of rows by the average row size to get raw data size, then add 20 to 40 percent for index overhead, transaction logs, and system metadata.' },
   { q: 'What contributes to database size beyond data?', a: 'Indexes, transaction logs, temporary tables, system catalogs, and fragmentation all contribute to the total database size beyond the raw data itself.' }],
  'Database Size = (Rows x Row Size) + (Indexes x Rows x 50 bytes overhead)',
  ['server-sizing-calculator', 'cloud-cost-calculator']
);

// #77 Bandwidth Calculator
add('bandwidth-calculator', 'Bandwidth Calculator',
  'Calculate the network bandwidth required based on concurrent users, page size, and traffic patterns.',
  'Math', 'math', '+',
  ['bandwidth calculator', 'network bandwidth needs', 'internet bandwidth estimator'],
  [
    '{ name: "concurrentUsers", label: "Peak Concurrent Users", type: "number", suffix: "users", min: 1, max: 1000000, step: 100, defaultValue: 500 }',
    '{ name: "avgPageSize", label: "Average Page Size", type: "number", suffix: "MB", min: 0.1, max: 50, step: 0.1, defaultValue: 2.5 }',
    '{ name: "pagesPerSession", label: "Pages per Session", type: "number", suffix: "pages", min: 1, max: 100, defaultValue: 5 }',
    '{ name: "avgSessionMinutes", label: "Average Session Duration", type: "number", suffix: "minutes", min: 1, max: 120, defaultValue: 10 }',
  ],
  `(inputs) => {
      const users = inputs.concurrentUsers as number;
      const pageSize = inputs.avgPageSize as number;
      const pages = inputs.pagesPerSession as number;
      const sessionMin = inputs.avgSessionMinutes as number;
      if (!users || !pageSize || !pages || !sessionMin || users <= 0) return null;
      const dataPerSession = pageSize * pages;
      const totalDataMB = users * dataPerSession;
      const bitsPerSecond = (totalDataMB * 8 * 1024 * 1024) / (sessionMin * 60);
      const mbps = bitsPerSecond / (1024 * 1024);
      const gbps = mbps / 1024;
      const display = mbps >= 1024 ? formatNumber(Math.round(gbps * 100) / 100) + " Gbps" : formatNumber(Math.round(mbps * 10) / 10) + " Mbps";
      const monthlyTransferTB = (totalDataMB * (60 / sessionMin) * 24 * 30) / (1024 * 1024);
      return {
        primary: { label: "Required Bandwidth", value: display },
        details: [
          { label: "Data per Session", value: formatNumber(Math.round(dataPerSession * 10) / 10) + " MB" },
          { label: "Peak Total Data Load", value: formatNumber(Math.round(totalDataMB)) + " MB" },
          { label: "Monthly Transfer Estimate", value: formatNumber(Math.round(monthlyTransferTB * 100) / 100) + " TB" },
        ],
      };
    }`,
  [{ q: 'How do I calculate bandwidth needs for a website?', a: 'Multiply concurrent users by average page size and pages per session, then divide by average session duration to get the peak bandwidth requirement in bits per second.' },
   { q: 'What is the difference between bandwidth and throughput?', a: 'Bandwidth is the maximum capacity of a network connection, while throughput is the actual data transfer rate achieved. Throughput is typically 60 to 80 percent of bandwidth due to protocol overhead.' }],
  'Bandwidth (Mbps) = (Users x Page Size x Pages x 8) / (Session Duration in seconds)',
  ['download-time-calculator', 'server-sizing-calculator']
);

// #78 Server Sizing Calculator
add('server-sizing-calculator', 'Server Sizing Calculator',
  'Estimate server hardware specifications needed based on workload type, users, and performance requirements.',
  'Math', 'math', '+',
  ['server sizing', 'server specs calculator', 'server requirements estimator'],
  [
    '{ name: "workload", label: "Primary Workload Type", type: "select", options: [{value:"web",label:"Web Server"},{value:"database",label:"Database Server"},{value:"app",label:"Application Server"},{value:"ml",label:"Machine Learning"}], defaultValue: "web" }',
    '{ name: "users", label: "Expected Concurrent Users", type: "number", suffix: "users", min: 10, max: 1000000, step: 100, defaultValue: 1000 }',
    '{ name: "availability", label: "Availability Requirement", type: "select", options: [{value:"standard",label:"Standard (99.9%)"},{value:"high",label:"High (99.99%)"},{value:"critical",label:"Mission Critical (99.999%)"}], defaultValue: "standard" }',
  ],
  `(inputs) => {
      const workload = inputs.workload as string;
      const users = inputs.users as number;
      const availability = inputs.availability as string;
      if (!users || users <= 0) return null;
      const cpuPerUser: Record<string, number> = { web: 0.01, database: 0.05, app: 0.03, ml: 0.1 };
      const ramPerUser: Record<string, number> = { web: 0.005, database: 0.02, app: 0.01, ml: 0.05 };
      const availMod: Record<string, number> = { standard: 1.0, high: 1.5, critical: 2.0 };
      const mod = availMod[availability] || 1.0;
      const cpuCores = Math.max(2, Math.ceil(users * (cpuPerUser[workload] || 0.03) * mod));
      const ramGB = Math.max(4, Math.ceil(users * (ramPerUser[workload] || 0.01) * mod));
      const servers = availability === "critical" ? 3 : availability === "high" ? 2 : 1;
      return {
        primary: { label: "Recommended CPU Cores", value: formatNumber(cpuCores) + " vCPU" },
        details: [
          { label: "Recommended RAM", value: formatNumber(ramGB) + " GB" },
          { label: "Minimum Server Count", value: formatNumber(servers) + (servers > 1 ? " (with redundancy)" : "") },
          { label: "Workload Type", value: workload === "ml" ? "Machine Learning" : workload.charAt(0).toUpperCase() + workload.slice(1) },
        ],
      };
    }`,
  [{ q: 'How do I determine what server I need?', a: 'Server sizing depends on your workload type, expected concurrent users, performance requirements, and availability needs. Start with estimated resource usage per user and scale accordingly.' },
   { q: 'Should I use one large server or multiple smaller ones?', a: 'For most production workloads, multiple smaller servers with load balancing provide better reliability and scalability than a single large server, even if the total cost is slightly higher.' }],
  'CPU Cores = Concurrent Users x CPU per User x Availability Modifier',
  ['cloud-cost-calculator', 'bandwidth-calculator']
);

// #79 Download Time Calculator
add('download-time-calculator', 'Download Time Calculator',
  'Calculate how long a file will take to download based on file size and internet connection speed.',
  'Math', 'math', '+',
  ['download time', 'file download calculator', 'download speed calculator'],
  [
    '{ name: "fileSize", label: "File Size", type: "number", suffix: "MB", min: 0.1, max: 1000000, step: 1, defaultValue: 500 }',
    '{ name: "speed", label: "Download Speed", type: "number", suffix: "Mbps", min: 0.5, max: 10000, step: 1, defaultValue: 100 }',
    '{ name: "overhead", label: "Protocol Overhead", type: "select", options: [{value:"0.05",label:"5% (wired connection)"},{value:"0.15",label:"15% (WiFi)"},{value:"0.25",label:"25% (mobile/cellular)"}], defaultValue: "0.15" }',
  ],
  `(inputs) => {
      const fileSizeMB = inputs.fileSize as number;
      const speedMbps = inputs.speed as number;
      const overhead = parseFloat(inputs.overhead as string);
      if (!fileSizeMB || !speedMbps || fileSizeMB <= 0 || speedMbps <= 0) return null;
      const effectiveSpeed = speedMbps * (1 - overhead);
      const fileSizeBits = fileSizeMB * 8;
      const timeSeconds = fileSizeBits / effectiveSpeed;
      let display = "";
      if (timeSeconds < 60) {
        display = formatNumber(Math.round(timeSeconds * 10) / 10) + " seconds";
      } else if (timeSeconds < 3600) {
        display = formatNumber(Math.round(timeSeconds / 60 * 10) / 10) + " minutes";
      } else {
        display = formatNumber(Math.round(timeSeconds / 3600 * 100) / 100) + " hours";
      }
      const effectiveMBps = effectiveSpeed / 8;
      return {
        primary: { label: "Estimated Download Time", value: display },
        details: [
          { label: "Effective Speed", value: formatNumber(Math.round(effectiveSpeed * 10) / 10) + " Mbps" },
          { label: "Transfer Rate", value: formatNumber(Math.round(effectiveMBps * 100) / 100) + " MB/s" },
          { label: "File Size", value: fileSizeMB >= 1024 ? formatNumber(Math.round(fileSizeMB / 1024 * 100) / 100) + " GB" : formatNumber(fileSizeMB) + " MB" },
        ],
      };
    }`,
  [{ q: 'Why is my actual download speed slower than advertised?', a: 'Advertised speeds represent maximum theoretical bandwidth. Actual speeds are affected by network congestion, WiFi interference, protocol overhead, server limitations, and distance from the router.' },
   { q: 'What is the difference between Mbps and MBps?', a: 'Mbps (megabits per second) measures network speed, while MBps (megabytes per second) measures data transfer rate. There are 8 bits in a byte, so 100 Mbps equals 12.5 MBps.' }],
  'Download Time = (File Size in MB x 8) / (Speed in Mbps x (1 - Overhead))',
  ['bandwidth-calculator', 'data-transfer-cost-calculator']
);

// #80 Data Transfer Cost Calculator
add('data-transfer-cost-calculator', 'Data Transfer Cost Calculator',
  'Estimate cloud data egress costs for transferring data out of major cloud platforms.',
  'Finance', 'finance', '$',
  ['data transfer cost', 'cloud egress cost', 'data egress calculator'],
  [
    '{ name: "dataGB", label: "Monthly Data Transfer Out", type: "number", suffix: "GB", min: 1, max: 1000000, step: 10, defaultValue: 500 }',
    '{ name: "provider", label: "Cloud Provider", type: "select", options: [{value:"aws",label:"AWS"},{value:"azure",label:"Microsoft Azure"},{value:"gcp",label:"Google Cloud"},{value:"generic",label:"Generic/Average"}], defaultValue: "aws" }',
    '{ name: "region", label: "Transfer Destination", type: "select", options: [{value:"sameRegion",label:"Same Region"},{value:"crossRegion",label:"Cross Region"},{value:"internet",label:"To Internet"},{value:"crossCloud",label:"Cross Cloud Provider"}], defaultValue: "internet" }',
  ],
  `(inputs) => {
      const dataGB = inputs.dataGB as number;
      const provider = inputs.provider as string;
      const region = inputs.region as string;
      if (!dataGB || dataGB <= 0) return null;
      const rateMap: Record<string, Record<string, number>> = {
        aws: { sameRegion: 0.01, crossRegion: 0.02, internet: 0.09, crossCloud: 0.09 },
        azure: { sameRegion: 0.01, crossRegion: 0.02, internet: 0.087, crossCloud: 0.087 },
        gcp: { sameRegion: 0.01, crossRegion: 0.01, internet: 0.085, crossCloud: 0.085 },
        generic: { sameRegion: 0.01, crossRegion: 0.02, internet: 0.09, crossCloud: 0.09 },
      };
      const rates = rateMap[provider] || rateMap.generic;
      const rate = rates[region] || 0.09;
      const freeGB = region === "internet" ? 100 : 0;
      const billableGB = Math.max(0, dataGB - freeGB);
      const monthlyCost = billableGB * rate;
      const annualCost = monthlyCost * 12;
      return {
        primary: { label: "Monthly Data Transfer Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        details: [
          { label: "Cost per GB", value: "$" + formatNumber(rate) },
          { label: "Billable Data", value: formatNumber(billableGB) + " GB" },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        ],
      };
    }`,
  [{ q: 'What is cloud data egress?', a: 'Data egress refers to data transferred out of a cloud provider to the internet or to another cloud region. Most cloud providers charge for outbound data transfer while inbound transfer is typically free.' },
   { q: 'How can I reduce cloud egress costs?', a: 'You can reduce egress costs by using a CDN to cache content closer to users, compressing data before transfer, keeping data within the same region, and using committed use discounts.' }],
  'Monthly Cost = (Data Out GB - Free Tier GB) x Per GB Rate',
  ['cloud-cost-calculator', 'download-time-calculator']
);

// #81 Molar Mass Calculator
add('molar-mass-calculator', 'Molar Mass Calculator',
  'Calculate the molar mass of a compound based on its elemental composition and atom counts.',
  'Science', 'science', 'A',
  ['molar mass', 'molecular weight calculator', 'formula weight'],
  [
    '{ name: "carbon", label: "Carbon Atoms", type: "number", suffix: "C", min: 0, max: 100, defaultValue: 6 }',
    '{ name: "hydrogen", label: "Hydrogen Atoms", type: "number", suffix: "H", min: 0, max: 200, defaultValue: 12 }',
    '{ name: "oxygen", label: "Oxygen Atoms", type: "number", suffix: "O", min: 0, max: 100, defaultValue: 6 }',
    '{ name: "nitrogen", label: "Nitrogen Atoms", type: "number", suffix: "N", min: 0, max: 100, defaultValue: 0 }',
  ],
  `(inputs) => {
      const c = inputs.carbon as number;
      const h = inputs.hydrogen as number;
      const o = inputs.oxygen as number;
      const n = inputs.nitrogen as number;
      const cMass = 12.011;
      const hMass = 1.008;
      const oMass = 15.999;
      const nMass = 14.007;
      const molarMass = c * cMass + h * hMass + o * oMass + n * nMass;
      if (molarMass <= 0) return null;
      const cPercent = (c * cMass / molarMass) * 100;
      const hPercent = (h * hMass / molarMass) * 100;
      const oPercent = (o * oMass / molarMass) * 100;
      return {
        primary: { label: "Molar Mass", value: formatNumber(Math.round(molarMass * 1000) / 1000) + " g/mol" },
        details: [
          { label: "Carbon Contribution", value: formatNumber(Math.round(c * cMass * 100) / 100) + " g/mol (" + formatNumber(Math.round(cPercent * 10) / 10) + "%)" },
          { label: "Hydrogen Contribution", value: formatNumber(Math.round(h * hMass * 100) / 100) + " g/mol (" + formatNumber(Math.round(hPercent * 10) / 10) + "%)" },
          { label: "Oxygen Contribution", value: formatNumber(Math.round(o * oMass * 100) / 100) + " g/mol (" + formatNumber(Math.round(oPercent * 10) / 10) + "%)" },
        ],
      };
    }`,
  [{ q: 'What is molar mass?', a: 'Molar mass is the mass of one mole of a substance, expressed in grams per mole (g/mol). It equals the sum of the atomic masses of all atoms in the molecular formula.' },
   { q: 'How is molar mass used in chemistry?', a: 'Molar mass is used to convert between grams and moles in stoichiometric calculations, solution preparation, and determining the amount of reactants and products in chemical reactions.' }],
  'Molar Mass = Sum of (Number of Atoms x Atomic Mass) for Each Element',
  ['dilution-factor-calculator', 'reaction-yield-calculator']
);

// #82 Dilution Factor Calculator
add('dilution-factor-calculator', 'Dilution Factor Calculator',
  'Calculate the volumes needed for serial dilutions using the C1V1 = C2V2 dilution equation.',
  'Science', 'science', 'A',
  ['dilution calculator', 'serial dilution', 'C1V1 C2V2 calculator'],
  [
    '{ name: "stockConcentration", label: "Stock Concentration (C1)", type: "number", suffix: "M", min: 0.001, max: 20, step: 0.001, defaultValue: 1 }',
    '{ name: "desiredConcentration", label: "Desired Concentration (C2)", type: "number", suffix: "M", min: 0.0001, max: 20, step: 0.0001, defaultValue: 0.1 }',
    '{ name: "finalVolume", label: "Final Volume (V2)", type: "number", suffix: "mL", min: 1, max: 10000, step: 1, defaultValue: 100 }',
  ],
  `(inputs) => {
      const c1 = inputs.stockConcentration as number;
      const c2 = inputs.desiredConcentration as number;
      const v2 = inputs.finalVolume as number;
      if (!c1 || !c2 || !v2 || c1 <= 0 || c2 <= 0 || v2 <= 0) return null;
      if (c2 > c1) return null;
      const v1 = (c2 * v2) / c1;
      const solventVolume = v2 - v1;
      const dilutionFactor = c1 / c2;
      return {
        primary: { label: "Stock Volume Needed (V1)", value: formatNumber(Math.round(v1 * 1000) / 1000) + " mL" },
        details: [
          { label: "Solvent to Add", value: formatNumber(Math.round(solventVolume * 1000) / 1000) + " mL" },
          { label: "Dilution Factor", value: "1:" + formatNumber(Math.round(dilutionFactor * 10) / 10) },
          { label: "Final Volume", value: formatNumber(v2) + " mL" },
        ],
      };
    }`,
  [{ q: 'What is the dilution equation?', a: 'The dilution equation is C1V1 = C2V2, where C1 is the initial concentration, V1 is the volume of stock solution needed, C2 is the desired final concentration, and V2 is the desired final volume.' },
   { q: 'What is a serial dilution?', a: 'A serial dilution is a stepwise dilution of a solution where each step uses the diluted solution from the previous step, allowing for precise preparation of very low concentrations.' }],
  'V1 = (C2 x V2) / C1',
  ['buffer-calculator', 'titration-calculator']
);

// #83 Buffer Solution Calculator
add('buffer-calculator', 'Buffer Solution Calculator',
  'Calculate the amounts of acid and conjugate base needed to prepare a buffer at a target pH.',
  'Science', 'science', 'A',
  ['buffer calculator', 'buffer preparation', 'Henderson-Hasselbalch calculator'],
  [
    '{ name: "targetpH", label: "Target pH", type: "number", suffix: "pH", min: 1, max: 14, step: 0.1, defaultValue: 7.4 }',
    '{ name: "pKa", label: "pKa of Weak Acid", type: "number", suffix: "pKa", min: 1, max: 14, step: 0.01, defaultValue: 6.86 }',
    '{ name: "totalConcentration", label: "Total Buffer Concentration", type: "number", suffix: "M", min: 0.01, max: 2, step: 0.01, defaultValue: 0.1 }',
    '{ name: "volume", label: "Desired Volume", type: "number", suffix: "mL", min: 10, max: 10000, step: 10, defaultValue: 500 }',
  ],
  `(inputs) => {
      const pH = inputs.targetpH as number;
      const pKa = inputs.pKa as number;
      const totalConc = inputs.totalConcentration as number;
      const volume = inputs.volume as number;
      if (!pH || !pKa || !totalConc || !volume) return null;
      const ratio = Math.pow(10, pH - pKa);
      const baseConc = totalConc * ratio / (1 + ratio);
      const acidConc = totalConc - baseConc;
      const baseMoles = baseConc * volume / 1000;
      const acidMoles = acidConc * volume / 1000;
      return {
        primary: { label: "Base to Acid Ratio", value: formatNumber(Math.round(ratio * 100) / 100) + " : 1" },
        details: [
          { label: "Conjugate Base Needed", value: formatNumber(Math.round(baseMoles * 10000) / 10000) + " mol (" + formatNumber(Math.round(baseConc * 1000) / 1000) + " M)" },
          { label: "Weak Acid Needed", value: formatNumber(Math.round(acidMoles * 10000) / 10000) + " mol (" + formatNumber(Math.round(acidConc * 1000) / 1000) + " M)" },
          { label: "Buffer Capacity Range", value: "pH " + formatNumber(Math.round((pKa - 1) * 10) / 10) + " to " + formatNumber(Math.round((pKa + 1) * 10) / 10) },
        ],
      };
    }`,
  [{ q: 'What is the Henderson-Hasselbalch equation?', a: 'The Henderson-Hasselbalch equation is pH = pKa + log([A-]/[HA]), which relates the pH of a buffer solution to the pKa of the weak acid and the ratio of conjugate base to acid concentrations.' },
   { q: 'What is buffer capacity?', a: 'Buffer capacity is the ability of a buffer to resist pH changes. A buffer works most effectively within one pH unit above and below the pKa of its weak acid component.' }],
  'pH = pKa + log(Base Concentration / Acid Concentration)',
  ['dilution-factor-calculator', 'titration-calculator']
);

// #84 Titration Calculator
add('titration-calculator', 'Titration Calculator',
  'Calculate the unknown concentration of an acid or base using titration endpoint data.',
  'Science', 'science', 'A',
  ['titration calculator', 'acid base titration', 'titration concentration'],
  [
    '{ name: "titrantConcentration", label: "Titrant Concentration", type: "number", suffix: "M", min: 0.001, max: 10, step: 0.001, defaultValue: 0.1 }',
    '{ name: "titrantVolume", label: "Titrant Volume at Endpoint", type: "number", suffix: "mL", min: 0.1, max: 1000, step: 0.1, defaultValue: 25 }',
    '{ name: "analyteVolume", label: "Analyte Volume", type: "number", suffix: "mL", min: 0.1, max: 1000, step: 0.1, defaultValue: 50 }',
    '{ name: "stoichiometry", label: "Mole Ratio (titrant:analyte)", type: "select", options: [{value:"1",label:"1:1"},{value:"2",label:"1:2"},{value:"0.5",label:"2:1"}], defaultValue: "1" }',
  ],
  `(inputs) => {
      const cTitrant = inputs.titrantConcentration as number;
      const vTitrant = inputs.titrantVolume as number;
      const vAnalyte = inputs.analyteVolume as number;
      const ratio = parseFloat(inputs.stoichiometry as string);
      if (!cTitrant || !vTitrant || !vAnalyte || cTitrant <= 0 || vTitrant <= 0 || vAnalyte <= 0) return null;
      const molesTitrant = cTitrant * vTitrant / 1000;
      const molesAnalyte = molesTitrant * ratio;
      const analyteConcentration = molesAnalyte / (vAnalyte / 1000);
      return {
        primary: { label: "Analyte Concentration", value: formatNumber(Math.round(analyteConcentration * 10000) / 10000) + " M" },
        details: [
          { label: "Moles of Titrant", value: formatNumber(Math.round(molesTitrant * 100000) / 100000) + " mol" },
          { label: "Moles of Analyte", value: formatNumber(Math.round(molesAnalyte * 100000) / 100000) + " mol" },
          { label: "Total Volume at Endpoint", value: formatNumber(Math.round((vTitrant + vAnalyte) * 10) / 10) + " mL" },
        ],
      };
    }`,
  [{ q: 'What is titration?', a: 'Titration is a quantitative analytical technique in which a solution of known concentration (titrant) is slowly added to a solution of unknown concentration (analyte) until the reaction reaches its endpoint.' },
   { q: 'How do you determine the endpoint of a titration?', a: 'The endpoint is typically identified by a color change of an indicator, a sharp pH change measured by a pH meter, or a change in conductivity, depending on the titration method.' }],
  'Analyte Concentration = (Titrant Concentration x Titrant Volume x Mole Ratio) / Analyte Volume',
  ['buffer-calculator', 'dilution-factor-calculator']
);

// #85 Reaction Yield Calculator
add('reaction-yield-calculator', 'Reaction Yield Calculator',
  'Calculate the percent yield of a chemical reaction by comparing actual product to theoretical yield.',
  'Science', 'science', 'A',
  ['percent yield', 'reaction yield calculator', 'theoretical yield'],
  [
    '{ name: "theoreticalYield", label: "Theoretical Yield", type: "number", suffix: "g", min: 0.001, max: 100000, step: 0.01, defaultValue: 50 }',
    '{ name: "actualYield", label: "Actual Yield", type: "number", suffix: "g", min: 0.001, max: 100000, step: 0.01, defaultValue: 38 }',
    '{ name: "reactantMass", label: "Starting Reactant Mass", type: "number", suffix: "g", min: 0.001, max: 100000, step: 0.01, defaultValue: 60 }',
  ],
  `(inputs) => {
      const theoretical = inputs.theoreticalYield as number;
      const actual = inputs.actualYield as number;
      const reactant = inputs.reactantMass as number;
      if (!theoretical || !actual || theoretical <= 0 || actual <= 0) return null;
      const percentYield = (actual / theoretical) * 100;
      const massLost = theoretical - actual;
      const atomEconomy = (theoretical / reactant) * 100;
      const rating = percentYield >= 90 ? "Excellent" : percentYield >= 70 ? "Good" : percentYield >= 50 ? "Fair" : "Poor";
      return {
        primary: { label: "Percent Yield", value: formatNumber(Math.round(percentYield * 10) / 10) + "%" },
        details: [
          { label: "Mass Lost", value: formatNumber(Math.round(massLost * 100) / 100) + " g" },
          { label: "Atom Economy", value: formatNumber(Math.round(atomEconomy * 10) / 10) + "%" },
          { label: "Yield Rating", value: rating },
        ],
      };
    }`,
  [{ q: 'What is percent yield?', a: 'Percent yield is the ratio of the actual product obtained to the theoretical maximum product possible, expressed as a percentage. It measures the efficiency of a chemical reaction.' },
   { q: 'Why is percent yield usually less than 100?', a: 'Percent yield is typically less than 100 due to incomplete reactions, side reactions, loss of product during purification, and measurement errors. Yields above 100 percent indicate impurities.' }],
  'Percent Yield = (Actual Yield / Theoretical Yield) x 100',
  ['molar-mass-calculator', 'titration-calculator']
);

// #86 Gas Law Calculator
add('gas-law-calculator', 'Gas Law Calculator',
  'Solve for any variable in the ideal gas law equation PV = nRT given the other three values.',
  'Science', 'science', 'A',
  ['ideal gas law', 'PV nRT calculator', 'gas law calculator'],
  [
    '{ name: "solveFor", label: "Solve For", type: "select", options: [{value:"P",label:"Pressure (P)"},{value:"V",label:"Volume (V)"},{value:"n",label:"Moles (n)"},{value:"T",label:"Temperature (T)"}], defaultValue: "P" }',
    '{ name: "pressure", label: "Pressure", type: "number", suffix: "atm", min: 0.001, max: 1000, step: 0.01, defaultValue: 1 }',
    '{ name: "volume", label: "Volume", type: "number", suffix: "L", min: 0.001, max: 100000, step: 0.1, defaultValue: 22.4 }',
    '{ name: "temperature", label: "Temperature", type: "number", suffix: "K", min: 1, max: 10000, step: 1, defaultValue: 273 }',
  ],
  `(inputs) => {
      const solveFor = inputs.solveFor as string;
      const P = inputs.pressure as number;
      const V = inputs.volume as number;
      const T = inputs.temperature as number;
      const R = 0.08206;
      let result = 0;
      let label = "";
      let unit = "";
      if (solveFor === "P") {
        const n = (P * V) / (R * T);
        result = (n * R * T) / V;
        label = "Pressure";
        unit = " atm";
      } else if (solveFor === "V") {
        const n = (P * V) / (R * T);
        result = (n * R * T) / P;
        label = "Volume";
        unit = " L";
      } else if (solveFor === "n") {
        result = (P * V) / (R * T);
        label = "Moles";
        unit = " mol";
      } else {
        const n = (P * V) / (R * T);
        result = (P * V) / (n * R);
        label = "Temperature";
        unit = " K";
      }
      if (!result || result <= 0) return null;
      const n = (P * V) / (R * T);
      return {
        primary: { label: label, value: formatNumber(Math.round(result * 10000) / 10000) + unit },
        details: [
          { label: "Moles (n)", value: formatNumber(Math.round(n * 10000) / 10000) + " mol" },
          { label: "Gas Constant (R)", value: "0.08206 L atm / mol K" },
          { label: "Equation", value: "PV = nRT" },
        ],
      };
    }`,
  [{ q: 'What is the ideal gas law?', a: 'The ideal gas law, PV = nRT, relates the pressure, volume, moles, and temperature of an ideal gas. R is the gas constant (0.08206 L atm per mol K).' },
   { q: 'When does the ideal gas law not apply?', a: 'The ideal gas law is less accurate at very high pressures, very low temperatures, and for gases with strong intermolecular forces. In these cases, the van der Waals equation provides better results.' }],
  'PV = nRT, where R = 0.08206 L atm / mol K',
  ['molar-mass-calculator', 'reaction-yield-calculator']
);

// #87 Radioactive Decay Calculator
add('radioactive-decay-calculator', 'Radioactive Decay Calculator',
  'Calculate the remaining amount of a radioactive substance after a given time using half-life decay.',
  'Science', 'science', 'A',
  ['radioactive decay', 'half-life calculator', 'nuclear decay calculator'],
  [
    '{ name: "initialAmount", label: "Initial Amount", type: "number", suffix: "g", min: 0.001, max: 1000000, step: 0.01, defaultValue: 100 }',
    '{ name: "halfLife", label: "Half-Life", type: "number", suffix: "years", min: 0.001, max: 1000000000, step: 0.1, defaultValue: 5.27 }',
    '{ name: "timeElapsed", label: "Time Elapsed", type: "number", suffix: "years", min: 0.001, max: 1000000000, step: 0.1, defaultValue: 10 }',
  ],
  `(inputs) => {
      const initial = inputs.initialAmount as number;
      const halfLife = inputs.halfLife as number;
      const time = inputs.timeElapsed as number;
      if (!initial || !halfLife || !time || initial <= 0 || halfLife <= 0 || time <= 0) return null;
      const halfLives = time / halfLife;
      const remaining = initial * Math.pow(0.5, halfLives);
      const decayed = initial - remaining;
      const decayConstant = Math.log(2) / halfLife;
      const percentRemaining = (remaining / initial) * 100;
      return {
        primary: { label: "Remaining Amount", value: formatNumber(Math.round(remaining * 10000) / 10000) + " g" },
        details: [
          { label: "Amount Decayed", value: formatNumber(Math.round(decayed * 10000) / 10000) + " g" },
          { label: "Half-Lives Elapsed", value: formatNumber(Math.round(halfLives * 100) / 100) },
          { label: "Percent Remaining", value: formatNumber(Math.round(percentRemaining * 100) / 100) + "%" },
        ],
      };
    }`,
  [{ q: 'What is radioactive half-life?', a: 'Half-life is the time required for half of the atoms in a radioactive sample to undergo decay. After one half-life, 50 percent remains. After two half-lives, 25 percent remains, and so on.' },
   { q: 'Does the half-life change over time?', a: 'No, the half-life of a radioactive isotope is a constant property that does not change regardless of temperature, pressure, or the amount of material present.' }],
  'Remaining = Initial Amount x (0.5)^(Time Elapsed / Half-Life)',
  ['gas-law-calculator', 'molar-mass-calculator']
);

// #88 Spectrophotometer Calculator
add('spectrophotometer-calculator', 'Spectrophotometer Calculator',
  'Calculate the concentration of a solution using Beer-Lambert law from absorbance and path length data.',
  'Science', 'science', 'A',
  ['Beer-Lambert law', 'spectrophotometer calculator', 'absorbance concentration'],
  [
    '{ name: "absorbance", label: "Measured Absorbance (A)", type: "number", suffix: "AU", min: 0.001, max: 4, step: 0.001, defaultValue: 0.5 }',
    '{ name: "molarAbsorptivity", label: "Molar Absorptivity (epsilon)", type: "number", suffix: "L/mol cm", min: 1, max: 1000000, step: 1, defaultValue: 5000 }',
    '{ name: "pathLength", label: "Path Length", type: "number", suffix: "cm", min: 0.1, max: 10, step: 0.1, defaultValue: 1 }',
  ],
  `(inputs) => {
      const A = inputs.absorbance as number;
      const epsilon = inputs.molarAbsorptivity as number;
      const l = inputs.pathLength as number;
      if (!A || !epsilon || !l || A <= 0 || epsilon <= 0 || l <= 0) return null;
      const concentration = A / (epsilon * l);
      const transmittance = Math.pow(10, -A) * 100;
      const concMM = concentration * 1000;
      const concuM = concentration * 1000000;
      const displayConc = concentration >= 0.001 ? formatNumber(Math.round(concentration * 10000) / 10000) + " M" : formatNumber(Math.round(concuM * 100) / 100) + " uM";
      return {
        primary: { label: "Concentration", value: displayConc },
        details: [
          { label: "Concentration (mM)", value: formatNumber(Math.round(concMM * 10000) / 10000) + " mM" },
          { label: "Percent Transmittance", value: formatNumber(Math.round(transmittance * 100) / 100) + "%" },
          { label: "Equation", value: "A = epsilon x l x c" },
        ],
      };
    }`,
  [{ q: 'What is the Beer-Lambert law?', a: 'The Beer-Lambert law states that absorbance (A) is directly proportional to the concentration (c) of the absorbing species, the path length (l), and the molar absorptivity (epsilon): A = epsilon x l x c.' },
   { q: 'What are the limitations of the Beer-Lambert law?', a: 'The Beer-Lambert law is most accurate at low concentrations. At high concentrations, deviations occur due to molecular interactions, scattering, and detector saturation, typically above an absorbance of 2.' }],
  'Concentration = Absorbance / (Molar Absorptivity x Path Length)',
  ['dilution-factor-calculator', 'buffer-calculator']
);

// #89 Enzyme Kinetics Calculator
add('enzyme-kinetics-calculator', 'Enzyme Kinetics Calculator',
  'Calculate enzyme reaction velocity using the Michaelis-Menten equation from substrate concentration and kinetic parameters.',
  'Science', 'science', 'A',
  ['Michaelis-Menten', 'enzyme kinetics', 'Km Vmax calculator'],
  [
    '{ name: "vmax", label: "Maximum Velocity (Vmax)", type: "number", suffix: "umol/min", min: 0.01, max: 10000, step: 0.1, defaultValue: 100 }',
    '{ name: "km", label: "Michaelis Constant (Km)", type: "number", suffix: "mM", min: 0.001, max: 1000, step: 0.01, defaultValue: 5 }',
    '{ name: "substrateConc", label: "Substrate Concentration [S]", type: "number", suffix: "mM", min: 0.001, max: 10000, step: 0.01, defaultValue: 10 }',
  ],
  `(inputs) => {
      const vmax = inputs.vmax as number;
      const km = inputs.km as number;
      const s = inputs.substrateConc as number;
      if (!vmax || !km || !s || vmax <= 0 || km <= 0 || s <= 0) return null;
      const velocity = (vmax * s) / (km + s);
      const percentVmax = (velocity / vmax) * 100;
      const catalyticEfficiency = vmax / km;
      const halfVmaxConc = km;
      return {
        primary: { label: "Reaction Velocity", value: formatNumber(Math.round(velocity * 100) / 100) + " umol/min" },
        details: [
          { label: "Percent of Vmax", value: formatNumber(Math.round(percentVmax * 10) / 10) + "%" },
          { label: "Catalytic Efficiency (Vmax/Km)", value: formatNumber(Math.round(catalyticEfficiency * 100) / 100) },
          { label: "[S] for Half Vmax", value: formatNumber(km) + " mM (equals Km)" },
        ],
      };
    }`,
  [{ q: 'What is the Michaelis-Menten equation?', a: 'The Michaelis-Menten equation, v = Vmax[S] / (Km + [S]), describes the rate of an enzymatic reaction as a function of substrate concentration, where Vmax is the maximum rate and Km is the substrate concentration at half Vmax.' },
   { q: 'What does Km tell you about an enzyme?', a: 'Km (Michaelis constant) reflects the affinity of an enzyme for its substrate. A lower Km indicates higher affinity, meaning the enzyme reaches half its maximum velocity at a lower substrate concentration.' }],
  'v = Vmax x [S] / (Km + [S])',
  ['spectrophotometer-calculator', 'reaction-yield-calculator']
);

// #90 Electrochemistry Calculator
add('electrochemistry-calculator', 'Electrochemistry Calculator',
  'Calculate cell potential under non-standard conditions using the Nernst equation for electrochemical cells.',
  'Science', 'science', 'A',
  ['Nernst equation', 'cell potential calculator', 'electrochemistry calculator'],
  [
    '{ name: "standardPotential", label: "Standard Cell Potential (E0)", type: "number", suffix: "V", min: -5, max: 5, step: 0.01, defaultValue: 1.1 }',
    '{ name: "electrons", label: "Electrons Transferred (n)", type: "number", suffix: "e-", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "temperature", label: "Temperature", type: "number", suffix: "K", min: 200, max: 500, defaultValue: 298 }',
    '{ name: "reactionQuotient", label: "Reaction Quotient (Q)", type: "number", suffix: "", min: 0.0001, max: 1000000, step: 0.01, defaultValue: 1 }',
  ],
  `(inputs) => {
      const E0 = inputs.standardPotential as number;
      const n = inputs.electrons as number;
      const T = inputs.temperature as number;
      const Q = inputs.reactionQuotient as number;
      if (!n || !T || !Q || n <= 0 || T <= 0 || Q <= 0) return null;
      const R = 8.314;
      const F = 96485;
      const E = E0 - (R * T) / (n * F) * Math.log(Q);
      const spontaneous = E > 0;
      const deltaG = -n * F * E;
      const deltaGkJ = deltaG / 1000;
      return {
        primary: { label: "Cell Potential (E)", value: formatNumber(Math.round(E * 10000) / 10000) + " V" },
        details: [
          { label: "Gibbs Free Energy", value: formatNumber(Math.round(deltaGkJ * 100) / 100) + " kJ/mol" },
          { label: "Spontaneous", value: spontaneous ? "Yes (E > 0)" : "No (E < 0)" },
          { label: "Nernst Correction", value: formatNumber(Math.round((E0 - E) * 10000) / 10000) + " V" },
        ],
      };
    }`,
  [{ q: 'What is the Nernst equation?', a: 'The Nernst equation, E = E0 - (RT/nF)ln(Q), calculates the cell potential under non-standard conditions by adjusting the standard cell potential based on temperature and the reaction quotient.' },
   { q: 'What does a positive cell potential mean?', a: 'A positive cell potential indicates a spontaneous electrochemical reaction (negative Gibbs free energy). A negative cell potential means the reaction is non-spontaneous and requires an external energy source.' }],
  'E = E0 - (RT / nF) x ln(Q)',
  ['molar-mass-calculator', 'gas-law-calculator']
);

// #91 Workers Comp Calculator
add('workers-comp-calculator', 'Workers Comp Calculator',
  'Estimate workers compensation insurance premiums based on payroll, industry classification, and experience modifier.',
  'Finance', 'finance', '$',
  ['workers comp cost', 'workers compensation calculator', 'workers comp premium'],
  [
    '{ name: "annualPayroll", label: "Annual Payroll", type: "number", prefix: "$", min: 10000, max: 50000000, step: 5000, defaultValue: 500000 }',
    '{ name: "classCode", label: "Industry Risk Class", type: "select", options: [{value:"office",label:"Office/Clerical (low risk)"},{value:"retail",label:"Retail/Service (moderate)"},{value:"manufacturing",label:"Manufacturing (high)"},{value:"construction",label:"Construction (very high)"}], defaultValue: "retail" }',
    '{ name: "experienceMod", label: "Experience Modification Rate", type: "number", suffix: "", min: 0.5, max: 2.0, step: 0.01, defaultValue: 1.0 }',
    '{ name: "state", label: "State Rate Tier", type: "select", options: [{value:"low",label:"Low Rate State"},{value:"medium",label:"Medium Rate State"},{value:"high",label:"High Rate State"}], defaultValue: "medium" }',
  ],
  `(inputs) => {
      const payroll = inputs.annualPayroll as number;
      const classCode = inputs.classCode as string;
      const eMod = inputs.experienceMod as number;
      const state = inputs.state as string;
      if (!payroll || payroll <= 0) return null;
      const baseRates: Record<string, number> = { office: 0.005, retail: 0.015, manufacturing: 0.035, construction: 0.08 };
      const stateMod: Record<string, number> = { low: 0.8, medium: 1.0, high: 1.25 };
      const baseRate = baseRates[classCode] || 0.015;
      const premium = payroll * baseRate * eMod * (stateMod[state] || 1.0);
      const perEmployee = premium / (payroll / 50000);
      const monthlyPremium = premium / 12;
      return {
        primary: { label: "Estimated Annual Premium", value: "$" + formatNumber(Math.round(premium)) },
        details: [
          { label: "Monthly Premium", value: "$" + formatNumber(Math.round(monthlyPremium)) },
          { label: "Rate per $100 of Payroll", value: "$" + formatNumber(Math.round(baseRate * eMod * (stateMod[state] || 1.0) * 10000) / 100) },
          { label: "Approximate Cost per Employee", value: "$" + formatNumber(Math.round(perEmployee)) },
        ],
      };
    }`,
  [{ q: 'How is workers compensation insurance calculated?', a: 'Workers compensation premiums are calculated by multiplying the employer payroll by a rate based on the industry classification code, then adjusting by the experience modification rate. Rates vary significantly by industry risk level.' },
   { q: 'What is an experience modification rate?', a: 'The experience modification rate (EMR or e-mod) is a number that compares your company claim history to others in your industry. An EMR below 1.0 indicates fewer claims than average, resulting in lower premiums.' }],
  'Premium = Annual Payroll x Base Rate x Experience Mod x State Modifier',
  ['commercial-insurance-calculator', 'disability-benefits-calculator']
);

// #92 Wrongful Termination Calculator
add('wrongful-termination-calculator', 'Wrongful Termination Calculator',
  'Estimate the potential value of a wrongful termination claim based on lost wages, tenure, and circumstances.',
  'Finance', 'finance', '$',
  ['wrongful termination value', 'wrongful termination settlement', 'wrongful firing calculator'],
  [
    '{ name: "annualSalary", label: "Annual Salary at Termination", type: "number", prefix: "$", min: 15000, max: 1000000, step: 1000, defaultValue: 75000 }',
    '{ name: "yearsEmployed", label: "Years Employed", type: "number", suffix: "years", min: 0.5, max: 40, step: 0.5, defaultValue: 5 }',
    '{ name: "circumstance", label: "Termination Circumstance", type: "select", options: [{value:"discrimination",label:"Discrimination"},{value:"retaliation",label:"Retaliation"},{value:"breach",label:"Contract Breach"},{value:"whistleblower",label:"Whistleblower Retaliation"}], defaultValue: "discrimination" }',
    '{ name: "monthsUnemployed", label: "Months Unemployed After", type: "number", suffix: "months", min: 1, max: 36, defaultValue: 6 }',
  ],
  `(inputs) => {
      const salary = inputs.annualSalary as number;
      const years = inputs.yearsEmployed as number;
      const circumstance = inputs.circumstance as string;
      const months = inputs.monthsUnemployed as number;
      if (!salary || salary <= 0) return null;
      const lostWages = salary * (months / 12);
      const benefitsLost = lostWages * 0.3;
      const circumstanceMod: Record<string, number> = { discrimination: 2.0, retaliation: 1.8, breach: 1.2, whistleblower: 2.5 };
      const emotionalDamages = salary * 0.5 * (circumstanceMod[circumstance] || 1.5);
      const tenureMod = Math.min(years * 0.1, 1.5);
      const lowEstimate = (lostWages + benefitsLost) * (1 + tenureMod);
      const highEstimate = (lostWages + benefitsLost + emotionalDamages) * (1 + tenureMod);
      return {
        primary: { label: "Estimated Settlement Range", value: "$" + formatNumber(Math.round(lowEstimate)) + " - $" + formatNumber(Math.round(highEstimate)) },
        details: [
          { label: "Lost Wages", value: "$" + formatNumber(Math.round(lostWages)) },
          { label: "Lost Benefits Value", value: "$" + formatNumber(Math.round(benefitsLost)) },
          { label: "Potential Emotional Damages", value: "$" + formatNumber(Math.round(emotionalDamages)) },
        ],
      };
    }`,
  [{ q: 'What qualifies as wrongful termination?', a: 'Wrongful termination occurs when an employer fires an employee in violation of federal or state law, such as discrimination based on protected characteristics, retaliation for reporting violations, or breach of an employment contract.' },
   { q: 'How long do wrongful termination cases take?', a: 'Wrongful termination cases typically take 6 months to 2 years to resolve. Cases that go to trial can take longer, while settlements through mediation may be reached more quickly.' }],
  'Settlement Range = (Lost Wages + Benefits + Damages) x (1 + Tenure Modifier)',
  ['disability-benefits-calculator', 'workers-comp-calculator']
);

// #93 Disability Benefits Calculator
add('disability-benefits-calculator', 'Disability Benefits Calculator',
  'Estimate Social Security Disability Insurance (SSDI) benefits based on work history and earnings.',
  'Finance', 'finance', '$',
  ['SSDI calculator', 'disability benefits estimate', 'social security disability'],
  [
    '{ name: "avgMonthlyEarnings", label: "Average Indexed Monthly Earnings", type: "number", prefix: "$", min: 500, max: 15000, step: 100, defaultValue: 5000 }',
    '{ name: "workYears", label: "Years of Work History", type: "number", suffix: "years", min: 5, max: 45, defaultValue: 20 }',
    '{ name: "age", label: "Current Age", type: "number", suffix: "years", min: 21, max: 66, defaultValue: 45 }',
  ],
  `(inputs) => {
      const aime = inputs.avgMonthlyEarnings as number;
      const workYears = inputs.workYears as number;
      const age = inputs.age as number;
      if (!aime || aime <= 0 || !workYears) return null;
      const bendPoint1 = 1115;
      const bendPoint2 = 6721;
      let pia = 0;
      if (aime <= bendPoint1) {
        pia = aime * 0.9;
      } else if (aime <= bendPoint2) {
        pia = bendPoint1 * 0.9 + (aime - bendPoint1) * 0.32;
      } else {
        pia = bendPoint1 * 0.9 + (bendPoint2 - bendPoint1) * 0.32 + (aime - bendPoint2) * 0.15;
      }
      const monthlyBenefit = Math.round(pia);
      const annualBenefit = monthlyBenefit * 12;
      const familyMax = monthlyBenefit * 1.5;
      return {
        primary: { label: "Estimated Monthly SSDI Benefit", value: "$" + formatNumber(monthlyBenefit) },
        details: [
          { label: "Annual Benefit", value: "$" + formatNumber(annualBenefit) },
          { label: "Family Maximum Benefit", value: "$" + formatNumber(Math.round(familyMax)) + "/month" },
          { label: "Work Credits Earned", value: formatNumber(Math.min(workYears * 4, 40)) + " of 40 needed" },
        ],
      };
    }`,
  [{ q: 'How is the SSDI benefit amount calculated?', a: 'SSDI benefits are based on your Average Indexed Monthly Earnings (AIME) using a formula with bend points. The formula replaces 90 percent of the first $1,115, 32 percent of earnings up to $6,721, and 15 percent above that.' },
   { q: 'How many work credits do you need for SSDI?', a: 'Generally, you need 40 work credits (about 10 years of work) to qualify for SSDI. Younger workers may qualify with fewer credits depending on their age at the onset of disability.' }],
  'PIA = 90% of first $1,115 AIME + 32% of AIME up to $6,721 + 15% above',
  ['workers-comp-calculator', 'veteran-benefits-calculator']
);

// #94 Mesothelioma Settlement Calculator
add('mesothelioma-settlement-calculator', 'Mesothelioma Settlement Calculator',
  'Estimate the potential settlement range for a mesothelioma or asbestos exposure claim based on key factors.',
  'Finance', 'finance', '$',
  ['mesothelioma settlement', 'asbestos settlement calculator', 'mesothelioma claim value'],
  [
    '{ name: "diagnosisStage", label: "Diagnosis Stage", type: "select", options: [{value:"1",label:"Stage 1"},{value:"2",label:"Stage 2"},{value:"3",label:"Stage 3"},{value:"4",label:"Stage 4"}], defaultValue: "2" }',
    '{ name: "exposureYears", label: "Years of Asbestos Exposure", type: "number", suffix: "years", min: 1, max: 50, defaultValue: 15 }',
    '{ name: "age", label: "Age at Diagnosis", type: "number", suffix: "years", min: 30, max: 90, defaultValue: 65 }',
    '{ name: "claimType", label: "Claim Type", type: "select", options: [{value:"lawsuit",label:"Personal Injury Lawsuit"},{value:"trust",label:"Asbestos Trust Fund"},{value:"va",label:"VA Claim"},{value:"wrongfulDeath",label:"Wrongful Death"}], defaultValue: "lawsuit" }',
  ],
  `(inputs) => {
      const stage = parseInt(inputs.diagnosisStage as string);
      const exposureYears = inputs.exposureYears as number;
      const age = inputs.age as number;
      const claimType = inputs.claimType as string;
      if (!stage || !exposureYears) return null;
      const stageMultiplier: Record<number, number> = { 1: 0.6, 2: 1.0, 3: 1.4, 4: 1.8 };
      const claimBase: Record<string, number> = { lawsuit: 1000000, trust: 300000, va: 200000, wrongfulDeath: 1200000 };
      const base = claimBase[claimType] || 1000000;
      const stageMod = stageMultiplier[stage] || 1.0;
      const exposureMod = Math.min(exposureYears * 0.05, 1.0) + 0.5;
      const lowEstimate = base * stageMod * exposureMod * 0.5;
      const highEstimate = base * stageMod * exposureMod * 1.5;
      const avgSettlement = (lowEstimate + highEstimate) / 2;
      return {
        primary: { label: "Estimated Settlement Range", value: "$" + formatNumber(Math.round(lowEstimate)) + " - $" + formatNumber(Math.round(highEstimate)) },
        details: [
          { label: "Average Estimated Value", value: "$" + formatNumber(Math.round(avgSettlement)) },
          { label: "Claim Type", value: claimType === "wrongfulDeath" ? "Wrongful Death" : claimType === "va" ? "VA Claim" : claimType === "trust" ? "Trust Fund" : "Lawsuit" },
          { label: "Exposure Duration Factor", value: formatNumber(Math.round(exposureMod * 100) / 100) + "x" },
        ],
      };
    }`,
  [{ q: 'What is the average mesothelioma settlement?', a: 'Mesothelioma settlements typically range from $1 million to $2.4 million, with trial verdicts sometimes exceeding $5 million. The amount depends on the stage of disease, exposure history, and responsible parties.' },
   { q: 'What are asbestos trust funds?', a: 'Asbestos trust funds were established by companies that filed for bankruptcy due to asbestos liabilities. These trusts hold billions of dollars to compensate victims and typically pay claims faster than lawsuits.' }],
  'Settlement Range = Base Value x Stage Multiplier x Exposure Modifier',
  ['workers-comp-calculator', 'medical-debt-calculator']
);

// #95 Medical Debt Calculator
add('medical-debt-calculator', 'Medical Debt Calculator',
  'Plan medical debt repayment by calculating monthly payments, total interest, and payoff timeline.',
  'Finance', 'finance', '$',
  ['medical debt repayment', 'medical bill calculator', 'medical debt payoff'],
  [
    '{ name: "totalDebt", label: "Total Medical Debt", type: "number", prefix: "$", min: 100, max: 1000000, step: 100, defaultValue: 15000 }',
    '{ name: "interestRate", label: "Interest Rate (if financed)", type: "number", suffix: "%", min: 0, max: 30, step: 0.5, defaultValue: 8 }',
    '{ name: "monthlyPayment", label: "Monthly Payment Amount", type: "number", prefix: "$", min: 25, max: 50000, step: 25, defaultValue: 300 }',
  ],
  `(inputs) => {
      const debt = inputs.totalDebt as number;
      const rate = (inputs.interestRate as number) / 100 / 12;
      const payment = inputs.monthlyPayment as number;
      if (!debt || !payment || debt <= 0 || payment <= 0) return null;
      let balance = debt;
      let totalPaid = 0;
      let totalInterest = 0;
      let months = 0;
      const maxMonths = 600;
      while (balance > 0 && months < maxMonths) {
        const interest = balance * rate;
        totalInterest += interest;
        balance = balance + interest - payment;
        totalPaid += payment;
        months++;
        if (payment <= balance * rate) {
          return {
            primary: { label: "Payment Too Low", value: "Debt will not be paid off" },
            details: [
              { label: "Monthly Interest Charge", value: "$" + formatNumber(Math.round(debt * rate * 100) / 100) },
              { label: "Minimum Payment Needed", value: "$" + formatNumber(Math.round(debt * rate * 1.1 * 100) / 100) },
              { label: "Total Debt", value: "$" + formatNumber(debt) },
            ],
          };
        }
      }
      if (balance < 0) { totalPaid += balance; }
      const years = Math.floor(months / 12);
      const remainMonths = months % 12;
      const timeline = years > 0 ? years + " years " + remainMonths + " months" : months + " months";
      return {
        primary: { label: "Payoff Timeline", value: timeline },
        details: [
          { label: "Total Amount Paid", value: "$" + formatNumber(Math.round(totalPaid)) },
          { label: "Total Interest Paid", value: "$" + formatNumber(Math.round(totalInterest)) },
          { label: "Interest as Percent of Debt", value: formatNumber(Math.round(totalInterest / debt * 10000) / 100) + "%" },
        ],
      };
    }`,
  [{ q: 'Can you negotiate medical debt?', a: 'Yes, medical debt is often negotiable. Many hospitals offer financial assistance programs, and providers may accept 20 to 50 percent less than the billed amount for lump-sum payments or hardship cases.' },
   { q: 'Does medical debt affect your credit score?', a: 'Medical debt under $500 no longer appears on credit reports. Larger debts may appear after a one-year waiting period, giving you time to resolve billing disputes or set up payment plans.' }],
  'Payoff calculated by iterating: New Balance = (Old Balance + Monthly Interest) - Monthly Payment',
  ['nursing-home-cost-calculator', 'disability-benefits-calculator']
);

// #96 Nursing Home Cost Calculator
add('nursing-home-cost-calculator', 'Nursing Home Cost Calculator',
  'Estimate the cost of nursing home care based on room type, location, and length of stay.',
  'Finance', 'finance', '$',
  ['nursing home cost', 'long-term care cost', 'skilled nursing facility cost'],
  [
    '{ name: "roomType", label: "Room Type", type: "select", options: [{value:"shared",label:"Shared Room"},{value:"private",label:"Private Room"}], defaultValue: "shared" }',
    '{ name: "region", label: "Geographic Region", type: "select", options: [{value:"low",label:"Low Cost Region"},{value:"medium",label:"Medium Cost Region"},{value:"high",label:"High Cost Region"},{value:"vhigh",label:"Very High Cost Region"}], defaultValue: "medium" }',
    '{ name: "months", label: "Expected Length of Stay", type: "number", suffix: "months", min: 1, max: 120, defaultValue: 24 }',
    '{ name: "careLevel", label: "Level of Care", type: "select", options: [{value:"basic",label:"Basic Skilled Nursing"},{value:"enhanced",label:"Enhanced Care"},{value:"memory",label:"Memory Care Unit"}], defaultValue: "basic" }',
  ],
  `(inputs) => {
      const room = inputs.roomType as string;
      const region = inputs.region as string;
      const months = inputs.months as number;
      const care = inputs.careLevel as string;
      if (!months || months <= 0) return null;
      const roomCosts: Record<string, number> = { shared: 7500, private: 9000 };
      const regionMod: Record<string, number> = { low: 0.75, medium: 1.0, high: 1.35, vhigh: 1.7 };
      const careMod: Record<string, number> = { basic: 1.0, enhanced: 1.2, memory: 1.5 };
      const monthlyBase = roomCosts[room] || 7500;
      const monthlyCost = monthlyBase * (regionMod[region] || 1.0) * (careMod[care] || 1.0);
      const totalCost = monthlyCost * months;
      const dailyCost = monthlyCost / 30;
      const annualCost = monthlyCost * 12;
      return {
        primary: { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
          { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost)) },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        ],
      };
    }`,
  [{ q: 'How much does a nursing home cost per month?', a: 'The national median cost is approximately $7,500 per month for a shared room and $9,000 for a private room, though costs vary significantly by region and level of care required.' },
   { q: 'Does Medicare cover nursing home costs?', a: 'Medicare covers up to 100 days of skilled nursing care after a qualifying hospital stay, with full coverage for the first 20 days and a daily copay for days 21 through 100. It does not cover long-term custodial care.' }],
  'Total Cost = Monthly Base Rate x Region Modifier x Care Level Modifier x Months',
  ['assisted-living-cost-calculator', 'memory-care-cost-calculator']
);

// #97 Assisted Living Cost Calculator
add('assisted-living-cost-calculator', 'Assisted Living Cost Calculator',
  'Estimate the monthly and annual costs of assisted living based on location, care needs, and amenities.',
  'Finance', 'finance', '$',
  ['assisted living cost', 'assisted living calculator', 'senior living cost'],
  [
    '{ name: "region", label: "Geographic Region", type: "select", options: [{value:"low",label:"Low Cost Region"},{value:"medium",label:"Medium Cost Region"},{value:"high",label:"High Cost Region"},{value:"vhigh",label:"Very High Cost Metro"}], defaultValue: "medium" }',
    '{ name: "careLevel", label: "Level of Assistance", type: "select", options: [{value:"minimal",label:"Minimal (independent)"},{value:"moderate",label:"Moderate (daily help)"},{value:"extensive",label:"Extensive (significant help)"}], defaultValue: "moderate" }',
    '{ name: "apartmentSize", label: "Apartment Size", type: "select", options: [{value:"studio",label:"Studio"},{value:"oneBed",label:"One Bedroom"},{value:"twoBed",label:"Two Bedroom"}], defaultValue: "oneBed" }',
    '{ name: "years", label: "Expected Duration of Stay", type: "number", suffix: "years", min: 1, max: 20, defaultValue: 3 }',
  ],
  `(inputs) => {
      const region = inputs.region as string;
      const care = inputs.careLevel as string;
      const size = inputs.apartmentSize as string;
      const years = inputs.years as number;
      if (!years || years <= 0) return null;
      const baseCosts: Record<string, number> = { studio: 3800, oneBed: 4500, twoBed: 5500 };
      const regionMod: Record<string, number> = { low: 0.7, medium: 1.0, high: 1.4, vhigh: 1.8 };
      const careMod: Record<string, number> = { minimal: 1.0, moderate: 1.3, extensive: 1.7 };
      const monthlyCost = (baseCosts[size] || 4500) * (regionMod[region] || 1.0) * (careMod[care] || 1.3);
      const annualCost = monthlyCost * 12;
      const totalCost = annualCost * years;
      const annualIncrease = 0.04;
      let inflationAdjusted = 0;
      for (let i = 0; i < years; i++) {
        inflationAdjusted += annualCost * Math.pow(1 + annualIncrease, i);
      }
      return {
        primary: { label: "Estimated Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
        details: [
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
          { label: "Total Cost (" + years + " years)", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Inflation-Adjusted Total", value: "$" + formatNumber(Math.round(inflationAdjusted)) },
        ],
      };
    }`,
  [{ q: 'What is the average cost of assisted living?', a: 'The national median cost of assisted living is approximately $4,500 per month, though costs range from $2,500 in lower-cost areas to over $8,000 in major metropolitan areas.' },
   { q: 'What is the difference between assisted living and a nursing home?', a: 'Assisted living provides help with daily activities like bathing, dressing, and medication management in a residential setting. Nursing homes provide 24-hour skilled medical care for those with more serious health needs.' }],
  'Monthly Cost = Base Rate x Region Modifier x Care Level Modifier',
  ['nursing-home-cost-calculator', 'memory-care-cost-calculator']
);

// #98 Memory Care Cost Calculator
add('memory-care-cost-calculator', 'Memory Care Cost Calculator',
  'Estimate the cost of memory care facilities for individuals with dementia or Alzheimer disease.',
  'Finance', 'finance', '$',
  ['memory care cost', 'dementia care cost', 'Alzheimer care calculator'],
  [
    '{ name: "region", label: "Geographic Region", type: "select", options: [{value:"low",label:"Low Cost Region"},{value:"medium",label:"Medium Cost Region"},{value:"high",label:"High Cost Region"},{value:"vhigh",label:"Major Metro Area"}], defaultValue: "medium" }',
    '{ name: "diseaseStage", label: "Disease Stage", type: "select", options: [{value:"early",label:"Early Stage"},{value:"middle",label:"Middle Stage"},{value:"late",label:"Late Stage"}], defaultValue: "middle" }',
    '{ name: "months", label: "Expected Duration", type: "number", suffix: "months", min: 1, max: 120, defaultValue: 36 }',
  ],
  `(inputs) => {
      const region = inputs.region as string;
      const stage = inputs.diseaseStage as string;
      const months = inputs.months as number;
      if (!months || months <= 0) return null;
      const baseMonthly = 6500;
      const regionMod: Record<string, number> = { low: 0.75, medium: 1.0, high: 1.35, vhigh: 1.7 };
      const stageMod: Record<string, number> = { early: 0.9, middle: 1.0, late: 1.3 };
      const monthlyCost = baseMonthly * (regionMod[region] || 1.0) * (stageMod[stage] || 1.0);
      const annualCost = monthlyCost * 12;
      const totalCost = monthlyCost * months;
      const dailyCost = monthlyCost / 30;
      return {
        primary: { label: "Monthly Memory Care Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
        details: [
          { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost)) },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
          { label: "Total Projected Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        ],
      };
    }`,
  [{ q: 'How much does memory care cost per month?', a: 'Memory care typically costs $5,000 to $10,000 per month nationally, with the average around $6,500. Costs increase as the disease progresses and more intensive care is required.' },
   { q: 'Does insurance cover memory care?', a: 'Standard health insurance and Medicare do not cover memory care facility costs. Long-term care insurance may cover a portion, and Medicaid may help once personal assets are exhausted.' }],
  'Monthly Cost = Base Rate ($6,500) x Region Modifier x Disease Stage Modifier',
  ['nursing-home-cost-calculator', 'assisted-living-cost-calculator']
);

// #99 Hospice Cost Calculator
add('hospice-cost-calculator', 'Hospice Cost Calculator',
  'Estimate end-of-life hospice care costs based on care setting, duration, and service level.',
  'Finance', 'finance', '$',
  ['hospice cost', 'end of life care cost', 'hospice care calculator'],
  [
    '{ name: "careSetting", label: "Care Setting", type: "select", options: [{value:"home",label:"Home Hospice"},{value:"facility",label:"Inpatient Hospice Facility"},{value:"nursing",label:"Nursing Home with Hospice"}], defaultValue: "home" }',
    '{ name: "serviceLevel", label: "Service Level", type: "select", options: [{value:"routine",label:"Routine Home Care"},{value:"continuous",label:"Continuous Home Care"},{value:"respite",label:"Respite Care"},{value:"inpatient",label:"General Inpatient Care"}], defaultValue: "routine" }',
    '{ name: "days", label: "Expected Duration", type: "number", suffix: "days", min: 1, max: 365, defaultValue: 90 }',
  ],
  `(inputs) => {
      const setting = inputs.careSetting as string;
      const level = inputs.serviceLevel as string;
      const days = inputs.days as number;
      if (!days || days <= 0) return null;
      const settingCosts: Record<string, number> = { home: 200, facility: 750, nursing: 500 };
      const levelMod: Record<string, number> = { routine: 1.0, continuous: 4.5, respite: 1.8, inpatient: 3.5 };
      const dailyCost = (settingCosts[setting] || 200) * (levelMod[level] || 1.0);
      const totalCost = dailyCost * days;
      const monthlyCost = dailyCost * 30;
      const medicareCoverage = setting === "home" ? "Typically covered under Medicare Hospice Benefit" : "May be partially covered";
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost)) },
          { label: "Monthly Equivalent", value: "$" + formatNumber(Math.round(monthlyCost)) },
          { label: "Medicare Coverage", value: medicareCoverage },
        ],
      };
    }`,
  [{ q: 'Does Medicare cover hospice care?', a: 'Yes, Medicare Part A covers hospice care for terminally ill patients with a life expectancy of six months or less. It covers nursing care, medications for symptom control, medical equipment, and counseling.' },
   { q: 'What services does hospice provide?', a: 'Hospice provides pain management, symptom control, nursing visits, medical equipment, medications related to the terminal illness, counseling, and support for both the patient and family members.' }],
  'Total Cost = Daily Rate x Service Level Modifier x Number of Days',
  ['nursing-home-cost-calculator', 'memory-care-cost-calculator']
);

// #100 Veteran Benefits Calculator
add('veteran-benefits-calculator', 'Veteran Benefits Calculator',
  'Estimate monthly VA disability compensation and education benefits based on service history and disability rating.',
  'Finance', 'finance', '$',
  ['VA benefits calculator', 'veteran disability compensation', 'VA disability pay'],
  [
    '{ name: "disabilityRating", label: "VA Disability Rating", type: "select", options: [{value:"10",label:"10%"},{value:"20",label:"20%"},{value:"30",label:"30%"},{value:"40",label:"40%"},{value:"50",label:"50%"},{value:"60",label:"60%"},{value:"70",label:"70%"},{value:"80",label:"80%"},{value:"90",label:"90%"},{value:"100",label:"100%"}], defaultValue: "30" }',
    '{ name: "dependents", label: "Number of Dependents", type: "number", suffix: "dependents", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "serviceYears", label: "Years of Service", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 8 }',
    '{ name: "educationBenefit", label: "Education Benefit", type: "select", options: [{value:"none",label:"Not Using"},{value:"gi",label:"Post-9/11 GI Bill"},{value:"voc",label:"Vocational Rehab"}], defaultValue: "none" }',
  ],
  `(inputs) => {
      const rating = parseInt(inputs.disabilityRating as string);
      const dependents = inputs.dependents as number;
      const serviceYears = inputs.serviceYears as number;
      const education = inputs.educationBenefit as string;
      if (!rating) return null;
      const baseRates: Record<number, number> = { 10: 171, 20: 338, 30: 524, 40: 755, 50: 1075, 60: 1361, 70: 1716, 80: 1995, 90: 2241, 100: 3737 };
      const baseComp = baseRates[rating] || 0;
      const depBonus = rating >= 30 ? dependents * (rating >= 70 ? 150 : 100) : 0;
      const monthlyComp = baseComp + depBonus;
      const annualComp = monthlyComp * 12;
      let educationValue = 0;
      if (education === "gi") educationValue = 27120;
      else if (education === "voc") educationValue = 20000;
      const totalAnnualBenefits = annualComp + educationValue;
      return {
        primary: { label: "Monthly Disability Compensation", value: "$" + formatNumber(Math.round(monthlyComp)) },
        details: [
          { label: "Annual Compensation", value: "$" + formatNumber(Math.round(annualComp)) },
          { label: "Annual Education Benefit", value: education === "none" ? "Not applicable" : "$" + formatNumber(educationValue) },
          { label: "Total Annual Benefits", value: "$" + formatNumber(Math.round(totalAnnualBenefits)) },
        ],
      };
    }`,
  [{ q: 'How is VA disability compensation calculated?', a: 'VA disability compensation is based on a combined disability rating percentage, with higher ratings receiving more monthly compensation. Veterans rated 30 percent or higher also receive additional payments for dependents.' },
   { q: 'What is the Post-9/11 GI Bill?', a: 'The Post-9/11 GI Bill provides up to 36 months of education benefits covering tuition and fees, a monthly housing allowance, and a book stipend for veterans who served on active duty after September 10, 2001.' }],
  'Monthly Compensation = Base Rate for Rating + (Dependents x Dependent Bonus)',
  ['disability-benefits-calculator', 'workers-comp-calculator']
);
