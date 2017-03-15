import { getLines, CanvasTextWrapper } from 'utils/CanvasTextWrapper'

const textStyle = {
  fontSize: 25,
  color: '#245170'
}

const imageStyle = {
  imageSize: 50,
  imageMargin: 30
}

class TweetDrawer {

  constructor (tweet, canvas) {
    this.tweet = tweet
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.color = '#FF0000'
    this.lines = getLines(this.ctx, this.tweet.content, this.canvas.width, textStyle.fontSize)
  }

  drawBackground () {
    let grd = this.ctx.createLinearGradient(150.000, 0.000, 150.000, 300.000)

    grd.addColorStop(0.000, 'rgba(161, 196, 253, 1.000)')
    grd.addColorStop(1.000, 'rgba(194, 233, 251, 1.000)')

    this.ctx.fillStyle = grd
    this.ctx.fillRect (0, 0, this.canvas.width, this.canvas.height)
  }

  drawBorder () {
    this.ctx.strokeStyle = "#021941"
    this.ctx.lineWidth = 20
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawContent () {
    CanvasTextWrapper(this.canvas, this.lines, textStyle)
  }

  drawImage () {
    let promise = new Promise( (resolve, reject) => {
      let img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {

        // normal image drawing
        // this.ctx.drawImage(img, (this.canvas.width / 2) - (imageStyle.imageSize / 2), 110 - (this.lines.length + 1) * 5, imageStyle.imageSize, imageStyle.imageSize)

        // circle image drawing

        this.ctx.save()
        this.ctx.beginPath()
          this.ctx.arc((this.canvas.width / 2), 150 - (this.lines.length + 1) * 5, imageStyle.imageSize, 0, Math.PI*2, true)
        this.ctx.closePath()
        this.ctx.clip()

        this.ctx.drawImage(img, (this.canvas.width / 2)-imageStyle.imageSize, (150 - (this.lines.length + 1) * 5)-imageStyle.imageSize, 2 * imageStyle.imageSize, 2 * imageStyle.imageSize)

        this.ctx.beginPath()
          this.ctx.arc((this.canvas.width / 2)-imageStyle.imageSize, (150 - (this.lines.length + 1) * 5)-imageStyle.imageSize, imageStyle.imageSize, 0, Math.PI*2, true)
        this.ctx.clip()
        this.ctx.closePath()
        this.ctx.restore()

        resolve()
      }
      img.src = this.tweet.author.image_url
    })

    return promise

  }

  drawUserName () {
    this.ctx.font = 'bold 30px Open Sans, Roboto, sans-serif'
    this.ctx.fillStyle = '#245170'
    this.ctx.textAlign= 'center'
    this.ctx.fillText(this.tweet.author.name, this.canvas.width/2, 150 - (this.lines.length + 1) * 5 + imageStyle.imageSize + 30)
  }

  drawUserScreenName () {
    this.ctx.font = 'italic 20px Open Sans, Roboto, sans-serif'
    this.ctx.fillStyle = '#245170'
    this.ctx.textAlign= 'center'
    this.ctx.fillText('@' + this.tweet.author.screen_name, this.canvas.width/2, 150 - (this.lines.length + 1) * 5 + imageStyle.imageSize + 65)
  }

  draw () {
    return new Promise((resolve, reject) => {
      this.drawBackground()
      this.drawBorder()
      this.drawContent()
      this.drawUserName()
      this.drawUserScreenName()
      this.drawImage().then( () => {
        resolve(this.canvas)
      })
    })
  }

}

export default TweetDrawer
