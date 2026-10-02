import { GardenView, SacredCraftLesson } from '../types/yukai';

export const GARDEN_VIEWS: GardenView[] = [
  {
    id: 0,
    title: 'Approche',
    kanji: '参道',
    subtitle: 'La longue montée',
    index: '01 / 03',
    image: '/kage-approach.webp',
    description:
      'Une volée de vingt-quatre marches de granit brut, polies par trois siècles de pèlerinage. Un gravier ratissé borde chaque côté, capturant le reflet bleuté de la brume crépusculaire.',
    quote: 'La porte n’est pas un obstacle ; c’est une question posée à quiconque s’en approche.',
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
    title: 'Lanternes',
    kanji: '灯籠',
    subtitle: 'La cour des lanternes',
    index: '02 / 03',
    image: '/kage-lantern-court.webp',
    description:
      'Des lanternes kasuga en granit disposées à six pas d’intervalle. Chaque chambre de feu est tendue de papier washi artisanal, adoucissant la braise en une sphère de chaleur ambrée face aux pins froids de la montagne.',
    quote: 'Une seule braise ne vainc pas l’obscurité ; elle lui donne des contours.',
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
    title: 'Ombre de Lune',
    kanji: '月影',
    subtitle: 'La cour d’eau',
    index: '03 / 03',
    image: '/kage-moonwater.webp',
    description:
      'Des pierres de basalte sombre immergées sous un miroir d’eau de source. Quand le vent de la vallée s’apaise, le croissant de lune vermillon flotte inversé dans la cour silencieuse.',
    quote: 'Le calme n’est pas l’absence de mouvement, mais la clarté qui l’habite.',
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
    title: 'La Porte Cachée',
    kanji: '山門',
    description: 'Pourquoi une porte est une sentence, et ce que vous acceptez en la franchissant.',
    duration: '14 min',
    image: '/temple-wall.webp',
    contemplation:
      'Franchir un seuil, c’est abandonner le rythme de la cité. Le sanmon ne se tient ni ouvert ni fermé — il se contente d’encadrer le ciel de cèdre et de vermillon, ne réclamant de vous que votre présence.',
    details: [
      'L’acoustique du portail extérieur',
      'Le sens des seuils de granit usés',
      'Laisser l’urgence à la lisière des arbres',
    ],
  },
  {
    id: 1,
    num: '02',
    title: 'Paysage Emprunté',
    kanji: '借景',
    description: 'Shakkei : composer avec une montagne qui ne vous appartiendra jamais.',
    duration: '18 min',
    image: '/hill.webp',
    contemplation:
      'Le shakkei enseigne que le jardin ne s’arrête point au mur de pierre. En cadrant la crête lointaine entre deux avant-toits de temple, la vallée entière devient une partie intégrante de votre cour.',
    details: [
      'Cadrer les silhouettes montagnardes sans clôtures',
      'La compression optique des crêtes de cèdres',
      'Accepter l’impermanence comme architecture',
    ],
  },
  {
    id: 2,
    num: '03',
    title: 'Cyprès Calciné',
    kanji: '焼杉',
    description: 'Yakisugi : noircir une planche par le feu pour que le temps la laisse vivre.',
    duration: '21 min',
    image: '/pine-tree.webp',
    contemplation:
      'Le feu forge une armure. En cloquant la surface du cèdre sous une flamme vive, le bois se libère de ses résines et s’immunise contre des siècles de pluie, de mousse humide et de givre montagnard.',
    details: [
      'Carbonisation de surface et suie tactile',
      'Nuances passant du fusain à l’ambre sombre sous la pluie',
      'La vertu japonaise de l’intégrité patinée',
    ],
  },
  {
    id: 3,
    num: '04',
    title: 'Lueur de Lanterne',
    kanji: '灯籠',
    description: 'Comment une seule braise décide de l’échelle de tout ce qui l’entoure.',
    duration: '17 min',
    image: '/stone-lantern.webp',
    contemplation:
      'Dans une vallée obscure, la lumière ne jaillit point d’en haut. Elle repose au ras du sol dans le granit sculpté, étirant de longues ombres sur le gravier et offrant à chaque pas son propre rayon de quiétude.',
    details: [
      'La géométrie des chambres de feu en papier (hibukuro)',
      'Les lentes respirations de la mèche de cire',
      'Pourquoi préserver l’obscurité pour révéler la lumière',
    ],
  },
  {
    id: 4,
    num: '05',
    title: 'La Lune Vermillon',
    kanji: '朱月',
    description: 'Pourquoi la lune rougeoie sur la vallée, et ce que le jardin en fait.',
    duration: '22 min',
    image: '/maple-leaves.webp',
    contemplation:
      'Filtrée par la brume de la vallée et la poussière des cèdres d’automne, la lune de Kyoto s’élève drapée de vermillon. Le bassin du temple capture son reflet jumeau, reliant le ciel à la terre.',
    details: [
      'Diffusion atmosphérique de la lumière sur Higashiyama',
      'Techniques de réflexion dans les cours rocheuses humides',
      'Le silence ultime du sanctuaire de montagne',
    ],
  },
];
