// Norsk A1/A2 — combina todos los bancos y define los kapitler (temas).
(function() {
  const all = [].concat(
    window.QUESTIONS_K1_3  || [],
    window.QUESTIONS_K4_6  || [],
    window.QUESTIONS_K7_9  || [],
    window.QUESTIONS_K10_13 || []
  );
  all.forEach((q, i) => { if (!q.id) q.id = i + 1; });
  window.ALL_QUESTIONS = all;

  // Kapitler 1-9 (A1) y 10-13 (A2).
  // defaultOn: false → el kapittel aparece desmarcado al arrancar la app.
  window.TOPICS = [
    { id: 1,  name: 'Kapittel 1',  short: 'Hilsen, pronomen, å være/bo/hete, ordstilling',          dates: ['07.10.2025', '14.10.2025'],                                               defaultOn: true  },
    { id: 2,  name: 'Kapittel 2',  short: 'Hverdag, yrker, artikler en/ei/et, objektspronomen',       dates: ['21.10.2025', '28.10.2025', '04.11.2025'],                                 defaultOn: true  },
    { id: 3,  name: 'Kapittel 3',  short: 'Døgnet, klokka, rutiner, refleksiv (seg), substantiv',    dates: ['11.11.2025', '18.11.2025', '25.11.2025', '02.12.2025'],                   defaultOn: true  },
    { id: 4,  name: 'Kapittel 4',  short: 'Fritid, infinitiv, modalverb, framtid, å bli',            dates: ['02.12.2025', '09.12.2025', '16.12.2025'],                                 defaultOn: true  },
    { id: 5,  name: 'Kapittel 5',  short: 'Familie, mat, substantivbøying, preposisjoner, posisjon', dates: ['13.01.2026', '20.01.2026', '27.01.2026', '03.02.2026'],                   defaultOn: true  },
    { id: 6,  name: 'Kapittel 6',  short: 'Klær, shopping, adjektiv, demonstrativ, imperativ',       dates: ['17.02.2026', '24.02.2026', '03.03.2026'],                                 defaultOn: true  },
    { id: 7,  name: 'Kapittel 7',  short: 'Bolig, datoer, possessiver (min/sin), hvor lang tid/langt', dates: ['10.03.2026', '17.03.2026', '23.03.2026', '07.04.2026'],                 defaultOn: true  },
    { id: 8,  name: 'Kapittel 8',  short: 'Preteritum (fortid), tidsuttrykk, jobb/CV, fordi vs for å', dates: ['14.04.2026', '21.04.2026'],                                            defaultOn: true  },
    { id: 9,  name: 'Kapittel 9',  short: 'Vær, årstider, leddsetninger (fordi/at/om), tro/synes',   dates: ['05.05.2026', '12.05.2026', '19.05.2026', '26.05.2026'],                   defaultOn: true  },
    { id: 10, name: 'Kapittel 10', short: 'Litt om Norge: geografi, natur, transport',               dates: ['A2'],  defaultOn: false },
    { id: 11, name: 'Kapittel 11', short: 'Språkpraksis: jobb, følelser, flyktninger',               dates: ['A2'],  defaultOn: false },
    { id: 12, name: 'Kapittel 12', short: 'Livsstil, kropp og helse, legebesøk',                     dates: ['A2'],  defaultOn: false },
    { id: 13, name: 'Kapittel 13', short: 'På hotellet: innsjekk, rom, reise',                       dates: ['A2'],  defaultOn: false },
  ];

  window.TOPIC_COUNTS = {};
  window.TOPICS.forEach(t => {
    window.TOPIC_COUNTS[t.id] = all.filter(q => q.topic === t.id).length;
  });

  // Devuelve la(s) fecha(s) donde se encuentra una pregunta.
  window.sourceFor = function(q) {
    if (q.source) return q.source;
    const t = window.TOPICS.find(x => x.id === q.topic);
    if (!t) return '';
    return t.dates[0] === 'A2' ? 'Nivel A2' : t.dates.join(', ');
  };

  // Convierte un item de VOCAB en una write-question para el examen.
  // direction: 'no_to_es' | 'es_to_no' | random (undefined)
  window.vocabToWriteQ = function(v, direction) {
    const dir = direction || (Math.random() < 0.5 ? 'no_to_es' : 'es_to_no');
    const isNoun = v.type === 'noun';
    if (dir === 'no_to_es') {
      return {
        id:   'wq_' + v.no.replace(/\s+/g, '_'),
        topic: v.topic,
        type: 'write',
        q:    '¿Qué significa «' + v.no + '» en español?',
        answer: v.es,
        acceptedAnswers: _normAnswers(v.es),
        explanation: '«' + v.no + '» = ' + v.es,
      };
    } else {
      const hint = isNoun ? ' (incluye el artículo: en / ei / et)' : '';
      return {
        id:   'wq_' + v.no.replace(/\s+/g, '_') + '_r',
        topic: v.topic,
        type: 'write',
        q:    '¿Cómo se dice en noruego «' + v.es + '»?' + hint,
        answer: v.no,
        acceptedAnswers: _normAnswers(v.no),
        explanation: '«' + v.no + '» = ' + v.es,
      };
    }
  };

  function _normAnswers(text) {
    const base = [text.toLowerCase().trim()];
    // Accept both with and without leading article
    const noArticle = text.replace(/^(en|ei|et|å)\s+/i, '').toLowerCase().trim();
    if (noArticle !== base[0]) base.push(noArticle);
    // Accept without parenthetical
    const noParen = text.replace(/\s*\(.*?\)/g, '').toLowerCase().trim();
    if (noParen !== base[0]) base.push(noParen);
    return base;
  }
  window._normAnswers = _normAnswers;

  window.APP_VERSION = 'v2.0.0';
})();
