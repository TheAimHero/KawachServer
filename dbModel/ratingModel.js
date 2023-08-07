import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  website: {
    type: String,
    required: [true, 'Website is required'],
    unique: [true, 'Website already exists'],
    validate: {
      validator: function (value) {
        return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(
          value
        );
      },
      message: 'Invalid URL',
    },
  },

  rating: { type: Number, required: true },

  ratingNumber: { type: Number },
});

const ratingModel = mongoose.model('Rating', ratingSchema);

export default ratingModel;
