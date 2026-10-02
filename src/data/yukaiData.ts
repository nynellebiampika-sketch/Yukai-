import { GardenView, SacredCraftLesson } from '../types/yukai';

export const GARDEN_VIEWS: GardenView[] = [
  {
    id: 0,
    title: 'Approach',
    kanji: '参道',
    subtitle: 'The long climb',
    index: '01 / 03',
    image: '/kage-approach.webp',
    description:
      'A flight of twenty-four irregular granite treads worn smooth by three centuries of pilgrimage. Raked gravel cushions each side, catching the blue reflection of the twilight mist.',
    quote: 'The gate is not an obstacle; it is a question asked of whoever approaches.',
    glowProps: {
      gx: '80.2%',
      gy: '23.9%',
      gr: '22px',
      gt: '6.1s',
      gt2: '9.7s',
      gc1: 'rgba(255,142,108,.50)',
      gc2: 'rgba(212,56,38,.24)',
    },
  },
  {
    id: 1,
    title: 'Lanterns',
    kanji: '灯籠',
    subtitle: 'Lantern court',
    index: '02 / 03',
    image: '/kage-lantern-court.webp',
    description:
      'Granite kasuga lanterns stationed six strides apart. Each fire box is lined with handmade washi paper, softening the ember into a sphere of amber warmth against the cold mountain pine.',
    quote: 'A single ember does not conquer the darkness; it gives it boundaries.',
    glowProps: {
      gx: '70.5%',
      gy: '47.2%',
      gr: '14px',
      gt: '3.7s',
      gt2: '5.3s',
      gc1: 'rgba(255,198,124,.62)',
      gc2: 'rgba(226,118,40,.30)',
      flame: true,
    },
  },
  {
    id: 2,
    title: 'Moonwater',
    kanji: '月影',
    subtitle: 'The wet court',
    index: '03 / 03',
    image: '/kage-moonwater.webp',
    description:
      'Dark basalt stones submerged under a mirror sheet of spring runoff. When the valley wind falls quiet, the red crescent moon floats inverted in the shallow court.',
    quote: 'Stillness is not the absence of motion, but clarity within it.',
    glowProps: {
      gx: '48.0%',
      gy: '16.8%',
      gr: '20px',
      gt: '7.3s',
      gt2: '11.2s',
      gc1: 'rgba(255,138,104,.52)',
      gc2: 'rgba(208,54,36,.24)',
    },
  },
];

export const SACRED_CRAFT_LESSONS: SacredCraftLesson[] = [
  {
    id: 0,
    num: '01',
    title: 'The Hidden Gate',
    kanji: '山門',
    description: 'Why a gate is a sentence, and what you agree to when you walk under one.',
    duration: '14 min',
    image: '/temple-wall.webp',
    contemplation:
      'To cross a threshold is to leave behind the rhythm of the city. The sanmon stands neither open nor closed—it simply frames the sky in cedar and vermilion, asking nothing of you except presence.',
    details: [
      'The acoustics of the outer portal',
      'The meaning of worn granite thresholds',
      'Leaving urgency at the tree line',
    ],
  },
  {
    id: 1,
    num: '02',
    title: 'Borrowed Scenery',
    kanji: '借景',
    description: 'Shakkei: composing with a mountain you will never own.',
    duration: '18 min',
    image: '/hill.webp',
    contemplation:
      'Shakkei teaches that the garden does not end at the stone wall. By framing the distant ridgeline between two temple eaves, the entire valley becomes part of your courtyard.',
    details: [
      'Framing mountain silhouettes without fences',
      'The optical compression of cedar ridges',
      'Accepting impermanence as architecture',
    ],
  },
  {
    id: 2,
    num: '03',
    title: 'Charred Cypress',
    kanji: '焼杉',
    description: 'Yakisugi: burning a board black so the weather will let it live.',
    duration: '21 min',
    image: '/pine-tree.webp',
    contemplation:
      'Fire creates armor. By blistering the surface of cedar with intense flame, the wood is purified of resins and sealed against centuries of rain, damp moss, and mountain frost.',
    details: [
      'Surface carbonization and tactile soot',
      'Color shifts from charcoal to dark amber under rain',
      'The Japanese virtue of weathered integrity',
    ],
  },
  {
    id: 3,
    num: '04',
    title: 'Lantern Light',
    kanji: '灯籠',
    description: 'How a single ember decides the scale of everything around it.',
    duration: '17 min',
    image: '/stone-lantern.webp',
    contemplation:
      'In a dark valley, light is not flooded from above. It sits low in carved granite, throwing long shadows across raked gravel and giving each step its own quiet radius.',
    details: [
      'The geometry of paper fire-boxes (hibukuro)',
      'Subtle breathing fluctuations of the candle wick',
      'Why darkness must be preserved to see light',
    ],
  },
  {
    id: 4,
    num: '05',
    title: 'The Vermilion Moon',
    kanji: '朱月',
    description: 'Why the moon burns red over the valley, and what the garden does with it.',
    duration: '22 min',
    image: '/maple-leaves.webp',
    contemplation:
      'Filtered through valley humidity and autumn cedar dust, the Kyoto moon rises steeped in vermilion. The temple pond captures its twin, completing the circle between sky and earth.',
    details: [
      'Atmospheric light scattering over Higashiyama',
      'Mirror reflection techniques in damp rock courts',
      'The final silence of the mountain sanctuary',
    ],
  },
];
