# Norsk A1 — App de Examen

Una app web para practicar el examen de noruego **nivå A1**, pregunta a pregunta.
Banco de **106 preguntas** repartidas en **9 kapitler**, basadas en los apuntes del curso.

👉 **App en vivo:** https://gaussiano.github.io/Norske-A1-exam/

## Modos

- **Estudio** — tras responder cada pregunta ves la respuesta correcta, la
  explicación y la fecha de los apuntes donde repasar el tema.
- **Examen** — sin pistas; solo ves el resultado y la corrección completa al final.
  Aprobado a partir del 60 %.

Puedes elegir qué kapitler entran en el sorteo y cuántas preguntas quieres (10–106).

## Módulos (pestañas)

Arriba hay dos pestañas; la app recuerda la última elegida (`localStorage`).

- **Verb** — la app de examen de siempre (estudio, examen, vocabulario), con su
  paleta azul marino / turquesa.
- **Preposisjoner** — verbos con preposición fija (`fast`) y verbos con
  partícula (`partikkel`), nivel A2, con paleta verde:
  - **Hueco**: escribe la preposición que falta (no distingue mayúsculas ni espacios).
  - **Test**: 4 opciones (la correcta + 3 preposiciones de la lista).
  - **Tarjetas**: anverso en español, reverso con la expresión y el ejemplo.
  - Filtros por tipo y por preposición/partícula; tras cada respuesta se ve la
    frase completa con la preposición resaltada y su traducción.
  - Su progreso se guarda aparte (`norsk_prep_stats`), sin mezclarse con Verb.

Cambiar de pestaña no pierde la sesión en curso del otro módulo.

## Tecnología

App estática de una sola página: **React 18 + Babel standalone**, sin paso de
build. Todo se sirve como ficheros estáticos, así que funciona en GitHub Pages
tal cual.

| Fichero | Qué es |
|---|---|
| `index.html` | Punto de entrada; carga React, los bancos y la app. |
| `shared.jsx` | Kit compartido: tokens de color, sonidos, botones, cabeceras, feedback, `shuffle`, `norm`, `useStoredState`… |
| `app.jsx` | Módulo **Verb** (pantallas, lógica de examen, resultados) y la barra de pestañas. |
| `preposisjoner.jsx` | Módulo **Preposisjoner** (hueco, test, tarjetas, filtros, progreso). |
| `data/preposisjoner.json` | Expresiones del módulo Preposisjoner. |
| `questions-k1-3.js` / `k4-6` / `k7-9` | Bancos de preguntas por kapittel. |
| `questions-index.js` | Une los bancos y define los kapitler y sus fechas. |
| `android-frame.jsx`, `tweaks-panel.jsx` | Chrome de previsualización (solo dentro del editor de diseño). |

Los colores de cada módulo son variables CSS definidas en `index.html` bajo
`[data-module="verb"]` y `[data-module="preposisjoner"]`.

> La app detecta si se abre directamente (móvil / GitHub Pages) y se muestra a
> pantalla completa; dentro del editor de diseño aparece dentro de un marco de teléfono.

## Desarrollo local

Cualquier servidor estático sirve. Por ejemplo:

```bash
python -m http.server 4173
# luego abre http://localhost:4173
```

> El JSON se carga con `fetch`, así que abre la app desde un servidor (no con
> doble clic en `index.html`).

## Añadir expresiones de preposiciones

Edita `data/preposisjoner.json` y añade un objeto al final de la lista
(recuerda la coma tras el anterior):

```json
{ "id": 81, "uttrykk": "tenke på", "preposisjon": "på", "type": "fast",
  "es": "pensar en", "setning": "Jeg tenker ___ deg.", "setning_es": "Pienso en ti." }
```

- `id`: número único (el siguiente libre).
- `preposisjon`: lo que va en el hueco, exactamente; puede ser de dos palabras (`"på med"`).
- `type`: `"fast"` (preposición fija) o `"partikkel"` (verbo con partícula; muestra la nota de acento).
- `setning`: la frase con `___` (tres guiones bajos) donde va la preposición.

Los filtros y las opciones del test salen solos de los datos: una preposición
nueva aparece automáticamente como filtro.

## Privacidad

Los apuntes originales del curso (`uploads/`, `notes-corpus.txt`) **no** se
incluyen en este repositorio.
