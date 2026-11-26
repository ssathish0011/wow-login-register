import mongoose from 'mongoose';

const middleBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: '/'
    },
    title: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true }
);

const MiddleBanner = mongoose.model('MiddleBanner', middleBannerSchema);
export default MiddleBanner;

