import Jimp from "jimp"

const xGap = 50
const yGap = 30
const maxOriginalSize = 600
const borderPadding = 10

export default async (
  originalImagePath: string,
  header?: string,
  footer?: string,
  resizeOriginal = true
) => {

  const headerFont = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE)
  const footerFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)

  const originalImage = await Jimp.read(originalImagePath)
  if (resizeOriginal) {
    originalImage.resize(maxOriginalSize, maxOriginalSize)
  }

  const originalWidth = originalImage.getWidth()
  const originalHeight = originalImage.getHeight()

  const headerHeight = Jimp.measureTextHeight(headerFont, header, originalWidth)
  const footerHeight = Jimp.measureTextHeight(footerFont, footer, originalWidth)

  const canvasHeight = headerHeight + footerHeight + originalHeight + yGap * 5.25
  const canvasWidth = originalWidth + xGap * 2

  const canvas = new Jimp(canvasWidth, canvasHeight, 'black')

  canvas.blit(originalImage, xGap, yGap)
  canvas.print(headerFont, xGap, originalHeight + yGap * 2, {
    text: header,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
  }, originalWidth)
  canvas.print(footerFont, xGap, headerHeight + originalHeight + yGap * 2.25, {
    text: footer,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
  }, originalWidth)

  drawWhiteBorder(
    canvas,
    xGap - borderPadding,
    yGap - borderPadding,
    originalWidth + borderPadding * 2,
    originalHeight + borderPadding * 2
  )

  return canvas
}

function drawWhiteBorder(
  image: Jimp,
  x: number, y: number, w: number, h: number
) {
  const white = Jimp.rgbaToInt(255, 255, 255, 255)
  for (let i = y; i <= y + h; i++) {
    image.setPixelColor(white, x, i)
    image.setPixelColor(white, x + w, i)
  }
  for (let i = x; i <= x + w; i++) {
    image.setPixelColor(white, i, y)
    image.setPixelColor(white, i, y + h)
  }
}