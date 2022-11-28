import { AccessToken, User, UserWithLikes } from "./types";
import { fetch_api } from "./utils";



export const getAndSetUserData = async (token: AccessToken, profile_id: number | undefined) => {

    let user: User;

    if (profile_id) {
        user = await fetch_api(
            `/users/${profile_id}`,
            "GET",
        ).then(res => res.json())
        .catch(() => console.error());
    } else {
        const my_user: UserWithLikes = await fetch_api(
            "/me",
            "GET",
            undefined,
            token
        )
        .then(res => res.json())
        .catch(() => console.error());

        user = my_user.user;        
    }

    const nickname = user.username;
    const follower_count = user.follower_count;
    const following_count = user.following_count;
    const finalStats : string = `${follower_count} followers | 0 tells | ${following_count} following`;

    const nicknameField = document.getElementById('nickname');
    const stats = document.getElementById('stats');

    if(nicknameField != null && stats != null) {
        nicknameField.innerHTML = nickname;
        stats.innerHTML = finalStats;
    }
}




