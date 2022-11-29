import './index.css'

// prawdopodobnie useless
//import { setupCounter } from './counter'
//import { login_and_print_logged_user } from './fetchexample'
//import { fetch_api } from './fetchexample';

//import { fetch_api } from './utils';
import { login } from './login';
import { register } from './register';
import { AccessToken, Like, QuestionWithAnswer, User, UserWithLikes } from './types';
//import { searchForPeople } from './searchForProfiles';
import { constructPost } from './homePostDisplay'
import { fetch_api } from './utils';


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

// const searchButton = document.getElementById('search');
// if(searchButton != null){
//     searchButton.addEventListener('click', () => {
//         searchForPeople(token);
//     })
// }

if (document.location.pathname == "/index.html") { // okropny, OKROPNY sposób żeby to zdrobić ale narazie dnc
    
    // const my_user: UserWithLikes | undefined = await fetch_api(
    //     "/me",
    //     "GET",
    //     undefined,
    //     token
    // )
    // .then(res => res.json())
    // .catch(console.error) 

    // const posts: Array<QuestionWithAnswer> | undefined = await fetch_api(
    //     "/questions",
    //     "GET",
    //     undefined,
    //     token
    // )
    // .then(res => res.json())
    // .catch(console.error) 

    // constructPost("wrapper", testPost,testuser1, [testuser2,testuser3], likes);

}