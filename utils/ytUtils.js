import ytdl from 'ytdl-core';
import fs from 'fs';
import { promisify } from 'util';
import { finished } from 'stream';

const streamFinished = promisify(finished);

export async function ytDownload(videoURL, downloadPath) {
  const info = await ytdl.getInfo(videoURL);
  const videoStream = ytdl.downloadFromInfo(info, { quality: 'lowestvideo' });
  const opStream = fs.createWriteStream(downloadPath);
  videoStream.pipe(opStream);
  await streamFinished(opStream);
  return true;
}
