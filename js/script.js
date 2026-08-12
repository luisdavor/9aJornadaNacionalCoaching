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
