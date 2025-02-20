require('dotenv').config()
const getTempBucketPresignedUrl = require('./utils/getTempBucketPresignedUrl')
const downloadVideo = require('./utils/downloadVideo')

async function main() {
  try {
    const userId = '12345'
    const title = 'test12345'
    const downloadPath = './temp_video.mp4'

    const presignedUrl = await getTempBucketPresignedUrl(userId, title)

    await downloadVideo(presignedUrl, downloadPath)

    console.log('🎉 Video Ready for FFmpeg Processing:', downloadPath)
  } catch (err) {
    console.error('❌ Error in Video Download Process:', err.message)
  }
}

main()
