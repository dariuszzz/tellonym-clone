import { AccessToken } from "./types";



// Wrapper do fetcha ktory fetchuje nowy token jezeli stary sie juz skonczyl
// dzieki temu nie wylogowywuje po przejsciu miedzy stronami :)))))
export const fetch_api = async (
    route: string, 
    method: string, 
    json: object | undefined = undefined,
    access_token: AccessToken | undefined = undefined, 
) => {
    let result = await fetch(`http://127.0.0.1:8000${route}`, {
        ...(json && { body: JSON.stringify(json) }),
        headers: {
            ...(json && { "Content-Type": "application/json" }),
            ...(access_token && { "Authorization": `Bearer: ${access_token.token}` }),
        },
        credentials: "include",
        method: method,
    });

    if (result.status == 400 && access_token) {
        access_token.token = await fetch(`http://127.0.0.1:8000/refresh`, {
            credentials: "include",
            method: "POST", 
        }).then(res2 => {
            if (!res2.ok) {
                throw new Error("Need to log in");
            }

            return res2.text();
        })

        return await fetch(`http://127.0.0.1:8000${route}`, {
            ...(json && { body: JSON.stringify(json) }),
            headers: {
                //Token should be available and needed since a refresh was needed and happened
                "Authorization": `Bearer: ${access_token.token}`,
                ...(json && { "Content-Type": "application/json" }),
            },
            credentials: "include",
            method: method,
        })
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
        token ?? undefined
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
