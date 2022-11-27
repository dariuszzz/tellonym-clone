export const constructPost = (targetElementId:string, question:string, answer:string, qName:string, aName:string, qLikes:number, aLikes:number, qDate:string, aDate:string) => {

    const container = <HTMLElement>document.getElementById(targetElementId)

    const appendMagic = (html:string, target:HTMLElement) => {
        var template = document.createElement('template');
        html = html.trim(); 
        template.innerHTML = html;
        if (template.content.firstChild) { // nulln't
            target.append(template.content.firstChild)
        }
        
    }

    // notatka dla siebie w przyszłosci - zformatuj ten html, bo jest nie czytelne
    const questionUI = (question:string) => `
    
        <div id="questionAndResponses" class="flex flex-col mt-10 w-full md:w-3/4 xl:w-1/2 2xl:w-2/5 bg-slate-300 rounded-md py-2">
            <div id="elementPlacer" class="flex flex-row justify-between w-full px-4">
                <div id="sender">${qName}</div>
                <div id="postDate">${qDate}</div>
            </div>
            <div id="elementPlacer" class="flex flex-row justify-between w-full mt-3 pl-4">
            <div id="postContent" class="w-5/6">${question}</div>
            <div id="rating" class="w-1/6 text-right flex flex-col items-center justify-center">
                <a href="#" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    <svg aria-hidden="true" class="w-8 h-8 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                </a>
                0
                <a href="#" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group">
                    <svg aria-hidden="true" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"></path></svg>
                </a>
                
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
                <a href="#" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    <svg aria-hidden="true" class="w-8 h-8 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                </a>
                0
                <a href="#" class="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group">
                    <svg aria-hidden="true" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"></path></svg>
                </a>
                
            </div>
            </div>
        </div>
        </div>
    
    `
        
    appendMagic(questionUI(question),container)
    
}

