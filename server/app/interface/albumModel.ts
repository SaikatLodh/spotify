import { Types } from "mongoose";

interface AlbumModel {
  title: string;
  slug: string;
  artistName: string;
  imageUrl?: {
    publicId: string;
    url: string;
  };
  songs: Types.ObjectId[];
  artistId: Types.ObjectId;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export { AlbumModel };
