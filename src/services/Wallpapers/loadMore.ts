export const checkLoadMore = async () => {

    const res = await fetch("/api/auth/status")
    const data = await res.json()

    return{
        ok:res.ok,
        status:res.status,
        data
    }
}