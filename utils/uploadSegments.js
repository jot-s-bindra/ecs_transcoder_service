const axios = require('axios')
const path = require('path')
const fs = require('fs')
const getPutPresignedUrl = require('./getPutPresignedUrl')

async function uploadSegments(userId, title, outputDir) {
  try {
    const files = fs.readdirSync(outputDir)
    console.log(`🚀 Uploading ${files.length} segments to iiita-flix...`)

    for (const fileName of files) {
      const filePath = path.join(outputDir, fileName)
      const contentType = fileName.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/MP2T'

      // ✅ Step 1: Generate PUT Presigned URL
      const presignedUrl = await getPutPresignedUrl(userId, title, fileName, contentType)

      // ✅ Step 2: Upload File to S3 using PUT URL
      const fileBuffer = fs.readFileSync(filePath)

      await axios.put(presignedUrl, fileBuffer, {
        headers: { 'Content-Type': contentType }
      })

      console.log(`✅ Uploaded: ${fileName}`)
    }

    console.log('🎉 All Segments Uploaded Successfully!')
  } catch (err) {
    console.error('❌ Error Uploading Segments:', err.message)
    throw err
  }
}

module.exports = uploadSegments
