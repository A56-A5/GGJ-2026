// Helper to create simple dialogue response -> next options
const createDialog = (text, options = []) => ({ text, options })

// --- DAY 1 DIALOGUES ---

const day1_house1_eldric = createDialog("You’re here about Corin, aren’t you.", [
  {
    label: "When did you last see Corin?",
    response: "Yesterday. Near dusk.",
    nextDialog: createDialog("Yesterday. Near dusk.", [
      { label: "Was he alone?", response: "As usual." },
      { label: "Anything strange?", response: "He stared too long." }
    ])
  },
  {
    label: "Describe his behavior.",
    response: "Quiet. Unsettling.",
    nextDialog: createDialog("Quiet. Unsettling.", [
      { label: "In what way?", response: "Like he was listening." },
      { label: "To what?", response: "To people, not sounds." }
    ])
  },
  {
    label: "Did he mention leaving?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Did he seem afraid?", response: "No. Curious." }
    ])
  },
  // End Options
  { label: "That’s all.", response: "Hope you find him." },
  { label: "If you remember more, tell me.", response: "I will." },
  { label: "Stay available.", response: "Of course." }
])

const day1_house2_marra = createDialog("He’s gone, isn’t he?", [
  {
    label: "You treated Corin before.",
    response: "Yes.",
    nextDialog: createDialog("Yes.", [
      { label: "For what?", response: "Sleeplessness." },
      { label: "Nightmares?", response: "No. Obsessions." }
    ])
  },
  {
    label: "Did he say anything strange?",
    response: "He asked how to be someone else.",
    nextDialog: createDialog("He asked how to be someone else.", [
      { label: "Exactly?", response: "Those words." },
      { label: "Your reaction?", response: "I stopped seeing him." }
    ])
  },
  {
    label: "Did you see him last night?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Hear him?", response: "Yes." },
      { label: "From where?", response: "Near my window." }
    ])
  },
  // End Options
  { label: "That’s enough.", response: "Be careful." },
  { label: "Why didn’t you report this?", response: "I thought he was harmless." },
  { label: "I may return.", response: "I won’t sleep." }
])

const day1_house3_tobin = createDialog("Don’t pin this on me.", [
  {
    label: "Did you interact with Corin?",
    response: "Barely.",
    nextDialog: createDialog("Barely.", [
      { label: "Why avoid him?", response: "Predators don’t look at you like that." },
      { label: "Like what?", response: "Like practice." }
    ])
  },
  {
    label: "Last time you saw him?",
    response: "Yesterday.",
    nextDialog: createDialog("Yesterday.", [
      { label: "Where?", response: "Near the treeline." },
      { label: "What was he doing?", response: "Watching houses." }
    ])
  },
  {
    label: "Did you follow him?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Wanted to?", response: "Yes." }
    ])
  },
  // End Options
  { label: "You’re clear.", response: "Good." },
  { label: "If you remember more…", response: "I’ll come find you." },
  { label: "Stay inside tonight.", response: "I will." }
])

const day1_house4_lysa = createDialog("…He asked me questions.", [
  {
    label: "What kind of questions?",
    response: "About routines.",
    nextDialog: createDialog("About routines.", [
      { label: "Whose?", response: "Everyone’s." },
      { label: "Yours?", response: "Yes." }
    ])
  },
  {
    label: "Did he scare you?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Then why pause?", response: "Because I didn’t like him." }
    ])
  },
  {
    label: "Did you see him last night?",
    response: "Yes.",
    nextDialog: createDialog("Yes.", [
      { label: "Time?", response: "Late." },
      { label: "Doing what?", response: "Standing still." }
    ])
  },
  // End Options
  { label: "That’s all.", response: "…Okay." },
  { label: "You did nothing wrong.", response: "…Thank you." },
  { label: "I might return.", response: "I’ll remember." }
])

const day1_house5_bram = createDialog("He was always wrong.", [
  {
    label: "How so?",
    response: "He listened too hard.",
    nextDialog: createDialog("He listened too hard.", [
      { label: "To what?", response: "People." },
      { label: "Intentions?", response: "Yes." }
    ])
  },
  {
    label: "Did you warn anyone?",
    response: "I warned him.",
    nextDialog: createDialog("I warned him.", [
      { label: "About what?", response: "Becoming something else." }
    ])
  },
  {
    label: "Do you think he left?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Then what happened?", response: "He succeeded." }
    ])
  },
  // End Options
  { label: "That’s enough.", response: "For today." },
  { label: "You know more.", response: "And you know less." },
  { label: "I’ll return.", response: "You should." }
])

// --- DAY 2 DIALOGUES ---

// House 3 (Tobin) is DEAD. No dialogue. Handled by status="dead" check in UI.

const day2_house1_eldric = createDialog("You saw him, didn’t you…", [
  {
    label: "When did you last see Tobin alive?",
    response: "Yesterday evening.",
    nextDialog: createDialog("Yesterday evening.", [
      { label: "Where?", response: "Near the fields." },
      { label: "Alone?", response: "Yes. That’s normal." }
    ])
  },
  {
    label: "Did you hear anything last night?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Nothing at all?", response: "…No." },
      { label: "You hesitated.", response: "Because I don’t want to think about it." }
    ])
  },
  {
    label: "Who would Tobin trust enough to open his door?",
    response: "Anyone. He wasn’t careful.",
    nextDialog: createDialog("Anyone. He wasn’t careful.", [
      { label: "Anyone specific?", response: "No." },
      { label: "Not even Corin?", response: "…Especially not him." }
    ])
  },
  // End Options
  { label: "That’s all.", response: "Find whoever did this." },
  { label: "Stay inside tonight.", response: "I will." },
  { label: "I may return.", response: "I won’t sleep anyway." }
])

const day2_house2_marra = createDialog("That’s unfortunate.", [
  { label: "You don’t seem shocked.", response: "Shock doesn’t help." },
  {
    label: "When did you last see Tobin?",
    response: "Yesterday.",
    nextDialog: createDialog("Yesterday.", [
      { label: "Time?", response: "Evening." },
      { label: "Where?", response: "Outside." }
    ])
  },
  {
    label: "Did Tobin come to you for herbs?",
    response: "No."
  },
  {
    label: "How would someone remove a face?",
    response: "…Why ask that?",
    nextDialog: createDialog("…Why ask that?", [
      { label: "Answer the question.", response: "With tools." }
    ])
  },
  // End Options
  { label: "That’s all.", response: "Good." },
  { label: "You’re acting strange.", response: "Everyone is." },
  { label: "I’ll be watching you.", response: "You already are." }
])

const day2_house4_lysa = createDialog("He doesn’t have a face…", [
  {
    label: "Did you see anyone near Tobin’s house?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Hear anything?", response: "Yes." },
      { label: "What?", response: "Someone walking slowly." }
    ])
  },
  {
    label: "Slowly?",
    response: "Like they knew where they were going."
  },
  {
    label: "Did you recognize them?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Silhouette?", response: "Wrong." },
      { label: "Wrong how?", response: "Too still." }
    ])
  },
  { label: "Who are you afraid of?", response: "…Everyone." },
  // End Options
  { label: "You’re safe for now.", response: "No one is." },
  { label: "Stay inside.", response: "I won’t sleep." },
  { label: "I may return.", response: "…Okay." }
])

const day2_house5_bram = createDialog("It’s begun.", [
  { label: "You expected this?", response: "I feared it." },
  {
    label: "What took Tobin’s face?",
    response: "Something that needed it.",
    nextDialog: createDialog("Something that needed it.", [
      { label: "For what?", response: "Practice." }
    ])
  },
  {
    label: "Who is in danger next?",
    response: "Those who are watched.",
    nextDialog: createDialog("Those who are watched.", [
      { label: "Who’s watching?", response: "It is." }
    ])
  },
  {
    label: "Is someone not who they seem?",
    response: "Yes.",
    nextDialog: createDialog("Yes.", [
      { label: "Who?", response: "You must decide that." },
      { label: "Why not tell me?", response: "Because it learns faster that way." }
    ])
  },
  // End Options
  { label: "That’s enough.", response: "For today." },
  { label: "You know more.", response: "And you know less." },
  { label: "I’ll return.", response: "You should." }
])

export const houses = [
  {
    id: "guard_house",
    type: "guard",
    x: 800,
    y: 150,
    image: "house3",
    status: "normal",
    npc: {
      name: "Guard Captain",
      portrait: "assets/farmer.png",
      dialog: [
        {
          text: "Night is falling. Do you wish to sleep until morning?",
          options: [
            { label: "Sleep (Next Day)", action: "sleep", response: "Rest well." },
            { label: "Cancel", action: "close", response: "Stay safe." }
          ]
        }
      ]
    }
  },
  {
    id: "house_1",
    type: "villager",
    x: 200,
    y: 300,
    image: "house1",
    status: "normal",
    infectedImage: "assets/murder-house1.png",
    day1: { npc: { name: "Eldric the Miller", portrait: "assets/farmer.png", dialog: [day1_house1_eldric] } },
    day2: { npc: { name: "Eldric the Miller", portrait: "assets/farmer.png", dialog: [day2_house1_eldric] } },
    npc: { name: "Eldric the Miller", portrait: "assets/farmer.png", dialog: [day1_house1_eldric] }
  },
  {
    id: "house_2",
    type: "villager",
    x: 1200,
    y: 350,
    image: "house2",
    status: "normal",
    infectedImage: "assets/murder-house2.png",
    day1: { npc: { name: "Marra the Herbalist", portrait: "assets/farmer.png", dialog: [day1_house2_marra] } },
    day2: { npc: { name: "Marra (Herbalist)", portrait: "assets/farmer.png", dialog: [day2_house2_marra] } },
    npc: { name: "Marra the Herbalist", portrait: "assets/farmer.png", dialog: [day1_house2_marra] }
  },
  {
    id: "house_3",
    type: "villager",
    x: 400,
    y: 600,
    image: "house3",
    status: "normal",
    infectedImage: "assets/murder-house1.png",
    day1: { npc: { name: "Tobin the Hunter", portrait: "assets/farmer.png", dialog: [day1_house3_tobin] } },
    day2: { npc: null, status: "dead", infectedImage: "assets/murder-house1.png" }, // No NPC data needed if status dead? UI handles it.
    npc: { name: "Tobin the Hunter", portrait: "assets/farmer.png", dialog: [day1_house3_tobin] }
  },
  {
    id: "house_4",
    type: "villager",
    x: 1000,
    y: 700,
    image: "house1",
    status: "normal",
    infectedImage: "assets/murder-house1.png",
    day1: { npc: { name: "Lysa the Weaver", portrait: "assets/farmer.png", dialog: [day1_house4_lysa] } },
    day2: { npc: { name: "Lysa the Weaver", portrait: "assets/farmer.png", dialog: [day2_house4_lysa] } },
    npc: { name: "Lysa the Weaver", portrait: "assets/farmer.png", dialog: [day1_house4_lysa] }
  },
  {
    id: "house_5",
    type: "villager",
    x: 700,
    y: 900,
    image: "house2",
    status: "normal",
    infectedImage: "assets/murder-house2.png",
    day1: { npc: { name: "Bram the Elder", portrait: "assets/farmer.png", dialog: [day1_house5_bram] } },
    day2: { npc: { name: "Bram the Elder", portrait: "assets/farmer.png", dialog: [day2_house5_bram] } },
    npc: { name: "Bram the Elder", portrait: "assets/farmer.png", dialog: [day1_house5_bram] }
  }
]
