# Relevamiento: Comportamiento Agéntico para Jurisprudencia

## Contexto para el equipo técnico

Este documento tiene tres partes:
1. **Speech** para presentar la idea al usuario final
2. **Consejos** para conducir la entrevista
3. **Preguntas de relevamiento** organizadas por categoría

---

## 1. Speech — Cómo presentar la solución al usuario final

> **Duración sugerida: 3-4 minutos. Sin pantalla. Solo palabras.**

---

*"Les quiero contar hacia dónde estamos pensando evolucionar el buscador de jurisprudencia, y necesito su ayuda para no construir algo que no les sirva.*

*Hoy, cuando necesitan encontrar jurisprudencia sobre un tema, hacen algo así: buscan, leen, vuelven a buscar, leen otra vez, comparan mentalmente, y al final arman ustedes mismos la síntesis. El sistema les devuelve documentos, pero el trabajo intelectual de cruzar, filtrar, comparar y compilar lo hacen ustedes.*

*Lo que estamos evaluando es darle al sistema la capacidad de hacer ese trabajo pesado por ustedes. No reemplazar su criterio — sino que el sistema haga la parte mecánica: buscar con criterios combinados, leer múltiples sentencias, identificar patrones, y entregarles un informe compilado que ustedes después validan y ajustan.*

*Por ejemplo, imaginemos que necesitan saber cómo viene resolviendo un juez determinado sobre un tema específico en los últimos meses. Hoy eso les lleva horas de lectura. La idea es que le puedan decir al sistema, en lenguaje natural: 'Buscame las sentencias del Dr. X sobre despido indirecto del último año y compilame su criterio'. Y el sistema busca, lee, sintetiza y les entrega un informe con las citas a las sentencias originales.*

*Otro ejemplo: preparar un borrador y necesitar saber si hay precedentes que contradigan su posición. Le dicen al sistema: 'Buscame jurisprudencia que contradiga la postura de que X' — y les trae los fallos relevantes.*

*La clave es que ustedes le dan una instrucción — una tarea — y el sistema la ejecuta paso a paso, mostrándoles qué está haciendo. No es una caja negra: ven que primero buscó 15 sentencias, luego leyó las 4 más relevantes, y al final compiló el análisis.*

*Ahora, para que esto les sea genuinamente útil, necesito que me cuenten: ¿qué tareas les consumen más tiempo hoy con la jurisprudencia? ¿Qué es lo que harían si tuvieran un asistente dedicado a buscar y compilar para ustedes?"*

---

## 2. Consejos para la entrevista

### Mindset general
- **No vendas tecnología, vendé tiempo recuperado.** El usuario no necesita saber qué es un "agente" ni un "action group". Necesita saber que le va a ahorrar 3 horas de lectura.
- **Dejá que cuenten historias.** La mejor forma de relevar es que te cuenten su último caso difícil y cómo buscaron jurisprudencia para resolverlo.
- **Preguntá "¿y después qué hacés?"** cada vez que describan un paso. Así descubrís la cadena completa.
- **Anotá los verbos**: "busco", "comparo", "cruzo", "verifico", "compilo". Cada verbo es un posible tool del agente.

### Errores a evitar
- **No muestres la solución antes de relevar.** Si les mostrás lo que puede hacer, van a decir "sí, todo" sin pensar. Primero escuchá qué necesitan.
- **No preguntes "¿te serviría que...?"** (sesgo de confirmación). Preguntá "¿cómo lo hacés hoy?" y dejá que el caso de uso emerja solo.
- **No asumas que todos trabajan igual.** Un juez de familia y uno de laboral tienen flujos muy distintos.
- **No prometas plazos.** Decí "estamos evaluando" y "queremos entender si vale la pena antes de construirlo".

### Técnicas útiles
- **Pregunta del "asistente perfecto"**: "Si tuvieras una persona dedicada a buscar jurisprudencia para vos, ¿qué le pedirías todos los días?"
- **El último caso difícil**: "Contame la última vez que te costó encontrar jurisprudencia. ¿Qué buscabas y cómo terminaste resolviéndolo?"
- **La frustración**: "¿Qué te frustra del proceso actual de búsqueda?" (las frustraciones son features disfrazadas)
- **El workaround**: "¿Tenés algún truco o método personal para encontrar lo que necesitás?" (los workarounds revelan gaps del sistema)

### Formato sugerido
- Entrevistas individuales o de a 2-3 personas del mismo fuero (30-40 min)
- NO reuniones grandes (la gente no se anima a decir lo que realmente hace)
- Grabá (con permiso) — después analizás los verbos y patrones

---

## 3. Preguntas de relevamiento

### Bloque A: Flujo de trabajo actual (entender el hoy)

1. **¿Cuántas veces por semana necesitás buscar jurisprudencia?** ¿En qué momento del proceso de una causa?
2. **Contame paso a paso qué hacés cuando necesitás buscar jurisprudencia.** ¿Dónde empezás? ¿Qué herramientas usás?
3. **¿Cuánto tiempo te lleva típicamente encontrar lo que necesitás?** ¿Y cuando NO encontrás?
4. **¿Alguna vez necesitaste cruzar información de varias sentencias?** ¿Cómo lo hiciste?
5. **¿Tenés carpetas, planillas o archivos personales donde guardás jurisprudencia que te sirve?** ¿Cómo los organizás?

### Bloque B: Tareas repetitivas (detectar automatizaciones)

6. **¿Hay búsquedas que hacés frecuentemente?** (ej: "siempre busco qué dijo la Suprema Corte sobre X antes de resolver")
7. **¿Necesitás alguna vez rastrear cómo evolucionó un criterio judicial a lo largo del tiempo?** ¿Cómo lo hacés hoy?
8. **¿Alguna vez necesitás saber si hay jurisprudencia que contradiga tu posición?** ¿Cómo verificás eso?
9. **¿Preparás informes o compilaciones de jurisprudencia?** ¿Para quién? ¿Con qué frecuencia?
10. **¿Necesitás alguna vez comparar cómo resuelven distintos jueces un mismo tema?**

### Bloque C: Filtros y criterios (entender la metadata que importa)

11. **Cuando buscás, ¿por qué criterios filtrás?** (juez, fecha, fuero, materia, tribunal, norma citada, resultado...)
12. **¿Te importa quién fue el juez que resolvió?** ¿En qué casos?
13. **¿Necesitás filtrar por rango de fechas?** ¿Qué rangos son los más comunes? (último mes, último año, últimos 5 años)
14. **¿Te sirve filtrar por el resultado del fallo?** (hizo lugar, rechazó, revocó, confirmó)
15. **¿Buscás por norma o artículo citado?** (ej: "todos los fallos que citan el art. 245 LCT")

### Bloque D: Tareas complejas (el corazón del agente)

16. **Si pudieras pedirle a alguien "buscame X y armame Y", ¿qué le pedirías?** Dame ejemplos concretos.
17. **¿Alguna vez necesitás un resumen de "qué viene diciendo" un tribunal sobre un tema?** ¿Cómo lo armás hoy?
18. **Cuando preparás un borrador, ¿cómo buscás los precedentes que vas a citar?** ¿Cuánto tiempo te lleva esa parte?
19. **¿Te serviría recibir alertas automáticas?** (ej: "salió una sentencia nueva sobre el tema que estás trabajando")
20. **¿Necesitás alguna vez analizar la postura de una parte específica** (ej: "qué argumenta siempre la ART en casos de enfermedad profesional")?

### Bloque E: Formato de entrega (cómo quieren el resultado)

21. **Si el sistema te compila un informe, ¿cómo lo preferís?** (resumen ejecutivo, detallado con citas, tabla comparativa...)
22. **¿Necesitás poder copiar/pegar fragmentos directamente en tu resolución?** ¿En qué formato? (Word, texto plano, con formato jurídico)
23. **¿Te sirve que el informe incluya el link al PDF original de cada sentencia citada?**
24. **¿Preferís que el sistema te muestre paso a paso lo que hizo** (busqué 15 sentencias, leí 4, compilé) **o solo el resultado final?**
25. **¿Necesitás poder "refinar" el resultado?** (ej: "muy bien, pero ahora filtrá solo las de 2025 en adelante")

### Bloque F: Confianza y validación (crítico para adopción)

26. **¿Qué nivel de confianza necesitás para usar jurisprudencia que te devuelve un sistema?** ¿Siempre verificás leyendo la sentencia original?
27. **¿Qué te daría confianza en que el sistema no está inventando citas?** (ej: link al PDF, número de expediente verificable)
28. **¿Usarías un compilado generado por IA directamente o siempre lo revisarías antes?**
29. **¿Te preocupa que se le escape jurisprudencia relevante?** (falsos negativos) ¿O que te traiga cosas irrelevantes? (falsos positivos)
30. **¿Te gustaría poder darle feedback al sistema?** (ej: "esta sentencia no es relevante", "falta esta otra")

---

## 4. Casos de uso candidatos (hipótesis a validar)

Estos son los casos de uso que creemos que el agente podría resolver. Usarlos como checklist para ver cuáles resuenan con los usuarios:

| # | Caso de uso | Ejemplo concreto |
|---|---|---|
| 1 | Compilar criterio de un juez | "¿Qué viene resolviendo Adaro sobre despido indirecto este año?" |
| 2 | Rastrear evolución doctrinal | "¿Cómo cambió el criterio sobre enfermedad profesional desde 2020?" |
| 3 | Buscar precedentes contradictorios | "¿Hay fallos que digan lo contrario a mi posición?" |
| 4 | Preparar estado del arte | "Dame un panorama completo de jurisprudencia sobre violencia de género en familia" |
| 5 | Comparar criterios entre tribunales | "¿La Cámara Civil resuelve distinto que la Suprema Corte en este tema?" |
| 6 | Alerta de nueva jurisprudencia | "Avisame cuando salga algo nuevo sobre el tema X" |
| 7 | Compilar normas aplicadas | "¿Qué artículos del CCyC se citan más en desalojos?" |
| 8 | Análisis estadístico básico | "¿Cuántas sentencias de despido hubo en el último trimestre?" |
| 9 | Identificar sentencia líder | "¿Cuál es el fallo más citado sobre este tema?" |
| 10 | Detectar cambio de criterio | "¿Algún juez cambió de opinión sobre este tema recientemente?" |
| 11 | Generar sumarios jurisprudenciales | "Generame los sumarios de esta sentencia con sus voces SAIJ" |

---

## 4.1. Detalle: Caso de uso #11 — Generar Sumarios Jurisprudenciales

### Origen

- **Usuaria**: Cintia Martínez (letrada, contacto directo; trabaja con Dra. Olga)
- **Pedido concreto**: Automatizar la generación semanal de sumarios de TODAS las sentencias publicadas en la lista de Laboral
- **Archivos de referencia**:
  - `Sumarios - Fallos - SCJM - Laboral.xlsx` — Excel que Cintia fue completando manualmente (1,413 sumarios de 481 fallos)
  - `guía para hacer sumarios.docx` — Instrucciones que Cintia le daba a la IA para generar sumarios (copiando y pegando sentencias una por una)

### Contexto del pedido (mail de Cintia, julio 2026)

> "Ese trabajo que hice yo 'manualmente', si se quiere, al ir proporcionándole a la IA las sentencias una por una -copiando y pegando-, Olga pretende que la IA lo haga automáticamente, **una vez por semana**, respecto de **todas las sentencias publicadas en lista de LABORAL**."
>
> "Algo así [como el Excel], entiendo, que es lo que Olga quiere que se haga automáticamente. Es decir, que se vayan registrando los sumarios en **una sola base de datos que se actualice una vez a la semana**."

### Lo que Cintia hacía manualmente

1. Tomaba cada sentencia nueva publicada en la lista de Laboral
2. Copiaba el texto completo y se lo pegaba a un chat de IA (Claude/ChatGPT)
3. Le daba las instrucciones del Word (pautas de sumario + voces SAIJ)
4. La IA generaba los sumarios
5. Cintia verificaba, corregía errores y refinaba
6. Copiaba el resultado al Excel con los campos: Fallo, Fecha, Expediente, Carátula, Magistrados, Enlace, N° Sumario, Voces, Sumario, Disidencias

### Lo que se necesita automatizar

```
┌─────────────────────────────────────────────────────────────┐
│  PROCESO SEMANAL AUTOMATIZADO (lo que pide Olga/Cintia)     │
│                                                             │
│  1. Detectar sentencias nuevas de Laboral (publicadas       │
│     en lista esa semana)                                    │
│  2. Para cada sentencia:                                    │
│     a. Leer texto completo del PDF                          │
│     b. Identificar doctrinas/temas tratados                 │
│     c. Generar sumario por cada doctrina (pautas SAIJ)      │
│     d. Asignar voces del tesauro SAIJ                       │
│     e. Identificar votación de magistrados                  │
│  3. Registrar todos los sumarios en base de datos única     │
│  4. Presentar para revisión humana (Cintia valida)          │
│  5. Publicar los sumarios aprobados                         │
└─────────────────────────────────────────────────────────────┘
```

### Descripción funcional

El sistema debe procesar automáticamente cada semana todas las sentencias nuevas del fuero Laboral y generar sumarios jurisprudenciales sin intervención manual. Cada sentencia puede contener múltiples doctrinas (en promedio ~3 sumarios por fallo), y cada sumario requiere:

1. **Leer la sentencia completa** e identificar cada doctrina/tema tratado
2. **Redactar un sumario autónomo** por cada doctrina (que se entienda sin leer el fallo)
3. **Asignar voces** usando el vocabulario controlado del SAIJ (ordenadas de general a particular)
4. **Identificar la posición de cada magistrado** (mayoría, adhesión, disidencia, voto propio)
5. **Registrar en base de datos única**: fecha, expediente, carátula, magistrados, enlace, sumarios, voces

### Pautas de calidad (extraídas de la guía de Cintia)

| Pauta | Descripción |
|---|---|
| Doctrina Única | Cada sumario = una sola idea/doctrina. Tantos sumarios como temas tratados |
| Autonomía | Comprensible sin leer el fallo ni otros sumarios |
| Generalidad | Aplicable a otros casos similares (no solo al caso concreto) |
| Brevedad | Frases cortas, directas, sin excederse |
| Claridad | Vocabulario jurídico adecuado, comprensión en primera lectura |
| Fidelidad | Sin interpretación personal — refleja exactamente lo que dijo el tribunal |
| Voces SAIJ | Términos del tesauro oficial (http://vocabularios.saij.gob.ar/), ordenados de general a particular, EN MAYÚSCULAS separadas por guiones |

### Estructura del output esperado

Para cada sentencia procesada, el sistema debe generar:

```
Fecha: DD/MM/YYYY
Expediente: NNNNN
Carátula: [completa]
Magistrados: [nombres separados por guiones]
Enlace: [URL al texto del fallo]

Sumario 1:
  Voces: VOZ GENERAL - VOZ ESPECÍFICA 1 - VOZ ESPECÍFICA 2
  Texto: [redacción del sumario]
  Opinó: MINISTRO X – MINISTRO Y ADHIRIÓ – MINISTRO Z EN DISIDENCIA

Sumario 2:
  Voces: ...
  Texto: ...
  Opinó: ...

[Disidencias si las hay]
```

### Ejemplo real (del Excel de Cintia)

**Fallo**: LEE JOO YONG Y OTROS EN J 162931 CAMPOS NEIRA ERICA NATALIA C/ PRINCIPIO S.R.L Y OTROS P/ DESPIDO P/ RECURSO EXTRAORDINARIO PROVINCIAL
**Fecha**: 04/09/2023 | **Magistrados**: PALERMO - ADARO - VALERIO

**Sumario 1**:
- Voces: DESPIDO INJUSTIFICADO – ABANDONO DE TRABAJO - FRAUDE LABORAL – PRIMACÍA DE LA REALIDAD – REGISTRACIÓN DEFICIENTE
- Texto: "La existencia de una relación laboral encubierta y fraccionada durante casi veinte años, con distintos empleadores formales y maniobras destinadas a reducir la antigüedad reconocida, configura un supuesto de fraude laboral que impide considerar prescriptas las acciones por períodos parciales."

**Sumario 2**:
- Voces: DESPIDO INJUSTIFICADO – ABANDONO DE TRABAJO - FRAUDE LABORAL – PRIMACÍA DE LA REALIDAD – REGISTRACIÓN DEFICIENTE
- Texto: "No se configura el abandono de trabajo como causal de despido cuando los emplazamientos de la trabajadora a la correcta registración fueron claras muestra de su voluntad de continuar en la relación, a la par que resultaron ilegítimamente resistidos por la empleadora, lo que justificó la retención del débito laboral"

### Valor para el sistema

- **Automatización total**: Elimina el proceso manual de copiar/pegar sentencias a la IA una por una
- **Alta frecuencia**: Se ejecuta semanalmente sobre todas las sentencias nuevas de Laboral (~20-50/semana)
- **Ahorro de tiempo**: Lo que a Cintia le lleva horas/días queda automatizado
- **Consistencia**: El agente aplica las mismas pautas siempre (sin variabilidad humana)
- **Base de datos única**: Todos los sumarios centralizados (reemplaza el Excel manual)
- **Integración con el sistema**: Los sumarios generados alimentan la metadata de la KB, mejorando las búsquedas semánticas
- **Validación humana**: Cintia/equipo revisa y aprueba antes de publicar (flujo con estado "pendiente → aprobado")

### Consideraciones técnicas

- El agente necesita acceso al **tesauro SAIJ** (vocabulario controlado de voces)
- Requiere leer la sentencia **completa** (no solo chunks) para identificar todas las doctrinas
- El Excel existente (481 fallos con sumarios) sirve como **dataset de validación** (gold standard)
- Se implementa como **proceso batch semanal** (EventBridge → Lambda → Agente) + **tool bajo demanda** en el chat
- Necesita un **estado de revisión** por sumario: `borrador_ia → en_revision → aprobado → publicado`
- Las sentencias de Laboral se publican en la lista del sitio web del PJM — hay que definir cómo se obtiene la lista semanal

### Relación con otros componentes

- **Pipeline de ingesta semanal**: Se puede integrar — cuando llegan PDFs nuevos, además de indexar en KB, se generan sumarios
- **Tool `generar_sumarios`**: Versión on-demand para cuando un usuario quiere sumarios de una sentencia específica desde el chat
- **Metadata de KB**: Los sumarios aprobados enriquecen los campos `voces` y `materia` del .metadata.json, mejorando los filtros de búsqueda

### Contacto

- **Cintia Martínez** — Disponible para reuniones post-feria, completó encuesta, conoce el proceso en detalle
- **Dra. Olga** — Solicitante del pedido, visión de automatización completa

---

## 5. Matriz de priorización (completar post-relevamiento)

Después de las entrevistas, clasificar cada caso de uso:

| Caso de uso | Frecuencia (diaria/semanal/mensual) | Tiempo que ahorra | Complejidad técnica | Prioridad |
|---|---|---|---|---|
| (completar) | | | | |

---

## 6. Próximos pasos sugeridos

1. Entrevistar 5-8 usuarios de distintos fueros (laboral, civil, penal, familia)
2. Clasificar los casos de uso por frecuencia e impacto
3. Priorizar los 3-4 casos de uso más demandados
4. Prototipar con esos casos antes de construir la solución completa
5. Validar el prototipo con los mismos usuarios que entrevistamos
