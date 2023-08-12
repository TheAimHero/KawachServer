import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs/promises';

import hateSpeechProcess from '../hateSpeechModel/lft.js';
import { getPaths } from '../utils/fsUtils.js';

const modelPathHateSpeech = path.join(
  path.resolve(),
  'hateSpeechModel/hatespeech2.py'
);
const modelPathContext = path.join(path.resolve(), '/contextDetection/1.py');

export async function hateSpeechTextRoute(req, res) {
  const { text } = req.body;
  const { rid: reqId } = req;
  const [textPath] = getPaths(reqId, 'text');

  await fs.writeFile(textPath, text);

  const childProcess = spawn('python', [modelPathHateSpeech, textPath]);

  childProcess.stdout.on('data', (data) => {
    return res.status(200).json({
      status: 'success',
      data: { result: data.toString().trim() },
    });
  });

  childProcess.stderr.on('data', (data) => {
    return res
      .status(500)
      .json({ status: 'error', data: { result: data.toString().trim() } });
  });
}

export async function hateSpeechUrlRoute(req, res) {
  try {
    console.log('hateSpeechUrlRoute');
    const { link: url } = req.body;
    const { rid: reqId } = req;
    const [textPath] = getPaths(reqId, 'text');
    if (!url.startsWith('http')) {
      throw new Error('Invalid URL');
    }

    const resObj = {};

    const bool = await hateSpeechProcess(url, textPath);
    if (!bool) {
      throw new Error('Internal Error');
    }

    const childProcessHateSpeech = spawn('python', [
      modelPathHateSpeech,
      textPath,
    ]);

    childProcessHateSpeech.stdout.on('data', (data) => {
      resObj.hateSpeech = data.toString().trim();
      return res.status(200).json({ status: 'success', data: resObj });
    });

    childProcessHateSpeech.stderr.on('data', () => {
      return;
    });

    const childProcessContext = spawn('python', [modelPathContext, textPath]);

    childProcessContext.stdout.on('data', (data) => {
      resObj.context = data.toString().trim();
    });

    childProcessContext.stderr.on('data', () => {
      return;
    });
  } catch (e) {
    return;
  }
}
