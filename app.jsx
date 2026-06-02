// Norsk A1/A2 — App de examen · main app  (v2.0.0)
// Renders inside an Android device frame (412×892).
// Visual style: H2SITE Design System (navy/teal, Nunito + Noto Sans).

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const FD = "'Nunito', system-ui, sans-serif";   // display / headings
const FB = "'Noto Sans', system-ui, sans-serif"; // body

// True inside the Claude Design host (iframe); false when deployed/opened directly.
const EMBEDDED = (() => { try { return window.self !== window.top; } catch { return true; } })();

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg: '#F4F6F8', surface: '#ffffff', surfaceAlt: '#F0F3F5',
  border: '#DCE3E6', borderSubtle: '#E8EDEF',
  text: '#1C2230', text2: '#5A6472', text3: '#97A1AD',
  navy: '#2F2B7D', navyInk: '#221F5C', navyLight: '#ECEBF4',
  teal: '#3CB3AA', tealLight: '#5ECBC3', tealPale: '#E2F2F0',
  success: '#2E8B6F', successLight: '#E4F2EC',
  error: '#C2453A', errorLight: '#F8E7E4',
};
T.accent = T.navy; T.accentLight = T.navyLight; T.accentInk = T.navyInk;

// ─── Sound ────────────────────────────────────────────────────────────────────
const SoundFX = (() => {
  let ctx = null;
  const ac = () => {
    if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  const tone = (freq, start, dur, { type = 'sine', gain = 0.1, attack = 0.012 } = {}) => {
    const c = ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    o.connect(g); g.connect(c.destination);
    const t0 = c.currentTime + start;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.start(t0); o.stop(t0 + dur + 0.03);
  };
  return {
    correct() { tone(659, 0, 0.16, { gain: 0.09 }); tone(988, 0.085, 0.30, { gain: 0.085 }); },
    wrong()   { tone(165, 0, 0.30, { type: 'sawtooth', gain: 0.07 }); tone(124, 0.05, 0.34, { type: 'sawtooth', gain: 0.055 }); },
    tick()    { tone(523, 0, 0.05, { gain: 0.04 }); },
    win()     { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.42, { gain: 0.075 })); },
    fail()    { tone(392, 0, 0.26, { gain: 0.07 }); tone(294, 0.16, 0.5, { gain: 0.07 }); },
  };
})();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtTime = (s) => { if (s < 0) s = 0; const m = Math.floor(s / 60), r = s % 60; return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`; };
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function gradeWrite(typed, q) {
  const t = typed.toLowerCase().trim().replace(/\s+/g, ' ');
  const accepted = (q.acceptedAnswers || window._normAnswers(q.answer));
  return accepted.some(a => a.toLowerCase().trim().replace(/\s+/g, ' ') === t);
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function Icon({ name, size = 20, color = 'currentColor', stroke = 1.6 }) {
  const p = {
    book:     <><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H12v15h6.5a1.5 1.5 0 0 1 1.5 1.5z"/></>,
    clock:    <><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></>,
    layers:   <><path d="M12 3 3 8l9 5 9-5z"/><path d="m3 13 9 5 9-5"/></>,
    calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/></>,
    sound:    <><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></>,
    mute:     <><path d="M4 9v6h4l5 4V5L8 9z"/><path d="m16 9 5 5m0-5-5 5"/></>,
    check:    <path d="M4 12.5 9 17.5 20 6.5"/>,
    x:        <path d="M6 6l12 12M18 6 6 18"/>,
    arrow:    <path d="M5 12h14m-6-6 6 6-6 6"/>,
    chevron:  <path d="m9 6 6 6-6 6"/>,
    pen:      <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></>,
  }[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {p}
    </svg>
  );
}

// ─── Reusable UI ──────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = 'primary', disabled, full, style }) {
  const palette = {
    primary:   { bg: T.navy,        color: '#fff', border: T.navy        },
    teal:      { bg: T.teal,        color: '#fff', border: T.teal        },
    secondary: { bg: T.surface,     color: T.navy, border: T.navy        },
    ghost:     { bg: 'transparent', color: T.text, border: T.border      },
    vocab:     { bg: '#7A5AE0',     color: '#fff', border: '#7A5AE0'     },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: palette.bg, color: palette.color, border: `1.5px solid ${palette.border}`,
               padding: '15px 20px', borderRadius: 12, font: `700 15px ${FD}`, letterSpacing: '0.005em',
               cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
               width: full ? '100%' : 'auto', display: 'inline-flex', alignItems: 'center',
               justifyContent: 'center', gap: 8, transition: 'transform 0.08s ease, opacity 0.15s ease', ...style }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.985)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
      {children}
    </button>
  );
}

function Pill({ children, color = T.text2, bg = T.surfaceAlt, style }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px',
                   borderRadius: 6, background: bg, color, font: `700 10.5px ${FB}`,
                   textTransform: 'uppercase', letterSpacing: '0.06em', ...style }}>
      {children}
    </span>
  );
}

function Progress({ value, max, color = T.teal }) {
  const pct = max ? (value / max) * 100 : 0;
  return (
    <div style={{ width: '100%', height: 6, background: T.borderSubtle, borderRadius: 100, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 100, transition: 'width 0.3s ease' }} />
    </div>
  );
}

function SoundToggle({ on, onToggle, dark }) {
  return (
    <button onClick={onToggle} aria-label={on ? 'Apagar sonido' : 'Encender sonido'}
      style={{ background: dark ? 'rgba(255,255,255,0.14)' : T.surfaceAlt, border: `1px solid ${dark ? 'transparent' : T.border}`,
               width: 34, height: 34, borderRadius: 9, cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <Icon name={on ? 'sound' : 'mute'} size={18} color={dark ? '#fff' : (on ? T.teal : T.text3)} />
    </button>
  );
}

function SourceRef({ source, tone = 'navy' }) {
  const col = tone === 'light' ? 'rgba(255,255,255,0.92)' : T.navy;
  const bg  = tone === 'light' ? 'rgba(255,255,255,0.14)' : T.navyLight;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: bg, color: col,
                  borderRadius: 8, padding: '6px 10px', font: `600 11.5px ${FB}`, marginTop: 10, lineHeight: 1.3 }}>
      <Icon name="calendar" size={14} color={tone === 'light' ? 'rgba(255,255,255,0.9)' : T.teal} />
      <span><b style={{ fontWeight: 800 }}>Apuntes:</b> {source}</span>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ font: `800 10.5px ${FB}`, letterSpacing: '0.1em', color: T.text3, marginBottom: 9, textTransform: 'uppercase' }}>{children}</div>;
}

function CountChip({ value, label, active, onClick }) {
  return (
    <button onClick={onClick}
      style={{ background: active ? T.navy : T.surface, color: active ? '#fff' : T.text,
               border: `1.5px solid ${active ? T.navy : T.border}`, borderRadius: 10,
               padding: '9px 14px', cursor: 'pointer', font: `700 13.5px ${FD}`, minWidth: 46,
               transition: 'all 0.12s ease' }}>
      {label || value}
    </button>
  );
}

function ModeCard({ active, onClick, label, description, icon, accentColor }) {
  const col = accentColor || T.teal;
  const pale = accentColor ? accentColor + '22' : T.tealPale;
  return (
    <button onClick={onClick}
      style={{ background: active ? pale : T.surface, border: `1.5px solid ${active ? col : T.border}`,
               borderRadius: 14, padding: '14px', textAlign: 'left', cursor: 'pointer',
               display: 'flex', gap: 13, alignItems: 'flex-start', transition: 'all 0.15s ease' }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                    background: active ? col : T.surfaceAlt, color: active ? '#fff' : T.navy,
                    display: 'grid', placeItems: 'center' }}>
        <Icon name={icon} size={22} color={active ? '#fff' : T.navy} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ font: `800 16px ${FD}`, color: T.navy, whiteSpace: 'nowrap' }}>Modo {label}</div>
          {active && <Pill color={col} bg={pale}>Activo</Pill>}
        </div>
        <div style={{ font: `400 12.5px/1.45 ${FB}`, color: T.text2, marginTop: 4 }}>{description}</div>
      </div>
    </button>
  );
}

function Checkbox({ checked }) {
  return (
    <div style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${checked ? T.teal : T.border}`,
                  background: checked ? T.teal : T.surface, display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 }}>
      {checked && <Icon name="check" size={13} color="#fff" stroke={2.6} />}
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomeScreen({ mode, setMode, selectedTopics, examSize, setExamSize, soundOn, setSoundOn, onStart, onStartVocab, onOpenTopics }) {
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
      <div style={{ padding: '16px 20px 13px', borderBottom: `1px solid ${T.borderSubtle}`, background: T.bg, position: 'sticky', top: 0, zIndex: 2 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.text2, font: `700 13.5px ${FB}`, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={16} color={T.text2} /></span> Volver
        </button>
        <h2 style={{ font: `800 21px ${FD}`, margin: '9px 0 3px', letterSpacing: '-0.01em', color: T.navy }}>Marca el temario</h2>
        <p style={{ font: `400 12.5px ${FB}`, color: T.text2, margin: 0 }}>
          Las preguntas se sortearán solo entre los kapitler marcados.
        </p>
      </div>

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

// ─── Write input (shared by ExamScreen + VocabTrainer) ────────────────────────
function WriteInput({ value, onChange, onSubmit, disabled, placeholder = 'Escribe la traducción…' }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !disabled) onSubmit(); }}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off" autoCorrect="off" spellCheck="false"
        style={{ flex: 1, padding: '13px 14px', borderRadius: 12, font: `500 15px ${FB}`, color: T.text,
                 background: T.surface, border: `1.5px solid ${disabled ? T.borderSubtle : T.border}`,
                 outline: 'none', transition: 'border-color 0.15s' }}
        onFocus={e => { if (!disabled) e.target.style.borderColor = T.teal; }}
        onBlur={e => { e.target.style.borderColor = disabled ? T.borderSubtle : T.border; }}
      />
      {!disabled && (
        <button onClick={onSubmit}
          style={{ padding: '13px 18px', borderRadius: 12, background: T.teal, color: '#fff',
                   border: 'none', cursor: 'pointer', font: `700 14px ${FD}`, whiteSpace: 'nowrap' }}>
          OK
        </button>
      )}
    </div>
  );
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
    const correct = accepted.some(a => a === typed.toLowerCase().trim().replace(/\s+/g, ' '));
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
          <div style={{ background: result === 'correct' ? T.successLight : T.errorLight,
                        border: `1px solid ${result === 'correct' ? T.success : T.error}33`,
                        borderRadius: 13, padding: '14px 16px' }}>
            <div style={{ font: `800 11px ${FB}`, textTransform: 'uppercase', letterSpacing: '0.07em',
                          color: result === 'correct' ? T.success : T.error, marginBottom: 6,
                          display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon name={result === 'correct' ? 'check' : 'x'} size={14} color={result === 'correct' ? T.success : T.error} stroke={2.4} />
              {result === 'correct' ? '¡Correcto!' : 'Incorrecto'}
            </div>
            {result === 'wrong' && (
              <div style={{ font: `600 14px/1.4 ${FB}`, color: T.text, marginBottom: 4 }}>
                Respuesta correcta: <b>{dir === 'no_to_es' ? item.es : item.no}</b>
              </div>
            )}
            <div style={{ font: `400 12.5px/1.5 ${FB}`, color: T.text2 }}>
              {item.no} = {item.es}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '13px 20px 18px', background: T.bg, borderTop: `1px solid ${T.borderSubtle}` }}>
        {result !== null ? (
          <Btn full variant="vocab" onClick={next}>
            Siguiente palabra <Icon name="arrow" size={17} color="#fff" />
          </Btn>
        ) : (
          <div style={{ font: `500 12px ${FB}`, color: T.text3, textAlign: 'center' }}>
            Escribe la traducción y pulsa OK o Enter
          </div>
        )}
      </div>
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
      <div style={{ padding: '13px 20px 11px', background: T.bg, borderBottom: `1px solid ${T.borderSubtle}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9, gap: 10 }}>
          <button onClick={onAbort} style={{ background: 'none', border: 'none', padding: 0, font: `700 12px ${FB}`, color: T.text2, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Icon name="x" size={14} color={T.text2} /> Salir
          </button>
          <div style={{ font: `800 13px ${FD}`, color: T.text }}>
            <span style={{ color: T.teal }}>{idx + 1}</span>
            <span style={{ color: T.text3 }}> / {total}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pill color={mode === 'exam' ? T.navy : T.teal} bg={mode === 'exam' ? T.navyLight : T.tealPale}>
              {mode === 'exam' ? 'Examen' : 'Estudio'}
            </Pill>
            <SoundToggle on={soundOn} onToggle={() => setSoundOn(s => !s)} />
          </div>
        </div>
        <Progress value={idx + (revealed ? 1 : 0)} max={total} />
      </div>

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
          <div style={{ background: (isWrite ? writeCorrect : selected === q.correct) ? T.successLight : T.errorLight,
                        border: `1px solid ${(isWrite ? writeCorrect : selected === q.correct) ? T.success : T.error}33`,
                        borderRadius: 13, padding: '13px 15px', marginTop: 4 }}>
            <div style={{ font: `800 11px ${FB}`, textTransform: 'uppercase', letterSpacing: '0.07em',
                          color: (isWrite ? writeCorrect : selected === q.correct) ? T.success : T.error,
                          marginBottom: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon name={(isWrite ? writeCorrect : selected === q.correct) ? 'check' : 'x'} size={14}
                    color={(isWrite ? writeCorrect : selected === q.correct) ? T.success : T.error} stroke={2.4} />
              {(isWrite ? writeCorrect : selected === q.correct) ? 'Correcto' : 'Incorrecto'}
            </div>
            <div style={{ font: `400 13px/1.55 ${FB}`, color: T.text }}>{q.explanation}</div>
            <div><SourceRef source={window.sourceFor(q)} /></div>
          </div>
        )}
      </div>

      {mode === 'study' && (
        <div style={{ padding: '13px 20px 18px', background: T.bg, borderTop: `1px solid ${T.borderSubtle}` }}>
          {revealed ? (
            <Btn full onClick={() => goNext()}>
              {idx + 1 === total ? 'Ver resultado' : 'Siguiente'} <Icon name="arrow" size={17} color="#fff" />
            </Btn>
          ) : (
            <div style={{ font: `500 12px ${FB}`, color: T.text3, textAlign: 'center' }}>
              {isWrite ? 'Escribe la traducción y pulsa OK o Enter' : 'Elige una respuesta para ver la explicación'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function labelType(t) {
  return ({ vocab: 'Vocabulario', grammar: 'Gramática', noun: 'Sustantivos', phrase: 'Frases', numbers: 'Números', write: 'Escritura' })[t] || t;
}

function OptionRow({ letter, label, selected, correct, wrong, dim, onClick, disabled }) {
  let bg = T.surface, border = T.border, badgeBg = T.surfaceAlt, badgeColor = T.text2;
  if (correct)      { bg = T.successLight; border = T.success; badgeBg = T.success; badgeColor = '#fff'; }
  else if (wrong)   { bg = T.errorLight;   border = T.error;   badgeBg = T.error;   badgeColor = '#fff'; }
  else if (selected){ border = T.teal;     bg = T.tealPale;    badgeBg = T.teal;    badgeColor = '#fff'; }
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 13, padding: '12px 13px',
               textAlign: 'left', cursor: disabled ? 'default' : 'pointer',
               display: 'flex', gap: 12, alignItems: 'flex-start', opacity: dim ? 0.5 : 1, transition: 'all 0.15s ease' }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: badgeBg, color: badgeColor, display: 'grid', placeItems: 'center', font: `800 13px ${FD}` }}>{letter}</div>
      <div style={{ flex: 1, font: `500 14px/1.4 ${FB}`, color: T.text, textWrap: 'pretty', paddingTop: 4 }}>{label}</div>
    </button>
  );
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
      <div style={{ padding: '17px 20px 14px', background: passed ? T.navy : T.error, color: '#fff' }}>
        <div style={{ font: `800 10.5px ${FB}`, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.7)' }}>
          Resultado · {mode === 'exam' ? 'Examen' : 'Práctica'}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6 }}>
          <div style={{ font: `800 46px ${FD}`, letterSpacing: '-0.03em', lineHeight: 1 }}>{pct}%</div>
          <Pill color="#fff" bg="rgba(255,255,255,0.18)">{passed ? 'Aprobado' : 'A repasar'}</Pill>
        </div>
        <div style={{ font: `400 13px ${FB}`, color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>
          {correct} de {total} correctas{timeUsed != null && ` · ${fmtTime(timeUsed)}`} · Aprobado desde 60%
        </div>
      </div>

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

      <div style={{ padding: '13px 20px 18px', background: T.bg, borderTop: `1px solid ${T.borderSubtle}`, display: 'flex', gap: 10 }}>
        <Btn variant="ghost" onClick={onHome} style={{ flex: 1 }}>Inicio</Btn>
        <Btn variant="primary" onClick={onRestart} style={{ flex: 1.3 }}>Nuevo intento</Btn>
      </div>
    </div>
  );
}

// ─── App shell ────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ "accent": "#2F2B7D", "questionScale": 19 }/*EDITMODE-END*/;

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState('home');
  const [mode, setMode] = useState('study');

  // k1-9 on by default; k10-13 off by default
  const defaultTopics = window.TOPICS.filter(t => t.defaultOn).map(t => t.id);
  const [selectedTopics, setSelectedTopics] = useState(defaultTopics);

  const [examSize, setExamSize] = useState(25);
  const [examQuestions, setExamQuestions] = useState([]);
  const [examAnswers, setExamAnswers] = useState([]);
  const [timeUsed, setTimeUsed] = useState(null);
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem('norsk_sound') !== 'off'; } catch { return true; }
  });
  useEffect(() => { try { localStorage.setItem('norsk_sound', soundOn ? 'on' : 'off'); } catch {} }, [soundOn]);

  T.accent = tw.accent; T.navy = tw.accent;

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

  let content;
  if (screen === 'home') {
    content = <HomeScreen mode={mode} setMode={setMode} selectedTopics={selectedTopics}
                examSize={examSize} setExamSize={setExamSize} soundOn={soundOn} setSoundOn={setSoundOn}
                onStart={startExam} onStartVocab={startVocab} onOpenTopics={() => setScreen('topics')} />;
  } else if (screen === 'topics') {
    content = <TopicsScreen selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} onBack={() => setScreen('home')} />;
  } else if (screen === 'vocab') {
    content = <VocabTrainer selectedTopics={selectedTopics} soundOn={soundOn} setSoundOn={setSoundOn} onExit={() => setScreen('home')} />;
  } else if (screen === 'exam') {
    content = <ExamScreen mode={mode} questions={examQuestions} soundOn={soundOn} setSoundOn={setSoundOn} onFinish={finishExam} onAbort={abortExam} />;
  } else if (screen === 'results') {
    content = <ResultsScreen questions={examQuestions} answers={examAnswers} mode={mode} timeUsed={timeUsed} soundOn={soundOn} onRestart={() => setScreen('home')} onHome={() => setScreen('home')} />;
  }

  if (!EMBEDDED) {
    return (
      <div className="app-root" data-screen-label={`Norsk A1/A2 · ${screen}`}
        style={{ '--qscale': `${tw.questionScale}px`, height: '100dvh', display: 'flex', justifyContent: 'center', background: T.bg }}>
        <div style={{ width: '100%', maxWidth: 480, height: '100dvh', background: T.bg, fontFamily: FB, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 0 40px rgba(0,0,0,0.06)' }}>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stage">
      <div data-screen-label={`Norsk A1/A2 · ${screen}`} className="app-root" style={{ '--qscale': `${tw.questionScale}px` }}>
        <AndroidDevice width={412} height={892}>
          <div style={{ height: '100%', background: T.bg, fontFamily: FB }}>
            {content}
          </div>
        </AndroidDevice>
      </div>
      <div className="annotation">
        <h4>Norsk A1/A2 · App de examen · {window.APP_VERSION}</h4>
        <p style={{ margin: 0 }}>
          <strong>Estudio:</strong> explicación tras cada pregunta.<br />
          <strong>Examen:</strong> corrección solo al final. Preguntas MCQ + escritura intercaladas.<br />
          <strong>Vocabulario:</strong> modo libre de traducción noruego ↔ español.<br /><br />
          Banco: <strong>{window.ALL_QUESTIONS.length}</strong> preguntas · <strong>{(window.VOCAB||[]).length}</strong> palabras · <strong>{window.TOPICS.length}</strong> kapitler.
        </p>
      </div>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Marca" />
        <TweakColor label="Color principal" value={tw.accent}
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
