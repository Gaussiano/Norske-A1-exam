// Norsk — Ordliste (diccionario del libro), Del 1: ordliste for kapitlene.
// Transcrito de las páginas del libro (carpeta pics/ordbook_*).
// Estructura: kapittel → secciones (1(1), 1(2)…) → palabras noruegas tal cual
// aparecen en el libro. El cuestionario cubre kap. 1–13; el diccionario incluye
// todo el libro (kap. 1–16).
//
// Nota: la página de kap. 11(3)–12(5) llegó girada/borrosa, así que esas
// secciones están marcadas como `partial: true` (lista incompleta).

(function () {
  window.DICTIONARY = [
    {
      kapittel: 1, title: 'Hva heter du?',
      sections: [
        { id: '1(1)', words: ['Hva heter du?', 'Hvor kommer du fra?', 'hva', 'heter', 'du', 'hvor', 'kommer', 'fra'] },
        { id: '1(2)', words: ['Hei!', 'Jeg heter…', 'Jeg er fra …', 'jeg', 'er', 'nå', 'bor', 'i', 'snakker', 'norsk', 'engelsk', 'og', 'litt', 'polsk', 'Hallo', 'spansk', 'tysk', 'portugisisk', 'land', 'språk', 'offisielle', 'noen andre'] },
        { id: '1(3)', words: ['hun', 'journalist', 'Jeg er norsk', 'han', 'dere', 'vi', 'hvilke språk', 'unnskyld', 'på norsk', 'arabisk', 'ja', 'de'] },
        { id: '1(4)', words: ['det', 'hvordan', 'staver', 'forstår', 'ikke', 'betyr', 'skriver', 'skriver med k', 'eller', 'nei', 'hyggelig', 'Hyggelig å treffe deg.', 'I like måte'] },
      ],
    },
    {
      kapittel: 2, title: 'Hva gjør du?',
      sections: [
        { id: '2(1)', words: ['gjør', 'vasker', 'lager', 'mat', 'leser', 'går på norskkurs', 'telefonen', 'lærer', 'på pc', 'spiser', 'ser', 'tv', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag'] },
        { id: '2(2)', words: ['Hvordan går det?', 'Ganske bra', 'takk', 'når', 'i klassen', 'lærer', 'Sånn passe', 'Er det vanskelig?', 'alt', 'blir sliten', 'Lykke til', 'Takk for det', 'Hyggelig å snakke med deg.', 'Ha det bra', 'bra'] },
        { id: '2(3)', words: ['Det går fint.', 'fint', 'deg', 'veldig', 'mye', 'men', 'spør', 'hver', 'dag', 'Tusen takk.', 'De er gift.'] },
        { id: '2(4)', words: ['på jobben', 'hotell', 'sjef, hotellsjef', 'har mye å gjøre', 'liker', 'kokk', 'jobber', 'også', 'god', 'renholder', 'støvsuger', 'rydder', 'resepsjonist', 'student', 'studerer', 'økonomi', 'der', 'servitør', 'gresk', 'italiensk', 'avis', 'en skole'] },
        { id: '2(5)', words: ['etter', 'frokost', 'kjøkkenet', 'serverer', 'snakker med', 'Godt jobba!', 'tar', 'en kopp', 'kaffe', 'trenger', 'en pause', 'her', 'til', 'Vær så god.', 'Takk skal du ha.', 'Ja, det gjør jeg.', 'enig', 'kake', 'Nei, takk.', 'meg', 'kanskje', 'har lyst på', 'resepsjonen', 'selvfølgelig', 'har', 'drikker', 'gir'] },
        { id: '2(6)', words: ['sitter', 'i dag', 'rolig', 'hilser på', 'Hyggelig å se deg.', 'ham', 'Så hyggelig av ham.', 'Hvilke dager', 'vanligvis', 'har fri', 'da', 'slapper av', 'sammen', 'en katt', 'trener', 'går på tur', 'ser film', 'besøker', 'mamma', 'treffer venner', 'kino'] },
        { id: '2(7)', words: ['tar imot', 'gjester', 'bestillinger', 'mange', 'dem', 'forteller', 'om', 'penn', 'lampe', 'stol', 'bord', 'vindu', 'klokke', 'butikken', 'kjøper', 'går hjem', 'middag', 'om ettermiddagen', 'husarbeid', 'om kvelden', 'legger meg', 'en formiddag', 'ei/en natt', 'ei/en uke', 'et døgn', 'en time', 'et minutt', 'et kvarter', 'midnatt'] },
      ],
    },
    {
      kapittel: 3, title: 'Fra morgen til kveld',
      sections: [
        { id: '3(1)', words: ['den', 'kvart på', 'kvart over', 'halv'] },
        { id: '3(2)', words: ['vanlig', 'ei vekkerklokke', 'ringer', 'står opp', 'tar en dusj', 'så', 'ei/en skive', 'brød', 'et glass', 'jus', 'en sønn', 'år', 'går på skolen', 'sover', 'til klokka halv åtte', 'trøtt', 'om morgenen', 'alene', 'etterpå', 'pusser tennene', 'sminker meg', 'ei/en matpakke', 'tar med meg', 'et eple', 'tar buss til …', 'begynner', 'arbeider', 'timer', 'rer senger'] },
        { id: '3(3)', words: ['skilt', 'hos meg', 'annenhver helg', 'en far', 'snill', 'en gutt', 'savner', 'tror', 'sier', 'ikke så mye', 'liker seg', 'gjør lekser', 'spiller', 'Vi koser oss', 'hjemme', 'ute', 'spiller fotball', 'en venn', 'inne', 'Ikke mas.', 'på nettet', 'prater', 'ei/en melding', 'en fest', 'hele klassen', 'Så hyggelig.', 'gøy', 'foreldrene', 'en bror', 'Jeg gleder meg.'] },
        { id: '3(4)', words: ['slitsom', 'et arbeid', 'tungt', 'rent', 'ryddig', 'Hvor mange …?', 'tidlig', 'serviceledelse', 'administrasjon'] },
      ],
    },
    {
      kapittel: 4, title: 'På norskkurs',
      sections: [
        { id: '4(1)', words: ['noen ganger', 'å finne', 'et ord', 'en nordmann - nordmenn', 'å prøve', 'lett', 'kan', 'ikke så mange ord', 'et svar', 'da', 'å spørre', 'si det en gang til', 'å gjenta', 'folk', 'fort', 'langsomt', 'noen', 'bare', 'høyt'] },
        { id: '4(2)', words: ['skal', 'i helga', 'har lyst til å …', 'til byen', 'vil', 'sove', 'lenge', 'Jeg vet ikke.', 'må', 'Jeg pleier å …', 'skolearbeid', 'en konsert', 'å dra', 'en restaurant', 'Det kommer til å bli fint.', 'Jeg vil gjerne …', 'en by', 'en plan', 'et barn', 'ei/en jente', 'en svømmehall', 'å få besøk', 'ha mye å gjøre', 'å bake', 'Jeg er glad i …', 'å smake', 'i kirka', 'ei/en gruppe', 'hverandre', 'å være', 'sant', 'å bruke', 'en fantasi', 'blant annet', 'ei/en setning', 'ei/en tavle'] },
        { id: '4(3)', words: ['Blir du med?', 'ei/en jakke', 'gjerne', 'god idé', 'Beklager', 'å ha tid til', 'Vi ses.', 'en busstasjon', 'Passer det?'] },
        { id: '4(4)', words: ['å undervise', 'forskjellige', 'en historie', 'å lære av noen', 'å le', 'ofte', 'muntlig', 'skriftlig', 'både – og', 'om'] },
      ],
    },
    {
      kapittel: 5, title: 'Familieliv',
      sections: [
        { id: '5(1)', words: ['familieliv', 'ei/en dame', 'ei/en kvinne', 'et måltid', 'en ting', 'et hus', 'ei/en plassering', 'en tallerken', 'ei/en flaske', 'en melkekartong', 'en mann', 'ei/en stekepanne', 'ei/en presskanne', 'en blomst', 'en duk', 'et bilde', 'ei/en kone', 'en butikk', 'ei/en datter', 'en barnehage', 'gå i barnehagen', 'en hund', 'ei/en søster', 'en mann (ektemann)'] },
        { id: '5(2)', words: ['humør', 'i godt humør', 'å synge', 'derfor', 'snart', 'å steke', 'egg', 'bacon', 'å gjespe', 'trøtt', 'Jo da', 'sulten', 'pappa', 'tørst', 'et øyeblikk', 'Vent litt.', 'melk', 'ei/en brødskive', 'ost', 'syltetøy', 'mer', 'mett', 'alle sammen', 'ferdig', 'Er kaffen ferdig?', 'et knekkebrød', 'brunost'] },
        { id: '5(3)', words: ['et bad', 'sko', 'en sekk', 'Den står under stolen.', 'å ligge', 'Den ligger i sekken.', 'leverpostei', 'alltid', 'sen', 'å børste', 'håret', 'dårlig tid', 'på bordet', 'over bordet', 'under bordet', 'i kurven', 'ved siden av', 'bak stolen', 'foran stolen'] },
        { id: '5(4)', words: ['travelt', 'å kle på seg', 'et pålegg', 'å sette melka i kjøleskapet', 'et kjøleskap', 'en oppvaskmaskin', 'til slutt', 'å kjøre'] },
        { id: '5(5)', words: ['en matbutikk', 'et kjøpesenter', 'å hjelpe', 'å hente', 'å være sur', 'å gråte', 'trening', 'dit', 'kaos', 'en nøkkel; en bilnøkkel', 'en kamp', 'en håndballkamp', 'å møte', 'Han er med.', 'å leke', 'et gulv', 'et eventyr', 'å høre på musikk'] },
        { id: '5(6)', words: ['å bestemme', 'en meny', 'lunsj', 'kjøtt', 'fisk', 'å skjære', 'grønnsaker', 'suppe', 'dessert', 'effektiv', 'en kollega', 'å jobbe turnus'] },
      ],
    },
    {
      kapittel: 6, title: 'På kjøpesenteret',
      sections: [
        { id: '6(1)', words: ['denne', 'dette', 'disse', 'ei/en kåpe', 'en frakk', 'ei/en jakke', 'en utedress', 'en genser', 'ei/en skjorte', 'et slips', 'et skjørt', 'ei/en bukse', 'en paraply', 'et skaut', 'ei/en lue', 'et pannebånd', 'et skjerf', 'en ryggsekk', 'en bag', 'ei/en barnevogn', 'støvler', 'støvletter', 'solbriller', 'kjempefin', 'en klesbutikk', 'bursdag', 'å ønske seg', 'klær', 'en bursdagsgave', 'å gå forbi', 'å sitte i kassa', 'å peke', 'å hilse på henne', 'en kø', 'først', 'tøff', 'et hull', 'sånn', 'Kan jeg prøve dem?', 'Vær så snill.'] },
        { id: '6(2)', words: ['stor', 'liten, lita, lite, små', 'et tilbud', 'glad', 'fornøyd', 'herreklær', 'lilla', 'kjedelig', 'Trenger dere hjelp?', 'å kikke', 'å koste', '370 kroner', 'å være på salg', 'en størrelse', 'den passer', 'et prøverom', 'der borte', 'å smile', 'å synes', 'Den passer akkurat.', 'billig', 'Skal det være noe mer?', 'blå', 'grå', 'til sammen', 'vanlig pris', 'en farge', 'å vise', 'Hun synes sikkert at de er fine.', 'Jeg er ikke helt sikker.', 'Velkommen tilbake!'] },
        { id: '6(3)', words: ['en ferskvaredisk', 'en kunde', 'en disk', 'å ha venner på middag', 'i morgen', 'anbefale', 'en laks', 'en sitron', 'olivenolje', 'en person', 'et gram', 'en/et kilo', 'en kilopris', 'ei/en fruktavdeling', 'Gå rett fram.', 'høyre', 'venstre', 'ketchup', 'sennep', 'Bare hyggelig.', 'Lykke til med middagen.', 'senere', 'skanne inn varer', 'en pose', 'et medlem', 'ei/en kvittering', 'ei/en oppskrift', 'laks i ovn', 'fersk laksefilet', 'soyasaus', 'salt', 'pepper', 'Sett stekeovnen på 180 grader.', 'Skjær laks i serveringsstykker.', 'ei/en ildfast form', 'saft', 'en salat'] },
        { id: '6(4)', words: ['en butikkmedarbeider', 'et sted', 'for eksempel', 'en sportsbutikk', 'god service', 'viktig', 'et spørsmål', 'et godt råd', 'hvor lenge', 'en kylling', 'å svare', 'ei/en utdanning', 'få opplæring', 'å gå på kurs', 'å pakke', 'å oppbevare', 'å se ryddig og pent ut', 'ei/en arbeidsoppgave', 'et ansvar'] },
      ],
    },
    {
      kapittel: 7, title: 'Her bor jeg!',
      sections: [
        { id: '7(1)', words: ['en bolig', 'personlig økonomi', 'en trafikkregel', 'en måned', 'et ordenstall', 'januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember', 'ei/en lokalavis', 'en avtale', 'å vente', 'å feire', 'Hvordan blir været?', 'sol', 'regn', 'Hvor går barnetoget?', 'på den andre siden', 'ei/en gate', 'hvor langt', 'sentrum', 'en kilometer', 'et minutt', 'å starte', 'et rom', 'et nummer', 'en etasje', 'tredje', 'en heis', 'endelig', 'Det blir stille.', 'Jeg er ferdig.', 'en bil', 'min', 'utenfor', 'et apotek', 'å stoppe', 'en pizza', 'Jo, det er hyggelig.'] },
        { id: '7(2)', words: ['ei/en parkeringsbot', 'mineralvann', 'tilbake', 'ei/en parkeringsvakt', 'din', 'Er det noe galt?', 'å parkere', 'et skilt', 'parkering forbudt', 'dessverre', 'ei/en bot', 'med én gang', 'en regel', 'å ha råd til', 'å spleise'] },
        { id: '7(3)', words: ['gammel', 'en leilighet', 'kvm: kvadratmeter', 'ei/en stue', 'et soverom', 'en gang', 'koselig', 'trives', 'ei/en husleie', 'høy', 'dyr', 'å leie', 'å spare', 'en måned', 'en bank', 'et lån', 'singel', 'Så rart.', 'åpen', 'å hoppe', 'å gå ut', 'å lete', 'å se ut', 'brun', 'søt', 'sin, si, sitt, sine', 'en nabo', 'ingen', 'hennes', 'ei/en blokk', 'et rekkehus', 'en enebolig', 'en hage', 'å rope', 'For en dag!', 'å lukte', 'en benk', 'en pizzabit', 'en munn', 'Det er ikke sant!'] },
        { id: '7(4)', words: ['ei/en sak (nyhetssak)', 'et lokalmiljø', 'å intervjue', 'interessant', 'å elske', 'halvparten', 'det er min skyld', 'vin', 'bøter; ei/en bot, flere bøter'] },
      ],
    },
    {
      kapittel: 8, title: 'Prat i pausen',
      sections: [
        { id: '8(1)', words: ['et pauserom', 'en ferie', 'deilig', 'godt med varme', 'tøy', 'ellers', 'satt, å sitte', 'en parasoll', 'en balkong', 'drakk, å drikke', 'et studium, studiet', 'absolutt', 'dro, å dra', 'en sandal', 'et torg', 'flott', 'en fortauskafé', 'et fortau', 'en kafé', 'i går'] },
        { id: '8(2)', words: ['å sette seg, satte', 'jammen', 'heldig', 'en av servitørene', 'syk', 'ekstra', 'erfaring', 'som servitør', 'før', 'den første jobben min', 'å plukke', 'oliven', 'før – siden', 'au pair', 'et menneske', 'nysgjerrig', 'å mene', 'foreløpig', 'en vikar', 'å tjene', 'forsiktig', 'penger', 'å sende', 'å ødelegge', 'et budsjett', 'å håpe', 'en fast jobb'] },
        { id: '8(3)', words: ['her i landet', 'omtrent', 'ei/en jordmor', 'hit', 'ei/en bestemor', 'å ringe', 'langt borte', 'å gråte, gråt', 'Stakkars deg.', 'en onkel', 'ei/en tante', 'en fetter', 'ei/en kusine', 'likevel', 'å skje', 'å søke', 'familiegjenforening', 'nesten', 'i begynnelsen', 'å skjønne, skjønte', 'en stefar', 'å hjelpe, hjalp', 'heldigvis', 'et bibliotek', 'massevis', 'ei/en barnebok', 'ei/en bok, bøker', 'etter en stund', 'ei/en venninne', 'å dø, å dø', 'i fjor'] },
        { id: '8(4)', words: ['deg selv', 'økonomisk', 'et problem', 'å miste', 'en bar', 'å gå konkurs', 'arbeidsledig', 'en venn av meg', 'heltid', 'deltid', 'å bli kjent med noen', 'et tips', 'en klubb', 'en organisasjon', 'samme interesser', 'å kontakte', 'frivillig', 'et eldresenter', 'eldre (gammel)', 'en fotballkamp', 'ei/en enke', 'å klare seg'] },
      ],
    },
    {
      kapittel: 9, title: 'Vær og årstider',
      sections: [
        { id: '9(1)', words: ['et samboerskap', 'ei/en årstid', 'en vinter', 'en vår', 'en sommer', 'en høst'] },
        { id: '9(2)', words: ['å skinne, skinte', 'solskinn', 'en varmegrad', 'pluss 25 grader', 'å snø, -dde', 'snø', 'kald', 'kuldegrader', 'minus 10 grader', 'et regnvær', 'å regne, -et', 'en vind', 'å blåse, -te', 'overskyet', 'et lyn', 'å lyne, -te', 'å tordne, -et'] },
        { id: '9(3)', words: ['særlig', 'å gå på ski', 'kort', 'mørk', 'et nordlys', 'ekstra', 'å svette, -et', 'å smelte, -et', 'en båt', 'ei/en øy', 'ei/en strand', 'en kamerat', 'en utekafé', 'et turområde', 'å jogge, -et', 'et hav', 'å høre, -te', 'ei/en bølge', 'å fryse, frøs', 'ei/en krimbok', 'en øl', 'herlig'] },
        { id: '9(4)', words: ['en hyttetur', 'å spørre om noe', 'ei/en hytte', 'skrubbsulten', 'å dekke bordet', 'kjempegod', 'å bade, -et', 'en samboer', 'det er rart', 'Klart det.', 'en følelse', 'karrisaus', 'perfekt', 'å øsregne, -et', 'han er litt sprø', 'iskaldt', 'vann', 'en sofa', 'å slutte, -et', 'å fiske, -et', 'et stykke', 'en ingeniør', 'vet; vite, vet, visste'] },
        { id: '9(5)', words: ['et reklamebyrå', 'en mediegrafiker', 'kul, -t, -e', 'en annonse', 'designe, -et', 'ei/en nettside', 'stress', 'en hemmelighet', 'mulig'] },
      ],
    },
    {
      kapittel: 10, title: 'Litt om Norge',
      sections: [
        { id: '10(1)', words: ['aldri mer', 'en telttur', 'en hval', 'fantastisk', 'sjøsyk', 'ei/en midnattssol', 'lys', 'en utsikt', 'en fjord', 'et fjell', 'ei/en ferge', 'deretter', 'oppover', 'strålende', 'sjarmerende', 'et museum, museet', 'en sightseeing', 'et tog', 'over fjellet'] },
        { id: '10(2)', words: ['en sjåfør', 'utenlandsk', 'en turist', 'å overnatte, -et', 'å komme fram til', 'en bagasje', 'en terrasse', 'å hilse, -te på', 'et stykke eplekake', 'en dessert', 'Jeg er forsynt.', 'bråk', 'et ektepar', 'å krangle, -et', 'å forlange, -te', 'i stedet for', 'en del (= noe)', 'en feil', 'egentlig', 'full, fullt -e', 'å finne, fant, har funnet', 'natur', 'å fotografere, -te', 'å snu, -dde', 'en rygg', 'å ta bilde av seg selv', 'rar', 'å se … ut. Det ser rart ut.'] },
        { id: '10(3)', words: ['ei/en elv', 'en foss', 'en sjø', 'ei/en bro', 'et grantre', 'et bjørketre', 'et skip', 'ei/en brygge', 'en lastebil', 'en traktor', 'et fly', 'en sykkel', 'en bonde', 'en fisker'] },
        { id: '10(4)', words: ['en reportasje', 'en ansatt - mange ansatte', 'å lure, -te på', 'å slå seg ned', 'å bestille, -te', 'å bytte, -et', 'trafikk', 'stresset', 'ei/en mil', 'et landskap', 'et lys', 'å forandre seg', 'lang', 'ulik', 'et program', 'et sted', 'en vei', 'å løfte, -et', 'en tanke', 'framtida', 'førerløs', 'uten', 'en pensjonist', 'et bilde'] },
        { id: '10(5)', words: ['et liv', 'overrasket', 'å overraske, -et', 'spesielt', 'å legge merke til', 'god plass', 'typisk', 'lik', 'akkurat som', 'vår', 'å sykle, -et', 'omkring', 'å stå, sto, har stått', 'et rullebrett', 'å stole, -te på', 'trygg', 'til og med', 'politiet', 'fri', 'en kjæreste', 'ei/en hånd', 'Det er rart for meg.', 'forbudt', 'ekte', 'dessuten', 'stille', 'forresten', 'en ting til', 'Takk for sist.', 'å ha rett i noe', 'slutt', 'så lenge', 'å gre, -dde', 'et førerkort'] },
      ],
    },
    {
      kapittel: 11, title: 'Språkpraksis',
      sections: [
        { id: '11(1)', words: ['hvis', 'komme tidsnok', 'praksis', 'om tre dager', 'en sommerfugl', 'en mage', 'å grue seg', 'et klasserom', 'å ha rett'] },
        { id: '11(2)', words: ['en deltaker', 'et tilbud', 'en arbeidsplass', 'en mekaniker', 'et verksted', 'å snakke', 'å fikse, -et'] },
        { id: '11(4)', partial: true, words: ['et uttrykk', 'å bli lei av', 'man', 'når (subj)', 'politikk', 'å ta lang tid', 'greit, ok', 'alkohol', 'en bartender', 'jo'] },
        { id: '11(5)', partial: true, words: ['den nye', 'en språkpraktikant', 'Dette er …', 'å møte, møtte', 'en del', 'ulike', 'godkjent', 'en type', 'å ønske, -et'] },
        { id: '11(6)', partial: true, words: ['da', 'midt på vinteren', 'en flyktning', 'å kjenne, -te', 'over (= mer enn)', 'en prat'] },
        { id: '11(7)', partial: true, words: ['å klemme, klemte', 'lykkelig', 'å huske, -et', 'en sang', 'en familie', 'å selge, solgte'] },
      ],
    },
    {
      kapittel: 12, title: 'Livsstil, kropp og helse',
      sections: [
        { id: '12(1)', partial: true, words: ['en kropp', 'å føle, -te', 'et øye', 'en nyhet', 'redd', 'deprimert', 'å konsentrere seg', 'å lengte, -et'] },
        { id: '12(2)', partial: true, words: ['å klare, -et', 'å miste, -et', 'å falle, falt, har falt', 'å gjøre vondt', 'en skulder', 'å bøye seg'] },
        { id: '12(3)', partial: true, words: ['et pasient', 'et helsepersonell', 'en smerte', 'kvalm', 'urolig', 'en lege', 'en time'] },
        { id: '12(4)', partial: true, words: ['et brudd', 'å operere, -te', 'fremdeles', 'smertestillende', 'en medisin'] },
        { id: '12(5)', partial: true, words: ['en kur', 'å kutte ut', 'være avhengig av', 'en smarttelefon', 'å slå av', 'et trygt, -t, -e'] },
        { id: '12(6)', words: ['en helsearbeider', 'en muskel', 'en skade', 'en øvelse', 'streng, -t, -e', 'å øve, -de', 'en ambulansearbeider', 'ei/en førstehjelp', 'et sykehus', 'nødvendig', 'vondt i magen', 'å blø, -dde', 'et sår', 'en psykolog', 'å slite, slet, har slitt', 'en opplevelse', 'ei/en taushetsplikt'] },
      ],
    },
    {
      kapittel: 13, title: 'På flyttefot',
      sections: [
        { id: '13(1)', words: ['en tilhenger', 'et møbel', 'ei/en adresse', 'å være på vei', 'å glemme, -mte', 'å ta til høyre', 'et lyskryss', 'på venstre side'] },
        { id: '13(2)', words: ['for stor', 'å bære, bar, har båret', 'hvit', 'en kommode', 'liten, lita, lite, små', 'tung', 'oppe', 'et skap', 'få opp døra', 'større; stor, større, størst', 'mindre; liten, mindre, minst', 'ned', 'en idé', 'tom', 'en malingsboks', 'å kaste, -et', 'Jeg kjører forbi, så jeg kan ta dem.', 'et leveringssted', 'farlig', 'et avfall'] },
        { id: '13(3)', words: ['å plassere, -te', 'å selge, solgte, har solgt', 'usikker', 'en ølboks', 'for nært', 'å velge, valgte, har valgt', 'et fang', 'Klart det.', 'få tak i', 'en rørlegger', 'en vask', 'ødelagt', 'nydelig', 'praktisk'] },
        { id: '13(4)', words: ['en grillfest', 'en bakgård', 'å invitere, -te', 'glad: De ser glade ut.', 'en voksen', 'å grille, -et', 'ei/en pølse', 'å prate, -et sammen', 'faktisk', 'en tradisjon', 'en sankthanskveld', 'å tenne, tente', 'et bål', 'en forskjell', 'en ball', 'en grill', 'å sparke, -et', 'et uhell', 'det er lov å bruke hodet', 'det går fort over'] },
      ],
    },
    {
      kapittel: 14, title: 'Barnehage, skole og utdanning',
      sections: [
        { id: '14(1)', words: ['begge', 'prosent', 'mellom', 'liker best', 'ei/en samlingsstund', 'ull', 'undertøy', 'ei/en strømpebukse', 'en sokk', 'en hals (klær)', 'ei/en lue', 'en vott', 'et par', 'en utedress med fôr', 'å tåle, -te', 'å skifte, -et', 'matematikk', 'gymnastikk', 'som (subj.)', 'grunnskolen', 'ungdomsskolen', 'obligatorisk', 'gratis', 'en skoletime', 'et trinn'] },
        { id: '14(2)', words: ['et foreldremøte', 'et møte', 'en samtale', 'ei/en innkalling', 'en idé'] },
        { id: '14(3)', words: ['videregående skole', 'å ha rett til', 'en plass', 'et utdanningsprogram', 'yrkesfaglig', 'praktisk', 'et yrke', 'ei/en lære', 'en bedrift', 'et fagbrev', 'et svennebrev', 'studieforberedende', 'generell', 'studiekompetanse', 'en kompetanse', 'et universitet', 'en høyskole', 'en tannlege', 'en advokat', 'en frisør', 'en elektriker', 'en snekker'] },
        { id: '14(4)', words: ['å søke, -te', 'bør, burde', 'en rådgiver', 'å bygge, bygde', 'ei/en hånd, hender', 'bygg og anleggsteknikk', 'en tømrer', 'innenfor', 'å forklare', 'yrkesfag', 'Jeg må stikke (= løpe)', 'en klem', 'å vedlikeholde', 'å følge, fulgte', 'klar (til å)', 'et mesterbrev'] },
        { id: '14(5)', words: ['en informasjon', 'ei/en regjering', 'et krav', 'normal', 'å kreve', 'spesiell', 'et fag', 'et resultat', 'offentlig', 'en avgift', 'et semester', 'utstyr', 'ved', 'privat', 'voksen, voksne', 'en mulighet', 'ved å …', 'tilsvarende', 'realkompetanse', 'en kompetanse', 'mens'] },
        { id: '14(6)', words: ['en assistent', 'å aktivisere, -te', 'pedagogisk', 'en styrer', 'øverst', 'kvalifisert', 'en kombinasjon', 'faglig', 'å spesialisere seg', 'en pedagog', 'et behov', 'en rektor', 'i tillegg', 'fysisk', 'psykisk', 'sosial', 'en vaktmester', 'et vedlikehold'] },
      ],
    },
    {
      kapittel: 15, title: 'Høytid og fest',
      sections: [
        { id: '15(1)', words: ['ei/en høytid', 'en invitasjon', 'å arrangere', 'et julebord', 'en hall', 'et juletre', 'gå fram og tilbake', 'en serviett', 'bestikk', 'Er du i mål?', 'julemat', 'å mangle, -et', 'en presang', 'et smykke', 'ha dårlig smak', '(kjøpe) noe til huset', 'populær', 'lutefisk', 'en julaften', 'rødbeter', 'tradisjonell', 'en eksamen', 'svigerforeldre', 'festkledd', 'å angre, -et'] },
        { id: '15(2)', words: ['en påskeferie', 'ei/en påske', 'å skype, -et', 'en kafé', 'å stenge, -te', 'svart', 'en deltidsjobb', 'ei/en inntekt', 'et stearinlys'] },
        { id: '15(4)', words: ['jula er over', 'ei/en overtid', 'å avspasere, -te', 'en fridag', 'å starte et nytt år', 'et selskap', 'en familiefest', 'smør', 'hønning', 'en smak', 'en frisørsalong', 'ei/en lukt'] },
        { id: '15(5)', words: ['en bursdagsfest', 'et barnebarn', 'et oldebarn', 'en krig', 'positiv', 'ta det med ro', 'å ordne, -et seg', 'bestandig', 'sterk', 'å klippe, -et hår', 'et papirarbeid', 'en kontakt', 'en bursdagssang', 'en tale', 'Gratulerer med dagen.', 'et minne'] },
        { id: '15(7)', words: ['å åpne, -et', 'en gründer', 'å registrere, -te', 'et skjema', 'en frisyre', 'å lære teori', 'en mote', 'nøyaktig', 'ei/en evne', 'å kommunisere, -te', 'kjempeflink'] },
      ],
    },
    {
      kapittel: 16, title: 'På jobb',
      sections: [
        { id: '16(1)', words: ['norskprøven', 'en hjelpemann', 'en varebil', 'et vikariat', 'en CV', 'utdannet', 'en motor', 'en maskin', 'å levere, -te', 'et vikarbyrå', 'en søknad', 'selv om', 'ledig', 'ei/en stilling', 'å kaste, -et', 'et garn', 'hoved-', 'en datamaskin', 'kanskje'] },
        { id: '16(2)', words: ['et nivå', 'nødvendig', 'en autorisasjon', 'å holde, holdt', 'å føle, -te', 'en hverdag', 'å kalle, -te', 'en engel', 'irritert', 'riktig', 'å se lyst på framtida', 'å være sikker på at'] },
        { id: '16(3)', words: ['en husøkonom', 'et renhold', 'et vaskemiddel, -midler', 'sengetøy', 'et håndkle', 'å føre', 'et regnskap', 'å lære opp', 'en fordel', 'ved siden av jobben', 'å sørge, -et for', 'ei/en avdeling', 'orden', 'slik at', 'toalettpapir'] },
        { id: '16(4)', words: ['super, -t, supre'] },
        { id: '16(5)', words: ['oversiktlig', 'relevant', 'elektronisk', 'ei/en opplysning', 'gjennom', 'min egen, mitt eget, mine egne', 'starte for seg selv', 'en drøm'] },
      ],
    },
  ];

  // Total de palabras, por si la UI lo necesita.
  window.DICTIONARY_WORD_COUNT = window.DICTIONARY.reduce(function (acc, k) {
    return acc + k.sections.reduce(function (a, s) { return a + s.words.length; }, 0);
  }, 0);
})();
