import { useSession } from "next-auth/react"
import ProfileImage from "./ProfileImage"
import Button from "./Button"
import { FormEvent, useCallback, useLayoutEffect, useRef, useState } from "react";
import { api } from "~/utils/api";


function updateTextAreaHeight(textArea?: HTMLTextAreaElement){
    if (textArea == null) return
    textArea.style.height = "0"
    textArea.style.height = `${textArea.scrollHeight}px`

}



//tweet form
export default function NewTweetForm(){
    const session = useSession();
    if (session.status !== "authenticated") return;
    return <Form />;
}

function Form(){
    const session = useSession();
    const [inputValue, setInputValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>();

    const inputRef = useCallback((textArea:HTMLTextAreaElement)=>{
        updateTextAreaHeight(textArea);
        textAreaRef.current = textArea;
    },[]);

    //use context
    const trpcUtils = api.useContext();

    useLayoutEffect(()=>{
        updateTextAreaHeight(textAreaRef.current)
    },[inputValue]);

    

    //tweet api call
    const createTweet = api.tweet.create.useMutation({
        onSuccess:(newTweet)=>{
            setInputValue("");
            if(session.status !== "authenticated") return
            //fetch changes -- new tweet
            trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) =>{
                if (oldData == null || oldData.pages[0] == null) return
                const newCacheTweet ={
                    ...newTweet,
                    likeCount:0,
                    likedByMe:false,
                    user:{
                        id: session.data.user.id,
                        name:session.data.user.name || null,
                        image:session.data.user.image || null,
                    }
                }
                return{
                    ...oldData,
                    pages: [
                        {
                            ...oldData.pages[0],
                            tweets:[newCacheTweet, ...oldData.pages[0].tweets],
                        },
                        ...oldData.pages.slice(1),
                    ]
                }
            })

        }
    });

    //handle submit
    function handleSubmit (e:FormEvent) {
        e.preventDefault();
         inputValue.length < 2 ? null: createTweet.mutate({content: inputValue})

    }

    //if user is not loggedIn then return null
    if (session.status !== "authenticated") return null;
    //if user is loggedIn
    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b px-4 py-2">
            <div className="flex gap-4">
                <ProfileImage src={session.data.user.image} />
                <textarea 
                ref={inputRef}
                style={{height: 0}}
                value={inputValue}
                onChange={(e)=>setInputValue(e.target.value)}
                className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none" 
                placeholder="what's happening?"/>
                </div>
                <Button className="self-end" >Tweet</Button>
        </form>
    )

}