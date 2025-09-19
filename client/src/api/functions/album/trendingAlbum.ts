import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { Album } from "@/types";

const getTrendingAlbum = async (): Promise<Album[]> => {
  const response = await axiosInstance.get(`${endpoints.album.trending}`);
  return response.data.data as Album[];
};

export default getTrendingAlbum;
