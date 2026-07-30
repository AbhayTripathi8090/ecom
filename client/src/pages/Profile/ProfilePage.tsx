import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Camera,
  Upload,
  Check,
  Package,
  Heart,
  ShoppingBag,
  LogOut,
  ArrowRight,
  KeyRound,
  Lock,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectCurrentUser, uploadProfileImageThunk, getUserAvatarUrl, logoutThunk } from "../../features/auth";
import {
  fetchUserProfileThunk,
  updateUserProfileThunk,
  changePasswordThunk,
  selectUserProfile,
  selectUserLoading,
  selectUserUpdating,
} from "../../features/user";
import { selectCartItemCount } from "../../features/cart";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectCurrentUser);
  const profile = useAppSelector(selectUserProfile);
  const isLoading = useAppSelector(selectUserLoading);
  const isUpdating = useAppSelector(selectUserUpdating);
  const cartCount = useAppSelector(selectCartItemCount);

  const user = profile || authUser;
  const currentAvatarUrl = getUserAvatarUrl(user);

  // Profile Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Change Password state
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
        toast.error("Image file size must be under 5MB");
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
        toast.success("Profile image updated successfully!");
        setSelectedFile(null);
        setPreviewUrl(null);
        dispatch(fetchUserProfileThunk());
      } else {
        toast.error(resultAction.payload || "Failed to upload image");
      }
    } catch {
      toast.error("Error uploading profile image");
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
        toast.success("Profile updated successfully!");
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
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
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

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 pb-12">
      {/* Header Avatar & Profile Card */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          {/* Avatar Upload Container */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/50 bg-slate-900 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              {previewUrl || currentAvatarUrl ? (
                <img
                  src={previewUrl || currentAvatarUrl}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            {/* Upload Badge Button */}
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
              Save New Avatar
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

      {/* Customer Quick Access Hub Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-indigo-400" />
          Customer Hub
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Orders Card */}
          <Link
            to="/orders"
            className="group glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">My Orders</h3>
                <p className="text-xs text-slate-400 mt-1">Track & view past order history</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-indigo-400 group-hover:translate-x-1 transition-transform">
              View orders <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Wishlist Card */}
          <Link
            to="/wishlist"
            className="group glass-card p-5 rounded-2xl border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-rose-400 transition-colors">Wishlist</h3>
                <p className="text-xs text-slate-400 mt-1">Saved products & favorites</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-rose-400 group-hover:translate-x-1 transition-transform">
              View wishlist <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Cart Card */}
          <Link
            to="/cart"
            className="group glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                {cartCount > 0 && (
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    {cartCount} items
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">My Cart</h3>
                <p className="text-xs text-slate-400 mt-1">Manage items & checkout</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
              View cart <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Logout Card */}
          <button
            onClick={handleLogout}
            className="group glass-card p-5 rounded-2xl border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all flex flex-col justify-between text-left cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-rose-400 transition-colors">Sign Out</h3>
                <p className="text-xs text-slate-400 mt-1">Log out of your account</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-rose-400 group-hover:translate-x-1 transition-transform">
              Logout now <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </button>
        </div>
      </div>

      {/* Profile Details & Change Password Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edit Profile Form */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-400" />
            Edit Profile Details
          </h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              Update Details
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-400" />
            Security & Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
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
              Update Password
            </Button>
          </form>
        </div>
      </div>

      {/* Account Overview Footer Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-400" />
          Account Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-300">
          <div>
            <span className="text-slate-500 block text-xs">Role</span>
            <span className="font-medium text-slate-200 capitalize">{user?.role}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Phone Number</span>
            <span className="font-medium text-slate-200 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {phone || profile?.phone || "Not provided"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Cloudinary Profile Status</span>
            <span className="font-medium text-indigo-400">
              {user?.profileImage?.url ? "Uploaded & Active" : "Default Avatar"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

