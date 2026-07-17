const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;

const orderRoutes = require('./routes/orders');
const orderChatRoutes = require('./routes/orderChat');
const paymentRoutes = require('./routes/payments');
const serviceRoutes = require('./routes/services');
const contentRoutes = require('./routes/content');
const liveChatRoutes = require('./routes/liveChat');
const agencyChatRoutes = require('./routes/agencyChat');
const adminManagementRoutes = require('./routes/adminManagement');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vero2';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Redis Connection
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisClient = redis.createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    family: 4, // Force IPv4
  },
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

// Connect Redis
redisClient.connect().catch(console.error);

// Health Check Middleware
const healthCheck = async (req, res, next) => {
  try {
    // Check MongoDB connection
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check Redis connection
    const redisStatus = redisClient.isReady ? 'connected' : 'disconnected';
    
    console.log(`MongoDB: ${mongoStatus}, Redis: ${redisStatus}`);
    next();
  } catch (error) {
    console.error('Health check error:', error);
    next();
  }
};

// Routes

// Hello World Endpoint
app.get('/api/helloworld', healthCheck, async (req, res) => {
  try {
    // Optional: Store request in Redis cache
    const cacheKey = 'helloworld:count';
    const count = await redisClient.incr(cacheKey) || 1;
    await redisClient.expire(cacheKey, 86400); // Expire after 24 hours
    
    res.json({
      message: 'helloworld',
      timestamp: new Date().toISOString(),
      service: 'vero2-backend',
      requestCount: count,
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      redis: redisClient.isReady ? 'connected' : 'disconnected'
    });
  } catch (error) {
    console.error('Error in hello world endpoint:', error);
    res.status(500).json({
      message: 'helloworld',
      error: error.message
    });
  }
});

// Mount routes
app.use('/api', orderRoutes);
app.use('/api', orderChatRoutes);
app.use('/api', paymentRoutes);
app.use('/api', serviceRoutes);
app.use('/api', contentRoutes);
app.use('/api', liveChatRoutes);
app.use('/api', agencyChatRoutes);
app.use('/api', adminManagementRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const mongoStatus = mongoose.connection.readyState === 1;
    const redisStatus = redisClient.isReady;
    
    const status = {
      service: 'vero2-backend',
      status: mongoStatus && redisStatus ? 'healthy' : 'degraded',
      components: {
        mongodb: mongoStatus ? 'connected' : 'disconnected',
        redis: redisStatus ? 'connected' : 'disconnected',
      },
      timestamp: new Date().toISOString()
    };
    
    const statusCode = mongoStatus && redisStatus ? 200 : 503;
    res.status(statusCode).json(status);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Export redisClient for use in other modules
module.exports.redisClient = redisClient;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Hello World: http://localhost:${PORT}/api/helloworld`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await redisClient.quit();
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await redisClient.quit();
  await mongoose.connection.close();
  process.exit(0);
});

