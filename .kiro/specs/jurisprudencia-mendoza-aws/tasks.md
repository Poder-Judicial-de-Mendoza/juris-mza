# Implementation Plan: Jurisprudencia Inteligente Mendoza - AWS

## Overview

Implementación de un sistema RAG sobre servicios gestionados de AWS para búsqueda semántica y asistente experto en jurisprudencia del Poder Judicial de Mendoza. El plan optimiza para el camino más rápido a un prototipo funcional (~7 días hábiles): infraestructura → backend → frontend → demo.

**Stack**: Lambda Python 3.12 + React 18 (Vite + TypeScript) + Bedrock (Claude Sonnet 5) + S3 Vectors + AgentCore Harness + Cognito/Keycloak

## Tasks

- [ ] 0. Setup de cuenta AWS e IAM
  - [ ] 0.1 Crear cuenta AWS y configurar acceso CLI
    - Documentar pasos manuales: crear cuenta AWS, habilitar MFA en root
    - Crear usuario IAM administrador (evitar uso de root) con acceso programático
    - Configurar AWS CLI local con `aws configure` o AWS SSO
    - Verificar acceso: `aws sts get-caller-identity`
    - Habilitar regiones necesarias (us-east-1 para Bedrock con Claude Sonnet 5)
    - _Requirements: 9.1, 9.2_

  - [ ] 0.2 Crear roles de servicio IAM
    - Crear rol `BedrockKBRole` con permisos para S3 (lectura bucket sentencias cross-account + escritura bucket vectors), Bedrock, y logs
    - Crear rol `BedrockAgentRole` con permisos para invocar modelos Bedrock, Knowledge Bases y Guardrails
    - Crear rol `LambdaExecutionRole` con permisos para invocar Bedrock Agent, generar presigned URLs S3, escribir CloudWatch Logs
    - Crear rol `AmplifyServiceRole` para Amplify Hosting con acceso a Cognito
    - Usar políticas de mínimo privilegio con condiciones de recurso específicas
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 0.3 Configurar acceso cross-account al bucket S3 de sentencias
    - Documentar la bucket policy que el administrador del data lake debe agregar al bucket origen (permitir GetObject, ListBucket al account nuevo)
    - Crear IAM policy en la cuenta del proyecto que permita `s3:GetObject` y `s3:ListBucket` sobre el bucket del data lake
    - Adjuntar la policy cross-account al `BedrockKBRole`
    - Verificar acceso: `aws s3 ls s3://BUCKET_DATA_LAKE/sentencias/ --profile proyecto`
    - Verificar lectura: `aws s3 cp s3://BUCKET_DATA_LAKE/sentencias/test.pdf /tmp/test.pdf`
    - _Requirements: 5.2, 5.3_

  - [ ] 0.4 Crear bucket S3 para vectores y artefactos del proyecto
    - Crear bucket para S3 Vectors: `aws s3 mb s3://jurisprudencia-mza-vectors`
    - Crear bucket para artefactos Lambda: `aws s3 mb s3://jurisprudencia-mza-artifacts`
    - Habilitar cifrado SSE-S3 por defecto en ambos buckets
    - Bloquear acceso público en ambos buckets
    - _Requirements: 9.2_

- [ ] 1. Checkpoint - Verificar infraestructura base
  - Ensure all tests pass, ask the user if questions arise.
  - Verificar: CLI funciona, roles creados, acceso cross-account S3 confirmado, buckets creados

- [ ] 2. Configurar Bedrock Knowledge Base y modelo
  - [ ] 2.1 Crear Knowledge Base con S3 Vectors
    - Crear vector index en S3 Vectors: `aws s3vectors create-vector-bucket` + `create-index`
    - Crear Knowledge Base apuntando al bucket de sentencias cross-account como data source
    - Configurar embedding model: `amazon.titan-embed-text-v2:0` (1024 dims, español nativo)
    - Configurar vector store type: S3_VECTORS con el bucket/index creado
    - Configurar chunking strategy: HIERARCHICAL (parent=1500, child=300, overlap=60)
    - Configurar metadata: tipo METADATA_FILE para leer archivos .metadata.json junto a los PDFs
    - _Requirements: 1.1, 2.1, 5.3, 6.1_

  - [ ] 2.2 Ejecutar sincronización inicial de la Knowledge Base
    - Disparar sync del data source: `aws bedrock-agent start-ingestion-job`
    - Monitorear progreso del job hasta completar
    - Verificar que se indexaron documentos: consultar métricas del job
    - Testear retrieval básico con una query de prueba
    - _Requirements: 5.2, 5.3_

  - [ ] 2.3 Configurar Bedrock Guardrails con Contextual Grounding
    - Crear guardrail con `aws bedrock create-guardrail`
    - Configurar Contextual Grounding Check: groundingThreshold=0.7, relevanceThreshold=0.5, action=BLOCK
    - Configurar topic policy: bloquear política partidaria, opiniones personales, temas no jurídicos
    - Testear guardrail con prompts que deberían ser bloqueados
    - _Requirements: 6.1, 6.2, 9.4_

  - [ ] 2.4 Crear Bedrock Agent con AgentCore Harness
    - Crear agente con modelo `anthropic.claude-sonnet-5-20260630-v1:0`
    - Configurar instructions del agente (prompt de sistema experto en jurisprudencia)
    - Asociar Knowledge Base al agente como recurso de retrieval
    - Asociar Guardrail creado al agente
    - Habilitar AgentCore Harness: session management MANAGED + response streaming
    - Configurar inferencia: temperature=0.2, maxTokens=4096, topP=0.9
    - Crear alias del agente para invocación
    - Testear agente con pregunta de prueba y verificar citas en respuesta
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 6.1, 7.1, 7.5, 8.1_

  - [ ]* 2.5 Write property test para validación de citas en respuestas
    - **Property 1: Completitud de citas en respuestas**
    - **Validates: Requirements 1.2, 1.4**

- [ ] 3. Checkpoint - Verificar motor de IA funcional
  - Ensure all tests pass, ask the user if questions arise.
  - Verificar: KB sincronizada, Guardrails activos, Agent responde con citas, streaming funciona

- [ ] 4. Implementar API Backend (Lambda + API Gateway)
  - [ ] 4.1 Crear estructura del proyecto Lambda y dependencias
    - Crear directorio `backend/` con estructura: `handlers/`, `services/`, `utils/`, `tests/`
    - Crear `requirements.txt` con boto3, aws-lambda-powertools
    - Definir interfaces/types en `models.py` (ChatRequest, BusquedaRequest, BorradorRequest, etc.)
    - Configurar logging estructurado con Lambda Powertools (userId, timestamp, operación)
    - _Requirements: 9.3_

  - [ ] 4.2 Implementar handler del Chat Experto
    - Crear `handlers/chat.py` con endpoint POST /chat
    - Implementar invocación a Bedrock Agent con `invoke_agent` (sessionId para continuidad)
    - Implementar streaming de respuesta vía `InvokeAgentWithResponseStream`
    - Parsear respuesta del agente: extraer texto, fuentes/citas, metadata de sentencias
    - Generar presigned URLs para PDFs citados (acceso cross-account)
    - Implementar retry con backoff exponencial (max 3 intentos) ante fallos de Bedrock
    - Manejar caso de score < 0.3: responder que no encontró jurisprudencia
    - Log de auditoría: userId, timestamp, tipo=chat
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.3, 8.1, 9.3, 10.1, 10.2_

  - [ ] 4.3 Implementar handler del Buscador Semántico
    - Crear `handlers/buscar.py` con endpoint POST /buscar
    - Implementar retrieval directo a Knowledge Base con `retrieve` (top-20 chunks)
    - Implementar filtrado por metadata (fuero, tribunal, fecha, materia) si se pasan filtros
    - Invocar Claude para generar resumen en lenguaje natural de los resultados
    - Formatear respuesta: resumenNatural + listado de sentencias con todos los campos
    - Generar presigned URLs para PDFs de resultados
    - Log de auditoría: userId, timestamp, tipo=busqueda
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 8.2, 9.3_

  - [ ] 4.4 Implementar handler del Generador de Borradores
    - Crear `handlers/generar_borrador.py` con endpoint POST /generar-borrador
    - Buscar jurisprudencia similar al caso descrito vía Knowledge Base
    - Invocar Claude con temperature=0.7 para generar borrador basado en precedentes
    - Incluir disclaimer obligatorio en la respuesta
    - Listar sentencias citadas con datos identificatorios
    - Validar tipo de resolución: sentencia, auto, decreto, resolución
    - Log de auditoría: userId, timestamp, tipo=borrador
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.2, 8.3, 9.3_

  - [ ] 4.5 Implementar handler de historial y detalle de sentencias
    - Crear `handlers/sessions.py`: GET /chat/sessions (listar sesiones del usuario)
    - Crear `handlers/sessions.py`: GET /chat/sessions/{sessionId} (historial de una sesión)
    - Crear `handlers/sentencia.py`: GET /sentencia/{id} (metadata de sentencia)
    - Crear `handlers/sentencia.py`: GET /sentencia/{id}/pdf (presigned URL al PDF)
    - Implementar TTL de 30 días para sesiones (AgentCore config)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 1.4_

  - [ ]* 4.6 Escribir unit tests para handlers Lambda
    - Test chat handler: mock de Bedrock Agent, verificar formato respuesta con citas
    - Test buscador: mock de KB retrieve, verificar filtrado y formato
    - Test generador: mock de Claude, verificar disclaimer y tipos de resolución
    - Test manejo de errores: timeout, score bajo, PDF no disponible
    - _Requirements: 10.1, 10.2, 10.4_

  - [ ] 4.7 Crear API Gateway HTTP API y desplegar Lambdas
    - Crear HTTP API en API Gateway con authorizer Cognito JWT
    - Configurar rutas: POST /chat, POST /buscar, POST /generar-borrador, GET /sentencia/{id}, GET /sentencia/{id}/pdf, GET /chat/sessions, GET /chat/sessions/{sessionId}
    - Empaquetar y desplegar funciones Lambda con roles correctos
    - Configurar timeout Lambda: 30s para chat/borradores, 15s para búsqueda
    - Habilitar CORS para dominio de Amplify
    - Configurar throttling: 50 req/s (más que suficiente para 20-30 usuarios)
    - _Requirements: 4.3, 8.1, 8.2, 8.3, 8.4, 9.1_

  - [ ]* 4.8 Write property test para aislamiento de sesiones
    - **Property 6: Aislamiento de sesiones**
    - **Validates: Requirements 7.5**

- [ ] 5. Checkpoint - Verificar API funcional end-to-end
  - Ensure all tests pass, ask the user if questions arise.
  - Verificar: todos los endpoints responden, streaming funciona, citas válidas, errores manejados

- [ ] 6. Configurar autenticación Cognito + Keycloak
  - [ ] 6.1 Crear Cognito User Pool con federación OIDC
    - Crear User Pool: `aws cognito-idp create-user-pool`
    - Configurar Identity Provider OIDC apuntando a Keycloak del Poder Judicial
    - Configurar attribute mapping: email, name, preferred_username
    - Crear App Client para el frontend (PKCE flow, sin secret)
    - Configurar hosted UI y callback URLs para Amplify
    - Configurar dominio custom de Cognito
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 6.2 Integrar authorizer JWT en API Gateway
    - Crear JWT authorizer en API Gateway apuntando a Cognito User Pool
    - Aplicar authorizer a todas las rutas protegidas
    - Testear: request sin token → 401, request con token válido → 200
    - Extraer userId (sub) del token en los handlers Lambda
    - _Requirements: 4.3, 9.3_

  - [ ]* 6.3 Write property test para enforcement de autenticación
    - **Property 11: Enforcement de autenticación**
    - **Validates: Requirements 4.3**

- [ ] 7. Implementar Frontend (React + Vite + Amplify)
  - [ ] 7.1 Crear proyecto React con Vite y configurar Amplify
    - Inicializar proyecto con `npm create vite@latest -- --template react-ts`
    - Instalar dependencias: TailwindCSS, react-router-dom, AWS Amplify SDK, react-markdown
    - Configurar Amplify Auth (Cognito) en el frontend
    - Implementar login/logout con redirección a Keycloak
    - Configurar variables de entorno: API URL, Cognito config, región
    - _Requirements: 4.1, 4.2_

  - [ ] 7.2 Implementar página Chat Experto con streaming
    - Crear componente de chat con input, historial de mensajes y panel de citas
    - Implementar streaming de respuestas (token a token) usando fetch con ReadableStream
    - Renderizar citas de sentencias como cards clickeables con link al PDF
    - Implementar continuación de sesión (sessionId persistente)
    - Implementar listado de sesiones previas en sidebar
    - Estilo: diseño institucional, español argentino, accesible (WCAG 2.1 AA)
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 7.3, 8.1_

  - [ ] 7.3 Implementar página Buscador Semántico
    - Crear barra de búsqueda con filtros desplegables (fuero, tribunal, fecha, materia)
    - Implementar panel de resultados dual: resumen en lenguaje natural + listado de sentencias
    - Cada resultado muestra: carátula, tribunal, fecha, fuero, fragmento relevante
    - Link a PDF original en cada resultado
    - Estado vacío y estado sin resultados con mensaje apropiado
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 8.2_

  - [ ] 7.4 Implementar página Generador de Borradores
    - Crear formulario: textarea para descripción del caso, selector de tipo de resolución
    - Mostrar borrador generado en editor de texto con formato
    - Mostrar sentencias citadas como referencias al costado
    - Mostrar disclaimer obligatorio de forma prominente
    - Botón de copiar/exportar borrador
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.3_

  - [ ] 7.5 Implementar visor de PDF y manejo de errores global
    - Integrar visor de PDF (iframe con presigned URL o react-pdf)
    - Implementar error boundary global con mensajes amigables en español
    - Manejar caso: PDF no disponible → mensaje "documento no disponible temporalmente"
    - Manejar caso: timeout → mensaje "intentá de nuevo"
    - Manejar caso: Keycloak no disponible → mensaje de error de autenticación
    - _Requirements: 1.4, 4.4, 10.4, 8.4_

  - [ ] 7.6 Desplegar frontend en AWS Amplify
    - Conectar repositorio Git a Amplify Hosting
    - Configurar build settings para Vite SPA (dist folder)
    - Configurar variables de entorno en Amplify (API URL, Cognito)
    - Configurar dominio custom si aplica
    - Verificar deploy y flujo completo: login → chat → búsqueda → borradores
    - _Requirements: 4.1, 4.2_

- [ ] 8. Checkpoint - Demo funcional end-to-end
  - Ensure all tests pass, ask the user if questions arise.
  - Verificar flujo completo: login via Keycloak → chat con citas → búsqueda con filtros → borrador con disclaimer → PDF viewer

- [ ] 9. Pipeline de ingesta semanal (post-demo)
  - [ ] 9.1 Crear pipeline con EventBridge + Lambda para sincronización semanal
    - Crear regla EventBridge: schedule semanal (cron: domingos 3am)
    - Crear Lambda que detecte PDFs nuevos (por fecha de modificación S3)
    - Implementar generación de archivos .metadata.json para PDFs nuevos (datos del data lake)
    - Disparar `start-ingestion-job` de Bedrock KB para sync incremental
    - Implementar manejo de errores: PDF que falla no afecta al resto
    - Notificar al admin si hay fallos (SNS → email)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 9.2 Write property test para aislamiento de fallos en ingesta
    - **Property 9: Aislamiento de fallos en ingesta**
    - **Validates: Requirements 5.4**

- [ ] 10. Monitoreo y alarmas (post-demo)
  - [ ] 10.1 Configurar CloudWatch dashboards y alarmas
    - Crear dashboard con métricas: latencia P95, tasa de errores, invocaciones
    - Crear alarma: tasa de errores Bedrock > 5% → notificación SNS
    - Crear alarma: latencia P95 > 30s → notificación SNS
    - Configurar log groups con retención de 30 días
    - Verificar que logs de auditoría incluyen userId, timestamp, tipo de operación
    - _Requirements: 9.3, 10.3, 8.4_

- [ ] 11. Checkpoint final - Sistema completo
  - Ensure all tests pass, ask the user if questions arise.
  - Verificar: pipeline de ingesta funciona, alarmas configuradas, logs de auditoría completos

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para llegar más rápido al prototipo
- Tarea 0 incluye pasos manuales (crear cuenta AWS) que deben hacerse fuera del código
- La política de bucket cross-account debe ser solicitada al administrador del data lake
- El pipeline de ingesta (Tarea 9) y monitoreo (Tarea 10) son post-demo — el prototipo funciona sin ellos
- AgentCore Harness elimina la necesidad de DynamoDB para sesiones
- Los archivos .metadata.json se generan con datos del data lake existente
- Región objetivo: us-east-1 (disponibilidad de Claude Sonnet 5 y S3 Vectors)
- Para la demo: se puede usar un subconjunto de sentencias ya indexadas
- Cada task referencia requirements específicos para trazabilidad

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["0.1"] },
    { "id": 1, "tasks": ["0.2", "0.4"] },
    { "id": 2, "tasks": ["0.3"] },
    { "id": 3, "tasks": ["2.1"] },
    { "id": 4, "tasks": ["2.2", "2.3"] },
    { "id": 5, "tasks": ["2.4"] },
    { "id": 6, "tasks": ["2.5", "4.1", "6.1"] },
    { "id": 7, "tasks": ["4.2", "4.3", "4.4", "4.5", "7.1"] },
    { "id": 8, "tasks": ["4.6", "4.7", "6.2"] },
    { "id": 9, "tasks": ["4.8", "6.3", "7.2", "7.3", "7.4"] },
    { "id": 10, "tasks": ["7.5", "7.6"] },
    { "id": 11, "tasks": ["9.1"] },
    { "id": 12, "tasks": ["9.2", "10.1"] }
  ]
}
```
