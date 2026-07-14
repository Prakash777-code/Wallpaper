export const updatePassword = async (currentPassword: string, newPassword: string) => {
  const res = await fetch("/api/profile/updatePassword", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify({currentPassword, newPassword})
  });

  const data = await res.json()

  return{
    ok:res.ok,
    status:res.status,
    data
  }
};
