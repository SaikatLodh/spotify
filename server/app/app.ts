import path from "path";
import cors from "cors";
import env from "dotenv";
import CookeParser from "cookie-parser";
import session from "express-session";
import { RedisStore } from "connect-redis";
import redis from "./config/redis";
import flash from "connect-flash";
import express from "express";
import fs from "fs";

const app = express();

env.config({
  path: ".env",
});

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(function (_, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS,HEAD,PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", "views");
app.use(CookeParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: process.env.SESSOIN_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(flash());

import authRoute from "./routes/api/auth/authRoute";
import userRoute from "./routes/api/user/userRoutes";
import albumRoute from "./routes/api/album/albumRoute";
import songsRoute from "./routes/api/songs/songsRoute";
import likesongRoute from "./routes/api/likesong/likeSongRoute";
import playlistRoute from "./routes/api/playlist/playlistRoute";
import subscriptionPlaneRoute from "./routes/api/subcriptionplane/subcriptionPlaneRoute";
import subscriptionRoute from "./routes/api/subscription/subscriptionRoute";
import artistRoute from "./routes/api/artist/artistRoute";

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/album", albumRoute);
app.use("/api/v1/songs", songsRoute);
app.use("/api/v1/likesong", likesongRoute);
app.use("/api/v1/playlist", playlistRoute);
app.use("/api/v1/subscriptionplane", subscriptionPlaneRoute);
app.use("/api/v1/subscription", subscriptionRoute);
app.use("/api/v1/artist", artistRoute);

import adminAuthRoute from "../app/routes/ejs/auth/authRoute";
import adminDashboardRoute from "../app/routes/ejs/dashboard/dashboardRoute";

app.use(adminAuthRoute);
app.use(adminDashboardRoute);

export default app;
