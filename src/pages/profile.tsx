import { getUserProfile } from "@/service/fetchProfile";
import { UserProfile } from "@/types/profile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { logout } from "@/service/auth";
import { editUserName } from "@/service/editName";
import { updatePassword } from "@/service/updatePassword";
import AuthPopup from "@/components/AuthPopup";
import EditNameCard from "@/components/EditNameCard";
import UpdatePasswordCard from "@/components/UpdatePasswordCard";

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
    try {
      setLoading(true);
      const { ok, status, data } = await getUserProfile();

      console.log(data);

      if (status === 401) {
        setShowAuthPopup(true);
        return;
      }
      if (!ok) {
        toast.error(data.message);
      }

      setProfile(data);
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
      if (status === 401) {
        return;
      }

      if (ok) {
        toast.success(data.message);
        setIsEditingName(false);
        fetchProfile();
      } else {
        toast.error(data.message);
      }
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
      if (status === 401) {
        toast.error("Login to update password");
        return;
      }
      if (ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password");
    } finally {
      setUpdatePasswordLoader(false);
    }
  };

  const resetUpdatePasswordInputs = () =>{
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-2xl font-bold">
            {profile?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{profile?.name}</h1>
            <p className="mt-1 text-gray-400">{profile?.email}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-semibold">About</h2>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="mt-1 text-lg">{profile?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 text-lg break-all">{profile?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="mt-1 text-lg">
                  {profile &&
                    new Date(profile.memberSince).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-semibold">Statistics</h2>

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-8">
              <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-gray-400">
                  Total Favourites
                </p>

                <h1 className="mt-3 text-6xl font-extrabold text-cyan-400">
                  {profile?.totalFavourites}
                </h1>
              </div>

              <button
                onClick={() => router.push("/favourites")}
                className="cursor-pointer mt-8 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:from-cyan-400 hover:to-blue-500 hover:shadow-xl hover:shadow-cyan-500/40 active:scale-95"
              >
                ❤️ My Favourites
              </button>
            </div>
          </div>

          <AuthPopup
            open={showAuthPopup}
            close={() => setShowAuthPopup(false)}
          />

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-semibold">Account</h2>

            <div className="space-y-4">
              <EditNameCard
                open={isEditingName}
                onNameChange={setNewName}
                newName={newName}
                onSave={() => handleEditName(newName)}
                onCancel={() => setIsEditingName(false)}
              />

              <button
                onClick={() => setIsEditingName(true)}
                className="cursor-pointer w-full rounded-xl border border-purple-500/30 bg-purple-500/10 py-3 font-medium transition-all duration-300 hover:-translate-y-1 hover:border-purple-400 hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95"
              >
                Change user name
              </button>

              <button
                onClick={() => setIsUpdatingPassword(true)}
                className="cursor-pointer w-full rounded-xl border border-purple-500/30 bg-purple-500/10 py-3 font-medium transition-all duration-300 hover:-translate-y-1 hover:border-purple-400 hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95"
              >
                Change Password
              </button>

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
                  setIsUpdatingPassword(false)
                  resetUpdatePasswordInputs()
                }}
              />

              <button
                onClick={handleLogout}
                className="cursor-pointer w-full rounded-xl border border-red-500/30 bg-red-500/10 py-3 font-medium transition-all duration-300 hover:-translate-y-1 hover:border-red-400 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
