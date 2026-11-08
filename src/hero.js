const PAUSA = 30;
const ESPERA = 500;

const hero = document.querySelector(".hero");
const boton = hero.querySelector(".boton");
const textoBoton = hero.querySelector(".boton__texto");

function separarLetras(elemento, inicio = 0) {
  const texto = elemento.textContent;
  elemento.textContent = "";
  [...texto].forEach((caracter, i) => { // operador propagacion convertimos el string en un array
    const letra = document.createElement("span");//crea nueva etiqueta de tipo span
    letra.className = "letra";
    letra.dataset.l = caracter;//copia de la letra, para el efecto dorado
    letra.textContent = caracter;
    letra.style.setProperty("--i", inicio + i);
    elemento.appendChild(letra);
  });
  return inicio + texto.length;
}

// 1) La frase, letra por letra
let n = 0;
hero.querySelectorAll(".hero__texto .linea").forEach((linea) => {
  n = separarLetras(linea, n);
});
hero.style.setProperty("--pausa", `${PAUSA}ms`);
hero.style.setProperty("--espera", `${ESPERA}ms`);
const DURACION_LETRA = 400;  // el 0.4s del CSS, en milisegundos
const duracionFrase = (n - 1) * PAUSA + DURACION_LETRA;

hero.style.setProperty("--dur-frase", `${duracionFrase}ms`);           // cuánto tarda en escribirse la frase
hero.style.setProperty("--fin-frase", `${ESPERA + duracionFrase}ms`);  // cuándo termina

// 2) La palabra del botón (también en letras) y activarlo cuando ya apareció
separarLetras(textoBoton);
textoBoton.addEventListener("animationend", () => hero.classList.add("lista"));

// 3) Bloquear el scroll hasta pulsar "Entrar"
history.scrollRestoration = "manual";   // que al recargar no se quede a media página
window.scrollTo(0, 0);
document.body.classList.add("bloqueado");

boton.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.remove("bloqueado");  // vuelve a permitir el scroll
  hero.classList.add("salida");                 // empieza a deslizarse hacia arriba
});

// Cuando termina de deslizarse, se oculta del todo
hero.addEventListener("transitionend", (e) => {
  if (e.target === hero && hero.classList.contains("salida")) {
    hero.classList.add("oculto");
  }
});