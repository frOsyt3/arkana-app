/** Shrinks an image in the browser before upload so stored files stay small. */
export async function resizeImage(file: File, maxWidth = 1600) {
  const bitmap = await createImageBitmap(file)
  const { width: srcW, height: srcH } = bitmap

  // GIFs keep their animation, so they are uploaded as they are.
  if (file.type === "image/gif") {
    bitmap.close()
    return { file, width: srcW, height: srcH }
  }

  const scale = Math.min(1, maxWidth / srcW)
  const width = Math.round(srcW * scale)
  const height = Math.round(srcH * scale)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available in this browser.")
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.82))
  if (!blob) throw new Error("Could not process this image.")
  return { file: new File([blob], "image.webp", { type: "image/webp" }), width, height }
}
