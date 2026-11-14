// =========================================================
// Integra – Datos editables del sitio
// ---------------------------------------------------------
// Para agregar un elemento: copia una línea completa { ... },
// pégala abajo y cambia los valores. No olvides la coma al final.
//
// FOTOS: por ahora son fotos de EJEMPLO de Unsplash (internet).
// Se reemplazarán por tus fotos reales, guardadas en:
//   trabajos → img/trabajos/   ej. imagen: "img/trabajos/cocina-01.jpg"
//   muebles  → img/muebles/    ej. imagen: "img/muebles/closet-01.jpg"
//   melaminas→ img/melaminas/  ej. imagen: "img/melaminas/nogal.jpg"
// Si una foto no carga (sin internet), se muestra un fondo de color.
// =========================================================

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

const INTEGRA_DATA = {
  // ---------- Contacto ----------
  contacto: {
    whatsapp: "527776103610",          // con 52 (México), sin espacios ni +
    telefonoVisible: "777 610 3610",
    correo: "",                        // ej. "contacto@integra.mx" (vacío = no se muestra)
    horario: "Lunes a viernes 9:00 – 18:00 · Sábado 9:00 – 14:00 (EJEMPLO)",
    mensajeWhatsApp: "Hola Integra, me interesa cotizar una cocina integral.",
  },

  // ---------- Cifras (EJEMPLO: reemplazar con datos reales) ----------
  cifras: [
    { numero: 500, sufijo: "+", etiqueta: "Trabajos realizados" },
    { numero: 10,  sufijo: "",  etiqueta: "Años de experiencia" },
    { numero: 5,   sufijo: "",  etiqueta: "Estados atendidos" },
    { numero: 98,  sufijo: "%", etiqueta: "Clientes satisfechos" },
  ],

  // ---------- Galería de trabajos realizados (EJEMPLO) ----------
  trabajos: [
    { imagen: U("photo-1556911220-bff31c812dba"), titulo: "Cocina con isla",      lugar: "Cuernavaca, Morelos",  descripcion: "Isla central con barra para desayunar y cubierta de cuarzo.",
      // Modelo 3D (Gaussian Splat). Opcional: si un trabajo no tiene, no sale el botón "Ver en 3D".
      modelo3d: "models/cocina.splat",
      // vista3d: vista inicial y límites de giro (ajustados para este modelo; normalmente no se tocan)
      vista3d: { objetivo: [0, 0.05, 0.36], camara: [-2.11, 0.4, 1.51], rotacion: [-90, 0, 0],
                 giroHorizontal: 18, giroVertical: 15, zoomMin: 0.55, zoomMax: 1.25 } },
    { imagen: U("photo-1588854337236-6889d631faa8"), titulo: "Cocina en L",          lugar: "Ciudad de México",     descripcion: "Gabinetes en tono oscuro con cubierta de mármol y piso de madera." },
    { imagen: U("photo-1556912173-3bb406ef7e77"), titulo: "Cocina abierta",       lugar: "Jiutepec, Morelos",    descripcion: "Integrada al comedor, con acabados en madera nogal." },
    { imagen: U("photo-1484154218962-a197022b5858"), titulo: "Cocina moderna",    lugar: "Estado de México",     descripcion: "Diseño minimalista con iluminación LED bajo gabinete." },
    { imagen: U("photo-1565538810643-b5bdb714032a"), titulo: "Cocina en U",       lugar: "Puebla, Puebla",       descripcion: "Máximo almacenamiento con cajones de cierre suave." },
    { imagen: U("photo-1600489000022-c2086d79f9d4"), titulo: "Cocina contemporánea", lugar: "Temixco, Morelos", descripcion: "Contraste de gris grafito con madera roble." },
    { imagen: U("photo-1556185781-a47769abb7ee"), titulo: "Cocina lineal",        lugar: "Acapulco, Guerrero",   descripcion: "Solución compacta para departamento, sin perder espacio." },
    { imagen: U("photo-1600585152220-90363fe7e115"), titulo: "Cocina residencial", lugar: "Cuernavaca, Morelos", descripcion: "Cocina abierta con barra de cuatro bancos y madera clara." },
  ],

  // ---------- Catálogo de melaminas (muestras de ejemplo) ----------
  // tipo: Blancos | Grises | Maderas | Lisos      acabado: Mate | Brillo | Texturizado
  // "color" dibuja la muestra mientras no haya foto; "veta": true le pone vetas de madera.
  melaminas: [
    { nombre: "Blanco Nieve",   tipo: "Blancos", acabado: "Brillo",      color: "#F6F4F0" },
    { nombre: "Blanco Hueso",   tipo: "Blancos", acabado: "Mate",        color: "#EDE6DA" },
    { nombre: "Gris Perla",     tipo: "Grises",  acabado: "Mate",        color: "#B9B7B3" },
    { nombre: "Gris Grafito",   tipo: "Grises",  acabado: "Texturizado", color: "#4A4D52" },
    { nombre: "Concreto",       tipo: "Grises",  acabado: "Texturizado", color: "#8F8A83" },
    { nombre: "Nogal",          tipo: "Maderas", acabado: "Texturizado", color: "#6B4428", veta: true },
    { nombre: "Roble Natural",  tipo: "Maderas", acabado: "Mate",        color: "#B8895A", veta: true },
    { nombre: "Encino Claro",   tipo: "Maderas", acabado: "Mate",        color: "#D3B48C", veta: true },
    { nombre: "Cerezo",         tipo: "Maderas", acabado: "Brillo",      color: "#8E4A2E", veta: true },
    { nombre: "Azul Marino",    tipo: "Lisos",   acabado: "Mate",        color: "#1C2D45" },
    { nombre: "Verde Olivo",    tipo: "Lisos",   acabado: "Mate",        color: "#6B6F4A" },
    { nombre: "Negro",          tipo: "Lisos",   acabado: "Brillo",      color: "#1E1E1F" },
  ],

  // ---------- Muebles (EJEMPLO) ----------
  muebles: [
    { imagen: U("photo-1614631446501-abcf76949eca"), titulo: "Clósets y vestidores",       descripcion: "Cajones, entrepaños y colgadores a tu medida." },
    { imagen: U("photo-1593696140826-c58b021acf8b"), titulo: "Centros de entretenimiento", descripcion: "Mueble para TV con cables ocultos y repisas." },
    { imagen: U("photo-1620626011761-996317b8d101"),    titulo: "Muebles de baño",            descripcion: "Gabinetes resistentes a la humedad." },
    { imagen: U("photo-1518455027359-f3f8164ba6bd"), titulo: "Oficinas y libreros",        descripcion: "Escritorios y almacenamiento para trabajar en casa." },
    { imagen: U("photo-1556909172-54557c7e4fb7"),    titulo: "Alacenas",                   descripcion: "Despensas organizadas, con extraíbles y puertas altas." },
  ],

  // ---------- Zonas donde trabajamos (EJEMPLO: confirmar) ----------
  zonas: ["Morelos", "Ciudad de México", "Estado de México", "Guerrero", "Puebla"],

  // ---------- Opiniones de clientes (EJEMPLO) ----------
  testimonios: [
    { texto: "Cumplieron en tiempo y la cocina quedó tal como la imaginamos.", autor: "Cliente de ejemplo", lugar: "Cuernavaca" },
    { texto: "Muy buena atención desde la medición hasta la instalación.",       autor: "Cliente de ejemplo", lugar: "CDMX" },
    { texto: "Materiales de calidad y un acabado excelente. Los recomiendo.",      autor: "Cliente de ejemplo", lugar: "Jiutepec" },
  ],

  // ---------- Redes sociales (pegar los links cuando los tengas) ----------
  redes: [
    { nombre: "Facebook",  url: "#" },
    { nombre: "Instagram", url: "#" },
    { nombre: "TikTok",    url: "#" },
  ],
};
