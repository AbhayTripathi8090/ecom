import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { LogIn } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { loginThunk, loginSchema, selectAuthLoading } from "../../features/auth";
import type { LoginFormData } from "../../features/auth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const resultAction = await dispatch(loginThunk(data));
      if (loginThunk.fulfilled.match(resultAction)) {
        toast.success("Welcome back!");
        const role = resultAction.payload.user?.role;
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(resultAction.payload || "Login failed");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-slate-400">
            Sign in to access your account and orders
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline font-medium">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
