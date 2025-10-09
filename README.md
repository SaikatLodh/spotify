# Spotify Clone

A full-stack music streaming application inspired by Spotify, built with Next.js for the frontend and Node.js/Express for the backend.

## Live Url

https://spotifymusicplayers.netlify.app/

## Features

- User authentication (including Google OAuth)
- Music playback with controls
- Playlist management
- Artist and album browsing
- Song search and discovery
- Subscription plans
- Admin dashboard for content management

## Tech Stack

### Frontend (Client)
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Query
- Radix UI components

### Backend (Server)
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Redis for caching
- JWT authentication
- Cloudinary for media uploads
- Razorpay for payments

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Redis
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spotify
```

2. Set up the server:
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. Set up the client:
```bash
cd ../client
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables For Server

# Database
MONGODB_URL=mongodb+srv://saikatlidhroni20019_db_user:050nEqhyNoT2WHGv@cluster0.zogugvs.mongodb.net

# Server
PORT=8000

# Redis
REDIS_URL=rediss://red-d2pj87n5r7bs739ph7m0:P4AxQXSEVyAO92HJxqJkHWwRspstETM5@oregon-keyvalue.render.com:6379

# Client URLs
CLIENT_URL=http://localhost:3000
CLIENT_URL_ADMIN=http://localhost:8000

# Session
SESSOIN_SECRET=your_session_secret_here

# JWT Tokens
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRATION_TIME=15m
REFRESH_TOKEN_EXPIRATION_TIME=7d

# Email (SMTP)
SMPT_HOST=smtp.gmail.com
SMPT_PORT=465
SMPT_SERVICE=gmail
SMPT_MAIL=saikatlidhroni20019@gmail.com
SMPT_PASSWORD=jlos zkbv avrn rcki

# Cloudinary
CLOUDINARY_NAME=dvkyxnqpc
CLOUDINARY_API_KEY=894821384124177
CLOUDINARY_API_SECRET=pKz-VnvbMiTTgc503r5oYZTOcXo

# Google OAuth
GOOGLE_CLIENT_ID=472593899317-v4jcavlinjcc1oulg7ds484jpfai2mh6.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Razorpay Payment
RAZORPAY_KEY_ID=rzp_test_1JwssgEE26nQCz
RAZORPAY_KEY_SECRET=0hxuGEumQmIGB1SxXQ7HnZPh
MERCHANT_ACCOUNT_ID=NfZPptfLQIAhzt


### Environment Variables For Client

# Base URL for API calls
NEXT_PUBLIC_BASE_URL=http://localhost:8000/api/v1

# Google OAuth Client ID
NEXT_PUBLIC_CLIENT_ID_FOR_GOOLE=472593899317-v4jcavlinjcc1oulg7ds484jpfai2mh6.apps.googleusercontent.com



### Building for Production

#### Client
```bash
cd client
npm run build
npm start
```

#### Server
```bash
cd server
npm run build
npm start
```

## API Documentation

API documentation is available via Swagger at `http://localhost:8000/api-docs` when the server is running.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.

## Admin Credentials

email: owner@yopmail.com
password: owner10

## Author 

Saikat Lodh
