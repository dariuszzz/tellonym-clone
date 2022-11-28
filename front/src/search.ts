import "./index.css";
import { checkIfUserIsFollowed } from "./isUserFollowed";
import {AccessToken, User, UserWithLikes} from './types';
import { fetch_api, follow_user } from "./utils";


const token = new AccessToken();

const searchButton = document.getElementById('search')!;

const my_user: UserWithLikes = await fetch_api(
    "/me",
    "GET",
    undefined,
    token
).then(res => res.json())

searchButton.onclick = (e) => {
    e.preventDefault();

    searchForPeople();
}

const constructElement = (user: User, followed: boolean) => {
    const searchResult = document.createElement("div");
    searchResult.classList.add("searchResult", "flex", "flex-row", "cursor-pointer", "bg-slate-100", "hover:bg-blue-100", "w-full", "items-center", "justify-between", "h-28", "p-2", "px-5", "rounded-md");

    const followButton = document.createElement("button");

    const unfollow_styles = "btn-secondary hover:border-red-400 hover:text-red-400 hover:after:content-['Unfollow'] after:content-['Following']";
    const follow_styles = "btn-primary after:content-['Follow']";

    const btn_function = function (this: HTMLButtonElement, ev: MouseEvent) {
        follow_user(user.id, token);
        this.classList.value = this.classList.value == follow_styles ? unfollow_styles : follow_styles;
    }

    if (followed === true) {
        followButton.classList.value = unfollow_styles;
        followButton.addEventListener("click", btn_function)
    } else if (followed === false) {
        followButton.classList.value = follow_styles;
        followButton.addEventListener("click", btn_function)
    } else {
        followButton.classList.add("btn-primary", "after:content-['Follow']");
        followButton.setAttribute("disabled", "true");
        followButton.addEventListener("click",  function () {
            window.location.href = `${window.location.origin}/login.html`
        })
    }

    const template = `
        <div class="flex flex-row items-center gap-2 w-full h-full pointer-events-none">
            <div class="rounded-full overflow-hidden h-4/5 aspect-square pointer-events-none">
                <img class="object-scale-down" src="http://127.0.0.1:8000/pfps/${user.id}.jpg">
            </div>
            <div class="flex flex-col justify-between pointer-events-none">
                <p><b>${user.username}</b></p>
                <p>${user.bio}</p>
            </div>
        </div>
        `;
    
    searchResult.innerHTML = template;
    searchResult.appendChild(followButton);

    searchResult.addEventListener("click", function (e) {
        if (e.target !== this)
            return;

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
        const follow_map = await checkIfUserIsFollowed(my_user.user.id, sortedUsers.map((user: User) => user.id));

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


