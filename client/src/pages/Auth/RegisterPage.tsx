import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { UserPlus, Camera, Upload } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { registerThunk, selectAuthLoading } from "../../features/auth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),

    confirmPassword: z
      .string()
      .min(8, "Please confirm your password"),

    role: z.enum(["user", "admin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");

 const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<RegisterFormValues>({
  resolver: zodResolver(registerFormSchema),
  defaultValues: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
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

 const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
  try {
    const resultAction = await dispatch(
      registerThunk({
        name: data.name,
        email: data.email,
        password: data.password,
        role: selectedRole,
        profileImage: selectedFile,
      })
    );

    if (registerThunk.fulfilled.match(resultAction)) {
      toast.success(
        selectedRole === "admin"
          ? "Admin account created successfully!"
          : "Account created successfully!"
      );

      navigate(selectedRole === "admin" ? "/admin/dashboard" : "/");
    } else {
      toast.error(
        typeof resultAction.payload === "string"
          ? resultAction.payload
          : "Registration failed"
      );
    }
  } catch {
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Account Type</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as "user" | "admin")}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="user">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-xs text-slate-400">
              {selectedRole === "admin"
                ? "Admin accounts can access the dashboard after sign-in."
                : "Customer accounts can browse products and place orders."}
            </p>
          </div>

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
