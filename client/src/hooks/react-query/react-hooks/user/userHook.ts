import changePassword from "@/api/functions/user/changePassword";
import deleteAccount from "@/api/functions/user/deleteAccount";
import updateProfile from "@/api/functions/user/updateProfile";
import { useGlobalHooks } from "@/hooks/globalHook";
import { getUser, logout } from "@/store/auth/authSlice";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const useUpdateprofile = () => {
  const { dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        dispatch(getUser());
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

const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
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

const useDeleteAccount = () => {
  const { dispatch, router, queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        dispatch(logout());
        dispatch(getUser());
        queryClient.removeQueries();
        router.push("/log-in");
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

export { useUpdateprofile, useChangePassword, useDeleteAccount };
