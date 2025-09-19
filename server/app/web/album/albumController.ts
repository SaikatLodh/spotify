import Album from "../../models/albumModel";
import Song from "../../models/songModel";
import LikedSong from "../../models/likedSongModel";
import { Response } from "express";
import ApiError from "../../config/apiError";
import ApiResponse from "../../config/apiResponse";
import STATUS_CODES from "../../config/httpStatusCode";
import { createAlbumSchema } from "../../helpers/validator/album/albumValidator";
import { RequestWithFile } from "../../interface/requestWithFile";
import { uploadFile, deleteImage } from "../../helpers/cloudinary";
import fs from "fs";
import { ALBUM, SONG } from "../../config/redisKeys";
import Radis from "../../config/redis";

class AlbumController {
  async createAlbum(req: RequestWithFile, res: Response) {
    try {
      const { title, artistName } = req.body;
      const artistId = req.user?._id.toString();
      const imageFile = req?.file?.path;

      const { error } = createAlbumSchema.validate(req.body);

      if (error) {
        fs.unlinkSync(imageFile!);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(
            new ApiError(error.details[0].message, STATUS_CODES.BAD_REQUEST)
          );
      }

      if (imageFile) {
        const uploadResult = await uploadFile(imageFile);

        if (!uploadResult) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Image upload failed",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        const album = await Album.create({
          title,
          artistName,
          imageUrl: { publicId: uploadResult.publicId, url: uploadResult.url },
          artistId,
        });

        if (!album) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Album creation failed",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }
        await Radis.del(`${ALBUM}:${artistId}`);
        return res
          .status(STATUS_CODES.CREATED)
          .json(
            new ApiResponse(
              STATUS_CODES.CREATED,
              {},
              "Album created successfully"
            )
          );
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

  async getAllAlbums(req: RequestWithFile, res: Response) {
    try {
      const albums = await Album.aggregate([
        { $match: { isDeleted: false, isPublished: true } },
      ]);

      if (!albums) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError("Albums not found", STATUS_CODES.INTERNAL_SERVER_ERROR)
          );
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, albums, "Albums fetched"));
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

  async getRecentAllAlbums(req: RequestWithFile, res: Response) {
    try {
      const albums = await Album.aggregate([
        { $match: { isDeleted: false, isPublished: true } },
        { $sort: { createdAt: -1 } },
        { $sample: { size: 12 } },
      ]);

      if (!albums) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError("Albums not found", STATUS_CODES.INTERNAL_SERVER_ERROR)
          );
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, albums, "Albums fetched"));
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

  async getTendAllAlbums(req: RequestWithFile, res: Response) {
    try {
      const albums = await Album.aggregate([
        { $match: { isDeleted: false, isPublished: true } },
        { $sample: { size: 20 } },
      ]);

      if (!albums) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError("Albums not found", STATUS_CODES.INTERNAL_SERVER_ERROR)
          );
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, albums, "Albums fetched"));
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

  async getMadeForYouAllAlbums(req: RequestWithFile, res: Response) {
    try {
      const albums = await Album.aggregate([
        { $match: { isDeleted: false, isPublished: true } },
        { $sample: { size: 12 } },
      ]);

      if (!albums) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError("Albums not found", STATUS_CODES.INTERNAL_SERVER_ERROR)
          );
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, albums, "Albums fetched"));
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

  async getSingelAlbum(req: RequestWithFile, res: Response) {
    try {
      const slugId = req.params.id;
      const album = await Album.aggregate([
        { $match: { slug: slugId, isDeleted: false } },
        {
          $lookup: {
            from: "users",
            localField: "artistId",
            foreignField: "_id",
            as: "artist",
          },
        },
        { $unwind: { path: "$artist", preserveNullAndEmptyArrays: true } },
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

      if (!album) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Album not found", STATUS_CODES.NOT_FOUND));
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, album, "Album fetched"));
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

  async getAllAlbumsBYArtist(req: RequestWithFile, res: Response) {
    try {
      const artistId = req.user?._id;

      const getRedis = await Radis.get(`${ALBUM}:${artistId}`);
      if (getRedis) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(
              STATUS_CODES.OK,
              JSON.parse(getRedis),
              "Albums fetched"
            )
          );
      }

      const albums = await Album.aggregate([
        { $match: { artistId, isDeleted: false } },
        { $sort: { createdAt: -1 } },
      ]);

      if (!albums) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError("Albums not found", STATUS_CODES.INTERNAL_SERVER_ERROR)
          );
      }

      await Radis.set(`${ALBUM}:${artistId}`, JSON.stringify(albums));

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, albums, "Albums fetched"));
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

  async getSingelAlbumByArtist(req: RequestWithFile, res: Response) {
    try {
      const slugId = req.params.id;
      const artistId = req.user?._id;

      const getRedis = await Radis.get(`${ALBUM}:${artistId}:${slugId}`);
      if (getRedis) {
        return res
          .status(STATUS_CODES.OK)
          .json(
            new ApiResponse(
              STATUS_CODES.OK,
              JSON.parse(getRedis),
              "Albums fetched"
            )
          );
      }

      const album = await Album.aggregate([
        { $match: { slug: slugId, artistId } },
        {
          $lookup: {
            from: "songs",
            localField: "songs",
            foreignField: "_id",
            as: "songs",
          },
        },
        { $unwind: { path: "$songs", preserveNullAndEmptyArrays: true } },

        {
          $project: {
            __v: 0,
            "songs.__v": 0,
          },
        },
      ]);

      if (!album) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json(new ApiError("Album not found", STATUS_CODES.NOT_FOUND));
      }

      await Radis.set(`${ALBUM}:${artistId}:${slugId}`, JSON.stringify(album));

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, album, "Album fetched"));
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

  async updateAlbum(req: RequestWithFile, res: Response) {
    try {
      const slugId = req.params.id;
      const artistId = req.user?._id.toString();
      const { title, artistName } = req.body;
      const imageFile = req?.file?.path;

      const { error } = createAlbumSchema.validate(req.body);

      if (error) {
        fs.unlinkSync(imageFile!);
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json(new ApiError(error.message, STATUS_CODES.BAD_REQUEST));
      }

      const album = await Album.findOne({ slug: slugId, artistId });

      if (!album) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You are not owner of this album",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      if (imageFile) {
        const deleteimage = await deleteImage(album.imageUrl?.publicId!);
        if (!deleteimage) {
          fs.unlinkSync(imageFile!);
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Image deletion failed",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        const uploadResult = await uploadFile(imageFile);

        if (!uploadResult) {
          return res
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(
              new ApiError(
                "Image upload failed",
                STATUS_CODES.INTERNAL_SERVER_ERROR
              )
            );
        }

        album.title = title;
        album.artistName = artistName;
        album.imageUrl = {
          publicId: uploadResult.publicId,
          url: uploadResult.url,
        };
      } else {
        album.title = title;
        album.artistName = artistName;
      }
      await album.save({ validateBeforeSave: false });

      await Radis.del(`${ALBUM}:${artistId}`);
      await Radis.del(`${ALBUM}:${artistId}:${slugId}`);

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, {}, "Album updated"));
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

  async deleteAlbum(req: RequestWithFile, res: Response) {
    try {
      const albumId = req.params.id;
      const slugId = req.params.slug;
      const artistId = req.user?._id.toString();

      const album = await Album.findOne({ _id: albumId, artistId });

      if (!album) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You are not owner of this album",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      album.isDeleted = true;
      album.isPublished = false;
      await album.save({ validateBeforeSave: false });

      await Song.updateMany({ albumId }, { isDeleted: true });
      for (const element of album.songs) {
        await LikedSong.findByIdAndUpdate(element, { isDeleted: true });
        await Song.findByIdAndUpdate(element, { isDeleted: true });
      }
      await Radis.del(`${ALBUM}:${artistId}`);
      await Radis.del(`${ALBUM}:${artistId}:${slugId}`);
      await Radis.del(`${SONG}:${albumId}`);

      for (const song of album.songs) {
        await Radis.del(`${SONG}:${albumId}:${song.toString()}`);
      }

      return res
        .status(STATUS_CODES.OK)
        .json(new ApiResponse(STATUS_CODES.OK, {}, "Album deleted"));
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

  async isPublishedAlbum(req: RequestWithFile, res: Response) {
    try {
      const albumId = req.params.id;
      const slugId = req.params.slug;
      const artistId = req.user?._id.toString();

      const album = await Album.findOne({ _id: albumId });

      if (!album) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json(
            new ApiError(
              "Something went wrong while fetching album ",
              STATUS_CODES.INTERNAL_SERVER_ERROR
            )
          );
      }

      if (album?.artistId.toString() !== artistId) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(
            new ApiError(
              "You are not owner of this album",
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }

      if (album.isPublished) {
        album.isPublished = !album.isPublished;
        await album.save({ validateBeforeSave: false });
        for (const element of album.songs) {
          await LikedSong.findByIdAndUpdate(element, { isDeleted: true });
          await Song.findByIdAndUpdate(element, { isDeleted: true });
        }
        await Radis.del(`${ALBUM}:${artistId}`);
        await Radis.del(`${ALBUM}:${artistId}:${slugId}`);
        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, {}, "Unpublished"));
      } else {
        album.isPublished = !album.isPublished;
        await album.save({ validateBeforeSave: false });
        for (const element of album.songs) {
          await LikedSong.findByIdAndUpdate(element, { isDeleted: false });
          await Song.findByIdAndUpdate(element, { isDeleted: false });
        }
        await Radis.del(`${ALBUM}:${artistId}`);
        await Radis.del(`${ALBUM}:${artistId}:${slugId}`);
        return res
          .status(STATUS_CODES.OK)
          .json(new ApiResponse(STATUS_CODES.OK, {}, "Published"));
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
}

export default new AlbumController();
