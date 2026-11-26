import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true, // Justdial maadhiri phone number romba mukkiyam
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['user', 'business_owner', 'admin'],
    default: 'user',
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);