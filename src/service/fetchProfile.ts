export const getUserProfile = async () =>{

    const res = await fetch("/api/profile/userDetails")
    const data = await res.json()

    return{
        ok:res.ok,
        status:res.status,
        data
    }
}