type UpdatePasswordProps = {
  open: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onUpdate: () => void;
  onCancel: () => void;
};

export default function UpdatePasswordCard({
  open,
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onUpdate,
  onCancel,
}: UpdatePasswordProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-7 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Update Password
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Keep your Wallverse account secure
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => onCurrentPasswordChange(e.target.value)}
            placeholder="Enter your current password"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:bg-zinc-900 focus:ring-2 focus:ring-purple-500/10"
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            placeholder="Enter new password"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:bg-zinc-900 focus:ring-2 focus:ring-purple-500/10"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500 focus:bg-zinc-900 focus:ring-2 focus:ring-purple-500/10"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onUpdate}
            className="flex-1 cursor-pointer rounded-xl bg-purple-600 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-600/25 active:scale-95"
          >
            Update
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 py-3 font-semibold text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}