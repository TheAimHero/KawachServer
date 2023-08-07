import express from 'express';
import ruid from 'express-ruid';
import dotenv from 'dotenv';
import cors from 'cors';
import process from 'process';

dotenv.config();

import imageRoute from './routes/imageRoute.js';
import videoRoute from './routes/videoRoute.js';
import hateSpeechRoute from './routes/hateSpeechRoute.js';
import mongoose from 'mongoose';
const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('Database Connected'));

app.use(express.json({ limit: '1000kb' }));
app.use(cors());
app.use(ruid({ prefixRoot: '' }));

app.use('/image', imageRoute);
app.use('/video', videoRoute);
app.use('/hate-speech', hateSpeechRoute);
// app.get("*", errorRoute);

app.listen(3000, () => console.log('Server is running on port 3000'));
