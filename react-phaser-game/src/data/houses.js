// Helper to create simple dialogue response -> next options
const createDialog = (text, options = []) => ({ text, options })

// --- DAY 1 DIALOGUES ---

const day1_house1_ishaan = createDialog("You are here about Kabir, na?", [
  {
    label: "When did you last see Kabir?",
    response: "Yesterday. As the sun went down.",
    nextDialog: createDialog("Yesterday. As the sun went down.", [
      { label: "Was he alone?", response: "Yes. But he was staring at Vikram." },
      { label: "Why Vikram?", response: "I don't know. Vikram acted... like he didn't know him." }
    ])
  },
  {
    label: "How is Vikram behaving?",
    response: "Strange. He is usually loud. Today he is... watching.",
    nextDialog: createDialog("Watching?", [
      { label: "Watching who?", response: "Everyone. Like a wolf watching sheep." }
    ])
  },
  // End Options
  { label: "That’s all.", response: "Be careful of the woods." },
  { label: "Investigate (Free Chat)", action: "chat" }
])

const day1_house2_anya = createDialog("He is gone. My poor Kabir.", [
  {
    label: "You treated Kabir?",
    response: "Yes. He was afraid of something.",
    nextDialog: createDialog("Afraid of what?", [
      { label: "Himself?", response: "No. He said 'The skin does not fit'." }
    ])
  },
  {
    label: "Have you seen Vikram?",
    response: "He passed by. He did not greet me.",
    nextDialog: createDialog("Is that unusual?", [
      { label: "Yes.", response: "Vikram always greets me. Today... he looked through me." }
    ])
  },
  // End Options
  { label: "Keep your eyes open.", response: "I always do." },
  { label: "Investigate (Free Chat)", action: "chat" }
])

const day1_house3_vikram = createDialog("What do you want, Guard?", [
  {
    label: "Where were you last night?",
    response: "Hunting. Always hunting.",
    nextDialog: createDialog("Hunting what?", [
      { label: "Prey.", response: "Big prey. Fresh meat." }
    ])
  },
  {
    label: "Did you see Kabir?",
    response: "Kabir? Weak little man. He is gone.",
    nextDialog: createDialog("You don't sound concerned.", [
      { label: "Concerned?", response: "The weak feed the strong. That is the law." }
    ])
  },
  {
    label: "You seem... different.",
    response: "I am stronger. Is that a crime?",
    nextDialog: createDialog("No.", [
      { label: "Good.", response: "Then leave me. I have... eating to do." }
    ])
  },
  // End Options
  { label: "Stay clean, Vikram.", response: "My hands are always clean. Or licked clean." },
  { label: "Investigate (Free Chat)", action: "chat" }
])

const day1_house4_diya = createDialog("P-Please, don't look at me like that.", [
  {
    label: "I'm just asking questions.",
    response: "Vikram... he was outside my window.",
    nextDialog: createDialog("Vikram?", [
      { label: " doing what?", response: "Just standing. Breathing." }
    ])
  },
  {
    label: "Are you okay?",
    response: "I feel cold. Even near the fire.",
  },
  // End Options
  { label: "Lock your door.", response: "I will." },
  { label: "Investigate (Free Chat)", action: "chat" }
])

const day1_house5_amar = createDialog("The wind smells of rot.", [
  {
    label: "It's just the jungle.",
    response: "No. It is old death. Masked.",
    nextDialog: createDialog("Masked by what?", [
      { label: "Fresh skin.", response: "Be careful, Guard. Eyes deceive." }
    ])
  },
  // End Options
  { label: "Rest, Elder.", response: "There is no rest now." },
  { label: "Investigate (Free Chat)", action: "chat" }
])

// --- DAY 2 DIALOGUES ---

// House 3 (Vikram) is DEAD. 
const day2_house1_ishaan = createDialog("I SAW HIM! I SAW HIM YESTERDAY!", [
  {
    label: "Calm down. Who?",
    response: "Vikram! He spoke to me! He laughed!",
    nextDialog: createDialog("He spoke to you?", [
      { label: "Yes!", response: "But Anya says he is... dead for days? How??" },
      { label: "What did he say?", response: "He said 'The flour tastes good'." }
    ])
  },
  {
    label: "If he was dead...",
    response: "Then what was IN HIS HOUSE??",
    nextDialog: createDialog("A demon.", [
      { label: "Hanuman save us.", response: "It wears us. It WEARS us!" }
    ])
  },
  // End Options
  { label: "Stay inside.", response: "I am never coming out." },
  { label: "Investigate (Free Chat)", action: "chat" }
])

const day2_house2_anya = createDialog("It is... medically impossible.", [
  {
    label: "Report, Anya.",
    response: "Vikram. His body... the decay.",
    nextDialog: createDialog("The decay?", [
      { label: "Explain.", response: "He has been dead for at least 48 hours. Since BEFORE yesterday." },
      { label: "But we talked to him.", response: "We talked to his skin. Not him." }
    ])
  },
  {
    label: "So yesterday's Vikram was...",
    response: "The Skinwalker. Yes.",
    nextDialog: createDialog("Where is it now?", [
      { label: "It shed him.", response: "And it took another. Someone is lying today." }
    ])
  },
  // End Options
  { label: "Identify the deceiver.", response: "Look for the one who has changed." },
  { label: "Investigate (Free Chat)", action: "chat" }
])

const day2_house4_diya = createDialog("The morning is so beautiful, isn't it?", [
  {
    label: "You act cheerful.",
    response: "Why not? The sun is warm.",
    nextDialog: createDialog("Vikram is dead.", [
      { label: "Oh?", response: "People die. It is the circle." }, // Too calm
      { label: "You were terrified yesterday.", response: "I was? I feel... new today." }
    ])
  },
  {
    label: "What are you weaving?",
    response: "A... cloth. For the festival.",
    nextDialog: createDialog("Which festival?", [
      { label: "The big one.", response: "You know. The one with the... dancing?" } // Diya should know the name
    ])
  },
  // End Options
  { label: "Stay put.", response: "I will be right here. Weaving." },
  { label: "Investigate (Free Chat)", action: "chat" }
])

const day2_house5_amar = createDialog("It has changed skins.", [
  {
    label: "Vikram was the vessel.",
    response: "Yes. And now he is discarded.",
  },
  {
    label: "Who is it now?",
    response: "Listen to the tone. The rhythm.",
    nextDialog: createDialog("Rhythm?", [
      { label: "Yes.", response: "Fear does not vanish overnight." }
    ])
  },
  // End Options
  { label: "I will find it.", response: "Be quick. It feeds at night." },
  { label: "Investigate (Free Chat)", action: "chat" }
])

// --- DAY 3 DIALOGUES ---

const day3_house1_ishaan = createDialog("Diya... not Diya...", [
  { label: "She is dead.", response: "Dead for two days, Anya says. DEAD FOR TWO DAYS." },
  { label: "I spoke to her yesterday.", response: "IT grinned at you. It was laughing at us." }
])

const day3_house2_anya = createDialog("The same pattern.", [
  { label: "Diya?", response: "Dead before yesterday. The body is... empty." },
  { label: "It was pretending to be her.", response: "And it did a poor job. She didn't know the weave." }
])

const day3_house5_amar = createDialog("Two skins shed.", [
  { label: "Who is left?", response: "Only the strongest remain." },
  { label: "Is it you?", response: "If it were me, you would already be dead." }
])

// --- DAY 4 DIALOGUES ---

const day4_house1_ishaan = createDialog("Is it you? Or is it me?", [
  { label: "Amar is dead.", response: "The Elder... gone. We are the last two." },
  { label: "One of us is the demon.", response: "I know. I've been watching you. Have you been watching me?" },
  { label: "Investigate (Free Chat)", action: "chat" }
])

const day4_house2_anya = createDialog("The final test.", [
  { label: "Only we remain.", response: "Yes. The Rakshasa is one of us now." },
  { label: "How do we know who?", response: "We don't. That's the horror of it." },
  { label: "Investigate (Free Chat)", action: "chat" }
])

export const houses = [
  {
    id: "house_corin",
    type: "villager",
    x: 1500,
    y: 210,
    image: "house4",
    status: "missing",
    altImage: "house4-infected",
    infectedImage: "assets/first-house.png",
    npc: { name: "Kabir's House", portrait: null, dialog: [] }
  },
  {
    id: "guard_house",
    type: "guard",
    x: 860,
    y: 280,
    image: "house5",
    status: "normal",
    npc: {
      name: "Guard (You)",
      portrait: "assets/male1.png",
      dialog: [
        {
          text: "Night is falling. Do you wish to sleep until morning?",
          options: [
            { label: "Sleep (Next Day)", action: "sleep", response: "Rest well." },
            { label: "Eliminate Villager", action: "eliminate", response: "Who do you suspect?" },
            { label: "Cancel", action: "close", response: "Stay safe." }
          ]
        }
      ]
    }
  },
  {
    id: "house_1",
    type: "villager",
    x: 80,
    y: 1100,
    image: "house2",
    status: "normal",
    altImage: "house2-infected",
    infectedImage: "assets/murder-house1.png",
    day1: { npc: { name: "Ishaan the Miller", portrait: "assets/male1.png", dialog: [day1_house1_ishaan] } },
    day2: { npc: { name: "Ishaan the Miller", portrait: "assets/male1.png", dialog: [day2_house1_ishaan] } },
    day3: { npc: { name: "Ishaan the Miller", portrait: "assets/male1.png", dialog: [day3_house1_ishaan] } },
    npc: { name: "Ishaan the Miller", portrait: "assets/male1.png", dialog: [day1_house1_ishaan] }
  },
  {
    id: "house_2",
    type: "villager",
    x: 80,
    y: 450,
    image: "house1",
    status: "normal",
    altImage: "house1-infected",
    infectedImage: "assets/murder-house2.png",
    day1: { npc: { name: "Anya the Herbalist", portrait: "assets/female1.png", dialog: [day1_house2_anya] } },
    day2: { npc: { name: "Anya the Herbalist", portrait: "assets/female1.png", dialog: [day2_house2_anya] } },
    day3: { npc: { name: "Anya the Herbalist", portrait: "assets/female1.png", dialog: [day3_house2_anya] } },
    npc: { name: "Anya the Herbalist", portrait: "assets/female1.png", dialog: [day1_house2_anya] }
  },
  {
    id: "house_3",
    type: "villager",
    x: 1490,
    y: 700,
    image: "house3",
    status: "normal",
    altImage: "house3-infected",
    infectedImage: "assets/murder-house3.png",
    day1: { npc: { name: "Vikram the Hunter", portrait: "assets/male2.png", dialog: [day1_house3_vikram] } },
    day2: { npc: null, status: "dead", infectedImage: "assets/murder-house3.png" }, // Status dead
    day3: { npc: null, status: "dead", infectedImage: "assets/murder-house3.png" }, // Still dead
    npc: { name: "Vikram the Hunter", portrait: "assets/male2.png", dialog: [day1_house3_vikram] }
  },
  {
    id: "house_4",
    type: "villager",
    x: 1300,
    y: 1100,
    image: "house6", // Default
    status: "normal",
    altImage: "house6-infected",
    infectedImage: "assets/murder-house1.png",
    day1: { npc: { name: "Diya the Weaver", portrait: "assets/female2.png", dialog: [day1_house4_diya] } },
    day2: { npc: { name: "Diya the Weaver", portrait: "assets/female2.png", dialog: [day2_house4_diya] } },
    day3: { npc: null, status: "dead", infectedImage: "assets/murder-house2.png" }, // DIES ON DAY 3
    npc: { name: "Diya the Weaver", portrait: "assets/female2.png", dialog: [day1_house4_diya] }
  },
  {
    id: "house_5",
    type: "villager",
    x: 900,
    y: 800,
    image: "house7",
    status: "normal",
    altImage: "house7-infected",
    infectedImage: "assets/murder-house2.png",
    day1: { npc: { name: "Amar the Elder", portrait: "assets/male22.png", dialog: [day1_house5_amar] } },
    day2: { npc: { name: "Amar the Elder", portrait: "assets/male22.png", dialog: [day2_house5_amar] } },
    day3: { npc: { name: "Amar the Elder", portrait: "assets/male22.png", dialog: [day3_house5_amar] } },
    npc: { name: "Amar the Elder", portrait: "assets/male22.png", dialog: [day1_house5_amar] }
  }
]
