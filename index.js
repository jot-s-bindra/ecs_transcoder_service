require('dotenv').config()
const uploadSegments = require('./utils/uploadSegments')
const path = require('path')

async function main() {
  try {
    const userId = '12345'
    const title = 'test12345'
    const outputDir = path.join(__dirname, 'segments', userId, title)

    // ✅ Step 1: Upload All Segments to S3 (iiita-flix)
    await uploadSegments(userId, title, outputDir)

    console.log('🎉 Video Segments Upload Completed!')
  } catch (err) {
    console.error('❌ Error in Video Upload:', err.message)
  }
}

main()
