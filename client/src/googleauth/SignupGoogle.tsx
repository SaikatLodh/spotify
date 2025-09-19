import { useGoogleLogin } from "@react-oauth/google";
import { getUser, googlesignup, resetLoading } from "@/store/auth/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const SignupGoogle = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const responseGoogle = async (authResult: {
    authuser?: string;
    code?: string;
    prompt?: string;
    scope?: string;
    error?: string;
  }) => {
    try {
      if (authResult["code"]) {
        dispatch(googlesignup(authResult.code))
          .then((res) => {
            if (res?.payload?.message) {
              router.push("/");
              dispatch(getUser());
            }
          })
          .finally(() => {
            dispatch(resetLoading());
          });
      }
    } catch (error) {
      console.log("Error while Google Login...", error);
    }
  };
  const googleSignup = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <Button
      onClick={() => googleSignup()}
      variant="outline"
      className="w-full bg-slate-800 border-slate-600 text-slate-50 hover:bg-slate-700 hover:text-[white] transition-colors cursor-pointer"
    >
      <FcGoogle className="mr-2 h-4 w-4 text-red-500" /> Sign Up with Google
    </Button>
  );
};

export default SignupGoogle;
