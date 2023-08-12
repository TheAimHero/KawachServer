import axios from 'axios';
import { mkdir } from 'fs/promises';

import {
  preProcessAndPredictObsceneVideo,
  preProcessAndPredictVoilentVideo,
} from '../utils/modelUtils.js';
import { downloadVideo, extractFrames } from '../utils/videoUtils.js';
import { deleteDir, getPaths } from '../utils/fsUtils.js';
import { ytDownload } from '../utils/ytUtils.js';

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
    const prediction = await preProcessAndPredictObsceneVideo(videoFramePath);
    await deleteDir(videoDir);
    if (prediction) {
      return { link: videoUrl, type: 'nsfw' };
    } else {
      return { link: videoUrl, type: 'sfw' };
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function checkObsceneVideoLinkYt(link, reqId) {
  try {
    const [videoDir, videoPath, videoFramePath] = getPaths(reqId);
    await mkdir(videoFramePath, { recursive: true });
    await ytDownload(link, videoPath);
    await extractFrames(videoPath, videoFramePath);
    const prediction = await preProcessAndPredictObsceneVideo(videoFramePath);
    await deleteDir(videoDir);
    if (prediction) {
      return { link, type: 'nsfw' };
    } else {
      return { link, type: 'sfw' };
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function checkObsceneVideoLink(link, reqId) {
  try {
    const videoUrl = link;
    if (!videoUrl) throw new Error('Video Not Found');

    const [videoDir, videoPath, videoFramePath] = getPaths(reqId);

    await mkdir(videoFramePath, { recursive: true });
    await downloadVideo(reqId, videoUrl, videoPath).catch((err) => {
      throw new Error(err.message);
    });
    await extractFrames(videoPath, videoFramePath);
    const prediction = await preProcessAndPredictObsceneVideo(videoFramePath);
    await deleteDir(videoDir);
    return prediction;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function checkViolentVideoLink(link, reqId) {
  try {
    const [videoDir, videoPath, videoFramePath] = getPaths(reqId);

    await mkdir(videoFramePath, { recursive: true });
    console.log('link:', link);
    await downloadVideo(reqId, link, videoPath);
    await extractFrames(videoPath, videoFramePath);
    const prediction = await preProcessAndPredictVoilentVideo(videoFramePath);
    await deleteDir(videoDir);
    if (prediction) {
      return { link, type: 'nsfw' };
    } else {
      return { link, type: 'sfw' };
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
