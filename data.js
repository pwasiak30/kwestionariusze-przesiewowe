// data.js — Definicje kwestionariuszy przesiewowych
//
// Uwaga o prawach autorskich: GAD-7, PHQ-9, PCL-5, EPDS, IIEF-5, MDQ, HCL-16/32,
// AIS, GDS, AUDIT i podobne narzędzia badawcze/przesiewowe są powszechnie
// udostępniane bezpłatnie do użytku klinicznego, edukacyjnego i przesiewowego.
// BDI-II i FSFI są narzędziami zastrzeżonymi prawami autorskimi (odpowiednio:
// Pearson i MAPI Research Trust) — z tego względu aplikacja NIE zawiera treści
// ich pozycji testowych, a jedynie kalkulator sumujący i interpretujący wyniki
// wprowadzone ręcznie na podstawie oryginalnego, licencjonowanego arkusza.
//
// Wszystkie narzędzia mają charakter przesiewowy / psychoedukacyjny.

const TAK_NIE = [
  { value: 0, label: "Nie" },
  { value: 1, label: "Tak" }
];

const LIKERT_4_FREQ = [
  { value: 0, label: "Wcale" },
  { value: 1, label: "Kilka dni" },
  { value: 2, label: "Więcej niż połowę dni" },
  { value: 3, label: "Niemal każdego dnia" }
];

const LIKERT_5_PCL = [
  { value: 0, label: "Wcale" },
  { value: 1, label: "Trochę" },
  { value: 2, label: "Umiarkowanie" },
  { value: 3, label: "Znacznie" },
  { value: 4, label: "Bardzo silnie" }
];

const LIKERT_5_YBOCS = [
  { value: 0, label: "Brak" },
  { value: 1, label: "Łagodne" },
  { value: 2, label: "Umiarkowane" },
  { value: 3, label: "Silne" },
  { value: 4, label: "Skrajne" }
];

// Kategorie tematyczne — używane do grupowania i filtrowania na stronie głównej
const CATEGORIES = [
  { key: "nastroj", label: "Depresja i zaburzenia nastroju", icon: "🌧️" },
  { key: "lek", label: "Lęk i zaburzenia lękowe", icon: "🌀" },
  { key: "trauma", label: "Trauma i stres pourazowy", icon: "⚡" },
  { key: "uzaleznienia", label: "Uzależnienia", icon: "🧩" },
  { key: "dzieci", label: "Dzieci i rodzina", icon: "👪" },
  { key: "sen", label: "Sen", icon: "🌙" },
  { key: "seksualnosc", label: "Zdrowie seksualne", icon: "💗" }
];

const QUESTIONNAIRES = {

  // ============================================================= GAD-7
  gad7: {
    id: "gad7",
    name: "GAD-7",
    fullName: "Kwestionariusz Zaburzenia Lękowego Uogólnionego (GAD-7)",
    description: "7-punktowa skala przesiewowa objawów lęku uogólnionego (Spitzer i wsp.).",
    category: "lek",
    keywords: ["lęk", "GAD", "zamartwianie", "napięcie", "niepokój"],
    instructions: "W ciągu ostatnich 2 tygodni, jak często dokuczał(a) Panu/Pani następujący problem?",
    kind: "likert",
    options: LIKERT_4_FREQ,
    maxScore: 21,
    items: [
      "Odczuwanie nerwowości, lęku lub napięcia",
      "Niemożność powstrzymania się od martwienia się lub kontrolowania zamartwiania",
      "Nadmierne martwienie się różnymi sprawami",
      "Trudności z odprężeniem się",
      "Niepokój ruchowy powodujący trudność z usiedzeniem w miejscu",
      "Łatwe irytowanie się lub drażliwość",
      "Odczuwanie strachu, jakby miało wydarzyć się coś złego"
    ],
    interpret(total) {
      let band, note;
      if (total <= 4) { band = "Minimalny poziom lęku"; note = "Brak wskazań do dalszej diagnostyki w kierunku GAD."; }
      else if (total <= 9) { band = "Łagodny poziom lęku"; note = "Warto obserwować objawy, rozważyć monitorowanie."; }
      else if (total <= 14) { band = "Umiarkowany poziom lęku"; note = "Wskazana dalsza ocena kliniczna."; }
      else { band = "Ciężki poziom lęku"; note = "Silne wskazanie do pogłębionej diagnozy i interwencji klinicznej."; }
      const flag = total >= 10 ? "Wynik ≥10 uznawany jest za punkt odcięcia sugerujący prawdopodobne GAD — zalecana dalsza ocena." : null;
      return { band, note, flag };
    }
  },

  // ============================================================= PHQ-9
  phq9: {
    id: "phq9",
    name: "PHQ-9",
    fullName: "Kwestionariusz Zdrowia Pacjenta – 9 (PHQ-9)",
    description: "9-punktowa skala przesiewowa nasilenia objawów depresyjnych (Kroenke, Spitzer, Williams).",
    category: "nastroj",
    keywords: ["depresja", "smutek", "anhedonia", "myśli samobójcze"],
    instructions: "W ciągu ostatnich 2 tygodni, jak często dokuczał(a) Panu/Pani następujący problem?",
    kind: "likert",
    options: LIKERT_4_FREQ,
    maxScore: 27,
    suicideItemIndex: 8,
    items: [
      "Małe zainteresowanie lub odczuwanie przyjemności z wykonywania czynności",
      "Poczucie smutku, przygnębienia lub beznadziejności",
      "Trudności z zasypianiem lub przerywany sen, albo nadmierna senność",
      "Uczucie zmęczenia lub brak energii",
      "Brak apetytu lub przejadanie się",
      "Negatywna ocena siebie — poczucie porażki, zawiedzenia siebie lub rodziny",
      "Trudności ze skupieniem uwagi, np. podczas czytania czy oglądania telewizji",
      "Spowolnienie ruchowe lub mowy zauważalne przez innych, albo przeciwnie — nadmierny niepokój ruchowy",
      "Myśli, że lepiej byłoby umrzeć, lub myśli o skrzywdzeniu siebie w jakikolwiek sposób"
    ],
    interpret(total) {
      let band, note;
      if (total <= 4) { band = "Brak lub minimalne objawy depresyjne"; note = "Wynik w normie."; }
      else if (total <= 9) { band = "Łagodne objawy depresyjne"; note = "Zalecana obserwacja, ewentualnie kontrola za 2–4 tygodnie."; }
      else if (total <= 14) { band = "Umiarkowane objawy depresyjne"; note = "Wskazana konsultacja i rozważenie planu leczenia."; }
      else if (total <= 19) { band = "Umiarkowanie ciężkie objawy depresyjne"; note = "Wskazane aktywne leczenie (psychoterapia i/lub farmakoterapia)."; }
      else { band = "Ciężkie objawy depresyjne"; note = "Pilna interwencja kliniczna — rozważyć natychmiastowe leczenie."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= PCL-5
  pcl5: {
    id: "pcl5",
    name: "PCL-5",
    fullName: "PTSD Checklist for DSM-5 (PCL-5)",
    description: "20-punktowa lista objawów PTSD wg kryteriów DSM-5 (Weathers i wsp., National Center for PTSD).",
    category: "trauma",
    keywords: ["PTSD", "trauma", "stres pourazowy", "flashback", "unikanie"],
    instructions: "Poniżej wymieniono problemy, jakie ludzie czasem zgłaszają w odpowiedzi na stresujące doświadczenie życiowe. Proszę zaznaczyć, w jakim stopniu dany problem dokuczał Panu/Pani w ciągu ostatniego miesiąca.",
    kind: "likert",
    options: LIKERT_5_PCL,
    maxScore: 80,
    items: [
      "Powtarzające się, mimowolne i przykre wspomnienia stresującego doświadczenia",
      "Powtarzające się, przykre sny związane ze stresującym doświadczeniem",
      "Nagłe działanie lub odczuwanie, jakby stresujące doświadczenie działo się ponownie (flashback)",
      "Silne przygnębienie psychiczne, gdy coś przypomina o stresującym doświadczeniu",
      "Silne reakcje fizyczne (np. przyspieszone bicie serca, trudności z oddychaniem, pocenie się), gdy coś przypomina o doświadczeniu",
      "Unikanie wspomnień, myśli lub uczuć związanych ze stresującym doświadczeniem",
      "Unikanie zewnętrznych przypomnień o doświadczeniu (ludzi, miejsc, rozmów, czynności, przedmiotów, sytuacji)",
      "Trudności z zapamiętaniem ważnych elementów stresującego doświadczenia",
      "Silne negatywne przekonania o sobie, innych ludziach lub świecie (np. „jestem zły/a”, „nikomu nie można ufać”, „świat jest całkowicie niebezpieczny”)",
      "Obwinianie siebie lub innych o doświadczenie lub jego skutki",
      "Silne negatywne emocje (np. strach, przerażenie, złość, poczucie winy, wstyd)",
      "Utrata zainteresowania czynnościami, które wcześniej sprawiały przyjemność",
      "Poczucie dystansu lub odcięcia od innych ludzi",
      "Trudności w odczuwaniu pozytywnych emocji (np. szczęścia, zadowolenia, miłości do bliskich)",
      "Drażliwość, wybuchy złości lub zachowania agresywne",
      "Podejmowanie zachowań ryzykownych lub autodestrukcyjnych",
      "Nadmierna czujność (bycie „na straży”, wyczulonym na zagrożenie)",
      "Wzmożona reakcja przestrachu (łatwe wzdrygnięcie się)",
      "Trudności z koncentracją uwagi",
      "Trudności z zasypianiem lub utrzymaniem snu"
    ],
    subscales: [
      { key: "B", label: "Klaster B — Intruzje (objawy ponownego przeżywania)", indices: [0, 1, 2, 3, 4] },
      { key: "C", label: "Klaster C — Unikanie", indices: [5, 6] },
      { key: "D", label: "Klaster D — Negatywne zmiany w poznaniu i nastroju", indices: [7, 8, 9, 10, 11, 12, 13] },
      { key: "E", label: "Klaster E — Nadmierne pobudzenie i reaktywność", indices: [14, 15, 16, 17, 18, 19] }
    ],
    interpret(total, answers) {
      const clusterEndorsed = (indices, min) => indices.filter(i => answers[i] >= 2).length >= min;
      const dsmRule =
        clusterEndorsed(this.subscales[0].indices, 1) &&
        clusterEndorsed(this.subscales[1].indices, 1) &&
        clusterEndorsed(this.subscales[2].indices, 2) &&
        clusterEndorsed(this.subscales[3].indices, 2);
      let band;
      if (total < 31) band = "Wynik poniżej typowego progu przesiewowego (31–33 pkt)";
      else band = "Wynik na poziomie lub powyżej typowego progu przesiewowego (31–33 pkt) — prawdopodobne PTSD";
      const note = dsmRule
        ? "Rozkład odpowiedzi (≥2 pkt w odpowiedniej liczbie pozycji w każdym klastrze) spełnia reguły objawowe DSM-5 dla PTSD — wskazana pogłębiona diagnostyka kliniczna."
        : "Rozkład odpowiedzi nie spełnia w pełni reguł objawowych DSM-5 dla wszystkich klastrów — nie wyklucza to PTSD, wskazana ocena kliniczna.";
      return { band, note, flag: null, dsmRule };
    }
  },

  // ============================================================= AUDIT
  audit: {
    id: "audit",
    name: "AUDIT",
    fullName: "Test Rozpoznawania Zaburzeń Związanych z Piciem Alkoholu (AUDIT)",
    description: "10-punktowy test przesiewowy WHO dotyczący spożycia alkoholu i związanych z nim problemów.",
    category: "uzaleznienia",
    keywords: ["alkohol", "picie", "uzależnienie od alkoholu"],
    instructions: "Proszę wybrać odpowiedź najlepiej opisującą Pana/Pani sytuację w ostatnim roku. Jedna porcja standardowa ≈ 10 g czystego alkoholu (250 ml piwa 5%, 100 ml wina 12%, 30 ml wódki 40%).",
    kind: "peritem",
    maxScore: 40,
    items: [
      { text: "Jak często pije Pan/Pani napoje zawierające alkohol?", options: [
        { value: 0, label: "Nigdy" }, { value: 1, label: "Raz w miesiącu lub rzadziej" },
        { value: 2, label: "2–4 razy w miesiącu" }, { value: 3, label: "2–3 razy w tygodniu" },
        { value: 4, label: "4 razy w tygodniu lub częściej" }
      ]},
      { text: "Ile standardowych porcji alkoholu wypija Pan/Pani w typowym dniu picia?", options: [
        { value: 0, label: "1 lub 2" }, { value: 1, label: "3 lub 4" }, { value: 2, label: "5 lub 6" },
        { value: 3, label: "7 do 9" }, { value: 4, label: "10 lub więcej" }
      ]},
      { text: "Jak często wypija Pan/Pani 6 lub więcej porcji alkoholu podczas jednej okazji?", options: [
        { value: 0, label: "Nigdy" }, { value: 1, label: "Rzadziej niż raz w miesiącu" }, { value: 2, label: "Raz w miesiącu" },
        { value: 3, label: "Raz w tygodniu" }, { value: 4, label: "Codziennie lub prawie codziennie" }
      ]},
      { text: "Jak często w ciągu ostatniego roku zdarzyło się Panu/Pani, że nie potrafił(a) Pan/Pani przestać pić, gdy Pan/Pani zaczął(ęła)?", options: [
        { value: 0, label: "Nigdy" }, { value: 1, label: "Rzadziej niż raz w miesiącu" }, { value: 2, label: "Raz w miesiącu" },
        { value: 3, label: "Raz w tygodniu" }, { value: 4, label: "Codziennie lub prawie codziennie" }
      ]},
      { text: "Jak często w ciągu ostatniego roku z powodu picia nie był(a) Pan/Pani w stanie zrobić czegoś, czego się od Pana/Pani zwykle oczekuje?", options: [
        { value: 0, label: "Nigdy" }, { value: 1, label: "Rzadziej niż raz w miesiącu" }, { value: 2, label: "Raz w miesiącu" },
        { value: 3, label: "Raz w tygodniu" }, { value: 4, label: "Codziennie lub prawie codziennie" }
      ]},
      { text: "Jak często w ciągu ostatniego roku potrzebował(a) Pan/Pani alkoholu rano, aby dojść do siebie po intensywnym piciu?", options: [
        { value: 0, label: "Nigdy" }, { value: 1, label: "Rzadziej niż raz w miesiącu" }, { value: 2, label: "Raz w miesiącu" },
        { value: 3, label: "Raz w tygodniu" }, { value: 4, label: "Codziennie lub prawie codziennie" }
      ]},
      { text: "Jak często w ciągu ostatniego roku miał(a) Pan/Pani poczucie winy lub wyrzuty sumienia po piciu?", options: [
        { value: 0, label: "Nigdy" }, { value: 1, label: "Rzadziej niż raz w miesiącu" }, { value: 2, label: "Raz w miesiącu" },
        { value: 3, label: "Raz w tygodniu" }, { value: 4, label: "Codziennie lub prawie codziennie" }
      ]},
      { text: "Jak często w ciągu ostatniego roku nie był(a) Pan/Pani w stanie przypomnieć sobie, co zdarzyło się poprzedniego wieczoru, z powodu picia?", options: [
        { value: 0, label: "Nigdy" }, { value: 1, label: "Rzadziej niż raz w miesiącu" }, { value: 2, label: "Raz w miesiącu" },
        { value: 3, label: "Raz w tygodniu" }, { value: 4, label: "Codziennie lub prawie codziennie" }
      ]},
      { text: "Czy Pan/Pani lub ktoś inny doznał(a) obrażeń w wyniku Pana/Pani picia?", options: [
        { value: 0, label: "Nie" }, { value: 2, label: "Tak, ale nie w ciągu ostatniego roku" }, { value: 4, label: "Tak, w ciągu ostatniego roku" }
      ]},
      { text: "Czy krewny, przyjaciel, lekarz lub inny pracownik służby zdrowia wyraził zaniepokojenie Pana/Pani piciem albo sugerował ograniczenie picia?", options: [
        { value: 0, label: "Nie" }, { value: 2, label: "Tak, ale nie w ciągu ostatniego roku" }, { value: 4, label: "Tak, w ciągu ostatniego roku" }
      ]}
    ],
    interpret(total) {
      let band, note;
      if (total <= 7) { band = "Niskie ryzyko"; note = "Picie na poziomie niskiego ryzyka lub abstynencja."; }
      else if (total <= 15) { band = "Ryzykowne picie"; note = "Wskazana krótka interwencja / psychoedukacja dotycząca picia."; }
      else if (total <= 19) { band = "Szkodliwe picie"; note = "Wskazana krótka interwencja oraz dalsza ocena / monitorowanie."; }
      else { band = "Prawdopodobne uzależnienie od alkoholu"; note = "Wskazana pogłębiona diagnostyka specjalistyczna i skierowanie na leczenie."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= BDI-II
  bdi2: {
    id: "bdi2",
    name: "BDI-II",
    fullName: "Skala Depresji Becka II (BDI-II) — kalkulator punktacji",
    description: "Narzędzie zastrzeżone (Pearson) — kalkulator sumujący wyniki wprowadzone ręcznie z oryginalnego, licencjonowanego arkusza (21 pozycji, 0–3 pkt).",
    category: "nastroj",
    keywords: ["depresja", "Beck", "BDI"],
    kind: "manual",
    color: "#0292A9",
    maxScore: 63,
    itemCount: 21,
    perItemMax: 3,
    manualNote: "Wprowadź punktację (0–3) dla każdej z 21 pozycji BDI-II na podstawie oryginalnego, licencjonowanego arkusza testowego.",
    interpret(total) {
      let band, note;
      if (total <= 13) { band = "Brak depresji / minimalne nasilenie objawów"; note = "Wynik w normie."; }
      else if (total <= 19) { band = "Depresja łagodna"; note = "Zalecana obserwacja i ewentualna konsultacja."; }
      else if (total <= 28) { band = "Depresja umiarkowana"; note = "Wskazana konsultacja specjalistyczna."; }
      else { band = "Depresja ciężka"; note = "Wskazana pilna interwencja kliniczna."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= GDS-30
  gds30: {
    id: "gds30",
    name: "GDS",
    fullName: "Geriatryczna Skala Oceny Depresji (GDS-30, Yesavage)",
    description: "30-pozycyjna skala przesiewowa depresji u osób starszych, format tak/nie.",
    category: "nastroj",
    keywords: ["depresja", "senior", "osoby starsze", "geriatria", "Yesavage"],
    instructions: "Proszę wybrać odpowiedź, która najlepiej opisuje samopoczucie w ciągu ostatniego tygodnia.",
    kind: "likert",
    options: TAK_NIE,
    maxScore: 30,
    reverseIndices: [0, 4, 6, 10, 12, 18, 20, 21, 26, 27, 28],
    items: [
      "Czy jest Pan/Pani zasadniczo zadowolony(a) ze swojego życia?",
      "Czy zrezygnował(a) Pan/Pani z wielu swoich zajęć i zainteresowań?",
      "Czy czuje Pan/Pani, że Pana/Pani życie jest puste?",
      "Czy często czuje się Pan/Pani znudzony(a)?",
      "Czy jest Pan/Pani pełen/pełna nadziei co do przyszłości?",
      "Czy dokucza Panu/Pani jakaś myśl, której nie może się Pan/Pani pozbyć?",
      "Czy przez większość czasu jest Pan/Pani w dobrym nastroju?",
      "Czy obawia się Pan/Pani, że przydarzy się Panu/Pani coś złego?",
      "Czy zamiast wyjść wieczorem i zrobić coś nowego, woli Pan/Pani zostać w domu?",
      "Czy sądzi Pan/Pani, że ma więcej kłopotów z pamięcią niż inni?",
      "Czy uważa Pan/Pani, że wspaniale jest żyć?",
      "Czy czuje się Pan/Pani mało wartościowy(a) w porównaniu z obecnym stanem?",
      "Czy czuje się Pan/Pani pełen/pełna energii?",
      "Czy uważa Pan/Pani, że Pana/Pani sytuacja jest beznadziejna?",
      "Czy sądzi Pan/Pani, że większość ludzi ma się lepiej niż Pan/Pani?",
      "Czy często martwi się Pan/Pani drobnymi sprawami?",
      "Czy często ma Pan/Pani ochotę płakać?",
      "Czy ma Pan/Pani trudności ze skupieniem uwagi?",
      "Czy budzi się Pan/Pani rano z przyjemnością?",
      "Czy unika Pan/Pani spotkań towarzyskich?",
      "Czy łatwo jest Panu/Pani podejmować decyzje?",
      "Czy Pana/Pani umysł jest tak sprawny jak dawniej?",
      "Czy odczuwa Pan/Pani niepokój ruchowy, trudność w usiedzeniu w miejscu?",
      "Czy woli Pan/Pani unikać nowych sytuacji?",
      "Czy czuje się Pan/Pani bezwartościowy(a)?",
      "Czy martwi się Pan/Pani swoją przyszłością?",
      "Czy woli Pan/Pani towarzystwo innych ludzi niż samotność?",
      "Czy sprawia Panu/Pani przyjemność myśl o nowym dniu?",
      "Czy łatwo jest Panu/Pani nawiązywać nowe znajomości?",
      "Czy uważa Pan/Pani, że w tej chwili życie jest dla Pana/Pani ciężarem?"
    ],
    interpret(total, answers) {
      const score = answers.reduce((sum, ans, i) => {
        const isReverse = this.reverseIndices.includes(i);
        const point = isReverse ? (ans === 0 ? 1 : 0) : (ans === 1 ? 1 : 0);
        return sum + point;
      }, 0);
      let band, note;
      if (score <= 9) { band = "Brak depresji"; note = "Wynik w normie."; }
      else if (score <= 19) { band = "Depresja łagodna do umiarkowanej"; note = "Wskazana dalsza obserwacja i konsultacja."; }
      else { band = "Depresja ciężka"; note = "Wskazana pilna konsultacja specjalistyczna."; }
      return { band, note, flag: null, recalculatedScore: score };
    }
  },

  // ============================================================= CAST
  cast: {
    id: "cast",
    name: "CAST",
    fullName: "Test dla Dzieci z Rodzin z Problemem Alkoholowym (CAST)",
    description: "30-pozycyjny test przesiewowy dla dzieci i młodzieży (9 lat i więcej) z rodzin z problemem alkoholowym rodzica.",
    category: "dzieci",
    keywords: ["DDA", "dziecko alkoholika", "rodzina", "alkohol w rodzinie"],
    instructions: "Format tak/nie. Test przeznaczony dla dzieci w wieku 9 lat i starszych.",
    kind: "likert",
    options: TAK_NIE,
    maxScore: 30,
    items: [
      "Czy uważasz, że ktoś z Twoich rodziców ma problem z piciem alkoholu?",
      "Czy z powodu picia rodzica nie mogłeś/aś zasnąć w nocy?",
      "Czy namawiałeś/aś rodzica, żeby przestał pić?",
      "Czy czułeś się samotny, przestraszony, zły lub sfrustrowany z powodu picia rodzica?",
      "Czy kłóciłeś/aś się lub sprzeczałeś/aś z pijącym rodzicem?",
      "Czy groziłeś/aś ucieczką z domu z powodu picia rodzica?",
      "Czy rodzic krzyczał na Ciebie lub uderzył Cię albo kogoś z rodziny będąc pod wpływem alkoholu?",
      "Czy widziałeś/aś, jak rodzice kłócą się lub biją, gdy jedno z nich było pod wpływem alkoholu?",
      "Czy broniłeś/aś członka rodziny przed pijącym rodzicem?",
      "Czy chciałeś/aś ukryć lub wylać alkohol rodzica?",
      "Czy często myślisz o problemie picia rodzica?",
      "Czy chciałbyś/chciałabyś, żeby rodzic przestał pić?",
      "Czy czułeś się winny lub odpowiedzialny za picie rodzica?",
      "Czy obawiałeś/aś się, że rodzice się rozstaną z powodu alkoholu?",
      "Czy unikałeś/aś zapraszania znajomych do domu z poczucia zawstydzenia?",
      "Czy czułeś się wciągnięty w konflikt między rodzicami?",
      "Czy myślałeś/aś, że to Ty jesteś przyczyną picia rodzica?",
      "Czy wierzyłeś/aś, że rodzic Cię nie kocha?",
      "Czy miałeś/aś żal do rodzica za jego picie?",
      "Czy martwiłeś/aś się o zdrowie pijącego rodzica?",
      "Czy byłeś/aś obwiniany za bycie przyczyną picia rodzica?",
      "Czy uważasz, że Twój ojciec jest alkoholikiem?",
      "Czy chciałbyś/chciałabyś, żeby Twój dom przypominał domy Twoich przyjaciół?",
      "Czy rodzic obiecywał coś i nie dotrzymywał obietnicy z powodu picia?",
      "Czy uważasz, że Twoja matka jest alkoholiczką?",
      "Czy potrzebowałeś/aś kogoś, z kim mógłbyś/mogłabyś porozmawiać o problemach w rodzinie?",
      "Czy kłóciłeś/aś się z rodzeństwem o picie rodzica?",
      "Czy unikałeś/aś powrotu do domu?",
      "Czy czułeś się chory fizycznie z powodu zamartwiania się?",
      "Czy przejmowałeś/aś obowiązki domowe rodzica z powodu jego picia?"
    ],
    interpret(total) {
      let band, note;
      if (total <= 1) { band = "Brak wskazań"; note = "Wynik charakterystyczny dla dzieci z rodzin bez problemu alkoholowego."; }
      else if (total <= 5) { band = "Wynik graniczny"; note = "Warto przyjrzeć się bliżej sytuacji rodzinnej."; }
      else { band = "Wskazanie na problem alkoholowy w rodzinie"; note = "Wynik ≥6 sugeruje, że dziecko pochodzi z rodziny z problemem alkoholowym — wskazana dalsza ocena i wsparcie."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= LSAS
  lsas: {
    id: "lsas",
    name: "LSAS",
    fullName: "Skala Lęku Społecznego Liebowitza (LSAS)",
    description: "24 sytuacje społeczne oceniane pod kątem lęku/strachu oraz unikania — narzędzie przesiewowe fobii społecznej.",
    category: "lek",
    keywords: ["fobia społeczna", "lęk społeczny", "nieśmiałość", "Liebowitz"],
    instructions: "Dla każdej sytuacji oceń osobno poziom lęku/strachu ORAZ częstość unikania w ciągu ostatniego tygodnia.",
    kind: "dual",
    maxScore: 144,
    optionsA: [
      { value: 0, label: "Brak" }, { value: 1, label: "Łagodny" }, { value: 2, label: "Umiarkowany" }, { value: 3, label: "Silny" }
    ],
    optionsB: [
      { value: 0, label: "Nigdy (0%)" }, { value: 1, label: "Niekiedy (1–33%)" }, { value: 2, label: "Często (34–66%)" }, { value: 3, label: "Zawsze (67–100%)" }
    ],
    labelA: "Lęk / strach",
    labelB: "Unikanie",
    items: [
      "Rozmawianie przez telefon w obecności innych osób",
      "Uczestniczenie w małej grupie osób",
      "Jedzenie w miejscu publicznym",
      "Picie z innymi w miejscu publicznym",
      "Rozmawianie z osobą o wysokiej pozycji / autorytetem",
      "Występowanie lub przemawianie przed publicznością",
      "Pójście na przyjęcie / spotkanie towarzyskie",
      "Praca podczas obserwowania przez innych",
      "Pisanie podczas obserwowania przez innych",
      "Dzwonienie do osoby, której dobrze nie znasz",
      "Rozmawianie z ludźmi, których dobrze nie znasz",
      "Spotykanie się z obcymi osobami",
      "Korzystanie z publicznej toalety",
      "Wchodzenie do pomieszczenia, gdy inni już siedzą",
      "Bycie w centrum uwagi",
      "Zabieranie głosu na zebraniu",
      "Zdawanie egzaminu / testu sprawdzającego wiedzę lub umiejętności",
      "Wyrażanie sprzeciwu wobec osoby, której dobrze nie znasz",
      "Patrzenie w oczy osobom, których dobrze nie znasz",
      "Wygłaszanie przygotowanego referatu przed grupą",
      "Podejmowanie prób flirtu / poznawania kogoś",
      "Zwracanie towaru w sklepie",
      "Organizowanie przyjęcia",
      "Odmawianie natrętnemu sprzedawcy"
    ],
    interpret(total, answersA, answersB) {
      let band, note;
      // Progi liczbowe wg jednego z publikowanych schematów (m.in. tab. w Danforth i wsp., PMC6208958);
      // uwaga: w literaturze funkcjonuje też inny, niezależny schemat progów (Mennin i wsp. 2002:
      // 0–29 / 30–49 / 50–64 / 65–79 / 80–94 / ≥95) — przy interpretacji warto podać źródło.
      if (total <= 54) { band = "Norma (brak fobii społecznej)"; note = "Wynik poniżej progu klinicznego."; }
      else if (total <= 65) { band = "Umiarkowana fobia społeczna"; note = "Wskazana konsultacja specjalistyczna."; }
      else if (total <= 80) { band = "Nasilona (wyraźna) fobia społeczna"; note = "Wskazana konsultacja specjalistyczna."; }
      else if (total <= 95) { band = "Ciężka fobia społeczna"; note = "Wskazane leczenie (psychoterapia i/lub farmakoterapia)."; }
      else { band = "Bardzo ciężka (skrajna) fobia społeczna"; note = "Wskazana pilna interwencja kliniczna."; }
      const sumA = answersA.reduce((s, v) => s + v, 0);
      const sumB = answersB.reduce((s, v) => s + v, 0);
      return { band, note, flag: null, dualSums: { labelA: "Suma lęku/strachu", sumA, labelB: "Suma unikania", sumB } };
    }
  },

  // ============================================================= Y-BOCS
  ybocs: {
    id: "ybocs",
    name: "Y-BOCS",
    fullName: "Skala Obsesji i Kompulsji Yale-Brown (Y-BOCS) — skala nasilenia",
    description: "10-pozycyjna skala oceny nasilenia objawów zaburzenia obsesyjno-kompulsyjnego (5 pytań o obsesje, 5 o kompulsje).",
    category: "lek",
    keywords: ["OCD", "nerwica natręctw", "obsesje", "kompulsje", "natręctwa"],
    instructions: "Oceń nasilenie objawów w ciągu ostatniego tygodnia, osobno dla obsesji (myśli natrętne) i kompulsji (czynności przymusowe).",
    kind: "likert",
    options: LIKERT_5_YBOCS,
    maxScore: 40,
    items: [
      "Ile czasu w ciągu dnia zajmują Ci natrętne myśli (obsesje)?",
      "W jakim stopniu obsesje zakłócają Twoje funkcjonowanie społeczne lub zawodowe?",
      "Jak duży dyskomfort/cierpienie wywołują u Ciebie natrętne myśli?",
      "Jak bardzo próbujesz opierać się natrętnym myślom?",
      "Jaką masz kontrolę nad swoimi natrętnymi myślami?",
      "Ile czasu w ciągu dnia zajmują Ci czynności przymusowe (kompulsje)?",
      "W jakim stopniu kompulsje zakłócają Twoje funkcjonowanie społeczne lub zawodowe?",
      "Jaki niepokój odczuwałbyś/odczuwałabyś, gdyby powstrzymano Cię przed wykonaniem czynności przymusowej?",
      "Jak bardzo próbujesz opierać się czynnościom przymusowym?",
      "Jaką masz kontrolę nad swoimi czynnościami przymusowymi?"
    ],
    subscales: [
      { key: "OBS", label: "Podskala obsesji (poz. 1–5)", indices: [0, 1, 2, 3, 4] },
      { key: "COMP", label: "Podskala kompulsji (poz. 6–10)", indices: [5, 6, 7, 8, 9] }
    ],
    interpret(total) {
      let band, note;
      if (total <= 7) { band = "Nasilenie podprogowe"; note = "Objawy poniżej progu klinicznego."; }
      else if (total <= 15) { band = "Nasilenie łagodne"; note = "Warto monitorować objawy."; }
      else if (total <= 23) { band = "Nasilenie umiarkowane"; note = "Wskazana konsultacja specjalistyczna."; }
      else if (total <= 31) { band = "Nasilenie ciężkie"; note = "Wskazane leczenie specjalistyczne."; }
      else { band = "Nasilenie skrajne"; note = "Wskazana pilna interwencja kliniczna."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= AIS
  ais: {
    id: "ais",
    name: "AIS",
    fullName: "Ateńska Skala Bezsenności (AIS)",
    description: "8-pozycyjna skala przesiewowa objawów bezsenności wg kryteriów ICD-10.",
    category: "sen",
    keywords: ["bezsenność", "sen", "insomnia", "zasypianie"],
    instructions: "Oceń swoje problemy ze snem występujące co najmniej 3 razy w tygodniu w ciągu ostatniego miesiąca.",
    kind: "peritem",
    maxScore: 24,
    items: [
      { text: "Jak szybko zasypiasz po położeniu się do łóżka i zgaszeniu światła?", options: [
        { value: 0, label: "Szybko" }, { value: 1, label: "Z nieznacznym opóźnieniem" }, { value: 2, label: "Z opóźnieniem" }, { value: 3, label: "Z bardzo dużym opóźnieniem lub wcale nie zasypiam" }
      ]},
      { text: "Czy budzisz się w nocy?", options: [
        { value: 0, label: "Nie" }, { value: 1, label: "Sporadycznie" }, { value: 2, label: "Często" }, { value: 3, label: "Bardzo często lub nie śpię całą noc" }
      ]},
      { text: "Czy budzisz się rano wcześniej niż planowano?", options: [
        { value: 0, label: "Nie" }, { value: 1, label: "Nieznacznie wcześniej" }, { value: 2, label: "Znacznie wcześniej" }, { value: 3, label: "Dużo wcześniej lub wcale nie śpię" }
      ]},
      { text: "Jaki jest całkowity czas Twojego snu?", options: [
        { value: 0, label: "Wystarczający" }, { value: 1, label: "Nieznacznie niewystarczający" }, { value: 2, label: "Wyraźnie niewystarczający" }, { value: 3, label: "Całkowicie niewystarczający" }
      ]},
      { text: "Jak oceniasz jakość swojego snu (niezależnie od czasu trwania)?", options: [
        { value: 0, label: "Satysfakcjonująca" }, { value: 1, label: "Nieznacznie niesatysfakcjonująca" }, { value: 2, label: "Wyraźnie niesatysfakcjonująca" }, { value: 3, label: "Całkowicie niesatysfakcjonująca" }
      ]},
      { text: "Jakie jest Twoje samopoczucie w ciągu dnia następującego po nocy snu?", options: [
        { value: 0, label: "Dobre" }, { value: 1, label: "Nieznacznie gorsze" }, { value: 2, label: "Wyraźnie gorsze" }, { value: 3, label: "Bardzo złe" }
      ]},
      { text: "Jaka jest Twoja sprawność fizyczna i psychiczna w ciągu dnia?", options: [
        { value: 0, label: "Niezaburzona" }, { value: 1, label: "Nieznacznie zaburzona" }, { value: 2, label: "Wyraźnie zaburzona" }, { value: 3, label: "Bardzo zaburzona" }
      ]},
      { text: "Czy odczuwasz senność w ciągu dnia?", options: [
        { value: 0, label: "Nie" }, { value: 1, label: "Nieznaczną" }, { value: 2, label: "Wyraźną" }, { value: 3, label: "Bardzo nasiloną" }
      ]}
    ],
    interpret(total) {
      let band, note;
      if (total <= 5) { band = "Norma"; note = "Brak wskazań na bezsenność."; }
      else { band = "Prawdopodobna bezsenność"; note = "Wynik ≥6 pkt — zgodnie z oryginalną walidacją skali (Soldatos i wsp.) sugeruje to prawdopodobną bezsenność; wskazana konsultacja lekarska."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= Sleep screening
  sleepscreen: {
    id: "sleepscreen",
    name: "Sen+",
    fullName: "Test Przesiewowy Zaburzeń Snu (innych niż bezsenność)",
    description: "Przesiewowa lista pytań dotyczących narkolepsji, zaburzeń oddychania podczas snu, zespołu niespokojnych nóg, zaburzeń rytmu okołodobowego i parasomnii.",
    category: "sen",
    keywords: ["narkolepsja", "bezdech", "niespokojne nogi", "parasomnia", "rytm dobowy"],
    instructions: "Format tak/nie. Odpowiedz na wszystkie pytania — wynik jest analizowany kategoriami.",
    kind: "likert",
    options: TAK_NIE,
    maxScore: 20,
    items: [
      "Czy zdarza Ci się nieoczekiwanie zasypiać w ciągu dnia?",
      "Czy nie potrafisz oprzeć się napadom senności w ciągu dnia?",
      "Czy pod wpływem silnych emocji zdarza Ci się osłabienie mięśni lub „miękkie nogi”?",
      "Czy zasypiając lub budząc się miewasz omamy wzrokowe?",
      "Czy budząc się czujesz się sparaliżowany(a), niezdolny(a) do ruchu?",
      "Czy chrapiesz bardzo głośno?",
      "Czy ktoś zauważył u Ciebie przerwy w oddychaniu podczas snu?",
      "Czy budzisz się w nocy z uczuciem duszenia się / łapania oddechu?",
      "Czy masz nadmierną senność dzienną lub zasypiasz mimowolnie?",
      "Czy odczuwasz mrowienie w nogach, skurcze lub potrzebę poruszania nogami wieczorem?",
      "Czy trudno Ci zasnąć z powodu powtarzających się skurczów mięśni?",
      "Czy budzisz się w nocy z powodu nagłych, mimowolnych ruchów nóg?",
      "Czy musisz wstać i chodzić, aby złagodzić nieprzyjemne doznania w nogach?",
      "Czy zwykle dobrze śpisz, ale o „niewłaściwej porze”?",
      "Czy dobrze funkcjonujesz tylko wtedy, gdy budzisz się bardzo późno?",
      "Czy zasypiasz bardzo głęboko o porze, gdy powinieneś/aś się obudzić?",
      "Czy funkcjonujesz dobrze tylko wtedy, gdy kładziesz się spać bardzo wcześnie?",
      "Czy budzisz się bardzo wcześnie rano, w pełni wypoczęty(a) i bez senności?",
      "Czy zdarza Ci się lunatykować w sposób stwarzający ryzyko urazu?",
      "Czy odgrywasz treść snów podczas spania (mówienie, ruchy), co stwarza ryzyko urazu, lub miewasz częste koszmary senne?"
    ],
    categories: [
      { key: "narko", label: "Narkolepsja", primary: 0, supplementary: [1, 2, 3, 4] },
      { key: "oddech", label: "Zaburzenia oddychania podczas snu (bezdech)", primary: 5, supplementary: [6, 7, 8] },
      { key: "nogi", label: "Zespół niespokojnych nóg / okresowe ruchy kończyn", primary: 9, supplementary: [10, 11, 12] },
      { key: "rytm", label: "Zaburzenia rytmu okołodobowego", primary: 13, supplementary: [14, 15, 16, 17] },
      { key: "parasomnie", label: "Parasomnie", primary: 18, supplementary: [19] }
    ],
    interpret(total, answers) {
      const flaggedCats = this.categories.filter(
        (c) => answers[c.primary] === 1 && c.supplementary.some((i) => answers[i] === 1)
      );
      const band = flaggedCats.length > 0 ? "Wskazania w co najmniej jednej kategorii" : "Brak wyraźnych wskazań";
      const note = flaggedCats.length > 0
        ? "Test ma charakter wyłącznie orientacyjny — w przypadku dodatnich wskazań zalecana konsultacja specjalistyczna (neurolog / pulmonolog / laryngolog / poradnia medycyny snu)."
        : "Brak dodatnich wskazań w żadnej z badanych kategorii zaburzeń snu.";
      return {
        band, note, flag: null,
        categoryFlags: this.categories.map((c) => ({
          label: c.label,
          flagged: answers[c.primary] === 1 && c.supplementary.some((i) => answers[i] === 1)
        }))
      };
    }
  },

  // ============================================================= Internet addiction (short)
  iat8: {
    id: "iat8",
    name: "IAT-8",
    fullName: "Test Uzależnienia od Internetu (K. Young, wersja skrócona)",
    description: "8-pozycyjny test przesiewowy problemowego korzystania z internetu, format tak/nie.",
    category: "uzaleznienia",
    keywords: ["internet", "uzależnienie od internetu", "sieć", "media", "ekran"],
    kind: "likert",
    options: TAK_NIE,
    maxScore: 8,
    items: [
      "Czy odczuwasz silne zaabsorbowanie Internetem — nieustannie myślisz o wcześniejszych sesjach online lub planujesz kolejne?",
      "Czy czujesz potrzebę spędzania w Internecie coraz więcej czasu, aby osiągnąć satysfakcję?",
      "Czy miałeś/aś wielokrotne, nieudane próby kontrolowania, ograniczania lub zaprzestania korzystania z Internetu?",
      "Czy odczuwasz niepokój, napięcie lub obniżony nastrój przy próbach ograniczenia korzystania z Internetu?",
      "Czy korzystasz z Internetu dłużej, niż pierwotnie planowałeś/aś?",
      "Czy z powodu nadmiernego korzystania z Internetu pojawiło się ryzyko utraty ważnej relacji, pracy lub szansy edukacyjnej?",
      "Czy zdarzyło Ci się okłamywać bliskich, terapeutę lub inne osoby, aby ukryć rozmiar korzystania z Internetu?",
      "Czy korzystasz z Internetu, aby uciec od problemów lub złagodzić przykre nastroje (np. poczucie winy, lęk, bezradność)?"
    ],
    interpret(total) {
      let band, note;
      if (total <= 5) { band = "Brak wskazań"; note = "Wynik poniżej progu przesiewowego."; }
      else { band = "Możliwe problemowe korzystanie z Internetu"; note = "Więcej niż 5 odpowiedzi „Tak” (6 lub więcej) sugeruje możliwy problem — wskazana pogłębiona ocena."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= HCL-16
  hcl16: {
    id: "hcl16",
    name: "HCL-16",
    fullName: "Kwestionariusz Objawów Hipomanii — wersja krótka (HCL-16)",
    description: "16-pozycyjny kwestionariusz przesiewowy w kierunku spektrum choroby dwubiegunowej.",
    category: "nastroj",
    keywords: ["choroba dwubiegunowa", "hipomania", "mania", "nastrój"],
    instructions: "Odnieś się do okresów, gdy czułeś/aś się „rozkręcony/a” inaczej niż zwykle. Format tak/nie.",
    kind: "likert",
    options: TAK_NIE,
    maxScore: 16,
    items: [
      "Potrzebuję mniej snu",
      "Praca sprawia mi większą radość",
      "Chcę podróżować i faktycznie więcej podróżuję",
      "Wydaję więcej lub zbyt dużo pieniędzy",
      "Podejmuję większe ryzyko w codziennym życiu (praca, inne czynności)",
      "Jestem bardziej aktywny(a) fizycznie (sport itp.)",
      "Ubieram się bardziej kolorowo, mam bardziej ekstrawaganckie rzeczy/makijaż",
      "Chcę spotykać się lub faktycznie spotykam się z większą liczbą ludzi",
      "Jestem bardziej zainteresowany(a) sprawami seksu i/lub mam zwiększony popęd płciowy",
      "Myślę szybciej",
      "Więcej żartuję podczas rozmów",
      "Częściej się kłócę",
      "Mój nastrój jest lepszy, bardziej optymistyczny",
      "Palę więcej papierosów",
      "Piję więcej alkoholu",
      "Zażywam więcej leków (uspokajających, przeciwlękowych, pobudzających)"
    ],
    interpret(total) {
      let band, note;
      if (total <= 7) { band = "Wynik poniżej progu przesiewowego"; note = "Niskie prawdopodobieństwo spektrum dwubiegunowego wg tego narzędzia."; }
      else { band = "Wynik powyżej progu przesiewowego"; note = "8 lub więcej odpowiedzi „Tak” wskazuje na istotne prawdopodobieństwo spektrum zaburzeń dwubiegunowych — wynik ma charakter wyłącznie orientacyjny, wymaga konsultacji psychiatrycznej."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= HCL-32
  hcl32: {
    id: "hcl32",
    name: "HCL-32",
    fullName: "Kwestionariusz Objawów Hipomanii (HCL-32)",
    description: "32-pozycyjny, pełny kwestionariusz przesiewowy w kierunku spektrum choroby dwubiegunowej.",
    category: "nastroj",
    keywords: ["choroba dwubiegunowa", "hipomania", "mania", "nastrój"],
    instructions: "Odnieś się do okresów, gdy czułeś/aś się „rozkręcony/a” inaczej niż zwykle. Format tak/nie.",
    kind: "likert",
    options: TAK_NIE,
    maxScore: 32,
    items: [
      "Potrzebuję mniej snu",
      "Czuję, że mam więcej energii i jestem bardziej aktywny(a)",
      "Jestem bardziej pewny/a siebie",
      "Praca sprawia mi większą radość",
      "Mam więcej kontaktów towarzyskich (więcej dzwonię, więcej wychodzę)",
      "Chcę podróżować i faktycznie więcej podróżuję",
      "Zwykle szybciej jeżdżę samochodem lub podejmuję większe ryzyko podczas jazdy",
      "Wydaję więcej lub zbyt dużo pieniędzy",
      "Podejmuję większe ryzyko w codziennym życiu (praca, inne czynności)",
      "Jestem bardziej aktywny(a) fizycznie (sport itp.)",
      "Planuję więcej czynności lub projektów",
      "Mam więcej pomysłów, jestem bardziej twórczy/a",
      "Jestem mniej nieśmiały/a lub mniej zahamowany/a",
      "Ubieram się bardziej kolorowo, mam bardziej ekstrawaganckie rzeczy/makijaż",
      "Chcę spotykać się lub faktycznie spotykam się z większą liczbą ludzi",
      "Jestem bardziej zainteresowany(a) sprawami seksu i/lub mam zwiększony popęd płciowy",
      "Więcej flirtuję i/lub jestem bardziej aktywny(a) seksualnie",
      "Więcej mówię",
      "Myślę szybciej",
      "Więcej żartuję podczas rozmów",
      "Łatwiej się rozpraszam",
      "Angażuję się w wiele nowych spraw",
      "Moje myśli skaczą z tematu na temat",
      "Robię rzeczy szybciej i z większą łatwością",
      "Jestem bardziej niecierpliwy(a) i/lub łatwiej się denerwuję",
      "Mogę być męczący/a lub drażniący/a dla innych",
      "Częściej się kłócę",
      "Mój nastrój jest lepszy, bardziej optymistyczny",
      "Piję więcej kawy",
      "Palę więcej papierosów",
      "Piję więcej alkoholu",
      "Zażywam więcej leków (uspokajających, przeciwlękowych, pobudzających)"
    ],
    interpret(total) {
      let band, note;
      if (total <= 13) { band = "Wynik poniżej progu przesiewowego"; note = "Niskie prawdopodobieństwo spektrum dwubiegunowego wg tego narzędzia."; }
      else { band = "Wynik powyżej progu przesiewowego"; note = "14 lub więcej odpowiedzi „Tak” wskazuje na istotne prawdopodobieństwo spektrum zaburzeń dwubiegunowych — wynik ma charakter wyłącznie orientacyjny, wymaga konsultacji psychiatrycznej."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= MDQ
  mdq: {
    id: "mdq",
    name: "MDQ",
    fullName: "Kwestionariusz Zaburzeń Nastroju (Mood Disorder Questionnaire, MDQ)",
    description: "13-pozycyjny kwestionariusz przesiewowy w kierunku spektrum choroby dwubiegunowej.",
    category: "nastroj",
    keywords: ["choroba dwubiegunowa", "mania", "hipomania", "MDQ"],
    instructions: "Czy zdarzył się okres, gdy czułeś/aś się inny/a niż zwykle i…? Format tak/nie.",
    kind: "likert",
    options: TAK_NIE,
    maxScore: 13,
    items: [
      "Czułeś/aś się tak dobrze lub „nakręcony/a”, że inni uważali, iż to nie jesteś Ty, albo wpadłeś/aś w kłopoty przez taki stan?",
      "Byłeś/aś tak drażliwy/a, że krzyczałeś/aś na innych, zaczynałeś/aś kłótnie lub sprzeczki?",
      "Czułeś/aś się dużo pewniejszy/a siebie niż zwykle?",
      "Spałeś/aś dużo mniej niż zwykle, a mimo to nie odczuwałeś/aś zmęczenia?",
      "Mówiłeś/aś dużo więcej lub dużo szybciej niż zwykle?",
      "Miałeś/aś gonitwę myśli, których nie mogłeś/aś powstrzymać?",
      "Byłeś/aś tak łatwo rozpraszany/a przez bodźce z otoczenia, że trudno Ci było się skupić?",
      "Miałeś/aś dużo więcej energii niż zwykle?",
      "Byłeś/aś dużo bardziej aktywny/a i robiłeś/aś dużo więcej rzeczy niż zwykle?",
      "Byłeś/aś dużo bardziej towarzyski/a niż zwykle, np. dzwoniłeś/aś do znajomych w środku nocy?",
      "Byłeś/aś dużo bardziej zainteresowany/a seksem niż zwykle?",
      "Robiłeś/aś rzeczy niezwykłe dla Ciebie lub takie, które inni uznaliby za przesadne, pochopne lub ryzykowne?",
      "Wydawanie pieniędzy przysporzyło Tobie lub Twojej rodzinie kłopotów?"
    ],
    interpret(total) {
      let band, note;
      if (total <= 6) { band = "Wynik poniżej progu przesiewowego"; note = "Niskie prawdopodobieństwo spektrum dwubiegunowego."; }
      else { band = "Wynik powyżej progu przesiewowego"; note = "7 lub więcej odpowiedzi „Tak” to dodatni wynik przesiewowy. Pełne kryteria MDQ wymagają dodatkowo, by kilka objawów wystąpiło w tym samym okresie i spowodowało co najmniej umiarkowany problem w funkcjonowaniu — proszę dopytać o te dwa kryteria przed skierowaniem na konsultację psychiatryczną."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= Fagerström
  fagerstrom: {
    id: "fagerstrom",
    name: "FTND",
    fullName: "Test Uzależnienia od Nikotyny Fagerströma (FTND)",
    description: "6-pozycyjny test oceny nasilenia uzależnienia fizycznego od nikotyny.",
    category: "uzaleznienia",
    keywords: ["nikotyna", "papierosy", "palenie", "tytoń"],
    kind: "peritem",
    maxScore: 10,
    items: [
      { text: "Jak szybko po przebudzeniu wypala Pan/Pani pierwszego papierosa?", options: [
        { value: 3, label: "Do 5 minut" }, { value: 2, label: "6–30 minut" }, { value: 1, label: "31–60 minut" }, { value: 0, label: "Po 60 minutach" }
      ]},
      { text: "Czy ma Pan/Pani trudności z powstrzymaniem się od palenia w miejscach zabronionych (np. kościół, kino, biblioteka)?", options: [
        { value: 1, label: "Tak" }, { value: 0, label: "Nie" }
      ]},
      { text: "Z którego papierosa w ciągu dnia byłoby Panu/Pani najtrudniej zrezygnować?", options: [
        { value: 1, label: "Z porannego (pierwszego)" }, { value: 0, label: "Z każdego innego" }
      ]},
      { text: "Ile papierosów wypala Pan/Pani w ciągu dnia?", options: [
        { value: 0, label: "10 lub mniej" }, { value: 1, label: "11–20" }, { value: 2, label: "21–30" }, { value: 3, label: "31 lub więcej" }
      ]},
      { text: "Czy częściej pali Pan/Pani papierosy w ciągu pierwszych godzin po przebudzeniu niż w pozostałej części dnia?", options: [
        { value: 1, label: "Tak" }, { value: 0, label: "Nie" }
      ]},
      { text: "Czy pali Pan/Pani, nawet gdy jest Pan/Pani tak chory/a, że musi leżeć w łóżku?", options: [
        { value: 1, label: "Tak" }, { value: 0, label: "Nie" }
      ]}
    ],
    interpret(total) {
      let band, note;
      if (total <= 2) { band = "Bardzo niski poziom uzależnienia"; note = "Uzależnienie głównie o charakterze psychologicznym/nawykowym."; }
      else if (total <= 4) { band = "Niski poziom uzależnienia"; note = "Dobre rokowania na rzucenie palenia przy odpowiedniej motywacji."; }
      else if (total === 5) { band = "Średni poziom uzależnienia"; note = "Warto rozważyć wsparcie w rzucaniu palenia."; }
      else if (total <= 7) { band = "Wysoki poziom uzależnienia"; note = "Wskazane wsparcie farmakologiczne i psychoterapeutyczne."; }
      else { band = "Bardzo wysoki poziom uzależnienia"; note = "Silne uzależnienie fizyczne — wskazana konsultacja lekarska i terapia uzależnień."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= MAST
  mast: {
    id: "mast",
    name: "MAST-10",
    fullName: "Test Przesiewowy Uzależnienia od Alkoholu Michigan (MAST) — wersja skrócona",
    description: "10-pozycyjna, skrócona wersja testu MAST oceniająca prawdopodobieństwo uzależnienia od alkoholu.",
    category: "uzaleznienia",
    keywords: ["alkohol", "MAST", "uzależnienie od alkoholu"],
    instructions: "Format tak/nie, odnoszący się do całego dotychczasowego życia. Pozycje mają różną wagę punktową, zgodnie z oryginalnym kluczem Brief MAST (Pokorny i wsp., 1972).",
    kind: "peritem",
    maxScore: 26,
    items: [
      { text: "Czy uważasz, że pijesz tak jak większość ludzi (normalnie)?", options: [
        { value: 0, label: "Tak" }, { value: 2, label: "Nie" }
      ]},
      { text: "Czy bliscy lub przyjaciele kiedykolwiek wyrażali zaniepokojenie ilością wypijanego przez Ciebie alkoholu?", options: [
        { value: 2, label: "Tak" }, { value: 0, label: "Nie" }
      ]},
      { text: "Czy kiedykolwiek uczestniczyłeś/aś w spotkaniu Anonimowych Alkoholików?", options: [
        { value: 5, label: "Tak" }, { value: 0, label: "Nie" }
      ]},
      { text: "Czy z powodu picia straciłeś/aś bliski związek (partnera, przyjaciela, rodzinę)?", options: [
        { value: 2, label: "Tak" }, { value: 0, label: "Nie" }
      ]},
      { text: "Czy kiedykolwiek miałeś/aś problemy w pracy z powodu picia?", options: [
        { value: 2, label: "Tak" }, { value: 0, label: "Nie" }
      ]},
      { text: "Czy zdarzyło Ci się zaniedbywać obowiązki, rodzinę lub pracę z powodu picia przez 2 lub więcej dni z rzędu?", options: [
        { value: 2, label: "Tak" }, { value: 0, label: "Nie" }
      ]},
      { text: "Czy miewałeś/aś kiedykolwiek drżenie rąk, omamy (delirium tremens) po odstawieniu alkoholu?", options: [
        { value: 2, label: "Tak" }, { value: 0, label: "Nie" }
      ]},
      { text: "Czy kiedykolwiek szukałeś/aś pomocy z powodu swojego picia?", options: [
        { value: 2, label: "Tak" }, { value: 0, label: "Nie" }
      ]},
      { text: "Czy byłeś/aś kiedykolwiek hospitalizowany/a z powodu picia?", options: [
        { value: 5, label: "Tak" }, { value: 0, label: "Nie" }
      ]},
      { text: "Czy byłeś/aś kiedykolwiek zatrzymany/a lub ukarany/a za prowadzenie pojazdu pod wpływem alkoholu?", options: [
        { value: 2, label: "Tak" }, { value: 0, label: "Nie" }
      ]}
    ],
    interpret(total) {
      let band, note;
      if (total <= 5) { band = "Niskie prawdopodobieństwo uzależnienia"; note = "Wynik poniżej progu przesiewowego."; }
      else if (total <= 16) { band = "Prawdopodobny problem alkoholowy"; note = "Wynik ≥6 pkt sugeruje problem alkoholowy — wskazana dalsza diagnostyka specjalistyczna."; }
      else { band = "Wysokie prawdopodobieństwo uzależnienia od alkoholu"; note = "Wynik ≥17 pkt jest typowy dla osób uzależnionych od alkoholu — wskazana pilna konsultacja specjalistyczna."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= Hazard
  hazard: {
    id: "hazard",
    name: "Hazard-20",
    fullName: "Test Przesiewowy Uzależnienia od Hazardu (20 pytań, wg Anonimowych Hazardzistów)",
    description: "20-pozycyjny test samooceny w kierunku uzależnienia od hazardu.",
    category: "uzaleznienia",
    keywords: ["hazard", "gry hazardowe", "zakłady", "uzależnienie behawioralne"],
    instructions: "Format tak/nie.",
    kind: "likert",
    options: TAK_NIE,
    maxScore: 20,
    items: [
      "Czy kiedykolwiek traciłeś/aś czas przeznaczony na pracę lub naukę z powodu hazardu?",
      "Czy uprawianie hazardu powodowało, że Twoje życie rodzinne stawało się nieszczęśliwe?",
      "Czy hazard wpływał negatywnie na Twoją reputację?",
      "Czy kiedykolwiek odczuwałeś/aś wyrzuty sumienia po grze?",
      "Czy kiedykolwiek uprawiałeś/aś hazard, aby zdobyć pieniądze na spłatę długów lub rozwiązać trudności finansowe?",
      "Czy hazard powodował obniżenie Twoich ambicji lub skuteczności działania?",
      "Czy po przegranej czułeś/aś potrzebę jak najszybszego powrotu do gry, by odrobić straty?",
      "Czy po wygranej odczuwałeś/aś silną potrzebę powrotu do gry, aby wygrać więcej?",
      "Czy często grałeś/aś, dopóki nie przegrałeś/aś ostatniej złotówki?",
      "Czy kiedykolwiek brałeś/aś pożyczki, aby sfinansować hazard?",
      "Czy kiedykolwiek sprzedałeś/aś coś, aby sfinansować hazard?",
      "Czy niechętnie wykorzystywałeś/aś „pieniądze z hazardu” na zwykłe wydatki?",
      "Czy hazard powodował, że przestawałeś/aś dbać o dobro własne lub rodziny?",
      "Czy kiedykolwiek grałeś/aś dłużej, niż zaplanowałeś/aś?",
      "Czy kiedykolwiek grałeś/aś, aby uciec od zmartwień lub kłopotów?",
      "Czy kiedykolwiek popełniłeś/aś lub rozważałeś/aś popełnienie czynu niezgodnego z prawem, aby sfinansować hazard?",
      "Czy uprawianie hazardu powodowało u Ciebie problemy ze snem?",
      "Czy kłótnie, rozczarowania lub frustracje wywołują u Ciebie potrzebę gry?",
      "Czy kiedykolwiek chciałeś/aś uczcić szczęśliwe wydarzenie kilkugodzinną grą hazardową?",
      "Czy kiedykolwiek rozważałeś/aś autodestrukcję lub samobójstwo w związku ze swoim hazardem?"
    ],
    suicideItemIndex: 19,
    interpret(total) {
      let band, note;
      if (total <= 6) { band = "Niskie ryzyko"; note = "Wynik poniżej progu przesiewowego."; }
      else { band = "Wysokie ryzyko uzależnienia od hazardu"; note = "7 lub więcej odpowiedzi „Tak” wskazuje na wysokie ryzyko uzależnienia — wskazane skierowanie do terapeuty uzależnień."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= IIEF-5
  iief5: {
    id: "iief5",
    name: "IIEF-5",
    fullName: "Międzynarodowy Kwestionariusz Oceny Funkcji Erekcji (IIEF-5)",
    description: "5-pozycyjny kwestionariusz przesiewowy zaburzeń erekcji, dotyczący ostatnich 4 tygodni.",
    category: "seksualnosc",
    keywords: ["erekcja", "wzwód", "zdrowie seksualne mężczyzn", "dysfunkcje seksualne"],
    kind: "peritem",
    maxScore: 25,
    items: [
      { text: "Jak oceniasz swoją pewność co do zdolności osiągnięcia i utrzymania erekcji?", options: [
        { value: 1, label: "Bardzo niska" }, { value: 2, label: "Niska" }, { value: 3, label: "Umiarkowana" }, { value: 4, label: "Wysoka" }, { value: 5, label: "Bardzo wysoka" }
      ]},
      { text: "Gdy doszło do erekcji pod wpływem stymulacji seksualnej, jak często była wystarczająco twarda do penetracji?", options: [
        { value: 0, label: "Brak aktywności seksualnej" }, { value: 1, label: "Prawie nigdy / nigdy" }, { value: 2, label: "Rzadko (dużo mniej niż połowa razy)" }, { value: 3, label: "Czasami (około połowy razy)" }, { value: 4, label: "Zazwyczaj (dużo więcej niż połowa razy)" }, { value: 5, label: "Prawie zawsze / zawsze" }
      ]},
      { text: "Podczas stosunku, jak często udawało Ci się utrzymać erekcję po penetracji?", options: [
        { value: 0, label: "Nie podejmowałem/am próby stosunku" }, { value: 1, label: "Prawie nigdy / nigdy" }, { value: 2, label: "Rzadko" }, { value: 3, label: "Czasami" }, { value: 4, label: "Zazwyczaj" }, { value: 5, label: "Prawie zawsze / zawsze" }
      ]},
      { text: "Jak trudne było utrzymanie erekcji do zakończenia stosunku?", options: [
        { value: 0, label: "Nie podejmowałem/am próby stosunku" }, { value: 1, label: "Skrajnie trudne" }, { value: 2, label: "Bardzo trudne" }, { value: 3, label: "Trudne" }, { value: 4, label: "Nieco trudne" }, { value: 5, label: "Niezbyt trudne" }
      ]},
      { text: "Jeśli podejmowałeś/aś próbę stosunku, jak często był on satysfakcjonujący?", options: [
        { value: 0, label: "Nie podejmowałem/am próby stosunku" }, { value: 1, label: "Prawie nigdy / nigdy" }, { value: 2, label: "Rzadko" }, { value: 3, label: "Czasami" }, { value: 4, label: "Zazwyczaj" }, { value: 5, label: "Prawie zawsze / zawsze" }
      ]}
    ],
    interpret(total) {
      let band, note;
      if (total <= 7) { band = "Ciężkie zaburzenia erekcji"; }
      else if (total <= 11) { band = "Umiarkowane zaburzenia erekcji"; }
      else if (total <= 16) { band = "Łagodne do umiarkowanych zaburzenia erekcji"; }
      else if (total <= 21) { band = "Łagodne zaburzenia erekcji"; }
      else { band = "Brak zaburzeń erekcji"; }
      note = total <= 21
        ? "Wynik ≤21 pkt sugeruje możliwe zaburzenia erekcji — wskazana konsultacja lekarska (urolog / androlog / lekarz rodzinny)."
        : "Wynik w normie.";
      return { band, note, flag: null };
    }
  },

  // ============================================================= EPDS
  epds: {
    id: "epds",
    name: "EPDS",
    fullName: "Edynburska Skala Depresji Poporodowej (EPDS)",
    description: "10-pozycyjna skala przesiewowa depresji okołoporodowej, dotycząca ostatnich 7 dni.",
    category: "nastroj",
    keywords: ["depresja poporodowa", "połóg", "ciąża", "macierzyństwo", "baby blues"],
    kind: "peritem",
    maxScore: 30,
    suicideItemIndex: 9,
    items: [
      { text: "Byłam w stanie się śmiać i dostrzegać zabawne strony sytuacji.", options: [
        { value: 0, label: "Tak samo często jak zawsze" }, { value: 1, label: "Trochę rzadziej niż zwykle" }, { value: 2, label: "Zdecydowanie rzadziej niż zwykle" }, { value: 3, label: "Wcale" }
      ]},
      { text: "Z radością oczekiwałam różnych wydarzeń.", options: [
        { value: 0, label: "Tak samo jak zawsze" }, { value: 1, label: "Trochę rzadziej niż zwykle" }, { value: 2, label: "Zdecydowanie rzadziej niż zwykle" }, { value: 3, label: "Prawie wcale" }
      ]},
      { text: "Obwiniałam się bez potrzeby, gdy coś szło źle.", options: [
        { value: 3, label: "Tak, przez większość czasu" }, { value: 2, label: "Tak, czasami" }, { value: 1, label: "Rzadko" }, { value: 0, label: "Nigdy" }
      ]},
      { text: "Odczuwałam niepokój lub martwiłam się bez wyraźnego powodu.", options: [
        { value: 0, label: "Wcale" }, { value: 1, label: "Rzadko" }, { value: 2, label: "Czasami" }, { value: 3, label: "Bardzo często" }
      ]},
      { text: "Odczuwałam strach lub panikę bez wyraźnego powodu.", options: [
        { value: 3, label: "Tak, dość często" }, { value: 2, label: "Czasami" }, { value: 1, label: "Rzadko" }, { value: 0, label: "Nigdy" }
      ]},
      { text: "Nadmiar obowiązków mnie przytłaczał.", options: [
        { value: 3, label: "Tak, przez większość czasu sobie nie radziłam" }, { value: 2, label: "Czasami sobie nie radziłam" }, { value: 1, label: "Zwykle radziłam sobie dobrze" }, { value: 0, label: "Radziłam sobie tak dobrze jak zawsze" }
      ]},
      { text: "Byłam tak nieszczęśliwa, że miałam kłopoty ze snem.", options: [
        { value: 3, label: "Tak, przez większość czasu" }, { value: 2, label: "Czasami" }, { value: 1, label: "Rzadko" }, { value: 0, label: "Wcale" }
      ]},
      { text: "Czułam się smutna lub nieszczęśliwa.", options: [
        { value: 3, label: "Tak, przez większość czasu" }, { value: 2, label: "Dość często" }, { value: 1, label: "Rzadko" }, { value: 0, label: "Wcale" }
      ]},
      { text: "Byłam tak nieszczęśliwa, że płakałam.", options: [
        { value: 3, label: "Tak, przez większość czasu" }, { value: 2, label: "Dość często" }, { value: 1, label: "Tylko czasami" }, { value: 0, label: "Nigdy" }
      ]},
      { text: "Pojawiały się u mnie myśli o skrzywdzeniu siebie.", options: [
        { value: 3, label: "Tak, dość często" }, { value: 2, label: "Czasami" }, { value: 1, label: "Rzadko" }, { value: 0, label: "Nigdy" }
      ]}
    ],
    interpret(total) {
      let band, note;
      if (total <= 9) { band = "Niskie prawdopodobieństwo depresji poporodowej"; note = "Wynik w normie."; }
      else if (total <= 12) { band = "Wynik graniczny"; note = "Zalecana obserwacja i ponowna ocena."; }
      else { band = "Wysokie prawdopodobieństwo depresji poporodowej"; note = "Wynik ≥13 pkt — wskazana konsultacja specjalistyczna."; }
      return { band, note, flag: null };
    }
  },

  // ============================================================= FSFI
  fsfi: {
    id: "fsfi",
    name: "FSFI",
    fullName: "Wskaźnik Funkcjonowania Seksualnego Kobiet (FSFI) — kalkulator domenowy",
    description: "Narzędzie zastrzeżone (MAPI Research Trust) — kalkulator sumujący surowe wyniki 6 domen wprowadzone ręcznie z oryginalnego, licencjonowanego arkusza (19 pozycji).",
    category: "seksualnosc",
    keywords: ["funkcje seksualne kobiet", "libido", "FSFI", "zdrowie seksualne kobiet"],
    kind: "domain-manual",
    maxScore: 36,
    manualNote: "Wprowadź surową sumę punktów uzyskaną w każdej domenie na podstawie oryginalnego, licencjonowanego arkusza FSFI (pozycje w skali 0–5 lub 1–5). Aplikacja pomnoży sumy przez odpowiednie współczynniki.",
    domains: [
      { key: "desire", label: "Pożądanie (poz. 1–2)", itemMin: 1, itemMax: 5, coefficient: 0.6 },
      { key: "arousal", label: "Podniecenie (poz. 3–6)", itemMin: 0, itemMax: 5, coefficient: 0.3 },
      { key: "lubrication", label: "Nawilżenie (poz. 7–10)", itemMin: 0, itemMax: 5, coefficient: 0.3 },
      { key: "orgasm", label: "Orgazm (poz. 11–13)", itemMin: 0, itemMax: 5, coefficient: 0.4 },
      { key: "satisfaction", label: "Satysfakcja (poz. 14–16)", itemMin: 0, itemMax: 5, coefficient: 0.4 },
      { key: "pain", label: "Ból / dyskomfort (poz. 17–19)", itemMin: 0, itemMax: 5, coefficient: 0.4 }
    ],
    interpret(total) {
      let band, note;
      if (total <= 26.55) { band = "Wynik wskazujący na możliwą dysfunkcję seksualną"; note = "Wynik ≤26,55 pkt jest powszechnie przyjmowanym progiem sugerującym klinicznie istotną dysfunkcję seksualną — wskazana dalsza ocena."; }
      else { band = "Wynik w normie"; note = "Wynik powyżej przyjętego progu klinicznego."; }
      return { band, note, flag: null };
    }
  }

};
