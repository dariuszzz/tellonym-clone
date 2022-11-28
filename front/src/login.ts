import {log_in} from './utils';
import { AccessToken } from './types';


export const login = (token : AccessToken) => {
    const usernameInput = <HTMLInputElement>document.getElementById('login');
    const passwordInput = <HTMLInputElement>document.getElementById('password');
    if(usernameInput != null && passwordInput != null){
        const username = usernameInput.value;
        const password = passwordInput.value;
        return log_in(username, password, token);
    }
    else{
        return("dupa");
    }
}