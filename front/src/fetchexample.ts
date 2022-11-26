import { AccessToken } from "./types";

export const fetch_api = (
    route: string, 
    method: string, 
    json: object | undefined = undefined,
    access_token: AccessToken | undefined = undefined, 
) => fetch(`http://127.0.0.1:8000${route}`, {
    ...(json && { body: JSON.stringify(json) }),
    headers: {
        ...(json && { "Content-Type": "application/json" }),
        ...(access_token && { "Authorization": `Bearer: ${access_token.token}` }),
    },
    method: method,
})

export const login_and_print_logged_user = async (username: string, password: string, token: AccessToken) => {
    //login user example
    token.token = await fetch_api(
        "/login", 
        "POST", 
        { username, password },
    )
    .then(res => res.text())
    .catch(() => console.error("Problem with logging in")) ?? "";    

    //fetch currently logged in user
    let user = await fetch_api(
        "/me",
        "GET",
        undefined,
        token ?? undefined
    )
    .then(res => res.json())
    .catch(() => console.error("Not logged in"));

    console.log(user)
}