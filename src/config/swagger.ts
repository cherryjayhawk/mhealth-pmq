import swaggerJsdoc from 'swagger-jsdoc';
import { CONFIG } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Express TypeScript API',
      version: '1.0.0',
      description: 'A robust REST API built with Node.js, Express, TypeScript, PostgreSQL, and Drizzle ORM',
      contact: {
        name: 'API Support',
        email: 'support@yourapi.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${CONFIG.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
            },
            isActive: {
              type: 'boolean',
              description: 'User active status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Post ID',
            },
            title: {
              type: 'string',
              description: 'Post title',
            },
            content: {
              type: 'string',
              description: 'Post content',
            },
            isPublished: {
              type: 'boolean',
              description: 'Post publication status',
            },
            authorId: {
              type: 'integer',
              description: 'Author user ID',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Post creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Post last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication endpoints',
      },
      {
        name: 'Posts',
        description: 'Post management endpoints',
      },
    ],
  },
  apis: ['./src/controllers/*.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);