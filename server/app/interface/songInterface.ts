import { Types } from "mongoose";

export interface SongsInterface {
  title: string;
  imageUrl: {
    publicId: string;
    url: string;
  };
  audioUrl: {
    publicId: string;
    url: string;
  };
  duration: number;
  albumId?: Types.ObjectId;
  artistId?: Types.ObjectId;
  liked?: Types.ObjectId[];
  listners?: Types.ObjectId[];
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export { SongsInterface as SongDocument };
