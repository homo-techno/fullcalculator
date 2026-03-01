// #51 Fertility by Age Calculator
add('fertility-by-age-calculator', 'Fertility by Age Calculator',
  'Estimate fertility potential based on age, providing probability of conception per cycle and time-to-pregnancy estimates.',
  'Health', 'health', 'H',
  ['fertility by age', 'age fertility decline', 'conception probability by age'],
  [
    '{ name: "age", label: "Current Age", type: "number", suffix: "years", min: 18, max: 50, defaultValue: 30 }',
    '{ name: "cyclesPerYear", label: "Cycles Per Year", type: "number", min: 6, max: 13, defaultValue: 12 }',
    '{ name: "healthStatus", label: "General Health", type: "select", options: [{value:"excellent",label:"Excellent"},{value:"good",label:"Good"},{value:"fair",label:"Fair"}], defaultValue: "good" }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const cycles = inputs.cyclesPerYear as number;
      const health = inputs.healthStatus as string;
      if (!age || age <= 0 || !cycles) return null;
      const baseFertility: Record<number, number> = {};
      for (let a = 18; a <= 50; a++) {
        if (a <= 25) baseFertility[a] = 0.25;
        else if (a <= 30) baseFertility[a] = 0.25 - (a - 25) * 0.01;
        else if (a <= 35) baseFertility[a] = 0.20 - (a - 30) * 0.02;
        else if (a <= 40) baseFertility[a] = 0.10 - (a - 35) * 0.015;
        else baseFertility[a] = Math.max(0.01, 0.025 - (a - 40) * 0.003);
      }
      const baseRate = baseFertility[Math.min(Math.max(Math.round(age), 18), 50)] || 0.05;
      const healthMod: Record<string, number> = { excellent: 1.1, good: 1.0, fair: 0.85 };
      const adjRate = baseRate * (healthMod[health] || 1.0);
      const annualProb = 1 - Math.pow(1 - adjRate, cycles);
      const monthsToConceive = adjRate > 0 ? Math.round(1 / adjRate) : 0;
      return {
        primary: { label: "Conception Chance Per Cycle", value: formatNumber(Math.round(adjRate * 1000) / 10) + "%" },
        details: [
          { label: "Annual Conception Probability", value: formatNumber(Math.round(annualProb * 1000) / 10) + "%" },
          { label: "Estimated Months to Conceive", value: formatNumber(monthsToConceive) + " months" },
          { label: "Cycles Per Year", value: formatNumber(cycles) },
        ],
      };
    }`,
  [{ q: 'At what age does fertility start to decline significantly?', a: 'Fertility begins a gradual decline after age 30 and drops more steeply after age 35. By age 40, the chance of conceiving per cycle is significantly lower than at age 25.' },
   { q: 'Can lifestyle factors improve fertility at older ages?', a: 'Maintaining a healthy weight, avoiding smoking and excessive alcohol, managing stress, and regular exercise can support fertility at any age, though they do not fully offset age-related decline.' }],
  'Conception Rate Per Cycle = Base Fertility Rate x Health Modifier; Annual Probability = 1 - (1 - Cycle Rate) ^ Cycles Per Year',
  ['implantation-date-calculator', 'chances-of-twins-calculator']
);

// #52 hCG Doubling Time Calculator
add('hcg-doubling-time-calculator', 'hCG Doubling Time Calculator',
  'Calculate the doubling time of hCG levels between two blood draws to assess early pregnancy viability.',
  'Health', 'health', 'H',
  ['hcg doubling time', 'hcg levels', 'beta hcg calculator'],
  [
    '{ name: "firstLevel", label: "First hCG Level", type: "number", suffix: "mIU/mL", min: 1, max: 200000, defaultValue: 120 }',
    '{ name: "secondLevel", label: "Second hCG Level", type: "number", suffix: "mIU/mL", min: 1, max: 400000, defaultValue: 300 }',
    '{ name: "hoursBetween", label: "Hours Between Tests", type: "number", suffix: "hours", min: 12, max: 240, defaultValue: 48 }',
  ],
  `(inputs) => {
      const first = inputs.firstLevel as number;
      const second = inputs.secondLevel as number;
      const hours = inputs.hoursBetween as number;
      if (!first || !second || !hours || first <= 0 || second <= 0) return null;
      const doublingTime = (hours * Math.log(2)) / Math.log(second / first);
      const percentIncrease = ((second - first) / first) * 100;
      const isNormal = doublingTime > 0 && doublingTime <= 72;
      return {
        primary: { label: "hCG Doubling Time", value: formatNumber(Math.round(doublingTime * 10) / 10) + " hours" },
        details: [
          { label: "Percent Increase", value: formatNumber(Math.round(percentIncrease * 10) / 10) + "%" },
          { label: "First Level", value: formatNumber(first) + " mIU/mL" },
          { label: "Assessment", value: isNormal ? "Within normal doubling range" : "Outside typical range - consult provider" },
        ],
      };
    }`,
  [{ q: 'What is a normal hCG doubling time?', a: 'In early pregnancy, hCG levels typically double every 48 to 72 hours. Doubling times slower than 72 hours may warrant further evaluation but do not always indicate a problem.' },
   { q: 'When do hCG levels stop doubling?', a: 'hCG levels rise rapidly in the first 8 to 11 weeks of pregnancy, then plateau and gradually decline for the rest of the pregnancy. After about 6,000 mIU/mL, doubling slows naturally.' }],
  'Doubling Time = (Hours Between Tests x ln(2)) / ln(Second Level / First Level)',
  ['implantation-date-calculator', 'reverse-due-date-calculator']
);

// #53 Implantation Date Calculator
add('implantation-date-calculator', 'Implantation Date Calculator',
  'Estimate the implantation window based on ovulation date or last menstrual period to predict when implantation likely occurred.',
  'Health', 'health', 'H',
  ['implantation date', 'implantation window', 'when does implantation occur'],
  [
    '{ name: "cycleDay", label: "Cycle Day of Ovulation", type: "number", suffix: "day", min: 8, max: 30, defaultValue: 14 }',
    '{ name: "daysPostOvulation", label: "Days Post Ovulation (DPO)", type: "number", suffix: "days", min: 0, max: 20, defaultValue: 0 }',
    '{ name: "cycleLength", label: "Average Cycle Length", type: "number", suffix: "days", min: 21, max: 40, defaultValue: 28 }',
  ],
  `(inputs) => {
      const ovDay = inputs.cycleDay as number;
      const dpo = inputs.daysPostOvulation as number;
      const cycleLen = inputs.cycleLength as number;
      if (!ovDay || !cycleLen) return null;
      const earlyImplant = 6;
      const lateImplant = 12;
      const avgImplant = 9;
      const earlyDPO = earlyImplant;
      const lateDPO = lateImplant;
      const avgDPO = avgImplant;
      const earlyTestDay = earlyImplant + 3;
      const reliableTestDay = lateImplant + 3;
      return {
        primary: { label: "Most Likely Implantation", value: formatNumber(avgDPO) + " DPO (days post ovulation)" },
        details: [
          { label: "Earliest Implantation", value: formatNumber(earlyDPO) + " DPO" },
          { label: "Latest Implantation", value: formatNumber(lateDPO) + " DPO" },
          { label: "Earliest Reliable Test Day", value: formatNumber(reliableTestDay) + " DPO" },
        ],
      };
    }`,
  [{ q: 'When does implantation typically occur after ovulation?', a: 'Implantation most commonly occurs between 6 and 12 days post ovulation, with the majority happening around 8 to 10 days after ovulation.' },
   { q: 'What are common signs of implantation?', a: 'Some people experience light spotting, mild cramping, or breast tenderness around the time of implantation, though many have no noticeable symptoms at all.' }],
  'Implantation Window = Ovulation Day + 6 to 12 days; Test Day = Implantation + 3 days',
  ['hcg-doubling-time-calculator', 'reverse-due-date-calculator']
);

// #54 Reverse Due Date Calculator
add('reverse-due-date-calculator', 'Reverse Due Date Calculator',
  'Calculate the estimated conception date and fertile window from a given due date or birth date.',
  'Health', 'health', 'H',
  ['reverse due date', 'conception date from due date', 'when did i conceive'],
  [
    '{ name: "gestationWeeks", label: "Gestation at Delivery", type: "number", suffix: "weeks", min: 34, max: 42, defaultValue: 40 }',
    '{ name: "dueDateMethod", label: "Date Type", type: "select", options: [{value:"due",label:"Due Date"},{value:"birth",label:"Birth Date"}], defaultValue: "due" }',
    '{ name: "cycleLength", label: "Average Cycle Length", type: "number", suffix: "days", min: 21, max: 40, defaultValue: 28 }',
  ],
  `(inputs) => {
      const weeks = inputs.gestationWeeks as number;
      const method = inputs.dueDateMethod as string;
      const cycleLen = inputs.cycleLength as number;
      if (!weeks || !cycleLen) return null;
      const totalDays = weeks * 7;
      const ovulationDay = cycleLen - 14;
      const conceptionDaysBeforeDue = totalDays - ovulationDay;
      const fertileWindowStart = conceptionDaysBeforeDue + 5;
      const fertileWindowEnd = conceptionDaysBeforeDue - 1;
      const lmpDaysBeforeDue = totalDays;
      return {
        primary: { label: "Estimated Conception", value: formatNumber(conceptionDaysBeforeDue) + " days before " + (method === "due" ? "due date" : "birth date") },
        details: [
          { label: "Last Menstrual Period", value: formatNumber(lmpDaysBeforeDue) + " days before " + (method === "due" ? "due date" : "birth date") },
          { label: "Fertile Window Start", value: formatNumber(fertileWindowStart) + " days before " + (method === "due" ? "due date" : "birth date") },
          { label: "Ovulation Day of Cycle", value: "Day " + formatNumber(ovulationDay) },
        ],
      };
    }`,
  [{ q: 'How accurate is a reverse due date calculation?', a: 'Reverse due date calculations provide an estimate within a range of about 5 days. Actual conception depends on individual ovulation timing and cycle regularity.' },
   { q: 'Does cycle length affect the estimated conception date?', a: 'Yes. Longer cycles mean later ovulation, so the estimated conception date shifts accordingly. The standard 28-day cycle assumes ovulation on day 14.' }],
  'Conception Date = Due Date - (Gestation Weeks x 7) + (Cycle Length - 14)',
  ['implantation-date-calculator', 'fertility-by-age-calculator']
);

// #55 Fetal Weight Percentile Calculator
add('fetal-weight-percentile-calculator', 'Fetal Weight Percentile Calculator',
  'Determine the estimated fetal weight percentile based on ultrasound measurements and gestational age.',
  'Health', 'health', 'H',
  ['fetal weight percentile', 'fetal growth chart', 'baby weight in utero'],
  [
    '{ name: "gestationalWeeks", label: "Gestational Age", type: "number", suffix: "weeks", min: 20, max: 42, defaultValue: 30 }',
    '{ name: "estimatedWeight", label: "Estimated Fetal Weight", type: "number", suffix: "grams", min: 100, max: 6000, defaultValue: 1500 }',
    '{ name: "gender", label: "Fetal Sex", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"},{value:"unknown",label:"Unknown"}], defaultValue: "unknown" }',
  ],
  `(inputs) => {
      const weeks = inputs.gestationalWeeks as number;
      const weight = inputs.estimatedWeight as number;
      const gender = inputs.gender as string;
      if (!weeks || !weight || weight <= 0) return null;
      const medianWeights: Record<number, number> = {20:310,22:430,24:600,26:760,28:1000,30:1320,32:1700,34:2150,36:2620,38:3080,40:3460,42:3600};
      const keys = Object.keys(medianWeights).map(Number).sort((a,b)=>a-b);
      let median = medianWeights[30];
      for (let i = 0; i < keys.length - 1; i++) {
        if (weeks >= keys[i] && weeks <= keys[i+1]) {
          const t = (weeks - keys[i]) / (keys[i+1] - keys[i]);
          median = medianWeights[keys[i]] * (1 - t) + medianWeights[keys[i+1]] * t;
          break;
        }
      }
      if (gender === "male") median *= 1.03;
      if (gender === "female") median *= 0.97;
      const sd = median * 0.15;
      const zScore = (weight - median) / sd;
      const percentile = Math.min(99, Math.max(1, Math.round(50 * (1 + zScore / 3) * 2) / 2));
      const classification = percentile < 10 ? "Small for gestational age" : percentile > 90 ? "Large for gestational age" : "Appropriate for gestational age";
      return {
        primary: { label: "Estimated Percentile", value: formatNumber(Math.round(percentile)) + "th percentile" },
        details: [
          { label: "Median Weight at " + weeks + " Weeks", value: formatNumber(Math.round(median)) + " grams" },
          { label: "Entered Weight", value: formatNumber(weight) + " grams" },
          { label: "Classification", value: classification },
        ],
      };
    }`,
  [{ q: 'What fetal weight percentile is considered normal?', a: 'Fetal weights between the 10th and 90th percentile are generally considered appropriate for gestational age. Weights below the 10th percentile may indicate growth restriction.' },
   { q: 'How accurate are ultrasound weight estimates?', a: 'Ultrasound estimates of fetal weight have a margin of error of about 10 to 15 percent. The accuracy can vary based on fetal position and gestational age.' }],
  'Percentile = Z-Score based on (Estimated Weight - Median Weight) / Standard Deviation',
  ['birth-weight-percentile-calculator', 'child-height-prediction-calculator']
);

// #56 Birth Weight Percentile Calculator
add('birth-weight-percentile-calculator', 'Birth Weight Percentile Calculator',
  'Determine the birth weight percentile of a newborn based on weight, gestational age, and sex.',
  'Health', 'health', 'H',
  ['birth weight percentile', 'newborn weight chart', 'baby weight percentile'],
  [
    '{ name: "birthWeight", label: "Birth Weight", type: "number", suffix: "grams", min: 500, max: 6000, defaultValue: 3400 }',
    '{ name: "gestationalAge", label: "Gestational Age at Birth", type: "number", suffix: "weeks", min: 34, max: 42, defaultValue: 39 }',
    '{ name: "sex", label: "Sex", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" }',
  ],
  `(inputs) => {
      const weight = inputs.birthWeight as number;
      const ga = inputs.gestationalAge as number;
      const sex = inputs.sex as string;
      if (!weight || !ga || weight <= 0) return null;
      const baseMean: Record<number, number> = {34:2200,35:2400,36:2620,37:2860,38:3080,39:3290,40:3460,41:3540,42:3600};
      const keys = Object.keys(baseMean).map(Number).sort((a,b)=>a-b);
      let mean = baseMean[39];
      for (let i = 0; i < keys.length - 1; i++) {
        if (ga >= keys[i] && ga <= keys[i+1]) {
          const t = (ga - keys[i]) / (keys[i+1] - keys[i]);
          mean = baseMean[keys[i]] * (1 - t) + baseMean[keys[i+1]] * t;
          break;
        }
      }
      if (sex === "male") mean *= 1.03;
      else mean *= 0.97;
      const sd = mean * 0.13;
      const zScore = (weight - mean) / sd;
      const percentile = Math.min(99, Math.max(1, Math.round(50 + zScore * 16)));
      const category = percentile < 10 ? "Low birth weight" : percentile > 90 ? "High birth weight" : "Normal birth weight";
      return {
        primary: { label: "Birth Weight Percentile", value: formatNumber(percentile) + "th percentile" },
        details: [
          { label: "Expected Mean Weight", value: formatNumber(Math.round(mean)) + " grams" },
          { label: "Category", value: category },
          { label: "Weight in Pounds", value: formatNumber(Math.round(weight / 453.592 * 10) / 10) + " lbs" },
        ],
      };
    }`,
  [{ q: 'What is a normal birth weight range?', a: 'A normal full-term birth weight is generally between 2,500 and 4,000 grams (5.5 to 8.8 pounds). Babies below 2,500 grams are considered low birth weight.' },
   { q: 'Does birth weight differ between males and females?', a: 'Yes, male newborns tend to weigh slightly more than female newborns on average, typically by about 100 to 150 grams at the same gestational age.' }],
  'Percentile = Normal Distribution of (Birth Weight - Mean for GA and Sex) / Standard Deviation',
  ['fetal-weight-percentile-calculator', 'pediatric-bmi-percentile-calculator']
);

// #57 Baby Formula Amount Calculator
add('baby-formula-amount-calculator', 'Baby Formula Amount Calculator',
  'Calculate the recommended daily formula amount for an infant based on age and weight.',
  'Health', 'health', 'H',
  ['baby formula amount', 'how much formula', 'infant formula calculator'],
  [
    '{ name: "ageMonths", label: "Baby Age", type: "number", suffix: "months", min: 0, max: 12, defaultValue: 3 }',
    '{ name: "weightLbs", label: "Baby Weight", type: "number", suffix: "lbs", min: 4, max: 30, step: 0.5, defaultValue: 12 }',
    '{ name: "feedingsPerDay", label: "Feedings Per Day", type: "number", min: 4, max: 12, defaultValue: 6 }',
  ],
  `(inputs) => {
      const age = inputs.ageMonths as number;
      const weight = inputs.weightLbs as number;
      const feedings = inputs.feedingsPerDay as number;
      if (!weight || weight <= 0 || !feedings || feedings <= 0) return null;
      const ozPerLb = age <= 1 ? 2.5 : age <= 3 ? 2.5 : age <= 6 ? 2.5 : 2.0;
      const totalOz = Math.min(32, weight * ozPerLb);
      const perFeeding = totalOz / feedings;
      const scoopsPerDay = Math.ceil(totalOz / 2);
      return {
        primary: { label: "Daily Formula Amount", value: formatNumber(Math.round(totalOz * 10) / 10) + " oz" },
        details: [
          { label: "Per Feeding", value: formatNumber(Math.round(perFeeding * 10) / 10) + " oz" },
          { label: "Number of Feedings", value: formatNumber(feedings) + " per day" },
          { label: "Approx. Scoops Per Day", value: formatNumber(scoopsPerDay) + " scoops" },
        ],
      };
    }`,
  [{ q: 'How much formula does a newborn need per day?', a: 'Newborns typically need about 2 to 2.5 ounces of formula per pound of body weight per day, up to about 32 ounces. A 7-pound newborn would need roughly 17 to 18 ounces daily.' },
   { q: 'When should formula amounts be adjusted?', a: 'Formula amounts should be adjusted as the baby grows. Pediatricians recommend following hunger cues rather than strict schedules, and increasing amounts gradually as the baby gains weight.' }],
  'Daily Formula (oz) = Baby Weight (lbs) x 2.5 oz/lb (max 32 oz); Per Feeding = Daily Total / Number of Feedings',
  ['baby-milk-intake-calculator', 'birth-weight-percentile-calculator']
);

// #58 Baby Milk Intake Calculator
add('baby-milk-intake-calculator', 'Baby Milk Intake Calculator',
  'Estimate the daily breast milk or formula intake needs for an infant based on age and weight.',
  'Health', 'health', 'H',
  ['baby milk intake', 'infant milk needs', 'breastmilk amount calculator'],
  [
    '{ name: "ageMonths", label: "Baby Age", type: "number", suffix: "months", min: 0, max: 12, defaultValue: 4 }',
    '{ name: "weightKg", label: "Baby Weight", type: "number", suffix: "kg", min: 2, max: 15, step: 0.1, defaultValue: 6 }',
    '{ name: "feedType", label: "Feed Type", type: "select", options: [{value:"breast",label:"Breast Milk"},{value:"formula",label:"Formula"},{value:"mixed",label:"Mixed Feeding"}], defaultValue: "breast" }',
  ],
  `(inputs) => {
      const age = inputs.ageMonths as number;
      const weight = inputs.weightKg as number;
      const feedType = inputs.feedType as string;
      if (!weight || weight <= 0) return null;
      const mlPerKg = age <= 1 ? 150 : age <= 3 ? 150 : age <= 6 ? 120 : 100;
      const dailyMl = weight * mlPerKg;
      const dailyOz = dailyMl / 29.5735;
      const feedsPerDay = age <= 1 ? 10 : age <= 3 ? 8 : age <= 6 ? 6 : 5;
      const perFeedMl = dailyMl / feedsPerDay;
      const perFeedOz = dailyOz / feedsPerDay;
      return {
        primary: { label: "Daily Milk Intake", value: formatNumber(Math.round(dailyMl)) + " mL (" + formatNumber(Math.round(dailyOz)) + " oz)" },
        details: [
          { label: "Per Feeding", value: formatNumber(Math.round(perFeedMl)) + " mL (" + formatNumber(Math.round(perFeedOz * 10) / 10) + " oz)" },
          { label: "Suggested Feedings Per Day", value: formatNumber(feedsPerDay) },
          { label: "Feed Type", value: feedType === "breast" ? "Breast Milk" : feedType === "formula" ? "Formula" : "Mixed" },
        ],
      };
    }`,
  [{ q: 'How much milk does a breastfed baby need per day?', a: 'Breastfed babies typically consume about 750 to 900 mL (25 to 30 oz) of milk per day between 1 and 6 months of age. Intake is relatively stable during this period.' },
   { q: 'Is there a difference in intake between breast milk and formula?', a: 'Formula-fed babies may consume slightly more volume because formula is digested more slowly than breast milk. Breast milk intake tends to remain more consistent over time.' }],
  'Daily Intake (mL) = Baby Weight (kg) x mL per kg (based on age); Per Feeding = Daily Total / Feedings Per Day',
  ['baby-formula-amount-calculator', 'exclusive-pumping-calculator']
);

// #59 Exclusive Pumping Calculator
add('exclusive-pumping-calculator', 'Exclusive Pumping Calculator',
  'Plan an exclusive pumping schedule with estimated daily output, session frequency, and storage needs.',
  'Health', 'health', 'H',
  ['exclusive pumping', 'pumping schedule calculator', 'breast pump output'],
  [
    '{ name: "sessionsPerDay", label: "Pumping Sessions Per Day", type: "number", min: 4, max: 12, defaultValue: 8 }',
    '{ name: "ozPerSession", label: "Average Output Per Session", type: "number", suffix: "oz", min: 0.5, max: 10, step: 0.5, defaultValue: 3.5 }',
    '{ name: "babyAgeMo", label: "Baby Age", type: "number", suffix: "months", min: 0, max: 12, defaultValue: 2 }',
    '{ name: "babyWeightLbs", label: "Baby Weight", type: "number", suffix: "lbs", min: 4, max: 25, step: 0.5, defaultValue: 10 }',
  ],
  `(inputs) => {
      const sessions = inputs.sessionsPerDay as number;
      const ozPer = inputs.ozPerSession as number;
      const ageMo = inputs.babyAgeMo as number;
      const weightLbs = inputs.babyWeightLbs as number;
      if (!sessions || !ozPer || !weightLbs || weightLbs <= 0) return null;
      const dailyOutput = sessions * ozPer;
      const dailyNeed = Math.min(32, weightLbs * 2.5);
      const surplus = dailyOutput - dailyNeed;
      const minutesBetween = Math.round((24 * 60) / sessions);
      return {
        primary: { label: "Daily Pumping Output", value: formatNumber(Math.round(dailyOutput * 10) / 10) + " oz" },
        details: [
          { label: "Baby Daily Need", value: formatNumber(Math.round(dailyNeed * 10) / 10) + " oz" },
          { label: "Surplus or Deficit", value: (surplus >= 0 ? "+" : "") + formatNumber(Math.round(surplus * 10) / 10) + " oz" },
          { label: "Minutes Between Sessions", value: formatNumber(minutesBetween) + " min" },
        ],
      };
    }`,
  [{ q: 'How many pumping sessions per day are recommended?', a: 'Most exclusive pumping guidelines recommend 8 to 12 sessions per day in the early weeks, gradually reducing to 6 to 8 sessions after milk supply is established around 12 weeks.' },
   { q: 'What is a normal pumping output per session?', a: 'A typical output is 2 to 4 ounces per session once supply is established. Output varies throughout the day and tends to be higher in the morning.' }],
  'Daily Output = Sessions Per Day x Average Output Per Session; Baby Need = Weight (lbs) x 2.5 oz/lb',
  ['baby-milk-intake-calculator', 'baby-formula-amount-calculator']
);

// #60 VBAC Success Rate Calculator
add('vbac-success-rate-calculator', 'VBAC Success Rate Calculator',
  'Estimate the probability of a successful vaginal birth after cesarean (VBAC) based on clinical factors.',
  'Health', 'health', 'H',
  ['vbac success rate', 'vbac calculator', 'vaginal birth after cesarean'],
  [
    '{ name: "age", label: "Maternal Age", type: "number", suffix: "years", min: 18, max: 50, defaultValue: 30 }',
    '{ name: "previousVaginal", label: "Previous Vaginal Births", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"1"},{value:"2",label:"2 or more"}], defaultValue: "0" }',
    '{ name: "reasonForCS", label: "Reason for Prior Cesarean", type: "select", options: [{value:"nonrecurring",label:"Non-recurring (breech, fetal distress)"},{value:"failure",label:"Failure to progress"},{value:"elective",label:"Elective or scheduled"}], defaultValue: "nonrecurring" }',
    '{ name: "bmi", label: "Current BMI", type: "number", min: 15, max: 60, step: 0.5, defaultValue: 26 }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const prevVag = inputs.previousVaginal as string;
      const reason = inputs.reasonForCS as string;
      const bmi = inputs.bmi as number;
      if (!age || !bmi) return null;
      let score = 60;
      if (prevVag === "1") score += 15;
      else if (prevVag === "2") score += 20;
      if (reason === "nonrecurring") score += 10;
      else if (reason === "elective") score += 5;
      else score -= 5;
      if (age > 35) score -= 5;
      if (age > 40) score -= 5;
      if (bmi > 30) score -= 5;
      if (bmi > 35) score -= 5;
      score = Math.min(95, Math.max(20, score));
      const riskCategory = score >= 70 ? "Favorable candidate" : score >= 50 ? "Moderate candidate" : "Higher risk - discuss with provider";
      return {
        primary: { label: "Estimated VBAC Success Rate", value: formatNumber(score) + "%" },
        details: [
          { label: "Risk Category", value: riskCategory },
          { label: "Prior Vaginal Deliveries", value: prevVag === "0" ? "None" : prevVag },
          { label: "Maternal BMI", value: formatNumber(bmi) },
        ],
      };
    }`,
  [{ q: 'What is the average VBAC success rate?', a: 'The overall VBAC success rate is approximately 60 to 80 percent. Factors such as previous vaginal delivery, reason for prior cesarean, and maternal health significantly influence the outcome.' },
   { q: 'Who is not a candidate for VBAC?', a: 'VBAC is generally not recommended for individuals with a classical (vertical) uterine incision, prior uterine rupture, or certain placental abnormalities. A healthcare provider should evaluate each case.' }],
  'VBAC Score = Base 60 + Previous Vaginal Birth Bonus + Cesarean Reason Modifier - Age Penalty - BMI Penalty',
  ['bishop-score-calculator', 'fertility-by-age-calculator']
);

// #61 Bishop Score Calculator
add('bishop-score-calculator', 'Bishop Score Calculator',
  'Calculate the Bishop score to assess cervical readiness for labor induction based on clinical exam findings.',
  'Health', 'health', 'H',
  ['bishop score', 'cervical readiness', 'labor induction score'],
  [
    '{ name: "dilation", label: "Cervical Dilation", type: "select", options: [{value:"0",label:"Closed (0 cm)"},{value:"1",label:"1-2 cm"},{value:"2",label:"3-4 cm"},{value:"3",label:"5+ cm"}], defaultValue: "0" }',
    '{ name: "effacement", label: "Effacement", type: "select", options: [{value:"0",label:"0-30%"},{value:"1",label:"40-50%"},{value:"2",label:"60-70%"},{value:"3",label:"80%+"}], defaultValue: "0" }',
    '{ name: "station", label: "Fetal Station", type: "select", options: [{value:"0",label:"-3"},{value:"1",label:"-2"},{value:"2",label:"-1 to 0"},{value:"3",label:"+1 or +2"}], defaultValue: "0" }',
    '{ name: "consistency", label: "Cervical Consistency", type: "select", options: [{value:"0",label:"Firm"},{value:"1",label:"Medium"},{value:"2",label:"Soft"}], defaultValue: "0" }',
  ],
  `(inputs) => {
      const dilation = parseInt(inputs.dilation as string) || 0;
      const effacement = parseInt(inputs.effacement as string) || 0;
      const station = parseInt(inputs.station as string) || 0;
      const consistency = parseInt(inputs.consistency as string) || 0;
      const totalScore = dilation + effacement + station + consistency;
      const maxScore = 11;
      const favorable = totalScore >= 8;
      const assessment = totalScore >= 8 ? "Favorable - high likelihood of successful induction" : totalScore >= 5 ? "Moderately favorable - reasonable chance of successful induction" : "Unfavorable - cervical ripening may be needed";
      return {
        primary: { label: "Bishop Score", value: formatNumber(totalScore) + " / " + formatNumber(maxScore) },
        details: [
          { label: "Assessment", value: assessment },
          { label: "Dilation Score", value: formatNumber(dilation) },
          { label: "Effacement Score", value: formatNumber(effacement) },
        ],
      };
    }`,
  [{ q: 'What Bishop score is considered favorable for induction?', a: 'A Bishop score of 8 or higher is considered favorable and indicates a high probability of successful labor induction. Scores below 6 suggest that cervical ripening agents may be needed first.' },
   { q: 'What factors make up the Bishop score?', a: 'The Bishop score is based on five cervical characteristics: dilation, effacement, station, consistency, and position. Each is scored from 0 to 2 or 3, with a maximum total of 13.' }],
  'Bishop Score = Dilation Score + Effacement Score + Station Score + Consistency Score + Position Score',
  ['vbac-success-rate-calculator', 'fertility-by-age-calculator']
);

// #62 Chances of Twins Calculator
add('chances-of-twins-calculator', 'Chances of Twins Calculator',
  'Estimate the probability of conceiving twins based on maternal age, family history, and fertility treatment factors.',
  'Health', 'health', 'H',
  ['chances of twins', 'twin probability', 'having twins calculator'],
  [
    '{ name: "age", label: "Maternal Age", type: "number", suffix: "years", min: 18, max: 50, defaultValue: 32 }',
    '{ name: "familyHistory", label: "Family History of Twins", type: "select", options: [{value:"none",label:"No family history"},{value:"maternal",label:"Maternal side"},{value:"both",label:"Both sides"}], defaultValue: "none" }',
    '{ name: "fertilityTreatment", label: "Fertility Treatment", type: "select", options: [{value:"none",label:"None"},{value:"clomid",label:"Clomid or letrozole"},{value:"ivf",label:"IVF"}], defaultValue: "none" }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const family = inputs.familyHistory as string;
      const treatment = inputs.fertilityTreatment as string;
      if (!age) return null;
      let baseRate = 3.3;
      if (age >= 30 && age < 35) baseRate = 4.5;
      else if (age >= 35 && age < 40) baseRate = 5.5;
      else if (age >= 40) baseRate = 7.0;
      if (family === "maternal") baseRate *= 1.7;
      else if (family === "both") baseRate *= 2.0;
      if (treatment === "clomid") baseRate *= 2.5;
      else if (treatment === "ivf") baseRate *= 6.0;
      baseRate = Math.min(50, baseRate);
      const singletonRate = 100 - baseRate;
      return {
        primary: { label: "Estimated Twin Probability", value: formatNumber(Math.round(baseRate * 10) / 10) + "%" },
        details: [
          { label: "Singleton Probability", value: formatNumber(Math.round(singletonRate * 10) / 10) + "%" },
          { label: "Key Factor", value: treatment !== "none" ? "Fertility treatment significantly increases odds" : family !== "none" ? "Family history increases odds" : "Age is the primary factor" },
          { label: "Baseline Rate (no factors)", value: "3.3% of all births" },
        ],
      };
    }`,
  [{ q: 'What are the odds of having twins naturally?', a: 'The natural rate of twinning is approximately 3.3 percent of all births. Fraternal twins are more common than identical twins, and the rate increases with maternal age.' },
   { q: 'Does IVF increase the chance of twins?', a: 'Yes. IVF significantly increases twin probability, especially when multiple embryos are transferred. Single embryo transfer reduces but does not eliminate the chance of twins due to embryo splitting.' }],
  'Twin Probability = Base Rate (by age) x Family History Multiplier x Fertility Treatment Multiplier',
  ['fertility-by-age-calculator', 'baby-eye-color-calculator']
);

// #63 Baby Eye Color Calculator
add('baby-eye-color-calculator', 'Baby Eye Color Calculator',
  'Predict the likely eye color of a baby based on the eye colors of both parents using simplified genetic modeling.',
  'Health', 'health', 'H',
  ['baby eye color', 'eye color predictor', 'genetic eye color calculator'],
  [
    '{ name: "parent1Eye", label: "Parent 1 Eye Color", type: "select", options: [{value:"brown",label:"Brown"},{value:"blue",label:"Blue"},{value:"green",label:"Green"},{value:"hazel",label:"Hazel"}], defaultValue: "brown" }',
    '{ name: "parent2Eye", label: "Parent 2 Eye Color", type: "select", options: [{value:"brown",label:"Brown"},{value:"blue",label:"Blue"},{value:"green",label:"Green"},{value:"hazel",label:"Hazel"}], defaultValue: "blue" }',
    '{ name: "grandparentLight", label: "Grandparents with Light Eyes", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"1 grandparent"},{value:"2",label:"2 or more grandparents"}], defaultValue: "1" }',
  ],
  `(inputs) => {
      const p1 = inputs.parent1Eye as string;
      const p2 = inputs.parent2Eye as string;
      const gp = parseInt(inputs.grandparentLight as string) || 0;
      const probs: Record<string, Record<string, number[]>> = {
        "brown-brown": { brown: [75], green: [12], hazel: [6], blue: [6] },
        "brown-blue": { brown: [50], green: [6], hazel: [6], blue: [37] },
        "brown-green": { brown: [50], green: [25], hazel: [12], blue: [12] },
        "brown-hazel": { brown: [50], green: [12], hazel: [25], blue: [12] },
        "blue-blue": { brown: [1], green: [1], hazel: [0], blue: [98] },
        "blue-green": { brown: [0], green: [50], hazel: [0], blue: [50] },
        "blue-hazel": { brown: [12], green: [12], hazel: [25], blue: [50] },
        "green-green": { brown: [1], green: [75], hazel: [24], blue: [0] },
        "green-hazel": { brown: [12], green: [37], hazel: [37], blue: [13] },
        "hazel-hazel": { brown: [25], green: [25], hazel: [37], blue: [12] },
      };
      const key1 = p1 + "-" + p2;
      const key2 = p2 + "-" + p1;
      const data = probs[key1] || probs[key2] || probs["brown-brown"];
      let brown = (data.brown?.[0] || 0);
      let green = (data.green?.[0] || 0);
      let hazel = (data.hazel?.[0] || 0);
      let blue = (data.blue?.[0] || 0);
      if (gp >= 1) { blue += 3; brown -= 2; green += 1; hazel -= 2; }
      if (gp >= 2) { blue += 3; brown -= 3; }
      brown = Math.max(0, brown); green = Math.max(0, green); hazel = Math.max(0, hazel); blue = Math.max(0, blue);
      const total = brown + green + hazel + blue;
      const bP = Math.round(brown / total * 100);
      const gP = Math.round(green / total * 100);
      const hP = Math.round(hazel / total * 100);
      const blP = 100 - bP - gP - hP;
      const most = Math.max(bP, gP, hP, blP);
      const likely = most === bP ? "Brown" : most === gP ? "Green" : most === hP ? "Hazel" : "Blue";
      return {
        primary: { label: "Most Likely Eye Color", value: likely + " (" + formatNumber(most) + "%)" },
        details: [
          { label: "Brown", value: formatNumber(bP) + "%" },
          { label: "Blue", value: formatNumber(blP) + "%" },
          { label: "Green / Hazel", value: formatNumber(gP) + "% / " + formatNumber(hP) + "%" },
        ],
      };
    }`,
  [{ q: 'Can two brown-eyed parents have a blue-eyed baby?', a: 'Yes. If both parents carry a recessive gene for blue eyes, there is approximately a 25 percent chance of having a blue-eyed child. This is more likely when grandparents have light eyes.' },
   { q: 'When does a baby eye color become permanent?', a: 'Most babies are born with lighter eyes that may darken over time. Eye color typically stabilizes between 6 and 12 months of age, though subtle changes can occur up to age 3.' }],
  'Probability based on simplified Mendelian genetics combining dominant (brown) and recessive (blue, green) alleles with family history modifier',
  ['child-height-prediction-calculator', 'chances-of-twins-calculator']
);

// #64 Child Height Prediction Calculator
add('child-height-prediction-calculator', 'Child Height Prediction Calculator',
  'Predict a child predicted adult height based on parental heights and the mid-parental height method.',
  'Health', 'health', 'H',
  ['child height prediction', 'adult height predictor', 'how tall will my child be'],
  [
    '{ name: "fatherHeight", label: "Father Height", type: "number", suffix: "inches", min: 55, max: 85, step: 0.5, defaultValue: 70 }',
    '{ name: "motherHeight", label: "Mother Height", type: "number", suffix: "inches", min: 50, max: 80, step: 0.5, defaultValue: 65 }',
    '{ name: "childSex", label: "Child Sex", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" }',
  ],
  `(inputs) => {
      const dad = inputs.fatherHeight as number;
      const mom = inputs.motherHeight as number;
      const sex = inputs.childSex as string;
      if (!dad || !mom || dad <= 0 || mom <= 0) return null;
      let predicted;
      if (sex === "male") {
        predicted = (dad + mom + 5) / 2;
      } else {
        predicted = (dad + mom - 5) / 2;
      }
      const rangeLow = predicted - 2;
      const rangeHigh = predicted + 2;
      const ft = Math.floor(predicted / 12);
      const inches = Math.round((predicted - ft * 12) * 10) / 10;
      const cm = Math.round(predicted * 2.54 * 10) / 10;
      return {
        primary: { label: "Predicted Adult Height", value: ft + " ft " + formatNumber(inches) + " in (" + formatNumber(cm) + " cm)" },
        details: [
          { label: "Range", value: formatNumber(Math.round(rangeLow * 10) / 10) + " - " + formatNumber(Math.round(rangeHigh * 10) / 10) + " inches" },
          { label: "Mid-Parental Average", value: formatNumber(Math.round((dad + mom) / 2 * 10) / 10) + " inches" },
          { label: "Method", value: "Mid-Parental Height (Galton)" },
        ],
      };
    }`,
  [{ q: 'How accurate is the mid-parental height method?', a: 'The mid-parental height method is accurate within about 2 inches for most children. However, nutrition, health conditions, and other genetic factors can cause actual height to differ from the prediction.' },
   { q: 'Do boys and girls use different formulas?', a: 'Yes. For boys, 5 inches are added to the average of the parental heights. For girls, 5 inches are subtracted. This accounts for the average height difference between males and females.' }],
  'Boys = (Father Height + Mother Height + 5) / 2; Girls = (Father Height + Mother Height - 5) / 2',
  ['pediatric-bmi-percentile-calculator', 'fetal-weight-percentile-calculator']
);

// #65 Pediatric BMI Percentile Calculator
add('pediatric-bmi-percentile-calculator', 'Pediatric BMI Percentile Calculator',
  'Calculate a child BMI percentile based on age, sex, height, and weight using CDC growth chart references.',
  'Health', 'health', 'H',
  ['pediatric bmi', 'child bmi percentile', 'kids bmi calculator'],
  [
    '{ name: "ageYears", label: "Child Age", type: "number", suffix: "years", min: 2, max: 19, step: 0.5, defaultValue: 8 }',
    '{ name: "weightLbs", label: "Weight", type: "number", suffix: "lbs", min: 15, max: 300, step: 0.5, defaultValue: 56 }',
    '{ name: "heightIn", label: "Height", type: "number", suffix: "inches", min: 24, max: 80, step: 0.5, defaultValue: 50 }',
    '{ name: "sex", label: "Sex", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" }',
  ],
  `(inputs) => {
      const age = inputs.ageYears as number;
      const weightLbs = inputs.weightLbs as number;
      const heightIn = inputs.heightIn as number;
      const sex = inputs.sex as string;
      if (!age || !weightLbs || !heightIn || weightLbs <= 0 || heightIn <= 0) return null;
      const bmi = (weightLbs / (heightIn * heightIn)) * 703;
      const medianBmi: Record<string, Record<number, number>> = {
        male: {2:16.5,4:15.5,6:15.4,8:15.8,10:16.6,12:18.0,14:19.8,16:21.0,18:22.0},
        female: {2:16.0,4:15.2,6:15.2,8:15.8,10:16.8,12:18.4,14:19.6,16:20.5,18:21.2},
      };
      const genderData = medianBmi[sex] || medianBmi["male"];
      const keys = Object.keys(genderData).map(Number).sort((a,b)=>a-b);
      let median = genderData[8];
      for (let i = 0; i < keys.length - 1; i++) {
        if (age >= keys[i] && age <= keys[i+1]) {
          const t = (age - keys[i]) / (keys[i+1] - keys[i]);
          median = genderData[keys[i]] * (1 - t) + genderData[keys[i+1]] * t;
          break;
        }
      }
      const sd = median * 0.12;
      const zScore = (bmi - median) / sd;
      const percentile = Math.min(99, Math.max(1, Math.round(50 + zScore * 16)));
      const category = percentile < 5 ? "Underweight" : percentile < 85 ? "Healthy weight" : percentile < 95 ? "Overweight" : "Obese";
      return {
        primary: { label: "BMI Percentile", value: formatNumber(percentile) + "th percentile" },
        details: [
          { label: "BMI", value: formatNumber(Math.round(bmi * 10) / 10) },
          { label: "Weight Category", value: category },
          { label: "Median BMI for Age and Sex", value: formatNumber(Math.round(median * 10) / 10) },
        ],
      };
    }`,
  [{ q: 'Why is BMI percentile used for children instead of standard BMI?', a: 'Children BMI changes as they grow, so a single BMI number does not have the same meaning at every age. Percentiles compare a child BMI to others of the same age and sex, providing a more accurate assessment.' },
   { q: 'What BMI percentile is considered healthy for children?', a: 'A BMI between the 5th and 85th percentile is considered healthy weight for children. Below the 5th percentile is underweight, between 85th and 95th is overweight, and above the 95th is obese.' }],
  'BMI = (Weight in lbs / Height in inches squared) x 703; Percentile from CDC age-sex reference charts',
  ['child-height-prediction-calculator', 'birth-weight-percentile-calculator']
);

// #66 SIP Step-Up Calculator
add('sip-step-up-calculator', 'SIP Step-Up Calculator',
  'Calculate the future value of a Systematic Investment Plan with annual step-up increases in monthly contribution.',
  'Finance', 'finance', '$',
  ['sip step up', 'sip top up calculator', 'increasing sip returns'],
  [
    '{ name: "monthlySIP", label: "Starting Monthly SIP", type: "number", prefix: "Rs.", min: 500, max: 1000000, step: 500, defaultValue: 10000 }',
    '{ name: "annualStepUp", label: "Annual Step-Up Rate", type: "number", suffix: "%", min: 0, max: 50, step: 1, defaultValue: 10 }',
    '{ name: "years", label: "Investment Period", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 15 }',
    '{ name: "expectedReturn", label: "Expected Annual Return", type: "number", suffix: "%", min: 1, max: 30, step: 0.5, defaultValue: 12 }',
  ],
  `(inputs) => {
      const monthly = inputs.monthlySIP as number;
      const stepUp = inputs.annualStepUp as number;
      const years = inputs.years as number;
      const annualReturn = inputs.expectedReturn as number;
      if (!monthly || !years || !annualReturn || monthly <= 0) return null;
      const monthlyRate = annualReturn / 100 / 12;
      let totalInvested = 0;
      let futureValue = 0;
      let currentSIP = monthly;
      for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
          totalInvested += currentSIP;
          futureValue = (futureValue + currentSIP) * (1 + monthlyRate);
        }
        currentSIP = currentSIP * (1 + stepUp / 100);
      }
      const totalGains = futureValue - totalInvested;
      return {
        primary: { label: "Future Value", value: "Rs. " + formatNumber(Math.round(futureValue)) },
        details: [
          { label: "Total Invested", value: "Rs. " + formatNumber(Math.round(totalInvested)) },
          { label: "Total Gains", value: "Rs. " + formatNumber(Math.round(totalGains)) },
          { label: "Final Monthly SIP", value: "Rs. " + formatNumber(Math.round(currentSIP / (1 + stepUp / 100))) },
        ],
      };
    }`,
  [{ q: 'What is a SIP step-up?', a: 'A SIP step-up means increasing the monthly investment amount by a fixed percentage every year. For example, a 10 percent step-up on a Rs. 10,000 SIP would increase it to Rs. 11,000 in the second year.' },
   { q: 'How much difference does a step-up make over time?', a: 'A step-up can significantly boost long-term wealth. A Rs. 10,000 SIP with a 10 percent annual step-up over 20 years at 12 percent returns can accumulate nearly double compared to a flat SIP.' }],
  'Future Value = Sum of each monthly SIP compounded at monthly rate, with SIP amount increasing annually by step-up percentage',
  ['lump-sum-investment-calculator', 'mutual-fund-returns-calculator-india']
);

// #67 Lump Sum Investment Calculator
add('lump-sum-investment-calculator', 'Lump Sum Investment Calculator',
  'Calculate the future value of a one-time lump sum investment over a specified period with compounding.',
  'Finance', 'finance', '$',
  ['lump sum investment', 'one time investment returns', 'lump sum calculator'],
  [
    '{ name: "principal", label: "Investment Amount", type: "number", prefix: "Rs.", min: 1000, max: 100000000, step: 1000, defaultValue: 500000 }',
    '{ name: "years", label: "Investment Period", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 10 }',
    '{ name: "expectedReturn", label: "Expected Annual Return", type: "number", suffix: "%", min: 1, max: 30, step: 0.5, defaultValue: 12 }',
    '{ name: "compounding", label: "Compounding Frequency", type: "select", options: [{value:"1",label:"Annually"},{value:"4",label:"Quarterly"},{value:"12",label:"Monthly"}], defaultValue: "1" }',
  ],
  `(inputs) => {
      const principal = inputs.principal as number;
      const years = inputs.years as number;
      const rate = inputs.expectedReturn as number;
      const freq = parseInt(inputs.compounding as string) || 1;
      if (!principal || !years || !rate || principal <= 0) return null;
      const futureValue = principal * Math.pow(1 + rate / 100 / freq, freq * years);
      const totalGains = futureValue - principal;
      const multiplier = futureValue / principal;
      return {
        primary: { label: "Future Value", value: "Rs. " + formatNumber(Math.round(futureValue)) },
        details: [
          { label: "Total Gains", value: "Rs. " + formatNumber(Math.round(totalGains)) },
          { label: "Investment Multiplier", value: formatNumber(Math.round(multiplier * 100) / 100) + "x" },
          { label: "Effective Annual Rate", value: formatNumber(Math.round((Math.pow(1 + rate / 100 / freq, freq) - 1) * 10000) / 100) + "%" },
        ],
      };
    }`,
  [{ q: 'Is lump sum better than SIP?', a: 'Lump sum investing can outperform SIP in a consistently rising market because the entire amount benefits from compounding from day one. However, SIP reduces timing risk through rupee cost averaging.' },
   { q: 'How does compounding frequency affect returns?', a: 'More frequent compounding produces slightly higher returns. Monthly compounding yields more than annual compounding for the same nominal rate, though the difference is modest for typical return rates.' }],
  'Future Value = Principal x (1 + Rate / Frequency) ^ (Frequency x Years)',
  ['sip-step-up-calculator', 'mutual-fund-returns-calculator-india']
);

// #68 Mutual Fund Returns Calculator India
add('mutual-fund-returns-calculator-india', 'Mutual Fund Returns Calculator India',
  'Calculate mutual fund returns in India accounting for expense ratio and exit load on investment performance.',
  'Finance', 'finance', '$',
  ['mutual fund returns india', 'mf calculator india', 'mutual fund expense ratio impact'],
  [
    '{ name: "investment", label: "Investment Amount", type: "number", prefix: "Rs.", min: 1000, max: 50000000, step: 1000, defaultValue: 100000 }',
    '{ name: "years", label: "Holding Period", type: "number", suffix: "years", min: 1, max: 30, defaultValue: 5 }',
    '{ name: "grossReturn", label: "Gross Annual Return", type: "number", suffix: "%", min: 1, max: 30, step: 0.5, defaultValue: 14 }',
    '{ name: "expenseRatio", label: "Expense Ratio", type: "number", suffix: "%", min: 0, max: 3, step: 0.05, defaultValue: 1.5 }',
  ],
  `(inputs) => {
      const invest = inputs.investment as number;
      const years = inputs.years as number;
      const gross = inputs.grossReturn as number;
      const expense = inputs.expenseRatio as number;
      if (!invest || !years || !gross || invest <= 0) return null;
      const netReturn = gross - expense;
      const grossValue = invest * Math.pow(1 + gross / 100, years);
      const netValue = invest * Math.pow(1 + netReturn / 100, years);
      const costOfExpenses = grossValue - netValue;
      const netGains = netValue - invest;
      return {
        primary: { label: "Net Future Value", value: "Rs. " + formatNumber(Math.round(netValue)) },
        details: [
          { label: "Gross Value (before expenses)", value: "Rs. " + formatNumber(Math.round(grossValue)) },
          { label: "Cost of Expense Ratio", value: "Rs. " + formatNumber(Math.round(costOfExpenses)) },
          { label: "Net Annual Return", value: formatNumber(Math.round(netReturn * 100) / 100) + "%" },
        ],
      };
    }`,
  [{ q: 'What is a good expense ratio for mutual funds in India?', a: 'For actively managed equity funds, an expense ratio below 1.5 percent is considered reasonable. Index funds and ETFs typically have expense ratios below 0.5 percent, making them cost-effective options.' },
   { q: 'How does the expense ratio affect long-term returns?', a: 'Even a small difference in expense ratio can significantly impact long-term returns due to compounding. A 1 percent higher expense ratio on a Rs. 10 lakh investment over 20 years can cost several lakhs in lost returns.' }],
  'Net Return = Gross Return - Expense Ratio; Net Value = Investment x (1 + Net Return) ^ Years',
  ['sip-step-up-calculator', 'elss-tax-saving-calculator']
);

// #69 Gold Investment Calculator India
add('gold-investment-calculator-india', 'Gold Investment Calculator India',
  'Calculate the future value of gold investments in India based on current gold price, quantity, and expected appreciation.',
  'Finance', 'finance', '$',
  ['gold investment india', 'gold returns calculator', 'sovereign gold bond calculator'],
  [
    '{ name: "investmentAmount", label: "Investment Amount", type: "number", prefix: "Rs.", min: 1000, max: 50000000, step: 1000, defaultValue: 200000 }',
    '{ name: "goldPrice", label: "Current Gold Price per Gram", type: "number", prefix: "Rs.", min: 1000, max: 20000, step: 100, defaultValue: 6000 }',
    '{ name: "years", label: "Holding Period", type: "number", suffix: "years", min: 1, max: 30, defaultValue: 8 }',
    '{ name: "expectedAppreciation", label: "Expected Annual Appreciation", type: "number", suffix: "%", min: 0, max: 20, step: 0.5, defaultValue: 8 }',
  ],
  `(inputs) => {
      const amount = inputs.investmentAmount as number;
      const price = inputs.goldPrice as number;
      const years = inputs.years as number;
      const appreciation = inputs.expectedAppreciation as number;
      if (!amount || !price || !years || amount <= 0 || price <= 0) return null;
      const gramsOwned = amount / price;
      const futurePrice = price * Math.pow(1 + appreciation / 100, years);
      const futureValue = gramsOwned * futurePrice;
      const totalGains = futureValue - amount;
      return {
        primary: { label: "Future Value", value: "Rs. " + formatNumber(Math.round(futureValue)) },
        details: [
          { label: "Gold Quantity", value: formatNumber(Math.round(gramsOwned * 100) / 100) + " grams" },
          { label: "Future Gold Price", value: "Rs. " + formatNumber(Math.round(futurePrice)) + " per gram" },
          { label: "Total Gains", value: "Rs. " + formatNumber(Math.round(totalGains)) },
        ],
      };
    }`,
  [{ q: 'What is the average annual return of gold in India?', a: 'Gold in India has historically delivered average annual returns of about 8 to 10 percent over the long term when measured in Indian Rupees, though returns can vary significantly from year to year.' },
   { q: 'What are the different ways to invest in gold in India?', a: 'Investors in India can purchase physical gold, Sovereign Gold Bonds (SGBs), Gold ETFs, or digital gold. SGBs offer an additional 2.5 percent annual interest and tax-free capital gains if held to maturity.' }],
  'Future Value = (Investment / Current Price) x Current Price x (1 + Appreciation Rate) ^ Years',
  ['lump-sum-investment-calculator', 'sip-step-up-calculator']
);

// #70 ELSS Tax Saving Calculator
add('elss-tax-saving-calculator', 'ELSS Tax Saving Calculator',
  'Calculate tax savings and projected returns from investing in ELSS mutual funds under Section 80C of the Indian Income Tax Act.',
  'Finance', 'finance', '$',
  ['elss calculator', 'elss tax saving', 'tax saving mutual fund calculator'],
  [
    '{ name: "annualInvestment", label: "Annual ELSS Investment", type: "number", prefix: "Rs.", min: 500, max: 150000, step: 500, defaultValue: 150000 }',
    '{ name: "taxBracket", label: "Tax Bracket", type: "select", options: [{value:"5",label:"5% (up to 5 lakh)"},{value:"20",label:"20% (5-10 lakh)"},{value:"30",label:"30% (above 10 lakh)"}], defaultValue: "30" }',
    '{ name: "years", label: "Investment Period", type: "number", suffix: "years", min: 3, max: 30, defaultValue: 10 }',
    '{ name: "expectedReturn", label: "Expected Annual Return", type: "number", suffix: "%", min: 1, max: 25, step: 0.5, defaultValue: 14 }',
  ],
  `(inputs) => {
      const annual = inputs.annualInvestment as number;
      const taxRate = parseFloat(inputs.taxBracket as string) || 30;
      const years = inputs.years as number;
      const ret = inputs.expectedReturn as number;
      if (!annual || !years || !ret || annual <= 0) return null;
      const taxSavedPerYear = Math.min(annual, 150000) * (taxRate / 100);
      const totalTaxSaved = taxSavedPerYear * years;
      const monthlyRate = ret / 100 / 12;
      const monthlySIP = annual / 12;
      let futureValue = 0;
      for (let m = 0; m < years * 12; m++) {
        futureValue = (futureValue + monthlySIP) * (1 + monthlyRate);
      }
      const totalInvested = annual * years;
      const gains = futureValue - totalInvested;
      return {
        primary: { label: "Total Future Value", value: "Rs. " + formatNumber(Math.round(futureValue)) },
        details: [
          { label: "Tax Saved Per Year", value: "Rs. " + formatNumber(Math.round(taxSavedPerYear)) },
          { label: "Total Tax Saved Over Period", value: "Rs. " + formatNumber(Math.round(totalTaxSaved)) },
          { label: "Total Investment Gains", value: "Rs. " + formatNumber(Math.round(gains)) },
        ],
      };
    }`,
  [{ q: 'What is the lock-in period for ELSS?', a: 'ELSS mutual funds have a mandatory lock-in period of 3 years, which is the shortest among all Section 80C investment options. After 3 years, units can be redeemed or held for additional growth.' },
   { q: 'How much tax can be saved with ELSS?', a: 'Under Section 80C, investments up to Rs. 1.5 lakh per year qualify for a deduction. At the 30 percent tax bracket, this translates to a maximum annual tax saving of Rs. 46,800 including cess.' }],
  'Tax Saved = Min(Investment, 150000) x Tax Rate; Future Value = Monthly SIP compounded at expected return rate',
  ['section-80c-deduction-calculator', 'mutual-fund-returns-calculator-india']
);

// #71 Section 80C Deduction Calculator
add('section-80c-deduction-calculator', 'Section 80C Deduction Calculator',
  'Calculate total Section 80C tax deductions from various qualifying investments and expenses under Indian Income Tax Act.',
  'Finance', 'finance', '$',
  ['section 80c calculator', '80c deduction', 'tax deduction calculator india'],
  [
    '{ name: "ppf", label: "PPF / EPF Contribution", type: "number", prefix: "Rs.", min: 0, max: 150000, step: 500, defaultValue: 50000 }',
    '{ name: "elss", label: "ELSS / Tax Saving FD", type: "number", prefix: "Rs.", min: 0, max: 150000, step: 500, defaultValue: 50000 }',
    '{ name: "insurance", label: "Life Insurance Premium", type: "number", prefix: "Rs.", min: 0, max: 150000, step: 500, defaultValue: 30000 }',
    '{ name: "taxBracket", label: "Tax Bracket", type: "select", options: [{value:"5",label:"5%"},{value:"20",label:"20%"},{value:"30",label:"30%"}], defaultValue: "30" }',
  ],
  `(inputs) => {
      const ppf = inputs.ppf as number;
      const elss = inputs.elss as number;
      const insurance = inputs.insurance as number;
      const taxRate = parseFloat(inputs.taxBracket as string) || 30;
      const totalDeduction = Math.min(150000, (ppf || 0) + (elss || 0) + (insurance || 0));
      const taxSaved = totalDeduction * (taxRate / 100);
      const cessOnTax = taxSaved * 0.04;
      const totalSaving = taxSaved + cessOnTax;
      const remaining = Math.max(0, 150000 - totalDeduction);
      return {
        primary: { label: "Total Tax Saving", value: "Rs. " + formatNumber(Math.round(totalSaving)) },
        details: [
          { label: "Section 80C Deduction Claimed", value: "Rs. " + formatNumber(totalDeduction) },
          { label: "Remaining 80C Limit", value: "Rs. " + formatNumber(remaining) },
          { label: "Tax Saved (including cess)", value: "Rs. " + formatNumber(Math.round(totalSaving)) },
        ],
      };
    }`,
  [{ q: 'What is the maximum deduction under Section 80C?', a: 'The maximum deduction allowed under Section 80C of the Income Tax Act is Rs. 1,50,000 per financial year. This includes all qualifying investments and expenses combined.' },
   { q: 'What investments qualify under Section 80C?', a: 'Qualifying investments include PPF, EPF, ELSS mutual funds, NSC, 5-year tax saving FD, life insurance premiums, home loan principal repayment, SSY, and tuition fees for up to two children.' }],
  'Total Deduction = Min(150000, PPF + ELSS + Insurance + Others); Tax Saved = Deduction x Tax Rate x 1.04 (cess)',
  ['elss-tax-saving-calculator', 'dearness-allowance-calculator']
);

// #72 Dearness Allowance Calculator
add('dearness-allowance-calculator', 'Dearness Allowance Calculator',
  'Calculate Dearness Allowance for Indian central government employees based on basic pay and current DA rate.',
  'Finance', 'finance', '$',
  ['dearness allowance calculator', 'da calculator', 'government employee da'],
  [
    '{ name: "basicPay", label: "Basic Pay", type: "number", prefix: "Rs.", min: 1000, max: 500000, step: 500, defaultValue: 56100 }',
    '{ name: "daRate", label: "Current DA Rate", type: "number", suffix: "%", min: 0, max: 100, step: 1, defaultValue: 46 }',
    '{ name: "hraCity", label: "HRA City Classification", type: "select", options: [{value:"x",label:"X (Metro)"},{value:"y",label:"Y (Large City)"},{value:"z",label:"Z (Others)"}], defaultValue: "x" }',
  ],
  `(inputs) => {
      const basic = inputs.basicPay as number;
      const daRate = inputs.daRate as number;
      const city = inputs.hraCity as string;
      if (!basic || basic <= 0) return null;
      const daAmount = basic * (daRate / 100);
      const hraRates: Record<string, number> = { x: 27, y: 18, z: 9 };
      const hraRate = hraRates[city] || 27;
      const hraAmount = basic * (hraRate / 100);
      const grossWithDA = basic + daAmount + hraAmount;
      return {
        primary: { label: "Monthly Dearness Allowance", value: "Rs. " + formatNumber(Math.round(daAmount)) },
        details: [
          { label: "HRA Amount", value: "Rs. " + formatNumber(Math.round(hraAmount)) },
          { label: "Basic + DA + HRA", value: "Rs. " + formatNumber(Math.round(grossWithDA)) },
          { label: "Annual DA", value: "Rs. " + formatNumber(Math.round(daAmount * 12)) },
        ],
      };
    }`,
  [{ q: 'How often is Dearness Allowance revised?', a: 'Dearness Allowance for central government employees is revised twice a year, effective January and July, based on the All India Consumer Price Index (AICPI) for the preceding 12 months.' },
   { q: 'Does DA affect retirement benefits?', a: 'Yes. DA at the time of retirement is merged into basic pay for calculating pension and gratuity. Higher DA at retirement leads to higher retirement benefits for government employees.' }],
  'DA = Basic Pay x DA Rate / 100; HRA = Basic Pay x HRA Rate (based on city classification)',
  ['section-80c-deduction-calculator', 'sip-step-up-calculator']
);

// #73 IRPF Calculator Brazil
add('irpf-calculator-brazil', 'IRPF Calculator Brazil',
  'Calculate Brazilian federal income tax (IRPF) based on monthly or annual gross income and applicable deductions.',
  'Finance', 'finance', '$',
  ['irpf calculator', 'imposto de renda', 'brazilian income tax calculator'],
  [
    '{ name: "monthlyIncome", label: "Monthly Gross Income", type: "number", prefix: "R$", min: 1000, max: 500000, step: 500, defaultValue: 8000 }',
    '{ name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 1 }',
    '{ name: "inssDeduction", label: "INSS Deduction", type: "number", prefix: "R$", min: 0, max: 10000, step: 50, defaultValue: 900 }',
  ],
  `(inputs) => {
      const income = inputs.monthlyIncome as number;
      const dependents = inputs.dependents as number;
      const inss = inputs.inssDeduction as number;
      if (!income || income <= 0) return null;
      const dependentDeduction = (dependents || 0) * 189.59;
      const taxableIncome = income - (inss || 0) - dependentDeduction;
      let tax = 0;
      let effectiveRate = 0;
      if (taxableIncome <= 2112) { tax = 0; }
      else if (taxableIncome <= 2826.65) { tax = taxableIncome * 0.075 - 158.40; }
      else if (taxableIncome <= 3751.05) { tax = taxableIncome * 0.15 - 370.40; }
      else if (taxableIncome <= 4664.68) { tax = taxableIncome * 0.225 - 651.73; }
      else { tax = taxableIncome * 0.275 - 884.96; }
      tax = Math.max(0, tax);
      effectiveRate = income > 0 ? (tax / income) * 100 : 0;
      const annualTax = tax * 12;
      return {
        primary: { label: "Monthly IRPF", value: "R$ " + formatNumber(Math.round(tax * 100) / 100) },
        details: [
          { label: "Annual IRPF", value: "R$ " + formatNumber(Math.round(annualTax)) },
          { label: "Taxable Income", value: "R$ " + formatNumber(Math.round(taxableIncome * 100) / 100) },
          { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 100) / 100) + "%" },
        ],
      };
    }`,
  [{ q: 'Who is required to file IRPF in Brazil?', a: 'Brazilian residents who earn above the annual exemption threshold, have taxable assets above R$ 300,000, or receive income from certain sources are required to file an annual IRPF declaration.' },
   { q: 'What deductions are available for IRPF?', a: 'Common IRPF deductions include INSS contributions, dependents (R$ 189.59 per month each), education expenses, medical expenses (unlimited), and private pension contributions up to 12 percent of gross income.' }],
  'Taxable Income = Gross Income - INSS - Dependent Deductions; Tax = Progressive rate brackets (7.5% to 27.5%)',
  ['inss-contribution-calculator-brazil', 'clt-vs-pj-calculator-brazil']
);

// #74 FGTS Calculator Brazil
add('fgts-calculator-brazil', 'FGTS Calculator Brazil',
  'Calculate the FGTS (Fundo de Garantia) balance accumulation based on monthly salary and employment duration.',
  'Finance', 'finance', '$',
  ['fgts calculator', 'fundo de garantia', 'fgts balance calculator'],
  [
    '{ name: "monthlySalary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 1000, max: 200000, step: 500, defaultValue: 5000 }',
    '{ name: "monthsEmployed", label: "Months Employed", type: "number", suffix: "months", min: 1, max: 480, defaultValue: 36 }',
    '{ name: "annualRate", label: "FGTS Annual Yield", type: "number", suffix: "%", min: 0, max: 10, step: 0.1, defaultValue: 3 }',
  ],
  `(inputs) => {
      const salary = inputs.monthlySalary as number;
      const months = inputs.monthsEmployed as number;
      const annualYield = inputs.annualRate as number;
      if (!salary || !months || salary <= 0) return null;
      const monthlyDeposit = salary * 0.08;
      const monthlyRate = (annualYield || 3) / 100 / 12;
      let balance = 0;
      for (let m = 0; m < months; m++) {
        balance = (balance + monthlyDeposit) * (1 + monthlyRate);
      }
      const totalDeposited = monthlyDeposit * months;
      const interestEarned = balance - totalDeposited;
      return {
        primary: { label: "Estimated FGTS Balance", value: "R$ " + formatNumber(Math.round(balance * 100) / 100) },
        details: [
          { label: "Monthly Deposit (8%)", value: "R$ " + formatNumber(Math.round(monthlyDeposit * 100) / 100) },
          { label: "Total Deposited", value: "R$ " + formatNumber(Math.round(totalDeposited)) },
          { label: "Interest Earned", value: "R$ " + formatNumber(Math.round(interestEarned * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'What is FGTS in Brazil?', a: 'FGTS (Fundo de Garantia do Tempo de Servico) is a mandatory severance fund where employers deposit 8 percent of an employee monthly salary. The fund can be withdrawn upon termination without cause, home purchase, or retirement.' },
   { q: 'What is the interest rate on FGTS?', a: 'FGTS earns a fixed rate of 3 percent per year plus TR (Taxa Referencial). In practice, this rate is below inflation, meaning the purchasing power of FGTS balances decreases over time.' }],
  'Monthly Deposit = Salary x 8%; Balance = Cumulative deposits compounded at annual yield rate',
  ['rescisao-calculator-brazil', 'clt-vs-pj-calculator-brazil']
);

// #75 Financiamento Imobiliario Calculator
add('financiamento-imobiliario-calculator', 'Financiamento Imobiliario Calculator',
  'Calculate monthly payments and total cost of a Brazilian housing finance loan using SAC or PRICE amortization.',
  'Finance', 'finance', '$',
  ['financiamento imobiliario', 'housing loan brazil', 'mortgage calculator brazil'],
  [
    '{ name: "propertyValue", label: "Property Value", type: "number", prefix: "R$", min: 50000, max: 10000000, step: 10000, defaultValue: 400000 }',
    '{ name: "downPayment", label: "Down Payment Percentage", type: "number", suffix: "%", min: 10, max: 80, step: 5, defaultValue: 20 }',
    '{ name: "term", label: "Loan Term", type: "number", suffix: "years", min: 5, max: 35, defaultValue: 30 }',
    '{ name: "annualRate", label: "Annual Interest Rate", type: "number", suffix: "%", min: 4, max: 20, step: 0.1, defaultValue: 9.5 }',
  ],
  `(inputs) => {
      const property = inputs.propertyValue as number;
      const downPct = inputs.downPayment as number;
      const termYears = inputs.term as number;
      const rate = inputs.annualRate as number;
      if (!property || !termYears || !rate || property <= 0) return null;
      const downAmount = property * (downPct / 100);
      const loanAmount = property - downAmount;
      const monthlyRate = rate / 100 / 12;
      const totalMonths = termYears * 12;
      const pricePayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      const totalPaid = pricePayment * totalMonths + downAmount;
      const totalInterest = totalPaid - property;
      return {
        primary: { label: "Monthly Payment (PRICE)", value: "R$ " + formatNumber(Math.round(pricePayment * 100) / 100) },
        details: [
          { label: "Loan Amount", value: "R$ " + formatNumber(Math.round(loanAmount)) },
          { label: "Total Interest Paid", value: "R$ " + formatNumber(Math.round(totalInterest)) },
          { label: "Total Cost of Property", value: "R$ " + formatNumber(Math.round(totalPaid)) },
        ],
      };
    }`,
  [{ q: 'What is the difference between SAC and PRICE amortization?', a: 'In SAC (Sistema de Amortizacao Constante), monthly payments decrease over time because the principal portion is constant while interest decreases. In PRICE (Tabela Price), payments remain fixed throughout the loan term.' },
   { q: 'What is the maximum loan term for housing finance in Brazil?', a: 'Brazilian banks typically offer housing finance terms up to 35 years. The maximum financed amount is usually 80 percent of the property value, requiring a minimum 20 percent down payment.' }],
  'Monthly Payment (PRICE) = Loan x (Rate x (1 + Rate) ^ Months) / ((1 + Rate) ^ Months - 1)',
  ['iptu-calculator-brazil', 'fgts-calculator-brazil']
);

// #76 INSS Contribution Calculator Brazil
add('inss-contribution-calculator-brazil', 'INSS Contribution Calculator Brazil',
  'Calculate the monthly INSS social security contribution for Brazilian workers based on salary and contribution type.',
  'Finance', 'finance', '$',
  ['inss calculator', 'inss contribution', 'previdencia social calculator'],
  [
    '{ name: "grossSalary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 1000, max: 200000, step: 500, defaultValue: 6000 }',
    '{ name: "contributorType", label: "Contributor Type", type: "select", options: [{value:"clt",label:"CLT Employee"},{value:"autonomo",label:"Autonomo (Self-Employed)"},{value:"mei",label:"MEI"}], defaultValue: "clt" }',
    '{ name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 0 }',
  ],
  `(inputs) => {
      const salary = inputs.grossSalary as number;
      const type = inputs.contributorType as string;
      const dependents = inputs.dependents as number;
      if (!salary || salary <= 0) return null;
      let contribution = 0;
      const ceiling = 7786.02;
      if (type === "mei") {
        contribution = 1412 * 0.05;
      } else if (type === "autonomo") {
        const base = Math.min(salary, ceiling);
        contribution = base * 0.20;
      } else {
        let remaining = Math.min(salary, ceiling);
        const brackets = [{limit:1412,rate:0.075},{limit:2666.68,rate:0.09},{limit:4000.03,rate:0.12},{limit:ceiling,rate:0.14}];
        let prev = 0;
        for (const b of brackets) {
          if (remaining <= 0) break;
          const taxable = Math.min(remaining, b.limit - prev);
          contribution += taxable * b.rate;
          remaining -= taxable;
          prev = b.limit;
        }
      }
      const annualContribution = contribution * 12;
      const netSalary = salary - contribution;
      return {
        primary: { label: "Monthly INSS Contribution", value: "R$ " + formatNumber(Math.round(contribution * 100) / 100) },
        details: [
          { label: "Annual Contribution", value: "R$ " + formatNumber(Math.round(annualContribution)) },
          { label: "Net Salary After INSS", value: "R$ " + formatNumber(Math.round(netSalary * 100) / 100) },
          { label: "Effective INSS Rate", value: formatNumber(Math.round(contribution / salary * 10000) / 100) + "%" },
        ],
      };
    }`,
  [{ q: 'What is the INSS contribution ceiling?', a: 'The INSS contribution ceiling is the maximum salary base on which contributions are calculated. For 2024, the ceiling is approximately R$ 7,786.02 per month. Income above this amount is not subject to INSS.' },
   { q: 'What benefits does INSS provide?', a: 'INSS provides retirement pensions, disability benefits, sick leave pay (after 15 days), maternity leave pay, death pension for dependents, and accident insurance for contributing workers.' }],
  'CLT INSS = Progressive rates (7.5% to 14%) on salary up to ceiling; Autonomo = 20% of income up to ceiling',
  ['irpf-calculator-brazil', 'clt-vs-pj-calculator-brazil']
);

// #77 CLT vs PJ Calculator Brazil
add('clt-vs-pj-calculator-brazil', 'CLT vs PJ Calculator Brazil',
  'Compare net income between CLT employment and PJ (Pessoa Juridica) contractor status in Brazil.',
  'Finance', 'finance', '$',
  ['clt vs pj', 'clt or pj calculator', 'employee vs contractor brazil'],
  [
    '{ name: "grossMonthly", label: "Monthly Gross Compensation", type: "number", prefix: "R$", min: 2000, max: 500000, step: 500, defaultValue: 15000 }',
    '{ name: "pjTaxRegime", label: "PJ Tax Regime", type: "select", options: [{value:"simples",label:"Simples Nacional"},{value:"presumido",label:"Lucro Presumido"}], defaultValue: "simples" }',
    '{ name: "hasHealthPlan", label: "Employer Health Plan (CLT)", type: "select", options: [{value:"yes",label:"Yes"},{value:"no",label:"No"}], defaultValue: "yes" }',
  ],
  `(inputs) => {
      const gross = inputs.grossMonthly as number;
      const regime = inputs.pjTaxRegime as string;
      const health = inputs.hasHealthPlan as string;
      if (!gross || gross <= 0) return null;
      const inss = Math.min(gross * 0.11, 856.46);
      const irpfBase = gross - inss;
      let irpf = 0;
      if (irpfBase > 4664.68) irpf = irpfBase * 0.275 - 884.96;
      else if (irpfBase > 3751.05) irpf = irpfBase * 0.225 - 651.73;
      else if (irpfBase > 2826.65) irpf = irpfBase * 0.15 - 370.40;
      else if (irpfBase > 2112) irpf = irpfBase * 0.075 - 158.40;
      irpf = Math.max(0, irpf);
      const cltNet = gross - inss - irpf;
      const cltAnnual = cltNet * 12 + gross + gross / 3;
      const pjTaxRate = regime === "simples" ? 0.06 : 0.1133;
      const pjTax = gross * pjTaxRate;
      const pjNet = gross - pjTax;
      const pjAnnual = pjNet * 12;
      const healthValue = health === "yes" ? 500 : 0;
      const cltTotalAnnual = cltAnnual + healthValue * 12;
      return {
        primary: { label: "CLT vs PJ Monthly Net", value: "R$ " + formatNumber(Math.round(cltNet)) + " vs R$ " + formatNumber(Math.round(pjNet)) },
        details: [
          { label: "CLT Annual (with 13th and vacation)", value: "R$ " + formatNumber(Math.round(cltTotalAnnual)) },
          { label: "PJ Annual", value: "R$ " + formatNumber(Math.round(pjAnnual)) },
          { label: "PJ Advantage", value: pjAnnual > cltTotalAnnual ? "PJ earns R$ " + formatNumber(Math.round(pjAnnual - cltTotalAnnual)) + " more per year" : "CLT earns R$ " + formatNumber(Math.round(cltTotalAnnual - pjAnnual)) + " more per year" },
        ],
      };
    }`,
  [{ q: 'What is the difference between CLT and PJ in Brazil?', a: 'CLT (Consolidacao das Leis do Trabalho) is formal employment with benefits like FGTS, 13th salary, paid vacation, and INSS. PJ (Pessoa Juridica) is working as a contractor through a company, with fewer benefits but potentially higher net income.' },
   { q: 'At what salary level does PJ become more advantageous?', a: 'PJ typically becomes more advantageous at higher salary levels where the CLT tax burden is heavier. However, PJ workers must account for the absence of FGTS, 13th salary, paid vacation, and employer-provided benefits.' }],
  'CLT Net = Gross - INSS - IRPF + 13th Salary + Vacation Bonus; PJ Net = Gross - Tax (Simples or Presumido)',
  ['irpf-calculator-brazil', 'inss-contribution-calculator-brazil']
);

// #78 Decimo Terceiro Calculator
add('decimo-terceiro-calculator', 'Decimo Terceiro Calculator',
  'Calculate the 13th salary (decimo terceiro) payment for Brazilian CLT employees based on months worked and salary.',
  'Finance', 'finance', '$',
  ['decimo terceiro', '13th salary calculator', 'thirteenth salary brazil'],
  [
    '{ name: "monthlySalary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 1000, max: 200000, step: 500, defaultValue: 6000 }',
    '{ name: "monthsWorked", label: "Months Worked This Year", type: "number", suffix: "months", min: 1, max: 12, defaultValue: 12 }',
    '{ name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const salary = inputs.monthlySalary as number;
      const months = inputs.monthsWorked as number;
      const dependents = inputs.dependents as number;
      if (!salary || !months || salary <= 0) return null;
      const gross13th = salary * (months / 12);
      const inss = Math.min(gross13th * 0.11, 856.46);
      const depDeduction = (dependents || 0) * 189.59;
      const irpfBase = gross13th - inss - depDeduction;
      let irpf = 0;
      if (irpfBase > 4664.68) irpf = irpfBase * 0.275 - 884.96;
      else if (irpfBase > 3751.05) irpf = irpfBase * 0.225 - 651.73;
      else if (irpfBase > 2826.65) irpf = irpfBase * 0.15 - 370.40;
      else if (irpfBase > 2112) irpf = irpfBase * 0.075 - 158.40;
      irpf = Math.max(0, irpf);
      const net13th = gross13th - inss - irpf;
      return {
        primary: { label: "Net 13th Salary", value: "R$ " + formatNumber(Math.round(net13th * 100) / 100) },
        details: [
          { label: "Gross 13th Salary", value: "R$ " + formatNumber(Math.round(gross13th * 100) / 100) },
          { label: "INSS Deduction", value: "R$ " + formatNumber(Math.round(inss * 100) / 100) },
          { label: "IRPF Deduction", value: "R$ " + formatNumber(Math.round(irpf * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'When is the 13th salary paid in Brazil?', a: 'The 13th salary is paid in two installments. The first installment (50 percent of gross salary) is paid between February and November, and the second installment (remaining balance minus deductions) is paid by December 20.' },
   { q: 'Is the 13th salary subject to taxes?', a: 'Yes. The 13th salary is subject to INSS and IRPF deductions, which are calculated separately from the regular monthly salary. The deductions are applied on the second installment.' }],
  'Gross 13th = Monthly Salary x (Months Worked / 12); Net 13th = Gross - INSS - IRPF',
  ['ferias-calculator-brazil', 'rescisao-calculator-brazil']
);

// #79 IPTU Calculator Brazil
add('iptu-calculator-brazil', 'IPTU Calculator Brazil',
  'Estimate the annual IPTU (Imposto Predial e Territorial Urbano) property tax for Brazilian properties.',
  'Finance', 'finance', '$',
  ['iptu calculator', 'property tax brazil', 'imposto predial calculator'],
  [
    '{ name: "venalValue", label: "Venal Value of Property", type: "number", prefix: "R$", min: 10000, max: 50000000, step: 10000, defaultValue: 500000 }',
    '{ name: "propertyType", label: "Property Type", type: "select", options: [{value:"residential",label:"Residential"},{value:"commercial",label:"Commercial"},{value:"land",label:"Vacant Land"}], defaultValue: "residential" }',
    '{ name: "city", label: "City", type: "select", options: [{value:"saopaulo",label:"Sao Paulo"},{value:"rio",label:"Rio de Janeiro"},{value:"other",label:"Other City"}], defaultValue: "saopaulo" }',
  ],
  `(inputs) => {
      const venal = inputs.venalValue as number;
      const type = inputs.propertyType as string;
      const city = inputs.city as string;
      if (!venal || venal <= 0) return null;
      const rates: Record<string, Record<string, number>> = {
        saopaulo: { residential: 1.0, commercial: 1.5, land: 1.5 },
        rio: { residential: 1.2, commercial: 2.0, land: 3.5 },
        other: { residential: 0.8, commercial: 1.2, land: 2.0 },
      };
      const cityRates = rates[city] || rates["other"];
      const rate = cityRates[type] || 1.0;
      const annualIPTU = venal * (rate / 100);
      const monthlyEquivalent = annualIPTU / 12;
      const discountCash = annualIPTU * 0.03;
      const cashPayment = annualIPTU - discountCash;
      return {
        primary: { label: "Annual IPTU", value: "R$ " + formatNumber(Math.round(annualIPTU)) },
        details: [
          { label: "Monthly Equivalent", value: "R$ " + formatNumber(Math.round(monthlyEquivalent)) },
          { label: "Cash Payment (3% discount)", value: "R$ " + formatNumber(Math.round(cashPayment)) },
          { label: "Effective Rate", value: formatNumber(rate) + "%" },
        ],
      };
    }`,
  [{ q: 'How is IPTU calculated in Brazil?', a: 'IPTU is calculated by multiplying the venal value (valor venal) of the property by the municipal tax rate. Rates vary by city and property type, typically ranging from 0.5 percent to 3.5 percent.' },
   { q: 'Can IPTU be paid in installments?', a: 'Yes. Most municipalities offer the option to pay IPTU in monthly installments (usually 10 to 12) or in a single payment with a discount, typically around 3 to 5 percent for paying in full.' }],
  'Annual IPTU = Venal Value x Tax Rate (varies by city and property type)',
  ['financiamento-imobiliario-calculator', 'irpf-calculator-brazil']
);

// #80 Rescisao Calculator Brazil
add('rescisao-calculator-brazil', 'Rescisao Calculator Brazil',
  'Calculate the termination pay (rescisao) owed to a Brazilian CLT employee upon dismissal.',
  'Finance', 'finance', '$',
  ['rescisao calculator', 'termination pay brazil', 'severance calculator brazil'],
  [
    '{ name: "monthlySalary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 1000, max: 200000, step: 500, defaultValue: 5000 }',
    '{ name: "monthsWorked", label: "Total Months Worked", type: "number", suffix: "months", min: 1, max: 480, defaultValue: 24 }',
    '{ name: "terminationType", label: "Termination Type", type: "select", options: [{value:"without_cause",label:"Without Cause (Sem Justa Causa)"},{value:"with_cause",label:"With Cause (Justa Causa)"},{value:"resignation",label:"Resignation (Pedido de Demissao)"}], defaultValue: "without_cause" }',
    '{ name: "unusedVacationDays", label: "Unused Vacation Days", type: "number", suffix: "days", min: 0, max: 60, defaultValue: 15 }',
  ],
  `(inputs) => {
      const salary = inputs.monthlySalary as number;
      const months = inputs.monthsWorked as number;
      const type = inputs.terminationType as string;
      const vacDays = inputs.unusedVacationDays as number;
      if (!salary || !months || salary <= 0) return null;
      const dailyRate = salary / 30;
      const proportional13th = salary * ((months % 12) / 12);
      const vacationPay = dailyRate * (vacDays || 0);
      const vacationBonus = vacationPay / 3;
      let fgtsBalance = salary * 0.08 * months;
      let fgtsFine = 0;
      let noticePay = 0;
      if (type === "without_cause") {
        fgtsFine = fgtsBalance * 0.40;
        noticePay = salary + Math.min(Math.floor(months / 12), 20) * (salary / 30) * 3;
      } else if (type === "resignation") {
        fgtsFine = 0;
        noticePay = 0;
      } else {
        fgtsFine = 0;
        noticePay = 0;
        fgtsBalance = 0;
      }
      const total = proportional13th + vacationPay + vacationBonus + fgtsFine + noticePay;
      return {
        primary: { label: "Estimated Rescisao Total", value: "R$ " + formatNumber(Math.round(total)) },
        details: [
          { label: "Proportional 13th Salary", value: "R$ " + formatNumber(Math.round(proportional13th)) },
          { label: "Vacation Pay + 1/3 Bonus", value: "R$ " + formatNumber(Math.round(vacationPay + vacationBonus)) },
          { label: "FGTS Fine (40%)", value: "R$ " + formatNumber(Math.round(fgtsFine)) },
        ],
      };
    }`,
  [{ q: 'What is included in a rescisao for dismissal without cause?', a: 'Dismissal without cause entitles the employee to notice pay (or worked notice), proportional 13th salary, unused vacation plus one-third bonus, FGTS balance withdrawal, and a 40 percent fine on the FGTS balance.' },
   { q: 'Does resignation affect the rescisao amount?', a: 'Yes. When an employee resigns, they forfeit the 40 percent FGTS fine, cannot withdraw the FGTS balance immediately, and may owe the employer 30 days of notice if not served.' }],
  'Rescisao = Proportional 13th + Vacation Pay + Vacation Bonus + FGTS Fine + Notice Pay',
  ['fgts-calculator-brazil', 'decimo-terceiro-calculator']
);

// #81 Simples Nacional Calculator
add('simples-nacional-calculator', 'Simples Nacional Calculator',
  'Calculate taxes under the Simples Nacional simplified tax regime for small businesses in Brazil.',
  'Finance', 'finance', '$',
  ['simples nacional', 'simples tax calculator', 'small business tax brazil'],
  [
    '{ name: "monthlyRevenue", label: "Monthly Revenue", type: "number", prefix: "R$", min: 1000, max: 500000, step: 1000, defaultValue: 30000 }',
    '{ name: "annualRevenue", label: "Annual Revenue (last 12 months)", type: "number", prefix: "R$", min: 10000, max: 4800000, step: 10000, defaultValue: 360000 }',
    '{ name: "activity", label: "Business Activity", type: "select", options: [{value:"commerce",label:"Commerce (Anexo I)"},{value:"industry",label:"Industry (Anexo II)"},{value:"services",label:"Services (Anexo III)"},{value:"services2",label:"Services (Anexo V)"}], defaultValue: "services" }',
  ],
  `(inputs) => {
      const monthly = inputs.monthlyRevenue as number;
      const annual = inputs.annualRevenue as number;
      const activity = inputs.activity as string;
      if (!monthly || !annual || monthly <= 0) return null;
      const rates: Record<string, {rate: number, deduction: number}[]> = {
        commerce: [{rate:4.0,deduction:0},{rate:7.3,deduction:5940},{rate:9.5,deduction:13860},{rate:10.7,deduction:22500}],
        industry: [{rate:4.5,deduction:0},{rate:7.8,deduction:5940},{rate:10.0,deduction:13860},{rate:11.2,deduction:22500}],
        services: [{rate:6.0,deduction:0},{rate:11.2,deduction:9360},{rate:13.5,deduction:17640},{rate:16.0,deduction:35640}],
        services2: [{rate:15.5,deduction:0},{rate:18.0,deduction:4500},{rate:19.5,deduction:9900},{rate:20.5,deduction:17100}],
      };
      const brackets = rates[activity] || rates["services"];
      let bracket;
      if (annual <= 180000) bracket = brackets[0];
      else if (annual <= 360000) bracket = brackets[1];
      else if (annual <= 720000) bracket = brackets[2];
      else bracket = brackets[3];
      const effectiveRate = (annual * bracket.rate / 100 - bracket.deduction) / annual * 100;
      const monthlyTax = monthly * (effectiveRate / 100);
      const annualTax = monthlyTax * 12;
      return {
        primary: { label: "Monthly Tax (Simples)", value: "R$ " + formatNumber(Math.round(monthlyTax)) },
        details: [
          { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 100) / 100) + "%" },
          { label: "Nominal Rate", value: formatNumber(bracket.rate) + "%" },
          { label: "Estimated Annual Tax", value: "R$ " + formatNumber(Math.round(annualTax)) },
        ],
      };
    }`,
  [{ q: 'What is Simples Nacional?', a: 'Simples Nacional is a simplified tax regime for small businesses in Brazil with annual revenue up to R$ 4.8 million. It consolidates multiple federal, state, and municipal taxes into a single monthly payment.' },
   { q: 'What are the Simples Nacional annexes?', a: 'Simples Nacional has five annexes (I through V) that define tax rates based on business activity. Commerce falls under Anexo I, industry under Anexo II, and services under Anexos III, IV, or V depending on the type of service.' }],
  'Effective Rate = (Annual Revenue x Nominal Rate - Deduction) / Annual Revenue; Monthly Tax = Monthly Revenue x Effective Rate',
  ['irpf-calculator-brazil', 'clt-vs-pj-calculator-brazil']
);

// #82 Ferias Calculator Brazil
add('ferias-calculator-brazil', 'Ferias Calculator Brazil',
  'Calculate vacation pay (ferias) for Brazilian CLT employees including the constitutional one-third bonus.',
  'Finance', 'finance', '$',
  ['ferias calculator', 'vacation pay brazil', 'ferias remuneradas calculator'],
  [
    '{ name: "monthlySalary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 1000, max: 200000, step: 500, defaultValue: 5000 }',
    '{ name: "vacationDays", label: "Vacation Days Taken", type: "number", suffix: "days", min: 10, max: 30, defaultValue: 30 }',
    '{ name: "sellDays", label: "Days Sold (Abono Pecuniario)", type: "number", suffix: "days", min: 0, max: 10, defaultValue: 0 }',
    '{ name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const salary = inputs.monthlySalary as number;
      const vacDays = inputs.vacationDays as number;
      const sellDays = inputs.sellDays as number;
      const dependents = inputs.dependents as number;
      if (!salary || !vacDays || salary <= 0) return null;
      const dailyRate = salary / 30;
      const vacationPay = dailyRate * vacDays;
      const constitutionalBonus = vacationPay / 3;
      const soldDaysPay = dailyRate * (sellDays || 0);
      const soldDaysBonus = soldDaysPay / 3;
      const grossTotal = vacationPay + constitutionalBonus + soldDaysPay + soldDaysBonus;
      const inss = Math.min((vacationPay + constitutionalBonus) * 0.11, 856.46);
      const depDeduction = (dependents || 0) * 189.59;
      const irpfBase = vacationPay + constitutionalBonus - inss - depDeduction;
      let irpf = 0;
      if (irpfBase > 4664.68) irpf = irpfBase * 0.275 - 884.96;
      else if (irpfBase > 3751.05) irpf = irpfBase * 0.225 - 651.73;
      else if (irpfBase > 2826.65) irpf = irpfBase * 0.15 - 370.40;
      else if (irpfBase > 2112) irpf = irpfBase * 0.075 - 158.40;
      irpf = Math.max(0, irpf);
      const netTotal = grossTotal - inss - irpf;
      return {
        primary: { label: "Net Vacation Pay", value: "R$ " + formatNumber(Math.round(netTotal * 100) / 100) },
        details: [
          { label: "Gross Vacation Pay", value: "R$ " + formatNumber(Math.round(vacationPay)) },
          { label: "Constitutional 1/3 Bonus", value: "R$ " + formatNumber(Math.round(constitutionalBonus)) },
          { label: "Total Deductions (INSS + IRPF)", value: "R$ " + formatNumber(Math.round(inss + irpf)) },
        ],
      };
    }`,
  [{ q: 'What is the constitutional one-third vacation bonus?', a: 'Brazilian law guarantees that employees receive an additional one-third of their salary as a bonus on top of regular vacation pay. This constitutional bonus applies to all CLT workers taking their annual vacation.' },
   { q: 'Can vacation days be sold in Brazil?', a: 'Yes. Brazilian workers can sell up to one-third of their vacation days (10 out of 30 days) through abono pecuniario. The sold days are paid at the daily rate plus the one-third constitutional bonus and are exempt from income tax.' }],
  'Vacation Pay = (Salary / 30) x Vacation Days; Total = Vacation Pay + 1/3 Bonus + Sold Days - INSS - IRPF',
  ['decimo-terceiro-calculator', 'rescisao-calculator-brazil']
);

// #83 W-4 Calculator
add('w4-calculator', 'W-4 Calculator',
  'Estimate the optimal number of withholding allowances on your W-4 form to match your expected federal tax liability.',
  'Finance', 'finance', '$',
  ['w4 calculator', 'withholding calculator', 'federal withholding allowances'],
  [
    '{ name: "annualIncome", label: "Annual Gross Income", type: "number", prefix: "$", min: 10000, max: 1000000, step: 1000, defaultValue: 75000 }',
    '{ name: "filingStatus", label: "Filing Status", type: "select", options: [{value:"single",label:"Single"},{value:"married",label:"Married Filing Jointly"},{value:"head",label:"Head of Household"}], defaultValue: "single" }',
    '{ name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 0 }',
    '{ name: "otherIncome", label: "Other Annual Income", type: "number", prefix: "$", min: 0, max: 500000, step: 1000, defaultValue: 0 }',
  ],
  `(inputs) => {
      const income = inputs.annualIncome as number;
      const filing = inputs.filingStatus as string;
      const deps = inputs.dependents as number;
      const other = inputs.otherIncome as number;
      if (!income || income <= 0) return null;
      const totalIncome = income + (other || 0);
      const standardDeduction: Record<string, number> = { single: 14600, married: 29200, head: 21900 };
      const deduction = standardDeduction[filing] || 14600;
      const taxableIncome = Math.max(0, totalIncome - deduction);
      let tax = 0;
      if (filing === "married") {
        if (taxableIncome <= 23200) tax = taxableIncome * 0.10;
        else if (taxableIncome <= 94300) tax = 2320 + (taxableIncome - 23200) * 0.12;
        else if (taxableIncome <= 201050) tax = 10852 + (taxableIncome - 94300) * 0.22;
        else tax = 34337 + (taxableIncome - 201050) * 0.24;
      } else {
        if (taxableIncome <= 11600) tax = taxableIncome * 0.10;
        else if (taxableIncome <= 47150) tax = 1160 + (taxableIncome - 11600) * 0.12;
        else if (taxableIncome <= 100525) tax = 5426 + (taxableIncome - 47150) * 0.22;
        else tax = 17168.50 + (taxableIncome - 100525) * 0.24;
      }
      const childCredit = (deps || 0) * 2000;
      const netTax = Math.max(0, tax - childCredit);
      const monthlyWithholding = netTax / 12;
      const perPaycheck = netTax / 26;
      return {
        primary: { label: "Estimated Annual Federal Tax", value: "$" + formatNumber(Math.round(netTax)) },
        details: [
          { label: "Monthly Withholding Needed", value: "$" + formatNumber(Math.round(monthlyWithholding)) },
          { label: "Per Paycheck (biweekly)", value: "$" + formatNumber(Math.round(perPaycheck)) },
          { label: "Effective Tax Rate", value: formatNumber(Math.round(netTax / totalIncome * 10000) / 100) + "%" },
        ],
      };
    }`,
  [{ q: 'How do I fill out a W-4 correctly?', a: 'The W-4 form requires your filing status, information about multiple jobs or working spouse, dependent credits, other adjustments, and any extra withholding. Use the IRS estimator tool or this calculator to ensure accurate withholding.' },
   { q: 'Should I claim 0 or 1 on my W-4?', a: 'The current W-4 form no longer uses allowances (0 or 1). Instead it uses a five-step process. Claiming fewer deductions results in more tax withheld, reducing the risk of owing at tax time.' }],
  'Tax = Progressive rates on (Income - Standard Deduction); Net Tax = Tax - Child Tax Credits',
  ['tax-refund-calculator', 'standard-deduction-calculator']
);

// #84 Tax Refund Calculator
add('tax-refund-calculator', 'Tax Refund Calculator',
  'Estimate your federal tax refund or amount owed based on income, withholdings, and credits.',
  'Finance', 'finance', '$',
  ['tax refund calculator', 'estimated tax refund', 'will i get a tax refund'],
  [
    '{ name: "annualIncome", label: "Annual Gross Income", type: "number", prefix: "$", min: 10000, max: 1000000, step: 1000, defaultValue: 65000 }',
    '{ name: "totalWithheld", label: "Total Federal Tax Withheld", type: "number", prefix: "$", min: 0, max: 200000, step: 100, defaultValue: 8500 }',
    '{ name: "filingStatus", label: "Filing Status", type: "select", options: [{value:"single",label:"Single"},{value:"married",label:"Married Filing Jointly"},{value:"head",label:"Head of Household"}], defaultValue: "single" }',
    '{ name: "credits", label: "Total Tax Credits", type: "number", prefix: "$", min: 0, max: 50000, step: 100, defaultValue: 0 }',
  ],
  `(inputs) => {
      const income = inputs.annualIncome as number;
      const withheld = inputs.totalWithheld as number;
      const filing = inputs.filingStatus as string;
      const credits = inputs.credits as number;
      if (!income || income <= 0) return null;
      const standardDeduction: Record<string, number> = { single: 14600, married: 29200, head: 21900 };
      const deduction = standardDeduction[filing] || 14600;
      const taxableIncome = Math.max(0, income - deduction);
      let tax = 0;
      if (filing === "married") {
        if (taxableIncome <= 23200) tax = taxableIncome * 0.10;
        else if (taxableIncome <= 94300) tax = 2320 + (taxableIncome - 23200) * 0.12;
        else if (taxableIncome <= 201050) tax = 10852 + (taxableIncome - 94300) * 0.22;
        else tax = 34337 + (taxableIncome - 201050) * 0.24;
      } else {
        if (taxableIncome <= 11600) tax = taxableIncome * 0.10;
        else if (taxableIncome <= 47150) tax = 1160 + (taxableIncome - 11600) * 0.12;
        else if (taxableIncome <= 100525) tax = 5426 + (taxableIncome - 47150) * 0.22;
        else tax = 17168.50 + (taxableIncome - 100525) * 0.24;
      }
      const netTax = Math.max(0, tax - (credits || 0));
      const refundOrOwed = (withheld || 0) - netTax;
      return {
        primary: { label: refundOrOwed >= 0 ? "Estimated Refund" : "Estimated Amount Owed", value: "$" + formatNumber(Math.abs(Math.round(refundOrOwed))) },
        details: [
          { label: "Total Tax Liability", value: "$" + formatNumber(Math.round(netTax)) },
          { label: "Total Withheld", value: "$" + formatNumber(Math.round(withheld || 0)) },
          { label: "Taxable Income", value: "$" + formatNumber(Math.round(taxableIncome)) },
        ],
      };
    }`,
  [{ q: 'When will I receive my tax refund?', a: 'The IRS typically issues refunds within 21 days of accepting an electronically filed return. Paper returns may take 6 to 8 weeks. Refunds with the Earned Income Tax Credit or Additional Child Tax Credit may be delayed until mid-February.' },
   { q: 'Is it better to get a large refund or owe a small amount?', a: 'Financially, it is better to owe a small amount because a large refund means you gave the government an interest-free loan. However, many people prefer the forced savings effect of a refund.' }],
  'Refund = Total Withheld - (Tax on Taxable Income - Credits); Taxable Income = Gross Income - Standard Deduction',
  ['w4-calculator', 'standard-deduction-calculator']
);

// #85 Standard Deduction Calculator
add('standard-deduction-calculator', 'Standard Deduction Calculator',
  'Determine your standard deduction amount based on filing status, age, and blindness status for federal income tax.',
  'Finance', 'finance', '$',
  ['standard deduction', 'standard deduction calculator', 'tax deduction amount'],
  [
    '{ name: "filingStatus", label: "Filing Status", type: "select", options: [{value:"single",label:"Single"},{value:"married",label:"Married Filing Jointly"},{value:"head",label:"Head of Household"},{value:"marriedSeparate",label:"Married Filing Separately"}], defaultValue: "single" }',
    '{ name: "age", label: "Age", type: "number", suffix: "years", min: 16, max: 100, defaultValue: 35 }',
    '{ name: "isBlind", label: "Legally Blind", type: "select", options: [{value:"no",label:"No"},{value:"yes",label:"Yes"}], defaultValue: "no" }',
  ],
  `(inputs) => {
      const filing = inputs.filingStatus as string;
      const age = inputs.age as number;
      const blind = inputs.isBlind as string;
      if (!age) return null;
      const baseDeductions: Record<string, number> = { single: 14600, married: 29200, head: 21900, marriedSeparate: 14600 };
      const base = baseDeductions[filing] || 14600;
      let additional = 0;
      const isMarried = filing === "married" || filing === "marriedSeparate";
      const additionalAmount = isMarried ? 1550 : 1950;
      if (age >= 65) additional += additionalAmount;
      if (blind === "yes") additional += additionalAmount;
      const totalDeduction = base + additional;
      const taxSavingsAt22 = totalDeduction * 0.22;
      return {
        primary: { label: "Standard Deduction", value: "$" + formatNumber(totalDeduction) },
        details: [
          { label: "Base Deduction", value: "$" + formatNumber(base) },
          { label: "Additional Amount", value: "$" + formatNumber(additional) },
          { label: "Estimated Tax Savings (at 22% bracket)", value: "$" + formatNumber(Math.round(taxSavingsAt22)) },
        ],
      };
    }`,
  [{ q: 'Should I take the standard deduction or itemize?', a: 'Take the standard deduction if your total itemized deductions (mortgage interest, state and local taxes, charitable contributions, etc.) are less than the standard deduction amount for your filing status.' },
   { q: 'Do seniors get a higher standard deduction?', a: 'Yes. Taxpayers age 65 or older receive an additional standard deduction of $1,950 for single filers or $1,550 per qualifying spouse for married filers. This is in addition to the base standard deduction.' }],
  'Standard Deduction = Base Amount (by filing status) + Additional Amount (if age 65+ or blind)',
  ['tax-refund-calculator', 'w4-calculator']
);

// #86 Energy Tax Credit Calculator
add('energy-tax-credit-calculator', 'Energy Tax Credit Calculator',
  'Estimate the federal tax credits available for energy-efficient home improvements and renewable energy installations.',
  'Finance', 'finance', '$',
  ['energy tax credit', 'solar tax credit', 'energy efficiency tax credit'],
  [
    '{ name: "improvementType", label: "Improvement Type", type: "select", options: [{value:"solar",label:"Solar Panels"},{value:"heatpump",label:"Heat Pump"},{value:"insulation",label:"Insulation and Windows"},{value:"battery",label:"Battery Storage"}], defaultValue: "solar" }',
    '{ name: "totalCost", label: "Total Project Cost", type: "number", prefix: "$", min: 500, max: 200000, step: 500, defaultValue: 25000 }',
    '{ name: "taxLiability", label: "Expected Tax Liability", type: "number", prefix: "$", min: 0, max: 200000, step: 500, defaultValue: 10000 }',
  ],
  `(inputs) => {
      const type = inputs.improvementType as string;
      const cost = inputs.totalCost as number;
      const liability = inputs.taxLiability as number;
      if (!cost || cost <= 0) return null;
      let creditRate = 0;
      let maxCredit = Infinity;
      if (type === "solar" || type === "battery") {
        creditRate = 0.30;
      } else if (type === "heatpump") {
        creditRate = 0.30;
        maxCredit = 2000;
      } else {
        creditRate = 0.30;
        maxCredit = 1200;
      }
      const rawCredit = cost * creditRate;
      const credit = Math.min(rawCredit, maxCredit);
      const usableCredit = Math.min(credit, liability || credit);
      const carryForward = credit - usableCredit;
      const effectiveDiscount = (credit / cost) * 100;
      return {
        primary: { label: "Estimated Tax Credit", value: "$" + formatNumber(Math.round(credit)) },
        details: [
          { label: "Credit Rate", value: formatNumber(creditRate * 100) + "%" },
          { label: "Usable This Year", value: "$" + formatNumber(Math.round(usableCredit)) },
          { label: "Effective Discount", value: formatNumber(Math.round(effectiveDiscount * 10) / 10) + "%" },
        ],
      };
    }`,
  [{ q: 'What is the federal solar tax credit percentage?', a: 'The federal solar Investment Tax Credit (ITC) is 30 percent of the total system cost for installations through 2032. This includes solar panels, inverters, mounting equipment, and installation labor.' },
   { q: 'Can energy tax credits be carried forward?', a: 'The residential clean energy credit (for solar, wind, and geothermal) can be carried forward to future tax years if the credit exceeds your tax liability. The energy efficient home improvement credit cannot be carried forward.' }],
  'Tax Credit = Project Cost x Credit Rate (30%); subject to annual maximums for certain improvement types',
  ['adoption-tax-credit-calculator', 'standard-deduction-calculator']
);

// #87 Adoption Tax Credit Calculator
add('adoption-tax-credit-calculator', 'Adoption Tax Credit Calculator',
  'Calculate the federal adoption tax credit based on qualified adoption expenses and income limits.',
  'Finance', 'finance', '$',
  ['adoption tax credit', 'adoption credit calculator', 'adoption expense credit'],
  [
    '{ name: "qualifiedExpenses", label: "Qualified Adoption Expenses", type: "number", prefix: "$", min: 0, max: 100000, step: 500, defaultValue: 20000 }',
    '{ name: "adoptionType", label: "Adoption Type", type: "select", options: [{value:"domestic",label:"Domestic Private"},{value:"foster",label:"Foster Care / Special Needs"},{value:"international",label:"International"}], defaultValue: "domestic" }',
    '{ name: "modifiedAGI", label: "Modified Adjusted Gross Income", type: "number", prefix: "$", min: 0, max: 500000, step: 1000, defaultValue: 150000 }',
  ],
  `(inputs) => {
      const expenses = inputs.qualifiedExpenses as number;
      const type = inputs.adoptionType as string;
      const magi = inputs.modifiedAGI as number;
      if (!magi && magi !== 0) return null;
      const maxCredit = 16810;
      let credit;
      if (type === "foster") {
        credit = maxCredit;
      } else {
        credit = Math.min(expenses || 0, maxCredit);
      }
      const phaseoutStart = 252150;
      const phaseoutEnd = 292150;
      if (magi > phaseoutStart && magi < phaseoutEnd) {
        const reduction = (magi - phaseoutStart) / (phaseoutEnd - phaseoutStart);
        credit = credit * (1 - reduction);
      } else if (magi >= phaseoutEnd) {
        credit = 0;
      }
      credit = Math.max(0, Math.round(credit));
      const effectiveSavings = expenses > 0 ? (credit / expenses) * 100 : 0;
      return {
        primary: { label: "Adoption Tax Credit", value: "$" + formatNumber(credit) },
        details: [
          { label: "Maximum Credit Allowed", value: "$" + formatNumber(maxCredit) },
          { label: "Income Phase-out Status", value: magi >= phaseoutEnd ? "Fully phased out" : magi > phaseoutStart ? "Partially phased out" : "Full credit available" },
          { label: "Effective Coverage", value: formatNumber(Math.round(effectiveSavings)) + "% of expenses" },
        ],
      };
    }`,
  [{ q: 'What is the maximum adoption tax credit?', a: 'The maximum adoption tax credit is $16,810 per child for 2024. For special needs adoptions from foster care, the full credit amount is available regardless of actual expenses incurred.' },
   { q: 'Is the adoption tax credit refundable?', a: 'The adoption tax credit is not refundable, meaning it can only reduce your tax liability to zero. However, unused credit can be carried forward for up to five additional tax years.' }],
  'Credit = Min(Qualified Expenses, $16,810) x Phase-out Factor based on MAGI; Foster Care = Full $16,810',
  ['energy-tax-credit-calculator', 'tax-refund-calculator']
);

// #88 Mill Rate Calculator
add('mill-rate-calculator', 'Mill Rate Calculator',
  'Calculate the property tax mill rate and estimate property tax based on assessed value and total municipal budget.',
  'Finance', 'finance', '$',
  ['mill rate', 'property tax rate', 'mill levy calculator'],
  [
    '{ name: "assessedValue", label: "Assessed Property Value", type: "number", prefix: "$", min: 10000, max: 10000000, step: 5000, defaultValue: 250000 }',
    '{ name: "millRate", label: "Mill Rate (mills)", type: "number", suffix: "mills", min: 1, max: 100, step: 0.5, defaultValue: 25 }',
    '{ name: "exemptions", label: "Exemptions (Homestead, etc.)", type: "number", prefix: "$", min: 0, max: 500000, step: 1000, defaultValue: 25000 }',
  ],
  `(inputs) => {
      const assessed = inputs.assessedValue as number;
      const mills = inputs.millRate as number;
      const exemptions = inputs.exemptions as number;
      if (!assessed || !mills || assessed <= 0) return null;
      const taxableValue = Math.max(0, assessed - (exemptions || 0));
      const annualTax = (taxableValue / 1000) * mills;
      const monthlyTax = annualTax / 12;
      const effectiveRate = (annualTax / assessed) * 100;
      return {
        primary: { label: "Annual Property Tax", value: "$" + formatNumber(Math.round(annualTax)) },
        details: [
          { label: "Monthly Tax", value: "$" + formatNumber(Math.round(monthlyTax)) },
          { label: "Taxable Value After Exemptions", value: "$" + formatNumber(taxableValue) },
          { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 1000) / 1000) + "%" },
        ],
      };
    }`,
  [{ q: 'What is a mill rate?', a: 'A mill rate is the amount of tax per one thousand dollars of assessed property value. One mill equals one-tenth of one cent, or $1 per $1,000. A mill rate of 25 means $25 in tax per $1,000 of assessed value.' },
   { q: 'How is the mill rate determined?', a: 'The mill rate is set by local governments based on the total budget needs divided by the total taxable property value in the municipality. It is typically adjusted annually to meet revenue requirements.' }],
  'Annual Tax = (Assessed Value - Exemptions) / 1,000 x Mill Rate',
  ['property-tax-appeal-calculator', 'standard-deduction-calculator']
);

// #89 Property Tax Appeal Calculator
add('property-tax-appeal-calculator', 'Property Tax Appeal Calculator',
  'Estimate the potential tax savings from a successful property tax assessment appeal.',
  'Finance', 'finance', '$',
  ['property tax appeal', 'tax assessment appeal', 'property tax reduction'],
  [
    '{ name: "currentAssessment", label: "Current Assessed Value", type: "number", prefix: "$", min: 10000, max: 10000000, step: 5000, defaultValue: 350000 }',
    '{ name: "targetAssessment", label: "Target (Fair) Value", type: "number", prefix: "$", min: 10000, max: 10000000, step: 5000, defaultValue: 300000 }',
    '{ name: "taxRate", label: "Local Tax Rate", type: "number", suffix: "%", min: 0.1, max: 5, step: 0.1, defaultValue: 1.5 }',
    '{ name: "appealCost", label: "Estimated Appeal Cost", type: "number", prefix: "$", min: 0, max: 10000, step: 50, defaultValue: 500 }',
  ],
  `(inputs) => {
      const current = inputs.currentAssessment as number;
      const target = inputs.targetAssessment as number;
      const rate = inputs.taxRate as number;
      const cost = inputs.appealCost as number;
      if (!current || !target || !rate || current <= 0 || target <= 0) return null;
      const reduction = Math.max(0, current - target);
      const annualSavings = reduction * (rate / 100);
      const netFirstYear = annualSavings - (cost || 0);
      const fiveYearSavings = annualSavings * 5 - (cost || 0);
      const percentReduction = (reduction / current) * 100;
      return {
        primary: { label: "Annual Tax Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        details: [
          { label: "Assessment Reduction", value: "$" + formatNumber(reduction) + " (" + formatNumber(Math.round(percentReduction)) + "%)" },
          { label: "Net First Year Savings", value: "$" + formatNumber(Math.round(netFirstYear)) },
          { label: "5-Year Net Savings", value: "$" + formatNumber(Math.round(fiveYearSavings)) },
        ],
      };
    }`,
  [{ q: 'When should I appeal my property tax assessment?', a: 'Consider appealing if your assessed value is significantly higher than comparable recent sales in your area, if there are errors in the property description, or if market values have declined since the last assessment.' },
   { q: 'What evidence do I need for a property tax appeal?', a: 'Strong evidence includes recent comparable sales data, an independent appraisal, photos of property condition issues, documentation of errors in the assessment record, and any other factors affecting market value.' }],
  'Annual Savings = (Current Assessment - Target Assessment) x Tax Rate; Net Savings = Annual Savings - Appeal Cost',
  ['mill-rate-calculator', 'tax-refund-calculator']
);

// #90 Employer Payroll Tax Calculator
add('employer-payroll-tax-calculator', 'Employer Payroll Tax Calculator',
  'Calculate the total employer-side payroll taxes including FICA, FUTA, and state unemployment for an employee.',
  'Finance', 'finance', '$',
  ['employer payroll tax', 'employer fica', 'employer tax cost per employee'],
  [
    '{ name: "annualSalary", label: "Employee Annual Salary", type: "number", prefix: "$", min: 10000, max: 1000000, step: 1000, defaultValue: 60000 }',
    '{ name: "stateRate", label: "State Unemployment Rate (SUTA)", type: "number", suffix: "%", min: 0.5, max: 10, step: 0.1, defaultValue: 2.7 }',
    '{ name: "sutaWageBase", label: "State Unemployment Wage Base", type: "number", prefix: "$", min: 7000, max: 60000, step: 1000, defaultValue: 10000 }',
  ],
  `(inputs) => {
      const salary = inputs.annualSalary as number;
      const stateRate = inputs.stateRate as number;
      const sutaBase = inputs.sutaWageBase as number;
      if (!salary || salary <= 0) return null;
      const ssWageBase = 168600;
      const ssTax = Math.min(salary, ssWageBase) * 0.062;
      const medicareTax = salary * 0.0145;
      const futaTaxable = Math.min(salary, 7000);
      const futaTax = futaTaxable * 0.006;
      const sutaTax = Math.min(salary, sutaBase || 10000) * ((stateRate || 2.7) / 100);
      const totalEmployerTax = ssTax + medicareTax + futaTax + sutaTax;
      const costPercentage = (totalEmployerTax / salary) * 100;
      const totalCostOfEmployee = salary + totalEmployerTax;
      return {
        primary: { label: "Total Employer Payroll Tax", value: "$" + formatNumber(Math.round(totalEmployerTax)) },
        details: [
          { label: "Social Security (6.2%)", value: "$" + formatNumber(Math.round(ssTax)) },
          { label: "Medicare (1.45%)", value: "$" + formatNumber(Math.round(medicareTax)) },
          { label: "FUTA + SUTA", value: "$" + formatNumber(Math.round(futaTax + sutaTax)) },
        ],
      };
    }`,
  [{ q: 'What payroll taxes does an employer pay?', a: 'Employers pay 6.2 percent Social Security tax (up to the wage base), 1.45 percent Medicare tax, 0.6 percent FUTA (federal unemployment) on the first $7,000, and state unemployment (SUTA) at rates that vary by state and employer history.' },
   { q: 'What is the Social Security wage base?', a: 'The Social Security wage base is the maximum amount of earnings subject to Social Security tax. For 2024, the wage base is $168,600. Earnings above this amount are not subject to the 6.2 percent Social Security tax.' }],
  'Employer Tax = Social Security (6.2% up to wage base) + Medicare (1.45%) + FUTA (0.6% on $7,000) + SUTA',
  ['w4-calculator', 'cost-per-hire-calculator']
);

// #91 Appliance Lifespan Calculator
add('appliance-lifespan-calculator', 'Appliance Lifespan Calculator',
  'Estimate the remaining useful life of a household appliance based on type, age, and usage level.',
  'Everyday', 'everyday', '~',
  ['appliance lifespan', 'how long do appliances last', 'appliance life expectancy'],
  [
    '{ name: "applianceType", label: "Appliance Type", type: "select", options: [{value:"washer",label:"Washing Machine"},{value:"dryer",label:"Dryer"},{value:"fridge",label:"Refrigerator"},{value:"dishwasher",label:"Dishwasher"},{value:"oven",label:"Oven / Range"},{value:"hvac",label:"HVAC System"}], defaultValue: "washer" }',
    '{ name: "ageYears", label: "Current Age", type: "number", suffix: "years", min: 0, max: 30, defaultValue: 5 }',
    '{ name: "usageLevel", label: "Usage Level", type: "select", options: [{value:"light",label:"Light (below average)"},{value:"normal",label:"Normal"},{value:"heavy",label:"Heavy (above average)"}], defaultValue: "normal" }',
  ],
  `(inputs) => {
      const type = inputs.applianceType as string;
      const age = inputs.ageYears as number;
      const usage = inputs.usageLevel as string;
      if (age === undefined || age === null) return null;
      const lifespans: Record<string, number> = { washer: 11, dryer: 13, fridge: 15, dishwasher: 10, oven: 15, hvac: 15 };
      const baseLife = lifespans[type] || 12;
      const usageMod: Record<string, number> = { light: 1.2, normal: 1.0, heavy: 0.75 };
      const adjustedLife = baseLife * (usageMod[usage] || 1.0);
      const remaining = Math.max(0, adjustedLife - age);
      const percentUsed = Math.min(100, (age / adjustedLife) * 100);
      const status = remaining <= 1 ? "Near end of life - plan for replacement" : remaining <= 3 ? "Consider budgeting for replacement soon" : "Good remaining life";
      return {
        primary: { label: "Estimated Remaining Life", value: formatNumber(Math.round(remaining * 10) / 10) + " years" },
        details: [
          { label: "Expected Total Lifespan", value: formatNumber(Math.round(adjustedLife * 10) / 10) + " years" },
          { label: "Life Used", value: formatNumber(Math.round(percentUsed)) + "%" },
          { label: "Status", value: status },
        ],
      };
    }`,
  [{ q: 'What is the average lifespan of major household appliances?', a: 'Refrigerators and ovens typically last 13 to 15 years, washing machines about 10 to 12 years, dryers 12 to 14 years, and dishwashers 9 to 11 years. Actual lifespan depends on usage, maintenance, and build quality.' },
   { q: 'How can I extend the life of my appliances?', a: 'Regular maintenance such as cleaning filters, checking seals, descaling, and avoiding overloading can significantly extend appliance life. Following manufacturer maintenance schedules is the most effective approach.' }],
  'Remaining Life = (Base Lifespan x Usage Modifier) - Current Age',
  ['repair-vs-replace-calculator', 'home-maintenance-budget-calculator']
);

// #92 Home Maintenance Budget Calculator
add('home-maintenance-budget-calculator', 'Home Maintenance Budget Calculator',
  'Calculate the recommended annual home maintenance budget based on home value, age, and condition.',
  'Finance', 'finance', '$',
  ['home maintenance budget', 'home repair budget', 'annual home maintenance cost'],
  [
    '{ name: "homeValue", label: "Current Home Value", type: "number", prefix: "$", min: 50000, max: 5000000, step: 10000, defaultValue: 350000 }',
    '{ name: "homeAge", label: "Home Age", type: "number", suffix: "years", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "condition", label: "Overall Condition", type: "select", options: [{value:"excellent",label:"Excellent"},{value:"good",label:"Good"},{value:"fair",label:"Fair"},{value:"poor",label:"Poor"}], defaultValue: "good" }',
    '{ name: "squareFeet", label: "Square Footage", type: "number", suffix: "sq ft", min: 500, max: 10000, step: 100, defaultValue: 2000 }',
  ],
  `(inputs) => {
      const value = inputs.homeValue as number;
      const age = inputs.homeAge as number;
      const condition = inputs.condition as string;
      const sqft = inputs.squareFeet as number;
      if (!value || value <= 0) return null;
      let baseRate = 0.01;
      if (age > 30) baseRate = 0.02;
      else if (age > 15) baseRate = 0.015;
      else if (age > 5) baseRate = 0.01;
      else baseRate = 0.005;
      const conditionMod: Record<string, number> = { excellent: 0.7, good: 1.0, fair: 1.3, poor: 1.6 };
      const modifier = conditionMod[condition] || 1.0;
      const annualBudget = value * baseRate * modifier;
      const sqftCost = sqft > 0 ? annualBudget / sqft : 0;
      const monthlyReserve = annualBudget / 12;
      return {
        primary: { label: "Recommended Annual Budget", value: "$" + formatNumber(Math.round(annualBudget)) },
        details: [
          { label: "Monthly Reserve", value: "$" + formatNumber(Math.round(monthlyReserve)) },
          { label: "Cost Per Square Foot", value: "$" + formatNumber(Math.round(sqftCost * 100) / 100) },
          { label: "Percentage of Home Value", value: formatNumber(Math.round(baseRate * modifier * 10000) / 100) + "%" },
        ],
      };
    }`,
  [{ q: 'How much should I budget for home maintenance?', a: 'The general rule is 1 to 2 percent of the home value per year. Older homes and those in poor condition may require 2 to 4 percent. A $350,000 home should budget $3,500 to $7,000 annually.' },
   { q: 'What are the most expensive home maintenance items?', a: 'The most costly items include roof replacement ($5,000 to $15,000), HVAC replacement ($4,000 to $12,000), foundation repairs ($2,000 to $10,000), and siding replacement ($5,000 to $15,000).' }],
  'Annual Budget = Home Value x Base Rate (by age) x Condition Modifier',
  ['repair-vs-replace-calculator', 'appliance-lifespan-calculator']
);

// #93 Repair vs Replace Calculator
add('repair-vs-replace-calculator', 'Repair vs Replace Calculator',
  'Determine whether it is more cost-effective to repair an existing item or replace it with a new one.',
  'Everyday', 'everyday', '~',
  ['repair or replace', 'fix or buy new', 'repair vs replacement cost'],
  [
    '{ name: "repairCost", label: "Estimated Repair Cost", type: "number", prefix: "$", min: 10, max: 50000, step: 25, defaultValue: 350 }',
    '{ name: "replacementCost", label: "Replacement Cost (New)", type: "number", prefix: "$", min: 50, max: 100000, step: 50, defaultValue: 800 }',
    '{ name: "currentAge", label: "Current Item Age", type: "number", suffix: "years", min: 0, max: 30, defaultValue: 7 }',
    '{ name: "expectedLifespan", label: "Expected Total Lifespan", type: "number", suffix: "years", min: 1, max: 30, defaultValue: 12 }',
  ],
  `(inputs) => {
      const repair = inputs.repairCost as number;
      const replace = inputs.replacementCost as number;
      const age = inputs.currentAge as number;
      const lifespan = inputs.expectedLifespan as number;
      if (!repair || !replace || !lifespan || replace <= 0) return null;
      const remainingLife = Math.max(0.5, lifespan - age);
      const repairCostPerYear = repair / (remainingLife * 0.5);
      const replaceCostPerYear = replace / lifespan;
      const fiftyPercentRule = repair > replace * 0.5;
      const recommendation = fiftyPercentRule ? "Replace" : repairCostPerYear > replaceCostPerYear ? "Replace" : "Repair";
      const savings = recommendation === "Repair" ? replace - repair : repair - replace;
      return {
        primary: { label: "Recommendation", value: recommendation },
        details: [
          { label: "Repair Cost Per Remaining Year", value: "$" + formatNumber(Math.round(repairCostPerYear)) },
          { label: "Replacement Cost Per Year (new)", value: "$" + formatNumber(Math.round(replaceCostPerYear)) },
          { label: "Immediate Savings by " + (recommendation === "Repair" ? "Repairing" : "Not Repairing"), value: "$" + formatNumber(Math.abs(Math.round(savings))) },
        ],
      };
    }`,
  [{ q: 'What is the 50 percent rule for repair vs replace?', a: 'The 50 percent rule suggests that if the repair cost exceeds 50 percent of the replacement cost, it is generally better to replace the item. This rule works well for appliances and vehicles nearing the end of their expected lifespan.' },
   { q: 'What other factors should I consider besides cost?', a: 'Consider energy efficiency improvements in newer models, warranty coverage on a new purchase, environmental impact, frequency of recent repairs, and whether the item meets current needs and safety standards.' }],
  'Repair Cost Per Year = Repair Cost / Remaining Life; Replace Cost Per Year = New Cost / Full Lifespan; 50% Rule check',
  ['appliance-lifespan-calculator', 'home-maintenance-budget-calculator']
);

// #94 Streaming Comparison Calculator
add('streaming-comparison-calculator', 'Streaming Comparison Calculator',
  'Compare the annual cost of streaming services and calculate total entertainment spending across platforms.',
  'Everyday', 'everyday', '~',
  ['streaming cost comparison', 'streaming service calculator', 'entertainment subscription cost'],
  [
    '{ name: "service1", label: "Primary Service Monthly Cost", type: "number", prefix: "$", min: 0, max: 50, step: 0.99, defaultValue: 15.49 }',
    '{ name: "service2", label: "Second Service Monthly Cost", type: "number", prefix: "$", min: 0, max: 50, step: 0.99, defaultValue: 13.99 }',
    '{ name: "service3", label: "Third Service Monthly Cost", type: "number", prefix: "$", min: 0, max: 50, step: 0.99, defaultValue: 9.99 }',
    '{ name: "householdMembers", label: "Household Members Using Services", type: "number", min: 1, max: 10, defaultValue: 3 }',
  ],
  `(inputs) => {
      const s1 = inputs.service1 as number;
      const s2 = inputs.service2 as number;
      const s3 = inputs.service3 as number;
      const members = inputs.householdMembers as number;
      const totalMonthly = (s1 || 0) + (s2 || 0) + (s3 || 0);
      if (totalMonthly <= 0) return null;
      const totalAnnual = totalMonthly * 12;
      const perPerson = members > 0 ? totalMonthly / members : totalMonthly;
      const perPersonAnnual = perPerson * 12;
      const serviceCount = (s1 > 0 ? 1 : 0) + (s2 > 0 ? 1 : 0) + (s3 > 0 ? 1 : 0);
      return {
        primary: { label: "Total Annual Cost", value: "$" + formatNumber(Math.round(totalAnnual * 100) / 100) },
        details: [
          { label: "Total Monthly Cost", value: "$" + formatNumber(Math.round(totalMonthly * 100) / 100) },
          { label: "Cost Per Person Per Month", value: "$" + formatNumber(Math.round(perPerson * 100) / 100) },
          { label: "Active Services", value: formatNumber(serviceCount) },
        ],
      };
    }`,
  [{ q: 'How much does the average household spend on streaming?', a: 'The average American household spends approximately $50 to $75 per month on streaming services, subscribing to 3 to 5 services. This totals $600 to $900 per year on streaming entertainment alone.' },
   { q: 'How can I reduce streaming costs?', a: 'Consider rotating subscriptions monthly instead of maintaining all at once, sharing eligible family plans, choosing ad-supported tiers, and canceling services you use less than once per week.' }],
  'Total Annual Cost = (Service 1 + Service 2 + Service 3) x 12; Per Person = Total / Household Members',
  ['meal-kit-comparison-calculator', 'hourly-rate-calculator']
);

// #95 Meal Kit Comparison Calculator
add('meal-kit-comparison-calculator', 'Meal Kit Comparison Calculator',
  'Compare the cost per serving of meal kit delivery services against grocery shopping for home cooking.',
  'Everyday', 'everyday', '~',
  ['meal kit cost', 'meal kit comparison', 'meal kit vs grocery cost'],
  [
    '{ name: "mealKitPerServing", label: "Meal Kit Cost Per Serving", type: "number", prefix: "$", min: 2, max: 25, step: 0.50, defaultValue: 9.99 }',
    '{ name: "servingsPerWeek", label: "Servings Per Week", type: "number", min: 2, max: 30, defaultValue: 8 }',
    '{ name: "groceryCostPerServing", label: "Grocery Cost Per Serving", type: "number", prefix: "$", min: 1, max: 15, step: 0.50, defaultValue: 4.50 }',
    '{ name: "shippingPerWeek", label: "Weekly Shipping Cost", type: "number", prefix: "$", min: 0, max: 20, step: 1, defaultValue: 0 }',
  ],
  `(inputs) => {
      const kitCost = inputs.mealKitPerServing as number;
      const servings = inputs.servingsPerWeek as number;
      const groceryCost = inputs.groceryCostPerServing as number;
      const shipping = inputs.shippingPerWeek as number;
      if (!kitCost || !servings || !groceryCost || servings <= 0) return null;
      const weeklyKit = kitCost * servings + (shipping || 0);
      const weeklyGrocery = groceryCost * servings;
      const weeklyDiff = weeklyKit - weeklyGrocery;
      const annualKit = weeklyKit * 52;
      const annualGrocery = weeklyGrocery * 52;
      const annualDiff = annualKit - annualGrocery;
      const premiumPercent = groceryCost > 0 ? ((kitCost - groceryCost) / groceryCost) * 100 : 0;
      return {
        primary: { label: "Annual Cost Difference", value: "$" + formatNumber(Math.round(Math.abs(annualDiff))) + (annualDiff > 0 ? " more for meal kits" : " saved with meal kits") },
        details: [
          { label: "Weekly Meal Kit Cost", value: "$" + formatNumber(Math.round(weeklyKit * 100) / 100) },
          { label: "Weekly Grocery Cost", value: "$" + formatNumber(Math.round(weeklyGrocery * 100) / 100) },
          { label: "Meal Kit Premium", value: formatNumber(Math.round(premiumPercent)) + "% over grocery" },
        ],
      };
    }`,
  [{ q: 'Are meal kits cheaper than eating out?', a: 'Meal kits typically cost $8 to $12 per serving, which is less than most restaurant meals at $15 to $25 per person. However, meal kits cost about twice as much as cooking from scratch with grocery ingredients.' },
   { q: 'What are the hidden costs of meal kits?', a: 'Beyond the per-serving price, consider shipping fees, the cost of supplemental groceries not included in the kit, potential food waste from unused portions, and the environmental cost of excess packaging.' }],
  'Annual Difference = (Meal Kit Per Serving x Servings x 52 + Shipping x 52) - (Grocery Per Serving x Servings x 52)',
  ['streaming-comparison-calculator', 'real-hourly-wage-calculator']
);

// #96 Hourly Rate Calculator
add('hourly-rate-calculator', 'Hourly Rate Calculator',
  'Calculate your effective hourly rate from a salary or determine the salary equivalent of an hourly rate.',
  'Finance', 'finance', '$',
  ['hourly rate calculator', 'salary to hourly', 'hourly wage calculator'],
  [
    '{ name: "annualSalary", label: "Annual Salary", type: "number", prefix: "$", min: 10000, max: 1000000, step: 1000, defaultValue: 65000 }',
    '{ name: "hoursPerWeek", label: "Hours Worked Per Week", type: "number", suffix: "hours", min: 10, max: 80, defaultValue: 40 }',
    '{ name: "weeksPerYear", label: "Working Weeks Per Year", type: "number", suffix: "weeks", min: 40, max: 52, defaultValue: 50 }',
  ],
  `(inputs) => {
      const salary = inputs.annualSalary as number;
      const hours = inputs.hoursPerWeek as number;
      const weeks = inputs.weeksPerYear as number;
      if (!salary || !hours || !weeks || salary <= 0 || hours <= 0 || weeks <= 0) return null;
      const totalHours = hours * weeks;
      const hourlyRate = salary / totalHours;
      const dailyRate = hourlyRate * (hours / 5);
      const monthlyRate = salary / 12;
      const weeklyRate = salary / weeks;
      return {
        primary: { label: "Hourly Rate", value: "$" + formatNumber(Math.round(hourlyRate * 100) / 100) },
        details: [
          { label: "Daily Rate", value: "$" + formatNumber(Math.round(dailyRate * 100) / 100) },
          { label: "Weekly Rate", value: "$" + formatNumber(Math.round(weeklyRate * 100) / 100) },
          { label: "Monthly Rate", value: "$" + formatNumber(Math.round(monthlyRate * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How do I convert salary to hourly rate?', a: 'Divide your annual salary by the total number of hours worked per year. For a standard full-time schedule, this is typically 2,080 hours (40 hours per week times 52 weeks). Adjust for actual vacation and time off.' },
   { q: 'What is a good hourly rate?', a: 'A good hourly rate depends on location, industry, and experience. The national median hourly wage in the United States is approximately $22 per hour. Skilled professionals and those in high-cost areas typically earn significantly more.' }],
  'Hourly Rate = Annual Salary / (Hours Per Week x Working Weeks Per Year)',
  ['real-hourly-wage-calculator', 'commission-rate-calculator']
);

// #97 Commission Rate Calculator
add('commission-rate-calculator', 'Commission Rate Calculator',
  'Calculate sales commission earnings based on revenue, commission rate, and tiered bonus thresholds.',
  'Finance', 'finance', '$',
  ['commission calculator', 'sales commission', 'commission rate calculator'],
  [
    '{ name: "salesRevenue", label: "Total Sales Revenue", type: "number", prefix: "$", min: 0, max: 10000000, step: 1000, defaultValue: 250000 }',
    '{ name: "commissionRate", label: "Base Commission Rate", type: "number", suffix: "%", min: 0.5, max: 50, step: 0.5, defaultValue: 5 }',
    '{ name: "quota", label: "Sales Quota", type: "number", prefix: "$", min: 0, max: 10000000, step: 1000, defaultValue: 200000 }',
    '{ name: "acceleratorRate", label: "Above-Quota Accelerator Rate", type: "number", suffix: "%", min: 0, max: 50, step: 0.5, defaultValue: 8 }',
  ],
  `(inputs) => {
      const revenue = inputs.salesRevenue as number;
      const rate = inputs.commissionRate as number;
      const quota = inputs.quota as number;
      const accel = inputs.acceleratorRate as number;
      if (!revenue || revenue <= 0 || !rate) return null;
      const quotaAmount = quota || 0;
      const belowQuota = Math.min(revenue, quotaAmount);
      const aboveQuota = Math.max(0, revenue - quotaAmount);
      const baseCommission = belowQuota * (rate / 100);
      const accelCommission = aboveQuota * ((accel || rate) / 100);
      const totalCommission = baseCommission + accelCommission;
      const quotaAttainment = quotaAmount > 0 ? (revenue / quotaAmount) * 100 : 0;
      const effectiveRate = (totalCommission / revenue) * 100;
      return {
        primary: { label: "Total Commission", value: "$" + formatNumber(Math.round(totalCommission)) },
        details: [
          { label: "Base Commission", value: "$" + formatNumber(Math.round(baseCommission)) },
          { label: "Accelerator Commission", value: "$" + formatNumber(Math.round(accelCommission)) },
          { label: "Quota Attainment", value: formatNumber(Math.round(quotaAttainment)) + "%" },
        ],
      };
    }`,
  [{ q: 'What is a typical sales commission rate?', a: 'Commission rates vary widely by industry. Software sales typically offer 5 to 10 percent, real estate 2.5 to 3 percent per side, retail 1 to 5 percent, and insurance 5 to 20 percent of the premium.' },
   { q: 'What is an accelerator in sales compensation?', a: 'An accelerator is a higher commission rate applied to sales that exceed the quota. For example, a salesperson might earn 5 percent on sales up to quota and 8 percent on all sales above quota, rewarding over-performance.' }],
  'Commission = (Sales up to Quota x Base Rate) + (Sales above Quota x Accelerator Rate)',
  ['hourly-rate-calculator', 'cost-per-hire-calculator']
);

// #98 Real Hourly Wage Calculator
add('real-hourly-wage-calculator', 'Real Hourly Wage Calculator',
  'Calculate your true hourly wage after accounting for commute time, work expenses, and unpaid preparation.',
  'Finance', 'finance', '$',
  ['real hourly wage', 'true hourly rate', 'actual wage calculator'],
  [
    '{ name: "annualSalary", label: "Annual After-Tax Income", type: "number", prefix: "$", min: 10000, max: 500000, step: 1000, defaultValue: 50000 }',
    '{ name: "weeklyHoursWorked", label: "Weekly Hours at Work", type: "number", suffix: "hours", min: 10, max: 80, defaultValue: 45 }',
    '{ name: "weeklyCommuteHours", label: "Weekly Commute Time", type: "number", suffix: "hours", min: 0, max: 30, step: 0.5, defaultValue: 5 }',
    '{ name: "monthlyWorkExpenses", label: "Monthly Work-Related Expenses", type: "number", prefix: "$", min: 0, max: 5000, step: 50, defaultValue: 400 }',
  ],
  `(inputs) => {
      const salary = inputs.annualSalary as number;
      const workHours = inputs.weeklyHoursWorked as number;
      const commuteHours = inputs.weeklyCommuteHours as number;
      const expenses = inputs.monthlyWorkExpenses as number;
      if (!salary || !workHours || salary <= 0 || workHours <= 0) return null;
      const annualExpenses = (expenses || 0) * 12;
      const netIncome = salary - annualExpenses;
      const totalWeeklyHours = workHours + (commuteHours || 0);
      const weeksPerYear = 50;
      const totalAnnualHours = totalWeeklyHours * weeksPerYear;
      const realHourlyWage = netIncome / totalAnnualHours;
      const nominalHourly = salary / (workHours * weeksPerYear);
      const reduction = ((nominalHourly - realHourlyWage) / nominalHourly) * 100;
      return {
        primary: { label: "Real Hourly Wage", value: "$" + formatNumber(Math.round(realHourlyWage * 100) / 100) },
        details: [
          { label: "Nominal Hourly Rate", value: "$" + formatNumber(Math.round(nominalHourly * 100) / 100) },
          { label: "Wage Reduction", value: formatNumber(Math.round(reduction)) + "% lower than nominal" },
          { label: "Annual Work Expenses", value: "$" + formatNumber(Math.round(annualExpenses)) },
        ],
      };
    }`,
  [{ q: 'What is a real hourly wage?', a: 'The real hourly wage is your actual take-home pay divided by all the hours dedicated to work, including commute time, preparation, and work-related errands. It reveals the true value of each hour spent on employment.' },
   { q: 'What expenses should be included in the real wage calculation?', a: 'Include commuting costs (gas, transit, parking), work clothing, meals bought at work, childcare needed for work hours, professional development costs, and any tools or equipment you pay for yourself.' }],
  'Real Hourly Wage = (After-Tax Income - Annual Work Expenses) / (Weekly Work Hours + Commute Hours) x 50 weeks',
  ['hourly-rate-calculator', 'cost-per-hire-calculator']
);

// #99 Cost Per Hire Calculator
add('cost-per-hire-calculator', 'Cost Per Hire Calculator',
  'Calculate the total cost of hiring a new employee including recruitment, onboarding, and training expenses.',
  'Finance', 'finance', '$',
  ['cost per hire', 'recruitment cost', 'hiring cost calculator'],
  [
    '{ name: "recruitingCosts", label: "Recruiting Costs (ads, agency fees)", type: "number", prefix: "$", min: 0, max: 100000, step: 500, defaultValue: 5000 }',
    '{ name: "interviewCosts", label: "Interview Costs (staff time, travel)", type: "number", prefix: "$", min: 0, max: 50000, step: 250, defaultValue: 2500 }',
    '{ name: "onboardingCosts", label: "Onboarding and Training Costs", type: "number", prefix: "$", min: 0, max: 50000, step: 500, defaultValue: 3000 }',
    '{ name: "positionSalary", label: "Annual Salary of Position", type: "number", prefix: "$", min: 20000, max: 500000, step: 1000, defaultValue: 70000 }',
  ],
  `(inputs) => {
      const recruiting = inputs.recruitingCosts as number;
      const interview = inputs.interviewCosts as number;
      const onboarding = inputs.onboardingCosts as number;
      const salary = inputs.positionSalary as number;
      if (!salary || salary <= 0) return null;
      const totalCost = (recruiting || 0) + (interview || 0) + (onboarding || 0);
      const costAsPercentOfSalary = (totalCost / salary) * 100;
      const productivityLoss = salary * 0.25;
      const totalWithProductivity = totalCost + productivityLoss;
      return {
        primary: { label: "Total Cost Per Hire", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Cost as Percent of Salary", value: formatNumber(Math.round(costAsPercentOfSalary)) + "%" },
          { label: "Estimated Productivity Loss (first 3 months)", value: "$" + formatNumber(Math.round(productivityLoss)) },
          { label: "Total Cost Including Ramp-Up", value: "$" + formatNumber(Math.round(totalWithProductivity)) },
        ],
      };
    }`,
  [{ q: 'What is the average cost per hire?', a: 'According to SHRM, the average cost per hire is approximately $4,700. However, for executive and specialized positions, the cost can reach 50 to 100 percent of the annual salary when all expenses are included.' },
   { q: 'How can I reduce cost per hire?', a: 'Reduce hiring costs by building an employee referral program, maintaining a talent pipeline, using social media recruiting, improving employer branding, and reducing time-to-fill through streamlined interview processes.' }],
  'Cost Per Hire = Recruiting Costs + Interview Costs + Onboarding Costs; Total = Cost Per Hire + Productivity Loss',
  ['employee-turnover-cost-calculator', 'employer-payroll-tax-calculator']
);

// #100 Employee Turnover Cost Calculator
add('employee-turnover-cost-calculator', 'Employee Turnover Cost Calculator',
  'Estimate the total cost of employee turnover including separation, replacement, and lost productivity expenses.',
  'Finance', 'finance', '$',
  ['employee turnover cost', 'turnover calculator', 'cost of replacing an employee'],
  [
    '{ name: "annualSalary", label: "Annual Salary of Departing Employee", type: "number", prefix: "$", min: 20000, max: 500000, step: 1000, defaultValue: 65000 }',
    '{ name: "positionLevel", label: "Position Level", type: "select", options: [{value:"entry",label:"Entry Level"},{value:"mid",label:"Mid Level"},{value:"senior",label:"Senior or Specialist"},{value:"executive",label:"Executive"}], defaultValue: "mid" }',
    '{ name: "annualTurnover", label: "Annual Turnover Rate", type: "number", suffix: "%", min: 1, max: 100, step: 1, defaultValue: 15 }',
    '{ name: "totalEmployees", label: "Total Number of Employees", type: "number", min: 1, max: 100000, defaultValue: 50 }',
  ],
  `(inputs) => {
      const salary = inputs.annualSalary as number;
      const level = inputs.positionLevel as string;
      const turnoverRate = inputs.annualTurnover as number;
      const totalEmp = inputs.totalEmployees as number;
      if (!salary || salary <= 0 || !totalEmp || totalEmp <= 0) return null;
      const costMultipliers: Record<string, number> = { entry: 0.5, mid: 1.0, senior: 1.5, executive: 2.5 };
      const multiplier = costMultipliers[level] || 1.0;
      const costPerTurnover = salary * multiplier;
      const annualDepartures = Math.round(totalEmp * ((turnoverRate || 15) / 100));
      const annualTurnoverCost = costPerTurnover * annualDepartures;
      const separationCost = salary * 0.1;
      const recruitmentCost = salary * 0.15;
      const trainingCost = salary * (multiplier * 0.2);
      const productivityCost = costPerTurnover - separationCost - recruitmentCost - trainingCost;
      return {
        primary: { label: "Cost Per Turnover", value: "$" + formatNumber(Math.round(costPerTurnover)) },
        details: [
          { label: "Expected Annual Departures", value: formatNumber(annualDepartures) + " employees" },
          { label: "Total Annual Turnover Cost", value: "$" + formatNumber(Math.round(annualTurnoverCost)) },
          { label: "Cost as Multiple of Salary", value: formatNumber(multiplier) + "x annual salary" },
        ],
      };
    }`,
  [{ q: 'How much does it cost to replace an employee?', a: 'Replacing an employee typically costs 50 to 200 percent of their annual salary. Entry-level positions cost about 50 percent, mid-level about 100 percent, and senior or specialized roles can cost 150 to 250 percent of the annual salary.' },
   { q: 'What contributes to turnover costs?', a: 'Turnover costs include separation processing, recruiting and interviewing replacements, onboarding and training, lost productivity during the vacancy and ramp-up period, reduced morale, and potential loss of institutional knowledge.' }],
  'Turnover Cost = Annual Salary x Position Level Multiplier; Annual Total = Cost Per Turnover x (Employees x Turnover Rate)',
  ['cost-per-hire-calculator', 'employer-payroll-tax-calculator']
);
