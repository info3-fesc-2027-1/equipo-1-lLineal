# Plan de despliegue del incremento

**Informática III · Grupo 1301 · Ciclo 2027-1**
**Tema:** 3.5 Fase de Despliegue
**Entrega:** domingo 8 de noviembre de 2026, 22:00, con el enlace al commit en Classroom

| Dato | Respuesta |
|---|---|
| Equipo (número) | Equipo 1 (Code Warriors) |
| Modelo asignado | Modelo Lineal |
| Integrantes | Eduardo Domínguez Julián, Axel Morales Villalón, Abraham Rivas Serrano |
| Contexto de negocio de nuestro sistema | Taller Morales, un taller mecánico familiar. El sistema gestiona clientes, catálogo de servicios y pedidos de reparación, y lo usa el personal del mostrador. |

---

## 1. Alcance del incremento

| Requisito | ¿Entra en este despliegue? (Sí / Parcial / No) | Qué incluye exactamente o por qué queda fuera |
|---|---|---|
| RF1 Clientes | Parcial | Validación de cliente (nombre de al menos 3 caracteres y teléfono de 10 dígitos) en la lógica y formulario «Registro de clientes» en la página. Falta consultar y buscar clientes. POR CONFIRMAR si el registro ya se guarda. |
| RF2 Catálogo | Parcial | Catálogo de servicios con datos cargados y mostrado en la página. POR CONFIRMAR si ya se puede registrar un servicio nuevo desde la pantalla. |
| RF3 Crear pedido | Parcial | Cálculo del total con centavos y validación de cantidad y precio en la lógica. POR CONFIRMAR si la pantalla de nuevo pedido (cliente, vehículo, placas, servicios y fecha) ya está integrada. |
| RF4 Estados del pedido | Parcial | Lógica de cambio de estado con transiciones válidas (rechaza saltos como Pendiente a Entregado) y cancelación, con pruebas. Fuera de este despliegue: las etapas de «En proceso» y la pantalla para usarlo, porque la lógica aún no está conectada a la interfaz. |
| RF5 Listado | Parcial | Carga de datos y listado de pedidos. POR CONFIRMAR los filtros por estado y por cliente. |
| Cambio de requisito (5 oct) | Parcial | Cancelación implementada en la lógica, pero todavía sin motivo obligatorio. Fecha compromiso y orden de atrasados primero: POR CONFIRMAR; si no están integradas, quedan fuera de este despliegue y se terminan antes de las pruebas de aceptación. |

---

## 2. Destino y configuración

| Elemento | Respuesta |
|---|---|
| Destino | Vercel |
| Proyecto o URL en Vercel | https://equipo-1-l-lineal.vercel.app/ |
| Repositorio desde el que se despliega | info3-fesc-2027-1/equipo-1-lLineal (GitHub) |
| Rama que se publica en producción | main |
| Comando de build (si aplica) | `npm run build` (ejecuta `vite build`) |

### Variables de entorno necesarias

| Nombre de la variable | Para qué sirve |
|---|---|
| Ninguna | El sistema no usa credenciales ni claves de API. |

### Servicios externos de los que depende el sistema

- Ninguno aparte de Vercel (hospedaje) y GitHub (repositorio). Los datos se manejan dentro de la propia aplicación; no hay base de datos externa.

---

## 3. Checklist pre-despliegue

| # | Verificación | ¿Cumple? (Sí / No) | Responsable |
|---|---|---|---|
| 1 | El proyecto compila sin errores con `npm run build` | | Eduardo |
| 2 | Todas las pruebas de `logica.test.js` pasan con `node logica.test.js` | | Abraham |
| 3 | La rama `main` contiene los últimos cambios de los tres integrantes y no hay conflictos pendientes | | Axel |
| 4 | Vercel está conectado al repositorio y el último despliegue de `main` terminó sin errores | | Eduardo |
| 5 | El repositorio no contiene credenciales ni archivos sobrantes en la raíz | | Axel |
| 6 | Un cliente registrado sigue ahí después de recargar la página | | Axel |

---

## 4. Smoke test (verificación posdespliegue)

| # | Acción | Resultado esperado | Resultado obtenido (se llena el lunes) |
|---|---|---|---|
| 1 | Abrir la URL de Vercel | Carga la página con el nombre del taller y sin errores en la consola | |
| 2 | Registrar un cliente con teléfono de 3 dígitos | El sistema lo rechaza con un mensaje de error | |
| 3 | Registrar un cliente válido | El sistema lo acepta | |
| 4 | Abrir el catálogo de servicios | Se muestran los servicios con nombre y precio | |
| 5 | Abrir el listado de pedidos | Se muestran los pedidos cargados | |

---

## 5. Plan de reversión

**Responsable de la reversión:** Eduardo (configuró el despliegue). Si no está disponible, Axel.

**Señal para revertir:** falla cualquiera de las pruebas 1 a 3 del smoke test, o el sitio muestra una página en blanco o un error.

**Pasos:**

1. En Vercel, abrir el proyecto, entrar a la pestaña Deployments y localizar el último despliegue que funcionaba.
2. En ese despliegue elegir la opción para restaurarlo como versión de producción.
3. En GitHub, revertir el commit que causó el problema (`git revert`) y subir el cambio a `main`, para que el repositorio quede igual que lo publicado. Repetir el smoke test.

---

## 6. Despliegue según nuestro modelo

El modelo lineal secuencial avanza por fases en orden: requisitos, análisis y diseño, construcción, pruebas y despliegue. Según eso, el despliegue debería hacerse una sola vez, al final, cuando la construcción y las pruebas de aceptación ya estén cerradas y el sistema esté completo. Nuestro plan de desarrollo lo dice así: el despliegue final y la demostración quedan en la semana 15, después de la fase de pruebas. Sin embargo, nuestro plan real no es del todo coherente con eso. Desde el inicio configuramos Vercel y el sitio ya está publicado desde la rama principal, así que el sistema se ha ido publicando de forma continua mientras se construía, y no una sola vez al final. Además, vamos a desplegar un incremento parcial antes de terminar la fase de construcción, lo cual es más propio de un modelo iterativo. Lo hacemos porque nos sirve para detectar pronto errores de configuración y de persistencia, que serían muy costosos de corregir si aparecieran hasta el final, justo el tipo de riesgo que el modelo lineal maneja mal. Aun así, mantenemos la lógica de la fase: este despliegue es una verificación de la infraestructura y no la entrega final.

---

## Bloqueos para el lunes

- La lógica de cambio de estado y cancelación todavía no maneja las etapas de «En proceso» ni exige motivo al cancelar.
- La lógica de estados y cancelación aún no está conectada a una pantalla.
- Hay un archivo sobrante en la raíz del repositorio (`et --hard ce1d4ba`) que debe eliminarse.
- POR CONFIRMAR: que el registro de clientes y los pedidos se conserven al recargar la página (persistencia).

---

## Declaración de uso de IA

| Herramienta | Para qué la usamos | Qué verificamos nosotros |
|---|---|---|
| Claude | Ayudar a redactar el borrador de este plan y a entender conceptos de despliegue y reversión | Revisamos cada dato contra el repositorio, el documento E2 y el sitio en Vercel. El checklist y el smoke test los llenamos nosotros el lunes. |
