import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
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

imageSchema.post('find', (doc) => {
  doc.forEach(async (d) => {
    d.dateAccessed = Date.now();
    await d.save();
  });
});

const imageModel = mongoose.model('imageLink', imageSchema);

export default imageModel;
