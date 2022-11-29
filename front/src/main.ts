import './index.css'

// prawdopodobnie useless
//import { setupCounter } from './counter'
//import { login_and_print_logged_user } from './fetchexample'
//import { fetch_api } from './fetchexample';

//import { fetch_api } from './utils';
import { login } from './login';
import { register } from './register';
import { AccessToken } from './types';
import { constructPost } from './homePostDisplay'


// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
// await login_and_print_logged_user("test", "test", token);

// let user = await fetch_api(
//     "/me",
//     "GET",
//     undefined,
//     token
// )
// .then(res => res.json())
// .then(console.log)
// .catch(() => console.error("?"));


const token = new AccessToken();

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


if (document.location.pathname == "/index.html") { // okropny, OKROPNY sposób żeby to zdrobić ale narazie dnc
    // giga funkcja alert!!!1
    constructPost("wrapper","co tam jak tam?","a nic super","kolega","spoko ziomek",1,2,"27.11.2022","28.11.2022");
    constructPost("wrapper","gnidfghdsfoighi","co","kolega","spoko ziomek",1,2,"27.11.2022","28.11.2022");
}
