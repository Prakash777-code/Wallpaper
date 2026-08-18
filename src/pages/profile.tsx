import { getUserProfile } from "@/services/profile/fetchProfile";
import { UserProfile } from "@/types/profile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { logout } from "@/services/auth/logout";
import { editUserName } from "@/services/profile/editName";
import { updatePassword } from "@/services/profile/updatePassword";
import AuthPopup from "@/components/Ui/AuthPopup";
import EditNameCard from "@/components/Profile/EditNameCard";
import UpdatePasswordCard from "@/components/Profile/UpdatePasswordCard";
import { getUserStatus } from "@/services/profile/status";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [newName, setNewName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [updatePasswordLoader, setUpdatePasswordLoader] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const openAuthPopup = () => {
    setShowAuthPopup(true);
  };

  const getUsertStatus = async () => {
    const { status } = await getUserStatus();
    if (status === 401) {
      openAuthPopup();
      return;
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      const { ok, data } = await logout();
      if (ok) {
        toast.success(data.message);
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProfile = async () => {
    const { ok, status } = await getUserStatus();
    if (!ok) {
      if (status === 401) {
        openAuthPopup();
        return;
      }
    }
    try {
      setLoading(true);
      const { ok, status, data } = await getUserProfile();
      if (!ok) {
        if (status === 401) {
          return;
        }
        return;
      }
      console.log("User response", data);
      setProfile(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditName = async (newName: string) => {
    try {
      if (!newName) {
        toast.error("New name is required");
        return;
      }
      if (profile?.name.toLowerCase() === newName.toLowerCase()) {
        toast.error("Enter a different name");
        return;
      }
      setEditLoader(true);
      const { ok, status, data } = await editUserName(newName);

      if (status === 429) {
        toast.error(data.message);
        return;
      }

      if (!ok) {
        if (status === 401) {
          router.replace("/login");
          return;
        }
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setIsEditingName(false);
      fetchProfile();
    } catch (error) {
      console.log(error);
      toast.error("Failed to change name");
    } finally {
      setEditLoader(false);
    }
  };

  const handleUpdatePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required to update password");
      return;
    }
    if (confirmPassword !== newPassword) {
      toast.error("Password did not matched");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    try {
      setUpdatePasswordLoader(true);
      const { ok, status, data } = await updatePassword(
        currentPassword,
        newPassword,
      );

      if (!ok) {
        if (status === 401) {
          router.replace("/login");
          return;
        }
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      resetUpdatePasswordInputs();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password");
    } finally {
      setUpdatePasswordLoader(false);
    }
  };

  const resetUpdatePasswordInputs = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 lg:px-10">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col gap-5 rounded-3xl border border-zinc-900 bg-zinc-950 p-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold">
            {profile?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-purple-500">
              Your Profile
            </p>

            <h1 className="text-3xl font-bold tracking-tight">
              {profile?.name}
            </h1>

            <div className="mt-3 inline-flex rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
              {profile?.plan} PLAN
            </div>

            <p className="mt-1 text-sm text-zinc-500">{profile?.email}</p>
          </div>
        </div>

        
        <div className="grid gap-6 lg:grid-cols-3">
         
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
            <h2 className="mb-6 text-xl font-semibold">About</h2>

            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-600">
                  Name
                </p>

                <p className="mt-2 text-base font-medium text-zinc-200">
                  {profile?.name}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-600">
                  Email
                </p>

                <p className="mt-2 break-all text-base font-medium text-zinc-200">
                  {profile?.email}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-600">
                  Member Since
                </p>

                <p className="mt-2 text-base font-medium text-zinc-200">
                  {profile &&
                    new Date(profile.memberSince).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

         
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
            <h2 className="mb-6 text-xl font-semibold">Statistics</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 text-center transition hover:border-purple-500/40">
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Favourites
                </p>

                <h1 className="mt-3 text-4xl font-extrabold text-purple-500">
                  {profile?.totalFavourites}
                </h1>
              </div>

              <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-5 text-center transition hover:border-pink-500/40">
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Downloads
                </p>

                <h1 className="mt-3 text-4xl font-extrabold text-pink-500">
                  {profile?.downloads}
                </h1>
              </div>
            </div>

            <button
              onClick={() => router.push("/favourites")}
              className="mt-6 w-full cursor-pointer rounded-xl bg-purple-600 py-3 font-semibold transition duration-300 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-600/20 active:scale-95"
            >
              ♡ My Favourites
            </button>
          </div>

         
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
            <h2 className="mb-6 text-xl font-semibold">Account</h2>

            <div className="space-y-4">
              <EditNameCard
                open={isEditingName}
                onNameChange={setNewName}
                newName={newName}
                onSave={() => handleEditName(newName)}
                onCancel={() => setIsEditingName(false)}
              />

              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 py-3 font-medium text-zinc-300 transition duration-300 hover:border-purple-600 hover:bg-purple-600/10 hover:text-white active:scale-95"
                >
                  Change User Name
                </button>
              )}

              {!isUpdatingPassword && (
                <button
                  onClick={() => setIsUpdatingPassword(true)}
                  className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 py-3 font-medium text-zinc-300 transition duration-300 hover:border-purple-600 hover:bg-purple-600/10 hover:text-white active:scale-95"
                >
                  Change Password
                </button>
              )}

              <UpdatePasswordCard
                open={isUpdatingPassword}
                currentPassword={currentPassword}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                onCurrentPasswordChange={setCurrentPassword}
                onNewPasswordChange={setNewPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onUpdate={() => {
                  handleUpdatePassword(currentPassword, newPassword);
                  setIsUpdatingPassword(false);
                }}
                onCancel={() => {
                  setIsUpdatingPassword(false);
                  resetUpdatePasswordInputs();
                }}
              />

              <button
                onClick={handleLogout}
                className="w-full cursor-pointer rounded-xl border border-red-500/20 bg-red-500/5 py-3 font-medium text-red-400 transition duration-300 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <AuthPopup open={showAuthPopup} close={() => setShowAuthPopup(false)} />
      </div>
    </main>
  );
}
