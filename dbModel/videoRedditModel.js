import mongoose from 'mongoose';

const videoRedditSchema = new mongoose.Schema({
  link: {
    type: String,
    required: [true, 'Link is required'],
    unique: [true, 'Link already exists'],
  },

  dataCreated: { type: Date, default: Date.now(), required: true },

  dateAccessed: { type: Date },

  type: {
    type: String,
    required: true,
    enum: { values: ['nsfw', 'sfw'], message: 'Invalid Class' },
  },
});

videoRedditSchema.post('find', async (doc) => {
  doc.dateAccessed = Date.now();
  await doc.save();
  return;
});

const VideoRedditModel = mongoose.model('VideoRedditLink', videoRedditSchema);

export default VideoRedditModel;
