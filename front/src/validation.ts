export const validatePassword = (input: string) => {

    if (input = "") {

        return "Pole wymagane"

    } else {

        let errors = ""

        errors += input.length > 8?
        "" : "<br>- Pryznajmniej 8 liter"
    
        errors += input.match(/\d/g)?
        "" : "<br>- Pryznajmniej jedna cyfra" 
    
        errors += !input.match(/[^\d\w]/g)?
        "" : "<br>- Niedozwolone są znaki specialne" 
    
        errors += input.match(/[A-Z]/g) && input.match(/[a-z]/g)?
        "" : "<br>- Pryznajmniej jedna wielka i mała litera"
    
        return errors != ""? `Twoje hasło nie spełnia następujących zasad:${errors}`:""

    }

}

export const validateLogin = (input: string) => {

    if (input = "") {

        return "Pole wymagane"

    } else {

        let errors = ""

        errors += input.length > 8?
        "" : "<br>- Pryznajmniej 4 litery"
    
        errors += !input.match(/[^\d\w]/g)?
        "" : "<br>- Niedozwolone są znaki specialne" 
    
        return errors != ""? `Twój login nie spełnia następujących zasad:${errors}`:""

    }

}