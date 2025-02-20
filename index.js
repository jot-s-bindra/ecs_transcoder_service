require('dotenv').config()
const segmentVideo = require('./utils/ffmpegSegmenter')
const path = require('path')
const fs = require('fs')

async function main() {
  try {
    const userId = '12345'
    const title = 'test12345'
    const downloadPath = './temp_video.mp4' // ✅ Using Local Video File
    const outputDir = path.join(__dirname, 'segments', userId, title)

    // ✅ Step 1: Get GET Presigned URL from iiita-flix-temp (Commented for Testing)
    // const presignedUrl = await getTempBucketPresignedUrl(userId, title)

    // ✅ Step 2: Download Video from URL (Commented for Testing)
    // await downloadVideo(presignedUrl, downloadPath)

    // ✅ Step 3: Run FFmpeg to Generate Segments
    await segmentVideo(downloadPath, outputDir)

    // ✅ Step 4: List Files Created
    const files = fs.readdirSync(outputDir)
    console.log('📂 Files Created:', files)

    console.log('🎉 Video Segmentation Completed!')
  } catch (err) {
    console.error('❌ Error in Video Processing:', err.message)
  }
}

main()
