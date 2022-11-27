import { AccessToken, AnswerData, AskData, LoginData, VoteData } from "./types";

const SERVER_URL = "http://127.0.0.1:8000";

type ApiInputJSONs = LoginData | AskData | AnswerData | VoteData;

//Doesnt try to refresh token after an unauthorized request
export const fetch_api_raw = async (
    route: string, 
    method: "POST" | "GET", 
    json: ApiInputJSONs | undefined = undefined,
    access_token: AccessToken | undefined = undefined,
) => fetch(`${SERVER_URL}${route}`, {
    ...(json && { body: JSON.stringify(json) }),
    headers: {
        ...(json && { "Content-Type": "application/json" }),
        ...(access_token && { "Authorization": `Bearer: ${access_token.token}` }),
    },
    credentials: "include",
    method: method,
});

//Fetch wrapper which automatically tries to refresh the access token on unauthorized requests
export const fetch_api = async (
    route: string, 
    method: "POST" | "GET", 
    json: ApiInputJSONs | undefined = undefined,
    access_token: AccessToken | undefined = undefined, 
) => {
    let result = await fetch_api_raw(route, method, json, access_token);

    //Only if unauthorized (no token) and the token was passed in
    if (result.status == 401 && access_token) {
        
        access_token.token = await fetch_api_raw("/refresh", "POST")
            .then(res => {
                if (!res.ok) throw new Error("Not logged in")
                else return res.text();
            })

        return await fetch_api_raw(route, method, json, access_token);
    }

    return result;
}

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
        token
    )
    .then(res => res.json())
    .catch(() => console.error("Not logged in"));

    console.log(user)
}

export const registerUser = async (username: string, password: string, token: AccessToken) => {
    token.token = await fetch_api(
        "/register", 
        "POST", 
        { username, password },
    )
    .then(res => res.text())
    .catch(() => console.error("Problem with registering")) ?? "";
    
}