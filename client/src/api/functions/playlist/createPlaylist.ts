import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const createplaylist = async (data: FormData) => {
  const response = await axiosInstance.post(
    endpoints.playlist.createPlaylist,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export default createplaylist;
