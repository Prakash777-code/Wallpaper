export const fetchFavouriteWallpaper = async () =>{
    
    const res = await fetch("/api/wallpapers/favourite",{});
    const data = await res.json()

    return{
        ok:res.ok,
        status:res.status,
        data
    }

}