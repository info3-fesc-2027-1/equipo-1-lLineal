
// Pruebas de la tarea 2. Ejecutar: node logica.test.js
import assert from "node:assert/strict";
import { validarCliente, calcularTotal } from "./logica.js";

// calcularTotal: 3 casos, uno con centavos
assert.equal(calcularTotal([{ cantidad: 2, precio: 150 }]), 300);
assert.equal(
  calcularTotal([{ cantidad: 3, precio: 19.99 }, { cantidad: 1, precio: 0.1 }]),
  60.07
);
assert.equal(calcularTotal([]), 0);
assert.throws(() => calcularTotal([{ cantidad: 0, precio: 10 }]));
assert.throws(() => calcularTotal([{ cantidad: 1, precio: -5 }]));

// validarCliente
assert.equal(validarCliente({ nombre: "Juan Pérez", telefono: "55 1234 5678" }).valido, true);
assert.equal(validarCliente({ nombre: "Al", telefono: "123" }).errores.length, 2);
assert.equal(validarCliente({}).valido, false);

console.log("Todas las pruebas pasaron ");
