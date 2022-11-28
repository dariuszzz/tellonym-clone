import './index.css'
import { AccessToken, AskData } from "./types";
import { ask_question } from './utils';
import { getAndSetUserData } from './profile';

const token = new AccessToken();

const url_params = new URLSearchParams(window.location.search);
const profile = url_params.get("id");

const profile_id: number | undefined  = profile ? parseInt(profile) : undefined;


const askButton = document.getElementById('askButton');
const isAnonymous = <HTMLInputElement>document.getElementById('anonymousInput');
const questionBody = <HTMLInputElement>document.getElementById('questionBody');


 if(askButton != null){
    askButton.onclick = () => {
        const question : AskData = {
            anonymous : isAnonymous.checked,
            content : questionBody.value,
        };
        if(profile_id != undefined){
            ask_question(question, profile_id, token);
        }
    }   
}





await getAndSetUserData(token, profile_id);