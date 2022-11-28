// UWAGA // UWAGA // UWAGA // cały ten plik to horror ponad ludzką komprehencję

export const postLikeUpdate = (postNumber:number, question: boolean, like: boolean) => { // nazwa do zmienienia nie wytrzymam
    
    const questionShort = question? "q": "a"

    // przepraszam (liczba lików jest w <p>x</p>)
    const likeParagraph = document.getElementById(`${questionShort}Likes${postNumber}`)

    if (likeParagraph) {

        const currentState = () => {
            let state = likeParagraph.getAttribute('name')
            if (state) {
                return parseInt(state)
            } else {
                return 0
            }
        }
    
        // Jeśli przycisk jest już wciśnięty to odciska przyciski
        const changedState = (like? 1:-1) == currentState()? 0 : (like? 1:-1)
    
        likeParagraph.innerHTML = parseInt(likeParagraph.innerHTML) - currentState() + changedState + ""
        likeParagraph.setAttribute('name',changedState +"")
    
        const grayOutButton = (gray: boolean, like: boolean) => {
            document.getElementById(`${questionShort}${like?"L":"Disl"}ikeButton${postNumber}`)
                ?.getElementsByTagName('svg')[0]
                ?.setAttribute('fill',gray?"grey":"currentColor")
    
        }   
    
        switch(changedState){

            case 1:
                grayOutButton(false,true)
                grayOutButton(true,false)
                break
            
            case 0:
                grayOutButton(false,true)
                grayOutButton(false,false)
                break
            
            case -1:
                grayOutButton(true,true)
                grayOutButton(false,false)
                break          

        }

        const onLike = () => {

        }
        if (changedState == 1) {onLike()}
    
        const onDislike = () => {

        }
        if (changedState == -1) {onDislike()}

    }

}

export const constructPost = (targetElementId:string, question:string, answer:string, qName:string, aName:string, qLikes:number, aLikes:number, qDate:string, aDate:string) => {

    const container = <HTMLElement>document.getElementById(targetElementId)
    const postCount = container.childNodes.length

    if (postCount == 1) {
        let emptyFeedContainer = document.getElementById('empty-feed')
        if (emptyFeedContainer) {
            emptyFeedContainer.style.opacity = "0";
        }
        
    }

    const appendMagic = (html:string, target:HTMLElement) => {
        var template = document.createElement('template');
        html = html.trim(); 
        template.innerHTML = html;
        if (template.content.firstChild) { // nulln't
            target.append(template.content.firstChild)
        }
    }
 
    // notatka dla siebie w przyszłosci - zformatuj ten html, bo jest nie czytelne
    const questionUI = () => `
    
        <div id="questionAndResponses" class="flex flex-col mt-10 w-full md:w-3/4 xl:w-1/2 2xl:w-2/5 bg-slate-300 rounded-md py-2">
            <div id="elementPlacer" class="flex flex-row justify-between w-full px-4">
                <div id="sender">${qName}</div>
                <div id="postDate">${qDate}</div>
            </div>
            <div id="elementPlacer" class="flex flex-row justify-between w-full mt-3 pl-4">
            <div id="postContent" class="w-5/6">${question}</div>
            <div id="rating" class="w-1/6 text-right flex flex-col items-center justify-center">
                <button id="qLikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    <svg aria-hidden="true" class="w-8 h-8 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                </button>
                <p id="qLikes${postCount}" name="0">${qLikes}</p>
                <button id="qDislikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group">
                    <svg aria-hidden="true" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"></path></svg>
                </button>
                
            </div>
        </div>
        <div id="responses" class="my-5 pl-14">
            <div id="elementPlacer" class="flex flex-row justify-between w-full px-4">
            <div id="sender">${aName}</div>
            <div id="postDate">${aDate}</div>
            </div>
            <div id="elementPlacer" class="flex flex-row justify-between w-full mt-3 pl-4">
            <div id="postContent" class="w-5/6">${answer}</div>
            <div id="rating" class="w-1/6 text-right flex flex-col items-center justify-center">
                <button id="aLikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    <svg aria-hidden="true" class="w-8 h-8 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                </button>
                <p id="aLikes${postCount}" name="0"">${aLikes}</p>
                <button id="aDislikeButton${postCount}" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group">
                    <svg aria-hidden="true" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"></path></svg>
                </button>
                
            </div>
            </div>
        </div>
        </div>
    
    `

    appendMagic(questionUI(),container)

    document.getElementById(`qLikeButton${postCount}`)   ?.addEventListener('click',() => {postLikeUpdate(postCount,true, true)})
    document.getElementById(`qDislikeButton${postCount}`)?.addEventListener('click',() => {postLikeUpdate(postCount,true, false)})
    document.getElementById(`aLikeButton${postCount}`)   ?.addEventListener('click',() => {postLikeUpdate(postCount,false,true)})
    document.getElementById(`aDislikeButton${postCount}`)?.addEventListener('click',() => {postLikeUpdate(postCount,false,false)})


}

