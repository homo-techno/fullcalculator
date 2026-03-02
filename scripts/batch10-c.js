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
