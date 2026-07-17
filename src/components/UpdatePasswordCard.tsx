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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-2xl font-bold text-white">Update Password</h2>

        <div className="flex flex-col gap-4">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => onCurrentPasswordChange(e.target.value)}
            placeholder="Enter your current password"
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            placeholder="Enter new password"
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="Confirm password"
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onUpdate}
            className="cursor-pointer flex-1 rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
          >
            Update
          </button>

          <button
            onClick={onCancel}
            className="cursor-pointer flex-1 rounded-xl border border-white/20 py-3 font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/10 hover:shadow-lg hover:shadow-white/10 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
