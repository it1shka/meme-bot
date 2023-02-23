import createMeme from "./meme"

createMeme('putin.jpg', 'Shlyukha', 'Obossanaya').then(result => {
  result.write('result.png')
})