export type Locale = 'en' | 'zu'

export interface AppCopy {
  locale: {
    english: string
    zulu: string
  }
  header: {
    tagline: string
    dailyRoute: string
    practiceRun: string
    freshEveryTwoMinutes: string
    rules: string
    history: string
    daily: string
    practice: string
    hopsUsed: (count: number) => string
    connectionPrompt: string
    start: string
    target: string
    languageToggle: string
    undoLastHop: string
  }
  toasts: {
    solvedDaily: string
    dailyInfo: string
    practiceInfo: string
    restoredHistory: string
    shareError: string
  }
  rules: {
    title: string
    subtitle: string
    badge: string
    steps: string[]
    noteTitle: string
    noteBody: string
  }
  grid: {
    currentArtist: string
    liveOptions: string
    tapConnectedArtist: string
    reach: string
    here: string
    destinationSuffix: string
    currentSuffix: string
  }
  ledger: {
    title: string
    intro: string
    routeCount: (count: number) => string
    dailyRoutes: string
    bestLines: string
    averageOverBest: string
    recentRoutes: string
    recentSubtitle: string
    empty: string
    routeBetween: (start: string, end: string) => string
    hops: (count: number) => string
    optimal: (count: number) => string
  }
  result: {
    hopUnit: (count: number) => string
    optimalMatched: string
    optimalWas: (count: number) => string
    yourPath: string
    optimalPath: string
    shareResult: string
    copiedToClipboard: string
    openPractice: string
    returnToDaily: string
    nextDaily: string
    manualShareText: string
  }
  share: {
    build: (date: string, hops: number, optimal: number, names: string[]) => string
  }
}

function englishHopUnit(count: number) {
  return count === 1 ? 'hop' : 'hops'
}

function zuluHopUnit(count: number) {
  return count === 1 ? 'isinyathelo' : 'izinyathelo'
}

const english: AppCopy = {
  locale: {
    english: 'English',
    zulu: 'isiZulu',
  },
  header: {
    tagline: 'Find the route through Amapiano collaborations',
    dailyRoute: 'daily route',
    practiceRun: 'practice run',
    freshEveryTwoMinutes: 'fresh every 2 min',
    rules: 'How to play',
    history: 'History',
    daily: 'daily',
    practice: 'practice',
    hopsUsed: (count) => `${count} ${englishHopUnit(count)} used`,
    connectionPrompt: 'Move through shared songs',
    start: 'Start',
    target: 'Target',
    languageToggle: 'Play language',
    undoLastHop: '<- undo last hop',
  },
  toasts: {
    solvedDaily:
      "This daily route is already solved on this device. You can review it below or switch to practice.",
    dailyInfo:
      'Everyone gets the same new route at midnight SA time. Practice stays separate from your daily result.',
    practiceInfo:
      "Practice gives you fresh routes and never overwrites today's saved result.",
    restoredHistory:
      "This result was restored from this device's saved daily history.",
    shareError:
      'Share copy was blocked in this browser session. A manual copy version is available below.',
  },
  rules: {
    title: 'How To Play',
    subtitle: 'WELA in four moves',
    badge: 'Daily + practice',
    steps: [
      'Every daily route uses the South Africa date, so everyone gets the same start and target artists.',
      'Tap only artists linked to your current artist through a shared song.',
      'Each move adds one hop to your route. Fewer hops means a cleaner line.',
      'Finish the daily route, compare it with the best route, then use practice for fresh runs.',
    ],
    noteTitle: 'Product note',
    noteBody:
      'WELA works best when it feels like crate-digging, not clout-chasing. The challenge is reading collaboration patterns, not farming points.',
  },
  grid: {
    currentArtist: 'Current artist',
    liveOptions: 'Open links',
    tapConnectedArtist: 'Tap a connected artist',
    reach: 'reach',
    here: 'here',
    destinationSuffix: ' destination',
    currentSuffix: ' current position',
  },
  ledger: {
    title: 'Route History',
    intro: 'This device only. No accounts, no sync, just your recent WELA routes.',
    routeCount: (count) => `${count} ${count === 1 ? 'route' : 'routes'}`,
    dailyRoutes: 'Daily routes',
    bestLines: 'Best lines',
    averageOverBest: 'Avg over best',
    recentRoutes: 'Recent routes',
    recentSubtitle: "Latest daily routes saved on this device.",
    empty: 'Your history is empty. Finish a daily route and WELA will keep it here.',
    routeBetween: (start, end) => `${start} to ${end}`,
    hops: (count) => `${count} ${englishHopUnit(count)}`,
    optimal: (count) => `best ${count}`,
  },
  result: {
    hopUnit: englishHopUnit,
    optimalMatched: 'You matched the shortest route.',
    optimalWas: (count) => `Best route was ${count} ${englishHopUnit(count)}`,
    shareResult: 'Copy result',
    copiedToClipboard: 'Copied to clipboard',
    yourPath: 'Your path',
    optimalPath: 'Best path',
    openPractice: 'Open practice',
    returnToDaily: 'Return to daily route',
    nextDaily: 'New route tomorrow at midnight SA time',
    manualShareText: 'Manual share text',
  },
  share: {
    build: (date, hops, optimal, names) =>
      [
        `WELA | ${date}`,
        `${hops} ${englishHopUnit(hops)}`,
        `Best possible: ${optimal} ${englishHopUnit(optimal)}`,
        names.join(' -> '),
      ].join('\n'),
  },
}

const zulu: AppCopy = {
  locale: {
    english: 'English',
    zulu: 'isiZulu',
  },
  header: {
    tagline: 'Thola indlela phakathi kwabaculi be-Amapiano',
    dailyRoute: 'umzila wanamuhla',
    practiceRun: 'ukuziqeqesha',
    freshEveryTwoMinutes: 'okusha njalo ngemizuzu emi-2',
    rules: 'Indlela yokudlala',
    history: 'Umlando',
    daily: 'yanamuhla',
    practice: 'qeqesha',
    hopsUsed: (count) => `${count} ${zuluHopUnit(count)}`,
    connectionPrompt: 'Hamba ngezingoma ezabiwe',
    start: 'Qala',
    target: 'Finyelela',
    languageToggle: 'Ulimi lomdlalo',
    undoLastHop: '<- buyisa isinyathelo sokugcina',
  },
  toasts: {
    solvedDaily:
      'Umzila wanamuhla usuqediwe kule divayisi. Ungawubuka ngezansi noma uye ekuziqeqesheni.',
    dailyInfo:
      'Wonke umuntu uthola umzila omusha phakathi kwamabili eNingizimu Afrika. Ukuziqeqesha kuhlala kuhlukile kumphumela wanamuhla.',
    practiceInfo:
      'Ukuziqeqesha kukunika imizila emisha futhi akubhali phezu komphumela wanamuhla.',
    restoredHistory:
      'Lo mphumela ubuyiswe emlandweni ogciniwe wale divayisi.',
    shareError:
      'Ukukopisha kuvinjiwe kule browser. Umbhalo wokwabelana usezansi.',
  },
  rules: {
    title: 'Indlela Yokudlala',
    subtitle: 'WELA ngezinyathelo ezine',
    badge: 'Yanamuhla + qeqesha',
    steps: [
      'Umzila wanamuhla usebenzisa usuku lwaseNingizimu Afrika, ngakho wonke umuntu uthola abaculi abafanayo bokuqala nabokugcina.',
      'Cofa kuphela umculi oxhumene nomculi okhona ngengoma eyabiwe.',
      'Ukuhamba ngakunye kwengeza isinyathelo. Izinyathelo ezimbalwa zenza umzila uhlanzeke.',
      'Qeda umzila wanamuhla, uwuqhathanise nomzila omfushane, bese usebenzisa ukuziqeqesha ngemizila emisha.',
    ],
    noteTitle: 'Inothi lomkhiqizo',
    noteBody:
      'WELA iba ngcono uma izwakala njengokucubungula ikhreyithi, hhayi ukujaha udumo. Inselelo ikusekuboneni amaphethini okubambisana, hhayi ekuqoqeni amaphuzu.',
  },
  grid: {
    currentArtist: 'Umculi okhona',
    liveOptions: 'Izixhumanisi',
    tapConnectedArtist: 'Cofa umculi oxhunyiwe',
    reach: 'fika',
    here: 'lapha',
    destinationSuffix: ' indawo yokufika',
    currentSuffix: ' indawo okuyo',
  },
  ledger: {
    title: 'Umlando Womzila',
    intro: 'Kule divayisi kuphela. Ayikho i-akhawunti noma ukuvumelanisa, kukhona imizila yakho yakamuva kuphela.',
    routeCount: (count) => `${count} imizila`,
    dailyRoutes: 'Imizila yansuku zonke',
    bestLines: 'Imizila emifushane',
    averageOverBest: 'Isilinganiso ngaphezu komfushane',
    recentRoutes: 'Imizila yakamuva',
    recentSubtitle: 'Imizila yakamuva yanamuhla egciniwe kule divayisi.',
    empty: 'Umlando wakho awunalutho okwamanje. Qeda umzila wanamuhla bese uWELA uyawugcina lapha.',
    routeBetween: (start, end) => `${start} kuya ku-${end}`,
    hops: (count) => `${count} ${zuluHopUnit(count)}`,
    optimal: (count) => `omfushane ${count}`,
  },
  result: {
    hopUnit: zuluHopUnit,
    optimalMatched: 'Uhambe ngomzila omfushane.',
    optimalWas: (count) => `Umzila omfushane ubungu-${count} ${zuluHopUnit(count)}`,
    shareResult: 'Kopisha umphumela',
    copiedToClipboard: 'Sekukopishiwe',
    yourPath: 'Umzila wakho',
    optimalPath: 'Umzila omfushane',
    openPractice: 'Vula ukuziqeqesha',
    returnToDaily: 'Buyela kumzila wanamuhla',
    nextDaily: 'Umzila omusha kusasa phakathi kwamabili eNingizimu Afrika',
    manualShareText: 'Umbhalo wokwabelana',
  },
  share: {
    build: (date, hops, optimal, names) =>
      [
        `WELA | ${date}`,
        `${hops} ${zuluHopUnit(hops)}`,
        `Okungcono kakhulu: ${optimal} ${zuluHopUnit(optimal)}`,
        names.join(' -> '),
      ].join('\n'),
  },
}

export function getCopy(locale: Locale): AppCopy {
  return locale === 'zu' ? zulu : english
}
