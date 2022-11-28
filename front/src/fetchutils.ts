// funkcja raczej nie działa, naprawie ją gdy będę mógł odpalić serwer
export async function register(url:string, username: string, password: string) {
    const response = await fetch(`${url}/register`, {
       method: "POST", 
        headers: {"Content-Type": 'aplication/json'},
        body: JSON.stringify({"username":username,"password":password})
    })
    return response.json()
}