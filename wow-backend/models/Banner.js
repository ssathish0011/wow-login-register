import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '/',
    },
    title: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Banner', bannerSchema);

