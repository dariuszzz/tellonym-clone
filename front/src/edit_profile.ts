import "./index.css"
import { AccessToken } from "./types";
import { edit_profile_data } from "./utils";

const token = new AccessToken();

const edit_profile_form = <HTMLFormElement>document.getElementById('editProfileForm')!;

edit_profile_form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(edit_profile_form);
    console.log(formData)
    await edit_profile_data(token, formData);
}
