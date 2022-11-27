import './index.css'
//import { setupCounter } from './counter'
import { login_and_print_logged_user } from './fetchexample'
import { fetch_api } from './fetchexample';
import { login } from './login';
import { register } from './register';
import { AccessToken } from './types';



// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
let token = new AccessToken();


// await login_and_print_logged_user("test", "test", token);

let user = await fetch_api(
    "/me",
    "GET",
    undefined,
    token
)
.then(res => res.json())
.then(console.log)
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

// console.log(users);

