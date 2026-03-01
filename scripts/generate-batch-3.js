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

// === BATCH 3: 50 NEW CALCULATORS ===

// =============================================================================
// SPORTS / FITNESS (10)
// =============================================================================

// #1 Race Pace Calculator
add('race-pace-calculator', 'Race Pace Calculator',
  'Calculate your target pace per mile or kilometer for any running race distance.',
  'Health', 'health', 'H',
  ['race pace', 'running pace', 'marathon pace', 'target pace'],
  [
    '{ name: "distance", label: "Race Distance", type: "select", options: [{value:"5",label:"5K"},{value:"10",label:"10K"},{value:"21.1",label:"Half Marathon"},{value:"42.2",label:"Marathon"}], defaultValue: "5" }',
    '{ name: "hours", label: "Target Hours", type: "number", min: 0, max: 12, defaultValue: 0 }',
    '{ name: "minutes", label: "Target Minutes", type: "number", min: 0, max: 59, defaultValue: 25 }',
    '{ name: "seconds", label: "Target Seconds", type: "number", min: 0, max: 59, defaultValue: 0 }',
  ],
  `(inputs) => {
      const dist = parseFloat(inputs.distance as string);
      const hrs = inputs.hours as number;
      const mins = inputs.minutes as number;
      const secs = inputs.seconds as number;
      const totalSec = (hrs || 0) * 3600 + (mins || 0) * 60 + (secs || 0);
      if (!dist || totalSec <= 0) return null;
      const paceSecPerKm = totalSec / dist;
      const paceSecPerMi = totalSec / (dist / 1.60934);
      const kmMin = Math.floor(paceSecPerKm / 60);
      const kmSec = Math.round(paceSecPerKm % 60);
      const miMin = Math.floor(paceSecPerMi / 60);
      const miSec = Math.round(paceSecPerMi % 60);
      const speed = (dist / (totalSec / 3600)).toFixed(1);
      return {
        primary: { label: "Pace per Mile", value: miMin + ":" + String(miSec).padStart(2, "0") + " /mi" },
        details: [
          { label: "Pace per Kilometer", value: kmMin + ":" + String(kmSec).padStart(2, "0") + " /km" },
          { label: "Average Speed", value: speed + " km/h" },
          { label: "Total Time", value: (hrs || 0) + "h " + (mins || 0) + "m " + (secs || 0) + "s" },
        ],
      };
    }`,
  [{ q: 'What is a good race pace for a 5K?', a: 'A good 5K pace varies by fitness level. Beginners often target 10-12 minutes per mile while competitive runners aim for 6-7 minutes per mile.' },
   { q: 'How do I calculate my race pace?', a: 'Divide your total target time in minutes by the race distance in miles or kilometers to get your pace per unit of distance.' }],
  'Pace = Total Time / Race Distance',
  ['bench-press-strength-calculator', 'rowing-split-calculator']
);

// #2 Bench Press Strength Calculator
add('bench-press-strength-calculator', 'Bench Press Strength Calculator',
  'Evaluate your bench press performance level based on body weight, weight lifted, and experience.',
  'Health', 'health', 'H',
  ['bench press strength', 'bench press standards', 'bench press level'],
  [
    '{ name: "bodyWeight", label: "Body Weight", type: "number", suffix: "lbs", min: 80, max: 400, defaultValue: 180 }',
    '{ name: "liftWeight", label: "Weight Lifted", type: "number", suffix: "lbs", min: 20, max: 1000, defaultValue: 185 }',
    '{ name: "reps", label: "Repetitions", type: "number", min: 1, max: 30, defaultValue: 5 }',
    '{ name: "gender", label: "Gender", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" }',
  ],
  `(inputs) => {
      const bw = inputs.bodyWeight as number;
      const lw = inputs.liftWeight as number;
      const reps = inputs.reps as number;
      const gender = inputs.gender as string;
      if (!bw || !lw || !reps) return null;
      const oneRepMax = Math.round(lw * (1 + reps / 30));
      const ratio = oneRepMax / bw;
      const thresholds = gender === "female"
        ? { beginner: 0.4, novice: 0.65, intermediate: 0.85, advanced: 1.15 }
        : { beginner: 0.6, novice: 1.0, intermediate: 1.25, advanced: 1.75 };
      let level = "Elite";
      if (ratio < thresholds.beginner) level = "Beginner";
      else if (ratio < thresholds.novice) level = "Novice";
      else if (ratio < thresholds.intermediate) level = "Intermediate";
      else if (ratio < thresholds.advanced) level = "Advanced";
      return {
        primary: { label: "Strength Level", value: level },
        details: [
          { label: "Estimated 1-Rep Max", value: formatNumber(oneRepMax) + " lbs" },
          { label: "Strength Ratio", value: ratio.toFixed(2) + "x body weight" },
          { label: "Body Weight", value: formatNumber(bw) + " lbs" },
        ],
      };
    }`,
  [{ q: 'What is a good bench press for my weight?', a: 'An intermediate male lifter should bench about 1.25 times body weight. For females the intermediate standard is about 0.85 times body weight.' },
   { q: 'How is one rep max calculated?', a: 'One rep max is estimated by multiplying the weight lifted by (1 + reps / 30), known as the Epley formula.' }],
  'One Rep Max = Weight x (1 + Reps / 30)',
  ['squat-strength-calculator', 'deadlift-strength-calculator']
);

// #3 Squat Strength Calculator
add('squat-strength-calculator', 'Squat Strength Calculator',
  'Assess your squat performance level based on weight lifted, body weight, and training experience.',
  'Health', 'health', 'H',
  ['squat strength', 'squat standards', 'squat performance'],
  [
    '{ name: "bodyWeight", label: "Body Weight", type: "number", suffix: "lbs", min: 80, max: 400, defaultValue: 180 }',
    '{ name: "liftWeight", label: "Weight Squatted", type: "number", suffix: "lbs", min: 20, max: 1500, defaultValue: 225 }',
    '{ name: "reps", label: "Repetitions", type: "number", min: 1, max: 30, defaultValue: 5 }',
    '{ name: "gender", label: "Gender", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" }',
  ],
  `(inputs) => {
      const bw = inputs.bodyWeight as number;
      const lw = inputs.liftWeight as number;
      const reps = inputs.reps as number;
      const gender = inputs.gender as string;
      if (!bw || !lw || !reps) return null;
      const oneRepMax = Math.round(lw * (1 + reps / 30));
      const ratio = oneRepMax / bw;
      const thresholds = gender === "female"
        ? { beginner: 0.5, novice: 0.75, intermediate: 1.0, advanced: 1.5 }
        : { beginner: 0.75, novice: 1.25, intermediate: 1.5, advanced: 2.0 };
      let level = "Elite";
      if (ratio < thresholds.beginner) level = "Beginner";
      else if (ratio < thresholds.novice) level = "Novice";
      else if (ratio < thresholds.intermediate) level = "Intermediate";
      else if (ratio < thresholds.advanced) level = "Advanced";
      return {
        primary: { label: "Squat Level", value: level },
        details: [
          { label: "Estimated 1-Rep Max", value: formatNumber(oneRepMax) + " lbs" },
          { label: "Strength Ratio", value: ratio.toFixed(2) + "x body weight" },
          { label: "Body Weight", value: formatNumber(bw) + " lbs" },
        ],
      };
    }`,
  [{ q: 'What is a good squat weight?', a: 'An intermediate male lifter should squat about 1.5 times body weight. Females should target about 1.0 times body weight at intermediate level.' },
   { q: 'How do I improve my squat strength?', a: 'Progressive overload with consistent training, proper form, and adequate recovery will improve squat strength over time.' }],
  'One Rep Max = Weight x (1 + Reps / 30)',
  ['bench-press-strength-calculator', 'deadlift-strength-calculator']
);

// #4 Deadlift Strength Calculator
add('deadlift-strength-calculator', 'Deadlift Strength Calculator',
  'Determine your deadlift performance level by comparing your lift to established strength standards.',
  'Health', 'health', 'H',
  ['deadlift strength', 'deadlift standards', 'deadlift performance'],
  [
    '{ name: "bodyWeight", label: "Body Weight", type: "number", suffix: "lbs", min: 80, max: 400, defaultValue: 180 }',
    '{ name: "liftWeight", label: "Weight Lifted", type: "number", suffix: "lbs", min: 20, max: 1500, defaultValue: 275 }',
    '{ name: "reps", label: "Repetitions", type: "number", min: 1, max: 30, defaultValue: 5 }',
    '{ name: "gender", label: "Gender", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" }',
  ],
  `(inputs) => {
      const bw = inputs.bodyWeight as number;
      const lw = inputs.liftWeight as number;
      const reps = inputs.reps as number;
      const gender = inputs.gender as string;
      if (!bw || !lw || !reps) return null;
      const oneRepMax = Math.round(lw * (1 + reps / 30));
      const ratio = oneRepMax / bw;
      const thresholds = gender === "female"
        ? { beginner: 0.6, novice: 1.0, intermediate: 1.25, advanced: 1.75 }
        : { beginner: 1.0, novice: 1.5, intermediate: 1.75, advanced: 2.5 };
      let level = "Elite";
      if (ratio < thresholds.beginner) level = "Beginner";
      else if (ratio < thresholds.novice) level = "Novice";
      else if (ratio < thresholds.intermediate) level = "Intermediate";
      else if (ratio < thresholds.advanced) level = "Advanced";
      return {
        primary: { label: "Deadlift Level", value: level },
        details: [
          { label: "Estimated 1-Rep Max", value: formatNumber(oneRepMax) + " lbs" },
          { label: "Strength Ratio", value: ratio.toFixed(2) + "x body weight" },
          { label: "Body Weight", value: formatNumber(bw) + " lbs" },
        ],
      };
    }`,
  [{ q: 'What is a good deadlift for beginners?', a: 'Beginner male lifters should aim for at least 1.0 times body weight. Female beginners should target around 0.6 times body weight.' },
   { q: 'Is deadlift the best strength indicator?', a: 'The deadlift tests overall posterior chain strength and is considered one of the best measures of total body strength.' }],
  'One Rep Max = Weight x (1 + Reps / 30)',
  ['squat-strength-calculator', 'bench-press-strength-calculator']
);

// #5 Rowing Split Calculator
add('rowing-split-calculator', 'Rowing Split Calculator',
  'Estimate your rowing ergometer split time based on target distance, watts, or total workout time.',
  'Health', 'health', 'H',
  ['rowing split', 'erg split time', 'rowing pace'],
  [
    '{ name: "distance", label: "Total Distance", type: "number", suffix: "meters", min: 100, max: 50000, defaultValue: 2000 }',
    '{ name: "minutes", label: "Target Minutes", type: "number", min: 0, max: 120, defaultValue: 7 }',
    '{ name: "seconds", label: "Target Seconds", type: "number", min: 0, max: 59, defaultValue: 30 }',
    '{ name: "weight", label: "Rower Weight", type: "number", suffix: "lbs", min: 80, max: 400, defaultValue: 180 }',
  ],
  `(inputs) => {
      const dist = inputs.distance as number;
      const mins = inputs.minutes as number;
      const secs = inputs.seconds as number;
      const weight = inputs.weight as number;
      const totalSec = (mins || 0) * 60 + (secs || 0);
      if (!dist || totalSec <= 0) return null;
      const splitSec = (totalSec / dist) * 500;
      const splitMin = Math.floor(splitSec / 60);
      const splitRemSec = Math.round(splitSec % 60);
      const pace = dist / totalSec;
      const watts = Math.round(2.8 / Math.pow(splitSec / 500, 3));
      const calPerHour = Math.round(watts * 3.6 * (weight / 180) * 0.86);
      return {
        primary: { label: "Split per 500m", value: splitMin + ":" + String(splitRemSec).padStart(2, "0") },
        details: [
          { label: "Estimated Watts", value: formatNumber(watts) + " W" },
          { label: "Speed", value: pace.toFixed(2) + " m/s" },
          { label: "Est. Calories per Hour", value: formatNumber(calPerHour) },
        ],
      };
    }`,
  [{ q: 'What is a good 2K rowing split?', a: 'A competitive male rower targets a split under 1:45 per 500m. Recreational rowers typically see splits between 2:00 and 2:30.' },
   { q: 'How are rowing watts calculated?', a: 'Watts on a rowing ergometer are derived from the formula: Watts = 2.8 / (split per 500m in seconds) cubed.' }],
  'Split (per 500m) = (Total Time / Distance) x 500',
  ['race-pace-calculator', 'bench-press-strength-calculator']
);

// #6 Paddle Board Size Calculator
add('paddle-board-size-calculator', 'Paddle Board Size Calculator',
  'Find the right stand-up paddle board size based on your weight, skill level, and intended use.',
  'Everyday', 'everyday', '~',
  ['paddle board size', 'SUP sizing', 'stand up paddle board'],
  [
    '{ name: "weight", label: "Rider Weight", type: "number", suffix: "lbs", min: 50, max: 400, defaultValue: 175 }',
    '{ name: "skill", label: "Skill Level", type: "select", options: [{value:"beginner",label:"Beginner"},{value:"intermediate",label:"Intermediate"},{value:"advanced",label:"Advanced"}], defaultValue: "beginner" }',
    '{ name: "use", label: "Primary Use", type: "select", options: [{value:"allround",label:"All-Around"},{value:"touring",label:"Touring"},{value:"surf",label:"Surfing"},{value:"yoga",label:"Yoga/Fitness"}], defaultValue: "allround" }',
  ],
  `(inputs) => {
      const weight = inputs.weight as number;
      const skill = inputs.skill as string;
      const use = inputs.use as string;
      if (!weight) return null;
      const volumeMultiplier = skill === "beginner" ? 2.0 : skill === "intermediate" ? 1.5 : 1.2;
      const volume = Math.round(weight * 0.453592 * volumeMultiplier);
      const lengthMap: Record<string, string> = { allround: "10 ft 6 in", touring: "12 ft 6 in", surf: "9 ft 0 in", yoga: "10 ft 8 in" };
      const widthMap: Record<string, string> = { allround: "32 in", touring: "30 in", surf: "29 in", yoga: "34 in" };
      const boardLength = lengthMap[use] || "10 ft 6 in";
      const boardWidth = widthMap[use] || "32 in";
      return {
        primary: { label: "Recommended Volume", value: volume + " liters" },
        details: [
          { label: "Board Length", value: boardLength },
          { label: "Board Width", value: boardWidth },
          { label: "Rider Weight", value: formatNumber(weight) + " lbs" },
        ],
      };
    }`,
  [{ q: 'How do I choose a paddle board size?', a: 'Your board volume in liters should be about 1.2 to 2.0 times your body weight in kilograms, depending on skill level.' },
   { q: 'What width paddle board do I need?', a: 'Beginners should choose boards 32-34 inches wide for stability. Advanced paddlers can use narrower boards for speed.' }],
  'Board Volume (L) = Rider Weight (kg) x Skill Multiplier',
  ['skateboard-size-calculator', 'rock-climbing-rope-length-calculator']
);

// #7 Skateboard Size Calculator
add('skateboard-size-calculator', 'Skateboard Size Calculator',
  'Determine the right skateboard deck width and truck size based on shoe size and riding style.',
  'Everyday', 'everyday', '~',
  ['skateboard size', 'deck width', 'skateboard sizing'],
  [
    '{ name: "shoeSize", label: "Shoe Size (US)", type: "number", min: 4, max: 16, defaultValue: 10 }',
    '{ name: "style", label: "Riding Style", type: "select", options: [{value:"street",label:"Street"},{value:"park",label:"Park/Vert"},{value:"cruising",label:"Cruising"},{value:"all",label:"All-Around"}], defaultValue: "street" }',
    '{ name: "height", label: "Rider Height", type: "number", suffix: "inches", min: 40, max: 84, defaultValue: 68 }',
  ],
  `(inputs) => {
      const shoe = inputs.shoeSize as number;
      const style = inputs.style as string;
      const height = inputs.height as number;
      if (!shoe) return null;
      let deckWidth = 7.5 + (shoe - 7) * 0.125;
      if (style === "park") deckWidth += 0.25;
      if (style === "cruising") deckWidth += 0.5;
      deckWidth = Math.round(deckWidth * 100) / 100;
      const truckSize = deckWidth <= 7.75 ? "129mm" : deckWidth <= 8.25 ? "139mm" : deckWidth <= 8.5 ? "149mm" : "159mm";
      const wheelSize = style === "street" ? "50-53mm" : style === "cruising" ? "56-60mm" : "53-56mm";
      return {
        primary: { label: "Deck Width", value: deckWidth.toFixed(2) + " inches" },
        details: [
          { label: "Truck Size", value: truckSize },
          { label: "Wheel Size", value: wheelSize },
          { label: "Riding Style", value: style.charAt(0).toUpperCase() + style.slice(1) },
        ],
      };
    }`,
  [{ q: 'What size skateboard deck should I get?', a: 'Deck width should match your shoe size and riding style. Street skaters prefer 7.75-8.25 inches while park and vert riders go wider.' },
   { q: 'Do trucks need to match deck width?', a: 'Yes, truck axle width should closely match deck width for proper handling and stability.' }],
  'Deck Width = 7.5 + (Shoe Size - 7) x 0.125 + Style Adjustment',
  ['paddle-board-size-calculator', 'lacrosse-stick-size-calculator']
);

// #8 Climbing Rope Length Calculator
add('rock-climbing-rope-length-calculator', 'Climbing Rope Length Calculator',
  'Calculate the rope length needed for rock climbing based on route height and belay setup.',
  'Everyday', 'everyday', '~',
  ['climbing rope length', 'rock climbing rope', 'rope sizing'],
  [
    '{ name: "routeHeight", label: "Route Height", type: "number", suffix: "feet", min: 10, max: 500, defaultValue: 80 }',
    '{ name: "climbType", label: "Climbing Type", type: "select", options: [{value:"toprope",label:"Top Rope"},{value:"lead",label:"Lead Climbing"},{value:"multipitch",label:"Multi-Pitch"}], defaultValue: "toprope" }',
    '{ name: "anchorSetback", label: "Anchor Setback", type: "number", suffix: "feet", min: 0, max: 50, defaultValue: 5 }',
  ],
  `(inputs) => {
      const height = inputs.routeHeight as number;
      const type = inputs.climbType as string;
      const setback = inputs.anchorSetback as number;
      if (!height || height <= 0) return null;
      let needed = height * 2 + (setback || 0) + 10;
      if (type === "lead") needed += 15;
      if (type === "multipitch") needed = height + 20;
      const ropeMeters = Math.ceil(needed * 0.3048);
      const recommended = ropeMeters <= 40 ? 40 : ropeMeters <= 50 ? 50 : ropeMeters <= 60 ? 60 : 70;
      return {
        primary: { label: "Minimum Rope Needed", value: formatNumber(Math.ceil(needed)) + " ft" },
        details: [
          { label: "In Meters", value: ropeMeters + " m" },
          { label: "Recommended Rope", value: recommended + " m standard" },
          { label: "Route Height", value: formatNumber(height) + " ft" },
        ],
      };
    }`,
  [{ q: 'How long of a climbing rope do I need?', a: 'For top rope climbing you need at least twice the route height plus extra for anchors and knots. A 60-meter rope covers most single pitch routes.' },
   { q: 'What is the standard climbing rope length?', a: 'The most common climbing rope lengths are 60 meters and 70 meters. A 60m rope is sufficient for most sport climbing routes.' }],
  'Minimum Rope = (Route Height x 2) + Anchor Setback + Safety Buffer',
  ['paddle-board-size-calculator', 'skateboard-size-calculator']
);

// #9 Lacrosse Stick Size Calculator
add('lacrosse-stick-size-calculator', 'Lacrosse Stick Size Calculator',
  'Find the correct lacrosse stick length based on player height, position, and age group.',
  'Everyday', 'everyday', '~',
  ['lacrosse stick size', 'lacrosse shaft length', 'lacrosse equipment'],
  [
    '{ name: "height", label: "Player Height", type: "number", suffix: "inches", min: 36, max: 84, defaultValue: 66 }',
    '{ name: "position", label: "Position", type: "select", options: [{value:"attack",label:"Attack"},{value:"midfield",label:"Midfield"},{value:"defense",label:"Defense"},{value:"goalie",label:"Goalie"}], defaultValue: "midfield" }',
    '{ name: "ageGroup", label: "Age Group", type: "select", options: [{value:"youth",label:"Youth (Under 12)"},{value:"highschool",label:"High School"},{value:"college",label:"College/Adult"}], defaultValue: "highschool" }',
  ],
  `(inputs) => {
      const height = inputs.height as number;
      const position = inputs.position as string;
      const age = inputs.ageGroup as string;
      if (!height) return null;
      let shaftLength = 30;
      if (age === "youth") {
        shaftLength = height < 48 ? 26 : 30;
      } else if (position === "defense") {
        shaftLength = 60;
      } else if (position === "goalie") {
        shaftLength = 40;
      } else {
        shaftLength = 30;
      }
      const totalLength = shaftLength + 10;
      const headWidth = position === "goalie" ? "12 inches" : position === "defense" ? "6-10 inches" : "6-6.5 inches";
      return {
        primary: { label: "Shaft Length", value: shaftLength + " inches" },
        details: [
          { label: "Total Stick Length", value: totalLength + " inches" },
          { label: "Head Width", value: headWidth },
          { label: "Position", value: position.charAt(0).toUpperCase() + position.slice(1) },
        ],
      };
    }`,
  [{ q: 'How long should a lacrosse stick be?', a: 'Attack and midfield sticks are typically 40 inches total (30 inch shaft). Defense sticks are 60 inches with a longer shaft for reach.' },
   { q: 'Does position affect lacrosse stick size?', a: 'Yes, defensive players use longer sticks (52-72 inches) for checking range while attackers use shorter sticks (40-42 inches) for ball control.' }],
  'Stick Length = Shaft Length + Head Length (approximately 10 inches)',
  ['skateboard-size-calculator', 'paddle-board-size-calculator']
);

// #10 Dart Checkout Calculator
add('dart-checkout-calculator', 'Dart Checkout Calculator',
  'Calculate possible dart checkout combinations for a given score remaining in a game of 501.',
  'Everyday', 'everyday', '~',
  ['dart checkout', 'darts finish', 'dart out chart'],
  [
    '{ name: "remaining", label: "Score Remaining", type: "number", min: 2, max: 170, defaultValue: 80 }',
    '{ name: "darts", label: "Darts Available", type: "select", options: [{value:"3",label:"3 Darts"},{value:"2",label:"2 Darts"},{value:"1",label:"1 Dart"}], defaultValue: "3" }',
    '{ name: "preferDouble", label: "Preferred Double", type: "number", min: 1, max: 20, defaultValue: 16 }',
  ],
  `(inputs) => {
      const remaining = inputs.remaining as number;
      const darts = parseInt(inputs.darts as string);
      const prefDouble = inputs.preferDouble as number;
      if (!remaining || remaining < 2 || remaining > 170) return null;
      const doubleOut = Math.floor(remaining / 2);
      const canCheckout1 = remaining <= 40 && remaining % 2 === 0;
      const canCheckout2 = remaining <= 110;
      const canCheckout3 = remaining <= 170;
      let canFinish = false;
      if (darts >= 3 && canCheckout3) canFinish = true;
      if (darts >= 2 && canCheckout2) canFinish = true;
      if (darts >= 1 && canCheckout1) canFinish = true;
      const checkout = canCheckout1 ? "D" + (remaining / 2) : remaining <= 60 ? "S" + (remaining - prefDouble * 2) + ", D" + prefDouble : remaining <= 110 ? "T" + Math.floor((remaining - prefDouble * 2) / 3) + ", D" + prefDouble : "T20, T" + Math.floor((remaining - 40 - 60) / 3) + ", D" + prefDouble;
      return {
        primary: { label: "Checkout Possible", value: canFinish ? "Yes" : "No" },
        details: [
          { label: "Suggested Finish", value: checkout },
          { label: "Score Remaining", value: String(remaining) },
          { label: "Darts Available", value: String(darts) },
        ],
      };
    }`,
  [{ q: 'What is the highest checkout in darts?', a: 'The highest possible checkout in darts is 170, achieved with two treble 20s and a bullseye (T20, T20, Bull).' },
   { q: 'What does double out mean in darts?', a: 'Double out means you must finish the game by hitting a double segment. The final dart must land in a double ring to win.' }],
  'Checkout = Combination of singles, doubles, and trebles that equal the remaining score',
  ['race-pace-calculator', 'skateboard-size-calculator']
);

// =============================================================================
// MUSIC / AUDIO (10)
// =============================================================================

// #11 BPM to Milliseconds Calculator
add('bpm-to-ms-calculator', 'BPM to Milliseconds Calculator',
  'Convert tempo in beats per minute to delay time in milliseconds for music production.',
  'Conversion', 'conversion', 'R',
  ['bpm to ms', 'tempo to delay', 'beat to milliseconds'],
  [
    '{ name: "bpm", label: "Tempo (BPM)", type: "number", min: 20, max: 300, defaultValue: 120 }',
    '{ name: "noteValue", label: "Note Value", type: "select", options: [{value:"1",label:"Whole Note"},{value:"0.5",label:"Half Note"},{value:"0.25",label:"Quarter Note"},{value:"0.125",label:"Eighth Note"},{value:"0.0625",label:"Sixteenth Note"}], defaultValue: "0.25" }',
    '{ name: "dotted", label: "Dotted Note", type: "select", options: [{value:"no",label:"No"},{value:"yes",label:"Yes"}], defaultValue: "no" }',
  ],
  `(inputs) => {
      const bpm = inputs.bpm as number;
      const noteVal = parseFloat(inputs.noteValue as string);
      const dotted = inputs.dotted as string;
      if (!bpm || bpm <= 0) return null;
      const quarterMs = 60000 / bpm;
      let ms = quarterMs * (noteVal / 0.25);
      if (dotted === "yes") ms *= 1.5;
      const hz = 1000 / ms;
      const noteNames: Record<string, string> = { "1": "Whole", "0.5": "Half", "0.25": "Quarter", "0.125": "Eighth", "0.0625": "Sixteenth" };
      const noteName = noteNames[String(noteVal)] || "Quarter";
      return {
        primary: { label: "Delay Time", value: ms.toFixed(1) + " ms" },
        details: [
          { label: "Note Value", value: (dotted === "yes" ? "Dotted " : "") + noteName },
          { label: "Frequency", value: hz.toFixed(3) + " Hz" },
          { label: "Quarter Note", value: quarterMs.toFixed(1) + " ms" },
        ],
      };
    }`,
  [{ q: 'How do I convert BPM to milliseconds?', a: 'Divide 60,000 by the BPM to get the quarter note delay in milliseconds. For example, 120 BPM equals 500 ms per quarter note.' },
   { q: 'Why is BPM to ms conversion useful?', a: 'Musicians and producers use this conversion to set delay effects, reverb times, and other time-based effects to match the tempo of a song.' }],
  'Delay (ms) = (60000 / BPM) x (Note Value / 0.25)',
  ['audio-room-treatment-calculator', 'vinyl-record-speed-calculator']
);

// #12 Audio Room Treatment Calculator
add('audio-room-treatment-calculator', 'Audio Room Treatment Calculator',
  'Calculate the acoustic panel coverage needed to treat a room for recording or mixing.',
  'Everyday', 'everyday', '~',
  ['acoustic treatment', 'room treatment', 'acoustic panel coverage'],
  [
    '{ name: "length", label: "Room Length", type: "number", suffix: "feet", min: 5, max: 100, defaultValue: 15 }',
    '{ name: "width", label: "Room Width", type: "number", suffix: "feet", min: 5, max: 100, defaultValue: 12 }',
    '{ name: "height", label: "Room Height", type: "number", suffix: "feet", min: 6, max: 30, defaultValue: 9 }',
    '{ name: "purpose", label: "Room Purpose", type: "select", options: [{value:"recording",label:"Recording Studio"},{value:"mixing",label:"Mixing Room"},{value:"home",label:"Home Studio"},{value:"podcast",label:"Podcast Room"}], defaultValue: "home" }',
  ],
  `(inputs) => {
      const len = inputs.length as number;
      const wid = inputs.width as number;
      const ht = inputs.height as number;
      const purpose = inputs.purpose as string;
      if (!len || !wid || !ht) return null;
      const wallArea = 2 * (len * ht + wid * ht);
      const ceilingArea = len * wid;
      const totalSurface = wallArea + ceilingArea;
      const coveragePercent: Record<string, number> = { recording: 0.60, mixing: 0.50, home: 0.40, podcast: 0.70 };
      const coverage = coveragePercent[purpose] || 0.40;
      const panelsNeeded = Math.ceil((totalSurface * coverage) / 8);
      const treatmentArea = Math.round(totalSurface * coverage);
      const cost = panelsNeeded * 45;
      return {
        primary: { label: "Panels Needed (2x4 ft)", value: String(panelsNeeded) },
        details: [
          { label: "Treatment Area", value: formatNumber(treatmentArea) + " sq ft" },
          { label: "Total Surface Area", value: formatNumber(Math.round(totalSurface)) + " sq ft" },
          { label: "Estimated Cost", value: "$" + formatNumber(cost) },
        ],
      };
    }`,
  [{ q: 'How much acoustic treatment do I need?', a: 'Most home studios need 40-50% wall coverage with acoustic panels. Professional recording studios may need 50-70% coverage.' },
   { q: 'What size acoustic panels should I use?', a: 'Standard panels are 2x4 feet and 2-4 inches thick. Thicker panels absorb lower frequencies more effectively.' }],
  'Panels = (Total Surface Area x Coverage Percentage) / Panel Size',
  ['subwoofer-box-calculator', 'pa-system-size-calculator']
);

// #13 Vinyl Record Speed Calculator
add('vinyl-record-speed-calculator', 'Vinyl Record Speed Calculator',
  'Calculate adjusted playback speed and pitch change for vinyl records at different RPM settings.',
  'Everyday', 'everyday', '~',
  ['vinyl speed', 'record RPM', 'turntable pitch'],
  [
    '{ name: "originalRpm", label: "Original RPM", type: "select", options: [{value:"33.33",label:"33 1/3 RPM"},{value:"45",label:"45 RPM"},{value:"78",label:"78 RPM"}], defaultValue: "33.33" }',
    '{ name: "playbackRpm", label: "Playback RPM", type: "select", options: [{value:"33.33",label:"33 1/3 RPM"},{value:"45",label:"45 RPM"},{value:"78",label:"78 RPM"}], defaultValue: "45" }',
    '{ name: "trackLength", label: "Track Length", type: "number", suffix: "minutes", min: 0.5, max: 30, defaultValue: 4 }',
  ],
  `(inputs) => {
      const origRpm = parseFloat(inputs.originalRpm as string);
      const playRpm = parseFloat(inputs.playbackRpm as string);
      const trackLen = inputs.trackLength as number;
      if (!origRpm || !playRpm || !trackLen) return null;
      const speedRatio = playRpm / origRpm;
      const pitchChange = (speedRatio - 1) * 100;
      const semitones = 12 * Math.log2(speedRatio);
      const adjustedLength = trackLen / speedRatio;
      return {
        primary: { label: "Speed Change", value: (pitchChange >= 0 ? "+" : "") + pitchChange.toFixed(1) + "%" },
        details: [
          { label: "Pitch Shift", value: (semitones >= 0 ? "+" : "") + semitones.toFixed(1) + " semitones" },
          { label: "Adjusted Track Length", value: adjustedLength.toFixed(2) + " minutes" },
          { label: "Speed Ratio", value: speedRatio.toFixed(3) + "x" },
        ],
      };
    }`,
  [{ q: 'What happens when you play a 33 RPM record at 45 RPM?', a: 'The music plays approximately 35% faster and the pitch rises by about 5 semitones, making everything sound higher and quicker.' },
   { q: 'What are the standard vinyl record speeds?', a: 'The three standard speeds are 33 1/3 RPM for albums, 45 RPM for singles, and 78 RPM for older shellac records.' }],
  'Speed Change = ((Playback RPM / Original RPM) - 1) x 100%',
  ['bpm-to-ms-calculator', 'audio-cable-length-calculator']
);

// #14 PA System Size Calculator
add('pa-system-size-calculator', 'PA System Size Calculator',
  'Determine the appropriate PA system wattage for your venue based on audience size and space.',
  'Everyday', 'everyday', '~',
  ['PA system size', 'PA wattage', 'sound system sizing'],
  [
    '{ name: "audienceSize", label: "Audience Size", type: "number", min: 10, max: 100000, defaultValue: 200 }',
    '{ name: "venueType", label: "Venue Type", type: "select", options: [{value:"indoor",label:"Indoor"},{value:"outdoor",label:"Outdoor"},{value:"tent",label:"Tent/Covered"}], defaultValue: "indoor" }',
    '{ name: "eventType", label: "Event Type", type: "select", options: [{value:"speech",label:"Speech/Presentation"},{value:"acoustic",label:"Acoustic Music"},{value:"band",label:"Live Band"},{value:"dj",label:"DJ/Dance"}], defaultValue: "band" }',
  ],
  `(inputs) => {
      const audience = inputs.audienceSize as number;
      const venue = inputs.venueType as string;
      const event = inputs.eventType as string;
      if (!audience || audience <= 0) return null;
      const wattsPerPerson: Record<string, number> = { speech: 2, acoustic: 5, band: 8, dj: 12 };
      const venueMult: Record<string, number> = { indoor: 1.0, outdoor: 2.5, tent: 1.5 };
      const baseWatts = audience * (wattsPerPerson[event] || 8);
      const totalWatts = Math.round(baseWatts * (venueMult[venue] || 1.0));
      const speakers = Math.ceil(totalWatts / 500);
      const subs = event === "dj" || event === "band" ? Math.ceil(speakers / 2) : 0;
      return {
        primary: { label: "Recommended Wattage", value: formatNumber(totalWatts) + " W" },
        details: [
          { label: "Speakers Needed", value: String(speakers) + " (500W each)" },
          { label: "Subwoofers Needed", value: String(subs) },
          { label: "Audience Size", value: formatNumber(audience) },
        ],
      };
    }`,
  [{ q: 'How many watts do I need for a PA system?', a: 'For a live band indoors, plan about 8 watts per person. For outdoor events, multiply by 2.5 to account for sound dispersion.' },
   { q: 'Do I need subwoofers for a PA system?', a: 'Subwoofers are recommended for live bands and DJ events to reproduce bass frequencies. Speech and acoustic events generally do not need them.' }],
  'Wattage = Audience Size x Watts per Person x Venue Multiplier',
  ['audio-room-treatment-calculator', 'band-booking-calculator']
);

// #15 Piano Tuning Cost Calculator
add('piano-tuning-cost-calculator', 'Piano Tuning Cost Calculator',
  'Estimate the cost of piano tuning and maintenance based on piano type, condition, and location.',
  'Finance', 'finance', '$',
  ['piano tuning cost', 'piano maintenance', 'piano tuning price'],
  [
    '{ name: "pianoType", label: "Piano Type", type: "select", options: [{value:"upright",label:"Upright"},{value:"baby-grand",label:"Baby Grand"},{value:"grand",label:"Grand"},{value:"concert",label:"Concert Grand"}], defaultValue: "upright" }',
    '{ name: "lastTuned", label: "Months Since Last Tuning", type: "number", min: 0, max: 120, defaultValue: 12 }',
    '{ name: "tuningsPerYear", label: "Tunings per Year", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "region", label: "Region", type: "select", options: [{value:"urban",label:"Urban/City"},{value:"suburban",label:"Suburban"},{value:"rural",label:"Rural"}], defaultValue: "suburban" }',
  ],
  `(inputs) => {
      const pianoType = inputs.pianoType as string;
      const monthsSince = inputs.lastTuned as number;
      const tuningsPerYear = inputs.tuningsPerYear as number;
      const region = inputs.region as string;
      if (!tuningsPerYear) return null;
      const baseRate: Record<string, number> = { upright: 120, "baby-grand": 150, grand: 180, concert: 250 };
      const regionMult: Record<string, number> = { urban: 1.3, suburban: 1.0, rural: 0.85 };
      const base = (baseRate[pianoType] || 120) * (regionMult[region] || 1.0);
      const pitchRaise = monthsSince > 24 ? 75 : monthsSince > 12 ? 40 : 0;
      const perTuning = Math.round(base + pitchRaise);
      const annualCost = perTuning * tuningsPerYear;
      return {
        primary: { label: "Cost per Tuning", value: "$" + formatNumber(perTuning) },
        details: [
          { label: "Annual Cost", value: "$" + formatNumber(annualCost) },
          { label: "Pitch Raise Fee", value: pitchRaise > 0 ? "$" + pitchRaise : "None needed" },
          { label: "Tunings per Year", value: String(tuningsPerYear) },
        ],
      };
    }`,
  [{ q: 'How much does piano tuning cost?', a: 'A standard piano tuning costs $100-$200 for an upright and $150-$300 for a grand piano. Neglected pianos may need a pitch raise at additional cost.' },
   { q: 'How often should a piano be tuned?', a: 'Most manufacturers recommend tuning a piano at least twice per year. New pianos may need tuning 3-4 times in the first year.' }],
  'Tuning Cost = Base Rate x Region Multiplier + Pitch Raise Fee',
  ['music-lesson-cost-calculator', 'recording-studio-cost-calculator']
);

// #16 Music Lesson Cost Calculator
add('music-lesson-cost-calculator', 'Music Lesson Cost Calculator',
  'Compare music lesson costs based on instrument, lesson duration, instructor level, and frequency.',
  'Finance', 'finance', '$',
  ['music lesson cost', 'music teacher price', 'instrument lesson cost'],
  [
    '{ name: "instrument", label: "Instrument", type: "select", options: [{value:"piano",label:"Piano"},{value:"guitar",label:"Guitar"},{value:"violin",label:"Violin"},{value:"voice",label:"Voice"},{value:"drums",label:"Drums"}], defaultValue: "piano" }',
    '{ name: "duration", label: "Lesson Duration", type: "select", options: [{value:"30",label:"30 Minutes"},{value:"45",label:"45 Minutes"},{value:"60",label:"60 Minutes"}], defaultValue: "60" }',
    '{ name: "level", label: "Instructor Level", type: "select", options: [{value:"student",label:"Student Teacher"},{value:"professional",label:"Professional"},{value:"expert",label:"Expert/Masters"}], defaultValue: "professional" }',
    '{ name: "lessonsPerMonth", label: "Lessons per Month", type: "number", min: 1, max: 12, defaultValue: 4 }',
  ],
  `(inputs) => {
      const instrument = inputs.instrument as string;
      const duration = parseInt(inputs.duration as string);
      const level = inputs.level as string;
      const perMonth = inputs.lessonsPerMonth as number;
      if (!perMonth || !duration) return null;
      const baseRate: Record<string, number> = { piano: 50, guitar: 45, violin: 55, voice: 50, drums: 45 };
      const levelMult: Record<string, number> = { student: 0.6, professional: 1.0, expert: 1.6 };
      const durationMult = duration / 60;
      const perLesson = Math.round((baseRate[instrument] || 50) * (levelMult[level] || 1.0) * durationMult);
      const monthly = perLesson * perMonth;
      const annual = monthly * 12;
      return {
        primary: { label: "Cost per Lesson", value: "$" + formatNumber(perLesson) },
        details: [
          { label: "Monthly Cost", value: "$" + formatNumber(monthly) },
          { label: "Annual Cost", value: "$" + formatNumber(annual) },
          { label: "Lesson Duration", value: duration + " minutes" },
        ],
      };
    }`,
  [{ q: 'How much do music lessons cost?', a: 'Private music lessons typically range from $30 to $80 per hour depending on the instrument, instructor qualifications, and location.' },
   { q: 'Are shorter music lessons worth it?', a: 'Thirty-minute lessons work well for young beginners while 60-minute lessons are better for intermediate and advanced students who need more practice time.' }],
  'Lesson Cost = Base Rate x Level Multiplier x (Duration / 60)',
  ['piano-tuning-cost-calculator', 'band-booking-calculator']
);

// #17 Band Booking Calculator
add('band-booking-calculator', 'Band Booking Calculator',
  'Estimate the cost of booking a live band for an event based on band size, event duration, and type.',
  'Finance', 'finance', '$',
  ['band booking cost', 'live band price', 'wedding band cost'],
  [
    '{ name: "bandSize", label: "Band Members", type: "number", min: 1, max: 20, defaultValue: 5 }',
    '{ name: "hours", label: "Performance Hours", type: "number", min: 1, max: 8, defaultValue: 4 }',
    '{ name: "eventType", label: "Event Type", type: "select", options: [{value:"wedding",label:"Wedding"},{value:"corporate",label:"Corporate Event"},{value:"private",label:"Private Party"},{value:"festival",label:"Festival/Public"}], defaultValue: "wedding" }',
    '{ name: "genre", label: "Genre", type: "select", options: [{value:"cover",label:"Cover Band"},{value:"jazz",label:"Jazz/Classical"},{value:"rock",label:"Rock/Pop"},{value:"dj",label:"DJ + Live Musician"}], defaultValue: "cover" }',
  ],
  `(inputs) => {
      const members = inputs.bandSize as number;
      const hours = inputs.hours as number;
      const event = inputs.eventType as string;
      const genre = inputs.genre as string;
      if (!members || !hours) return null;
      const perMemberHour = 100;
      const eventMult: Record<string, number> = { wedding: 1.5, corporate: 1.3, private: 1.0, festival: 0.9 };
      const genreMult: Record<string, number> = { cover: 1.0, jazz: 1.2, rock: 1.0, dj: 0.8 };
      const base = members * hours * perMemberHour;
      const total = Math.round(base * (eventMult[event] || 1.0) * (genreMult[genre] || 1.0));
      const perHour = Math.round(total / hours);
      const deposit = Math.round(total * 0.25);
      return {
        primary: { label: "Estimated Total", value: "$" + formatNumber(total) },
        details: [
          { label: "Cost per Hour", value: "$" + formatNumber(perHour) },
          { label: "Typical Deposit", value: "$" + formatNumber(deposit) + " (25%)" },
          { label: "Band Size", value: members + " members" },
        ],
      };
    }`,
  [{ q: 'How much does it cost to hire a band?', a: 'A typical 4-5 piece cover band costs $2,000-$5,000 for a 3-4 hour event. Wedding bands often charge a premium over other event types.' },
   { q: 'How far in advance should I book a band?', a: 'Popular bands should be booked 6-12 months in advance for weddings and major events. Corporate events typically need 2-3 months lead time.' }],
  'Total = Band Members x Hours x Rate per Member Hour x Event Multiplier x Genre Multiplier',
  ['recording-studio-cost-calculator', 'music-lesson-cost-calculator']
);

// #18 Recording Studio Cost Calculator
add('recording-studio-cost-calculator', 'Recording Studio Cost Calculator',
  'Estimate the cost of recording studio time based on studio tier, session length, and services needed.',
  'Finance', 'finance', '$',
  ['recording studio cost', 'studio time price', 'music recording cost'],
  [
    '{ name: "studioTier", label: "Studio Tier", type: "select", options: [{value:"home",label:"Home Studio"},{value:"project",label:"Project Studio"},{value:"professional",label:"Professional Studio"},{value:"premium",label:"Premium/Major Studio"}], defaultValue: "professional" }',
    '{ name: "hours", label: "Session Hours", type: "number", min: 1, max: 100, defaultValue: 8 }',
    '{ name: "engineer", label: "Engineer Included", type: "select", options: [{value:"yes",label:"Yes"},{value:"no",label:"No (Self-Operated)"}], defaultValue: "yes" }',
    '{ name: "mixing", label: "Mixing/Mastering", type: "select", options: [{value:"none",label:"None"},{value:"mixing",label:"Mixing Only"},{value:"both",label:"Mixing and Mastering"}], defaultValue: "both" }',
  ],
  `(inputs) => {
      const tier = inputs.studioTier as string;
      const hours = inputs.hours as number;
      const engineer = inputs.engineer as string;
      const mixing = inputs.mixing as string;
      if (!hours || hours <= 0) return null;
      const hourlyRate: Record<string, number> = { home: 25, project: 50, professional: 100, premium: 250 };
      const rate = hourlyRate[tier] || 100;
      let studioCost = rate * hours;
      if (engineer === "yes") studioCost += hours * 40;
      let mixMasterCost = 0;
      if (mixing === "mixing") mixMasterCost = 500;
      if (mixing === "both") mixMasterCost = 1000;
      const total = studioCost + mixMasterCost;
      return {
        primary: { label: "Total Studio Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Studio Time", value: "$" + formatNumber(studioCost) },
          { label: "Mixing/Mastering", value: mixMasterCost > 0 ? "$" + formatNumber(mixMasterCost) : "Not included" },
          { label: "Hourly Rate", value: "$" + formatNumber(rate) + "/hr" },
        ],
      };
    }`,
  [{ q: 'How much does studio time cost?', a: 'Studio rates range from $25/hour for home studios to $250+ per hour for premium facilities. Most professional studios charge $75-$150 per hour.' },
   { q: 'Is mixing and mastering included in studio time?', a: 'Most studios charge separately for mixing and mastering. Mixing typically costs $300-$800 per song and mastering $50-$200 per song.' }],
  'Total = (Hourly Rate x Hours) + Engineer Fee + Mixing/Mastering Cost',
  ['band-booking-calculator', 'piano-tuning-cost-calculator']
);

// #19 Audio Cable Length Calculator
add('audio-cable-length-calculator', 'Audio Cable Length Calculator',
  'Calculate the optimal audio cable length for your setup including signal loss considerations.',
  'Everyday', 'everyday', '~',
  ['audio cable length', 'cable run length', 'signal loss cable'],
  [
    '{ name: "distance", label: "Straight-Line Distance", type: "number", suffix: "feet", min: 1, max: 1000, defaultValue: 25 }',
    '{ name: "cableType", label: "Cable Type", type: "select", options: [{value:"xlr",label:"XLR (Balanced)"},{value:"ts",label:"TS/TRS (Unbalanced)"},{value:"speaker",label:"Speaker Cable"},{value:"rca",label:"RCA"}], defaultValue: "xlr" }',
    '{ name: "routing", label: "Routing Complexity", type: "select", options: [{value:"direct",label:"Direct Run"},{value:"moderate",label:"Some Turns"},{value:"complex",label:"Many Turns/Walls"}], defaultValue: "moderate" }',
  ],
  `(inputs) => {
      const distance = inputs.distance as number;
      const cableType = inputs.cableType as string;
      const routing = inputs.routing as string;
      if (!distance || distance <= 0) return null;
      const routingMult: Record<string, number> = { direct: 1.1, moderate: 1.3, complex: 1.6 };
      const actualLength = Math.ceil(distance * (routingMult[routing] || 1.3));
      const maxLength: Record<string, number> = { xlr: 200, ts: 25, speaker: 50, rca: 20 };
      const maxRun = maxLength[cableType] || 50;
      const signalLoss = cableType === "xlr" ? "Minimal" : actualLength > maxRun ? "Significant" : "Acceptable";
      const recommendation = actualLength > maxRun ? "Consider using balanced (XLR) cables for this distance" : "Cable length is within recommended range";
      return {
        primary: { label: "Recommended Length", value: formatNumber(actualLength) + " ft" },
        details: [
          { label: "Max Recommended Run", value: maxRun + " ft" },
          { label: "Signal Quality", value: signalLoss },
          { label: "Recommendation", value: recommendation },
        ],
      };
    }`,
  [{ q: 'How long can an audio cable be?', a: 'Balanced XLR cables can run up to 200 feet with minimal signal loss. Unbalanced cables like TS and RCA should be kept under 20-25 feet.' },
   { q: 'Does cable length affect sound quality?', a: 'Yes, longer unbalanced cables pick up more noise and lose high frequencies. Balanced cables resist interference and can run much longer distances.' }],
  'Recommended Length = Straight-Line Distance x Routing Multiplier',
  ['vinyl-record-speed-calculator', 'subwoofer-box-calculator']
);

// #20 Subwoofer Box Calculator
add('subwoofer-box-calculator', 'Subwoofer Box Calculator',
  'Calculate the optimal enclosure volume for a subwoofer based on driver size and box type.',
  'Science', 'science', 'A',
  ['subwoofer box', 'sub enclosure', 'speaker box volume'],
  [
    '{ name: "driverSize", label: "Driver Size", type: "select", options: [{value:"8",label:"8 inch"},{value:"10",label:"10 inch"},{value:"12",label:"12 inch"},{value:"15",label:"15 inch"},{value:"18",label:"18 inch"}], defaultValue: "12" }',
    '{ name: "boxType", label: "Box Type", type: "select", options: [{value:"sealed",label:"Sealed"},{value:"ported",label:"Ported"},{value:"bandpass",label:"Bandpass"}], defaultValue: "ported" }',
    '{ name: "quantity", label: "Number of Drivers", type: "number", min: 1, max: 4, defaultValue: 1 }',
    '{ name: "power", label: "RMS Power", type: "number", suffix: "watts", min: 50, max: 5000, defaultValue: 500 }',
  ],
  `(inputs) => {
      const driverSize = parseInt(inputs.driverSize as string);
      const boxType = inputs.boxType as string;
      const qty = inputs.quantity as number;
      const power = inputs.power as number;
      if (!driverSize || !qty) return null;
      const sealedVol: Record<number, number> = { 8: 0.5, 10: 0.75, 12: 1.25, 15: 2.5, 18: 4.0 };
      const portedMult: Record<string, number> = { sealed: 1.0, ported: 1.5, bandpass: 1.8 };
      const volPerDriver = (sealedVol[driverSize] || 1.25) * (portedMult[boxType] || 1.0);
      const totalVol = volPerDriver * qty;
      const cubicInches = Math.round(totalVol * 1728);
      const portDiameter = boxType === "ported" ? Math.round(driverSize * 0.3 + 1) + " inches" : "N/A";
      return {
        primary: { label: "Box Volume", value: totalVol.toFixed(2) + " cu ft" },
        details: [
          { label: "Volume in Cubic Inches", value: formatNumber(cubicInches) + " cu in" },
          { label: "Port Diameter", value: portDiameter },
          { label: "RMS Power", value: formatNumber(power) + " W" },
        ],
      };
    }`,
  [{ q: 'How big should a subwoofer box be?', a: 'Box volume depends on the driver size and enclosure type. A 12-inch driver typically needs 1.25 cu ft sealed or 1.75-2.0 cu ft ported.' },
   { q: 'Is a sealed or ported box better?', a: 'Sealed boxes produce tighter, more accurate bass while ported boxes are louder and more efficient at the cost of some precision.' }],
  'Box Volume = Base Volume per Driver x Box Type Multiplier x Number of Drivers',
  ['audio-room-treatment-calculator', 'audio-cable-length-calculator']
);

// =============================================================================
// SEASONAL / WEATHER (10)
// =============================================================================

// #21 Snow Load Roof Calculator
add('snow-load-roof-calculator', 'Snow Load Roof Calculator',
  'Calculate the snow load stress on your roof based on snow depth, density, and roof area.',
  'Science', 'science', 'A',
  ['snow load', 'roof snow weight', 'snow load calculation'],
  [
    '{ name: "roofArea", label: "Roof Area", type: "number", suffix: "sq ft", min: 100, max: 50000, defaultValue: 2000 }',
    '{ name: "snowDepth", label: "Snow Depth", type: "number", suffix: "inches", min: 1, max: 120, defaultValue: 12 }',
    '{ name: "snowType", label: "Snow Type", type: "select", options: [{value:"fresh",label:"Fresh/Light Snow"},{value:"packed",label:"Packed Snow"},{value:"wet",label:"Wet/Heavy Snow"},{value:"ice",label:"Ice Crust"}], defaultValue: "packed" }',
    '{ name: "roofPitch", label: "Roof Pitch", type: "select", options: [{value:"flat",label:"Flat (0-2/12)"},{value:"low",label:"Low (3-5/12)"},{value:"medium",label:"Medium (6-8/12)"},{value:"steep",label:"Steep (9-12/12)"}], defaultValue: "medium" }',
  ],
  `(inputs) => {
      const area = inputs.roofArea as number;
      const depth = inputs.snowDepth as number;
      const snowType = inputs.snowType as string;
      const pitch = inputs.roofPitch as string;
      if (!area || !depth) return null;
      const densityPcf: Record<string, number> = { fresh: 5, packed: 15, wet: 30, ice: 57 };
      const pitchFactor: Record<string, number> = { flat: 1.0, low: 0.85, medium: 0.6, steep: 0.3 };
      const density = densityPcf[snowType] || 15;
      const pFactor = pitchFactor[pitch] || 0.6;
      const psfLoad = (depth / 12) * density * pFactor;
      const totalWeight = Math.round(psfLoad * area);
      const safeLimit = 30;
      const status = psfLoad > safeLimit ? "DANGER - Exceeds typical limit" : psfLoad > 20 ? "Caution - Monitor closely" : "Within safe range";
      return {
        primary: { label: "Snow Load", value: psfLoad.toFixed(1) + " psf" },
        details: [
          { label: "Total Weight on Roof", value: formatNumber(totalWeight) + " lbs" },
          { label: "Status", value: status },
          { label: "Snow Density", value: density + " pcf" },
        ],
      };
    }`,
  [{ q: 'How much snow can a roof hold?', a: 'Most residential roofs can support 20-30 pounds per square foot of snow load. Flat roofs are more vulnerable than steep roofs because snow accumulates more.' },
   { q: 'When should I remove snow from my roof?', a: 'Consider removing snow when the load exceeds 20 psf or when you notice doors sticking, cracks in walls, or creaking sounds from the structure.' }],
  'Snow Load (psf) = (Snow Depth / 12) x Snow Density x Pitch Factor',
  ['ice-dam-prevention-calculator', 'winter-heating-cost-calculator']
);

// #22 Ice Dam Prevention Calculator
add('ice-dam-prevention-calculator', 'Ice Dam Prevention Calculator',
  'Estimate the cost and materials needed to prevent ice dams on your roof.',
  'Everyday', 'everyday', '~',
  ['ice dam prevention', 'ice dam cost', 'roof ice prevention'],
  [
    '{ name: "roofEdge", label: "Roof Edge Length", type: "number", suffix: "feet", min: 10, max: 500, defaultValue: 80 }',
    '{ name: "method", label: "Prevention Method", type: "select", options: [{value:"cables",label:"Heat Cables"},{value:"membrane",label:"Ice/Water Shield Membrane"},{value:"ventilation",label:"Improved Ventilation"},{value:"all",label:"All Methods"}], defaultValue: "cables" }',
    '{ name: "stories", label: "Number of Stories", type: "select", options: [{value:"1",label:"1 Story"},{value:"2",label:"2 Stories"},{value:"3",label:"3 Stories"}], defaultValue: "2" }',
  ],
  `(inputs) => {
      const edge = inputs.roofEdge as number;
      const method = inputs.method as string;
      const stories = parseInt(inputs.stories as string);
      if (!edge || edge <= 0) return null;
      const cableCost = edge * 8;
      const membraneCost = edge * 3 * 15;
      const ventCost = 1500;
      const storyMult = 1 + (stories - 1) * 0.25;
      let total = 0;
      if (method === "cables") total = cableCost;
      else if (method === "membrane") total = membraneCost;
      else if (method === "ventilation") total = ventCost;
      else total = cableCost + membraneCost + ventCost;
      total = Math.round(total * storyMult);
      const annualEnergy = method === "cables" || method === "all" ? Math.round(edge * 0.5 * 4 * 0.12 * 120) : 0;
      return {
        primary: { label: "Prevention Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Roof Edge", value: formatNumber(edge) + " ft" },
          { label: "Annual Energy Cost", value: annualEnergy > 0 ? "$" + formatNumber(annualEnergy) : "N/A" },
          { label: "Height Factor", value: storyMult.toFixed(2) + "x" },
        ],
      };
    }`,
  [{ q: 'How do you prevent ice dams?', a: 'The most effective prevention combines proper attic insulation, adequate ventilation, and heat cables along the roof edge and gutters.' },
   { q: 'How much do heat cables cost?', a: 'Heat cables typically cost $5-$12 per linear foot installed, plus ongoing electricity costs of $30-$100 per season.' }],
  'Cost = Method Base Cost x Roof Edge Length x Story Multiplier',
  ['snow-load-roof-calculator', 'winter-heating-cost-calculator']
);

// #23 Winter Heating Cost Calculator
add('winter-heating-cost-calculator', 'Winter Heating Cost Calculator',
  'Estimate your seasonal heating expenses based on home size, fuel type, and climate zone.',
  'Finance', 'finance', '$',
  ['winter heating cost', 'heating bill estimate', 'seasonal heating expense'],
  [
    '{ name: "homeSize", label: "Home Size", type: "number", suffix: "sq ft", min: 200, max: 20000, defaultValue: 2000 }',
    '{ name: "fuelType", label: "Fuel Type", type: "select", options: [{value:"gas",label:"Natural Gas"},{value:"electric",label:"Electric"},{value:"oil",label:"Heating Oil"},{value:"propane",label:"Propane"}], defaultValue: "gas" }',
    '{ name: "climate", label: "Climate Zone", type: "select", options: [{value:"mild",label:"Mild (3000-4000 HDD)"},{value:"moderate",label:"Moderate (5000-6000 HDD)"},{value:"cold",label:"Cold (7000-8000 HDD)"},{value:"severe",label:"Severe (9000+ HDD)"}], defaultValue: "moderate" }',
    '{ name: "insulation", label: "Insulation Quality", type: "select", options: [{value:"poor",label:"Poor/Old"},{value:"average",label:"Average"},{value:"good",label:"Good/New"},{value:"excellent",label:"Excellent/Upgraded"}], defaultValue: "average" }',
  ],
  `(inputs) => {
      const size = inputs.homeSize as number;
      const fuel = inputs.fuelType as string;
      const climate = inputs.climate as string;
      const insulation = inputs.insulation as string;
      if (!size || size <= 0) return null;
      const baseCostPerSqFt: Record<string, number> = { gas: 0.45, electric: 0.65, oil: 0.55, propane: 0.60 };
      const climateMult: Record<string, number> = { mild: 0.6, moderate: 1.0, cold: 1.5, severe: 2.0 };
      const insulationMult: Record<string, number> = { poor: 1.4, average: 1.0, good: 0.75, excellent: 0.55 };
      const base = size * (baseCostPerSqFt[fuel] || 0.45);
      const seasonal = Math.round(base * (climateMult[climate] || 1.0) * (insulationMult[insulation] || 1.0));
      const monthly = Math.round(seasonal / 5);
      const daily = (seasonal / 150).toFixed(2);
      return {
        primary: { label: "Seasonal Heating Cost", value: "$" + formatNumber(seasonal) },
        details: [
          { label: "Average Monthly Cost", value: "$" + formatNumber(monthly) },
          { label: "Average Daily Cost", value: "$" + daily },
          { label: "Cost per Sq Ft", value: "$" + (seasonal / size).toFixed(2) },
        ],
      };
    }`,
  [{ q: 'How much does it cost to heat a home in winter?', a: 'The average US household spends $500-$1,500 on winter heating. Costs vary greatly by climate zone, fuel type, and home insulation.' },
   { q: 'Which heating fuel is cheapest?', a: 'Natural gas is typically the least expensive heating fuel, followed by electric heat pumps. Heating oil and propane tend to cost more per BTU.' }],
  'Seasonal Cost = Home Size x Fuel Rate x Climate Factor x Insulation Factor',
  ['summer-cooling-cost-calculator', 'snow-load-roof-calculator']
);

// #24 Summer Cooling Cost Calculator
add('summer-cooling-cost-calculator', 'Summer Cooling Cost Calculator',
  'Estimate your seasonal air conditioning expenses based on home size, efficiency, and climate.',
  'Finance', 'finance', '$',
  ['summer cooling cost', 'AC cost estimate', 'air conditioning bill'],
  [
    '{ name: "homeSize", label: "Home Size", type: "number", suffix: "sq ft", min: 200, max: 20000, defaultValue: 2000 }',
    '{ name: "acType", label: "AC Type", type: "select", options: [{value:"central",label:"Central AC"},{value:"window",label:"Window Unit"},{value:"mini-split",label:"Mini-Split"},{value:"evaporative",label:"Evaporative Cooler"}], defaultValue: "central" }',
    '{ name: "climate", label: "Climate Zone", type: "select", options: [{value:"mild",label:"Mild (500-1000 CDD)"},{value:"moderate",label:"Moderate (1500-2000 CDD)"},{value:"hot",label:"Hot (2500-3000 CDD)"},{value:"extreme",label:"Extreme (3500+ CDD)"}], defaultValue: "moderate" }',
    '{ name: "electricRate", label: "Electric Rate", type: "number", suffix: "cents/kWh", min: 5, max: 50, defaultValue: 13 }',
  ],
  `(inputs) => {
      const size = inputs.homeSize as number;
      const acType = inputs.acType as string;
      const climate = inputs.climate as string;
      const rate = inputs.electricRate as number;
      if (!size || !rate) return null;
      const kwhPerSqFt: Record<string, number> = { central: 1.5, window: 2.0, "mini-split": 1.2, evaporative: 0.5 };
      const climateMult: Record<string, number> = { mild: 0.5, moderate: 1.0, hot: 1.8, extreme: 2.5 };
      const kwh = size * (kwhPerSqFt[acType] || 1.5) * (climateMult[climate] || 1.0);
      const seasonal = Math.round(kwh * (rate / 100));
      const monthly = Math.round(seasonal / 4);
      const daily = (seasonal / 120).toFixed(2);
      return {
        primary: { label: "Seasonal Cooling Cost", value: "$" + formatNumber(seasonal) },
        details: [
          { label: "Average Monthly Cost", value: "$" + formatNumber(monthly) },
          { label: "Average Daily Cost", value: "$" + daily },
          { label: "Estimated kWh Used", value: formatNumber(Math.round(kwh)) },
        ],
      };
    }`,
  [{ q: 'How much does air conditioning cost per month?', a: 'Average AC costs range from $60-$200 per month depending on climate, home size, and system efficiency. Hot climates can see bills over $300.' },
   { q: 'Which AC type is most efficient?', a: 'Mini-split systems and modern central AC units with high SEER ratings are the most efficient. Evaporative coolers use less electricity but only work in dry climates.' }],
  'Seasonal Cost = Home Size x kWh per Sq Ft x Climate Factor x Electric Rate',
  ['winter-heating-cost-calculator', 'lawn-watering-cost-calculator']
);

// #25 Lawn Watering Cost Calculator
add('lawn-watering-cost-calculator', 'Lawn Watering Cost Calculator',
  'Calculate your lawn irrigation water usage and cost based on lawn size, climate, and watering schedule.',
  'Everyday', 'everyday', '~',
  ['lawn watering cost', 'irrigation cost', 'lawn water usage'],
  [
    '{ name: "lawnSize", label: "Lawn Size", type: "number", suffix: "sq ft", min: 100, max: 100000, defaultValue: 5000 }',
    '{ name: "waterRate", label: "Water Rate", type: "number", suffix: "per 1000 gal", min: 1, max: 30, defaultValue: 5 }',
    '{ name: "weeklyFreq", label: "Watering Days per Week", type: "number", min: 1, max: 7, defaultValue: 3 }',
    '{ name: "climate", label: "Climate", type: "select", options: [{value:"cool",label:"Cool/Humid"},{value:"moderate",label:"Moderate"},{value:"warm",label:"Warm/Dry"},{value:"hot",label:"Hot/Arid"}], defaultValue: "moderate" }',
  ],
  `(inputs) => {
      const size = inputs.lawnSize as number;
      const rate = inputs.waterRate as number;
      const freq = inputs.weeklyFreq as number;
      const climate = inputs.climate as string;
      if (!size || !rate || !freq) return null;
      const inchesPerWeek: Record<string, number> = { cool: 0.75, moderate: 1.0, warm: 1.5, hot: 2.0 };
      const needed = inchesPerWeek[climate] || 1.0;
      const gallonsPerInchPerSqFt = 0.623;
      const weeklyGallons = Math.round(size * needed * gallonsPerInchPerSqFt);
      const monthlyGallons = weeklyGallons * 4.33;
      const monthlyCost = Math.round((monthlyGallons / 1000) * rate);
      const seasonalCost = monthlyCost * 5;
      return {
        primary: { label: "Monthly Water Cost", value: "$" + formatNumber(monthlyCost) },
        details: [
          { label: "Seasonal Cost (5 months)", value: "$" + formatNumber(seasonalCost) },
          { label: "Weekly Water Use", value: formatNumber(weeklyGallons) + " gallons" },
          { label: "Inches per Week Needed", value: needed.toFixed(2) + " inches" },
        ],
      };
    }`,
  [{ q: 'How much does it cost to water a lawn?', a: 'Lawn watering typically costs $20-$100 per month depending on lawn size, water rates, and climate. Hot arid regions cost significantly more.' },
   { q: 'How often should I water my lawn?', a: 'Most lawns need about 1 inch of water per week. It is better to water deeply 2-3 times per week rather than lightly every day.' }],
  'Monthly Cost = (Lawn Size x Inches Needed x 0.623 gal/in/sqft x 4.33 weeks) / 1000 x Water Rate',
  ['summer-cooling-cost-calculator', 'frost-date-calculator']
);

// #26 Snow Blower Size Calculator
add('snow-blower-size-calculator', 'Snow Blower Size Calculator',
  'Determine the right snow blower size and type based on driveway dimensions and snowfall amounts.',
  'Everyday', 'everyday', '~',
  ['snow blower size', 'snowblower sizing', 'snow thrower selection'],
  [
    '{ name: "drivewayLength", label: "Driveway Length", type: "number", suffix: "feet", min: 10, max: 500, defaultValue: 50 }',
    '{ name: "drivewayWidth", label: "Driveway Width", type: "number", suffix: "feet", min: 5, max: 100, defaultValue: 20 }',
    '{ name: "avgSnowfall", label: "Average Snowfall per Event", type: "number", suffix: "inches", min: 1, max: 36, defaultValue: 8 }',
    '{ name: "surface", label: "Surface Type", type: "select", options: [{value:"paved",label:"Paved/Concrete"},{value:"gravel",label:"Gravel"},{value:"mixed",label:"Mixed"}], defaultValue: "paved" }',
  ],
  `(inputs) => {
      const length = inputs.drivewayLength as number;
      const width = inputs.drivewayWidth as number;
      const snow = inputs.avgSnowfall as number;
      const surface = inputs.surface as string;
      if (!length || !width || !snow) return null;
      const area = length * width;
      let type = "Single-Stage Electric";
      let clearWidth = 18;
      let priceRange = "$150-$300";
      if (area > 4000 || snow > 12) {
        type = "Three-Stage Gas";
        clearWidth = 30;
        priceRange = "$1,200-$2,500";
      } else if (area > 2000 || snow > 8) {
        type = "Two-Stage Gas";
        clearWidth = 26;
        priceRange = "$600-$1,500";
      } else if (area > 800 || snow > 6) {
        type = "Single-Stage Gas";
        clearWidth = 22;
        priceRange = "$300-$600";
      }
      if (surface === "gravel") type += " (with skid shoes)";
      const passes = Math.ceil(width / (clearWidth / 12));
      return {
        primary: { label: "Recommended Type", value: type },
        details: [
          { label: "Clearing Width", value: clearWidth + " inches" },
          { label: "Passes Needed", value: String(passes) },
          { label: "Price Range", value: priceRange },
        ],
      };
    }`,
  [{ q: 'What size snow blower do I need?', a: 'For small driveways with light snow, a single-stage electric is sufficient. Large driveways with heavy snowfall need a two-stage or three-stage gas model.' },
   { q: 'Can I use a snow blower on gravel?', a: 'Two-stage snow blowers work on gravel because the auger does not touch the ground. Single-stage models can pick up rocks and should be avoided on gravel.' }],
  'Type = Based on Driveway Area and Average Snowfall Depth',
  ['snow-load-roof-calculator', 'ice-dam-prevention-calculator']
);

// #27 Hurricane Prep Cost Calculator
add('hurricane-prep-cost-calculator', 'Hurricane Prep Cost Calculator',
  'Estimate the cost of hurricane preparation including supplies, shutters, and emergency provisions.',
  'Everyday', 'everyday', '~',
  ['hurricane prep cost', 'hurricane preparation', 'storm preparation cost'],
  [
    '{ name: "homeSize", label: "Home Size", type: "number", suffix: "sq ft", min: 500, max: 20000, defaultValue: 2000 }',
    '{ name: "occupants", label: "Number of Occupants", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "protection", label: "Window Protection", type: "select", options: [{value:"plywood",label:"Plywood Boards"},{value:"shutters",label:"Storm Shutters"},{value:"impact",label:"Impact Windows"},{value:"none",label:"None"}], defaultValue: "shutters" }',
    '{ name: "generator", label: "Generator", type: "select", options: [{value:"none",label:"None"},{value:"portable",label:"Portable Generator"},{value:"standby",label:"Standby Generator"}], defaultValue: "portable" }',
  ],
  `(inputs) => {
      const size = inputs.homeSize as number;
      const people = inputs.occupants as number;
      const protection = inputs.protection as string;
      const generator = inputs.generator as string;
      if (!size || !people) return null;
      const supplyKit = people * 75;
      const waterCost = people * 14 * 2;
      const foodCost = people * 10 * 7;
      const protectionCost: Record<string, number> = { plywood: size * 0.5, shutters: size * 3, impact: size * 15, none: 0 };
      const genCost: Record<string, number> = { none: 0, portable: 800, standby: 5000 };
      const windowCost = protectionCost[protection] || 0;
      const generatorCost = genCost[generator] || 0;
      const supplies = supplyKit + waterCost + foodCost;
      const total = Math.round(supplies + windowCost + generatorCost);
      return {
        primary: { label: "Total Prep Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Emergency Supplies", value: "$" + formatNumber(Math.round(supplies)) },
          { label: "Window Protection", value: "$" + formatNumber(Math.round(windowCost)) },
          { label: "Generator", value: generatorCost > 0 ? "$" + formatNumber(generatorCost) : "None" },
        ],
      };
    }`,
  [{ q: 'How much does hurricane preparation cost?', a: 'Basic hurricane preparation costs $200-$500 for supplies. Adding storm shutters and a generator can bring total costs to $2,000-$10,000 or more.' },
   { q: 'What supplies do I need for a hurricane?', a: 'Essential supplies include water (1 gallon per person per day for 14 days), non-perishable food, flashlights, batteries, first aid kit, and important documents.' }],
  'Total = Emergency Supplies + Window Protection + Generator Cost',
  ['flood-damage-calculator', 'wildfire-prep-calculator']
);

// #28 Wildfire Preparedness Calculator
add('wildfire-prep-calculator', 'Wildfire Preparedness Calculator',
  'Estimate the cost of wildfire preparation including defensible space, ember-resistant materials, and evacuation supplies.',
  'Everyday', 'everyday', '~',
  ['wildfire preparation', 'wildfire defense cost', 'fire preparedness'],
  [
    '{ name: "lotSize", label: "Lot Size", type: "number", suffix: "acres", min: 0.1, max: 100, defaultValue: 0.5 }',
    '{ name: "vegetation", label: "Vegetation Density", type: "select", options: [{value:"light",label:"Light/Grass"},{value:"moderate",label:"Moderate/Shrubs"},{value:"heavy",label:"Heavy/Forest"}], defaultValue: "moderate" }',
    '{ name: "roofType", label: "Roof Material", type: "select", options: [{value:"metal",label:"Metal (Fire Resistant)"},{value:"tile",label:"Tile (Fire Resistant)"},{value:"asphalt",label:"Asphalt Shingle"},{value:"wood",label:"Wood Shake"}], defaultValue: "asphalt" }',
    '{ name: "occupants", label: "Number of Occupants", type: "number", min: 1, max: 12, defaultValue: 4 }',
  ],
  `(inputs) => {
      const lot = inputs.lotSize as number;
      const veg = inputs.vegetation as string;
      const roof = inputs.roofType as string;
      const people = inputs.occupants as number;
      if (!lot || !people) return null;
      const clearingCost: Record<string, number> = { light: 500, moderate: 2000, heavy: 5000 };
      const roofUpgrade: Record<string, number> = { metal: 0, tile: 0, asphalt: 3000, wood: 8000 };
      const defensible = Math.round((clearingCost[veg] || 2000) * lot);
      const roofCost = roofUpgrade[roof] || 0;
      const evacKit = people * 100;
      const ventScreens = 800;
      const total = defensible + roofCost + evacKit + ventScreens;
      return {
        primary: { label: "Total Prep Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Defensible Space", value: "$" + formatNumber(defensible) },
          { label: "Roof Upgrade", value: roofCost > 0 ? "$" + formatNumber(roofCost) : "Already fire-resistant" },
          { label: "Evacuation Kits", value: "$" + formatNumber(evacKit) },
        ],
      };
    }`,
  [{ q: 'How do I create defensible space around my home?', a: 'Clear flammable vegetation within 30 feet of your home, thin trees within 100 feet, and maintain a gravel or hardscape zone within 5 feet of the foundation.' },
   { q: 'What is the most fire-resistant roofing?', a: 'Metal and tile roofs are Class A fire-rated and most resistant to embers. Wood shake roofs are the most vulnerable and should be replaced in fire-prone areas.' }],
  'Total = Defensible Space Cost + Roof Upgrade + Evacuation Kits + Vent Screens',
  ['hurricane-prep-cost-calculator', 'flood-damage-calculator']
);

// #29 Flood Damage Estimate Calculator
add('flood-damage-calculator', 'Flood Damage Estimate Calculator',
  'Estimate potential flood damage costs based on water depth, home value, and building characteristics.',
  'Finance', 'finance', '$',
  ['flood damage cost', 'flood damage estimate', 'flood loss calculation'],
  [
    '{ name: "homeValue", label: "Home Value", type: "number", prefix: "$", min: 50000, max: 5000000, defaultValue: 300000 }',
    '{ name: "waterDepth", label: "Water Depth", type: "number", suffix: "inches", min: 1, max: 120, defaultValue: 12 }',
    '{ name: "basement", label: "Basement Type", type: "select", options: [{value:"none",label:"No Basement"},{value:"unfinished",label:"Unfinished Basement"},{value:"finished",label:"Finished Basement"}], defaultValue: "none" }',
    '{ name: "floorType", label: "Floor Type", type: "select", options: [{value:"tile",label:"Tile/Concrete"},{value:"laminate",label:"Laminate"},{value:"hardwood",label:"Hardwood"},{value:"carpet",label:"Carpet"}], defaultValue: "hardwood" }',
  ],
  `(inputs) => {
      const value = inputs.homeValue as number;
      const depth = inputs.waterDepth as number;
      const basement = inputs.basement as string;
      const floor = inputs.floorType as string;
      if (!value || !depth) return null;
      const depthFactor = Math.min(depth / 96, 1.0);
      const structuralDamage = Math.round(value * depthFactor * 0.25);
      const floorCost: Record<string, number> = { tile: 5, laminate: 8, hardwood: 15, carpet: 12 };
      const floorDamage = depth > 1 ? Math.round(1500 * (floorCost[floor] || 8)) : 0;
      const basementCost: Record<string, number> = { none: 0, unfinished: 5000, finished: 25000 };
      const basementDamage = basementCost[basement] || 0;
      const contentsDamage = Math.round(value * 0.1 * depthFactor);
      const total = structuralDamage + floorDamage + basementDamage + contentsDamage;
      return {
        primary: { label: "Estimated Total Damage", value: "$" + formatNumber(total) },
        details: [
          { label: "Structural Damage", value: "$" + formatNumber(structuralDamage) },
          { label: "Floor Damage", value: "$" + formatNumber(floorDamage) },
          { label: "Contents Damage", value: "$" + formatNumber(contentsDamage) },
        ],
      };
    }`,
  [{ q: 'How much damage can a flood cause?', a: 'Even one inch of water can cause $25,000 or more in damage. Costs increase rapidly with water depth, especially in homes with finished basements.' },
   { q: 'Does homeowner insurance cover flood damage?', a: 'Standard homeowner insurance does not cover flood damage. You need a separate flood insurance policy through the NFIP or a private insurer.' }],
  'Total Damage = Structural Damage + Floor Damage + Basement Damage + Contents Damage',
  ['hurricane-prep-cost-calculator', 'wildfire-prep-calculator']
);

// #30 Frost Date Planting Calculator
add('frost-date-calculator', 'Frost Date Planting Calculator',
  'Determine the best planting dates for your garden based on your average last frost date and crop type.',
  'Everyday', 'everyday', '~',
  ['frost date', 'planting date', 'last frost calculator'],
  [
    '{ name: "lastFrostWeek", label: "Last Frost Week of Year", type: "number", min: 1, max: 26, defaultValue: 14 }',
    '{ name: "cropType", label: "Crop Type", type: "select", options: [{value:"cold-hardy",label:"Cold Hardy (Peas, Lettuce)"},{value:"semi-hardy",label:"Semi-Hardy (Broccoli, Carrot)"},{value:"tender",label:"Tender (Tomato, Pepper)"},{value:"very-tender",label:"Very Tender (Melon, Squash)"}], defaultValue: "tender" }',
    '{ name: "method", label: "Planting Method", type: "select", options: [{value:"direct",label:"Direct Sow"},{value:"transplant",label:"Transplant"}], defaultValue: "transplant" }',
  ],
  `(inputs) => {
      const frostWeek = inputs.lastFrostWeek as number;
      const crop = inputs.cropType as string;
      const method = inputs.method as string;
      if (!frostWeek) return null;
      const weeksBefore: Record<string, number> = { "cold-hardy": 6, "semi-hardy": 4, tender: 0, "very-tender": -2 };
      const offset = weeksBefore[crop] || 0;
      const transplantBonus = method === "transplant" ? 2 : 0;
      const plantWeek = frostWeek - offset + transplantBonus;
      const indoorStartWeek = method === "transplant" ? plantWeek - 6 : 0;
      const weekToDate = (w: number) => {
        const d = new Date(2025, 0, 1);
        d.setDate(d.getDate() + (w - 1) * 7);
        return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
      };
      return {
        primary: { label: "Outdoor Planting Week", value: "Week " + Math.round(plantWeek) + " (" + weekToDate(Math.round(plantWeek)) + ")" },
        details: [
          { label: "Start Seeds Indoors", value: method === "transplant" ? weekToDate(Math.round(indoorStartWeek)) : "N/A (Direct Sow)" },
          { label: "Last Frost Date", value: weekToDate(frostWeek) },
          { label: "Weeks Before/After Frost", value: (offset >= 0 ? offset + " weeks before" : Math.abs(offset) + " weeks after") },
        ],
      };
    }`,
  [{ q: 'When should I plant based on frost date?', a: 'Cold-hardy crops can be planted 4-6 weeks before the last frost. Tender crops like tomatoes should wait until after the last frost date has passed.' },
   { q: 'How do I find my last frost date?', a: 'Check the USDA Plant Hardiness Zone Map or local extension office records. Last frost dates vary by region and are based on historical averages.' }],
  'Planting Week = Last Frost Week - Crop Offset + Transplant Bonus',
  ['lawn-watering-cost-calculator', 'summer-cooling-cost-calculator']
);

// =============================================================================
// DAILY LIFE / HOUSEHOLD (10)
// =============================================================================

// #31 Shower Water Usage Calculator
add('shower-water-usage-calculator', 'Shower Water Usage Calculator',
  'Calculate your shower water consumption and cost based on duration, flow rate, and frequency.',
  'Everyday', 'everyday', '~',
  ['shower water usage', 'shower cost', 'water consumption shower'],
  [
    '{ name: "duration", label: "Shower Duration", type: "number", suffix: "minutes", min: 1, max: 60, defaultValue: 8 }',
    '{ name: "flowRate", label: "Showerhead Flow Rate", type: "select", options: [{value:"1.5",label:"Low Flow (1.5 GPM)"},{value:"2.0",label:"Standard (2.0 GPM)"},{value:"2.5",label:"Full Flow (2.5 GPM)"},{value:"3.5",label:"Rain/High Flow (3.5 GPM)"}], defaultValue: "2.0" }',
    '{ name: "frequency", label: "Showers per Week", type: "number", min: 1, max: 14, defaultValue: 7 }',
    '{ name: "waterRate", label: "Water Rate", type: "number", suffix: "per 1000 gal", min: 1, max: 30, defaultValue: 5 }',
  ],
  `(inputs) => {
      const duration = inputs.duration as number;
      const flow = parseFloat(inputs.flowRate as string);
      const freq = inputs.frequency as number;
      const rate = inputs.waterRate as number;
      if (!duration || !flow || !freq || !rate) return null;
      const perShower = duration * flow;
      const weekly = perShower * freq;
      const monthly = weekly * 4.33;
      const monthlyCost = (monthly / 1000) * rate;
      const annualCost = monthlyCost * 12;
      return {
        primary: { label: "Gallons per Shower", value: formatNumber(Math.round(perShower)) + " gal" },
        details: [
          { label: "Monthly Usage", value: formatNumber(Math.round(monthly)) + " gal" },
          { label: "Monthly Water Cost", value: "$" + monthlyCost.toFixed(2) },
          { label: "Annual Water Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        ],
      };
    }`,
  [{ q: 'How much water does a shower use?', a: 'An average 8-minute shower with a standard 2.0 GPM showerhead uses about 16 gallons of water. Low-flow heads can reduce this to 12 gallons.' },
   { q: 'How can I reduce shower water usage?', a: 'Install a low-flow showerhead (1.5 GPM or less), take shorter showers, and turn off water while lathering to reduce consumption significantly.' }],
  'Water per Shower = Duration (minutes) x Flow Rate (GPM)',
  ['dishwasher-vs-hand-wash-calculator', 'laundry-schedule-calculator']
);

// #32 Laundry Schedule Calculator
add('laundry-schedule-calculator', 'Laundry Schedule Calculator',
  'Determine your optimal laundry frequency and estimate costs based on household size and habits.',
  'Everyday', 'everyday', '~',
  ['laundry schedule', 'laundry frequency', 'laundry cost'],
  [
    '{ name: "people", label: "Household Members", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "machineType", label: "Washer Type", type: "select", options: [{value:"he-front",label:"HE Front Load"},{value:"he-top",label:"HE Top Load"},{value:"standard",label:"Standard Top Load"},{value:"laundromat",label:"Laundromat"}], defaultValue: "he-front" }',
    '{ name: "electricRate", label: "Electric Rate", type: "number", suffix: "cents/kWh", min: 5, max: 50, defaultValue: 13 }',
    '{ name: "waterRate", label: "Water Rate", type: "number", suffix: "per 1000 gal", min: 1, max: 30, defaultValue: 5 }',
  ],
  `(inputs) => {
      const people = inputs.people as number;
      const machine = inputs.machineType as string;
      const elecRate = inputs.electricRate as number;
      const waterRate = inputs.waterRate as number;
      if (!people || !elecRate || !waterRate) return null;
      const loadsPerWeek = Math.ceil(people * 1.5);
      const waterPerLoad: Record<string, number> = { "he-front": 13, "he-top": 19, standard: 40, laundromat: 25 };
      const kwhPerLoad: Record<string, number> = { "he-front": 0.5, "he-top": 0.6, standard: 1.2, laundromat: 0 };
      const laundroPerLoad = machine === "laundromat" ? 4.5 : 0;
      const waterCost = (waterPerLoad[machine] || 20) * loadsPerWeek * 4.33 / 1000 * waterRate;
      const elecCost = (kwhPerLoad[machine] || 0.5) * loadsPerWeek * 4.33 * (elecRate / 100);
      const detergentCost = loadsPerWeek * 4.33 * 0.25;
      const laundromatCost = laundroPerLoad * loadsPerWeek * 4.33;
      const monthlyCost = Math.round(waterCost + elecCost + detergentCost + laundromatCost);
      return {
        primary: { label: "Loads per Week", value: String(loadsPerWeek) },
        details: [
          { label: "Monthly Cost", value: "$" + formatNumber(monthlyCost) },
          { label: "Water per Load", value: (waterPerLoad[machine] || 20) + " gallons" },
          { label: "Annual Cost", value: "$" + formatNumber(monthlyCost * 12) },
        ],
      };
    }`,
  [{ q: 'How often should you do laundry?', a: 'Most households need about 1.5 loads per person per week. A family of four typically does 6-8 loads weekly.' },
   { q: 'Are HE washers cheaper to operate?', a: 'Yes, HE front-load washers use 40-60% less water and 20-50% less energy than standard top-load machines, saving $50-$100 per year.' }],
  'Loads per Week = Household Members x 1.5',
  ['shower-water-usage-calculator', 'dishwasher-vs-hand-wash-calculator']
);

// #33 Dishwasher vs Hand Wash Calculator
add('dishwasher-vs-hand-wash-calculator', 'Dishwasher vs Hand Wash Calculator',
  'Compare the water and energy cost of using a dishwasher versus washing dishes by hand.',
  'Everyday', 'everyday', '~',
  ['dishwasher vs hand wash', 'dish washing cost', 'dishwasher savings'],
  [
    '{ name: "loadsPerWeek", label: "Dish Loads per Week", type: "number", min: 1, max: 21, defaultValue: 7 }',
    '{ name: "dishwasherType", label: "Dishwasher Type", type: "select", options: [{value:"standard",label:"Standard"},{value:"energy-star",label:"Energy Star"},{value:"old",label:"Older Model (10+ years)"}], defaultValue: "energy-star" }',
    '{ name: "electricRate", label: "Electric Rate", type: "number", suffix: "cents/kWh", min: 5, max: 50, defaultValue: 13 }',
    '{ name: "waterRate", label: "Water Rate", type: "number", suffix: "per 1000 gal", min: 1, max: 30, defaultValue: 5 }',
  ],
  `(inputs) => {
      const loads = inputs.loadsPerWeek as number;
      const type = inputs.dishwasherType as string;
      const elecRate = inputs.electricRate as number;
      const waterRate = inputs.waterRate as number;
      if (!loads || !elecRate || !waterRate) return null;
      const dwWater: Record<string, number> = { standard: 6, "energy-star": 3.5, old: 10 };
      const dwKwh: Record<string, number> = { standard: 1.2, "energy-star": 0.9, old: 1.8 };
      const handWater = 27;
      const handKwh = 2.5;
      const monthlyLoads = loads * 4.33;
      const dwWaterCost = monthlyLoads * (dwWater[type] || 6) / 1000 * waterRate;
      const dwElecCost = monthlyLoads * (dwKwh[type] || 1.2) * (elecRate / 100);
      const hwWaterCost = monthlyLoads * handWater / 1000 * waterRate;
      const hwElecCost = monthlyLoads * handKwh * (elecRate / 100);
      const dwTotal = Math.round((dwWaterCost + dwElecCost) * 100) / 100;
      const hwTotal = Math.round((hwWaterCost + hwElecCost) * 100) / 100;
      const savings = Math.round((hwTotal - dwTotal) * 12);
      const winner = dwTotal < hwTotal ? "Dishwasher wins" : "Hand washing wins";
      return {
        primary: { label: "Winner", value: winner },
        details: [
          { label: "Dishwasher Monthly Cost", value: "$" + dwTotal.toFixed(2) },
          { label: "Hand Wash Monthly Cost", value: "$" + hwTotal.toFixed(2) },
          { label: "Annual Savings", value: "$" + formatNumber(Math.abs(savings)) },
        ],
      };
    }`,
  [{ q: 'Is a dishwasher cheaper than hand washing?', a: 'Energy Star dishwashers use about 3.5 gallons per load versus 27 gallons for hand washing, making them significantly cheaper in most cases.' },
   { q: 'How much water does hand washing dishes use?', a: 'Hand washing a full load of dishes with running water uses about 27 gallons. Using a filled basin can reduce this to 8-10 gallons.' }],
  'Monthly Cost = (Water per Load x Loads x Water Rate) + (kWh per Load x Loads x Electric Rate)',
  ['shower-water-usage-calculator', 'laundry-schedule-calculator']
);

// #34 Vacuum Cleaner Cost Calculator
add('vacuum-cleaner-cost-calculator', 'Vacuum Cleaner Cost Calculator',
  'Calculate the total ownership cost of a vacuum cleaner including purchase price, bags, filters, and energy.',
  'Everyday', 'everyday', '~',
  ['vacuum cleaner cost', 'vacuum ownership cost', 'vacuum comparison'],
  [
    '{ name: "purchasePrice", label: "Purchase Price", type: "number", prefix: "$", min: 50, max: 2000, defaultValue: 300 }',
    '{ name: "vacuumType", label: "Vacuum Type", type: "select", options: [{value:"upright",label:"Upright (Bagged)"},{value:"bagless",label:"Upright (Bagless)"},{value:"canister",label:"Canister"},{value:"robot",label:"Robot Vacuum"}], defaultValue: "bagless" }',
    '{ name: "usePerWeek", label: "Uses per Week", type: "number", min: 1, max: 7, defaultValue: 2 }',
    '{ name: "yearsOwned", label: "Expected Lifespan", type: "number", suffix: "years", min: 1, max: 20, defaultValue: 7 }',
  ],
  `(inputs) => {
      const price = inputs.purchasePrice as number;
      const type = inputs.vacuumType as string;
      const uses = inputs.usePerWeek as number;
      const years = inputs.yearsOwned as number;
      if (!price || !uses || !years) return null;
      const annualBags = type === "upright" ? uses * 52 / 4 * 2 : 0;
      const annualFilters = type === "robot" ? 40 : 20;
      const annualBelt = type === "robot" ? 0 : 8;
      const annualEnergy = uses * 52 * 0.5 * 0.13;
      const annualMaint = annualBags + annualFilters + annualBelt + annualEnergy;
      const totalCost = Math.round(price + annualMaint * years);
      const costPerYear = Math.round(totalCost / years);
      return {
        primary: { label: "Total Ownership Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Cost per Year", value: "$" + formatNumber(costPerYear) },
          { label: "Annual Maintenance", value: "$" + formatNumber(Math.round(annualMaint)) },
          { label: "Lifespan", value: years + " years" },
        ],
      };
    }`,
  [{ q: 'How long does a vacuum cleaner last?', a: 'A quality vacuum cleaner lasts 5-10 years with proper maintenance. Robot vacuums typically last 4-6 years while commercial models can last 10+ years.' },
   { q: 'Are bagless vacuums cheaper to own?', a: 'Bagless vacuums save on bag costs but still need filter replacements. Over the lifetime, the cost difference is modest at about $50-$100.' }],
  'Total Cost = Purchase Price + (Annual Maintenance x Years)',
  ['lightbulb-comparison-calculator', 'household-chemical-cost-calculator']
);

// #35 Mattress Replacement Calculator
add('mattress-replacement-calculator', 'Mattress Replacement Calculator',
  'Determine when to replace your mattress based on age, condition, and sleep quality indicators.',
  'Everyday', 'everyday', '~',
  ['mattress replacement', 'mattress lifespan', 'when to replace mattress'],
  [
    '{ name: "mattressAge", label: "Mattress Age", type: "number", suffix: "years", min: 0, max: 30, defaultValue: 7 }',
    '{ name: "mattressType", label: "Mattress Type", type: "select", options: [{value:"innerspring",label:"Innerspring"},{value:"memory-foam",label:"Memory Foam"},{value:"latex",label:"Latex"},{value:"hybrid",label:"Hybrid"}], defaultValue: "memory-foam" }',
    '{ name: "weight", label: "Sleeper Weight", type: "number", suffix: "lbs", min: 80, max: 500, defaultValue: 170 }',
    '{ name: "quality", label: "Sleep Quality (1-10)", type: "number", min: 1, max: 10, defaultValue: 6 }',
  ],
  `(inputs) => {
      const age = inputs.mattressAge as number;
      const type = inputs.mattressType as string;
      const weight = inputs.weight as number;
      const quality = inputs.quality as number;
      if (!age && age !== 0) return null;
      const lifespan: Record<string, number> = { innerspring: 7, "memory-foam": 10, latex: 15, hybrid: 8 };
      const maxYears = lifespan[type] || 8;
      const weightFactor = weight > 250 ? 0.75 : weight > 200 ? 0.85 : 1.0;
      const adjustedLife = Math.round(maxYears * weightFactor);
      const remaining = Math.max(0, adjustedLife - age);
      const wearPercent = Math.min(100, Math.round((age / adjustedLife) * 100));
      let recommendation = "Your mattress is in good condition";
      if (wearPercent >= 100 || quality <= 4) recommendation = "Replace your mattress soon";
      else if (wearPercent >= 80 || quality <= 6) recommendation = "Start shopping for a replacement";
      return {
        primary: { label: "Recommendation", value: recommendation },
        details: [
          { label: "Years Remaining", value: remaining + " years" },
          { label: "Wear Level", value: wearPercent + "%" },
          { label: "Expected Lifespan", value: adjustedLife + " years" },
        ],
      };
    }`,
  [{ q: 'How often should you replace a mattress?', a: 'Most mattresses should be replaced every 7-10 years. Latex mattresses can last 12-15 years while innerspring models may need replacement after 6-8 years.' },
   { q: 'What are signs you need a new mattress?', a: 'Visible sagging, waking with pain or stiffness, increased allergies, and poor sleep quality are all signs that your mattress needs replacement.' }],
  'Adjusted Lifespan = Base Lifespan x Weight Factor',
  ['closet-space-calculator', 'air-filter-schedule-calculator']
);

// #36 Closet Space Calculator
add('closet-space-calculator', 'Closet Space Calculator',
  'Calculate optimal closet storage space and organization based on wardrobe size and closet dimensions.',
  'Everyday', 'everyday', '~',
  ['closet space', 'closet organization', 'wardrobe storage'],
  [
    '{ name: "closetWidth", label: "Closet Width", type: "number", suffix: "feet", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "closetDepth", label: "Closet Depth", type: "number", suffix: "feet", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "closetHeight", label: "Closet Height", type: "number", suffix: "feet", min: 6, max: 12, defaultValue: 8 }',
    '{ name: "wardrobeSize", label: "Wardrobe Size", type: "select", options: [{value:"minimal",label:"Minimal (30 items)"},{value:"average",label:"Average (80 items)"},{value:"large",label:"Large (150 items)"},{value:"extensive",label:"Extensive (250+ items)"}], defaultValue: "average" }',
  ],
  `(inputs) => {
      const w = inputs.closetWidth as number;
      const d = inputs.closetDepth as number;
      const h = inputs.closetHeight as number;
      const wardrobe = inputs.wardrobeSize as string;
      if (!w || !d || !h) return null;
      const totalCuFt = w * d * h;
      const hangingFt = w;
      const itemsPerFt: Record<string, number> = { minimal: 3, average: 8, large: 15, extensive: 25 };
      const items = itemsPerFt[wardrobe] || 8;
      const hangingNeeded = Math.ceil(items / 8);
      const doubleHang = h >= 8 ? Math.min(w, hangingNeeded / 2) : 0;
      const shelfFt = Math.max(0, w - hangingNeeded + doubleHang);
      const fitsWell = hangingNeeded <= w * (h >= 8 ? 1.5 : 1);
      return {
        primary: { label: "Hanging Space Available", value: hangingFt.toFixed(1) + " linear ft" },
        details: [
          { label: "Hanging Space Needed", value: hangingNeeded + " linear ft" },
          { label: "Shelf Space Available", value: shelfFt.toFixed(1) + " ft" },
          { label: "Wardrobe Fit", value: fitsWell ? "Good fit" : "Consider additional storage" },
        ],
      };
    }`,
  [{ q: 'How much closet space do I need?', a: 'The average person needs about 4-6 linear feet of hanging space and 10-15 square feet of shelf space for a standard wardrobe.' },
   { q: 'How can I maximize closet space?', a: 'Use double hanging rods for shorter items, add shelf dividers, use the back of the door, and install hooks for accessories to maximize available space.' }],
  'Hanging Space = Closet Width (double-hang adds 50% if height allows)',
  ['mattress-replacement-calculator', 'pantry-inventory-calculator']
);

// #37 Pantry Inventory Calculator
add('pantry-inventory-calculator', 'Pantry Inventory Calculator',
  'Estimate the total value and recommended stock levels for your household pantry.',
  'Everyday', 'everyday', '~',
  ['pantry inventory', 'food storage value', 'pantry stock'],
  [
    '{ name: "people", label: "Household Members", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "weeksSupply", label: "Weeks of Supply", type: "number", min: 1, max: 52, defaultValue: 2 }',
    '{ name: "dietType", label: "Diet Type", type: "select", options: [{value:"budget",label:"Budget Friendly"},{value:"standard",label:"Standard"},{value:"organic",label:"Organic/Premium"},{value:"specialty",label:"Specialty/Dietary"}], defaultValue: "standard" }',
    '{ name: "includeNonFood", label: "Include Non-Food Items", type: "select", options: [{value:"yes",label:"Yes (Cleaning, Paper, etc.)"},{value:"no",label:"Food Only"}], defaultValue: "yes" }',
  ],
  `(inputs) => {
      const people = inputs.people as number;
      const weeks = inputs.weeksSupply as number;
      const diet = inputs.dietType as string;
      const nonFood = inputs.includeNonFood as string;
      if (!people || !weeks) return null;
      const weeklyPerPerson: Record<string, number> = { budget: 50, standard: 75, organic: 110, specialty: 95 };
      const weeklyFood = people * (weeklyPerPerson[diet] || 75);
      const totalFood = weeklyFood * weeks;
      const nonFoodCost = nonFood === "yes" ? people * 10 * weeks : 0;
      const total = Math.round(totalFood + nonFoodCost);
      const shelfSpace = Math.round(people * weeks * 1.5);
      return {
        primary: { label: "Pantry Value", value: "$" + formatNumber(total) },
        details: [
          { label: "Weekly Food Cost", value: "$" + formatNumber(Math.round(weeklyFood)) },
          { label: "Non-Food Items", value: nonFood === "yes" ? "$" + formatNumber(Math.round(nonFoodCost)) : "Not included" },
          { label: "Shelf Space Needed", value: shelfSpace + " linear inches" },
        ],
      };
    }`,
  [{ q: 'How much food should a pantry hold?', a: 'A well-stocked pantry should hold 1-2 weeks of food for your household. Emergency preparedness guidelines recommend at least 2 weeks of non-perishable food.' },
   { q: 'How much does a full pantry cost?', a: 'A two-week pantry supply for a family of four costs approximately $400-$800 depending on dietary preferences and whether organic or specialty items are included.' }],
  'Pantry Value = Household Members x Weekly Cost x Weeks of Supply + Non-Food Items',
  ['closet-space-calculator', 'household-chemical-cost-calculator']
);

// #38 Household Chemical Cost Calculator
add('household-chemical-cost-calculator', 'Household Chemical Cost Calculator',
  'Estimate your annual spending on cleaning supplies and household chemicals.',
  'Everyday', 'everyday', '~',
  ['cleaning supply cost', 'household chemical budget', 'cleaning product cost'],
  [
    '{ name: "homeSize", label: "Home Size", type: "number", suffix: "sq ft", min: 200, max: 20000, defaultValue: 2000 }',
    '{ name: "people", label: "Household Members", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "cleaningFreq", label: "Cleaning Frequency", type: "select", options: [{value:"weekly",label:"Weekly"},{value:"biweekly",label:"Every 2 Weeks"},{value:"monthly",label:"Monthly"}], defaultValue: "weekly" }',
    '{ name: "productType", label: "Product Preference", type: "select", options: [{value:"budget",label:"Budget/Store Brand"},{value:"name",label:"Name Brand"},{value:"eco",label:"Eco-Friendly/Green"},{value:"diy",label:"DIY/Homemade"}], defaultValue: "name" }',
  ],
  `(inputs) => {
      const size = inputs.homeSize as number;
      const people = inputs.people as number;
      const freq = inputs.cleaningFreq as string;
      const product = inputs.productType as string;
      if (!size || !people) return null;
      const baseCostPerMonth = 25 + people * 8 + (size / 1000) * 5;
      const freqMult: Record<string, number> = { weekly: 1.0, biweekly: 0.7, monthly: 0.4 };
      const productMult: Record<string, number> = { budget: 0.6, name: 1.0, eco: 1.5, diy: 0.3 };
      const monthly = Math.round(baseCostPerMonth * (freqMult[freq] || 1.0) * (productMult[product] || 1.0));
      const annual = monthly * 12;
      const topProducts = product === "diy" ? "Vinegar, baking soda, castile soap" : "All-purpose cleaner, dish soap, laundry detergent";
      return {
        primary: { label: "Monthly Budget", value: "$" + formatNumber(monthly) },
        details: [
          { label: "Annual Budget", value: "$" + formatNumber(annual) },
          { label: "Top Products", value: topProducts },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(annual / people)) + "/year" },
        ],
      };
    }`,
  [{ q: 'How much should I spend on cleaning supplies?', a: 'The average household spends $40-$80 per month on cleaning supplies. Eco-friendly products cost more while DIY solutions can cut costs by 60-70%.' },
   { q: 'What are the essential cleaning supplies?', a: 'Essential supplies include all-purpose cleaner, dish soap, laundry detergent, glass cleaner, disinfectant, sponges, and trash bags.' }],
  'Monthly Cost = (Base + Per Person + Per 1000 sqft) x Frequency x Product Multiplier',
  ['vacuum-cleaner-cost-calculator', 'lightbulb-comparison-calculator']
);

// #39 Air Filter Schedule Calculator
add('air-filter-schedule-calculator', 'Air Filter Schedule Calculator',
  'Calculate your HVAC air filter replacement schedule and annual cost based on home conditions.',
  'Everyday', 'everyday', '~',
  ['air filter schedule', 'HVAC filter replacement', 'furnace filter change'],
  [
    '{ name: "filterSize", label: "Filter Type", type: "select", options: [{value:"1inch",label:"1 inch Standard"},{value:"2inch",label:"2 inch Pleated"},{value:"4inch",label:"4 inch Deep Pleated"},{value:"5inch",label:"5 inch Media Filter"}], defaultValue: "1inch" }',
    '{ name: "pets", label: "Number of Pets", type: "number", min: 0, max: 10, defaultValue: 1 }',
    '{ name: "allergies", label: "Allergy Concerns", type: "select", options: [{value:"none",label:"None"},{value:"mild",label:"Mild"},{value:"severe",label:"Severe"}], defaultValue: "mild" }',
    '{ name: "filterCost", label: "Filter Cost Each", type: "number", prefix: "$", min: 1, max: 100, defaultValue: 15 }',
  ],
  `(inputs) => {
      const filterType = inputs.filterSize as string;
      const pets = inputs.pets as number;
      const allergies = inputs.allergies as string;
      const cost = inputs.filterCost as number;
      if (!cost) return null;
      const baseDays: Record<string, number> = { "1inch": 30, "2inch": 90, "4inch": 180, "5inch": 365 };
      let days = baseDays[filterType] || 30;
      if (pets > 0) days = Math.round(days * (1 - pets * 0.1));
      if (allergies === "mild") days = Math.round(days * 0.85);
      if (allergies === "severe") days = Math.round(days * 0.7);
      days = Math.max(14, days);
      const changesPerYear = Math.ceil(365 / days);
      const annualCost = changesPerYear * cost;
      return {
        primary: { label: "Replace Every", value: days + " days" },
        details: [
          { label: "Changes per Year", value: String(changesPerYear) },
          { label: "Annual Filter Cost", value: "$" + formatNumber(annualCost) },
          { label: "Filter Type", value: filterType.replace("inch", " inch") },
        ],
      };
    }`,
  [{ q: 'How often should I change my air filter?', a: 'Standard 1-inch filters should be changed every 30-60 days. Homes with pets or allergies should change filters more frequently.' },
   { q: 'Do thicker air filters last longer?', a: 'Yes, 4-inch and 5-inch media filters can last 6-12 months because they have more surface area to capture particles before becoming clogged.' }],
  'Replacement Days = Base Days x Pet Factor x Allergy Factor',
  ['mattress-replacement-calculator', 'lightbulb-comparison-calculator']
);

// #40 Lightbulb Comparison Calculator
add('lightbulb-comparison-calculator', 'Lightbulb Comparison Calculator',
  'Compare the total cost of LED, CFL, and incandescent bulbs including purchase price and energy usage.',
  'Everyday', 'everyday', '~',
  ['lightbulb comparison', 'LED vs CFL', 'light bulb cost'],
  [
    '{ name: "bulbCount", label: "Number of Bulbs", type: "number", min: 1, max: 100, defaultValue: 20 }',
    '{ name: "hoursPerDay", label: "Hours On per Day", type: "number", min: 1, max: 24, defaultValue: 5 }',
    '{ name: "electricRate", label: "Electric Rate", type: "number", suffix: "cents/kWh", min: 5, max: 50, defaultValue: 13 }',
    '{ name: "years", label: "Years to Compare", type: "number", min: 1, max: 20, defaultValue: 10 }',
  ],
  `(inputs) => {
      const count = inputs.bulbCount as number;
      const hours = inputs.hoursPerDay as number;
      const rate = inputs.electricRate as number;
      const years = inputs.years as number;
      if (!count || !hours || !rate || !years) return null;
      const annualHours = hours * 365;
      const ledWatts = 9; const ledLife = 25000; const ledPrice = 3;
      const cflWatts = 13; const cflLife = 10000; const cflPrice = 2;
      const incWatts = 60; const incLife = 1000; const incPrice = 1;
      const calcCost = (watts: number, life: number, price: number) => {
        const replacements = Math.ceil((annualHours * years) / life);
        const bulbCost = replacements * price * count;
        const energyCost = (watts / 1000) * annualHours * years * count * (rate / 100);
        return Math.round(bulbCost + energyCost);
      };
      const ledTotal = calcCost(ledWatts, ledLife, ledPrice);
      const cflTotal = calcCost(cflWatts, cflLife, cflPrice);
      const incTotal = calcCost(incWatts, incLife, incPrice);
      const savings = incTotal - ledTotal;
      return {
        primary: { label: "LED Savings vs Incandescent", value: "$" + formatNumber(savings) },
        details: [
          { label: "LED Total Cost", value: "$" + formatNumber(ledTotal) },
          { label: "CFL Total Cost", value: "$" + formatNumber(cflTotal) },
          { label: "Incandescent Total Cost", value: "$" + formatNumber(incTotal) },
        ],
      };
    }`,
  [{ q: 'Are LED bulbs worth the higher price?', a: 'Yes, LED bulbs use 85% less energy than incandescent bulbs and last 25 times longer. The energy savings pay for the higher upfront cost within a few months.' },
   { q: 'How much can I save by switching to LED?', a: 'Switching 20 bulbs from incandescent to LED saves approximately $100-$200 per year in electricity costs depending on usage and local rates.' }],
  'Total Cost = (Replacements x Bulb Price x Count) + (Watts/1000 x Hours x Years x Count x Rate)',
  ['air-filter-schedule-calculator', 'household-chemical-cost-calculator']
);

// =============================================================================
// ENGINEERING / TECHNICAL (10)
// =============================================================================

// #41 Pipe Flow Calculator
add('pipe-flow-calculator', 'Pipe Flow Calculator',
  'Calculate fluid flow rate, velocity, and pressure in pipes based on pipe diameter and fluid properties.',
  'Science', 'science', 'A',
  ['pipe flow', 'fluid flow rate', 'pipe velocity'],
  [
    '{ name: "diameter", label: "Pipe Inner Diameter", type: "number", suffix: "inches", min: 0.25, max: 120, defaultValue: 4 }',
    '{ name: "velocity", label: "Flow Velocity", type: "number", suffix: "ft/s", min: 0.1, max: 50, defaultValue: 5 }',
    '{ name: "fluid", label: "Fluid Type", type: "select", options: [{value:"water",label:"Water"},{value:"oil",label:"Oil"},{value:"air",label:"Air"},{value:"steam",label:"Steam"}], defaultValue: "water" }',
    '{ name: "pipeLength", label: "Pipe Length", type: "number", suffix: "feet", min: 1, max: 10000, defaultValue: 100 }',
  ],
  `(inputs) => {
      const dia = inputs.diameter as number;
      const vel = inputs.velocity as number;
      const fluid = inputs.fluid as string;
      const length = inputs.pipeLength as number;
      if (!dia || !vel || !length) return null;
      const radiusFt = (dia / 2) / 12;
      const areaFt2 = Math.PI * radiusFt * radiusFt;
      const flowCfs = areaFt2 * vel;
      const flowGpm = flowCfs * 448.831;
      const density: Record<string, number> = { water: 62.4, oil: 54, air: 0.075, steam: 0.037 };
      const viscosity: Record<string, number> = { water: 0.00001, oil: 0.0001, air: 0.000016, steam: 0.00002 };
      const rho = density[fluid] || 62.4;
      const mu = viscosity[fluid] || 0.00001;
      const re = (rho * vel * (dia / 12)) / (mu * 32.174);
      const regime = re > 4000 ? "Turbulent" : re > 2300 ? "Transitional" : "Laminar";
      return {
        primary: { label: "Flow Rate", value: formatNumber(Math.round(flowGpm)) + " GPM" },
        details: [
          { label: "Flow (cu ft/sec)", value: flowCfs.toFixed(3) + " cfs" },
          { label: "Reynolds Number", value: formatNumber(Math.round(re)) },
          { label: "Flow Regime", value: regime },
        ],
      };
    }`,
  [{ q: 'How do I calculate pipe flow rate?', a: 'Flow rate equals the pipe cross-sectional area multiplied by the fluid velocity. Q = A x V where A = pi x r squared.' },
   { q: 'What is a safe flow velocity in pipes?', a: 'For water pipes, safe velocities are typically 3-8 ft/s. Higher velocities increase erosion and noise while lower velocities may allow sediment buildup.' }],
  'Flow Rate (GPM) = Pipe Area (sq ft) x Velocity (ft/s) x 448.831',
  ['pressure-drop-calculator', 'reynolds-number-calculator']
);

// #42 Structural Beam Calculator
add('structural-beam-calculator', 'Structural Beam Calculator',
  'Calculate the maximum load capacity and deflection of a structural beam based on material and dimensions.',
  'Science', 'science', 'A',
  ['structural beam', 'beam load capacity', 'beam deflection'],
  [
    '{ name: "beamLength", label: "Beam Length", type: "number", suffix: "feet", min: 1, max: 100, defaultValue: 12 }',
    '{ name: "width", label: "Beam Width", type: "number", suffix: "inches", min: 1, max: 24, defaultValue: 6 }',
    '{ name: "height", label: "Beam Height", type: "number", suffix: "inches", min: 2, max: 48, defaultValue: 10 }',
    '{ name: "material", label: "Material", type: "select", options: [{value:"steel",label:"Steel (A36)"},{value:"wood-sl",label:"Southern Pine"},{value:"wood-df",label:"Douglas Fir"},{value:"aluminum",label:"Aluminum"}], defaultValue: "steel" }',
  ],
  `(inputs) => {
      const len = inputs.beamLength as number;
      const w = inputs.width as number;
      const h = inputs.height as number;
      const mat = inputs.material as string;
      if (!len || !w || !h) return null;
      const modulus: Record<string, number> = { steel: 29000000, "wood-sl": 1700000, "wood-df": 1900000, aluminum: 10000000 };
      const allowStress: Record<string, number> = { steel: 36000, "wood-sl": 1500, "wood-df": 1700, aluminum: 21000 };
      const E = modulus[mat] || 29000000;
      const Fb = allowStress[mat] || 36000;
      const I = (w * Math.pow(h, 3)) / 12;
      const S = (w * Math.pow(h, 2)) / 6;
      const lenIn = len * 12;
      const maxLoad = (8 * Fb * S) / lenIn;
      const deflection = (5 * maxLoad * Math.pow(lenIn, 3)) / (384 * E * I);
      const deflectionLimit = lenIn / 360;
      const status = deflection <= deflectionLimit ? "Within limits (L/360)" : "Exceeds deflection limit";
      return {
        primary: { label: "Max Uniform Load", value: formatNumber(Math.round(maxLoad)) + " lbs" },
        details: [
          { label: "Max Deflection", value: deflection.toFixed(3) + " inches" },
          { label: "Deflection Limit (L/360)", value: deflectionLimit.toFixed(3) + " inches" },
          { label: "Status", value: status },
        ],
      };
    }`,
  [{ q: 'How do I calculate beam load capacity?', a: 'Beam load capacity depends on the material strength, cross-section dimensions, and span length. The section modulus and allowable stress determine the maximum bending moment.' },
   { q: 'What is the L/360 deflection rule?', a: 'The L/360 rule limits beam deflection to the span length divided by 360. For a 12-foot beam that means a maximum deflection of 0.4 inches.' }],
  'Max Load = (8 x Allowable Stress x Section Modulus) / Span Length',
  ['moment-of-inertia-calculator', 'spring-constant-calculator']
);

// #43 Wire Ampacity Calculator
add('wire-ampacity-calculator', 'Wire Ampacity Calculator',
  'Determine the current-carrying capacity of electrical wire based on gauge, insulation, and installation conditions.',
  'Science', 'science', 'A',
  ['wire ampacity', 'wire current capacity', 'electrical wire sizing'],
  [
    '{ name: "wireGauge", label: "Wire Gauge (AWG)", type: "select", options: [{value:"14",label:"14 AWG"},{value:"12",label:"12 AWG"},{value:"10",label:"10 AWG"},{value:"8",label:"8 AWG"},{value:"6",label:"6 AWG"},{value:"4",label:"4 AWG"},{value:"2",label:"2 AWG"}], defaultValue: "12" }',
    '{ name: "insulation", label: "Insulation Type", type: "select", options: [{value:"thw",label:"THW (75C)"},{value:"thhn",label:"THHN (90C)"},{value:"nm",label:"NM-B Romex (60C)"}], defaultValue: "thhn" }',
    '{ name: "conductors", label: "Conductors in Conduit", type: "select", options: [{value:"3",label:"3 or fewer"},{value:"6",label:"4-6"},{value:"9",label:"7-9"},{value:"12",label:"10-20"}], defaultValue: "3" }',
    '{ name: "ambientTemp", label: "Ambient Temperature", type: "number", suffix: "F", min: 50, max: 150, defaultValue: 86 }',
  ],
  `(inputs) => {
      const gauge = inputs.wireGauge as string;
      const insulation = inputs.insulation as string;
      const conductors = parseInt(inputs.conductors as string);
      const temp = inputs.ambientTemp as number;
      if (!gauge || !temp) return null;
      const baseAmpacity: Record<string, Record<string, number>> = {
        "14": { nm: 15, thw: 20, thhn: 25 },
        "12": { nm: 20, thw: 25, thhn: 30 },
        "10": { nm: 30, thw: 35, thhn: 40 },
        "8": { nm: 40, thw: 50, thhn: 55 },
        "6": { nm: 55, thw: 65, thhn: 75 },
        "4": { nm: 70, thw: 85, thhn: 95 },
        "2": { nm: 95, thw: 115, thhn: 130 },
      };
      const base = baseAmpacity[gauge]?.[insulation] || 20;
      const conduitDerate: Record<number, number> = { 3: 1.0, 6: 0.8, 9: 0.7, 12: 0.5 };
      const derate = conduitDerate[conductors] || 1.0;
      const tempDerate = temp > 104 ? 0.82 : temp > 96 ? 0.88 : temp > 86 ? 0.94 : 1.0;
      const ampacity = Math.round(base * derate * tempDerate);
      const maxBreaker = ampacity >= 30 ? Math.floor(ampacity / 5) * 5 : ampacity >= 15 ? Math.floor(ampacity / 5) * 5 : 15;
      return {
        primary: { label: "Derated Ampacity", value: ampacity + " A" },
        details: [
          { label: "Base Ampacity", value: base + " A" },
          { label: "Recommended Breaker", value: maxBreaker + " A" },
          { label: "Derating Factor", value: (derate * tempDerate * 100).toFixed(0) + "%" },
        ],
      };
    }`,
  [{ q: 'What size wire do I need for 30 amps?', a: 'A 30-amp circuit requires at least 10 AWG copper wire with THW or THHN insulation. Always check local codes for specific requirements.' },
   { q: 'What is wire ampacity derating?', a: 'Derating reduces the allowed current when multiple wires share a conduit or ambient temperatures exceed 86F because heat dissipation is reduced.' }],
  'Derated Ampacity = Base Ampacity x Conduit Factor x Temperature Factor',
  ['torque-conversion-calculator', 'pipe-flow-calculator']
);

// #44 Torque Conversion Calculator
add('torque-conversion-calculator', 'Torque Conversion Calculator',
  'Convert torque values between common units including Newton-meters, foot-pounds, and inch-pounds.',
  'Conversion', 'conversion', 'R',
  ['torque conversion', 'torque units', 'Nm to ft-lbs'],
  [
    '{ name: "value", label: "Torque Value", type: "number", min: 0.001, max: 1000000, defaultValue: 100 }',
    '{ name: "fromUnit", label: "From Unit", type: "select", options: [{value:"nm",label:"Newton-meters (Nm)"},{value:"ftlb",label:"Foot-pounds (ft-lb)"},{value:"inlb",label:"Inch-pounds (in-lb)"},{value:"kgcm",label:"Kilogram-centimeters (kg-cm)"}], defaultValue: "nm" }',
    '{ name: "toUnit", label: "To Unit", type: "select", options: [{value:"nm",label:"Newton-meters (Nm)"},{value:"ftlb",label:"Foot-pounds (ft-lb)"},{value:"inlb",label:"Inch-pounds (in-lb)"},{value:"kgcm",label:"Kilogram-centimeters (kg-cm)"}], defaultValue: "ftlb" }',
  ],
  `(inputs) => {
      const val = inputs.value as number;
      const from = inputs.fromUnit as string;
      const to = inputs.toUnit as string;
      if (!val) return null;
      const toNm: Record<string, number> = { nm: 1, ftlb: 1.35582, inlb: 0.112985, kgcm: 0.0980665 };
      const fromNm: Record<string, number> = { nm: 1, ftlb: 0.737562, inlb: 8.85075, kgcm: 10.1972 };
      const nm = val * (toNm[from] || 1);
      const result = nm * (fromNm[to] || 1);
      const unitLabels: Record<string, string> = { nm: "Nm", ftlb: "ft-lb", inlb: "in-lb", kgcm: "kg-cm" };
      return {
        primary: { label: "Result", value: formatNumber(parseFloat(result.toFixed(4))) + " " + (unitLabels[to] || to) },
        details: [
          { label: "Input", value: formatNumber(val) + " " + (unitLabels[from] || from) },
          { label: "In Newton-meters", value: nm.toFixed(4) + " Nm" },
          { label: "Conversion Factor", value: (result / val).toFixed(6) },
        ],
      };
    }`,
  [{ q: 'How do I convert Nm to ft-lbs?', a: 'Multiply Newton-meters by 0.7376 to get foot-pounds. For example, 100 Nm equals approximately 73.76 ft-lbs.' },
   { q: 'What torque unit is most common?', a: 'Newton-meters (Nm) are the international standard. Foot-pounds (ft-lbs) are common in the US automotive industry. Inch-pounds are used for smaller fasteners.' }],
  'Result = Input Value x Conversion Factor (via Newton-meters)',
  ['belt-length-calculator', 'spring-constant-calculator']
);

// #45 Pressure Drop Calculator
add('pressure-drop-calculator', 'Pressure Drop Calculator',
  'Calculate pressure loss in piping systems due to friction based on pipe dimensions and flow rate.',
  'Science', 'science', 'A',
  ['pressure drop', 'pipe pressure loss', 'friction loss'],
  [
    '{ name: "pipeLength", label: "Pipe Length", type: "number", suffix: "feet", min: 1, max: 50000, defaultValue: 200 }',
    '{ name: "diameter", label: "Pipe Diameter", type: "number", suffix: "inches", min: 0.5, max: 48, defaultValue: 4 }',
    '{ name: "flowRate", label: "Flow Rate", type: "number", suffix: "GPM", min: 1, max: 100000, defaultValue: 100 }',
    '{ name: "pipeMaterial", label: "Pipe Material", type: "select", options: [{value:"steel",label:"Steel"},{value:"copper",label:"Copper"},{value:"pvc",label:"PVC"},{value:"cast-iron",label:"Cast Iron"}], defaultValue: "steel" }',
  ],
  `(inputs) => {
      const length = inputs.pipeLength as number;
      const dia = inputs.diameter as number;
      const gpm = inputs.flowRate as number;
      const material = inputs.pipeMaterial as string;
      if (!length || !dia || !gpm) return null;
      const roughness: Record<string, number> = { steel: 0.00015, copper: 0.000005, pvc: 0.000005, "cast-iron": 0.00085 };
      const e = roughness[material] || 0.00015;
      const dFt = dia / 12;
      const area = Math.PI * Math.pow(dFt / 2, 2);
      const vel = (gpm * 0.002228) / area;
      const f = 0.025 + 0.05 * (e / dFt);
      const headLoss = f * (length / dFt) * Math.pow(vel, 2) / (2 * 32.174);
      const psiDrop = headLoss * 62.4 / 144;
      return {
        primary: { label: "Pressure Drop", value: psiDrop.toFixed(2) + " psi" },
        details: [
          { label: "Head Loss", value: headLoss.toFixed(2) + " ft" },
          { label: "Flow Velocity", value: vel.toFixed(2) + " ft/s" },
          { label: "Friction Factor", value: f.toFixed(4) },
        ],
      };
    }`,
  [{ q: 'What causes pressure drop in pipes?', a: 'Pressure drop is caused by friction between the fluid and pipe walls, pipe fittings, valves, and changes in pipe diameter or direction.' },
   { q: 'How do I reduce pressure drop?', a: 'Increase pipe diameter, reduce pipe length, minimize fittings and bends, and use smoother pipe materials like PVC or copper.' }],
  'Pressure Drop = Friction Factor x (Length/Diameter) x (Velocity squared) / (2 x g) x Density / 144',
  ['pipe-flow-calculator', 'reynolds-number-calculator']
);

// #46 Belt Length Calculator
add('belt-length-calculator', 'Belt Length Calculator',
  'Calculate the required belt length for two-pulley drive systems based on pulley sizes and center distance.',
  'Science', 'science', 'A',
  ['belt length', 'v-belt length', 'timing belt calculator'],
  [
    '{ name: "pulley1", label: "Drive Pulley Diameter", type: "number", suffix: "inches", min: 1, max: 60, defaultValue: 6 }',
    '{ name: "pulley2", label: "Driven Pulley Diameter", type: "number", suffix: "inches", min: 1, max: 60, defaultValue: 12 }',
    '{ name: "centerDist", label: "Center Distance", type: "number", suffix: "inches", min: 2, max: 200, defaultValue: 24 }',
  ],
  `(inputs) => {
      const d1 = inputs.pulley1 as number;
      const d2 = inputs.pulley2 as number;
      const C = inputs.centerDist as number;
      if (!d1 || !d2 || !C) return null;
      const r1 = d1 / 2;
      const r2 = d2 / 2;
      const beltLength = 2 * C + Math.PI * (r1 + r2) + Math.pow(r2 - r1, 2) / C;
      const speedRatio = d2 / d1;
      const wrapAngle = 180 - (60 * (d2 - d1) / C);
      const minWrap = wrapAngle >= 120 ? "Acceptable" : "Too small - increase center distance";
      return {
        primary: { label: "Belt Length", value: beltLength.toFixed(2) + " inches" },
        details: [
          { label: "Speed Ratio", value: speedRatio.toFixed(2) + ":1" },
          { label: "Wrap Angle (small pulley)", value: wrapAngle.toFixed(1) + " degrees" },
          { label: "Wrap Angle Status", value: minWrap },
        ],
      };
    }`,
  [{ q: 'How do you calculate belt length?', a: 'Belt length equals 2 times center distance plus pi times the sum of the pulley radii plus the square of the radius difference divided by center distance.' },
   { q: 'What is the minimum wrap angle for a belt?', a: 'The minimum recommended wrap angle on the smaller pulley is 120 degrees. Below this the belt may slip under load.' }],
  'Belt Length = 2C + pi(r1 + r2) + (r2 - r1) squared / C',
  ['torque-conversion-calculator', 'spring-constant-calculator']
);

// #47 Spring Constant Calculator
add('spring-constant-calculator', 'Spring Constant Calculator',
  'Calculate the spring constant using Hooke law based on force applied and displacement measured.',
  'Science', 'science', 'A',
  ['spring constant', 'Hooke law', 'spring rate'],
  [
    '{ name: "force", label: "Applied Force", type: "number", suffix: "N", min: 0.01, max: 100000, defaultValue: 50 }',
    '{ name: "displacement", label: "Displacement", type: "number", suffix: "mm", min: 0.01, max: 10000, defaultValue: 25 }',
    '{ name: "coils", label: "Number of Active Coils", type: "number", min: 1, max: 100, defaultValue: 10 }',
    '{ name: "wireDia", label: "Wire Diameter", type: "number", suffix: "mm", min: 0.1, max: 50, defaultValue: 3 }',
  ],
  `(inputs) => {
      const force = inputs.force as number;
      const disp = inputs.displacement as number;
      const coils = inputs.coils as number;
      const wire = inputs.wireDia as number;
      if (!force || !disp) return null;
      const k = force / (disp / 1000);
      const kLbIn = k * 0.00571015;
      const potentialEnergy = 0.5 * k * Math.pow(disp / 1000, 2);
      const naturalFreq = (1 / (2 * Math.PI)) * Math.sqrt(k / 1);
      return {
        primary: { label: "Spring Constant (k)", value: formatNumber(Math.round(k)) + " N/m" },
        details: [
          { label: "Spring Constant", value: kLbIn.toFixed(2) + " lb/in" },
          { label: "Stored Energy", value: potentialEnergy.toFixed(4) + " J" },
          { label: "Natural Frequency (1kg)", value: naturalFreq.toFixed(2) + " Hz" },
        ],
      };
    }`,
  [{ q: 'What is the spring constant?', a: 'The spring constant (k) measures spring stiffness in Newtons per meter. A higher k means a stiffer spring that requires more force to compress or extend.' },
   { q: 'How is spring constant calculated?', a: 'Spring constant k equals force divided by displacement (k = F/x) according to Hooke law. The units are typically N/m or lb/in.' }],
  'k = F / x (Force / Displacement)',
  ['moment-of-inertia-calculator', 'thermal-expansion-calculator']
);

// #48 Thermal Expansion Calculator
add('thermal-expansion-calculator', 'Thermal Expansion Calculator',
  'Calculate the linear thermal expansion of materials when subjected to temperature changes.',
  'Science', 'science', 'A',
  ['thermal expansion', 'material expansion', 'linear expansion'],
  [
    '{ name: "length", label: "Original Length", type: "number", suffix: "meters", min: 0.001, max: 10000, defaultValue: 10 }',
    '{ name: "tempChange", label: "Temperature Change", type: "number", suffix: "C", min: -500, max: 2000, defaultValue: 50 }',
    '{ name: "material", label: "Material", type: "select", options: [{value:"steel",label:"Steel"},{value:"aluminum",label:"Aluminum"},{value:"copper",label:"Copper"},{value:"concrete",label:"Concrete"},{value:"brass",label:"Brass"},{value:"glass",label:"Glass"}], defaultValue: "steel" }',
  ],
  `(inputs) => {
      const L = inputs.length as number;
      const dT = inputs.tempChange as number;
      const material = inputs.material as string;
      if (!L || !dT) return null;
      const alpha: Record<string, number> = { steel: 12e-6, aluminum: 23e-6, copper: 17e-6, concrete: 12e-6, brass: 19e-6, glass: 9e-6 };
      const a = alpha[material] || 12e-6;
      const dL = L * a * dT;
      const dLmm = dL * 1000;
      const dLin = dL * 39.3701;
      const strain = (dL / L) * 1e6;
      return {
        primary: { label: "Length Change", value: dLmm.toFixed(3) + " mm" },
        details: [
          { label: "Change in Inches", value: dLin.toFixed(4) + " in" },
          { label: "New Length", value: (L + dL).toFixed(6) + " m" },
          { label: "Strain", value: strain.toFixed(1) + " microstrain" },
        ],
      };
    }`,
  [{ q: 'What is the coefficient of thermal expansion?', a: 'The coefficient of thermal expansion (CTE) measures how much a material expands per degree of temperature change. Aluminum expands about twice as much as steel.' },
   { q: 'Why does thermal expansion matter in engineering?', a: 'Thermal expansion must be accounted for in bridges, pipelines, and rail tracks. Without expansion joints, temperature changes can cause buckling or cracking.' }],
  'Change in Length = Original Length x CTE x Temperature Change',
  ['spring-constant-calculator', 'structural-beam-calculator']
);

// #49 Moment of Inertia Calculator
add('moment-of-inertia-calculator', 'Moment of Inertia Calculator',
  'Calculate the moment of inertia for common geometric cross-sections used in structural analysis.',
  'Science', 'science', 'A',
  ['moment of inertia', 'second moment of area', 'rotational inertia'],
  [
    '{ name: "shape", label: "Cross Section Shape", type: "select", options: [{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"},{value:"ibeam",label:"I-Beam"},{value:"tube",label:"Hollow Tube"}], defaultValue: "rectangle" }',
    '{ name: "dim1", label: "Width or Outer Diameter", type: "number", suffix: "inches", min: 0.1, max: 100, defaultValue: 6 }',
    '{ name: "dim2", label: "Height or Wall Thickness", type: "number", suffix: "inches", min: 0.1, max: 100, defaultValue: 10 }',
    '{ name: "dim3", label: "Flange/Web Thickness", type: "number", suffix: "inches", min: 0.1, max: 20, defaultValue: 0.5 }',
  ],
  `(inputs) => {
      const shape = inputs.shape as string;
      const d1 = inputs.dim1 as number;
      const d2 = inputs.dim2 as number;
      const d3 = inputs.dim3 as number;
      if (!d1 || !d2) return null;
      let I = 0;
      let area = 0;
      if (shape === "rectangle") {
        I = (d1 * Math.pow(d2, 3)) / 12;
        area = d1 * d2;
      } else if (shape === "circle") {
        I = (Math.PI * Math.pow(d1, 4)) / 64;
        area = Math.PI * Math.pow(d1 / 2, 2);
      } else if (shape === "tube") {
        const outerR = d1 / 2;
        const innerR = outerR - d2;
        I = (Math.PI / 64) * (Math.pow(d1, 4) - Math.pow(innerR * 2, 4));
        area = Math.PI * (outerR * outerR - innerR * innerR);
      } else {
        const flangeI = 2 * ((d1 * Math.pow(d3, 3)) / 12 + d1 * d3 * Math.pow((d2 - d3) / 2, 2));
        const webI = (d3 * Math.pow(d2 - 2 * d3, 3)) / 12;
        I = flangeI + webI;
        area = 2 * d1 * d3 + (d2 - 2 * d3) * d3;
      }
      const S = I / (d2 / 2 || d1 / 2);
      const rGyration = Math.sqrt(I / area);
      return {
        primary: { label: "Moment of Inertia (I)", value: formatNumber(Math.round(I * 100) / 100) + " in4" },
        details: [
          { label: "Section Modulus (S)", value: (Math.round(S * 100) / 100) + " in3" },
          { label: "Cross-Section Area", value: area.toFixed(2) + " in2" },
          { label: "Radius of Gyration", value: rGyration.toFixed(3) + " in" },
        ],
      };
    }`,
  [{ q: 'What is moment of inertia?', a: 'Moment of inertia (or second moment of area) measures a cross-section resistance to bending. Higher values mean the shape is stiffer and deflects less under load.' },
   { q: 'Why are I-beams efficient?', a: 'I-beams concentrate material at the top and bottom flanges, far from the neutral axis. This maximizes the moment of inertia relative to the amount of material used.' }],
  'Rectangle: I = (Width x Height cubed) / 12. Circle: I = (pi x Diameter to the 4th) / 64',
  ['structural-beam-calculator', 'spring-constant-calculator']
);

// #50 Reynolds Number Calculator
add('reynolds-number-calculator', 'Reynolds Number Calculator',
  'Calculate the Reynolds number to determine whether fluid flow is laminar, transitional, or turbulent.',
  'Science', 'science', 'A',
  ['Reynolds number', 'flow regime', 'laminar vs turbulent'],
  [
    '{ name: "velocity", label: "Flow Velocity", type: "number", suffix: "m/s", min: 0.001, max: 1000, defaultValue: 2 }',
    '{ name: "diameter", label: "Pipe Diameter", type: "number", suffix: "meters", min: 0.001, max: 10, defaultValue: 0.1 }',
    '{ name: "fluid", label: "Fluid", type: "select", options: [{value:"water",label:"Water (20C)"},{value:"air",label:"Air (20C)"},{value:"oil",label:"Motor Oil"},{value:"glycerin",label:"Glycerin"}], defaultValue: "water" }',
  ],
  `(inputs) => {
      const v = inputs.velocity as number;
      const d = inputs.diameter as number;
      const fluid = inputs.fluid as string;
      if (!v || !d) return null;
      const kinVisc: Record<string, number> = { water: 1.004e-6, air: 1.516e-5, oil: 1.0e-4, glycerin: 1.18e-3 };
      const density: Record<string, number> = { water: 998, air: 1.204, oil: 880, glycerin: 1261 };
      const nu = kinVisc[fluid] || 1.004e-6;
      const rho = density[fluid] || 998;
      const Re = (v * d) / nu;
      let regime = "Turbulent";
      if (Re < 2300) regime = "Laminar";
      else if (Re < 4000) regime = "Transitional";
      const dynVisc = nu * rho;
      return {
        primary: { label: "Reynolds Number", value: formatNumber(Math.round(Re)) },
        details: [
          { label: "Flow Regime", value: regime },
          { label: "Kinematic Viscosity", value: nu.toExponential(3) + " m2/s" },
          { label: "Fluid Density", value: rho + " kg/m3" },
        ],
      };
    }`,
  [{ q: 'What is the Reynolds number?', a: 'The Reynolds number is a dimensionless quantity that predicts flow behavior. Values below 2300 indicate laminar flow, above 4000 indicate turbulent flow.' },
   { q: 'Why is Reynolds number important?', a: 'Reynolds number determines the flow regime which affects pressure drop, heat transfer, and mixing. Turbulent flow has higher friction but better mixing than laminar flow.' }],
  'Re = (Velocity x Diameter) / Kinematic Viscosity',
  ['pipe-flow-calculator', 'pressure-drop-calculator']
);

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
// =============================================================================
// FILE GENERATOR
// =============================================================================
function genFile(c) {
  return `import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ${eName(c.slug)}: CalculatorDefinition = {
  slug: "${c.slug}",
  title: "${c.title}",
  description: "${c.desc.replace(/"/g, '\\"')}",
  category: "${c.cat}",
  categorySlug: "${c.cs}",
  icon: "${c.icon}",
  keywords: [${c.kw.map(k => `"${k}"`).join(', ')}],
  variants: [{
    id: "standard",
    name: "${c.title.replace(' Calculator', '').replace(' Generator', '').replace(' Converter', '').replace(' Estimator', '')}",
    description: "${c.desc.split('.')[0].replace(/"/g, '\\"')}",
    fields: [
${c.fields.map(f => '      ' + f + ',').join('\n')}
    ],
    calculate: ${c.calcBody},
  }],
  relatedSlugs: [${c.rel.map(r => `"${r}"`).join(', ')}],
  faq: [
    { question: "${c.faq[0].q.replace(/"/g, '\\"')}", answer: "${c.faq[0].a.replace(/"/g, '\\"')}" },
    { question: "${c.faq[1].q.replace(/"/g, '\\"')}", answer: "${c.faq[1].a.replace(/"/g, '\\"')}" },
  ],
  formula: "${c.formula.replace(/"/g, '\\"')}",
};
`;
}

let generated = 0, skipped = 0;
const imports = [], regs = [];

for (const c of calcs) {
  if (existingSlugs.has(c.slug)) { skipped++; console.log(`SKIP (exists): ${c.slug}`); continue; }
  const filePath = path.join(CALC_DIR, c.slug + '.ts');
  if (fs.existsSync(filePath)) { skipped++; console.log(`SKIP (file): ${c.slug}`); continue; }
  fs.writeFileSync(filePath, genFile(c));
  imports.push(`import { ${eName(c.slug)} } from "./${c.slug}";`);
  regs.push(`  ${eName(c.slug)},`);
  generated++;
}

fs.writeFileSync(path.join(__dirname, 'new-imports-batch3.txt'), imports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch3.txt'), regs.join('\n'));
console.log(`\nGenerated: ${generated} | Skipped: ${skipped}`);
console.log(`Total definitions: ${calcs.length}`);
