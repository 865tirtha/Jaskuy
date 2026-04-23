const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

// Load env before using any other modules
dotenv.config();

const indexRoutes = require('./routes/index.routes');
const errorHandler = require('./core/middlewares/errorHandler');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO Dasar
const io = new Server(server, {
  cors: {
    origin: '*', // Sesuaikan dengan domain frontend di production
    methods: ['GET', 'POST']
  }
});

// Middleware Global
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: '*'
}));
app.use(express.json());

// API Routes (Entry Point)
app.use('/api', indexRoutes);

// Global Error Handler
app.use(errorHandler);

const initializeChatModerator = require('./infrastructure/websocket/chatModerator');

// Socket.io Connection Event handled by specialized AI Moderator
initializeChatModerator(io);

const initiateCronJobs = require('./cron');

// Init Script Background Worker V3
initiateCronJobs();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 [Jaskuy Backend] Server is running on port ${PORT}`);
});
