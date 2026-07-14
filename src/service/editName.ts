export const editUserName = async (newName: string) => {
  const res = await fetch("/api/profile/editName", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newName }),
  });

  const data = await res.json()

  return{
    ok:res.ok,
    status:res.status,
    data
  }
};
