import express from 'express';
import { aggregateImage } from '../dbAggregate/imageAggregate.js';

const aggregateRoute = express.Router();

aggregateRoute.get('/image', aggregateImage);

export default aggregateRoute;
