const API_URL = "http://localhost:3000/productos";

// Selección de elementos del DOM
const contenedorProductos = document.querySelector(".contenedor_Productos");
const formulario = document.querySelector(".contenedor_Form");
const mensajeError = document.querySelector("[data-mensage]");
const inputNombre = document.querySelector("[data-name]");
const inputPrecio = document.querySelector("[data-price]");
const inputImagen = document.querySelector("[data-image]");

// Mostrar productos
const obtenerProductos = async () => {
    try {
    const respuesta = await fetch(API_URL);
    const productos = await respuesta.json();

    contenedorProductos.innerHTML = productos
    .map(
        (producto) => `
        <div class="producto">
        <img src="${producto.imagen}" alt="${producto.nombre}" width="100">
        <h4>${producto.nombre}</h4>
        <p>$${producto.precio}</p>
        <button data-id="${producto.id}" class="eliminar">Eliminar</button>
        </div>
    `
    )
    .join("");
} catch (error) {
    console.error("Error al obtener productos:", error);
    }
};

// Agregar producto
const agregarProducto = async (nombre, precio, imagen) => {
    try {
    const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio, imagen }),
    });
    if (!respuesta.ok) throw new Error("Error al agregar el producto");
    obtenerProductos(); // Actualizar productos en pantalla
  } catch (error) {
    console.error(error);
    mensajeError.textContent = "Error al agregar el producto.";
  }
};

// Eliminar producto
const eliminarProducto = async (id) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!respuesta.ok) throw new Error("Error al eliminar el producto");
    obtenerProductos(); // Actualizar productos en pantalla
  } catch (error) {
    console.error(error);
  }
};

// Eventos
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = inputNombre.value.trim();
  const precio = inputPrecio.value.trim();
  const imagen = inputImagen.value.trim();

  if (!nombre || !precio || !imagen) {
    mensajeError.textContent = "Todos los campos son obligatorios.";
    return;
  }

  agregarProducto(nombre, precio, imagen);
  formulario.reset(); // Limpiar formulario
});

contenedorProductos.addEventListener("click", (e) => {
  if (e.target.classList.contains("eliminar")) {
    const id = e.target.dataset.id;
    eliminarProducto(id);
  }
});

// Inicializar
obtenerProductos();
