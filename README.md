# Norsk A1 — App de Examen

Una app web para practicar el examen de noruego **nivå A1**, pregunta a pregunta.
Banco de **106 preguntas** repartidas en **9 kapitler**, basadas en los apuntes del curso.

👉 **App en vivo:** _(se añadirá tras el despliegue)_

## Modos

- **Estudio** — tras responder cada pregunta ves la respuesta correcta, la
  explicación y la fecha de los apuntes donde repasar el tema.
- **Examen** — sin pistas; solo ves el resultado y la corrección completa al final.
  Aprobado a partir del 60 %.

Puedes elegir qué kapitler entran en el sorteo y cuántas preguntas quieres (10–106).

## Tecnología

App estática de una sola página: **React 18 + Babel standalone**, sin paso de
build. Todo se sirve como ficheros estáticos, así que funciona en GitHub Pages
tal cual.

| Fichero | Qué es |
|---|---|
| `index.html` | Punto de entrada; carga React, los bancos y la app. |
| `app.jsx` | Aplicación principal (pantallas, lógica de examen, resultados). |
| `questions-k1-3.js` / `k4-6` / `k7-9` | Bancos de preguntas por kapittel. |
| `questions-index.js` | Une los bancos y define los kapitler y sus fechas. |
| `android-frame.jsx`, `tweaks-panel.jsx` | Chrome de previsualización (solo dentro del editor de diseño). |

> La app detecta si se abre directamente (móvil / GitHub Pages) y se muestra a
> pantalla completa; dentro del editor de diseño aparece dentro de un marco de teléfono.

## Desarrollo local

Cualquier servidor estático sirve. Por ejemplo:

```bash
python -m http.server 4173
# luego abre http://localhost:4173
```

## Privacidad

Los apuntes originales del curso (`uploads/`, `notes-corpus.txt`) **no** se
incluyen en este repositorio.
