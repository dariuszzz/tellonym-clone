import { AccessToken, AnswerData, AskData, LoginData, QuestionWithAnswer, VoteData } from "./types";
import { validateLogin, validatePassword } from "./validation";


export const SERVER_URL = "http://127.0.0.1:8000";

type ApiInputJSONs = LoginData | AskData | AnswerData | VoteData;

//Doesnt try to refresh token after an unauthorized request
export const fetch_api_raw = async (
    route: string, 
    method: "POST" | "GET", 
    json: ApiInputJSONs | undefined = undefined,
    access_token: AccessToken | undefined = undefined,
): Promise<Response> => fetch(`${SERVER_URL}${route}`, {
    ...(json && { body: JSON.stringify(json) }),
    headers: {
        ...(json && { "Content-Type": "application/json" }),
        ...(access_token && { "Authorization": `Bearer: ${access_token.token}` }),
    },
    credentials: "include",
    method: method,
});

//Fetch wrapper which automatically tries to refresh the access token on unauthorized requests
export const fetch_api = async (
    route: string, 
    method: "POST" | "GET", 
    json: ApiInputJSONs | undefined = undefined,
    access_token: AccessToken | undefined = undefined, 
): Promise<Response> => {
    let result = await fetch_api_raw(route, method, json, access_token);

    //Only if unauthorized (no token) and the token was passed in
    if (result.status == 401 && access_token) {
        let refresh_res = await fetch_api_raw("/refresh", "POST")
    
        if (refresh_res.status == 401) {
            return new Promise((_, rej) => rej("Need to log in"));
        }

        access_token.token = await refresh_res.text();
        
        return await fetch_api_raw(route, method, json, access_token);

    }

    return result;
}

export const edit_profile_data = async (access_token: AccessToken, form_data: FormData) => {


    let result = await fetch(`${SERVER_URL}/editprofile`, {
        body: form_data,
        headers: {            
            "Authorization": `Bearer: ${access_token.token}`,
        },
        credentials: "include",
        method: "POST",
    });

    if (result.status == 401 && access_token) {
        
        let refresh_res = await fetch_api_raw("/refresh", "POST")
        
        if (refresh_res.status == 401) {
            return new Error("Not logged in");
        }

        access_token.token = await refresh_res.text();
        
        return await  fetch(`${SERVER_URL}/editprofile`, {
            body: form_data,
            headers: {            
                "Authorization": `Bearer: ${access_token.token}`,
            },
            credentials: "include",
            method: "POST",
        });
    }

    return result;
}

export const log_in = async (username: string, password: string, token: AccessToken) => {
    //login user example
    await fetch_api(
        "/login", 
        "POST", 
        { username, password },
    )
    .then(res => res.text())
    .then(res => token.token = res)
    .catch(() => console.error("Problem with logging in"))
    
    window.location.href = `${window.location.origin}/profile.html`;
}

export const registerUser = async (username: string, password: string, token: AccessToken) => {
    await fetch_api(
        "/register", 
        "POST", 
        { username, password },
    )
    .then(res => res.text())
    .then(res => token.token = res)
    .catch(() => console.error("Problem with registering")) ?? "";
    
    window.location.href = `${window.location.origin}/profile.html`;
}

export const follow_user = async (user_id: number, token: AccessToken) => {
    await fetch_api(
        `/users/${user_id}/follow`,
        "POST",
        undefined,
        token,
    )
    .catch(console.error);
}

export const ask_question = async ( question : AskData, user_id : number, token: AccessToken) => {
    await fetch_api(
        `/users/${user_id}/ask`,
        "POST",
        question,
        token,
    )
    .catch(console.error);
}

export const getUserQuestions = async (user_id: number) => {
    let questions : QuestionWithAnswer[] = await fetch_api(
        `/users/${user_id}/questions`,
        "GET",
        ).then(res => res.json())
        .catch(console.error);;
    
        return questions;     
}

const answerQuestion = async (question_id: number, token: AccessToken, answer : AnswerData) =>{
         await fetch_api(
        `/questions/${question_id}/answer`,
        "POST",
        answer,
        token,
        ).then(res => res.json())
        .catch(console.error);
       
}


const getUsername = async (id: number) => {    
    let username = await fetch_api(
        `/users/${id}`,
        "GET",
        ).then(res => res.json())
        .then(res => res.username)
        .catch(console.error);        
        return username;
    }




export const constructPost = async (question : QuestionWithAnswer, postCount : number, profileID : number) => {
    
    const senderName = question.question.asker_id ? await getUsername(question.question.asker_id) : "Anonymous";

    let questionDate = new Date(question.question.asked_at).toLocaleString();
    let template;

    if(question.answer) {
        const answerDate = new Date(question.answer.answered_at).toLocaleString();
        const askerUsername = await getUsername(profileID);

        template = `
        <div id="questionAndResponses" class="flex flex-col w-full bg-slate-300 rounded-md py-2">
        <div id="elementPlacer" class="flex flex-row justify-between w-full px-4">
            <div id="sender">${senderName}</div>
            <div id="postDate">${questionDate}</div>
        </div>
        <div id="elementPlacer" class="flex flex-row justify-between w-full mt-3 pl-4">
        <div id="postContent" class="w-5/6">${question.question.content}</div>
        <div id="rating" class="w-1/6 text-right flex flex-col items-center justify-center">
            <button id="qLikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                <svg aria-hidden="true" class="w-8 h-8 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
            </button>
            <p id="qLikes${postCount}" name="0">${question.question.likes}</p>
            <button id="qDislikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group">
                <svg aria-hidden="true" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"></path></svg>
            </button>
            
        </div>
    </div>
    <div id="responses" class="my-5 pl-14">
            <div id="elementPlacer" class="flex flex-row justify-between w-full px-4">
            <div id="sender">${askerUsername}</div>
            <div id="postDate">${answerDate}</div>
            </div>
            <div id="elementPlacer" class="flex flex-row justify-between w-full mt-3 pl-4">
            <div id="postContent" class="w-5/6">${question.answer.content}</div>
            <div id="rating" class="w-1/6 text-right flex flex-col items-center justify-center">
                <button id="aLikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    <svg aria-hidden="true" class="w-8 h-8 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                </button>
                <p id="aLikes${postCount}" name="0"">${question.answer.likes}</p>
                <button id="aDislikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group">
                    <svg aria-hidden="true" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"></path></svg>
                </button>
                
            </div>
            </div>
        </div>
        </div>`

    }
    else{
        template = `<div id="questionAndResponses" class="flex flex-col w-full bg-slate-300 rounded-md py-2">
    <div id="elementPlacer" class="flex flex-row justify-between w-full px-4">
        <div id="sender">${senderName}</div>
        <div id="postDate">${questionDate}</div>
    </div>
    <div id="elementPlacer" class="flex flex-row justify-between w-full mt-3 pl-4">
    <div id="postContent" class="w-5/6">${question.question.content}</div>
    <div id="rating" class="w-1/6 text-right flex flex-col items-center justify-center">
        <button id="qLikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
            <svg aria-hidden="true" class="w-8 h-8 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
        </button>
        <p id="qLikes${postCount}" name="0">${question.question.likes}</p>
        <button id="qDislikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group">
            <svg aria-hidden="true" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"></path></svg>
        </button>
       
    </div>
</div>
<div id="answerQuestion" class="flex flex-col gap-2 md:w-2/3 w-4/5 pl-6">
<textarea id="questionBody" class="p-2 h-14 border-2 border-blue-500 rounded-md resize-none"> </textarea>
<div id="buttons" class="flex flex-row gap-5 justify-between">
  <button type="button" id="askButton" class="h-8 w-16 bg-blue-500 hover:bg-blue-700 text-white px-2 rounded-full text-sm">Answer</button> 
</div>
</div>
</div>
</div>

`;

   
    
}
    let questionElement = document.createElement("div");
    questionElement.innerHTML = template;
    questionElement.className = "w-full";
    return questionElement;
    }


// <div id="responses" class="my-5 pl-14">
//     <div id="elementPlacer" class="flex flex-row justify-between w-full px-4">
//     <div id="sender">${aName}</div>
//     <div id="postDate">${aDate}</div>
//     </div>
//     <div id="elementPlacer" class="flex flex-row justify-between w-full mt-3 pl-4">
//     <div id="postContent" class="w-5/6">${answer}</div>
//     <div id="rating" class="w-1/6 text-right flex flex-col items-center justify-center">
//         <button id="aLikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
//             <svg aria-hidden="true" class="w-8 h-8 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
//         </button>
//         <p id="aLikes${postCount}" name="0"">${aLikes}</p>
//         <button id="aDislikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group">
//             <svg aria-hidden="true" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"></path></svg>
//         </button>
        
//     </div>
//     </div>