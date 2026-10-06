// Norsk — Minigrammatikk (gramática A2). Transcrito de las páginas del libro
// (pics/WhatsApp Image …). Cubre leddsetninger, som-setninger, ordstilling y
// spørreord. Pensado como referencia para los kapitler A2.
//
// Estructura: cada tema tiene `blocks`, cada bloque es uno de:
//   { type: 'text',  text }                          → párrafo
//   { type: 'rule',  text }                          → regla destacada
//   { type: 'chips', items: [...] }                  → lista de palabras clave
//   { type: 'pairs', label?, pairs: [{a, b}] }       → frase principal + leddsetning (b)
//   { type: 'table', headers: [...], rows: [[...]] } → tabla de orden de palabras

(function () {
  window.GRAMMAR = [
    {
      id: 'leddsetninger',
      title: 'Leddsetninger',
      subtitle: 'Oraciones subordinadas',
      blocks: [
        { type: 'text', text: 'Algunos elementos de la oración (sobre todo el adverbial y el objeto) pueden ser a su vez una oración con sujeto y verbo. Esa oración que forma parte de una principal (helsetning) se llama leddsetning (oración subordinada).' },
        { type: 'pairs', label: 'Adverbial', pairs: [
          { a: 'Hun kom hit', b: 'for ti år siden.', sub: false },
          { a: 'Hun kom hit', b: 'da hun var liten.', sub: true },
          { a: 'De skal besøke oss', b: 'til sommeren.', sub: false },
          { a: 'De skal besøke oss', b: 'når det blir varmere.', sub: true },
        ] },
        { type: 'pairs', label: 'Objekt', pairs: [
          { a: 'Han forteller', b: 'en spennende historie.', sub: false },
          { a: 'Han forteller', b: 'at han har sett hval.', sub: true },
        ] },
        { type: 'rule', text: 'Las leddsetninger suelen empezar con una subjunksjon (conjunción subordinante).' },
        { type: 'text', text: 'Subjunksjoner habituales en leddsetninger:' },
        { type: 'chips', items: ['at', 'om', 'når', 'da', 'fordi', 'hvis', 'selv om'] },
        { type: 'pairs', pairs: [
          { a: 'Hun sier', b: 'at hun skal til byen.', sub: true },
          { a: 'De spør', b: 'om vi kan komme.', sub: true },
          { a: 'Vi kommer', b: 'når det blir varmt.', sub: true },
          { a: 'Det snødde', b: 'da de kom hit.', sub: true },
          { a: 'De skal flytte', b: 'fordi hun har fått ny jobb.', sub: true },
          { a: 'Jeg kommer i dag', b: 'hvis jeg får tid.', sub: true },
          { a: 'Han er på jobben', b: 'selv om han er syk.', sub: true },
        ] },
        { type: 'rule', text: 'A menudo se omite «at» después de verbos como tror y synes: Jeg tror (at) de kommer i morgen. Jeg synes (at) det er kaldt her.' },
      ],
    },
    {
      id: 'som-setninger',
      title: 'Som-setninger',
      subtitle: 'Oraciones de relativo',
      blocks: [
        { type: 'text', text: 'Las som-setninger dan más información sobre un sustantivo de la oración principal. «Som» es subjunksjon en la leddsetning y sustituye a un elemento de esa subordinada:' },
        { type: 'pairs', pairs: [
          { a: 'Hun har en bil. Den er svart.', b: 'Hun har en bil som er svart.', sub: true },
          { a: 'Hun har en bil. Hun liker den.', b: 'Hun har en bil som hun liker.', sub: true },
        ] },
      ],
    },
    {
      id: 'ordstilling',
      title: 'Ordstilling i leddsetninger',
      subtitle: 'Orden de palabras en subordinadas',
      blocks: [
        { type: 'text', text: 'El orden de palabras en las leddsetninger puede ser distinto al de las helsetninger.' },
        { type: 'rule', text: 'En la leddsetning, el sujeto va justo después de la subjunksjon, y los adverbios de oración (ikke, aldri, alltid…) van DELANTE del verbo.' },
        { type: 'table',
          headers: ['Helsetning', 'Subjunksjon', 'Subjekt', 'Adverbial', 'Verbal', 'Objekt/predikativ'],
          rows: [
            ['Hun sier', 'at', 'hun', '', 'drikker', 'te'],
            ['Han spør', 'om', 'vi', '', 'har drukket', 'te'],
            ['Vi kan besøke dem', 'hvis', 'de', 'ikke', 'er', 'syke.'],
            ['Hun trener', 'selv om', 'hun', 'aldri', 'har', 'lyst.'],
            ['De lurer på', 'hvorfor', 'hun', 'alltid', 'kommer', ''],
            ['De har en leilighet', 'som', 'de', 'ikke', 'liker.', ''],
          ],
        },
      ],
    },
    {
      id: 'sporreord',
      title: 'Spørreord',
      subtitle: 'Interrogativos en subordinadas',
      blocks: [
        { type: 'text', text: 'Los spørreord (hva, hvor, når, hvorfor…) pueden introducir tanto helsetninger como leddsetninger. Fíjate en que el orden de palabras cambia.' },
        { type: 'rule', text: 'En la helsetning el verbo va después del spørreord. En la leddsetning el sujeto va primero.' },
        { type: 'pairs', label: 'Helsetning → Leddsetning', pairs: [
          { a: 'Når kommer bussen?', b: 'Hun spør når bussen kommer.', sub: true },
          { a: 'Hva gjør de?', b: 'Hun spør hva de gjør.', sub: true },
          { a: 'Hvorfor kommer han ikke?', b: 'Hun spør hvorfor han ikke kommer.', sub: true },
        ] },
      ],
    },
  ];
})();
