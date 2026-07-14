# Feedback de Usuarios — Mensajes y Pedidos

Registro de pedidos, sugerencias y necesidades expresadas por usuarios (WhatsApp, email, conversaciones).
Cada entrada puede convertirse en una historia de usuario futura.

---

## Formato sugerido

### [Fecha] — [Nombre/Rol del usuario]
**Canal**: WhatsApp / Email / Reunión
**Pedido textual**:
> (pegar el mensaje tal cual)

**Interpretación / Posible historia de usuario**:
Como [rol], quiero [funcionalidad] para [beneficio].

**Prioridad estimada**: Alta / Media / Baja
**Estado**: Pendiente / En spec / Implementado

---

## 2026-07-13 — Olga Castillejo (Jefa de Relatores de la Corte, área Laboral)
**Canal**: WhatsApp
**Pedido textual**:
> Necesitamos que la IA como agente nos informe todos los viernes las sentencias laborales dictadas esa semana en la SCJM. Debe hacer una breve síntesis de cada una (sumario). Indicando los ministros que firmaron (unanimidad o disidencia). Solo las publicadas en lista esa semana.

**Interpretación / Posible historia de usuario**:
Como relatora de la Corte (área laboral), quiero recibir todos los viernes un resumen automático de las sentencias laborales dictadas esa semana por la SCJM, con sumario, ministros firmantes y si hubo unanimidad o disidencia, para tener un panorama semanal sin revisar manualmente cada expediente.

**Notas técnicas**:
- Implica un job programado (cron semanal, viernes)
- Filtro: fuero=laboral, tribunal=SCJM, fecha=semana en curso, estado=publicada en lista
- Output: sumario breve + composición del tribunal + tipo de decisión (unanimidad/disidencia)
- Canal de entrega: ¿email? ¿notificación en la app? (confirmar con Olga)

**Prioridad estimada**: Alta (pedido de jefatura de relatores)
**Estado**: Pendiente

---

<!-- Agregar nuevas entradas abajo -->

