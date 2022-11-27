import {AccessToken} from './types';
import { fetch_api } from "./fetchexample";

const constructElement = (nickname : string) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add('flex', 'items-center', 'content-center', 'w-1/2', 'p-12', 'bg-slate-300', 'my-5', 'rounded-md');
    newDiv.textContent = nickname;
    return newDiv;
}



export const searchForPeople = (token: AccessToken) => {
    const expectedUsername = <HTMLInputElement>document.getElementById("find");
    if(expectedUsername != null) {
        fetch_api(
            "/users?search="+expectedUsername.value,
            "GET",
            undefined,
            token
        )
        .then(res => res.json())
        .then((users)=>{
            const wrapperForInsertion = document.getElementById('wrapperForInsertion');          
            if(wrapperForInsertion != null){
                wrapperForInsertion.innerHTML = "";
                const sortedUsers = users.sort((user1: { username: any[]; }, user2: { username: any[]; }) => user1.username.length - user2.username.length);
                console.log(users,sortedUsers)
                sortedUsers.forEach((user: { username: any; })  =>{
                    let elementWithUserData = constructElement(user.username);
                    wrapperForInsertion.appendChild(elementWithUserData);
                })
            }
            
        })
        .catch(() => console.error());
    }
    
}


