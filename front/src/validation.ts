export const validatePassword = (input: string) => {

    if (input == "") {

        return "Password field empty"

    } else {
        console.log(input);
        let errors = ""

        errors += input.length > 8?
        "" : "\nAt least 8 characters"
    
        errors += input.match(/\d/g)?
        "" : "\nAt least 1 number" 
    
        errors += input.match(/[A-Z]/g) && input.match(/[a-z]/g)?
        "" : "\nAt least one big and one small letter"
    
        return errors != ""? `Your password does not follow these requierments: ${errors}`:""

    }

}

export const validateLogin = (input: string) => {

        let errors = "";

        if (input == "") {

            return "Login field empty"
    
        } else {

        if(input.length <= 4){
            errors+= "\nat least 4 characters";
        }
        
        errors += !input.match(/[^\d\w]/g) ? "" : "\nSpecial characters forbidden";
    
        return errors != ""? `Your login does not follow :${errors}`:"";
    }
}