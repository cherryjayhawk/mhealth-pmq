import app from './app';
import { CONFIG } from '@/config';

const server = app.listen(CONFIG.PORT, () => {
  console.log('🚀 Server is running on port', CONFIG.PORT);
  console.log('📝 API Documentation:', `http://localhost:${CONFIG.PORT}/api/docs`);
  console.log('🏥 Health Check:', `http://localhost:${CONFIG.PORT}/api/health`);
  console.log('🌍 Environment:', CONFIG.NODE_ENV);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('📴 Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('📴 Server closed');
    process.exit(0);
  });
});

export default server;