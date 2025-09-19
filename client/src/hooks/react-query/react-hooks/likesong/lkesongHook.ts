import { useMutation, useQuery } from "@tanstack/react-query";
import { ALBUMS, LIKE_SONG } from "../../react-keys/querykeys";
import getLikeSong from "@/api/functions/likesong/getLike";
import likeSong from "@/api/functions/likesong/likeSong";
import toast from "react-hot-toast";
import { useGlobalHooks } from "@/hooks/globalHook";
import axios from "axios";

const useLikeSong = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: (songId: string) => likeSong(songId),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [LIKE_SONG] });
        queryClient.invalidateQueries({queryKey:[ALBUMS]})
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message;
        toast.error(msg);
      }
    },
  });
};

const useGetLikesong = () => {
  return useQuery({
    queryKey: [LIKE_SONG],
    queryFn: getLikeSong,
  });
};

export { useLikeSong, useGetLikesong };
