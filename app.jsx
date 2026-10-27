// Norsk A1/A2 — App de examen · main app: Verb module + module tabs shell
// Renders inside an Android device frame (412×892).
// Visual style: H2SITE Design System (navy/teal, Nunito + Noto Sans).


// ─── Home ─────────────────────────────────────────────────────────────────────
function HomeScreen({ mode, setMode, selectedTopics, examSize, setExamSize, soundOn, setSoundOn, onStart, onStartVocab, onOpenTopics, onOpenDictionary, onOpenGrammar }) {
  const totalQs = window.ALL_QUESTIONS.length;
  const mcqAvail = window.ALL_QUESTIONS.filter(q => selectedTopics.includes(q.topic)).length;
  const vocabAvail = (window.VOCAB || []).filter(v => selectedTopics.includes(v.topic)).length;
  const available = mode === 'vocab' ? vocabAvail : mcqAvail;
  const canStart = available >= 1 && selectedTopics.length >= 1;

  const presets = [10, 15, 20, 25, 30, 60].filter(n => n <= (mode === 'vocab' ? vocabAvail : mcqAvail));
  const effectiveSize = Math.min(examSize, available);

  return (
    <div style={{ padding: '20px 20px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ font: `800 11px ${FB}`, letterSpacing: '0.16em', color: T.teal, textTransform: 'uppercase' }}>
            Norsk · Nivå A1–A2
          </div>
          <h1 style={{ font: `800 29px/1.1 ${FD}`, margin: '7px 0 5px', letterSpacing: '-0.01em', color: T.navy, textWrap: 'balance' }}>
            Tren til prøven
          </h1>
          <p style={{ font: `400 13.5px/1.5 ${FB}`, color: T.text2, margin: 0 }}>
            Practica el examen de noruego, pregunta a pregunta.
          </p>
        </div>
        <SoundToggle on={soundOn} onToggle={() => setSoundOn(s => !s)} />
      </div>

      {/* Mode */}
      <div>
        <SectionLabel>Modo</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <ModeCard active={mode === 'study'} onClick={() => setMode('study')}
            icon="book" label="Estudio"
            description="Te muestro la respuesta correcta y la explicación tras cada pregunta." />
          <ModeCard active={mode === 'exam'} onClick={() => setMode('exam')}
            icon="clock" label="Examen"
            description="Sin pistas: solo verás el resultado y la corrección al final." />
          <ModeCard active={mode === 'vocab'} onClick={() => setMode('vocab')}
            icon="pen" label="Vocabulario"
            accentColor="#7A5AE0"
            description="Escribe la traducción de palabras aleatorias (noruego ↔ español)." />
        </div>
      </div>

      {/* Topics */}
      <div>
        <SectionLabel>Temario incluido</SectionLabel>
        <button onClick={onOpenTopics}
          style={{ background: T.surface, border: `1.5px solid ${T.border}`, width: '100%',
                   padding: '13px 14px', borderRadius: 13, textAlign: 'left', cursor: 'pointer',
                   display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.navyLight, color: T.navy,
                        display: 'grid', placeItems: 'center', font: `800 16px ${FD}` }}>
            {selectedTopics.length}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: `700 14px ${FD}`, color: T.text }}>
              {selectedTopics.length === window.TOPICS.length ? 'Todos los kapitler' : `${selectedTopics.length} kapitler elegidos`}
            </div>
            <div style={{ font: `400 12px ${FB}`, color: T.text2, marginTop: 1 }}>
              {mode === 'vocab'
                ? `${vocabAvail} palabras disponibles`
                : `${mcqAvail} preguntas disponibles · de ${totalQs}`}
            </div>
          </div>
          <Icon name="chevron" size={18} color={T.text3} />
        </button>

        {/* Reference: full book dictionary + A2 grammar */}
        <div style={{ display: 'flex', gap: 9, marginTop: 9 }}>
          <RefButton icon="search" label="Diccionario"
            sub={`${window.DICTIONARY_WORD_COUNT || ''} palabras`} onClick={onOpenDictionary} />
          <RefButton icon="list" label="Gramática"
            sub={`${(window.GRAMMAR || []).length} temas A2`} onClick={onOpenGrammar} />
        </div>
      </div>

      {/* Count (not shown for vocab mode — vocab runs unbounded) */}
      {mode !== 'vocab' && (
        <div>
          <SectionLabel>Número de preguntas</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {presets.map(n => (
              <CountChip key={n} value={n} active={effectiveSize === n} onClick={() => setExamSize(n)} />
            ))}
            <CountChip value={available} label={`Todas · ${available}`}
              active={effectiveSize === available && !presets.includes(effectiveSize)}
              onClick={() => setExamSize(available)} />
          </div>
        </div>
      )}

      <Btn full variant={mode === 'vocab' ? 'vocab' : mode === 'exam' ? 'primary' : 'teal'}
           onClick={mode === 'vocab' ? onStartVocab : onStart} disabled={!canStart}>
        {mode === 'vocab'
          ? <><Icon name="pen" size={17} color="#fff" /> Practicar vocabulario · {vocabAvail} palabras</>
          : <>Empezar {mode === 'exam' ? 'examen' : 'práctica'} · {effectiveSize} <Icon name="arrow" size={17} color="#fff" /></>
        }
      </Btn>

      <div style={{ font: `400 11px ${FB}`, color: T.text3, textAlign: 'center', letterSpacing: '0.02em' }}>
        Norsk A1/A2 · App de examen · {window.APP_VERSION}
      </div>
    </div>
  );
}

// ─── Topics ───────────────────────────────────────────────────────────────────
function TopicsScreen({ selectedTopics, setSelectedTopics, onBack }) {
  const topics = window.TOPICS;
  const counts = window.TOPIC_COUNTS;
  const allSelected = selectedTopics.length === topics.length;
  const toggle = (id) => setSelectedTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  const toggleAll = () => setSelectedTopics(allSelected ? [] : topics.map(t => t.id));

  const a1 = topics.filter(t => t.defaultOn);
  const a2 = topics.filter(t => !t.defaultOn);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <BackHeader title="Marca el temario" onBack={onBack}
        subtitle="Las preguntas se sortearán solo entre los kapitler marcados." />

      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
        <button onClick={toggleAll}
          style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 11, padding: '11px 13px',
                   cursor: 'pointer', font: `700 13px ${FD}`, color: T.navy, textAlign: 'left',
                   display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{allSelected ? 'Quitar todos' : 'Seleccionar todos'}</span>
          <span style={{ color: T.text3, font: `700 12px ${FB}` }}>{selectedTopics.length}/{topics.length}</span>
        </button>

        <div style={{ font: `800 10px ${FB}`, letterSpacing: '0.12em', color: T.teal, textTransform: 'uppercase', marginTop: 4 }}>A1 · Kapittel 1–9</div>
        {a1.map(topic => <TopicRow key={topic.id} topic={topic} checked={selectedTopics.includes(topic.id)} count={counts[topic.id]} onToggle={() => toggle(topic.id)} />)}

        <div style={{ font: `800 10px ${FB}`, letterSpacing: '0.12em', color: '#7A5AE0', textTransform: 'uppercase', marginTop: 6 }}>A2 · Kapittel 10–13</div>
        {a2.map(topic => <TopicRow key={topic.id} topic={topic} checked={selectedTopics.includes(topic.id)} count={counts[topic.id]} onToggle={() => toggle(topic.id)} />)}
      </div>

      <div style={{ padding: '12px 20px 18px', borderTop: `1px solid ${T.borderSubtle}`, background: T.bg }}>
        <Btn full onClick={onBack} disabled={selectedTopics.length === 0}>
          {selectedTopics.length === 0 ? 'Marca al menos un kapittel' : 'Listo'}
        </Btn>
      </div>
    </div>
  );
}

function TopicRow({ topic, checked, count, onToggle }) {
  const isA2 = !topic.defaultOn;
  const col = isA2 ? '#7A5AE0' : T.teal;
  return (
    <button onClick={onToggle}
      style={{ background: checked ? (isA2 ? '#7A5AE011' : T.tealPale) : T.surface,
               border: `1.5px solid ${checked ? col : T.border}`, borderRadius: 13,
               padding: '12px 13px', textAlign: 'left', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${checked ? col : T.border}`,
                    background: checked ? col : T.surface, display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 }}>
        {checked && <Icon name="check" size={13} color="#fff" stroke={2.6} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ font: `800 14px ${FD}`, color: T.navy }}>{topic.name}</span>
          <span style={{ font: `700 11px ${FB}`, color: T.text3 }}>· {count} preg.</span>
        </div>
        <div style={{ font: `400 11.5px/1.45 ${FB}`, color: T.text2, marginTop: 3 }}>{topic.short}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, font: `600 10.5px ${FB}`, color: T.text3 }}>
          <Icon name="calendar" size={12} color={T.text3} />
          {topic.dates.join(' · ')}
        </div>
      </div>
    </button>
  );
}

// ─── Dictionary (full book word list, by kapittel + section) ──────────────────
function DictionaryScreen({ onBack }) {
  const [query, setQuery] = useState('');
  const data = window.DICTIONARY || [];
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return data;
    return data
      .map(k => ({
        ...k,
        sections: k.sections
          .map(s => ({ ...s, words: s.words.filter(w => w.toLowerCase().includes(q)) }))
          .filter(s => s.words.length > 0),
      }))
      .filter(k => k.sections.length > 0);
  }, [q, data]);

  const matchCount = useMemo(
    () => filtered.reduce((a, k) => a + k.sections.reduce((b, s) => b + s.words.length, 0), 0),
    [filtered]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <BackHeader title="Diccionario" onBack={onBack}
        subtitle="Todas las palabras del libro, por kapittel y sección.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 11, padding: '9px 12px' }}>
          <Icon name="search" size={17} color={T.text3} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar palabra…"
            autoComplete="off" autoCorrect="off" spellCheck="false"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', font: `500 14px ${FB}`, color: T.text }} />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <Icon name="x" size={15} color={T.text3} />
            </button>
          )}
        </div>
        {q && <div style={{ font: `600 11px ${FB}`, color: T.text3, marginTop: 7 }}>{matchCount} resultado{matchCount === 1 ? '' : 's'}</div>}
      </BackHeader>

      <div style={{ padding: '12px 20px 18px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {filtered.length === 0 && (
          <div style={{ font: `500 13px ${FB}`, color: T.text3, textAlign: 'center', padding: '24px 0' }}>
            No hay palabras que coincidan con «{query}».
          </div>
        )}
        {filtered.map(k => {
          const isA2 = k.kapittel >= 10;
          const col = isA2 ? '#7A5AE0' : T.teal;
          return (
            <div key={k.kapittel}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ font: `800 10px ${FB}`, letterSpacing: '0.1em', color: col, textTransform: 'uppercase' }}>Kapittel {k.kapittel}</span>
                <span style={{ font: `700 13px ${FD}`, color: T.text }}>{k.title}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {k.sections.map(s => (
                  <div key={s.id} style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 11, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                      <span style={{ font: `800 11px ${FD}`, color: col }}>{s.id}</span>
                      {s.partial && <Pill color={T.text3} bg={T.surfaceAlt} style={{ fontSize: 9 }}>lista parcial</Pill>}
                      <span style={{ marginLeft: 'auto', font: `600 10px ${FB}`, color: T.text3 }}>{s.words.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {s.words.map((w, i) => (
                        <span key={i} style={{ font: `500 12.5px ${FB}`, color: T.text, background: T.surfaceAlt, borderRadius: 7, padding: '4px 9px', lineHeight: 1.3 }}>{w}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Grammar (A2 minigrammatikk) ──────────────────────────────────────────────
function GrammarScreen({ onBack }) {
  const data = window.GRAMMAR || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <BackHeader title="Gramática A2" onBack={onBack}
        subtitle="Minigrammatikk: leddsetninger, som-setninger y spørreord." />

      <div style={{ padding: '12px 20px 18px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        {data.map(topic => (
          <div key={topic.id} style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 13, padding: '14px 15px' }}>
            <h3 style={{ font: `800 16px ${FD}`, color: T.navy, margin: '0 0 1px' }}>{topic.title}</h3>
            {topic.subtitle && <div style={{ font: `600 11px ${FB}`, color: T.text3, marginBottom: 11 }}>{topic.subtitle}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {topic.blocks.map((b, i) => <GrammarBlock key={i} block={b} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrammarBlock({ block }) {
  if (block.type === 'text') {
    return <p style={{ font: `400 13px/1.55 ${FB}`, color: T.text2, margin: 0 }}>{block.text}</p>;
  }
  if (block.type === 'rule') {
    return (
      <div style={{ background: T.tealPale, borderLeft: `3px solid ${T.teal}`, borderRadius: 8, padding: '9px 12px', font: `500 12.5px/1.5 ${FB}`, color: T.text }}>
        {block.text}
      </div>
    );
  }
  if (block.type === 'chips') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {block.items.map((it, i) => (
          <span key={i} style={{ font: `700 12.5px ${FD}`, color: T.navy, background: T.navyLight, borderRadius: 7, padding: '5px 10px' }}>{it}</span>
        ))}
      </div>
    );
  }
  if (block.type === 'pairs') {
    return (
      <div>
        {block.label && <div style={{ font: `800 10px ${FB}`, letterSpacing: '0.08em', color: T.text3, textTransform: 'uppercase', marginBottom: 6 }}>{block.label}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {block.pairs.map((p, i) => (
            <div key={i} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 6, font: `500 13px ${FB}`, color: T.text }}>
              <span>{p.a}</span>
              <span style={{ background: p.sub ? T.navyLight : T.surfaceAlt, color: p.sub ? T.navyInk : T.text2,
                             borderRadius: 7, padding: '3px 8px', font: `${p.sub ? 600 : 500} 12.5px ${FB}` }}>{p.b}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (block.type === 'table') {
    return (
      <div style={{ overflowX: 'auto', borderRadius: 9, border: `1px solid ${T.borderSubtle}` }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 520 }}>
          <thead>
            <tr>{block.headers.map((h, i) => (
              <th key={i} style={{ font: `800 10px ${FB}`, letterSpacing: '0.04em', color: T.navy, textTransform: 'uppercase',
                                   textAlign: 'left', padding: '8px 10px', background: T.navyLight, whiteSpace: 'nowrap' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r} style={{ borderTop: `1px solid ${T.borderSubtle}` }}>
                {row.map((c, ci) => (
                  <td key={ci} style={{ font: `${ci === 1 ? 700 : 500} 12px ${FB}`, color: ci === 1 ? T.navy : T.text,
                                        padding: '7px 10px', whiteSpace: 'nowrap' }}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

// ─── Vocab Trainer ────────────────────────────────────────────────────────────
function VocabTrainer({ selectedTopics, soundOn, setSoundOn, onExit }) {
  const pool = useMemo(() =>
    shuffle((window.VOCAB || []).filter(v => selectedTopics.includes(v.topic))),
  [selectedTopics]);

  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(() => Math.random() < 0.5 ? 'no_to_es' : 'es_to_no');
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState(null); // null | 'correct' | 'wrong'
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;

  const item = pool[idx % pool.length];
  const topic = window.TOPICS.find(t => t.id === item.topic);

  const shown  = dir === 'no_to_es' ? item.no : item.es;
  const label  = dir === 'no_to_es' ? 'Noruego → Español' : 'Español → Noruego';
  const hint   = dir === 'es_to_no' && item.type === 'noun' ? ' (incluye artículo: en / ei / et)' : '';

  const submit = () => {
    if (result !== null || !typed.trim()) return;
    const accepted = item.type === 'noun'
      ? window._normAnswers(dir === 'no_to_es' ? item.es : item.no)
      : window._normAnswers(dir === 'no_to_es' ? item.es : item.no);
    const correct = accepted.some(a => a === norm(typed));
    setResult(correct ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (correct) { setStreak(s => s + 1); if (soundRef.current) SoundFX.correct(); }
    else { setStreak(0); if (soundRef.current) SoundFX.wrong(); }
  };

  const next = () => {
    setIdx(i => i + 1);
    setDir(Math.random() < 0.5 ? 'no_to_es' : 'es_to_no');
    setTyped('');
    setResult(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '13px 20px 11px', background: '#7A5AE0', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <button onClick={onExit} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)', font: `700 12px ${FB}`, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, padding: 0 }}>
            <Icon name="x" size={14} color="rgba(255,255,255,0.85)" /> Salir
          </button>
          <div style={{ font: `800 13px ${FD}`, color: '#fff' }}>Vocabulario</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <SoundToggle on={soundOn} onToggle={() => setSoundOn(s => !s)} dark />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ font: `400 12px ${FB}`, color: 'rgba(255,255,255,0.8)' }}>
            Racha: <b style={{ color: '#fff' }}>{streak}</b>
          </div>
          <div style={{ font: `400 12px ${FB}`, color: 'rgba(255,255,255,0.8)' }}>
            Total: <b style={{ color: '#fff' }}>{total}</b>
          </div>
        </div>
      </div>

      {/* Card */}
      <div style={{ flex: 1, padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Pill bg={T.navyLight} color={T.navy}>{topic?.name}</Pill>
          <Pill bg="#7A5AE011" color="#7A5AE0">{label}</Pill>
        </div>

        <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: '22px 20px', textAlign: 'center' }}>
          <div style={{ font: `400 11px ${FB}`, letterSpacing: '0.08em', color: T.text3, textTransform: 'uppercase', marginBottom: 10 }}>
            {dir === 'no_to_es' ? 'Noruego' : 'Español'}
          </div>
          <div style={{ font: `800 26px/1.2 ${FD}`, color: T.navy, letterSpacing: '-0.01em' }}>{shown}</div>
        </div>

        <div style={{ font: `400 12.5px ${FB}`, color: T.text2 }}>
          Traduce al {dir === 'no_to_es' ? 'español' : 'noruego'}{hint}:
        </div>

        <WriteInput value={typed} onChange={setTyped} onSubmit={submit} disabled={result !== null} />

        {result !== null && (
          <FeedbackBox correct={result === 'correct'} label={result === 'correct' ? '¡Correcto!' : 'Incorrecto'}
                       style={{ padding: '14px 16px' }}>
            {result === 'wrong' && (
              <div style={{ font: `600 14px/1.4 ${FB}`, color: T.text, marginBottom: 4 }}>
                Respuesta correcta: <b>{dir === 'no_to_es' ? item.es : item.no}</b>
              </div>
            )}
            <div style={{ font: `400 12.5px/1.5 ${FB}`, color: T.text2 }}>
              {item.no} = {item.es}
            </div>
          </FeedbackBox>
        )}
      </div>

      <FooterBar>
        {result !== null ? (
          <Btn full variant="vocab" onClick={next}>
            Siguiente palabra <Icon name="arrow" size={17} color="#fff" />
          </Btn>
        ) : (
          <FooterHint>Escribe la traducción y pulsa OK o Enter</FooterHint>
        )}
      </FooterBar>
    </div>
  );
}

// ─── Exam ─────────────────────────────────────────────────────────────────────
function ExamScreen({ mode, questions, soundOn, setSoundOn, onFinish, onAbort }) {
  const total = questions.length;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [typed, setTyped] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const startRef = useRef(Date.now());
  const inputRef = useRef(null);

  const q = questions[idx];
  const isWrite = q.type === 'write';
  const topic = window.TOPICS.find(t => t.id === q.topic);
  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;

  const commit = (entry, next) => {
    if (mode === 'study') {
      setRevealed(true);
      setAnswers(a => [...a, entry]);
      if (soundRef.current) (entry.correct ? SoundFX.correct() : SoundFX.wrong());
    } else {
      if (soundRef.current) SoundFX.tick();
      const nextAnswers = [...answers, entry];
      setAnswers(nextAnswers);
      setTimeout(() => goNext(nextAnswers), 280);
    }
  };

  const pick = (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const correct = optIdx === q.correct;
    commit({ questionId: q.id, selected: optIdx, typed: null, correct, topic: q.topic }, answers);
  };

  const submitWrite = () => {
    if (revealed || (mode === 'exam' && selected !== null)) return;
    const t = typed.trim();
    if (!t) return;
    const correct = gradeWrite(t, q);
    setSelected(0); // mark as answered
    commit({ questionId: q.id, selected: 0, typed: t, correct, topic: q.topic }, answers);
  };

  const goNext = (currentAnswers) => {
    const list = currentAnswers || answers;
    if (idx + 1 >= total) {
      onFinish(list, Math.round((Date.now() - startRef.current) / 1000));
    } else {
      setIdx(i => i + 1);
      setSelected(null);
      setTyped('');
      setRevealed(false);
    }
  };

  const answered = isWrite ? selected !== null : selected !== null;
  const writeCorrect = isWrite && revealed ? gradeWrite(typed, q) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <SessionHeader onExit={onAbort} current={idx + 1} total={total}
        pill={mode === 'exam' ? 'Examen' : 'Estudio'}
        pillColor={mode === 'exam' ? T.navy : T.teal} pillBg={mode === 'exam' ? T.navyLight : T.tealPale}
        soundOn={soundOn} setSoundOn={setSoundOn} progress={idx + (revealed ? 1 : 0)} />

      <div style={{ flex: 1, padding: '17px 20px 16px', display: 'flex', flexDirection: 'column', gap: 13, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Pill bg={T.navyLight} color={T.navy}>{topic?.name}</Pill>
          {q.type && <span style={{ font: `600 11px ${FB}`, color: T.text3, textTransform: 'capitalize' }}>{labelType(q.type)}</span>}
        </div>

        <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 'var(--qscale, 19px)', lineHeight: 1.38, color: T.text, textWrap: 'pretty', letterSpacing: '-0.003em' }}>
          {q.q}
        </div>

        {/* Write question */}
        {isWrite && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 2 }}>
            <WriteInput value={typed} onChange={setTyped} onSubmit={submitWrite} disabled={answered} />
            {revealed && (
              <div style={{ padding: '8px 12px', borderRadius: 10,
                            background: writeCorrect ? T.successLight : T.errorLight,
                            border: `1px solid ${writeCorrect ? T.success : T.error}44`,
                            font: `600 13px/1.4 ${FB}`, color: T.text }}>
                {!writeCorrect && (
                  <div style={{ marginBottom: 4 }}>
                    Respuesta correcta: <b>{q.answer}</b>
                  </div>
                )}
                <div style={{ color: writeCorrect ? T.success : T.error, font: `700 11px ${FB}`, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Icon name={writeCorrect ? 'check' : 'x'} size={13} color={writeCorrect ? T.success : T.error} stroke={2.4} />
                  {writeCorrect ? 'Correcto' : 'Incorrecto'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MCQ options */}
        {!isWrite && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 2 }}>
            {q.options.map((opt, i) => (
              <OptionRow key={i} letter={String.fromCharCode(65 + i)} label={opt}
                selected={selected === i}
                correct={revealed && i === q.correct}
                wrong={revealed && selected === i && i !== q.correct}
                dim={revealed && i !== q.correct && i !== selected}
                onClick={() => pick(i)} disabled={selected !== null} />
            ))}
          </div>
        )}

        {/* Explanation (study mode after reveal) */}
        {revealed && (
          <FeedbackBox correct={isWrite ? writeCorrect : selected === q.correct} style={{ marginTop: 4 }}>
            <div style={{ font: `400 13px/1.55 ${FB}`, color: T.text }}>{q.explanation}</div>
            <div><SourceRef source={window.sourceFor(q)} /></div>
          </FeedbackBox>
        )}
      </div>

      {mode === 'study' && (
        <FooterBar>
          {revealed ? (
            <Btn full onClick={() => goNext()}>
              {idx + 1 === total ? 'Ver resultado' : 'Siguiente'} <Icon name="arrow" size={17} color="#fff" />
            </Btn>
          ) : (
            <FooterHint>
              {isWrite ? 'Escribe la traducción y pulsa OK o Enter' : 'Elige una respuesta para ver la explicación'}
            </FooterHint>
          )}
        </FooterBar>
      )}
    </div>
  );
}

function labelType(t) {
  return ({ vocab: 'Vocabulario', grammar: 'Gramática', noun: 'Sustantivos', phrase: 'Frases', numbers: 'Números', write: 'Escritura' })[t] || t;
}

// ─── Results ──────────────────────────────────────────────────────────────────
function ResultsScreen({ questions, answers, mode, timeUsed, soundOn, onRestart, onHome }) {
  const total = questions.length;
  const correct = answers.filter(a => a.correct).length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 60;

  useEffect(() => { if (soundOn) (passed ? SoundFX.win() : SoundFX.fail()); }, []);

  const topicStats = useMemo(() => {
    const map = {};
    questions.forEach((q, i) => {
      if (!map[q.topic]) map[q.topic] = { topic: q.topic, total: 0, correct: 0 };
      map[q.topic].total++;
      if (answers[i] && answers[i].correct) map[q.topic].correct++;
    });
    return Object.values(map).sort((a, b) => a.topic - b.topic);
  }, [questions, answers]);

  const [expandedQ, setExpandedQ] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ResultHero label={`Resultado · ${mode === 'exam' ? 'Examen' : 'Práctica'}`} pct={pct} passed={passed}
        summary={<>{correct} de {total} correctas{timeUsed != null && ` · ${fmtTime(timeUsed)}`} · Aprobado desde 60%</>} />

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <SectionLabel>Por kapittel</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topicStats.map(s => {
              const t = window.TOPICS.find(x => x.id === s.topic);
              const tPct = Math.round((s.correct / s.total) * 100);
              return (
                <div key={s.topic} style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 11, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ font: `700 13px ${FD}`, color: T.text }}>{t?.name} <span style={{ font: `400 11px ${FB}`, color: T.text3 }}>· {t?.dates[0]}…</span></div>
                    <div style={{ font: `800 12px ${FD}`, color: tPct >= 60 ? T.success : T.error }}>{s.correct}/{s.total}</div>
                  </div>
                  <Progress value={s.correct} max={s.total} color={tPct >= 60 ? T.success : T.error} />
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <SectionLabel>Corrección pregunta a pregunta</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {questions.map((q, i) => {
              const a = answers[i];
              const isCorrect = a && a.correct;
              const exp = expandedQ === i;
              const isWrite = q.type === 'write';
              return (
                <div key={q.id || i} style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 11, overflow: 'hidden' }}>
                  <button onClick={() => setExpandedQ(exp ? null : i)}
                    style={{ background: 'none', border: 'none', width: '100%', padding: '11px 13px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                                  background: isCorrect ? T.success : (a ? T.error : T.text3),
                                  color: '#fff', display: 'grid', placeItems: 'center', marginTop: 1 }}>
                      <Icon name={isCorrect ? 'check' : 'x'} size={13} color="#fff" stroke={2.6} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: `700 11px ${FB}`, color: T.text3, marginBottom: 3 }}>
                        Pregunta {i + 1} · {window.TOPICS.find(t => t.id === q.topic)?.name}
                        {isWrite && <span style={{ marginLeft: 6, color: '#7A5AE0' }}>✍ Escritura</span>}
                      </div>
                      <div style={{ font: `700 13px/1.4 ${FD}`, color: T.text }}>{q.q}</div>
                    </div>
                    <div style={{ marginTop: 3, transform: exp ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                      <Icon name="chevron" size={16} color={T.text3} />
                    </div>
                  </button>
                  {exp && (
                    <div style={{ padding: '0 13px 13px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {isWrite ? (
                        <>
                          <div style={{ padding: '8px 10px', borderRadius: 8, background: isCorrect ? T.successLight : T.errorLight,
                                        border: `1px solid ${isCorrect ? T.success : T.error}55`,
                                        font: `500 12px/1.4 ${FB}`, color: T.text }}>
                            <span style={{ font: `700 11px ${FB}`, color: T.text3 }}>Tu respuesta: </span>
                            <b>{a?.typed || '(sin respuesta)'}</b>
                            {!isCorrect && <div style={{ marginTop: 4 }}><span style={{ font: `700 11px ${FB}`, color: T.text3 }}>Correcta: </span><b>{q.answer}</b></div>}
                          </div>
                        </>
                      ) : (
                        q.options.map((opt, oi) => {
                          const isAnswer = oi === q.correct;
                          const wasPicked = a && a.selected === oi;
                          return (
                            <div key={oi} style={{ padding: '8px 10px', borderRadius: 8,
                                                   background: isAnswer ? T.successLight : (wasPicked ? T.errorLight : T.surfaceAlt),
                                                   border: `1px solid ${isAnswer ? T.success+'55' : (wasPicked ? T.error+'55' : T.borderSubtle)}`,
                                                   font: `500 12px/1.4 ${FB}`, color: T.text, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                              <span style={{ font: `800 11px ${FD}`, color: isAnswer ? T.success : (wasPicked ? T.error : T.text3), minWidth: 14 }}>{String.fromCharCode(65+oi)}.</span>
                              <span>{opt}</span>
                              {isAnswer && <span style={{ marginLeft: 'auto', font: `800 9.5px ${FB}`, color: T.success, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Correcta</span>}
                              {wasPicked && !isAnswer && <span style={{ marginLeft: 'auto', font: `800 9.5px ${FB}`, color: T.error, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Tu resp.</span>}
                            </div>
                          );
                        })
                      )}
                      <div style={{ background: T.navyLight, borderRadius: 8, padding: '10px 12px', font: `500 12px/1.55 ${FB}`, color: T.navyInk }}>
                        <strong style={{ font: `800 10px ${FB}`, textTransform: 'uppercase', letterSpacing: '0.07em', color: T.navy, display: 'block', marginBottom: 3 }}>Explicación</strong>
                        {q.explanation}
                        <div><SourceRef source={window.sourceFor(q)} /></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <FooterBar style={{ display: 'flex', gap: 10 }}>
        <Btn variant="ghost" onClick={onHome} style={{ flex: 1 }}>Inicio</Btn>
        <Btn variant="primary" onClick={onRestart} style={{ flex: 1.3 }}>Nuevo intento</Btn>
      </FooterBar>
    </div>
  );
}

// ─── Verb module (the original exam / study / vocab app) ─────────────────────
// Session state lives here, so switching tabs and coming back keeps it intact.
function VerbModule({ soundOn, setSoundOn }) {
  const [screen, setScreen] = useState('home');
  const [mode, setMode] = useState('study');

  // k1-9 on by default; k10-13 off by default
  const defaultTopics = window.TOPICS.filter(t => t.defaultOn).map(t => t.id);
  const [selectedTopics, setSelectedTopics] = useState(defaultTopics);

  const [examSize, setExamSize] = useState(25);
  const [examQuestions, setExamQuestions] = useState([]);
  const [examAnswers, setExamAnswers] = useState([]);
  const [timeUsed, setTimeUsed] = useState(null);

  const startExam = () => {
    const mcqPool = window.ALL_QUESTIONS.filter(q => selectedTopics.includes(q.topic));
    const vocabPool = (window.VOCAB || []).filter(v => selectedTopics.includes(v.topic));
    const n = Math.min(examSize, mcqPool.length + vocabPool.length);

    // ~25% write questions from vocab, rest MCQ
    const writeCount = Math.min(Math.floor(n * 0.25), vocabPool.length);
    const mcqCount   = Math.min(n - writeCount, mcqPool.length);

    const writeQs = shuffle(vocabPool).slice(0, writeCount).map(v => window.vocabToWriteQ(v));
    const mcqQs   = shuffle(mcqPool).slice(0, mcqCount);

    setExamQuestions(shuffle([...mcqQs, ...writeQs]));
    setExamAnswers([]); setTimeUsed(null); setScreen('exam');
  };

  const startVocab = () => setScreen('vocab');
  const finishExam = (answers, used) => { setExamAnswers(answers); setTimeUsed(used); setScreen('results'); };
  const abortExam  = () => { if (confirm('¿Salir? Se perderá el progreso de esta sesión.')) setScreen('home'); };

  if (screen === 'home') {
    return <HomeScreen mode={mode} setMode={setMode} selectedTopics={selectedTopics}
             examSize={examSize} setExamSize={setExamSize} soundOn={soundOn} setSoundOn={setSoundOn}
             onStart={startExam} onStartVocab={startVocab} onOpenTopics={() => setScreen('topics')}
             onOpenDictionary={() => setScreen('dictionary')} onOpenGrammar={() => setScreen('grammar')} />;
  } else if (screen === 'topics') {
    return <TopicsScreen selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} onBack={() => setScreen('home')} />;
  } else if (screen === 'dictionary') {
    return <DictionaryScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'grammar') {
    return <GrammarScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'vocab') {
    return <VocabTrainer selectedTopics={selectedTopics} soundOn={soundOn} setSoundOn={setSoundOn} onExit={() => setScreen('home')} />;
  } else if (screen === 'exam') {
    return <ExamScreen mode={mode} questions={examQuestions} soundOn={soundOn} setSoundOn={setSoundOn} onFinish={finishExam} onAbort={abortExam} />;
  } else if (screen === 'results') {
    return <ResultsScreen questions={examQuestions} answers={examAnswers} mode={mode} timeUsed={timeUsed} soundOn={soundOn} onRestart={() => setScreen('home')} onHome={() => setScreen('home')} />;
  }
  return null;
}

// ─── Module tabs ──────────────────────────────────────────────────────────────
const MODULES = [
  { id: 'verb',          label: 'Verb' },
  { id: 'preposisjoner', label: 'Preposisjoner' },
];

function ModuleTabs({ active, onChange }) {
  return (
    <div role="tablist" aria-label="Módulo"
      style={{ display: 'flex', gap: 6, padding: '10px 20px', background: T.surface,
               borderBottom: `1px solid ${T.borderSubtle}`, flexShrink: 0 }}>
      {MODULES.map(m => {
        const on = m.id === active;
        return (
          <button key={m.id} role="tab" aria-selected={on} onClick={() => onChange(m.id)}
            style={{ flex: 1, padding: '9px 10px', borderRadius: 10, cursor: 'pointer',
                     background: on ? T.navy : T.surfaceAlt, color: on ? '#fff' : T.text2,
                     border: `1.5px solid ${on ? T.navy : T.border}`, font: `800 13.5px ${FD}` }}>
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── App shell ────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ "accent": "#2F2B7D", "questionScale": 19 }/*EDITMODE-END*/;

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [module, setModule] = useState(() => {
    try { const m = localStorage.getItem('norsk_module'); return MODULES.some(x => x.id === m) ? m : 'verb'; } catch { return 'verb'; }
  });
  useEffect(() => { try { localStorage.setItem('norsk_module', module); } catch {} }, [module]);
  useEffect(() => {
    // Browser chrome (mobile address bar) follows the active palette.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', module === 'preposisjoner' ? '#2E7D4F' : '#2F2B7D');
  }, [module]);

  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem('norsk_sound') !== 'off'; } catch { return true; }
  });
  useEffect(() => { try { localStorage.setItem('norsk_sound', soundOn ? 'on' : 'off'); } catch {} }, [soundOn]);

  // Both modules stay mounted (only the active one is shown), so a session in
  // progress survives a tab switch. Each panel carries its own data-module so
  // its palette never depends on which tab is active.
  const panel = (id, children, extraStyle) => (
    <div key={id} data-module={id} role="tabpanel"
      style={{ flex: 1, minHeight: 0, overflow: 'auto', flexDirection: 'column', background: T.bg,
               display: module === id ? 'flex' : 'none', ...extraStyle }}>
      {children}
    </div>
  );
  const body = (
    <>
      <ModuleTabs active={module} onChange={setModule} />
      {panel('verb', <VerbModule soundOn={soundOn} setSoundOn={setSoundOn} />, { '--c-primary': tw.accent })}
      {panel('preposisjoner', <PrepModule soundOn={soundOn} setSoundOn={setSoundOn} />)}
    </>
  );

  if (!EMBEDDED) {
    return (
      <div className="app-root" data-module={module} data-screen-label={`Norsk A1/A2 · ${module}`}
        style={{ '--qscale': `${tw.questionScale}px`, height: '100dvh', display: 'flex', justifyContent: 'center', background: T.bg }}>
        <div style={{ width: '100%', maxWidth: 480, height: '100dvh', background: T.bg, fontFamily: FB, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 0 40px rgba(0,0,0,0.06)' }}>
          {body}
        </div>
      </div>
    );
  }

  return (
    <div className="stage">
      <div data-screen-label={`Norsk A1/A2 · ${module}`} className="app-root" data-module={module} style={{ '--qscale': `${tw.questionScale}px` }}>
        <AndroidDevice width={412} height={892}>
          <div style={{ height: '100%', background: T.bg, fontFamily: FB, display: 'flex', flexDirection: 'column' }}>
            {body}
          </div>
        </AndroidDevice>
      </div>
      <div className="annotation">
        <h4>Norsk A1/A2 · App de examen · {window.APP_VERSION}</h4>
        <p style={{ margin: 0 }}>
          <strong>Estudio:</strong> explicación tras cada pregunta.<br />
          <strong>Examen:</strong> corrección solo al final. Preguntas MCQ + escritura intercaladas.<br />
          <strong>Vocabulario:</strong> modo libre de traducción noruego ↔ español.<br />
          <strong>Preposisjoner:</strong> verbos con preposición fija y con partícula (A2).<br /><br />
          Banco: <strong>{window.ALL_QUESTIONS.length}</strong> preguntas · <strong>{(window.VOCAB||[]).length}</strong> palabras · <strong>{window.TOPICS.length}</strong> kapitler.
        </p>
      </div>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Marca" />
        <TweakColor label="Color principal (Verb)" value={tw.accent}
          options={['#2F2B7D', '#3CB3AA', '#1C3D5A', '#7A5AE0']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Texto" />
        <TweakSlider label="Tamaño de pregunta" value={tw.questionScale} min={16} max={24} unit="px"
          onChange={(v) => setTweak('questionScale', v)} />
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
