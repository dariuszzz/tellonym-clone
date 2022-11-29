import {registerUser} from './utils';
import { AccessToken } from './types';
import { validatePassword, validateLogin } from './validation';

export const register = (token : AccessToken) => {
    const usernameInput = <HTMLInputElement>document.getElementById('login');
    const passwordInputOne = <HTMLInputElement>document.getElementById('tryFirstPassword');
    const passwordInputTwo = <HTMLInputElement>document.getElementById('trySecondPassword');
    if(usernameInput != null && passwordInputOne != null && passwordInputTwo != null){
        if(passwordInputOne.value === passwordInputTwo.value){ 
              
            const username = usernameInput.value;
            const password = passwordInputOne.value;
            const loginCheck = validateLogin(username);
            const registerCheck = validatePassword(password);
            if (loginCheck != "") {
                alert(loginCheck);
                return;
            } 
            if (registerCheck != "") {
                alert(registerCheck);
                return;
            } 
            return registerUser(username, password,token);
        }
        else{
            return("Password are not the same");
        }
    }
    else{
        return("dupa");
    }
}