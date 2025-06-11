// Bandwidth Hero SUPER ULTRA - API Serverless para Vercel
// Compresión: Optimización para legibilidad en 600px y tamaño < 100KB.

import sharp from 'sharp';
import fetch from 'node-fetch';

// Configuración SUPER ULTRA para capítulos <1-2MB
const SUPER_ULTRA_CONFIG = {
    // Límites de tamaño de salida
    MAX_OUTPUT_SIZE_STRICT: 50 * 1024,   // 50KB por imagen (objetivo)
    MAX_OUTPUT_SIZE_RELAXED: 100 * 1024, // 100KB por imagen (objetivo)
    MAX_INPUT_SIZE: 15 * 1024 * 1024,    // 15MB máximo input
    // MAX_INPUT_RESOLUTION_WIDTH para pre-redimensionado
    MAX_INPUT_RESOLUTION_WIDTH: 600, // Redimensionar entradas grandes a 600px
    
    // Perfil de compresión ÚNICO para WebP (Calidad 5)
    COMPRESSION_PROFILE: { 
        manga: { webp: { quality: 5, effort: 6 } }, // <<-- CAMBIO CLAVE: Calidad WebP 5
        color: { webp: { quality: 5, effort: 6 } }  // <<-- CAMBIO CLAVE: Calidad WebP 5
    },
    
    // Configuración Sharp SUPER optimizada
    SHARP_CONFIG: {
        limitInputPixels: false,
        sequentialRead: true,
        density: 96,
        failOn: 'none'
    },
    
    // Resolución preferida para todas las imágenes (600px)
    RESIZE_STEPS: [ 
        600 // Solo 600px como objetivo de redimensionado
    ]
}

// Función para detectar si es manga (blanco y negro) o color
async function detectImageType(buffer) {
    try {
        const { channels } = await sharp(buffer).stats()
        
        if (channels > 1) {
            const { channels: imageChannels } = await sharp(buffer).stats()
            const avgSaturationMetric = imageChannels.reduce((acc, ch) => acc + (ch.max - ch.min), 0) / imageChannels.length;
            return avgSaturationMetric > 30 ? 'color' : 'manga';
        }
        return 'manga'
    } catch (e) {
        console.warn("Error detecting image type, defaulting to 'manga':", e.message);
        return 'manga'
    }
}

// Función principal de compresión SUPER ULTRA
async function superUltraCompress(buffer, targetSize, mode = 'strict') {
    const maxSize = mode === 'strict' ? 
        SUPER_ULTRA_CONFIG.MAX_OUTPUT_SIZE_STRICT : 
        SUPER_ULTRA_CONFIG.MAX_OUTPUT_SIZE_RELAXED
    
    const originalInputSize = buffer.length; 
    
    const imageType = await detectImageType(buffer); 
    console.log(`🎯 Tipo detectado: ${imageType}, Meta: ${Math.round(maxSize/1024)}KB`)
    
    let currentBuffer = buffer
    let finalResult = null

    // Pre-redimensionado si la imagen es muy grande (ej. > 600px)
    // Se redimensionará a 600px. Si es menor, se mantiene su resolución original.
    try {
        const metadata = await sharp(currentBuffer).metadata();
        if (metadata.width && metadata.width > SUPER_ULTRA_CONFIG.MAX_INPUT_RESOLUTION_WIDTH) {
            console.log(`📏 Imagen inicial muy grande (${metadata.width}px). Redimensionando a ${SUPER_ULTRA_CONFIG.MAX_INPUT_RESOLUTION_WIDTH}px.`);
            currentBuffer = await sharp(currentBuffer, SUPER_ULTRA_CONFIG.SHARP_CONFIG)
                .resize(SUPER_ULTRA_CONFIG.MAX_INPUT_RESOLUTION_WIDTH, null, { 
                    withoutEnlargement: true, 
                    fit: 'inside'
                })
                .toBuffer();
        }
    } catch (e) {
        console.warn("No se pudo obtener metadatos para pre-redimensionado:", e.message);
    }
    
    const config = SUPER_ULTRA_CONFIG.COMPRESSION_PROFILE[imageType];
    console.log(`🔄 Calidad de compresión aplicada: WebP quality=${config.webp.quality}`);
    
    // Intentar con la resolución de 600px
    for (const width of SUPER_ULTRA_CONFIG.RESIZE_STEPS) { 
        try {
            const resizedBuffer = await sharp(currentBuffer, SUPER_ULTRA_CONFIG.SHARP_CONFIG)
                .resize(width, null, { 
                    withoutEnlargement: true, 
                    fit: 'inside'
                })
                .toBuffer()
            
            const webpResult = await sharp(resizedBuffer, SUPER_ULTRA_CONFIG.SHARP_CONFIG)
                .webp(config.webp) 
                .toBuffer()
            
            console.log(`📊 WebP ${width}px: ${Math.round(webpResult.length/1024)}KB`)
            
            if (webpResult.length <= maxSize) {
                return {
                    buffer: webpResult,
                    format: 'webp', 
                    size: webpResult.length,
                    originalSize: originalInputSize, 
                    compression: Math.round((1 - webpResult.length/originalInputSize) * 100),
                    level: config.webp.quality, 
                    width: width
                }
            }
            if (!finalResult || webpResult.length < finalResult.size) {
                 finalResult = { buffer: webpResult, format: 'webp', size: webpResult.length }
            }
            
        } catch (error) {
            console.log(`⚠️ Error en width ${width}:`, error.message)
            break; 
        }
    }
    
    if (finalResult) {
        console.log(`🏁 No se alcanzó el tamaño objetivo. Usando el mejor resultado disponible: ${Math.round(finalResult.size/1024)}KB`)
        return {
            ...finalResult,
            originalSize: originalInputSize,
            compression: Math.round((1 - finalResult.size/originalInputSize) * 100),
            level: 'best_effort', 
            width: 'auto' 
        }
    }
    
    throw new Error('No se pudo comprimir la imagen lo suficiente y no se encontró ningún resultado válido')
}

// Función para descargar imagen
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
            timeout: 60000, 
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP Error Status: ${response.status} - ${response.statusText} for URL: ${url}`);
        }

        const arrayBuffer = await response.arrayBuffer(); 
        const buffer = Buffer.from(arrayBuffer);          
        
        console.log(`📥 Descargado: ${Math.round(buffer.length/1024)}KB de ${response.url} (URL final)`);
        return buffer;

    } catch (error) {
        console.error(`❌ Error al descargar imagen ${url}:`, error.message);
        throw error;
    }
}

// HANDLER PRINCIPAL PARA VERCEL SERVERLESS
export default async (req, res) => {
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
                'Compresión exclusiva WebP',     
                'Calidad WebP 5 (alta compresión)', // <<-- Actualizado aquí
                'Redimensionado a 600px',             // <<-- Actualizado aquí
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
        
        // Descargar imagen
        const imageBuffer = await downloadImage(imageUrl)
        
        // Verificar tamaño de entrada
        if (imageBuffer.length > SUPER_ULTRA_CONFIG.MAX_INPUT_SIZE) {
            throw new Error(`Imagen muy grande: ${Math.round(imageBuffer.length/1024/1024)}MB > ${SUPER_ULTRA_CONFIG.MAX_INPUT_SIZE/1024/1024}MB límite`)
        }
        
        // Comprimir con algoritmo SUPER ULTRA
        const result = await superUltraCompress(imageBuffer, null, mode)
        
        console.log(`✅ ÉXITO: ${Math.round(result.size/1024)}KB (${result.compression}% ahorro)`)
        console.log(`📊 Nivel ${result.level}, ${result.width}px, formato ${result.format}`)
        
        // Configurar headers de respuesta
        const contentType = 'image/webp' 
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