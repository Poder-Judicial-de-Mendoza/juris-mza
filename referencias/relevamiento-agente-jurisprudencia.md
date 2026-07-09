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
