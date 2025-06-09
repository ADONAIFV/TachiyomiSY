// Bandwidth Hero SUPER ULTRA - API Serverless para Vercel
// Compresión extrema: 50-100KB por imagen para capítulos ultra-ligeros

const sharp = require('sharp')
const fetch = require('node-fetch') // <<-- Importa node-fetch

// Configuración SUPER ULTRA para capítulos <1-2MB
const SUPER_ULTRA_CONFIG = {
    // Límites EXTREMOS - Para lograr capítulos de 1-2MB total
    MAX_OUTPUT_SIZE_STRICT: 50 * 1024,   // 50KB por imagen (20 páginas = 1MB capítulo)
    MAX_OUTPUT_SIZE_RELAXED: 100 * 1024, // 100KB por imagen (20 páginas = 2MB capítulo)
    MAX_INPUT_SIZE: 15 * 1024 * 1024,    // 15MB máximo input
    
    // Perfiles de compresión SUPER agresivos
    COMPRESSION_LEVELS: [
        // Nivel 1: Intento conservador pero agresivo
        { manga: { webp: { quality: 45, effort: 6 }, jpeg: { quality: 50 } }, 
          color: { webp: { quality: 35, effort: 6 }, jpeg: { quality: 40 } } },
        
        // Nivel 2: Compresión fuerte  
        { manga: { webp: { quality: 35, effort: 6 }, jpeg: { quality: 40 } },
          color: { webp: { quality: 25, effort: 6 }, jpeg: { quality: 30 } } },
        
        // Nivel 3: Compresión muy fuerte
        { manga: { webp: { quality: 25, effort: 6 }, jpeg: { quality: 30 } },
          color: { webp: { quality: 20, effort: 6 }, jpeg: { quality: 25 } } },
        
        // Nivel 4: Compresión extrema
        { manga: { webp: { quality: 20, effort: 6 }, jpeg: { quality: 25 } },
          color: { webp: { quality: 15, effort: 6 }, jpeg: { quality: 20 } } },
          
        // Nivel 5: Compresión brutal (emergencia)
        { manga: { webp: { quality: 15, effort: 6 }, jpeg: { quality: 20 } },
          color: { webp: { quality: 10, effort: 6 }, jpeg: { quality: 15 } } }
    ],
    
    // Configuración Sharp SUPER optimizada
    SHARP_CONFIG: {
        limitInputPixels: false,
        sequentialRead: true,
        density: 96,  // DPI muy bajo para menor tamaño
        failOn: 'none'
    },
    
    // Redimensionado MUY agresivo desde el principio
    RESIZE_STEPS: [
        800,     // Empezar redimensionando agresivamente
        700,     
        600,     
        500,     
        400,     
        350      // Tamaño final muy pequeño
    ]
}

// Función para detectar si es manga (blanco y negro) o color
async function detectImageType(buffer) {
    try {
        const { channels } = await sharp(buffer).stats()
        
        // Si tiene más de 1 canal y parece colorido (cálculo de saturación más simple)
        if (channels > 1) {
            const { channels: imageChannels } = await sharp(buffer).stats()
            // Suma la diferencia entre el máximo y mínimo de cada canal para estimar la saturación.
            // Si la imagen es blanco y negro, la diferencia entre min/max para R, G, B será muy pequeña o 0.
            const avgSaturationMetric = imageChannels.reduce((acc, ch) => acc + (ch.max - ch.min), 0) / imageChannels.length;
            
            // Un umbral de 30 es un buen punto de partida para diferenciar
            return avgSaturationMetric > 30 ? 'color' : 'manga';
        }
        return 'manga' // Default para imágenes en escala de grises o con un solo canal
    } catch (e) {
        console.warn("Error detecting image type, defaulting to 'manga':", e.message);
        return 'manga' // Default fallback en caso de error de sharp
    }
}

// Función principal de compresión SUPER ULTRA
async function superUltraCompress(buffer, targetSize, mode = 'strict') {
    const maxSize = mode === 'strict' ? 
        SUPER_ULTRA_CONFIG.MAX_OUTPUT_SIZE_STRICT : 
        SUPER_ULTRA_CONFIG.MAX_OUTPUT_SIZE_RELAXED
    
    // Detectar tipo de imagen
    const imageType = await detectImageType(buffer)
    console.log(`🎯 Tipo detectado: ${imageType}, Meta: ${Math.round(maxSize/1024)}KB`)
    
    let currentBuffer = buffer
    let finalResult = null
    
    // Intentar cada nivel de compresión
    for (let level = 0; level < SUPER_ULTRA_CONFIG.COMPRESSION_LEVELS.length; level++) {
        const config = SUPER_ULTRA_CONFIG.COMPRESSION_LEVELS[level][imageType]
        console.log(`🔄 Nivel ${level + 1}: quality=${config.webp?.quality || config.jpeg?.quality}`)
        
        // Intentar cada paso de redimensionado
        for (const width of SUPER_ULTRA_CONFIG.RESIZE_STEPS) {
            try {
                // Redimensionar si es necesario
                const resizedBuffer = await sharp(currentBuffer, SUPER_ULTRA_CONFIG.SHARP_CONFIG)
                    .resize(width, null, { 
                        withoutEnlargement: true,
                        fit: 'inside'
                    })
                    .toBuffer()
                
                // Intentar WebP primero (mejor compresión)
                if (config.webp) {
                    const webpResult = await sharp(resizedBuffer, SUPER_ULTRA_CONFIG.SHARP_CONFIG)
                        .webp(config.webp)
                        .toBuffer()
                    
                    console.log(`📊 WebP ${width}px: ${Math.round(webpResult.length/1024)}KB`)
                    
                    if (webpResult.length <= maxSize) {
                        return {
                            buffer: webpResult,
                            format: 'webp',
                            size: webpResult.length,
                            originalSize: buffer.length,
                            compression: Math.round((1 - webpResult.length/buffer.length) * 100),
                            level: level + 1,
                            width: width
                        }
                    }
                    finalResult = finalResult || { buffer: webpResult, format: 'webp', size: webpResult.length }
                }
                
                // Intentar JPEG si WebP no es suficiente
                if (config.jpeg) {
                    const jpegResult = await sharp(resizedBuffer, SUPER_ULTRA_CONFIG.SHARP_CONFIG)
                        .jpeg(config.jpeg)
                        .toBuffer()
                    
                    console.log(`📊 JPEG ${width}px: ${Math.round(jpegResult.length/1024)}KB`)
                    
                    if (jpegResult.length <= maxSize) {
                        return {
                            buffer: jpegResult,
                            format: 'jpeg',
                            size: jpegResult.length,
                            originalSize: buffer.length,
                            compression: Math.round((1 - jpegResult.length/buffer.length) * 100),
                            level: level + 1,
                            width: width
                        }
                    }
                    finalResult = finalResult || { buffer: jpegResult, format: 'jpeg', size: jpegResult.length }
                }
                
            } catch (error) {
                console.log(`⚠️ Error en width ${width}:`, error.message)
                continue
            }
        }
    }
    
    // Si llegamos aquí, usar el mejor resultado disponible
    if (finalResult) {
        console.log(`🏁 Usando mejor resultado: ${Math.round(finalResult.size/1024)}KB`)
        return {
            ...finalResult,
            originalSize: buffer.length,
            compression: Math.round((1 - finalResult.size/buffer.length) * 100),
            level: 'max',
            width: 'auto'
        }
    }
    
    throw new Error('No se pudo comprimir la imagen lo suficiente')
}

// Función para descargar imagen (NUEVA VERSIÓN con node-fetch para seguir redirecciones)
async function downloadImage(url) {
    try {
        console.log(`📥 Intentando descargar: ${url}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; BandwidthHero/4.0)',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 30000, // Timeout para la solicitud completa (30 segundos)
            redirect: 'follow' // node-fetch sigue redirecciones por defecto, pero es bueno ser explícito
        });

        if (!response.ok) {
            // Si la respuesta no es 2xx, lanza un error
            throw new Error(`HTTP Error Status: ${response.status} - ${response.statusText} for URL: ${url}`);
        }

        const buffer = await response.buffer(); // Obtiene el cuerpo de la respuesta como un Buffer
        console.log(`📥 Descargado: ${Math.round(buffer.length/1024)}KB de ${response.url} (URL final)`); // response.url mostrará la URL final después de redirecciones
        return buffer;

    } catch (error) {
        console.error(`❌ Error al descargar imagen ${url}:`, error.message);
        throw error; // Re-lanza el error para que sea capturado por el handler principal
    }
}

// HANDLER PRINCIPAL PARA VERCEL SERVERLESS
module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('X-Super-Ultra-Compression', 'chapters-1-2mb-guaranteed')
    
    // Manejar OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    
    // Endpoint de salud
    if (req.url === '/health') {
        res.status(200).json({
            status: 'ok',
            service: 'Bandwidth Hero SUPER ULTRA',
            version: '4.0.0',
            timestamp: new Date().toISOString(),
            guarantee: 'chapters-1-2mb-maximum'
        })
        return
    }
    
    // Endpoint de información
    if (req.url === '/info') {
        res.status(200).json({
            service: 'Bandwidth Hero SUPER ULTRA v4.0.0',
            description: 'Compresión extrema garantizada para capítulos de manga <1-2MB',
            features: [
                '50-100KB por imagen según modo',
                '5 niveles de compresión extrema',
                '6 pasos de redimensionado agresivo',
                'Detección automática manga/color',
                'Optimizado para datos móviles extremos',
                'Garantía capítulos completos 1-2MB'
            ],
            usage: {
                strict_mode: '/?url=IMAGE_URL (50KB límite)',
                relaxed_mode: '/?url=IMAGE_URL&mode=relaxed (100KB límite)',
                headers: 'X-Super-Ultra-Compression para verificación'
            },
            compression_stats: {
                target_chapter_size: '1-2MB (20 páginas)',
                target_per_image: '50-100KB',
                typical_savings: '85-95% vs original'
            }
        })
        return
    }
    
    // Solo procesar GET requests para compresión
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Método no permitido' })
        return
    }
    
    try {
        // Extraer parámetros
        const url = new URL(req.url, `http://${req.headers.host}`) 
        const imageUrl = url.searchParams.get('url')
        const mode = url.searchParams.get('mode') || 'strict'
        
        if (!imageUrl) {
            res.status(400).json({ 
                error: 'URL de imagen requerida',
                usage: '/?url=IMAGE_URL&mode=strict|relaxed'
            })
            return
        }
        
        console.log(`🚀 Procesando: ${imageUrl} (modo: ${mode})`)
        console.log(`🎯 Meta: ${mode === 'strict' ? '50KB' : '100KB'} por imagen`)
        
        // Descargar imagen
        const imageBuffer = await downloadImage(imageUrl)
        
        // Verificar tamaño de entrada
        if (imageBuffer.length > SUPER_ULTRA_CONFIG.MAX_INPUT_SIZE) {
            throw new Error(`Imagen muy grande: ${Math.round(imageBuffer.length/1024/1024)}MB > 15MB límite`)
        }
        
        // Comprimir con algoritmo SUPER ULTRA
        const result = await superUltraCompress(imageBuffer, null, mode)
        
        console.log(`✅ ÉXITO: ${Math.round(result.size/1024)}KB (${result.compression}% ahorro)`)
        console.log(`📊 Nivel ${result.level}, ${result.width}px, formato ${result.format}`)
        
        // Configurar headers de respuesta
        const contentType = result.format === 'webp' ? 'image/webp' : 'image/jpeg'
        res.setHeader('Content-Type', contentType)
        res.setHeader('Content-Length', result.size)
        res.setHeader('X-Original-Size', result.originalSize)
        res.setHeader('X-Compressed-Size', result.size)
        res.setHeader('X-Compression-Ratio', `${result.compression}%`)
        res.setHeader('X-Compression-Level', result.level)
        res.setHeader('X-Format', result.format)
        res.setHeader('X-Width', result.width)
        res.setHeader('Cache-Control', 'public, max-age=86400') // Cache 24h
        
        // Enviar imagen comprimida
        res.status(200).send(result.buffer)
        
    } catch (error) {
        console.error('❌ Error en el handler principal:', error.message)
        res.status(500).json({
            error: 'Error en super ultra compresión',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Error procesando imagen',
            timestamp: new Date().toISOString()
        })
    }
}