"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useDeleteAccount } from "@/hooks/react-query/react-hooks/user/userHook";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const deleteAccountSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

const DeleteAccount = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const deleteAccountMutation = useDeleteAccount();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const onSubmit = (data: DeleteAccountFormData) => {
    if (data.email !== user?.email) {
      setError("email", { message: "Email does not match your account email" });
      return;
    }
    deleteAccountMutation.mutate();
  };

  return (
    <div className=" p-4 pt-[30px]">
      <h2 className="text-2xl font-semibold mb-4 text-red-600">
        Delete Account
      </h2>
      <p className="mb-4 text-sm text-red-500">
        Warning: This action is irreversible. Please enter your email to confirm
        account deletion.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
            className="mt-3 bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-400 focus-visible:ring-offset-slate-950 focus-visible:ring-red-600 pr-10"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || deleteAccountMutation.isPending}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors cursor-pointer"
        >
          {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
        </Button>
      </form>
    </div>
  );
};

export default DeleteAccount;
