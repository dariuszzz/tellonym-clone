import './index.css'
import { checkIfUserIsFollowed } from "./isUserFollowed";
import { AccessToken, AskData, User, UserWithLikes, QuestionWithAnswer } from "./types";
import { fetch_api, SERVER_URL, follow_user, ask_question, getUserQuestions, constructPost } from "./utils";
//import { fetch_api } from './utils';

const token = new AccessToken();

const url_params = new URLSearchParams(window.location.search);
const profile = url_params.get("id");
let profile_id: number | undefined = profile ? parseInt(profile) : undefined;

const profileButton = document.getElementById("importantProfileButton")!;

const my_user: UserWithLikes | undefined = await fetch_api(
    "/me",
    "GET",
    undefined,
    token
).then(res => res.json())
.catch(err => undefined)

// Profil innego usera (zalogowany lub nie)
if (profile_id && (profile_id != my_user?.user.id)) {
    const unfollow_styles = "btn-secondary hover:border-red-400 hover:text-red-400 hover:after:content-['Unfollow'] after:content-['Following']";
    const follow_styles = "btn-primary after:content-['Follow']";
    
    const btn_function = async (ev: MouseEvent) => {            
        await follow_user(profile_id as number, token);
        await getAndSetUserData();
        profileButton.classList.value = profileButton.classList.value == follow_styles ? unfollow_styles : follow_styles;
    }
    
    if (my_user) {
        const follow_map = await checkIfUserIsFollowed(my_user.user.id, [profile_id]);
        const followed = follow_map.get(profile_id);
        
        if (followed === true) {
            profileButton.classList.value = unfollow_styles;
            profileButton.onclick = btn_function;
        } else if (followed === false) {
            profileButton.classList.value = follow_styles;
            profileButton.onclick = btn_function;
        }
    } else {
        profileButton.classList.value = follow_styles + " disabled";
        profileButton.onclick = () => {
            window.location.href = `${window.location.origin}/login.html`
        }
    }

    const askButton = document.getElementById('askButton');
    const isAnonymous = <HTMLInputElement>document.getElementById('anonymousInput');
    const questionBody = <HTMLInputElement>document.getElementById('questionBody');
    
    
     if(askButton != null){
        askButton.onclick = async () => {
            const question : AskData = {
                anonymous : isAnonymous.checked,
                content : questionBody.value,
            };
            if(profile_id != undefined){
                await ask_question(question, profile_id, token);
                await getAndSetUserData();
                questionBody.value = "";
            }
        }   
    }
    

} else if (my_user) { //Profil zalogowanego usera
    profile_id = my_user.user.id;

    profileButton.classList.value = "btn-primary after:content-['Edit_profile']";
    profileButton.onclick = () => {
        window.location.href = `${window.location.origin}/edit_profile.html`
    }

    
} else { //niezalogowany profil usera
    window.location.href = `${window.location.origin}/login.html`
}
    

const getAndSetUserData = async () => {
    
    const user: User = await fetch_api(
        `/users/${profile_id}`,
        "GET",
        ).then(res => res.json())
        .catch(console.error);
    
    const tellCount = await fetch_api(
        `/users/${profile_id}/questions`,
        "GET",
        ).then(res => res.json())
         .then(res => res.length)
        .catch(console.error);
        
        
    const profile_pic = <HTMLImageElement>document.getElementById("profilepic");
    if (profile_pic) {
        profile_pic.src = `${SERVER_URL}/pfps/${user.id}.png`
    }
            
    const nickname = user.username;
    const follower_count = user.follower_count;
    const following_count = user.following_count;
    const finalStats : string = `${follower_count} followers | ${tellCount} tells | ${following_count} following`;
    const bio : string = user.bio;
            
    const nicknameField = document.getElementById('nickname');
    const stats = document.getElementById('stats');
    const bioField = document.getElementById('bio');

    if(nicknameField != null && stats != null && bioField != null){
        nicknameField.innerHTML = nickname;
        stats.innerHTML = finalStats;
        bioField.innerHTML = bio;
    }
}



//set userdata on load
if(profile_id != undefined){
    const questions : QuestionWithAnswer[] = await getUserQuestions(profile_id);
    const postsHere = document.getElementById('postsHere')!;
    if(questions){
        postsHere.innerHTML = "";
        let i = 0;
        questions.forEach(async question =>{
            if(profile_id != undefined){
                postsHere.appendChild(await constructPost(question, i, profile_id));
                i+=1;
            }
            
        })
    }
    
    
}

await getAndSetUserData();