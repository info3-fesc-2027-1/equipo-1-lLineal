

import "./style.css";
import "./menu.js";

const contenedor = document.getElementById("contenedor-pedidos");
const buscador = document.getElementById("buscador-pedidos");

// Recuperar pedidos guardados
function obtenerPedidos() {
    return JSON.parse(
        localStorage.getItem("pedidosTaller")
    ) || [];
}

// Normalizar texto para búsquedas
function normalizar(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Evitar insertar HTML no confiable
function escapar(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);
}

// Mostrar expedientes
function mostrarPedidos(lista = obtenerPedidos()) {

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div class="pedido-vacio">
                <h2>No se encontraron expedientes</h2>
                <p>Intenta buscar con otro nombre, vehículo o placas.</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = lista.map(p => `
        <article class="ficha-pedido">

            <div class="encabezado-pedido">
                <div>
                    <h2>Expediente #${escapar(p.id)}</h2>
                    <p>Registrado: ${escapar(p.fechaRegistro)}</p>
                </div>

                <select
                    class="estado-pedido"
                    data-estado="${escapar(p.id)}"
                >
                    <option value="Pendiente"
                        ${p.estado === "Pendiente" || !p.estado ? "selected" : ""}>
                        Pendiente
                    </option>

                    <option value="En proceso"
                        ${p.estado === "En proceso" ? "selected" : ""}>
                        En proceso
                    </option>

                    <option value="Finalizado"
                        ${p.estado === "Finalizado" ? "selected" : ""}>
                        Finalizado
                    </option>
                </select>
            </div>

            <hr>

            <h3>Datos del cliente</h3>

            <div class="datos-pedido">
                <p><strong>Nombre:</strong> ${escapar(p.cliente.nombre)}</p>
                <p><strong>Teléfono:</strong> ${escapar(p.cliente.telefono)}</p>
                <p><strong>Vehículo:</strong> ${escapar(p.cliente.vehiculo)}</p>
                <p><strong>Placas:</strong> ${escapar(p.cliente.placas)}</p>
                <p><strong>Fecha recibido:</strong> ${escapar(p.cliente.fecharecibido)}</p>
                <p><strong>Fecha entrega:</strong> ${escapar(p.cliente.fechaentrega)}</p>
                <p><strong>Observaciones:</strong> ${escapar(p.cliente.observaciones || "Sin observaciones")}</p>
            </div>

            <hr>

            <h3>Servicios solicitados</h3>

            <ul class="servicios-pedido">
                ${(p.servicios || []).map(s => `
                    <li>
                        <span>${escapar(s.nombre)}</span>
                        <strong>$${Number(s.precio).toFixed(2)}</strong>
                    </li>
                `).join("")}
            </ul>

            <div class="total-pedido">
                Total: $${Number(p.total).toFixed(2)}
            </div>

            <button
                type="button"
                class="btn-eliminar-pedido"
                data-eliminar="${escapar(p.id)}"
            >
                Eliminar expediente
            </button>

        </article>
    `).join("");
}

// BUSCADOR
buscador.addEventListener("input", function() {

    const texto = normalizar(buscador.value);

    const pedidos = obtenerPedidos();

    const resultados = pedidos.filter(p => {

        const nombre = normalizar(p.cliente.nombre);
        const vehiculo = normalizar(p.cliente.vehiculo);
        const placas = normalizar(p.cliente.placas);
        const telefono = normalizar(p.cliente.telefono);

        return (
            nombre.includes(texto) ||
            vehiculo.includes(texto) ||
            placas.includes(texto) ||
            telefono.includes(texto)
        );
    });

    mostrarPedidos(resultados);
});

// CAMBIAR ESTADO
contenedor.addEventListener("change", function(evento) {

    const selector = evento.target.closest("[data-estado]");

    if (!selector) return;

    const id = Number(selector.dataset.estado);
    const pedidos = obtenerPedidos();

    const encontrado = pedidos.find(p => p.id === id);

    if (encontrado) {

        encontrado.estado = selector.value;

        localStorage.setItem(
            "pedidosTaller",
            JSON.stringify(pedidos)
        );

        // Actualizar la vista respetando el buscador
        buscador.dispatchEvent(new Event("input"));
    }
});

// ELIMINAR EXPEDIENTE
contenedor.addEventListener("click", function(evento) {

    const boton = evento.target.closest("[data-eliminar]");

    if (!boton) return;

    const id = Number(boton.dataset.eliminar);

    const pedidos = obtenerPedidos().filter(p => p.id !== id);

    localStorage.setItem(
        "pedidosTaller",
        JSON.stringify(pedidos)
    );

    buscador.dispatchEvent(new Event("input"));
});

// INICIAR
mostrarPedidos();
