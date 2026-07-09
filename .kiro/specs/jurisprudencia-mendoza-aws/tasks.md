# Implementation Plan: Jurisprudencia Inteligente Mendoza - AWS

## Overview

Sistema de jurisprudencia inteligente sobre Strands Agents SDK + AgentCore Runtime + Bedrock Knowledge Bases. Plan optimizado para llegar a demo funcional en ~4 semanas.

**Stack**:
- Agente: Strands Agents SDK (Python) desplegado en AgentCore Runtime
- API utilitaria: FastAPI + Mangum en Lambda + API Gateway REST (streaming)
- Frontend: React 18 + Vite + TypeScript + TailwindCSS en Amplify
- IA: Claude Sonnet 5 + Bedrock KB + S3 Vectors + Guardrails
- Auth: Keycloak directo (sin Cognito) + Lambda Authorizer custom
- IaC: AWS SAM

## Tasks

- [ ] 0. Setup de cuenta AWS e infraestructura base
  - [ ] 0.1 Crear cuenta AWS y configurar acceso CLI
    - Crear cuenta AWS dedicada, habilitar MFA en root
    - Crear usuario IAM administrador con acceso programático
    - Configurar AWS CLI local con `aws configure` (región us-east-1)
    - Verificar acceso: `aws sts get-caller-identity`
    - _Requirements: 9.1, 9.2_

  - [ ] 0.2 Crear roles de servicio IAM
    - Rol `BedrockKBRole`: permisos S3 (lectura cross-account + escritura vectors), Bedrock, logs
    - Rol `AgentCoreRole`: permisos para invocar Bedrock, KB, S3, Guardrails
    - Rol `LambdaExecutionRole`: presigned URLs S3, CloudWatch Logs
    - Rol `LambdaAuthorizerRole`: acceso a JWKS endpoint (egress HTTPS)
    - Políticas de mínimo privilegio con condiciones de recurso
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 0.3 Configurar acceso cross-account al bucket S3 de sentencias
    - Documentar bucket policy que el admin del data lake debe agregar
    - Crear IAM policy en la cuenta del proyecto (GetObject, ListBucket)
    - Adjuntar al BedrockKBRole y AgentCoreRole
    - Verificar: `aws s3 ls s3://BUCKET_DATA_LAKE/sentencias/`
    - _Requirements: 5.2, 5.3_

  - [ ] 0.4 Crear buckets del proyecto
    - Bucket para S3 Vectors: `jurisprudencia-mza-vectors`
    - Bucket para artefactos: `jurisprudencia-mza-artifacts`
    - Cifrado SSE-S3, bloquear acceso público
    - _Requirements: 9.2_

- [ ] 1. Checkpoint — Infraestructura base verificada
  - CLI funciona, roles creados, acceso cross-account S3 confirmado, buckets creados

- [ ] 2. Configurar Bedrock Knowledge Base y Guardrails
  - [ ] 2.1 Crear Knowledge Base con S3 Vectors
    - Crear vector index en S3 Vectors: `create-vector-bucket` + `create-index`
    - Crear KB apuntando al bucket de sentencias cross-account
    - Embedding model: `amazon.titan-embed-text-v2:0` (1024 dims, español nativo)
    - Vector store: S3_VECTORS con bucket/index creado
    - Chunking: HIERARCHICAL (parent=1500, child=300, overlap=60)
    - Metadata: tipo METADATA_FILE (.metadata.json junto a los PDFs)
    - _Requirements: 1.1, 2.1, 5.3, 6.1_

  - [ ] 2.2 Ejecutar sincronización inicial
    - Disparar sync: `aws bedrock-agent start-ingestion-job`
    - Monitorear progreso hasta completar
    - Verificar indexación: testear retrieval con query de prueba
    - _Requirements: 5.2, 5.3_

  - [ ] 2.3 Configurar Bedrock Guardrails
    - Crear guardrail con Contextual Grounding: grounding=0.7, relevance=0.5, action=BLOCK
    - Topic policy: bloquear política partidaria, opiniones personales, temas no jurídicos
    - Testear con prompts que deberían ser bloqueados
    - _Requirements: 6.1, 6.2, 9.4_

- [ ] 3. Checkpoint — KB funcional con retrieval verificado
  - KB sincronizada, Guardrails activos, retrieval devuelve chunks relevantes con metadata

- [ ] 4. Implementar Agente con Strands SDK
  - [ ] 4.1 Crear estructura del proyecto backend
    - Crear directorios: `backend/agente/`, `backend/agente/herramientas/`, `backend/api/`
    - Crear `requirements.txt`: strands-agents, strands-agents-tools, boto3, fastapi, mangum, python-jose, httpx, pydantic
    - Crear `backend/agente/config.py` con settings (KB_ID, GUARDRAIL_ID, MODEL_ID, etc.)
    - Crear `backend/agente/prompts/sistema.py` con system prompt del agente jurídico
    - _Requirements: 9.3_

  - [ ] 4.2 Implementar tools del agente
    - `herramientas/buscar_sentencias.py`: @tool que hace retrieve a KB con filtros metadata
    - `herramientas/leer_sentencia.py`: @tool que lee texto completo de un chunk/sentencia
    - `herramientas/contar_resultados.py`: @tool que cuenta sin traer contenido
    - `herramientas/compilar_analisis.py`: @tool que sintetiza múltiples sentencias
    - `herramientas/comparar_sentencias.py`: @tool para análisis contrastivo
    - `herramientas/generar_borrador.py`: @tool con temperature alta para redacción
    - Cada tool con docstring claro (el LLM lo lee para decidir uso)
    - _Requirements: 1.1, 2.1, 2.3, 3.1_

  - [ ] 4.3 Crear agente principal y testear localmente
    - `backend/agente/agente_jurisprudencia.py`: instanciar Agent con model, prompt, tools
    - Configurar callback_handler para streaming
    - Test local: `python -m agente.agente_jurisprudencia` con preguntas de prueba
    - Verificar que cita sentencias reales, que respeta filtros, que no alucina
    - Verificar comportamiento multi-paso (compilar, comparar)
    - _Requirements: 1.1, 1.2, 1.3, 6.1, 6.3_

  - [ ] 4.4 Crear Dockerfile para AgentCore Runtime
    - Base: python:3.12-slim
    - Instalar dependencias, copiar código del agente
    - Exponer puerto 8080
    - Entry point que inicia el agente en modo servidor
    - _Requirements: 8.1_

  - [ ] 4.5 Deployar agente en AgentCore Runtime
    - Configurar AgentCore Runtime con el container
    - Configurar AgentCore Memory para sesiones persistentes (30 días TTL)
    - Configurar Guardrails como middleware del modelo
    - Configurar streaming habilitado
    - Verificar invocación remota del agente
    - _Requirements: 7.1, 7.4, 7.5, 8.1_

- [ ] 5. Checkpoint — Agente funcional en AgentCore
  - Agente responde con citas reales, streaming funciona, sesiones persisten, multi-paso opera

- [ ] 6. Implementar autenticación (Keycloak directo)
  - [ ] 6.1 Configurar client en Keycloak
    - Crear client `jurisprudencia-ia` en realm `internals`
    - Tipo: OpenID Connect, público (sin secret), flujo PKCE
    - Redirect URIs: `https://juris.pjm.gob.ar/*`, `http://localhost:5173/*`
    - Web origins: `https://juris.pjm.gob.ar`, `http://localhost:5173`
    - _Requirements: 4.1_

  - [ ] 6.2 Crear Lambda Authorizer custom
    - Lambda que valida JWT contra JWKS de Keycloak
    - Cachear JWKS keys en memoria (renovar cada hora)
    - Verificar firma RS256, expiración, issuer, audience
    - Retornar IAM policy allow/deny + context con sub, email, username
    - Configurar TTL de caché en API Gateway: 300 segundos
    - Test: request sin token → 401, con token válido → context correcto
    - _Requirements: 4.3, 9.3_

  - [ ] 6.3 Implementar validación JWT en AgentCore (middleware)
    - Middleware Python que valida Bearer token en requests al agente
    - Misma lógica: JWKS de Keycloak, verificar firma, extraer userId
    - Modo dev: `AUTH_MOCK_ENABLED=True` bypasea validación
    - _Requirements: 4.3_

- [ ] 7. Implementar API utilitaria (Lambda + SAM)
  - [ ] 7.1 Crear template SAM y API Gateway
    - `template.yaml` con: API Gateway REST, Lambda Authorizer, Lambdas utilitarias
    - Configurar response streaming en API Gateway (transferMode: STREAM)
    - Configurar CORS para dominios de Amplify y localhost
    - _Requirements: 4.3, 8.1_

  - [ ] 7.2 Implementar endpoints utilitarios
    - `GET /sentencia/{id}`: metadata de una sentencia (desde KB o S3 metadata file)
    - `GET /sentencia/{id}/pdf`: genera presigned URL al PDF en S3 cross-account
    - `GET /health`: health check simple
    - Logging de auditoría en cada request (userId, timestamp, operación)
    - _Requirements: 1.4, 9.3, 10.4_

  - [ ] 7.3 Deploy con SAM
    - `sam build && sam deploy --guided`
    - Verificar endpoints funcionan con token de Keycloak
    - _Requirements: 4.2_

- [ ] 8. Checkpoint — Backend completo (agente + API + auth)
  - Agente en AgentCore responde autenticado, presigned URLs funcionan, Lambda Authorizer valida

- [ ] 9. Implementar Frontend
  - [ ] 9.1 Crear proyecto React y configurar auth
    - `npm create vite@latest -- --template react-ts`
    - Instalar: TailwindCSS, react-router-dom, keycloak-js, react-markdown, react-pdf
    - Configurar `keycloak-js` con PKCE (realm internals, client jurisprudencia-ia)
    - Implementar login/logout, mostrar datos de usuario
    - Advertencia de sesión: "Si usted no es [Nombre], cierre sesión"
    - Variables de entorno: VITE_API_URL, VITE_AGENTCORE_URL, VITE_KEYCLOAK_*
    - _Requirements: 4.1, 4.2_

  - [ ] 9.2 Implementar Chat Experto con streaming
    - Componente de chat: input, historial, panel de citas
    - Hook `useStreaming` para leer response stream del agente
    - Renderizar citas como cards clickeables (link al PDF)
    - Componente `ProgresoAgente`: muestra pasos en tiempo real (🔍📖📊✅)
    - Continuación de sesión (sessionId persistente por conversación)
    - Sidebar con listado de sesiones previas
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 7.3, 8.1_

  - [ ] 9.3 Implementar Buscador Semántico
    - Barra de búsqueda + filtros desplegables (fuero, tribunal, fecha, materia, juez)
    - Panel dual: resumen en lenguaje natural + listado de sentencias
    - Cada resultado: carátula, tribunal, fecha, fuero, fragmento, link PDF
    - Estado vacío y sin resultados con mensaje apropiado
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 8.2_

  - [ ] 9.4 Implementar Generador de Borradores
    - Formulario: textarea caso + selector tipo resolución + instrucciones opcionales
    - Mostrar borrador en editor con formato markdown
    - Sentencias citadas como referencias al costado
    - Disclaimer prominente ("borrador sugerido, requiere revisión profesional")
    - Botón copiar/exportar
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.3_

  - [ ] 9.5 Implementar Visor PDF y manejo de errores
    - Visor PDF: iframe con presigned URL (o react-pdf para features avanzadas)
    - Error boundary global con mensajes en español
    - Casos: PDF no disponible, timeout, auth fallida
    - _Requirements: 1.4, 4.4, 10.4_

  - [ ] 9.6 Aplicar diseño Glassmorphism institucional
    - Tokens CSS dark/light con toggle
    - Tipografía: Lora (títulos) + DM Sans (body) + DM Mono (expedientes)
    - Glassmorphism: blur, transparencias, bordes sutiles
    - Responsive mobile-first
    - Accesibilidad WCAG 2.1 AA: contrastes, focus visible, aria-labels

  - [ ] 9.7 Desplegar en AWS Amplify
    - Conectar repo Git a Amplify Hosting
    - Configurar build (Vite, dist folder)
    - Variables de entorno en Amplify
    - Verificar flujo completo: login → chat → búsqueda → borrador → PDF

- [ ] 10. Checkpoint — Demo funcional end-to-end
  - Login via Keycloak → chat con streaming y citas → búsqueda con filtros → borrador → PDF viewer

- [ ] 11. Pipeline de ingesta y monitoreo (post-demo)
  - [ ] 11.1 Crear pipeline de ingesta semanal
    - Regla EventBridge: cron domingos 3am
    - Lambda que detecta PDFs nuevos (por fecha S3)
    - Genera .metadata.json para PDFs nuevos (datos del data lake)
    - Dispara `start-ingestion-job` de KB (sync incremental)
    - Manejo de errores: PDF fallido no afecta al resto
    - Notificación SNS al admin si hay fallos
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 11.2 Configurar monitoreo CloudWatch
    - Dashboard: latencia P95, tasa errores, invocaciones agente
    - Alarma: errores > 5% → SNS
    - Alarma: latencia P95 > 30s → SNS
    - Log groups con retención 30 días
    - Verificar logs de auditoría (userId, timestamp, operación)
    - _Requirements: 9.3, 10.3_

- [ ] 12. Checkpoint final — Sistema completo Fase 1
  - Pipeline ingesta funciona, alarmas configuradas, logs completos, demo aprobada

## Notes

- Bedrock Agents Classic NO se usa — reemplazado por Strands SDK + AgentCore Runtime
- Cognito NO se usa — autenticación directa contra Keycloak del PJM
- DynamoDB NO se usa — sesiones gestionadas por AgentCore Memory
- Pusher NO se usa — streaming via API Gateway REST (transferMode: STREAM)
- El agente ya incluye capacidades agénticas multi-paso desde Fase 1 (no es "extra")
- La cuenta AWS debe crearse antes del 30 julio 2026 si se quiere Bedrock Agents Classic como fallback
- Los archivos .metadata.json se generan con datos del data lake existente
- Región: us-east-1 (disponibilidad Claude Sonnet 5, S3 Vectors, AgentCore)
- Para la demo: se puede usar un subconjunto de sentencias ya indexadas
- Fine tuning se difiere a Fase 3 (post-demo, 6-8 semanas adicionales)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["0.1"] },
    { "id": 1, "tasks": ["0.2", "0.4"] },
    { "id": 2, "tasks": ["0.3"] },
    { "id": 3, "tasks": ["2.1"] },
    { "id": 4, "tasks": ["2.2", "2.3"] },
    { "id": 5, "tasks": ["4.1", "6.1"] },
    { "id": 6, "tasks": ["4.2", "4.3", "6.2", "6.3"] },
    { "id": 7, "tasks": ["4.4", "7.1"] },
    { "id": 8, "tasks": ["4.5", "7.2"] },
    { "id": 9, "tasks": ["7.3", "9.1"] },
    { "id": 10, "tasks": ["9.2", "9.3", "9.4"] },
    { "id": 11, "tasks": ["9.5", "9.6"] },
    { "id": 12, "tasks": ["9.7"] },
    { "id": 13, "tasks": ["11.1", "11.2"] }
  ]
}
```
