import "./index.css"
import { AccessToken, UserWithLikes } from "./types";
import { edit_profile_data, fetch_api, SERVER_URL } from "./utils";
import { validateLogin, validatePassword } from "./validation";

const token = new AccessToken();

const my_user: UserWithLikes | undefined = await fetch_api(
    "/me",
    "GET",
    undefined,
    token
).then(res => res.json())
.catch(err => undefined)

//redirect na login jak nie ma usera
if (!my_user) window.location.href = `${window.location.origin}/login.html`

const pfp_preview = <HTMLImageElement>document.getElementById("pfpPreview")!;
pfp_preview.src = `${SERVER_URL}/pfps/${my_user?.user.id}.png`;

const pfp_input = <HTMLInputElement>document.getElementById("pfpInput")!;

pfp_input.addEventListener("change", function () {
    if (this.files?.[0]) {
        const url = URL.createObjectURL(this.files[0]);
        pfp_preview.src = url;
    }
});

const edit_profile_form = <HTMLFormElement>document.getElementById('editProfileForm')!;


edit_profile_form.onsubmit = async (e) => {
    
    e.preventDefault();
    const loginInput = <HTMLInputElement>document.getElementById('username')!;
    const passwordInput = <HTMLInputElement>document.getElementById('new_password')!;
    console.log(loginInput.value, passwordInput.value);
    const username = loginInput.value;
    const password = passwordInput.value;
    if(loginInput.value != ""){
        const loginCheck = validateLogin(username);
        if (loginCheck != "") {
            alert(loginCheck);
            return;
        } 
    }
    if(passwordInput.value != ""){
        const registerCheck = validatePassword(password);   
            if (registerCheck != "") {
                alert(registerCheck);
                return;
            } 
    }
    
    const formData = new FormData(edit_profile_form);
    console.log(formData);
    await edit_profile_data(token, formData);

    window.location.href = `${window.location.origin}/profile.html`;
}


