// #61 Biological Age
add('biological-age-calculator', 'Biological Age Calculator',
  'Estimate your biological age versus your chronological age based on lifestyle factors.',
  'Health', 'health', 'H',
  ['biological age', 'real age calculator', 'body age test'],
  [
    '{ name: "age", label: "Chronological Age", type: "number", suffix: "years", min: 18, max: 100, defaultValue: 35 }',
    '{ name: "exercise", label: "Exercise (hours per week)", type: "number", suffix: "hrs", min: 0, max: 40, defaultValue: 3 }',
    '{ name: "sleep", label: "Average Sleep per Night", type: "number", suffix: "hours", min: 3, max: 12, defaultValue: 7 }',
    '{ name: "smoking", label: "Smoking Status", type: "select", options: [{value:"none",label:"Non-smoker"},{value:"former",label:"Former Smoker"},{value:"current",label:"Current Smoker"}], defaultValue: "none" }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const exercise = inputs.exercise as number;
      const sleep = inputs.sleep as number;
      const smoking = inputs.smoking as string;
      if (!age || age <= 0) return null;
      let bioAge = age;
      if (exercise >= 5) bioAge -= 3;
      else if (exercise >= 3) bioAge -= 1.5;
      else if (exercise < 1) bioAge += 2;
      if (sleep >= 7 && sleep <= 9) bioAge -= 1;
      else if (sleep < 6) bioAge += 3;
      else if (sleep > 9) bioAge += 1;
      const smokeMod: Record<string, number> = { none: 0, former: 2, current: 5 };
      bioAge += smokeMod[smoking] || 0;
      const diff = bioAge - age;
      const status = diff <= -2 ? "Younger than your age" : diff >= 2 ? "Older than your age" : "About your age";
      return {
        primary: { label: "Estimated Biological Age", value: formatNumber(Math.round(bioAge)) + " years" },
        details: [
          { label: "Chronological Age", value: formatNumber(age) + " years" },
          { label: "Difference", value: (diff > 0 ? "+" : "") + formatNumber(Math.round(diff * 10) / 10) + " years" },
          { label: "Assessment", value: status },
        ],
      };
    }`,
  [{ q: 'What is biological age?', a: 'Biological age is an estimate of how old your body functions compared to your actual chronological age, based on lifestyle and health factors.' },
   { q: 'Can you reverse biological aging?', a: 'Yes, improvements in exercise, sleep, diet, and stress management can help reduce your biological age over time.' }],
  'Biological Age = Chronological Age + Exercise Modifier + Sleep Modifier + Smoking Modifier',
  ['bmi-calculator', 'body-fat-calculator']
);

// #62 Sleep Debt
add('sleep-debt-calculator', 'Sleep Debt Calculator',
  'Calculate your accumulated sleep deficit over a week based on your actual versus recommended sleep.',
  'Health', 'health', 'H',
  ['sleep debt', 'sleep deficit calculator', 'sleep deprivation calculator'],
  [
    '{ name: "idealSleep", label: "Ideal Sleep per Night", type: "number", suffix: "hours", min: 5, max: 12, defaultValue: 8 }',
    '{ name: "actualSleep", label: "Actual Sleep per Night", type: "number", suffix: "hours", min: 1, max: 16, defaultValue: 6 }',
    '{ name: "days", label: "Number of Days", type: "number", suffix: "days", min: 1, max: 30, defaultValue: 7 }',
  ],
  `(inputs) => {
      const ideal = inputs.idealSleep as number;
      const actual = inputs.actualSleep as number;
      const days = inputs.days as number;
      if (!ideal || !actual || !days || ideal <= 0 || actual <= 0 || days <= 0) return null;
      const dailyDebt = ideal - actual;
      const totalDebt = dailyDebt * days;
      const recoveryDays = totalDebt > 0 ? Math.ceil(totalDebt / 2) : 0;
      const severity = totalDebt <= 0 ? "No debt" : totalDebt <= 5 ? "Mild" : totalDebt <= 10 ? "Moderate" : "Severe";
      return {
        primary: { label: "Total Sleep Debt", value: formatNumber(Math.max(0, totalDebt)) + " hours" },
        details: [
          { label: "Daily Deficit", value: formatNumber(Math.max(0, dailyDebt)) + " hours" },
          { label: "Severity", value: severity },
          { label: "Estimated Recovery Days", value: formatNumber(recoveryDays) + " days (sleeping 2 extra hrs)" },
        ],
      };
    }`,
  [{ q: 'What is sleep debt?', a: 'Sleep debt is the cumulative effect of not getting enough sleep over multiple nights, leading to fatigue and decreased cognitive performance.' },
   { q: 'How do you pay back sleep debt?', a: 'You can recover by gradually adding 1 to 2 extra hours of sleep per night. It is not recommended to try to sleep excessively in one session.' }],
  'Sleep Debt = (Ideal Sleep - Actual Sleep) x Number of Days',
  ['biological-age-calculator', 'calorie-calculator']
);

// #63 Hydration
add('hydration-calculator', 'Hydration Calculator',
  'Determine your recommended daily water intake based on weight, activity level, and climate.',
  'Health', 'health', 'H',
  ['hydration calculator', 'water intake calculator', 'daily water needs'],
  [
    '{ name: "weight", label: "Body Weight", type: "number", suffix: "lbs", min: 50, max: 500, defaultValue: 160 }',
    '{ name: "activity", label: "Activity Level", type: "select", options: [{value:"sedentary",label:"Sedentary"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"intense",label:"Very Active"}], defaultValue: "moderate" }',
    '{ name: "climate", label: "Climate", type: "select", options: [{value:"cool",label:"Cool"},{value:"temperate",label:"Temperate"},{value:"hot",label:"Hot and Humid"}], defaultValue: "temperate" }',
  ],
  `(inputs) => {
      const weight = inputs.weight as number;
      const activity = inputs.activity as string;
      const climate = inputs.climate as string;
      if (!weight || weight <= 0) return null;
      let baseOz = weight * 0.5;
      const activityMod: Record<string, number> = { sedentary: 1.0, moderate: 1.2, active: 1.4, intense: 1.6 };
      const climateMod: Record<string, number> = { cool: 1.0, temperate: 1.1, hot: 1.3 };
      const totalOz = baseOz * (activityMod[activity] || 1.2) * (climateMod[climate] || 1.1);
      const cups = totalOz / 8;
      const liters = totalOz * 0.0295735;
      return {
        primary: { label: "Daily Water Intake", value: formatNumber(Math.round(totalOz)) + " oz" },
        details: [
          { label: "In Cups", value: formatNumber(Math.round(cups * 10) / 10) + " cups" },
          { label: "In Liters", value: formatNumber(Math.round(liters * 10) / 10) + " L" },
          { label: "Glasses (8 oz each)", value: formatNumber(Math.round(cups)) },
        ],
      };
    }`,
  [{ q: 'How much water should I drink per day?', a: 'A general guideline is half your body weight in ounces. For example, a 160 lb person should aim for about 80 oz per day, adjusted for activity and climate.' },
   { q: 'Does coffee count toward water intake?', a: 'Coffee does contribute to hydration but it has a mild diuretic effect. It is best to count it as about 50 to 75 percent of its volume toward your daily goal.' }],
  'Base Intake (oz) = Body Weight (lbs) x 0.5 x Activity Multiplier x Climate Multiplier',
  ['calorie-calculator', 'bmi-calculator']
);

// #64 Screen Time Impact
add('screen-time-impact-calculator', 'Screen Time Impact Calculator',
  'Assess the potential health effects of your daily screen time across devices.',
  'Health', 'health', 'H',
  ['screen time health', 'screen time calculator', 'digital wellness'],
  [
    '{ name: "phone", label: "Phone Screen Time", type: "number", suffix: "hrs/day", min: 0, max: 16, defaultValue: 3 }',
    '{ name: "computer", label: "Computer Screen Time", type: "number", suffix: "hrs/day", min: 0, max: 16, defaultValue: 4 }',
    '{ name: "tv", label: "TV Screen Time", type: "number", suffix: "hrs/day", min: 0, max: 16, defaultValue: 2 }',
    '{ name: "breaks", label: "Break Frequency", type: "select", options: [{value:"none",label:"Rarely Take Breaks"},{value:"some",label:"Every 1 to 2 Hours"},{value:"frequent",label:"Every 20 to 30 Minutes"}], defaultValue: "some" }',
  ],
  `(inputs) => {
      const phone = inputs.phone as number;
      const computer = inputs.computer as number;
      const tv = inputs.tv as number;
      const breaks = inputs.breaks as string;
      const total = (phone || 0) + (computer || 0) + (tv || 0);
      if (total <= 0) return null;
      let eyeStrainScore = total * 10;
      const breakMod: Record<string, number> = { none: 1.3, some: 1.0, frequent: 0.7 };
      eyeStrainScore *= breakMod[breaks] || 1.0;
      eyeStrainScore = Math.min(100, eyeStrainScore);
      const weeklyHrs = total * 7;
      const yearlyHrs = total * 365;
      const risk = eyeStrainScore < 30 ? "Low" : eyeStrainScore < 60 ? "Moderate" : "High";
      return {
        primary: { label: "Daily Screen Time", value: formatNumber(total) + " hours" },
        details: [
          { label: "Weekly Screen Time", value: formatNumber(weeklyHrs) + " hours" },
          { label: "Yearly Screen Time", value: formatNumber(Math.round(yearlyHrs)) + " hours" },
          { label: "Eye Strain Risk Score", value: formatNumber(Math.round(eyeStrainScore)) + " / 100 (" + risk + ")" },
        ],
      };
    }`,
  [{ q: 'How much screen time is too much?', a: 'For adults, more than 6 to 8 hours of non-work screen time per day is associated with negative health effects including eye strain, poor sleep, and sedentary lifestyle risks.' },
   { q: 'What is the 20-20-20 rule?', a: 'Every 20 minutes, look at something 20 feet away for 20 seconds. This helps reduce digital eye strain significantly.' }],
  'Eye Strain Score = Total Hours x 10 x Break Modifier (capped at 100)',
  ['biological-age-calculator', 'sleep-debt-calculator']
);

// #65 Posture Score
add('posture-score-calculator', 'Posture Assessment Calculator',
  'Evaluate your posture health based on daily habits and ergonomic factors.',
  'Health', 'health', 'H',
  ['posture score', 'posture assessment', 'ergonomic calculator'],
  [
    '{ name: "sittingHrs", label: "Sitting Hours per Day", type: "number", suffix: "hours", min: 0, max: 18, defaultValue: 8 }',
    '{ name: "exercise", label: "Stretching or Exercise", type: "select", options: [{value:"none",label:"None"},{value:"some",label:"2 to 3 times per week"},{value:"daily",label:"Daily"}], defaultValue: "some" }',
    '{ name: "ergonomic", label: "Ergonomic Setup", type: "select", options: [{value:"poor",label:"Poor (no adjustments)"},{value:"fair",label:"Fair (some adjustments)"},{value:"good",label:"Good (proper setup)"}], defaultValue: "fair" }',
  ],
  `(inputs) => {
      const sitting = inputs.sittingHrs as number;
      const exercise = inputs.exercise as string;
      const ergo = inputs.ergonomic as string;
      if (sitting === undefined || sitting < 0) return null;
      let score = 100;
      if (sitting > 10) score -= 30;
      else if (sitting > 6) score -= 15;
      else if (sitting > 3) score -= 5;
      const exerciseMod: Record<string, number> = { none: -20, some: 0, daily: 15 };
      score += exerciseMod[exercise] || 0;
      const ergoMod: Record<string, number> = { poor: -25, fair: -5, good: 10 };
      score += ergoMod[ergo] || 0;
      score = Math.max(0, Math.min(100, score));
      const rating = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Poor";
      return {
        primary: { label: "Posture Score", value: formatNumber(score) + " / 100" },
        details: [
          { label: "Rating", value: rating },
          { label: "Sitting Impact", value: sitting > 6 ? "High (consider standing desk)" : "Manageable" },
          { label: "Recommendation", value: score < 60 ? "Consider ergonomic improvements and daily stretching" : "Maintain current habits" },
        ],
      };
    }`,
  [{ q: 'How does sitting affect posture?', a: 'Prolonged sitting weakens core muscles and tightens hip flexors, leading to forward head posture and lower back pain over time.' },
   { q: 'What is a good posture score?', a: 'A score of 80 or above indicates excellent posture habits. Below 40 suggests significant improvements are needed in ergonomics and exercise.' }],
  'Posture Score = 100 - Sitting Penalty + Exercise Modifier + Ergonomic Modifier',
  ['screen-time-impact-calculator', 'biological-age-calculator']
);

// #66 Hearing Loss Risk
add('hearing-loss-risk-calculator', 'Hearing Loss Risk Calculator',
  'Assess your risk of noise-induced hearing loss based on daily noise exposure levels.',
  'Health', 'health', 'H',
  ['hearing loss risk', 'noise exposure calculator', 'hearing damage calculator'],
  [
    '{ name: "noiseLevel", label: "Average Noise Level", type: "number", suffix: "dB", min: 40, max: 140, defaultValue: 75 }',
    '{ name: "duration", label: "Exposure Duration", type: "number", suffix: "hours/day", min: 0.5, max: 24, defaultValue: 8 }',
    '{ name: "protection", label: "Hearing Protection", type: "select", options: [{value:"none",label:"None"},{value:"foam",label:"Foam Earplugs (-20 dB)"},{value:"muff",label:"Earmuffs (-25 dB)"},{value:"custom",label:"Custom Molded (-30 dB)"}], defaultValue: "none" }',
  ],
  `(inputs) => {
      const noise = inputs.noiseLevel as number;
      const duration = inputs.duration as number;
      const protection = inputs.protection as string;
      if (!noise || !duration) return null;
      const protectionDb: Record<string, number> = { none: 0, foam: 20, muff: 25, custom: 30 };
      const effectiveNoise = noise - (protectionDb[protection] || 0);
      const safeLimit = 85;
      const maxHours = effectiveNoise <= safeLimit ? 24 : 8 / Math.pow(2, (effectiveNoise - safeLimit) / 3);
      const exposureRatio = duration / maxHours;
      const risk = exposureRatio < 0.5 ? "Low" : exposureRatio < 1.0 ? "Moderate" : exposureRatio < 2.0 ? "High" : "Very High";
      return {
        primary: { label: "Hearing Risk Level", value: risk },
        details: [
          { label: "Effective Noise Level", value: formatNumber(Math.max(0, effectiveNoise)) + " dB" },
          { label: "Safe Exposure Limit", value: formatNumber(Math.round(maxHours * 100) / 100) + " hours" },
          { label: "Your Exposure Ratio", value: formatNumber(Math.round(exposureRatio * 100) / 100) + "x safe limit" },
        ],
      };
    }`,
  [{ q: 'At what decibel level does hearing damage occur?', a: 'Sustained exposure above 85 dB can cause hearing damage. The safe duration halves for every 3 dB increase above this threshold.' },
   { q: 'How effective is hearing protection?', a: 'Foam earplugs reduce noise by about 20 dB, earmuffs by 25 dB, and custom-molded plugs by up to 30 dB when properly fitted.' }],
  'Safe Hours = 8 / 2^((Effective dB - 85) / 3); Exposure Ratio = Duration / Safe Hours',
  ['decibel-addition-calculator', 'sound-wavelength-calculator']
);

// #67 Sun Exposure
add('sun-exposure-calculator', 'Sun Exposure Calculator',
  'Calculate safe sun exposure time based on your skin type, UV index, and sunscreen usage.',
  'Health', 'health', 'H',
  ['sun exposure time', 'safe sun calculator', 'UV exposure calculator'],
  [
    '{ name: "skinType", label: "Skin Type (Fitzpatrick)", type: "select", options: [{value:"1",label:"Type I - Very Fair"},{value:"2",label:"Type II - Fair"},{value:"3",label:"Type III - Medium"},{value:"4",label:"Type IV - Olive"},{value:"5",label:"Type V - Brown"},{value:"6",label:"Type VI - Dark"}], defaultValue: "2" }',
    '{ name: "uvIndex", label: "UV Index", type: "number", suffix: "", min: 1, max: 15, defaultValue: 6 }',
    '{ name: "spf", label: "Sunscreen SPF", type: "number", suffix: "", min: 0, max: 100, defaultValue: 30 }',
  ],
  `(inputs) => {
      const skinType = parseInt(inputs.skinType as string) || 2;
      const uvIndex = inputs.uvIndex as number;
      const spf = inputs.spf as number;
      if (!uvIndex || uvIndex <= 0) return null;
      const baseMins: Record<number, number> = { 1: 67, 2: 100, 3: 200, 4: 300, 5: 400, 6: 500 };
      const baseTime = (baseMins[skinType] || 100) / uvIndex;
      const protectedTime = spf > 0 ? baseTime * spf * 0.6 : baseTime;
      const vitDMins = Math.min(baseTime * 0.5, 30);
      return {
        primary: { label: "Safe Unprotected Time", value: formatNumber(Math.round(baseTime)) + " minutes" },
        details: [
          { label: "With SPF " + spf, value: formatNumber(Math.round(protectedTime)) + " minutes" },
          { label: "Vitamin D Exposure", value: formatNumber(Math.round(vitDMins)) + " minutes recommended" },
          { label: "UV Risk Level", value: uvIndex <= 2 ? "Low" : uvIndex <= 5 ? "Moderate" : uvIndex <= 7 ? "High" : "Very High" },
        ],
      };
    }`,
  [{ q: 'How long can I stay in the sun without burning?', a: 'It depends on your skin type and UV index. Fair skin (Type I) may burn in as little as 5 to 10 minutes at high UV, while darker skin types can tolerate much longer.' },
   { q: 'Does sunscreen fully protect from UV?', a: 'Sunscreen extends your safe exposure time but does not block 100 percent of UV rays. SPF 30 blocks about 97 percent of UVB rays when applied correctly.' }],
  'Safe Time = Base Minutes for Skin Type / UV Index; Protected Time = Safe Time x SPF x 0.6',
  ['biological-age-calculator', 'hydration-calculator']
);

// #68 Blood Donation Eligibility
add('blood-donation-eligibility-calculator', 'Blood Donation Eligibility Calculator',
  'Check if you meet the basic eligibility requirements for blood donation.',
  'Health', 'health', 'H',
  ['blood donation eligibility', 'can I donate blood', 'blood donor calculator'],
  [
    '{ name: "age", label: "Age", type: "number", suffix: "years", min: 10, max: 100, defaultValue: 30 }',
    '{ name: "weight", label: "Weight", type: "number", suffix: "lbs", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "lastDonation", label: "Days Since Last Donation", type: "number", suffix: "days", min: 0, max: 3650, defaultValue: 60 }',
    '{ name: "health", label: "General Health", type: "select", options: [{value:"good",label:"Good Health"},{value:"cold",label:"Currently Ill"},{value:"chronic",label:"Chronic Condition"}], defaultValue: "good" }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const weight = inputs.weight as number;
      const lastDon = inputs.lastDonation as number;
      const health = inputs.health as string;
      if (!age || !weight) return null;
      const issues: string[] = [];
      let eligible = true;
      if (age < 17) { issues.push("Must be at least 17 years old"); eligible = false; }
      if (age > 76) { issues.push("Age may require physician approval"); }
      if (weight < 110) { issues.push("Must weigh at least 110 lbs"); eligible = false; }
      if (lastDon < 56) { issues.push("Must wait 56 days between whole blood donations"); eligible = false; }
      if (health === "cold") { issues.push("Must be in good health on donation day"); eligible = false; }
      if (health === "chronic") { issues.push("Chronic conditions require physician clearance"); }
      return {
        primary: { label: "Eligibility Status", value: eligible ? "Likely Eligible" : "Currently Not Eligible" },
        details: [
          { label: "Age Check", value: age >= 17 ? "Pass" : "Fail" },
          { label: "Weight Check", value: weight >= 110 ? "Pass" : "Fail" },
          { label: "Notes", value: issues.length > 0 ? issues.join("; ") : "All basic checks passed" },
        ],
      };
    }`,
  [{ q: 'How often can I donate blood?', a: 'You can donate whole blood every 56 days (8 weeks). Platelet donations can be made every 7 days, up to 24 times per year.' },
   { q: 'What are the basic requirements to donate blood?', a: 'You must be at least 17 years old, weigh at least 110 pounds, be in good general health, and not have donated in the past 56 days.' }],
  'Eligibility = Age >= 17 AND Weight >= 110 lbs AND Days Since Last >= 56 AND Good Health',
  ['bmi-calculator', 'biological-age-calculator']
);

// #69 Vaccine Schedule
add('vaccine-schedule-calculator', 'Vaccine Schedule Calculator',
  'Determine recommended vaccination timing based on age and vaccine type.',
  'Health', 'health', 'H',
  ['vaccine schedule', 'vaccination timing', 'immunization calculator'],
  [
    '{ name: "age", label: "Age", type: "number", suffix: "years", min: 0, max: 100, defaultValue: 30 }',
    '{ name: "vaccine", label: "Vaccine Type", type: "select", options: [{value:"flu",label:"Influenza (Yearly)"},{value:"tdap",label:"Tdap (Every 10 Years)"},{value:"shingles",label:"Shingles (50+)"},{value:"pneumo",label:"Pneumococcal (65+)"}], defaultValue: "flu" }',
    '{ name: "lastDose", label: "Years Since Last Dose", type: "number", suffix: "years", min: 0, max: 50, defaultValue: 1 }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const vaccine = inputs.vaccine as string;
      const lastDose = inputs.lastDose as number;
      if (!age || age < 0) return null;
      const schedules: Record<string, { interval: number; minAge: number; name: string }> = {
        flu: { interval: 1, minAge: 0, name: "Influenza" },
        tdap: { interval: 10, minAge: 11, name: "Tdap Booster" },
        shingles: { interval: 0, minAge: 50, name: "Shingles (Shingrix)" },
        pneumo: { interval: 0, minAge: 65, name: "Pneumococcal" },
      };
      const s = schedules[vaccine] || schedules.flu;
      const ageEligible = age >= s.minAge;
      const dueNow = s.interval > 0 ? lastDose >= s.interval : true;
      const nextDue = s.interval > 0 ? s.interval - lastDose : 0;
      const status = !ageEligible ? "Not yet age-eligible" : dueNow ? "Due now" : "Not yet due";
      return {
        primary: { label: s.name + " Status", value: status },
        details: [
          { label: "Age Eligible", value: ageEligible ? "Yes" : "No (minimum age " + s.minAge + ")" },
          { label: "Interval", value: s.interval > 0 ? "Every " + s.interval + " years" : "One-time series" },
          { label: "Next Due In", value: dueNow || !ageEligible ? "N/A" : formatNumber(Math.max(0, nextDue)) + " years" },
        ],
      };
    }`,
  [{ q: 'How often should I get a flu shot?', a: 'The influenza vaccine is recommended annually, ideally before flu season begins in October or November.' },
   { q: 'When should adults get the Tdap booster?', a: 'Adults should receive a Tdap booster every 10 years. The vaccine protects against tetanus, diphtheria, and pertussis.' }],
  'Status = Age >= Minimum Age AND Years Since Last >= Interval',
  ['biological-age-calculator', 'blood-donation-eligibility-calculator']
);

// #70 Allergy Severity
add('allergy-severity-calculator', 'Allergy Severity Calculator',
  'Score your allergy symptoms to assess severity and guide treatment decisions.',
  'Health', 'health', 'H',
  ['allergy severity', 'allergy score', 'allergy symptom calculator'],
  [
    '{ name: "sneezing", label: "Sneezing Frequency (per day)", type: "number", suffix: "times", min: 0, max: 100, defaultValue: 5 }',
    '{ name: "congestion", label: "Nasal Congestion Severity", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"Mild"},{value:"2",label:"Moderate"},{value:"3",label:"Severe"}], defaultValue: "1" }',
    '{ name: "eyeItch", label: "Eye Itching or Watering", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"Mild"},{value:"2",label:"Moderate"},{value:"3",label:"Severe"}], defaultValue: "1" }',
    '{ name: "impact", label: "Impact on Daily Activities", type: "select", options: [{value:"0",label:"No Impact"},{value:"1",label:"Slight"},{value:"2",label:"Moderate"},{value:"3",label:"Cannot Function Normally"}], defaultValue: "1" }',
  ],
  `(inputs) => {
      const sneezing = inputs.sneezing as number;
      const congestion = parseInt(inputs.congestion as string) || 0;
      const eyeItch = parseInt(inputs.eyeItch as string) || 0;
      const impact = parseInt(inputs.impact as string) || 0;
      const sneezingScore = sneezing <= 3 ? 1 : sneezing <= 10 ? 2 : 3;
      const total = sneezingScore + congestion + eyeItch + impact;
      const maxScore = 12;
      const pct = Math.round((total / maxScore) * 100);
      const severity = total <= 3 ? "Mild" : total <= 6 ? "Moderate" : total <= 9 ? "Severe" : "Very Severe";
      const treatment = total <= 3 ? "Over-the-counter antihistamines" : total <= 6 ? "Daily antihistamines and nasal spray" : "Consult an allergist for prescription options";
      return {
        primary: { label: "Allergy Severity", value: severity + " (" + formatNumber(total) + " / " + maxScore + ")" },
        details: [
          { label: "Severity Percentage", value: formatNumber(pct) + "%" },
          { label: "Suggested Treatment", value: treatment },
          { label: "Daily Impact Level", value: impact === 0 ? "None" : impact === 1 ? "Slight" : impact === 2 ? "Moderate" : "Significant" },
        ],
      };
    }`,
  [{ q: 'How do you measure allergy severity?', a: 'Allergy severity is measured by combining symptom scores for sneezing, congestion, eye irritation, and impact on daily activities into a composite score.' },
   { q: 'When should I see an allergist?', a: 'If your allergy symptoms score moderate or higher, especially if over-the-counter medications do not provide adequate relief, you should consult a specialist.' }],
  'Severity Score = Sneezing Score + Congestion Score + Eye Score + Impact Score (0 to 12)',
  ['biological-age-calculator', 'hydration-calculator']
);

// #71 Sound Wavelength
add('sound-wavelength-calculator', 'Sound Wavelength Calculator',
  'Convert sound frequency to wavelength in air at a given temperature.',
  'Science', 'science', 'A',
  ['sound wavelength', 'frequency to wavelength', 'acoustic wavelength'],
  [
    '{ name: "frequency", label: "Frequency", type: "number", suffix: "Hz", min: 1, max: 100000, defaultValue: 440 }',
    '{ name: "temperature", label: "Air Temperature", type: "number", suffix: "C", min: -40, max: 60, defaultValue: 20 }',
  ],
  `(inputs) => {
      const freq = inputs.frequency as number;
      const temp = inputs.temperature as number;
      if (!freq || freq <= 0) return null;
      const speedOfSound = 331.3 + 0.606 * (temp || 20);
      const wavelength = speedOfSound / freq;
      const wavelengthCm = wavelength * 100;
      const period = 1 / freq;
      return {
        primary: { label: "Wavelength", value: formatNumber(Math.round(wavelength * 10000) / 10000) + " m" },
        details: [
          { label: "Wavelength", value: formatNumber(Math.round(wavelengthCm * 100) / 100) + " cm" },
          { label: "Speed of Sound", value: formatNumber(Math.round(speedOfSound * 100) / 100) + " m/s" },
          { label: "Period", value: formatNumber(period.toFixed(6)) + " seconds" },
        ],
      };
    }`,
  [{ q: 'How is sound wavelength calculated?', a: 'Wavelength equals the speed of sound divided by frequency. The speed of sound in air is approximately 331.3 + 0.606 times the temperature in Celsius.' },
   { q: 'What is the wavelength of middle A (440 Hz)?', a: 'At 20 degrees Celsius, the wavelength of 440 Hz is approximately 0.78 meters or 78 centimeters.' }],
  'Wavelength = Speed of Sound / Frequency; Speed = 331.3 + 0.606 x Temperature',
  ['decibel-addition-calculator', 'frequency-calculator']
);

// #72 Decibel Addition
add('decibel-addition-calculator', 'Decibel Addition Calculator',
  'Combine two or more sound levels in decibels using logarithmic addition.',
  'Science', 'science', 'A',
  ['decibel addition', 'combine sound levels', 'dB calculator'],
  [
    '{ name: "db1", label: "Sound Source 1", type: "number", suffix: "dB", min: 0, max: 200, defaultValue: 70 }',
    '{ name: "db2", label: "Sound Source 2", type: "number", suffix: "dB", min: 0, max: 200, defaultValue: 70 }',
    '{ name: "db3", label: "Sound Source 3 (optional)", type: "number", suffix: "dB", min: 0, max: 200, defaultValue: 0 }',
  ],
  `(inputs) => {
      const db1 = inputs.db1 as number;
      const db2 = inputs.db2 as number;
      const db3 = inputs.db3 as number;
      if (db1 === undefined || db2 === undefined) return null;
      let sumIntensity = Math.pow(10, db1 / 10) + Math.pow(10, db2 / 10);
      if (db3 && db3 > 0) sumIntensity += Math.pow(10, db3 / 10);
      const combined = 10 * Math.log10(sumIntensity);
      const diff = combined - Math.max(db1, db2, db3 || 0);
      return {
        primary: { label: "Combined Level", value: formatNumber(Math.round(combined * 100) / 100) + " dB" },
        details: [
          { label: "Increase Over Loudest", value: "+" + formatNumber(Math.round(diff * 100) / 100) + " dB" },
          { label: "Combined Intensity", value: formatNumber(Math.round(sumIntensity)) + " (linear)" },
          { label: "Perception", value: diff >= 10 ? "Twice as loud" : diff >= 3 ? "Noticeably louder" : "Slightly louder" },
        ],
      };
    }`,
  [{ q: 'How do you add decibels together?', a: 'Decibels use a logarithmic scale, so you cannot simply add them. Instead, convert each to linear intensity, sum them, then convert back: dB_total = 10 x log10(sum of 10^(dB/10)).' },
   { q: 'How much louder is two identical sources combined?', a: 'Two identical sound sources produce a combined level 3 dB higher. A 10 dB increase is perceived as roughly twice as loud.' }],
  'Combined dB = 10 x log10(10^(dB1/10) + 10^(dB2/10) + ...)',
  ['sound-wavelength-calculator', 'hearing-loss-risk-calculator']
);

// #73 Earthquake Energy
add('earthquake-energy-calculator', 'Earthquake Energy Calculator',
  'Calculate the energy released by an earthquake from its Richter magnitude.',
  'Science', 'science', 'A',
  ['earthquake energy', 'richter scale energy', 'seismic energy calculator'],
  [
    '{ name: "magnitude", label: "Richter Magnitude", type: "number", suffix: "", min: 0, max: 10, defaultValue: 5 }',
    '{ name: "compareMag", label: "Compare With Magnitude", type: "number", suffix: "", min: 0, max: 10, defaultValue: 4 }',
  ],
  `(inputs) => {
      const mag = inputs.magnitude as number;
      const cmpMag = inputs.compareMag as number;
      if (mag === undefined || mag < 0) return null;
      const energy = Math.pow(10, 1.5 * mag + 4.8);
      const cmpEnergy = Math.pow(10, 1.5 * (cmpMag || 0) + 4.8);
      const ratio = energy / cmpEnergy;
      const tntTons = energy / 4.184e9;
      const label = mag < 3 ? "Minor" : mag < 5 ? "Light to Moderate" : mag < 7 ? "Strong" : "Major to Great";
      return {
        primary: { label: "Energy Released", value: energy.toExponential(2) + " Joules" },
        details: [
          { label: "TNT Equivalent", value: formatNumber(Math.round(tntTons * 100) / 100) + " tons" },
          { label: "Times Stronger Than M" + (cmpMag || 0), value: formatNumber(Math.round(ratio * 100) / 100) + "x" },
          { label: "Classification", value: label },
        ],
      };
    }`,
  [{ q: 'How much energy does a magnitude 5 earthquake release?', a: 'A magnitude 5 earthquake releases approximately 2 x 10^12 Joules of energy, equivalent to about 500 tons of TNT.' },
   { q: 'How much stronger is each magnitude increase?', a: 'Each whole number increase in magnitude represents roughly 31.6 times more energy released.' }],
  'Energy (Joules) = 10^(1.5 x Magnitude + 4.8)',
  ['terminal-velocity-calculator', 'escape-velocity-calculator']
);

// #74 Wind Chill
add('wind-chill-calculator', 'Wind Chill Calculator',
  'Calculate the wind chill factor from temperature and wind speed.',
  'Science', 'science', 'A',
  ['wind chill', 'wind chill factor', 'feels like temperature wind'],
  [
    '{ name: "temp", label: "Air Temperature", type: "number", suffix: "F", min: -50, max: 50, defaultValue: 30 }',
    '{ name: "wind", label: "Wind Speed", type: "number", suffix: "mph", min: 3, max: 100, defaultValue: 15 }',
  ],
  `(inputs) => {
      const temp = inputs.temp as number;
      const wind = inputs.wind as number;
      if (temp === undefined || !wind || wind < 3) return null;
      const wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(wind, 0.16) + 0.4275 * temp * Math.pow(wind, 0.16);
      const frostbiteMinutes = wc < -20 ? Math.max(5, Math.round(30 + wc)) : wc < 0 ? 30 : 0;
      const danger = wc > 20 ? "Low" : wc > 0 ? "Moderate" : wc > -20 ? "High" : "Extreme";
      return {
        primary: { label: "Wind Chill Temperature", value: formatNumber(Math.round(wc)) + " F" },
        details: [
          { label: "Feels Like Drop", value: formatNumber(Math.round(temp - wc)) + " F colder" },
          { label: "Frostbite Risk", value: danger },
          { label: "Time to Frostbite", value: frostbiteMinutes > 0 ? formatNumber(frostbiteMinutes) + " minutes" : "Low risk at this level" },
        ],
      };
    }`,
  [{ q: 'How is wind chill calculated?', a: 'The NWS wind chill formula accounts for heat loss from exposed skin caused by wind and cold. It uses air temperature and wind speed to produce a feels-like temperature.' },
   { q: 'At what wind chill is it dangerous?', a: 'Wind chill below -20 F can cause frostbite on exposed skin within 30 minutes. Below -40 F, frostbite can occur in as little as 5 minutes.' }],
  'Wind Chill = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275TV^0.16',
  ['heat-index-calculator', 'dew-point-calculator']
);

// #75 Heat Index
add('heat-index-calculator', 'Heat Index Calculator',
  'Calculate the apparent temperature from air temperature and relative humidity.',
  'Science', 'science', 'A',
  ['heat index', 'feels like temperature', 'apparent temperature humidity'],
  [
    '{ name: "temp", label: "Air Temperature", type: "number", suffix: "F", min: 80, max: 130, defaultValue: 90 }',
    '{ name: "humidity", label: "Relative Humidity", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
      const T = inputs.temp as number;
      const R = inputs.humidity as number;
      if (!T || !R) return null;
      const c1 = -42.379, c2 = 2.04901523, c3 = 10.14333127;
      const c4 = -0.22475541, c5 = -0.00683783, c6 = -0.05481717;
      const c7 = 0.00122874, c8 = 0.00085282, c9 = -0.00000199;
      const HI = c1 + c2*T + c3*R + c4*T*R + c5*T*T + c6*R*R + c7*T*T*R + c8*T*R*R + c9*T*T*R*R;
      const danger = HI < 80 ? "None" : HI < 91 ? "Caution" : HI < 104 ? "Extreme Caution" : HI < 126 ? "Danger" : "Extreme Danger";
      return {
        primary: { label: "Heat Index", value: formatNumber(Math.round(HI)) + " F" },
        details: [
          { label: "Feels Like Increase", value: "+" + formatNumber(Math.round(HI - T)) + " F over actual" },
          { label: "Danger Level", value: danger },
          { label: "Recommendation", value: HI >= 104 ? "Avoid prolonged outdoor activity" : HI >= 91 ? "Take frequent breaks and hydrate" : "Normal precautions" },
        ],
      };
    }`,
  [{ q: 'What is the heat index?', a: 'The heat index combines air temperature and relative humidity to determine how hot it actually feels to the human body, also known as the apparent temperature.' },
   { q: 'At what heat index is it dangerous?', a: 'A heat index above 104 F is considered dangerous with high risk of heat stroke. Above 126 F is classified as extreme danger.' }],
  'Heat Index = Rothfusz regression equation using temperature and relative humidity',
  ['wind-chill-calculator', 'dew-point-calculator']
);

// #76 Dew Point
add('dew-point-calculator', 'Dew Point Calculator',
  'Calculate the dew point temperature from air temperature and relative humidity.',
  'Science', 'science', 'A',
  ['dew point', 'dew point temperature', 'humidity dew point'],
  [
    '{ name: "temp", label: "Air Temperature", type: "number", suffix: "C", min: -40, max: 60, defaultValue: 25 }',
    '{ name: "humidity", label: "Relative Humidity", type: "number", suffix: "%", min: 1, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
      const T = inputs.temp as number;
      const RH = inputs.humidity as number;
      if (T === undefined || !RH || RH <= 0) return null;
      const a = 17.27;
      const b = 237.7;
      const gamma = (a * T) / (b + T) + Math.log(RH / 100);
      const dewPoint = (b * gamma) / (a - gamma);
      const dewPointF = dewPoint * 9 / 5 + 32;
      const comfort = dewPoint < 10 ? "Dry and comfortable" : dewPoint < 16 ? "Comfortable" : dewPoint < 20 ? "Slightly humid" : dewPoint < 24 ? "Humid and uncomfortable" : "Oppressive";
      return {
        primary: { label: "Dew Point", value: formatNumber(Math.round(dewPoint * 10) / 10) + " C" },
        details: [
          { label: "Dew Point (Fahrenheit)", value: formatNumber(Math.round(dewPointF * 10) / 10) + " F" },
          { label: "Comfort Level", value: comfort },
          { label: "Spread (T - Dew Point)", value: formatNumber(Math.round((T - dewPoint) * 10) / 10) + " C" },
        ],
      };
    }`,
  [{ q: 'What is the dew point?', a: 'The dew point is the temperature at which air becomes saturated and water vapor begins to condense into dew or fog. A higher dew point means more moisture in the air.' },
   { q: 'What dew point is comfortable?', a: 'A dew point below 10 C (50 F) feels dry, 10 to 16 C (50 to 60 F) is comfortable, and above 20 C (68 F) feels oppressively humid.' }],
  'Dew Point = (237.7 x gamma) / (17.27 - gamma); gamma = (17.27 x T) / (237.7 + T) + ln(RH/100)',
  ['heat-index-calculator', 'wind-chill-calculator']
);

// #77 Altitude Pressure
add('altitude-pressure-calculator', 'Altitude Pressure Calculator',
  'Calculate atmospheric pressure at a given altitude using the barometric formula.',
  'Science', 'science', 'A',
  ['altitude pressure', 'atmospheric pressure altitude', 'barometric formula'],
  [
    '{ name: "altitude", label: "Altitude", type: "number", suffix: "meters", min: 0, max: 50000, defaultValue: 2000 }',
    '{ name: "seaLevelPressure", label: "Sea Level Pressure", type: "number", suffix: "hPa", min: 900, max: 1100, defaultValue: 1013.25 }',
    '{ name: "temperature", label: "Temperature at Sea Level", type: "number", suffix: "C", min: -50, max: 50, defaultValue: 15 }',
  ],
  `(inputs) => {
      const alt = inputs.altitude as number;
      const P0 = inputs.seaLevelPressure as number;
      const T0 = (inputs.temperature as number) + 273.15;
      if (alt === undefined || !P0 || !T0) return null;
      const g = 9.80665;
      const M = 0.0289644;
      const R = 8.31447;
      const L = 0.0065;
      const pressure = P0 * Math.pow((T0 - L * alt) / T0, (g * M) / (R * L));
      const pctSeaLevel = (pressure / P0) * 100;
      const oxygenPct = 20.9 * (pressure / 1013.25);
      return {
        primary: { label: "Pressure at Altitude", value: formatNumber(Math.round(pressure * 100) / 100) + " hPa" },
        details: [
          { label: "Percent of Sea Level", value: formatNumber(Math.round(pctSeaLevel * 10) / 10) + "%" },
          { label: "Effective Oxygen", value: formatNumber(Math.round(oxygenPct * 10) / 10) + "% equivalent" },
          { label: "Altitude", value: formatNumber(alt) + " m (" + formatNumber(Math.round(alt * 3.28084)) + " ft)" },
        ],
      };
    }`,
  [{ q: 'How does pressure change with altitude?', a: 'Atmospheric pressure decreases roughly exponentially with altitude. At about 5,500 meters (18,000 ft), pressure is approximately half of sea level pressure.' },
   { q: 'At what altitude is breathing difficult?', a: 'Most people begin to feel altitude effects above 2,400 meters (8,000 ft). Above 8,000 meters (26,000 ft) is the death zone where supplemental oxygen is required.' }],
  'P = P0 x ((T0 - L x h) / T0)^(gM / RL) where L = 0.0065 K/m',
  ['escape-velocity-calculator', 'terminal-velocity-calculator']
);

// #78 Terminal Velocity
add('terminal-velocity-calculator', 'Terminal Velocity Calculator',
  'Calculate the terminal velocity of a falling object based on mass, drag, and area.',
  'Science', 'science', 'A',
  ['terminal velocity', 'falling speed calculator', 'drag force calculator'],
  [
    '{ name: "mass", label: "Object Mass", type: "number", suffix: "kg", min: 0.001, max: 10000, defaultValue: 80 }',
    '{ name: "area", label: "Cross-sectional Area", type: "number", suffix: "sq m", min: 0.001, max: 100, defaultValue: 0.7 }',
    '{ name: "dragCoeff", label: "Drag Coefficient", type: "number", suffix: "", min: 0.01, max: 3, defaultValue: 1.0 }',
    '{ name: "airDensity", label: "Air Density", type: "number", suffix: "kg/m3", min: 0.1, max: 2, defaultValue: 1.225 }',
  ],
  `(inputs) => {
      const m = inputs.mass as number;
      const A = inputs.area as number;
      const Cd = inputs.dragCoeff as number;
      const rho = inputs.airDensity as number;
      if (!m || !A || !Cd || !rho) return null;
      const g = 9.80665;
      const vt = Math.sqrt((2 * m * g) / (rho * Cd * A));
      const vtKmh = vt * 3.6;
      const vtMph = vt * 2.237;
      return {
        primary: { label: "Terminal Velocity", value: formatNumber(Math.round(vt * 100) / 100) + " m/s" },
        details: [
          { label: "In km/h", value: formatNumber(Math.round(vtKmh * 10) / 10) + " km/h" },
          { label: "In mph", value: formatNumber(Math.round(vtMph * 10) / 10) + " mph" },
          { label: "Drag Force at Terminal V", value: formatNumber(Math.round(m * g * 100) / 100) + " N (equals weight)" },
        ],
      };
    }`,
  [{ q: 'What is terminal velocity?', a: 'Terminal velocity is the maximum speed a falling object reaches when the drag force equals gravitational force, resulting in zero net acceleration.' },
   { q: 'What is the terminal velocity of a skydiver?', a: 'A typical skydiver in a belly-down position reaches about 55 m/s (120 mph). In a head-down position this increases to about 90 m/s (200 mph).' }],
  'Terminal Velocity = sqrt(2mg / (rho x Cd x A))',
  ['escape-velocity-calculator', 'altitude-pressure-calculator']
);

// #79 Escape Velocity
add('escape-velocity-calculator', 'Escape Velocity Calculator',
  'Calculate the escape velocity from a celestial body given its mass and radius.',
  'Science', 'science', 'A',
  ['escape velocity', 'planetary escape velocity', 'orbital mechanics'],
  [
    '{ name: "mass", label: "Body Mass", type: "number", suffix: "kg", min: 1e10, max: 2e30, defaultValue: 5.972e24 }',
    '{ name: "radius", label: "Body Radius", type: "number", suffix: "meters", min: 1000, max: 1e9, defaultValue: 6371000 }',
  ],
  `(inputs) => {
      const M = inputs.mass as number;
      const r = inputs.radius as number;
      if (!M || !r || r <= 0) return null;
      const G = 6.674e-11;
      const ve = Math.sqrt(2 * G * M / r);
      const veKmh = ve / 1000 * 3600;
      const veMph = ve * 2.237;
      const earthVe = 11186;
      const ratio = ve / earthVe;
      return {
        primary: { label: "Escape Velocity", value: formatNumber(Math.round(ve)) + " m/s" },
        details: [
          { label: "In km/s", value: formatNumber(Math.round(ve / 100) / 10) + " km/s" },
          { label: "In mph", value: formatNumber(Math.round(veMph)) + " mph" },
          { label: "Relative to Earth", value: formatNumber(Math.round(ratio * 1000) / 1000) + "x Earth escape velocity" },
        ],
      };
    }`,
  [{ q: 'What is escape velocity?', a: 'Escape velocity is the minimum speed an object needs to break free from a celestial body gravitational pull without further propulsion.' },
   { q: 'What is Earth escape velocity?', a: 'Earth escape velocity is approximately 11.2 km/s or about 25,000 mph, regardless of the object mass.' }],
  'Escape Velocity = sqrt(2GM / r) where G = 6.674 x 10^-11',
  ['orbital-period-calculator', 'terminal-velocity-calculator']
);

// #80 Orbital Period
add('orbital-period-calculator', 'Orbital Period Calculator',
  'Calculate the orbital period of a satellite or planet using Kepler third law.',
  'Science', 'science', 'A',
  ['orbital period', 'satellite orbit time', 'Kepler third law'],
  [
    '{ name: "semiMajorAxis", label: "Semi-Major Axis (Orbital Radius)", type: "number", suffix: "km", min: 100, max: 1e9, defaultValue: 6771 }',
    '{ name: "centralMass", label: "Central Body Mass", type: "number", suffix: "kg", min: 1e10, max: 2e30, defaultValue: 5.972e24 }',
  ],
  `(inputs) => {
      const a = (inputs.semiMajorAxis as number) * 1000;
      const M = inputs.centralMass as number;
      if (!a || !M || a <= 0 || M <= 0) return null;
      const G = 6.674e-11;
      const T = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / (G * M));
      const hours = T / 3600;
      const days = T / 86400;
      const altitude = a / 1000 - 6371;
      return {
        primary: { label: "Orbital Period", value: formatNumber(Math.round(T)) + " seconds" },
        details: [
          { label: "In Hours", value: formatNumber(Math.round(hours * 100) / 100) + " hours" },
          { label: "In Days", value: formatNumber(Math.round(days * 1000) / 1000) + " days" },
          { label: "Orbital Velocity", value: formatNumber(Math.round(2 * Math.PI * a / T)) + " m/s" },
        ],
      };
    }`,
  [{ q: 'What is Kepler third law?', a: 'Kepler third law states that the square of the orbital period is proportional to the cube of the semi-major axis: T squared = (4 pi squared / GM) x a cubed.' },
   { q: 'What is the orbital period of the ISS?', a: 'The International Space Station orbits at about 408 km altitude with a period of approximately 92 minutes or about 1.5 hours.' }],
  'T = 2 x pi x sqrt(a^3 / (G x M)) where a = semi-major axis, M = central body mass',
  ['escape-velocity-calculator', 'terminal-velocity-calculator']
);

// #81 Hex to RGB
add('hex-to-rgb-calculator', 'Hex to RGB Calculator',
  'Convert hexadecimal color codes to RGB values and vice versa.',
  'Conversion', 'conversion', 'R',
  ['hex to rgb', 'color code converter', 'hex color converter'],
  [
    '{ name: "hexColor", label: "Hex Color Code", type: "text", placeholder: "e.g. FF5733", defaultValue: "FF5733" }',
    '{ name: "red", label: "Red (R)", type: "number", suffix: "", min: 0, max: 255, defaultValue: 255 }',
    '{ name: "green", label: "Green (G)", type: "number", suffix: "", min: 0, max: 255, defaultValue: 87 }',
    '{ name: "blue", label: "Blue (B)", type: "number", suffix: "", min: 0, max: 255, defaultValue: 51 }',
  ],
  `(inputs) => {
      const hex = (inputs.hexColor as string || "").replace("#", "").trim();
      if (hex && hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
        return {
          primary: { label: "RGB Values", value: "rgb(" + r + ", " + g + ", " + b + ")" },
          details: [
            { label: "Red", value: formatNumber(r) },
            { label: "Green", value: formatNumber(g) },
            { label: "Blue", value: formatNumber(b) },
            { label: "Hex", value: "#" + hex.toUpperCase() },
          ],
        };
      }
      const r = inputs.red as number;
      const g = inputs.green as number;
      const b = inputs.blue as number;
      if (r === undefined || g === undefined || b === undefined) return null;
      const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0").toUpperCase();
      const hexResult = "#" + toHex(r) + toHex(g) + toHex(b);
      return {
        primary: { label: "Hex Color", value: hexResult },
        details: [
          { label: "RGB", value: "rgb(" + r + ", " + g + ", " + b + ")" },
          { label: "Red", value: formatNumber(r) },
          { label: "Green", value: formatNumber(g) },
          { label: "Blue", value: formatNumber(b) },
        ],
      };
    }`,
  [{ q: 'What is a hex color code?', a: 'A hex color code is a 6-character string representing red, green, and blue values in hexadecimal (00 to FF). For example, FF0000 is pure red.' },
   { q: 'How do you convert hex to RGB?', a: 'Split the 6-digit hex into three pairs and convert each pair from base-16 to base-10. For example, FF = 255, 33 = 51.' }],
  'R = parseInt(hex[0..1], 16); G = parseInt(hex[2..3], 16); B = parseInt(hex[4..5], 16)',
  ['number-base-converter', 'ascii-converter']
);

// #82 Unix Timestamp
add('unix-timestamp-converter', 'Unix Timestamp Converter',
  'Convert between Unix epoch timestamps and human-readable dates.',
  'Conversion', 'conversion', 'R',
  ['unix timestamp', 'epoch converter', 'timestamp to date'],
  [
    '{ name: "timestamp", label: "Unix Timestamp (seconds)", type: "number", suffix: "", min: 0, max: 4102444800, defaultValue: 1700000000 }',
    '{ name: "year", label: "Year", type: "number", suffix: "", min: 1970, max: 2100, defaultValue: 2024 }',
    '{ name: "month", label: "Month", type: "number", suffix: "", min: 1, max: 12, defaultValue: 1 }',
    '{ name: "day", label: "Day", type: "number", suffix: "", min: 1, max: 31, defaultValue: 1 }',
  ],
  `(inputs) => {
      const ts = inputs.timestamp as number;
      if (ts !== undefined && ts >= 0) {
        const d = new Date(ts * 1000);
        const iso = d.toISOString();
        const utcStr = d.toUTCString();
        const daysFromNow = Math.round((ts * 1000 - Date.now()) / 86400000);
        return {
          primary: { label: "Date (UTC)", value: iso.replace("T", " ").replace(".000Z", " UTC") },
          details: [
            { label: "ISO 8601", value: iso },
            { label: "UTC String", value: utcStr },
            { label: "Days From Now", value: formatNumber(daysFromNow) },
          ],
        };
      }
      const year = inputs.year as number;
      const month = inputs.month as number;
      const day = inputs.day as number;
      if (!year) return null;
      const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
      const unixTs = Math.floor(date.getTime() / 1000);
      return {
        primary: { label: "Unix Timestamp", value: formatNumber(unixTs) },
        details: [
          { label: "ISO 8601", value: date.toISOString() },
          { label: "Milliseconds", value: formatNumber(unixTs * 1000) },
          { label: "Date", value: date.toUTCString() },
        ],
      };
    }`,
  [{ q: 'What is a Unix timestamp?', a: 'A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC, also known as the Unix epoch.' },
   { q: 'What is the Year 2038 problem?', a: 'Systems using 32-bit signed integers to store Unix timestamps will overflow on January 19, 2038. Modern systems use 64-bit integers to avoid this issue.' }],
  'Unix Timestamp = seconds since January 1, 1970 00:00:00 UTC',
  ['number-base-converter', 'hex-to-rgb-calculator']
);

// #83 Number Base Converter
add('number-base-converter', 'Number Base Converter',
  'Convert numbers between binary, octal, decimal, and hexadecimal bases.',
  'Conversion', 'conversion', 'R',
  ['number base converter', 'binary converter', 'hex converter'],
  [
    '{ name: "number", label: "Number to Convert", type: "text", placeholder: "e.g. 255", defaultValue: "255" }',
    '{ name: "fromBase", label: "From Base", type: "select", options: [{value:"2",label:"Binary (2)"},{value:"8",label:"Octal (8)"},{value:"10",label:"Decimal (10)"},{value:"16",label:"Hexadecimal (16)"}], defaultValue: "10" }',
  ],
  `(inputs) => {
      const numStr = (inputs.number as string || "").trim();
      const fromBase = parseInt(inputs.fromBase as string) || 10;
      if (!numStr) return null;
      const decimal = parseInt(numStr, fromBase);
      if (isNaN(decimal) || decimal < 0) return null;
      return {
        primary: { label: "Decimal", value: formatNumber(decimal) },
        details: [
          { label: "Binary (Base 2)", value: decimal.toString(2) },
          { label: "Octal (Base 8)", value: decimal.toString(8) },
          { label: "Hexadecimal (Base 16)", value: decimal.toString(16).toUpperCase() },
        ],
      };
    }`,
  [{ q: 'What are number bases?', a: 'A number base (or radix) defines how many unique digits are used. Decimal uses 10 digits (0 to 9), binary uses 2 (0 and 1), octal uses 8, and hexadecimal uses 16 (0 to F).' },
   { q: 'Why is hexadecimal used in computing?', a: 'Hexadecimal is a compact way to represent binary data. Each hex digit corresponds to exactly 4 binary digits, making it easier to read memory addresses and color codes.' }],
  'Decimal = sum of (digit x base^position); then convert to target base by repeated division',
  ['hex-to-rgb-calculator', 'ascii-converter']
);

// #84 ASCII Converter
add('ascii-converter', 'ASCII Converter',
  'Convert text characters to their ASCII code values and vice versa.',
  'Conversion', 'conversion', 'R',
  ['ascii converter', 'text to ascii', 'character code converter'],
  [
    '{ name: "text", label: "Text to Convert", type: "text", placeholder: "e.g. Hello", defaultValue: "Hello" }',
    '{ name: "codes", label: "ASCII Codes (space-separated)", type: "text", placeholder: "e.g. 72 101 108 108 111", defaultValue: "" }',
  ],
  `(inputs) => {
      const text = (inputs.text as string || "").trim();
      const codes = (inputs.codes as string || "").trim();
      if (text) {
        const asciiCodes = [];
        const hexCodes = [];
        for (let i = 0; i < Math.min(text.length, 50); i++) {
          asciiCodes.push(text.charCodeAt(i));
          hexCodes.push(text.charCodeAt(i).toString(16).toUpperCase().padStart(2, "0"));
        }
        return {
          primary: { label: "ASCII Codes", value: asciiCodes.join(" ") },
          details: [
            { label: "Hex Codes", value: hexCodes.join(" ") },
            { label: "Character Count", value: formatNumber(text.length) },
            { label: "Binary (first char)", value: text.charCodeAt(0).toString(2).padStart(8, "0") },
          ],
        };
      }
      if (codes) {
        const nums = codes.split(/\\s+/).map(Number).filter(n => !isNaN(n) && n >= 0 && n <= 127);
        const result = nums.map(n => String.fromCharCode(n)).join("");
        return {
          primary: { label: "Text", value: result },
          details: [
            { label: "Character Count", value: formatNumber(nums.length) },
            { label: "Hex Codes", value: nums.map(n => n.toString(16).toUpperCase().padStart(2, "0")).join(" ") },
            { label: "ASCII Codes", value: nums.join(" ") },
          ],
        };
      }
      return null;
    }`,
  [{ q: 'What is ASCII?', a: 'ASCII (American Standard Code for Information Interchange) is a character encoding standard that assigns numeric values 0 to 127 to letters, digits, and symbols.' },
   { q: 'What is the ASCII value of A?', a: 'Uppercase A is 65, lowercase a is 97. The difference between uppercase and lowercase letters is always 32.' }],
  'ASCII Code = character encoding value (0 to 127 for standard ASCII)',
  ['hex-to-rgb-calculator', 'number-base-converter']
);

// #85 Roman Numeral Converter
add('roman-numeral-converter', 'Roman Numeral Converter',
  'Convert between decimal numbers and Roman numerals.',
  'Conversion', 'conversion', 'R',
  ['roman numeral converter', 'decimal to roman', 'roman to decimal'],
  [
    '{ name: "decimal", label: "Decimal Number", type: "number", suffix: "", min: 1, max: 3999, defaultValue: 2024 }',
  ],
  `(inputs) => {
      const num = inputs.decimal as number;
      if (!num || num < 1 || num > 3999) return null;
      const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
      const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
      let roman = "";
      let remaining = Math.floor(num);
      for (let i = 0; i < vals.length; i++) {
        while (remaining >= vals[i]) {
          roman += syms[i];
          remaining -= vals[i];
        }
      }
      const thousands = Math.floor(num / 1000);
      const hundreds = Math.floor((num % 1000) / 100);
      const tens = Math.floor((num % 100) / 10);
      const ones = num % 10;
      return {
        primary: { label: "Roman Numeral", value: roman },
        details: [
          { label: "Decimal Value", value: formatNumber(num) },
          { label: "Breakdown", value: "M:" + thousands + " C:" + hundreds + " X:" + tens + " I:" + ones },
          { label: "Character Count", value: formatNumber(roman.length) },
        ],
      };
    }`,
  [{ q: 'How do Roman numerals work?', a: 'Roman numerals use combinations of letters: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. A smaller value before a larger one means subtraction (IV=4).' },
   { q: 'What is the largest Roman numeral?', a: 'Standard Roman numerals can represent numbers up to 3999 (MMMCMXCIX). Larger numbers historically used bars or parentheses for multiplication by 1000.' }],
  'Build Roman numeral by repeatedly subtracting largest possible value (M, CM, D, CD, C, XC, L, XL, X, IX, V, IV, I)',
  ['number-base-converter', 'fibonacci-calculator']
);

// #86 Cooking Unit Converter
add('cooking-unit-converter', 'Cooking Unit Converter',
  'Convert between common cooking measurements including cups, tablespoons, teaspoons, and milliliters.',
  'Conversion', 'conversion', 'R',
  ['cooking converter', 'cups to ml', 'tablespoon to teaspoon'],
  [
    '{ name: "amount", label: "Amount", type: "number", suffix: "", min: 0.01, max: 10000, defaultValue: 1 }',
    '{ name: "fromUnit", label: "From Unit", type: "select", options: [{value:"cup",label:"Cup"},{value:"tbsp",label:"Tablespoon"},{value:"tsp",label:"Teaspoon"},{value:"ml",label:"Milliliter"},{value:"liter",label:"Liter"},{value:"floz",label:"Fluid Ounce"}], defaultValue: "cup" }',
    '{ name: "toUnit", label: "To Unit", type: "select", options: [{value:"cup",label:"Cup"},{value:"tbsp",label:"Tablespoon"},{value:"tsp",label:"Teaspoon"},{value:"ml",label:"Milliliter"},{value:"liter",label:"Liter"},{value:"floz",label:"Fluid Ounce"}], defaultValue: "ml" }',
  ],
  `(inputs) => {
      const amount = inputs.amount as number;
      const from = inputs.fromUnit as string;
      const to = inputs.toUnit as string;
      if (!amount || amount <= 0) return null;
      const toMl: Record<string, number> = { cup: 236.588, tbsp: 14.787, tsp: 4.929, ml: 1, liter: 1000, floz: 29.574 };
      const fromFactor = toMl[from] || 1;
      const toFactor = toMl[to] || 1;
      const result = amount * fromFactor / toFactor;
      const inMl = amount * fromFactor;
      return {
        primary: { label: "Result", value: formatNumber(Math.round(result * 1000) / 1000) + " " + to },
        details: [
          { label: "In Milliliters", value: formatNumber(Math.round(inMl * 100) / 100) + " ml" },
          { label: "In Cups", value: formatNumber(Math.round(inMl / 236.588 * 1000) / 1000) + " cups" },
          { label: "In Tablespoons", value: formatNumber(Math.round(inMl / 14.787 * 100) / 100) + " tbsp" },
        ],
      };
    }`,
  [{ q: 'How many tablespoons are in a cup?', a: 'There are 16 tablespoons in one US cup (236.6 ml). Each tablespoon equals 3 teaspoons.' },
   { q: 'How many ml in a cup?', a: 'One US cup equals approximately 236.6 milliliters. One metric cup used in some countries equals 250 milliliters.' }],
  'Result = Amount x (Source Unit in ml) / (Target Unit in ml)',
  ['shoe-size-converter', 'ring-size-converter']
);

// #87 Shoe Size Converter
add('shoe-size-converter', 'Shoe Size Converter',
  'Convert shoe sizes between US, UK, and EU sizing systems.',
  'Conversion', 'conversion', 'R',
  ['shoe size converter', 'US to EU shoe size', 'UK to US shoe size'],
  [
    '{ name: "size", label: "Shoe Size", type: "number", suffix: "", min: 1, max: 20, defaultValue: 10 }',
    '{ name: "system", label: "Size System", type: "select", options: [{value:"us_m",label:"US Mens"},{value:"us_w",label:"US Womens"},{value:"uk",label:"UK"},{value:"eu",label:"EU"}], defaultValue: "us_m" }',
    '{ name: "gender", label: "Gender", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" }',
  ],
  `(inputs) => {
      const size = inputs.size as number;
      const system = inputs.system as string;
      if (!size || size <= 0) return null;
      let usMen = size;
      if (system === "us_w") usMen = size - 1.5;
      else if (system === "uk") usMen = size + 0.5;
      else if (system === "eu") usMen = (size - 33.5) / 1.0;
      const usWomen = usMen + 1.5;
      const uk = usMen - 0.5;
      const eu = usMen + 33.5;
      const cm = usMen * 0.847 + 18.4;
      return {
        primary: { label: "Conversions", value: "US M:" + formatNumber(Math.round(usMen * 2) / 2) + " / EU:" + formatNumber(Math.round(eu)) },
        details: [
          { label: "US Mens", value: formatNumber(Math.round(usMen * 2) / 2) },
          { label: "US Womens", value: formatNumber(Math.round(usWomen * 2) / 2) },
          { label: "UK", value: formatNumber(Math.round(uk * 2) / 2) },
          { label: "EU", value: formatNumber(Math.round(eu)) },
        ],
      };
    }`,
  [{ q: 'How do US and EU shoe sizes compare?', a: 'EU sizes are roughly US mens size plus 33.5. For example, a US mens 10 is approximately EU 43 or 44.' },
   { q: 'What is the difference between US mens and womens sizes?', a: 'US womens sizes are typically 1.5 sizes larger than mens. A womens 8.5 is approximately the same as a mens 7.' }],
  'EU = US Mens + 33.5; UK = US Mens - 0.5; US Womens = US Mens + 1.5',
  ['ring-size-converter', 'cooking-unit-converter']
);

// #88 Ring Size Converter
add('ring-size-converter', 'Ring Size Converter',
  'Convert ring sizes between US, UK, and EU sizing standards with circumference.',
  'Conversion', 'conversion', 'R',
  ['ring size converter', 'ring size chart', 'finger size converter'],
  [
    '{ name: "size", label: "Ring Size (US)", type: "number", suffix: "", min: 3, max: 15, defaultValue: 7 }',
  ],
  `(inputs) => {
      const usSize = inputs.size as number;
      if (!usSize || usSize < 3 || usSize > 15) return null;
      const circumMm = 36.5 + (usSize - 1) * 2.55;
      const diameterMm = circumMm / Math.PI;
      const ukBase = "A".charCodeAt(0);
      const ukIndex = Math.round((usSize - 0.5) * 2);
      const ukLetter = String.fromCharCode(Math.min(ukBase + ukIndex, 90));
      const euSize = Math.round(circumMm);
      return {
        primary: { label: "Ring Size Conversions", value: "US " + usSize + " = EU " + euSize },
        details: [
          { label: "US Size", value: formatNumber(usSize) },
          { label: "EU Size", value: formatNumber(euSize) },
          { label: "Circumference", value: formatNumber(Math.round(circumMm * 10) / 10) + " mm" },
          { label: "Inner Diameter", value: formatNumber(Math.round(diameterMm * 10) / 10) + " mm" },
        ],
      };
    }`,
  [{ q: 'How are ring sizes measured?', a: 'Ring sizes are based on the inner circumference or diameter of the ring. US sizes use a numerical scale, while UK sizes use letters and EU sizes use millimeters of circumference.' },
   { q: 'How do I find my ring size?', a: 'Wrap a strip of paper around your finger, mark where it overlaps, and measure the length in millimeters. This gives you the circumference to match against a size chart.' }],
  'Circumference (mm) = 36.5 + (US Size - 1) x 2.55; EU Size = circumference rounded',
  ['shoe-size-converter', 'bra-size-converter']
);

// #89 Bra Size Converter
add('bra-size-converter', 'Bra Size Converter',
  'Convert bra sizes between US, UK, EU, and French sizing systems.',
  'Conversion', 'conversion', 'R',
  ['bra size converter', 'international bra sizes', 'bra size chart'],
  [
    '{ name: "band", label: "Band Size (US)", type: "number", suffix: "inches", min: 28, max: 48, defaultValue: 34 }',
    '{ name: "cup", label: "Cup Size (US)", type: "select", options: [{value:"A",label:"A"},{value:"B",label:"B"},{value:"C",label:"C"},{value:"D",label:"D"},{value:"DD",label:"DD"},{value:"DDD",label:"DDD/F"},{value:"G",label:"G"}], defaultValue: "C" }',
  ],
  `(inputs) => {
      const band = inputs.band as number;
      const cup = inputs.cup as string;
      if (!band || !cup) return null;
      const euBand = Math.round(band * 2.54);
      const frBand = euBand + 15;
      const cupMap: Record<string, string> = { A: "A", B: "B", C: "C", D: "D", DD: "DD", DDD: "E", G: "F" };
      const ukCupMap: Record<string, string> = { A: "A", B: "B", C: "C", D: "D", DD: "DD", DDD: "E", G: "F" };
      const euCup = cupMap[cup] || cup;
      const ukCup = ukCupMap[cup] || cup;
      return {
        primary: { label: "US Size", value: band + cup },
        details: [
          { label: "UK Size", value: band + ukCup },
          { label: "EU Size", value: euBand + euCup },
          { label: "French Size", value: frBand + euCup },
          { label: "Band in cm", value: formatNumber(euBand) + " cm" },
        ],
      };
    }`,
  [{ q: 'How do bra sizes differ between countries?', a: 'Band sizes vary: US and UK use inches, EU uses centimeters, and French adds 15 cm to the EU measurement. Cup letters may also differ between systems.' },
   { q: 'How do I measure my bra size?', a: 'Measure your underbust for the band size (in inches for US). Then measure the fullest part of your bust. The difference in inches determines your cup size (1 inch = A, 2 inches = B, etc).' }],
  'EU Band = US Band x 2.54; French Band = EU Band + 15; Cup conversions vary by system',
  ['ring-size-converter', 'shoe-size-converter']
);

// #90 Wire Gauge Converter
add('wire-gauge-converter', 'Wire Gauge Converter',
  'Convert between American Wire Gauge (AWG) and metric wire diameter in millimeters.',
  'Conversion', 'conversion', 'R',
  ['wire gauge converter', 'AWG to mm', 'wire size converter'],
  [
    '{ name: "awg", label: "AWG Gauge Number", type: "number", suffix: "", min: 0, max: 40, defaultValue: 12 }',
  ],
  `(inputs) => {
      const awg = inputs.awg as number;
      if (awg === undefined || awg < 0 || awg > 40) return null;
      const diameterMm = 0.127 * Math.pow(92, (36 - awg) / 39);
      const diameterInch = diameterMm / 25.4;
      const areaMm2 = Math.PI * Math.pow(diameterMm / 2, 2);
      const resistancePerKm = 0.0175 / (areaMm2 / 1000000) / 1000;
      const maxAmps15 = awg <= 2 ? 95 - (awg * 10) : awg <= 10 ? 55 - (awg - 2) * 5 : awg <= 14 ? 20 - (awg - 10) * 2.5 : 10;
      return {
        primary: { label: "Wire Diameter", value: formatNumber(Math.round(diameterMm * 1000) / 1000) + " mm" },
        details: [
          { label: "Diameter (inches)", value: formatNumber(Math.round(diameterInch * 10000) / 10000) + " in" },
          { label: "Cross-section Area", value: formatNumber(Math.round(areaMm2 * 1000) / 1000) + " mm2" },
          { label: "Typical Max Amps (copper)", value: formatNumber(Math.round(Math.max(1, maxAmps15))) + " A" },
        ],
      };
    }`,
  [{ q: 'What is AWG?', a: 'American Wire Gauge is a standardized wire size system used primarily in North America. Lower AWG numbers indicate thicker wire with greater current-carrying capacity.' },
   { q: 'What AWG wire do I need for a 20 amp circuit?', a: 'A 20 amp circuit typically requires 12 AWG copper wire. For longer runs, you may need to use 10 AWG to compensate for voltage drop.' }],
  'Diameter (mm) = 0.127 x 92^((36 - AWG) / 39)',
  ['number-base-converter', 'hex-to-rgb-calculator']
);

// #91 Matrix Determinant
add('matrix-determinant-calculator', 'Matrix Determinant Calculator',
  'Calculate the determinant of a 2x2 or 3x3 matrix.',
  'Math', 'math', '+',
  ['matrix determinant', 'determinant calculator', '2x2 3x3 determinant'],
  [
    '{ name: "a11", label: "Row 1, Col 1", type: "number", suffix: "", min: -1000, max: 1000, defaultValue: 1 }',
    '{ name: "a12", label: "Row 1, Col 2", type: "number", suffix: "", min: -1000, max: 1000, defaultValue: 2 }',
    '{ name: "a21", label: "Row 2, Col 1", type: "number", suffix: "", min: -1000, max: 1000, defaultValue: 3 }',
    '{ name: "a22", label: "Row 2, Col 2", type: "number", suffix: "", min: -1000, max: 1000, defaultValue: 4 }',
  ],
  `(inputs) => {
      const a = inputs.a11 as number;
      const b = inputs.a12 as number;
      const c = inputs.a21 as number;
      const d = inputs.a22 as number;
      if (a === undefined || b === undefined || c === undefined || d === undefined) return null;
      const det = a * d - b * c;
      const invertible = det !== 0;
      const trace = a + d;
      return {
        primary: { label: "Determinant", value: formatNumber(det) },
        details: [
          { label: "Formula", value: "(" + a + " x " + d + ") - (" + b + " x " + c + ")" },
          { label: "Invertible", value: invertible ? "Yes (determinant is not zero)" : "No (determinant is zero)" },
          { label: "Trace", value: formatNumber(trace) },
        ],
      };
    }`,
  [{ q: 'What is a matrix determinant?', a: 'The determinant is a scalar value computed from a square matrix. For a 2x2 matrix [[a,b],[c,d]], the determinant is ad - bc. It indicates whether the matrix is invertible.' },
   { q: 'When is a matrix not invertible?', a: 'A matrix is not invertible (singular) when its determinant equals zero. This means the rows or columns are linearly dependent.' }],
  'det(2x2) = a11*a22 - a12*a21',
  ['vector-magnitude-calculator', 'combination-permutation-calculator']
);

// #92 Vector Magnitude
add('vector-magnitude-calculator', 'Vector Magnitude Calculator',
  'Calculate the magnitude (length) of a 2D or 3D vector.',
  'Math', 'math', '+',
  ['vector magnitude', 'vector length', 'vector norm calculator'],
  [
    '{ name: "x", label: "X Component", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 3 }',
    '{ name: "y", label: "Y Component", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 4 }',
    '{ name: "z", label: "Z Component (optional, 0 for 2D)", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 0 }',
  ],
  `(inputs) => {
      const x = inputs.x as number;
      const y = inputs.y as number;
      const z = inputs.z as number || 0;
      if (x === undefined || y === undefined) return null;
      const mag = Math.sqrt(x * x + y * y + z * z);
      const is3D = z !== 0;
      const unitX = mag !== 0 ? x / mag : 0;
      const unitY = mag !== 0 ? y / mag : 0;
      const unitZ = mag !== 0 ? z / mag : 0;
      return {
        primary: { label: "Magnitude", value: formatNumber(Math.round(mag * 10000) / 10000) },
        details: [
          { label: "Dimension", value: is3D ? "3D" : "2D" },
          { label: "Unit Vector", value: "(" + (Math.round(unitX * 1000) / 1000) + ", " + (Math.round(unitY * 1000) / 1000) + (is3D ? ", " + (Math.round(unitZ * 1000) / 1000) : "") + ")" },
          { label: "Magnitude Squared", value: formatNumber(x * x + y * y + z * z) },
        ],
      };
    }`,
  [{ q: 'What is vector magnitude?', a: 'Vector magnitude is the length of a vector, calculated as the square root of the sum of the squares of its components. For a 2D vector (x, y), it is sqrt(x2 + y2).' },
   { q: 'What is a unit vector?', a: 'A unit vector has a magnitude of 1 and points in the same direction as the original vector. It is found by dividing each component by the magnitude.' }],
  'Magnitude = sqrt(x^2 + y^2 + z^2)',
  ['matrix-determinant-calculator', 'polar-to-cartesian-calculator']
);

// #93 Polar to Cartesian
add('polar-to-cartesian-calculator', 'Polar to Cartesian Calculator',
  'Convert polar coordinates (r, theta) to Cartesian coordinates (x, y) and vice versa.',
  'Math', 'math', '+',
  ['polar to cartesian', 'coordinate conversion', 'polar coordinates calculator'],
  [
    '{ name: "r", label: "Radius (r)", type: "number", suffix: "", min: 0, max: 10000, defaultValue: 5 }',
    '{ name: "theta", label: "Angle (theta)", type: "number", suffix: "degrees", min: 0, max: 360, defaultValue: 45 }',
  ],
  `(inputs) => {
      const r = inputs.r as number;
      const thetaDeg = inputs.theta as number;
      if (r === undefined || thetaDeg === undefined) return null;
      const thetaRad = thetaDeg * Math.PI / 180;
      const x = r * Math.cos(thetaRad);
      const y = r * Math.sin(thetaRad);
      const backR = Math.sqrt(x * x + y * y);
      const backTheta = Math.atan2(y, x) * 180 / Math.PI;
      return {
        primary: { label: "Cartesian Coordinates", value: "(" + formatNumber(Math.round(x * 10000) / 10000) + ", " + formatNumber(Math.round(y * 10000) / 10000) + ")" },
        details: [
          { label: "X", value: formatNumber(Math.round(x * 10000) / 10000) },
          { label: "Y", value: formatNumber(Math.round(y * 10000) / 10000) },
          { label: "Angle in Radians", value: formatNumber(Math.round(thetaRad * 10000) / 10000) + " rad" },
        ],
      };
    }`,
  [{ q: 'What are polar coordinates?', a: 'Polar coordinates describe a point using distance from the origin (r) and angle from the positive x-axis (theta), rather than x and y distances.' },
   { q: 'How do you convert polar to Cartesian?', a: 'Use x = r x cos(theta) and y = r x sin(theta). Make sure to convert degrees to radians first if needed by multiplying by pi/180.' }],
  'x = r x cos(theta); y = r x sin(theta)',
  ['vector-magnitude-calculator', 'matrix-determinant-calculator']
);

// #94 Fibonacci
add('fibonacci-calculator', 'Fibonacci Calculator',
  'Calculate the nth Fibonacci number and related properties.',
  'Math', 'math', '+',
  ['fibonacci calculator', 'fibonacci number', 'fibonacci sequence'],
  [
    '{ name: "n", label: "Position (n)", type: "number", suffix: "", min: 0, max: 70, defaultValue: 10 }',
  ],
  `(inputs) => {
      const n = inputs.n as number;
      if (n === undefined || n < 0 || n > 70) return null;
      let a = 0, b = 1;
      if (n === 0) { b = 0; }
      else {
        for (let i = 2; i <= n; i++) {
          const temp = a + b;
          a = b;
          b = temp;
        }
      }
      const fib = n === 0 ? 0 : b;
      const phi = (1 + Math.sqrt(5)) / 2;
      const ratioApprox = n >= 2 ? b / a : 0;
      const sequence = [];
      let sa = 0, sb = 1;
      for (let i = 0; i <= Math.min(n, 10); i++) {
        if (i === 0) sequence.push(0);
        else if (i === 1) sequence.push(1);
        else { const t = sa + sb; sa = sb; sb = t; sequence.push(sb); }
      }
      return {
        primary: { label: "F(" + n + ")", value: formatNumber(fib) },
        details: [
          { label: "Sequence", value: sequence.join(", ") + (n > 10 ? "..." : "") },
          { label: "Ratio F(n)/F(n-1)", value: n >= 2 ? formatNumber(Math.round(ratioApprox * 100000) / 100000) : "N/A" },
          { label: "Golden Ratio", value: formatNumber(Math.round(phi * 100000) / 100000) },
        ],
      };
    }`,
  [{ q: 'What is the Fibonacci sequence?', a: 'The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding numbers: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, and so on.' },
   { q: 'What is the golden ratio in Fibonacci?', a: 'The ratio of consecutive Fibonacci numbers approaches the golden ratio (approximately 1.61803) as n increases. This ratio appears frequently in nature and art.' }],
  'F(n) = F(n-1) + F(n-2) where F(0)=0, F(1)=1',
  ['prime-factorization-calculator', 'series-sum-calculator']
);

// #95 Prime Factorization
add('prime-factorization-calculator', 'Prime Factorization Calculator',
  'Find the prime factors of any positive integer.',
  'Math', 'math', '+',
  ['prime factorization', 'prime factors', 'factor calculator'],
  [
    '{ name: "number", label: "Number", type: "number", suffix: "", min: 2, max: 1000000, defaultValue: 360 }',
  ],
  `(inputs) => {
      const num = inputs.number as number;
      if (!num || num < 2 || num !== Math.floor(num)) return null;
      const factors: number[] = [];
      let n = num;
      for (let d = 2; d * d <= n; d++) {
        while (n % d === 0) {
          factors.push(d);
          n = n / d;
        }
      }
      if (n > 1) factors.push(n);
      const uniqueFactors = [...new Set(factors)];
      const isPrime = factors.length === 1;
      const factorCounts: Record<number, number> = {};
      factors.forEach(f => { factorCounts[f] = (factorCounts[f] || 0) + 1; });
      const exponentForm = Object.entries(factorCounts).map(([base, exp]) => exp > 1 ? base + "^" + exp : base).join(" x ");
      return {
        primary: { label: "Prime Factorization", value: factors.join(" x ") },
        details: [
          { label: "Exponent Form", value: exponentForm },
          { label: "Unique Prime Factors", value: uniqueFactors.join(", ") },
          { label: "Is Prime", value: isPrime ? "Yes" : "No" },
          { label: "Number of Factors", value: formatNumber(factors.length) },
        ],
      };
    }`,
  [{ q: 'What is prime factorization?', a: 'Prime factorization is the process of breaking down a number into a product of prime numbers. For example, 360 = 2 x 2 x 2 x 3 x 3 x 5.' },
   { q: 'Why is prime factorization important?', a: 'Prime factorization is fundamental in number theory, cryptography, and computing. It is used in RSA encryption and for finding greatest common divisors.' }],
  'Divide by smallest prime repeatedly: n / 2, n / 3, n / 5, ... until n = 1',
  ['fibonacci-calculator', 'combination-permutation-calculator']
);

// #96 Combination and Permutation
add('combination-permutation-calculator', 'Combination and Permutation Calculator',
  'Calculate combinations (nCr) and permutations (nPr) for a given n and r.',
  'Math', 'math', '+',
  ['combination calculator', 'permutation calculator', 'nCr nPr calculator'],
  [
    '{ name: "n", label: "Total Items (n)", type: "number", suffix: "", min: 0, max: 170, defaultValue: 10 }',
    '{ name: "r", label: "Items Chosen (r)", type: "number", suffix: "", min: 0, max: 170, defaultValue: 3 }',
  ],
  `(inputs) => {
      const n = inputs.n as number;
      const r = inputs.r as number;
      if (n === undefined || r === undefined || n < 0 || r < 0 || r > n) return null;
      const factorial = (x: number): number => { let f = 1; for (let i = 2; i <= x; i++) f *= i; return f; };
      const perm = factorial(n) / factorial(n - r);
      const comb = perm / factorial(r);
      const nFact = factorial(n);
      return {
        primary: { label: "Combinations C(" + n + "," + r + ")", value: formatNumber(comb) },
        details: [
          { label: "Permutations P(" + n + "," + r + ")", value: formatNumber(perm) },
          { label: "n!", value: formatNumber(nFact) },
          { label: "Ratio C/P", value: formatNumber(Math.round(comb / (perm || 1) * 10000) / 10000) },
        ],
      };
    }`,
  [{ q: 'What is the difference between combinations and permutations?', a: 'Permutations count ordered arrangements (order matters), while combinations count unordered selections (order does not matter). P(n,r) = n!/(n-r)! and C(n,r) = n!/(r!(n-r)!).' },
   { q: 'When do I use combinations versus permutations?', a: 'Use permutations when the order of selection matters (like rankings or codes). Use combinations when order does not matter (like choosing team members or lottery numbers).' }],
  'C(n,r) = n! / (r! x (n-r)!); P(n,r) = n! / (n-r)!',
  ['prime-factorization-calculator', 'fibonacci-calculator']
);

// #97 Modular Arithmetic
add('modular-arithmetic-calculator', 'Modular Arithmetic Calculator',
  'Perform modular arithmetic operations including mod, modular exponentiation, and inverse.',
  'Math', 'math', '+',
  ['modular arithmetic', 'mod calculator', 'modulus calculator'],
  [
    '{ name: "a", label: "Number (a)", type: "number", suffix: "", min: -100000, max: 100000, defaultValue: 17 }',
    '{ name: "b", label: "Modulus (m)", type: "number", suffix: "", min: 1, max: 100000, defaultValue: 5 }',
    '{ name: "exp", label: "Exponent (optional)", type: "number", suffix: "", min: 0, max: 1000, defaultValue: 0 }',
  ],
  `(inputs) => {
      const a = inputs.a as number;
      const m = inputs.b as number;
      const exp = inputs.exp as number || 0;
      if (a === undefined || !m || m <= 0) return null;
      const modResult = ((a % m) + m) % m;
      let modExp = 0;
      if (exp > 0) {
        let result = 1;
        let base = ((a % m) + m) % m;
        let e = exp;
        while (e > 0) {
          if (e % 2 === 1) result = (result * base) % m;
          base = (base * base) % m;
          e = Math.floor(e / 2);
        }
        modExp = result;
      }
      let inverse = -1;
      for (let i = 1; i < m; i++) {
        if ((modResult * i) % m === 1) { inverse = i; break; }
      }
      return {
        primary: { label: a + " mod " + m, value: formatNumber(modResult) },
        details: [
          { label: "a mod m", value: formatNumber(modResult) },
          { label: "Modular Inverse", value: inverse >= 0 ? formatNumber(inverse) : "Does not exist" },
          { label: "a^exp mod m", value: exp > 0 ? formatNumber(modExp) : "Enter exponent to compute" },
        ],
      };
    }`,
  [{ q: 'What is modular arithmetic?', a: 'Modular arithmetic is a system of arithmetic for integers where numbers wrap around after reaching a certain value called the modulus. For example, 17 mod 5 = 2.' },
   { q: 'What is a modular inverse?', a: 'The modular inverse of a (mod m) is a number x such that (a x x) mod m = 1. It exists only when a and m are coprime (their greatest common divisor is 1).' }],
  'a mod m = remainder of a / m; Modular Inverse: (a x x) mod m = 1',
  ['prime-factorization-calculator', 'logarithm-calculator']
);

// #98 Logarithm
add('logarithm-calculator', 'Logarithm Calculator',
  'Calculate logarithms with any base, including natural log and log base 10.',
  'Math', 'math', '+',
  ['logarithm calculator', 'log calculator', 'natural log calculator'],
  [
    '{ name: "value", label: "Value", type: "number", suffix: "", min: 0.0001, max: 1e15, defaultValue: 100 }',
    '{ name: "base", label: "Base", type: "number", suffix: "", min: 0.01, max: 1000, defaultValue: 10 }',
  ],
  `(inputs) => {
      const value = inputs.value as number;
      const base = inputs.base as number;
      if (!value || value <= 0 || !base || base <= 0 || base === 1) return null;
      const result = Math.log(value) / Math.log(base);
      const ln = Math.log(value);
      const log10 = Math.log10(value);
      const log2 = Math.log2(value);
      return {
        primary: { label: "log base " + base + " of " + value, value: formatNumber(Math.round(result * 1000000) / 1000000) },
        details: [
          { label: "Natural Log (ln)", value: formatNumber(Math.round(ln * 1000000) / 1000000) },
          { label: "Log Base 10", value: formatNumber(Math.round(log10 * 1000000) / 1000000) },
          { label: "Log Base 2", value: formatNumber(Math.round(log2 * 1000000) / 1000000) },
        ],
      };
    }`,
  [{ q: 'What is a logarithm?', a: 'A logarithm answers the question: to what power must the base be raised to produce a given number? For example, log base 10 of 100 = 2 because 10^2 = 100.' },
   { q: 'What is the natural logarithm?', a: 'The natural logarithm (ln) uses the mathematical constant e (approximately 2.71828) as its base. It is fundamental in calculus, physics, and engineering.' }],
  'log_b(x) = ln(x) / ln(b) where ln is the natural logarithm',
  ['modular-arithmetic-calculator', 'series-sum-calculator']
);

// #99 Series Sum
add('series-sum-calculator', 'Series Sum Calculator',
  'Calculate the sum of arithmetic and geometric series given the first term, common difference or ratio, and number of terms.',
  'Math', 'math', '+',
  ['series sum', 'arithmetic series', 'geometric series calculator'],
  [
    '{ name: "firstTerm", label: "First Term (a)", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 1 }',
    '{ name: "commonValue", label: "Common Difference (d) or Ratio (r)", type: "number", suffix: "", min: -1000, max: 1000, defaultValue: 2 }',
    '{ name: "terms", label: "Number of Terms (n)", type: "number", suffix: "", min: 1, max: 1000, defaultValue: 10 }',
    '{ name: "type", label: "Series Type", type: "select", options: [{value:"arithmetic",label:"Arithmetic"},{value:"geometric",label:"Geometric"}], defaultValue: "arithmetic" }',
  ],
  `(inputs) => {
      const a = inputs.firstTerm as number;
      const cv = inputs.commonValue as number;
      const n = inputs.terms as number;
      const type = inputs.type as string;
      if (a === undefined || cv === undefined || !n || n <= 0) return null;
      let sum = 0;
      let lastTerm = 0;
      if (type === "arithmetic") {
        lastTerm = a + (n - 1) * cv;
        sum = n * (a + lastTerm) / 2;
      } else {
        if (cv === 1) { sum = a * n; lastTerm = a; }
        else { sum = a * (1 - Math.pow(cv, n)) / (1 - cv); lastTerm = a * Math.pow(cv, n - 1); }
      }
      return {
        primary: { label: "Sum of Series", value: formatNumber(Math.round(sum * 10000) / 10000) },
        details: [
          { label: "Series Type", value: type === "arithmetic" ? "Arithmetic" : "Geometric" },
          { label: "Last Term", value: formatNumber(Math.round(lastTerm * 10000) / 10000) },
          { label: "Number of Terms", value: formatNumber(n) },
          { label: "Average Term", value: formatNumber(Math.round(sum / n * 10000) / 10000) },
        ],
      };
    }`,
  [{ q: 'What is an arithmetic series?', a: 'An arithmetic series is the sum of terms with a constant difference between consecutive terms. For example, 2 + 4 + 6 + 8 has a common difference of 2.' },
   { q: 'What is a geometric series?', a: 'A geometric series is the sum of terms where each term is multiplied by a constant ratio. For example, 3 + 6 + 12 + 24 has a common ratio of 2.' }],
  'Arithmetic: S = n(a + last)/2; Geometric: S = a(1 - r^n)/(1 - r)',
  ['fibonacci-calculator', 'logarithm-calculator']
);

// #100 Complex Number
add('complex-number-calculator', 'Complex Number Calculator',
  'Perform operations on complex numbers including addition, multiplication, and magnitude.',
  'Math', 'math', '+',
  ['complex number calculator', 'imaginary number calculator', 'complex arithmetic'],
  [
    '{ name: "a1", label: "First Number - Real Part", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 3 }',
    '{ name: "b1", label: "First Number - Imaginary Part", type: "number", suffix: "i", min: -10000, max: 10000, defaultValue: 4 }',
    '{ name: "a2", label: "Second Number - Real Part", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 1 }',
    '{ name: "b2", label: "Second Number - Imaginary Part", type: "number", suffix: "i", min: -10000, max: 10000, defaultValue: 2 }',
  ],
  `(inputs) => {
      const a1 = inputs.a1 as number;
      const b1 = inputs.b1 as number;
      const a2 = inputs.a2 as number;
      const b2 = inputs.b2 as number;
      if (a1 === undefined || b1 === undefined || a2 === undefined || b2 === undefined) return null;
      const sumR = a1 + a2;
      const sumI = b1 + b2;
      const mulR = a1 * a2 - b1 * b2;
      const mulI = a1 * b2 + b1 * a2;
      const mag1 = Math.sqrt(a1 * a1 + b1 * b1);
      const mag2 = Math.sqrt(a2 * a2 + b2 * b2);
      const phase1 = Math.atan2(b1, a1) * 180 / Math.PI;
      const fmt = (r: number, i: number) => {
        const sign = i >= 0 ? "+" : "-";
        return r + " " + sign + " " + Math.abs(i) + "i";
      };
      return {
        primary: { label: "Sum", value: fmt(sumR, sumI) },
        details: [
          { label: "Product", value: fmt(mulR, mulI) },
          { label: "Magnitude of First", value: formatNumber(Math.round(mag1 * 10000) / 10000) },
          { label: "Magnitude of Second", value: formatNumber(Math.round(mag2 * 10000) / 10000) },
          { label: "Phase of First", value: formatNumber(Math.round(phase1 * 100) / 100) + " degrees" },
        ],
      };
    }`,
  [{ q: 'What is a complex number?', a: 'A complex number has a real part and an imaginary part, written as a + bi where i is the square root of -1. They extend the real numbers and are essential in many areas of mathematics and engineering.' },
   { q: 'How do you multiply complex numbers?', a: 'Multiply using the distributive property: (a + bi)(c + di) = (ac - bd) + (ad + bc)i. The key rule is that i squared equals -1.' }],
  'Sum: (a1+a2) + (b1+b2)i; Product: (a1a2-b1b2) + (a1b2+b1a2)i; Magnitude: sqrt(a^2+b^2)',
  ['vector-magnitude-calculator', 'matrix-determinant-calculator']
);
