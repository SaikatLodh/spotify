import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const updatePlaylist = async (data: FormData, slug: string) => {
  const response = await axiosInstance.patch(
    `${endpoints.playlist.updatePlaylist}/${slug}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export default updatePlaylist;
