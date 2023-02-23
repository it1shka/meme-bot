import Jimp from "jimp"
import path from 'node:path'

const xGap = 50
const yGap = 30
const maxOriginalSize = 600
const borderPadding = 10

export default async function generateMemeImage(meme, header, footer, resizeOriginal = true) {
  const headerFont = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE)
  const footerFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)

  const memeImage = await Jimp.read(meme.data)
  if (resizeOriginal) {
    memeImage.resize(maxOriginalSize, maxOriginalSize)
  }
  const rootImage = await Jimp.read('static/solid_black.png')

  const memeImageWidth = memeImage.getWidth()
  const memeImageHeight = memeImage.getHeight()

  const headerHeight = Jimp.measureTextHeight(headerFont, header, memeImageWidth)
  const footerHeight = Jimp.measureTextHeight(footerFont, footer, memeImageWidth)

  const rootHeight = headerHeight + footerHeight + memeImageHeight + yGap * 5.25
  const rootWidth = memeImageWidth + xGap * 2

  rootImage.resize(rootWidth, rootHeight)

  rootImage.blit(memeImage, xGap, yGap)
  rootImage.print(headerFont, xGap,  memeImageHeight + yGap * 2, {
    text: header,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
  }, memeImageWidth)
  rootImage.print(footerFont, xGap, headerHeight + memeImageHeight + yGap * 2.25, {
    text: footer,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
  }, memeImageWidth)

  // drawing border
  drawWhiteBorder(
    rootImage,
    xGap - borderPadding,
    yGap - borderPadding,
    memeImageWidth + borderPadding * 2,
    memeImageHeight + borderPadding * 2
  )

  const savepath = getSavePath(meme.name)
  rootImage.write(savepath)
  return savepath
}

function drawWhiteBorder(image, x, y, w, h) {
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

const imagesFolder = 'images'
function getSavePath(name) {
  const ext = name.split('.').pop()
  const savePath = path.join(imagesFolder, Date.now() + '.' + ext)
  return savePath
}