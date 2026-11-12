import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Step 1: Basic Info
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  whatsapp: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  yearEstablished: {
    type: String,
  },

  // Step 2: Category & Description
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
  description: {
    type: String,
  },

  // Step 3: Location
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
  },

  // Step 4: Timings & Operational details
  timing: {
    days: {
      type: [String],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    openTime: {
      type: String,
      default: '09:00 AM',
    },
    closeTime: {
      type: String,
      default: '09:00 PM',
    },
    slots: {
      type: [
        {
          days: [String],
          status: { type: String, default: 'open' }, // 'open', 'closed', 'half_day'
          openTime: { type: String, default: '09:00 AM' },
          closeTime: { type: String, default: '09:00 PM' }
        }
      ],
      default: []
    }
  },
  paymentMethods: {
    type: [String],
    default: ['Cash', 'UPI / GPay'],
  },

  // Media (Photos & Video)
  images: {
    type: [String],
    default: [],
  },
  videoUrl: {
    type: String,
    default: '',
  },

  // Packages (Silver, Gold, Diamond)
  package: {
    type: String,
    enum: ['Silver', 'Gold', 'Diamond'],
    default: 'Silver',
  },
  packagePrice: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'free'],
    default: 'pending',
  },
  paymentTransactionId: {
    type: String,
    default: '',
  },

  // Admin Approval & Verification
  status: {
    type: String,
    enum: ['pending_approval', 'active', 'rejected', 'suspended'],
    default: 'pending_approval', // Admin approve panna dhaan active aagum!
  },
  verified: {
    type: Boolean,
    default: false, // Udaney verified aagadhu! Admin check panni approve pannanum.
  },
  adminApprovedAt: {
    type: Date,
  },
  adminNotes: {
    type: String,
    default: '',
  }
}, { timestamps: true });

export default mongoose.model('Business', businessSchema);
