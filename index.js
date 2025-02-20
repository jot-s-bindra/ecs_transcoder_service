require('dotenv').config()
const getTempBucketPresignedUrl = require('./utils/getTempBucketPresignedUrl')
const downloadVideo = require('./utils/downloadVideo')
const segmentVideo = require('./utils/ffmpegSegmenter')
const uploadSegments = require('./utils/uploadSegments')
const sendTranscodeStatus = require('./utils/sendTranscodeStatus')
const path = require('path')
const fs = require('fs')

async function main() {
  try {
    console.log('🚀 ECS Transcoder Container Started...')

    // ✅ Step 1: Get UserID and Title from Environment Variables
    const userId = process.env.USER_ID
    const title = process.env.TITLE

    if (!userId || !title) {
      throw new Error('❌ Missing USER_ID or TITLE environment variable')
    }

    const downloadPath = './temp_video.mp4'
    const outputDir = path.join(__dirname, 'segments', userId, title)

    // ✅ Step 2: Get GET Presigned URL from Upload Service
    console.log(`🔗 Requesting GET Presigned URL for User: ${userId}, Title: ${title}`)
    const presignedUrl = await getTempBucketPresignedUrl(userId, title)

    // ✅ Step 3: Download Video from S3 Temp Bucket
    console.log('📥 Downloading Video from S3 Temp Bucket...')
    await downloadVideo(presignedUrl, downloadPath)

    // ✅ Step 4: Run FFmpeg to Generate Video Segments
    console.log('⚙️  Running FFmpeg to Create HLS Segments...')
    await segmentVideo(downloadPath, outputDir)

    // ✅ Step 5: Upload All Segments to S3 Main Bucket
    console.log('🚀 Uploading Segments to S3 Main Bucket...')
    await uploadSegments(userId, title, outputDir)

    // ✅ Step 6: Notify Transcoder Service of Success
    console.log('📡 Sending Transcode Success Notification...')
    await sendTranscodeStatus(userId, title, 'done') // Status: 'done'

    console.log('🎉 ECS Transcoder Container Process Completed!')
  } catch (err) {
    console.error('❌ Error in ECS Transcoder Process:', err.message)

    try {
      // ✅ Step 7: Notify Transcoder Service of Failure
      console.log('📡 Sending Transcode Failure Notification...')
      await sendTranscodeStatus(process.env.USER_ID, process.env.TITLE, 'error') // Status: 'error'
    } catch (notificationErr) {
      console.error('❌ Error Notifying Transcoder Service:', notificationErr.message)
    }

    process.exit(1) // Exit ECS Container with Error Code
  }
}

main()
