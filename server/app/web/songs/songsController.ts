import Song from "../../models/songModel";
import Album from "../../models/albumModel";
import LikedSong from "../../models/likedSongModel";
import User from "../../models/userModel";
import ApiError from "../../config/apiError";
import ApiResponse from "../../config/apiResponse";
import STATUS_CODES from "../../config/httpStatusCode";
import { Response } from "express";
import { RequestWithFile } from "../../interface/requestWithFile";
import {
  uploadFile,
  uploadAudio,
  deleteImage,
  download,
} from "../../helpers/cloudinary";
import {
  createSongSchema,
  updateSongSchema,
} from "../../helpers/validator/songs/songsValidation";
import fs from "fs";
import { ALBUM, SONG } from "../../config/redisKeys";
import Radis from "../../config/redis";
import { ObjectId } from "mongodb";
import axios from "axios";

class SongsController {
  async createSong(req: RequestWithFile, res: Response) {
    try {
      const { title, albumId } = req.body;
      const artistId = req.user?._id.toString();
      const audioFile = (
        req?.files as { [fieldname: string]: Express.Multer.File[] }
      )?.audio?.[0]?.path;
      const imageFile = (
        req?.files as { [fieldname: string]: Express.Multer.File[] }
      )?.image?.[0]?.path;

      const { error } = createSongSchema.validate(req.body);
      if (error) {
        if (audioFile) fs.unlinkSync(audioFile);
        if (imageFile) fs.unlinkSync(imageFile);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const fingdAlbum = await Album.findOne({
        _id: albumId,
        isDeleted: false,
      });

      if (!fingdAlbum) {
        if (audioFile) fs.unlinkSync(audioFile);
        if (imageFile) fs.unlinkSync(imageFile);
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Album not found", STATUS_CODES.NOT_FOUND));
      }

      if (fingdAlbum.artistId.toString() !== artistId) {
        if (audioFile) fs.unlinkSync(audioFile);
        if (imageFile) fs.unlinkSync(imageFile);
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You are not owner of this album",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const audioUpload = await uploadAudio(audioFile as string);
      const imageUpload = await uploadFile(imageFile as string);

      if (audioUpload && imageUpload) {
        const newSong = await Song.create({
          title,
          albumId,
          artistId,
          audioUrl: {
            publicId: audioUpload?.publicId,
            url: audioUpload?.url,
          },
          imageUrl: {
            publicId: imageUpload?.publicId,
            url: imageUpload?.url,
          },
          duration: audioUpload?.duration || 0,
        });

        if (!newSong) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to create song",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        fingdAlbum.songs.push(newSong._id);
        await fingdAlbum.save({ validateBeforeSave: false });
        await Radis.del(`${ALBUM}:${artistId}`);
        await Radis.del(`${SONG}:${albumId}`);
        return res
          .status(STATUS_CODES.CREATED)
          .json(
            new ApiResponse(
              STATUS_CODES.CREATED,
              {},
              "Song created successfully"
            )
          );
      } else {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Failed to upload files",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  async getSongsBySearch(req: RequestWithFile, res: Response) {
    try {
      const name = req.query.name as string;

      const songs = await Song.aggregate([
        {
          $match: {
            isDeleted: false,
            title: { $regex: name, $options: "i" },
          },
        },
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
        { $sort: { createdAt: -1 } },
        {
          $project: {
            _v: 0,
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

      if (!songs) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Songs not found", STATUS_CODES.NOT_FOUND));
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, songs, "Songs fetched"));
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

  async getSongByAlbum(req: RequestWithFile, res: Response) {
    try {
      const albumId = req.params.albumId;
      const convertToObjectId = new ObjectId(albumId);

      const getSongFromCache = await Radis.get(`${SONG}:${albumId}`);

      if (getSongFromCache) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(
              STATUS_CODES.OK,
              JSON.parse(getSongFromCache),
              "Song fetched"
            )
          );
      }

      const songs = await Song.aggregate([
        {
          $match: {
            isDeleted: false,
            albumId: convertToObjectId,
          },
        },
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
        { $sort: { createdAt: -1 } },
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
      ]);

      if (!songs) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(
            new ApiError(
              "some thing went wrong while fetching songs",
              STATUS_CODES.NOT_FOUND
            )
          );
      }

      await Radis.set(`${SONG}:${albumId}`, JSON.stringify(songs));

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, songs, "Songs fetched"));
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

  async getSingelSong(req: RequestWithFile, res: Response) {
    try {
      const songId = req.params.songId;
      const albumId = req.params.albumId;

      const getSongFromCache = await Radis.get(`${SONG}:${albumId}:${songId}`);

      if (getSongFromCache) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(
              STATUS_CODES.OK,
              JSON.parse(getSongFromCache),
              "Song fetched"
            )
          );
      }
      const song = await Song.findOne({
        _id: songId,
        isDeleted: false,
      }).populate({
        path: "artistId",
        select:
          "-password -isDeleted -isVerified -createdAt -updatedAt -forgotPasswordToken -forgotPasswordExpiry -fbId -__v",
      });

      if (!song) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Song not found", STATUS_CODES.NOT_FOUND));
      }

      await Radis.set(`${SONG}:${albumId}:${songId}`, JSON.stringify(song));

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, song, "Song fetched"));
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

  async updateSong(req: RequestWithFile, res: Response) {
    try {
      const songId = req.params.songId;
      const albumId = req.params.albumId;
      const artistId = req.user?._id;
      const { title } = req.body;
      const imageFile = req?.file?.path;

      const { error } = updateSongSchema.validate(req.body);
      if (error) {
        if (imageFile) fs.unlinkSync(imageFile);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      const song = await Song.findOne({ _id: songId, artistId });

      if (!song) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You are not owner of this song",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const imageUpload = await uploadFile(imageFile as string);

      if (imageFile && imageUpload) {
        const deleteimage = await deleteImage(song.imageUrl.publicId);

        if (!deleteimage) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to delete image",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        const updatedSong = await Song.findByIdAndUpdate(
          songId,
          {
            title,

            imageUrl: {
              publicId: imageUpload?.publicId,
              url: imageUpload?.url,
            },
          },
          { new: true }
        );

        if (!updatedSong) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to update song",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }
        await Radis.del(`${SONG}:${albumId}`);
        await Radis.del(`${SONG}:${albumId}:${songId}`);

        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, {}, "Song updated"));
      } else {
        const updatedSong = await Song.findByIdAndUpdate(
          songId,
          {
            title,
          },
          { new: true }
        );

        if (!updatedSong) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to update song",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }
        await Radis.del(`${SONG}:${albumId}`);
        await Radis.del(`${SONG}:${albumId}:${songId}`);
        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, {}, "Song updated"));
      }
    } catch (error) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            error instanceof Error ? error.message : "Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  async deleteSong(req: RequestWithFile, res: Response) {
    try {
      const songId = req.params.songId;
      const albumId = req.params.albumId;
      const artistId = req.user?._id.toString();
      const song = await Song.findOne({ _id: songId, artistId });

      if (!song) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You are not owner of this song",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      const [fast, second] = await Promise.all([
        Song.updateOne({ _id: songId }, { isDeleted: true }),
        Album.findByIdAndUpdate(
          albumId,
          { $pull: { songs: songId } },
          { new: true }
        ),
        LikedSong.findOneAndUpdate(
          { songId },
          { isDeleted: true },
          { new: true }
        ),
      ]);

      if (!fast || !second) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Failed to delete song",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }
      await Radis.del(`${SONG}:${albumId}`);
      await Radis.del(`${SONG}:${albumId}:${songId}`);
      await Radis.del(`${ALBUM}:${artistId}`);
      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, {}, "Song deleted"));
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

  async listenSong(req: RequestWithFile, res: Response) {
    try {
      const songId = req.params.songId;
      const userId = req.user?._id;

      const findSong = await Song.findOne({ _id: songId, isDeleted: false });

      if (!findSong) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Song not found", STATUS_CODES.NOT_FOUND));
      }

      const ckeckListner =
        findSong && findSong.listners && findSong.listners.includes(userId);

      if (ckeckListner) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(STATUS_CODES.OK, {}, "You already listin this song")
          );
      } else {
        const listinSong = await Song.findByIdAndUpdate(
          songId,
          { $push: { listners: userId } },
          { new: true }
        );

        if (!listinSong) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Failed to listin song",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, {}, "Song listin"));
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

  async downloadsong(req: RequestWithFile, res: Response) {
    try {
      const publicId = req.params.publicId;
      const userId = req.user?._id;

      const findUser = await User.findById(userId);

      if (
        findUser?.subscriptionStatus === "Free" ||
        findUser?.subscriptionStatus === "Standard" ||
        findUser?.subscriptionStatus === "Pro"
      )
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You need to upgrade your subscription to like this song",
              STATUS_CODES.UNAUTHORIZED
            )
          );

      const result = download(publicId);

      if (!result) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Public id not found",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      const response = await axios.get(result, { responseType: "stream" });

      if (!response) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Failed to download song",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${publicId}.mp3"`
      );
      res.setHeader("Content-Type", "audio/mpeg");
      response.data.pipe(res);
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

export default new SongsController();
