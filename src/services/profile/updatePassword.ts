export const updatePassword = async (currentPassword: string, newPassword: string) => {
  let res = await fetch("/api/profile/updatePassword", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify({currentPassword, newPassword})
  });

  if(res.status === 401){
    const putRes = await fetch("/api/auth/refresh",{
      method:"POST"
    })

    if(putRes.status === 401){
      return{
        ok:false,
        status:putRes.status,
        data:{
          message:"Unauthorized"
        }
      }
    }

    if(!putRes.ok){
      const data = await putRes.json()
      return{
        ok:false,
        status:putRes.status,
        data,
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
