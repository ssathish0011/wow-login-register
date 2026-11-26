import dns from 'dns';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Use Google/Cloudflare DNS so mongodb+srv:// SRV lookups don't fail on restricted local DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);
import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import middleBannerRoutes from './routes/middleBannerRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/middle-banners', middleBannerRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('WOW Justdial Backend API is Running!');
});

// MongoDB Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wow_justdial';

// Start Express Server immediately on PORT 5000 so requests never get ERR_CONNECTION_REFUSED
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected Successfully to Local Database!');
  } catch (err) {
    console.error('MongoDB Connection Error (Retrying in 5s...):', err.message);
    setTimeout(connectDB, 5000);
  }
};

connectDB();