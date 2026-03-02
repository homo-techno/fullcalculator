add(
  "bpm-tempo-calculator",
  "BPM Tempo Calculator",
  "Calculate beats per minute, tempo markings, and timing intervals for music production and performance.",
  "Everyday",
  "everyday",
  "~",
  ["bpm", "tempo", "beats per minute", "music tempo", "metronome"],
  [
    '{ name: "bpm", label: "Tempo (BPM)", type: "number", min: 20, max: 300, defaultValue: 120 }',
    '{ name: "beatsPerMeasure", label: "Beats Per Measure", type: "select", options: [{ value: "3", label: "3/4 (Waltz)" }, { value: "4", label: "4/4 (Common)" }, { value: "6", label: "6/8 (Compound)" }, { value: "5", label: "5/4 (Odd)" }], defaultValue: "4" }',
    '{ name: "measures", label: "Number of Measures", type: "number", min: 1, max: 500, defaultValue: 32 }'
  ],
  `(inputs) => {
    const bpm = inputs.bpm as number;
    const beatsPerMeasure = inputs.beatsPerMeasure as number;
    const measures = inputs.measures as number;
    const msPerBeat = 60000 / bpm;
    const secPerMeasure = (beatsPerMeasure * 60) / bpm;
    const totalBeats = measures * beatsPerMeasure;
    const totalSeconds = totalBeats * (60 / bpm);
    const totalMinutes = totalSeconds / 60;
    let tempoMarking = "Grave";
    if (bpm >= 40) tempoMarking = "Largo";
    if (bpm >= 55) tempoMarking = "Adagio";
    if (bpm >= 70) tempoMarking = "Andante";
    if (bpm >= 90) tempoMarking = "Moderato";
    if (bpm >= 110) tempoMarking = "Allegro";
    if (bpm >= 140) tempoMarking = "Vivace";
    if (bpm >= 170) tempoMarking = "Presto";
    if (bpm >= 200) tempoMarking = "Prestissimo";
    return {
      primary: { label: "Milliseconds Per Beat", value: formatNumber(msPerBeat) + " ms" },
      details: [
        { label: "Tempo Marking", value: tempoMarking },
        { label: "Seconds Per Measure", value: formatNumber(secPerMeasure) + " sec" },
        { label: "Total Duration", value: formatNumber(totalMinutes) + " min" },
        { label: "Total Beats", value: formatNumber(totalBeats) }
      ]
    };
  }`,
  [
    { q: "What is BPM in music?", a: "BPM stands for beats per minute and measures the tempo or speed of a piece of music." },
    { q: "What BPM is standard pop music?", a: "Most pop music falls between 100 and 130 BPM, with 120 BPM being very common." },
    { q: "How do I find the BPM of a song?", a: "You can tap along with the beat using a metronome app or use audio analysis software to detect BPM automatically." }
  ],
  `ms per beat = 60000 / BPM\nDuration = (Measures x Beats Per Measure) / BPM x 60`,
  ["music-key-transposer-calculator", "dj-set-time-planner-calculator", "chord-progression-calculator"]
);

add(
  "music-key-transposer-calculator",
  "Music Key Transposer Calculator",
  "Transpose musical keys up or down by a given number of semitones for any instrument.",
  "Everyday",
  "everyday",
  "~",
  ["transpose", "key change", "semitone", "music key", "transposition"],
  [
    '{ name: "originalKey", label: "Original Key", type: "select", options: [{ value: "0", label: "C" }, { value: "1", label: "C#/Db" }, { value: "2", label: "D" }, { value: "3", label: "D#/Eb" }, { value: "4", label: "E" }, { value: "5", label: "F" }, { value: "6", label: "F#/Gb" }, { value: "7", label: "G" }, { value: "8", label: "G#/Ab" }, { value: "9", label: "A" }, { value: "10", label: "A#/Bb" }, { value: "11", label: "B" }], defaultValue: "0" }',
    '{ name: "semitones", label: "Semitones to Transpose", type: "number", min: -12, max: 12, defaultValue: 5 }',
    '{ name: "scaleType", label: "Scale Type", type: "select", options: [{ value: "1", label: "Major" }, { value: "2", label: "Minor" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const originalKey = inputs.originalKey as number;
    const semitones = inputs.semitones as number;
    const scaleType = inputs.scaleType as number;
    const notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
    const newKeyIndex = ((originalKey + semitones) % 12 + 12) % 12;
    const originalNote = notes[originalKey];
    const newNote = notes[newKeyIndex];
    const scaleLabel = scaleType === 1 ? "Major" : "Minor";
    const relativeIndex = scaleType === 1 ? ((newKeyIndex + 9) % 12) : ((newKeyIndex + 3) % 12);
    const relativeKey = notes[relativeIndex];
    const relativeLabel = scaleType === 1 ? "Relative Minor" : "Relative Major";
    const direction = semitones > 0 ? "Up" : semitones < 0 ? "Down" : "None";
    const interval = Math.abs(semitones);
    return {
      primary: { label: "New Key", value: newNote + " " + scaleLabel },
      details: [
        { label: "Original Key", value: originalNote + " " + scaleLabel },
        { label: "Direction", value: direction + " " + formatNumber(interval) + " semitones" },
        { label: relativeLabel, value: relativeKey },
        { label: "Enharmonic Steps", value: formatNumber(interval) }
      ]
    };
  }`,
  [
    { q: "What does transposing a key mean?", a: "Transposing shifts all notes in a piece of music up or down by the same interval, changing the key while preserving the melody." },
    { q: "How many semitones are in an octave?", a: "There are 12 semitones in one octave on the chromatic scale." },
    { q: "Why would you transpose music?", a: "Common reasons include matching a singer's vocal range, accommodating transposing instruments like Bb trumpet, or making a piece easier to play." }
  ],
  `New Key Index = (Original Key + Semitones) mod 12`,
  ["bpm-tempo-calculator", "chord-progression-calculator", "guitar-string-gauge-calculator"]
);

add(
  "chord-progression-calculator",
  "Chord Progression Calculator",
  "Generate common chord progressions in any key with Roman numeral analysis for songwriting.",
  "Everyday",
  "everyday",
  "~",
  ["chord progression", "songwriting", "chords", "harmony", "music theory"],
  [
    '{ name: "rootKey", label: "Root Key", type: "select", options: [{ value: "0", label: "C" }, { value: "2", label: "D" }, { value: "4", label: "E" }, { value: "5", label: "F" }, { value: "7", label: "G" }, { value: "9", label: "A" }, { value: "11", label: "B" }], defaultValue: "0" }',
    '{ name: "progression", label: "Progression Type", type: "select", options: [{ value: "1", label: "I-IV-V-I (Classic)" }, { value: "2", label: "I-V-vi-IV (Pop)" }, { value: "3", label: "ii-V-I (Jazz)" }, { value: "4", label: "I-vi-IV-V (50s)" }, { value: "5", label: "vi-IV-I-V (Modern)" }], defaultValue: "2" }',
    '{ name: "bpm", label: "Tempo (BPM)", type: "number", min: 40, max: 240, defaultValue: 120 }'
  ],
  `(inputs) => {
    const rootKey = inputs.rootKey as number;
    const progression = inputs.progression as number;
    const bpm = inputs.bpm as number;
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const majorScale = [0, 2, 4, 5, 7, 9, 11];
    const getNote = (degree) => notes[(rootKey + majorScale[degree]) % 12];
    let chords = [];
    let roman = "";
    if (progression === 1) { chords = [getNote(0), getNote(3), getNote(4), getNote(0)]; roman = "I - IV - V - I"; }
    else if (progression === 2) { chords = [getNote(0), getNote(4), getNote(5) + "m", getNote(3)]; roman = "I - V - vi - IV"; }
    else if (progression === 3) { chords = [getNote(1) + "m", getNote(4), getNote(0)]; roman = "ii - V - I"; }
    else if (progression === 4) { chords = [getNote(0), getNote(5) + "m", getNote(3), getNote(4)]; roman = "I - vi - IV - V"; }
    else { chords = [getNote(5) + "m", getNote(3), getNote(0), getNote(4)]; roman = "vi - IV - I - V"; }
    const chordsStr = chords.join(" - ");
    const beatsPerChord = 4;
    const secPerChord = (beatsPerChord * 60) / bpm;
    const loopDuration = secPerChord * chords.length;
    return {
      primary: { label: "Chord Progression", value: chordsStr },
      details: [
        { label: "Roman Numerals", value: roman },
        { label: "Key", value: notes[rootKey] + " Major" },
        { label: "Seconds Per Chord", value: formatNumber(secPerChord) + " sec" },
        { label: "Loop Duration", value: formatNumber(loopDuration) + " sec" }
      ]
    };
  }`,
  [
    { q: "What is the most popular chord progression?", a: "The I-V-vi-IV progression is the most widely used in modern pop music, used in hundreds of hit songs." },
    { q: "What is a ii-V-I progression?", a: "It is the most important chord progression in jazz, creating strong harmonic motion toward the tonic." },
    { q: "Do I need to know music theory to write songs?", a: "While not required, understanding chord progressions can help you write more compelling and harmonically interesting music." }
  ],
  `Chords derived from scale degrees of the selected key\nLoop Duration = (Beats Per Chord x Chords) / BPM x 60`,
  ["music-key-transposer-calculator", "bpm-tempo-calculator", "music-royalty-split-calculator"]
);

add(
  "speaker-wattage-calculator",
  "Speaker Wattage Calculator",
  "Determine the right speaker wattage for your room or venue based on size and use case.",
  "Everyday",
  "everyday",
  "~",
  ["speaker", "wattage", "power", "amplifier", "audio"],
  [
    '{ name: "roomArea", label: "Room Area (sq ft)", type: "number", min: 50, max: 50000, defaultValue: 300 }',
    '{ name: "usage", label: "Usage Type", type: "select", options: [{ value: "1", label: "Background Music" }, { value: "2", label: "Home Listening" }, { value: "3", label: "Party / DJ" }, { value: "4", label: "Live Band / Venue" }], defaultValue: "2" }',
    '{ name: "speakerSensitivity", label: "Speaker Sensitivity (dB)", type: "number", min: 80, max: 105, defaultValue: 89 }',
    '{ name: "targetSPL", label: "Target Volume (dB SPL)", type: "number", min: 70, max: 120, defaultValue: 85 }'
  ],
  `(inputs) => {
    const roomArea = inputs.roomArea as number;
    const usage = inputs.usage as number;
    const sensitivity = inputs.speakerSensitivity as number;
    const targetSPL = inputs.targetSPL as number;
    const distanceM = Math.sqrt(roomArea * 0.0929) / 2;
    const distanceLoss = 20 * Math.log10(distanceM);
    const requiredPowerDB = targetSPL - sensitivity + distanceLoss;
    const watts = Math.pow(10, requiredPowerDB / 10);
    const recommendedWatts = Math.ceil(watts * 1.5);
    const ampHeadroom = Math.ceil(recommendedWatts * 1.25);
    const usageLabels = ["", "Background Music", "Home Listening", "Party / DJ", "Live Band / Venue"];
    return {
      primary: { label: "Recommended Speaker Power", value: formatNumber(recommendedWatts) + " W" },
      details: [
        { label: "Minimum Power Needed", value: formatNumber(Math.ceil(watts)) + " W" },
        { label: "Recommended Amp Power", value: formatNumber(ampHeadroom) + " W" },
        { label: "Listening Distance", value: formatNumber(distanceM) + " m" },
        { label: "Usage Type", value: usageLabels[usage] }
      ]
    };
  }`,
  [
    { q: "How many watts do I need for a room?", a: "For home listening, 20-50 watts per channel is usually sufficient for rooms up to 400 square feet." },
    { q: "Does higher wattage mean louder speakers?", a: "Not necessarily. Speaker sensitivity matters more. A 3dB increase in sensitivity is equivalent to doubling the power." },
    { q: "Should my amp be more powerful than my speakers?", a: "Your amplifier should be rated slightly above your speaker capacity to provide headroom without distortion." }
  ],
  `Required Power (dB) = Target SPL - Sensitivity + 20 * log10(distance)\nWatts = 10^(Power dB / 10)`,
  ["speaker-room-size-calculator", "subwoofer-box-volume-calculator", "concert-venue-capacity-calculator"]
);

add(
  "concert-ticket-value-calculator",
  "Concert Ticket Value Calculator",
  "Evaluate whether a concert ticket price offers good value based on show length, artists, and extras.",
  "Finance",
  "finance",
  "$",
  ["concert", "ticket", "value", "entertainment", "live music"],
  [
    '{ name: "ticketPrice", label: "Ticket Price ($)", type: "number", min: 10, max: 5000, defaultValue: 85 }',
    '{ name: "showHours", label: "Expected Show Length (hours)", type: "number", min: 0.5, max: 8, defaultValue: 2.5 }',
    '{ name: "numArtists", label: "Number of Acts", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "travelCost", label: "Travel & Parking ($)", type: "number", min: 0, max: 500, defaultValue: 30 }',
    '{ name: "foodDrink", label: "Estimated Food & Drink ($)", type: "number", min: 0, max: 500, defaultValue: 40 }'
  ],
  `(inputs) => {
    const ticketPrice = inputs.ticketPrice as number;
    const showHours = inputs.showHours as number;
    const numArtists = inputs.numArtists as number;
    const travelCost = inputs.travelCost as number;
    const foodDrink = inputs.foodDrink as number;
    const totalCost = ticketPrice + travelCost + foodDrink;
    const costPerHour = totalCost / showHours;
    const costPerAct = totalCost / numArtists;
    const costPerMinute = totalCost / (showHours * 60);
    const movieEquivalent = totalCost / 15;
    return {
      primary: { label: "Cost Per Hour of Entertainment", value: "$" + formatNumber(costPerHour) },
      details: [
        { label: "Total Evening Cost", value: "$" + formatNumber(totalCost) },
        { label: "Cost Per Act", value: "$" + formatNumber(costPerAct) },
        { label: "Cost Per Minute", value: "$" + formatNumber(costPerMinute) },
        { label: "Equivalent Movie Tickets", value: formatNumber(movieEquivalent) }
      ]
    };
  }`,
  [
    { q: "How do you determine if a concert ticket is worth it?", a: "Divide total cost by hours of entertainment. Under $30 per hour is generally good value compared to other entertainment." },
    { q: "What is the average concert ticket price?", a: "Average concert ticket prices range from $50 to $150, though top artists can command $200 or more." },
    { q: "Should I factor in travel costs?", a: "Yes, travel, parking, food, and drinks can easily double the cost of attending a concert." }
  ],
  `Cost Per Hour = (Ticket + Travel + Food) / Show Hours`,
  ["concert-venue-capacity-calculator", "dj-set-time-planner-calculator", "music-streaming-revenue-calculator"]
);

add(
  "music-streaming-revenue-calculator",
  "Music Streaming Revenue Calculator",
  "Estimate earnings from music streams across major platforms like Spotify, Apple Music, and YouTube.",
  "Finance",
  "finance",
  "$",
  ["streaming", "Spotify", "Apple Music", "revenue", "music income", "royalties"],
  [
    '{ name: "streams", label: "Total Monthly Streams", type: "number", min: 100, max: 100000000, defaultValue: 50000 }',
    '{ name: "platform", label: "Primary Platform", type: "select", options: [{ value: "1", label: "Spotify ($0.004/stream)" }, { value: "2", label: "Apple Music ($0.008/stream)" }, { value: "3", label: "YouTube Music ($0.002/stream)" }, { value: "4", label: "Tidal ($0.013/stream)" }], defaultValue: "1" }',
    '{ name: "distributorCut", label: "Distributor Cut (%)", type: "number", min: 0, max: 50, defaultValue: 15 }',
    '{ name: "splitMembers", label: "Band Members Splitting", type: "number", min: 1, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const streams = inputs.streams as number;
    const platform = inputs.platform as number;
    const distributorCut = inputs.distributorCut as number;
    const splitMembers = inputs.splitMembers as number;
    const rates = [0, 0.004, 0.008, 0.002, 0.013];
    const rate = rates[platform];
    const grossRevenue = streams * rate;
    const afterDistributor = grossRevenue * (1 - distributorCut / 100);
    const perMember = afterDistributor / splitMembers;
    const annualRevenue = perMember * 12;
    const streamsForMinWage = Math.ceil((1257 / rate) / (1 - distributorCut / 100));
    return {
      primary: { label: "Monthly Revenue Per Member", value: "$" + formatNumber(perMember) },
      details: [
        { label: "Gross Monthly Revenue", value: "$" + formatNumber(grossRevenue) },
        { label: "After Distributor Cut", value: "$" + formatNumber(afterDistributor) },
        { label: "Estimated Annual Revenue", value: "$" + formatNumber(annualRevenue) },
        { label: "Streams Needed for Min Wage", value: formatNumber(streamsForMinWage) }
      ]
    };
  }`,
  [
    { q: "How much does Spotify pay per stream?", a: "Spotify pays approximately $0.003 to $0.005 per stream depending on the listener's country and subscription type." },
    { q: "Which streaming service pays artists the most?", a: "Tidal typically pays the most per stream at around $0.013, followed by Apple Music at approximately $0.008." },
    { q: "How many streams do you need to make a living?", a: "On Spotify, you would need roughly 300,000-400,000 streams per month to earn US minimum wage." }
  ],
  `Revenue = Streams x Rate Per Stream x (1 - Distributor %)\nPer Member = Revenue / Members`,
  ["music-royalty-split-calculator", "podcast-production-cost-calculator", "album-production-budget-calculator"]
);

add(
  "dj-set-time-planner-calculator",
  "DJ Set Time Planner Calculator",
  "Plan your DJ set with track counts, transitions, and energy flow based on set length and genre.",
  "Everyday",
  "everyday",
  "~",
  ["DJ", "set time", "tracklist", "mixing", "playlist"],
  [
    '{ name: "setLength", label: "Set Length (minutes)", type: "number", min: 15, max: 480, defaultValue: 60 }',
    '{ name: "avgTrackLength", label: "Avg Track Length (minutes)", type: "number", min: 2, max: 10, defaultValue: 4 }',
    '{ name: "transitionLength", label: "Avg Transition (seconds)", type: "number", min: 5, max: 60, defaultValue: 16 }',
    '{ name: "genre", label: "Genre", type: "select", options: [{ value: "1", label: "House / Techno" }, { value: "2", label: "Hip-Hop / R&B" }, { value: "3", label: "EDM / Festival" }, { value: "4", label: "Open Format" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const setLength = inputs.setLength as number;
    const avgTrackLength = inputs.avgTrackLength as number;
    const transitionLength = inputs.transitionLength as number;
    const genre = inputs.genre as number;
    const transitionMin = transitionLength / 60;
    const effectiveTrackTime = avgTrackLength - transitionMin;
    const totalTracks = Math.ceil(setLength / effectiveTrackTime);
    const prepTracks = Math.ceil(totalTracks * 1.5);
    const totalTransitions = totalTracks - 1;
    const genreLabels = ["", "House / Techno", "Hip-Hop / R&B", "EDM / Festival", "Open Format"];
    const bpmRanges = ["", "120-135 BPM", "85-115 BPM", "125-150 BPM", "80-140 BPM"];
    return {
      primary: { label: "Tracks Needed", value: formatNumber(totalTracks) },
      details: [
        { label: "Prepare at Least", value: formatNumber(prepTracks) + " tracks" },
        { label: "Total Transitions", value: formatNumber(totalTransitions) },
        { label: "Genre", value: genreLabels[genre] },
        { label: "Typical BPM Range", value: bpmRanges[genre] }
      ]
    };
  }`,
  [
    { q: "How many songs do I need for a 1-hour DJ set?", a: "For a typical 1-hour set, plan for 15-20 tracks depending on track length and how long you mix transitions." },
    { q: "How long should DJ transitions be?", a: "Transitions vary by genre: house music uses 16-32 beat mixes while hip-hop may use quick 4-8 beat cuts." },
    { q: "Should I prepare extra tracks?", a: "Always prepare 1.5 to 2 times the tracks you plan to play to allow flexibility and read the crowd." }
  ],
  `Tracks = Set Length / (Avg Track Length - Transition Length)\nPrep Tracks = Tracks x 1.5`,
  ["bpm-tempo-calculator", "concert-ticket-value-calculator", "music-streaming-revenue-calculator"]
);

add(
  "audio-bitrate-file-size-calculator",
  "Audio Bitrate File Size Calculator",
  "Calculate audio file sizes based on bitrate, sample rate, duration, and format.",
  "Conversion",
  "conversion",
  "R",
  ["audio", "bitrate", "file size", "mp3", "wav", "flac"],
  [
    '{ name: "duration", label: "Duration (minutes)", type: "number", min: 0.5, max: 600, defaultValue: 4 }',
    '{ name: "format", label: "Audio Format", type: "select", options: [{ value: "1", label: "MP3 (128 kbps)" }, { value: "2", label: "MP3 (320 kbps)" }, { value: "3", label: "WAV (16-bit/44.1kHz)" }, { value: "4", label: "FLAC (Lossless)" }, { value: "5", label: "AAC (256 kbps)" }], defaultValue: "2" }',
    '{ name: "numTracks", label: "Number of Tracks", type: "number", min: 1, max: 500, defaultValue: 12 }'
  ],
  `(inputs) => {
    const duration = inputs.duration as number;
    const format = inputs.format as number;
    const numTracks = inputs.numTracks as number;
    const bitrates = [0, 128, 320, 1411, 900, 256];
    const formatLabels = ["", "MP3 128kbps", "MP3 320kbps", "WAV 16-bit", "FLAC Lossless", "AAC 256kbps"];
    const bitrate = bitrates[format];
    const fileSizeMB = (bitrate * duration * 60) / 8 / 1024;
    const totalSizeMB = fileSizeMB * numTracks;
    const totalSizeGB = totalSizeMB / 1024;
    const totalDuration = duration * numTracks;
    return {
      primary: { label: "File Size Per Track", value: formatNumber(fileSizeMB) + " MB" },
      details: [
        { label: "Format", value: formatLabels[format] },
        { label: "Total Size (" + numTracks + " tracks)", value: totalSizeGB >= 1 ? formatNumber(totalSizeGB) + " GB" : formatNumber(totalSizeMB) + " MB" },
        { label: "Bitrate", value: formatNumber(bitrate) + " kbps" },
        { label: "Total Duration", value: formatNumber(totalDuration) + " min" }
      ]
    };
  }`,
  [
    { q: "How big is a 3-minute MP3 file?", a: "At 320 kbps, a 3-minute MP3 is approximately 7.2 MB. At 128 kbps it is about 2.9 MB." },
    { q: "What is the difference between lossy and lossless audio?", a: "Lossy formats like MP3 discard some audio data to reduce size, while lossless formats like FLAC preserve all original audio data." },
    { q: "What bitrate should I use for music?", a: "For high quality listening, 320 kbps MP3 or 256 kbps AAC are excellent. Audiophiles prefer FLAC or WAV for lossless quality." }
  ],
  `File Size (MB) = (Bitrate kbps x Duration sec) / 8 / 1024`,
  ["podcast-production-cost-calculator", "album-production-budget-calculator", "music-streaming-revenue-calculator"]
);

add(
  "vinyl-record-value-calculator",
  "Vinyl Record Value Calculator",
  "Estimate the collectible value of a vinyl record based on condition, pressing, and rarity.",
  "Finance",
  "finance",
  "$",
  ["vinyl", "record", "collectible", "value", "LP", "pressing"],
  [
    '{ name: "basePrice", label: "Original/Catalog Price ($)", type: "number", min: 1, max: 1000, defaultValue: 25 }',
    '{ name: "condition", label: "Record Condition", type: "select", options: [{ value: "5", label: "Mint (M)" }, { value: "4", label: "Near Mint (NM)" }, { value: "3", label: "Very Good Plus (VG+)" }, { value: "2", label: "Very Good (VG)" }, { value: "1", label: "Good (G)" }], defaultValue: "3" }',
    '{ name: "pressing", label: "Pressing Type", type: "select", options: [{ value: "3", label: "First Pressing" }, { value: "2", label: "Early Reissue" }, { value: "1.2", label: "Modern Reissue" }, { value: "4", label: "Limited/Colored" }], defaultValue: "1.2" }',
    '{ name: "age", label: "Age (years)", type: "number", min: 0, max: 80, defaultValue: 30 }'
  ],
  `(inputs) => {
    const basePrice = inputs.basePrice as number;
    const condition = inputs.condition as number;
    const pressing = inputs.pressing as number;
    const age = inputs.age as number;
    const conditionMultiplier = condition / 3;
    const ageMultiplier = 1 + (age * 0.02);
    const estimatedValue = basePrice * conditionMultiplier * pressing * ageMultiplier;
    const conditionLabels = { 5: "Mint", 4: "Near Mint", 3: "VG+", 2: "VG", 1: "Good" };
    const appreciation = ((estimatedValue - basePrice) / basePrice) * 100;
    return {
      primary: { label: "Estimated Value", value: "$" + formatNumber(estimatedValue) },
      details: [
        { label: "Condition Grade", value: conditionLabels[condition] || "Unknown" },
        { label: "Pressing Multiplier", value: formatNumber(pressing) + "x" },
        { label: "Age Factor", value: formatNumber(ageMultiplier) + "x" },
        { label: "Value Appreciation", value: formatNumber(appreciation) + "%" }
      ]
    };
  }`,
  [
    { q: "What makes a vinyl record valuable?", a: "First pressings, limited editions, condition, and cultural significance are the primary factors that determine a record's value." },
    { q: "How does condition affect vinyl value?", a: "Condition is the biggest factor. A Mint record can be worth 5-10 times more than the same record in Good condition." },
    { q: "Are colored vinyl records worth more?", a: "Limited colored pressings often carry a premium, especially if the run was small and the album is popular." }
  ],
  `Estimated Value = Base Price x Condition Multiplier x Pressing Multiplier x Age Factor`,
  ["instrument-depreciation-calculator", "concert-ticket-value-calculator", "album-production-budget-calculator"]
);

add(
  "guitar-string-gauge-calculator",
  "Guitar String Gauge Calculator",
  "Find the right guitar string gauge and tension for your tuning and scale length.",
  "Everyday",
  "everyday",
  "~",
  ["guitar", "string gauge", "tension", "tuning", "guitar strings"],
  [
    '{ name: "scaleLength", label: "Scale Length (inches)", type: "number", min: 20, max: 30, defaultValue: 25.5 }',
    '{ name: "tuning", label: "Tuning", type: "select", options: [{ value: "1", label: "Standard (E)" }, { value: "2", label: "Half Step Down (Eb)" }, { value: "3", label: "Drop D" }, { value: "4", label: "Full Step Down (D)" }, { value: "5", label: "Drop C" }], defaultValue: "1" }',
    '{ name: "playStyle", label: "Playing Style", type: "select", options: [{ value: "1", label: "Light (9-42)" }, { value: "2", label: "Regular (10-46)" }, { value: "3", label: "Medium (11-49)" }, { value: "4", label: "Heavy (12-54)" }], defaultValue: "2" }',
    '{ name: "stringCount", label: "Number of Strings", type: "select", options: [{ value: "6", label: "6 String" }, { value: "7", label: "7 String" }, { value: "8", label: "8 String" }], defaultValue: "6" }'
  ],
  `(inputs) => {
    const scaleLength = inputs.scaleLength as number;
    const tuning = inputs.tuning as number;
    const playStyle = inputs.playStyle as number;
    const stringCount = inputs.stringCount as number;
    const gauges = { 1: "9-42", 2: "10-46", 3: "11-49", 4: "12-54" };
    const tensionBase = { 1: 14.5, 2: 17.5, 3: 21, 4: 24.5 };
    const tuningFactor = { 1: 1, 2: 0.94, 3: 0.95, 4: 0.89, 5: 0.84 };
    const tuningLabels = { 1: "Standard E", 2: "Eb Standard", 3: "Drop D", 4: "D Standard", 5: "Drop C" };
    const tension = tensionBase[playStyle] * tuningFactor[tuning] * (scaleLength / 25.5);
    const totalTension = tension * stringCount;
    const gaugeSet = gauges[playStyle];
    const recommendation = tuning >= 4 && playStyle < 3 ? "Consider heavier gauge for lower tunings" : "Good match for this tuning";
    return {
      primary: { label: "Recommended Gauge Set", value: gaugeSet },
      details: [
        { label: "Avg String Tension", value: formatNumber(tension) + " lbs" },
        { label: "Total Neck Tension", value: formatNumber(totalTension) + " lbs" },
        { label: "Tuning", value: tuningLabels[tuning] },
        { label: "Recommendation", value: recommendation }
      ]
    };
  }`,
  [
    { q: "What guitar string gauge should I use?", a: "Beginners and players who do lots of bending prefer lighter gauges (9-42). Rhythm players and lower tunings benefit from heavier gauges." },
    { q: "Does scale length affect string tension?", a: "Yes, longer scale lengths produce higher tension for the same gauge. A 25.5 inch Fender has more tension than a 24.75 inch Gibson." },
    { q: "Should I use heavier strings for drop tuning?", a: "Yes, heavier strings help maintain tension and prevent buzzing when tuning down." }
  ],
  `String Tension = Base Tension x Tuning Factor x (Scale Length / 25.5)`,
  ["drum-tuning-frequency-calculator", "instrument-depreciation-calculator", "music-key-transposer-calculator"]
);

add(
  "drum-tuning-frequency-calculator",
  "Drum Tuning Frequency Calculator",
  "Calculate the fundamental frequency and interval for drum tuning across your kit.",
  "Science",
  "science",
  "A",
  ["drum tuning", "frequency", "drum pitch", "percussion", "drum head"],
  [
    '{ name: "drumDiameter", label: "Drum Diameter (inches)", type: "number", min: 6, max: 26, defaultValue: 14 }',
    '{ name: "drumType", label: "Drum Type", type: "select", options: [{ value: "1", label: "Snare" }, { value: "2", label: "Rack Tom" }, { value: "3", label: "Floor Tom" }, { value: "4", label: "Bass Drum" }], defaultValue: "1" }',
    '{ name: "tuningStyle", label: "Tuning Style", type: "select", options: [{ value: "1", label: "Jazz (Higher)" }, { value: "2", label: "Rock (Medium)" }, { value: "3", label: "Metal (Lower)" }], defaultValue: "2" }',
    '{ name: "headType", label: "Head Type", type: "select", options: [{ value: "1", label: "Single Ply (Brighter)" }, { value: "2", label: "Double Ply (Warmer)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const diameter = inputs.drumDiameter as number;
    const drumType = inputs.drumType as number;
    const tuningStyle = inputs.tuningStyle as number;
    const headType = inputs.headType as number;
    const baseFreqs = { 1: 200, 2: 170, 3: 100, 4: 60 };
    const tuningMult = { 1: 1.2, 2: 1.0, 3: 0.8 };
    const headMult = { 1: 1.05, 2: 0.95 };
    const sizeRef = { 1: 14, 2: 12, 3: 16, 4: 22 };
    const refDiam = sizeRef[drumType];
    const freq = baseFreqs[drumType] * (refDiam / diameter) * tuningMult[tuningStyle] * headMult[headType];
    const drumLabels = { 1: "Snare", 2: "Rack Tom", 3: "Floor Tom", 4: "Bass Drum" };
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const midiNote = 12 * Math.log2(freq / 440) + 69;
    const nearestNote = noteNames[Math.round(midiNote) % 12];
    const octave = Math.floor(Math.round(midiNote) / 12) - 1;
    return {
      primary: { label: "Target Frequency", value: formatNumber(freq) + " Hz" },
      details: [
        { label: "Nearest Note", value: nearestNote + octave },
        { label: "Drum Type", value: drumLabels[drumType] },
        { label: "Diameter", value: formatNumber(diameter) + " inches" },
        { label: "MIDI Note", value: formatNumber(Math.round(midiNote)) }
      ]
    };
  }`,
  [
    { q: "What frequency should I tune my snare to?", a: "A 14-inch snare is typically tuned between 180-250 Hz depending on the style. Jazz players tune higher, metal drummers lower." },
    { q: "How do I tune drums by ear?", a: "Tap near each lug and adjust until each point produces the same pitch, then adjust overall tension for desired pitch." },
    { q: "Should toms be tuned to specific notes?", a: "Many drummers tune toms in musical intervals such as thirds or fourths for a melodic sound across the kit." }
  ],
  `Frequency = Base Freq x (Ref Diameter / Actual Diameter) x Tuning x Head Factor`,
  ["guitar-string-gauge-calculator", "bpm-tempo-calculator", "equalizer-frequency-calculator"]
);

add(
  "studio-recording-cost-calculator",
  "Studio Recording Cost Calculator",
  "Estimate the total cost of recording a song or album at a professional studio.",
  "Finance",
  "finance",
  "$",
  ["studio", "recording", "cost", "music production", "session"],
  [
    '{ name: "studioRate", label: "Studio Hourly Rate ($)", type: "number", min: 20, max: 500, defaultValue: 75 }',
    '{ name: "hoursPerSong", label: "Hours Per Song", type: "number", min: 1, max: 40, defaultValue: 6 }',
    '{ name: "numSongs", label: "Number of Songs", type: "number", min: 1, max: 30, defaultValue: 10 }',
    '{ name: "mixingRate", label: "Mixing Cost Per Song ($)", type: "number", min: 50, max: 2000, defaultValue: 200 }',
    '{ name: "masteringRate", label: "Mastering Cost Per Song ($)", type: "number", min: 30, max: 500, defaultValue: 100 }'
  ],
  `(inputs) => {
    const studioRate = inputs.studioRate as number;
    const hoursPerSong = inputs.hoursPerSong as number;
    const numSongs = inputs.numSongs as number;
    const mixingRate = inputs.mixingRate as number;
    const masteringRate = inputs.masteringRate as number;
    const trackingCost = studioRate * hoursPerSong * numSongs;
    const mixingCost = mixingRate * numSongs;
    const masteringCost = masteringRate * numSongs;
    const totalCost = trackingCost + mixingCost + masteringCost;
    const costPerSong = totalCost / numSongs;
    const totalHours = hoursPerSong * numSongs;
    return {
      primary: { label: "Total Production Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Tracking Cost", value: "$" + formatNumber(trackingCost) },
        { label: "Mixing Cost", value: "$" + formatNumber(mixingCost) },
        { label: "Mastering Cost", value: "$" + formatNumber(masteringCost) },
        { label: "Cost Per Song", value: "$" + formatNumber(costPerSong) },
        { label: "Total Studio Hours", value: formatNumber(totalHours) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to record a song?", a: "Recording a professional song typically costs $300 to $2,000 including tracking, mixing, and mastering." },
    { q: "What is the difference between mixing and mastering?", a: "Mixing balances individual tracks into a stereo mix. Mastering polishes the final mix for consistent playback across all systems." },
    { q: "How long does it take to record a song?", a: "A well-rehearsed song can be tracked in 4-8 hours. Complex productions may require 20+ hours." }
  ],
  `Total = (Studio Rate x Hours x Songs) + (Mixing x Songs) + (Mastering x Songs)`,
  ["album-production-budget-calculator", "music-streaming-revenue-calculator", "podcast-production-cost-calculator"]
);

add(
  "album-production-budget-calculator",
  "Album Production Budget Calculator",
  "Plan your complete album budget including recording, artwork, distribution, and marketing.",
  "Finance",
  "finance",
  "$",
  ["album", "budget", "production", "music release", "indie"],
  [
    '{ name: "recordingCost", label: "Total Recording Cost ($)", type: "number", min: 500, max: 100000, defaultValue: 5000 }',
    '{ name: "artworkCost", label: "Album Artwork ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }',
    '{ name: "distributionCost", label: "Distribution Fee ($)", type: "number", min: 0, max: 1000, defaultValue: 50 }',
    '{ name: "marketingBudget", label: "Marketing Budget ($)", type: "number", min: 0, max: 50000, defaultValue: 1000 }',
    '{ name: "musicVideoCost", label: "Music Video Cost ($)", type: "number", min: 0, max: 50000, defaultValue: 2000 }'
  ],
  `(inputs) => {
    const recordingCost = inputs.recordingCost as number;
    const artworkCost = inputs.artworkCost as number;
    const distributionCost = inputs.distributionCost as number;
    const marketingBudget = inputs.marketingBudget as number;
    const musicVideoCost = inputs.musicVideoCost as number;
    const totalBudget = recordingCost + artworkCost + distributionCost + marketingBudget + musicVideoCost;
    const recordingPct = (recordingCost / totalBudget) * 100;
    const marketingPct = (marketingBudget / totalBudget) * 100;
    const streamsToRecoup = Math.ceil(totalBudget / 0.004);
    return {
      primary: { label: "Total Album Budget", value: "$" + formatNumber(totalBudget) },
      details: [
        { label: "Recording", value: "$" + formatNumber(recordingCost) + " (" + formatNumber(recordingPct) + "%)" },
        { label: "Marketing", value: "$" + formatNumber(marketingBudget) + " (" + formatNumber(marketingPct) + "%)" },
        { label: "Music Video", value: "$" + formatNumber(musicVideoCost) },
        { label: "Streams to Recoup (Spotify)", value: formatNumber(streamsToRecoup) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to produce an album?", a: "Indie albums typically cost $5,000 to $25,000. Professional major label albums can cost $100,000 or more." },
    { q: "What percentage should go to marketing?", a: "Industry standard suggests spending 20-30% of your total album budget on marketing and promotion." },
    { q: "Is a music video worth the investment?", a: "Music videos significantly boost engagement and streaming numbers. Even a low-budget video can increase visibility." }
  ],
  `Total Budget = Recording + Artwork + Distribution + Marketing + Music Video`,
  ["studio-recording-cost-calculator", "music-streaming-revenue-calculator", "music-royalty-split-calculator"]
);

add(
  "instrument-depreciation-calculator",
  "Instrument Depreciation Calculator",
  "Estimate how much a musical instrument depreciates over time based on type and condition.",
  "Finance",
  "finance",
  "$",
  ["instrument", "depreciation", "value", "resale", "musical instrument"],
  [
    '{ name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 50, max: 200000, defaultValue: 1500 }',
    '{ name: "yearsOwned", label: "Years Owned", type: "number", min: 0, max: 50, defaultValue: 5 }',
    '{ name: "instrumentType", label: "Instrument Type", type: "select", options: [{ value: "1", label: "Electric Guitar/Bass" }, { value: "2", label: "Acoustic Guitar" }, { value: "3", label: "Piano/Keyboard" }, { value: "4", label: "Drums" }, { value: "5", label: "Vintage/Collectible" }], defaultValue: "1" }',
    '{ name: "condition", label: "Current Condition", type: "select", options: [{ value: "1", label: "Excellent" }, { value: "0.85", label: "Good" }, { value: "0.7", label: "Fair" }, { value: "0.5", label: "Poor" }], defaultValue: "0.85" }'
  ],
  `(inputs) => {
    const purchasePrice = inputs.purchasePrice as number;
    const yearsOwned = inputs.yearsOwned as number;
    const instrumentType = inputs.instrumentType as number;
    const condition = inputs.condition as number;
    const depRates = { 1: 0.07, 2: 0.05, 3: 0.08, 4: 0.09, 5: -0.03 };
    const annualRate = depRates[instrumentType] || 0.07;
    let currentValue;
    if (annualRate < 0) {
      currentValue = purchasePrice * Math.pow(1 + Math.abs(annualRate), yearsOwned) * condition;
    } else {
      currentValue = purchasePrice * Math.pow(1 - annualRate, yearsOwned) * condition;
    }
    const totalDepreciation = purchasePrice - currentValue;
    const percentLost = (totalDepreciation / purchasePrice) * 100;
    const typeLabels = { 1: "Electric Guitar/Bass", 2: "Acoustic Guitar", 3: "Piano/Keyboard", 4: "Drums", 5: "Vintage/Collectible" };
    return {
      primary: { label: "Current Estimated Value", value: "$" + formatNumber(currentValue) },
      details: [
        { label: "Original Price", value: "$" + formatNumber(purchasePrice) },
        { label: "Total Change", value: "$" + formatNumber(Math.abs(totalDepreciation)) + (totalDepreciation < 0 ? " (Gain)" : " (Loss)") },
        { label: "Percentage Change", value: formatNumber(Math.abs(percentLost)) + "%" },
        { label: "Instrument Type", value: typeLabels[instrumentType] }
      ]
    };
  }`,
  [
    { q: "Do musical instruments lose value?", a: "Most instruments depreciate 5-10% annually, but vintage and high-end instruments can appreciate significantly." },
    { q: "Which instruments hold their value best?", a: "Acoustic guitars and vintage instruments tend to hold value best. Quality brand-name instruments depreciate less." },
    { q: "When does an instrument become vintage?", a: "Generally instruments over 20-30 years old are considered vintage, and those over 50 years may be called antique." }
  ],
  `Current Value = Purchase Price x (1 - Depreciation Rate)^Years x Condition Factor`,
  ["vinyl-record-value-calculator", "guitar-string-gauge-calculator", "concert-ticket-value-calculator"]
);

add(
  "speaker-room-size-calculator",
  "Speaker Room Size Calculator",
  "Determine the ideal speaker placement and count for optimal room coverage.",
  "Everyday",
  "everyday",
  "~",
  ["speaker placement", "room size", "audio", "surround sound", "home theater"],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 5, max: 100, defaultValue: 20 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 5, max: 100, defaultValue: 15 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 20, defaultValue: 9 }',
    '{ name: "purpose", label: "Purpose", type: "select", options: [{ value: "1", label: "Stereo Music" }, { value: "2", label: "Home Theater 5.1" }, { value: "3", label: "Home Theater 7.1" }, { value: "4", label: "Whole Room Background" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const length = inputs.roomLength as number;
    const width = inputs.roomWidth as number;
    const ceilingHeight = inputs.ceilingHeight as number;
    const purpose = inputs.purpose as number;
    const area = length * width;
    const volume = area * ceilingHeight;
    const speakerCounts = { 1: 2, 2: 6, 3: 8, 4: Math.ceil(area / 150) * 2 };
    const speakers = speakerCounts[purpose];
    const idealDistance = length * 0.38;
    const listenerDistance = length * 0.62;
    const purposeLabels = { 1: "Stereo Music", 2: "Home Theater 5.1", 3: "Home Theater 7.1", 4: "Whole Room Background" };
    const minWatts = Math.ceil(area * 0.5);
    return {
      primary: { label: "Recommended Speakers", value: formatNumber(speakers) },
      details: [
        { label: "Room Volume", value: formatNumber(volume) + " cu ft" },
        { label: "Room Area", value: formatNumber(area) + " sq ft" },
        { label: "Speaker Distance from Wall", value: formatNumber(idealDistance) + " ft" },
        { label: "Min Power Per Speaker", value: formatNumber(minWatts) + " W" },
        { label: "Setup Type", value: purposeLabels[purpose] }
      ]
    };
  }`,
  [
    { q: "How far should speakers be from the wall?", a: "Speakers should generally be at least 2-3 feet from walls and about 38% of the room length from the front wall." },
    { q: "What is the ideal room size for a home theater?", a: "A room of 200-400 square feet with 9-10 foot ceilings provides excellent home theater acoustics." },
    { q: "Do I need a subwoofer for a small room?", a: "Even in small rooms, a subwoofer handles low frequencies that regular speakers cannot reproduce effectively." }
  ],
  `Speaker Distance = Room Length x 0.38\nListener Position = Room Length x 0.62`,
  ["speaker-wattage-calculator", "subwoofer-box-volume-calculator", "soundproofing-cost-calculator"]
);

add(
  "subwoofer-box-volume-calculator",
  "Subwoofer Box Volume Calculator",
  "Calculate the optimal sealed or ported enclosure volume for your subwoofer driver.",
  "Science",
  "science",
  "A",
  ["subwoofer", "box volume", "enclosure", "speaker box", "car audio"],
  [
    '{ name: "driverSize", label: "Driver Size (inches)", type: "select", options: [{ value: "8", label: "8 inch" }, { value: "10", label: "10 inch" }, { value: "12", label: "12 inch" }, { value: "15", label: "15 inch" }, { value: "18", label: "18 inch" }], defaultValue: "12" }',
    '{ name: "enclosureType", label: "Enclosure Type", type: "select", options: [{ value: "1", label: "Sealed (Tight Bass)" }, { value: "2", label: "Ported (Louder Bass)" }], defaultValue: "1" }',
    '{ name: "numDrivers", label: "Number of Drivers", type: "number", min: 1, max: 4, defaultValue: 1 }',
    '{ name: "vas", label: "Vas (Equivalent Volume, liters)", type: "number", min: 5, max: 300, defaultValue: 50 }'
  ],
  `(inputs) => {
    const driverSize = inputs.driverSize as number;
    const enclosureType = inputs.enclosureType as number;
    const numDrivers = inputs.numDrivers as number;
    const vas = inputs.vas as number;
    const sealedMultiplier = 0.7;
    const portedMultiplier = 1.5;
    const multiplier = enclosureType === 1 ? sealedMultiplier : portedMultiplier;
    const volumePerDriver = vas * multiplier;
    const totalVolumeLiters = volumePerDriver * numDrivers;
    const totalVolumeCuFt = totalVolumeLiters * 0.0353147;
    const encLabel = enclosureType === 1 ? "Sealed" : "Ported";
    const portDiameter = enclosureType === 2 ? driverSize * 0.4 : 0;
    const portLength = enclosureType === 2 ? Math.round(driverSize * 1.5) : 0;
    return {
      primary: { label: "Total Enclosure Volume", value: formatNumber(totalVolumeCuFt) + " cu ft" },
      details: [
        { label: "Volume in Liters", value: formatNumber(totalVolumeLiters) + " L" },
        { label: "Volume Per Driver", value: formatNumber(volumePerDriver * 0.0353147) + " cu ft" },
        { label: "Enclosure Type", value: encLabel },
        { label: enclosureType === 2 ? "Port Diameter" : "Box Type", value: enclosureType === 2 ? formatNumber(portDiameter) + " inches" : "Sealed - No Port" }
      ]
    };
  }`,
  [
    { q: "Is a sealed or ported subwoofer box better?", a: "Sealed boxes produce tighter, more accurate bass while ported boxes are louder and more efficient but less precise." },
    { q: "Does box volume affect bass quality?", a: "Yes, too small a box makes bass sound thin and boomy, while too large a box reduces output and control." },
    { q: "What size box do I need for a 12-inch sub?", a: "A 12-inch subwoofer typically needs 1.0-1.5 cubic feet sealed or 2.0-3.0 cubic feet ported." }
  ],
  `Sealed Volume = Vas x 0.7 per driver\nPorted Volume = Vas x 1.5 per driver`,
  ["speaker-wattage-calculator", "speaker-room-size-calculator", "microphone-sensitivity-calculator"]
);

add(
  "microphone-sensitivity-calculator",
  "Microphone Sensitivity Calculator",
  "Convert microphone sensitivity between dBV and mV/Pa and calculate output levels.",
  "Science",
  "science",
  "A",
  ["microphone", "sensitivity", "dBV", "preamp", "gain", "audio"],
  [
    '{ name: "sensitivityDBV", label: "Sensitivity (dBV/Pa)", type: "number", min: -70, max: -10, defaultValue: -40 }',
    '{ name: "spl", label: "Sound Pressure Level (dB SPL)", type: "number", min: 40, max: 140, defaultValue: 85 }',
    '{ name: "preampGain", label: "Preamp Gain (dB)", type: "number", min: 0, max: 70, defaultValue: 30 }',
    '{ name: "micType", label: "Microphone Type", type: "select", options: [{ value: "1", label: "Dynamic" }, { value: "2", label: "Condenser (Large)" }, { value: "3", label: "Condenser (Small)" }, { value: "4", label: "Ribbon" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const sensitivityDBV = inputs.sensitivityDBV as number;
    const spl = inputs.spl as number;
    const preampGain = inputs.preampGain as number;
    const micType = inputs.micType as number;
    const mvPerPa = Math.pow(10, sensitivityDBV / 20) * 1000;
    const splPa = Math.pow(10, (spl - 94) / 20);
    const outputVoltage = (mvPerPa / 1000) * splPa;
    const outputDBV = 20 * Math.log10(outputVoltage);
    const afterPreamp = outputDBV + preampGain;
    const micLabels = { 1: "Dynamic", 2: "Large Condenser", 3: "Small Condenser", 4: "Ribbon" };
    const headroom = -afterPreamp;
    return {
      primary: { label: "Output Level (after preamp)", value: formatNumber(afterPreamp) + " dBV" },
      details: [
        { label: "Sensitivity", value: formatNumber(mvPerPa) + " mV/Pa" },
        { label: "Raw Output Voltage", value: formatNumber(outputVoltage * 1000) + " mV" },
        { label: "Mic Type", value: micLabels[micType] },
        { label: "Headroom to Clip", value: formatNumber(Math.abs(headroom)) + " dB" }
      ]
    };
  }`,
  [
    { q: "What is microphone sensitivity?", a: "Sensitivity measures how much electrical output a microphone produces for a given sound pressure, usually measured in dBV/Pa." },
    { q: "Is higher or lower sensitivity better?", a: "Neither is inherently better. Higher sensitivity mics need less gain but may clip on loud sources. Lower sensitivity mics handle louder sounds." },
    { q: "What sensitivity do I need for vocals?", a: "For vocals, a large diaphragm condenser with around -30 to -40 dBV sensitivity is ideal for most recording situations." }
  ],
  `mV/Pa = 10^(dBV/20) x 1000\nOutput = Sensitivity x SPL Pressure x Preamp Gain`,
  ["equalizer-frequency-calculator", "drum-tuning-frequency-calculator", "speaker-wattage-calculator"]
);

add(
  "equalizer-frequency-calculator",
  "Equalizer Frequency Calculator",
  "Find the right EQ frequencies to boost or cut for common instruments and vocals.",
  "Everyday",
  "everyday",
  "~",
  ["EQ", "equalizer", "frequency", "mixing", "audio production"],
  [
    '{ name: "source", label: "Audio Source", type: "select", options: [{ value: "1", label: "Vocals" }, { value: "2", label: "Kick Drum" }, { value: "3", label: "Snare Drum" }, { value: "4", label: "Electric Guitar" }, { value: "5", label: "Bass Guitar" }, { value: "6", label: "Acoustic Guitar" }], defaultValue: "1" }',
    '{ name: "problem", label: "Sound Problem", type: "select", options: [{ value: "1", label: "Too Muddy" }, { value: "2", label: "Too Harsh" }, { value: "3", label: "Lacks Presence" }, { value: "4", label: "Too Thin" }, { value: "5", label: "Too Boomy" }], defaultValue: "1" }',
    '{ name: "cutAmount", label: "Cut/Boost Amount (dB)", type: "number", min: 1, max: 12, defaultValue: 3 }'
  ],
  `(inputs) => {
    const source = inputs.source as number;
    const problem = inputs.problem as number;
    const cutAmount = inputs.cutAmount as number;
    const freqMap = {
      "1_1": { freq: "200-400 Hz", action: "Cut", desc: "Reduce muddiness in vocals" },
      "1_2": { freq: "2-4 kHz", action: "Cut", desc: "Tame harsh sibilance" },
      "1_3": { freq: "3-5 kHz", action: "Boost", desc: "Add vocal presence and clarity" },
      "1_4": { freq: "100-200 Hz", action: "Boost", desc: "Add warmth and body" },
      "1_5": { freq: "80-150 Hz", action: "Cut", desc: "Reduce proximity boom" },
      "2_1": { freq: "300-500 Hz", action: "Cut", desc: "Clean up kick mud" },
      "2_2": { freq: "3-5 kHz", action: "Cut", desc: "Reduce beater harshness" },
      "2_3": { freq: "2-4 kHz", action: "Boost", desc: "Add click and attack" },
      "2_4": { freq: "60-80 Hz", action: "Boost", desc: "Add low-end thump" },
      "2_5": { freq: "200-400 Hz", action: "Cut", desc: "Reduce boominess" },
      "3_1": { freq: "300-600 Hz", action: "Cut", desc: "Remove snare mud" },
      "3_2": { freq: "1-2 kHz", action: "Cut", desc: "Reduce harshness" },
      "3_3": { freq: "3-5 kHz", action: "Boost", desc: "Add snare crack" },
      "3_4": { freq: "150-250 Hz", action: "Boost", desc: "Add body to snare" },
      "3_5": { freq: "200-400 Hz", action: "Cut", desc: "Tighten snare tone" },
      "4_1": { freq: "300-500 Hz", action: "Cut", desc: "Clean guitar mud" },
      "4_2": { freq: "2-4 kHz", action: "Cut", desc: "Reduce guitar bite" },
      "4_3": { freq: "3-6 kHz", action: "Boost", desc: "Add presence" },
      "4_4": { freq: "200-400 Hz", action: "Boost", desc: "Add warmth" },
      "4_5": { freq: "100-250 Hz", action: "Cut", desc: "Reduce low boom" },
      "5_1": { freq: "200-400 Hz", action: "Cut", desc: "Clean bass mud" },
      "5_2": { freq: "800-1.5k Hz", action: "Cut", desc: "Reduce clank" },
      "5_3": { freq: "700-1k Hz", action: "Boost", desc: "Add growl and presence" },
      "5_4": { freq: "60-100 Hz", action: "Boost", desc: "Add deep low end" },
      "5_5": { freq: "80-200 Hz", action: "Cut", desc: "Tighten bass" },
      "6_1": { freq: "200-400 Hz", action: "Cut", desc: "Remove body mud" },
      "6_2": { freq: "2-5 kHz", action: "Cut", desc: "Reduce string harshness" },
      "6_3": { freq: "5-8 kHz", action: "Boost", desc: "Add shimmer" },
      "6_4": { freq: "100-200 Hz", action: "Boost", desc: "Add body warmth" },
      "6_5": { freq: "100-200 Hz", action: "Cut", desc: "Reduce boom" }
    };
    const key = source + "_" + problem;
    const result = freqMap[key] || { freq: "1 kHz", action: "Cut", desc: "General adjustment" };
    return {
      primary: { label: "Target Frequency", value: result.freq },
      details: [
        { label: "Action", value: result.action + " " + formatNumber(cutAmount) + " dB" },
        { label: "Description", value: result.desc },
        { label: "Q Width", value: result.action === "Cut" ? "Narrow (High Q)" : "Moderate (Medium Q)" },
        { label: "Tip", value: "Always cut before boosting" }
      ]
    };
  }`,
  [
    { q: "What is EQ in music production?", a: "EQ (equalization) adjusts the balance of frequency components in audio, allowing you to shape tone by boosting or cutting specific frequencies." },
    { q: "Should I boost or cut frequencies?", a: "Cutting is generally preferred over boosting. Subtractive EQ sounds more natural and avoids introducing noise or distortion." },
    { q: "What frequencies are muddy?", a: "Muddiness typically lives in the 200-500 Hz range. Cutting here can dramatically clean up a mix." }
  ],
  `EQ adjustments based on source instrument and identified problem frequency range`,
  ["microphone-sensitivity-calculator", "drum-tuning-frequency-calculator", "bpm-tempo-calculator"]
);

add(
  "music-royalty-split-calculator",
  "Music Royalty Split Calculator",
  "Calculate fair royalty splits between songwriters, producers, and performers.",
  "Finance",
  "finance",
  "$",
  ["royalty", "split", "songwriting", "publishing", "music income"],
  [
    '{ name: "totalRevenue", label: "Total Revenue ($)", type: "number", min: 100, max: 10000000, defaultValue: 10000 }',
    '{ name: "numWriters", label: "Number of Songwriters", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "producerPct", label: "Producer Share (%)", type: "number", min: 0, max: 50, defaultValue: 20 }',
    '{ name: "labelPct", label: "Label/Distributor Share (%)", type: "number", min: 0, max: 80, defaultValue: 15 }',
    '{ name: "managerPct", label: "Manager Commission (%)", type: "number", min: 0, max: 25, defaultValue: 15 }'
  ],
  `(inputs) => {
    const totalRevenue = inputs.totalRevenue as number;
    const numWriters = inputs.numWriters as number;
    const producerPct = inputs.producerPct as number;
    const labelPct = inputs.labelPct as number;
    const managerPct = inputs.managerPct as number;
    const labelCut = totalRevenue * (labelPct / 100);
    const afterLabel = totalRevenue - labelCut;
    const producerCut = afterLabel * (producerPct / 100);
    const afterProducer = afterLabel - producerCut;
    const managerCut = afterProducer * (managerPct / 100);
    const afterManager = afterProducer - managerCut;
    const perWriter = afterManager / numWriters;
    const writerPctOfTotal = (perWriter / totalRevenue) * 100;
    return {
      primary: { label: "Per Songwriter Share", value: "$" + formatNumber(perWriter) },
      details: [
        { label: "Label/Distributor Take", value: "$" + formatNumber(labelCut) },
        { label: "Producer Take", value: "$" + formatNumber(producerCut) },
        { label: "Manager Take", value: "$" + formatNumber(managerCut) },
        { label: "Writer % of Total", value: formatNumber(writerPctOfTotal) + "%" }
      ]
    };
  }`,
  [
    { q: "How are music royalties typically split?", a: "A common split is 50% songwriter share and 50% publisher share. Producer points typically come from the artist's share." },
    { q: "What percentage does a music producer get?", a: "Producers typically receive 15-25% of recording royalties, sometimes as 3-5 'points' on the album." },
    { q: "What does a music manager take?", a: "Music managers typically take 15-20% of the artist's gross income from all music-related revenue." }
  ],
  `Per Writer = (Revenue - Label Cut - Producer Cut - Manager Cut) / Writers`,
  ["music-streaming-revenue-calculator", "album-production-budget-calculator", "podcast-production-cost-calculator"]
);

add(
  "podcast-production-cost-calculator",
  "Podcast Production Cost Calculator",
  "Estimate the costs of starting and running a podcast including equipment, hosting, and editing.",
  "Finance",
  "finance",
  "$",
  ["podcast", "production", "cost", "audio", "hosting", "editing"],
  [
    '{ name: "equipmentCost", label: "Equipment Cost ($)", type: "number", min: 50, max: 10000, defaultValue: 500 }',
    '{ name: "editingRate", label: "Editing Cost Per Episode ($)", type: "number", min: 0, max: 500, defaultValue: 75 }',
    '{ name: "hostingMonthly", label: "Monthly Hosting Fee ($)", type: "number", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "episodesPerMonth", label: "Episodes Per Month", type: "number", min: 1, max: 30, defaultValue: 4 }',
    '{ name: "months", label: "Duration (months)", type: "number", min: 1, max: 60, defaultValue: 12 }'
  ],
  `(inputs) => {
    const equipmentCost = inputs.equipmentCost as number;
    const editingRate = inputs.editingRate as number;
    const hostingMonthly = inputs.hostingMonthly as number;
    const episodesPerMonth = inputs.episodesPerMonth as number;
    const months = inputs.months as number;
    const totalEpisodes = episodesPerMonth * months;
    const totalEditing = editingRate * totalEpisodes;
    const totalHosting = hostingMonthly * months;
    const totalCost = equipmentCost + totalEditing + totalHosting;
    const costPerEpisode = totalCost / totalEpisodes;
    const monthlyCost = (totalEditing + totalHosting) / months;
    return {
      primary: { label: "Total Cost (" + months + " months)", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Equipment (One-Time)", value: "$" + formatNumber(equipmentCost) },
        { label: "Total Editing Cost", value: "$" + formatNumber(totalEditing) },
        { label: "Total Hosting", value: "$" + formatNumber(totalHosting) },
        { label: "Cost Per Episode", value: "$" + formatNumber(costPerEpisode) },
        { label: "Monthly Recurring", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to start a podcast?", a: "A basic podcast setup can start at $100-200 for equipment. A professional setup with editing services runs $500-2000 to launch." },
    { q: "Should I pay for podcast editing?", a: "Professional editing costs $50-150 per episode but significantly improves audio quality and listener retention." },
    { q: "What equipment do I need for a podcast?", a: "At minimum you need a USB microphone ($50-100), headphones ($30-50), and recording software (free options available)." }
  ],
  `Total Cost = Equipment + (Editing x Episodes) + (Hosting x Months)`,
  ["studio-recording-cost-calculator", "music-streaming-revenue-calculator", "soundproofing-cost-calculator"]
);

add(
  "concert-venue-capacity-calculator",
  "Concert Venue Capacity Calculator",
  "Calculate safe venue capacity, ticket revenue, and staffing needs for live music events.",
  "Everyday",
  "everyday",
  "~",
  ["venue", "capacity", "concert", "event", "live music", "safety"],
  [
    '{ name: "venueArea", label: "Venue Area (sq ft)", type: "number", min: 200, max: 500000, defaultValue: 5000 }',
    '{ name: "seatingType", label: "Seating Type", type: "select", options: [{ value: "1", label: "General Admission (Standing)" }, { value: "2", label: "Theater Seating" }, { value: "3", label: "Cabaret/Tables" }, { value: "4", label: "Festival (Outdoor)" }], defaultValue: "1" }',
    '{ name: "ticketPrice", label: "Avg Ticket Price ($)", type: "number", min: 5, max: 500, defaultValue: 35 }',
    '{ name: "stageArea", label: "Stage/Production Area (sq ft)", type: "number", min: 50, max: 50000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const venueArea = inputs.venueArea as number;
    const seatingType = inputs.seatingType as number;
    const ticketPrice = inputs.ticketPrice as number;
    const stageArea = inputs.stageArea as number;
    const usableArea = venueArea - stageArea;
    const sqftPerPerson = { 1: 5, 2: 7, 3: 12, 4: 6 };
    const capacity = Math.floor(usableArea / sqftPerPerson[seatingType]);
    const grossRevenue = capacity * ticketPrice;
    const securityStaff = Math.ceil(capacity / 100);
    const barStaff = Math.ceil(capacity / 75);
    const totalStaff = securityStaff + barStaff + 2;
    const seatingLabels = { 1: "Standing GA", 2: "Theater", 3: "Cabaret/Tables", 4: "Festival" };
    return {
      primary: { label: "Max Capacity", value: formatNumber(capacity) + " people" },
      details: [
        { label: "Seating Type", value: seatingLabels[seatingType] },
        { label: "Gross Ticket Revenue", value: "$" + formatNumber(grossRevenue) },
        { label: "Security Staff Needed", value: formatNumber(securityStaff) },
        { label: "Total Staff Needed", value: formatNumber(totalStaff) },
        { label: "Usable Area", value: formatNumber(usableArea) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How many square feet per person at a concert?", a: "Standing general admission needs about 5-6 sq ft per person, seated venues need 7-12 sq ft per person." },
    { q: "How much security do I need for a concert?", a: "The general guideline is 1 security guard per 100 attendees, with more for high-energy or alcohol-serving events." },
    { q: "What is the maximum occupancy for a venue?", a: "Maximum occupancy is determined by fire codes, typically based on available floor space minus stage, exits, and aisles." }
  ],
  `Capacity = (Venue Area - Stage Area) / Sq Ft Per Person`,
  ["concert-ticket-value-calculator", "speaker-wattage-calculator", "soundproofing-cost-calculator"]
);

add(
  "soundproofing-cost-calculator",
  "Soundproofing Cost Calculator",
  "Estimate the cost of soundproofing a room for music practice, recording, or noise reduction.",
  "Finance",
  "finance",
  "$",
  ["soundproofing", "acoustic", "noise reduction", "studio", "insulation"],
  [
    '{ name: "roomArea", label: "Total Wall Area (sq ft)", type: "number", min: 50, max: 5000, defaultValue: 400 }',
    '{ name: "method", label: "Soundproofing Method", type: "select", options: [{ value: "1", label: "Basic (Foam Panels)" }, { value: "2", label: "Moderate (MLV + Insulation)" }, { value: "3", label: "Professional (Room in Room)" }, { value: "4", label: "DIY Acoustic Panels" }], defaultValue: "2" }',
    '{ name: "includeCeiling", label: "Include Ceiling", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" }',
    '{ name: "includeFlooring", label: "Include Floor Treatment", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const roomArea = inputs.roomArea as number;
    const method = inputs.method as number;
    const includeCeiling = inputs.includeCeiling as number;
    const includeFlooring = inputs.includeFlooring as number;
    const costPerSqFt = { 1: 2.5, 2: 8, 3: 25, 4: 4 };
    const methodLabels = { 1: "Foam Panels", 2: "MLV + Insulation", 3: "Room in Room", 4: "DIY Panels" };
    const stcRating = { 1: "STC 25-30", 2: "STC 40-50", 3: "STC 55-65", 4: "STC 30-35" };
    const totalArea = roomArea + (includeCeiling === 1 ? roomArea * 0.4 : 0) + (includeFlooring === 1 ? roomArea * 0.35 : 0);
    const materialCost = totalArea * costPerSqFt[method];
    const laborCost = method === 4 ? 0 : materialCost * 0.5;
    const totalCost = materialCost + laborCost;
    return {
      primary: { label: "Total Soundproofing Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Material Cost", value: "$" + formatNumber(materialCost) },
        { label: "Labor Cost", value: "$" + formatNumber(laborCost) },
        { label: "Method", value: methodLabels[method] },
        { label: "Noise Reduction", value: stcRating[method] },
        { label: "Total Treatment Area", value: formatNumber(totalArea) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How much does soundproofing cost per square foot?", a: "Basic foam panels cost $2-4 per sq ft. Professional soundproofing with MLV and isolation can cost $15-30 per sq ft." },
    { q: "What is the most effective soundproofing method?", a: "A room-within-a-room construction with decoupled walls is the most effective, achieving STC ratings of 55-65." },
    { q: "Can I soundproof a room myself?", a: "DIY options like acoustic foam, mass loaded vinyl, and weatherstripping are effective for moderate noise reduction at lower cost." }
  ],
  `Total Cost = (Wall + Ceiling + Floor Area) x Cost Per Sq Ft x (1 + Labor Factor)`,
  ["speaker-room-size-calculator", "studio-recording-cost-calculator", "concert-venue-capacity-calculator"]
);

add(
  "music-copyright-value-calculator",
  "Music Copyright Value Calculator",
  "Estimate the value of a music catalog based on annual revenue and industry multipliers.",
  "Finance",
  "finance",
  "$",
  ["copyright", "catalog", "music value", "publishing", "IP"],
  [
    '{ name: "annualRevenue", label: "Annual Revenue ($)", type: "number", min: 100, max: 100000000, defaultValue: 50000 }',
    '{ name: "catalogAge", label: "Catalog Age (years)", type: "number", min: 1, max: 60, defaultValue: 10 }',
    '{ name: "catalogType", label: "Catalog Type", type: "select", options: [{ value: "1", label: "Independent/Indie" }, { value: "2", label: "Established Artist" }, { value: "3", label: "Hit Catalog" }, { value: "4", label: "Evergreen Classics" }], defaultValue: "2" }',
    '{ name: "growthRate", label: "Revenue Growth Rate (%)", type: "number", min: -10, max: 30, defaultValue: 5 }'
  ],
  `(inputs) => {
    const annualRevenue = inputs.annualRevenue as number;
    const catalogAge = inputs.catalogAge as number;
    const catalogType = inputs.catalogType as number;
    const growthRate = inputs.growthRate as number;
    const multipliers = { 1: 8, 2: 15, 3: 22, 4: 28 };
    const multiplier = multipliers[catalogType];
    const ageFactor = catalogAge >= 20 ? 1.2 : catalogAge >= 10 ? 1.0 : 0.85;
    const growthFactor = 1 + (growthRate / 100);
    const estimatedValue = annualRevenue * multiplier * ageFactor;
    const fiveYearProjection = annualRevenue * ((Math.pow(growthFactor, 5) - 1) / (growthFactor - 1 || 5));
    const typeLabels = { 1: "Independent", 2: "Established", 3: "Hit Catalog", 4: "Evergreen Classics" };
    return {
      primary: { label: "Estimated Catalog Value", value: "$" + formatNumber(estimatedValue) },
      details: [
        { label: "Revenue Multiplier", value: formatNumber(multiplier) + "x" },
        { label: "Age Factor", value: formatNumber(ageFactor) + "x" },
        { label: "Catalog Type", value: typeLabels[catalogType] },
        { label: "5-Year Revenue Projection", value: "$" + formatNumber(fiveYearProjection) }
      ]
    };
  }`,
  [
    { q: "How are music catalogs valued?", a: "Music catalogs are typically valued at 10-30 times their annual revenue, depending on the quality and longevity of the catalog." },
    { q: "Why are music catalogs selling for so much?", a: "Low interest rates, streaming growth, and the proven stability of music royalties have driven catalog multiples to historic highs." },
    { q: "What makes a music catalog more valuable?", a: "Evergreen songs with consistent streaming, sync licensing potential, and multiple revenue streams command the highest multiples." }
  ],
  `Catalog Value = Annual Revenue x Type Multiplier x Age Factor`,
  ["music-royalty-split-calculator", "music-streaming-revenue-calculator", "album-production-budget-calculator"]
);

add(
  "music-practice-time-calculator",
  "Music Practice Time Calculator",
  "Plan effective practice sessions with time allocation for technique, repertoire, and theory.",
  "Everyday",
  "everyday",
  "~",
  ["practice", "music", "instrument", "schedule", "learning"],
  [
    '{ name: "totalMinutes", label: "Total Practice Time (minutes)", type: "number", min: 15, max: 240, defaultValue: 60 }',
    '{ name: "level", label: "Skill Level", type: "select", options: [{ value: "1", label: "Beginner" }, { value: "2", label: "Intermediate" }, { value: "3", label: "Advanced" }], defaultValue: "2" }',
    '{ name: "daysPerWeek", label: "Practice Days Per Week", type: "number", min: 1, max: 7, defaultValue: 5 }',
    '{ name: "goal", label: "Primary Goal", type: "select", options: [{ value: "1", label: "General Improvement" }, { value: "2", label: "Performance Prep" }, { value: "3", label: "Exam/Audition Prep" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const totalMinutes = inputs.totalMinutes as number;
    const level = inputs.level as number;
    const daysPerWeek = inputs.daysPerWeek as number;
    const goal = inputs.goal as number;
    const splits = {
      "1_1": { warmup: 0.20, technique: 0.30, repertoire: 0.30, theory: 0.20 },
      "1_2": { warmup: 0.15, technique: 0.20, repertoire: 0.50, theory: 0.15 },
      "1_3": { warmup: 0.15, technique: 0.25, repertoire: 0.40, theory: 0.20 },
      "2_1": { warmup: 0.15, technique: 0.25, repertoire: 0.40, theory: 0.20 },
      "2_2": { warmup: 0.10, technique: 0.15, repertoire: 0.60, theory: 0.15 },
      "2_3": { warmup: 0.10, technique: 0.25, repertoire: 0.45, theory: 0.20 },
      "3_1": { warmup: 0.10, technique: 0.20, repertoire: 0.50, theory: 0.20 },
      "3_2": { warmup: 0.10, technique: 0.10, repertoire: 0.70, theory: 0.10 },
      "3_3": { warmup: 0.10, technique: 0.20, repertoire: 0.55, theory: 0.15 }
    };
    const key = level + "_" + goal;
    const split = splits[key] || splits["2_1"];
    const warmup = Math.round(totalMinutes * split.warmup);
    const technique = Math.round(totalMinutes * split.technique);
    const repertoire = Math.round(totalMinutes * split.repertoire);
    const theory = totalMinutes - warmup - technique - repertoire;
    const weeklyHours = (totalMinutes * daysPerWeek) / 60;
    const monthlyHours = weeklyHours * 4.33;
    return {
      primary: { label: "Weekly Practice Hours", value: formatNumber(weeklyHours) + " hrs" },
      details: [
        { label: "Warm-up / Scales", value: formatNumber(warmup) + " min" },
        { label: "Technique / Etudes", value: formatNumber(technique) + " min" },
        { label: "Repertoire", value: formatNumber(repertoire) + " min" },
        { label: "Theory / Ear Training", value: formatNumber(theory) + " min" },
        { label: "Monthly Total", value: formatNumber(monthlyHours) + " hrs" }
      ]
    };
  }`,
  [
    { q: "How long should I practice my instrument daily?", a: "Beginners benefit from 30-45 minutes daily. Intermediate players should aim for 1-2 hours. Advanced players often practice 3-4 hours." },
    { q: "Is it better to practice every day or skip days?", a: "Consistent daily practice, even shorter sessions, is more effective than long sporadic sessions for building muscle memory." },
    { q: "How should I structure my practice session?", a: "Start with warm-ups and scales, then work on technique, followed by repertoire, and end with sight-reading or theory." }
  ],
  `Time allocation based on skill level and goal priorities\nWeekly Hours = Daily Minutes x Days / 60`,
  ["bpm-tempo-calculator", "chord-progression-calculator", "guitar-string-gauge-calculator"]
);

add(
  "audio-delay-compensation-calculator",
  "Audio Delay Compensation Calculator",
  "Calculate audio delay times for live sound and studio synchronization based on distance and temperature.",
  "Science",
  "science",
  "A",
  ["audio delay", "latency", "speed of sound", "live sound", "sync"],
  [
    '{ name: "distance", label: "Distance (feet)", type: "number", min: 1, max: 5000, defaultValue: 50 }',
    '{ name: "temperature", label: "Temperature (F)", type: "number", min: 0, max: 120, defaultValue: 72 }',
    '{ name: "sampleRate", label: "Sample Rate", type: "select", options: [{ value: "44100", label: "44.1 kHz (CD)" }, { value: "48000", label: "48 kHz (Video)" }, { value: "96000", label: "96 kHz (Hi-Res)" }], defaultValue: "48000" }',
    '{ name: "humidity", label: "Humidity (%)", type: "number", min: 0, max: 100, defaultValue: 50 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const temperature = inputs.temperature as number;
    const sampleRate = inputs.sampleRate as number;
    const humidity = inputs.humidity as number;
    const tempC = (temperature - 32) * 5 / 9;
    const speedOfSound = 331.3 + (0.606 * tempC) + (0.0124 * humidity);
    const distanceM = distance * 0.3048;
    const delayMs = (distanceM / speedOfSound) * 1000;
    const delaySamples = Math.round(delayMs * sampleRate / 1000);
    const speedFtPerSec = speedOfSound * 3.28084;
    const wavelength1k = speedOfSound / 1000;
    return {
      primary: { label: "Delay Time", value: formatNumber(delayMs) + " ms" },
      details: [
        { label: "Delay in Samples", value: formatNumber(delaySamples) + " samples" },
        { label: "Speed of Sound", value: formatNumber(speedFtPerSec) + " ft/s" },
        { label: "Distance", value: formatNumber(distance) + " ft (" + formatNumber(distanceM) + " m)" },
        { label: "1 kHz Wavelength", value: formatNumber(wavelength1k) + " m" }
      ]
    };
  }`,
  [
    { q: "Why does audio need delay compensation?", a: "Sound travels at roughly 1 foot per millisecond. In large venues, delayed speakers must be timed to match the main system." },
    { q: "Does temperature affect the speed of sound?", a: "Yes, sound travels faster in warmer air. At 72F sound travels about 1128 ft/s versus 1087 ft/s at 32F." },
    { q: "How do I set delay on PA speakers?", a: "Measure the distance between main and delay speakers, then calculate the delay time using distance divided by speed of sound." }
  ],
  `Delay (ms) = (Distance m / Speed of Sound) x 1000\nSpeed = 331.3 + 0.606 x Temperature C`,
  ["speaker-wattage-calculator", "concert-venue-capacity-calculator", "microphone-sensitivity-calculator"]
);
