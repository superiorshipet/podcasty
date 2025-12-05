import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UpdateUserData } from "../../types";

// Convert file to Base64
const convertBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = (error) => reject(error);
  });
};

// Reusable Input Field
const InputField = ({ label, id, type = "text", value, onChange, placeholder = "", helperText = "", ...props }: any) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
      {...props}
    />
    {helperText && (
      <p className="mt-1 text-xs text-gray-500">{helperText}</p>
    )}
  </div>
);

// Reusable TextArea Field
const TextAreaField = ({ label, id, value, onChange, placeholder = "" }: any) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      rows={3}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
    />
  </div>
);

export const EditProfile = (): JSX.Element => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword } = useAuth();

  // Form State - matching backend DTO fields
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePicture: "",
  });

  // File upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  // Load initial data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.userName || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
      });
      setImagePreview(user.profilePicture || "");
    }
  }, [user]);

  // Handle text input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image file selection
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const base64 = await convertBase64(file);
      setImagePreview(base64);
    }
  };

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassData({
      ...passData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      let profilePictureToSend = formData.profilePicture;

      // If a new image was selected, convert it to base64
      if (imageFile) {
        profilePictureToSend = await convertBase64(imageFile);
      }

      const dataToSend: UpdateUserData = {
        name: formData.name,
        bio: formData.bio,
        profilePicture: profilePictureToSend,
      };

      await updateProfile(dataToSend);
      setProfileSuccess("Profile updated successfully!");

      // Navigate after short delay
      setTimeout(() => navigate("/profile"), 1500);

    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Submit password change
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      setPassError("New passwords do not match.");
      return;
    }
    setPassLoading(true);
    setPassError(null);
    setPassSuccess(null);
    try {
      await changePassword({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      setPassSuccess("Password changed successfully!");
      setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setPassError(err.message || "Failed to change password.");
    } finally {
      setPassLoading(false);
    }
  };

  if (!user) {
    return <div className="w-full text-center pt-10">Loading profile...</div>;
  }

  return (
    <div className="bg-white overflow-x-hidden w-full min-h-screen relative">
      <main className="flex flex-col w-full max-w-3xl mx-auto items-start gap-8 pb-12 px-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>

        {/* Profile Information Card */}
        <div className="w-full p-6 border border-gray-200 rounded-lg shadow-sm">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>

            {/* Profile Picture Upload */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                {/* Preview */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-2xl">{user.userName?.charAt(0)?.toUpperCase()}</span>
                  )}
                </div>
                {/* File Input */}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#8b22b0] file:text-white hover:file:bg-[#7a1e9c]"
                  />
                  <p className="mt-1 text-xs text-gray-500">Choose an image from your device</p>
                </div>
              </div>
            </div>

            {/* Username */}
            <InputField
              label="Username"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleProfileChange}
            />

            {/* Bio */}
            <TextAreaField
              label="Bio"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleProfileChange}
              placeholder="Tell us about yourself..."
            />

            {profileError && (
              <div className="text-red-500 text-sm">{profileError}</div>
            )}
            {profileSuccess && (
              <div className="text-green-600 text-sm">{profileSuccess}</div>
            )}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isProfileLoading}
                className="flex items-center justify-center px-4 py-2 bg-[#8b22b0] text-white text-sm font-medium rounded-lg cursor-pointer disabled:opacity-50 hover:bg-[#7a1e9c]"
              >
                {isProfileLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-50 border border-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="w-full p-6 border border-gray-200 rounded-lg shadow-sm">
          <form onSubmit={handleChangePasswordSubmit} className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Change Password</h2>

            <InputField
              label="Current Password"
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passData.currentPassword}
              onChange={handlePasswordChange}
            />

            <InputField
              label="New Password"
              id="newPassword"
              name="newPassword"
              type="password"
              value={passData.newPassword}
              onChange={handlePasswordChange}
            />

            <InputField
              label="Confirm New Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passData.confirmPassword}
              onChange={handlePasswordChange}
            />

            {passError && (
              <div className="text-red-500 text-sm">{passError}</div>
            )}
            {passSuccess && (
              <div className="text-green-600 text-sm">{passSuccess}</div>
            )}

            <div className="flex">
              <button
                type="submit"
                disabled={passLoading}
                className="flex items-center justify-center px-4 py-2 bg-[#8b22b0] text-white text-sm font-medium rounded-lg cursor-pointer disabled:opacity-50 hover:bg-[#7a1e9c]"
              >
                {passLoading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};