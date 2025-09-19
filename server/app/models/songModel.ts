import mongoose from "mongoose";
import validator from "validator";
import { SongDocument } from "../interface/songInterface";

const songSchema = new mongoose.Schema<SongDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: [
        {
          validator: function (v: string) {
            return validator.isLength(v, { min: 3, max: 50 });
          },
          message: "Title must be between 3 and 50 characters long",
        },
      ],
    },
    imageUrl: {
      publicId: {
        type: String,
        required: true,
        trim: true,
      },
      url: {
        type: String,
        required: true,
        trim: true,
      },
    },
    audioUrl: {
      publicId: {
        type: String,
        required: true,
        trim: true,
      },
      url: {
        type: String,
        required: true,
        trim: true,
      },
    },
    duration: {
      type: Number,
      required: true,
      default: 0,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "album",
      required: true,
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    liked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
      },
    ],
    listners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Song = mongoose.model<SongDocument>("song", songSchema);

export default Song;
