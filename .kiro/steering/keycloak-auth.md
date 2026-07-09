---
inclusion: manual
---
# Keycloak — Autenticación Directa (sin Cognito)

## Infraestructura de Keycloak del PJM
- **URL**: `https://auth24.pjm.gob.ar/auth/`
- **Realm**: `internals` (mismo que Notifica y otros sistemas internos)
- **No usar** realm `externals` (ese es para ciudadanos)

## Client para Jurisprudencia IA

Crear un client nuevo en el realm `internals`:

| Campo | Valor |
|---|---|
| **Client type** | OpenID Connect |
| **Client ID** | `jurisprudencia-ia` |
| **Name** | Sistema de Jurisprudencia Inteligente |
| **Client authentication** | OFF (client público — usa PKCE) |
| **Authentication flow** | Standard flow (Authorization Code + PKCE) |
| **Valid redirect URIs** | `https://juris.pjm.gob.ar/*`, `http://localhost:5173/*` |
| **Valid post logout redirect URIs** | `https://juris.pjm.gob.ar/*`, `http://localhost:5173/*` |
| **Web origins** | `https://juris.pjm.gob.ar`, `http://localhost:5173` |

## Flujo de Autenticación (directo, sin Cognito)

```
Usuario → Frontend React (keycloak-js) → Keycloak (realm internals) → Login → JWT → API Gateway → Lambda valida JWT
```

1. El frontend inicia `keycloak.init({ onLoad: 'login-required' })`
2. El usuario se autentica en Keycloak con sus credenciales habituales del PJM
3. Keycloak devuelve access_token al frontend
4. El frontend adjunta `Authorization: Bearer {token}` en cada request
5. Lambda valida el JWT contra el JWKS endpoint de Keycloak

## Configuración del Frontend (keycloak-js)

```typescript
import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,      // https://auth24.pjm.gob.ar/auth/
  realm: import.meta.env.VITE_KEYCLOAK_REALM,  // internals
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID  // jurisprudencia-ia
})

await keycloak.init({
  onLoad: 'login-required',
  pkceMethod: 'S256',
  checkLoginIframe: false
})

// Token para requests
const token = keycloak.token

// Datos del usuario
const nombre = keycloak.tokenParsed?.name
const email = keycloak.tokenParsed?.email
const username = keycloak.tokenParsed?.preferred_username
```

## Validación JWT en el Backend (Lambda Python)

```python
from jose import jwt, JWTError
import httpx

KEYCLOAK_JWKS_URL = "https://auth24.pjm.gob.ar/auth/realms/internals/protocol/openid-connect/certs"
KEYCLOAK_ISSUER = "https://auth24.pjm.gob.ar/auth/realms/internals"

# Cachear las keys (renovar cada hora)
_jwks_cache = None

async def obtener_jwks():
    global _jwks_cache
    if not _jwks_cache:
        async with httpx.AsyncClient() as client:
            resp = await client.get(KEYCLOAK_JWKS_URL)
            _jwks_cache = resp.json()
    return _jwks_cache

async def validar_token(token: str) -> dict:
    jwks = await obtener_jwks()
    try:
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            audience="account",  # o el audience configurado
            issuer=KEYCLOAK_ISSUER
        )
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Token inválido")
```

## Claims disponibles en el JWT de Keycloak

- `sub`: UUID del usuario en Keycloak
- `email`: Email del usuario
- `name`: Nombre completo
- `preferred_username`: Username (puede ser CUIL)
- `realm_access.roles`: Roles del realm
- `azp`: Client ID que solicitó el token

## API Gateway — Authorizer sin Cognito

Sin Cognito no podés usar el JWT authorizer nativo de API Gateway. Dos opciones:

**Opción A (recomendada)**: Validar JWT en cada Lambda handler (con decorator/middleware)
- Más simple, sin configuración extra en API Gateway
- Patrón: decorator `@requiere_auth` en cada endpoint

**Opción B**: Lambda authorizer custom en API Gateway
- Se ejecuta antes del handler
- Cachea resultado por token (reduce llamadas)
- Más complejo de configurar pero centraliza la validación

## Refresh de token

```typescript
// Auto-refresh antes de que expire
keycloak.onTokenExpired = () => {
  keycloak.updateToken(30).catch(() => {
    keycloak.login() // Si no puede renovar, forzar login
  })
}
```

## Seguridad
- Tokens duran 5 minutos (configuración del realm `internals`)
- Refresh tokens duran 30 minutos
- El frontend debe renovar el token antes de que expire
- El backend SIEMPRE valida el JWT (excepto con `AUTH_MOCK_ENABLED=True`)
