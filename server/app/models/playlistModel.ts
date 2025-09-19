import mongoose from "mongoose";
import validator from "validator";
import { PlaylistInterface } from "../interface/playlistInterface";
import slugify from "slugify";

const playlistSchema = new mongoose.Schema<PlaylistInterface>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: [
        {
          validator: (value: string) => {
            return validator.isLength(value, { min: 3, max: 50 });
          },
          message: "Title must be between 3 and 50 characters long",
        },
      ],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    imageUrl: {
      publicId: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "song",
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

playlistSchema.pre("validate", async function (next) {
  if (this.isModified("title")) {
    let newSlug = slugify(this.title, { lower: true, strict: true });
    let slugExists = await Playlist.findOne({ slug: newSlug });
    let counter = 1;
    while (slugExists) {
      newSlug = `${newSlug}-${counter}`;
      slugExists = await Playlist.findOne({ slug: newSlug });
      counter++;
    }
    this.slug = newSlug;
  }
  next();
});

const Playlist = mongoose.model<PlaylistInterface>("playlist", playlistSchema);

export default Playlist;
