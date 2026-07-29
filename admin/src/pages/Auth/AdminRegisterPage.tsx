import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { registerThunk, selectAuthLoading } from "../../features/auth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const AdminRegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    try {
      const resultAction = await dispatch(
        registerThunk({
          name,
          email,
          password,
          role: "admin",
        })
      );

      if (registerThunk.fulfilled.match(resultAction)) {
        toast.success("Admin Account Created Successfully!");
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(
          typeof resultAction.payload === "string"
            ? resultAction.payload
            : "Failed to register admin account."
        );
      }
    } catch {
      toast.error("An unexpected error occurred during admin registration.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Register Admin Account
          </h1>
          <p className="text-xs text-slate-400">
            Create an administrator account with store management privileges.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="Admin Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Admin Email *"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password *"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm Password *"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full cursor-pointer mt-2"
            isLoading={isLoading}
          >
            Create Admin Account
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">
            Already have an Admin account?{" "}
            <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
              Sign In Here
            </Link>
          </p>
          <p className="text-[11px] text-slate-500">
            Role-Based Admin Access Only
          </p>
        </div>
      </div>
    </div>
  );
};
