import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // (1) استدعاء الـ Context
import { UpdateUserData } from "../../types"; // (2) استدعاء الـ Type

// --- المكونات الفرعية (Reusable Components) ---
// (هذه المكونات كانت موجودة في ملفك، وهذا ممتاز)
const InputField = ({ label, id, type = "text", value, onChange, placeholder = "", helperText = "", ...props }: any) => (
  <div className="w-full">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 [font-family:'Arimo-Regular',Helvetica]"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm [font-family:'Arimo-Regular',Helvetica]"
      {...props}
    />
    {helperText && (
      <p className="mt-1 text-xs text-gray-500 [font-family:'Arimo-Regular',Helvetica]">
        {helperText}
      </p>
    )}
  </div>
);

const TextAreaField = ({ label, id, value, onChange, placeholder = "" }: any) => (
  <div className="w-full">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 [font-family:'Arimo-Regular',Helvetica]"
    >
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      rows={3}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm [font-family:'Arimo-Regular',Helvetica]"
    />
  </div>
);
// --- نهاية المكونات الفرعية ---


export const EditProfile = (): JSX.Element => {
  const navigate = useNavigate();
  // (3) جلب المستخدم والدوال من الـ Context
  const { user, updateProfile, changePassword } = useAuth();

  // (4) تعريف الـ State للفورم الأساسي
  const [formData, setFormData] = useState<UpdateUserData>({
    username: "",
    email: "",
    bio: "",
    avatarUrl: "",
  });
  
  // (5) تعريف الـ State لفورم كلمة المرور
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // (6) تعريف حالات التحميل والخطأ (منفصلة لكل فورم)
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  // (7) ملء الفورم ببيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      });
    }
  }, [user]); // سيعمل هذا عند تحميل "user"

  // دالة موحدة لتحديث الفورم
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  // دالة موحدة لتحديث فورم كلمة المرور
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassData({
      ...passData,
      [e.target.name]: e.target.value,
    });
  };

  // (8) دالة إرسال تحديث البروفايل
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileError(null);
    try {
      await updateProfile(formData);
      navigate("/profile"); // بعد النجاح، اذهب للبروفايل
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setIsProfileLoading(false);
    }
  };

  // (9) دالة إرسال تغيير كلمة المرور
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
      // مسح حقول كلمة المرور
      setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setPassError(err.message || "Failed to change password.");
    } finally {
      setPassLoading(false);
    }
  };

  // (10) التأكد من أن "user" قد تم تحميله
  if (!user) {
    return <div className="w-full text-center [font-family:'Arimo',Helvetica] pt-10">Loading profile...</div>;
  }

  return (
    <div className="bg-white overflow-x-hidden w-full min-h-screen relative">
      {/* (11) تم حذف الـ Navbar المكرر من هنا */}

      {/* --- Main Content --- */}
      <main className="flex flex-col w-full max-w-3xl mx-auto items-start gap-8 pb-12 px-4">
        <h1 className="text-2xl font-bold text-gray-900 [font-family:'Arimo-Regular',Helvetica]">
          Edit Profile
        </h1>

        {/* --- Profile Information Card --- */}
        <div className="w-full p-6 border border-gray-200 rounded-lg shadow-sm">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 [font-family:'Arimo-Regular',Helvetica]">
              Profile Information
            </h2>

            <InputField
              label="Profile Picture URL"
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleProfileChange}
              helperText="Enter a URL for your profile picture"
            />

            <InputField
              label="Username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleProfileChange}
            />

            <TextAreaField
              label="Bio"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleProfileChange}
              placeholder="Tell us about yourself..."
            />

            <InputField
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleProfileChange}
            />

            {profileError && (
              <div className="text-red-500 text-sm [font-family:'Arimo',Helvetica]">
                {profileError}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isProfileLoading}
                className="all-[unset] box-border flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-pointer disabled:opacity-50"
              >
                {isProfileLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="all-[unset] box-border flex items-center justify-center px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* --- Change Password Card --- */}
        <div className="w-full p-6 border border-gray-200 rounded-lg shadow-sm">
          <form onSubmit={handleChangePasswordSubmit} className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 [font-family:'Arimo-Regular',Helvetica]">
              Change Password
            </h2>

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
              <div className="text-red-500 text-sm [font-family:'Arimo',Helvetica]">
                {passError}
              </div>
            )}
            {passSuccess && (
              <div className="text-green-600 text-sm [font-family:'Arimo',Helvetica]">
                {passSuccess}
              </div>
            )}

            <div className="flex">
              <button
                type="submit"
                disabled={passLoading}
                className="all-[unset] box-border flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-pointer disabled:opacity-50"
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