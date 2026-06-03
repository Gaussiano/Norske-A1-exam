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
    { id: 1,  name: 'Kapittel 1',  short: 'Hilsen, pronomen, å være/bo/hete, ordstilling',            dates: ['07.10.2025', '14.10.2025'],                                               defaultOn: true  },
    { id: 2,  name: 'Kapittel 2',  short: 'Hverdag, yrker, artikler en/ei/et, objektspronomen',         dates: ['21.10.2025', '28.10.2025', '04.11.2025'],                                 defaultOn: true  },
    { id: 3,  name: 'Kapittel 3',  short: 'Døgnet, klokka, rutiner, refleksiv (seg), substantiv',      dates: ['11.11.2025', '18.11.2025', '25.11.2025', '02.12.2025'],                   defaultOn: true  },
    { id: 4,  name: 'Kapittel 4',  short: 'Fritid, infinitiv, modalverb, framtid, å bli',              dates: ['02.12.2025', '09.12.2025', '16.12.2025'],                                 defaultOn: true  },
    { id: 5,  name: 'Kapittel 5',  short: 'Familie, mat, substantivbøying, preposisjoner, posisjon',   dates: ['13.01.2026', '20.01.2026', '27.01.2026', '03.02.2026'],                   defaultOn: true  },
    { id: 6,  name: 'Kapittel 6',  short: 'Klær, shopping, adjektiv, demonstrativ, imperativ',         dates: ['17.02.2026', '24.02.2026', '03.03.2026'],                                 defaultOn: true  },
    { id: 7,  name: 'Kapittel 7',  short: 'Bolig, datoer, possessiver (min/sin), hvor lang tid/langt', dates: ['10.03.2026', '17.03.2026', '23.03.2026', '07.04.2026'],                   defaultOn: true  },
    { id: 8,  name: 'Kapittel 8',  short: 'Preteritum (fortid), tidsuttrykk, jobb/CV, fordi vs for å', dates: ['14.04.2026', '21.04.2026'],                                              defaultOn: true  },
    { id: 9,  name: 'Kapittel 9',  short: 'Vær, årstider, leddsetninger (fordi/at/om), tro/synes',     dates: ['05.05.2026', '12.05.2026', '19.05.2026', '26.05.2026'],                   defaultOn: true  },
    { id: 10, name: 'Kapittel 10', short: 'Litt om Norge: geografi, natur, transport',                 dates: ['A2'],  defaultOn: false },
    { id: 11, name: 'Kapittel 11', short: 'Språkpraksis: jobb, følelser, flyktninger',                 dates: ['A2'],  defaultOn: false },
    { id: 12, name: 'Kapittel 12', short: 'Livsstil, kropp og helse, legebesøk',                       dates: ['A2'],  defaultOn: false },
    { id: 13, name: 'Kapittel 13', short: 'På hotellet: innsjekk, rom, reise',                         dates: ['A2'],  defaultOn: false },
  ];

  window.TOPIC_COUNTS = {};
  window.TOPICS.forEach(t => {
    window.TOPIC_COUNTS[t.id] = all.filter(q => q.topic === t.id).length;
  });

  window.sourceFor = function(q) {
    if (q.source) return q.source;
    const t = window.TOPICS.find(x => x.id === q.topic);
    if (!t) return '';
    return t.dates[0] === 'A2' ? 'Nivel A2' : t.dates.join(', ');
  };

  // ── _normAnswers ──────────────────────────────────────────────────────────
  // Returns all acceptable lowercase variants of an answer string.
  // Handles: /a gender suffixes, parentheticals, no-article forms, NO definite.
  function _normAnswers(text) {
    var results = [];
    function add(s) {
      s = s.toLowerCase().replace(/\s+/g, ' ').trim();
      if (s && results.indexOf(s) === -1) results.push(s);
    }

    add(text);

    // 1. Without leading article (en/ei/et/å)
    var noArt = text.replace(/^(en|ei|et|å)\s+/i, '').trim();
    add(noArt);

    // 2. Without parenthetical  e.g. "vivir / residir"  →  also "vivir"
    var noParen = text.replace(/\s*\(.*?\)/g, '').trim();
    add(noParen);
    add(noParen.replace(/^(en|ei|et|å)\s+/i, '').trim());

    // 3. Gender /a /as /e /es suffix  e.g. "barato/a" → "barato", "barata"
    //    Only applies when the segment after "/" is ≤ 4 chars (suffix, not full word)
    var slashIdx = text.indexOf('/');
    if (slashIdx !== -1) {
      var left  = text.slice(0, slashIdx).trim();
      var right = text.slice(slashIdx + 1).trim();
      add(left);
      if (right.length <= 4 && /^[aeosu]s?$/.test(right)) {
        // Build feminine: drop last vowel of left + append suffix
        var base = left.replace(/[aeiou]$/i, '');
        add(base + right);
      } else {
        // Full synonym after slash (e.g. "un trabajo / un empleo")
        add(right);
        add(right.replace(/^(el|la|los|las|un|una|unos|unas)\s+/i, ''));
      }
    }

    // 4. For Norwegian nouns: accept definite form (høst → høsten, hus → huset, hytte → hytta)
    //    Only add when noArt is a single word > 2 chars
    var stem = noArt.toLowerCase().replace(/^(en|ei|et)\s+/i, '').trim();
    if (stem && stem.length > 2 && !/\s/.test(stem)) {
      add(stem + 'en');   // masculine definite
      add(stem + 'et');   // neuter definite
      add(stem + 'a');    // feminine definite
      // Also add stem alone (without any article)
      add(stem);
    }

    // 5. Spanish: strip common articles to accept both "el verano" and "verano"
    var noSpArt = text.replace(/^(el|la|los|las|un|una|unos|unas)\s+/i, '').trim();
    add(noSpArt);
    // Also handle "un trabajo" → accept "trabajo"
    var noSpArtSlash = noSpArt.replace(/\s*\/.*$/, '').trim();
    add(noSpArtSlash);

    return results.filter(function(s) { return s.length > 0; });
  }
  window._normAnswers = _normAnswers;

  // ── vocabToWriteQ ─────────────────────────────────────────────────────────
  // Creates a write-type question from a vocab item.
  // Accepts synonyms: if another VOCAB entry shares the same ES (or NO) translation,
  // both are included as accepted answers.
  window.vocabToWriteQ = function(v, direction) {
    var dir = direction || (Math.random() < 0.5 ? 'no_to_es' : 'es_to_no');
    var isNoun = v.type === 'noun';
    var allVocab = window.VOCAB || [];

    if (dir === 'no_to_es') {
      return {
        id:   'wq_' + v.no.replace(/[\s/]+/g, '_'),
        topic: v.topic,
        type: 'write',
        q:    '¿Qué significa «' + v.no + '» en español?',
        answer: v.es,
        acceptedAnswers: _normAnswers(v.es),
        explanation: '«' + v.no + '» = ' + v.es,
      };
    } else {
      var hint = isNoun ? ' (incluye el artículo: en / ei / et)' : '';

      // Normalize v.es for synonym lookup: strip articles, lowercase
      var esKey = v.es.toLowerCase()
        .replace(/^(el|la|los|las|un|una|unos|unas)\s+/, '')
        .replace(/\s*\/.*$/, '')
        .trim();

      // Find other vocab entries whose ES key matches
      var synonymsNO = allVocab
        .filter(function(x) {
          if (x.no === v.no) return false;
          var xKey = x.es.toLowerCase()
            .replace(/^(el|la|los|las|un|una|unos|unas)\s+/, '')
            .replace(/\s*\/.*$/, '')
            .trim();
          return xKey === esKey;
        })
        .map(function(x) { return x.no; });

      // Collect all accepted NO answers (primary + synonyms)
      var allNO = [v.no].concat(synonymsNO);
      var accepted = [];
      allNO.forEach(function(n) {
        _normAnswers(n).forEach(function(a) {
          if (accepted.indexOf(a) === -1) accepted.push(a);
        });
      });

      var synNote = synonymsNO.length
        ? ' (también vale: ' + synonymsNO.slice(0, 2).join(', ') + ')'
        : '';

      return {
        id:   'wq_' + v.no.replace(/[\s/]+/g, '_') + '_r',
        topic: v.topic,
        type: 'write',
        q:    '¿Cómo se dice en noruego «' + v.es + '»?' + hint,
        answer: v.no,
        acceptedAnswers: accepted,
        explanation: '«' + v.no + '» = ' + v.es + synNote,
      };
    }
  };

  window.APP_VERSION = 'v2.1.0';
})();
