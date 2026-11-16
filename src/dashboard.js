
import "./dashboard.css";

// ======================================
// CHĒNOVA - DASHBOARD ADMINISTRATIVO
// ======================================

// LEER PEDIDOS

function obtenerPedidos() {
    try {
        const datos = localStorage.getItem("pedidosTaller");

        if (!datos) return [];

        const pedidos = JSON.parse(datos);

        return Array.isArray(pedidos) ? pedidos : [];

    } catch (error) {
        console.error("Error al leer pedidos:", error);
        return [];
    }
}

// ======================================
// UTILIDADES
// ======================================

function elemento(id) {
    return document.getElementById(id);
}

function mostrar(id, valor) {
    const el = elemento(id);

    if (el) {
        el.textContent = valor;
    }
}

function moneda(cantidad) {
    return Number(cantidad || 0).toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

function normalizarEstado(estado) {
    return String(estado || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\s-]+/g, "_")
        .trim();
}

// ======================================
// CLASIFICAR ESTADOS
// ======================================

function esPendiente(estado) {
    return [
        "pendiente",
        "registrado",
        "registrada"
    ].includes(normalizarEstado(estado));
}

function esProceso(estado) {
    return [
        "en_proceso",
        "en_preparacion",
        "preparacion"
    ].includes(normalizarEstado(estado));
}

function esFinalizado(estado) {
    return [
        "finalizado",
        "finalizada",
        "listo",
        "lista",
        "entregado",
        "entregada"
    ].includes(normalizarEstado(estado));
}

// ======================================
// OBTENER TOTAL DEL PEDIDO
// ======================================

function obtenerTotal(pedido) {

    if (pedido.total !== undefined &&
        pedido.total !== null &&
        pedido.total !== "") {

        return Number(pedido.total) || 0;
    }

    return (pedido.servicios || []).reduce((suma, servicio) => {

        if (typeof servicio === "string") return suma;

        return suma + Number(servicio.precio || 0);

    }, 0);
}

// ======================================
// FECHA ACTUAL
// ======================================

function actualizarFecha() {

    mostrar(
        "fecha-actual",
        new Date().toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    );

}

// ======================================
// OBTENER FECHA DE ENTREGA
// ======================================

function obtenerFechaEntrega(pedido) {

    return (
        pedido.cliente?.fechaentrega ||
        pedido.cliente?.fechaEntrega ||
        pedido.fecha_entrega ||
        pedido.fechaEntrega ||
        ""
    );
}

// Convertir fecha sin errores de zona horaria

function convertirFecha(fechaTexto) {

    if (!fechaTexto) return null;

    // Formato YYYY-MM-DD
    const partes = String(fechaTexto).match(
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/
    );

    if (partes) {

        const fecha = new Date(
            Number(partes[1]),
            Number(partes[2]) - 1,
            Number(partes[3])
        );

        return Number.isNaN(fecha.getTime()) ? null : fecha;
    }

    // Otros formatos de fecha
    const fecha = new Date(fechaTexto);

    return Number.isNaN(fecha.getTime()) ? null : fecha;
}

// ======================================
// SEGUIMIENTO DE ENTREGAS
// ======================================

function actualizarEntregas(pedidos) {

    const tabla = elemento("tabla-entregas");

    if (!tabla) return;

    const ahora = new Date();

    const hoy = new Date(
        ahora.getFullYear(),
        ahora.getMonth(),
        ahora.getDate()
    );

    // Pedidos que todavía no están finalizados

    const entregas = pedidos

        .filter(pedido => {

            return !esFinalizado(pedido.estado) &&
                obtenerFechaEntrega(pedido);

        })

        .map(pedido => {

            const fecha = convertirFecha(
                obtenerFechaEntrega(pedido)
            );

            if (!fecha) return null;

            const diferencia = Math.round(
                (fecha - hoy) / 86400000
            );

            return {
                pedido,
                fecha,
                diferencia
            };

        })

        .filter(Boolean)

        .sort((a, b) => a.fecha - b.fecha);

    // CONTADORES

    const vencidas = entregas.filter(
        e => e.diferencia < 0
    );

    mostrar(
        "total-entregas-pendientes",
        entregas.length
    );

    mostrar(
        "total-entregas-vencidas",
        vencidas.length
    );

    tabla.innerHTML = "";

    if (entregas.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="6">
                    No hay pedidos pendientes con fecha de entrega registrada.
                </td>
            </tr>
        `;

        return;
    }

    // CREAR FILAS

    entregas.forEach(({ pedido, fecha, diferencia }) => {

        const fila = document.createElement("tr");

        const fechaFormateada = fecha.toLocaleDateString(
            "es-MX",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

        let tiempo = "";
        let clase = "";

        if (diferencia < 0) {

            tiempo = `Vencido hace ${Math.abs(diferencia)} días`;
            clase = "entrega-vencida";

        } else if (diferencia === 0) {

            tiempo = "Entregar hoy";
            clase = "entrega-hoy";

        } else if (diferencia === 1) {

            tiempo = "Falta 1 día";
            clase = "entrega-proxima";

        } else {

            tiempo = `Faltan ${diferencia} días`;
            clase = "entrega-normal";

        }

        const datos = [
            pedido.id ?? "Sin ID",
            pedido.cliente?.nombre || "Sin nombre",
            pedido.cliente?.vehiculo || "Sin vehículo",
            fechaFormateada,
            pedido.estado || "Sin estado",
            tiempo
        ];

        datos.forEach((dato, indice) => {

            const celda = document.createElement("td");

            celda.textContent = dato;

            if (indice === 5) {
                celda.classList.add(clase);
            }

            fila.appendChild(celda);

        });

        tabla.appendChild(fila);

    });

}

// ======================================
// SERVICIO MÁS SOLICITADO
// ======================================

function actualizarServicioPopular(pedidos) {

    const servicios = {};

    pedidos.forEach(pedido => {

        (pedido.servicios || []).forEach(servicio => {

            const nombre = typeof servicio === "string"
                ? servicio
                : servicio.nombre;

            if (!nombre) return;

            servicios[nombre] = (servicios[nombre] || 0) + 1;

        });

    });

    const popular = Object.entries(servicios)
        .sort((a, b) => b[1] - a[1])[0];

    mostrar(
        "servicio-popular",
        popular ? popular[0] : "Sin información"
    );

    mostrar(
        "cantidad-servicio",
        popular
            ? `${popular[1]} veces solicitado`
            : "0 servicios registrados"
    );

}

// ======================================
// PEDIDOS RECIENTES
// ======================================

function actualizarRecientes(pedidos) {

    const tabla = elemento("tabla-recientes");

    if (!tabla) return;

    tabla.innerHTML = "";

    // Ordenar por fecha de registro o ID

    const recientes = [...pedidos].sort((a, b) => {

        const fechaA = new Date(
            a.fechaRegistro || 0
        ).getTime() || Number(a.id) || 0;

        const fechaB = new Date(
            b.fechaRegistro || 0
        ).getTime() || Number(b.id) || 0;

        return fechaB - fechaA;

    }).slice(0, 5);

    if (recientes.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="5">
                    Todavía no hay pedidos registrados.
                </td>
            </tr>
        `;

        return;
    }

    recientes.forEach(pedido => {

        const fila = document.createElement("tr");

        const datos = [
            pedido.id ?? "Sin ID",
            pedido.cliente?.nombre || "Sin nombre",
            pedido.cliente?.vehiculo || "Sin vehículo",
            moneda(obtenerTotal(pedido)),
            pedido.estado || "Sin estado"
        ];

        datos.forEach(dato => {

            const celda = document.createElement("td");

            celda.textContent = dato;

            fila.appendChild(celda);

        });

        tabla.appendChild(fila);

    });

}

// ======================================
// ACTUALIZAR TODO EL DASHBOARD
// ======================================

function actualizarDashboard() {

    const pedidos = obtenerPedidos();

    console.log("Pedidos recuperados:", pedidos);

    // ESTADÍSTICAS

    const pendientes = pedidos.filter(
        p => esPendiente(p.estado)
    );

    const proceso = pedidos.filter(
        p => esProceso(p.estado)
    );

    const finalizados = pedidos.filter(
        p => esFinalizado(p.estado)
    );

    // FINANZAS

    const valorTotal = pedidos.reduce(
        (suma, p) => suma + obtenerTotal(p),
        0
    );

    const valorFinalizado = finalizados.reduce(
        (suma, p) => suma + obtenerTotal(p),
        0
    );

    // MOSTRAR RESULTADOS

    mostrar("total-pedidos", pedidos.length);

    mostrar("pedidos-pendientes", pendientes.length);

    mostrar("pedidos-proceso", proceso.length);

    mostrar("pedidos-finalizados", finalizados.length);

    mostrar("valor-pedidos", moneda(valorTotal));

    mostrar("ingresos-finalizados", moneda(valorFinalizado));

    // ACTUALIZAR RESTO DEL DASHBOARD

    actualizarEntregas(pedidos);

    actualizarServicioPopular(pedidos);

    actualizarRecientes(pedidos);

    console.log("Dashboard actualizado correctamente.");

}

// ======================================
// INICIAR DASHBOARD
// ======================================

actualizarFecha();

actualizarDashboard();

// Actualizar si se modifica desde otra pestaña

window.addEventListener("storage", evento => {

    if (evento.key === "pedidosTaller") {
        actualizarDashboard();
    }

});

// Actualizar al volver a esta ventana

window.addEventListener("focus", () => {
    actualizarDashboard();
});

window.addEventListener("pageshow", () => {
    actualizarDashboard();
});
