const fs = require('fs')
const path = require('path')
const axios = require('axios')

async function downloadVideo(url, outputPath) {
  try {
    console.log('📥 Downloading Video from:', url)

    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    })

    const writer = fs.createWriteStream(outputPath)

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('✅ Video Downloaded Successfully:', outputPath)
        resolve(outputPath)
      })
      writer.on('error', (err) => {
        console.error('❌ Error Downloading Video:', err.message)
        reject(err)
      })
    })
  } catch (err) {
    console.error('❌ Error Downloading Video:', err.message)
    throw err
  }
}

module.exports = downloadVideo
