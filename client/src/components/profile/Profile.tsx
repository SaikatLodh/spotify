"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateprofile } from "@/hooks/react-query/react-hooks/user/userHook";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useState } from "react";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email(),
  profilePicture: z.any().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  const updateProfileMutation = useUpdateprofile();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("fullName", user.fullName);
      if (user.profilePicture?.url) {
        setPreviewImage(user.profilePicture.url);
      }
    }
  }, [user, setValue]);

  const profilePictureFile = watch("profilePicture");

  useEffect(() => {
    if (profilePictureFile && profilePictureFile.length > 0) {
      const file = profilePictureFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profilePictureFile]);

  const onSubmit = (data: ProfileFormData) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    // email is not changeable, so no need to send it for update
    if (data.profilePicture && data.profilePicture.length > 0) {
      formData.append("profilePicture", data.profilePicture[0]);
    }
    updateProfileMutation.mutate(formData);
  };

  return (
    <div className=" p-4 pt-[30px]">
      <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-5">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Your full name"
            {...register("fullName")}
            aria-invalid={errors.fullName ? "true" : "false"}
            className="mt-3 bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-400 focus-visible:ring-offset-slate-950 focus-visible:ring-[#4CAF50] pr-10"
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email </Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email"
            {...register("email")}
            disabled
            className="bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-400 focus-visible:ring-offset-slate-950 focus-visible:ring-[#4CAF50] pr-10 mt-3"
          />
        </div>

        <div>
          <Label htmlFor="profilePicture">Profile Picture</Label>
          <div className="flex items-center space-x-4">
            <Avatar className="mt-3 w-15 h-15 object-cover">
              {previewImage ? (
                <AvatarImage
                  src={previewImage}
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <AvatarFallback className="border border-white">
                  {user?.fullName?.[0] || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              {...register("profilePicture")}
              disabled={
                user?.faceBookavatar || user?.gooleavatar ? true : false
              }
              className="mt-3 bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-400 focus-visible:ring-offset-slate-950 focus-visible:ring-[#4CAF50]  p-3"
            />
          </div>
          {errors.profilePicture && (
            <p className="text-red-600 text-sm mt-1">
              {errors.profilePicture.message as string}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || updateProfileMutation.isPending}
          className="w-full bg-[#4CAF50] hover:bg-[#4CAF50] text-white font-semibold transition-colors cursor-pointer"
        >
          {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
};

export default Profile;
