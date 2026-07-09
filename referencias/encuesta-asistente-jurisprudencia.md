# Asistente Inteligente de Jurisprudencia — Relevamiento de necesidades

**Poder Judicial de Mendoza — Dirección de Informática**
**Julio 2026**

---

## Instrucciones

1. Haga una copia de este documento.
2. Complete sus respuestas en la copia.
3. Envíe el documento completado a **mryan@workspace.pjm.gob.ar**

No hay apuro — tómese el tiempo que necesite. Si alguna pregunta no aplica a su trabajo, simplemente indique "No aplica".

---

## ¿De qué se trata esto?

Estamos evaluando la posibilidad de incorporar una nueva funcionalidad al buscador de jurisprudencia que estamos desarrollando: **un asistente que pueda ejecutar tareas complejas por usted**.

La idea es simple: hoy, cuando necesita encontrar y analizar jurisprudencia, el trabajo pesado lo hace usted. Busca, lee, vuelve a buscar, lee de nuevo, compara mentalmente, y al final arma la síntesis. El sistema le devuelve documentos, pero el esfuerzo intelectual de cruzar, filtrar, comparar y compilar es suyo.

Lo que estamos evaluando es darle al sistema la capacidad de hacer esa parte mecánica por usted. **No reemplazar su criterio** — sino que el sistema haga el trabajo de búsqueda y compilación, y usted valide el resultado.

### Algunos ejemplos de lo que podría pedirle al sistema:

- *"Buscame las sentencias del Dr. Adaro sobre despido indirecto del último año y compilame su criterio"*
- *"¿Hay jurisprudencia que contradiga la postura de que el empleador debe reincorporar en caso de X?"*
- *"¿Cómo evolucionó el criterio de la Suprema Corte sobre enfermedad profesional desde 2022?"*
- *"Comparame cómo resuelve la Cámara Civil vs. la Cámara Laboral en casos de daño moral"*

El sistema buscaría, leería múltiples sentencias, identificaría patrones y le entregaría un informe con las citas a las sentencias originales para que usted verifique.

### ¿Por qué necesitamos su opinión?

Antes de construir esto, necesitamos entender **qué tareas le consumen más tiempo** y **qué le resultaría genuinamente útil**. No queremos construir algo que no se use. Su experiencia diaria es la que define qué vale la pena automatizar.

**Le pedimos unos minutos para responder las siguientes preguntas.** No hay respuestas correctas o incorrectas — lo que más nos sirve son ejemplos concretos de su trabajo cotidiano.

---

## Preguntas

### Su trabajo con jurisprudencia hoy

**1.** ¿Cuántas veces por semana (aproximadamente) necesita buscar jurisprudencia? ¿En qué momento del proceso de una causa lo hace?

> *(Su respuesta)*

**2.** ¿Cuánto tiempo le lleva típicamente encontrar la jurisprudencia que necesita? ¿Y cuando NO la encuentra?

> *(Su respuesta)*

**3.** ¿Dónde busca hoy? ¿Usa algún sistema, base de datos, archivos personales, consulta a colegas?

> *(Su respuesta)*

**4.** ¿Tiene carpetas, planillas o archivos personales donde guarda jurisprudencia que le sirve? ¿Cómo los organiza?

> *(Su respuesta)*

---

### Tareas que le llevan más tiempo

**5.** ¿Alguna vez necesitó cruzar información de varias sentencias para armar una conclusión? ¿Cómo lo hizo?

> *(Su respuesta)*

**6.** ¿Necesita alguna vez rastrear cómo evolucionó un criterio judicial a lo largo del tiempo? ¿Cómo lo resuelve hoy?

> *(Su respuesta)*

**7.** ¿Alguna vez necesita saber si hay jurisprudencia que contradiga su posición? ¿Cómo lo verifica?

> *(Su respuesta)*

**8.** ¿Prepara informes o compilaciones de jurisprudencia? ¿Para quién? ¿Con qué frecuencia?

> *(Su respuesta)*

---

### Qué filtros usa y cómo busca

**9.** Cuando busca jurisprudencia, ¿por qué criterios le gustaría poder filtrar? Marque los que le sean útiles y agregue otros si faltan:

- [ ] Juez/Vocal que intervino
- [ ] Fuero (laboral, civil, penal, familia, etc.)
- [ ] Tribunal (Suprema Corte, Cámara, Juzgado)
- [ ] Materia o tema
- [ ] Rango de fechas
- [ ] Resultado del fallo (hizo lugar, rechazó, revocó, confirmó)
- [ ] Norma o artículo citado (ej: art. 245 LCT)
- [ ] Número de expediente
- [ ] Otro: _______________

**10.** ¿Le importa quién fue el juez que resolvió? ¿En qué casos?

> *(Su respuesta)*

**11.** Cuando filtra por fecha, ¿qué rangos le son más útiles? (último mes, últimos 6 meses, último año, últimos 5 años, otro)

> *(Su respuesta)*

---

### Lo que le pediría a un asistente dedicado

**12.** Si tuviera una persona dedicada exclusivamente a buscar y compilar jurisprudencia para usted, ¿qué le pediría todos los días? Dé ejemplos concretos.

> *(Su respuesta)*

**13.** ¿Cuál fue la última vez que le costó encontrar jurisprudencia? ¿Qué buscaba y cómo terminó resolviéndolo?

> *(Su respuesta)*

**14.** De las siguientes tareas, ¿cuáles le serían útiles? Ordénelas de mayor a menor utilidad (1 = más útil):

| # | Tarea | ¿Le sería útil? | Prioridad (1-10) |
|---|---|---|---|
| A | Compilar el criterio de un juez sobre un tema | Sí / No | ___ |
| B | Rastrear cómo cambió la jurisprudencia sobre un tema en el tiempo | Sí / No | ___ |
| C | Buscar precedentes que contradigan una postura | Sí / No | ___ |
| D | Armar un panorama completo de jurisprudencia sobre un tema | Sí / No | ___ |
| E | Comparar cómo resuelven distintos tribunales un mismo tema | Sí / No | ___ |
| F | Recibir alertas cuando salga jurisprudencia nueva sobre un tema que trabajo | Sí / No | ___ |
| G | Saber qué normas/artículos se citan más en un tipo de caso | Sí / No | ___ |
| H | Saber cuántas sentencias hay sobre un tema (dimensionar) | Sí / No | ___ |
| I | Identificar el fallo "líder" o más citado sobre un tema | Sí / No | ___ |
| J | Detectar si un juez cambió de criterio recientemente | Sí / No | ___ |

**15.** ¿Hay alguna otra tarea que le gustaría poder delegarle al sistema y que no mencionamos?

> *(Su respuesta)*

---

### Cómo le gustaría recibir los resultados

**16.** Si el sistema le compila un informe de jurisprudencia, ¿cómo lo prefiere?

- [ ] Resumen ejecutivo breve (1-2 párrafos)
- [ ] Informe detallado con citas textuales
- [ ] Tabla comparativa
- [ ] Listado con links a los PDFs originales
- [ ] Otro: _______________

**17.** ¿Necesita poder copiar fragmentos directamente para incluirlos en sus resoluciones?

> *(Su respuesta)*

**18.** ¿Le gustaría que el sistema le muestre qué pasos hizo para llegar al resultado (ej: "Busqué 15 sentencias, leí 4 completas, compilé el análisis") o prefiere solo el resultado final?

- [ ] Quiero ver los pasos (me da más confianza)
- [ ] Solo el resultado final (no me interesa el proceso)

**19.** ¿Le gustaría poder refinar el resultado una vez recibido? (ej: "Muy bien, pero ahora filtrá solo las de 2025 en adelante" o "Profundizá en el punto 3")

> *(Su respuesta)*

---

### Confianza en el sistema

**20.** ¿Qué nivel de verificación haría sobre un compilado generado por el sistema?

- [ ] Lo usaría directamente sin revisar
- [ ] Leería el resumen y verificaría 1-2 citas al azar
- [ ] Verificaría todas las citas contra el PDF original
- [ ] Solo lo usaría como punto de partida para mi propia búsqueda

**21.** ¿Qué le daría confianza en que el sistema no está inventando citas? Marque todo lo que aplique:

- [ ] Link directo al PDF de cada sentencia citada
- [ ] Número de expediente verificable
- [ ] Fragmento textual exacto de la sentencia
- [ ] Indicación de la página del PDF donde está el fragmento
- [ ] Que me diga cuándo NO encontró jurisprudencia en vez de inventar
- [ ] Otro: _______________

**22.** ¿Le preocupa más que el sistema le traiga cosas irrelevantes (ruido) o que se le escape jurisprudencia importante (omisión)?

> *(Su respuesta)*

---

### Para cerrar

**23.** ¿Qué es lo que más le frustra del proceso actual de búsqueda de jurisprudencia?

> *(Su respuesta)*

**24.** ¿Hay algo que hoy resuelve "de memoria" o preguntándole a un colega que le gustaría que el sistema pudiera resolver?

> *(Su respuesta)*

**25.** ¿Algún comentario, sugerencia o inquietud adicional?

> *(Su respuesta)*

---

## Datos del encuestado (opcional pero útil para nosotros)

- **Fuero en el que trabaja**: _______________
- **Rol**: Juez / Secretario/a / Letrado/a / Otro: ___
- **Antigüedad aproximada**: _______________
- **¿Usa habitualmente herramientas digitales para buscar jurisprudencia?**: Sí / No

---

*Gracias por su tiempo. Sus respuestas nos ayudan a construir algo que realmente les sirva.*

*Cualquier consulta: Mauricio Ryan — Dirección de Informática*
