import "./index.css"
import { AccessToken, UserWithLikes } from "./types";
import { edit_profile_data, fetch_api } from "./utils";

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


const edit_profile_form = <HTMLFormElement>document.getElementById('editProfileForm')!;

edit_profile_form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(edit_profile_form);
    console.log(formData)
    await edit_profile_data(token, formData);
}
