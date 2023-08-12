import express from 'express';
import cluster from 'cluster';
import ruid from 'express-ruid';
import dotenv from 'dotenv';
import cors from 'cors';
import process from 'process';
import mongoose from 'mongoose';

dotenv.config();

import imageRoute from './routes/imageRoute.js';
import videoRoute from './routes/videoRoute.js';
import ratingRoute from './routes/ratingRoute.js';
import hateSpeechRoute from './routes/hateSpeechRoute.js';
import aggregateRoute from './routes/aggregateRoute.js';
import contextHandle from './utils/contextHandle.js';
// import trial from './routes/trial.js';

if (cluster.isMaster) {
  var i = 0;

  for (i; i < 1; i++) {
    cluster.fork();
  }

  //if the worker dies, restart it.

  cluster.on('exit', function (worker) {
    console.log('Worker ' + worker.id + ' died..');

    cluster.fork();
  });
} else {
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
  app.use('/rate', ratingRoute);
  app.use('/aggregate', aggregateRoute);
  // app.use('/trial', trial);
  // app.get("*", errorRoute);

  app.listen(3000, () => console.log('Server is running on port 3000'));

  process.on('uncaughtException', function (err) {
    console.log(err.message);

    //Send some notification about the error

    process.exit(1);
  });
}
