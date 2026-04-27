import mongoose from 'mongoose';

const dishPopularitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  normalizedName: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  popularityScore: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  category: {
    type: String,
    default: 'General',
  },
}, {
  timestamps: true,
});

const DishPopularity = mongoose.model('DishPopularity', dishPopularitySchema);

export default DishPopularity;
