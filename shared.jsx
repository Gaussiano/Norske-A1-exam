// Norsk A1/A2 — shared UI kit (used by the Verb module and the Preposisjoner module).
// Tokens, sound, helpers and reusable components. Loaded before app.jsx.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const FD = "'Nunito', system-ui, sans-serif";   // display / headings
const FB = "'Noto Sans', system-ui, sans-serif"; // body

// True inside the Claude Design host (iframe); false when deployed/opened directly.
const EMBEDDED = (() => { try { return window.self !== window.top; } catch { return true; } })();

// ─── Design tokens ────────────────────────────────────────────────────────────
// The module palette (navy* / teal*) points at CSS variables, defined per module
// in index.html under [data-module="verb"] and [data-module="preposisjoner"].
// The names are historical: in the Preposisjoner module "navy" renders green.
const T = {
  bg: '#F4F6F8', surface: '#ffffff', surfaceAlt: '#F0F3F5',
  border: '#DCE3E6', borderSubtle: '#E8EDEF',
  text: '#1C2230', text2: '#5A6472', text3: '#97A1AD',
  navy: 'var(--c-primary)', navyInk: 'var(--c-primary-ink)', navyLight: 'var(--c-primary-light)',
  teal: 'var(--c-accent)', tealLight: 'var(--c-accent-2)', tealPale: 'var(--c-accent-pale)',
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
  const t = norm(typed);
  const accepted = (q.acceptedAnswers || window._normAnswers(q.answer));
  return accepted.some(a => norm(a) === t);
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
    search:   <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></>,
    list:     <><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></>,
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

// Small reference card (Diccionario / Gramática) shown under "Temario incluido".
function RefButton({ icon, label, sub, onClick }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 13,
               padding: '11px 12px', cursor: 'pointer', textAlign: 'left',
               display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: T.navyLight, color: T.navy,
                    display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={17} color={T.navy} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ font: `700 13px ${FD}`, color: T.text }}>{label}</div>
        {sub && <div style={{ font: `400 10.5px ${FB}`, color: T.text3, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
      </div>
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

// ─── Shared building blocks (Verb + Preposisjoner) ────────────────────────────
// Answer normalisation: case-insensitive, trimmed, inner spaces collapsed.
const norm = (s) => String(s == null ? '' : s).toLowerCase().trim().replace(/\s+/g, ' ');

// useState persisted in localStorage as JSON (same store as 'norsk_sound').
// Each module uses its own key prefix so their progress never mixes.
function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw == null ? initial : JSON.parse(raw); } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}

// Sticky header with "Volver" for secondary screens (temario, diccionario, filtros…).
function BackHeader({ title, subtitle, onBack, children }) {
  return (
    <div style={{ padding: '16px 20px 13px', borderBottom: `1px solid ${T.borderSubtle}`, background: T.bg, position: 'sticky', top: 0, zIndex: 2 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.text2, font: `700 13.5px ${FB}`, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={16} color={T.text2} /></span> Volver
      </button>
      <h2 style={{ font: `800 21px ${FD}`, margin: '9px 0 3px', letterSpacing: '-0.01em', color: T.navy }}>{title}</h2>
      {subtitle && (
        <p style={{ font: `400 12.5px ${FB}`, color: T.text2, margin: children ? '0 0 11px' : 0 }}>{subtitle}</p>
      )}
      {children}
    </div>
  );
}

// Header of a running session: Salir · n / total · mode pill · sound, plus progress bar.
function SessionHeader({ onExit, current, total, pill, pillColor = T.teal, pillBg = T.tealPale, soundOn, setSoundOn, progress }) {
  return (
    <div style={{ padding: '13px 20px 11px', background: T.bg, borderBottom: `1px solid ${T.borderSubtle}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9, gap: 10 }}>
        <button onClick={onExit} style={{ background: 'none', border: 'none', padding: 0, font: `700 12px ${FB}`, color: T.text2, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Icon name="x" size={14} color={T.text2} /> Salir
        </button>
        <div style={{ font: `800 13px ${FD}`, color: T.text }}>
          <span style={{ color: T.teal }}>{current}</span>
          <span style={{ color: T.text3 }}> / {total}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Pill color={pillColor} bg={pillBg}>{pill}</Pill>
          <SoundToggle on={soundOn} onToggle={() => setSoundOn(s => !s)} />
        </div>
      </div>
      <Progress value={progress} max={total} />
    </div>
  );
}

// Correct / incorrect panel shown after answering.
function FeedbackBox({ correct, label, children, style }) {
  const col = correct ? T.success : T.error;
  return (
    <div style={{ background: correct ? T.successLight : T.errorLight, border: `1px solid ${col}33`,
                  borderRadius: 13, padding: '13px 15px', ...style }}>
      <div style={{ font: `800 11px ${FB}`, textTransform: 'uppercase', letterSpacing: '0.07em',
                    color: col, marginBottom: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name={correct ? 'check' : 'x'} size={14} color={col} stroke={2.4} />
        {label || (correct ? 'Correcto' : 'Incorrecto')}
      </div>
      {children}
    </div>
  );
}

// Coloured score banner at the top of a results screen.
function ResultHero({ label, pct, passed, summary }) {
  return (
    <div style={{ padding: '17px 20px 14px', background: passed ? T.navy : T.error, color: '#fff' }}>
      <div style={{ font: `800 10.5px ${FB}`, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.7)' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6 }}>
        <div style={{ font: `800 46px ${FD}`, letterSpacing: '-0.03em', lineHeight: 1 }}>{pct}%</div>
        <Pill color="#fff" bg="rgba(255,255,255,0.18)">{passed ? 'Aprobado' : 'A repasar'}</Pill>
      </div>
      <div style={{ font: `400 13px ${FB}`, color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>{summary}</div>
    </div>
  );
}

// Bottom action bar of a session / results screen.
function FooterBar({ children, style }) {
  return (
    <div style={{ padding: '13px 20px 18px', background: T.bg, borderTop: `1px solid ${T.borderSubtle}`, ...style }}>
      {children}
    </div>
  );
}

function FooterHint({ children }) {
  return <div style={{ font: `500 12px ${FB}`, color: T.text3, textAlign: 'center' }}>{children}</div>;
}
