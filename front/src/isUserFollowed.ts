import { fetch_api } from "./utils";
import { User} from './types';

export const checkIfUserIsFollowed  =  async (userID: number, profile_IDs : number[]) => {
    
    let followedUsers = new Map<number, boolean>();

    const followersList = await fetch_api(
        `/users/${userID}/follows`,
        "GET",
    )
    .then(res => res.json())
    .catch(console.error);
    const getFollowedId = (followersList : User[]) => followersList.map(follow => follow.id);
    const followerIds = getFollowedId(followersList);
    const followedIds = profile_IDs.filter(id => followerIds.includes(id));

    profile_IDs.forEach(id =>{
        followedUsers.set(id, followedIds.includes(id));
    })

    return followedUsers;
    
}