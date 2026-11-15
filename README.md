# Quinta Amaranto · Rose Gold V3 (Oaxaca)

Sitio de demostración hecho con HTML, CSS y JavaScript, con portada cinematográfica inspirada en sitios inmersivos y una composición de **fotografías en perspectiva 3D** que sustituye la escultura de anillos de la versión anterior.

## Cómo abrir

Abre `index.html` con la extensión **Live Server** de VS Code o con cualquier servidor HTTP estático. No requiere base de datos ni cuenta de pago. Tipografías opcionales se descargan desde Google Fonts; con Internet desconectado se aplican tipografías de sistema.

## Estructura

- `index.html`: estructura de la web y textos.
- `css/style.css`: estilos anteriores, layout y responsividad.
- `css/portal.css`: estilos base de la portada interactiva.
- `css/rose-gold.css`: **paleta nueva** y diseño del collage 3D. Edita este archivo para cambiar la identidad.
- `css/animations.css`: entrada, scroll y transiciones.
- `js/portal.js`: portada, efecto de iluminación del cursor y botón de entrada.
- `js/photos-3d.js`: desplazamiento de tarjetas de fotos en perspectiva, sin WebGL ni Three.js.
- `js/main.js`: menú y scroll.
- `js/gallery.js`: carrusel 3D.
- `assets/img/`: imagen facilitada por el usuario y recortes optimizados en WebP.
- `assets/video/luces-ambientales.mp4`: video **abstracto de luces decorativas**, no corresponde al recinto.

## Paleta (proporcionada por el usuario)

- Soft Nude: `#F2E4DA`
- Mocha Taupe: `#5E4B42`
- Rose Gold: `#B87866`
- Complementos: crema `#FFF8F4`, chocolate `#3C2D29`, blush `#EFD0C6`, latte `#D9B9A9`.

## Fotografía / publicación

**La foto original fue aportada en la conversación** (`quinta-amaranto-original.jpg`). En esta versión todas las imágenes locales del recinto son **recortes de ESA MISMA fotografía** (no son nuevas tomas); se ofrecen para demostrar profundidad en las tarjetas y dejar el sitio funcional sin conexión a bancos de imágenes. Sustituye con fotografías y videos distintos, de calidad y autorizados por el salón antes de la publicación final.

Para cambiar las fotos del collage, actualiza `src` de `.hero-frame` en `index.html`; para sustituir el fondo de bienvenida cambia `.portal-photo` dentro de `css/rose-gold.css`. Los enlaces de contacto y datos del negocio deben confirmarse directamente con Quinta Amaranto antes del lanzamiento.

## Notas

No incluye lógica de agendado: los CTA llevan a teléfono y WhatsApp preconfigurados heredados del demo anterior, y conviene verificarlos. Fotos de los cuadros se pueden sustituir sin modificar el script. Se respeta `prefers-reduced-motion`.

## Cambio nuevo V3.1: foto de fondo después de bienvenida

La primera pantalla interactiva conserva su fotografía. Al pulsar «Entrar a la experiencia» se muestra el fondo nuevo en la sección de «El arte de celebrar», detrás de las letras y las fotografías flotantes.

Para cambiar la fotografía de esa segunda pantalla, sustituye el archivo `assets/img/fondo-salon.jpg` por tu propia imagen con el mismo nombre, o cambia su ruta en el bloque final de `css/rose-gold.css`, donde figura `.hero-photo`. Se recomienda una fotografía horizontal de al menos 1920 píxeles de ancho.

La imagen de fondo actual reutiliza la imagen original facilitada por el usuario. Para hacerla más o menos visible, ajusta `opacity` dentro de `.hero-photo` y los grados de transparencia de `.hero-shade`.
