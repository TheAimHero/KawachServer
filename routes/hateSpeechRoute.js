import express from 'express';

import {
  hateSpeechUrlRoute,
  hateSpeechTextRoute,
} from '../controllers/textController.js';

const hateSpeechRoute = express.Router();

hateSpeechRoute.get('/', hateSpeechTextRoute);
hateSpeechRoute.get('/url', hateSpeechUrlRoute);

export default hateSpeechRoute;
