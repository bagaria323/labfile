import { Chapter, MemoryNote } from './types';

export const CHAPTERS: Chapter[] = [
  {
    id: 'varun',
    number: 1,
    title: 'Varun',
    role: 'Big Brother & Loving Senior',
    description: 'The most loving senior who always helps everyone in the department. He is like a protective and caring big brother to the entire lab family.',
    colorTheme: 'blue',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgGradient: 'from-blue-950/40 to-slate-900/40',
    imagesCount: 7,
    defaultFooter: 'Write a memory, an inside joke, or something Varun will never forget...'
  },
  {
    id: 'aditi',
    number: 2,
    title: 'Aditi',
    role: 'Kind Soul & Good Friend',
    description: 'Short in height but immense in heart! Aditi mam is an incredibly good person and a wonderful close friend of Tahiba Mam, bringing warmth to everyone around her.',
    colorTheme: 'rose',
    accentColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgGradient: 'from-rose-950/40 to-slate-900/40',
    imagesCount: 7,
    defaultFooter: 'Write a memory, an inside joke, or something Aditi will never forget...'
  },
  {
    id: 'ayushi',
    number: 3,
    title: 'Ayushi Mam',
    role: 'Sweetest Conversationalist',
    description: 'The absolute sweetest person to talk to in the entire department. We still miss the rare and legendary episode when she once got angry!',
    colorTheme: 'teal',
    accentColor: 'text-teal-400',
    borderColor: 'border-teal-500/30',
    bgGradient: 'from-teal-950/40 to-slate-900/40',
    imagesCount: 7,
    defaultFooter: 'Write a memory, an inside joke, or something Ayushi Mam will never forget...'
  },
  {
    id: 'isha',
    number: 4,
    title: 'Isha',
    role: 'The Deep Thinker',
    description: 'This girl has a literal lag in her system—she will think 100 times about a single thing before making a decision!',
    colorTheme: 'purple',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgGradient: 'from-purple-950/40 to-slate-900/40',
    imagesCount: 7,
    defaultFooter: 'Write a memory, an inside joke, or something Isha will never forget...'
  },
  {
    id: 'rimzim',
    number: 5,
    title: 'Rimzim',
    role: 'Dance Choreographer & Minty Jamun Fan',
    description: 'The energetic soul who always makes us dance on "Shararat" and holds an absolute, unmatched love for Minty Jamun.',
    colorTheme: 'orange',
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    bgGradient: 'from-orange-950/40 to-slate-900/40',
    imagesCount: 7,
    defaultFooter: 'Write a memory, an inside joke, or something Rimzim will never forget...'
  },
  {
    id: 'harshit',
    number: 6,
    title: 'Harshit',
    role: 'The Lion of the Lab',
    description: 'The legendary Lion of the Lab! A really nice guy, a good boy, and a supportive friend who keeps everyone smiling.',
    colorTheme: 'amber',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgGradient: 'from-amber-950/40 to-slate-900/40',
    imagesCount: 7,
    defaultFooter: 'Write a memory, an inside joke, or something Harshit will never forget...'
  },
  {
    id: 'mrigank',
    number: 7,
    title: 'Mrigank Garg',
    role: 'Feminism Supporter & Roti Expert',
    description: 'An outstandingly good guy whose last name is Garg. He proudly supports feminism by making perfect rotis for everyone!',
    colorTheme: 'emerald',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgGradient: 'from-emerald-950/40 to-slate-900/40',
    imagesCount: 7,
    defaultFooter: 'Write a memory, an inside joke, or something Mrigank Garg will never forget...'
  },
  {
    id: 'together',
    number: 8,
    title: 'Lab — Together',
    role: 'The Family',
    description: 'The sum of all parts. The late-night gossips, the dancing, the rotis, the sharing of snacks, and the lifelong bonds built in our department.',
    colorTheme: 'indigo',
    accentColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    bgGradient: 'from-indigo-950/40 to-slate-900/40',
    imagesCount: 9,
    defaultFooter: 'The lab as a whole — the jokes, the warm gossip sessions, shared food, and Lanka tea rounds...'
  }
];

export const DEFAULT_MEMORIES: MemoryNote[] = [
  // Varun
  {
    id: 'v1',
    chapterId: 'varun',
    author: 'Harshit',
    text: 'Remember when we waited for hours in the lab just so we could grab dinner together at Lanka? Classic big brother moves!',
    createdAt: '2025-05-12',
    color: 'yellow',
    rotation: -2
  },
  {
    id: 'v2',
    chapterId: 'varun',
    author: 'Aditi',
    text: 'Your patience while explaining everything for the 10th time to us was legendary. Thank you, Varun, the best senior!',
    createdAt: '2025-05-20',
    color: 'blue',
    rotation: 1
  },
  // Aditi
  {
    id: 'ad1',
    chapterId: 'aditi',
    author: 'Ayushi',
    text: 'Our endless gossips and fun talks. Literally the only reason I survived those long waiting hours! Such a nice soul.',
    createdAt: '2025-05-14',
    color: 'pink',
    rotation: 3
  },
  {
    id: 'ad2',
    chapterId: 'aditi',
    author: 'Varun',
    text: 'The best friend of Tahiba Mam and the ultimate mood-setter of our department! We will miss your smiles.',
    createdAt: '2025-05-25',
    color: 'purple',
    rotation: -1
  },
  // Ayushi
  {
    id: 'ay1',
    chapterId: 'ayushi',
    author: 'Rimzim',
    text: 'The absolute sweetest person to talk to! You always listen with so much warmth while casually sipping lemon tea.',
    createdAt: '2025-05-15',
    color: 'green',
    rotation: -2
  },
  {
    id: 'ay2',
    chapterId: 'ayushi',
    author: 'Mrigank',
    text: 'Thank you for always listening to my endless talks with so much patience and giving the best advice! I still wonder how you get angry though!',
    createdAt: '2025-06-02',
    color: 'yellow',
    rotation: 2
  },
  // Isha
  {
    id: 'is1',
    chapterId: 'isha',
    author: 'Aditi',
    text: 'The master of thinking 100 times before doing a single thing! That system lag is legendary and adorable.',
    createdAt: '2025-05-18',
    color: 'blue',
    rotation: -3
  },
  {
    id: 'is2',
    chapterId: 'isha',
    author: 'Harshit',
    text: 'Your positive vibes are contagious, Isha! Even if you think 100 times, we love how warm and caring you always are.',
    createdAt: '2025-06-05',
    color: 'orange',
    rotation: 1
  },
  // Rimzim
  {
    id: 'r1',
    chapterId: 'rimzim',
    author: 'Isha',
    text: 'Dancing to "Shararat" with you made our days so much brighter! Your energetic dance sessions are a work of art.',
    createdAt: '2025-05-22',
    color: 'pink',
    rotation: 2
  },
  {
    id: 'r2',
    chapterId: 'rimzim',
    author: 'Varun',
    text: 'Who is going to bring Minty Jamun and make everyone dance now? You are the true energy champion!',
    createdAt: '2025-06-08',
    color: 'green',
    rotation: -1
  },
  // Harshit
  {
    id: 'h1',
    chapterId: 'harshit',
    author: 'Mrigank',
    text: 'The actual Lion of the Lab! Always protective, incredibly nice, and such a good boy to hang out with.',
    createdAt: '2025-05-28',
    color: 'orange',
    rotation: -2
  },
  {
    id: 'h2',
    chapterId: 'harshit',
    author: 'Ayushi',
    text: 'Harshit, thank you for being the designated driver for our midnight food rides and compiling all these beautiful pictures!',
    createdAt: '2025-06-12',
    color: 'purple',
    rotation: 3
  },
  // Mrigank
  {
    id: 'm1',
    chapterId: 'mrigank',
    author: 'Varun',
    text: 'Mrigank Garg, the ultimate feminism supporter who literally makes the roundest and best rotis for us!',
    createdAt: '2025-05-30',
    color: 'yellow',
    rotation: 1
  },
  {
    id: 'm2',
    chapterId: 'mrigank',
    author: 'Rimzim',
    text: 'An incredibly supportive guy and a wonderful friend. Thank you for always being there, Mrigank!',
    createdAt: '2025-06-15',
    color: 'blue',
    rotation: -2
  },
  // Together
  {
    id: 't1',
    chapterId: 'together',
    author: 'All Interns',
    text: 'For every morning we started with tea, every afternoon we spent gossiping, every evening we shared stories, and every night we laughed. This is our department family!',
    createdAt: '2025-06-20',
    color: 'pink',
    rotation: -1
  },
  {
    id: 't2',
    chapterId: 'together',
    author: 'Department Staff',
    text: 'Wishing this brilliant batch the absolute best for their future! You made the department alive with pure joy and laughter.',
    createdAt: '2025-06-25',
    color: 'orange',
    rotation: 2
  }
];

export const NOSTALGIC_QUOTES = [
  "“For every late night, every shared lunch, every cup of chai, every laugh — this is for us.”",
  "“What is not written is forgotten.”",
  "“Lanka corner chai sessions and long gossips are what truly warmed our days.”",
  "“Finding order in chaotic days, and finding a lifelong family in our team.”",
  "“From Lanka corner chai to Assi Ghat sunrises, we built memories that will last a lifetime.”",
  "“May your days be filled with happiness, warmth, and the perfect cup of tea!”",
  "“Every inside joke and late-night talk taught us that we are stronger together.”"
];
