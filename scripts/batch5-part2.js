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
