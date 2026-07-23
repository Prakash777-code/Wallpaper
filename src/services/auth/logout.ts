export const logout = async () => {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });
    const data = await res.json()
    return {
        ok:res.ok,
        data
    }
  } catch (error) {
    console.error(error);
    throw error
  }
};