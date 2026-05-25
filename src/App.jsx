import { useState, useEffect, useRef, useCallback } from "react";
import { loadProgress, saveProgress } from "./lib/progressStorage";

// ================================================================
// COUNTRY DATA — all ~104 GeoGuessr countries
// ================================================================
const COUNTRIES = [
  // Africa
  { en: "Botswana", pl: "Botswana", tld: "bw", flag: "🇧🇼", region: "Africa" },
  { en: "Egypt", pl: "Egipt", tld: "eg", flag: "🇪🇬", region: "Africa" },
  { en: "Eswatini", pl: "Eswatini", tld: "sz", flag: "🇸🇿", region: "Africa" },
  { en: "Ghana", pl: "Ghana", tld: "gh", flag: "🇬🇭", region: "Africa" },
  { en: "Kenya", pl: "Kenia", tld: "ke", flag: "🇰🇪", region: "Africa" },
  { en: "Lesotho", pl: "Lesotho", tld: "ls", flag: "🇱🇸", region: "Africa" },
  { en: "Madagascar", pl: "Madagaskar", tld: "mg", flag: "🇲🇬", region: "Africa" },
  { en: "Mali", pl: "Mali", tld: "ml", flag: "🇲🇱", region: "Africa" },
  { en: "Morocco", pl: "Maroko", tld: "ma", flag: "🇲🇦", region: "Africa" },
  { en: "Nigeria", pl: "Nigeria", tld: "ng", flag: "🇳🇬", region: "Africa" },
  { en: "Rwanda", pl: "Rwanda", tld: "rw", flag: "🇷🇼", region: "Africa" },
  { en: "Senegal", pl: "Senegal", tld: "sn", flag: "🇸🇳", region: "Africa" },
  { en: "South Africa", pl: "Republika Południowej Afryki", tld: "za", flag: "🇿🇦", region: "Africa" },
  { en: "Tanzania", pl: "Tanzania", tld: "tz", flag: "🇹🇿", region: "Africa" },
  { en: "Tunisia", pl: "Tunezja", tld: "tn", flag: "🇹🇳", region: "Africa" },
  { en: "Uganda", pl: "Uganda", tld: "ug", flag: "🇺🇬", region: "Africa" },
  // Asia
  { en: "Bangladesh", pl: "Bangladesz", tld: "bd", flag: "🇧🇩", region: "Asia" },
  { en: "Bhutan", pl: "Bhutan", tld: "bt", flag: "🇧🇹", region: "Asia" },
  { en: "Cambodia", pl: "Kambodża", tld: "kh", flag: "🇰🇭", region: "Asia" },
  { en: "China", pl: "Chiny", tld: "cn", flag: "🇨🇳", region: "Asia" },
  { en: "India", pl: "Indie", tld: "in", flag: "🇮🇳", region: "Asia" },
  { en: "Indonesia", pl: "Indonezja", tld: "id", flag: "🇮🇩", region: "Asia" },
  { en: "Israel", pl: "Izrael", tld: "il", flag: "🇮🇱", region: "Asia" },
  { en: "Japan", pl: "Japonia", tld: "jp", flag: "🇯🇵", region: "Asia" },
  { en: "Jordan", pl: "Jordania", tld: "jo", flag: "🇯🇴", region: "Asia" },
  { en: "Kazakhstan", pl: "Kazachstan", tld: "kz", flag: "🇰🇿", region: "Asia" },
  { en: "Kyrgyzstan", pl: "Kirgistan", tld: "kg", flag: "🇰🇬", region: "Asia" },
  { en: "Laos", pl: "Laos", tld: "la", flag: "🇱🇦", region: "Asia" },
  { en: "Malaysia", pl: "Malezja", tld: "my", flag: "🇲🇾", region: "Asia" },
  { en: "Mongolia", pl: "Mongolia", tld: "mn", flag: "🇲🇳", region: "Asia" },
  { en: "Nepal", pl: "Nepal", tld: "np", flag: "🇳🇵", region: "Asia" },
  { en: "Pakistan", pl: "Pakistan", tld: "pk", flag: "🇵🇰", region: "Asia" },
  { en: "Philippines", pl: "Filipiny", tld: "ph", flag: "🇵🇭", region: "Asia" },
  { en: "Singapore", pl: "Singapur", tld: "sg", flag: "🇸🇬", region: "Asia" },
  { en: "South Korea", pl: "Korea Południowa", tld: "kr", flag: "🇰🇷", region: "Asia" },
  { en: "Sri Lanka", pl: "Sri Lanka", tld: "lk", flag: "🇱🇰", region: "Asia" },
  { en: "Taiwan", pl: "Tajwan", tld: "tw", flag: "🇹🇼", region: "Asia" },
  { en: "Thailand", pl: "Tajlandia", tld: "th", flag: "🇹🇭", region: "Asia" },
  { en: "Turkey", pl: "Turcja", tld: "tr", flag: "🇹🇷", region: "Asia" },
  { en: "United Arab Emirates", pl: "Zjednoczone Emiraty Arabskie", tld: "ae", flag: "🇦🇪", region: "Asia" },
  { en: "Uzbekistan", pl: "Uzbekistan", tld: "uz", flag: "🇺🇿", region: "Asia" },
  { en: "Vietnam", pl: "Wietnam", tld: "vn", flag: "🇻🇳", region: "Asia" },
  // Europe
  { en: "Albania", pl: "Albania", tld: "al", flag: "🇦🇱", region: "Europe" },
  { en: "Andorra", pl: "Andora", tld: "ad", flag: "🇦🇩", region: "Europe" },
  { en: "Austria", pl: "Austria", tld: "at", flag: "🇦🇹", region: "Europe" },
  { en: "Belarus", pl: "Białoruś", tld: "by", flag: "🇧🇾", region: "Europe" },
  { en: "Belgium", pl: "Belgia", tld: "be", flag: "🇧🇪", region: "Europe" },
  { en: "Bosnia and Herzegovina", pl: "Bośnia i Hercegowina", tld: "ba", flag: "🇧🇦", region: "Europe" },
  { en: "Bulgaria", pl: "Bułgaria", tld: "bg", flag: "🇧🇬", region: "Europe" },
  { en: "Croatia", pl: "Chorwacja", tld: "hr", flag: "🇭🇷", region: "Europe" },
  { en: "Czech Republic", pl: "Czechy", tld: "cz", flag: "🇨🇿", region: "Europe" },
  { en: "Denmark", pl: "Dania", tld: "dk", flag: "🇩🇰", region: "Europe" },
  { en: "Estonia", pl: "Estonia", tld: "ee", flag: "🇪🇪", region: "Europe" },
  { en: "Faroe Islands", pl: "Wyspy Owcze", tld: "fo", flag: "🇫🇴", region: "Europe" },
  { en: "Finland", pl: "Finlandia", tld: "fi", flag: "🇫🇮", region: "Europe" },
  { en: "France", pl: "Francja", tld: "fr", flag: "🇫🇷", region: "Europe" },
  { en: "Germany", pl: "Niemcy", tld: "de", flag: "🇩🇪", region: "Europe" },
  { en: "Greece", pl: "Grecja", tld: "gr", flag: "🇬🇷", region: "Europe" },
  { en: "Hungary", pl: "Węgry", tld: "hu", flag: "🇭🇺", region: "Europe" },
  { en: "Iceland", pl: "Islandia", tld: "is", flag: "🇮🇸", region: "Europe" },
  { en: "Ireland", pl: "Irlandia", tld: "ie", flag: "🇮🇪", region: "Europe" },
  { en: "Italy", pl: "Włochy", tld: "it", flag: "🇮🇹", region: "Europe" },
  { en: "Kosovo", pl: "Kosowo", tld: "xk", flag: "🇽🇰", region: "Europe" },
  { en: "Latvia", pl: "Łotwa", tld: "lv", flag: "🇱🇻", region: "Europe" },
  { en: "Lithuania", pl: "Litwa", tld: "lt", flag: "🇱🇹", region: "Europe" },
  { en: "Luxembourg", pl: "Luksemburg", tld: "lu", flag: "🇱🇺", region: "Europe" },
  { en: "Malta", pl: "Malta", tld: "mt", flag: "🇲🇹", region: "Europe" },
  { en: "Moldova", pl: "Mołdawia", tld: "md", flag: "🇲🇩", region: "Europe" },
  { en: "Montenegro", pl: "Czarnogóra", tld: "me", flag: "🇲🇪", region: "Europe" },
  { en: "Netherlands", pl: "Holandia", tld: "nl", flag: "🇳🇱", region: "Europe" },
  { en: "North Macedonia", pl: "Macedonia Północna", tld: "mk", flag: "🇲🇰", region: "Europe" },
  { en: "Norway", pl: "Norwegia", tld: "no", flag: "🇳🇴", region: "Europe" },
  { en: "Poland", pl: "Polska", tld: "pl", flag: "🇵🇱", region: "Europe" },
  { en: "Portugal", pl: "Portugalia", tld: "pt", flag: "🇵🇹", region: "Europe" },
  { en: "Romania", pl: "Rumunia", tld: "ro", flag: "🇷🇴", region: "Europe" },
  { en: "Russia", pl: "Rosja", tld: "ru", flag: "🇷🇺", region: "Europe" },
  { en: "Serbia", pl: "Serbia", tld: "rs", flag: "🇷🇸", region: "Europe" },
  { en: "Slovakia", pl: "Słowacja", tld: "sk", flag: "🇸🇰", region: "Europe" },
  { en: "Slovenia", pl: "Słowenia", tld: "si", flag: "🇸🇮", region: "Europe" },
  { en: "Spain", pl: "Hiszpania", tld: "es", flag: "🇪🇸", region: "Europe" },
  { en: "Sweden", pl: "Szwecja", tld: "se", flag: "🇸🇪", region: "Europe" },
  { en: "Switzerland", pl: "Szwajcaria", tld: "ch", flag: "🇨🇭", region: "Europe" },
  { en: "Ukraine", pl: "Ukraina", tld: "ua", flag: "🇺🇦", region: "Europe" },
  { en: "United Kingdom", pl: "Wielka Brytania", tld: "uk", flag: "🇬🇧", region: "Europe" },
  // Americas
  { en: "Argentina", pl: "Argentyna", tld: "ar", flag: "🇦🇷", region: "Americas" },
  { en: "Bolivia", pl: "Boliwia", tld: "bo", flag: "🇧🇴", region: "Americas" },
  { en: "Brazil", pl: "Brazylia", tld: "br", flag: "🇧🇷", region: "Americas" },
  { en: "Canada", pl: "Kanada", tld: "ca", flag: "🇨🇦", region: "Americas" },
  { en: "Chile", pl: "Chile", tld: "cl", flag: "🇨🇱", region: "Americas" },
  { en: "Colombia", pl: "Kolumbia", tld: "co", flag: "🇨🇴", region: "Americas" },
  { en: "Costa Rica", pl: "Kostaryka", tld: "cr", flag: "🇨🇷", region: "Americas" },
  { en: "Dominican Republic", pl: "Dominikana", tld: "do", flag: "🇩🇴", region: "Americas" },
  { en: "Ecuador", pl: "Ekwador", tld: "ec", flag: "🇪🇨", region: "Americas" },
  { en: "El Salvador", pl: "Salwador", tld: "sv", flag: "🇸🇻", region: "Americas" },
  { en: "Guatemala", pl: "Gwatemala", tld: "gt", flag: "🇬🇹", region: "Americas" },
  { en: "Honduras", pl: "Honduras", tld: "hn", flag: "🇭🇳", region: "Americas" },
  { en: "Mexico", pl: "Meksyk", tld: "mx", flag: "🇲🇽", region: "Americas" },
  { en: "Nicaragua", pl: "Nikaragua", tld: "ni", flag: "🇳🇮", region: "Americas" },
  { en: "Panama", pl: "Panama", tld: "pa", flag: "🇵🇦", region: "Americas" },
  { en: "Paraguay", pl: "Paragwaj", tld: "py", flag: "🇵🇾", region: "Americas" },
  { en: "Peru", pl: "Peru", tld: "pe", flag: "🇵🇪", region: "Americas" },
  { en: "United States", pl: "Stany Zjednoczone", tld: "us", flag: "🇺🇸", region: "Americas" },
  { en: "Uruguay", pl: "Urugwaj", tld: "uy", flag: "🇺🇾", region: "Americas" },
  // Oceania
  { en: "Australia", pl: "Australia", tld: "au", flag: "🇦🇺", region: "Oceania" },
  { en: "New Zealand", pl: "Nowa Zelandia", tld: "nz", flag: "🇳🇿", region: "Oceania" },
];

// extra accepted answers per TLD
const ALIASES = {
  za: ["rpa", "rsa", "poludniowa afryka", "poludniowa afryki", "republika poludniowej afryki"],
  cz: ["czechia", "czech republic", "republika czeska", "czeska republika"],
  ae: ["uae", "emirates", "emiraty", "zea", "united arab emirates", "emiraty arabskie"],
  us: ["usa", "america", "ameryka", "stany"],
  gb: ["great britain", "england", "anglia", "uk", "wielka brytania"],
  uk: ["great britain", "england", "anglia", "gb", "wielka brytania", "united kingdom"],
  kr: ["korea", "korea poludniowa", "hanguk"],
  ba: ["bosnia", "bosna", "bih", "bosnia hercegowina"],
  mk: ["macedonia", "makedonia"],
  do: ["dominicana", "dominican rep"],
  kh: ["cambodia", "kampucza"],
};

// ================================================================
// SM-2 ALGORITHM
// ================================================================
function sm2Update(card, quality) {
  let { interval = 1, repetitions = 0, easeFactor = 2.5 } = card;
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  }
  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  return {
    ...card,
    interval,
    repetitions,
    easeFactor,
    nextReview: Date.now() + interval * 86400000,
  };
}

function createCard(tld) {
  return { tld, interval: 1, repetitions: 0, easeFactor: 2.5, nextReview: 0, totalReviews: 0, correctReviews: 0 };
}

// ================================================================
// ANSWER VALIDATION
// ================================================================
function norm(str) {
  return str.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function checkName(input, country) {
  if (!input.trim()) return false;
  const n = norm(input);
  const accepted = new Set([norm(country.en), norm(country.pl), ...(ALIASES[country.tld] || []).map(norm)]);
  return accepted.has(n);
}

function checkTld(input, country) {
  const n = norm(input).replace(/^\./, "");
  return n === country.tld;
}

// ================================================================
// HELPERS
// ================================================================
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function today() { return new Date().toDateString(); }
function yesterday() { return new Date(Date.now() - 86400000).toDateString(); }

const REGIONS = ["All", "Africa", "Asia", "Europe", "Americas", "Oceania"];
const REGION_FLAGS = { All: "🌍", Africa: "🌍", Asia: "🌏", Europe: "🌎", Americas: "🌎", Oceania: "🌊" };
const MODES = [
  { id: "flag",  icon: "🚩", label: "Flagi",   desc: "Widzisz flagę → wpisujesz nazwę kraju" },
  { id: "tld",   icon: "🌐", label: "Domeny",  desc: "Widzisz sufiks (.xx) → wpisujesz nazwę kraju" },
  { id: "mixed", icon: "🎯", label: "Flaga z domeną", desc: "Widzisz flagę i sufiks — wpisujesz nazwę kraju. Sufiks pomaga w rozpoznaniu flagi." },
];

// ================================================================
// MAIN APP
// ================================================================
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [cards, setCards] = useState({});
  const DEFAULT_STATS = { streak: 0, lastStudy: null, totalSessions: 0, totalCorrect: 0, totalReviewed: 0 };
  const [gstats, setGstats] = useState(DEFAULT_STATS);
  const [mode, setMode] = useState("flag");
  const [region, setRegion] = useState("All");
  const [session, setSession] = useState([]);
  const [idx, setIdx] = useState(0);
  const [ans1, setAns1] = useState("");
  const [fb, setFb] = useState(null); // feedback
  const [sessStats, setSessStats] = useState({ correct: 0, total: 0 });
  const [tab, setTab] = useState("home"); // home | stats
  const ref1 = useRef();
  const cardsRef = useRef({});
  const statsRef = useRef(DEFAULT_STATS);

  // Load
  useEffect(() => {
    (async () => {
      const progress = await loadProgress();
      const loadedCards = progress?.cards || {};
      const loadedStats = progress?.stats || DEFAULT_STATS;

      cardsRef.current = loadedCards;
      statsRef.current = loadedStats;
      setCards(loadedCards);
      setGstats(loadedStats);
      setScreen("home");
    })();
  }, []);

  const persistCards = useCallback((nextCards) => {
    cardsRef.current = nextCards;
    setCards(nextCards);
    void saveProgress({ cards: nextCards, stats: statsRef.current });
  }, []);

  const persistStats = useCallback((nextStats) => {
    statsRef.current = nextStats;
    setGstats(nextStats);
    void saveProgress({ cards: cardsRef.current, stats: nextStats });
  }, []);

  function cardKey(tld) { return `${tld}-${mode}`; }
  function getCard(tld) { return cards[cardKey(tld)] || createCard(tld); }

  function dueList() {
    const now = Date.now();
    return COUNTRIES.filter(c => {
      if (region !== "All" && c.region !== region) return false;
      return getCard(c.tld).nextReview <= now;
    });
  }

  function masteredCount() {
    return COUNTRIES.filter(c => getCard(c.tld).repetitions >= 3).length;
  }

  function accuracyPct() {
    const total = Object.values(cards).reduce((a, c) => a + (c.totalReviews || 0), 0);
    const correct = Object.values(cards).reduce((a, c) => a + (c.correctReviews || 0), 0);
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }

  function startSession() {
    const due = shuffle(dueList()).slice(0, 20);
    if (!due.length) return;
    setSession(due);
    setIdx(0);
    setAns1("");
    setFb(null);
    setSessStats({ correct: 0, total: 0 });
    setScreen("study");
    setTimeout(() => ref1.current?.focus(), 100);
  }

  function submitAnswer() {
    if (fb) {
      if (idx + 1 >= session.length) {
        // session end — update streak
        const t = today(), y = yesterday();
        const newStreak = gstats.lastStudy === y ? gstats.streak + 1
          : gstats.lastStudy === t ? gstats.streak : 1;
        persistStats({
          ...gstats, streak: newStreak, lastStudy: t,
          totalSessions: (gstats.totalSessions || 0) + 1,
          totalCorrect: (gstats.totalCorrect || 0) + sessStats.correct,
          totalReviewed: (gstats.totalReviewed || 0) + sessStats.total,
        });
        setScreen("result");
      } else {
        setIdx(i => i + 1);
        setAns1("");
        setFb(null);
        setTimeout(() => ref1.current?.focus(), 50);
      }
      return;
    }

    const country = session[idx];
    const nameOk = checkName(ans1, country);
    const correct = nameOk;

    const quality = correct ? 4 : 1;
    const card = getCard(country.tld);
    const updated = sm2Update({
      ...card,
      totalReviews: (card.totalReviews || 0) + 1,
      correctReviews: (card.correctReviews || 0) + (correct ? 1 : 0),
    }, quality);
    persistCards({ ...cardsRef.current, [cardKey(country.tld)]: updated });
    setSessStats(p => ({ correct: p.correct + (correct ? 1 : 0), total: p.total + 1 }));
    setFb({ correct, country, nameOk });
  }

  function onKey1(e) {
    if (e.key === "Enter") submitAnswer();
  }

  const due = dueList();
  const country = session[idx];

  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────
  if (screen === "loading") return (
    <div style={S.root}>
      <div style={{ color: "#e2e8f0", fontSize: 18, letterSpacing: 4 }}>ŁADOWANIE…</div>
    </div>
  );

  // ─────────────────────────────────────────────
  // STUDY SCREEN
  // ─────────────────────────────────────────────
  if (screen === "study") {
    const pct = Math.round(((idx + (fb ? 1 : 0)) / session.length) * 100);
    const cardData = getCard(country.tld);
    const acc = cardData.totalReviews > 0
      ? Math.round((cardData.correctReviews / cardData.totalReviews) * 100) : null;

    return (
      <div style={S.root}>
        <div style={S.studyWrap}>
          {/* Header bar */}
          <div style={S.studyHeader}>
            <button style={S.backBtn} onClick={() => setScreen("home")}>← Wyjdź</button>
            <div style={S.modeTag}>{MODES.find(m => m.id === mode).icon} {MODES.find(m => m.id === mode).label}</div>
            <div style={S.counter}>{idx + 1} / {session.length}</div>
          </div>

          {/* Progress bar */}
          <div style={S.progressTrack}>
            <div style={{ ...S.progressFill, width: `${pct}%` }} />
          </div>

          {/* Card */}
          <div style={{ ...S.card, borderColor: fb ? (fb.correct ? "#22c55e" : "#ef4444") : "#334155" }}>
            {/* Prompt */}
            <div style={S.promptArea}>
              {(mode === "flag" || mode === "mixed") && (
                <div style={S.flagEmoji}>{country.flag}</div>
              )}
              {(mode === "tld" || mode === "mixed") && (
                <div style={S.tldDisplay}>
                  <span style={S.dot}>.</span>{country.tld}
                </div>
              )}
            </div>

            {/* Accuracy chip */}
            {acc !== null && (
              <div style={S.accChip}>Twoja skuteczność: {acc}%</div>
            )}

            {/* Inputs */}
            <div style={S.inputsWrap}>
              <div style={S.inputGroup}>
                <label style={S.inputLabel}>Nazwa kraju (PL lub EN)</label>
                <input
                  ref={ref1}
                  style={{
                    ...S.input,
                    borderColor: fb ? (fb.nameOk !== false ? (mode !== "mixed" ? (fb.correct ? "#22c55e" : "#ef4444") : (fb.nameOk ? "#22c55e" : "#ef4444")) : "#ef4444") : "#475569",
                    background: fb ? (fb.nameOk !== false ? (mode !== "mixed" ? (fb.correct ? "#052e16" : "#2d0707") : (fb.nameOk ? "#052e16" : "#2d0707")) : "#2d0707") : "#0f172a",
                  }}
                  value={ans1}
                  onChange={e => !fb && setAns1(e.target.value)}
                  onKeyDown={onKey1}
                  placeholder="np. Polska, Poland..."
                  autoComplete="off"
                  spellCheck={false}
                  readOnly={!!fb}
                />
              </div>
            </div>

            {/* Feedback */}
            {fb && (
              <div style={{ ...S.feedback, background: fb.correct ? "#052e16" : "#2d0707", borderColor: fb.correct ? "#22c55e" : "#ef4444" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{fb.correct ? "✅ Dobrze!" : "❌ Błąd"}</div>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>
                  <span style={{ color: "#e2e8f0" }}>{country.flag} {country.en}</span>
                  {" · "}<span style={{ color: "#7dd3fc" }}>PL: {country.pl}</span>
                  {" · "}<span style={{ color: "#fbbf24" }}>.{country.tld}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
                  {fb.correct
                    ? `Następna powtórka za ${getCard(country.tld).interval} dni`
                    : "Karta wróci dziś ponownie"}
                </div>
              </div>
            )}

            {/* Button */}
            <button
              style={{ ...S.submitBtn, background: fb ? "#1e40af" : "#2563eb" }}
              onClick={submitAnswer}
            >
              {fb ? (idx + 1 < session.length ? "Następna →" : "Zakończ sesję ✓") : "Sprawdź"}
            </button>
          </div>

          {/* Session mini-stats */}
          <div style={S.miniStats}>
            <span style={{ color: "#22c55e" }}>✓ {sessStats.correct}</span>
            <span style={{ color: "#64748b" }}> / </span>
            <span style={{ color: "#ef4444" }}>✗ {sessStats.total - sessStats.correct}</span>
            <span style={{ color: "#64748b" }}> z {sessStats.total}</span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // RESULT SCREEN
  // ─────────────────────────────────────────────
  if (screen === "result") {
    const pct = sessStats.total > 0 ? Math.round((sessStats.correct / sessStats.total) * 100) : 0;
    const medal = pct === 100 ? "🏆" : pct >= 80 ? "🥇" : pct >= 60 ? "🥈" : "🥉";
    return (
      <div style={S.root}>
        <div style={S.resultWrap}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>{medal}</div>
          <div style={{ color: "#e2e8f0", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
            Sesja ukończona!
          </div>
          <div style={{ color: "#94a3b8", marginBottom: 24, fontSize: 14 }}>
            Seria dni: 🔥 {gstats.streak}
          </div>
          <div style={S.resultGrid}>
            <div style={S.resultCell}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#22c55e" }}>{sessStats.correct}</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>POPRAWNE</div>
            </div>
            <div style={S.resultCell}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#ef4444" }}>{sessStats.total - sessStats.correct}</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>BŁĘDY</div>
            </div>
            <div style={S.resultCell}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#7dd3fc" }}>{pct}%</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>SKUTECZNOŚĆ</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button style={{ ...S.submitBtn, flex: 1 }} onClick={() => { setScreen("home"); }}>
              ← Powrót
            </button>
            <button style={{ ...S.submitBtn, flex: 1, background: "#16a34a" }} onClick={startSession}>
              Ćwicz dalej
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // HOME / STATS SCREEN
  // ─────────────────────────────────────────────
  const dueCount = due.length;
  const mastered = masteredCount();
  const totalInFilter = COUNTRIES.filter(c => region === "All" || c.region === region).length;

  return (
    <div style={S.root}>
      <div style={S.homeWrap}>
        {/* Title */}
        <div style={S.titleArea}>
          <div style={S.logo}>🗺️</div>
          <div style={S.title}>GeoGuessr</div>
          <div style={S.subtitle}>NAUKA FLAG I DOMEN</div>
        </div>

        {/* Tabs */}
        <div style={S.tabs}>
          {["home", "stats"].map(t => (
            <button key={t} style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }} onClick={() => setTab(t)}>
              {t === "home" ? "🎓 Nauka" : "📊 Statystyki"}
            </button>
          ))}
        </div>

        {tab === "home" ? (
          <>
            {/* Mode selector */}
            <div style={S.section}>
              <div style={S.sectionTitle}>TRYB NAUKI</div>
              <div style={S.modeGrid}>
                {MODES.map(m => (
                  <button
                    key={m.id}
                    style={{ ...S.modeBtn, ...(mode === m.id ? S.modeBtnActive : {}) }}
                    onClick={() => setMode(m.id)}
                  >
                    <div style={{ fontSize: 24 }}>{m.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0" }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Region filter */}
            <div style={S.section}>
              <div style={S.sectionTitle}>REGION</div>
              <div style={S.regionGrid}>
                {REGIONS.map(r => (
                  <button
                    key={r}
                    style={{ ...S.regionBtn, ...(region === r ? S.regionBtnActive : {}) }}
                    onClick={() => setRegion(r)}
                  >
                    {REGION_FLAGS[r]} {r === "All" ? "Wszystkie" : r}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats strip */}
            <div style={S.statsStrip}>
              <div style={S.statPill}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fbbf24" }}>🔥 {gstats.streak}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>SERIA DNI</div>
              </div>
              <div style={S.statPill}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#f97316" }}>{dueCount}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>DO POWTÓRKI</div>
              </div>
              <div style={S.statPill}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e" }}>{mastered}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>OPANOWANE</div>
              </div>
              <div style={S.statPill}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#7dd3fc" }}>{accuracyPct()}%</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>SKUTECZNOŚĆ</div>
              </div>
            </div>

            {/* Start button */}
            <button
              style={{
                ...S.startBtn,
                opacity: dueCount === 0 ? 0.4 : 1,
                cursor: dueCount === 0 ? "default" : "pointer",
              }}
              onClick={startSession}
              disabled={dueCount === 0}
            >
              {dueCount === 0
                ? "✅ Wszystko powtórzone na dziś!"
                : `Ucz się (${Math.min(dueCount, 20)} kart)`}
            </button>

            {dueCount === 0 && (
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 8, textAlign: "center" }}>
                Wróć jutro po nowe powtórki 🎉
              </div>
            )}
          </>
        ) : (
          // STATS TAB
          <StatsTab cards={cards} mode={mode} gstats={gstats} />
        )}
      </div>
    </div>
  );
}

// ================================================================
// STATS TAB
// ================================================================
function StatsTab({ cards, mode, gstats }) {
  const rows = COUNTRIES.map(c => {
    const card = cards[`${c.tld}-${mode}`] || createCard(c.tld);
    const acc = card.totalReviews > 0 ? Math.round((card.correctReviews / card.totalReviews) * 100) : null;
    const daysUntil = card.nextReview > Date.now()
      ? Math.ceil((card.nextReview - Date.now()) / 86400000) : 0;
    return { ...c, card, acc, daysUntil };
  }).sort((a, b) => (a.acc ?? 101) - (b.acc ?? 101)); // worst first

  const reviewed = rows.filter(r => r.card.totalReviews > 0);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ ...S.statsStrip, marginBottom: 16 }}>
        <div style={S.statPill}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>{gstats.totalSessions || 0}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>SESJI</div>
        </div>
        <div style={S.statPill}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>{gstats.totalReviewed || 0}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>POWTÓRZEŃ</div>
        </div>
        <div style={S.statPill}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>{reviewed.length}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>KRAJÓW</div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8, textAlign: "center" }}>
        Tryb: {MODES.find(m => m.id === mode)?.label} · kraje posortowane od najtrudniejszych
      </div>

      <div style={{ maxHeight: 400, overflowY: "auto", borderRadius: 8, border: "1px solid #1e293b" }}>
        {rows.map((r, i) => (
          <div key={r.tld} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
            background: i % 2 === 0 ? "#0f172a" : "#0d1526",
            borderBottom: "1px solid #1e293b",
          }}>
            <span style={{ fontSize: 22 }}>{r.flag}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#e2e8f0", fontSize: 13 }}>{r.en}</div>
              <div style={{ color: "#475569", fontSize: 11 }}>PL: {r.pl} · .{r.tld}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              {r.acc !== null ? (
                <div style={{ fontWeight: 700, fontSize: 14, color: r.acc >= 80 ? "#22c55e" : r.acc >= 50 ? "#fbbf24" : "#ef4444" }}>
                  {r.acc}%
                </div>
              ) : (
                <div style={{ color: "#334155", fontSize: 12 }}>nowe</div>
              )}
              {r.daysUntil > 0 && (
                <div style={{ color: "#475569", fontSize: 10 }}>za {r.daysUntil}d</div>
              )}
              {r.daysUntil === 0 && r.card.totalReviews > 0 && (
                <div style={{ color: "#f97316", fontSize: 10 }}>dziś</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================================================================
// STYLES
// ================================================================
const S = {
  root: {
    minHeight: "100vh", background: "#060d1a",
    display: "flex", alignItems: "flex-start", justifyContent: "center",
    padding: "16px 8px", fontFamily: "'Segoe UI', system-ui, sans-serif",
    backgroundImage: "radial-gradient(ellipse at 20% 20%, #0c1a2e 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, #0a1628 0%, transparent 60%)",
  },
  homeWrap: {
    width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
  },
  studyWrap: {
    width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 12,
  },
  resultWrap: {
    maxWidth: 360, width: "100%", display: "flex", flexDirection: "column",
    alignItems: "center", padding: 32, marginTop: 40,
  },
  titleArea: { textAlign: "center", marginBottom: 4 },
  logo: { fontSize: 48, lineHeight: 1.2 },
  title: { fontSize: 28, fontWeight: 800, color: "#e2e8f0", letterSpacing: 2, lineHeight: 1.1 },
  subtitle: { fontSize: 11, color: "#334155", letterSpacing: 4, marginTop: 4 },
  tabs: { display: "flex", gap: 8, width: "100%" },
  tab: {
    flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #1e293b",
    background: "#0f172a", color: "#64748b", fontSize: 13, cursor: "pointer", fontWeight: 600,
  },
  tabActive: { background: "#1e293b", color: "#e2e8f0", borderColor: "#334155" },
  section: { width: "100%", background: "#0f172a", borderRadius: 12, padding: 16, border: "1px solid #1e293b" },
  sectionTitle: { fontSize: 10, color: "#334155", letterSpacing: 3, marginBottom: 12, fontWeight: 700 },
  modeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
  modeBtn: {
    padding: "12px 8px", borderRadius: 10, border: "2px solid #1e293b",
    background: "#0d1526", cursor: "pointer", textAlign: "center", lineHeight: 1.4,
    transition: "all 0.15s",
  },
  modeBtnActive: { borderColor: "#2563eb", background: "#1e3a5f" },
  regionGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  regionBtn: {
    padding: "6px 12px", borderRadius: 20, border: "1px solid #1e293b",
    background: "#0d1526", color: "#94a3b8", fontSize: 12, cursor: "pointer",
  },
  regionBtnActive: { background: "#1e3a5f", borderColor: "#2563eb", color: "#7dd3fc" },
  statsStrip: { display: "flex", gap: 8, width: "100%", justifyContent: "space-between" },
  statPill: {
    flex: 1, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10,
    padding: "10px 4px", textAlign: "center",
  },
  startBtn: {
    width: "100%", padding: "16px", borderRadius: 12, border: "none",
    background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
    color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 1,
  },
  // study
  studyHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  backBtn: {
    background: "none", border: "none", color: "#475569", fontSize: 13, cursor: "pointer", padding: "4px 0",
  },
  modeTag: { fontSize: 13, color: "#94a3b8", fontWeight: 600 },
  counter: { fontSize: 13, color: "#475569" },
  progressTrack: { height: 4, background: "#1e293b", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #1d4ed8, #22c55e)", borderRadius: 4, transition: "width 0.3s" },
  card: {
    background: "#0f172a", borderRadius: 16, padding: 24,
    border: "2px solid #334155", display: "flex", flexDirection: "column", gap: 16, transition: "border-color 0.2s",
  },
  promptArea: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  flagEmoji: { fontSize: 96, lineHeight: 1, userSelect: "none" },
  tldDisplay: {
    fontSize: 56, fontWeight: 800, color: "#7dd3fc", letterSpacing: -2,
    fontFamily: "monospace", userSelect: "none",
  },
  dot: { color: "#334155" },
  accChip: {
    alignSelf: "center", background: "#1e293b", borderRadius: 20,
    padding: "3px 12px", fontSize: 11, color: "#64748b",
  },
  inputsWrap: { display: "flex", flexDirection: "column", gap: 12 },
  inputGroup: { display: "flex", flexDirection: "column", gap: 6 },
  inputLabel: { fontSize: 11, color: "#475569", letterSpacing: 2, fontWeight: 700 },
  input: {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: "2px solid #475569", background: "#0f172a",
    color: "#e2e8f0", fontSize: 16, outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.15s, background 0.15s",
  },
  feedback: {
    borderRadius: 10, padding: "12px 16px", border: "1px solid",
    display: "flex", flexDirection: "column", gap: 2,
    color: "#e2e8f0", fontSize: 14,
  },
  submitBtn: {
    width: "100%", padding: "13px", borderRadius: 10, border: "none",
    background: "#2563eb", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
  },
  miniStats: { textAlign: "center", fontSize: 13, color: "#475569" },
  // result
  resultGrid: { display: "flex", gap: 16, width: "100%" },
  resultCell: {
    flex: 1, background: "#0f172a", borderRadius: 12, padding: 16,
    textAlign: "center", border: "1px solid #1e293b",
  },
};
