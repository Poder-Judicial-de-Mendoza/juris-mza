# Lo que hago yo (Mauricio) una vez tenga los accesos

---

## Prerequisitos

- [ ] Credenciales del usuario `kiro` (AccessKeyId + SecretAccessKey) — de Susana
- [ ] Nombre del bucket S3 con las sentencias — de Susana
- [ ] CSV/JSON con metadata de sentencias (o acceso a Athena) — de Susana
- [ ] Client `jurisprudencia-ia` creado en Keycloak — de Posca

---

## Paso 1: Configurar AWS CLI

```bash
aws configure --profile jurisprudencia
# AWS Access Key ID: [la que me dé Susana]
# AWS Secret Access Key: [la que me dé Susana]
# Default region: us-east-1
# Default output: json
```

Verificar que funciona:

```bash
aws sts get-caller-identity --profile jurisprudencia
```

---

## Paso 2: Verificar acceso al bucket de sentencias

```bash
# Listar algunos PDFs para confirmar cross-account
aws s3 ls s3://BUCKET_SENTENCIAS/ --profile jurisprudencia --max-items 10

# Descargar uno de prueba
aws s3 cp s3://BUCKET_SENTENCIAS/alguna-sentencia.pdf /tmp/test.pdf --profile jurisprudencia
```

---

## Paso 3: Habilitar modelos en Bedrock

Desde la consola de AWS (cuenta `jurisprudencia-ia`), ir a Bedrock > Model access y habilitar:

- **Anthropic Claude Sonnet 4** (o el que esté disponible como Sonnet 5)
- **Amazon Titan Text Embeddings V2**

> Esto no se puede hacer por CLI, hay que ir a la consola.

---

## Paso 4: Crear la Knowledge Base

```bash
# Crear bucket para los vectores (S3 Vectors)
aws s3 mb s3://jurisprudencia-ia-vectores --region us-east-1 --profile jurisprudencia
```

La KB se crea desde la consola de Bedrock o con boto3 (hay mucho config). El flujo:

1. Ir a Bedrock > Knowledge Bases > Create
2. Data source: apuntar al bucket de sentencias (cross-account)
3. Embedding model: Amazon Titan Embeddings V2
4. Vector store: S3 Vectors
5. Chunking: Hierarchical (parent 1500, child 300, overlap 60)
6. Metadata: METADATA_FILE format

---

## Paso 5: Generar archivos .metadata.json

Con el CSV que me dé Susana, generar un `.metadata.json` por cada PDF:

```python
# Script que escribo yo — transforma CSV a archivos .metadata.json
# y los sube al bucket de sentencias junto a cada PDF
```

---

## Paso 6: Sync inicial de la KB

```bash
# Desde boto3 o consola: iniciar sincronización
# Indexa los ~27,000 PDFs con sus embeddings y metadata
# Tarda varias horas la primera vez
```

---

## Paso 7: Scaffold del proyecto

```bash
# Backend
mkdir -p backend/agente/herramientas backend/agente/prompts backend/api
pip install strands-agents strands-agents-tools boto3 fastapi mangum

# Frontend
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install keycloak-js react-router-dom tailwindcss
```

---

## Paso 8: Testing local del agente

```bash
cd backend
export AWS_PROFILE=jurisprudencia
python -m agente.agente_jurisprudencia
# Probar consultas directas sin deploy
```

---

## Paso 9: Deploy

```bash
# Backend (Lambda utilitarios)
cd backend
sam build && sam deploy --guided --profile jurisprudencia

# Frontend
cd frontend
# Crear app en Amplify y conectar al repo
```

---

## DNS (lo hago yo cuando esté listo para prod)

Configurar `juris.pjm.gob.ar` como CNAME al dominio de Amplify. Eso lo manejo yo directamente, no depende de Susana ni de Posca.
