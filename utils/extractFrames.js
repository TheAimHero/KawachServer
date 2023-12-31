import ffmpeg from 'fluent-ffmpeg';
import process from 'process';
import path from 'path';
import util from 'util';

const ffprobe = util.promisify(ffmpeg.ffprobe);

export default async function extractFrames(inputVideoPath, outputFolder) {
  try {
    const metadata = await ffprobe(inputVideoPath);
    const videoDuration = metadata.format.duration;
    const interval =
      videoDuration / (Number(process.env.MAX_EXTRACT_FRAMES) - 1);

    for (let i = 0; i < Number(process.env.MAX_EXTRACT_FRAMES); i++) {
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
            reject(err);
          })
          .run();
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
