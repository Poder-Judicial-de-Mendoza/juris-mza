# Strands Agents SDK + AgentCore — Guía del Proyecto

## Contexto Tecnológico

**Strands Agents SDK** es el framework open source de AWS para construir agentes de IA.
**AgentCore** es la plataforma managed de AWS para desplegar y operar agentes en producción.

Juntos reemplazan a "Bedrock Agents Classic" (deprecated julio 2026).

## Por qué Strands + AgentCore

| Aspecto | Bedrock Agents Classic (viejo) | Strands + AgentCore (nuevo) |
|---|---|---|
| Definición del agente | Consola AWS / API calls | Código Python con decoradores |
| Tools | Action Groups (OpenAPI spec) | Funciones Python con `@tool` |
| Testing local | Imposible sin deploy | `python agente.py` directamente |
| Sesiones | Managed opaco | AgentCore Memory (configurable) |
| Streaming | `InvokeAgentWithResponseStream` | Nativo en Strands + AgentCore |
| Framework lock-in | 100% AWS | Open source, agnóstico de proveedor |
| Deploy | Solo Bedrock | AgentCore Runtime (container managed) |

## Arquitectura del Agente

```
┌─────────────────────────────────────────────────┐
│           AgentCore Runtime (managed)            │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │         Strands Agent (Python)            │  │
│  │                                           │  │
│  │  Model: Claude Sonnet 5 (via Bedrock)     │  │
│  │  Memory: AgentCore Memory (KB-backed)     │  │
│  │  Tools:                                   │  │
│  │    - buscar_sentencias (KB retrieve)      │  │
│  │    - leer_sentencia (S3 + KB)             │  │
│  │    - compilar_analisis (multi-doc)        │  │
│  │    - comparar_sentencias (contrastivo)    │  │
│  │    - contar_resultados (stats)            │  │
│  │    - generar_borrador (temp alta)         │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Session Isolation │ Auto-scaling │ Streaming    │
└─────────────────────────────────────────────────┘
```

## Instalación

```bash
pip install strands-agents strands-agents-tools
```

## Patrones de Uso

### Definir un tool

```python
from strands.tools import tool

@tool
def buscar_sentencias(
    consulta: str = "",
    fuero: str = None,
    juez: str = None,
    fecha_desde: str = None,
    fecha_hasta: str = None,
    limite: int = 20
) -> dict:
    """Busca sentencias en la Knowledge Base aplicando búsqueda semántica
    y/o filtros por metadata (fuero, juez, fecha, tribunal, materia).

    Usar cuando el usuario pide encontrar jurisprudencia sobre un tema,
    o cuando necesitás sentencias para un análisis posterior.
    """
    import boto3
    cliente_kb = boto3.client('bedrock-agent-runtime')

    filtros = _construir_filtros(fuero=fuero, juez=juez,
                                 fecha_desde=fecha_desde, fecha_hasta=fecha_hasta)

    respuesta = cliente_kb.retrieve(
        knowledgeBaseId=KB_ID,
        retrievalQuery={'text': consulta},
        retrievalConfiguration={
            'vectorSearchConfiguration': {
                'numberOfResults': limite,
                'filter': filtros if filtros else None
            }
        }
    )

    return _formatear_resultados(respuesta)
```

### Crear el agente

```python
from strands import Agent

agente_jurisprudencia = Agent(
    model="us.anthropic.claude-sonnet-4-20250514",
    system_prompt=PROMPT_SISTEMA,
    tools=[buscar_sentencias, leer_sentencia, compilar_analisis,
           comparar_sentencias, contar_resultados, generar_borrador],
)

# Invocar localmente (para testing)
respuesta = agente_jurisprudencia(
    "¿Qué dice la jurisprudencia sobre despido por enfermedad profesional?"
)
print(respuesta)
```

### Streaming de respuestas

```python
# Strands soporta streaming nativo con callbacks
from strands import Agent

agente = Agent(
    model="us.anthropic.claude-sonnet-4-20250514",
    system_prompt=PROMPT_SISTEMA,
    tools=[...],
    callback_handler=mi_callback_streaming,  # Recibe tokens incrementales
)
```

### Memory (sesiones persistentes)

```python
from strands.agent.agent import Agent
from strands_tools import mem0_memory  # O AgentCore memory

# AgentCore Memory se configura al deployar en Runtime
# Localmente se puede usar un store en memoria o archivo
```

## Deploy en AgentCore Runtime

```dockerfile
# Dockerfile para AgentCore Runtime
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY agente/ ./agente/
COPY api/ ./api/

EXPOSE 8080
CMD ["python", "-m", "agente.agente_jurisprudencia"]
```

AgentCore Runtime maneja:
- **Scaling**: Escala automáticamente según demanda
- **Session isolation**: Cada sesión de usuario corre aislada
- **Memory**: Persistencia de contexto conversacional
- **Streaming**: Respuestas token a token nativas
- **Observability**: Traces y métricas en CloudWatch

## Integración con Bedrock Knowledge Bases

Strands se conecta a KB de dos formas:
1. **Como tool** (recomendado para nuestro caso): El tool `buscar_sentencias` hace `retrieve` directamente
2. **Como memory store**: KB actúa como long-term memory del agente (para contexto general)

Para este proyecto usamos **ambas**:
- Tool para búsquedas explícitas con filtros
- Memory para que el agente tenga contexto de conversaciones anteriores

## Guardrails

Bedrock Guardrails se aplican como wrapper sobre las invocaciones al modelo:

```python
from strands import Agent

agente = Agent(
    model="us.anthropic.claude-sonnet-4-20250514",
    system_prompt=PROMPT_SISTEMA,
    tools=[...],
    # Guardrails se configuran a nivel de modelo en AgentCore
)
```

Configurar en AgentCore:
- Contextual Grounding: threshold 0.7 (bloquea respuestas no fundamentadas)
- Topic filter: solo temas jurídicos

## Testing Local

```bash
# Correr el agente localmente (sin deploy)
cd backend
python -m agente.agente_jurisprudencia

# O con pytest
pytest tests/ -v
```

Strands permite testing completo sin desplegar nada a AWS. Solo necesitás credenciales para invocar Bedrock (el modelo) y la KB.

## Recursos

- Documentación: https://strandsagents.com/
- GitHub: https://github.com/strands-agents/sdk-python
- Ejemplos AWS: https://github.com/aws-samples/sample-amazon-bedrock-for-beginners
- AgentCore docs: https://docs.aws.amazon.com/bedrock-agentcore/
