import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";
import { Button } from "../../components/ui/Button";

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-rose-500/20 shadow-2xl text-center space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">403</h1>
          <h2 className="text-xl font-bold text-rose-300">Access Denied</h2>
          <p className="text-sm text-slate-400">
            You do not have permission to view this page or resource. Admin privileges are required to access this area.
          </p>
        </div>

        <div className="pt-4 flex items-center justify-center space-x-3">
          <Link to="/">
            <Button variant="primary" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
