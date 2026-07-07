import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { requireAdminUser } from '@/lib/auth'
import { STORAGE } from '@/lib/constants'

/**
 * POST /api/thumbnail
 *
 * Recibe una imagen desde Supabase Storage (original),
 * genera un thumbnail 600px y lo sube al mismo bucket
 * en la carpeta portfolio/thumbnails/.
 *
 * Body: { originalPath: string }
 * Returns: { thumbnailUrl: string }
 */
export async function POST(req: NextRequest) {
  try {
    await requireAdminUser()

    const { originalPath } = await req.json()
    if (!originalPath) {
      return NextResponse.json({ error: 'originalPath requerido' }, { status: 400 })
    }

    const supabase = await createAdminSupabaseClient()

    // 1. Descargar la imagen original desde Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(STORAGE.bucket)
      .download(originalPath)

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'No se pudo descargar la imagen original' }, { status: 500 })
    }

    // 2. Convertir Blob a Buffer
    const arrayBuffer = await fileData.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    // 3. Generar thumbnail con Sharp
    // - 600px de ancho máximo (mantiene proporción)
    // - WebP para máxima compresión
    // - Calidad 80 (balance entre tamaño y calidad visual)
    const thumbnailBuffer = await sharp(inputBuffer)
      .resize(600, 600, {
        fit:                'inside',   // mantiene proporción sin recortar
        withoutEnlargement: true,       // no ampliar si es más pequeña
      })
      .webp({ quality: 80 })
      .toBuffer()

    // 4. Subir el thumbnail a /portfolio/thumbnails/
    const fileName      = originalPath.split('/').pop() ?? 'thumb.jpg'
    const thumbFileName = fileName.replace(/\.[^.]+$/, '.webp')
    const thumbnailPath = `${STORAGE.folders.thumbnails}/${thumbFileName}`

    const { error: uploadError } = await supabase.storage
      .from(STORAGE.bucket)
      .upload(thumbnailPath, thumbnailBuffer, {
        contentType:  'image/webp',
        cacheControl: '31536000',  // 1 año de caché
        upsert:       true,
      })

    if (uploadError) {
      return NextResponse.json({ error: 'Error al subir thumbnail' }, { status: 500 })
    }

    // 5. Construir URL pública del thumbnail
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
    const thumbnailUrl = `${supabaseUrl}/storage/v1/object/public/${STORAGE.bucket}/${thumbnailPath}`

    return NextResponse.json({ thumbnailUrl, thumbnailPath })

  } catch (error) {
    console.error('Thumbnail error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
