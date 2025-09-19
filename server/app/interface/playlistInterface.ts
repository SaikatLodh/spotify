import { Types } from "mongoose";

interface PlaylistInterface {
  title: string;
  slug: string;
  imageUrl?: {
    publicId: string;
    url: string;
  };
  coverImageUrl?: {
    publicId: string;
    url: string;
  };
  userId: Types.ObjectId;
  songs?: Types.ObjectId[];
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export { PlaylistInterface };
