# Pedido para Alejandro Posca — Client en Keycloak

Alejandro, necesito que me crees un client en Keycloak para el proyecto de Jurisprudencia con IA. Es una app web interna (React) que se autentica contra el realm `internals`.

---

## Datos del client

| Campo | Valor |
|---|---|
| **Realm** | `internals` |
| **Client ID** | `jurisprudencia-ia` |
| **Client Protocol** | openid-connect |
| **Access Type** | public (sin secret) |
| **Standard Flow Enabled** | ON |
| **Direct Access Grants** | OFF |
| **PKCE** | S256 (requerido) |

## URLs

| Campo | Valor |
|---|---|
| **Valid Redirect URIs** | `http://localhost:5173/*` , `https://juris.pjm.gob.ar/*` |
| **Web Origins** | `http://localhost:5173` , `https://juris.pjm.gob.ar` |
| **Post Logout Redirect URIs** | `http://localhost:5173/*` , `https://juris.pjm.gob.ar/*` |

> El `localhost:5173` es para desarrollo local. Cuando tengamos dominio definitivo te aviso si cambia.

---

## Usuarios

Por ahora no necesito crear usuarios nuevos. Los usuarios que ya están en el realm `internals` van a poder acceder. Más adelante te paso una lista específica si necesitamos restringir.

---

## Eso es todo

No necesito roles custom ni mappers especiales por ahora. El flujo es simple: el usuario se loguea, yo valido el JWT en el backend, y todos los autenticados tienen el mismo nivel de acceso.

Si necesitás algo más de contexto, preguntame.
