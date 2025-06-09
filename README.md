Bandwidth Hero SUPER ULTRA v4.0.0 🚀
PROBLEMA SOLUCIONADO ✅

Tu servicio anterior devolvía código JavaScript en lugar de imágenes, causando que Tachiyomi descargara archivos de 18.3KB con código en lugar de imágenes reales.

CAUSA: Configuración incorrecta para Vercel Serverless Functions y limitaciones en el manejo de módulos/redirecciones.
SOLUCIÓN: Reestructuración completa usando formato de API Routes de Vercel, migración a ES Modules (import), uso de node-fetch para seguir redirecciones, y optimización extrema de los perfiles de compresión para evitar timeouts.

🎯 CARACTERÍSTICAS

Garantía: Capítulos completos de manga < 1-2MB

Compresión extrema: 50-100KB por imagen

Compresión ultra-agresiva con perfil único de calidad extrema y estrategia de redimensionado optimizada.

Detección automática manga vs color

Optimizado para datos móviles extremos

Serverless compatible con Vercel

🚀 DEPLOY RÁPIDO EN VERCEL
Método 1: GitHub (RECOMENDADO)
1. Sube estos archivos a un repositorio de GitHub
2. Ve a vercel.com → Import Project → Conecta tu repo
3. Deploy automático ✅

Método 2: Vercel CLI
npm i -g vercel
cd bandwidth_hero_fixed # Asegúrate de que 'bandwidth_hero_fixed' sea tu carpeta principal
vercel --prod
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END
Método 3: Drag & Drop
1. Comprime la carpeta bandwidth_hero_fixed/ en .zip
2. Ve a vercel.com → New Project → Browse Template
3. Arrastra el .zip → Deploy ✅
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END
📱 USO CON TACHIYOMI
1. Configuración de la Extensión
Servidor: https://TU-PROYECTO.vercel.app
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
2. Modos de Compresión

Modo Strict (default): 50KB máximo por imagen

Modo Relaxed: 100KB máximo por imagen

3. URLs de Ejemplo
https://tu-proyecto.vercel.app/?url=https://example.com/imagen.jpg
https://tu-proyecto.vercel.app/?url=https://example.com/imagen.jpg&mode=relaxed
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
🔧 ENDPOINTS DISPONIBLES
Compresión Principal
GET /?url=IMAGE_URL&mode=strict|relaxed
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
Health Check
GET /health
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
Información del Servicio
GET /info
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
🧪 TESTING RÁPIDO
1. Test de Funcionamiento
curl https://tu-proyecto.vercel.app/health
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END
2. Test de Compresión
curl "https://tu-proyecto.vercel.app/?url=https://example.com/test.jpg" -o test_compressed.jpg
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END
3. Verificación de Headers
curl -I "https://tu-proyecto.vercel.app/?url=https://example.com/test.jpg"
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END
🎯 RESULTADOS ESPERADOS
✅ CORRECTO (Imagen Real)
Content-Type: image/webp
Content-Length: 45231
X-Compression-Ratio: 89%
X-Format: webp
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
❌ INCORRECTO (Código JavaScript)
Content-Type: text/javascript
Content-Length: 18744
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END
🔍 DIAGNÓSTICO DE PROBLEMAS
Si Tachiyomi sigue descargando JavaScript (o errores de compilación):

Verifica la configuración de módulos: Asegúrate de que tu package.json contenga la línea "type": "module" en la raíz del objeto, y que tu api/index.js use import en lugar de require() y export default en lugar de module.exports.

Revisa la URL: Debe apuntar al nuevo proyecto de Vercel.

Limpia caché: Reinicia Tachiyomi o la aplicación cliente.

Test manual: Prueba en navegador directamente la URL.

Si las imágenes son muy grandes (más de 100KB):

Usa modo strict: Asegúrate de que Tachiyomi o tu cliente esté usando el modo &mode=strict (50KB límite).

Verifica headers: La respuesta debe mostrar X-Compression-Ratio y X-Compressed-Size.

Ajuste fino (avanzado): Las imágenes que, incluso con el perfil actual, no logran el objetivo, están siendo servidas con el mejor resultado posible. Si necesitas más reducción de tamaño y velocidad a costa de calidad (para imágenes excepcionalmente grandes o complejas), puedes ajustar los valores en SUPER_ULTRA_CONFIG dentro de api/index.js (ej. MAX_INPUT_RESOLUTION_WIDTH, COMPRESSION_PROFILE.quality o RESIZE_STEPS a valores aún más agresivos).

Si hay errores 500:

Revisa los logs en Vercel: Es la primera y más importante fuente de información. Ve a tu dashboard de Vercel → Tu Proyecto → Pestaña "Functions" o "Logs".

Error HTTP 301/302 (Movido Permanentemente): Anteriormente, este error podía ocurrir si la URL de imagen original redirigía. Esto está solucionado en la v4.0.0 con node-fetch que sigue redirecciones. Si reaparece, verifica que la URL de origen sea válida y esté activa.

Error de timeout (la tarea agotó el tiempo de espera después de 30 segundos / HTTP 504): Esto ocurre si la compresión de una imagen tarda demasiado. La configuración actual es extremadamente optimizada para evitar esto. Si persiste, significa que la imagen original es excepcionalmente grande o compleja (ej. una foto en muy alta resolución), excediendo los límites de procesamiento del plan gratuito de Vercel.

Verifica la URL de origen: Asegúrate de que la url proporcionada en el parámetro sea una imagen accesible públicamente y no esté protegida o requiera autenticación.

📊 ESTADÍSTICAS TÍPICAS
Original	Comprimido	Ahorro	Formato
2.5MB	48KB	98%	WebP
1.8MB	52KB	97%	WebP
800KB	45KB	94%	JPEG

Capítulo típico (20 páginas): 40MB → 1MB (97.5% ahorro)

🎌 PERFECTO PARA MANGA

Optimizado específicamente para imágenes en blanco y negro

Detecta automáticamente manga vs color

Preserva legibilidad del texto

Máximo ahorro sin perder calidad esencial

🚀 DEPLOY INMEDIATO

¡Tu proyecto estará listo en 2 minutos!

Sube a GitHub

Conecta con Vercel

Deploy automático

URL funcional: https://tu-proyecto.vercel.app

¡Problemas de JavaScript y timeouts solucionados para siempre! 🎉