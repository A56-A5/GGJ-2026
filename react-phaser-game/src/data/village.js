/**
 * Data-driven village definition.
 *
 * Requirements:
 * - Houses are defined as:
 *   {
 *     id,
 *     type: "normal" | "guard" | "summoning",
 *     position: { x, y },
 *     textureKey,
 *     eventsByDay: { [dayNumber]: { type: "dialog" | "image", data } }
 *   }
 *
 * - Future-proof: generateVillage(seed) -> houses[]
 * - No game logic should assume fixed days / fixed house count.
 */

function mulberry32(seed) {
  let t = seed >>> 0
  return function rng() {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function pickOne(arr, rng) {
  if (!arr.length) return null
  const idx = Math.floor(rng() * arr.length)
  return arr[idx]
}

export const DEFAULT_SEED = 1337

/**
 * Generates a village (houses + rest spot) from a seed.
 * Day 2 rule:
 * - one of the normal houses is chosen at random to trigger an image event instead of dialog.
 */
export function generateVillage(seed = DEFAULT_SEED) {
  const rng = mulberry32(seed)

  /** @type {Array<import('./villageTypes').VillageHouse>} */
  const houses = [
    // Summoning Circle (special)
    {
      id: 'house_summoning',
      type: 'summoning',
      position: { x: 980, y: 260 },
      textureKey: 'house2',
      eventsByDay: {
        1: {
          type: 'image',
          data: {
            imageSrc: '/assets/cinematics/summoning_day1.png',
            caption: 'A faint hum echoes from the circle. Something is watching…'
          }
        }
      }
    },

    // Guard House
    {
      id: 'house_guard',
      type: 'guard',
      position: { x: 520, y: 220 },
      textureKey: 'house1',
      eventsByDay: {
        1: {
          type: 'dialog',
          data: {
            npc: {
              name: 'Guard Captain Holt',
              portrait: '/assets/portraits/guard.png',
              dialog: [
                {
                  text: 'Halt. Village rules are simple: no trouble, no weapons drawn. Understood?',
                  options: [
                    { label: 'Understood.', response: 'Good. Keep your head down and you’ll be fine.' },
                    { label: 'Seen anything strange?', response: 'Strange? Only rumors… about the old circle.' },
                    { label: 'Any work for me?', response: 'Help the villagers. Earn trust first.' },
                    { label: 'Leave.', response: null }
                  ]
                }
              ]
            }
          }
        }
      }
    },

    // Normal houses (Day 1 = dialog; Day 2 = dialog unless overridden)
    {
      id: 'house_1',
      type: 'normal',
      position: { x: 220, y: 240 },
      textureKey: 'house1',
      eventsByDay: {
        1: {
          type: 'dialog',
          data: {
            npc: {
              name: 'Elder Rowan',
              portrait: '/assets/portraits/elder.png',
              dialog: [
                {
                  text: 'Ah, a new face in the village. Welcome, traveler.',
                  options: [
                    { label: 'Who are you?', response: 'I guide this village. Listen well, and you’ll do fine.' },
                    { label: 'Any work for me?', response: 'Help the farmers first. Then we’ll talk.' },
                    { label: 'Tell me about this place.', response: 'Old, quiet… but kind to those who are kind back.' },
                    { label: 'Goodbye.', response: null }
                  ]
                }
              ]
            }
          }
        }
      }
    },
    {
      id: 'house_2',
      type: 'normal',
      position: { x: 300, y: 520 },
      textureKey: 'house2',
      eventsByDay: {
        1: {
          type: 'dialog',
          data: {
            npc: {
              name: 'Merchant Lyra',
              portrait: '/assets/portraits/merchant.png',
              dialog: [
                {
                  text: 'Welcome! I’ve got supplies for the road… if you’ve got coin.',
                  options: [
                    { label: 'What do you sell?', response: 'Tools, food, and odds-and-ends from far away.' },
                    { label: 'Any news?', response: 'People keep whispering about the circle again…' },
                    { label: 'Need help?', response: 'Bring me herbs and I’ll pay. Simple.' },
                    { label: 'Leave.', response: null }
                  ]
                }
              ]
            }
          }
        }
      }
    },
    {
      id: 'house_3',
      type: 'normal',
      position: { x: 620, y: 560 },
      textureKey: 'house1',
      eventsByDay: {
        1: {
          type: 'dialog',
          data: {
            npc: {
              name: 'Farmer Ben',
              portrait: '/assets/farmer.png',
              dialog: [
                {
                  text: 'Howdy. Don’t trample the crops, yeah?',
                  options: [
                    { label: 'What are you growing?', response: 'Wheat mostly. Some vegetables when the weather behaves.' },
                    { label: 'Need a hand?', response: 'Not today. Maybe later in the season.' },
                    { label: 'How’s the village?', response: 'Quiet. Too quiet sometimes.' },
                    { label: 'Leave.', response: null }
                  ]
                }
              ]
            }
          }
        }
      }
    },
    {
      id: 'house_4',
      type: 'normal',
      position: { x: 880, y: 700 },
      textureKey: 'house2',
      eventsByDay: {
        1: {
          type: 'dialog',
          data: {
            npc: {
              name: 'Innkeeper Sarah',
              portrait: '/assets/portraits/innkeeper.png',
              dialog: [
                {
                  text: 'Rooms are warm and meals are hot. What’ll it be?',
                  options: [
                    { label: 'Any stories?', response: 'Travelers talk of lights in the woods… and a circle that stirs.' },
                    { label: 'I need rest.', response: 'Rest is earned. But you can always sit by the fire.' },
                    { label: 'What’s good to eat?', response: 'Stew. Always stew. Best in the region.' },
                    { label: 'Leave.', response: null }
                  ]
                }
              ]
            }
          }
        }
      }
    }
  ]

  // Default Day 2 behavior: same as Day 1 for each house unless specified.
  for (const h of houses) {
    if (!h.eventsByDay[2]) {
      h.eventsByDay[2] = h.eventsByDay[1]
    }
  }

  // Day 2 special rule: one *normal* house becomes a cinematic image event.
  const normalHouseIds = houses.filter((h) => h.type === 'normal').map((h) => h.id)
  const chosenNormalForDay2 = pickOne(normalHouseIds, rng)
  if (chosenNormalForDay2) {
    const chosen = houses.find((h) => h.id === chosenNormalForDay2)
    if (chosen) {
      chosen.eventsByDay[2] = {
        type: 'image',
        data: {
          imageSrc: '/assets/cinematics/day2_house_vision.png',
          caption: 'A sudden vision flashes behind your eyes… something changed overnight.'
        }
      }
    }
  }

  // Rest spot (near the player spawn). Used to advance days.
  const restSpot = { x: 420, y: 320, radius: 80 }

  return { seed, houses, restSpot, chosenNormalForDay2 }

}