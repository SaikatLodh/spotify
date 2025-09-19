"use client";
import { AppDispatch } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export const useGlobalHooks = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  return { queryClient, router, dispatch };
};
