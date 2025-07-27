import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

console.log('🚀 Starting server...');
console.log('Environment variables check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Missing');

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    console.error('Please set these variables in your Render environment settings');
    process.exit(1);
}

console.log('✅ All required environment variables are set');

try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');
} catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
}

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'https://auth-system-tan.vercel.app',
  'https://auth-system-lemon-eight.vercel.app',
];

console.log('🌐 Setting up CORS for origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
}));

// Body and cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Endpoints
app.get('/', (req, res) => res.send('API Working!'));
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    cors: 'CORS is configured properly'
  });
});

console.log('📡 Setting up API routes...');
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
console.log('✅ API routes configured');

// Test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API routes are working!',
    timestamp: new Date().toISOString(),
    routes: ['/api/auth', '/api/user']
  });
});

app.listen(port, () => {
    console.log(`🚀 Server is running on PORT: ${port}`);
    console.log(`🌐 Server URL: https://auth-system-server-cty2.onrender.com`);
});