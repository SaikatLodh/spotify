import LikedSong from "../../models/likedSongModel";
import Song from "../../models/songModel";
import User from "../../models/userModel";
import { Request, Response } from "express";
import ApiError from "../../config/apiError";
import ApiResponse from "../../config/apiResponse";
import STATUS_CODES from "../../config/httpStatusCode";
import { LIKED_SONG } from "../../config/redisKeys";
import redis from "../../config/redis";

class LikeSongController {
  async likeSong(req: Request, res: Response) {
    try {
      const { songId } = req.params;
      const userId = req.user?._id;

      const findUser = await User.findById(userId);

      if (findUser?.subscriptionStatus === "Free") {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You need to upgrade your subscription to like this song",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const existingLike = await LikedSong.findOne({ songId, userId });

      if (!existingLike) {
        const newLike = new LikedSong({ songId, userId });
        await newLike.save();
        await Song.findByIdAndUpdate(songId, { $push: { liked: userId } });
        await redis.del(`${LIKED_SONG}:${userId}`);
        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, {}, "Song liked"));
      }

      if (!existingLike.isDeleted) {
        await LikedSong.findByIdAndUpdate(existingLike._id, {
          isDeleted: true,
        });
        await Song.findByIdAndUpdate(songId, {
          $pull: { liked: userId },
        });
        await redis.del(`${LIKED_SONG}:${userId}`);
        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, {}, "Song unliked"));
      } else {
        await LikedSong.findByIdAndUpdate(existingLike._id, {
          isDeleted: false,
        });
        await Song.findByIdAndUpdate(songId, {
          $push: { liked: userId },
        });
        await redis.del(`${LIKED_SONG}:${userId}`);
        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, {}, "Song liked"));
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  async getLikedSongs(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      const findUser = await User.findById(userId);

      if (findUser?.subscriptionStatus === "Free") {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You need to upgrade your subscription to like this song",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const getRedis = await redis.get(`${LIKED_SONG}:${userId}`);

      if (getRedis) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(
              STATUS_CODES.OK,
              JSON.parse(getRedis),
              "Liked Songs from cache"
            )
          );
      }

      const likedSongs = await LikedSong.aggregate([
        { $match: { userId, isDeleted: false } },
        {
          $lookup: {
            from: "songs",
            localField: "songId",
            foreignField: "_id",
            as: "song",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "artistId",
                  foreignField: "_id",
                  as: "artist",
                },
              },
              {
                $unwind: { path: "$artist", preserveNullAndEmptyArrays: true },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },
              {
                $project: {
                  __v: 0,
                  "artist.__v": 0,
                  "artist.password": 0,
                  "artist.isDeleted": 0,
                  "artist.isVerified": 0,
                  "artist.createdAt": 0,
                  "artist.updatedAt": 0,
                  "artist.forgotPasswordToken": 0,
                  "artist.forgotPasswordExpiry": 0,
                  "artist.fbId": 0,
                },
              },
            ],
          },
        },
        { $unwind: "$song" },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            __v: 0,
            "songs.__v": 0,
            "songs.artist.__v": 0,
            "songs.artist.password": 0,
            "songs.artist.isDeleted": 0,
            "songs.artist.isVerified": 0,
            "songs.artist.createdAt": 0,
            "songs.artist.updatedAt": 0,
            "songs.artist.forgotPasswordToken": 0,
            "songs.artist.forgotPasswordExpiry": 0,
            "songs.artist.fbId": 0,
          },
        },
      ]);

      if (!likedSongs)
        return res.status(STATUS_CODES.NOT_FOUND).json({
          message: "Something went wrong while fetching liked songs",
          status: STATUS_CODES.NOT_FOUND,
        });

      await redis.setnx(`${LIKED_SONG}:${userId}`, JSON.stringify(likedSongs));
      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, likedSongs, "Liked Songs"));
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }
}
export default new LikeSongController();
