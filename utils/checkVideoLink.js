import axios from 'axios';
import { mkdir } from 'fs/promises';

import { preProcessAndPredictVideo } from './modelUtils.js';
import {
  downloadVideo,
  extractFrames,
  getPaths,
  deleteDir,
} from './videoUtils.js';
import { ytDownload } from './ytUtils.js';

export async function checkVideoLinkReddit(link, reqId) {
  try {
    const res = await axios.get(link);
    const videoUrl =
      res?.data[0]?.data?.children[0]?.data?.media?.reddit_video?.fallback_url;

    if (!videoUrl) throw new Error('Video Not Found');

    const [videoDir, videoPath, videoFramePath] = getPaths(reqId);

    await mkdir(videoFramePath, { recursive: true });
    await downloadVideo(reqId, videoUrl, videoPath).catch((err) => {
      throw new Error(err.message);
    });
    await extractFrames(videoPath, videoFramePath);
    const prediction = await preProcessAndPredictVideo(videoFramePath);
    await deleteDir(videoDir);
    return prediction;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function checkVideoLinkYt(link, reqId) {
  try {
    const [videoDir, videoPath, videoFramePath] = getPaths(reqId);
    await mkdir(videoFramePath, { recursive: true });
    await ytDownload(link, videoPath);
    await extractFrames(videoPath, videoFramePath);
    const prediction = await preProcessAndPredictVideo(videoFramePath);
    await deleteDir(videoDir);
    return prediction;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function checkVideoLink(link, reqId) {
  try {
    const videoUrl = link;
    if (!videoUrl) throw new Error('Video Not Found');

    const [videoDir, videoPath, videoFramePath] = getPaths(reqId);

    await mkdir(videoFramePath, { recursive: true });
    await downloadVideo(reqId, videoUrl, videoPath).catch((err) => {
      throw new Error(err.message);
    });
    await extractFrames(videoPath, videoFramePath);
    const prediction = await preProcessAndPredictVideo(videoFramePath);
    await deleteDir(videoDir);
    return prediction;
  } catch (error) {
    throw new Error(error.message);
  }
}
