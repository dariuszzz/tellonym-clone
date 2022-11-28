import "./index.css";
import { checkIfUserIsFollowed } from "./isUserFollowed";
import {AccessToken, User} from './types';
import { fetch_api, follow_user } from "./utils";


const token = new AccessToken();

const searchButton = document.getElementById('search')!;

searchButton.onclick = (e) => {
    e.preventDefault();

    searchForPeople();
}

const constructElement = (user: User, followed: boolean) => {
    const searchResult = document.createElement("div");
    searchResult.classList.add("searchResult", "flex", "flex-row", "cursor-pointer", "bg-slate-100", "hover:bg-blue-100", "w-full", "items-center", "justify-between", "h-28", "p-2", "px-5", "rounded-md");

    const followButton = document.createElement("button");
    if (followed === true) {
        followButton.classList.add("btn-secondary", "hover:border-red-400", "hover:text-red-400", "hover:after:content-['Unfollow']", "after:content-['Following']");
        followButton.addEventListener("click",  function (e) {
            if (e.target !== this)
                return;

            follow_user(user.id, token);
            this.classList.value = "btn-primary after:content-['Follow']";
        })
    } else if (followed === false) {
        followButton.classList.add("btn-primary", "after:content-['Follow']");
        followButton.addEventListener("click",  function (e) {
            if (e.target !== this)
                return;

            follow_user(user.id, token);
            this.classList.value = "btn-secondary hover:border-red-400 hover:text-red-400 hover:after:content-['Unfollow'] after:content-['Following']";
        })
    } else {
        followButton.classList.add("btn-primary", "after:content-['Follow']");
        followButton.setAttribute("disabled", "true");
        followButton.addEventListener("click",  function (e) {
            if (e.target !== this)
                return;

            window.location.href = `${window.location.origin}/login.html`
        })
    }


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
        ${ followed ? 
            `<button type="button" class="btn-secondary hover:border-red-400 hover:text-red-400 hover:after:content-['Unfollow'] after:content-['Following']"></button>`
            :
            `<button type="button" class="btn-primary after:content-['Follow']"></button>`
        }`;
    
    searchResult.innerHTML = template;
    searchResult.addEventListener("click", function (e) {

        window.location.href = `${window.location.origin}/profile.html?id=${user.id}`;
    })
    return searchResult;
}

const searchForPeople = () => {
    const expectedUsername = <HTMLInputElement>document.getElementById("find")!;

    fetch_api(
        "/users?search="+expectedUsername.value,
        "GET",
    )
    .then(res => res.json())
    .then(async (users) => {
        const wrapperForInsertion = <HTMLDivElement>document.getElementById('insertionWrapper')!;          

        
        document.querySelectorAll(".searchResult")
        .forEach(el => el.remove());
        
        const sortedUsers = users.sort((user1: User, user2: User) => user1.username.length - user2.username.length);
        const follow_map = await checkIfUserIsFollowed(token, sortedUsers.map((user: User) => user.id));

        sortedUsers.forEach((user: User) => {

            let followed = follow_map.get(user.id)!;

            let searchResult = constructElement(user, followed);
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


