import { AccessToken } from "./types";
import { fetch_api } from "./fetchexample";



export const getAndSetUserData = (token: AccessToken) => {
    fetch_api(
        "/me",
        "GET",
        undefined,
        token
    )
    .then(res => res.json())
    .then((res)=>{
        const nickname = res.username;
        const follower_count = res.follower_count;
        const following_count = res.following_count;
        const finalStats : string = `${follower_count} followers | 0 tells | ${following_count} following`;

        const nicknameField = document.getElementById('nickname');
        const stats = document.getElementById('stats');

        if(nicknameField != null && stats != null) {
            nicknameField.innerHTML = nickname;
            stats.innerHTML = finalStats;
        }
    })
    .catch(() => console.error());
}



