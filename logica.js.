export function validarCliente(cliente) {
  const errores = [];
  const nombre = String(cliente?.nombre ?? "").trim();
  const telefono = String(cliente?.telefono ?? "").replace(/[\s-]/g, "");

  if (nombre.length < 3) {
    errores.push("El nombre debe tener al menos 3 caracteres.");
  }
  if (!/^\d{10}$/.test(telefono)) {
    errores.push("El teléfono debe tener 10 dígitos.");
  }
  return { valido: errores.length === 0, errores };
}

export function calcularTotal(partidas) {
  if (!Array.isArray(partidas)) {
    throw new Error("Las partidas deben ser un arreglo.");
  }
  let centavos = 0;
  for (const p of partidas) {
    const cantidad = Number(p?.cantidad);
    const precio = Number(p?.precio);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error("La cantidad debe ser un entero mayor que 0.");
    }
    if (!Number.isFinite(precio) || precio < 0) {
      throw new Error("El precio debe ser un número mayor o igual a 0.");
    }
    centavos += cantidad * Math.round(precio * 100);
  }
  return centavos / 100;
}

