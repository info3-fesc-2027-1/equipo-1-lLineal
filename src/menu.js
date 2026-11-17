import "./style.css";
import "./tema.css";
import "./menu.css";  

const ENLACES = [
  { clave: "index", href: "./index.html", texto: "Inicio" },
  { clave: "pedidos", href: "./pedidos.html", texto: "Pedidos" },
  { clave: "DASHLIVE", href: "./DASHLIVE.html", texto: "Dashlive" },
];

// En qué página estamos: "/pedidos.html" -> "pedidos", "/" -> "index"
const actual = location.pathname.split("/").pop().replace(".html", "") || "index";

const enlaces = ENLACES.map(({ clave, href, texto }, i) => `
  <a href="${href}" class="menu__enlace" style="--i:${i}"
     ${clave === actual ? 'aria-current="page"' : ""}>
    <span class="menu__num">0${i + 1}</span>
    <span class="menu__texto">${texto}</span>
  </a>`).join("");

document.body.insertAdjacentHTML("afterbegin", `
  <header class="barra">
    <a href="./index.html" class="barra__logo">
      <img src="/logo.svg" alt="" width="32" height="32">
      <span>ChēNova</span>
    </a>
    <button type="button" id="btn-menu" class="barra__menu"
            aria-expanded="false" aria-controls="menu">Menú</button>
  </header>

  <div class="menu" id="menu">
  <div class="menu__imagen" aria-hidden="true"></div>
  <nav class="menu__nav">${enlaces}</nav>
  <p class="menu__pie">ChēNova · Mecánica de confianza</p>
</div>
`);

const boton = document.getElementById("btn-menu");

function alternar(abierto) {
  document.body.classList.toggle("menu-abierto", abierto);
  boton.setAttribute("aria-expanded", abierto);
  boton.textContent = abierto ? "Cerrar" : "Menú";
}

boton.addEventListener("click", () =>
  alternar(!document.body.classList.contains("menu-abierto")));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") alternar(false);
});

document.getElementById("menu").addEventListener("click", (e) => {
  if (e.target.closest("a")) alternar(false);
});