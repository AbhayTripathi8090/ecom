import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404 - Page Not Found</h1>
      <p className="text-slate-400 max-w-md text-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary">Return Home</Button>
      </Link>
    </div>
  );
};
