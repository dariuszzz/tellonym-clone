import {login_and_print_logged_user} from './fetchexample';
import { AccessToken } from './types';


export const login = (token : AccessToken) => {
    const usernameInput = <HTMLInputElement>document.getElementById('login');
    const passwordInput = <HTMLInputElement>document.getElementById('password');
    if(usernameInput != null && passwordInput != null){
        const username = usernameInput.value;
        const password = passwordInput.value;
        return login_and_print_logged_user(username, password, token);
    }
    else{
        return("dupa");
    }
}