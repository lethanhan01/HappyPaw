export interface ImageValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate media file format and size
 * - Images: JPEG, PNG, WebP, GIF <= 10MB
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
    if (!validImgTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      return {
        valid: false,
        error: "Chỉ hỗ trợ ảnh định dạng JPG, PNG, WebP hoặc GIF.",
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

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
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
          resolve(e.target?.result as string)
          return
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height)

        // Export as JPEG Data URL
        const dataUrl = canvas.toDataURL("image/jpeg", quality)
        resolve(dataUrl)
      }
      img.onerror = () => resolve(e.target?.result as string)
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
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
