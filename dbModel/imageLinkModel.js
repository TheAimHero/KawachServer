import mongoose from 'mongoose';

const imageLinkSchema = new mongoose.Schema({
  link: {
    type: String,
    required: [true, 'Link is required'],
    unique: [true, 'Link already exists'],
  },

  dataCreated: { type: Date, default: Date.now(), required: true },

  dateAccessed: { type: Date },

  accessedAmt: { type: Number, default: 1 },
});

const imageLinkModel = mongoose.model('ImageLink', imageLinkSchema);

export default imageLinkModel;
