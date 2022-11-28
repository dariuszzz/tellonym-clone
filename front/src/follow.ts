import { AccessToken } from "./types";
import { fetch_api } from "./utils";
import { getAndSetUserData } from "./profile";
import { checkIfUserIsFollowed} from "./isUserFollowed";

export const followUser = async (token: AccessToken, profile_id: number) => {
    await fetch_api(
        `/users/${profile_id}/follow`,
        "POST",
        undefined,
        token,
    ).then(res => res.json())
    .catch(() => console.error());
    //checkIfUserIsFollowed(token, [1,2,3,4,5]);
    getAndSetUserData(token, profile_id);
};