# Node.js Express TypeScript Starter Kit

Starter kit Node.js backend yang lengkap dengan Express, TypeScript, PostgreSQL (Neon Serverless), Drizzle ORM, JWT Authentication, dan dokumentasi Swagger menggunakan arsitektur MVC.

## 🚀 Fitur

- **Framework**: Express.js dengan TypeScript
- **Database**: PostgreSQL dengan Neon Serverless
- **ORM**: Drizzle ORM
- **Authentication**: JWT (JSON Web Token)
- **Dokumentasi**: Swagger/OpenAPI 3.0
- **Arsitektur**: MVC (Model-View-Controller)
- **Validasi**: Zod schema validation
- **Security**: Helmet, CORS, bcryptjs
- **Logging**: Morgan
- **Environment**: dotenv configuration

## 📁 Struktur Proyek

```
src/
├── config/          # Konfigurasi aplikasi
│   ├── index.ts     # Environment variables
│   └── swagger.ts   # Konfigurasi Swagger
├── controllers/     # Controllers (business logic)
│   ├── authController.ts
│   └── postController.ts
├── db/             # Database configuration & schema
│   ├── index.ts    # Database connection
│   ├── schema.ts   # Drizzle schema
│   └── migrate.ts  # Migration script
├── middleware/     # Custom middleware
│   ├── auth.ts     # JWT authentication
│   ├── validation.ts # Request validation
│   └── error.ts    # Error handling
├── routes/         # Route definitions
│   ├── authRoutes.ts
│   ├── postRoutes.ts
│   └── index.ts
├── utils/          # Utilities & schemas
│   └── schemas.ts  # Zod validation schemas
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## 🛠️ Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd nodejs-express-starter
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/database_name?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

4. **Setup Database**
```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate
```

## 🏃‍♂️ Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📚 API Documentation

Setelah server berjalan, akses dokumentasi Swagger di:
```
http://localhost:3000/api/docs
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server dengan hot reload
- `npm run build` - Build aplikasi untuk production
- `npm start` - Start production server
- `npm run db:generate` - Generate migration files dari schema
- `npm run db:migrate` - Jalankan database migrations
- `npm run db:studio` - Buka Drizzle Studio untuk database management

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get profil user (protected)

### Posts
- `GET /api/posts` - Get semua posts (dengan pagination)
- `GET /api/posts/:id` - Get post berdasarkan ID
- `GET /api/posts/user/:userId` - Get posts berdasarkan user ID
- `POST /api/posts` - Buat post baru (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Hapus post (protected)

### Utility
- `GET /api/health` - Health check endpoint
- `GET /` - API information

## 🔐 Authentication

API menggunakan JWT untuk authentication. Untuk endpoint yang protected:

1. Register atau login untuk mendapatkan token
2. Include token di header request:
```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database Schema

### Users Table
```typescript
{
  id: number (Primary Key)
  email: string (Unique)
  password: string (Hashed)
  firstName: string
  lastName: string
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Posts Table
```typescript
{
  id: number (Primary Key)
  title: string
  content: text (Optional)
  authorId: number (Foreign Key)
  isPublished: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 🔧 Konfigurasi Neon Database

1. Buat akun di [Neon](https://neon.tech)
2. Buat database baru
3. Copy connection string ke `.env` file
4. Jalankan migrations dengan `npm run db:migrate`

## 🚀 Deployment

### Untuk deployment ke production:

1. Set environment variables di platform hosting
2. Build aplikasi: `npm run build`
3. Start server: `npm start`

### Environment Variables untuk Production:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<your-neon-database-url>
JWT_SECRET=<secure-random-string>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=<your-frontend-url>
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Express.js team
- Drizzle ORM team  
- Neon team
- TypeScript community