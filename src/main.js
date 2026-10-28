
const formularioCliente = document.getElementById("form-cliente");
const mensajeCliente = document.getElementById("mensaje-cliente");

// Validar los datos del cliente
function validarCliente(cliente) {
  const errores = [];

  // Nombre obligatorio
  if (!cliente.nombre.trim()) {
    errores.push("El nombre del cliente es obligatorio.");
  }

  // Teléfono de 10 dígitos
  if (!/^\d{10}$/.test(cliente.telefono)) {
    errores.push("El teléfono debe contener exactamente 10 dígitos.");
  }

  // Correo opcional, pero debe ser válido si se captura
  if (
    cliente.correo &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.correo)
  ) {
    errores.push("El correo electrónico no es válido.");
  }

  // Placas obligatorias
  if (!cliente.placas.trim()) {
    errores.push("Las placas del vehículo son obligatorias.");
  }

  // Vehículo obligatorio
  if (!cliente.vehiculo.trim()) {
    errores.push("La marca y el modelo del vehículo son obligatorios.");
  }

  return {
    valido: errores.length === 0,
    errores: errores
  };
}

// Registrar cliente
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

  // Ejecutar validaciones
  const resultado = validarCliente(cliente);

  if (!resultado.valido) {
    mensajeCliente.style.color = "#dc2626";
    mensajeCliente.textContent = resultado.errores.join(" ");
    return;
  }

  // Mostrar resultado
  console.log("Cliente registrado:", cliente);

  mensajeCliente.style.color = "#15803d";
  mensajeCliente.textContent =
    `Cliente ${cliente.nombre} validado correctamente.`;

  formularioCliente.reset();
});

// Limpiar mensaje al reiniciar el formulario
formularioCliente.addEventListener("reset", function () {
  mensajeCliente.textContent = "";
});
