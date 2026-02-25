import { useState, useEffect, useRef, useCallback } from "react";
const BANK = [
  // ── ENGLISH · EASY ──────────────────────────────────────────────────────────
  {id:"e01",s:"English",d:"easy",t:"Synonyms",q:"Which word means the same as HAPPY?",o:["Sad","Joyful","Angry","Tired"],a:"Joyful",h:"Think about a positive, uplifting feeling.",r:"SYNONYMS have similar meanings. HAPPY = Joyful / Cheerful / Delighted. Antonyms: Sad / Miserable."},
  {id:"e02",s:"English",d:"easy",t:"Antonyms",q:"Which word means the OPPOSITE of FAST?",o:["Quick","Speedy","Slow","Swift"],a:"Slow",h:"The opposite word describes something that does not move quickly.",r:"ANTONYMS are opposites. FAST ↔ Slow / Sluggish. Synonyms: Quick / Swift / Rapid."},
  {id:"e03",s:"English",d:"easy",t:"Word Classes",q:"Which word is a NOUN?",o:["Run","Blue","Happiness","Quickly"],a:"Happiness",h:"A noun is a naming word — a person, place, thing, or feeling.",r:"NOUNS name people, places, things, or ideas. VERBS are actions. ADJECTIVES describe nouns."},
  {id:"e04",s:"English",d:"easy",t:"Spelling",q:"Choose the correct spelling.",o:["Freind","Friend","Freind","Frend"],a:"Friend",h:"Remember: i before e except after c.",r:"SPELLING: 'i before e except after c' → Friend. Exceptions: weird, receive, ceiling."},
  {id:"e05",s:"English",d:"easy",t:"Word Classes",q:"Which word is an ADJECTIVE?",o:["Swim","Quickly","Enormous","Ran"],a:"Enormous",h:"An adjective is a describing word — it tells you more about a noun.",r:"ADJECTIVES describe nouns. Types: size (huge), colour (blue), texture (rough), number (three)."},
  {id:"e06",s:"English",d:"easy",t:"Punctuation",q:"Which sentence uses a CAPITAL LETTER correctly?",o:["the dog barked.","The dog barked.","The Dog barked.","the Dog Barked."],a:"The dog barked.",h:"Capital letters begin sentences and proper nouns (names of people and places).",r:"CAPITALS: Start every sentence. Use for proper nouns, days, months, and the word 'I'."},
  {id:"e07",s:"English",d:"easy",t:"Prepositions",q:"Choose the word that best completes: The cat sat ___ the mat.",o:["in","on","under","beside"],a:"on",h:"Think about where a cat most naturally sits in this common phrase.",r:"PREPOSITIONS show position: on (surface), in (inside), under (below), beside (next to)."},
  {id:"e08",s:"English",d:"easy",t:"Synonyms",q:"Which word means the same as BIG?",o:["Tiny","Small","Huge","Little"],a:"Huge",h:"Think of a word meaning very large in size.",r:"SYNONYMS for BIG: Huge / Large / Enormous / Gigantic. Antonyms: Small / Tiny / Minute."},
  {id:"e09",s:"English",d:"easy",t:"Punctuation",q:"Which punctuation mark ends a question?",o:["Full stop","Comma","Question mark","Exclamation mark"],a:"Question mark",h:"Look at the end of a sentence that asks something.",r:"Full stop (.) = statements. Question mark (?) = questions. Exclamation mark (!) = strong feeling."},
  {id:"e10",s:"English",d:"easy",t:"Grammar",q:"What is the PLURAL of 'child'?",o:["Childs","Childes","Children","Childer"],a:"Children",h:"This is an irregular plural — it does not simply add -s or -es.",r:"IRREGULAR PLURALS: child→children / mouse→mice / tooth→teeth / foot→feet."},
  {id:"e11",s:"English",d:"easy",t:"Word Classes",q:"Which word is a VERB (action word)?",o:["Beautiful","Swim","Quickly","Happiness"],a:"Swim",h:"A verb is a doing word — it describes an action or state.",r:"VERBS describe actions (swim, run) or states (is, seems). Every sentence needs a verb."},
  {id:"e12",s:"English",d:"easy",t:"Homophones",q:"Choose the correct word: There are ___ apples in the bowl.",o:["to","two","too","tow"],a:"two",h:"This word is the number — not the direction word or the 'also' word.",r:"HOMOPHONES: to (direction) / two (number 2) / too (also). These sound identical."},
  {id:"e13",s:"English",d:"easy",t:"Synonyms",q:"Which word means the same as SMALL?",o:["Minute","Enormous","Vast","Gigantic"],a:"Minute",h:"Think of the tiniest possible size. 'Minute' as an adjective means extremely small.",r:"SYNONYMS for SMALL: Tiny / Minute / Petite / Miniature. Minute (adj) = pronounced my-NEWT."},
  {id:"e14",s:"English",d:"easy",t:"Word Classes",q:"A word that describes a noun is called a...?",o:["Verb","Adverb","Adjective","Pronoun"],a:"Adjective",h:"It is the 'describing word' — it adds detail to a naming word.",r:"WORD CLASSES: Noun (naming) / Verb (action) / Adjective (describes noun) / Adverb (describes verb)."},
  {id:"e15",s:"English",d:"easy",t:"Synonyms",q:"Which word has the same meaning as ANGRY?",o:["Calm","Furious","Happy","Bored"],a:"Furious",h:"Think of a strong feeling — almost like a fire inside.",r:"SYNONYMS for ANGRY: Furious / Cross / Irate / Livid / Enraged. Choosing vivid synonyms improves writing."},
  // ── ENGLISH · MEDIUM ─────────────────────────────────────────────────────────
  {id:"e16",s:"English",d:"medium",t:"Synonyms",q:"Choose the word closest in meaning to ANCIENT.",o:["Modern","New","Old","Fresh"],a:"Old",h:"Think about something that has existed for a very long time.",r:"ANCIENT means extremely old. Synonyms: Old / Aged / Antique / Archaic. Antonyms: Modern / Recent."},
  {id:"e17",s:"English",d:"medium",t:"Figurative Language",q:"Which sentence contains a SIMILE?",o:["The dog is very fast.","The dog ran like the wind.","The speedy dog ran far.","The dog flew down the road."],a:"The dog ran like the wind.",h:"A simile compares two things using 'like' or 'as'.",r:"SIMILE uses 'like' or 'as'. METAPHOR says something IS something else. Both are figures of speech."},
  {id:"e18",s:"English",d:"medium",t:"Synonyms",q:"Choose the word closest in meaning to DAMP.",o:["Dry","Moist","Burning","Freezing"],a:"Moist",h:"Think of something slightly wet — not soaking but not dry either.",r:"DAMP = slightly wet. Synonyms: Moist / Humid / Clammy. Antonyms: Dry / Arid / Parched."},
  {id:"e19",s:"English",d:"medium",t:"Grammar",q:"Which word correctly completes: She ___ to school every day.",o:["go","goes","gone","going"],a:"goes",h:"The subject is 'she' — a singular third-person pronoun. Which verb form matches?",r:"SUBJECT-VERB AGREEMENT: With he/she/it add -s or -es: She goes / He runs. With I/you/we/they: no -s."},
  {id:"e20",s:"English",d:"medium",t:"Punctuation",q:"Where should the APOSTROPHE go: The girls book is on the table.",o:["The girl's book is on the table.","The girls' book is on the table.","The girls book's is on the table.","The girls's book is on the table."],a:"The girl's book is on the table.",h:"One girl or many? The sentence says 'the girl' (singular).",r:"APOSTROPHES: singular owner → girl's / plural owner → girls'. Also show omission: don't = do not."},
  {id:"e21",s:"English",d:"medium",t:"Antonyms",q:"Which word means the OPPOSITE of COURAGEOUS?",o:["Brave","Fearless","Cowardly","Bold"],a:"Cowardly",h:"What word describes someone who runs away from danger?",r:"ANTONYMS for COURAGEOUS: Cowardly / Timid / Fearful. Synonyms: Brave / Bold / Valiant / Dauntless."},
  {id:"e22",s:"English",d:"medium",t:"Synonyms",q:"Choose the word closest in meaning to PECULIAR.",o:["Normal","Ordinary","Strange","Common"],a:"Strange",h:"Think about something that stands out because it is different from expected.",r:"PECULIAR = unusual or strange. Synonyms: Odd / Bizarre / Eccentric. Antonyms: Normal / Typical."},
  {id:"e23",s:"English",d:"medium",t:"Figurative Language",q:"Which literary device is used: 'The wind whispered through the trees'?",o:["Simile","Alliteration","Personification","Rhyme"],a:"Personification",h:"The wind is being given a human action — something only people can do.",r:"PERSONIFICATION gives human qualities to non-human things: wind whispers / sun smiles / trees dance."},
  {id:"e24",s:"English",d:"medium",t:"Word Classes",q:"Which word is an ADVERB in: 'She sang beautifully'?",o:["She","sang","beautifully","the"],a:"beautifully",h:"An adverb describes HOW something was done. Look for the -ly ending.",r:"ADVERBS modify verbs (beautifully), adjectives (very tall), or other adverbs (quite slowly)."},
  {id:"e25",s:"English",d:"medium",t:"Grammar",q:"Choose the correct form: I should have ___ that book.",o:["buyed","boughted","bought","buy"],a:"bought",h:"This is an irregular past tense verb — it doesn't follow the normal -ed rule.",r:"IRREGULAR PAST TENSE: buy→bought / think→thought / bring→brought / catch→caught."},
  {id:"e26",s:"English",d:"medium",t:"Figurative Language",q:"Which sentence contains ALLITERATION?",o:["Peter ran to the park.","Peter's pretty parrot pecked.","The bird flew away quickly.","She sold seashells yesterday."],a:"Peter's pretty parrot pecked.",h:"Alliteration is when words close together begin with the same sound.",r:"ALLITERATION: repetition of the same initial consonant sound. Used in poetry and advertising."},
  {id:"e27",s:"English",d:"medium",t:"Synonyms",q:"Which word best means TRANSPARENT?",o:["Opaque","Clear","Dense","Cloudy"],a:"Clear",h:"Think of something you can see straight through — like glass.",r:"TRANSPARENT = see-through. Synonyms: Clear / See-through / Translucent. Antonyms: Opaque / Dense."},
  // ── ENGLISH · HARD ───────────────────────────────────────────────────────────
  {id:"e28",s:"English",d:"hard",t:"Synonyms",q:"Choose the word closest in meaning to LOQUACIOUS.",o:["Silent","Talkative","Intelligent","Careful"],a:"Talkative",h:"Think about someone who talks a great deal and finds it hard to stop.",r:"LOQUACIOUS (adj) from Latin 'loqui' (to speak). Synonyms: Garrulous / Verbose / Voluble."},
  {id:"e29",s:"English",d:"hard",t:"Punctuation",q:"Which sentence uses a COLON correctly?",o:["I need: to go home.","The result was clear: she had won.","She was tired: and hungry.","He ran: very fast today."],a:"The result was clear: she had won.",h:"A colon introduces something. The part before must be a complete sentence.",r:"COLONS (:) introduce: a list / an explanation / a quotation. NEVER after 'need:' or mid-clause."},
  {id:"e30",s:"English",d:"hard",t:"Synonyms",q:"Choose the word closest in meaning to MELANCHOLY.",o:["Joyful","Cheerful","Sadness","Excited"],a:"Sadness",h:"This word describes a deep lingering feeling — not sharp anger but a quieter heavy emotion.",r:"MELANCHOLY = deep pensive sadness. Synonyms: Sorrow / Despondency / Gloom / Wistfulness."},
  {id:"e31",s:"English",d:"hard",t:"Punctuation",q:"Which sentence uses the SEMICOLON correctly?",o:["I love reading; but not maths.","She ran fast; she still missed the bus.","He ate; quickly and then left.","The dog; barked loudly at night."],a:"She ran fast; she still missed the bus.",h:"A semicolon joins two COMPLETE sentences that are closely related.",r:"SEMICOLONS join two independent clauses. NEVER use before conjunctions (but/and/or)."},
  {id:"e32",s:"English",d:"hard",t:"Vocabulary Roots",q:"What is the meaning of the prefix 'BENE-' in the word BENEVOLENT?",o:["Against","Bad","Well/Good","Under"],a:"Well/Good",h:"Latin prefixes carry meaning. Think of a 'benefactor' — someone who does good things.",r:"LATIN PREFIXES: bene- (well): benefit, benevolent. mal- (bad): malevolent. sub- (under): submarine."},
  {id:"e33",s:"English",d:"hard",t:"Synonyms",q:"Choose the word closest in meaning to TENACIOUS.",o:["Weak","Giving-up","Stubborn/Persistent","Gentle"],a:"Stubborn/Persistent",h:"This word describes holding on firmly and not letting go even under pressure.",r:"TENACIOUS from Latin 'tenere' (to hold). Synonyms: Persistent / Resolute / Dogged. Antonyms: Weak."},
  {id:"e34",s:"English",d:"hard",t:"Vocabulary in Context",q:"Which word best completes: The explorer's ___ spirit led her to discover new lands.",o:["timid","tenacious","lazy","cautious"],a:"tenacious",h:"The explorer discovers new lands — which adjective fits someone who keeps going despite challenges?",r:"Context clue: 'discover new lands' tells us she perseveres. TENACIOUS = persistent / determined."},
  {id:"e35",s:"English",d:"hard",t:"Figurative Language",q:"What literary device is: 'Life is a journey'?",o:["Simile","Alliteration","Metaphor","Personification"],a:"Metaphor",h:"This compares two things without using 'like' or 'as' — it says one thing IS another.",r:"METAPHOR: states one thing IS another (Life is a journey). SIMILE: uses like/as."},
  {id:"e36",s:"English",d:"hard",t:"Synonyms",q:"Choose the word closest in meaning to VERBOSE.",o:["Brief","Concise","Wordy","Quiet"],a:"Wordy",h:"This describes a style using far more words than needed.",r:"VERBOSE = using more words than necessary. Synonyms: Wordy / Rambling / Prolix. Antonyms: Concise / Terse."},
  {id:"e37",s:"English",d:"hard",t:"Grammar",q:"Which sentence is written in the PASSIVE VOICE?",o:["The cat chased the mouse.","The mouse was chased by the cat.","The mouse ran fast.","The cat ran quickly after the mouse."],a:"The mouse was chased by the cat.",h:"In passive voice the subject receives the action rather than performing it.",r:"ACTIVE: subject does action (cat chased). PASSIVE: subject receives action (mouse was chased)."},
  {id:"e38",s:"English",d:"hard",t:"Synonyms",q:"What does the word AMBIGUOUS mean?",o:["Clear and obvious","Having two or more possible meanings","Extremely boring","Easily understood"],a:"Having two or more possible meanings",h:"The prefix 'ambi-' means 'both' — think ambidextrous (using both hands).",r:"AMBIGUOUS: having more than one possible meaning. From Latin 'ambigere' (to wander about)."},
  {id:"e39",s:"English",d:"hard",t:"Synonyms",q:"Which word closest means EPHEMERAL?",o:["Permanent","Lasting","Short-lived","Eternal"],a:"Short-lived",h:"Think of a shooting star — beautiful but very briefly present.",r:"EPHEMERAL: lasting a very short time. From Greek 'ephemeros' (lasting a day). Synonyms: Fleeting / Transient."},
  // ── MATHS · EASY ─────────────────────────────────────────────────────────────
  {id:"m01",s:"Maths",d:"easy",t:"Times Tables",q:"What is 7 × 8?",o:["54","56","63","64"],a:"56",h:"Count in 7s: 7 14 21 28 35 42 49 56 — or think 7 × 8 = 7 × 4 × 2.",r:"TIMES TABLES: 7×8=56. Trick: 5 6 7 8 → 56 = 7×8. Learn: 7×8 = (7×10)−(7×2) = 70−14 = 56."},
  {id:"m02",s:"Maths",d:"easy",t:"Percentages",q:"What is 15% of 80?",o:["8","10","12","15"],a:"12",h:"Find 10% first (=8) then find 5% (half of 10%) then add together.",r:"PERCENTAGES: 10% of 80=8. 5% of 80=4. 15%=10%+5%=8+4=12. Or: 80×0.15=12."},
  {id:"m03",s:"Maths",d:"easy",t:"Division",q:"What is half of 64?",o:["28","30","32","34"],a:"32",h:"Halving means dividing by 2. Split 64 into 60 and 4 — halve each part.",r:"HALVING: 64÷2=32. Split method: 60÷2=30 and 4÷2=2 → 30+2=32."},
  {id:"m04",s:"Maths",d:"easy",t:"Number Sequences",q:"What is the next number in the sequence: 5, 10, 15, 20, ___?",o:["22","25","24","30"],a:"25",h:"This sequence goes up by the same amount each time. What is the rule?",r:"NUMBER SEQUENCES: 5 10 15 20 25 — adding 5 each time (multiples of 5)."},
  {id:"m05",s:"Maths",d:"easy",t:"Fractions",q:"What is 3/4 as a percentage?",o:["50%","60%","70%","75%"],a:"75%",h:"Think: 1/4 = 25% so 3/4 = 3 × 25%.",r:"KEY FRACTIONS: 1/2=50% / 1/4=25% / 3/4=75% / 1/5=20% / 1/10=10%."},
  {id:"m06",s:"Maths",d:"easy",t:"Perimeter",q:"A rectangle has length 8cm and width 5cm. What is its perimeter?",o:["26cm","40cm","30cm","13cm"],a:"26cm",h:"Perimeter means ALL the way around. A rectangle has 2 lengths and 2 widths.",r:"PERIMETER of rectangle = 2 × (length + width) = 2 × (8+5) = 2 × 13 = 26cm."},
  {id:"m07",s:"Maths",d:"easy",t:"Division",q:"What is 144 ÷ 12?",o:["11","12","13","14"],a:"12",h:"Think: 12 × ? = 144. Count up in 12s or use 12 × 10 = 120 then add 12s.",r:"DIVISION: 144÷12=12. Check: 12×12=144 ✓. Method: 12×10=120 → 144-120=24 → 24÷12=2 → 12."},
  {id:"m08",s:"Maths",d:"easy",t:"Fractions",q:"What fraction of 40 is 10?",o:["1/2","1/4","1/5","1/8"],a:"1/4",h:"Ask: 10 is what part of 40? Write it as a fraction and simplify.",r:"FRACTIONS OF AMOUNTS: 10/40 = 1/4. Method: write part/whole then simplify. 10÷10=1, 40÷10=4 → 1/4."},
  {id:"m09",s:"Maths",d:"easy",t:"Square Numbers",q:"What is the value of 6²?",o:["12","24","36","42"],a:"36",h:"6² means 6 × 6 — not 6 × 2.",r:"SQUARE NUMBERS: n²=n×n. 6²=6×6=36. First 10 squares: 1 4 9 16 25 36 49 64 81 100."},
  {id:"m10",s:"Maths",d:"easy",t:"Rounding",q:"Round 347 to the nearest 100.",o:["300","350","400","200"],a:"300",h:"Look at the tens digit (4). If it is less than 5, round down.",r:"ROUNDING to nearest 100: look at TENS digit. Under 5 → round down. 5 or above → round up. 347 → 300."},
  {id:"m11",s:"Maths",d:"easy",t:"Times Tables",q:"What is 12 × 9?",o:["98","100","108","106"],a:"108",h:"Use 12 × 10 = 120 then subtract one group of 12.",r:"MULTIPLICATION: 12×9 = 12×10 − 12×1 = 120−12 = 108. The 'near ten' method works for ×9 and ×11."},
  {id:"m12",s:"Maths",d:"easy",t:"Fractions",q:"A bag has 3 red and 7 blue balls. What fraction are red?",o:["3/7","3/10","7/10","1/3"],a:"3/10",h:"The fraction is red balls out of TOTAL balls. Total = 3+7 = 10.",r:"FRACTIONS: Total=3+7=10. Red fraction=3/10. Always use the total as the denominator."},
  {id:"m13",s:"Maths",d:"easy",t:"Subtraction",q:"What is 500 − 237?",o:["273","263","267","253"],a:"263",h:"Try 500−200=300 then 300−37=263. Or count up from 237 to 500.",r:"SUBTRACTION: 500−237 = 500−200−37 = 300−37 = 263. Count-up: 237→300(+63)→500(+200) = 263."},
  {id:"m14",s:"Maths",d:"easy",t:"Fractions",q:"Which is the largest fraction: 1/2, 3/8, 2/5, or 7/20?",o:["3/8","2/5","7/20","1/2"],a:"1/2",h:"Convert all fractions to the same denominator (20) to compare them fairly.",r:"COMPARING: Common denominator 20: 1/2=10/20 / 3/8≈7.5/20 / 2/5=8/20 / 7/20. Largest = 1/2."},
  {id:"m15",s:"Maths",d:"easy",t:"Area",q:"What is the area of a rectangle 6cm long and 4cm wide?",o:["10cm²","20cm²","24cm²","28cm²"],a:"24cm²",h:"Area means the space inside. Use length × width.",r:"AREA of rectangle = length × width = 6 × 4 = 24cm². Area is measured in square units (cm²)."},
  // ── MATHS · MEDIUM ───────────────────────────────────────────────────────────
  {id:"m16",s:"Maths",d:"medium",t:"Speed Distance Time",q:"A train travels 240km in 3 hours. How far in 5 hours at the same speed?",o:["360km","400km","420km","480km"],a:"400km",h:"Find the speed per hour first (distance ÷ time) then multiply by 5.",r:"SPEED=DISTANCE÷TIME. 240÷3=80km/h. In 5hrs: 80×5=400km. Triangle: D=S×T / S=D÷T / T=D÷S."},
  {id:"m17",s:"Maths",d:"medium",t:"Percentages",q:"A shop reduces a £60 jacket by 30%. What is the sale price?",o:["£18","£42","£48","£30"],a:"£42",h:"Find 30% of £60 then subtract it from the original price.",r:"PERCENTAGE DISCOUNT: 30% of £60=£18. Sale=£60−£18=£42. OR: 70% of £60=0.7×60=£42."},
  {id:"m18",s:"Maths",d:"medium",t:"Ratio",q:"Share £120 between A and B in the ratio 3:5. How much does A receive?",o:["£40","£45","£50","£72"],a:"£45",h:"Find the total parts first then work out the value of one part.",r:"RATIO: 3+5=8 parts. 1 part=£120÷8=£15. A gets 3 parts=3×£15=£45. Check: 45+75=120 ✓"},
  {id:"m19",s:"Maths",d:"medium",t:"Area",q:"What is the area of a triangle with base 10cm and height 6cm?",o:["60cm²","30cm²","16cm²","20cm²"],a:"30cm²",h:"The formula for triangle area involves base and height — but remember to halve.",r:"AREA OF TRIANGLE = ½ × base × height = ½ × 10 × 6 = 30cm². Works for ALL triangles."},
  {id:"m20",s:"Maths",d:"medium",t:"Algebra",q:"Solve: 3x + 7 = 22. What is x?",o:["4","5","6","7"],a:"5",h:"The goal is to get x alone. Undo the +7 first then undo the ×3.",r:"SOLVING: 3x+7=22 → subtract 7: 3x=15 → divide by 3: x=5. Always do the same to both sides."},
  {id:"m21",s:"Maths",d:"medium",t:"Averages",q:"What is the mean of 4, 7, 2, 9, and 3?",o:["4","5","6","7"],a:"5",h:"Mean = total sum divided by how many numbers there are.",r:"MEAN=sum÷count. 4+7+2+9+3=25. 25÷5=5. MEDIAN=middle (sorted: 2 3 4 7 9 → 4). MODE=most frequent."},
  {id:"m22",s:"Maths",d:"medium",t:"Angles",q:"What do the interior angles of a triangle add up to?",o:["90°","180°","270°","360°"],a:"180°",h:"Think of a triangle being 'unrolled' into a straight line.",r:"ANGLES IN SHAPES: Triangle=180°. Quadrilateral=360°. Pentagon=540°. Rule: (n−2)×180°."},
  {id:"m23",s:"Maths",d:"medium",t:"Speed Distance Time",q:"If a car travels at 60mph, how long does it take to travel 90 miles?",o:["1 hour","1.5 hours","2 hours","45 mins"],a:"1.5 hours",h:"Use the formula: Time = Distance ÷ Speed.",r:"TIME=DISTANCE÷SPEED=90÷60=1.5 hours=1 hour 30 minutes. 0.5 hours = 30 minutes."},
  {id:"m24",s:"Maths",d:"medium",t:"Proportion",q:"A recipe needs 300g of flour for 4 people. How much for 10 people?",o:["600g","650g","700g","750g"],a:"750g",h:"Find the amount for 1 person first then multiply by 10.",r:"UNITARY METHOD: 300g÷4=75g per person. For 10 people: 75×10=750g. Find 'one unit' first."},
  {id:"m25",s:"Maths",d:"medium",t:"Decimals",q:"What is 2.4 × 0.5?",o:["1.2","1.4","0.12","12"],a:"1.2",h:"0.5 is the same as a half. What is half of 2.4?",r:"DECIMALS: 0.5=½. 2.4×0.5=2.4÷2=1.2. Multiplying by 0.1=divide by 10. By 0.5=divide by 2."},
  {id:"m26",s:"Maths",d:"medium",t:"Number Sequences",q:"What is the next term: 2, 5, 10, 17, 26, ___?",o:["35","37","36","38"],a:"37",h:"The differences between terms are: 3, 5, 7, 9 — what comes next in that pattern?",r:"SEQUENCES WITH INCREASING DIFFERENCES: +3 +5 +7 +9 +11. Differences increase by 2. Quadratic sequence."},
  // ── MATHS · HARD ─────────────────────────────────────────────────────────────
  {id:"m27",s:"Maths",d:"hard",t:"Algebra",q:"If 2x + 3y = 12 and x = 3, what is y?",o:["1","2","3","4"],a:"2",h:"Substitute x=3 into the equation and solve for y.",r:"SUBSTITUTION: 2(3)+3y=12 → 6+3y=12 → 3y=6 → y=2. Substitute known values first."},
  {id:"m28",s:"Maths",d:"hard",t:"Probability",q:"A bag has 3 red, 5 blue, and 2 green balls. What is P(not red)?",o:["3/10","7/10","1/3","2/5"],a:"7/10",h:"Find the probability of NOT red: this includes ALL other colours combined.",r:"PROBABILITY: P(not red)=1−P(red)=1−3/10=7/10. Or count non-red: 5+2=7 out of 10."},
  {id:"m29",s:"Maths",d:"hard",t:"Algebra",q:"Factorise: x² + 5x + 6",o:["(x+2)(x+3)","(x+1)(x+6)","(x+2)(x+4)","(x+3)(x+4)"],a:"(x+2)(x+3)",h:"Find two numbers that multiply to 6 AND add to 5.",r:"FACTORISING: x²+5x+6. Pairs that multiply to 6: (1×6)(2×3). 2+3=5 ✓. So (x+2)(x+3)."},
  {id:"m30",s:"Maths",d:"hard",t:"Circle Geometry",q:"The area of a circle is 49π cm². What is the radius?",o:["7cm","14cm","7π cm","49cm"],a:"7cm",h:"Area of circle = πr². Set πr² = 49π and solve for r.",r:"CIRCLE: Area=πr². If πr²=49π → r²=49 → r=√49=7cm. Diameter=2r=14cm."},
  {id:"m31",s:"Maths",d:"hard",t:"Compound Percentages",q:"A number is increased by 20% then decreased by 20%. What is the overall % change?",o:["0%","−4%","+4%","−2%"],a:"−4%",h:"Try with a starting number like 100. Increase then decrease and see what happens.",r:"PERCENTAGE CHANGE: Start=100. +20%=120. −20% of 120=24. 120−24=96. Change=−4%. NOT additive."},
  {id:"m32",s:"Maths",d:"hard",t:"Angles",q:"The angles of a quadrilateral are 70°, 110°, 85°, and x°. Find x.",o:["85°","90°","95°","100°"],a:"95°",h:"Angles in a quadrilateral always add up to a specific total.",r:"QUADRILATERAL: sum=360°. 70+110+85+x=360 → 265+x=360 → x=95°. Formula: (n−2)×180°."},
  {id:"m33",s:"Maths",d:"hard",t:"Volume",q:"Volume of a cuboid is 120cm³, length 5cm, width 4cm. Find the height.",o:["4cm","5cm","6cm","7cm"],a:"6cm",h:"Volume = length × width × height. Rearrange to find height.",r:"VOLUME=l×w×h. 120=5×4×h → 120=20h → h=6cm. Volume in cubic units (cm³)."},
  {id:"m34",s:"Maths",d:"hard",t:"Compound Percentages",q:"A car depreciates 15% per year. Worth £20000 new — value after 2 years?",o:["£14450","£14400","£14000","£13250"],a:"£14450",h:"After year 1 it's worth 85% of the original. Then take 85% of THAT value.",r:"COMPOUND DEPRECIATION: Year1=20000×0.85=17000. Year2=17000×0.85=14450. Formula: 20000×(0.85)²."},
  {id:"m35",s:"Maths",d:"hard",t:"Number Sequences",q:"Find the nth term of: 3, 7, 11, 15, 19...",o:["2n+1","4n−1","3n+1","n+4"],a:"4n−1",h:"Find the common difference — it is the coefficient of n. Then work out the constant.",r:"NTH TERM: difference=4 so 4n. When n=1: 4×1=4 but need 3 → subtract 1 → 4n−1. Check: n=2: 7 ✓"},
  {id:"m36",s:"Maths",d:"hard",t:"Algebra",q:"Solve: 5(2x − 3) = 25",o:["4.5","3.5","4","5.5"],a:"4",h:"Expand the brackets first then solve the linear equation.",r:"EXPANDING: 5(2x−3)=25 → 10x−15=25 → 10x=40 → x=4. Check: 5(8−3)=5×5=25 ✓"},
  {id:"m37",s:"Maths",d:"hard",t:"Speed Distance Time",q:"Average speed for 12km at 16km/h then 8km at 8km/h?",o:["11km/h","12km/h","12.5km/h","11.4km/h"],a:"11.4km/h",h:"Average speed = TOTAL distance ÷ TOTAL time (not average of the two speeds).",r:"AVG SPEED=Total D÷Total T. T1=12÷16=0.75h. T2=8÷8=1h. 20km÷1.75h≈11.4km/h. NEVER average speeds."},
  // ── VERBAL REASONING · EASY ──────────────────────────────────────────────────
  {id:"v01",s:"Verbal Reasoning",d:"easy",t:"Analogies",q:"HOT is to COLD as DAY is to ___",o:["Sun","Night","Warm","Light"],a:"Night",h:"HOT and COLD are opposites. Find the opposite of DAY.",r:"ANALOGIES: Identify the relationship. HOT→COLD = antonyms. So DAY→NIGHT (also antonyms)."},
  {id:"v02",s:"Verbal Reasoning",d:"easy",t:"Odd One Out",q:"Which word does NOT belong: cat, dog, hamster, eagle, fish?",o:["cat","dog","hamster","eagle"],a:"eagle",h:"Think about what all the other words have in common. What makes one of them different?",r:"ODD ONE OUT: cat/dog/hamster/fish are household PETS. Eagle is a wild bird — not typically a pet."},
  {id:"v03",s:"Verbal Reasoning",d:"easy",t:"Number Sequences",q:"What is the missing number: 2, 4, 6, 8, ___?",o:["9","10","12","11"],a:"10",h:"These numbers increase by the same amount each time. Find the rule.",r:"NUMBER SEQUENCES: 2 4 6 8 10 — even numbers / adding 2 each time. Find the DIFFERENCE between terms."},
  {id:"v04",s:"Verbal Reasoning",d:"easy",t:"Hidden Words",q:"Find the hidden word in: GRANDFATHER",o:["and","ran","far","the"],a:"and",h:"A hidden word uses consecutive letters from inside a longer word. Work through systematically.",r:"HIDDEN WORDS: scan letters for 3-letter words. 'and' appears in gr-AND-father."},
  {id:"v05",s:"Verbal Reasoning",d:"easy",t:"Analogies",q:"BOOK is to READ as FORK is to ___",o:["Cook","Eat","Kitchen","Knife"],a:"Eat",h:"What do you DO with a book? Now what do you DO with a fork?",r:"FUNCTION ANALOGIES: A book is used TO READ. A fork is used TO EAT."},
  {id:"v06",s:"Verbal Reasoning",d:"easy",t:"Odd One Out",q:"Which word is the ODD ONE OUT: happy, glad, joyful, sad, elated?",o:["glad","elated","joyful","sad"],a:"sad",h:"Four of these words mean similar things. Which one means something different?",r:"SYNONYMS vs ANTONYMS: happy/glad/joyful/elated all mean feeling good. SAD is the antonym."},
  {id:"v07",s:"Verbal Reasoning",d:"easy",t:"Letter Sequences",q:"Find the missing letters: AB CD EF GH ___",o:["HI","IJ","IK","JK"],a:"IJ",h:"These are pairs of consecutive letters of the alphabet. What pair comes after GH?",r:"LETTER SEQUENCES: AB(1-2) CD(3-4) EF(5-6) GH(7-8) IJ(9-10). Each pair advances 2 positions."},
  {id:"v08",s:"Verbal Reasoning",d:"easy",t:"Analogies",q:"LARGE is to SMALL as HEAVY is to ___",o:["Big","Light","Weight","Thin"],a:"Light",h:"LARGE and SMALL are opposites. Find the opposite of HEAVY.",r:"ANTONYM ANALOGIES: Large↔Small (size opposites). Heavy↔Light (weight opposites)."},
  {id:"v09",s:"Verbal Reasoning",d:"easy",t:"Letter Sequences",q:"What is the RULE: AZ BY CX DW ___?",o:["EV","EU","FV","EW"],a:"EV",h:"Look at both letters together. The first goes forward through the alphabet; the second goes backward.",r:"DOUBLE SEQUENCE: First letters A B C D E (forwards). Second Z Y X W V (backwards). Next: EV."},
  {id:"v10",s:"Verbal Reasoning",d:"easy",t:"Collective Nouns",q:"BIRD is to FLOCK as FISH is to ___",o:["Pack","Herd","Shoal","Colony"],a:"Shoal",h:"A group of birds is a flock. What is the special word for a group of fish?",r:"COLLECTIVE NOUNS: Flock of birds/sheep. Shoal/school of fish. Pack of wolves. Pride of lions."},
  {id:"v11",s:"Verbal Reasoning",d:"easy",t:"Compound Words",q:"Find the word that can follow all three: FOOT ___ BASKET ___ HAND ___",o:["print","ball","stand","made"],a:"ball",h:"Which word can attach to the end of ALL THREE words to make compound words?",r:"COMPOUND WORDS: FOOTball ✓ BASKETball ✓ HANDball ✓. Test each option with all three words."},
  {id:"v12",s:"Verbal Reasoning",d:"easy",t:"Synonyms",q:"Which word is MOST SIMILAR in meaning to COURAGEOUS?",o:["Timid","Cowardly","Brave","Fearful"],a:"Brave",h:"Think of a person running into danger to help others.",r:"SYNONYMS for COURAGEOUS: Brave / Bold / Fearless / Valiant / Heroic / Daring."},
  {id:"v13",s:"Verbal Reasoning",d:"easy",t:"Word Building",q:"Move ONE letter from BRAND to make two new words: ___ and ___RAN",o:["B (gives RAND + BRAN)","R (gives BAND + BRAN)","A (gives BRND + ARAN)","D (gives BRAN + DRAN)"],a:"R (gives BAND + BRAN)",h:"Removing one letter from BRAND makes a new word. That removed letter goes before RAN.",r:"LETTER TRANSFER: BRAND−R=BAND ✓. Then R+RAN=BRAN ✓. Check BOTH words are valid."},
  {id:"v14",s:"Verbal Reasoning",d:"easy",t:"Vocabulary",q:"Complete the word: S_N_T_R (clue: a person who makes laws)",o:["Senator","Sanitor","Sunstar","Sonatar"],a:"Senator",h:"This is a person in government — think of American or Roman government.",r:"WORD COMPLETION: S_N_T_R = SENATOR. Technique: try common vowels (A E I O U) in each gap."},
  {id:"v15",s:"Verbal Reasoning",d:"easy",t:"Synonyms",q:"Which word is closest in meaning to BRAVE?",o:["Cowardly","Fearful","Valiant","Timid"],a:"Valiant",h:"Find the word that means showing great courage.",r:"SYNONYMS for BRAVE: Valiant / Bold / Courageous / Heroic / Fearless. Antonyms: Cowardly / Timid."},
  // ── VERBAL REASONING · MEDIUM ────────────────────────────────────────────────
  {id:"v16",s:"Verbal Reasoning",d:"medium",t:"Analogies",q:"PAINTER is to BRUSH as CARPENTER is to ___",o:["Nail","Hammer","Chisel","Saw"],a:"Hammer",h:"A painter's PRIMARY tool is a brush. What is the MAIN handheld tool of a carpenter?",r:"TOOL ANALOGIES: Painter uses Brush / Carpenter uses Hammer as primary striking tool."},
  {id:"v17",s:"Verbal Reasoning",d:"medium",t:"Letter-Number Sequences",q:"Complete the sequence: 1A 2B 3C ___",o:["4D","4E","5D","3D"],a:"4D",h:"Both the number and the letter are changing. What is the rule for each?",r:"DOUBLE SEQUENCES: Numbers 1 2 3 4 (+1). Letters A B C D (next letter). Both increase by one step → 4D."},
  {id:"v18",s:"Verbal Reasoning",d:"medium",t:"Letter Codes",q:"ABCD = BCDE in a code. What does LION code as?",o:["MJON","MJPO","MKPO","MJPO"],a:"MJPO",h:"Each letter moves one position forward in the alphabet.",r:"LETTER CODES (+1): A→B B→C C→D. Apply same rule: L→M I→J O→P N→O → MJPO."},
  {id:"v19",s:"Verbal Reasoning",d:"medium",t:"Odd One Out",q:"Which word is the odd one out: REGAL, NOBLE, ROYAL, PEASANT, MAJESTIC?",o:["ROYAL","NOBLE","REGAL","PEASANT"],a:"PEASANT",h:"Four words relate to kings and queens. One does not belong to that social class.",r:"ODD ONE OUT: REGAL/NOBLE/ROYAL/MAJESTIC describe royalty. PEASANT is the lowest social class."},
  {id:"v20",s:"Verbal Reasoning",d:"medium",t:"Analogies",q:"CHAPTER is to BOOK as SCENE is to ___",o:["Actor","Stage","Film","Movie"],a:"Film",h:"A chapter is a section of a book. A scene is a section of what?",r:"PART-TO-WHOLE ANALOGIES: Chapter is part of a Book. Scene is part of a Film/Movie/Play."},
  {id:"v21",s:"Verbal Reasoning",d:"medium",t:"Analogies",q:"FLAME is to FIRE as DROPLET is to ___",o:["Rain","Cloud","Water","River"],a:"Water",h:"A flame is a small unit of fire. A droplet is a small unit of what?",r:"PART-TO-WHOLE: Flame (small part) → Fire (whole). Droplet (small part) → Water (whole)."},
  {id:"v22",s:"Verbal Reasoning",d:"medium",t:"Hidden Words",q:"Find the hidden 4-letter word: The STAMPEDE caused chaos",o:["TAMP","AMPE","STAMP","PEDE"],a:"TAMP",h:"Look inside 'stampede' carefully for a 4-letter word.",r:"HIDDEN WORDS: sTAMPede → TAMP (to pack down firmly). Method: check each consecutive 4-letter group."},
  {id:"v23",s:"Verbal Reasoning",d:"medium",t:"Anagrams",q:"Which word cannot be made from the letters of TRANSPORT?",o:["SPORT","RANT","TRAPS","STONE"],a:"STONE",h:"Check each letter in the word carefully. Is every letter you need available in TRANSPORT?",r:"TRANSPORT has: T R A N S P O R T. STONE needs S T O N E — but there is no E in TRANSPORT."},
  {id:"v24",s:"Verbal Reasoning",d:"medium",t:"Letter Codes",q:"If CAT = 3120 (C=3, A=1, T=20), what is DOG?",o:["4158","4715","41524","4157"],a:"4157",h:"Each letter's code is its position in the alphabet. Find D, O, G's positions.",r:"ALPHABETICAL CODES: A=1 B=2...D=4 O=15 G=7. DOG=4/15/7 → written together=4157."},
  {id:"v25",s:"Verbal Reasoning",d:"medium",t:"Synonyms",q:"Find the pair closest in meaning: (sad unhappy) paired with (weep, weary, worn)",o:["weep","weary","worn","sad"],a:"weary",h:"Which word shares the most similar meaning with 'unhappy'?",r:"SYNONYM PAIRS: sad/unhappy (feeling low). WEARY (exhausted/worn-down) is closest to unhappy."},
  // ── VERBAL REASONING · HARD ──────────────────────────────────────────────────
  {id:"v26",s:"Verbal Reasoning",d:"hard",t:"Analogies",q:"METICULOUS is to CARELESS as TRANSPARENT is to ___",o:["Clear","Obvious","Opaque","Visible"],a:"Opaque",h:"METICULOUS (very careful) is opposite to CARELESS. Find the opposite of TRANSPARENT.",r:"ANTONYM ANALOGIES: Meticulous↔Careless. Transparent(see-through)↔Opaque(not see-through)."},
  {id:"v27",s:"Verbal Reasoning",d:"hard",t:"Letter Codes",q:"If FRIEND = GSJFOE in a code (each letter +1), what does HAPPY code as?",o:["IBQQZ","HAPQY","IBQPY","IBQPZ"],a:"IBQQZ",h:"Each letter moves exactly one forward in the alphabet. Apply to every letter of HAPPY.",r:"LETTER CODE (+1): H→I A→B P→Q P→Q Y→Z → IBQQZ. Apply the same shift consistently."},
  {id:"v28",s:"Verbal Reasoning",d:"hard",t:"Analogies",q:"DOCTOR is to STETHOSCOPE as ARTIST is to ___",o:["Canvas","Gallery","Paintbrush","Palette"],a:"Paintbrush",h:"A stethoscope is the PRIMARY diagnostic tool of a doctor. What is the primary TOOL of an artist?",r:"TOOL ANALOGIES: Doctor→Stethoscope (primary instrument). Artist→Paintbrush (primary tool)."},
  {id:"v29",s:"Verbal Reasoning",d:"hard",t:"Analogies",q:"PERPLEXED is to CONFUSED as ELATED is to ___",o:["Sad","Depressed","Ecstatic","Calm"],a:"Ecstatic",h:"PERPLEXED and CONFUSED are synonyms. Find the synonym of ELATED.",r:"SYNONYM ANALOGIES: Perplexed=Confused (puzzled). Elated (extremely happy)=Ecstatic/Overjoyed."},
  {id:"v30",s:"Verbal Reasoning",d:"hard",t:"Odd One Out",q:"Which is the odd one out: MERCURY, VENUS, EARTH, PLUTO, SATURN?",o:["VENUS","EARTH","MERCURY","PLUTO"],a:"PLUTO",h:"All but one are official planets in our solar system. One was reclassified.",r:"ODD ONE OUT: Mercury/Venus/Earth/Saturn are PLANETS. PLUTO was reclassified as 'dwarf planet' in 2006."},
  {id:"v31",s:"Verbal Reasoning",d:"hard",t:"Antonyms",q:"Which pair of words has the most OPPOSITE meaning: (CANDID FRANK) vs (DEVIOUS FORTHRIGHT)?",o:["candid and devious","frank and devious","candid and forthright","devious and forthright"],a:"devious and forthright",h:"Find the pair where the two words mean the most different things.",r:"ANTONYM PAIRS: DEVIOUS (dishonest, sneaky) ↔ FORTHRIGHT (direct, honest). Most opposite pair."},
  {id:"v32",s:"Verbal Reasoning",d:"hard",t:"Compound Words",q:"Find the word that connects: ___ BOARD ___ ROOM ___ WORK",o:["CARD","KEY","BED","HOME"],a:"KEY",h:"The missing word goes BEFORE all three to make compound words.",r:"COMPOUND PREFIX: KEY+BOARD=keyboard ✓ KEY+... check all. CARD+BOARD=cardboard ✓ but CARDroom?"},
  {id:"v33",s:"Verbal Reasoning",d:"hard",t:"Synonyms",q:"What is the best synonym for OBSTINATE?",o:["Flexible","Stubborn","Agreeable","Gentle"],a:"Stubborn",h:"Think of someone who refuses to change their mind no matter what.",r:"OBSTINATE = stubbornly refusing to change. Synonyms: Stubborn / Headstrong / Intransigent."},
  {id:"v34",s:"Verbal Reasoning",d:"hard",t:"Vocabulary Roots",q:"What does the prefix 'CIRCUM-' mean in the word CIRCUMNAVIGATE?",o:["Under","Through","Around","Above"],a:"Around",h:"Circumnavigate means to travel all the way around something — like a globe.",r:"LATIN PREFIXES: circum- (around): circumnavigate, circumference. sub- (under). per- (through)."},
  // ── NON-VERBAL REASONING · EASY ──────────────────────────────────────────────
  {id:"n01",s:"Non-Verbal Reasoning",d:"easy",t:"Shape Properties",q:"Which shape has the MOST sides: triangle, square, pentagon, or hexagon?",o:["Triangle","Square","Pentagon","Hexagon"],a:"Hexagon",h:"Count the sides of each shape carefully: tri=3 / quad=4 / pent=5 / hex=6.",r:"POLYGON SIDES: Triangle=3 / Square=4 / Pentagon=5 / Hexagon=6 / Heptagon=7 / Octagon=8."},
  {id:"n02",s:"Non-Verbal Reasoning",d:"easy",t:"Rotation",q:"A square is rotated 90° clockwise. How does it look?",o:["Wider rectangle","Same square","Taller rectangle","Diamond"],a:"Same square",h:"A square has equal sides and equal angles. What happens when you rotate it?",r:"ROTATION: A SQUARE looks identical after 90° rotation — all four sides are equal."},
  {id:"n03",s:"Non-Verbal Reasoning",d:"easy",t:"Symmetry",q:"How many lines of symmetry does a rectangle have?",o:["1","2","3","4"],a:"2",h:"A line of symmetry folds the shape so both halves match perfectly.",r:"LINES OF SYMMETRY: Rectangle=2 (horizontal and vertical midlines). Square=4. Circle=infinite."},
  {id:"n04",s:"Non-Verbal Reasoning",d:"easy",t:"Rotation",q:"An arrow points NORTH. It rotates 180°. Which direction does it now point?",o:["North","East","South","West"],a:"South",h:"180° is half a full turn. North is at the top — what is directly opposite?",r:"ROTATION: 180° = half turn (North→South / East→West). 360° = full turn back to start."},
  {id:"n05",s:"Non-Verbal Reasoning",d:"easy",t:"3D Shapes",q:"How many faces does a CUBE have?",o:["4","6","8","12"],a:"6",h:"Think of a dice — how many different numbered faces does it have?",r:"CUBE: 6 faces (all squares) / 12 edges / 8 vertices. Count: top bottom front back left right = 6."},
  {id:"n06",s:"Non-Verbal Reasoning",d:"easy",t:"Reflection",q:"A shape is reflected in a VERTICAL mirror line. What happens to the top-left corner?",o:["Moves to bottom-left","Moves to top-right","Moves to bottom-right","Stays the same"],a:"Moves to top-right",h:"A vertical mirror line flips left and right. Top stays top. Left becomes right.",r:"REFLECTION in vertical line: Left↔Right flip. Top/bottom stays same. Top-LEFT → top-RIGHT."},
  {id:"n07",s:"Non-Verbal Reasoning",d:"easy",t:"Shape Properties",q:"A shape has 4 equal sides and 4 right angles. What is it?",o:["Rectangle","Rhombus","Square","Parallelogram"],a:"Square",h:"A shape with 4 equal sides AND 4 right angles has a specific name.",r:"QUADRILATERALS: Square=4 equal sides+4 right angles. Rectangle=2 pairs equal sides+4 right angles."},
  {id:"n08",s:"Non-Verbal Reasoning",d:"easy",t:"Symmetry",q:"How many lines of symmetry does an EQUILATERAL TRIANGLE have?",o:["1","2","3","6"],a:"3",h:"An equilateral triangle has 3 equal sides. Each side has a special line from the opposite vertex.",r:"LINES OF SYMMETRY: Equilateral triangle=3. Regular shapes: sides = lines of symmetry."},
  {id:"n09",s:"Non-Verbal Reasoning",d:"easy",t:"Symmetry",q:"Which shape has rotational symmetry of ORDER 4?",o:["Isosceles Triangle","Rectangle","Square","Equilateral Triangle"],a:"Square",h:"Order 4 means the shape looks the same 4 times in one full 360° rotation.",r:"ROTATIONAL SYMMETRY ORDER: Square=4 (fits at 0° 90° 180° 270°). Rectangle=2. Equilateral triangle=3."},
  {id:"n10",s:"Non-Verbal Reasoning",d:"easy",t:"Sequences",q:"A sequence: small circle, medium circle, large circle, ___. What comes next?",o:["Small circle","Medium circle","Extra large circle","Square"],a:"Extra large circle",h:"The circles are getting bigger with each step. What is the pattern?",r:"SIZE SEQUENCES: Each term is larger than the previous. Small→Medium→Large→Extra Large."},
  {id:"n11",s:"Non-Verbal Reasoning",d:"easy",t:"Nets",q:"Which net folds to make a CUBE?",o:["A cross shape with 6 squares","A strip of 6 squares","An L-shape with 5 squares","A T-shape with 5 squares"],a:"A cross shape with 6 squares",h:"A cube has 6 faces. Which arrangement of 6 squares can fold up so no faces overlap?",r:"NETS OF CUBES: A valid net must have exactly 6 squares that fold without overlap."},
  {id:"n12",s:"Non-Verbal Reasoning",d:"easy",t:"Reflection",q:"In a mirror image (horizontal flip) of the letter 'd' — what do you get?",o:["b","p","q","d"],a:"b",h:"Imagine holding the letter 'd' up to a vertical mirror. The bump switches sides.",r:"LETTER REFLECTIONS in vertical mirror: d↔b (bump switches left/right). p↔q (below the line)."},
  {id:"n13",s:"Non-Verbal Reasoning",d:"easy",t:"Number Sequences",q:"A sequence shows: 1 dot, 3 dots, 6 dots, 10 dots, ___?",o:["12","14","15","16"],a:"15",h:"Find the differences: 1→3(+2) 3→6(+3) 6→10(+4). What is the next difference?",r:"TRIANGULAR NUMBERS: 1 3 6 10 15 21 — differences increase by 1 (+2 +3 +4 +5 +6)."},
  {id:"n14",s:"Non-Verbal Reasoning",d:"easy",t:"Odd One Out",q:"Which can NEVER have all equal sides: triangle, square, pentagon, or rectangle?",o:["Triangle","Square","Pentagon","Rectangle"],a:"Rectangle",h:"Three shapes can have all equal sides. Which one NEVER can?",r:"REGULAR POLYGONS have all sides equal. Triangle, Square, Pentagon can. RECTANGLE has two pairs."},
  {id:"n15",s:"Non-Verbal Reasoning",d:"easy",t:"Counting Shapes",q:"How many sides does a shape made by combining 2 rectangles in an L-shape have?",o:["6","8","10","4"],a:"6",h:"Count carefully around the outside of the L-shape.",r:"COMPOUND SHAPES: An L-shape made from 2 rectangles has 6 sides on its perimeter."},
  // ── NON-VERBAL REASONING · MEDIUM ────────────────────────────────────────────
  {id:"n16",s:"Non-Verbal Reasoning",d:"medium",t:"Matrix Patterns",q:"In a 3×3 grid, each row has one circle, one square, and one triangle. Row 1: circle, square, ___.",o:["Circle","Square","Triangle","Diamond"],a:"Triangle",h:"Each shape appears once per row. Row 1 already has circle and square — what is missing?",r:"LATIN SQUARE PATTERNS: Each symbol appears once per row and once per column."},
  {id:"n17",s:"Non-Verbal Reasoning",d:"medium",t:"Rotation",q:"An arrow points NE (45°). It rotates 90° clockwise. Where does it now point?",o:["N","SE","NW","E"],a:"SE",h:"90° clockwise from NE means turn right by a quarter. NE → SE.",r:"COMPASS ROTATION: Each 45° clockwise: N→NE→E→SE→S→SW→W→NW→N. NE+90°=SE."},
  {id:"n18",s:"Non-Verbal Reasoning",d:"medium",t:"Translation",q:"A vertex was at (1,4). Shape translated 3 right and 2 down. Where is the vertex now?",o:["(4,2)","(4,6)","(−2,4)","(3,2)"],a:"(4,2)",h:"Translation adds to coordinates: move right = +x / move down = −y.",r:"TRANSLATION: Right=+x / Left=−x / Up=+y / Down=−y. (1,4) → (1+3, 4−2) → (4,2)."},
  {id:"n19",s:"Non-Verbal Reasoning",d:"medium",t:"Shape Sequences",q:"Each shape gains one more side: triangle → square → pentagon → ___?",o:["Pentagon","Hexagon","Heptagon","Octagon"],a:"Hexagon",h:"Count: each step adds one more side. What comes after pentagon (5 sides)?",r:"POLYGON SEQUENCE: Triangle(3) Square(4) Pentagon(5) Hexagon(6) Heptagon(7) Octagon(8)."},
  {id:"n20",s:"Non-Verbal Reasoning",d:"medium",t:"Paper Folding",q:"Fold a square paper in half left-to-right, then top-to-bottom. Punch one hole in centre. How many holes when unfolded?",o:["1","2","3","4"],a:"4",h:"Each fold DOUBLES the number of layers. One hole through folded layers creates multiple holes.",r:"PAPER FOLDING: Fold1(2 layers) + Fold2(4 layers). One hole through 4 layers = 4 holes when unfolded."},
  {id:"n21",s:"Non-Verbal Reasoning",d:"medium",t:"Matrix Patterns",q:"In a 2×2 matrix: row 1 is (large dark circle, small light circle). Row 2: (large dark square, ___)?",o:["Large light square","Small dark square","Small light square","Large dark square"],a:"Small light square",h:"Find TWO rules: one for size (large→small) and one for shading (dark→light). Apply both.",r:"MATRIX RULES: Size: large→small. Shading: dark→light. Bottom-right = small light square."},
  {id:"n22",s:"Non-Verbal Reasoning",d:"medium",t:"Reflection",q:"A clock face shows 3:00. Reflected in a vertical mirror, what time does it show?",o:["9:00","6:00","3:00","12:00"],a:"9:00",h:"A vertical mirror flips left and right. The 3 (on the right) moves to where 9 is (on the left).",r:"REFLECTION of CLOCK: Vertical mirror flips 3↔9 / 2↔10 / 1↔11. 3:00 reflected = 9:00."},
  {id:"n23",s:"Non-Verbal Reasoning",d:"medium",t:"Spatial Patterns",q:"Sequence: 1 dot, 9 dots (ring added), 25 dots (next ring). What is term 4?",o:["36","41","49","45"],a:"49",h:"The rings add 8 more dots each time: 8, 16, 24... What is term 4?",r:"RING PATTERNS: 1/9/25/49 — these are SQUARE NUMBERS: 1²/3²/5²/7². Next: 7²=49."},
  {id:"n24",s:"Non-Verbal Reasoning",d:"medium",t:"3D Visualisation",q:"Seen from above, a block looks like an L. From the front it looks like a rectangle. What is the shape?",o:["Sphere","Cube","L-shaped prism","Pyramid"],a:"L-shaped prism",h:"The top view shows an L. The front view shows a rectangle. Which 3D shape gives both?",r:"3D VISUALISATION: Top view=L, Front view=rectangle → L-shaped prism (like a staircase)."},
  {id:"n25",s:"Non-Verbal Reasoning",d:"medium",t:"Shape Sequences",q:"Number of sides DOUBLES each term: Term1=3, Term2=6, Term3=12. What shape could term 3 be?",o:["Triangle","Hexagon","Decagon","Dodecagon"],a:"Dodecagon",h:"Count the sides: 3→6→12. A 12-sided polygon has a specific name.",r:"DOUBLING SEQUENCES: 3→6→12 (×2 each time). 12-sided polygon = DODECAGON. dodeca=12."},
  // ── NON-VERBAL REASONING · HARD ──────────────────────────────────────────────
  {id:"n26",s:"Non-Verbal Reasoning",d:"hard",t:"Matrix Patterns",q:"In a matrix, shapes rotate 90° clockwise AND size increases left to right. Top row: small circle, medium circle, ___?",o:["Large rotated circle","Large circle","Small square","Medium square"],a:"Large circle",h:"Apply BOTH rules: rotation (circle stays circle) and size increase.",r:"COMPOUND RULES: Rule1=rotate 90° (circle unchanged). Rule2=small→medium→large. Result: LARGE circle."},
  {id:"n27",s:"Non-Verbal Reasoning",d:"hard",t:"Number Sequences",q:"Alternating rules — odd terms ×2, even terms +3. Sequence: 2, 5, 10, 13, 26, ___",o:["29","52","28","31"],a:"29",h:"Term 6 is an even term — apply the +3 rule to term 5.",r:"ALTERNATING RULES: 2→5(+3)→10(×2)→13(+3)→26(×2)→29(+3). Pattern alternates: +3 then ×2."},
  {id:"n28",s:"Non-Verbal Reasoning",d:"hard",t:"Paper Folding",q:"Paper folded in thirds (like a letter). A hole is punched in the centre of the folded strip. How many holes when unfolded?",o:["1","2","3","4"],a:"3",h:"Folding in thirds creates 3 layers. One punch through 3 layers = how many holes?",r:"PAPER FOLDING in thirds: 3 layers of paper. One hole punched = 3 holes evenly spaced."},
  {id:"n29",s:"Non-Verbal Reasoning",d:"hard",t:"3D Rotation",q:"A cube: top=red, front=green, right=orange. Rotated 90° to the right. What colour is now on front?",o:["Green","Orange","White","Yellow"],a:"Orange",h:"When you tip a cube to the RIGHT — the right face rotates to become the front face.",r:"CUBE ROTATION 90° right: Right→Front / Front→Left / Left→Back / Back→Right. Orange was right."},
  {id:"n30",s:"Non-Verbal Reasoning",d:"hard",t:"Spatial Patterns",q:"An n×n grid has a diagonal line of shaded cells. How many UNSHADED cells in a 5×5 grid?",o:["20","21","22","25"],a:"20",h:"Find the pattern: shaded cells = n (the diagonal). Unshaded = n² − n.",r:"GRID PATTERNS: n×n grid=n² cells. Diagonal=n cells. Unshaded=n²−n. For 5×5: 25−5=20."},
  {id:"n31",s:"Non-Verbal Reasoning",d:"hard",t:"3D Shapes",q:"A shape has 5 faces, 8 edges, and 5 vertices. Using Euler's formula (F+V−E=2), what is the shape?",o:["Cube","Triangular prism","Square-based pyramid","Tetrahedron"],a:"Square-based pyramid",h:"Check F+V−E: 5+5−8=2 ✓. Now identify: 5 faces = 1 square base + 4 triangular faces.",r:"EULER'S FORMULA: F+V−E=2 for all convex polyhedra. Square pyramid: F=5, V=5, E=8."},
  {id:"n32",s:"Non-Verbal Reasoning",d:"hard",t:"Logic Patterns",q:"Rule: combine two shapes sets — remove shapes that appear in BOTH. {circle,pentagon}+{triangle,pentagon} = ___",o:["{circle,triangle}","{triangle,circle,pentagon}","{circle,square}","{pentagon}"],a:"{circle,triangle}",h:"Pentagon appears in BOTH sets, so remove it. Keep shapes that appear in only one set.",r:"SET OPERATIONS (XOR/Symmetric difference): remove items appearing in both sets. Pentagon→removed."},
  {id:"n33",s:"Non-Verbal Reasoning",d:"hard",t:"Spatial Patterns",q:"Hexagonal packing: centre=1, ring1=6, ring2=12. How many hexagons total in the first 2 rings?",o:["7","19","37","12"],a:"19",h:"Centre=1. Ring 1=6 hexagons. Ring 2=12 hexagons. Add them all up.",r:"HEXAGONAL PACKING: 1+6+12=19. Each ring n has 6n hexagons. Total: 1+6+12+18..."},
];

// ─────────────────────────────────────────────────────────────────────────────
// ADAPTIVE ENGINE
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECTS = ["English","Maths","Verbal Reasoning","Non-Verbal Reasoning"];
const DIFFICULTIES = ["easy","medium","hard"];
const SUBJECT_META = {
  "English":               { icon:"📖", color:"#818cf8", bg:"rgba(129,140,248,0.15)", border:"rgba(129,140,248,0.35)", gradient:"linear-gradient(135deg,#4338ca,#6366f1)" },
  "Maths":                 { icon:"🔢", color:"#34d399", bg:"rgba(52,211,153,0.15)",  border:"rgba(52,211,153,0.35)",  gradient:"linear-gradient(135deg,#065f46,#10b981)" },
  "Verbal Reasoning":      { icon:"💬", color:"#fbbf24", bg:"rgba(251,191,36,0.15)",  border:"rgba(251,191,36,0.35)",  gradient:"linear-gradient(135deg,#92400e,#f59e0b)" },
  "Non-Verbal Reasoning":  { icon:"🔷", color:"#a78bfa", bg:"rgba(167,139,250,0.15)", border:"rgba(167,139,250,0.35)", gradient:"linear-gradient(135deg,#4c1d95,#8b5cf6)" },
};
const DIFF_META = {
  easy:   { label:"Foundation", color:"#34d399", icon:"🌱" },
  medium: { label:"Applied",    color:"#fbbf24", icon:"⚡" },
  hard:   { label:"Exam Style", color:"#f43f5e", icon:"🏆" },
};

function initProgress() {
  const p = {};
  SUBJECTS.forEach(s => {
    p[s] = { xp:0, streak:0, lastCorrect:0, history:[], currentDiff:"easy", recentResults:[] };
  });
  return p;
}

// Pick the best next question for a subject given current state
function pickQuestion(subject, progress, extraQuestions) {
  const p = progress[subject];
  const diff = p.currentDiff;
  const seen = new Set(p.history);
  const pool = [...BANK, ...(extraQuestions || [])].filter(q =>
    q.s === subject && q.d === diff && !seen.has(q.id)
  );
  if (pool.length === 0) {
    // Try other difficulties if current is exhausted
    for (const d of DIFFICULTIES) {
      const fallback = [...BANK, ...(extraQuestions || [])].filter(q => q.s === subject && q.d === d && !seen.has(q.id));
      if (fallback.length > 0) return fallback[Math.floor(Math.random() * fallback.length)];
    }
    // All questions seen — reset history but keep stats
    p.history = [];
    return BANK.filter(q => q.s === subject && q.d === diff)[0];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// Update difficulty based on recent performance
function updateDifficulty(progress, subject, wasCorrect, attempts) {
  const p = { ...progress };
  const sp = { ...p[subject] };
  sp.recentResults = [...(sp.recentResults || []).slice(-4), wasCorrect && attempts === 1 ? 1 : 0];
  const accuracy = sp.recentResults.reduce((a, b) => a + b, 0) / sp.recentResults.length;
  if (sp.recentResults.length >= 3) {
    if (accuracy >= 0.75 && sp.currentDiff === "easy") sp.currentDiff = "medium";
    else if (accuracy >= 0.75 && sp.currentDiff === "medium") sp.currentDiff = "hard";
    else if (accuracy < 0.35 && sp.currentDiff === "hard") sp.currentDiff = "medium";
    else if (accuracy < 0.35 && sp.currentDiff === "medium") sp.currentDiff = "easy";
  }
  p[subject] = sp;
  return p;
}

function xpForAttempts(attempts, revealed) {
  if (revealed) return 0;
  return Math.max(40 - (attempts - 1) * 10, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & HERO GENERATION
// ─────────────────────────────────────────────────────────────────────────────
const HERO_ADJECTIVES = ["Brave","Swift","Bold","Wise","Quick","Calm","Sharp","Bright","Fierce","Noble","Clever","Steady"];
const HERO_ANIMALS    = ["Owl","Eagle","Fox","Wolf","Hawk","Bear","Lynx","Deer","Raven","Lion","Tiger","Crane"];
const AVATARS = [
  { id:0, emoji:"🦉", label:"Owl",    color:"#f59e0b" },

// ─────────────────────────────────────────────────────────────────────────────
// 6-TIER LEVEL SYSTEM  Foundation → Bronze → Silver → Gold → Platinum → Higher
// ─────────────────────────────────────────────────────────────────────────────
const LEVELS = [
  { id:"foundation", label:"Foundation", shortLabel:"Found.",  icon:"🌱", color:"#34d399", bg:"rgba(52,211,153,0.12)",  border:"rgba(52,211,153,0.3)",  qDiffs:["easy"],           xpNeeded:0,    desc:"Build the basics",       badge:"First Steps"   },
  { id:"bronze",     label:"Bronze",     shortLabel:"Bronze",  icon:"🥉", color:"#f97316", bg:"rgba(249,115,22,0.12)",  border:"rgba(249,115,22,0.3)",  qDiffs:["easy","medium"],  xpNeeded:120,  desc:"Growing confidence",     badge:"Rising Star"   },
  { id:"silver",     label:"Silver",     shortLabel:"Silver",  icon:"🥈", color:"#94a3b8", bg:"rgba(148,163,184,0.12)", border:"rgba(148,163,184,0.3)", qDiffs:["medium"],         xpNeeded:300,  desc:"Applying knowledge",     badge:"Scholar"       },
  { id:"gold",       label:"Gold",       shortLabel:"Gold",    icon:"🥇", color:"#f59e0b", bg:"rgba(245,158,11,0.12)",  border:"rgba(245,158,11,0.3)",  qDiffs:["medium","hard"],  xpNeeded:600,  desc:"Rising to challenges",   badge:"High Achiever" },
  { id:"platinum",   label:"Platinum",   shortLabel:"Plat.",   icon:"💎", color:"#818cf8", bg:"rgba(129,140,248,0.12)", border:"rgba(129,140,248,0.3)", qDiffs:["hard"],           xpNeeded:1000, desc:"Exam-ready thinking",    badge:"Elite Scholar" },
  { id:"higher",     label:"Higher",     shortLabel:"Higher",  icon:"🏆", color:"#a78bfa", bg:"rgba(167,139,250,0.15)", border:"rgba(167,139,250,0.4)", qDiffs:["hard"],           xpNeeded:1500, desc:"11+ Exam Standard",      badge:"Quest Master"  },
];

const getLevelForXP = (xp) => {
  let level = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.xpNeeded) level = l; else break; }
  return level;
};
const getNextLevel = (currentLevelId) => {
  const idx = LEVELS.findIndex(l => l.id === currentLevelId);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
};
const xpToNextLevel = (xp) => {
  const next = getNextLevel(getLevelForXP(xp).id);
  return next ? { needed: next.xpNeeded - xp, nextLabel: next.label, pct: Math.round(((xp - getLevelForXP(xp).xpNeeded) / (next.xpNeeded - getLevelForXP(xp).xpNeeded)) * 100) } : null;
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT META
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECTS = ["English","Maths","Verbal Reasoning","Non-Verbal Reasoning"];
const SUBJECT_META = {
  "English":               { icon:"📖", color:"#818cf8", bg:"rgba(129,140,248,0.12)", border:"rgba(129,140,248,0.3)", gradient:"linear-gradient(135deg,#4338ca,#6366f1)" },
  "Maths":                 { icon:"🔢", color:"#34d399", bg:"rgba(52,211,153,0.12)",  border:"rgba(52,211,153,0.3)",  gradient:"linear-gradient(135deg,#065f46,#10b981)" },
  "Verbal Reasoning":      { icon:"💬", color:"#fbbf24", bg:"rgba(251,191,36,0.12)",  border:"rgba(251,191,36,0.3)",  gradient:"linear-gradient(135deg,#92400e,#f59e0b)" },
  "Non-Verbal Reasoning":  { icon:"🔷", color:"#a78bfa", bg:"rgba(167,139,250,0.12)", border:"rgba(167,139,250,0.3)", gradient:"linear-gradient(135deg,#4c1d95,#8b5cf6)" },
};

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENT STORAGE  (window.storage API)
// ─────────────────────────────────────────────────────────────────────────────
const hashPin = async (pin) => {
  try {
    const encoded = new TextEncoder().encode(pin + "quest-academy-salt-v2");
    const buf = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
  } catch { return btoa(pin + "quest-salt"); } // fallback
};

const verifyPin = async (input, storedHash) => {
  const h = await hashPin(input);
  return h === storedHash;
};

const saveProfile = async (profile) => {
  try { await window.storage.set("quest:profile", JSON.stringify(profile)); } catch(e) { console.warn("Storage unavailable", e); }
};
const loadProfile = async () => {
  try { const r = await window.storage.get("quest:profile"); return r ? JSON.parse(r.value) : null; } catch { return null; }
};
const saveProgress = async (progress) => {
  try { await window.storage.set("quest:progress", JSON.stringify(progress)); } catch(e) { console.warn("Storage unavailable", e); }
};
const loadProgress = async () => {
  try { const r = await window.storage.get("quest:progress"); return r ? JSON.parse(r.value) : null; } catch { return null; }
};
const saveExtraQs = async (qs) => {
  try { await window.storage.set("quest:extra-questions", JSON.stringify(qs)); } catch {}
};
const loadExtraQs = async () => {
  try { const r = await window.storage.get("quest:extra-questions"); return r ? JSON.parse(r.value) : []; } catch { return []; }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADAPTIVE ENGINE
// ─────────────────────────────────────────────────────────────────────────────
const initProgress = () => {
  const p = {};
  SUBJECTS.forEach(s => { p[s] = { xp:0, history:[], recentResults:[], streak:0 }; });
  return p;
};

const pickQuestion = (subject, progress, extraQuestions=[]) => {
  const sp = progress[subject];
  const xp = sp?.xp || 0;
  const level = getLevelForXP(xp);
  const seen = new Set(sp?.history || []);
  const allowedDiffs = level.qDiffs;

  // Unseen first
  const pool = [...BANK, ...extraQuestions].filter(q =>
    q.s === subject && allowedDiffs.includes(q.d) && !seen.has(q.id)
  );
  if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];

  // Fallback: any unseen across all diffs
  const fallback = [...BANK, ...extraQuestions].filter(q => q.s === subject && !seen.has(q.id));
  if (fallback.length > 0) return fallback[Math.floor(Math.random() * fallback.length)];

  // All seen — reset history
  const resetSeen = [...BANK, ...extraQuestions].filter(q => q.s === subject && allowedDiffs.includes(q.d));
  return resetSeen[Math.floor(Math.random() * resetSeen.length)];
};

const xpForAttempts = (attempts, revealed) => {
  if (revealed) return 0;
  return Math.max(40 - (attempts - 1) * 10, 10);
};

const updateProgress = (progress, subject, wasCorrect, attempts, qId) => {
  const sp = progress[subject];
  const xpGain = xpForAttempts(attempts, !wasCorrect);
  const newXP = (sp.xp || 0) + (wasCorrect ? xpGain : 0);
  const newHistory = [...(sp.history || []), qId];
  const newRecent = [...(sp.recentResults || []).slice(-9), wasCorrect && attempts === 1 ? 1 : 0];
  const newStreak = wasCorrect ? (sp.streak || 0) + 1 : 0;
  return { ...progress, [subject]: { ...sp, xp: newXP, history: newHistory, recentResults: newRecent, streak: newStreak } };
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const HERO_ADJECTIVES = ["Brave","Swift","Bold","Wise","Quick","Calm","Sharp","Bright","Fierce","Noble","Clever","Steady"];
const HERO_ANIMALS    = ["Owl","Eagle","Fox","Wolf","Hawk","Bear","Lynx","Deer","Raven","Lion","Tiger","Crane"];
const AVATARS = [
  {id:0,emoji:"🦉",label:"Owl",   color:"#f59e0b"},{id:1,emoji:"🦅",label:"Eagle",color:"#818cf8"},
  {id:2,emoji:"🦊",label:"Fox",   color:"#f97316"},{id:3,emoji:"🐺",label:"Wolf", color:"#94a3b8"},
  {id:4,emoji:"🦜",label:"Parrot",color:"#34d399"},{id:5,emoji:"🐻",label:"Bear", color:"#a78bfa"},
  {id:6,emoji:"🦁",label:"Lion",  color:"#fbbf24"},{id:7,emoji:"🦌",label:"Deer", color:"#6ee7b7"},
];
const genHeroName = () => `${HERO_ADJECTIVES[Math.floor(Math.random()*12)]}-${HERO_ANIMALS[Math.floor(Math.random()*12)]}-${Math.floor(Math.random()*89)+10}`;

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Lora:wght@500&family=DM+Sans:wght@400;600;700;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
input,button,select{font-family:'DM Sans',sans-serif;outline:none;}
::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}
@keyframes fadeUp    {from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn    {from{opacity:0}to{opacity:1}}
@keyframes float     {0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes spin      {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes popIn     {0%{transform:scale(0.7);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
@keyframes heroReveal{0%{opacity:0;transform:scale(0.6)rotate(-8deg)}60%{transform:scale(1.08)rotate(2deg)}100%{opacity:1;transform:scale(1)rotate(0)}}
@keyframes shake     {0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@keyframes successPop{0%{transform:scale(0.9);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
@keyframes correctPop{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
@keyframes pinDigit  {0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
@keyframes starFloat {0%,100%{opacity:0.15;transform:translateY(0)}50%{opacity:0.5;transform:translateY(-8px)}}
@keyframes xpBurst   {0%{opacity:0;transform:scale(0.5)translateY(10px)}25%{opacity:1;transform:scale(1.2)translateY(-20px)}70%{opacity:1;transform:scale(1)translateY(-35px)}100%{opacity:0;transform:translateY(-65px)}}
@keyframes levelUp   {0%{opacity:0;transform:scale(0.5)rotate(-15deg)}50%{opacity:1;transform:scale(1.15)rotate(3deg)}100%{opacity:1;transform:scale(1)rotate(0)}}
@keyframes hintSlide {from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes revealDrop{from{opacity:0;transform:scale(0.97)translateY(8px)}to{opacity:1;transform:scale(1)translateY(0)}}
@keyframes genPulse  {0%,100%{opacity:0.4}50%{opacity:1}}
@keyframes shimmer   {0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes slideIn   {from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes toastIn   {0%{opacity:0;transform:translateY(-16px)scale(0.9)}60%{transform:translateY(4px)scale(1.02)}100%{opacity:1;transform:translateY(0)scale(1)}}
`;

// ─────────────────────────────────────────────────────────────────────────────
// ATOM COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Screen({ children, style={} }) {
  const stars = useRef([...Array(36)].map(()=>({x:Math.random()*100,y:Math.random()*100,s:Math.random()*1.5+0.5,d:Math.random()*4+2,dl:Math.random()*3}))).current;
  return (
    <div style={{minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",background:"radial-gradient(ellipse at 15% 10%,#0e1e4a 0%,#020817 55%,#080f2e 100%)",position:"relative",overflow:"hidden",...style}}>
      <style>{CSS}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>{stars.map((s,i)=><div key={i} style={{position:"absolute",width:s.s,height:s.s,borderRadius:"50%",background:"white",left:`${s.x}%`,top:`${s.y}%`,animation:`starFloat ${s.d}s ease-in-out infinite`,animationDelay:`${s.dl}s`}}/>)}</div>
      <div style={{position:"relative",zIndex:1}}>{children}</div>
    </div>
  );
}
function Card({children,style={}}){return <div style={{background:"rgba(15,23,42,0.88)",backdropFilter:"blur(14px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:24,padding:"28px 24px",...style}}>{children}</div>;}
function GoldBtn({children,onClick,disabled,style={}}){return <button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"14px 20px",borderRadius:14,border:"none",background:disabled?"#1e293b":"linear-gradient(135deg,#f59e0b,#d97706)",color:disabled?"#475569":"#0f172a",fontWeight:900,fontSize:15,cursor:disabled?"not-allowed":"pointer",letterSpacing:"0.03em",transition:"all 0.2s",boxShadow:disabled?"none":"0 6px 20px rgba(245,158,11,0.25)",...style}} onMouseEnter={e=>{if(!disabled){e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow="0 10px 28px rgba(245,158,11,0.35)";}}} onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow=disabled?"none":"0 6px 20px rgba(245,158,11,0.25)"}}>{children}</button>;}
function GhostBtn({children,onClick,style={}}){return <button onClick={onClick} style={{width:"100%",padding:"13px 20px",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#64748b",fontWeight:700,fontSize:14,cursor:"pointer",transition:"all 0.2s",...style}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.25)";e.currentTarget.style.color="#94a3b8";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="#64748b";}}>{children}</button>;}
function TextInput({label,value,onChange,type="text",placeholder}){const[f,setF]=useState(false);return <div style={{marginBottom:16}}>{label&&<p style={{fontSize:12,fontWeight:700,color:"#475569",marginBottom:7,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</p>}<input type={type} value={value} onChange={onChange} placeholder={placeholder} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{width:"100%",padding:"14px 16px",borderRadius:14,fontSize:15,background:"rgba(255,255,255,0.04)",color:"#e2e8f0",border:`1.5px solid ${f?"rgba(245,158,11,0.5)":"rgba(255,255,255,0.09)"}`,transition:"border-color 0.2s"}}/></div>;}
function ProgressDots({total,current}){return <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:28}}>{Array.from({length:total}).map((_,i)=><div key={i} style={{width:i===current?20:7,height:7,borderRadius:999,background:i<=current?"#f59e0b":"rgba(255,255,255,0.1)",transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}/>)}</div>;}
function NumPad({value,onChange,max=4}){
  const add=n=>{if(value.length<max)onChange(value+n)};const del=()=>onChange(value.slice(0,-1));
  return <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,maxWidth:260,margin:"0 auto"}}>{[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k,i)=>k===""?<div key={i}/>:<button key={i} onClick={()=>k==="⌫"?del():add(String(k))} style={{height:62,borderRadius:16,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:k==="⌫"?"#f43f5e":"#e2e8f0",fontSize:k==="⌫"?20:22,fontWeight:700,cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(245,158,11,0.12)";e.currentTarget.style.borderColor="rgba(245,158,11,0.3)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";}}>{k}</button>)}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL PATH  (visual progression map shown on home screen)
// ─────────────────────────────────────────────────────────────────────────────
function LevelPathMap({ subjectXP }) {
  // Show highest level achieved across all subjects
  const maxXP = Math.max(...SUBJECTS.map(s => subjectXP[s] || 0));
  const currentLevel = getLevelForXP(maxXP);
  const nextLvl = getNextLevel(currentLevel.id);
  const toNext = nextLvl ? xpToNextLevel(maxXP) : null;

  return (
    <div style={{marginBottom:24,animation:"fadeUp 0.5s ease-out"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <p style={{fontSize:11,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:"0.1em"}}>Your Quest Path</p>
        {toNext&&<span style={{fontSize:11,color:"#475569"}}>{toNext.needed} XP to {toNext.nextLabel}</span>}
      </div>

      {/* Level nodes */}
      <div style={{display:"flex",alignItems:"center",gap:0,overflowX:"auto",paddingBottom:4}}>
        {LEVELS.map((lvl,i)=>{
          const unlocked = maxXP >= lvl.xpNeeded;
          const isCurrent = currentLevel.id === lvl.id;
          const isLast = i === LEVELS.length-1;
          return (
            <div key={lvl.id} style={{display:"flex",alignItems:"center",flexShrink:0}}>
              {/* Node */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,width:52}}>
                <div style={{
                  width:isCurrent?42:34, height:isCurrent?42:34, borderRadius:"50%",
                  background:unlocked?lvl.bg:"rgba(15,23,42,0.8)",
                  border:`2px solid ${unlocked?lvl.color:"rgba(255,255,255,0.08)"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:isCurrent?20:15, transition:"all 0.4s ease",
                  boxShadow:isCurrent?`0 0 18px ${lvl.color}60`:"none",
                  animation:isCurrent?"pulse 2s ease-in-out infinite":"none",
                  filter:unlocked?"none":"grayscale(1) opacity(0.4)",
                }}>
                  {unlocked?lvl.icon:"🔒"}
                </div>
                <span style={{fontSize:9,fontWeight:700,color:unlocked?lvl.color:"#334155",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"center",lineHeight:1.2}}>
                  {lvl.shortLabel}
                </span>
              </div>
              {/* Connector */}
              {!isLast&&<div style={{width:16,height:2,background:maxXP>=LEVELS[i+1].xpNeeded?"linear-gradient(90deg,"+lvl.color+","+LEVELS[i+1].color+")":"rgba(255,255,255,0.07)",borderRadius:1,marginBottom:18,flexShrink:0}}/>}
            </div>
          );
        })}
      </div>

      {/* XP bar to next level */}
      {toNext&&(
        <div style={{marginTop:8}}>
          <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${toNext.pct}%`,background:`linear-gradient(90deg,${currentLevel.color},${nextLvl?.color||currentLevel.color})`,borderRadius:2,transition:"width 1s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:10,color:"#334155"}}>
            <span style={{color:currentLevel.color,fontWeight:700}}>{currentLevel.icon} {currentLevel.label}</span>
            <span style={{fontWeight:700}}>{toNext.pct}%</span>
            <span style={{color:nextLvl?.color,fontWeight:700}}>{nextLvl?.icon} {nextLvl?.label}</span>
          </div>
        </div>
      )}
      {!toNext&&<div style={{marginTop:8,textAlign:"center",fontSize:11,color:"#a78bfa",fontWeight:700,animation:"pulse 2s ease-in-out infinite"}}>🏆 Maximum Level Achieved!</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH SCREENS
// ─────────────────────────────────────────────────────────────────────────────
function AuthLanding({onSignup,onParentLogin,onChildLogin}){
  return (
    <Screen>
      <div style={{maxWidth:400,margin:"0 auto",padding:"48px 20px 40px",animation:"fadeUp 0.5s ease-out"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:72,animation:"float 3s ease-in-out infinite",display:"inline-block",filter:"drop-shadow(0 0 28px rgba(245,158,11,0.45))"}}>🦉</div>
          <h1 style={{fontFamily:"'Cinzel',serif",fontSize:28,color:"#fff",margin:"12px 0 6px",letterSpacing:"0.06em"}}>Quest Academy</h1>
          <p style={{color:"#475569",fontSize:14}}>11+ preparation · Ages 6–11</p>
        </div>
        <Card>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <GoldBtn onClick={onChildLogin}>🎮 I'm a Child — Log In</GoldBtn>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <button onClick={onParentLogin} style={{padding:"13px 14px",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.03)",color:"#94a3b8",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(16,185,129,0.4)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}>👨‍👩‍👧 Parent Login</button>
              <button onClick={onSignup} style={{padding:"13px 14px",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.03)",color:"#94a3b8",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(99,102,241,0.4)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}> ✨ New Account</button>
            </div>
          </div>
        </Card>
        <p style={{textAlign:"center",fontSize:11,color:"#1e293b",marginTop:20}}>🛡️ No real names · Hero Names only · COPPA compliant</p>
      </div>
    </Screen>
  );
}

function ChildLogin({onBack,onComplete}){
  const [pin,setPin]=useState(""); const [shake,setShake]=useState(false); const [loading,setLoading]=useState(false); const [err,setErr]=useState("");

  const tryLogin = useCallback(async (p) => {
    setLoading(true);
    try {
      const stored = await loadProfile();
      if (!stored?.pinHash) {
        // Demo mode — accept 1234
        if (p === "1234") { onComplete(stored || { heroName:"Quest Hero", avatar:AVATARS[0], age:9 }); }
        else { setShake(true); setPin(""); setErr("Wrong PIN"); setTimeout(()=>{setShake(false);setErr("");},600); }
      } else {
        const ok = await verifyPin(p, stored.pinHash);
        if (ok) { onComplete(stored); }
        else { setShake(true); setPin(""); setErr("Wrong PIN — try again"); setTimeout(()=>{setShake(false);setErr("");},600); }
      }
    } catch { setErr("Login error — please try again"); }
    setLoading(false);
  }, [onComplete]);

  useEffect(()=>{ if(pin.length===4) tryLogin(pin); },[pin]);

  return (
    <Screen>
      <div style={{maxWidth:380,margin:"0 auto",padding:"48px 20px",animation:"fadeUp 0.4s ease-out"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#475569",fontSize:22,cursor:"pointer",marginBottom:28}}>‹ Back</button>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:52,marginBottom:12}}>{loading?"⏳":"🔐"}</div>
          <h2 style={{fontFamily:"'Cinzel',serif",fontSize:22,color:"#fff",marginBottom:6}}>Enter your PIN</h2>
          <p style={{fontSize:13,color:"#475569"}}>Demo PIN: <strong style={{color:"#f59e0b"}}>1234</strong></p>
        </div>
        <div style={{display:"flex",gap:14,justifyContent:"center",marginBottom:28,animation:shake?"shake 0.5s ease-out":"none"}}>
          {Array.from({length:4}).map((_,i)=><div key={i} style={{width:18,height:18,borderRadius:"50%",background:i<pin.length?"#f59e0b":"transparent",border:`2.5px solid ${i<pin.length?"#f59e0b":"rgba(255,255,255,0.15)"}`,boxShadow:i<pin.length?"0 0 10px rgba(245,158,11,0.5)":"none"}}/>)}
        </div>
        <NumPad value={pin} onChange={setPin}/>
        {err&&<p style={{textAlign:"center",fontSize:13,color:"#f43f5e",marginTop:14}}>{err}</p>}
      </div>
    </Screen>
  );
}

function ParentLogin({onBack,onComplete}){
  const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[loading,setLoading]=useState(false);
  return (
    <Screen>
      <div style={{maxWidth:400,margin:"0 auto",padding:"40px 20px",animation:"fadeUp 0.4s ease-out"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#475569",fontSize:22,cursor:"pointer",marginBottom:28}}>‹ Back</button>
        <Card>
          <h2 style={{fontFamily:"'Cinzel',serif",fontSize:20,color:"#fff",marginBottom:20}}>Parent Login</h2>
          <TextInput label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="parent@email.com"/>
          <TextInput label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/>
          <GoldBtn onClick={()=>{setLoading(true);setTimeout(onComplete,1200);}} disabled={loading||!email||!pass}>{loading?"Signing in…":"Sign In →"}</GoldBtn>
        </Card>
      </div>
    </Screen>
  );
}

function ParentSignup({onBack,onComplete}){
  const[step,setStep]=useState(0);const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[confirm,setConfirm]=useState("");const[loading,setLoading]=useState(false);const[err,setErr]=useState("");
  const next=()=>{
    if(step===0){if(!email.includes("@")){setErr("Enter a valid email");return;}setErr("");setStep(1);}
    else if(step===1){if(pass.length<8){setErr("Password must be 8+ characters");return;}if(pass!==confirm){setErr("Passwords don't match");return;}setLoading(true);setTimeout(()=>{setLoading(false);setStep(2);},1200);}
    else onComplete({email});
  };
  return (
    <Screen>
      <div style={{maxWidth:400,margin:"0 auto",padding:"40px 20px",animation:"fadeUp 0.4s ease-out"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#475569",fontSize:22,cursor:"pointer",marginBottom:28}}>‹ Back</button>
        <ProgressDots total={3} current={step}/>
        <Card>
          {step===0&&<><h2 style={{fontFamily:"'Cinzel',serif",fontSize:20,color:"#fff",marginBottom:20}}>Create Account</h2><TextInput label="Parent Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="parent@email.com"/>{err&&<p style={{fontSize:12,color:"#f43f5e",marginBottom:12}}>{err}</p>}<GoldBtn onClick={next}>Continue →</GoldBtn></>}
          {step===1&&<><h2 style={{fontFamily:"'Cinzel',serif",fontSize:20,color:"#fff",marginBottom:20}}>Set a Password</h2><TextInput label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="8+ characters"/><TextInput label="Confirm Password" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Type it again"/>{err&&<p style={{fontSize:12,color:"#f43f5e",marginBottom:12}}>{err}</p>}<GoldBtn onClick={next} disabled={loading}>{loading?"Creating…":"Create Account →"}</GoldBtn></>}
          {step===2&&<div style={{textAlign:"center"}}><div style={{fontSize:52,marginBottom:12}}>✅</div><h2 style={{fontFamily:"'Cinzel',serif",fontSize:20,color:"#fff",marginBottom:8}}>Account Created!</h2><p style={{fontSize:13,color:"#475569",marginBottom:24}}>Now let's set up your child's Hero profile.</p><GoldBtn onClick={next}>Set Up Child Profile →</GoldBtn></div>}
        </Card>
      </div>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────────────────────────────────────
function PracticeQuestion({onCorrect}){
  const[picked,setPicked]=useState(null);const[fb,setFb]=useState(null);
  const choose=opt=>{if(fb==="correct")return;setPicked(opt);if(opt==="Bright"){setFb("correct");setTimeout(onCorrect,900);}else{setFb("wrong");setTimeout(()=>{setPicked(null);setFb(null);},800);}};
  return (
    <div style={{animation:"fadeUp 0.4s ease-out"}}>
      <h2 style={{fontFamily:"'Cinzel',serif",fontSize:20,color:"#fff",marginBottom:6,textAlign:"center"}}>One practice question</h2>
      <p style={{fontSize:13,color:"#475569",textAlign:"center",marginBottom:20}}>Let's try one before the real quest begins!</p>
      <Card>
        <div style={{fontSize:13,fontWeight:700,color:"#f59e0b",marginBottom:12}}>💬 Verbal Reasoning · Foundation</div>
        <p style={{fontFamily:"'Lora',serif",fontSize:15,color:"#e2e8f0",lineHeight:1.65,marginBottom:20}}>Find the missing word: COLD is to HOT as DARK is to ___</p>
        {["Dim","Bright","Night","Shadow"].map(opt=>{const isC=fb==="correct"&&opt==="Bright",isW=fb==="wrong"&&opt===picked;return <button key={opt} onClick={()=>choose(opt)} style={{display:"block",width:"100%",textAlign:"left",padding:"12px 16px",borderRadius:12,border:`1px solid ${isC?"#10b981":isW?"#f43f5e":"rgba(255,255,255,0.08)"}`,background:isC?"rgba(16,185,129,0.15)":isW?"rgba(244,63,94,0.1)":"rgba(255,255,255,0.03)",color:isC?"#6ee7b7":isW?"#fca5a5":"#e2e8f0",fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:8,transition:"all 0.2s",animation:isW?"shake 0.45s ease-out":isC?"correctPop 0.35s ease-out":"none"}}>{isC?"✓ ":""}{opt}</button>;})}
        <p style={{fontSize:11,textAlign:"center",color:fb==="wrong"?"#f43f5e":fb==="correct"?"#6ee7b7":"#334155"}}>{fb==="wrong"?"Not quite — try again!":fb==="correct"?"🎉 Correct!":"Tap the correct answer"}</p>
      </Card>
    </div>
  );
}

function Onboarding({onComplete}){
  const[step,setStep]=useState(0);const[name,setName]=useState("");const[age,setAge]=useState(null);const[avatar,setAvatar]=useState(null);const[pin,setPin]=useState("");const[pin2,setPin2]=useState("");const[pinErr,setPinErr]=useState(false);const[pinMode,setPinMode]=useState("set");const[heroName,setHeroName]=useState(genHeroName());const[saving,setSaving]=useState(false);
  const next=()=>setStep(s=>s+1);
  const activePinVal=pinMode==="set"?pin:pin2;
  const handlePin=v=>{
    if(pinMode==="set"){setPin(v);if(v.length===4)setPinMode("confirm");}
    else{setPin2(v);if(v.length===4){if(v===pin)next();else{setPinErr(true);setPin2("");setTimeout(()=>setPinErr(false),600);}}}
  };
  const finish=async()=>{
    setSaving(true);
    const pinHash=await hashPin(pin);
    const profile={name,age,avatar,heroName,pinHash};
    await saveProfile(profile);
    onComplete(profile);
  };
  return (
    <Screen>
      <div style={{maxWidth:400,margin:"0 auto",padding:"32px 20px 48px"}}>
        <ProgressDots total={7} current={step}/>
        {step===0&&<div style={{textAlign:"center",animation:"fadeUp 0.4s ease-out"}}><div style={{fontSize:72,animation:"float 3s ease-in-out infinite",display:"inline-block"}}>🦉</div><h2 style={{fontFamily:"'Cinzel',serif",fontSize:24,color:"#fff",margin:"16px 0 10px"}}>Welcome to<br/>Quest Academy!</h2><p style={{fontSize:14,color:"#475569",lineHeight:1.7,marginBottom:28}}>Earn XP, climb the levels from Foundation all the way to Higher, and ace your 11+ exam!</p><GoldBtn onClick={next}>Start Your Quest →</GoldBtn></div>}
        {step===1&&<Card style={{animation:"fadeUp 0.35s ease-out"}}><h2 style={{fontFamily:"'Cinzel',serif",fontSize:20,color:"#fff",marginBottom:16}}>What's your first name?</h2><TextInput placeholder="Type your name…" value={name} onChange={e=>setName(e.target.value)}/><p style={{fontSize:12,color:"#334155",marginBottom:20}}>🛡️ Your real name is never shown to other players.</p><GoldBtn onClick={next} disabled={name.trim().length<2}>Continue →</GoldBtn></Card>}
        {step===2&&<div style={{animation:"fadeUp 0.35s ease-out"}}><h2 style={{fontFamily:"'Cinzel',serif",fontSize:22,color:"#fff",marginBottom:20,textAlign:"center"}}>How old are you, {name}?</h2><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24}}>{[6,7,8,9,10,11].map(a=><button key={a} onClick={()=>setAge(a)} style={{height:70,borderRadius:18,border:`2px solid ${age===a?"#f59e0b":"rgba(255,255,255,0.08)"}`,background:age===a?"rgba(245,158,11,0.15)":"rgba(255,255,255,0.03)",color:age===a?"#fbbf24":"#e2e8f0",fontSize:28,fontWeight:900,cursor:"pointer",transition:"all 0.2s"}}>{a}</button>)}</div><GoldBtn onClick={next} disabled={!age}>This is my age! →</GoldBtn></div>}
        {step===3&&<div style={{animation:"fadeUp 0.35s ease-out"}}><h2 style={{fontFamily:"'Cinzel',serif",fontSize:22,color:"#fff",marginBottom:20,textAlign:"center"}}>Choose your hero!</h2><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:24}}>{AVATARS.map(av=><button key={av.id} onClick={()=>setAvatar(av)} style={{height:72,borderRadius:18,border:`2px solid ${avatar?.id===av.id?av.color:"rgba(255,255,255,0.08)"}`,background:avatar?.id===av.id?`${av.color}1a`:"rgba(255,255,255,0.03)",fontSize:30,cursor:"pointer",transition:"all 0.2s",transform:avatar?.id===av.id?"scale(1.08)":"scale(1)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}><span>{av.emoji}</span><span style={{fontSize:9,color:avatar?.id===av.id?av.color:"#334155",fontWeight:700,textTransform:"uppercase"}}>{av.label}</span></button>)}</div><GoldBtn onClick={next} disabled={!avatar}>This is my hero! →</GoldBtn></div>}
        {step===4&&<div style={{textAlign:"center",animation:"fadeUp 0.35s ease-out"}}><div style={{fontSize:44,marginBottom:12}}>🔐</div><h2 style={{fontFamily:"'Cinzel',serif",fontSize:22,color:"#fff",marginBottom:6}}>{pinMode==="set"?"Create your secret PIN":"Enter it again to confirm"}</h2><p style={{fontSize:13,color:"#475569",marginBottom:28}}>{pinMode==="set"?"This is how you'll log in. Remember it!":"Type your PIN one more time."}</p><div style={{display:"flex",gap:16,justifyContent:"center",marginBottom:28,animation:pinErr?"shake 0.5s ease-out":"none"}}>{Array.from({length:4}).map((_,i)=><div key={i} style={{width:18,height:18,borderRadius:"50%",background:i<activePinVal.length?"#f59e0b":"transparent",border:`2.5px solid ${i<activePinVal.length?"#f59e0b":"rgba(255,255,255,0.15)"}`,boxShadow:i<activePinVal.length?"0 0 10px rgba(245,158,11,0.5)":"none"}}/>)}</div>{pinErr&&<p style={{fontSize:12,color:"#f43f5e",marginBottom:14}}>PINs don't match — try again</p>}<NumPad value={activePinVal} onChange={handlePin}/></div>}
        {step===5&&<div style={{textAlign:"center",animation:"heroReveal 0.7s ease-out"}}><div style={{fontSize:64,marginBottom:16,animation:"float 3s ease-in-out infinite",display:"inline-block"}}>{avatar?.emoji||"🦉"}</div><p style={{fontSize:12,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Your Hero Name is…</p><h1 style={{fontFamily:"'Cinzel',serif",fontSize:26,color:"#f59e0b",marginBottom:20,textShadow:"0 0 30px rgba(245,158,11,0.4)"}}>{heroName}</h1><button onClick={()=>setHeroName(genHeroName())} style={{padding:"8px 18px",borderRadius:999,border:"1px solid rgba(245,158,11,0.3)",background:"rgba(245,158,11,0.08)",color:"#f59e0b",fontWeight:700,fontSize:13,cursor:"pointer",marginBottom:28}}>🎲 Try another name</button><br/><GoldBtn onClick={next}>I love this name! →</GoldBtn></div>}
        {step===6&&<PracticeQuestion onCorrect={next}/>}
        {step>=7&&<div style={{textAlign:"center",animation:"popIn 0.5s ease-out"}}><div style={{fontSize:72,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>{avatar?.emoji||"🦉"}</div><h2 style={{fontFamily:"'Cinzel',serif",fontSize:26,color:"#fff",marginBottom:6}}>Quest begins, {name}!</h2><p style={{fontSize:14,color:"#64748b",marginBottom:8}}>Your journey: <strong style={{color:"#34d399"}}>Foundation</strong> → Bronze → Silver → Gold → Platinum → <strong style={{color:"#a78bfa"}}>Higher</strong></p><p style={{fontSize:12,color:"#334155",marginBottom:24}}>Your PIN has been saved — you can log back in at any time.</p><GoldBtn onClick={finish} disabled={saving}>{saving?"Saving your hero…":"🚀 Start My Quest!"}</GoldBtn></div>}
      </div>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME HUB
// ─────────────────────────────────────────────────────────────────────────────
function HomeHub({profile,progress,onSubject,onLogout}){
  const totalXP=SUBJECTS.reduce((s,sub)=>s+(progress[sub]?.xp||0),0);
  const subjectXP=Object.fromEntries(SUBJECTS.map(s=>[s,progress[s]?.xp||0]));

  return (
    <Screen>
      <div style={{maxWidth:440,margin:"0 auto",padding:"28px 20px 56px"}}>
        {/* Hero bar */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24,animation:"fadeUp 0.4s ease-out"}}>
          <div style={{fontSize:44,filter:"drop-shadow(0 0 14px rgba(245,158,11,0.45))"}}>{profile?.avatar?.emoji||"🦉"}</div>
          <div style={{flex:1}}>
            <h2 style={{fontFamily:"'Cinzel',serif",fontSize:17,color:"#fff",marginBottom:3}}>{profile?.heroName||"Hero"}</h2>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:"#f59e0b",fontWeight:800}}>⚡ {totalXP} XP</span>
              <span style={{fontSize:11,color:"#475569"}}>·</span>
              <span style={{fontSize:11,color:"#34d399",fontWeight:700}}>{getLevelForXP(totalXP).icon} {getLevelForXP(totalXP).label}</span>
            </div>
          </div>
          <button onClick={onLogout} style={{background:"none",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,color:"#334155",fontSize:12,fontWeight:700,cursor:"pointer",padding:"6px 10px"}}>← Exit</button>
        </div>

        {/* Level path */}
        <LevelPathMap subjectXP={subjectXP}/>

        {/* Subject cards */}
        <p style={{fontSize:11,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Subjects</p>
        <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:24}}>
          {SUBJECTS.map((subj,i)=>{
            const sm=SUBJECT_META[subj];const sp=progress[subj];
            const xp=sp?.xp||0;const lvl=getLevelForXP(xp);const nxt=getNextLevel(lvl.id);
            const seen=sp?.history?.length||0;const total=BANK.filter(q=>q.s===subj).length;
            return (
              <button key={subj} onClick={()=>onSubject(subj)} style={{width:"100%",padding:0,border:"none",background:"none",cursor:"pointer",textAlign:"left",animation:`slideIn ${0.3+i*0.07}s ease-out`}}>
                <div style={{padding:"14px 16px",borderRadius:18,border:`1px solid ${sm.border}`,background:sm.bg,transition:"all 0.25s",position:"relative",overflow:"hidden"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 10px 28px ${sm.border}`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                    <div style={{width:40,height:40,borderRadius:13,background:sm.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,boxShadow:`0 4px 12px ${sm.border}`}}>{sm.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
                        <span style={{fontSize:14,fontWeight:800,color:"#e2e8f0"}}>{subj}</span>
                        <span style={{fontSize:10,fontWeight:700,color:lvl.color,background:lvl.bg,border:`1px solid ${lvl.border}`,borderRadius:999,padding:"2px 8px",flexShrink:0}}>{lvl.icon} {lvl.label}</span>
                      </div>
                      <div style={{fontSize:11,color:"#475569"}}>{xp} XP{nxt?` · ${nxt.xpNeeded-xp} to ${nxt.label}`:""} · {seen}/{total} seen</div>
                    </div>
                  </div>
                  {/* XP progress to next level */}
                  {nxt&&<div style={{height:3,background:"rgba(0,0,0,0.3)",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.round(((xp-lvl.xpNeeded)/(nxt.xpNeeded-lvl.xpNeeded))*100)}%`,background:sm.color,borderRadius:2,transition:"width 0.8s ease"}}/>
                  </div>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {LEVELS.slice(0,4).map(lvl=>{
            const achieved=Object.values(subjectXP).filter(x=>x>=lvl.xpNeeded).length;
            return <div key={lvl.id} style={{padding:"10px 8px",borderRadius:14,background:achieved>0?lvl.bg:"rgba(255,255,255,0.02)",border:`1px solid ${achieved>0?lvl.border:"rgba(255,255,255,0.06)"}`,textAlign:"center",filter:achieved>0?"none":"grayscale(1) opacity(0.35)"}}>
              <div style={{fontSize:16,marginBottom:4}}>{lvl.icon}</div>
              <div style={{fontSize:9,color:lvl.color,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.06em"}}>{lvl.shortLabel}</div>
              <div style={{fontSize:10,color:"#475569",marginTop:2}}>{achieved}/4</div>
            </div>;
          })}
        </div>
      </div>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXT QUESTION PLAYER
// ─────────────────────────────────────────────────────────────────────────────
function TextQuestionPlayer({subject,profile,progress,extraQuestions,onBack,onUpdateProgress,onNeedMore}){
  const sm=SUBJECT_META[subject];
  const sp=progress[subject];
  const xp=sp?.xp||0;
  const level=getLevelForXP(xp);
  const nextLvl=getNextLevel(level.id);

  const[q,setQ]=useState(()=>pickQuestion(subject,progress,extraQuestions));
  const[selected,setSelected]=useState(null);
  const[attempts,setAttempts]=useState(0);
  const[hint,setHint]=useState(0);
  const[revealed,setRevealed]=useState(false);
  const[correct,setCorrect]=useState(false);
  const[xpBurst,setXpBurst]=useState(false);
  const[sessionXP,setSessionXP]=useState(0);
  const[sessionQ,setSessionQ]=useState(0);
  const[levelUpMsg,setLevelUpMsg]=useState(null);
  const[generating,setGenerating]=useState(false);
  const[aiLabel,setAiLabel]=useState(false);

  const unseenCount=useCallback(()=>{const seen=new Set(sp.history||[]);return [...BANK,...(extraQuestions||[])].filter(qq=>qq.s===subject&&level.qDiffs.includes(qq.d)&&!seen.has(qq.id)).length;},[subject,sp,extraQuestions,level]);

  useEffect(()=>{if(unseenCount()<3&&!generating){setGenerating(true);onNeedMore(subject,level.qDiffs[level.qDiffs.length-1]).then(()=>setGenerating(false));}}, [q]);

  const pick=async(opt)=>{
    if(correct||revealed)return;
    const isCorrect=opt===q.a;
    setSelected(opt);
    const newAttempts=attempts+1;setAttempts(newAttempts);
    if(isCorrect){
      setCorrect(true);
      const xpGain=xpForAttempts(newAttempts,false);
      setSessionXP(s=>s+xpGain);setXpBurst(true);setTimeout(()=>setXpBurst(false),2200);
      const oldLevel=getLevelForXP(sp.xp||0);
      const newProgress=updateProgress(progress,subject,true,newAttempts,q.id);
      const newLevel=getLevelForXP(newProgress[subject].xp);
      if(newLevel.id!==oldLevel.id){
        setLevelUpMsg(`${newLevel.icon} Level Up! You reached ${newLevel.label}!`);
        setTimeout(()=>setLevelUpMsg(null),4000);
      }
      await saveProgress(newProgress);
      onUpdateProgress(newProgress);
    }else{
      if(newAttempts===1)setHint(1);else if(newAttempts===2)setHint(2);
    }
  };

  const reveal=async()=>{
    setRevealed(true);
    const newProgress=updateProgress(progress,subject,false,attempts+1,q.id);
    await saveProgress(newProgress);
    onUpdateProgress(newProgress);
  };

  const next=()=>{
    const nextQ=pickQuestion(subject,progress,extraQuestions);
    setQ(nextQ);setSelected(null);setAttempts(0);setHint(0);setRevealed(false);setCorrect(false);
    setAiLabel(extraQuestions?.some(eq=>eq.id===nextQ?.id)||false);
    setSessionQ(s=>s+1);
  };

  if(!q)return null;

  return (
    <Screen>
      <div style={{maxWidth:480,margin:"0 auto",padding:"16px 16px 48px"}}>
        {/* Level-up toast */}
        {levelUpMsg&&<div style={{marginBottom:12,padding:"12px 18px",borderRadius:16,background:"linear-gradient(135deg,rgba(245,158,11,0.15),rgba(167,139,250,0.15))",border:"1px solid rgba(245,158,11,0.4)",fontSize:14,fontWeight:900,color:"#f59e0b",animation:"toastIn 0.5s ease-out",textAlign:"center",boxShadow:"0 4px 20px rgba(245,158,11,0.2)"}}>{levelUpMsg}</div>}

        {/* Top bar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:"#475569",fontSize:22,cursor:"pointer"}}>‹</button>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {generating&&<span style={{fontSize:11,color:"#a78bfa",animation:"genPulse 1.2s ease-in-out infinite",fontWeight:700}}>🧠 Generating…</span>}
            {aiLabel&&<span style={{fontSize:10,fontWeight:700,color:"#a78bfa",padding:"2px 8px",background:"rgba(167,139,250,0.12)",borderRadius:999,border:"1px solid rgba(167,139,250,0.3)"}}>✨ AI-generated</span>}
            <span style={{fontSize:10,fontWeight:700,color:level.color,padding:"3px 10px",borderRadius:999,background:level.bg,border:`1px solid ${level.border}`}}>{level.icon} {level.label}</span>
          </div>
          <span style={{fontSize:12,fontWeight:800,color:sm.color}}>+{sessionXP} XP</span>
        </div>

        {/* Question card */}
        <div key={q.id} style={{borderRadius:24,overflow:"hidden",border:`1px solid ${sm.border}`,boxShadow:"0 20px 60px rgba(0,0,0,0.5)",animation:"fadeUp 0.4s ease-out"}}>
          <div style={{background:sm.gradient,padding:"16px 20px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{subject}</div>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.12)",borderRadius:999,padding:"2px 10px",display:"inline-block"}}>{q.t}</div>
              </div>
              <div style={{display:"flex",gap:7}}>{[0,1,2].map(i=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:i<attempts&&!correct?"#f43f5e":"transparent",border:`2px solid ${i<attempts&&!correct?"#f43f5e":"rgba(255,255,255,0.2)"}`,transition:"all 0.3s"}}/>)}</div>
            </div>
          </div>

          <div style={{background:"rgba(15,23,42,0.97)",padding:"22px 20px 24px",position:"relative"}}>
            {xpBurst&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:50}}><div style={{fontSize:42,fontWeight:900,color:sm.color,animation:"xpBurst 2s ease-out forwards",textShadow:`0 0 30px ${sm.color}80`}}>+{xpForAttempts(attempts,false)} XP ✨</div></div>}

            <p style={{fontFamily:"'Lora',serif",fontSize:16,color:"#e2e8f0",lineHeight:1.65,marginBottom:20}}>{q.q}</p>

            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {q.o.map((opt,i)=>{
                const lab=["A","B","C","D"][i];
                const isSelected=selected===opt;
                const isCorrectOpt=(correct||revealed)&&opt===q.a;
                const isWrong=isSelected&&opt!==q.a&&hint>0;
                return <button key={opt} onClick={()=>pick(opt)} disabled={correct||revealed} style={{padding:"13px 16px",borderRadius:14,border:`2px solid ${isCorrectOpt?"#10b981":isWrong?"#f43f5e":isSelected?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.08)"}`,background:isCorrectOpt?"rgba(16,185,129,0.12)":isWrong?"rgba(244,63,94,0.1)":"rgba(255,255,255,0.03)",cursor:correct||revealed?"default":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",gap:12,animation:isCorrectOpt?"correctPop 0.4s ease-out":isWrong?"shake 0.4s ease-out":"none"}}
                  onMouseEnter={e=>{if(!correct&&!revealed&&opt!==selected){e.currentTarget.style.borderColor=sm.color+"60";e.currentTarget.style.background="rgba(255,255,255,0.05)";}}}
                  onMouseLeave={e=>{if(!correct&&!revealed&&opt!==selected){e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.background="rgba(255,255,255,0.03)";}}}>
                  <span style={{width:24,height:24,borderRadius:8,background:isCorrectOpt?"rgba(16,185,129,0.2)":isWrong?"rgba(244,63,94,0.2)":"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:isCorrectOpt?"#6ee7b7":isWrong?"#fca5a5":"#475569",flexShrink:0}}>{isCorrectOpt?"✓":lab}</span>
                  <span style={{fontSize:14,color:isCorrectOpt?"#e2e8f0":isWrong?"#fca5a5":"#cbd5e1",fontWeight:isCorrectOpt||isSelected?700:500,textAlign:"left"}}>{opt}</span>
                </button>;
              })}
            </div>

            {hint>=1&&!correct&&<div style={{marginTop:16,padding:14,borderRadius:14,background:hint>=2?"rgba(92,40,0,0.4)":"rgba(30,27,75,0.5)",border:`1px solid ${hint>=2?"rgba(245,158,11,0.35)":"rgba(99,102,241,0.3)"}`,animation:"hintSlide 0.35s ease-out"}}><div style={{display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:18}}>{hint>=2?"📚":"💡"}</span><div><p style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:hint>=2?"#fbbf24":"#a5b4fc",marginBottom:4}}>{hint>=2?"Scholar's Reference Card":"Scholar's Hint"}</p><p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.6}}>{hint>=2?q.r:q.h}</p></div></div></div>}

            {attempts>=3&&!correct&&!revealed&&<button onClick={reveal} style={{marginTop:12,width:"100%",padding:"10px",borderRadius:12,border:"1px solid rgba(16,185,129,0.25)",background:"rgba(16,185,129,0.06)",color:"#34d399",fontWeight:700,fontSize:13,cursor:"pointer"}}>👁 Show me the answer (0 XP)</button>}
            {revealed&&<div style={{marginTop:14,padding:14,borderRadius:14,background:"rgba(5,46,22,0.4)",border:"1px solid rgba(16,185,129,0.3)",animation:"revealDrop 0.4s ease-out"}}><p style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#6ee7b7",marginBottom:4}}>✅ Correct Answer</p><p style={{fontSize:14,fontWeight:800,color:"#fff",margin:"0 0 3px"}}>{q.a}</p><p style={{fontSize:11,color:"#475569"}}>Study the Reference Card to lock it in.</p></div>}
            {correct&&<div style={{marginTop:14,padding:14,borderRadius:14,background:"rgba(5,46,22,0.4)",border:"1px solid rgba(16,185,129,0.3)",animation:"successPop 0.4s ease-out",display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:26}}>🎉</span><div><p style={{fontWeight:800,color:"#6ee7b7",margin:"0 0 2px"}}>{attempts===1?"Perfect!":"Well done!"}</p><p style={{fontSize:11,color:"#475569"}}>+{xpForAttempts(attempts,false)} XP · {level.icon} {level.label}</p></div></div>}
            {(correct||revealed)&&<button onClick={next} style={{marginTop:14,width:"100%",padding:14,borderRadius:14,border:"none",background:`linear-gradient(135deg,${sm.color},${sm.color}bb)`,color:"#0f172a",fontWeight:900,fontSize:14,cursor:"pointer",animation:"fadeUp 0.3s ease-out"}}>Next Question →</button>}
          </div>
        </div>

        <div style={{marginTop:14,display:"flex",justifyContent:"space-between",padding:"0 2px"}}>
          <span style={{fontSize:11,color:"#334155"}}>Session: {sessionQ} answered</span>
          {nextLvl&&<span style={{fontSize:11,color:level.color}}>{nextLvl.xpNeeded-(sp?.xp||0)-sessionXP} XP to {nextLvl.icon} {nextLvl.label}</span>}
        </div>
      </div>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NVR VISUAL PLAYER  (SVG questions)
// ─────────────────────────────────────────────────────────────────────────────
const NVR_VISUAL=[
  {id:"nvr-v1",type:"sequence",q:"Which shape comes next in the sequence?",h:"The arrow rotates 90° clockwise with each step. Count the turns.",r:"ROTATION RULE: 90° clockwise → North→East→South→West. After 3 turns from North = West.",
   sequence:[<svg key="s1" width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="32,10 44,36 38,36 38,54 26,54 26,36 20,36" fill="#6366f1"/></svg>,<svg key="s2" width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="54,32 28,20 28,26 10,26 10,38 28,38 28,44" fill="#6366f1"/></svg>,<svg key="s3" width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="32,54 20,28 26,28 26,10 38,10 38,28 44,28" fill="#6366f1"/></svg>],
   options:[{label:"A",correct:true,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="10,32 36,44 36,38 54,38 54,26 36,26 36,20" fill="#6366f1"/></svg>},{label:"B",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="32,10 44,36 38,36 38,54 26,54 26,36 20,36" fill="#6366f1"/></svg>},{label:"C",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="54,32 28,20 28,26 10,26 10,38 28,38 28,44" fill="#6366f1"/></svg>},{label:"D",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="32,8 56,32 32,56 8,32" fill="#6366f1"/></svg>}]},
  {id:"nvr-v2",type:"odd_one_out",q:"Which shape is the odd one out?",h:"Look carefully at the number of sides each shape has.",r:"COUNT THE SIDES: Three shapes share the same side count — one does not.",
   options:[{label:"A",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><rect x="16" y="16" width="32" height="32" fill="none" stroke="#34d399" strokeWidth="3" rx="2"/></svg>},{label:"B",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><rect x="10" y="20" width="44" height="24" fill="none" stroke="#34d399" strokeWidth="3" rx="2"/></svg>},{label:"C",correct:true,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="32,10 56,54 8,54" fill="none" stroke="#34d399" strokeWidth="3"/></svg>},{label:"D",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="20,48 44,16 58,16 34,48" fill="none" stroke="#34d399" strokeWidth="3"/></svg>}]},
  {id:"nvr-v3",type:"matrix",q:"Which tile completes the 2×2 pattern grid?",h:"Each row: the shape gets one extra dot added going left to right.",r:"MATRIX RULES: dots +1 left→right; circles +1 top→bottom. Apply BOTH rules.",
   matrixCells:[<svg key="tl" width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><circle cx="32" cy="32" r="18" fill="none" stroke="#f59e0b" strokeWidth="2.5"/><circle cx="32" cy="32" r="4" fill="#f59e0b"/></svg>,<svg key="tr" width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><circle cx="32" cy="32" r="18" fill="none" stroke="#f59e0b" strokeWidth="2.5"/><circle cx="25" cy="32" r="4" fill="#f59e0b"/><circle cx="39" cy="32" r="4" fill="#f59e0b"/></svg>,<svg key="bl" width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><circle cx="32" cy="24" r="14" fill="none" stroke="#f59e0b" strokeWidth="2"/><circle cx="32" cy="42" r="14" fill="none" stroke="#f59e0b" strokeWidth="2"/><circle cx="32" cy="32" r="4" fill="#f59e0b"/></svg>],
   options:[{label:"A",correct:true,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><circle cx="32" cy="22" r="12" fill="none" stroke="#f59e0b" strokeWidth="2"/><circle cx="32" cy="42" r="12" fill="none" stroke="#f59e0b" strokeWidth="2"/><circle cx="25" cy="32" r="4" fill="#f59e0b"/><circle cx="39" cy="32" r="4" fill="#f59e0b"/></svg>},{label:"B",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><circle cx="32" cy="22" r="12" fill="none" stroke="#f59e0b" strokeWidth="2"/><circle cx="32" cy="42" r="12" fill="none" stroke="#f59e0b" strokeWidth="2"/><circle cx="32" cy="32" r="4" fill="#f59e0b"/></svg>},{label:"C",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><circle cx="32" cy="32" r="18" fill="none" stroke="#f59e0b" strokeWidth="2.5"/><circle cx="25" cy="32" r="4" fill="#f59e0b"/><circle cx="39" cy="32" r="4" fill="#f59e0b"/></svg>},{label:"D",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><circle cx="32" cy="22" r="12" fill="none" stroke="#f59e0b" strokeWidth="2"/><circle cx="32" cy="42" r="12" fill="none" stroke="#f59e0b" strokeWidth="2"/><circle cx="20" cy="32" r="3.5" fill="#f59e0b"/><circle cx="32" cy="32" r="3.5" fill="#f59e0b"/><circle cx="44" cy="32" r="3.5" fill="#f59e0b"/></svg>}]},
  {id:"nvr-v4",type:"reflection",q:"Which option is the mirror image of the shape on the left?",h:"Imagine a vertical mirror line. The left side becomes the right side.",r:"REFLECTION: vertical mirror flips left↔right, keeps top↔bottom. Check each corner.",
   original:<svg width="72" height="72" viewBox="0 0 72 72" style={{borderRadius:12,background:"#1e293b",border:"2px solid rgba(245,158,11,0.3)"}}><polygon points="16,16 36,16 36,40 56,40 56,56 16,56" fill="#818cf8" opacity="0.9"/><text x="36" y="68" textAnchor="middle" fontSize="9" fill="#475569">Original</text></svg>,
   options:[{label:"A",correct:true,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="48,14 28,14 28,38 8,38 8,54 48,54" fill="#818cf8" opacity="0.9"/></svg>},{label:"B",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="16,14 36,14 36,38 56,38 56,54 16,54" fill="#818cf8" opacity="0.9"/></svg>},{label:"C",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="48,54 28,54 28,30 8,30 8,14 48,14" fill="#818cf8" opacity="0.9"/></svg>},{label:"D",correct:false,svg:<svg width="64" height="64" viewBox="0 0 64 64" style={{borderRadius:10,background:"#1e293b"}}><polygon points="16,54 36,54 36,30 56,30 56,14 16,14" fill="#818cf8" opacity="0.9"/></svg>}]},
];

function NVRPlayer({profile,progress,onBack,onUpdateProgress}){
  const sm=SUBJECT_META["Non-Verbal Reasoning"];
  const sp=progress["Non-Verbal Reasoning"];
  const xp=sp?.xp||0;const level=getLevelForXP(xp);
  const[qIdx,setQIdx]=useState(0);const[selected,setSelected]=useState(null);const[attempts,setAttempts]=useState(0);const[hint,setHint]=useState(0);const[revealed,setRevealed]=useState(false);const[correct,setCorrect]=useState(false);const[xpBurst,setXpBurst]=useState(false);const[sessionXP,setSessionXP]=useState(0);const[levelUpMsg,setLevelUpMsg]=useState(null);
  const TYPE_LABELS={sequence:"Sequence",odd_one_out:"Odd One Out",matrix:"Pattern Matrix",reflection:"Reflection"};
  const q=NVR_VISUAL[qIdx];

  const pick=async(opt)=>{
    if(correct||revealed)return;
    setSelected(opt.label);const newAttempts=attempts+1;setAttempts(newAttempts);
    if(opt.correct){
      setCorrect(true);const xpGain=xpForAttempts(newAttempts,false);setSessionXP(s=>s+xpGain);setXpBurst(true);setTimeout(()=>setXpBurst(false),2200);
      const oldLevel=getLevelForXP(sp.xp||0);
      const newProgress=updateProgress(progress,"Non-Verbal Reasoning",true,newAttempts,q.id);
      const newLevel=getLevelForXP(newProgress["Non-Verbal Reasoning"].xp);
      if(newLevel.id!==oldLevel.id){setLevelUpMsg(`${newLevel.icon} Level Up! You reached ${newLevel.label}!`);setTimeout(()=>setLevelUpMsg(null),4000);}
      await saveProgress(newProgress);onUpdateProgress(newProgress);
    }else{if(newAttempts===1)setHint(1);else if(newAttempts===2)setHint(2);}
  };

  const reveal=async()=>{setRevealed(true);const np=updateProgress(progress,"Non-Verbal Reasoning",false,attempts+1,q.id);await saveProgress(np);onUpdateProgress(np);};
  const next=()=>{setQIdx(i=>(i+1)%NVR_VISUAL.length);setSelected(null);setAttempts(0);setHint(0);setRevealed(false);setCorrect(false);};

  return (
    <Screen>
      <div style={{maxWidth:480,margin:"0 auto",padding:"16px 16px 48px"}}>
        {levelUpMsg&&<div style={{marginBottom:12,padding:"12px 18px",borderRadius:16,background:"linear-gradient(135deg,rgba(245,158,11,0.15),rgba(167,139,250,0.15))",border:"1px solid rgba(245,158,11,0.4)",fontSize:14,fontWeight:900,color:"#f59e0b",animation:"toastIn 0.5s ease-out",textAlign:"center"}}>{levelUpMsg}</div>}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:"#475569",fontSize:22,cursor:"pointer"}}>‹</button>
          <span style={{fontSize:10,fontWeight:700,color:level.color,padding:"3px 10px",borderRadius:999,background:level.bg,border:`1px solid ${level.border}`}}>{level.icon} {level.label}</span>
          <span style={{fontSize:12,fontWeight:800,color:sm.color}}>+{sessionXP} XP</span>
        </div>
        <div style={{height:4,background:"#1e293b",borderRadius:2,overflow:"hidden",marginBottom:12}}>
          <div style={{height:"100%",width:`${(qIdx/NVR_VISUAL.length)*100}%`,background:sm.gradient,transition:"width 0.5s ease",borderRadius:2}}/>
        </div>
        <div key={qIdx} style={{borderRadius:24,overflow:"hidden",border:`1px solid ${sm.border}`,boxShadow:"0 20px 60px rgba(0,0,0,0.5)",animation:"fadeUp 0.4s ease-out"}}>
          <div style={{background:sm.gradient,padding:"16px 20px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div><div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Non-Verbal Reasoning</div><div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.12)",borderRadius:999,padding:"2px 10px",display:"inline-block"}}>{TYPE_LABELS[q.type]}</div></div>
              <div style={{display:"flex",gap:7}}>{[0,1,2].map(i=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:i<attempts&&!correct?"#f43f5e":"transparent",border:`2px solid ${i<attempts&&!correct?"#f43f5e":"rgba(255,255,255,0.2)"}`}}/>)}</div>
            </div>
          </div>
          <div style={{background:"rgba(15,23,42,0.97)",padding:"22px 20px 24px",position:"relative"}}>
            {xpBurst&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:50}}><div style={{fontSize:42,fontWeight:900,color:sm.color,animation:"xpBurst 2s ease-out forwards"}}>+{xpForAttempts(attempts,false)} XP ✨</div></div>}
            <p style={{fontFamily:"'Lora',serif",fontSize:15,color:"#e2e8f0",lineHeight:1.6,marginBottom:20}}>{q.q}</p>
            {q.type==="sequence"&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24,overflowX:"auto"}}>{q.sequence.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>{s}<span style={{color:"#334155",fontSize:20,fontWeight:900}}>→</span></div>)}<div style={{width:64,height:64,borderRadius:10,border:"2px dashed rgba(167,139,250,0.4)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#4c1d95",fontSize:22,fontWeight:900}}>?</span></div></div>}
            {q.type==="matrix"&&<div style={{marginBottom:24}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxWidth:148,margin:"0 auto"}}>{q.matrixCells.map((c,i)=><div key={i}>{c}</div>)}<div style={{width:64,height:64,borderRadius:10,border:"2px dashed rgba(245,158,11,0.4)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#78350f",fontSize:22,fontWeight:900}}>?</span></div></div></div>}
            {q.type==="reflection"&&<div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,justifyContent:"center"}}>{q.original}<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><div style={{width:2,height:72,background:"rgba(99,102,241,0.4)",position:"relative"}}><div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:14,color:"#475569",background:"#0f172a",padding:"2px 6px",borderRadius:6}}>↔</div></div><span style={{fontSize:10,color:"#334155"}}>mirror</span></div><div style={{width:72,height:72,borderRadius:12,border:"2px dashed rgba(99,102,241,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#312e81",fontSize:22,fontWeight:900}}>?</span></div></div>}
            <p style={{fontSize:11,color:"#334155",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>{q.type==="odd_one_out"?"Which is the odd one out?":"Choose the answer:"}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {q.options.map(opt=>{const isSelected=selected===opt.label,isC=(correct||revealed)&&opt.correct,ap=!correct&&!revealed&&attempts>0&&isSelected&&hint>0;
              return <button key={opt.label} onClick={()=>pick(opt)} disabled={correct||revealed} style={{padding:"12px 10px",borderRadius:14,border:`2px solid ${isC?"#10b981":ap?"#f43f5e":"rgba(255,255,255,0.08)"}`,background:isC?"rgba(16,185,129,0.12)":ap?"rgba(244,63,94,0.1)":"rgba(255,255,255,0.03)",cursor:correct||revealed?"default":"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:isC?"correctPop 0.6s ease-out":ap?"shake 0.4s ease-out":"none"}}>{opt.svg}<span style={{fontSize:11,fontWeight:800,color:isC?"#6ee7b7":ap?"#fca5a5":"#64748b",textTransform:"uppercase"}}>{isC?"✓ ":""}{opt.label}</span></button>;})}
            </div>
            {hint>=1&&!correct&&<div style={{marginTop:16,padding:14,borderRadius:14,background:hint>=2?"rgba(92,40,0,0.4)":"rgba(30,27,75,0.5)",border:`1px solid ${hint>=2?"rgba(245,158,11,0.35)":"rgba(99,102,241,0.3)"}`,animation:"hintSlide 0.35s ease-out"}}><div style={{display:"flex",gap:10}}><span>{hint>=2?"📚":"💡"}</span><div><p style={{fontSize:10,fontWeight:800,color:hint>=2?"#fbbf24":"#a5b4fc",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>{hint>=2?"Scholar's Reference Card":"Scholar's Hint"}</p><p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.6}}>{hint>=2?q.r:q.h}</p></div></div></div>}
            {attempts>=3&&!correct&&!revealed&&<button onClick={reveal} style={{marginTop:12,width:"100%",padding:"10px",borderRadius:12,border:"1px solid rgba(16,185,129,0.25)",background:"rgba(16,185,129,0.06)",color:"#34d399",fontWeight:700,fontSize:13,cursor:"pointer"}}>👁 Show me the answer (0 XP)</button>}
            {revealed&&<div style={{marginTop:14,padding:14,borderRadius:14,background:"rgba(5,46,22,0.4)",border:"1px solid rgba(16,185,129,0.3)"}}><p style={{fontSize:10,fontWeight:800,textTransform:"uppercase",color:"#6ee7b7",marginBottom:4}}>✅ Correct Answer</p><p style={{fontSize:13,fontWeight:800,color:"#fff"}}>Option {q.options.find(o=>o.correct)?.label}</p></div>}
            {correct&&<div style={{marginTop:14,padding:14,borderRadius:14,background:"rgba(5,46,22,0.4)",border:"1px solid rgba(16,185,129,0.3)",animation:"successPop 0.4s ease-out",display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:26}}>🎉</span><div><p style={{fontWeight:800,color:"#6ee7b7"}}>{attempts===1?"Perfect!":"Well done!"}</p><p style={{fontSize:11,color:"#475569"}}>+{xpForAttempts(attempts,false)} XP</p></div></div>}
            {(correct||revealed)&&<button onClick={next} style={{marginTop:14,width:"100%",padding:14,borderRadius:14,border:"none",background:sm.gradient,color:"#fff",fontWeight:900,fontSize:14,cursor:"pointer",animation:"fadeUp 0.3s ease-out"}}>Next Question →</button>}
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI QUESTION GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
async function generateQuestions(subject,difficulty,existingTopics){
  const prompt=`You are an expert 11+ exam question writer. Generate exactly 3 NEW multiple-choice questions for a child practising for the UK 11+ exam.

Subject: ${subject}
Difficulty: ${difficulty} (${difficulty==="easy"?"Foundation — basic concepts":difficulty==="medium"?"Applied — moderate reasoning":"Exam Style — challenging exam-level"})
Avoid repeating these topics if possible: ${existingTopics.join(", ")}

Return ONLY a valid JSON array. No markdown, no explanation:
[{"topic":"Topic","question":"Full question?","options":["A","B","C","D"],"answer":"A","hint":"Short clue.","reference":"Fuller explanation."}]

Rules: all 4 options plausible · answer must exactly match one option · ages 6-11 · clear and unambiguous`;
  try{
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
    const data=await res.json();
    const text=data.content?.map(c=>c.text||"").join("").trim().replace(/```json|```/g,"").trim();
    return JSON.parse(text).map((q,i)=>({id:`ai-${subject.slice(0,2).toLowerCase()}-${Date.now()}-${i}`,s:subject,d:difficulty,t:q.topic||"AI Generated",q:q.question,o:q.options,a:q.answer,h:q.hint,r:q.reference,aiGenerated:true}));
  }catch(e){console.error("AI gen failed:",e);return [];}
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT  — loads persisted profile & progress on mount
// ─────────────────────────────────────────────────────────────────────────────
export default function App(){
  const[screen,setScreen]=useState("loading");
  const[profile,setProfile]=useState(null);
  const[progress,setProgress]=useState(initProgress);
  const[activeSubject,setActiveSubject]=useState(null);
  const[extraQs,setExtraQs]=useState([]);

  // Boot: load from storage
  useEffect(()=>{
    (async()=>{
      try{
        const[p,pr,eq]=await Promise.all([loadProfile(),loadProgress(),loadExtraQs()]);
        if(p)setProfile(p);
        if(pr)setProgress(pr);
        if(eq&&eq.length)setExtraQs(eq);
      }catch{}
      // Small delay for star animation to render first
      setTimeout(()=>setScreen(prev=>prev==="loading"?"landing":prev),400);
    })();
  },[]);

  const handleNeedMore=useCallback(async(subject,difficulty)=>{
    const existing=[...BANK,...extraQs].filter(q=>q.s===subject&&q.d===difficulty).map(q=>q.t);
    const newQs=await generateQuestions(subject,difficulty,[...new Set(existing)]);
    if(newQs.length>0){const updated=[...extraQs,...newQs];setExtraQs(updated);await saveExtraQs(updated);}
  },[extraQs]);

  if(screen==="loading") return <Screen><div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><div style={{fontSize:52,animation:"spin 1.5s linear infinite"}}>⚙️</div></div></Screen>;

  return (
    <>
      {screen==="landing"      && <AuthLanding onSignup={()=>setScreen("signup")} onParentLogin={()=>setScreen("parent-login")} onChildLogin={()=>setScreen("child-login")}/>}
      {screen==="signup"       && <ParentSignup onBack={()=>setScreen("landing")} onComplete={()=>setScreen("onboarding")}/>}
      {screen==="parent-login" && <ParentLogin  onBack={()=>setScreen("landing")} onComplete={()=>setScreen("home")}/>}
      {screen==="child-login"  && <ChildLogin   onBack={()=>setScreen("landing")} onComplete={p=>{if(p)setProfile(p);setScreen("home");}}/>}
      {screen==="onboarding"   && <Onboarding   onComplete={p=>{setProfile(p);setScreen("home");}}/>}
      {screen==="home"         && <HomeHub profile={profile} progress={progress} onSubject={s=>{setActiveSubject(s);setScreen("subject");}} onLogout={()=>{setScreen("landing");}}/>}
      {screen==="subject"      && activeSubject==="Non-Verbal Reasoning" && <NVRPlayer profile={profile} progress={progress} onBack={()=>setScreen("home")} onUpdateProgress={setProgress}/>}
      {screen==="subject"      && activeSubject!=="Non-Verbal Reasoning" && <TextQuestionPlayer subject={activeSubject} profile={profile} progress={progress} extraQuestions={extraQs} onBack={()=>setScreen("home")} onUpdateProgress={setProgress} onNeedMore={handleNeedMore}/>}
    </>
  );
}
