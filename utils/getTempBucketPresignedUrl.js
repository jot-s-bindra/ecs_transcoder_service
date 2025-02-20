const { GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { s3TempClient } = require('../config/awsConfig')

async function getTempBucketPresignedUrl(userId, title) {
  try {
    const bucketName = process.env.S3_TEMP_BUCKET_NAME 
    const key = `${userId}/${title}`

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    })

    const presignedUrl = await getSignedUrl(s3TempClient, command, { expiresIn: 300 })
    console.log('✅ GET Presigned URL from iiita-flix-temp:', presignedUrl)

    return presignedUrl
  } catch (err) {
    console.error('❌ Error Generating GET Presigned URL from iiita-flix-temp:', err.message)
    throw err
  }
}

module.exports = getTempBucketPresignedUrl
