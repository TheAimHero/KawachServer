import express from 'express';

import { processUserRate } from '../controllers/ratingController.js';

const ratingRoute = express.Router();

ratingRoute.post('/image', processUserRate);
// ratingRoute.post('/video', processUserRate);

export default ratingRoute;
