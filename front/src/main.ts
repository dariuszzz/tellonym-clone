import './index.css'
//import { setupCounter } from './counter'
import { login_and_print_logged_user } from './fetchexample'
import { fetch_api } from './fetchexample';
import { login } from './login';
import { register } from './register';



// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
let token = { token: "" };
let token = new AccessToken();


login_and_print_logged_user("test", "test", token);

let users = await fetch_api(
    "/users",
    "GET",
    undefined,
    token ?? undefined
)
.then(res => res.json())
.catch(() => console.error("?"));


const loginButton  = document.getElementById('log');
if (loginButton != null) {
    loginButton.addEventListener('click', () => {
        login(token);
    })
}

const registerButton = document.getElementById('registerButton');
if(registerButton != null){
    registerButton.addEventListener('click', () => {
        register(token)
    })
}

console.log(users);

