import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { registerThunk, registerSchema, selectAuthLoading } from "../../features/auth";
import type { RegisterFormData } from "../../features/auth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);

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

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const resultAction = await dispatch(
        registerThunk({
          name: data.name,
          email: data.email,
          password: data.password,
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
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-sm text-slate-400">
            Join AuraMarket today to get started
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
