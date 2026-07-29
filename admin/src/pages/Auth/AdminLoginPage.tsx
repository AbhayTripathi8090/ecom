import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { loginThunk, selectAuthLoading, selectAuthError } from "../../features/auth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const AdminLoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useAppSelector(selectAuthLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const resultAction = await dispatch(loginThunk({ email, password }));
      if (loginThunk.fulfilled.match(resultAction)) {
        toast.success("Welcome back, Admin!");
        navigate(from, { replace: true });
      } else {
        toast.error(resultAction.payload || "Login failed. Ensure you have admin privileges.");
      }
    } catch {
      toast.error("An unexpected error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Control Portal</h1>
          <p className="text-xs text-slate-400">
            Sign in with authorized administrator credentials to manage store operations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Admin Email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full cursor-pointer" isLoading={isLoading}>
            Sign In to Dashboard
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">
            Need an Admin Account?{" "}
            <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
              Register Admin Account
            </Link>
          </p>
          <p className="text-[11px] text-slate-500">
            Role-Based Protected Area • Store Administration Only
          </p>
        </div>
      </div>
    </div>
  );
};
