import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import util from 'util';
import path from 'path';
import process from 'process';
import fs from 'fs/promises';

const ffprobe = util.promisify(ffmpeg.ffprobe);
const numFrames = 10;

async function getVideoSize(url) {
  try {
    const response = await axios.head(url); // Send a HEAD request to get headers

    // The 'content-length' header indicates the size of the file in bytes
    const contentLength = response.headers['content-length'];

    if (contentLength) {
      const fileSizeInBytes = parseInt(contentLength, 10);
      const fileSizeInKB = fileSizeInBytes / 1024;
      const fileSizeInMB = fileSizeInKB / 1024;
      return fileSizeInMB.toFixed(0);
    } else {
      return -1;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function downloadVideo(reqId, downloadUrl, downloadPath) {
  try {
    const start = Date.now();
    const videoSize = await getVideoSize(downloadUrl);
    console.log(`Time Taken To Check Size: ${Date.now() - start}`);
    console.log(videoSize);
    if (videoSize === -1 || videoSize > Number(process.env.MAX_DOWNLOAD_SIZE))
      throw new Error('Size File Too Big');
    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'arraybuffer',
    });
    await fs.writeFile(downloadPath, response.data);
    console.log('Total Time Taken:', (Date.now() - start) / 1000);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function extractFrames(inputVideoPath, outputFolder) {
  try {
    const metadata = await ffprobe(inputVideoPath);
    const videoDuration = metadata.format.duration;
    const interval = videoDuration / (numFrames - 1);

    for (let i = 0; i < numFrames; i++) {
      const frameTime = i * interval;
      const frameOutputPath = path.join(outputFolder, `frame_${i}.jpg`);

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(inputVideoPath)
          .seekInput(frameTime)
          .output(frameOutputPath)
          .frames(1)
          .on('end', () => {
            resolve();
          })
          .on('error', (err) => {
            console.log(err);
            reject(err.message);
          })
          .run();
      });
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}
