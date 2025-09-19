"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
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

import { Eye, EyeOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { forgotResetPassword, resetLoading } from "@/store/auth/authSlice";

const forgotPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters.",
      })
      .max(30, {
        message: "Password must be at most 30 characters.",
      }),
    confirmPassword: z
      .string()
      .min(6, {
        message: "Confirm password must be at least 6 characters.",
      })
      .max(30, {
        message: "Confirm password must be at most 30 characters.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordSchemaType> = (data) => {
    dispatch(forgotResetPassword({ token, data }))
      .then((res) => {
        if (res?.payload?.message) {
          router.push("/log-in");
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md bg-[#0A0A0A] border border-slate-700 text-slate-50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Forgot Password
          </CardTitle>
          <CardDescription>
            Enter your new password and confirm it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your new password"
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your confirm password"
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
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
