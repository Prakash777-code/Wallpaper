export const userRegister = async (
  name: string,
  email: string,
  password: string,
) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
