# Integra – Cocinas Integrales · Guía de diseño (Paso 1)

Este documento define la identidad visual y la estructura del sitio. Es la base para construir la página en los siguientes pasos.

---

## 1. Logo

- Archivo: **`integra_Logo_SF.png`**
- Ubicación: **`img/logo/integra_Logo_SF.png`** (versión sin fondo, ya colocada; la página la usa en el header y como ícono de pestaña).
- Recomendación: si más adelante tienes una versión en blanco, guárdala como `img/logo/integra_Logo_blanco.png` para usarla sobre fondos oscuros (footer).

---

## 2. Paleta de colores

Tomada del logo, con neutros cálidos de apoyo.

| Rol | Nombre | Hex | Uso |
|---|---|---|---|
| Principal | Azul marino Integra | `#0B1B2E` | Header, títulos, footer, botones secundarios |
| Acento | Cobre / madera | `#A8693A` | Botones principales, detalles, iconos, líneas |
| Fondo claro | Crema | `#F8ECE1` | Fondo de secciones alternas |
| Apoyo | Arena | `#E6D3C0` | Bordes, tarjetas, separadores |
| Apoyo | Nogal | `#6B4428` | Hover del cobre, textos de acento oscuros |
| Apoyo | Gris cálido | `#5E5A55` | Texto de párrafos |
| Base | Blanco hueso | `#FFFCF8` | Fondo general |
| Solo burbuja | Verde WhatsApp | `#25D366` | **Únicamente** la burbuja flotante de WhatsApp |

Reglas:
- El cobre es el color de acción (botón "Cotiza por WhatsApp"). No abusar: un acento por bloque.
- El verde de WhatsApp no se usa en ningún otro elemento para no competir con la marca.
- Contraste: texto marino sobre crema y blanco sobre marino cumplen accesibilidad (AA).

Todas las variables están en `css/styles.css` dentro de `:root`.

---

## 3. Tipografía (Google Fonts)

- **Títulos: Montserrat** (600–700). Sans geométrica, sólida y moderna, similar al logo.
- **Texto: Inter** (400–500). Muy legible en celular y pantalla.
- Alternativa si se quiere un tono más redondeado en títulos: Poppins (se cambia en una sola variable, `--font-heading`).

Escala sugerida: H1 2.5–3.5 rem (adaptable), H2 2 rem, H3 1.25 rem, texto 1 rem / 1.6 de interlineado.

---

## 4. Tono y personalidad

- **Confianza**: lenguaje claro, cifras reales, fotos de trabajos terminados.
- **Calidez**: madera, crema, espacios del hogar; hablar de "tu cocina", "tu familia".
- **Marca confiable**: diseño limpio, ordenado, sin saturar; botón de contacto siempre visible.
- Español de México, trato de "tú".
- **Preparado para 3D**: la carpeta `models/` queda reservada para modelos GLB (cocinas o muebles en 3D que el cliente pueda girar). Se integrarán después con un visor ligero (p. ej. `<model-viewer>`), sin cambiar la estructura.

---

## 5. Orden de secciones

| # | Sección | id | Contenido |
|---|---|---|---|
| 1 | Header | `header` | Logo + menú (Trabajos, Melaminas, Muebles, Zonas, Nosotros, Contacto) |
| 2 | Portada | `#inicio` | Frase principal sobre cocinas integrales a la medida + botón "Cotiza por WhatsApp" |
| 3 | Cifras | `#cifras` | Trabajos realizados, años de experiencia, estados atendidos (placeholders) |
| 4 | Galería de trabajos | `#trabajos` | Fotos de cocinas terminadas |
| 5 | Catálogo de melaminas | `#melaminas` | Muestras de color y textura |
| 6 | Muebles | `#muebles` | Closets, centros de entretenimiento, baños, etc. |
| 7 | Zonas donde trabajamos | `#zonas` | Estados de la República (lista placeholder) |
| 8 | Sobre nosotros | `#nosotros` | Historia, valores, forma de trabajo |
| 9 | Contacto | `#contacto` | WhatsApp, teléfono, correo, horario |
| 10 | Footer | `footer` | Logo, redes sociales (placeholders, links pendientes), derechos |
| — | Burbuja WhatsApp | `.whatsapp-float` | Flotante, enlaza a `https://wa.me/527776103610` |

Frase de portada propuesta (editable): **"Cocinas integrales a la medida de tu hogar"** — subtítulo: *"Diseñamos, fabricamos e instalamos tu cocina con materiales de calidad y acabados que duran."*

---

## 6. Cómo agregar contenido (galería, melaminas, muebles)

Todo el contenido vive en **`js/data.js`** (no hace falta tocar `index.html` ni `main.js`). Para agregar un trabajo:

1. Copia la foto a `img/trabajos/` (ej. `cocina-cuernavaca-01.jpg`).
2. En `js/data.js`, agrega una línea al arreglo `trabajos`:
   ```js
   { imagen: "img/trabajos/cocina-cuernavaca-01.jpg", titulo: "Cocina en L", lugar: "Cuernavaca, Morelos", descripcion: "Texto corto." },
   ```
3. Guarda y recarga la página: aparece sola en la galería (con lightbox).

Campos por sección en `data.js`:
- `trabajos`: imagen, titulo, lugar, descripcion
- `melaminas`: nombre, tipo (Blancos/Grises/Maderas/Lisos → crea los filtros solo), acabado (Mate/Brillo/Texturizado), color (hex de la muestra), veta (true = madera); opcional `imagen: "img/melaminas/nogal.jpg"` para usar foto real
- `muebles`: imagen, titulo, descripcion
- `cifras`: numero, sufijo ("+", "%"), etiqueta
- `zonas`: lista de estados
- `testimonios`: texto, autor, lugar (si se vacía, la sección se oculta)
- `redes`: nombre (Facebook/Instagram/TikTok), url (vacía = no se muestra)
- `contacto`: whatsapp, telefonoVisible, correo, horario, mensajeWhatsApp

Las fotos actuales son de **ejemplo** (Unsplash, por internet). Si no hay internet se ve un fondo de color en su lugar.

Recomendaciones de imagen: JPG o WebP, ancho máx. 1600 px, peso < 400 KB; nombres en minúsculas, sin espacios ni acentos.

---

## 7. Estructura de archivos

```
integra-web-page/
├── index.html          ← secciones vacías con sus ids
├── DISENO.md           ← este documento
├── css/styles.css      ← variables de color y fuentes
├── js/main.js          ← lógica (vacío por ahora)
├── js/data.js          ← datos editables de galerías, cifras y zonas
├── img/logo/           ← integra_Logo_SF.png (logo sin fondo)
├── img/trabajos/
├── img/melaminas/
├── img/muebles/
└── models/             ← futuros modelos 3D (.glb)
```

Sitio 100 % estático: se abre con doble clic en `index.html`, sin instalar nada.

## Pendientes del dueño
- Logo sin fondo ya colocado en `img/logo/integra_Logo_SF.png`.
- Enviar links de redes sociales (Facebook, Instagram, TikTok, etc.).
- Cifras reales y lista real de estados.
- Fotos de trabajos, melaminas y muebles.

---

## 8. Modelos 3D (Gaussian Splat)

Un trabajo de la galería puede tener botón **"Ver en 3D"**. Abre un visor a pantalla completa que solo descarga el modelo cuando se pulsa, así la página sigue cargando rápido.

- Visor: three.js + Spark (sparkjs.dev), cargados desde internet (CDN). Código en `js/visor3d.js`.
- Modelo actual: `models/cocina.splat` (30.7 MB, ~960 mil splats). Se convirtió del `splat.ply` original (236 MB) a formato `.splat` compacto, quitando splats casi invisibles (opacidad < 2 %).
- Para agregar un modelo a otro trabajo, en `js/data.js` agrega `modelo3d: "models/archivo.splat"` a ese trabajo. Si no le pones `vista3d`, usa una vista por defecto que probablemente haya que ajustar.
- `vista3d` (opcional): `objetivo` (punto al que mira), `camara` (posición inicial), `rotacion` en grados (nerfstudio = `[-90, 0, 0]`), `giroHorizontal` / `giroVertical` (grados que se puede girar), `zoomMin` / `zoomMax`.
- Formatos que lee el visor: `.splat`, `.ply`, `.spz`, `.ksplat`, `.sog`. Para la web conviene `.splat` o `.spz` (más ligeros).

**Importante:** con doble clic (`file://`) el navegador no deja cargar el modelo. Para probarlo en la computadora usa **`probar-3d.bat`**: abre la página en `http://localhost:8080`. Ya publicada en internet funciona normal.
