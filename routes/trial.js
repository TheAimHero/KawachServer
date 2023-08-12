import multer from 'multer';
import sharp from 'sharp';
import imageType from 'image-type';
import { Router } from 'express';
import * as tf from '@tensorflow/tfjs-node';

import imageModel, { checkNsfw } from '../utils/modelUtils.js';

const trial = Router();

const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage });

async function trialFunc(req, res) {
  const imageBuffer = req.file.buffer;
  const format = await imageType(imageBuffer);
  console.log('format:', format);
  // const image = await sharp(imageBuffer).resize(300, 200).toBuffer();
  // const tensor = tf.node.decodeImage(image, 3);
  // Generate a unique filename (you can implement your own logic)
  // const filename = `${Date.now()}_${Math.random()
  //   .toString(36)
  //   .substring(7)}.jpg`;

  // Save the processed image to the specified directory
  // const imagePath = `${processedImagesDirectory}/${filename}`;
  // fs.writeFileSync(imagePath, processedImageBuffer);
  // let resized = tensor.resizeBilinear([299, 299]).sub(127).div(127);
  // const expandedImage = resized.expandDims();
  // const outputTensor = imageModel.predict(expandedImage);
  // if (await checkNsfw(outputTensor)) return { link, type: 'nsfw' };
  res.status(200).json({ message: 'trial' });
}

trial.post('/', upload.single('image'), trialFunc);

export default trial;
