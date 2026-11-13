
import "./style.css";
import "./hero.css";
import "./hero.js";
import { productos } from "./datos.js";

// Elementos del HTML
const formularioCliente = document.getElementById("form-cliente");
const mensajeCliente = document.getElementById("mensaje-cliente");
const catalogo = document.getElementById("catalogo");
const listaPedido = document.getElementById("lista-pedido");
const totalElemento = document.getElementById("total");
const btnVaciar = document.getElementById("btn-vaciar");



const buscador = document.getElementById('buscador')

//manda llamar el menu
import "./menu.js";

// Lista de servicios agregados
let pedido = [];



// VALIDAR CLIENTE
function validarCliente(cliente) {

  let valido = true;

  // Función para mostrar errores individuales
  function mostrarError(campo, mensaje) {
    const error = document.getElementById(`error-${campo}`);
    error.textContent = mensaje;

    if (mensaje !== "") {
      valido = false;
    }
  }

  // Nombre
  mostrarError(
    "nombre",
    cliente.nombre.trim() === ""
      ? "El nombre del cliente es obligatorio."
      : ""
  );

  // Teléfono
  mostrarError(
    "telefono",
    !/^\d{10}$/.test(cliente.telefono)
      ? "El teléfono debe contener exactamente 10 dígitos."
      : ""
  );

  // Placas
  mostrarError(
    "placas",
    cliente.placas.trim() === ""
      ? "Las placas son obligatorias."
      : ""
  );

  // Vehículo
  mostrarError(
    "vehiculo",
    cliente.vehiculo.trim() === ""
      ? "La marca y modelo del vehículo son obligatorios."
      : ""
  );

  // Fecha recibido
  mostrarError(
    "fecharecibido",
    cliente.fecharecibido === ""
      ? "La fecha de recepción es obligatoria."
      : ""
  );

  // Fecha entrega
  mostrarError(
    "fechaentrega",
    cliente.fechaentrega === ""
      ? "La fecha de entrega es obligatoria."
      : ""
  );

  // Comparar fechas cuando ambas existen
  if (
    cliente.fecharecibido &&
    cliente.fechaentrega &&
    cliente.fechaentrega < cliente.fecharecibido
  ) {
    mostrarError(
      "fechaentrega",
      "La fecha de entrega no puede ser anterior a la recepción."
    );
  }

  return valido;
}


// REGISTRAR CLIENTE
formularioCliente.addEventListener("submit", function(evento) {

  evento.preventDefault();

  const datos = new FormData(formularioCliente);

  const cliente = {
    nombre: datos.get("nombre").trim(),
    telefono: datos.get("telefono").trim(),
    placas: datos.get("placas").trim().toUpperCase(),
    vehiculo: datos.get("vehiculo").trim(),
    fecharecibido: datos.get("fecharecibido"),
    fechaentrega: datos.get("fechaentrega"),
    observaciones: datos.get("observaciones").trim()
  };

  const resultado = validarCliente(cliente);

  if (!resultado) {
    mensajeCliente.style.color = "#dc2626";
    mensajeCliente.textContent = "Revisa los campos marcados en rojo.";
    return;
  }

  console.log("Cliente registrado:", cliente);

  mensajeCliente.style.color = "#15803d";
  mensajeCliente.textContent =
    `Cliente ${cliente.nombre} registrado correctamente.`;

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

buscador.addEventListener('input', () => {

  const texto = buscador.value.toLowerCase()

  const resultados = productos.filter(p =>
    p.nombre.toLowerCase().includes(texto)
  )

  mostrarProductos(resultados)

})


// INICIAR CATÁLOGO
mostrarProductos(productos);
mostrarPedido();
