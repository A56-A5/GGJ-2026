// Helper to create simple dialogue response -> next options
const createDialog = (text, options = []) => ({ text, options })

// --- DAY 1 DIALOGUES ---

const day1_house1_ishaan = createDialog("You are here about Kabir, na?", [
  {
    label: "When did you last see Kabir?",
    response: "Yesterday. As the sun went down.",
    nextDialog: createDialog("Yesterday. As the sun went down.", [
      { label: "Was he alone?", response: "Yes, but he looked... heavily burdened." },
      { label: "Anything strange?", response: "He stared too long. At nothing." }
    ])
  },
  {
    label: "Describe his behavior.",
    response: "Quiet. Too quiet, bhai.",
    nextDialog: createDialog("Quiet. Too quiet, bhai.", [
      { label: "In what way?", response: "Like he was listening to the wind." },
      { label: "To what?", response: "To voices we cannot hear." }
    ])
  },
  {
    label: "Did he mention leaving?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Did he seem afraid?", response: "No. Curious. Which is worse." }
    ])
  },
  // End Options
  { label: "That’s all.", response: "May the gods protect him." },
  { label: "Investigate (Free Chat)", action: "chat" },
  { label: "If you remember more, tell me.", response: "I will try." },
  { label: "Stay available.", response: "I am always here." }
])

const day1_house2_anya = createDialog("He is gone, isn’t he? My poor Kabir.", [
  {
    label: "You treated Kabir before.",
    response: "Yes. For his mind.",
    nextDialog: createDialog("Yes. For his mind.", [
      { label: "For what?", response: "Sleeplessness. Bad dreams." },
      { label: "Nightmares?", response: "No. Obsessions with the old stories." }
    ])
  },
  {
    label: "Did he say anything strange?",
    response: "He asked how to become... someone else.",
    nextDialog: createDialog("He asked how to become... someone else.", [
      { label: "Exactly?", response: "Yes. He spoke of skins." },
      { label: "Your reaction?", response: "I told him to pray." }
    ])
  },
  {
    label: "Did you see him last night?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Hear him?", response: "Yes." },
      { label: "From where?", response: "Scratching at my window." }
    ])
  },
  // End Options
  { label: "That’s enough.", response: "Radhe Radhe." },
  { label: "Investigate (Free Chat)", action: "chat" },
  { label: "Why didn’t you report this?", response: "I thought it was just the fever." },
  { label: "I may return.", response: "I will be praying." }
])

const day1_house3_vikram = createDialog("Do not pin this on me, Inspector.", [
  {
    label: "Did you interact with Kabir?",
    response: "Barely.",
    nextDialog: createDialog("Barely.", [
      { label: "Why avoid him?", response: "A hunter knows a predator." },
      { label: "Like what?", response: "He looked at us like prey." }
    ])
  },
  {
    label: "Last time you saw him?",
    response: "Yesterday.",
    nextDialog: createDialog("Yesterday.", [
      { label: "Where?", response: "Near the jungle edge." },
      { label: "What was he doing?", response: "Watching the houses." }
    ])
  },
  {
    label: "Did you follow him?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Wanted to?", response: "Yes. My gut said danger." }
    ])
  },
  // End Options
  { label: "You’re clear.", response: "Hmph. Listen to the jungle tonight." },
  { label: "Investigate (Free Chat)", action: "chat" },
  { label: "If you remember more…", response: "I will find you." },
  { label: "Stay inside tonight.", response: "I am always prepared." }
])

const day1_house4_diya = createDialog("…He asked such strange questions.", [
  {
    label: "What kind of questions?",
    response: "About our routines.",
    nextDialog: createDialog("About routines.", [
      { label: "Whose?", response: "Everyone's. Even the children." },
      { label: "Yours?", response: "Yes. When I sleep." }
    ])
  },
  {
    label: "Did he scare you?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Then why pause?", response: "Because his eyes... were empty." }
    ])
  },
  {
    label: "Did you see him last night?",
    response: "Yes.",
    nextDialog: createDialog("Yes.", [
      { label: "Time?", response: "Very late." },
      { label: "Doing what?", response: "Standing still. Watching." }
    ])
  },
  // End Options
  { label: "That’s all.", response: "…Okay." },
  { label: "Investigate (Free Chat)", action: "chat" },
  { label: "You did nothing wrong.", response: "…Shukriya." },
  { label: "I might return.", response: "I will remember." }
])

const day1_house5_amar = createDialog("He was always lost, that boy.", [
  {
    label: "How so?",
    response: "He listened too hard to the whispers.",
    nextDialog: createDialog("He listened too hard to the whispers.", [
      { label: "To what?", response: "The Rakshasas." },
      { label: "Intentions?", response: "To become one." }
    ])
  },
  {
    label: "Did you warn anyone?",
    response: "I warned him.",
    nextDialog: createDialog("I warned him.", [
      { label: "About what?", response: "The cost of such power." }
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
  { label: "That’s enough.", response: "Go with God." },
  { label: "Investigate (Free Chat)", action: "chat" },
  { label: "You know more.", response: "I know what the Vedas say." },
  { label: "I’ll return.", response: "You should." }
])

// --- DAY 2 DIALOGUES ---

// House 3 (Vikram) is DEAD. No dialogue. Handled by status="dead" check in UI.

const day2_house1_ishaan = createDialog("You saw him, didn’t you… poor Vikram.", [
  {
    label: "When did you last see Vikram alive?",
    response: "Yesterday evening.",
    nextDialog: createDialog("Yesterday evening.", [
      { label: "Where?", response: "Near the fields." },
      { label: "Alone?", response: "Yes. Sharpening his knife." }
    ])
  },
  {
    label: "Did you hear anything last night?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Nothing at all?", response: "…Only the monkeys screaming." },
      { label: "You hesitated.", response: "Because it wasn't monkeys." }
    ])
  },
  {
    label: "Who would Vikram trust enough to open his door?",
    response: "No one. He was a cautious man.",
    nextDialog: createDialog("No one. He was a cautious man.", [
      { label: "Anyone specific?", response: "Maybe... someone helpless." },
      { label: "Not even Kabir?", response: "…Especially not him." }
    ])
  },
  // End Options
  { label: "That’s all.", response: "Find this Rakshasa." },
  { label: "Stay inside tonight.", response: "I will lock everything." },
  { label: "I may return.", response: "I won’t sleep anyway." }
])

const day2_house2_anya = createDialog("Karma is cruel.", [
  { label: "You don’t seem shocked.", response: "Death is part of life." },
  {
    label: "When did you last see Vikram?",
    response: "Yesterday.",
    nextDialog: createDialog("Yesterday.", [
      { label: "Time?", response: "Before aarti." },
      { label: "Where?", response: "Walking the boundary." }
    ])
  },
  {
    label: "Did Vikram come to you for herbs?",
    response: "No. He trusted steel, not leaves."
  },
  {
    label: "How would someone remove a face?",
    response: "…Ram Ram. Why ask that?",
    nextDialog: createDialog("…Ram Ram. Why ask that?", [
      { label: "Answer the question.", response: "With a butcher's skill." }
    ])
  },
  // End Options
  { label: "That’s all.", response: "Om Shanti." },
  { label: "You’re acting strange.", response: "Fear makes us all strange." },
  { label: "I’ll be watching you.", response: "The gods are watching us all." }
])

const day2_house4_diya = createDialog("He doesn’t have a face…", [
  {
    label: "Did you see anyone near Vikram’s house?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Hear anything?", response: "Yes." },
      { label: "What?", response: "Footsteps. Heavy but soft." }
    ])
  },
  {
    label: "Soft?",
    response: "Like a tiger stalking."
  },
  {
    label: "Did you recognize them?",
    response: "No.",
    nextDialog: createDialog("No.", [
      { label: "Silhouette?", response: "Wrong." },
      { label: "Wrong how?", response: "Too tall. Too bent." }
    ])
  },
  { label: "Who are you afraid of?", response: "…Everyone." },
  // End Options
  { label: "You’re safe for now.", response: "No one is safe." },
  { label: "Stay inside.", response: "I will pray." },
  { label: "I may return.", response: "…Ji." }
])

const day2_house5_amar = createDialog("It has begun.", [
  { label: "You expected this?", response: "I saw the signs." },
  {
    label: "What took Vikram’s face?",
    response: "Something that wants to hide.",
    nextDialog: createDialog("Something that wants to hide.", [
      { label: "For what?", response: "To walk among us." }
    ])
  },
  {
    label: "Who is in danger next?",
    response: "Those who are watched.",
    nextDialog: createDialog("Those who are watched.", [
      { label: "Who’s watching?", response: "The Skinwalker." }
    ])
  },
  {
    label: "Is someone not who they seem?",
    response: "Yes.",
    nextDialog: createDialog("Yes.", [
      { label: "Who?", response: "Look for the flaws in the skin." },
      { label: "Why not tell me?", response: "Because it learns." }
    ])
  },
  // End Options
  { label: "That’s enough.", response: "Namaste." },
  { label: "You know more.", response: "I know the old stories." },
  { label: "I’ll return.", response: "Come back if you live." }
])

// --- DAY 3 DIALOGUES ---

const day3_house1_ishaan = createDialog("Diya... she is gone too.", [
  { label: "Did you see anything?", response: "No. I hid under my bed." },
  { label: "We need to do something.", response: "Pray. Hanuman Chalisa. That is all." },
  { label: "Who is next?", response: "You... or me." }
])

const day3_house2_anya = createDialog("Another soul taken.", [
  { label: "Why Diya?", response: "She saw something she shouldn't have." },
  { label: "Are you enjoying this?", response: "I am surviving, Inspector." },
  { label: "Help me stop it.", response: "Can you stop a demon? No." }
])

const day3_house5_amar = createDialog("The circle tightens.", [
  { label: "Is it a beast?", response: "It is a neighbor wearing a mask." },
  { label: "Do you know who?", response: "I have suspicions. But words are death." },
  { label: "Tell me.", response: "Trust no one. Not even your own shadow." }
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
    day2: { npc: { name: "Anya (Herbalist)", portrait: "assets/female1.png", dialog: [day2_house2_anya] } },
    day3: { npc: { name: "Anya (Herbalist)", portrait: "assets/female1.png", dialog: [day3_house2_anya] } },
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
    day2: { npd: null, status: "dead", infectedImage: "assets/murder-house3.png" }, // Status dead
    day3: { npd: null, status: "dead", infectedImage: "assets/murder-house3.png" }, // Still dead
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
    day3: { npd: null, status: "dead", infectedImage: "assets/murder-house2.png" }, // DIES ON DAY 3
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
