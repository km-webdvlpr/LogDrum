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
  guide: {
    title: string
    subtitle: string
    goalTitle: string
    goalBody: string
    logicTitle: string
    logicBody: string
    pathTitle: string
    pathBody: string
    moveTitle: string
    moveBody: string
    costTitle: string
    costBody: string
    scoreTitle: string
    scoreBody: string
    winTitle: string
    winBody: string
    futureTitle: string
    futureBody: string
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
  cabinet: {
    ready: string
    active: string
    solved: string
    failed: string
    challengePanel: string
    routePanel: string
    inputPanel: string
    cluesPanel: string
    howPanel: string
    footerInsertCoin: string
    footerDaily: string
    savedState: string
  }
  ticker: {
    today: (date: string) => string
    difficulty: (label: string) => string
    par: (value: number) => string
    timer: (minutes: number) => string
    scoreBase: string
  }
  input: {
    title: string
    subtitle: string
    placeholder: string
    submit: string
    currentArtist: string
    targetArtist: string
    hint: string
  }
  clues: {
    title: string
    subtitle: string
    reveal: string
    free: string
    open: string
    locked: string
    cost: (value: number) => string
  }
  status: {
    score: string
    timer: string
    lives: string
    steps: string
    par: string
    difficulty: string
    groove: string
    amapiano: string
    deepCuts: string
    liveScore: string
    finalScore: string
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
    sessionSolved: string
    sessionFailed: string
    finalScoreLabel: string
    timeMultiplierLabel: string
    cluePenaltyLabel: string
    lifePenaltyLabel: string
    pureRunLabel: string
    parBonusLabel: string
    replay: string
    canonicalPath: string
    failByLives: string
    failByTimer: string
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
    tagline: 'Daily music knowledge arcade',
    dailyRoute: 'daily route',
    practiceRun: 'practice run',
    freshEveryTwoMinutes: 'fresh every 2 min',
    rules: 'How to play',
    history: 'History',
    daily: 'daily',
    practice: 'practice',
    hopsUsed: (count) => `${count} ${englishHopUnit(count)} used`,
    connectionPrompt: 'Knowledge vs confidence. Lock the cleanest route before the machine closes.',
    routeLabel: "Today's route",
    routePromise: 'Every move must be real, documented, and worth the score pressure.',
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
    subtitle: 'One cabinet. One route. Real consequences.',
    badge: 'Daily session',
    steps: [
      'Type a bridge artist to move from your current position toward the target.',
      'Only real documented links count. Weak vibe links do not.',
      'Bad guesses cost one life. The timer never waits for you.',
      'Clues 1 and 2 are free. Clues 3 to 5 cost points immediately.',
      'Finish fast, stay clean, and beat par if you see the sharper route.',
    ],
    noteTitle: 'Why WELA works',
    noteBody:
      'WELA rewards music knowledge under pressure. The better you know the culture, the less you need to spend.',
  },
  guide: {
    title: 'How to play',
    subtitle: 'Simple guide',
    goalTitle: 'Goal',
    goalBody: 'Get from the start artist to the target artist.',
    logicTitle: 'How artists connect',
    logicBody:
      'Right now, WELA connects artists through real shared songs. If both artists are credited on the same song, the move can count.',
    pathTitle: 'More than one path',
    pathBody:
      'There can be more than one correct path. You do not need the only path. You just need a real one.',
    moveTitle: 'Make a move',
    moveBody: 'Type one artist at a time. If the link is real, WELA moves you forward.',
    costTitle: 'What can go wrong',
    costBody: 'A wrong guess costs 1 life. Clue 1 and 2 are free. Clue 3 to 5 cost points.',
    scoreTitle: 'How to score well',
    scoreBody: 'Finish fast, keep your lives, and avoid paid clues if you can.',
    winTitle: 'How to win',
    winBody: 'Reach the target before the timer ends or before you lose all 3 lives.',
    futureTitle: 'Later',
    futureBody:
      'As WELA grows, it can also connect artists through features, producers, labels, live shows, samples, and music history links.',
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
  cabinet: {
    ready: 'machine ready',
    active: 'session live',
    solved: 'route solved',
    failed: 'session failed',
    challengePanel: "today's chain",
    routePanel: 'route trace',
    inputPanel: 'artist terminal',
    cluesPanel: 'clue bank',
    howPanel: 'play code',
    footerInsertCoin: 'INSERT COIN',
    footerDaily: 'daily cabinet',
    savedState: 'restored daily state',
  },
  ticker: {
    today: (date) => `TODAY ${date}`,
    difficulty: (label) => `DIFFICULTY ${label}`,
    par: (value) => `PAR ${value}`,
    timer: (minutes) => `${minutes} MIN CABINET`,
    scoreBase: 'BASE 10000',
  },
  input: {
    title: 'Lock your next bridge',
    subtitle: 'Type an artist name, then commit the move. The cabinet will judge it instantly.',
    placeholder: 'Type bridge artist',
    submit: 'Lock link',
    currentArtist: 'Current',
    targetArtist: 'Target',
    hint: 'Bad guesses cost one life. Clues 3 to 5 cost points. Beat par if you can see the shortcut.',
  },
  clues: {
    title: 'Clue bank',
    subtitle: 'Free first. Paid after that.',
    reveal: 'Reveal',
    free: 'Free',
    open: 'Open',
    locked: 'Locked',
    cost: (value) => `-${value}`,
  },
  status: {
    score: 'Score',
    timer: 'Timer',
    lives: 'Lives',
    steps: 'Steps',
    par: 'Par',
    difficulty: 'Difficulty',
    groove: 'Groove',
    amapiano: 'Amapiano',
    deepCuts: 'Deep Cuts',
    liveScore: 'Live score',
    finalScore: 'Final score',
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
    sessionSolved: 'You closed the cabinet clean.',
    sessionFailed: 'The cabinet won this round.',
    finalScoreLabel: 'Final score',
    timeMultiplierLabel: 'Time multiplier',
    cluePenaltyLabel: 'Clue penalty',
    lifePenaltyLabel: 'Life penalty',
    pureRunLabel: 'Pure run',
    parBonusLabel: 'Par bonus',
    replay: 'Replay session',
    canonicalPath: 'Clean line',
    failByLives: 'All lives were spent before the route closed.',
    failByTimer: 'The timer reached zero before the route closed.',
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
  guide: {
    title: 'Indlela yokudlala',
    subtitle: 'Umhlahlandlela olula',
    goalTitle: 'Inhloso',
    goalBody: 'Suka kumculi oqalayo uye kumculi wokugcina.',
    logicTitle: 'Abaculi baxhuma kanjani',
    logicBody:
      'Okwamanje, iWELA ixhumanisa abaculi ngezingoma zangempela ababelana ngazo. Uma bobabili bebalwe engomeni eyodwa, ukuhamba kungabala.',
    pathTitle: 'Kungaba nemizila eminingi',
    pathBody:
      'Kungaba nemizila engaphezu koyodwa elungile. Awudingi okuwukuphela komzila. Udinga nje umzila wangempela.',
    moveTitle: 'Yenza ukuhamba',
    moveBody: 'Bhala umculi oyedwa ngesikhathi. Uma uxhumano luyiqiniso, iWELA ikuyisa phambili.',
    costTitle: 'Okungahamba kabi',
    costBody: 'Ukuqagela okungalungile kudla impilo eyodwa. Iclue 1 no 2 zimahhala. Iclue 3 kuya ku 5 zidinga amaphuzu.',
    scoreTitle: 'Ungazuza kanjani kahle',
    scoreBody: 'Qeda ngokushesha, gcina izimpilo zakho, futhi ugweme amacebo akhokhelwayo uma ukwazi.',
    winTitle: 'Uwina kanjani',
    winBody: 'Finyelela kumculi wokugcina ngaphambi kokuphela kwesikhathi noma ngaphambi kokulahlekelwa yizo zonke izimpilo ezintathu.',
    futureTitle: 'Ngokuzayo',
    futureBody:
      'Njengoba iWELA ikhula, ingaxhumanisa nabafake isandla, abakhiqizi, amalebula, imicimbi ebukhoma, ama-sample, nezixhumanisi zomlando womculo.',
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
  cabinet: {
    ready: 'umshini ulungile',
    active: 'iseshini ibukhoma',
    solved: 'umzila uqediwe',
    failed: 'iseshini yehlulekile',
    challengePanel: 'iketango lanamuhla',
    routePanel: 'umkhondo womzila',
    inputPanel: 'itheminali yomculi',
    cluesPanel: 'ibhange lamacebo',
    howPanel: 'ikhodi yokudlala',
    footerInsertCoin: 'FAKA IMALI',
    footerDaily: 'ikhabhinethi yansuku zonke',
    savedState: 'isimo sanamuhla sibuyisiwe',
  },
  ticker: {
    today: (date) => `NAMUHLA ${date}`,
    difficulty: (label) => `UBUNZIMA ${label}`,
    par: (value) => `PAR ${value}`,
    timer: (minutes) => `IKHABHINETHI ${minutes} MIN`,
    scoreBase: 'ISIKELO 10000',
  },
  input: {
    title: 'Vala uxhumano olulandelayo',
    subtitle: 'Bhala igama lomculi bese uqinisekisa ukuhamba.',
    placeholder: 'Bhala umculi',
    submit: 'Vala uxhumano',
    currentArtist: 'Okwamanje',
    targetArtist: 'Ithagethi',
    hint: 'Ukuqagela okungalungile kudla impilo eyodwa. Amacebo akhokhelwayo adla amaphuzu.',
  },
  clues: {
    title: 'Ibhange lamacebo',
    subtitle: 'Amabili okuqala amahhala.',
    reveal: 'Vula',
    free: 'Mahhala',
    open: 'Kuvuliwe',
    locked: 'Kukhiyiwe',
    cost: (value) => `-${value}`,
  },
  status: {
    score: 'Amaphuzu',
    timer: 'Isibali sikhathi',
    lives: 'Izimpilo',
    steps: 'Izinyathelo',
    par: 'Par',
    difficulty: 'Ubunzima',
    groove: 'Groove',
    amapiano: 'Amapiano',
    deepCuts: 'Deep Cuts',
    liveScore: 'Amaphuzu aphilayo',
    finalScore: 'Amaphuzu okugcina',
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
    sessionSolved: 'Uvale ikhabhinethi kahle.',
    sessionFailed: 'Ikhabhinethi ikunqobile kulokhu.',
    finalScoreLabel: 'Amaphuzu okugcina',
    timeMultiplierLabel: 'Isiphindaphindi sesikhathi',
    cluePenaltyLabel: 'Inhlawulo yecala',
    lifePenaltyLabel: 'Inhlawulo yempilo',
    pureRunLabel: 'Ukuhamba okuhlanzekile',
    parBonusLabel: 'Ibhonasi ye-par',
    replay: 'Phinda iseshini',
    canonicalPath: 'Umzila ohlanzekile',
    failByLives: 'Zonke izimpilo ziphelile ngaphambi kokuba umzila uvalwe.',
    failByTimer: 'Isikhathi siphelile ngaphambi kokuba umzila uvalwe.',
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
  guide: {
    title: 'Indlela yokudlala',
    subtitle: 'Isikhokelo esilula',
    goalTitle: 'Injongo',
    goalBody: 'Hamba ukusuka kwigcisa lokuqala uye kwelijoliswe kulo.',
    logicTitle: 'Amagcisa adibana njani',
    logicBody:
      'Okwangoku, iWELA idibanisa amagcisa ngeengoma zokwenene ababelana ngazo. Ukuba bobabini badweliswe kwingoma enye, inyathelo lingabala.',
    pathTitle: 'Kungakho iindlela ezininzi',
    pathBody:
      'Kungakho kubekho indlela engaphezu kwenye echanekileyo. Awudingi kuphela indlela enye. Udinga nje indlela yokwenene.',
    moveTitle: 'Yenza inyathelo',
    moveBody: 'Chwetheza igcisa elinye ngexesha. Ukuba ikhonkco liyinyani, iWELA iyakusa phambili.',
    costTitle: 'Yintoni enokungalungi',
    costBody: 'Ukuqikelela gwenxa kudla ubomi obu-1. Iclue 1 no 2 zisimahla. Iclue 3 ukuya ku 5 zixabisa amanqaku.',
    scoreTitle: 'Ufumana njani amanqaku amahle',
    scoreBody: 'Gqiba ngokukhawuleza, gcina ubomi bakho, kwaye uphephe iingcebiso ezihlawulelwayo xa unako.',
    winTitle: 'Uwina njani',
    winBody: 'Fikelela kwigcisa ekujoliswe kulo phambi kokuphela kwexesha okanye phambi kokuba ulahlekelwe bubomi bonke obu-3.',
    futureTitle: 'Kamva',
    futureBody:
      'Njengoko iWELA ikhula, inokudibanisa ngeefeature, abavelisi, iilebhile, imiboniso ephilayo, ii-sample, kunye nekhonkco lembali yomculo.',
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
  cabinet: {
    ready: 'umatshini ulungile',
    active: 'iseshoni iyasebenza',
    solved: 'indlela igqityiwe',
    failed: 'iseshoni ayiphumelelanga',
    challengePanel: 'ikhonkco lanamhlanje',
    routePanel: 'umkhondo wendlela',
    inputPanel: 'itheminali yegcisa',
    cluesPanel: 'ibhanki yeengcebiso',
    howPanel: 'ikhowudi yokudlala',
    footerInsertCoin: 'FAKA IKOINI',
    footerDaily: 'ikhabhinethi yemihla ngemihla',
    savedState: 'imeko yanamhlanje ibuyisiwe',
  },
  ticker: {
    today: (date) => `NAMHLANJE ${date}`,
    difficulty: (label) => `UBUNZIMA ${label}`,
    par: (value) => `PAR ${value}`,
    timer: (minutes) => `IKHABHINETHI ${minutes} MIN`,
    scoreBase: 'ISISISEKO 10000',
  },
  input: {
    title: 'Tshixa ikhonkco lakho elilandelayo',
    subtitle: 'Chwetheza igama legcisa uze uqinisekise inyathelo.',
    placeholder: 'Chwetheza igcisa',
    submit: 'Tshixa ikhonkco',
    currentArtist: 'Langoku',
    targetArtist: 'Ekujoliswe kuyo',
    hint: 'Ukuqikelela gwenxa kudla ubomi obunye. Iingcebiso ezihlawulelwayo zidla amanqaku.',
  },
  clues: {
    title: 'Ibhanki yeengcebiso',
    subtitle: 'Ezimbini zokuqala zisimahla.',
    reveal: 'Vula',
    free: 'Simahla',
    open: 'Vuliwe',
    locked: 'Kutshixiwe',
    cost: (value) => `-${value}`,
  },
  status: {
    score: 'Amanqaku',
    timer: 'Ixesha',
    lives: 'Ubomi',
    steps: 'Amanyathelo',
    par: 'Par',
    difficulty: 'Ubunzima',
    groove: 'Groove',
    amapiano: 'Amapiano',
    deepCuts: 'Deep Cuts',
    liveScore: 'Amanqaku aphilayo',
    finalScore: 'Amanqaku okugqibela',
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
    sessionSolved: 'Uvale ikhabhinethi ngokucocekileyo.',
    sessionFailed: 'Ikhabhinethi iphumelele kule round.',
    finalScoreLabel: 'Amanqaku okugqibela',
    timeMultiplierLabel: 'Isiphindaphindi sexesha',
    cluePenaltyLabel: 'Isigwebo sengwebo',
    lifePenaltyLabel: 'Isigwebo sobomi',
    pureRunLabel: 'Ukuhamba okucocekileyo',
    parBonusLabel: 'Ibhonasi ye-par',
    replay: 'Phinda iseshoni',
    canonicalPath: 'Umgca ococekileyo',
    failByLives: 'Bonke ubomi buphelile ngaphambi kokuba indlela ivalwe.',
    failByTimer: 'Ixesha lifike ku-zero ngaphambi kokuba indlela ivalwe.',
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
