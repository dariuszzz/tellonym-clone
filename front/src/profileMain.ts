import './index.css'
import { AccessToken } from "./types";
import { fetch_api } from './fetchexample';
import { getAndSetUserData } from './profile';

let token = new AccessToken();

let user = await fetch_api(
    "/me",
    "GET",
    undefined,
    token
)
.then(res => res.json())
.then(console.log)
.catch(() => console.error("?"));

await getAndSetUserData(token);