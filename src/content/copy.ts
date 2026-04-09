export type Locale = 'en' | 'zu' | 'xh'

export interface AppCopy {
  locale: {
    english: string
    zulu: string
    xhosa: string
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
    routeLabel: string
    routePromise: string
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
    availableMoves: string
    currentRoute: string
    hopsLabel: string
    routeReady: string
    routeLocked: (count: number) => string
    noMovesTitle: string
    noMovesBody: string
    reach: string
    here: string
    destinationSuffix: string
    currentSuffix: string
  }
  moveReveal: {
    title: string
    emptyTitle: string
    emptyBody: string
    idleBadge: string
    liveBadge: string
    evidenceLabel: string
    explanationLabel: string
    evidence: (songTitle: string, year: number) => string
    explanation: (from: string, to: string, songTitle: string, year: number) => string
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
    routeComplete: string
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

function xhosaHopUnit(count: number) {
  return count === 1 ? 'inyathelo' : 'amanyathelo'
}

const english: AppCopy = {
  locale: {
    english: 'English',
    zulu: 'isiZulu',
    xhosa: 'isiXhosa',
  },
  header: {
    tagline: 'Daily artist connection',
    dailyRoute: 'daily route',
    practiceRun: 'practice run',
    freshEveryTwoMinutes: 'fresh every 2 min',
    rules: 'How to play',
    history: 'History',
    daily: 'daily',
    practice: 'practice',
    hopsUsed: (count) => `${count} ${englishHopUnit(count)} used`,
    connectionPrompt: 'Trace the real link',
    routeLabel: "Today's route",
    routePromise: 'Every move reveals a real music connection.',
    start: 'Start',
    target: 'Target',
    languageToggle: 'Play language',
    undoLastHop: '<- undo last hop',
  },
  toasts: {
    solvedDaily:
      'This daily route is already solved on this device. You can review it below or switch to practice.',
    dailyInfo:
      "A new route drops at midnight SA time. Practice runs stay separate from today's result.",
    practiceInfo:
      "Practice keeps the rhythm going without touching today's saved route.",
    restoredHistory:
      "This result was restored from this device's saved daily history.",
    shareError:
      'Share copy was blocked in this browser session. A manual copy version is available below.',
  },
  rules: {
    title: 'How To Play',
    subtitle: 'A fair route every day',
    badge: 'Daily + practice',
    steps: [
      'Start from today\'s artist and work your way to the target.',
      'Choose only artists connected through a real credited track.',
      'Every valid move reveals the song that makes the link real.',
      'Reach the target in as few hops as you can, then compare your line with the cleanest route.',
    ],
    noteTitle: 'Why WELA works',
    noteBody:
      'The challenge is not blind guessing. The reward is understanding why two artists connect.',
  },
  grid: {
    currentArtist: 'Current artist',
    liveOptions: 'Live options',
    tapConnectedArtist: 'Choose your next connected artist',
    availableMoves: 'Available moves',
    currentRoute: 'Current route',
    hopsLabel: 'Hops',
    routeReady: 'Ready to move',
    routeLocked: (count) => `${count} ${englishHopUnit(count)} locked in`,
    noMovesTitle: 'No fresh links here',
    noMovesBody: 'Use undo to rewind and try a cleaner branch.',
    reach: 'reach',
    here: 'here',
    destinationSuffix: ' destination',
    currentSuffix: ' current position',
  },
  moveReveal: {
    title: 'Link found',
    emptyTitle: 'Next link',
    emptyBody: 'Choose a connected artist and WELA will reveal why the move is real.',
    idleBadge: 'idle',
    liveBadge: 'live',
    evidenceLabel: 'Evidence',
    explanationLabel: 'Why it works',
    evidence: (songTitle, year) => `Track: ${songTitle} (${year})`,
    explanation: (from, to, songTitle, year) =>
      `${from} and ${to} share "${songTitle}" (${year}).`,
  },
  ledger: {
    title: 'Route History',
    intro: 'This device only. No accounts, no sync, just your recent WELA routes.',
    routeCount: (count) => `${count} ${count === 1 ? 'route' : 'routes'}`,
    dailyRoutes: 'Daily routes',
    bestLines: 'Best lines',
    averageOverBest: 'Avg over best',
    recentRoutes: 'Recent routes',
    recentSubtitle: 'Latest daily routes saved on this device.',
    empty: 'Your history is empty. Finish a daily route and WELA will keep it here.',
    routeBetween: (start, end) => `${start} to ${end}`,
    hops: (count) => `${count} ${englishHopUnit(count)}`,
    optimal: (count) => `best ${count}`,
  },
  result: {
    routeComplete: 'Route complete',
    hopUnit: englishHopUnit,
    optimalMatched: 'You found the cleanest line.',
    optimalWas: (count) => `You got there. Cleanest line was ${count} ${englishHopUnit(count)}.`,
    yourPath: 'Your route story',
    optimalPath: 'Cleanest route',
    shareResult: 'Copy result',
    copiedToClipboard: 'Copied to clipboard',
    openPractice: 'Open practice',
    returnToDaily: 'Return to daily route',
    nextDaily: 'New route tomorrow at midnight SA time',
    manualShareText: 'Manual share text',
  },
  share: {
    build: (date, hops, optimal, names) =>
      [
        `WELA | ${date}`,
        `Route complete in ${hops} ${englishHopUnit(hops)}`,
        `Cleanest route: ${optimal} ${englishHopUnit(optimal)}`,
        names.join(' -> '),
      ].join('\n'),
  },
}

const zulu: AppCopy = {
  locale: {
    english: 'English',
    zulu: 'isiZulu',
    xhosa: 'isiXhosa',
  },
  header: {
    tagline: 'Uxhumano lwansuku zonke lwabaculi',
    dailyRoute: 'umzila wanamuhla',
    practiceRun: 'ukuziqeqesha',
    freshEveryTwoMinutes: 'okusha njalo ngemizuzu emi-2',
    rules: 'Indlela yokudlala',
    history: 'Umlando',
    daily: 'yanamuhla',
    practice: 'qeqesha',
    hopsUsed: (count) => `${count} ${zuluHopUnit(count)} esetshenzisiwe`,
    connectionPrompt: 'Landelela uxhumano lwangempela',
    routeLabel: 'Umzila wanamuhla',
    routePromise: 'Ukuhamba ngakunye kuveza uxhumano lwangempela lomculo.',
    start: 'Qala',
    target: 'Finyelela',
    languageToggle: 'Ulimi lomdlalo',
    undoLastHop: '<- buyisa isinyathelo sokugcina',
  },
  toasts: {
    solvedDaily:
      'Umzila wanamuhla usuqediwe kule divayisi. Ungawubuka ngezansi noma uye ekuziqeqesheni.',
    dailyInfo:
      'Umzila omusha ufika phakathi kwamabili eNingizimu Afrika. Ukuziqeqesha kuhlala kuhlukile kumphumela wanamuhla.',
    practiceInfo:
      'Ukuziqeqesha kuqhubekisa umjikelezo ngaphandle kokuthinta umzila wanamuhla ogciniwe.',
    restoredHistory:
      'Lo mphumela ubuyiswe emlandweni ogciniwe wale divayisi.',
    shareError:
      'Ukukopisha kuvinjiwe kule browser. Umbhalo wokwabelana usezansi.',
  },
  rules: {
    title: 'Indlela Yokudlala',
    subtitle: 'Umzila olungile nsuku zonke',
    badge: 'Yanamuhla + qeqesha',
    steps: [
      'Qala ngomculi wanamuhla bese uya kumculi wokugcina.',
      'Khetha kuphela abaculi abaxhumene ngengoma enegama labo ngokusemthethweni.',
      'Ukuhamba ngakunye okuvumelekile kuveza ingoma eyenza uxhumano lube yiqiniso.',
      'Finyelela ekugcineni ngezinyathelo ezimbalwa, bese uqathanisa umzila wakho nowona ohlanzeke kakhulu.',
    ],
    noteTitle: 'Kungani iWELA isebenza',
    noteBody:
      'Inselelo ayisona ukuqagela okungaboni. Umvuzo ukuqonda ukuthi kungani laba baculi bexhumene.',
  },
  grid: {
    currentArtist: 'Umculi okhona',
    liveOptions: 'Izinketho ezivuliwe',
    tapConnectedArtist: 'Khetha umculi wakho olandelayo oxhunyiwe',
    availableMoves: 'Ukuhamba okutholakalayo',
    currentRoute: 'Umzila okhona',
    hopsLabel: 'Izinyathelo',
    routeReady: 'Usukulungele ukuhamba',
    routeLocked: (count) => `${count} ${zuluHopUnit(count)} zivaliwe`,
    noMovesTitle: 'Azikho izixhumanisi ezintsha lapha',
    noMovesBody: 'Sebenzisa ukubuyisa ukuze ubuyele emuva uzame olunye uhlangothi.',
    reach: 'fika',
    here: 'lapha',
    destinationSuffix: ' indawo yokufika',
    currentSuffix: ' indawo okuyo',
  },
  moveReveal: {
    title: 'Uxhumano lutholiwe',
    emptyTitle: 'Uxhumano olulandelayo',
    emptyBody: 'Khetha umculi oxhunyiwe bese iWELA ikukhombisa ukuthi kungani lokho kuyiqiniso.',
    idleBadge: 'lindile',
    liveBadge: 'bukhoma',
    evidenceLabel: 'Ubufakazi',
    explanationLabel: 'Kungani kusebenza',
    evidence: (songTitle, year) => `Ingoma: ${songTitle} (${year})`,
    explanation: (from, to, songTitle, year) =>
      `${from} no${to} bahlangana engomeni ethi "${songTitle}" (${year}).`,
  },
  ledger: {
    title: 'Umlando Womzila',
    intro: 'Kule divayisi kuphela. Ayikho i-akhawunti noma ukuvumelanisa, kukhona imizila yakho yakamuva kuphela.',
    routeCount: (count) => `${count} imizila`,
    dailyRoutes: 'Imizila yansuku zonke',
    bestLines: 'Imizila emihle kakhulu',
    averageOverBest: 'Isilinganiso ngaphezu kokuhle',
    recentRoutes: 'Imizila yakamuva',
    recentSubtitle: 'Imizila yakamuva yanamuhla egciniwe kule divayisi.',
    empty: 'Umlando wakho awunalutho okwamanje. Qeda umzila wanamuhla bese uWELA uyawugcina lapha.',
    routeBetween: (start, end) => `${start} kuya ku-${end}`,
    hops: (count) => `${count} ${zuluHopUnit(count)}`,
    optimal: (count) => `okuhle ${count}`,
  },
  result: {
    routeComplete: 'Umzila uqediwe',
    hopUnit: zuluHopUnit,
    optimalMatched: 'Uthole umzila ohlanzeke kakhulu.',
    optimalWas: (count) => `Ufike lapho. Umzila ohlanzeke kakhulu ubungu-${count} ${zuluHopUnit(count)}.`,
    yourPath: 'Indaba yomzila wakho',
    optimalPath: 'Umzila ohlanzeke kakhulu',
    shareResult: 'Kopisha umphumela',
    copiedToClipboard: 'Sekukopishiwe',
    openPractice: 'Vula ukuziqeqesha',
    returnToDaily: 'Buyela kumzila wanamuhla',
    nextDaily: 'Umzila omusha kusasa phakathi kwamabili eNingizimu Afrika',
    manualShareText: 'Umbhalo wokwabelana',
  },
  share: {
    build: (date, hops, optimal, names) =>
      [
        `WELA | ${date}`,
        `Umzila uqedwe ngo-${hops} ${zuluHopUnit(hops)}`,
        `Umzila ohlanzeke kakhulu: ${optimal} ${zuluHopUnit(optimal)}`,
        names.join(' -> '),
      ].join('\n'),
  },
}

const xhosa: AppCopy = {
  locale: {
    english: 'English',
    zulu: 'isiZulu',
    xhosa: 'isiXhosa',
  },
  header: {
    tagline: 'Unxibelelwano lwamagcisa lwemihla ngemihla',
    dailyRoute: 'indlela yanamhlanje',
    practiceRun: 'ukuziqhelanisa',
    freshEveryTwoMinutes: 'entsha rhoqo ngemizuzu emi-2',
    rules: 'Indlela yokudlala',
    history: 'Imbali',
    daily: 'yanamhlanje',
    practice: 'ziqhelanise',
    hopsUsed: (count) => `${count} ${xhosaHopUnit(count)} asetyenzisiweyo`,
    connectionPrompt: 'Landela ikhonkco lokwenene',
    routeLabel: 'Indlela yanamhlanje',
    routePromise: 'Inyathelo ngalinye libonisa unxibelelwano lokwenene lomculo.',
    start: 'Qala',
    target: 'Fikelela',
    languageToggle: 'Ulwimi lomdlalo',
    undoLastHop: '<- buyisa inyathelo lokugqibela',
  },
  toasts: {
    solvedDaily:
      'Le ndlela yanamhlanje sele igqityiwe kule sixhobo. Ungayijonga ngezantsi okanye uye ekuziqhelaniseni.',
    dailyInfo:
      'Indlela entsha ifika ezinzulwini zobusuku ngexesha laseMzantsi Afrika. Ukuziqhelanisa kuhlala kwahlukile kwisiphumo sanamhlanje.',
    practiceInfo:
      'Ukuziqhelanisa kugcina umjikelo uqhubeka ngaphandle kokuchukumisa indlela yanamhlanje egciniweyo.',
    restoredHistory:
      'Esi siphumo sibuyiselwe kwimbali egciniweyo yale sixhobo.',
    shareError:
      'Ukukopa kuvaliwe kule browser. Kukho umbhalo wokwabelana ngezantsi.',
  },
  rules: {
    title: 'Indlela Yokudlala',
    subtitle: 'Indlela efanelekileyo yonke imihla',
    badge: 'Yonke imihla + ziqhelanise',
    steps: [
      'Qala ngegcisa lanamhlanje uze uye kwelijoliswe kulo.',
      'Khetha kuphela amagcisa axhunyaniswe ngengoma enegama lawo ngokusemthethweni.',
      'Inyathelo ngalinye elisemthethweni libonisa ingoma eyenza ikhonkco libe yinyani.',
      'Fikelela ekujoliswe kuko ngamanyathelo ambalwa uze uthelekise indlela yakho neyona icocekileyo.',
    ],
    noteTitle: 'Kutheni iWELA isebenza',
    noteBody:
      'Umceli mngeni awusiyo ukuqikelela okungaboniyo. Umvuzo kukuqonda ukuba kutheni la magcisa enxibelelana.',
  },
  grid: {
    currentArtist: 'Igcisa langoku',
    liveOptions: 'Iinketho ezivuliweyo',
    tapConnectedArtist: 'Khetha igcisa lakho elilandelayo elinxulumeneyo',
    availableMoves: 'Amanyathelo avuliweyo',
    currentRoute: 'Indlela yangoku',
    hopsLabel: 'Amanyathelo',
    routeReady: 'Ulungele ukuhamba',
    routeLocked: (count) => `${count} ${xhosaHopUnit(count)} avaliwe`,
    noMovesTitle: 'Akukho makhonkco amatsha apha',
    noMovesBody: 'Sebenzisa ukubuyisa ukuze ubuyele emva uzame elinye icala.',
    reach: 'fika',
    here: 'apha',
    destinationSuffix: ' indawo ekujoliswe kuyo',
    currentSuffix: ' indawo okuyo ngoku',
  },
  moveReveal: {
    title: 'Ikhonkco lifunyenwe',
    emptyTitle: 'Ikhonkco elilandelayo',
    emptyBody: 'Khetha igcisa elinxulumeneyo, iWELA ibonise ukuba kutheni elo nyathelo liyinyani.',
    idleBadge: 'lindile',
    liveBadge: 'ivuliwe',
    evidenceLabel: 'Ubungqina',
    explanationLabel: 'Kutheni kusebenza',
    evidence: (songTitle, year) => `Ingoma: ${songTitle} (${year})`,
    explanation: (from, to, songTitle, year) =>
      `${from} no${to} badibana kwingoma ethi "${songTitle}" (${year}).`,
  },
  ledger: {
    title: 'Imbali Yendlela',
    intro: 'Kwesi sixhobo kuphela. Akukho akhawunti, akukho kuhlanganiswa, kukho iindlela zakho zamva nje kuphela.',
    routeCount: (count) => `${count} iindlela`,
    dailyRoutes: 'Iindlela zemihla ngemihla',
    bestLines: 'Ezona ndlela zintle',
    averageOverBest: 'Umndilili ngaphezu kokona kulungileyo',
    recentRoutes: 'Iindlela zamva nje',
    recentSubtitle: 'Iindlela zamva nje ezigcinwe kule sixhobo.',
    empty: 'Imbali yakho isekhoingenanto okwangoku. Gqiba indlela yanamhlanje, iWELA iyigcine apha.',
    routeBetween: (start, end) => `${start} ukuya ku-${end}`,
    hops: (count) => `${count} ${xhosaHopUnit(count)}`,
    optimal: (count) => `eyona ${count}`,
  },
  result: {
    routeComplete: 'Indlela igqityiwe',
    hopUnit: xhosaHopUnit,
    optimalMatched: 'Ufumanise owona mgca ucocekileyo.',
    optimalWas: (count) => `Ufike apho. Owona mgca ucocekileyo ubungu-${count} ${xhosaHopUnit(count)}.`,
    yourPath: 'Ibali lendlela yakho',
    optimalPath: 'Eyona ndlela icocekileyo',
    shareResult: 'Kopa isiphumo',
    copiedToClipboard: 'Ikopiwe',
    openPractice: 'Vula ukuziqhelanisa',
    returnToDaily: 'Buyela kwindlela yanamhlanje',
    nextDaily: 'Indlela entsha ngomso ezinzulwini zobusuku ngexesha laseMzantsi Afrika',
    manualShareText: 'Umbhalo wokwabelana',
  },
  share: {
    build: (date, hops, optimal, names) =>
      [
        `WELA | ${date}`,
        `Indlela igqitywe ngo-${hops} ${xhosaHopUnit(hops)}`,
        `Eyona ndlela icocekileyo: ${optimal} ${xhosaHopUnit(optimal)}`,
        names.join(' -> '),
      ].join('\n'),
  },
}

export function getCopy(locale: Locale): AppCopy {
  if (locale === 'zu') return zulu
  if (locale === 'xh') return xhosa
  return english
}
