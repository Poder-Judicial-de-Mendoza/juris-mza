---
inclusion: manual
---
# Pusher — Notificaciones en Tiempo Real (futuro)

## Estado: NO incluido en Fase 1

Esta guía documenta cómo integrar Pusher para notificaciones push en tiempo real cuando se necesite en versiones futuras. En la Fase 1, el streaming de respuestas se hace via HTTP response body (fetch + ReadableStream).

## Casos de uso futuros
- Notificar cuando una nueva sentencia es indexada
- Notificar cuando un borrador solicitado está listo (si se procesa async)
- Sincronizar sesiones de chat entre dispositivos del mismo usuario

## Configuración

### Backend (Python)

```bash
pip install pusher
```

```python
import pusher

cliente_pusher = pusher.Pusher(
    app_id="APP_ID",
    key="KEY",
    secret="SECRET",
    cluster="CLUSTER",
    ssl=True
)

# Enviar evento
cliente_pusher.trigger("canal-usuario-{cuil}", "nueva-sentencia", {
    "mensaje": "Se indexó una nueva sentencia en fuero laboral",
    "sentencia_id": "xxx"
})
```

### Frontend (React)

```bash
npm install pusher-js
```

```tsx
import Pusher from 'pusher-js'

const pusher = new Pusher('KEY', { cluster: 'CLUSTER' })
const canal = pusher.subscribe(`canal-usuario-${cuil}`)

canal.bind('nueva-sentencia', (datos) => {
  // Mostrar notificación toast
})
```

### Variables de Entorno

```env
# Backend
PUSHER_APP_ID=xxx
PUSHER_KEY=xxx
PUSHER_SECRET=xxx
PUSHER_CLUSTER=us2

# Frontend
VITE_PUSHER_KEY=xxx
VITE_PUSHER_CLUSTER=us2
```

## Alternativa AWS nativa (evaluar)
- **AWS AppSync** con subscriptions GraphQL (WebSockets managed)
- **API Gateway WebSocket API** + Lambda
- Ambas evitan dependencia externa pero agregan complejidad

## Nota
En la versión actual el streaming del chat se resuelve con HTTP streaming (response body chunked). Pusher se evaluará cuando haya un caso de uso que justifique notificaciones push fuera del contexto de una request HTTP activa.
