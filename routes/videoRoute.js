import express from 'express';

import {
  processVideoReddit,
  processVideoYt,
  processVideo,
} from '../controllers/videoController.js';

const videoRoute = express.Router();

videoRoute.post('/',processVideo);
videoRoute.post('/reddit', processVideoReddit);
videoRoute.post('/yt', processVideoYt);

export default videoRoute;
