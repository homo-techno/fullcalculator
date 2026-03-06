add(
  "reception-venue-cost-calculator",
  "Reception Venue Cost Calculator",
  "Estimate reception venue rental costs based on guest count, venue type, hours of rental, and seasonal pricing adjustments.",
  "Finance",
  "finance",
  "$",
  ["reception venue cost", "wedding venue rental", "venue pricing", "event space cost"],
  [
    '{ name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 150 }',
    '{ name: "venueType", label: "Venue Type", type: "select", options: [{ value: "1", label: "Community Hall" }, { value: "2", label: "Hotel Ballroom" }, { value: "3", label: "Garden/Estate" }, { value: "4", label: "Luxury Resort" }], defaultValue: "2" }',
    '{ name: "rentalHours", label: "Rental Hours", type: "number", min: 2, max: 16, defaultValue: 6 }',
    '{ name: "season", label: "Season", type: "select", options: [{ value: "1", label: "Off-Season (Nov-Mar)" }, { value: "1.3", label: "Peak Season (Jun-Oct)" }, { value: "1.15", label: "Shoulder Season (Apr-May)" }], defaultValue: "1.3" }'
  ],
  `(inputs) => {
    const guests = inputs.guestCount as number;
    const venueType = parseFloat(inputs.venueType as unknown as string);
    const hours = inputs.rentalHours as number;
    const seasonMult = parseFloat(inputs.season as unknown as string);
    const baseCosts = { 1: 1500, 2: 4000, 3: 5500, 4: 10000 } as Record<number, number>;
    const baseCost = baseCosts[venueType] || 4000;
    const perGuestFee = venueType * 15;
    const hourlyExtra = hours > 5 ? (hours - 5) * 500 : 0;
    const subtotal = baseCost + (guests * perGuestFee) + hourlyExtra;
    const total = subtotal * seasonMult;
    const perGuest = total / guests;
    return {
      primary: { label: "Estimated Venue Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Base Venue Fee", value: "$" + formatNumber(baseCost) },
        { label: "Guest Surcharge", value: "$" + formatNumber(Math.round(guests * perGuestFee)) },
        { label: "Extra Hours Fee", value: "$" + formatNumber(hourlyExtra) },
        { label: "Seasonal Adjustment", value: (seasonMult * 100 - 100).toFixed(0) + "% markup" },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  }`,
  [
    { q: "How much does a wedding reception venue cost?", a: "Reception venues typically range from $1,500 for a community hall to $15,000 or more for a luxury resort. The average is $5,000 to $10,000 depending on location and guest count." },
    { q: "Does season affect venue pricing?", a: "Yes. Peak wedding season (June through October) commands 20-40% higher prices. Off-season bookings can save thousands of dollars." },
    { q: "What is included in a venue rental fee?", a: "Venue fees usually include the space, tables, chairs, basic setup, and a certain number of hours. Catering, decor, and additional hours are often extra." }
  ],
  `Total = (BaseFee + GuestCount x PerGuestFee + ExtraHoursFee) x SeasonMultiplier
Per Guest = Total / GuestCount`,
  ["wedding-budget-calculator", "event-catering-calculator", "wedding-guest-calculator"]
);

add(
  "dj-vs-band-cost-calculator",
  "DJ vs Band Cost Calculator",
  "Compare the cost of hiring a DJ versus a live band for your wedding or event based on hours, size of band, and equipment needs.",
  "Finance",
  "finance",
  "$",
  ["DJ cost", "wedding band cost", "live music pricing", "wedding entertainment cost"],
  [
    '{ name: "eventHours", label: "Entertainment Hours", type: "number", min: 1, max: 10, defaultValue: 5 }',
    '{ name: "djHourlyRate", label: "DJ Hourly Rate ($)", type: "number", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "bandMembers", label: "Number of Band Members", type: "number", min: 2, max: 12, defaultValue: 5 }',
    '{ name: "bandMemberRate", label: "Band Member Hourly Rate ($)", type: "number", min: 50, max: 400, defaultValue: 125 }',
    '{ name: "soundSystemNeeded", label: "Sound System Rental", type: "select", options: [{ value: "0", label: "Included" }, { value: "500", label: "Basic ($500)" }, { value: "1200", label: "Premium ($1200)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const hours = inputs.eventHours as number;
    const djRate = inputs.djHourlyRate as number;
    const bandMembers = inputs.bandMembers as number;
    const bandRate = inputs.bandMemberRate as number;
    const soundCost = parseFloat(inputs.soundSystemNeeded as unknown as string);
    const djTotal = (hours * djRate) + soundCost;
    const bandTotal = (hours * bandRate * bandMembers) + soundCost;
    const savings = bandTotal - djTotal;
    return {
      primary: { label: "DJ Total Cost", value: "$" + formatNumber(Math.round(djTotal)) },
      details: [
        { label: "Band Total Cost", value: "$" + formatNumber(Math.round(bandTotal)) },
        { label: "Savings with DJ", value: "$" + formatNumber(Math.round(savings)) },
        { label: "DJ Hourly Cost", value: "$" + formatNumber(djRate) + "/hr" },
        { label: "Band Hourly Cost", value: "$" + formatNumber(bandRate * bandMembers) + "/hr" },
        { label: "Sound System Add-on", value: "$" + formatNumber(soundCost) }
      ]
    };
  }`,
  [
    { q: "Is a DJ cheaper than a band for a wedding?", a: "Yes, DJs typically cost $500 to $1,500 for a wedding, while a live band ranges from $2,000 to $10,000 or more depending on size and talent level." },
    { q: "How many hours of music do you need at a wedding?", a: "Most weddings need 4 to 5 hours of music: about 1 hour for cocktails and dinner, and 3 to 4 hours for dancing." },
    { q: "Can you have both a DJ and a band?", a: "Yes, some couples hire a band for the reception and a DJ for cocktail hour or late-night dancing, though this increases the total cost." }
  ],
  `DJ Total = (Hours x DJ Rate) + Sound System
Band Total = (Hours x Band Member Rate x Members) + Sound System
Savings = Band Total - DJ Total`,
  ["wedding-budget-calculator", "event-catering-calculator", "reception-venue-cost-calculator"]
);

add(
  "wedding-photographer-cost-calculator",
  "Wedding Photographer Cost Calculator",
  "Estimate wedding photography costs including coverage hours, second shooter, engagement session, prints, and album options.",
  "Finance",
  "finance",
  "$",
  ["wedding photographer cost", "wedding photography pricing", "photographer rates", "wedding photo package"],
  [
    '{ name: "coverageHours", label: "Coverage Hours", type: "number", min: 2, max: 14, defaultValue: 8 }',
    '{ name: "hourlyRate", label: "Photographer Hourly Rate ($)", type: "number", min: 50, max: 600, defaultValue: 200 }',
    '{ name: "secondShooter", label: "Second Shooter", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
    '{ name: "engagementSession", label: "Engagement Session", type: "select", options: [{ value: "0", label: "No" }, { value: "500", label: "Standard ($500)" }, { value: "1000", label: "Premium ($1000)" }], defaultValue: "500" }',
    '{ name: "albumCost", label: "Photo Album Cost ($)", type: "number", min: 0, max: 3000, defaultValue: 800 }'
  ],
  `(inputs) => {
    const hours = inputs.coverageHours as number;
    const rate = inputs.hourlyRate as number;
    const secondShooter = parseFloat(inputs.secondShooter as unknown as string);
    const engagement = parseFloat(inputs.engagementSession as unknown as string);
    const album = inputs.albumCost as number;
    const primaryCost = hours * rate;
    const secondCost = secondShooter === 1 ? hours * rate * 0.5 : 0;
    const total = primaryCost + secondCost + engagement + album;
    return {
      primary: { label: "Total Photography Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Primary Photographer", value: "$" + formatNumber(Math.round(primaryCost)) },
        { label: "Second Shooter", value: "$" + formatNumber(Math.round(secondCost)) },
        { label: "Engagement Session", value: "$" + formatNumber(engagement) },
        { label: "Album", value: "$" + formatNumber(album) },
        { label: "Effective Hourly Rate", value: "$" + formatNumber(Math.round(total / hours)) + "/hr" }
      ]
    };
  }`,
  [
    { q: "How much does a wedding photographer cost?", a: "Wedding photographers typically charge $2,000 to $5,000 for full-day coverage. Luxury photographers can charge $8,000 to $15,000 or more." },
    { q: "Do you need a second photographer at a wedding?", a: "A second shooter captures additional angles, candid moments, and the other partner getting ready simultaneously. It is recommended for weddings with 100+ guests." },
    { q: "How many photos do wedding photographers deliver?", a: "Most photographers deliver 50 to 100 edited photos per hour of coverage, so an 8-hour wedding typically yields 400 to 800 final images." }
  ],
  `Total = (Hours x Rate) + SecondShooterCost + EngagementSession + AlbumCost
Second Shooter = Hours x Rate x 0.5 (if selected)`,
  ["wedding-budget-calculator", "wedding-videography-cost-calculator", "reception-venue-cost-calculator"]
);

add(
  "bridesmaid-dress-budget-calculator",
  "Bridesmaid Dress Budget Calculator",
  "Calculate the total cost of bridesmaid dresses including alterations, accessories, and shoes for the entire bridal party.",
  "Finance",
  "finance",
  "$",
  ["bridesmaid dress cost", "bridal party budget", "bridesmaid outfit", "wedding party attire"],
  [
    '{ name: "bridesmaids", label: "Number of Bridesmaids", type: "number", min: 1, max: 15, defaultValue: 5 }',
    '{ name: "dressPrice", label: "Dress Price Per Person ($)", type: "number", min: 50, max: 1000, defaultValue: 180 }',
    '{ name: "alterationCost", label: "Alteration Cost Per Dress ($)", type: "number", min: 0, max: 500, defaultValue: 75 }',
    '{ name: "shoesCost", label: "Shoes Per Person ($)", type: "number", min: 0, max: 300, defaultValue: 65 }',
    '{ name: "accessoryCost", label: "Accessories Per Person ($)", type: "number", min: 0, max: 200, defaultValue: 40 }'
  ],
  `(inputs) => {
    const count = inputs.bridesmaids as number;
    const dress = inputs.dressPrice as number;
    const alteration = inputs.alterationCost as number;
    const shoes = inputs.shoesCost as number;
    const accessories = inputs.accessoryCost as number;
    const perPerson = dress + alteration + shoes + accessories;
    const totalDresses = count * dress;
    const totalAlterations = count * alteration;
    const totalShoes = count * shoes;
    const totalAccessories = count * accessories;
    const grandTotal = count * perPerson;
    return {
      primary: { label: "Total Bridal Party Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Cost Per Bridesmaid", value: "$" + formatNumber(Math.round(perPerson)) },
        { label: "All Dresses", value: "$" + formatNumber(totalDresses) },
        { label: "All Alterations", value: "$" + formatNumber(totalAlterations) },
        { label: "All Shoes", value: "$" + formatNumber(totalShoes) },
        { label: "All Accessories", value: "$" + formatNumber(totalAccessories) }
      ]
    };
  }`,
  [
    { q: "How much do bridesmaid dresses cost?", a: "Bridesmaid dresses typically range from $100 to $300 each. Designer options can cost $300 to $600 or more." },
    { q: "Who pays for bridesmaid dresses?", a: "Traditionally, bridesmaids pay for their own dresses and accessories. Some brides choose to cover these costs as a gift to their bridal party." },
    { q: "Do bridesmaid dresses need alterations?", a: "Most bridesmaid dresses need some alterations for proper fit. Common adjustments include hemming, taking in the waist, or adjusting straps, costing $50 to $150." }
  ],
  `Per Person = DressPrice + Alterations + Shoes + Accessories
Total = NumberOfBridesmaids x PerPersonCost`,
  ["wedding-budget-calculator", "groomsmen-cost-calculator", "wedding-dress-alteration-cost-calculator"]
);

add(
  "groomsmen-cost-calculator",
  "Groomsmen Cost Calculator",
  "Estimate the total cost for outfitting groomsmen including suit rental or purchase, shoes, accessories, and gifts.",
  "Finance",
  "finance",
  "$",
  ["groomsmen cost", "groomsmen suit rental", "wedding party men", "best man attire cost"],
  [
    '{ name: "groomsmen", label: "Number of Groomsmen", type: "number", min: 1, max: 15, defaultValue: 5 }',
    '{ name: "attireOption", label: "Attire Option", type: "select", options: [{ value: "1", label: "Suit Rental" }, { value: "2", label: "Suit Purchase" }, { value: "3", label: "Tuxedo Rental" }], defaultValue: "1" }',
    '{ name: "attireCost", label: "Attire Cost Per Person ($)", type: "number", min: 50, max: 1500, defaultValue: 200 }',
    '{ name: "shoesCost", label: "Shoes Per Person ($)", type: "number", min: 0, max: 400, defaultValue: 70 }',
    '{ name: "accessoryCost", label: "Accessories Per Person ($)", type: "number", min: 0, max: 200, defaultValue: 50 }',
    '{ name: "giftCost", label: "Gift Per Groomsman ($)", type: "number", min: 0, max: 300, defaultValue: 50 }'
  ],
  `(inputs) => {
    const count = inputs.groomsmen as number;
    const attire = inputs.attireCost as number;
    const shoes = inputs.shoesCost as number;
    const accessories = inputs.accessoryCost as number;
    const gift = inputs.giftCost as number;
    const perPerson = attire + shoes + accessories + gift;
    const totalAttire = count * attire;
    const totalGifts = count * gift;
    const grandTotal = count * perPerson;
    return {
      primary: { label: "Total Groomsmen Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Cost Per Groomsman", value: "$" + formatNumber(Math.round(perPerson)) },
        { label: "All Attire", value: "$" + formatNumber(totalAttire) },
        { label: "All Shoes", value: "$" + formatNumber(count * shoes) },
        { label: "All Accessories", value: "$" + formatNumber(count * accessories) },
        { label: "All Gifts", value: "$" + formatNumber(totalGifts) }
      ]
    };
  }`,
  [
    { q: "How much does a groomsman outfit cost?", a: "Suit rentals typically cost $150 to $250, while purchased suits range from $200 to $800. Tuxedo rentals average $175 to $300." },
    { q: "Who pays for groomsmen attire?", a: "Traditionally, groomsmen pay for their own attire. The groom may cover the cost as a gift or split expenses with the wedding party." },
    { q: "Should the groom give gifts to groomsmen?", a: "Yes, it is customary for the groom to give groomsmen a thank-you gift ranging from $25 to $100 per person." }
  ],
  `Per Groomsman = AttireCost + Shoes + Accessories + Gift
Total = NumberOfGroomsmen x PerPersonCost`,
  ["wedding-budget-calculator", "bridesmaid-dress-budget-calculator", "wedding-guest-calculator"]
);

add(
  "seating-chart-optimizer-calculator",
  "Seating Chart Optimizer Calculator",
  "Plan your event seating layout by calculating table counts, seats per table, head table size, and remaining capacity.",
  "Everyday",
  "everyday",
  "~",
  ["seating chart", "wedding seating plan", "table layout", "event seating optimizer"],
  [
    '{ name: "totalGuests", label: "Total Guests", type: "number", min: 10, max: 500, defaultValue: 120 }',
    '{ name: "tableType", label: "Table Type", type: "select", options: [{ value: "8", label: "Round (8 per table)" }, { value: "10", label: "Round (10 per table)" }, { value: "6", label: "Rectangular (6 per table)" }, { value: "12", label: "Long Banquet (12 per table)" }], defaultValue: "8" }',
    '{ name: "headTableSize", label: "Head Table Seats", type: "number", min: 0, max: 30, defaultValue: 10 }',
    '{ name: "kidsTable", label: "Separate Kids Table", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
    '{ name: "kidsCount", label: "Number of Kids (if separate)", type: "number", min: 0, max: 50, defaultValue: 8 }'
  ],
  `(inputs) => {
    const totalGuests = inputs.totalGuests as number;
    const seatsPerTable = parseInt(inputs.tableType as unknown as string);
    const headTable = inputs.headTableSize as number;
    const kidsTableFlag = parseInt(inputs.kidsTable as unknown as string);
    const kids = inputs.kidsCount as number;
    const kidsAtSeparate = kidsTableFlag === 1 ? kids : 0;
    const remainingGuests = totalGuests - headTable - kidsAtSeparate;
    const tablesNeeded = Math.ceil(remainingGuests / seatsPerTable);
    const totalSeats = headTable + kidsAtSeparate + (tablesNeeded * seatsPerTable);
    const emptySeats = totalSeats - totalGuests;
    const kidsTables = kidsTableFlag === 1 ? Math.ceil(kids / seatsPerTable) : 0;
    const totalTables = tablesNeeded + 1 + kidsTables;
    return {
      primary: { label: "Guest Tables Needed", value: formatNumber(tablesNeeded) },
      details: [
        { label: "Total Tables (incl. Head)", value: formatNumber(totalTables) },
        { label: "Seats Per Table", value: formatNumber(seatsPerTable) },
        { label: "Head Table Seats", value: formatNumber(headTable) },
        { label: "Kids Tables", value: formatNumber(kidsTables) },
        { label: "Empty Seats", value: formatNumber(emptySeats) }
      ]
    };
  }`,
  [
    { q: "How many tables do you need for 100 guests?", a: "For round tables seating 8, you need about 12-13 tables for 100 guests (accounting for a head table). For tables of 10, you need 10-11 tables." },
    { q: "What is the best table layout for a wedding?", a: "Round tables of 8-10 promote conversation. Long banquet tables create an intimate feel. The best layout depends on your venue shape and guest dynamics." },
    { q: "Should kids have a separate table?", a: "Separate kids tables work well for children aged 5-12. Younger children usually sit with parents, while teens can sit at regular guest tables." }
  ],
  `Remaining = TotalGuests - HeadTable - KidsAtSeparateTable
Tables Needed = ceil(Remaining / SeatsPerTable)
Empty Seats = TotalSeats - TotalGuests`,
  ["wedding-guest-calculator", "reception-venue-cost-calculator", "event-catering-calculator"]
);

add(
  "event-timeline-planner-calculator",
  "Event Timeline Planner Calculator",
  "Build a wedding or event timeline by allocating hours for ceremony, cocktails, dinner, dancing, and other activities.",
  "Everyday",
  "everyday",
  "~",
  ["event timeline", "wedding schedule", "reception timeline", "event planning hours"],
  [
    '{ name: "ceremonyMinutes", label: "Ceremony Duration (min)", type: "number", min: 10, max: 120, defaultValue: 30 }',
    '{ name: "cocktailMinutes", label: "Cocktail Hour (min)", type: "number", min: 0, max: 120, defaultValue: 60 }',
    '{ name: "dinnerMinutes", label: "Dinner Duration (min)", type: "number", min: 30, max: 180, defaultValue: 90 }',
    '{ name: "dancingMinutes", label: "Dancing/Party (min)", type: "number", min: 30, max: 300, defaultValue: 180 }',
    '{ name: "photosMinutes", label: "Photo Session (min)", type: "number", min: 0, max: 120, defaultValue: 45 }',
    '{ name: "bufferMinutes", label: "Buffer/Transition Time (min)", type: "number", min: 0, max: 60, defaultValue: 30 }'
  ],
  `(inputs) => {
    const ceremony = inputs.ceremonyMinutes as number;
    const cocktail = inputs.cocktailMinutes as number;
    const dinner = inputs.dinnerMinutes as number;
    const dancing = inputs.dancingMinutes as number;
    const photos = inputs.photosMinutes as number;
    const buffer = inputs.bufferMinutes as number;
    const totalMinutes = ceremony + cocktail + dinner + dancing + photos + buffer;
    const totalHours = totalMinutes / 60;
    return {
      primary: { label: "Total Event Duration", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Total Minutes", value: formatNumber(totalMinutes) + " min" },
        { label: "Ceremony", value: formatNumber(ceremony) + " min" },
        { label: "Cocktail Hour", value: formatNumber(cocktail) + " min" },
        { label: "Dinner", value: formatNumber(dinner) + " min" },
        { label: "Dancing/Party", value: formatNumber(dancing) + " min" },
        { label: "Photos + Buffer", value: formatNumber(photos + buffer) + " min" }
      ]
    };
  }`,
  [
    { q: "How long should a wedding reception be?", a: "Most wedding receptions last 4 to 5 hours. This includes a cocktail hour, dinner service, toasts, and 2-3 hours of dancing." },
    { q: "What is a typical wedding day timeline?", a: "A typical timeline is: getting ready (3-4 hours), ceremony (30 minutes), photos (45 minutes), cocktail hour (1 hour), dinner (1.5 hours), and dancing (3 hours)." },
    { q: "How much buffer time should you plan?", a: "Allow 15-30 minutes of buffer between major events. Transitions always take longer than expected, especially with large guest counts." }
  ],
  `Total Duration (hours) = (Ceremony + Cocktail + Dinner + Dancing + Photos + Buffer) / 60`,
  ["reception-venue-cost-calculator", "wedding-budget-calculator", "seating-chart-optimizer-calculator"]
);

add(
  "birthday-milestone-cost-calculator",
  "Birthday Milestone Cost Calculator",
  "Estimate costs for a milestone birthday celebration including venue, catering, decorations, entertainment, and a special cake.",
  "Finance",
  "finance",
  "$",
  ["milestone birthday cost", "birthday party budget", "special birthday planning", "birthday celebration cost"],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", min: 5, max: 200, defaultValue: 40 }',
    '{ name: "venueRental", label: "Venue Rental ($)", type: "number", min: 0, max: 10000, defaultValue: 1000 }',
    '{ name: "foodPerPerson", label: "Food Cost Per Person ($)", type: "number", min: 10, max: 200, defaultValue: 45 }',
    '{ name: "drinkPerPerson", label: "Drink Cost Per Person ($)", type: "number", min: 0, max: 80, defaultValue: 20 }',
    '{ name: "decorations", label: "Decorations Budget ($)", type: "number", min: 0, max: 5000, defaultValue: 300 }',
    '{ name: "entertainment", label: "Entertainment Cost ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }',
    '{ name: "cakeCost", label: "Custom Cake Cost ($)", type: "number", min: 0, max: 2000, defaultValue: 200 }'
  ],
  `(inputs) => {
    const guests = inputs.guests as number;
    const venue = inputs.venueRental as number;
    const food = inputs.foodPerPerson as number;
    const drink = inputs.drinkPerPerson as number;
    const decor = inputs.decorations as number;
    const entertainment = inputs.entertainment as number;
    const cake = inputs.cakeCost as number;
    const cateringTotal = guests * (food + drink);
    const total = venue + cateringTotal + decor + entertainment + cake;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Party Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Venue Rental", value: "$" + formatNumber(venue) },
        { label: "Total Catering", value: "$" + formatNumber(Math.round(cateringTotal)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Entertainment", value: "$" + formatNumber(entertainment) },
        { label: "Cake", value: "$" + formatNumber(cake) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  }`,
  [
    { q: "How much does a milestone birthday party cost?", a: "Milestone birthday parties (30th, 40th, 50th) typically cost $1,000 to $5,000 for 30-50 guests. Elaborate celebrations can exceed $10,000." },
    { q: "What makes a good milestone birthday party?", a: "Great milestone parties include personalized decor, quality catering, entertainment, a custom cake, and thoughtful touches like photo displays or memory books." },
    { q: "How many guests should you invite to a birthday party?", a: "Adult birthday parties typically have 20-50 guests. Milestone birthdays may have more, up to 100, depending on venue and budget." }
  ],
  `Catering = Guests x (FoodPerPerson + DrinkPerPerson)
Total = Venue + Catering + Decorations + Entertainment + Cake
Per Guest = Total / Guests`,
  ["wedding-budget-calculator", "event-catering-calculator", "party-balloon-calculator"]
);

add(
  "anniversary-gift-budget-calculator",
  "Anniversary Gift Budget Calculator",
  "Plan anniversary celebration spending including a traditional or modern gift, dinner, flowers, and a special experience.",
  "Finance",
  "finance",
  "$",
  ["anniversary gift budget", "anniversary celebration cost", "anniversary planning", "wedding anniversary gift"],
  [
    '{ name: "giftBudget", label: "Gift Budget ($)", type: "number", min: 10, max: 10000, defaultValue: 200 }',
    '{ name: "dinnerBudget", label: "Dinner Budget ($)", type: "number", min: 0, max: 2000, defaultValue: 150 }',
    '{ name: "flowersBudget", label: "Flowers Budget ($)", type: "number", min: 0, max: 500, defaultValue: 75 }',
    '{ name: "experienceBudget", label: "Experience/Activity ($)", type: "number", min: 0, max: 5000, defaultValue: 100 }',
    '{ name: "cardAndExtras", label: "Card and Extras ($)", type: "number", min: 0, max: 200, defaultValue: 25 }'
  ],
  `(inputs) => {
    const gift = inputs.giftBudget as number;
    const dinner = inputs.dinnerBudget as number;
    const flowers = inputs.flowersBudget as number;
    const experience = inputs.experienceBudget as number;
    const extras = inputs.cardAndExtras as number;
    const total = gift + dinner + flowers + experience + extras;
    const giftPct = total > 0 ? (gift / total) * 100 : 0;
    return {
      primary: { label: "Total Anniversary Budget", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Gift", value: "$" + formatNumber(gift) },
        { label: "Dinner", value: "$" + formatNumber(dinner) },
        { label: "Flowers", value: "$" + formatNumber(flowers) },
        { label: "Experience/Activity", value: "$" + formatNumber(experience) },
        { label: "Card and Extras", value: "$" + formatNumber(extras) },
        { label: "Gift as % of Total", value: formatNumber(Math.round(giftPct)) + "%" }
      ]
    };
  }`,
  [
    { q: "How much should you spend on an anniversary gift?", a: "There is no fixed rule, but common ranges are $50-$150 for early anniversaries and $200-$500 or more for milestone years like 10th, 25th, or 50th." },
    { q: "What are the traditional anniversary gift themes?", a: "Traditional themes include paper (1st), cotton (2nd), leather (3rd), wood (5th), tin (10th), silver (25th), and gold (50th). Modern alternatives also exist for each year." },
    { q: "Is an experience better than a physical gift?", a: "Experiences like trips, cooking classes, or spa days create lasting memories and are increasingly popular as anniversary gifts, especially for couples who prefer minimal material possessions." }
  ],
  `Total = Gift + Dinner + Flowers + Experience + Extras
Gift Percentage = (Gift / Total) x 100`,
  ["birthday-milestone-cost-calculator", "wedding-budget-calculator", "honeymoon-budget-planner-calculator"]
);

add(
  "rehearsal-dinner-cost-calculator",
  "Rehearsal Dinner Cost Calculator",
  "Estimate rehearsal dinner costs based on guest count, venue style, menu selection, drinks, and additional touches.",
  "Finance",
  "finance",
  "$",
  ["rehearsal dinner cost", "rehearsal dinner budget", "wedding rehearsal", "pre-wedding dinner"],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", min: 5, max: 100, defaultValue: 30 }',
    '{ name: "venueStyle", label: "Venue Style", type: "select", options: [{ value: "30", label: "Casual Restaurant" }, { value: "55", label: "Upscale Restaurant" }, { value: "80", label: "Private Dining Room" }, { value: "120", label: "Private Event Space" }], defaultValue: "55" }',
    '{ name: "drinksPerPerson", label: "Drinks Per Person ($)", type: "number", min: 0, max: 100, defaultValue: 25 }',
    '{ name: "decorations", label: "Decorations ($)", type: "number", min: 0, max: 2000, defaultValue: 200 }',
    '{ name: "gratuity", label: "Gratuity (%)", type: "number", min: 0, max: 30, defaultValue: 20 }'
  ],
  `(inputs) => {
    const guests = inputs.guests as number;
    const foodPerPerson = parseFloat(inputs.venueStyle as unknown as string);
    const drinks = inputs.drinksPerPerson as number;
    const decor = inputs.decorations as number;
    const gratPct = inputs.gratuity as number;
    const foodTotal = guests * foodPerPerson;
    const drinkTotal = guests * drinks;
    const subtotal = foodTotal + drinkTotal + decor;
    const gratuity = (foodTotal + drinkTotal) * (gratPct / 100);
    const total = subtotal + gratuity;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Rehearsal Dinner Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Food Cost", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Drinks Cost", value: "$" + formatNumber(Math.round(drinkTotal)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Gratuity", value: "$" + formatNumber(Math.round(gratuity)) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  }`,
  [
    { q: "How much does a rehearsal dinner cost?", a: "Rehearsal dinners typically cost $1,000 to $5,000 for 20-40 guests. The average is about $75 to $100 per person including food, drinks, and gratuity." },
    { q: "Who is invited to the rehearsal dinner?", a: "Traditionally, the wedding party, immediate family, officiant, and their partners attend. Some couples extend invitations to out-of-town guests." },
    { q: "Who pays for the rehearsal dinner?", a: "Traditionally, the groom's family hosts and pays for the rehearsal dinner. Modern couples may split costs or have either family cover it." }
  ],
  `Subtotal = (Guests x FoodPerPerson) + (Guests x DrinksPerPerson) + Decorations
Gratuity = (Food + Drinks) x GratuityRate
Total = Subtotal + Gratuity`,
  ["wedding-budget-calculator", "event-catering-calculator", "reception-venue-cost-calculator"]
);

add(
  "honeymoon-budget-planner-calculator",
  "Honeymoon Budget Planner Calculator",
  "Plan and estimate your honeymoon budget including flights, accommodation, meals, activities, and spending money.",
  "Finance",
  "finance",
  "$",
  ["honeymoon budget", "honeymoon cost", "honeymoon planning", "travel budget wedding"],
  [
    '{ name: "nights", label: "Number of Nights", type: "number", min: 1, max: 30, defaultValue: 7 }',
    '{ name: "flightCost", label: "Flights (both people, $)", type: "number", min: 0, max: 10000, defaultValue: 1500 }',
    '{ name: "hotelPerNight", label: "Hotel Per Night ($)", type: "number", min: 50, max: 2000, defaultValue: 250 }',
    '{ name: "mealsPerDay", label: "Meals Per Day (both, $)", type: "number", min: 20, max: 500, defaultValue: 120 }',
    '{ name: "activitiesPerDay", label: "Activities Per Day ($)", type: "number", min: 0, max: 500, defaultValue: 80 }',
    '{ name: "spendingMoney", label: "Shopping/Souvenirs ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const nights = inputs.nights as number;
    const flights = inputs.flightCost as number;
    const hotel = inputs.hotelPerNight as number;
    const meals = inputs.mealsPerDay as number;
    const activities = inputs.activitiesPerDay as number;
    const shopping = inputs.spendingMoney as number;
    const totalHotel = nights * hotel;
    const totalMeals = nights * meals;
    const totalActivities = nights * activities;
    const total = flights + totalHotel + totalMeals + totalActivities + shopping;
    const perDay = total / nights;
    return {
      primary: { label: "Total Honeymoon Budget", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Flights", value: "$" + formatNumber(flights) },
        { label: "Accommodation", value: "$" + formatNumber(Math.round(totalHotel)) },
        { label: "Meals", value: "$" + formatNumber(Math.round(totalMeals)) },
        { label: "Activities", value: "$" + formatNumber(Math.round(totalActivities)) },
        { label: "Shopping/Souvenirs", value: "$" + formatNumber(shopping) },
        { label: "Average Per Day", value: "$" + formatNumber(Math.round(perDay)) }
      ]
    };
  }`,
  [
    { q: "How much does the average honeymoon cost?", a: "The average honeymoon costs $4,000 to $5,000 for a domestic trip and $5,000 to $10,000 for an international destination. Luxury honeymoons can exceed $15,000." },
    { q: "How long should a honeymoon be?", a: "Most honeymoons last 7 to 10 days. Some couples opt for a mini-moon of 3-4 days after the wedding and take a longer trip later." },
    { q: "When should you book your honeymoon?", a: "Book flights and hotels 6-9 months in advance for the best rates. Popular destinations during peak season should be booked even earlier." }
  ],
  `Total = Flights + (Nights x HotelPerNight) + (Nights x MealsPerDay) + (Nights x ActivitiesPerDay) + Shopping
Average Per Day = Total / Nights`,
  ["wedding-budget-calculator", "destination-wedding-savings-calculator", "anniversary-gift-budget-calculator"]
);

add(
  "wedding-registry-value-calculator",
  "Wedding Registry Value Calculator",
  "Calculate the ideal wedding registry value by estimating guest gift contributions and building a balanced registry across price ranges.",
  "Finance",
  "finance",
  "$",
  ["wedding registry", "gift registry value", "wedding gift list", "registry planning"],
  [
    '{ name: "totalGuests", label: "Total Invited Guests", type: "number", min: 10, max: 500, defaultValue: 150 }',
    '{ name: "expectedAttendance", label: "Expected Attendance (%)", type: "number", min: 30, max: 100, defaultValue: 80 }',
    '{ name: "avgGiftValue", label: "Average Gift Value ($)", type: "number", min: 25, max: 500, defaultValue: 100 }',
    '{ name: "coupleGifts", label: "% of Couples Giving One Gift", type: "number", min: 0, max: 100, defaultValue: 60 }',
    '{ name: "registryMarkup", label: "Registry Value Multiplier", type: "number", min: 1, max: 3, defaultValue: 1.5 }'
  ],
  `(inputs) => {
    const guests = inputs.totalGuests as number;
    const attendance = inputs.expectedAttendance as number / 100;
    const avgGift = inputs.avgGiftValue as number;
    const couplesPct = inputs.coupleGifts as number / 100;
    const multiplier = inputs.registryMarkup as number;
    const attendingGuests = Math.round(guests * attendance);
    const soloGivers = Math.round(attendingGuests * (1 - couplesPct));
    const coupleGivers = Math.round(attendingGuests * couplesPct / 2);
    const totalGivers = soloGivers + coupleGivers;
    const expectedGiftTotal = totalGivers * avgGift;
    const registryValue = expectedGiftTotal * multiplier;
    const lowRange = Math.round(registryValue * 0.3);
    const midRange = Math.round(registryValue * 0.45);
    const highRange = Math.round(registryValue * 0.25);
    return {
      primary: { label: "Recommended Registry Value", value: "$" + formatNumber(Math.round(registryValue)) },
      details: [
        { label: "Expected Gift Total", value: "$" + formatNumber(Math.round(expectedGiftTotal)) },
        { label: "Estimated Gift-Givers", value: formatNumber(totalGivers) },
        { label: "Budget Items (under $50)", value: "$" + formatNumber(lowRange) + " worth" },
        { label: "Mid-Range ($50-$150)", value: "$" + formatNumber(midRange) + " worth" },
        { label: "Premium ($150+)", value: "$" + formatNumber(highRange) + " worth" }
      ]
    };
  }`,
  [
    { q: "How much should a wedding registry be worth?", a: "A good rule is to register for 1.5 to 2 times the expected total gift amount. This gives guests plenty of options across price points." },
    { q: "How many items should be on a wedding registry?", a: "Register for at least as many items as you have guests. A 150-guest wedding should have 150-200 items across various price points." },
    { q: "What price range should registry items be?", a: "Include 30% budget items (under $50), 45% mid-range ($50-$150), and 25% premium items ($150+). This accommodates all guest budgets." }
  ],
  `Gift Givers = Solo Guests + (Couple Guests / 2)
Expected Gifts = Gift Givers x Average Gift Value
Registry Value = Expected Gifts x Multiplier`,
  ["wedding-budget-calculator", "wedding-guest-calculator", "wedding-favor-cost-calculator"]
);

add(
  "bridal-shower-cost-calculator",
  "Bridal Shower Cost Calculator",
  "Estimate bridal shower expenses including venue, food, decorations, games, favors, and a gift for the bride.",
  "Finance",
  "finance",
  "$",
  ["bridal shower cost", "bridal shower budget", "bridal shower planning", "pre-wedding shower"],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", min: 5, max: 80, defaultValue: 25 }',
    '{ name: "venueOrHome", label: "Venue Type", type: "select", options: [{ value: "0", label: "Home/Free Venue" }, { value: "500", label: "Restaurant ($500)" }, { value: "1000", label: "Rented Space ($1000)" }], defaultValue: "0" }',
    '{ name: "foodPerPerson", label: "Food Per Person ($)", type: "number", min: 5, max: 100, defaultValue: 25 }',
    '{ name: "drinkPerPerson", label: "Drinks Per Person ($)", type: "number", min: 0, max: 50, defaultValue: 10 }',
    '{ name: "decorations", label: "Decorations ($)", type: "number", min: 0, max: 1000, defaultValue: 150 }',
    '{ name: "favors", label: "Favors Per Guest ($)", type: "number", min: 0, max: 30, defaultValue: 8 }',
    '{ name: "brideGift", label: "Gift for Bride ($)", type: "number", min: 0, max: 500, defaultValue: 75 }'
  ],
  `(inputs) => {
    const guests = inputs.guests as number;
    const venue = parseFloat(inputs.venueOrHome as unknown as string);
    const food = inputs.foodPerPerson as number;
    const drinks = inputs.drinkPerPerson as number;
    const decor = inputs.decorations as number;
    const favors = inputs.favors as number;
    const brideGift = inputs.brideGift as number;
    const totalFood = guests * (food + drinks);
    const totalFavors = guests * favors;
    const total = venue + totalFood + decor + totalFavors + brideGift;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Bridal Shower Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Venue", value: "$" + formatNumber(venue) },
        { label: "Food and Drinks", value: "$" + formatNumber(Math.round(totalFood)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Favors", value: "$" + formatNumber(Math.round(totalFavors)) },
        { label: "Gift for Bride", value: "$" + formatNumber(brideGift) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  }`,
  [
    { q: "How much does a bridal shower cost?", a: "Bridal showers typically cost $500 to $2,000 total, or $15 to $50 per guest. Costs vary widely based on venue choice and catering." },
    { q: "Who pays for the bridal shower?", a: "Traditionally, the maid of honor and bridesmaids host and split the cost. Sometimes the mother of the bride or other family members contribute." },
    { q: "How many guests attend a bridal shower?", a: "Bridal showers typically have 15 to 40 guests, including close friends, family members, and wedding party members." }
  ],
  `Total = Venue + (Guests x (Food + Drinks)) + Decorations + (Guests x Favors) + BrideGift
Per Guest = Total / Guests`,
  ["wedding-budget-calculator", "bridesmaid-dress-budget-calculator", "rehearsal-dinner-cost-calculator"]
);

add(
  "engagement-ring-affordability-calculator",
  "Engagement Ring Affordability Calculator",
  "Determine how much engagement ring you can afford based on income, savings, financing options, and monthly payment capacity.",
  "Finance",
  "finance",
  "$",
  ["engagement ring affordability", "ring budget", "engagement ring cost", "how much to spend on ring"],
  [
    '{ name: "annualIncome", label: "Annual Income ($)", type: "number", min: 15000, max: 500000, defaultValue: 65000 }',
    '{ name: "monthlySavings", label: "Monthly Savings Available ($)", type: "number", min: 0, max: 5000, defaultValue: 300 }',
    '{ name: "savedSoFar", label: "Already Saved ($)", type: "number", min: 0, max: 50000, defaultValue: 1000 }',
    '{ name: "monthsToSave", label: "Months Until Purchase", type: "number", min: 0, max: 24, defaultValue: 6 }',
    '{ name: "financingMonths", label: "Financing Term (0 if none)", type: "number", min: 0, max: 36, defaultValue: 0 }',
    '{ name: "financingRate", label: "Financing APR (%)", type: "number", min: 0, max: 30, defaultValue: 12 }'
  ],
  `(inputs) => {
    const income = inputs.annualIncome as number;
    const monthlySave = inputs.monthlySavings as number;
    const saved = inputs.savedSoFar as number;
    const months = inputs.monthsToSave as number;
    const finMonths = inputs.financingMonths as number;
    const apr = inputs.financingRate as number;
    const totalSaved = saved + (monthlySave * months);
    const oneMonthRule = Math.round(income / 12);
    const twoMonthRule = Math.round(income / 6);
    const threeMonthRule = Math.round(income / 4);
    let financedBudget = totalSaved;
    if (finMonths > 0) {
      const monthlyRate = apr / 100 / 12;
      if (monthlyRate > 0) {
        financedBudget = totalSaved + (monthlySave * ((1 - Math.pow(1 + monthlyRate, -finMonths)) / monthlyRate));
      } else {
        financedBudget = totalSaved + (monthlySave * finMonths);
      }
    }
    return {
      primary: { label: "Cash Budget", value: "$" + formatNumber(Math.round(totalSaved)) },
      details: [
        { label: "With Financing", value: "$" + formatNumber(Math.round(financedBudget)) },
        { label: "1-Month Salary Rule", value: "$" + formatNumber(oneMonthRule) },
        { label: "2-Month Salary Rule", value: "$" + formatNumber(twoMonthRule) },
        { label: "3-Month Salary Rule", value: "$" + formatNumber(threeMonthRule) },
        { label: "Monthly Savings Potential", value: "$" + formatNumber(monthlySave) + "/mo" }
      ]
    };
  }`,
  [
    { q: "How much should you spend on an engagement ring?", a: "The old rule of 2-3 months salary is outdated. Financial experts suggest spending what you can comfortably afford without going into debt, typically 1-2 months of income." },
    { q: "Is financing an engagement ring a good idea?", a: "0% financing can be smart if you pay it off on time. Avoid high-interest financing as a $5,000 ring at 20% APR over 3 years costs over $6,700 total." },
    { q: "What is the average engagement ring cost?", a: "The average engagement ring costs $5,000 to $7,000 in the US. However, beautiful rings are available at every price point from $500 and up." }
  ],
  `Cash Budget = AlreadySaved + (MonthlySavings x MonthsToSave)
Financed = CashBudget + MonthlySavings x ((1 - (1+r)^-n) / r)
Salary Rules: 1-month, 2-month, 3-month comparisons`,
  ["wedding-budget-calculator", "wedding-registry-value-calculator", "honeymoon-budget-planner-calculator"]
);

add(
  "wedding-dress-alteration-cost-calculator",
  "Wedding Dress Alteration Cost Calculator",
  "Estimate wedding dress alteration costs based on the type of alterations needed including hemming, bustle, bodice, and adding details.",
  "Finance",
  "finance",
  "$",
  ["wedding dress alterations", "bridal gown fitting", "dress tailoring cost", "wedding dress hemming"],
  [
    '{ name: "hemming", label: "Hemming Needed", type: "select", options: [{ value: "0", label: "None" }, { value: "100", label: "Simple Hem ($100)" }, { value: "250", label: "Multi-Layer Hem ($250)" }, { value: "400", label: "Lace/Beaded Hem ($400)" }], defaultValue: "100" }',
    '{ name: "bustleType", label: "Bustle Type", type: "select", options: [{ value: "0", label: "None" }, { value: "75", label: "Simple Bustle ($75)" }, { value: "150", label: "French Bustle ($150)" }, { value: "250", label: "Multi-Point Bustle ($250)" }], defaultValue: "75" }',
    '{ name: "bodiceWork", label: "Bodice Alterations", type: "select", options: [{ value: "0", label: "None" }, { value: "75", label: "Take In/Let Out ($75)" }, { value: "150", label: "Restructure ($150)" }, { value: "250", label: "Add Boning/Cups ($250)" }], defaultValue: "75" }',
    '{ name: "strapAdjust", label: "Strap/Sleeve Work", type: "select", options: [{ value: "0", label: "None" }, { value: "50", label: "Shorten Straps ($50)" }, { value: "150", label: "Add Sleeves ($150)" }, { value: "200", label: "Cap to Long Sleeve ($200)" }], defaultValue: "0" }',
    '{ name: "pressing", label: "Professional Pressing", type: "select", options: [{ value: "0", label: "Not Needed" }, { value: "75", label: "Standard ($75)" }, { value: "150", label: "Full Steaming ($150)" }], defaultValue: "75" }'
  ],
  `(inputs) => {
    const hem = parseFloat(inputs.hemming as unknown as string);
    const bustle = parseFloat(inputs.bustleType as unknown as string);
    const bodice = parseFloat(inputs.bodiceWork as unknown as string);
    const straps = parseFloat(inputs.strapAdjust as unknown as string);
    const pressing = parseFloat(inputs.pressing as unknown as string);
    const total = hem + bustle + bodice + straps + pressing;
    const items = [];
    if (hem > 0) items.push("Hemming");
    if (bustle > 0) items.push("Bustle");
    if (bodice > 0) items.push("Bodice");
    if (straps > 0) items.push("Straps/Sleeves");
    if (pressing > 0) items.push("Pressing");
    return {
      primary: { label: "Total Alteration Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Hemming", value: "$" + formatNumber(hem) },
        { label: "Bustle", value: "$" + formatNumber(bustle) },
        { label: "Bodice Work", value: "$" + formatNumber(bodice) },
        { label: "Strap/Sleeve Work", value: "$" + formatNumber(straps) },
        { label: "Professional Pressing", value: "$" + formatNumber(pressing) },
        { label: "Number of Services", value: formatNumber(items.length) }
      ]
    };
  }`,
  [
    { q: "How much do wedding dress alterations cost?", a: "Wedding dress alterations typically cost $200 to $800 total. Simple adjustments start at $50, while extensive work like adding sleeves or restructuring the bodice can exceed $500." },
    { q: "When should you start dress alterations?", a: "Begin alterations 2-3 months before the wedding. Plan for 2-3 fitting appointments spaced 2-3 weeks apart." },
    { q: "Do all wedding dresses need alterations?", a: "Nearly all wedding dresses need some alteration for a perfect fit. Even off-the-rack dresses typically need hemming and minor adjustments." }
  ],
  `Total = Hemming + Bustle + Bodice + StrapWork + Pressing`,
  ["wedding-budget-calculator", "bridesmaid-dress-budget-calculator", "bridal-shower-cost-calculator"]
);

add(
  "tent-rental-cost-calculator",
  "Tent Rental Cost Calculator",
  "Calculate tent rental costs for outdoor events based on guest count, tent style, flooring, sidewalls, and lighting options.",
  "Finance",
  "finance",
  "$",
  ["tent rental cost", "event tent rental", "wedding tent", "outdoor event tent pricing"],
  [
    '{ name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 100 }',
    '{ name: "tentStyle", label: "Tent Style", type: "select", options: [{ value: "1", label: "Frame Tent (basic)" }, { value: "1.5", label: "Pole Tent (classic)" }, { value: "2.5", label: "Sailcloth Tent" }, { value: "3", label: "Clear-Span Structure" }], defaultValue: "1.5" }',
    '{ name: "flooring", label: "Flooring", type: "select", options: [{ value: "0", label: "None (grass)" }, { value: "3", label: "Subflooring ($3/sqft)" }, { value: "6", label: "Dance Floor ($6/sqft)" }, { value: "8", label: "Full Flooring ($8/sqft)" }], defaultValue: "3" }',
    '{ name: "sidewalls", label: "Sidewalls", type: "select", options: [{ value: "0", label: "None (open)" }, { value: "200", label: "Standard White ($200)" }, { value: "500", label: "Clear Panels ($500)" }, { value: "800", label: "French Windows ($800)" }], defaultValue: "200" }',
    '{ name: "lighting", label: "Lighting Package", type: "select", options: [{ value: "0", label: "None" }, { value: "300", label: "Basic String Lights ($300)" }, { value: "800", label: "Chandeliers ($800)" }, { value: "1500", label: "Full Design ($1500)" }], defaultValue: "300" }'
  ],
  `(inputs) => {
    const guests = inputs.guestCount as number;
    const styleMult = parseFloat(inputs.tentStyle as unknown as string);
    const floorRate = parseFloat(inputs.flooring as unknown as string);
    const sidewalls = parseFloat(inputs.sidewalls as unknown as string);
    const lighting = parseFloat(inputs.lighting as unknown as string);
    const sqftPerGuest = 15;
    const totalSqft = guests * sqftPerGuest;
    const baseCostPerSqft = 2;
    const tentCost = totalSqft * baseCostPerSqft * styleMult;
    const flooringCost = totalSqft * floorRate;
    const total = tentCost + flooringCost + sidewalls + lighting;
    const delivery = total * 0.1;
    const grandTotal = total + delivery;
    return {
      primary: { label: "Total Tent Rental Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Tent Rental", value: "$" + formatNumber(Math.round(tentCost)) },
        { label: "Flooring", value: "$" + formatNumber(Math.round(flooringCost)) },
        { label: "Sidewalls", value: "$" + formatNumber(sidewalls) },
        { label: "Lighting", value: "$" + formatNumber(lighting) },
        { label: "Delivery/Setup (10%)", value: "$" + formatNumber(Math.round(delivery)) },
        { label: "Total Square Footage", value: formatNumber(totalSqft) + " sqft" }
      ]
    };
  }`,
  [
    { q: "How much does a tent rental cost for a wedding?", a: "Wedding tent rentals range from $1,000 to $10,000 depending on size and style. A standard pole tent for 100 guests costs $2,000 to $4,000. Sailcloth and clear-span tents cost significantly more." },
    { q: "How much space do you need per guest in a tent?", a: "Plan for 12-15 square feet per guest for seated dinner with a dance floor. Cocktail-style events need about 8-10 square feet per guest." },
    { q: "Do you need a permit for a tent at a wedding?", a: "Many municipalities require permits for tents over a certain size (often 200+ square feet). Check with your local building department well in advance." }
  ],
  `Tent Area = Guests x 15 sqft
Tent Cost = Area x BaseCostPerSqft x StyleMultiplier
Total = TentCost + Flooring + Sidewalls + Lighting + Delivery`,
  ["event-tent-size-calculator", "reception-venue-cost-calculator", "event-lighting-cost-calculator"]
);

add(
  "event-lighting-cost-calculator",
  "Event Lighting Cost Calculator",
  "Estimate event lighting costs for weddings and parties including uplighting, string lights, spotlights, and gobo projections.",
  "Finance",
  "finance",
  "$",
  ["event lighting cost", "wedding lighting", "uplighting rental", "party lights budget"],
  [
    '{ name: "uplights", label: "Number of Uplights", type: "number", min: 0, max: 50, defaultValue: 12 }',
    '{ name: "uplightCost", label: "Cost Per Uplight ($)", type: "number", min: 10, max: 100, defaultValue: 25 }',
    '{ name: "stringLightFeet", label: "String Lights (feet)", type: "number", min: 0, max: 1000, defaultValue: 200 }',
    '{ name: "stringLightRate", label: "String Light Rate ($/ft)", type: "number", min: 1, max: 15, defaultValue: 4 }',
    '{ name: "spotlights", label: "Spotlights/Pin Spots", type: "number", min: 0, max: 20, defaultValue: 4 }',
    '{ name: "spotlightCost", label: "Cost Per Spotlight ($)", type: "number", min: 20, max: 150, defaultValue: 50 }',
    '{ name: "goboProjection", label: "Gobo/Monogram Projection", type: "select", options: [{ value: "0", label: "None" }, { value: "150", label: "Standard ($150)" }, { value: "350", label: "Custom Design ($350)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const uplights = inputs.uplights as number;
    const uplightCost = inputs.uplightCost as number;
    const stringFeet = inputs.stringLightFeet as number;
    const stringRate = inputs.stringLightRate as number;
    const spots = inputs.spotlights as number;
    const spotCost = inputs.spotlightCost as number;
    const gobo = parseFloat(inputs.goboProjection as unknown as string);
    const totalUplighting = uplights * uplightCost;
    const totalString = stringFeet * stringRate;
    const totalSpots = spots * spotCost;
    const subtotal = totalUplighting + totalString + totalSpots + gobo;
    const setupFee = subtotal * 0.15;
    const total = subtotal + setupFee;
    return {
      primary: { label: "Total Lighting Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Uplighting", value: "$" + formatNumber(Math.round(totalUplighting)) },
        { label: "String Lights", value: "$" + formatNumber(Math.round(totalString)) },
        { label: "Spotlights", value: "$" + formatNumber(Math.round(totalSpots)) },
        { label: "Gobo Projection", value: "$" + formatNumber(gobo) },
        { label: "Setup/Teardown (15%)", value: "$" + formatNumber(Math.round(setupFee)) }
      ]
    };
  }`,
  [
    { q: "How much does event lighting cost?", a: "Basic uplighting packages start at $200-$500. Full lighting design with string lights, spots, and gobos ranges from $1,000 to $3,000 or more." },
    { q: "How many uplights do you need for a wedding?", a: "Plan one uplight every 6-8 feet along walls. A typical ballroom needs 12-20 uplights for full coverage." },
    { q: "What is a gobo projection?", a: "A gobo is a stencil placed in front of a light to project a pattern or monogram. Custom gobos with your initials or wedding date add a personal touch to the dance floor." }
  ],
  `Total = Uplighting + StringLights + Spotlights + Gobo + SetupFee
Setup Fee = Subtotal x 0.15`,
  ["tent-rental-cost-calculator", "reception-venue-cost-calculator", "dj-vs-band-cost-calculator"]
);

add(
  "party-rental-equipment-cost-calculator",
  "Party Rental Equipment Cost Calculator",
  "Estimate rental costs for party equipment including tables, chairs, linens, dinnerware, and glassware for your event.",
  "Finance",
  "finance",
  "$",
  ["party rental cost", "table and chair rental", "event equipment rental", "linen rental cost"],
  [
    '{ name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 100 }',
    '{ name: "tableRental", label: "Table Rental Each ($)", type: "number", min: 5, max: 100, defaultValue: 12 }',
    '{ name: "seatsPerTable", label: "Seats Per Table", type: "number", min: 4, max: 12, defaultValue: 8 }',
    '{ name: "chairRental", label: "Chair Rental Each ($)", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "linenPerTable", label: "Linen Per Table ($)", type: "number", min: 0, max: 50, defaultValue: 15 }',
    '{ name: "placeSettingCost", label: "Place Setting Per Guest ($)", type: "number", min: 0, max: 25, defaultValue: 5 }',
    '{ name: "glasswareCost", label: "Glassware Per Guest ($)", type: "number", min: 0, max: 10, defaultValue: 3 }'
  ],
  `(inputs) => {
    const guests = inputs.guestCount as number;
    const tablePrice = inputs.tableRental as number;
    const seatsPerTable = inputs.seatsPerTable as number;
    const chairPrice = inputs.chairRental as number;
    const linenPrice = inputs.linenPerTable as number;
    const placeSetting = inputs.placeSettingCost as number;
    const glassware = inputs.glasswareCost as number;
    const tablesNeeded = Math.ceil(guests / seatsPerTable);
    const totalTables = tablesNeeded * tablePrice;
    const totalChairs = guests * chairPrice;
    const totalLinens = tablesNeeded * linenPrice;
    const totalPlaceSettings = guests * placeSetting;
    const totalGlassware = guests * glassware;
    const subtotal = totalTables + totalChairs + totalLinens + totalPlaceSettings + totalGlassware;
    const delivery = subtotal * 0.1;
    const total = subtotal + delivery;
    return {
      primary: { label: "Total Rental Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Tables (" + tablesNeeded + ")", value: "$" + formatNumber(Math.round(totalTables)) },
        { label: "Chairs (" + guests + ")", value: "$" + formatNumber(Math.round(totalChairs)) },
        { label: "Linens", value: "$" + formatNumber(Math.round(totalLinens)) },
        { label: "Place Settings", value: "$" + formatNumber(Math.round(totalPlaceSettings)) },
        { label: "Glassware", value: "$" + formatNumber(Math.round(totalGlassware)) },
        { label: "Delivery/Pickup (10%)", value: "$" + formatNumber(Math.round(delivery)) }
      ]
    };
  }`,
  [
    { q: "How much does party equipment rental cost?", a: "Basic table and chair rental runs $5-$15 per person. Adding linens, dinnerware, and glassware brings it to $15-$40 per person depending on quality." },
    { q: "When should you book party rentals?", a: "Book event rentals 3-6 months in advance, especially for peak wedding season (May-October). Last-minute bookings may have limited inventory and higher prices." },
    { q: "What is included in a place setting rental?", a: "A standard place setting includes a dinner plate, salad plate, fork, knife, spoon, and napkin. Charger plates and specialty utensils cost extra." }
  ],
  `Tables = ceil(Guests / SeatsPerTable) x TablePrice
Chairs = Guests x ChairPrice
Total = Tables + Chairs + Linens + PlaceSettings + Glassware + Delivery`,
  ["event-catering-calculator", "reception-venue-cost-calculator", "tent-rental-cost-calculator"]
);

add(
  "wedding-favor-cost-calculator",
  "Wedding Favor Cost Calculator",
  "Calculate the total cost of wedding favors including per-item cost, packaging, personalization, and shipping for DIY or purchased options.",
  "Finance",
  "finance",
  "$",
  ["wedding favor cost", "party favors budget", "wedding gifts for guests", "favor packaging cost"],
  [
    '{ name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 120 }',
    '{ name: "favorType", label: "Favor Type", type: "select", options: [{ value: "2", label: "DIY/Homemade ($2)" }, { value: "4", label: "Standard ($4)" }, { value: "7", label: "Premium ($7)" }, { value: "12", label: "Luxury ($12)" }], defaultValue: "4" }',
    '{ name: "packagingCost", label: "Packaging Per Favor ($)", type: "number", min: 0, max: 5, defaultValue: 1 }',
    '{ name: "personalization", label: "Personalization Per Favor ($)", type: "number", min: 0, max: 5, defaultValue: 0.5 }',
    '{ name: "extraPercent", label: "Extra Favors Buffer (%)", type: "number", min: 0, max: 25, defaultValue: 10 }'
  ],
  `(inputs) => {
    const guests = inputs.guestCount as number;
    const favorCost = parseFloat(inputs.favorType as unknown as string);
    const packaging = inputs.packagingCost as number;
    const personalization = inputs.personalization as number;
    const buffer = inputs.extraPercent as number;
    const totalFavors = Math.ceil(guests * (1 + buffer / 100));
    const perFavor = favorCost + packaging + personalization;
    const totalCost = totalFavors * perFavor;
    const costPerGuest = totalCost / guests;
    return {
      primary: { label: "Total Favor Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Cost Per Favor", value: "$" + formatNumber(Math.round(perFavor * 100) / 100) },
        { label: "Total Favors (with buffer)", value: formatNumber(totalFavors) },
        { label: "Favor Item Cost", value: "$" + formatNumber(favorCost) + " each" },
        { label: "Packaging Total", value: "$" + formatNumber(Math.round(totalFavors * packaging * 100) / 100) },
        { label: "Personalization Total", value: "$" + formatNumber(Math.round(totalFavors * personalization * 100) / 100) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(costPerGuest * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much should you spend on wedding favors?", a: "Most couples spend $2 to $5 per favor. The total favor budget is typically 2-3% of the overall wedding budget." },
    { q: "Do you need wedding favors for every guest?", a: "Provide one favor per guest or per couple. Order 10% extra to account for last-minute additions and table display needs." },
    { q: "What are affordable wedding favor ideas?", a: "Popular budget-friendly favors include homemade cookies, seed packets, custom matchboxes, candy bags, or small succulents. DIY options can cost under $2 each." }
  ],
  `Favors Needed = Guests x (1 + Buffer%)
Per Favor = FavorCost + Packaging + Personalization
Total = FavorsNeeded x PerFavor`,
  ["wedding-budget-calculator", "wedding-guest-calculator", "wedding-registry-value-calculator"]
);

add(
  "destination-wedding-savings-calculator",
  "Destination Wedding Savings Calculator",
  "Compare the cost of a local wedding versus a destination wedding including travel, venue, guest expenses, and potential savings.",
  "Finance",
  "finance",
  "$",
  ["destination wedding cost", "destination vs local wedding", "wedding abroad cost", "travel wedding savings"],
  [
    '{ name: "localCost", label: "Estimated Local Wedding Cost ($)", type: "number", min: 5000, max: 200000, defaultValue: 35000 }',
    '{ name: "destVenueCost", label: "Destination Venue Package ($)", type: "number", min: 2000, max: 100000, defaultValue: 12000 }',
    '{ name: "coupleFlights", label: "Couple Flight Cost ($)", type: "number", min: 200, max: 10000, defaultValue: 1500 }',
    '{ name: "guestsLocal", label: "Local Wedding Guest Count", type: "number", min: 20, max: 500, defaultValue: 150 }',
    '{ name: "guestsDest", label: "Destination Guest Count", type: "number", min: 5, max: 200, defaultValue: 40 }',
    '{ name: "destPerGuestCost", label: "Destination Per-Guest Cost ($)", type: "number", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "extraTravel", label: "Additional Travel Costs ($)", type: "number", min: 0, max: 20000, defaultValue: 3000 }'
  ],
  `(inputs) => {
    const localCost = inputs.localCost as number;
    const destVenue = inputs.destVenueCost as number;
    const flights = inputs.coupleFlights as number;
    const guestsLocal = inputs.guestsLocal as number;
    const guestsDest = inputs.guestsDest as number;
    const destPerGuest = inputs.destPerGuestCost as number;
    const extraTravel = inputs.extraTravel as number;
    const destGuestCost = guestsDest * destPerGuest;
    const destTotal = destVenue + flights + destGuestCost + extraTravel;
    const savings = localCost - destTotal;
    const localPerGuest = localCost / guestsLocal;
    const destPerGuestTotal = destTotal / guestsDest;
    return {
      primary: { label: "Destination Wedding Cost", value: "$" + formatNumber(Math.round(destTotal)) },
      details: [
        { label: "Local Wedding Cost", value: "$" + formatNumber(localCost) },
        { label: "Savings with Destination", value: "$" + formatNumber(Math.round(savings)) },
        { label: "Destination Per Guest", value: "$" + formatNumber(Math.round(destPerGuestTotal)) },
        { label: "Local Per Guest", value: "$" + formatNumber(Math.round(localPerGuest)) },
        { label: "Guest Reduction", value: formatNumber(guestsLocal - guestsDest) + " fewer guests" }
      ]
    };
  }`,
  [
    { q: "Is a destination wedding cheaper than a local one?", a: "Destination weddings can be 30-50% cheaper than local weddings primarily because fewer guests attend. The smaller guest list significantly reduces catering and venue costs." },
    { q: "How many guests attend a destination wedding?", a: "On average, 50-70% of invited guests attend a destination wedding compared to 80-90% for a local wedding. Most destination weddings have 30-50 guests." },
    { q: "Who pays for travel to a destination wedding?", a: "Guests typically pay for their own travel and accommodation. Some couples help by negotiating group hotel rates or covering welcome dinner costs." }
  ],
  `Destination Total = VenuePackage + Flights + (DestGuests x PerGuestCost) + TravelCosts
Savings = LocalCost - DestinationTotal`,
  ["wedding-budget-calculator", "honeymoon-budget-planner-calculator", "reception-venue-cost-calculator"]
);

add(
  "wedding-guest-meal-cost-calculator",
  "Wedding Guest Meal Cost Calculator",
  "Calculate per-guest and total meal costs for your wedding including appetizers, entrees, dessert, beverages, and service charges.",
  "Finance",
  "finance",
  "$",
  ["wedding meal cost", "wedding catering per person", "reception food cost", "wedding dinner pricing"],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 120 }',
    '{ name: "serviceStyle", label: "Service Style", type: "select", options: [{ value: "1", label: "Buffet" }, { value: "1.3", label: "Plated Dinner" }, { value: "1.6", label: "Family Style" }, { value: "0.8", label: "Food Stations" }], defaultValue: "1.3" }',
    '{ name: "appetizerCost", label: "Appetizers Per Person ($)", type: "number", min: 0, max: 50, defaultValue: 12 }',
    '{ name: "entreeCost", label: "Entree Per Person ($)", type: "number", min: 15, max: 200, defaultValue: 45 }',
    '{ name: "dessertCost", label: "Dessert Per Person ($)", type: "number", min: 0, max: 50, defaultValue: 8 }',
    '{ name: "beverageCost", label: "Beverages Per Person ($)", type: "number", min: 0, max: 80, defaultValue: 25 }',
    '{ name: "serviceCharge", label: "Service Charge (%)", type: "number", min: 0, max: 25, defaultValue: 20 }'
  ],
  `(inputs) => {
    const guests = inputs.guests as number;
    const styleMult = parseFloat(inputs.serviceStyle as unknown as string);
    const appetizer = inputs.appetizerCost as number;
    const entree = inputs.entreeCost as number;
    const dessert = inputs.dessertCost as number;
    const beverage = inputs.beverageCost as number;
    const serviceRate = inputs.serviceCharge as number;
    const foodPerPerson = (appetizer + entree + dessert) * styleMult;
    const totalPerPerson = foodPerPerson + beverage;
    const subtotal = totalPerPerson * guests;
    const serviceCharge = subtotal * (serviceRate / 100);
    const total = subtotal + serviceCharge;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Meal Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) },
        { label: "Food Per Person", value: "$" + formatNumber(Math.round(foodPerPerson)) },
        { label: "Beverages Per Person", value: "$" + formatNumber(beverage) },
        { label: "Subtotal", value: "$" + formatNumber(Math.round(subtotal)) },
        { label: "Service Charge", value: "$" + formatNumber(Math.round(serviceCharge)) }
      ]
    };
  }`,
  [
    { q: "How much does a wedding meal cost per person?", a: "Wedding meals typically cost $50 to $150 per person depending on location and menu. Plated dinners cost more than buffets due to additional service staff." },
    { q: "Which is cheaper, buffet or plated dinner?", a: "Buffets are generally 15-30% less expensive than plated dinners because they require fewer servers. However, buffets may lead to more food waste." },
    { q: "How do you calculate food quantities for a wedding?", a: "Plan for 6-8 appetizer pieces per guest during cocktail hour, one full entree per guest, and 1.5 dessert servings per person." }
  ],
  `Food Per Person = (Appetizer + Entree + Dessert) x ServiceStyleMultiplier
Subtotal = (Food + Beverages) x Guests
Total = Subtotal + ServiceCharge`,
  ["event-catering-calculator", "wedding-budget-calculator", "wedding-guest-calculator"]
);

add(
  "floral-arrangement-budget-calculator",
  "Floral Arrangement Budget Calculator",
  "Plan your wedding or event floral budget with detailed costs for bridal bouquet, centerpieces, boutonnieres, ceremony flowers, and more.",
  "Finance",
  "finance",
  "$",
  ["floral budget", "wedding flowers cost", "centerpiece cost", "bouquet pricing", "event florals"],
  [
    '{ name: "bridalBouquet", label: "Bridal Bouquet ($)", type: "number", min: 50, max: 1000, defaultValue: 250 }',
    '{ name: "bridesmaidBouquets", label: "Bridesmaid Bouquets Count", type: "number", min: 0, max: 15, defaultValue: 4 }',
    '{ name: "bridesmaidBouquetCost", label: "Each Bridesmaid Bouquet ($)", type: "number", min: 30, max: 300, defaultValue: 85 }',
    '{ name: "centerpieces", label: "Number of Centerpieces", type: "number", min: 0, max: 50, defaultValue: 15 }',
    '{ name: "centerpieceCost", label: "Each Centerpiece ($)", type: "number", min: 30, max: 500, defaultValue: 100 }',
    '{ name: "boutonnieres", label: "Boutonnieres Count", type: "number", min: 0, max: 20, defaultValue: 8 }',
    '{ name: "boutonniereCost", label: "Each Boutonniere ($)", type: "number", min: 5, max: 40, defaultValue: 15 }',
    '{ name: "ceremonyCost", label: "Ceremony Florals ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const bridal = inputs.bridalBouquet as number;
    const bmCount = inputs.bridesmaidBouquets as number;
    const bmCost = inputs.bridesmaidBouquetCost as number;
    const cpCount = inputs.centerpieces as number;
    const cpCost = inputs.centerpieceCost as number;
    const boutCount = inputs.boutonnieres as number;
    const boutCost = inputs.boutonniereCost as number;
    const ceremony = inputs.ceremonyCost as number;
    const totalBridesmaid = bmCount * bmCost;
    const totalCenterpieces = cpCount * cpCost;
    const totalBoutonnieres = boutCount * boutCost;
    const total = bridal + totalBridesmaid + totalCenterpieces + totalBoutonnieres + ceremony;
    return {
      primary: { label: "Total Floral Budget", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Bridal Bouquet", value: "$" + formatNumber(bridal) },
        { label: "Bridesmaid Bouquets", value: "$" + formatNumber(Math.round(totalBridesmaid)) },
        { label: "Centerpieces", value: "$" + formatNumber(Math.round(totalCenterpieces)) },
        { label: "Boutonnieres", value: "$" + formatNumber(Math.round(totalBoutonnieres)) },
        { label: "Ceremony Florals", value: "$" + formatNumber(ceremony) }
      ]
    };
  }`,
  [
    { q: "How much do wedding flowers cost on average?", a: "The average wedding floral budget is $2,000 to $5,000. Centerpieces and the bridal bouquet are the largest expenses, while boutonnieres and corsages are modest." },
    { q: "How can you save on wedding flowers?", a: "Choose in-season flowers, use greenery-heavy designs, repurpose ceremony arrangements at the reception, and consider non-floral elements like candles or lanterns for centerpieces." },
    { q: "How many centerpieces do you need for a wedding?", a: "You need one centerpiece per guest table. For 100-150 guests with tables of 8-10, plan for 12-18 centerpieces." }
  ],
  `Total = BridalBouquet + (BridesmaidCount x BridesmaidCost) + (Centerpieces x CenterpieceCost) + (Boutonnieres x BoutonniereCost) + CeremonyFlorals`,
  ["wedding-flower-calculator", "wedding-budget-calculator", "reception-venue-cost-calculator"]
);

add(
  "wedding-cake-cost-estimator",
  "Wedding Cake Cost Estimator",
  "Estimate detailed wedding cake costs based on servings, tiers, filling options, fondant versus buttercream, and specialty decorations.",
  "Finance",
  "finance",
  "$",
  ["wedding cake cost", "tiered cake pricing", "cake per serving cost", "wedding dessert budget"],
  [
    '{ name: "servings", label: "Number of Servings", type: "number", min: 10, max: 500, defaultValue: 120 }',
    '{ name: "tiers", label: "Number of Tiers", type: "number", min: 1, max: 7, defaultValue: 3 }',
    '{ name: "icingType", label: "Icing Type", type: "select", options: [{ value: "1", label: "Buttercream" }, { value: "1.5", label: "Fondant" }, { value: "1.8", label: "Ganache" }], defaultValue: "1" }',
    '{ name: "fillingUpgrade", label: "Premium Filling", type: "select", options: [{ value: "0", label: "Standard (included)" }, { value: "1", label: "Fruit Curd (+$1/serving)" }, { value: "2", label: "Mousse (+$2/serving)" }, { value: "3", label: "Specialty (+$3/serving)" }], defaultValue: "0" }',
    '{ name: "decorLevel", label: "Decoration Level", type: "select", options: [{ value: "0", label: "Simple/Minimal" }, { value: "200", label: "Fresh Flowers ($200)" }, { value: "400", label: "Sugar Flowers ($400)" }, { value: "800", label: "Elaborate Design ($800)" }], defaultValue: "200" }',
    '{ name: "delivery", label: "Delivery and Setup ($)", type: "number", min: 0, max: 500, defaultValue: 100 }'
  ],
  `(inputs) => {
    const servings = inputs.servings as number;
    const tiers = inputs.tiers as number;
    const icingMult = parseFloat(inputs.icingType as unknown as string);
    const filling = parseFloat(inputs.fillingUpgrade as unknown as string);
    const decor = parseFloat(inputs.decorLevel as unknown as string);
    const delivery = inputs.delivery as number;
    const basePerServing = 4 + (tiers * 0.75);
    const cakeCost = servings * basePerServing * icingMult;
    const fillingCost = servings * filling;
    const total = cakeCost + fillingCost + decor + delivery;
    const perServing = total / servings;
    return {
      primary: { label: "Total Cake Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Base Cake Cost", value: "$" + formatNumber(Math.round(cakeCost)) },
        { label: "Filling Upgrade", value: "$" + formatNumber(Math.round(fillingCost)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Delivery and Setup", value: "$" + formatNumber(delivery) },
        { label: "Cost Per Serving", value: "$" + formatNumber(Math.round(perServing * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much does a wedding cake cost per serving?", a: "Wedding cakes typically cost $4 to $12 per serving. Simple buttercream designs start lower, while fondant cakes with elaborate details cost $8 to $15 per slice." },
    { q: "How many tiers do you need for a wedding cake?", a: "A 3-tier cake serves 75-100 guests. For 150+ guests, consider a 4-5 tier cake or a smaller display cake with additional sheet cakes for serving." },
    { q: "Is fondant or buttercream more expensive?", a: "Fondant is typically 30-50% more expensive than buttercream due to the labor-intensive application process. Buttercream is more popular for taste, fondant for smooth visual appeal." }
  ],
  `Base Per Serving = $4 + (Tiers x $0.75)
Cake Cost = Servings x BasePerServing x IcingMultiplier
Total = CakeCost + FillingUpgrade + Decorations + Delivery`,
  ["wedding-cake-calculator", "wedding-budget-calculator", "event-catering-calculator"]
);

add(
  "wedding-invitation-quantity-calculator",
  "Wedding Invitation Quantity Calculator",
  "Calculate exactly how many wedding invitations to order based on guest list, household groupings, vendor copies, and keepsake extras.",
  "Everyday",
  "everyday",
  "~",
  ["invitation quantity", "how many invitations", "wedding stationery count", "save the date quantity"],
  [
    '{ name: "totalGuests", label: "Total Guest Count", type: "number", min: 10, max: 500, defaultValue: 150 }',
    '{ name: "households", label: "Number of Households", type: "number", min: 5, max: 400, defaultValue: 95 }',
    '{ name: "vendorCopies", label: "Vendor Copies Needed", type: "number", min: 0, max: 20, defaultValue: 3 }',
    '{ name: "keepsakeExtras", label: "Keepsake/Extra Copies", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "errorBuffer", label: "Error Buffer (%)", type: "number", min: 0, max: 25, defaultValue: 10 }',
    '{ name: "costPerInvite", label: "Cost Per Invitation Suite ($)", type: "number", min: 1, max: 30, defaultValue: 4 }'
  ],
  `(inputs) => {
    const guests = inputs.totalGuests as number;
    const households = inputs.households as number;
    const vendorCopies = inputs.vendorCopies as number;
    const keepsakes = inputs.keepsakeExtras as number;
    const buffer = inputs.errorBuffer as number;
    const costEach = inputs.costPerInvite as number;
    const baseInvitations = households;
    const bufferQty = Math.ceil(households * (buffer / 100));
    const totalInvitations = baseInvitations + vendorCopies + keepsakes + bufferQty;
    const totalCost = totalInvitations * costEach;
    const postageCost = totalInvitations * 0.68;
    return {
      primary: { label: "Total Invitations to Order", value: formatNumber(totalInvitations) },
      details: [
        { label: "Household Invitations", value: formatNumber(baseInvitations) },
        { label: "Buffer Copies", value: formatNumber(bufferQty) },
        { label: "Vendor + Keepsake", value: formatNumber(vendorCopies + keepsakes) },
        { label: "Printing Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Estimated Postage", value: "$" + formatNumber(Math.round(postageCost * 100) / 100) },
        { label: "Total Stationery Cost", value: "$" + formatNumber(Math.round(totalCost + postageCost)) }
      ]
    };
  }`,
  [
    { q: "How do you determine the number of wedding invitations?", a: "Count households, not individual guests. A couple living together gets one invitation. Add 10% extra for mistakes, plus a few for keepsakes and vendors." },
    { q: "When should wedding invitations be sent?", a: "Mail invitations 6-8 weeks before the wedding. Destination weddings should send 8-12 weeks in advance. Save-the-dates go out 6-8 months early." },
    { q: "What should be included in a wedding invitation suite?", a: "A full suite includes the invitation, RSVP card with envelope, details/reception card, and outer and inner envelopes. Some add maps, accommodation cards, or meal choice cards." }
  ],
  `Total Invitations = Households + ceil(Households x Buffer%) + VendorCopies + Keepsakes
Printing Cost = TotalInvitations x CostPerInvite
Postage = TotalInvitations x $0.68`,
  ["wedding-invitation-calculator", "wedding-guest-calculator", "wedding-budget-calculator"]
);

add(
  "wedding-transportation-cost-calculator",
  "Wedding Transportation Cost Calculator",
  "Estimate wedding day transportation costs for the couple, bridal party, and guest shuttles including limos, party buses, and car services.",
  "Finance",
  "finance",
  "$",
  ["wedding transportation", "wedding limo cost", "party bus rental", "guest shuttle cost"],
  [
    '{ name: "coupleTransport", label: "Couple Vehicle Type", type: "select", options: [{ value: "300", label: "Sedan ($300)" }, { value: "600", label: "Limousine ($600)" }, { value: "900", label: "Vintage/Luxury ($900)" }, { value: "150", label: "Personal Vehicle ($150)" }], defaultValue: "600" }',
    '{ name: "bridalPartySize", label: "Bridal Party Size", type: "number", min: 0, max: 20, defaultValue: 10 }',
    '{ name: "partyTransport", label: "Party Transport Type", type: "select", options: [{ value: "0", label: "Not Needed" }, { value: "400", label: "SUV Limos ($400)" }, { value: "800", label: "Party Bus ($800)" }, { value: "300", label: "Sedan Service ($300)" }], defaultValue: "400" }',
    '{ name: "guestShuttles", label: "Guest Shuttles Needed", type: "number", min: 0, max: 5, defaultValue: 1 }',
    '{ name: "shuttleCost", label: "Cost Per Shuttle ($)", type: "number", min: 0, max: 2000, defaultValue: 500 }',
    '{ name: "hours", label: "Total Service Hours", type: "number", min: 2, max: 12, defaultValue: 6 }'
  ],
  `(inputs) => {
    const coupleVehicle = parseFloat(inputs.coupleTransport as unknown as string);
    const partySize = inputs.bridalPartySize as number;
    const partyVehicle = parseFloat(inputs.partyTransport as unknown as string);
    const shuttleCount = inputs.guestShuttles as number;
    const shuttleCost = inputs.shuttleCost as number;
    const hours = inputs.hours as number;
    const coupleTotal = coupleVehicle;
    const partyTotal = partyVehicle;
    const shuttleTotal = shuttleCount * shuttleCost;
    const gratuity = (coupleTotal + partyTotal + shuttleTotal) * 0.18;
    const total = coupleTotal + partyTotal + shuttleTotal + gratuity;
    return {
      primary: { label: "Total Transportation Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Couple Vehicle", value: "$" + formatNumber(coupleVehicle) },
        { label: "Bridal Party Transport", value: "$" + formatNumber(partyVehicle) },
        { label: "Guest Shuttles", value: "$" + formatNumber(Math.round(shuttleTotal)) },
        { label: "Gratuity (18%)", value: "$" + formatNumber(Math.round(gratuity)) },
        { label: "Service Hours", value: formatNumber(hours) + " hours" }
      ]
    };
  }`,
  [
    { q: "How much does wedding transportation cost?", a: "Wedding transportation typically costs $500 to $2,500. A single limousine costs $400-$800, party buses $600-$1,200, and guest shuttles $300-$600 each." },
    { q: "Do you need guest shuttles for a wedding?", a: "Guest shuttles are recommended when the ceremony and reception are at different locations, or when parking is limited. They also help ensure guest safety when alcohol is served." },
    { q: "How much should you tip wedding drivers?", a: "Standard gratuity for wedding drivers is 15-20% of the total fare. Some companies include gratuity in the contract, so always check before adding extra." }
  ],
  `Total = CoupleVehicle + PartyTransport + (Shuttles x ShuttleCost) + Gratuity
Gratuity = (CoupleVehicle + PartyTransport + ShuttleCost) x 18%`,
  ["wedding-budget-calculator", "reception-venue-cost-calculator", "destination-wedding-savings-calculator"]
);
