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

  function generarQR() {
    const valor = urlInput.value.trim();
    if (!valor) return;

    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
      text: valor,
      width: 220,
      height: 220,
      colorDark: "#0b1530",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    downloadBtn.disabled = false;
  }

  generateBtn.addEventListener("click", generarQR);
  urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") generarQR();
  });

  downloadBtn.addEventListener("click", () => {
    // qrcodejs dibuja el QR sobre un <canvas> dentro del contenedor
    const canvas = qrContainer.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "qr-jornada-coaching.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // Genera un QR de ejemplo al cargar la página, con el enlace precargado
  generarQR();
}
