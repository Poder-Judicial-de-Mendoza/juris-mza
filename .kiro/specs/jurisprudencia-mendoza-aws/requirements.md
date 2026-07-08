# Requirements Document

## Introduction

Sistema de búsqueda semántica y asistente experto en jurisprudencia para el Poder Judicial de Mendoza. Provee tres funcionalidades principales: chat experto que cita sentencias reales, buscador semántico de sentencias, y generador de borradores de resoluciones. Desplegado sobre servicios gestionados de AWS con un enfoque de dos fases (RAG puro en Fase 1, Fine Tuning en Fase 2).

## Glossary

- **Sistema**: El conjunto completo de componentes de la aplicación Jurisprudencia Inteligente Mendoza desplegada en AWS
- **Chat_Experto**: Módulo de conversación que responde preguntas de jurisprudencia citando sentencias reales del Poder Judicial de Mendoza
- **Buscador_Semántico**: Módulo que busca sentencias por similitud semántica y presenta resultados como listado más respuesta en lenguaje natural
- **Generador_Borradores**: Módulo que produce borradores de resoluciones judiciales basados en jurisprudencia real recuperada
- **Knowledge_Base**: Amazon Bedrock Knowledge Base que indexa y recupera chunks de sentencias del bucket S3
- **Pipeline_Ingesta**: Proceso automatizado semanal que sincroniza nuevos PDFs con la Knowledge Base
- **Sesión**: Conversación individual de un usuario con el Chat Experto, aislada de otras sesiones
- **Sentencia**: Documento judicial en PDF almacenado en S3, proveniente del Poder Judicial de Mendoza
- **Usuario_Autenticado**: Persona del Poder Judicial de Mendoza que se autentica vía Keycloak y accede a todas las funcionalidades sin restricción
- **Chunk**: Fragmento de texto extraído de una sentencia, vectorizado e indexado para búsqueda semántica
- **Cita**: Referencia a una sentencia real que incluye carátula, tribunal, fecha y fragmento relevante

## Requirements

### Requisito 1: Chat experto en jurisprudencia

**User Story:** Como usuario autenticado del Poder Judicial, quiero hacer preguntas sobre jurisprudencia mendocina en lenguaje natural, para obtener respuestas precisas que citen sentencias reales.

#### Criterios de Aceptación

1. WHEN un usuario envía una pregunta al Chat_Experto, THE Chat_Experto SHALL recuperar chunks relevantes de la Knowledge_Base y generar una respuesta en español argentino formal jurídico
2. WHEN el Chat_Experto genera una respuesta con jurisprudencia encontrada, THE Chat_Experto SHALL incluir al menos una referencia a una sentencia real con carátula, tribunal, fecha y fragmento relevante
3. WHEN el Chat_Experto no encuentra jurisprudencia relevante para una consulta, THE Chat_Experto SHALL indicar explícitamente que no encontró jurisprudencia aplicable y sugerir reformular la consulta
4. WHEN el Chat_Experto cita una sentencia, THE Sistema SHALL proveer un enlace al PDF original de la sentencia almacenado en S3
5. WHILE un usuario mantiene una conversación activa, THE Chat_Experto SHALL mantener el contexto de la sesión para responder preguntas de seguimiento

### Requisito 2: Buscador semántico de sentencias

**User Story:** Como usuario autenticado del Poder Judicial, quiero buscar sentencias por consulta semántica, para encontrar jurisprudencia relevante presentada como listado y como respuesta en lenguaje natural.

#### Criterios de Aceptación

1. WHEN un usuario envía una consulta al Buscador_Semántico, THE Buscador_Semántico SHALL retornar un resumen en lenguaje natural y un listado de sentencias ordenadas por relevancia
2. WHEN el Buscador_Semántico presenta resultados, THE Buscador_Semántico SHALL incluir para cada sentencia: carátula, tribunal, fecha, fuero y fragmento relevante
3. WHERE el usuario aplica filtros opcionales de fuero, tribunal, fecha o materia, THE Buscador_Semántico SHALL restringir los resultados a las sentencias que cumplan los filtros seleccionados
4. WHEN el Buscador_Semántico no encuentra resultados para una consulta, THE Buscador_Semántico SHALL informar al usuario que no se encontraron sentencias relevantes

### Requisito 3: Generador de borradores de resoluciones

**User Story:** Como usuario autenticado del Poder Judicial, quiero generar borradores de resoluciones judiciales basados en precedentes reales, para agilizar la redacción de mis documentos.

#### Criterios de Aceptación

1. WHEN un usuario describe un caso y selecciona un tipo de resolución, THE Generador_Borradores SHALL buscar jurisprudencia similar y generar un borrador de resolución basado en precedentes reales
2. WHEN el Generador_Borradores produce un borrador, THE Generador_Borradores SHALL listar las sentencias citadas como referencia con sus datos identificatorios
3. WHEN el Generador_Borradores produce un borrador, THE Generador_Borradores SHALL incluir un disclaimer indicando que es un borrador sugerido y requiere revisión profesional
4. THE Generador_Borradores SHALL soportar los tipos de resolución: sentencia, auto, decreto y resolución

### Requisito 4: Autenticación y acceso

**User Story:** Como usuario del Poder Judicial, quiero autenticarme con mis credenciales de Keycloak existentes, para acceder al sistema sin necesidad de credenciales adicionales.

#### Criterios de Aceptación

1. WHEN un usuario accede al Sistema, THE Sistema SHALL redirigir la autenticación a Keycloak del Poder Judicial mediante federación OIDC a través de Cognito
2. WHEN un usuario se autentica exitosamente, THE Sistema SHALL otorgar acceso a todas las funcionalidades y todas las sentencias sin restricción por fuero
3. IF un usuario no autenticado intenta acceder a un endpoint protegido, THEN THE Sistema SHALL rechazar la solicitud y redirigir al flujo de autenticación
4. IF el proveedor Keycloak no está disponible, THEN THE Sistema SHALL mostrar un mensaje de error amigable y permitir el acceso a sesiones existentes con tokens de refresco válidos

### Requisito 5: Pipeline de ingesta semanal

**User Story:** Como administrador del sistema, quiero que los nuevos PDFs de sentencias se indexen automáticamente cada semana, para mantener actualizada la base de conocimiento.

#### Criterios de Aceptación

1. THE Pipeline_Ingesta SHALL ejecutarse semanalmente de forma automática mediante EventBridge
2. WHEN el Pipeline_Ingesta se ejecuta, THE Pipeline_Ingesta SHALL sincronizar la Knowledge_Base con los PDFs nuevos presentes en el bucket S3
3. WHEN la sincronización completa, THE Knowledge_Base SHALL contener los embeddings de todos los PDFs procesados exitosamente
4. IF un PDF no puede ser procesado durante la sincronización, THEN THE Pipeline_Ingesta SHALL registrar el fallo sin afectar el procesamiento de los demás PDFs
5. IF un PDF falla en el procesamiento, THEN THE Pipeline_Ingesta SHALL notificar al administrador para revisión manual

### Requisito 6: Precisión y veracidad de respuestas

**User Story:** Como usuario del Poder Judicial, quiero que las respuestas del sistema citen exclusivamente sentencias reales y verificables, para confiar en la información proporcionada.

#### Criterios de Aceptación

1. THE Chat_Experto SHALL generar respuestas utilizando exclusivamente información recuperada de la Knowledge_Base como contexto
2. THE Generador_Borradores SHALL basar sus borradores exclusivamente en jurisprudencia real recuperada del RAG
3. WHEN el Chat_Experto cita una sentencia, THE Sistema SHALL validar que el identificador de la sentencia corresponde a un documento existente e indexado en la Knowledge_Base
4. THE Sistema SHALL utilizar una temperatura de inferencia baja (0.2) para maximizar la precisión factual en las respuestas del Chat_Experto y del Buscador_Semántico

### Requisito 7: Gestión de sesiones de chat

**User Story:** Como usuario autenticado, quiero que mis conversaciones se guarden y pueda acceder a mi historial, para retomar consultas previas.

#### Criterios de Aceptación

1. WHEN un usuario inicia una conversación, THE Sistema SHALL crear una sesión con un identificador único y almacenarla en DynamoDB
2. WHEN un usuario envía un mensaje en una sesión existente, THE Sistema SHALL asociar el mensaje a la sesión correspondiente preservando el orden cronológico
3. WHEN un usuario consulta su historial, THE Sistema SHALL retornar la lista de sesiones previas del usuario con título y fecha de última actividad
4. THE Sistema SHALL mantener las sesiones de chat durante 30 días desde la última actividad, eliminándolas automáticamente tras ese período
5. THE Sistema SHALL garantizar que el historial de una sesión no influya en las respuestas de otra sesión del mismo usuario

### Requisito 8: Rendimiento y latencia

**User Story:** Como usuario del sistema, quiero recibir respuestas en tiempos razonables, para mantener un flujo de trabajo productivo.

#### Criterios de Aceptación

1. WHEN un usuario envía una pregunta al Chat_Experto, THE Sistema SHALL entregar la primera respuesta en menos de 5 segundos (P95) utilizando streaming
2. WHEN un usuario ejecuta una búsqueda semántica, THE Buscador_Semántico SHALL retornar resultados en menos de 4 segundos (P95)
3. WHEN un usuario solicita un borrador, THE Generador_Borradores SHALL entregar el borrador en menos de 15 segundos (P95)
4. IF una invocación a Bedrock excede los 30 segundos, THEN THE Sistema SHALL cancelar la operación y mostrar un mensaje solicitando reintentar

### Requisito 9: Seguridad y auditoría

**User Story:** Como administrador del sistema, quiero que todas las interacciones queden registradas y los datos estén protegidos, para cumplir con estándares de seguridad del Poder Judicial.

#### Criterios de Aceptación

1. THE Sistema SHALL cifrar todas las comunicaciones en tránsito mediante TLS 1.3
2. THE Sistema SHALL cifrar todos los datos en reposo mediante SSE-S3/KMS
3. WHEN un usuario realiza una consulta, THE Sistema SHALL registrar en CloudWatch Logs el userId, timestamp y tipo de operación
4. THE Sistema SHALL configurar Guardrails de Bedrock para restringir las respuestas al ámbito jurídico

### Requisito 10: Manejo de errores

**User Story:** Como usuario del sistema, quiero recibir mensajes claros cuando algo falla, para saber qué hacer a continuación.

#### Criterios de Aceptación

1. IF la Knowledge_Base retorna resultados con score de relevancia menor a 0.3, THEN THE Chat_Experto SHALL informar al usuario que no encontró jurisprudencia específica y sugerir reformular la consulta
2. IF una invocación a Bedrock falla, THEN THE Sistema SHALL reintentar automáticamente con backoff exponencial hasta 3 intentos
3. IF la tasa de errores de Bedrock supera el 5%, THEN THE Sistema SHALL generar una alarma en CloudWatch para notificar al administrador
4. IF un usuario solicita el PDF de una sentencia y el archivo no está disponible en S3, THEN THE Sistema SHALL informar que el documento no está disponible temporalmente
