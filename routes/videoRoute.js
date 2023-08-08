import express from 'express';

import {
  processVideoReddit,
  processVideoYt,
  processObsceneVideo,
   processViolentVideo
} from '../controllers/videoController.js';

const videoRoute = express.Router();

videoRoute.post('/obscene', processObsceneVideo);
videoRoute.post('/violence', processViolentVideo);
videoRoute.post('/reddit', processVideoReddit);
videoRoute.post('/yt', processVideoYt);

export default videoRoute;
