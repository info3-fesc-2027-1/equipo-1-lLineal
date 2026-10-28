
import "./style.css";
import { productos } from "./datos.js";

// Elementos del HTML
const formularioCliente = document.getElementById("form-cliente");
const mensajeCliente = document.getElementById("mensaje-cliente");
const catalogo = document.getElementById("catalogo");
const listaPedido = document.getElementById("lista-pedido");
const totalElemento = document.getElementById("total");
const btnVaciar = document.getElementById("btn-vaciar");

// Lista de servicios agregados
let pedido = [];

// VALIDAR CLIENTE
function validarCliente(cliente) {
  const errores = [];

  if (!cliente.nombre.trim()) {
    errores.push("El nombre del cliente es obligatorio.");
  }

  if (!/^\d{10}$/.test(cliente.telefono)) {
    errores.push("El teléfono debe contener exactamente 10 dígitos.");
  }

  if (
    cliente.correo &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.correo)
  ) {
    errores.push("El correo electrónico no es válido.");
  }

  if (!cliente.placas.trim()) {
    errores.push("Las placas del vehículo son obligatorias.");
  }

  if (!cliente.vehiculo.trim()) {
    errores.push("La marca y el modelo del vehículo son obligatorios.");
  }

  return {
    valido: errores.length === 0,
    errores
  };
}

// REGISTRAR CLIENTE
formularioCliente.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const datos = new FormData(formularioCliente);

  const cliente = {
    nombre: datos.get("nombre").trim(),
    telefono: datos.get("telefono").trim(),
    correo: datos.get("correo").trim(),
    rfc: datos.get("rfc").trim().toUpperCase(),
    placas: datos.get("placas").trim().toUpperCase(),
    vehiculo: datos.get("vehiculo").trim(),
    direccion: datos.get("direccion").trim(),
    observaciones: datos.get("observaciones").trim()
  };

  const resultado = validarCliente(cliente);

  if (!resultado.valido) {
    mensajeCliente.style.color = "#dc2626";
    mensajeCliente.textContent = resultado.errores.join(" ");
    return;
  }

  console.log("Cliente registrado:", cliente);

  mensajeCliente.style.color = "#15803d";
  mensajeCliente.textContent =
    `Cliente ${cliente.nombre} validado correctamente.`;

  formularioCliente.reset();
});

// LIMPIAR MENSAJE
formularioCliente.addEventListener("reset", function () {
  mensajeCliente.textContent = "";
});

// MOSTRAR PRODUCTOS LISTA

function mostrarProductos(lista) {
  catalogo.innerHTML = lista.map(p => `
    <div class="tarjeta-servicio">
      <div>
        <h2>${p.nombre}</h2>
        <p class="categoria">
          Categoría: ${p.categoria.trim()}
        </p>
        <p class="precio">$${p.precio.toFixed(2)}</p>
      </div>

      <button type="button" data-id="${p.id}">
        + Agregar
      </button>
    </div>
  `).join("");
}

// AGREGAR PRODUCTOS AL PEDIDO
catalogo.addEventListener("click", function (evento) {
  const boton = evento.target.closest("[data-id]");

  if (!boton) return;

  const producto = productos.find(
    p => p.id === Number(boton.dataset.id)
  );

  if (producto) {
    pedido.push(producto);
    mostrarPedido();
  }
});

// MOSTRAR PEDIDO Y CALCULAR TOTAL
function mostrarPedido() {
  listaPedido.innerHTML = pedido.map((p, indice) => `
    <li class="flex justify-between items-center gap-2 mb-2">
      <span>${p.nombre} - $${p.precio.toFixed(2)}</span>

      <button
        type="button"
        data-eliminar="${indice}">
        Quitar
      </button>
    </li>
  `).join("");

  const total = pedido.reduce(
    (suma, p) => suma + p.precio,
    0
  );

  totalElemento.textContent = `Total: $${total.toFixed(2)}`;
}

// QUITAR PRODUCTOS
listaPedido.addEventListener("click", function (evento) {
  const boton = evento.target.closest("[data-eliminar]");

  if (!boton) return;

  pedido.splice(Number(boton.dataset.eliminar), 1);
  mostrarPedido();
});

// VACIAR PEDIDO
btnVaciar.addEventListener("click", function () {
  pedido = [];
  mostrarPedido();
});

// INICIAR CATÁLOGO
mostrarProductos(productos);
mostrarPedido();
