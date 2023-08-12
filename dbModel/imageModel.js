import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  link: {
    type: String,
    required: [true, 'Link is required'],
    unique: [true, 'Link already exists'],
  },

  dataCreated: { type: Date, default: Date.now(), required: true },

  dateAccessed: { type: Date },

  numAccessed: { type: Number, default: 1 },

  type: {
    type: String,
    required: true,
    enum: { values: ['nsfw', 'sfw'], message: 'Invalid Class' },
  },
});


imageSchema.post('find', (doc) => {
  doc.forEach(async (d) => {
    d.dateAccessed = Date.now();
    d.numAccessed += 1;
    await d.save();
  });
});

const imageModel = mongoose.model('Image', imageSchema);

export default imageModel;
