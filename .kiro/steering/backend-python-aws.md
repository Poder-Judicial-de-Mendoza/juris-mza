# Backend Python — Strands Agents + AWS Lambda + FastAPI

## Stack Tecnológico
- **Lenguaje**: Python 3.12+
- **Agente IA**: Strands Agents SDK (`strands-agents`) — open source de AWS
- **Deploy del agente**: Amazon Bedrock AgentCore Runtime (serverless, managed)
- **Endpoints utilitarios**: FastAPI + Mangum en AWS Lambda
- **API**: API Gateway REST API con response streaming habilitado
- **IA**: Amazon Bedrock (Claude Sonnet 5 + Knowledge Bases + Guardrails)
- **Vectores**: Amazon S3 Vectors
- **Memoria/Sesiones**: AgentCore Memory (managed, sin base de datos propia)
- **IaC**: AWS SAM (`template.yaml`)

## Estructura del Proyecto

```
backend/
├── agente/
│   ├── __init__.py
│   ├── agente_jurisprudencia.py  # Definición del agente Strands
│   ├── herramientas/             # Tools del agente (@tool decorators)
│   │   ├── __init__.py
│   │   ├── buscar_sentencias.py
│   │   ├── leer_sentencia.py
│   │   ├── compilar_analisis.py
│   │   ├── comparar_sentencias.py
│   │   └── contar_resultados.py
│   ├── prompts/
│   │   └── sistema.py            # System prompt del agente
│   └── config.py                 # Configuración del agente
├── api/
│   ├── __init__.py
│   ├── main.py                   # Entry point FastAPI (endpoints utilitarios)
│   ├── rutas/
│   │   ├── sentencia.py          # GET /sentencia/{id}, /sentencia/{id}/pdf
│   │   └── salud.py              # GET /health
│   ├── servicios/
│   │   ├── s3_servicio.py        # Presigned URLs, acceso cross-account
│   │   └── kb_servicio.py        # Retrieve directo a KB (buscador)
│   ├── comun/
│   │   ├── auth.py               # Validación JWT Keycloak (sin Cognito)
│   │   ├── errores.py            # Manejo de errores centralizado
│   │   └── logging.py            # Logging estructurado
│   └── config/
│       └── settings.py           # Pydantic Settings (variables de entorno)
├── tests/
├── requirements.txt
├── Dockerfile                    # Para AgentCore Runtime
├── template.yaml                 # SAM template (Lambda utilitarios)
└── samconfig.toml
```

## Agente con Strands SDK

```python
from strands import Agent
from strands.tools import tool
from agente.herramientas import (
    buscar_sentencias, leer_sentencia, compilar_analisis,
    comparar_sentencias, contar_resultados
)

agente = Agent(
    model="us.anthropic.claude-sonnet-4-20250514",
    system_prompt=PROMPT_SISTEMA,
    tools=[
        buscar_sentencias,
        leer_sentencia,
        compilar_analisis,
        comparar_sentencias,
        contar_resultados,
    ],
)
```

### Ejemplo de tool

```python
from strands.tools import tool

@tool
def buscar_sentencias(
    consulta: str = "",
    fuero: str = None,
    tribunal: str = None,
    juez: str = None,
    fecha_desde: str = None,
    fecha_hasta: str = None,
    materia: str = None,
    limite: int = 20
) -> dict:
    """Busca sentencias en la base de jurisprudencia con filtros por metadata
    y/o búsqueda semántica. Usar para encontrar sentencias relevantes."""
    # Retrieve contra Bedrock KB con filtros de metadata
    ...
```

## Deploy del Agente

El agente se despliega en **AgentCore Runtime** como container:
- Se construye un Dockerfile con el código del agente + dependencias
- AgentCore maneja: scaling, session isolation, memory, streaming
- El frontend invoca al agente via el endpoint de AgentCore (con auth)

Los endpoints utilitarios (presigned URLs, health) se despliegan como **Lambda + API Gateway** con SAM.

## Autenticación (Keycloak directo, sin Cognito)
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
- **Agente (Strands)**: El SDK invoca Claude internamente — no se usa `invoke_agent` de Agents Classic
- **Knowledge Base**: El tool `buscar_sentencias` usa `retrieve` vía boto3 con filtrado por metadata
- **Modelo directo**: Para borradores, se puede invocar Claude con temperature=0.7 como tool del agente
- **Reintentos**: Backoff exponencial, max 3 intentos ante ThrottlingException o ServiceException

## Variables de Entorno

```env
# AWS
AWS_REGION=us-east-1
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

# Strands / AgentCore
AGENTCORE_ENDPOINT=xxx
MODEL_ID=us.anthropic.claude-sonnet-4-20250514
```

## Logging y Auditoría
- Registrar en cada request: `usuario_id`, `timestamp`, `tipo_operacion`, `duracion_ms`
- Usar logging estructurado (JSON) compatible con CloudWatch
- No loguear contenido de respuestas del modelo (pueden contener datos de sentencias)
- AgentCore provee tracing nativo integrado con CloudWatch

## Convenciones
- Variables, funciones y clases en **español**
- Docstrings en español
- Tipos estrictos con Pydantic v2
- Async/await para todas las operaciones I/O
- Tools del agente documentados con docstrings claros (el LLM los lee para decidir cuándo usarlos)
