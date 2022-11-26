
export class AccessToken { 
    token: string = "";

    //taki maly hack zeby typescript passowal to by reference
    _marker: number = 0;
};