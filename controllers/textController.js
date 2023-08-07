import { promisify } from 'util';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs/promises';

import hateSpeechProcess from '../hateSpeechModel/lft.js';
import { getPaths } from '../utils/fsUtils.js';

const spawnAsync = promisify(spawn);

const modelPath = path.join(path.resolve(), 'hateSpeechModel/hatespeech2.py');

export async function hateSpeechTextRoute(req, res) {
  const { text } = req.body;
  const { rid: reqId } = req;
  const [textPath] = getPaths(reqId, 'text');

  await fs.writeFile(textPath, text);

  const childProcess = await spawnAsync('python', [modelPath, textPath], {
    stdio: 'inherit',
  });

  childProcess.stdout.on('data', (data) => {
    res.status(200).json({ status: 'success', data: { result: data } });
  });

  childProcess.stderr.on('data', (data) => {
    res.status(500).json({ status: 'error', data: { message: data } });
  });

  res.status(200).json({ status: 'success', data: { result: true } });
}

export async function hateSpeechUrlRoute(req, res) {
  const { url } = req.params;
  if (!url.startsWith('https://') || !url.startsWith('http://')) {
    res
      .status(400)
      .json({ status: 'error', data: { message: 'Incorrect URL' } });
  }

  await hateSpeechProcess(url);
  console.log('url:', url);
  res.status(200).json({ status: 'success', data: { result: true } });
}
