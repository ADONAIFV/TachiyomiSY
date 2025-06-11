// Bandwidth Hero SUPER ULTRA - API Serverless para Vercel
// Compresión de alta calidad: Tamaños mayores para máxima fidelidad

import sharp from 'sharp';
import fetch from 'node-fetch';

// Configuración SUPER ULTRA para capítulos <1-2MB
const SUPER_ULTRA_CONFIG = {
    // Límites de tamaño de salida (se mantendrán, pero serán difíciles de alcanzar con calidad 100)
    MAX_OUTPUT_SIZE_STRICT: 50 * 1024,   // 50KB por imagen (Ahora un objetivo muy ambicioso)
    MAX_OUTPUT_SIZE_RELAXED: 120 * 1024, // 120KB por imagen (Ahora un objetivo ambicioso)
    MAX_INPUT_SIZE: 15 * 1024 * 1024,    // 15MB máximo input
    MAX_INPUT_RESOLUTION_WIDTH: 1200, // Máxima resolución de entrada para un pre-redimensionado
    
    // Perfil de compresión ÚNICO para WebP (CALIDAD 100 para ambos)
    COMPRESSION_PROFILE: { 
        manga: { webp: { quality: 100, effort: 6 } }, // <<-- CAMBIO CLAVE: Calidad WebP 100
        color: { webp: { quality: 100, effort: 6 } }  // <<-- CAMBIO CLAVE: Calidad WebP 100 para color también
    },
    
    // Configuración Sharp SUPER optimizada
    SHARP_CONFIG: {
        limitInputPixels: false,
        sequentialRead: true,
        density: 96,
        failOn: 'none'
    },
    
    // Redimensionado a resoluciones específicas
    RESIZE_STEPS: [ 
        450, // <<-- CAMBIO CLAVE: 450px
        400  // <<-- CAMBIO CLAVE: 400px
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
    // Los targets de tamaño se mantendrán, pero con calidad 100 será difícil alcanzarlos
    const maxSize = mode === 'strict' ? 
        SUPER_ULTRA_CONFIG.MAX_OUTPUT_SIZE_STRICT : 
        SUPER_ULTRA_CONFIG.MAX_OUTPUT_SIZE_RELAXED
    
    const originalInputSize = buffer.length; 
    
    const imageType = await detectImageType(buffer); 
    console.log(`🎯 Tipo detectado: ${imageType}, Meta: ${Math.round(maxSize/1024)}KB (objetivo, pero la calidad 100 lo superará)`)
    
    let currentBuffer = buffer
    let finalResult = null

    // Pre-redimensionado si la imagen es muy grande
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
    
    // Intentar cada paso de redimensionado
    for (const width of SUPER_ULTRA_CONFIG.RESIZE_STEPS) {
        try {
            const resizedBuffer = await sharp(currentBuffer, SUPER_ULTRA_CONFIG.SHARP_CONFIG)
                .resize(width, null, { 
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .toBuffer()
            
            // Siempre intentar WebP (ahora es el único formato)
            const webpResult = await sharp(resizedBuffer, SUPER_ULTRA_CONFIG.SHARP_CONFIG)
                .webp(config.webp) 
                .toBuffer()
            
            console.log(`📊 WebP ${width}px: ${Math.round(webpResult.length/1024)}KB`)
            
            // Si el resultado es igual o menor al tamaño objetivo (esto será raro con calidad 100)
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
            // Siempre guardar el mejor resultado (más pequeño) encontrado hasta ahora
            if (!finalResult || webpResult.length < finalResult.size) {
                 finalResult = { buffer: webpResult, format: 'webp', size: webpResult.length }
            }
            
        } catch (error) {
            console.log(`⚠️ Error en width ${width}:`, error.message)
            continue 
        }
    }
    
    if (finalResult) {
        console.log(`🏁 Calidad WebP 100 con ${finalResult.width}px. No se alcanzó el tamaño objetivo (${Math.round(maxSize/1024)}KB). Usando el mejor resultado disponible: ${Math.round(finalResult.size/1024)}KB`)
        return {
            ...finalResult,
            originalSize: originalInputSize,
            compression: Math.round((1 - finalResult.size/originalInputSize) * 100),
            level: 'quality_100_best_effort', // Indicando que se usó calidad 100 y se dio el mejor esfuerzo
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
            description: 'Compresión de alta calidad para manga. Los tamaños pueden superar los objetivos estándar.',
            features: [
                'Objetivo 50-120KB por imagen (la calidad alta puede superarlo)', 
                'Compresión exclusiva WebP',     
                'Calidad WebP 100 (casi sin pérdidas)',          // <<-- Actualizado aquí
                'Redimensionado a 450px/400px',  // <<-- Actualizado aquí
                'Detección automática manga/color',
                'Optimizado para la mejor calidad visual posible',
                'Garantía de capítulos completos (tamaño variable, alta calidad)'
            ],
            usage: {
                strict_mode: '/?url=IMAGE_URL (objetivo 50KB)',
                relaxed_mode: '/?url=IMAGE_URL&mode=relaxed (objetivo 120KB)', 
                headers: 'X-Super-Ultra-Compression para verificación'
            },
            compression_stats: {
                target_chapter_size: 'Variable (mayor que antes)', // <<-- Actualizado aquí
                target_per_image: 'Variable (mayor que antes)',    // <<-- Actualizado aquí
                typical_savings: 'Menor que antes, enfocado en calidad' // <<-- Actualizado aquí
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