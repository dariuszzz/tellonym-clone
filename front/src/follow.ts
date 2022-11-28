import { AccessToken } from "./types";
import { fetch_api } from "./utils";
import { getAndSetUserData } from "./profile";

export const followUser = async (token: AccessToken, profile_id: number) => {
    await fetch_api(
        `/users/${profile_id}/follow`,
        "POST",
        undefined,
        token,
    ).then(res => res.json())
    .catch(() => console.error());

    getAndSetUserData(token, profile_id);
};