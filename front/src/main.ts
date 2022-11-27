import './index.css'
import { fetch_api } from './utils';
import { login } from './login';
import { register } from './register';
import { AccessToken } from './types';
import { searchForPeople } from './searchForProfiles';

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

const searchButton = document.getElementById('search');
if(searchButton != null){
    searchButton.addEventListener('click', () => {
        searchForPeople(token);
    })
}
