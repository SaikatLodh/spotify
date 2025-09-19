import React from "react";

import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import toast from "react-hot-toast";
import { resetLoading, sendOtp } from "@/store/auth/authSlice";

const Resendtimer = () => {
  const [timer, setTimer] = React.useState(120);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const { email, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    if (timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setIsDisabled(false);
    }
  }, [timer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleResend = () => {
    if (!email || email.trim() === "") {
      toast.error("Email is null, undefined, or empty. Cannot resend OTP.");
      return;
    }
    dispatch(sendOtp(email as string))
      .then((res) => {
        if (res?.payload?.message) {
          setIsDisabled(true);
          setTimer(120);
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };
  return (
    <>
      <div className="flex items-center justify-center flex-col">
        <h4 className="pb-4">Didn’t received yet ?</h4>
        {isDisabled ? (
          <Button className="w-[90%] bg-[#4CAF50] hover:bg-[#4CAF50] text-white font-semibold transition-colors cursor-pointer">{`Resend it in ${formatTime(
            timer
          )}`}</Button>
        ) : (
          <Button
            disabled={isDisabled || loading}
            onClick={handleResend}
            className="w-[90%] bg-[#4CAF50] hover:bg-[#4CAF50] text-white font-semibold transition-colors cursor-pointer"
          >
            {loading ? "Resending..." : " Resend Email"}
          </Button>
        )}
      </div>
    </>
  );
};

export default Resendtimer;
