import React, { useEffect } from "react";
import { User as UserIcon, Mail, Phone, MapPin } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectCurrentUser } from "../../features/auth";
import {
  fetchUserProfileThunk,
  selectUserProfile,
  selectUserLoading,
} from "../../features/user";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectCurrentUser);
  const profile = useAppSelector(selectUserProfile);
  const isLoading = useAppSelector(selectUserLoading);

  useEffect(() => {
    dispatch(fetchUserProfileThunk());
  }, [dispatch]);

  const user = profile || authUser;

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 flex items-center space-x-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/30">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">{user?.name || "User Profile"}</h1>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            {user?.email}
          </p>
          <span className="inline-block px-2.5 py-0.5 mt-2 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
            {user?.role || "user"}
          </span>
        </div>
      </div>

      {/* Account Info Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-400" />
            Personal Details
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <span className="text-slate-500 block text-xs">Full Name</span>
              <span className="font-medium text-slate-200">{user?.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Email Address</span>
              <span className="font-medium text-slate-200">{user?.email}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Phone Number</span>
              <span className="font-medium text-slate-200 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {profile?.phone || "Not provided"}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            Address Information
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <span className="text-slate-500 block text-xs">Street Address</span>
              <span className="font-medium text-slate-200">
                {profile?.address?.street || "No address saved"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">City / State / Zip</span>
              <span className="font-medium text-slate-200">
                {[profile?.address?.city, profile?.address?.state, profile?.address?.zipCode]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Country</span>
              <span className="font-medium text-slate-200">
                {profile?.address?.country || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
