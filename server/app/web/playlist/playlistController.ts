import Playlist from "../../models/playlistModel";
import User from "../../models/userModel";
import { Request, Response } from "express";
import ApiError from "../../config/apiError";
import ApiResponse from "../../config/apiResponse";
import STATUS_CODES from "../../config/httpStatusCode";
import { RequestWithFile } from "../../interface/requestWithFile";
import { uploadFile, deleteImage } from "../../helpers/cloudinary";
import { createPlaylistSchema } from "../../helpers/validator/playlist/playlistValidator";
import fs from "fs";
import { PLAYLIST } from "../../config/redisKeys";
import redis from "../../config/redis";
import { ObjectId } from "mongodb";
import logger from "../../helpers/logger";

class PlaylistController {
  createPlaylist = async (req: RequestWithFile, res: Response) => {
    try {
      const { title } = req.body;
      const userId = req.user?._id.toString();
      const image = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      ).image?.[0]?.path;
      logger.info(`Creating playlist: title=${title}, userId=${userId}`);

      const findUser = await User.findById(userId);

      if (
        findUser?.subscriptionStatus === "Free" ||
        findUser?.subscriptionStatus === "Standard"
      ) {
        fs.unlinkSync(image);
        logger.warn(`Free/Standard user attempted to create playlist: userId=${userId}`);
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You need to upgrade your subscription to like this song",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const { error } = createPlaylistSchema.validate(req.body);

      if (error) {
        if (image) fs.unlinkSync(image);
        logger.warn(`Validation error for playlist creation: ${error.details[0].message}`);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      if (image) {
        const imageUpload = image ? await uploadFile(image) : null;

        if (imageUpload) {
          const playlist = await Playlist.create({
            title,
            userId,
            imageUrl: {
              publicId: imageUpload?.publicId,
              url: imageUpload?.url,
            },
          });

          if (!playlist) {
            logger.error("Playlist creation failed");
            return res
              .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
              .json(
                new ApiError(
                  "Failed to create playlist",
                  STATUS_CODES.INTERNAL_SERVER_ERROR
                )
              );
          }
        }
      } else {
        const playlist = await Playlist.create({
          title,
          userId,
        });

        if (!playlist) {
          logger.error("Playlist creation failed");
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to create playlist",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }
      }

      await redis.del(`${PLAYLIST}:${userId}`);
      logger.info("Playlist created successfully");

      return res
        .status(STATUS_CODES.CREATED)
        .json(new ApiResponse(STATUS_CODES.CREATED, {}, "Playlist created"));
    } catch (error) {
      logger.error(`Error creating playlist: ${error instanceof Error ? error.message : "Internal Server Error"}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  };

  getPlaylists = async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id.toString();
      logger.info(`Fetching playlists for user: userId=${userId}`);

      const findUser = await User.findById(userId);

      if (
        findUser?.subscriptionStatus === "Free" ||
        findUser?.subscriptionStatus === "Standard"
      ) {
        logger.warn(`Free/Standard user attempted to fetch playlists: userId=${userId}`);
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You need to upgrade your subscription to like this song",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const getRedis = await redis.get(`${PLAYLIST}:${userId}`);
      if (getRedis) {
        const playlists = JSON.parse(getRedis);
        logger.info(`Playlists fetched from cache for user: userId=${userId}`);
        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(STATUS_CODES.OK, playlists, "Playlists fetched")
          );
      }

      const playlists = await Playlist.find({ userId, isDeleted: false });

      if (!playlists) {
        logger.error("Failed to fetch playlists from database");
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Something went wrong while fetching playlists",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      await redis.setnx(`${PLAYLIST}:${userId}`, JSON.stringify(playlists));
      logger.info(`Playlists fetched successfully for user: userId=${userId}, count=${playlists.length}`);
      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, playlists, "Playlists fetched"));
    } catch (error) {
      logger.error(`Error fetching playlists: ${error instanceof Error ? error.message : "Internal Server Error"}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  };

  getSinglePlaylist = async (req: Request, res: Response) => {
    try {
      const slugId = req.params.slugId;
      const userId = req.user?._id.toString();
      logger.info(`Fetching single playlist: slugId=${slugId}, userId=${userId}`);

      const findUser = await User.findById(userId);

      if (
        findUser?.subscriptionStatus === "Free" ||
        findUser?.subscriptionStatus === "Standard"
      ) {
        logger.warn(`Free/Standard user attempted to fetch playlist: userId=${userId}`);
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You need to upgrade your subscription to like this song",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const getRedis = await redis.get(`${PLAYLIST}:${userId}:${slugId}`);
      if (getRedis) {
        const playlist = JSON.parse(getRedis);
        logger.info(`Playlist fetched from cache: slugId=${slugId}, userId=${userId}`);
        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, playlist, "Playlist fetched"));
      }

      const playlist = await Playlist.aggregate([
        { $match: { slug: slugId, isDeleted: false } },
        {
          $lookup: {
            from: "songs",
            localField: "songs",
            foreignField: "_id",
            as: "songs",
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

        { $sort: { createdAt: -1 } },
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
      ]);

      if (!playlist) {
        logger.warn(`Playlist not found: slugId=${slugId}`);
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Playlist not found", STATUS_CODES.NOT_FOUND));
      }

      await redis.setnx(
        `${PLAYLIST}:${userId}:${slugId}`,
        JSON.stringify(playlist)
      );
      logger.info(`Playlist fetched successfully: slugId=${slugId}, userId=${userId}`);
      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, playlist, "Playlist fetched"));
    } catch (error) {
      logger.error(`Error fetching playlist: ${error instanceof Error ? error.message : "Internal Server Error"}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  };

  updatePlaylist = async (req: Request, res: Response) => {
    try {
      const slugId = req.params.slugId;
      const userId = req.user?._id.toString();
      const { title } = req.body;
      const image = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.image?.[0]?.path;
      logger.info(`Updating playlist: slugId=${slugId}, userId=${userId}`);

      const findUser = await User.findById(userId);

      if (
        findUser?.subscriptionStatus === "Free" ||
        findUser?.subscriptionStatus === "Standard"
      ) {
        fs.unlinkSync(image);
        logger.warn(`Free/Standard user attempted to update playlist: userId=${userId}`);
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You need to upgrade your subscription to like this song",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const { error } = createPlaylistSchema.validate(req.body);
      if (error) {
        if (image) fs.unlinkSync(image);
        logger.warn(`Validation error for playlist update: ${error.details[0].message}`);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const playlist = await Playlist.findOne({ slug: slugId, userId });

      if (!playlist) {
        logger.warn(`Playlist not found or not owned for update: slugId=${slugId}, userId=${userId}`);
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You are not owner of this playlist",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      if (image) {
        if (image)
          playlist.imageUrl?.publicId &&
            (await deleteImage(playlist?.imageUrl?.publicId));

        const imageUpload = image ? await uploadFile(image) : null;

        const updatePlaylist = await Playlist.findOneAndUpdate(
          { slug: slugId },
          {
            title,
            imageUrl: imageUpload ?? playlist.imageUrl,
          },
          { new: true }
        );

        if (!updatePlaylist) {
          logger.error("Playlist update failed");
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Internal Server Error",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        await redis.del(`${PLAYLIST}:${userId}`);
        await redis.del(`${PLAYLIST}:${userId}:${slugId}`);
        logger.info("Playlist updated successfully");

        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, {}, "Playlist updated"));
      } else {
        playlist.title = title;
        await playlist.save({ validateBeforeSave: false });
        await redis.del(`${PLAYLIST}:${userId}`);
        await redis.del(`${PLAYLIST}:${userId}:${slugId}`);
        logger.info("Playlist updated successfully");
        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, {}, "Playlist updated"));
      }
    } catch (error) {
      logger.error(`Error updating playlist: ${error instanceof Error ? error.message : "Internal Server Error"}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  };

  deletePlaylist = async (req: Request, res: Response) => {
    try {
      const slugId = req.params.slugId;
      const userId = req.user?._id.toString();
      logger.info(`Deleting playlist: slugId=${slugId}, userId=${userId}`);

      const findUser = await User.findById(userId);

      if (
        findUser?.subscriptionStatus === "Free" ||
        findUser?.subscriptionStatus === "Standard"
      ) {
        logger.warn(`Free/Standard user attempted to delete playlist: userId=${userId}`);
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You need to upgrade your subscription to like this song",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const playlist = await Playlist.findOne({ slug: slugId, userId });

      if (!playlist) {
        logger.warn(`Playlist not found or not owned for deletion: slugId=${slugId}, userId=${userId}`);
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You are not owner of this playlist",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      playlist.isDeleted = true;
      await playlist.save({ validateBeforeSave: false });
      await redis.del(`${PLAYLIST}:${userId}`);
      await redis.del(`${PLAYLIST}:${userId}:${slugId}`);
      logger.info("Playlist deleted successfully");
      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, {}, "Playlist deleted"));
    } catch (error) {
      logger.error(`Error deleting playlist: ${error instanceof Error ? error.message : "Internal Server Error"}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  };

  addAndRemoveSongToPlaylist = async (req: Request, res: Response) => {
    try {
      const slugId = req.params.slugId;
      const songId = req.params.songId;
      const userId = req.user?._id.toString();
      logger.info(`Adding/removing song to/from playlist: slugId=${slugId}, songId=${songId}, userId=${userId}`);

      const findUser = await User.findById(userId);

      if (
        findUser?.subscriptionStatus === "Free" ||
        findUser?.subscriptionStatus === "Standard"
      ) {
        logger.warn(`Free/Standard user attempted to modify playlist: userId=${userId}`);
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You need to upgrade your subscription to like this song",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const objectId = new ObjectId(songId);
      const playlist = await Playlist.findOne({ slug: slugId, userId });

      if (!playlist) {
        logger.warn(`Playlist not found or not owned for modification: slugId=${slugId}, userId=${userId}`);
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You are not owner of this playlist",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const checkSongs =
        playlist && playlist.songs && playlist.songs.includes(objectId);

      if (checkSongs) {
        const pullSong = await Playlist.findOneAndUpdate(
          { slug: slugId },
          {
            $pull: { songs: songId },
          },
          { new: true }
        );

        if (!pullSong) {
          logger.error("Failed to remove song from playlist");
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Internal Server Error",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }
        await redis.del(`${PLAYLIST}:${userId}`);
        await redis.del(`${PLAYLIST}:${userId}:${slugId}`);
        logger.info("Song removed from playlist successfully");
        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(STATUS_CODES.OK, {}, "Song removed from playlist ")
          );
      } else {
        const pushSong = await Playlist.findOneAndUpdate(
          { slug: slugId },
          {
            $push: { songs: songId },
          },
          { new: true }
        );

        if (!pushSong) {
          logger.error("Failed to add song to playlist");
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Internal Server Error",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        await redis.del(`${PLAYLIST}:${userId}`);
        await redis.del(`${PLAYLIST}:${userId}:${slugId}`);
        logger.info("Song added to playlist successfully");

        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(STATUS_CODES.OK, {}, "Song added to playlist ")
          );
      }
    } catch (error) {
      logger.error(`Error modifying playlist: ${error instanceof Error ? error.message : "Internal Server Error"}`);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  };
}

export default new PlaylistController();
