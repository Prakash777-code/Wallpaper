export const unfavouriteWallpaper = async (wallpaperId: number) => {
  let res = await fetch(`/api/wallpapers/${wallpaperId}`, {
    method: "DELETE",
  });

  if(res.status === 401){
    const deleteRes = await fetch("/api/auth/refresh",{
      method:"POST"
    })
    if(deleteRes.status === 401){
      return{
        ok:false,
        status:deleteRes.status,
        data:{
          message:"Unauthorized"
        }
      }
    }
    if(!deleteRes.ok){
      const data = await deleteRes.json()
      return{
        ok:false,
        status:deleteRes.status,
        data
      }
    }
  }
  const data = await res.json()

  return{
    ok:res.ok,
    status:res.status,
    data
  }
};
