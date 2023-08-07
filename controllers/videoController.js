import {
  checkVideoLinkReddit,
  checkVideoLinkYt,
  checkVideoLink,
} from '../check/checkVideoLink.js';

import videoRedditModel from '../dbModel/videoRedditModel.js';

import { insertInDb, queryDbSingle } from '../utils/dbUtils.js';

export async function processVideoReddit(req, res) {
  try {
    const start = Date.now();
    const { link } = req.body;

    const data = await queryDbSingle(link, videoRedditModel);

    if (typeof data === Object) {
      return res.status(200).json({ status: 'success', data });
    }

    const result = await checkVideoLinkReddit(link, req.rid).catch((e) => {
      throw new Error(e.message);
    });

    console.log(`Time Taken To Check: ${Date.now() - start}\n`);
    await insertInDb(result, videoRedditModel);
    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

export async function processVideoYt(req, res) {
  try {
    const start = Date.now();
    const result = await checkVideoLinkYt(req.body.link, req.rid).catch((e) => {
      throw new Error(e.message);
    });
    if (result) {
      console.log(`Time Taken To Check: ${Date.now() - start}\n`);
      return res
        .status(200)
        .json({ status: 'success', data: { result: true } });
    } else {
      console.log(`Time Taken To Check: ${Date.now() - start}\n`);
      return res
        .status(200)
        .json({ status: 'success', data: { result: false } });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

export async function processVideo(req, res) {
  try {
    const start = Date.now();
    const result = await checkVideoLink(req.body.link, req.rid).catch((e) => {
      throw new Error(e.message);
    });
    if (result) {
      console.log(`Time Taken To Check: ${Date.now() - start}\n`);
      return res
        .status(200)
        .json({ status: 'success', data: { result: true } });
    } else {
      console.log(`Time Taken To Check: ${Date.now() - start}\n`);
      return res
        .status(200)
        .json({ status: 'success', data: { result: false } });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
