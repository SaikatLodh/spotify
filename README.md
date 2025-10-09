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

### Environment Variables

See `.env.example` files in `client/` and `server/` directories for required environment variables.

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
