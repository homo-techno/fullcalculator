add(
  "tennis-racket-string-tension-calculator",
  "Tennis Racket String Tension Calculator",
  "Calculate optimal string tension based on playing style, racket head size, and string type.",
  "Everyday",
  "everyday",
  "~",
  ["tennis string tension", "racket stringing", "tennis racket tension", "string gauge"],
  [
    '{ name: "headSize", label: "Racket Head Size (sq in)", type: "number", min: 85, max: 115, defaultValue: 100 }',
    '{ name: "playStyle", label: "Playing Style", type: "select", options: [{ value: "1", label: "Power Hitter" }, { value: "2", label: "All-Around" }, { value: "3", label: "Control Player" }], defaultValue: "2" }',
    '{ name: "stringType", label: "String Type", type: "select", options: [{ value: "1", label: "Natural Gut" }, { value: "2", label: "Polyester" }, { value: "3", label: "Synthetic Gut" }, { value: "4", label: "Multifilament" }], defaultValue: "2" }',
    '{ name: "skillLevel", label: "Skill Level", type: "select", options: [{ value: "1", label: "Beginner" }, { value: "2", label: "Intermediate" }, { value: "3", label: "Advanced" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const headSize = inputs.headSize as number;
    const playStyle = parseInt(inputs.playStyle as string);
    const stringType = parseInt(inputs.stringType as string);
    const skillLevel = parseInt(inputs.skillLevel as string);
    const baseTension = 55;
    const headAdj = (headSize - 100) * -0.2;
    const styleAdj = playStyle === 1 ? -3 : playStyle === 3 ? 3 : 0;
    const stringAdj = stringType === 1 ? 2 : stringType === 2 ? -2 : stringType === 4 ? 1 : 0;
    const skillAdj = skillLevel === 1 ? -2 : skillLevel === 3 ? 2 : 0;
    const tension = Math.round(baseTension + headAdj + styleAdj + stringAdj + skillAdj);
    const rangeLow = tension - 2;
    const rangeHigh = tension + 2;
    return {
      primary: { label: "Recommended Tension", value: formatNumber(tension) + " lbs" },
      details: [
        { label: "Tension Range", value: formatNumber(rangeLow) + " - " + formatNumber(rangeHigh) + " lbs" },
        { label: "Head Size Adjustment", value: formatNumber(headAdj) + " lbs" },
        { label: "Style Adjustment", value: formatNumber(styleAdj) + " lbs" }
      ]
    };
  }`,
  [
    { q: "What is a good tennis string tension?", a: "Most players string between 50 and 60 pounds. Lower tension gives more power while higher tension provides more control." },
    { q: "Does racket head size affect string tension?", a: "Yes, larger heads generally need slightly lower tension because the longer strings already provide more power." },
    { q: "How often should I restring my racket?", a: "A common rule is to restring as many times per year as you play per week. Competitive players may restring more often." }
  ],
  "Tension = Base (55 lbs) + Head Size Adj + Play Style Adj + String Type Adj + Skill Adj",
  ["golf-club-fitting-calculator", "swim-pace-calculator"]
);

add(
  "golf-club-fitting-calculator",
  "Golf Club Fitting Calculator",
  "Determine recommended club length and lie angle based on your height, wrist-to-floor measurement, and swing speed.",
  "Everyday",
  "everyday",
  "~",
  ["golf club fitting", "club length", "golf club size", "lie angle"],
  [
    '{ name: "height", label: "Height (inches)", type: "number", min: 54, max: 84, defaultValue: 70 }',
    '{ name: "wristToFloor", label: "Wrist-to-Floor (inches)", type: "number", min: 25, max: 42, defaultValue: 34 }',
    '{ name: "swingSpeed", label: "Driver Swing Speed (mph)", type: "number", min: 50, max: 130, defaultValue: 90 }',
    '{ name: "handicap", label: "Handicap Range", type: "select", options: [{ value: "1", label: "High (20+)" }, { value: "2", label: "Mid (10-19)" }, { value: "3", label: "Low (0-9)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const height = inputs.height as number;
    const wtf = inputs.wristToFloor as number;
    const swingSpeed = inputs.swingSpeed as number;
    const handicap = parseInt(inputs.handicap as string);
    const standardLength = 36.5;
    const lengthAdj = (wtf - 34) * 0.25;
    const clubLength = standardLength + lengthAdj;
    const standardLie = 62;
    const lieAdj = (height - 70) * 0.3 + (wtf - 34) * -0.4;
    const lieAngle = Math.round((standardLie + lieAdj) * 10) / 10;
    const shaftFlex = swingSpeed < 70 ? "Ladies" : swingSpeed < 85 ? "Regular" : swingSpeed < 100 ? "Stiff" : "Extra Stiff";
    return {
      primary: { label: "Recommended 7-Iron Length", value: formatNumber(Math.round(clubLength * 10) / 10) + " inches" },
      details: [
        { label: "Lie Angle Adjustment", value: formatNumber(lieAngle) + " degrees" },
        { label: "Shaft Flex", value: shaftFlex },
        { label: "Length Adjustment", value: (lengthAdj >= 0 ? "+" : "") + formatNumber(Math.round(lengthAdj * 100) / 100) + " inches" }
      ]
    };
  }`,
  [
    { q: "How do I know what golf club length I need?", a: "Club length is primarily based on your wrist-to-floor measurement. Standard 7-iron length is about 36.5 inches for a player 70 inches tall." },
    { q: "What is lie angle in golf?", a: "Lie angle is the angle between the club shaft and the ground. Taller players generally need more upright lie angles." },
    { q: "How important is club fitting?", a: "Proper fitting can improve accuracy and distance by 5 to 15 percent, even for beginners." }
  ],
  "Club Length = 36.5 + (Wrist-to-Floor - 34) x 0.25; Lie Angle = 62 + Height Adj + WTF Adj",
  ["tennis-racket-string-tension-calculator", "baseball-bat-weight-calculator"]
);

add(
  "ski-boot-size-calculator",
  "Ski Boot Size Calculator",
  "Find your ski boot mondo point size from foot length and determine appropriate flex rating.",
  "Everyday",
  "everyday",
  "~",
  ["ski boot size", "mondo point", "ski boot fitting", "ski boot flex"],
  [
    '{ name: "footLength", label: "Foot Length (cm)", type: "number", min: 20, max: 35, defaultValue: 27 }',
    '{ name: "footWidth", label: "Foot Width", type: "select", options: [{ value: "1", label: "Narrow" }, { value: "2", label: "Average" }, { value: "3", label: "Wide" }], defaultValue: "2" }',
    '{ name: "ability", label: "Skiing Ability", type: "select", options: [{ value: "1", label: "Beginner" }, { value: "2", label: "Intermediate" }, { value: "3", label: "Advanced" }, { value: "4", label: "Expert" }], defaultValue: "2" }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 300, defaultValue: 170 }'
  ],
  `(inputs) => {
    const footLength = inputs.footLength as number;
    const footWidth = parseInt(inputs.footWidth as string);
    const ability = parseInt(inputs.ability as string);
    const weight = inputs.weight as number;
    const mondoSize = Math.round(footLength * 2) / 2;
    const shellSize = ability >= 3 ? mondoSize : mondoSize + 0.5;
    const lastWidth = footWidth === 1 ? "96-98mm" : footWidth === 2 ? "100-102mm" : "104-106mm";
    const baseFlex = weight < 130 ? 70 : weight < 170 ? 90 : weight < 210 ? 100 : 120;
    const flexAdj = ability === 1 ? -20 : ability === 3 ? 10 : ability === 4 ? 20 : 0;
    const flex = baseFlex + flexAdj;
    return {
      primary: { label: "Mondo Point Size", value: formatNumber(mondoSize) },
      details: [
        { label: "Recommended Shell Size", value: formatNumber(shellSize) },
        { label: "Last Width", value: lastWidth },
        { label: "Recommended Flex", value: formatNumber(flex) }
      ]
    };
  }`,
  [
    { q: "What is mondo point sizing?", a: "Mondo point is the ski boot sizing system based on foot length in centimeters. A 27cm foot takes a mondo size 27 boot." },
    { q: "What flex should my ski boot be?", a: "Beginners typically use 60 to 80 flex, intermediates 80 to 100, and advanced skiers 100 to 130 or higher." },
    { q: "Should ski boots be tight?", a: "Ski boots should be snug but not painful. Your toes should lightly touch the front when standing upright." }
  ],
  "Mondo Size = Foot Length (cm) rounded to nearest 0.5; Flex = Base Flex (by weight) + Ability Adjustment",
  ["snowboard-size-calculator", "kayak-size-calculator"]
);

add(
  "bicycle-gear-ratio-calculator",
  "Bicycle Gear Ratio Calculator",
  "Calculate gear ratios, development, and speed for any chainring and cassette combination.",
  "Everyday",
  "everyday",
  "~",
  ["bicycle gear ratio", "bike gearing", "chainring cassette", "gear inches"],
  [
    '{ name: "chainring", label: "Chainring Teeth", type: "number", min: 20, max: 60, defaultValue: 50 }',
    '{ name: "cog", label: "Rear Cog Teeth", type: "number", min: 10, max: 42, defaultValue: 17 }',
    '{ name: "wheelSize", label: "Wheel Size", type: "select", options: [{ value: "2100", label: "700c (2100mm)" }, { value: "2070", label: "650b (2070mm)" }, { value: "2030", label: "26 inch (2030mm)" }, { value: "2290", label: "29 inch (2290mm)" }], defaultValue: "2100" }',
    '{ name: "cadence", label: "Pedaling Cadence (RPM)", type: "number", min: 50, max: 130, defaultValue: 85 }'
  ],
  `(inputs) => {
    const chainring = inputs.chainring as number;
    const cog = inputs.cog as number;
    const wheelSize = parseInt(inputs.wheelSize as string);
    const cadence = inputs.cadence as number;
    const gearRatio = chainring / cog;
    const development = gearRatio * (wheelSize / 1000) * Math.PI;
    const speedKmh = development * cadence * 60 / 1000;
    const speedMph = speedKmh * 0.621371;
    const gearInches = gearRatio * (wheelSize / 25.4 / Math.PI) * Math.PI;
    return {
      primary: { label: "Gear Ratio", value: formatNumber(Math.round(gearRatio * 100) / 100) },
      details: [
        { label: "Development", value: formatNumber(Math.round(development * 100) / 100) + " m per pedal rev" },
        { label: "Speed at Cadence", value: formatNumber(Math.round(speedMph * 10) / 10) + " mph" },
        { label: "Gear Inches", value: formatNumber(Math.round(gearInches * 10) / 10) }
      ]
    };
  }`,
  [
    { q: "What is a good gear ratio for cycling?", a: "It depends on terrain. A ratio of 2.5 to 3.0 is common for flat riding, while 1.0 to 1.5 is typical for climbing steep hills." },
    { q: "What are gear inches?", a: "Gear inches represent the effective diameter of the wheel as if it were a penny-farthing. Higher gear inches mean a harder gear." },
    { q: "What cadence should I ride at?", a: "Most efficient cycling occurs between 80 and 100 RPM. Beginners often pedal at 60 to 80 RPM." }
  ],
  "Gear Ratio = Chainring Teeth / Cog Teeth; Development = Ratio x Wheel Circumference",
  ["tennis-racket-string-tension-calculator", "swim-pace-calculator"]
);

add(
  "swim-pace-calculator",
  "Swim Pace Calculator",
  "Calculate swim pace per 100m or 100yd, total time, and calorie burn for pool or open water swimming.",
  "Health",
  "health",
  "H",
  ["swim pace", "swimming time", "pool pace calculator", "swim speed"],
  [
    '{ name: "distance", label: "Distance (meters)", type: "number", min: 25, max: 10000, defaultValue: 1500 }',
    '{ name: "minutes", label: "Total Time Minutes", type: "number", min: 0, max: 300, defaultValue: 30 }',
    '{ name: "seconds", label: "Total Time Seconds", type: "number", min: 0, max: 59, defaultValue: 0 }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 400, defaultValue: 160 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const minutes = inputs.minutes as number;
    const seconds = inputs.seconds as number;
    const weight = inputs.weight as number;
    const totalSeconds = minutes * 60 + seconds;
    const pacePer100 = (totalSeconds / distance) * 100;
    const paceMin = Math.floor(pacePer100 / 60);
    const paceSec = Math.round(pacePer100 % 60);
    const speedMph = (distance / 1609.34) / (totalSeconds / 3600);
    const metPerMin = weight * 0.00714 * speedMph * 3.5;
    const calories = Math.round(metPerMin * (totalSeconds / 60));
    return {
      primary: { label: "Pace per 100m", value: formatNumber(paceMin) + ":" + (paceSec < 10 ? "0" : "") + formatNumber(paceSec) },
      details: [
        { label: "Speed", value: formatNumber(Math.round(speedMph * 100) / 100) + " mph" },
        { label: "Estimated Calories", value: formatNumber(calories) + " cal" },
        { label: "Total Time", value: formatNumber(minutes) + "m " + formatNumber(seconds) + "s" }
      ]
    };
  }`,
  [
    { q: "What is a good swim pace per 100m?", a: "Beginner swimmers average 2:30 to 3:00 per 100m. Intermediate swimmers hit 1:45 to 2:15, and competitive swimmers are often under 1:30." },
    { q: "How many calories does swimming burn?", a: "Swimming burns roughly 400 to 700 calories per hour depending on intensity, stroke, and body weight." },
    { q: "Is swimming good for weight loss?", a: "Yes, swimming is an excellent full-body workout that is easy on joints and can burn significant calories." }
  ],
  "Pace per 100m = (Total Seconds / Distance) x 100; Calories = MET x Duration x Body Weight Factor",
  ["triathlon-transition-time-calculator", "rowing-stroke-rate-calculator"]
);

add(
  "running-shoe-mileage-calculator",
  "Running Shoe Mileage Calculator",
  "Track running shoe wear and estimate remaining lifespan based on weekly mileage and shoe type.",
  "Health",
  "health",
  "H",
  ["running shoe mileage", "shoe replacement", "shoe lifespan", "running shoe tracker"],
  [
    '{ name: "weeklyMiles", label: "Weekly Mileage", type: "number", min: 1, max: 150, defaultValue: 25 }',
    '{ name: "currentMiles", label: "Current Miles on Shoes", type: "number", min: 0, max: 1000, defaultValue: 150 }',
    '{ name: "shoeType", label: "Shoe Type", type: "select", options: [{ value: "350", label: "Lightweight Racing" }, { value: "450", label: "Standard Training" }, { value: "550", label: "Max Cushion / Trail" }], defaultValue: "450" }',
    '{ name: "terrain", label: "Primary Terrain", type: "select", options: [{ value: "1", label: "Road" }, { value: "0.85", label: "Trail" }, { value: "1.1", label: "Treadmill" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const weeklyMiles = inputs.weeklyMiles as number;
    const currentMiles = inputs.currentMiles as number;
    const maxMiles = parseInt(inputs.shoeType as string);
    const terrainFactor = parseFloat(inputs.terrain as string);
    const adjustedMax = Math.round(maxMiles * terrainFactor);
    const remaining = Math.max(adjustedMax - currentMiles, 0);
    const weeksLeft = weeklyMiles > 0 ? Math.round(remaining / weeklyMiles) : 0;
    const wearPercent = Math.min(Math.round((currentMiles / adjustedMax) * 100), 100);
    return {
      primary: { label: "Remaining Shoe Life", value: formatNumber(remaining) + " miles" },
      details: [
        { label: "Weeks Until Replacement", value: formatNumber(weeksLeft) },
        { label: "Wear Percentage", value: formatNumber(wearPercent) + "%" },
        { label: "Adjusted Max Lifespan", value: formatNumber(adjustedMax) + " miles" }
      ]
    };
  }`,
  [
    { q: "How long do running shoes last?", a: "Most running shoes last 300 to 500 miles. Lightweight racing shoes may wear out closer to 200 to 350 miles." },
    { q: "How do I know when to replace running shoes?", a: "Replace shoes when you notice reduced cushioning, visible sole wear, or new aches and pains during runs." },
    { q: "Do trail shoes last longer?", a: "Trail shoes often have more durable outsoles but the rough terrain can reduce overall lifespan compared to road running." }
  ],
  "Remaining Miles = (Max Lifespan x Terrain Factor) - Current Miles; Weeks Left = Remaining / Weekly Mileage",
  ["swim-pace-calculator", "triathlon-transition-time-calculator"]
);

add(
  "boxing-reach-advantage-calculator",
  "Boxing Reach Advantage Calculator",
  "Calculate reach advantage and optimal fighting distance based on arm span and height.",
  "Health",
  "health",
  "H",
  ["boxing reach", "reach advantage", "arm span boxing", "fighting distance"],
  [
    '{ name: "yourReach", label: "Your Reach (inches)", type: "number", min: 55, max: 90, defaultValue: 72 }',
    '{ name: "opponentReach", label: "Opponent Reach (inches)", type: "number", min: 55, max: 90, defaultValue: 70 }',
    '{ name: "yourHeight", label: "Your Height (inches)", type: "number", min: 58, max: 84, defaultValue: 70 }',
    '{ name: "stance", label: "Your Stance", type: "select", options: [{ value: "1", label: "Orthodox" }, { value: "2", label: "Southpaw" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const yourReach = inputs.yourReach as number;
    const opponentReach = inputs.opponentReach as number;
    const yourHeight = inputs.yourHeight as number;
    const stance = parseInt(inputs.stance as string);
    const reachDiff = yourReach - opponentReach;
    const apeIndex = yourReach - yourHeight;
    const optimalDistance = Math.round(yourReach * 0.6);
    const jabRange = Math.round(yourReach * 0.42);
    const advantage = reachDiff > 0 ? "You have the reach advantage" : reachDiff < 0 ? "Opponent has the reach advantage" : "Reach is equal";
    return {
      primary: { label: "Reach Difference", value: (reachDiff >= 0 ? "+" : "") + formatNumber(reachDiff) + " inches" },
      details: [
        { label: "Assessment", value: advantage },
        { label: "Ape Index", value: (apeIndex >= 0 ? "+" : "") + formatNumber(apeIndex) + " inches" },
        { label: "Optimal Fighting Distance", value: formatNumber(optimalDistance) + " inches" }
      ]
    };
  }`,
  [
    { q: "What is reach in boxing?", a: "Reach is the distance from fingertip to fingertip with arms outstretched. It determines how far you can hit without being hit." },
    { q: "What is ape index?", a: "Ape index is the difference between your arm span and height. A positive ape index is advantageous in combat sports." },
    { q: "Does reach advantage matter in boxing?", a: "Yes, a longer reach allows fighters to land jabs from further away and control distance. It is one of the most important physical attributes." }
  ],
  "Reach Difference = Your Reach - Opponent Reach; Ape Index = Reach - Height",
  ["martial-arts-belt-progression-calculator", "lacrosse-stick-length-calculator"]
);

add(
  "hockey-stick-flex-calculator",
  "Hockey Stick Flex Calculator",
  "Determine optimal hockey stick flex rating based on body weight, position, and playing style.",
  "Everyday",
  "everyday",
  "~",
  ["hockey stick flex", "hockey stick rating", "stick flex guide", "hockey equipment"],
  [
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 60, max: 300, defaultValue: 180 }',
    '{ name: "position", label: "Position", type: "select", options: [{ value: "1", label: "Forward" }, { value: "2", label: "Defenseman" }, { value: "3", label: "Goalie" }], defaultValue: "1" }',
    '{ name: "shotType", label: "Shot Type Preference", type: "select", options: [{ value: "1", label: "Wrist / Snap Shot" }, { value: "2", label: "Slap Shot" }], defaultValue: "1" }',
    '{ name: "height", label: "Height (inches)", type: "number", min: 48, max: 84, defaultValue: 70 }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const position = parseInt(inputs.position as string);
    const shotType = parseInt(inputs.shotType as string);
    const height = inputs.height as number;
    const baseFlex = Math.round(weight / 2);
    const posAdj = position === 2 ? 5 : position === 3 ? -10 : 0;
    const shotAdj = shotType === 2 ? 5 : -5;
    const flex = baseFlex + posAdj + shotAdj;
    const stickLength = height <= 60 ? "Junior (46-54 in)" : height <= 68 ? "Intermediate (54-57 in)" : "Senior (57-63 in)";
    const kickPoint = shotType === 1 ? "Low Kick" : "Mid Kick";
    return {
      primary: { label: "Recommended Flex", value: formatNumber(flex) },
      details: [
        { label: "Stick Category", value: stickLength },
        { label: "Kick Point", value: kickPoint },
        { label: "Position Adjustment", value: (posAdj >= 0 ? "+" : "") + formatNumber(posAdj) }
      ]
    };
  }`,
  [
    { q: "What flex hockey stick should I use?", a: "A common guideline is to use a flex rating equal to about half your body weight in pounds." },
    { q: "Does position affect stick flex?", a: "Yes, defensemen often prefer slightly stiffer sticks for slap shots while forwards may prefer softer flex for quick releases." },
    { q: "What is kick point?", a: "Kick point is where the stick flexes most. Low kick helps wrist shots; mid kick helps slap shots." }
  ],
  "Base Flex = Body Weight / 2; Final Flex = Base + Position Adj + Shot Type Adj",
  ["lacrosse-stick-length-calculator", "baseball-bat-weight-calculator"]
);

add(
  "baseball-bat-weight-calculator",
  "Baseball Bat Weight Calculator",
  "Find ideal bat weight and length-to-weight drop based on age, height, and league requirements.",
  "Everyday",
  "everyday",
  "~",
  ["baseball bat weight", "bat size", "bat drop", "bat length"],
  [
    '{ name: "age", label: "Player Age", type: "number", min: 5, max: 60, defaultValue: 16 }',
    '{ name: "height", label: "Height (inches)", type: "number", min: 36, max: 84, defaultValue: 68 }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 40, max: 300, defaultValue: 160 }',
    '{ name: "league", label: "League Type", type: "select", options: [{ value: "1", label: "Youth (T-Ball/Coach Pitch)" }, { value: "2", label: "Little League" }, { value: "3", label: "High School" }, { value: "4", label: "College/Adult" }], defaultValue: "3" }'
  ],
  `(inputs) => {
    const age = inputs.age as number;
    const height = inputs.height as number;
    const weight = inputs.weight as number;
    const league = parseInt(inputs.league as string);
    var batLength = 0;
    if (height <= 48) batLength = 26;
    else if (height <= 54) batLength = 28;
    else if (height <= 60) batLength = 29;
    else if (height <= 66) batLength = 31;
    else if (height <= 72) batLength = 32;
    else batLength = 33;
    var drop = league === 1 ? -12 : league === 2 ? -10 : league === 3 ? -3 : -3;
    if (age < 10) drop = Math.min(drop, -10);
    const batWeight = batLength + drop;
    return {
      primary: { label: "Recommended Bat Weight", value: formatNumber(batWeight) + " oz" },
      details: [
        { label: "Bat Length", value: formatNumber(batLength) + " inches" },
        { label: "Drop Weight", value: formatNumber(drop) },
        { label: "League Standard", value: league === 1 ? "Youth" : league === 2 ? "Little League" : league === 3 ? "High School" : "College/Adult" }
      ]
    };
  }`,
  [
    { q: "What does bat drop mean?", a: "Bat drop is the difference between length in inches and weight in ounces. A 32 inch bat weighing 29 oz has a drop of -3." },
    { q: "How do I know what bat size to get?", a: "Bat size depends on height, weight, and league rules. Youth bats are lighter with higher drops while adult bats are heavier." },
    { q: "What bat drop is allowed in high school?", a: "NFHS high school rules require BBCOR-certified bats with a -3 drop maximum." }
  ],
  "Bat Length = based on height chart; Bat Weight = Bat Length + Drop",
  ["golf-club-fitting-calculator", "hockey-stick-flex-calculator"]
);

add(
  "basketball-court-dimensions-calculator",
  "Basketball Court Dimensions Calculator",
  "Calculate total area, paint zone, three-point area, and markings for various basketball court types.",
  "Math",
  "math",
  "+",
  ["basketball court dimensions", "court area", "basketball measurements", "court markings"],
  [
    '{ name: "courtType", label: "Court Type", type: "select", options: [{ value: "1", label: "NBA (94x50 ft)" }, { value: "2", label: "NCAA (94x50 ft)" }, { value: "3", label: "High School (84x50 ft)" }, { value: "4", label: "FIBA (91.9x49.2 ft)" }], defaultValue: "1" }',
    '{ name: "includeRunout", label: "Include Runout Area (ft)", type: "number", min: 0, max: 15, defaultValue: 6 }',
    '{ name: "surfaceCost", label: "Surface Cost per Sq Ft ($)", type: "number", min: 1, max: 50, defaultValue: 5 }'
  ],
  `(inputs) => {
    const courtType = parseInt(inputs.courtType as string);
    const runout = inputs.includeRunout as number;
    const surfaceCost = inputs.surfaceCost as number;
    const dims = courtType === 1 ? [94, 50] : courtType === 2 ? [94, 50] : courtType === 3 ? [84, 50] : [91.9, 49.2];
    const length = dims[0];
    const width = dims[1];
    const courtArea = length * width;
    const totalLength = length + 2 * runout;
    const totalWidth = width + 2 * runout;
    const totalArea = totalLength * totalWidth;
    const totalCost = Math.round(totalArea * surfaceCost);
    const threePointDist = courtType === 1 ? 23.75 : courtType === 2 ? 22.15 : courtType === 3 ? 19.75 : 22.15;
    return {
      primary: { label: "Court Area", value: formatNumber(Math.round(courtArea)) + " sq ft" },
      details: [
        { label: "Dimensions", value: formatNumber(length) + " x " + formatNumber(width) + " ft" },
        { label: "Total Area with Runout", value: formatNumber(Math.round(totalArea)) + " sq ft" },
        { label: "Three-Point Distance", value: formatNumber(threePointDist) + " ft" },
        { label: "Estimated Surface Cost", value: "$" + formatNumber(totalCost) }
      ]
    };
  }`,
  [
    { q: "How big is a standard basketball court?", a: "An NBA and NCAA court is 94 feet long by 50 feet wide. High school courts are 84 by 50 feet." },
    { q: "What is the three-point line distance?", a: "The NBA three-point line is 23 feet 9 inches from the basket. College is 22 feet 1.75 inches." },
    { q: "How much does a basketball court cost to build?", a: "An outdoor court costs $10,000 to $40,000. Indoor courts can cost $100,000 or more depending on materials." }
  ],
  "Court Area = Length x Width; Total Area = (Length + 2 x Runout) x (Width + 2 x Runout)",
  ["soccer-field-area-calculator", "football-field-goal-distance-calculator"]
);

add(
  "football-field-goal-distance-calculator",
  "Football Field Goal Distance Calculator",
  "Calculate actual field goal kick distance including end zone and holder position offset.",
  "Math",
  "math",
  "+",
  ["field goal distance", "football kick distance", "field goal calculator", "kicking distance"],
  [
    '{ name: "lineOfScrimmage", label: "Line of Scrimmage (yard line)", type: "number", min: 1, max: 50, defaultValue: 25 }',
    '{ name: "holderOffset", label: "Holder Position (yards behind line)", type: "number", min: 6, max: 9, defaultValue: 7 }',
    '{ name: "endZoneDepth", label: "End Zone Depth (yards)", type: "number", min: 10, max: 10, defaultValue: 10 }',
    '{ name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 0, max: 40, defaultValue: 0 }'
  ],
  `(inputs) => {
    const los = inputs.lineOfScrimmage as number;
    const holder = inputs.holderOffset as number;
    const endZone = inputs.endZoneDepth as number;
    const wind = inputs.windSpeed as number;
    const kickDistance = los + holder + endZone;
    const kickDistanceFt = kickDistance * 3;
    const windEffect = wind > 10 ? (wind > 20 ? "Strong headwind reduces accuracy significantly" : "Moderate wind impact") : "Minimal wind impact";
    const difficulty = kickDistance <= 30 ? "Easy (chip shot)" : kickDistance <= 40 ? "Short" : kickDistance <= 50 ? "Moderate" : kickDistance <= 55 ? "Long" : "Very Long";
    const nflAvgPct = kickDistance <= 30 ? 95 : kickDistance <= 40 ? 88 : kickDistance <= 50 ? 75 : kickDistance <= 55 ? 60 : 40;
    return {
      primary: { label: "Field Goal Distance", value: formatNumber(kickDistance) + " yards" },
      details: [
        { label: "Distance in Feet", value: formatNumber(kickDistanceFt) + " ft" },
        { label: "Difficulty Rating", value: difficulty },
        { label: "NFL Average Make %", value: formatNumber(nflAvgPct) + "%" },
        { label: "Wind Assessment", value: windEffect }
      ]
    };
  }`,
  [
    { q: "How is field goal distance calculated?", a: "Field goal distance equals the line of scrimmage plus 7 yards for the holder plus 10 yards for the end zone. A kick from the 25-yard line is a 42-yard attempt." },
    { q: "What is the longest NFL field goal?", a: "The longest NFL field goal is 66 yards, kicked by Justin Tucker in 2021." },
    { q: "What percentage of 50-yard field goals are made?", a: "NFL kickers convert roughly 60 to 70 percent of field goals from 50 to 54 yards." }
  ],
  "Field Goal Distance = Line of Scrimmage + Holder Offset (7 yds) + End Zone (10 yds)",
  ["basketball-court-dimensions-calculator", "soccer-field-area-calculator"]
);

add(
  "soccer-field-area-calculator",
  "Soccer Field Area Calculator",
  "Calculate soccer field area, penalty box dimensions, and turf requirements for different standards.",
  "Math",
  "math",
  "+",
  ["soccer field area", "soccer pitch size", "football pitch dimensions", "soccer field calculator"],
  [
    '{ name: "fieldStandard", label: "Field Standard", type: "select", options: [{ value: "1", label: "FIFA International (110x75 yd)" }, { value: "2", label: "MLS/Premier League (115x75 yd)" }, { value: "3", label: "Youth U12 (80x50 yd)" }, { value: "4", label: "Youth U8 (40x30 yd)" }], defaultValue: "1" }',
    '{ name: "turfCost", label: "Turf Cost per Sq Yd ($)", type: "number", min: 1, max: 30, defaultValue: 8 }',
    '{ name: "unit", label: "Display Units", type: "select", options: [{ value: "1", label: "Yards" }, { value: "2", label: "Meters" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const standard = parseInt(inputs.fieldStandard as string);
    const turfCost = inputs.turfCost as number;
    const unit = parseInt(inputs.unit as string);
    const dims = standard === 1 ? [110, 75] : standard === 2 ? [115, 75] : standard === 3 ? [80, 50] : [40, 30];
    var length = dims[0];
    var width = dims[1];
    const areaYd = length * width;
    const areaSqFt = areaYd * 9;
    const totalTurfCost = Math.round(areaYd * turfCost);
    const penaltyBoxL = standard <= 2 ? 18 : standard === 3 ? 14 : 10;
    const penaltyBoxW = standard <= 2 ? 44 : standard === 3 ? 32 : 20;
    const label = unit === 2 ? "meters" : "yards";
    const factor = unit === 2 ? 0.9144 : 1;
    return {
      primary: { label: "Field Area", value: formatNumber(Math.round(areaYd * factor * factor)) + " sq " + label },
      details: [
        { label: "Dimensions", value: formatNumber(Math.round(length * factor)) + " x " + formatNumber(Math.round(width * factor)) + " " + label },
        { label: "Penalty Box", value: formatNumber(Math.round(penaltyBoxL * factor)) + " x " + formatNumber(Math.round(penaltyBoxW * factor)) + " " + label },
        { label: "Estimated Turf Cost", value: "$" + formatNumber(totalTurfCost) }
      ]
    };
  }`,
  [
    { q: "How big is a standard soccer field?", a: "A FIFA international field is 110 to 120 yards long and 70 to 80 yards wide. The most common size is 110 by 75 yards." },
    { q: "Are all soccer fields the same size?", a: "No, FIFA allows a range of dimensions. Youth fields are significantly smaller than professional fields." },
    { q: "How big is the penalty box?", a: "The standard penalty area is 18 yards deep by 44 yards wide on a full-size field." }
  ],
  "Field Area = Length x Width; Turf Cost = Area x Cost per Sq Yd",
  ["basketball-court-dimensions-calculator", "football-field-goal-distance-calculator"]
);

add(
  "archery-arrow-spine-calculator",
  "Archery Arrow Spine Calculator",
  "Calculate correct arrow spine stiffness based on draw weight, arrow length, and point weight.",
  "Everyday",
  "everyday",
  "~",
  ["arrow spine", "archery arrow", "arrow stiffness", "spine chart"],
  [
    '{ name: "drawWeight", label: "Draw Weight (lbs)", type: "number", min: 15, max: 80, defaultValue: 45 }',
    '{ name: "arrowLength", label: "Arrow Length (inches)", type: "number", min: 24, max: 34, defaultValue: 28 }',
    '{ name: "pointWeight", label: "Point Weight (grains)", type: "number", min: 75, max: 300, defaultValue: 100 }',
    '{ name: "bowType", label: "Bow Type", type: "select", options: [{ value: "1", label: "Compound" }, { value: "2", label: "Recurve" }, { value: "3", label: "Longbow" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const drawWeight = inputs.drawWeight as number;
    const arrowLength = inputs.arrowLength as number;
    const pointWeight = inputs.pointWeight as number;
    const bowType = parseInt(inputs.bowType as string);
    var effectiveWeight = drawWeight;
    if (arrowLength > 28) effectiveWeight += (arrowLength - 28) * 1.5;
    if (arrowLength < 28) effectiveWeight -= (28 - arrowLength) * 1.5;
    if (pointWeight > 125) effectiveWeight += (pointWeight - 125) * 0.03;
    if (bowType === 2) effectiveWeight -= 5;
    if (bowType === 3) effectiveWeight -= 10;
    var spine = 0;
    if (effectiveWeight < 30) spine = 700;
    else if (effectiveWeight < 40) spine = 600;
    else if (effectiveWeight < 50) spine = 500;
    else if (effectiveWeight < 60) spine = 400;
    else if (effectiveWeight < 70) spine = 340;
    else spine = 300;
    const grainPerLb = Math.round(pointWeight / drawWeight * 10) / 10;
    const foc = Math.round((pointWeight / (arrowLength * 8 + pointWeight)) * 100);
    return {
      primary: { label: "Recommended Spine", value: formatNumber(spine) },
      details: [
        { label: "Effective Draw Weight", value: formatNumber(Math.round(effectiveWeight)) + " lbs" },
        { label: "Grains per Lb", value: formatNumber(grainPerLb) },
        { label: "Estimated FOC", value: formatNumber(foc) + "%" }
      ]
    };
  }`,
  [
    { q: "What is arrow spine?", a: "Arrow spine is a measure of stiffness. A lower number means a stiffer arrow. Spine 400 deflects less than spine 600." },
    { q: "What happens if arrow spine is wrong?", a: "Too weak a spine causes arrows to flex excessively and fly erratically. Too stiff a spine reduces accuracy and forgiveness." },
    { q: "What is FOC in archery?", a: "Front of Center is the percentage of the arrow weight that is in the front half. An FOC of 10 to 15 percent is ideal for target shooting." }
  ],
  "Effective Weight = Draw Weight + Length Adj + Point Weight Adj + Bow Type Adj; Spine from lookup table",
  ["tennis-racket-string-tension-calculator", "bowling-ball-weight-calculator"]
);

add(
  "bowling-ball-weight-calculator",
  "Bowling Ball Weight Calculator",
  "Find ideal bowling ball weight based on body weight, age, strength level, and bowling style.",
  "Everyday",
  "everyday",
  "~",
  ["bowling ball weight", "bowling ball size", "bowling equipment", "ball weight guide"],
  [
    '{ name: "bodyWeight", label: "Body Weight (lbs)", type: "number", min: 40, max: 350, defaultValue: 170 }',
    '{ name: "age", label: "Age", type: "number", min: 5, max: 90, defaultValue: 30 }',
    '{ name: "strength", label: "Upper Body Strength", type: "select", options: [{ value: "0.8", label: "Below Average" }, { value: "1", label: "Average" }, { value: "1.2", label: "Above Average" }], defaultValue: "1" }',
    '{ name: "style", label: "Bowling Style", type: "select", options: [{ value: "1", label: "Straight Ball" }, { value: "2", label: "Hook Ball" }, { value: "3", label: "Power Player" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const bodyWeight = inputs.bodyWeight as number;
    const age = inputs.age as number;
    const strength = parseFloat(inputs.strength as string);
    const style = parseInt(inputs.style as string);
    var baseBall = Math.round(bodyWeight * 0.1);
    baseBall = Math.round(baseBall * strength);
    if (age < 12) baseBall = Math.min(baseBall, 10);
    else if (age > 60) baseBall = Math.max(baseBall - 2, 8);
    if (style === 3) baseBall = Math.max(baseBall - 1, 8);
    baseBall = Math.max(Math.min(baseBall, 16), 6);
    const spanSize = bodyWeight < 120 ? "Small" : bodyWeight < 180 ? "Medium" : "Large";
    return {
      primary: { label: "Recommended Ball Weight", value: formatNumber(baseBall) + " lbs" },
      details: [
        { label: "Weight Range", value: formatNumber(Math.max(baseBall - 1, 6)) + " - " + formatNumber(Math.min(baseBall + 1, 16)) + " lbs" },
        { label: "Hand Span", value: spanSize },
        { label: "Max Recommended", value: formatNumber(Math.min(Math.round(bodyWeight * 0.1 * 1.2), 16)) + " lbs" }
      ]
    };
  }`,
  [
    { q: "How heavy should my bowling ball be?", a: "A common guideline is about 10 percent of your body weight, up to 16 pounds maximum." },
    { q: "Is a heavier bowling ball better?", a: "Heavier balls carry more energy into the pins but only if you can control them comfortably. An overly heavy ball hurts accuracy." },
    { q: "What weight bowling ball do pros use?", a: "Most professional bowlers use 15 or 16 pound balls for maximum pin carry." }
  ],
  "Ball Weight = Body Weight x 10% x Strength Factor, adjusted for age and style (6-16 lb range)",
  ["archery-arrow-spine-calculator", "baseball-bat-weight-calculator"]
);

add(
  "rock-climbing-grade-converter-calculator",
  "Rock Climbing Grade Converter Calculator",
  "Convert climbing grades between YDS, French, UIAA, and Ewbank systems.",
  "Conversion",
  "conversion",
  "R",
  ["climbing grade converter", "YDS to French", "climbing difficulty", "bouldering grade"],
  [
    '{ name: "grade", label: "Grade Value (numeric, e.g. 10 for 5.10)", type: "number", min: 1, max: 15, defaultValue: 10 }',
    '{ name: "subGrade", label: "Sub Grade", type: "select", options: [{ value: "0", label: "a / base" }, { value: "1", label: "b" }, { value: "2", label: "c" }, { value: "3", label: "d" }], defaultValue: "0" }',
    '{ name: "climbType", label: "Climb Type", type: "select", options: [{ value: "1", label: "Sport / Trad" }, { value: "2", label: "Bouldering" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const grade = inputs.grade as number;
    const subGrade = parseInt(inputs.subGrade as string);
    const climbType = parseInt(inputs.climbType as string);
    const subLabels = ["a", "b", "c", "d"];
    var yds = "";
    var french = "";
    var uiaa = "";
    if (climbType === 1) {
      yds = "5." + grade + (grade >= 10 ? subLabels[subGrade] : "");
      const frenchNum = Math.round(grade * 0.85 + subGrade * 0.2 + 1);
      french = formatNumber(frenchNum) + subLabels[Math.min(subGrade, 2)];
      uiaa = "VII" + (grade > 10 ? "+" : "");
      if (grade <= 7) uiaa = "IV";
      else if (grade <= 8) uiaa = "V";
      else if (grade <= 9) uiaa = "VI";
      else if (grade <= 10) uiaa = "VII";
      else if (grade <= 11) uiaa = "VIII";
      else if (grade <= 12) uiaa = "IX";
      else uiaa = "X";
    } else {
      yds = "V" + formatNumber(Math.max(grade - 6, 0));
      french = formatNumber(grade) + subLabels[Math.min(subGrade, 2)];
      uiaa = "Font " + formatNumber(grade) + subLabels[Math.min(subGrade, 2)];
    }
    return {
      primary: { label: "YDS Grade", value: yds },
      details: [
        { label: "French Grade", value: french },
        { label: "UIAA Grade", value: uiaa },
        { label: "Type", value: climbType === 1 ? "Sport / Trad" : "Bouldering" }
      ]
    };
  }`,
  [
    { q: "What climbing grade system is used in the US?", a: "The US uses the Yosemite Decimal System (YDS) for rope climbing (5.0 to 5.15) and the V-scale for bouldering (V0 to V17)." },
    { q: "What is French climbing grade?", a: "The French system uses numbers and letters like 6a, 7b+. It is widely used in Europe for both sport and bouldering." },
    { q: "What is a good beginner climbing grade?", a: "Beginners typically start at 5.6 to 5.8 in YDS or V0 to V1 in bouldering." }
  ],
  "Conversion uses grade lookup tables between YDS, French, UIAA, Ewbank, and V-scale systems",
  ["surfboard-volume-calculator", "kayak-size-calculator"]
);

add(
  "surfboard-volume-calculator",
  "Surfboard Volume Calculator",
  "Calculate ideal surfboard volume in liters based on weight, skill level, and wave conditions.",
  "Everyday",
  "everyday",
  "~",
  ["surfboard volume", "surfboard size", "surfboard liters", "board volume"],
  [
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 300, defaultValue: 170 }',
    '{ name: "skill", label: "Skill Level", type: "select", options: [{ value: "0.7", label: "Beginner" }, { value: "0.5", label: "Intermediate" }, { value: "0.38", label: "Advanced" }, { value: "0.34", label: "Pro" }], defaultValue: "0.5" }',
    '{ name: "fitness", label: "Fitness Level", type: "select", options: [{ value: "1.1", label: "Low" }, { value: "1", label: "Average" }, { value: "0.9", label: "High" }], defaultValue: "1" }',
    '{ name: "waveType", label: "Wave Conditions", type: "select", options: [{ value: "1.15", label: "Small / Mushy" }, { value: "1", label: "Average" }, { value: "0.9", label: "Overhead / Powerful" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const skill = parseFloat(inputs.skill as string);
    const fitness = parseFloat(inputs.fitness as string);
    const waveType = parseFloat(inputs.waveType as string);
    const weightKg = weight * 0.453592;
    const volume = Math.round(weightKg * skill * fitness * waveType * 10) / 10;
    const lengthFt = volume < 25 ? "5'8 - 6'0" : volume < 35 ? "6'0 - 6'6" : volume < 45 ? "6'6 - 7'2" : "7'6 - 9'0";
    const boardType = volume < 25 ? "Shortboard" : volume < 35 ? "Fish / Hybrid" : volume < 45 ? "Funboard / Mini-Mal" : "Longboard";
    return {
      primary: { label: "Recommended Volume", value: formatNumber(volume) + " liters" },
      details: [
        { label: "Board Type", value: boardType },
        { label: "Approximate Length", value: lengthFt },
        { label: "Weight in Kg", value: formatNumber(Math.round(weightKg * 10) / 10) + " kg" }
      ]
    };
  }`,
  [
    { q: "How do I choose surfboard volume?", a: "Volume depends on your weight, skill, and wave conditions. Beginners need about 0.6 to 0.8 liters per kg of body weight." },
    { q: "What does surfboard volume affect?", a: "More volume gives more float and paddle power, making it easier to catch waves. Less volume allows sharper turns." },
    { q: "What volume surfboard for a beginner?", a: "A 170 lb beginner should look for a board around 50 to 60 liters for maximum stability and wave-catching ability." }
  ],
  "Volume (L) = Weight (kg) x Skill Factor x Fitness Factor x Wave Factor",
  ["kayak-size-calculator", "snowboard-size-calculator"]
);

add(
  "kayak-size-calculator",
  "Kayak Size Calculator",
  "Find the right kayak length and width based on your weight, paddling style, and intended water type.",
  "Everyday",
  "everyday",
  "~",
  ["kayak size", "kayak length", "kayak width", "kayak fitting"],
  [
    '{ name: "weight", label: "Paddler Weight (lbs)", type: "number", min: 60, max: 350, defaultValue: 170 }',
    '{ name: "height", label: "Paddler Height (inches)", type: "number", min: 54, max: 84, defaultValue: 70 }',
    '{ name: "waterType", label: "Water Type", type: "select", options: [{ value: "1", label: "Calm Lakes / Ponds" }, { value: "2", label: "Rivers / Streams" }, { value: "3", label: "Coastal / Open Water" }, { value: "4", label: "Whitewater" }], defaultValue: "1" }',
    '{ name: "purpose", label: "Primary Purpose", type: "select", options: [{ value: "1", label: "Recreational" }, { value: "2", label: "Touring / Fitness" }, { value: "3", label: "Fishing" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const height = inputs.height as number;
    const waterType = parseInt(inputs.waterType as string);
    const purpose = parseInt(inputs.purpose as string);
    var lengthFt = 10;
    if (purpose === 1) lengthFt = weight < 150 ? 9.5 : weight < 200 ? 10.5 : 12;
    else if (purpose === 2) lengthFt = weight < 150 ? 12 : weight < 200 ? 14 : 16;
    else lengthFt = weight < 150 ? 10 : weight < 200 ? 12 : 13;
    if (waterType === 3) lengthFt += 2;
    if (waterType === 4) lengthFt = Math.min(lengthFt, 9);
    var widthIn = purpose === 1 ? 30 : purpose === 2 ? 24 : 34;
    if (weight > 220) widthIn += 2;
    const capacity = Math.round(weight * 1.5 + 30);
    const cockpitSize = height > 74 ? "Large" : height > 66 ? "Medium" : "Standard";
    return {
      primary: { label: "Recommended Kayak Length", value: formatNumber(Math.round(lengthFt * 10) / 10) + " ft" },
      details: [
        { label: "Recommended Width", value: formatNumber(widthIn) + " inches" },
        { label: "Min Weight Capacity", value: formatNumber(capacity) + " lbs" },
        { label: "Cockpit Size", value: cockpitSize }
      ]
    };
  }`,
  [
    { q: "What size kayak do I need?", a: "Kayak size depends on your weight, height, and intended use. Recreational kayaks are 9 to 12 feet, touring kayaks 12 to 16 feet." },
    { q: "Does kayak width matter?", a: "Wider kayaks are more stable but slower. Narrow kayaks track better and are faster but require more balance." },
    { q: "What weight capacity kayak should I get?", a: "Choose a kayak with at least 1.5 times your body weight in capacity to maintain proper performance." }
  ],
  "Length based on weight, purpose, and water type tables; Width by purpose; Capacity = Weight x 1.5 + 30",
  ["surfboard-volume-calculator", "snowboard-size-calculator"]
);

add(
  "snowboard-size-calculator",
  "Snowboard Size Calculator",
  "Calculate ideal snowboard length and width based on height, weight, boot size, and riding style.",
  "Everyday",
  "everyday",
  "~",
  ["snowboard size", "snowboard length", "snowboard width", "snowboard fitting"],
  [
    '{ name: "height", label: "Height (inches)", type: "number", min: 48, max: 84, defaultValue: 70 }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 60, max: 300, defaultValue: 170 }',
    '{ name: "bootSize", label: "Boot Size (US)", type: "number", min: 5, max: 16, defaultValue: 10 }',
    '{ name: "style", label: "Riding Style", type: "select", options: [{ value: "1", label: "All-Mountain" }, { value: "2", label: "Freestyle / Park" }, { value: "3", label: "Freeride / Powder" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const height = inputs.height as number;
    const weight = inputs.weight as number;
    const bootSize = inputs.bootSize as number;
    const style = parseInt(inputs.style as string);
    const heightCm = height * 2.54;
    var boardCm = Math.round(heightCm * 0.88);
    if (weight < 130) boardCm -= 3;
    else if (weight > 200) boardCm += 3;
    if (style === 2) boardCm -= 3;
    else if (style === 3) boardCm += 3;
    const needWide = bootSize >= 11;
    const waistWidth = needWide ? "26+ cm (Wide)" : bootSize >= 9 ? "25-26 cm (Standard)" : "24-25 cm (Narrow)";
    const boardFt = Math.round(boardCm / 30.48 * 10) / 10;
    return {
      primary: { label: "Recommended Board Length", value: formatNumber(boardCm) + " cm" },
      details: [
        { label: "Length in Feet", value: formatNumber(boardFt) + " ft" },
        { label: "Waist Width", value: waistWidth },
        { label: "Wide Board Needed", value: needWide ? "Yes" : "No" }
      ]
    };
  }`,
  [
    { q: "How do I choose snowboard size?", a: "General rule is your board should reach between your chin and nose when stood on end. Weight and riding style also matter." },
    { q: "When do I need a wide snowboard?", a: "If your boot size is 11 or larger, you likely need a wide board to prevent toe and heel drag." },
    { q: "Does riding style affect board length?", a: "Freestyle riders typically go 2 to 4 cm shorter for maneuverability, while freeride and powder riders go longer for float." }
  ],
  "Board Length (cm) = Height (cm) x 0.88 + Weight Adj + Style Adj",
  ["ski-boot-size-calculator", "surfboard-volume-calculator"]
);

add(
  "skateboard-truck-width-calculator",
  "Skateboard Truck Width Calculator",
  "Match skateboard truck width to your deck size for optimal performance.",
  "Everyday",
  "everyday",
  "~",
  ["skateboard truck width", "truck size", "skateboard setup", "truck axle width"],
  [
    '{ name: "deckWidth", label: "Deck Width (inches)", type: "number", min: 7, max: 10, defaultValue: 8 }',
    '{ name: "style", label: "Skating Style", type: "select", options: [{ value: "1", label: "Street" }, { value: "2", label: "Park / Transition" }, { value: "3", label: "Cruising / Commute" }], defaultValue: "1" }',
    '{ name: "wheelSize", label: "Wheel Diameter (mm)", type: "number", min: 48, max: 70, defaultValue: 54 }'
  ],
  `(inputs) => {
    const deckWidth = inputs.deckWidth as number;
    const style = parseInt(inputs.style as string);
    const wheelSize = inputs.wheelSize as number;
    var truckWidth = Math.round(deckWidth * 25.4);
    const truckInch = deckWidth;
    var risers = "None needed";
    if (wheelSize >= 56) risers = '1/8" riser pads';
    if (wheelSize >= 60) risers = '1/4" riser pads';
    const hardness = style === 1 ? "Medium (90-94a)" : style === 2 ? "Medium-Hard (94-97a)" : "Soft (78-87a)";
    const bushings = style === 1 ? "Medium (90a)" : style === 2 ? "Medium-Hard (94a)" : "Soft (85a)";
    return {
      primary: { label: "Truck Axle Width", value: formatNumber(truckWidth) + " mm (" + formatNumber(Math.round(truckInch * 10) / 10) + '"' + ")" },
      details: [
        { label: "Risers", value: risers },
        { label: "Recommended Wheel Hardness", value: hardness },
        { label: "Bushing Hardness", value: bushings }
      ]
    };
  }`,
  [
    { q: "How wide should skateboard trucks be?", a: "Truck axle width should match your deck width within about a quarter inch. An 8 inch deck needs trucks around 8 inches wide." },
    { q: "Do I need riser pads?", a: "Riser pads prevent wheel bite. Use them with wheels larger than 56mm or if you ride loose trucks." },
    { q: "What size wheels for street skating?", a: "Street skating typically uses 50 to 54mm wheels. Larger wheels are better for cruising and rough terrain." }
  ],
  "Truck Width = Deck Width (matched); Risers determined by wheel size",
  ["snowboard-size-calculator", "bicycle-gear-ratio-calculator"]
);

add(
  "lacrosse-stick-length-calculator",
  "Lacrosse Stick Length Calculator",
  "Determine optimal lacrosse stick length based on position, age, and league rules.",
  "Everyday",
  "everyday",
  "~",
  ["lacrosse stick length", "lacrosse shaft size", "lacrosse equipment", "crosse length"],
  [
    '{ name: "position", label: "Position", type: "select", options: [{ value: "1", label: "Attack" }, { value: "2", label: "Midfield" }, { value: "3", label: "Defense" }, { value: "4", label: "Goalie" }], defaultValue: "2" }',
    '{ name: "age", label: "Player Age", type: "number", min: 6, max: 40, defaultValue: 16 }',
    '{ name: "height", label: "Player Height (inches)", type: "number", min: 36, max: 84, defaultValue: 68 }',
    '{ name: "gender", label: "League", type: "select", options: [{ value: "1", label: "Men/Boys" }, { value: "2", label: "Women/Girls" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const position = parseInt(inputs.position as string);
    const age = inputs.age as number;
    const height = inputs.height as number;
    const gender = parseInt(inputs.gender as string);
    var minLength = 0;
    var maxLength = 0;
    if (gender === 1) {
      if (position <= 2) { minLength = 40; maxLength = 42; }
      else if (position === 3) { minLength = 52; maxLength = 72; }
      else { minLength = 40; maxLength = 72; }
    } else {
      if (position <= 2) { minLength = 35.5; maxLength = 43.25; }
      else if (position === 3) { minLength = 35.5; maxLength = 43.25; }
      else { minLength = 35.5; maxLength = 52; }
    }
    if (age < 10) { minLength = Math.min(minLength, 36); maxLength = Math.min(maxLength, 42); }
    var recommended = Math.round((minLength + maxLength) / 2);
    if (height < 60) recommended = Math.round(minLength + (maxLength - minLength) * 0.25);
    const headWidth = gender === 1 ? (position === 4 ? "10-12 in" : "6-10 in") : "7-9 in";
    return {
      primary: { label: "Recommended Total Length", value: formatNumber(recommended) + " inches" },
      details: [
        { label: "Legal Range", value: formatNumber(minLength) + " - " + formatNumber(maxLength) + " inches" },
        { label: "Head Width", value: headWidth },
        { label: "Position", value: position === 1 ? "Attack" : position === 2 ? "Midfield" : position === 3 ? "Defense" : "Goalie" }
      ]
    };
  }`,
  [
    { q: "How long should my lacrosse stick be?", a: "Attack and midfield sticks are 40 to 42 inches. Defensive sticks range from 52 to 72 inches in men's lacrosse." },
    { q: "Are women's lacrosse sticks different?", a: "Yes, women's sticks range from 35.5 to 43.25 inches for field players and have different pocket rules." },
    { q: "What stick length for a youth player?", a: "Youth players under 10 typically use sticks between 36 and 42 inches total." }
  ],
  "Stick Length = Position-based range per league rules, adjusted for age and height",
  ["hockey-stick-flex-calculator", "boxing-reach-advantage-calculator"]
);

add(
  "martial-arts-belt-progression-calculator",
  "Martial Arts Belt Progression Calculator",
  "Estimate time to reach your target belt rank based on training frequency and martial art discipline.",
  "Health",
  "health",
  "H",
  ["martial arts belt", "belt progression", "karate belt time", "belt rank"],
  [
    '{ name: "discipline", label: "Martial Art", type: "select", options: [{ value: "1", label: "Karate" }, { value: "2", label: "Taekwondo" }, { value: "3", label: "Brazilian Jiu-Jitsu" }, { value: "4", label: "Judo" }], defaultValue: "1" }',
    '{ name: "currentBelt", label: "Current Belt Level", type: "select", options: [{ value: "0", label: "White (Beginner)" }, { value: "1", label: "Yellow / Gray" }, { value: "2", label: "Orange / Green" }, { value: "3", label: "Blue / Purple" }, { value: "4", label: "Brown" }, { value: "5", label: "Black 1st Degree" }], defaultValue: "0" }',
    '{ name: "targetBelt", label: "Target Belt Level", type: "select", options: [{ value: "1", label: "Yellow / Gray" }, { value: "2", label: "Orange / Green" }, { value: "3", label: "Blue / Purple" }, { value: "4", label: "Brown" }, { value: "5", label: "Black 1st Degree" }], defaultValue: "5" }',
    '{ name: "sessionsPerWeek", label: "Training Sessions per Week", type: "number", min: 1, max: 7, defaultValue: 3 }'
  ],
  `(inputs) => {
    const discipline = parseInt(inputs.discipline as string);
    const currentBelt = parseInt(inputs.currentBelt as string);
    const targetBelt = parseInt(inputs.targetBelt as string);
    const sessions = inputs.sessionsPerWeek as number;
    const monthsPerLevel = discipline === 1 ? 6 : discipline === 2 ? 5 : discipline === 3 ? 18 : 8;
    const levelsToGo = Math.max(targetBelt - currentBelt, 0);
    const baseMonths = levelsToGo * monthsPerLevel;
    const frequencyFactor = sessions >= 5 ? 0.7 : sessions >= 3 ? 1 : sessions >= 2 ? 1.4 : 2;
    const adjustedMonths = Math.round(baseMonths * frequencyFactor);
    const years = Math.floor(adjustedMonths / 12);
    const months = adjustedMonths % 12;
    const totalSessions = adjustedMonths * sessions * 4;
    return {
      primary: { label: "Estimated Time", value: (years > 0 ? formatNumber(years) + " yr " : "") + formatNumber(months) + " mo" },
      details: [
        { label: "Levels to Advance", value: formatNumber(levelsToGo) },
        { label: "Total Training Sessions", value: formatNumber(totalSessions) },
        { label: "Training Frequency Factor", value: formatNumber(frequencyFactor) + "x" }
      ]
    };
  }`,
  [
    { q: "How long does it take to get a black belt?", a: "It varies by discipline. Karate and Taekwondo typically take 3 to 5 years. Brazilian Jiu-Jitsu averages 8 to 12 years." },
    { q: "Does training more often speed up progression?", a: "Yes, training 4 to 5 times per week can accelerate progression by 30 percent compared to twice weekly." },
    { q: "Are belt systems the same across martial arts?", a: "No, each art has its own belt system. BJJ has fewer belts but takes longer per belt. Karate and Taekwondo have more intermediate ranks." }
  ],
  "Time = (Levels x Months per Level) x Frequency Factor; varies by discipline",
  ["boxing-reach-advantage-calculator", "running-shoe-mileage-calculator"]
);

add(
  "rowing-stroke-rate-calculator",
  "Rowing Stroke Rate Calculator",
  "Calculate rowing metrics including stroke rate, split time, power output, and calories burned.",
  "Health",
  "health",
  "H",
  ["rowing stroke rate", "rowing pace", "rowing split", "erg calculator"],
  [
    '{ name: "distance", label: "Distance (meters)", type: "number", min: 100, max: 42195, defaultValue: 2000 }',
    '{ name: "minutes", label: "Time Minutes", type: "number", min: 0, max: 120, defaultValue: 7 }',
    '{ name: "seconds", label: "Time Seconds", type: "number", min: 0, max: 59, defaultValue: 30 }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 350, defaultValue: 175 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const minutes = inputs.minutes as number;
    const seconds = inputs.seconds as number;
    const weight = inputs.weight as number;
    const totalSeconds = minutes * 60 + seconds;
    const splitSeconds = (totalSeconds / distance) * 500;
    const splitMin = Math.floor(splitSeconds / 60);
    const splitSec = Math.round(splitSeconds % 60);
    const pace = distance / totalSeconds;
    const watts = 2.8 / Math.pow(splitSeconds / 500, 3) * 1000;
    const calPerHour = Math.round((watts * 4 + 0.35 * weight * 0.453592) * 0.86);
    const totalCal = Math.round(calPerHour * (totalSeconds / 3600));
    const strokeRate = Math.round(distance / (totalSeconds / 60) / 10);
    return {
      primary: { label: "500m Split", value: formatNumber(splitMin) + ":" + (splitSec < 10 ? "0" : "") + formatNumber(splitSec) },
      details: [
        { label: "Estimated Watts", value: formatNumber(Math.round(watts)) },
        { label: "Estimated Stroke Rate", value: formatNumber(strokeRate) + " spm" },
        { label: "Calories Burned", value: formatNumber(totalCal) + " cal" }
      ]
    };
  }`,
  [
    { q: "What is a good 2K rowing time?", a: "For men, sub-7:00 is competitive and sub-6:20 is elite. For women, sub-8:00 is competitive and sub-7:10 is elite." },
    { q: "What stroke rate should I row at?", a: "Steady-state rows are typically 18 to 22 strokes per minute. Race pace is 28 to 36 strokes per minute." },
    { q: "How many calories does rowing burn?", a: "Rowing burns approximately 400 to 800 calories per hour depending on intensity and body weight." }
  ],
  "Split = (Total Time / Distance) x 500; Watts = 2.8 / (Split/500)^3 x 1000",
  ["swim-pace-calculator", "triathlon-transition-time-calculator"]
);

add(
  "triathlon-transition-time-calculator",
  "Triathlon Transition Time Calculator",
  "Estimate triathlon total time including swim, bike, run legs and T1/T2 transition times.",
  "Health",
  "health",
  "H",
  ["triathlon time", "triathlon transition", "T1 T2 time", "triathlon calculator"],
  [
    '{ name: "raceType", label: "Race Distance", type: "select", options: [{ value: "1", label: "Sprint (750m/20K/5K)" }, { value: "2", label: "Olympic (1.5K/40K/10K)" }, { value: "3", label: "Half Ironman (1.9K/90K/21.1K)" }, { value: "4", label: "Ironman (3.8K/180K/42.2K)" }], defaultValue: "2" }',
    '{ name: "swimPace", label: "Swim Pace (min per 100m)", type: "number", min: 1, max: 5, defaultValue: 2 }',
    '{ name: "bikePace", label: "Bike Speed (mph)", type: "number", min: 8, max: 30, defaultValue: 18 }',
    '{ name: "runPace", label: "Run Pace (min per mile)", type: "number", min: 5, max: 16, defaultValue: 9 }'
  ],
  `(inputs) => {
    const raceType = parseInt(inputs.raceType as string);
    const swimPace = inputs.swimPace as number;
    const bikePace = inputs.bikePace as number;
    const runPace = inputs.runPace as number;
    const races = [[750, 20, 5], [1500, 40, 10], [1900, 90, 21.1], [3800, 180, 42.2]];
    const race = races[raceType - 1];
    const swimMin = (race[0] / 100) * swimPace;
    const bikeMin = (race[1] / 1.60934) / bikePace * 60;
    const runMin = (race[2] / 1.60934) * runPace;
    const t1 = raceType <= 2 ? 3 : 5;
    const t2 = raceType <= 2 ? 2 : 4;
    const totalMin = swimMin + t1 + bikeMin + t2 + runMin;
    const hours = Math.floor(totalMin / 60);
    const mins = Math.round(totalMin % 60);
    return {
      primary: { label: "Estimated Total Time", value: formatNumber(hours) + "h " + formatNumber(mins) + "m" },
      details: [
        { label: "Swim Time", value: formatNumber(Math.round(swimMin)) + " min" },
        { label: "Bike Time", value: formatNumber(Math.round(bikeMin)) + " min" },
        { label: "Run Time", value: formatNumber(Math.round(runMin)) + " min" },
        { label: "T1 + T2 Transitions", value: formatNumber(t1 + t2) + " min" }
      ]
    };
  }`,
  [
    { q: "What are T1 and T2 in triathlon?", a: "T1 is the transition from swim to bike. T2 is the transition from bike to run. Together they can add 5 to 15 minutes." },
    { q: "What is a good Olympic triathlon time?", a: "For age-group athletes, 2:30 to 3:00 is solid. Competitive amateurs finish in 2:00 to 2:30. Elites are under 2:00." },
    { q: "How do I reduce transition time?", a: "Practice transitions, use elastic laces, lay out gear logically, and consider a race belt for your bib number." }
  ],
  "Total = Swim Time + T1 + Bike Time + T2 + Run Time",
  ["swim-pace-calculator", "rowing-stroke-rate-calculator"]
);

add(
  "sports-drink-hydration-calculator",
  "Sports Drink Hydration Calculator",
  "Calculate fluid, electrolyte, and carbohydrate needs during exercise based on activity and conditions.",
  "Health",
  "health",
  "H",
  ["sports drink", "exercise hydration", "electrolyte needs", "fluid replacement"],
  [
    '{ name: "duration", label: "Exercise Duration (minutes)", type: "number", min: 15, max: 600, defaultValue: 90 }',
    '{ name: "intensity", label: "Exercise Intensity", type: "select", options: [{ value: "1", label: "Low (walking, yoga)" }, { value: "2", label: "Moderate (jogging, cycling)" }, { value: "3", label: "High (racing, HIIT)" }], defaultValue: "2" }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 350, defaultValue: 160 }',
    '{ name: "temp", label: "Temperature", type: "select", options: [{ value: "1", label: "Cool (under 60F)" }, { value: "1.3", label: "Moderate (60-80F)" }, { value: "1.6", label: "Hot (over 80F)" }], defaultValue: "1.3" }'
  ],
  `(inputs) => {
    const duration = inputs.duration as number;
    const intensity = parseInt(inputs.intensity as string);
    const weight = inputs.weight as number;
    const temp = parseFloat(inputs.temp as string);
    const baseSweatRate = intensity === 1 ? 16 : intensity === 2 ? 28 : 40;
    const sweatOzPerHour = Math.round(baseSweatRate * (weight / 150) * temp);
    const totalFluidOz = Math.round(sweatOzPerHour * (duration / 60));
    const sodiumMg = Math.round(sweatOzPerHour * 30 * (duration / 60));
    const carbGrams = duration > 60 ? Math.round(duration / 60 * 40) : 0;
    const drinkServings = Math.ceil(totalFluidOz / 8);
    return {
      primary: { label: "Fluid Needed", value: formatNumber(totalFluidOz) + " oz" },
      details: [
        { label: "Sweat Rate", value: formatNumber(sweatOzPerHour) + " oz/hr" },
        { label: "Sodium Needed", value: formatNumber(sodiumMg) + " mg" },
        { label: "Carbs Needed", value: formatNumber(carbGrams) + " g" },
        { label: "Drink Servings (8oz)", value: formatNumber(drinkServings) }
      ]
    };
  }`,
  [
    { q: "How much should I drink during exercise?", a: "General guidelines suggest 4 to 8 ounces every 15 to 20 minutes during exercise. Individual needs vary with sweat rate." },
    { q: "Do I need a sports drink for short workouts?", a: "For exercise under 60 minutes, water is usually sufficient. Sports drinks help during longer or intense sessions." },
    { q: "How much sodium do I lose in sweat?", a: "Average sweat contains 800 to 1500 mg of sodium per liter. Heavy sweaters may lose even more." }
  ],
  "Fluid (oz) = Sweat Rate x Weight Factor x Temp Factor x Duration; Sodium = Sweat Rate x 30mg/oz",
  ["swim-pace-calculator", "running-shoe-mileage-calculator"]
);

add(
  "athletic-tape-usage-calculator",
  "Athletic Tape Usage Calculator",
  "Calculate the amount of athletic tape needed for common sports taping applications.",
  "Health",
  "health",
  "H",
  ["athletic tape", "sports tape", "kinesiology tape", "taping guide"],
  [
    '{ name: "application", label: "Taping Application", type: "select", options: [{ value: "1", label: "Ankle Stabilization" }, { value: "2", label: "Knee Support" }, { value: "3", label: "Wrist Support" }, { value: "4", label: "Shoulder / Rotator Cuff" }, { value: "5", label: "Shin Splints" }], defaultValue: "1" }',
    '{ name: "tapeType", label: "Tape Type", type: "select", options: [{ value: "1", label: "Athletic (1.5in rigid)" }, { value: "2", label: "Kinesiology (2in elastic)" }, { value: "3", label: "Elastic Bandage (3in)" }], defaultValue: "1" }',
    '{ name: "joints", label: "Number of Joints to Tape", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "sessions", label: "Sessions per Week", type: "number", min: 1, max: 14, defaultValue: 5 }'
  ],
  `(inputs) => {
    const application = parseInt(inputs.application as string);
    const tapeType = parseInt(inputs.tapeType as string);
    const joints = inputs.joints as number;
    const sessions = inputs.sessions as number;
    const inchesPerApp = application === 1 ? 120 : application === 2 ? 96 : application === 3 ? 60 : application === 4 ? 80 : 72;
    const tapeWidthFactor = tapeType === 1 ? 1 : tapeType === 2 ? 0.8 : 0.6;
    const inchesPerSession = Math.round(inchesPerApp * tapeWidthFactor * joints);
    const inchesPerWeek = inchesPerSession * sessions;
    const rollLength = tapeType === 1 ? 360 : tapeType === 2 ? 240 : 180;
    const rollsPerWeek = Math.ceil(inchesPerWeek / rollLength * 10) / 10;
    const rollsPerMonth = Math.ceil(rollsPerWeek * 4.33);
    const costPerRoll = tapeType === 1 ? 4 : tapeType === 2 ? 12 : 3;
    const monthlyCost = Math.round(rollsPerMonth * costPerRoll);
    return {
      primary: { label: "Tape per Session", value: formatNumber(Math.round(inchesPerSession / 12)) + " ft (" + formatNumber(inchesPerSession) + " in)" },
      details: [
        { label: "Weekly Usage", value: formatNumber(Math.round(inchesPerWeek / 12)) + " ft" },
        { label: "Rolls per Month", value: formatNumber(rollsPerMonth) },
        { label: "Monthly Cost", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  }`,
  [
    { q: "How much tape do I need for an ankle?", a: "A standard ankle taping uses about 8 to 12 feet of 1.5 inch rigid athletic tape including anchors and stirrups." },
    { q: "What is the difference between athletic tape and kinesiology tape?", a: "Athletic tape is rigid and restricts movement for support. Kinesiology tape is elastic and allows movement while providing proprioceptive feedback." },
    { q: "Can I reuse athletic tape?", a: "No, athletic tape should not be reused. Kinesiology tape can stay on for 2 to 5 days if applied properly." }
  ],
  "Tape per Session = Base Inches x Width Factor x Joints; Rolls/Month = Weekly Usage / Roll Length x 4.33",
  ["sports-drink-hydration-calculator", "running-shoe-mileage-calculator"]
);
