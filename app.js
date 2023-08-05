import express from 'express';
import ruid from 'express-ruid';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config()

import { dbConnect } from './database/dbConnect.js';
import imageRoute from './routes/imageRoute.js';
import videoRoute from './routes/videoRoute.js';
const app = express();
dbConnect();

app.use(express.json({ limit: '1000kb' }));
app.use(cors());
app.use(ruid({ prefixRoot: '' }));

app.use('/image', imageRoute);
app.use('/video', videoRoute);
// app.get("*", errorRoute);

app.listen(3000, () => console.log('Server is running on port 3000'));
