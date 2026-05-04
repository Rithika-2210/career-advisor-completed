/**
 * Question Bank
 * 30 MCQ questions across logical, analytical, verbal, quantitative, and interest categories
 */

const QUESTION_BANK = [
  // ── LOGICAL (6 questions) ──────────────────────────────────────
  {
    questionText: "If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely:",
    options: [{ label: "A", text: "Razzles" }, { label: "B", text: "Lazzles" }, { label: "C", text: "Neither" }, { label: "D", text: "Cannot be determined" }],
    correctOption: "B",
    category: "logical",
    difficulty: "easy",
    explanation: "By transitive property: Bloops→Razzles→Lazzles, so Bloops are Lazzles."
  },
  {
    questionText: "Series: 2, 6, 12, 20, 30, ___",
    options: [{ label: "A", text: "40" }, { label: "B", text: "42" }, { label: "C", text: "38" }, { label: "D", text: "44" }],
    correctOption: "B",
    category: "logical",
    difficulty: "medium",
    explanation: "Differences are 4, 6, 8, 10, 12... next number = 30+12 = 42"
  },
  {
    questionText: "A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?",
    options: [{ label: "A", text: "Grandmother" }, { label: "B", text: "Granddaughter" }, { label: "C", text: "Daughter" }, { label: "D", text: "Great-granddaughter" }],
    correctOption: "B",
    category: "logical",
    difficulty: "medium",
    explanation: "D is C's father, C is B's mother, A is B's sister → A is C's child → A is D's granddaughter."
  },
  {
    questionText: "If FRIEND is coded as HUMJTK, how is CANDLE coded?",
    options: [{ label: "A", text: "EDRIRL" }, { label: "B", text: "EDRJPP" }, { label: "C", text: "DCQFMF" }, { label: "D", text: "EDRJQP" }],
    correctOption: "A",
    category: "logical",
    difficulty: "hard",
    explanation: "Each letter is shifted +2 positions in the alphabet."
  },
  {
    questionText: "Pointing to a photograph, a man says, 'This man's son is my son's father.' How is the photographed man related to the speaker?",
    options: [{ label: "A", text: "Father" }, { label: "B", text: "Grandfather" }, { label: "C", text: "Uncle" }, { label: "D", text: "Brother" }],
    correctOption: "A",
    category: "logical",
    difficulty: "medium",
    explanation: "My son's father = me. So the man's son = me. Therefore the man is my father."
  },
  {
    questionText: "In a row of boys, Ravi is 7th from the left and Mohan is 12th from the right. If they interchange positions, Ravi becomes 22nd from the left. How many boys are in the row?",
    options: [{ label: "A", text: "32" }, { label: "B", text: "33" }, { label: "C", text: "34" }, { label: "D", text: "35" }],
    correctOption: "B",
    category: "logical",
    difficulty: "medium",
    explanation: "After interchange, Ravi is 22nd from left (was Mohan's position). Mohan was 12th from right = 22nd from left. Total = 22+12-1 = 33."
  },

  // ── ANALYTICAL (6 questions) ───────────────────────────────────
  {
    questionText: "A company's revenue grew from ₹50L to ₹80L in 2 years. What is the approximate CAGR?",
    options: [{ label: "A", text: "26.5%" }, { label: "B", text: "30%" }, { label: "C", text: "60%" }, { label: "D", text: "20%" }],
    correctOption: "A",
    category: "analytical",
    difficulty: "hard",
    explanation: "CAGR = (80/50)^(1/2) - 1 = 1.265 - 1 = 26.5%"
  },
  {
    questionText: "If a product costs ₹200 and is sold at 25% profit, then sold at 10% discount on selling price, the final profit % is:",
    options: [{ label: "A", text: "12.5%" }, { label: "B", text: "15%" }, { label: "C", text: "12%" }, { label: "D", text: "10%" }],
    correctOption: "A",
    category: "analytical",
    difficulty: "hard",
    explanation: "SP1 = 250. After 10% discount: SP2 = 225. Profit = 25. Profit% = 25/200 × 100 = 12.5%"
  },
  {
    questionText: "Look at the data: Sales 2020: 100, 2021: 120, 2022: 90, 2023: 150. Which year had the highest growth rate?",
    options: [{ label: "A", text: "2021" }, { label: "B", text: "2022" }, { label: "C", text: "2023" }, { label: "D", text: "Equal growth" }],
    correctOption: "C",
    category: "analytical",
    difficulty: "medium",
    explanation: "2021: +20%, 2022: -25%, 2023: +66.7%. Year 2023 had the highest growth rate."
  },
  {
    questionText: "A project has 3 risks: A(prob 0.3, impact ₹10L), B(prob 0.5, impact ₹6L), C(prob 0.8, impact ₹4L). Which risk has the highest expected impact?",
    options: [{ label: "A", text: "Risk A" }, { label: "B", text: "Risk B" }, { label: "C", text: "Risk C" }, { label: "D", text: "All equal" }],
    correctOption: "C",
    category: "analytical",
    difficulty: "hard",
    explanation: "A: 0.3×10=3L, B: 0.5×6=3L, C: 0.8×4=3.2L. Risk C has highest expected impact."
  },
  {
    questionText: "3 workers can complete a task in 12 days. How many days will 4 workers take?",
    options: [{ label: "A", text: "8 days" }, { label: "B", text: "9 days" }, { label: "C", text: "10 days" }, { label: "D", text: "16 days" }],
    correctOption: "B",
    category: "analytical",
    difficulty: "easy",
    explanation: "Total work = 3×12 = 36 units. 4 workers take 36/4 = 9 days."
  },
  {
    questionText: "A train 200m long passes a pole in 20s. How long does it take to pass a platform 300m long?",
    options: [{ label: "A", text: "30s" }, { label: "B", text: "45s" }, { label: "C", text: "50s" }, { label: "D", text: "60s" }],
    correctOption: "C",
    category: "analytical",
    difficulty: "medium",
    explanation: "Speed = 200/20 = 10m/s. Distance = 200+300 = 500m. Time = 500/10 = 50s."
  },

  // ── VERBAL (6 questions) ───────────────────────────────────────
  {
    questionText: "Choose the word most similar in meaning to BENEVOLENT:",
    options: [{ label: "A", text: "Malicious" }, { label: "B", text: "Charitable" }, { label: "C", text: "Indifferent" }, { label: "D", text: "Strict" }],
    correctOption: "B",
    category: "verbal",
    difficulty: "easy",
    explanation: "Benevolent means kind and generous. Charitable is the closest synonym."
  },
  {
    questionText: "Choose the correct sentence:",
    options: [
      { label: "A", text: "He don't know the answer." },
      { label: "B", text: "Neither of the students have submitted." },
      { label: "C", text: "The committee has reached a decision." },
      { label: "D", text: "One of the boys are absent." }
    ],
    correctOption: "C",
    category: "verbal",
    difficulty: "medium",
    explanation: "Collective nouns like 'committee' take singular verbs."
  },
  {
    questionText: "Identify the meaning of the idiom: 'To bite the bullet'",
    options: [
      { label: "A", text: "To be very hungry" },
      { label: "B", text: "To endure a painful situation stoically" },
      { label: "C", text: "To make a quick decision" },
      { label: "D", text: "To be aggressive" }
    ],
    correctOption: "B",
    category: "verbal",
    difficulty: "easy",
    explanation: "'Bite the bullet' means to endure a painful/difficult situation with courage."
  },
  {
    questionText: "Select the best antonym for LOQUACIOUS:",
    options: [{ label: "A", text: "Talkative" }, { label: "B", text: "Verbose" }, { label: "C", text: "Taciturn" }, { label: "D", text: "Eloquent" }],
    correctOption: "C",
    category: "verbal",
    difficulty: "medium",
    explanation: "Loquacious = very talkative. Taciturn = reserved and saying little. They are antonyms."
  },
  {
    questionText: "Fill in the blank: Despite working hard, she ______ the project deadline.",
    options: [
      { label: "A", text: "missed" },
      { label: "B", text: "had missed" },
      { label: "C", text: "was missing" },
      { label: "D", text: "would miss" }
    ],
    correctOption: "A",
    category: "verbal",
    difficulty: "easy",
    explanation: "Simple past tense 'missed' is correct for a completed action with 'despite'."
  },
  {
    questionText: "Reading Comprehension: 'The internet has democratized information but also created echo chambers.' What does 'echo chambers' mean here?",
    options: [
      { label: "A", text: "Rooms with good acoustics" },
      { label: "B", text: "Environments where beliefs are amplified by like-minded sources" },
      { label: "C", text: "Loud discussion forums" },
      { label: "D", text: "Internet speed boosters" }
    ],
    correctOption: "B",
    category: "verbal",
    difficulty: "medium",
    explanation: "Echo chambers = spaces where one's existing views are reinforced without exposure to opposing viewpoints."
  },

  // ── QUANTITATIVE (6 questions) ─────────────────────────────────
  {
    questionText: "What is 15% of 240?",
    options: [{ label: "A", text: "30" }, { label: "B", text: "36" }, { label: "C", text: "34" }, { label: "D", text: "40" }],
    correctOption: "B",
    category: "quantitative",
    difficulty: "easy",
    explanation: "15% of 240 = 240 × 0.15 = 36"
  },
  {
    questionText: "The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?",
    options: [{ label: "A", text: "18" }, { label: "B", text: "20" }, { label: "C", text: "15" }, { label: "D", text: "25" }],
    correctOption: "B",
    category: "quantitative",
    difficulty: "easy",
    explanation: "3:2 ratio. If boys=30, then girls = (2/3)×30 = 20"
  },
  {
    questionText: "A sum of ₹5000 is invested at 8% per annum compound interest for 2 years. What is the amount?",
    options: [{ label: "A", text: "₹5800" }, { label: "B", text: "₹5832" }, { label: "C", text: "₹5850" }, { label: "D", text: "₹5820" }],
    correctOption: "B",
    category: "quantitative",
    difficulty: "medium",
    explanation: "A = 5000(1+0.08)² = 5000×1.1664 = ₹5832"
  },
  {
    questionText: "Solve: 2x + 5 = 17",
    options: [{ label: "A", text: "x = 5" }, { label: "B", text: "x = 6" }, { label: "C", text: "x = 7" }, { label: "D", text: "x = 4" }],
    correctOption: "B",
    category: "quantitative",
    difficulty: "easy",
    explanation: "2x = 17-5 = 12, x = 6"
  },
  {
    questionText: "The average of 5 numbers is 12. If one number is removed, the average becomes 11. What was the removed number?",
    options: [{ label: "A", text: "14" }, { label: "B", text: "16" }, { label: "C", text: "17" }, { label: "D", text: "15" }],
    correctOption: "B",
    category: "quantitative",
    difficulty: "medium",
    explanation: "Sum of 5 = 60. Sum of 4 = 44. Removed = 60-44 = 16"
  },
  {
    questionText: "A bag has 4 red and 6 blue balls. What is the probability of picking a red ball?",
    options: [{ label: "A", text: "2/5" }, { label: "B", text: "3/5" }, { label: "C", text: "1/4" }, { label: "D", text: "1/3" }],
    correctOption: "A",
    category: "quantitative",
    difficulty: "easy",
    explanation: "P(red) = 4/10 = 2/5"
  },

  // ── INTEREST / PREFERENCE (6 questions) ────────────────────────
  {
    questionText: "Which activity would you enjoy most on a weekend?",
    options: [
      { label: "A", text: "Building an app or fixing gadgets" },
      { label: "B", text: "Reading books or writing stories" },
      { label: "C", text: "Managing a small business or budgeting" },
      { label: "D", text: "Helping someone with a personal problem" }
    ],
    correctOption: "A",
    category: "interest",
    difficulty: "easy",
    explanation: "This reveals preference for technology/engineering."
  },
  {
    questionText: "In a group project, which role would you most naturally take?",
    options: [
      { label: "A", text: "The leader who coordinates everyone" },
      { label: "B", text: "The researcher who gathers information" },
      { label: "C", text: "The creative who designs the presentation" },
      { label: "D", text: "The analyst who checks numbers and facts" }
    ],
    correctOption: "A",
    category: "interest",
    difficulty: "easy",
    explanation: "Leadership preference indicates management/business inclination."
  },
  {
    questionText: "Which subject did you enjoy most in school?",
    options: [
      { label: "A", text: "Mathematics or Physics" },
      { label: "B", text: "English or Social Studies" },
      { label: "C", text: "Biology or Chemistry" },
      { label: "D", text: "Commerce or Economics" }
    ],
    correctOption: "A",
    category: "interest",
    difficulty: "easy",
    explanation: "This maps academic interest to potential career fields."
  },
  {
    questionText: "If you could have any career, which would you prefer?",
    options: [
      { label: "A", text: "Software engineer at a tech startup" },
      { label: "B", text: "Doctor at a hospital" },
      { label: "C", text: "Entrepreneur running my own business" },
      { label: "D", text: "Artist or designer working freelance" }
    ],
    correctOption: "A",
    category: "interest",
    difficulty: "easy",
    explanation: "Direct career preference mapping."
  },
  {
    questionText: "Which challenge excites you most?",
    options: [
      { label: "A", text: "Solving a complex coding problem" },
      { label: "B", text: "Persuading a crowd with a speech" },
      { label: "C", text: "Diagnosing and treating a patient" },
      { label: "D", text: "Designing a beautiful product" }
    ],
    correctOption: "A",
    category: "interest",
    difficulty: "easy",
    explanation: "Problem-solving preference maps to engineering/tech."
  },
  {
    questionText: "Where do you see yourself in 10 years?",
    options: [
      { label: "A", text: "Leading a team at a large organization" },
      { label: "B", text: "Running my own successful venture" },
      { label: "C", text: "Making a scientific discovery" },
      { label: "D", text: "Creating art that impacts people" }
    ],
    correctOption: "A",
    category: "interest",
    difficulty: "easy",
    explanation: "Long-term vision maps to career aspiration categories."
  }
];

module.exports = { QUESTION_BANK };