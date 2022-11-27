
export class AccessToken { 
    token: string = "";

    //taki maly hack zeby typescript passowal to by reference
    _marker: number = 0;
};

export type Question = {
    id: number,
    content: string,
    likes: number,
    asked_id: number,
    asker_id: number | undefined,
    asked_at: string //Date
};

export type Answer = {
    id: number,
    question_id: number,
    content: string,
    likes: number,
    answered_at: string, //Date
    last_edit_at: string, //Date
};

export type QuestionWithAnswer = {
    question: Question,
    answer: Answer | null
}

export type User = {
    id: number,
    username: string,
    follower_count: number,
    following_count: number,
    bio: string,
};

export type Like = {
    liker_id: number,
    like_type: "QuestionLike" | "QuestionDislike" | "AnswerLike" | "AnswerDislike",
    resource_id: number,
};

export type UserWithLikes = {
    user: User,
    likes: Like[]
};
