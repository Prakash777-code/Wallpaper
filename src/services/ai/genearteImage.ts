export async function generateImage(prompt: string) {
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      prompt,
    }),
  });

  if (res.status === 401) {
    const postRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (postRes.status === 401) {
      return {
        ok: false,
        status: postRes.status,
        data: {
          message: "Unauthorised",
        },
      };
    }

    if (!postRes.ok) {
      const data = await postRes.json();

      return {
        ok: false,
        status: postRes.status,
        data,
      };
    }

    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        prompt,
      }),
    });
  }

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}