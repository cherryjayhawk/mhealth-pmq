import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { CONFIG } from '@/config';
import { swaggerSpec } from '@/config/swagger';
import routes from '@/routes';
import { errorHandler, notFound } from '@/middleware/error';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: CONFIG.CORS_ORIGIN,
  credentials: true,
}));

// Logging middleware
if (CONFIG.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
}));

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Node.js Express TypeScript API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      posts: '/api/posts',
    },
  });
});

// 404 handler
app.use('*', notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;