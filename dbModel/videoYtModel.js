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

videoYtSchema.post(/^find|save/, (doc) => {
  doc.dateAccessed = Date.now();
  return;
});

const VideoYtModel = mongoose.model('VideoYtLink', videoYtSchema);

export default VideoYtModel;
