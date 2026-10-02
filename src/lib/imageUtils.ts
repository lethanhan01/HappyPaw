export interface ImageValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate media file format and size
 * - Images: JPEG, PNG, WebP, GIF, HEIC/HEIF <= 10MB
 * - Videos: MP4, WebM, QuickTime (MOV) <= 50MB
 */
export function validateMediaFile(
  file: File,
  isVideo = false,
): ImageValidationResult {
  const maxImgSize = 10 * 1024 * 1024 // 10MB
  const maxVideoSize = 50 * 1024 * 1024 // 50MB
  const validImgTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif",
    "image/heic-sequence",
    "image/heif-sequence",
  ]
  const validVideoTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-m4v",
  ]

  if (isVideo) {
    if (!validVideoTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
      return {
        valid: false,
        error: "Chỉ hỗ trợ video định dạng MP4, WebM hoặc MOV.",
      }
    }
    if (file.size > maxVideoSize) {
      return {
        valid: false,
        error: "Dung lượng video không được vượt quá 50MB.",
      }
    }
  } else {
    const fileType = (file.type || "").toLowerCase()
    const isMatchedType = validImgTypes.includes(fileType)
    const isMatchedExt = !!file.name.match(/\.(jpg|jpeg|png|webp|gif|heic|heif)$/i)

    if (!isMatchedType && !isMatchedExt) {
      return {
        valid: false,
        error: "Chỉ hỗ trợ ảnh định dạng JPG, PNG, WebP, GIF hoặc HEIC (Apple).",
      }
    }
    if (file.size > maxImgSize) {
      return {
        valid: false,
        error: "Dung lượng ảnh không được vượt quá 10MB.",
      }
    }
  }
  return { valid: true }
}

/**
 * Check if a file is in Apple HEIC / HEIF format
 */
export function isHeicFile(file: File): boolean {
  const type = (file.type || "").toLowerCase()
  const name = file.name.toLowerCase()
  return (
    type === "image/heic" ||
    type === "image/heif" ||
    type === "image/heic-sequence" ||
    type === "image/heif-sequence" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  )
}

/**
 * Ensure an image file is in a web-compatible format (converting HEIC/HEIF to JPEG)
 */
export async function ensureWebCompatibleImage(file: File): Promise<File> {
  if (!isHeicFile(file)) return file

  try {
    const heic2anyModule = await import("heic2any")
    const heic2any = heic2anyModule.default || heic2anyModule
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    })

    const blob = Array.isArray(result) ? result[0] : result
    const newFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg")
    return new File([blob], newFileName, { type: "image/jpeg" })
  } catch (err) {
    console.warn("Lỗi chuyển đổi HEIC sang JPEG:", err)
    return file
  }
}

/**
 * Automatically compress an image client-side to Base64 Data URL (HD ~1280px, quality 0.82)
 * Preserves aspect ratio, reduces payload size to ~100KB-150KB for smooth memory & storage.
 */
export function compressImageToBase64(
  file: File,
  maxDim = 1280,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's a GIF, don't canvas-compress to preserve animation frames
    if (file.type === "image/gif" || file.name.endsWith(".gif")) {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
      return
    }

    // Use URL.createObjectURL for memory safety on iOS Safari / WebKit
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    const cleanUp = () => {
      try {
        URL.revokeObjectURL(objectUrl)
      } catch {
        // ignore
      }
    }

    const fallbackWithReader = () => {
      cleanUp()
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    }

    img.onload = () => {
      let { width, height } = img

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
      }

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        fallbackWithReader()
        return
      }

      try {
        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height)
        // Export as JPEG Data URL
        const dataUrl = canvas.toDataURL("image/jpeg", quality)
        cleanUp()
        resolve(dataUrl)
      } catch {
        fallbackWithReader()
      }
    }

    img.onerror = () => {
      fallbackWithReader()
    }

    img.src = objectUrl
  })
}

/**
 * Check if a URL or Data URI represents a video
 */
export function isVideoUrl(url?: string): boolean {
  if (!url) return false
  return (
    url.startsWith("data:video") ||
    /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) ||
    url.startsWith("blob:")
  )
}
