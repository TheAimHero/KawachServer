import {
  checkVideoLinkReddit,
  checkVideoLinkYt,
  checkVideoLink,
} from '../check/checkVideoLink.js';

export async function processVideoReddit(req, res) {
  try {
    const start = Date.now();
    const result = await checkVideoLinkReddit(req.body.link, req.rid).catch(
      (e) => {
        throw new Error(e.message);
      }
    );
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
