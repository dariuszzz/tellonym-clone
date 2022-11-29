import './index.css'
import { checkIfUserIsFollowed } from "./isUserFollowed";
import { AccessToken, AskData, User, UserWithLikes, QuestionWithAnswer } from "./types";
import { fetch_api, SERVER_URL, follow_user, ask_question, getUserQuestions, constructPost, answerQuestion } from "./utils";
//import { fetch_api } from './utils';

const token = new AccessToken();

const url_params = new URLSearchParams(window.location.search);
const profile = url_params.get("id");
let profile_id: number | undefined = profile ? parseInt(profile) : undefined;

const profileButton = document.getElementById("importantProfileButton")!;


const sortTypes = <NodeListOf<HTMLInputElement>>document.querySelectorAll('input[name="sort"]')!;
sortTypes.forEach(el => el.onchange = async () => {
    await showTellsOnProfile();
});


const my_user: UserWithLikes | undefined = await fetch_api(
    "/me",
    "GET",
    undefined,
    token
).then(res => res.json())
.catch(_ => undefined)

// Profil innego usera (zalogowany lub nie)
if (profile_id && (profile_id != my_user?.user.id)) {
    const unfollow_styles = "btn-secondary hover:border-red-400 hover:text-red-400 hover:after:content-['Unfollow'] after:content-['Following']";
    const follow_styles = "btn-primary after:content-['Follow']";
    
    const btn_function = async (_: MouseEvent) => {            
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

        const askButton = document.getElementById('askButton');
        const isAnonymous = <HTMLInputElement>document.getElementById('anonymousInput');
        const questionBody = <HTMLInputElement>document.getElementById('questionBody');
        
        
        if(askButton != null){
            askButton.onclick = async () => {
                const question : AskData = {
                    anonymous : isAnonymous.checked,
                    content : questionBody.value,
                };
                questionBody.innerHTML = "";
                await ask_question(question, profile_id!, token);
                await getAndSetUserData();
                await showTellsOnProfile();
            }   
        }
    } else {
        document.querySelector("#askQuestion")?.remove();

        profileButton.classList.value = follow_styles + " disabled";
        profileButton.onclick = () => {
            window.location.href = `${window.location.origin}/login.html`
        }
    }

} else if (my_user) { //Profil zalogowanego usera
    document.querySelector("#askQuestion")?.remove();

    profile_id = my_user.user.id;

    profileButton.classList.value = "btn-primary after:content-['Edit_profile']";
    profileButton.onclick = () => {
        window.location.href = `${window.location.origin}/edit_profile.html`
    }

    
} else { //niezalogowany profil usera
    
    window.location.href = `${window.location.origin}/login.html`
}
    

export const getAndSetUserData = async () => {
    
    const user: User = await fetch_api(
        `/users/${profile_id}`,
        "GET",
        ).then(res => res.json())
        .catch(() => console.error());
        
    

        const profile_pic = <HTMLImageElement>document.getElementById("profilepic");
        if (profile_pic) {
            profile_pic.src = `${SERVER_URL}/pfps/${user.id}.png`
        }
        
        const tellCount = await fetch_api(
            `/users/${profile_id}/questions`,
            "GET",
            ).then(res => res.json())
             .then(res => res.length)
             .catch(console.error);
        
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
const showTellsOnProfile = async () => {
    if(profile_id != undefined){
        let questions : QuestionWithAnswer[] = await getUserQuestions(profile_id);
        questions = questions.sort((qa1, qa2) => new Date(qa2.question.asked_at).getTime() - new Date(qa1.question.asked_at).getTime())

        //sort by likes if checked
        if (sortTypes[0].checked) {
            questions = questions.sort((qa1, qa2) => qa2.question.likes - qa1.question.likes)
        }

        const postsHere = document.getElementById('postsHere')!;
        postsHere.innerHTML = "";

        questions.forEach(async question => {

            const postElement = await constructPost(question, profile_id!);

            if (profile_id == my_user?.user.id) {
                    // el.
                    const btn = document.createElement("button");
                    btn.classList.value = "inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group p-5";
                    btn.innerHTML = question.answer ? `Edit answer` : `Answer`;
                
                    btn.onclick = () => {
                        const answerBoxDiv = document.createElement("div");
                        answerBoxDiv.classList.value = "answerBox flex flex-row justify-between items-center p-5 gap-2";
                        answerBoxDiv.innerHTML = `
                            <textarea class="p-2 h-14 border-2 border-blue-500 rounded-md resize-none w-full"> </textarea>
                            `
                
                        const askButton = document.createElement("button");
                        askButton.classList.value = "h-8 w-14 bg-blue-500 hover:bg-blue-700 text-white px-2 rounded-full text-sm";
                        askButton.innerHTML = "Submit";
                
                        askButton.onclick = async () => { 
                            await answerQuestion(question.question.id, token, { content: answerBoxDiv.getElementsByTagName("textarea")[0].value })
                            await showTellsOnProfile();
                        };
                
                        answerBoxDiv.appendChild(askButton);

                        const answerBoxEls = document.querySelectorAll(".answerBox");
                
                        const currentlyOpen = postElement.querySelectorAll(".answerBox").length > 0 ? true : false; 
                
                        answerBoxEls.forEach(el => el.remove())
                            
                        if (!currentlyOpen) {
                            postElement.appendChild(answerBoxDiv)
                        }
                
                    }
                
                    postElement.appendChild(btn) 
                }     

            postsHere.appendChild(postElement);
        });

        
        // console.log(profile_id, my_user?.user.id?)



    }
}

await getAndSetUserData();
await showTellsOnProfile();

/*

token, async (answerBoxDiv: HTMLDivElement) => {
                    const textarea = <HTMLTextAreaElement>answerBoxDiv.getElementsByTagName("textarea")[0]!;
    
                    if (textarea && textarea.value.length > 0) {
                        await answerQuestion(question.question.id, token, { content: textarea.value });
                    }
    
                    answerBoxDiv.remove()
                });

if (self_id && self_id == question.question.asked_id) {
    const btn = document.createElement("button");
    btn.classList.value = "inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group";
    btn.innerHTML = `Answer`;

    btn.onclick = () => {
        const answerBoxDiv = document.createElement("div");
        answerBoxDiv.classList.value = "answerBox";
        answerBoxDiv.innerHTML = `
            <textarea id="questionBody" class="p-2 h-14 border-2 border-blue-500 rounded-md resize-none"> </textarea>
            <div id="buttons" class="flex flex-row gap-5 justify-between">
            <label class="flex relative items-center cursor-pointer">
                <input type="checkbox" id="anonymousInput" value="" checked="true" class="sr-only peer">
                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-slate-900">Anonymous post</span>
            </label>
          `

        const askButton = document.createElement("button");
        askButton.classList.value = "h-8 w-14 bg-blue-500 hover:bg-blue-700 text-white px-2 rounded-full text-sm";
        askButton.innerHTML = "Ask";

        askButton.onclick = fn(answerBoxDiv);

        const answerBoxEls = document.querySelectorAll(".answerBox");

        const currentlyOpen = qnaDiv.querySelectorAll(".answerBox").length > 0 ? true : false; 

        answerBoxEls.forEach(el => el.remove())
            
        if (!currentlyOpen) {
            qnaDiv.appendChild(answerBoxDiv)
        }

    }

    qnaDiv.append(btn)      
} 
*/