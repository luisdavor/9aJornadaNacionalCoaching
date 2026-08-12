// Actualiza automáticamente el año en el footer
document.getElementById("year").textContent = new Date().getFullYear();

// Anima los elementos con clase "reveal" cuando entran en pantalla
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  // Si el navegador no soporta IntersectionObserver, se muestran directamente
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Generador de QR (solo actúa si la página tiene el contenedor #qrcode, ej. qr.html)
const qrContainer = document.getElementById("qrcode");

if (qrContainer && typeof QRCode !== "undefined") {
  const urlInput = document.getElementById("qr-url");
  const generateBtn = document.getElementById("qr-generate");
  const downloadBtn = document.getElementById("qr-download");

  let ultimaImagenQR = null; // dataURL de la última tarjeta generada, para el botón de descarga

  // Dibuja un rectángulo con esquinas redondeadas (helper de canvas)
  function trazarRectRedondeado(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // Genera el QR "en crudo" (fuera de pantalla) y lo compone en una tarjeta con
  // margen de seguridad, esquinas redondeadas y franja de colores de marca —
  // así la imagen descargada nunca sale cortada ni pegada al borde.
  function crearTarjetaQR(valor) {
    return new Promise((resolve) => {
      const temp = document.createElement("div");
      temp.style.position = "absolute";
      temp.style.left = "-9999px";
      document.body.appendChild(temp);

      new QRCode(temp, {
        text: valor,
        width: 260,
        height: 260,
        colorDark: "#0b1530",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      requestAnimationFrame(() => {
        const qrCanvas = temp.querySelector("canvas");
        const qrSize = qrCanvas.width;
        const margen = 34;
        const franjaAlto = 12;
        const espacioFranja = 22;

        const canvas = document.createElement("canvas");
        canvas.width = qrSize + margen * 2;
        canvas.height = qrSize + margen * 2 + espacioFranja + franjaAlto;
        const ctx = canvas.getContext("2d");

        // Tarjeta blanca con esquinas redondeadas
        trazarRectRedondeado(ctx, 0, 0, canvas.width, canvas.height, 24);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Borde sutil para que se distinga sobre fondos oscuros al compartir
        trazarRectRedondeado(ctx, 1, 1, canvas.width - 2, canvas.height - 2, 24);
        ctx.strokeStyle = "#e2e4ea";
        ctx.lineWidth = 2;
        ctx.stroke();

        // QR centrado, con margen de seguridad alrededor
        ctx.drawImage(qrCanvas, margen, margen, qrSize, qrSize);

        // Franja de colores de marca (igual a la del pie de página)
        const colores = ["#2f6fd6", "#1aa6a0", "#6fbf3f", "#f0812c"];
        const segmento = canvas.width / colores.length;
        const franjaY = margen + qrSize + espacioFranja;
        colores.forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.fillRect(i * segmento, franjaY, segmento, franjaAlto);
        });

        document.body.removeChild(temp);
        resolve(canvas.toDataURL("image/png"));
      });
    });
  }

  async function generarQR() {
    const valor = urlInput.value.trim();
    if (!valor) return;

    ultimaImagenQR = await crearTarjetaQR(valor);

    qrContainer.innerHTML = "";
    const img = document.createElement("img");
    img.src = ultimaImagenQR;
    img.alt = "Código QR generado";
    qrContainer.appendChild(img);

    downloadBtn.disabled = false;
  }

  generateBtn.addEventListener("click", generarQR);
  urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") generarQR();
  });

  downloadBtn.addEventListener("click", () => {
    if (!ultimaImagenQR) return;

    const link = document.createElement("a");
    link.download = "qr-jornada-coaching.png";
    link.href = ultimaImagenQR;
    link.click();
  });

  // Genera un QR de ejemplo al cargar la página, con el enlace precargado
  generarQR();
}

// Visor de imagen con zoom (lightbox): cualquier <img class="zoomable"> abre
// una vista ampliada con zoom por rueda del mouse, pellizco (pinch), arrastre
// y doble clic/doble toque.
const imagenesZoom = document.querySelectorAll("img.zoomable");

if (imagenesZoom.length) {
  const MIN_ESCALA = 1;
  const MAX_ESCALA = 5;
  const ESCALA_DOBLE_CLIC = 2.5;

  // Construye el visor una sola vez y se reutiliza para cualquier imagen
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <p class="lightbox__hint">Rueda del mouse o pellizco: zoom &middot; arrastra: mover &middot; doble clic: acercar</p>
    <button class="lightbox__close" aria-label="Cerrar">&times;</button>
    <div class="lightbox__stage">
      <img class="lightbox__img" alt="" />
    </div>
    <div class="lightbox__toolbar">
      <button class="lightbox__btn" data-accion="alejar" aria-label="Alejar">&minus;</button>
      <button class="lightbox__btn lightbox__btn--text" data-accion="reset">Restablecer</button>
      <button class="lightbox__btn" data-accion="acercar" aria-label="Acercar">+</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const stage = lightbox.querySelector(".lightbox__stage");
  const imgVisor = lightbox.querySelector(".lightbox__img");
  const btnCerrar = lightbox.querySelector(".lightbox__close");

  let escala = 1;
  let tx = 0;
  let ty = 0;
  const pointers = new Map(); // pointerId -> {x, y}
  let pinchDistanciaInicial = null;
  let pinchCentroide = null;

  function aplicarTransformacion() {
    imgVisor.style.transform = `translate(${tx}px, ${ty}px) scale(${escala})`;
  }

  function limitarEscala(valor) {
    return Math.min(MAX_ESCALA, Math.max(MIN_ESCALA, valor));
  }

  // Cambia la escala manteniendo fijo el punto (x, y) —relativo al centro del
  // stage— bajo el cursor, dedo o centroide del pellizco.
  function zoomHacia(nuevaEscala, x, y) {
    nuevaEscala = limitarEscala(nuevaEscala);
    const contenidoX = (x - tx) / escala;
    const contenidoY = (y - ty) / escala;
    tx = x - contenidoX * nuevaEscala;
    ty = y - contenidoY * nuevaEscala;
    escala = nuevaEscala;

    if (escala === MIN_ESCALA) {
      tx = 0;
      ty = 0;
    }

    aplicarTransformacion();
  }

  function puntoRelativoAlStage(clientX, clientY) {
    const rect = stage.getBoundingClientRect();
    return {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2,
    };
  }

  function abrirLightbox(src, alt) {
    imgVisor.src = src;
    imgVisor.alt = alt || "";
    escala = 1;
    tx = 0;
    ty = 0;
    aplicarTransformacion();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function cerrarLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    pointers.clear();
    pinchDistanciaInicial = null;
  }

  imagenesZoom.forEach((img) => {
    img.addEventListener("click", () => abrirLightbox(img.src, img.alt));
  });

  btnCerrar.addEventListener("click", cerrarLightbox);

  // Clic fuera de la imagen (en el fondo oscuro) cierra el visor
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === stage) {
      cerrarLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      cerrarLightbox();
    }
  });

  lightbox.querySelector(".lightbox__toolbar").addEventListener("click", (event) => {
    const accion = event.target.dataset.accion;
    if (!accion) return;

    if (accion === "acercar") zoomHacia(escala * 1.4, 0, 0);
    if (accion === "alejar") zoomHacia(escala / 1.4, 0, 0);
    if (accion === "reset") zoomHacia(1, 0, 0);
  });

  // Zoom con la rueda del mouse, centrado en la posición del cursor
  stage.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const punto = puntoRelativoAlStage(event.clientX, event.clientY);
      const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
      zoomHacia(escala * factor, punto.x, punto.y);
    },
    { passive: false }
  );

  // Doble clic / doble toque: alterna entre tamaño normal y acercado
  imgVisor.addEventListener("dblclick", (event) => {
    const punto = puntoRelativoAlStage(event.clientX, event.clientY);
    zoomHacia(escala > 1 ? 1 : ESCALA_DOBLE_CLIC, punto.x, punto.y);
  });

  // Arrastre (mouse o un dedo) y pellizco (dos dedos) usando Pointer Events,
  // que unifican mouse y touch en una sola API.
  imgVisor.addEventListener("pointerdown", (event) => {
    imgVisor.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 2) {
      const [p1, p2] = pointers.values();
      pinchDistanciaInicial = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      pinchCentroide = puntoRelativoAlStage((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    } else if (pointers.size === 1 && escala > 1) {
      imgVisor.classList.add("is-panning");
    }
  });

  imgVisor.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;
    const anterior = pointers.get(event.pointerId);
    const actual = { x: event.clientX, y: event.clientY };
    pointers.set(event.pointerId, actual);

    if (pointers.size === 2) {
      const [p1, p2] = pointers.values();
      const distancia = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const centroide = puntoRelativoAlStage((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);

      if (pinchDistanciaInicial) {
        zoomHacia(escala * (distancia / pinchDistanciaInicial), centroide.x, centroide.y);
      }
      pinchDistanciaInicial = distancia;
    } else if (pointers.size === 1 && escala > 1) {
      tx += actual.x - anterior.x;
      ty += actual.y - anterior.y;
      aplicarTransformacion();
    }
  });

  function soltarPuntero(event) {
    pointers.delete(event.pointerId);
    imgVisor.classList.remove("is-panning");
    if (pointers.size < 2) pinchDistanciaInicial = null;
  }

  imgVisor.addEventListener("pointerup", soltarPuntero);
  imgVisor.addEventListener("pointercancel", soltarPuntero);
}
