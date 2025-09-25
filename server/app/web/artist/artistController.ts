import Album from "../../models/albumModel";
import Song from "../../models/songModel";
import ApiError from "../../config/apiError";
import ApiResponse from "../../config/apiResponse";
import STATUS_CODES from "../../config/httpStatusCode";
import { Request, Response } from "express";

class ArtistController {
  async getDashboard(req: Request, res: Response) {
    try {
      const artistId = req.user?._id;

      const [totalAlbums, totalSongs, totalListens] = await Promise.all([
        Album.countDocuments({ artistId, isDeleted: false, isPublished: true }),
        Song.countDocuments({ artistId, isDeleted: false }),
        Song.aggregate([{ $match: { artistId, isDeleted: false } }]),
        Song.aggregate([
          { $group: { _id: "$artistId", totalLiked: { $sum: "$liked" } } },
        ]),
      ]);

      const totalListensCount = totalListens.reduce((acc, song) => {
        const uniqueListeners = new Set(song.listners);
        return uniqueListeners.size;
      }, 0);

      const totalLikedSongCount = totalListens.reduce((acc, song) => {
        return acc + song.liked.length;
      }, 0);

      return res
        .status(STATUS_CODES.OK)
        .json(
          new ApiResponse(
            STATUS_CODES.OK,
            { totalAlbums, totalSongs, totalListensCount, totalLikedSongCount },
            "Dashboard fetched"
          )
        );
    } catch (error) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          new ApiError(
            error instanceof Error ? error.message : String(error),
            STATUS_CODES.BAD_REQUEST
          )
        );
    }
  }
}

export default new ArtistController();
