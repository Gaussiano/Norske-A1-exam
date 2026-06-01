// Norsk A1 — combina todos los bancos y define los kapitler (temas).
(function() {
  const all = [].concat(
    window.QUESTIONS_K1_3 || [],
    window.QUESTIONS_K4_6 || [],
    window.QUESTIONS_K7_9 || []
  );
  all.forEach((q, i) => { q.id = i + 1; });
  window.ALL_QUESTIONS = all;

  // Cada kapittel mapea a las fechas (notas .docx) donde está la materia.
  window.TOPICS = [
    { id: 1, name: 'Kapittel 1', short: 'Hilsen, pronomen, å være/bo/hete, ordstilling', dates: ['07.10.2025', '14.10.2025'] },
    { id: 2, name: 'Kapittel 2', short: 'Hverdag, yrker, artikler en/ei/et, objektspronomen', dates: ['21.10.2025', '28.10.2025', '04.11.2025'] },
    { id: 3, name: 'Kapittel 3', short: 'Døgnet, klokka, rutiner, refleksiv (seg), substantiv', dates: ['11.11.2025', '18.11.2025', '25.11.2025', '02.12.2025'] },
    { id: 4, name: 'Kapittel 4', short: 'Fritid, infinitiv, modalverb, framtid, å bli', dates: ['02.12.2025', '09.12.2025', '16.12.2025'] },
    { id: 5, name: 'Kapittel 5', short: 'Familie, mat, substantivbøying, preposisjoner, posisjon', dates: ['13.01.2026', '20.01.2026', '27.01.2026', '03.02.2026'] },
    { id: 6, name: 'Kapittel 6', short: 'Klær, shopping, adjektiv, demonstrativ, imperativ', dates: ['17.02.2026', '24.02.2026', '03.03.2026'] },
    { id: 7, name: 'Kapittel 7', short: 'Bolig, datoer, possessiver (min/sin), hvor lang tid/langt', dates: ['10.03.2026', '17.03.2026', '23.03.2026', '07.04.2026'] },
    { id: 8, name: 'Kapittel 8', short: 'Preteritum (fortid), tidsuttrykk, jobb/CV, fordi vs for å', dates: ['14.04.2026', '21.04.2026'] },
    { id: 9, name: 'Kapittel 9', short: 'Vær, årstider, leddsetninger (fordi/at/om), tro/synes', dates: ['05.05.2026', '12.05.2026', '19.05.2026', '26.05.2026'] }
  ];

  window.TOPIC_COUNTS = {};
  window.TOPICS.forEach(t => {
    window.TOPIC_COUNTS[t.id] = all.filter(q => q.topic === t.id).length;
  });

  // Devuelve la(s) fecha(s) donde se encuentra una pregunta. Prioriza el campo
  // "source" propio de la pregunta; si no, cae a las fechas del kapittel.
  window.sourceFor = function(q) {
    if (q.source) return q.source;
    const t = window.TOPICS.find(x => x.id === q.topic);
    return t ? t.dates.join(', ') : '';
  };

  window.APP_VERSION = 'v1.1.0';
})();
