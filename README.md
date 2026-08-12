# 9ª Jornada Nacional de Coaching

Sitio web de la 9ª Jornada Nacional de Coaching — "Coaching en acción: el poder de
la pausa en la era digital". Organizado por la Asociación de Coaches Certificados
- Bolivia (Santa Cruz), publicado con **GitHub Pages**.

🔗 **Sitio publicado:** https://luisdavor.github.io/9aJornadaNacionalCoaching/

## Estructura

```
PageGithub/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── img/
│   ├── logo-jornada.png   ← logo "9na Jornada Nacional de Coaching"
│   ├── logo-accb.png      ← logo Asociación de Coaches Certificados - Bolivia
│   ├── logo-cdf.png       ← (pendiente) Coaching & Development Foundation
│   └── logo-upb.png       ← (pendiente) UPB
└── README.md
```

## Ver el resultado localmente (antes de subir cambios)

Opción rápida: abre `index.html` directamente en el navegador (doble clic).

Opción recomendada (evita problemas de rutas con `img/` y `css/`): sirve la carpeta
con un servidor local.

- Con Python (usa `py` si `python` no está en el PATH):
  ```bash
  py -m http.server 8000
  ```
  Luego abre http://localhost:8000

- Con VS Code: extensión **Live Server** y clic en "Go Live".

## Cómo actualizar el sitio publicado

El repositorio remoto es `https://github.com/luisdavor/9aJornadaNacionalCoaching`,
con GitHub Pages configurado para publicar desde la rama `main`, carpeta raíz
(`Settings → Pages → Deploy from a branch → main → /root`).

Cada vez que quieras publicar un cambio:

```bash
cd "c:\Users\ldlimachi\Desktop\ProyPython\PageGithub"
git add .
git commit -m "Describe aquí el cambio"
git push
```

Te pedirá iniciar sesión con tu cuenta de GitHub la primera vez (navegador o
Git Credential Manager). El despliegue tarda 1-2 minutos en reflejarse; puedes
ver el progreso en la pestaña **Actions** del repositorio en GitHub.

Una vez terminado, los cambios se ven en:
👉 https://luisdavor.github.io/9aJornadaNacionalCoaching/

### Si es la primera vez que configuras el repo en una máquina nueva

```bash
git init
git remote add origin https://github.com/luisdavor/9aJornadaNacionalCoaching.git
git fetch origin
git checkout main
```

## Personalización

- Textos, fecha, lugar y enlaces: [index.html](index.html)
- Colores y estilos (variables al inicio del archivo): [css/styles.css](css/styles.css)
- Interactividad: [js/script.js](js/script.js)
- Logos e imágenes: carpeta `img/` — reemplaza los archivos manteniendo el mismo
  nombre para que el sitio los recoja automáticamente.

### Pendientes de contenido

- [ ] Agregar logo de **Coaching & Development Foundation** (`img/logo-cdf.png`)
- [ ] Agregar logo de **UPB** (`img/logo-upb.png`)
- [x] Enlace real de Facebook agregado
- [ ] Confirmar enlace real de LinkedIn (actualmente `href="#"`)
- [ ] Foto de fondo del hero (opcional, actualmente es un fondo con degradado)
