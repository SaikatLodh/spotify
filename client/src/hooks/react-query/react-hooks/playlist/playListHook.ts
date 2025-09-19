import createplaylist from "@/api/functions/playlist/createPlaylist";
import { useGlobalHooks } from "@/hooks/globalHook";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PLAYLIST } from "../../react-keys/querykeys";
import axios from "axios";
import getPlaylist from "@/api/functions/playlist/getPlaylist";
import getSinglePlaylist from "@/api/functions/playlist/getsinglePlaylist";
import updatePlaylist from "@/api/functions/playlist/updatePlaylist";
import deleteplaylist from "@/api/functions/playlist/deletePlaylist";
import addAndRemovePlaylist from "@/api/functions/playlist/addAndRemoveSong";

const useCreatePlaylist = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: createplaylist,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [PLAYLIST] });
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

const useGetPlaylist = () => {
  return useQuery({
    queryKey: [PLAYLIST],
    queryFn: getPlaylist,
  });
};

const useGetSinglePlaylist = (slug: string) => {
  return useQuery({
    queryKey: [PLAYLIST, slug],
    queryFn: () => getSinglePlaylist(slug),
  });
};

const useUpdatePlaylist = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: ({ data, slug }: { data: FormData; slug: string }) =>
      updatePlaylist(data, slug),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [PLAYLIST] });
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

const useDeletePlaylist = (slug: string) => {
  const { queryClient, router } = useGlobalHooks();
  return useMutation({
    mutationFn: () => deleteplaylist(slug),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [PLAYLIST] });
        router.push("/");
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

const useAddandRemoveSong = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: ({ slug, songId }: { slug: string; songId: string }) =>
      addAndRemovePlaylist(slug, songId),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [PLAYLIST] });
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

export {
  useCreatePlaylist,
  useGetPlaylist,
  useGetSinglePlaylist,
  useUpdatePlaylist,
  useDeletePlaylist,
  useAddandRemoveSong,
};
