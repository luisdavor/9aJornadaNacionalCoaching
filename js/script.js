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
