import { validarCliente } from "../logica.js";

const form = document.getElementById("form-cliente");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const r = validarCliente({
    nombre: document.getElementById("nombre").value,
    telefono: document.getElementById("telefono").value,
  });
  resultado.textContent = r.valido ? "Cliente válido ✅" : r.errores.join(" ");
});
