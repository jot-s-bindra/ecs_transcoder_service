const axios = require('axios')

async function sendTranscodeStatus(userId, title, status) {
  try {
    const payload = { userId, title, status }
    const url = process.env.TRANSCODER_SERVICE_URL

    await axios.post(url, payload)

    console.log(`✅ Transcode Status Sent: ${status}`)
  } catch (err) {
    console.error('❌ Error Sending Transcode Status:', err.message)
    throw err
  }
}

module.exports = sendTranscodeStatus
