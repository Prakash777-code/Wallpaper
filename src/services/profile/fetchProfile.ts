export const getUserProfile = async () =>{

    let res = await fetch("/api/profile/userDetails")
    if(res.status === 401){
        const getRes = await fetch("/api/auth/refresh",{
            method:"POST"
        })
        if(getRes.status === 401){
            return{
                ok:false,
                status:getRes.status,
                data:{
                    message:"Unauthorized"
                }
            }
        }

        if(!getRes.ok){
            const data = await getRes.json()
            return{
                ok:false,
                status:getRes.status,
                data,
            }
        }
        res = await fetch("/api/profile/userDetails")
    }
    const data = await res.json()

    return{
        ok:res.ok,
        status:res.status,
        data
    }
}