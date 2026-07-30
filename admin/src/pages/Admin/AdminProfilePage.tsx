import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ShieldCheck,
  User as UserIcon,
  Mail,
  Phone,
  Camera,
  Upload,
  Check,
  KeyRound,
  Lock,
  Shield,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectCurrentUser, uploadProfileImageThunk, getUserAvatarUrl } from "../../features/auth";
import {
  fetchUserProfileThunk,
  updateUserProfileThunk,
  changePasswordThunk,
  selectUserProfile,
  selectUserLoading,
  selectUserUpdating,
} from "../../features/user";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const AdminProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectCurrentUser);
  const profile = useAppSelector(selectUserProfile);
  const isLoading = useAppSelector(selectUserLoading);
  const isUpdating = useAppSelector(selectUserUpdating);

  const user = profile || authUser;
  const currentAvatarUrl = getUserAvatarUrl(user);

  // Profile Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(profile?.phone || "");
    }
  }, [user, profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Avatar image file size must be under 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;
    setIsUploadingImage(true);
    try {
      const resultAction = await dispatch(uploadProfileImageThunk(selectedFile));
      if (uploadProfileImageThunk.fulfilled.match(resultAction)) {
        toast.success("Admin avatar updated successfully!");
        setSelectedFile(null);
        setPreviewUrl(null);
        dispatch(fetchUserProfileThunk());
      } else {
        toast.error(resultAction.payload || "Failed to upload avatar image");
      }
    } catch {
      toast.error("Error uploading avatar image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        updateUserProfileThunk({
          name,
          email,
          phone,
        })
      );
      if (updateUserProfileThunk.fulfilled.match(resultAction)) {
        toast.success("Admin profile updated successfully!");
        dispatch(fetchUserProfileThunk());
      } else {
        toast.error(resultAction.payload || "Failed to update profile");
      }
    } catch {
      toast.error("Error updating profile");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setIsChangingPassword(true);
    try {
      const resultAction = await dispatch(
        changePasswordThunk({
          currentPassword,
          newPassword,
        })
      );
      if (changePasswordThunk.fulfilled.match(resultAction)) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(resultAction.payload || "Failed to change password");
      }
    } catch {
      toast.error("Error changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div>
        <div className="flex items-center space-x-3">
          <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Profile & Preferences</h1>
            <p className="text-sm text-slate-400">Manage your administrative credentials and personal details</p>
          </div>
        </div>
      </div>

      {/* Avatar Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          {/* Avatar Upload Container */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/50 bg-slate-950 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              {previewUrl || currentAvatarUrl ? (
                <img
                  src={previewUrl || currentAvatarUrl}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </div>
              )}
            </div>

            {/* Camera Upload Badge Button */}
            <label className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg transition-all">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user?.name || "Administrator"}</h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                {user?.role || "admin"}
              </span>
            </div>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              {user?.email}
            </p>
            <p className="text-xs text-slate-500">
              System Admin ID: <code className="text-slate-300 font-mono">{user?._id || user?.id || "N/A"}</code>
            </p>
          </div>
        </div>

        {/* Selected Image Save Action Button */}
        {selectedFile && (
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleUploadImage}
              isLoading={isUploadingImage}
              size="sm"
              variant="primary"
            >
              <Upload className="w-4 h-4 mr-1.5" />
              Save Avatar Image
            </Button>
            <Button
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              size="sm"
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Main Grid: Details Form & Password Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edit Profile Form */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-400" />
              Administrator Details
            </h3>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-4 pt-2">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Admin Name"
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
            />
            <Button type="submit" isLoading={isUpdating} variant="primary" size="sm">
              <Check className="w-4 h-4 mr-1.5" />
              Update Profile Info
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              Security & Password
            </h3>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit" isLoading={isChangingPassword} variant="primary" size="sm">
              <Lock className="w-4 h-4 mr-1.5" />
              Change Password
            </Button>
          </form>
        </div>
      </div>

      {/* Account System Status Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          Administrative Authorization & System Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-xs text-slate-500 block font-medium uppercase tracking-wider">Access Privilege</span>
            <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Full Superadmin Rights
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-xs text-slate-500 block font-medium uppercase tracking-wider">Contact Phone</span>
            <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-400" /> {phone || "Not configured"}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-xs text-slate-500 block font-medium uppercase tracking-wider">Cloudinary Avatar</span>
            <span className="text-sm font-semibold text-indigo-400">
              {user?.profileImage?.url ? "Active Cloud Avatar" : "Default Generated Initial"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
