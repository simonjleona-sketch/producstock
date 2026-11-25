# ProducStock

## Título y descripción general

ProducStock es una aplicación web para organizar un catálogo de materia prima e insumos industriales. Permite consultar materiales, categorías, precios y enlaces de proveedores, y registrar nuevos insumos desde un formulario.

La aplicación utiliza un presupuesto de referencia de **100 USD por insumo**. Si el precio ingresado supera ese monto, muestra una advertencia, pero permite agregar el registro al catálogo.

## Tecnologías utilizadas

- **HTML5** para la estructura y los formularios.
- **CSS3** para los estilos y el diseño adaptable.
- **JavaScript ES6** para cargar los datos y gestionar el catálogo.
- **Fetch API** para solicitar el archivo de datos iniciales.
- **JSON** para definir los mercados y los insumos de ejemplo.

## Estructura del repositorio

```text
.
├── index.html   # Página principal
├── style.css    # Estilos de la aplicación
├── app.js       # Lógica del formulario y del catálogo
├── data.json    # Datos iniciales de mercados e insumos
└── README.md    # Documentación del proyecto
```

## Instrucciones de instalación local con Live Server

1. Descarga o clona el proyecto y abre la carpeta en Visual Studio Code.
2. Instala la extensión **Live Server** si aún no está instalada.
3. En el explorador de archivos de Visual Studio Code, haz clic derecho en `index.html`.
4. Selecciona **Open with Live Server**.
5. Se abrirá la aplicación en el navegador. Debe ejecutarse desde un servidor local para que `Fetch API` pueda cargar `data.json`.

## Guía rápida de uso

1. Revisa los insumos iniciales en la sección **Insumos registrados**.
2. En **Materiales e insumos**, completa el nombre, la categoría, el precio unitario, el proveedor y su enlace web.
3. Selecciona **Guardar Insumo**. El enlace debe usar `http://` o `https://`.
4. El nuevo insumo aparecerá en el catálogo. Si su precio supera los **100 USD**, aparecerá una advertencia; el registro igualmente se agrega.

Los insumos iniciales se leen desde `data.json`. Los registros agregados durante la sesión se mantienen en memoria y se pierden al recargar la página.