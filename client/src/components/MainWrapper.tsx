"use client";
import expireSubscription from "@/api/functions/subscription/expireSubcription";
import { getUser, refreshToken, resetLoading } from "@/store/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const validateExpireSubscription = async () => {
    await expireSubscription();
  };

  useEffect(() => {
    dispatch(refreshToken())
      .then((res) => {
        if (res?.payload?.status === 200) {
          dispatch(getUser());
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  }, [dispatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(refreshToken());
    }, 14 * 60 * 1000);
    return () => clearInterval(intervalId);
  });

  useEffect(() => {
    if (user?.subscription && user?.subscription.expitreDate < new Date()) {
      validateExpireSubscription();
    }
  }, [user]);
  return <>{children} </>;
};

export default MainWrapper;
