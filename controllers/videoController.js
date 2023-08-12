import {
  checkVideoLinkReddit,
  checkObsceneVideoLinkYt,
  checkViolentVideoLink,
  checkObsceneVideoLink,
} from '../check/checkVideoLink.js';

import videoRedditModel from '../dbModel/videoRedditModel.js';
import videoModel from '../dbModel/videoModel.js';
import videoViolentModel from '../dbModel/videoViolentModel.js';
import videoYtModel from '../dbModel/videoYtModel.js';

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

    if (!result) {
      console.log(`Time Taken To Check: ${Date.now() - start}\n`);
      return res
        .status(500)
        .json({ status: 'success', message: 'Internal Error' });
    }

    await insertInDb(result, videoRedditModel).catch(() => {
      return res.status(200).json({ status: 'success', data: result });
    });

    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

export async function processVideoYt(req, res) {
  try {
    const start = Date.now();
    const { link } = req.body;
    const { rid: reqId } = req;

    const data = await queryDbSingle(link, videoYtModel);

    if (typeof data === Object) {
      return res.status(200).json({ status: 'success', data });
    }

    const result = await checkObsceneVideoLinkYt(link, reqId).catch((e) => {
      throw new Error(e.message);
    });

    if (!result) {
      console.log(`Time Taken To Check: ${Date.now() - start}\n`);
      return res
        .status(500)
        .json({ status: 'success', message: 'Internal Error' });
    }

    await insertInDb(result, videoYtModel).catch(() => {
      return res.status(200).json({ status: 'success', data: result });
    });

    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

export async function processObsceneVideo(req, res) {
  try {
    const start = Date.now();

    const { link } = req.body;
    const { rid: reqId } = req;

    const data = await queryDbSingle(link, videoModel);

    if (typeof data === Object) {
      return res.status(200).json({ status: 'success', data });
    }

    const result = await checkObsceneVideoLink(link, reqId).catch((e) => {
      throw new Error(e.message);
    });

    if (!result) {
      console.log(`Time Taken To Check: ${Date.now() - start}\n`);
      return res
        .status(500)
        .json({ status: 'success', message: 'Internal Error' });
    }

    await insertInDb(result, videoModel).catch((e) => {
      if (e.code === 11000) {
        return res.status(200).json({ status: 'success', data: result });
      }
    });

    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

export async function processViolentVideo(req, res) {
  try {
    const start = Date.now();
    const { link } = req.body;
    const { rid: reqId } = req;

    const data = await queryDbSingle(link, videoViolentModel);

    if (typeof data === Object) {
      return res.status(200).json({ status: 'success', data });
    }

    const result = await checkViolentVideoLink(link, reqId).catch((e) => {
      throw new Error(e.message);
    });

    if (!result) {
      console.log(`Time Taken To Check: ${Date.now() - start}\n`);
      return res
        .status(500)
        .json({ status: 'success', message: 'Internal Error' });
    }

    insertInDb(result, videoViolentModel).catch((e) => {
      if (e.code === 11000) {
        return res.status(200).json({ status: 'success', data: result });
      }
    });

    return res.status(500).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
