import mongoose from 'mongoose';

const videoYtSchema = new mongoose.Schema({
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

videoYtSchema.post('find', (doc) => {
  doc.dateAccessed = Date.now();
  doc.save();
  return;
});

const VideoYtModel = mongoose.model('VideoYt', videoYtSchema);

export default VideoYtModel;
