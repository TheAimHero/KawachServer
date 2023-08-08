import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs/promises';

import hateSpeechProcess from '../hateSpeechModel/lft.js';
import { getPaths } from '../utils/fsUtils.js';

const modelPath = path.join(path.resolve(), 'hateSpeechModel/hatespeech2.py');

export async function hateSpeechTextRoute(req, res) {
  const { text } = req.body;
  const { rid: reqId } = req;
  const [textPath] = getPaths(reqId, 'text');

  await fs.writeFile(textPath, text);

  const childProcess = spawn('python', [modelPath, textPath]);

  childProcess.stdout.on('data', (data) => {
    return res.status(200).json({
      status: 'success',
      data: { result: Boolean(data.toString().trim()) },
    });
  });

  childProcess.stderr.on('data', (data) => {
    return res.status(500).json({
      status: 'error',
      data: { result: Boolean(data.toString().trim()) },
    });
  });
}

export async function hateSpeechUrlRoute(req, res) {
  const { link: url } = req.body;
  const { rid: reqId } = req;
  const [textPath] = getPaths(reqId, 'text');

  if (!url.startsWith('http')) {
    return res
      .status(400)
      .json({ status: 'error', data: { message: 'Incorrect URL' } });
  }

  await hateSpeechProcess(url, textPath);

  const childProcess = spawn('python', [modelPath, textPath]);

  childProcess.stdout.on('data', (data) => {
    return res.status(200).json({
      status: 'success',
      data: { result: data.toString().trim() },
    });
  });

  childProcess.stderr.on('data', (data) => {
    return res.status(500).json({
      status: 'error',
      data: { result: Boolean(data.toString().trim()) },
    });
  });
}
