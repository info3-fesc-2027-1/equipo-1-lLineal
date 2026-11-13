
import "./style.css";
import "./menu.js";

// Contenedor de pedidos
const contenedor = document.getElementById("contenedor-pedidos");

// Recuperar pedidos
function obtenerPedidos() {
  return JSON.parse(
    localStorage.getItem("pedidosTaller")
  ) || [];
}

// Evitar insertar directamente texto del usuario como HTML
function escapar(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, caracter => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caracter]);
}

// MOSTRAR PEDIDOS
function mostrarPedidos() {

  const pedidos = obtenerPedidos();

  if (pedidos.length === 0) {
    contenedor.innerHTML = `
      <div class="pedido-vacio">
        <h2>No hay pedidos registrados</h2>
        <p>Cuando registres un cliente y sus servicios,
        aparecerán aquí.</p>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = pedidos.map(p => `

    <article class="ficha-pedido">

      <div class="encabezado-pedido">
        <div>
          <h2>Pedido #${escapar(p.id)}</h2>
          <p>Registrado: ${escapar(p.fechaRegistro)}</p>
        </div>

       <select
  class="estado-pedido"
  data-estado="${p.id}">

  <option value="Pendiente"
    ${p.estado === "Pendiente" ? "selected" : ""}>
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
        <p><strong>Placas:</strong> ${escapar(p.cliente.placas)}</p>
        <p><strong>Vehículo:</strong> ${escapar(p.cliente.vehiculo)}</p>
        <p><strong>Fecha recibido:</strong> ${escapar(p.cliente.fecharecibido)}</p>
        <p><strong>Fecha entrega:</strong> ${escapar(p.cliente.fechaentrega)}</p>
        <p><strong>Observaciones:</strong> ${escapar(p.cliente.observaciones || "Sin observaciones")}</p>
      </div>

      <hr>

      <h3>Servicios solicitados</h3>

      <ul class="servicios-pedido">

        ${p.servicios.map(s => `
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
        data-eliminar="${p.id}">
        Eliminar pedido
      </button>

    </article>

  `).join("");
}

// ELIMINAR PEDIDO
contenedor.addEventListener("click", function(evento) {

  const boton = evento.target.closest("[data-eliminar]");

  if (!boton) return;

  const id = Number(boton.dataset.eliminar);

  const pedidos = obtenerPedidos().filter(
    p => p.id !== id
  );

  localStorage.setItem(
    "pedidosTaller",
    JSON.stringify(pedidos)
  );

  mostrarPedidos();

});

// CAMBIAR ESTADO DEL PEDIDO
contenedor.addEventListener("change", function(evento) {

  const selector = evento.target.closest("[data-estado]");

  if (!selector) return;

  const id = Number(selector.dataset.estado);
  const nuevoEstado = selector.value;

  const pedidos = obtenerPedidos();

  // Buscar el pedido correspondiente
  const pedidoEncontrado = pedidos.find(p => p.id === id);

  if (pedidoEncontrado) {

    pedidoEncontrado.estado = nuevoEstado;

    // Actualizar almacenamiento
    localStorage.setItem(
      "pedidosTaller",
      JSON.stringify(pedidos)
    );

    console.log("Estado actualizado:", pedidoEncontrado);
  }

});

// INICIAR
mostrarPedidos();
