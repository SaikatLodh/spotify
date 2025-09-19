"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUser, login, resetLoading } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import GoogleLoginWrapper from "@/googleauth/GoogleLoginWrapper";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .max(30, {
      message: "Password must be at most 30 characters.",
    }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const savedEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("savedEmail") || ""
      : "";

  const savedPassword =
    typeof window !== "undefined"
      ? localStorage.getItem("savedPassword") || ""
      : "";
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (savedEmail) {
      form.setValue("email", savedEmail);
      form.setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, [savedEmail, savedPassword, form]);
  type LoginFormInputsType = z.infer<typeof loginSchema>;

  const onSubmit: SubmitHandler<LoginFormInputsType> = (data) => {
    dispatch(login(data))
      .then((res) => {
        if (res?.payload?.message) {
          localStorage.removeItem("accessToken");

          if (rememberMe) {
            localStorage.setItem("savedEmail", data.email);
            localStorage.setItem("savedPassword", data.password);
          } else {
            localStorage.removeItem("savedEmail");
            localStorage.removeItem("savedPassword");
          }
          router.push("/");
          dispatch(getUser());
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
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Login to your account
            </CardTitle>
            <CardDescription>
              Enter your email and password to access the Spotify app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-400 focus-visible:ring-offset-slate-950 focus-visible:ring-[#4CAF50]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-400 focus-visible:ring-offset-slate-950 focus-visible:ring-[#4CAF50] pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 cursor-pointer" />
                            ) : (
                              <Eye className="h-5 w-5 cursor-pointer" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#4CAF50] hover:bg-[#4CAF50] text-white font-semibold transition-colors cursor-pointer"
                >
                  {loading ? "Processing..." : " Sign In"}
                </Button>
              </form>
            </Form>

            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor="remember-me">Remember me</Label>
              </div>
              <Link href="/forgot-password-mail" className="text-sm">
                Forgot Password
              </Link>
            </div>

            {/* Separator and Social Sign-in Buttons */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <GoogleLoginWrapper />
            </div>

            <div className="mt-5">
              <Link href="/send-mail">Don&apos;t have an account? Sign Up</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
