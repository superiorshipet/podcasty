import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// A reusable input field component to keep the code clean
const InputField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  helperText = "",
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  helperText?: string;
}) => (
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
    />
    {helperText && (
      <p className="mt-1 text-xs text-gray-500 [font-family:'Arimo-Regular',Helvetica]">
        {helperText}
      </p>
    )}
  </div>
);

// A reusable text area component
const TextAreaField = ({
  label,
  id,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) => (
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

export const EditProfile = (): JSX.Element => {
  const navigate = useNavigate();
  const userInitial = "2";

  // State for Profile Information
  const [profilePicUrl, setProfilePicUrl] = useState(
    "https://example.com/avatar.jpg"
  );
  const [username, setUsername] = useState("2201547");
  const [bio, setBio] = useState("Tell us about yourself...");
  const [email, setEmail] = useState("mody044404440@gmail.com");

  // State for Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save profile changes
    console.log("Profile changes saved");
    navigate("/profile"); // Go back to profile page
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to change password
    console.log("Password changed");
  };

  return (
    <div className="bg-white overflow-x-hidden w-full min-h-screen relative">
      {/* --- Header --- */}
      <header className="flex flex-col w-full h-[73px] items-start pt-4 pb-[0.8px] px-4 fixed top-0 left-0 bg-white border-b-[0.8px] [border-bottom-style:solid] border-[#0000001a] z-10">
        <nav
          className="h-10 justify-between pr-[7.63e-05px] pl-0 py-0 self-stretch w-full max-w-6xl mx-auto flex items-center relative"
          aria-label="Main navigation"
        >
          <div className="w-[208.88px] h-7 gap-8 flex items-center relative">
            <div className="flex w-[126.04px] h-7 items-center gap-2 relative">
              <div className="relative w-6 h-6" aria-hidden="true">
                <img
                  className="absolute w-[75.00%] h-[75.00%] top-[8.33%] left-[8.33%]"
                  alt="Icon"
                  src="https://c.animaapp.com/mhs1rzskhGRsS4/img/icon.svg"
                />
              </div>
              <div className="relative flex-1 grow h-7">
                <h1 className="absolute -top-0.5 left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-xl tracking-[0] leading-7 whitespace-nowrap">
                  Podstream
                </h1>
              </div>
            </div>
            <button
              onClick={() => navigate("/browse")}
              className="relative w-[50.84px] h-6"
            >
              <span className="absolute -top-0.5 left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#354152] text-base tracking-[0] leading-6 whitespace-nowrap">
                Browse
              </span>
            </button>
          </div>
          <div className="w-[156.2px] h-10 gap-4 flex items-center relative">
            <div className="flex flex-col w-[100.2px] h-9 items-start relative">
              <button
                className="all-[unset] box-border relative self-stretch w-full h-9 rounded-lg cursor-pointer"
                type="button"
                aria-label="Go to My Library"
                // onClick={() => navigate("/library")}
              >
                <span className="absolute top-[7px] left-4 [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowrap">
                  My Library
                </span>
              </button>
            </div>
            <button
              className="flex-col w-10 h-10 items-start flex relative cursor-pointer"
              type="button"
              aria-label="User profile"
              onClick={() => navigate("/profile")}
            >
              <div className="flex h-10 items-start relative self-stretch w-full rounded-[26843500px] overflow-hidden">
                <div className="flex h-10 items-center justify-center relative flex-1 grow bg-[#ececf0] rounded-[26843500px]">
                  <span className="relative w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-6 whitespace-nowrap">
                    {userInitial}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* --- Main Content --- */}
      <main className="flex flex-col w-full max-w-3xl mx-auto items-start gap-8 pt-[104.8px] pb-12 px-4">
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
              id="profilePicUrl"
              value={profilePicUrl}
              onChange={(e) => setProfilePicUrl(e.target.value)}
              helperText="Enter a URL for your profile picture"
            />

            <InputField
              label="Username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextAreaField
              label="Bio"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
            />

            <InputField
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="all-[unset] box-border flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-pointer"
              >
                Save Changes
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
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 [font-family:'Arimo-Regular',Helvetica]">
              Change Password
            </h2>

            <InputField
              label="Current Password"
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <InputField
              label="New Password"
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <InputField
              label="Confirm New Password"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex">
              <button
                type="submit"
                className="all-[unset] box-border flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};