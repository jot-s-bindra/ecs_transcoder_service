const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { s3MainClient } = require('../config/awsConfig')

async function getPutPresignedUrl(userId, title, fileName, contentType) {
  try {
    const bucketName = process.env.S3_MAIN_BUCKET_NAME 
    const key = `${userId}/${title}/${fileName}`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType
    })

    const presignedUrl = await getSignedUrl(s3MainClient, command, { expiresIn: 300 })
    console.log(`✅ PUT Presigned URL Created: ${fileName}`)

    return presignedUrl
  } catch (err) {
    console.error('❌ Error Generating PUT Presigned URL:', err.message)
    throw err
  }
}

module.exports = getPutPresignedUrl
