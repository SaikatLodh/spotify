"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Resendtimer from "./Resendtimer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { resetLoading, verifyOtp } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";

interface OtpFormInputs {
  otp: number;
}
const VerifyOtp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { email } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const onSubmit = (data: OtpFormInputs) => {
    dispatch(verifyOtp({ email: email as string, otp: Number(data) }))
      .then((res) => {
        if (res?.payload?.message) {
          router.push("/sign-up");
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md bg-[#0A0A0A] border border-slate-700 text-slate-50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Enter Verification Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputOTP
              maxLength={4}
              pattern={REGEXP_ONLY_DIGITS}
              onComplete={onSubmit}
            >
              <InputOTPGroup className="flex justify-between w-[90%] m-auto *:rounded-lg! *:border!">
                <InputOTPSlot
                  index={0}
                  className="bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-400 focus-visible:ring-offset-slate-950 focus-visible:ring-[#4CAF50]"
                />
                <InputOTPSlot
                  index={1}
                  className="bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-400 focus-visible:ring-offset-slate-950 focus-visible:ring-[#4CAF50]"
                />
                <InputOTPSlot
                  index={2}
                  className="bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-400 focus-visible:ring-offset-slate-950 focus-visible:ring-[#4CAF50]"
                />
                <InputOTPSlot
                  index={3}
                  className="bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-400 focus-visible:ring-offset-slate-950 focus-visible:ring-[#4CAF50]"
                />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-muted-foreground text-sm text-center">
              You will be automatically redirected after the code is confirmed.
            </p>
          </CardContent>
          <Resendtimer />
        </Card>
      </div>
    </>
  );
};

export default VerifyOtp;
