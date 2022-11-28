import './index.css'
import { AccessToken } from "./types";
//import { fetch_api } from './utils';
import { getAndSetUserData } from './profile';

const token = new AccessToken();

const url_params = new URLSearchParams(window.location.search);
const profile = url_params.get("id");

const profile_id: number | undefined  = profile ? parseInt(profile) : undefined;

await getAndSetUserData(token, profile_id);