"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { forgotSendEmail, resetLoading } from "@/store/auth/authSlice";

const sendMailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export type SendMailSchemaType = z.infer<typeof sendMailSchema>;

const ForgotPasswordMail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const form = useForm<z.infer<typeof sendMailSchema>>({
    resolver: zodResolver(sendMailSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<SendMailSchemaType> = (data) => {
    dispatch(forgotSendEmail(data.email)).finally(() => {
      dispatch(resetLoading());
    });
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md bg-[#0A0A0A] border border-slate-700 text-slate-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Send Email
            </CardTitle>
            <CardDescription>
              Enter your email to receive a reset password link.
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
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#4CAF50] hover:bg-[#4CAF50] text-white font-semibold transition-colors cursor-pointer"
                >
                  {loading ? "Sending..." : "Send Email"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ForgotPasswordMail;
