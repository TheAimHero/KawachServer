import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
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

videoSchema.post(/^find|save/, (doc) => {
  doc.dateAccessed = Date.now();
  return;
});

const videoModel = mongoose.model('Video', videoSchema);

export default videoModel;
