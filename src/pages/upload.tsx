import { useState } from "react";
import toast from "react-hot-toast";

export default function Upload() {
  console.log("UPLOAD COMPONENT RENDERED");

  const [imageTitle, setImageTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loader, setLoader] = useState(false);

  const uploadWallpaper = async () => {
    console.log("UPLOAD BUTTON CLICKED");
    console.log("image:", image);
    console.log("title:", imageTitle);

    if (!image || !imageTitle) {
      toast.error("All fields are required");
      return;
    }

    console.log("STARTING API CALL");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", imageTitle);

    try {
      setLoader(true);

      let res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pexels/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      console.log("API STATUS:", res.status);

      if (res.status === 401) {
        console.log("ACCESS TOKEN EXPIRED");

        const refresh = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          },
        );

        console.log("REFRESH STATUS:", refresh.status);

        if (refresh.status === 401) {
          toast.error("Session expired");
          return;
        }

        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pexels/upload`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        console.log("RETRY STATUS:", res.status);
      }

      const data = await res.json();

      if (res.status === 409) {
        toast.error(data.message);
        return;
      }

      if (res.ok) {
        toast.success("Wallpaper uploaded");
      }

      if (!res.ok) {
        toast.error(data.message || "Upload failed");
        return;
      }

      console.log("RESPONSE:", data);

      console.log("RESPONSE:", data);
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Wallpaper</h1>

          <p className="mt-2 text-zinc-400">
            Share your wallpaper with the WallVerse community.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Title
            </label>

            <input
              type="text"
              placeholder="Enter wallpaper title"
              value={imageTitle}
              onChange={(e) => setImageTitle(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Wallpaper
            </label>

            <label className="flex min-h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950/60 transition hover:border-zinc-500 hover:bg-zinc-900">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Wallpaper preview"
                  className="h-80 w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-2xl">
                    ↑
                  </div>
                  <p className="text-base font-medium text-zinc-200">
                    Click to upload wallpaper
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    PNG, JPG or WEBP • Max size: 6 MB
                  </p>{" "}
                </div>
              )}

              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const selectedFile = e.target.files[0];
                    const maxSize = 6 * 1024 * 1024;

                    if (selectedFile.size >= maxSize) {
                      toast.error("File must be less than 6 MB");
                      e.target.value = "";
                      return;
                    }

                    setImage(selectedFile);
                  }
                }}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
            </label>
          </div>

          {loader && (
            <div className="mt-10 flex justify-center">
              <div className="h-12 w-12 border-4 border-zinc-700 border-t-purple-500 rounded-full animate-spin" />
            </div>
          )}

          <button
            type="button"
            onClick={uploadWallpaper}
            className="mt-6 w-full cursor-pointer rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-500 active:scale-[0.98]"
          >
            Upload Wallpaper
          </button>
        </div>
      </div>
    </div>
  );
}
