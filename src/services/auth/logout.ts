export const logout = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials:"include",
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