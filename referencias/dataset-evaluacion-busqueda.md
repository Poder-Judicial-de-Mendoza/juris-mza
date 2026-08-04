# Dataset de Evaluación — Búsqueda Jurisprudencial

## Archivo fuente

`referencias/busqueda jurisprudencial.ods` (LibreOffice Calc)

## Descripción

Dataset de **15 consultas de evaluación** (con 28 sentencias-respuesta) para testear la calidad del retrieval del agente de jurisprudencia. Fue creado como ejemplo de búsquedas reales que haría un usuario del sistema.

Cada consulta es una pregunta en **lenguaje natural** (como la haría un juez o letrado), y cada respuesta es la **sentencia correcta** que el sistema debería devolver (ground truth).

## Estructura del archivo

| Columna | Campo | Descripción |
|---|---|---|
| A | Búsqueda | Pregunta en lenguaje natural |
| B | Respuesta esperada | Carátula completa de la sentencia correcta |
| C | Id Actuación | Identificador numérico interno de la actuación |
| D | Fecha de firma | Fecha en formato YYYY-MM-DD |
| E | CUIJ | Código Único de Identificación Judicial |
| F | (compuesto) | Formato `YYYYMMDD_IdActuacion` (identificador de referencia) |

## Nota sobre multi-respuesta

Varias preguntas tienen **múltiples sentencias correctas** (varias filas consecutivas sin nueva pregunta en columna A). Esto es correcto: una consulta puede tener más de una sentencia relevante.

## Fuero y tribunal

Todas las consultas corresponden al **fuero Penal** y son sentencias de la **Suprema Corte de Justicia de Mendoza** (recursos extraordinarios de casación, inconstitucionalidad y revisión).

## Temas cubiertos

| # | Tema de la consulta |
|---|---|
| 1 | Acoso sexual callejero (contravención) |
| 2 | Tentativa perfecta vs. imperfecta |
| 3 | Recurso de inconstitucionalidad + doctrina de arbitrariedad |
| 4 | Dolo vs. imprudencia en juicio por jurados (homicidio) |
| 5 | Perspectiva de género y masculinidades |
| 6 | Insolvencia alimentaria fraudulenta |
| 7 | Extorsión |
| 8 | Intervención delictiva en juicio por jurados |
| 9 | Impedimento de contacto + perspectiva de género (absolución de mujer) |
| 10 | Victimización primaria y secundaria |
| 11 | Capacitación del jurado en perspectiva de género |
| 12 | Integración del tribunal con mujeres en casos de violencia de género |
| 13 | Fundamentos orales |
| 14 | Dolo vs. imprudencia (general) |
| 15 | Reincidencia (reforma ley 27.785) |

## Uso en el proyecto

### Para evaluación de retrieval (Knowledge Base)
- Ejecutar cada consulta contra la KB con `buscar_sentencias`
- Verificar que la(s) sentencia(s) esperada(s) aparezcan en los resultados
- Métricas: **Recall@K** (¿la sentencia correcta está en los top K resultados?), **MRR** (posición del primer resultado correcto)

### Para evaluación end-to-end del agente
- Ejecutar cada consulta como pregunta al agente completo
- Verificar que la respuesta cite la sentencia correcta
- Evaluar calidad de la respuesta (¿responde la pregunta? ¿cita correctamente?)

### Para testing del identificador de sentencias
- El campo `Id Actuación` y `CUIJ` son claves para verificar que el sistema encuentra la sentencia correcta en el data lake
- El formato compuesto `YYYYMMDD_IdActuacion` puede usarse como referencia cruzada con los archivos en S3

### Como dataset de referencia para QA
- Las consultas representan el tipo de búsqueda real que hacen los usuarios
- La dificultad es variada: desde búsquedas directas (tema concreto) hasta búsquedas complejas (múltiples criterios cruzados)
- Algunas consultas requieren comprensión semántica profunda (ej: "perspectiva de género + masculinidades")

## Métricas sugeridas

| Métrica | Descripción | Objetivo mínimo |
|---|---|---|
| Recall@5 | % de consultas donde la sentencia correcta aparece en top 5 | ≥ 80% |
| Recall@10 | % de consultas donde la sentencia correcta aparece en top 10 | ≥ 90% |
| MRR | Mean Reciprocal Rank (promedio de 1/posición del primer resultado correcto) | ≥ 0.5 |
| Precisión del agente | % de respuestas que citan la sentencia correcta | ≥ 85% |

## Origen

Creado por el equipo del proyecto como ejemplo de búsquedas reales para validar el sistema. Las sentencias referenciadas son casos reales resueltos por la SCJM.
