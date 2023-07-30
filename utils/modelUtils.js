import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import fs from 'fs/promises';
import { Buffer } from 'buffer';

const __dirname = path.resolve();
const modelPath = path.join(__dirname, '/imageModel/model.json');
const model = await tf.loadLayersModel(`file://${modelPath}`);

export function preProcessImage(buf) {
  const tensor = tf.node.decodeImage(buf, 3);
  let resized = tensor.resizeBilinear([299, 299]).sub(127).div(127);
  const expandedImage = resized.expandDims();
  return expandedImage;
}

export async function preProcessAndPredictVideo(directoryPath) {
  const allFiles = await fs.readdir(directoryPath);
  const jpgFiles = allFiles.filter(
    (file) => path.extname(file).toLowerCase() === '.jpg'
  );

  for (let i = 0; i < jpgFiles.length; i++) {
    const file = jpgFiles[i];

    const filePath = path.join(directoryPath, file);
    const fileData = await fs.readFile(filePath);
    const buf = Buffer.from(fileData);
    const imgPreProcessed = preProcessImage(buf);
    const outputTensor = model.predict(imgPreProcessed);
    if (await checkNsfw(outputTensor)) {
      return true;
    }
  }

  return false;
}

export async function checkNsfw(outputTensor) {
  const outputData = await outputTensor.array();

  if (
    outputData[0][0] > 0.5 ||
    outputData[0][1] > 0.5 ||
    outputData[0][3] > 0.5 ||
    outputData[0][4] > 0.5
  ) {
    console.log('outputData:', outputData);
    return true;
  }
  return false;
}

export default model;
