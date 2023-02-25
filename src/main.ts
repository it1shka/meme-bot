import * as dotenv from 'dotenv'
import { Bot, CommandContext, Context, InputFile } from 'grammy'
import { dedent, getBuffer, getFileURL } from './utils'
import createMeme from './meme'
dotenv.config()

const token = process.env.TOKEN!
const bot = new Bot(token)

// commands

async function help(ctx: CommandContext<Context>) {
  await ctx.reply(dedent(`
    <b> To create a meme, you need: </b>

    1) Attach an image
    2) Write a header text that will be above the image
    3) Hit new line
    4) Write a footer text that will be below the image
    5) Send the message

    Then bot will generate a meme for you

    <b> For now, bot generates memes only in English! </b>
  `), { parse_mode: 'HTML' })
}

bot.command('start', async (ctx) => {
  const author = await ctx.getAuthor()
  const username = author.user.first_name

  await ctx.reply(dedent(`
    <b> Hello, ${username}! </b>
    Thanks for using my bot!
    
    Author: @nihil4
  `), { parse_mode: 'HTML' })
  await help(ctx)
})

bot.command('help', help)

// main functionality

bot.on('message', async (ctx) => {
  if (!ctx.message.photo) {
    await ctx.reply('Please, attach a photo!')
    return
  }

  const parts = (ctx.message.caption ?? '').split('\n')
  const [header, footer] = [parts[0] ?? '...', parts[1] ?? '...']

  const photoInfo = ctx.message.photo[ctx.message.photo.length - 1]
  const url = await getFileURL(photoInfo, ctx)
  const meme = await createMeme(url, header, footer)
  const buffer = await getBuffer(meme)

  await ctx.reply('Here is your meme: ')
  await ctx.replyWithPhoto(new InputFile(buffer))
})

// error handling and bot start

bot.catch(async (err) => {
  await err.ctx.reply('Something went wrong. Try again!')
  console.log(err.message)
})

process.once('SIGINT', () => bot.stop())
process.once('SIGTERM', () => bot.stop())

bot.start()