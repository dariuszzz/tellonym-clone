export const validatePassword = (input: string) => {

    let errors = ""

    errors += input.length > 8?
    "<br>- Pryznajmniej 8 liter" : ""

    errors += input.match(/\d/g)?
    "<br>- Pryznajmniej jedna cyfra" : ""

    errors += input.match(/[A-Z]/g) || input.match(/[a-z]/g)?
    "<br>- Pryznajmniej jedna wielka i mała litera" : ""

    return errors != ""? `Twoje hasło nie spełnia następujących zasad:${errors}`:""

}

export const validateLogin = (input: string) => {

    let errors = ""

    errors += input.length > 8?
    "<br>- Pryznajmniej 4 litery" : ""

    return errors != ""? `Twój login nie spełnia następujących zasad:${errors}`:""

}