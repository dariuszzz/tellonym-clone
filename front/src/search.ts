import "./index.css";
import {AccessToken, User} from './types';
import { fetch_api } from "./utils";


const token = new AccessToken();

const searchButton = document.getElementById('search');
if(searchButton != null){
    searchButton.onclick = () => {
        searchForPeople(token);
    }
}

const constructElement = (user: User) => {
    const searchResult = document.createElement("div");
    searchResult.classList.add("searchResult", "flex", "flex-row", "cursor-pointer", "bg-slate-100", "hover:bg-blue-100", "w-full", "items-center", "justify-between", "h-28", "p-2", "px-5", "rounded-md");

    // <div class="searchResult flex flex-row bg-slate-100 w-full items-center justify-between h-28 p-2 px-5 rounded-md">
    const template = `
        <div class="flex flex-row items-center gap-2 w-full h-full">
            <div class="rounded-full overflow-hidden h-4/5 aspect-square">
                <img class="object-scale-down" src="http://127.0.0.1:8000/pfps/${user.id}.jpg">
            </div>
            <div class="flex flex-col justify-between">
                <p><b>${user.username}</b></p>
                <p>${user.bio}</p>
            </div>
        </div>
        <button type="button" id="search" class="btn-primary">Follow</button>`;
    
    searchResult.innerHTML = template;
    searchResult.onclick = (_) => window.location.href = `${window.location.origin}/profile.html?id=${user.id}`;
    return searchResult;
}

export const searchForPeople = (token: AccessToken) => {
    const expectedUsername = <HTMLInputElement>document.getElementById("find")!;

    fetch_api(
        "/users?search="+expectedUsername.value,
        "GET",
    )
    .then(res => res.json())
    .then((users)=>{
        const wrapperForInsertion = <HTMLDivElement>document.getElementById('insertionWrapper')!;          

        document.querySelectorAll(".searchResult")
            .forEach(el => el.remove());

        const sortedUsers = users.sort((user1: User, user2: User) => user1.username.length - user2.username.length);

        sortedUsers.forEach((user: User) => {
            let searchResult = constructElement(user);
            wrapperForInsertion.prepend(searchResult);
        })

        if (sortedUsers.length == 0) {
            document.getElementById("findFriends")!.innerText = "No results :(";
        } else {
            document.getElementById("findFriends")!.innerText = "";
        }
    })
    .catch(console.error);
    
}


