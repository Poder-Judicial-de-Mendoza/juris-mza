# Backend Python — AWS Lambda + FastAPI

## Stack Tecnológico
- **Lenguaje**: Python 3.12+
- **Framework**: FastAPI (para desarrollo local y testing) desplegado en AWS Lambda
- **Runtime AWS**: Lambda con API Gateway HTTP API
- **IA**: Amazon Bedrock (Claude Sonnet 5 + Knowledge Bases + AgentCore)
- **Vectores**: Amazon S3 Vectors
- **Sesiones**: AgentCore Harness (managed, sin base de datos propia)

## Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Entry point FastAPI
│   ├── rutas/               # Endpoints por área funcional
│   │   ├── chat.py
│   │   ├── buscar.py
│   │   ├── borrador.py
│   │   └── sentencia.py
│   ├── servicios/           # Lógica de negocio
│   │   ├── bedrock_servicio.py
│   │   ├── s3_servicio.py
│   │   └── kb_servicio.py
│   ├── esquemas/            # Pydantic models (request/response)
│   │   ├── chat_esquemas.py
│   │   ├── busqueda_esquemas.py
│   │   └── borrador_esquemas.py
│   ├── comun/               # Utilidades compartidas
│   │   ├── auth.py          # Validación JWT Cognito/Keycloak
│   │   ├── errores.py       # Manejo de errores centralizado
│   │   └── logging.py       # Logging estructurado
│   └── config/
│       └── settings.py      # Pydantic Settings (variables de entorno)
├── tests/
├── requirements.txt
├── Dockerfile               # Para desarrollo local
└── template.yaml            # SAM template (infra as code)
```

## Autenticación
- **JWT**: Validar tokens emitidos directamente por Keycloak (realm `internals`)
- **Validación**: Verificar firma contra JWKS endpoint de Keycloak, expiración, issuer y audience
- **JWKS URL**: `https://auth24.pjm.gob.ar/auth/realms/internals/protocol/openid-connect/certs`
- **Extracción de usuario**: Obtener `sub`, `email`, `preferred_username` del token
- **Modo desarrollo**: Variable `AUTH_MOCK_ENABLED=True` para desarrollo local sin Keycloak
- **Librería**: `python-jose[cryptography]` + `httpx` para obtener JWKS (cachear keys)

## Keycloak — Configuración para este proyecto
- **Realm**: `internals` (mismo que usa Notifica y otros sistemas del PJM)
- **URL Keycloak**: `https://auth24.pjm.gob.ar/auth/`
- **Client ID**: `jurisprudencia-ia` (client público, sin secret)
- **Flujo**: Authorization Code + PKCE (el frontend usa `keycloak-js`)
- **Sin Cognito** — el backend valida JWT de Keycloak directamente
- **No crear en realm `externals`** (ese es para ciudadanos)

## Comunicación con Bedrock
- **Agente**: Usar `invoke_agent` / `invoke_agent_with_response_stream` para chat
- **Knowledge Base**: Usar `retrieve` para búsquedas directas con filtrado por metadata
- **Modelo directo**: Usar `invoke_model` para generación de borradores (temperature 0.7)
- **Reintentos**: Backoff exponencial, max 3 intentos ante ThrottlingException o ServiceException

## Variables de Entorno

```env
# AWS
AWS_REGION=us-east-1
BEDROCK_AGENT_ID=xxx
BEDROCK_AGENT_ALIAS_ID=xxx
BEDROCK_KB_ID=xxx
GUARDRAIL_ID=xxx
GUARDRAIL_VERSION=1

# S3 — Bucket de sentencias (cross-account, solo lectura)
S3_BUCKET_SENTENCIAS=nombre-del-bucket-data-lake

# Autenticación Keycloak (directa, sin Cognito)
KEYCLOAK_SERVER_URL=https://auth24.pjm.gob.ar/auth/
KEYCLOAK_REALM=internals
KEYCLOAK_CLIENT_ID=jurisprudencia-ia
AUTH_MOCK_ENABLED=False

# CORS
CORS_ORIGINS=https://juris.pjm.gob.ar,http://localhost:5173
```

## Logging y Auditoría
- Registrar en cada request: `usuario_id`, `timestamp`, `tipo_operacion`, `duracion_ms`
- Usar logging estructurado (JSON) compatible con CloudWatch
- No loguear contenido de respuestas del modelo (pueden contener datos de sentencias)

## Convenciones
- Variables, funciones y clases en **español**
- Docstrings en español
- Tipos estrictos con Pydantic v2
- Async/await para todas las operaciones I/O
