import { Types } from "mongoose";

interface LikedSongInterface {
  songId: Types.ObjectId;
  userId: Types.ObjectId;
  isDeleted?: boolean;
}

export { LikedSongInterface };
