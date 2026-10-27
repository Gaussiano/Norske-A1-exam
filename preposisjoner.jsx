// Norsk A2 — Preposisjoner module: verbs with a fixed preposition ("fast") and
// particle verbs ("partikkel"). Data: data/preposisjoner.json.
// Built on the shared UI kit (shared.jsx); palette comes from [data-module="preposisjoner"].

const PREP_DATA_URL  = 'data/preposisjoner.json';
const PREP_STATS_KEY = 'norsk_prep_stats';   // progress of this module only
const PREP_PREFS_KEY = 'norsk_prep_prefs';   // last mode + filters
const PREP_EMPTY_STATS = { answered: 0, correct: 0, bestStreak: 0, items: {} };
const PREP_DEFAULT_PREFS = { mode: 'gap', type: 'all', preps: [], size: 10 };

const PREP_MODES = {
  gap:   { label: 'Hueco',    icon: 'pen',    description: 'Lee la frase y escribe la preposición o partícula que falta.' },
  mcq:   { label: 'Test',     icon: 'list',   description: 'Elige la preposición correcta entre 4 opciones.' },
  cards: { label: 'Tarjetas', icon: 'layers', description: 'Ves la traducción, piensas la expresión y das la vuelta a la tarjeta.' },
};
const PREP_TYPES = [
  { id: 'all',       label: 'Todos' },
  { id: 'fast',      label: 'Fast' },
  { id: 'partikkel', label: 'Partikkel' },
];

// ─── Data + helpers ───────────────────────────────────────────────────────────
function usePrepData() {
  const [state, setState] = useState({ status: 'loading', items: [] });
  useEffect(() => {
    let alive = true;
    fetch(PREP_DATA_URL, { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(items => { if (alive) setState({ status: 'ready', items }); })
      .catch(err => { if (alive) setState({ status: 'error', items: [], error: String(err.message || err) }); });
    return () => { alive = false; };
  }, []);
  return state;
}

// Distinct preposisjon values, most frequent first.
function prepList(items) {
  const counts = {};
  items.forEach(it => { counts[it.preposisjon] = (counts[it.preposisjon] || 0) + 1; });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b, 'nb'));
}

const matchesType = (it, type) => type === 'all' || it.type === type;
function filterPrepItems(items, { type, preps }) {
  return items.filter(it => matchesType(it, type) && (preps.length === 0 || preps.includes(it.preposisjon)));
}

// The right answer + 3 other single-word prepositions taken from the list.
function buildOptions(item, allPreps) {
  const others = allPreps.filter(p => norm(p) !== norm(item.preposisjon) && !p.includes(' '));
  return shuffle([item.preposisjon, ...shuffle(others).slice(0, 3)]);
}

// ─── Small pieces ─────────────────────────────────────────────────────────────
// Sentence with the gap: blank line before answering, highlighted word after.
function PrepSentence({ setning, answer, style }) {
  const parts = setning.split('___');
  return (
    <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 'var(--qscale, 19px)', lineHeight: 1.45,
                  color: T.text, textWrap: 'pretty', letterSpacing: '-0.003em', ...style }}>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (answer
            ? <mark style={{ background: T.tealPale, color: T.navyInk, borderRadius: 6, padding: '0 5px',
                             boxShadow: `inset 0 -2px 0 ${T.teal}` }}>{answer}</mark>
            : <span aria-label="hueco" style={{ display: 'inline-block', minWidth: 54, margin: '0 3px',
                                                borderBottom: `2.5px solid ${T.teal}`, transform: 'translateY(-3px)' }}>&nbsp;</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function TypePill({ type }) {
  return type === 'partikkel'
    ? <Pill color={T.navy} bg={T.navyLight}>Partikkel</Pill>
    : <Pill color={T.text2} bg={T.surfaceAlt}>Fast preposisjon</Pill>;
}

function ParticleNote() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: T.navyLight, color: T.navyInk,
                  borderRadius: 8, padding: '6px 10px', font: `600 11.5px ${FB}`, lineHeight: 1.3 }}>
      <Icon name="sound" size={14} color={T.navy} />
      <span><b style={{ fontWeight: 800 }}>Partikkelen har trykk</b> · La partícula se acentúa</span>
    </div>
  );
}

// What is always shown after answering: full sentence, translation, expression.
function PrepDetails({ item }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <PrepSentence setning={item.setning} answer={item.preposisjon} style={{ fontSize: 16, fontWeight: 700 }} />
      <div style={{ font: `400 13px/1.5 ${FB}`, color: T.text2 }}>{item.setning_es}</div>
      <div style={{ font: `500 12.5px/1.45 ${FB}`, color: T.text }}>
        <b style={{ fontWeight: 800, color: T.navy }}>{item.uttrykk}</b> = {item.es}
      </div>
      {item.type === 'partikkel' && <div><ParticleNote /></div>}
    </div>
  );
}

function StatTile({ value, label }) {
  return (
    <div style={{ flex: 1, minWidth: 0, background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 11, padding: '10px 11px' }}>
      <div style={{ font: `800 18px ${FD}`, color: T.navy }}>{value}</div>
      <div style={{ font: `600 10.5px ${FB}`, color: T.text3, marginTop: 1 }}>{label}</div>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function PrepHome({ data, prefs, setPrefs, stats, onResetStats, soundOn, setSoundOn, onStart }) {
  const items = data.items;
  const byType = items.filter(it => matchesType(it, prefs.type));
  const preps = prepList(byType);
  const pool = filterPrepItems(items, prefs);
  const size = Math.min(prefs.size, pool.length);
  const presets = [10, 20, 30].filter(n => n < pool.length);

  const set = (patch) => setPrefs(p => ({ ...p, ...patch }));
  const setType = (type) => {
    // Keep only the prepositions that still exist for the new type.
    const still = prepList(items.filter(it => matchesType(it, type)));
    set({ type, preps: prefs.preps.filter(p => still.includes(p)) });
  };
  const togglePrep = (p) => set({ preps: prefs.preps.includes(p) ? prefs.preps.filter(x => x !== p) : [...prefs.preps, p] });

  const pct = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;
  const seen = Object.keys(stats.items).length;

  return (
    <div style={{ padding: '20px 20px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ font: `800 11px ${FB}`, letterSpacing: '0.16em', color: T.teal, textTransform: 'uppercase' }}>
            Preposisjoner · Nivå A2
          </div>
          <h1 style={{ font: `800 29px/1.1 ${FD}`, margin: '7px 0 5px', letterSpacing: '-0.01em', color: T.navy, textWrap: 'balance' }}>
            Verb med preposisjon
          </h1>
          <p style={{ font: `400 13.5px/1.5 ${FB}`, color: T.text2, margin: 0 }}>
            Verbos con preposición fija y verbos con partícula.
          </p>
        </div>
        <SoundToggle on={soundOn} onToggle={() => setSoundOn(s => !s)} />
      </div>

      {data.status === 'loading' && <FooterHint>Cargando expresiones…</FooterHint>}
      {data.status === 'error' && (
        <FeedbackBox correct={false} label="No se pudo cargar">
          <div style={{ font: `400 13px/1.5 ${FB}`, color: T.text }}>
            No se ha podido leer <b>{PREP_DATA_URL}</b> ({data.error}). Abre la app desde un servidor
            (GitHub Pages o <code>python -m http.server</code>), no como fichero local.
          </div>
        </FeedbackBox>
      )}

      {data.status === 'ready' && (
        <>
          <div>
            <SectionLabel>Modo</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {Object.entries(PREP_MODES).map(([id, m]) => (
                <ModeCard key={id} active={prefs.mode === id} onClick={() => set({ mode: id })}
                  icon={m.icon} label={m.label} description={m.description} />
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Tipo</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PREP_TYPES.map(t => (
                <CountChip key={t.id} active={prefs.type === t.id} onClick={() => setType(t.id)}
                  label={`${t.label} · ${items.filter(it => matchesType(it, t.id)).length}`} />
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Preposición / partícula</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              <CountChip active={prefs.preps.length === 0} onClick={() => set({ preps: [] })} label="Todas" />
              {preps.map(p => (
                <CountChip key={p} active={prefs.preps.includes(p)} onClick={() => togglePrep(p)}
                  label={<>{p} <span style={{ opacity: 0.6, fontWeight: 600 }}>{byType.filter(it => it.preposisjon === p).length}</span></>} />
              ))}
            </div>
            <div style={{ font: `400 12px ${FB}`, color: T.text2, marginTop: 9 }}>
              {pool.length} de {items.length} expresiones con estos filtros
            </div>
          </div>

          <div>
            <SectionLabel>{prefs.mode === 'cards' ? 'Número de tarjetas' : 'Número de preguntas'}</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {presets.map(n => <CountChip key={n} value={n} active={size === n} onClick={() => set({ size: n })} />)}
              <CountChip value={pool.length} label={`Todas · ${pool.length}`}
                active={size === pool.length} onClick={() => set({ size: pool.length })} />
            </div>
          </div>

          <Btn full onClick={() => onStart(pool, size)} disabled={pool.length === 0}>
            {pool.length === 0
              ? 'Ninguna expresión con estos filtros'
              : <>Empezar · {PREP_MODES[prefs.mode].label} · {size} <Icon name="arrow" size={17} color="#fff" /></>}
          </Btn>

          <div>
            <SectionLabel>Tu progreso en Preposisjoner</SectionLabel>
            <div style={{ display: 'flex', gap: 8 }}>
              <StatTile value={stats.answered} label="respuestas" />
              <StatTile value={`${pct}%`} label="aciertos" />
              <StatTile value={stats.bestStreak} label="mejor racha" />
              <StatTile value={`${seen}/${items.length}`} label="vistas" />
            </div>
            {stats.answered > 0 && (
              <button onClick={onResetStats}
                style={{ background: 'none', border: 'none', padding: 0, marginTop: 9, cursor: 'pointer',
                         font: `600 11.5px ${FB}`, color: T.text3, textDecoration: 'underline' }}>
                Borrar progreso de este módulo
              </button>
            )}
          </div>
        </>
      )}

      <div style={{ font: `400 11px ${FB}`, color: T.text3, textAlign: 'center', letterSpacing: '0.02em' }}>
        Norsk A1/A2 · Preposisjoner · {window.APP_VERSION}
      </div>
    </div>
  );
}

// ─── Session (gap / mcq / cards) ──────────────────────────────────────────────
function PrepSession({ mode, items, allPreps, soundOn, setSoundOn, onAnswer, onFinish, onExit }) {
  const total = items.length;
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [picked, setPicked] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState(null); // null | true | false
  const [answers, setAnswers] = useState([]);
  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;

  const item = items[idx];
  const options = useMemo(() => buildOptions(item, allPreps), [item, allPreps]);

  const answer = (correct, given) => {
    if (result !== null) return;
    setResult(correct);
    setAnswers(a => [...a, { id: item.id, correct, given }]);
    onAnswer(item, correct);
    if (soundRef.current) (correct ? SoundFX.correct() : SoundFX.wrong());
  };

  const submitGap = () => { if (typed.trim()) answer(norm(typed) === norm(item.preposisjon), typed.trim()); };
  const pick = (i) => { if (picked === null) { setPicked(i); answer(norm(options[i]) === norm(item.preposisjon), options[i]); } };

  const next = () => {
    if (idx + 1 >= total) { onFinish(answers); return; }
    setIdx(i => i + 1); setTyped(''); setPicked(null); setFlipped(false); setResult(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <SessionHeader onExit={onExit} current={idx + 1} total={total} pill={PREP_MODES[mode].label}
        soundOn={soundOn} setSoundOn={setSoundOn} progress={idx + (result !== null ? 1 : 0)} />

      <div style={{ flex: 1, padding: '17px 20px 16px', display: 'flex', flexDirection: 'column', gap: 13, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <TypePill type={item.type} />
          {mode !== 'cards' && <span style={{ font: `600 11px ${FB}`, color: T.text3 }}>{item.es}</span>}
        </div>

        {mode !== 'cards' && <PrepSentence setning={item.setning} />}

        {mode === 'gap' && (
          <WriteInput value={typed} onChange={setTyped} onSubmit={submitGap} disabled={result !== null}
            placeholder="Escribe la preposición…" />
        )}

        {mode === 'mcq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 2 }}>
            {options.map((opt, i) => {
              const isRight = norm(opt) === norm(item.preposisjon);
              return (
                <OptionRow key={i} letter={String.fromCharCode(65 + i)} label={opt}
                  selected={picked === i} correct={result !== null && isRight}
                  wrong={result !== null && picked === i && !isRight}
                  dim={result !== null && !isRight && picked !== i}
                  onClick={() => pick(i)} disabled={picked !== null} />
              );
            })}
          </div>
        )}

        {mode === 'cards' && <PrepCard item={item} flipped={flipped} onFlip={() => setFlipped(true)} />}

        {result !== null && mode !== 'cards' && (
          <FeedbackBox correct={result} style={{ marginTop: 4 }}>
            {!result && (
              <div style={{ font: `600 13.5px/1.4 ${FB}`, color: T.text, marginBottom: 8 }}>
                {mode === 'gap' && <>Tu respuesta: <s>{typed.trim()}</s> · </>}
                Correcta: <b>{item.preposisjon}</b>
              </div>
            )}
            <PrepDetails item={item} />
          </FeedbackBox>
        )}
      </div>

      <FooterBar>
        {result !== null ? (
          <Btn full onClick={next}>
            {idx + 1 === total ? 'Ver resultado' : 'Siguiente'} <Icon name="arrow" size={17} color="#fff" />
          </Btn>
        ) : mode === 'cards' ? (
          flipped ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="ghost" onClick={() => answer(false, null)} style={{ flex: 1 }}>
                <Icon name="x" size={16} /> No lo sabía
              </Btn>
              <Btn onClick={() => answer(true, null)} style={{ flex: 1 }}>
                <Icon name="check" size={16} color="#fff" /> Lo sabía
              </Btn>
            </div>
          ) : (
            <Btn full variant="secondary" onClick={() => setFlipped(true)}>Dar la vuelta</Btn>
          )
        ) : (
          <FooterHint>
            {mode === 'gap' ? 'Escribe la preposición y pulsa OK o Enter' : 'Elige la preposición correcta'}
          </FooterHint>
        )}
      </FooterBar>
    </div>
  );
}

// Flashcard: front = Spanish, back = expression + example.
function PrepCard({ item, flipped, onFlip }) {
  return (
    <button onClick={onFlip} disabled={flipped} aria-label={flipped ? 'Tarjeta' : 'Dar la vuelta a la tarjeta'}
      style={{ background: T.surface, border: `1.5px solid ${flipped ? T.teal : T.border}`, borderRadius: 16,
               padding: '24px 20px', textAlign: 'center', cursor: flipped ? 'default' : 'pointer',
               display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', minHeight: 210,
               justifyContent: 'center', transition: 'border-color 0.15s ease' }}>
      <div style={{ font: `400 11px ${FB}`, letterSpacing: '0.08em', color: T.text3, textTransform: 'uppercase' }}>
        {flipped ? 'Norsk' : 'Español'}
      </div>
      {!flipped ? (
        <>
          <div style={{ font: `800 26px/1.2 ${FD}`, color: T.navy, letterSpacing: '-0.01em' }}>{item.es}</div>
          <div style={{ font: `500 12px ${FB}`, color: T.text3 }}>Piensa la expresión y toca para ver la respuesta</div>
        </>
      ) : (
        <>
          <div style={{ font: `800 26px/1.2 ${FD}`, color: T.navy, letterSpacing: '-0.01em' }}>{item.uttrykk}</div>
          <div style={{ font: `500 13px ${FB}`, color: T.text2 }}>{item.es}</div>
          <div style={{ width: '100%', borderTop: `1px solid ${T.borderSubtle}`, paddingTop: 12, textAlign: 'left' }}>
            <PrepDetails item={item} />
          </div>
        </>
      )}
    </button>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────
function PrepResults({ mode, items, answers, soundOn, onRetryWrong, onRestart, onHome }) {
  const total = items.length;
  const correct = answers.filter(a => a.correct).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const passed = pct >= 60;
  const wrongCount = total - correct;

  useEffect(() => { if (soundOn) (passed ? SoundFX.win() : SoundFX.fail()); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ResultHero label={`Resultado · ${PREP_MODES[mode].label}`} pct={pct} passed={passed}
        summary={`${correct} de ${total} correctas · Aprobado desde 60%`} />

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SectionLabel>Repaso</SectionLabel>
        {items.map((it, i) => {
          const a = answers[i];
          const ok = a && a.correct;
          return (
            <div key={it.id} style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 11,
                                      padding: '11px 13px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, background: ok ? T.success : T.error,
                            display: 'grid', placeItems: 'center', marginTop: 1 }}>
                <Icon name={ok ? 'check' : 'x'} size={13} color="#fff" stroke={2.6} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <PrepSentence setning={it.setning} answer={it.preposisjon} style={{ fontSize: 14, fontWeight: 700 }} />
                <div style={{ font: `400 12px/1.45 ${FB}`, color: T.text2, marginTop: 3 }}>
                  <b style={{ color: T.navy }}>{it.uttrykk}</b> = {it.es}
                  {a && !ok && a.given && <span style={{ color: T.error }}> · tu respuesta: {a.given}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <FooterBar style={{ display: 'flex', gap: 10 }}>
        <Btn variant="ghost" onClick={onHome} style={{ flex: 1 }}>Inicio</Btn>
        {wrongCount > 0
          ? <Btn variant="teal" onClick={onRetryWrong} style={{ flex: 1.3 }}>Repetir fallos · {wrongCount}</Btn>
          : <Btn onClick={onRestart} style={{ flex: 1.3 }}>Nuevo intento</Btn>}
      </FooterBar>
    </div>
  );
}

// ─── Module root ──────────────────────────────────────────────────────────────
function PrepModule({ soundOn, setSoundOn }) {
  const data = usePrepData();
  const [prefs, setPrefs] = useStoredState(PREP_PREFS_KEY, PREP_DEFAULT_PREFS);
  const [stats, setStats] = useStoredState(PREP_STATS_KEY, PREP_EMPTY_STATS);
  const [screen, setScreen] = useState('home');      // home | session | results
  const [session, setSession] = useState(null);      // { key, mode, items, answers }
  const streakRef = useRef(0);
  const allPreps = useMemo(() => prepList(data.items), [data.items]);

  const begin = (items, mode = prefs.mode) => {
    streakRef.current = 0;
    setSession({ key: Date.now(), mode, items, answers: [] });
    setScreen('session');
  };
  const start = (pool, size) => begin(shuffle(pool).slice(0, size));

  const record = (item, correct) => {
    streakRef.current = correct ? streakRef.current + 1 : 0;
    const streak = streakRef.current;
    setStats(s => {
      const prev = s.items[item.id] || { ok: 0, ko: 0 };
      return {
        answered: s.answered + 1,
        correct: s.correct + (correct ? 1 : 0),
        bestStreak: Math.max(s.bestStreak, streak),
        items: { ...s.items, [item.id]: { ok: prev.ok + (correct ? 1 : 0), ko: prev.ko + (correct ? 0 : 1) } },
      };
    });
  };

  const resetStats = () => { if (confirm('¿Borrar el progreso de Preposisjoner? El módulo Verb no se ve afectado.')) setStats(PREP_EMPTY_STATS); };
  const exit = () => { if (confirm('¿Salir? Se perderá el progreso de esta sesión.')) setScreen('home'); };

  if (screen === 'session' && session) {
    return <PrepSession key={session.key} mode={session.mode} items={session.items} allPreps={allPreps}
             soundOn={soundOn} setSoundOn={setSoundOn} onAnswer={record} onExit={exit}
             onFinish={(answers) => { setSession(s => ({ ...s, answers })); setScreen('results'); }} />;
  }
  if (screen === 'results' && session) {
    return <PrepResults mode={session.mode} items={session.items} answers={session.answers} soundOn={soundOn}
             onHome={() => setScreen('home')}
             onRestart={() => begin(shuffle(session.items), session.mode)}
             onRetryWrong={() => begin(shuffle(session.items.filter((_, i) => !session.answers[i]?.correct)), session.mode)} />;
  }
  return <PrepHome data={data} prefs={{ ...PREP_DEFAULT_PREFS, ...prefs }} setPrefs={setPrefs} stats={{ ...PREP_EMPTY_STATS, ...stats }}
           onResetStats={resetStats} soundOn={soundOn} setSoundOn={setSoundOn} onStart={start} />;
}

Object.assign(window, { PrepModule });
