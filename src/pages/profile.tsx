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
import { CommunityResponse } from "@/types/community";
import { UserUploadedResponse } from "@/types/userUploaded";
import { fetchUserUploadedWallpaper } from "@/services/Wallpapers/userUploadedWallpapers";
import { Download, Heart, Trash2, Upload } from "lucide-react";
import { getUserPrompts } from "@/services/profile/userPrompts";
import { deletePost } from "@/services/Wallpapers/removeUploads";

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
  const [uploadedWallpapers, setUploadedWallpapers] = useState<
    UserUploadedResponse[]
  >([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);
  const [prompts, setPrompts] = useState<{ prompt: string }[]>([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    getStatus();
  });
  const getStatus = async () => {
    const { status } = await getUserStatus();
    if (status === 401) {
      openAuthPopup();
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?.userId) {
      getUserUploadedWallpaper(profile.userId);
    }
  }, [profile?.userId]);

  useEffect(() => {
    if (profile?.userId) {
      fetchPrompts(profile.userId);
    }
  }, [profile?.userId]);

  const openAuthPopup = () => {
    setShowAuthPopup(true);
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

  const fetchPrompts = async (userId: number) => {
    try {
      const { ok, status, data } = await getUserPrompts(userId);
      if (ok) {
        setPrompts(data.prompts ?? []);
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

  const getUserUploadedWallpaper = async (userId: number) => {
    console.log("getUserUploadedWallpaper CALLED");
    try {
      const { ok, status, data } = await fetchUserUploadedWallpaper(userId);

      if (ok) {
        console.log("RESPONSE", ok);
        setUploadedWallpapers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUserUpload = async (id: number) => {
    try {
      setDeleteLoader(true);

      const { ok, data } = await deletePost(id);

      if (ok) {
        toast.success(data.message);

        setUploadedWallpapers((previous) =>
          previous.filter((wallpaper) => wallpaper.id !== id),
        );

        setShowDeletePopup(false);
        setDeleteId(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete wallpaper");
    } finally {
      setDeleteLoader(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 lg:px-10">
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 md:p-8">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-pink-600/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-3xl font-bold shadow-lg shadow-purple-500/20">
              {profile?.name?.charAt(0)?.toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium uppercase tracking-widest text-purple-400">
                Your Profile
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {profile?.name}
                </h1>

                <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                  {profile?.plan} PLAN
                </span>
              </div>

              <p className="mt-2 break-all text-sm text-zinc-500">
                {profile?.email}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your Activity</h2>
              <p className="mt-1 text-sm text-zinc-500">
                A quick overview of your Wallverse activity
              </p>
            </div>
          </div>

          <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="group rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-purple-500/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Favourites
                </p>
                <Heart className="h-5 w-5 text-blue-400" />{" "}
              </div>

              <p className="mt-3 text-3xl font-extrabold text-purple-400">
                {profile?.totalFavourites}
              </p>
            </div>

            <div className="group rounded-2xl border border-pink-500/20 bg-pink-500/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-pink-500/40 hover:bg-pink-500/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Downloads
                </p>

                <Download className="h-5 w-5 text-blue-400" />
              </div>

              <p className="mt-3 text-3xl font-extrabold text-pink-400">
                {profile?.downloads}
              </p>
            </div>

            <div className="group rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-blue-500/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Uploads
                </p>

                <Upload className="h-5 w-5 text-blue-400" />
              </div>

              <p className="mt-3 text-3xl font-extrabold text-blue-400">
                {profile?.totalUploads}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 md:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">About</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Your Wallverse account information
              </p>
            </div>

            <div className="divide-y divide-zinc-900">
              <div className="py-4 first:pt-0">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                  Name
                </p>

                <p className="mt-2 font-medium text-zinc-200">
                  {profile?.name}
                </p>
              </div>

              <div className="py-4">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                  Email
                </p>

                <p className="mt-2 break-all font-medium text-zinc-200">
                  {profile?.email}
                </p>
              </div>

              <div className="py-4 last:pb-0">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                  Member Since
                </p>

                <p className="mt-2 font-medium text-zinc-200">
                  {profile &&
                    new Date(profile.memberSince).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 md:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Account</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Manage your account and security
              </p>
            </div>

            <div className="space-y-4">
              {!isUpdatingPassword && (
                <button
                  type="button"
                  onClick={() => setIsUpdatingPassword(true)}
                  className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 text-left transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-500/5 active:scale-[0.99]"
                >
                  <div>
                    <p className="font-medium text-white group-hover:text-purple-300">
                      Change Password
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Keep your Wallverse account secure
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 transition-all duration-300 group-hover:translate-x-1 group-hover:border-purple-500/40 group-hover:bg-purple-500/10 group-hover:text-purple-400">
                    <span className="text-lg">→</span>
                  </div>
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
                }}
                onCancel={() => {
                  setIsUpdatingPassword(false);
                  resetUpdatePasswordInputs();
                }}
              />

              <button
                type="button"
                onClick={handleLogout}
                className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-red-500/10 bg-zinc-900/40 px-5 py-4 text-left transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/5 active:scale-[0.99]"
              >
                <div>
                  <p className="font-medium text-red-400 group-hover:text-red-300">
                    Sign Out
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    End your current Wallverse session
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 transition-all duration-300 group-hover:translate-x-1 group-hover:border-red-500/40 group-hover:bg-red-500/10 group-hover:text-red-400">
                  <span className="text-lg">→</span>
                </div>
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 mb-10 rounded-3xl border border-zinc-900 bg-zinc-950 p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">AI Generation Prompts</h2>

              <p className="mt-1 text-sm text-zinc-500">
                Prompts you have used to generate AI wallpapers
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPrompts(!showPrompts)}
              className="cursor-pointer rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              {showPrompts ? "Hide Prompts" : "View Prompts"}
            </button>
          </div>

          {showPrompts && (
            <div className="mt-6 space-y-3">
              {prompts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6 text-center">
                  <p className="text-sm text-zinc-500">
                    You haven't generated any AI wallpapers yet.
                  </p>
                </div>
              ) : (
                prompts.map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all duration-300 hover:border-purple-500/30 hover:bg-zinc-900"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-xs font-semibold text-purple-400">
                          {index + 1}
                        </span>

                        <span className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                          AI Prompt
                        </span>
                      </div>

                      <p className="text-sm leading-6 text-zinc-300">
                        {item.prompt}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(item.prompt);
                        setCopiedPrompt(index);

                        setTimeout(() => {
                          setCopiedPrompt(null);
                        }, 1500);
                      }}
                      className="shrink-0 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-400 transition-all duration-200 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400"
                    >
                      {copiedPrompt === index ? "Copied" : "Copy"}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 md:p-7">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">My Uploaded Wallpapers</h2>

              <p className="mt-1 text-sm text-zinc-500">
                Wallpapers you have shared with the Wallverse community
              </p>
            </div>

            {uploadedWallpapers.length > 0 && (
              <span className="w-fit rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                {uploadedWallpapers.length} Uploaded
              </span>
            )}
          </div>

          {uploadedWallpapers.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-xl text-zinc-600">
                ↑
              </div>

              <p className="font-medium text-zinc-300">
                No wallpapers uploaded yet
              </p>

              <p className="mt-1 text-sm text-zinc-600">
                Your uploaded wallpapers will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {uploadedWallpapers.map((photo) => (
                <div
                  key={photo.imageUrl}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
                >
                  <img
                    src={photo.imageUrl}
                    alt="Uploaded wallpaper"
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteId(photo.id);
                      setShowDeletePopup(true);
                    }}
                    className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-red-500/30 bg-black/70 text-red-400 backdrop-blur-sm transition hover:bg-red-500 hover:text-white"
                    aria-label="Delete wallpaper"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showDeletePopup && deleteId !== null && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 px-4">
              <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                <h2 className="text-xl font-semibold text-white">
                  Are you sure?
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Do you want to delete this wallpaper? This action will remove
                  the wallpaper from community uploads.
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    disabled={deleteLoader}
                    onClick={() => {
                      setShowDeletePopup(false);
                      setDeleteId(null);
                    }}
                    className="flex-1 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={deleteLoader}
                    onClick={() => {
                      deleteUserUpload(deleteId);
                    }}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {deleteLoader ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <AuthPopup open={showAuthPopup} close={() => setShowAuthPopup(false)} />
      </div>
    </main>
  );
}
