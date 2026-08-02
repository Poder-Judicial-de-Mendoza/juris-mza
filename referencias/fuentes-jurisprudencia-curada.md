# Fuentes de Jurisprudencia Curada — Sistemas Existentes del PJM

## Resumen

Existen **dos sistemas de consulta de jurisprudencia** del Poder Judicial de Mendoza que contienen sumarios y voces curadas manualmente por profesionales. Estos sistemas representan un subconjunto enriquecido de las sentencias que están en el data lake (S3).

Son fuentes clave porque:
1. Contienen **sumarios redactados por humanos** siguiendo pautas formales (SAIJ)
2. Tienen **voces/descriptores** de un vocabulario controlado (tesauro)
3. Son el **gold standard** para validar la generación automática de sumarios (caso de uso #11)
4. Su metadata enriquece la Knowledge Base y mejora los filtros de búsqueda semántica

---

## Sistema 1: SIJ — Servicio de Información Jurídica (wwwjuri)

- **URL**: https://wwwjuri.jus.mendoza.gov.ar/jurisprudencia/consultar/index.php
- **Versión**: 2.1, agosto 2011 (sistema legacy, activo)
- **Contacto técnico**: Ing. Amira Eluani (`aeluani@jus.mendoza.gov.ar`) — Informática Documental
- **Pautas de sumarización**: https://www2.jus.mendoza.gov.ar/corte2/interno/pautas.php
- **Tesauro**: http://www.jus.mendoza.gov.ar/jurisprudencia/tesauro/tesauro.php

### Bases de datos disponibles

El sistema organiza la jurisprudencia por tribunal:
- Suprema Corte de Justicia de Mendoza (SCJM)
- Cámaras Civiles
- Cámara de Apelaciones de Familia
- Cámaras Penales
- Apelación en lo Criminal
- Tribunales Penales de Menores
- Cámaras Laborales
- Juzgados Correccionales
- **Fallos de Primera Instancia**: Tribunales de Gestión Asociada, Juzgados Civiles, Tribunales Tributarios

### Campos de búsqueda

| Campo | Descripción |
|---|---|
| Número de expediente | Numérico, sin punto de miles |
| Partes/Carátula | Apellido de alguna persona interviniente |
| Preopinante | Apellido del juez que dictó la resolución (en colegiados: preopinante) |
| Fecha | Fecha de la resolución |
| Libro | Libro de autos/sentencias donde se archivó la copia |
| Voces/Temas | Términos del tesauro (vocabulario controlado) |

### Estructura de datos interna (a confirmar con Amira)

Cada registro de jurisprudencia contiene:
- Identificador interno
- Tribunal
- Fecha de resolución
- Número de expediente
- Carátula (partes)
- Preopinante/magistrados
- Libro y folio
- **Voces** (descriptores del tesauro)
- **Sumario** (texto redactado según pautas)
- Enlace al texto completo (cuando está disponible)

---

## Sistema 2: Biblioteca Judicial — Portal Institucional

- **URL**: https://jusmendoza.gob.ar/biblioteca-judicial/jurisprudencia/
- **Naturaleza**: Portal institucional nuevo (parte del sitio web renovado del PJM)
- **Relación con SIJ**: Probablemente es una interfaz moderna que consulta los mismos datos del sistema viejo, o un redirect/iframe al SIJ

### Observaciones

El contenido sustantivo parece estar detrás de la interfaz del SIJ. Este portal funciona más como punto de entrada institucional.

---

## Pautas para la Redacción de Sumarios (del SIJ)

Estas pautas rigen cómo se elaboran los sumarios curados y son la referencia para el caso de uso #11 (generación automática):

| Pauta | Descripción |
|---|---|
| **Doctrina Única** | Cada sumario = una sola doctrina. Tantos sumarios como doctrinas surjan del fallo |
| **Autonomía** | Comprensible sin leer el fallo ni otros sumarios del mismo |
| **Generalidad** | Aplicable a otros casos similares, no solo al caso concreto |
| **Abstracción** | Atemporal, aespacial, apersonal — sin datos de tiempo/lugar/personas salvo relevancia jurídica |
| **Hechos Relevantes** | Solo incluir hechos si tienen relevancia jurídica y contribuyen a precisar la doctrina |
| **Brevedad y Concisión** | Frases cortas y concisas |
| **Claridad y Concreción** | Sencillo, directo, vocabulario jurídico adecuado, comprensión en primera lectura |
| **Fidelidad** | Sin interpretación personal — refleja exactamente lo expresado por el magistrado |
| **Sumario Textual** | Un párrafo textual del fallo puede usarse como sumario si cumple todas las pautas |
| **Títulos** | Perfecta correspondencia con el contenido, voces ordenadas de general a particular |

---

## Rol en el Proyecto de Jurisprudencia IA

### Como fuente de datos

```
┌─────────────────────────────────────────────────────────────┐
│                    FUENTES DE DATOS                          │
│                                                             │
│  ┌─────────────────────┐    ┌──────────────────────────┐   │
│  │  Data Lake S3       │    │  SIJ (wwwjuri)           │   │
│  │  (PDFs completos)   │    │  (sumarios + voces)      │   │
│  │                     │    │                          │   │
│  │  ~todas las         │    │  subconjunto curado      │   │
│  │  sentencias         │    │  con metadata rica       │   │
│  └────────┬────────────┘    └────────────┬─────────────┘   │
│           │                              │                  │
│           ▼                              ▼                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Knowledge Base (Bedrock)                     │   │
│  │                                                     │   │
│  │  Chunks de sentencias + metadata enriquecida        │   │
│  │  (voces, sumarios, tribunal, juez, fecha, materia)  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Usos concretos

1. **Enriquecimiento de metadata en la KB**: Las voces y sumarios del SIJ se inyectan como campos del `.metadata.json` de cada sentencia en la KB, mejorando filtros y relevancia
2. **Gold standard para validación**: Los sumarios existentes sirven para evaluar la calidad de los sumarios generados automáticamente (caso #11)
3. **Tesauro como vocabulario de voces**: El agente debe usar el mismo vocabulario controlado al asignar voces
4. **Referencia cruzada**: Cuando el agente devuelve una sentencia, puede indicar si tiene sumarios curados disponibles

---

## Preguntas Abiertas (a relevar con Informática Documental)

1. **¿Hay acceso directo a la base de datos del SIJ?** (API, conexión DB, dump exportable)
2. **¿En qué tecnología corre?** (probablemente PHP + MySQL/PostgreSQL dado que es de 2011)
3. **¿Cuántos registros tiene?** (cantidad total de sumarios, por fuero)
4. **¿Se sigue actualizando activamente?** ¿Quiénes cargan sumarios nuevos?
5. **¿El tesauro está digitalizado en formato consultable?** (lista descargable, API, o solo navegación web)
6. **¿Hay algún plan de migración o modernización del SIJ?** (¿nuestro sistema lo reemplazaría o complementaría?)
7. **¿Hay un vínculo entre el ID de sentencia en el SIJ y la ubicación del PDF en el data lake?** (clave para cruzar datos)

---

## Contactos Relevantes

| Persona | Rol | Contacto |
|---|---|---|
| Ing. Amira Eluani | Webmaster / Informática Documental | aeluani@jus.mendoza.gov.ar |
| Cintia Martínez | Letrada, genera sumarios manualmente | (contacto directo existente) |
| Dra. Olga | Solicitante automatización de sumarios | (vía Cintia) |
