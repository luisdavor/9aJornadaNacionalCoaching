# Mi Proyecto

Plantilla base para un sitio estático publicado con **GitHub Pages**.

## Estructura

```
PageGithub/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── README.md
```

## Ver el resultado localmente (antes de subirlo)

Opción rápida: abre `index.html` directamente en el navegador (doble clic).

Opción recomendada (evita problemas de rutas): sirve la carpeta con un servidor local.

- Con Python:
  ```bash
  python -m http.server 8000
  ```
  Luego abre http://localhost:8000

- Con VS Code: extensión **Live Server** y clic en "Go Live".

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube estos archivos:
   ```bash
   git init
   git add .
   git commit -m "Sitio inicial"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
   git push -u origin main
   ```
2. En GitHub, ve a **Settings → Pages**.
3. En "Build and deployment", selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. Guarda. En un par de minutos tu sitio estará en:
   `https://<tu-usuario>.github.io/<tu-repo>/`

## Personalización

- Cambia textos y enlaces en [index.html](index.html).
- Ajusta colores y estilos en [css/styles.css](css/styles.css) (variables al inicio del archivo).
- Agrega interactividad en [js/script.js](js/script.js).
