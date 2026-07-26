import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { UserPlus, Camera, Upload } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { registerThunk, registerSchema, selectAuthLoading } from "../../features/auth";
import type { RegisterFormData } from "../../features/auth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const resultAction = await dispatch(
        registerThunk({
          name: data.name,
          email: data.email,
          password: data.password,
          profileImage: selectedFile,
        })
      );
      if (registerThunk.fulfilled.match(resultAction)) {
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.error(resultAction.payload || "Registration failed");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6 glass-card p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-sm text-slate-400">
            Join IdeaCraft today to get started
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Image Picker */}
          <div className="flex flex-col items-center justify-center space-y-2 pb-2">
            <label className="relative cursor-pointer group">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-700 group-hover:border-indigo-500 flex items-center justify-center bg-slate-900/60 overflow-hidden transition-all">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-400">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">Upload</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-indigo-600 text-white shadow-md">
                <Upload className="w-3.5 h-3.5" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <span className="text-xs text-slate-400">Optional Profile Picture</span>
          </div>

          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Register
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
