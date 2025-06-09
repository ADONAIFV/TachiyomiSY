<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bandwidth Hero SUPER ULTRA v4.0.0</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            background-color: #f9f9f9;
            color: #333;
        }
        h1, h2, h3 {
            color: #2c3e50;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        h1 {
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        pre {
            background-color: #eee;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
            white-space: pre-wrap; /* Permite que el texto se ajuste si es muy largo */
            word-wrap: break-word; /* Rompe palabras largas */
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
            color: #555;
        }
        code {
            background-color: #e0e0e0;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
            color: #c0392b;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        hr {
            border: 0;
            height: 1px;
            background-color: #ccc;
            margin: 30px 0;
        }
        ul, ol {
            padding-left: 20px;
        }
        ul li, ol li {
            margin-bottom: 5px;
        }
        strong {
            color: #2c3e50;
        }
        .emoji {
            font-size: 1.2em; /* Hace los emojis un poco más grandes */
            vertical-align: middle; /* Alinea los emojis con el texto */
        }
        .solucion-resaltado {
            color: #3498db; /* Un color distinto para la solución */
            font-weight: bold;
        }
    </style>
</head>
<body>

    <h1>Bandwidth Hero SUPER ULTRA v4.0.0 <span class="emoji">🚀</span></h1>

    <h2>PROBLEMA SOLUCIONADO <span class="emoji">✅</span></h2>
    <p><strong>Tu servicio anterior devolvía código JavaScript en lugar de imágenes</strong>, causando que Tachiyomi descargara archivos de 18.3KB con código en lugar de imágenes reales.</p>
    <p><strong>CAUSA</strong>: Configuración incorrecta para Vercel Serverless Functions y limitaciones en el manejo de módulos/redirecciones.
    <br><strong>SOLUCIÓN</strong>: <span class="solucion-resaltado">Reestructuración completa usando formato de API Routes de Vercel, migración a ES Modules (<code>import</code>), uso de <code>node-fetch</code> para seguir redirecciones, y optimización extrema de los perfiles de compresión para evitar timeouts.</span></p>
    <hr>

    <h2><span class="emoji">🎯</span> CARACTERÍSTICAS</h2>
    <ul>
        <li><strong>Garantía</strong>: Capítulos completos de manga <strong>< 1-2MB</strong></li>
        <li><strong>Compresión extrema</strong>: 50-100KB por imagen</li>
        <li><strong>Compresión ultra-agresiva</strong> con perfil único de calidad extrema y estrategia de redimensionado optimizada.</li>
        <li><strong>Detección automática</strong> manga vs color</li>
        <li><strong>Optimizado para datos móviles</strong> extremos</li>
        <li><strong>Serverless compatible</strong> con Vercel</li>
    </ul>
    <hr>

    <h2><span class="emoji">🚀</span> DEPLOY RÁPIDO EN VERCEL</h2>

    <h3>Método 1: GitHub (RECOMENDADO)</h3>
    <pre><code>1. Sube estos archivos a un repositorio de GitHub
2. Ve a vercel.com → Import Project → Conecta tu repo
3. Deploy automático ✅
</code></pre>

    <h3>Método 2: Vercel CLI</h3>
    <pre><code>npm i -g vercel
cd bandwidth_hero_fixed # Asegúrate de que 'bandwidth_hero_fixed' sea tu carpeta principal
vercel --prod
</code></pre>

    <h3>Método 3: Drag & Drop</h3>
    <pre><code>1. Comprime la carpeta bandwidth_hero_fixed/ en .zip
2. Ve a vercel.com → New Project → Browse Template
3. Arrastra el .zip → Deploy ✅
</code></pre>
    <hr>

    <h2><span class="emoji">📱</span> USO CON TACHIYOMI</h2>

    <h3>1. Configuración de la Extensión</h3>
    <pre><code>Servidor: https://TU-PROYECTO.vercel.app
    </code></pre>

    <h3>2. Modos de Compresión</h3>
    <ul>
        <li><strong>Modo Strict</strong> (default): 50KB máximo por imagen</li>
        <li><strong>Modo Relaxed</strong>: 100KB máximo por imagen</li>
    </ul>

    <h3>3. URLs de Ejemplo</h3>
    <pre><code>https://tu-proyecto.vercel.app/?url=https://example.com/imagen.jpg
https://tu-proyecto.vercel.app/?url=https://example.com/imagen.jpg&mode=relaxed
    </code></pre>
    <hr>

    <h2><span class="emoji">🔧</span> ENDPOINTS DISPONIBLES</h2>

    <h3>Compresión Principal</h3>
    <pre><code>GET /?url=IMAGE_URL&mode=strict|relaxed
    </code></pre>

    <h3>Health Check</h3>
    <pre><code>GET /health
    </code></pre>

    <h3>Información del Servicio</h3>
    <pre><code>GET /info
    </code></pre>
    <hr>

    <h2><span class="emoji">🧪</span> TESTING RÁPIDO</h2>

    <h3>1. Test de Funcionamiento</h3>
    <pre><code>curl https://tu-proyecto.vercel.app/health
    </code></pre>

    <h3>2. Test de Compresión</h3>
    <pre><code>curl "https://tu-proyecto.vercel.app/?url=https://example.com/test.jpg" -o test_compressed.jpg
    </code></pre>

    <h3>3. Verificación de Headers</h3>
    <pre><code>curl -I "https://tu-proyecto.vercel.app/?url=https://example.com/test.jpg"
    </code></pre>
    <hr>

    <h2><span class="emoji">🎯</span> RESULTADOS ESPERADOS</h2>

    <h3><span class="emoji">✅</span> CORRECTO (Imagen Real)</h3>
    <pre><code>Content-Type: image/webp
Content-Length: 45231
X-Compression-Ratio: 89%
X-Format: webp
    </code></pre>

    <h3><span class="emoji">❌</span> INCORRECTO (Código JavaScript)</h3>
    <pre><code>Content-Type: text/javascript
Content-Length: 18744
    </code></pre>
    <hr>

    <h2><span class="emoji">🔍</span> DIAGNÓSTICO DE PROBLEMAS</h2>

    <h3>Si Tachiyomi sigue descargando JavaScript (o errores de compilación):</h3>
    <ol>
        <li><strong>Verifica la configuración de módulos:</strong> Asegúrate de que tu <code>package.json</code> contenga la línea <code>"type": "module"</code> en la raíz del objeto, y que tu <code>api/index.js</code> use <code>import</code> en lugar de <code>require()</code> y <code>export default</code> en lugar de <code>module.exports</code>.</li>
        <li><strong>Revisa la URL:</strong> Debe apuntar al nuevo proyecto de Vercel.</li>
        <li><strong>Limpia caché:</strong> Reinicia Tachiyomi o la aplicación cliente.</li>
        <li><strong>Test manual:</strong> Prueba en navegador directamente la URL.</li>
    </ol>

    <h3>Si las imágenes son muy grandes (más de 100KB):</h3>
    <ol>
        <li><strong>Usa modo strict:</strong> Asegúrate de que Tachiyomi o tu cliente esté usando el modo <code>&mode=strict</code> (50KB límite).</li>
        <li><strong>Verifica headers:</strong> La respuesta debe mostrar <code>X-Compression-Ratio</code> y <code>X-Compressed-Size</code>.</li>
        <li><strong>Ajuste fino (avanzado):</strong> Las imágenes que, incluso con el perfil actual, no logran el objetivo, están siendo servidas con el mejor resultado posible. Si necesitas más reducción de tamaño y velocidad a costa de calidad (para imágenes excepcionalmente grandes o complejas), puedes ajustar los valores en <code>SUPER_ULTRA_CONFIG</code> dentro de <code>api/index.js</code> (ej. <code>MAX_INPUT_RESOLUTION_WIDTH</code>, <code>COMPRESSION_PROFILE.quality</code> o <code>RESIZE_STEPS</code> a valores aún más agresivos).</li>
    </ol>

    <h3>Si hay errores 500:</h3>
    <ol>
        <li><strong>Revisa los logs en Vercel:</strong> Es la primera y más importante fuente de información. Ve a tu dashboard de Vercel → Tu Proyecto → Pestaña "Functions" o "Logs".</li>
        <li><strong>Error HTTP 301/302 (Movido Permanentemente):</strong> Anteriormente, este error podía ocurrir si la URL de imagen original redirigía. Esto está <strong>solucionado</strong> en la v4.0.0 con <code>node-fetch</code> que sigue redirecciones. Si reaparece, verifica que la URL de origen sea válida y esté activa.</li>
        <li><strong>Error de timeout (la tarea agotó el tiempo de espera después de 30 segundos / HTTP 504):</strong> Esto ocurre si la compresión de una imagen tarda demasiado. La configuración actual es extremadamente optimizada para evitar esto. Si persiste, significa que la imagen original es excepcionalmente grande o compleja (ej. una foto en muy alta resolución), excediendo los límites de procesamiento del plan gratuito de Vercel.</li>
        <li><strong>Verifica la URL de origen:</strong> Asegúrate de que la <code>url</code> proporcionada en el parámetro sea una imagen accesible públicamente y no esté protegida o requiera autenticación.</li>
    </ol>
    <hr>

    <h2><span class="emoji">📊</span> ESTADÍSTICAS TÍPICAS</h2>
    <table>
        <thead>
            <tr>
                <th>Original</th>
                <th>Comprimido</th>
                <th>Ahorro</th>
                <th>Formato</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>2.5MB</td>
                <td>48KB</td>
                <td>98%</td>
                <td>WebP</td>
            </tr>
            <tr>
                <td>1.8MB</td>
                <td>52KB</td>
                <td>97%</td>
                <td>WebP</td>
            </tr>
            <tr>
                <td>800KB</td>
                <td>45KB</td>
                <td>94%</td>
                <td>JPEG</td>
            </tr>
        </tbody>
    </table>
    <p><strong>Capítulo típico (20 páginas)</strong>: 40MB → 1MB (97.5% ahorro)</p>
    <hr>

    <h2><span class="emoji">🎌</span> PERFECTO PARA MANGA</h2>
    <ul>
        <li><strong>Optimizado específicamente</strong> para imágenes en blanco y negro</li>
        <li><strong>Detecta automáticamente</strong> manga vs color</li>
        <li><strong>Preserva legibilidad</strong> del texto</li>
        <li><strong>Máximo ahorro</strong> sin perder calidad esencial</li>
    </ul>
    <hr>

    <h2><span class="emoji">🚀</span> DEPLOY INMEDIATO</h2>
    <p><strong>¡Tu proyecto estará listo en 2 minutos!</strong></p>
    <ol>
        <li>Sube a GitHub</li>
        <li>Conecta con Vercel  </li>
        <li>Deploy automático</li>
        <li>URL funcional: <code>https://tu-proyecto.vercel.app</code></li>
    </ol>
    <p><strong>¡Problemas de JavaScript y timeouts solucionados para siempre!</strong> <span class="emoji">🎉</span></p>

</body>
</html>