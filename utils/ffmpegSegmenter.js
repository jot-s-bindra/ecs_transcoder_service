const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const fs = require('fs')

async function segmentVideo(inputFilePath, outputDir) {
  return new Promise((resolve, reject) => {
    // ✅ Ensure Output Directory Exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const outputFilePath = path.join(outputDir, 'index.m3u8')

    console.log('⚙️  Starting FFmpeg Segmentation...')

    ffmpeg(inputFilePath)
      .outputOptions([
        '-preset', 'ultrafast',          // ✅ Fast encoding
        '-g', '48',                      // ✅ Group of Pictures (GOP)
        '-sc_threshold', '0',            // ✅ Avoid segment issues
        '-hls_time', '10',               // ✅ Segment duration: 10 seconds
        '-hls_playlist_type', 'vod',     // ✅ VOD playlist type
        '-hls_segment_filename', path.join(outputDir, 'segment_%03d.ts'), // ✅ Segment filenames
        '-c:v', 'libx264',               // ✅ Video codec
        '-c:a', 'aac',                   // ✅ Audio codec
        '-strict', '-2',                 // ✅ Allow experimental codecs
        '-f', 'hls'                      // ✅ Output format: HLS
      ])
      .output(outputFilePath)  // ✅ Save the main playlist here
      .on('end', () => {
        console.log('✅ FFmpeg Segmentation Completed')
        resolve(outputDir)  // ✅ Return the directory with segments
      })
      .on('error', (err) => {
        console.error('❌ FFmpeg Error:', err.message)
        reject(err)
      })
      .run()
  })
}

module.exports = segmentVideo
