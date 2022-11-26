import './index.css'
import { setupCounter } from './counter'
import { login_and_print_logged_user } from './fetchexample'


// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
let token = { token: "" };


login_and_print_logged_user("test", "test", token);

let users = await fetch_api(
    "/users",
    "GET",
    undefined,
    token ?? undefined
)
.then(res => res.json())
.catch(() => console.error("?"));

console.log(users);