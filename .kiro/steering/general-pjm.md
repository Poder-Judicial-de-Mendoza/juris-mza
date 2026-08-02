# Lineamientos Generales — Poder Judicial de Mendoza

## Contexto Institucional
- **Entidad**: Poder Judicial de la Provincia de Mendoza, República Argentina.
- **Proyecto**: Sistema de Jurisprudencia Inteligente con IA (búsqueda semántica + asistente experto).
- **Audiencia**: Jueces, secretarios y letrados del Poder Judicial (20-30 usuarios internos).
- **Tono**: Formal, judicial e institucional. Lenguaje profesional y preciso.

## Protección de Datos
- **Privacidad por defecto** (Privacy by Design). Ley 25.326 (Protección de Datos Personales).
- Toda información judicial es de acceso restringido y auditado.
- No exponer datos sensibles en logs, respuestas de error ni repositorios.

## Idioma y Convenciones de Código
- **Todo el desarrollo en español**: variables, clases, funciones, comentarios, mensajes al usuario.
- Evitar anglicismos innecesarios.
- Usar **CUIL** (no CUIT) para identificación de personas.
- Español de Argentina en la interfaz y respuestas del modelo de IA.

## Fuentes de Datos de Jurisprudencia
- **Data Lake S3**: PDFs completos de todas las sentencias (fuente primaria para la KB)
- **SIJ (Servicio de Información Jurídica)**: Sistema legacy con sumarios y voces curadas por humanos
  - URL: https://wwwjuri.jus.mendoza.gov.ar/jurisprudencia/consultar/index.php
  - Portal: https://jusmendoza.gob.ar/biblioteca-judicial/jurisprudencia/
  - Contiene: sumarios (pautas SAIJ), voces (tesauro controlado), metadata estructurada
  - Es un **subconjunto enriquecido** de las sentencias del data lake
  - Contacto técnico: Ing. Amira Eluani (Informática Documental)
  - Documentación completa: `referencias/fuentes-jurisprudencia-curada.md`

## Infraestructura
- **Cloud**: AWS (cuenta dedicada `jurisprudencia-ia-mendoza`)
- **Autenticación**: Keycloak del PJM (realm `internals`) directo con `keycloak-js`
- **Región AWS**: us-east-1
- **Código abierto**: Repositorio en GitHub organización Poder-Judicial-de-Mendoza
