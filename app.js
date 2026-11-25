const LIMITE_PRESUPUESTO_INSUMO = 100;
const formatoPrecio = new Intl.NumberFormat("es-VE", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const formulario = document.querySelector("#formInsumo");
const tablaCuerpo = document.querySelector("#tablaCuerpo");
const contenedorMensaje = document.querySelector("#mensajeAlerta");
const mensajeCatalogo = document.querySelector("#mensajeCatalogo");
const seccionInventario = document.querySelector("#inventario");
let inventarioInsumos = [];

formulario.addEventListener("submit", procesarNuevoInsumo);
cargarInsumosIniciales();

async function cargarInsumosIniciales() {
  try {
    const respuesta = await fetch(new URL("./data.json", import.meta.url));
    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar data.json (HTTP ${respuesta.status}).`);
    }

    const datos = await respuesta.json();
    if (!datos || !Array.isArray(datos.mercados) || !Array.isArray(datos.insumos)) {
      throw new Error("data.json debe contener las listas mercados e insumos.");
    }

    inventarioInsumos = datos.insumos;
    actualizarTablaDOM();
  } catch (error) {
    console.error("Error al cargar los datos iniciales:", error);
    mostrarMensajeEnPantalla(
      "No se pudieron cargar los datos iniciales. Comprueba data.json y abre el proyecto desde un servidor web local.",
      "error",
    );
    mostrarEstadoVacio("No fue posible cargar el catálogo.");
  }
}

function actualizarTablaDOM() {
  tablaCuerpo.replaceChildren();

  if (inventarioInsumos.length === 0) {
    mostrarEstadoVacio("Todavía no hay insumos registrados.");
    return;
  }

  inventarioInsumos.forEach((item) => {
    const fila = document.createElement("tr");
    agregarCelda(fila, item.idInsumo);
    agregarCelda(fila, item.material);
    agregarCelda(fila, item.categoria);

    const celdaPrecio = agregarCelda(fila, formatoPrecio.format(Number(item.precioUnitario)));
    celdaPrecio.classList.add("precio");
    agregarCelda(fila, item.mercado);

    const celdaEnlace = document.createElement("td");
    const enlace = document.createElement("a");
    enlace.className = "link-mercado";
    enlace.href = item.enlaceMercado;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent = "Visitar mercado";
    enlace.setAttribute("aria-label", `Visitar ${item.mercado} (se abre en una pestaña nueva)`);
    celdaEnlace.append(enlace);
    fila.append(celdaEnlace);

    tablaCuerpo.append(fila);
  });
}

function agregarCelda(fila, texto) {
  const celda = document.createElement("td");
  celda.textContent = String(texto ?? "");
  fila.append(celda);
  return celda;
}

function mostrarEstadoVacio(texto) {
  const fila = document.createElement("tr");
  const celda = document.createElement("td");
  celda.className = "empty-state";
  celda.colSpan = 6;
  celda.textContent = texto;
  fila.append(celda);
  tablaCuerpo.append(fila);
}

function procesarNuevoInsumo(evento) {
  evento.preventDefault();

  const datosFormulario = new FormData(formulario);
  const nombreMaterial = String(datosFormulario.get("material") ?? "").trim();
  const categoriaSeleccionada = String(datosFormulario.get("categoria") ?? "").trim();
  const precioIngresado = Number(datosFormulario.get("precio"));
  const nombreMercado = String(datosFormulario.get("mercado") ?? "").trim();
  const enlaceIngresado = String(datosFormulario.get("enlace") ?? "").trim();

  if (!Number.isFinite(precioIngresado) || precioIngresado <= 0) {
    mostrarMensajeEnPantalla("El precio unitario debe ser un monto mayor a $0.00.", "error");
    return;
  }

  let urlMercado;
  try {
    urlMercado = new URL(enlaceIngresado);
  } catch {
    mostrarMensajeEnPantalla("Ingresa una URL válida para el mercado o proveedor.", "error");
    return;
  }

  if (urlMercado.protocol !== "http:" && urlMercado.protocol !== "https:") {
    mostrarMensajeEnPantalla("El enlace del mercado debe comenzar con http:// o https://.", "error");
    return;
  }

  const nuevoRegistro = {
    idInsumo: generarIdInsumo(),
    material: nombreMaterial,
    categoria: categoriaSeleccionada,
    precioUnitario: precioIngresado,
    mercado: nombreMercado,
    enlaceMercado: urlMercado.href,
  };

  inventarioInsumos.push(nuevoRegistro);
  actualizarTablaDOM();
  formulario.reset();

  if (precioIngresado > LIMITE_PRESUPUESTO_INSUMO) {
    mostrarMensajeCatalogo(
      `Advertencia: el precio de ${formatoPrecio.format(precioIngresado)} supera el límite de ${formatoPrecio.format(LIMITE_PRESUPUESTO_INSUMO)} por insumo. El registro se agregó al catálogo.`,
      "advertencia",
    );
  } else {
    mostrarMensajeCatalogo("Insumo registrado correctamente en el catálogo.", "exito");
  }

  seccionInventario.scrollIntoView({ behavior: "smooth", block: "start" });
}

function generarIdInsumo() {
  const mayorId = inventarioInsumos.reduce((mayor, item) => {
    const coincidencia = /^INS-(\d+)$/.exec(String(item.idInsumo));
    return coincidencia ? Math.max(mayor, Number(coincidencia[1])) : mayor;
  }, 0);

  return `INS-${String(mayorId + 1).padStart(3, "0")}`;
}

function mostrarMensajeEnPantalla(texto, tipo) {
  contenedorMensaje.textContent = texto;
  contenedorMensaje.className = `alerta ${tipo}`;
}

function mostrarMensajeCatalogo(texto, tipo) {
  mensajeCatalogo.textContent = texto;
  mensajeCatalogo.className = `alerta ${tipo}`;
}
