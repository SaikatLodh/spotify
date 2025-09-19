import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { LikeSong } from "@/types";

const getLikeSong = async (): Promise<LikeSong[]> => {
  const response = await axiosInstance.get(
    `${endpoints.likeSong.getLikedSongs}`
  );
  return response.data.data as LikeSong[];
};

export default getLikeSong;
