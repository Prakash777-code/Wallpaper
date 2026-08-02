import { startTurbopackTraceServer } from "next/dist/build/swc/generated-native"

export const getUserStatus = async () =>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`,{
        credentials:"include"
    })

    const data = await res.json()

    return{
        ok:res.ok,
        status:res.status,
        data
    }
}