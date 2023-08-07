import path from 'path';
import fs from 'fs/promises';

export async function deleteDir(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await deleteDir(filePath);
      } else {
        await fs.unlink(filePath);
      }
    }

    await fs.rmdir(directoryPath);
  } catch (err) {
    console.error('Error deleting directory:', err);
  }
}

export function getPaths(reqId, type = 'video') {
  if (type === 'text') {
    const textPath = path.join(path.resolve(), `textData/${reqId}.txt`);
    return [textPath];
  }
  const videoDir = path.join(path.resolve(), `videoData/${reqId}`);
  const videoPath = path.join(videoDir, `${reqId}.mp4`);
  const videoFramePath = path.join(videoDir, './videoFrame');
  return [videoDir, videoPath, videoFramePath];
}
