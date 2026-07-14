# Pedido para Susana — Cuenta AWS + Accesos

Susana, necesito que me prepares una cuenta AWS y algunos accesos para el proyecto de Jurisprudencia con IA. Son 4 cosas puntuales.

---

## 1. Crear la cuenta AWS

Crear una cuenta nueva en la organización:
- **Nombre**: `jurisprudencia-ia`
- **Email**: el que corresponda según la convención de la org
- **Región principal**: us-east-1

---

## 2. Crear el usuario IAM `kiro`

Dentro de la cuenta `jurisprudencia-ia`, crear un usuario con acceso programático (access key + secret key). Es el usuario que voy a usar desde mi máquina para desplegar toda la infraestructura.

```bash
# Ejecutar con credenciales de admin de la cuenta jurisprudencia-ia

aws iam create-user --user-name kiro

aws iam create-access-key --user-name kiro
# ↑ Esto devuelve AccessKeyId y SecretAccessKey — mandámelos por canal seguro
```

### Permisos del usuario kiro

Necesito que pueda crear y administrar los servicios del proyecto. La forma más simple es:

```bash
aws iam attach-user-policy \
  --user-name kiro \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

> **Si AdministratorAccess no es posible por política de la org**, la alternativa es crear una policy custom. Dejé los permisos detallados abajo por si los necesitás:

```bash
aws iam create-policy \
  --policy-name kiro-jurisprudencia-deploy \
  --policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Bedrock",
      "Effect": "Allow",
      "Action": "bedrock:*",
      "Resource": "*"
    },
    {
      "Sid": "S3Propio",
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "*"
    },
    {
      "Sid": "Lambda",
      "Effect": "Allow",
      "Action": "lambda:*",
      "Resource": "*"
    },
    {
      "Sid": "APIGateway",
      "Effect": "Allow",
      "Action": "apigateway:*",
      "Resource": "*"
    },
    {
      "Sid": "Amplify",
      "Effect": "Allow",
      "Action": "amplify:*",
      "Resource": "*"
    },
    {
      "Sid": "IAMRoles",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:GetRole",
        "iam:PassRole",
        "iam:CreatePolicy",
        "iam:DeletePolicy",
        "iam:GetPolicy",
        "iam:ListPolicies",
        "iam:CreateInstanceProfile",
        "iam:TagRole",
        "iam:TagPolicy"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatch",
      "Effect": "Allow",
      "Action": [
        "logs:*",
        "cloudwatch:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "EventBridge",
      "Effect": "Allow",
      "Action": "events:*",
      "Resource": "*"
    },
    {
      "Sid": "CloudFormationSAM",
      "Effect": "Allow",
      "Action": "cloudformation:*",
      "Resource": "*"
    }
  ]
}'

# Anotar el ARN de la policy que devuelve el comando anterior, luego:
aws iam attach-user-policy \
  --user-name kiro \
  --policy-arn arn:aws:iam::CUENTA_JURISPRUDENCIA_IA:policy/kiro-jurisprudencia-deploy
```

---

## 3. Darme acceso de lectura al bucket S3 de sentencias

Los PDFs de las sentencias están en un bucket del data lake (otra cuenta). Necesito que la cuenta `jurisprudencia-ia` pueda leerlos.

**Agregar esto a la bucket policy del bucket de sentencias** (en la cuenta del data lake):

```bash
# Ejecutar en la cuenta del data lake (donde está el bucket de sentencias)
# Reemplazar BUCKET_SENTENCIAS y CUENTA_JURISPRUDENCIA_IA con los valores reales

aws s3api put-bucket-policy \
  --bucket BUCKET_SENTENCIAS \
  --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AccesoLecturaJurisprudenciaIA",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::CUENTA_JURISPRUDENCIA_IA:root"
      },
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::BUCKET_SENTENCIAS",
        "arn:aws:s3:::BUCKET_SENTENCIAS/*"
      ]
    }
  ]
}'
```

> **Importante**: Si el bucket ya tiene una policy, no reemplazarla sino agregar este Statement al array existente. Para ver la policy actual: `aws s3api get-bucket-policy --bucket BUCKET_SENTENCIAS`

---

## 4. Metadata de las sentencias (probablemente Athena)

Necesito acceso de lectura a la metadata de las sentencias. Los campos que uso son:

- **fuero** (civil, laboral, penal, etc.)
- **tribunal** (nombre de la cámara/juzgado)
- **materia** (tema jurídico)
- **fecha de sentencia**
- **carátula** (nombre del caso)
- **número de expediente**
- **jueces firmantes**
- **nombre del archivo PDF en S3** (para asociar cada registro con su PDF)

### Si está en Athena (lo más probable)

Necesito:

1. **Nombre de la base de datos y tabla** donde está la metadata
2. **Acceso de lectura desde la cuenta `jurisprudencia-ia`**:

```bash
# En la cuenta del data lake, dar acceso cross-account a Athena + Glue Catalog

# Opción A: Compartir el catálogo con AWS RAM (Resource Access Manager)
# Opción B: Exportar un CSV/JSON con toda la metadata (más simple para arrancar)
```

### La opción más rápida para arrancar

Si configurar cross-account a Athena es complejo, alcanza con que me generes un export:

```sql
-- Ejecutar en Athena y pasarme el resultado como CSV
SELECT 
  fuero,
  tribunal, 
  materia,
  fecha_sentencia,
  caratula,
  expediente,
  jueces,
  archivo_s3
FROM TABLA_METADATA_SENTENCIAS;
```

Guardalo en S3 o mandámelo como archivo. Con eso arranco y después vemos el acceso en vivo para las actualizaciones semanales.

### Si no sabés dónde está la metadata

Preguntale a Kiro (tu asistente de código): *"Tengo un data lake en AWS con PDFs de sentencias judiciales en S3. La metadata (fuero, tribunal, fecha, juez, carátula, expediente, materia) debe estar en algún servicio. ¿Cómo puedo buscarla? Los servicios candidatos son Glue Data Catalog, Athena, RDS, DynamoDB o Redshift."* — Kiro te guía paso a paso.

---

## Resumen

| # | Qué | Tiempo estimado |
|---|---|---|
| 1 | Crear cuenta `jurisprudencia-ia` | 5 min |
| 2 | Crear usuario `kiro` + darle permisos | 5 min |
| 3 | Bucket policy para lectura de PDFs | 10 min |
| 4 | Pasarme metadata (CSV) o darme acceso a Athena | 15-30 min |

Una vez que me pases las credenciales del usuario `kiro` y la metadata, yo me encargo del resto.

---

*Si tenés dudas con algún paso, preguntale a Kiro mostrándole este documento.*
