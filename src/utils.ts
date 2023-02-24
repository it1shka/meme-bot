import { Context } from "grammy";
import { PhotoSize } from "grammy/out/types.node";
import Jimp from "jimp";

export function dedent(text: string) {
  return text.split('\n')
    .map(line => line.trim())
    .join('\n')
}

export function getBuffer(image: Jimp) {
  return new Promise<Buffer>((resolve, reject) => {
    image.getBuffer(Jimp.MIME_PNG, (err, value) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(value)
      }
    })
  })
}

export async function getFileURL(info: PhotoSize, ctx: Context) {
  const id = info.file_id
  const file = await ctx.api.getFile(id)
  if (!file.file_path) {
    throw new Error('Failed to get file path')
  }

  const token = process.env.TOKEN!
  const path = file.file_path
  return `https://api.telegram.org/file/bot${token}/${path}`
}