import mongoose from "mongoose";
import { LikedSongInterface } from "../interface/likedSongInterface";

const likedSongSchema = new mongoose.Schema<LikedSongInterface>(
  {
    songId: { type: mongoose.Schema.Types.ObjectId, ref: "song" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const LikedSong = mongoose.model<LikedSongInterface>(
  "likedsong",
  likedSongSchema
);

export default LikedSong;
