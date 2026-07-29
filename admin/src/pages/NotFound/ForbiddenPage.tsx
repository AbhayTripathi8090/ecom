import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "../../components/ui/Button";

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
        <Lock className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-white">403 - Access Forbidden</h1>
      <p className="text-sm text-slate-400 max-w-md">
        Administrator authorization is required to view this area.
      </p>
      <Link to="/login">
        <Button variant="primary">Log In as Administrator</Button>
      </Link>
    </div>
  );
};
