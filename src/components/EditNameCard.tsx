type EditNameProps = {
  open: boolean;
  onNameChange: (newName: string) => void;
  newName:string;
  onSave: () => void;
  onCancel: () => void;
};

export default function EditNameCard({
  open,
  onNameChange,
  newName,
  onSave,
  onCancel,
}: EditNameProps) {

    if(!open){
        return null
    }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={() => onCancel()}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-2xl font-bold text-white">Edit Name</h2>

        <p className="mb-6 text-slate-400">Enter your new user name.</p>

        <input
          type="text"
          value={newName}
          onChange={(e) => {
            onNameChange(e.target.value);
          }}
          placeholder="Enter your new name"
          className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
        />

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onSave()}
            className="cursor-pointer flex-1 rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
          >
            Save
          </button>

          <button
            onClick={() => onCancel()}
            className="cursor-pointer flex-1 rounded-xl border border-white/20 py-3 font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/10 hover:shadow-lg hover:shadow-white/10 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
