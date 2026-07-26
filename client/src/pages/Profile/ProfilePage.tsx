import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { User as UserIcon, Mail, Phone, MapPin, Camera, Upload, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectCurrentUser, uploadProfileImageThunk, getUserAvatarUrl } from "../../features/auth";
import {
  fetchUserProfileThunk,
  updateUserProfileThunk,
  selectUserProfile,
  selectUserLoading,
  selectUserUpdating,
} from "../../features/user";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectCurrentUser);
  const profile = useAppSelector(selectUserProfile);
  const isLoading = useAppSelector(selectUserLoading);
  const isUpdating = useAppSelector(selectUserUpdating);

  const user = profile || authUser;
  const currentAvatarUrl = getUserAvatarUrl(user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

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
        })
      );
      if (updateUserProfileThunk.fulfilled.match(resultAction)) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(resultAction.payload || "Failed to update profile");
      }
    } catch {
      toast.error("Error updating profile");
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
    <div className="max-w-4xl mx-auto py-8 space-y-8">
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

      {/* Profile Form & Info Grid */}
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
            <Button type="submit" isLoading={isUpdating} variant="primary" size="sm">
              <Check className="w-4 h-4 mr-1.5" />
              Update Details
            </Button>
          </form>
        </div>

        {/* Account Additional Details */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            Account Overview
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <span className="text-slate-500 block text-xs">Role</span>
              <span className="font-medium text-slate-200 capitalize">{user?.role}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Phone Number</span>
              <span className="font-medium text-slate-200 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {profile?.phone || "Not provided"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Profile Image Cloudinary Status</span>
              <span className="font-medium text-slate-200">
                {user?.profileImage?.url ? "Uploaded & Active" : "Default Avatar"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
