import mongoose from "mongoose";
import validator from "validator";
import { AlbumModel } from "../interface/albumModel";
import slugify from "slugify";

const albumSchema = new mongoose.Schema<AlbumModel>(
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
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    artistName: {
      type: String,
      required: true,
      trim: true,
      validator: [
        {
          validator: function (v: string) {
            return validator.isLength(v, { min: 3, max: 50 });
          },
          message: "Artist name must be between 3 and 50 characters long",
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
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "song" }],
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

albumSchema.pre("validate", async function (next) {
  if (this.isModified("title")) {
    let newSlug = slugify(this.title, { lower: true, strict: true });
    let slugExists = await Album.findOne({ slug: newSlug });
    let counter = 1;
    while (slugExists) {
      newSlug = `${newSlug}-${counter}`;
      slugExists = await Album.findOne({ slug: newSlug });
      counter++;
    }
    this.slug = newSlug;
  }
  next();
});

const Album = mongoose.model<AlbumModel>("album", albumSchema);

export default Album;
