# Frontend React — Vite + TailwindCSS + AWS Amplify

## Stack Tecnológico
- **Framework**: React 18+ con Vite (TypeScript)
- **Estilos**: Tailwind CSS
- **Routing**: react-router-dom v6+
- **Despliegue**: AWS Amplify Hosting (SPA estática)
- **Auth**: `keycloak-js` directo (sin Cognito)
- **PDF**: react-pdf o iframe con presigned URL

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── rutas/                # Páginas principales
│   │   ├── Chat.tsx          # Chat experto en jurisprudencia
│   │   ├── Buscar.tsx        # Buscador semántico
│   │   ├── Borrador.tsx      # Generador de borradores
│   │   └── VisorPdf.tsx      # Visor de sentencias PDF
│   ├── componentes/          # Componentes reutilizables
│   │   ├── MensajeChat.tsx
│   │   ├── TarjetaSentencia.tsx
│   │   ├── FiltrosBusqueda.tsx
│   │   ├── EditorBorrador.tsx
│   │   └── Layout.tsx
│   ├── servicios/            # Comunicación con API
│   │   ├── api.ts            # Fetch wrapper con auth
│   │   └── auth.ts           # Configuración Amplify/Cognito
│   ├── hooks/                # Custom hooks
│   │   ├── useChat.ts
│   │   └── useAuth.ts
│   └── tipos/                # TypeScript interfaces
│       └── index.ts
├── public/
│   └── logo.png              # Logo institucional PJM
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── package.json
└── .env.example
```

## Autenticación
- **Control de Acceso**: Keycloak directo (realm `internals`) usando `keycloak-js`
- **Flujo**: PKCE (Authorization Code + PKCE) — client público sin secret
- **Librería**: `keycloak-js` (misma que Notifica)
- **Sin Cognito** — el frontend se autentica directamente contra Keycloak
- **Sesión**: Mostrar datos del usuario conectado (Nombre, Apellido, Email)
- **Advertencia de sesión**: "Si usted no es [Nombre], cierre la sesión e informe a su superior"
- **Logout**: `keycloak.logout()` redirige al endpoint de logout de Keycloak
- **Token**: Se adjunta como `Authorization: Bearer {token}` en cada request a la API

## Estética Institucional: Glassmorphism Judicial

Diseño profesional, sobrio y que inspire confianza institucional.

### Sistema de Temas (Tokens CSS)
- **Oscuro (Dark - Predeterminado)**:
  - `--bg`: `#0d1520`
  - `--glass`: `rgba(255, 255, 255, 0.06)`
  - `--glass-bd`: `rgba(255, 255, 255, 0.09)`
  - `--t1`: `rgba(255, 255, 255, 0.90)` (Texto primario)
  - `--t2`: `rgba(255, 255, 255, 0.58)` (Texto secundario)
  - `--btn`: `#3b6fd4` (Acción principal)
- **Claro (Light)**:
  - `--bg`: `#eef2fa`
  - `--glass`: `rgba(255, 255, 255, 0.78)`
  - `--t1`: `#1a2b4a`
  - `--t2`: `#4a5878`
  - `--btn`: `#3b6fd4`
- **Persistencia**: Tema guardado en `localStorage`

### Tipografía
- **Lora**: Títulos institucionales y números destacados
- **DM Sans**: Fuente principal de la UI
- **DM Mono**: Metadatos, IDs, expedientes

### Efectos
- `backdrop-filter: blur(18px)`, `border-radius: 10px`
- Responsivo (Mobile First), estética premium tipo iOS/Apple

## Accesibilidad (WCAG 2.1 AA)
- Contrastes altos, compatibilidad con lectores de pantalla
- Tipografía legible, áreas de clic amplias (especialmente para tablets en juzgados)
- Aria-labels en elementos interactivos
- Focus visible en navegación con teclado

## Streaming de Respuestas
- Usar `fetch` con `ReadableStream` para leer respuestas token a token
- Mostrar respuesta del chat mientras se genera (efecto typing)
- No usar WebSockets — streaming via HTTP response body es suficiente

## Variables de Entorno

```env
VITE_API_URL=https://xxx.execute-api.us-east-1.amazonaws.com
VITE_KEYCLOAK_URL=https://auth24.pjm.gob.ar/auth/
VITE_KEYCLOAK_REALM=internals
VITE_KEYCLOAK_CLIENT_ID=jurisprudencia-ia
```

## Convenciones
- Nombres de componentes, variables, props y funciones en **español**
- Comentarios en español
- Archivos `.tsx` para componentes, `.ts` para lógica pura
